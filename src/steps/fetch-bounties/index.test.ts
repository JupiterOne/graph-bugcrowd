import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { Recording, setupBugcrowdRecording } from '../../../test/recording';
import { fetchBounties } from '.';
import { config } from '../../../test/config';
import {
  ACCOUNT_ENTITY_JOB_STATE_KEY,
  SERVICE_ENTITY_JOB_STATE_KEY,
} from '../../util/jobState';
import { Entities, Relationships } from '../constants';
import {
  createMockAccountEntity,
  createMockServiceEntity,
} from '../../../test/mocks';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetchBounties', () => {
  test('success', async () => {
    recording = setupBugcrowdRecording({
      directory: __dirname,
      name: 'fetchBounties',
    });

    const context = createMockStepExecutionContext({
      instanceConfig: config,
      setData: {
        [ACCOUNT_ENTITY_JOB_STATE_KEY]: createMockAccountEntity(),
        [SERVICE_ENTITY_JOB_STATE_KEY]: createMockServiceEntity(),
      },
    });

    await fetchBounties(context);

    const bountyEntities = context.jobState.collectedEntities;

    expect(bountyEntities.length).toBeGreaterThan(0);
    expect(bountyEntities).toMatchGraphObjectSchema({
      _class: Entities.BOUNTY._class,
    });

    const accountBountyRelationships =
      context.jobState.collectedRelationships.filter(
        (r) => r._type === Relationships.ACCOUNT_HAS_BOUNTY._type,
      );
    expect(accountBountyRelationships).toHaveLength(bountyEntities.length);
    expect(accountBountyRelationships).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _type: {
            const: Relationships.ACCOUNT_HAS_BOUNTY._type,
          },
        },
      },
    });

    const serviceBountyRelationships =
      context.jobState.collectedRelationships.filter(
        (r) => r._type === Relationships.SERVICE_MANAGES_BOUNTY._type,
      );
    expect(serviceBountyRelationships).toHaveLength(bountyEntities.length);
    expect(serviceBountyRelationships).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _type: {
            const: Relationships.SERVICE_MANAGES_BOUNTY._type,
          },
        },
      },
    });
  });
});
