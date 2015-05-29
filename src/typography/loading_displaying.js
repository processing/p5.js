/**
 * @module Typography
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */
define(function(require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  /**
   * Draws text to the screen. Displays the information specified in the first
   * parameter on the screen in the position specified by the additional
   * parameters. A default font will be used unless a font is set with the
   * textFont() function and a default size will be used unless a font is set
   * with textSize(). Change the color of the text with the fill() function.
   * Change the outline of the text with the stroke() and strokeWeight()
   * functions.
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

    if (!(this._doFill || this._doStroke)) {
      return;
    }

    if (typeof str !== 'string') {
      str = str.toString();
    }

    str = str.replace(/(\t)/g, '  ');
    var cars = str.split('\n');

    if (typeof maxWidth !== 'undefined') {
      var totalHeight = 0;
      var n, ii, line, testLine, testWidth, words;
      for (ii = 0; ii < cars.length; ii++) {
        line = '';
        words = cars[ii].split(' ');
        for (n = 0; n < words.length; n++) {
          testLine = line + words[n] + ' ';
          testWidth = this.textWidth(testLine);
          if (testWidth > maxWidth) {
            line = words[n] + ' ';
            totalHeight += this.textLeading();
          } else {
            line = testLine;
          }
        }
      }
      switch (this.drawingContext.textAlign) {
      case constants.CENTER:
        x += maxWidth / 2;
        break;
      case constants.RIGHT:
        x += maxWidth;
        break;
      }
      if (typeof maxHeight !== 'undefined') {
        switch (this.drawingContext.textBaseline) {
        case constants.BOTTOM:
          y += (maxHeight - totalHeight);
          break;
        case 'middle':
          y += (maxHeight - totalHeight) / 2;
          break;
        case constants.BASELINE:
          y += (maxHeight - totalHeight);
          break;
        }
      }
      for (ii = 0; ii < cars.length; ii++) {
        line = '';
        words = cars[ii].split(' ');
        for (n = 0; n < words.length; n++) {
          testLine = line + words[n] + ' ';
          testWidth = this.textWidth(testLine);
          if (testWidth > maxWidth) {
            renderText(this, line, x, y);
            line = words[n] + ' ';
            y += this.textLeading();
          } else {
            line = testLine;
          }
        }
        renderText(this, line, x, y);
        y += this.textLeading();
      }
    }
    else{
      for (var jj = 0; jj < cars.length; jj++) {
        renderText(this, cars[jj], x, y);
        y += this.textLeading();
      }
    }
    return this;
  };



  function renderText(p, line, x, y) {

    if (p._isOpenType()) {

      return p._textFont.renderPath(line, x, y);
    }

    if (p._doFill) {
      p.drawingContext.fillText(line, x, y);
    }

    if (p._doStroke) {
      p.drawingContext.strokeText(line, x, y);
    }
  }

  /**
   * Sets the current font that will be drawn with the text() function.
   *
   * @method textFont
   * @param {String} str name of font
   * @example
   * <div>
   * <code>
   * fill(0);
   * textSize(36);
   * textFont("Georgia");
   * text("Georgia", 12, 40);
   * textFont("Helvetica");
   * text("Helvetica", 12, 90);
   * </code>
   * </div>
   */
  p5.prototype.textFont = function(theFont, theSize) {

    theSize = theSize || this._textSize;

    if (!theFont) {
      throw 'null font passed to textFont';
    }

    this._setProperty('_textFont', theFont);

    this.textSize(theSize);

    return this._applyTextProperties();
  };

  return p5;

});
