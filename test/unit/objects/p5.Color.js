suite('p5.Color', function() {
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });
  var c;

  suite('p5.prototype.color(a,b,c)', function() {
    setup(function() {
      c = myp5.color(10, 20, 30, 255);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });

    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 20, 30, 255]);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [149, 170, 30, 255] );
    });

    test('should correctly set RGBA values', function() {
      assert.equal(c.getRed(), 10);
      assert.equal(c.getGreen(), 20);
      assert.equal(c.getBlue(), 30);
      assert.equal(c.getAlpha(), 255);
    });

    test('should correctly set HSB values', function() {
      assert.equal(c.getHue(), 149);
      assert.equal(c.getSaturation(), 170);
      assert.equal(c.getBrightness(), 30);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,20,30,1)');
    });
  });

  suite('p5.prototype.color([])', function() {
    setup(function() {
      c = myp5.color([10, 20, 30]);
    });
    test('should create instance of p5.Color', function() {
      assert.instanceOf(c, p5.Color);
    });
    test('should correctly set RGBA property', function() {
      assert.deepEqual(c.rgba, [10, 20, 30, 255]);
    });
  });

  suite('new p5.Color in HSB mode', function() {
    setup(function() {
      myp5.colorMode(myp5.HSB);
      c = myp5.color(149, 170, 30, 255);
    });

    test('should correctly set HSBA property', function() {
      assert.deepEqual(c.hsba, [149, 170, 30, 255]);
    });

    test('should correctly convert to RGBA', function() {
      assert.deepEqual(c.rgba, [10, 20, 30, 255]);
    });

    test('should correctly render color string', function() {
      assert.equal(c.toString(), 'rgba(10,20,30,1)');
    });
  });

  suite('new p5.Color with Base 1 colors', function() {
    var base_1_rgba = [0.2, 0.4, 0.6, 0.5]; 
    var base_255_rgba = [51, 102, 153, 127.5];

    setup(function() {
      myp5.colorMode(myp5.RGB, 1);
      c = myp5.color.apply(myp5, base_1_rgba);
    });

    test('should correctly set RGBA', function() {
      assert.deepEqual(c.rgba, base_255_rgba);
    });

    test('should correctly convert to HSB', function() {
      assert.deepEqual(c.hsba, p5.ColorUtils.rgbaToHSBA(base_255_rgba));
    });

    test('should correctly set color string', function() {
      assert.equal(c.toString(), 'rgba(51,102,153,0.5)');
    });
  });
});