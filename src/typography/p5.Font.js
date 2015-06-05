/**
 * This module defines the p5.Font class and P5 methods for
 * drawing text to the main display canvas.
 * @module Typography
 * @submodule Font
 * @requires core
 * @requires constants
 */
define(function(require) {

  /*
   * TODO:
   * -- var fonts = loadFont([]); **
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

  var p5 = require('core/core');
  var constants = require('core/constants');

  /**
   * Base class for font handling
   * @class p5.Font
   * @constructor
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.Font = function(p) {

    this.parent = p;

    this.cache = {};

    /**
     * Underlying opentype font implementation
     * @property font
     */
    this.font = undefined;
  };


  /**
   * Returns the set of opentype glyphs for the supplied string.
   * Note that there is not a strict one-to-one mapping between characters
   * and glyphs, so the list of returned glyphs can be larger or smaller
   *  than the length of the given string.
   *
   * @param  {string} str the string to be converted
   * @return {array}     the opentype glyphs
   */
  p5.Font.prototype._getGlyphs = function(str) {
    return this.font.stringToGlyphs(str);
  }

  /*
   * Renders a set of glyph paths to the current graphics context
   */
  p5.Font.prototype._renderPath = function(line, x, y, fontSize, options) {

    var pdata, p = this.parent, pg = p._graphics, ctx = pg.drawingContext,
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

    pdata = this.font.getPath(line, x, y, fontSize, options).commands;

    ctx.beginPath();
    for (var i = 0; i < pdata.length; i += 1) {
      var cmd = pdata[i];
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
   * Returns a tight bounding box for the given custom text string using this
   * font (currently only support single line)
   *
   * @method textBounds
   * @param  {string} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Number} fontSize font size to use (optional)
   * @return {Object}          a rectangle object with properties: x, y, w, h
   * @example
   * <div>
   * <code>
   * var font;
   * var text = 'Lorem ipsum dolor sit amet.';
   * function preload() {
   *    font = loadFont('./assets/fonts/Regular.otf');
   * };
   * function setup() {
   *    background(210);
   *    textFont(font);
   *    strokeWeight(1);
   *    textSize(12);
   *    var bbox = font.textBounds(text, 10, 30, 12);
   *    fill(255);
   *    stroke(0);
   *    rect(bbox.x, bbox.y, bbox.w, bbox.h);
   *    fill(0);
   *    strokeWeight(0);
   *    text(text, 10, 30);
   * };
   * </code>
   * </div>
   */
   p5.Font.prototype.textBounds = function(str, x, y, fontSize, options) {

    if (!this.parent._isOpenType()) {

      throw Error('not supported for system fonts');
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize || this.parent._textSize;

    //console.log('textBounds(',str, x, y, fontSize,")");

    var result = this.cache[cacheKey('textBounds', str, x, y, fontSize)];
    if (!result) {
      // console.log('computing');
      var xCoords = [], advance,
        yCoords = [], minX, minY, maxX, maxY,
        scale = 1 / this.font.unitsPerEm * fontSize;

      this.font.forEachGlyph(str, x, y, fontSize, options,
        function(glyph, gX, gY, gFontSize) {

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

      result = {
        x: minX,
        y: minY,
        h: maxY - minY,
        w: (maxX - minX),
        advance: minX - x
      };

      this.cache[cacheKey('textBounds', str, x, y, fontSize)] = result;
    }
    else { console.log('cache-hit'); }

    return result;
  };

  p5.Font.prototype._drawPoints = function(str, tx, ty, fsize, options) {

    tx = tx !== undefined ? tx : 0;
    ty = ty !== undefined ? ty : 0;
    fsize = fsize || p._textSize;

    var pdata, onCurvePts, offCurvePts,
      p = this.parent, pg = p._graphics, ctx = pg.drawingContext,
      scale = (1 / this.font.unitsPerEm) * fsize;

    this.font.forEachGlyph(str, tx, ty, fsize, options,
      function(glyph, x, y, fontSize) {

        pdata = glyph.path.commands;
        onCurvePts = [], offCurvePts = [];

        for (var i = 0; i < pdata.length; i += 1) {

          var cmd = pdata[i];
          if (cmd.x !== undefined) {
            onCurvePts.push({ x: cmd.x, y: -cmd.y });
          }

          if (cmd.x1 !== undefined) {
            offCurvePts.push({ x: cmd.x1, y: -cmd.y1 });
          }

          if (cmd.x2 !== undefined) {
            offCurvePts.push({ x: cmd.x2, y: -cmd.y2 });
          }
        }

        p.noStroke();
        p.fill(0,0,255);
        drawCircles(onCurvePts, x, y, scale);
        p.fill(255,0,0);
        drawCircles(offCurvePts, x, y, scale);
    });

    function drawCircles(l, x, y, scale) {
      for (var j = 0; j < l.length; j++) {
        p.ellipse(x + (l[j].x * scale), y + (l[j].y * scale), 3, 3);
      }
    }
  };

  p5.Font.prototype.list = function() {

    // TODO
    throw 'not yet implemented';
  };

  // helpers

  function cacheKey() {
    var args = Array.prototype.slice.call(arguments),
      i = args.length,
      hash = '';

    while (i--) {
      hash += (args[i] === Object(args[i])) ?
        JSON.stringify(args[i]) : args[i];
    }
    return hash;
  }

  return p5.Font;
});
