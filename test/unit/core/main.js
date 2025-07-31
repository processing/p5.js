import p5 from '../../../src/app.js';
import { createP5Iframe, P5_SCRIPT_TAG, P5_SCRIPT_URL } from '../../js/p5_helpers';
import { vi } from 'vitest';

suite('Core', function () {
  suite.todo('new p5() / global mode', function () {
    var iframe;

    afterAll(function () {
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

  // NOTE: need rewrite or will be taken care of by FES
  suite.todo('p5.prototype._createFriendlyGlobalFunctionBinder', function () {
    var noop = function () {};
    var createBinder = p5.prototype._createFriendlyGlobalFunctionBinder;
    var logMsg, globalObject, bind, iframe;

    afterAll(function () {
      if (iframe) {
        iframe.teardown();
        iframe = null;
      }
    });

    beforeAll(function () {
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
        const _friendlyErrorStub = vi.spyOn(p5, '_friendlyError');
        try {
          globalObject.text = 'hi';
          bind('text', noop);
          expect(
            _friendlyErrorStub
          ).toHaveBeenCalledTimes(1);
        } finally {
          vi.restoreAllMocks();
        }
      });

      test.todo('should warn when globals are overwritten', function () {
        bind('text', noop);
        globalObject.text = 'boop';

        assert.match(logMsg, /You just changed the value of "text"/);
        assert.equal(globalObject.text, 'boop');
        assert.deepEqual(Object.keys(globalObject), ['text']);
      });
    } else {
      test('should NOT warn when globals already exist', function () {
        const _friendlyErrorStub = vi.spyOn(p5, '_friendlyError');
        try {
          globalObject.text = 'hi';
          bind('text', noop);
          expect(
            _friendlyErrorStub.calledOnce,
            'p5._friendlyError was called in minified p5.js'
          ).to.be.false;
        } finally {
          vi.restoreAllMocks();
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

    test('should not warn about overwriting non-functions', function () {
      bind('mouseX', 5);
      globalObject.mouseX = 50;
      assert.equal(globalObject.mouseX, 50);
      assert.isUndefined(logMsg);
    });
  });

  suite('millis()', () => {
    let myp5

    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
      if (myp5) {
        myp5.remove();
        myp5 = undefined;
      }
    });

    test('millis() starts at 0 when the draw loop begins', async () => {
      const t = await new Promise((resolve) => {
        myp5 = new p5((p) => {
          p.setup = () => {
            // Pretend setup takes 1s
            vi.advanceTimersByTime(1000);
          };
          p.draw = () => {
            // Pretend draw() happens 50ms after setup
            vi.advanceTimersByTime(50);
            resolve(p.millis());
          };
        });
      });
      expect(t).toEqual(50);
    });
  });
});
