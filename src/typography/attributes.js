/**
 * @module Typography
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */
define(function(require) {

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

    return this;
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

    if (arguments.length) {

      this._setProperty('_textLeading', l);
      return this;
    }
    return this._textLeading;
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

    if (arguments.length) {

      this._setProperty('_textSize', s);
      this._setProperty('_textLeading', s * 1.25);
      return this._applyTextProperties();
    }

    return this._textSize;
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

    if (arguments.length) {

      if (s === constants.NORMAL ||
        s === constants.ITALIC ||
        s === constants.BOLD) {
        this._setProperty('_textStyle', s);
      }
      return this._applyTextProperties();
    }

    return this._textStyle;
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

    if (this._isOpenType()) {

      var tb = this._textFont.textBounds(s, 0, 0);
      return tb.x + tb.w;
    }

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
    if (this._textAscent === null) {
      this._updateTextMetrics();
    }
    return this._textAscent;
  };

  /*p5.prototype.textBounds = function(str, x, y, fontSize) {

    //console.log('textBounds::',str, this._textFont);

    if (typeof this._textFont !== 'object') {
      throw 'not supported for system fonts';
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;

    var xCoords = [],
      yCoords = [],
      scale = 1 / this._textFont.unitsPerEm * this._textSize;

    this._textFont.forEachGlyph(str, x, y, this._textSize, {},
      function(glyph, gX, gY, gFontSize) {
        if (glyph.name !== 'space') {

          gX = gX !== undefined ? gX : 0;
          gY = gY !== undefined ? gY : 0;

          var gm = glyph.getMetrics();
          var x1 = gX + (gm.xMin * scale);
          var y1 = gY + (-gm.yMin * scale);
          var x2 = gX + (gm.xMax * scale);
          var y2 = gY + (-gm.yMax * scale);

          xCoords.push(x1);
          yCoords.push(y1);
          xCoords.push(x2);
          yCoords.push(y2);
        }
      });

    var minX = Math.min.apply(null, xCoords);
    var minY = Math.min.apply(null, yCoords);
    var maxX = Math.max.apply(null, xCoords);
    var maxY = Math.max.apply(null, yCoords);

    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    };
  };*/

  /*p5.prototype.fontMetrics = function(font, text, x, y, fontSize) {

    var xMins = [], yMins = [], xMaxs= [], yMaxs = [], p5 = this;
    //font = font || this._textFont;
    fontSize = fontSize || p5._textSize;

    //console.log(fontSize, font);

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

    if (this._textDescent === null) {
      this._updateTextMetrics();
    }
    return this._textDescent;
  };

  /**
   * Helper fxn to check font type (system or otf)
   */
  p5.prototype._isOpenType = function(f) {

    f = f || this._textFont;
    return (typeof f === 'object' && f.font && f.font.supported);
  };

  /**
   * Helper fxn to apply text properties.
   */
  p5.prototype._applyTextProperties = function() {

    this._setProperty('_textAscent', null);
    this._setProperty('_textDescent', null);

    var fontName = this._textFont;

    if (this._isOpenType()) {

      fontName = this._textFont.font.familyName;
      this._textStyle = this._textFont.font.styleName;
    }

    var str = this._textStyle + ' ' + this._textSize + 'px ' + fontName;
    this.drawingContext.font = str;

    return this;
  };


  /**
   * Helper fxn to measure ascent and descent.
   * Adapted from http://stackoverflow.com/a/25355178
   */
  p5.prototype._updateTextMetrics = function() {

    if (this._isOpenType()) {

      //console.log(Object.keys(this._textFont));
      var bounds = this._textFont.textBounds('ABCjgq|', 0, 0);
      this._setProperty('_textAscent', Math.abs(bounds.y));
      this._setProperty('_textDescent', bounds.h - Math.abs(bounds.y));
      return this;
    }

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

    return this;
  };

  /**
   * Helper fxn to measure ascent and descent.
   * Adapted from http://stackoverflow.com/a/25355178
   */
  p5.prototype._calculateOffset = function(object) {
    var currentLeft = 0,
      currentTop = 0;
    if (object.offsetParent) {
      do {
        currentLeft += object.offsetLeft;
        currentTop += object.offsetTop;
      } while (object = object.offsetParent);
    } else {
      currentLeft += object.offsetLeft;
      currentTop += object.offsetTop;
    }
    return [currentLeft, currentTop];
  };

  return p5;

});
