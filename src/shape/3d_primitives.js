/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  //inspire by lightgl.js 
  //https://github.com/evanw/lightgl.js
  p5.prototype.Geometry3D = function () {
    this.vertices = [];
    this.faces = [];
    this.faceNormals = [];
    this.uvs = [];
  };

  /**
   * [plane description]
   * @param  {[type]} detailX [description]
   * @param  {[type]} detailY [description]
   * @return {[type]}         [description]
   * @example
   * <div>
   * <code>
   * plane(5);
   * plane(20, 10);
   * </code>
   * </div>
   */
  p5.prototype.plane = function (detailX, detailY) {

    p5.prototype.Geometry3D.call(this);
    detailX = detailX || 1;
    detailY = detailY || 1;

    for (var y = 0; y <= detailY; y++) {
      var t = y / detailY;
      for (var x = 0; x <= detailX; x++) {
        var s = x / detailX;
        this.vertices.push([2 * s - 1, 2 * t - 1, 0]);
        if (this.uvs) {
          this.uvs.push([s, t]);
        }
        if (this.faceNormals) {
          this.faceNormals.push([0, 0, 1]);
        }
        if (x < detailX && y < detailY) {
          var i = x + y * (detailX + 1);
          this.faces.push([i, i + 1, i + detailX + 1]);
          this.faces.push([i + detailX + 1, i + 1, i + detailX + 2]);
        }
      }
    }
    this._graphics.plane(this.vertices);
    return this;
  };

  /**
   * [cube description]
   * @return {[type]} [description]
   */
  p5.prototype.cube = function () {
    this._graphics.cube();
    return this;
  };

  /**
   * [sphere description]
   * @return {[type]} [description]
   */
  p5.prototype.sphere = function () {
    this._graphics.sphere();
    return this;
  };

  /**
   * [pyramid description]
   * @return {[type]} [description]
   */
  p5.prototype.pyramid = function () {
    this._graphics.pyramid();
    return this;
  };

  return p5;
});