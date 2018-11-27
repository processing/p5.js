suite('Noise', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  // This could use some better  testing!
  // Just checking that we get an actual number now
  // 1D noise only
  // ALso need test for noiseSeed and noiseDetail
  var result;
  var results = [];

  suite('p5.prototype.noise', function() {
    setup(function() {
      result = myp5.noise(0);
    });
    test('should return a number', function() {
      assert.typeOf(result, 'number');
    });
    test('should return a number 0 < n < 1', function() {
      assert.isTrue(result > 0);
      assert.isTrue(result < 1);
    });
  });

  // Test for noiseSeed
  suite('p5.prototype.noiseSeed', function() {
    setup(function() {
      myp5.noiseSeed(99);
      var t = 0;
      for (var i = 0; i < 5; i++) {
        results[i] = myp5.noise(t);
        t += 0.01;
      }
      myp5.noiseSeed(99);
      t = 0;
      for (i = 5; i < 10; i++) {
        results[i] = myp5.noise(t);
        t += 0.01;
      }
    });
    test('should return a number 0 < n < 1', function() {
      for (var i = 0; i < results.length; i++) {
        assert.typeOf(results[i], 'number');
        assert.isTrue(results[i] > 0);
        assert.isTrue(results[i] < 1);
      }
    });
    test('should return same sequence of numbers', function() {
      for (var i = 0; i < 5; i++) {
        assert.isTrue(results[i] === results[i + 5]);
      }
    });
  });
});
