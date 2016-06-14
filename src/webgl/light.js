/**
 * @module Lights, Camera
 * @submodule Lights
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Creates an ambient light with a color
 * @method  ambientLight
 * @param  {Number|Array|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] optional: green or saturation value
 * @param  {Number}            [v3] optional: blue or brightness value
 * @param  {Number}            [a]  optional: opacity
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *   background(0);
 *   ambientLight(150);
 *   ambientMaterial(250);
 *   sphere(200);
 * }
 * </code>
 * </div>
 */
p5.prototype.ambientLight = function(v1, v2, v3, a){
  var gl = this._renderer.GL;
  var shaderProgram = this._renderer._getShader(
    'lightVert', 'lightTextureFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uAmbientColor = gl.getUniformLocation(
    shaderProgram,
    'uAmbientColor[' + this._renderer.ambientLightCount + ']');

  var color = this._renderer._pInst.color.apply(
    this._renderer._pInst, arguments);
  var colors = color._array;

  gl.uniform3f( shaderProgram.uAmbientColor,
    colors[0], colors[1], colors[2]);

  //in case there's no material color for the geometry
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );
  gl.uniform4f( shaderProgram.uMaterialColor, 1, 1, 1, 1);

  this._renderer.ambientLightCount ++;
  shaderProgram.uAmbientLightCount =
    gl.getUniformLocation(shaderProgram, 'uAmbientLightCount');
  gl.uniform1i(shaderProgram.uAmbientLightCount,
    this._renderer.ambientLightCount);

  return this;
};

/**
 * Creates a directional light with a color and a direction
 * @method  directionalLight
 * @param  {Number|Array|String|p5.Color} v1   gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}          [v2] optional: green or saturation value
 * @param  {Number}          [v3] optional: blue or brightness value
 * @param  {Number}          [a]  optional: opacity
 * @param  {Number|p5.Vector} x   x axis direction or a p5.Vector
 * @param  {Number}          [y]  optional: y axis direction
 * @param  {Number}          [z]  optional: z axis direction
 * @return {p5}              the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *   background(0);
 *   //move your mouse to change light direction
 *   var dirX = (mouseX / width - 0.5) *2;
 *   var dirY = (mouseY / height - 0.5) *(-2);
 *   directionalLight(250, 250, 250, dirX, dirY, 0.25);
 *   ambientMaterial(250);
 *   sphere(200);
 * }
 * </code>
 * </div>
 */
p5.prototype.directionalLight = function(v1, v2, v3, a, x, y, z) {
  // TODO(jgessner): Find an example using this and profile it.
  // var args = new Array(arguments.length);
  // for (var i = 0; i < args.length; ++i) {
  //   args[i] = arguments[i];
  // }
  // this._validateParameters(
  //   'directionalLight',
  //   args,
  //   [
  //     //rgbaxyz
  //     ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
  //     //rgbxyz
  //     ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
  //     //caxyz
  //     ['Number', 'Number', 'Number', 'Number', 'Number'],
  //     //cxyz
  //     ['Number', 'Number', 'Number', 'Number'],
  //     ['String', 'Number', 'Number', 'Number'],
  //     ['Array', 'Number', 'Number', 'Number'],
  //     ['Object', 'Number', 'Number', 'Number'],
  //     //rgbavector
  //     ['Number', 'Number', 'Number', 'Number', 'Object'],
  //     //rgbvector
  //     ['Number', 'Number', 'Number', 'Object'],
  //     //cavector
  //     ['Number', 'Number', 'Object'],
  //     //cvector
  //     ['Number', 'Object'],
  //     ['String', 'Object'],
  //     ['Array', 'Object'],
  //     ['Object', 'Object']
  //   ]
  // );

  var gl = this._renderer.GL;
  var shaderProgram = this._renderer._getShader(
    'lightVert', 'lightTextureFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uDirectionalColor = gl.getUniformLocation(
    shaderProgram,
    'uDirectionalColor[' + this._renderer.directionalLightCount + ']');

  //@TODO: check parameters number
  var color = this._renderer._pInst.color.apply(
    this._renderer._pInst, [v1, v2, v3]);
  var colors = color._array;

  gl.uniform3f( shaderProgram.uDirectionalColor,
    colors[0], colors[1], colors[2]);

  var _x, _y, _z;

  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if(typeof args[args.length-1] === 'number'){
    _x = args[args.length-3];
    _y = args[args.length-2];
    _z = args[args.length-1];

  }else{
    try{
      _x = args[args.length-1].x;
      _y = args[args.length-1].y;
      _z = args[args.length-1].z;
    }
    catch(error){
      throw error;
    }
  }

  shaderProgram.uLightingDirection = gl.getUniformLocation(
    shaderProgram,
    'uLightingDirection[' + this._renderer.directionalLightCount + ']');
  gl.uniform3f( shaderProgram.uLightingDirection, _x, _y, _z);

  //in case there's no material color for the geometry
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );
  gl.uniform4f( shaderProgram.uMaterialColor, 1, 1, 1, 1);

  this._renderer.directionalLightCount ++;
  shaderProgram.uDirectionalLightCount =
    gl.getUniformLocation(shaderProgram, 'uDirectionalLightCount');
  gl.uniform1i(shaderProgram.uDirectionalLightCount,
    this._renderer.directionalLightCount);

  return this;
};

/**
 * Creates a point light with a color and a light position
 * @method  pointLight
 * @param  {Number|Array|String|p5.Color} v1   gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}          [v2] optional: green or saturation value
 * @param  {Number}          [v3] optional: blue or brightness value
 * @param  {Number}          [a]  optional: opacity
 * @param  {Number|p5.Vector} x   x axis position or a p5.Vector
 * @param  {Number}          [y]  optional: y axis position
 * @param  {Number}          [z]  optional: z axis position
 * @return {p5}              the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *   background(0);
 *   //move your mouse to change light position
 *   var locY = (mouseY / height - 0.5) *(-2);
 *   var locX = (mouseX / width - 0.5) *2;
 *   //to set the light position,
 *   //think of the world's coordinate as:
 *   // -1,1 -------- 1,1
 *   //   |            |
 *   //   |            |
 *   //   |            |
 *   // -1,-1---------1,-1
 *   pointLight(250, 250, 250, locX, locY, 0);
 *   ambientMaterial(250);
 *   sphere(200);
 * }
 * </code>
 * </div>
 */
p5.prototype.pointLight = function(v1, v2, v3, a, x, y, z) {
  // TODO(jgessner): Find an example using this and profile it.
  // var args = new Array(arguments.length);
  // for (var i = 0; i < args.length; ++i) {
  //   args[i] = arguments[i];
  // }
  // this._validateParameters(
  //   'pointLight',
  //   arguments,
  //   [
  //     //rgbaxyz
  //     ['Number', 'Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
  //     //rgbxyz
  //     ['Number', 'Number', 'Number', 'Number', 'Number', 'Number'],
  //     //caxyz
  //     ['Number', 'Number', 'Number', 'Number', 'Number'],
  //     //cxyz
  //     ['Number', 'Number', 'Number', 'Number'],
  //     ['String', 'Number', 'Number', 'Number'],
  //     ['Array', 'Number', 'Number', 'Number'],
  //     ['Object', 'Number', 'Number', 'Number'],
  //     //rgbavector
  //     ['Number', 'Number', 'Number', 'Number', 'Object'],
  //     //rgbvector
  //     ['Number', 'Number', 'Number', 'Object'],
  //     //cavector
  //     ['Number', 'Number', 'Object'],
  //     //cvector
  //     ['Number', 'Object'],
  //     ['String', 'Object'],
  //     ['Array', 'Object'],
  //     ['Object', 'Object']
  //   ]
  // );

  var gl = this._renderer.GL;
  var shaderProgram = this._renderer._getShader(
    'lightVert', 'lightTextureFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uPointLightColor = gl.getUniformLocation(
    shaderProgram,
    'uPointLightColor[' + this._renderer.pointLightCount + ']');

  //@TODO: check parameters number
  var color = this._renderer._pInst.color.apply(
    this._renderer._pInst, [v1, v2, v3]);
  var colors = color._array;

  gl.uniform3f( shaderProgram.uPointLightColor,
    colors[0], colors[1], colors[2]);

  var _x, _y, _z;

  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if(typeof args[args.length-1] === 'number'){
    _x = args[args.length-3];
    _y = args[args.length-2];
    _z = args[args.length-1];

  }else{
    try{
      _x = args[args.length-1].x;
      _y = args[args.length-1].y;
      _z = args[args.length-1].z;
    }
    catch(error){
      throw error;
    }
  }

  shaderProgram.uPointLightLocation = gl.getUniformLocation(
    shaderProgram,
    'uPointLightLocation[' + this._renderer.pointLightCount + ']');
  gl.uniform3f( shaderProgram.uPointLightLocation, _x, _y, _z);

  //in case there's no material color for the geometry
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );
  gl.uniform4f( shaderProgram.uMaterialColor, 1, 1, 1, 1);

  this._renderer.pointLightCount ++;
  shaderProgram.uPointLightCount =
    gl.getUniformLocation(shaderProgram, 'uPointLightCount');
  gl.uniform1i(shaderProgram.uPointLightCount,
    this._renderer.pointLightCount);

  return this;
};

module.exports = p5;
