import p5 from '../../../src/app.js';
import { testSketchWithPromise, promisedSketch } from '../../js/p5_helpers';

suite('Loading Displaying Fonts', function() {
  var myp5;

  beforeAll(function() {
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
  });

  afterAll(function() {
    myp5.remove();
  });

  
  suite('p5.prototype.textFont', function() {
    test('sets the current font as Georgia', function() {
      myp5.textFont('Georgia');
      assert.strictEqual(myp5.textFont(), 'Georgia');
    });

    test('sets the current font as Helvetica', function() {
      myp5.textFont('Helvetica');
      assert.strictEqual(myp5.textFont(), 'Helvetica');
    });

    test('sets the current font and text size', function() {
      myp5.textFont('Courier New', 24);
      assert.strictEqual(myp5.textFont(), 'Courier New');
      assert.strictEqual(myp5.textSize(), 24);
    });
  });
});
