/**
 * @module Typography
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  p5.prototype._textLeading = 15;
  p5.prototype._textFont = 'sans-serif';
  p5.prototype._textSize = 12;
  p5.prototype._textStyle = constants.NORMAL;
  p5.prototype._textAscent = null;
  p5.prototype._textDescent = null;

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
    if (h === constants.LEFT ||
      h === constants.RIGHT ||
      h === constants.CENTER) {
      this.drawingContext.textAlign = h;
    }
    if (v === constants.TOP ||
      v === constants.BOTTOM ||
      v === constants.CENTER ||
      v === constants.BASELINE) {
      this.drawingContext.textBaseline = v;
    }
  };

  /**
   * Sets the spacing between lines of text in units of pixels. This
   * setting will be used in all subsequent calls to the text() function.
   *
   * @method textLeading
   * @param {Number} l the size in pixels for spacing between lines
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
    this._setProperty('_textLeading', l);
  };

  /**
   * Sets the current font size. This size will be used in all subsequent
   * calls to the text() function. Font size is measured in units of pixels.
   *
   * @method textSize
   * @param {Number} s the size of the letters in units of pixels
   * @example
   * <div>
   * <code>
   * background(0);
   * fill(255);
   * textSize(26); 
   * text("WORD", 10, 50); 
   * textSize(14);
   * text("WORD", 10, 70);
   * </code>
   * </div>
   */
  p5.prototype.textSize = function(s) {
    this._setProperty('_textSize', s);
    this._applyTextProperties();
  };

  /**
   * Sets the style of the text to NORMAL, ITALIC, or BOLD. Note this is
   * overridden by CSS styling.
   *
   * @method textStyle
   * @param {Number/Constant} s styling for text, either NORMAL,
   *                            ITALIC, or BOLD
   * @example
   * <div>
   * <code>
   * background(0);
   * fill(255);
   * textStyle(NORMAL);
   * textSize(14);
   * text("WORD", 10, 23);
   * textStyle(ITALIC);
   * textSize(14);
   * text("WORD", 10, 45);
   * textStyle(BOLD);
   * textSize(14);
   * text("WORD", 10, 67);
   * </code>
   * </div>
   */
  p5.prototype.textStyle = function(s) {
    if (s === constants.NORMAL ||
      s === constants.ITALIC ||
      s === constants.BOLD) {
      this._setProperty('_textStyle', s);
      this._applyTextProperties();
    }
  };

  /**
   * Calculates and returns the width of any character or text string.
   *
   * @method textWidth
   * @param {String} s the String of characters to measure
   * @example
   * <div>
   * <code>
   * background(0);
   * fill(255);
   * textSize(14);
   * s = "String.";
   * text(s, 10, 23);
   * console.log(textWidth(s));
   * </code>
   * </div>
   */
  p5.prototype.textWidth = function(s) {
    return this.drawingContext.measureText(s).width;
  };

  /**
   * Returns ascent of the current font at its current size.
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
    if (this._textAscent == null) { this._updateTextMetrics(); }
    return this._textAscent;
  };

  /**
   * Returns descent of the current font at its current size.
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
    if (this._textDescent == null) { this._updateTextMetrics(); }
    return this._textDescent;
  };

  /**
   * Helper fxn to apply text properties. 
   */
  p5.prototype._applyTextProperties = function () {
    this._setProperty('_textAscent', null);
    this._setProperty('_textDescent', null);

    var str = this._textStyle + ' ' + this._textSize + 'px ' + this._textFont;
    this.drawingContext.font = str;
  };

  /**
   * Helper fxn to measure ascent and descent. 
   * Adapted from http://stackoverflow.com/a/25355178
   */
  p5.prototype._updateTextMetrics = function () {

    var text = document.createElement('span');
    text.style.fontFamily = this._textFont;
    text.style.fontSize = this._textSize + 'px';
    text.innerHTML = 'ABCjgq|';

    var block = document.createElement('div');
    block.style.display = 'inline-block';
    block.style.width = '1px';
    block.style.height = '0px';

    var container = document.createElement('div');
    container.appendChild(text);
    container.appendChild(block);

    container.style.height = '0px';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    block.style.verticalAlign = 'baseline';
    var blockOffset = this._calculateOffset(block);
    var textOffset = this._calculateOffset(text);
    var ascent = blockOffset[1] - textOffset[1];

    block.style.verticalAlign = 'bottom';
    blockOffset = this._calculateOffset(block);
    textOffset = this._calculateOffset(text);
    var height = blockOffset[1] - textOffset[1];
    var descent = height - ascent;

    document.body.removeChild(container);

    this._setProperty('_textAscent', ascent);
    this._setProperty('_textDescent', descent);
  };

  /**
   * Helper fxn to measure ascent and descent. 
   * Adapted from http://stackoverflow.com/a/25355178
   */
  p5.prototype._calculateOffset = function (object) {
    var currentLeft = 0, currentTop = 0;
    if( object.offsetParent ) {
      do {
        currentLeft += object.offsetLeft;
        currentTop += object.offsetTop;
      } while( object = object.offsetParent );
    } else {
      currentLeft += object.offsetLeft;
      currentTop += object.offsetTop;
    }
    return [currentLeft,currentTop];
  };

  return p5;

});
