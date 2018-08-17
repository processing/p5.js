suite('Core', function() {
  var node;

  setup(function() {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  teardown(function() {
    document.body.removeChild(node);
  });

  suite('new p5(sketch, null, true)', function() {
    // The reason why these tests run inside the suite() { ... } block is
    // because they test code that checks document.readyState.  If we waited
    // to run the test in test() { ... } the page would already be loaded and
    // readyState would be "completed".  By doing the tests things this way
    // readyState is "loading" and we can verify that the code is doing the
    // right thing during page load.

    var myp5 = new p5(function() {}, null, true);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext synchronously', function() {
      assert.ok(isDrawingContextDefined);
    });
  });

  suite('new p5(sketch, null, false)', function() {
    var myp5 = new p5(function() {}, null, false);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext asynchronously', function() {
      assert.equal(isDrawingContextDefined, false);
      assert.isDefined(myp5.drawingContext);
    });
  });

  suite('new p5(sketch, node, true)', function() {
    var myp5 = new p5(function() {}, node, true);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext synchronously', function() {
      assert.ok(isDrawingContextDefined);
    });
  });

  suite('new p5(sketch, node)', function() {
    var myp5 = new p5(function() {}, node);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext asynchronously', function() {
      assert.equal(isDrawingContextDefined, false);
      assert.isDefined(myp5.drawingContext);
    });
  });

  suite('new p5(sketch, true)', function() {
    var myp5 = new p5(function() {}, true);
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext synchronously', function() {
      assert.ok(isDrawingContextDefined);
    });
  });

  suite('new p5(sketch)', function() {
    var myp5 = new p5(function() {});
    var isDrawingContextDefined = myp5.drawingContext !== undefined;

    test('should define drawContext asynchronously', function() {
      assert.equal(isDrawingContextDefined, false);
      assert.isDefined(myp5.drawingContext);
    });
  });

  suite('p5.prototype', function() {
    //var prototype = p5;
    //var result;
    /*suite('abs()', function() {
      test('should be a function', function() {
        assert.ok(abs);
        assert.typeOf(abs, 'function');
      });
      test('should return a number', function() {
        result = abs();
        assert.typeOf(result, 'number');
      });
      test('should return an absolute value', function() {
        result = abs(-1);
        assert.equal(result, 1);
        assert.notEqual(result, -1);
      });
    });*/
  });

  suite('p5.prototype.registerMethod', function() {
    test('should register and call "init" methods', function() {
      var originalInit = p5.prototype._registeredMethods.init;
      var myp5, myInitCalled;

      p5.prototype._registeredMethods.init = [];

      try {
        p5.prototype.registerMethod('init', function myInit() {
          assert(
            !myInitCalled,
            'myInit should only be called once during test suite'
          );
          myInitCalled = true;

          this.myInitCalled = true;
        });

        myp5 = new p5(function(sketch) {
          assert(sketch.hasOwnProperty('myInitCalled'));
          assert(sketch.myInitCalled);

          sketch.sketchFunctionCalled = true;
        });

        assert(myp5.sketchFunctionCalled);
      } finally {
        p5.prototype._registeredMethods.init = originalInit;
      }
    });
  });

  suite('new p5() / global mode', function() {
    var iframe;

    teardown(function() {
      if (iframe) {
        iframe.teardown();
        iframe = null;
      }
    });

    test('is triggered when "setup" is in window', function() {
      return new Promise(function(resolve, reject) {
        iframe = createP5Iframe();
        iframe.elt.contentWindow.setup = function() {
          resolve();
        };
      });
    });

    test('is triggered when "draw" is in window', function() {
      return new Promise(function(resolve, reject) {
        iframe = createP5Iframe();
        iframe.elt.contentWindow.draw = function() {
          resolve();
        };
      });
    });

    test('works when p5.js is loaded asynchronously', function() {
      return new Promise(function(resolve, reject) {
        iframe = createP5Iframe(`
          <script>
            window.onload = function() {
              var script = document.createElement('script');
              script.setAttribute('src', '${P5_SCRIPT_URL}');

              document.body.appendChild(script);
            }
          </script>`);

        iframe.elt.contentWindow.setup = resolve;
      });
    });

    test('works on-demand', function() {
      return new Promise(function(resolve, reject) {
        iframe = createP5Iframe(
          [
            P5_SCRIPT_TAG,
            '<script>',
            'new p5();',
            'originalP5Instance = p5.instance',
            'myURL = p5.prototype.getURL();',
            'function setup() { setupCalled = true; }',
            'window.addEventListener("load", onDoneLoading, false);',
            '</script>'
          ].join('\n')
        );
        iframe.elt.contentWindow.onDoneLoading = resolve;
      }).then(function() {
        var win = iframe.elt.contentWindow;
        assert.equal(typeof win.myURL, 'string');
        assert.strictEqual(win.setupCalled, true);
        assert.strictEqual(win.originalP5Instance, win.p5.instance);
      });
    });
  });

  suite('p5.prototype._createFriendlyGlobalFunctionBinder', function() {
    var noop = function() {};
    var createBinder = p5.prototype._createFriendlyGlobalFunctionBinder;
    var logMsg, globalObject, bind, iframe;

    teardown(function() {
      if (iframe) {
        iframe.teardown();
        iframe = null;
      }
    });

    setup(function() {
      globalObject = {};
      logMsg = undefined;
      bind = createBinder({
        globalObject: globalObject,
        log: function(msg) {
          if (logMsg !== undefined) {
            // For simplicity, we'll write each test so it's expected to
            // log a message at most once.
            throw new Error('log() was called more than once');
          }
          logMsg = msg;
        }
      });
    });

    if (!window.IS_TESTING_MINIFIED_VERSION) {
      test('should warn when globals already exist', function() {
        globalObject.text = 'hi';
        bind('text', noop);
        assert.match(logMsg, /p5 had problems creating .+ "text"/);
        assert.equal(globalObject.text, noop);
      });

      test('should warn when globals are overwritten', function() {
        bind('text', noop);
        globalObject.text = 'boop';

        assert.match(logMsg, /You just changed the value of "text"/);
        assert.equal(globalObject.text, 'boop');
        assert.deepEqual(Object.keys(globalObject), ['text']);
      });
    } else {
      test('should NOT warn when globals already exist', function() {
        globalObject.text = 'hi';
        bind('text', noop);
        assert.isUndefined(logMsg);
        assert.equal(globalObject.text, noop);
      });

      test('should NOT warn when globals are overwritten', function() {
        bind('text', noop);
        globalObject.text = 'boop';

        assert.isUndefined(logMsg);
        assert.equal(globalObject.text, 'boop');
        assert.deepEqual(Object.keys(globalObject), ['text']);
      });
    }

    test('should allow overwritten globals to be overwritten', function() {
      bind('text', noop);
      globalObject.text = 'boop';
      globalObject.text += 'blap';
      assert.equal(globalObject.text, 'boopblap');
    });

    test('should allow globals to be deleted', function() {
      bind('text', noop);
      delete globalObject.text;
      assert.isUndefined(globalObject.text);
      assert.isUndefined(logMsg);
    });

    test('should create enumerable globals', function() {
      bind('text', noop);
      assert.deepEqual(Object.keys(globalObject), ['text']);
    });

    test('should not warn about overwriting print()', function() {
      globalObject.print = window.print;
      bind('print', noop);
      assert.equal(globalObject.print, noop);
      assert.isUndefined(logMsg);
    });

    // This is a regression test for
    // https://github.com/processing/p5.js/issues/1350.
    test('should not warn about overwriting preload methods', function() {
      globalObject.loadJSON = function() {
        throw new Error();
      };
      bind('loadJSON', noop);
      assert.equal(globalObject.loadJSON, noop);
      assert.isUndefined(logMsg);
    });

    test('should not warn about overwriting non-functions', function() {
      bind('mouseX', 5);
      globalObject.mouseX = 50;
      assert.equal(globalObject.mouseX, 50);
      assert.isUndefined(logMsg);
    });

    test('instance preload is independent of window', function() {
      // callback for p5 instance mode.
      // It does not define a preload.
      // This tests that we don't call the global preload accidentally.
      function cb(s) {
        s.setup = function() {
          window.afterSetup();
        };
      }
      return new Promise(function(resolve) {
        iframe = createP5Iframe(
          [
            P5_SCRIPT_TAG,
            '<script>',
            'globalPreloads = 0;',
            'function setup() { }',
            'function preload() { window.globalPreloads++; }',
            'new p5(' + cb.toString() + ');',
            '</script>'
          ].join('\n')
        );
        iframe.elt.contentWindow.afterSetup = resolve;
      }).then(function() {
        var win = iframe.elt.contentWindow;
        assert.strictEqual(win.globalPreloads, 1);
      });
    });
  });
});
