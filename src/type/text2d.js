import * as constants from '../core/constants';

/**
 * @module Type
 * @submodule Rendering
 * @for p5
 * @requires core
 */

function text2d(p5, fn) {

  p5.Renderer2D.textFunctions = [
    'text',
    'textAlign',
    'textAscent',
    'textBounds',
    'textDescent',
    'textLeading',
    'textFont',
    'textSize',
    'textStyle',
    'textWidth',
    'textWrap',
  ];

  p5.Renderer2D.TabsRe = /\t/g;
  p5.Renderer2D.LinebreakRE = /\r?\n/g;

  //////////////////////// start API ////////////////////////

  p5.Renderer2D.prototype.textAlign = function (h, v) {
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
  };

  p5.Renderer2D.prototype.textAscent = function () {
    const ctx = this.drawingContext;
    // do we need to update this.states.textAscent here? prob no
    return ctx.measureText('').fontBoundingBoxAscent;
  };

  p5.Renderer2D.prototype.textBounds = function (s, x = 0, y = 0) {
    let metrics = this.drawingContext.measureText(s);
    let w = metrics.actualBoundingBoxLeft
      + metrics.actualBoundingBoxRight;
    let h = metrics.actualBoundingBoxAscent
      + Math.abs(metrics.actualBoundingBoxDescent);
    return { x, y: y + metrics.actualBoundingBoxDescent, w, h };
  };

  p5.Renderer2D.prototype.textDescent = function () {
    const ctx = this.drawingContext;
    return Math.abs(ctx.measureText('').fontBoundingBoxDescent);
  };

  p5.Renderer2D.prototype.textFont = function (theFont, theSize, theWeight, theStyle, theVariant) {

    if (arguments.length) {

      if (theFont instanceof FontFace) {
        theFont = theFont.family;
      }
      if (typeof theFont !== 'string') {
        throw new Error('null font passed to textFont');
      }
      if (typeof theSize === 'string') { // defaults to px
        // TODO: handle other units and possibly convert to px
        theSize = Number.parseFloat(theSize);
      }

      // TODO: handle strings with multiple properties when args.length=1
      // could attempt to parse but prob better to use a hidden element

      this.states.textFont = theFont;

      if (typeof theSize !== 'undefined') {
        this.states.textSize = theSize;
      }
      if (typeof theWeight !== 'undefined') {
        this.states.textWeight = theWeight;
      }
      if (typeof theStyle !== 'undefined') {
        this.states.textStyle = theStyle;
      }
      if (typeof theVariant !== 'undefined') {
        this.states.textVariant = theVariant;
      }

      return this._applyTextProperties();
    }

    return this._buildFontString();
  }

  p5.Renderer2D.prototype.textLeading = function (leading) {
    if (typeof leading === 'number') {
      this.states.leadingSet = true;
      this.states.textLeading = leading;
      return this._pInst;
    }
    return this.states.textLeading;
  }

  p5.Renderer2D.prototype.textSize = function (theSize) {

    if (typeof theSize !== 'undefined') {
      this.states.textSize = Number.parseFloat(theSize);

      // handle leading here, if not set otherwise 
      if (!this.states.leadingSet) {
        this.states.textLeading = this.states.textSize * 1.275;
      }

      return this._applyTextProperties();
    }
    return this.states.textSize;
  };

  p5.Renderer2D.prototype.textStyle = function (s) {
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

  p5.Renderer2D.prototype.textWidth = function (theText) {
    if (theText.length === 0) return 0;

    // Only use the line with the longest width, and replace tabs with double-space
    const lines = theText.replace(p5.Renderer2D.TabsRE, '  ').split(p5.Renderer2D.LinebreakRE);

    // Get the textWidth for every line
    const newArr = lines.map(this._lineWidth.bind(this));

    // Return the largest textWidth
    return Math.max(...newArr);
  };


  p5.Renderer2D.prototype.textWrap = function (wrapStyle) {
    this.states.textWrap = wrapStyle;
    return this.states.textWrap;
  };

  // this is a mess
  p5.Renderer2D.prototype.text = function (str, x, y, maxWidth, maxHeight) {
    let baselineHacked;

    // baselineHacked: (HACK)
    // A temporary fix to conform to Processing's implementation
    // of BASELINE vertical alignment in a bounding box

    if (typeof maxWidth !== 'undefined') {
      if (this.drawingContext.textBaseline === constants.BASELINE) {
        baselineHacked = true;
        this.drawingContext.textBaseline = constants.TOP;
      }
    }

    //const p = Renderer.prototype.text.apply(this, arguments);
    let lines, line, testLine, testWidth;
    let words, chars, shiftedY;
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
        let ascent = this._pInst.textAscent();

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
      if (this.states.textWrap === constants.WORD) {
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
          offset = (nlines.length - 1) * this.textLeading() / 2;
        } else if (this.states.textBaseline === constants.BOTTOM) {
          offset = (nlines.length - 1) * this.textLeading();
        }

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          line = '';
          words = lines[lineIndex].split(' ');
          for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            testLine = `${line + words[wordIndex]}` + ' ';
            testWidth = this.textWidth(testLine);
            if (testWidth > maxWidth && line.length > 0) {
              this._renderText(
                //p,
                line.trim(),
                x,
                y - offset,
                finalMaxHeight,
                finalMinHeight
              );
              line = `${words[wordIndex]}` + ' ';
              y += this.textLeading();
            } else {
              line = testLine;
            }
          }
          this._renderText(
            //p,
            line.trim(),
            x,
            y - offset,
            finalMaxHeight,
            finalMinHeight
          );
          y += this.textLeading();
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
          offset = (nlines.length - 1) * this.textLeading() / 2;
        } else if (this.states.textBaseline === constants.BOTTOM) {
          offset = (nlines.length - 1) * this.textLeading();
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
                //p,
                line.trim(),
                x,
                y - offset,
                finalMaxHeight,
                finalMinHeight
              );
              y += this.textLeading();
              line = `${chars[charIndex]}`;
            }
          }
        }
        this._renderText(
          //p,
          line.trim(),
          x,
          y - offset,
          finalMaxHeight,
          finalMinHeight
        );
        y += this.textLeading();
      }
    } else {
      // Offset to account for vertically centering multiple lines of text - no
      // need to adjust anything for vertical align top or baseline
      let offset = 0;
      if (this.states.textBaseline === constants.CENTER) {
        offset = (lines.length - 1) * this.textLeading() / 2;
      } else if (this.states.textBaseline === constants.BOTTOM) {
        offset = (lines.length - 1) * this.textLeading();
      }

      // Renders lines of text at any line breaks present in the original string
      for (let i = 0; i < lines.length; i++) {
        this._renderText(
          //          p,
          lines[i],
          x,
          y - offset,
          finalMaxHeight,
          finalMinHeight - offset
        );
        y += this.textLeading();
      }
    }

    // end HACK
    if (baselineHacked) {
      this.drawingContext.textBaseline = constants.BASELINE;
    }

    return this._pInst;
  };
  //////////////////////// end API ////////////////////////

  p5.Renderer2D.prototype._buildFontString = function () {
    /*
    The font property is a shorthand property for:
    font-style
    font-variant
    font-weight
    font-size/line-height
    font-family
    */
    let { textFont, textSize, textStyle, textVariant, textWeight } = this.states;
    /*let css = `${textSize}px ${textFont}`;
    if (textStyle && textStyle.length && textStyle !== 'normal') {
      css = textStyle + ' ' + css;
    }
    if (textWeight && textWeight.length && textWeight !== 'normal') {
      css = textWeight + ' ' + css;
    }
    if (textVariant && textVariant.length && textVariant !== 'normal') {
      css = textVariant + ' ' + css;
    }*/
    let css = `${textStyle} ${textWeight} ${textVariant} ${textSize}px ${textFont}`;
    return css;
  }

  p5.Renderer2D.prototype._applyTextProperties = function () {

    // TMP: font props to be added to P5.Renderer.states (also textStretch, lineHeight?)

    // {properties: default} for font-string
    let fontProps = {
      textSize: 12,
      textFont: 'sans-serif',
      textStyle: constants.NORMAL,
      textVariant: constants.NORMAL,
      textWeight: constants.NORMAL,
    };

    Object.keys(fontProps).forEach(p => {
      if (!(p in this.states)) {
        this.states[p] = fontProps[p];
      }
    });

    // {properties: {context-property-name,default} for drawingContext
    let contextProps = {
      
      wordSpacing: { default: 0 },
      textAlign: { default: constants.LEFT },
      textRendering: { default: constants.AUTO },
      /* textBaseline: { default: constants.BASELINE }, TODO: unusual case*/
      textKerning: { property: 'fontKerning', default: constants.AUTO },
      textStretch: { property: 'fontStretch', default: constants.NORMAL },
      textVariantCaps: { property: 'fontVariantCaps', default: constants.NORMAL },
      textWrap: { default: constants.WORD },
    };

    // check and set default font properties if missing
    Object.keys(contextProps).forEach(prop => {
      if (!(prop in this.states)) {
        this.states[prop] = contextProps[prop].default;
      }
      else {
        let ctxProp = contextProps[prop].property || prop;
        this.drawingContext[ctxProp] = this.states[prop];
      }
    });

    let { drawingContext, states } = this;

    const fontString = this._buildFontString();
    drawingContext.font = fontString;
    if (fontString.replace(/normal /g, '') !== drawingContext.font) { // TMP: warn if font not set properly
      console.warn('Error setting text properties: \ncss="' + fontString + '"\nctx="' + drawingContext.font + '"');
    }

    //drawingContext.textAlign = states.textAlign;
    if (states.textBaseline === constants.CENTER) {
      drawingContext.textBaseline = constants._CTX_MIDDLE;
    }
    else {
      drawingContext.textBaseline = states.textBaseline;
    }
    return this._pInst;
  };

  p5.Renderer2D.prototype._lineWidth = function (s) {
    let metrics = this.drawingContext.measureText(s);
    // this should be more accurate than width
    return Math.abs(metrics.actualBoundingBoxLeft)
      + Math.abs(metrics.actualBoundingBoxRight);
  };

  // text() calls this method to render text
  p5.Renderer2D.prototype._renderText = function (/*p,*/line, x, y, maxY, minY) {
    let { drawingContext, states } = this;

    if (y < minY || y >= maxY) {
      return; // don't render lines beyond minY/maxY
    }

    this._pInst.push(); // fix to #803

    // no stroke unless specified by user
    if (states.doStroke && states.strokeSet) {
      drawingContext.strokeText(line, x, y);
    }

    if (!this._clipping && states.doFill) {

      // if fill hasn't been set by user, use default text fill
      if (!states.fillSet) {
        this._setFill(constants._DEFAULT_TEXT_FILL);
      }

      drawingContext.fillText(line, x, y);
    }
    this._pInst.pop();

    return this._pInst;
  };
}

export default text2d;

// if (typeof p5 !== 'undefined') {
//   text2d(p5, p5.prototype);
// }
