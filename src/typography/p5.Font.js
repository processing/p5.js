/**
 * @module Font
 * @submodule Font
 * @requires core
 * @requires constants
 */
define(function(require) {

  /**
   * Issues
   * -- require opentype.js (awaiting dev-ops) **
   * -- var fonts = loadFont([]); **
   * -- example exposing opentype font object **
   * -- PFont functions:
   *    textBounds() exists
   *    glyphPaths -> object or array?
   *    PFont.list()
   * -- Integrating p5.dom (later)
   * -- alignment: justified
   * -- kerning
   * -- truncation
   * -- drop-caps
   */

  /**
   * This module defines the p5.Font class and P5 methods for
   * drawing text to the main display canvas.
   */

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  p5.Font = function(p) {

    this.parent = p;
    this.font = undefined;
  };

  p5.Font.prototype.renderPath = function(line, x, y, fontSize, options) {

    var pathdata, p = this.parent, pg = p._graphics, ctx = pg.drawingContext,
      textWidth, textHeight, textAscent, textDescent;

    fontSize = fontSize || p._textSize;
    options = options || {};

    textWidth = p.textWidth(line);
    textAscent = p.textAscent();
    textDescent = p.textDescent();
    textHeight = textAscent + textDescent;

    if (ctx.textAlign === constants.CENTER) {
      x -= textWidth / 2;
    } else if (ctx.textAlign === constants.RIGHT) {
      x -= textWidth;
    }

    if (ctx.textBaseline === constants.TOP) {
      y += textHeight;
    } else if (ctx.textBaseline === constants._CTX_MIDDLE) {
      y += textHeight / 2 - textDescent;
    } else if (ctx.textBaseline === constants.BOTTOM) {
      y -= textDescent;
    }

    pathdata = this.font.getPath(line, x, y, fontSize, options).commands;

    ctx.beginPath();
    for (var i = 0; i < pathdata.length; i += 1) {
      var cmd = pathdata[i];
      if (cmd.type === 'M') {
        ctx.moveTo(cmd.x, cmd.y);
      } else if (cmd.type === 'L') {
        ctx.lineTo(cmd.x, cmd.y);
      } else if (cmd.type === 'C') {
        ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
      } else if (cmd.type === 'Q') {
        ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
      } else if (cmd.type === 'Z') {
        ctx.closePath();
      }
    }

    if (p._doStroke && p._strokeSet) {
      ctx.stroke();
    }

    if (p._doFill) {

      // if fill hasn't been set by user, use default text fill
      ctx.fillStyle = p._fillSet ? ctx.fillStyle:constants._DEFAULT_TEXT_FILL;
      ctx.fill();
    }

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
