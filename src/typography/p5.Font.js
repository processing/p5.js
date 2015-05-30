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

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  /**
   * Base class for font handling
   * @class p5.Font
   * @constructor
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.Font = function(p) {

    this.parent = p;

    /**
     * Underlying opentype font implementation
     * @property font
     */
    this.font = undefined;
  };

  /**
   * Renders a set of glyph paths to the current graphics context
   * @param  {string} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Number} fontSize font size to use (optional)
   * @param  {Object} options  opentype options (optional)
   * @return {Object}         this object
   */
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

    // only draw stroke if manually set by user
    if (p._doStroke && p._strokeSet) {
      ctx.stroke();
    }

    if (p._doFill) {

      // if fill hasn't been set by user, use default-text-fill
      ctx.fillStyle = p._fillSet ? ctx.fillStyle:constants._DEFAULT_TEXT_FILL;
      ctx.fill();
    }

    return this;
  };

  /**
   * Returns a tight bounding box for the given text string using this font
   * @param  {string} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Number} fontSize font size to use (optional)
   * @return {Object}          a rectangle with properties: x, y, w, h
   */
  p5.Font.prototype.textBounds = function(str, x, y, fontSize) {

    //console.log('textBounds::',str, x, y, fontSize);

    if (!this.parent._isOpenType()) {

      throw Error('not supported for system fonts');
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize || this.parent._textSize;

    var xCoords = [],
      yCoords = [], minX, minY, maxX, maxY,
      scale = 1 / this.font.unitsPerEm * fontSize;

    this.font.forEachGlyph(str, x, y, fontSize, {},
      function(glyph, gX, gY) {

        if (glyph.name !== 'space') {

          gX = gX !== undefined ? gX : 0;
          gY = gY !== undefined ? gY : 0;

          var gm = glyph.getMetrics();
          xCoords.push(gX + (gm.xMin * scale));
          yCoords.push(gY + (-gm.yMin * scale));
          xCoords.push(gX + (gm.xMax * scale));
          yCoords.push(gY + (-gm.yMax * scale));
        }
      });

    minX = Math.min.apply(null, xCoords);
    minY = Math.min.apply(null, yCoords);
    maxX = Math.max.apply(null, xCoords);
    maxY = Math.max.apply(null, yCoords);

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
