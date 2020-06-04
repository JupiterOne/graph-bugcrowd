import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertBounty,
  convertFinding,
  getAccountEntity,
  getServiceEntity,
} from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-all',
  name: `Fetch Bugcrowd bounties and submissions`,
  types: [
    'bugcrowd_account',
    'bugcrowd_bounty',
    'bugcrowd_submission',
    'bugcrowd_account_has_bounty',
    'bugcrowd_service_manages_bounty',
    'bugcrowd_bounty_has_submission',
  ],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);
    const accountEntity = getAccountEntity(instance);
    const serviceEntity = getServiceEntity(instance);

    const bounties = (await client.getBounties()).bounties;
    const bountyEntities = bounties.map(convertBounty);
    await jobState.addEntities(bountyEntities);

    const bountyRelationships = [];
    bountyEntities.forEach((bountyEntity) => {
      bountyRelationships.push(
        createIntegrationRelationship({
          from: accountEntity,
          to: bountyEntity,
          _class: 'HAS',
        }),
      );
      bountyRelationships.push(
        createIntegrationRelationship({
          from: serviceEntity,
          to: bountyEntity,
          _class: 'MANAGES',
        }),
      );
    });
    await jobState.addRelationships(bountyRelationships);

    for (const bountyEntity of bountyEntities) {
      if (bountyEntity.uuid) {
        const findings = (await client.getSubmissions(bountyEntity.uuid))
          .submissions;
        const findingEntities = findings.map(convertFinding);
        await jobState.addEntities(findingEntities);

        const submissionRelationships = findingEntities.map((findingEntity) =>
          createIntegrationRelationship({
            from: bountyEntity,
            to: findingEntity,
            _class: 'HAS',
          }),
        );
        await jobState.addRelationships(submissionRelationships);
      }
    }
  },
};

export default step;
