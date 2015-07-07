/**
 * @module Typography
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

require('../core/error_helpers');


/**
 * Draws text to the screen. Displays the information specified in the first
 * parameter on the screen in the position specified by the additional
 * parameters. A default font will be used unless a font is set with the
 * textFont() function and a default size will be used unless a font is set
 * with textSize(). Change the color of the text with the fill() function.
 * Change the outline of the text with the stroke() and strokeWeight()
 * functions.
 *
 * The text displays in relation to the textAlign() function, which gives the
 * option to draw to the left, right, and center of the coordinates.
 *
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
 * @param {Number} x2  by default, the width of the text box,
 *                     see rectMode() for more info
 * @param {Number} y2  by default, the height of the text box,
 *                     see rectMode() for more info
 * @return {Object} this
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
 */
p5.prototype.text = function(str, x, y, maxWidth, maxHeight) {

  this._validateParameters(
    'text',
    arguments,
    [
      ['*', 'Number', 'Number'],
      ['*', 'Number', 'Number', 'Number', 'Number']
    ]
  );

  return (!(this._doFill || this._doStroke)) ? this :
    this._graphics.text.apply(this._graphics, arguments);
};

/**
 * Sets the current font that will be drawn with the text() function.
 *
 * @method textFont
 * @param {Object|String} f a font loaded via loadFont(), or a String
 *  representing a browser-based dfault font.
 * @return {Object} this
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
 */
p5.prototype.textFont = function(theFont, theSize) {

  if (arguments.length) {

    if (!theFont) {

      throw Error('null font passed to textFont');
    }

    this._setProperty('_textFont', theFont);

    if (theSize) {

      this._setProperty('_textSize', theSize);
      this._setProperty('_textLeading',
        theSize * constants._DEFAULT_LEADMULT);
    }

    return this._graphics._applyTextProperties();
  }

  return this;
};

module.exports = p5;
