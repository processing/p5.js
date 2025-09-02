import { mockP5, mockP5Prototype, httpMock } from '../../js/mocks';
import files from '../../../src/io/files';
import { vi } from 'vitest';
import * as fileSaver from 'file-saver';

vi.mock('file-saver');

suite('Files', function() {
  beforeAll(async function() {
    files(mockP5, mockP5Prototype);
    await httpMock.start({ quiet: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // httpDo
  suite('httpDo()', function() {
    test('should work when provided with just a path', async function() {
      const data = await mockP5Prototype.httpDo('/test/unit/assets/sentences.txt');
      assert.ok(data);
      assert.isString(data);
    });

    test('should accept method parameter', async function() {
      const data = await mockP5Prototype.httpDo('/test/unit/assets/sentences.txt', 'GET');
      assert.ok(data);
      assert.isString(data);
    });

    test('should accept method and type parameter together', async function() {
      const data = await mockP5Prototype.httpDo('/test/unit/assets/sentences.txt', 'GET', 'text');
      assert.ok(data);
      assert.isString(data);
    });

    test('should handle promise error correctly', async function() {
      await expect(mockP5Prototype.httpDo('/test/unit/assets/sen.txt'))
        .rejects
        .toThrow('Not Found');
    });
  });

  // saveStrings()
  suite('p5.prototype.saveStrings', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.saveStrings);
      assert.typeOf(mockP5Prototype.saveStrings, 'function');
    });

    test('should download a file with expected contents', async () => {
      const strings = ['some', 'words'];
      mockP5Prototype.saveStrings(strings, 'myfile');

      const saveData = new Blob([strings.join('\n')]);
      expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
      expect(fileSaver.saveAs).toHaveBeenCalledWith(saveData, 'myfile.txt');
    });

    test('should download a file with expected contents with CRLF', async () => {
      const strings = ['some', 'words'];
      mockP5Prototype.saveStrings(strings, 'myfile', 'txt', true);

      const saveData = new Blob([strings.join('\r\n')]);
      expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
      expect(fileSaver.saveAs).toHaveBeenCalledWith(saveData, 'myfile.txt');
    });
  });

  // saveJSON()
  suite('p5.prototype.saveJSON', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.saveJSON);
      assert.typeOf(mockP5Prototype.saveJSON, 'function');
    });

    test('should download a file with expected contents', async () => {
      const myObj = { hi: 'hello' };
      mockP5Prototype.saveJSON(myObj, 'myfile');

      const saveData = new Blob([JSON.stringify(myObj, null, 2)]);
      expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
      expect(fileSaver.saveAs).toHaveBeenCalledWith(saveData, 'myfile.json');
    });
  });

  // writeFile()
  suite('p5.prototype.writeFile', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.writeFile);
      assert.typeOf(mockP5Prototype.writeFile, 'function');
    });

    test('should download a file with expected contents (text)', async () => {
      const myArray = ['hello', 'hi'];
      mockP5Prototype.writeFile(myArray, 'myfile');

      const saveData = new Blob(myArray);
      expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
      expect(fileSaver.saveAs).toHaveBeenCalledWith(saveData, 'myfile');
    });
  });

  // downloadFile()
  suite('p5.prototype.downloadFile', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.downloadFile);
      assert.typeOf(mockP5Prototype.downloadFile, 'function');
    });

    test('should download a file with expected contents', async () => {
      const myArray = ['hello', 'hi'];
      const inBlob = new Blob(myArray);
      mockP5Prototype.downloadFile(inBlob, 'myfile');

      const saveData = new Blob(myArray);
      expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
      expect(fileSaver.saveAs).toHaveBeenCalledWith(saveData, 'myfile');
    });
  });

  // save()
  suite('p5.prototype.save', function() {
    suite('saving images', function() {
      test('should be a function', function() {
        assert.ok(mockP5Prototype.save);
        assert.typeOf(mockP5Prototype.save, 'function');
      });

      // Test the call to `saveCanvas`
      // `saveCanvas` is responsible for testing download is correct
      test('should call saveCanvas', async () => {
        mockP5Prototype.save();
        expect(mockP5Prototype.saveCanvas).toHaveBeenCalledTimes(1);
        expect(mockP5Prototype.saveCanvas)
          .toHaveBeenCalledWith(mockP5Prototype.elt);
      });

      test('should call saveCanvas with filename', async () => {
        mockP5Prototype.save('filename.jpg');
        expect(mockP5Prototype.saveCanvas).toHaveBeenCalledTimes(1);
        expect(mockP5Prototype.saveCanvas)
          .toHaveBeenCalledWith(mockP5Prototype.elt, 'filename.jpg');
      });
    });

    suite('saving strings and json', function() {
      test('should download a text file', async () => {
        const myStrings = ['aaa', 'bbb'];
        mockP5Prototype.save(myStrings, 'filename');

        const saveData = new Blob([myStrings.join('\n')]);
        expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
        expect(fileSaver.saveAs).toHaveBeenCalledWith(saveData, 'filename.txt');
      });

      test('should download a json file', async () => {
        const myObj = { hi: 'hello' };
        mockP5Prototype.save(myObj, 'filename.json');

        const saveData = new Blob([JSON.stringify(myObj, null, 2)]);
        expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
        expect(fileSaver.saveAs).toHaveBeenCalledWith(saveData, 'filename.json');
      });
    });
  });
});
