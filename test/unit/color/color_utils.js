suite('p5.ColorUtils', function() {
  var rgba = [100, 150, 200, 255];
  var hsba = [149, 128, 200, 255];
  var hsla = [137, 100, 50, 1];

  suite('rgbaToHSBA', function() {
    test('rgba converts to hsba', function() {
      assert.deepEqual(p5.ColorUtils.rgbaToHSBA(rgba, [255, 255, 255, 255]), hsba);
    });
  });

  suite('hslaToRGBA', function() {
    test('hsla converts to rgba', function() {
      rgba = [0, 255, 72, 255];
      assert.deepEqual(p5.ColorUtils.hslaToRGBA(hsla, [360, 100, 100, 1]), rgba);
    });
  });

  suite('hsbaToRGBA', function() {
    test('hsba converts to rgba', function() {
      // Because of rounding errors, the green value is off by one
      // var rgba = [100, 150, 200, 255];
      rgba = [100, 149, 200, 255];

      assert.deepEqual(p5.ColorUtils.hsbaToRGBA(hsba, [255, 255, 255, 255]), rgba);
    });
  });
});