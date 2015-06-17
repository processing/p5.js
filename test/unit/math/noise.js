suite('Noise', function() {
  
  // This could use some better  testing!
  // Just checking that we get an actual number now
  // 1D noise only
  // ALso need test for noiseSeed and noiseDetail
  var noise = p5.prototype.noise;
  var noiseSeed = p5.prototype.noiseSeed;
  var result;
  var results = [];
  
  suite('p5.prototype.noise', function() {
    var noise = p5.prototype.noise;
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
   
  // Test for noiseSeed
  suite('p5.prototype.noiseSeed', function() {
      setup(function() {
        noiseSeed(99);
        var t = 0;
        for (var i = 0; i < 5; i++) {
          results[i] = noise(t);
          t += 0.01;
        }
        noiseSeed(99);
        t = 0;
        for (i = 5; i < 10; i++) {
          results[i] = noise(t);
          t += 0.01;
        }
      });
      test('should return a number 0 < n < 1', function() {
        for (var i = 0; i < results.length; i++) {
          assert.typeOf(results[i], 'number');
          assert.isTrue(results[i] > 0);
          assert.isTrue(results[i] < 1);        }
      });
      test('should return same sequence of numbers', function() {
        for (var i = 0; i < 5; i++) {
          assert.isTrue(results[i] === results[i+5]);
        }
      });
    });


});