suite('Core', function(){
  var node;
  
  setup(function () {
    node = document.createElement('div');
    document.body.appendChild(node);
  });
  
  teardown(function () {
    document.body.removeChild(node);
  });

  suite('new p5(sketch, null, true)', function () {

    // The reason why these tests run inside the suite() { ... } block is
    // because they test code that checks document.readyState.  If we waited
    // to run the test in test() { ... } the page would already be loaded and
    // readyState would be "completed".  By doing the tests things this way
    // readyState is "loading" and we can verify that the code is doing the
    // right thing during page load.

    var myp5 = new p5(function() { }, null, true);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext synchronously', function () {
      assert.ok(isDrawingContextDefined);
    });
  });

  suite('new p5(sketch, null, false)', function () {
    var myp5 = new p5(function() { }, null, false);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext asynchronously', function () {
      assert.equal(isDrawingContextDefined, false);
      assert.isDefined(myp5.drawingContext);
    });
  });

  suite('new p5(sketch, node, true)', function () {
    var myp5 = new p5(function() { }, node, true);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext synchronously', function () {
      assert.ok(isDrawingContextDefined);
    });
  });

  suite('new p5(sketch, node)', function () {
    var myp5 = new p5(function() { }, node);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext asynchronously', function () {
      assert.equal(isDrawingContextDefined, false);
      assert.isDefined(myp5.drawingContext);
    });
  });

  suite('new p5(sketch, true)', function () {
    var myp5 = new p5(function() { }, true);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext synchronously', function () {
      assert.ok(isDrawingContextDefined);
    });
  });

  suite('new p5(sketch)', function () {
    var myp5 = new p5(function() { });
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext asynchronously', function () {
      assert.equal(isDrawingContextDefined, false);
      assert.isDefined(myp5.drawingContext);
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