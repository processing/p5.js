/**
 * @module Lights, Camera
 * @submodule Lights
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Sets the default ambient light, directional light, falloff, and
 * specular values. The defaults are ambientLight(128, 128, 128) and
 * directionalLight(128, 128, 128, 0, 0, -1), lightFalloff(1, 0, 0),
 * and lightSpecular(0, 0, 0). Lights need to be included in the draw()
 * to remain persistent in a looping program. Placing them in the setup()
 * of a looping program will cause them to only have an effect the
 * first time through the loop.
 * @method lights
 * @chainable
 */
p5.RendererGL.prototype.lights = function() {
  this._enableLighting = true;
  var grey = [0.5, 0.5, 0.5];
  this._specularLight = [0, 0, 0];
  this.ambientLightColors = grey;
  this.directionalLightDirections = [0, 0, -1];
  this.directionalLightColors = grey;
  this.directionalLightSpecularColors = this._specularLight;
  this.lightFalloff(1, 0, 0);
};

/**
 * Disable all lighting. Lighting is turned off by default and enabled
 * with the lights() function. This function can be used to disable
 * lighting so that 2D geometry (which does not require lighting) can
 * be drawn after a set of lighted 3D geometry.
 *
 * @method noLights
 * @chainable
 */
p5.RendererGL.prototype.noLights = function() {
  this._enableLighting = false;
};

/**
 * Sets the specular color for lights. Like fill(), it affects
 * only the elements which are created after it in the code.
 * Specular refers to light which bounces off a surface in a
 * preferred direction (rather than bouncing in all directions
 * like a diffuse light) and is used for creating highlights.
 * The specular quality of a light interacts with the specular
 * material qualities set through the specularMaterial() and shininess() functions.
 *
 * @method lightSpecular
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range
 * @chainable
 */
/**
 * @method lightSpecular
 * @param  {Number|String} value   a color string or a grey value
 * @chainable
 */
/**
 * @method lightSpecular
 * @param  {Number[]}      values  an array containing the red,green & blue
 *                                 components of the color
 * @chainable
 */
/**
 * @method lightSpecular
 * @param  {p5.Color}      color   the specular light color
 * @chainable
 */
p5.RendererGL.prototype.lightSpecular = function() {
  var color = p5.prototype.color.apply(this._pInst, arguments);
  this._specularLight = color._array.slice(0, 3);
};

/**
 * Sets the falloff rates for point lights, spot lights, and ambient
 * lights. Like fill(), it affects only the elements which are created
 * after it in the code. The default value is lightFalloff(1.0, 0.0, 0.0),
 * and the parameters are used to calculate the falloff with the
 * following equation:
 *
 * d = distance from light position to vertex position <br/>
 * falloff = 1 / (CONSTANT + d * LINEAR + (d*d) * QUADRATIC)
 *
 * Thinking about an ambient light with a falloff can be tricky.
 * If you want a region of your scene to be lit ambiently with one
 * color and another region to be lit ambiently with another color,
 * you could use an ambient light with location and falloff.
 * You can think of it as a point light that doesn't care which direction
 * a surface is facing.
 *
 * @method lightFalloff
 * @param {Number} [constant]  constant value or determining falloff
 * @param {Number} [linear]    linear value for determining falloff
 * @param {Number} [quadratic] quadratic value for determining falloff
 * @chainable
 */
p5.RendererGL.prototype.lightFalloff = function(constant, linear, quadratic) {
  this._constantFalloff = constant || 1;
  this._linearFalloff = linear || 0;
  this._quadraticFalloff = quadratic || 0;
};

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
 * @param  {String|Number}        value   a color string or grey value
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
 */
p5.RendererGL.prototype.directionalLight = function(v1, v2, v3, x, y, z) {
  //@TODO: check parameters number
  var color = p5.prototype.color.apply(this._pInst, [v1, v2, v3]);

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
  Array.prototype.push.apply(
    this.directionalLightSpecularColors,
    this._specularLight
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
p5.RendererGL.prototype.pointLight = function(v1, v2, v3, x, y, z) {
  //@TODO: check parameters number
  var color = p5.prototype.color.apply(this._pInst, [v1, v2, v3]);

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
  Array.prototype.push.apply(
    this.pointLightSpecularColors,
    this._specularLight
  );
  this._enableLighting = true;
};

module.exports = p5;
