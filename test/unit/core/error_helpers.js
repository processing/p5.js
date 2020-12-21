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

  suite('misspelling detection', function() {
    let log = [];
    const logger = function(err) {
      log.push(err);
    };
    let help = function(err) {
      p5._fesErrorMonitor(err);
      assert.equal(log.length, 1);
      return log[0];
    };

    setup(function() {
      log = [];
      p5._fesLogger = logger;
    });

    teardown(function() {
      p5._fesLogger = null;
    });

    testUnMinified('detects capitalization mistakes', function() {
      const logMsg = help(new ReferenceError('MouseX is not defined'));
      assert.match(
        logMsg,
        /It seems that you may have accidentally written "MouseX"/
      );
      assert.match(logMsg, /mouseX/);
    });

    testUnMinified('detects spelling mistakes', function() {
      const logMsg = help(new ReferenceError('colour is not defined'));
      assert.match(
        logMsg,
        /It seems that you may have accidentally written "colour"/
      );
      assert.match(logMsg, /color/);
    });

    testUnMinified(
      'can give more than one closest matches, if applicable',
      function() {
        const logMsg = help(new ReferenceError('strok is not defined'));
        assert.match(
          logMsg,
          /It seems that you may have accidentally written "strok"/
        );
        assert.match(logMsg, /stroke/);
        assert.match(logMsg, /STROKE/);
      }
    );

    testUnMinified('detects spelling + captialization mistakes', function() {
      const logMsg = help(new ReferenceError('RandomGossian is not defined'));
      assert.match(
        logMsg,
        /It seems that you may have accidentally written "RandomGossian"/
      );
      assert.match(logMsg, /randomGaussian/);
    });
  });

  suite('caps mistakes for user-defined functions (instance mode)', function() {
    let myp5;
    let log;
    const logger = function(err) {
      log.push(err);
    };
    setup(function(done) {
      log = [];
      p5._fesLogger = logger;
      new p5(function(p) {
        // intentional capitalization mistake
        p.preLoad = function() {};
        p.setup = function() {
          myp5 = p;
          p._fesLogger = logger;
          done();
        };
      });
    });

    teardown(function() {
      p5._fesLogger = null;
      myp5.remove();
    });

    testUnMinified(
      'detects capitatilization mistake in instance mode',
      function() {
        assert.strictEqual(log.length, 1, 'One message is displayed');
        assert.match(
          log[0],
          /It seems that you may have accidentally written preLoad instead of preload/
        );
      }
    );
  });

  suite('caps mistakes for user-defined functions (global mode)', function() {
    let log;
    const logger = function(err) {
      log.push(err);
    };
    testUnMinified(
      'detects capitatilization mistake in global mode',
      function() {
        return new Promise(function(resolve) {
          iframe = createP5Iframe(
            [
              P5_SCRIPT_TAG,
              '<script>',
              'p5._fesLogger = window.logger',
              'function setup() { window.afterSetup();}',
              'function DRAW() {}',
              '</script>'
            ].join('\n')
          );
          log = [];
          iframe.elt.contentWindow.logger = logger;
          iframe.elt.contentWindow.afterSetup = resolve;
        }).then(function() {
          //let log = iframe.elt.contentWindow.log;
          assert.strictEqual(log.length, 1);
          assert.match(
            log[0],
            /It seems that you may have accidentally written DRAW instead of draw/
          );
        });
      }
    );
  });
});

// seperating in another suite because these don't need to initialize myp5
// for each test. Instead they initialize p5 in the iframe. These tests are
// also slower than the above ones.
suite('Global Error Handling', function() {
  let log;
  const WAIT_AND_RESOLVE = [
    '<script>',
    'p5._fesLogger = window.logger',
    'let flag = false;',
    'setInterval(() => {',
    // just because the log has one element doesn't necessarily mean that the
    // handler has finished its job. The flag allows it to take some more time
    // after adding the first log message
    '  if (window.logger.length > 0) {',
    '    if (flag) window.afterSetup();',
    '    flag = true;',
    '  }',
    '}, 50);',
    '</script>'
  ].join('\n');
  const logger = function(err) {
    log.push(err);
  };
  setup(function() {
    log = [];
    p5._fesLogger = logger;
  });

  teardown(function() {
    p5._fesLogger = null;
  });

  testUnMinified(
    'correctly identifies errors happenning internally',
    function() {
      return new Promise(function(resolve) {
        // quite an unusual way to test, but the error listerner doesn't work
        // under mocha. Also the stacktrace gets filled with mocha internal
        // function calls. Using this method solves both of these problems.
        // This method also allows us to test for SyntaxError without messing
        // with flow of the other tests
        iframe = createP5Iframe(
          [
            P5_SCRIPT_TAG,
            WAIT_AND_RESOLVE,
            '<script>',
            'function setup() {',
            'let cnv = createCanvas(400, 400);',
            'cnv.mouseClicked();', // Error in p5 library as no callback passed
            '}',
            '</script>'
          ].join('\n')
        );
        log = [];
        iframe.elt.contentWindow.logger = logger;
        iframe.elt.contentWindow.afterSetup = resolve;
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /inside the p5js library/);
        assert.match(log[0], /mouseClicked/);
      });
    }
  );

  testUnMinified('correctly identifies errors in preload', function() {
    return new Promise(function(resolve) {
      iframe = createP5Iframe(
        [
          P5_SCRIPT_TAG,
          WAIT_AND_RESOLVE,
          '<script>',
          'function preload() {',
          'circle(5, 5, 2);', // error
          '}',
          'function setup() {',
          'createCanvas(10, 10);',
          '}',
          '</script>'
        ].join('\n')
      );
      log = [];
      iframe.elt.contentWindow.logger = logger;
      iframe.elt.contentWindow.afterSetup = resolve;
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /"circle" being called from preload/);
    });
  });

  testUnMinified('correctly identifies errors in user code I', function() {
    return new Promise(function(resolve) {
      iframe = createP5Iframe(
        [
          P5_SCRIPT_TAG,
          WAIT_AND_RESOLVE,
          '<script>',
          'function setup() {',
          'let x = asdfg + 5;', // ReferenceError: asdfg is not defined
          '}',
          '</script>'
        ].join('\n')
      );
      log = [];
      iframe.elt.contentWindow.logger = logger;
      iframe.elt.contentWindow.afterSetup = resolve;
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /asdfg/);
      assert.match(log[0], /not being defined in the current scope/);
    });
  });

  testUnMinified('correctly identifies errors in user code II', function() {
    return new Promise(function(resolve) {
      iframe = createP5Iframe(
        [
          P5_SCRIPT_TAG,
          WAIT_AND_RESOLVE,
          '<script>',
          'function setup() {',
          'let x = “not a string”', // SyntaxError: Invalid or unexpected token
          '}',
          '</script>'
        ].join('\n')
      );
      log = [];
      iframe.elt.contentWindow.logger = logger;
      iframe.elt.contentWindow.afterSetup = resolve;
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /syntax error/);
      assert.match(log[0], /JavaScript doesn't recognize/);
    });
  });

  testUnMinified('correctly identifies errors in user code III', function() {
    return new Promise(function(resolve) {
      iframe = createP5Iframe(
        [
          P5_SCRIPT_TAG,
          WAIT_AND_RESOLVE,
          '<script>',
          'function setup() {',
          'for (let i = 0; i < 5,; ++i) {}', // SyntaxError: Unexpected token
          '}',
          '</script>'
        ].join('\n')
      );
      log = [];
      iframe.elt.contentWindow.logger = logger;
      iframe.elt.contentWindow.afterSetup = resolve;
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /syntax error/);
      assert.match(log[0], /typo/);
    });
  });

  testUnMinified('correctly identifies errors in user code IV', function() {
    return new Promise(function(resolve) {
      iframe = createP5Iframe(
        [
          P5_SCRIPT_TAG,
          WAIT_AND_RESOLVE,
          '<script>',
          'function setup() {',
          'let asdfg = 5',
          'asdfg()', // TypeError: asdfg is not a function
          '}',
          '</script>'
        ].join('\n')
      );
      log = [];
      iframe.elt.contentWindow.logger = logger;
      iframe.elt.contentWindow.afterSetup = resolve;
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /"asdfg" could not be called as a function/);
    });
  });

  testUnMinified('correctly identifies errors in user code IV', function() {
    return new Promise(function(resolve) {
      iframe = createP5Iframe(
        [
          P5_SCRIPT_TAG,
          WAIT_AND_RESOLVE,
          '<script>',
          'function setup() {',
          'let asdfg = {}',
          'asdfg.abcd()', // TypeError: abcd is not a function
          '}',
          '</script>'
        ].join('\n')
      );
      log = [];
      iframe.elt.contentWindow.logger = logger;
      iframe.elt.contentWindow.afterSetup = resolve;
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /"abcd" could not be called as a function/);
      assert.match(log[0], /"asdfg" has "abcd" in it/);
    });
  });

  testUnMinified('correctly builds friendlyStack', function() {
    return new Promise(function(resolve) {
      iframe = createP5Iframe(
        [
          P5_SCRIPT_TAG,
          WAIT_AND_RESOLVE,
          '<script>',
          'function myfun(){',
          'asdfg()', // ReferenceError
          '}',
          'function setup() {',
          'myfun()',
          '}',
          '</script>'
        ].join('\n')
      );
      log = [];
      iframe.elt.contentWindow.logger = logger;
      iframe.elt.contentWindow.afterSetup = resolve;
    }).then(function() {
      assert.strictEqual(log.length, 2);
      let temp = log[1].split('\n');
      temp = temp.filter(e => e.trim().length > 0);
      assert.strictEqual(temp.length, 2);
      assert.match(log[0], /"asdfg" not being defined/);
      assert.match(temp[0], /Error at/);
      assert.match(temp[0], /myfun/);
      assert.match(temp[1], /Called from/);
      assert.match(temp[1], /setup/);
    });
  });

  testUnMinified(
    'correctly indentifies internal error - instance mode',
    function() {
      return new Promise(function(resolve) {
        iframe = createP5Iframe(
          [
            P5_SCRIPT_TAG,
            WAIT_AND_RESOLVE,
            '<script>',
            'function sketch(p) {',
            '  p.setup = function() {',
            '    p.stroke();', // error
            '  }',
            '}',
            'new p5(sketch);',
            '</script>'
          ].join('\n')
        );
        log = [];
        iframe.elt.contentWindow.logger = logger;
        iframe.elt.contentWindow.afterSetup = resolve;
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /stroke/);
        assert.match(log[0], /inside the p5js library/);
      });
    }
  );

  testUnMinified(
    'correctly indentifies error in preload - instance mode',
    function() {
      return new Promise(function(resolve) {
        iframe = createP5Iframe(
          [
            P5_SCRIPT_TAG,
            WAIT_AND_RESOLVE,
            '<script>',
            'function sketch(p) {',
            '  p.preload = function() {',
            '    p.circle(2, 2, 2);', // error
            '  }',
            '  p.setup = function() {',
            '    p.createCanvas(5, 5);',
            '  }',
            '}',
            'new p5(sketch);',
            '</script>'
          ].join('\n')
        );
        log = [];
        iframe.elt.contentWindow.logger = logger;
        iframe.elt.contentWindow.afterSetup = resolve;
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /"circle" being called from preload/);
      });
    }
  );

  testUnMinified(
    'correctly indentifies error in user code - instance mode',
    function() {
      return new Promise(function(resolve) {
        iframe = createP5Iframe(
          [
            P5_SCRIPT_TAG,
            WAIT_AND_RESOLVE,
            '<script>',
            'function sketch(p) {',
            '  p.setup = function() {',
            '    myfun();', // ReferenceError: myfun is not defined
            '  }',
            '}',
            'new p5(sketch);',
            '</script>'
          ].join('\n')
        );
        log = [];
        iframe.elt.contentWindow.logger = logger;
        iframe.elt.contentWindow.afterSetup = resolve;
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /myfun/);
        assert.match(log[0], /not being defined in the current scope/);
      });
    }
  );
});
