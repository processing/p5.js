suite('CreatingReading', function() {
  
  // p5 instance
  var myp5 = new p5(function( sketch ) {
    sketch.setup = function() {};
    sketch.draw = function() {};
  });

  setup(function() {
    myp5.colorMode(myp5.RGB, 255); 
  });

  suite('p5.prototype.color', function() {
    var color;

    suite('color([])', function() {
      setup(function() {
        color = myp5.color([1,2,3]);
      });
      test('should return a p5.Color', function() {
        assert.instanceOf(color, p5.Color);
        assert.deepEqual(color.rgba, [1,2,3,255]);
      });
    });

    suite('color(a,b,c)', function() {
      setup(function() {
        color = myp5.color(1,2,3);
      });
      test('should return a p5.Color', function() {
        assert.instanceOf(color, p5.Color);
        assert.deepEqual(color.rgba, [1,2,3,255]);
      });
    });

    suite('color(p5.Color)', function() {
      setup(function() {
        var tempColor = myp5.color([1,2,3]);
        color = myp5.color(tempColor);
      });
      test('should return a p5.Color', function() {
        assert.instanceOf(color, p5.Color);
        assert.deepEqual(color.rgba, [1,2,3,255]);
      });
    });
  });

  suite('p5.prototype.red,green,blue', function() {
    var color, colorArr;

    setup(function() {
      colorArr = [1,2,3];
      color = myp5.color(colorArr);
    });

    test('p5.prototype.red', function() {
      assert.equal(myp5.red(colorArr), 1);
      assert.equal(myp5.red(color), 1);
    });

    test('p5.prototype.green', function() {
      assert.equal(myp5.green(colorArr), 2);
      assert.equal(myp5.green(color), 2);
    });

    test('p5.prototype.blue', function() {
      assert.equal(myp5.blue(colorArr), 3);
      assert.equal(myp5.blue(color), 3);
    });
  });

});