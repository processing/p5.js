/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  var color_utils = require('utils.color_utils');
  var constants = require('constants');

  /**
   * 
   * @class p5.Color
   * @constructor
   */
  p5.Color = function (pInst, vals) {
    this.color_array = p5.Color._getFormattedColor.apply(pInst, vals);
    this._normalizeColorArray(pInst);

    if (pInst._colorMode === constants.HSB) {
      this.hsba = this.color_array;
      this.rgba = color_utils.hsbaToRGBA(this.hsba);
    } else {
      this.rgba = this.color_array;
      this.hsba = color_utils.rgbaToHSBA(this.rgba);
    }

    return this;
  };

  p5.Color.prototype._normalizeColorArray = function (pInst) {
    var isRGB = pInst._colorMode === constants.RGB;
    var maxArr = isRGB ? pInst._maxRGB : pInst._maxHSB;
    var arr = this.color_array;
    arr[0] *= 255 / maxArr[0];
    arr[1] *= 255 / maxArr[1];
    arr[2] *= 255 / maxArr[2];
    arr[3] *= 255 / maxArr[3];
    return arr;
  };

  p5.Color.prototype.getHue = function() {
    return this.hsba[0];
  };

  p5.Color.prototype.getSaturation = function() {
    return this.hsba[1];
  };

  p5.Color.prototype.getBrightness = function() {
    return this.hsba[2];
  };

  p5.Color.prototype.getRed = function() {
    return this.rgba[0];
  };

  p5.Color.prototype.getGreen = function() {
    return this.rgba[1];
  };

  p5.Color.prototype.getBlue = function() {
    return this.rgba[2];
  };

  p5.Color.prototype.getAlpha = function() {
    return this.rgba[3];
  };
  p5.Color.prototype.toString = function() {
    var a = this.rgba;
    for (var i=0; i<3; i++) {
      a[i] = Math.floor(a[i]);
    }
    var alpha = typeof a[3] !== 'undefined' ? a[3] / 255 : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };

  /**
   * For a number of different inputs, returns a color formatted as
   * [r, g, b, a].
   * 
   * @param {Array-like} args An 'array-like' object that represents a list of
   *                          arguments
   * @return {Array}          a color formatted as [r, g, b, a]
   *                          Example:
   *                          input        ==> output
   *                          g            ==> [g, g, g, 255]
   *                          g,a          ==> [g, g, g, a]
   *                          r, g, b      ==> [r, g, b, 255]
   *                          r, g, b, a   ==> [r, g, b, a]
   *                          [g]          ==> [g, g, g, 255]
   *                          [g, a]       ==> [g, g, g, a]
   *                          [r, g, b]    ==> [r, g, b, 255]
   *                          [r, g, b, a] ==> [r, g, b, a]
   * @example
   * <div>
   * <code>
   * // todo
   * </code>
   * </div>
   */
  p5.Color._getFormattedColor = function () {
    var r, g, b, a;
    if (arguments.length >= 3) {
      r = arguments[0];
      g = arguments[1];
      b = arguments[2];
      a = typeof arguments[3] === 'number' ? arguments[3] : 255;
    } else {
      if (this._colorMode === constants.RGB) {
        r = g = b = arguments[0];
      } else {
        r = b = arguments[0];
        g = 0;
      }
      a = typeof arguments[1] === 'number' ? arguments[1] : 255;
    }
    return [
      r,
      g,
      b,
      a
    ];
  };

  return p5.Color;
});
