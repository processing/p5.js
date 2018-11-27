/**
 * @module Typography
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../core/main');

/**
 * Sets the current alignment for drawing text. Accepts two
 * arguments: horizAlign (LEFT, CENTER, or RIGHT) and
 * vertAlign (TOP, BOTTOM, CENTER, or BASELINE).
 *
 * The horizAlign parameter is in reference to the x value
 * of the <a href="#/p5/text">text()</a> function, while the vertAlign parameter is
 * in reference to the y value.
 *
 * So if you write textAlign(LEFT), you are aligning the left
 * edge of your text to the x value you give in <a href="#/p5/text">text()</a>. If you
 * write textAlign(RIGHT, TOP), you are aligning the right edge
 * of your text to the x value and the top of edge of the text
 * to the y value.
 *
 * @method textAlign
 * @param {Constant} horizAlign horizontal alignment, either LEFT,
 *                            CENTER, or RIGHT
 * @param {Constant} [vertAlign] vertical alignment, either TOP,
 *                            BOTTOM, CENTER, or BASELINE
 * @chainable
 * @example
 * <div>
 * <code>
 * textSize(16);
 * textAlign(RIGHT);
 * text('ABCD', 50, 30);
 * textAlign(CENTER);
 * text('EFGH', 50, 50);
 * textAlign(LEFT);
 * text('IJKL', 50, 70);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * textSize(16);
 * strokeWeight(0.5);
 *
 * line(0, 12, width, 12);
 * textAlign(CENTER, TOP);
 * text('TOP', 0, 12, width);
 *
 * line(0, 37, width, 37);
 * textAlign(CENTER, CENTER);
 * text('CENTER', 0, 37, width);
 *
 * line(0, 62, width, 62);
 * textAlign(CENTER, BASELINE);
 * text('BASELINE', 0, 62, width);
 *
 * line(0, 87, width, 87);
 * textAlign(CENTER, BOTTOM);
 * text('BOTTOM', 0, 87, width);
 * </code>
 * </div>
 *
 * @alt
 *Letters ABCD displayed at top right, EFGH at center and IJKL at bottom left.
 * The names of the four vertical alignments rendered each showing that alignment's placement relative to a horizontal line.
 *
 */
/**
 * @method textAlign
 * @return {Object}
 */
p5.prototype.textAlign = function(horizAlign, vertAlign) {
  p5._validateParameters('textAlign', arguments);
  return this._renderer.textAlign.apply(this._renderer, arguments);
};

/**
 * Sets/gets the spacing, in pixels, between lines of text. This
 * setting will be used in all subsequent calls to the <a href="#/p5/text">text()</a> function.
 *
 * @method textLeading
 * @param {Number} leading the size in pixels for spacing between lines
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Text to display. The "\n" is a "new line" character
 * var lines = 'L1\nL2\nL3';
 * textSize(12);
 *
 * textLeading(10); // Set leading to 10
 * text(lines, 10, 25);
 *
 * textLeading(20); // Set leading to 20
 * text(lines, 40, 25);
 *
 * textLeading(30); // Set leading to 30
 * text(lines, 70, 25);
 * </code>
 * </div>
 *
 * @alt
 *set L1 L2 & L3 displayed vertically 3 times. spacing increases for each set
 */
/**
 * @method textLeading
 * @return {Number}
 */
p5.prototype.textLeading = function(theLeading) {
  p5._validateParameters('textLeading', arguments);
  return this._renderer.textLeading.apply(this._renderer, arguments);
};

/**
 * Sets/gets the current font size. This size will be used in all subsequent
 * calls to the <a href="#/p5/text">text()</a> function. Font size is measured in pixels.
 *
 * @method textSize
 * @param {Number} theSize the size of the letters in units of pixels
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * textSize(12);
 * text('Font Size 12', 10, 30);
 * textSize(14);
 * text('Font Size 14', 10, 60);
 * textSize(16);
 * text('Font Size 16', 10, 90);
 * </code>
 * </div>
 *
 * @alt
 *Font Size 12 displayed small, Font Size 14 medium & Font Size 16 large
 */
/**
 * @method textSize
 * @return {Number}
 */
p5.prototype.textSize = function(theSize) {
  p5._validateParameters('textSize', arguments);
  return this._renderer.textSize.apply(this._renderer, arguments);
};

/**
 * Sets/gets the style of the text for system fonts to NORMAL, ITALIC, BOLD or BOLDITALIC.
 * Note: this may be is overridden by CSS styling. For non-system fonts
 * (opentype, truetype, etc.) please load styled fonts instead.
 *
 * @method textStyle
 * @param {Constant} theStyle styling for text, either NORMAL,
 *                            ITALIC, BOLD or BOLDITALIC
 * @chainable
 * @example
 * <div>
 * <code>
 * strokeWeight(0);
 * textSize(12);
 * textStyle(NORMAL);
 * text('Font Style Normal', 10, 15);
 * textStyle(ITALIC);
 * text('Font Style Italic', 10, 40);
 * textStyle(BOLD);
 * text('Font Style Bold', 10, 65);
 * textStyle(BOLDITALIC);
 * text('Font Style Bold Italic', 10, 90);
 * </code>
 * </div>
 *
 * @alt
 *words Font Style Normal displayed normally, Italic in italic, bold in bold and bold italic in bold italics.
 */
/**
 * @method textStyle
 * @return {String}
 */
p5.prototype.textStyle = function(theStyle) {
  p5._validateParameters('textStyle', arguments);
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
 * var aString = 'p5.js';
 * var sWidth = textWidth(aString);
 * text(aString, 0, 85);
 * line(sWidth, 50, sWidth, 100);
 * </code>
 * </div>
 *
 * @alt
 *Letter P and p5.js are displayed with vertical lines at end. P is wide
 *
 */
p5.prototype.textWidth = function(theText) {
  p5._validateParameters('textWidth', arguments);
  if (theText.length === 0) {
    return 0;
  }
  return this._renderer.textWidth.apply(this._renderer, arguments);
};

/**
 * Returns the ascent of the current font at its current size. The ascent
 * represents the distance, in pixels, of the tallest character above
 * the baseline.
 * @method textAscent
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32); // Set initial text size
 * var asc = textAscent() * scalar; // Calc ascent
 * line(0, base - asc, width, base - asc);
 * text('dp', 0, base); // Draw text on baseline
 *
 * textSize(64); // Increase text size
 * asc = textAscent() * scalar; // Recalc ascent
 * line(40, base - asc, width, base - asc);
 * text('dp', 40, base); // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textAscent = function() {
  p5._validateParameters('textAscent', arguments);
  return this._renderer.textAscent();
};

/**
 * Returns the descent of the current font at its current size. The descent
 * represents the distance, in pixels, of the character with the longest
 * descender below the baseline.
 * @method textDescent
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32); // Set initial text size
 * var desc = textDescent() * scalar; // Calc ascent
 * line(0, base + desc, width, base + desc);
 * text('dp', 0, base); // Draw text on baseline
 *
 * textSize(64); // Increase text size
 * desc = textDescent() * scalar; // Recalc ascent
 * line(40, base + desc, width, base + desc);
 * text('dp', 40, base); // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textDescent = function() {
  p5._validateParameters('textDescent', arguments);
  return this._renderer.textDescent();
};

/**
 * Helper function to measure ascent and descent.
 */
p5.prototype._updateTextMetrics = function() {
  return this._renderer._updateTextMetrics();
};

module.exports = p5;
