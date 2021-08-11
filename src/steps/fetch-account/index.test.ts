import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchAccount } from '.';
import { config } from '../../../test/config';
import { Entities, Relationships } from '../constants';

describe('fetchAccount', () => {
  test('success', async () => {
    const context = createMockStepExecutionContext({
      instanceConfig: config,
    });

    await fetchAccount(context);

    expect(context.jobState.collectedEntities).toHaveLength(2);
    const accountEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === Entities.ACCOUNT._type,
    );
    expect(accountEntities).toHaveLength(1);
    expect(accountEntities).toMatchGraphObjectSchema({
      _class: Entities.ACCOUNT._class,
    });

    const serviceEntities = context.jobState.collectedEntities.filter(
      (e) => e._type === Entities.SERVICE._type,
    );
    expect(serviceEntities).toHaveLength(1);
    expect(serviceEntities).toMatchGraphObjectSchema({
      _class: Entities.SERVICE._class,
    });

    expect(context.jobState.collectedRelationships).toHaveLength(1);

    expect(
      context.jobState.collectedRelationships,
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _type: {
            const: Relationships.ACCOUNT_PROVIDES_SERVICE._type,
          },
        },
      },
    });
  });
});
