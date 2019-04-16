suite('loadJSON', function() {
  var invalidFile = '404file';
  var jsonArrayFile = 'unit/assets/array.json';
  var jsonObjectFile = 'unit/assets/object.json';
  var jsonpObjectFile = 'unit/assets/object.js';
  var jsonpArrayFile = 'unit/assets/array.js';

  test('_friendlyFileLoadError is called', async function() {
    const _friendlyFileLoadErrorStub = sinon.stub(p5, '_friendlyFileLoadError');
    try {
      await promisedSketch(function(sketch, resolve, reject) {
        sketch.preload = function() {
          sketch.loadJSON(invalidFile, reject, resolve);
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
      sketch.loadJSON(invalidFile, reject, function() {
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
      sketch.loadJSON(
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
      sketch.loadJSON(jsonObjectFile);
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
      sketch.loadJSON(
        jsonObjectFile,
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

  test('returns an object for object JSON.', async function() {
    const json = await promisedSketch(function(sketch, resolve, reject) {
      var json;
      sketch.preload = function() {
        json = sketch.loadJSON(jsonObjectFile, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(json);
      };
    });
    assert.isObject(json);
  });

  test('passes an object to success callback for object JSON.', async function() {
    const json = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadJSON(jsonObjectFile, resolve, reject);
      };
    });
    assert.isObject(json);
  });

  // Does not work with the current loadJSON.
  test('returns an array for array JSON.');
  // test('returns an array for array JSON.', async function() {
  //   const json = await promisedSketch(function(sketch, resolve, reject) {
  //     var json;
  //     sketch.preload = function() {
  //       json = sketch.loadJSON(jsonArrayFile, function() {}, reject);
  //     };
  //
  //     sketch.setup = function() {
  //       resolve(json);
  //     };
  //   });
  //   assert.isArray(json);
  //   assert.lengthOf(json, 3);
  // });

  test('passes an array to success callback for array JSON.', async function() {
    const json = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadJSON(jsonArrayFile, resolve, reject);
      };
    });
    assert.isArray(json);
    assert.lengthOf(json, 3);
  });

  test('passes an object to success callback for object JSONP.', async function() {
    const json = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadJSON(
          jsonpObjectFile,
          { jsonpCallbackFunction: 'jsonpCallbackFunction' },
          'jsonp',
          resolve,
          reject
        );
      };
    });
    assert.isObject(json);
  });

  test('passes an array to success callback for array JSONP.', async function() {
    const json = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadJSON(
          jsonpArrayFile,
          { jsonpCallbackFunction: 'jsonpCallbackFunction' },
          'jsonp',
          resolve,
          reject
        );
      };
    });
    assert.isArray(json);
    assert.lengthOf(json, 3);
  });
});
