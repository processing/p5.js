import { mockP5, mockP5Prototype } from '../../js/mocks';
import { vi } from 'vitest';
import image from '../../../src/image/image';
import files from '../../../src/io/files';
import loading from '../../../src/image/loading_displaying';
import p5Image from '../../../src/image/p5.Image';

const mockAnchorElement = vi.mockObject({
  href: null,
  download: null,
  click: () => {}
});
const originalCreateElement = document.createElement;
vi.spyOn(document, 'createElement').mockImplementation((...args) => {
  if(args[0] !== 'a'){
    return originalCreateElement.apply(document, args);
  }else{
    return mockAnchorElement;
  }
});

expect.extend({
  tobeGif: received => {
    if (received.type === 'image/gif') {
      return {
        message: 'expect blob to have type image/gif',
        pass: true
      };
    } else {
      return {
        message: 'expect blob to have type image/gif',
        pass: false
      };
    }
  },
  tobePng: received => {
    if (received.type === 'image/png') {
      return {
        message: 'expect blob to have type image/png',
        pass: true
      };
    } else {
      return {
        message: 'expect blob to have type image/png',
        pass: false
      };
    }
  },
  tobeJpg: received => {
    if (received.type === 'image/jpeg') {
      return {
        message: 'expect blob to have type image/jpeg',
        pass: true
      };
    } else {
      return {
        message: 'expect blob to have type image/jpeg',
        pass: false
      };
    }
  }
});

const wait = async time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

suite('Downloading', () => {
  beforeAll(async function() {
    image(mockP5, mockP5Prototype);
    files(mockP5, mockP5Prototype);
    loading(mockP5, mockP5Prototype);
    p5Image(mockP5, mockP5Prototype);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  suite('downloading animated gifs', function() {
    let myGif;
    const imagePath = '/test/unit/assets/nyan_cat.gif';

    beforeAll(async function() {
      myGif = await mockP5Prototype.loadImage(imagePath);
    });

    suite('p5.prototype.encodeAndDownloadGif', function() {
      test('should be a function', function() {
        assert.ok(mockP5Prototype.encodeAndDownloadGif);
        assert.typeOf(mockP5Prototype.encodeAndDownloadGif, 'function');
      });

      test('should not throw an error', function() {
        mockP5Prototype.encodeAndDownloadGif(myGif);
      });

      test('should download a gif', async () => {
        mockP5Prototype.encodeAndDownloadGif(myGif);

        expect(document.createElement).toHaveBeenCalledTimes(1);
        expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
        assert.equal(mockAnchorElement.download, 'untitled.gif');
      });
    });
  });

  suite('p5.prototype.saveCanvas', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.saveCanvas);
      assert.typeOf(mockP5Prototype.saveCanvas, 'function');
    });

    test('should download a png file', async () => {
      mockP5Prototype.saveCanvas();
      await wait(100);
      expect(document.createElement).toHaveBeenCalledTimes(1);
      expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
      assert.equal(mockAnchorElement.download, 'untitled.png');
    });

    test('should download a jpg file I', async () => {
      mockP5Prototype.saveCanvas('filename.jpg');
      await wait(100);
      expect(document.createElement).toHaveBeenCalledTimes(1);
      expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
      assert.equal(mockAnchorElement.download, 'filename.jpg');
    });

    test('should download a jpg file II', async () => {
      mockP5Prototype.saveCanvas('filename', 'jpg');
      await wait(100);
      expect(document.createElement).toHaveBeenCalledTimes(1);
      expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
      assert.equal(mockAnchorElement.download, 'filename.jpg');
    });
  });

  suite('p5.prototype.saveFrames', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.saveFrames);
      assert.typeOf(mockP5Prototype.saveFrames, 'function');
    });

    test('should get frames in callback (png)', async () => {
      return new Promise(resolve => {
        mockP5Prototype.saveFrames('aaa', 'png', 0.5, 25, function cb1(arr) {
          assert.typeOf(arr, 'array', 'we got an array');
          for (let i = 0; i < arr.length; i++) {
            assert.ok(arr[i].imageData);
            assert.equal(arr[i].ext, 'png');
            assert.equal(arr[i].filename, `aaa${i}`);
          }
          resolve();
        });
      });
    });

    test('should get frames in callback (png)', async () => {
      return new Promise(resolve => {
        mockP5Prototype.saveFrames('aaa', 'jpg', 0.5, 25, function cb1(arr) {
          assert.typeOf(arr, 'array', 'we got an array');
          for (let i = 0; i < arr.length; i++) {
            assert.ok(arr[i].imageData);
            assert.equal(arr[i].ext, 'jpg');
            assert.equal(arr[i].filename, `aaa${i}`);
          }
          resolve();
        });
      });
    });
  });

  suite('p5.prototype.saveGif', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.saveGif);
      assert.typeOf(mockP5Prototype.saveGif, 'function');
    });

    // TODO: this implementation need refactoring
    test.todo('should not throw an error', async () => {
      await mockP5Prototype.saveGif('myGif', 3);
    });

    test.todo('should not throw an error', async () => {
      await mockP5Prototype.saveGif('myGif', 3, { delay: 2, frames: 'seconds' });
    });

    test.todo('should download a GIF', async () => {
      await mockP5Prototype.saveGif('myGif', 3, 2);
      expect(document.createElement).toHaveBeenCalledTimes(1);
      expect(mockAnchorElement.click).toHaveBeenCalledTimes(1);
      assert.equal(mockAnchorElement.download, 'myGif.gif');
    });
  });
});
