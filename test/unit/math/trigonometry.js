import trigonometry from '../../../src/math/trigonometry.js';
import { vi } from 'vitest';

suite('Trigonometry', function() {
  let theta = 90;
  let x = 0;
  let y = 1;
  let ratio = 0.5;

  const mockP5 = {
    _validateParameters: vi.fn()
  };
  const mockP5Prototype = {
    _setProperty: vi.fn()
  };

  beforeEach(async function() {
    trigonometry(mockP5, mockP5Prototype);
  });

  afterAll(function() {
  });

  var handleDegreesAndRadians = function(func) {
    test('should handle degrees', function() {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      var degToRad = mockP5Prototype.radians(theta);
      assert.equal(Math[func](degToRad), mockP5Prototype[func](theta));
    });

    test('should handle radians', function() {
      mockP5Prototype.angleMode(mockP5.RADIANS);
      assert.equal(Math[func](theta), mockP5Prototype[func](theta));
    });
  };

  var ahandleDegreesAndRadians = function(func) {
    test('should handle degrees', function() {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      assert.equal(
        mockP5Prototype.degrees(Math[func](ratio)), mockP5Prototype[func](ratio)
      );
    });

    test('should handle radians', function() {
      mockP5Prototype.angleMode(mockP5.RADIANS);
      assert.equal(Math[func](ratio), mockP5Prototype[func](ratio));
    });
  };

  suite('p5.prototype.angleMode', function() {
    test('should set constant to DEGREES', function() {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      assert.equal(mockP5Prototype.angleMode(), mockP5.DEGREES);
    });

    test('should set constant to RADIANS', function() {
      mockP5Prototype.angleMode(mockP5Prototype.RADIANS);
      assert.equal(mockP5Prototype.angleMode(), mockP5.RADIANS);
    });

    test('should return radians', function() {
      mockP5Prototype.angleMode(mockP5.RADIANS);
      assert.equal(mockP5Prototype.angleMode(), mockP5.RADIANS);
    });

    test('should return degrees', function() {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      assert.equal(mockP5Prototype.angleMode(), mockP5.DEGREES);
    });

    test('should always be RADIANS or DEGREES', function() {
      mockP5Prototype.angleMode('wtflolzkk');
      assert.equal(mockP5Prototype.angleMode(), mockP5.RADIANS);
    });
  });

  suite('p5.prototype.degrees', function() {
    test('should return the angle in radians when angleMode is DEGREES', function() {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      var angleInRad = 360 * theta / (2 * Math.PI); // This is degToRad conversion
      assert.equal(mockP5Prototype.degrees(theta), angleInRad);
    });

    test('should return the angle in radians when angleMode is RADIANS', function() {
      mockP5Prototype.angleMode(mockP5.RADIANS);
      var angleInRad = 360 * theta / (2 * Math.PI); // This is degToRad conversion
      assert.equal(mockP5Prototype.degrees(theta), angleInRad);
    });
  });

  suite('p5.prototype.radians', function() {
    test('should return the angle in degrees when angleMode is RADIANS', function() {
      mockP5Prototype.angleMode(mockP5.RADIANS);
      var angleInDeg = 2 * Math.PI * theta / 360; // This is RadToDeg conversion
      assert.equal(mockP5Prototype.radians(theta), angleInDeg);
    });

    test('should return the angle in degrees when angleMode is DEGREES', function() {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      var angleInDeg = 2 * Math.PI * theta / 360; // This is RadToDeg conversion
      assert.equal(mockP5Prototype.radians(theta), angleInDeg);
    });
  });

  suite('p5.prototype.asin', function() {
    ahandleDegreesAndRadians('asin');
  });

  suite('p5.prototype.atan', function() {
    ahandleDegreesAndRadians('atan');
  });

  suite('p5.prototype.acos', function() {
    ahandleDegreesAndRadians('acos');
  });

  suite('p5.prototype.sin', function() {
    handleDegreesAndRadians('sin');
  });

  suite('p5.prototype.cos', function() {
    handleDegreesAndRadians('cos');
  });

  suite('p5.prototype.tan', function() {
    handleDegreesAndRadians('tan');
  });

  suite('p5.prototype.atan2', function() {
    test('should handle degrees', function() {
      mockP5Prototype.angleMode(mockP5.DEGREES);
      assert.equal(
        mockP5Prototype.degrees(Math.atan2(y, x)), mockP5Prototype.atan2(y, x)
      );
    });

    test('should handle radians', function() {
      mockP5Prototype.angleMode(mockP5.RADIANS);
      assert.equal(Math.atan2(y, x), mockP5Prototype.atan2(y, x));
    });
  });
});
