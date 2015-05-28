/**
 * @module Font
 * @submodule Font
 * @requires core
 * @requires constants
 */
define(function(require) {

  /**
   * This module defines the p5.Font class and P5 methods for
   * drawing text to the main display canvas.
   */

  /*
   * ISSUES:
   *  default stroke/fill (wait)
   *  Vertical Center-Align broken: does top instead (system, custom?)
   */

  'use strict';

  var p5 = require('core');

  /*
      textAlign()
      textLeading()
      textSize()
      textStyle()
      textWidth()

      text()
      textFont(obj)
      textFont(str) ?
      textFont() ?

      loadFont(str)
  */


  p5.Font = function() {

    this.font = undefined;
  };

  p5.Font.isOpenType = function(f) {

    var ok = (typeof f === 'object' && f.supported); // && f.font.supported);
    if (0&&!ok) {
      console.log('!OT: '+typeof f, Object.keys(f), f.supported);
    }
    return ok;
  };

  p5.Font.prototype.list = function() {

    // TODO
    throw 'not yet implemented';
  };


  /*
  p5.Font.prototype.textBounds = function() {
    p5.prototype.textBounds.apply(p5, arguments);
  }

  p5.Font.prototype.textBounds = function(str, x, y, textSize) {

    //console.log('textBounds::',this._textFont);

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;

    var xCoords = [],
        yCoords = [],
        scale = 1 / this.font.unitsPerEm * textSize;

    this.font.forEachGlyph(str, x, y, textSize, {},
      function(glyph, gX, gY, gFontSize)
      {
        if (glyph.name != 'space') {

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

    return { x: minX, y: minY, w: maxX-minX, h: maxY-minY };
  };
  */

  return p5.Font;
});
