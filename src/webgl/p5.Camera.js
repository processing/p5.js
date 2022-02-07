/**
 * @module 3D
 * @submodule Camera
 * @requires core
 */

import p5 from '../core/main';

////////////////////////////////////////////////////////////////////////////////
// p5.Prototype Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Sets the position of the current camera in a 3D sketch.
 * Parameters for this function define the camera's position,
 * the center of the sketch (where the camera is pointing),
 * and an up direction (the orientation of the camera).
 *
 * This function simulates the movements of the camera, allowing objects to be
 * viewed from various angles. Remember, it does not move the objects themselves
 * but the camera instead. For example when the centerX value is positive,
 * and the camera is rotating to the right side of the sketch,
 * the object will seem like it's moving to the left.
 *
 * See this <a href = "https://www.openprocessing.org/sketch/740258">example</a>
 * to view the position of your camera.
 *
 * If no parameters are given, the following default is used:
 * camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)
 * @method camera
 * @constructor
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
 *   describe('a square moving closer and then away from the camera.');
 * }
 * function draw() {
 *   background(204);
 *   //move the camera away from the plane by a sin wave
 *   camera(0, 0, 20 + sin(frameCount * 0.01) * 10, 0, 0, 0, 0, 1, 0);
 *   plane(10, 10);
 *   describe(`White square repeatedly grows to fill canvas and
 *     then shrinks.`);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * //move slider to see changes!
 * //sliders control the first 6 parameters of camera()
 * let sliderGroup = [];
 * let X;
 * let Y;
 * let Z;
 * let centerX;
 * let centerY;
 * let centerZ;
 * let h = 20;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   //create sliders
 *   for (var i = 0; i < 6; i++) {
 *     if (i === 2) {
 *       sliderGroup[i] = createSlider(10, 400, 200);
 *     } else {
 *       sliderGroup[i] = createSlider(-400, 400, 0);
 *     }
 *     h = map(i, 0, 6, 5, 85);
 *     sliderGroup[i].position(10, height + h);
 *     sliderGroup[i].style('width', '80px');
 *   }
 *   describe(
 *     'White square repeatedly grows to fill canvas and then shrinks. An interactive example of a red cube with 3 sliders for moving it across x, y, z axis and 3 sliders for shifting its center.'
 *   );
 * }
 *
 * function draw() {
 *   background(60);
 *   // assigning sliders' value to each parameters
 *   X = sliderGroup[0].value();
 *   Y = sliderGroup[1].value();
 *   Z = sliderGroup[2].value();
 *   centerX = sliderGroup[3].value();
 *   centerY = sliderGroup[4].value();
 *   centerZ = sliderGroup[5].value();
 *   camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);
 *   stroke(255);
 *   fill(255, 102, 94);
 *   box(85);
 *   describe(`An interactive example of a red cube with 3 sliders
 *     for moving it across x, y, and z axis and 3 sliders for shifting
 *     its center.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.camera = function(...args) {
  this._assert3d('camera');
  p5._validateParameters('camera', args);
  this._renderer._curCamera.camera(...args);
  return this;
};

/**
 * Sets a perspective projection for the current camera in a 3D sketch.
 * This projection represents depth through foreshortening: objects
 * that are close to the camera appear their actual size while those
 * that are further away from the camera appear smaller.
 *
 * The parameters to this function define the viewing frustum
 * (the truncated pyramid within which objects are seen by the camera) through
 * vertical field of view, aspect ratio (usually width/height), and near and far
 * clipping planes.
 *
 * If no parameters are given, the following default is used:
 * perspective(PI/3, width/height, eyeZ/10, eyeZ*10),
 * where eyeZ is equal to ((height/2) / tan(PI/6)).
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
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   perspective(PI / 3.0, width / height, 0.1, 500);
 *   describe(
 *     'two colored 3D boxes move back and forth, rotating as mouse is dragged.'
 *   );
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
 *
 *   describe(`Two colored 3D boxes move back and forth, rotating as
 *     mouse is dragged.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.perspective = function(...args) {
  this._assert3d('perspective');
  p5._validateParameters('perspective', args);
  this._renderer._curCamera.perspective(...args);
  return this;
};

/**
 * Sets an orthographic projection for the current camera in a 3D sketch
 * and defines a box-shaped viewing frustum within which objects are seen.
 * In this projection, all objects with the same dimension appear the same
 * size, regardless of whether they are near or far from the camera.
 *
 * The parameters to this function specify the viewing frustum where
 * left and right are the minimum and maximum x values, top and bottom are
 * the minimum and maximum y values, and near and far are the minimum and
 * maximum z values.
 *
 * If no parameters are given, the following default is used:
 * ortho(-width/2, width/2, -height/2, height/2).
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
 *   describe(
 *     'two 3D boxes move back and forth along same plane, rotating as mouse is dragged.'
 *   );
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
 *
 *   describe(`Two 3D boxes move back and forth along same plane,
 *     rotating as mouse is dragged.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.ortho = function(...args) {
  this._assert3d('ortho');
  p5._validateParameters('ortho', args);
  this._renderer._curCamera.ortho(...args);
  return this;
};

/**
 * Sets the frustum of the current camera as defined by
 * the parameters.
 *
 * A frustum is a geometric form: a pyramid with its top
 * cut off. With the viewer's eye at the imaginary top of
 * the pyramid, the six planes of the frustum act as clipping
 * planes when rendering a 3D view. Thus, any form inside the
 * clipping planes is visible; anything outside
 * those planes is not visible.
 *
 * Setting the frustum changes the perspective of the scene being rendered.
 * This can be achieved more simply in many cases by using
 * <a href="https://p5js.org/reference/#/p5/perspective">perspective()</a>.
 *
 * If no parameters are given, the following default is used:
 * frustum(-width/2, width/2, -height/2, height/2, 0, max(width, height)).
 * @method frustum
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
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   setAttributes('antialias', true);
 *   frustum(-0.1, 0.1, -0.1, 0.1, 0.1, 200);
 *   describe(
 *     'two 3D boxes move back and forth along same plane, rotating as mouse is dragged.'
 *   );
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   normalMaterial();
 *
 *   rotateY(-0.2);
 *   rotateX(-0.3);
 *   push();
 *   translate(-15, 0, sin(frameCount / 30) * 25);
 *   box(30);
 *   pop();
 *   push();
 *   translate(15, 0, sin(frameCount / 30 + PI) * 25);
 *   box(30);
 *   pop();
 *
 *   describe(`Two 3D boxes move back and forth along same plane, rotating
 *     as mouse is dragged.`);
 * }
 * </code>
 * </div>
 */
p5.prototype.frustum = function(...args) {
  this._assert3d('frustum');
  p5._validateParameters('frustum', args);
  this._renderer._curCamera.frustum(...args);
  return this;
};

////////////////////////////////////////////////////////////////////////////////
// p5.Camera
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new <a href="#/p5.Camera">p5.Camera</a> object and sets it
 * as the current (active) camera.
 *
 * The new camera is initialized with a default position
 * (see <a href="#/p5.Camera/camera">camera()</a>)
 * and a default perspective projection
 * (see <a href="#/p5.Camera/perspective">perspective()</a>).
 * Its properties can be controlled with the <a href="#/p5.Camera">p5.Camera</a>
 * methods.
 *
 * Note: Every 3D sketch starts with a default camera initialized.
 * This camera can be controlled with the global methods
 * <a href="#/p5/camera">camera()</a>,
 * <a href="#/p5/perspective">perspective()</a>, <a href="#/p5/ortho">ortho()</a>,
 * and <a href="#/p5/frustum">frustum()</a> if it is the only camera
 * in the scene.
 * @method createCamera
 * @return {p5.Camera} The newly created camera object.
 * @for p5
 * @example
 * <div><code>
 * // Creates a camera object and animates it around a box.
 * let camera;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(0);
 *   camera = createCamera();
 *   describe('An example that creates a camera and moves it around the box.');
 * }
 *
 * function draw() {
 *   camera.lookAt(0, 0, 0);
 *   camera.setPosition(sin(frameCount / 60) * 200, 0, 100);
 *   box(20);
 *   describe(`An example that creates a camera and moves it around the box.`);
 * }
 * </code></div>
 */
p5.prototype.createCamera = function() {
  this._assert3d('createCamera');
  const _cam = new p5.Camera(this._renderer);

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
 * The camera object propreties
 * <code>eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ</code>
 * which describes camera position, orientation, and projection
 * are also accessible via the camera object generated using
 * <a href="#/p5/createCamera">createCamera()</a>
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
 *   describe(
 *     'camera view pans left and right across a series of rotating 3D boxes.'
 *   );
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
 *
 *   describe(`Camera view pans left and right across a series of
 *     rotating 3D boxes.`);
 * }
 * </code>
 * </div>
 */
p5.Camera = function(renderer) {
  this._renderer = renderer;

  this.cameraType = 'default';

  this.cameraMatrix = new p5.Matrix();
  this.projMatrix = new p5.Matrix();
};
/**
 * camera position value on x axis
 * @property {Number} eyeX
 * @readonly
 * @example
 *
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(0);
 *   cam = createCamera();
 *   div = createDiv();
 *   div.position(0, 0);
 *   describe('An example showing the use of camera object properties');
 * }
 *
 * function draw() {
 *   orbitControl();
 *   box(10);
 *   div.html('eyeX = ' + cam.eyeX);
 *   describe(`An example showing the use of camera object properties`);
 * }
 * </code></div>
 */

/**
 * camera position value on y axis
 * @property {Number} eyeY
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(0);
 *   cam = createCamera();
 *   div = createDiv();
 *   div.position(0, 0);
 *   describe('An example showing the use of camera object properties');
 * }
 *
 * function draw() {
 *   orbitControl();
 *   box(10);
 *   div.html('eyeY = ' + cam.eyeY);
 *   describe(`An example showing the use of camera object properties`);
 * }
 * </code></div>
 */

/**
 * camera position value on z axis
 * @property {Number} eyeZ
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(0);
 *   cam = createCamera();
 *   div = createDiv();
 *   div.position(0, 0);
 *   describe('An example showing the use of camera object properties');
 * }
 *
 * function draw() {
 *   orbitControl();
 *   box(10);
 *   div.html('eyeZ = ' + cam.eyeZ);
 *   describe(`An example showing the use of camera object properties`);
 * }
 * </code></div>
 */

/**
 * x coordinate representing center of the sketch
 * @property {Number} centerX
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(255);
 *   cam = createCamera();
 *   cam.lookAt(1, 0, 0);
 *   div = createDiv('centerX = ' + cam.centerX);
 *   div.position(0, 0);
 *   div.style('color', 'white');
 *   describe('An example showing the use of camera object properties');
 * }
 *
 * function draw() {
 *   orbitControl();
 *   box(10);
 *   describe(`An example showing the use of camera object properties`);
 * }
 * </code></div>
 */

/**
 * y coordinate representing center of the sketch
 * @property {Number} centerY
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(255);
 *   cam = createCamera();
 *   cam.lookAt(0, 1, 0);
 *   div = createDiv('centerY = ' + cam.centerY);
 *   div.position(0, 0);
 *   div.style('color', 'white');
 *   describe('An example showing the use of camera object properties');
 * }
 *
 * function draw() {
 *   orbitControl();
 *   box(10);
 *   describe(`An example showing the use of camera object properties`);
 * }
 * </code></div>
 */

/**
 * z coordinate representing center of the sketch
 * @property {Number} centerZ
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(255);
 *   cam = createCamera();
 *   cam.lookAt(0, 0, 1);
 *   div = createDiv('centerZ = ' + cam.centerZ);
 *   div.position(0, 0);
 *   div.style('color', 'white');
 *   describe('An example showing the use of camera object properties');
 * }
 *
 * function draw() {
 *   orbitControl();
 *   box(10);
 *   describe(`An example showing the use of camera object properties`);
 * }
 * </code></div>
 */

/**
 * x component of direction 'up' from camera
 * @property {Number} upX
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(255);
 *   cam = createCamera();
 *   div = createDiv('upX = ' + cam.upX);
 *   div.position(0, 0);
 *   div.style('color', 'blue');
 *   div.style('font-size', '18px');
 *   describe(`An example showing the use of camera object properties`);
 * }
 * </code></div>
 */

/**
 * y component of direction 'up' from camera
 * @property {Number} upY
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(255);
 *   cam = createCamera();
 *   div = createDiv('upY = ' + cam.upY);
 *   div.position(0, 0);
 *   div.style('color', 'blue');
 *   div.style('font-size', '18px');
 *   describe('An example showing the use of camera object properties');
 * }
 * </code></div>
 */

/**
 * z component of direction 'up' from camera
 * @property {Number} upZ
 * @readonly
 * @example
 * <div class='norender'><code>
 * let cam, div;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   background(255);
 *   cam = createCamera();
 *   div = createDiv('upZ = ' + cam.upZ);
 *   div.position(0, 0);
 *   div.style('color', 'blue');
 *   div.style('font-size', '18px');
 *   describe('An example showing the use of camera object properties');
 * }
 * </code></div>
 */

////////////////////////////////////////////////////////////////////////////////
// Camera Projection Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Sets a perspective projection.
 * Accepts the same parameters as the global
 * <a href="#/p5/perspective">perspective()</a>.
 * More information on this function can be found there.
 * @method perspective
 * @for p5.Camera
 * @example
 * <div>
 * <code>
 * // drag the mouse to look around!
 *
 * let cam;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   // create a camera
 *   cam = createCamera();
 *   // give it a perspective projection
 *   cam.perspective(PI / 3.0, width / height, 0.1, 500);
 * }
 *
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
 *
 *   describe(`Two colored 3D boxes move back and forth, rotating as
 *     mouse is dragged.`);
 * }
 * </code>
 * </div>
 */
p5.Camera.prototype.perspective = function(fovy, aspect, near, far) {
  this.cameraType = arguments.length > 0 ? 'custom' : 'default';
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

  const f = 1.0 / Math.tan(this.cameraFOV / 2);
  const nf = 1.0 / (this.cameraNear - this.cameraFar);

  /* eslint-disable indent */
  this.projMatrix.set(f / aspect,  0,                     0,  0,
                      0,          -f,                     0,  0,
                      0,           0,     (far + near) * nf, -1,
                      0,           0, (2 * far * near) * nf,  0);
  /* eslint-enable indent */

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
};

/**
 * Sets an orthographic projection.
 * Accepts the same parameters as the global
 * <a href="#/p5/ortho">ortho()</a>.
 * More information on this function can be found there.
 * @method ortho
 * @for p5.Camera
 * @example
 * <div>
 * <code>
 * // drag the mouse to look around!
 * // there's no vanishing point
 *
 * let cam;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   // create a camera
 *   cam = createCamera();
 *   // give it an orthographic projection
 *   cam.ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
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
 *
 *   describe(`Two 3D boxes move back and forth along same plane, rotating
 *     as mouse is dragged.`);
 * }
 * </code>
 * </div>
 */
p5.Camera.prototype.ortho = function(left, right, bottom, top, near, far) {
  if (left === undefined) left = -this._renderer.width / 2;
  if (right === undefined) right = +this._renderer.width / 2;
  if (bottom === undefined) bottom = -this._renderer.height / 2;
  if (top === undefined) top = +this._renderer.height / 2;
  if (near === undefined) near = 0;
  if (far === undefined)
    far = Math.max(this._renderer.width, this._renderer.height);

  const w = right - left;
  const h = top - bottom;
  const d = far - near;

  const x = +2.0 / w;
  const y = +2.0 / h;
  const z = -2.0 / d;

  const tx = -(right + left) / w;
  const ty = -(top + bottom) / h;
  const tz = -(far + near) / d;

  this.projMatrix = p5.Matrix.identity();

  /* eslint-disable indent */
  this.projMatrix.set(  x,  0,  0,  0,
                        0, -y,  0,  0,
                        0,  0,  z,  0,
                        tx, ty, tz,  1);
  /* eslint-enable indent */

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
 * Sets the camera's frustum.
 * Accepts the same parameters as the global
 * <a href="#/p5/frustum">frustum()</a>.
 * More information on this function can be found there.
 * @method frustum
 * @for p5.Camera
 * @example
 * <div>
 * <code>
 * let cam;
 *
 * function setup() {
 *   x = createCanvas(100, 100, WEBGL);
 *   setAttributes('antialias', true);
 *   // create a camera
 *   cam = createCamera();
 *   // set its frustum
 *   cam.frustum(-0.1, 0.1, -0.1, 0.1, 0.1, 200);
 * }
 *
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   normalMaterial();
 *
 *   rotateY(-0.2);
 *   rotateX(-0.3);
 *   push();
 *   translate(-15, 0, sin(frameCount / 30) * 25);
 *   box(30);
 *   pop();
 *   push();
 *   translate(15, 0, sin(frameCount / 30 + PI) * 25);
 *   box(30);
 *   pop();
 *
 *   describe(`Two 3D boxes move back and forth along same plane, rotating
 *     as mouse is dragged.`);
 * }
 * </code>
 * </div>
 */
p5.Camera.prototype.frustum = function(left, right, bottom, top, near, far) {
  if (left === undefined) left = -this._renderer.width / 2;
  if (right === undefined) right = +this._renderer.width / 2;
  if (bottom === undefined) bottom = -this._renderer.height / 2;
  if (top === undefined) top = +this._renderer.height / 2;
  if (near === undefined) near = 0;
  if (far === undefined)
    far = Math.max(this._renderer.width, this._renderer.height);

  const w = right - left;
  const h = top - bottom;
  const d = far - near;

  const x = +(2.0 * near) / w;
  const y = +(2.0 * near) / h;
  const z = -(2.0 * far * near) / d;

  const tx = (right + left) / w;
  const ty = (top + bottom) / h;
  const tz = -(far + near) / d;

  this.projMatrix = p5.Matrix.identity();

  /* eslint-disable indent */
  this.projMatrix.set(  x,  0,  0,  0,
                        0,  y,  0,  0,
                       tx, ty, tz, -1,
                        0,  0,  z,  0);
  /* eslint-enable indent */

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
  let centerX = this.centerX;
  let centerY = this.centerY;
  let centerZ = this.centerZ;

  // move center by eye position such that rotation happens around eye position
  centerX -= this.eyeX;
  centerY -= this.eyeY;
  centerZ -= this.eyeZ;

  const rotation = p5.Matrix.identity(this._renderer._pInst);
  rotation.rotate(this._renderer._pInst._toRadians(a), x, y, z);

  /* eslint-disable max-len */
  const rotatedCenter = [
    centerX * rotation.mat4[0] + centerY * rotation.mat4[4] + centerZ * rotation.mat4[8],
    centerX * rotation.mat4[1] + centerY * rotation.mat4[5] + centerZ * rotation.mat4[9],
    centerX * rotation.mat4[2] + centerY * rotation.mat4[6] + centerZ * rotation.mat4[10]
  ];
  /* eslint-enable max-len */

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
 *
 *   describe(`Camera view pans left and right across a series of
 *     rotating 3D boxes.`);
 * }
 * </code>
 * </div>
 */
p5.Camera.prototype.pan = function(amount) {
  const local = this._getLocalAxes();
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
 *
 *   describe(`Camera view tilts up and down across a series of
 *     rotating 3D boxes.`);
 * }
 * </code>
 * </div>
 */
p5.Camera.prototype.tilt = function(amount) {
  const local = this._getLocalAxes();
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
 *
 *   describe(`Camera view of rotating 3D cubes changes to look at a
 *     new random point every second.`);
 * }
 * </code>
 * </div>
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
 * Sets the camera's position and orientation.
 * Accepts the same parameters as the global
 * <a href="#/p5/camera">camera()</a>.
 * More information on this function can be found there.
 * @method camera
 * @for p5.Camera
 * @example
 * <div>
 * <code>
 * let cam;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   // Create a camera.
 *   // createCamera() sets the newly created camera as
 *   // the current (active) camera.
 *   cam = createCamera();
 * }
 *
 * function draw() {
 *   background(204);
 *   // Move the camera away from the plane by a sin wave
 *   cam.camera(0, 0, 20 + sin(frameCount * 0.01) * 10, 0, 0, 0, 0, 1, 0);
 *   plane(10, 10);
 *   describe(`White square repeatedly grows to fill canvas and then shrinks.`);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * // move slider to see changes!
 * // sliders control the first 6 parameters of camera()
 *
 * let sliderGroup = [];
 * let X;
 * let Y;
 * let Z;
 * let centerX;
 * let centerY;
 * let centerZ;
 * let h = 20;
 * let cam;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   // create a camera
 *   cam = createCamera();
 *   // create sliders
 *   for (var i = 0; i < 6; i++) {
 *     if (i === 2) {
 *       sliderGroup[i] = createSlider(10, 400, 200);
 *     } else {
 *       sliderGroup[i] = createSlider(-400, 400, 0);
 *     }
 *     h = map(i, 0, 6, 5, 85);
 *     sliderGroup[i].position(10, height + h);
 *     sliderGroup[i].style('width', '80px');
 *   }
 * }
 *
 * function draw() {
 *   background(60);
 *   // assigning sliders' value to each parameters
 *   X = sliderGroup[0].value();
 *   Y = sliderGroup[1].value();
 *   Z = sliderGroup[2].value();
 *   centerX = sliderGroup[3].value();
 *   centerY = sliderGroup[4].value();
 *   centerZ = sliderGroup[5].value();
 *   cam.camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);
 *   stroke(255);
 *   fill(255, 102, 94);
 *   box(85);
 *   describe(`An interactive example of a red cube with 3 sliders for
 *     moving it across x, y, z axis and 3 sliders for shifting its center.`);
 * }
 * </code>
 * </div>
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

  if (typeof centerX !== 'undefined') {
    this.centerX = centerX;
    this.centerY = centerY;
    this.centerZ = centerZ;
  }

  if (typeof upX !== 'undefined') {
    this.upX = upX;
    this.upY = upY;
    this.upZ = upZ;
  }

  const local = this._getLocalAxes();

  // the camera affects the model view matrix, insofar as it
  // inverse translates the world to the eye position of the camera
  // and rotates it.
  /* eslint-disable indent */
  this.cameraMatrix.set(local.x[0], local.y[0], local.z[0], 0,
                        local.x[1], local.y[1], local.z[1], 0,
                        local.x[2], local.y[2], local.z[2], 0,
                                 0,          0,          0, 1);
  /* eslint-enable indent */

  const tx = -eyeX;
  const ty = -eyeY;
  const tz = -eyeZ;

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
 *
 *   describe(`Camera view moves along a series of 3D boxes,
 *     maintaining the same orientation throughout the move`);
 * }
 * </code>
 * </div>
 */
p5.Camera.prototype.move = function(x, y, z) {
  const local = this._getLocalAxes();

  // scale local axes by movement amounts
  // based on http://learnwebgl.brown37.net/07_cameras/camera_linear_motion.html
  const dx = [local.x[0] * x, local.x[1] * x, local.x[2] * x];
  const dy = [local.y[0] * y, local.y[1] * y, local.y[2] * y];
  const dz = [local.z[0] * z, local.z[1] * z, local.z[2] * z];

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
 *
 *   describe(`Camera position changes as the user presses keys,
 *     altering view of a 3D box`);
 * }
 * </code>
 * </div>
 */
p5.Camera.prototype.setPosition = function(x, y, z) {
  const diffX = x - this.eyeX;
  const diffY = y - this.eyeY;
  const diffZ = z - this.eyeZ;

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
  const _cam = new p5.Camera(this._renderer);
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
  let z0 = this.eyeX - this.centerX;
  let z1 = this.eyeY - this.centerY;
  let z2 = this.eyeZ - this.centerZ;

  // normalize camera local Z vector
  const eyeDist = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  if (eyeDist !== 0) {
    z0 /= eyeDist;
    z1 /= eyeDist;
    z2 /= eyeDist;
  }

  // calculate camera Y vector
  let y0 = this.upX;
  let y1 = this.upY;
  let y2 = this.upZ;

  // compute camera local X vector as up vector (local Y) cross local Z
  let x0 = y1 * z2 - y2 * z1;
  let x1 = -y0 * z2 + y2 * z0;
  let x2 = y0 * z1 - y1 * z0;

  // recompute y = z cross x
  y0 = z1 * x2 - z2 * x1;
  y1 = -z0 * x2 + z2 * x0;
  y2 = z0 * x1 - z1 * x0;

  // cross product gives area of parallelogram, which is < 1.0 for
  // non-perpendicular unit-length vectors; so normalize x, y here:
  const xmag = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (xmag !== 0) {
    x0 /= xmag;
    x1 /= xmag;
    x2 /= xmag;
  }

  const ymag = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
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
  const diffX = this.eyeX - this.centerX;
  const diffY = this.eyeY - this.centerY;
  const diffZ = this.eyeZ - this.centerZ;

  // get spherical coorinates for current camera position about origin
  let camRadius = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
  // from https://github.com/mrdoob/three.js/blob/dev/src/math/Spherical.js#L72-L73
  let camTheta = Math.atan2(diffX, diffZ); // equatorial angle
  let camPhi = Math.acos(Math.max(-1, Math.min(1, diffY / camRadius))); // polar angle

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
  const _x = Math.sin(camPhi) * camRadius * Math.sin(camTheta);
  const _y = Math.cos(camPhi) * camRadius;
  const _z = Math.sin(camPhi) * camRadius * Math.cos(camTheta);

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
 * Sets the current (active) camera of a 3D sketch.
 * Allows for switching between multiple cameras.
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
 *
 *   describe(
 *     'Canvas switches between two camera views, each showing a series of spinning 3D boxes.'
 *   );
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
 *
 *   describe(`Canvas switches between two camera views, each
 *     showing a series of spinning 3D boxes.`);
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
