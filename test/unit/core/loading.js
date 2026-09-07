import { vi, suite, test, assert } from 'vitest';
import loading from '../../../src/core/loading.js';

suite('Loading indicator', function () {
  let container;
  let canvas;

  const lifecycles = {};
  loading(null, null, lifecycles);

  beforeEach(function () {
    container = document.createElement('div');
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    document.body.appendChild(container);
  });

  afterEach(function () {
    if (container) {
      container.remove();
      container = null;
      canvas = null;
    }
  });

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
      mouseY: 34
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

        await load(2000);

        p.background('#EB5580');
        p.fill(255);
        p.circle(p.width / 2, p.height / 2, 100);

        p.circle(p.mouseX, p.mouseY, 20);
      } finally {
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

  test('test the loading indicator in an instance', function () {
    const p = {
      _userNode: container
    };

    lifecycles.presetup.call(p);
    assert.exists(container.querySelector('.loading-indicator'));

    lifecycles.postsetup.call(p);
    assert.isNull(container.querySelector('.loading-indicator'));
  });

  test('test multiple indicators for multiple instances', async function () {
    const instance1 = document.createElement('div');
    const instance2 = document.createElement('div');
    document.body.appendChild(instance1);
    document.body.appendChild(instance2);

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

    const p1 = { _userNode: instance1 };
    const p2 = { _userNode: instance2 };

    const setup1 = (async function () {
      lifecycles.presetup.call(p1);
      try {
        await load1(2000);
      } finally {
        lifecycles.postsetup.call(p1);
      }
    })();

    const setup2 = (async function () {
      lifecycles.presetup.call(p2);
      try {
        await load2(4000);
      } finally {
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
