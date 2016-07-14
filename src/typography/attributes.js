/**
 * @module Typography
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');

/**
 * Sets the current alignment for drawing text. Accepts two
 * arguments: horizAlign (LEFT, CENTER, or RIGHT) and
 * vertAlign (TOP, BOTTOM, CENTER, or BASELINE).
 *
 * The horizAlign parameter is in reference to the x value
 * of the text() function, while the vertAlign parameter is
 * in reference to the y value.
 *
 * So if you write textAlign(LEFT), you are aligning the left
 * edge of your text to the x value you give in text(). If you
 * write textAlign(RIGHT, TOP), you are aligning the right edge
 * of your text to the x value and the top of edge of the text
 * to the y value.
 *
 * @method textAlign
 * @param {Constant} horizAlign horizontal alignment, either LEFT,
 *                            CENTER, or RIGHT
 * @param {Constant} vertAlign vertical alignment, either TOP,
 *                            BOTTOM, CENTER, or BASELINE
 * @return {Number}
 * @example
 * <div>
 * <code>
 * textSize(16);
 * textAlign(RIGHT);
 * text("ABCD", 50, 30);
 * textAlign(CENTER);
 * text("EFGH", 50, 50);
 * textAlign(LEFT);
 * text("IJKL", 50, 70);
 * </code>
 * </div>
 */
p5.prototype.textAlign = function(horizAlign, vertAlign) {
  return this._renderer.textAlign.apply(this._renderer, arguments);
};

/**
 * Sets/gets the spacing, in pixels, between lines of text. This
 * setting will be used in all subsequent calls to the text() function.
 *
 * @method textLeading
 * @param {Number} leading the size in pixels for spacing between lines
 * @return {Object|Number}
 * @example
 * <div>
 * <code>
 * // Text to display. The "\n" is a "new line" character
 * lines = "L1\nL2\nL3";
 * textSize(12);
 *
 * textLeading(10);  // Set leading to 10
 * text(lines, 10, 25);
 *
 * textLeading(20);  // Set leading to 20
 * text(lines, 40, 25);
 *
 * textLeading(30);  // Set leading to 30
 * text(lines, 70, 25);
 * </code>
 * </div>
 */
p5.prototype.textLeading = function(theLeading) {
  return this._renderer.textLeading.apply(this._renderer, arguments);
};

/**
 * Sets/gets the current font size. This size will be used in all subsequent
 * calls to the text() function. Font size is measured in pixels.
 *
 * @method textSize
 * @param {Number} theSize the size of the letters in units of pixels
 * @return {Object|Number}
 * @example
 * <div>
 * <code>
 * textSize(12);
 * text("Font Size 12", 10, 30);
 * textSize(14);
 * text("Font Size 14", 10, 60);
 * textSize(16);
 * text("Font Size 16", 10, 90);
 * </code>
 * </div>
 */
p5.prototype.textSize = function(theSize) {
  return this._renderer.textSize.apply(this._renderer, arguments);
};

/**
 * Sets/gets the style of the text for system fonts to NORMAL, ITALIC, or BOLD.
 * Note: this may be is overridden by CSS styling. For non-system fonts
 * (opentype, truetype, etc.) please load styled fonts instead.
 *
 * @method textStyle
 * @param {Number/Constant} theStyle styling for text, either NORMAL,
 *                            ITALIC, or BOLD
 * @return {Object|String}
 * @example
 * <div>
 * <code>
 * strokeWeight(0);
 * textSize(12);
 * textStyle(NORMAL);
 * text("Font Style Normal", 10, 30);
 * textStyle(ITALIC);
 * text("Font Style Italic", 10, 60);
 * textStyle(BOLD);
 * text("Font Style Bold", 10, 90);
 * </code>
 * </div>
 */
p5.prototype.textStyle = function(theStyle) {
  return this._renderer.textStyle.apply(this._renderer, arguments);
};

/**
 * Calculates and returns the width of any character or text string.
 *
 * @method textWidth
 * @param {String} theText the String of characters to measure
 * @return {Number}
 * @example
 * <div>
 * <code>
 * textSize(28);
 *
 * var aChar = 'P';
 * var cWidth = textWidth(aChar);
 * text(aChar, 0, 40);
 * line(cWidth, 0, cWidth, 50);
 *
 * var aString = "p5.js";
 * var sWidth = textWidth(aString);
 * text(aString, 0, 85);
 * line(sWidth, 50, sWidth, 100);
 * </code>
 * </div>
 */
p5.prototype.textWidth = function(theText) {
  return this._renderer.textWidth.apply(this._renderer, arguments);
};

/**
 * Returns the ascent of the current font at its current size. The ascent
 * represents the distance, in pixels, of the tallest character above
 * the baseline.
 *
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32);  // Set initial text size
 * var asc = textAscent() * scalar;  // Calc ascent
 * line(0, base - asc, width, base - asc);
 * text("dp", 0, base);  // Draw text on baseline
 *
 * textSize(64);  // Increase text size
 * asc = textAscent() * scalar;  // Recalc ascent
 * line(40, base - asc, width, base - asc);
 * text("dp", 40, base);  // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textAscent = function() {
  return this._renderer.textAscent();
};

/**
 * Returns the descent of the current font at its current size. The descent
 * represents the distance, in pixels, of the character with the longest
 * descender below the baseline.
 *
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32);  // Set initial text size
 * var desc = textDescent() * scalar;  // Calc ascent
 * line(0, base+desc, width, base+desc);
 * text("dp", 0, base);  // Draw text on baseline
 *
 * textSize(64);  // Increase text size
 * desc = textDescent() * scalar;  // Recalc ascent
 * line(40, base + desc, width, base + desc);
 * text("dp", 40, base);  // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textDescent = function() {
  return this._renderer.textDescent();
};

/**
 * Helper function to measure ascent and descent.
 */
p5.prototype._updateTextMetrics = function() {
  return this._renderer._updateTextMetrics();
};

module.exports = p5;
