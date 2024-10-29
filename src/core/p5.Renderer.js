/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import * as constants from '../core/constants';
import { Image } from '../image/p5.Image';

class Renderer {
  constructor(pInst, w, h, isMainCanvas) {
    this._pInst = this._pixelsState = pInst;
    this._isMainCanvas = isMainCanvas;
    this.pixels = [];
    this._pixelDensity = Math.ceil(window.devicePixelRatio) || 1;

    this.width = w;
    this.height = h;

    this._events = {};

    if (isMainCanvas) {
      this._isMainCanvas = true;
    }

    // Renderer state machine
    this.states = {
      doStroke: true,
      strokeSet: false,
      doFill: true,
      fillSet: false,
      tint: null,
      imageMode: constants.CORNER,
      rectMode: constants.CORNER,
      ellipseMode: constants.CENTER,
      textFont: 'sans-serif',
      textLeading: 15,
      leadingSet: false,
      textSize: 12,
      textAlign: constants.LEFT,
      textBaseline: constants.BASELINE,
      textStyle: constants.NORMAL,
      textWrap: constants.WORD
    };
    this._pushPopStack = [];
    // NOTE: can use the length of the push pop stack instead
    this._pushPopDepth = 0;

    this._clipping = false;
    this._clipInvert = false;
    this._curveTightness = 0;
  }

  remove() {

  }

  pixelDensity(val){
    let returnValue;
    if (typeof val === 'number') {
      if (val !== this._pixelDensity) {
        this._pixelDensity = val;
      }
      returnValue = this;
      this.resize(this.width, this.height);
    } else {
      returnValue = this._pixelDensity;
    }
    return returnValue;
  }

  // Makes a shallow copy of the current states
  // and push it into the push pop stack
  push() {
    this._pushPopDepth++;
    const currentStates = Object.assign({}, this.states);
    // Clone properties that support it
    for (const key in currentStates) {
      if (currentStates[key] instanceof Array) {
        currentStates[key] = currentStates[key].slice();
      } else if (currentStates[key] && currentStates[key].clone instanceof Function) {
        currentStates[key] = currentStates[key].clone();
      }
    }
    this._pushPopStack.push(currentStates);
    return currentStates;
  }

  // Pop the previous states out of the push pop stack and
  // assign it back to the current state
  pop() {
    this._pushPopDepth--;
    Object.assign(this.states, this._pushPopStack.pop());
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
  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  get(x, y, w, h) {
    const pixelsState = this._pixelsState;
    const pd = this._pixelDensity;
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

    const region = new Image(w*pd, h*pd);
    region.pixelDensity(pd);
    region.canvas
      .getContext('2d')
      .drawImage(canvas, x, y, w * pd, h * pd, 0, 0, w*pd, h*pd);

    return region;
  }

  scale(x, y){

  }

  fill() {
    this.states.fillSet = true;
    this.states.doFill = true;
  }

  stroke() {
    this.states.strokeSet = true;
    this.states.doStroke = true;
  }

  textSize(s) {
    if (typeof s === 'number') {
      this.states.textSize = s;
      if (!this.states.leadingSet) {
      // only use a default value if not previously set (#5181)
        this.states.textLeading = s * constants._DEFAULT_LEADMULT;
      }
      return this._applyTextProperties();
    }

    return this.states.textSize;
  }

  textLeading (l) {
    if (typeof l === 'number') {
      this.states.leadingSet = true;
      this.states.textLeading = l;
      return this._pInst;
    }

    return this.states.textLeading;
  }

  textStyle (s) {
    if (s) {
      if (
        s === constants.NORMAL ||
        s === constants.ITALIC ||
        s === constants.BOLD ||
        s === constants.BOLDITALIC
      ) {
        this.states.textStyle = s;
      }

      return this._applyTextProperties();
    }

    return this.states.textStyle;
  }

  textAscent () {
    if (this.states.textAscent === null) {
      this._updateTextMetrics();
    }
    return this.states.textAscent;
  }

  textDescent () {
    if (this.states.textDescent === null) {
      this._updateTextMetrics();
    }
    return this.states.textDescent;
  }

  textAlign (h, v) {
    if (typeof h !== 'undefined') {
      this.states.textAlign = h;

      if (typeof v !== 'undefined') {
        this.states.textBaseline = v;
      }

      return this._applyTextProperties();
    } else {
      return {
        horizontal: this.states.textAlign,
        vertical: this.states.textBaseline
      };
    }
  }

  textWrap (wrapStyle) {
    this.states.textWrap = wrapStyle;
    return this.states.textWrap;
  }

  text(str, x, y, maxWidth, maxHeight) {
    const p = this._pInst;
    const textWrapStyle = this.states.textWrap;

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

    if (!(this.states.doFill || this.states.doStroke)) {
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
      if (this.states.rectMode === constants.CENTER) {
        x -= maxWidth / 2;
      }

      switch (this.states.textAlign) {
        case constants.CENTER:
          x += maxWidth / 2;
          break;
        case constants.RIGHT:
          x += maxWidth;
          break;
      }

      if (typeof maxHeight !== 'undefined') {
        if (this.states.rectMode === constants.CENTER) {
          y -= maxHeight / 2;
          finalMinHeight -= maxHeight / 2;
        }

        let originalY = y;
        let ascent = p.textAscent();

        switch (this.states.textBaseline) {
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
        if (this.states.textBaseline === constants.CENTER) {
          finalMaxHeight = originalY + maxHeight - ascent / 2;
        }
      } else {
      // no text-height specified, show warning for BOTTOM / CENTER
        if (this.states.textBaseline === constants.BOTTOM ||
        this.states.textBaseline === constants.CENTER) {
        // use rectHeight as an approximation for text height
          let rectHeight = p.textSize() * this.states.textLeading;
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
        if (this.states.textBaseline === constants.CENTER) {
          offset = (nlines.length - 1) * p.textLeading() / 2;
        } else if (this.states.textBaseline === constants.BOTTOM) {
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
        if (this.states.textBaseline === constants.CENTER) {
          offset = (nlines.length - 1) * p.textLeading() / 2;
        } else if (this.states.textBaseline === constants.BOTTOM) {
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
      if (this.states.textBaseline === constants.CENTER) {
        offset = (lines.length - 1) * p.textLeading() / 2;
      } else if (this.states.textBaseline === constants.BOTTOM) {
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
  _isOpenType(f = this.states.textFont) {
    return typeof f === 'object' && f.font && f.font.supported;
  }

  _updateTextMetrics() {
    if (this._isOpenType()) {
      this.states.textAscent = this.states.textFont._textAscent();
      this.states.textDescent = this.states.textFont._textDescent();
      return this;
    }

    // Adapted from http://stackoverflow.com/a/25355178
    const text = document.createElement('span');
    text.style.fontFamily = this.states.textFont;
    text.style.fontSize = `${this.states.textSize}px`;
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

    this.states.textAscent = ascent;
    this.states.textDescent = descent;

    return this;
  }
};

function renderer(p5, fn){
  /**
   * Main graphics and rendering context, as well as the base API
   * implementation for p5.js "core". To be used as the superclass for
   * Renderer2D and Renderer3D classes, respectively.
   *
   * @class p5.Renderer
   * @param {HTMLElement} elt DOM node that is wrapped
   * @param {p5} [pInst] pointer to p5 instance
   * @param {Boolean} [isMainCanvas] whether we're using it as main canvas
   */
  p5.Renderer = Renderer;
}

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

export default renderer;
export { Renderer };
