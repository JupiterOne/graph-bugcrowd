import { IntegrationConfig, validateInvocation } from './config';
import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';

describe('#validateInvocation', () => {
  test('should fail if no apiToken is passed as config', async () => {
    const context = createMockExecutionContext<IntegrationConfig>();
    await expect(() => validateInvocation(context)).rejects.toThrowError(
      'Config requires all of {apiToken}',
    );
  });
});
