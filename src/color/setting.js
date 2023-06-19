/**
 * @module Color
 * @submodule Setting
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../core/main';
import * as constants from '../core/constants';
import './p5.Color';

/**
 * Sets the color used for the background of the canvas. By default, the
 * background is transparent. This function is typically used within
 * <a href="#/p5/draw">draw()</a> to clear the display window at the beginning
 * of each frame. It can also be used inside <a href="#/p5/setup">setup()</a> to
 * set the background on the first frame of animation.
 *
 * By default, colors are specified in RGB values. (`background(255, 204, 0)`
 * sets the background a bright yellow color.) HSL or HSB can be used instead by
 * using the <a href="#/p5/colorMode">colorMode()</a> function.
 *
 * <a href="#/p5/background">background()</a> supports RGB, RGBA, and Hex CSS
 * color strings, as well as named color strings. In this case, providing an
 * alpha value as a second argument is not supported for CSS color strings, so
 * the RGBA form should be used if you need to specify transparency.
 *
 * The version of `background()` with one parameter interprets the value one of two
 * ways. If the parameter is a number, it's interpreted as a grayscale value.
 * If the parameter is a string, it's interpreted as a CSS color string.
 *
 * The version of `background()` with two parameters interprets the first one as a
 * grayscale value. The second parameter sets the alpha (transparency) value.
 *
 * The version of `background()` with three parameters interprets them as RGB, HSB,
 * or HSL colors, depending on the current <a href="#/p5/colorMode">colorMode()</a>.
 *
 * A <a href="#/p5.Color">p5.Color</a> object can also be provided to set the
 * background color.
 *
 * A <a href="#/p5.Image">p5.Image</a> can also be provided to set the
 * background image.
 *
 * @method background
 * @param {p5.Color} color  any value created by the <a href="#/p5/color">color()</a> function
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // A grayscale integer value.
 * background(51);
 * describe('A canvas with a dark charcoal gray background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // A grayscale integer value and an alpha value.
 * background(51, 0.4);
 * describe('A canvas with a transparent gray background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values.
 * background(255, 204, 0);
 * describe('A canvas with a yellow background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values.
 * colorMode(HSB);
 * background(255, 204, 100);
 * describe('A canvas with a royal blue background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // A CSS named color.
 * background('red');
 * describe('A canvas with a red background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Three-digit hexadecimal RGB notation.
 * background('#fae');
 * describe('A canvas with a pink background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Six-digit hexadecimal RGB notation.
 * background('#222222');
 * describe('A canvas with a black background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGB notation.
 * background('rgb(0,255,0)');
 * describe('A canvas with a bright green background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGBA notation.
 * background('rgba(0,255,0, 0.25)');
 * describe('A canvas with a transparent green background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGB notation.
 * background('rgb(100%,0%,10%)');
 * describe('A canvas with a red background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGBA notation.
 * background('rgba(100%,0%,100%,0.5)');
 * describe('A canvas with a transparent purple background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object
 * background(color(0, 0, 255));
 * describe('A canvas with a blue background.');
 * </code>
 * </div>
 *
 */

/**
 * @method background
 * @param {String} colorstring color string, possible formats include: integer
 *                         rgb() or rgba(), percentage rgb() or rgba(),
 *                         3-digit hex, 6-digit hex.
 * @param {Number} [a]         opacity of the background relative to current
 *                             color range (default is 0-255).
 * @chainable
 */

/**
 * @method background
 * @param {Number} gray   Specifies a value between white and black.
 * @param {Number} [a]
 * @chainable
 */

/**
 * @method background
 * @param {Number} v1     Red value if color mode is RGB, or hue value if color mode is HSB.
 * @param {Number} v2     Green value if color mode is RGB, or saturation value if color mode is HSB.
 * @param {Number} v3     Blue value if color mode is RGB, or brightness value if color mode is HSB.
 * @param  {Number} [a]
 * @chainable
 */

/**
 * @method background
 * @param  {Number[]}      values  An array containing the red, green, blue
 *                                 and alpha components of the color.
 * @chainable
 */

/**
 * @method background
 * @param {p5.Image} image     Image created with <a href="#/p5/loadImage">loadImage()</a>
 *                             or <a href="#/p5/createImage">createImage()</a>,
 *                             to set as background
 *                             (must be same size as the sketch window).
 * @param  {Number}  [a]
 * @chainable
 */
p5.prototype.background = function(...args) {
  this._renderer.background(...args);
  return this;
};

/**
 * Clears the pixels within a buffer, specifically the canvas.
 * It does not clear objects created by createX() methods such as
 * <a href="#/p5/createVideo">createVideo()</a> or
 * <a href="#/p5/createDiv">createDiv()</a>. Unlike the main graphics
 * context, pixels in additional graphics areas created with
 * <a href="#/p5/createGraphics">createGraphics()</a>
 * can be any level of transparency. This function makes
 * every pixel 100% transparent.
 *
 * Note: In WebGL mode, this function can be passed normalized
 * RGBA color values in order to clear the screen to a specific color.
 * It also clears the depth buffer. If you are not using the webGL renderer,
 * these color values will have no effect.
 *
 * @method clear
 * @chainable
 * @example
 * <div>
 * <code>
 * // Clear the screen on mouse press after drawing some ellipses.
 * function draw() {
 *   ellipse(mouseX, mouseY, 20, 20);
 *   describe('A white ellipse is drawn at mouse x and y coordinates.');
 * }
 * function mousePressed() {
 *   clear();
 *   background(128);
 *   describe('The canvas is cleared when mouse is clicked.');
 * }
 * </code>
 * </div>
 *
 * @param {Number} r Normalized red val.
 * @param {Number} g Normalized green val.
 * @param {Number} b Normalized blue val.
 * @param {Number} a Normalized alpha val.
 */
p5.prototype.clear = function(...args) {
  const _r = args[0] || 0;
  const _g = args[1] || 0;
  const _b = args[2] || 0;
  const _a = args[3] || 0;

  this._renderer.clear(_r, _g, _b, _a);
  return this;
};

/**
 * Changes the way p5.js interprets color data. By default, it is set to
 * colorMode(RGB, 255) so the parameters for <a href="#/p5/fill">fill()</a>,
 * <a href="#/p5/stroke">stroke()</a>, <a href="#/p5/background">background()</a>,
 * and <a href="#/p5/color">color()</a> are defined by values between 0 and 255
 * using the RGB color model.
 *
 * Setting colorMode(RGB, 100) sets colors to be interpreted as RGB color values
 * between 0 and 100.
 *
 * Setting colorMode(HSB) or colorMode(HSL) changes to HSB or HSL system instead of RGB.
 *
 * Note: existing color objects remember the mode that they were created in,
 * so you can change modes as you like without affecting their appearance.
 *
 * @method colorMode
 * @param {Constant} mode   Either RGB, HSB or HSL, corresponding to
 *                          Red/Green/Blue and Hue/Saturation/Brightness
 *                          (or Lightness).
 * @param {Number}  [max]  Range for all values.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Make a gradient by setting colorMode to (RGB, 100) and looping from 0 to 100 (the maximum value) to gradually add red and green.
 * noStroke();
 * colorMode(RGB, 100);
 * for (let i = 0; i < 100; i++) {
 *   for (let j = 0; j < 100; j++) {
 *     stroke(i, j, 0);
 *     point(i, j);
 *   }
 * }
 * describe(
 *   'A diagonal green to red gradient from bottom-left to top-right with shading transitioning to black at top-left corner.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Make a gradient by setting colorMode to (HSB, 100) and looping from 0 to 100 (the maximum value) to gradually hue and saturation.
 * noStroke();
 * colorMode(HSB, 100);
 * for (let i = 0; i < 100; i++) {
 *   for (let j = 0; j < 100; j++) {
 *     stroke(i, j, 100);
 *     point(i, j);
 *   }
 * }
 * describe(` A rainbow gradient left-to-right gradient with brightness
 * transitioning to white at the top.`);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * colorMode(RGB, 255);
 * const myColor = color(180, 175, 230);
 * background(myColor);
 * colorMode(RGB, 1);
 * const redValue = red(myColor);
 * const greenValue = green(myColor);
 * const blueValue = blue(myColor);
 * text('Red:' + redValue, 10, 10, 80, 80);
 * text('Green:' + greenValue, 10, 40, 80, 80);
 * text('Blue:' + blueValue, 10, 70, 80, 80);
 * describe('A purple canvas with the red, green, and blue decimal values of the color written on it.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * colorMode(RGB, 255, 255, 255, 1);
 * background(255);
 * strokeWeight(4);
 * stroke(255, 0, 10, 0.3);
 * ellipse(40, 40, 50, 50);
 * ellipse(50, 60, 50, 50);
 * describe('Two overlapping translucent pink ellipse outlines.');
 * </code>
 * </div>
 *
 */

/**
 * @method colorMode
 * @param {Constant} mode
 * @param {Number} max1     Range for the red or hue depending on the
 *                              current color mode.
 * @param {Number} max2     Range for the green or saturation depending
 *                              on the current color mode.
 * @param {Number} max3     Range for the blue or brightness/lightness
 *                              depending on the current color mode.
 * @param {Number} [maxA]   Range for the alpha.
 * @chainable
 */
p5.prototype.colorMode = function(mode, max1, max2, max3, maxA) {
  p5._validateParameters('colorMode', arguments);
  if (
    mode === constants.RGB ||
    mode === constants.HSB ||
    mode === constants.HSL
  ) {
    // Set color mode.
    this._colorMode = mode;

    // Set color maxes.
    const maxes = this._colorMaxes[mode];
    if (arguments.length === 2) {
      maxes[0] = max1; // Red
      maxes[1] = max1; // Green
      maxes[2] = max1; // Blue
      maxes[3] = max1; // Alpha
    } else if (arguments.length === 4) {
      maxes[0] = max1; // Red
      maxes[1] = max2; // Green
      maxes[2] = max3; // Blue
    } else if (arguments.length === 5) {
      maxes[0] = max1; // Red
      maxes[1] = max2; // Green
      maxes[2] = max3; // Blue
      maxes[3] = maxA; // Alpha
    }
  }

  return this;
};

/**
 * Sets the color used to fill shapes. Calling `fill(255, 165, 0)` or fill('orange')
 * means all shapes drawn after the fill command will be filled with the color orange.
 *
 * The version of `fill()` with one parameter interprets the value one of two
 * ways. If the parameter is a number, it's interpreted as a grayscale value.
 * If the parameter is a string, it's interpreted as a CSS color string. A
 * <a href="#/p5.Color">p5.Color</a> object can also be provided to set the fill color.
 *
 * The version of `fill()` with three parameters interprets them as RGB, HSB,
 * or HSL colors, depending on the current <a href="#/p5/colorMode">colorMode()</a>.
 * (The default color space is RGB, with each value in the range from 0 to 255)
 *
 * @method fill
 * @param  {Number}        v1      Red value if color mode is RGB or hue value if color mode is HSB.
 * @param  {Number}        v2      Green value if color mode is RGB or saturation value if color mode is HSB.
 * @param  {Number}        v3      Blue value if color mode is RGB or brightness value if color mode is HSB.
 * @param  {Number}        [alpha]
 * @chainable
 * @example
 * <div>
 * <code>
 * // Grayscale integer value.
 * fill(51);
 * rect(20, 20, 60, 60);
 * describe('A dark charcoal gray rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values.
 * fill(255, 204, 0);
 * rect(20, 20, 60, 60);
 * describe('A yellow rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values.
 * colorMode(HSB);
 * fill(255, 204, 100);
 * rect(20, 20, 60, 60);
 * describe('A royal blue rectange with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // A CSS named color.
 * fill('red');
 * rect(20, 20, 60, 60);
 * describe('A red rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Three-digit hexadecimal RGB notation.
 * fill('#fae');
 * rect(20, 20, 60, 60);
 * describe('A pink rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Six-digit hexadecimal RGB notation.
 * fill('#A251FA');
 * rect(20, 20, 60, 60);
 * describe('A purple rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGB notation.
 * fill('rgb(0,255,0)');
 * rect(20, 20, 60, 60);
 * describe('A bright green rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGBA notation.
 * fill('rgba(0,255,0, 0.25)');
 * rect(20, 20, 60, 60);
 * describe('A soft green rectange with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGB notation.
 * fill('rgb(100%,0%,10%)');
 * rect(20, 20, 60, 60);
 * describe('A red rectange with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGBA notation.
 * fill('rgba(100%,0%,100%,0.5)');
 * rect(20, 20, 60, 60);
 * describe('A dark fuchsia rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object.
 * fill(color(0, 0, 255));
 * rect(20, 20, 60, 60);
 * describe('A blue rectangle with a black outline.');
 * </code>
 * </div>
 */

/**
 * @method fill
 * @param  {String}        value   A color string.
 * @chainable
 */

/**
 * @method fill
 * @param  {Number}        gray   A gray value.
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method fill
 * @param  {Number[]}      values  An array containing the red, green, blue &
 *                                 and alpha components of the color.
 * @chainable
 */

/**
 * @method fill
 * @param  {p5.Color}      color   The fill color.
 * @chainable
 */
p5.prototype.fill = function(...args) {
  this._renderer._setProperty('_fillSet', true);
  this._renderer._setProperty('_doFill', true);
  this._renderer.fill(...args);
  return this;
};

/**
 * Disables filling geometry. If both <a href="#/p5/noStroke">noStroke()</a> and <a href="#/p5/noFill">noFill()</a> are called,
 * nothing will be drawn to the screen.
 *
 * @method noFill
 * @chainable
 * @example
 * <div>
 * <code>
 * rect(32, 10, 35, 35);
 * noFill();
 * rect(32, 55, 35, 35);
 * describe('A white rectangle on top of an empty noFill rectangle.');
 * </code>
 * </div>
 *
 * <div modernizr='webgl'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(0);
 *   noFill();
 *   stroke(100, 100, 240);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(45, 45, 45);
 *   describe('A purple cube wireframe spinning on a black canvas.');
 * }
 * </code>
 * </div>
 */
p5.prototype.noFill = function() {
  this._renderer._setProperty('_doFill', false);
  return this;
};

/**
 * Disables drawing the stroke (outline). If both <a href="#/p5/noStroke">noStroke()</a> and <a href="#/p5/noFill">noFill()</a>
 * are called, nothing will be drawn to the screen.
 *
 * @method noStroke
 * @chainable
 * @example
 * <div>
 * <code>
 * noStroke();
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with no outline.');
 * </code>
 * </div>
 *
 * <div modernizr='webgl'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(0);
 *   noStroke();
 *   fill(240, 150, 150);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(45, 45, 45);
 *   describe('A pink cube with no edge outlines spinning on a black canvas.');
 * }
 * </code>
 * </div>
 */
p5.prototype.noStroke = function() {
  this._renderer._setProperty('_doStroke', false);
  return this;
};

/**
 * Sets the color used to draw lines and borders around shapes. Calling `stroke(255, 165, 0)`
 * or stroke('orange') means all shapes drawn after the stroke command will be filled with \
 * the color orange.
 *
 * The version of `stroke()` with one parameter interprets the value one of two
 * ways. If the parameter is a number, it's interpreted as a grayscale value.
 * If the parameter is a string, it's interpreted as a CSS color string. A
 * <a href="#/p5.Color">p5.Color</a> object can also be provided to set the stroke color.
 *
 * The version of `stroke()` with three parameters interprets them as RGB, HSB,
 * or HSL colors, depending on the current <a href="#/p5/colorMode">colorMode()</a>.
 * (The default color space is RGB, with each value in the range from 0 to 255)
 *
 * @method stroke
 * @param  {Number}        v1      Red or hue value relative to
 *                                 the current color range.
 * @param  {Number}        v2      Green or saturation value
 *                                 relative to the current color range.
 * @param  {Number}        v3      Blue or brightness value
 *                                 relative to the current color range.
 * @param  {Number}        [alpha]
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Grayscale integer value.
 * strokeWeight(4);
 * stroke(51);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a dark charcoal gray outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values.
 * stroke(255, 204, 0);
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a yellow outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values.
 * colorMode(HSB);
 * strokeWeight(4);
 * stroke(255, 204, 100);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a royal blue outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // A CSS namee color.
 * stroke('red');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a red outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Three-digit hexadecimal RGB notation.
 * stroke('#fae');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a pink outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Six-digit hexadecimal RGB notation.
 * stroke('#222222');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGB notation.
 * stroke('rgb(0,255,0)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A whiite rectangle with a bright green outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGBA notation.
 * stroke('rgba(0,255,0,0.25)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a soft green outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGB notation.
 * stroke('rgb(100%,0%,10%)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a red outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGBA notation.
 * stroke('rgba(100%,0%,100%,0.5)');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a dark fuchsia outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5 Color object.
 * stroke(color(0, 0, 255));
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a blue outline.');
 * </code>
 * </div>
 */

/**
 * @method stroke
 * @param  {String}        value   A color string.
 * @chainable
 */

/**
 * @method stroke
 * @param  {Number}        gray   A gray value.
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method stroke
 * @param  {Number[]}      values  An array containing the red, green, blue,
 *                                 and alpha components of the color.
 * @chainable
 */

/**
 * @method stroke
 * @param  {p5.Color}      color   The stroke color.
 * @chainable
 */

p5.prototype.stroke = function(...args) {
  this._renderer._setProperty('_strokeSet', true);
  this._renderer._setProperty('_doStroke', true);
  this._renderer.stroke(...args);
  return this;
};

/**
 * All drawing that follows <a href="#/p5/erase">erase()</a> will subtract from
 * the canvas. Erased areas will reveal the web page underneath the canvas. Erasing
 * can be canceled with <a href="#/p5/noErase">noErase()</a>.
 *
 * Drawing done with <a href="#/p5/image">image()</a> and <a href="#/p5/background">
 * background()</a> in between <a href="#/p5/erase">erase()</a> and
 * <a href="#/p5/noErase">noErase()</a> will not erase the canvas but works as usual.
 *
 * @method erase
 * @param  {Number}   [strengthFill]      A number (0-255) for the strength of erasing for a shape's fill.
 *                                        This will default to 255 when no argument is given, which
 *                                        is full strength.
 * @param  {Number}   [strengthStroke]    A number (0-255) for the strength of erasing for a shape's stroke.
 *                                        This will default to 255 when no argument is given, which
 *                                        is full strength.
 *
 * @chainable
 * @example
 * <div>
 * <code>
 * background(100, 100, 250);
 * fill(250, 100, 100);
 * rect(20, 20, 60, 60);
 * erase();
 * ellipse(25, 30, 30);
 * noErase();
 * describe(`60×60 centered pink rect, purple background.
 * Elliptical area in top-left of rect is erased white.`);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * background(150, 250, 150);
 * fill(100, 100, 250);
 * rect(20, 20, 60, 60);
 * strokeWeight(5);
 * erase(150, 255);
 * triangle(50, 10, 70, 50, 90, 10);
 * noErase();
 * describe(`60×60 centered purple rect, mint green background.
 * Triangle in top-right is partially erased with fully erased outline.`);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   smooth();
 *   createCanvas(100, 100, WEBGL);
 *   // Make a &lt;p&gt; element and put it behind the canvas
 *   let p = createP('I am a dom element');
 *   p.center();
 *   p.style('font-size', '20px');
 *   p.style('text-align', 'center');
 *   p.style('z-index', '-9999');
 * }
 *
 * function draw() {
 *   background(250, 250, 150);
 *   fill(15, 195, 185);
 *   noStroke();
 *   sphere(30);
 *   erase();
 *   rotateY(frameCount * 0.02);
 *   translate(0, 0, 40);
 *   torus(15, 5);
 *   noErase();
 *   describe(`60×60 centered teal sphere, yellow background.
 *   Torus rotating around sphere erases to reveal black text underneath.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.erase = function(opacityFill = 255, opacityStroke = 255) {
  this._renderer.erase(opacityFill, opacityStroke);

  return this;
};

/**
 * Ends erasing that was started with <a href="#/p5/erase">erase()</a>.
 * The <a href="#/p5/fill">fill()</a>, <a href="#/p5/stroke">stroke()</a>, and
 * <a href="#/p5/blendMode">blendMode()</a> settings will return to what they were
 * prior to calling <a href="#/p5/erase">erase()</a>.
 *
 * @method noErase
 * @chainable
 * @example
 * <div>
 * <code>
 * background(235, 145, 15);
 * noStroke();
 * fill(30, 45, 220);
 * rect(30, 10, 10, 80);
 * erase();
 * ellipse(50, 50, 60);
 * noErase();
 * rect(70, 10, 10, 80);
 * describe(`Orange background, with two tall blue rectangles.
 * A centered ellipse erased the first blue rect but not the second.`);
 * </code>
 * </div>
 */

p5.prototype.noErase = function() {
  this._renderer.noErase();
  return this;
};

export default p5;
