import {
  Entity,
  IntegrationError,
  JobState,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_JOB_STATE_KEY = 'account:entity';
export const SERVICE_ENTITY_JOB_STATE_KEY = 'service:entity';

export async function getAccountEntity(jobState: JobState): Promise<Entity> {
  const accountEntity = await jobState.getData<Entity>(
    ACCOUNT_ENTITY_JOB_STATE_KEY,
  );

  if (!accountEntity) {
    throw new IntegrationError({
      message: 'Could not find account entity in job state',
      code: 'ACCOUNT_ENTITY_NOT_FOUND',
      fatal: true,
    });
  }

  return accountEntity;
}

export async function getServiceEntity(jobState: JobState): Promise<Entity> {
  const serviceEntity = await jobState.getData<Entity>(
    SERVICE_ENTITY_JOB_STATE_KEY,
  );

  if (!serviceEntity) {
    throw new IntegrationError({
      message: 'Could not find service entity in job state',
      code: 'SERVICE_ENTITY_NOT_FOUND',
      fatal: true,
    });
  }

  return serviceEntity;
}
