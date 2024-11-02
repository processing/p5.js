import * as constants from '../core/constants';

/*
 * Next: 
 *   add tests for all font-size strings
 *
 * Questions: 
 *   textProperty(s)
 *   static properties for renderer
 *   changing this.states properties
 *   push/pop for text rendering
 */

/**
 * @module Type
 * @submodule text2d
 * @for p5
 * @requires core
 */
function text2d(p5, fn, lifecycles) {

  lifecycles.presetup = function () {

    p5.Renderer2D.ContextProps = ['direction', 'fillStyle', 'filter', 'font', 'fontKerning', 'fontStretch', 'fontVariantCaps', 'globalAlpha', 'globalCompositeOperation', 'imageSmoothingEnabled', 'imageSmoothingQuality', 'letterSpacing', 'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline', 'textRendering', 'wordSpacing'];
    p5.Renderer2D.CachedCanvas = undefined;
    p5.Renderer2D.CachedDiv = undefined;
    p5.Renderer2D.LeadingScale = 1.275; 
    p5.Renderer2D.LinebreakRE = /\r?\n/g;
    p5.Renderer2D.TabsRe = /\t/g;

    p5.Renderer2D.FontProps = {
      textSize: { default: 12 }, // font-size: { default:  <absolute-size> | <relative-size> | <length> | <percentage>
      textFont: { default: 'sans-serif' }, // font-family: { default:  <family-name> | <generic-family>
      textStretch: { default: constants.NORMAL, property: 'fontStretch' }, // font-stretch: { default:  normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded
      textWeight: { default: constants.NORMAL, property: 'fontWeight' }, // font-weight: { default:  normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
      textHeight: { default: constants.NORMAL, property: 'lineHeight' }, // line-height: { default:  normal | number | length | percentage
      textStyle: { default: constants.NORMAL, property: 'fontStyle' },  // font-style: { default:  normal | italic | oblique
      textVariant: { default: constants.NORMAL, property: 'fontVariant' }, // font-variant: { default:  normal | small-caps
    };

    const textFunctions = [
      'text',
      'textAlign',
      'textAscent',
      'textDescent',
      'textLeading',
      // no-op, for processing
      'textMode',
      'textFont',
      'textSize',
      'textStyle',
      'textWidth',
      'textWrap',
      // new text functions
      'textBounds',
      'fontBounds',
      'fontWidth',
      'textToPoints',
      'textProperty',
      'textProperties',
    ];

    // attach each to p5 prototype, delegating to the renderer
    textFunctions.forEach(func => {
      fn[func] = function (...args) {
        if (func in p5.prototype) {
          p5._validateParameters(func, args);
        }
        if (!(func in p5.Renderer2D.prototype)) {
          throw Error(`Renderer2D.prototype.${func} is not defined.`);
        }
        return this._renderer[func](...args);
      };
    });
  }

  lifecycles.remove = function () { // cleanup
    this.drawingContext.canvas.removeChild(p5.Renderer2D.CachedDiv);
    p5.Renderer2D.CachedDiv = undefined;
    p5.Renderer2D.FontProps = undefined;
    p5.Renderer2D.CachedCanvas = undefined;
  };

  //////////////////////// start API ////////////////////////

  p5.Renderer2D.prototype.text = function (str, x, y, width, height) {

    let setBaseline = this.drawingContext.textBaseline; // store current baseline
    let leading = this.states.textLeading;

    // parse the lines according to the width & linebreaks
    let lines = this._processLines(str, width);

    // get the adjusted positions [x,y] for each line
    let positions = this._positionLines(x, y, width, height, leading, lines.length);

    // render each line at the adjusted position
    lines.forEach((line, i) => this._renderText(line, positions[i].x, positions[i].y));

    this.drawingContext.textBaseline = setBaseline; // restore baseline
  };

  p5.Renderer2D.prototype.textBounds = function (str, x, y, width, height) {
    // delegate to _computeBounds with the appropriate measure function
    return this._computeBounds(this._textBoundsSingle.bind(this), str, x, y, width, height);
  };

  p5.Renderer2D.prototype.fontBounds = function (str, x, y, width, height) {
    // delegate to _computeBounds with the appropriate measure function
    return this._computeBounds(this._fontBoundsSingle.bind(this), str, x, y, width, height);
  };

  p5.Renderer2D.prototype.textAlign = function (h, v) {
    // setter
    if (typeof h !== 'undefined') {
      this.drawingContext.textAlign = h;
      if (typeof v !== 'undefined') {
        if (v === constants.CENTER) {
          v = constants._CTX_MIDDLE;
        }
        this.drawingContext.textBaseline = v;
      }
      return this._applyTextProperties();
    }
    // getter
    return {
      horizontal: this.drawingContext.textAlign,
      vertical: this.drawingContext.textBaseline
    };
  };

  /**
   * 
   * @param {*} txt - optional text to measure, if provided will be used to compute the ascent, otherwise the font's ascent will be used
   * @returns - the ascent of the text
   */
  p5.Renderer2D.prototype.textAscent = function (txt = '') {
    let prop = txt.length ? 'actualBoundingBoxAscent' : 'fontBoundingBoxAscent';
    return this.drawingContext.measureText(txt)[prop];
  };

  /**
   * 
   * @param {*} txt - optional text to measure, if provided will be used to compute the descent, otherwise the font's descent will be used
   * @returns - the descent of the text
   */
  p5.Renderer2D.prototype.textDescent = function (txt = '') {
    let prop = txt.length ? 'actualBoundingBoxDescent' : 'fontBoundingBoxDescent';
    return this.drawingContext.measureText(txt)[prop];
  };

  p5.Renderer2D.prototype.textWidth = function (theText) {
    // return the max width of the lines (using tight bounds)
    let lines = this._processLines(theText);
    let widths = lines.map(l => this._textWidthSingle(l));
    return Math.max(...widths);
  };

  p5.Renderer2D.prototype.fontWidth = function (theText) {
    // return the max width of the lines (using loose bounds)
    let lines = this._processLines(theText);
    let widths = lines.map(l => this._fontWidthSingle(l));
    return Math.max(...widths);
  };

  /*
    Optional parameters to be specified in the `opts` object:
      textSize: 12, font-size: <absolute-size> | <relative-size> | <length> | <percentage>
      textFont: 'sans-serif', font-family: <family-name> | <generic-family>
      textStretch: constants.NORMAL, font-stretch: normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded
      textWeight: constants.NORMAL, font-weight: normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
      textHeight: constants.NORMAL, line-height: normal | number | length | percentage
      textStyle: constants.NORMAL, font-style: normal | italic | oblique
      textVariant: constants.NORMAL, font-variant: normal | small-caps  
  */
  p5.Renderer2D.prototype.textFont = function (theFont, theSize, options) {

    this._initFontProps();

    if (arguments.length === 0) {
      this._applyTextProperties();
      return this.drawingContext.font;
    }

    let family = theFont;

    // do we have a custon loaded font ?
    if (theFont instanceof p5.Font) {
      family = theFont.font.family;
    }

    if (typeof family !== 'string') {
      throw Error('null font passed to textFont');
    }

    // update font properties in this.states
    if (typeof family === 'string') {
      this.states.textFont = family;
    }

    // convert/update the size in this.states
    this.textSize(theSize);

    // apply any options to this.states
    if (typeof options === 'object') {
      this.textProperties(options);
    }

    return this._applyTextProperties();
  }

  p5.Renderer2D.prototype.textLeading = function (leading) {

    if (typeof leading === 'number') {
      this.states.leadingSet = true;
      this.states.textLeading = leading;
      return this._pInst;
    }
    return this.states.textLeading; // TODO: is there a prop we can use, eg. lineHeight ?
  }

  p5.Renderer2D.prototype.textSize = function (theSize) {

    //console.log('textSize(' + theSize + ')');

    // the getter
    if (typeof theSize === 'undefined') {
      return this.states.textSize;
    }

    // parse the size via computed style (number as string currently fails, eg '12')
    if (typeof theSize === 'string') {
      theSize = this._fontSizePx(theSize);
    }

    // validate the argument
    if (typeof theSize !== 'number') {
      throw Error('textSize: invalid size argument');
    }

    // set it in this.states if its been changed
    if (this.states.textSize !== theSize) {

      this.states.textSize = theSize;

      // handle leading here, if not set otherwise 
      if (!this.states.leadingSet) {
        this.states.textLeading = this.states.textSize * p5.Renderer2D.LeadingScale;
      }

      return this._applyTextProperties();
    }

    return this.pInst;
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

  p5.Renderer2D.prototype.textToPoints = function (s, x, y, fsize, options) { // hack via rendering and checking pixels

    // use the cached canvas for rendering
    let cvs = p5.Renderer2D.CachedCanvas ?? document.createElement("canvas");
    const ctx = cvs.getContext("2d");

    // set its dimensions to match the p5 canvas
    cvs.width = this._pInst._renderer.canvas.width;
    cvs.height = this._pInst._renderer.canvas.height;

    // set context properties to match the p5 context (a better way?)
    p5.Renderer2D.ContextProps.forEach(p => ctx[p] = this.drawingContext[p]);

    // render the text to the hidden canvas
    ctx.fillText(s, x, y);

    // get the pixel data from the hidden canvas
    const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
    const points = [];
    for (let y = 0; y < cvs.height; y += 4) {
      for (let x = 0; x < cvs.width; x += 4) {
        const idx = (y * cvs.width + x) * 4;
        if (imageData[idx + 3] > 128) { // threshold alpha (better with averaging?)
          points.push({ x, y });
        }
      }
    }
    return points;
  }

  p5.Renderer2D.prototype.textMode = function () { /* no-op for processing api */ };

  //////////////////////////// end API ///////////////////////////////
  p5.Renderer2D.prototype._computeBounds = function (measureFunc, str, x, y, width, height) {
    let setBaseline = this.drawingContext.textBaseline;
    let leading = this.states.textLeading;

    // parse the lines according to the width & linebreaks
    let lines = this._processLines(str, width);

    // get the adjusted positions [x,y] for each line
    let boxes = lines.map((line, i) => measureFunc(line, x, y + i * leading));

    // get the bounds for the text block
    let bounds = boxes[0];

    if (lines.length > 1) {

      // get the bounds for the multi-line text block
      bounds = this._aggregateBounds(boxes);

      // align the multi-line bounds
      this._alignBounds(bounds, width || 0, height || 0, leading, lines.length);
    }

    this.drawingContext.textBaseline = setBaseline; // restore baseline
    return bounds;
  };

  p5.Renderer2D.prototype._fontSizePx = function (size) {
    let el = p5.Renderer2D.CachedDiv;
    if (typeof el === 'undefined') {
      el = document.createElement('div');
      el.ariaHidden = 'true';
      el.style.display = 'none';
      el.style.fontSize = size;
      this.drawingContext.canvas.appendChild(el);
    }
    let fontSize = getComputedStyle(el).fontSize;
    return parseFloat(fontSize);
  };

  p5.Renderer2D.prototype._aggregateBounds = function (bboxes) {
    return {
      x: Math.min(...bboxes.map(b => b.x)),
      y: Math.min(...bboxes.map(b => b.y)), // could use boxes[0].y
      w: Math.max(...bboxes.map(b => b.w)),
      h: bboxes[bboxes.length - 1].y - bboxes[0].y + bboxes[bboxes.length - 1].h
    };
  };

  p5.Renderer2D.prototype._positionLines = function (x, y, width, height, leading, numLines) {

    let adjustedX, positions = [];
    let adjustedW = typeof width === 'undefined' ? 0 : width;
    let adjustedH = typeof height === 'undefined' ? 0 : height;

    for (let i = 0; i < numLines; i++) {
      switch (this.drawingContext.textAlign) {
        case 'start'://constants.START:
          //console.warn('textBounds: START not yet supported for RTL rendering');
          this.drawingContext.textAlign = constants.LEFT; // TMP
        case constants.LEFT:
          adjustedX = x;
          break;
        case constants.CENTER:
          adjustedX = x + adjustedW / 2;
          break;
        case constants.RIGHT:
          adjustedX = x + adjustedW;
          break;
        case 'end': //constants.END:
          throw new Error('textBounds: END not yet supported for textAlign');
          break;
      }
      positions.push({ x: adjustedX, y: y + (i * leading) });
    }

    let yOff = this._yAlignOffset(adjustedH, leading, numLines);
    positions.forEach(p => p.y += yOff);

    return positions;
  };

  /* 
    Set all font properties to their defaults in `renderer.states` 
    TODO: move to Renderer2D.constructor ?
  */
  p5.Renderer2D.prototype._initFontProps = function () {
    Object.keys(p5.Renderer2D.FontProps).forEach(p => {
      if (!(p in this.states)) { // use the default if not already set
        this.states[p] = p5.Renderer2D.FontProps[p].default;
      }
    });
    return this._pInst;
  };

  p5.Renderer2D.prototype._processLines = function (str, width) {
    let lines = this._splitOnBreaks(str);
    let hasLineBreaks = lines.length > 1;
    let hasWidth = typeof width !== 'undefined';
    let exceedsWidth = hasWidth && lines.some(l => this._textWidthSingle(l) > width);
    if (!hasLineBreaks && !exceedsWidth) return lines; // a single-line
    if (typeof width !== 'undefined') { // only for text with bounds
      // match processing's handling of textBaseline
      if (this.drawingContext.textBaseline === constants.BASELINE) {
        this.drawingContext.textBaseline = constants.TOP;
      }
    }
    if (hasWidth) lines = this._lineate(lines, width);
    return lines;
  };

  p5.Renderer2D.prototype._alignBounds = function (bb, width, height, leading, numLines) {
    bb.x += this._xAlignOffset(width);
    bb.y += this._yAlignOffset(height, leading, numLines);
  }

  p5.Renderer2D.prototype._xAlignOffset = function (width) {
    switch (this.drawingContext.textAlign) {
      case constants.LEFT:
        return 0;
      case constants.CENTER:
        return width / 2;
      case constants.RIGHT:
        return width;
      case 'start': // constants.START:
        return 0;
      case 'end': // constants.END:
        throw new Error('textBounds: END not yet supported for textAlign');
      default:
        return 0;
    }
  }

  p5.Renderer2D.prototype._yAlignOffset = function (height, leading, numLines) {

    if (typeof height === 'undefined') {
      throw Error('_yAlignOffset: height is required');
    }

    let ydiff = height - (leading * (numLines - 1));

    switch (this.drawingContext.textBaseline) {
      case constants.TOP:
        return 0;
      case constants.BASELINE:
        return 0;
      case constants._CTX_MIDDLE:
        return ydiff / 2;
      case constants.BOTTOM:
        return ydiff;
      case 'ideographic':// constants.IDEOGRAPHIC:
        console.warn('textBounds: IDEOGRAPHIC not yet supported for textBaseline');
        return 0;
      case 'hanging'://  constants.HANGING:
        console.warn('textBounds: HANGING not yet supported for textBaseline');
      default:
        return 0;
    }
  }

  p5.Renderer2D.prototype._textWidthSingle = function (s) {
    let metrics = this.drawingContext.measureText(s);
    let abl = metrics.actualBoundingBoxLeft;
    let abr = metrics.actualBoundingBoxRight;
    return abr + abl;
  };

  p5.Renderer2D.prototype._fontWidthSingle = function (s) {
    return this.drawingContext.measureText(s).width;
  };

  p5.Renderer2D.prototype._textHeightSingle = function (s) {
    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.actualBoundingBoxAscent;
    let desc = metrics.actualBoundingBoxDescent;
    return asc + desc;
  };

  p5.Renderer2D.prototype._fontHeightSingle = function (s) {
    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.fontBoundingBoxAscent;
    let desc = metrics.fontBoundingBoxDescent;
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

  p5.Renderer2D.prototype._fontBoundsSingle = function (s, x = 0, y = 0) {

    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.fontBoundingBoxAscent;
    let desc = metrics.fontBoundingBoxDescent;
    x -= this._xAlignOffset(metrics.width);
    return { x, y: y - asc, w: metrics.width, h: asc + desc };;

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

  p5.Renderer2D.prototype._splitOnBreaks = function (s) {
    if (!s || s.length === 0) return [''];
    return s.replace(p5.Renderer2D.TabsRE, '  ').split(p5.Renderer2D.LinebreakRE);
  };

  p5.Renderer2D.prototype._applyTextProperties = function () {

    this._initFontProps();

    let { textFont, textSize, textHeight } = this.states;

    let family = textFont.indexOf(' ') > -1 ? `"${textFont}"` : textFont;
    let size = `${textSize}px` + (textHeight !== constants.NORMAL ? `/${textHeight} ` : ' ');
    let textStretch = this.states.textStretch !== constants.NORMAL ? `${this.states.textStretch} ` : '';
    let textStyle = this.states.textStyle !== constants.NORMAL ? `${this.states.textStyle} ` : '';
    let textWeight = this.states.textWeight !== constants.NORMAL ? `${this.states.textWeight} ` : '';
    let textVariant = this.states.textVariant !== constants.NORMAL ? `${this.states.textVariant} ` : '';
    let fontString = `${textStretch}${textStyle}${textWeight}${textVariant}${size}${family}`;

    this.drawingContext.font = fontString.trim();

    return this._pInst;
  };

  /**
   * Sets/gets a single text property for the renderer, eg. textFont, textSize, etc.
   * Sets either a mapped or unmapped property on this.states, or a property on this.drawingContext
   * Gets a property from this.states or this.drawingContext
   */
  p5.Renderer2D.prototype.textProperty = function (opt, val) {

    // get the option from this.states or this.drawingContext if it exists
    if (typeof val === 'undefined') {
      let props = this.textProperties();
      if (opt in props) return props[opt];
      throw Error('Unknown text option "' + opt + '"');
    }

    // set the option in this.states if it exists
    if (opt in this.states) {
      if (this.states[opt] === val) {
        return this._pInst;  // short-circuit if no change
      }
      this.states[opt] = val;
      //console.log('this.states.' + opt + '="' + options[opt] + '"');
    }
    // does it exist in CanvasRenderingContext2D ?
    else if (opt in this.drawingContext) {

      // is it a property mapped to one managed in this.states ?
      let managed = Object.entries(p5.Renderer2D.FontProps)
        .find(([_, v]) => v.property === opt);

      // then set the mapped property in this.states instead
      if (managed && managed.length && managed[0] in this.states) {
        let state = managed[0];
        if (this.states[state] === val) {
          return this._pInst;  // short-circuit if no change
        }
        this.states[state] = val;
        //console.log('set mapped property "' + opt + '"/"' + state + '" to "' + val + '"');
      }

      // otherwise, set the property directly and hope for the best
      else if (opt in this.drawingContext) {
        if (this.drawingContext[opt] === val) {
          return this._pInst;  // short-circuit if no change
        }
        this.drawingContext[opt] = val;
      }
    }
    else {
      console.log('textFont(): ignoring unknown option "' + opt + '"\n', this.states);
    }

    // only if we've modified something
    return this._applyTextProperties();
  };

  /**
   * Batch set/get text properties for the renderer
   */
  p5.Renderer2D.prototype.textProperties = function (properties) {

    if (typeof properties === 'object') {
      Object.keys(properties).forEach(opt => {
        this.textProperty(opt, properties[opt]);
      });
      return this._pInst;
    }

    this._applyTextProperties();

    return { // QUESTION:
      textWrap: this.states.textWrap,
      textSize: this.states.textSize,
      textFont: this.states.textFont,
      textStretch: this.states.textStretch,
      textWeight: this.states.textWeight,
      textHeight: this.states.textHeight,
      textStyle: this.states.textStyle,
      textVariant: this.states.textVariant,
      textLeading: this.states.textLeading,

      textAlign: this.drawingContext.textAlign,
      textBaseline: this.drawingContext.textBaseline,

      font: this.drawingContext.font,
      fontKerning: this.drawingContext.fontKerning,
      fontStretch: this.drawingContext.fontStretch,
      fontVariantCaps: this.drawingContext.fontVariantCaps,
      textRendering: this.drawingContext.textRendering,
      letterSpacing: this.drawingContext.letterSpacing,
      wordSpacing: this.drawingContext.wordSpacing,
    };
  };

  // text() calls this method to render text
  p5.Renderer2D.prototype._renderText = function (line, x, y, maxY, minY) { // TODO: remove maxY, minY
    let { drawingContext, states } = this;

    if (y < minY || y >= maxY) {
      return; // don't render lines beyond minY/maxY
    }

    //this._pInst.push(); // fix to #803 DH: removed (Check)

    // no stroke unless specified by user
    if (states.doStroke && states.strokeSet) {
      drawingContext.strokeText(line, x, y);
    }

    if (!this._clipping && states.doFill) {

      // if fill hasn't been set by user, use default text fill
      if (!states.fillSet) {
        this._setFill(constants._DEFAULT_TEXT_FILL);
      }

      //console.log('fillText: "' + line + '"', x, y, "'" + this.drawingContext.font + "'");
      drawingContext.fillText(line, x, y);
    }
    //this._pInst.pop(); //DH: removed

    return this._pInst;
  };
}

export default text2d;

if (typeof p5 !== 'undefined') {
  text2d(p5, p5.prototype);
}