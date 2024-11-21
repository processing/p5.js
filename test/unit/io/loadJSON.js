import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import files from '../../../src/io/files';

suite('loadJSON', function() {
  const invalidFile = '404file';
  const jsonArrayFile = '/test/unit/assets/array.json';
  const jsonObjectFile = '/test/unit/assets/object.json';

  beforeAll(async () => {
    files(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors', async () => {
    await expect(mockP5Prototype.loadJSON(invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadJSON(invalidFile, () => {
        reject("Success callback executed");
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadJSON(jsonObjectFile, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, (err) => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  test('returns an object for object JSON.', async () => {
    const data = await mockP5Prototype.loadJSON(jsonObjectFile);
    assert.isObject(data);
    assert.isNotArray(data);
  });

  test('passes an object to success callback for object JSON.', async () => {
    await mockP5Prototype.loadJSON(jsonObjectFile, (data) => {
      assert.isObject(data);
    });
  });

  test('returns an array for array JSON.', async () => {
    const data = await mockP5Prototype.loadJSON(jsonArrayFile);
    assert.isArray(data);
    assert.lengthOf(data, 3);
  });

  test('passes an array to success callback for array JSON.', async function() {
    await mockP5Prototype.loadJSON(jsonArrayFile, (data) => {
      assert.isArray(data);
      assert.lengthOf(data, 3);
    });
  });
});
