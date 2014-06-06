suite('Color', function() {
  
  // p5 instance
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  suite('p5.prototype.colorMode', function() {
    var colorMode = myp5._colorMode;
    suite('colorMode(RGB)', function() {
      test('should be a function', function() {
        assert.ok(colorMode);
      });
      test('should set mode to HSB', function() {
        myp5.colorMode(myp5.HSB); 
        assert.equal(myp5._colorMode, myp5.HSB);
      });
    });
  });

});