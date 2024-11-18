import * as constants from './constants';
import p5 from './main';
import { Renderer } from './p5.Renderer';
import { Graphics } from './p5.Graphics';
import { Image } from '../image/p5.Image';
import { Element } from '../dom/p5.Element';
import { MediaElement } from '../dom/p5.MediaElement';

const styleEmpty = 'rgba(0,0,0,0)';
// const alphaThreshold = 0.00125; // minimum visible

class Renderer2D extends Renderer {
  constructor(pInst, w, h, isMainCanvas, elt) {
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
    // this.wrappedElt = new p5.Element(elt, pInst);
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
    this.drawingContext = this.canvas.getContext('2d');
    if (isMainCanvas) {
      this._pInst.drawingContext = this.drawingContext;
    }
    this.scale(this._pixelDensity, this._pixelDensity);

    // Set and return p5.Element
    this.wrappedElt = new Element(this.elt, this._pInst);
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
    this._cachedFillStyle = this._cachedStrokeStyle = undefined;
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
    this.drawingContext.save();
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
      const curFill = this._getFill();
      // create background rect
      const color = this._pInst.color(...args);

      //accessible Outputs
      if (this._pInst._addAccsOutput()) {
        this._pInst._accsBackground(color.levels);
      }

      const newFill = color.toString();
      this._setFill(newFill);

      if (this._isErasing) {
        this.blendMode(this._cachedBlendMode);
      }

      this.drawingContext.fillRect(0, 0, this.width, this.height);
      // reset fill
      this._setFill(curFill);

      if (this._isErasing) {
        this._pInst.erase();
      }
    }
    this.drawingContext.restore();
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
      this._pInst._accsCanvasColors('fill', color.levels);
    }
  }

  stroke(...args) {
    super.stroke(...args);
    const color = this.states.strokeColor;
    this._setStroke(color.toString());

    //accessible Outputs
    if (this._pInst._addAccsOutput()) {
      this._pInst._accsCanvasColors('stroke', color.levels);
    }
  }

  erase(opacityFill, opacityStroke) {
    if (!this._isErasing) {
      // cache the fill style
      this._cachedFillStyle = this.drawingContext.fillStyle;
      const newFill = this._pInst.color(255, opacityFill).toString();
      this.drawingContext.fillStyle = newFill;

      // cache the stroke style
      this._cachedStrokeStyle = this.drawingContext.strokeStyle;
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
      this.drawingContext.fillStyle = this._cachedFillStyle;
      this.drawingContext.strokeStyle = this._cachedStrokeStyle;

      this.blendMode(this._cachedBlendMode);
      this._isErasing = false;
    }
  }

  beginClip(options = {}) {
    super.beginClip(options);

    // cache the fill style
    this._cachedFillStyle = this.drawingContext.fillStyle;
    const newFill = this._pInst.color(255, 0).toString();
    this.drawingContext.fillStyle = newFill;

    // cache the stroke style
    this._cachedStrokeStyle = this.drawingContext.strokeStyle;
    const newStroke = this._pInst.color(255, 0).toString();
    this.drawingContext.strokeStyle = newStroke;

    // cache blendMode
    const tempBlendMode = this._cachedBlendMode;
    this.blendMode(constants.BLEND);
    this._cachedBlendMode = tempBlendMode;

    // Start a new path. Everything from here on out should become part of this
    // one path so that we can clip to the whole thing.
    this.drawingContext.beginPath();

    if (this._clipInvert) {
      // Slight hack: draw a big rectangle over everything with reverse winding
      // order. This is hopefully large enough to cover most things.
      this.drawingContext.moveTo(
        -2 * this.width,
        -2 * this.height
      );
      this.drawingContext.lineTo(
        -2 * this.width,
        2 * this.height
      );
      this.drawingContext.lineTo(
        2 * this.width,
        2 * this.height
      );
      this.drawingContext.lineTo(
        2 * this.width,
        -2 * this.height
      );
      this.drawingContext.closePath();
    }
  }

  endClip() {
    this._doFillStrokeClose();
    this.drawingContext.clip();

    super.endClip();

    this.drawingContext.fillStyle = this._cachedFillStyle;
    this.drawingContext.strokeStyle = this._cachedStrokeStyle;

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
          r = imgOrCol.levels[0];
          g = imgOrCol.levels[1];
          b = imgOrCol.levels[2];
          a = imgOrCol.levels[3];
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

    this.drawingContext.putImageData(this.imageData, x, y, 0, 0, w, h);
  }

  //////////////////////////////////////////////
  // SHAPE | 2D Primitives
  //////////////////////////////////////////////

  /**
 * Generate a cubic Bezier representing an arc on the unit circle of total
 * angle `size` radians, beginning `start` radians above the x-axis. Up to
 * four of these curves are combined to make a full arc.
 *
 * See ecridge.com/bezier.pdf for an explanation of the method.
 */
  _acuteArcToBezier(
    start,
    size
  ) {
    // Evaluate constants.
    const alpha = size / 2.0,
      cos_alpha = Math.cos(alpha),
      sin_alpha = Math.sin(alpha),
      cot_alpha = 1.0 / Math.tan(alpha),
      // This is how far the arc needs to be rotated.
      phi = start + alpha,
      cos_phi = Math.cos(phi),
      sin_phi = Math.sin(phi),
      lambda = (4.0 - cos_alpha) / 3.0,
      mu = sin_alpha + (cos_alpha - lambda) * cot_alpha;

    // Return rotated waypoints.
    return {
      ax: Math.cos(start).toFixed(7),
      ay: Math.sin(start).toFixed(7),
      bx: (lambda * cos_phi + mu * sin_phi).toFixed(7),
      by: (lambda * sin_phi - mu * cos_phi).toFixed(7),
      cx: (lambda * cos_phi - mu * sin_phi).toFixed(7),
      cy: (lambda * sin_phi + mu * cos_phi).toFixed(7),
      dx: Math.cos(start + size).toFixed(7),
      dy: Math.sin(start + size).toFixed(7)
    };
  }

  /*
   * This function requires that:
   *
   *   0 <= start < TWO_PI
   *
   *   start <= stop < start + TWO_PI
   */
  arc(x, y, w, h, start, stop, mode) {
    const ctx = this.drawingContext;
    const rx = w / 2.0;
    const ry = h / 2.0;
    const epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
    let arcToDraw = 0;
    const curves = [];

    x += rx;
    y += ry;

    // Create curves
    while (stop - start >= epsilon) {
      arcToDraw = Math.min(stop - start, constants.HALF_PI);
      curves.push(this._acuteArcToBezier(start, arcToDraw));
      start += arcToDraw;
    }

    // Fill curves
    if (this.states.fillColor) {
      if (!this._clipping) ctx.beginPath();
      curves.forEach((curve, index) => {
        if (index === 0) {
          ctx.moveTo(x + curve.ax * rx, y + curve.ay * ry);
        }
        /* eslint-disable indent */
        ctx.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
          x + curve.cx * rx, y + curve.cy * ry,
          x + curve.dx * rx, y + curve.dy * ry);
        /* eslint-enable indent */
      });
      if (mode === constants.PIE || mode == null) {
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (!this._clipping) ctx.fill();
    }

    // Stroke curves
    if (this.states.strokeColor) {
      if (!this._clipping) ctx.beginPath();
      curves.forEach((curve, index) => {
        if (index === 0) {
          ctx.moveTo(x + curve.ax * rx, y + curve.ay * ry);
        }
        /* eslint-disable indent */
        ctx.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
          x + curve.cx * rx, y + curve.cy * ry,
          x + curve.dx * rx, y + curve.dy * ry);
        /* eslint-enable indent */
      });
      if (mode === constants.PIE) {
        ctx.lineTo(x, y);
        ctx.closePath();
      } else if (mode === constants.CHORD) {
        ctx.closePath();
      }
      if (!this._clipping) ctx.stroke();
    }
    return this;
  }

  ellipse(args) {
    const ctx = this.drawingContext;
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

    if (!this._clipping && doFill) {
      ctx.fill();
    }
    if (!this._clipping && doStroke) {
      ctx.stroke();
    }
  }

  line(x1, y1, x2, y2) {
    const ctx = this.drawingContext;
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
    const ctx = this.drawingContext;
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
    const ctx = this.drawingContext;
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
    const ctx = this.drawingContext;
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

      // Draw shape
      if (!this._clipping) ctx.beginPath();
      ctx.moveTo(x + tl, y);
      ctx.arcTo(x + w, y, x + w, y + h, tr);
      ctx.arcTo(x + w, y + h, x, y + h, br);
      ctx.arcTo(x, y + h, x, y, bl);
      ctx.arcTo(x, y, x + w, y, tl);
      ctx.closePath();
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
    const ctx = this.drawingContext;
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

  endShape(
    mode,
    vertices,
    isCurve,
    isBezier,
    isQuadratic,
    isContour,
    shapeKind
  ) {
    if (vertices.length === 0) {
      return this;
    }
    if (!this.states.strokeColor && !this.states.fillColor) {
      return this;
    }
    const closeShape = mode === constants.CLOSE;
    let v;
    if (closeShape && !isContour) {
      vertices.push(vertices[0]);
    }
    let i, j;
    const numVerts = vertices.length;
    if (isCurve && shapeKind === null) {
      if (numVerts > 3) {
        const b = [],
          s = 1 - this._curveTightness;
        if (!this._clipping) this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[1][0], vertices[1][1]);
        for (i = 1; i + 2 < numVerts; i++) {
          v = vertices[i];
          b[0] = [v[0], v[1]];
          b[1] = [
            v[0] + (s * vertices[i + 1][0] - s * vertices[i - 1][0]) / 6,
            v[1] + (s * vertices[i + 1][1] - s * vertices[i - 1][1]) / 6
          ];
          b[2] = [
            vertices[i + 1][0] +
            (s * vertices[i][0] - s * vertices[i + 2][0]) / 6,
            vertices[i + 1][1] +
            (s * vertices[i][1] - s * vertices[i + 2][1]) / 6
          ];
          b[3] = [vertices[i + 1][0], vertices[i + 1][1]];
          this.drawingContext.bezierCurveTo(
            b[1][0],
            b[1][1],
            b[2][0],
            b[2][1],
            b[3][0],
            b[3][1]
          );
        }
        if (closeShape) {
          this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
        }
        this._doFillStrokeClose(closeShape);
      }
    } else if (
      isBezier &&
      shapeKind === null
    ) {
      if (!this._clipping) this.drawingContext.beginPath();
      for (i = 0; i < numVerts; i++) {
        if (vertices[i].isVert) {
          if (vertices[i].moveTo) {
            this.drawingContext.moveTo(vertices[i][0], vertices[i][1]);
          } else {
            this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
          }
        } else {
          this.drawingContext.bezierCurveTo(
            vertices[i][0],
            vertices[i][1],
            vertices[i][2],
            vertices[i][3],
            vertices[i][4],
            vertices[i][5]
          );
        }
      }
      this._doFillStrokeClose(closeShape);
    } else if (
      isQuadratic &&
      shapeKind === null
    ) {
      if (!this._clipping) this.drawingContext.beginPath();
      for (i = 0; i < numVerts; i++) {
        if (vertices[i].isVert) {
          if (vertices[i].moveTo) {
            this.drawingContext.moveTo(vertices[i][0], vertices[i][1]);
          } else {
            this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
          }
        } else {
          this.drawingContext.quadraticCurveTo(
            vertices[i][0],
            vertices[i][1],
            vertices[i][2],
            vertices[i][3]
          );
        }
      }
      this._doFillStrokeClose(closeShape);
    } else {
      if (shapeKind === constants.POINTS) {
        for (i = 0; i < numVerts; i++) {
          v = vertices[i];
          if (this.states.strokeColor) {
            this._pInst.stroke(v[6]);
          }
          this._pInst.point(v[0], v[1]);
        }
      } else if (shapeKind === constants.LINES) {
        for (i = 0; i + 1 < numVerts; i += 2) {
          v = vertices[i];
          if (this.states.strokeColor) {
            this._pInst.stroke(vertices[i + 1][6]);
          }
          this._pInst.line(v[0], v[1], vertices[i + 1][0], vertices[i + 1][1]);
        }
      } else if (shapeKind === constants.TRIANGLES) {
        for (i = 0; i + 2 < numVerts; i += 3) {
          v = vertices[i];
          if (!this._clipping) this.drawingContext.beginPath();
          this.drawingContext.moveTo(v[0], v[1]);
          this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
          this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
          this.drawingContext.closePath();
          if (!this._clipping && this.states.fillColor) {
            this._pInst.fill(vertices[i + 2][5]);
            this.drawingContext.fill();
          }
          if (!this._clipping && this.states.strokeColor) {
            this._pInst.stroke(vertices[i + 2][6]);
            this.drawingContext.stroke();
          }
        }
      } else if (shapeKind === constants.TRIANGLE_STRIP) {
        for (i = 0; i + 1 < numVerts; i++) {
          v = vertices[i];
          if (!this._clipping) this.drawingContext.beginPath();
          this.drawingContext.moveTo(vertices[i + 1][0], vertices[i + 1][1]);
          this.drawingContext.lineTo(v[0], v[1]);
          if (!this._clipping && this.states.strokeColor) {
            this._pInst.stroke(vertices[i + 1][6]);
          }
          if (!this._clipping && this.states.fillColor) {
            this._pInst.fill(vertices[i + 1][5]);
          }
          if (i + 2 < numVerts) {
            this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
            if (!this._clipping && this.states.strokeColor) {
              this._pInst.stroke(vertices[i + 2][6]);
            }
            if (!this._clipping && this.states.fillColor) {
              this._pInst.fill(vertices[i + 2][5]);
            }
          }
          this._doFillStrokeClose(closeShape);
        }
      } else if (shapeKind === constants.TRIANGLE_FAN) {
        if (numVerts > 2) {
          // For performance reasons, try to batch as many of the
          // fill and stroke calls as possible.
          if (!this._clipping) this.drawingContext.beginPath();
          for (i = 2; i < numVerts; i++) {
            v = vertices[i];
            this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
            this.drawingContext.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
            this.drawingContext.lineTo(v[0], v[1]);
            this.drawingContext.lineTo(vertices[0][0], vertices[0][1]);
            // If the next colour is going to be different, stroke / fill now
            if (i < numVerts - 1) {
              if (
                (this.states.fillColor && v[5] !== vertices[i + 1][5]) ||
                (this.states.strokeColor && v[6] !== vertices[i + 1][6])
              ) {
                if (!this._clipping && this.states.fillColor) {
                  this._pInst.fill(v[5]);
                  this.drawingContext.fill();
                  this._pInst.fill(vertices[i + 1][5]);
                }
                if (!this._clipping && this.states.strokeColor) {
                  this._pInst.stroke(v[6]);
                  this.drawingContext.stroke();
                  this._pInst.stroke(vertices[i + 1][6]);
                }
                this.drawingContext.closePath();
                if (!this._clipping) this.drawingContext.beginPath(); // Begin the next one
              }
            }
          }
          this._doFillStrokeClose(closeShape);
        }
      } else if (shapeKind === constants.QUADS) {
        for (i = 0; i + 3 < numVerts; i += 4) {
          v = vertices[i];
          if (!this._clipping) this.drawingContext.beginPath();
          this.drawingContext.moveTo(v[0], v[1]);
          for (j = 1; j < 4; j++) {
            this.drawingContext.lineTo(vertices[i + j][0], vertices[i + j][1]);
          }
          this.drawingContext.lineTo(v[0], v[1]);
          if (!this._clipping && this.states.fillColor) {
            this._pInst.fill(vertices[i + 3][5]);
          }
          if (!this._clipping && this.states.strokeColor) {
            this._pInst.stroke(vertices[i + 3][6]);
          }
          this._doFillStrokeClose(closeShape);
        }
      } else if (shapeKind === constants.QUAD_STRIP) {
        if (numVerts > 3) {
          for (i = 0; i + 1 < numVerts; i += 2) {
            v = vertices[i];
            if (!this._clipping) this.drawingContext.beginPath();
            if (i + 3 < numVerts) {
              this.drawingContext.moveTo(
                vertices[i + 2][0], vertices[i + 2][1]);
              this.drawingContext.lineTo(v[0], v[1]);
              this.drawingContext.lineTo(
                vertices[i + 1][0], vertices[i + 1][1]);
              this.drawingContext.lineTo(
                vertices[i + 3][0], vertices[i + 3][1]);
              if (!this._clipping && this.states.fillColor) {
                this._pInst.fill(vertices[i + 3][5]);
              }
              if (!this._clipping && this.states.strokeColor) {
                this._pInst.stroke(vertices[i + 3][6]);
              }
            } else {
              this.drawingContext.moveTo(v[0], v[1]);
              this.drawingContext.lineTo(
                vertices[i + 1][0], vertices[i + 1][1]);
            }
            this._doFillStrokeClose(closeShape);
          }
        }
      } else {
        if (!this._clipping) this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
        for (i = 1; i < numVerts; i++) {
          v = vertices[i];
          if (v.isVert) {
            if (v.moveTo) {
              if (closeShape) this.drawingContext.closePath();
              this.drawingContext.moveTo(v[0], v[1]);
            } else {
              this.drawingContext.lineTo(v[0], v[1]);
            }
          }
        }
        this._doFillStrokeClose(closeShape);
      }
    }
    isCurve = false;
    isBezier = false;
    isQuadratic = false;
    isContour = false;
    if (closeShape) {
      vertices.pop();
    }

    return this;
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
    if (typeof w === 'undefined' || w === 0) {
      // hack because lineWidth 0 doesn't work
      this.drawingContext.lineWidth = 0.0001;
    } else {
      this.drawingContext.lineWidth = w;
    }
    return this;
  }

  _getFill() {
    if (!this._cachedFillStyle) {
      this._cachedFillStyle = this.drawingContext.fillStyle;
    }
    return this._cachedFillStyle;
  }

  _setFill(fillStyle) {
    if (fillStyle !== this._cachedFillStyle) {
      this.drawingContext.fillStyle = fillStyle;
      this._cachedFillStyle = fillStyle;
    }
  }

  _getStroke() {
    if (!this._cachedStrokeStyle) {
      this._cachedStrokeStyle = this.drawingContext.strokeStyle;
    }
    return this._cachedStrokeStyle;
  }

  _setStroke(strokeStyle) {
    if (strokeStyle !== this._cachedStrokeStyle) {
      this.drawingContext.strokeStyle = strokeStyle;
      this._cachedStrokeStyle = strokeStyle;
    }
  }

  //////////////////////////////////////////////
  // SHAPE | Curves
  //////////////////////////////////////////////
  bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
    this._pInst.beginShape();
    this._pInst.vertex(x1, y1);
    this._pInst.bezierVertex(x2, y2, x3, y3, x4, y4);
    this._pInst.endShape();
    return this;
  }

  curve(x1, y1, x2, y2, x3, y3, x4, y4) {
    this._pInst.beginShape();
    this._pInst.curveVertex(x1, y1);
    this._pInst.curveVertex(x2, y2);
    this._pInst.curveVertex(x3, y3);
    this._pInst.curveVertex(x4, y4);
    this._pInst.endShape();
    return this;
  }

  //////////////////////////////////////////////
  // SHAPE | Vertex
  //////////////////////////////////////////////

  _doFillStrokeClose(closeShape) {
    if (closeShape) {
      this.drawingContext.closePath();
    }
    if (!this._clipping && this.states.fillColor) {
      this.drawingContext.fill();
    }
    if (!this._clipping && this.states.strokeColor) {
      this.drawingContext.stroke();
    }
  }

  //////////////////////////////////////////////
  // TRANSFORM
  //////////////////////////////////////////////

  applyMatrix(a, b, c, d, e, f) {
    this.drawingContext.transform(a, b, c, d, e, f);
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
  // TYPOGRAPHY
  //
  //////////////////////////////////////////////



  _renderText(p, line, x, y, maxY, minY) {
    if (y < minY || y >= maxY) {
      return; // don't render lines beyond our minY/maxY bounds (see #5785)
    }

    p.push(); // fix to #803

    if (!this._isOpenType()) {
      // a system/browser font

      // no stroke unless specified by user
      if (this.states.strokeColor && this.states.strokeSet) {
        this.drawingContext.strokeText(line, x, y);
      }

      if (!this._clipping && this.states.fillColor) {
        // if fill hasn't been set by user, use default text fill
        if (!this.states.fillSet) {
          this._setFill(constants._DEFAULT_TEXT_FILL);
        }

        this.drawingContext.fillText(line, x, y);
      }
    } else {
      // an opentype font, let it handle the rendering

      this.states.textFont._renderPath(line, x, y, { renderer: this });
    }

    p.pop();
    return p;
  }

  textWidth(s) {
    if (this._isOpenType()) {
      return this.states.textFont._textWidth(s, this.states.textSize);
    }

    return this.drawingContext.measureText(s).width;
  }

  text(str, x, y, maxWidth, maxHeight) {
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

    const p = super.text(...arguments);

    if (baselineHacked) {
      this.drawingContext.textBaseline = constants.BASELINE;
    }

    return p;
  }

  _applyTextProperties() {
    let font;
    const p = this._pInst;

    this.states.textAscent = null;
    this.states.textDescent = null;

    font = this.states.textFont;

    if (this._isOpenType()) {
      font = this.states.textFont.font.familyName;
      this.states.textStyle = this._textFont.font.styleName;
    }

    let fontNameString = font || 'sans-serif';
    if (/\s/.exec(fontNameString)) {
      // If the name includes spaces, surround in quotes
      fontNameString = `"${fontNameString}"`;
    }
    this.drawingContext.font = `${this.states.textStyle || 'normal'} ${this.states.textSize ||
      12}px ${fontNameString}`;

    this.drawingContext.textAlign = this.states.textAlign;
    if (this.states.textBaseline === constants.CENTER) {
      this.drawingContext.textBaseline = constants._CTX_MIDDLE;
    } else {
      this.drawingContext.textBaseline = this.states.textBaseline;
    }

    return p;
  }

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
    // Re-cache the fill / stroke state
    this._cachedFillStyle = this.drawingContext.fillStyle;
    this._cachedStrokeStyle = this.drawingContext.strokeStyle;

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
}

export default renderer2D;
export { Renderer2D };
