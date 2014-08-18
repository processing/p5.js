
define(function(require) {

  var p5 = require('core');
  var canvas = require('canvas');
  var constants = require('constants');

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
  // TRANSFORM
  //////////////////////////////////////////////

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

  p5.Graphics2D.prototype.push = function() {
    this.drawingContext.save();
  };


  p5.Graphics2D.prototype.pop = function() {
    this.drawingContext.restore();
  };
  
  return p5.Graphics2D;
});