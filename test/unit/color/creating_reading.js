import { mockP5, mockP5Prototype } from '../../js/mocks';
import creatingReading from '../../../src/color/creating_reading';
import setting from '../../../src/color/setting';
import p5Color from '../../../src/color/p5.Color';

suite('color/CreatingReading', function() {
  beforeAll(async function() {
    creatingReading(mockP5, mockP5Prototype);
    setting(mockP5, mockP5Prototype);
    p5Color(mockP5, mockP5Prototype);
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

      assert.closeTo(interA._color.coords[0] * 255, 170, 1);
      assert.closeTo(interA._color.coords[1] * 255, 131, 1);
      assert.closeTo(interA._color.coords[2] * 255, 67, 1);

      assert.closeTo(interB._color.coords[0] * 255, 122, 1);
      assert.closeTo(interB._color.coords[1] * 255, 96, 1);
      assert.closeTo(interB._color.coords[2] * 255, 103, 1);
    });

    test('should correctly get lerp colors in HSB', function() {
      // NOTE: This is equivalent to RGB case so is testing nothing new
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0] * 255, 170, 1);
      assert.closeTo(interA._color.coords[1] * 255, 131, 1);
      assert.closeTo(interA._color.coords[2] * 255, 67, 1);

      assert.closeTo(interB._color.coords[0] * 255, 122, 1);
      assert.closeTo(interB._color.coords[1] * 255, 96, 1);
      assert.closeTo(interB._color.coords[2] * 255, 103, 1);
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

      assert.closeTo(interA._color.coords[0] * 255, 170, 1);
      assert.closeTo(interA._color.coords[1] * 255, 131, 1);
      assert.closeTo(interA._color.coords[2] * 255, 67, 1);
      assert.closeTo(interA._color.alpha * 255, 99, 1);

      assert.closeTo(interB._color.coords[0] * 255, 122, 1);
      assert.closeTo(interB._color.coords[1] * 255, 96, 1);
      assert.closeTo(interB._color.coords[2] * 255, 103, 1);
      assert.closeTo(interB._color.alpha * 255, 149, 1);
    });

    test('should correctly get lerp colors in HSL with alpha', function() {
      // NOTE: This is equivalent to RGBA case so is testing nothing new
      mockP5Prototype.colorMode(mockP5Prototype.HSL);
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0] * 255, 170, 1);
      assert.closeTo(interA._color.coords[1] * 255, 131, 1);
      assert.closeTo(interA._color.coords[2] * 255, 67, 1);
      assert.closeTo(interA._color.alpha * 255, 99, 1);

      assert.closeTo(interB._color.coords[0] * 255, 122, 1);
      assert.closeTo(interB._color.coords[1] * 255, 96, 1);
      assert.closeTo(interB._color.coords[2] * 255, 103, 1);
      assert.closeTo(interB._color.alpha * 255, 149, 1);
    });

    test('should correctly get lerp colors in HSB with alpha', function() {
      // NOTE: This is equivalent to RGBA case so is testing nothing new
      mockP5Prototype.colorMode(mockP5Prototype.HSB);
      var interA = mockP5Prototype.lerpColor(fromColor, toColor, 0.33);
      var interB = mockP5Prototype.lerpColor(fromColor, toColor, 0.66);

      assert.closeTo(interA._color.coords[0] * 255, 170, 1);
      assert.closeTo(interA._color.coords[1] * 255, 131, 1);
      assert.closeTo(interA._color.coords[2] * 255, 67, 1);
      assert.closeTo(interA._color.alpha * 255, 99, 1);

      assert.closeTo(interB._color.coords[0] * 255, 122, 1);
      assert.closeTo(interB._color.coords[1] * 255, 96, 1);
      assert.closeTo(interB._color.coords[2] * 255, 103, 1);
      assert.closeTo(interB._color.alpha * 255, 149, 1);
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
