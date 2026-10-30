import { vi, suite, test, assert, beforeAll } from 'vitest';
import loading from '../../../src/core/loading.js';
import { mockP5, mockP5Prototype } from '../../js/mocks';

suite('Loading indicator', function () {
  let container;
  let canvas;
  let createCanvasDecorator;
  const lifecycles = {};

  beforeAll(function () {
    mockP5.registerDecorator.mockImplementation((path, decorator) => {
      if (path === 'p5.prototype.createCanvas') {
        createCanvasDecorator = decorator;
      }
    });
    loading(mockP5, mockP5Prototype, lifecycles);
  });

  beforeEach(function () {
    mockP5.loadingAnimation = true;
    container = document.createElement('div');
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    document.body.appendChild(container);
  });

  afterEach(function () {
    mockP5.loadingAnimation = true;
    if (container) {
      container.remove();
      container = null;
      canvas = null;
    }
  });

  function callCreateCanvas(p) {
    const createCanvas = createCanvasDecorator(function () {});
    createCanvas.call(p);
  }

  test('shows a loading indicator while async setup waits for load()', async function () {
    let loadTest;

    const p = {
      canvas: canvas,
      createCanvas: vi.fn(),
      background: vi.fn(),
      fill: vi.fn(),
      circle: vi.fn(),
      width: 400,
      height: 400,
      mouseX: 12,
      mouseY: 34,
      _isSketchLoading: false
    };

    const load = async delay => {
      await new Promise(resolve => {
        loadTest = resolve;
      });
    };

    const setupPromise = (async function setup() {
      lifecycles.presetup.call(p);

      try {
        p.createCanvas(400, 400);
        callCreateCanvas(p);

        await load(2000);

        p.background('#EB5580');
        p.fill(255);
        p.circle(p.width / 2, p.height / 2, 100);

        p.circle(p.mouseX, p.mouseY, 20);
      } 
      finally {
        lifecycles.postsetup.call(p);
      }
    })();

    const loadingIndicator = container.querySelector('.loading-indicator');

    assert.exists(loadingIndicator);

    loadTest();
    await setupPromise;

    assert.isNull(container.querySelector('.loading-indicator'));
    assert.deepEqual(p.createCanvas.mock.calls, [[400, 400]]);
    assert.deepEqual(p.background.mock.calls, [['#EB5580']]);
    assert.deepEqual(p.fill.mock.calls, [[255]]);
    assert.deepEqual(p.circle.mock.calls, [
      [200, 200, 100],
      [12, 34, 20]
    ]);
  });

  test('removes loading indicator when setup rejects', async function () {
    const p = {
      canvas,
      _isSketchLoading: false
    };
    const setupError = new Error('setup failed');

    lifecycles.presetup.call(p);

    const overlay = document.createElement('canvas');
    overlay.classList.add('loading-indicator');
    container.appendChild(overlay);
    p._loadingOverlay = overlay;

    const setupPromise = (async function setup() {
      try {
        await Promise.reject(setupError);
      } 
      finally {
        lifecycles.postsetup.call(p);
      }
    })();

    let rejectedPromise;
    try {
      await setupPromise;
    } 
    catch (error) {
      rejectedPromise = error;
    }

    assert.strictEqual(rejectedPromise, setupError);
    assert.isFalse(p._isSketchLoading);
    assert.isNull(container.querySelector('.loading-indicator'));
  });

  test('test the loading indicator in an instance', function () {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const p = {
      canvas: canvas,
      _userNode: container,
      _isSketchLoading: false
    };

    lifecycles.presetup.call(p);
    assert.equal(p._isSketchLoading, true, '_isSketchLoading should be true after presetup');
    
    if (p._isSketchLoading) {
      const overlay = document.createElement('canvas');
      overlay.classList.add('loading-indicator');
      overlay.id = 'testLoadingOverlay';
      container.appendChild(overlay);
      p._loadingOverlay = overlay;
    }
    
    assert.exists(container.querySelector('.loading-indicator'), 'Loading indicator should exist');

    lifecycles.postsetup.call(p);
    assert.isNull(container.querySelector('.loading-indicator'), 'Loading indicator should be removed');
  });

  test('disables the loading animation without a callback', function () {
    const p = Object.assign({}, mockP5Prototype, {
      canvas,
      _hasCustomLoading: false
    });
    const overlay = document.createElement('canvas');
    overlay.classList.add('loading-indicator');
    container.appendChild(overlay);
    p._loadingOverlay = overlay;

    const result = p.loadingAnimation();

    assert.isTrue(p._hasCustomLoading);
    assert.isUndefined(p._loadingAnimation);
    assert.isNull(container.querySelector('.loading-indicator'));
    assert.strictEqual(result, p);
  });

  test('no loading overlay when loading animation is globally disabled', function () {
    mockP5.loadingAnimation = false;
    const p = {
      canvas,
      constructor: mockP5,
      _isSketchLoading: true
    };

    callCreateCanvas(p);

    assert.isNull(container.querySelector('.loading-indicator'));
  });

  test('uses a custom loading animation', function () {
    const callback = vi.fn();
    const p = Object.assign({}, mockP5Prototype, {
      canvas,
      _isSketchLoading: true
    });

    p.loadingAnimation(callback);
    callCreateCanvas(p);

    assert.isTrue(p._hasCustomLoading);
    assert.strictEqual(p._loadingAnimation, callback);
    assert.isAbove(callback.mock.calls.length, 0);
    assert.strictEqual(callback.mock.calls[0][0].canvas, p._loadingOverlay);
    assert.strictEqual(callback.mock.calls[0][1], canvas.width);
    assert.strictEqual(callback.mock.calls[0][2], canvas.height);
    assert.strictEqual(callback.mock.calls[0][3], 0);
    assert.strictEqual(p.loadingAnimation(callback), p);
  });

  test('tests interactivity when loading indicator is active', function () {
    const p = {
      canvas,
      _isSketchLoading: true
    };

    callCreateCanvas(p);

    const overlay = p._loadingOverlay;
    assert.exists(overlay);
    assert.strictEqual(overlay.getContext('2d').canvas, overlay);
    assert.strictEqual(overlay.style.pointerEvents, 'none');
    assert.strictEqual(overlay.previousSibling, canvas);
    assert.strictEqual(overlay.parentNode, canvas.parentNode);
  });

  test('tracks canvas overlay positions during loading', function () {
    let frameCallbacks = [];
    const requestAnimationFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(callback => {
        frameCallbacks.push(callback);
        return frameCallbacks.length;
      });

    const sketches = [];
    const stepFrames = () => {
      const callbacks = frameCallbacks;
      frameCallbacks = [];
      callbacks.forEach(cb => cb());
    };

    const makeSketch = (w, h, delay, label) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      c.setAttribute('data-label', label);

      let top = 0;
      let left = 0;
      Object.defineProperty(c, 'offsetTop', {
        get: () => top,
        configurable: true
      });
      Object.defineProperty(c, 'offsetLeft', {
        get: () => left,
        configurable: true
      });

      container.appendChild(c);

      const p = {
        canvas: c,
        _isSketchLoading: true,
        setOffset(newTop, newLeft) {
          top = newTop;
          left = newLeft;
        }
      };

      lifecycles.presetup.call(p);
      callCreateCanvas(p);
      sketches.push(p);
      return p;
    };

    try {
      const p1 = makeSketch(600, 300, 7000, 'big 600x300');
      p1.setOffset(10, 10);
      stepFrames();
      assert.strictEqual(p1._loadingOverlay.style.top, '10px');

      const p2 = makeSketch(200, 200, 7000, 'small 200x200');
      p2.setOffset(110, 620);
      stepFrames();
      assert.strictEqual(p2._loadingOverlay.style.top, '110px');

      const p3 = makeSketch(100, 500, 7000, 'tall 100x500');
      p3.setOffset(10, 830);
      p1.setOffset(210, 10);
      p2.setOffset(310, 620);

      stepFrames();

      assert.strictEqual(p1._loadingOverlay.style.top, '210px');
      assert.strictEqual(p1._loadingOverlay.style.left, '10px');
      assert.strictEqual(p1._loadingOverlay.style.width, '600px');
      assert.strictEqual(p1._loadingOverlay.style.height, '300px');

      assert.strictEqual(p2._loadingOverlay.style.top, '310px');
      assert.strictEqual(p2._loadingOverlay.style.left, '620px');
      assert.strictEqual(p2._loadingOverlay.style.width, '200px');
      assert.strictEqual(p2._loadingOverlay.style.height, '200px');

      assert.strictEqual(p3._loadingOverlay.style.top, '10px');
      assert.strictEqual(p3._loadingOverlay.style.left, '830px');
      assert.strictEqual(p3._loadingOverlay.style.width, '100px');
      assert.strictEqual(p3._loadingOverlay.style.height, '500px');
    } 
    finally {
      sketches.forEach(p => lifecycles.postsetup.call(p));
      requestAnimationFrame.mockRestore();
    }
  });

  test('test multiple indicators for multiple instances', async function () {
    const instance1 = document.createElement('div');
    const instance2 = document.createElement('div');
    document.body.appendChild(instance1);
    document.body.appendChild(instance2);

    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    instance1.appendChild(canvas1);
    instance2.appendChild(canvas2);

    let resolveLoad1;
    let resolveLoad2;

    const load1 = async delay => {
      await new Promise(resolve => {
        resolveLoad1 = resolve;
      });
    };

    const load2 = async delay => {
      await new Promise(resolve => {
        resolveLoad2 = resolve;
      });
    };

    const p1 = { 
      _userNode: instance1, 
      canvas: canvas1,
      _isSketchLoading: false
    };
    const p2 = { 
      _userNode: instance2, 
      canvas: canvas2,
      _isSketchLoading: false
    };

    const setup1 = (async function () {
      lifecycles.presetup.call(p1);
      // Simulate the decorator creating the overlay
      if (p1._isSketchLoading) {
        const overlay1 = document.createElement('canvas');
        overlay1.classList.add('loading-indicator');
        instance1.appendChild(overlay1);
        p1._loadingOverlay = overlay1;
      }
      try {
        await load1(2000);
      } 
      finally {
        lifecycles.postsetup.call(p1);

      }
    })();

    const setup2 = (async function () {
      lifecycles.presetup.call(p2);
      if (p2._isSketchLoading) {
        const overlay2 = document.createElement('canvas');
        overlay2.classList.add('loading-indicator');
        instance2.appendChild(overlay2);
        p2._loadingOverlay = overlay2;
      }
      try {
        await load2(4000);
      } 
      finally {
        lifecycles.postsetup.call(p2);
      }
    })();

    assert.exists(
      instance1.querySelector('.loading-indicator'),
      'Container 1 should have a spinner'
    );
    assert.exists(
      instance2.querySelector('.loading-indicator'),
      'Container 2 should have a spinner'
    );

    resolveLoad1();
    await setup1;

    assert.isNull(
      instance1.querySelector('.loading-indicator'),
      'Container 1 spinner should be removed'
    );
    assert.exists(
      instance2.querySelector('.loading-indicator'),
      'Container 2 spinner MUST still exist'
    );

    resolveLoad2();
    await setup2;

    assert.isNull(
      instance2.querySelector('.loading-indicator'),
      'Container 2 spinner should now be removed'
    );

    instance1.remove();
    instance2.remove();
  });
});
