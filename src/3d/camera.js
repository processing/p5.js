/**
 * module Lights, Camera
 * submodule Camera
 * for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * sets camera position
 * method camera
 * @param  {Number} x  camera postion value on x axis
 * @param  {Number} y  camera postion value on y axis
 * @param  {Number} z  camera postion value on z axis
 * @return {p5}
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 * function draw(){
 *  camera(0, 0, 800);
 *  sphere(100);
 * }
 * </code>
 * </div>
 */
p5.prototype.camera = function(x, y, z){
  this._validateParameters(
    'camera',
    arguments,
    ['Number', 'Number', 'Number']
  );
  //what it manipulates is the model view matrix
  this._graphics.translate(-x, -y, -z);
};

/**
 * sets perspective camera
 * method  perspective
 * @param  {Number} fovy   camera frustum vertical field of view,
 *                         from bottom to top of view, in degrees
 * @param  {Number} aspect camera frustum aspect ratio
 * @param  {Number} near   frustum near plane length
 * @param  {Number} far    frustum far plane length
 * @return {p5}
 * @example
 * <div>
 * <code>
 * //drag mouse to toggle the world
 * //you will see there's a vanish point
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 *   perspective(60 / 180 * PI, width/height, 0.1, 100);
 * }
 * function draw(){
 *  background(0);
 *  orbitControl();
 *  for(var i = -5; i < 6; i++){
 *     for(var j = -5; j < 6; j++){
 *       push();
 *       translate(i*100, 0, j*100);
 *       sphere(20);
 *       pop();
 *     }
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.perspective = function(fovy,aspect,near,far) {
  this._validateParameters(
    'perspective',
    arguments,
    ['Number', 'Number', 'Number', 'Number']
  );
  this._graphics.uPMatrix = p5.Matrix.identity();
  this._graphics.uPMatrix.perspective(fovy,aspect,near,far);
  this._graphics._setCamera = true;
};

/**
 * setup ortho camera
 * method  ortho
 * @param  {Number} left   camera frustum left plane
 * @param  {Number} right  camera frustum right plane
 * @param  {Number} bottom camera frustum bottom plane
 * @param  {Number} top    camera frustum top plane
 * @param  {Number} near   camera frustum near plane
 * @param  {Number} far    camera frustum far plane
 * @return {p5}
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 *   ortho(-width/2, width/2, height/2, -height/2, 0.1, 100);
 * }
 * function draw(){
 *  background(0);
 *  orbitControl();
 *  for(var i = -5; i < 6; i++){
 *     for(var j = -5; j < 6; j++){
 *       push();
 *       translate(i*100, 0, j*100);
 *       sphere(20);
 *       pop();
 *     }
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.ortho = function(left,right,bottom,top,near,far) {
  this._validateParameters(
    'ortho',
    arguments,
      ['Number', 'Number', 'Number', 'Number', 'Number', 'Number']
  );
  left /= this.width;
  right /= this.width;
  top /= this.height;
  bottom /= this.height;
  this._graphics.uPMatrix = p5.Matrix.identity();
  this._graphics.uPMatrix.ortho(left,right,bottom,top,near,far);
  this._graphics._setCamera = true;
};

module.exports = p5;