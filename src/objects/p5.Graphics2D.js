
define(function(require) {

  var p5 = require('core');
  var canvas = require('canvas');
  var constants = require('constants');
  var filters = require('filters');

  p5.Graphics2D = function(elt, pInst) {
    p5.Graphics.call(this, constants.P2D, elt, pInst);
    // apply some defaults
    this.drawingContext.fillStyle = '#FFFFFF';
    this.drawingContext.strokeStyle = '#000000';
    this.drawingContext.lineCap = constants.ROUND;
    this._pInst._setProperty('_graphics', this);
    return this;
  };

  p5.Graphics2D.prototype = Object.create(p5.Graphics.prototype);

  //////////////////////////////////////////////
  // COLOR | Setting
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.background = function() {
    var curFill = this.drawingContext.fillStyle;
    // create background rect
    var ctx = this.drawingContext;
    ctx.fillStyle = p5.Color.getColor.apply(this._pInst, arguments);
    ctx.fillRect(0, 0, this._pInst.width, this._pInst.height);
    // reset fill
    ctx.fillStyle = curFill;
  };
  
  p5.Graphics2D.prototype.clear = function() {
    this.drawingContext.clearRect(0, 0, this._pInst.width, this._pInst.height);
  };

  p5.Graphics2D.prototype.fill = function() {
    this.drawingContext.fillStyle =
      p5.Color.getColor.apply(this._pInst, arguments);
  };

  p5.Graphics2D.prototype.stroke = function() {
    this.drawingContext.strokeStyle =
      p5.Color.getColor.apply(this._pInst, arguments);
  };

  //////////////////////////////////////////////
  // IMAGE | Loading & Displaying
  //////////////////////////////////////////////

  p5.prototype.image = function(img, x, y, w, h) {
    // tint the image if there is a tint
    if (this._tint) {
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

    for(var i = 0; i < pixels.length; i += 4) {
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];
      var a = pixels[i+3];

      newPixels[i] = r*this._tint[0]/255;
      newPixels[i+1] = g*this._tint[1]/255;
      newPixels[i+2] = b*this._tint[2]/255;
      newPixels[i+3] = a*this._tint[3]/255;
    }

    tmpCtx.putImageData(id, 0, 0);
    return tmpCanvas;
  }

  //////////////////////////////////////////////
  // SHAPE | 2D Primitives
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.arc = function(x, y, w, h, start, stop, mode) {
    var ctx = this.drawingContext;
    var vals = canvas.arcModeAdjust(x, y, w, h, this._pInst._ellipseMode);
    var radius = (vals.h > vals.w) ? vals.h / 2 : vals.w / 2,
      //scale the arc if it is oblong
      xScale = (vals.h > vals.w) ? vals.w / vals.h : 1,
      yScale = (vals.h > vals.w) ? 1 : vals.h / vals.w;
    ctx.scale(xScale, yScale);
    ctx.beginPath();
    ctx.arc(vals.x, vals.y, radius, start, stop);
    if (this._doStroke) {
      ctx.stroke();
    }
    if (mode === constants.CHORD || mode === constants.OPEN) {
      ctx.closePath();
    } else if (mode === constants.PIE || mode === undefined) {
      ctx.lineTo(vals.x, vals.y);
      ctx.closePath();
    }
    if (this._pInst._doFill) {
      ctx.fill();
    }
    if(this._pInst._doStroke && mode !== constants.OPEN && mode !== undefined) {
      // final stroke must be after fill so the fill does not
      // cover part of the line
      ctx.stroke();
    }
  };

  p5.Graphics2D.prototype.ellipse = function(x, y, w, h) {
    var ctx = this.drawingContext;
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
    if (this._pInst._doFill) {
      ctx.fill();
    }
    if (this._pInst._doStroke) {
      ctx.stroke();
    }
  };

  p5.Graphics2D.prototype.line = function(x1, y1, x2, y2) {
    var ctx = this.drawingContext;
    if (ctx.strokeStyle === 'rgba(0,0,0,0)') {
      return;
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
    if (s === 'rgba(0,0,0,0)') {
      return;
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
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    if (this._pInst._doFill) {
      ctx.fill();
    }
    if (this._doStroke) {
      ctx.stroke();
    }
  };

  p5.Graphics2D.prototype.rect = function(a, b, c, d) {
    var vals = canvas.modeAdjust(a, b, c, d, this._pInst._rectMode);
    var ctx = this.drawingContext;
    // Translate the line by (0.5, 0.5) to draw a crisp rectangle border
    if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
      ctx.translate(0.5, 0.5);
    }
    ctx.beginPath();
    ctx.rect(vals.x, vals.y, vals.w, vals.h);
    if (this._pInst._doFill) {
      ctx.fill();
    }
    if (this._pInst._doStroke) {
      ctx.stroke();
    }
    if (this._pInst._doStroke && ctx.lineWidth % 2 === 1) {
      ctx.translate(-0.5, -0.5);
    }
  };

  p5.Graphics2D.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
    var ctx = this.drawingContext;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    if (this._pInst._doFill) {
      ctx.fill();
    }
    if (this._pInst._doStroke) {
      ctx.stroke();
    }
  };

  //////////////////////////////////////////////
  // SHAPE | Attributes
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.noSmooth = function() {
    this.drawingContext.mozImageSmoothingEnabled = false;
    this.drawingContext.webkitImageSmoothingEnabled = false;
  };

  p5.Graphics2D.prototype.smooth = function() {
    this.drawingContext.mozImageSmoothingEnabled = true;
    this.drawingContext.webkitImageSmoothingEnabled = true;
  };

  p5.Graphics2D.prototype.strokeCap = function(cap) {
    this.drawingContext.lineCap=cap;
  };

  p5.Graphics2D.prototype.strokeJoin = function(join) {
    this.drawingContext.lineJoin = join;
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

  //////////////////////////////////////////////
  // SHAPE | Curves
  //////////////////////////////////////////////

  p5.Graphics2D.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
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

  p5.Graphics2D.prototype.curve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    var ctx = this.drawingContext;
    ctx.moveTo(x1,y1);
    ctx.beginPath();
    for (var i = 0; i <= this._pInst._curveDetail; i++) {
      var t = parseFloat(i/this._pInst._curveDetail);
      var x = p5.prototype.curvePoint(x1,x2,x3,x4,t);
      var y = p5.prototype.curvePoint(y1,y2,y3,y4,t);
      ctx.lineTo(x,y);
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
  function(n00, n01, n02, n10, n11, n12) {
    this.drawingContext.transform(n00, n01, n02, n10, n11, n12);
  };

  p5.Graphics2D.prototype.resetMatrix = function() {
    this.drawingContext.setTransform();
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
    this.drawingContext.transform(1, 0, this.tan(angle), 1, 0, 0);
  };

  p5.Graphics2D.prototype.shearY = function(angle) {
    this.drawingContext.transform(1, this.tan(angle), 0, 1, 0, 0);
  };

  p5.Graphics2D.prototype.translate = function(x, y) {
    this.drawingContext.translate(x, y);
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