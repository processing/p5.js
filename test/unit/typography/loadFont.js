suite('loadFont', function() {
  var invalidFile = '404file';
  var fontFile = 'manual-test-examples/p5.Font/acmesa.ttf';

  test('_friendlyFileLoadError is called', async function() {
    const _friendlyFileLoadErrorStub = sinon.stub(p5, '_friendlyFileLoadError');
    try {
      await promisedSketch(function(sketch, resolve, reject) {
        sketch.preload = function() {
          sketch.loadFont(invalidFile, reject, resolve);
        };
      });
      expect(
        _friendlyFileLoadErrorStub.calledOnce,
        'p5._friendlyFileLoadError was not called'
      ).to.be.true;
    } finally {
      _friendlyFileLoadErrorStub.restore();
    }
  });

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadFont(invalidFile, reject, function() {
        setTimeout(resolve, 50);
      });
    };

    sketch.setup = function() {
      reject(new Error('Setup called'));
    };

    sketch.draw = function() {
      reject(new Error('Draw called'));
    };
  });

  testSketchWithPromise('error callback is called', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadFont(
        invalidFile,
        function() {
          reject(new Error('Success callback executed.'));
        },
        function() {
          // Wait a bit so that if both callbacks are executed we will get an error.
          setTimeout(resolve, 50);
        }
      );
    };
  });

  testSketchWithPromise('loading correctly triggers setup', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadFont(fontFile);
    };

    sketch.setup = function() {
      resolve();
    };
  });

  testSketchWithPromise('success callback is called', function(
    sketch,
    resolve,
    reject
  ) {
    var hasBeenCalled = false;
    sketch.preload = function() {
      sketch.loadFont(
        fontFile,
        function() {
          hasBeenCalled = true;
        },
        function(err) {
          reject(new Error('Error callback was entered: ' + err));
        }
      );
    };

    sketch.setup = function() {
      if (!hasBeenCalled) {
        reject(new Error('Setup called prior to success callback'));
      } else {
        setTimeout(resolve, 50);
      }
    };
  });

  test('returns a p5.Font object', async function() {
    const font = await promisedSketch(function(sketch, resolve, reject) {
      let _font;
      sketch.preload = function() {
        _font = sketch.loadFont(fontFile, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(_font);
      };
    });
    assert.instanceOf(font, p5.Font);
  });

  test('passes a p5.Font object to success callback', async function() {
    const font = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadFont(fontFile, resolve, reject);
      };
    });
    assert.isObject(font);
  });
});
