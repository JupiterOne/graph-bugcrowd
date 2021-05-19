import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  ACCOUNT = 'fetch-account',
  BOUNTIES = 'fetch-bounties',
  BOUNTY_SUBMISSIONS = 'fetch-bounty-submissions',
}

export const Entities: Record<
  'ACCOUNT' | 'SERVICE' | 'BOUNTY' | 'SUBMISSION',
  StepEntityMetadata
> = {
  ACCOUNT: {
    _type: 'bugcrowd_account',
    _class: ['Account'],
    resourceName: 'Account',
  },
  SERVICE: {
    _type: 'bugcrowd_service',
    _class: ['Service', 'Control'],
    resourceName: 'Service',
  },
  BOUNTY: {
    _type: 'bugcrowd_bounty',
    _class: ['Program', 'Control'],
    resourceName: 'Bounty',
  },
  SUBMISSION: {
    _type: 'bugcrowd_submission',
    _class: ['Finding'],
    resourceName: 'Submission',
  },
};

export const Relationships: Record<
  | 'ACCOUNT_PROVIDES_SERVICE'
  | 'ACCOUNT_HAS_BOUNTY'
  | 'SERVICE_MANAGES_BOUNTY'
  | 'BOUNTY_HAS_SUBMISSION',
  StepRelationshipMetadata
> = {
  ACCOUNT_PROVIDES_SERVICE: {
    _type: 'bugcrowd_account_provides_service',
    _class: RelationshipClass.PROVIDES,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.SERVICE._type,
  },
  ACCOUNT_HAS_BOUNTY: {
    _type: 'bugcrowd_account_has_bounty',
    _class: RelationshipClass.HAS,
    sourceType: Entities.ACCOUNT._type,
    targetType: Entities.BOUNTY._type,
  },
  SERVICE_MANAGES_BOUNTY: {
    _type: 'bugcrowd_service_manages_bounty',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.SERVICE._type,
    targetType: Entities.BOUNTY._type,
  },
  BOUNTY_HAS_SUBMISSION: {
    _type: 'bugcrowd_bounty_has_submission',
    _class: RelationshipClass.HAS,
    sourceType: Entities.BOUNTY._type,
    targetType: Entities.SUBMISSION._type,
  },
};
