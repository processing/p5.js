suite('Attributes', function() {
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

  suite('p5.prototype.ellipseMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.ellipseMode);
      assert.typeOf(myp5.ellipseMode, 'function');
    });
    test('missing param #0', function() {
      assert.validationError(function() {
        myp5.ellipseMode();
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.ellipseMode(myp5.BEVEL);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.ellipseMode(20);
      });
    });
  });

  suite('p5.prototype.rectMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.rectMode);
      assert.typeOf(myp5.rectMode, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.rectMode(myp5.MITER);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.rectMode(64);
      });
    });
  });

  suite('p5.prototype.noSmooth', function() {
    test('should be a function', function() {
      assert.ok(myp5.noSmooth);
      assert.typeOf(myp5.noSmooth, 'function');
    });
  });

  suite('p5.prototype.smooth', function() {
    test('should be a function', function() {
      assert.ok(myp5.smooth);
      assert.typeOf(myp5.smooth, 'function');
    });
  });

  suite('p5.prototype.strokeCap', function() {
    test('should be a function', function() {
      assert.ok(myp5.strokeCap);
      assert.typeOf(myp5.strokeCap, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.strokeCap(myp5.CORNER);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.strokeCap(40);
      });
    });
  });

  suite('p5.prototype.strokeJoin', function() {
    test('should be a function', function() {
      assert.ok(myp5.strokeJoin);
      assert.typeOf(myp5.strokeJoin, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.strokeJoin(myp5.CORNER);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.strokeJoin(35);
      });
    });
  });

  suite('p5.prototype.strokeWeight', function() {
    test('should be a function', function() {
      assert.ok(myp5.strokeWeight);
      assert.typeOf(myp5.strokeWeight, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.strokeWeight('a');
      });
    });
  });
});
