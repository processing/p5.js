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
 * Sets the current alignment for drawing text. The parameters LEFT, CENTER,
 * and RIGHT set the display characteristics of the letters in relation to
 * the values for the x and y parameters of the text() function.
 *
 * @method textAlign
 * @param {Number/Constant} h horizontal alignment, either LEFT,
 *                            CENTER, or RIGHT
 * @param {Number/Constant} v vertical alignment, either TOP,
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
p5.prototype.textAlign = function(h, v) {
  return this._graphics.textAlign(h,v);
};

/**
 * Sets/gets the spacing between lines of text in units of pixels. This
 * setting will be used in all subsequent calls to the text() function.
 *
 * @method textLeading
 * @param {Number} l the size in pixels for spacing between lines
 * @return {Object|Number}
 * @example
 * <div>
 * <code>
 * // Text to display. The "\n" is a "new line" character
 * lines = "L1\nL2\nL3";
 * textSize(12);
 * fill(0);  // Set fill to black
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
p5.prototype.textLeading = function(l) {
  return this._graphics.textLeading(l);
};

/**
 * Sets/gets the current font size. This size will be used in all subsequent
 * calls to the text() function. Font size is measured in units of pixels.
 *
 * @method textSize
 * @param {Number} s the size of the letters in units of pixels
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
p5.prototype.textSize = function(s) {
  return this._graphics.textSize(s);
};

/**
 * Sets/gets the style of the text to NORMAL, ITALIC, or BOLD. Note this is
 * overridden by CSS styling.
 * (Style only apply to system font, for custom fonts, please load styled
 * fonts instead.)
 *
 * @method textStyle
 * @param {Number/Constant} s styling for text, either NORMAL,
 *                            ITALIC, or BOLD
 * @return {Object|String}
 * @example
 * <div>
 * <code>
 * fill(0);
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
p5.prototype.textStyle = function(s) {
  return this._graphics.textStyle(s);
};

/**
 * Calculates and returns the width of any character or text string.
 *
 * @method textWidth
 * @param {String} s the String of characters to measure
 * @return {Number}
 * @example
 * <div>
 * <code>
 * textSize(28);
 *
 * var c = 'P';
 * var cw = textWidth(c);
 * text(c, 0, 40);
 * line(cw, 0, cw, 50);
 *
 * var s = "p5.js";
 * var sw = textWidth(s);
 * text(s, 0, 85);
 * line(sw, 50, sw, 100);
 * </code>
 * </div>
 */
p5.prototype.textWidth = function(s) {
  return this._graphics.textWidth(s);
};

/**
 * Returns ascent of the current font at its current size.
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32);  // Set initial text size
 * var a = textAscent() * scalar;  // Calc ascent
 * line(0, base-a, width, base-a);
 * text("dp", 0, base);  // Draw text on baseline
 *
 * textSize(64);  // Increase text size
 * a = textAscent() * scalar;  // Recalc ascent
 * line(40, base-a, width, base-a);
 * text("dp", 40, base);  // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textAscent = function() {
  return this._graphics.textAscent();
};

/*p5.prototype.fontMetrics = function(font, text, x, y, fontSize) {

  var xMins = [], yMins = [], xMaxs= [], yMaxs = [], p5 = this;
  //font = font || this._textFont;
  fontSize = fontSize || p5._textSize;

  font.forEachGlyph(text, x, y, fontSize,
    {}, function(glyph, gX, gY, gFontSize) {

      var gm = glyph.getMetrics();

      gX = gX !== undefined ? gX : 0;
      gY = gY !== undefined ? gY : 0;
      fontSize = fontSize !== undefined ? fontSize : 24;

      var scale = 1 / font.unitsPerEm * fontSize;

      p5.noFill();
      p5.rectMode(p5.CORNERS);
      p5.rect(gX + (gm.xMin * scale), gY + (-gm.yMin * scale),
              gX + (gm.xMax * scale), gY + (-gm.yMax * scale));

      p5.rectMode(p5.CORNER);
  });

  return { // metrics
      xMin: Math.min.apply(null, xMins),
      yMin: Math.min.apply(null, yMins),
      xMax: Math.max.apply(null, xMaxs),
      yMax: Math.max.apply(null, yMaxs)
  };
};*/

/**
 * Returns descent of the current font at its current size.
 * @return {Number}
 * @example
 * <div>
 * <code>
 * var base = height * 0.75;
 * var scalar = 0.8; // Different for each font
 *
 * textSize(32);  // Set initial text size
 * var a = textDescent() * scalar;  // Calc ascent
 * line(0, base+a, width, base+a);
 * text("dp", 0, base);  // Draw text on baseline
 *
 * textSize(64);  // Increase text size
 * a = textDescent() * scalar;  // Recalc ascent
 * line(40, base+a, width, base+a);
 * text("dp", 40, base);  // Draw text on baseline
 * </code>
 * </div>
 */
p5.prototype.textDescent = function() {
  return this._graphics.textDescent();
};

/**
 * Helper fxn to measure ascent and descent.
 */
p5.prototype._updateTextMetrics = function() {
  return this._graphics._updateTextMetrics();
};

module.exports = p5;
