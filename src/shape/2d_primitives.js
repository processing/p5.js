/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var canvas = require('canvas');
  var constants = require('constants');


  /**
   * Draw an arc.
   *
   * If a,b,c,d,start and stop are the only params provided, draws an
   * open pie.
   *
   * If mode is provided draws the arc either open, chord or pie, dependent
   * on the variable provided.
   * 
   * @method arc
   * @param  {Number} a      x-coordinate of the arc's ellipse
   * @param  {Number} b      y-coordinate of the arc's ellipse
   * @param  {Number} c      width of the arc's ellipse by default
   * @param  {Number} d      height of the arc's ellipse by default
   * @param  {Number} start  angle to start the arc, specified in radians
   * @param  {Number} stop   angle to stop the arc, specified in radians
   * @param  {String} [mode] optional parameter to determine the way of drawing
   *                         the arc
   * @return {Object}        the p5 object
   * @example
   * <div>
   * <code>
   * arc(50, 55, 50, 50, 0, HALF_PI);
   * noFill();
   * arc(50, 55, 60, 60, HALF_PI, PI);
   * arc(50, 55, 70, 70, PI, PI+QUARTER_PI);
   * arc(50, 55, 80, 80, PI+QUARTER_PI, TWO_PI);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, CHORD);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, PIE);
   * </code>
   * </div>
   */
	p5.prototype.arc = function(x, y, width, height, start, stop, mode) {
    if (!this._doStroke && !this._doFill) {
      return;
    }
    if (this._angleMode === constants.DEGREES) {
      start = this.radians(start);
      stop = this.radians(stop);
    }
    var ctx = this.drawingContext;
    var vals = canvas.arcModeAdjust(
      x,
      y,
      width,
      height,
      this._ellipseMode
    );
    var radius = (vals.h > vals.w) ? vals.h / 2 : vals.w / 2,
      //scale the arc if it is oblong
      xScale = (vals.h > vals.w) ? vals.w / vals.h : 1,
      yScale = (vals.h > vals.w) ? 1 : vals.h / vals.w;
    ctx.save();
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
    if (this._doFill) {
      ctx.fill();
    }
    if(this._doStroke && mode !== constants.OPEN && mode !== undefined) {
      // final stroke must be after fill so the fill does not
      // cover part of the line
      ctx.stroke();
    }
    ctx.restore();

    return this;
  };

  /**
   * Draws an ellipse (oval) to the screen. An ellipse with equal width and
   * height is a circle. By default, the first two parameters set the location,
   * and the third and fourth parameters set the shape's width and height. The
   * origin may be changed with the ellipseMode() function. 
   * 
   * @method ellipse
   * @param  {Number} a x-coordinate of the ellipse.
   * @param  {Number} b y-coordinate of the ellipse.
   * @param  {Number} c width of the ellipse.
   * @param  {Number} d height of the ellipse.
   * @return {p5}       the p5 object
   * @example
   * <div>
   * <code>
   * ellipse(56, 46, 55, 55);
   * </code>
   * </div>
   */
  p5.prototype.ellipse = function(x, y, w, h) {
    if (!this._doStroke && !this._doFill) {
      return;
    }

    // processing supports negative width and heights for ellipses
    w = Math.abs(w);
    h = Math.abs(h);

    var ctx = this.drawingContext;
    var vals = canvas.modeAdjust(
      x,
      y,
      w,
      h,
      this._ellipseMode
    );
    ctx.beginPath();
    if (w === h) {
      ctx.arc(vals.x+vals.w/2, vals.y+vals.w/2, vals.w/2, 0, 2*Math.PI, false);
    } else {
      var kappa = 0.5522848,
        ox = (vals.w / 2) * kappa, // control point offset horizontal
        oy = (vals.h / 2) * kappa, // control point offset vertical
        xe = vals.x + vals.w,      // x-end
        ye = vals.y + vals.h,      // y-end
        xm = vals.x + vals.w / 2,  // x-middle
        ym = vals.y + vals.h / 2;  // y-middle
      ctx.moveTo(vals.x, ym);
      ctx.bezierCurveTo(
        vals.x,
        ym - oy,
        xm - ox,
        vals.y,
        xm,
        vals.y
      );
      ctx.bezierCurveTo(
        xm + ox,
        vals.y,
        xe,
        ym - oy,
        xe,
        ym
      );
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(
        xm - ox,
        ye,
        vals.x,
        ym + oy,
        vals.x,
        ym
      );
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
  /**
   * Draws a line (a direct path between two points) to the screen. The version
   * of line() with four parameters draws the line in 2D. To color a line, use
   * the stroke() function. A line cannot be filled, therefore the fill()
   * function will not affect the color of a line. 2D lines are drawn with a
   * width of one pixel by default, but this can be changed with the
   * strokeWeight() function.
   * 
   * @method line
   * @param  {Number} x1 the x-coordinate of the first point
   * @param  {Number} y1 the y-coordinate of the first point
   * @param  {Number} x2 the x-coordinate of the second point
   * @param  {Number} y2 the y-coordinate of the second point
   * @return {p5}        the p5 object
   * @example
   * <div>
   * <code>
   * line(30, 20, 85, 75);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * line(30, 20, 85, 20);
   * stroke(126);
   * line(85, 20, 85, 75);
   * stroke(255);
   * line(85, 75, 30, 75);
   * </code>
   * </div>
   */
  p5.prototype.line = function(x1, y1, x2, y2) {
    if (!this._doStroke) {
      return;
    }
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

  /**
   * Draws a point, a coordinate in space at the dimension of one pixel.
   * The first parameter is the horizontal value for the point, the second
   * value is the vertical value for the point.
   * 
   * @method point
   * @param  {Number} x the x-coordinate
   * @param  {Number} y the y-coordinate
   * @return {p5}       the p5 object
   * @example
   * <div>
   * <code>
   * point(30, 20);
   * point(85, 20);
   * point(85, 75);
   * point(30, 75);
   * </code>
   * </div>
   */
  p5.prototype.point = function(x, y) {
    if (!this._doStroke) {
      return;
    }
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

    return this;
  };


  /**
   * Draw a quad. A quad is a quadrilateral, a four sided polygon. It is
   * similar to a rectangle, but the angles between its edges are not
   * constrained to ninety degrees. The first pair of parameters (x1,y1)
   * sets the first vertex and the subsequent pairs should proceed
   * clockwise or counter-clockwise around the defined shape.
   * 
   * @method quad
   * @param {type} x1 the x-coordinate of the first point
   * @param {type} y1 the y-coordinate of the first point 
   * @param {type} x2 the x-coordinate of the second point
   * @param {type} y2 the y-coordinate of the second point
   * @param {type} x3 the x-coordinate of the third point
   * @param {type} y3 the y-coordinate of the third point
   * @param {type} x4 the x-coordinate of the fourth point
   * @param {type} y4 the y-coordinate of the fourth point
   * @return {p5}     the p5 object
   * @example
   * <div>
   * <code>   
   * quad(38, 31, 86, 20, 69, 63, 30, 76);
   * </code>
   * </div>
   */
  p5.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (!this._doStroke && !this._doFill) {
      return;
    }
    var ctx = this.drawingContext;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    if (this._doFill) {
      ctx.fill();
    }
    if (this._doStroke) {
      ctx.stroke();
    }

    return this;
  };

  /**
  * Draws a rectangle to the screen. A rectangle is a four-sided shape with
  * every angle at ninety degrees. By default, the first two parameters set
  * the location of the upper-left corner, the third sets the width, and the
  * fourth sets the height. The way these parameters are interpreted, however,
  * may be changed with the rectMode() function.
  *
  * @method rect
  * @param  {Number} a x-coordinate of the rectangle
  * @param  {Number} b y-coordinate of the rectangle
  * @param  {Number} c width of the rectangle
  * @param  {Number} d height of the rectangle
  * @return {p5}       the p5 object
  * @example
  * <div>
  * <code>
  * rect(30, 20, 55, 55);
  * </code>
  * </div>
  */
  p5.prototype.rect = function(a, b, c, d) {
    if (!this._doStroke && !this._doFill) {
      return;
    }
    var vals = canvas.modeAdjust(a, b, c, d, this._rectMode);
    var ctx = this.drawingContext;
    // Translate the line by (0.5, 0.5) to draw a crisp rectangle border
    if (this._doStroke && ctx.lineWidth % 2 === 1) {
      ctx.translate(0.5, 0.5);
    }
    ctx.beginPath();
    ctx.rect(vals.x, vals.y, vals.w, vals.h);
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

  /**
  * A triangle is a plane created by connecting three points. The first two
  * arguments specify the first point, the middle two arguments specify the
  * second point, and the last two arguments specify the third point.
  * 
  * @method triangle
  * @param  {Number} x1 x-coordinate of the first point
  * @param  {Number} y1 y-coordinate of the first point
  * @param  {Number} x2 x-coordinate of the second point
  * @param  {Number} y2 y-coordinate of the second point
  * @param  {Number} x3 x-coordinate of the third point
  * @param  {Number} y3 y-coordinate of the third point
  * @return {p5}        the p5 object
  * @example
  * <div>
  * <code>
  * triangle(30, 75, 58, 20, 86, 75);
  * </code>
  * </div>
  */
  p5.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
    if (!this._doStroke && !this._doFill) {
      return;
    }
    var ctx = this.drawingContext;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    if (this._doFill) {
      ctx.fill();
    }
    if (this._doStroke) {
      ctx.stroke();
    }

    return this;
  };

  return p5;

});
