/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

'use strict';

var p5 = require('./main');
var constants = require('../core/constants');

/**
 * Main graphics and rendering context, as well as the base API
 * implementation for p5.js "core". To be used as the superclass for
 * Renderer2D and Renderer3D classes, respecitvely.
 *
 * @class p5.Renderer
 * @constructor
 * @extends p5.Element
 * @param {String} elt DOM node that is wrapped
 * @param {p5} [pInst] pointer to p5 instance
 * @param {Boolean} [isMainCanvas] whether we're using it as main canvas
 */
p5.Renderer = function(elt, pInst, isMainCanvas) {
  p5.Element.call(this, elt, pInst);
  this.canvas = elt;
  if (isMainCanvas) {
    this._isMainCanvas = true;
    // for pixel method sharing with pimage
    this._pInst._setProperty('_curElement', this);
    this._pInst._setProperty('canvas', this.canvas);
    this._pInst._setProperty('width', this.width);
    this._pInst._setProperty('height', this.height);
  } else {
    // hide if offscreen buffer by default
    this.canvas.style.display = 'none';
    this._styles = []; // non-main elt styles stored in p5.Renderer
  }

  this._textSize = 12;
  this._textLeading = 15;
  this._textFont = 'sans-serif';
  this._textStyle = constants.NORMAL;
  this._textAscent = null;
  this._textDescent = null;
  this._textAlign = constants.LEFT;
  this._textBaseline = constants.BASELINE;

  this._rectMode = constants.CORNER;
  this._ellipseMode = constants.CENTER;
  this._curveTightness = 0;
  this._imageMode = constants.CORNER;

  this._tint = null;
  this._doStroke = true;
  this._doFill = true;
  this._strokeSet = false;
  this._fillSet = false;
};

p5.Renderer.prototype = Object.create(p5.Element.prototype);

// the renderer should return a 'style' object that it wishes to
// store on the push stack.
p5.Renderer.prototype.push = function() {
  return {
    properties: {
      _doStroke: this._doStroke,
      _strokeSet: this._strokeSet,
      _doFill: this._doFill,
      _fillSet: this._fillSet,
      _tint: this._tint,
      _imageMode: this._imageMode,
      _rectMode: this._rectMode,
      _ellipseMode: this._ellipseMode,
      _textFont: this._textFont,
      _textLeading: this._textLeading,
      _textSize: this._textSize,
      _textAlign: this._textAlign,
      _textBaseline: this._textBaseline,
      _textStyle: this._textStyle
    }
  };
};

// a pop() operation is in progress
// the renderer is passed the 'style' object that it returned
// from its push() method.
p5.Renderer.prototype.pop = function(style) {
  if (style.properties) {
    // copy the style properties back into the renderer
    Object.assign(this, style.properties);
  }
};

/**
 * Resize our canvas element.
 */
p5.Renderer.prototype.resize = function(w, h) {
  this.width = w;
  this.height = h;
  this.elt.width = w * this._pInst._pixelDensity;
  this.elt.height = h * this._pInst._pixelDensity;
  this.elt.style.width = w + 'px';
  this.elt.style.height = h + 'px';
  if (this._isMainCanvas) {
    this._pInst._setProperty('width', this.width);
    this._pInst._setProperty('height', this.height);
  }
};

/**
 * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
 * an image. If no parameters are specified, the entire image is returned.
 * Use the x and y parameters to get the value of one pixel. Get a section of
 * the display window by specifying additional w and h parameters. When
 * getting an image, the x and y parameters define the coordinates for the
 * upper-left corner of the image, regardless of the current imageMode().
 * <br><br>
 * If the pixel requested is outside of the image window, [0,0,0,255] is
 * returned.
 * <br><br>
 * Getting the color of a single pixel with get(x, y) is easy, but not as fast
 * as grabbing the data directly from pixels[]. The equivalent statement to
 * get(x, y) is using pixels[] with pixel density d
 *
 * @private
 * @method get
 * @param  {Number}               [x] x-coordinate of the pixel
 * @param  {Number}               [y] y-coordinate of the pixel
 * @param  {Number}               [w] width
 * @param  {Number}               [h] height
 * @return {Number[]|Color|p5.Image}  color of pixel at x,y in array format
 *                                    [R, G, B, A] or <a href="#/p5.Image">p5.Image</a>
 */
p5.Renderer.prototype.get = function(x, y, w, h) {
  if (typeof w === 'undefined' && typeof h === 'undefined') {
    if (typeof x === 'undefined' && typeof y === 'undefined') {
      x = y = 0;
      w = this.width;
      h = this.height;
    } else {
      w = h = 1;
    }
  }

  // if the section does not overlap the canvas
  if (x + w < 0 || y + h < 0 || x >= this.width || y >= this.height) {
    // TODO: is this valid for w,h > 1 ?
    return [0, 0, 0, 255];
  }

  var ctx = this._pInst || this;
  var pd = ctx._pixelDensity;

  // round down to get integer numbers
  x = Math.floor(x);
  y = Math.floor(y);
  w = Math.floor(w);
  h = Math.floor(h);

  var sx = x * pd;
  var sy = y * pd;
  if (w === 1 && h === 1) {
    var imageData, index;
    if (ctx._pixelsDirty) {
      imageData = this.readPixel(sx, sy);
      index = 0;
    } else {
      imageData = ctx.pixels;
      index = (sx + sy * this.width * pd) * 4;
    }
    return [
      imageData[index + 0],
      imageData[index + 1],
      imageData[index + 2],
      imageData[index + 3]
    ];
  } else {
    //auto constrain the width and height to
    //dimensions of the source image
    var dw = Math.min(w, ctx.width);
    var dh = Math.min(h, ctx.height);
    var sw = dw * pd;
    var sh = dh * pd;

    var region = new p5.Image(dw, dh);
    region.canvas
      .getContext('2d')
      .drawImage(this.canvas, sx, sy, sw, sh, 0, 0, dw, dh);

    return region;
  }
};

p5.Renderer.prototype.readPixel = function(x, y) {
  throw new Error('readPixel not implemented');
};

p5.Renderer.prototype.textLeading = function(l) {
  if (typeof l === 'number') {
    this._setProperty('_textLeading', l);
    return this._pInst;
  }

  return this._textLeading;
};

p5.Renderer.prototype.textSize = function(s) {
  if (typeof s === 'number') {
    this._setProperty('_textSize', s);
    this._setProperty('_textLeading', s * constants._DEFAULT_LEADMULT);
    return this._applyTextProperties();
  }

  return this._textSize;
};

p5.Renderer.prototype.textStyle = function(s) {
  if (s) {
    if (
      s === constants.NORMAL ||
      s === constants.ITALIC ||
      s === constants.BOLD
    ) {
      this._setProperty('_textStyle', s);
    }

    return this._applyTextProperties();
  }

  return this._textStyle;
};

p5.Renderer.prototype.textAscent = function() {
  if (this._textAscent === null) {
    this._updateTextMetrics();
  }
  return this._textAscent;
};

p5.Renderer.prototype.textDescent = function() {
  if (this._textDescent === null) {
    this._updateTextMetrics();
  }
  return this._textDescent;
};

p5.Renderer.prototype.textAlign = function(h, v) {
  if (typeof h !== 'undefined') {
    this._setProperty('_textAlign', h);

    if (typeof v !== 'undefined') {
      this._setProperty('_textBaseline', v);
    }

    return this._applyTextProperties();
  } else {
    return {
      horizontal: this._textAlign,
      vertical: this._textBaseline
    };
  }
};

p5.Renderer.prototype.text = function(str, x, y, maxWidth, maxHeight) {
  var p = this._pInst,
    cars,
    n,
    ii,
    jj,
    line,
    testLine,
    testWidth,
    words,
    totalHeight,
    finalMaxHeight = Number.MAX_VALUE;

  if (!(this._doFill || this._doStroke)) {
    return;
  }

  if (typeof str === 'undefined') {
    return;
  } else if (typeof str !== 'string') {
    str = str.toString();
  }

  str = str.replace(/(\t)/g, '  ');
  cars = str.split('\n');

  if (typeof maxWidth !== 'undefined') {
    totalHeight = 0;
    for (ii = 0; ii < cars.length; ii++) {
      line = '';
      words = cars[ii].split(' ');
      for (n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        testWidth = this.textWidth(testLine);
        if (testWidth > maxWidth) {
          line = words[n] + ' ';
          totalHeight += p.textLeading();
        } else {
          line = testLine;
        }
      }
    }

    if (this._rectMode === constants.CENTER) {
      x -= maxWidth / 2;
      y -= maxHeight / 2;
    }

    switch (this._textAlign) {
      case constants.CENTER:
        x += maxWidth / 2;
        break;
      case constants.RIGHT:
        x += maxWidth;
        break;
    }

    var baselineHacked = false;
    if (typeof maxHeight !== 'undefined') {
      switch (this._textBaseline) {
        case constants.BOTTOM:
          y += maxHeight - totalHeight;
          break;
        case constants.CENTER:
          y += (maxHeight - totalHeight) / 2;
          break;
        case constants.BASELINE:
          baselineHacked = true;
          this._textBaseline = constants.TOP;
          break;
      }

      // remember the max-allowed y-position for any line (fix to #928)
      finalMaxHeight = y + maxHeight - p.textAscent();
    }

    for (ii = 0; ii < cars.length; ii++) {
      line = '';
      words = cars[ii].split(' ');
      for (n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        testWidth = this.textWidth(testLine);
        if (testWidth > maxWidth && line.length > 0) {
          this._renderText(p, line, x, y, finalMaxHeight);
          line = words[n] + ' ';
          y += p.textLeading();
        } else {
          line = testLine;
        }
      }

      this._renderText(p, line, x, y, finalMaxHeight);
      y += p.textLeading();

      if (baselineHacked) {
        this._textBaseline = constants.BASELINE;
      }
    }
  } else {
    // Offset to account for vertically centering multiple lines of text - no
    // need to adjust anything for vertical align top or baseline
    var offset = 0,
      vAlign = p.textAlign().vertical;
    if (vAlign === constants.CENTER) {
      offset = (cars.length - 1) * p.textLeading() / 2;
    } else if (vAlign === constants.BOTTOM) {
      offset = (cars.length - 1) * p.textLeading();
    }

    for (jj = 0; jj < cars.length; jj++) {
      this._renderText(p, cars[jj], x, y - offset, finalMaxHeight);
      y += p.textLeading();
    }
  }

  return p;
};

p5.Renderer.prototype._applyDefaults = function() {
  return this;
};

/**
 * Helper fxn to check font type (system or otf)
 */
p5.Renderer.prototype._isOpenType = function(f) {
  f = f || this._textFont;
  return typeof f === 'object' && f.font && f.font.supported;
};

p5.Renderer.prototype._updateTextMetrics = function() {
  if (this._isOpenType()) {
    this._setProperty('_textAscent', this._textFont._textAscent());
    this._setProperty('_textDescent', this._textFont._textDescent());
    return this;
  }

  // Adapted from http://stackoverflow.com/a/25355178
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
  var blockOffset = calculateOffset(block);
  var textOffset = calculateOffset(text);
  var ascent = blockOffset[1] - textOffset[1];

  block.style.verticalAlign = 'bottom';
  blockOffset = calculateOffset(block);
  textOffset = calculateOffset(text);
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
function calculateOffset(object) {
  var currentLeft = 0,
    currentTop = 0;
  if (object.offsetParent) {
    do {
      currentLeft += object.offsetLeft;
      currentTop += object.offsetTop;
    } while ((object = object.offsetParent));
  } else {
    currentLeft += object.offsetLeft;
    currentTop += object.offsetTop;
  }
  return [currentLeft, currentTop];
}

module.exports = p5.Renderer;
