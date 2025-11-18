import calculation from '../../../src/math/calculation.js';
import { vi } from 'vitest';

suite('Calculation', function() {
  const mockP5 = {
    _validateParameters: vi.fn()
  };
  const mockP5Prototype = {};

  beforeAll(function() {
    calculation(mockP5, mockP5Prototype);
  });

  afterAll(function() {
  });

  suite('p5.prototype.abs', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.abs);
      assert.typeOf(mockP5Prototype.abs, 'function');
    });
    test('should return a number', function() {
      result = mockP5Prototype.abs();
      assert.typeOf(result, 'number');
    });
    test('should return an absolute value', function() {
      result = mockP5Prototype.abs(-1);
      assert.equal(result, 1);
      assert.notEqual(result, -1);
    });
  });

  suite('p5.prototype.ceil', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.ceil);
      assert.typeOf(mockP5Prototype.ceil, 'function');
    });
    test('should return ceil value given negative value', function() {
      result = mockP5Prototype.ceil(-1.9);
      assert.equal(result, -1);
    });
    test('should return a ceil value given positive value', function() {
      result = mockP5Prototype.ceil(0.1);
      assert.equal(result, 1);
    });
    test('should return same number', function() {
      result = mockP5Prototype.ceil(1);
      assert.equal(result, 1);
    });
  });

  suite('p5.prototype.dist', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.dist);
      assert.typeOf(mockP5Prototype.dist, 'function');
    });
    test('should return a number', function() {
      result = mockP5Prototype.dist(0, 0, 2, 3);
      assert.typeOf(result, 'number');
    });
    test('should return correct distance', function() {
      result = mockP5Prototype.dist(0, 0, 2, 3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
    test('should return positive  distance', function() {
      result = mockP5Prototype.dist(0, 0, -2, -3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
    test('should return correct distance', function() {
      result = mockP5Prototype.dist(0, 0, 0, 2, 3, 5);
      assert.approximately(result, 6.164414, 0.000001); // Math.hypot(2, 3, 5)
    });
    test('should return positive  distance', function() {
      result = mockP5Prototype.dist(0, 0, 0, -2, -3, 5);
      assert.approximately(result, 6.164414, 0.000001); // Math.hypot(2, 3, 5)
    });
    test('should not underflow', function() {
      result = mockP5Prototype.dist(0, 0, 1e-200, 2e-200);
      assert.notEqual(result, 0);
    });
    test('should not overflow', function() {
      result = mockP5Prototype.dist(0, 0, 1e200, 2e200);
      assert.notEqual(result, Infinity);
    });
    test('should return 0 for identical 2D points', function() {
      result = mockP5Prototype.dist(2, 3, 2, 3);
      assert.equal(result, 0);
    });
    test('should return 0 for identical 3D points', function() {
      result = mockP5Prototype.dist(2, 3, 5, 2, 3, 5);
      assert.equal(result, 0);
    });
    test('should return infinity if coordinate of a point is at infinity (2D)', function() {
      result = mockP5Prototype.dist(0, 0, Infinity, 0);
      assert.equal(result, Infinity);
    });
    test('should return infinity if coordinate of a point is at -infinity (2D)', function() {
      result = mockP5Prototype.dist(0, 0, -Infinity, 0);
      assert.equal(result, Infinity);
    });
    test('should handle overflow correctly (2D)', function() {
      result = mockP5Prototype.dist(0, 1e200, 0, 1e199);
      assert.equal(result, 9e199);
    });
    test('should handle rounding correctly (2D)', function() {
      result = mockP5Prototype.dist(0, 1e-200, 0, 1e-199);
      assert.equal(result, 9e-200);
    });
    test('should handle string parameters correctly (2D)', function() {
      result = mockP5Prototype.dist(0, 0, '4', '3');
      assert.equal(result, 5);
    });
    test('should return infinity if coordinate of a point is at infinity (3D)', function() {
      result = mockP5Prototype.dist(0, 0, 0, Infinity, 0, 0);
      assert.equal(result, Infinity);
    });
    test('should return infinity if coordinate of a point is at -infinity (3D)', function() {
      result = mockP5Prototype.dist(0, 0, 0, -Infinity, 0, 0);
      assert.equal(result, Infinity);
    });
    test('should handle overflow correctly (3D)', function() {
      result = mockP5Prototype.dist(0, 0, 1e200, 0, 0, 1e199);
      assert.equal(result, 9e199);
    });
    test('should handle rounding correctly (3D)', function() {
      result = mockP5Prototype.dist(0, 0, 1e-200, 0, 0, 1e-199);
      assert.equal(result, 9e-200);
    });
    test('should handle string parameters correctly (3D)', function() {
      result = mockP5Prototype.dist(0, 0, 0, '4', '4', '2');
      assert.equal(result, 6);
    });
  });

  suite('p5.prototype.exp', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.exp);
      assert.typeOf(mockP5Prototype.exp, 'function');
    });
    test('should return exp value given negative value', function() {
      result = mockP5Prototype.exp(-1);
      assert.approximately(result, Math.exp(-1), 0.000001);
    });
    test('should return exp value given positive value', function() {
      result = mockP5Prototype.exp(1);
      assert.approximately(result, Math.exp(1), 0.000001);
    });
    test('should return 1', function() {
      result = mockP5Prototype.exp(0);
      assert.equal(result, 1);
    });
  });

  suite('p5.prototype.floor', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.floor);
      assert.typeOf(mockP5Prototype.floor, 'function');
    });
    test('should return floor value given negative value', function() {
      result = mockP5Prototype.floor(-1.9);
      assert.equal(result, -2);
    });
    test('should return a floor value given positive value', function() {
      result = mockP5Prototype.floor(0.1);
      assert.equal(result, 0);
    });
    test('should return same number', function() {
      result = mockP5Prototype.floor(1);
      assert.equal(result, 1);
    });
  });

  suite('p5.prototype.lerp', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.lerp);
      assert.typeOf(mockP5Prototype.lerp, 'function');
    });
    test('should return start', function() {
      result = mockP5Prototype.lerp(0, 5, 0);
      assert.equal(result, 0);
    });
    test('should return average', function() {
      result = mockP5Prototype.lerp(0, 5, 0.5);
      assert.equal(result, 2.5);
    });
    test('should return stop', function() {
      result = mockP5Prototype.lerp(0, 5, 1);
      assert.equal(result, 5);
    });
  });

  suite('p5.prototype.log', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.log);
      assert.typeOf(mockP5Prototype.log, 'function');
    });
    test('should return log value given negative value', function() {
      result = mockP5Prototype.log(Math.exp(-1));
      assert.approximately(result, -1, 0.0001);
    });
    test('should return log value given positive value', function() {
      result = mockP5Prototype.log(Math.exp(1));
      assert.approximately(result, 1, 0.0001);
    });
    test('should return 0', function() {
      result = mockP5Prototype.log(Math.exp(0));
      assert.equal(result, 0);
    });
  });

  suite('p5.prototype.mag', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.mag);
      assert.typeOf(mockP5Prototype.mag, 'function');
    });
    test('should return a number', function() {
      result = mockP5Prototype.mag(2, 3);
      assert.typeOf(result, 'number');
    });
    test('should return correct magitude', function() {
      result = mockP5Prototype.mag(2, 3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
    test('should return positive magnitude given negative inputs', function() {
      result = mockP5Prototype.mag(-2, -3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
  });

  suite('p5.prototype.map', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.map);
      assert.typeOf(mockP5Prototype.map, 'function');
    });
    test('should return a number', function() {
      result = mockP5Prototype.map(1, 0, 10, 0, 20);
      assert.typeOf(result, 'number');
    });
    test('should return scaled value', function() {
      result = mockP5Prototype.map(1, 0, 10, 0, 20);
      assert.equal(result, 2);
    });
    test('should extrapolate by default', function() {
      assert.approximately(mockP5Prototype.map(10, 0, 1, 10, 11), 20, 0.01);
      assert.approximately(mockP5Prototype.map(-1, 0, 1, 10, 11), 9, 0.01);
      assert.approximately(mockP5Prototype.map(2, 0, 1, 20, 10), 0, 0.01);
    });
    test('shaould clamp correctly', function() {
      assert.approximately(mockP5Prototype.map(1, 0, 10, 0, 20, true), 2, 0.01);

      assert.approximately(
        mockP5Prototype.map(10, 0, 1, 10, 11, true), 11, 0.01
      );
      assert.approximately(
        mockP5Prototype.map(-1, 0, 1, 10, 11, true), 10, 0.01
      );
      assert.approximately(
        mockP5Prototype.map(2, 0, 1, 20, 10, true), 10, 0.01
      );
    });
  });

  suite('p5.prototype.max', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.max);
      assert.typeOf(mockP5Prototype.max, 'function');
    });
    test('should return larger left argument', function() {
      result = mockP5Prototype.max(10, -1);
      assert.equal(result, 10);
    });
    test('should return larger right argument', function() {
      result = mockP5Prototype.max(-1, 10);
      assert.equal(result, 10);
    });
    test('should return single value', function() {
      result = mockP5Prototype.max(10, 10);
      assert.equal(result, 10);
    });
    test('should return larger value from array', function() {
      result = mockP5Prototype.max([10, -1]);
      assert.equal(result, 10);
    });
    test('should return larger value from array', function() {
      result = mockP5Prototype.max(-1, 10);
      assert.equal(result, 10);
    });
    test('should return single value from array', function() {
      result = mockP5Prototype.max([10, 10]);
      assert.equal(result, 10);
    });
    test('should handle Infinity', function() {
      result = mockP5Prototype.max(3, Infinity);
      assert.equal(result, Infinity);
    });
    test('should handle -Infinity', function() {
      result = mockP5Prototype.max(3, -Infinity);
      assert.equal(result, 3);
    });
    test('should handle Infinity in array', function() {
      result = mockP5Prototype.max([3, Infinity, 5]);
      assert.equal(result, Infinity);
    });
  });

  suite('p5.prototype.min', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.min);
      assert.typeOf(mockP5Prototype.min, 'function');
    });
    test('should return smaller right  argument', function() {
      result = mockP5Prototype.min(10, -1);
      assert.equal(result, -1);
    });
    test('should return smaller left  argument', function() {
      result = mockP5Prototype.min(-1, 10);
      assert.equal(result, -1);
    });
    test('should return single value', function() {
      result = mockP5Prototype.min(10, 10);
      assert.equal(result, 10);
    });
    test('should return smaller value from array', function() {
      result = mockP5Prototype.min([10, -1]);
      assert.equal(result, -1);
    });
    test('should return smaller value from array', function() {
      result = mockP5Prototype.min([-1, 10]);
      assert.equal(result, -1);
    });
    test('should return single value from array', function() {
      result = mockP5Prototype.min([10, 10]);
      assert.equal(result, 10);
    });
    test('should handle Infinity', function() {
      result = mockP5Prototype.min(Infinity, 3);
      assert.equal(result, 3);
    });
    test('should handle -Infinity', function() {
      result = mockP5Prototype.min(3, -Infinity);
      assert.equal(result, -Infinity);
    });
    test('should handle -Infinity in array', function() {
      result = mockP5Prototype.min([3, -Infinity, 5]);
      assert.equal(result, -Infinity);
    });
  });

  suite('p5.prototype.norm', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.norm);
      assert.typeOf(mockP5Prototype.norm, 'function');
    });
    test('should return scaled decimal value', function() {
      // note: there is currently scoping issues with "this" keyword
      result = mockP5Prototype.norm(20, 0, 50);
      assert.equal(result, 0.4);
    });
  });

  suite('p5.prototype.constrain', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.constrain);
      assert.typeOf(mockP5Prototype.constrain, 'function');
    });

    test('should return same number', function() {
      result = mockP5Prototype.constrain(1, 3, 5);
      assert.equal(result, 3);
    });

    test('should return lower bound', function() {
      result = mockP5Prototype.constrain(1, -1, 5);
      assert.equal(result, 1);
    });

    test('should return upper bound', function() {
      result = mockP5Prototype.constrain(1, 10, 5);
      assert.equal(result, 10);
    });
  });

  suite('p5.prototype.sq', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.sq);
      assert.typeOf(mockP5Prototype.sq, 'function');
    });

    test('should return sauare value', function() {
      result = mockP5Prototype.sq(10);
      assert.equal(result, 100);
    });

    test('should return squared value given negative number', function() {
      result = mockP5Prototype.sq(-10);
      assert.equal(result, 100);
    });
  });

  suite('p5.prototype.pow', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.pow);
      assert.typeOf(mockP5Prototype.pow, 'function');
    });

    test('should return pow for negative exponential', function() {
      result = mockP5Prototype.pow(2, -1);
      assert.equal(result, 0.5);
    });

    test('should return pow for positive exponential', function() {
      result = mockP5Prototype.pow(2, 4);
      assert.equal(result, 16);
    });
  });

  suite('p5.prototype.round', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.round);
      assert.typeOf(mockP5Prototype.round, 'function');
    });

    test('should round down', function() {
      result = mockP5Prototype.round(2.1);
      assert.equal(result, 2);
    });

    test('should round up from midpoint', function() {
      result = mockP5Prototype.round(2.5);
      assert.equal(result, 3);
    });

    test('should round up', function() {
      result = mockP5Prototype.round(2.8);
      assert.equal(result, 3);
    });

    test('should round two decimal places', function() {
      result = mockP5Prototype.round(12.31833, 2);
      assert.equal(result, 12.32);
    });

    test('should round very small numbers to zero', function() {
      result = mockP5Prototype.round(1.234567e-14);
      assert.equal(result, 0);
    });

    test('should round very small numbers to zero when decimal places are specified', function() {
      result = mockP5Prototype.round(1.234567e-14, 2);
      assert.equal(result, 0);
    });
  });

  suite('p5.prototype.sqrt', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.sqrt);
      assert.typeOf(mockP5Prototype.sqrt, 'function');
    });

    test('should return square root', function() {
      result = mockP5Prototype.sqrt(100);
      assert.equal(result, 10);
    });
  });
});
