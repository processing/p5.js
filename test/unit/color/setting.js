suite('Color', function() {

  // p5 instance
  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  suite('p5.prototype.colorMode', function() {
    var colorMode = myp5.colorMode;
    suite('colorMode(RGB)', function() {
      test('should be a function', function() {
        assert.ok(colorMode);
      });

      test('should set mode to RGB', function() {
        myp5.colorMode(myp5.RGB);
        assert.equal(myp5._renderer._colorMode, myp5.RGB);
      });

      test('should correctly set color RGB maxes', function() {
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.RGB], [255, 255, 255, 255]);
        myp5.colorMode(myp5.RGB, 1, 1, 1);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.RGB], [1, 1, 1, 255]);
        myp5.colorMode(myp5.RGB, 1);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.RGB], [1, 1, 1, 1]);
        myp5.colorMode(myp5.RGB, 255, 255, 255, 1);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.RGB], [255, 255, 255, 1]);
        myp5.colorMode(myp5.RGB, 255);
      });

      test('should set mode to HSL', function() {
        myp5.colorMode(myp5.HSL);
        assert.equal(myp5._renderer._colorMode, myp5.HSL);
      });

      test('should correctly set color HSL maxes', function() {
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSL], [360, 100, 100, 1]);
        myp5.colorMode(myp5.HSL, 255, 255, 255);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSL], [255, 255, 255, 1]);
        myp5.colorMode(myp5.HSL, 360);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSL], [360, 360, 360, 360]);
        myp5.colorMode(myp5.HSL, 360, 100, 100, 1);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSL], [360, 100, 100, 1]);
      });

      test('should set mode to HSB', function() {
        myp5.colorMode(myp5.HSB);
        assert.equal(myp5._renderer._colorMode, myp5.HSB);
      });

      test('should correctly set color HSB maxes', function() {
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSB], [360, 100, 100, 1]);
        myp5.colorMode(myp5.HSB, 255, 255, 255);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSB], [255, 255, 255, 1]);
        myp5.colorMode(myp5.HSB, 360);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSB], [360, 360, 360, 360]);
        myp5.colorMode(myp5.HSB, 360, 100, 100, 1);
        assert.deepEqual(myp5._renderer._colorMaxes[myp5.HSB], [360, 100, 100, 1]);
      });
    });
  });
});
