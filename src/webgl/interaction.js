'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

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
 * @param {Constant} [mode]
 * @param {Number} [size] size of grid sides
 * @param {Number} [div] number of grid divisions
 * @param {Number} [xOff] offset of grid center from origin in X axis
 * @param {Number} [yOff] offset of grid center from origin in Y axis
 * @param {Number} [zOff] offset of grid center from origin in Z axis
 * @param {Number} [sizeA] size of grid sides
 * @param {Number} [xOffA] offset of grid center from origin in X axis
 * @param {Number} [yOffA] offset of grid center from origin in Y axis
 * @param {Number} [zOffA] offset of grid center from origin in Z axis
 * @example @TODO
 */
p5.prototype.debugMode = function() {
  this._assert3d('debugMode');
  // p5._validateParameters('debugMode', arguments);

  // start by removing existing 'post' registered debug methods
  for (var i = this._registeredMethods.post.length - 1; i >= 0; i--) {
    // test for equality...
    if (
      this._registeredMethods.post[i].toString() === this._grid().toString() ||
      this._registeredMethods.post[i].toString() === this._axesIcon().toString()
    ) {
      this._registeredMethods.post.splice(i, 1);
    }
  }

  // reinstate functions with new parameters
  // for (let i = 0; i < debugFuncs.length; i++) {
  //   this.registerMethod('post', debugFuncs[i]);
  // }

  if (arguments.length > 0) {
    if (arguments.length === 9) {
      this.registerMethod(
        'post',
        this._grid.call(
          this,
          arguments[0],
          arguments[1],
          arguments[2],
          arguments[3],
          arguments[4]
        )
      );
      this.registerMethod(
        'post',
        this._axesIcon.call(
          this,
          arguments[5],
          arguments[6],
          arguments[7],
          arguments[8]
        )
      );
    } else if (arguments.length > 1) {
      if (arguments[0] === constants.GRID) {
        this.registerMethod(
          'post',
          this._grid.call(
            this,
            arguments[1],
            arguments[2],
            arguments[3],
            arguments[4],
            arguments[5]
          )
        );
      } else if (arguments[0] === constants.AXES) {
        this.registerMethod(
          'post',
          this._axesIcon.call(
            this,
            arguments[1],
            arguments[2],
            arguments[3],
            arguments[4]
          )
        );
      }
    } else {
      if (arguments[0] === constants.GRID) {
        this.registerMethod('post', this._grid.call(this));
      } else if (arguments[0] === constants.AXES) {
        this.registerMethod('post', this._axesIcon.call(this));
      } else if (arguments[0] === constants.OFF) {
        return;
      }
    }
  } else {
    this.registerMethod('post', this._grid.call(this));
    this.registerMethod('post', this._axesIcon.call(this));
  }
};

/**
 * For use with debugMode
 * @private
 * @method _grid
 * @param {Number} [size] size of grid sides
 * @param {Number} [div] number of grid divisions
 * @param {Number} [xOff] offset of grid center from origin in X axis
 * @param {Number} [yOff] offset of grid center from origin in Y axis
 * @param {Number} [zOff] offset of grid center from origin in Z axis
 */
p5.prototype._grid = function(size, numDivs, xOff, yOff, zOff) {
  if (typeof size === 'undefined') {
    size = this.width / 2;
  }
  if (typeof numDivs === 'undefined') {
    // ensure even number of divisions to allow highlighted centerlines
    var divs = Math.round(size / 20);
    numDivs = divs % 2 === 0 ? divs : divs - 1;
  }
  if (typeof xOff === 'undefined') {
    xOff = 0;
  }
  if (typeof yOff === 'undefined') {
    yOff = 0;
  }
  if (typeof zOff === 'undefined') {
    zOff = 0;
  }

  var spacing = size / numDivs;
  var halfSize = size / 2;

  return function() {
    this.push();

    this._renderer.uMVMatrix.set(
      this._renderer._curCamera.cameraMatrix.mat4[0],
      this._renderer._curCamera.cameraMatrix.mat4[1],
      this._renderer._curCamera.cameraMatrix.mat4[2],
      this._renderer._curCamera.cameraMatrix.mat4[3],
      this._renderer._curCamera.cameraMatrix.mat4[4],
      this._renderer._curCamera.cameraMatrix.mat4[5],
      this._renderer._curCamera.cameraMatrix.mat4[6],
      this._renderer._curCamera.cameraMatrix.mat4[7],
      this._renderer._curCamera.cameraMatrix.mat4[8],
      this._renderer._curCamera.cameraMatrix.mat4[9],
      this._renderer._curCamera.cameraMatrix.mat4[10],
      this._renderer._curCamera.cameraMatrix.mat4[11],
      this._renderer._curCamera.cameraMatrix.mat4[12],
      this._renderer._curCamera.cameraMatrix.mat4[13],
      this._renderer._curCamera.cameraMatrix.mat4[14],
      this._renderer._curCamera.cameraMatrix.mat4[15]
    );

    // Lines along X axis
    for (var q = 0; q <= numDivs; q++) {
      this.strokeWeight(1);
      this.stroke(0, 0, 0);
      // if there is a line running through the origin, color it differently
      if (numDivs / q === 2) {
        this.stroke(255, 255, 255);
      }
      this.beginShape(this.LINES);
      this.vertex(-halfSize + xOff, yOff, q * spacing - halfSize + zOff);
      this.vertex(+halfSize + xOff, yOff, q * spacing - halfSize + zOff);
      this.endShape();
    }

    // Lines along Z axis
    for (var i = 0; i <= numDivs; i++) {
      this.strokeWeight(1);
      this.stroke(0, 0, 0);
      // if there is a line running through the origin, color it differently
      if (numDivs / i === 2) {
        this.stroke(255, 255, 255);
      }

      this.beginShape(this.LINES);
      this.vertex(i * spacing - halfSize + xOff, yOff, -halfSize + zOff);
      this.vertex(i * spacing - halfSize + xOff, yOff, +halfSize + zOff);
      this.endShape();
    }
    this.pop();
  };
};

p5.prototype._axesIcon = function(size, xOff, yOff, zOff) {
  if (typeof size === 'undefined') {
    size = this.width / 20;
  }
  if (typeof xOff === 'undefined') {
    xOff = -this.width / 10;
  }
  if (typeof yOff === 'undefined') {
    yOff = xOff;
  }
  if (typeof zOff === 'undefined') {
    zOff = xOff;
  }

  return function() {
    this.push();
    this._renderer.uMVMatrix.set(
      this._renderer._curCamera.cameraMatrix.mat4[0],
      this._renderer._curCamera.cameraMatrix.mat4[1],
      this._renderer._curCamera.cameraMatrix.mat4[2],
      this._renderer._curCamera.cameraMatrix.mat4[3],
      this._renderer._curCamera.cameraMatrix.mat4[4],
      this._renderer._curCamera.cameraMatrix.mat4[5],
      this._renderer._curCamera.cameraMatrix.mat4[6],
      this._renderer._curCamera.cameraMatrix.mat4[7],
      this._renderer._curCamera.cameraMatrix.mat4[8],
      this._renderer._curCamera.cameraMatrix.mat4[9],
      this._renderer._curCamera.cameraMatrix.mat4[10],
      this._renderer._curCamera.cameraMatrix.mat4[11],
      this._renderer._curCamera.cameraMatrix.mat4[12],
      this._renderer._curCamera.cameraMatrix.mat4[13],
      this._renderer._curCamera.cameraMatrix.mat4[14],
      this._renderer._curCamera.cameraMatrix.mat4[15]
    );

    // X axis
    this.strokeWeight(3);
    this.stroke(255, 0, 0);
    this.beginShape(this.LINES);
    this.vertex(xOff, yOff, zOff);
    this.vertex(xOff + size, yOff, zOff);
    this.endShape();
    // Y axis
    this.stroke(0, 255, 0);
    this.beginShape(this.LINES);
    this.vertex(xOff, yOff, zOff);
    this.vertex(xOff, yOff + size, zOff);
    this.endShape();
    // Z axis
    this.stroke(0, 0, 255);
    this.beginShape(this.LINES);
    this.vertex(xOff, yOff, zOff);
    this.vertex(xOff, yOff, zOff + size);
    this.endShape();
    this.pop();
  };
};

module.exports = p5;
