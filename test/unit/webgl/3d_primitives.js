suite('3D Primitives', function() {
  var myp5;

  if (!window.Modernizr.webgl) {
    return;
  }

  setup(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.plane', function() {
    test('should be a function', function() {
      assert.ok(myp5.plane);
      assert.typeOf(myp5.plane, 'function');
    });
    test('no friendly-err-msg. missing height param #1.', function() {
      assert.doesNotThrow(
        function() {
          myp5.plane(20);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.plane('a', 10);
      });
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.plane();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.box', function() {
    test('should be a function', function() {
      assert.ok(myp5.box);
      assert.typeOf(myp5.box, 'function');
    });
    test('wrong param type at #0 and #2', function() {
      assert.validationError(function() {
        myp5.box('a', 10, 'c');
      });
    });
    test('no friendly-err-msg. missing height, depth; param #1, #2.', function() {
      assert.doesNotThrow(
        function() {
          myp5.box(20, 20);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. missing depth param #2.', function() {
      assert.doesNotThrow(
        function() {
          myp5.box(20, 20);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.box();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.sphere', function() {
    test('should be a function', function() {
      assert.ok(myp5.sphere);
      assert.typeOf(myp5.sphere, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.sphere('a');
      });
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.sphere();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.cylinder', function() {
    test('should be a function', function() {
      assert.ok(myp5.cylinder);
      assert.typeOf(myp5.cylinder, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.cylinder('r', 10, 10);
      });
    });
    test('no friendly-err-msg. missing height; param #1', function() {
      assert.doesNotThrow(
        function() {
          myp5.cylinder(20);
        },
        Error,
        'got unwanted exception'
      );
    });
    //Parameter validation not done for bottomCap, topCap
    test.skip('wrong param type at #4', function() {
      assert.validationError(function() {
        myp5.cylinder('r', 10, 10, 14, 'a');
      });
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.cylinder();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.cone', function() {
    test('should be a function', function() {
      assert.ok(myp5.cone);
      assert.typeOf(myp5.cone, 'function');
    });
    test('wrong param type at #0 and #1', function() {
      assert.validationError(function() {
        myp5.cone('r', false, 10);
      });
    });
    test('no friendly-err-msg. missing height; param #1', function() {
      assert.doesNotThrow(
        function() {
          myp5.cone(20);
        },
        Error,
        'got unwanted exception'
      );
    });
    //Parameter validation not done for cap
    test.skip('wrong param type at #4', function() {
      assert.validationError(function() {
        myp5.cone(10, 10, 10, 14, 'false');
      });
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.cone();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.ellipsoid', function() {
    test('should be a function', function() {
      assert.ok(myp5.ellipsoid);
      assert.typeOf(myp5.ellipsoid, 'function');
    });
    test('wrong param type at #0 and #1', function() {
      assert.validationError(function() {
        myp5.ellipsoid('x', 'y', 10);
      });
    });
    test('no friendly-err-msg. missing param #1 #2', function() {
      assert.doesNotThrow(
        function() {
          myp5.ellipsoid(10);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.ellipsoid();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.torus', function() {
    test('should be a function', function() {
      assert.ok(myp5.torus);
      assert.typeOf(myp5.torus, 'function');
    });
    test('wrong param type at #0', function() {
      assert.validationError(function() {
        myp5.torus(false, 10);
      });
    });
    test('no friendly-err-msg. missing param #1', function() {
      assert.doesNotThrow(
        function() {
          myp5.torus(30);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. no parameters', function() {
      assert.doesNotThrow(
        function() {
          myp5.torus();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.RendererGL.prototype.ellipse', function() {
    test('should be a function', function() {
      assert.ok(myp5._renderer.ellipse);
      assert.typeOf(myp5._renderer.ellipse, 'function');
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
    test('no friendly-err-msg. detail parameter > 50', function() {
      assert.doesNotThrow(
        function() {
          myp5.ellipse(50, 50, 120, 30, 51);
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.RendererGL.prototype.arc', function() {
    test('should be a function', function() {
      assert.ok(myp5._renderer.arc);
      assert.typeOf(myp5._renderer.arc, 'function');
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
    test('no friendly-err-msg. detail parameter > 50', function() {
      assert.doesNotThrow(
        function() {
          myp5.arc(1, 1, 100, 100, 0, Math.PI / 2, 'chord', 51);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('no friendly-err-msg. default mode', function() {
      assert.doesNotThrow(
        function() {
          myp5.arc(1, 1, 100, 100, Math.PI / 4, Math.PI / 3);
        },
        Error,
        'got unwanted exception'
      );
    });
  });
});
