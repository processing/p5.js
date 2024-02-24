import p5 from '../../../src/app.js';
import setupMath from '../../../src/math';
import { testUnMinified, createP5Iframe, P5_SCRIPT_TAG } from '../../js/p5_helpers.js';
import '../../js/chai_helpers.js';

setupMath(p5);

const setup = beforeEach;
const teardown = afterEach;

suite('Error Helpers', function() {
  var myp5;

  beforeEach(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        p5._clearValidateParamsCache();
      };
    });
  });

  afterEach(function() {
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

    testUnMinified('line: null string given', function() {
      let err = assert.throws(function() {
        p5._validateParameters('line', [1, 2, 4, 'null']);
      }, p5.ValidationError);
      assert.strictEqual(
        err.type,
        'WRONG_TYPE',
        'ValidationError type is correct'
      );
    });

    testUnMinified('line: NaN value given', function() {
      let err = assert.throws(function() {
        p5._validateParameters('line', [1, 2, 4, NaN]);
      }, p5.ValidationError);
      assert.strictEqual(
        err.type,
        'WRONG_TYPE',
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

  suite('validateParameters: union types', function() {
    testUnMinified('set() with Number', function() {
      assert.doesNotThrow(function() {
        p5._validateParameters('set', [0, 0, 0]);
      });
    });
    testUnMinified('set() with Number[]', function() {
      assert.doesNotThrow(function() {
        p5._validateParameters('set', [0, 0, [0, 0, 0, 255]]);
      });
    });
    testUnMinified('set() with Object', function() {
      assert.doesNotThrow(function() {
        p5._validateParameters('set', [0, 0, myp5.color(0)]);
      });
    });
    testUnMinified('set() with Boolean', function() {
      assert.validationError(function() {
        p5._validateParameters('set', [0, 0, true]);
      });
    });
  });

  suite('validateParameters: specific constants', function() {
    testUnMinified('endShape() with no args', function() {
      assert.doesNotThrow(function() {
        p5._validateParameters('endShape', []);
      });
    });
    testUnMinified('endShape() with CLOSE', function() {
      assert.doesNotThrow(function() {
        p5._validateParameters('endShape', [myp5.CLOSE]);
      });
    });
    testUnMinified('endShape() with unrelated constant', function() {
      assert.validationError(function() {
        p5._validateParameters('endShape', [myp5.RADIANS]);
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
          const iframe = createP5Iframe(
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

  const prepSyntaxTest = (arr, resolve) => {
    const iframe = createP5Iframe(
      [P5_SCRIPT_TAG, WAIT_AND_RESOLVE, '<script>', ...arr, '</script>'].join(
        '\n'
      )
    );
    log = [];
    iframe.elt.contentWindow.logger = logger;
    iframe.elt.contentWindow.afterSetup = resolve;
    return iframe;
  };

  testUnMinified('identifies errors happenning internally', function() {
    return new Promise(function(resolve) {
      // quite an unusual way to test, but the error listener doesn't work
      // under mocha. Also the stacktrace gets filled with mocha internal
      // function calls. Using this method solves both of these problems.
      // This method also allows us to test for SyntaxError without messing
      // with flow of the other tests
      prepSyntaxTest(
        [
          'function setup() {',
          'let cnv = createCanvas(400, 400);',
          'cnv.mouseClicked();', // Error in p5 library as no callback passed
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /inside the p5js library/);
      assert.match(log[0], /mouseClicked/);
    });
  });

  testUnMinified(
    'identifies errors happenning internally in ES6 classes',
    function() {
      return new Promise(function(resolve) {
        prepSyntaxTest(
          [
            'function setup() {',
            'let cnv = createCanvas(10, 10, WEBGL);',
            'let fbo = createFramebuffer();',
            'fbo.draw();', // Error in p5 library as no callback passed
            '}'
          ],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /inside the p5js library/);
        assert.match(log[0], /draw/);
      });
    }
  );

  testUnMinified('identifies errors in preload', function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function preload() {',
          'circle(5, 5, 2);', // error
          '}',
          'function setup() {',
          'createCanvas(10, 10);',
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /"circle" being called from preload/);
    });
  });

  testUnMinified("identifies TypeError 'notDefined'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'let x = asdfg + 5;', // ReferenceError: asdfg is not defined
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /asdfg/);
      assert.match(log[0], /not defined in the current scope/);
    });
  });

  testUnMinified(
    "identifies SyntaxError 'Invalid or unexpected Token'",
    function() {
      return new Promise(function(resolve) {
        prepSyntaxTest(
          [
            'function setup() {',
            'let x = “not a string”', // SyntaxError: Invalid or unexpected token
            '}'
          ],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /Syntax Error/);
        assert.match(log[0], /JavaScript doesn't recognize/);
      });
    }
  );

  testUnMinified("identifies SyntaxError 'unexpectedToken'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'for (let i = 0; i < 5,; ++i) {}', // SyntaxError: Unexpected token
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Syntax Error/);
      assert.match(log[0], /typo/);
    });
  });

  testUnMinified("identifies TypeError 'notFunc'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'let asdfg = 5',
          'asdfg()', // TypeError: asdfg is not a function
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /"asdfg" could not be called as a function/);
    });
  });

  testUnMinified("identifies TypeError 'notFuncObj'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'let asdfg = {}',
          'asdfg.abcd()', // TypeError: abcd is not a function
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /"abcd" could not be called as a function/);
      assert.match(log[0], /"asdfg" has "abcd" in it/);
    });
  });

  testUnMinified("identifies ReferenceError 'cannotAccess'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'console.log(x)', // ReferenceError: Cannot access 'x' before initialization
          'let x = 100',
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Error/);
      assert.match(log[0], /used before declaration/);
    });
  });

  testUnMinified("identifies SyntaxError 'badReturnOrYield'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        ['function setup() {', 'let x = 100;', '}', 'return;'],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Syntax Error/);
      assert.match(log[0], /lies outside of a function/);
    });
  });

  testUnMinified("identifies SyntaxError 'missingInitializer'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'const x;', //SyntaxError: Missing initializer in const declaration
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Syntax Error/);
      assert.match(log[0], /but not initialized/);
    });
  });

  testUnMinified("identifies SyntaxError 'redeclaredVariable'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'let x=100;',
          'let x=99;', //SyntaxError: Identifier 'x' has already been declared
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Syntax Error/);
      assert.match(log[0], /JavaScript doesn't allow/);
    });
  });

  testUnMinified("identifies TypeError 'constAssign'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'const x = 100;',
          'x = 10;', //TypeError: Assignment to constant variable
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Error/);
      assert.match(log[0], /const variable is being/);
    });
  });

  testUnMinified("identifies TypeError 'readFromNull'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'const x = null;',
          'console.log(x.prop);', //TypeError: Cannot read property 'prop' of null
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Error/);
      assert.match(log[0], /property of null/);
    });
  });

  testUnMinified("identifies TypeError 'readFromUndefined'", function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function setup() {',
          'const x = undefined;',
          'console.log(x.prop);', //TypeError: Cannot read property 'prop' of undefined
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /Error/);
      assert.match(log[0], /property of undefined/);
    });
  });

  testUnMinified('builds friendlyStack', function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function myfun(){',
          'asdfg()', // ReferenceError
          '}',
          'function setup() {',
          'myfun()',
          '}'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 2);
      let temp = log[1].split('\n');
      temp = temp.filter(e => e.trim().length > 0);
      assert.strictEqual(temp.length, 4);
      assert.match(log[0], /"asdfg" is not defined/);
      assert.match(temp[1], /Error at/);
      assert.match(temp[1], /myfun/);
      assert.match(temp[3], /Called from/);
      assert.match(temp[3], /setup/);
    });
  });

  testUnMinified('indentifies internal error - instance mode', function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function sketch(p) {',
          '  p.setup = function() {',
          '    p.stroke();', // error
          '  }',
          '}',
          'new p5(sketch);'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /stroke/);
      assert.match(log[0], /inside the p5js library/);
    });
  });

  testUnMinified('indentifies error in preload - instance mode', function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function sketch(p) {',
          '  p.preload = function() {',
          '    p.circle(2, 2, 2);', // error
          '  }',
          '  p.setup = function() {',
          '    p.createCanvas(5, 5);',
          '  }',
          '}',
          'new p5(sketch);'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /"circle" being called from preload/);
    });
  });

  testUnMinified('indentifies error in user code - instance mode', function() {
    return new Promise(function(resolve) {
      prepSyntaxTest(
        [
          'function sketch(p) {',
          '  p.setup = function() {',
          '    myfun();', // ReferenceError: myfun is not defined
          '  }',
          '}',
          'new p5(sketch);'
        ],
        resolve
      );
    }).then(function() {
      assert.strictEqual(log.length, 1);
      assert.match(log[0], /myfun/);
      assert.match(log[0], /is not defined in the current scope/);
    });
  });
});

suite('Tests for p5.js sketch_reader', function() {
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

  let log;
  const logger = function(err) {
    log.push(err);
  };

  const prepSketchReaderTest = (arr, resolve) => {
    const iframe = createP5Iframe(
      [P5_SCRIPT_TAG, WAIT_AND_RESOLVE, '<script>', ...arr, '</script>'].join(
        '\n'
      )
    );
    log = [];
    iframe.elt.contentWindow.logger = logger;
    iframe.elt.contentWindow.afterSetup = resolve;
    return iframe;
  };

  testUnMinified(
    'detects reassignment of p5.js constant inside setup',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['function setup() {', 'let PI = 100', '}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved variable/);
      });
    }
  );

  testUnMinified(
    'detects reassignment of p5.js function inside setup',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['function setup() {', 'let text = 100', '}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved function/);
      });
    }
  );

  testUnMinified(
    'detects reassignment of p5.js constant outside setup',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(['let PI = 100', 'function setup() {}'], resolve);
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved variable/);
      });
    }
  );

  testUnMinified(
    'detects reassignment of p5.js function (text) outside setup',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['let text = 100', 'function setup() {}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved function/);
      });
    }
  );

  testUnMinified(
    'detects reassignment of p5.js function (textSize from Typography) outside setup',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['let textSize = 100', 'function setup() {}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved function/);
      });
    }
  );

  testUnMinified(
    'does not detect reassignment of p5.js function (size from TypedDict or Dom) outside setup',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['let size = 100', 'function setup() {}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 0);
      });
    }
  );

  testUnMinified(
    'detects reassignment of p5.js function (point from shape) outside setup',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['let point = 100', 'function setup() {}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved function/);
      });
    }
  );

  testUnMinified(
    'detects reassignment of p5.js functions in declaration lists',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['function setup() {', 'let x = 2, text = 2;', '}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved function/);
      });
    }
  );

  testUnMinified(
    'detects reassignment of p5.js functions in declaration lists after function calls',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          [
            'function setup() {',
            'let x = constrain(frameCount, 0, 1000), text = 2;',
            '}'
          ],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 1);
        assert.match(log[0], /you have used a p5.js reserved function/);
      });
    }
  );

  testUnMinified(
    'ignores p5.js functions used in the right hand side of assignment expressions',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          // This will still log an error, as `text` isn't being used correctly
          // here, but the important part is that it doesn't say that we're
          // trying to reassign a reserved function.
          ['function draw() {', 'let x = constrain(100, 0, text);', '}'],
          resolve
        );
      }).then(function() {
        assert.ok(
          !log.some(line =>
            line.match(/you have used a p5.js reserved function/)
          )
        );
      });
    }
  );

  testUnMinified(
    'ignores p5.js function names used as function arguments',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          ['function draw() {', 'let myLog = (text) => print(text);', '}'],
          resolve
        );
      }).then(function() {
        assert.strictEqual(log.length, 0);
      });
    }
  );

  testUnMinified(
    'fails gracefully on inputs too complicated to parse',
    function() {
      return new Promise(function(resolve) {
        prepSketchReaderTest(
          // This technically is redefining text, but it should stop parsing
          // after the double nested brackets rather than try and possibly
          // give a false positive error. This particular assignment will get
          // caught at runtime regardless by
          // `_createFriendlyGlobalFunctionBinder`.
          [
            'function draw() {',
            'let x = constrain(millis(), 0, text = 100)',
            '}'
          ],
          resolve
        );
      }).then(function() {
        console.log(log);
        assert.strictEqual(log.length, 0);
      });
    }
  );
});
