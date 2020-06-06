import p5 from './main';
import * as constants from './constants';
import filters from '../image/filters';

import './p5.Renderer';

/**
 * p5.Renderer2D
 * The 2D graphics canvas renderer class.
 * extends p5.Renderer
 */
const styleEmpty = 'rgba(0,0,0,0)';
// const alphaThreshold = 0.00125; // minimum visible

p5.Renderer2D = function(elt, pInst, isMainCanvas) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this.drawingContext = this.canvas.getContext('2d');
  this._pInst._setProperty('drawingContext', this.drawingContext);
  return this;
};

p5.Renderer2D.prototype = Object.create(p5.Renderer.prototype);

p5.Renderer2D.prototype._applyDefaults = function() {
  this._cachedFillStyle = this._cachedStrokeStyle = undefined;
  this._cachedBlendMode = constants.BLEND;
  this._setFill(constants._DEFAULT_FILL);
  this._setStroke(constants._DEFAULT_STROKE);
  this.drawingContext.lineCap = constants.ROUND;
  this.drawingContext.font = 'normal 12px sans-serif';
};

p5.Renderer2D.prototype.resize = function(w, h) {
  p5.Renderer.prototype.resize.call(this, w, h);
  this.drawingContext.scale(
    this._pInst._pixelDensity,
    this._pInst._pixelDensity
  );
};

//////////////////////////////////////////////
// COLOR | Setting
//////////////////////////////////////////////

p5.Renderer2D.prototype.background = function(...args) {
  this.drawingContext.save();
  this.resetMatrix();

  if (args[0] instanceof p5.Image) {
    this._pInst.image(args[0], 0, 0, this.width, this.height);
  } else {
    const curFill = this._getFill();
    // create background rect
    const color = this._pInst.color(...args);
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
};

p5.Renderer2D.prototype.clear = function() {
  this.drawingContext.save();
  this.resetMatrix();
  this.drawingContext.clearRect(0, 0, this.width, this.height);
  this.drawingContext.restore();
};

p5.Renderer2D.prototype.fill = function(...args) {
  const color = this._pInst.color(...args);
  this._setFill(color.toString());
};

p5.Renderer2D.prototype.stroke = function(...args) {
  const color = this._pInst.color(...args);
  this._setStroke(color.toString());
};

p5.Renderer2D.prototype.erase = function(opacityFill, opacityStroke) {
  if (!this._isErasing) {
    // cache the fill style
    this._cachedFillStyle = this.drawingContext.fillStyle;
    const newFill = this._pInst.color(255, opacityFill).toString();
    this.drawingContext.fillStyle = newFill;

    //cache the stroke style
    this._cachedStrokeStyle = this.drawingContext.strokeStyle;
    const newStroke = this._pInst.color(255, opacityStroke).toString();
    this.drawingContext.strokeStyle = newStroke;

    //cache blendMode
    const tempBlendMode = this._cachedBlendMode;
    this.blendMode(constants.REMOVE);
    this._cachedBlendMode = tempBlendMode;

    this._isErasing = true;
  }
};

p5.Renderer2D.prototype.noErase = function() {
  if (this._isErasing) {
    this.drawingContext.fillStyle = this._cachedFillStyle;
    this.drawingContext.strokeStyle = this._cachedStrokeStyle;

    this.blendMode(this._cachedBlendMode);
    this._isErasing = false;
  }
};

//////////////////////////////////////////////
// IMAGE | Loading & Displaying
//////////////////////////////////////////////

p5.Renderer2D.prototype.image = function(
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
    if (this._tint) {
      if (p5.MediaElement && img instanceof p5.MediaElement) {
        img.loadPixels();
      }
      if (img.canvas) {
        cnv = this._getTintedImageCanvas(img);
      }
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
};

p5.Renderer2D.prototype._getTintedImageCanvas = function(img) {
  if (!img.canvas) {
    return img;
  }
  const pixels = filters._toPixels(img.canvas);
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = img.canvas.width;
  tmpCanvas.height = img.canvas.height;
  const tmpCtx = tmpCanvas.getContext('2d');
  const id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
  const newPixels = id.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    newPixels[i] = r * this._tint[0] / 255;
    newPixels[i + 1] = g * this._tint[1] / 255;
    newPixels[i + 2] = b * this._tint[2] / 255;
    newPixels[i + 3] = a * this._tint[3] / 255;
  }
  tmpCtx.putImageData(id, 0, 0);
  return tmpCanvas;
};

//////////////////////////////////////////////
// IMAGE | Pixels
//////////////////////////////////////////////

p5.Renderer2D.prototype.blendMode = function(mode) {
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
};

p5.Renderer2D.prototype.blend = function(...args) {
  const currBlend = this.drawingContext.globalCompositeOperation;
  const blendMode = args[args.length - 1];

  const copyArgs = Array.prototype.slice.call(args, 0, args.length - 1);

  this.drawingContext.globalCompositeOperation = blendMode;

  p5.prototype.copy.apply(this, copyArgs);

  this.drawingContext.globalCompositeOperation = currBlend;
};

// p5.Renderer2D.prototype.get = p5.Renderer.prototype.get;
// .get() is not overridden

// x,y are canvas-relative (pre-scaled by _pixelDensity)
p5.Renderer2D.prototype._getPixel = function(x, y) {
  let imageData, index;
  imageData = this.drawingContext.getImageData(x, y, 1, 1).data;
  index = 0;
  return [
    imageData[index + 0],
    imageData[index + 1],
    imageData[index + 2],
    imageData[index + 3]
  ];
};

p5.Renderer2D.prototype.loadPixels = function() {
  const pixelsState = this._pixelsState; // if called by p5.Image

  const pd = pixelsState._pixelDensity;
  const w = this.width * pd;
  const h = this.height * pd;
  const imageData = this.drawingContext.getImageData(0, 0, w, h);
  // @todo this should actually set pixels per object, so diff buffers can
  // have diff pixel arrays.
  pixelsState._setProperty('imageData', imageData);
  pixelsState._setProperty('pixels', imageData.data);
};

p5.Renderer2D.prototype.set = function(x, y, imgOrCol) {
  // round down to get integer numbers
  x = Math.floor(x);
  y = Math.floor(y);
  const pixelsState = this._pixelsState;
  if (imgOrCol instanceof p5.Image) {
    this.drawingContext.save();
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(
      pixelsState._pixelDensity,
      pixelsState._pixelDensity
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
        pixelsState._pixelDensity *
        (this.width * pixelsState._pixelDensity) +
        x * pixelsState._pixelDensity);
    if (!pixelsState.imageData) {
      pixelsState.loadPixels.call(pixelsState);
    }
    if (typeof imgOrCol === 'number') {
      if (idx < pixelsState.pixels.length) {
        r = imgOrCol;
        g = imgOrCol;
        b = imgOrCol;
        a = 255;
        //this.updatePixels.call(this);
      }
    } else if (imgOrCol instanceof Array) {
      if (imgOrCol.length < 4) {
        throw new Error('pixel array must be of the form [R, G, B, A]');
      }
      if (idx < pixelsState.pixels.length) {
        r = imgOrCol[0];
        g = imgOrCol[1];
        b = imgOrCol[2];
        a = imgOrCol[3];
        //this.updatePixels.call(this);
      }
    } else if (imgOrCol instanceof p5.Color) {
      if (idx < pixelsState.pixels.length) {
        r = imgOrCol.levels[0];
        g = imgOrCol.levels[1];
        b = imgOrCol.levels[2];
        a = imgOrCol.levels[3];
        //this.updatePixels.call(this);
      }
    }
    // loop over pixelDensity * pixelDensity
    for (let i = 0; i < pixelsState._pixelDensity; i++) {
      for (let j = 0; j < pixelsState._pixelDensity; j++) {
        // loop over
        idx =
          4 *
          ((y * pixelsState._pixelDensity + j) *
            this.width *
            pixelsState._pixelDensity +
            (x * pixelsState._pixelDensity + i));
        pixelsState.pixels[idx] = r;
        pixelsState.pixels[idx + 1] = g;
        pixelsState.pixels[idx + 2] = b;
        pixelsState.pixels[idx + 3] = a;
      }
    }
  }
};

p5.Renderer2D.prototype.updatePixels = function(x, y, w, h) {
  const pixelsState = this._pixelsState;
  const pd = pixelsState._pixelDensity;
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
      pixelsState.imageData;
  }

  this.drawingContext.putImageData(pixelsState.imageData, x, y, 0, 0, w, h);
};

//////////////////////////////////////////////
// SHAPE | 2D Primitives
//////////////////////////////////////////////

/**
 * Generate a cubic Bezier representing an arc on the unit circle of total
 * angle `size` radians, beginning `start` radians above the x-axis. Up to
 * four of these curves are combined to make a full arc.
 *
 * See www.joecridge.me/bezier.pdf for an explanation of the method.
 */
p5.Renderer2D.prototype._acuteArcToBezier = function _acuteArcToBezier(
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
};

/*
 * This function requires that:
 *
 *   0 <= start < TWO_PI
 *
 *   start <= stop < start + TWO_PI
 */
p5.Renderer2D.prototype.arc = function(x, y, w, h, start, stop, mode) {
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
  if (this._doFill) {
    ctx.beginPath();
    curves.forEach((curve, index) => {
      if (index === 0) {
        ctx.moveTo(x + curve.ax * rx, y + curve.ay * ry);
      }
      // prettier-ignore
      ctx.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
                          x + curve.cx * rx, y + curve.cy * ry,
                          x + curve.dx * rx, y + curve.dy * ry);
    });
    if (mode === constants.PIE || mode == null) {
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Stroke curves
  if (this._doStroke) {
    ctx.beginPath();
    curves.forEach((curve, index) => {
      if (index === 0) {
        ctx.moveTo(x + curve.ax * rx, y + curve.ay * ry);
      }
      // prettier-ignore
      ctx.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
                          x + curve.cx * rx, y + curve.cy * ry,
                          x + curve.dx * rx, y + curve.dy * ry);
    });
    if (mode === constants.PIE) {
      ctx.lineTo(x, y);
      ctx.closePath();
    } else if (mode === constants.CHORD) {
      ctx.closePath();
    }
    ctx.stroke();
  }
  return this;
};

p5.Renderer2D.prototype.ellipse = function(args) {
  const ctx = this.drawingContext;
  const doFill = this._doFill,
    doStroke = this._doStroke;
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
  const kappa = 0.5522847498,
    // control point offset horizontal
    ox = w / 2 * kappa,
    // control point offset vertical
    oy = h / 2 * kappa,
    // x-end
    xe = x + w,
    // y-end
    ye = y + h,
    // x-middle
    xm = x + w / 2,
    ym = y + h / 2; // y-middle
  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  if (doFill) {
    ctx.fill();
  }
  if (doStroke) {
    ctx.stroke();
  }
};

p5.Renderer2D.prototype.line = function(x1, y1, x2, y2) {
  const ctx = this.drawingContext;
  if (!this._doStroke) {
    return this;
  } else if (this._getStroke() === styleEmpty) {
    return this;
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  return this;
};

p5.Renderer2D.prototype.point = function(x, y) {
  const ctx = this.drawingContext;
  if (!this._doStroke) {
    return this;
  } else if (this._getStroke() === styleEmpty) {
    return this;
  }
  const s = this._getStroke();
  const f = this._getFill();
  x = Math.round(x);
  y = Math.round(y);
  // swapping fill color to stroke and back after for correct point rendering
  this._setFill(s);
  if (ctx.lineWidth > 1) {
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, constants.TWO_PI, false);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, 1, 1);
  }
  this._setFill(f);
};

p5.Renderer2D.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  const ctx = this.drawingContext;
  const doFill = this._doFill,
    doStroke = this._doStroke;
  if (doFill && !doStroke) {
    if (this._getFill() === styleEmpty) {
      return this;
    }
  } else if (!doFill && doStroke) {
    if (this._getStroke() === styleEmpty) {
      return this;
    }
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.closePath();
  if (doFill) {
    ctx.fill();
  }
  if (doStroke) {
    ctx.stroke();
  }
  return this;
};

p5.Renderer2D.prototype.rect = function(args) {
  const x = args[0];
  const y = args[1];
  const w = args[2];
  const h = args[3];
  let tl = args[4];
  let tr = args[5];
  let br = args[6];
  let bl = args[7];
  const ctx = this.drawingContext;
  const doFill = this._doFill,
    doStroke = this._doStroke;
  if (doFill && !doStroke) {
    if (this._getFill() === styleEmpty) {
      return this;
    }
  } else if (!doFill && doStroke) {
    if (this._getStroke() === styleEmpty) {
      return this;
    }
  }
  ctx.beginPath();

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
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.arcTo(x + w, y, x + w, y + h, tr);
    ctx.arcTo(x + w, y + h, x, y + h, br);
    ctx.arcTo(x, y + h, x, y, bl);
    ctx.arcTo(x, y, x + w, y, tl);
    ctx.closePath();
  }
  if (this._doFill) {
    ctx.fill();
  }
  if (this._doStroke) {
    ctx.stroke();
  }
  return this;
};

p5.Renderer2D.prototype.triangle = function(args) {
  const ctx = this.drawingContext;
  const doFill = this._doFill,
    doStroke = this._doStroke;
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
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  if (doFill) {
    ctx.fill();
  }
  if (doStroke) {
    ctx.stroke();
  }
};

p5.Renderer2D.prototype.endShape = function(
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
  if (!this._doStroke && !this._doFill) {
    return this;
  }
  const closeShape = mode === constants.CLOSE;
  let v;
  if (closeShape && !isContour) {
    vertices.push(vertices[0]);
  }
  let i, j;
  const numVerts = vertices.length;
  if (isCurve && (shapeKind === constants.POLYGON || shapeKind === null)) {
    if (numVerts > 3) {
      const b = [],
        s = 1 - this._curveTightness;
      this.drawingContext.beginPath();
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
          vertices[i + 1][1] + (s * vertices[i][1] - s * vertices[i + 2][1]) / 6
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
    (shapeKind === constants.POLYGON || shapeKind === null)
  ) {
    this.drawingContext.beginPath();
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
    (shapeKind === constants.POLYGON || shapeKind === null)
  ) {
    this.drawingContext.beginPath();
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
        if (this._doStroke) {
          this._pInst.stroke(v[6]);
        }
        this._pInst.point(v[0], v[1]);
      }
    } else if (shapeKind === constants.LINES) {
      for (i = 0; i + 1 < numVerts; i += 2) {
        v = vertices[i];
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 1][6]);
        }
        this._pInst.line(v[0], v[1], vertices[i + 1][0], vertices[i + 1][1]);
      }
    } else if (shapeKind === constants.TRIANGLES) {
      for (i = 0; i + 2 < numVerts; i += 3) {
        v = vertices[i];
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(v[0], v[1]);
        this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
        this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
        this.drawingContext.closePath();
        if (this._doFill) {
          this._pInst.fill(vertices[i + 2][5]);
          this.drawingContext.fill();
        }
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 2][6]);
          this.drawingContext.stroke();
        }
      }
    } else if (shapeKind === constants.TRIANGLE_STRIP) {
      for (i = 0; i + 1 < numVerts; i++) {
        v = vertices[i];
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[i + 1][0], vertices[i + 1][1]);
        this.drawingContext.lineTo(v[0], v[1]);
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 1][6]);
        }
        if (this._doFill) {
          this._pInst.fill(vertices[i + 1][5]);
        }
        if (i + 2 < numVerts) {
          this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
          if (this._doStroke) {
            this._pInst.stroke(vertices[i + 2][6]);
          }
          if (this._doFill) {
            this._pInst.fill(vertices[i + 2][5]);
          }
        }
        this._doFillStrokeClose(closeShape);
      }
    } else if (shapeKind === constants.TRIANGLE_FAN) {
      if (numVerts > 2) {
        // For performance reasons, try to batch as many of the
        // fill and stroke calls as possible.
        this.drawingContext.beginPath();
        for (i = 2; i < numVerts; i++) {
          v = vertices[i];
          this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
          this.drawingContext.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
          this.drawingContext.lineTo(v[0], v[1]);
          this.drawingContext.lineTo(vertices[0][0], vertices[0][1]);
          // If the next colour is going to be different, stroke / fill now
          if (i < numVerts - 1) {
            if (
              (this._doFill && v[5] !== vertices[i + 1][5]) ||
              (this._doStroke && v[6] !== vertices[i + 1][6])
            ) {
              if (this._doFill) {
                this._pInst.fill(v[5]);
                this.drawingContext.fill();
                this._pInst.fill(vertices[i + 1][5]);
              }
              if (this._doStroke) {
                this._pInst.stroke(v[6]);
                this.drawingContext.stroke();
                this._pInst.stroke(vertices[i + 1][6]);
              }
              this.drawingContext.closePath();
              this.drawingContext.beginPath(); // Begin the next one
            }
          }
        }
        this._doFillStrokeClose(closeShape);
      }
    } else if (shapeKind === constants.QUADS) {
      for (i = 0; i + 3 < numVerts; i += 4) {
        v = vertices[i];
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(v[0], v[1]);
        for (j = 1; j < 4; j++) {
          this.drawingContext.lineTo(vertices[i + j][0], vertices[i + j][1]);
        }
        this.drawingContext.lineTo(v[0], v[1]);
        if (this._doFill) {
          this._pInst.fill(vertices[i + 3][5]);
        }
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 3][6]);
        }
        this._doFillStrokeClose(closeShape);
      }
    } else if (shapeKind === constants.QUAD_STRIP) {
      if (numVerts > 3) {
        for (i = 0; i + 1 < numVerts; i += 2) {
          v = vertices[i];
          this.drawingContext.beginPath();
          if (i + 3 < numVerts) {
            this.drawingContext.moveTo(vertices[i + 2][0], vertices[i + 2][1]);
            this.drawingContext.lineTo(v[0], v[1]);
            this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
            this.drawingContext.lineTo(vertices[i + 3][0], vertices[i + 3][1]);
            if (this._doFill) {
              this._pInst.fill(vertices[i + 3][5]);
            }
            if (this._doStroke) {
              this._pInst.stroke(vertices[i + 3][6]);
            }
          } else {
            this.drawingContext.moveTo(v[0], v[1]);
            this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
          }
          this._doFillStrokeClose(closeShape);
        }
      }
    } else {
      this.drawingContext.beginPath();
      this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
      for (i = 1; i < numVerts; i++) {
        v = vertices[i];
        if (v.isVert) {
          if (v.moveTo) {
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
};
//////////////////////////////////////////////
// SHAPE | Attributes
//////////////////////////////////////////////

p5.Renderer2D.prototype.strokeCap = function(cap) {
  if (
    cap === constants.ROUND ||
    cap === constants.SQUARE ||
    cap === constants.PROJECT
  ) {
    this.drawingContext.lineCap = cap;
  }
  return this;
};

p5.Renderer2D.prototype.strokeJoin = function(join) {
  if (
    join === constants.ROUND ||
    join === constants.BEVEL ||
    join === constants.MITER
  ) {
    this.drawingContext.lineJoin = join;
  }
  return this;
};

p5.Renderer2D.prototype.strokeWeight = function(w) {
  if (typeof w === 'undefined' || w === 0) {
    // hack because lineWidth 0 doesn't work
    this.drawingContext.lineWidth = 0.0001;
  } else {
    this.drawingContext.lineWidth = w;
  }
  return this;
};

p5.Renderer2D.prototype._getFill = function() {
  if (!this._cachedFillStyle) {
    this._cachedFillStyle = this.drawingContext.fillStyle;
  }
  return this._cachedFillStyle;
};

p5.Renderer2D.prototype._setFill = function(fillStyle) {
  if (fillStyle !== this._cachedFillStyle) {
    this.drawingContext.fillStyle = fillStyle;
    this._cachedFillStyle = fillStyle;
  }
};

p5.Renderer2D.prototype._getStroke = function() {
  if (!this._cachedStrokeStyle) {
    this._cachedStrokeStyle = this.drawingContext.strokeStyle;
  }
  return this._cachedStrokeStyle;
};

p5.Renderer2D.prototype._setStroke = function(strokeStyle) {
  if (strokeStyle !== this._cachedStrokeStyle) {
    this.drawingContext.strokeStyle = strokeStyle;
    this._cachedStrokeStyle = strokeStyle;
  }
};

//////////////////////////////////////////////
// SHAPE | Curves
//////////////////////////////////////////////
p5.Renderer2D.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this._pInst.beginShape();
  this._pInst.vertex(x1, y1);
  this._pInst.bezierVertex(x2, y2, x3, y3, x4, y4);
  this._pInst.endShape();
  return this;
};

p5.Renderer2D.prototype.curve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this._pInst.beginShape();
  this._pInst.curveVertex(x1, y1);
  this._pInst.curveVertex(x2, y2);
  this._pInst.curveVertex(x3, y3);
  this._pInst.curveVertex(x4, y4);
  this._pInst.endShape();
  return this;
};

//////////////////////////////////////////////
// SHAPE | Vertex
//////////////////////////////////////////////

p5.Renderer2D.prototype._doFillStrokeClose = function(closeShape) {
  if (closeShape) {
    this.drawingContext.closePath();
  }
  if (this._doFill) {
    this.drawingContext.fill();
  }
  if (this._doStroke) {
    this.drawingContext.stroke();
  }
};

//////////////////////////////////////////////
// TRANSFORM
//////////////////////////////////////////////

p5.Renderer2D.prototype.applyMatrix = function(a, b, c, d, e, f) {
  this.drawingContext.transform(a, b, c, d, e, f);
};

p5.Renderer2D.prototype.resetMatrix = function() {
  this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
  this.drawingContext.scale(
    this._pInst._pixelDensity,
    this._pInst._pixelDensity
  );
  return this;
};

p5.Renderer2D.prototype.rotate = function(rad) {
  this.drawingContext.rotate(rad);
};

p5.Renderer2D.prototype.scale = function(x, y) {
  this.drawingContext.scale(x, y);
  return this;
};

p5.Renderer2D.prototype.translate = function(x, y) {
  // support passing a vector as the 1st parameter
  if (x instanceof p5.Vector) {
    y = x.y;
    x = x.x;
  }
  this.drawingContext.translate(x, y);
  return this;
};

//////////////////////////////////////////////
// TYPOGRAPHY
//
//////////////////////////////////////////////

p5.Renderer2D.prototype.text = function(str, x, y, maxWidth, maxHeight) {
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

  const p = p5.Renderer.prototype.text.apply(this, arguments);

  if (baselineHacked) {
    this.drawingContext.textBaseline = constants.BASELINE;
  }

  return p;
};

p5.Renderer2D.prototype._renderText = function(p, line, x, y, maxY) {
  if (y >= maxY) {
    return; // don't render lines beyond our maxY position
  }

  p.push(); // fix to #803

  if (!this._isOpenType()) {
    // a system/browser font

    // no stroke unless specified by user
    if (this._doStroke && this._strokeSet) {
      this.drawingContext.strokeText(line, x, y);
    }

    if (this._doFill) {
      // if fill hasn't been set by user, use default text fill
      if (!this._fillSet) {
        this._setFill(constants._DEFAULT_TEXT_FILL);
      }

      this.drawingContext.fillText(line, x, y);
    }
  } else {
    // an opentype font, let it handle the rendering

    this._textFont._renderPath(line, x, y, { renderer: this });
  }

  p.pop();
  return p;
};

p5.Renderer2D.prototype.textWidth = function(s) {
  if (this._isOpenType()) {
    return this._textFont._textWidth(s, this._textSize);
  }

  return this.drawingContext.measureText(s).width;
};

p5.Renderer2D.prototype._applyTextProperties = function() {
  let font;
  const p = this._pInst;

  this._setProperty('_textAscent', null);
  this._setProperty('_textDescent', null);

  font = this._textFont;

  if (this._isOpenType()) {
    font = this._textFont.font.familyName;
    this._setProperty('_textStyle', this._textFont.font.styleName);
  }

  this.drawingContext.font = `${this._textStyle || 'normal'} ${this._textSize ||
    12}px ${font || 'sans-serif'}`;

  this.drawingContext.textAlign = this._textAlign;
  if (this._textBaseline === constants.CENTER) {
    this.drawingContext.textBaseline = constants._CTX_MIDDLE;
  } else {
    this.drawingContext.textBaseline = this._textBaseline;
  }

  return p;
};

//////////////////////////////////////////////
// STRUCTURE
//////////////////////////////////////////////

// a push() operation is in progress.
// the renderer should return a 'style' object that it wishes to
// store on the push stack.
// derived renderers should call the base class' push() method
// to fetch the base style object.
p5.Renderer2D.prototype.push = function() {
  this.drawingContext.save();

  // get the base renderer style
  return p5.Renderer.prototype.push.apply(this);
};

// a pop() operation is in progress
// the renderer is passed the 'style' object that it returned
// from its push() method.
// derived renderers should pass this object to their base
// class' pop method
p5.Renderer2D.prototype.pop = function(style) {
  this.drawingContext.restore();
  // Re-cache the fill / stroke state
  this._cachedFillStyle = this.drawingContext.fillStyle;
  this._cachedStrokeStyle = this.drawingContext.strokeStyle;

  p5.Renderer.prototype.pop.call(this, style);
};

export default p5.Renderer2D;
