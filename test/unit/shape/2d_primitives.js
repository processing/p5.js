suite('2D Primitives', function() {
  
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  suite('p5.prototype.ellipse', function() {
    var ellipse = p5.prototype.ellipse;
    suite('ellipse()', function() {

      test('should be a function', function() {
        assert.ok(ellipse);
        assert.typeOf(ellipse, 'function');
      });
      test('should draw', function(done) {
        myp5.background(155);
        myp5.fill(0);
        myp5.ellipse(0, 0, 100, 100);

        testRender('unit/shape/renders/ellipse.png', myp5, function(res) {
          assert.isTrue(res);
          done();
        });
      });
    });
  });



});
