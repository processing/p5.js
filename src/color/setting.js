/**
 * @module Color
 * @submodule Setting
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');
require('./p5.Color');

p5.prototype._doStroke = true;
p5.prototype._doFill = true;
p5.prototype._strokeSet = false;
p5.prototype._fillSet = false;
p5.prototype._colorMode = constants.RGB;
p5.prototype._colorMaxes = {
  rgb: [255, 255, 255, 255],
  hsb: [360, 100, 100, 1],
  hsl: [360, 100, 100, 1]
};

/**
 * The background() function sets the color used for the background of the
 * p5.js canvas. The default background is light gray. This function is
 * typically used within draw() to clear the display window at the beginning
 * of each frame, but it can be used inside setup() to set the background on
 * the first frame of animation or if the background need only be set once.
 *
 * @method background
 * @param {Number|String|p5.Color|p5.Image} v1   gray value, red or hue value
 *                                               (depending on the current
 *                                               color mode), color string,
 *                                               p5.Color, or p5.Image
 * @param {Number}                          [v2] green or saturation value
 *                                               (depending on the current
 *                                               color mode)
 * @param {Number}                          [v3] blue or brightness value
 *                                               (depending on the current
 *                                               color mode)
 * @param {Number}                          [a]  opacity of the background
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value
 * background(51);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values
 * background(255, 204, 0);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values
 * colorMode(HSB);
 * background(255, 204, 100);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Named SVG/CSS color string
 * background('red');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // three-digit hexadecimal RGB notation
 * background('#fae');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // six-digit hexadecimal RGB notation
 * background('#222222');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGB notation
 * background('rgb(0,255,0)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGBA notation
 * background('rgba(0,255,0, 0.25)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGB notation
 * background('rgb(100%,0%,10%)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGBA notation
 * background('rgba(100%,0%,100%,0.5)');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object
 * background(color(0, 0, 255));
 * </code>
 * </div>
 */
p5.prototype.background = function() {
  if (arguments[0] instanceof p5.Image) {
    this.image(arguments[0], 0, 0, this.width, this.height);
  } else {
    this._graphics.background.apply(this._graphics, arguments);
  }
  return this;
};

/**
 * Clears the pixels within a buffer. This function only works on p5.Canvas
 * objects created with the createCanvas() function; it won't work with the
 * main display window. Unlike the main graphics context, pixels in
 * additional graphics areas created with createGraphics() can be entirely
 * or partially transparent. This function clears everything to make all of
 * the pixels 100% transparent.
 *
 * @method clear
 * @example
 * <div>
 * <code>
 * </code>
 * </div>
 */
p5.prototype.clear = function() {
  this._graphics.clear();
  return this;
};

/**
 * Changes the way p5.js interprets color data. By default, the parameters
 * for fill(), stroke(), background(), and color() are defined by values
 * between 0 and 255 using the RGB color model. The colorMode() function is
 * used to switch color systems. Regardless of color system, all value ranges
 * are presumed to be 0–255 unless explicitly set otherwise. That is,
 * for a standard HSB range, one would pass colorMode(HSB, 360, 100, 100, 1).
 *
 * @method colorMode
 * @param {Number|Constant} mode either RGB or HSB, corresponding to
 *                               Red/Green/Blue and Hue/Saturation/Brightness
 * @param {Number|Constant} max1 range for the red or hue depending on the
 *                               current color mode, or range for all values
 * @param {Number|Constant} max2 range for the green or saturation depending
 *                               on the current color mode
 * @param {Number|Constant} max3 range for the blue or brightness depending
 *                               on the current color mode
 * @param {Number|Constant} maxA range for the alpha
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(RGB, 100);
 * for (i = 0; i < 100; i++) {
 *   for (j = 0; j < 100; j++) {
 *     stroke(i, j, 0);
 *     point(i, j);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 100);
 * for (i = 0; i < 100; i++) {
 *   for (j = 0; j < 100; j++) {
 *     stroke(i, j, 100);
 *     point(i, j);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.colorMode = function() {
  if (arguments[0] === constants.RGB ||
      arguments[0] === constants.HSB ||
      arguments[0] === constants.HSL) {
    this._colorMode = arguments[0];

    var maxArr = this._colorMaxes[this._colorMode];

    if (arguments.length === 2) {
      maxArr[0] = arguments[1];
      maxArr[1] = arguments[1];
      maxArr[2] = arguments[1];
      maxArr[3] = arguments[1];
    } else if (arguments.length > 2) {
      maxArr[0] = arguments[1];
      maxArr[1] = arguments[2];
      maxArr[2] = arguments[3];
    }
    if (arguments.length === 5) {
      maxArr[3] = arguments[4];
    }
  }
  return this;
};

/**
 * Sets the color used to fill shapes. For example, if you run
 * fill(204, 102, 0), all subsequent shapes will be filled with orange. This
 * color is either specified in terms of the RGB or HSB color depending on
 * the current colorMode(). (The default color space is RGB, with each value
 * in the range from 0 to 255.) If a single string argument is provided, RGB,
 * RGBA and Hex CSS color strings and all named color strings are supported.
 * A p5 Color object can also be provided to set the fill color.
 *
 * @method fill
 * @param {Number|Array|String|p5.Color} v1   gray value, red or hue value
 *                                            (depending on the current color
 *                                            mode), or color Array, or CSS
 *                                            color string
 * @param {Number}                       [v2] green or saturation value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [v3] blue or brightness value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [a]  opacity of the background
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value
 * fill(51);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values
 * fill(255, 204, 0);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values
 * colorMode(HSB);
 * fill(255, 204, 100);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Named SVG/CSS color string
 * fill('red');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // three-digit hexadecimal RGB notation
 * fill('#fae');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // six-digit hexadecimal RGB notation
 * fill('#222222');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGB notation
 * fill('rgb(0,255,0)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGBA notation
 * fill('rgba(0,255,0, 0.25)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGB notation
 * fill('rgb(100%,0%,10%)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGBA notation
 * fill('rgba(100%,0%,100%,0.5)');
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object
 * fill(color(0, 0, 255));
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.fill = function() {
  this._setProperty('_fillSet', true);
  this._setProperty('_doFill', true);
  this._graphics.fill.apply(this._graphics, arguments);
  return this;
};

/**
 * Disables filling geometry. If both noStroke() and noFill() are called,
 * nothing will be drawn to the screen.
 *
 * @method noFill
 * @example
 * <div>
 * <code>
 * rect(15, 10, 55, 55);
 * noFill();
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.noFill = function() {
  this._setProperty('_doFill', false);
  return this;
};

/**
 * Disables drawing the stroke (outline). If both noStroke() and noFill()
 * are called, nothing will be drawn to the screen.
 *
 * @method noStroke
 * @example
 * <div>
 * <code>
 * noStroke();
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.noStroke = function() {
  this._setProperty('_doStroke', false);
  return this;
};

/**
 * Sets the color used to draw lines and borders around shapes. This color
 * is either specified in terms of the RGB or HSB color depending on the
 * current colorMode() (the default color space is RGB, with each value in
 * the range from 0 to 255). If a single string argument is provided, RGB,
 * RGBA and Hex CSS color strings and all named color strings are supported.
 * A p5 Color object can also be provided to set the stroke color.
 *
 * @method stroke
 * @param {Number|Array|String|p5.Color} v1   gray value, red or hue value
 *                                            (depending on the current color
 *                                            mode), or color Array, or CSS
 *                                            color string
 * @param {Number}                       [v2] green or saturation value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [v3] blue or brightness value
 *                                            (depending on the current
 *                                            color mode)
 * @param {Number}                       [a]  opacity of the background
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value
 * strokeWeight(4);
 * stroke(51);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values
 * stroke(255, 204, 0);
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values
 * colorMode(HSB);
 * strokeWeight(4);
 * stroke(255, 204, 100);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Named SVG/CSS color string
 * stroke('red');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // three-digit hexadecimal RGB notation
 * stroke('#fae');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // six-digit hexadecimal RGB notation
 * stroke('#222222');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGB notation
 * stroke('rgb(0,255,0)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // integer RGBA notation
 * stroke('rgba(0,255,0,0.25)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGB notation
 * stroke('rgb(100%,0%,10%)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // percentage RGBA notation
 * stroke('rgba(100%,0%,100%,0.5)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object
 * stroke(color(0, 0, 255));
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 */
p5.prototype.stroke = function() {
  this._setProperty('_strokeSet', true);
  this._setProperty('_doStroke', true);
  this._graphics.stroke.apply(this._graphics, arguments);
  return this;
};



module.exports = p5;
