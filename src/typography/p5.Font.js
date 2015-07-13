/**
 * This module defines the p5.Font class and functions for
 * drawing text to the display canvas.
 * @module Typography
 * @submodule Font
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

/*
 * TODO:
 *
 * API:
 * -- textBounds()
 * -- getPath()
 * -- getPoints()
 *
 * ===========================================
 * -- PFont functions:
 *    PFont.list()
 *
 * -- kerning
 * -- alignment: justified?
 * -- integrate p5.dom? (later)
 */

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

p5.Font.prototype.list = function() {

  // TODO
  throw 'not yet implemented';
};

/**
 * Returns a tight bounding box for the given text string using this
 * font (currently only supports single lines)
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

 *    var bbox = font.textBounds(text, 10, 30, 12);
 *    fill(255);
 *    stroke(0);
 *    rect(bbox.x, bbox.y, bbox.w, bbox.h);
 *    fill(0);
 *    noStroke();
 *     *    textFont(font);
  *    textSize(12);
 *    text(text, 10, 30);
 * };
 * </code>
 * </div>
 */
p5.Font.prototype.textBounds = function(str, x, y, fontSize, options) {

  x = x !== undefined ? x : 0;
  y = y !== undefined ? y : 0;
  fontSize = fontSize || this.parent._textSize;

  var result = this.cache[cacheKey('textBounds', str, x, y, fontSize)];
  if (!result) {

    var xCoords = [], yCoords = [], self = this,
      scale = this._scale(fontSize), minX, minY, maxX, maxY;

    this.font.forEachGlyph(str, x, y, fontSize, options,
      function(glyph, gX, gY, gFontSize) {

        xCoords.push(gX);
        yCoords.push(gY);

        if (glyph.name !== 'space') {

          var gm = glyph.getMetrics();

          xCoords.push(gX + (gm.xMax * scale));
          yCoords.push(gY + (-gm.yMin * scale));
          yCoords.push(gY + (-gm.yMax * scale));

        } else {

          xCoords.push(gX + self.font.charToGlyph(' ').advanceWidth *
            self._scale(fontSize));
        }
      });

    minX = Math.max(0, Math.min.apply(null, xCoords));
    minY = Math.max(0, Math.min.apply(null, yCoords));
    maxX = Math.max(0, Math.max.apply(null, xCoords));
    maxY = Math.max(0, Math.max.apply(null, yCoords));

    result = {
      x: minX,
      y: minY,
      h: maxY - minY,
      w: maxX - minX,
      advance: minX - x
    };

    this.cache[cacheKey('textBounds', str, x, y, fontSize)] = result;
  }
  //else console.log('cache-hit');

  return result;
};

// ----------------------------- End API ------------------------------

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

  var p = this.parent,
    ctx = p._graphics.drawingContext,
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
 * Creates an SVG <path> element, as a string,
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
    if (typeof options.fill !== 'undefined') {
      line.fill = options.fill;
    }
    if (typeof options.stroke !== 'undefined') {
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
  var pdata, p = this.parent,
    pg = p._graphics,
    ctx = pg.drawingContext;

  if (typeof line === 'object' && line.commands) {

    pdata = line.commands;
  } else {

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
    ctx.fillStyle = p._fillSet ? ctx.fillStyle : constants._DEFAULT_TEXT_FILL;
    ctx.fill();
  }

  return this;
};

p5.Font.prototype._textWidth = function(str, fontSize) {

  if (str === ' ') { // special case for now

    return this.font.charToGlyph(' ').advanceWidth * this._scale(fontSize);
  }

  var bounds = this.textBounds(str, 0, 0, fontSize);
  return bounds.w + bounds.advance;
};

p5.Font.prototype._textAscent = function(fontSize) {

  return this.font.ascender * this._scale(fontSize);
};

p5.Font.prototype._textDescent = function(fontSize) {

  return -this.font.descender * this._scale(fontSize);
};

p5.Font.prototype._scale = function(fontSize) {

  return (1 / this.font.unitsPerEm) * (fontSize || this.parent._textSize);
};

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

module.exports = p5.Font;
