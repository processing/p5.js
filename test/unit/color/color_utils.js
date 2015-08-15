suite('p5.ColorUtils', function() {
  var rgba = [255, 0, 102, 204];
  var hsla = [336, 100, 50, 0.8];
  var hsba = [336, 100, 100, 0.8];
  var one;

  suite('rgbaToHSBA', function() {
    test('rgba converts to hsba', function() {
      one = p5.ColorUtils.rgbaToHSBA(rgba, [255, 255, 255, 255]);
      assert.deepEqual([
        Math.round(one[0] * 360),
        Math.round(one[1] * 100),
        Math.round(one[2] * 100),
        one[3]
      ], hsba);
    });
  });

  suite('hsbaToRGBA', function() {
    test('hsba converts to rgba', function() {
      one = p5.ColorUtils.hsbaToRGBA(hsba, [360, 100, 100, 1]);
      assert.deepEqual([
        Math.round(one[0] * 255),
        Math.round(one[1] * 255),
        Math.round(one[2] * 255),
        Math.round(one[3] * 255)
      ], rgba);
    });
  });

  suite('hslaToRGBA', function() {
    test('hsla converts to rgba', function() {
      one = p5.ColorUtils.hslaToRGBA(hsla, [360, 100, 100, 1]);
      assert.deepEqual([
        Math.round(one[0] * 255),
        Math.round(one[1] * 255),
        Math.round(one[2] * 255),
        Math.round(one[3] * 255)
      ], rgba);
    });
  });

  suite('rgbaToHSLA', function() {
    test('rgba converts to hsla', function() {
      one = p5.ColorUtils.rgbaToHSLA(rgba, [255, 255, 255, 255]);
      assert.deepEqual([
        Math.round(one[0] * 360),
        Math.round(one[1] * 100),
        Math.round(one[2] * 100),
        one[3]
      ], hsla);
    });
  });
});
