/**
 * Tests for the HSB (Hue, Saturation, Brightness) color space.
 *
 * The HSB color space is defined in src/color/color_spaces/hsb.js and provides
 * conversions between RGB (base) and HSB color representations.
 *
 * HSB ranges:
 * - Hue: 0-360 (degrees on color wheel)
 * - Saturation: 0-100 (percentage)
 * - Brightness: 0-100 (percentage)
 *
 * RGB ranges (in colorjs.io):
 * - R, G, B: 0-1 (normalized)
 */

import HSBSpace from '../../../src/color/color_spaces/hsb.js';

assert.arrayApproximately = function (arr1, arr2, delta, desc) {
  assert.equal(arr1.length, arr2.length);
  for (var i = 0; i < arr1.length; i++) {
    assert.approximately(arr1[i], arr2[i], delta, desc);
  }
}

suite('color/HSB Color Space', function() {
  const accuracy = 0.01;

  suite('HSB to RGB conversion (toBase)', function() {
    suite('Primary Colors', function() {
      test('pure red: HSB(0, 100, 100) → RGB(1, 0, 0)', function() {
        const result = HSBSpace.toBase([0, 100, 100]);
        assert.approximately(result[0], 1, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });

      test('pure green: HSB(120, 100, 100) → RGB(0, 1, 0)', function() {
        const result = HSBSpace.toBase([120, 100, 100]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 1, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });

      test('pure blue: HSB(240, 100, 100) → RGB(0, 0, 1)', function() {
        const result = HSBSpace.toBase([240, 100, 100]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 1, accuracy);
      });
    });

    suite('Secondary Colors', function() {
      test('yellow: HSB(60, 100, 100) → RGB(1, 1, 0)', function() {
        const result = HSBSpace.toBase([60, 100, 100]);
        assert.approximately(result[0], 1, accuracy);
        assert.approximately(result[1], 1, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });

      test('cyan: HSB(180, 100, 100) → RGB(0, 1, 1)', function() {
        const result = HSBSpace.toBase([180, 100, 100]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 1, accuracy);
        assert.approximately(result[2], 1, accuracy);
      });

      test('magenta: HSB(300, 100, 100) → RGB(1, 0, 1)', function() {
        const result = HSBSpace.toBase([300, 100, 100]);
        assert.approximately(result[0], 1, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 1, accuracy);
      });
    });

    suite('Grayscale (Saturation = 0)', function() {
      test('white: HSB(0, 0, 100) → RGB(1, 1, 1)', function() {
        const result = HSBSpace.toBase([0, 0, 100]);
        assert.approximately(result[0], 1, accuracy);
        assert.approximately(result[1], 1, accuracy);
        assert.approximately(result[2], 1, accuracy);
      });

      test('black: HSB(0, 0, 0) → RGB(0, 0, 0)', function() {
        const result = HSBSpace.toBase([0, 0, 0]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });

      test('mid gray: HSB(0, 0, 50) → RGB(0.5, 0.5, 0.5)', function() {
        const result = HSBSpace.toBase([0, 0, 50]);
        assert.approximately(result[0], 0.5, accuracy);
        assert.approximately(result[1], 0.5, accuracy);
        assert.approximately(result[2], 0.5, accuracy);
      });

      test('grayscale ignores hue: HSB(180, 0, 50) → RGB(0.5, 0.5, 0.5)', function() {
        const result = HSBSpace.toBase([180, 0, 50]);
        assert.approximately(result[0], 0.5, accuracy);
        assert.approximately(result[1], 0.5, accuracy);
        assert.approximately(result[2], 0.5, accuracy);
      });
    });

    suite('Partial Saturation', function() {
      test('50% saturation red: HSB(0, 50, 100) → RGB(1, 0.5, 0.5)', function() {
        const result = HSBSpace.toBase([0, 50, 100]);
        assert.approximately(result[0], 1, accuracy);
        assert.approximately(result[1], 0.5, accuracy);
        assert.approximately(result[2], 0.5, accuracy);
      });

      test('50% brightness red: HSB(0, 100, 50) → RGB(0.5, 0, 0)', function() {
        const result = HSBSpace.toBase([0, 100, 50]);
        assert.approximately(result[0], 0.5, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });
    });

    suite('Edge Cases', function() {
      test('hue at 360 should be same as 0 (red)', function() {
        const result = HSBSpace.toBase([360, 100, 100]);
        assert.approximately(result[0], 1, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });

      test('brightness 0 produces black regardless of hue/saturation', function() {
        const result = HSBSpace.toBase([120, 100, 0]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });
    });
  });

  suite('RGB to HSB conversion (fromBase)', function() {
    suite('Primary Colors', function() {
      test('pure red: RGB(1, 0, 0) → HSB(0, 100, 100)', function() {
        const result = HSBSpace.fromBase([1, 0, 0]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 100, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });

      test('pure green: RGB(0, 1, 0) → HSB(120, 100, 100)', function() {
        const result = HSBSpace.fromBase([0, 1, 0]);
        assert.approximately(result[0], 120, accuracy);
        assert.approximately(result[1], 100, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });

      test('pure blue: RGB(0, 0, 1) → HSB(240, 100, 100)', function() {
        const result = HSBSpace.fromBase([0, 0, 1]);
        assert.approximately(result[0], 240, accuracy);
        assert.approximately(result[1], 100, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });
    });

    suite('Secondary Colors', function() {
      test('yellow: RGB(1, 1, 0) → HSB(60, 100, 100)', function() {
        const result = HSBSpace.fromBase([1, 1, 0]);
        assert.approximately(result[0], 60, accuracy);
        assert.approximately(result[1], 100, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });

      test('cyan: RGB(0, 1, 1) → HSB(180, 100, 100)', function() {
        const result = HSBSpace.fromBase([0, 1, 1]);
        assert.approximately(result[0], 180, accuracy);
        assert.approximately(result[1], 100, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });

      test('magenta: RGB(1, 0, 1) → HSB(300, 100, 100)', function() {
        const result = HSBSpace.fromBase([1, 0, 1]);
        assert.approximately(result[0], 300, accuracy);
        assert.approximately(result[1], 100, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });
    });

    suite('Grayscale', function() {
      test('white: RGB(1, 1, 1) → HSB(0, 0, 100)', function() {
        const result = HSBSpace.fromBase([1, 1, 1]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });

      test('black: RGB(0, 0, 0) → HSB(0, 0, 0)', function() {
        const result = HSBSpace.fromBase([0, 0, 0]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 0, accuracy);
      });

      test('mid gray: RGB(0.5, 0.5, 0.5) → HSB(0, 0, 50)', function() {
        const result = HSBSpace.fromBase([0.5, 0.5, 0.5]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 0, accuracy);
        assert.approximately(result[2], 50, accuracy);
      });
    });

    suite('Partial Values', function() {
      test('dark red: RGB(0.5, 0, 0) → HSB(0, 100, 50)', function() {
        const result = HSBSpace.fromBase([0.5, 0, 0]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 100, accuracy);
        assert.approximately(result[2], 50, accuracy);
      });

      test('light red (pink): RGB(1, 0.5, 0.5) → HSB(0, 50, 100)', function() {
        const result = HSBSpace.fromBase([1, 0.5, 0.5]);
        assert.approximately(result[0], 0, accuracy);
        assert.approximately(result[1], 50, accuracy);
        assert.approximately(result[2], 100, accuracy);
      });
    });
  });

  suite('Round-trip conversion', function() {
    test('HSB → RGB → HSB should preserve values', function() {
      const originalHSB = [210, 75, 80];
      const rgb = HSBSpace.toBase(originalHSB);
      const resultHSB = HSBSpace.fromBase(rgb);

      assert.approximately(resultHSB[0], originalHSB[0], 0.1);
      assert.approximately(resultHSB[1], originalHSB[1], 0.1);
      assert.approximately(resultHSB[2], originalHSB[2], 0.1);
    });

    test('RGB → HSB → RGB should preserve values', function() {
      const originalRGB = [0.7, 0.3, 0.5];
      const hsb = HSBSpace.fromBase(originalRGB);
      const resultRGB = HSBSpace.toBase(hsb);

      assert.approximately(resultRGB[0], originalRGB[0], 0.01);
      assert.approximately(resultRGB[1], originalRGB[1], 0.01);
      assert.approximately(resultRGB[2], originalRGB[2], 0.01);
    });
  });
});
