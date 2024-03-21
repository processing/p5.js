/* eslint no-unused-vars: 0 */

import p5 from '../../src/app.js';

p5._throwValidationErrors = true;

export function promisedSketch(sketch_fn) {
  var myInstance;
  var promise = new Promise(function(resolve, reject) {
    myInstance = new p5(function(sketch) {
      return sketch_fn(sketch, resolve, reject);
    });
  });

  promise.catch(function() {}).then(function() {
    myInstance.remove();
  });
  return promise;
}

export function testSketchWithPromise(name, sketch_fn) {
  var test_fn = function() {
    return promisedSketch(sketch_fn);
  };
  test_fn.toString = function() {
    return sketch_fn.toString();
  };
  return test(name, test_fn);
}

export function testWithDownload(name, fn, asyncFn = false) {
  var test_fn = function(done) {
    // description of this is also on
    // https://github.com/processing/p5.js/pull/4418/

    let blobContainer = {};

    // create a backup of createObjectURL
    let couBackup = window.URL.createObjectURL;

    // file-saver uses createObjectURL as an intermediate step. If we
    // modify the definition a just a little bit we can capture whenever
    // it is called and also peek in the data that was passed to it
    window.URL.createObjectURL = blob => {
      blobContainer.blob = blob;
      return couBackup(blob);
    };

    let error;
    if (asyncFn) {
      fn(blobContainer)
        .then(() => {
          window.URL.createObjectURL = couBackup;
        })
        .catch(err => {
          error = err;
        })
        .finally(() => {
          // restore createObjectURL to the original one
          window.URL.createObjectURL = couBackup;
          error ? done(error) : done();
        });
    } else {
      try {
        fn(blobContainer);
      } catch (err) {
        error = err;
      }
      // restore createObjectURL to the original one
      window.URL.createObjectURL = couBackup;
      error ? done(error) : done();
    }
  };

  return test(name, test_fn);
}

// Tests should run only for the unminified script
export function testUnMinified(name, test_fn) {
  return !window.IS_TESTING_MINIFIED_VERSION ? test(name, test_fn) : null;
}

export function parallelSketches(sketch_fns) {
  var setupPromises = [];
  var resultPromises = [];
  var endCallbacks = [];
  for (let i = 0; i < sketch_fns.length; i++) {
    setupPromises[i] = new Promise(function(resolve) {
      resultPromises[i] = promisedSketch(function(sketch, _resolve, _reject) {
        sketch_fns[i](sketch, _resolve, _reject);
        var old_setup = sketch.setup;
        sketch.setup = function() {
          if (old_setup) {
            old_setup();
          }
          resolve();
        };
        endCallbacks[i] = sketch.finish;
      });
    });
  }

  function end() {
    for (var callback of endCallbacks) {
      if (callback) {
        callback();
      }
    }
  }

  return {
    end: end,
    setup: Promise.all(setupPromises),
    result: Promise.all(resultPromises)
  };
}

export const P5_SCRIPT_URL = '../../lib/p5.js';
export const P5_SCRIPT_TAG = '<script src="' + P5_SCRIPT_URL + '"></script>';

export function createP5Iframe(html) {
  html = html || P5_SCRIPT_TAG;

  var elt = document.createElement('iframe');

  document.body.appendChild(elt);
  elt.style.visibility = 'hidden';

  elt.contentDocument.open();
  elt.contentDocument.write(html);
  elt.contentDocument.close();

  return {
    elt: elt,
    teardown: function() {
      elt.parentNode.removeChild(elt);
    }
  };
}
