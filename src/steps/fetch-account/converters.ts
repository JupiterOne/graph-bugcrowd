import {
  IntegrationInstance,
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

export function createAccountEntity(instance: IntegrationInstance): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _key: `bugcrowd:account:${instance.id}`,
        _type: 'bugcrowd_account',
        _class: ['Account'],
        name: instance.name,
        displayName: instance.name,
        description: instance.description,
      },
    },
  });
}

export function createServiceEntity(instance: IntegrationInstance): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _key: `bugcrowd:service:${instance.id}:bug-bounty`,
        _type: 'bugcrowd_service',
        _class: ['Service', 'Control'],
        name: 'Bugcrowd Security Testing',
        displayName: 'Bugcrowd Security Testing',
        description: 'Crowd-sourced security testing',
        category: ['security', 'software'],
        function: ['appsec', 'bug-bounty', 'pen-test'],
      },
    },
  });
}
