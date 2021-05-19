import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import {
  instanceConfigFields,
  IntegrationConfig,
  validateInvocation,
} from './config';
import { accountSteps } from './steps/fetch-account';
import { bountySteps } from './steps/fetch-bounties';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    integrationSteps: [...accountSteps, ...bountySteps],
  };
