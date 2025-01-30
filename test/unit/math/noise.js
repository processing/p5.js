import noise from '../../../src/math/noise.js';
import { vi } from 'vitest';

suite('Noise', function() {
  const mockP5 = {
    _validateParameters: vi.fn()
  };
  const mockP5Prototype = {};

  beforeAll(function() {
    noise(mockP5, mockP5Prototype);
  });

  afterAll(function() {
  });

  // This could use some better  testing!
  // Just checking that we get an actual number now
  // 1D noise only
  // ALso need test for noiseSeed and noiseDetail
  var result;
  var results = [];

  suite('p5.prototype.noise', function() {
    beforeEach(function() {
      result = mockP5Prototype.noise(0);
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
    beforeEach(function() {
      mockP5Prototype.noiseSeed(99);
      var t = 0;
      for (var i = 0; i < 5; i++) {
        results[i] = mockP5Prototype.noise(t);
        t += 0.01;
      }
      mockP5Prototype.noiseSeed(99);
      t = 0;
      for (i = 5; i < 10; i++) {
        results[i] = mockP5Prototype.noise(t);
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
