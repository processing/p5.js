/**
 * @module Lights, Camera
 * @submodule Camera
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Sets the camera position for a 3D sketch. Parameters for this function define
 * the position for the camera, the center of the sketch (where the camera is
 * pointing), and an up direction (the orientation of the camera).
 *
 * When called with no arguments, this function creates a default camera
 * equivalent to
 * camera(0, 0, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);
 * @method camera
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
 *   //move the camera away from the plane by a sin wave
 *   camera(0, 0, sin(frameCount * 0.01) * 100, 0, 0, 0, 0, 1, 0);
 *   plane(120, 120);
 * }
 * </code>
 * </div>
 *
 * @alt
 * blue square shrinks in size grows to fill canvas. disappears then loops.
 *
 */
p5.prototype.camera = function() {
  this._assert3d('camera');
  p5._validateParameters('camera', arguments);
  this._renderer.camera.apply(this._renderer, arguments);
  return this;
};

p5.RendererGL.prototype.camera = function(
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
    eyeX = this.defaultCameraX;
    eyeY = this.defaultCameraY;
    eyeZ = this.defaultCameraZ;
    centerX = eyeX;
    centerY = eyeY;
    centerZ = 0;
    upX = 0;
    upY = 1;
    upZ = 0;
  }

  this.cameraX = eyeX;
  this.cameraY = eyeY;
  this.cameraZ = eyeZ;

  // calculate camera Z vector
  var z0 = eyeX - centerX;
  var z1 = eyeY - centerY;
  var z2 = eyeZ - centerZ;

  this.eyeDist = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  if (this.eyeDist !== 0) {
    z0 /= this.eyeDist;
    z1 /= this.eyeDist;
    z2 /= this.eyeDist;
  }

  // calculate camera Y vector
  var y0 = upX;
  var y1 = upY;
  var y2 = upZ;

  // computer x vector as y cross z
  var x0 = y1 * z2 - y2 * z1;
  var x1 = -y0 * z2 + y2 * z0;
  var x2 = y0 * z1 - y1 * z0;

  // recomputer y = z cross x
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

  // the camera affects the model view matrix, insofar as it
  // inverse translates the world to the eye position of the camera
  // and rotates it.
  // prettier-ignore
  this.cameraMatrix.set(x0, y0, z0, 0,
                        x1, y1, z1, 0,
                        x2, y2, z2, 0,
                        0,   0,  0, 1);

  var tx = -eyeX;
  var ty = -eyeY;
  var tz = -eyeZ;

  this.cameraMatrix.translate([tx, ty, tz]);
  this.uMVMatrix.set(
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
 * perspective(PI/3.0, width/height, cameraZ/10.0, cameraZ*10.0), where cameraZ
 * is equal to ((height/2.0) / tan(PI*60.0/360.0));
 * @method  perspective
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
  this._renderer.perspective.apply(this._renderer, arguments);
  return this;
};

p5.RendererGL.prototype.perspective = function(fovy, aspect, near, far) {
  if (typeof fovy === 'undefined') {
    fovy = this.defaultCameraFOV;
  }
  if (typeof aspect === 'undefined') {
    aspect = this.defaultCameraAspect;
  }
  if (typeof near === 'undefined') {
    near = this.defaultCameraNear;
  }
  if (typeof far === 'undefined') {
    far = this.defaultCameraFar;
  }

  this.cameraFOV = this._pInst._toRadians(fovy);
  this.cameraAspect = aspect;
  this.cameraNear = near;
  this.cameraFar = far;

  this.uPMatrix = p5.Matrix.identity();

  var f = 1.0 / Math.tan(this.cameraFOV / 2);
  var nf = 1.0 / (this.cameraNear - this.cameraFar);

  // prettier-ignore
  this.uPMatrix.set(f / aspect,  0,                     0,  0,
                    0,          -f,                     0,  0,
                    0,           0,     (far + near) * nf, -1,
                    0,           0, (2 * far * near) * nf,  0);

  this._curCamera = 'custom';
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
  this._renderer.ortho.apply(this._renderer, arguments);
  return this;
};

p5.RendererGL.prototype.ortho = function(left, right, bottom, top, near, far) {
  if (left === undefined) left = -this.width / 2;
  if (right === undefined) right = +this.width / 2;
  if (bottom === undefined) bottom = -this.height / 2;
  if (top === undefined) top = +this.height / 2;
  if (near === undefined) near = 0;
  if (far === undefined) far = Math.max(this.width, this.height);

  var w = right - left;
  var h = top - bottom;
  var d = far - near;

  var x = +2.0 / w;
  var y = +2.0 / h;
  var z = -2.0 / d;

  var tx = -(right + left) / w;
  var ty = -(top + bottom) / h;
  var tz = -(far + near) / d;

  this.uPMatrix = p5.Matrix.identity();

  // prettier-ignore
  this.uPMatrix.set(  x,  0,  0,  0,
                      0, -y,  0,  0,
                      0,  0,  z,  0,
                     tx, ty, tz,  1);

  this._curCamera = 'custom';
};

module.exports = p5;
