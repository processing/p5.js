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
 *
 * @method ambientLight
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range
 * @param  {Number}        [alpha]
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   ambientLight(150);
 *   ambientMaterial(250);
 *   sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * nothing displayed
 *
 */

/**
 * @method ambientLight
 * @param  {String}        value   a color string
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {Number[]}      values  an array containing the red,green,blue &
 *                                 and alpha components of the color
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {p5.Color}      color   the ambient light color
 * @chainable
 */
p5.prototype.ambientLight = function(v1, v2, v3, a) {
  var color = this.color.apply(this, arguments);

  var shader = this._renderer._useLightShader();

  //@todo this is a bit icky. array uniforms have
  //to be multiples of the type 3(rgb) in this case.
  //a preallocated Float32Array(24) that we copy into
  //would be better
  shader.setUniform('uUseLighting', true);
  //in case there's no material color for the geometry
  shader.setUniform('uMaterialColor', this._renderer.curFillColor);

  this._renderer.ambientLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );
  shader.setUniform('uDirectionalColor', this._renderer.ambientLightColors);

  shader.setUniform(
    'uDirectionalLightCount',
    this._renderer.ambientLightColors.length / 3
  );

  return this;
};

/**
 * Creates a directional light with a color and a direction
 * @method directionalLight
 * @param  {Number}    v1       red or hue value (depending on the current
 * color mode),
 * @param  {Number}    v2       green or saturation value
 * @param  {Number}    v3       blue or brightness value
 * @param  {p5.Vector} position the direction of the light
 * @chainable
 */

/**
 * @method directionalLight
 * @param  {Number[]|String|p5.Color} color   color Array, CSS color string,
 *                                             or p5.Color value
 * @param  {Number}                   x       x axis direction
 * @param  {Number}                   y       y axis direction
 * @param  {Number}                   z       z axis direction
 * @chainable
 */

/**
 * @method directionalLight
 * @param  {Number[]|String|p5.Color} color
 * @param  {p5.Vector}                position
 * @chainable
 */

/**
 * @method directionalLight
 * @param  {Number}    v1
 * @param  {Number}    v2
 * @param  {Number}    v3
 * @param  {Number}    x
 * @param  {Number}    y
 * @param  {Number}    z
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   //move your mouse to change light direction
 *   var dirX = (mouseX / width - 0.5) * 2;
 *   var dirY = (mouseY / height - 0.5) * -2;
 *   directionalLight(250, 250, 250, dirX, dirY, 0.25);
 *   ambientMaterial(250);
 *   sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * light source on canvas changeable with mouse position
 *
 */
p5.prototype.directionalLight = function(v1, v2, v3, x, y, z) {
  var shader = this._renderer._useLightShader();

  //@TODO: check parameters number
  var color = this.color.apply(this, [v1, v2, v3]);

  var _x, _y, _z;

  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if (typeof args[args.length - 1] === 'number') {
    _x = args[args.length - 3];
    _y = args[args.length - 2];
    _z = args[args.length - 1];
  } else {
    _x = args[args.length - 1].x;
    _y = args[args.length - 1].y;
    _z = args[args.length - 1].z;
  }
  shader.setUniform('uUseLighting', true);
  //in case there's no material color for the geometry
  shader.setUniform('uMaterialColor', this._renderer.curFillColor);

  this._renderer.directionalLightDirections.push(_x, _y, _z);
  shader.setUniform(
    'uLightingDirection',
    this._renderer.directionalLightDirections
  );

  this._renderer.directionalLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );
  shader.setUniform('uDirectionalColor', this._renderer.directionalLightColors);

  shader.setUniform(
    'uDirectionalLightCount',
    this._renderer.directionalLightColors.length / 3
  );

  return this;
};

/**
 * Creates a point light with a color and a light position
 * @method pointLight
 * @param  {Number}    v1       red or hue value (depending on the current
 * color mode),
 * @param  {Number}    v2       green or saturation value
 * @param  {Number}    v3       blue or brightness value
 * @param  {Number}    x        x axis position
 * @param  {Number}    y        y axis position
 * @param  {Number}    z        z axis position
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   //move your mouse to change light position
 *   var locY = (mouseY / height - 0.5) * -2;
 *   var locX = (mouseX / width - 0.5) * 2;
 *   //to set the light position,
 *   //think of the world's coordinate as:
 *   // -1,1 -------- 1,1
 *   //   |            |
 *   //   |            |
 *   //   |            |
 *   // -1,-1---------1,-1
 *   pointLight(250, 250, 250, locX, locY, 0);
 *   ambientMaterial(250);
 *   sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * spot light on canvas changes position with mouse
 *
 */

/**
 * @method pointLight
 * @param  {Number}    v1
 * @param  {Number}    v2
 * @param  {Number}    v3
 * @param  {p5.Vector} position the position of the light
 * @chainable
 */

/**
 * @method pointLight
 * @param  {Number[]|String|p5.Color} color   color Array, CSS color string,
 * or p5.Color value
 * @param  {Number}                   x
 * @param  {Number}                   y
 * @param  {Number}                   z
 * @chainable
 */

/**
 * @method pointLight
 * @param  {Number[]|String|p5.Color} color
 * @param  {p5.Vector}                position
 * @chainable
 */
p5.prototype.pointLight = function(v1, v2, v3, x, y, z) {
  //@TODO: check parameters number
  var color = this._renderer._pInst.color.apply(this._renderer._pInst, [
    v1,
    v2,
    v3
  ]);

  var _x, _y, _z;

  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if (typeof args[args.length - 1] === 'number') {
    _x = args[args.length - 3];
    _y = args[args.length - 2];
    _z = args[args.length - 1];
  } else {
    _x = args[args.length - 1].x;
    _y = args[args.length - 1].y;
    _z = args[args.length - 1].z;
  }

  var shader = this._renderer._useLightShader();
  shader.setUniform('uUseLighting', true);
  //in case there's no material color for the geometry
  shader.setUniform('uMaterialColor', this._renderer.curFillColor);

  this._renderer.pointLightPositions.push(_x, _y, _z);
  shader.setUniform('uPointLightLocation', this._renderer.pointLightPositions);

  this._renderer.pointLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );
  shader.setUniform('uPointLightColor', this._renderer.pointLightColors);

  shader.setUniform(
    'uPointLightCount',
    this._renderer.pointLightColors.length / 3
  );

  return this;
};

module.exports = p5;
