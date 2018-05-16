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
 * @param  {Number}        [alpha] the alpha value
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
 *   noStroke();
 *   sphere(25);
 * }
 * </code>
 * </div>
 *
 * @alt
 * evenly distributed light across a sphere
 *
 */

/**
 * @method ambientLight
 * @param  {String}        value   a color string
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {Number}        gray   a gray value
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
p5.prototype.ambientLight = function() {
  this._assert3d('ambientLight');
  p5._validateParameters('ambientLight', arguments);
  p5.RendererGL.prototype.ambientLight.apply(this._renderer, arguments);
  return this;
};

p5.RendererGL.prototype.ambientLight = function(v1, v2, v3, a) {
  var color = p5.prototype.color.apply(this._pInst, arguments);
  this.ambientLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );
  this._enableLighting = true;
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
 *   var dirY = (mouseY / height - 0.5) * 2;
 *   directionalLight(250, 250, 250, -dirX, -dirY, 0.25);
 *   ambientMaterial(250);
 *   noStroke();
 *   sphere(25);
 * }
 * </code>
 * </div>
 *
 * @alt
 * light source on canvas changeable with mouse position
 *
 */

/**
 * @method directionalLight
 * @param  {Number[]|String|p5.Color} color   color Array, CSS color string,
 *                                             or <a href="#/p5.Color">p5.Color</a> value
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
 */
p5.prototype.directionalLight = function() {
  this._assert3d('directionalLight');
  p5._validateParameters('directionalLight', arguments);
  p5.RendererGL.prototype.directionalLight.apply(this._renderer, arguments);
  return this;
};

p5.RendererGL.prototype.directionalLight = function(v1, v2, v3, x, y, z) {
  //@TODO: check parameters number
  var color;
  if (v1 instanceof p5.Color) {
    color = v1;
  } else {
    color = this._pInst.color(v1, v2, v3);
  }

  var _x, _y, _z;
  var v = arguments[arguments.length - 1];
  if (typeof v === 'number') {
    _x = arguments[arguments.length - 3];
    _y = arguments[arguments.length - 2];
    _z = arguments[arguments.length - 1];
  } else {
    _x = v.x;
    _y = v.y;
    _z = v.z;
  }

  // normalize direction
  var l = Math.sqrt(_x * _x + _y * _y + _z * _z);
  this.directionalLightDirections.push(_x / l, _y / l, _z / l);
  this.directionalLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );
  this._enableLighting = true;
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
 *   var locX = mouseX - width / 2;
 *   var locY = mouseY - height / 2;
 *   // to set the light position,
 *   // think of the world's coordinate as:
 *   // -width/2,-height/2 -------- width/2,-height/2
 *   //                |            |
 *   //                |     0,0    |
 *   //                |            |
 *   // -width/2,height/2--------width/2,height/2
 *   pointLight(250, 250, 250, locX, locY, 50);
 *   ambientMaterial(250);
 *   noStroke();
 *   sphere(25);
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
 * or <a href="#/p5.Color">p5.Color</a> value
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
p5.prototype.pointLight = function() {
  this._assert3d('pointLight');
  p5._validateParameters('pointLight', arguments);
  p5.RendererGL.prototype.pointLight.apply(this._renderer, arguments);
  return this;
};

p5.RendererGL.prototype.pointLight = function(v1, v2, v3, x, y, z) {
  //@TODO: check parameters number
  var color;
  if (v1 instanceof p5.Color) {
    color = v1;
  } else {
    color = this._pInst.color(v1, v2, v3);
  }

  var _x, _y, _z;
  var v = arguments[arguments.length - 1];
  if (typeof v === 'number') {
    _x = arguments[arguments.length - 3];
    _y = arguments[arguments.length - 2];
    _z = arguments[arguments.length - 1];
  } else {
    _x = v.x;
    _y = v.y;
    _z = v.z;
  }

  this.pointLightPositions.push(_x, _y, _z);
  this.pointLightColors.push(color._array[0], color._array[1], color._array[2]);

  this._enableLighting = true;
};

module.exports = p5;
