import * as constants from '../core/constants';

/*
 * TODO:
 *   - match current behavior for textBounds vs fontBounds
 *   - update test/unit/type
 * 
 * ON-HOLD:
 *   - textToPoints: alignments, line-breaking, better thresholding, scaling for small fonts
 * 
 * QUESTIONS: 
 *   - textProperty(ies) -> properties in states, mapped-states, context and canvas.style [PR]
 *   - do we want to support a text-font string (yes, how to handle?) [PR]
 * 
 *  ENHANCEMENTS:
 *   - support direct font string
 *   - add 'justify' alignment
 */

/**
 * @module Type
 * @submodule text2d
 * @for p5
 * @requires core
 */
function text2d(p5, fn, lifecycles) {

  const LeadingScale = 1.275;
  const LinebreakRe = /\r?\n/g;
  const CommaDelimRe = /,\s+/;
  const QuotedRe = /^".*"$/;
  const TabsRe = /\t/g;

  const textFunctions = [
    'text',
    'textAlign',
    'textAscent',
    'textDescent',
    'textLeading',
    'textMode',
    'textFont',
    'textSize',
    'textStyle',
    'textWidth',
    'textWrap',
    'textBounds',
    'fontBounds',
    'fontWidth',
    'textToPoints',
    'textProperty',
    'textProperties',
  ];

  // attach each text func to p5, delegating to the renderer
  textFunctions.forEach(func => {
    fn[func] = function (...args) {
      if (!(func in p5.Renderer2D.prototype)) {
        throw Error(`Renderer2D.prototype.${func} is not defined.`);
      }
      return this._renderer[func](...args);
    };
  });

  const StatePropMappings = {
    textStretch: 'fontStretch', // font-stretch: { default:  normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded }
    textWeight: 'fontWeight', // font-weight: { default:  normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 }
    textHeight: 'lineHeight', // line-height: { default:  normal | number | length | percentage }
    textStyle: 'fontStyle',  // font-style: { default:  normal | italic | oblique }
    textVariant: 'fontVariant'  // font-variant: { default:  normal | small-caps }
  };

  // note: font must be first here otherwise it may reset other properties
  const ContextProps = ['font', 'direction', 'fillStyle', 'filter', 'fontKerning', 'fontStretch', 'fontVariantCaps', 'globalAlpha', 'globalCompositeOperation', 'imageSmoothingEnabled', 'imageSmoothingQuality', 'letterSpacing', 'lineCap', 'lineDashOffset', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline', 'textRendering', 'wordSpacing'];

  let ContextQueue, CachedCanvas, CachedDiv; // lazy

  ////////////////////////////// start API ///////////////////////////////

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
    // the setter
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
    // the getter
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

  /**
   * Set the font and [size] and [options] for rendering text
   * @param {p5.Font | string} theFont - the font to use for rendering text
   * @param {number} theSize - the size of the text, can be a number or a css-style string
   * @param {object} options - additional options for rendering text, see FontProps
   */
  p5.Renderer2D.prototype.textFont = function (theFont, theSize, options) {

    //this._initFontProps();

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

    // handle two-arg case: textFont(font, options)
    if (arguments.length === 2 && typeof theSize === 'object') {
      options = theSize;
      theSize = undefined;
    }

    // convert/update the size in this.states
    if (typeof theSize !== 'undefined') {
      this._setTextSize(theSize);
    }

    // apply any options to this.states
    if (typeof options === 'object') {
      this.textProperties(options);
    }

    return this._applyTextProperties();
  }

  p5.Renderer2D.prototype.textLeading = function (leading) {
    // the setter
    if (typeof leading === 'number') {
      this.states.leadingSet = true;
      this.states.textLeading = leading;
      return this._pInst;
    }
    // the getter
    return this.states.textLeading; // TODO: use lineHeight here ? no
  }

  /**
   * @param {*} theSize - the size of the text, can be a number or a css-style string
   */
  p5.Renderer2D.prototype.textSize = function (theSize) {

    // the getter
    if (typeof theSize === 'undefined') {
      return this.states.textSize;
    }
    // the setter
    if (this._setTextSize(theSize)) {

      // apply properties if size was changed
      return this._applyTextProperties();
    }
    return this._pInst;
  }

  p5.Renderer2D.prototype.textStyle = function (s) {

    // the setter
    if (typeof s !== 'undefined') {
      if (s === constants.NORMAL ||
        s === constants.ITALIC ||
        s === constants.BOLD ||
        s === constants.BOLDITALIC) {
        this.states.textStyle = s;
      }
      return this._applyTextProperties();
    }
    // the getter
    return this.states.textStyle;
  }

  p5.Renderer2D.prototype.textWrap = function (wrapStyle) {

    if (wrapStyle === constants.WORD || wrapStyle === constants.CHAR) {
      this.states.textWrap = wrapStyle;
      return this._pInst;
    }
    return this.states.textWrap;
  };

  p5.Renderer2D.prototype.textToPoints = function (s, x, y, fsize, options) { // hack via rendering and checking pixels

    // use the cached canvas for rendering
    const cvs = (CachedCanvas ??= document.createElement("canvas"));
    const ctx = CachedCanvas.getContext("2d");

    // set dimensions to match the p5 canvas
    cvs.style.width = this._pInst.width + 'px';
    cvs.width = this._pInst.width; // needed?
    cvs.style.height = this._pInst.height + 'px';
    cvs.height = this._pInst.height;// needed?

    // set the scale to match the p5 canvas
    ctx.scale(this._pInst._pixelDensity, this._pInst._pixelDensity);

    // set context props to match the p5 context (a better way?)
    ContextProps.forEach(p => ctx[p] = this.drawingContext[p]);

    // render the text to the hidden canvas
    ctx.fillText(s, x, y);

    // get the pixel data from the hidden canvas
    const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
    const points = [];
    for (let y = 0; y < cvs.height; y += 4) {
      for (let x = 0; x < cvs.width; x += 4) {
        const idx = (y * cvs.width + x) * 4;
        if (imageData[idx + 3] > 128) { // threshold alpha (averaging?)
          points.push({ x, y });
        }
      }
    }

    return points;
  }

  /**
   * Sets/gets a single text property for the renderer (eg. textStyle, fontStretch, etc.)
   * The property to be set can be a mapped or unmapped property on `this.states` or a property on `this.drawingContext` or on `this.canvas.style`
   * The property to get can exist in `this.states` or `this.drawingContext` or `this.canvas.style`
   */
  p5.Renderer2D.prototype.textProperty = function (opt, val) {

    let debug = false;

    // getter: return option from this.states or this.drawingContext
    if (typeof val === 'undefined') {
      let props = this.textProperties();
      if (opt in props) return props[opt];
      throw Error('Unknown text option "' + opt + '"'); // FES? 
    }

    // set the option in this.states if it exists
    if (opt in this.states) {
      if (this.states[opt] === val) {
        return this._pInst;  // short-circuit if no change
      }
      this.states[opt] = val;
      if (debug) {
        console.log('this.states.' + opt + '="' + options[opt] + '"');
      }
    }
    // does it exist in CanvasRenderingContext2D ?
    else if (opt in this.drawingContext) {
      this._setContextProperty(opt, val, debug);
    }
    // does it exist in the canvas.style ?
    else if (opt in this.canvas.style) {
      this._setCanvasStyleProperty(opt, val, debug);
    }
    else {
      console.warn('Ignoring unknown text rendering option: "' + opt + '"\n'); // FES?
    }

    // only if we've modified something
    return this._applyTextProperties();
  };

  /**
   * Batch set/get text properties for the renderer.
   * The properties can be either mapped or unmapped properties 
   *    on `this.states` or properties on `this.drawingContext`
   */
  p5.Renderer2D.prototype.textProperties = function (properties) {

    // setter
    if (typeof properties === 'object') {
      Object.keys(properties).forEach(opt => {
        this.textProperty(opt, properties[opt]);
      });
      return this._pInst;
    }

    // getter
    this._applyTextProperties();
    return {

      // QUESTION: include font/text options on canvas.style ?

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

  p5.Renderer2D.prototype.textMode = function () { /* no-op for processing api */ };

  /////////////////////////////// end API ////////////////////////////////

  /*
    Compute the bounds for a block of text based on the specified 
    measure function, either _textBoundsSingle or _fontBoundsSingle
  */
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

  /*
    Attempts to set a property directly on the canvas.style object
  */
  p5.Renderer2D.prototype._setCanvasStyleProperty = function (opt, val) {

    // lets try to set it on the canvas style
    this.canvas.style[opt] = val.toString();

    // check if the value was set successfully
    if (this.canvas.style[opt] !== val.toString()) {
      console.warn(`Unable to set '${opt}' property` // FES?
        + ' on canvas.style. It may not be supported.');
    }
  };

  /*
    For properties not directly managed by the renderer in this.states
      we check if it has a mapping to a property in this.states
    Otherwise, add the property to the context-queue for later application
  */
  p5.Renderer2D.prototype._setContextProperty = function (prop, val, debug = false) {

    // is it a property mapped to one managed in this.states ?
    let propName = Object.keys(StatePropMappings)
      .find(k => StatePropMappings[k] === prop);

    // if so, set the mapped property in this.states instead
    if (propName && propName in this.states) {
      if (this.states[propName] === val) {
        return this._pInst;  // short-circuit if no change
      }
      this.states[propName] = val;
      if (debug) {
        console.log('set(mapped) this.states.' + prop + '/' + propName + '="' + val + '"');
      }
      return this._pInst;
    }

    // check if the value is actually different, else short-circuit
    if (this.drawingContext[prop] === val) {
      return this._pInst;
    }

    // otherwise, we will set the property directly on the `this.drawingContext`
    // by adding [property, value] to context-queue for later application
    (ContextQueue ??= []).push([prop, val]);

    if (debug) {
      console.log('queued context2d.' + prop + '="' + val + '"');
    }
  };

  /*
    Get the computed font-size in pixels for a given size string
    @param {string} size - the font-size string to compute
    @returns {number} - the computed font-size in pixels
   */
  p5.Renderer2D.prototype._fontSizePx = function (size) {
    let el = CachedDiv;
    if (typeof el === 'undefined') {
      el = document.createElement('div');
      el.ariaHidden = 'true';
      el.style.display = 'none';
      el.style.font = this.states.textFont; // ?? this.drawingContext.font
      el.style.fontSize = size;
      this.canvas.appendChild(el);
    }
    let fontSizeStr = getComputedStyle(el).fontSize;
    let fontSize = parseFloat(fontSizeStr);
    if (typeof fontSize !== 'number') {
      throw Error('textSize: invalid font-size');
    }
    return fontSize;
  };

  /*
    Aggregate the bounding boxes of multiple lines of text
    @param {array} bboxes - the bounding boxes to aggregate
    @returns {object} - the aggregated bounding box
  */
  p5.Renderer2D.prototype._aggregateBounds = function (bboxes) {
    return {
      x: Math.min(...bboxes.map(b => b.x)),
      y: Math.min(...bboxes.map(b => b.y)), // use boxes[0].y ?
      w: Math.max(...bboxes.map(b => b.w)),
      h: bboxes[bboxes.length - 1].y - bboxes[0].y + bboxes[bboxes.length - 1].h
    };
  };

  /*
    Position the lines of text based on their textAlign/textBaseline properties
  */
  p5.Renderer2D.prototype._positionLines = function (x, y, width, height, leading, numLines) {

    let adjustedX, positions = [];
    let adjustedW = typeof width === 'undefined' ? 0 : width;
    let adjustedH = typeof height === 'undefined' ? 0 : height;

    for (let i = 0; i < numLines; i++) {
      switch (this.drawingContext.textAlign) {
        case 'start': // TODO: add constants.START:
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
        case 'end': // TODO: add constants.END:
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
    Process the text string to handle line-breaks and text wrapping
    @param {string} str - the text to process
    @param {number} width - the width to wrap the text to
    @returns {array} - the processed lines of text
  */
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

  /*
    Align the bounding box based on the textAlign/textBaseline properties
  */
  p5.Renderer2D.prototype._alignBounds = function (bb, width, height, leading, numLines) {
    bb.x += this._xAlignOffset(width);
    bb.y += this._yAlignOffset(height, leading, numLines);
  }

  /*  
    Get the x-offset for text given the width and textAlign property
  */
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

  /*  
    Get the y-offset for text given the height, leading, line-count and textBaseline property
  */
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
      case 'ideographic':// TODO: add constants.IDEOGRAPHIC:
        console.warn('textBounds: IDEOGRAPHIC not yet supported for textBaseline'); // FES?
        return 0;
      case 'hanging':// TODO: constants.HANGING: 
        console.warn('textBounds: HANGING not yet supported for textBaseline'); // FES?
      default:
        return 0;
    }
  }

  /*
    Get the (tight) width of a single line of text
  */
  p5.Renderer2D.prototype._textWidthSingle = function (s) {
    let metrics = this.drawingContext.measureText(s);
    let abl = metrics.actualBoundingBoxLeft;
    let abr = metrics.actualBoundingBoxRight;
    return abr + abl;
  };

  /*
    Get the (loose) width of a single line of text as specified by the font
  */
  p5.Renderer2D.prototype._fontWidthSingle = function (s) {
    return this.drawingContext.measureText(s).width;
  };

  /*
    Get the (tight) height of a single line of text based on its actual bounding box
  */
  p5.Renderer2D.prototype._textHeightSingle = function (s) {
    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.actualBoundingBoxAscent;
    let desc = metrics.actualBoundingBoxDescent;
    return asc + desc;
  };

  /*
    Get the (loose) height of a single line of text based on its font's bounding box
  */
  p5.Renderer2D.prototype._fontHeightSingle = function (s) {
    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.fontBoundingBoxAscent;
    let desc = metrics.fontBoundingBoxDescent;
    return asc + desc;
  };

  /*
    Get the (tight) bounds of a single line of text based on its actual bounding box
  */
  p5.Renderer2D.prototype._textBoundsSingle = function (s, x = 0, y = 0) {

    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.actualBoundingBoxAscent;
    let desc = metrics.actualBoundingBoxDescent;
    let abl = metrics.actualBoundingBoxLeft;
    let abr = metrics.actualBoundingBoxRight;
    return { x: x - abl, y: y - asc, w: abr + abl, h: asc + desc };
  };

  /*
    Get the (loose) bounds of a single line of text based on its font's bounding box
  */
  p5.Renderer2D.prototype._fontBoundsSingle = function (s, x = 0, y = 0) {

    let metrics = this.drawingContext.measureText(s);
    let asc = metrics.fontBoundingBoxAscent;
    let desc = metrics.fontBoundingBoxDescent;
    x -= this._xAlignOffset(metrics.width);
    return { x, y: y - asc, w: metrics.width, h: asc + desc };;
  };

  /*
    Set the textSize property in `this.states` if it has changed
    @param {number | string} theSize - the font-size to set
    @returns {boolean} - true if the size was changed, false otherwise
   */
  p5.Renderer2D.prototype._setTextSize = function (theSize) {

    // parse the size via computed style (number as string currently fails, eg '12')
    if (typeof theSize === 'string') {
      theSize = this._fontSizePx(theSize);
    }

    // set it in `this.states` if its been changed
    if (this.states.textSize !== theSize) {

      this.states.textSize = theSize;

      // handle leading here, if not set otherwise 
      if (!this.states.leadingSet) {
        this.states.textLeading = this.states.textSize * LeadingScale;
      }
      return true;
    }
    return false;
  };

  /*
    Split the lines of text based on the width and the textWrap property
    @param {array} lines - the lines of text to split
    @param {number} maxWidth - the maximum width of the lines
    @param {object} opts - additional options for splitting the lines
    @returns {array} - the split lines of text
  */
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

  /*
    Split the text into lines based on line-breaks and tabs
  */
  p5.Renderer2D.prototype._splitOnBreaks = function (s) {
    if (!s || s.length === 0) return [''];
    return s.replace(TabsRe, '  ').split(LinebreakRe);
  };

  /*
    Parse the font-family string to handle complex names, fallbacks, etc.
  */
  p5.Renderer2D.prototype._parseFontFamily = function (familyStr) {

    let parts = familyStr.split(CommaDelimRe);
    let family = parts.map(part => {
      part = part.trim();
      if (part.indexOf(' ') > -1 && !QuotedRe.test(part)) {
        part = `"${part}"`; // quote font names with spaces
      }
      return part;
    }).join(', ');

    return family;
  };

  /*
    Apply the text properties in `this.states` to the `this.drawingContext`
    Then apply any properties in the context-queue
   */
  p5.Renderer2D.prototype._applyTextProperties = function () {

    let { textFont, textSize, textHeight } = this.states;

    let family = this._parseFontFamily(textFont);

    let size = `${textSize}px` + (textHeight !== constants.NORMAL ? `/${textHeight} ` : ' ');
    let textStretch = this.states.textStretch !== constants.NORMAL ? `${this.states.textStretch} ` : '';
    let textStyle = this.states.textStyle !== constants.NORMAL ? `${this.states.textStyle} ` : '';
    let textWeight = this.states.textWeight !== constants.NORMAL ? `${this.states.textWeight} ` : '';
    let textVariant = this.states.textVariant !== constants.NORMAL ? `${this.states.textVariant} ` : '';
    let fontString = `${textStretch}${textStyle}${textWeight}${textVariant}${size}${family}`.trim();

    /*
      Apply the font according to the CSS font-string specification:

        If font is specified as a shorthand for several font-related properties, then:
        - it must include values for: <font-size> and <font-family>
        - it may optionally include values for: 
            [<font-style>, <font-variant>, <font-weight>, <font-stretch>, <line-height>]

        Format:
        - font-style, font-variant and font-weight must precede font-size
        - font-variant may only specify the values defined in CSS 2.1, that is 'normal' and 'small-caps'.
        - font-stretch may only be a single keyword value.
        - line-height must immediately follow font-size, preceded by "/", eg 16px/3.
        - font-family must be the last value specified.
    */
    this.drawingContext.font = fontString;

    // case-insensitive check to see if the font was set successfully
    let expected = fontString.replace(textStretch, ''); // for fontStretch issue
    if (this.drawingContext.font.toLowerCase() !== expected.toLowerCase()) {
      console.warn(`Unable to set font="${fontString}", found "${this.drawingContext.font}"`);
    }

    // apply each property in queue after the font so they're not overridden
    while (ContextQueue?.length) {
      let [prop, val] = ContextQueue.shift();
      //console.log('apply context property "' + prop + '" = "' + val + '"');
      this.drawingContext[prop] = val;
      // check if the value was set successfully
      if (this.drawingContext[prop] !== val) {
        console.warn(`Unable to set '${opt}' property on context2d. It may not be supported.`); // FES?
      }
    }

    return this._pInst;
  };

  /* 
    Render a single line of text at the given position
    called by text() to render each line
  */
  p5.Renderer2D.prototype._renderText = function (line, x, y, maxY, minY) { // TODO: remove maxY, minY

    let states = this.states;

    if (y < minY || y >= maxY) {
      return; // don't render lines beyond minY/maxY
    }

    this._pInst.push(); // fix to v1 #803

    // no stroke unless specified by user
    if (states.doStroke && states.strokeSet) {
      this.drawingContext.strokeText(line, x, y);
    }

    if (!this._clipping && states.doFill) {

      // if fill hasn't been set by user, use default text fill
      if (!states.fillSet) {
        this._setFill(constants._DEFAULT_TEXT_FILL);
      }

      //console.log('fillText: "' + line + '"');
      this.drawingContext.fillText(line, x, y);
    }

    this._pInst.pop();

    return this._pInst;
  };
}

export default text2d;

if (typeof p5 !== 'undefined') {
  text2d(p5, p5.prototype);
}