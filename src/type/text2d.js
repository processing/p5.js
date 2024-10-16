import * as constants from '../core/constants';

// NEXT: fix multiLine line-breaking in html test

/**
 * @module Type
 * @submodule text2d
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

    'fontBounds', // ?
    'fontWidth' // ?
  ];

  p5.Renderer2D.TabsRe = /\t/g;
  p5.Renderer2D.LinebreakRE = /\r?\n/g;

  //////////////////////// start API ////////////////////////

  p5.Renderer2D.prototype.textAlign = function (h, v) {
    if (typeof h !== 'undefined') {
      this.states.textAlign = h;
      if (typeof v !== 'undefined') {
        if (v === constants.CENTER) {
          v = constants._CTX_MIDDLE;
        }
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

  p5.Renderer2D.prototype._fontWidth = function (s) {
    let metrics = s instanceof TextMetrics ? s : this._measureText(s);
    return metrics.width; // used in textBounds for p5.v1
  };

  p5.Renderer2D.prototype._textWidth = function (s) {
    let metrics = s instanceof TextMetrics ? s : this._measureText(s);
    // this should be pixel accurate (but different than p5.v1)
    return metrics.actualBoundingBoxRight - Math.abs(metrics.actualBoundingBoxLeft);
  };

  p5.Renderer2D.prototype._fontHeight = function (s) {
    let metrics = s instanceof TextMetrics ? s : this._measureText(s);
    // this should be pixel accurate (but different than p5.v1)
    return Math.abs(metrics.fontBoundingBoxDescent) + metrics.fontBoundingBoxAscent;
  };

  p5.Renderer2D.prototype._textHeight = function (s) {
    let metrics = s instanceof TextMetrics ? s : this._measureText(s);
    // this should be pixel accurate (but different than p5.v1)
    return Math.abs(metrics.actualBoundingBoxDescent) + metrics.actualBoundingBoxAscent;
  };

  p5.Renderer2D.prototype.textAscent = function (s = '') {
    const ctx = this.drawingContext;
    let prop = s.length ? 'actualBoundingBoxAscent' : 'fontBoundingBoxAscent';
    // do we need to update this.states.textAscent here? prob no
    return ctx.measureText(s)[prop];
  };

  p5.Renderer2D.prototype.textDescent = function (s = '') {
    const ctx = this.drawingContext;
    let prop = s.length ? 'actualBoundingBoxDescent' : 'fontBoundingBoxDescent';
    // do we need to update this.states.textDescent here? prob no
    return ctx.measureText(s)[prop];
  };

  p5.Renderer2D.prototype.fontWidth = function (theText) {
    if (theText.length === 0) return 0;

    // Only use the line with the longest width, and replace tabs with double-space
    const lines = theText.replace(p5.Renderer2D.TabsRE, '  ').split(p5.Renderer2D.LinebreakRE);

    // Get the textWidth for every line
    const newArr = lines.map(this._fontWidth.bind(this)); // tight-bounds

    // Return the largest textWidth
    return Math.max(...newArr);
  };

  p5.Renderer2D.prototype.textWidth = function (theText) {
    if (theText.length === 0) return 0;

    // Only use the line with the longest width, and replace tabs with double-space
    const lines = theText.replace(p5.Renderer2D.TabsRE, '  ').split(p5.Renderer2D.LinebreakRE);

    // Get the textWidth for every line
    const newArr = [];
    for (let i = 0; i < lines.length; i++) {
      let tw = this._textWidth(lines[i]);
      console.log(i, lines[i], tw);
      newArr.push(tw);
    }
    //const newArr = lines.map(this._textWidth.bind(this)); // tight-bounds

    // Return the largest textWidth
    return Math.max(...newArr);
  };

  p5.Renderer2D.prototype._measureText = function (s) {
    // this handles an apparent bug in some browsers where actualBoundBox
    // values are not returned correctly if align is not 'left'
    let align = this.drawingContext.textAlign;
    this.drawingContext.textAlign = 'left';
    let metrics = this.drawingContext.measureText(s);
    this.drawingContext.textAlign = align;
    return metrics;
  }
  

  p5.Renderer2D.prototype.textBounds = function (s, x = 0, y = 0) {
    let metrics = this._measureText(s);
    // TODO: should this pay attention to rectMode or textAlign?
    let px = x + Math.abs(metrics.actualBoundingBoxLeft);
    let py = y - Math.abs(metrics.actualBoundingBoxAscent);
    return {
      w: this._textWidth(s, metrics),
      h: this._textHeight(s, metrics)
    };
  };

  p5.Renderer2D.prototype.fontBounds = function (s, x = 0, y = 0) {
    let metrics = this._measureText(s);
    // TODO: should this pay attention to rectMode or textAlign?
    return {
      x,
      y: y - metrics.fontBoundingBoxAscent,
      w: this._fontWidth(s, metrics),
      h: this._fontHeight(s, metrics)
    };
  };

  // TODO: rethink parameter list, examine FontFace.properties
  p5.Renderer2D.prototype.textFont = function (theFont, theSize, opts) { // need to add fontStretch/lineHeight

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
        this.states.textSize = theSize;
      }

      // TODO: handle strings with multiple properties when args.length=1
      // might parse but prob better to use hidden DOM element

      this.states.textFont = theFont;

      if (typeof opts?.theWeight !== 'undefined') {
        this.states.textWeight = opts?.theWeight;
      }
      if (typeof opts?.theStyle !== 'undefined') {
        this.states.textStyle = opts?.theStyle;
      }
      if (typeof opts?.theVariant !== 'undefined') {
        this.states.textVariant = opts?.theVariant;
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

  p5.Renderer2D.prototype.textWrap = function (wrapStyle) {
    if (wrapStyle === constants.WORD || wrapStyle === constants.CHAR) {
      this.states.textWrap = wrapStyle;
      return this._pInst;
    }
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
        // no text-height specified, use rectHeight as an approximation
        if (this.states.textBaseline === constants.BOTTOM ||
          this.states.textBaseline === constants.CENTER) {
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
      } else { // textWrap is CHAR
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

    // {properties: {context-property-name,default} for drawingContext
    let contextProps = {
      wordSpacing: { default: 0 },
      textAlign: { default: constants.LEFT },
      textRendering: { default: constants.AUTO },
      textBaseline: { default: constants.BASELINE },
      textKerning: { property: 'fontKerning', default: constants.AUTO },
      textStretch: { property: 'fontStretch', default: constants.NORMAL },
      textVariantCaps: { property: 'fontVariantCaps', default: constants.NORMAL },
      textWrap: { default: constants.WORD },
    };

    // verify all font properties exist in `states`, else set with default
    Object.keys(fontProps).forEach(p => {
      if (!(p in this.states)) {
        this.states[p] = fontProps[p];
      }
    });

    // verify context properties exist in `states`, else set with default
    Object.keys(contextProps).forEach(prop => {
      if (!(prop in this.states)) {
        this.states[prop] = contextProps[prop].default;
      }
    });

    // update any context properties that differ from `states`
    Object.keys(contextProps).forEach(prop => {
      let ctxProp = contextProps[prop].property || prop;
      this.drawingContext[ctxProp] = this.states[prop];
      if (prop.startsWith('text')) {
        console.log(prop,'=', this.states[prop]);
      }
    });
    

    // handle one-off cases with p5.CENTER vs MIDDLE
    if (this.states.textBaseline === constants.CENTER) {
      console.log('OLD: setting textBaseline to MIDDLE');
      this.drawingContext.textBaseline = constants._CTX_MIDDLE;
    }

    const fontString = this._buildFontString(); // create font-string from states
    this.drawingContext.font = fontString;

    console.log(this.drawingContext.font+'\n'+'-'.repeat(80));

    if (fontString.replace(/normal /g, '') !== this.drawingContext.font) { // TMP: warn if font not set properly
      console.warn('Error setting text properties: \ncss="' + fontString + '"\nctx="' + this.drawingContext.font + '"');
    }

    return this._pInst;
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
