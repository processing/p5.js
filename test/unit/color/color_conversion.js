suite('p5.ColorConversion', function() {
  var rgba = [1, 0, 0.4, 0.8];
  var hsla = [336/360, 1, 0.5, 0.8];
  var hslaWithMaxHue = [1, 1, 0.5, 0.6];
  var hsba = [336/360, 1, 1, 0.8];
  var hsbaWithMaxHue = [1, 1, 1, 0.6];
  var result;

  suite('rgbaToHSBA', function() {
    test('rgba converts to hsba', function() {
      result = p5.ColorConversion._rgbaToHSBA(rgba);
      assert.deepEqual([
        Math.round(result[0] * 360),
        Math.round(result[1] * 100),
        Math.round(result[2] * 100),
        result[3]
      ], [336, 100, 100, 0.8]);
    });
  });

  suite('hsbaToRGBA', function() {
    test('hsba converts to rgba', function() {
      result = p5.ColorConversion._hsbaToRGBA(hsba);
      assert.deepEqual([
        Math.round(result[0] * 255),
        Math.round(result[1] * 255),
        Math.round(result[2] * 255),
        Math.round(result[3] * 255)
      ], [255, 0, 102, 204]);
    });

    test('handles maximum hue value', function() {
      result = p5.ColorConversion._hsbaToRGBA(hsbaWithMaxHue);
      assert.deepEqual([
        Math.round(result[0] * 255),
        Math.round(result[1] * 255),
        Math.round(result[2] * 255),
        Math.round(result[3] * 255)
      ], [255, 0, 0, 153]);
    });
  });

  suite('hslaToRGBA', function() {
    test('hsla converts to rgba', function() {
      result = p5.ColorConversion._hslaToRGBA(hsla);
      assert.deepEqual([
        Math.round(result[0] * 255),
        Math.round(result[1] * 255),
        Math.round(result[2] * 255),
        Math.round(result[3] * 255)
      ], [255, 0, 102, 204]);
    });

    test('handles maximum hue value', function() {
      result = p5.ColorConversion._hslaToRGBA(hslaWithMaxHue);
      assert.deepEqual([
        Math.round(result[0] * 255),
        Math.round(result[1] * 255),
        Math.round(result[2] * 255),
        Math.round(result[3] * 255)
      ], [255, 0, 0, 153]);
    });
  });

  suite('rgbaToHSLA', function() {
    test('rgba converts to hsla', function() {
      result = p5.ColorConversion._rgbaToHSLA(rgba);
      assert.deepEqual([
        Math.round(result[0] * 360),
        Math.round(result[1] * 100),
        Math.round(result[2] * 100),
        result[3]
      ], [336, 100, 50, 0.8]);
    });
  });

  suite('hslaToHSBA', function() {
    test('hsla converts to hsba', function() {
      result = p5.ColorConversion._hslaToHSBA(hsla);
      assert.deepEqual([
        Math.round(result[0] * 360),
        Math.round(result[1] * 100),
        Math.round(result[2] * 100),
        result[3]
      ], [336, 100, 100, 0.8]);
    });
  });

  suite('hsbaToHSLA', function() {
    test('hsba converts to hsla', function() {
      result = p5.ColorConversion._hsbaToHSLA(hsba);
      assert.deepEqual([
        Math.round(result[0] * 360),
        Math.round(result[1] * 100),
        Math.round(result[2] * 100),
        result[3]
      ], [336, 100, 50, 0.8]);
    });
  });
});
