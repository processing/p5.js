import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import files from '../../../src/io/files';

suite('loadBytes', function() {
  const invalidFile = '404file';
  const validFile = '/test/unit/assets/nyan_cat.gif';

  beforeAll(async () => {
    files(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors', async () => {
    await expect(mockP5Prototype.loadBytes(invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadBytes(invalidFile, () => {
        reject("Success callback executed");
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadBytes(validFile, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, (err) => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  test('returns the correct object',  async () => {
    const data = await mockP5Prototype.loadBytes(validFile);
    assert.instanceOf(data, Uint8Array);

    // Validate data
    const str = 'GIF89a';
    // convert the string to a byte array
    const rgb = str.split('').map(function(e) {
      return e.charCodeAt(0);
    });
    // this will convert a Uint8Aray to [], if necessary:
    const loaded = Array.prototype.slice.call(data, 0, str.length);
    assert.deepEqual(loaded, rgb);
  });

  test('passes athe correct object to success callback',  async () => {
    await mockP5Prototype.loadBytes(validFile, (data) => {
      assert.instanceOf(data, Uint8Array);

      // Validate data
      const str = 'GIF89a';
      // convert the string to a byte array
      const rgb = str.split('').map(function(e) {
        return e.charCodeAt(0);
      });
      // this will convert a Uint8Aray to [], if necessary:
      const loaded = Array.prototype.slice.call(data, 0, str.length);
      assert.deepEqual(loaded, rgb);
    });
  });
});
