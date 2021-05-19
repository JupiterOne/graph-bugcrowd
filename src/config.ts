import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { ServicesClient } from './client/ServicesClient';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiToken: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  apiToken: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.apiToken) {
    throw new IntegrationValidationError('Config requires all of {apiToken}');
  }

  try {
    const client = new ServicesClient({ apiToken: config.apiToken });
    await client.test();
  } catch (err) {
    throw new IntegrationProviderAuthenticationError({
      cause: err,
      endpoint: 'api.bugcrowd.com',
      status: 401,
      statusText: err.toString(),
    });
  }
}
