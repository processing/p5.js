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
   *
   * Note that there is not a strict one-to-one mapping between characters
   * and glyphs, so the list of returned glyphs can be larger or smaller
   *  than the length of the given string.
   *
   * @param  {String} str the string to be converted
   * @return {array}     the opentype glyphs
   */
  p5.Font.prototype._getGlyphs = function(str) {

    return this.font.stringToGlyphs(str);
  };

  /**
   * Returns an opentype path for the supplied string and position.
   *
   * @param  {String} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Object} options opentype options (optional)
   * @return {Object}     the opentype path
   */
  p5.Font.prototype._getPath = function(line, x, y, options) {

    var p = this.parent, ctx = p._graphics.drawingContext,
      pos = this._handleAlignment(p, ctx, line, x, y);

    return this.font.getPath(line, pos.x, pos.y, p._textSize, options);
  };

  /*
   * Creates an SVG-formatted path-data string
   * (See http://www.w3.org/TR/SVG/paths.html#PathData)
   * from the given opentype path or string/position
   *
   * @param  {Object} path    an opentype path, OR the following:
   *
   * @param  {String} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Object} options opentype options (optional), set options.decimals
   * to set the decimal precision of the path-data
   *
   * @return {Object}     this p5.Font object
   */
  p5.Font.prototype._getPathData = function(line, x, y, options) {

    var decimals = 3;

    // create path from string/position
    if (typeof line === 'string' && arguments.length > 2) {

      line = this._getPath(line, x, y, options);
    }
    // handle options specified in 2nd arg
    else if (typeof x === 'object') {

      options = x;
    }

    // handle svg arguments
    if (options && typeof options.decimals === 'number') {

      decimals = options.decimals;
    }

    return line.toPathData(decimals);
  };

  /*
   * Creates an SVG <path> element, as a string, from the
   * from the given opentype path or string/position
   *
   * @param  {Object} path    an opentype path, OR the following:
   *
   * @param  {String} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Object} options opentype options (optional), set options.decimals
   * to set the decimal precision of the path-data in the <path> element,
   *  options.fill to set the fill color for the <path> element,
   *  options.stroke to set the stroke color for the <path> element,
   *  options.strokeWidth to set the strokeWidth for the <path> element.
   *
   * @return {Object}     this p5.Font object
   */
  p5.Font.prototype._getSVG = function(line, x, y, options) {

    var decimals = 3;

    // create path from string/position
    if (typeof line === 'string' && arguments.length > 2) {

      line = this._getPath(line, x, y, options);
    }
    // handle options specified in 2nd arg
    else if (typeof x === 'object') {

      options = x;
    }

    // handle svg arguments
    if (options) {
      if (typeof options.decimals === 'number') {
        decimals = options.decimals;
      }
      if (typeof options.strokeWidth === 'number') {
        line.strokeWidth = options.strokeWidth;
      }
      if (typeof options.fill !== undefined) {
        line.fill = options.fill;
      }
      if (typeof options.stroke !== undefined) {
        line.stroke = options.stroke;
      }
    }

    return line.toSVG(decimals);
  };

  /*
   * Renders an opentype path or string/position
   * to the current graphics context
   *
   * @param  {Object} path    an opentype path, OR the following:
   *
   * @param  {String} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Object} options opentype options (optional)
   *
   * @return {Object}     this p5.Font object
   */
  p5.Font.prototype._renderPath = function(line, x, y, options) {

    // /console.log('_renderPath', typeof line);
    var pdata, p = this.parent, pg = p._graphics, ctx = pg.drawingContext;

    if (typeof line === 'object' && line.commands) {

      pdata = line.commands;
    }
    else {

      //pos = handleAlignment(p, ctx, line, x, y);
      pdata = this._getPath(line, x, y, p._textSize, options).commands;
    }

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

  p5.Font.prototype._textWidth = function(str) {

    if (str === ' ') { // special case for now

      return this.font.charToGlyph(' ').advanceWidth * this._scale();
    }

    var bounds = this.textBounds(str);
    return bounds.w + bounds.advance;
  };

  p5.Font.prototype._textAscent = function() {

    var bounds = this.textBounds('ABCjgq|');
    return Math.abs(bounds.y);
  };

  p5.Font.prototype._textDescent = function() {

    var bounds = this.textBounds('ABCjgq|');
    return bounds.h - Math.abs(bounds.y);
  };

  p5.Font.prototype._scale = function(fontSize) {

    return (1 / this.font.unitsPerEm) * (fontSize || this.parent._textSize);
  };

  /**
   * Returns a tight bounding box for the given custom text string using this
   * font (currently only support single line)
   *
   * @method textBounds
   * @param  {String} line     a line of text
   * @param  {Number} x        x-position
   * @param  {Number} y        y-position
   * @param  {Number} fontSize font size to use (optional)
   * @param  {Object} options opentype options (optional)
   *
   * @return {Object}          a rectangle object with properties: x, y, w, h
   *
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

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize || this.parent._textSize;

    //console.log('textBounds(',str, x, y, fontSize,')');

    var result = this.cache[cacheKey('textBounds', str, x, y, fontSize)];
    if (!result) {

      // console.log('computing');
      if (str !== ' ') {

        var xCoords = [],
          yCoords = [],
          scale = this._scale(fontSize),
          minX, minY, maxX, maxY;

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
          w: maxX - minX,
          advance: minX - x
        };
      }
      else { // special case ' ' for now

        var tw = this._textWidth(str);
        result = {
          x: x,
          y: y,
          h: 0,
          w: tw,
          advance: 0 // ?
        };
      }

      this.cache[cacheKey('textBounds', str, x, y, fontSize)] = result;
    }
    //else { console.log('cache-hit'); }

    return result;
  };

  p5.Font.prototype._drawPoints = function(str, tx, ty, options) { // remove?

    var pdata, onCurvePts, offCurvePts, p = this.parent, scale = this._scale();

    tx = tx !== undefined ? tx : 0;
    ty = ty !== undefined ? ty : 0;

    this.font.forEachGlyph(str, tx, ty, p._textSize, options,
      function(glyph, x, y, fontSize) {

        onCurvePts = [];
        offCurvePts = [];
        pdata = glyph.path.commands;

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

  p5.Font.prototype._handleAlignment = function(p, ctx, line, x, y) {

    var textWidth = this._textWidth(line),
      textAscent = this._textAscent(),
      textDescent = this._textDescent(),
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

    return { x: x, y: y };
  };

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
