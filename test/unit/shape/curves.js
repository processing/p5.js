suite('Curves', function() {

  suite('Processing.prototype.bezierPoint', function() {
    var bezierPoint = Processing.prototype.bezierPoint;
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

  suite('Processing.prototype.bezierTangent', function() {
    var bezierTangent = Processing.prototype.bezierTangent;
    var result;
    suite('bezierTangent()', function() {
      test('should be a function', function() {
        assert.ok(bezierTangent);
        assert.typeOf(bezierTangent, 'function');
      });
      test('should return a number', function() {
        result = bezierTangent();
        assert.typeOf(result, 'number');
      });
      test('should return the correct point on a Bezier Curve', function() {
        result = bezierTangent(85, 10, 90, 15, 0.5);
        assert.equal(result, 7.5);
        assert.notEqual(result, -1);
      });
    });
  });

});
