import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { ServicesClient } from '../../client/ServicesClient';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { getAccountEntity, getServiceEntity } from '../../util/jobState';
import { createBountyEntity, createBountySubmissionEntity } from './converters';

export async function fetchBounties({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new ServicesClient({ apiToken: instance.config.apiToken });

  const accountEntity = await getAccountEntity(jobState);
  const serviceEntity = await getServiceEntity(jobState);

  await client.iterateBounties(async (bounty) => {
    const bountyEntity = await jobState.addEntity(createBountyEntity(bounty));

    await jobState.addRelationship(
      createDirectRelationship({
        from: accountEntity,
        to: bountyEntity,
        _class: RelationshipClass.HAS,
      }),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        from: serviceEntity,
        to: bountyEntity,
        _class: RelationshipClass.MANAGES,
      }),
    );
  });
}

export async function fetchBountySubmissions({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new ServicesClient({ apiToken: instance.config.apiToken });

  await jobState.iterateEntities(
    {
      _type: Entities.BOUNTY._type,
    },
    async (bountyEntity) => {
      const bountyId = bountyEntity.uuid as string | undefined;

      if (!bountyId) {
        return;
      }

      await client.iterateBountySubmissions(bountyId, async (finding) => {
        const findingEntity = await jobState.addEntity(
          createBountySubmissionEntity(finding),
        );

        await jobState.addRelationship(
          createDirectRelationship({
            from: bountyEntity,
            to: findingEntity,
            _class: RelationshipClass.HAS,
          }),
        );
      });
    },
  );
}

export const bountySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.BOUNTIES,
    name: 'Fetch Bounties',
    entities: [Entities.BOUNTY],
    relationships: [
      Relationships.ACCOUNT_HAS_BOUNTY,
      Relationships.SERVICE_MANAGES_BOUNTY,
    ],
    executionHandler: fetchBounties,
    dependsOn: [IntegrationSteps.ACCOUNT],
  },
  {
    id: IntegrationSteps.BOUNTY_SUBMISSIONS,
    name: 'Fetch Bounty Submissions',
    entities: [Entities.SUBMISSION],
    relationships: [Relationships.BOUNTY_HAS_SUBMISSION],
    executionHandler: fetchBountySubmissions,
    dependsOn: [IntegrationSteps.BOUNTIES],
  },
];
