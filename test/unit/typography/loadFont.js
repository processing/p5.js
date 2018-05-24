/* global testSketchWithPromise */
suite('loadFont', function() {
  var invalidFile = '404file';
  var fontFile = 'manual-test-examples/p5.Font/acmesa.ttf';

  testSketchWithPromise('error prevents sketch continuing', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sinon.stub(console, 'error');
      sketch.loadFont(invalidFile);
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

  testSketchWithPromise('returns a p5.Font object', function(
    sketch,
    resolve,
    reject
  ) {
    var font;
    sketch.preload = function() {
      font = sketch.loadFont(fontFile, function() {}, reject);
    };

    sketch.setup = function() {
      resolve(
        new Promise(function(resolve, reject) {
          assert.instanceOf(font, p5.Font);
          resolve();
        })
      );
    };
  });

  testSketchWithPromise('passes a p5.Font object to success callback', function(
    sketch,
    resolve,
    reject
  ) {
    sketch.preload = function() {
      sketch.loadFont(
        fontFile,
        function(font) {
          resolve(
            new Promise(function(resolve, reject) {
              assert.instanceOf(font, p5.Font);
              resolve();
            })
          );
        },
        reject
      );
    };
  });
});
