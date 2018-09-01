function promisedSketch(sketch_fn) {
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

function testSketchWithPromise(name, sketch_fn) {
  var test_fn = function() {
    return promisedSketch(sketch_fn);
  };
  test_fn.toString = function() {
    return sketch_fn.toString();
  };
  return test(name, test_fn);
}

var P5_SCRIPT_URL = '../../lib/p5.js';
var P5_SCRIPT_TAG = '<script src="' + P5_SCRIPT_URL + '"></script>';

function createP5Iframe(html) {
  html = html || P5_SCRIPT_TAG;

  var elt = document.createElement('iframe');

  document.body.appendChild(elt);
  elt.setAttribute('style', 'visibility: hidden');

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
