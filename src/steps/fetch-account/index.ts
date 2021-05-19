import {
  IntegrationStep,
  createDirectRelationship,
  RelationshipClass,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAccountEntity, createServiceEntity } from './converters';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import {
  ACCOUNT_ENTITY_JOB_STATE_KEY,
  SERVICE_ENTITY_JOB_STATE_KEY,
} from '../../util/jobState';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.addEntity(createAccountEntity(instance));
  const serviceEntity = await jobState.addEntity(createServiceEntity(instance));

  // Cache the account and service entities for quick access later. Both are used
  // accross multiple steps
  await jobState.setData(ACCOUNT_ENTITY_JOB_STATE_KEY, accountEntity);
  await jobState.setData(SERVICE_ENTITY_JOB_STATE_KEY, serviceEntity);

  await jobState.addRelationship(
    createDirectRelationship({
      _class: RelationshipClass.PROVIDES,
      from: accountEntity,
      to: serviceEntity,
    }),
  );
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.ACCOUNT,
    name: 'Fetch Account',
    entities: [Entities.ACCOUNT, Entities.SERVICE],
    relationships: [Relationships.ACCOUNT_PROVIDES_SERVICE],
    executionHandler: fetchAccount,
  },
];
