suite('loadPromise', function() {
  const result = {
    testKey: true
  };
  const successPromise = Promise.resolve(result);

  const error = new Error('This is a test error');
  const errorPromise = Promise.reject(error);

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadPromise(errorPromise, reject, function() {
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
      sketch.loadPromise(
        errorPromise,
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
      sketch.loadPromise(successPromise);
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
      sketch.loadPromise(
        successPromise,
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

  test('returns an object with right keys', async function() {
    const returnValue = await promisedSketch(function(sketch, resolve, reject) {
      var returnValue;
      sketch.preload = function() {
        returnValue = sketch.loadPromise(successPromise, function() {}, reject);
      };

      sketch.setup = function() {
        resolve(returnValue);
      };
    });
    assert.deepEqual(returnValue, result);
  });

  test('passes result to success callback', async function() {
    const json = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadPromise(successPromise, resolve, reject);
      };
    });
    assert.isObject(json);
    assert.equal(json, result);
  });

  test('passes error to error callback', async function() {
    const returnValue = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadPromise(errorPromise, reject, resolve);
      };
    });
    assert.equal(returnValue, error);
  });
});
