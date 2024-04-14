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
 * Start defining a shape that will mask subsequent things drawn to the canvas.
 * Only opaque regions of the mask shape will allow content to be drawn.
 * Any shapes drawn between this and <a href="#/p5/endClip">endClip()</a> will
 * contribute to the mask shape.
 *
 * The mask will apply to anything drawn after this call. To draw without a mask, contain
 * the code to apply the mask and to draw the masked content between
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a>.
 *
 * Alternatively, rather than drawing the mask between this and
 * <a href="#/p5/endClip">endClip()</a>, draw the mask in a callback function
 * passed to <a href="#/p5/clip">clip()</a>.
 *
 * Options can include:
 * - `invert`: A boolean specifying whether or not to mask the areas *not* filled by the mask shape. Defaults to false.
 *
 * @method beginClip
 * @param {Object} [options] An object containing clip settings.
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 *
 * // Mask in some shapes
 * push();
 * beginClip();
 * triangle(15, 37, 30, 13, 43, 37);
 * circle(45, 45, 7);
 * endClip();
 *
 * fill('red');
 * rect(5, 5, 45, 45);
 * pop();
 *
 * translate(50, 50);
 *
 * // Mask out the same shapes
 * push();
 * beginClip({ invert: true });
 * triangle(15, 37, 30, 13, 43, 37);
 * circle(45, 45, 7);
 * endClip();
 *
 * fill('red');
 * rect(5, 5, 45, 45);
 * pop();
 * </code>
 * </div>
 *
 * @alt
 * In the top left, a red triangle and circle. In the bottom right, a red
 * square with a triangle and circle cut out of it.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(255);
 *   noStroke();
 *
 *   beginClip();
 *   push();
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   scale(0.5);
 *   torus(30, 15);
 *   pop();
 *   endClip();
 *
 *   beginShape(QUAD_STRIP);
 *   fill(0, 255, 255);
 *   vertex(-width/2, -height/2);
 *   vertex(width/2, -height/2);
 *   fill(100, 0, 100);
 *   vertex(-width/2, height/2);
 *   vertex(width/2, height/2);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * A silhouette of a rotating torus colored with a gradient from
 * cyan to purple
 */
p5.prototype.beginClip = function(options = {}) {
  this._renderer.beginClip(options);
};

/**
 * Finishes defining a shape that will mask subsequent things drawn to the canvas.
 * Only opaque regions of the mask shape will allow content to be drawn.
 * Any shapes drawn between <a href="#/p5/beginClip">beginClip()</a> and this
 * will contribute to the mask shape.
 *
 * @method endClip
 */
p5.prototype.endClip = function() {
  this._renderer.endClip();
};

/**
 * Use the shape drawn by a callback function to mask subsequent things drawn to the canvas.
 * Only opaque regions of the mask shape will allow content to be drawn.
 *
 * The mask will apply to anything drawn after this call. To draw without a mask, contain
 * the code to apply the mask and to draw the masked content between
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a>.
 *
 * Alternatively, rather than drawing the mask shape in a function, draw the
 * shape between <a href="#/p5/beginClip">beginClip()</a> and <a href="#/p5/endClip">endClip()</a>.
 *
 * Options can include:
 * - `invert`: A boolean specifying whether or not to mask the areas *not* filled by the mask shape. Defaults to false.
 *
 * @method clip
 * @param {Function} callback A function that draws the mask shape.
 * @param {Object} [options] An object containing clip settings.
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 *
 * // Mask in some shapes
 * push();
 * clip(() => {
 *   triangle(15, 37, 30, 13, 43, 37);
 *   circle(45, 45, 7);
 * });
 *
 * fill('red');
 * rect(5, 5, 45, 45);
 * pop();
 *
 * translate(50, 50);
 *
 * // Mask out the same shapes
 * push();
 * clip(() => {
 *   triangle(15, 37, 30, 13, 43, 37);
 *   circle(45, 45, 7);
 * }, { invert: true });
 *
 * fill('red');
 * rect(5, 5, 45, 45);
 * pop();
 * </code>
 * </div>
 *
 * @alt
 * In the top left, a red triangle and circle. In the bottom right, a red
 * square with a triangle and circle cut out of it.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(255);
 *   noStroke();
 *
 *   clip(() => {
 *     push();
 *     rotateX(frameCount * 0.01);
 *     rotateY(frameCount * 0.01);
 *     scale(0.5);
 *     torus(30, 15);
 *     pop();
 *   });
 *
 *   beginShape(QUAD_STRIP);
 *   fill(0, 255, 255);
 *   vertex(-width/2, -height/2);
 *   vertex(width/2, -height/2);
 *   fill(100, 0, 100);
 *   vertex(-width/2, height/2);
 *   vertex(width/2, height/2);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * A silhouette of a rotating torus colored with a gradient from
 * cyan to purple
 */
p5.prototype.clip = function(callback, options) {
  this._renderer.beginClip(options);
  callback();
  this._renderer.endClip(options);
};

/**
 * Sets the color used for the background of the canvas. By default, the
 * background is transparent. This function is typically used within
 * <a href="#/p5/draw">draw()</a> to clear the display window at the beginning
 * of each frame. It can also be used inside <a href="#/p5/setup">setup()</a> to
 * set the background on the first frame of animation.
 *
 * The version of `background()` with one parameter interprets the value one of four
 * ways. If the parameter is a number, it's interpreted as a grayscale value.
 * If the parameter is a string, it's interpreted as a CSS color string.  RGB, RGBA,
 * HSL, HSLA, hex, and named color strings are supported. If the parameter is a
 * <a href="#/p5.Color">p5.Color</a> object, it will be used as the background color.
 * If the parameter is a <a href="#/p5.Image">p5.Image</a> object, it will be used as
 * the background image.
 *
 * The version of `background()` with two parameters interprets the first one as a
 * grayscale value. The second parameter sets the alpha (transparency) value.
 *
 * The version of `background()` with three parameters interprets them as RGB, HSB,
 * or HSL colors, depending on the current <a href="#/p5/colorMode">colorMode()</a>.
 * By default, colors are specified in RGB values. Calling background(255, 204, 0)
 * sets the background a bright yellow color.
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
 * // Three-digit hex RGB notation.
 * background('#fae');
 * describe('A canvas with a pink background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Six-digit hex RGB notation.
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
 * // A p5.Color object.
 * let c = color(0, 0, 255);
 * background(c);
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
 * @param {Number} gray   specifies a value between white and black.
 * @param {Number} [a]
 * @chainable
 */

/**
 * @method background
 * @param {Number} v1     red value if color mode is RGB, or hue value if color mode is HSB.
 * @param {Number} v2     green value if color mode is RGB, or saturation value if color mode is HSB.
 * @param {Number} v3     blue value if color mode is RGB, or brightness value if color mode is HSB.
 * @param  {Number} [a]
 * @chainable
 */

/**
 * @method background
 * @param  {Number[]}      values  an array containing the red, green, blue
 *                                 and alpha components of the color.
 * @chainable
 */

/**
 * @method background
 * @param {p5.Image} image     image created with <a href="#/p5/loadImage">loadImage()</a>
 *                             or <a href="#/p5/createImage">createImage()</a>,
 *                             to set as background.
 *                             (must be same size as the sketch window).
 * @param  {Number}  [a]
 * @chainable
 */
p5.prototype.background = function(...args) {
  this._renderer.background(...args);
  return this;
};

/**
 * Clears the pixels on the canvas. This function makes every pixel 100%
 * transparent. Calling `clear()` doesn't clear objects created by `createX()`
 * functions such as <a href="#/p5/createGraphics">createGraphics()</a>,
 * <a href="#/p5/createVideo">createVideo()</a>, and
 * <a href="#/p5/createImg">createImg()</a>. These objects will remain
 * unchanged after calling clear() and can be redrawn.
 *
 * In WebGL mode, this function can clear the screen to a specific color. It
 * interprets four numeric parameters as normalized RGBA color values. It also
 * clears the depth buffer. If you are not using the WebGL renderer, these
 * parameters will have no effect.
 *
 * @method clear
 * @chainable
 * @example
 * <div>
 * <code>
 * function draw() {
 *   circle(mouseX, mouseY, 20);
 *   describe('A white circle is drawn at the mouse x- and y-coordinates.');
 * }
 *
 * function mousePressed() {
 *   clear();
 *   background(128);
 *   describe('The canvas is cleared when the mouse is clicked.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   background(200);
 *
 *   pg = createGraphics(60, 60);
 *   pg.background(200);
 *   pg.noStroke();
 *   pg.circle(pg.width / 2, pg.height / 2, 15);
 *   image(pg, 20, 20);
 *   describe('A white circle drawn on a gray square. The square gets smaller when the mouse is pressed.');
 * }
 *
 * function mousePressed() {
 *   clear();
 *   image(pg, 20, 20);
 * }
 * </code>
 * </div>
 *
 * @param {Number} [r] normalized red value.
 * @param {Number} [g] normalized green value.
 * @param {Number} [b] normalized blue value.
 * @param {Number} [a] normalized alpha value.
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
 * Changes the way p5.js interprets color data. By default, the numeric
 * parameters for <a href="#/p5/fill">fill()</a>,
 * <a href="#/p5/stroke">stroke()</a>,
 * <a href="#/p5/background">background()</a>, and
 * <a href="#/p5/color">color()</a> are defined by values between 0 and 255
 * using the RGB color model. This is equivalent to calling
 * `colorMode(RGB, 255)`. Pure red is `color(255, 0, 0)` in this model.
 *
 * Calling `colorMode(RGB, 100)` sets colors to be interpreted as RGB color
 * values between 0 and 100.  Pure red is `color(100, 0, 0)` in this model.
 *
 * Calling `colorMode(HSB)` or `colorMode(HSL)` changes to HSB or HSL system
 * instead of RGB.
 *
 * <a href="#/p5.Color">p5.Color</a> objects remember the mode that they were
 * created in. Changing modes doesn't affect their appearance.
 *
 * @method colorMode
 * @param {(RGB|HSB|HSL)} mode   either RGB, HSB or HSL, corresponding to
 *                          Red/Green/Blue and Hue/Saturation/Brightness
 *                          (or Lightness).
 * @param {Number}  [max]  range for all values.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * noStroke();
 * colorMode(RGB, 100);
 * for (let i = 0; i < 100; i += 1) {
 *   for (let j = 0; j < 100; j += 1) {
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
 * noStroke();
 * colorMode(HSB, 100);
 * for (let i = 0; i < 100; i++) {
 *   for (let j = 0; j < 100; j++) {
 *     stroke(i, j, 100);
 *     point(i, j);
 *   }
 * }
 * describe('A rainbow gradient from left-to-right. Brightness transitions to white at the top.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * colorMode(RGB, 255);
 * let myColor = color(180, 175, 230);
 * background(myColor);
 * colorMode(RGB, 1);
 * let redValue = red(myColor);
 * let greenValue = green(myColor);
 * let blueValue = blue(myColor);
 * text(`Red: ${redValue}`, 10, 10, 80, 80);
 * text(`Green: ${greenValue}`, 10, 40, 80, 80);
 * text(`Blue: ${blueValue}`, 10, 70, 80, 80);
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
 * circle(40, 40, 50);
 * circle(50, 60, 50);
 * describe('Two overlapping translucent pink circle outlines.');
 * </code>
 * </div>
 *
 */

/**
 * @method colorMode
 * @param {(RGB|HSB|HSL)} mode
 * @param {Number} max1     range for the red or hue depending on the
 *                              current color mode.
 * @param {Number} max2     range for the green or saturation depending
 *                              on the current color mode.
 * @param {Number} max3     range for the blue or brightness/lightness
 *                              depending on the current color mode.
 * @param {Number} [maxA]   range for the alpha.
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
 * Sets the color used to fill shapes. Calling `fill(255, 165, 0)` or
 * `fill('orange')` means all shapes drawn after the fill command will be
 * filled with the color orange.
 *
 * The version of `fill()` with one parameter interprets the value one of
 * three ways. If the parameter is a number, it's interpreted as a grayscale
 * value. If the parameter is a string, it's interpreted as a CSS color
 * string. A <a href="#/p5.Color">p5.Color</a> object can also be provided to
 * set the fill color.
 *
 * The version of `fill()` with three parameters interprets them as RGB, HSB,
 * or HSL colors, depending on the current
 * <a href="#/p5/colorMode">colorMode()</a>. The default color space is RGB,
 * with each value in the range from 0 to 255.
 *
 * @method fill
 * @param  {Number}        v1      red value if color mode is RGB or hue value if color mode is HSB.
 * @param  {Number}        v2      green value if color mode is RGB or saturation value if color mode is HSB.
 * @param  {Number}        v3      blue value if color mode is RGB or brightness value if color mode is HSB.
 * @param  {Number}        [alpha]
 * @chainable
 * @example
 * <div>
 * <code>
 * // Grayscale integer value.
 * fill(51);
 * square(20, 20, 60);
 * describe('A dark charcoal gray square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // R, G & B integer values.
 * fill(255, 204, 0);
 * square(20, 20, 60);
 * describe('A yellow square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // H, S & B integer values.
 * colorMode(HSB);
 * fill(255, 204, 100);
 * square(20, 20, 60);
 * describe('A royal blue square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // A CSS named color.
 * fill('red');
 * square(20, 20, 60);
 * describe('A red square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Three-digit hex RGB notation.
 * fill('#fae');
 * square(20, 20, 60);
 * describe('A pink square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Six-digit hex RGB notation.
 * fill('#A251FA');
 * square(20, 20, 60);
 * describe('A purple square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGB notation.
 * fill('rgb(0,255,0)');
 * square(20, 20, 60);
 * describe('A bright green square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Integer RGBA notation.
 * fill('rgba(0,255,0, 0.25)');
 * square(20, 20, 60);
 * describe('A soft green rectange with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGB notation.
 * fill('rgb(100%,0%,10%)');
 * square(20, 20, 60);
 * describe('A red square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Percentage RGBA notation.
 * fill('rgba(100%,0%,100%,0.5)');
 * square(20, 20, 60);
 * describe('A dark fuchsia square with a black outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // p5.Color object.
 * let c = color(0, 0, 255);
 * fill(c);
 * square(20, 20, 60);
 * describe('A blue square with a black outline.');
 * </code>
 * </div>
 */

/**
 * @method fill
 * @param  {String}        value   a color string.
 * @chainable
 */

/**
 * @method fill
 * @param  {Number}        gray   a grayscale value.
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method fill
 * @param  {Number[]}      values  an array containing the red, green, blue &
 *                                 and alpha components of the color.
 * @chainable
 */

/**
 * @method fill
 * @param  {p5.Color}      color   the fill color.
 * @chainable
 */
p5.prototype.fill = function(...args) {
  this._renderer._setProperty('_fillSet', true);
  this._renderer._setProperty('_doFill', true);
  this._renderer.fill(...args);
  return this;
};

/**
 * Disables setting the interior color of shapes. This is the same as making
 * the fill completely transparent. If both
 * <a href="#/p5/noStroke">noStroke()</a> and
 * <a href="#/p5/noFill">noFill()</a> are called, nothing will be drawn to the
 * screen.
 *
 * @method noFill
 * @chainable
 * @example
 * <div>
 * <code>
 * square(32, 10, 35);
 * noFill();
 * square(32, 55, 35);
 * describe('A white square on top of an empty square. Both squares have black outlines.');
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
 * Disables drawing the stroke (outline). If both
 * <a href="#/p5/noStroke">noStroke()</a> and
 * <a href="#/p5/noFill">noFill()</a> are called, nothing will be drawn to the
 * screen.
 *
 * @method noStroke
 * @chainable
 * @example
 * <div>
 * <code>
 * noStroke();
 * square(20, 20, 60);
 * describe('A white square with no outline.');
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
 * Sets the color used to draw lines and borders around shapes. Calling
 * `stroke(255, 165, 0)` or `stroke('orange')` means all shapes drawn after
 * the `stroke()` command will be filled with the color orange. The way these
 * parameters are interpreted may be changed with the
 * <a href="#/p5/colorMode">colorMode()</a> function.
 *
 * The version of `stroke()` with one parameter interprets the value one of
 * three ways. If the parameter is a number, it's interpreted as a grayscale
 * value. If the parameter is a string, it's interpreted as a CSS color
 * string. A <a href="#/p5.Color">p5.Color</a> object can also be provided to
 * set the stroke color.
 *
 * The version of `stroke()` with two parameters interprets the first one as a
 * grayscale value. The second parameter sets the alpha (transparency) value.
 *
 * The version of `stroke()` with three parameters interprets them as RGB, HSB,
 * or HSL colors, depending on the current `colorMode()`.
 *
 * The version of `stroke()` with four parameters interprets them as RGBA, HSBA,
 * or HSLA colors, depending on the current `colorMode()`. The last parameter
 * sets the alpha (transparency) value.
 *
 * @method stroke
 * @param  {Number}        v1      red value if color mode is RGB or hue value if color mode is HSB.
 * @param  {Number}        v2      green value if color mode is RGB or saturation value if color mode is HSB.
 * @param  {Number}        v3      blue value if color mode is RGB or brightness value if color mode is HSB.
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
 * // A CSS named color.
 * stroke('red');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a red outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Three-digit hex RGB notation.
 * stroke('#fae');
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a pink outline.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Six-digit hex RGB notation.
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
 * // p5.Color object.
 * stroke(color(0, 0, 255));
 * strokeWeight(4);
 * rect(20, 20, 60, 60);
 * describe('A white rectangle with a blue outline.');
 * </code>
 * </div>
 */

/**
 * @method stroke
 * @param  {String}        value   a color string.
 * @chainable
 */

/**
 * @method stroke
 * @param  {Number}        gray   a grayscale value.
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method stroke
 * @param  {Number[]}      values  an array containing the red, green, blue,
 *                                 and alpha components of the color.
 * @chainable
 */

/**
 * @method stroke
 * @param  {p5.Color}      color   the stroke color.
 * @chainable
 */

p5.prototype.stroke = function(...args) {
  this._renderer._setProperty('_strokeSet', true);
  this._renderer._setProperty('_doStroke', true);
  this._renderer.stroke(...args);
  return this;
};

/**
 * All drawing that follows <a href="#/p5/erase">erase()</a> will subtract
 * from the canvas, revealing the web page underneath. The erased areas will
 * become transparent, allowing the content behind the canvas to show through.
 * The <a href="#/p5/fill">fill()</a>, <a href="#/p5/stroke">stroke()</a>, and
 * <a href="#/p5/blendMode">blendMode()</a> have no effect once `erase()` is
 * called.
 *
 * The `erase()` function has two optional parameters. The first parameter
 * sets the strength of erasing by the shape's interior. A value of 0 means
 * that no erasing will occur. A value of 255 means that the shape's interior
 * will fully erase the content underneath. The default value is 255
 * (full strength).
 *
 * The second parameter sets the strength of erasing by the shape's edge. A
 * value of 0 means that no erasing will occur. A value of 255 means that the
 * shape's edge will fully erase the content underneath. The default value is
 * 255 (full strength).
 *
 * To cancel the erasing effect, use the <a href="#/p5/noErase">noErase()</a>
 * function.
 *
 * `erase()` has no effect on drawing done with the
 * <a href="#/p5/image">image()</a> and
 * <a href="#/p5/background">background()</a> functions.
 *
 * @method erase
 * @param  {Number}   [strengthFill]      a number (0-255) for the strength of erasing under a shape's interior.
 *                                        Defaults to 255, which is full strength.
 * @param  {Number}   [strengthStroke]    a number (0-255) for the strength of erasing under a shape's edge.
 *                                        Defaults to 255, which is full strength.
 *
 * @chainable
 * @example
 * <div>
 * <code>
 * background(100, 100, 250);
 * fill(250, 100, 100);
 * square(20, 20, 60);
 * erase();
 * circle(25, 30, 30);
 * noErase();
 * describe('A purple canvas with a pink square in the middle. A circle is erased from the top-left, leaving a white hole.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let p = createP('I am a DOM element');
 * p.style('font-size', '12px');
 * p.style('width', '65px');
 * p.style('text-align', 'center');
 * p.position(18, 26);
 *
 * background(100, 170, 210);
 * erase(200, 100);
 * circle(50, 50, 77);
 * noErase();
 * describe('A blue canvas with a circular hole in the center that reveals the message "I am a DOM element".');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * background(150, 250, 150);
 * fill(100, 100, 250);
 * square(20, 20, 60);
 * strokeWeight(5);
 * erase(150, 255);
 * triangle(50, 10, 70, 50, 90, 10);
 * noErase();
 * describe('A mint green canvas with a purple square in the center. A triangle in the top-right corner partially erases its interior and a fully erases its outline.');
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
 * <a href="#/p5/blendMode">blendMode()</a> settings will return to what they
 * were prior to calling <a href="#/p5/erase">erase()</a>.
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
 * circle(50, 50, 60);
 * noErase();
 * rect(70, 10, 10, 80);
 * describe('An orange canvas with two tall blue rectangles. A circular hole in the center erases the rectangle on the left but not the one on the right.');
 * </code>
 * </div>
 */
p5.prototype.noErase = function() {
  this._renderer.noErase();
  return this;
};

export default p5;
