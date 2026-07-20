import { vi } from 'vitest';
import { showLoadingIndicator, hideLoadingIndicator } from '../../../src/core/loading.js';

suite('Loading indicator', function() {
  let container;
  let canvas;

  beforeEach(function() {
    container = document.createElement('div');
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    document.body.appendChild(container);
  });

  afterEach(function() {
    hideLoadingIndicator();

    if (container) {
      container.remove();
      container = null;
      canvas = null;
    }
  });

  test('shows a loading indicator while async setup waits for load()', async function() {
    let loadTest;

    const p = {
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
      showLoadingIndicator(canvas);

      try {
        p.createCanvas(400, 400);

        await load(7000);

        p.background('#EB5580');
        p.fill(255);
        p.circle(p.width / 2, p.height / 2, 100);

        p.circle(p.mouseX, p.mouseY, 20);
      }
      finally {
        hideLoadingIndicator();
      }
    })();

    const loadingOverlay = container.querySelector('div');

    assert.exists(loadingOverlay);
    assert.equal(loadingOverlay.textContent, 'Loading...');

    loadTest();
    await setupPromise;

    assert.isNull(container.querySelector('div'));
    assert.deepEqual(p.createCanvas.mock.calls, [[400, 400]]);
    assert.deepEqual(p.background.mock.calls, [['#EB5580']]);
    assert.deepEqual(p.fill.mock.calls, [[255]]);
    assert.deepEqual(p.circle.mock.calls, [[200, 200, 100], [12, 34, 20]]);
  });
});