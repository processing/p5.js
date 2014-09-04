/**
 * @module Shape
 * @for Attributes
 * @requires core
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');


  /**
   * Modifies the location from which ellipses are drawn by changing the way in which parameters given to ellipse() are interpreted.
   *
   * The default mode is ellipseMode(CENTER), which interprets the first two parameters of ellipse() as the shape's center point, while the third and fourth parameters are its width and height.
   *
   * ellipseMode(RADIUS) also uses the first two parameters of ellipse() as the shape's center point, but uses the third and fourth parameters to specify half of the shapes's width and height.
   *
   * ellipseMode(CORNER) interprets the first two parameters of ellipse() as the upper-left corner of the shape, while the third and fourth parameters are its width and height.
   *
   * ellipseMode(CORNERS) interprets the first two parameters of ellipse() as the location of one corner of the ellipse's bounding box, and the third and fourth parameters as the location of the opposite corner.
   *
   * The parameter must be written in ALL CAPS because Processing is a case-sensitive language.
   *
   * @method ellipseMode
   * @param {Number/Constant} mode either CENTER, RADIUS, CORNER, or CORNERS
   * @return {p5} the p5 object
   */
  p5.prototype.ellipseMode = function(m) {
    if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
      this.settings.ellipseMode = m;
    }

    return this;
  };

  /**
   * Draws all geometry with jagged (aliased) edges. Note that smooth() is active by default, so it is necessary to call noSmooth() to disable smoothing of geometry, images, and fonts.
   *
   * @method noSmooth
   * @return {p5} the p5 object
   */
  p5.prototype.noSmooth = function() {
    this.curElement.context.mozImageSmoothingEnabled = false;
    this.curElement.context.webkitImageSmoothingEnabled = false;

    return this;
  };

  /**
   * Modifies the location from which rectangles are drawn by changing the way in which parameters given to rect() are interpreted.
   *
   * The default mode is rectMode(CORNER), which interprets the first two parameters of rect() as the upper-left corner of the shape, while the third and fourth parameters are its width and height.
   *
   * rectMode(CORNERS) interprets the first two parameters of rect() as the location of one corner, and the third and fourth parameters as the location of the opposite corner.
   *
   * rectMode(CENTER) interprets the first two parameters of rect() as the shape's center point, while the third and fourth parameters are its width and height.
   *
   * rectMode(RADIUS) also uses the first two parameters of rect() as the shape's center point, but uses the third and fourth parameters to specify half of the shapes's width and height.
   *
   * The parameter must be written in ALL CAPS because Processing is a case-sensitive language.
   *
   * @method rectMode
   * @param {Number/Constant} mode either CORNER, CORNERS, CENTER, or RADIUS
   * @return {p5} the p5 object
   */
  p5.prototype.rectMode = function(m) {
    if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
      this.settings.rectMode = m;
    }

    return this;
  };

  /**
   * Draws all geometry with smooth (anti-aliased) edges. smooth() will also improve image quality of resized images. Note that smooth() is active by default; noSmooth() can be used to disable smoothing of geometry, images, and fonts.
   *
   * @method smooth
   * @return {p5} the p5 object
   */
  p5.prototype.smooth = function() {
    this.curElement.context.mozImageSmoothingEnabled = true;
    this.curElement.context.webkitImageSmoothingEnabled = true;

    return this;
  };

  /**
   * Sets the style for rendering line endings. These ends are either squared, extended, or rounded, each of which specified with the corresponding parameters: SQUARE, PROJECT, and ROUND. The default cap is ROUND.
   *
   * @method strokeCap
   * @param {Number/Constant} cap either SQUARE, PROJECT, or ROUND
   * @return {p5} the p5 object
   */
  p5.prototype.strokeCap = function(cap) {
    if (cap === constants.ROUND || cap === constants.SQUARE || cap === constants.PROJECT) {
      this.curElement.context.lineCap=cap;
    }

    return this;
  };

  /**
   * Sets the style of the joints which connect line segments. These joints are either mitered, beveled, or rounded and specified with the corresponding parameters MITER, BEVEL, and ROUND. The default joint is MITER.
   *
   * @method strokeJoin
   * @param {Number/Constant} join either MITER, BEVEL, ROUND
   * @return {p5} the p5 object
   */
  p5.prototype.strokeJoin = function(join) {
    if (join === constants.ROUND || join === constants.BEVEL || join === constants.MITER) {
      this.curElement.context.lineJoin = join;
    }

    return this;
  };

  /**
   * Sets the width of the stroke used for lines, points, and the border around shapes. All widths are set in units of pixels.
   *
   * @method strokeWeight
   * @param {Number} weight the weight (in pixels) of the stroke
   * @return {p5} the p5 object
   */
  p5.prototype.strokeWeight = function(w) {
    if (typeof w === 'undefined' || w === 0) {
      this.curElement.context.lineWidth = 0.0001; // hack because lineWidth 0 doesn't work
    } else {
      this.curElement.context.lineWidth = w;
    }

    return this;
  };

  return p5;

});
