/**
 * Expects an image file and a p5 instance with an image file loaded and drawn
 * and checks that they are exactly the same. Sends result to the callback.
 */
var testImageRender = function(file, sketch) {
  sketch.loadPixels();
  var p = sketch.pixels;
  var ctx = sketch;

  sketch.clear();

  return new Promise(function(resolve, reject) {
    sketch.loadImage(file, resolve, reject);
  }).then(function(img) {
    ctx.image(img, 0, 0);

    ctx.loadPixels();
    var n = 0;
    for (var i = 0; i < p.length; i++) {
      var diff = Math.abs(p[i] - ctx.pixels[i]);
      n += diff;
    }
    var same = n === 0 && ctx.pixels.length === p.length;
    return same;
  });
};

suite('loading images', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  var imagePath = 'unit/assets/nyan_cat.gif';

  setup(function disableFileLoadError() {
    sinon.stub(p5, '_friendlyFileLoadError');
  });

  teardown(function restoreFileLoadError() {
    p5._friendlyFileLoadError.restore();
  });

  test('should call successCallback when image loads', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage(imagePath, resolve, reject);
    }).then(function(pImg) {
      assert.ok(pImg, 'nyan_cat.gif loaded');
      assert.isTrue(pImg instanceof p5.Image);
    });
  });

  test('should call failureCallback when unable to load image', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage(
        'invalid path',
        function(pImg) {
          reject('Entered success callback.');
        },
        resolve
      );
    }).then(function(event) {
      assert.equal(event.type, 'error');
      assert.isTrue(p5._friendlyFileLoadError.called);
    });
  });

  test('should draw image with defaults', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/target_small.gif', resolve, reject);
    }).then(function(img) {
      myp5.image(img, 0, 0);
      return testImageRender('unit/assets/target_small.gif', myp5).then(
        function(res) {
          assert.isTrue(res);
        }
      );
    });
  });

  /* TODO: make this resilient to platform differences in image resizing.
  test('should draw cropped image', function() {
    return new Promise(function(resolve, reject) {
      myp5.loadImage('unit/assets/target.gif', resolve, reject);
    }).then(function(img) {
      myp5.image(img, 0, 0, 6, 6, 5, 5, 6, 6);
      return testImageRender('unit/assets/target_small.gif', myp5).then(
        function(res) {
          assert.isTrue(res);
        }
      );
    });
  });
  */

  // Test loading image in preload() with success callback
  test('Test in preload() with success callback');
  test('Test in setup() after preload()');
  // These tests don't work correctly (You can't use suite and test like that)
  // they simply get added at the root level.
  var mySketch = function(this_p5) {
    var myImage;
    this_p5.preload = function() {
      suite('Test in preload() with success callback', function() {
        test('Load asynchronously and use success callback', function(done) {
          myImage = this_p5.loadImage('unit/assets/nyan_cat.gif', function() {
            assert.ok(myImage);
            done();
          });
        });
      });
    };

    this_p5.setup = function() {
      suite('setup() after preload() with success callback', function() {
        test('should be loaded if preload() finished', function(done) {
          assert.isTrue(myImage instanceof p5.Image);
          assert.isTrue(myImage.width > 0 && myImage.height > 0);
          done();
        });
      });
    };
  };
  new p5(mySketch, null, false);

  // Test loading image in preload() without success callback
  mySketch = function(this_p5) {
    var myImage;
    this_p5.preload = function() {
      myImage = this_p5.loadImage('unit/assets/nyan_cat.gif');
    };

    this_p5.setup = function() {
      suite('setup() after preload() without success callback', function() {
        test('should be loaded now preload() finished', function(done) {
          assert.isTrue(myImage instanceof p5.Image);
          assert.isTrue(myImage.width > 0 && myImage.height > 0);
          done();
        });
      });
    };
  };
  new p5(mySketch, null, false);
});
