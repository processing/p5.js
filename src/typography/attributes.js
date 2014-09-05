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

  /**
   * Sets the current alignment for drawing text. The parameters LEFT, CENTER,
   * and RIGHT set the display characteristics of the letters in relation to
   * the values for the x and y parameters of the text() function. 
   * 
   * @method textAlign
   * @param {Number/Constant} a horizontal alignment, either LEFT,
   *                            CENTER, or RIGHT
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
  p5.prototype.textAlign = function(a) {
    if (a === constants.LEFT ||
      a === constants.RIGHT ||
      a === constants.CENTER) {
      this.drawingContext.textAlign = a;
    }
  };

  /**
   * Calculates and returns the height of any character or text string.
   *
   * @method textHeight
   * @param {String} s the String of characters to measure
   * @example
   * <div>
   * <code>
   * background(0);
   * fill(255);
   * textSize(14);
   * s = "String.";
   * text(s, 10, 23);
   * console.log(textHeight(s));
   * </code>
   * </div>
   */
  p5.prototype.textHeight = function(s) {
    return this.drawingContext.measureText(s).height;
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
   * Helper fxn to apply text properties. 
   *
   */
  p5.prototype._applyTextProperties = function () {
    var str = this._textStyle + ' ' + this._textSize + 'px ' + this._textFont;
    this.drawingContext.font = str;
  };

  return p5;

});
