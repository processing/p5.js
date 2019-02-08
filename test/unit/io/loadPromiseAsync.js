suite('loadPromiseAsync', function() {
  const result = {};
  const successPromise = Promise.resolve(result);

  const error = new Error('This is a test error');
  const errorPromise = Promise.reject(error);

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadPromiseAsync(errorPromise, reject, function() {
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
      sketch.loadPromiseAsync(
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
      sketch.loadPromiseAsync(successPromise);
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
      sketch.loadPromiseAsync(
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

  test('returns a resolving promise correctly', async function() {
    const returnValue = await promisedSketch(function(sketch, resolve, reject) {
      var returnValue;
      sketch.preload = function() {
        returnValue = sketch.loadPromiseAsync(
          successPromise,
          function() {},
          reject
        );
      };

      sketch.setup = function() {
        // This prevents the promise from being evaluated inside resolve()
        resolve({
          promise: returnValue
        });
      };
    });
    const promise = returnValue.promise;
    assert.instanceOf(promise, Promise);
    const promiseResult = await promise;
    assert.equal(promiseResult, result);
  });

  test('passes result to success callback', async function() {
    const json = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadPromiseAsync(successPromise, resolve, reject);
      };
    });
    assert.isObject(json);
    assert.equal(json, result);
  });

  test('returns an erroring promise correctly', async function() {
    const returnValue = await promisedSketch(function(sketch, resolve, reject) {
      var returnValue;
      sketch.preload = function() {
        returnValue = sketch.loadPromiseAsync(errorPromise, reject);
        // This prevents the promise from being evaluated inside resolve()
        resolve({
          promise: returnValue
        });
      };
    });
    const promise = returnValue.promise;
    assert.instanceOf(promise, Promise);
    try {
      await promise;
    } catch (promiseError) {
      assert.equal(promiseError, error);
      return;
    }
    throw new Error('Returned promise did not throw an error');
  });

  test('passes error to error callback', async function() {
    const returnValue = await promisedSketch(function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadPromiseAsync(errorPromise, reject, resolve);
      };
    });
    assert.equal(returnValue, error);
  });
});
