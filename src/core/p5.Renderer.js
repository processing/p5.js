/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import p5 from './main';
import * as constants from '../core/constants';

/**
 * Main graphics and rendering context, as well as the base API
 * implementation for p5.js "core". To be used as the superclass for
 * Renderer2D and Renderer3D classes, respectively.
 *
 * @class p5.Renderer
 * @extends p5.Element
 * @param {HTMLElement} elt DOM node that is wrapped
 * @param {p5} [pInst] pointer to p5 instance
 * @param {Boolean} [isMainCanvas] whether we're using it as main canvas
 */
p5.Renderer = class Renderer extends p5.Element {
  constructor(elt, pInst, isMainCanvas) {
    super(elt, pInst);
    this.canvas = elt;
    this._pixelsState = pInst;
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

    this._clipping = false;
    this._clipInvert = false;

    this._textSize = 12;
    this._textLeading = 15;
    this._textFont = 'sans-serif';
    this._textStyle = constants.NORMAL;
    this._textAscent = null;
    this._textDescent = null;
    this._textAlign = constants.LEFT;
    this._textBaseline = constants.BASELINE;
    this._textWrap = constants.WORD;

    this._rectMode = constants.CORNER;
    this._ellipseMode = constants.CENTER;
    this._curveTightness = 0;
    this._imageMode = constants.CORNER;

    this._tint = null;
    this._doStroke = true;
    this._doFill = true;
    this._strokeSet = false;
    this._fillSet = false;
    this._leadingSet = false;

    this._pushPopDepth = 0;
  }

  // the renderer should return a 'style' object that it wishes to
  // store on the push stack.
  push () {
    this._pushPopDepth++;
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
        _leadingSet: this._leadingSet,
        _textSize: this._textSize,
        _textAlign: this._textAlign,
        _textBaseline: this._textBaseline,
        _textStyle: this._textStyle,
        _textWrap: this._textWrap
      }
    };
  }

  // a pop() operation is in progress
  // the renderer is passed the 'style' object that it returned
  // from its push() method.
  pop (style) {
    this._pushPopDepth--;
    if (style.properties) {
    // copy the style properties back into the renderer
      Object.assign(this, style.properties);
    }
  }

  beginClip(options = {}) {
    if (this._clipping) {
      throw new Error("It looks like you're trying to clip while already in the middle of clipping. Did you forget to endClip()?");
    }
    this._clipping = true;
    this._clipInvert = options.invert;
  }

  endClip() {
    if (!this._clipping) {
      throw new Error("It looks like you've called endClip() without beginClip(). Did you forget to call beginClip() first?");
    }
    this._clipping = false;
  }

  /**
 * Resize our canvas element.
 */
  resize (w, h) {
    this.width = w;
    this.height = h;
    this.elt.width = w * this._pInst._pixelDensity;
    this.elt.height = h * this._pInst._pixelDensity;
    this.elt.style.width = `${w}px`;
    this.elt.style.height = `${h}px`;
    if (this._isMainCanvas) {
      this._pInst._setProperty('width', this.width);
      this._pInst._setProperty('height', this.height);
    }
  }

  get (x, y, w, h) {
    const pixelsState = this._pixelsState;
    const pd = pixelsState._pixelDensity;
    const canvas = this.canvas;

    if (typeof x === 'undefined' && typeof y === 'undefined') {
    // get()
      x = y = 0;
      w = pixelsState.width;
      h = pixelsState.height;
    } else {
      x *= pd;
      y *= pd;

      if (typeof w === 'undefined' && typeof h === 'undefined') {
      // get(x,y)
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
          return [0, 0, 0, 0];
        }

        return this._getPixel(x, y);
      }
    // get(x,y,w,h)
    }

    const region = new p5.Image(w*pd, h*pd);
    region.pixelDensity(pd);
    region.canvas
      .getContext('2d')
      .drawImage(canvas, x, y, w * pd, h * pd, 0, 0, w*pd, h*pd);

    return region;
  }

  textLeading (l) {
    if (typeof l === 'number') {
      this._setProperty('_leadingSet', true);
      this._setProperty('_textLeading', l);
      return this._pInst;
    }

    return this._textLeading;
  }

  textStyle (s) {
    if (s) {
      if (
        s === constants.NORMAL ||
      s === constants.ITALIC ||
      s === constants.BOLD ||
      s === constants.BOLDITALIC
      ) {
        this._setProperty('_textStyle', s);
      }

      return this._applyTextProperties();
    }

    return this._textStyle;
  }

  textAscent () {
    if (this._textAscent === null) {
      this._updateTextMetrics();
    }
    return this._textAscent;
  }

  textDescent () {
    if (this._textDescent === null) {
      this._updateTextMetrics();
    }
    return this._textDescent;
  }

  textAlign (h, v) {
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
  }

  textWrap (wrapStyle) {
    this._setProperty('_textWrap', wrapStyle);
    return this._textWrap;
  }

  text(str, x, y, maxWidth, maxHeight) {
    const p = this._pInst;
    const textWrapStyle = this._textWrap;

    let lines;
    let line;
    let testLine;
    let testWidth;
    let words;
    let chars;
    let shiftedY;
    let finalMaxHeight = Number.MAX_VALUE;
    // fix for #5785 (top of bounding box)
    let finalMinHeight = y;

    if (!(this._doFill || this._doStroke)) {
      return;
    }

    if (typeof str === 'undefined') {
      return;
    } else if (typeof str !== 'string') {
      str = str.toString();
    }

    // Replaces tabs with double-spaces and splits string on any line
    // breaks present in the original string
    str = str.replace(/(\t)/g, '  ');
    lines = str.split('\n');

    if (typeof maxWidth !== 'undefined') {
      if (this._rectMode === constants.CENTER) {
        x -= maxWidth / 2;
      }

      switch (this._textAlign) {
        case constants.CENTER:
          x += maxWidth / 2;
          break;
        case constants.RIGHT:
          x += maxWidth;
          break;
      }

      if (typeof maxHeight !== 'undefined') {
        if (this._rectMode === constants.CENTER) {
          y -= maxHeight / 2;
          finalMinHeight -= maxHeight / 2;
        }

        let originalY = y;
        let ascent = p.textAscent();

        switch (this._textBaseline) {
          case constants.BOTTOM:
            shiftedY = y + maxHeight;
            y = Math.max(shiftedY, y);
            // fix for #5785 (top of bounding box)
            finalMinHeight += ascent;
            break;
          case constants.CENTER:
            shiftedY = y + maxHeight / 2;
            y = Math.max(shiftedY, y);
            // fix for #5785 (top of bounding box)
            finalMinHeight += ascent / 2;
            break;
        }

        // remember the max-allowed y-position for any line (fix to #928)
        finalMaxHeight = y + maxHeight - ascent;

        // fix for #5785 (bottom of bounding box)
        if (this._textBaseline === constants.CENTER) {
          finalMaxHeight = originalY + maxHeight - ascent / 2;
        }
      } else {
      // no text-height specified, show warning for BOTTOM / CENTER
        if (this._textBaseline === constants.BOTTOM ||
        this._textBaseline === constants.CENTER) {
        // use rectHeight as an approximation for text height
          let rectHeight = p.textSize() * this._textLeading;
          finalMinHeight = y - rectHeight / 2;
          finalMaxHeight = y + rectHeight / 2;
        }
      }

      // Render lines of text according to settings of textWrap
      // Splits lines at spaces, for loop adds one word + space
      // at a time and tests length with next word added
      if (textWrapStyle === constants.WORD) {
        let nlines = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          line = '';
          words = lines[lineIndex].split(' ');
          for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            testLine = `${line + words[wordIndex]}` + ' ';
            testWidth = this.textWidth(testLine);
            if (testWidth > maxWidth && line.length > 0) {
              nlines.push(line);
              line = `${words[wordIndex]}` + ' ';
            } else {
              line = testLine;
            }
          }
          nlines.push(line);
        }

        let offset = 0;
        if (this._textBaseline === constants.CENTER) {
          offset = (nlines.length - 1) * p.textLeading() / 2;
        } else if (this._textBaseline === constants.BOTTOM) {
          offset = (nlines.length - 1) * p.textLeading();
        }

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          line = '';
          words = lines[lineIndex].split(' ');
          for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            testLine = `${line + words[wordIndex]}` + ' ';
            testWidth = this.textWidth(testLine);
            if (testWidth > maxWidth && line.length > 0) {
              this._renderText(
                p,
                line.trim(),
                x,
                y - offset,
                finalMaxHeight,
                finalMinHeight
              );
              line = `${words[wordIndex]}` + ' ';
              y += p.textLeading();
            } else {
              line = testLine;
            }
          }
          this._renderText(
            p,
            line.trim(),
            x,
            y - offset,
            finalMaxHeight,
            finalMinHeight
          );
          y += p.textLeading();
        }
      } else {
        let nlines = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          line = '';
          chars = lines[lineIndex].split('');
          for (let charIndex = 0; charIndex < chars.length; charIndex++) {
            testLine = `${line + chars[charIndex]}`;
            testWidth = this.textWidth(testLine);
            if (testWidth <= maxWidth) {
              line += chars[charIndex];
            } else if (testWidth > maxWidth && line.length > 0) {
              nlines.push(line);
              line = `${chars[charIndex]}`;
            }
          }
        }

        nlines.push(line);
        let offset = 0;
        if (this._textBaseline === constants.CENTER) {
          offset = (nlines.length - 1) * p.textLeading() / 2;
        } else if (this._textBaseline === constants.BOTTOM) {
          offset = (nlines.length - 1) * p.textLeading();
        }

        // Splits lines at characters, for loop adds one char at a time
        // and tests length with next char added
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          line = '';
          chars = lines[lineIndex].split('');
          for (let charIndex = 0; charIndex < chars.length; charIndex++) {
            testLine = `${line + chars[charIndex]}`;
            testWidth = this.textWidth(testLine);
            if (testWidth <= maxWidth) {
              line += chars[charIndex];
            } else if (testWidth > maxWidth && line.length > 0) {
              this._renderText(
                p,
                line.trim(),
                x,
                y - offset,
                finalMaxHeight,
                finalMinHeight
              );
              y += p.textLeading();
              line = `${chars[charIndex]}`;
            }
          }
        }
        this._renderText(
          p,
          line.trim(),
          x,
          y - offset,
          finalMaxHeight,
          finalMinHeight
        );
        y += p.textLeading();
      }
    } else {
    // Offset to account for vertically centering multiple lines of text - no
    // need to adjust anything for vertical align top or baseline
      let offset = 0;
      if (this._textBaseline === constants.CENTER) {
        offset = (lines.length - 1) * p.textLeading() / 2;
      } else if (this._textBaseline === constants.BOTTOM) {
        offset = (lines.length - 1) * p.textLeading();
      }

      // Renders lines of text at any line breaks present in the original string
      for (let i = 0; i < lines.length; i++) {
        this._renderText(
          p,
          lines[i],
          x,
          y - offset,
          finalMaxHeight,
          finalMinHeight - offset
        );
        y += p.textLeading();
      }
    }

    return p;
  }

  _applyDefaults() {
    return this;
  }

  /**
 * Helper function to check font type (system or otf)
 */
  _isOpenType(f = this._textFont) {
    return typeof f === 'object' && f.font && f.font.supported;
  }

  _updateTextMetrics() {
    if (this._isOpenType()) {
      this._setProperty('_textAscent', this._textFont._textAscent());
      this._setProperty('_textDescent', this._textFont._textDescent());
      return this;
    }

    // Adapted from http://stackoverflow.com/a/25355178
    const text = document.createElement('span');
    text.style.fontFamily = this._textFont;
    text.style.fontSize = `${this._textSize}px`;
    text.innerHTML = 'ABCjgq|';

    const block = document.createElement('div');
    block.style.display = 'inline-block';
    block.style.width = '1px';
    block.style.height = '0px';

    const container = document.createElement('div');
    container.appendChild(text);
    container.appendChild(block);

    container.style.height = '0px';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    block.style.verticalAlign = 'baseline';
    let blockOffset = calculateOffset(block);
    let textOffset = calculateOffset(text);
    const ascent = blockOffset[1] - textOffset[1];

    block.style.verticalAlign = 'bottom';
    blockOffset = calculateOffset(block);
    textOffset = calculateOffset(text);
    const height = blockOffset[1] - textOffset[1];
    const descent = height - ascent;

    document.body.removeChild(container);

    this._setProperty('_textAscent', ascent);
    this._setProperty('_textDescent', descent);

    return this;
  }
};

/**
 * Helper fxn to measure ascent and descent.
 * Adapted from http://stackoverflow.com/a/25355178
 */
function calculateOffset(object) {
  let currentLeft = 0,
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
p5.Renderer.prototype.textSize = function(s) {
  if (typeof s === 'number') {
    this._setProperty('_textSize', s);
    if (!this._leadingSet) {
    // only use a default value if not previously set (#5181)
      this._setProperty('_textLeading', s * constants._DEFAULT_LEADMULT);
    }
    return this._applyTextProperties();
  }

  return this._textSize;
};

export default p5.Renderer;
