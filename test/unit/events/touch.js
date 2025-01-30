import p5 from '../../../src/app.js';
import { parallelSketches } from '../../js/p5_helpers';

suite('Touch Events', function() {
  let myp5;

  let touchEvent1;
  let touchEvent2;

  beforeAll(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        touchEvent1 = new PointerEvent('pointerdown', {
          pointerId: 1,
          clientX: 100,
          clientY: 100,
          pointerType: 'touch'
        });

        // Simulate second touch event
        touchEvent2 = new PointerEvent('pointerdown', {
          pointerId: 2,
          clientX: 200,
          clientY: 200,
          pointerType: 'touch'
        });
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  suite('p5.prototype.touches', function() {
    test('should be an empty array', function() {
      assert.deepEqual(myp5.touches, []);
    });

    test('should be an array of multiple touches', function() {
      window.dispatchEvent(touchEvent1);
      window.dispatchEvent(touchEvent2);
      assert.strictEqual(myp5.touches.length, 2);
    });

    test('should contain the touch registered', function() {
      assert.strictEqual(myp5.touches[0].id, 1);
    });
  });
});
