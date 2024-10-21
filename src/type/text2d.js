import * as constants from '../core/constants';

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
    'textMode', // no-op
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

  p5.Renderer2D.prototype.text = function (str, x, y, width, height, opts) {

    let setBaseline = this.drawingContext.textBaseline;
    let leading = this.states.textLeading;

    // match processing's handling of textBaseline
    if (this.drawingContext.textBaseline === constants.BASELINE) {
      this.drawingContext.textBaseline = constants.TOP;
    }

    // parse the lines according to the width and linebreaks
    let lines = this._parseLines(str, width);

    // get the adjusted positions [x,y] for each line
    let positions = this._positionLines(x, y, width, height, leading, lines.length);

    //console.log('text:', lines, x, y, width, height, this.drawingContext.
    lines.forEach((line, i) => this._renderText(line, ...positions[i]));

    this.drawingContext.textBaseline = setBaseline; // restore baseline
  };

  p5.Renderer2D.prototype.textBounds = function (str, x, y, width, height) {
    let setBaseline = this.drawingContext.textBaseline;
    let leading = this.states.textLeading;

    // match processing's handling of textBaseline
    if (this.drawingContext.textBaseline === constants.BASELINE) {
      this.drawingContext.textBaseline = constants.TOP;
    }

    // parse the lines according to the width and linebreaks
    let lines = this._parseLines(str, width);

    // get the adjusted positions [x,y] for each line
    let boxes = lines.map((line, i) => this._textBoundsSingle(line, x, y + i * leading));

    // get the bounds for the text block
    let bounds = boxes[0];
    if (lines.length > 1) {
      bounds = {
        x: Math.min(...boxes.map(b => b.x)),
        y: Math.min(...boxes.map(b => b.y)), // could use boxes[0].y
        w: Math.max(...boxes.map(b => b.w)),
        h: boxes[boxes.length - 1].y - boxes[0].y + boxes[boxes.length - 1].h
      };
      // align the bounds if it is multi-line
      this._alignBounds(bounds, width, height, leading, lines.length);
    }

    this.drawingContext.textBaseline = setBaseline; // restore baseline
    return bounds;
  };



  p5.Renderer2D.prototype.textAlign = function (h, v) {
    if (typeof h !== 'undefined') {
      
      // TODO: remove states.textAlign and states.textBaseline

      let obj = this.states; // this.drawingContext;
      obj.textAlign = h; // DH: removed ref to states.textAlign
      if (typeof v !== 'undefined') {
        if (v === constants.CENTER) {
          v = constants._CTX_MIDDLE;
        }
        obj.textBaseline = v; // DH: removed ref to states.textBaseline
      }
      return this._applyTextProperties();
    } else {
      return {
        horizontal: obj.textAlign,// DH: removed ref to states.textAlign
        vertical: obj.textBaseline // DH: removed ref to states.textBaseline
      };
    }
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

  p5.Renderer2D.prototype.textWidth = function (theText) {
    // return the max width of the lines
    let lines = this._parseLines(theText);
    let widths = lines.map(l => this._textWidthSingle(l));
    return Math.max(...widths);
  };

  // TODO: rethink parameter list, examine FontFace.properties
  p5.Renderer2D.prototype.textFont = function (theFont, theSize, opts) {
    // need to add fontStretch/lineHeight

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
    return this.states.textLeading; // TODO: is there a prop we can use ? lineHeight
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
    if (typeof s !== 'undefined') {
      if (s === constants.NORMAL ||
        s === constants.ITALIC ||
        s === constants.BOLD ||
        s === constants.BOLDITALIC) {
        this.states.textStyle = s;
      }
      return this._applyTextProperties();
    }

    return this.states.textStyle;
  }

  p5.Renderer2D.prototype.textWrap = function (wrapStyle) {
    if (wrapStyle === constants.WORD || wrapStyle === constants.CHAR) {
      this.states.textWrap = wrapStyle;  // TODO: is there a prop we can use ?
      return this._pInst;
    }
    return this.states.textWrap;
  };

  p5.Renderer2D.prototype.textMode = function () {
    /* no-op for processing api compat */
  };

  //////////////////////////// end API ///////////////////////////////
  p5.Renderer2D.prototype._positionLines = function (x, y, width, height, leading, numLines) {

    let positions = []
    let adjustedX, adjustedY = this._alignY(y, height, leading, numLines);
    for (let i = 0; i < numLines; i++) {
      switch (this.drawingContext.textAlign) {
        case constants.LEFT:
          adjustedX = x;
          break;
        case constants.CENTER:
          adjustedX = x + width / 2;
          break;
        case constants.RIGHT:
          adjustedX = x + width;
          break;
        case constants.START:
          throw new Error('textBounds: START not yet supported for textAlign');
          break;
        case constants.END:
          throw new Error('textBounds: END not yet supported for textAlign');
          break;
      }
      positions.push([adjustedX, adjustedY + (i * leading)]);
    }

    return positions;
  };

  p5.Renderer2D.prototype._parseLines = function (str, width) {
    let lines = this._splitLines(str);
    let hasLineBreaks = lines.length > 1;
    let hasWidth = typeof width !== 'undefined';
    let exceedsWidth = hasWidth && lines.some(l => this._textWidthSingle(l) > width);
    if (!hasLineBreaks && !exceedsWidth) return lines; // a single-line
    if (hasWidth) lines = this._lineate(lines, width);
    return lines;
  };

  p5.Renderer2D.prototype._alignBounds = function (bb, width, height, leading, numLines) {
    bb.x = this._alignX(bb.x, width);
    bb.y = this._alignY(bb.y, height, leading, numLines);
  }

  p5.Renderer2D.prototype._alignX = function (x, width) {
    switch (this.drawingContext.textAlign) {
      case constants.CENTER:
        x += width / 2;
        break;
      case constants.RIGHT:
        x += width;
        break;
      case constants.START:
        throw new Error('textBounds: START not yet supported for textAlign');
        break;
      case constants.END:
        throw new Error('textBounds: END not yet supported for textAlign');
        break;
    }
    return x;
  }

  p5.Renderer2D.prototype._alignY = function (y, height, leading, numLines) {
    let ydiff = height - (leading * (numLines - 1));
    switch (this.drawingContext.textBaseline) {
      case constants._CTX_MIDDLE:
        y += ydiff / 2;
        break;
      case constants.BOTTOM:
        y += ydiff;
        break;
      case constants.IDEOGRAPHIC:
        throw Error('textBounds: IDEOGRAPHIC not yet supported for textBaseline');
        break;
      case constants.HANGING:
        throw Error('textBounds: HANGING not yet supported for textBaseline');
        break;
    }
    return y;
  }

  p5.Renderer2D.prototype._textWidthSingle = function (s, x = 0, y = 0) {
    let metrics = this.drawingContext.measureText(s);
    let abl = metrics.actualBoundingBoxLeft;
    let abr = metrics.actualBoundingBoxRight;
    return abr + abl;
  };

  p5.Renderer2D.prototype._textHeightSingle = function (s, x = 0, y = 0) {
    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.actualBoundingBoxAscent;
    let desc = metrics.actualBoundingBoxDescent;
    return asc + desc;
  };

  p5.Renderer2D.prototype._textBoundsSingle = function (s, x = 0, y = 0) {

    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.actualBoundingBoxAscent;
    let desc = metrics.actualBoundingBoxDescent;
    let abl = metrics.actualBoundingBoxLeft;
    let abr = metrics.actualBoundingBoxRight;
    return { x: x - abl, y: y - asc, w: abr + abl, h: asc + desc };
  };


  p5.Renderer2D.prototype._lineate = function (lines, maxWidth = Infinity, opts = {}) {

    let splitter = opts.splitChar ?? (this.states.textWrap === constants.WORD ? ' ' : '');
    let line, testLine, testWidth, words, newLines = [];

    for (let lidx = 0; lidx < lines.length; lidx++) {
      line = '';
      words = lines[lidx].split(splitter);
      for (let widx = 0; widx < words.length; widx++) {
        testLine = `${line + words[widx]}` + splitter;
        testWidth = this._textWidthSingle(testLine);
        if (line.length > 0 && testWidth > maxWidth) {
          newLines.push(line.trim());
          line = `${words[widx]}` + splitter;
        } else {
          line = testLine;
        }
      }
      newLines.push(line.trim());
    }

    return newLines;
  };

  p5.Renderer2D.prototype._splitLines = function (s) {
    if (!s || s.length === 0) return [''];
    return s.replace(p5.Renderer2D.TabsRE, '  ').split(p5.Renderer2D.LinebreakRE);
  }

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

    // TMP: font props to be added to P5.Renderer.states,
    // but nothing that can be set on context2d (eg. textBaseline)

    // {properties: default} for font-string
    let fontProps = {
      textSize: 12,
      textFont: 'sans-serif',
      textStyle: constants.NORMAL,
      textVariant: constants.NORMAL,
      textWeight: constants.NORMAL,
    };

    // {properties: {context-property-name,default} for drawingContext
    let contextProps = { // TODO: remove all these from this.states
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

    // update any context properties that differ from `states`  (TODO: REMOVE)
    Object.keys(contextProps).forEach(prop => {
      let ctxProp = contextProps[prop].property || prop;
      this.drawingContext[ctxProp] = this.states[prop];
      // if (prop.startsWith('text'))  console.log(prop, '=', this.states[prop]);
    });

    const fontString = this._buildFontString(); // create font-string from states
    this.drawingContext.font = fontString;

    //console.log(this.drawingContext.font + '\n' + '-'.repeat(80));

    if (fontString.replace(/normal /g, '') !== this.drawingContext.font) { // TMP: rm, warn if font not set properly
      console.warn('Error setting text properties: \ncss="' + fontString + '"\nctx="' + this.drawingContext.font + '"');
    }

    return this._pInst;
  };

  // text() calls this method to render text
  p5.Renderer2D.prototype._renderText = function (line, x, y, maxY, minY) { // TODO: remove maxY, minY
    let { drawingContext, states } = this;

    if (y < minY || y >= maxY) {
      return; // don't render lines beyond minY/maxY
    }

    this._pInst.push(); // fix to #803 TODO: remove ?

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
    this._pInst.pop(); //TODO: remove ?

    return this._pInst;
  };
}

export default text2d;