import p5 from '../../../src/app.js';
import { vi } from 'vitest';

suite('Vertex', function() {
  var myp5;
  let _friendlyErrorSpy;

  beforeEach(function() {
    _friendlyErrorSpy = vi.spyOn(p5, '_friendlyError');
    new p5(function(p) {
      p.setup = function() {
        myp5 = p;
      };
    });
  });

  afterEach(function() {
    vi.restoreAllMocks();
    myp5.remove();
  });

  suite('p5.prototype.beginShape', function() {
    test('should be a function', function() {
      assert.ok(myp5.beginShape);
      assert.typeOf(myp5.beginShape, 'function');
    });
  });

  suite('p5.prototype.bezierVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.bezierVertex);
      assert.typeOf(myp5.bezierVertex, 'function');
    });
  });

  suite('p5.prototype.splineVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.splineVertex);
      assert.typeOf(myp5.splineVertex, 'function');
    });
  });

  suite('p5.prototype.endShape', function() {
    test('should be a function', function() {
      assert.ok(myp5.endShape);
      assert.typeOf(myp5.endShape, 'function');
    });
  });

  suite('p5.prototype.vertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.vertex);
      assert.typeOf(myp5.vertex, 'function');
    });
  });
});
