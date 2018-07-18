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
 *   normalMaterial();
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   translate(-20, 15, -20);
 *   torus(20, 5);
 *   translate(15, 0, 15);
 *   torus(20, 5);
 *   translate(15, 0, 15);
 *   torus(20, 5);
 *   translate(15, 0, 15);
 *   torus(20, 5);
 *   translate(15, 0, 15);
 *   torus(20, 5);
 *   translate(15, 0, 15);
 *   torus(20, 5);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Camera orbits around a series of floating shapes when mouse is
 * hold-clicked & then moved.
 */
//@TODO: implement full orbit controls including
//pan, zoom, quaternion rotation, etc.
// implementation based on three.js 'orbitControls':
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js
p5.prototype.orbitControl = function(sensitivityX, sensitivityY) {
  this._assert3d('orbitControl');
  p5._validateParameters('orbitControl', arguments);

  var cam = this._renderer._curCamera;

  // disable context menu for canvas element and add 'contextMenuDisabled'
  // flag to p5 instance
  if (this.contextMenuDisabled !== true) {
    this.canvas.oncontextmenu = function() {
      return false;
    };
    this._setProperty('contextMenuDisabled', true);
  }

  if (typeof sensitivityX === 'undefined') {
    sensitivityX = 1;
  }
  if (typeof sensitivityY === 'undefined') {
    sensitivityY = sensitivityX;
  }

  if (this.mouseIsPressed) {
    if (this.mouseButton === this.LEFT) {
      var scaleFactor = this.height < this.width ? this.height : this.width;
      var deltaTheta =
        -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
      var deltaPhi = sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;

      var diffX = cam.eyeX - cam.centerX;
      var diffY = cam.eyeY - cam.centerY;
      var diffZ = cam.eyeZ - cam.centerZ;

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
        _x + cam.centerX,
        _y + cam.centerY,
        _z + cam.centerZ,
        cam.centerX,
        cam.centerY,
        cam.centerZ,
        0,
        1,
        0
      );
    }
    if (this.mouseButton === this.RIGHT) {
      // panning behavior along X/Z camera axes and restricted to X/Z plane
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
