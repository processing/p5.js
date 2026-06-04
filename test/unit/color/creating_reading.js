import { mockP5, mockP5Prototype } from '../../js/mocks';
import creatingReading from '../../../src/color/creating_reading';
import setting from '../../../src/color/setting';
import p5Color from '../../../src/color/p5.Color';

suite('color/CreatingReading', function() {
  beforeAll(async function() {
    creatingReading(mockP5, mockP5Prototype);
    setting(mockP5, mockP5Prototype);
    p5Color(mockP5, mockP5Prototype, {});
  });

  var fromColor;
  var toColor;

  suite.todo('p5.prototype.alpha', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB);
    });
  });

  suite.todo('p5.prototype.red, green, blue', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB);
    });
  });

  suite.todo('p5.prototype.hue, brightness, lightness, saturation', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
    });
  });

  suite('constructor clamping', function() {
    test('should work on multi channels', function() {
      const myColor = mockP5Prototype.color(1000, 1000, 1000, 1000);
      assert.deepEqual(myColor.array(), [1, 1, 1, 1]);
    });
    test('should work on gray + alpha', function() {
      const myColor = mockP5Prototype.color(1000, 1000);
      assert.deepEqual(myColor.array(), [1, 1, 1, 1]);
    });
    test('should work on gray', function() {
      const myColor = mockP5Prototype.color(1000);
      assert.deepEqual(myColor.array(), [1, 1, 1, 1]);
    });
    test('normal values work', function() {
      const myColor = mockP5Prototype.color(255 / 2);
      assert.deepEqual(myColor.array(), [0.5, 0.5, 0.5, 1]);
    });
  });

  suite('p5.prototype.lerpColor', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB);
      fromColor = mockP5Prototype.color(218, 165, 32);
      toColor = mockP5Prototype.color(72, 61, 139);
    });

    test('should correctly get lerp colors in RGB', function() {
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0] * 255, 170, 1);
      assert.closeTo(interA._color.coords[1] * 255, 131, 1);
      assert.closeTo(interA._color.coords[2] * 255, 67, 1);

      assert.closeTo(interB._color.coords[0] * 255, 122, 1);
      assert.closeTo(interB._color.coords[1] * 255, 96, 1);
      assert.closeTo(interB._color.coords[2] * 255, 103, 1);
    });

    test('should correctly get lerp colors in HSL', function() {
      // NOTE: This is equivalent to RGB case so is testing nothing new
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0], 37, 1);
      assert.closeTo(interA._color.coords[1], 43, 1);
      assert.closeTo(interA._color.coords[2], 46, 1);

      assert.closeTo(interB._color.coords[0], 345, 1);
      assert.closeTo(interB._color.coords[1], 12, 1);
      assert.closeTo(interB._color.coords[2], 43, 1);
    });

    test('should correctly get lerp colors in HSB', function() {
      // NOTE: This is equivalent to RGB case so is testing nothing new
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0], 37, 1);
      assert.closeTo(interA._color.coords[1], 60, 1);
      assert.closeTo(interA._color.coords[2], 66, 1);

      assert.closeTo(interB._color.coords[0], 345, 1);
      assert.closeTo(interB._color.coords[1], 20, 1);
      assert.closeTo(interB._color.coords[2], 47, 1);
    });

    test.todo('should not extrapolate', function() {
      // NOTE: maybe it should extrapolate
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, -0.5);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 255]);
      assert.deepEqual(interB.levels, [72, 61, 139, 255]);
    });
  });

  suite('p5.prototype.lerpColor with alpha', function() {
    beforeEach(function() {
      mockP5Prototype.colorMode(mockP5Prototype.RGB);
      fromColor = mockP5Prototype.color(218, 165, 32, 49);
      toColor = mockP5Prototype.color(72, 61, 139, 200);
    });

    test('should correctly get lerp colors in RGB with alpha', function() {
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0], 0.66, 0.01);
      assert.closeTo(interA._color.coords[1], 0.51, 0.01);
      assert.closeTo(interA._color.coords[2], 0.26, 0.01);
      assert.closeTo(interA._color.alpha, 0.38, 0.01);

      assert.closeTo(interB._color.coords[0], 0.47, 0.01);
      assert.closeTo(interB._color.coords[1], 0.37, 0.01);
      assert.closeTo(interB._color.coords[2], 0.40, 0.01);
      assert.closeTo(interB._color.alpha, 0.58, 0.01);
    });

    test('should correctly get lerp colors in HSL with alpha', function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0], 37, 1);
      assert.closeTo(interA._color.coords[1], 43, 1);
      assert.closeTo(interA._color.coords[2], 46, 1);
      assert.closeTo(interA._color.alpha, 0.38, 0.01);

      assert.closeTo(interB._color.coords[0], 345, 1);
      assert.closeTo(interB._color.coords[1], 11, 1);
      assert.closeTo(interB._color.coords[2], 42, 1);
      assert.closeTo(interB._color.alpha, 0.58, 0.01);
    });

    test('should correctly get lerp colors in HSB with alpha', function() {
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0], 37, 1);
      assert.closeTo(interA._color.coords[1], 60, 1);
      assert.closeTo(interA._color.coords[2], 66, 1);
      assert.closeTo(interA._color.alpha, 0.38, 0.01);

      assert.closeTo(interB._color.coords[0], 345, 1);
      assert.closeTo(interB._color.coords[1], 20, 1);
      assert.closeTo(interB._color.coords[2], 47, 1);
      assert.closeTo(interB._color.alpha, 0.58, 0.01);
    });

    test.todo('should not extrapolate', function() {
      // NOTE: maybe it should extrapolate
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, -0.5);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 1.5);
      assert.deepEqual(interA.levels, [218, 165, 32, 49]);
      assert.deepEqual(interB.levels, [72, 61, 139, 200]);
    });
  });
});
