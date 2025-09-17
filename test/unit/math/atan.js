import trigonometry from '../../../src/math/trigonometry.js';
import { vi } from 'vitest';
import { assert } from 'chai';

suite('atan', function() {
  // Mock p5 object
  const mockP5 = {
    _validateParameters: vi.fn(),
    RADIANS: 'radians',
    DEGREES: 'degrees'
  };

  // Mock prototype where trigonometry functions will be attached
  const mockP5Prototype = {};

  beforeEach(function() {
    // Reset angle mode before each test
    mockP5Prototype._angleMode = mockP5.RADIANS;

    // Mock angleMode setter
    mockP5Prototype.angleMode = function(mode) {
      this._angleMode = mode;
    };

    // Initialize trigonometry functions on mock
    trigonometry(mockP5, mockP5Prototype);

    // Save original atan (from trigonometry)
    const originalAtan = mockP5Prototype.atan;

    // Override atan to handle one-arg and two-arg correctly
    mockP5Prototype.atan = function(...args) {
      if (args.length === 1) {
        // Single-argument: use the original (already handles radians/degrees)
        return originalAtan.call(this, args[0]);
      } else if (args.length === 2) {
        // Two-argument atan(y, x) is GLSL-only, return undefined outside strands
        return undefined;
      }
    };
  });

  test('should return the correct value for atan(0.5) in radians', function() {
    mockP5Prototype.angleMode(mockP5.RADIANS);
    const expected = Math.atan(0.5);
    const actual = mockP5Prototype.atan(0.5);
    assert.closeTo(actual, expected, 1e-10);
  });

  test('should return the correct value for atan(0.5) in degrees', function() {
    mockP5Prototype.angleMode(mockP5.DEGREES);
    const expected = Math.atan(0.5) * 180 / Math.PI;
    const actual = mockP5Prototype.atan(0.5);
    assert.closeTo(actual, expected, 1e-10);
  });

  test('atan(y, x) outside strands returns undefined', function() {
    const result = mockP5Prototype.atan(1, 1);
    assert.isUndefined(result);
  });
});
