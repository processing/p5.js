suite('Curves', function() {
  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  suite('p5.prototype.bezier', function() {
    var bezier = p5.prototype.bezier;
    suite('bezier()', function() {
      test('should be a function', function() {
        assert.ok(bezier);
        assert.typeOf(bezier, 'function');
      });
      test('bezier(): no friendly-err-msg', function() {
        assert.doesNotThrow(function() {
            myp5.bezier(85, 20, 10, 10, 90, 90, 15, 80);
          },
          Error, 'got unwanted exception');
      });
      test('bezier(): no friendly-err-msg. missing param #6, #7', function() {
        assert.doesNotThrow(function() {
            myp5.bezier(85, 20, 10, 10, 90, 90);
          },
          Error, 'got unwanted exception');
      });
      test('bezier(): wrong param type at #0', function() {
        assert.doesNotThrow(function() {
            myp5.bezier('85', 20, 10, 10, 90, 90, 15, 80);
          },
          Error, 'got unwanted exception');
      });
    });
  });

  suite('p5.prototype.bezierPoint', function() {
    var bezierPoint = p5.prototype.bezierPoint;
    var result;
    suite('bezierPoint()', function() {
      test('should be a function', function() {
        assert.ok(bezierPoint);
        assert.typeOf(bezierPoint, 'function');
      });
      test('should return a number: missing param #0~4', function() {
        result = myp5.bezierPoint();
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Bezier Curve', function() {
        result = myp5.bezierPoint(85, 10, 90, 15, 0.5);
        assert.equal(result, 50);
        assert.notEqual(result, -1);
      });
    });
  });

  suite('p5.prototype.bezierTangent', function() {
    var bezierTangent = p5.prototype.bezierTangent;
    var result;
    suite('bezierTangent()', function() {
      test('should be a function', function() {
        assert.ok(bezierTangent);
        assert.typeOf(bezierTangent, 'function');
      });
      test('should return a number: missing param #0~4', function() {
        result = myp5.bezierTangent();
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Bezier Curve', function() {
        result = myp5.bezierTangent(95, 73, 73, 15, 0.5);
        assert.equal(result, -60);
      });
    });
  });

  suite('p5.prototype.curve', function() {
    var curve = p5.prototype.curve;
    suite('curve()', function() {
      test('should be a function', function() {
        assert.ok(curve);
        assert.typeOf(curve, 'function');
      });
      test('curve(): no friendly-err-msg', function() {
        assert.doesNotThrow(function() {
            myp5.curve(5, 26, 5, 26, 73, 24, 73, 61);
          },
          Error, 'got unwanted exception');
      });
      test('curve(): no friendly-err-msg. missing param #6, #7', function() {
        assert.doesNotThrow(function() {
            myp5.curve(5, 26, 5, 26, 73, 24);
          },
          Error, 'got unwanted exception');
      });
      test('curve(): wrong param type at #0', function() {
        assert.doesNotThrow(function() {
            myp5.curve('5', 26, 5, 26, 73, 24, 73, 61);
          },
          Error, 'got unwanted exception');
      });
    });
  });

  suite('p5.prototype.curvePoint', function() {
    var curvePoint = p5.prototype.curvePoint;
    var result;
    suite('curvePoint()', function() {
      test('should be a function', function() {
        assert.ok(curvePoint);
        assert.typeOf(curvePoint, 'function');
      });
      test('should return a number: missing param #0~4', function() {
        result = myp5.curvePoint();
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Catmull-Rom Curve', function() {
        result = myp5.curvePoint(5, 5, 73, 73, 0.5);
        assert.equal(result, 39);
        assert.notEqual(result, -1);
      });
    });
  });

  suite('p5.prototype.curveTangent', function() {
    var curveTangent = p5.prototype.curveTangent;
    var result;
    suite('curveTangent()', function() {
      test('should be a function', function() {
        assert.ok(curveTangent);
        assert.typeOf(curveTangent, 'function');
      });
      test('should return a number: missing param #0~4', function() {
        result = myp5.curveTangent();
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Catmull-Rom Curve', function() {
        result = myp5.curveTangent(95, 73, 73, 15, 0.5);
        assert.equal(result, 10);
        assert.notEqual(result, -1);
      });
    });
  });

});
