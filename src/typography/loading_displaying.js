/**
 * @module Typography
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import * as constants from '../core/constants';
import * as opentype from 'opentype.js';

import '../core/friendly_errors/validate_params';
import '../core/friendly_errors/file_errors';
import '../core/friendly_errors/fes_core';

/**
 * Loads a font and creates a <a href="#/p5.Font">p5.Font</a> object.
 * `loadFont()` can load fonts in either .otf or .ttf format. Loaded fonts can
 * be used to style text on the canvas and in HTML elements.
 *
 * The first parameter, `path`, is the path to a font file.
 * Paths to local files should be relative. For example,
 * `'assets/inconsolata.otf'`. The Inconsolata font used in the following
 * examples can be downloaded for free
 * <a href="https://www.fontsquirrel.com/fonts/inconsolata" target="_blank">here</a>.
 * Paths to remote files should be URLs. For example,
 * `'https://example.com/inconsolata.otf'`. URLs may be blocked due to browser
 * security.
 *
 * The second parameter, `successCallback`, is optional. If a function is
 * passed, it will be called once the font has loaded. The callback function
 * may use the new <a href="#/p5.Font">p5.Font</a> object if needed.
 *
 * The third parameter, `failureCallback`, is also optional. If a function is
 * passed, it will be called if the font fails to load. The callback function
 * may use the error
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event" target="_blank">Event</a>
 * object if needed.
 *
 * Fonts can take time to load. Calling `loadFont()` in
 * <a href="#/p5/preload">preload()</a> ensures fonts load before they're
 * used in <a href="#/p5/setup">setup()</a> or
 * <a href="#/p5/draw">draw()</a>.
 *
 * @method loadFont
 * @param  {String}        path              path of the font to be loaded.
 * @param  {Function}      [successCallback] function called with the
 *                                           <a href="#/p5.Font">p5.Font</a> object after it
 *                                           loads.
 * @param  {Function}      [failureCallback] function called with the error
 *                                           <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event" target="_blank">Event</a>
 *                                           object if the font fails to load.
 * @return {p5.Font}                         <a href="#/p5.Font">p5.Font</a> object.
 * @example
 *
 * <div>
 * <code>
 * let font;
 *
 * function preload() {
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   fill('deeppink');
 *   textFont(font);
 *   textSize(36);
 *   text('p5*js', 10, 50);
 *
 *   describe('The text "p5*js" written in pink on a white background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   loadFont('assets/inconsolata.otf', font => {
 *     fill('deeppink');
 *     textFont(font);
 *     textSize(36);
 *     text('p5*js', 10, 50);
 *
 *     describe('The text "p5*js" written in pink on a white background.');
 *   });
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   loadFont('assets/inconsolata.otf', success, failure);
 * }
 *
 * function success(font) {
 *   fill('deeppink');
 *   textFont(font);
 *   textSize(36);
 *   text('p5*js', 10, 50);
 *
 *   describe('The text "p5*js" written in pink on a white background.');
 * }
 *
 * function failure(event) {
 *   p5._friendlyError('Oops!', event);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function preload() {
 *   loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   let p = createP('p5*js');
 *   p.style('color', 'deeppink');
 *   p.style('font-family', 'Inconsolata');
 *   p.style('font-size', '36px');
 *   p.position(10, 50);
 *
 *   describe('The text "p5*js" written in pink on a white background.');
 * }
 * </code>
 * </div>
 */
p5.prototype.loadFont = function(path, onSuccess, onError) {
  p5._validateParameters('loadFont', arguments);
  const p5Font = new p5.Font(this);

  const self = this;
  opentype.load(path, (err, font) => {
    if (err) {
      p5._friendlyFileLoadError(4, path);
      if (typeof onError !== 'undefined') {
        return onError(err);
      }
      p5._friendlyError(err, path);
      return;
    }

    p5Font.font = font;

    if (typeof onSuccess !== 'undefined') {
      onSuccess(p5Font);
    }

    self._decrementPreload();

    // check that we have an acceptable font type
    const validFontTypes = ['ttf', 'otf', 'woff', 'woff2'];

    const fileNoPath = path
      .split('\\')
      .pop()
      .split('/')
      .pop();

    const lastDotIdx = fileNoPath.lastIndexOf('.');
    let fontFamily;
    let newStyle;
    const fileExt = lastDotIdx < 1 ? null : fileNoPath.slice(lastDotIdx + 1);

    // if so, add it to the DOM (name-only) for use with DOM module
    if (validFontTypes.includes(fileExt)) {
      fontFamily = fileNoPath.slice(0, lastDotIdx !== -1 ? lastDotIdx : 0);
      newStyle = document.createElement('style');
      newStyle.appendChild(
        document.createTextNode(
          `\n@font-face {\nfont-family: ${fontFamily};\nsrc: url(${path});\n}\n`
        )
      );
      document.head.appendChild(newStyle);
    }
  });

  return p5Font;
};

/**
 * Draws text to the canvas.
 *
 * The first parameter, `str`, is the text to be drawn. The second and third
 * parameters, `x` and `y`, set the coordinates of the text's bottom-left
 * corner. See <a href="#/p5/textAlign">textAlign()</a> for other ways to
 * align text.
 *
 * The fourth and fifth parameters, `maxWidth` and `maxHeight`, are optional.
 * They set the dimensions of the invisible rectangle containing the text. By
 * default, they set its  maximum width and height. See
 * <a href="#/p5/rectMode">rectMode()</a> for other ways to define the
 * rectangular text box. Text will wrap to fit within the text box. Text
 * outside of the box won't be drawn.
 *
 * Text can be styled a few ways. Call the <a href="#/p5/fill">fill()</a>
 * function to set the text's fill color. Call
 * <a href="#/p5/stroke">stroke()</a> and
 * <a href="#/p5/strokeWeight">strokeWeight()</a> to set the text's outline.
 * Call <a href="#/p5/textSize">textSize()</a> and
 * <a href="#/p5/textFont">textFont()</a> to set the text's size and font,
 * respectively.
 *
 * Note: `WEBGL` mode only supports fonts loaded with
 * <a href="#/p5/loadFont">loadFont()</a>. Calling
 * <a href="#/p5/stroke">stroke()</a> has no effect in `WEBGL` mode.
 *
 * @method text
 * @param {String|Object|Array|Number|Boolean} str text to be displayed.
 * @param {Number} x          x-coordinate of the text box.
 * @param {Number} y          y-coordinate of the text box.
 * @param {Number} [maxWidth] maximum width of the text box. See
 *                            <a href="#/p5/rectMode">rectMode()</a> for
 *                            other options.
 * @param {Number} [maxHeight] maximum height of the text box. See
 *                            <a href="#/p5/rectMode">rectMode()</a> for
 *                            other options.
 *
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   text('hi', 50, 50);
 *
 *   describe('The text "hi" written in black in the middle of a gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   background('skyblue');
 *   textSize(100);
 *   text('🌈', 0, 100);
 *
 *   describe('A rainbow in a blue sky.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   textSize(32);
 *   fill(255);
 *   stroke(0);
 *   strokeWeight(4);
 *   text('hi', 50, 50);
 *
 *   describe('The text "hi" written in white with a black outline.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   background('black');
 *   textSize(22);
 *   fill('yellow');
 *   text('rainbows', 6, 20);
 *   fill('cornflowerblue');
 *   text('rainbows', 6, 45);
 *   fill('tomato');
 *   text('rainbows', 6, 70);
 *   fill('limegreen');
 *   text('rainbows', 6, 95);
 *
 *   describe('The text "rainbows" written on several lines, each in a different color.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   let s = 'The quick brown fox jumps over the lazy dog.';
 *   text(s, 10, 10, 70, 80);
 *
 *   describe('The sample text "The quick brown fox..." written in black across several lines.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   rectMode(CENTER);
 *   let s = 'The quick brown fox jumps over the lazy dog.';
 *   text(s, 50, 50, 70, 80);
 *
 *   describe('The sample text "The quick brown fox..." written in black across several lines.');
 * }
 * </code>
 * </div>
 *
 * <div modernizr='webgl'>
 * <code>
 * let font;
 *
 * function preload() {
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   textFont(font);
 *   textSize(32);
 *   textAlign(CENTER, CENTER);
 * }
 *
 * function draw() {
 *   background(0);
 *   rotateY(frameCount / 30);
 *   text('p5*js', 0, 0);
 *
 *   describe('The text "p5*js" written in white and spinning in 3D.');
 * }
 * </code>
 * </div>
 */
p5.prototype.text = function(str, x, y, maxWidth, maxHeight) {
  p5._validateParameters('text', arguments);
  return !(this._renderer._doFill || this._renderer._doStroke)
    ? this
    : this._renderer.text(...arguments);
};

/**
 * Sets the font used by the <a href="#/p5/text">text()</a> function.
 *
 * The first parameter, `font`, sets the font. `textFont()` recognizes either
 * a <a href="#/p5.Font">p5.Font</a> object or a string with the name of a
 * system font. For example, `'Courier New'`.
 *
 * The second parameter, `size`, is optional. It sets the font size in pixels.
 * This has the same effect as calling <a href="#/p5/textSize">textSize()</a>.
 *
 * Note: `WEBGL` mode only supports fonts loaded with
 * <a href="#/p5/loadFont">loadFont()</a>.
 *
 * @method textFont
 * @return {Object} current font or p5 Object.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   textFont('Courier New');
 *   textSize(24);
 *   text('hi', 35, 55);
 *
 *   describe('The text "hi" written in a black, monospace font on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   background('black');
 *   fill('palegreen');
 *   textFont('Courier New', 10);
 *   text('You turn to the left and see a door. Do you enter?', 5, 5, 90, 90);
 *   text('>', 5, 70);
 *
 *   describe('A text prompt from a game is written in a green, monospace font on a black background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   textFont('Verdana');
 *   let currentFont = textFont();
 *   text(currentFont, 25, 50);
 *
 *   describe('The text "Verdana" written in a black, sans-serif font on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let fontRegular;
 * let fontItalic;
 * let fontBold;
 *
 * function preload() {
 *   fontRegular = loadFont('assets/Regular.otf');
 *   fontItalic = loadFont('assets/Italic.ttf');
 *   fontBold = loadFont('assets/Bold.ttf');
 * }
 *
 * function setup() {
 *   background(200);
 *   textFont(fontRegular);
 *   text('I am Normal', 10, 30);
 *   textFont(fontItalic);
 *   text('I am Italic', 10, 50);
 *   textFont(fontBold);
 *   text('I am Bold', 10, 70);
 *
 *   describe('The statements "I am Normal", "I am Italic", and "I am Bold" written in black on separate lines. The statements have normal, italic, and bold fonts, respectively.');
 * }
 * </code>
 * </div>
 */
/**
 * @method textFont
 * @param {Object|String} font font as a <a href="#/p5.Font">p5.Font</a> object or a string.
 * @param {Number} [size] font size in pixels.
 * @chainable
 */
p5.prototype.textFont = function(theFont, theSize) {
  p5._validateParameters('textFont', arguments);
  if (arguments.length) {
    if (!theFont) {
      throw new Error('null font passed to textFont');
    }

    this._renderer._setProperty('_textFont', theFont);

    if (theSize) {
      this._renderer._setProperty('_textSize', theSize);
      if (!this._renderer._leadingSet) {
        // only use a default value if not previously set (#5181)
        this._renderer._setProperty(
          '_textLeading',
          theSize * constants._DEFAULT_LEADMULT
        );
      }
    }

    return this._renderer._applyTextProperties();
  }

  return this._renderer._textFont;
};

export default p5;
