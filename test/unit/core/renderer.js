suite('Renderer', function() {

  var myp5 = new p5(function( p ) {
    p.setup = function() {};
    p.draw = function() {};
  });

  teardown(function(){
    myp5.clear();
  });

  suite('p5.prototype.blendMode', function() {
    var blendMode = p5.prototype.blendMode;
    var drawX = function() {
      myp5.strokeWeight(30);
      myp5.stroke(80, 150, 255);
      myp5.line(25, 25, 75, 75);
      myp5.stroke(255, 50, 50);
      myp5.line(75, 25, 25, 75);
    };
    suite('blendMode()', function() {
      test('should be a function', function() {
        assert.ok(blendMode);
        assert.typeOf(blendMode, 'function');
      });
      test('should be able to ADD', function() {
        myp5.blendMode(myp5.ADD);
        drawX();
      });
      test('should be able to MULTIPLY', function() {
        myp5.blendMode(myp5.MULTIPLY);
        drawX();
      });

    });
  });

});
