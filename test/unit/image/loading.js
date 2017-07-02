/**
 * Expects an image file and a p5 instance with an image file loaded and drawn
 * and checks that they are exactly the same. Sends result to the callback.
 */
var testImageRender = function(file, sketch, callback) {
  sketch.loadPixels();
  var p = sketch.pixels;
  var ctx = sketch;

  sketch.drawingContext.clearRect(0,0,this.width, this.height);

  sketch.loadImage(file, function(img) {
    ctx.image(img, 0, 0);

    ctx.loadPixels();
    var n = 0;
    for (var i=0; i<p.length; i++) {
      var diff = Math.abs(p[i] - ctx.pixels[i]);
      n += diff;
    }
    var same = n === 0 && (ctx.pixels.length === p.length);
    callback(same);
  });
};

suite('loading images', function () {
  var myp5 = new p5(function () {
  }, true);
  var imagePath = '../unit/assets/nyan_cat.gif';

  setup(function disableFileLoadError() {
    sinon.stub(p5, '_friendlyFileLoadError');
  });

  teardown(function restoreFileLoadError() {
    p5._friendlyFileLoadError.restore();
  });

  test('should call successCallback when image loads', function (done) {
    myp5.loadImage(
      imagePath,
      function (pImg) {
        assert.ok('nyan_cat.gif loaded');
        done();
      },
      function (event) {
        assert.fail();
        done();
      });
  });

  test('should call successCallback when image loads', function (done) {
    myp5.loadImage(
      imagePath,
      function (pImg) {
        assert.isTrue(pImg instanceof p5.Image);
        done();
      },
      function (event) {
        assert.fail();
        done();
      });
  });

  test('should call failureCallback when unable to load image', function (done) {
    myp5.loadImage(
      'invalid path',
      function (pImg) {
        assert.fail();
        done();
      },
      function (event) {
        assert.equal(event.type, 'error');
        assert.isTrue(p5._friendlyFileLoadError.called);
        done();
      });
  });

  test('should draw image with defaults', function(done) {
    myp5.loadImage(
      '../unit/assets/target_small.gif', function(img) {
        myp5.image(img, 0, 0);

        testImageRender('../unit/assets/target_small.gif', myp5, function(res) {
          assert.isTrue(res);
          done();
        });
      }
    );
  });

  test('should draw cropped image', function(done) {
    myp5.loadImage(
      '../unit/assets/target.gif', function(img) {
        myp5.image(img, 0, 0, 6, 6, 5, 5, 6, 6);

        testImageRender('../unit/assets/target_small.gif', myp5, function(res) {
          assert.isTrue(res);
          done();
        });
      }
    );
  });
});

// Test loading image in preload() with success callback
var mySketch = function (this_p5) {
  var myImage;
  this_p5.preload = function () {
    suite('Test in preload() with success callback', function () {
      test('Load asynchronously and use success callback', function (done) {
        myImage = this_p5.loadImage('../unit/assets/nyan_cat.gif', function () {
          assert.ok(myImage);
          done();
        });
      });
    });
  };

  this_p5.setup = function () {
    suite('setup() after preload() with success callback', function () {
      test('Resource should be loaded now if preload() finished', function (done) {
        assert.isTrue(myImage instanceof p5.Image);
        assert.isTrue(myImage.width > 0 && myImage.height > 0);
        done();
      });
    });
  };
};
new p5(mySketch, null, false);

// Test loading image in preload() without success callback
mySketch = function (this_p5) {
  var myImage;
  this_p5.preload = function () {
    myImage = this_p5.loadImage('../unit/assets/nyan_cat.gif');
  };

  this_p5.setup = function () {
    suite('setup() after preload() without success callback', function () {
      test('Resource should be loaded now if preload() finished', function (done) {
        assert.isTrue(myImage instanceof p5.Image);
        assert.isTrue(myImage.width > 0 && myImage.height > 0);
        done();
      });
    });
  };
};
new p5(mySketch, null, false);
