import { retry } from '@lifeomic/attempt';
import nodeFetch, { Response } from 'node-fetch';

import { retryableRequestError, fatalRequestError } from './error';
import { URLSearchParams, URL } from 'url';
import { Bounty, BountySubmission } from '../types';

export interface ServicesClientInput {
  apiToken: string;
}

interface BugcrowdPaginationQueryParams {
  offset?: string;
  limit?: string;
}

interface BugcrowdResponsePagination {
  offset: number;
  limit?: number;
  count: number;
  total_hits: number;
}

interface BugcrowdResponseBase {
  meta: BugcrowdResponsePagination;
}

const BASE_URL = 'https://api.bugcrowd.com/';

/**
 * Services Api
 * https://docs.bugcrowd.com/reference
 */
export class ServicesClient {
  readonly authHeader: { [key: string]: string };

  constructor(config: ServicesClientInput) {
    this.authHeader = {
      Authorization: `Token ${config.apiToken}`,
      Accept: 'application/vnd.bugcrowd+json',
    };
  }

  test(): Promise<unknown> {
    return this.fetch('bounties', { offset: '0', limit: '1' });
  }

  async iterateBounties(
    fn: (bounty: any) => Promise<void>,
    options?: { limit?: number },
  ): Promise<void> {
    const limit = options?.limit?.toString() || undefined;
    let offset: string | undefined = undefined;
    do {
      const result = await this.fetch<
        BugcrowdResponseBase & { bounties: Bounty[] }
      >('bounties', { offset, limit });

      for (const bounties of result.bounties) {
        await fn(bounties);
      }

      if (this.hasNextPage(result.meta)) {
        offset = this.getNextOffset(result.meta);
      } else {
        offset = undefined;
      }
    } while (offset != undefined);
  }

  async iterateBountySubmissions(
    bountyId: string,
    fn: (submission: any) => Promise<void>,
  ): Promise<void> {
    let offset: string | undefined = undefined;
    do {
      const result = await this.fetch<
        BugcrowdResponseBase & { submissions: BountySubmission[] }
      >(`bounties/${bountyId}/submissions/`, { offset });

      for (const submission of result.submissions) {
        await fn(submission);
      }

      if (this.hasNextPage(result.meta)) {
        offset = this.getNextOffset(result.meta);
      } else {
        offset = undefined;
      }
    } while (offset != undefined);
  }

  private hasNextPage(meta?: BugcrowdResponsePagination): boolean {
    if (meta) {
      return meta.total_hits > meta.count + meta.offset;
    }
    return false;
  }

  private getNextOffset(meta?: BugcrowdResponsePagination): string | undefined {
    if (meta) {
      return (meta.offset + meta.count).toString();
    }
  }

  async fetch<TResponse extends BugcrowdResponseBase>(
    endpoint: string,
    queryParams: BugcrowdPaginationQueryParams,
  ): Promise<TResponse> {
    const qs = new URLSearchParams();
    if (queryParams?.limit) {
      qs.append('limit', queryParams.limit);
    }
    if (queryParams?.offset) {
      qs.append('offset', queryParams.offset);
    }

    const url = new URL(endpoint, BASE_URL);
    url.search = qs.toString();
    return retry(
      async () => {
        const response = await nodeFetch(url, {
          headers: {
            ...this.authHeader,
          },
        });

        if (response.ok) {
          return (await response.json()) as TResponse;
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
