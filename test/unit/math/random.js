suite('Random', function() {

  var random = Processing.prototype.random();

  suite('random()', function() {

    test('should return a number', function() {
      assert.typeOf(random, 'number');
    });

  });

  suite('random(10)', function() {

    var result = random(10);

    test('should return a number >= 0', function() {
      assert.isTrue(result >= 0);
    });

    test('should return a number < 10', function() {
      assert.isTrue(result < 10);
    });

  });

  suite('random(1, 10)', function() {

    var result = random(1, 10);

    test('should return a number >= 1', function() {
      assert.isTrue(result >= 1);
    });

    test('should return a number < 10', function() {
      assert.isTrue(result < 10);
    });

  });

});


