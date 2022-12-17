suite('loadShader', function() {
  var invalidFile = '404file';
  var vertFile = 'unit/assets/vert.glsl';
  var fragFile = 'unit/assets/frag.glsl';

  test('_friendlyFileLoadError is called', async function() {
    const _friendlyFileLoadErrorStub = sinon.stub(p5, '_friendlyFileLoadError');
    try {
      await promisedSketch(function(sketch, resolve, reject) {
        sketch.preload = function() {
          sketch.loadShader(invalidFile, invalidFile, reject, resolve);
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

  testSketchWithPromise('error with vert prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadShader(invalidFile, fragFile);
      setTimeout(resolve, 50);
    };

    sketch.setup = function() {
      reject(new Error('Setup called'));
    };

    sketch.draw = function() {
      reject(new Error('Draw called'));
    };
  });

  testSketchWithPromise('error with frag prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadShader(vertFile, invalidFile);
      setTimeout(resolve, 50);
    };

    sketch.setup = function() {
      reject(new Error('Setup called'));
    };

    sketch.draw = function() {
      reject(new Error('Draw called'));
    };
  });

  testSketchWithPromise('error callback is called for vert', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadShader(
        invalidFile,
        fragFile,
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

  testSketchWithPromise('error callback is called for frag', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadShader(
        vertFile,
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
      sketch.loadShader(vertFile, fragFile);
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
      sketch.loadShader(
        vertFile,
        fragFile,
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

  test('returns an object with correct data', async function() {
    const shader = await promisedSketch(function(sketch, resolve, reject) {
      var _shader;
      sketch.preload = function() {
        _shader = sketch.loadShader(vertFile, fragFile, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(_shader);
      };
    });
    assert.instanceOf(shader, p5.Shader);
  });

  test('passes an object with correct data to callback', async function() {
    const model = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadShader(vertFile, fragFile, resolve, reject);
      };
    });
    assert.instanceOf(model, p5.Shader);
  });

  test('does not run setup after complete when called outside of preload', async function() {
    let setupCallCount = 0;
    await promisedSketch(function(sketch, resolve, reject) {
      sketch.setup = function() {
        setupCallCount++;
        sketch.loadShader(vertFile, fragFile, resolve, reject);
      };
    });
    assert.equal(setupCallCount, 1);
  });
});
