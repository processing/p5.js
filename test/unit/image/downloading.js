import p5 from '../../../src/app.js';
import { testWithDownload } from '../../js/p5_helpers';

suite('downloading animated gifs', function() {
  let myp5;
  let myGif;

  beforeAll(function() {
    return new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          resolve();
        };
      });
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  let imagePath = 'unit/assets/nyan_cat.gif';

  beforeEach(function loadMyGif(done) {
    myp5.loadImage(imagePath, function(pImg) {
      myGif = pImg;
      done();
    });
  });

  suite('p5.prototype.encodeAndDownloadGif', function() {
    test('should be a function', function() {
      assert.ok(myp5.encodeAndDownloadGif);
      assert.typeOf(myp5.encodeAndDownloadGif, 'function');
    });
    test('should not throw an error', function() {
      myp5.encodeAndDownloadGif(myGif);
    });
    testWithDownload('should download a gif', function(blobContainer) {
      myp5.encodeAndDownloadGif(myGif);
      let gifBlob = blobContainer.blob;
      assert.strictEqual(gifBlob.type, 'image/gif');
    });
  });
});

suite('p5.prototype.saveCanvas', function() {
  let myp5;
  let myCanvas;

  let waitForBlob = async function(blc) {
    let sleep = function(ms) {
      return new Promise(r => setTimeout(r, ms));
    };
    while (!blc.blob) {
      await sleep(5);
    }
  };

  beforeAll(function() {
    return new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          myCanvas = p.createCanvas(20, 20);
          p.background(255, 0, 0);
          resolve();
        };
      });
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  test('should be a function', function() {
    assert.ok(myp5.saveCanvas);
    assert.typeOf(myp5.saveCanvas, 'function');
  });

  testWithDownload(
    'should download a png file',
    async function(blobContainer) {
      myp5.saveCanvas();
      // since a function with callback is used in saveCanvas
      // until the blob is made available to us.
      await waitForBlob(blobContainer);
      let myBlob = blobContainer.blob;
      assert.strictEqual(myBlob.type, 'image/png');
    },
    true
  );

  testWithDownload(
    'should download a jpg file I',
    async function(blobContainer) {
      myp5.saveCanvas('filename.jpg');
      await waitForBlob(blobContainer);
      let myBlob = blobContainer.blob;
      assert.strictEqual(myBlob.type, 'image/jpeg');
    },
    true
  );

  testWithDownload(
    'should download a jpg file II',
    async function(blobContainer) {
      myp5.saveCanvas('filename', 'jpg');
      await waitForBlob(blobContainer);
      let myBlob = blobContainer.blob;
      assert.strictEqual(myBlob.type, 'image/jpeg');
    },
    true
  );
});

suite('p5.prototype.saveFrames', function() {
  let myp5;

  beforeAll(function() {
    return new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          p.createCanvas(10, 10);
          resolve();
        };
      });
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  test('should be a function', function() {
    assert.ok(myp5.saveFrames);
    assert.typeOf(myp5.saveFrames, 'function');
  });

  test('should get frames in callback (png)', function(done) {
    myp5.saveFrames('aaa', 'png', 0.5, 25, function cb1(arr) {
      assert.typeOf(arr, 'array', 'we got an array');
      for (let i = 0; i < arr.length; i++) {
        assert.ok(arr[i].imageData);
        assert.strictEqual(arr[i].ext, 'png');
        assert.strictEqual(arr[i].filename, `aaa${i}`);
      }
      done();
    });
  });

  test('should get frames in callback (jpg)', function(done) {
    myp5.saveFrames('bbb', 'jpg', 0.5, 25, function cb2(arr2) {
      assert.typeOf(arr2, 'array', 'we got an array');
      for (let i = 0; i < arr2.length; i++) {
        assert.ok(arr2[i].imageData);
        assert.strictEqual(arr2[i].ext, 'jpg');
        assert.strictEqual(arr2[i].filename, `bbb${i}`);
      }
      done();
    });
  });
});

suite('p5.prototype.saveGif', function() {
  let myp5;

  let waitForBlob = async function(blc) {
    let sleep = function(ms) {
      return new Promise(r => setTimeout(r, ms));
    };
    while (!blc.blob) {
      await sleep(5);
    }
  };

  beforeAll(function() {
    return new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          p.createCanvas(10, 10);
          resolve();
        };
      });
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  test('should be a function', function() {
    assert.ok(myp5.saveGif);
    assert.typeOf(myp5.saveGif, 'function');
  });

  test('should not throw an error', function() {
    myp5.saveGif('myGif', 3);
  });

  test('should not throw an error', function() {
    myp5.saveGif('myGif', 3, { delay: 2, frames: 'seconds' });
  });

  testWithDownload('should download a GIF', async function(blobContainer) {
    myp5.saveGif('myGif', 3, 2);
    await waitForBlob(blobContainer);
    let gifBlob = blobContainer.blob;
    assert.strictEqual(gifBlob.type, 'image/gif');
  });
});
