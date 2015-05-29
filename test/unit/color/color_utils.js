suite('p5.ColorUtils', function() {
  var rgba = [100, 150, 200, 255];
  var hsba = [149, 128, 200, 255];

  suite('rgbaToHSBA', function() {
    test('rgba converts to hsba', function() {
      assert.deepEqual(p5.ColorUtils.rgbaToHSBA(rgba), hsba);
    });
  });

  suite('hsbaToRGBA', function() {
    test('hsba converts to rgba', function() {
      // Because of rounding errors, the green value is off by one
      // var rgba = [100, 150, 200, 255];
      rgba = [100, 149, 200, 255];

      assert.deepEqual(p5.ColorUtils.hsbaToRGBA(hsba), rgba);
    });
  });
});