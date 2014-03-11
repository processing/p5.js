suite('Random', function() {

  suite('Processing.prototype.random', function() {
    var random = Processing.prototype.random;
    var result;
    suite('random()', function() {
      setup(function() {
        result = random();
      });
      test('should return a number', function() {
        assert.typeOf(result, 'number');
      });
      test('should return a number 0 <= n < 1', function() {
        assert.isTrue(result >= 0);
        assert.isTrue(result < 1);
      });
    });
    suite('random(5)', function() {
      test('should return a number 0 <= n < 5', function() {
        result = random(5);
        assert.isTrue(result >= 0);
        assert.isTrue(result < 5);
      });
    });
    suite('random(1, 10)', function() {
      test('should return a number 1 <= n < 10', function() {
        result = random(1, 10);
        assert.isTrue(result >= 1);
        assert.isTrue(result < 10);
      });
    });
  });
  
});