/* global testSketchWithPromise */
/* This file tests the three user-implemented functions preload, setup and draw
 * to ensure that a returned Promise will be respected by p5
 */

suite('Promises', function() {
  suite('preload', function() {
    testSketchWithPromise('ignores a non-Promise return', function(
      sketch,
      resolve,
      reject
    ) {
      sketch.preload = function() {
        return 4;
      };

      sketch.setup = resolve;
      sketch.draw = function() {
        reject(new Error('Draw was called before setup'));
      };
    });

    testSketchWithPromise('loading stops when preload rejects', function(
      sketch,
      resolve,
      reject
    ) {
      sketch.preload = function() {
        setTimeout(resolve, 50);
        return Promise.reject();
      };

      sketch.setup = function() {
        reject(new Error('Setup was called'));
      };
      sketch.draw = function() {
        reject(new Error('Draw was called before setup'));
      };
    });

    testSketchWithPromise('setup runs when preload is fulfilled', function(
      sketch,
      resolve,
      reject
    ) {
      var resolved = false;
      sketch.preload = function() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolved = true;
            resolve();
          }, 100);
        });
      };

      sketch.setup = function() {
        if (!resolved) {
          reject(new Error('Setup was called before fulfilment'));
        } else {
          resolve();
        }
      };
      sketch.draw = function() {
        reject(new Error('Draw was called before setup'));
      };
    });
  });

  suite('setup', function() {
    testSketchWithPromise('ignores a non-Promise return', function(
      sketch,
      resolve,
      reject
    ) {
      sketch.setup = function() {
        return 4;
      };

      sketch.draw = resolve;
    });

    testSketchWithPromise('loading stops when setup rejects', function(
      sketch,
      resolve,
      reject
    ) {
      sketch.setup = function() {
        setTimeout(resolve, 50);
        return Promise.reject();
      };

      sketch.draw = function() {
        reject(new Error('Draw was called'));
      };
    });

    testSketchWithPromise('draw runs when setup is fulfilled', function(
      sketch,
      resolve,
      reject
    ) {
      var resolved = false;
      sketch.setup = function() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolved = true;
            resolve();
          }, 100);
        });
      };

      sketch.draw = function() {
        if (!resolved) {
          reject(new Error('Draw was called before fulfilment'));
        } else {
          resolve();
        }
      };
    });
  });

  suite('draw', function() {
    testSketchWithPromise('ignores a non-Promise return', function(
      sketch,
      resolve,
      reject
    ) {
      var run = false;
      sketch.draw = function() {
        if (run) {
          resolve();
        } else {
          run = true;
        }
        return 4;
      };
    });

    testSketchWithPromise('stops looping after a rejection', function(
      sketch,
      resolve,
      reject
    ) {
      var run = false;
      sketch.draw = function() {
        if (run) {
          reject();
        } else {
          run = true;
          setTimeout(resolve, 100);
          return Promise.reject();
        }
      };
    });

    testSketchWithPromise('waits until previous draw is fulfilled', function(
      sketch,
      resolve,
      reject
    ) {
      var run = false;
      var resolved = false;
      sketch.draw = function() {
        if (run) {
          if (resolved) {
            resolve();
          } else {
            reject(new Error('Draw ran before previous draw fulfilled'));
          }
        } else {
          run = true;
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolved = true;
              resolve();
            }, 100);
          });
        }
      };
    });
  });
});
