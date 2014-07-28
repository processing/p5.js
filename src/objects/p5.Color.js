/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  var constants = require('constants');

  /**
   * 
   * @class p5.Color
   * @constructor
   */
  p5.Color = function() {
    var pInst = arguments[0];
    var vals = arguments[1];
    
    var isRGB = pInst._colorMode === constants.RGB;
    var maxArr = isRGB ? pInst._maxRGB : pInst._maxHSB;

    var r, g, b, a;
    if (vals.length >= 3) {
      r = vals[0];
      g = vals[1];
      b = vals[2];
      a = typeof vals[3] === 'number' ? vals[3] : maxArr[3];
    } else {
      if (isRGB) {
        r = g = b = vals[0];
      } else {
        r = b = vals[0];
        g = 0;
      }
      a = typeof vals[1] === 'number' ? vals[1] : maxArr[3];
    }
    // we will need all these later, store them instead of recalc
    if (!isRGB) {
      this.hsba = [r, g, b, a];
    }
    this.rgba = pInst.getNormalizedColor([r, g, b, a]);
    this.colorString = pInst.getColorString(this.rgba);
  };

  return p5.Color;
});
