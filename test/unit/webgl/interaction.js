suite('Interaction', function() {
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

  suite('p5.prototype.orbitControl', function() {
    test('should be a function', function() {
      assert.ok(myp5.orbitControl);
      assert.typeOf(myp5.orbitControl, 'function');
    });
    test('missing params. no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.orbitControl();
        },
        Error,
        'got unwanted exception'
      );
    });
    test('wrong param type #0', function() {
      assert.validationError(function() {
        myp5.orbitControl('s');
      });
    });
  });

  suite('p5.prototype.debugMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.debugMode);
      assert.typeOf(myp5.debugMode, 'function');
    });
    test('missing params. no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          myp5.debugMode();
        },
        Error,
        'got unwanted exception'
      );
    });
    test('wrong param type #0', function() {
      assert.validationError(function() {
        myp5.debugMode(myp5.CORNER);
      });
    });
    test('wrong param type #2', function() {
      assert.validationError(function() {
        myp5.debugMode(myp5.AXES, 1, 1, 'a', 2);
      });
    });
    test('wrong param type #2', function() {
      assert.validationError(function() {
        myp5.debugMode(myp5.GRID, 1, 1, 'a');
      });
    });
  });

  suite('p5.prototype.noDebugMode', function() {
    test('should be a function', function() {
      assert.ok(myp5.noDebugMode);
      assert.typeOf(myp5.noDebugMode, 'function');
    });
  });
});
