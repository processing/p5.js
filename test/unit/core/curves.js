suite('Curves', function() {

  suite('p5.prototype.bezierPoint', function() {
    var bezierPoint = p5.prototype.bezierPoint;
    var result;
    suite('bezierPoint()', function() {
      test('should be a function', function() {
        assert.ok(bezierPoint);
        assert.typeOf(bezierPoint, 'function');
      });
      test('should return a number', function() {
        result = bezierPoint();
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Bezier Curve', function() {
        result = bezierPoint(85, 10, 90, 15, 0.5);
        assert.equal(result, 50);
        assert.notEqual(result, -1);
      });
    });
  });

  suite('p5.prototype.bezierTangent', function() {
    var bezierTangent = p5.prototype.bezierTangent;
    var result;
    suite('curveTangent()', function() {
      test('should be a function', function() {
        assert.ok(bezierTangent);
        assert.typeOf(bezierTangent, 'function');
      });
      test('should return a number', function() {
        result = bezierTangent(95, 73, 73, 15, 0.5);
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Bezier Curve', function() {
        result = bezierTangent(95, 73, 73, 15, 0.5);
        assert.equal(result, -60);
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
      test('should return a number', function() {
        result = curvePoint(5, 5, 73, 73, 0.5);
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Catmull-Rom Curve', function() {
        result = curvePoint(5, 5, 73, 73, 0.5);
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
      test('should return a number', function() {
        result = curveTangent(95, 73, 73, 15, 0.5);
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Catmull-Rom Curve', function() {
        result = curveTangent(95, 73, 73, 15, 0.5);
        assert.equal(result, 10);
        assert.notEqual(result, -1);
      });
    });
  });

});
