'use strict';

var p5 = require('./main');
var constants = require('./constants');
var filters = require('../image/filters');

require('./p5.Renderer');

/**
 * p5.Renderer2D
 * The 2D graphics canvas renderer class.
 * extends p5.Renderer
 */
var styleEmpty = 'rgba(0,0,0,0)';
// var alphaThreshold = 0.00125; // minimum visible

p5.Renderer2D = function(elt, pInst, isMainCanvas) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this.drawingContext = this.canvas.getContext('2d');
  this._pInst._setProperty('drawingContext', this.drawingContext);
  return this;
};

p5.Renderer2D.prototype = Object.create(p5.Renderer.prototype);

p5.Renderer2D.prototype._applyDefaults = function() {
  this._cachedFillStyle = this._cachedStrokeStyle = undefined;
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

p5.Renderer2D.prototype.background = function() {
  this.drawingContext.save();
  this.resetMatrix();

  if (arguments[0] instanceof p5.Image) {
    this._pInst.image(arguments[0], 0, 0, this.width, this.height);
  } else {
    var curFill = this._getFill();
    // create background rect
    var color = this._pInst.color.apply(this._pInst, arguments);
    var newFill = color.toString();
    this._setFill(newFill);
    this.drawingContext.fillRect(0, 0, this.width, this.height);
    // reset fill
    this._setFill(curFill);
  }
  this.drawingContext.restore();

  this._pInst._pixelsDirty = true;
};

p5.Renderer2D.prototype.clear = function() {
  this.drawingContext.save();
  this.resetMatrix();
  this.drawingContext.clearRect(0, 0, this.width, this.height);
  this.drawingContext.restore();

  this._pInst._pixelsDirty = true;
};

p5.Renderer2D.prototype.fill = function() {
  var color = this._pInst.color.apply(this._pInst, arguments);
  this._setFill(color.toString());
};

p5.Renderer2D.prototype.stroke = function() {
  var color = this._pInst.color.apply(this._pInst, arguments);
  this._setStroke(color.toString());
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
  var cnv;
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
    var s = 1;
    if (img.width && img.width > 0) {
      s = cnv.width / img.width;
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
  } catch (e) {
    if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
      throw e;
    }
  }

  this._pInst._pixelsDirty = true;
};

p5.Renderer2D.prototype._getTintedImageCanvas = function(img) {
  if (!img.canvas) {
    return img;
  }
  var pixels = filters._toPixels(img.canvas);
  var tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = img.canvas.width;
  tmpCanvas.height = img.canvas.height;
  var tmpCtx = tmpCanvas.getContext('2d');
  var id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
  var newPixels = id.data;
  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    var a = pixels[i + 3];
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
  this.drawingContext.globalCompositeOperation = mode;
};
p5.Renderer2D.prototype.blend = function() {
  var currBlend = this.drawingContext.globalCompositeOperation;
  var blendMode = arguments[arguments.length - 1];

  var copyArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

  this.drawingContext.globalCompositeOperation = blendMode;
  if (this._pInst) {
    this._pInst.copy.apply(this._pInst, copyArgs);
  } else {
    this.copy.apply(this, copyArgs);
  }
  this.drawingContext.globalCompositeOperation = currBlend;
};

p5.Renderer2D.prototype.copy = function() {
  var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
  if (arguments.length === 9) {
    srcImage = arguments[0];
    sx = arguments[1];
    sy = arguments[2];
    sw = arguments[3];
    sh = arguments[4];
    dx = arguments[5];
    dy = arguments[6];
    dw = arguments[7];
    dh = arguments[8];
  } else if (arguments.length === 8) {
    srcImage = this._pInst;
    sx = arguments[0];
    sy = arguments[1];
    sw = arguments[2];
    sh = arguments[3];
    dx = arguments[4];
    dy = arguments[5];
    dw = arguments[6];
    dh = arguments[7];
  } else {
    throw new Error('Signature not supported');
  }
  p5.Renderer2D._copyHelper(this, srcImage, sx, sy, sw, sh, dx, dy, dw, dh);

  this._pInst._pixelsDirty = true;
};

p5.Renderer2D._copyHelper = function(
  dstImage,
  srcImage,
  sx,
  sy,
  sw,
  sh,
  dx,
  dy,
  dw,
  dh
) {
  srcImage.loadPixels();
  var s = srcImage.canvas.width / srcImage.width;
  dstImage.drawingContext.drawImage(
    srcImage.canvas,
    s * sx,
    s * sy,
    s * sw,
    s * sh,
    dx,
    dy,
    dw,
    dh
  );
};

p5.Renderer2D.prototype.get = function(x, y, w, h) {
  var ctx = this._pInst || this;
  var pd = ctx._pixelDensity;

  var sx = x * pd;
  var sy = y * pd;
  if (w === 1 && h === 1) {
    var imageData, index;
    if (ctx._pixelsDirty) {
      imageData = this.drawingContext.getImageData(sx, sy, 1, 1).data;
      index = 0;
    } else {
      imageData = ctx.pixels;
      index = (sx + sy * this.width * pd) * 4;
    }
    return [
      imageData[index + 0],
      imageData[index + 1],
      imageData[index + 2],
      imageData[index + 3]
    ];
  } else {
    //auto constrain the width and height to
    //dimensions of the source image
    var dw = Math.min(w, ctx.width);
    var dh = Math.min(h, ctx.height);
    var sw = dw * pd;
    var sh = dh * pd;

    var region = new p5.Image(dw, dh);
    region.canvas
      .getContext('2d')
      .drawImage(this.canvas, sx, sy, sw, sh, 0, 0, dw, dh);

    return region;
  }
};

p5.Renderer2D.prototype.loadPixels = function() {
  var ctx = this._pInst || this; // if called by p5.Image
  if (!ctx._pixelsDirty) return;
  ctx._pixelsDirty = false;

  var pd = ctx._pixelDensity;
  var w = this.width * pd;
  var h = this.height * pd;
  var imageData = this.drawingContext.getImageData(0, 0, w, h);
  // @todo this should actually set pixels per object, so diff buffers can
  // have diff pixel arrays.
  ctx._setProperty('imageData', imageData);
  ctx._setProperty('pixels', imageData.data);
};

p5.Renderer2D.prototype.set = function(x, y, imgOrCol) {
  // round down to get integer numbers
  x = Math.floor(x);
  y = Math.floor(y);
  var ctx = this._pInst || this;
  if (imgOrCol instanceof p5.Image) {
    this.drawingContext.save();
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(ctx._pixelDensity, ctx._pixelDensity);
    this.drawingContext.drawImage(imgOrCol.canvas, x, y);
    this.drawingContext.restore();
    ctx._pixelsDirty = true;
  } else {
    var r = 0,
      g = 0,
      b = 0,
      a = 0;
    var idx =
      4 *
      (y * ctx._pixelDensity * (this.width * ctx._pixelDensity) +
        x * ctx._pixelDensity);
    if (!ctx.imageData || ctx._pixelsDirty) {
      ctx.loadPixels.call(ctx);
    }
    if (typeof imgOrCol === 'number') {
      if (idx < ctx.pixels.length) {
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
      if (idx < ctx.pixels.length) {
        r = imgOrCol[0];
        g = imgOrCol[1];
        b = imgOrCol[2];
        a = imgOrCol[3];
        //this.updatePixels.call(this);
      }
    } else if (imgOrCol instanceof p5.Color) {
      if (idx < ctx.pixels.length) {
        r = imgOrCol.levels[0];
        g = imgOrCol.levels[1];
        b = imgOrCol.levels[2];
        a = imgOrCol.levels[3];
        //this.updatePixels.call(this);
      }
    }
    // loop over pixelDensity * pixelDensity
    for (var i = 0; i < ctx._pixelDensity; i++) {
      for (var j = 0; j < ctx._pixelDensity; j++) {
        // loop over
        idx =
          4 *
          ((y * ctx._pixelDensity + j) * this.width * ctx._pixelDensity +
            (x * ctx._pixelDensity + i));
        ctx.pixels[idx] = r;
        ctx.pixels[idx + 1] = g;
        ctx.pixels[idx + 2] = b;
        ctx.pixels[idx + 3] = a;
      }
    }
  }
};

p5.Renderer2D.prototype.updatePixels = function(x, y, w, h) {
  var ctx = this._pInst || this;
  var pd = ctx._pixelDensity;
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
  w *= pd;
  h *= pd;

  this.drawingContext.putImageData(ctx.imageData, x, y, 0, 0, w, h);

  if (x !== 0 || y !== 0 || w !== this.width || h !== this.height) {
    ctx._pixelsDirty = true;
  }
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
  // Evauate constants.
  var alpha = size / 2.0,
    cos_alpha = Math.cos(alpha),
    sin_alpha = Math.sin(alpha),
    cot_alpha = 1.0 / Math.tan(alpha),
    phi = start + alpha, // This is how far the arc needs to be rotated.
    cos_phi = Math.cos(phi),
    sin_phi = Math.sin(phi),
    lambda = (4.0 - cos_alpha) / 3.0,
    mu = sin_alpha + (cos_alpha - lambda) * cot_alpha;

  // Return rotated waypoints.
  return {
    ax: Math.cos(start),
    ay: Math.sin(start),
    bx: lambda * cos_phi + mu * sin_phi,
    by: lambda * sin_phi - mu * cos_phi,
    cx: lambda * cos_phi - mu * sin_phi,
    cy: lambda * sin_phi + mu * cos_phi,
    dx: Math.cos(start + size),
    dy: Math.sin(start + size)
  };
};

p5.Renderer2D.prototype.arc = function(x, y, w, h, start, stop, mode) {
  var ctx = this.drawingContext;
  var rx = w / 2.0;
  var ry = h / 2.0;
  var epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
  var arcToDraw = 0;
  var curves = [];

  x += rx;
  y += ry;

  // Create curves
  while (stop - start > epsilon) {
    arcToDraw = Math.min(stop - start, constants.HALF_PI);
    curves.push(this._acuteArcToBezier(start, arcToDraw));
    start += arcToDraw;
  }

  // Fill curves
  if (this._doFill) {
    ctx.beginPath();
    curves.forEach(function(curve, index) {
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
    curves.forEach(function(curve, index) {
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
  var ctx = this.drawingContext;
  var doFill = this._doFill,
    doStroke = this._doStroke;
  var x = args[0],
    y = args[1],
    w = args[2],
    h = args[3];
  if (doFill && !doStroke) {
    if (this._getFill() === styleEmpty) {
      return this;
    }
  } else if (!doFill && doStroke) {
    if (this._getStroke() === styleEmpty) {
      return this;
    }
  }
  var kappa = 0.5522847498,
    ox = w / 2 * kappa, // control point offset horizontal
    oy = h / 2 * kappa, // control point offset vertical
    xe = x + w, // x-end
    ye = y + h, // y-end
    xm = x + w / 2, // x-middle
    ym = y + h / 2; // y-middle
  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  if (doFill) {
    ctx.fill();
  }
  if (doStroke) {
    ctx.stroke();
  }
};

p5.Renderer2D.prototype.line = function(x1, y1, x2, y2) {
  var ctx = this.drawingContext;
  if (!this._doStroke) {
    return this;
  } else if (this._getStroke() === styleEmpty) {
    return this;
  }
  // Translate the line by (0.5, 0.5) to draw it crisp
  if (ctx.lineWidth % 2 === 1) {
    ctx.translate(0.5, 0.5);
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  if (ctx.lineWidth % 2 === 1) {
    ctx.translate(-0.5, -0.5);
  }
  return this;
};

p5.Renderer2D.prototype.point = function(x, y) {
  var ctx = this.drawingContext;
  if (!this._doStroke) {
    return this;
  } else if (this._getStroke() === styleEmpty) {
    return this;
  }
  var s = this._getStroke();
  var f = this._getFill();
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
  var ctx = this.drawingContext;
  var doFill = this._doFill,
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
  var x = args[0],
    y = args[1],
    w = args[2],
    h = args[3],
    tl = args[4],
    tr = args[5],
    br = args[6],
    bl = args[7];
  var ctx = this.drawingContext;
  var doFill = this._doFill,
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
  // Translate the line by (0.5, 0.5) to draw a crisp rectangle border
  if (this._doStroke && ctx.lineWidth % 2 === 1) {
    ctx.translate(0.5, 0.5);
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

    var hw = w / 2;
    var hh = h / 2;

    // Clip radii
    if (w < 2 * tl) {
      tl = hw;
    }
    if (h < 2 * tl) {
      tl = hh;
    }
    if (w < 2 * tr) {
      tr = hw;
    }
    if (h < 2 * tr) {
      tr = hh;
    }
    if (w < 2 * br) {
      br = hw;
    }
    if (h < 2 * br) {
      br = hh;
    }
    if (w < 2 * bl) {
      bl = hw;
    }
    if (h < 2 * bl) {
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
  if (this._doStroke && ctx.lineWidth % 2 === 1) {
    ctx.translate(-0.5, -0.5);
  }
  return this;
};

p5.Renderer2D.prototype.triangle = function(args) {
  var ctx = this.drawingContext;
  var doFill = this._doFill,
    doStroke = this._doStroke;
  var x1 = args[0],
    y1 = args[1];
  var x2 = args[2],
    y2 = args[3];
  var x3 = args[4],
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
  var closeShape = mode === constants.CLOSE;
  var v;
  if (closeShape && !isContour) {
    vertices.push(vertices[0]);
  }
  var i, j;
  var numVerts = vertices.length;
  if (isCurve && (shapeKind === constants.POLYGON || shapeKind === null)) {
    if (numVerts > 3) {
      var b = [],
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
      this._doFillStrokeClose();
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
    this._doFillStrokeClose();
  } else if (
    isQuadratic &&
    (shapeKind === constants.POLYGON || shapeKind === null)
  ) {
    this.drawingContext.beginPath();
    for (i = 0; i < numVerts; i++) {
      if (vertices[i].isVert) {
        if (vertices[i].moveTo) {
          this.drawingContext.moveTo([0], vertices[i][1]);
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
    this._doFillStrokeClose();
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
        this._doFillStrokeClose();
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
        this._doFillStrokeClose();
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
        this._doFillStrokeClose();
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
          this._doFillStrokeClose();
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
      this._doFillStrokeClose();
    }
  }
  isCurve = false;
  isBezier = false;
  isQuadratic = false;
  isContour = false;
  if (closeShape) {
    vertices.pop();
  }

  this._pInst._pixelsDirty = true;
  return this;
};
//////////////////////////////////////////////
// SHAPE | Attributes
//////////////////////////////////////////////

p5.Renderer2D.prototype.noSmooth = function() {
  if ('imageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.imageSmoothingEnabled = false;
  }
  return this;
};

p5.Renderer2D.prototype.smooth = function() {
  if ('imageSmoothingEnabled' in this.drawingContext) {
    this.drawingContext.imageSmoothingEnabled = true;
  }
  return this;
};

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

p5.Renderer2D.prototype._doFillStrokeClose = function() {
  if (this._doFill) {
    this.drawingContext.fill();
  }
  if (this._doStroke) {
    this.drawingContext.stroke();
  }
  this.drawingContext.closePath();

  this._pInst._pixelsDirty = true;
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

p5.Renderer2D.prototype.shearX = function(rad) {
  this.drawingContext.transform(1, 0, Math.tan(rad), 1, 0, 0);
  return this;
};

p5.Renderer2D.prototype.shearY = function(rad) {
  this.drawingContext.transform(1, Math.tan(rad), 0, 1, 0, 0);
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
  var baselineHacked;

  // baselineHacked: (HACK)
  // A temporary fix to conform to Processing's implementation
  // of BASELINE vertical alignment in a bounding box

  if (typeof maxWidth !== 'undefined' && typeof maxHeight !== 'undefined') {
    if (this.drawingContext.textBaseline === constants.BASELINE) {
      baselineHacked = true;
      this.drawingContext.textBaseline = constants.TOP;
    }
  }

  var p = p5.Renderer.prototype.text.apply(this, arguments);

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

  this._pInst._pixelsDirty = true;
  return p;
};

p5.Renderer2D.prototype.textWidth = function(s) {
  if (this._isOpenType()) {
    return this._textFont._textWidth(s, this._textSize);
  }

  return this.drawingContext.measureText(s).width;
};

p5.Renderer2D.prototype._applyTextProperties = function() {
  var font,
    p = this._pInst;

  this._setProperty('_textAscent', null);
  this._setProperty('_textDescent', null);

  font = this._textFont;

  if (this._isOpenType()) {
    font = this._textFont.font.familyName;
    this._setProperty('_textStyle', this._textFont.font.styleName);
  }

  this.drawingContext.font =
    (this._textStyle || 'normal') +
    ' ' +
    (this._textSize || 12) +
    'px ' +
    (font || 'sans-serif');

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

module.exports = p5.Renderer2D;
