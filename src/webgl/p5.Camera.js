/**
 * @module Lights, Camera
 * @submodule Camera
 * @requires core
 */

'use strict';

import p5 from '../core/main';

////////////////////////////////////////////////////////////////////////////////
// p5.Prototype Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Sets the camera position for a 3D sketch. Parameters for this function define
 * the position for the camera, the center of the sketch (where the camera is
 * pointing), and an up direction (the orientation of the camera).
 *
 * When called with no arguments, this function creates a default camera
 * equivalent to
 * camera(0, 0, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);
 * @method camera
 * @for p5
 * @param  {Number} [x]        camera position value on x axis
 * @param  {Number} [y]        camera position value on y axis
 * @param  {Number} [z]        camera position value on z axis
 * @param  {Number} [centerX]  x coordinate representing center of the sketch
 * @param  {Number} [centerY]  y coordinate representing center of the sketch
 * @param  {Number} [centerZ]  z coordinate representing center of the sketch
 * @param  {Number} [upX]      x component of direction 'up' from camera
 * @param  {Number} [upY]      y component of direction 'up' from camera
 * @param  {Number} [upZ]      z component of direction 'up' from camera
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(204);
 *   //move the camera away from the plane by a sin wave
 *   camera(0, 0, 20 + sin(frameCount * 0.01) * 10, 0, 0, 0, 0, 1, 0);
 *   plane(10, 10);
 * }
 * </code>
 * </div>
 *
 * @alt
 * White square repeatedly grows to fill canvas and then shrinks.
 *
 */
p5.prototype.camera = function() {
  this._assert3d('camera');
  p5._validateParameters('camera', arguments);
  this._renderer._curCamera.camera.apply(this._renderer._curCamera, arguments);
  return this;
};

/**
 * Sets a perspective projection for the camera in a 3D sketch. This projection
 * represents depth through foreshortening: objects that are close to the camera
 * appear their actual size while those that are further away from the camera
 * appear smaller. The parameters to this function define the viewing frustum
 * (the truncated pyramid within which objects are seen by the camera) through
 * vertical field of view, aspect ratio (usually width/height), and near and far
 * clipping planes.
 *
 * When called with no arguments, the defaults
 * provided are equivalent to
 * perspective(PI/3.0, width/height, eyeZ/10.0, eyeZ*10.0), where eyeZ
 * is equal to ((height/2.0) / tan(PI*60.0/360.0));
 * @method  perspective
 * @for p5
 * @param  {Number} [fovy]   camera frustum vertical field of view,
 *                           from bottom to top of view, in <a href="#/p5/angleMode">angleMode</a> units
 * @param  {Number} [aspect] camera frustum aspect ratio
 * @param  {Number} [near]   frustum near plane length
 * @param  {Number} [far]    frustum far plane length
 * @chainable
 * @example
 * <div>
 * <code>
 * //drag the mouse to look around!
 * //you will see there's a vanishing point
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   perspective(PI / 3.0, width / height, 0.1, 500);
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   normalMaterial();
 *
 *   rotateX(-0.3);
 *   rotateY(-0.2);
 *   translate(0, 0, -50);
 *
 *   push();
 *   translate(-15, 0, sin(frameCount / 30) * 95);
 *   box(30);
 *   pop();
 *   push();
 *   translate(15, 0, sin(frameCount / 30 + PI) * 95);
 *   box(30);
 *   pop();
 * }
 * </code>
 * </div>
 *
 * @alt
 * two colored 3D boxes move back and forth, rotating as mouse is dragged.
 *
 */
p5.prototype.perspective = function() {
  this._assert3d('perspective');
  p5._validateParameters('perspective', arguments);
  this._renderer._curCamera.perspective.apply(
    this._renderer._curCamera,
    arguments
  );
  return this;
};

/**
 * Sets an orthographic projection for the camera in a 3D sketch and defines a
 * box-shaped viewing frustum within which objects are seen. In this projection,
 * all objects with the same dimension appear the same size, regardless of
 * whether they are near or far from the camera. The parameters to this
 * function specify the viewing frustum where left and right are the minimum and
 * maximum x values, top and bottom are the minimum and maximum y values, and near
 * and far are the minimum and maximum z values. If no parameters are given, the
 * default is used: ortho(-width/2, width/2, -height/2, height/2).
 * @method  ortho
 * @for p5
 * @param  {Number} [left]   camera frustum left plane
 * @param  {Number} [right]  camera frustum right plane
 * @param  {Number} [bottom] camera frustum bottom plane
 * @param  {Number} [top]    camera frustum top plane
 * @param  {Number} [near]   camera frustum near plane
 * @param  {Number} [far]    camera frustum far plane
 * @chainable
 * @example
 * <div>
 * <code>
 * //drag the mouse to look around!
 * //there's no vanishing point
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   normalMaterial();
 *
 *   rotateX(0.2);
 *   rotateY(-0.2);
 *   push();
 *   translate(-15, 0, sin(frameCount / 30) * 65);
 *   box(30);
 *   pop();
 *   push();
 *   translate(15, 0, sin(frameCount / 30 + PI) * 65);
 *   box(30);
 *   pop();
 * }
 * </code>
 * </div>
 *
 * @alt
 * two 3D boxes move back and forth along same plane, rotating as mouse is dragged.
 *
 */
p5.prototype.ortho = function() {
  this._assert3d('ortho');
  p5._validateParameters('ortho', arguments);
  this._renderer._curCamera.ortho.apply(this._renderer._curCamera, arguments);
  return this;
};

////////////////////////////////////////////////////////////////////////////////
// p5.Camera
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new <a href="#/p5.Camera">p5.Camera</a> object and tells the
 * renderer to use that camera.
 * Returns the p5.Camera object.
 * @method createCamera
 * @return {p5.Camera} The newly created camera object.
 * @for p5
 */
p5.prototype.createCamera = function() {
  this._assert3d('createCamera');
  var _cam = new p5.Camera(this._renderer);

  // compute default camera settings, then set a default camera
  _cam._computeCameraDefaultSettings();
  _cam._setDefaultCamera();

  // set renderer current camera to the new camera
  this._renderer._curCamera = _cam;

  return _cam;
};

/**
 * This class describes a camera for use in p5's
 * <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5">
 * WebGL mode</a>. It contains camera position, orientation, and projection
 * information necessary for rendering a 3D scene.
 *
 * New p5.Camera objects can be made through the
 * <a href="#/p5/createCamera">createCamera()</a> function and controlled through
 * the methods described below. A camera created in this way will use a default
 * position in the scene and a default perspective projection until these
 * properties are changed through the various methods available. It is possible
 * to create multiple cameras, in which case the current camera
 * can be set through the <a href="#/p5/setCamera">setCamera()</a> method.
 *
 *
 * Note:
 * The methods below operate in two coordinate systems: the 'world' coordinate
 * system describe positions in terms of their relationship to the origin along
 * the X, Y and Z axes whereas the camera's 'local' coordinate system
 * describes positions from the camera's point of view: left-right, up-down,
 * and forward-backward. The <a href="#/p5.Camera/move">move()</a> method,
 * for instance, moves the camera along its own axes, whereas the
 * <a href="#/p5.Camera/setPosition">setPosition()</a>
 * method sets the camera's position in world-space.
 *
 *
 * @class p5.Camera
 * @param {rendererGL} rendererGL instance of WebGL renderer
 * @example
 * <div>
 * <code>
 * let cam;
 * let delta = 0.01;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *   cam = createCamera();
 *   // set initial pan angle
 *   cam.pan(-0.8);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // pan camera according to angle 'delta'
 *   cam.pan(delta);
 *
 *   // every 160 frames, switch direction
 *   if (frameCount % 160 === 0) {
 *     delta *= -1;
 *   }
 *
 *   rotateX(frameCount * 0.01);
 *   translate(-100, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera view pans left and right across a series of rotating 3D boxes.
 *
 */
p5.Camera = function(renderer) {
  this._renderer = renderer;

  this.cameraType = 'default';

  this.cameraMatrix = new p5.Matrix();
  this.projMatrix = new p5.Matrix();
};

////////////////////////////////////////////////////////////////////////////////
// Camera Projection Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Sets a perspective projection for a p5.Camera object and sets parameters
 * for that projection according to <a href="#/p5/perspective">perspective()</a>
 * syntax.
 * @method perspective
 * @for p5.Camera
 */
p5.Camera.prototype.perspective = function(fovy, aspect, near, far) {
  if (typeof fovy === 'undefined') {
    fovy = this.defaultCameraFOV;
    // this avoids issue where setting angleMode(DEGREES) before calling
    // perspective leads to a smaller than expected FOV (because
    // _computeCameraDefaultSettings computes in radians)
    this.cameraFOV = fovy;
  } else {
    this.cameraFOV = this._renderer._pInst._toRadians(fovy);
  }
  if (typeof aspect === 'undefined') {
    aspect = this.defaultAspectRatio;
  }
  if (typeof near === 'undefined') {
    near = this.defaultCameraNear;
  }
  if (typeof far === 'undefined') {
    far = this.defaultCameraFar;
  }

  if (near <= 0.0001) {
    near = 0.01;
    console.log(
      'Avoid perspective near plane values close to or below 0. ' +
        'Setting value to 0.01.'
    );
  }

  if (far < near) {
    console.log(
      'Perspective far plane value is less than near plane value. ' +
        'Nothing will be shown.'
    );
  }

  this.aspectRatio = aspect;
  this.cameraNear = near;
  this.cameraFar = far;

  this.projMatrix = p5.Matrix.identity();

  var f = 1.0 / Math.tan(this.cameraFOV / 2);
  var nf = 1.0 / (this.cameraNear - this.cameraFar);

  // prettier-ignore
  this.projMatrix.set(f / aspect,  0,                     0,  0,
                      0,          -f,                     0,  0,
                      0,           0,     (far + near) * nf, -1,
                      0,           0, (2 * far * near) * nf,  0);

  if (this._isActive()) {
    this._renderer.uPMatrix.set(
      this.projMatrix.mat4[0],
      this.projMatrix.mat4[1],
      this.projMatrix.mat4[2],
      this.projMatrix.mat4[3],
      this.projMatrix.mat4[4],
      this.projMatrix.mat4[5],
      this.projMatrix.mat4[6],
      this.projMatrix.mat4[7],
      this.projMatrix.mat4[8],
      this.projMatrix.mat4[9],
      this.projMatrix.mat4[10],
      this.projMatrix.mat4[11],
      this.projMatrix.mat4[12],
      this.projMatrix.mat4[13],
      this.projMatrix.mat4[14],
      this.projMatrix.mat4[15]
    );
  }

  this.cameraType = 'custom';
};

/**
 * Sets an orthographic projection for a p5.Camera object and sets parameters
 * for that projection according to <a href="#/p5/ortho">ortho()</a> syntax.
 * @method ortho
 * @for p5.Camera
 */
p5.Camera.prototype.ortho = function(left, right, bottom, top, near, far) {
  if (left === undefined) left = -this._renderer.width / 2;
  if (right === undefined) right = +this._renderer.width / 2;
  if (bottom === undefined) bottom = -this._renderer.height / 2;
  if (top === undefined) top = +this._renderer.height / 2;
  if (near === undefined) near = 0;
  if (far === undefined)
    far = Math.max(this._renderer.width, this._renderer.height);

  var w = right - left;
  var h = top - bottom;
  var d = far - near;

  var x = +2.0 / w;
  var y = +2.0 / h;
  var z = -2.0 / d;

  var tx = -(right + left) / w;
  var ty = -(top + bottom) / h;
  var tz = -(far + near) / d;

  this.projMatrix = p5.Matrix.identity();

  // prettier-ignore
  this.projMatrix.set(  x,  0,  0,  0,
                        0, -y,  0,  0,
                        0,  0,  z,  0,
                        tx, ty, tz,  1);

  if (this._isActive()) {
    this._renderer.uPMatrix.set(
      this.projMatrix.mat4[0],
      this.projMatrix.mat4[1],
      this.projMatrix.mat4[2],
      this.projMatrix.mat4[3],
      this.projMatrix.mat4[4],
      this.projMatrix.mat4[5],
      this.projMatrix.mat4[6],
      this.projMatrix.mat4[7],
      this.projMatrix.mat4[8],
      this.projMatrix.mat4[9],
      this.projMatrix.mat4[10],
      this.projMatrix.mat4[11],
      this.projMatrix.mat4[12],
      this.projMatrix.mat4[13],
      this.projMatrix.mat4[14],
      this.projMatrix.mat4[15]
    );
  }

  this.cameraType = 'custom';
};

////////////////////////////////////////////////////////////////////////////////
// Camera Orientation Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Rotate camera view about arbitrary axis defined by x,y,z
 * based on http://learnwebgl.brown37.net/07_cameras/camera_rotating_motion.html
 * @method _rotateView
 * @private
 */
p5.Camera.prototype._rotateView = function(a, x, y, z) {
  var centerX = this.centerX;
  var centerY = this.centerY;
  var centerZ = this.centerZ;

  // move center by eye position such that rotation happens around eye position
  centerX -= this.eyeX;
  centerY -= this.eyeY;
  centerZ -= this.eyeZ;

  var rotation = p5.Matrix.identity(this._renderer._pInst);
  rotation.rotate(this._renderer._pInst._toRadians(a), x, y, z);

  // prettier-ignore
  var rotatedCenter = [
    centerX * rotation.mat4[0]+ centerY * rotation.mat4[4]+ centerZ * rotation.mat4[8],
    centerX * rotation.mat4[1]+ centerY * rotation.mat4[5]+ centerZ * rotation.mat4[9],
    centerX * rotation.mat4[2]+ centerY * rotation.mat4[6]+ centerZ * rotation.mat4[10]
  ]

  // add eye position back into center
  rotatedCenter[0] += this.eyeX;
  rotatedCenter[1] += this.eyeY;
  rotatedCenter[2] += this.eyeZ;

  this.camera(
    this.eyeX,
    this.eyeY,
    this.eyeZ,
    rotatedCenter[0],
    rotatedCenter[1],
    rotatedCenter[2],
    this.upX,
    this.upY,
    this.upZ
  );
};

/**
 * Panning rotates the camera view to the left and right.
 * @method pan
 * @param {Number} angle amount to rotate camera in current
 * <a href="#/p5/angleMode">angleMode</a> units.
 * Greater than 0 values rotate counterclockwise (to the left).
 * @example
 * <div>
 * <code>
 * let cam;
 * let delta = 0.01;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *   cam = createCamera();
 *   // set initial pan angle
 *   cam.pan(-0.8);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // pan camera according to angle 'delta'
 *   cam.pan(delta);
 *
 *   // every 160 frames, switch direction
 *   if (frameCount % 160 === 0) {
 *     delta *= -1;
 *   }
 *
 *   rotateX(frameCount * 0.01);
 *   translate(-100, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera view pans left and right across a series of rotating 3D boxes.
 *
 */
p5.Camera.prototype.pan = function(amount) {
  var local = this._getLocalAxes();
  this._rotateView(amount, local.y[0], local.y[1], local.y[2]);
};

/**
 * Tilting rotates the camera view up and down.
 * @method tilt
 * @param {Number} angle amount to rotate camera in current
 * <a href="#/p5/angleMode">angleMode</a> units.
 * Greater than 0 values rotate counterclockwise (to the left).
 * @example
 * <div>
 * <code>
 * let cam;
 * let delta = 0.01;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *   cam = createCamera();
 *   // set initial tilt
 *   cam.tilt(-0.8);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // pan camera according to angle 'delta'
 *   cam.tilt(delta);
 *
 *   // every 160 frames, switch direction
 *   if (frameCount % 160 === 0) {
 *     delta *= -1;
 *   }
 *
 *   rotateY(frameCount * 0.01);
 *   translate(0, -100, 0);
 *   box(20);
 *   translate(0, 35, 0);
 *   box(20);
 *   translate(0, 35, 0);
 *   box(20);
 *   translate(0, 35, 0);
 *   box(20);
 *   translate(0, 35, 0);
 *   box(20);
 *   translate(0, 35, 0);
 *   box(20);
 *   translate(0, 35, 0);
 *   box(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera view tilts up and down across a series of rotating 3D boxes.
 */
p5.Camera.prototype.tilt = function(amount) {
  var local = this._getLocalAxes();
  this._rotateView(amount, local.x[0], local.x[1], local.x[2]);
};

/**
 * Reorients the camera to look at a position in world space.
 * @method lookAt
 * @for p5.Camera
 * @param {Number} x x position of a point in world space
 * @param {Number} y y position of a point in world space
 * @param {Number} z z position of a point in world space
 * @example
 * <div>
 * <code>
 * let cam;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *   cam = createCamera();
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // look at a new random point every 60 frames
 *   if (frameCount % 60 === 0) {
 *     cam.lookAt(random(-100, 100), random(-50, 50), 0);
 *   }
 *
 *   rotateX(frameCount * 0.01);
 *   translate(-100, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera view of rotating 3D cubes changes to look at a new random
 * point every second .
 */
p5.Camera.prototype.lookAt = function(x, y, z) {
  this.camera(
    this.eyeX,
    this.eyeY,
    this.eyeZ,
    x,
    y,
    z,
    this.upX,
    this.upY,
    this.upZ
  );
};

////////////////////////////////////////////////////////////////////////////////
// Camera Position Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Sets a camera's position and orientation.  This is equivalent to calling
 * <a href="#/p5/camera">camera()</a> on a p5.Camera object.
 * @method camera
 * @for p5.Camera
 */
p5.Camera.prototype.camera = function(
  eyeX,
  eyeY,
  eyeZ,
  centerX,
  centerY,
  centerZ,
  upX,
  upY,
  upZ
) {
  if (typeof eyeX === 'undefined') {
    eyeX = this.defaultEyeX;
    eyeY = this.defaultEyeY;
    eyeZ = this.defaultEyeZ;
    centerX = eyeX;
    centerY = eyeY;
    centerZ = 0;
    upX = 0;
    upY = 1;
    upZ = 0;
  }

  this.eyeX = eyeX;
  this.eyeY = eyeY;
  this.eyeZ = eyeZ;

  this.centerX = centerX;
  this.centerY = centerY;
  this.centerZ = centerZ;

  this.upX = upX;
  this.upY = upY;
  this.upZ = upZ;

  var local = this._getLocalAxes();

  // the camera affects the model view matrix, insofar as it
  // inverse translates the world to the eye position of the camera
  // and rotates it.
  // prettier-ignore
  this.cameraMatrix.set(local.x[0], local.y[0], local.z[0], 0,
                        local.x[1], local.y[1], local.z[1], 0,
                        local.x[2], local.y[2], local.z[2], 0,
                                 0,          0,          0, 1);

  var tx = -eyeX;
  var ty = -eyeY;
  var tz = -eyeZ;

  this.cameraMatrix.translate([tx, ty, tz]);

  if (this._isActive()) {
    this._renderer.uMVMatrix.set(
      this.cameraMatrix.mat4[0],
      this.cameraMatrix.mat4[1],
      this.cameraMatrix.mat4[2],
      this.cameraMatrix.mat4[3],
      this.cameraMatrix.mat4[4],
      this.cameraMatrix.mat4[5],
      this.cameraMatrix.mat4[6],
      this.cameraMatrix.mat4[7],
      this.cameraMatrix.mat4[8],
      this.cameraMatrix.mat4[9],
      this.cameraMatrix.mat4[10],
      this.cameraMatrix.mat4[11],
      this.cameraMatrix.mat4[12],
      this.cameraMatrix.mat4[13],
      this.cameraMatrix.mat4[14],
      this.cameraMatrix.mat4[15]
    );
  }
  return this;
};

/**
 * Move camera along its local axes while maintaining current camera orientation.
 * @method move
 * @param {Number} x amount to move along camera's left-right axis
 * @param {Number} y amount to move along camera's up-down axis
 * @param {Number} z amount to move along camera's forward-backward axis
 * @example
 * <div>
 * <code>
 * // see the camera move along its own axes while maintaining its orientation
 * let cam;
 * let delta = 0.5;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *   cam = createCamera();
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // move the camera along its local axes
 *   cam.move(delta, delta, 0);
 *
 *   // every 100 frames, switch direction
 *   if (frameCount % 150 === 0) {
 *     delta *= -1;
 *   }
 *
 *   translate(-10, -10, 0);
 *   box(50, 8, 50);
 *   translate(15, 15, 0);
 *   box(50, 8, 50);
 *   translate(15, 15, 0);
 *   box(50, 8, 50);
 *   translate(15, 15, 0);
 *   box(50, 8, 50);
 *   translate(15, 15, 0);
 *   box(50, 8, 50);
 *   translate(15, 15, 0);
 *   box(50, 8, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera view moves along a series of 3D boxes, maintaining the same
 * orientation throughout the move
 */
p5.Camera.prototype.move = function(x, y, z) {
  var local = this._getLocalAxes();

  // scale local axes by movement amounts
  // based on http://learnwebgl.brown37.net/07_cameras/camera_linear_motion.html
  var dx = [local.x[0] * x, local.x[1] * x, local.x[2] * x];
  var dy = [local.y[0] * y, local.y[1] * y, local.y[2] * y];
  var dz = [local.z[0] * z, local.z[1] * z, local.z[2] * z];

  this.camera(
    this.eyeX + dx[0] + dy[0] + dz[0],
    this.eyeY + dx[1] + dy[1] + dz[1],
    this.eyeZ + dx[2] + dy[2] + dz[2],
    this.centerX + dx[0] + dy[0] + dz[0],
    this.centerY + dx[1] + dy[1] + dz[1],
    this.centerZ + dx[2] + dy[2] + dz[2],
    0,
    1,
    0
  );
};

/**
 * Set camera position in world-space while maintaining current camera
 * orientation.
 * @method setPosition
 * @param {Number} x x position of a point in world space
 * @param {Number} y y position of a point in world space
 * @param {Number} z z position of a point in world space
 * @example
 * <div>
 * <code>
 * // press '1' '2' or '3' keys to set camera position
 *
 * let cam;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *   cam = createCamera();
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // '1' key
 *   if (keyIsDown(49)) {
 *     cam.setPosition(30, 0, 80);
 *   }
 *   // '2' key
 *   if (keyIsDown(50)) {
 *     cam.setPosition(0, 0, 80);
 *   }
 *   // '3' key
 *   if (keyIsDown(51)) {
 *     cam.setPosition(-30, 0, 80);
 *   }
 *
 *   box(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera position changes as the user presses keys, altering view of a 3D box
 */
p5.Camera.prototype.setPosition = function(x, y, z) {
  var diffX = x - this.eyeX;
  var diffY = y - this.eyeY;
  var diffZ = z - this.eyeZ;

  this.camera(
    x,
    y,
    z,
    this.centerX + diffX,
    this.centerY + diffY,
    this.centerZ + diffZ,
    0,
    1,
    0
  );
};

////////////////////////////////////////////////////////////////////////////////
// Camera Helper Methods
////////////////////////////////////////////////////////////////////////////////

// @TODO: combine this function with _setDefaultCamera to compute these values
// as-needed
p5.Camera.prototype._computeCameraDefaultSettings = function() {
  this.defaultCameraFOV = 60 / 180 * Math.PI;
  this.defaultAspectRatio = this._renderer.width / this._renderer.height;
  this.defaultEyeX = 0;
  this.defaultEyeY = 0;
  this.defaultEyeZ =
    this._renderer.height / 2.0 / Math.tan(this.defaultCameraFOV / 2.0);
  this.defaultCenterX = 0;
  this.defaultCenterY = 0;
  this.defaultCenterZ = 0;
  this.defaultCameraNear = this.defaultEyeZ * 0.1;
  this.defaultCameraFar = this.defaultEyeZ * 10;
};

//detect if user didn't set the camera
//then call this function below
p5.Camera.prototype._setDefaultCamera = function() {
  this.cameraFOV = this.defaultCameraFOV;
  this.aspectRatio = this.defaultAspectRatio;
  this.eyeX = this.defaultEyeX;
  this.eyeY = this.defaultEyeY;
  this.eyeZ = this.defaultEyeZ;
  this.centerX = this.defaultCenterX;
  this.centerY = this.defaultCenterY;
  this.centerZ = this.defaultCenterZ;
  this.upX = 0;
  this.upY = 1;
  this.upZ = 0;
  this.cameraNear = this.defaultCameraNear;
  this.cameraFar = this.defaultCameraFar;

  this.perspective();
  this.camera();

  this.cameraType = 'default';
};

p5.Camera.prototype._resize = function() {
  // If we're using the default camera, update the aspect ratio
  if (this.cameraType === 'default') {
    this._computeCameraDefaultSettings();
    this._setDefaultCamera();
  } else {
    this.perspective(
      this.cameraFOV,
      this._renderer.width / this._renderer.height
    );
  }
};

/**
 * Returns a copy of a camera.
 * @method copy
 * @private
 */
p5.Camera.prototype.copy = function() {
  var _cam = new p5.Camera(this._renderer);
  _cam.cameraFOV = this.cameraFOV;
  _cam.aspectRatio = this.aspectRatio;
  _cam.eyeX = this.eyeX;
  _cam.eyeY = this.eyeY;
  _cam.eyeZ = this.eyeZ;
  _cam.centerX = this.centerX;
  _cam.centerY = this.centerY;
  _cam.centerZ = this.centerZ;
  _cam.cameraNear = this.cameraNear;
  _cam.cameraFar = this.cameraFar;

  _cam.cameraType = this.cameraType;

  _cam.cameraMatrix = this.cameraMatrix.copy();
  _cam.projMatrix = this.projMatrix.copy();

  return _cam;
};

/**
 * Returns a camera's local axes: left-right, up-down, and forward-backward,
 * as defined by vectors in world-space.
 * @method _getLocalAxes
 * @private
 */
p5.Camera.prototype._getLocalAxes = function() {
  // calculate camera local Z vector
  var z0 = this.eyeX - this.centerX;
  var z1 = this.eyeY - this.centerY;
  var z2 = this.eyeZ - this.centerZ;

  // normalize camera local Z vector
  var eyeDist = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  if (eyeDist !== 0) {
    z0 /= eyeDist;
    z1 /= eyeDist;
    z2 /= eyeDist;
  }

  // calculate camera Y vector
  var y0 = this.upX;
  var y1 = this.upY;
  var y2 = this.upZ;

  // compute camera local X vector as up vector (local Y) cross local Z
  var x0 = y1 * z2 - y2 * z1;
  var x1 = -y0 * z2 + y2 * z0;
  var x2 = y0 * z1 - y1 * z0;

  // recompute y = z cross x
  y0 = z1 * x2 - z2 * x1;
  y1 = -z0 * x2 + z2 * x0;
  y2 = z0 * x1 - z1 * x0;

  // cross product gives area of parallelogram, which is < 1.0 for
  // non-perpendicular unit-length vectors; so normalize x, y here:
  var xmag = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (xmag !== 0) {
    x0 /= xmag;
    x1 /= xmag;
    x2 /= xmag;
  }

  var ymag = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (ymag !== 0) {
    y0 /= ymag;
    y1 /= ymag;
    y2 /= ymag;
  }

  return {
    x: [x0, x1, x2],
    y: [y0, y1, y2],
    z: [z0, z1, z2]
  };
};

/**
 * Orbits the camera about center point. For use with orbitControl().
 * @method _orbit
 * @private
 * @param {Number} dTheta change in spherical coordinate theta
 * @param {Number} dPhi change in spherical coordinate phi
 * @param {Number} dRadius change in radius
 */
p5.Camera.prototype._orbit = function(dTheta, dPhi, dRadius) {
  var diffX = this.eyeX - this.centerX;
  var diffY = this.eyeY - this.centerY;
  var diffZ = this.eyeZ - this.centerZ;

  // get spherical coorinates for current camera position about origin
  var camRadius = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
  // from https://github.com/mrdoob/three.js/blob/dev/src/math/Spherical.js#L72-L73
  var camTheta = Math.atan2(diffX, diffZ); // equatorial angle
  var camPhi = Math.acos(Math.max(-1, Math.min(1, diffY / camRadius))); // polar angle

  // add change
  camTheta += dTheta;
  camPhi += dPhi;
  camRadius += dRadius;

  // prevent zooming through the center:
  if (camRadius < 0) {
    camRadius = 0.1;
  }

  // prevent rotation over the zenith / under bottom
  if (camPhi > Math.PI) {
    camPhi = Math.PI;
  } else if (camPhi <= 0) {
    camPhi = 0.001;
  }

  // from https://github.com/mrdoob/three.js/blob/dev/src/math/Vector3.js#L628-L632
  var _x = Math.sin(camPhi) * camRadius * Math.sin(camTheta);
  var _y = Math.cos(camPhi) * camRadius;
  var _z = Math.sin(camPhi) * camRadius * Math.cos(camTheta);

  this.camera(
    _x + this.centerX,
    _y + this.centerY,
    _z + this.centerZ,
    this.centerX,
    this.centerY,
    this.centerZ,
    0,
    1,
    0
  );
};

/**
 * Returns true if camera is currently attached to renderer.
 * @method _isActive
 * @private
 */
p5.Camera.prototype._isActive = function() {
  return this === this._renderer._curCamera;
};

/**
 * Sets rendererGL's current camera to a p5.Camera object.  Allows switching
 * between multiple cameras.
 * @method setCamera
 * @param  {p5.Camera} cam  p5.Camera object
 * @for p5
 * @example
 * <div>
 * <code>
 * let cam1, cam2;
 * let currentCamera;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   normalMaterial();
 *
 *   cam1 = createCamera();
 *   cam2 = createCamera();
 *   cam2.setPosition(30, 0, 50);
 *   cam2.lookAt(0, 0, 0);
 *   cam2.ortho();
 *
 *   // set variable for previously active camera:
 *   currentCamera = 1;
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // camera 1:
 *   cam1.lookAt(0, 0, 0);
 *   cam1.setPosition(sin(frameCount / 60) * 200, 0, 100);
 *
 *   // every 100 frames, switch between the two cameras
 *   if (frameCount % 100 === 0) {
 *     if (currentCamera === 1) {
 *       setCamera(cam1);
 *       currentCamera = 0;
 *     } else {
 *       setCamera(cam2);
 *       currentCamera = 1;
 *     }
 *   }
 *
 *   drawBoxes();
 * }
 *
 * function drawBoxes() {
 *   rotateX(frameCount * 0.01);
 *   translate(-100, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 *   translate(35, 0, 0);
 *   box(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Canvas switches between two camera views, each showing a series of spinning
 * 3D boxes.
 */
p5.prototype.setCamera = function(cam) {
  this._renderer._curCamera = cam;

  // set the projection matrix (which is not normally updated each frame)
  this._renderer.uPMatrix.set(
    cam.projMatrix.mat4[0],
    cam.projMatrix.mat4[1],
    cam.projMatrix.mat4[2],
    cam.projMatrix.mat4[3],
    cam.projMatrix.mat4[4],
    cam.projMatrix.mat4[5],
    cam.projMatrix.mat4[6],
    cam.projMatrix.mat4[7],
    cam.projMatrix.mat4[8],
    cam.projMatrix.mat4[9],
    cam.projMatrix.mat4[10],
    cam.projMatrix.mat4[11],
    cam.projMatrix.mat4[12],
    cam.projMatrix.mat4[13],
    cam.projMatrix.mat4[14],
    cam.projMatrix.mat4[15]
  );
};

export default p5.Camera;
