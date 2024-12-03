import { mockP5, mockP5Prototype } from '../../js/mocks';
import transform from '../../../src/core/transform';

suite('Transform', function() {
  beforeAll(function() {
    transform(mockP5, mockP5Prototype);
  });

  suite('p5.prototype.rotate', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.rotate);
      assert.typeOf(mockP5Prototype.rotate, 'function');
    });
  });

  suite('p5.prototype.rotateX', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.rotateX);
      assert.typeOf(mockP5Prototype.rotateX, 'function');
    });
    test('throws error. should be used in WEBGL mode', function() {
      assert.throws(function() {
        mockP5Prototype.rotateX(100);
      }, Error);
    });
  });

  suite('p5.prototype.rotateY', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.rotateY);
      assert.typeOf(mockP5Prototype.rotateY, 'function');
    });
    test('throws error. should be used in WEBGL mode', function() {
      assert.throws(function() {
        mockP5Prototype.rotateY(100);
      }, Error);
    });
  });

  suite('p5.prototype.rotateZ', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.rotateZ);
      assert.typeOf(mockP5Prototype.rotateZ, 'function');
    });
    test('throws error. should be used in WEBGL mode', function() {
      assert.throws(function() {
        mockP5Prototype.rotateZ(100);
      }, Error);
    });
  });

  suite('p5.prototype.scale', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.scale);
      assert.typeOf(mockP5Prototype.scale, 'function');
    });
  });

  suite('p5.prototype.shearX', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.shearX);
      assert.typeOf(mockP5Prototype.shearX, 'function');
    });
  });

  suite('p5.prototype.shearY', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.shearY);
      assert.typeOf(mockP5Prototype.shearY, 'function');
    });
  });

  suite('p5.prototype.translate', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.translate);
      assert.typeOf(mockP5Prototype.translate, 'function');
    });
  });
});
