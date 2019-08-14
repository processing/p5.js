import { expect } from 'chai';
import * as constants from '../../src/core/constants.js';
import helpers from '../../src/core/helpers.js';

const a = 100;
const b = 200;
const c = 50;
const d = 150;
let result;

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
