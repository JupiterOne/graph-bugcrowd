import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk-core';

import { getAccountEntity, getServiceEntity } from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-account',
  name: 'Fetch Bugcrowd account and service',
  types: [
    'bugcrowd_account',
    'bugcrowd_service',
    'bugcrowd_account_provides_service',
  ],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const accountEntity = getAccountEntity(instance);
    await jobState.addEntity(accountEntity);

    const serviceEntity = getServiceEntity(instance);
    await jobState.addEntity(serviceEntity);

    await jobState.addRelationship(
      createIntegrationRelationship({
        from: accountEntity,
        to: serviceEntity,
        _class: 'PROVIDES',
      }),
    );
  },
};

export default step;
