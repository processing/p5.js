
suite('p5.Font', function() {

  var v, myp5 = new p5(function(p) {
    p.setup = function() {};
    p.draw = function() {};
  });

  suite('p5.prototype.p5.Font()', function() {
    setup(function() {
      v = new p5.Font(myp5);
    });
    test('should create instance of p5.Font', function() {
      assert.instanceOf(v, p5.Font);
    });

    test('should have font initialized to null', function() {
      assert.equal(p5.Font.font, null);
    });
  });

  suite('p5.Font.textBounds()', function() {
    test('should have accessible textBounds() function', function() {
      assert.equal(typeof v.textBounds, 'function');
    });
  });

});
