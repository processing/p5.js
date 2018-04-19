suite('Error Helpers', function() {
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

  // unit tests for validateParameters
  suite('validateParameters: Numbers + optional Constant', function() {
    test('arc(): no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          p5._validateParameters('arc', [1, 1, 10.5, 10, 0, Math.PI, 'pie']);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('arc(): missing param #4, #5', function() {
      assert.validationError(function() {
        p5._validateParameters('arc', [1, 1, 10.5, 10]);
      });
    });
    test('arc(): missing param #0', function() {
      assert.validationError(function() {
        p5._validateParameters('arc', [
          undefined,
          1,
          10.5,
          10,
          0,
          Math.PI,
          'pie'
        ]);
      });
    });
    test('arc(): missing param #4', function() {
      assert.validationError(function() {
        p5._validateParameters('arc', [
          1,
          1,
          10.5,
          10,
          undefined,
          Math.PI,
          'pie'
        ]);
      });
    });
    test('arc(): missing param #5', function() {
      assert.validationError(function() {
        p5._validateParameters('arc', [1, 1, 10.5, 10, 0, undefined, 'pie']);
      });
    });
    test('arc(): missing param #6, no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          p5._validateParameters('arc', [1, 1, 10.5, 10, 0, Math.PI]);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('arc(): wrong param type at #0', function() {
      assert.validationError(function() {
        p5._validateParameters('arc', ['a', 1, 10.5, 10, 0, Math.PI, 'pie']);
      });
    });
  });

  suite('validateParameters: Numbers + optional Constant', function() {
    test('rect(): no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          p5._validateParameters('rect', [1, 1, 10.5, 10]);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('rect(): missing param #3', function() {
      assert.validationError(function() {
        p5._validateParameters('rect', [1, 1, 10.5]);
      });
    });
    test('rect(): wrong param type at #0', function() {
      assert.validationError(function() {
        p5._validateParameters('rect', ['a', 1, 10.5, 10, 0, Math.PI]);
      });
    });
  });

  suite(
    'validateParameters: class, multi-types + optional Numbers',
    function() {
      test('ambientLight(): no friendly-err-msg', function() {
        assert.doesNotThrow(
          function() {
            var c = myp5.color(255, 204, 0);
            p5._validateParameters('ambientLight', [c]);
          },
          Error,
          'got unwanted exception'
        );
      });
    }
  );

  suite('validateParameters: multi-format', function() {
    test('color(): no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          p5._validateParameters('color', [65]);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('color(): no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          p5._validateParameters('color', [65, 0.5]);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('color(): no friendly-err-msg', function() {
      assert.doesNotThrow(
        function() {
          p5._validateParameters('color', [255, 204, 0]);
        },
        Error,
        'got unwanted exception'
      );
    });
    test('color(): optional parameter, incorrect type', function() {
      assert.validationError(function() {
        p5._validateParameters('color', [0, 0, 0, 'A']);
      });
    });
    test('color(): extra parameter', function() {
      assert.validationError(function() {
        p5._validateParameters('color', [[0, 0, 0], 0]);
      });
    });
    test('color(): incorrect element type', function() {
      assert.validationError(function() {
        p5._validateParameters('color', [['A', 'B', 'C']]);
      });
    });
    test('color(): incorrect parameter count', function() {
      assert.validationError(function() {
        p5._validateParameters('color', ['A', 'A', 0, 0, 0, 0, 0, 0]);
      });
    });
  });

  suite('helpForMisusedAtTopLevelCode', function() {
    var help = function(msg) {
      var log = [];
      var logger = function(msg) {
        log.push(msg);
      };

      p5.prototype._helpForMisusedAtTopLevelCode({ message: msg }, logger);
      assert.equal(log.length, 1);
      return log[0];
    };

    test('help for constants is shown', function() {
      assert.match(
        help("'HALF_PI' is undefined"),
        /Did you just try to use p5\.js's HALF_PI constant\?/
      );
    });

    test('help for functions is shown', function() {
      assert.match(
        help("'smooth' is undefined"),
        /Did you just try to use p5\.js's smooth\(\) function\?/
      );
    });

    test('help for variables is shown', function() {
      assert.match(
        help("'focused' is undefined"),
        /Did you just try to use p5\.js's focused variable\?/
      );
    });
  });
});
