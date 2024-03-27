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
 * camera(0, 0, 800, 0, 0, 0, 0, 1, 0)
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
 *   perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   describe('a square moving closer and then away from the camera.');
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
 *   perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
 * }
 * </code>
 * </div>
 * @alt
 * White square repeatedly grows to fill canvas and then shrinks.
 * An interactive example of a red cube with 3 sliders for moving it across x, y,
 * z axis and 3 sliders for shifting its center.
 */
p5.prototype.camera = function (...args) {
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
 * If no parameters are given, the default values are used as:
 *
 * - `fov` : The default field of view for the camera is such that the full height of renderer is visible when it is positioned at a default distance of 800 units from the camera.
 * - `aspect` : The default aspect ratio is the ratio of renderer's width to renderer's height.
 * - `near` : The default value for the near clipping plane is 80, which is 0.1 times the default distance from the camera to its subject.
 * - `far` : The default value for the far clipping plane is 8000, which is 10 times the default distance from the camera to its subject.
 *
 * If you prefer a fixed field of view, follow these steps:
 * 1. Choose your desired field of view angle (`fovy`). This is how wide the camera can see.
 * 2. To ensure that you can see the entire width across horizontally and height across vertically, place the camera a distance of `(height / 2) / tan(fovy / 2)` back from its subject.
 * 3. Call perspective with the chosen field of view, canvas aspect ratio, and near/far values:
 *    `perspective(fovy, width / height, cameraDistance / 10, cameraDistance * 10);`
 *
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
 *   camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
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
 * two colored 3D boxes move back and forth, rotating as mouse is dragged.
 */
p5.prototype.perspective = function (...args) {
  this._assert3d('perspective');
  p5._validateParameters('perspective', args);
  this._renderer._curCamera.perspective(...args);
  return this;
};


/**
 *
 * Enable or disable perspective for lines in the WebGL renderer.
 * The behavior of `linePerspective()`  is associated with the type of camera projection being used.
 *
 * - When using `perspective()`, which simulates realistic perspective, linePerspective
 *    is set to `true` by default. This means that lines will be affected by the current
 *    camera's perspective, resulting in a more natural appearance.
 * - When using `ortho()` or `frustum()`, which do not simulate realistic perspective,
 *    linePerspective is set to `false` by default. In this case, lines will have a uniform
 *    scale regardless of the camera's perspective, providing a more predictable and
 *    consistent appearance.
 * - You can override the default behavior by explicitly calling `linePerspective()` after
 *    using `perspective()`, `ortho()`, or `frustum()`. This allows you to customize the line
 *    perspective based on your specific requirements.
 *
 * @method linePerspective
 * @for p5
 * @param {boolean} enable - Set to `true` to enable line perspective, `false` to disable.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   setAttributes({ antialias: true });
 *   strokeWeight(3);
 *   describe(
 *     'rotated 3D boxes have their stroke weights affected if toggled back and forth with mouse clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(220);
 *   rotateY(PI/24);
 *   rotateZ(PI/8);
 *   translate(0, 0, 350);
 *   for (let i = 0; i < 12; i++) {
 *     translate(0, 0, -70);
 *     box(30);
 *   }
 * }
 *
 * function mousePressed() {
 *   linePerspective(!linePerspective());
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   strokeWeight(4);
 * }
 *
 * function draw() {
 *   background(220);
 *
 *   // Using orthographic projection
 *   ortho();
 *
 *   // Enable line perspective explicitly
 *   linePerspective(true);
 *
 *   // Draw a rotating cube
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(25);
 *
 *   // Move to a new position
 *   translate(0, -60, 0);
 *
 *   // Using perspective projection
 *   perspective();
 *
 *   // Disable line perspective explicitly
 *   linePerspective(false);
 *
 *   // Draw another rotating cube with perspective
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(25);
 * }
 * </code>
 * </div>
 * @alt
 * Demonstrates the dynamic control of line perspective in a 3D environment with rotating boxes.
 */
/**
 * @method linePerspective
 * @return {boolean} The boolean value representing the current state of linePerspective().
 */

p5.prototype.linePerspective = function (enable) {
  p5._validateParameters('linePerspective', arguments);
  if (!(this._renderer instanceof p5.RendererGL)) {
    throw new Error('linePerspective() must be called in WebGL mode.');
  }
  if (enable !== undefined) {
    // Set the line perspective if enable is provided
    this._renderer._curCamera.useLinePerspective = enable;
  } else {
    // If no argument is provided, return the current value
    return this._renderer._curCamera.useLinePerspective;
  }
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
 * ortho(-width/2, width/2, -height/2, height/2, 0, max(width, height) + 800).
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
 *   ortho();
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
 * }
 * </code>
 * </div>
 *
 * @alt
 * two 3D boxes move back and forth along same plane, rotating as mouse is dragged.
 */
p5.prototype.ortho = function (...args) {
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
 * frustum(-width/20, width/20, height/20, -height/20, eyeZ/10, eyeZ*10),
 * where eyeZ is equal to 800.
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
 *   camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
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
 * }
 * </code>
 * </div>
 *
 * @alt
 * two 3D boxes move back and forth along same plane, rotating as mouse is dragged.
 */
p5.prototype.frustum = function (...args) {
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
 *   camera.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   camera.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   describe('An example that creates a camera and moves it around the box.');
 * }
 *
 * function draw() {
 *   background(0);
 *   // The camera will automatically
 *   // rotate to look at [0, 0, 0].
 *   camera.lookAt(0, 0, 0);
 *
 *   // The camera will move on the
 *   // x axis.
 *   camera.setPosition(sin(frameCount / 60) * 200, 0, 100);
 *   box(20);
 *
 *   // A 'ground' box to give the viewer
 *   // a better idea of where the camera
 *   // is looking.
 *   translate(0, 50, 0);
 *   rotateX(HALF_PI);
 *   box(150, 150, 20);
 * }
 * </code></div>
 *
 * @alt
 * An example that creates a camera and moves it around the box.
 */
p5.prototype.createCamera = function () {
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
 * The camera object properties
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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera view pans left and right across a series of rotating 3D boxes.
 */
p5.Camera = class Camera {
  constructor(renderer) {
    this._renderer = renderer;

    this.cameraType = 'default';
    this.useLinePerspective = true;
    this.cameraMatrix = new p5.Matrix();
    this.projMatrix = new p5.Matrix();
    this.yScale = 1;
  }
  /**
 * camera position value on x axis. default value is 0
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
 * }
 * </code></div>
 *
 * @alt
 * An example showing the use of camera object properties
 *
 */

  /**
 * camera position value on y axis. default value is 0
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
 * }
 * </code></div>
 *
 * @alt
 * An example showing the use of camera object properties
 *
 */

  /**
 * camera position value on z axis. default value is 800
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
 * }
 * </code></div>
 *
 * @alt
 * An example showing the use of camera object properties
 *
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
 * }
 * </code></div>
 *
 * @alt
 * An example showing the use of camera object properties
 *
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
 * }
 * </code></div>
 *
 * @alt
 * An example showing the use of camera object properties
 *
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
 * }
 * </code></div>
 *
 * @alt
 * An example showing the use of camera object properties
 *
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
 *   describe('An example showing the use of camera object properties');
 * }
 * </code></div>
 *
 * @alt
 * An example showing the use of camera object properties
 *
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
 *
 * @alt
 * An example showing the use of camera object properties
 *
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
 *
 * @alt
 * An example showing the use of camera object properties
 *
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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
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
 * @alt
 * two colored 3D boxes move back and forth, rotating as mouse is dragged.
 */
  perspective(fovy, aspect, near, far) {
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
                        0,          -f * this.yScale,       0,  0,
                        0,           0,     (far + near) * nf, -1,
                        0,           0, (2 * far * near) * nf,  0);
    /* eslint-enable indent */

    if (this._isActive()) {
      this._renderer.uPMatrix.set(this.projMatrix);
    }
  }

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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
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
 * }
 * </code>
 * </div>
 * @alt
 * two 3D boxes move back and forth along same plane, rotating as mouse is dragged.
 */
  ortho(left, right, bottom, top, near, far) {
    if (left === undefined) left = -this._renderer.width / 2;
    if (right === undefined) right = +this._renderer.width / 2;
    if (bottom === undefined) bottom = -this._renderer.height / 2;
    if (top === undefined) top = +this._renderer.height / 2;
    if (near === undefined) near = 0;
    if (far === undefined)
      far = Math.max(this._renderer.width, this._renderer.height)+800;

    this.cameraNear = near;
    this.cameraFar = far;

    const w = right - left;
    const h = top - bottom;
    const d = far - near;

    const x = +2.0 / w;
    const y = +2.0 / h * this.yScale;
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
      this._renderer.uPMatrix.set(this.projMatrix);
    }

    this.cameraType = 'custom';
  }

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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
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
 * }
 * </code>
 * </div>
 * @alt
 * two 3D boxes move back and forth along same plane, rotating as mouse is dragged.
 */
  frustum(left, right, bottom, top, near, far) {
    if (left === undefined) left = -this._renderer.width * 0.05;
    if (right === undefined) right = +this._renderer.width * 0.05;
    if (bottom === undefined) bottom = +this._renderer.height * 0.05;
    if (top === undefined) top = -this._renderer.height * 0.05;
    if (near === undefined) near = this.defaultCameraNear;
    if (far === undefined) far = this.defaultCameraFar;

    this.cameraNear = near;
    this.cameraFar = far;

    const w = right - left;
    const h = top - bottom;
    const d = far - near;

    const x = +(2.0 * near) / w;
    const y = +(2.0 * near) / h * this.yScale;
    const z = -(2.0 * far * near) / d;

    const tx = (right + left) / w;
    const ty = (top + bottom) / h;
    const tz = -(far + near) / d;

    this.projMatrix = p5.Matrix.identity();

    /* eslint-disable indent */
    this.projMatrix.set(  x,  0,  0,  0,
                          0,  -y,  0,  0,
                        tx, ty, tz, -1,
                          0,  0,  z,  0);
    /* eslint-enable indent */

    if (this._isActive()) {
      this._renderer.uPMatrix.set(this.projMatrix);
    }

    this.cameraType = 'custom';
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Camera Orientation Methods
  ////////////////////////////////////////////////////////////////////////////////

  /**
 * Rotate camera view about arbitrary axis defined by x,y,z
 * based on http://learnwebgl.brown37.net/07_cameras/camera_rotating_motion.html
 * @method _rotateView
 * @private
 */
  _rotateView(a, x, y, z) {
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
  }

  /**
 * Rolling rotates the camera view in forward direction.
 * @method roll
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
 *   cam.roll(-0.8);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // pan camera according to angle 'delta'
 *   cam.roll(delta);
 *
 *   // every 160 frames, switch direction
 *   if (frameCount % 160 === 0) {
 *     delta *= -1;
 *   }
 *
 *   rotateX(frameCount * 0.01);
 *   translate(0, 0, -100);
 *   box(20);
 *   translate(0, 0, 35);
 *   box(20);
 *   translate(0, 0, 35);
 *   box(20);
 *   translate(0, 0, 35);
 *   box(20);
 *   translate(0, 0, 35);
 *   box(20);
 *   translate(0, 0, 35);
 *   box(20);
 *   translate(0, 0, 35);
 *   box(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * camera view pans in forward direction across a series boxes.
 */
  roll(amount) {
    const local = this._getLocalAxes();
    this._rotateView(amount, local.z[0], local.z[1], local.z[2]);
  }

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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
 */
  pan(amount) {
    const local = this._getLocalAxes();
    this._rotateView(amount, local.y[0], local.y[1], local.y[2]);
  }

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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
  tilt(amount) {
    const local = this._getLocalAxes();
    this._rotateView(amount, local.x[0], local.x[1], local.x[2]);
  }

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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
  lookAt(x, y, z) {
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
  }

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
 * }
 * </code>
 * </div>
 * @alt
 * White square repeatedly grows to fill canvas and then shrinks.
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
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
 * }
 * </code>
 * </div>
 * @alt
 * An interactive example of a red cube with 3 sliders for moving it across x, y,
 * z axis and 3 sliders for shifting its center.
 */
  camera(
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
      this._renderer.uMVMatrix.set(this.cameraMatrix);
    }
    return this;
  }

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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
  move(x, y, z) {
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
      this.upX,
      this.upY,
      this.upZ
    );
  }

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
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
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
  setPosition(x, y, z) {
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
      this.upX,
      this.upY,
      this.upZ
    );
  }

  /**
 * Copies information about the argument camera's view and projection to
 * the target camera. If the target camera is active, it will be reflected
 * on the screen.
 *
 * @method set
 * @param {p5.Camera} cam source camera
 *
 * @example
 * <div>
 * <code>
 * let cam, initialCam;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   strokeWeight(3);
 *
 *   // Set the initial state to initialCamera and set it to the camera
 *   // used for drawing. Then set cam to be the active camera.
 *   cam = createCamera();
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   initialCam = createCamera();
 *   initialCam.camera(100, 100, 100, 0, 0, 0, 0, 0, -1);
 *   initialCam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   cam.set(initialCam);
 *
 *   setCamera(cam);
 * }
 *
 * function draw() {
 *   orbitControl();
 *   background(255);
 *   box(50);
 *   translate(0, 0, -25);
 *   plane(100);
 * }
 *
 * function doubleClicked(){
 *   // Double-click to return the camera to its initial position.
 *   cam.set(initialCam);
 * }
 * </code>
 * </div>
 * @alt
 * Prepare two cameras. One is the camera that sets the initial state,
 * and the other is the camera that moves with interaction.
 * Draw a plane and a box on top of it, operate the camera using orbitControl().
 * Double-click to set the camera in the initial state and return to
 * the initial state.
 */
  set(cam) {
    const keyNamesOfThePropToCopy = [
      'eyeX', 'eyeY', 'eyeZ',
      'centerX', 'centerY', 'centerZ',
      'upX', 'upY', 'upZ',
      'cameraFOV', 'aspectRatio', 'cameraNear', 'cameraFar', 'cameraType',
      'yScale'
    ];
    for (const keyName of keyNamesOfThePropToCopy) {
      this[keyName] = cam[keyName];
    }

    this.cameraMatrix = cam.cameraMatrix.copy();
    this.projMatrix = cam.projMatrix.copy();

    // If the target camera is active, update uMVMatrix and uPMatrix.
    if (this._isActive()) {
      this._renderer.uMVMatrix.mat4 = this.cameraMatrix.mat4.slice();
      this._renderer.uPMatrix.mat4 = this.projMatrix.mat4.slice();
    }
  }

  /**
 * For the cameras cam0 and cam1 with the given arguments, their view are combined
 * with the parameter amt that represents the quantity, and the obtained view is applied.
 * For example, if cam0 is looking straight ahead and cam1 is looking straight
 * to the right and amt is 0.5, the applied camera will look to the halfway
 * between front and right.
 * If the applied camera is active, the applied result will be reflected on the screen.
 * When applying this function, all cameras involved must have exactly the same projection
 * settings. For example, if one is perspective, ortho, frustum, the other two must also be
 * perspective, ortho, frustum respectively. However, if all cameras have ortho settings,
 * interpolation is possible if the ratios of left, right, top and bottom are equal to each other.
 * For example, when it is changed by orbitControl().
 *
 * @method slerp
 * @param {p5.Camera} cam0 first p5.Camera
 * @param {p5.Camera} cam1 second p5.Camera
 * @param {Number} amt amount to use for interpolation during slerp
 *
 * @example
 * <div>
 * <code>
 * let cam0, cam1, cam;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   strokeWeight(3);
 *
 *   // camera for slerp.
 *   cam = createCamera();
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   // cam0 is looking at the cube from the front.
 *   cam0 = createCamera();
 *   cam0.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam0.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   // cam1 is pointing straight to the right in the cube
 *   // at the same position as cam0 by doing a pan(-PI/2).
 *   cam1 = createCamera();
 *   cam1.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam1.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   cam1.pan(-PI/2);
 *
 *   // we only use cam.
 *   setCamera(cam);
 * }
 *
 * function draw() {
 *   // calculate amount.
 *   const amt = 0.5 - 0.5 * cos(frameCount * TAU / 120);
 *   // slerp cam0 and cam1 with amt, set to cam.
 *   // When amt moves from 0 to 1, cam moves from cam0 to cam1,
 *   // shaking the camera to the right.
 *   cam.slerp(cam0, cam1, amt);
 *
 *   background(255);
 *   // Every time the camera turns right, the cube drifts left.
 *   box(40);
 * }
 * </code>
 * </div>
 * @alt
 * Prepare two cameras. One camera is facing straight ahead to the cube and the other
 * camera is in the same position and looking straight to the right.
 * If you use a camera which interpolates these with slerp(), the facing direction
 * of the camera will change smoothly between the front and the right.
 *
 * @example
 * <div>
 * <code>
 * let cam, lastCam, initialCam;
 * let countForReset = 30;
 * // This sample uses orbitControl() to move the camera.
 * // Double-clicking the canvas restores the camera to its initial state.
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   strokeWeight(3);
 *
 *   // main camera
 *   cam = createCamera();
 *   cam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   // Camera for recording loc info before reset
 *   lastCam = createCamera();
 *   lastCam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   lastCam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   // Camera for recording the initial state
 *   initialCam = createCamera();
 *   initialCam.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   initialCam.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *
 *   setCamera(cam); // set main camera
 * }
 *
 * function draw() {
 *   if (countForReset < 30) {
 *     // if the reset count is less than 30,
 *     // it will move closer to the original camera as it increases.
 *     countForReset++;
 *     cam.slerp(lastCam, initialCam, countForReset / 30);
 *   } else {
 *     // if the count is 30,
 *     // you can freely move the main camera with orbitControl().
 *     orbitControl();
 *   }
 *
 *   background(255);
 *   box(40);
 * }
 * // A double-click sets countForReset to 0 and initiates a reset.
 * function doubleClicked() {
 *   if (countForReset === 30) {
 *     countForReset = 0;
 *     lastCam.set(cam);
 *   }
 * }
 * </code>
 * </div>
 * @alt
 * There is a camera, drawing a cube. The camera can be moved freely with
 * orbitControl(). Double-click to smoothly return the camera to its initial state.
 * The camera cannot be moved during that time.
 */
  slerp(cam0, cam1, amt) {
    // If t is 0 or 1, do not interpolate and set the argument camera.
    if (amt === 0) {
      this.set(cam0);
      return;
    } else if (amt === 1) {
      this.set(cam1);
      return;
    }

    // For this cameras is ortho, assume that cam0 and cam1 are also ortho
    // and interpolate the elements of the projection matrix.
    // Use logarithmic interpolation for interpolation.
    if (this.projMatrix.mat4[15] !== 0) {
      this.projMatrix.mat4[0] =
        cam0.projMatrix.mat4[0] *
        Math.pow(cam1.projMatrix.mat4[0] / cam0.projMatrix.mat4[0], amt);
      this.projMatrix.mat4[5] =
        cam0.projMatrix.mat4[5] *
        Math.pow(cam1.projMatrix.mat4[5] / cam0.projMatrix.mat4[5], amt);
      // If the camera is active, make uPMatrix reflect changes in projMatrix.
      if (this._isActive()) {
        this._renderer.uPMatrix.mat4 = this.projMatrix.mat4.slice();
      }
    }

    // prepare eye vector and center vector of argument cameras.
    const eye0 = new p5.Vector(cam0.eyeX, cam0.eyeY, cam0.eyeZ);
    const eye1 = new p5.Vector(cam1.eyeX, cam1.eyeY, cam1.eyeZ);
    const center0 = new p5.Vector(cam0.centerX, cam0.centerY, cam0.centerZ);
    const center1 = new p5.Vector(cam1.centerX, cam1.centerY, cam1.centerZ);

    // Calculate the distance between eye and center for each camera.
    // Logarithmically interpolate these with amt.
    const dist0 = p5.Vector.dist(eye0, center0);
    const dist1 = p5.Vector.dist(eye1, center1);
    const lerpedDist = dist0 * Math.pow(dist1 / dist0, amt);

    // Next, calculate the ratio to interpolate the eye and center by a constant
    // ratio for each camera. This ratio is the same for both. Also, with this ratio
    // of points, the distance is the minimum distance of the two points of
    // the same ratio.
    // With this method, if the viewpoint is fixed, linear interpolation is performed
    // at the viewpoint, and if the center is fixed, linear interpolation is performed
    // at the center, resulting in reasonable interpolation. If both move, the point
    // halfway between them is taken.
    const eyeDiff = p5.Vector.sub(eye0, eye1);
    const diffDiff = eye0.copy().sub(eye1).sub(center0).add(center1);
    // Suppose there are two line segments. Consider the distance between the points
    // above them as if they were taken in the same ratio. This calculation figures out
    // a ratio that minimizes this.
    // Each line segment is, a line segment connecting the viewpoint and the center
    // for each camera.
    const divider = diffDiff.magSq();
    let ratio = 1; // default.
    if (divider > 0.000001){
      ratio = p5.Vector.dot(eyeDiff, diffDiff) / divider;
      ratio = Math.max(0, Math.min(ratio, 1));
    }

    // Take the appropriate proportions and work out the points
    // that are between the new viewpoint and the new center position.
    const lerpedMedium = p5.Vector.lerp(
      p5.Vector.lerp(eye0, center0, ratio),
      p5.Vector.lerp(eye1, center1, ratio),
      amt
    );

    // Prepare each of rotation matrix from their camera matrix
    const rotMat0 = cam0.cameraMatrix.createSubMatrix3x3();
    const rotMat1 = cam1.cameraMatrix.createSubMatrix3x3();

    // get front and up vector from local-coordinate-system.
    const front0 = rotMat0.row(2);
    const front1 = rotMat1.row(2);
    const up0 = rotMat0.row(1);
    const up1 = rotMat1.row(1);

    // prepare new vectors.
    const newFront = new p5.Vector();
    const newUp = new p5.Vector();
    const newEye = new p5.Vector();
    const newCenter = new p5.Vector();

    // Create the inverse matrix of mat0 by transposing mat0,
    // and multiply it to mat1 from the right.
    // This matrix represents the difference between the two.
    // 'deltaRot' means 'difference of rotation matrices'.
    const deltaRot = rotMat1.mult3x3(rotMat0.copy().transpose3x3());

    // Calculate the trace and from it the cos value of the angle.
    // An orthogonal matrix is just an orthonormal basis. If this is not the identity
    // matrix, it is a centered orthonormal basis plus some angle of rotation about
    // some axis. That's the angle. Letting this be theta, trace becomes 1+2cos(theta).
    // reference: https://en.wikipedia.org/wiki/Rotation_matrix#Determining_the_angle
    const diag = deltaRot.diagonal();
    let cosTheta = 0.5 * (diag[0] + diag[1] + diag[2] - 1);

    // If the angle is close to 0, the two matrices are very close,
    // so in that case we execute linearly interpolate.
    if (1 - cosTheta < 0.0000001) {
      // Obtain the front vector and up vector by linear interpolation
      // and normalize them.
      // calculate newEye, newCenter with newFront vector.
      newFront.set(p5.Vector.lerp(front0, front1, amt)).normalize();

      newEye.set(newFront).mult(ratio * lerpedDist).add(lerpedMedium);
      newCenter.set(newFront).mult((ratio-1) * lerpedDist).add(lerpedMedium);

      newUp.set(p5.Vector.lerp(up0, up1, amt)).normalize();

      // set the camera
      this.camera(
        newEye.x, newEye.y, newEye.z,
        newCenter.x, newCenter.y, newCenter.z,
        newUp.x, newUp.y, newUp.z
      );
      return;
    }

    // Calculates the axis vector and the angle of the difference orthogonal matrix.
    // The axis vector is what I explained earlier in the comments.
    // similar calculation is here:
    // https://github.com/mrdoob/three.js/blob/883249620049d1632e8791732808fefd1a98c871/src/math/Quaternion.js#L294
    let a, b, c, sinTheta;
    let invOneMinusCosTheta = 1 / (1 - cosTheta);
    const maxDiag = Math.max(diag[0], diag[1], diag[2]);
    const offDiagSum13 = deltaRot.mat3[1] + deltaRot.mat3[3];
    const offDiagSum26 = deltaRot.mat3[2] + deltaRot.mat3[6];
    const offDiagSum57 = deltaRot.mat3[5] + deltaRot.mat3[7];

    if (maxDiag === diag[0]) {
      a = Math.sqrt((diag[0] - cosTheta) * invOneMinusCosTheta); // not zero.
      invOneMinusCosTheta /= a;
      b = 0.5 * offDiagSum13 * invOneMinusCosTheta;
      c = 0.5 * offDiagSum26 * invOneMinusCosTheta;
      sinTheta = 0.5 * (deltaRot.mat3[7] - deltaRot.mat3[5]) / a;

    } else if (maxDiag === diag[1]) {
      b = Math.sqrt((diag[1] - cosTheta) * invOneMinusCosTheta); // not zero.
      invOneMinusCosTheta /= b;
      c = 0.5 * offDiagSum57 * invOneMinusCosTheta;
      a = 0.5 * offDiagSum13 * invOneMinusCosTheta;
      sinTheta = 0.5 * (deltaRot.mat3[2] - deltaRot.mat3[6]) / b;

    } else {
      c = Math.sqrt((diag[2] - cosTheta) * invOneMinusCosTheta); // not zero.
      invOneMinusCosTheta /= c;
      a = 0.5 * offDiagSum26 * invOneMinusCosTheta;
      b = 0.5 * offDiagSum57 * invOneMinusCosTheta;
      sinTheta = 0.5 * (deltaRot.mat3[3] - deltaRot.mat3[1]) / c;
    }

    // Constructs a new matrix after interpolating the angles.
    // Multiplying mat0 by the first matrix yields mat1, but by creating a state
    // in the middle of that matrix, you can obtain a matrix that is
    // an intermediate state between mat0 and mat1.
    const angle = amt * Math.atan2(sinTheta, cosTheta);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const oneMinusCosAngle = 1 - cosAngle;
    const ab = a * b;
    const bc = b * c;
    const ca = c * a;
    const lerpedRotMat = new p5.Matrix('mat3', [
      cosAngle + oneMinusCosAngle * a * a,
      oneMinusCosAngle * ab + sinAngle * c,
      oneMinusCosAngle * ca - sinAngle * b,
      oneMinusCosAngle * ab - sinAngle * c,
      cosAngle + oneMinusCosAngle * b * b,
      oneMinusCosAngle * bc + sinAngle * a,
      oneMinusCosAngle * ca + sinAngle * b,
      oneMinusCosAngle * bc - sinAngle * a,
      cosAngle + oneMinusCosAngle * c * c
    ]);

    // Multiply this to mat0 from left to get the interpolated front vector.
    // calculate newEye, newCenter with newFront vector.
    lerpedRotMat.multiplyVec3(front0, newFront);

    newEye.set(newFront).mult(ratio * lerpedDist).add(lerpedMedium);
    newCenter.set(newFront).mult((ratio-1) * lerpedDist).add(lerpedMedium);

    lerpedRotMat.multiplyVec3(up0, newUp);

    // We also get the up vector in the same way and set the camera.
    // The eye position and center position are calculated based on the front vector.
    this.camera(
      newEye.x, newEye.y, newEye.z,
      newCenter.x, newCenter.y, newCenter.z,
      newUp.x, newUp.y, newUp.z
    );
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Camera Helper Methods
  ////////////////////////////////////////////////////////////////////////////////

  // @TODO: combine this function with _setDefaultCamera to compute these values
  // as-needed
  _computeCameraDefaultSettings() {
    this.defaultAspectRatio = this._renderer.width / this._renderer.height;
    this.defaultEyeX = 0;
    this.defaultEyeY = 0;
    this.defaultEyeZ = 800;
    this.defaultCameraFOV =
      2 * Math.atan(this._renderer.height / 2 / this.defaultEyeZ);
    this.defaultCenterX = 0;
    this.defaultCenterY = 0;
    this.defaultCenterZ = 0;
    this.defaultCameraNear = this.defaultEyeZ * 0.1;
    this.defaultCameraFar = this.defaultEyeZ * 10;
  }

  //detect if user didn't set the camera
  //then call this function below
  _setDefaultCamera() {
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
  }

  _resize() {
    // If we're using the default camera, update the aspect ratio
    if (this.cameraType === 'default') {
      this._computeCameraDefaultSettings();
      this.cameraFOV = this.defaultCameraFOV;
      this.aspectRatio = this.defaultAspectRatio;
      this.perspective();
    }
  }

  /**
 * Returns a copy of a camera.
 * @method copy
 * @private
 */
  copy() {
    const _cam = new p5.Camera(this._renderer);
    _cam.cameraFOV = this.cameraFOV;
    _cam.aspectRatio = this.aspectRatio;
    _cam.eyeX = this.eyeX;
    _cam.eyeY = this.eyeY;
    _cam.eyeZ = this.eyeZ;
    _cam.centerX = this.centerX;
    _cam.centerY = this.centerY;
    _cam.centerZ = this.centerZ;
    _cam.upX = this.upX;
    _cam.upY = this.upY;
    _cam.upZ = this.upZ;
    _cam.cameraNear = this.cameraNear;
    _cam.cameraFar = this.cameraFar;

    _cam.cameraType = this.cameraType;

    _cam.cameraMatrix = this.cameraMatrix.copy();
    _cam.projMatrix = this.projMatrix.copy();
    _cam.yScale = this.yScale;

    return _cam;
  }

  /**
 * Returns a camera's local axes: left-right, up-down, and forward-backward,
 * as defined by vectors in world-space.
 * @method _getLocalAxes
 * @private
 */
  _getLocalAxes() {
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
  }

  /**
 * Orbits the camera about center point. For use with orbitControl().
 * @method _orbit
 * @private
 * @param {Number} dTheta change in spherical coordinate theta
 * @param {Number} dPhi change in spherical coordinate phi
 * @param {Number} dRadius change in radius
 */
  _orbit(dTheta, dPhi, dRadius) {
    // Calculate the vector and its magnitude from the center to the viewpoint
    const diffX = this.eyeX - this.centerX;
    const diffY = this.eyeY - this.centerY;
    const diffZ = this.eyeZ - this.centerZ;
    let camRadius = Math.hypot(diffX, diffY, diffZ);
    // front vector. unit vector from center to eye.
    const front = new p5.Vector(diffX, diffY, diffZ).normalize();
    // up vector. normalized camera's up vector.
    const up = new p5.Vector(this.upX, this.upY, this.upZ).normalize(); // y-axis
    // side vector. Right when viewed from the front
    const side = p5.Vector.cross(up, front).normalize(); // x-axis
    // vertical vector. normalized vector of projection of front vector.
    const vertical = p5.Vector.cross(side, up); // z-axis

    // update camRadius
    camRadius *= Math.pow(10, dRadius);
    // prevent zooming through the center:
    if (camRadius < this.cameraNear) {
      camRadius = this.cameraNear;
    }
    if (camRadius > this.cameraFar) {
      camRadius = this.cameraFar;
    }

    // calculate updated camera angle
    // Find the angle between the "up" and the "front", add dPhi to that.
    // angleBetween() may return negative value. Since this specification is subject to change
    // due to version updates, it cannot be adopted, so here we calculate using a method
    // that directly obtains the absolute value.
    const camPhi =
      Math.acos(Math.max(-1, Math.min(1, p5.Vector.dot(front, up)))) + dPhi;
    // Rotate by dTheta in the shortest direction from "vertical" to "side"
    const camTheta = dTheta;

    // Invert camera's upX, upY, upZ if dPhi is below 0 or above PI
    if (camPhi <= 0 || camPhi >= Math.PI) {
      this.upX *= -1;
      this.upY *= -1;
      this.upZ *= -1;
    }

    // update eye vector by calculate new front vector
    up.mult(Math.cos(camPhi));
    vertical.mult(Math.cos(camTheta) * Math.sin(camPhi));
    side.mult(Math.sin(camTheta) * Math.sin(camPhi));

    front.set(up).add(vertical).add(side);

    this.eyeX = camRadius * front.x + this.centerX;
    this.eyeY = camRadius * front.y + this.centerY;
    this.eyeZ = camRadius * front.z + this.centerZ;

    // update camera
    this.camera(
      this.eyeX, this.eyeY, this.eyeZ,
      this.centerX, this.centerY, this.centerZ,
      this.upX, this.upY, this.upZ
    );
  }

  /**
 * Orbits the camera about center point. For use with orbitControl().
 * Unlike _orbit(), the direction of rotation always matches the direction of pointer movement.
 * @method _orbitFree
 * @private
 * @param {Number} dx the x component of the rotation vector.
 * @param {Number} dy the y component of the rotation vector.
 * @param {Number} dRadius change in radius
 */
  _orbitFree(dx, dy, dRadius) {
    // Calculate the vector and its magnitude from the center to the viewpoint
    const diffX = this.eyeX - this.centerX;
    const diffY = this.eyeY - this.centerY;
    const diffZ = this.eyeZ - this.centerZ;
    let camRadius = Math.hypot(diffX, diffY, diffZ);
    // front vector. unit vector from center to eye.
    const front = new p5.Vector(diffX, diffY, diffZ).normalize();
    // up vector. camera's up vector.
    const up = new p5.Vector(this.upX, this.upY, this.upZ);
    // side vector. Right when viewed from the front. (like x-axis)
    const side = p5.Vector.cross(up, front).normalize();
    // down vector. Bottom when viewed from the front. (like y-axis)
    const down = p5.Vector.cross(front, side);

    // side vector and down vector are no longer used as-is.
    // Create a vector representing the direction of rotation
    // in the form cos(direction)*side + sin(direction)*down.
    // Make the current side vector into this.
    const directionAngle = Math.atan2(dy, dx);
    down.mult(Math.sin(directionAngle));
    side.mult(Math.cos(directionAngle)).add(down);
    // The amount of rotation is the size of the vector (dx, dy).
    const rotAngle = Math.sqrt(dx*dx + dy*dy);
    // The vector that is orthogonal to both the front vector and
    // the rotation direction vector is the rotation axis vector.
    const axis = p5.Vector.cross(front, side);

    // update camRadius
    camRadius *= Math.pow(10, dRadius);
    // prevent zooming through the center:
    if (camRadius < this.cameraNear) {
      camRadius = this.cameraNear;
    }
    if (camRadius > this.cameraFar) {
      camRadius = this.cameraFar;
    }

    // If the axis vector is likened to the z-axis, the front vector is
    // the x-axis and the side vector is the y-axis. Rotate the up and front
    // vectors respectively by thinking of them as rotations around the z-axis.

    // Calculate the components by taking the dot product and
    // calculate a rotation based on that.
    const c = Math.cos(rotAngle);
    const s = Math.sin(rotAngle);
    const dotFront = up.dot(front);
    const dotSide = up.dot(side);
    const ux = dotFront * c + dotSide * s;
    const uy = -dotFront * s + dotSide * c;
    const uz = up.dot(axis);
    up.x = ux * front.x + uy * side.x + uz * axis.x;
    up.y = ux * front.y + uy * side.y + uz * axis.y;
    up.z = ux * front.z + uy * side.z + uz * axis.z;
    // We won't be using the side vector and the front vector anymore,
    // so let's make the front vector into the vector from the center to the new eye.
    side.mult(-s);
    front.mult(c).add(side).mult(camRadius);

    // it's complete. let's update camera.
    this.camera(
      front.x + this.centerX,
      front.y + this.centerY,
      front.z + this.centerZ,
      this.centerX, this.centerY, this.centerZ,
      up.x, up.y, up.z
    );
  }

  /**
 * Returns true if camera is currently attached to renderer.
 * @method _isActive
 * @private
 */
  _isActive() {
    return this === this._renderer._curCamera;
  }
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
 *   cam1.camera(0, 0, 50*sqrt(3), 0, 0, 0, 0, 1, 0);
 *   cam1.perspective(PI/3, 1, 5*sqrt(3), 500*sqrt(3));
 *   cam2 = createCamera();
 *   cam2.setPosition(30, 0, 50);
 *   cam2.lookAt(0, 0, 0);
 *   cam2.ortho(-50, 50, -50, 50, 0, 200);
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
 *   // camera 1:
 *   cam1.lookAt(0, 0, 0);
 *   cam1.setPosition(sin(frameCount / 60) * 200, 0, 100);
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
p5.prototype.setCamera = function (cam) {
  this._renderer._curCamera = cam;

  // set the projection matrix (which is not normally updated each frame)
  this._renderer.uPMatrix.set(cam.projMatrix);
};

export default p5.Camera;
