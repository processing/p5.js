suite('Calculation', function() {

  var abs = Processing.prototype.abs;
  var result;

  suite('abs()', function() {

    setup(function() {
      result = abs();
    });

    test('should be a function', function() {
      assert.ok(abs);
      assert.typeOf(abs, 'function');
    })

    test('should return a number', function() {
      assert.typeOf(result, 'number');
    });

  });

});