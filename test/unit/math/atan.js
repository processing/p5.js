import trigonometry from '../../../src/math/trigonometry.js';
import { assert } from 'chai';

suite('atan', function() {
  const mockP5 = {
    RADIANS: 'radians',
    DEGREES: 'degrees',
    _validateParameters: () => {}
  };
  const mockP5Prototype = {};

  beforeEach(function() {
    mockP5Prototype._angleMode = mockP5.RADIANS;
    mockP5Prototype.angleMode = function(mode) {
      this._angleMode = mode;
    };
    trigonometry(mockP5, mockP5Prototype);
  });

  test('should return the correct value for atan(0.5) in radians', function() {
    mockP5Prototype.angleMode(mockP5.RADIANS);
    const expected = 0.4636476090008061; // pre-calculated value
    const actual = mockP5Prototype.atan(0.5);
    assert.closeTo(actual, expected, 1e-10);
  });

  test('should return the correct value for atan(0.5) in degrees', function() {
    mockP5Prototype.angleMode(mockP5.DEGREES);
    const expected = 26.56505117707799; // pre-calculated value
    const actual = mockP5Prototype.atan(0.5);
    assert.closeTo(actual, expected, 1e-10);
  });
});
