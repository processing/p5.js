/**
 * @module Shape
 * @for Vertex
 * @requires core
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  /**
   * Use the beginContour() and endContour() function to create negative shapes within shapes. For instance, the center of the letter 'O'. beginContour() begins recording vertices for the shape and endContour() stops recording. These functions can only be within a beginShape()/endShape() pair and they only work with the P2D and P3D renderers.
   *
   * Transformations such as translate(), rotate(), and scale() do not work within a beginContour()/endContour() pair. It is also not possible to use other shapes, such as ellipse() or rect() within.
   *
   * @method beginContour
   * @return {Object} the p5 object
   */
  p5.prototype.beginContour = function() {
    this._contourVertices = [];
    this._contourInited = true;

    return this;
  };

  /**
   * Using the beginShape() and endShape() functions allow creating more complex forms. beginShape() begins recording vertices for a shape and endShape() stops recording. The value of the kind parameter tells it which types of shapes to create from the provided vertices. With no mode specified, the shape can be any irregular polygon. The parameters available for beginShape() are POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, and QUAD_STRIP. After calling the beginShape() function, a series of vertex() commands must follow. To stop drawing the shape, call endShape(). The vertex() function with two parameters specifies a position in 2D and the vertex() function with three parameters specifies a position in 3D. Each shape will be outlined with the current stroke color and filled with the fill color.
   *
   * Transformations such as translate(), rotate(), and scale() do not work within beginShape(). It is also not possible to use other shapes, such as ellipse() or rect() within beginShape().
   *
   * @method beginShape
   * @param {Number/Constant} kind either POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, or QUAD_STRIP
   * @return {Object} the p5 object
   */
  p5.prototype.beginShape = function(kind) {
    if (kind === constants.POINTS || kind === constants.LINES || kind === constants.TRIANGLES || kind === constants.TRIANGLE_FAN || kind === constants.TRIANGLE_STRIP || kind === constants.QUADS || kind === constants.QUAD_STRIP) {
      this.shapeKind = kind;
    } else {
      this.shapeKind = null;
    }

    this.shapeInited = true;
    this.curElement.context.beginPath();

    return this;
  };

  /**
   * Specifies vertex coordinates for Bezier curves. Each call to bezierVertex() defines the position of two control points and one anchor point of a Bezier curve, adding a new segment to a line or shape. The first time bezierVertex() is used within a beginShape() call, it must be prefaced with a call to vertex() to set the first anchor point. This function must be used between beginShape() and endShape() and only when there is no MODE parameter specified to beginShape().
   *
   * @method bezierVertex
   * @param {Number} x2 x-coordinate for the first control point
   * @param {Number} y2 y-coordinate for the first control point
   * @param {Number} x3 x-coordinate for the second control point
   * @param {Number} y3 y-coordinate for the second control point
   * @param {Number} x4 x-coordinate for the anchor point
   * @param {Number} y4 y-coordinate for the anchor point
   * @return {Object} the p5 object
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

    this.curElement.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);

    return this;
  };

  p5.prototype.curveVertex = function() {
    // TODO

  };

  /**
   * Use the beginContour() and endContour() function to create negative shapes within shapes. For instance, the center of the letter 'O'. beginContour() begins recording vertices for the shape and endContour() stops recording. These functions can only be within a beginShape()/endShape() pair and they only work with the P2D and P3D renderers.
   *
   * @method endContour
   * @return {Object} the p5 object
   */
  p5.prototype.endContour = function() {
    //In order for the contour fill to work correctly, the inside points must be drawn in the reverse order of the parents
    this._contourVertices.reverse();
    this.curElement.context.moveTo(this._contourVertices[0].x,this._contourVertices[0].y);
    var ctx = this.curElement.context;
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
    this.curElement.context.closePath();

    this._contourInited = false;

    return this;
  };

  /**
   * The endShape() function is the companion to beginShape() and may only be called after beginShape(). When endshape() is called, all of image data defined since the previous call to beginShape() is written into the image buffer. The constant CLOSE as the value for the MODE parameter to close the shape (to connect the beginning and the end).
   *
   * @method endShape
   * @param {Number/Constant} mode use CLOSE to close the shape
   * @return {Object} the p5 object
   */
  p5.prototype.endShape = function(mode) {
    if (mode === constants.CLOSE) {
      this.curElement.context.closePath();
      this.curElement.context.fill();
    }
    this.curElement.context.stroke();

    return this;
  };

  /**
   * Specifies vertex coordinates for quadratic Bezier curves. Each call to quadraticVertex() defines the position of one control points and one anchor point of a Bezier curve, adding a new segment to a line or shape. The first time quadraticVertex() is used within a beginShape() call, it must be prefaced with a call to vertex() to set the first anchor point. This function must be used between beginShape() and endShape() and only when there is no MODE parameter specified to beginShape().
   * 
   * @method quadraticVertex
   * @param {Number} cx x-coordinate for the control point
   * @param {Number} cy y-coordinate for the control point
   * @param {Number} x3 x-coordinate for the anchor point
   * @param {Number} y3 y-coordinate for the anchor point
   * @return {Object} the p5 object
   */
  p5.prototype.quadraticVertex = function(cx, cy, x3, y3) {
    //if we're drawing a contour, put the points into an array for inside drawing
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

    this.curElement.context.quadraticCurveTo(cx, cy, x3, y3);

    return this;
  };

  /**
   * All shapes are constructed by connecting a series of vertices. vertex() is used to specify the vertex coordinates for points, lines, triangles, quads, and polygons. It is used exclusively within the beginShape() and endShape() functions.
   *
   * @method vertex
   * @param {Number} x x-coordinate of the vertex
   * @param {Number} y y-coordinate of the vertex
   * @return {Object} the p5 object
   */
  p5.prototype.vertex = function(x, y) {
    //if we're drawing a contour, put the points into an array for inside drawing
    if(this._contourInited) {
      var pt = {};
      pt.x = x;
      pt.y = y;
      pt.type = constants.LINEAR;
      this._contourVertices.push(pt);

      return this;
    }

    if (this.shapeInited) {
      this.curElement.context.moveTo(x, y);
    } else {
      this.curElement.context.lineTo(x, y); // pend this is where check for kind and do other stuff
    }
    this.shapeInited = false;

    return this;
  };

  return p5;

});