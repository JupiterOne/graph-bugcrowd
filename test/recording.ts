import {
  Recording,
  setupRecording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };
export function setupBugcrowdRecording(input: SetupRecordingInput) {
  return setupRecording({
    mutateEntry: mutations.unzipGzippedRecordingEntry,
    ...input,
  });
}
