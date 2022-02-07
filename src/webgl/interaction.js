/**
 * @module 3D
 * @submodule Interaction
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import * as constants from '../core/constants';

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
 * @param  {Number} [sensitivityZ] sensitivity to scroll movement along Z axis
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *   describe(
 *     'Camera orbits around a box when mouse is hold-clicked & then moved.'
 *   );
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   rotateY(0.5);
 *   box(30, 50);
 *   describe(`Camera orbits around a box when mouse moved while
 *     holding the button down.`);
 * }
 * </code>
 * </div>
 */

// implementation based on three.js 'orbitControls':
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js
p5.prototype.orbitControl = function(sensitivityX, sensitivityY, sensitivityZ) {
  this._assert3d('orbitControl');
  p5._validateParameters('orbitControl', arguments);

  // If the mouse is not in bounds of the canvas, disable all behaviors:
  const mouseInCanvas =
    this.mouseX < this.width &&
    this.mouseX > 0 &&
    this.mouseY < this.height &&
    this.mouseY > 0;
  if (!mouseInCanvas) return;

  const cam = this._renderer._curCamera;

  if (typeof sensitivityX === 'undefined') {
    sensitivityX = 1;
  }
  if (typeof sensitivityY === 'undefined') {
    sensitivityY = sensitivityX;
  }
  if (typeof sensitivityZ === 'undefined') {
    sensitivityZ = 0.5;
  }

  // default right-mouse and mouse-wheel behaviors (context menu and scrolling,
  // respectively) are disabled here to allow use of those events for panning and
  // zooming

  // disable context menu for canvas element and add 'contextMenuDisabled'
  // flag to p5 instance
  if (this.contextMenuDisabled !== true) {
    this.canvas.oncontextmenu = () => false;
    this._setProperty('contextMenuDisabled', true);
  }

  // disable default scrolling behavior on the canvas element and add
  // 'wheelDefaultDisabled' flag to p5 instance
  if (this.wheelDefaultDisabled !== true) {
    this.canvas.onwheel = () => false;
    this._setProperty('wheelDefaultDisabled', true);
  }

  const scaleFactor = this.height < this.width ? this.height : this.width;

  // ZOOM if there is a change in mouseWheelDelta
  if (this._mouseWheelDeltaY !== this._pmouseWheelDeltaY) {
    // zoom according to direction of mouseWheelDeltaY rather than value
    if (this._mouseWheelDeltaY > 0) {
      this._renderer._curCamera._orbit(0, 0, sensitivityZ * scaleFactor);
    } else {
      this._renderer._curCamera._orbit(0, 0, -sensitivityZ * scaleFactor);
    }
  }

  if (this.mouseIsPressed) {
    // ORBIT BEHAVIOR
    if (this.mouseButton === this.LEFT) {
      const deltaTheta =
        -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
      const deltaPhi =
        sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;
      this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    } else if (this.mouseButton === this.RIGHT) {
      // PANNING BEHAVIOR along X/Z camera axes and restricted to X/Z plane
      // in world space
      const local = cam._getLocalAxes();

      // normalize portions along X/Z axes
      const xmag = Math.sqrt(local.x[0] * local.x[0] + local.x[2] * local.x[2]);
      if (xmag !== 0) {
        local.x[0] /= xmag;
        local.x[2] /= xmag;
      }

      // normalize portions along X/Z axes
      const ymag = Math.sqrt(local.y[0] * local.y[0] + local.y[2] * local.y[2]);
      if (ymag !== 0) {
        local.y[0] /= ymag;
        local.y[2] /= ymag;
      }

      // move along those vectors by amount controlled by mouseX, pmouseY
      const dx = -1 * sensitivityX * (this.mouseX - this.pmouseX);
      const dz = -1 * sensitivityY * (this.mouseY - this.pmouseY);

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

/**
 * debugMode() helps visualize 3D space by adding a grid to indicate where the
 * ‘ground’ is in a sketch and an axes icon which indicates the +X, +Y, and +Z
 * directions. This function can be called without parameters to create a
 * default grid and axes icon, or it can be called according to the examples
 * above to customize the size and position of the grid and/or axes icon.  The
 * grid is drawn using the most recently set stroke color and weight.  To
 * specify these parameters, add a call to stroke() and strokeWeight()
 * just before the end of the draw() loop.
 *
 * By default, the grid will run through the origin (0,0,0) of the sketch
 * along the XZ plane
 * and the axes icon will be offset from the origin.  Both the grid and axes
 * icon will be sized according to the current canvas size.  Note that because the
 * grid runs parallel to the default camera view, it is often helpful to use
 * debugMode along with orbitControl to allow full view of the grid.
 * @method debugMode
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
 *   normalMaterial();
 *   debugMode();
 *   describe(
 *     'a 3D box is centered on a grid in a 3D sketch. an icon indicates the direction of each axis: a red line points +X, a green line +Y, and a blue line +Z. the grid and icon disappear when the spacebar is pressed.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   box(15, 30);
 *   // Press the spacebar to turn debugMode off!
 *   if (keyIsDown(32)) {
 *     noDebugMode();
 *   }
 *   describe(`a 3D box is centered on a grid in a 3D sketch.
 *     an icon indicates the direction of each axis:
 *     a red line points +X, a green line +Y, and a blue line +Z.
 *     the grid and icon disappear when the spacebar is pressed.`);
 * }
 * </code>
 * </div>
 *
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
 *   normalMaterial();
 *   debugMode(GRID);
 *   describe('a 3D box is centered on a grid in a 3D sketch.');
 * }
 *
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   box(15, 30);
 *   describe(`a 3D box is centered on a grid in a 3D sketch.`);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
 *   normalMaterial();
 *   debugMode(AXES);
 *   describe(
 *     'a 3D box is centered in a 3D sketch. an icon indicates the direction of each axis: a red line points +X, a green line +Y, and a blue line +Z.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   box(15, 30);
 *   describe(`a 3D box is centered in a 3D sketch.
 *     an icon indicates the direction of each axis:
 *     a red line points +X, a green line +Y, and a blue line +Z.`);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
 *   normalMaterial();
 *   debugMode(GRID, 100, 10, 0, 0, 0);
 *   describe('a 3D box is centered on a grid in a 3D sketch');
 * }
 *
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   box(15, 30);
 *   describe(`a 3D box is centered on a grid in a 3D sketch`);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
 *   normalMaterial();
 *   debugMode(100, 10, 0, 0, 0, 20, 0, -40, 0);
 *   describe(
 *     'a 3D box is centered on a grid in a 3D sketch. an icon indicates the direction of each axis: a red line points +X, a green line +Y, and a blue line +Z.'
 *   );
 * }
 *
 * function draw() {
 *   noStroke();
 *   background(200);
 *   orbitControl();
 *   box(15, 30);
 *   // set the stroke color and weight for the grid!
 *   stroke(255, 0, 150);
 *   strokeWeight(0.8);
 *   describe(`a 3D box is centered on a grid in a 3D sketch.
 *     an icon indicates the direction of each axis:
 *     a red line points +X, a green line +Y, and a blue line +Z.`);
 * }
 * </code>
 * </div>
 */

/**
 * @method debugMode
 * @param {Constant} mode either GRID or AXES
 */

/**
 * @method debugMode
 * @param {Constant} mode
 * @param {Number} [gridSize] size of one side of the grid
 * @param {Number} [gridDivisions] number of divisions in the grid
 * @param {Number} [xOff] X axis offset from origin (0,0,0)
 * @param {Number} [yOff] Y axis offset from origin (0,0,0)
 * @param {Number} [zOff] Z axis offset from origin (0,0,0)
 */

/**
 * @method debugMode
 * @param {Constant} mode
 * @param {Number} [axesSize] size of axes icon
 * @param {Number} [xOff]
 * @param {Number} [yOff]
 * @param {Number} [zOff]
 */

/**
 * @method debugMode
 * @param {Number} [gridSize]
 * @param {Number} [gridDivisions]
 * @param {Number} [gridXOff]
 * @param {Number} [gridYOff]
 * @param {Number} [gridZOff]
 * @param {Number} [axesSize]
 * @param {Number} [axesXOff]
 * @param {Number} [axesYOff]
 * @param {Number} [axesZOff]
 */

p5.prototype.debugMode = function(...args) {
  this._assert3d('debugMode');
  p5._validateParameters('debugMode', args);

  // start by removing existing 'post' registered debug methods
  for (let i = this._registeredMethods.post.length - 1; i >= 0; i--) {
    // test for equality...
    if (
      this._registeredMethods.post[i].toString() === this._grid().toString() ||
      this._registeredMethods.post[i].toString() === this._axesIcon().toString()
    ) {
      this._registeredMethods.post.splice(i, 1);
    }
  }

  // then add new debugMode functions according to the argument list
  if (args[0] === constants.GRID) {
    this.registerMethod(
      'post',
      this._grid.call(this, args[1], args[2], args[3], args[4], args[5])
    );
  } else if (args[0] === constants.AXES) {
    this.registerMethod(
      'post',
      this._axesIcon.call(this, args[1], args[2], args[3], args[4])
    );
  } else {
    this.registerMethod(
      'post',
      this._grid.call(this, args[0], args[1], args[2], args[3], args[4])
    );
    this.registerMethod(
      'post',
      this._axesIcon.call(this, args[5], args[6], args[7], args[8])
    );
  }
};

/**
 * Turns off debugMode() in a 3D sketch.
 * @method noDebugMode
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
 *   normalMaterial();
 *   debugMode();
 *   describe(
 *     'a 3D box is centered on a grid in a 3D sketch. an icon indicates the direction of each axis: a red line points +X, a green line +Y, and a blue line +Z. the grid and icon disappear when the spacebar is pressed.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   box(15, 30);
 *   // Press the spacebar to turn debugMode off!
 *   if (keyIsDown(32)) {
 *     noDebugMode();
 *   }
 *   describe(`a 3D box is centered on a grid in a 3D sketch.
 *     an icon indicates the direction of each axis:
 *     a red line points +X, a green line +Y, and a blue line +Z.
 *     the grid and icon disappear when the spacebar is pressed.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.noDebugMode = function() {
  this._assert3d('noDebugMode');

  // start by removing existing 'post' registered debug methods
  for (let i = this._registeredMethods.post.length - 1; i >= 0; i--) {
    // test for equality...
    if (
      this._registeredMethods.post[i].toString() === this._grid().toString() ||
      this._registeredMethods.post[i].toString() === this._axesIcon().toString()
    ) {
      this._registeredMethods.post.splice(i, 1);
    }
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
    // ensure at least 2 divisions
    numDivs = Math.round(size / 30) < 4 ? 4 : Math.round(size / 30);
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

  const spacing = size / numDivs;
  const halfSize = size / 2;

  return function() {
    this.push();
    this.stroke(
      this._renderer.curStrokeColor[0] * 255,
      this._renderer.curStrokeColor[1] * 255,
      this._renderer.curStrokeColor[2] * 255
    );
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
    for (let q = 0; q <= numDivs; q++) {
      this.beginShape(this.LINES);
      this.vertex(-halfSize + xOff, yOff, q * spacing - halfSize + zOff);
      this.vertex(+halfSize + xOff, yOff, q * spacing - halfSize + zOff);
      this.endShape();
    }

    // Lines along Z axis
    for (let i = 0; i <= numDivs; i++) {
      this.beginShape(this.LINES);
      this.vertex(i * spacing - halfSize + xOff, yOff, -halfSize + zOff);
      this.vertex(i * spacing - halfSize + xOff, yOff, +halfSize + zOff);
      this.endShape();
    }

    this.pop();
  };
};

/**
 * For use with debugMode
 * @private
 * @method _axesIcon
 * @param {Number} [size] size of axes icon lines
 * @param {Number} [xOff] offset of icon from origin in X axis
 * @param {Number} [yOff] offset of icon from origin in Y axis
 * @param {Number} [zOff] offset of icon from origin in Z axis
 */
p5.prototype._axesIcon = function(size, xOff, yOff, zOff) {
  if (typeof size === 'undefined') {
    size = this.width / 20 > 40 ? this.width / 20 : 40;
  }
  if (typeof xOff === 'undefined') {
    xOff = -this.width / 4;
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
    this.strokeWeight(2);
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

export default p5;
