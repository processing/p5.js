const { expect, assert } = require('chai');

suite('Core', function () {
  suite('p5.prototype.registerMethod', function () {
    teardown(function() {
      p5.prototype._registeredMethods.init = [];
      p5.prototype._registeredMethods.beforePreload = [];
      p5.prototype._registeredMethods.preload = [];
      p5.prototype._registeredMethods.afterPreload = [];
      p5.prototype._registeredMethods.beforeSetup = [];
      p5.prototype._registeredMethods.setup = [];
      p5.prototype._registeredMethods.afterSetup = [];
      p5.prototype._registeredMethods.pre = [];
      p5.prototype._registeredMethods.draw = [];
      p5.prototype._registeredMethods.post = [];
    });
    test('should register and call "init" methods', function () {
      var myp5, myInitCalled;
      p5.prototype.registerMethod('init', function myInit() {
        assert(
          !myInitCalled,
          'myInit should only be called once during test suite'
        );
        myInitCalled = true;

        this.myInitCalled = true;
      });

      myp5 = new p5(function (sketch) {
        assert(sketch.hasOwnProperty('myInitCalled'));
        assert(sketch.myInitCalled);

        sketch.sketchFunctionCalled = true;
      });

      assert(myp5.sketchFunctionCalled);
    });
    test('should register and call before and after "preload" hooks', function () {
      return new Promise(resolve => {
        let beforePreloadCalled = false;
        let preloadCalled = false;
        let afterPreloadCalled = false;

        p5.prototype.registerMethod('beforePreload', () => {
          beforePreloadCalled = true;
        });

        p5.prototype.registerMethod('preload', () => {
          assert.equal(beforePreloadCalled, true);
          preloadCalled = true;
        });

        p5.prototype.registerMethod('afterPreload', () => {
          if (beforePreloadCalled && preloadCalled) afterPreloadCalled = true;
        });

        myp5 = new p5(function (sketch) {
          sketch.preload = () => {};
          sketch.setup = () => {
            assert.equal(afterPreloadCalled, true);
            resolve();
          };
        });
      });
    });
    test('should register and call before and after "setup" hooks', function () {
      return new Promise(resolve => {
        let beforeSetupCalled = false;
        let setupCalled = false;
        let afterSetupCalled = false;

        p5.prototype.registerMethod('beforeSetup', () => {
          beforeSetupCalled = true;
        });

        p5.prototype.registerMethod('setup', () => {
          assert.equal(beforeSetupCalled, true);
          setupCalled = true;
        });

        p5.prototype.registerMethod('afterSetup', () => {
          if (beforeSetupCalled && setupCalled) afterSetupCalled = true;
        });

        myp5 = new p5(function (sketch) {
          sketch.setup = () => {};
          sketch.draw = () => {
            assert.equal(afterSetupCalled, true);
            resolve();
          };
        });
      });
    });
    test('should register and call pre and post "draw" hooks', function () {
      return new Promise(resolve => {
        let preDrawCalled = false;
        let drawCalled = false;
        let postDrawCalled = false;

        p5.prototype.registerMethod('pre', () => {
          preDrawCalled = true;
        });

        p5.prototype.registerMethod('draw', () => {
          assert.equal(preDrawCalled, true);
          drawCalled = true;
        });

        p5.prototype.registerMethod('post', () => {
          if (preDrawCalled && drawCalled) postDrawCalled = true;
        });

        myp5 = new p5(function (sketch) {
          sketch.draw = () => {
            if (sketch.frameCount === 2) {
              assert.equal(postDrawCalled, true);
              resolve();
            }
          };
        });
      });
    });
  });

  suite('new p5() / global mode', function () {
    var iframe;

    teardown(function () {
      if (iframe) {
        iframe.teardown();
        iframe = null;
      }
    });

    test('is triggered when "setup" is in window', function () {
      return new Promise(function (resolve, reject) {
        iframe = createP5Iframe();
        iframe.elt.contentWindow.setup = function () {
          resolve();
        };
      });
    });

    test('is triggered when "draw" is in window', function () {
      return new Promise(function (resolve, reject) {
        iframe = createP5Iframe();
        iframe.elt.contentWindow.draw = function () {
          resolve();
        };
      });
    });

    test('works when p5.js is loaded asynchronously', function () {
      return new Promise(function (resolve, reject) {
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

    test('works on-demand', function () {
      return new Promise(function (resolve, reject) {
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
      }).then(function () {
        var win = iframe.elt.contentWindow;
        assert.equal(typeof win.myURL, 'string');
        assert.strictEqual(win.setupCalled, true);
        assert.strictEqual(win.originalP5Instance, win.p5.instance);
      });
    });
  });

  suite('p5.prototype._createFriendlyGlobalFunctionBinder', function () {
    var noop = function () {};
    var createBinder = p5.prototype._createFriendlyGlobalFunctionBinder;
    var logMsg, globalObject, bind, iframe;

    teardown(function () {
      if (iframe) {
        iframe.teardown();
        iframe = null;
      }
    });

    setup(function () {
      globalObject = {};
      logMsg = undefined;
      bind = createBinder({
        globalObject: globalObject,
        log: function (msg) {
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
      test('should warn when globals already exist', function () {
        const _friendlyErrorStub = sinon.stub(p5, '_friendlyError');
        try {
          globalObject.text = 'hi';
          bind('text', noop);
          expect(
            _friendlyErrorStub.calledOnce,
            'p5._friendlyError was not called'
          ).to.be.true;
        } finally {
          _friendlyErrorStub.restore();
        }
      });

      test('should warn when globals are overwritten', function () {
        bind('text', noop);
        globalObject.text = 'boop';

        assert.match(logMsg, /You just changed the value of "text"/);
        assert.equal(globalObject.text, 'boop');
        assert.deepEqual(Object.keys(globalObject), ['text']);
      });
    } else {
      test('should NOT warn when globals already exist', function () {
        const _friendlyErrorStub = sinon.stub(p5, '_friendlyError');
        try {
          globalObject.text = 'hi';
          bind('text', noop);
          expect(
            _friendlyErrorStub.calledOnce,
            'p5._friendlyError was called in minified p5.js'
          ).to.be.false;
        } finally {
          _friendlyErrorStub.restore();
        }
      });

      test('should NOT warn when globals are overwritten', function () {
        bind('text', noop);
        globalObject.text = 'boop';

        assert.isUndefined(logMsg);
        assert.equal(globalObject.text, 'boop');
        assert.deepEqual(Object.keys(globalObject), ['text']);
      });
    }

    test('should allow overwritten globals to be overwritten', function () {
      bind('text', noop);
      globalObject.text = 'boop';
      globalObject.text += 'blap';
      assert.equal(globalObject.text, 'boopblap');
    });

    test('should allow globals to be deleted', function () {
      bind('text', noop);
      delete globalObject.text;
      assert.isUndefined(globalObject.text);
      assert.isUndefined(logMsg);
    });

    test('should create enumerable globals', function () {
      bind('text', noop);
      assert.deepEqual(Object.keys(globalObject), ['text']);
    });

    test('should not warn about overwriting print()', function () {
      globalObject.print = window.print;
      bind('print', noop);
      assert.equal(globalObject.print, noop);
      assert.isUndefined(logMsg);
    });

    // This is a regression test for
    // https://github.com/processing/p5.js/issues/1350.
    test('should not warn about overwriting preload methods', function () {
      globalObject.loadJSON = function () {
        throw new Error();
      };
      bind('loadJSON', noop);
      assert.equal(globalObject.loadJSON, noop);
      assert.isUndefined(logMsg);
    });

    test('should not warn about overwriting non-functions', function () {
      bind('mouseX', 5);
      globalObject.mouseX = 50;
      assert.equal(globalObject.mouseX, 50);
      assert.isUndefined(logMsg);
    });

    test('instance preload is independent of window', function () {
      // callback for p5 instance mode.
      // It does not define a preload.
      // This tests that we don't call the global preload accidentally.
      function cb(s) {
        s.setup = function () {
          window.afterSetup();
        };
      }
      return new Promise(function (resolve) {
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
      }).then(function () {
        var win = iframe.elt.contentWindow;
        assert.strictEqual(win.globalPreloads, 1);
      });
    });
  });
});
