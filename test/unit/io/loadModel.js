/* global testSketchWithPromise */
suite('loadModel', function() {
  var invalidFile = '404file';
  var validFile = 'unit/assets/teapot.obj';

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sinon.stub(console, 'error');
      sketch.loadModel(invalidFile);
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
      sketch.loadModel(
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
      sketch.loadModel(validFile);
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
      sketch.loadModel(
        validFile,
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

  testSketchWithPromise('returns an object with correct data', function(
    sketch,
    resolve,
    reject
  ) {
    var model;
    sketch.preload = function() {
      model = sketch.loadModel(validFile, function() {}, reject);
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.instanceOf(model, p5.Geometry);
          resolve();
        })
      );
    };
  });

  testSketchWithPromise('passes an object with correct data', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadModel(
        validFile,
        function(model) {
          resolve(
            new Promise(function(resolve, reject) {
              assert.instanceOf(model, p5.Geometry);
              resolve();
            })
          );
        },
        reject
      );
    };
  });
});
