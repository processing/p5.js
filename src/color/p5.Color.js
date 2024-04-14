/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 * @requires color_conversion
 */

import p5 from '../core/main';
import * as constants from '../core/constants';
import color_conversion from './color_conversion';

/*
 * CSS named colors.
 * @private
 */
const namedColors = {
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
  rebeccapurple: '#663399',
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

/*
 * These regular expressions are used to build up the patterns for matching
 * viable CSS color strings: fragmenting the regexes in this way increases the
 * legibility and comprehensibility of the code.
 *
 * Note that RGB values of .9 are not parsed by IE, but are supported here for
 * color string consistency.
 */
const WHITESPACE = /\s*/; // Match zero or more whitespace characters.
const INTEGER = /(\d{1,3})/; // Match integers: 79, 255, etc.
const DECIMAL = /((?:\d+(?:\.\d+)?)|(?:\.\d+))/; // Match 129.6, 79, .9, etc.
const PERCENT = new RegExp(`${DECIMAL.source}%`); // Match 12.9%, 79%, .9%, etc.

/*
 * Full color string patterns. The capture groups are necessary.
 * @private
 */
const colorPatterns = {
  // Match colors in format #XXX, e.g. #416.
  HEX3: /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,

  // Match colors in format #XXXX, e.g. #5123.
  HEX4: /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,

  // Match colors in format #XXXXXX, e.g. #b4d455.
  HEX6: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

  // Match colors in format #XXXXXXXX, e.g. #b4d45535.
  HEX8: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,

  // Match colors in format rgb(R, G, B), e.g. rgb(255, 0, 128).
  RGB: new RegExp(
    [
      '^rgb\\(',
      INTEGER.source,
      ',',
      INTEGER.source,
      ',',
      INTEGER.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  ),

  // Match colors in format rgb(R%, G%, B%), e.g. rgb(100%, 0%, 28.9%).
  RGB_PERCENT: new RegExp(
    [
      '^rgb\\(',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  ),

  // Match colors in format rgb(R, G, B, A), e.g. rgb(255, 0, 128, 0.25).
  RGBA: new RegExp(
    [
      '^rgba\\(',
      INTEGER.source,
      ',',
      INTEGER.source,
      ',',
      INTEGER.source,
      ',',
      DECIMAL.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  ),

  // Match colors in format rgb(R%, G%, B%, A), e.g. rgb(100%, 0%, 28.9%, 0.5).
  RGBA_PERCENT: new RegExp(
    [
      '^rgba\\(',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      DECIMAL.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  ),

  // Match colors in format hsla(H, S%, L%), e.g. hsl(100, 40%, 28.9%).
  HSL: new RegExp(
    [
      '^hsl\\(',
      INTEGER.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  ),

  // Match colors in format hsla(H, S%, L%, A), e.g. hsla(100, 40%, 28.9%, 0.5).
  HSLA: new RegExp(
    [
      '^hsla\\(',
      INTEGER.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      DECIMAL.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  ),

  // Match colors in format hsb(H, S%, B%), e.g. hsb(100, 40%, 28.9%).
  HSB: new RegExp(
    [
      '^hsb\\(',
      INTEGER.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  ),

  // Match colors in format hsba(H, S%, B%, A), e.g. hsba(100, 40%, 28.9%, 0.5).
  HSBA: new RegExp(
    [
      '^hsba\\(',
      INTEGER.source,
      ',',
      PERCENT.source,
      ',',
      PERCENT.source,
      ',',
      DECIMAL.source,
      '\\)$'
    ].join(WHITESPACE.source),
    'i'
  )
};

/**
 * A class to describe a color. Each `p5.Color` object stores the color mode
 * and level maxes that were active during its construction. These values are
 * used to interpret the arguments passed to the object's constructor. They
 * also determine output formatting such as when
 * <a href="#/p5/saturation">saturation()</a> is called.
 *
 * Color is stored internally as an array of ideal RGBA values in floating
 * point form, normalized from 0 to 1. These values are used to calculate the
 * closest screen colors, which are RGBA levels from 0 to 255. Screen colors
 * are sent to the renderer.
 *
 * When different color representations are calculated, the results are cached
 * for performance. These values are normalized, floating-point numbers.
 *
 * <a href="#/p5/color">color()</a> is the recommended way to create an instance
 * of this class.
 *
 * @class p5.Color
 * @param {p5} [pInst]                      pointer to p5 instance.
 *
 * @param {Number[]|String} vals            an array containing the color values
 *                                          for red, green, blue and alpha channel
 *                                          or CSS color.
 */
p5.Color = class Color {
  constructor(pInst, vals) {
    // Record color mode and maxes at time of construction.
    this._storeModeAndMaxes(pInst._colorMode, pInst._colorMaxes);

    // Calculate normalized RGBA values.
    if (![constants.RGB, constants.HSL, constants.HSB].includes(this.mode)) {
      throw new Error(`${this.mode} is an invalid colorMode.`);
    } else {
      this._array = Color._parseInputs.apply(this, vals);
    }

    // Expose closest screen color.
    this._calculateLevels();
  }

  /**
   * Returns the color formatted as a string. Doing so can be useful for
   * debugging, or for using p5.js with other libraries.
   *
   * @param {String} [format] how the color string will be formatted.
   * Leaving this empty formats the string as rgba(r, g, b, a).
   * '#rgb' '#rgba' '#rrggbb' and '#rrggbbaa' format as hexadecimal color codes.
   * 'rgb' 'hsb' and 'hsl' return the color formatted in the specified color mode.
   * 'rgba' 'hsba' and 'hsla' are the same as above but with alpha channels.
   * 'rgb%' 'hsb%' 'hsl%' 'rgba%' 'hsba%' and 'hsla%' format as percentages.
   * @return {String} the formatted string.
   *
   * @example
   * <div>
   * <code>
   * createCanvas(200, 100);
   * stroke(255);
   * const myColor = color(100, 100, 250);
   * fill(myColor);
   * rotate(HALF_PI);
   * text(myColor.toString(), 0, -5);
   * text(myColor.toString('#rrggbb'), 0, -30);
   * text(myColor.toString('rgba%'), 0, -55);
   * describe('Three text representation of a color written sideways.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * const myColor = color(100, 130, 250);
   * text(myColor.toString('#rrggbb'), 25, 25);
   * describe('A hexadecimal representation of a color.');
   * </code>
   * </div>
   */
  toString(format) {
    const a = this.levels;
    const f = this._array;
    const alpha = f[3]; // String representation uses normalized alpha

    switch (format) {
      case '#rrggbb':
        return '#'.concat(
          a[0] < 16 ? '0'.concat(a[0].toString(16)) : a[0].toString(16),
          a[1] < 16 ? '0'.concat(a[1].toString(16)) : a[1].toString(16),
          a[2] < 16 ? '0'.concat(a[2].toString(16)) : a[2].toString(16)
        );

      case '#rrggbbaa':
        return '#'.concat(
          a[0] < 16 ? '0'.concat(a[0].toString(16)) : a[0].toString(16),
          a[1] < 16 ? '0'.concat(a[1].toString(16)) : a[1].toString(16),
          a[2] < 16 ? '0'.concat(a[2].toString(16)) : a[2].toString(16),
          a[3] < 16 ? '0'.concat(a[3].toString(16)) : a[3].toString(16)
        );

      case '#rgb':
        return '#'.concat(
          Math.round(f[0] * 15).toString(16),
          Math.round(f[1] * 15).toString(16),
          Math.round(f[2] * 15).toString(16)
        );

      case '#rgba':
        return '#'.concat(
          Math.round(f[0] * 15).toString(16),
          Math.round(f[1] * 15).toString(16),
          Math.round(f[2] * 15).toString(16),
          Math.round(f[3] * 15).toString(16)
        );

      case 'rgb':
        return 'rgb('.concat(a[0], ', ', a[1], ', ', a[2], ')');

      case 'rgb%':
        return 'rgb('.concat(
          (100 * f[0]).toPrecision(3),
          '%, ',
          (100 * f[1]).toPrecision(3),
          '%, ',
          (100 * f[2]).toPrecision(3),
          '%)'
        );

      case 'rgba%':
        return 'rgba('.concat(
          (100 * f[0]).toPrecision(3),
          '%, ',
          (100 * f[1]).toPrecision(3),
          '%, ',
          (100 * f[2]).toPrecision(3),
          '%, ',
          (100 * f[3]).toPrecision(3),
          '%)'
        );

      case 'hsb':
      case 'hsv':
        if (!this.hsba) this.hsba = color_conversion._rgbaToHSBA(this._array);
        return 'hsb('.concat(
          this.hsba[0] * this.maxes[constants.HSB][0],
          ', ',
          this.hsba[1] * this.maxes[constants.HSB][1],
          ', ',
          this.hsba[2] * this.maxes[constants.HSB][2],
          ')'
        );

      case 'hsb%':
      case 'hsv%':
        if (!this.hsba) this.hsba = color_conversion._rgbaToHSBA(this._array);
        return 'hsb('.concat(
          (100 * this.hsba[0]).toPrecision(3),
          '%, ',
          (100 * this.hsba[1]).toPrecision(3),
          '%, ',
          (100 * this.hsba[2]).toPrecision(3),
          '%)'
        );

      case 'hsba':
      case 'hsva':
        if (!this.hsba) this.hsba = color_conversion._rgbaToHSBA(this._array);
        return 'hsba('.concat(
          this.hsba[0] * this.maxes[constants.HSB][0],
          ', ',
          this.hsba[1] * this.maxes[constants.HSB][1],
          ', ',
          this.hsba[2] * this.maxes[constants.HSB][2],
          ', ',
          alpha,
          ')'
        );

      case 'hsba%':
      case 'hsva%':
        if (!this.hsba) this.hsba = color_conversion._rgbaToHSBA(this._array);
        return 'hsba('.concat(
          (100 * this.hsba[0]).toPrecision(3),
          '%, ',
          (100 * this.hsba[1]).toPrecision(3),
          '%, ',
          (100 * this.hsba[2]).toPrecision(3),
          '%, ',
          (100 * alpha).toPrecision(3),
          '%)'
        );

      case 'hsl':
        if (!this.hsla) this.hsla = color_conversion._rgbaToHSLA(this._array);
        return 'hsl('.concat(
          this.hsla[0] * this.maxes[constants.HSL][0],
          ', ',
          this.hsla[1] * this.maxes[constants.HSL][1],
          ', ',
          this.hsla[2] * this.maxes[constants.HSL][2],
          ')'
        );

      case 'hsl%':
        if (!this.hsla) this.hsla = color_conversion._rgbaToHSLA(this._array);
        return 'hsl('.concat(
          (100 * this.hsla[0]).toPrecision(3),
          '%, ',
          (100 * this.hsla[1]).toPrecision(3),
          '%, ',
          (100 * this.hsla[2]).toPrecision(3),
          '%)'
        );

      case 'hsla':
        if (!this.hsla) this.hsla = color_conversion._rgbaToHSLA(this._array);
        return 'hsla('.concat(
          this.hsla[0] * this.maxes[constants.HSL][0],
          ', ',
          this.hsla[1] * this.maxes[constants.HSL][1],
          ', ',
          this.hsla[2] * this.maxes[constants.HSL][2],
          ', ',
          alpha,
          ')'
        );

      case 'hsla%':
        if (!this.hsla) this.hsla = color_conversion._rgbaToHSLA(this._array);
        return 'hsl('.concat(
          (100 * this.hsla[0]).toPrecision(3),
          '%, ',
          (100 * this.hsla[1]).toPrecision(3),
          '%, ',
          (100 * this.hsla[2]).toPrecision(3),
          '%, ',
          (100 * alpha).toPrecision(3),
          '%)'
        );

      case 'rgba':
      default:
        return 'rgba('.concat(a[0], ',', a[1], ',', a[2], ',', alpha, ')');
    }
  }

  /**
   * Sets the red component of a color. The range depends on the
   * <a href="#/colorMode">colorMode()</a>. In the default RGB mode it's
   * between 0 and 255.
   *
   * @param {Number} red the new red value.
   *
   * @example
   * <div>
   * <code>
   * let backgroundColor;
   *
   * function setup() {
   *   backgroundColor = color(100, 50, 150);
   * }
   *
   * function draw() {
   *   backgroundColor.setRed(128 + 128 * sin(millis() / 1000));
   *   background(backgroundColor);
   *   describe('A canvas with a gradually changing background color.');
   * }
   * </code>
   * </div>
   */
  setRed(new_red) {
    this._array[0] = new_red / this.maxes[constants.RGB][0];
    this._calculateLevels();
  }

  /**
   * Sets the green component of a color. The range depends on the
   * <a href="#/colorMode">colorMode()</a>. In the default RGB mode it's
   * between 0 and 255.
   *
   * @param {Number} green the new green value.
   *
   * @example
   * <div>
   * <code>
   * let backgroundColor;
   *
   * function setup() {
   *   backgroundColor = color(100, 50, 150);
   * }
   *
   * function draw() {
   *   backgroundColor.setGreen(128 + 128 * sin(millis() / 1000));
   *   background(backgroundColor);
   *   describe('A canvas with a gradually changing background color.');
   * }
   * </code>
   * </div>
   **/
  setGreen(new_green) {
    this._array[1] = new_green / this.maxes[constants.RGB][1];
    this._calculateLevels();
  }

  /**
   * Sets the blue component of a color. The range depends on the
   * <a href="#/colorMode">colorMode()</a>. In the default RGB mode it's
   * between 0 and 255.
   *
   * @param {Number} blue the new blue value.
   *
   * @example
   * <div>
   * <code>
   * let backgroundColor;
   *
   * function setup() {
   *   backgroundColor = color(100, 50, 150);
   * }
   *
   * function draw() {
   *   backgroundColor.setBlue(128 + 128 * sin(millis() / 1000));
   *   background(backgroundColor);
   *   describe('A canvas with a gradually changing background color.');
   * }
   * </code>
   * </div>
   **/
  setBlue(new_blue) {
    this._array[2] = new_blue / this.maxes[constants.RGB][2];
    this._calculateLevels();
  }

  /**
   * Sets the alpha (transparency) value of a color. The range depends on the
   * <a href="#/colorMode">colorMode()</a>. In the default RGB mode it's
   * between 0 and 255.
   *
   * @param {Number} alpha the new alpha value.
   *
   * @example
   * <div>
   * <code>
   * function draw() {
   *   clear();
   *   background(200);
   *   const squareColor = color(100, 50, 100);
   *   squareColor.setAlpha(128 + 128 * sin(millis() / 1000));
   *   fill(squareColor);
   *   rect(13, 13, width - 26, height - 26);
   *   describe(
   *     'A purple square with gradually changing opacity drawn on a gray background.'
   *   );
   * }
   * </code>
   * </div>
   **/
  setAlpha(new_alpha) {
    this._array[3] = new_alpha / this.maxes[this.mode][3];
    this._calculateLevels();
  }

  // calculates and stores the closest screen levels
  _calculateLevels() {
    const array = this._array;
    // (loop backwards for performance)
    const levels = (this.levels = new Array(array.length));
    for (let i = array.length - 1; i >= 0; --i) {
      levels[i] = Math.round(array[i] * 255);
    }

    // Clear cached HSL/HSB values
    this.hsla = null;
    this.hsba = null;
  }

  _getAlpha() {
    return this._array[3] * this.maxes[this.mode][3];
  }

  // stores the color mode and maxes in this instance of Color
  // for later use (by _parseInputs())
  _storeModeAndMaxes(new_mode, new_maxes) {
    this.mode = new_mode;
    this.maxes = new_maxes;
  }

  _getMode() {
    return this.mode;
  }

  _getMaxes() {
    return this.maxes;
  }

  _getBlue() {
    return this._array[2] * this.maxes[constants.RGB][2];
  }

  _getBrightness() {
    if (!this.hsba) {
      this.hsba = color_conversion._rgbaToHSBA(this._array);
    }
    return this.hsba[2] * this.maxes[constants.HSB][2];
  }

  _getGreen() {
    return this._array[1] * this.maxes[constants.RGB][1];
  }

  /**
   * Hue is the same in HSB and HSL, but the maximum value may be different.
   * This function will return the HSB-normalized saturation when supplied with
   * an HSB color object, but will default to the HSL-normalized saturation
   * otherwise.
   */
  _getHue() {
    if (this.mode === constants.HSB) {
      if (!this.hsba) {
        this.hsba = color_conversion._rgbaToHSBA(this._array);
      }
      return this.hsba[0] * this.maxes[constants.HSB][0];
    } else {
      if (!this.hsla) {
        this.hsla = color_conversion._rgbaToHSLA(this._array);
      }
      return this.hsla[0] * this.maxes[constants.HSL][0];
    }
  }

  _getLightness() {
    if (!this.hsla) {
      this.hsla = color_conversion._rgbaToHSLA(this._array);
    }
    return this.hsla[2] * this.maxes[constants.HSL][2];
  }

  _getRed() {
    return this._array[0] * this.maxes[constants.RGB][0];
  }

  /**
   * Saturation is scaled differently in HSB and HSL. This function will return
   * the HSB saturation when supplied with an HSB color object, but will default
   * to the HSL saturation otherwise.
   */
  _getSaturation() {
    if (this.mode === constants.HSB) {
      if (!this.hsba) {
        this.hsba = color_conversion._rgbaToHSBA(this._array);
      }
      return this.hsba[1] * this.maxes[constants.HSB][1];
    } else {
      if (!this.hsla) {
        this.hsla = color_conversion._rgbaToHSLA(this._array);
      }
      return this.hsla[1] * this.maxes[constants.HSL][1];
    }
  }
  /**
 * For a number of different inputs, returns a color formatted as [r, g, b, a]
 * arrays, with each component normalized between 0 and 1.
 *
 * @private
 * @param {Array} [...args] An 'array-like' object that represents a list of
 *                          arguments
 * @return {Number[]}       a color formatted as [r, g, b, a]
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
 * //
 * // describe('');
 * </code>
 * </div>
 */
  static _parseInputs(r, g, b, a) {
    const numArgs = arguments.length;
    const mode = this.mode;
    const maxes = this.maxes[mode];
    let results = [];
    let i;

    if (numArgs >= 3) {
      // Argument is a list of component values.

      results[0] = r / maxes[0];
      results[1] = g / maxes[1];
      results[2] = b / maxes[2];

      // Alpha may be undefined, so default it to 100%.
      if (typeof a === 'number') {
        results[3] = a / maxes[3];
      } else {
        results[3] = 1;
      }

      // Constrain components to the range [0,1].
      // (loop backwards for performance)
      for (i = results.length - 1; i >= 0; --i) {
        const result = results[i];
        if (result < 0) {
          results[i] = 0;
        } else if (result > 1) {
          results[i] = 1;
        }
      }

      // Convert to RGBA and return.
      if (mode === constants.HSL) {
        return color_conversion._hslaToRGBA(results);
      } else if (mode === constants.HSB) {
        return color_conversion._hsbaToRGBA(results);
      } else {
        return results;
      }
    } else if (numArgs === 1 && typeof r === 'string') {
      const str = r.trim().toLowerCase();

      // Return if string is a named colour.
      if (namedColors[str]) {
        return Color._parseInputs.call(this, namedColors[str]);
      }

      // Try RGBA pattern matching.
      if (colorPatterns.HEX3.test(str)) {
        // #rgb
        results = colorPatterns.HEX3.exec(str)
          .slice(1)
          .map(color => parseInt(color + color, 16) / 255);
        results[3] = 1;
        return results;
      } else if (colorPatterns.HEX6.test(str)) {
        // #rrggbb
        results = colorPatterns.HEX6.exec(str)
          .slice(1)
          .map(color => parseInt(color, 16) / 255);
        results[3] = 1;
        return results;
      } else if (colorPatterns.HEX4.test(str)) {
        // #rgba
        results = colorPatterns.HEX4.exec(str)
          .slice(1)
          .map(color => parseInt(color + color, 16) / 255);
        return results;
      } else if (colorPatterns.HEX8.test(str)) {
        // #rrggbbaa
        results = colorPatterns.HEX8.exec(str)
          .slice(1)
          .map(color => parseInt(color, 16) / 255);
        return results;
      } else if (colorPatterns.RGB.test(str)) {
        // rgb(R,G,B)
        results = colorPatterns.RGB.exec(str)
          .slice(1)
          .map(color => color / 255);
        results[3] = 1;
        return results;
      } else if (colorPatterns.RGB_PERCENT.test(str)) {
        // rgb(R%,G%,B%)
        results = colorPatterns.RGB_PERCENT.exec(str)
          .slice(1)
          .map(color => parseFloat(color) / 100);
        results[3] = 1;
        return results;
      } else if (colorPatterns.RGBA.test(str)) {
        // rgba(R,G,B,A)
        results = colorPatterns.RGBA.exec(str)
          .slice(1)
          .map((color, idx) => {
            if (idx === 3) {
              return parseFloat(color);
            }
            return color / 255;
          });
        return results;
      } else if (colorPatterns.RGBA_PERCENT.test(str)) {
        // rgba(R%,G%,B%,A%)
        results = colorPatterns.RGBA_PERCENT.exec(str)
          .slice(1)
          .map((color, idx) => {
            if (idx === 3) {
              return parseFloat(color);
            }
            return parseFloat(color) / 100;
          });
        return results;
      }

      // Try HSLA pattern matching.
      if (colorPatterns.HSL.test(str)) {
        // hsl(H,S,L)
        results = colorPatterns.HSL.exec(str)
          .slice(1)
          .map((color, idx) => {
            if (idx === 0) {
              return parseInt(color, 10) / 360;
            }
            return parseInt(color, 10) / 100;
          });
        results[3] = 1;
      } else if (colorPatterns.HSLA.test(str)) {
        // hsla(H,S,L,A)
        results = colorPatterns.HSLA.exec(str)
          .slice(1)
          .map((color, idx) => {
            if (idx === 0) {
              return parseInt(color, 10) / 360;
            } else if (idx === 3) {
              return parseFloat(color);
            }
            return parseInt(color, 10) / 100;
          });
      }
      results = results.map(value => Math.max(Math.min(value, 1), 0));
      if (results.length) {
        return color_conversion._hslaToRGBA(results);
      }

      // Try HSBA pattern matching.
      if (colorPatterns.HSB.test(str)) {
        // hsb(H,S,B)
        results = colorPatterns.HSB.exec(str)
          .slice(1)
          .map((color, idx) => {
            if (idx === 0) {
              return parseInt(color, 10) / 360;
            }
            return parseInt(color, 10) / 100;
          });
        results[3] = 1;
      } else if (colorPatterns.HSBA.test(str)) {
        // hsba(H,S,B,A)
        results = colorPatterns.HSBA.exec(str)
          .slice(1)
          .map((color, idx) => {
            if (idx === 0) {
              return parseInt(color, 10) / 360;
            } else if (idx === 3) {
              return parseFloat(color);
            }
            return parseInt(color, 10) / 100;
          });
      }

      if (results.length) {
        // (loop backwards for performance)
        for (i = results.length - 1; i >= 0; --i) {
          results[i] = Math.max(Math.min(results[i], 1), 0);
        }

        return color_conversion._hsbaToRGBA(results);
      }

      // Input did not match any CSS color pattern: default to white.
      results = [1, 1, 1, 1];
    } else if ((numArgs === 1 || numArgs === 2) && typeof r === 'number') {
      // 'Grayscale' mode.

      /**
       * For HSB and HSL, interpret the gray level as a brightness/lightness
       * value (they are equivalent when chroma is zero). For RGB, normalize the
       * gray level according to the blue maximum.
       */
      results[0] = r / maxes[2];
      results[1] = r / maxes[2];
      results[2] = r / maxes[2];

      // Alpha may be undefined, so default it to 100%.
      if (typeof g === 'number') {
        results[3] = g / maxes[3];
      } else {
        results[3] = 1;
      }

      // Constrain components to the range [0,1].
      results = results.map(value => Math.max(Math.min(value, 1), 0));
    } else {
      throw new Error(`${arguments}is not a valid color representation.`);
    }

    return results;
  }
};

export default p5.Color;
