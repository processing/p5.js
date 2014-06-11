suite('Color', function() {

  // p5 instance
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  suite('p5.prototype.colorMode', function() {
    var colorMode = myp5._colorMode;
    suite('colorMode(RGB)', function() {
      test('should be a function', function() {
        assert.ok(colorMode);
      });
      test('should set mode to HSB', function() {
        myp5.colorMode(myp5.HSB);
        assert.equal(myp5._colorMode, myp5.HSB);
      });
    });
  });

  suite('p5.prototype.getNormalizedColor', function() {
    suite('colorMode(RGB)', function() {
      test('should be a function', function() {
        var getNormalizedColor = myp5.getNormalizedColor;
        assert.ok(getNormalizedColor);
      });
      test('should parse a greyscale value to RGBA', function() {
        var color = myp5.getNormalizedColor(255);
        assert.deepEqual(color, [255, 255, 255, 255]);
        color = myp5.getNormalizedColor(0);
        assert.deepEqual(color, [0, 0, 0, 255]);
        color = myp5.getNormalizedColor([100]);
        assert.deepEqual(color, [100, 100, 100, 255], 'accepts array values');
      });
      test('should parse a greyscale value & alpha value to RGBA', function() {
        var color = myp5.getNormalizedColor(255, 50);
        assert.deepEqual(color, [255, 255, 255, 50]);
        color = myp5.getNormalizedColor([255, 50]);
        assert.deepEqual(color, [255, 255, 255, 50], 'accepts array values');
      });
      test('should parse RGB values to RGBA', function() {
        var color = myp5.getNormalizedColor(0, 100, 200);
        assert.deepEqual(color, [0, 100, 200, 255]);
        color = myp5.getNormalizedColor([0, 100, 200]);
        assert.deepEqual(color, [0, 100, 200, 255], 'accepts array values');
      });
      test('should normalize format of RGBA values', function() {
        var color = myp5.getNormalizedColor(25, 50, 75, 100);
        assert.deepEqual(color, [25, 50, 75, 100]);
        color = myp5.getNormalizedColor([25, 50, 75, 100]);
        assert.deepEqual(color, [25, 50, 75, 100], 'accepts array values');
      });
      test('should parse a hex RGB color string to RGBA', function() {
        var color = myp5.getNormalizedColor('760F8B');
        assert.deepEqual(color, [118, 15, 75, 255]);
        color = myp5.getNormalizedColor('#483D8B');
        assert.deepEqual(color, [72, 61, 139, 255], 'strips # from hex string');
      });
      test('should respect instance._maxA', function() {
        myp5._maxA = 100;
        var color = myp5.getNormalizedColor(255);
        assert.deepEqual(color, [255, 255, 255, 100]);
      });
    });
  });

});
