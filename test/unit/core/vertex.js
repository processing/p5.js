suite('Vertex', function() {
  var myp5;
  let _friendlyLocalizedErrorSpy;
  setup(function(done) {
    _friendlyLocalizedErrorSpy = sinon.spy(p5, '_friendlyLocalizedError');
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    _friendlyLocalizedErrorSpy.restore();
    myp5.remove();
  });

  suite('p5.prototype.beginShape', function() {
    test('should be a function', function() {
      assert.ok(myp5.beginShape);
      assert.typeOf(myp5.beginShape, 'function');
    });
    test('no friendly-err-msg. missing param #0', function() {
      assert.doesNotThrow(
        function() {
          myp5.beginShape();
        },
        Error,
        'got unwanted exception'
      );
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.beginShape(myp5.BEVEL);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.beginShape(20);
      });
    });
  });

  suite('p5.prototype.quadraticVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.quadraticVertex);
      assert.typeOf(myp5.quadraticVertex, 'function');
    });
    test('missing param #3', function() {
      assert.validationError(function() {
        myp5.quadraticVertex(80, 20, 50);
      });
    });
    test('missing param #5', function() {
      assert.validationError(function() {
        myp5.quadraticVertex(80, 20, 50, 50, 10);
      });
    });
    test('_friendlyError is called. vertex() should be used once before quadraticVertex()', function() {
      myp5.quadraticVertex(80, 20, 50, 50, 10, 20);
      assert(_friendlyLocalizedErrorSpy.calledOnce, 'p5._friendlyError was not called');
    });
  });

  suite('p5.prototype.bezierVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.bezierVertex);
      assert.typeOf(myp5.bezierVertex, 'function');
    });
    test('missing param #6', function() {
      assert.validationError(function() {
        myp5.bezierVertex(25, 30, 25, -30, -25);
      });
    });
    test('missing param #8-9', function() {
      assert.validationError(function() {
        myp5.bezierVertex(25, 30, 25, -30, -25, 30, 20);
      });
    });
    test('_friendlyError is called. vertex() should be used once before bezierVertex()', function() {
      myp5.bezierVertex(25, 30, 25, -30, -25, 30);
      assert(_friendlyLocalizedErrorSpy.calledOnce, 'p5._friendlyError was not called');
    });
  });

  suite('p5.prototype.curveVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.curveVertex);
      assert.typeOf(myp5.curveVertex, 'function');
    });
    test('missing param #1', function() {
      assert.validationError(function() {
        myp5.curveVertex(40);
      });
    });
  });

  suite('p5.prototype.endShape', function() {
    test('should be a function', function() {
      assert.ok(myp5.endShape);
      assert.typeOf(myp5.endShape, 'function');
    });
    test('no friendly-err-msg. missing param #0', function() {
      assert.doesNotThrow(
        function() {
          myp5.endShape();
        },
        Error,
        'got unwanted exception'
      );
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.endShape(20);
      });
    });
  });

  suite('p5.prototype.vertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.vertex);
      assert.typeOf(myp5.vertex, 'function');
    });
    // p5.prototype.vertex parameter validation is absent
    test.skip('missing param #1', function() {
      assert.validationError(function() {
        myp5.vertex(10);
      });
    });
    test.skip('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.vertex('a', 1);
      });
    });
  });
});
