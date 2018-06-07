/* global testSketchWithPromise */
suite('loadShader', function() {
  var invalidFile = '404file';
  var vertFile = 'unit/assets/vert.glsl';
  var fragFile = 'unit/assets/frag.glsl';

  testSketchWithPromise('error with vert prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sinon.stub(console, 'error');
      sketch.loadShader(invalidFile, fragFile);
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

  testSketchWithPromise('error with frag prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sinon.stub(console, 'error');
      sketch.loadShader(vertFile, invalidFile);
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
      sketch.loadShader(vertFile);
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
    var shader;
    sketch.preload = function() {
      shader = sketch.loadShader(vertFile, function() {}, reject);
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.instanceOf(shader, p5.Shader);
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
      sketch.loadShader(
        vertFile,
        function(shader) {
          resolve(
            new Promise(function(resolve, reject) {
              assert.instanceOf(shader, p5.Shader);
              resolve();
            })
          );
        },
        reject
      );
    };
  });
});
