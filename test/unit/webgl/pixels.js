suite('pixels WebGL', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {};
      p.draw = function() {};
    });
  });

  teardown(function() {
    myp5.clear();
  });

  suite('loadpixels()', function() {
    test('loadPixels color check', function(done) {
      myp5.createCanvas(100, 100, myp5.WEBGL);
      myp5.background(0, 100, 0);
      myp5.loadPixels();
      var pixels = myp5.pixels;
      assert.deepEqual(pixels[1], 100);
      assert.deepEqual(pixels[3], 255);
      done();
    });
  });

  suite('get()', function() {
    var img;
    test('get() size check', function(done) {
      img = myp5.get();
      assert.deepEqual(img.width, myp5.width);
      done();
    });

    test('get() can create p5.Image', function(done) {
      assert.isTrue(img instanceof p5.Image);
      done();
    });

    test('get() singlePixel color and size', function(done) {
      myp5.background(100, 115, 100);
      img = myp5.get(0, 0);
      assert.isTrue(img[1] === 115);
      assert.isTrue(img.length === 4);
      done();
    });
  });
});
