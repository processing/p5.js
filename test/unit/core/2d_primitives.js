suite('2D Primitives', function() {

  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  teardown(function(){
    myp5.clear();
  });

  suite('p5.prototype.ellipse', function() {
    var ellipse = p5.prototype.ellipse;
    suite('ellipse()', function() {
      test('should be a function', function() {
        assert.ok(ellipse);
        assert.typeOf(ellipse, 'function');
      });
    });
  });

  suite('p5.prototype.line', function() {
    var line = p5.prototype.line;
    suite('line()', function() {
      test('should be a function', function() {
        assert.ok(line);
        assert.typeOf(line, 'function');
      });
    });
  });

});
