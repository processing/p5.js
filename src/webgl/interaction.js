'use strict';

var p5 = require('../core/core');

/**
 * Allows rotation of a 3D sketch by dragging the mouse. As the mouse is dragged
 * away from the center of the canvas in the X or Y direction, the sketch is
 * rotated about the Y or X axis respectively. Note that this rotation only
 * affects objects drawn after orbitControl() has been called in the draw() loop.
 * @method orbitControl
 * @for p5
 * @chainable
 *
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
p5.prototype.orbitControl = function() {
  this._assert3d('orbitControl');
  p5._validateParameters('orbitControl', arguments);
  if (this.mouseIsPressed) {
    this.rotateY((this.mouseX - this.width / 2) / (this.width / 2));
    this.rotateX((this.height / 2 - this.mouseY) / (this.width / 2));
  }
  return this;
};

module.exports = p5;
