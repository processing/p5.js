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
 * Loads an opentype font file (.otf, .ttf) from a file or a URL,
 * and returns a PFont Object. This method is asynchronous,
 * meaning it may not finish before the next line in your sketch
 * is executed.
 *
 * The path to the font should be relative to the HTML file
 * that links in your sketch. Loading fonts from a URL or other
 * remote location may be blocked due to your browser's built-in
 * security.
 *
 * @method loadFont
 * @param  {String}        path       name of the file or url to load
 * @param  {Function}      [callback] function to be executed after
 *                                    <a href="#/p5/loadFont">loadFont()</a> completes
 * @param  {Function}      [onError]  function to be executed if
 *                                    an error occurs
 * @return {p5.Font}                  <a href="#/p5.Font">p5.Font</a> object
 * @example
 *
 * Calling loadFont() inside <a href="#/p5/preload">preload()</a> guarantees
 * that the load operation will have completed before <a href="#/p5/setup">setup()</a>
 * and <a href="#/p5/draw">draw()</a> are called.
 *
 * <div><code>
 * let myFont;
 * function preload() {
 *   myFont = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   fill('#ED225D');
 *   textFont(myFont);
 *   textSize(36);
 *   text('p5*js', 10, 50);
 * }
 * </code></div>
 *
 * Outside of <a href="#/p5/preload">preload()</a>, you may supply a
 * callback function to handle the object:
 *
 * <div><code>
 * function setup() {
 *   loadFont('assets/inconsolata.otf', drawText);
 * }
 *
 * function drawText(font) {
 *   fill('#ED225D');
 *   textFont(font, 36);
 *   text('p5*js', 10, 50);
 * }
 * </code></div>
 *
 * You can also use the font filename string (without the file extension) to
 * style other HTML elements.
 *
 * <div><code>
 * function preload() {
 *   loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   let myDiv = createDiv('hello there');
 *   myDiv.style('font-family', 'Inconsolata');
 * }
 * </code></div>
 *
 * @alt
 * p5*js in p5's theme dark pink
 * p5*js in p5's theme dark pink
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
      console.error(err, path);
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
    const fileExt = lastDotIdx < 1 ? null : fileNoPath.substr(lastDotIdx + 1);

    // if so, add it to the DOM (name-only) for use with DOM module
    if (validFontTypes.includes(fileExt)) {
      fontFamily = fileNoPath.substr(0, lastDotIdx);
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
 * Draws text to the screen. Displays the information specified in the first
 * parameter on the screen in the position specified by the additional
 * parameters. A default font will be used unless a font is set with the
 * <a href="#/p5/textFont">textFont()</a> function and a default size will be
 * used unless a font is set with <a href="#/p5/textSize">textSize()</a>. Change
 * the color of the text with the <a href="#/p5/fill">fill()</a> function. Change
 * the outline of the text with the <a href="#/p5/stroke">stroke()</a> and
 * <a href="#/p5/strokeWeight">strokeWeight()</a> functions.
 *
 * The text displays in relation to the <a href="#/p5/textAlign">textAlign()</a>
 * function, which gives the option to draw to the left, right, and center of the
 * coordinates.
 *
 * The x2 and y2 parameters define a rectangular area to display within and
 * may only be used with string data. When these parameters are specified,
 * they are interpreted based on the current <a href="#/p5/rectMode">rectMode()</a>
 * setting. Text that does not fit completely within the rectangle specified will
 * not be drawn to the screen. If x2 and y2 are not specified, the baseline
 * alignment is the default, which means that the text will be drawn upwards
 * from x and y.
 *
 * <b>WEBGL</b>: Only opentype/truetype fonts are supported. You must load a font
 * using the <a href="#/p5/loadFont">loadFont()</a> method (see the example above).
 * <a href="#/p5/stroke">stroke()</a> currently has no effect in webgl mode.
 *
 * @method text
 * @param {String|Object|Array|Number|Boolean} str the alphanumeric
 *                                             symbols to be displayed
 * @param {Number} x   x-coordinate of text
 * @param {Number} y   y-coordinate of text
 * @param {Number} [x2]  by default, the width of the text box,
 *                     see <a href="#/p5/rectMode">rectMode()</a> for more info
 * @param {Number} [y2]  by default, the height of the text box,
 *                     see <a href="#/p5/rectMode">rectMode()</a> for more info
 * @chainable
 * @example
 * <div>
 * <code>
 * textSize(32);
 * text('word', 10, 30);
 * fill(0, 102, 153);
 * text('word', 10, 60);
 * fill(0, 102, 153, 51);
 * text('word', 10, 90);
 * </code>
 * </div>
 * <div>
 * <code>
 * let s = 'The quick brown fox jumped over the lazy dog.';
 * fill(50);
 * text(s, 10, 10, 70, 80); // Text wraps within text box
 * </code>
 * </div>
 *
 * <div modernizr='webgl'>
 * <code>
 * let inconsolata;
 * function preload() {
 *   inconsolata = loadFont('assets/inconsolata.otf');
 * }
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   textFont(inconsolata);
 *   textSize(width / 3);
 *   textAlign(CENTER, CENTER);
 * }
 * function draw() {
 *   background(0);
 *   let time = millis();
 *   rotateX(time / 1000);
 *   rotateZ(time / 1234);
 *   text('p5.js', 0, 0);
 * }
 * </code>
 * </div>
 *
 * @alt
 * 'word' displayed 3 times going from black, blue to translucent blue
 * The text 'The quick brown fox jumped over the lazy dog' displayed.
 * The text 'p5.js' spinning in 3d
 */
p5.prototype.text = function(str, x, y, maxWidth, maxHeight) {
  p5._validateParameters('text', arguments);
  return !(this._renderer._doFill || this._renderer._doStroke)
    ? this
    : this._renderer.text(...arguments);
};

/**
 * Sets the current font that will be drawn with the <a href="#/p5/text">text()</a> function.
 *
 * <b>WEBGL</b>: Only fonts loaded via <a href="#/p5/loadFont">loadFont()</a> are supported.
 *
 * @method textFont
 * @return {Object} the current font
 *
 * @example
 * <div>
 * <code>
 * fill(0);
 * textSize(12);
 * textFont('Georgia');
 * text('Georgia', 12, 30);
 * textFont('Helvetica');
 * text('Helvetica', 12, 60);
 * </code>
 * </div>
 * <div>
 * <code>
 * let fontRegular, fontItalic, fontBold;
 * function preload() {
 *   fontRegular = loadFont('assets/Regular.otf');
 *   fontItalic = loadFont('assets/Italic.ttf');
 *   fontBold = loadFont('assets/Bold.ttf');
 * }
 * function setup() {
 *   background(210);
 *   fill(0)
    .strokeWeight(0)
    .textSize(10);
 *   textFont(fontRegular);
 *   text('Font Style Normal', 10, 30);
 *   textFont(fontItalic);
 *   text('Font Style Italic', 10, 50);
 *   textFont(fontBold);
 *   text('Font Style Bold', 10, 70);
 * }
 * </code>
 * </div>
 *
 * @alt
 * word 'Georgia' displayed in font Georgia and 'Helvetica' in font Helvetica
 * words Font Style Normal displayed normally, Italic in italic and bold in bold
 */
/**
 * @method textFont
 * @param {Object|String} font a font loaded via <a href="#/p5/loadFont">loadFont()</a>,
 * or a String representing a <a href="https://mzl.la/2dOw8WD">web safe font</a>
 * (a font that is generally available across all systems)
 * @param {Number} [size] the font size to use
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
      this._renderer._setProperty(
        '_textLeading',
        theSize * constants._DEFAULT_LEADMULT
      );
    }

    return this._renderer._applyTextProperties();
  }

  return this._renderer._textFont;
};

export default p5;
