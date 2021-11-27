suite('Calculation', function() {
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

  suite('p5.prototype.abs', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.abs);
      assert.typeOf(myp5.abs, 'function');
    });
    test('should return a number', function() {
      result = myp5.abs();
      assert.typeOf(result, 'number');
    });
    test('should return an absolute value', function() {
      result = myp5.abs(-1);
      assert.equal(result, 1);
      assert.notEqual(result, -1);
    });
  });

  suite('p5.prototype.ceil', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.ceil);
      assert.typeOf(myp5.ceil, 'function');
    });
    test('should return ceil value given negative value', function() {
      result = myp5.ceil(-1.9);
      assert.equal(result, -1);
    });
    test('should return a ceil value given positive value', function() {
      result = myp5.ceil(0.1);
      assert.equal(result, 1);
    });
    test('should return same number', function() {
      result = myp5.ceil(1);
      assert.equal(result, 1);
    });
  });

  suite('p5.prototype.dist', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.dist);
      assert.typeOf(myp5.dist, 'function');
    });
    test('should return a number', function() {
      result = myp5.dist(0, 0, 2, 3);
      assert.typeOf(result, 'number');
    });
    test('should return correct distance', function() {
      result = myp5.dist(0, 0, 2, 3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
    test('should return positive  distance', function() {
      result = myp5.dist(0, 0, -2, -3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
    test('should return correct distance', function() {
      result = myp5.dist(0, 0, 0, 2, 3, 5);
      assert.approximately(result, 6.164414, 0.000001); // Math.hypot(2, 3, 5)
    });
    test('should return positive  distance', function() {
      result = myp5.dist(0, 0, 0, -2, -3, 5);
      assert.approximately(result, 6.164414, 0.000001); // Math.hypot(2, 3, 5)
    });
    test('should not underflow', function() {
      result = myp5.dist(0, 0, 1e-200, 2e-200);
      assert.notEqual(result, 0);
    });
    test('should not overflow', function() {
      result = myp5.dist(0, 0, 1e200, 2e200);
      assert.notEqual(result, Infinity);
    });
    test('should return 0 for identical 2D points', function() {
      result = myp5.dist(2, 3, 2, 3);
      assert.equal(result, 0);
    });
    test('should return 0 for identical 3D points', function() {
      result = myp5.dist(2, 3, 5, 2, 3, 5);
      assert.equal(result, 0);
    });
    test('should return infinity if coordinate of a point is at infinity (2D)', function() {
      result = myp5.dist(0, 0, Infinity, 0);
      assert.equal(result, Infinity);
    });
    test('should return infinity if coordinate of a point is at -infinity (2D)', function() {
      result = myp5.dist(0, 0, -Infinity, 0);
      assert.equal(result, Infinity);
    });
    test('should handle overflow correctly (2D)', function() {
      result = myp5.dist(0, 1e200, 0, 1e199);
      assert.equal(result, 9e199);
    });
    test('should handle rounding correctly (2D)', function() {
      result = myp5.dist(0, 1e-200, 0, 1e-199);
      assert.equal(result, 9e-200);
    });
    test('should handle string parameters correctly (2D)', function() {
      result = myp5.dist(0, 0, '4', '3');
      assert.equal(result, 5);
    });
    test('should return infinity if coordinate of a point is at infinity (3D)', function() {
      result = myp5.dist(0, 0, 0, Infinity, 0, 0);
      assert.equal(result, Infinity);
    });
    test('should return infinity if coordinate of a point is at -infinity (3D)', function() {
      result = myp5.dist(0, 0, 0, -Infinity, 0, 0);
      assert.equal(result, Infinity);
    });
    test('should handle overflow correctly (3D)', function() {
      result = myp5.dist(0, 0, 1e200, 0, 0, 1e199);
      assert.equal(result, 9e199);
    });
    test('should handle rounding correctly (3D)', function() {
      result = myp5.dist(0, 0, 1e-200, 0, 0, 1e-199);
      assert.equal(result, 9e-200);
    });
    test('should handle string parameters correctly (3D)', function() {
      result = myp5.dist(0, 0, 0, '4', '4', '2');
      assert.equal(result, 6);
    });
  });

  suite('p5.prototype.exp', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.exp);
      assert.typeOf(myp5.exp, 'function');
    });
    test('should return exp value given negative value', function() {
      result = myp5.exp(-1);
      assert.approximately(result, Math.exp(-1), 0.000001);
    });
    test('should return exp value given positive value', function() {
      result = myp5.exp(1);
      assert.approximately(result, Math.exp(1), 0.000001);
    });
    test('should return 1', function() {
      result = myp5.exp(0);
      assert.equal(result, 1);
    });
  });

  suite('p5.prototype.floor', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.floor);
      assert.typeOf(myp5.floor, 'function');
    });
    test('should return floor value given negative value', function() {
      result = myp5.floor(-1.9);
      assert.equal(result, -2);
    });
    test('should return a floor value given positive value', function() {
      result = myp5.floor(0.1);
      assert.equal(result, 0);
    });
    test('should return same number', function() {
      result = myp5.floor(1);
      assert.equal(result, 1);
    });
  });

  suite('p5.prototype.lerp', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.lerp);
      assert.typeOf(myp5.lerp, 'function');
    });
    test('should return start', function() {
      result = myp5.lerp(0, 5, 0);
      assert.equal(result, 0);
    });
    test('should return average', function() {
      result = myp5.lerp(0, 5, 0.5);
      assert.equal(result, 2.5);
    });
    test('should return stop', function() {
      result = myp5.lerp(0, 5, 1);
      assert.equal(result, 5);
    });
  });

  suite('p5.prototype.log', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.log);
      assert.typeOf(myp5.log, 'function');
    });
    test('should return log value given negative value', function() {
      result = myp5.log(Math.exp(-1));
      assert.approximately(result, -1, 0.0001);
    });
    test('should return log value given positive value', function() {
      result = myp5.log(Math.exp(1));
      assert.approximately(result, 1, 0.0001);
    });
    test('should return 0', function() {
      result = myp5.log(Math.exp(0));
      assert.equal(result, 0);
    });
  });

  suite('p5.prototype.mag', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.mag);
      assert.typeOf(myp5.mag, 'function');
    });
    test('should return a number', function() {
      result = myp5.mag(2, 3);
      assert.typeOf(result, 'number');
    });
    test('should return correct magitude', function() {
      result = myp5.mag(2, 3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
    test('should return positive magnitude given negative inputs', function() {
      result = myp5.mag(-2, -3);
      assert.approximately(result, 3.605551, 0.000001); // Math.hypot(2, 3)
    });
  });

  suite('p5.prototype.map', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.map);
      assert.typeOf(myp5.map, 'function');
    });
    test('should return a number', function() {
      result = myp5.map(1, 0, 10, 0, 20);
      assert.typeOf(result, 'number');
    });
    test('should return scaled value', function() {
      result = myp5.map(1, 0, 10, 0, 20);
      assert.equal(result, 2);
    });
    test('should extrapolate by default', function() {
      assert.approximately(myp5.map(10, 0, 1, 10, 11), 20, 0.01);
      assert.approximately(myp5.map(-1, 0, 1, 10, 11), 9, 0.01);
      assert.approximately(myp5.map(2, 0, 1, 20, 10), 0, 0.01);
    });
    test('shaould clamp correctly', function() {
      assert.approximately(myp5.map(1, 0, 10, 0, 20, true), 2, 0.01);

      assert.approximately(myp5.map(10, 0, 1, 10, 11, true), 11, 0.01);
      assert.approximately(myp5.map(-1, 0, 1, 10, 11, true), 10, 0.01);
      assert.approximately(myp5.map(2, 0, 1, 20, 10, true), 10, 0.01);
    });
  });

  suite('p5.prototype.max', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.max);
      assert.typeOf(myp5.max, 'function');
    });
    test('should return larger left argument', function() {
      result = myp5.max(10, -1);
      assert.equal(result, 10);
    });
    test('should return larger right argument', function() {
      result = myp5.max(-1, 10);
      assert.equal(result, 10);
    });
    test('should return single value', function() {
      result = myp5.max(10, 10);
      assert.equal(result, 10);
    });
    test('should return larger value from array', function() {
      result = myp5.max([10, -1]);
      assert.equal(result, 10);
    });
    test('should return larger value from array', function() {
      result = myp5.max(-1, 10);
      assert.equal(result, 10);
    });
    test('should return single value from array', function() {
      result = myp5.max([10, 10]);
      assert.equal(result, 10);
    });
  });

  suite('p5.prototype.min', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.min);
      assert.typeOf(myp5.min, 'function');
    });
    test('should return smaller right  argument', function() {
      result = myp5.min(10, -1);
      assert.equal(result, -1);
    });
    test('should return smaller left  argument', function() {
      result = myp5.min(-1, 10);
      assert.equal(result, -1);
    });
    test('should return single value', function() {
      result = myp5.min(10, 10);
      assert.equal(result, 10);
    });
    test('should return smaller value from array', function() {
      result = myp5.min([10, -1]);
      assert.equal(result, -1);
    });
    test('should return smaller value from array', function() {
      result = myp5.min([-1, 10]);
      assert.equal(result, -1);
    });
    test('should return single value from array', function() {
      result = myp5.min([10, 10]);
      assert.equal(result, 10);
    });
  });

  suite('p5.prototype.norm', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.norm);
      assert.typeOf(myp5.norm, 'function');
    });
    test('should return scaled decimal value', function() {
      // note: there is currently scoping issues with "this" keyword
      result = myp5.norm(20, 0, 50);
      assert.equal(result, 0.4);
    });
  });

  suite('p5.prototype.constrain', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.constrain);
      assert.typeOf(myp5.constrain, 'function');
    });

    test('should return same number', function() {
      result = myp5.constrain(1, 3, 5);
      assert.equal(result, 3);
    });

    test('should return lower bound', function() {
      result = myp5.constrain(1, -1, 5);
      assert.equal(result, 1);
    });

    test('should return upper bound', function() {
      result = myp5.constrain(1, 10, 5);
      assert.equal(result, 10);
    });
  });

  suite('p5.prototype.sq', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.sq);
      assert.typeOf(myp5.sq, 'function');
    });

    test('should return sauare value', function() {
      result = myp5.sq(10);
      assert.equal(result, 100);
    });

    test('should return squared value given negative number', function() {
      result = myp5.sq(-10);
      assert.equal(result, 100);
    });
  });

  suite('p5.prototype.pow', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.pow);
      assert.typeOf(myp5.pow, 'function');
    });

    test('should return pow for negative exponential', function() {
      result = myp5.pow(2, -1);
      assert.equal(result, 0.5);
    });

    test('should return pow for positive exponential', function() {
      result = myp5.pow(2, 4);
      assert.equal(result, 16);
    });
  });

  suite('p5.prototype.round', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.round);
      assert.typeOf(myp5.round, 'function');
    });

    test('should round down', function() {
      result = myp5.round(2.1);
      assert.equal(result, 2);
    });

    test('should round up from midpoint', function() {
      result = myp5.round(2.5);
      assert.equal(result, 3);
    });

    test('should round up', function() {
      result = myp5.round(2.8);
      assert.equal(result, 3);
    });

    test('should round two decimal places', function() {
      result = myp5.round(12.31833, 2);
      assert.equal(result, 12.32);
    });

    test('should round very small numbers to zero', function() {
      result = myp5.round(1.234567e-14);
      assert.equal(result, 0);
    });

    test('should round very small numbers to zero when decimal places are specified', function() {
      result = myp5.round(1.234567e-14, 2);
      assert.equal(result, 0);
    });
  });

  suite('p5.prototype.sqrt', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.sqrt);
      assert.typeOf(myp5.sqrt, 'function');
    });

    test('should return square root', function() {
      result = myp5.sqrt(100);
      assert.equal(result, 10);
    });
  });
});
