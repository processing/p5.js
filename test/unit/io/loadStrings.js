suite('loadStrings', function() {
  const invalidFile = '404file';
  const validFile = 'unit/assets/sentences.txt';
  const fileWithEmptyLines = 'unit/assets/empty_lines.txt';
  const fileWithManyLines = 'unit/assets/many_lines.txt';

  test('_friendlyFileLoadError is called', async function() {
    const _friendlyFileLoadErrorStub = sinon.stub(p5, '_friendlyFileLoadError');
    try {
      await promisedSketch(function(sketch, resolve, reject) {
        sketch.preload = function() {
          sketch.loadStrings(invalidFile, reject, resolve);
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
      sketch.loadStrings(invalidFile, reject, function() {
        setTimeout(resolve, 50);
      });
    };

    sketch.setup = function() {
      reject(new Error('Entered setup'));
    };

    sketch.draw = function() {
      reject(new Error('Entered draw'));
    };
  });

  testSketchWithPromise('error callback is called', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadStrings(
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
      sketch.loadStrings(validFile);
    };

    sketch.setup = resolve();
  });

  testSketchWithPromise('success callback is called', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadStrings(validFile, resolve, function(err) {
        reject(new Error('Error callback was entered: ' + err));
      });
    };

    sketch.setup = function() {
      reject(new Error('Setup called prior to success callback'));
    };
  });

  test('returns an array of strings', async function() {
    const strings = await promisedSketch(function(sketch, resolve, reject) {
      let strings;
      sketch.preload = function() {
        strings = sketch.loadStrings(validFile, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(strings);
      };
    });

    assert.isArray(strings);
    for (let i = 0; i < strings.length; i++) {
      assert.isString(strings[i]);
    }
  });

  test('passes an array to success callback', async function() {
    const strings = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadStrings(validFile, resolve, reject);
      };
    });
    assert.isArray(strings);
    for (let i = 0; i < strings.length; i++) {
      assert.isString(strings[i]);
    }
  });

  test('should include empty strings', async function() {
    const strings = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadStrings(fileWithEmptyLines, resolve, reject);
      };
    });
    assert.isArray(strings, 'Array passed to callback function');
    assert.lengthOf(strings, 6, 'length of data is 6');
  });

  test('can load file with many lines', async function() {
    const strings = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadStrings(fileWithManyLines, resolve, reject);
      };
    });
    assert.isArray(strings, 'Array passed to callback function');
    assert.lengthOf(strings, 131073, 'length of data is 131073');
  });
});
