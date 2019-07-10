var { expect } = require('chai');
var constants = require('../../src/core/constants.js');
import helpers from '../../src/core/helpers.js';

var a = 100;
var b = 200;
var c = 50;
var d = 150;
var result;

suite('helpers/modeAdjust', function() {
  test('should set mode to corner', function() {
    result = helpers.modeAdjust(a, b, c, d, constants.CORNER);
    expect(result).to.eql({ x: 100, y: 200, w: 50, h: 150 });
  });
  test('should set mode to corners', function() {
    result = helpers.modeAdjust(a, b, c, d, constants.CORNERS);
    expect(result).to.eql({ x: 100, y: 200, w: -50, h: -50 });
  });
  test('should set mode to radius', function() {
    result = helpers.modeAdjust(a, b, c, d, constants.RADIUS);
    expect(result).to.eql({ x: 50, y: 50, w: 100, h: 300 });
  });
  test('should set mode to center', function() {
    result = helpers.modeAdjust(a, b, c, d, constants.CENTER);
    expect(result).to.eql({ x: 75, y: 125, w: 50, h: 150 });
  });
});
