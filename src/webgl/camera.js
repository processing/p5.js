/**
 * @module Lights, Camera
 * @submodule Camera
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Sets camera position for a 3D sketch. The function behaves similarly
 * gluLookAt, except that it replaces the existing modelview matrix instead
 * of applying any transformations calculated here on top of the existing
 * model view.
 * When called with no arguments, this function
 * sets a default camera equivalent to calling
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
 * @return {p5}                the p5 object
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
 * Sets perspective camera. When called with no arguments, the defaults
 * provided are equivalent to
 * perspective(PI/3.0, width/height, cameraZ/10.0, cameraZ*10.0)
 * where cameraZ is ((height/2.0) / tan(PI*60.0/360.0));
 * @method  perspective
 * @param  {Number} [fovy]   camera frustum vertical field of view,
 *                           from bottom to top of view, in degrees
 * @param  {Number} [aspect] camera frustum aspect ratio
 * @param  {Number} [near]   frustum near plane length
 * @param  {Number} [far]    frustum far plane length
 * @return {p5}              the p5 object
 * @example
 * <div>
 * <code>
 * //drag mouse to toggle the world!
 * //you will see there's a vanish point
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   var fov = 60 / 180 * PI;
 *   var cameraZ = height / 2.0 / tan(fov / 2.0);
 *   perspective(60 / 180 * PI, width / height, cameraZ * 0.1, cameraZ * 10);
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   for (var i = -1; i < 2; i++) {
 *     for (var j = -2; j < 3; j++) {
 *       push();
 *       translate(i * 160, 0, j * 160);
 *       box(40, 40, 40);
 *       pop();
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * colored 3d boxes toggleable with mouse position
 *
 */
p5.prototype.perspective = function() {
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

  this.cameraFOV = fovy;
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
 * Setup ortho camera
 * @method  ortho
 * @param  {Number} left   camera frustum left plane
 * @param  {Number} right  camera frustum right plane
 * @param  {Number} bottom camera frustum bottom plane
 * @param  {Number} top    camera frustum top plane
 * @param  {Number} near   camera frustum near plane
 * @param  {Number} far    camera frustum far plane
 * @return {p5}            the p5 object
 * @example
 * <div>
 * <code>
 * //drag mouse to toggle the world!
 * //there's no vanish point
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
 * }
 * function draw() {
 *   background(200);
 *   orbitControl();
 *   strokeWeight(0.1);
 *   for (var i = -1; i < 2; i++) {
 *     for (var j = -2; j < 3; j++) {
 *       push();
 *       translate(i * 160, 0, j * 160);
 *       box(40, 40, 40);
 *       pop();
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * 3 3d boxes, reveal several more boxes on 3d plane when mouse used to toggle
 *
 */

p5.prototype.ortho = function(){
  this._renderer.ortho.apply(this._renderer, arguments);
  return this;
};

p5.RendererGL.prototype.ortho = function(l, r, b, t, n, f) {
  // ortho() ... top/left = 0/0
  if(l === undefined) l = 0;
  if(r === undefined) r = +this.width;
  if(b === undefined) b = -this.height;
  if(t === undefined) t = 0;
  if(n === undefined) n = -Number.MAX_VALUE;
  if(f === undefined) f = +Number.MAX_VALUE;
  
  var lr = r - l;
  var tb = t - b;
  var fn = f - n;
  
  var x = +2.0 / lr;
  var y = +2.0 / tb;
  var z = -2.0 / fn;
  
  var tx = -(r + l) / lr;
  var ty = -(t + b) / tb;
  var tz = -(f + n) / fn;
  
  this.uPMatrix = p5.Matrix.identity();
  this.uPMatrix.set(  x,  0,  0, 0,
                      0, -y,  0, 0,
                      0,  0,  z, 0,
                     tx, ty, tz, 1);
  
  this._curCamera = 'custom';
};




module.exports = p5;
