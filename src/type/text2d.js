
/*
 *  TODO:
 *   - get axes and values for parsed fonts
 *   - change renderer.state to use getters for textAlign, textBaseline, etc. ??
 *   - textToPoints: enable passing props in options (textSize, textLeading, etc.)?
 *   - textToPaths: test rendering in p5 (new?/old api) [x] -- inner hole problem
 *   - cache parsed fonts (and/or lazy load) ?
 *   - test textToPoints with google/variable fonts
 *   - more with variable fonts, do slider example
 *   - better font-loading (google fonts, font-face declarations, multiple fonts with Promise.all())
 *   - test textToPoints with offscreen graphics.drawingContext passed in as 'context'
 *   - add test for line-height property in textFont() and textProperty()
 *      - how does this integrate with textLeading?
 *   - spurious warning in oneoff.html (local)
 * 
 *   - textToPoints/Path: add re-sampling support with current options [x]
 *   - add fontAscent/Descent and textWeight functions [x]
 *   - textToPaths should split into glyphs and paths [x]
 *   - add textFont(string) that forces context2d.font to be set (if including size part) [x]
 *   - textToPoints: test rectMode for all alignments [x]
 *   - test textToPoints with single line, and overlapping text [x]
 * 
 *  ENHANCEMENTS:
 *   - support direct setting of context2d.font with string [x]
 *   - support idographic and hanging baselines
 *   - support start and end text-alignments
 *   - add 'justify' alignment
 */

/**
 * @module Type
 * @submodule text2d
 * @for p5
 * @requires core
 */
function text2d(p5, fn) {

  // additional constants
  fn.IDEOGRAPHIC = 'ideographic';
  fn.RIGHT_TO_LEFT = 'rtl';
  fn.LEFT_TO_RIGHT = 'ltr';
  fn._CTX_MIDDLE = 'middle';
  fn._TEXT_BOUNDS = '_textBoundsSingle';
  fn._FONT_BOUNDS = '_fontBoundsSingle';
  fn.HANGING = 'hanging';
  fn.START = 'start';
  fn.END = 'end';

  const LeadingScale = 1.275;
  const DefaultFill = '#000000';
  const LinebreakRe = /\r?\n/g;
  const CommaDelimRe = /,\s+/;
  const QuotedRe = /^".*"$/;
  const TabsRe = /\t/g;
  const RendererProp = 0;
  const Context2dProp = 1;
  const FontVariationSettings = 'fontVariationSettings';
  const VariableAxes = ['wght', 'wdth', 'ital', 'slnt', 'opsz'];
  const VariableAxesRe = new RegExp(`(?:${VariableAxes.join('|')})`);

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
    'textToPoints',
    'textDirection',
    'textProperty',
    'textProperties',
    'fontBounds',
    'fontWidth',
    'fontAscent',
    'fontDescent',
    'textWeight'
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

  const RendererTextProps = {
    textAlign: { default: fn.LEFT, type: 'Context2d' },
    textBaseline: { default: fn.BASELINE, type: 'Context2d' },
    textFont: { default: 'sans-serif' },
    textLeading: { default: 15 },
    textSize: { default: 12 },
    textWrap: { default: fn.WORD },

    // added v2.0
    fontStretch: { default: fn.NORMAL, isShorthand: true },  // font-stretch: { default:  normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded }
    fontWeight: { default: fn.NORMAL, isShorthand: true },   // font-stretch: { default:  normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded }
    lineHeight: { default: fn.NORMAL, isShorthand: true },   // line-height: { default:  normal | number | length | percentage }
    fontVariant: { default: fn.NORMAL, isShorthand: true },  // font-variant: { default:  normal | small-caps }
    fontStyle: { default: fn.NORMAL, isShorthand: true },    // font-style: { default:  normal | italic | oblique } [was 'textStyle' in v1]

    direction: { default: 'inherit' }, // direction: { default: inherit | ltr | rtl }
  };

  // note: font must be first here otherwise it may reset other properties
  const ContextTextProps = ['font', 'direction', 'fontKerning', 'fontStretch', 'fontVariantCaps', 'letterSpacing', 'textAlign', 'textBaseline', 'textRendering', 'wordSpacing'];

  // shorthand font properties that can be set with context2d.font
  const ShorthandFontProps = Object.keys(RendererTextProps).filter(p => RendererTextProps[p].isShorthand);

  // allowable values for font-stretch property for context2d.font
  const FontStretchKeys = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"];

  let contextQueue, cachedDiv; // lazy

  ////////////////////////////// start API ///////////////////////////////

  p5.Renderer2D.prototype.text = function (str, x, y, width, height) {

    let setBaseline = this.drawingContext.textBaseline; // store baseline

    // adjust {x,y,w,h} properties based on rectMode
    ({ x, y, width, height } = this._handleRectMode(x, y, width, height));

    // parse the lines according to width, height & linebreaks
    let lines = this._processLines(str, width, height);

    // add the adjusted positions [x,y] to each line
    lines = this._positionLines(x, y, width, height, lines);

    // render each line at the adjusted position
    lines.forEach(line => this._renderText(line.text, line.x, line.y));

    this.drawingContext.textBaseline = setBaseline; // restore baseline
  };

  /**
   * Computes the precise (tight) bounding box for a block of text
   * @param {string} str - the text to measure
   * @param {number} x - the x-coordinate of the text
   * @param {number} y - the y-coordinate of the text
   * @param {number} width - the max width of the text block
   * @param {number} height - the max height of the text block
   * @returns - a bounding box object for the text block: {x,y,w,h}
   */
  p5.Renderer2D.prototype.textBounds = function (str, x, y, width, height) {
    //console.log('TEXT BOUNDS: ', str, x, y, width, height);
    // delegate to _textBoundsSingle measure function
    return this._computeBounds(fn._TEXT_BOUNDS, str, x, y, width, height).bounds;
  };

  /**
   * Computes a generic (non-tight) bounding box for a block of text
   * @param {string} str - the text to measure
   * @param {number} x - the x-coordinate of the text
   * @param {number} y - the y-coordinate of the text
   * @param {number} width - the max width of the text block
   * @param {number} height - the max height of the text block
   * @returns - a bounding box object for the text block: {x,y,w,h}
   */
  p5.Renderer2D.prototype.fontBounds = function (str, x, y, width, height) {
    // delegate to _fontBoundsSingle measure function
    return this._computeBounds(fn._FONT_BOUNDS, str, x, y, width, height).bounds;
  };

  /**
   * Get the width of a text string in pixels (tight bounds)
   * @param {string} theText 
   * @returns - the width of the text in pixels
   */
  p5.Renderer2D.prototype.textWidth = function (theText) {
    let lines = this._processLines(theText, null, null);
    // return the max width of the lines (using tight bounds)
    let widths = lines.map(l => this._textWidthSingle(l));
    return Math.max(...widths);
  };

  /**
   * Get the width of a text string in pixels (loose bounds)
   * @param {string} theText 
   * @returns - the width of the text in pixels
   */
  p5.Renderer2D.prototype.fontWidth = function (theText) {
    // return the max width of the lines (using loose bounds)
    let lines = this._processLines(theText, null, null);
    let widths = lines.map(l => this._fontWidthSingle(l));
    return Math.max(...widths);
  };

  /**
   * 
   * @param {*} txt - optional text to measure, if provided will be
   * used to compute the ascent, otherwise the font's ascent will be used
   * @returns - the ascent of the text
   */
  p5.Renderer2D.prototype.textAscent = function (txt = '') {
    if (!txt.length) return this.fontAscent();
    return this.drawingContext.measureText(txt)[prop];
  };

  /**
   * @returns - returns the ascent for the current font
   */
  p5.Renderer2D.prototype.fontAscent = function () {
    return this.drawingContext.measureText('_').fontBoundingBoxAscent;
  };

  /**
   * @param {*} txt - optional text to measure, if provided will
   * be used to compute the descent, otherwise the font's descent will be used
   * @returns - the descent of the text
   */
  p5.Renderer2D.prototype.textDescent = function (txt = '') {
    if (!txt.length) return this.fontDescent();
    return this.drawingContext.measureText(txt)[prop];
  };

  /**
   * @returns - returns the descent for the current font
   */
  p5.Renderer2D.prototype.fontDescent = function () {
    return this.drawingContext.measureText('_').fontBoundingBoxDescent;
  };

  // setters/getters for text properties //////////////////////////

  p5.Renderer2D.prototype.textAlign = function (h, v) {

    // the setter
    if (typeof h !== 'undefined') {
      this.states.textAlign = h;
      if (typeof v !== 'undefined') {
        if (v === fn.CENTER) {
          v = fn._CTX_MIDDLE;
        }
        this.states.textBaseline = v;
      }
      return this._applyTextProperties();
    }
    // the getter
    return {
      horizontal: this.states.textAlign,
      vertical: this.states.textBaseline
    };
  };

  /**
   * Set the font and [size] and [options] for rendering text
   * @param {p5.Font | string} font - the font to use for rendering text
   * @param {number} size - the size of the text, can be a number or a css-style string
   * @param {object} options - additional options for rendering text, see FontProps
   */
  p5.Renderer2D.prototype.textFont = function (font, size, options) {

    if (arguments.length === 0) {
      return this.states.textFont;
    }

    let family = font;

    // do we have a custon loaded font ?
    if (font instanceof p5.Font) {
      family = font.face.family;
    }
    else if (font.data instanceof Uint8Array) {
      family = font.name.fontFamily;
      if (font.name?.fontSubfamily) {
        family += '-' + font.name.fontSubfamily;
      }
    }

    if (typeof family !== 'string') {
      throw Error('null font passed to textFont', font);
    }

    // handle two-arg case: textFont(font, options)
    if (arguments.length === 2 && typeof size === 'object') {
      options = size;
      size = undefined;
    }

    // check for font-string with size in first arg
    if (typeof size === 'undefined' && /[.0-9]+(%|em|p[xt])/.test(family)) {
      ({ family, size } = this._directSetFontString(family));
    }

    // update font properties in this.states
    this.states.textFont = family;

    // convert/update the size in this.states
    if (typeof size !== 'undefined') {
      this._setTextSize(size);
    }

    // apply any options to this.states
    if (typeof options === 'object') {
      this.textProperties(options);
    }

    this._applyTextProperties();
    //console.log('ctx.font="' + this.drawingContext.font + '"');
    return this._pInst;
  }

  p5.Renderer2D.prototype._directSetFontString = function (font, debug = 0) {
    if (debug) console.log('_directSetFontString"' + font + '"');
    let defaults = ShorthandFontProps.reduce((props, p) => {
      props[p] = RendererTextProps[p].default;
      return props;
    }, {});
    let el = this._cachedDiv(defaults);
    el.style.font = font;
    let style = getComputedStyle(el);
    ShorthandFontProps.forEach(prop => {
      this.states[prop] = style[prop];
      if (debug) console.log('  this.states.' + prop + '="' + style[prop] + '"');
    });
    if (debug) console.log('  this.states.textFont="' + style.fontFamily + '"');
    if (debug) console.log('  this.states.textSize="' + style.fontSize + '"');
    return { family: style.fontFamily, size: style.fontSize };
  }

  p5.Renderer2D.prototype.textLeading = function (leading) {
    // the setter
    if (typeof leading === 'number') {
      this.states.leadingSet = true;
      this.states.textLeading = leading;
      return this._applyTextProperties();
    }
    // the getter
    return this.states.textLeading;
  }

  p5.Renderer2D.prototype.textWeight = function (weight) {
    // the setter
    if (typeof weight === 'number') {
      this.states.fontWeight = weight;
      return this._applyTextProperties();
    }
    // the getter
    return this.states.fontWeight;
  }

  /**
   * @param {*} size - the size of the text, can be a number or a css-style string
   */
  p5.Renderer2D.prototype.textSize = function (size) {

    // the setter
    if (typeof size !== 'undefined') {
      this._setTextSize(size);
      return this._applyTextProperties();
    }
    // the getter  
    return this.states.textSize;
  }

  p5.Renderer2D.prototype.textStyle = function (style) {

    // the setter
    if (typeof style !== 'undefined') {
      this.states.fontStyle = style;
      return this._applyTextProperties();
    }
    // the getter
    return this.states.fontStyle;
  }

  p5.Renderer2D.prototype.textWrap = function (wrapStyle) {

    if (wrapStyle === fn.WORD || wrapStyle === fn.CHAR) {
      this.states.textWrap = wrapStyle;
      // no need to apply text properties here as not a context property
      return this._pInst;
    }
    return this.states.textWrap;
  };

  p5.Renderer2D.prototype.textDirection = function (direction) {

    if (typeof direction !== 'undefined') {
      this.states.direction = direction;
      return this._applyTextProperties();
    }
    return this.states.direction;
  };

  /**
   * Sets/gets a single text property for the renderer (eg. fontStyle, fontStretch, etc.)
   * The property to be set can be a mapped or unmapped property on `this.states` or a property 
   * on `this.drawingContext` or on `this.canvas.style`
   * The property to get can exist in `this.states` or `this.drawingContext` or `this.canvas.style`
   */
  p5.Renderer2D.prototype.textProperty = function (prop, value, opts) {

    let modified = false, debug = opts?.debug || false;

    // getter: return option from this.states or this.drawingContext
    if (typeof value === 'undefined') {
      let props = this.textProperties();
      if (prop in props) return props[prop];
      throw Error('Unknown text option "' + prop + '"'); // FES? 
    }

    // set the option in this.states if it exists
    if (prop in this.states && this.states[prop] !== value) {
      this.states[prop] = value;
      modified = true;
      if (debug) {
        console.log('this.states.' + prop + '="' + options[prop] + '"');
      }
    }
    // does it exist in CanvasRenderingContext2D ?
    else if (prop in this.drawingContext) {
      this._setContextProperty(prop, value, debug);
      modified = true;
    }
    // does it exist in the canvas.style ?
    else if (prop in this.canvas.style) {
      this._setCanvasStyleProperty(prop, value, debug);
      modified = true;
    }
    else {
      console.warn('Ignoring unknown text option: "' + prop + '"\n'); // FES?
    }

    return modified ? this._applyTextProperties() : this._pInst;
  };

  /**
   * Batch set/get text properties for the renderer.
   * The properties can be either on `states` or `drawingContext`
   */
  p5.Renderer2D.prototype.textProperties = function (properties) {

    // setter
    if (typeof properties !== 'undefined') {
      Object.keys(properties).forEach(opt => {
        this.textProperty(opt, properties[opt]);
      });
      return this._pInst;
    }

    // getter: get props from this.drawingContext
    properties = ContextTextProps.reduce((props, p) => {
      props[p] = this.drawingContext[p];
      return props;
    }, {});

    // add renderer.states props
    Object.keys(RendererTextProps).forEach(p => {
      properties[p] = this.states[p];
      if (RendererTextProps[p]?.type === 'Context2d') {
        properties[p] = this.drawingContext[p];
      }
    });

    return properties;
  };

  p5.Renderer2D.prototype.textMode = function () { /* no-op for processing api */ };

  /////////////////////////////// end API ////////////////////////////////


  /*
    Compute the bounds for a block of text based on the specified 
    measure function, either _textBoundsSingle or _fontBoundsSingle
  */
  p5.Renderer2D.prototype._computeBounds = function (type, str, x, y, width, height, opts) {

    let setBaseline = this.drawingContext.textBaseline;
    let { textLeading, textAlign } = this.states;

    // adjust width, height based on current rectMode
    ({ width, height } = this._rectModeAdjust(x, y, width, height));

    // parse the lines according to the width & linebreaks
    let lines = this._processLines(str, width, height);

    // get the adjusted positions [x,y] for each line
    let boxes = lines.map((line, i) => this[type].bind(this)
      (line, x, y + i * textLeading));

    // adjust the bounding boxes based on horiz. text alignment
    if (lines.length > 1) {
      boxes.forEach(bb => bb.x += this._xAlignOffset(textAlign, width));
    }

    // adjust the bounding boxes based on vert. text alignment
    if (typeof height !== 'undefined') {
      this._yAlignOffset(boxes, height);
    }

    // get the bounds for the text block
    let bounds = boxes[0];
    if (lines.length > 1) {

      // get the bounds for the multi-line text block
      bounds = this._aggregateBounds(boxes);

      // align the multi-line bounds
      if (!opts?.ignoreRectMode) {
        this._rectModeAlign(bounds, width || 0, height || 0);
      }
    }

    if (0 && opts?.ignoreRectMode) boxes.forEach((b, i) => { // draw bounds for debugging
      let ss = this.drawingContext.strokeStyle;
      this.drawingContext.strokeStyle = 'green';
      this.drawingContext.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
      this.drawingContext.strokeStyle = ss;
    });

    this.drawingContext.textBaseline = setBaseline; // restore baseline

    return { bounds, lines };
  };

  /*
    Adjust width, height of bounds based on current rectMode
  */
  p5.Renderer2D.prototype._rectModeAdjust = function (x, y, width, height) {

    if (typeof width !== 'undefined') {
      switch (this.states.rectMode) {
        case fn.CENTER:
          break;
        case fn.CORNERS:
          width -= x;
          height -= y;
          break;
        case fn.RADIUS:
          width *= 2;
          height *= 2;
          break;
      }
    }
    return { x, y, width, height };
  }

  /*
    Attempts to set a property directly on the canvas.style object
  */
  p5.Renderer2D.prototype._setCanvasStyleProperty = function (opt, val, debug) {

    let value = val.toString(); // ensure its a string

    if (debug) console.log('canvas.style.' + opt + '="' + value + '"');

    // handle variable fonts options
    if (opt === FontVariationSettings) {
      this._handleFontVariationSettings(value);
    }

    // lets try to set it on the canvas style
    this.canvas.style[opt] = value;

    // check if the value was set successfully
    if (this.canvas.style[opt] !== value) {

      // fails on precision for floating points, also quotes and spaces

      if (0) console.warn(`Unable to set '${opt}' property` // FES?
        + ' on canvas.style. It may not be supported. Expected "'
        + value + '" but got: "' + this.canvas.style[opt] + "'");
    }
  };

  /*
    Parses the fontVariationSettings string and sets the font properties, only font-weight
    working consistently across browsers at present
  */
  p5.Renderer2D.prototype._handleFontVariationSettings = function (value, debug = false) {
    // check if the value is a string or an object
    if (typeof value === 'object') {
      value = Object.keys(value).map(k => k + ' ' + value[k]).join(', ');
    }
    let values = value.split(CommaDelimRe);
    values.forEach(v => {
      v = v.replace(/["']/g, ''); // remove quotes
      let matches = VariableAxesRe.exec(v);
      //console.log('matches: ', matches);
      if (matches && matches.length) {
        let axis = matches[0];
        // get the value to 3 digits of precision with no trailing zeros
        let val = parseFloat(parseFloat(v.replace(axis, '').trim()).toFixed(3));
        switch (axis) {
          case 'wght':
            if (debug) console.log('setting font-weight=' + val);
            // manually set the font-weight via the font string
            this.textWeight(val);
            return val;
          case 'wdth':
            if (0) { // attempt to map font-stretch to allowed keywords
              const FontStretchMap = {
                "ultra-condensed": 50,
                "extra-condensed": 62.5,
                "condensed": 75,
                "semi-condensed": 87.5,
                "normal": 100,
                "semi-expanded": 112.5,
                "expanded": 125,
                "extra-expanded": 150,
                "ultra-expanded": 200,
              };
              let values = Object.values(FontStretchMap);
              const indexArr = values.map(function (k) { return Math.abs(k - val) })
              const min = Math.min.apply(Math, indexArr)
              let idx = indexArr.indexOf(min);
              let stretch = Object.keys(FontStretchMap)[idx];
              this.states.fontStretch = stretch;
            }
            break;
          case 'ital':
            if (debug) console.log('setting font-style=' + (val ? 'italic' : 'normal'));
            break;
          case 'slnt':
            if (debug) console.log('setting font-style=' + (val ? 'oblique' : 'normal'));
            break;
          case 'opsz':
            if (debug) console.log('setting font-optical-size=' + val);
            break;
        }
      }
    });
  };




  /*
    For properties not directly managed by the renderer in this.states
      we check if it has a mapping to a property in this.states
    Otherwise, add the property to the context-queue for later application
  */
  p5.Renderer2D.prototype._setContextProperty = function (prop, val, debug = false) {

    // check if the value is actually different, else short-circuit
    if (this.drawingContext[prop] === val) {
      return this._pInst;
    }

    // otherwise, we will set the property directly on the `this.drawingContext`
    // by adding [property, value] to context-queue for later application
    (contextQueue ??= []).push([prop, val]);

    if (debug) console.log('queued context2d.' + prop + '="' + val + '"');
  };

  /*
     Adjust parameters (x,y,w,h) based on current rectMode
  */
  p5.Renderer2D.prototype._handleRectMode = function (x, y, width, height) {

    let rectMode = this.states.rectMode;

    if (typeof width !== 'undefined') {
      switch (rectMode) {
        case fn.RADIUS:
          width *= 2;
          x -= width / 2;
          if (typeof height !== 'undefined') {
            height *= 2;
            y -= height / 2;
          }
          break;
        case fn.CENTER:
          x -= width / 2;
          if (typeof height !== 'undefined') {
            y -= height / 2;
          }
          break;
        case fn.CORNERS:
          width -= x;
          if (typeof height !== 'undefined') {
            height -= y;
          }
          break;
      }
    }
    return { x, y, width, height };
  };

  /*
    Get the computed font-size in pixels for a given size string
    @param {string} size - the font-size string to compute
    @returns {number} - the computed font-size in pixels
   */
  p5.Renderer2D.prototype._fontSizePx = function (theSize, family = this.states.textFont) {

    const isNumString = (num) => !isNaN(num) && num.trim() !== '';

    // check for a number in a string, eg '12'
    if (isNumString(theSize)) {
      return parseFloat(theSize);
    }
    let ele = this._cachedDiv({ fontSize: theSize });
    ele.style.fontSize = theSize;
    ele.style.fontFamily = family;
    let fontSizeStr = getComputedStyle(ele).fontSize;
    let fontSize = parseFloat(fontSizeStr);
    if (typeof fontSize !== 'number') {
      throw Error('textSize: invalid font-size');
    }
    return fontSize;
  };

  p5.Renderer2D.prototype._cachedDiv = function (props) {
    if (typeof cachedDiv === 'undefined') {
      let ele = document.createElement('div');
      ele.ariaHidden = 'true';
      ele.style.display = 'none';
      Object.entries(props).forEach(([prop, val]) => {
        ele.style[prop] = val;
      });
      this.canvas.appendChild(ele);
      cachedDiv = ele;
    }
    return cachedDiv;
  }


  /*
    Aggregate the bounding boxes of multiple lines of text
    @param {array} bboxes - the bounding boxes to aggregate
    @returns {object} - the aggregated bounding box
  */
  p5.Renderer2D.prototype._aggregateBounds = function (bboxes) {
    // loop over the bounding boxes to get the min/max x/y values
    let minX = Math.min(...bboxes.map(b => b.x));
    let minY = Math.min(...bboxes.map(b => b.y));
    let maxY = Math.max(...bboxes.map(b => b.y + b.h));
    let maxX = Math.max(...bboxes.map(b => b.x + b.w));
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  };

  // p5.Renderer2D.prototype._aggregateBounds = function (tx, ty, bboxes) {
  //   let x = Math.min(...bboxes.map(b => b.x));
  //   let y = Math.min(...bboxes.map(b => b.y));
  //   // the width is the max of the x-offset + the box width
  //   let w = Math.max(...bboxes.map(b => (b.x - tx) + b.w));
  //   let h = bboxes[bboxes.length - 1].y - bboxes[0].y + bboxes[bboxes.length - 1].h;


  //   return { x, y, w, h };
  // };

  /*
    Position the lines of text based on their textAlign/textBaseline properties
  */
  p5.Renderer2D.prototype._positionLines = function (x, y, width, height, lines) {

    let { textLeading, textAlign } = this.states;
    let adjustedX, lineData = new Array(lines.length);
    let adjustedW = typeof width === 'undefined' ? 0 : width;
    let adjustedH = typeof height === 'undefined' ? 0 : height;

    for (let i = 0; i < lines.length; i++) {
      switch (textAlign) {
        case fn.START:
          throw new Error('textBounds: START not yet supported for textAlign'); // default to LEFT
        case fn.LEFT:
          adjustedX = x;
          break;
        case fn.CENTER:
          adjustedX = x + adjustedW / 2;
          break;
        case fn.RIGHT:
          adjustedX = x + adjustedW;
          break;
        case fn.END: // TODO: add fn.END:
          throw new Error('textBounds: END not yet supported for textAlign');
      }
      lineData[i] = { text: lines[i], x: adjustedX, y: y + i * textLeading };
    }

    return this._yAlignOffset(lineData, adjustedH);
  };

  /*
    Process the text string to handle line-breaks and text wrapping
    @param {string} str - the text to process
    @param {number} width - the width to wrap the text to
    @returns {array} - the processed lines of text
  */
  p5.Renderer2D.prototype._processLines = function (str, width, height) {

    if (typeof width !== 'undefined') { // only for text with bounds
      if (this.drawingContext.textBaseline === fn.BASELINE) {
        this.drawingContext.textBaseline = fn.TOP;
      }
    }

    let lines = this._splitOnBreaks(str.toString());
    let hasLineBreaks = lines.length > 1;
    let hasWidth = typeof width !== 'undefined';
    let exceedsWidth = hasWidth && lines.some(l => this._textWidthSingle(l) > width);
    let { textLeading: leading, textWrap } = this.states;

    //if (!hasLineBreaks && !exceedsWidth) return lines; // a single-line
    if (hasLineBreaks || exceedsWidth) {
      if (hasWidth) lines = this._lineate(textWrap, lines, width);
    }

    // handle height truncation
    if (hasWidth && typeof height !== 'undefined') {

      if (typeof leading === 'undefined') {
        throw Error('leading is required if height is specified');
      }

      // truncate lines that exceed the height
      for (let i = 0; i < lines.length; i++) {
        let lh = leading * (i + 1);
        if (lh > height) {
          //console.log('TRUNCATING: ', i, '-', lines.length, '"' + lines.slice(i) + '"');
          lines = lines.slice(0, i);
          break;
        }
      }
    }

    return lines;
  };

  /*  
    Get the x-offset for text given the width and textAlign property
  */
  p5.Renderer2D.prototype._xAlignOffset = function (textAlign, width) {
    switch (textAlign) {
      case fn.LEFT:
        return 0;
      case fn.CENTER:
        return width / 2;
      case fn.RIGHT:
        return width;
      case fn.START:
        return 0;
      case fn.END:
        throw new Error('textBounds: END not yet supported for textAlign');
      default:
        return 0;
    }
  }

  /*  
    Get the y-offset for text given the height, leading, line-count and textBaseline property
  */
  p5.Renderer2D.prototype._yAlignOffset = function (dataArr, height) {

    if (typeof height === 'undefined') {
      throw Error('_yAlignOffset: height is required');
    }

    let { textLeading, textBaseline } = this.states;
    let yOff = 0, numLines = dataArr.length;
    let ydiff = height - (textLeading * (numLines - 1));
    switch (textBaseline) { // drawingContext ?
      case fn.TOP:
        break; // ??
      case fn.BASELINE:
        break;
      case fn._CTX_MIDDLE:
        yOff = ydiff / 2;
        break;
      case fn.BOTTOM:
        yOff = ydiff;
        break;
      case fn.IDEOGRAPHIC:
        console.warn('textBounds: IDEOGRAPHIC not yet supported for textBaseline'); // FES?
        break;
      case fn.HANGING:
        console.warn('textBounds: HANGING not yet supported for textBaseline'); // FES?
        break;
    }
    dataArr.forEach(ele => ele.y += yOff);
    return dataArr;
  }

  /*
    Align the bounding box based on the current rectMode setting
  */
  p5.Renderer2D.prototype._rectModeAlign = function (bb, width, height) {
    if (typeof width !== 'undefined') {

      switch (this.states.rectMode) {
        case fn.CENTER:
          bb.x -= (width - bb.w) / 2;
          bb.y -= (height - bb.h) / 2;
          break;
        case fn.CORNERS:
          bb.w += bb.x;
          bb.h += bb.y;
          break;
        case fn.RADIUS:
          bb.x -= (width - bb.w) / 2;
          bb.y -= (height - bb.h) / 2;
          bb.w /= 2;
          bb.h /= 2;
          break;
      }
      return bb;
    }
  }

  p5.Renderer2D.prototype._rectModeAlignRevert = function (bb, width, height) {
    if (typeof width !== 'undefined') {

      switch (this.states.rectMode) {
        case fn.CENTER:
          bb.x += (width - bb.w) / 2;
          bb.y += (height - bb.h) / 2;
          break;
        case fn.CORNERS:
          bb.w -= bb.x;
          bb.h -= bb.y;
          break;
        case fn.RADIUS:
          bb.x += (width - bb.w) / 2;
          bb.y += (height - bb.h) / 2;
          bb.w *= 2;
          bb.h *= 2;
          break;
      }
      return bb;
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
    x -= this._xAlignOffset(this.states.textAlign, metrics.width);
    return { x, y: y - asc, w: metrics.width, h: asc + desc };;
  };

  /*
    Set the textSize property in `this.states` if it has changed
    @param {number | string} theSize - the font-size to set
    @returns {boolean} - true if the size was changed, false otherwise
   */
  p5.Renderer2D.prototype._setTextSize = function (theSize) {

    if (typeof theSize === 'string') {
      // parse the size string via computed style, eg '2em'
      theSize = this._fontSizePx(theSize);
    }

    // should be a number now
    if (typeof theSize === 'number') {

      // set it in `this.states` if its been changed
      if (this.states.textSize !== theSize) {
        this.states.textSize = theSize;

        // handle leading here, if not set otherwise 
        if (!this.states.leadingSet) {
          this.states.textLeading = this.states.textSize * LeadingScale;
        }
        return true; // size was changed
      }
    }
    else {
      console.warn('textSize: invalid size: ' + theSize);
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
  p5.Renderer2D.prototype._lineate = function (textWrap, lines, maxWidth = Infinity, opts = {}) {

    let splitter = opts.splitChar ?? (textWrap === fn.WORD ? ' ' : '');
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

  p5.Renderer2D.prototype._applyFontString = function () {
    /*
      Create the font-string according to the CSS font-string specification:
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
    let { textFont, textSize, lineHeight, fontStyle, fontWeight, fontVariant } = this.states;
    let family = this._parseFontFamily(textFont);
    let style = fontStyle !== fn.NORMAL ? `${fontStyle} ` : '';
    let weight = fontWeight !== fn.NORMAL ? `${fontWeight} ` : '';
    let variant = fontVariant !== fn.NORMAL ? `${fontVariant} ` : '';
    let fsize = `${textSize}px` + (lineHeight !== fn.NORMAL ? `/${lineHeight} ` : ' ');
    let fontString = `${style}${variant}${weight}${fsize}${family}`.trim();
    //console.log('fontString="' + fontString + '"');

    // set the font string on the context
    this.drawingContext.font = fontString;

    // verify that it was set successfully
    if (this.drawingContext.font !== fontString) {
      let expected = fontString;
      let actual = this.drawingContext.font;
      if (expected !== actual) {
        //console.warn(`Unable to set font property on context2d. It may not be supported.`); 
        //console.log('Expected "' + expected + '" but got: "' + actual + '"'); // TMP
        return false;
      }
    }
    return true;
  }

  /*
    Apply the text properties in `this.states` to the `this.drawingContext`
    Then apply any properties in the context-queue
   */
  p5.Renderer2D.prototype._applyTextProperties = function (debug = false) {

    this._applyFontString();

    // set these after the font so they're not overridden
    this.drawingContext.direction = this.states.direction;
    this.drawingContext.textAlign = this.states.textAlign;
    this.drawingContext.textBaseline = this.states.textBaseline;

    // set manually as (still) not fully supported as part of font-string
    let stretch = this.states.fontStretch;
    if (FontStretchKeys.includes(stretch) && this.drawingContext.fontStretch !== stretch) {
      this.drawingContext.fontStretch = stretch;
    }

    // apply each property in queue after the font so they're not overridden    
    while (contextQueue?.length) {

      let [prop, val] = contextQueue.shift();
      if (debug) console.log('apply context property "' + prop + '" = "' + val + '"');
      this.drawingContext[prop] = val;

      // check if the value was set successfully
      if (this.drawingContext[prop] !== val) {
        console.warn(`Unable to set '${prop}' property on context2d. It may not be supported.`); // FES?
        console.log('Expected "' + val + '" but got: "' + this.drawingContext[prop] + '"');
      }
    }

    return this._pInst;
  };

  /* 
    Render a single line of text at the given position
    called by text() to render each line
  */
  p5.Renderer2D.prototype._renderText = function (text, x, y, maxY, minY) {
    let states = this.states;

    if (y < minY || y >= maxY) {
      return; // don't render lines beyond minY/maxY
    }

    this._pInst.push(); // fix to v1 #803

    // no stroke unless specified by user
    if (states.doStroke && states.strokeSet) {
      this.drawingContext.strokeText(text, x, y);
    }

    if (!this._clipping && states.doFill) {

      // if fill hasn't been set by user, use default text fill
      if (!states.fillSet) {
        this._setFill(DefaultFill);
      }

      //console.log(`fillText(${x},${y},'${text}') font='${this.drawingContext.font}'`);
      this.drawingContext.fillText(text, x, y);
    }

    this._pInst.pop();

    return this._pInst;
  };
}

export default text2d;

if (typeof p5 !== 'undefined') {
  text2d(p5, p5.prototype);
}