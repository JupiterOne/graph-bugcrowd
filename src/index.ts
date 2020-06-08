import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';

import fetchAccount from './steps/fetch-account';
import fetchAll from './steps/fetch-all';
import { ServicesClientInput } from './collector/ServicesClient';

export const invocationConfig: IntegrationInvocationConfig<ServicesClientInput> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [fetchAccount, fetchAll],
};
