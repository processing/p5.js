import { vi, suite, test, assert } from 'vitest';
import loading from '../../../src/core/loading.js';

suite('Loading indicator', function() {
  let container;
  let canvas;

  const lifecycles = {};
  loading(null, null, lifecycles);

  beforeEach(function() {
    container = document.createElement('div');
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    document.body.appendChild(container);
  });

  afterEach(function() {
    lifecycles.postsetup?.();

    if (container) {
      container.remove();
      container = null;
      canvas = null;
    }
  });

  test('shows a loading indicator while async setup waits for load()', async function() {
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

        await load(7000);

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
    assert.deepEqual(p.circle.mock.calls, [[200, 200, 100], [12, 34, 20]]);
  });
});