suite.only('p5.Image', function() {
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

  suite('p5.prototype.createImage', function() {
    test('it creates an image', function() {
      let img = myp5.createImage(10, 17);
      assert.isObject(img);
    });
  });

  suite('p5.Image', function() {
    test('it has necessary properties', function() {
      let img = new p5.Image(100, 100);
      assert.property(img, 'width');
      assert.property(img, 'height');
      assert.property(img, 'canvas');
      assert.property(img, 'loadPixels');
      assert.property(img, 'pixels');
      assert.property(img, 'updatePixels');
    });

    test('height and width are correct', function() {
      let img = new p5.Image(100, 100);
      myp5.pixelDensity(1);
      assert.strictEqual(img.width, 100);
      assert.strictEqual(img.height, 100);
    });
  });

  suite('p5.Image.prototype.resize', function() {
    test('it should resize the image', function() {
      let img = myp5.createImage(10, 17);
      myp5.pixelDensity(1);
      img.resize(10, 30);
      assert.strictEqual(img.width, 10);
      assert.strictEqual(img.height, 30);
    });
  });
});
