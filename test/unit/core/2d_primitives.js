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
      test('should draw', function(done) {
        myp5.background(155);
        myp5.fill(0);
        myp5.ellipse(0, 0, 100, 100);

        testRender('unit/assets/renders/ellipse.png', myp5, function(res) {
          assert.isTrue(res);
          done();
        });
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
      test('should draw', function(done) {
        myp5.background(155);
        myp5.fill(0);
        myp5.line(0, 0, 100, 100);

        testRender('unit/assets/renders/line.png', myp5, function(res) {
          assert.isTrue(res);
          done();
        });
      });
    });
  });

  suite('p5.prototype.fillRule', function() {
    var fillRule = p5.prototype.fillRule;
    suite('fillRule()', function() {
      test('should be a function', function() {
        assert.ok(fillRule);
        assert.typeOf(fillRule, 'function');
      });
      test('should draw', function(done) {
        myp5.noStroke();
        myp5.fillRule(myp5.NONZERO);
        myp5.beginShape();
        myp5.vertex(20, 80);
        myp5.vertex(50, 20);
        myp5.vertex(80, 80);
        myp5.vertex(20, 40);
        myp5.vertex(80, 40);
        myp5.endShape();

        testRender('unit/assets/renders/nonzero.png', myp5, function(res) {
          assert.isTrue(res);
          done();
        });
      });
      test('should draw', function(done) {
        myp5.noStroke();
        myp5.fillRule(myp5.EVENODD);
        myp5.beginShape();
        myp5.vertex(20, 80);
        myp5.vertex(50, 20);
        myp5.vertex(80, 80);
        myp5.vertex(20, 40);
        myp5.vertex(80, 40);
        myp5.endShape();

        testRender('unit/assets/renders/evenodd.png', myp5, function(res) {
          assert.isTrue(res);
          done();
        });
      });
    });
  });

});
