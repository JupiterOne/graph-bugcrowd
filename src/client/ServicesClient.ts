import { retry } from '@lifeomic/attempt';
import nodeFetch, { Request, Response } from 'node-fetch';

import { retryableRequestError, fatalRequestError } from './error';
import { URLSearchParams } from 'url';

export interface ServicesClientInput {
  apiToken: string;
}

interface QueryParam {
  [param: string]: string | string[];
}

const BASE_URL = 'https://api.bugcrowd.com/';

/**
 * Services Api
 * https://docs.bugcrowd.com/reference
 */
export class ServicesClient {
  readonly baseUrl: string;
  readonly authHeader: { [key: string]: string };

  constructor(config: ServicesClientInput) {
    this.baseUrl = BASE_URL;
    this.authHeader = {
      Authorization: `Token ${config.apiToken}`,
      Accept: 'application/vnd.bugcrowd+json',
    };
  }

  test(): Promise<unknown> {
    return this.fetch('bounties', { offset: '0', limit: '1' });
  }

  async iterateBounties(fn: (bounty: any) => Promise<void>): Promise<void> {
    const result = await this.fetch<any>('bounties');

    for (const bounty of result.bounties) {
      await fn(bounty);
    }
  }

  async iterateBountySubmissions(
    bountyId: string,
    fn: (submission: any) => Promise<void>,
  ): Promise<void> {
    const result = await this.fetch<any>(`bounties/${bountyId}/submissions/`);

    for (const submission of result.submissions) {
      await fn(submission);
    }
  }

  fetch<T>(
    url: string,
    queryParams: QueryParam = {},
    request?: Omit<Request, 'url'>,
  ): Promise<T> {
    return retry(
      async () => {
        const qs = new URLSearchParams(queryParams).toString();
        const response = await nodeFetch(
          `${BASE_URL}${url}${qs ? '?' + qs : ''}`,
          {
            ...request,
            headers: {
              ...this.authHeader,
              ...request?.headers,
            },
          },
        );

        if (response.ok) {
          return (await response.json()) as T;
        }

        if (isRetryableRequest(response)) {
          throw retryableRequestError(response);
        } else {
          throw fatalRequestError(response);
        }
      },
      {
        maxAttempts: 10,
        delay: 200,
        factor: 2,
        jitter: true,
        handleError: (err, context) => {
          if (!err.retryable) {
            // can't retry this? just abort
            context.abort();
          }
        },
      },
    );
  }
}

/**
 * Function for determining if a request is retryable
 * based on the returned status.
 */
function isRetryableRequest({ status }: Response): boolean {
  return (
    // 5xx error from provider (their fault, might be retryable)
    // 429 === too many requests, we got rate limited so safe to try again
    status >= 500 || status === 429
  );
}
