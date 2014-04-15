suite('Color', function() {

  // p5 instance
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  suite('p5.prototype.colorMode', function() {
    var colorMode = myp5.colorMode;
    suite('colorMode(RGB)', function() {
      test('should be a function', function() {
        assert.ok(colorMode);
      });
      // test('should be a function', function() {
      //   assert.ok(p);
      //   assert.typeOf(p, 'Object');
      // });
      // test('should set mode to RGB', function() {
      //   p.colorMode(p5.prototype.RGB);
      //   assert.equal(p.settings.colorMode, p5.prototype.RGB);
      // });
    });
  });

});
