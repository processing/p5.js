suite('Renderer', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.createCanvas', function() {
    test('should have correct initial colors', function() {
      var white = myp5.color(255, 255, 255).levels;
      var black = myp5.color(0, 0, 0).levels;
      assert.deepEqual(myp5.color(myp5._renderer._getFill()).levels, white);
      assert.deepEqual(myp5.color(myp5._renderer._getStroke()).levels, black);
      assert.deepEqual(myp5.color(myp5.drawingContext.fillStyle).levels, white);
      assert.deepEqual(
        myp5.color(myp5.drawingContext.strokeStyle).levels,
        black
      );
      myp5.createCanvas(100, 100);
      assert.deepEqual(myp5.color(myp5._renderer._getFill()).levels, white);
      assert.deepEqual(myp5.color(myp5._renderer._getStroke()).levels, black);
      assert.deepEqual(myp5.color(myp5.drawingContext.fillStyle).levels, white);
      assert.deepEqual(
        myp5.color(myp5.drawingContext.strokeStyle).levels,
        black
      );
    });
  });

  suite('p5.prototype.resizeCanvas', function() {
    test('should resize canvas', function() {
      myp5.resizeCanvas(10, 20);
      assert.equal(myp5.canvas.width, 10 * myp5.pixelDensity());
      assert.equal(myp5.canvas.height, 20 * myp5.pixelDensity());
    });

    test('should restore fill color', function() {
      myp5.fill('#f0f0f0');
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.fillStyle, '#f0f0f0');
    });

    test('should restore stroke color', function() {
      myp5.stroke('#f0f0f0');
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.strokeStyle, '#f0f0f0');
    });

    test('should restore stroke weight', function() {
      myp5.strokeWeight(323);
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.lineWidth, 323);
    });

    test('should restore stroke cap', function() {
      myp5.strokeCap(myp5.PROJECT);
      myp5.resizeCanvas(10, 10);
      assert.equal(myp5.drawingContext.lineCap, myp5.PROJECT);
    });
  });

  suite('p5.prototype.blendMode', function() {
    var drawX = function() {
      myp5.strokeWeight(30);
      myp5.stroke(80, 150, 255);
      myp5.line(25, 25, 75, 75);
      myp5.stroke(255, 50, 50);
      myp5.line(75, 25, 25, 75);
    };
    test('should be a function', function() {
      assert.ok(myp5.blendMode);
      assert.typeOf(myp5.blendMode, 'function');
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

  suite('webgl assertions', function() {
    test('box() should throw an Error', function() {
      expect(function() {
        myp5.box(100);
      }).to.throw(Error);
    });
    test('sphere() should throw an Error', function() {
      expect(function() {
        myp5.sphere(100);
      }).to.throw(Error);
    });
    test('rotateX() should throw an Error', function() {
      expect(function() {
        myp5.rotateX(100);
      }).to.throw(Error);
    });
    test('normalMaterial() should throw an Error', function() {
      expect(function() {
        myp5.normalMaterial(100);
      }).to.throw(Error);
    });
  });
});
