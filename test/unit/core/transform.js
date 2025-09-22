suite('Transform', function() {
  var sketch1; // sketch without WEBGL Mode
  var sketch2; // skecth with WEBGL mode
  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        sketch1 = p;
      };
    });
    new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
        sketch2 = p;
      };
    });
    done();
  });

  teardown(function() {
    sketch1.remove();
    sketch2.remove();
  });

  suite('p5.prototype.rotate', function() {
    test('should be a function', function() {
      assert.ok(sketch1.rotate);
      assert.typeOf(sketch1.rotate, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch1.rotate('a');
      });
    });
    test('wrong param type at #1', function() {
      assert.validationError(function() {
        sketch1.rotate(sketch1.PI, 'x');
      });
    });
  });

  suite('p5.prototype.rotateX', function() {
    test('should be a function', function() {
      assert.ok(sketch1.rotateX);
      assert.typeOf(sketch1.rotateX, 'function');
    });
    test('throws error. should be used in WEBGL mode', function() {
      assert.throws(function() {
        sketch1.rotateX(100);
      }, Error);
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch2.rotateX('x');
      });
    });
  });

  suite('p5.prototype.rotateY', function() {
    test('should be a function', function() {
      assert.ok(sketch1.rotateY);
      assert.typeOf(sketch1.rotateY, 'function');
    });
    test('throws error. should be used in WEBGL mode', function() {
      assert.throws(function() {
        sketch1.rotateY(100);
      }, Error);
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch2.rotateY('x');
      });
    });
  });

  suite('p5.prototype.rotateZ', function() {
    test('should be a function', function() {
      assert.ok(sketch1.rotateZ);
      assert.typeOf(sketch1.rotateZ, 'function');
    });
    test('throws error. should be used in WEBGL mode', function() {
      assert.throws(function() {
        sketch1.rotateZ(100);
      }, Error);
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch2.rotateZ('x');
      });
    });
  });

  suite('p5.prototype.scale', function() {
    test('should be a function', function() {
      assert.ok(sketch1.scale);
      assert.typeOf(sketch1.scale, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch1.scale('a');
      });
    });
  });

  suite('p5.prototype.shearX', function() {
    test('should be a function', function() {
      assert.ok(sketch1.shearX);
      assert.typeOf(sketch1.shearX, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch1.shearX('a');
      });
    });
  });

  suite('p5.prototype.shearY', function() {
    test('should be a function', function() {
      assert.ok(sketch1.shearY);
      assert.typeOf(sketch1.shearY, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch1.shearY('a');
      });
    });
  });

  suite('p5.prototype.translate', function() {
    test('should be a function', function() {
      assert.ok(sketch1.translate);
      assert.typeOf(sketch1.translate, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch1.translate('a', 10);
      });
    });
    test('missing param #1', function() {
      assert.validationError(function() {
        sketch1.translate(10);
      });
    });
  });

  suite('p5.prototype.setViewport', function() {
    test('should be a function', function() {
      assert.ok(sketch1.setViewport);
      assert.typeOf(sketch1.setViewport, 'function');
    });

    test('wrong param type at #0', function() {
      assert.validationError(function() {
        sketch1.setViewport('a', 0, 1, 1);
      });
    });

    test('wrong param type at #1', function() {
      assert.validationError(function() {
        sketch1.setViewport(0, 'a', 1, 1);
      });
    });

    test('wrong param type at #2', function() {
      assert.validationError(function() {
        sketch1.setViewport(0, 0, 'a', 1);
      });
    });

    test('wrong param type at #3', function() {
      assert.validationError(function() {
        sketch1.setViewport(0, 0, 1, 'a');
      });
    });

    test('should set the viewport correctly', function() {
      // On a 100x100 canvas, map to a simple 10x10 grid
      sketch1.setViewport(0, 10, 0, 10);
      var t = sketch1.drawingContext.getTransform();
      // scaleX should be width/10 = 10
      assert.closeTo(t.a, 10, 0.001);
      // scaleY should be height/10 = 10
      assert.closeTo(t.d, 10, 0.001);
      // translateX should be 0
      assert.closeTo(t.e, 0, 0.001);
      // translateY should be 0
      assert.closeTo(t.f, 0, 0.001);
    });

    test('should handle inverted viewport y-axis', function() {
      // On a 100x100 canvas, map to a centered coordinate system with inverted y
      sketch1.setViewport(-1, 1, 1, -1);
      var t = sketch1.drawingContext.getTransform();
      // scaleX should be width/2 = 50
      assert.closeTo(t.a, 50, 0.001);
      // scaleY should be height/-2 = -50
      assert.closeTo(t.d, -50, 0.001);
      // translateX should be width/2 = 50
      assert.closeTo(t.e, 50, 0.001);
      // translateY should be height/2 = 50
      assert.closeTo(t.f, 50, 0.001);
    });
  });
});
