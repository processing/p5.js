suite('Curves', function() {

  suite('Processing.prototype.curvePoint', function() {
    var curvePoint = Processing.prototype.curvePoint;
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
      test('should return the correct point on a Bezier Curve', function() {
        result = curvePoint(5, 5, 73, 73, 0.5);
        assert.equal(result, 39);
        assert.notEqual(result, -1);
      });
    });
  });

  suite('Processing.prototype.curveTangent', function() {
    var curveTangent = Processing.prototype.curveTangent;
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
      test('should return the correct point on a Bezier Curve', function() {
        result = curveTangent(95, 73, 73, 15, 0.5);
        assert.equal(result, 10);
        assert.notEqual(result, -1);
      });
    });
  });

});
