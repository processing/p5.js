/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 */

var p5 = require('../core/core');
var color_utils = require('./color_utils');
var constants = require('../core/constants');

/**
 *
 * @class p5.Color
 * @constructor
 * rgba, hsla, hsba are normalized rgba arrays
 * (1, 1, 1, 1)
 */
p5.Color = function (pInst, vals) {
  this.mode = pInst._colorMode;
  this.maxes = pInst._colorMaxes;
  var isHSB = this.mode === constants.HSB,
      isRGB = this.mode === constants.RGB,
      isHSL = this.mode === constants.HSL;

  if (isRGB) {
    this._array = p5.Color._getFormattedColor.apply(pInst, vals);
  } else if (isHSB) {
    this.hsba = p5.Color._getFormattedColor.apply(pInst, vals);
    this._array = color_utils.hsbaToRGBA(this.hsba);
  } else if (isHSL){
    this.hsla = p5.Color._getFormattedColor.apply(pInst, vals);
    this._array = color_utils.hslaToRGBA(this.hsla);
  } else {
    throw new Error(pInst._colorMode + ' is an invalid colorMode.');
  }

  this.rgba = [ Math.round(this._array[0] * 255),
                Math.round(this._array[1] * 255),
                Math.round(this._array[2] * 255),
                Math.round(this._array[3] * 255)];
  return this;
};

p5.Color.prototype.getHue = function() {
  // Hue is consistent in both HSL & HSB
  if (this.hsla) {
    return this.hsla[0] * this.maxes[constants.HSL][0];
  } else if (this.hsba) {
    return this.hsba[0] * this.maxes[constants.HSB][0];
  } else {
    this.hsla = color_utils.rgbaToHSLA(this._array);
    return this.hsla[0] * this.maxes[constants.HSL][0];
  }
};

p5.Color.prototype.getSaturation = function() {
  // Saturation exists in both HSB and HSL, but returns different values
  // We are preferring HSL here (because it is a web color space)
  // until the global flag issue can be resolved
  if (this.hsba && this.mode === constants.HSB) {
    return this.hsba[1] * this.maxes[constants.HSB][1];
  } else {
    if( !this.hsla ) {
      this.hsla = color_utils.rgbaToHSLA(this._array);
    }
    return this.hsla[1] * this.maxes[constants.HSL][1];
  }
};

// Brightness only exists as an HSB value
p5.Color.prototype.getBrightness = function() {
  if (this.hsba) {
    return this.hsba[2] * this.maxes[constants.HSB][2];
  } else {
    this.hsba = color_utils.rgbaToHSBA(this._array);
    return this.hsba[2] * this.maxes[constants.HSB][2];
  }
};

// Lightness only exists as an HSL value
p5.Color.prototype.getLightness = function() {
  if (this.hsla) {
    return this.hsla[2] * this.maxes[constants.HSL][2];
  } else {
    this.hsla = color_utils.rgbaToHSLA(this._array);
    return this.hsla[2] * this.maxes[constants.HSL][2];
  }
};

p5.Color.prototype.getRed = function() {
  return this._array[0] * this.maxes[constants.RGB][0];
};

p5.Color.prototype.getGreen = function() {
  return this._array[1] * this.maxes[constants.RGB][1];
};

p5.Color.prototype.getBlue = function() {
  return this._array[2] * this.maxes[constants.RGB][2];
};

p5.Color.prototype.getAlpha = function() {
  return this._array[3] * this.maxes[this.mode][3];
};

p5.Color.prototype.toString = function() {
  var a = this.rgba;
  a[3] = this._array[3];
  return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ a[3] +')';
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

var namedColors = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};

// Regular Expressions for use identifying color pattern strings
var colorPatterns = {
  /**
   * Regular expression for matching colors in format #XXX,
   * e.g. #416
   */
  HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,

  /**
   * Regular expression for matching colors in format #XXXXXX,
   * e.g. #b4d455
   */
  HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

  /**
   * Regular expression for matching colors in format rgb(R, G, B),
   * e.g. rgb(255, 0, 128)
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
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format hsla(H, S%, L%),
   * e.g. hsl(100, 40%, 28.9%)
   */
  HSL: new RegExp([
    '^hsl\\(',
    INTEGER.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format hsla(H, S%, L%, A),
   * e.g. hsla(100, 40%, 28.9%, 0.5)
   */
  HSLA: new RegExp([
    '^hsla\\(',
    INTEGER.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    ',',
    DECIMAL.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format hsb(H, S%, B%),
   * e.g. hsb(100, 40%, 28.9%)
   */
  HSB: new RegExp([
    '^hsb\\(',
    INTEGER.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i'),

  /**
   * Regular expression for matching colors in format hsba(H, S%, B%, A),
   * e.g. hsba(100, 40%, 28.9%, 0.5)
   */
  HSBA: new RegExp([
    '^hsba\\(',
    INTEGER.source,
    ',',
    PERCENT.source,
    ',',
    PERCENT.source,
    ',',
    DECIMAL.source,
    '\\)$'
  ].join(WHITESPACE.source), 'i')
};

/**
 * For a number of different inputs, returns a color formatted as
 * normalized [r, g, b, a], maxes [255, 255, 255, 255]
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
  var numArgs = arguments.length;
  var mode    = this._colorMode;
  var maxArr  = this._colorMaxes[this._colorMode];
  var results = [];

  // Handle [r,g,b,a] or [h,s,l,a] color values
  if (numArgs >= 3) {
    results[0] = arguments[0] / maxArr[0];
    results[1] = arguments[1] / maxArr[1];
    results[2] = arguments[2] / maxArr[2];
    results[3] = typeof arguments[3] === 'number' ?
              arguments[3] / maxArr[3] : 1;
  // Handle strings: named colors, hex values, css strings
  } else if (numArgs === 1 && typeof arguments[0] === 'string') {
    var str = arguments[0].trim().toLowerCase();

    if (namedColors[str]) {
      // Handle named color values
      return p5.Color._getFormattedColor.apply(this, [namedColors[str]]);
    }

    // Work through available string patterns to determine how to proceed
    if (colorPatterns.HEX3.test(str)) {
      results = colorPatterns.HEX3.exec(str).slice(1).map(function(color) {
        // Expand #RGB to #RRGGBB
        return parseInt(color + color, 16) / 255;
      });
      results[3] = 1;
    } else if (colorPatterns.HEX6.test(str)) {
      results = colorPatterns.HEX6.exec(str).slice(1).map(function(color) {
        return parseInt(color, 16) / 255;
      });
      results[3] = 1;
    } else if (colorPatterns.RGB.test(str)) {
      results = colorPatterns.RGB.exec(str).slice(1).map(function(color) {
        return color / 255;
      });
      results[3] = 1;
    } else if (colorPatterns.RGB_PERCENT.test(str)) {
      results = colorPatterns.RGB_PERCENT.exec(str).slice(1)
        .map(function(color) {
          return parseFloat(color) / 100;
        });
      results[3] = 1;
    } else if (colorPatterns.RGBA.test(str)) {
      results = colorPatterns.RGBA.exec(str).slice(1)
        .map(function(color, idx) {
          if (idx === 3) {
            return parseFloat(color);
          }
          return color / 255;
        });
    } else if (colorPatterns.RGBA_PERCENT.test(str)) {
      results = colorPatterns.RGBA_PERCENT.exec(str).slice(1)
        .map(function(color, idx) {
          if (idx === 3) {
            return parseFloat(color);
          }
          return parseFloat(color) / 100;
        });
    }
    // convert RGBA result to correct color space
    if( results.length ){
      if( mode === constants.RGB ){
        return results;
      }
      else if( mode === constants.HSL ){
        return color_utils.rgbaToHSLA(results);
      }
      else if( mode === constants.HSB ){
        return color_utils.rgbaToHSBA(results);
      }
    }

    // test string HSLA format
    if (colorPatterns.HSL.test(str)) {
      results = colorPatterns.HSL.exec(str).slice(1)
        .map(function(color, idx) {
        if( idx === 0 ) {
          return parseInt(color, 10) / 360;
        }
        return parseInt(color, 10) / 100;
      });
      results[3] = 1;
    } else if (colorPatterns.HSLA.test(str)) {
      results = colorPatterns.HSLA.exec(str).slice(1)
        .map(function(color, idx) {
        if( idx === 0 ){
          return parseInt(color, 10) / 360;
        }
        else if( idx === 3 ) {
          return parseFloat(color);
        }
        return parseInt(color, 10) / 100;
      });
    }
    // convert HSLA result to correct color space
    if( results.length ){
      if( mode === constants.RGB ){
        return color_utils.hslaToRGBA(results);
      }
      else if( mode === constants.HSL ){
        return results;
      }
      else if( mode === constants.HSB ){
        return color_utils.hslaToHSBA(results);
      }
    }

    // test string HSBA format
    if (colorPatterns.HSB.test(str)) {
      results = colorPatterns.HSB.exec(str).slice(1)
        .map(function(color, idx) {
        if( idx === 0 ) {
          return parseInt(color, 10) / 360;
        }
        return parseInt(color, 10) / 100;
      });
      results[3] = 1;
    } else if (colorPatterns.HSBA.test(str)) {
      results = colorPatterns.HSBA.exec(str).slice(1)
        .map(function(color, idx) {
        if( idx === 0 ){
          return parseInt(color, 10) / 360;
        }
        else if( idx === 3 ) {
          return parseFloat(color);
        }
        return parseInt(color, 10) / 100;
      });
    }
    // convert HSBA result to correct color space
    if( results.length ){
      if( mode === constants.RGB ){
        return color_utils.hsbaToRGBA(results);
      }
      else if( mode === constants.HSB ){
        return results;
      }
      else if( mode === constants.HSL ){
        return color_utils.hsbaToHSLA(results);
      }
    }

    // Input did not match any CSS Color pattern: Default to white
    results = [1, 1, 1, 1];
  } // Handle greyscale color mode
  else if((numArgs === 1 || numArgs === 2)&& typeof arguments[0] === 'number')
  {
    // When users pass only one argument, they are presumed to be
    // working in grayscale mode.
    if (mode === constants.RGB) {
      results[0] = arguments[0] / maxArr[0];
      results[1] = arguments[0] / maxArr[1];
      results[2] = arguments[0] / maxArr[2];
      results[3] = typeof arguments[1] === 'number' ?
                     arguments[1] / maxArr[3] : 1;
    } else {
      results[0] = arguments[0];
      results[1] = arguments[0];
      results[2] = arguments[0] / maxArr[2];
      results[3] = typeof arguments[1] === 'number' ?
                     arguments[1] / maxArr[3] : 1;
    }
  } else {
    throw new Error (arguments + 'is not a valid color representation.');
  }

  return results;
};

module.exports = p5.Color;
