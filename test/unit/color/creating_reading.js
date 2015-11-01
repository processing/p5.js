suite('CreatingReading', function() {
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  var fromColor;
  var toColor;
  suite('p5.prototype.lerpColor', function() {
    setup(function() {
      myp5.colorMode(myp5.RGB);
      fromColor = myp5.color(218, 165, 32);
      toColor = myp5.color(72, 61, 139);
    });
    test('should correctly get lerp colors in RGB', function() {
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [170, 131, 67, 255]);
      assert.deepEqual(interB.levels, [122, 96, 103, 255]);
    });
    test('should correctly get lerp colors in HSL', function() {
      myp5.colorMode(myp5.HSL);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [66, 190, 44, 255]);
      assert.deepEqual(interB.levels, [53, 164, 161, 255]);
    });
    test('should correctly get lerp colors in HSB', function() {
      myp5.colorMode(myp5.HSB);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [69, 192, 47, 255]);
      assert.deepEqual(interB.levels, [56, 166, 163, 255]);
    });
    test('should not extrapolate', function() {
      var interA = myp5.lerpColor(fromColor, toColor, -0.5);
      var interB = myp5.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 255]);
      assert.deepEqual(interB.levels, [72, 61, 139, 255]);
    });
  });
  suite('p5.prototype.lerpColor with alpha', function() {
    setup(function() {
      myp5.colorMode(myp5.RGB);
      fromColor = myp5.color(218, 165, 32, 49);
      toColor = myp5.color(72, 61, 139, 200);
    });
    test('should correctly get lerp colors in RGB with alpha', function() {
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [170, 131, 67, 99]);
      assert.deepEqual(interB.levels, [122, 96, 103, 149]);
    });
    test('should correctly get lerp colors in HSL with alpha', function() {
      myp5.colorMode(myp5.HSL);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [66, 190, 44, 99]);
      assert.deepEqual(interB.levels, [53, 164, 161, 149]);
    });
    test('should correctly get lerp colors in HSB with alpha', function() {
      myp5.colorMode(myp5.HSB);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);
      assert.deepEqual(interA.levels, [69, 192, 47, 99]);
      assert.deepEqual(interB.levels, [56, 166, 163, 149]);
    });
    test('should not extrapolate', function() {
      var interA = myp5.lerpColor(fromColor, toColor, -0.5);
      var interB = myp5.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 49]);
      assert.deepEqual(interB.levels, [72, 61, 139, 200]);
    });
  });
});
