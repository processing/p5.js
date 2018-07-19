'use strict';

var p5 = require('../core/core');

/**
 * Allows rotation of a 3D sketch by dragging the mouse. As the mouse is dragged
 * away from the center of the canvas in the X or Y direction, the sketch is
 * rotated about the Y or X axis respectively. Note that this rotation only
 * affects objects drawn after orbitControl() has been called in the draw() loop.
 * To reverse movement in either axis, enter a negative number for sensitivity.
 * Calling this function without arguments is equivalent to calling orbitControl(1,1).
 * @method orbitControl
 * @for p5
 * @param  {Number} [sensitivityX]        sensitivity to mouse movement along X axis
 * @param  {Number} [sensitivityY]        sensitivity to mouse movement along Y axis
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   // Orbit control allows the camera to orbit around a target.
 *   orbitControl();
 *   box(30, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Camera orbits around box when mouse is hold-clicked & then moved.
 */
//@TODO: implement full orbit controls including
//pan, zoom, quaternion rotation, etc.
// implementation based on three.js 'orbitControls':
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js
p5.prototype.orbitControl = function(sensitivityX, sensitivityY) {
  this._assert3d('orbitControl');
  p5._validateParameters('orbitControl', arguments);

  if (typeof sensitivityX === 'undefined') {
    sensitivityX = 1;
  }
  if (typeof sensitivityY === 'undefined') {
    sensitivityY = sensitivityX;
  }

  if (this.mouseIsPressed) {
    var scaleFactor = this.height < this.width ? this.height : this.width;
    var deltaTheta = -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
    var deltaPhi = sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;

    // camera position
    var camX = this._renderer.cameraX;
    var camY = this._renderer.cameraY;
    var camZ = this._renderer.cameraZ;

    // center coordinates
    var centerX = this._renderer.cameraCenterX;
    var centerY = this._renderer.cameraCenterY;
    var centerZ = this._renderer.cameraCenterZ;

    var diffX = camX - centerX;
    var diffY = camY - centerY;
    var diffZ = camZ - centerZ;

    // get spherical coorinates for current camera position about origin
    var camRadius = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
    // from https://github.com/mrdoob/three.js/blob/dev/src/math/Spherical.js#L72-L73
    var camTheta = Math.atan2(diffX, diffZ); // equatorial angle
    var camPhi = Math.acos(Math.max(-1, Math.min(1, diffY / camRadius))); // polar angle

    // add mouse movements
    camTheta += deltaTheta;
    camPhi += deltaPhi;

    // prevent rotation over the zenith / under bottom
    if (camPhi > Math.PI) {
      camPhi = Math.PI;
    } else if (camPhi <= 0) {
      camPhi = 0.001;
    }

    // from https://github.com/mrdoob/three.js/blob/dev/src/math/Vector3.js#L628-L632
    // var sinPhiRadius = Math.sin(camPhi) * camRadius;

    var _x = Math.sin(camPhi) * camRadius * Math.sin(camTheta);
    var _y = Math.cos(camPhi) * camRadius;
    var _z = Math.sin(camPhi) * camRadius * Math.cos(camTheta);

    this.camera(
      _x + centerX,
      _y + centerY,
      _z + centerZ,
      centerX,
      centerY,
      centerZ,
      0,
      1,
      0
    );
  }
  return this;
};

/**
 * This function helps visualize 3D space with the addition of a 'ground grid'
 * running through the origin (0,0,0) and a set of axes markers which indicate
 * which way is +X, +Y and +Z. Calling this function without parameters will
 * toggle it ON or OFF depending on its current state.  To explicitely turn
 * debugMode ON or OFF, simply add 0 (for OFF) or 1 (for ON) as a parameter.
 * @method debugMode
 * @param {Number} [state] 0 or 1 to explicitely call the function on or off
 * @example @TODO
 */
p5.prototype.debugMode = function(state) {
  this._assert3d('debugMode');
  // p5._validateParameters('debugMode', arguments);

  // shut off debugMode by removing registered 'post' methods
  if (state === 0) {
    for (var i = this._registeredMethods.post.length; i >= 0; i--) {
      if (
        this._registeredMethods.post[i] === this._renderer._grid ||
        this._registeredMethods.post[i] === this._renderer._axesIcon
      ) {
        this._registeredMethods.post.splice(i, 1);
      }
    }
  } else if (state === 1) {
    this.registerMethod('post', this._renderer._grid);
    this.registerMethod('post', this._renderer._axesIcon);
  }
};

module.exports = p5;
