suite('pixels', function() {
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

  suite('p5.Image.get', function() {
    var img;

    setup(function() {
      //create a 50 x 50 half red half green image
      img = myp5.createImage(50, 50);
      img.loadPixels();

      for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {
          var col;

          if (j <= 25) {
            col = myp5.color(255, 0, 0);
          } else {
            col = myp5.color(0, 0, 255);
          }

          img.set(i, j, col);
        }
      }

      img.updatePixels();
    });

    test('get(x,y) works with integers', function() {
      assert.deepEqual(img.get(25, 25), [255, 0, 0, 255]);
      assert.deepEqual(img.get(25, 26), [0, 0, 255, 255]);
      assert.deepEqual(img.get(0, 0), [255, 0, 0, 255]);
      assert.deepEqual(img.get(49, 49), [0, 0, 255, 255]);
    });

    test('get(x,y) returns 0s for out of bounds arguments', function() {
      assert.deepEqual(img.get(25, -1), [0, 0, 0, 0]);
      assert.deepEqual(img.get(-1, 26), [0, 0, 0, 0]);
      assert.deepEqual(img.get(25, 50), [0, 0, 0, 0]);
      assert.deepEqual(img.get(50, 26), [0, 0, 0, 0]);
    });

    test('get() returns a copy when no arguments are supplied', function() {
      var copy = img.get();
      assert.instanceOf(copy, p5.Image);
      assert.equal(copy.width, img.width);
      assert.equal(copy.height, img.height);

      assert.deepEqual(copy.get(25, 25), [255, 0, 0, 255]);
      assert.deepEqual(copy.get(25, 26), [0, 0, 255, 255]);
      assert.deepEqual(copy.get(0, 0), [255, 0, 0, 255]);
      assert.deepEqual(copy.get(49, 49), [0, 0, 255, 255]);
    });

    test('get(x,y,w,h) works', function() {
      for (var w = 1; w < img.width + 5; w += 2) {
        for (var x = -w * 2; x <= img.width + w * 2; x += 4) {
          var copy = img.get(x, x, w, w);
          assert.instanceOf(copy, p5.Image);
          assert.equal(copy.width, w);
          assert.equal(copy.height, w);
          assert.deepEqual(copy.get(0, 0), img.get(x, x));
        }
      }
    });

    test('rounds down when given decimal numbers', function() {
      assert.deepEqual(img.get(25, 25.999), img.get(25, 25));
    });
  });
});
