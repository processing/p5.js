import p5 from '../../../src/app.js';

suite('color/CreatingReading', function() {
  var myp5;

  beforeEach(async function() {
    await new Promise(resolve => {
      new p5(function(p) {
        p.setup = function() {
          myp5 = p;
          resolve();
        };
      });
    });
  });

  afterEach(function() {
    myp5.remove();
  });

  var fromColor;
  var toColor;
  var c;
  var val;

  // TODO: remove all FES tests and implement better regression test
  suite('p5.prototype.alpha', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.RGB);
    });
  });

  suite('p5.prototype.red, green, blue', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.RGB);
    });
  });

  suite('p5.prototype.hue, brightness, lightness, saturation', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.HSL);
    });
  });

  suite('p5.prototype.lerpColor', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.RGB);
      fromColor = myp5.color(218, 165, 32);
      toColor = myp5.color(72, 61, 139);
    });

    test('should correctly get lerp colors in RGB', function() {
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA.color.coords[0] * 255, 170, 1);
      assert.closeTo(interA.color.coords[1] * 255, 131, 1);
      assert.closeTo(interA.color.coords[2] * 255, 67, 1);

      assert.closeTo(interB.color.coords[0] * 255, 122, 1);
      assert.closeTo(interB.color.coords[1] * 255, 96, 1);
      assert.closeTo(interB.color.coords[2] * 255, 103, 1);
    });

    test('should correctly get lerp colors in HSL', function() {
      // NOTE: This is equivalent to RGB case so is testing nothing new
      myp5.colorMode(myp5.HSL);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA.color.coords[0] * 255, 170, 1);
      assert.closeTo(interA.color.coords[1] * 255, 131, 1);
      assert.closeTo(interA.color.coords[2] * 255, 67, 1);

      assert.closeTo(interB.color.coords[0] * 255, 122, 1);
      assert.closeTo(interB.color.coords[1] * 255, 96, 1);
      assert.closeTo(interB.color.coords[2] * 255, 103, 1);
    });

    test('should correctly get lerp colors in HSB', function() {
      // NOTE: This is equivalent to RGB case so is testing nothing new
      myp5.colorMode(myp5.HSB);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA.color.coords[0] * 255, 170, 1);
      assert.closeTo(interA.color.coords[1] * 255, 131, 1);
      assert.closeTo(interA.color.coords[2] * 255, 67, 1);

      assert.closeTo(interB.color.coords[0] * 255, 122, 1);
      assert.closeTo(interB.color.coords[1] * 255, 96, 1);
      assert.closeTo(interB.color.coords[2] * 255, 103, 1);
    });

    test('should not extrapolate', function() {
      // NOTE: maybe it should extrapolate
      var interA = myp5.lerpColor(fromColor, toColor, -0.5);
      var interB = myp5.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 255]);
      assert.deepEqual(interB.levels, [72, 61, 139, 255]);
    });
  });

  suite('p5.prototype.lerpColor with alpha', function() {
    beforeEach(function() {
      myp5.colorMode(myp5.RGB);
      fromColor = myp5.color(218, 165, 32, 49);
      toColor = myp5.color(72, 61, 139, 200);
    });

    test('should correctly get lerp colors in RGB with alpha', function() {
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA.color.coords[0] * 255, 170, 1);
      assert.closeTo(interA.color.coords[1] * 255, 131, 1);
      assert.closeTo(interA.color.coords[2] * 255, 67, 1);
      assert.closeTo(interA.color.alpha * 255, 99, 1);

      assert.closeTo(interB.color.coords[0] * 255, 122, 1);
      assert.closeTo(interB.color.coords[1] * 255, 96, 1);
      assert.closeTo(interB.color.coords[2] * 255, 103, 1);
      assert.closeTo(interB.color.alpha * 255, 149, 1);
    });

    test('should correctly get lerp colors in HSL with alpha', function() {
      // NOTE: This is equivalent to RGBA case so is testing nothing new
      myp5.colorMode(myp5.HSL);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA.color.coords[0] * 255, 170, 1);
      assert.closeTo(interA.color.coords[1] * 255, 131, 1);
      assert.closeTo(interA.color.coords[2] * 255, 67, 1);
      assert.closeTo(interA.color.alpha * 255, 99, 1);

      assert.closeTo(interB.color.coords[0] * 255, 122, 1);
      assert.closeTo(interB.color.coords[1] * 255, 96, 1);
      assert.closeTo(interB.color.coords[2] * 255, 103, 1);
      assert.closeTo(interB.color.alpha * 255, 149, 1);
    });

    test('should correctly get lerp colors in HSB with alpha', function() {
      // NOTE: This is equivalent to RGBA case so is testing nothing new
      myp5.colorMode(myp5.HSB);
      var interA = myp5.lerpColor(fromColor, toColor, 0.33);
      var interB = myp5.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA.color.coords[0] * 255, 170, 1);
      assert.closeTo(interA.color.coords[1] * 255, 131, 1);
      assert.closeTo(interA.color.coords[2] * 255, 67, 1);
      assert.closeTo(interA.color.alpha * 255, 99, 1);

      assert.closeTo(interB.color.coords[0] * 255, 122, 1);
      assert.closeTo(interB.color.coords[1] * 255, 96, 1);
      assert.closeTo(interB.color.coords[2] * 255, 103, 1);
      assert.closeTo(interB.color.alpha * 255, 149, 1);
    });

    test('should not extrapolate', function() {
      // NOTE: maybe it should extrapolate
      var interA = myp5.lerpColor(fromColor, toColor, -0.5);
      var interB = myp5.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 49]);
      assert.deepEqual(interB.levels, [72, 61, 139, 200]);
    });
  });
});
