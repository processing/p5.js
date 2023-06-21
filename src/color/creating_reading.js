/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../core/main';
import * as constants from '../core/constants';
import './p5.Color';
import '../core/friendly_errors/validate_params';
import '../core/friendly_errors/file_errors';
import '../core/friendly_errors/fes_core';

/**
 * Extracts the alpha (transparency) value from a
 * <a href="#/p5.Color">p5.Color</a> object, array of color components, or
 * CSS color string.
 *
 * @method alpha
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the alpha value.
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 * const c = color(0, 126, 255, 102);
 * fill(c);
 * rect(15, 15, 35, 70);
 * // Sets 'alphaValue' to 102.
 * const alphaValue = alpha(c);
 * fill(alphaValue);
 * rect(50, 15, 35, 70);
 * describe('Two rectangles. The left one is light blue and the right one is charcoal gray.');
 * </code>
 * </div>
 */
p5.prototype.alpha = function(c) {
  p5._validateParameters('alpha', arguments);
  return this.color(c)._getAlpha();
};

/**
 * Extracts the blue value from a <a href="#/p5.Color">p5.Color</a> object,
 * array of color components, or CSS color string.
 *
 * @method blue
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the blue value.
 * @example
 * <div>
 * <code>
 * const c = color(175, 100, 220);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'blueValue' to 220.
 * const blueValue = blue(c);
 * fill(0, 0, blueValue);
 * rect(50, 20, 35, 60);
 * describe('Two rectangles. The left one is light purple and the right one is royal blue.');
 * </code>
 * </div>
 *
 */
p5.prototype.blue = function(c) {
  p5._validateParameters('blue', arguments);
  return this.color(c)._getBlue();
};

/**
 * Extracts the HSB brightness value from a
 * <a href="#/p5.Color">p5.Color</a> object, array of color components, or
 * CSS color string.
 *
 * @method brightness
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the brightness value.
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * const c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'brightValue' to 255.
 * const brightValue = brightness(c);
 * fill(brightValue);
 * rect(50, 20, 35, 60);
 * describe('Two rectangles. The left one is salmon pink and the right one is white.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * const c = color('hsb(60, 100%, 50%)');
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'brightValue' to 127.5 (50% of 255)
 * const brightValue = brightness(c);
 * fill(brightValue);
 * rect(50, 20, 35, 60);
 * describe('Two rectangles. The left one is olive and the right one is gray.');
 * </code>
 * </div>
 */
p5.prototype.brightness = function(c) {
  p5._validateParameters('brightness', arguments);
  return this.color(c)._getBrightness();
};

/**
 * Creates a <a href="#/p5/p5.Color">p5.Color</a> object. By default, the
 * parameters are interpreted as RGB values. Calling `color(255, 204, 0)` will
 * return a bright yellow color. The way these parameters are interpreted may
 * be changed with the <a href="#/p5/colorMode">colorMode()</a> function.
 *
 * The version of `color()` with one parameter interprets the value one of two
 * ways. If the parameter is a number, it's interpreted as a grayscale value.
 * If the parameter is a string, it's interpreted as a CSS color string.
 *
 * The version of `color()` with two parameters interprets the first one as a
 * grayscale value. The second parameter sets the alpha (transparency) value.
 *
 * The version of `color()` with three parameters interprets them as RGB, HSB,
 * or HSL colors, depending on the current `colorMode()`.
 *
 * The version of `color()` with four parameters interprets them as RGBA, HSBA,
 * or HSLA colors, depending on the current `colorMode()`. The last parameter
 * sets the alpha (transparency) value.
 *
 * @method color
 * @param  {Number} gray number specifying value between white and black.
 * @param  {Number} [alpha] alpha value relative to current color range
 *                                 (default is 0-255).
 * @return {p5.Color} resulting color.
 *
 * @example
 * <div>
 * <code>
 * const c = color(255, 204, 0);
 * fill(c);
 * noStroke();
 * rect(30, 20, 55, 55);
 * describe('A yellow rectangle on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // RGB values.
 * let c = color(255, 204, 0);
 * fill(c);
 * noStroke();
 * circle(25, 25, 80);
 * // A grayscale value.
 * c = color(65);
 * fill(c);
 * circle(75, 75, 80);
 * describe(
 *   'Two ellipses. The circle in the top-left corner is yellow and the one at the bottom-right is gray.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // A CSS named color.
 * const c = color('magenta');
 * fill(c);
 * noStroke();
 * square(20, 20, 60);
 * describe('A magenta square on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // CSS hex color codes.
 * noStroke();
 * let c = color('#0f0');
 * fill(c);
 * rect(0, 10, 45, 80);
 * c = color('#00ff00');
 * fill(c);
 * rect(55, 10, 45, 80);
 * describe('Two bright green rectangles on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // RGB and RGBA color strings.
 * noStroke();
 * let c = color('rgb(0,0,255)');
 * fill(c);
 * square(10, 10, 35);
 * c = color('rgb(0%, 0%, 100%)');
 * fill(c);
 * square(55, 10, 35);
 * c = color('rgba(0, 0, 255, 1)');
 * fill(c);
 * square(10, 55, 35);
 * c = color('rgba(0%, 0%, 100%, 1)');
 * fill(c);
 * square(55, 55, 35);
 * describe('Four blue squares in corners of a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // HSL and HSLA color strings.
 * let c = color('hsl(160, 100%, 50%)');
 * noStroke();
 * fill(c);
 * rect(0, 10, 45, 80);
 * c = color('hsla(160, 100%, 50%, 0.5)');
 * fill(c);
 * rect(55, 10, 45, 80);
 * describe('Two sea green rectangles. A darker rectangle on the left and a brighter one on the right.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // HSB and HSBA color strings.
 * let c = color('hsb(160, 100%, 50%)');
 * noStroke();
 * fill(c);
 * rect(0, 10, 45, 80);
 * c = color('hsba(160, 100%, 50%, 0.5)');
 * fill(c);
 * rect(55, 10, 45, 80);
 * describe('Two green rectangles. A darker rectangle on the left and a brighter one on the right.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Changing color modes.
 * noStroke();
 * let c = color(50, 55, 100);
 * fill(c);
 * rect(0, 10, 45, 80);
 * colorMode(HSB, 100);
 * c = color(50, 55, 100);
 * fill(c);
 * rect(55, 10, 45, 80);
 * describe('Two blue rectangles. A darker rectangle on the left and a brighter one on the right.');
 * </code>
 * </div>
 */

/**
 * @method color
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range.
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range.
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range.
 * @param  {Number}        [alpha]
 * @return {p5.Color}
 */

/**
 * @method color
 * @param  {String}        value   a color string.
 * @return {p5.Color}
 */

/**
 * @method color
 * @param  {Number[]}      values  an array containing the red, green, blue,
 *                                 and alpha components of the color.
 * @return {p5.Color}
 */

/**
 * @method color
 * @param  {p5.Color}     color
 * @return {p5.Color}
 */
p5.prototype.color = function() {
  p5._validateParameters('color', arguments);
  if (arguments[0] instanceof p5.Color) {
    return arguments[0]; // Do nothing if argument is already a color object.
  }

  const args = arguments[0] instanceof Array ? arguments[0] : arguments;
  return new p5.Color(this, args);
};

/**
 * Extracts the green value from a <a href="#/p5.Color">p5.Color</a> object,
 * array of color components, or CSS color string.
 *
 * @method green
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the green value.
 * @example
 * <div>
 * <code>
 * const c = color(20, 75, 200);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'greenValue' to 75.
 * const greenValue = green(c);
 * fill(0, greenValue, 0);
 * rect(50, 20, 35, 60);
 * describe('Two rectangles. The rectangle on the left is blue and the one on the right is green.');
 * </code>
 * </div>
 */
p5.prototype.green = function(c) {
  p5._validateParameters('green', arguments);
  return this.color(c)._getGreen();
};

/**
 * Extracts the hue value from a
 * <a href="#/p5.Color">p5.Color</a> object, array of color components, or
 * CSS color string.
 *
 * Hue exists in both HSB and HSL. It describes a color's position on the
 * color wheel. By default, this function returns the HSL-normalized hue. If
 * the <a href="#/colorMode">colorMode()</a> is set to HSB, it returns the
 * HSB-normalized hue.
 *
 * @method hue
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the hue
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * const c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'hueValue' to 0.
 * const hueValue = hue(c);
 * fill(hueValue);
 * rect(50, 20, 35, 60);
 * describe(
 *   'Two rectangles. The rectangle on the left is salmon pink and the one on the right is black.'
 * );
 * </code>
 * </div>
 *
 */
p5.prototype.hue = function(c) {
  p5._validateParameters('hue', arguments);
  return this.color(c)._getHue();
};

/**
 * Blends two colors to find a third color between them. The `amt` parameter
 * specifies the amount to interpolate between the two values. 0 is equal to
 * the first color, 0.1 is very near the first color, 0.5 is halfway between
 * the two colors, and so on. Negative numbers are set to 0. Numbers greater
 * than 1 are set to 1. This differs from the behavior of
 * <a href="#/lerp">lerp</a>. It's necessary because numbers outside of the
 * interval [0, 1] will produce strange and unexpected colors.
 *
 * The way that colors are interpolated depends on the current
 * <a href="#/colorMode">colorMode()</a>.
 *
 * @method lerpColor
 * @param  {p5.Color} c1  interpolate from this color.
 * @param  {p5.Color} c2  interpolate to this color.
 * @param  {Number}       amt number between 0 and 1.
 * @return {p5.Color}     interpolated color.
 *
 * @example
 * <div>
 * <code>
 * colorMode(RGB);
 * stroke(255);
 * background(51);
 * const from = color(218, 165, 32);
 * const to = color(72, 61, 139);
 * colorMode(RGB);
 * const interA = lerpColor(from, to, 0.33);
 * const interB = lerpColor(from, to, 0.66);
 * fill(from);
 * rect(10, 20, 20, 60);
 * fill(interA);
 * rect(30, 20, 20, 60);
 * fill(interB);
 * rect(50, 20, 20, 60);
 * fill(to);
 * rect(70, 20, 20, 60);
 * describe(
 *   'Four rectangles with white edges. From left to right, the rectangles are tan, brown, brownish purple, and purple.'
 * );
 * </code>
 * </div>
 */
p5.prototype.lerpColor = function(c1, c2, amt) {
  p5._validateParameters('lerpColor', arguments);
  const mode = this._colorMode;
  const maxes = this._colorMaxes;
  let l0, l1, l2, l3;
  let fromArray, toArray;

  if (mode === constants.RGB) {
    fromArray = c1.levels.map(level => level / 255);
    toArray = c2.levels.map(level => level / 255);
  } else if (mode === constants.HSB) {
    c1._getBrightness(); // Cache hsba so it definitely exists.
    c2._getBrightness();
    fromArray = c1.hsba;
    toArray = c2.hsba;
  } else if (mode === constants.HSL) {
    c1._getLightness(); // Cache hsla so it definitely exists.
    c2._getLightness();
    fromArray = c1.hsla;
    toArray = c2.hsla;
  } else {
    throw new Error(`${mode}cannot be used for interpolation.`);
  }

  // Prevent extrapolation.
  amt = Math.max(Math.min(amt, 1), 0);

  // Define lerp here itself if user isn't using math module.
  // Maintains the definition as found in math/calculation.js
  if (typeof this.lerp === 'undefined') {
    this.lerp = (start, stop, amt) => amt * (stop - start) + start;
  }

  // Perform interpolation.
  l0 = this.lerp(fromArray[0], toArray[0], amt);
  l1 = this.lerp(fromArray[1], toArray[1], amt);
  l2 = this.lerp(fromArray[2], toArray[2], amt);
  l3 = this.lerp(fromArray[3], toArray[3], amt);

  // Scale components.
  l0 *= maxes[mode][0];
  l1 *= maxes[mode][1];
  l2 *= maxes[mode][2];
  l3 *= maxes[mode][3];

  return this.color(l0, l1, l2, l3);
};

/**
 * Extracts the HSL lightness value from a
 * <a href="#/p5.Color">p5.Color</a> object, array of color components, or
 * CSS color string.
 *
 * @method lightness
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the lightness
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSL);
 * const c = color(156, 100, 50, 1);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'lightValue' to 50.
 * const lightValue = lightness(c);
 * fill(lightValue);
 * rect(50, 20, 35, 60);
 * describe('Two rectangles. The rectangle on the left is light green and the one on the right is gray.');
 * </code>
 * </div>
 */
p5.prototype.lightness = function(c) {
  p5._validateParameters('lightness', arguments);
  return this.color(c)._getLightness();
};

/**
 * Extracts the red value from a
 * <a href="#/p5.Color">p5.Color</a> object, array of color components, or
 * CSS color string.
 *
 * @method red
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the red value.
 * @example
 * <div>
 * <code>
 * const c = color(255, 204, 0);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'redValue' to 255.
 * const redValue = red(c);
 * fill(redValue, 0, 0);
 * rect(50, 20, 35, 60);
 * describe(
 *   'Two rectangles with black edges. The rectangle on the left is yellow and the one on the right is red.'
 * );
 * </code>
 * </div>
 */
p5.prototype.red = function(c) {
  p5._validateParameters('red', arguments);
  return this.color(c)._getRed();
};

/**
 * Extracts the saturation value from a
 * <a href="#/p5.Color">p5.Color</a> object, array of color components, or
 * CSS color string.
 *
 * Saturation is scaled differently in HSB and HSL. By default, this function
 * returns the HSL saturation. If the <a href="#/colorMode">colorMode()</a>
 * is set to HSB, it returns the HSB saturation.
 *
 * @method saturation
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
 *                                         color components, or CSS color string.
 * @return {Number} the saturation value
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * const c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * // Sets 'satValue' to 126.
 * const satValue = saturation(c);
 * fill(satValue);
 * rect(50, 20, 35, 60);
 * describe(
 *   'Two rectangles. The rectangle on the left is deep pink and the one on the right is gray.'
 * );
 * </code>
 * </div>
 */
p5.prototype.saturation = function(c) {
  p5._validateParameters('saturation', arguments);
  return this.color(c)._getSaturation();
};

export default p5;
