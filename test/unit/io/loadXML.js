import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import files from '../../../src/io/files';
import xml from '../../../src/io/p5.XML';

suite('loadXML', function() {
  const invalidFile = '404file';
  const validFile = '/test/unit/assets/books.xml';

  beforeAll(async () => {
    files(mockP5, mockP5Prototype);
    xml(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  test('throws error when encountering HTTP errors', async () => {
    await expect(mockP5Prototype.loadXML(invalidFile))
      .rejects
      .toThrow('Not Found');
  });

  test('error callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadXML(invalidFile, () => {
        console.log('here');
        reject('Success callback executed');
      }, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      });
    });
  });

  test('success callback is called', async () => {
    await new Promise((resolve, reject) => {
      mockP5Prototype.loadXML(validFile, () => {
        // Wait a bit so that if both callbacks are executed we will get an error.
        setTimeout(resolve, 50);
      }, err => {
        reject(`Error callback called: ${err.toString()}`);
      });
    });
  });

  test('returns an object with correct data', async () => {
    const xml = await mockP5Prototype.loadXML(validFile);
    assert.isObject(xml);
    const children = xml.getChildren('book');
    assert.lengthOf(children, 12);
  });

  test('passes an object with correct data to success callback', async () => {
    await mockP5Prototype.loadXML(validFile, xml => {
      assert.isObject(xml);
      const children = xml.getChildren('book');
      assert.lengthOf(children, 12);
    });
  });
});
