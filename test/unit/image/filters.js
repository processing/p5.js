suite('Filters', function() {
  var myp5;
  let img;
  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        myp5.createCanvas(10, 10);
        img = myp5.createImage(10, 10);
        myp5.pixelDensity(1);
        img.loadPixels();
        for (let i = 0; i < img.width; i++) {
          for (let j = 0; j < img.height; j++) {
            img.set(i, j, myp5.color(120, 20, 40));
          }
        }
        img.updatePixels();
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  test('threshold filter. less than threshold', function() {
    img.filter(myp5.THRESHOLD);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], 0);
      assert.strictEqual(myp5.pixels[i + 1], 0);
      assert.strictEqual(myp5.pixels[i + 2], 0);
    }
  });

  test('threshold filter. greater than threshold', function() {
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        img.set(i, j, myp5.color(211, 228, 250));
      }
    }
    img.updatePixels();
    img.filter(myp5.THRESHOLD);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], 255);
      assert.strictEqual(myp5.pixels[i + 1], 255);
      assert.strictEqual(myp5.pixels[i + 2], 255);
    }
  });

  test('gray filter', function() {
    img.filter(myp5.GRAY);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], myp5.pixels[i + 1]); // r, g, b values should be equal for gray
      assert.strictEqual(myp5.pixels[i + 1], myp5.pixels[i + 2]);
    }
  });

  test('opaque filter', function() {
    img.loadPixels();
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        img.set(i, j, myp5.color(120, 20, 40, 10));
      }
    }
    img.updatePixels();
    img.filter(myp5.OPAQUE);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i + 3], 255); // 'a' value should be 255 after OPAQUE filter
    }
  });

  test('invert filter', function() {
    img.filter(myp5.INVERT);
    myp5.image(img, 0, 0);
    myp5.loadPixels();
    for (let i = 0; i < img.width * img.height; i += 4) {
      assert.strictEqual(myp5.pixels[i], 135);
      assert.strictEqual(myp5.pixels[i + 1], 235);
      assert.strictEqual(myp5.pixels[i + 2], 215);
    }
  });
});
