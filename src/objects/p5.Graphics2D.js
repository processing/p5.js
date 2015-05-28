define(function(require) {

  var p5 = require('core');
  var canvas = require('canvas');
  var constants = require('constants');
  var filters = require('filters');
  require('p5.Graphics');
  /**
   * 2D graphics class.  Can also be used as an off-screen graphics buffer.
   * A p5.Graphics2D object can be constructed
   * with the <code>createGraphics2D()</code> function. The fields and methods
   * for this class are extensive, but mirror the normal drawing API for p5.
   *
   * @class p5.Graphics2D
   * @constructor
   * @extends p5.Element
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   * @example
   * <div>
   * <code>
   * var pg;
   * function setup() {
   *   createCanvas(100, 100);
   *   pg = createGraphics2D(40, 40);
   * }
   * function draw() {
   *   background(200);
   *   pg.background(100);
   *   pg.noStroke();
   *   pg.ellipse(pg.width/2, pg.height/2, 50, 50);
   *   image(pg, 9, 30);
   *   image(pg, 51, 30);
   * }
   * </code>
   * </div>
   */
  var styleEmpty = 'rgba(0,0,0,0)';
  // var alphaThreshold = 0.00125; // minimum visible

  p5.Graphics2D = function(elt, pInst, isMainCanvas){
    p5.Graphics.call(this, elt, pInst, isMainCanvas);
    this.drawingContext = this.canvas.getContext('2d');
    this._pInst._setProperty('drawingContext', this.drawingContext);
    return this;
  };

  p5.Graphics2D.prototype = Object.create(p5.Graphics.prototype);

  p5.Graphics2D.prototype._applyDefaults = function() {
    this.drawingContext.fillStyle = '#FFFFFF';
    this.drawingContext.strokeStyle = '#000000';
    this.drawingContext.lineCap = constants.ROUND;
    this.drawingContext.font = 'normal 12px sans-serif';
  };
  //////////////////////////////////////////////
  // COLOR | Setting
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.background = function() {
    this.drawingContext.save();
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(this._pInst._pixelDensity,
      this._pInst._pixelDensity);
    if (arguments[0] instanceof p5.Image) {
      this._pInst.image(arguments[0], 0, 0, this.width, this.height);
    } else {
      var curFill = this.drawingContext.fillStyle;
      // create background rect
      var color = this._pInst.color.apply(this._pInst, arguments);
      var newFill = color.toString();
      this.drawingContext.fillStyle = newFill;
      this.drawingContext.fillRect(0, 0, this.width, this.height);
      // reset fill
      this.drawingContext.fillStyle = curFill;
    }
    this.drawingContext.restore();
  };
  
  p5.Graphics2D.prototype.clear = function() {
    this.drawingContext.clearRect(0, 0, this.width, this.height);
  };

  p5.Graphics2D.prototype.fill = function() {
    
    var ctx = this.drawingContext;
    var color = this._pInst.color.apply(this._pInst, arguments);
    ctx.fillStyle = color.toString();
  };

  p5.Graphics2D.prototype.stroke = function() {
    var ctx = this.drawingContext;
    var color = this._pInst.color.apply(this._pInst, arguments);
    ctx.strokeStyle = color.toString();
  };

  //////////////////////////////////////////////
  // IMAGE | Loading & Displaying
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.image = function (img, x, y, w, h) {
    var frame = img.canvas || img.elt;
    try {
      if (this._pInst._tint && img.canvas) {
        this.drawingContext.drawImage(this._getTintedImageCanvas(img),
          x, y, w, h);
      } else {
        this.drawingContext.drawImage(frame, x, y, w, h);
      }
    } catch (e) {
      if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
        throw e;
      }
    }
  };

  p5.Graphics2D.prototype._getTintedImageCanvas = function (img) {
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
      newPixels[i] = r * this._pInst._tint[0] / 255;
      newPixels[i + 1] = g * this._pInst._tint[1] / 255;
      newPixels[i + 2] = b * this._pInst._tint[2] / 255;
      newPixels[i + 3] = a * this._pInst._tint[3] / 255;
    }
    tmpCtx.putImageData(id, 0, 0);
    return tmpCanvas;
  };


  //////////////////////////////////////////////
  // IMAGE | Pixels
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.blend = function() {
    var currBlend = this.drawingContext.globalCompositeOperation;
    var blendMode = arguments[arguments.length - 1];

    var copyArgs = Array.prototype.slice.call(
      arguments,
      0,
      arguments.length - 1
    );

    this.drawingContext.globalCompositeOperation = blendMode;
    this._pInst.copy.apply(this._pInst, copyArgs);
    this.drawingContext.globalCompositeOperation = currBlend;
  };

  p5.Graphics2D.prototype.copy = function () {
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
    p5.Graphics2D._copyHelper(srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
  };

  p5.Graphics2D._copyHelper =
  function (srcImage, sx, sy, sw, sh, dx, dy, dw, dh) {
    var s = srcImage.canvas.width / srcImage.width;
    this.drawingContext.drawImage(srcImage.canvas,
      s * sx, s * sy, s * sw, s * sh, dx, dy, dw, dh);
  };

  p5.Graphics2D.prototype.get = function(x, y, w, h) {
    if (x === undefined &&
      y === undefined &&
      w === undefined &&
      h === undefined) {
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    } else if (w === undefined && h === undefined) {
      w = 1;
      h = 1;
    }
    if (x > this.width || y > this.height || x < 0 || y < 0) {
      return [
        0,
        0,
        0,
        255
      ];
    }
    var imageData = this.drawingContext.getImageData(x, y, w, h);
    var data = imageData.data;
    if (w === 1 && h === 1) {
      var pixels = [];
      for (var i = 0; i < data.length; i += 4) {
        pixels.push(data[i], data[i + 1], data[i + 2], data[i + 3]);
      }
      return pixels;
    } else {
      w = Math.min(w, this.width);
      h = Math.min(h, this.height);
      var region = new p5.Image(w, h);
      region.canvas.getContext('2d').putImageData(imageData, 0, 0, 0, 0, w, h);
      return region;
    }
  };

  p5.Graphics2D.prototype.loadPixels = function () {
    var imageData = this.drawingContext.getImageData(0, 0,
      this.width, this.height);
    if (this._pInst) {
      this._pInst._setProperty('imageData', imageData);
      this._pInst._setProperty('pixels', imageData.data);
    } else { // if called by p5.Image
      this._setProperty('imageData', imageData);
      this._setProperty('pixels', imageData.data);
    }
  };
  p5.Graphics2D.prototype.set = function (x, y, imgOrCol) {
    if (imgOrCol instanceof p5.Image) {
      this.drawingContext.save();
      this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
      this.drawingContext.scale(this._pInst._pixelDensity,
        this._pInst._pixelDensity);
      this.drawingContext.drawImage(imgOrCol.canvas, x, y);
      this.loadPixels.call(this._pInst);
      this.drawingContext.restore();
    } else {
      var ctx = this._pInst || this;
      var idx = 4 * (y * this.width + x);
      if (!this.imageData) {
        ctx.loadPixels.call(ctx);
      }
      if (typeof imgOrCol === 'number') {
        if (idx < ctx.pixels.length) {
          ctx.pixels[idx] = imgOrCol;
          ctx.pixels[idx + 1] = imgOrCol;
          ctx.pixels[idx + 2] = imgOrCol;
          ctx.pixels[idx + 3] = 255;
        }
      } else if (imgOrCol instanceof Array) {
        if (imgOrCol.length < 4) {
          throw new Error('pixel array must be of the form [R, G, B, A]');
        }
        if (idx < ctx.pixels.length) {
          ctx.pixels[idx] = imgOrCol[0];
          ctx.pixels[idx + 1] = imgOrCol[1];
          ctx.pixels[idx + 2] = imgOrCol[2];
          ctx.pixels[idx + 3] = imgOrCol[3];
        }
      } else if (imgOrCol instanceof p5.Color) {
        if (idx < ctx.pixels.length) {
          ctx.pixels[idx] = imgOrCol.rgba[0];
          ctx.pixels[idx + 1] = imgOrCol.rgba[1];
          ctx.pixels[idx + 2] = imgOrCol.rgba[2];
          ctx.pixels[idx + 3] = imgOrCol.rgba[3];
        }
      }
    }
  };
  p5.Graphics2D.prototype.updatePixels = function (x, y, w, h) {
    if (x === undefined && y === undefined &&
      w === undefined && h === undefined) {
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    }
    if (this._pInst) {
      this.drawingContext.putImageData(this._pInst.imageData, x, y, 0, 0, w, h);
    } else {
      this.drawingContext.putImageData(this.imageData, x, y, 0, 0, w, h);
    }
  };

  //////////////////////////////////////////////
  // SHAPE | 2D Primitives
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.arc =
    function(x, y, w, h, start, stop, mode, curves) {
    if (!this._pInst._doStroke && !this._pInst._doFill) {
      return;
    }
    var ctx = this.drawingContext;
    var vals = canvas.arcModeAdjust(x, y, w, h, this._pInst._ellipseMode);
    var rx = vals.w / 2;
    var ry = vals.h / 2;
    ctx.beginPath();
    curves.forEach(function (curve, index) {
      if (index === 0) {
        ctx.moveTo(vals.x + curve.x1 * rx, vals.y + curve.y1 * ry);
      }
      ctx.bezierCurveTo(vals.x + curve.x2 * rx,
        vals.y + curve.y2 * ry,
        vals.x + curve.x3 * rx,
        vals.y + curve.y3 * ry,
        vals.x + curve.x4 * rx,
        vals.y + curve.y4 * ry);
    });
    if (this._pInst._doFill) {
      if (mode === constants.PIE || mode == null) {
        ctx.lineTo(vals.x, vals.y);
      }
      ctx.closePath();
      ctx.fill();
      if (this._pInst._doStroke) {
        if (mode === constants.CHORD || mode === constants.PIE) {
          ctx.stroke();
          return this;
        }
      }
    }
    if (this._pInst._doStroke) {
      if (mode === constants.OPEN || mode == null) {
        ctx.beginPath();
        curves.forEach(function (curve, index) {
          if (index === 0) {
            ctx.moveTo(vals.x + curve.x1 * rx, vals.y + curve.y1 * ry);
          }
          ctx.bezierCurveTo(vals.x + curve.x2 * rx,
            vals.y + curve.y2 * ry, vals.x + curve.x3 * rx,
            vals.y + curve.y3 * ry, vals.x + curve.x4 * rx,
            vals.y + curve.y4 * ry);
        });
        ctx.stroke();
      }
    }
    return this;
  };

  p5.Graphics2D.prototype.ellipse = function(x, y, w, h) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if(ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if(ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    var vals = canvas.modeAdjust(x, y, w, h, this._pInst._ellipseMode);
    var kappa = 0.5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w,      // x-end
      ye = vals.y + vals.h,      // y-end
      xm = vals.x + vals.w / 2,  // x-middle
      ym = vals.y + vals.h / 2;  // y-middle
    ctx.beginPath();
    ctx.moveTo(vals.x, ym);
    ctx.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
    ctx.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
    ctx.closePath();
    if (doFill) {
      ctx.fill();
    }
    if (doStroke) {
      ctx.stroke();
    }
  };

  p5.Graphics2D.prototype.line = function(x1, y1, x2, y2) {
    var ctx = this.drawingContext;
    if (!this._pInst._doStroke) {
      return this;
    } else if(ctx.strokeStyle === styleEmpty){
      return this;
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return this;
  };

  p5.Graphics2D.prototype.point = function(x, y) {
    var ctx = this.drawingContext;
    var s = ctx.strokeStyle;
    var f = ctx.fillStyle;
    if (!this._pInst._doStroke) {
      return this;
    } else if(ctx.strokeStyle === styleEmpty){
      return this;
    }
    x = Math.round(x);
    y = Math.round(y);
    ctx.fillStyle = s;
    if (ctx.lineWidth > 1) {
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        ctx.lineWidth / 2,
        0,
        constants.TWO_PI,
        false
      );
      ctx.fill();
    } else {
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.fillStyle = f;
  };

  p5.Graphics2D.prototype.quad =
    function(x1, y1, x2, y2, x3, y3, x4, y4) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if(ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if(ctx.strokeStyle === styleEmpty) {
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

  p5.Graphics2D.prototype.rect = function(x, y, w, h, tl, tr, br, bl) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if(ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if(ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    var vals = canvas.modeAdjust(x, y, w, h, this._pInst._rectMode);
    // Translate the line by (0.5, 0.5) to draw a crisp rectangle border
    if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
      ctx.translate(0.5, 0.5);
    }
    ctx.beginPath();

    if (typeof tl === 'undefined') {
      // No rounded corners
      ctx.rect(vals.x, vals.y, vals.w, vals.h);
    } else {
      // At least one rounded corner
      // Set defaults when not specified
      if (typeof tr === 'undefined') { tr = tl; }
      if (typeof br === 'undefined') { br = tr; }
      if (typeof bl === 'undefined') { bl = br; }
      
      // Cache and compute several values
      var _x = vals.x;
      var _y = vals.y;
      var _w = vals.w;
      var _h = vals.h;
      var hw = _w / 2;
      var hh = _h / 2;

      // Clip radii
      if (_w < 2 * tl) { tl = hw; }
      if (_h < 2 * tl) { tl = hh; }
      if (_w < 2 * tr) { tr = hw; }
      if (_h < 2 * tr) { tr = hh; }
      if (_w < 2 * br) { br = hw; }
      if (_h < 2 * br) { br = hh; }
      if (_w < 2 * bl) { bl = hw; }
      if (_h < 2 * bl) { bl = hh; }

      // Draw shape
      ctx.beginPath();
      ctx.moveTo(_x + tl, _y);
      ctx.arcTo(_x + _w, _y, _x + _w, _y + _h, tr);
      ctx.arcTo(_x + _w, _y + _h, _x, _y + _h, br);
      ctx.arcTo(_x, _y + _h, _x, _y, bl);
      ctx.arcTo(_x, _y, _x + _w, _y, tl);
      ctx.closePath();
    }
    if (this._pInst._doFill) {
      ctx.fill();
    }
    if (this._pInst._doStroke) {
      ctx.stroke();
    }
    if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
      ctx.translate(-0.5, -0.5);
    }
    return this;
  };

  p5.Graphics2D.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill, doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if(ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if(ctx.strokeStyle === styleEmpty) {
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

  p5.Graphics2D.prototype.endShape =
  function (mode, vertices, isCurve, isBezier,
      isQuadratic, isContour, shapeKind) {
    if (vertices.length === 0) {
      return this;
    }
    if (!this._pInst._doStroke && !this._pInst._doFill) {
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
        var b = [], s = 1 - this._pInst._curveTightness;
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(vertices[1][0], vertices[1][1]);
        for (i = 1; i + 2 < numVerts; i++) {
          v = vertices[i];
          b[0] = [
            v[0],
            v[1]
          ];
          b[1] = [
            v[0] + (s * vertices[i + 1][0] - s * vertices[i - 1][0]) / 6,
            v[1] + (s * vertices[i + 1][1] - s * vertices[i - 1][1]) / 6
          ];
          b[2] = [
            vertices[i + 1][0] +
            (s * vertices[i][0]-s * vertices[i + 2][0]) / 6,
            vertices[i + 1][1]+(s * vertices[i][1] - s*vertices[i + 2][1]) / 6
          ];
          b[3] = [
            vertices[i + 1][0],
            vertices[i + 1][1]
          ];
          this.drawingContext.bezierCurveTo(b[1][0],b[1][1],
            b[2][0],b[2][1],b[3][0],b[3][1]);
        }
        if (closeShape) {
          this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
        }
        this._doFillStrokeClose();
      }
    } else if (isBezier&&(shapeKind===constants.POLYGON ||shapeKind === null)) {
      this.drawingContext.beginPath();
      for (i = 0; i < numVerts; i++) {
        if (vertices[i].isVert) {
          if (vertices[i].moveTo) {
            this.drawingContext.moveTo(vertices[i][0], vertices[i][1]);
          } else {
            this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
          }
        } else {
          this.drawingContext.bezierCurveTo(vertices[i][0], vertices[i][1],
            vertices[i][2], vertices[i][3], vertices[i][4], vertices[i][5]);
        }
      }
      this._doFillStrokeClose();
    } else if (isQuadratic &&
      (shapeKind === constants.POLYGON || shapeKind === null)) {
      this.drawingContext.beginPath();
      for (i = 0; i < numVerts; i++) {
        if (vertices[i].isVert) {
          if (vertices[i].moveTo) {
            this.drawingContext.moveTo([0], vertices[i][1]);
          } else {
            this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
          }
        } else {
          this.drawingContext.quadraticCurveTo(vertices[i][0], vertices[i][1],
            vertices[i][2], vertices[i][3]);
        }
      }
      this._doFillStrokeClose();
    } else {
      if (shapeKind === constants.POINTS) {
        for (i = 0; i < numVerts; i++) {
          v = vertices[i];
          if (this._pInst._doStroke) {
            this._pInst.stroke(v[6]);
          }
          this._pInst.point(v[0], v[1]);
        }
      } else if (shapeKind === constants.LINES) {
        for (i = 0; i + 1 < numVerts; i += 2) {
          v = vertices[i];
          if (this._pInst._doStroke) {
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
          this.drawingContext.lineTo(v[0], v[1]);
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[i + 2][5]);
            this.drawingContext.fill();
          }
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[i + 2][6]);
            this.drawingContext.stroke();
          }
          this.drawingContext.closePath();
        }
      } else if (shapeKind === constants.TRIANGLE_STRIP) {
        for (i = 0; i + 1 < numVerts; i++) {
          v = vertices[i];
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(vertices[i + 1][0], vertices[i + 1][1]);
          this.drawingContext.lineTo(v[0], v[1]);
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[i + 1][6]);
          }
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[i + 1][5]);
          }
          if (i + 2 < numVerts) {
            this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
            if (this._pInst._doStroke) {
              this._pInst.stroke(vertices[i + 2][6]);
            }
            if (this._pInst._doFill) {
              this._pInst.fill(vertices[i + 2][5]);
            }
          }
          this._doFillStrokeClose();
        }
      } else if (shapeKind === constants.TRIANGLE_FAN) {
        if (numVerts > 2) {
          this.drawingContext.beginPath();
          this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
          this.drawingContext.lineTo(vertices[1][0], vertices[1][1]);
          this.drawingContext.lineTo(vertices[2][0], vertices[2][1]);
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[2][5]);
          }
          if (this._pInst._doStroke) {
            this._pInst.stroke(vertices[2][6]);
          }
          this._doFillStrokeClose();
          for (i = 3; i < numVerts; i++) {
            v = vertices[i];
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
            this.drawingContext.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
            this.drawingContext.lineTo(v[0], v[1]);
            if (this._pInst._doFill) {
              this._pInst.fill(v[5]);
            }
            if (this._pInst._doStroke) {
              this._pInst.stroke(v[6]);
            }
            this._doFillStrokeClose();
          }
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
          if (this._pInst._doFill) {
            this._pInst.fill(vertices[i + 3][5]);
          }
          if (this._pInst._doStroke) {
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
              this.drawingContext.moveTo(vertices[i + 2][0], vertices[i+2][1]);
              this.drawingContext.lineTo(v[0], v[1]);
              this.drawingContext.lineTo(vertices[i + 1][0], vertices[i+1][1]);
              this.drawingContext.lineTo(vertices[i + 3][0], vertices[i+3][1]);
              if (this._pInst._doFill) {
                this._pInst.fill(vertices[i + 3][5]);
              }
              if (this._pInst._doStroke) {
                this._pInst.stroke(vertices[i + 3][6]);
              }
            } else {
              this.drawingContext.moveTo(v[0], v[1]);
              this.drawingContext.lineTo(vertices[i + 1][0], vertices[i+1][1]);
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
    return this;
  };
  //////////////////////////////////////////////
  // SHAPE | Attributes
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.noSmooth = function() {
    this.drawingContext.mozImageSmoothingEnabled = false;
    this.drawingContext.webkitImageSmoothingEnabled = false;
    return this;
  };

  p5.Graphics2D.prototype.smooth = function() {
    this.drawingContext.mozImageSmoothingEnabled = true;
    this.drawingContext.webkitImageSmoothingEnabled = true;
    return this;
  };

  p5.Graphics2D.prototype.strokeCap = function(cap) {
    if (cap === constants.ROUND ||
      cap === constants.SQUARE ||
      cap === constants.PROJECT) {
      this.drawingContext.lineCap = cap;
    }
    return this;
  };

  p5.Graphics2D.prototype.strokeJoin = function(join) {
    if (join === constants.ROUND ||
      join === constants.BEVEL ||
      join === constants.MITER) {
      this.drawingContext.lineJoin = join;
    }
    return this;
  };

  p5.Graphics2D.prototype.strokeWeight = function(w) {
    if (typeof w === 'undefined' || w === 0) {
      // hack because lineWidth 0 doesn't work
      this.drawingContext.lineWidth = 0.0001;
    } else {
      this.drawingContext.lineWidth = w;
    }
    return this;
  };

  p5.Graphics2D.prototype._getFill = function(){
    return this.drawingContext.fillStyle;
  };

  p5.Graphics2D.prototype._getStroke = function(){
    return this.drawingContext.strokeStyle;
  };

  //////////////////////////////////////////////
  // SHAPE | Curves
  //////////////////////////////////////////////
  p5.Graphics2D.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    this._pInst.beginShape();
    this._pInst.vertex(x1, y1);
    this._pInst.bezierVertex(x2, y2, x3, y3, x4, y4);
    this._pInst.endShape();
    return this;
  };
  p5.Graphics2D.prototype.curve = function (x1, y1, x2, y2, x3, y3, x4, y4) {
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

  p5.Graphics2D.prototype._doFillStrokeClose = function () {
    if (this._pInst._doFill) {
      this.drawingContext.fill();
    }
    if (this._pInst._doStroke) {
      this.drawingContext.stroke();
    }
    this.drawingContext.closePath();
  };

  //////////////////////////////////////////////
  // TRANSFORM
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.applyMatrix =
  function(n00, n01, n02, n10, n11, n12) {
    this.drawingContext.transform(n00, n01, n02, n10, n11, n12);
  };

  p5.Graphics2D.prototype.resetMatrix = function() {
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    return this;
  };

  p5.Graphics2D.prototype.rotate = function(r) {
    this.drawingContext.rotate(r);
  };

  p5.Graphics2D.prototype.scale = function() {
    var x = 1.0,
      y = 1.0;
    if (arguments.length === 1) {
      x = y = arguments[0];
    } else {
      x = arguments[0];
      y = arguments[1];
    }
    this.drawingContext.scale(x, y);

    return this;
  };

  p5.Graphics2D.prototype.shearX = function(angle) {
    if (this._pInst._angleMode === constants.DEGREES) {
      angle = this._pInst.radians(angle);
    }
    this.drawingContext.transform(1, 0, this._pInst.tan(angle), 1, 0, 0);
    return this;
  };

  p5.Graphics2D.prototype.shearY = function(angle) {
    if (this._pInst._angleMode === constants.DEGREES) {
      angle = this._pInst.radians(angle);
    }
    this.drawingContext.transform(1, this._pInst.tan(angle), 0, 1, 0, 0);
    return this;
  };

  p5.Graphics2D.prototype.translate = function(x, y) {
    this.drawingContext.translate(x, y);
    return this;
  };

  //////////////////////////////////////////////
  // TYPOGRAPHY
  //////////////////////////////////////////////
  p5.Graphics2D.prototype.text = function (str, x, y, maxWidth, maxHeight) {
    if (typeof str !== 'string') {
      str = str.toString();
    }
    if (typeof maxWidth !== 'undefined') {
      y += this._pInst._textLeading;
      maxHeight += y;
    }
    str = str.replace(/(\t)/g, '  ');
    var cars = str.split('\n');
    for (var ii = 0; ii < cars.length; ii++) {
      var line = '';
      var words = cars[ii].split(' ');
      for (var n = 0; n < words.length; n++) {
        if (y + this._pInst._textLeading <= maxHeight ||
          typeof maxHeight === 'undefined') {
          var testLine = line + words[n] + ' ';
          var metrics = this.drawingContext.measureText(testLine);
          var testWidth = metrics.width;
          if (typeof maxWidth !== 'undefined' && testWidth > maxWidth) {
            if (this._pInst._doFill) {
              this.drawingContext.fillText(line, x, y);
            }
            if (this._pInst._doStroke) {
              this._pInst.drawingContext.strokeText(line, x, y);
            }
            line = words[n] + ' ';
            y += this._pInst._textLeading;
          } else {
            line = testLine;
          }
        }
      }
      if (this._pInst._doFill) {
        this.drawingContext.fillText(line, x, y);
      }
      if (this._pInst._doStroke) {
        this.drawingContext.strokeText(line, x, y);
      }
      y += this._pInst._textLeading;
    }
  };

  p5.Graphics2D.prototype.textWidth = function(s) {
    return this.drawingContext.measureText(s).width;
  };

  p5.Graphics2D.prototype.textAlign = function(h,v){
    if (h === constants.LEFT ||
      h === constants.RIGHT ||
      h === constants.CENTER) {
      this.drawingContext.textAlign = h;
    }
    if (v === constants.TOP ||
      v === constants.BOTTOM ||
      v === constants.CENTER ||
      v === constants.BASELINE) {
      this.drawingContext.textBaseline = v;
    }
  };

  p5.Graphics2D.prototype._applyTextProperties =
  function(textStyle, textSize, textFont){
    var str = textStyle + ' ' + textSize + 'px ' + textFont;
    this.drawingContext.font = str;
  };
  //////////////////////////////////////////////
  // STRUCTURE
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.push = function() {
    this.drawingContext.save();
  };

  p5.Graphics2D.prototype.pop = function() {
    this.drawingContext.restore();
  };

  return p5.Graphics2D;
});