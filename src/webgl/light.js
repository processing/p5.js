/**
 * @module Lights, Camera
 * @submodule Lights
 * @for p5
 * @requires core
 */

'use strict';

import p5 from '../core/main';

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
 *   sphere(40);
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
p5.prototype.ambientLight = function(v1, v2, v3, a) {
  this._assert3d('ambientLight');
  p5._validateParameters('ambientLight', arguments);
  const color = this.color.apply(this, arguments);

  this._renderer.ambientLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );

  this._renderer._enableLighting = true;

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
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   //move your mouse to change light direction
 *   let dirX = (mouseX / width - 0.5) * 2;
 *   let dirY = (mouseY / height - 0.5) * 2;
 *   directionalLight(250, 250, 250, -dirX, -dirY, -1);
 *   noStroke();
 *   sphere(40);
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
p5.prototype.directionalLight = function(v1, v2, v3, x, y, z) {
  this._assert3d('directionalLight');
  p5._validateParameters('directionalLight', arguments);

  //@TODO: check parameters number
  let color;
  if (v1 instanceof p5.Color) {
    color = v1;
  } else {
    color = this.color(v1, v2, v3);
  }

  let _x, _y, _z;
  const v = arguments[arguments.length - 1];
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
  const l = Math.sqrt(_x * _x + _y * _y + _z * _z);
  this._renderer.directionalLightDirections.push(_x / l, _y / l, _z / l);

  this._renderer.directionalLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );

  this._renderer._enableLighting = true;

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
 *   let locX = mouseX - width / 2;
 *   let locY = mouseY - height / 2;
 *   // to set the light position,
 *   // think of the world's coordinate as:
 *   // -width/2,-height/2 -------- width/2,-height/2
 *   //                |            |
 *   //                |     0,0    |
 *   //                |            |
 *   // -width/2,height/2--------width/2,height/2
 *   pointLight(250, 250, 250, locX, locY, 50);
 *   noStroke();
 *   sphere(40);
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
p5.prototype.pointLight = function(v1, v2, v3, x, y, z) {
  this._assert3d('pointLight');
  p5._validateParameters('pointLight', arguments);

  //@TODO: check parameters number
  let color;
  if (v1 instanceof p5.Color) {
    color = v1;
  } else {
    color = this.color(v1, v2, v3);
  }

  let _x, _y, _z;
  const v = arguments[arguments.length - 1];
  if (typeof v === 'number') {
    _x = arguments[arguments.length - 3];
    _y = arguments[arguments.length - 2];
    _z = arguments[arguments.length - 1];
  } else {
    _x = v.x;
    _y = v.y;
    _z = v.z;
  }

  this._renderer.pointLightPositions.push(_x, _y, _z);
  this._renderer.pointLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );

  this._renderer._enableLighting = true;

  return this;
};

/**
 * Sets the default ambient and directional light. The defaults are <a href="#/p5/ambientLight">ambientLight(128, 128, 128)</a> and <a href="#/p5/directionalLight">directionalLight(128, 128, 128, 0, 0, -1)</a>. Lights need to be included in the <a href="#/p5/draw">draw()</a> to remain persistent in a looping program. Placing them in the <a href="#/p5/setup">setup()</a> of a looping program will cause them to only have an effect the first time through the loop.
 * @method lights
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   lights();
 *   rotateX(millis() / 1000);
 *   rotateY(millis() / 1000);
 *   rotateZ(millis() / 1000);
 *   box();
 * }
 * </code>
 * </div>
 *
 * @alt
 * the light is partially ambient and partially directional
 */
p5.prototype.lights = function() {
  this._assert3d('lights');
  this.ambientLight(128, 128, 128);
  this.directionalLight(128, 128, 128, 0, 0, -1);
  return this;
};

/**
 * Sets the falloff rates for point lights. It affects only the elements which are created after it in the code.
 * The default value is lightFalloff(1.0, 0.0, 0.0), and the parameters are used to calculate the falloff with the following equation:
 *
 * d = distance from light position to vertex position
 *
 * falloff = 1 / (CONSTANT + d \* LINEAR + ( d \* d ) \* QUADRATIC)
 *
 * @method lightFalloff
 * @param {Number} constant   constant value for determining falloff
 * @param {Number} linear     linear value for determining falloff
 * @param {Number} quadratic  quadratic value for determining falloff
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 * }
 * function draw() {
 *   background(0);
 *   let locX = mouseX - width / 2;
 *   let locY = mouseY - height / 2;
 *   translate(-25, 0, 0);
 *   lightFalloff(1, 0, 0);
 *   pointLight(250, 250, 250, locX, locY, 50);
 *   sphere(20);
 *   translate(50, 0, 0);
 *   lightFalloff(0.9, 0.01, 0);
 *   pointLight(250, 250, 250, locX, locY, 50);
 *   sphere(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Two spheres with different falloff values show different intensity of light
 *
 */
p5.prototype.lightFalloff = function(
  constantAttenuation,
  linearAttenuation,
  quadraticAttenuation
) {
  this._assert3d('lightFalloff');
  p5._validateParameters('lightFalloff', arguments);

  if (constantAttenuation < 0) {
    constantAttenuation = 0;
    console.warn(
      'Value of constant argument in lightFalloff() should be never be negative. Set to 0.'
    );
  }

  if (linearAttenuation < 0) {
    linearAttenuation = 0;
    console.warn(
      'Value of linear argument in lightFalloff() should be never be negative. Set to 0.'
    );
  }

  if (quadraticAttenuation < 0) {
    quadraticAttenuation = 0;
    console.warn(
      'Value of quadratic argument in lightFalloff() should be never be negative. Set to 0.'
    );
  }

  if (
    constantAttenuation === 0 &&
    (linearAttenuation === 0 && quadraticAttenuation === 0)
  ) {
    constantAttenuation = 1;
    console.warn(
      'Either one of the three arguments in lightFalloff() should be greater than zero. Set constant argument to 1.'
    );
  }

  this._renderer.constantAttenuation = constantAttenuation;
  this._renderer.linearAttenuation = linearAttenuation;
  this._renderer.quadraticAttenuation = quadraticAttenuation;

  return this;
};

export default p5;
