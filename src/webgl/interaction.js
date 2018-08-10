/**
 * @module Lights, Camera
 * @submodule Interaction
 */

'use strict';

var p5 = require('../core/core');

/**
 * Allows movement around a 3D sketch using a mouse or trackpad.  Left-clicking
 * and dragging will rotate the camera position about the center of the sketch,
 * right-clicking and dragging will pan the camera position without rotation,
 * and using the mouse wheel (scrolling) will move the camera closer or further
 * from the center of the sketch. This function can be called with parameters
 * dictating sensitivity to mouse movement along the X and Y axes.  Calling
 * this function without parameters is equivalent to calling orbitControl(1,1).
 * To reverse direction of movement in either axis, enter a negative number
 * for sensitivity.
 * @method orbitControl
 * @for p5
 * @param  {Number} [sensitivityX] sensitivity to mouse movement along X axis
 * @param  {Number} [sensitivityY] sensitivity to mouse movement along Y axis
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   rotateY(0.5);
 *   box(30, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Camera orbits around a box when mouse is hold-clicked & then moved.
 */

// implementation based on three.js 'orbitControls':
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js
p5.prototype.orbitControl = function(sensitivityX, sensitivityY) {
  this._assert3d('orbitControl');
  p5._validateParameters('orbitControl', arguments);

  // If the mouse is not in bounds of the canvas, disable all behaviors:
  var mouseInCanvas =
    this.mouseX < this.width &&
    this.mouseX > 0 &&
    this.mouseY < this.height &&
    this.mouseY > 0;
  if (!mouseInCanvas) return;

  var cam = this._renderer._curCamera;

  if (typeof sensitivityX === 'undefined') {
    sensitivityX = 1;
  }
  if (typeof sensitivityY === 'undefined') {
    sensitivityY = sensitivityX;
  }

  // default right-mouse and mouse-wheel behaviors (context menu and scrolling,
  // respectively) are disabled here to allow use of those events for panning and
  // zooming

  // disable context menu for canvas element and add 'contextMenuDisabled'
  // flag to p5 instance
  if (this.contextMenuDisabled !== true) {
    this.canvas.oncontextmenu = function() {
      return false;
    };
    this._setProperty('contextMenuDisabled', true);
  }

  // disable default scrolling behavior on the canvas element and add
  // 'wheelDefaultDisabled' flag to p5 instance
  if (this.wheelDefaultDisabled !== true) {
    this.canvas.onwheel = function() {
      return false;
    };
    this._setProperty('wheelDefaultDisabled', true);
  }

  var scaleFactor = this.height < this.width ? this.height : this.width;

  // ZOOM if there is a change in mouseWheelDelta
  if (this._mouseWheelDeltaY !== this._pmouseWheelDeltaY) {
    // zoom according to direction of mouseWheelDeltaY rather than value
    if (this._mouseWheelDeltaY > 0) {
      this._renderer._curCamera._orbit(0, 0, 0.5 * scaleFactor);
    } else {
      this._renderer._curCamera._orbit(0, 0, -0.5 * scaleFactor);
    }
  }

  if (this.mouseIsPressed) {
    // ORBIT BEHAVIOR
    if (this.mouseButton === this.LEFT) {
      var deltaTheta =
        -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
      var deltaPhi = sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;
      this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    } else if (this.mouseButton === this.RIGHT) {
      // PANNING BEHAVIOR along X/Z camera axes and restricted to X/Z plane
      // in world space
      var local = cam._getLocalAxes();

      // normalize portions along X/Z axes
      var xmag = Math.sqrt(local.x[0] * local.x[0] + local.x[2] * local.x[2]);
      if (xmag !== 0) {
        local.x[0] /= xmag;
        local.x[2] /= xmag;
      }

      // normalize portions along X/Z axes
      var ymag = Math.sqrt(local.y[0] * local.y[0] + local.y[2] * local.y[2]);
      if (ymag !== 0) {
        local.y[0] /= ymag;
        local.y[2] /= ymag;
      }

      // move along those vectors by amount controlled by mouseX, pmouseY
      var dx = -1 * sensitivityX * (this.mouseX - this.pmouseX);
      var dz = -1 * sensitivityY * (this.mouseY - this.pmouseY);

      // restrict movement to XZ plane in world space
      cam.setPosition(
        cam.eyeX + dx * local.x[0] + dz * local.z[0],
        cam.eyeY,
        cam.eyeZ + dx * local.x[2] + dz * local.z[2]
      );
    }
  }
  return this;
};

module.exports = p5;
