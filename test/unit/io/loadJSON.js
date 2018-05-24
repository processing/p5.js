/* global testSketchWithPromise */
suite('loadJSON', function() {
  var invalidFile = '404file';
  var jsonArrayFile = 'unit/assets/array.json';
  var jsonObjectFile = 'unit/assets/object.json';

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sinon.stub(console, 'error');
      sketch.loadJSON(invalidFile);
      setTimeout(function() {
        if (!console.error.calledOnce) {
          reject(new Error('console.error was not called'));
        }
        console.error.restore();
        resolve();
      }, 100);
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

  testSketchWithPromise('returns an object for object JSON.', function(
    sketch,
    resolve,
    reject
  ) {
    var json;
    sketch.preload = function() {
      json = sketch.loadJSON(jsonObjectFile, function() {}, reject);
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.isObject(json);
          resolve();
        })
      );
    };
  });

  testSketchWithPromise(
    'passes an object to success callback for object JSON.',
    function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadJSON(
          jsonObjectFile,
          function(json) {
            resolve(
              new Promise(function(resolve, reject) {
                assert.isObject(json);
                resolve();
              })
            );
          },
          reject
        );
      };
    }
  );

  // Does not work with the current loadJSON.
  test('returns an array for array JSON');
  // testSketchWithPromise('returns an array for array JSON', function(
  //   sketch,
  //   resolve,
  //   reject
  // ) {
  //   var json;
  //   sketch.preload = function() {
  //     json = sketch.loadJSON(jsonArrayFile, function() {}, reject);
  //   };
  //
  //   sketch.setup = function() {
  //     resolve(
  //       new Promise(function(resolve, reject) {
  //         assert.isArray(json);
  //         assert.lengthOf(json, 3);
  //         resolve();
  //       })
  //     );
  //   };
  // });

  testSketchWithPromise(
    'passes an array to success callback for array JSON',
    function(sketch, resolve, reject) {
      sketch.preload = function() {
        sketch.loadJSON(
          jsonArrayFile,
          function(json) {
            resolve(
              new Promise(function(resolve, reject) {
                assert.isArray(json);
                assert.lengthOf(json, 3);
                resolve();
              })
            );
          },
          reject
        );
      };
    }
  );
});
