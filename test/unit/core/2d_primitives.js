suite('2D Primitives', function() {
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

  suite('p5.prototype.arc', function() {
    test('should be a function', function() {
      assert.ok(myp5.arc);
      assert.typeOf(myp5.arc, 'function');
    });
    test('no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.arc(1, 1, 10.5, 10, 0, Math.PI, 'pie');
        },
        Error,
        'got unwanted exception'
      );
    });
    test('missing param #4, #5', function() {
      assert.validationError(function() {
        myp5.arc(1, 1, 10.5, 10);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.arc('a', 1, 10.5, 10, 0, Math.PI, 'pie');
      });
    });
  });

  suite('p5.prototype.ellipse', function() {
    test('should be a function', function() {
      assert.ok(myp5.ellipse);
      assert.typeOf(myp5.ellipse, 'function');
    });
    test('no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.ellipse(0, 0, 100);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('missing param #2', function() {
      assert.validationError(function() {
        myp5.ellipse(0, 0);
      });
    });
    test('missing param #2', function() {
      assert.validationError(function() {
        var size;
        myp5.ellipse(0, 0, size);
      });
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.ellipse('a', 0, 100, 100);
      });
    });
  });

  suite('p5.prototype.line', function() {
    test('should be a function', function() {
      assert.ok(myp5.line);
      assert.typeOf(myp5.line, 'function');
    });
    test('no friendly-err-msg, 2D', function() {
      assert.doesNotThrow(
        function() {
          myp5.line(0, 0, 100, 100);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg, 3D', function() {
      assert.doesNotThrow(
        function() {
          myp5.line(0, 0, 100, 100, 20, Math.PI);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('missing param #3', function() {
      assert.validationError(function() {
        myp5.line(0, 0, Math.PI);
      });
    });
    test('missing param #4 ', function() {
      // this err case escapes
      assert.validationError(function() {
        var x3;
        myp5.line(0, 0, 100, 100, x3, Math.PI);
      });
    });
    test('wrong param type at #1', function() {
      assert.validationError(function() {
        myp5.line(0, 'a', 100, 100);
      });
    });
  });

  suite('p5.prototype.point', function() {
    test('should be a function', function() {
      assert.ok(myp5.point);
      assert.typeOf(myp5.point, 'function');
    });
    test('no friendly-err-msg, 2D', function() {
      assert.doesNotThrow(
        function() {
          myp5.point(Math.PI, 0);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg, 3D', function() {
      assert.doesNotThrow(
        function() {
          myp5.point(Math.PI, 0, 100);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('missing param #1', function() {
      assert.validationError(function() {
        myp5.point(0);
      });
    });
    /* this is not an error because 2d point exists.
    test('missing param #3', function() {
      // this err case escapes
      assert.validationError(function() {
        var z;
        myp5.point(0, Math.PI, z);
      });
    });
    */
    test('wrong param type at #1', function() {
      assert.validationError(function() {
        myp5.point(Math.PI, 'a');
      });
    });
  });

  suite('p5.prototype.quad', function() {
    test('should be a function', function() {
      assert.ok(myp5.quad);
      assert.typeOf(myp5.quad, 'function');
    });
    test('no friendly-err-msg, 2D', function() {
      assert.doesNotThrow(
        function() {
          myp5.quad(Math.PI, 0, Math.PI, 5.1, 10, 5.1, 10, 0);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('missing param #7', function() {
      assert.validationError(function() {
        myp5.quad(Math.PI, 0, Math.PI, 5.1, 10, 5.1, 10);
      });
    });
    test('wrong param type at #1', function() {
      assert.validationError(function() {
        myp5.quad(Math.PI, 'a', Math.PI, 5.1, 10, 5.1, 10, 0);
      });
    });
  });

  suite('p5.prototype.rect', function() {
    test('should be a function', function() {
      assert.ok(myp5.rect);
      assert.typeOf(myp5.rect, 'function');
    });
    test('no friendly-err-msg, format I', function() {
      assert.doesNotThrow(
        function() {
          myp5.rect(0, 0, 100, 100);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg, format II', function() {
      assert.doesNotThrow(
        function() {
          myp5.rect(0, 0, 100, 100, 1, Math.PI, 1, Math.PI);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('missing param #3', function() {
      assert.validationError(function() {
        myp5.rect(0, 0, Math.PI);
      });
    });
    test('missing param #4', function() {
      // this err case escapes
      assert.validationError(function() {
        var r1;
        myp5.rect(0, 0, 100, 100, r1, Math.PI, 1, Math.PI);
      });
    });
    test('wrong param type at #1', function() {
      assert.validationError(function() {
        myp5.rect(0, 'a', 100, 100);
      });
    });
  });

  suite('p5.prototype.triangle', function() {
    test('should be a function', function() {
      assert.ok(myp5.triangle);
      assert.typeOf(myp5.triangle, 'function');
    });
    test('no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.triangle(Math.PI, 0, Math.PI, 5.1, 10, 5.1);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('missing param #5', function() {
      assert.validationError(function() {
        myp5.triangle(Math.PI, 0, Math.PI, 5.1, 10);
      });
    });
    test('wrong param type at #1', function() {
      assert.validationError(function() {
        myp5.triangle(Math.PI, 'a', Math.PI, 5.1, 10, 5.1);
      });
    });
  });
});
