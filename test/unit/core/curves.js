suite('Curves', function() {
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

  suite('p5.prototype.bezier', function() {
    test('should be a function', function() {
      assert.ok(myp5.bezier);
      assert.typeOf(myp5.bezier, 'function');
    });
    test('no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.bezier(85, 20, 10, 10, 90, 90, 15, 80);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. missing param #6, #7', function() {
      assert.validationError(function() {
        myp5.bezier(85, 20, 10, 10, 90, 90);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.bezier('a', 20, 10, 10, 90, 90, 15, 80);
      });
    });
  });

  suite('p5.prototype.bezierPoint', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.bezierPoint);
      assert.typeOf(myp5.bezierPoint, 'function');
    });
    test('should return a number: missing param #0~4', function() {
      assert.validationError(function() {
        result = myp5.bezierPoint();
      });
    });
    test('should return the correct point on a Bezier Curve', function() {
      result = myp5.bezierPoint(85, 10, 90, 15, 0.5);
      assert.equal(result, 50);
      assert.notEqual(result, -1);
    });
  });

  suite('p5.prototype.bezierTangent', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.bezierTangent);
      assert.typeOf(myp5.bezierTangent, 'function');
    });
    test('should return a number: missing param #0~4', function() {
      assert.validationError(function() {
        result = myp5.bezierTangent();
      });
    });
    test('should return the correct point on a Bezier Curve', function() {
      result = myp5.bezierTangent(95, 73, 73, 15, 0.5);
      assert.equal(result, -60);
    });
  });

  suite('p5.prototype.curve', function() {
    test('should be a function', function() {
      assert.ok(myp5.curve);
      assert.typeOf(myp5.curve, 'function');
    });
    test('no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.curve(5, 26, 5, 26, 73, 24, 73, 61);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. missing param #6, #7', function() {
      assert.validationError(function() {
        myp5.curve(5, 26, 5, 26, 73, 24);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.curve('a', 26, 5, 26, 73, 24, 73, 61);
      });
    });
  });

  suite('p5.prototype.curvePoint', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.curvePoint);
      assert.typeOf(myp5.curvePoint, 'function');
    });
    test('should return a number: missing param #0~4', function() {
      assert.validationError(function() {
        result = myp5.curvePoint();
      });
    });
    test('should return the correct point on a Catmull-Rom Curve', function() {
      result = myp5.curvePoint(5, 5, 73, 73, 0.5);
      assert.equal(result, 39);
      assert.notEqual(result, -1);
    });
  });

  suite('p5.prototype.curveTangent', function() {
    var result;
    test('should be a function', function() {
      assert.ok(myp5.curveTangent);
      assert.typeOf(myp5.curveTangent, 'function');
    });
    test('should return a number: missing param #0~4', function() {
      assert.validationError(function() {
        result = myp5.curveTangent();
      });
    });
    test('should return the correct point on a Catmull-Rom Curve', function() {
      result = myp5.curveTangent(95, 73, 73, 15, 0.5);
      assert.equal(result, 10);
      assert.notEqual(result, -1);
    });
  });
});
