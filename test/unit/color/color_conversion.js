suite('color/p5.ColorConversion', function() {
  const rgba = [1, 0, 0.4, 0.8];
  const rgbaWithMaxHue = [1, 0, 0, 0.6];
  const rgbaWithHighLightness = [0.969, 0.753, 0.122, 0.8];
  const hsla = [336 / 360, 1, 0.5, 0.8];
  const hslaWithMaxHue = [1, 1, 0.5, 0.6];
  const hsba = [336 / 360, 1, 1, 0.8];
  const hsbaWithMaxHue = [1, 1, 1, 0.6];
  const accuracy = 0.01;
  let result;

  suite('rgbaToHSBA', function() {
    test('rgba converts to hsba', function() {
      result = p5.ColorConversion._rgbaToHSBA(rgba);
      assert.arrayApproximately(result, hsba, accuracy);
    });
  });

  suite('hsbaToRGBA', function() {
    test('hsba converts to rgba', function() {
      result = p5.ColorConversion._hsbaToRGBA(hsba);
      assert.arrayApproximately(result, rgba, accuracy);
    });

    test('handles maximum hue value', function() {
      result = p5.ColorConversion._hsbaToRGBA(hsbaWithMaxHue);
      assert.arrayApproximately(result, rgbaWithMaxHue, accuracy);
    });
  });

  suite('hslaToRGBA', function() {
    test('hsla converts to rgba', function() {
      result = p5.ColorConversion._hslaToRGBA(hsla);
      assert.arrayApproximately(result, rgba, accuracy);
    });

    test('handles maximum hue value', function() {
      result = p5.ColorConversion._hslaToRGBA(hslaWithMaxHue);
      assert.arrayApproximately(result, rgbaWithMaxHue, accuracy);
    });
  });

  suite('rgbaToHSLA', function() {
    test('rgba converts to hsla (low lightness)', function() {
      result = p5.ColorConversion._rgbaToHSLA(rgba);
      assert.arrayApproximately(result, hsla, accuracy);
    });

    test('rgba converts to hsla (high lightness)', function() {
      result = p5.ColorConversion._rgbaToHSLA(rgbaWithHighLightness);
      assert.arrayApproximately(result, [0.12, 0.93, 0.55, 0.8], accuracy);
    });
  });

  suite('hslaToHSBA', function() {
    test('hsla converts to hsba', function() {
      result = p5.ColorConversion._hslaToHSBA(hsla);
      assert.arrayApproximately(result, hsba, accuracy);
    });
  });

  suite('hsbaToHSLA', function() {
    test('hsba converts to hsla', function() {
      result = p5.ColorConversion._hsbaToHSLA(hsba);
      assert.arrayApproximately(result, hsla, accuracy);
    });
  });
});
