/**
 * @module Typography
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');
var opentype = require('opentype.js');

require('../core/error_helpers');

/**
 * Loads an opentype font file (.otf, .ttf) from a file or a URL,
 * and returns a PFont Object. This method is asynchronous,
 * meaning it may not finish before the next line in your sketch
 * is executed.
 * <br><br>
 * The path to the font should be relative to the HTML file
 * that links in your sketch. Loading an from a URL or other
 * remote location may be blocked due to your browser's built-in
 * security.
 *
 * @method loadFont
 * @param  {String}        path       name of the file or url to load
 * @param  {Function}      [callback] function to be executed after
 *                                    loadFont()
 *                                    completes
 * @return {p5.Font}                  p5.Font object
 * @example
 *
 * <p>Calling loadFont() inside preload() guarantees that the load
 * operation will have completed before setup() and draw() are called.</p>
 *
 * <div><code>
 * var myFont;
 * function preload() {
 *   myFont = loadFont('assets/AvenirNextLTPro-Demi.otf');
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
 * Outside of preload(), you may supply a callback function to handle the
 * object:
 *
 * <div><code>
 * function setup() {
 *   loadFont('assets/AvenirNextLTPro-Demi.otf', drawText);
 * }
 *
 * function drawText(font) {
 *   fill('#ED225D');
 *   textFont(font, 36);
 *   text('p5*js', 10, 50);
 * }
 *
 * </code></div>
 *
 * <p>You can also use the string name of the font to style other HTML
 * elements.</p>
 *
 * <div><code>
 * var myFont;
 *
 * function preload() {
 *   myFont = loadFont('assets/Avenir.otf');
 * }
 *
 * function setup() {
 *   var myDiv = createDiv('hello there');
 *   myDiv.style('font-family', 'Avenir');
 * }
 * </code></div>
 *
 * @alt
 * p5*js in p5's theme dark pink
 * p5*js in p5's theme dark pink
 *
 */
p5.prototype.loadFont = function (path, onSuccess, onError) {

  var p5Font = new p5.Font(this);

  var self = this;
  opentype.load(path, function (err, font) {

    if (err) {

      if (typeof onError !== 'undefined') {
        return onError(err);
      }
      p5._friendlyFileLoadError(4, path);
      console.error(err, path);
      return;
    }

    p5Font.font = font;

    if (typeof onSuccess !== 'undefined') {
      onSuccess(p5Font);
    }

    self._decrementPreload();

    // check that we have an acceptable font type
    var validFontTypes = [ 'ttf', 'otf', 'woff', 'woff2' ],
      fileNoPath = path.split('\\').pop().split('/').pop(),
      lastDotIdx = fileNoPath.lastIndexOf('.'), fontFamily, newStyle,
      fileExt = lastDotIdx < 1 ? null : fileNoPath.substr(lastDotIdx + 1);

    // if so, add it to the DOM (name-only) for use with p5.dom
    if (validFontTypes.indexOf(fileExt) > -1) {

      fontFamily = fileNoPath.substr(0, lastDotIdx);
      newStyle = document.createElement('style');
      newStyle.appendChild(document.createTextNode('\n@font-face {' +
        '\nfont-family: ' + fontFamily + ';\nsrc: url(' + path + ');\n}\n'));
      document.head.appendChild(newStyle);
    }

  });

  return p5Font;
};

/**
 * Draws text to the screen. Displays the information specified in the first
 * parameter on the screen in the position specified by the additional
 * parameters. A default font will be used unless a font is set with the
 * textFont() function and a default size will be used unless a font is set
 * with textSize(). Change the color of the text with the fill() function.
 * Change the outline of the text with the stroke() and strokeWeight()
 * functions.
 * <br><br>
 * The text displays in relation to the textAlign() function, which gives the
 * option to draw to the left, right, and center of the coordinates.
 * <br><br>
 * The x2 and y2 parameters define a rectangular area to display within and
 * may only be used with string data. When these parameters are specified,
 * they are interpreted based on the current rectMode() setting. Text that
 * does not fit completely within the rectangle specified will not be drawn
 * to the screen.
 *
 * @method text
 * @param {String} str the alphanumeric symbols to be displayed
 * @param {Number} x   x-coordinate of text
 * @param {Number} y   y-coordinate of text
 * @param {Number} [x2]  by default, the width of the text box,
 *                     see rectMode() for more info
 * @param {Number} [y2]  by default, the height of the text box,
 *                     see rectMode() for more info
 * @return {p5} this
 * @example
 * <div>
 * <code>
 * textSize(32);
 * text("word", 10, 30);
 * fill(0, 102, 153);
 * text("word", 10, 60);
 * fill(0, 102, 153, 51);
 * text("word", 10, 90);
 * </code>
 * </div>
 * <div>
 * <code>
 * s = "The quick brown fox jumped over the lazy dog.";
 * fill(50);
 * text(s, 10, 10, 70, 80); // Text wraps within text box
 * </code>
 * </div>
 *
 * @alt
 *'word' displayed 3 times going from black, blue to translucent blue
 * The quick brown fox jumped over the lazy dog.
 *
 */
p5.prototype.text = function(str, x, y, maxWidth, maxHeight) {
  return (!(this._renderer._doFill || this._renderer._doStroke)) ? this :
    this._renderer.text.apply(this._renderer, arguments);
};

/**
 * Sets the current font that will be drawn with the text() function.
 *
 * @method textFont
 * @return {Object} the current font
 *
 * @example
 * <div>
 * <code>
 * fill(0);
 * textSize(12);
 * textFont("Georgia");
 * text("Georgia", 12, 30);
 * textFont("Helvetica");
 * text("Helvetica", 12, 60);
 * </code>
 * </div>
 * <div>
 * <code>
 * var fontRegular, fontItalic, fontBold;
 * function preload() {
 *    fontRegular = loadFont("assets/Regular.otf");
 *    fontItalic = loadFont("assets/Italic.ttf");
 *    fontBold = loadFont("assets/Bold.ttf");
 * }
 * function setup() {
 *    background(210);
 *    fill(0).strokeWeight(0).textSize(10);
 *    textFont(fontRegular);
 *    text("Font Style Normal", 10, 30);
 *    textFont(fontItalic);
 *    text("Font Style Italic", 10, 50);
 *    textFont(fontBold);
 *    text("Font Style Bold", 10, 70);
 * }
 * </code>
 * </div>
 *
 * @alt
 *words Font Style Normal displayed normally, Italic in italic and bold in bold
 */
/**
 * @method textFont
 * @param {Object|String} font a font loaded via loadFont(), or a String
 * representing a <a href="https://mzl.la/2dOw8WD">web safe font</a> (a font
 * that is generally available across all systems)
 * @param {Number} [size] the font size to use
 * @chainable
 */
p5.prototype.textFont = function(theFont, theSize) {

  if (arguments.length) {

    if (!theFont) {

      throw Error('null font passed to textFont');
    }

    this._renderer._setProperty('_textFont', theFont);

    if (theSize) {

      this._renderer._setProperty('_textSize', theSize);
      this._renderer._setProperty('_textLeading', theSize * constants._DEFAULT_LEADMULT);
    }

    return this._renderer._applyTextProperties();
  }

  return this._renderer._textFont;
};

module.exports = p5;
