import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import files from '../../../src/io/files';

suite('loadStrings', function() {
  const invalidFile = '404file';
  const validFile = '/test/unit/assets/sentences.txt';
  const fileWithEmptyLines = '/test/unit/assets/empty_lines.txt';
  const fileWithManyLines = '/test/unit/assets/many_lines.txt';

  beforeAll(async () => {
    files(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors', async () => {
    await expect(mockP5Prototype.loadStrings(invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadStrings(invalidFile, () => {
        reject("Success callback executed");
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadStrings(validFile, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, (err) => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  test('returns an array of strings',  async () => {
    const strings = await mockP5Prototype.loadStrings(validFile);
    assert.isArray(strings);
    for(let string of strings){
      assert.isString(string);
    }
  });

  test('passes an array to success callback',  async () => {
    await mockP5Prototype.loadStrings(validFile, (strings) => {
      assert.isArray(strings);
      for(let string of strings){
        assert.isString(string);
      }
    });
  });

  test('should include empty strings',  async () => {
    const strings = await mockP5Prototype.loadStrings(fileWithEmptyLines);
    assert.isArray(strings, 'Array passed to callback function');
    assert.lengthOf(strings, 6, 'length of data is 6');
  });

  test('can load file with many lines',  async () => {
    const strings = await mockP5Prototype.loadStrings(fileWithManyLines);
    assert.isArray(strings, 'Array passed to callback function');
    assert.lengthOf(strings, 131073, 'length of data is 131073');
  });
});
