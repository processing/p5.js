suite('downloading animated gifs', function() {
  let myp5;
  let myGif;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  let imagePath = 'unit/assets/nyan_cat.gif';

  setup(function disableFileLoadError() {
    sinon.stub(p5, '_friendlyFileLoadError');
  });

  teardown(function restoreFileLoadError() {
    p5._friendlyFileLoadError.restore();
  });

  setup(function loadMyGif(done) {
    myp5.loadImage(imagePath, function(pImg) {
      myGif = pImg;
      done();
    });
  });

  suite('p5.prototype.saveGif', function() {
    test('should be a function', function() {
      assert.ok(myp5.saveGif);
      assert.typeOf(myp5.saveGif, 'function');
    });
    test('should not throw an error', function() {
      myp5.saveGif(myGif);
    });
    testWithDownload('should download a gif', function(blobContainer) {
      myp5.saveGif(myGif);
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
  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        myCanvas = p.createCanvas(20, 20);
        p.background(255, 0, 0);
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  test('should be a function', function() {
    assert.ok(myp5.saveCanvas);
    assert.typeOf(myp5.saveCanvas, 'function');
  });

  // Why use testWithDownload for 'no friendly-err' tests here?
  // saveCanvas uses htmlcanvas.toBlob which uses a callback
  // mechanism and the download is triggered in its callback.
  // It may happen that the test get out of sync and the only way
  // to know if the callback has been called is if the blob has
  // been made available to us
  testWithDownload(
    'no friendly-err-msg I',
    async function(blc) {
      assert.doesNotThrow(
        function() {
          myp5.saveCanvas();
        },
        Error,
        'got unwanted exception'
      );
      await waitForBlob(blc);
    },
    true
  );
  testWithDownload(
    'no friendly-err-msg II',
    async function(blc) {
      assert.doesNotThrow(
        function() {
          myp5.saveCanvas('filename');
        },
        Error,
        'got unwanted exception'
      );
      await waitForBlob(blc);
    },
    true
  );
  testWithDownload(
    'no friendly-err-msg III',
    async function(blc) {
      assert.doesNotThrow(
        function() {
          myp5.saveCanvas('filename', 'png');
        },
        Error,
        'got unwanted exception'
      );
      await waitForBlob(blc);
    },
    true
  );
  testWithDownload(
    'no friendly-err-msg IV',
    async function(blc) {
      assert.doesNotThrow(
        function() {
          myp5.saveCanvas(myCanvas, 'filename');
        },
        Error,
        'got unwanted exception'
      );
      await waitForBlob(blc);
    },
    true
  );
  testWithDownload(
    'no friendly-err-msg V',
    async function(blc) {
      assert.doesNotThrow(
        function() {
          myp5.saveCanvas(myCanvas, 'filename', 'png');
        },
        Error,
        'got unwanted exception'
      );
    },
    true
  );
  testWithDownload(
    'no friendly-err-msg VI',
    async function(blc) {
      assert.doesNotThrow(
        function() {
          myp5.saveCanvas(myCanvas, 'filename', 'png');
        },
        Error,
        'got unwanted exception'
      );
      await waitForBlob(blc);
    },
    true
  );

  testUnMinified('wrong param type #0', function() {
    assert.validationError(function() {
      myp5.saveCanvas(5);
    });
  });

  testUnMinified('wrong param type #1', function() {
    assert.validationError(function() {
      myp5.saveCanvas(myCanvas, 5);
    });
  });

  testUnMinified('wrong param type #2', function() {
    assert.validationError(function() {
      myp5.saveCanvas(myCanvas, 'filename', 5);
    });
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
  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        p.createCanvas(10, 10);
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  test('should be a function', function() {
    assert.ok(myp5.saveFrames);
    assert.typeOf(myp5.saveFrames, 'function');
  });

  test('no friendly-err-msg I', function() {
    assert.doesNotThrow(
      function() {
        myp5.saveFrames('out', 'png', 0.1, 25);
      },
      Error,
      'got unwanted exception'
    );
  });
  test('no friendly-err-msg II', function(done) {
    assert.doesNotThrow(
      function() {
        myp5.saveFrames('out', 'png', 0.1, 25, () => {
          done();
        });
      },
      Error,
      'got unwanted exception'
    );
  });

  testUnMinified('missing param #2 #3', function() {
    assert.validationError(function() {
      myp5.saveFrames('out', 'png');
    });
  });
  testUnMinified('wrong param type #0', function() {
    assert.validationError(function() {
      myp5.saveFrames(0, 'png', 0.1, 25);
    });
  });
  testUnMinified('wrong param type #1', function() {
    assert.validationError(function() {
      myp5.saveFrames('out', 1, 0.1, 25);
    });
  });
  testUnMinified('wrong param type #2', function() {
    assert.validationError(function() {
      myp5.saveFrames('out', 'png', 'a', 25);
    });
  });
  testUnMinified('wrong param type #3', function() {
    assert.validationError(function() {
      myp5.saveFrames('out', 'png', 0.1, 'b');
    });
  });
  testUnMinified('wrong param type #4', function() {
    assert.validationError(function() {
      myp5.saveFrames('out', 'png', 0.1, 25, 5);
    });
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
