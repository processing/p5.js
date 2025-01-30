import { mockP5, mockP5Prototype } from '../../js/mocks';
import attributes from '../../../src/shape/attributes';

suite('Attributes', function() {
  beforeAll(function() {
    attributes(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.ellipseMode', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.ellipseMode);
      assert.typeOf(mockP5Prototype.ellipseMode, 'function');
    });
  });

  suite('p5.prototype.rectMode', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.rectMode);
      assert.typeOf(mockP5Prototype.rectMode, 'function');
    });
  });

  suite('p5.prototype.noSmooth', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.noSmooth);
      assert.typeOf(mockP5Prototype.noSmooth, 'function');
    });
  });

  suite('p5.prototype.smooth', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.smooth);
      assert.typeOf(mockP5Prototype.smooth, 'function');
    });
  });

  suite('p5.prototype.strokeCap', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.strokeCap);
      assert.typeOf(mockP5Prototype.strokeCap, 'function');
    });
  });

  suite('p5.prototype.strokeJoin', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.strokeJoin);
      assert.typeOf(mockP5Prototype.strokeJoin, 'function');
    });
  });

  suite('p5.prototype.strokeWeight', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.strokeWeight);
      assert.typeOf(mockP5Prototype.strokeWeight, 'function');
    });
  });
});
