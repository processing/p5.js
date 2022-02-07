/**
 * @module 3D
 * @submodule Lights
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import * as constants from '../core/constants';

/**
 * Creates an ambient light with the given color.
 *
 * Ambient light does not come from a specific direction.
 * Objects are evenly lit from all sides. Ambient lights are
 * almost always used in combination with other types of lights.
 *
 * Note: lights need to be called (whether directly or indirectly)
 * within draw() to remain persistent in a looping program.
 * Placing them in setup() will cause them to only have an effect
 * the first time through the loop.
 *
 * @method ambientLight
 * @param  {Number}        v1       red or hue value relative to
 *                                   the current color range
 * @param  {Number}        v2       green or saturation value
 *                                   relative to the current color range
 * @param  {Number}        v3       blue or brightness value
 *                                   relative to the current color range
 * @param  {Number}        [alpha]  alpha value relative to current
 *                                   color range (default is 0-255)
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   describe('sphere with coral color under black light');
 * }
 * function draw() {
 *   background(100);
 *   ambientLight(0); // black light (no light)
 *   ambientMaterial(255, 127, 80); // coral material
 *   sphere(40);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   describe('sphere with coral color under white light');
 * }
 * function draw() {
 *   background(100);
 *   ambientLight(255); // white light
 *   ambientMaterial(255, 127, 80); // coral material
 *   sphere(40);
 * }
 * </code>
 * </div>
 */

/**
 * @method ambientLight
 * @param  {Number}        gray    number specifying value between
 *                                  white and black
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {String}        value   a color string
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {Number[]}      values  an array containing the red,green,blue &
 *                                  and alpha components of the color
 * @chainable
 */

/**
 * @method ambientLight
 * @param  {p5.Color}      color   color as a <a href="#/p5.Color">p5.Color</a>
 * @chainable
 */
p5.prototype.ambientLight = function(v1, v2, v3, a) {
  this._assert3d('ambientLight');
  p5._validateParameters('ambientLight', arguments);
  const color = this.color(...arguments);

  this._renderer.ambientLightColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );

  this._renderer._enableLighting = true;

  return this;
};

/**
 * Sets the color of the specular highlight of a non-ambient light
 * (i.e. all lights except <a href="#/p5/ambientLight">ambientLight()</a>).
 *
 * specularColor() affects only the lights which are created after
 * it in the code.
 *
 * This function is used in combination with
 * <a href="#/p5/specularMaterial">specularMaterial()</a>.
 * If a geometry does not use specularMaterial(), this function
 * will have no effect.
 *
 * The default color is white (255, 255, 255), which is used if
 * specularColor() is not explicitly called.
 *
 * Note: specularColor is equivalent to the Processing function
 * <a href="https://processing.org/reference/lightSpecular_.html">lightSpecular</a>.
 *
 * @method specularColor
 * @param  {Number}        v1      red or hue value relative to
 *                                  the current color range
 * @param  {Number}        v2      green or saturation value
 *                                  relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                  relative to the current color range
 * @chainable
 * @example
 * <div>
 * <code>
 * let setRedSpecularColor = true;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   describe(
 *     `Sphere with specular highlight.
 *      Clicking the mouse toggles the specular highlight color between
 *      red and the default white.`
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   ambientLight(60);
 *
 *   // add a point light to showcase specular color
 *   // -- use mouse location to position the light
 *   let lightPosX = mouseX - width / 2;
 *   let lightPosY = mouseY - height / 2;
 *   // -- set the light's specular color
 *   if (setRedSpecularColor) {
 *     specularColor(255, 0, 0); // red specular highlight
 *   }
 *   // -- create the light
 *   pointLight(200, 200, 200, lightPosX, lightPosY, 50); // white light
 *
 *   // use specular material with high shininess
 *   specularMaterial(150);
 *   shininess(50);
 *
 *   sphere(30, 64, 64);
 * }
 *
 * function mouseClicked() {
 *   setRedSpecularColor = !setRedSpecularColor;
 * }
 * </code>
 * </div>
 *
 */

/**
 * @method specularColor
 * @param  {Number}        gray    number specifying value between
 *                                  white and black
 * @chainable
 */

/**
 * @method specularColor
 * @param  {String}        value   color as a CSS string
 * @chainable
 */

/**
 * @method specularColor
 * @param  {Number[]}      values  color as an array containing the
 *                                  red, green, and blue components
 * @chainable
 */

/**
 * @method specularColor
 * @param  {p5.Color}      color   color as a <a href="#/p5.Color">p5.Color</a>
 * @chainable
 */
p5.prototype.specularColor = function(v1, v2, v3) {
  this._assert3d('specularColor');
  p5._validateParameters('specularColor', arguments);
  const color = this.color(...arguments);

  this._renderer.specularColors = [
    color._array[0],
    color._array[1],
    color._array[2]
  ];

  return this;
};

/**
 * Creates a directional light with the given color and direction.
 *
 * Directional light comes from one direction.
 * The direction is specified as numbers inclusively between -1 and 1.
 * For example, setting the direction as (0, -1, 0) will cause the
 * geometry to be lit from below (since the light will be facing
 * directly upwards). Similarly, setting the direction as (1, 0, 0)
 * will cause the geometry to be lit from the left (since the light
 * will be facing directly rightwards).
 *
 * Directional lights do not have a specific point of origin, and
 * therefore cannot be positioned closer or farther away from a geometry.
 *
 * A maximum of **5** directional lights can be active at once.
 *
 * Note: lights need to be called (whether directly or indirectly)
 * within draw() to remain persistent in a looping program.
 * Placing them in setup() will cause them to only have an effect
 * the first time through the loop.
 *
 * @method directionalLight
 * @param  {Number}    v1         red or hue value relative to the current
 *                                 color range
 * @param  {Number}    v2         green or saturation value relative to the
 *                                 current color range
 * @param  {Number}    v3         blue or brightness value relative to the
 *                                 current color range
 * @param  {Number}    x          x component of direction (inclusive range of -1 to 1)
 * @param  {Number}    y          y component of direction (inclusive range of -1 to 1)
 * @param  {Number}    z          z component of direction (inclusive range of -1 to 1)
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe(
 *     `Scene with sphere and directional light. The direction of
 *      the light is controlled with the mouse position.`
 *   );
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
 */

/**
 * @method directionalLight
 * @param  {Number}    v1
 * @param  {Number}    v2
 * @param  {Number}    v3
 * @param  {p5.Vector} direction  direction of light as a
 *                                 <a href="#/p5.Vector">p5.Vector</a>
 * @chainable
 */

/**
 * @method directionalLight
 * @param  {p5.Color|Number[]|String} color  color as a <a href="#/p5.Color">p5.Color</a>,
 *                                            as an array, or as a CSS string
 * @param  {Number}                   x
 * @param  {Number}                   y
 * @param  {Number}                   z
 * @chainable
 */

/**
 * @method directionalLight
 * @param  {p5.Color|Number[]|String} color
 * @param  {p5.Vector}                direction
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

  this._renderer.directionalLightDiffuseColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );
  Array.prototype.push.apply(
    this._renderer.directionalLightSpecularColors,
    this._renderer.specularColors
  );

  this._renderer._enableLighting = true;

  return this;
};

/**
 * Creates a point light with the given color and position.
 *
 * A point light emits light from a single point in all directions.
 * Because the light is emitted from a specific point (position),
 * it has a different effect when it is positioned farther vs. nearer
 * an object.
 *
 * A maximum of **5** point lights can be active at once.
 *
 * Note: lights need to be called (whether directly or indirectly)
 * within draw() to remain persistent in a looping program.
 * Placing them in setup() will cause them to only have an effect
 * the first time through the loop.
 *
 * @method pointLight
 * @param  {Number}    v1  red or hue value relative to the current
 *                          color range
 * @param  {Number}    v2  green or saturation value relative to the
 *                          current color range
 * @param  {Number}    v3  blue or brightness value relative to the
 *                          current color range
 * @param  {Number}    x   x component of position
 * @param  {Number}    y   y component of position
 * @param  {Number}    z   z component of position
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe(
 *     `Scene with sphere and point light. The position of
 *      the light is controlled with the mouse position.`
 *   );
 * }
 * function draw() {
 *   background(0);
 *   // move your mouse to change light position
 *   let locX = mouseX - width / 2;
 *   let locY = mouseY - height / 2;
 *   // to set the light position,
 *   // think of the world's coordinate as:
 *   // -width/2,-height/2 ----------- width/2,-height/2
 *   //                   |           |
 *   //                   |    0,0    |
 *   //                   |           |
 *   //  -width/2,height/2 ----------- width/2,height/2
 *   pointLight(250, 250, 250, locX, locY, 50);
 *   noStroke();
 *   sphere(40);
 * }
 * </code>
 * </div>
 */

/**
 * @method pointLight
 * @param  {Number}     v1
 * @param  {Number}     v2
 * @param  {Number}     v3
 * @param  {p5.Vector}  position of light as a <a href="#/p5.Vector">p5.Vector</a>
 * @chainable
 */

/**
 * @method pointLight
 * @param  {p5.Color|Number[]|String} color  color as a <a href="#/p5.Color">p5.Color</a>,
 *                                            as an array, or as a CSS string
 * @param  {Number}                   x
 * @param  {Number}                   y
 * @param  {Number}                   z
 * @chainable
 */

/**
 * @method pointLight
 * @param  {p5.Color|Number[]|String} color
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
  this._renderer.pointLightDiffuseColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );
  Array.prototype.push.apply(
    this._renderer.pointLightSpecularColors,
    this._renderer.specularColors
  );

  this._renderer._enableLighting = true;

  return this;
};

/**
 * Places an ambient and directional light in the scene.
 * The lights are set to ambientLight(128, 128, 128) and
 * directionalLight(128, 128, 128, 0, 0, -1).
 *
 * Note: lights need to be called (whether directly or indirectly)
 * within draw() to remain persistent in a looping program.
 * Placing them in setup() will cause them to only have an effect
 * the first time through the loop.
 *
 * @method lights
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('The light is partially ambient and partially directional');
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
 */
p5.prototype.lights = function() {
  this._assert3d('lights');
  // only restore the colorMode to default if it is not in default already
  if (this._colorMode === constants.RGB) {
    this.ambientLight(128, 128, 128);
    this.directionalLight(128, 128, 128, 0, 0, -1);
  } else {
    const maxBright = this._colorMaxes[this._colorMode][2];
    this.ambientLight(0, 0, maxBright);
    this.directionalLight(0, 0, maxBright, 0, 0, -1);
  }
  return this;
};

/**
 * Sets the falloff rate for <a href="#/p5/pointLight">pointLight()</a>
 * and <a href="#/p5/spotLight">spotLight()</a>.
 *
 * lightFalloff() affects only the lights which are created after it
 * in the code.
 *
 * The `constant`, `linear`, an `quadratic` parameters are used to calculate falloff as follows:
 *
 * d = distance from light position to vertex position
 *
 * falloff = 1 / (CONSTANT + d \* LINEAR + (d \* d) \* QUADRATIC)
 *
 * @method lightFalloff
 * @param {Number} constant   CONSTANT value for determining falloff
 * @param {Number} linear     LINEAR value for determining falloff
 * @param {Number} quadratic  QUADRATIC value for determining falloff
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   describe(
 *     'Two spheres with different falloff values show different intensities of light'
 *   );
 * }
 * function draw() {
 *   ortho();
 *   background(0);
 *
 *   let locX = mouseX - width / 2;
 *   let locY = mouseY - height / 2;
 *   locX /= 2; // half scale
 *
 *   lightFalloff(1, 0, 0);
 *   push();
 *   translate(-25, 0, 0);
 *   pointLight(250, 250, 250, locX - 25, locY, 50);
 *   sphere(20);
 *   pop();
 *
 *   lightFalloff(0.97, 0.03, 0);
 *   push();
 *   translate(25, 0, 0);
 *   pointLight(250, 250, 250, locX + 25, locY, 50);
 *   sphere(20);
 *   pop();
 * }
 * </code>
 * </div>
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

/**
 * Creates a spot light with the given color, position,
 * light direction, angle, and concentration.
 *
 * Like a <a href="#/p5/pointLight">pointLight()</a>, a spotLight()
 * emits light from a specific point (position). It has a different effect
 * when it is positioned farther vs. nearer an object.
 *
 * However, unlike a pointLight(), the light is emitted in **one direction**
 * along a conical shape. The shape of the cone can be controlled using
 * the `angle` and `concentration` parameters.
 *
 * The `angle` parameter is used to
 * determine the radius of the cone. And the `concentration`
 * parameter is used to focus the light towards the center of
 * the cone. Both parameters are optional, however if you want
 * to specify `concentration`, you must also specify `angle`.
 * The minimum concentration value is 1.
 *
 * A maximum of **5** spot lights can be active at once.
 *
 * Note: lights need to be called (whether directly or indirectly)
 * within draw() to remain persistent in a looping program.
 * Placing them in setup() will cause them to only have an effect
 * the first time through the loop.
 *
 * @method spotLight
 * @param  {Number}    v1               red or hue value relative to the current color range
 * @param  {Number}    v2               green or saturation value relative to the current color range
 * @param  {Number}    v3               blue or brightness value relative to the current color range
 * @param  {Number}    x                x component of position
 * @param  {Number}    y                y component of position
 * @param  {Number}    z                z component of position
 * @param  {Number}    rx               x component of light direction (inclusive range of -1 to 1)
 * @param  {Number}    ry               y component of light direction (inclusive range of -1 to 1)
 * @param  {Number}    rz               z component of light direction (inclusive range of -1 to 1)
 * @param  {Number}    [angle]          angle of cone. Defaults to PI/3
 * @param  {Number}    [concentration]  concentration of cone. Defaults to 100
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe(
 *     `Scene with sphere and spot light.
 *      The position of the light is controlled with the mouse position.`
 *   );
 * }
 * function draw() {
 *   background(0);
 *   // move your mouse to change light position
 *   let locX = mouseX - width / 2;
 *   let locY = mouseY - height / 2;
 *   // to set the light position,
 *   // think of the world's coordinate as:
 *   // -width/2,-height/2 ----------- width/2,-height/2
 *   //                   |           |
 *   //                   |    0,0    |
 *   //                   |           |
 *   //  -width/2,height/2 ----------- width/2,height/2
 *   ambientLight(50);
 *   spotLight(0, 250, 0, locX, locY, 100, 0, 0, -1, Math.PI / 16);
 *   noStroke();
 *   sphere(40);
 * }
 * </code>
 * </div>
 */
/**
 * @method spotLight
 * @param  {p5.Color|Number[]|String} color           color as a <a href="#/p5.Color">p5.Color</a>,
 *                                                     as an array, or as a CSS string
 * @param  {p5.Vector}                position        position of light as a <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector}                direction       direction of light as a <a href="#/p5.Vector">p5.Vector</a>
 * @param  {Number}                   [angle]
 * @param  {Number}                   [concentration]
 */
/**
 * @method spotLight
 * @param  {Number}     v1
 * @param  {Number}     v2
 * @param  {Number}     v3
 * @param  {p5.Vector}  position
 * @param  {p5.Vector}  direction
 * @param  {Number}     [angle]
 * @param  {Number}     [concentration]
 */
/**
 * @method spotLight
 * @param  {p5.Color|Number[]|String} color
 * @param  {Number}                   x
 * @param  {Number}                   y
 * @param  {Number}                   z
 * @param  {p5.Vector}                direction
 * @param  {Number}                   [angle]
 * @param  {Number}                   [concentration]
 */
/**
 * @method spotLight
 * @param  {p5.Color|Number[]|String} color
 * @param  {p5.Vector}                position
 * @param  {Number}                   rx
 * @param  {Number}                   ry
 * @param  {Number}                   rz
 * @param  {Number}                   [angle]
 * @param  {Number}                   [concentration]
 */
/**
 * @method spotLight
 * @param  {Number}     v1
 * @param  {Number}     v2
 * @param  {Number}     v3
 * @param  {Number}     x
 * @param  {Number}     y
 * @param  {Number}     z
 * @param  {p5.Vector}  direction
 * @param  {Number}     [angle]
 * @param  {Number}     [concentration]
 */
/**
 * @method spotLight
 * @param  {Number}     v1
 * @param  {Number}     v2
 * @param  {Number}     v3
 * @param  {p5.Vector}  position
 * @param  {Number}     rx
 * @param  {Number}     ry
 * @param  {Number}     rz
 * @param  {Number}     [angle]
 * @param  {Number}     [concentration]
 */
/**
 * @method spotLight
 * @param  {p5.Color|Number[]|String} color
 * @param  {Number}                   x
 * @param  {Number}                   y
 * @param  {Number}                   z
 * @param  {Number}                   rx
 * @param  {Number}                   ry
 * @param  {Number}                   rz
 * @param  {Number}                   [angle]
 * @param  {Number}                   [concentration]
 */
p5.prototype.spotLight = function(
  v1,
  v2,
  v3,
  x,
  y,
  z,
  nx,
  ny,
  nz,
  angle,
  concentration
) {
  this._assert3d('spotLight');
  p5._validateParameters('spotLight', arguments);

  let color, position, direction;
  const length = arguments.length;

  switch (length) {
    case 11:
    case 10:
      color = this.color(v1, v2, v3);
      position = new p5.Vector(x, y, z);
      direction = new p5.Vector(nx, ny, nz);
      break;

    case 9:
      if (v1 instanceof p5.Color) {
        color = v1;
        position = new p5.Vector(v2, v3, x);
        direction = new p5.Vector(y, z, nx);
        angle = ny;
        concentration = nz;
      } else if (x instanceof p5.Vector) {
        color = this.color(v1, v2, v3);
        position = x;
        direction = new p5.Vector(y, z, nx);
        angle = ny;
        concentration = nz;
      } else if (nx instanceof p5.Vector) {
        color = this.color(v1, v2, v3);
        position = new p5.Vector(x, y, z);
        direction = nx;
        angle = ny;
        concentration = nz;
      } else {
        color = this.color(v1, v2, v3);
        position = new p5.Vector(x, y, z);
        direction = new p5.Vector(nx, ny, nz);
      }
      break;

    case 8:
      if (v1 instanceof p5.Color) {
        color = v1;
        position = new p5.Vector(v2, v3, x);
        direction = new p5.Vector(y, z, nx);
        angle = ny;
      } else if (x instanceof p5.Vector) {
        color = this.color(v1, v2, v3);
        position = x;
        direction = new p5.Vector(y, z, nx);
        angle = ny;
      } else {
        color = this.color(v1, v2, v3);
        position = new p5.Vector(x, y, z);
        direction = nx;
        angle = ny;
      }
      break;

    case 7:
      if (v1 instanceof p5.Color && v2 instanceof p5.Vector) {
        color = v1;
        position = v2;
        direction = new p5.Vector(v3, x, y);
        angle = z;
        concentration = nx;
      } else if (v1 instanceof p5.Color && y instanceof p5.Vector) {
        color = v1;
        position = new p5.Vector(v2, v3, x);
        direction = y;
        angle = z;
        concentration = nx;
      } else if (x instanceof p5.Vector && y instanceof p5.Vector) {
        color = this.color(v1, v2, v3);
        position = x;
        direction = y;
        angle = z;
        concentration = nx;
      } else if (v1 instanceof p5.Color) {
        color = v1;
        position = new p5.Vector(v2, v3, x);
        direction = new p5.Vector(y, z, nx);
      } else if (x instanceof p5.Vector) {
        color = this.color(v1, v2, v3);
        position = x;
        direction = new p5.Vector(y, z, nx);
      } else {
        color = this.color(v1, v2, v3);
        position = new p5.Vector(x, y, z);
        direction = nx;
      }
      break;

    case 6:
      if (x instanceof p5.Vector && y instanceof p5.Vector) {
        color = this.color(v1, v2, v3);
        position = x;
        direction = y;
        angle = z;
      } else if (v1 instanceof p5.Color && y instanceof p5.Vector) {
        color = v1;
        position = new p5.Vector(v2, v3, x);
        direction = y;
        angle = z;
      } else if (v1 instanceof p5.Color && v2 instanceof p5.Vector) {
        color = v1;
        position = v2;
        direction = new p5.Vector(v3, x, y);
        angle = z;
      }
      break;

    case 5:
      if (
        v1 instanceof p5.Color &&
        v2 instanceof p5.Vector &&
        v3 instanceof p5.Vector
      ) {
        color = v1;
        position = v2;
        direction = v3;
        angle = x;
        concentration = y;
      } else if (x instanceof p5.Vector && y instanceof p5.Vector) {
        color = this.color(v1, v2, v3);
        position = x;
        direction = y;
      } else if (v1 instanceof p5.Color && y instanceof p5.Vector) {
        color = v1;
        position = new p5.Vector(v2, v3, x);
        direction = y;
      } else if (v1 instanceof p5.Color && v2 instanceof p5.Vector) {
        color = v1;
        position = v2;
        direction = new p5.Vector(v3, x, y);
      }
      break;

    case 4:
      color = v1;
      position = v2;
      direction = v3;
      angle = x;
      break;

    case 3:
      color = v1;
      position = v2;
      direction = v3;
      break;

    default:
      console.warn(
        `Sorry, input for spotlight() is not in prescribed format. Too ${
          length < 3 ? 'few' : 'many'
        } arguments were provided`
      );
      return this;
  }
  this._renderer.spotLightDiffuseColors.push(
    color._array[0],
    color._array[1],
    color._array[2]
  );

  Array.prototype.push.apply(
    this._renderer.spotLightSpecularColors,
    this._renderer.specularColors
  );

  this._renderer.spotLightPositions.push(position.x, position.y, position.z);
  direction.normalize();
  this._renderer.spotLightDirections.push(
    direction.x,
    direction.y,
    direction.z
  );

  if (angle === undefined) {
    angle = Math.PI / 3;
  }

  if (concentration !== undefined && concentration < 1) {
    concentration = 1;
    console.warn(
      'Value of concentration needs to be greater than 1. Setting it to 1'
    );
  } else if (concentration === undefined) {
    concentration = 100;
  }

  angle = this._renderer._pInst._toRadians(angle);
  this._renderer.spotLightAngle.push(Math.cos(angle));
  this._renderer.spotLightConc.push(concentration);

  this._renderer._enableLighting = true;

  return this;
};

/**
 * Removes all lights present in a sketch.
 *
 * All subsequent geometry is rendered without lighting (until a new
 * light is created with a call to one of the lighting functions
 * (<a href="#/p5/lights">lights()</a>,
 * <a href="#/p5/ambientLight">ambientLight()</a>,
 * <a href="#/p5/directionalLight">directionalLight()</a>,
 * <a href="#/p5/pointLight">pointLight()</a>,
 * <a href="#/p5/spotLight">spotLight()</a>).
 *
 * @method noLights
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe(
 *     'Three white spheres. Each appears as a different color due to lighting.'
 *   );
 * }
 * function draw() {
 *   background(200);
 *   noStroke();
 *
 *   ambientLight(255, 0, 0);
 *   translate(-30, 0, 0);
 *   ambientMaterial(255);
 *   sphere(13);
 *
 *   noLights();
 *   translate(30, 0, 0);
 *   ambientMaterial(255);
 *   sphere(13);
 *
 *   ambientLight(0, 255, 0);
 *   translate(30, 0, 0);
 *   ambientMaterial(255);
 *   sphere(13);
 * }
 * </code>
 * </div>
 */
p5.prototype.noLights = function() {
  this._assert3d('noLights');
  p5._validateParameters('noLights', arguments);

  this._renderer._enableLighting = false;

  this._renderer.ambientLightColors.length = 0;
  this._renderer.specularColors = [1, 1, 1];

  this._renderer.directionalLightDirections.length = 0;
  this._renderer.directionalLightDiffuseColors.length = 0;
  this._renderer.directionalLightSpecularColors.length = 0;

  this._renderer.pointLightPositions.length = 0;
  this._renderer.pointLightDiffuseColors.length = 0;
  this._renderer.pointLightSpecularColors.length = 0;

  this._renderer.spotLightPositions.length = 0;
  this._renderer.spotLightDirections.length = 0;
  this._renderer.spotLightDiffuseColors.length = 0;
  this._renderer.spotLightSpecularColors.length = 0;
  this._renderer.spotLightAngle.length = 0;
  this._renderer.spotLightConc.length = 0;

  this._renderer.constantAttenuation = 1;
  this._renderer.linearAttenuation = 0;
  this._renderer.quadraticAttenuation = 0;
  this._renderer._useShininess = 1;

  return this;
};

export default p5;
