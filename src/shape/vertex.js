/**
 * @module Shape
 * @submodule Vertex
 * @for p5
 * @requires core
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  p5.prototype._shapeKind = null;
  p5.prototype._shapeInited = false;
  p5.prototype._contourInited = false;
  p5.prototype._contourVertices = [];
  p5.prototype._curveVertices = [];

  /**
   * Use the beginContour() and endContour() function to create negative shapes
   * within shapes. For instance, the center of the letter 'O'. beginContour()
   * begins recording vertices for the shape and endContour() stops recording.
   * These functions can only be within a beginShape()/endShape() pair.
   *
   * Transformations such as translate(), rotate(), and scale() do not work
   * within a beginContour()/endContour() pair. It is also not possible to use
   * other shapes, such as ellipse() or rect() within.
   *
   * @method beginContour
   * @return {Object} the p5 object
   * @example
   * <div>
   * <code>
   * translate(50, 50);
   * stroke(255, 0, 0);
   * beginShape();
   * // Exterior part of shape
   * vertex(-40, -40);
   * vertex(40, -40);
   * vertex(40, 40);
   * vertex(-40, 40);
   * // Interior part of shape
   * beginContour();
   * vertex(-20, -20);
   * vertex(20, -20);
   * vertex(20, 20);
   * vertex(-20, 20);
   * endContour();
   * endShape(CLOSE);
   * </code>
   * </div>
   */
  p5.prototype.beginContour = function() {
    this._contourVertices = [];
    this._contourInited = true;

    return this;
  };

  /**
   * Using the beginShape() and endShape() functions allow creating more
   * complex forms. beginShape() begins recording vertices for a shape and
   * endShape() stops recording. The value of the kind parameter tells it which
   * types of shapes to create from the provided vertices. With no mode
   * specified, the shape can be any irregular polygon. The parameters
   * available for beginShape() are POINTS, LINES, TRIANGLES, TRIANGLE_FAN,
   * TRIANGLE_STRIP, QUADS, and QUAD_STRIP. After calling the beginShape()
   * function, a series of vertex() commands must follow. To stop drawing the
   * shape, call endShape(). Each shape will be outlined with the current
   * stroke color and filled with the fill color.
   *
   * Transformations such as translate(), rotate(), and scale() do not work
   * within beginShape(). It is also not possible to use other shapes, such as
   * ellipse() or rect() within beginShape().
   *
   * @method beginShape
   * @param  {Number/Constant} kind either POINTS, LINES, TRIANGLES,
   *                                TRIANGLE_FAN, TRIANGLE_STRIP, QUADS,
   *                                or QUAD_STRIP
   * @return {Object}               the p5 object
   * @example
   * <div>
   * <code>
   * beginShape();
   * vertex(30, 20);
   * vertex(85, 20);
   * vertex(85, 75);
   * vertex(30, 75);
   * endShape(CLOSE);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // currently not working   
   * beginShape(POINTS);
   * vertex(30, 20);
   * vertex(85, 20);
   * vertex(85, 75);
   * vertex(30, 75);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * beginShape(LINES);
   * vertex(30, 20);
   * vertex(85, 20);
   * vertex(85, 75);
   * vertex(30, 75);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * noFill();
   * beginShape();
   * vertex(30, 20);
   * vertex(85, 20);
   * vertex(85, 75);
   * vertex(30, 75);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * noFill();
   * beginShape();
   * vertex(30, 20);
   * vertex(85, 20);
   * vertex(85, 75);
   * vertex(30, 75);
   * endShape(CLOSE);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * beginShape(TRIANGLES);
   * vertex(30, 75);
   * vertex(40, 20);
   * vertex(50, 75);
   * vertex(60, 20);
   * vertex(70, 75);
   * vertex(80, 20);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * beginShape(TRIANGLE_STRIP);
   * vertex(30, 75);
   * vertex(40, 20);
   * vertex(50, 75);
   * vertex(60, 20);
   * vertex(70, 75);
   * vertex(80, 20);
   * vertex(90, 75);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * beginShape(TRIANGLE_FAN);
   * vertex(57.5, 50);
   * vertex(57.5, 15); 
   * vertex(92, 50); 
   * vertex(57.5, 85); 
   * vertex(22, 50); 
   * vertex(57.5, 15); 
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * beginShape(QUADS);
   * vertex(30, 20);
   * vertex(30, 75);
   * vertex(50, 75);
   * vertex(50, 20);
   * vertex(65, 20);
   * vertex(65, 75);
   * vertex(85, 75);
   * vertex(85, 20);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>  
   * beginShape(QUAD_STRIP); 
   * vertex(30, 20); 
   * vertex(30, 75); 
   * vertex(50, 20);
   * vertex(50, 75);
   * vertex(65, 20); 
   * vertex(65, 75); 
   * vertex(85, 20);
   * vertex(85, 75); 
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * beginShape();
   * vertex(20, 20);
   * vertex(40, 20);
   * vertex(40, 40);
   * vertex(60, 40);
   * vertex(60, 60);
   * vertex(20, 60);
   * endShape(CLOSE);
   * </code>
   * </div>
   */
  p5.prototype.beginShape = function(kind) {
    if (kind === constants.POINTS ||
      kind === constants.LINES ||
      kind === constants.TRIANGLES ||
      kind === constants.TRIANGLE_FAN ||
      kind === constants.TRIANGLE_STRIP ||
      kind === constants.QUADS ||
      kind === constants.QUAD_STRIP) {
      this._shapeKind = kind;
    } else {
      this._shapeKind = null;
    }

    this._shapeInited = true;
    this.drawingContext.beginPath();

    return this;
  };

  /**
   * Specifies vertex coordinates for Bezier curves. Each call to
   * bezierVertex() defines the position of two control points and
   * one anchor point of a Bezier curve, adding a new segment to a
   * line or shape. The first time bezierVertex() is used within a
   * beginShape() call, it must be prefaced with a call to vertex()
   * to set the first anchor point. This function must be used between
   * beginShape() and endShape() and only when there is no MODE
   * parameter specified to beginShape().
   *
   * @method bezierVertex
   * @param  {Number} x2 x-coordinate for the first control point
   * @param  {Number} y2 y-coordinate for the first control point
   * @param  {Number} x3 x-coordinate for the second control point
   * @param  {Number} y3 y-coordinate for the second control point
   * @param  {Number} x4 x-coordinate for the anchor point
   * @param  {Number} y4 y-coordinate for the anchor point
   * @return {Object}    the p5 object
   * @example
   * <div>
   * <code>
   * noFill();
   * beginShape();
   * vertex(30, 20);
   * bezierVertex(80, 0, 80, 75, 30, 75);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * beginShape();
   * vertex(30, 20);
   * bezierVertex(80, 0, 80, 75, 30, 75);
   * bezierVertex(50, 80, 60, 25, 30, 20);
   * endShape();
   * </code>
   * </div>
   */
  p5.prototype.bezierVertex = function(x2, y2, x3, y3, x4, y4) {
    if(this._contourInited) {
      var pt = {};
      pt.x = x2;
      pt.y = y2;
      pt.x3 = x3;
      pt.y3 = y3;
      pt.x4 = x4;
      pt.y4 = y4;
      pt.type = constants.BEZIER;
      this._contourVertices.push(pt);

      return this;
    }

    this.drawingContext.bezierCurveTo(x2, y2, x3, y3, x4, y4);

    return this;
  };

  /**
   * Specifies vertex coordinates for curves. This function may only
   * be used between beginShape() and endShape() and only when there
   * is no MODE parameter specified to beginShape(). The first and
   * last points in a series of curveVertex() lines will be used to
   * guide the beginning and end of a the curve. A minimum of four
   * points is required to draw a tiny curve between the second and
   * third points. Adding a fifth point with curveVertex() will draw
   * the curve between the second, third, and fourth points. The
   * curveVertex() function is an implementation of Catmull-Rom
   * splines.
   *
   * @method curveVertex
   * @param {Number} x x-coordinate of the vertex
   * @param {Number} y y-coordinate of the vertex
   * @return {Object} the p5 object
   * @example
   * <div>
   * <code>
   * noFill();
   * beginShape();
   * curveVertex(84,  91);
   * curveVertex(84,  91);
   * curveVertex(68,  19);
   * curveVertex(21,  17);
   * curveVertex(32, 100);
   * curveVertex(32, 100);
   * endShape();
   * </code>
   * </div>
   */
  p5.prototype.curveVertex = function(x,y) {
    var pt = {};
    pt.x = x;
    pt.y = y;
    this._curveVertices.push(pt);

    if(this._curveVertices.length >= 4) {
      this.curve(this._curveVertices[0].x,
                 this._curveVertices[0].y,
                 this._curveVertices[1].x,
                 this._curveVertices[1].y,
                 this._curveVertices[2].x,
                 this._curveVertices[2].y,
                 this._curveVertices[3].x,
                 this._curveVertices[3].y);
      this._curveVertices.shift();
    }

    return this;
  };

  /**
   * Use the beginContour() and endContour() function to create negative
   * shapes within shapes. For instance, the center of the letter 'O'.
   * beginContour() begins recording vertices for the shape and endContour()
   * stops recording. These functions can only be within a
   * beginShape()/endShape() pair.
   *
   * @method endContour
   * @return {Object} the p5 object
   * @example
   * <div>
   * <code>
   * // drawing the outer border must happen last,
   * // otherwise it gets drawn under the interior shape
   * translate(50, 50);
   * stroke(255, 0, 0);
   * beginShape();
   * // Interior part of shape
   * beginContour();
   * vertex(-20, -20);
   * vertex(20, -20);
   * vertex(20, 20);
   * vertex(-20, 20);
   * endContour();
   * // Exterior part of shape
   * vertex(-40, -40);
   * vertex(40, -40);
   * vertex(40, 40);
   * vertex(-40, 40);
   * endShape(CLOSE);
   * </code>
   * </div>
   */
  p5.prototype.endContour = function() {
    //In order for the contour fill to work correctly, the inside points must
    // be drawn in the reverse order of the parents
    this._contourVertices.reverse();
    this.drawingContext.moveTo(
      this._contourVertices[0].x,
      this._contourVertices[0].y
    );
    var ctx = this.drawingContext;
    this._contourVertices.slice(1).forEach(function(pt, i) {
      switch(pt.type) {
      case constants.LINEAR:
        ctx.lineTo(pt.x,pt.y);
        break;
      case constants.QUADRATIC:
        ctx.quadraticCurveTo(pt.x, pt.y, pt.x3, pt.y3);
        break;
      case constants.BEZIER:
        ctx.bezierCurveTo(pt.x, pt.y, pt.x3, pt.y3, pt.x4, pt.y4);
        break;
      case constants.CURVE:
        //TODO: Curve... curve
        break;
      }
    });
    this.drawingContext.closePath();

    this._contourInited = false;

    return this;
  };

  /**
   * The endShape() function is the companion to beginShape() and may only be
   * called after beginShape(). When endshape() is called, all of image data
   * defined since the previous call to beginShape() is written into the image
   * buffer. The constant CLOSE as the value for the MODE parameter to close
   * the shape (to connect the beginning and the end).
   *
   * @method endShape
   * @param  {Number/Constant} mode use CLOSE to close the shape
   * @return {Object}               the p5 object
   * @example
   * <div>
   * <code>
   * noFill();
   * 
   * beginShape();
   * vertex(20, 20);
   * vertex(45, 20);
   * vertex(45, 80);
   * endShape(CLOSE);
   * 
   * beginShape();
   * vertex(50, 20);
   * vertex(75, 20);
   * vertex(75, 80);
   * endShape();
   * </code>
   * </div>
   */
  p5.prototype.endShape = function(mode) {
    if (mode === constants.CLOSE) {
      this.drawingContext.closePath();
      if (this._doFill) {
        this.drawingContext.fill();
      }
    }
    if (this._doStroke && this._curveVertices.length <= 0) {
      this.drawingContext.stroke();
    } else {
      this._curveVertices = [];
    }

    return this;
  };

  /**
   * Specifies vertex coordinates for quadratic Bezier curves. Each call to
   * quadraticVertex() defines the position of one control points and one
   * anchor point of a Bezier curve, adding a new segment to a line or shape.
   * The first time quadraticVertex() is used within a beginShape() call, it
   * must be prefaced with a call to vertex() to set the first anchor point.
   * This function must be used between beginShape() and endShape() and only
   * when there is no MODE parameter specified to beginShape().
   * 
   * @method quadraticVertex
   * @param  {Number} cx x-coordinate for the control point
   * @param  {Number} cy y-coordinate for the control point
   * @param  {Number} x3 x-coordinate for the anchor point
   * @param  {Number} y3 y-coordinate for the anchor point
   * @return {Object}    the p5 object
   * @example
   * <div>
   * <code>
   * noFill();
   * strokeWeight(4);
   * beginShape();
   * vertex(20, 20);
   * quadraticVertex(80, 20, 50, 50);
   * endShape();
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * noFill();
   * strokeWeight(4);
   * beginShape();
   * vertex(20, 20);
   * quadraticVertex(80, 20, 50, 50);
   * quadraticVertex(20, 80, 80, 80);
   * vertex(80, 60);
   * endShape();
   * </code>
   * </div>
   */
  p5.prototype.quadraticVertex = function(cx, cy, x3, y3) {
    //if we're drawing a contour, put the points into an
    // array for inside drawing
    if(this._contourInited) {
      var pt = {};
      pt.x = cx;
      pt.y = cy;
      pt.x3 = x3;
      pt.y3 = y3;
      pt.type = constants.QUADRATIC;
      this._contourVertices.push(pt);

      return this;
    }

    this.drawingContext.quadraticCurveTo(cx, cy, x3, y3);

    return this;
  };

  /**
   * All shapes are constructed by connecting a series of vertices. vertex()
   * is used to specify the vertex coordinates for points, lines, triangles,
   * quads, and polygons. It is used exclusively within the beginShape() and
   * endShape() functions.
   *
   * @method vertex
   * @param  {Number} x x-coordinate of the vertex
   * @param  {Number} y y-coordinate of the vertex
   * @return {Object}   the p5 object
   * @example
   * <div>
   * <code>
   * beginShape(POINTS);
   * vertex(30, 20);
   * vertex(85, 20);
   * vertex(85, 75);
   * vertex(30, 75);
   * endShape();
   * </code>
   * </div>
   */
  p5.prototype.vertex = function(x, y) {
    //if we're drawing a contour, put the points into an array for inside
    // drawing
    if(this._contourInited) {
      var pt = {};
      pt.x = x;
      pt.y = y;
      pt.type = constants.LINEAR;
      this._contourVertices.push(pt);

      return this;
    }

    if (this._shapeInited) {
      this.drawingContext.moveTo(x, y);
    } else {
      // pend this is where check for kind and do other stuff
      this.drawingContext.lineTo(x, y);
    }
    this._shapeInited = false;

    return this;
  };

  return p5;

});