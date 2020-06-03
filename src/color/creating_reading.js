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
 * Extracts the alpha value from a color or pixel array.
 *
 * @method alpha
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the alpha value
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 * let c = color(0, 126, 255, 102);
 * fill(c);
 * rect(15, 15, 35, 70);
 * let value = alpha(c); // Sets 'value' to 102
 * fill(value);
 * rect(50, 15, 35, 70);
 * </code>
 * </div>
 *
 * @alt
 * Left half of canvas light blue and right half light charcoal grey.
 */
p5.prototype.alpha = function(c) {
  p5._validateParameters('alpha', arguments);
  return this.color(c)._getAlpha();
};

/**
 * Extracts the blue value from a color or pixel array.
 *
 * @method blue
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the blue value
 * @example
 * <div>
 * <code>
 * let c = color(175, 100, 220);
 * fill(c);
 * rect(15, 20, 35, 60); // Draw left rectangle
 * let blueValue = blue(c);
 * fill(0, 0, blueValue);
 * rect(50, 20, 35, 60); // Draw right rectangle
 * </code>
 * </div>
 *
 * @alt
 * Left half of canvas light purple and right half a royal blue.
 */
p5.prototype.blue = function(c) {
  p5._validateParameters('blue', arguments);
  return this.color(c)._getBlue();
};

/**
 * Extracts the HSB brightness value from a color or pixel array.
 *
 * @method brightness
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the brightness value
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * let c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * let value = brightness(c); // Sets 'value' to 255
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * let c = color('hsb(60, 100%, 50%)');
 * fill(c);
 * rect(15, 20, 35, 60);
 * let value = brightness(c); // A 'value' of 50% is 127.5
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 *
 * @alt
 * Left half of canvas salmon pink and the right half with it's brightness colored white.
 * Left half of canvas olive colored and the right half with it's brightness color gray.
 */
p5.prototype.brightness = function(c) {
  p5._validateParameters('brightness', arguments);
  return this.color(c)._getBrightness();
};

/**
 * Creates colors for storing in variables of the color datatype. The
 * parameters are interpreted as RGB or HSB values depending on the
 * current <a href="#/p5/colorMode">colorMode()</a>. The default mode is RGB values from 0 to 255
 * and, therefore, the function call color(255, 204, 0) will return a
 * bright yellow color.
 *
 * Note that if only one value is provided to <a href="#/p5/color">color()</a>, it will be interpreted
 * as a grayscale value. Add a second value, and it will be used for alpha
 * transparency. When three values are specified, they are interpreted as
 * either RGB or HSB values. Adding a fourth value applies alpha
 * transparency.
 *
 * If a single string argument is provided, RGB, RGBA and Hex CSS color
 * strings and all named color strings are supported. In this case, an alpha
 * number value as a second argument is not supported, the RGBA form should be
 * used.
 *
 * @method color
 * @param  {Number} gray number specifying value between white and black.
 * @param  {Number} [alpha] alpha value relative to current color range
 *                                 (default is 0-255)
 * @return {p5.Color} resulting color
 *
 * @example
 * <div>
 * <code>
 * let c = color(255, 204, 0);
 * fill(c);
 * noStroke();
 * rect(30, 20, 55, 55);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let c = color(255, 204, 0);
 * fill(c);
 * noStroke();
 * ellipse(25, 25, 80, 80); // Draw left circle
 * // Using only one value generates a grayscale value.
 * c = color(65);
 * fill(c);
 * ellipse(75, 75, 80, 80);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // You can use named SVG & CSS colors
 * let c = color('magenta');
 * fill(c);
 * noStroke();
 * rect(20, 20, 60, 60);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Example of hex color codes
 * noStroke();
 * let c = color('#0f0');
 * fill(c);
 * rect(0, 10, 45, 80);
 * c = color('#00ff00');
 * fill(c);
 * rect(55, 10, 45, 80);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // RGB and RGBA color strings are also supported
 * // these all set to the same color (solid blue)
 * let c;
 * noStroke();
 * c = color('rgb(0,0,255)');
 * fill(c);
 * rect(10, 10, 35, 35); // Draw rectangle
 * c = color('rgb(0%, 0%, 100%)');
 * fill(c);
 * rect(55, 10, 35, 35); // Draw rectangle
 * c = color('rgba(0, 0, 255, 1)');
 * fill(c);
 * rect(10, 55, 35, 35); // Draw rectangle
 * c = color('rgba(0%, 0%, 100%, 1)');
 * fill(c);
 * rect(55, 55, 35, 35); // Draw rectangle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // HSL color can also be specified by value
 * let c = color('hsl(160, 100%, 50%)');
 * noStroke();
 * fill(c);
 * rect(0, 10, 45, 80); // Draw rectangle
 * c = color('hsla(160, 100%, 50%, 0.5)');
 * fill(c);
 * rect(55, 10, 45, 80); // Draw rectangle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // HSB color can also be specified
 * let c = color('hsb(160, 100%, 50%)');
 * noStroke();
 * fill(c);
 * rect(0, 10, 45, 80); // Draw rectangle
 * c = color('hsba(160, 100%, 50%, 0.5)');
 * fill(c);
 * rect(55, 10, 45, 80); // Draw rectangle
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noStroke();
 * let c = color(50, 55, 100);
 * fill(c);
 * rect(0, 10, 45, 80); // Draw left rect
 * colorMode(HSB, 100);
 * c = color(50, 55, 100);
 * fill(c);
 * rect(55, 10, 45, 80);
 * </code>
 * </div>
 *
 * @alt
 * Yellow rect in middle right of canvas, with 55 pixel width and height.
 * Yellow ellipse in top left of canvas, black ellipse in bottom right,both 80x80.
 * Bright fuchsia rect in middle of canvas, 60 pixel width and height.
 * Two bright green rects on opposite sides of the canvas, both 45x80.
 * Four blue rects in each corner of the canvas, each are 35x35.
 * Bright sea green rect on left and darker rect on right of canvas, both 45x80.
 * Dark green rect on left and lighter green rect on right of canvas, both 45x80.
 * Dark blue rect on left and light teal rect on right of canvas, both 45x80.
 */

/**
 * @method color
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range
 * @param  {Number}        [alpha]
 * @return {p5.Color}
 */

/**
 * @method color
 * @param  {String}        value   a color string
 * @return {p5.Color}
 */

/**
 * @method color
 * @param  {Number[]}      values  an array containing the red,green,blue &
 *                                 and alpha components of the color
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
 * Extracts the green value from a color or pixel array.
 *
 * @method green
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the green value
 * @example
 * <div>
 * <code>
 * let c = color(20, 75, 200); // Define color 'c'
 * fill(c); // Use color variable 'c' as fill color
 * rect(15, 20, 35, 60); // Draw left rectangle
 *
 * let greenValue = green(c); // Get green in 'c'
 * print(greenValue); // Print "75.0"
 * fill(0, greenValue, 0); // Use 'greenValue' in new fill
 * rect(50, 20, 35, 60); // Draw right rectangle
 * </code>
 * </div>
 *
 * @alt
 * blue rect on left and green on right, both with black outlines & 35x60.
 */
p5.prototype.green = function(c) {
  p5._validateParameters('green', arguments);
  return this.color(c)._getGreen();
};

/**
 * Extracts the hue value from a color or pixel array.
 *
 * Hue exists in both HSB and HSL. This function will return the
 * HSB-normalized hue when supplied with an HSB color object (or when supplied
 * with a pixel array while the color mode is HSB), but will default to the
 * HSL-normalized hue otherwise. (The values will only be different if the
 * maximum hue setting for each system is different.)
 *
 * @method hue
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the hue
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * let c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * let value = hue(c); // Sets 'value' to "0"
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 *
 * @alt
 * salmon pink rect on left and black on right, both 35x60.
 */
p5.prototype.hue = function(c) {
  p5._validateParameters('hue', arguments);
  return this.color(c)._getHue();
};

/**
 * Blends two colors to find a third color somewhere between them. The amt
 * parameter is the amount to interpolate between the two values where 0.0
 * equal to the first color, 0.1 is very near the first color, 0.5 is halfway
 * in between, etc. An amount below 0 will be treated as 0. Likewise, amounts
 * above 1 will be capped at 1. This is different from the behavior of <a href="#/p5/lerp">lerp()</a>,
 * but necessary because otherwise numbers outside the range will produce
 * strange and unexpected colors.
 *
 * The way that colors are interpolated depends on the current color mode.
 *
 * @method lerpColor
 * @param  {p5.Color} c1  interpolate from this color
 * @param  {p5.Color} c2  interpolate to this color
 * @param  {Number}       amt number between 0 and 1
 * @return {p5.Color}     interpolated color
 *
 * @example
 * <div>
 * <code>
 * colorMode(RGB);
 * stroke(255);
 * background(51);
 * let from = color(218, 165, 32);
 * let to = color(72, 61, 139);
 * colorMode(RGB); // Try changing to HSB.
 * let interA = lerpColor(from, to, 0.33);
 * let interB = lerpColor(from, to, 0.66);
 * fill(from);
 * rect(10, 20, 20, 60);
 * fill(interA);
 * rect(30, 20, 20, 60);
 * fill(interB);
 * rect(50, 20, 20, 60);
 * fill(to);
 * rect(70, 20, 20, 60);
 * </code>
 * </div>
 *
 * @alt
 * 4 rects one tan, brown, brownish purple, purple, with white outlines & 20x60
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
 * Extracts the HSL lightness value from a color or pixel array.
 *
 * @method lightness
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the lightness
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSL);
 * let c = color(156, 100, 50, 1);
 * fill(c);
 * rect(15, 20, 35, 60);
 * let value = lightness(c); // Sets 'value' to 50
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 *
 * @alt
 * light pastel green rect on left and dark grey rect on right, both 35x60.
 */
p5.prototype.lightness = function(c) {
  p5._validateParameters('lightness', arguments);
  return this.color(c)._getLightness();
};

/**
 * Extracts the red value from a color or pixel array.
 *
 * @method red
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the red value
 * @example
 * <div>
 * <code>
 * let c = color(255, 204, 0); // Define color 'c'
 * fill(c); // Use color variable 'c' as fill color
 * rect(15, 20, 35, 60); // Draw left rectangle
 *
 * let redValue = red(c); // Get red in 'c'
 * print(redValue); // Print "255.0"
 * fill(redValue, 0, 0); // Use 'redValue' in new fill
 * rect(50, 20, 35, 60); // Draw right rectangle
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * colorMode(RGB, 255); // Sets the range for red, green, and blue to 255
 * let c = color(127, 255, 0);
 * colorMode(RGB, 1); // Sets the range for red, green, and blue to 1
 * let myColor = red(c);
 * print(myColor); // 0.4980392156862745
 * </code>
 * </div>
 *
 * @alt
 * yellow rect on left and red rect on right, both with black outlines and 35x60.
 * grey canvas
 */
p5.prototype.red = function(c) {
  p5._validateParameters('red', arguments);
  return this.color(c)._getRed();
};

/**
 * Extracts the saturation value from a color or pixel array.
 *
 * Saturation is scaled differently in HSB and HSL. This function will return
 * the HSB saturation when supplied with an HSB color object (or when supplied
 * with a pixel array while the color mode is HSB), but will default to the
 * HSL saturation otherwise.
 *
 * @method saturation
 * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, color components,
 *                                         or CSS color
 * @return {Number} the saturation value
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(HSB, 255);
 * let c = color(0, 126, 255);
 * fill(c);
 * rect(15, 20, 35, 60);
 * let value = saturation(c); // Sets 'value' to 126
 * fill(value);
 * rect(50, 20, 35, 60);
 * </code>
 * </div>
 *
 * @alt
 *deep pink rect on left and grey rect on right, both 35x60.
 */
p5.prototype.saturation = function(c) {
  p5._validateParameters('saturation', arguments);
  return this.color(c)._getSaturation();
};

export default p5;
