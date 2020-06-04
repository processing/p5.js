suite('Error Helpers', function() {
  var myp5;

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        p5._clearValidateParamsCache();
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('friendly error logger', function() {
    test('basic', function() {
      assert.doesNotThrow(
        function() {
          p5._friendlyError('basic', 'basic');
        },
        Error,
        'got unwanted exception'
      );
    });
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

  suite('validateParameters: a few edge cases', function() {
    // testing for edge cases mentioned in
    // https://github.com/processing/p5.js/issues/2740
    testUnMinified('color: wrong type for optional parameter', function() {
      let err = assert.throws(function() {
        p5._validateParameters('color', [0, 0, 0, 'A']);
      }, p5.ValidationError);
      assert.strictEqual(
        err.type,
        'WRONG_TYPE',
        'ValidationError type is correct'
      );
    });

    testUnMinified('color: superfluous parameter', function() {
      assert.throws(function() {
        p5._validateParameters('color', [[0, 0, 0], 0]);
      }, p5.ValidationError);
      // not performing a type check here as it could reasonably fit as
      // either WRONG_TYPE or TOO_MANY_ARGUMENTS
    });

    testUnMinified('color: wrong element types', function() {
      let err = assert.throws(function() {
        p5._validateParameters('color', [['A', 'B', 'C']]);
      }, p5.ValidationError);
      assert.strictEqual(
        err.type,
        'WRONG_TYPE',
        'ValidationError type is correct'
      );
    });

    testUnMinified('rect: null, non-trailing, optional parameter', function() {
      let err = assert.throws(function() {
        p5._validateParameters('rect', [0, 0, 0, 0, null, 0, 0, 0]);
      }, p5.ValidationError);
      assert.strictEqual(
        err.type,
        'EMPTY_VAR',
        'ValidationError type is correct'
      );
    });

    testUnMinified('color: too many args + wrong types too', function() {
      let err = assert.throws(function() {
        p5._validateParameters('color', ['A', 'A', 0, 0, 0, 0, 0, 0, 0, 0]);
      }, p5.ValidationError);
      assert.strictEqual(
        err.type,
        'TOO_MANY_ARGUMENTS',
        'ValidationError type is correct'
      );
    });
  });

  suite('validateParameters: trailing undefined arguments', function() {
    // see https://github.com/processing/p5.js/issues/4571 for details

    test('color: missing params #1 #2', function() {
      // even though color can also be called with one argument, if 3 args
      // are passed, it is likely that them being undefined is an accident
      assert.validationError(function() {
        p5._validateParameters('color', [12, undefined, undefined]);
      });
    });

    test('random: missing params #0 #1 (both optional)', function() {
      // even though the undefined params are optional, since they are passed
      // to the function, it is more likely that the user wanted to call the
      // function with 2 arguments.
      assert.validationError(function() {
        p5._validateParameters('random', [undefined, undefined]);
      });
    });

    // compuslory argument trailing undefined
    testUnMinified('circle: missing compulsory param #2', function() {
      // should throw an EMPTY_VAR error instead of a TOO_FEW_ARGUMENTS error
      let err = assert.throws(function() {
        p5._validateParameters('circle', [5, 5, undefined]);
      }, p5.ValidationError);
      assert.strictEqual(
        err.type,
        'EMPTY_VAR',
        'ValidationError type is correct'
      );
    });
  });

  suite('validateParameters: argument tree', function() {
    // should not throw a validation error for the same kind of wrong args
    // more than once. This prevents repetetive validation logs for a
    // function that is called in a loop or draw()
    testUnMinified(
      'no repeated validation error for the same wrong arguments',
      function() {
        assert.validationError(function() {
          myp5.color();
        });

        assert.doesNotThrow(
          function() {
            myp5.color(); // Same type of wrong arguments as above
          },
          p5.ValidationError,
          'got unwanted ValidationError'
        );
      }
    );

    testUnMinified(
      'should throw validation errors for different wrong args',
      function() {
        assert.validationError(function() {
          myp5.color();
        });

        assert.validationError(function() {
          myp5.color(false);
        });
      }
    );

    testUnMinified('arg tree is built properly', function() {
      let myArgTree = p5._getValidateParamsArgTree();
      myp5.random();
      myp5.random(50);
      myp5.random([50, 70, 10]);
      assert.strictEqual(
        myArgTree.random.seen,
        true,
        'tree built correctly for random()'
      );
      assert.strictEqual(
        myArgTree.random.number.seen,
        true,
        'tree built correctly for random(min: Number)'
      );
      assert.strictEqual(
        myArgTree.random.as.number.number.number.seen,
        true,
        'tree built correctly for random(choices: Array)'
      );

      let c = myp5.color(10);
      myp5.alpha(c);
      assert.strictEqual(
        myArgTree.color.number.seen,
        true,
        'tree built correctly for color(gray: Number)'
      );
      assert.strictEqual(
        myArgTree.alpha.Color.seen,
        true,
        'tree built correctly for alpha(color: p5.Color)'
      );
    });
  });

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
