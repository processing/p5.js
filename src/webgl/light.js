/**
 * @module Lights, Camera
 * @submodule Lights
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Creates an ambient light with a color. Ambient light is light that comes from everywhere on the canvas.
 * It has no particular source.
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
 * createCanvas(100, 100, WEBGL);
 * ambientLight(0);
 * ambientMaterial(250);
 * sphere(40);
 * </code>
 * </div>
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(51);
 *   ambientLight(100); // white light
 *   ambientMaterial(255, 102, 94); // magenta material
 *   box(30);
 * }
 * </code>
 * </div>
 * @alt
 * evenly distributed light across a sphere
 * evenly distributed light across a rotating sphere
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
 * Set's the color of the specular highlight when using a specular material and
 * specular light.
 *
 * This method can be combined with specularMaterial() and shininess()
 * functions to set specular highlights. The default color is white, ie
 * (255, 255, 255), which is used if this method is not called before
 * specularMaterial(). If this method is called without specularMaterial(),
 * There will be no effect.
 *
 * Note: specularColor is equivalent to the processing function
 * <a href="https://processing.org/reference/lightSpecular_.html">lightSpecular</a>.
 *
 * @method specularColor
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 * }
 *
 * function draw() {
 *   background(0);
 *   shininess(20);
 *   ambientLight(50);
 *   specularColor(255, 0, 0);
 *   pointLight(255, 0, 0, 0, -50, 50);
 *   specularColor(0, 255, 0);
 *   pointLight(0, 255, 0, 0, 50, 50);
 *   specularMaterial(255);
 *   sphere(40);
 * }
 * </code>
 * </div>
 *
 * @alt
 * different specular light sources from top and bottom of canvas
 */

/**
 * @method specularColor
 * @param  {String}        value   a color string
 * @chainable
 */

/**
 * @method specularColor
 * @param  {Number}        gray   a gray value
 * @chainable
 */

/**
 * @method specularColor
 * @param  {Number[]}      values  an array containing the red,green,blue &
 *                                 and alpha components of the color
 * @chainable
 */

/**
 * @method specularColor
 * @param  {p5.Color}      color   the ambient light color
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
 * Creates a directional light with a color and a direction
 *
 * A maximum of 5 directionalLight can be active at one time
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
 * Creates a point light with a color and a light position
 *
 * A maximum of 5 pointLight can be active at one time
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
 * Creates a spotlight with a given color, position, direction of light,
 * angle and concentration. Here, angle refers to the opening or aperture
 * of the cone of the spotlight, and concentration is used to focus the
 * light towards the center. Both angle and concentration are optional, but if
 * you want to provide concentration, you will also have to specify the angle.
 *
 * A maximum of 5 spotLight can be active at one time
 * @method spotLight
 * @param  {Number}    v1       red or hue value (depending on the current
 * color mode),
 * @param  {Number}    v2       green or saturation value
 * @param  {Number}    v3       blue or brightness value
 * @param  {Number}    x        x axis position
 * @param  {Number}    y        y axis position
 * @param  {Number}    z        z axis position
 * @param  {Number}    rx       x axis direction of light
 * @param  {Number}    ry       y axis direction of light
 * @param  {Number}    rz       z axis direction of light
 * @param  {Number}    [angle]  optional parameter for angle. Defaults to PI/3
 * @param  {Number}    [conc]   optional parameter for concentration. Defaults to 100
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
 *   ambientLight(50);
 *   spotLight(0, 250, 0, locX, locY, 100, 0, 0, -1, Math.PI / 16);
 *   noStroke();
 *   sphere(40);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Spot light on a sphere which changes position with mouse
 */
/**
 * @method spotLight
 * @param  {Number[]|String|p5.Color} color color Array, CSS color string,
 * or <a href="#/p5.Color">p5.Color</a> value
 * @param  {p5.Vector}                position the position of the light
 * @param  {p5.Vector}                direction the direction of the light
 * @param  {Number}                   [angle]
 * @param  {Number}                   [conc]
 */
/**
 * @method spotLight
 * @param  {Number}     v1
 * @param  {Number}     v2
 * @param  {Number}     v3
 * @param  {p5.Vector}  position
 * @param  {p5.Vector}  direction
 * @param  {Number}     [angle]
 * @param  {Number}     [conc]
 */
/**
 * @method spotLight
 * @param  {Number[]|String|p5.Color} color
 * @param  {Number}                   x
 * @param  {Number}                   y
 * @param  {Number}                   z
 * @param  {p5.Vector}                direction
 * @param  {Number}                   [angle]
 * @param  {Number}                   [conc]
 */
/**
 * @method spotLight
 * @param  {Number[]|String|p5.Color} color
 * @param  {p5.Vector}                position
 * @param  {Number}                   rx
 * @param  {Number}                   ry
 * @param  {Number}                   rz
 * @param  {Number}                   [angle]
 * @param  {Number}                   [conc]
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
 * @param  {Number}     [conc]
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
 * @param  {Number}     [conc]
 */
/**
 * @method spotLight
 * @param  {Number[]|String|p5.Color} color
 * @param  {Number}                   x
 * @param  {Number}                   y
 * @param  {Number}                   z
 * @param  {Number}                   rx
 * @param  {Number}                   ry
 * @param  {Number}                   rz
 * @param  {Number}                   [angle]
 * @param  {Number}                   [conc]
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
          length < 3 ? `few` : `many`
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
 * This function will remove all the lights from the sketch for the
 * subsequent materials rendered. It affects all the subsequent methods.
 * Calls to lighting methods made after noLights() will re-enable lights
 * in the sketch.
 * @method noLights
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   noStroke();
 *
 *   ambientLight(150, 0, 0);
 *   translate(-25, 0, 0);
 *   ambientMaterial(250);
 *   sphere(20);
 *
 *   noLights();
 *   ambientLight(0, 150, 0);
 *   translate(50, 0, 0);
 *   ambientMaterial(250);
 *   sphere(20);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Two spheres showing different colors
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
