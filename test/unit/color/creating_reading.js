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

    suite('color(brightness,opacity)', function() {
      setup(function() {
        color = myp5.color(1,2);
      });
      test('should return a p5.Color', function() {
        assert.instanceOf(color, p5.Color);
        assert.deepEqual(color.rgba, [1,1,1,2]);
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

  suite('p5.prototype.red,green,blue,brightness', function() {
    var color, rgbaColor, colorArr, colorAndAlphaArr;

    setup(function() {
      colorArr = [1,2,3];
      colorAndAlphaArr = [1,2,3,4];
      color = myp5.color(colorArr);
      rgbaColor = myp5.color(colorAndAlphaArr);
    });

    test('p5.prototype.red', function() {
      assert.equal(myp5.red(colorAndAlphaArr), 1);
      assert.equal(myp5.red(colorArr), 1);
      assert.equal(myp5.red(color), 1);
      assert.equal(myp5.red(rgbaColor), 1);
    });

    test('p5.prototype.green', function() {
      assert.equal(myp5.green(colorAndAlphaArr), 2);
      assert.equal(myp5.green(colorArr), 2);
      assert.equal(myp5.green(color), 2);
      assert.equal(myp5.green(rgbaColor), 2);

    });

    test('p5.prototype.blue', function() {
      assert.equal(myp5.blue(colorAndAlphaArr), 3);
      assert.equal(myp5.blue(colorArr), 3);
      assert.equal(myp5.blue(color), 3);
      assert.equal(myp5.blue(rgbaColor), 3);
    });

    test('p5.prototype.brightness', function() {
      assert.equal(myp5.brightness(colorAndAlphaArr), 1);
      assert.equal(myp5.brightness(colorArr), 1);
      assert.equal(myp5.brightness(color), 1);
      assert.equal(myp5.brightness(rgbaColor), 1);
    });
  });

});