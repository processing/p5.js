import random from '../../../src/math/random.js';
import { vi } from 'vitest';

suite('Random', function () {
  const mockP5 = {
    _validateParameters: vi.fn()
  };
  const mockP5Prototype = {};

  beforeAll(function () {
    random(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.random', function () {
    var result;

    var results = [];

    suite('random()', function () {
      beforeEach(function () {
        mockP5Prototype.randomSeed(99);
        for (var i = 0; i < 5; i++) {
          results[i] = mockP5Prototype.random();
        }
        mockP5Prototype.randomSeed(99);
        for (i = 5; i < 10; i++) {
          results[i] = mockP5Prototype.random();
        }
      });
      test('should return a number', function () {
        for (var i = 0; i < 10; i++) {
          assert.typeOf(results[i], 'number');
        }
      });
      test('should return a number 0 <= n < 1', function () {
        for (var i = 0; i < 10; i++) {
          assert.isTrue(results[i] >= 0);
          assert.isTrue(results[i] < 1);
        }
      });
      test('should return same sequence of numbers', function () {
        for (var i = 0; i < 5; i++) {
          assert.isTrue(results[i] === results[i + 5]);
        }
      });
    });

    suite('random(5)', function () {
      test('should return a number 0 <= n < 5', function () {
        result = mockP5Prototype.random(5);
        assert.isTrue(result >= 0);
        assert.isTrue(result < 5);
      });
    });

    suite('random(1, 10)', function () {
      test('should return a number 1 <= n < 10', function () {
        result = mockP5Prototype.random(1, 10);
        assert.isTrue(result >= 1);
        assert.isTrue(result < 10);
      });
    });

    suite('random(["apple", "pear", "orange", "grape"])', function () {
      test('should return a fruit', function () {
        var fruits = ['apple', 'pear', 'orange', 'grape'];
        result = mockP5Prototype.random(fruits);
        assert.include(fruits, result);
      });
    });
  });
  suite.skip('instance mode', function () {
    var instances = [];

    beforeEach(async function () {
      var instanceCount = 2;
      for (var i = 0; i < instanceCount; i++) {
        new p5(function (p) {
          p.setup = function () {
            instances.push(p);
          };
        });
      }
    });

    afterEach(function () {
      instances.forEach(function (instance) {
        instance.remove();
      });
    });

    test('should be independent', function () {
      var SEED = 42;

      instances.forEach(function (instance) {
        instance.randomSeed(SEED);
      });

      for (var i = 0; i < 10; i++) {
        instances.reduce(function (prev, instance) {
          var randomValue = instance.random();
          if (prev != null) {
            assert.equal(randomValue, prev);
          }

          return randomValue;
        }, null);
      }
    });
  });

  suite('p5.prototype.randomGaussian', function () {
    suite.skip('instance mode', function () {
      var instances = [];

      beforeEach(async function () {
        var instanceCount = 2;
        for (var i = 0; i < instanceCount; i++) {
          new p5(function (p) {
            p.setup = function () {
              instances.push(p);
            };
          });
        }
      });

      afterEach(function () {
        instances.forEach(function (instance) {
          instance.remove();
        });
      });

      test('should be independent', function () {
        var SEED = 42;

        instances.forEach(function (instance) {
          instance.randomSeed(SEED);
        });

        for (var i = 0; i < 10; i++) {
          instances.reduce(function (prev, instance) {
            var randomValue = instance.randomGaussian(0, 15);
            if (prev != null) {
              assert.equal(randomValue, prev);
            }

            return randomValue;
          }, null);
        }
      });
    });

    suite('instance mode / multiple instances', function () {
      test('should maintain independent Gaussian sequences across instances when interleaved', function () {
        const pA = Object.create(mockP5Prototype);
        const pB = Object.create(mockP5Prototype);

        // Baseline: pA sequence with seed 42
        pA.randomSeed(42);
        const expectedA0 = pA.randomGaussian();
        const expectedA1 = pA.randomGaussian();
        const expectedA2 = pA.randomGaussian();
        const expectedA3 = pA.randomGaussian();

        // Interleaved: pB calls randomGaussian between pA calls
        pA.randomSeed(42);
        pB.randomSeed(99);

        const actualA0 = pA.randomGaussian();
        // pB generates a pair with seed 99, which overwrites module y2 in buggy code
        pB.randomGaussian();
        const actualA1 = pA.randomGaussian();
        pB.randomGaussian();
        const actualA2 = pA.randomGaussian();
        pB.randomGaussian();
        const actualA3 = pA.randomGaussian();

        assert.equal(actualA0, expectedA0);
        assert.equal(actualA1, expectedA1);
        assert.equal(actualA2, expectedA2);
        assert.equal(actualA3, expectedA3);
      });
    });

    suite('randomGaussian(42, 0)', function () {
      test('should return 42', function () {
        let result = mockP5Prototype.randomGaussian(42, 0);
        assert.isTrue(result === 42);
      });
    });
  });
});
