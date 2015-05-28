/**
 * @module Typography
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */
define(function(require) {

  'use strict';

  var p5 = require('core');
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

    if (typeof str !== 'string') {
      str = str.toString();
    }

    if (typeof maxWidth !== 'undefined') {
      y += this._textLeading;
      maxHeight += y;
    }

    str = str.replace(/(\t)/g, '  ');

    var cars = str.split('\n');
    for (var ii = 0; ii < cars.length; ii++) {

      var line = '';
      var words = cars[ii].split(' ');

      for (var n = 0; n < words.length; n++) {
        if (y + this._textLeading <= maxHeight ||
          typeof maxHeight === 'undefined') {
          var testLine = line + words[n] + ' ';
          var metrics = this.drawingContext.measureText(testLine);
          var testWidth = metrics.width;

          if (typeof maxWidth !== 'undefined' && testWidth > maxWidth) {
            if (this._doFill) {

              fillText(this._textFont, line, x, y,
                this._textSize, this.drawingContext);
              //this.drawingContext.fillText(line, x, y);
            }
            if (this._doStroke) {

              strokeText(this._textFont, line, x, y,
                this._textSize, this.drawingContext);
              //this.drawingContext.strokeText(line, x, y);

            }
            line = words[n] + ' ';
            y += this._textLeading;
          } else {
            line = testLine;
          }
        }
      }

      if (this._doFill) {
        fillText(this._textFont, line, x, y,
          this._textSize, this.drawingContext);
        //this.drawingContext.fillText(line, x, y);
      }

      if (this._doStroke) {
        strokeText(this._textFont, line, x, y,
          this._textSize, this.drawingContext);
        //this.drawingContext.strokeText(line, x, y);
      }

      y += this._textLeading;
    }

    function strokeText(font, line, x, y, textSize, ctx) {

      if (typeof font === 'object') {

        var path = font.getPath(line, x, y, textSize, {});
        path.fill = 'gray';
        path.stroke = null;
        path.draw(ctx);
        return;
      }

      ctx.strokeText(line, x, y);
    }

    function fillText(font, line, x, y, textSize, ctx) {

      if (typeof font === 'object') {

        var path = font.getPath(line, x, y, textSize, {});
        path.fill = null;
        path.stroke = 'black';
        path.draw(ctx);
        return;
      }

      ctx.fillText(line, x, y);
    }

    return this;
  };

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

    //console.log('textFont::'+typeof theFont);
    if (theFont && theFont.font) {
      theFont = theFont.font;
    }

    if (!theFont) {
      throw 'null font passed to textFont';
    }

    this._setProperty('_textFont', theFont);

    this.textSize(theSize);

    return this._applyTextProperties();
  };

  return p5;

});
