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
  var constants = require('constants');

  p5.Font = function(p) {

    this.parent = p;
    this.font = undefined;
  };

  p5.Font.prototype.renderPath = function(line, x, y, fontSize, options) {

    var path, p = this.parent;

    fontSize = fontSize || p._textSize;
    options = options || {};

    path = this.font.getPath(line, x, y, fontSize, options);

    //console.log('STROKE: '+p.drawingContext.strokeStyle);
    //console.log('FILL: '+p.drawingContext.fillStyle);

    if (p._doStroke && p.drawingContext.strokeStyle !==
      constants._DEFAULT_STROKE) {

      path.stroke = p.drawingContext.strokeStyle;
    }

    if (p._doFill) {

      path.fill = p.drawingContext.strokeStyle === constants._DEFAULT_FILL ?
        constants._DEFAULT_TEXT_FILL : p.drawingContext.fillStyle;
    }

    path.draw(p.drawingContext);
  };

  p5.Font.prototype.textBounds = function(str, x, y, fontSize) {

    //console.log('textBounds::',str, x, y, fontSize);

    if (!this.parent._isOpenType()) {
      throw Error('not supported for system fonts');
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize || this.parent._textSize;

    var xCoords = [],
      yCoords = [],
      scale = 1 / this.font.unitsPerEm * fontSize;

    this.font.forEachGlyph(str, x, y, fontSize, {},
      function(glyph, gX, gY) {

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
  };

  p5.Font.prototype.list = function() {

    // TODO
    throw 'not yet implemented';
  };

  return p5.Font;
});
