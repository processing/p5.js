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