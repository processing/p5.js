/**
 * @module 3D
 * @submodule Lights
 * @for p5
 * @requires core
 */

import { RendererGL } from './p5.RendererGL';
import { Vector } from '../math/p5.Vector';
import { Color } from '../color/p5.Color';

function light(p5, fn){
  /**
   * Creates a light that shines from all directions.
   *
   * Ambient light does not come from one direction. Instead, 3D shapes are
   * lit evenly from all sides. Ambient lights are almost always used in
   * combination with other types of lights.
   *
   * There are three ways to call `ambientLight()` with optional parameters to
   * set the light’s color.
   *
   * The first way to call `ambientLight()` has two parameters, `gray` and
   * `alpha`. `alpha` is optional. Grayscale and alpha values between 0 and 255
   * can be passed to set the ambient light’s color, as in `ambientLight(50)` or
   * `ambientLight(50, 30)`.
   *
   * The second way to call `ambientLight()` has one parameter, color. A
   * <a href="#/p5.Color">p5.Color</a> object, an array of color values, or a
   * CSS color string, as in `ambientLight('magenta')`, can be passed to set the
   * ambient light’s color.
   *
   * The third way to call `ambientLight()` has four parameters, `v1`, `v2`,
   * `v3`, and `alpha`. `alpha` is optional. RGBA, HSBA, or HSLA values can be
   * passed to set the ambient light’s colors, as in `ambientLight(255, 0, 0)`
   * or `ambientLight(255, 0, 0, 30)`. Color values will be interpreted using
   * the current <a href="#/p5/colorMode">colorMode()</a>.
   *
   * @method ambientLight
   * @param  {Number}        v1 red or hue value in the current
   *                            <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}        v2 green or saturation value in the current
   *                            <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}        v3 blue, brightness, or lightness value in the current
   *                            <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}        [alpha] alpha (transparency) value in the current
   *                                 <a href="#/p5/colorMode">colorMode()</a>.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click the canvas to turn on the light.
   *
   * let isLit = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn against a gray background. The sphere appears to change color when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Control the light.
   *   if (isLit === true) {
   *     // Use a grayscale value of 80.
   *     ambientLight(80);
   *   }
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   *
   * // Turn on the ambient light when the user double-clicks.
   * function doubleClicked() {
   *   isLit = true;
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A faded magenta sphere drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   // Use a p5.Color object.
   *   let c = color('orchid');
   *   ambientLight(c);
   *
   *   // Draw the sphere.
   *   sphere();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A faded magenta sphere drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   // Use a CSS color string.
   *   ambientLight('#DA70D6');
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A faded magenta sphere drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   // Use RGB values
   *   ambientLight(218, 112, 214);
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   */

  /**
   * @method ambientLight
   * @param  {Number}        gray  grayscale value between 0 and 255.
   * @param  {Number}        [alpha]
   * @chainable
   */

  /**
   * @method ambientLight
   * @param  {String}        value color as a CSS string.
   * @chainable
   */

  /**
   * @method ambientLight
   * @param  {Number[]}      values color as an array of RGBA, HSBA, or HSLA
   *                                 values.
   * @chainable
   */

  /**
   * @method ambientLight
   * @param  {p5.Color}      color color as a <a href="#/p5.Color">p5.Color</a> object.
   * @chainable
   */
  fn.ambientLight = function (v1, v2, v3, a) {
    this._assert3d('ambientLight');
    // p5._validateParameters('ambientLight', arguments);

    this._renderer.ambientLight(...arguments);

    return this;
  };

  /**
   * Sets the specular color for lights.
   *
   * `specularColor()` affects lights that bounce off a surface in a preferred
   * direction. These lights include
   * <a href="#/p5/directionalLight">directionalLight()</a>,
   * <a href="#/p5/pointLight">pointLight()</a>, and
   * <a href="#/p5/spotLight">spotLight()</a>. The function helps to create
   * highlights on <a href="#/p5.Geometry">p5.Geometry</a> objects that are
   * styled with <a href="#/p5/specularMaterial">specularMaterial()</a>. If a
   * geometry does not use
   * <a href="#/p5/specularMaterial">specularMaterial()</a>, then
   * `specularColor()` will have no effect.
   *
   * Note: `specularColor()` doesn’t affect lights that bounce in all
   * directions, including <a href="#/p5/ambientLight">ambientLight()</a> and
   * <a href="#/p5/imageLight">imageLight()</a>.
   *
   * There are three ways to call `specularColor()` with optional parameters to
   * set the specular highlight color.
   *
   * The first way to call `specularColor()` has two optional parameters, `gray`
   * and `alpha`. Grayscale and alpha values between 0 and 255, as in
   * `specularColor(50)` or `specularColor(50, 80)`, can be passed to set the
   * specular highlight color.
   *
   * The second way to call `specularColor()` has one optional parameter,
   * `color`. A <a href="#/p5.Color">p5.Color</a> object, an array of color
   * values, or a CSS color string can be passed to set the specular highlight
   * color.
   *
   * The third way to call `specularColor()` has four optional parameters, `v1`,
   * `v2`, `v3`, and `alpha`. RGBA, HSBA, or HSLA values, as in
   * `specularColor(255, 0, 0, 80)`, can be passed to set the specular highlight
   * color. Color values will be interpreted using the current
   * <a href="#/p5/colorMode">colorMode()</a>.
   *
   * @method specularColor
   * @param  {Number}        v1 red or hue value in the current
   *                            <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}        v2 green or saturation value in the current
   *                            <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}        v3 blue, brightness, or lightness value in the current
   *                            <a href="#/p5/colorMode">colorMode()</a>.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white sphere drawn on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // No specular color.
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click the canvas to add a point light.
   *
   * let isLit = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn on a gray background. A spotlight starts shining when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Style the sphere.
   *   noStroke();
   *   specularColor(100);
   *   specularMaterial(255, 255, 255);
   *
   *   // Control the light.
   *   if (isLit === true) {
   *     // Add a white point light from the top-right.
   *     pointLight(255, 255, 255, 30, -20, 40);
   *   }
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   *
   * // Turn on the point light when the user double-clicks.
   * function doubleClicked() {
   *   isLit = true;
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A black sphere drawn on a gray background. An area on the surface of the sphere is highlighted in blue.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a specular highlight.
   *   // Use a p5.Color object.
   *   let c = color('dodgerblue');
   *   specularColor(c);
   *
   *   // Add a white point light from the top-right.
   *   pointLight(255, 255, 255, 30, -20, 40);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Add a white specular material.
   *   specularMaterial(255, 255, 255);
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A black sphere drawn on a gray background. An area on the surface of the sphere is highlighted in blue.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a specular highlight.
   *   // Use a CSS color string.
   *   specularColor('#1E90FF');
   *
   *   // Add a white point light from the top-right.
   *   pointLight(255, 255, 255, 30, -20, 40);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Add a white specular material.
   *   specularMaterial(255, 255, 255);
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A black sphere drawn on a gray background. An area on the surface of the sphere is highlighted in blue.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a specular highlight.
   *   // Use RGB values.
   *   specularColor(30, 144, 255);
   *
   *   // Add a white point light from the top-right.
   *   pointLight(255, 255, 255, 30, -20, 40);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Add a white specular material.
   *   specularMaterial(255, 255, 255);
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   */

  /**
   * @method specularColor
   * @param  {Number}        gray grayscale value between 0 and 255.
   * @chainable
   */

  /**
   * @method specularColor
   * @param  {String}        value color as a CSS string.
   * @chainable
   */

  /**
   * @method specularColor
   * @param  {Number[]}      values color as an array of RGBA, HSBA, or HSLA
   *                                 values.
   * @chainable
   */

  /**
   * @method specularColor
   * @param  {p5.Color}      color color as a <a href="#/p5.Color">p5.Color</a> object.
   * @chainable
   */
  fn.specularColor = function (v1, v2, v3) {
    this._assert3d('specularColor');
    // p5._validateParameters('specularColor', arguments);

    this._renderer.specularColor(...arguments);

    return this;
  };

  /**
   * Creates a light that shines in one direction.
   *
   * Directional lights don’t shine from a specific point. They’re like a sun
   * that shines from somewhere offscreen. The light’s direction is set using
   * three `(x, y, z)` values between -1 and 1. For example, setting a light’s
   * direction as `(1, 0, 0)` will light <a href="#/p5.Geometry">p5.Geometry</a>
   * objects from the left since the light faces directly to the right. A
   * maximum of 5 directional lights can be active at once.
   *
   * There are four ways to call `directionalLight()` with parameters to set the
   * light’s color and direction.
   *
   * The first way to call `directionalLight()` has six parameters. The first
   * three parameters, `v1`, `v2`, and `v3`, set the light’s color using the
   * current <a href="#/p5/colorMode">colorMode()</a>. The last three
   * parameters, `x`, `y`, and `z`, set the light’s direction. For example,
   * `directionalLight(255, 0, 0, 1, 0, 0)` creates a red `(255, 0, 0)` light
   * that shines to the right `(1, 0, 0)`.
   *
   * The second way to call `directionalLight()` has four parameters. The first
   * three parameters, `v1`, `v2`, and `v3`, set the light’s color using the
   * current <a href="#/p5/colorMode">colorMode()</a>. The last parameter,
   * `direction` sets the light’s direction using a
   * <a href="#/p5.Geometry">p5.Geometry</a> object. For example,
   * `directionalLight(255, 0, 0, lightDir)` creates a red `(255, 0, 0)` light
   * that shines in the direction the `lightDir` vector points.
   *
   * The third way to call `directionalLight()` has four parameters. The first
   * parameter, `color`, sets the light’s color using a
   * <a href="#/p5.Color">p5.Color</a> object or an array of color values. The
   * last three parameters, `x`, `y`, and `z`, set the light’s direction. For
   * example, `directionalLight(myColor, 1, 0, 0)` creates a light that shines
   * to the right `(1, 0, 0)` with the color value of `myColor`.
   *
   * The fourth way to call `directionalLight()` has two parameters. The first
   * parameter, `color`, sets the light’s color using a
   * <a href="#/p5.Color">p5.Color</a> object or an array of color values. The
   * second parameter, `direction`, sets the light’s direction using a
   * <a href="#/p5.Color">p5.Color</a> object. For example,
   * `directionalLight(myColor, lightDir)` creates a light that shines in the
   * direction the `lightDir` vector points with the color value of `myColor`.
   *
   * @method directionalLight
   * @param  {Number}    v1 red or hue value in the current
   *                        <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    v2 green or saturation value in the current
   *                        <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    v3 blue, brightness, or lightness value in the current
   *                        <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    x  x-component of the light's direction between -1 and 1.
   * @param  {Number}    y  y-component of the light's direction between -1 and 1.
   * @param  {Number}    z  z-component of the light's direction between -1 and 1.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click to turn on the directional light.
   *
   * let isLit = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn on a gray background. A red light starts shining from above when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Control the light.
   *   if (isLit === true) {
   *     // Add a red directional light from above.
   *     // Use RGB values and XYZ directions.
   *     directionalLight(255, 0, 0, 0, 1, 0);
   *   }
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn on a gray background. The top of the sphere appears bright red. The color gets darker toward the bottom.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a red directional light from above.
   *   // Use a p5.Color object and XYZ directions.
   *   let c = color(255, 0, 0);
   *   directionalLight(c, 0, 1, 0);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn on a gray background. The top of the sphere appears bright red. The color gets darker toward the bottom.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a red directional light from above.
   *   // Use a p5.Color object and a p5.Vector object.
   *   let c = color(255, 0, 0);
   *   let lightDir = createVector(0, 1, 0);
   *   directionalLight(c, lightDir);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   */

  /**
   * @method directionalLight
   * @param  {Number}    v1
   * @param  {Number}    v2
   * @param  {Number}    v3
   * @param  {p5.Vector} direction direction of the light as a
   *                               <a href="#/p5.Vector">p5.Vector</a> object.
   * @chainable
   */

  /**
   * @method directionalLight
   * @param  {p5.Color|Number[]|String} color color as a <a href="#/p5.Color">p5.Color</a> object,
   *                                           an array of color values, or as a CSS string.
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
  fn.directionalLight = function (v1, v2, v3, x, y, z) {
    this._assert3d('directionalLight');
    // p5._validateParameters('directionalLight', arguments);

    //@TODO: check parameters number
    this._renderer.directionalLight(...arguments);

    return this;
  };

  /**
   * Creates a light that shines from a point in all directions.
   *
   * Point lights are like light bulbs that shine in all directions. They can be
   * placed at different positions to achieve different lighting effects. A
   * maximum of 5 point lights can be active at once.
   *
   * There are four ways to call `pointLight()` with parameters to set the
   * light’s color and position.
   *
   * The first way to call `pointLight()` has six parameters. The first three
   * parameters, `v1`, `v2`, and `v3`, set the light’s color using the current
   * <a href="#/p5/colorMode">colorMode()</a>. The last three parameters, `x`,
   * `y`, and `z`, set the light’s position. For example,
   * `pointLight(255, 0, 0, 50, 0, 0)` creates a red `(255, 0, 0)` light that
   * shines from the coordinates `(50, 0, 0)`.
   *
   * The second way to call `pointLight()` has four parameters. The first three
   * parameters, `v1`, `v2`, and `v3`, set the light’s color using the current
   * <a href="#/p5/colorMode">colorMode()</a>. The last parameter, position sets
   * the light’s position using a <a href="#/p5.Vector">p5.Vector</a> object.
   * For example, `pointLight(255, 0, 0, lightPos)` creates a red `(255, 0, 0)`
   * light that shines from the position set by the `lightPos` vector.
   *
   * The third way to call `pointLight()` has four parameters. The first
   * parameter, `color`, sets the light’s color using a
   * <a href="#/p5.Color">p5.Color</a> object or an array of color values. The
   * last three parameters, `x`, `y`, and `z`, set the light’s position. For
   * example, `directionalLight(myColor, 50, 0, 0)` creates a light that shines
   * from the coordinates `(50, 0, 0)` with the color value of `myColor`.
   *
   * The fourth way to call `pointLight()` has two parameters. The first
   * parameter, `color`, sets the light’s color using a
   * <a href="#/p5.Color">p5.Color</a> object or an array of color values. The
   * second parameter, `position`, sets the light’s position using a
   * <a href="#/p5.Vector">p5.Vector</a> object. For example,
   * `directionalLight(myColor, lightPos)` creates a light that shines from the
   * position set by the `lightPos` vector with the color value of `myColor`.
   *
   * @method pointLight
   * @param  {Number}    v1 red or hue value in the current
   *                        <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    v2 green or saturation value in the current
   *                        <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    v3 blue, brightness, or lightness value in the current
   *                        <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    x  x-coordinate of the light.
   * @param  {Number}    y  y-coordinate of the light.
   * @param  {Number}    z  z-coordinate of the light.
   * @chainable
   *
   * @example
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click to turn on the point light.
   *
   * let isLit = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn on a gray background. A red light starts shining from above when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Control the light.
   *   if (isLit === true) {
   *     // Add a red point light from above.
   *     // Use RGB values and XYZ coordinates.
   *     pointLight(255, 0, 0, 0, -150, 0);
   *   }
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   *
   * // Turn on the point light when the user double-clicks.
   * function doubleClicked() {
   *   isLit = true;
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn on a gray background. The top of the sphere appears bright red. The color gets darker toward the bottom.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a red point light from above.
   *   // Use a p5.Color object and XYZ directions.
   *   let c = color(255, 0, 0);
   *   pointLight(c, 0, -150, 0);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn on a gray background. The top of the sphere appears bright red. The color gets darker toward the bottom.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a red point light from above.
   *   // Use a p5.Color object and a p5.Vector object.
   *   let c = color(255, 0, 0);
   *   let lightPos = createVector(0, -150, 0);
   *   pointLight(c, lightPos);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('Four spheres arranged in a square and drawn on a gray background. The spheres appear bright red toward the center of the square. The color gets darker toward the corners of the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Add a red point light that points to the center of the scene.
   *   // Use a p5.Color object and a p5.Vector object.
   *   let c = color(255, 0, 0);
   *   let lightPos = createVector(0, 0, 65);
   *   pointLight(c, lightPos);
   *
   *   // Style the spheres.
   *   noStroke();
   *
   *   // Draw a sphere up and to the left.
   *   push();
   *   translate(-25, -25, 25);
   *   sphere(10);
   *   pop();
   *
   *   // Draw a box up and to the right.
   *   push();
   *   translate(25, -25, 25);
   *   sphere(10);
   *   pop();
   *
   *   // Draw a sphere down and to the left.
   *   push();
   *   translate(-25, 25, 25);
   *   sphere(10);
   *   pop();
   *
   *   // Draw a box down and to the right.
   *   push();
   *   translate(25, 25, 25);
   *   sphere(10);
   *   pop();
   * }
   * </code>
   * </div>
   */

  /**
   * @method pointLight
   * @param  {Number}     v1
   * @param  {Number}     v2
   * @param  {Number}     v3
   * @param  {p5.Vector}  position position of the light as a
   *                               <a href="#/p5.Vector">p5.Vector</a> object.
   * @chainable
   */

  /**
   * @method pointLight
   * @param  {p5.Color|Number[]|String} color color as a <a href="#/p5.Color">p5.Color</a> object,
   *                                          an array of color values, or a CSS string.
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
  fn.pointLight = function (v1, v2, v3, x, y, z) {
    this._assert3d('pointLight');
    // p5._validateParameters('pointLight', arguments);

    //@TODO: check parameters number
    this._renderer.pointLight(...arguments);

    return this;
  };

  /**
   * Creates an ambient light from an image.
   *
   * `imageLight()` simulates a light shining from all directions. The effect is
   * like placing the sketch at the center of a giant sphere that uses the image
   * as its texture. The image's diffuse light will be affected by
   * <a href="#/p5/fill">fill()</a> and the specular reflections will be
   * affected by <a href="#/p5/specularMaterial">specularMaterial()</a> and
   * <a href="#/p5/shininess">shininess()</a>.
   *
   * The parameter, `img`, is the <a href="#/p5.Image">p5.Image</a> object to
   * use as the light source.
   *
   * @method imageLight
   * @param  {p5.image}    img image to use as the light source.
   *
   * @example
   * <div class="notest">
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let img;
   *
   * async function setup() {
   *   // Load an image and create a p5.Image object.
   *   img = await loadImage('assets/outdoor_spheremap.jpg');
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere floating above a landscape. The surface of the sphere reflects the landscape.');
   * }
   *
   * function draw() {
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the image as a panorama (360˚ background).
   *   panorama(img);
   *
   *   // Add a soft ambient light.
   *   ambientLight(50);
   *
   *   // Add light from the image.
   *   imageLight(img);
   *
   *   // Style the sphere.
   *   specularMaterial(20);
   *   shininess(100);
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   */
  fn.imageLight = function (img) {
    this._renderer.imageLight(img);
  };

  /**
   * Creates an immersive 3D background.
   *
   * `panorama()` transforms images containing 360˚ content, such as maps or
   * HDRIs, into immersive 3D backgrounds that surround a sketch. Exploring the
   * space requires changing the camera's perspective with functions such as
   * <a href="#/p5/orbitControl">orbitControl()</a> or
   * <a href="#/p5/camera">camera()</a>.
   *
   * @method panorama
   * @param {p5.Image} img 360˚ image to use as the background.
   *
   * @example
   * <div class="notest">
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let img;
   *
   * async function setup() {
   *   // Load an image and create a p5.Image object.
   *   img = await loadImage('assets/outdoor_spheremap.jpg');
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere floating above a landscape. The surface of the sphere reflects the landscape. The full landscape is viewable in 3D as the user drags the mouse.');
   * }
   *
   * function draw() {
   *   // Add the panorama.
   *   panorama(img);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Use the image as a light source.
   *   imageLight(img);
   *
   *   // Style the sphere.
   *   noStroke();
   *   specularMaterial(50);
   *   shininess(200);
   *   metalness(100);
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   * </code>
   * </div>
   */
  fn.panorama = function (img) {
    this.filter(this._renderer._getSphereMapping(img));
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
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click to turn on the lights.
   *
   * let isLit = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white box drawn against a gray background. The quality of the light changes when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Control the lights.
   *   if (isLit === true) {
   *     lights();
   *   }
   *
   *   // Draw the box.
   *   box();
   * }
   *
   * // Turn on the lights when the user double-clicks.
   * function doubleClicked() {
   *   isLit = true;
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white box drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   ambientLight(128, 128, 128);
   *   directionalLight(128, 128, 128, 0, 0, -1);
   *
   *   // Draw the box.
   *   box();
   * }
   * </code>
   * </div>
   */
  fn.lights = function () {
    this._assert3d('lights');
    // Both specify gray by default.
    this._renderer.lights();
    return this;
  };

  /**
   * Sets the falloff rate for <a href="#/p5/pointLight">pointLight()</a>
   * and <a href="#/p5/spotLight">spotLight()</a>.
   *
   * A light’s falloff describes the intensity of its beam at a distance. For
   * example, a lantern has a slow falloff, a flashlight has a medium falloff,
   * and a laser pointer has a sharp falloff.
   *
   * `lightFalloff()` has three parameters, `constant`, `linear`, and
   * `quadratic`. They’re numbers used to calculate falloff at a distance, `d`,
   * as follows:
   *
   * `falloff = 1 / (constant + d * linear + (d * d) * quadratic)`
   *
   * Note: `constant`, `linear`, and `quadratic` should always be set to values
   * greater than 0.
   *
   * @method lightFalloff
   * @param {Number} constant  constant value for calculating falloff.
   * @param {Number} linear    linear value for calculating falloff.
   * @param {Number} quadratic quadratic value for calculating falloff.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click to change the falloff rate.
   *
   * let useFalloff = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A sphere drawn against a gray background. The intensity of the light changes when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Set the light falloff.
   *   if (useFalloff === true) {
   *     lightFalloff(2, 0, 0);
   *   }
   *
   *   // Add a white point light from the front.
   *   pointLight(255, 255, 255, 0, 0, 100);
   *
   *   // Style the sphere.
   *   noStroke();
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   *
   * // Change the falloff value when the user double-clicks.
   * function doubleClicked() {
   *   useFalloff = true;
   * }
   * </code>
   * </div>
   */
  fn.lightFalloff = function (
    constantAttenuation,
    linearAttenuation,
    quadraticAttenuation
  ) {
    this._assert3d('lightFalloff');
    // p5._validateParameters('lightFalloff', arguments);

    this._renderer.lightFalloff(
      constantAttenuation,
      linearAttenuation,
      quadraticAttenuation
    );

    return this;
  };

  /**
   * Creates a light that shines from a point in one direction.
   *
   * Spot lights are like flashlights that shine in one direction creating a
   * cone of light. The shape of the cone can be controlled using the angle and
   * concentration parameters. A maximum of 5 spot lights can be active at once.
   *
   * There are eight ways to call `spotLight()` with parameters to set the
   * light’s color, position, direction. For example,
   * `spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0)` creates a red `(255, 0, 0)` light
   * at the origin `(0, 0, 0)` that points to the right `(1, 0, 0)`.
   *
   * The `angle` parameter is optional. It sets the radius of the light cone.
   * For example, `spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16)` creates a
   * red `(255, 0, 0)` light at the origin `(0, 0, 0)` that points to the right
   * `(1, 0, 0)` with an angle of `PI / 16` radians. By default, `angle` is
   * `PI / 3` radians.
   *
   * The `concentration` parameter is also optional. It focuses the light
   * towards the center of the light cone. For example,
   * `spotLight(255, 0, 0, 0, 0, 0, 1, 0, 0, PI / 16, 50)` creates a red
   * `(255, 0, 0)` light at the origin `(0, 0, 0)` that points to the right
   * `(1, 0, 0)` with an angle of `PI / 16` radians at concentration of 50. By
   * default, `concentration` is 100.
   *
   * @method spotLight
   * @param  {Number}    v1               red or hue value in the current
   *                                      <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    v2               green or saturation value in the current
   *                                      <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    v3               blue, brightness, or lightness value in the current
   *                                      <a href="#/p5/colorMode">colorMode()</a>.
   * @param  {Number}    x                x-coordinate of the light.
   * @param  {Number}    y                y-coordinate of the light.
   * @param  {Number}    z                z-coordinate of the light.
   * @param  {Number}    rx               x-component of light direction between -1 and 1.
   * @param  {Number}    ry               y-component of light direction between -1 and 1.
   * @param  {Number}    rz               z-component of light direction between -1 and 1.
   * @param  {Number}    [angle]          angle of the light cone. Defaults to `PI / 3`.
   * @param  {Number}    [concentration]  concentration of the light. Defaults to 100.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click to adjust the spotlight.
   *
   * let isLit = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white sphere drawn on a gray background. A red spotlight starts shining when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Control the spotlight.
   *   if (isLit === true) {
   *     // Add a red spot light that shines into the screen.
   *     // Set its angle to PI / 32 radians.
   *     spotLight(255, 0, 0, 0, 0, 100, 0, 0, -1, PI / 32);
   *   }
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   *
   * // Turn on the spotlight when the user double-clicks.
   * function doubleClicked() {
   *   isLit = true;
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   * // Double-click to adjust the spotlight.
   *
   * let isLit = false;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white sphere drawn on a gray background. A red spotlight starts shining when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Control the spotlight.
   *   if (isLit === true) {
   *     // Add a red spot light that shines into the screen.
   *     // Set its angle to PI / 3 radians (default).
   *     // Set its concentration to 1000.
   *     let c = color(255, 0, 0);
   *     let position = createVector(0, 0, 100);
   *     let direction = createVector(0, 0, -1);
   *     spotLight(c, position, direction, PI / 3, 1000);
   *   }
   *
   *   // Draw the sphere.
   *   sphere(30);
   * }
   *
   * // Turn on the spotlight when the user double-clicks.
   * function doubleClicked() {
   *   isLit = true;
   * }
   * </code>
   * </div>
   */
  /**
   * @method spotLight
   * @param  {p5.Color|Number[]|String} color     color as a <a href="#/p5.Color">p5.Color</a> object,
   *                                              an array of color values, or a CSS string.
   * @param  {p5.Vector}                position  position of the light as a <a href="#/p5.Vector">p5.Vector</a> object.
   * @param  {p5.Vector}                direction direction of light as a <a href="#/p5.Vector">p5.Vector</a> object.
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
  fn.spotLight = function (
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
    // p5._validateParameters('spotLight', arguments);

    this._renderer.spotLight(...arguments);

    return this;
  };

  /**
   * Removes all lights from the sketch.
   *
   * Calling `noLights()` removes any lights created with
   * <a href="#/p5/lights">lights()</a>,
   * <a href="#/p5/ambientLight">ambientLight()</a>,
   * <a href="#/p5/directionalLight">directionalLight()</a>,
   * <a href="#/p5/pointLight">pointLight()</a>, or
   * <a href="#/p5/spotLight">spotLight()</a>. These functions may be called
   * after `noLights()` to create a new lighting scheme.
   *
   * @method noLights
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('Two spheres drawn against a gray background. The top sphere is white and the bottom sphere is red.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Turn on the lights.
   *   lights();
   *
   *   // Style the spheres.
   *   noStroke();
   *
   *   // Draw the top sphere.
   *   push();
   *   translate(0, -25, 0);
   *   sphere(20);
   *   pop();
   *
   *   // Turn off the lights.
   *   noLights();
   *
   *   // Add a red directional light that points into the screen.
   *   directionalLight(255, 0, 0, 0, 0, -1);
   *
   *   // Draw the bottom sphere.
   *   push();
   *   translate(0, 25, 0);
   *   sphere(20);
   *   pop();
   * }
   * </code>
   * </div>
   */
  fn.noLights = function (...args) {
    this._assert3d('noLights');
    // p5._validateParameters('noLights', args);

    this._renderer.noLights();

    return this;
  };


  RendererGL.prototype.ambientLight = function(v1, v2, v3, a) {
    const color = this._pInst.color(...arguments);

    this.states.setValue('ambientLightColors', [...this.states.ambientLightColors]);
    this.states.ambientLightColors.push(
      color._array[0],
      color._array[1],
      color._array[2]
    );

    this.states.setValue('enableLighting', true);
  }

  RendererGL.prototype.specularColor = function(v1, v2, v3) {
    const color = this._pInst.color(...arguments);

    this.states.setValue('specularColors', [
      color._array[0],
      color._array[1],
      color._array[2]
    ]);
  }

  RendererGL.prototype.directionalLight = function(v1, v2, v3, x, y, z) {
    let color;
    if (v1 instanceof Color) {
      color = v1;
    } else {
      color = this._pInst.color(v1, v2, v3);
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
    this.states.setValue('directionalLightDirections', [...this.states.directionalLightDirections]);
    this.states.directionalLightDirections.push(_x / l, _y / l, _z / l);

    this.states.setValue('directionalLightDiffuseColors', [...this.states.directionalLightDiffuseColors]);
    this.states.directionalLightDiffuseColors.push(
      color._array[0],
      color._array[1],
      color._array[2]
    );

    this.states.setValue('directionalLightSpecularColors', [...this.states.directionalLightSpecularColors]);
    Array.prototype.push.apply(
      this.states.directionalLightSpecularColors,
      this.states.specularColors
    );

    this.states.setValue('enableLighting', true);
  }

  RendererGL.prototype.pointLight = function(v1, v2, v3, x, y, z) {
    let color;
    if (v1 instanceof Color) {
      color = v1;
    } else {
      color = this._pInst.color(v1, v2, v3);
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

    this.states.setValue('pointLightPositions', [...this.states.pointLightPositions]);
    this.states.pointLightPositions.push(_x, _y, _z);

    this.states.setValue('pointLightDiffuseColors', [...this.states.pointLightDiffuseColors]);
    this.states.pointLightDiffuseColors.push(
      color._array[0],
      color._array[1],
      color._array[2]
    );

    this.states.setValue('pointLightSpecularColors', [...this.states.pointLightSpecularColors]);
    Array.prototype.push.apply(
      this.states.pointLightSpecularColors,
      this.states.specularColors
    );

    this.states.setValue('enableLighting', true);
  }

  RendererGL.prototype.imageLight = function(img) {
    // activeImageLight property is checked by _setFillUniforms
    // for sending uniforms to the fillshader
    this.states.setValue('activeImageLight', img);
    this.states.setValue('enableLighting', true);
  }

  RendererGL.prototype.lights = function() {
    const grayColor = this._pInst.color('rgb(128,128,128)');
    this.ambientLight(grayColor);
    this.directionalLight(grayColor, 0, 0, -1);
  }

  RendererGL.prototype.lightFalloff = function(
    constantAttenuation,
    linearAttenuation,
    quadraticAttenuation
  ) {
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

    this.states.setValue('constantAttenuation', constantAttenuation);
    this.states.setValue('linearAttenuation', linearAttenuation);
    this.states.setValue('quadraticAttenuation', quadraticAttenuation);
  }

  RendererGL.prototype.spotLight = function(
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
    let color, position, direction;
    const length = arguments.length;

    switch (length) {
      case 11:
      case 10:
        color = this._pInst.color(v1, v2, v3);
        position = new Vector(x, y, z);
        direction = new Vector(nx, ny, nz);
        break;

      case 9:
        if (v1 instanceof Color) {
          color = v1;
          position = new Vector(v2, v3, x);
          direction = new Vector(y, z, nx);
          angle = ny;
          concentration = nz;
        } else if (x instanceof Vector) {
          color = this._pInst.color(v1, v2, v3);
          position = x;
          direction = new Vector(y, z, nx);
          angle = ny;
          concentration = nz;
        } else if (nx instanceof Vector) {
          color = this._pInst.color(v1, v2, v3);
          position = new Vector(x, y, z);
          direction = nx;
          angle = ny;
          concentration = nz;
        } else {
          color = this._pInst.color(v1, v2, v3);
          position = new Vector(x, y, z);
          direction = new Vector(nx, ny, nz);
        }
        break;

      case 8:
        if (v1 instanceof Color) {
          color = v1;
          position = new Vector(v2, v3, x);
          direction = new Vector(y, z, nx);
          angle = ny;
        } else if (x instanceof Vector) {
          color = this._pInst.color(v1, v2, v3);
          position = x;
          direction = new Vector(y, z, nx);
          angle = ny;
        } else {
          color = this._pInst.color(v1, v2, v3);
          position = new Vector(x, y, z);
          direction = nx;
          angle = ny;
        }
        break;

      case 7:
        if (v1 instanceof Color && v2 instanceof Vector) {
          color = v1;
          position = v2;
          direction = new Vector(v3, x, y);
          angle = z;
          concentration = nx;
        } else if (v1 instanceof Color && y instanceof Vector) {
          color = v1;
          position = new Vector(v2, v3, x);
          direction = y;
          angle = z;
          concentration = nx;
        } else if (x instanceof Vector && y instanceof Vector) {
          color = this._pInst.color(v1, v2, v3);
          position = x;
          direction = y;
          angle = z;
          concentration = nx;
        } else if (v1 instanceof Color) {
          color = v1;
          position = new Vector(v2, v3, x);
          direction = new Vector(y, z, nx);
        } else if (x instanceof Vector) {
          color = this._pInst.color(v1, v2, v3);
          position = x;
          direction = new Vector(y, z, nx);
        } else {
          color = this._pInst.color(v1, v2, v3);
          position = new Vector(x, y, z);
          direction = nx;
        }
        break;

      case 6:
        if (x instanceof Vector && y instanceof Vector) {
          color = this._pInst.color(v1, v2, v3);
          position = x;
          direction = y;
          angle = z;
        } else if (v1 instanceof Color && y instanceof Vector) {
          color = v1;
          position = new Vector(v2, v3, x);
          direction = y;
          angle = z;
        } else if (v1 instanceof Color && v2 instanceof Vector) {
          color = v1;
          position = v2;
          direction = new Vector(v3, x, y);
          angle = z;
        }
        break;

      case 5:
        if (
          v1 instanceof Color &&
          v2 instanceof Vector &&
          v3 instanceof Vector
        ) {
          color = v1;
          position = v2;
          direction = v3;
          angle = x;
          concentration = y;
        } else if (x instanceof Vector && y instanceof Vector) {
          color = this._pInst.color(v1, v2, v3);
          position = x;
          direction = y;
        } else if (v1 instanceof Color && y instanceof Vector) {
          color = v1;
          position = new Vector(v2, v3, x);
          direction = y;
        } else if (v1 instanceof Color && v2 instanceof Vector) {
          color = v1;
          position = v2;
          direction = new Vector(v3, x, y);
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
        return;
    }
    this.states.setValue('spotLightDiffuseColors', [
      color._array[0],
      color._array[1],
      color._array[2]
    ]);

    this.states.setValue('spotLightSpecularColors', [
      ...this.states.specularColors
    ]);

    this.states.setValue('spotLightPositions', [position.x, position.y, position.z]);
    direction.normalize();
    this.states.setValue('spotLightDirections', [
      direction.x,
      direction.y,
      direction.z
    ]);

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

    angle = this._pInst._toRadians(angle);
    this.states.setValue('spotLightAngle', [Math.cos(angle)]);
    this.states.setValue('spotLightConc', [concentration]);

    this.states.setValue('enableLighting', true);
  }

  RendererGL.prototype.noLights = function() {
    this.states.setValue('activeImageLight', null);
    this.states.setValue('enableLighting', false);

    this.states.setValue('ambientLightColors', []);
    this.states.setValue('specularColors', [1, 1, 1]);

    this.states.setValue('directionalLightDirections', []);
    this.states.setValue('directionalLightDiffuseColors', []);
    this.states.setValue('directionalLightSpecularColors', []);

    this.states.setValue('pointLightPositions', []);
    this.states.setValue('pointLightDiffuseColors', []);
    this.states.setValue('pointLightSpecularColors', []);

    this.states.setValue('spotLightPositions', []);
    this.states.setValue('spotLightDirections', []);
    this.states.setValue('spotLightDiffuseColors', []);
    this.states.setValue('spotLightSpecularColors', []);
    this.states.setValue('spotLightAngle', []);
    this.states.setValue('spotLightConc', []);

    this.states.setValue('constantAttenuation', 1);
    this.states.setValue('linearAttenuation', 0);
    this.states.setValue('quadraticAttenuation', 0);
    this.states.setValue('_useShininess', 1);
    this.states.setValue('_useMetalness', 0);
  }
}

export default light;

if(typeof p5 !== 'undefined'){
  light(p5, p5.prototype);
}
