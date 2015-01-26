suite('Core', function(){
  var myp5, node;
  
  setup(function () {
    node = document.createElement('div');
    document.body.appendChild(node);
  });
  
  teardown(function () {
    document.body.removeChild(node);
  });

  suite('new p5(sketch, null, true)', function () {
    myp5 = new p5(function(sketch) { }, null, true);
    myp5.background(128); // sync call
    
    test('should call methods synchronously after instantiation without throwing an exception', function () {
      assert.ok(true);
    });
  });

  suite('new p5(sketch, node, true)', function () {
    myp5 = new p5(function(sketch) { }, node, true);
    myp5.background(128); // sync call

    test('should call methods synchronously after instantiation without throwing an exception', function () {
      assert.ok(true);
    });
  });

  suite('new p5(sketch, true)', function () {
    myp5 = new p5(function(sketch) { }, true);
    myp5.background(128); // sync call

    test('should call methods synchronously after instantiation without throwing an exception', function () {
      assert.ok(true);
    });
  });

  suite('p5.prototype', function() {
    //var prototype = p5;
    //var result;
    /*suite('abs()', function() {
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
    });*/
  });

});