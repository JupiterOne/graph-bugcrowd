import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
     */
    id: 'fetch-account',
    name: 'Fetch Account Details',
    entities: [
      {
        resourceName: 'Account',
        _type: 'bugcrowd_account',
        _class: ['Account'],
      },
      {
        resourceName: 'Service',
        _type: 'bugcrowd_service',
        _class: ['Service', 'Control'],
      },
    ],
    relationships: [
      {
        _type: 'bugcrowd_account_provides_service',
        sourceType: 'bugcrowd_account',
        _class: RelationshipClass.PROVIDES,
        targetType: 'bugcrowd_service',
      },
    ],
    dependsOn: [],
    implemented: true,
  },
];
