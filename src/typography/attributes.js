/**
 * @module Typography
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../core/main';

/**
 * Sets the current alignment for drawing text. Accepts two
 * arguments: horizAlign (LEFT, CENTER, or RIGHT) and
 * vertAlign (TOP, BOTTOM, CENTER, or BASELINE).
 *
 * The horizAlign parameter is in reference to the x value
 * of the <a href="#/p5/text">text()</a> function, while the vertAlign parameter
 * is in reference to the y value.
 *
 * So if you write textAlign(LEFT), you are aligning the left
 * edge of your text to the x value you give in <a href="#/p5/text">text()</a>.
 * If you write textAlign(RIGHT, TOP), you are aligning the right edge
 * of your text to the x value and the top edge of the text
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
 * describe(`Letters ABCD displayed at top left, EFGH at center, and
 *   IJKL at bottom right.`);
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
 * line(0, 97, width, 97);
 * textAlign(CENTER, BOTTOM);
 * text('BOTTOM', 0, 97, width);
 *
 * describe(`The names of the four vertical alignments (TOP, CENTER, BASELINE,
 *   and BOTTOM) rendered each showing that alignment's placement relative to a
 *   horizontal line.`);
 * </code>
 * </div>
 */
/**
 * @method textAlign
 * @return {Object}
 */
p5.prototype.textAlign = function(horizAlign, vertAlign) {
  p5._validateParameters('textAlign', arguments);
  return this._renderer.textAlign(...arguments);
};

/**
 * Sets/gets the spacing, in pixels, between lines of text. This setting will be
 * used in all subsequent calls to the <a href="#/p5/text">text()</a> function.
 *
 * @method textLeading
 * @param {Number} leading the size in pixels for spacing between lines
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * let lines = 'L1\nL2\nL3'; // "\n" is a "new line" character
 * textSize(12);
 *
 * textLeading(10);
 * text(lines, 10, 25);
 *
 * textLeading(20);
 * text(lines, 40, 25);
 *
 * textLeading(30);
 * text(lines, 70, 25);
 *
 * describe(`A set of L1, L2, and L3, displayed vertically 3 times.
 *   Spacing increases for each set.`);
 * </code>
 * </div>
 */
/**
 * @method textLeading
 * @return {Number}
 */
p5.prototype.textLeading = function(theLeading) {
  p5._validateParameters('textLeading', arguments);
  return this._renderer.textLeading(...arguments);
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
 *
 * describe(`'Font Size 12' displayed small,
 *   'Font Size 14' medium, and
 *   'Font Size 16' large`);
 * </code>
 * </div>
 */
/**
 * @method textSize
 * @return {Number}
 */
p5.prototype.textSize = function(theSize) {
  p5._validateParameters('textSize', arguments);
  return this._renderer.textSize(...arguments);
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
 * describe(`The words “Font Style Normal” displayed normally,
 *   “Font Style Italic” in italic,
 *   “Font Style Bold” in bold, and
 *   “Font Style Bold Italic” in bold italics.`);
 * </code>
 * </div>
 */
/**
 * @method textStyle
 * @return {String}
 */
p5.prototype.textStyle = function(theStyle) {
  p5._validateParameters('textStyle', arguments);
  return this._renderer.textStyle(...arguments);
};

/**
 * Calculates and returns the width of any character or text string.
 *
 * @method textWidth
 * @param {String} theText the String of characters to measure
 * @return {Number} the calculated width
 * @example
 * <div>
 * <code>
 * textSize(28);
 *
 * let aChar = 'P';
 * let cWidth = textWidth(aChar);
 * text(aChar, 0, 40);
 * line(cWidth, 0, cWidth, 50);
 *
 * let aString = 'p5.js';
 * let sWidth = textWidth(aString);
 * text(aString, 0, 85);
 * line(sWidth, 50, sWidth, 100);
 *
 * describe('Letter P and p5.js are displayed with vertical lines at end.');
 * </code>
 * </div>
 */
p5.prototype.textWidth = function(...args) {
  args[0] += '';
  p5._validateParameters('textWidth', args);
  if (args[0].length === 0) {
    return 0;
  }
  return this._renderer.textWidth(...args);
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
 * let base = height * 0.75;
 * let scalar = 0.8; // Different for each font
 *
 * textSize(32); // Set initial text size
 * let asc = textAscent() * scalar; // Calc ascent
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
p5.prototype.textAscent = function(...args) {
  p5._validateParameters('textAscent', args);
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
 * let base = height * 0.75;
 * let scalar = 0.8; // Different for each font
 *
 * textSize(32); // Set initial text size
 * let desc = textDescent() * scalar; // Calc descent
 * line(0, base + desc, width, base + desc);
 * text('dp', 0, base); // Draw text on baseline
 *
 * textSize(64); // Increase text size
 * desc = textDescent() * scalar; // Recalc descent
 * line(40, base + desc, width, base + desc);
 * text('dp', 40, base); // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textDescent = function(...args) {
  p5._validateParameters('textDescent', args);
  return this._renderer.textDescent();
};

/**
 * Helper function to measure ascent and descent.
 */
p5.prototype._updateTextMetrics = function() {
  return this._renderer._updateTextMetrics();
};

/**
 * Specifies how lines of text are wrapped within a text box. This requires a max-width set on the text area, specified in <a href="#/p5/text">text()</a> as parameter `x2`.
 *
 * WORD wrap style only breaks lines at spaces. A single string without spaces that exceeds the boundaries of the canvas or text area is not truncated, and will overflow the desired area, disappearing at the canvas edge.
 *
 * CHAR wrap style breaks lines wherever needed to stay within the text box.
 *
 * WORD is the default wrap style, and both styles will still break lines at any line breaks (`\n`) specified in the original text. The text area max-height parameter (`y2`) also still applies to wrapped text in both styles, lines of text that do not fit within the text area will not be drawn to the screen.
 *
 * @method textWrap
 * @param {Constant} wrapStyle text wrapping style, either WORD or CHAR
 * @return {String} wrapStyle
 * @example
 * <div>
 * <code>
 * textSize(20);
 * textWrap(WORD);
 * text('Have a wonderful day', 0, 10, 100);
 * </code>
 * </div>
 * <div>
 * <code>
 * textSize(20);
 * textWrap(CHAR);
 * text('Have a wonderful day', 0, 10, 100);
 * </code>
 * </div>
 * <div>
 * <code>
 * textSize(20);
 * textWrap(CHAR);
 * text('祝你有美好的一天', 0, 10, 100);
 * </code>
 * </div>
 * <div>
 * <code>
 * const scream = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
 * textSize(20);
 * textWrap(WORD);
 * text(scream, 0, 0, 100);
 * fill(0, 0, 0, 75);
 * text(scream, 0, 20, 100);
 * fill(0, 0, 0, 50);
 * text(scream, 0, 40, 100);
 * fill(0, 0, 0, 25);
 * text(scream, 0, 60, 100);
 * strokeWeight(2);
 * ellipseMode(CENTER);
 * fill(255);
 * ellipse(15, 50, 15, 15);
 * fill(0);
 * ellipse(11, 47, 1, 1);
 * ellipse(19, 47, 1, 1);
 * ellipse(15, 52, 5, 5);
 * line(15, 60, 15, 70);
 * line(15, 65, 5, 55);
 * line(15, 65, 25, 55);
 * line(15, 70, 10, 80);
 * line(15, 70, 20, 80);
 * </code>
 * </div>
 */
p5.prototype.textWrap = function(wrapStyle) {
  if (wrapStyle !== 'WORD' && wrapStyle !== 'CHAR') {
    throw 'Error: textWrap accepts only WORD or CHAR';
  }
  return this._renderer.textWrap(wrapStyle);
};

export default p5;
