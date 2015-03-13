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
   * These Regular Expressions are used to build up the patterns for matching
   * viable CSS color strings: fragmenting the regexes in this way increases
   * the legibility and comprehensibility of the code
   */
  // Match any number of whitespace characters (including no whitespace)
  var WHITESPACE = /\s*/;
  // Match whole-number values, e.g `255` or `79`
  var INTEGER = /(\d{1,3})/;
  // Match decimal values, e.g `129.6`, `79`, or `.9`
  // Note: R, G or B values of `.9` are not parsed by IE: however, they are
  // supported here to provide more consistent color string parsing
  var DECIMAL = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/;
  // Match decimal values followed by a percent sign
  var PERCENT = new RegExp(DECIMAL.source + '%');

  /**
   * Regular Expressions for use identifying color pattern strings
   *
   * @property _patterns
   * @type {Object}
   */
  var colorPatterns = {
    /**
     * Regular expression for matching colors in format #XXX,
     * e.g. #416
     * @property _patterns.HEX3
     * @type {RegExp}
     */
    HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
    /**
     * Regular expression for matching colors in format #XXXXXX,
     * e.g. #b4d455
     * @property _patterns.HEX6
     * @type {RegExp}
     */
    HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
    /**
     * Regular expression for matching colors in format rgb(R, G, B),
     * e.g. rgb(255, 0, 128)
     *
     * @property _patterns.RGB
     * @type {RegExp}
     */
    RGB: new RegExp([
      // Defining RegExp this way makes it more obvious where whitespace
      // (`\s*`) is permitted between tokens
      '^rgb\\(',
      INTEGER.source,
      ',',
      INTEGER.source,
      ',',
      INTEGER.source,
      '\\)$'
    ].join(WHITESPACE.source), 'i'),
    /**
     * Regular expression for matching colors in format rgb(R%, G%, B%),
     * e.g. rgb(100%, 0%, 28.9%)
     *
     * @property _patterns.RGB_PERCENT
     * @type {RegExp}
     */
    RGB_PERCENT: new RegExp([
      // Defining RegExp this way makes it more obvious where whitespace
      // (`\s*`) is permitted between tokens
      '^rgb\\(',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      '\\)$'
    ].join(WHITESPACE.source), 'i'),
    /**
     * Regular expression for matching colors in format rgb(R, G, B, A),
     * e.g. rgb(255, 0, 128, 0.25)
     *
     * @property _patterns.RGBA
     * @type {RegExp}
     */
    RGBA: new RegExp([
      '^rgba\\(',
      INTEGER.source,
      ',',
      INTEGER.source,
      ',',
      INTEGER.source,
      ',',
      DECIMAL.source,
      '\\)$'
    ].join(WHITESPACE.source), 'i'),
    /**
     * Regular expression for matching colors in format rgb(R%, G%, B%, A),
     * e.g. rgb(100%, 0%, 28.9%. 0.5)
     *
     * @property _patterns.RGBA_PERCENT
     * @type {RegExp}
     */
    RGBA_PERCENT: new RegExp([
      '^rgba\\(',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      DECIMAL.source,
      '\\)$'
    ].join(WHITESPACE.source), 'i')
  };

  // Assign colorPatterns to p5.Color for testing
  p5.Color._patterns = colorPatterns;

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
    var r, g, b, a, str, vals;
    if (arguments.length >= 3) {
      r = arguments[0];
      g = arguments[1];
      b = arguments[2];
      a = typeof arguments[3] === 'number' ? arguments[3] : 255;
    } else if (typeof arguments[0] === 'string') {
      str = arguments[0].trim().toLowerCase();

      // Work through available string patterns to determine how to proceed
      if (colorPatterns.HEX3.test(str)) {
        vals = colorPatterns.HEX3.exec(str).slice(1).map(function(color) {
          // Expand #RGB to #RRGGBB
          return parseInt(color + color, 16);
        });
      } else if (colorPatterns.HEX6.test(str)) {
        vals = colorPatterns.HEX6.exec(str).slice(1).map(function(color) {
          return parseInt(color, 16);
        });
      } else if (colorPatterns.RGB.test(str)) {
        vals = colorPatterns.RGB.exec(str).slice(1).map(function(color) {
          return parseInt(color, 10);
        });
      } else if (colorPatterns.RGB_PERCENT.test(str)) {
        vals = colorPatterns.RGB_PERCENT.exec(str).slice(1)
          .map(function(color) {
            return parseInt(parseFloat(color) / 100 * 255, 10);
          });
      } else if (colorPatterns.RGBA.test(str)) {
        vals = colorPatterns.RGBA.exec(str).slice(1)
          .map(function(color, idx) {
            if (idx === 3) {
              // Alpha value is a decimal: multiply by 255
              return parseInt(parseFloat(color) * 255, 10);
            }
            return parseInt(color, 10);
          });
      } else if (colorPatterns.RGBA_PERCENT.test(str)) {
        vals = colorPatterns.RGBA_PERCENT.exec(str).slice(1)
          .map(function(color, idx) {
            if (idx === 3) {
              // Alpha value is a decimal: multiply by 255
              return parseInt(parseFloat(color) * 255, 10);
            }
            return parseInt(parseFloat(color) / 100 * 255, 10);
          });
      } else {
        // Input did not match any CSS Color pattern: Default to white
        vals = [255];
      }

      // Re-run _getFormattedColor with the values parsed out of the string
      return p5.Color._getFormattedColor.apply(this, vals);
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
