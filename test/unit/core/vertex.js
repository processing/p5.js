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
    test('no friendly-err-msg. missing param #0', function() {
      assert.doesNotThrow(
        function() {
          myp5.beginShape();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.quadraticVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.quadraticVertex);
      assert.typeOf(myp5.quadraticVertex, 'function');
    });
    test('_friendlyError is called. vertex() should be used once before quadraticVertex()', function() {
      myp5.quadraticVertex(80, 20, 50, 50, 10, 20);
      expect(_friendlyErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  suite('p5.prototype.bezierVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.bezierVertex);
      assert.typeOf(myp5.bezierVertex, 'function');
    });
    test('_friendlyError is called. vertex() should be used once before bezierVertex()', function() {
      myp5.bezierVertex(25, 30, 25, -30, -25, 30);
      expect(_friendlyErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  suite('p5.prototype.curveVertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.curveVertex);
      assert.typeOf(myp5.curveVertex, 'function');
    });
  });

  suite('p5.prototype.endShape', function() {
    test('should be a function', function() {
      assert.ok(myp5.endShape);
      assert.typeOf(myp5.endShape, 'function');
    });
    test('no friendly-err-msg. missing param #0', function() {
      assert.doesNotThrow(
        function() {
          myp5.endShape();
        },
        Error,
        'got unwanted exception'
      );
    });
  });

  suite('p5.prototype.vertex', function() {
    test('should be a function', function() {
      assert.ok(myp5.vertex);
      assert.typeOf(myp5.vertex, 'function');
    });
  });
});
