suite('Noise', function() {
  
  // This could use some better  testing!
  // Just checking that we get an actual number now
  // 1D noise only
  // ALso need test for noiseSeed and noiseDetail
  
  suite('p5.prototype.noise', function() {
    var noise = p5.prototype.noise;

    var result;
    suite('noise()', function() {
      setup(function() {
        result = noise(0);
      });
      test('should return a number', function() {
        assert.typeOf(result, 'number');
      });
      test('should return a number 0 < n < 1', function() {
        assert.isTrue(result > 0);
        assert.isTrue(result < 1);
      });
    });
  });
});