/**
 * @module Typography
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../core/main';

/**
 * Sets the way text is aligned when <a href="#/p5/text">text()</a> is called.
 *
 * By default, calling `text('hi', 10, 20)` places the bottom-left corner of
 * the text's bounding box at (10, 20).
 *
 * The first parameter, `horizAlign`, changes the way
 * <a href="#/p5/text">text()</a> interprets x-coordinates. By default, the
 * x-coordinate sets the left edge of the bounding box. `textAlign()` accepts
 * the following values for `horizAlign`: `LEFT`, `CENTER`, or `RIGHT`.
 *
 * The second parameter, `vertAlign`, is optional. It changes the way
 * <a href="#/p5/text">text()</a> interprets y-coordinates. By default, the
 * y-coordinate sets the bottom edge of the bounding box. `textAlign()`
 * accepts the following values for `vertAlign`: `TOP`, `BOTTOM`, `CENTER`,
 * or `BASELINE`.
 *
 * @method textAlign
 * @param {Constant} horizAlign horizontal alignment, either LEFT,
 *                            CENTER, or RIGHT.
 * @param {Constant} [vertAlign] vertical alignment, either TOP,
 *                            BOTTOM, CENTER, or BASELINE.
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw a vertical line.
 *   strokeWeight(0.5);
 *   line(50, 0, 50, 100);
 *
 *   // Top line.
 *   textSize(16);
 *   textAlign(RIGHT);
 *   text('ABCD', 50, 30);
 *
 *   // Middle line.
 *   textAlign(CENTER);
 *   text('EFGH', 50, 50);
 *
 *   // Bottom line.
 *   textAlign(LEFT);
 *   text('IJKL', 50, 70);
 *
 *   describe('The letters ABCD displayed at top-left, EFGH at center, and IJKL at bottom-right. A vertical line divides the canvas in half.');
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
 *   strokeWeight(0.5);
 *
 *   // First line.
 *   line(0, 12, width, 12);
 *   textAlign(CENTER, TOP);
 *   text('TOP', 50, 12);
 *
 *   // Second line.
 *   line(0, 37, width, 37);
 *   textAlign(CENTER, CENTER);
 *   text('CENTER', 50, 37);
 *
 *   // Third line.
 *   line(0, 62, width, 62);
 *   textAlign(CENTER, BASELINE);
 *   text('BASELINE', 50, 62);
 *
 *   // Fourth line.
 *   line(0, 97, width, 97);
 *   textAlign(CENTER, BOTTOM);
 *   text('BOTTOM', 50, 97);
 *
 *   describe('The words "TOP", "CENTER", "BASELINE", and "BOTTOM" each drawn relative to a horizontal line. Their positions demonstrate different vertical alignments.');
 * }
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
 * Sets the spacing between lines of text when
 * <a href="#/p5/text">text()</a> is called.
 *
 * Note: Spacing is measured in pixels.
 *
 * Calling `textLeading()` without an argument returns the current spacing.
 *
 * @method textLeading
 * @param {Number} leading spacing between lines of text in units of pixels.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // "\n" starts a new line of text.
 *   let lines = 'one\ntwo';
 *
 *   // Left.
 *   text(lines, 10, 25);
 *
 *   // Right.
 *   textLeading(30);
 *   text(lines, 70, 25);
 *
 *   describe('The words "one" and "two" written on separate lines twice. The words on the left have less vertical spacing than the words on the right.');
 * }
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
 * Sets the font size when
 * <a href="#/p5/text">text()</a> is called.
 *
 * Note: Font size is measured in pixels.
 *
 * Calling `textSize()` without an argument returns the current size.
 *
 * @method textSize
 * @param {Number} size size of the letters in units of pixels.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Top.
 *   textSize(12);
 *   text('Font Size 12', 10, 30);
 *
 *   // Middle.
 *   textSize(14);
 *   text('Font Size 14', 10, 60);
 *
 *   // Bottom.
 *   textSize(16);
 *   text('Font Size 16', 10, 90);
 *
 *   describe('The text "Font Size 12" drawn small, "Font Size 14" drawn medium, and "Font Size 16" drawn large.');
 * }
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
 * Sets the style for system fonts when
 * <a href="#/p5/text">text()</a> is called.
 *
 * The parameter, `style`, can be either `NORMAL`, `ITALIC`, `BOLD`, or
 * `BOLDITALIC`.
 *
 * `textStyle()` may be overridden by CSS styling. This function doesn't
 * affect fonts loaded with <a href="#/p5/loadFont">loadFont()</a>.
 *
 * @method textStyle
 * @param {Constant} style styling for text, either NORMAL,
 *                            ITALIC, BOLD or BOLDITALIC.
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textSize(12);
 *   textAlign(CENTER);
 *
 *   // First row.
 *   textStyle(NORMAL);
 *   text('Normal', 50, 15);
 *
 *   // Second row.
 *   textStyle(ITALIC);
 *   text('Italic', 50, 40);
 *
 *   // Third row.
 *   textStyle(BOLD);
 *   text('Bold', 50, 65);
 *
 *   // Fourth row.
 *   textStyle(BOLDITALIC);
 *   text('Bold Italic', 50, 90);
 *
 *   describe('The words "Normal" displayed normally, "Italic" in italic, "Bold" in bold, and "Bold Italic" in bold italics.');
 * }
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
 * Calculates the maximum width of a string of text drawn when
 * <a href="#/p5/text">text()</a> is called.
 *
 * <strong>Note:</strong> In p5.js 2.0+, leading and trailing spaces are ignored.
 * <code>textWidth("  Hello  ")</code> returns the same width as <code>textWidth("Hello")</code>.
 *
 * @method textWidth
 * @param {String} str string of text to measure.
 * @return {Number} width measured in units of pixels.
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textSize(28);
 *   strokeWeight(0.5);
 *
 *   // Calculate the text width.
 *   let s = 'yoyo';
 *   let w = textWidth(s);
 *
 *   // Display the text.
 *   text(s, 22, 55);
 *
 *   // Underline the text.
 *   line(22, 55, 22 + w, 55);
 *
 *   describe('The word "yoyo" underlined.');
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
 *   // Style the text.
 *   textSize(28);
 *   strokeWeight(0.5);
 *
 *   // Calculate the text width.
 *   // "\n" starts a new line.
 *   let s = 'yo\nyo';
 *   let w = textWidth(s);
 *
 *   // Display the text.
 *   text(s, 22, 55);
 *
 *   // Underline the text.
 *   line(22, 55, 22 + w, 55);
 *
 *   describe('The word "yo" written twice, one copy beneath the other. The words are divided by a horizontal line.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *   background(200);
 *   textSize(16);
 *
 *   // Demonstrate that leading/trailing spaces are ignored
 *   let text1 = 'Hello';
 *   let text2 = '  Hello  ';
 *   let text3 = '    Hello    ';
 *
 *   // All three texts have the same width
 *   let w1 = textWidth(text1);
 *   let w2 = textWidth(text2);
 *   let w3 = textWidth(text3);
 *
 *   textAlign(LEFT, TOP);
 *   text(text1, 20, 20);
 *   text(text2, 20, 50);
 *   text(text3, 20, 80);
 *
 *   // Show the widths (they should be the same)
 *   text(`Width: ${w1}`, 150, 30);
 *   text(`Width: ${w1}`, 150, 60);
 *   text(`Width: ${w1}`, 150, 90);
 *
 *   // Draw rectangles around each text to show the tight bounding box
 *   noFill();
 *   stroke(255, 0, 0);
 *   rect(20, 15, w1, 20);
 *   rect(20, 45, w2, 20);
 *   rect(20, 75, w3, 20);
 *
 *   describe('Three versions of "Hello" with different amounts of leading/trailing spaces, all showing the same width measurement.');
 * }
 * </code>
 * </div>
 */
p5.prototype.textWidth = function (...args) {
  args[0] += '';
  p5._validateParameters('textWidth', args);
  if (args[0].length === 0) {
    return 0;
  }

  // Only use the line with the longest width, and replace tabs with double-space
  const textLines = args[0].replace(/\t/g, '  ').split(/\r?\n|\r|\n/g);

  const newArr = [];

  // Return the textWidth for every line
  for(let i=0; i<textLines.length; i++){
    newArr.push(this._renderer.textWidth(textLines[i]));
  }

  // Return the largest textWidth
  const largestWidth = Math.max(...newArr);

  return largestWidth;
};

/**
 * Calculates the ascent of the current font at its current size.
 *
 * The ascent represents the distance, in pixels, of the tallest character
 * above the baseline.
 *
 * @method textAscent
 * @return {Number} ascent measured in units of pixels.
 * @example
 * <div>
 * <code>
 * let font;
 *
 * function preload()  {
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup()  {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textFont(font);
 *
 *   // Different for each font.
 *   let fontScale = 0.8;
 *
 *   let baseY = 75;
 *   strokeWeight(0.5);
 *
 *   // Draw small text.
 *   textSize(24);
 *   text('dp', 0, baseY);
 *
 *   // Draw baseline and ascent.
 *   let a = textAscent() * fontScale;
 *   line(0, baseY, 23, baseY);
 *   line(23, baseY - a, 23, baseY);
 *
 *   // Draw large text.
 *   textSize(48);
 *   text('dp', 45, baseY);
 *
 *   // Draw baseline and ascent.
 *   a = textAscent() * fontScale;
 *   line(45, baseY, 91, baseY);
 *   line(91, baseY - a, 91, baseY);
 *
 *   describe('The letters "dp" written twice in different sizes. Each version has a horizontal baseline. A vertical line extends upward from each baseline to the top of the "d".');
 * }
 * </code>
 * </div>
 */
p5.prototype.textAscent = function(...args) {
  p5._validateParameters('textAscent', args);
  return this._renderer.textAscent();
};

/**
 * Calculates the descent of the current font at its current size.
 *
 * The descent represents the distance, in pixels, of the character with the
 * longest descender below the baseline.
 *
 * @method textDescent
 * @return {Number} descent measured in units of pixels.
 * @example
 * <div>
 * <code>
 * let font;
 *
 * function preload()  {
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup()  {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the font.
 *   textFont(font);
 *
 *   // Different for each font.
 *   let fontScale = 0.9;
 *
 *   let baseY = 75;
 *   strokeWeight(0.5);
 *
 *   // Draw small text.
 *   textSize(24);
 *   text('dp', 0, baseY);
 *
 *   // Draw baseline and descent.
 *   let d = textDescent() * fontScale;
 *   line(0, baseY, 23, baseY);
 *   line(23, baseY, 23, baseY + d);
 *
 *   // Draw large text.
 *   textSize(48);
 *   text('dp', 45, baseY);
 *
 *   // Draw baseline and descent.
 *   d = textDescent() * fontScale;
 *   line(45, baseY, 91, baseY);
 *   line(91, baseY, 91, baseY + d);
 *
 *   describe('The letters "dp" written twice in different sizes. Each version has a horizontal baseline. A vertical line extends downward from each baseline to the bottom of the "p".');
 * }
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
 * Sets the style for wrapping text when
 * <a href="#/p5/text">text()</a> is called.
 *
 * The parameter, `style`, can be one of the following values:
 *
 * `WORD` starts new lines of text at spaces. If a string of text doesn't
 * have spaces, it may overflow the text box and the canvas. This is the
 * default style.
 *
 * `CHAR` starts new lines as needed to stay within the text box.
 *
 * `textWrap()` only works when the maximum width is set for a text box. For
 * example, calling `text('Have a wonderful day', 0, 10, 100)` sets the
 * maximum width to 100 pixels.
 *
 * Calling `textWrap()` without an argument returns the current style.
 *
 * @method textWrap
 * @param {Constant} style text wrapping style, either WORD or CHAR.
 * @return {String} style
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textSize(20);
 *   textWrap(WORD);
 *
 *   // Display the text.
 *   text('Have a wonderful day', 0, 10, 100);
 *
 *   describe('The text "Have a wonderful day" written across three lines.');
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
 *   // Style the text.
 *   textSize(20);
 *   textWrap(CHAR);
 *
 *   // Display the text.
 *   text('Have a wonderful day', 0, 10, 100);
 *
 *   describe('The text "Have a wonderful day" written across two lines.');
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
 *   // Style the text.
 *   textSize(20);
 *   textWrap(CHAR);
 *
 *   // Display the text.
 *   text('祝你有美好的一天', 0, 10, 100);
 *
 *   describe('The text "祝你有美好的一天" written across two lines.');
 * }
 * </code>
 * </div>
 */
p5.prototype.textWrap = function(wrapStyle) {
  p5._validateParameters('textWrap', [wrapStyle]);

  return this._renderer.textWrap(wrapStyle);
};

export default p5;
