import p5 from '../../../src/app.js';
import { parallelSketches } from '../../js/p5_helpers';

suite('Touch Events', function() {
  let myp5;

  let canvas;
  let touchObj1;
  let touchObj2;
  let touchEvent1;
  let touchEvent2;

  beforeAll(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
        canvas = myp5._curElement.elt;
        touchObj1 = new Touch({
          target: canvas,
          clientX: 100,
          clientY: 100,
          identifier: 36
        });
        touchObj2 = new Touch({
          target: canvas,
          clientX: 200,
          clientY: 200,
          identifier: 35
        });
        touchEvent1 = new TouchEvent('touchmove', {
          touches: [touchObj1, touchObj2]
        });
        touchEvent2 = new TouchEvent('touchmove', {
          touches: [touchObj2]
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
      assert.strictEqual(myp5.touches.length, 2);
    });

    test('should contain the touch registered', function() {
      window.dispatchEvent(touchEvent2);
      assert.strictEqual(myp5.touches[0].id, 35);
    });
  });
});
