define(function (require) {

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

  p5.Graphics2D = function (elt, pInst, isMainCanvas) {
    p5.Graphics.call(this, elt, pInst, isMainCanvas);
    this.drawingContext = this.canvas.getContext('2d');
    this._pInst._setProperty('drawingContext', this.drawingContext);
    return this;
  };

  p5.Graphics2D.prototype = Object.create(p5.Graphics.prototype);

  p5.Graphics2D.prototype._applyDefaults = function () {
    this.drawingContext.fillStyle = '#FFFFFF';
    this.drawingContext.strokeStyle = '#000000';
    this.drawingContext.lineCap = constants.ROUND;
    this.drawingContext.font = 'normal 12px sans-serif';
  };
  //////////////////////////////////////////////
  // COLOR | Setting
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.background = function () {
    var curFill = this.drawingContext.fillStyle;
    // create background rect
    var ctx = this.drawingContext;
    ctx.fillStyle = p5.Color.getColor.apply(this._pInst, arguments);
    ctx.fillRect(0, 0, this._pInst.width, this._pInst.height);
    // reset fill
    ctx.fillStyle = curFill;
  };

  p5.Graphics2D.prototype.clear = function () {
    this.drawingContext.clearRect(0, 0, this._pInst.width, this._pInst.height);
  };

  p5.Graphics2D.prototype.fill = function () {
    this.drawingContext.fillStyle =
      p5.Color.getColor.apply(this._pInst, arguments);
  };

  p5.Graphics2D.prototype.stroke = function () {
    this.drawingContext.strokeStyle =
      p5.Color.getColor.apply(this._pInst, arguments);
  };

  //////////////////////////////////////////////
  // IMAGE | Loading & Displaying
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.image = function (img, x, y, w, h) {
    // tint the image if there is a tint
    if (this._pInst._tint) {
      this.drawingContext.drawImage(getTintedImageCanvas(img), x, y, w, h);
    } else {
      var frame = img.canvas ? img.canvas : img.elt; // may use vid src
      this.drawingContext.drawImage(frame, x, y, w, h);
    }
  };

  /**
   * Apply the current tint color to the input image, return the resulting
   * canvas.
   *
   * @param {p5.Image} The image to be tinted
   * @return {canvas} The resulting tinted canvas
   */
  function getTintedImageCanvas(img) {
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
  }

  //////////////////////////////////////////////
  // IMAGE | Pixels
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.blend = function () {
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
      sx = arguments[0];
      sy = arguments[1];
      sw = arguments[2];
      sh = arguments[3];
      dx = arguments[4];
      dy = arguments[5];
      dw = arguments[6];
      dh = arguments[7];
      srcImage = this._pInst;
    } else {
      throw new Error('Signature not supported');
    }

    this.drawingContext.drawImage(srcImage.canvas,
      sx, sy, sw, sh, dx, dy, dw, dh
    );
  };

  p5.Graphics2D.prototype.get = function (x, y, w, h) {
    if (x > this.width || y > this.height || x < 0 || y < 0) {
      return [0, 0, 0, 255];
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
      //auto constrain the width and height to
      //dimensions of the source image
      w = Math.min(w, this.width);
      h = Math.min(h, this.height);

      var region = new p5.Image(w, h);
      region.drawingContext.putImageData(imageData, 0, 0, 0, 0, w, h);

      return region;
    }
  };

  p5.Graphics2D.prototype.loadPixels = function () {
    var imageData = this.drawingContext.getImageData(
      0,
      0,
      this._pInst.width,
      this._pInst.height);
    this._setProperty('imageData', imageData);
    this._pInst._setProperty('pixels', imageData.data);
  };

  p5.Graphics2D.prototype.set = function (x, y, imgOrCol) {
    if (imgOrCol instanceof p5.Image) {
      this.drawingContext.drawImage(imgOrCol.canvas, x, y);
      this._pInst.loadPixels.call(this._pInst);
    } else {
      var idx = 4 * (y * this.width + x);
      if (!this.imageData) {
        this._pInst.loadPixels.call(this._pInst);
      }
      if (typeof imgOrCol === 'number') {
        if (idx < this.pixels.length) {
          this._pInst.pixels[idx] = imgOrCol;
          this._pInst.pixels[idx + 1] = imgOrCol;
          this._pInst.pixels[idx + 2] = imgOrCol;
          this._pInst.pixels[idx + 3] = 255;
          //this.updatePixels.call(this);
        }
      } else if (imgOrCol instanceof Array) {
        if (imgOrCol.length < 4) {
          throw new Error('pixel array must be of the form [R, G, B, A]');
        }
        if (idx < this.pixels.length) {
          this._pInst.pixels[idx] = imgOrCol[0];
          this._pInst.pixels[idx + 1] = imgOrCol[1];
          this._pInst.pixels[idx + 2] = imgOrCol[2];
          this._pInst.pixels[idx + 3] = imgOrCol[3];
          //this.updatePixels.call(this);
        }
      } else if (imgOrCol instanceof p5.Color) {
        if (idx < this.pixels.length) {
          this._pInst.pixels[idx] = imgOrCol.rgba[0];
          this._pInst.pixels[idx + 1] = imgOrCol.rgba[1];
          this._pInst.pixels[idx + 2] = imgOrCol.rgba[2];
          this._pInst.pixels[idx + 3] = imgOrCol.rgba[3];
          //this.updatePixels.call(this);
        }
      }
    }
  };

  p5.Graphics2D.prototype.updatePixels = function (x, y, w, h) {
    this.drawingContext.putImageData(this.imageData, x, y, 0, 0, w, h);
  };

  //////////////////////////////////////////////
  // SHAPE | 2D Primitives
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.arc = function (x, y, w, h, strt, stp, mode, crvs) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill,
      doStroke = this._pInst._doStroke;
    var vals = canvas.arcModeAdjust(
      x,
      y,
      w,
      h,
      this._pInst._ellipseMode
    );
    // var radius = (vals.h > vals.w) ? vals.h * 0.5 : vals.w * 0.5,
    //scale the arc if it is oblong
    // var xScale = (vals.h > vals.w) ? vals.w / vals.h : 1,
    // var yScale = (vals.h > vals.w) ? 1 : vals.h / vals.w;

    var rx = vals.w / 2;
    var ry = vals.h / 2;

    ctx.beginPath();
    crvs.forEach(function (curve, index) {
      if (index === 0) {
        ctx.moveTo(vals.x + curve.x1 * rx, vals.y + curve.y1 * ry);
      }
      ctx.bezierCurveTo(
        vals.x + curve.x2 * rx, vals.y + curve.y2 * ry,
        vals.x + curve.x3 * rx, vals.y + curve.y3 * ry,
        vals.x + curve.x4 * rx, vals.y + curve.y4 * ry
      );
    });

    if (doFill) {
      if (mode === constants.PIE || mode == null) {
        ctx.lineTo(vals.x, vals.y);
      }
      ctx.closePath();
      ctx.fill();
      if (doStroke) {
        if (mode === constants.CHORD || mode === constants.PIE) {
          ctx.stroke();
          return this;
        }
      }
    }

    if (doStroke) {
      if (mode === constants.OPEN || mode == null) {
        ctx.beginPath();
        crvs.forEach(function (curve, index) {
          if (index === 0) {
            ctx.moveTo(vals.x + curve.x1 * rx, vals.y + curve.y1 * ry);
          }
          ctx.bezierCurveTo(
            vals.x + curve.x2 * rx, vals.y + curve.y2 * ry,
            vals.x + curve.x3 * rx, vals.y + curve.y3 * ry,
            vals.x + curve.x4 * rx, vals.y + curve.y4 * ry
          );
        });
        ctx.stroke();
      }
    }
    return this;
  };

  p5.Graphics2D.prototype.ellipse = function (x, y, w, h) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill,
      doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if (ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    var vals = canvas.modeAdjust(x, y, w, h, this._pInst._ellipseMode);
    var kappa = 0.5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w, // x-end
      ye = vals.y + vals.h, // y-end
      xm = vals.x + vals.w / 2, // x-middle
      ym = vals.y + vals.h / 2; // y-middle
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

  p5.Graphics2D.prototype.line = function (x1, y1, x2, y2) {
    var ctx = this.drawingContext;
    if (!this._pInst._doStroke) {
      return this;
    } else if (ctx.strokeStyle === styleEmpty) {
      return this;
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return this;
  };

  p5.Graphics2D.prototype.point = function (x, y) {
    var ctx = this.drawingContext;
    var s = ctx.strokeStyle;
    var f = ctx.fillStyle;
    if (!this._pInst._doStroke) {
      return this;
    } else if (ctx.strokeStyle === styleEmpty) {
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
    function (x1, y1, x2, y2, x3, y3, x4, y4) {
      var ctx = this.drawingContext;
      var doFill = this._pInst._doFill,
        doStroke = this._pInst._doStroke;
      if (doFill && !doStroke) {
        if (ctx.fillStyle === styleEmpty) {
          return this;
        }
      } else if (!doFill && doStroke) {
        if (ctx.strokeStyle === styleEmpty) {
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

  p5.Graphics2D.prototype.rect = function (a, b, c, d) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill,
      doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if (ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (ctx.strokeStyle === styleEmpty) {
        return this;
      }
    }
    var vals = canvas.modeAdjust(a, b, c, d, this._pInst._rectMode);
    ctx.beginPath();
    ctx.rect(vals.x, vals.y, vals.w, vals.h);
    if (doFill) {
      ctx.fill();
    }
    if (doStroke) {
      ctx.stroke();
    }
    return this;
  };

  p5.Graphics2D.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
    var ctx = this.drawingContext;
    var doFill = this._pInst._doFill,
      doStroke = this._pInst._doStroke;
    if (doFill && !doStroke) {
      if (ctx.fillStyle === styleEmpty) {
        return this;
      }
    } else if (!doFill && doStroke) {
      if (ctx.strokeStyle === styleEmpty) {
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

  //////////////////////////////////////////////
  // SHAPE | Attributes
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.noSmooth = function () {
    this.drawingContext.mozImageSmoothingEnabled = false;
    this.drawingContext.webkitImageSmoothingEnabled = false;
  };

  p5.Graphics2D.prototype.smooth = function () {
    this.drawingContext.mozImageSmoothingEnabled = true;
    this.drawingContext.webkitImageSmoothingEnabled = true;
  };

  p5.Graphics2D.prototype.strokeCap = function (cap) {
    this.drawingContext.lineCap = cap;
  };

  p5.Graphics2D.prototype.strokeJoin = function (join) {
    this.drawingContext.lineJoin = join;
  };

  p5.Graphics2D.prototype.strokeWeight = function (w) {
    if (typeof w === 'undefined' || w === 0) {
      // hack because lineWidth 0 doesn't work
      this.drawingContext.lineWidth = 0.0001;
    } else {
      this.drawingContext.lineWidth = w;
    }
    return this;
  };

  //////////////////////////////////////////////
  // SHAPE | Curves
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var ctx = this.drawingContext;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    //for each point as considered by detail, iterate
    for (var i = 0; i <= this._pInst._bezierDetail; i++) {
      var t = i / parseFloat(this._pInst._bezierDetail);
      var x = p5.prototype.bezierPoint(x1, x2, x3, x4, t);
      var y = p5.prototype.bezierPoint(y1, y2, y3, y4, t);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  p5.Graphics2D.prototype.curve = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var ctx = this.drawingContext;
    ctx.moveTo(x1, y1);
    ctx.beginPath();
    for (var i = 0; i <= this._pInst._curveDetail; i++) {
      var t = parseFloat(i / this._pInst._curveDetail);
      var x = p5.prototype.curvePoint(x1, x2, x3, x4, t);
      var y = p5.prototype.curvePoint(y1, y2, y3, y4, t);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();
  };

  //////////////////////////////////////////////
  // SHAPE | Vertex
  //////////////////////////////////////////////

  //@TODO

  //////////////////////////////////////////////
  // TRANSFORM
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.applyMatrix =
    function (n00, n01, n02, n10, n11, n12) {
      this.drawingContext.transform(n00, n01, n02, n10, n11, n12);
    };

  p5.Graphics2D.prototype.resetMatrix = function () {
    this.drawingContext.setTransform();
  };

  p5.Graphics2D.prototype.rotate = function (r) {
    this.drawingContext.rotate(r);
  };

  p5.Graphics2D.prototype.scale = function () {
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

  p5.Graphics2D.prototype.shearX = function (angle) {
    this.drawingContext.transform(1, 0, this.tan(angle), 1, 0, 0);
  };

  p5.Graphics2D.prototype.shearY = function (angle) {
    this.drawingContext.transform(1, this.tan(angle), 0, 1, 0, 0);
  };

  p5.Graphics2D.prototype.translate = function (x, y) {
    this.drawingContext.translate(x, y);
  };

  //////////////////////////////////////////////
  // STRUCTURE
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.push = function () {
    this.drawingContext.save();
  };

  p5.Graphics2D.prototype.pop = function () {
    this.drawingContext.restore();
  };

  return p5.Graphics2D;
});