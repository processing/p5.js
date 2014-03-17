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

});
