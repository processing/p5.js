import * as constants from './constants';
import p5 from './main';
import { Renderer } from './p5.Renderer';
import { Graphics } from './p5.Graphics';
import { Image } from '../image/p5.Image';
import { Element } from '../dom/p5.Element';
import { MediaElement } from '../dom/p5.MediaElement';
import { RGBHDR } from '../color/creating_reading';
import FilterRenderer2D from '../image/filterRenderer2D';
import { Matrix } from '../math/p5.Matrix';
import { PrimitiveToPath2DConverter } from '../shape/custom_shapes';


const styleEmpty = 'rgba(0,0,0,0)';
// const alphaThreshold = 0.00125; // minimum visible

class Renderer2D extends Renderer {
  constructor(pInst, w, h, isMainCanvas, elt, attributes = {}) {
    super(pInst, w, h, isMainCanvas);

    this.canvas = this.elt = elt || document.createElement('canvas');

    if (isMainCanvas) {
      // for pixel method sharing with pimage
      this._pInst._curElement = this;
      this._pInst.canvas = this.canvas;
    } else {
      // hide if offscreen buffer by default
      this.canvas.style.display = 'none';
    }

    this.elt.id = 'defaultCanvas0';
    this.elt.classList.add('p5Canvas');

    // Extend renderer with methods of p5.Element with getters
    for (const p of Object.getOwnPropertyNames(Element.prototype)) {
      if (p !== 'constructor' && p[0] !== '_') {
        Object.defineProperty(this, p, {
          get() {
            return this.wrappedElt[p];
          }
        })
      }
    }

    // Set canvas size
    this.elt.width = w * this._pixelDensity;
    this.elt.height = h * this._pixelDensity;
    this.elt.style.width = `${w}px`;
    this.elt.style.height = `${h}px`;

    // Attach canvas element to DOM
    if (this._pInst._userNode) {
      // user input node case
      this._pInst._userNode.appendChild(this.elt);
    } else {
      //create main element
      if (document.getElementsByTagName('main').length === 0) {
        let m = document.createElement('main');
        document.body.appendChild(m);
      }
      //append canvas to main
      document.getElementsByTagName('main')[0].appendChild(this.elt);
    }

    // Get and store drawing context
    this.drawingContext = this.canvas.getContext('2d', attributes);
    if(attributes.colorSpace === 'display-p3'){
      this.states.colorMode = RGBHDR;
    }
    this.scale(this._pixelDensity, this._pixelDensity);

    if(!this.filterRenderer){
      this.filterRenderer = new FilterRenderer2D(this);
    }
    // Set and return p5.Element
    this.wrappedElt = new Element(this.elt, this._pInst);

    this.clipPath = null;
  }

  remove(){
    this.wrappedElt.remove();
    this.wrappedElt = null;
    this.canvas = null;
    this.elt = null;
  }

  getFilterGraphicsLayer() {
    // create hidden webgl renderer if it doesn't exist
    if (!this.filterGraphicsLayer) {
      const pInst = this._pInst;

      // create secondary layer
      this.filterGraphicsLayer =
        new Graphics(
          this.width,
          this.height,
          constants.WEBGL,
          pInst
        );
    }
    if (
      this.filterGraphicsLayer.width !== this.width ||
      this.filterGraphicsLayer.height !== this.height
    ) {
      // Resize the graphics layer
      this.filterGraphicsLayer.resizeCanvas(this.width, this.height);
    }
    if (
      this.filterGraphicsLayer.pixelDensity() !== this._pInst.pixelDensity()
    ) {
      this.filterGraphicsLayer.pixelDensity(this._pInst.pixelDensity());
    }

    return this.filterGraphicsLayer;
  }

  _applyDefaults() {
    this.states.setValue('_cachedFillStyle', undefined);
    this.states.setValue('_cachedStrokeStyle', undefined);
    this._cachedBlendMode = constants.BLEND;
    this._setFill(constants._DEFAULT_FILL);
    this._setStroke(constants._DEFAULT_STROKE);
    this.drawingContext.lineCap = constants.ROUND;
    this.drawingContext.font = 'normal 12px sans-serif';
  }

  resize(w, h) {
    super.resize(w, h);

    // save canvas properties
    const props = {};
    for (const key in this.drawingContext) {
      const val = this.drawingContext[key];
      if (typeof val !== 'object' && typeof val !== 'function') {
        props[key] = val;
      }
    }

    this.canvas.width = w * this._pixelDensity;
    this.canvas.height = h * this._pixelDensity;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.drawingContext.scale(
      this._pixelDensity,
      this._pixelDensity
    );

    // reset canvas properties
    for (const savedKey in props) {
      try {
        this.drawingContext[savedKey] = props[savedKey];
      } catch (err) {
        // ignore read-only property errors
      }
    }
  }

  //////////////////////////////////////////////
  // COLOR | Setting
  //////////////////////////////////////////////

  background(...args) {
    this.push();
    this.resetMatrix();

    if (args[0] instanceof Image) {
      if (args[1] >= 0) {
        // set transparency of background
        const img = args[0];
        this.drawingContext.globalAlpha = args[1] / 255;
        this._pInst.image(img, 0, 0, this.width, this.height);
      } else {
        this._pInst.image(args[0], 0, 0, this.width, this.height);
      }
    } else {
      // create background rect
      const color = this._pInst.color(...args);

      //accessible Outputs
      if (this._pInst._addAccsOutput()) {
        this._pInst._accsBackground(color._getRGBA([255, 255, 255, 255]));
      }

      const newFill = color.toString();
      this._setFill(newFill);

      if (this._isErasing) {
        this.blendMode(this._cachedBlendMode);
      }

      this.drawingContext.fillRect(0, 0, this.width, this.height);

      if (this._isErasing) {
        this._pInst.erase();
      }
    }
    this.pop();
  }

  clear() {
    this.drawingContext.save();
    this.resetMatrix();
    this.drawingContext.clearRect(0, 0, this.width, this.height);
    this.drawingContext.restore();
  }

  fill(...args) {
    super.fill(...args);
    const color = this.states.fillColor;
    this._setFill(color.toString());

    //accessible Outputs
    if (this._pInst._addAccsOutput()) {
      this._pInst._accsCanvasColors('fill', color._getRGBA([255, 255, 255, 255]));
    }
  }

  stroke(...args) {
    super.stroke(...args);
    const color = this.states.strokeColor;
    this._setStroke(color.toString());

    //accessible Outputs
    if (this._pInst._addAccsOutput()) {
      this._pInst._accsCanvasColors('stroke', color._getRGBA([255, 255, 255, 255]));
    }
  }

  erase(opacityFill, opacityStroke) {
    if (!this._isErasing) {
      // cache the fill style
      this.states.setValue('_cachedFillStyle', this.drawingContext.fillStyle);
      const newFill = this._pInst.color(255, opacityFill).toString();
      this.drawingContext.fillStyle = newFill;

      // cache the stroke style
      this.states.setValue('_cachedStrokeStyle', this.drawingContext.strokeStyle);
      const newStroke = this._pInst.color(255, opacityStroke).toString();
      this.drawingContext.strokeStyle = newStroke;

      // cache blendMode
      const tempBlendMode = this._cachedBlendMode;
      this.blendMode(constants.REMOVE);
      this._cachedBlendMode = tempBlendMode;

      this._isErasing = true;
    }
  }

  noErase() {
    if (this._isErasing) {
      this.drawingContext.fillStyle = this.states._cachedFillStyle;
      this.drawingContext.strokeStyle = this.states._cachedStrokeStyle;

      this.blendMode(this._cachedBlendMode);
      this._isErasing = false;
    }
  }

  drawShape(shape) {
    const visitor = new PrimitiveToPath2DConverter({ strokeWeight: this.states.strokeWeight });
    shape.accept(visitor);
    if (this._clipping) {
      this.clipPath.addPath(visitor.path);
      this.clipPath.closePath();
    } else {
      if (this.states.fillColor) {
        this.drawingContext.fill(visitor.path);
      }
      if (this.states.strokeColor) {
        this.drawingContext.stroke(visitor.path);
      }
    }
  }

  beginClip(options = {}) {
    super.beginClip(options);

    // cache the fill style
    this.states.setValue('_cachedFillStyle', this.drawingContext.fillStyle);
    const newFill = this._pInst.color(255, 0).toString();
    this.drawingContext.fillStyle = newFill;

    // cache the stroke style
    this.states.setValue('_cachedStrokeStyle', this.drawingContext.strokeStyle);
    const newStroke = this._pInst.color(255, 0).toString();
    this.drawingContext.strokeStyle = newStroke;

    // cache blendMode
    const tempBlendMode = this._cachedBlendMode;
    this.blendMode(constants.BLEND);
    this._cachedBlendMode = tempBlendMode;

    // Since everything must be in one path, create a new single Path2D to chain all shapes onto.
    // Start a new path. Everything from here on out should become part of this
    // one path so that we can clip to the whole thing.
    this.clipPath = new Path2D();

    if (this._clipInvert) {
      // Slight hack: draw a big rectangle over everything with reverse winding
      // order. This is hopefully large enough to cover most things.
      this.clipPath.moveTo(
        -2 * this.width,
        -2 * this.height
      );
      this.clipPath.lineTo(
        -2 * this.width,
        2 * this.height
      );
      this.clipPath.lineTo(
        2 * this.width,
        2 * this.height
      );
      this.clipPath.lineTo(
        2 * this.width,
        -2 * this.height
      );
      this.clipPath.closePath();
    }
  }

  endClip() {
    this.drawingContext.clip(this.clipPath);
    this.clipPath = null;

    super.endClip();

    this.drawingContext.fillStyle = this.states._cachedFillStyle;
    this.drawingContext.strokeStyle = this.states._cachedStrokeStyle;

    this.blendMode(this._cachedBlendMode);
  }

  //////////////////////////////////////////////
  // IMAGE | Loading & Displaying
  //////////////////////////////////////////////

  image(
    img,
    sx,
    sy,
    sWidth,
    sHeight,
    dx,
    dy,
    dWidth,
    dHeight
  ) {
    let cnv;
    if (img.gifProperties) {
      img._animateGif(this._pInst);
    }

    try {
      if (img instanceof MediaElement) {
        img._ensureCanvas();
      }
      if (this.states.tint && img.canvas) {
        cnv = this._getTintedImageCanvas(img);
      }
      if (!cnv) {
        cnv = img.canvas || img.elt;
      }
      let s = 1;
      if (img.width && img.width > 0) {
        s = cnv.width / img.width;
      }
      if (this._isErasing) {
        this.blendMode(this._cachedBlendMode);
      }

      this.drawingContext.drawImage(
        cnv,
        s * sx,
        s * sy,
        s * sWidth,
        s * sHeight,
        dx,
        dy,
        dWidth,
        dHeight
      );
      if (this._isErasing) {
        this._pInst.erase();
      }
    } catch (e) {
      if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
        throw e;
      }
    }
  }

  _getTintedImageCanvas(img) {
    if (!img.canvas) {
      return img;
    }

    if (!img.tintCanvas) {
      // Once an image has been tinted, keep its tint canvas
      // around so we don't need to re-incur the cost of
      // creating a new one for each tint
      img.tintCanvas = document.createElement('canvas');
    }

    // Keep the size of the tint canvas up-to-date
    if (img.tintCanvas.width !== img.canvas.width) {
      img.tintCanvas.width = img.canvas.width;
    }
    if (img.tintCanvas.height !== img.canvas.height) {
      img.tintCanvas.height = img.canvas.height;
    }

    // Goal: multiply the r,g,b,a values of the source by
    // the r,g,b,a values of the tint color
    const ctx = img.tintCanvas.getContext('2d');

    ctx.save();
    ctx.clearRect(0, 0, img.canvas.width, img.canvas.height);

    if (this.states.tint[0] < 255 || this.states.tint[1] < 255 || this.states.tint[2] < 255) {
      // Color tint: we need to use the multiply blend mode to change the colors.
      // However, the canvas implementation of this destroys the alpha channel of
      // the image. To accommodate, we first get a version of the image with full
      // opacity everywhere, tint using multiply, and then use the destination-in
      // blend mode to restore the alpha channel again.

      // Start with the original image
      ctx.drawImage(img.canvas, 0, 0);

      // This blend mode makes everything opaque but forces the luma to match
      // the original image again
      ctx.globalCompositeOperation = 'luminosity';
      ctx.drawImage(img.canvas, 0, 0);

      // This blend mode forces the hue and chroma to match the original image.
      // After this we should have the original again, but with full opacity.
      ctx.globalCompositeOperation = 'color';
      ctx.drawImage(img.canvas, 0, 0);

      // Apply color tint
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgb(${this.states.tint.slice(0, 3).join(', ')})`;
      ctx.fillRect(0, 0, img.canvas.width, img.canvas.height);

      // Replace the alpha channel with the original alpha * the alpha tint
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = this.states.tint[3] / 255;
      ctx.drawImage(img.canvas, 0, 0);
    } else {
      // If we only need to change the alpha, we can skip all the extra work!
      ctx.globalAlpha = this.states.tint[3] / 255;
      ctx.drawImage(img.canvas, 0, 0);
    }

    ctx.restore();
    return img.tintCanvas;
  }

  //////////////////////////////////////////////
  // IMAGE | Pixels
  //////////////////////////////////////////////

  blendMode(mode) {
    if (mode === constants.SUBTRACT) {
      console.warn('blendMode(SUBTRACT) only works in WEBGL mode.');
    } else if (
      mode === constants.BLEND ||
      mode === constants.REMOVE ||
      mode === constants.DARKEST ||
      mode === constants.LIGHTEST ||
      mode === constants.DIFFERENCE ||
      mode === constants.MULTIPLY ||
      mode === constants.EXCLUSION ||
      mode === constants.SCREEN ||
      mode === constants.REPLACE ||
      mode === constants.OVERLAY ||
      mode === constants.HARD_LIGHT ||
      mode === constants.SOFT_LIGHT ||
      mode === constants.DODGE ||
      mode === constants.BURN ||
      mode === constants.ADD
    ) {
      this._cachedBlendMode = mode;
      this.drawingContext.globalCompositeOperation = mode;
    } else {
      throw new Error(`Mode ${mode} not recognized.`);
    }
  }

  blend(...args) {
    const currBlend = this.drawingContext.globalCompositeOperation;
    const blendMode = args[args.length - 1];

    const copyArgs = Array.prototype.slice.call(args, 0, args.length - 1);

    this.drawingContext.globalCompositeOperation = blendMode;

    p5.prototype.copy.apply(this, copyArgs);

    this.drawingContext.globalCompositeOperation = currBlend;
  }

  // p5.Renderer2D.prototype.get = p5.Renderer.prototype.get;
  // .get() is not overridden

  // x,y are canvas-relative (pre-scaled by _pixelDensity)
  _getPixel(x, y) {
    let imageData, index;
    imageData = this.drawingContext.getImageData(x, y, 1, 1).data;
    index = 0;
    return [
      imageData[index + 0],
      imageData[index + 1],
      imageData[index + 2],
      imageData[index + 3]
    ];
  }

  loadPixels() {
    const pd = this._pixelDensity;
    const w = this.width * pd;
    const h = this.height * pd;
    const imageData = this.drawingContext.getImageData(0, 0, w, h);
    // @todo this should actually set pixels per object, so diff buffers can
    // have diff pixel arrays.
    this.imageData = imageData;
    this.pixels = imageData.data;
  }

  set(x, y, imgOrCol) {
    // round down to get integer numbers
    x = Math.floor(x);
    y = Math.floor(y);
    if (imgOrCol instanceof Image) {
      this.drawingContext.save();
      this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
      this.drawingContext.scale(
        this._pixelDensity,
        this._pixelDensity
      );
      this.drawingContext.clearRect(x, y, imgOrCol.width, imgOrCol.height);
      this.drawingContext.drawImage(imgOrCol.canvas, x, y);
      this.drawingContext.restore();
    } else {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      let idx =
        4 *
        (y *
          this._pixelDensity *
          (this.width * this._pixelDensity) +
          x * this._pixelDensity);
      if (!this.imageData) {
        this.loadPixels();
      }
      if (typeof imgOrCol === 'number') {
        if (idx < this.pixels.length) {
          r = imgOrCol;
          g = imgOrCol;
          b = imgOrCol;
          a = 255;
          //this.updatePixels.call(this);
        }
      } else if (Array.isArray(imgOrCol)) {
        if (imgOrCol.length < 4) {
          throw new Error('pixel array must be of the form [R, G, B, A]');
        }
        if (idx < this.pixels.length) {
          r = imgOrCol[0];
          g = imgOrCol[1];
          b = imgOrCol[2];
          a = imgOrCol[3];
          //this.updatePixels.call(this);
        }
      } else if (imgOrCol instanceof p5.Color) {
        if (idx < this.pixels.length) {
          [r, g, b, a] = imgOrCol._getRGBA([255, 255, 255, 255]);
          //this.updatePixels.call(this);
        }
      }
      // loop over pixelDensity * pixelDensity
      for (let i = 0; i < this._pixelDensity; i++) {
        for (let j = 0; j < this._pixelDensity; j++) {
          // loop over
          idx =
            4 *
            ((y * this._pixelDensity + j) *
              this.width *
              this._pixelDensity +
              (x * this._pixelDensity + i));
          this.pixels[idx] = r;
          this.pixels[idx + 1] = g;
          this.pixels[idx + 2] = b;
          this.pixels[idx + 3] = a;
        }
      }
    }
  }

  updatePixels(x, y, w, h) {
    const pd = this._pixelDensity;
    if (
      x === undefined &&
      y === undefined &&
      w === undefined &&
      h === undefined
    ) {
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    }
    x *= pd;
    y *= pd;
    w *= pd;
    h *= pd;

    if (this.gifProperties) {
      this.gifProperties.frames[this.gifProperties.displayIndex].image =
        this.imageData;
    }

    this.drawingContext.putImageData(this.imageData, 0, 0, x, y, w, h);
  }

  //////////////////////////////////////////////
  // SHAPE | 2D Primitives
  //////////////////////////////////////////////

  /*
   * This function requires that:
   *
   *   0 <= start < TWO_PI
   *
   *   start <= stop < start + TWO_PI
   */
  arc(x, y, w, h, start, stop, mode) {
    const ctx = this.clipPa || this.drawingContext;
    const rx = w / 2.0;
    const ry = h / 2.0;
    const epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
    let arcToDraw = 0;
    const curves = [];

    const centerX = x + w / 2,
      centerY = y + h / 2,
      radiusX = w / 2,
      radiusY = h / 2;

    // Determines whether to add a line to the center, which should be done
    // when the mode is PIE or default; as well as when the start and end
    // angles do not form a full circle.
    const createPieSlice = ! (
      mode === constants.CHORD ||
      mode === constants.OPEN ||
      (stop - start) % constants.TWO_PI === 0
    );

    // Fill curves
    if (this.states.fillColor) {
      if (!this._clipping) ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, start, stop);
      if (createPieSlice) ctx.lineTo(centerX, centerY);
      ctx.closePath();
      if (!this._clipping) ctx.fill();
    }

    // Stroke curves
    if (this.states.strokeColor) {
      if (!this._clipping) ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, start, stop);

      if (mode === constants.PIE && createPieSlice) {
        // In PIE mode, stroke is added to the center and back to path,
        // unless the pie forms a complete ellipse (see: createPieSlice)
        ctx.lineTo(centerX, centerY);
      }

      if (mode === constants.PIE || mode === constants.CHORD) {
        // Stroke connects back to path begin for both PIE and CHORD
        ctx.closePath();
      }

      if (!this._clipping) ctx.stroke();
    }

    return this;

  }

  ellipse(args) {
    const ctx = this.clipPath || this.drawingContext;
    const doFill = !!this.states.fillColor,
      doStroke = this.states.strokeColor;
    const x = parseFloat(args[0]),
      y = parseFloat(args[1]),
      w = parseFloat(args[2]),
      h = parseFloat(args[3]);
    if (doFill && !doStroke) {
      if (this._getFill() === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (this._getStroke() === styleEmpty) {
        return this;
      }
    }
    const centerX = x + w / 2,
      centerY = y + h / 2,
      radiusX = w / 2,
      radiusY = h / 2;
    if (!this._clipping) ctx.beginPath();

    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.closePath();

    if (!this._clipping && doFill) {
      ctx.fill();
    }
    if (!this._clipping && doStroke) {
      ctx.stroke();
    }
  }

  line(x1, y1, x2, y2) {
    const ctx = this.clipPath || this.drawingContext;
    if (!this.states.strokeColor) {
      return this;
    } else if (this._getStroke() === styleEmpty) {
      return this;
    }
    if (!this._clipping) ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return this;
  }

  point(x, y) {
    const ctx = this.clipPath || this.drawingContext;
    if (!this.states.strokeColor) {
      return this;
    } else if (this._getStroke() === styleEmpty) {
      return this;
    }
    const s = this._getStroke();
    const f = this._getFill();
    if (!this._clipping) {
      // swapping fill color to stroke and back after for correct point rendering
      this._setFill(s);
    }
    if (!this._clipping) ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, constants.TWO_PI, false);
    if (!this._clipping) {
      ctx.fill();
      this._setFill(f);
    }
  }

  quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    const ctx = this.clipPath || this.drawingContext;
    const doFill = !!this.states.fillColor,
      doStroke = this.states.strokeColor;
    if (doFill && !doStroke) {
      if (this._getFill() === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (this._getStroke() === styleEmpty) {
        return this;
      }
    }
    if (!this._clipping) ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    if (!this._clipping && doFill) {
      ctx.fill();
    }
    if (!this._clipping && doStroke) {
      ctx.stroke();
    }
    return this;
  }

  rect(args) {
    const x = args[0];
    const y = args[1];
    const w = args[2];
    const h = args[3];
    let tl = args[4];
    let tr = args[5];
    let br = args[6];
    let bl = args[7];
    const ctx = this.clipPath || this.drawingContext;
    const doFill = !!this.states.fillColor,
      doStroke = this.states.strokeColor;
    if (doFill && !doStroke) {
      if (this._getFill() === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (this._getStroke() === styleEmpty) {
        return this;
      }
    }
    if (!this._clipping) ctx.beginPath();

    if (typeof tl === 'undefined') {
      // No rounded corners
      ctx.rect(x, y, w, h);
    } else {
      // At least one rounded corner
      // Set defaults when not specified
      if (typeof tr === 'undefined') {
        tr = tl;
      }
      if (typeof br === 'undefined') {
        br = tr;
      }
      if (typeof bl === 'undefined') {
        bl = br;
      }

      // corner rounding must always be positive
      const absW = Math.abs(w);
      const absH = Math.abs(h);
      const hw = absW / 2;
      const hh = absH / 2;

      // Clip radii
      if (absW < 2 * tl) {
        tl = hw;
      }
      if (absH < 2 * tl) {
        tl = hh;
      }
      if (absW < 2 * tr) {
        tr = hw;
      }
      if (absH < 2 * tr) {
        tr = hh;
      }
      if (absW < 2 * br) {
        br = hw;
      }
      if (absH < 2 * br) {
        br = hh;
      }
      if (absW < 2 * bl) {
        bl = hw;
      }
      if (absH < 2 * bl) {
        bl = hh;
      }

      ctx.roundRect(x, y, w, h, [tl, tr, br, bl]);
    }
    if (!this._clipping && this.states.fillColor) {
      ctx.fill();
    }
    if (!this._clipping && this.states.strokeColor) {
      ctx.stroke();
    }
    return this;
  }


  triangle(args) {
    const ctx = this.clipPath || this.drawingContext;
    const doFill = !!this.states.fillColor,
      doStroke = this.states.strokeColor;
    const x1 = args[0],
      y1 = args[1];
    const x2 = args[2],
      y2 = args[3];
    const x3 = args[4],
      y3 = args[5];
    if (doFill && !doStroke) {
      if (this._getFill() === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (this._getStroke() === styleEmpty) {
        return this;
      }
    }
    if (!this._clipping) ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    if (!this._clipping && doFill) {
      ctx.fill();
    }
    if (!this._clipping && doStroke) {
      ctx.stroke();
    }
  }

  //////////////////////////////////////////////
  // SHAPE | Attributes
  //////////////////////////////////////////////

  strokeCap(cap) {
    if (
      cap === constants.ROUND ||
      cap === constants.SQUARE ||
      cap === constants.PROJECT
    ) {
      this.drawingContext.lineCap = cap;
    }
    return this;
  }

  strokeJoin(join) {
    if (
      join === constants.ROUND ||
      join === constants.BEVEL ||
      join === constants.MITER
    ) {
      this.drawingContext.lineJoin = join;
    }
    return this;
  }

  strokeWeight(w) {
    super.strokeWeight(w);
    if (typeof w === 'undefined' || w === 0) {
      // hack because lineWidth 0 doesn't work
      this.drawingContext.lineWidth = 0.0001;
    } else {
      this.drawingContext.lineWidth = w;
    }
    return this;
  }

  _getFill() {
    if (!this.states._cachedFillStyle) {
      this.states.setValue('_cachedFillStyle', this.drawingContext.fillStyle);
    }
    return this.states._cachedFillStyle;
  }

  _setFill(fillStyle) {
    if (fillStyle !== this.states._cachedFillStyle) {
      this.drawingContext.fillStyle = fillStyle;
      this.states.setValue('_cachedFillStyle', fillStyle);
    }
  }

  _getStroke() {
    if (!this.states._cachedStrokeStyle) {
      this.states.setValue('_cachedStrokeStyle', this.drawingContext.strokeStyle);
    }
    return this.states._cachedStrokeStyle;
  }

  _setStroke(strokeStyle) {
    if (strokeStyle !== this.states._cachedStrokeStyle) {
      this.drawingContext.strokeStyle = strokeStyle;
      this.states.setValue('_cachedStrokeStyle', strokeStyle);
    }
  }

  //////////////////////////////////////////////
  // TRANSFORM
  //////////////////////////////////////////////

  applyMatrix(a, b, c, d, e, f) {
    this.drawingContext.transform(a, b, c, d, e, f);
  }

  getWorldToScreenMatrix() {
    let domMatrix = new DOMMatrix()
      .scale(1 / this._pixelDensity)
      .multiply(this.drawingContext.getTransform());
    return new Matrix(domMatrix.toFloat32Array());
  }

  resetMatrix() {
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(
      this._pixelDensity,
      this._pixelDensity
    );
    return this;
  }

  rotate(rad) {
    this.drawingContext.rotate(rad);
  }

  scale(x, y) {
    this.drawingContext.scale(x, y);
    return this;
  }

  translate(x, y) {
    // support passing a vector as the 1st parameter
    if (x instanceof p5.Vector) {
      y = x.y;
      x = x.x;
    }
    this.drawingContext.translate(x, y);
    return this;
  }

  //////////////////////////////////////////////
  // TYPOGRAPHY (see src/type/textCore.js)
  //////////////////////////////////////////////

  //////////////////////////////////////////////
  // STRUCTURE
  //////////////////////////////////////////////

  // a push() operation is in progress.
  // the renderer should return a 'style' object that it wishes to
  // store on the push stack.
  // derived renderers should call the base class' push() method
  // to fetch the base style object.
  push() {
    this.drawingContext.save();

    // get the base renderer style
    return super.push();
  }

  // a pop() operation is in progress
  // the renderer is passed the 'style' object that it returned
  // from its push() method.
  // derived renderers should pass this object to their base
  // class' pop method
  pop(style) {
    this.drawingContext.restore();

    super.pop(style);
  }
}

function renderer2D(p5, fn){
  /**
   * p5.Renderer2D
   * The 2D graphics canvas renderer class.
   * extends p5.Renderer
   * @private
   */
  p5.Renderer2D = Renderer2D;
  p5.renderers[constants.P2D] = Renderer2D;
  p5.renderers['p2d-hdr'] = new Proxy(Renderer2D, {
    construct(target, [pInst, w, h, isMainCanvas, elt]){
      return new target(pInst, w, h, isMainCanvas, elt, {colorSpace: "display-p3"})
    }
  })
}

export default renderer2D;
export { Renderer2D };
