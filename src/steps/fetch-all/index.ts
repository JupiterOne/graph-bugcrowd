import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from '../../collector';
import {
  convertBounty,
  convertFinding,
  getAccountEntity,
} from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-all',
  name: `Fetch BugCrowd bounties and submissions`,
  types: ['bugcrowd_bounty', 'bugcrowd_submission'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);
    const accountEntity = getAccountEntity(instance);
    await jobState.addEntity(accountEntity);

    const bounties = (await client.getBounties()).bounties;
    const bountyEntities = bounties.map(convertBounty);
    await jobState.addEntities(bountyEntities);

    const bountyRelationships = bountyEntities.map((bountyEntity) =>
      createIntegrationRelationship({
        from: accountEntity,
        to: bountyEntity,
        _class: 'HAS',
      }),
    );
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
