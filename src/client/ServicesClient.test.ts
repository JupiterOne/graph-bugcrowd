import { config } from '../../test/config';
import { Recording, setupBugcrowdRecording } from '../../test/recording';
import { ServicesClient } from './ServicesClient';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
const cb = async () => {};

describe('ServicesClient', () => {
  test('should fetch multiple pages from API', async () => {
    recording = setupBugcrowdRecording({
      directory: __dirname,
      name: 'ServicesClient-pagination',
    });

    const client = new ServicesClient(config);
    const mockFetch = jest.spyOn(client, 'fetch');

    await client.iterateBounties(cb, { limit: 1 });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
