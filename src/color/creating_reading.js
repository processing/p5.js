/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 */

import { Color } from './p5.Color';

/**
 * @typedef {'rgb'} RGB
 * @property {RGB} RGB
 * @final
 */
export const RGB = 'rgb';
/**
 * @typedef {'rgbhdr'} RGBHDR
 * @property {RGBHDR} RGBHDR
 * @final
 */
export const RGBHDR = 'rgbhdr';
/**
 * HSB (hue, saturation, brightness) is a type of color model.
 * You can learn more about it at
 * <a href="https://learnui.design/blog/the-hsb-color-system-practicioners-primer.html">HSB</a>.
 *
 * @typedef {'hsb'} HSB
 * @property {HSB} HSB
 * @final
 */
export const HSB = 'hsb';
/**
 * @typedef {'hsl'} HSL
 * @property {HSL} HSL
 * @final
 */
export const HSL = 'hsl';
/**
 * @typedef {'hwb'} HWB
 * @property {HWB} HWB
 * @final
 */
export const HWB = 'hwb';
/**
 * @typedef {'lab'} LAB
 * @property {LAB} LAB
 * @final
 */
export const LAB = 'lab';
/**
 * @typedef {'lch'} LCH
 * @property {LCH} LCH
 * @final
 */
export const LCH = 'lch';
/**
 * @typedef {'oklab'} OKLAB
 * @property {OKLAB} OKLAB
 * @final
 */
export const OKLAB = 'oklab';
/**
 * @typedef {'oklch'} OKLCH
 * @property {OKLCH} OKLCH
 * @final
 */
export const OKLCH = 'oklch';
/**
 * @typedef {'rgba'} RGBA
 * @property {RGBA} RGBA
 * @final
 */
export const RGBA = 'rgba';

function creatingReading(p5, fn){
  fn.RGB = RGB;
  fn.RGBHDR = RGBHDR;
  fn.HSB = HSB;
  fn.HSL = HSL;
  fn.HWB = HWB;

  fn.LAB = LAB;
  fn.LCH = LCH;

  fn.OKLAB = OKLAB;
  fn.OKLCH = OKLCH;

  fn.RGBA = RGBA;

  // Add color states to renderer state machine
  p5.Renderer.states.colorMode = RGB;
  p5.Renderer.states.colorMaxes = {
    [RGB]: [255, 255, 255, 255],
    [RGBHDR]: [255, 255, 255, 255],
    [HSB]: [360, 100, 100, 1],
    [HSL]: [360, 100, 100, 1],
    [HWB]: [360, 100, 100, 1],

    [LAB]: [100, [-125, 125], [-125, 125], 1],
    [LCH]: [100, 150, 360, 1],

    [OKLAB]: [100, [-125, 125], [-125, 125], 1],
    [OKLCH]: [100, 150, 360, 1],
    clone: function(){
      const cloned = { ...this };
      for (const key in cloned) {
        if (cloned[key] instanceof Array) {
          cloned[key] = [...cloned[key]];
        }
      }
      return cloned;
    }
  };

  /**
   * Creates a <a href="#/p5/p5.Color">p5.Color</a> object.
   *
   * By default, the parameters are interpreted as RGB values. Calling
   * `color(255, 204, 0)` will return a bright yellow color. The way these
   * parameters are interpreted may be changed with the
   * <a href="#/p5/colorMode">colorMode()</a> function.
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
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using RGB values.
   *   let c = color(255, 204, 0);
   *
   *   // Draw the square.
   *   fill(c);
   *   noStroke();
   *   square(30, 20, 55);
   *
   *   describe('A yellow square on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using RGB values.
   *   let c1 = color(255, 204, 0);
   *
   *   // Draw the left circle.
   *   fill(c1);
   *   noStroke();
   *   circle(25, 25, 80);
   *
   *   // Create a p5.Color object using a grayscale value.
   *   let c2 = color(65);
   *
   *   // Draw the right circle.
   *   fill(c2);
   *   circle(75, 75, 80);
   *
   *   describe(
   *     'Two circles on a gray canvas. The circle in the top-left corner is yellow and the one at the bottom-right is gray.'
   *   );
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using a named color.
   *   let c = color('magenta');
   *
   *   // Draw the square.
   *   fill(c);
   *   noStroke();
   *   square(20, 20, 60);
   *
   *   describe('A magenta square on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using a hex color code.
   *   let c1 = color('#0f0');
   *
   *   // Draw the left rectangle.
   *   fill(c1);
   *   noStroke();
   *   rect(0, 10, 45, 80);
   *
   *   // Create a p5.Color object using a hex color code.
   *   let c2 = color('#00ff00');
   *
   *   // Draw the right rectangle.
   *   fill(c2);
   *   rect(55, 10, 45, 80);
   *
   *   describe('Two bright green rectangles on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using a RGB color string.
   *   let c1 = color('rgb(0, 0, 255)');
   *
   *   // Draw the top-left square.
   *   fill(c1);
   *   square(10, 10, 35);
   *
   *   // Create a p5.Color object using a RGB color string.
   *   let c2 = color('rgb(0%, 0%, 100%)');
   *
   *   // Draw the top-right square.
   *   fill(c2);
   *   square(55, 10, 35);
   *
   *   // Create a p5.Color object using a RGBA color string.
   *   let c3 = color('rgba(0, 0, 255, 1)');
   *
   *   // Draw the bottom-left square.
   *   fill(c3);
   *   square(10, 55, 35);
   *
   *   // Create a p5.Color object using a RGBA color string.
   *   let c4 = color('rgba(0%, 0%, 100%, 1)');
   *
   *   // Draw the bottom-right square.
   *   fill(c4);
   *   square(55, 55, 35);
   *
   *   describe('Four blue squares in the corners of a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using a HSL color string.
   *   let c1 = color('hsl(160, 100%, 50%)');
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c1);
   *   rect(0, 10, 45, 80);
   *
   *   // Create a p5.Color object using a HSLA color string.
   *   let c2 = color('hsla(160, 100%, 50%, 0.5)');
   *
   *   // Draw the right rectangle.
   *   fill(c2);
   *   rect(55, 10, 45, 80);
   *
   *   describe('Two sea green rectangles. A darker rectangle on the left and a brighter one on the right.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using a HSB color string.
   *   let c1 = color('hsb(160, 100%, 50%)');
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c1);
   *   rect(0, 10, 45, 80);
   *
   *   // Create a p5.Color object using a HSBA color string.
   *   let c2 = color('hsba(160, 100%, 50%, 0.5)');
   *
   *   // Draw the right rectangle.
   *   fill(c2);
   *   rect(55, 10, 45, 80);
   *
   *   describe('Two green rectangles. A darker rectangle on the left and a brighter one on the right.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using RGB values.
   *   let c1 = color(50, 55, 100);
   *
   *   // Draw the left rectangle.
   *   fill(c1);
   *   rect(0, 10, 45, 80);
   *
   *   // Switch the color mode to HSB.
   *   colorMode(HSB, 100);
   *
   *   // Create a p5.Color object using HSB values.
   *   let c2 = color(50, 55, 100);
   *
   *   // Draw the right rectangle.
   *   fill(c2);
   *   rect(55, 10, 45, 80);
   *
   *   describe('Two blue rectangles. A darker rectangle on the left and a brighter one on the right.');
   * }
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
  fn.color = function(...args) {
    // p5._validateParameters('color', args);
    if (args[0] instanceof Color) {
      // TODO: perhaps change color mode to match instance mode?
      return args[0]; // Do nothing if argument is already a color object.
    }

    const arg = Array.isArray(args[0]) ? args[0] : args;
    return new Color(
      arg,
      this._renderer.states.colorMode,
      this._renderer.states.colorMaxes[this._renderer.states.colorMode],
      { clamp: true }
    );
  };

  /**
   * Gets the red value of a color.
   *
   * `red()` extracts the red value from a
   * <a href="/reference/p5/p5.Color/">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * By default, `red()` returns a color's red value in the range 0
   * to 255. If the <a href="/reference/p5/colorMode/">colorMode()</a> is set to RGB, it
   * returns the red value in the given range.
   *
   * @method red
   * @param {p5.Color|Number[]|String} color <a href="/reference/p5/p5.Color/">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the red value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color(175, 100, 220);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'redValue' to 175.
   *   let redValue = red(c);
   *
   *   // Draw the right rectangle.
   *   fill(redValue, 0, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is red.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a color array.
   *   let c = [175, 100, 220];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'redValue' to 175.
   *   let redValue = red(c);
   *
   *   // Draw the right rectangle.
   *   fill(redValue, 0, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is red.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a CSS color string.
   *   let c = 'rgb(175, 100, 220)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'redValue' to 175.
   *   let redValue = red(c);
   *
   *   // Draw the right rectangle.
   *   fill(redValue, 0, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is red.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use RGB color with values in the range 0-100.
   *   colorMode(RGB, 100);
   *
   *   // Create a p5.Color object.
   *   let c = color(69, 39, 86);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'redValue' to 69.
   *   let redValue = red(c);
   *
   *   // Draw the right rectangle.
   *   fill(redValue, 0, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is red.');
   * }
   * </code>
   * </div>
   */
  fn.red = function(c) {
    // p5._validateParameters('red', arguments);
    // Get current red max
    return this.color(c)._getRed();
  };

  /**
   * Gets the green value of a color.
   *
   * `green()` extracts the green value from a
   * <a href="/reference/p5/p5.Color/">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * By default, `green()` returns a color's green value in the range 0
   * to 255. If the <a href="/reference/p5/colorMode/">colorMode()</a> is set to RGB, it
   * returns the green value in the given range.
   *
   * @method green
   * @param {p5.Color|Number[]|String} color <a href="/reference/p5/p5.Color/">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the green value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color(175, 100, 220);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'greenValue' to 100.
   *   let greenValue = green(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, greenValue, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is dark green.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a color array.
   *   let c = [175, 100, 220];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'greenValue' to 100.
   *   let greenValue = green(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, greenValue, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is dark green.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a CSS color string.
   *   let c = 'rgb(175, 100, 220)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'greenValue' to 100.
   *   let greenValue = green(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, greenValue, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is dark green.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use RGB color with values in the range 0-100.
   *   colorMode(RGB, 100);
   *
   *   // Create a p5.Color object using RGB values.
   *   let c = color(69, 39, 86);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'greenValue' to 39.
   *   let greenValue = green(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, greenValue, 0);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is dark green.');
   * }
   * </code>
   * </div>
   */
  fn.green = function(c) {
    // p5._validateParameters('green', arguments);
    // Get current green max
    return this.color(c)._getGreen();
  };

  /**
   * Gets the blue value of a color.
   *
   * `blue()` extracts the blue value from a
   * <a href="/reference/p5/p5.Color/">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * By default, `blue()` returns a color's blue value in the range 0
   * to 255. If the <a href="/reference/p5/colorMode/">colorMode()</a> is set to RGB, it
   * returns the blue value in the given range.
   *
   * @method blue
   * @param {p5.Color|Number[]|String} color <a href="/reference/p5/p5.Color/">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the blue value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object using RGB values.
   *   let c = color(175, 100, 220);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'blueValue' to 220.
   *   let blueValue = blue(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, 0, blueValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is royal blue.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a color array.
   *   let c = [175, 100, 220];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'blueValue' to 220.
   *   let blueValue = blue(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, 0, blueValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is royal blue.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a CSS color string.
   *   let c = 'rgb(175, 100, 220)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'blueValue' to 220.
   *   let blueValue = blue(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, 0, blueValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is royal blue.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use RGB color with values in the range 0-100.
   *   colorMode(RGB, 100);
   *
   *   // Create a p5.Color object using RGB values.
   *   let c = color(69, 39, 86);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'blueValue' to 86.
   *   let blueValue = blue(c);
   *
   *   // Draw the right rectangle.
   *   fill(0, 0, blueValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light purple and the right one is royal blue.');
   * }
   * </code>
   * </div>
   */
  fn.blue = function(c) {
    // p5._validateParameters('blue', arguments);
    // Get current blue max
    return this.color(c)._getBlue();
  };

  /**
   * Gets the alpha (transparency) value of a color.
   *
   * `alpha()` extracts the alpha value from a
   * <a href="#/p5.Color">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * @method alpha
   * @param {p5.Color|Number[]|String} color <a href="#/p5.Color">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the alpha value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color(0, 126, 255, 102);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'alphaValue' to 102.
   *   let alphaValue = alpha(c);
   *
   *   // Draw the right rectangle.
   *   fill(alphaValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light blue and the right one is charcoal gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a color array.
   *   let c = [0, 126, 255, 102];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'alphaValue' to 102.
   *   let alphaValue = alpha(c);
   *
   *   // Draw the left rectangle.
   *   fill(alphaValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light blue and the right one is charcoal gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a CSS color string.
   *   let c = 'rgba(0, 126, 255, 0.4)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'alphaValue' to 102.
   *   let alphaValue = alpha(c);
   *
   *   // Draw the right rectangle.
   *   fill(alphaValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is light blue and the right one is charcoal gray.');
   * }
   * </code>
   * </div>
   */
  fn.alpha = function(c) {
    // p5._validateParameters('alpha', arguments);
    // Get current alpha max
    return this.color(c)._getAlpha();
  };

  /**
   * Gets the hue value of a color.
   *
   * `hue()` extracts the hue value from a
   * <a href="/reference/p5/p5.Color/">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * Hue describes a color's position on the color wheel. By default, `hue()`
   * returns a color's HSL hue in the range 0 to 360. If the
   * <a href="/reference/p5/colorMode/">colorMode()</a> is set to HSB or HSL, it returns the hue
   * value in the given mode.
   *
   * @method hue
   * @param {p5.Color|Number[]|String} color <a href="/reference/p5/p5.Color/">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the hue value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Create a p5.Color object.
   *   let c = color(0, 50, 100);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 20, 35, 60);
   *
   *   // Set 'hueValue' to 0.
   *   let hueValue = hue(c);
   *
   *   // Draw the right rectangle.
   *   fill(hueValue);
   *   rect(50, 20, 35, 60);
   *
   *   describe(
   *     'Two rectangles. The rectangle on the left is salmon pink and the one on the right is black.'
   *   );
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Create a color array.
   *   let c = [0, 50, 100];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 20, 35, 60);
   *
   *   // Set 'hueValue' to 0.
   *   let hueValue = hue(c);
   *
   *   // Draw the right rectangle.
   *   fill(hueValue);
   *   rect(50, 20, 35, 60);
   *
   *   describe(
   *     'Two rectangles. The rectangle on the left is salmon pink and the one on the right is black.'
   *   );
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Create a CSS color string.
   *   let c = 'rgb(255, 128, 128)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 20, 35, 60);
   *
   *   // Set 'hueValue' to 0.
   *   let hueValue = hue(c);
   *
   *   // Draw the right rectangle.
   *   fill(hueValue);
   *   rect(50, 20, 35, 60);
   *
   *   describe(
   *     'Two rectangles. The rectangle on the left is salmon pink and the one on the right is black.'
   *   );
   * }
   * </code>
   * </div>
   */
  fn.hue = function(c) {
    // p5._validateParameters('hue', arguments);
    return this.color(c)._getHue();
  };

  /**
   * Gets the saturation value of a color.
   *
   * `saturation()` extracts the saturation value from a
   * <a href="/reference/p5/p5.Color/">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * Saturation is scaled differently in HSB and HSL. By default, `saturation()`
   * returns a color's HSL saturation in the range 0 to 100. If the
   * <a href="/reference/p5/colorMode/">colorMode()</a> is set to HSB or HSL, it returns the
   * saturation value in the given mode.
   *
   * @method saturation
   * @param {p5.Color|Number[]|String} color <a href="/reference/p5/p5.Color/">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the saturation value
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // Create a p5.Color object.
   *   let c = color(0, 50, 100);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'satValue' to 50.
   *   let satValue = saturation(c);
   *
   *   // Draw the right rectangle.
   *   fill(satValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is dark gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // Create a color array.
   *   let c = [0, 50, 100];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'satValue' to 100.
   *   let satValue = saturation(c);
   *
   *   // Draw the right rectangle.
   *   fill(satValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // Create a CSS color string.
   *   let c = 'rgb(255, 128, 128)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'satValue' to 100.
   *   let satValue = saturation(c);
   *
   *   // Draw the right rectangle.
   *   fill(satValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Create a p5.Color object.
   *   let c = color(0, 100, 75);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'satValue' to 100.
   *   let satValue = saturation(c);
   *
   *   // Draw the right rectangle.
   *   fill(satValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is white.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSL color with values in the range 0-255.
   *   colorMode(HSL, 255);
   *
   *   // Create a p5.Color object.
   *   let c = color(0, 255, 191.5);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'satValue' to 255.
   *   let satValue = saturation(c);
   *
   *   // Draw the right rectangle.
   *   fill(satValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is white.');
   * }
   * </code>
   * </div>
   */
  fn.saturation = function(c) {
    // p5._validateParameters('saturation', arguments);
    return this.color(c)._getSaturation();
  };

  /**
   * Gets the brightness value of a color.
   *
   * `brightness()` extracts the HSB brightness value from a
   * <a href="/reference/p5/p5.Color/">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * By default, `brightness()` returns a color's HSB brightness in the range 0
   * to 100. If the <a href="/reference/p5/colorMode/">colorMode()</a> is set to HSB, it
   * returns the brightness value in the given range.
   *
   * @method brightness
   * @param {p5.Color|Number[]|String} color <a href="/reference/p5/p5.Color/">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the brightness value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // Create a p5.Color object.
   *   let c = color(0, 50, 100);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'brightValue' to 100.
   *   let brightValue = brightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(brightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is white.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // Create a color array.
   *   let c = [0, 50, 100];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'brightValue' to 100.
   *   let brightValue = brightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(brightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is white.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // Create a CSS color string.
   *   let c = 'rgb(255, 128, 128)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'brightValue' to 100.
   *   let brightValue = brightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(brightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is white.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSB color with values in the range 0-255.
   *   colorMode(HSB, 255);
   *
   *   // Create a p5.Color object.
   *   let c = color(0, 127, 255);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'brightValue' to 255.
   *   let brightValue = brightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(brightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is white.');
   * }
   * </code>
   * </div>
   */
  fn.brightness = function(c) {
    // p5._validateParameters('brightness', arguments);
    return this.color(c)._getBrightness();
  };

  /**
   * Gets the lightness value of a color.
   *
   * `lightness()` extracts the HSL lightness value from a
   * <a href="/reference/p5/p5.Color/">p5.Color</a> object, an array of color components, or
   * a CSS color string.
   *
   * By default, `lightness()` returns a color's HSL lightness in the range 0
   * to 100. If the <a href="/reference/p5/colorMode/">colorMode()</a> is set to HSL, it
   * returns the lightness value in the given range.
   *
   * @method lightness
   * @param {p5.Color|Number[]|String} color <a href="/reference/p5/p5.Color/">p5.Color</a> object, array of
   *                                         color components, or CSS color string.
   * @return {Number} the lightness value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Create a p5.Color object using HSL values.
   *   let c = color(0, 100, 75);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'lightValue' to 75.
   *   let lightValue = lightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(lightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Create a color array.
   *   let c = [0, 100, 75];
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'lightValue' to 75.
   *   let lightValue = lightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(lightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Create a CSS color string.
   *   let c = 'rgb(255, 128, 128)';
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'lightValue' to 75.
   *   let lightValue = lightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(lightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is gray.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use HSL color with values in the range 0-255.
   *   colorMode(HSL, 255);
   *
   *   // Create a p5.Color object using HSL values.
   *   let c = color(0, 255, 191.5);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 15, 35, 70);
   *
   *   // Set 'lightValue' to 191.5.
   *   let lightValue = lightness(c);
   *
   *   // Draw the right rectangle.
   *   fill(lightValue);
   *   rect(50, 15, 35, 70);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is gray.');
   * }
   * </code>
   * </div>
   */
  fn.lightness = function(c) {
    // p5._validateParameters('lightness', arguments);
    return this.color(c)._getLightness();
  };

  /**
   * Blends two colors to find a third color between them.
   *
   * The `amt` parameter specifies the amount to interpolate between the two
   * values. 0 is equal to the first color, 0.1 is very near the first color,
   * 0.5 is halfway between the two colors, and so on. Negative numbers are set
   * to 0. Numbers greater than 1 are set to 1. This differs from the behavior of
   * <a href="#/lerp">lerp</a>. It's necessary because numbers outside of the
   * interval [0, 1] will produce strange and unexpected colors.
   *
   * The way that colors are interpolated depends on the current
   * <a href="#/colorMode">colorMode()</a>.
   *
   * @method lerpColor
   * @param  {p5.Color} c1  interpolate from this color.
   * @param  {p5.Color} c2  interpolate to this color.
   * @param  {Number}   amt number between 0 and 1.
   * @return {p5.Color}     interpolated color.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create p5.Color objects to interpolate between.
   *   let from = color(218, 165, 32);
   *   let to = color(72, 61, 139);
   *
   *   // Create intermediate colors.
   *   let interA = lerpColor(from, to, 0.33);
   *   let interB = lerpColor(from, to, 0.66);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(from);
   *   rect(10, 20, 20, 60);
   *
   *   // Draw the left-center rectangle.
   *   fill(interA);
   *   rect(30, 20, 20, 60);
   *
   *   // Draw the right-center rectangle.
   *   fill(interB);
   *   rect(50, 20, 20, 60);
   *
   *   // Draw the right rectangle.
   *   fill(to);
   *   rect(70, 20, 20, 60);
   *
   *   describe(
   *     'Four rectangles. From left to right, the rectangles are tan, brown, brownish purple, and purple.'
   *   );
   * }
   * </code>
   * </div>
   */
  fn.lerpColor = function(c1, c2, amt) {
    // p5._validateParameters('lerpColor', arguments);
    return c1.lerp(c2, amt, this._renderer.states.colorMode);
  };

  /**
   * Blends multiple colors to find a color between them.
   *
   * The `amt` parameter specifies the amount to interpolate between the color
   * stops which are colors at each `amt` value "location" with `amt` values
   * that are between 2 color stops interpolating between them based on its relative
   * distance to both.
   *
   * The way that colors are interpolated depends on the current
   * <a href="/reference/p5/colorMode/">colorMode()</a>.
   *
   * @method paletteLerp
   * @param {Array<[(p5.Color|String|Number|Number[]), Number]>} colors_stops color stops to interpolate from
   * @param {Number} amt number to use to interpolate relative to color stops
   * @return {p5.Color} interpolated color.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(400, 400);
   * }
   *
   * function draw() {
   *   // The background goes from white to red to green to blue fill
   *   background(paletteLerp([
   *     ['white', 0],
   *     ['red', 0.05],
   *     ['green', 0.25],
   *     ['blue', 1]
   *   ], millis() / 10000 % 1));
   * }
   * </code>
   * </div>
   */
  fn.paletteLerp = function(color_stops, amt) {
    const first_color_stop = color_stops[0];
    if (amt < first_color_stop[1])
      return this.color(first_color_stop[0]);

    for (let i = 1; i < color_stops.length; i++) {
      const color_stop = color_stops[i];
      if (amt < color_stop[1]) {
        const prev_color_stop = color_stops[i - 1];
        return this.lerpColor(
          this.color(prev_color_stop[0]),
          this.color(color_stop[0]),
          (amt - prev_color_stop[1]) / (color_stop[1] - prev_color_stop[1])
        );
      }
    }

    return this.color(color_stops[color_stops.length - 1][0]);
  };
}

export default creatingReading;

if(typeof p5 !== 'undefined'){
  creatingReading(p5, p5.prototype);
}
