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

  suite('p5.Image.pixels', function() {
    test('should be an array of pixels', function() {
      let img = myp5.createImage(10, 10);
      img.loadPixels();
      assert.typeOf(img.pixels, 'Uint8ClampedArray');
    });

    test('should store r, g, b, a values for each pixel', function() {
      let img = myp5.createImage(10, 10);
      myp5.pixelDensity(1);
      img.loadPixels();
      assert.strictEqual(img.pixels.length, 400);
    });

    test('should store correct r, g, b, a values for each pixel', function() {
      let img = myp5.createImage(10, 10);
      myp5.pixelDensity(1);
      img.loadPixels();
      img.pixels[0] = 255;
      img.pixels[1] = 102;
      img.pixels[2] = 204;
      img.pixels[3] = 255;
      img.updatePixels();

      assert.strictEqual(img.pixels[0], 255);
      assert.strictEqual(img.pixels[1], 102);
      assert.strictEqual(img.pixels[2], 204);
      assert.strictEqual(img.pixels[3], 255);
    });
  });

  suite('p5.Image.set', function() {
    /* Parameter Validation missing */
    test('set(x,y) changes color of pixel (x, y)', function() {
      let img = myp5.createImage(50, 50);
      img.loadPixels();
      img.set(0, 0, myp5.color(255, 34, 19));
      img.updatePixels();
      assert.deepEqual(img.get(0, 0), [255, 34, 19, 255]);
    });
  });

  suite('p5.Image.blend', function() {
    test('should copy a region of pixels using the specified blend mode', function() {
      let img = myp5.createImage(50, 50);
      let img2 = myp5.createImage(50, 50);
      img.loadPixels();
      for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
          img.set(i, j, myp5.color(255, 0, 0)); // red
        }
      }
      img.updatePixels();
      img2.loadPixels();
      for (let i = 0; i < img2.width; i++) {
        for (let j = 0; j < img2.height; j++) {
          img2.set(i, j, myp5.color(255, 255, 0)); // yellow
        }
      }
      img2.updatePixels();
      img.blend(img2, 0, 0, 10, 10, 0, 0, 10, 10, myp5.NORMAL); // blend yellow on red in normal mode
      myp5.image(img, 0, 0);

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          assert.deepEqual(img.get(i, j), [255, 255, 0, 255]); // should be yellow
        }
      }
    });

    test('wrong parameter at #8', function() {
      assert.validationError(function() {
        let img = myp5.createImage(50, 50);
        img.blend(0, 0, 10, 10, 10, 0, 10, 10, 'a');
      });
    });

    test('no friendly-err-msg. missing param #0', function() {
      assert.doesNotThrow(
        function() {
          let img = myp5.createImage(50, 50);
          img.blend(0, 0, 10, 10, 10, 0, 10, 10, myp5.OVERLAY);
        },
        Error,
        'got unwanted exception'
      );
    });

    test('missing parameter at #3 ', function() {
      assert.throw(function() {
        let img = myp5.createImage(50, 50);
        img.blend(0, 0, 10, 10, 0, 10, 10, myp5.OVERLAY);
      });
    });

    test('missing parameter at #8 ', function() {
      assert.throw(function() {
        let img = myp5.createImage(50, 50);
        img.blend(0, 0, 10, 10, 10, 0, 10, 10);
      });
    });
  });

  suite('p5.Image.copy', function() {
    test('should copy a region of pixels', function() {
      let img = myp5.createImage(50, 50);
      let img2 = myp5.createImage(50, 50);
      img.loadPixels();
      for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
          img.set(i, j, myp5.color(255, 0, 0)); // red
        }
      }
      img.updatePixels();
      img2.loadPixels();
      for (let i = 0; i < img2.width; i++) {
        for (let j = 0; j < img2.height; j++) {
          img2.set(i, j, myp5.color(0, 255, 0)); // green
        }
      }
      img2.updatePixels();
      img.copy(img2, 0, 0, 10, 10, 0, 0, 10, 10); // copy green on red
      myp5.image(img, 0, 0);

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          assert.deepEqual(img.get(i, j), [0, 255, 0, 255]); // should be green
        }
      }
    });

    test('no friendly-err-msg. missing param #0', function() {
      assert.doesNotThrow(
        function() {
          let img = myp5.createImage(50, 50);
          img.copy(0, 0, 10, 10, 10, 0, 10, 10);
        },
        Error,
        'got unwanted exception'
      );
    });

    test('missing parameter at #3 ', function() {
      assert.throw(function() {
        let img = myp5.createImage(50, 50);
        img.copy(0, 0, 10, 10, 0, 10, 10);
      });
    });
  });
});
