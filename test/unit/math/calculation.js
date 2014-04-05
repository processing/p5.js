suite('Calculation', function() {

  suite('p5.prototype.abs', function() {
    var abs = p5.prototype.abs;
    var result;
    suite('abs()', function() {
      test('should be a function', function() {
        assert.ok(abs);
        assert.typeOf(abs, 'function');
      });
      test('should return a number', function() {
        result = abs();
        assert.typeOf(result, 'number');
      });
      test('should return an absolute value', function() {
        result = abs(-1);
        assert.equal(result, 1);
        assert.notEqual(result, -1);
      });
    });
  });

  suite('p5.prototype.ceil', function() {
    var ceil = p5.prototype.ceil;
    var result;
    suite('ceil()', function() {
      test('should be a function', function() {
        assert.ok(ceil);
        assert.typeOf(ceil, 'function');
      });
      test('should return ceil value given negative value', function() {
        result = ceil(-1.9);
        assert.equal(result, -1);
      });
      test('should return a ceil value given positive value', function() {
        result = ceil(0.1);
        assert.equal(result, 1);
      });
      test('should return same number', function() {
        result = ceil(1);
        assert.equal(result, 1);
      });
    });
  });

  suite('p5.prototype.dist', function() {
    var dist = p5.prototype.dist;
    var result;
    suite('dist()', function() {
      test('should be a function', function() {
        assert.ok(dist);
        assert.typeOf(dist, 'function');
      });
      test('should return a number', function() {
        result = dist(0, 0, 2, 3);
        assert.typeOf(result, 'number');
      });
      test('should return correct distance', function() {
        result = dist(0, 0, 2, 3);
        assert.equal(result, Math.sqrt(13));
      });
      test('should return positive  distance', function() {
        result = dist(0, 0, -2, -3);
        assert.equal(result, Math.sqrt(13));
      });
    });
  });

  suite('p5.prototype.exp', function() {
    var exp = p5.prototype.exp;
    var result;
    suite('exp()', function() {
      test('should be a function', function() {
        assert.ok(exp);
        assert.typeOf(exp, 'function');
      });
      test('should return exp value given negative value', function() {
        result = exp(-1);
        assert.equal(result, Math.exp(-1));
      });
      test('should return exp value given positive value', function() {
        result = exp(1);
        assert.equal(result, Math.exp(1));
      });
      test('should return 1', function() {
        result = exp(0);
        assert.equal(result, 1);
      });
    });
  });

  suite('p5.prototype.floor', function() {
    var floor = p5.prototype.floor;
    var result;
    suite('floor()', function() {
      test('should be a function', function() {
        assert.ok(floor);
        assert.typeOf(floor, 'function');
      });
      test('should return floor value given negative value', function() {
        result = floor(-1.9);
        assert.equal(result, -2);
      });
      test('should return a floor value given positive value', function() {
        result = floor(0.1);
        assert.equal(result, 0);
      });
      test('should return same number', function() {
        result = floor(1);
        assert.equal(result, 1);
      });
    });
  });

  suite('p5.prototype.lerp', function() {
    var lerp = p5.prototype.lerp;
    var result;
    suite('lerp()', function() {
      test('should be a function', function() {
        assert.ok(lerp);
        assert.typeOf(lerp, 'function');
      });
      test('should return start', function() {
        result = lerp(0, 5, 0);
        assert.equal(result, 0);
      });
      test('should return average', function() {
        result = lerp(0, 5, 0.5);
        assert.equal(result, 2.5);
      });
      test('should return stop', function() {
        result = lerp(0, 5, 1);
        assert.equal(result, 5);
      });
    });
  });

  suite('p5.prototype.log', function() {
    var log = p5.prototype.log;
    var result;
    suite('log()', function() {
      test('should be a function', function() {
        assert.ok(log);
        assert.typeOf(log, 'function');
      });
      test('should return log value given negative value', function() {
        result = log(Math.exp(-1));
        assert.equal(result, -1);
      });
      test('should return log value given positive value', function() {
        result = log(Math.exp(1));
        assert.equal(result, 1);
      });
      test('should return 0', function() {
        result = log(Math.exp(0));
        assert.equal(result, 0);
      });
    });
  });
  
  suite('p5.prototype.mag', function() {
    var mag = p5.prototype.mag;
    var result;
    suite('mag()', function() {
      test('should be a function', function() {
        assert.ok(mag);
        assert.typeOf(mag, 'function');
      });
      test('should return a number', function() {
        result = mag(2, 3);
        assert.typeOf(result, 'number');
      });
      test('should return correct magitude', function() {
        result = mag(2, 3);
        assert.equal(result, Math.sqrt(13));
      });
      test('should return positive magnitude given negative inputs', function() {
        result = mag(-2, -3);
        assert.equal(result, Math.sqrt(13));
      });
    });
  });

  suite('p5.prototype.map', function() {
    var map = p5.prototype.map;
    var result;
    suite('map()', function() {
      test('should be a function', function() {
        assert.ok(map);
        assert.typeOf(map, 'function');
      });
      test('should return a number', function() {
        result = map(1, 0, 10, 0, 20);
        assert.typeOf(result, 'number');
      });
      test('should return scaled value', function() {
        result = map(1, 0, 10, 0, 20);
        assert.equal(result, 2);
      });
    });
  });

  suite('p5.prototype.max', function() {
    var max  = p5.prototype.max;
    var result;
    suite('max()', function() {
      test('should be a function', function() {
        assert.ok(max);
        assert.typeOf(max, 'function');
      });
      test('should return larger left argument', function() {
        result = max(10, -1);
        assert.equal(result, 10);
      });
      test('should return larger right argument', function() {
        result = max(-1, 10);
        assert.equal(result, 10);
      });
      test('should return single value', function() {
        result = max(10, 10);
        assert.equal(result, 10);
      });
      test('should return larger value from array', function() {
        result = max([10,-1]);
        assert.equal(result, 10);
      });
      test('should return larger value from array', function() {
        result = max(-1, 10);
        assert.equal(result, 10);
      });
      test('should return single value from array', function() {
        result = max([10,10]);
        assert.equal(result, 10);
      });      
    });
  });

  suite('p5.prototype.min', function() {
    var min  = p5.prototype.min;
    var result;
    suite('min()', function() {
      test('should be a function', function() {
        assert.ok(min);
        assert.typeOf(min, 'function');
      });
      test('should return smaller right  argument', function() {
        result = min(10, -1);
        assert.equal(result, -1);
      });
      test('should return smaller left  argument', function() {
        result = min(-1, 10);
        assert.equal(result, -1);
      });
      test('should return single value', function() {
        result = min(10, 10);
        assert.equal(result, 10);
      });
      test('should return smaller value from array', function() {
        result = min([10,-1]);
        assert.equal(result, -1);
      });
      test('should return smaller value from array', function() {
        result = min([-1,10]);
        assert.equal(result, -1);
      });
      test('should return single value from array', function() {
        result = min([10,10]);
        assert.equal(result, 10);
      });
    });
  });

  suite('p5.prototype.norm', function() {
    var norm  = p5.prototype.norm;
    var result;
    suite('norm()', function() {
      test('should be a function', function() {
        assert.ok(norm);
        assert.typeOf(norm, 'function');
      });
      test('should return scaled decimal value', function() {
        // note: there is currently scoping issues with "this" keyword
        result = p5.prototype.norm(20, 0, 50);
        assert.equal(result, 0.4);
      });
    });
  });

  suite('p5.prototype.constrain', function() {

    var constrain = p5.prototype.constrain;
    var result;
    suite('constrain()', function() {
      test('should be a function', function() {
        assert.ok(constrain);
        assert.typeOf(constrain, 'function');
      });

      test('should return same number', function() {
        // note: there is currently scoping issues with "this" keyword
        result = p5.prototype.constrain(1, 3, 5);
        assert.equal(result, 3);
      });

      test('should return lower bound', function() {
        result = p5.prototype.constrain(1, -1, 5);
        assert.equal(result, 1);
      });

      test('should return upper bound', function() {
        result = p5.prototype.constrain(1, 10, 5);
        assert.equal(result, 10);
      });
    });
  });

  suite('p5.prototype.sq', function() {

    var sq = p5.prototype.sq;
    var result;
    suite('sq()', function() {
      test('should be a function', function() {
        assert.ok(sq);
        assert.typeOf(sq, 'function');
      });


      test('should return sauare value', function() {
        result = p5.prototype.sq(10);
        assert.equal(result, 100);
      });

      test('should return squared value given negative number', function() {
        result = p5.prototype.sq(-10);
        assert.equal(result, 100);
      });

    });
  });

  suite('p5.prototype.pow', function() {

    var pow = p5.prototype.pow;
    var result;
    suite('pow()', function() {
      test('should be a function', function() {
        assert.ok(pow);
        assert.typeOf(pow, 'function');
      });

      test('should return pow for negative exponential', function() {
        result = pow(2, -1);
        assert.equal(result, 0.5);
      });

      test('should return pow for positive exponential', function() {
        result = pow(2, 4);
        assert.equal(result, 16);
      });

    });
  });

  suite('p5.prototype.round', function() {

    var round = p5.prototype.round;
    var result;
    suite('round()', function() {
      test('should be a function', function() {
        assert.ok(round);
        assert.typeOf(round, 'function');
      });

      test('should round down', function() {
        result = round(2.1);
        assert.equal(result, 2);
      });

      test('should round up from midpoint', function() {
        result = round(2.5);
        assert.equal(result, 3);
      });

      test('should round up', function() {
        result = round(2.8);
        assert.equal(result, 3);
      });

    });
  });

  suite('p5.prototype.sqrt', function() {

    var sqrt = p5.prototype.sqrt;
    var result;
    suite('sqrt()', function() {
      test('should be a function', function() {
        assert.ok(sqrt);
        assert.typeOf(sqrt, 'function');
      });

      test('should return square root', function() {
        result = sqrt(100);
        assert.equal(result, 10);
      });

    });
  });

});
