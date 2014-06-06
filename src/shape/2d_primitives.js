/**
 * @module Shape
 * @for 2D Primitives
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
   *   <div>
   *     <img src="http://processing.org/reference/images/arc_.png">
   *     <code>
   *       arc(50, 55, 50, 50, 0, HALF_PI);
   *       noFill();
   *       arc(50, 55, 60, 60, HALF_PI, PI);
   *       arc(50, 55, 70, 70, PI, PI+QUARTER_PI);
   *       arc(50, 55, 80, 80, PI+QUARTER_PI, TWO_PI);
   *     </code>
   *   </div>
   *
   *   <div>
   *     <img src="http://processing.org/reference/images/arc_2.png">
   *     <code>
   *       arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
   *     </code>
   *   </div>
   *
   *   <div>
   *     <img src="http://processing.org/reference/images/arc_3.png">
   *     <code>
   *       arc(50, 50, 80, 80, 0, PI+QUARTER_PI, CHORD);
   *     </code>
   *   </div>
   *
   *   <div>
   *     <img src="http://processing.org/reference/images/arc_4.png">
   *     <code>
   *       arc(50, 50, 80, 80, 0, PI+QUARTER_PI, PIE);
   *     </code>
   *   </div>
   */
	p5.prototype.arc = function(x, y, width, height, start, stop, mode) {
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
    this._curElement.context.scale(xScale, yScale);
    this._curElement.context.beginPath();
    this._curElement.context.arc(vals.x, vals.y, radius, start, stop);
    this._curElement.context.stroke();
    if (mode === constants.CHORD || mode === constants.OPEN) {
      this._curElement.context.closePath();
    } else if (mode === constants.PIE || mode === undefined) {
      this._curElement.context.lineTo(vals.x, vals.y);
      this._curElement.context.closePath();
    }
    this._curElement.context.fill();
    if(mode !== constants.OPEN && mode !== undefined) {
      // final stroke must be after fill so the fill does not
      // cover part of the line
      this._curElement.context.stroke();
    }

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
   */
  p5.prototype.ellipse = function(x, y, width, height) {
    var vals = canvas.modeAdjust(
      x,
      y,
      width,
      height,
      this._ellipseMode
    );
    var kappa = 0.5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w,      // x-end
      ye = vals.y + vals.h,      // y-end
      xm = vals.x + vals.w / 2,  // x-middle
      ym = vals.y + vals.h / 2;  // y-middle
    this._curElement.context.beginPath();
    this._curElement.context.moveTo(vals.x, ym);
    this._curElement.context.bezierCurveTo(
      vals.x,
      ym - oy,
      xm - ox,
      vals.y,
      xm,
      vals.y
    );
    this._curElement.context.bezierCurveTo(
      xm + ox,
      vals.y,
      xe,
      ym - oy,
      xe,
      ym
    );
    this._curElement.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this._curElement.context.bezierCurveTo(
      xm - ox,
      ye,
      vals.x,
      ym + oy,
      vals.x,
      ym
    );
    this._curElement.context.closePath();
    this._curElement.context.fill();
    this._curElement.context.stroke();

    return this;
  };
  /**
   * Draws a line (a direct path between two points) to the screen. The version
   * of line() with four parameters draws the line in 2D. To color a line, use
   * the stroke() function. A line cannot be filled, therefore the fill()
   * function will not affect the color of a line. 2D lines are drawn with a
   * width of one pixel by default, but this can be changed with the
   * strokeWeight() function. The version with six parameters allows the line
   * to be placed anywhere within XYZ space. Drawing this shape in 3D with the
   * z parameter requires the P3D parameter in combination with size() as shown
   * in the above example. 
   * 
   * @method line
   * @param  {Number} x1 the x-coordinate of the first point
   * @param  {Number} y1 the y-coordinate of the first point
   * @param  {Number} x2 the x-coordinate of the second point
   * @param  {Number} y2 the y-coordinate of the second point
   * @return {p5}        the p5 object
   */
  p5.prototype.line = function(x1, y1, x2, y2) {
    if (this._curElement.context.strokeStyle === 'rgba(0,0,0,0)') {
      return;
    }
    this._curElement.context.beginPath();
    this._curElement.context.moveTo(x1, y1);
    this._curElement.context.lineTo(x2, y2);
    this._curElement.context.stroke();

    return this;
  };

  /**
   * Draws a point, a coordinate in space at the dimension of one pixel.
   * The first parameter is the horizontal value for the point, the second
   * value is the vertical value for the point, and the optional third value is
   * the depth value. Drawing this shape in 3D with the z parameter requires
   * the P3D parameter in combination with size() as shown in the above
   * example.
   * 
   * @method point
   * @param  {Number} x the x-coordinate
   * @param  {Number} y the y-coordinate
   * @return {p5}       the p5 object
   */
  p5.prototype.point = function(x, y) {
    var s = this._curElement.context.strokeStyle;
    var f = this._curElement.context.fillStyle;
    if (s === 'rgba(0,0,0,0)') {
      return;
    }
    x = Math.round(x);
    y = Math.round(y);
    this._curElement.context.fillStyle = s;
    if (this._curElement.context.lineWidth > 1) {
      this._curElement.context.beginPath();
      this._curElement.context.arc(
        x,
        y,
        this._curElement.context.lineWidth / 2,
        0,
        constants.TWO_PI,
        false
      );
      this._curElement.context.fill();
    } else {
      this._curElement.context.fillRect(x, y, 1, 1);
    }
    this._curElement.context.fillStyle = f;

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
   */
  p5.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this._curElement.context.beginPath();
    this._curElement.context.moveTo(x1, y1);
    this._curElement.context.lineTo(x2, y2);
    this._curElement.context.lineTo(x3, y3);
    this._curElement.context.lineTo(x4, y4);
    this._curElement.context.closePath();
    this._curElement.context.fill();
    this._curElement.context.stroke();

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
  * 
  */
  p5.prototype.rect = function(a, b, c, d) {
    var vals = canvas.modeAdjust(a, b, c, d, this._rectMode);
    this._curElement.context.beginPath();
    this._curElement.context.rect(vals.x, vals.y, vals.w, vals.h);
    this._curElement.context.fill();
    this._curElement.context.stroke();

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
  */
  p5.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
    this._curElement.context.beginPath();
    this._curElement.context.moveTo(x1, y1);
    this._curElement.context.lineTo(x2, y2);
    this._curElement.context.lineTo(x3, y3);
    this._curElement.context.closePath();
    this._curElement.context.fill();
    this._curElement.context.stroke();

    return this;
  };

  return p5;

});
