import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const bountySpec: StepSpec<IntegrationConfig>[] = [
  {
    id: 'fetch-bounties',
    name: 'Fetch Bounties',
    entities: [
      {
        resourceName: 'Bounty',
        _type: 'bugcrowd_bounty',
        _class: ['Program', 'Control'],
      },
    ],
    relationships: [
      {
        _type: 'bugcrowd_account_has_bounty',
        sourceType: 'bugcrowd_account',
        _class: RelationshipClass.HAS,
        targetType: 'bugcrowd_bounty',
      },
      {
        _type: 'bugcrowd_service_manages_bounty',
        sourceType: 'bugcrowd_service',
        _class: RelationshipClass.HAS,
        targetType: 'bugcrowd_bounty',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    id: 'fetch-bounty-submissions',
    name: 'Fetch Bounty Submissions',
    entities: [
      {
        resourceName: 'Submission',
        _type: 'bugcrowd_submission',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'bugcrowd_bounty_has_submission',
        sourceType: 'bugcrowd_bounty',
        _class: RelationshipClass.HAS,
        targetType: 'bugcrowd_submission',
      },
    ],
    dependsOn: ['fetch-bounties'],
    implemented: true,
  },
];
