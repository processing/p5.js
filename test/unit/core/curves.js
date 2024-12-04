import { mockP5, mockP5Prototype } from '../../js/mocks';
import curves from '../../../src/shape/curves';

suite('Curves', function() {
  beforeAll(function() {
    mockP5Prototype._renderer = {
      _curveTightness: 0
    };
    curves(mockP5, mockP5Prototype);
  });

  afterAll(() => {
    delete mockP5Prototype._renderer;
  });

  suite('p5.prototype.bezier', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.bezier);
      assert.typeOf(mockP5Prototype.bezier, 'function');
    });
  });

  suite('p5.prototype.bezierPoint', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.bezierPoint);
      assert.typeOf(mockP5Prototype.bezierPoint, 'function');
    });
    test('should return the correct point on a Bezier Curve', function() {
      result = mockP5Prototype.bezierPoint(85, 10, 90, 15, 0.5);
      assert.equal(result, 50);
      assert.notEqual(result, -1);
    });
  });

  suite('p5.prototype.bezierTangent', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.bezierTangent);
      assert.typeOf(mockP5Prototype.bezierTangent, 'function');
    });
    test('should return the correct point on a Bezier Curve', function() {
      result = mockP5Prototype.bezierTangent(95, 73, 73, 15, 0.5);
      assert.equal(result, -60);
    });
  });

  suite('p5.prototype.curve', function() {
    test('should be a function', function() {
      assert.ok(mockP5Prototype.curve);
      assert.typeOf(mockP5Prototype.curve, 'function');
    });
  });

  suite('p5.prototype.curvePoint', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.curvePoint);
      assert.typeOf(mockP5Prototype.curvePoint, 'function');
    });
    test('should return the correct point on a Catmull-Rom Curve', function() {
      result = mockP5Prototype.curvePoint(5, 5, 73, 73, 0.5);
      assert.equal(result, 39);
      assert.notEqual(result, -1);
    });
  });

  suite('p5.prototype.curveTangent', function() {
    var result;
    test('should be a function', function() {
      assert.ok(mockP5Prototype.curveTangent);
      assert.typeOf(mockP5Prototype.curveTangent, 'function');
    });
    test('should return the correct point on a Catmull-Rom Curve', function() {
      result = mockP5Prototype.curveTangent(95, 73, 73, 15, 0.5);
      assert.equal(result, 10);
      assert.notEqual(result, -1);
    });
  });
});
