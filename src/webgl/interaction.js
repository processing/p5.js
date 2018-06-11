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
    var deltaPhi = sensitivityX * (this.mouseX - this.pmouseX);
    var deltaTheta = -1 * sensitivityY * (this.mouseY - this.pmouseY);

    var cartesianToSpherical = function(x, y, z) {
      var _x = x;
      var _y = z;
      var _z = y;

      var rad = Math.sqrt(_x * _x + _y * _y + _z * _z);
      return {
        radius: rad,
        theta: Math.acos(_z / rad),
        phi: Math.atan(_y / _x)
      };
    };

    var sphericalToCartesian = function(rad, theta, phi) {
      var _x = rad * Math.sin(theta) * Math.cos(phi);
      var _y = rad * Math.sin(theta) * Math.sin(phi);
      var _z = rad * Math.cos(theta);

      return {
        x: _x,
        y: _z,
        z: _y
      };
    };

    var sphericalCoordinates = cartesianToSpherical(
      this._renderer.cameraX,
      this._renderer.cameraY,
      this._renderer.cameraZ
    );

    console.log(
      'spherical coordinates: ' +
        sphericalCoordinates.radius +
        ', ' +
        sphericalCoordinates.theta +
        ', ' +
        sphericalCoordinates.phi
    );

    var newTheta = sphericalCoordinates.theta + deltaTheta;
    var newPhi = sphericalCoordinates.phi + deltaPhi;

    if (newTheta > Math.PI) {
      newTheta = Math.PI;
    }
    if (newTheta <= 0) {
      newTheta = 0.01;
    }

    var newCartesianCoordinates = sphericalToCartesian(
      sphericalCoordinates.radius,
      newTheta,
      newPhi
    );

    console.log('new theta: ' + newTheta);
    console.log('new phi: ' + newPhi);

    // var camMatrix = p5.Matrix.identity();

    // p5.Matrix.prototype.rotate.apply(camMatrix, [newTheta, 1, 0, 0]);
    // p5.Matrix.prototype.rotate.apply(camMatrix, [newPhi, 0, 1, 0]);
    // p5.Matrix.prototype.translate.apply(camMatrix, [
    //   [0, 0, sphericalCoordinates.radius]
    // ]);

    // p5.Matrix.prototype.rotate.apply(camMatrix, [xAxisRotation, 1, 0, 0]);
    // p5.Matrix.prototype.rotate.apply(camMatrix, [yAxisRotation, 0, 1, 0]);
    //
    // p5.Matrix.prototype.translate.apply(camMatrix, [
    //   [this._renderer.cameraX, this._renderer.cameraY, this._renderer.cameraZ]
    // ]);

    this.camera(
      newCartesianCoordinates.x,
      newCartesianCoordinates.y,
      newCartesianCoordinates.z,
      0,
      0,
      0,
      0,
      1,
      0
    );
  }
  return this;
};

module.exports = p5;
