import p5 from '../../../src/app.js';

suite('3D Primitives', function() {
  var myp5;

  beforeAll(function() {
    myp5 = new p5(function(p) {
      p.setup = function() {
        p.createCanvas(100, 100, p.WEBGL);
      };
    });
  });

  afterAll(function() {
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
    test('no friendly-err-msg. missing height; param #1', function() {
      assert.doesNotThrow(
        function() {
          myp5.cylinder(20);
        },
        Error,
        'got unwanted exception'
      );
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
    test('no friendly-err-msg. missing height; param #1', function() {
      assert.doesNotThrow(
        function() {
          myp5.cone(20);
        },
        Error,
        'got unwanted exception'
      );
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
