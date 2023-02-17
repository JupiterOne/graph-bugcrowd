import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { IntegrationSteps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-bounties', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-bounties',
  });

  const stepConfig = buildStepTestConfigForStep(IntegrationSteps.BOUNTIES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('fetch-bounty-submissions', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-bounty-submissions',
  });

  const stepConfig = buildStepTestConfigForStep(
    IntegrationSteps.BOUNTY_SUBMISSIONS,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
