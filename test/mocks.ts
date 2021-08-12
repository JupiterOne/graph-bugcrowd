import {
  createAccountEntity,
  createServiceEntity,
} from '../src/steps/fetch-account/converters';

export function createMockAccountEntity() {
  return createAccountEntity({
    id: 'id',
    name: 'name',
    description: 'description',
    accountId: 'accountId',
    integrationDefinitionId: 'integrationDefinitionId',
    config: {},
  });
}

export function createMockServiceEntity() {
  return createServiceEntity({
    id: 'id',
    name: 'name',
    description: 'description',
    accountId: 'accountId',
    integrationDefinitionId: 'integrationDefinitionId',
    config: {},
  });
}
