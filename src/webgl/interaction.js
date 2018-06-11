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
// implementation based on three.js 'orbitControls'
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
    var deltaTheta = 0.1 * sensitivityX * (this.mouseX - this.pmouseX);
    var deltaPhi = -0.1 * sensitivityY * (this.mouseY - this.pmouseY);

    // camera position
    var camX = this._renderer.cameraX;
    var camY = this._renderer.cameraY;
    var camZ = this._renderer.cameraZ;

    // get spherical coorinates for current camera position about origin
    var camRadius = Math.sqrt(camX * camX + camY * camY + camZ * camZ);
    var camTheta = Math.atan2(camX, camZ); // equator angle around y-up axis
    var camPhi = Math.acos(Math.max(-1, Math.min(1, camY / camRadius))); // polar angle

    // add mouse movements
    camTheta += deltaTheta;
    camPhi += deltaPhi;

    // prevent move over the apex
    if (camPhi > Math.PI) {
      camPhi = Math.PI;
    } else if (camPhi <= 0) {
      camPhi = 0.001;
    }

    // turn back into Cartesian coordinates
    var sinPhiRadius = Math.sin(camPhi) * camRadius;

    var _x = sinPhiRadius * Math.sin(camTheta);
    var _y = Math.cos(camPhi) * camRadius;
    var _z = sinPhiRadius * Math.cos(camTheta);

    this.camera(_x, _y, _z, 0, 0, 0, 0, 1, 0);
  }
  return this;
};

module.exports = p5;
