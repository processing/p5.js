/**
 * @module Shape
 * @submodule 3D Primitives
 * @for p5
 * @requires core
 * @requires p5.Geometry
 */

import * as constants from '../core/constants';
import { RendererGL } from './p5.RendererGL';
import { Vector } from '../math/p5.Vector';
import { Geometry } from './p5.Geometry';
import { Matrix } from '../math/p5.Matrix';

function primitives3D(p5, fn){
/**
 * Sets the stroke rendering mode to balance performance and visual features when drawing lines.
 *
 * `strokeMode()` offers two modes:
 *
 * - `SIMPLE`: Optimizes for speed by disabling caps, joins, and stroke color features.
 *   Use this mode for faster line rendering when these visual details are unnecessary.
 * - `FULL`: Enables caps, joins, and stroke color for lines.
 *   This mode provides enhanced visuals but may reduce performance due to additional processing.
 *
 * Choose the mode that best suits your application's needs to either improve rendering speed or enhance visual quality.
 *
 * @method strokeMode
 * @param {String} mode - The stroke mode to set. Possible values are:
 *   - `'SIMPLE'`: Fast rendering without caps, joins, or stroke color.
 *   - `'FULL'`: Detailed rendering with caps, joins, and stroke color.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(300, 300, WEBGL);
 *   describe('A sphere with red stroke and a red, wavy line on a gray background. The wavy line have caps, joins and colors.');
 * }
 *
 * function draw() {
 *   background(128);
 *   strokeMode(FULL); // Enables detailed rendering with caps, joins, and stroke color.
 *   push();
 *   strokeWeight(1);
 *   translate(0, -50, 0);
 *   sphere(50);
 *   pop();
 *   orbitControl();
 *
 *   noFill();
 *   strokeWeight(15);
 *   stroke('red');
 *   beginShape();
 *   bezierOrder(2); // Sets the order of the Bezier curve.
 *   bezierVertex(80, 80);
 *   bezierVertex(50, -40);
 *   bezierVertex(-80, 80);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(300, 300, WEBGL);
 *   describe('A sphere with red stroke and a  wavy line without full curve decorations without caps and color on a gray background.');
 * }
 *
 * function draw() {
 *   background(128);
 *   strokeMode(SIMPLE); // Simplifies stroke rendering for better performance.
 *   
 *   // Draw sphere
 *   push();
 *   strokeWeight(1);
 *   translate(0, -50, 0);
 *   sphere(50);
 *   pop();
 *   orbitControl();
 *
 *   // Draw modified wavy red line
 *   noFill();
 *   strokeWeight(15);
 *   stroke('red');
 *   beginShape();
 *   bezierOrder(2); // Sets the order of the Bezier curve.
 *   bezierVertex(80, 80);
 *   bezierVertex(50, -40);
 *   bezierVertex(-80, 80);
 *   endShape();
 * }
 * </code>
 * </div>
 */

  fn.strokeMode = function (mode) {
    if (mode === undefined) {
      return this._renderer._simpleLines ? constants.SIMPLE : constants.FULL;
    } else if (mode === constants.SIMPLE) {
      this._renderer._simpleLines = true;
    } else if (mode === constants.FULL) {
      this._renderer._simpleLines = false;
    } else {
      throw Error('no such parameter');
    }
  }
  /**
   * Creates a custom <a href="#/p5.Geometry">p5.Geometry</a> object from
   * simpler 3D shapes.
   *
   * `buildGeometry()` helps with creating complex 3D shapes from simpler ones
   * such as <a href="#/p5/sphere">sphere()</a>. It can help to make sketches
   * more performant. For example, if a complex 3D shape doesn’t change while a
   * sketch runs, then it can be created with `buildGeometry()`. Creating a
   * <a href="#/p5.Geometry">p5.Geometry</a> object once and then drawing it
   * will run faster than repeatedly drawing the individual pieces.
   *
   * The parameter, `callback`, is a function with the drawing instructions for
   * the new <a href="#/p5.Geometry">p5.Geometry</a> object. It will be called
   * once to create the new 3D shape.
   *
   * See <a href="#/p5/beginGeometry">beginGeometry()</a> and
   * <a href="#/p5/endGeometry">endGeometry()</a> for another way to build 3D
   * shapes.
   *
   * Note: `buildGeometry()` can only be used in WebGL mode.
   *
   * @method buildGeometry
   * @param {Function} callback function that draws the shape.
   * @returns {p5.Geometry} new 3D shape.
   *
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the p5.Geometry object.
   *   shape = buildGeometry(createShape);
   *
   *   describe('A white cone drawn on a gray background.');
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
   *   // Style the p5.Geometry object.
   *   noStroke();
   *
   *   // Draw the p5.Geometry object.
   *   model(shape);
   * }
   *
   * // Create p5.Geometry object from a single cone.
   * function createShape() {
   *   cone();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the arrow.
   *   shape = buildGeometry(createArrow);
   *
   *   describe('A white arrow drawn on a gray background.');
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
   *   // Style the arrow.
   *   noStroke();
   *
   *   // Draw the arrow.
   *   model(shape);
   * }
   *
   * function createArrow() {
   *   // Add shapes to the p5.Geometry object.
   *   push();
   *   rotateX(PI);
   *   cone(10);
   *   translate(0, -10, 0);
   *   cylinder(3, 20);
   *   pop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let shape;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create the p5.Geometry object.
   *   shape = buildGeometry(createArrow);
   *
   *   describe('Two white arrows drawn on a gray background. The arrow on the right rotates slowly.');
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
   *   // Style the arrows.
   *   noStroke();
   *
   *   // Draw the p5.Geometry object.
   *   model(shape);
   *
   *   // Translate and rotate the coordinate system.
   *   translate(30, 0, 0);
   *   rotateZ(frameCount * 0.01);
   *
   *   // Draw the p5.Geometry object again.
   *   model(shape);
   * }
   *
   * function createArrow() {
   *   // Add shapes to the p5.Geometry object.
   *   push();
   *   rotateX(PI);
   *   cone(10);
   *   translate(0, -10, 0);
   *   cylinder(3, 20);
   *   pop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let button;
   * let particles;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a button to reset the particle system.
   *   button = createButton('Reset');
   *
   *   // Call resetModel() when the user presses the button.
   *   button.mousePressed(resetModel);
   *
   *   // Add the original set of particles.
   *   resetModel();
   *
   *   describe('A set of white spheres on a gray background. The spheres are positioned randomly. Their positions reset when the user presses the Reset button.');
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
   *   // Style the particles.
   *   noStroke();
   *
   *   // Draw the particles.
   *   model(particles);
   * }
   *
   * function resetModel() {
   *   // If the p5.Geometry object has already been created,
   *   // free those resources.
   *   if (particles) {
   *     freeGeometry(particles);
   *   }
   *
   *   // Create a new p5.Geometry object with random spheres.
   *   particles = buildGeometry(createParticles);
   * }
   *
   * function createParticles() {
   *   for (let i = 0; i < 60; i += 1) {
   *     // Calculate random coordinates.
   *     let x = randomGaussian(0, 20);
   *     let y = randomGaussian(0, 20);
   *     let z = randomGaussian(0, 20);
   *
   *     push();
   *     // Translate to the particle's coordinates.
   *     translate(x, y, z);
   *     // Draw the particle.
   *     sphere(5);
   *     pop();
   *   }
   * }
   * </code>
   * </div>
   */
  fn.buildGeometry = function(callback) {
    return this._renderer.buildGeometry(callback);
  };

  /**
   * Clears a <a href="#/p5.Geometry">p5.Geometry</a> object from the graphics
   * processing unit (GPU) memory.
   *
   * <a href="#/p5.Geometry">p5.Geometry</a> objects can contain lots of data
   * about their vertices, surface normals, colors, and so on. Complex 3D shapes
   * can use lots of memory which is a limited resource in many GPUs. Calling
   * `freeGeometry()` can improve performance by freeing a
   * <a href="#/p5.Geometry">p5.Geometry</a> object’s resources from GPU memory.
   * `freeGeometry()` works with <a href="#/p5.Geometry">p5.Geometry</a> objects
   * created with <a href="#/p5/beginGeometry">beginGeometry()</a> and
   * <a href="#/p5/endGeometry">endGeometry()</a>,
   * <a href="#/p5/buildGeometry">buildGeometry()</a>, and
   * <a href="#/p5/loadModel">loadModel()</a>.
   *
   * The parameter, `geometry`, is the <a href="#/p5.Geometry">p5.Geometry</a>
   * object to be freed.
   *
   * Note: A <a href="#/p5.Geometry">p5.Geometry</a> object can still be drawn
   * after its resources are cleared from GPU memory. It may take longer to draw
   * the first time it’s redrawn.
   *
   * Note: `freeGeometry()` can only be used in WebGL mode.
   *
   * @method freeGeometry
   * @param {p5.Geometry} geometry 3D shape whose resources should be freed.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Geometry object.
   *   beginGeometry();
   *   cone();
   *   let shape = endGeometry();
   *
   *   // Draw the shape.
   *   model(shape);
   *
   *   // Free the shape's resources.
   *   freeGeometry(shape);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let button;
   * let particles;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a button to reset the particle system.
   *   button = createButton('Reset');
   *
   *   // Call resetModel() when the user presses the button.
   *   button.mousePressed(resetModel);
   *
   *   // Add the original set of particles.
   *   resetModel();
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
   *   // Style the particles.
   *   noStroke();
   *
   *   // Draw the particles.
   *   model(particles);
   * }
   *
   * function resetModel() {
   *   // If the p5.Geometry object has already been created,
   *   // free those resources.
   *   if (particles) {
   *     freeGeometry(particles);
   *   }
   *
   *   // Create a new p5.Geometry object with random spheres.
   *   particles = buildGeometry(createParticles);
   * }
   *
   * function createParticles() {
   *   for (let i = 0; i < 60; i += 1) {
   *     // Calculate random coordinates.
   *     let x = randomGaussian(0, 20);
   *     let y = randomGaussian(0, 20);
   *     let z = randomGaussian(0, 20);
   *
   *     push();
   *     // Translate to the particle's coordinates.
   *     translate(x, y, z);
   *     // Draw the particle.
   *     sphere(5);
   *     pop();
   *   }
   * }
   * </code>
   * </div>
   */
  fn.freeGeometry = function(geometry) {
    this._renderer.geometryBufferCache.freeBuffers(geometry.gid);
  };

  /**
   * Draws a plane.
   *
   * A plane is a four-sided, flat shape with every angle measuring 90˚. It’s
   * similar to a rectangle and offers advanced drawing features in WebGL mode.
   *
   * The first parameter, `width`, is optional. If a `Number` is passed, as in
   * `plane(20)`, it sets the plane’s width and height. By default, `width` is
   * 50.
   *
   * The second parameter, `height`, is also optional. If a `Number` is passed,
   * as in `plane(20, 30)`, it sets the plane’s height. By default, `height` is
   * set to the plane’s `width`.
   *
   * The third parameter, `detailX`, is also optional. If a `Number` is passed,
   * as in `plane(20, 30, 5)` it sets the number of triangle subdivisions to use
   * along the x-axis. All 3D shapes are made by connecting triangles to form
   * their surfaces. By default, `detailX` is 1.
   *
   * The fourth parameter, `detailY`, is also optional. If a `Number` is passed,
   * as in `plane(20, 30, 5, 7)` it sets the number of triangle subdivisions to
   * use along the y-axis. All 3D shapes are made by connecting triangles to
   * form their surfaces. By default, `detailY` is 1.
   *
   * Note: `plane()` can only be used in WebGL mode.
   *
   * @method plane
   * @param  {Number} [width]    width of the plane.
   * @param  {Number} [height]   height of the plane.
   * @param  {Integer} [detailX] number of triangle subdivisions along the x-axis.
   * @param {Integer} [detailY]  number of triangle subdivisions along the y-axis.
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
   *   describe('A white plane on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the plane.
   *   plane();
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
   *   describe('A white plane on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the plane.
   *   // Set its width and height to 30.
   *   plane(30);
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
   *   describe('A white plane on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the plane.
   *   // Set its width to 30 and height to 50.
   *   plane(30, 50);
   * }
   * </code>
   * </div>
   */
  fn.plane = function(
    width = 50,
    height = width,
    detailX = 1,
    detailY = 1
  ) {
    this._assert3d('plane');
    // p5._validateParameters('plane', arguments);

    this._renderer.plane(width, height, detailX, detailY);
    return this;
  };

  /**
   * Draws a box (rectangular prism).
   *
   * A box is a 3D shape with six faces. Each face makes a 90˚ with four
   * neighboring faces.
   *
   * The first parameter, `width`, is optional. If a `Number` is passed, as in
   * `box(20)`, it sets the box’s width and height. By default, `width` is 50.
   *
   * The second parameter, `height`, is also optional. If a `Number` is passed,
   * as in `box(20, 30)`, it sets the box’s height. By default, `height` is set
   * to the box’s `width`.
   *
   * The third parameter, `depth`, is also optional. If a `Number` is passed, as
   * in `box(20, 30, 40)`, it sets the box’s depth. By default, `depth` is set
   * to the box’s `height`.
   *
   * The fourth parameter, `detailX`, is also optional. If a `Number` is passed,
   * as in `box(20, 30, 40, 5)`, it sets the number of triangle subdivisions to
   * use along the x-axis. All 3D shapes are made by connecting triangles to
   * form their surfaces. By default, `detailX` is 1.
   *
   * The fifth parameter, `detailY`, is also optional. If a number is passed, as
   * in `box(20, 30, 40, 5, 7)`, it sets the number of triangle subdivisions to
   * use along the y-axis. All 3D shapes are made by connecting triangles to
   * form their surfaces. By default, `detailY` is 1.
   *
   * Note: `box()` can only be used in WebGL mode.
   *
   * @method  box
   * @param  {Number} [width]     width of the box.
   * @param  {Number} [height]    height of the box.
   * @param  {Number} [depth]     depth of the box.
   * @param {Integer} [detailX]   number of triangle subdivisions along the x-axis.
   * @param {Integer} [detailY]   number of triangle subdivisions along the y-axis.
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
   *   describe('A white box on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the box.
   *   box();
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
   *   describe('A white box on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the box.
   *   // Set its width and height to 30.
   *   box(30);
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
   *   describe('A white box on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the box.
   *   // Set its width to 30 and height to 50.
   *   box(30, 50);
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
   *   describe('A white box on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the box.
   *   // Set its width to 30, height to 50, and depth to 10.
   *   box(30, 50, 10);
   * }
   * </code>
   * </div>
   */
  fn.box = function(width, height, depth, detailX, detailY) {
    this._assert3d('box');
    // p5._validateParameters('box', arguments);

    this._renderer.box(width, height, depth, detailX, detailY);

    return this;
  };

  /**
   * Draws a sphere.
   *
   * A sphere is a 3D shape with triangular faces that connect to form a round
   * surface. Spheres with few faces look like crystals. Spheres with many faces
   * have smooth surfaces and look like balls.
   *
   * The first parameter, `radius`, is optional. If a `Number` is passed, as in
   * `sphere(20)`, it sets the radius of the sphere. By default, `radius` is 50.
   *
   * The second parameter, `detailX`, is also optional. If a `Number` is passed,
   * as in `sphere(20, 5)`, it sets the number of triangle subdivisions to use
   * along the x-axis. All 3D shapes are made by connecting triangles to form
   * their surfaces. By default, `detailX` is 24.
   *
   * The third parameter, `detailY`, is also optional. If a `Number` is passed,
   * as in `sphere(20, 5, 2)`, it sets the number of triangle subdivisions to
   * use along the y-axis. All 3D shapes are made by connecting triangles to
   * form their surfaces. By default, `detailY` is 16.
   *
   * Note: `sphere()` can only be used in WebGL mode.
   *
   * @method sphere
   * @param  {Number} [radius]   radius of the sphere. Defaults to 50.
   * @param  {Integer} [detailX] number of triangle subdivisions along the x-axis. Defaults to 24.
   * @param  {Integer} [detailY] number of triangle subdivisions along the y-axis. Defaults to 16.
   *
   * @chainable
   * @example
   * <div>
   * <code>
   * // Click and drag the mouse to view the scene from different angles.
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white sphere on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
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
   *   describe('A white sphere on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the sphere.
   *   // Set its radius to 30.
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
   *   describe('A white sphere on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the sphere.
   *   // Set its radius to 30.
   *   // Set its detailX to 6.
   *   sphere(30, 6);
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
   *   describe('A white sphere on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the sphere.
   *   // Set its radius to 30.
   *   // Set its detailX to 24.
   *   // Set its detailY to 4.
   *   sphere(30, 24, 4);
   * }
   * </code>
   * </div>
   */
  fn.sphere = function(radius = 50, detailX = 24, detailY = 16) {
    this._assert3d('sphere');
    // p5._validateParameters('sphere', arguments);

    this._renderer.sphere(radius, detailX, detailY);

    return this;
  };

  /**
   * Draws a cylinder.
   *
   * A cylinder is a 3D shape with triangular faces that connect a flat bottom
   * to a flat top. Cylinders with few faces look like boxes. Cylinders with
   * many faces have smooth surfaces.
   *
   * The first parameter, `radius`, is optional. If a `Number` is passed, as in
   * `cylinder(20)`, it sets the radius of the cylinder’s base. By default,
   * `radius` is 50.
   *
   * The second parameter, `height`, is also optional. If a `Number` is passed,
   * as in `cylinder(20, 30)`, it sets the cylinder’s height. By default,
   * `height` is set to the cylinder’s `radius`.
   *
   * The third parameter, `detailX`, is also optional. If a `Number` is passed,
   * as in `cylinder(20, 30, 5)`, it sets the number of edges used to form the
   * cylinder's top and bottom. Using more edges makes the top and bottom look
   * more like circles. By default, `detailX` is 24.
   *
   * The fourth parameter, `detailY`, is also optional. If a `Number` is passed,
   * as in `cylinder(20, 30, 5, 2)`, it sets the number of triangle subdivisions
   * to use along the y-axis, between cylinder's the top and bottom. All 3D
   * shapes are made by connecting triangles to form their surfaces. By default,
   * `detailY` is 1.
   *
   * The fifth parameter, `bottomCap`, is also optional. If a `false` is passed,
   * as in `cylinder(20, 30, 5, 2, false)` the cylinder’s bottom won’t be drawn.
   * By default, `bottomCap` is `true`.
   *
   * The sixth parameter, `topCap`, is also optional. If a `false` is passed, as
   * in `cylinder(20, 30, 5, 2, false, false)` the cylinder’s top won’t be
   * drawn. By default, `topCap` is `true`.
   *
   * Note: `cylinder()` can only be used in WebGL mode.
   *
   * @method cylinder
   * @param  {Number}  [radius]    radius of the cylinder. Defaults to 50.
   * @param  {Number}  [height]    height of the cylinder. Defaults to the value of `radius`.
   * @param  {Integer} [detailX]   number of edges along the top and bottom. Defaults to 24.
   * @param  {Integer} [detailY]   number of triangle subdivisions along the y-axis. Defaults to 1.
   * @param  {Boolean} [bottomCap] whether to draw the cylinder's bottom. Defaults to `true`.
   * @param  {Boolean} [topCap]    whether to draw the cylinder's top. Defaults to `true`.
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
   *   describe('A white cylinder on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cylinder.
   *   cylinder();
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
   *   describe('A white cylinder on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cylinder.
   *   // Set its radius and height to 30.
   *   cylinder(30);
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
   *   describe('A white cylinder on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cylinder.
   *   // Set its radius to 30 and height to 50.
   *   cylinder(30, 50);
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
   *   describe('A white box on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cylinder.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 5.
   *   cylinder(30, 50, 5);
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
   *   describe('A white cylinder on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cylinder.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 24 and detailY to 2.
   *   cylinder(30, 50, 24, 2);
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
   *   describe('A white cylinder on a gray background. Its top is missing.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cylinder.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 24 and detailY to 1.
   *   // Don't draw its bottom.
   *   cylinder(30, 50, 24, 1, false);
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
   *   describe('A white cylinder on a gray background. Its top and bottom are missing.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cylinder.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 24 and detailY to 1.
   *   // Don't draw its bottom or top.
   *   cylinder(30, 50, 24, 1, false, false);
   * }
   * </code>
   * </div>
   */
  fn.cylinder = function(
    radius = 50,
    height = radius,
    detailX = 24,
    detailY = 1,
    bottomCap = true,
    topCap = true
  ) {
    this._assert3d('cylinder');
    // p5._validateParameters('cylinder', arguments);

    this._renderer.cylinder(radius, height, detailX, detailY, bottomCap, topCap);

    return this;
  };

  /**
   * Draws a cone.
   *
   * A cone is a 3D shape with triangular faces that connect a flat bottom to a
   * single point. Cones with few faces look like pyramids. Cones with many
   * faces have smooth surfaces.
   *
   * The first parameter, `radius`, is optional. If a `Number` is passed, as in
   * `cone(20)`, it sets the radius of the cone’s base. By default, `radius` is
   * 50.
   *
   * The second parameter, `height`, is also optional. If a `Number` is passed,
   * as in `cone(20, 30)`, it sets the cone’s height. By default, `height` is
   * set to the cone’s `radius`.
   *
   * The third parameter, `detailX`, is also optional. If a `Number` is passed,
   * as in `cone(20, 30, 5)`, it sets the number of edges used to form the
   * cone's base. Using more edges makes the base look more like a circle. By
   * default, `detailX` is 24.
   *
   * The fourth parameter, `detailY`, is also optional. If a `Number` is passed,
   * as in `cone(20, 30, 5, 7)`, it sets the number of triangle subdivisions to
   * use along the y-axis connecting the base to the tip. All 3D shapes are made
   * by connecting triangles to form their surfaces. By default, `detailY` is 1.
   *
   * The fifth parameter, `cap`, is also optional. If a `false` is passed, as
   * in `cone(20, 30, 5, 7, false)` the cone’s base won’t be drawn. By default,
   * `cap` is `true`.
   *
   * Note: `cone()` can only be used in WebGL mode.
   *
   * @method cone
   * @param  {Number}  [radius]  radius of the cone's base. Defaults to 50.
   * @param  {Number}  [height]  height of the cone. Defaults to the value of `radius`.
   * @param  {Integer} [detailX] number of edges used to draw the base. Defaults to 24.
   * @param  {Integer} [detailY] number of triangle subdivisions along the y-axis. Defaults to 1.
   * @param  {Boolean} [cap]     whether to draw the cone's base.  Defaults to `true`.
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
   *   describe('A white cone on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cone.
   *   cone();
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
   *   describe('A white cone on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cone.
   *   // Set its radius and height to 30.
   *   cone(30);
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
   *   describe('A white cone on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cone.
   *   // Set its radius to 30 and height to 50.
   *   cone(30, 50);
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
   *   describe('A white cone on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cone.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 5.
   *   cone(30, 50, 5);
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
   *   describe('A white pyramid on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cone.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 5.
   *   cone(30, 50, 5);
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
   *   describe('A white cone on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cone.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 24 and detailY to 2.
   *   cone(30, 50, 24, 2);
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
   *   describe('A white cone on a gray background. Its base is missing.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the cone.
   *   // Set its radius to 30 and height to 50.
   *   // Set its detailX to 24 and detailY to 1.
   *   // Don't draw its base.
   *   cone(30, 50, 24, 1, false);
   * }
   * </code>
   * </div>
   */
  fn.cone = function(
    radius = 50,
    height = radius,
    detailX = 24,
    detailY = 1,
    cap = true
  ) {
    this._assert3d('cone');
    // p5._validateParameters('cone', arguments);

    this._renderer.cone(radius, height, detailX, detailY, cap);

    return this;
  };

  /**
   * Draws an ellipsoid.
   *
   * An ellipsoid is a 3D shape with triangular faces that connect to form a
   * round surface. Ellipsoids with few faces look like crystals. Ellipsoids
   * with many faces have smooth surfaces and look like eggs. `ellipsoid()`
   * defines a shape by its radii. This is different from
   * <a href="#/p5/ellipse">ellipse()</a> which uses diameters
   * (width and height).
   *
   * The first parameter, `radiusX`, is optional. If a `Number` is passed, as in
   * `ellipsoid(20)`, it sets the radius of the ellipsoid along the x-axis. By
   * default, `radiusX` is 50.
   *
   * The second parameter, `radiusY`, is also optional. If a `Number` is passed,
   * as in `ellipsoid(20, 30)`, it sets the ellipsoid’s radius along the y-axis.
   * By default, `radiusY` is set to the ellipsoid’s `radiusX`.
   *
   * The third parameter, `radiusZ`, is also optional. If a `Number` is passed,
   * as in `ellipsoid(20, 30, 40)`, it sets the ellipsoid’s radius along the
   * z-axis. By default, `radiusZ` is set to the ellipsoid’s `radiusY`.
   *
   * The fourth parameter, `detailX`, is also optional. If a `Number` is passed,
   * as in `ellipsoid(20, 30, 40, 5)`, it sets the number of triangle
   * subdivisions to use along the x-axis. All 3D shapes are made by connecting
   * triangles to form their surfaces. By default, `detailX` is 24.
   *
   * The fifth parameter, `detailY`, is also optional. If a `Number` is passed,
   * as in `ellipsoid(20, 30, 40, 5, 7)`, it sets the number of triangle
   * subdivisions to use along the y-axis. All 3D shapes are made by connecting
   * triangles to form their surfaces. By default, `detailY` is 16.
   *
   * Note: `ellipsoid()` can only be used in WebGL mode.
   *
   * @method ellipsoid
   * @param  {Number} [radiusX]  radius of the ellipsoid along the x-axis. Defaults to 50.
   * @param  {Number} [radiusY]  radius of the ellipsoid along the y-axis. Defaults to `radiusX`.
   * @param  {Number} [radiusZ]  radius of the ellipsoid along the z-axis. Defaults to `radiusY`.
   * @param  {Integer} [detailX] number of triangle subdivisions along the x-axis. Defaults to 24.
   * @param  {Integer} [detailY] number of triangle subdivisions along the y-axis. Defaults to 16.
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
   *   describe('A white sphere on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the ellipsoid.
   *   // Set its radiusX to 30.
   *   ellipsoid(30);
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
   *   describe('A white ellipsoid on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the ellipsoid.
   *   // Set its radiusX to 30.
   *   // Set its radiusY to 40.
   *   ellipsoid(30, 40);
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
   *   describe('A white ellipsoid on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the ellipsoid.
   *   // Set its radiusX to 30.
   *   // Set its radiusY to 40.
   *   // Set its radiusZ to 50.
   *   ellipsoid(30, 40, 50);
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
   *   describe('A white ellipsoid on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the ellipsoid.
   *   // Set its radiusX to 30.
   *   // Set its radiusY to 40.
   *   // Set its radiusZ to 50.
   *   // Set its detailX to 4.
   *   ellipsoid(30, 40, 50, 4);
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
   *   describe('A white ellipsoid on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the ellipsoid.
   *   // Set its radiusX to 30.
   *   // Set its radiusY to 40.
   *   // Set its radiusZ to 50.
   *   // Set its detailX to 4.
   *   // Set its detailY to 3.
   *   ellipsoid(30, 40, 50, 4, 3);
   * }
   * </code>
   * </div>
   */
  fn.ellipsoid = function(
    radiusX = 50,
    radiusY = radiusX,
    radiusZ = radiusX,
    detailX = 24,
    detailY = 16
  ) {
    this._assert3d('ellipsoid');
    // p5._validateParameters('ellipsoid', arguments);

    this._renderer.ellipsoid(radiusX, radiusY, radiusZ, detailX, detailY);

    return this;
  };

  /**
   * Draws a torus.
   *
   * A torus is a 3D shape with triangular faces that connect to form a ring.
   * Toruses with few faces look flattened. Toruses with many faces have smooth
   * surfaces.
   *
   * The first parameter, `radius`, is optional. If a `Number` is passed, as in
   * `torus(30)`, it sets the radius of the ring. By default, `radius` is 50.
   *
   * The second parameter, `tubeRadius`, is also optional. If a `Number` is
   * passed, as in `torus(30, 15)`, it sets the radius of the tube. By default,
   * `tubeRadius` is 10.
   *
   * The third parameter, `detailX`, is also optional. If a `Number` is passed,
   * as in `torus(30, 15, 5)`, it sets the number of edges used to draw the hole
   * of the torus. Using more edges makes the hole look more like a circle. By
   * default, `detailX` is 24.
   *
   * The fourth parameter, `detailY`, is also optional. If a `Number` is passed,
   * as in `torus(30, 15, 5, 7)`, it sets the number of triangle subdivisions to
   * use while filling in the torus’ height. By default, `detailY` is 16.
   *
   * Note: `torus()` can only be used in WebGL mode.
   *
   * @method torus
   * @param  {Number} [radius]      radius of the torus. Defaults to 50.
   * @param  {Number} [tubeRadius]  radius of the tube. Defaults to 10.
   * @param  {Integer} [detailX]    number of edges that form the hole. Defaults to 24.
   * @param  {Integer} [detailY]    number of triangle subdivisions along the y-axis. Defaults to 16.
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
   *   describe('A white torus on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the torus.
   *   torus();
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
   *   describe('A white torus on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the torus.
   *   // Set its radius to 30.
   *   torus(30);
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
   *   describe('A white torus on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the torus.
   *   // Set its radius to 30 and tubeRadius to 15.
   *   torus(30, 15);
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
   *   describe('A white torus on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the torus.
   *   // Set its radius to 30 and tubeRadius to 15.
   *   // Set its detailX to 5.
   *   torus(30, 15, 5);
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
   *   describe('A white torus on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Enable orbiting with the mouse.
   *   orbitControl();
   *
   *   // Draw the torus.
   *   // Set its radius to 30 and tubeRadius to 15.
   *   // Set its detailX to 5.
   *   // Set its detailY to 3.
   *   torus(30, 15, 5, 3);
   * }
   * </code>
   * </div>
   */
  fn.torus = function(radius, tubeRadius, detailX, detailY) {
    this._assert3d('torus');
    // p5._validateParameters('torus', arguments);

    this._renderer.torus(radius, tubeRadius, detailX, detailY);

    return this;
  };

  ///////////////////////
  ///  2D primitives  ///
  ///////////////////////
  //
  // Note: Documentation is not generated on the p5.js website for functions on
  // the p5.RendererGL prototype.

  /**
   * Draws a point, a coordinate in space at the dimension of one pixel,
   * given x, y and z coordinates. The color of the point is determined
   * by the current stroke, while the point size is determined by current
   * stroke weight.
   * @private
   * @param {Number} x x-coordinate of point
   * @param {Number} y y-coordinate of point
   * @param {Number} z z-coordinate of point
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   * }
   *
   * function draw() {
   *   background(50);
   *   stroke(255);
   *   strokeWeight(4);
   *   point(25, 0);
   *   strokeWeight(3);
   *   point(-25, 0);
   *   strokeWeight(2);
   *   point(0, 25);
   *   strokeWeight(1);
   *   point(0, -25);
   * }
   * </code>
   * </div>
   */
  RendererGL.prototype.point = function(x, y, z = 0) {

    const _vertex = [];
    _vertex.push(new Vector(x, y, z));
    this._drawPoints(_vertex, this.buffers.point);

    return this;
  };

  RendererGL.prototype.triangle = function(args) {
    const x1 = args[0],
      y1 = args[1];
    const x2 = args[2],
      y2 = args[3];
    const x3 = args[4],
      y3 = args[5];

    const gid = 'tri';
    if (!this.geometryInHash(gid)) {
      const _triangle = function() {
        const vertices = [];
        vertices.push(new Vector(0, 0, 0));
        vertices.push(new Vector(1, 0, 0));
        vertices.push(new Vector(0, 1, 0));
        this.edges = [[0, 1], [1, 2], [2, 0]];
        this.vertices = vertices;
        this.faces = [[0, 1, 2]];
        this.uvs = [0, 0, 1, 0, 1, 1];
      };
      const triGeom = new Geometry(1, 1, _triangle, this);
      triGeom._edgesToVertices();
      triGeom.computeNormals();
      triGeom.gid = gid;
      this.geometryBufferCache.ensureCached(triGeom);
    }

    // only one triangle is cached, one point is at the origin, and the
    // two adjacent sides are tne unit vectors along the X & Y axes.
    //
    // this matrix multiplication transforms those two unit vectors
    // onto the required vector prior to rendering, and moves the
    // origin appropriately.
    const uModelMatrix = this.states.uModelMatrix.copy();
    try {
      // triangle orientation.
      const orientation = Math.sign(x1*y2-x2*y1 + x2*y3-x3*y2 + x3*y1-x1*y3);
      const mult = new Matrix([
        x2 - x1, y2 - y1, 0, 0, // the resulting unit X-axis
        x3 - x1, y3 - y1, 0, 0, // the resulting unit Y-axis
        0, 0, orientation, 0,   // the resulting unit Z-axis (Reflect the specified order of vertices)
        x1, y1, 0, 1            // the resulting origin
      ]).mult(this.states.uModelMatrix);

      this.states.setValue('uModelMatrix', mult);

      this._drawGeometry(this.geometryBufferCache.getGeometryByID(gid));
    } finally {
      this.states.setValue('uModelMatrix', uModelMatrix);
    }

    return this;
  };

  RendererGL.prototype.ellipse = function(args) {
    this.arc(
      args[0],
      args[1],
      args[2],
      args[3],
      0,
      constants.TWO_PI,
      constants.OPEN,
      args[4]
    );
  };

  RendererGL.prototype.arc = function(...args) {
    const x = args[0];
    const y = args[1];
    const width = args[2];
    const height = args[3];
    const start = args[4];
    const stop = args[5];
    const mode = args[6];
    const detail = args[7] || 25;

    let shape;
    let gid;

    // check if it is an ellipse or an arc
    if (Math.abs(stop - start) >= constants.TWO_PI) {
      shape = 'ellipse';
      gid = `${shape}|${detail}|`;
    } else {
      shape = 'arc';
      gid = `${shape}|${start}|${stop}|${mode}|${detail}|`;
    }

    if (!this.geometryInHash(gid)) {
      const _arc = function() {

        // if the start and stop angles are not the same, push vertices to the array
        if (start.toFixed(10) !== stop.toFixed(10)) {
          // if the mode specified is PIE or null, push the mid point of the arc in vertices
          if (mode === constants.PIE || typeof mode === 'undefined') {
            this.vertices.push(new Vector(0.5, 0.5, 0));
            this.uvs.push([0.5, 0.5]);
          }

          // vertices for the perimeter of the circle
          for (let i = 0; i <= detail; i++) {
            const u = i / detail;
            const theta = (stop - start) * u + start;

            const _x = 0.5 + Math.cos(theta) / 2;
            const _y = 0.5 + Math.sin(theta) / 2;

            this.vertices.push(new Vector(_x, _y, 0));
            this.uvs.push([_x, _y]);

            if (i < detail - 1) {
              this.faces.push([0, i + 1, i + 2]);
              this.edges.push([i + 1, i + 2]);
            }
          }

          // check the mode specified in order to push vertices and faces, different for each mode
          switch (mode) {
            case constants.PIE:
              this.faces.push([
                0,
                this.vertices.length - 2,
                this.vertices.length - 1
              ]);
              this.edges.push([0, 1]);
              this.edges.push([
                this.vertices.length - 2,
                this.vertices.length - 1
              ]);
              this.edges.push([0, this.vertices.length - 1]);
              break;

            case constants.CHORD:
              this.edges.push([0, 1]);
              this.edges.push([0, this.vertices.length - 1]);
              break;

            case constants.OPEN:
              this.edges.push([0, 1]);
              break;

            default:
              this.faces.push([
                0,
                this.vertices.length - 2,
                this.vertices.length - 1
              ]);
              this.edges.push([
                this.vertices.length - 2,
                this.vertices.length - 1
              ]);
          }
        }
      };

      const arcGeom = new Geometry(detail, 1, _arc, this);
      arcGeom.computeNormals();

      if (detail <= 50) {
        arcGeom._edgesToVertices(arcGeom);
      } else if (this.states.strokeColor) {
        console.log(
          `Cannot apply a stroke to an ${shape} with more than 50 detail`
        );
      }

      arcGeom.gid = gid;
      this.geometryBufferCache.ensureCached(arcGeom);
    }

    const uModelMatrix = this.states.uModelMatrix;
    this.states.setValue('uModelMatrix', this.states.uModelMatrix.clone());

    try {
      this.states.uModelMatrix.translate([x, y, 0]);
      this.states.uModelMatrix.scale(width, height, 1);

      this._drawGeometry(this.geometryBufferCache.getGeometryByID(gid));
    } finally {
      this.states.setValue('uModelMatrix', uModelMatrix);
    }

    return this;
  };

  RendererGL.prototype.rect = function(args) {
    const x = args[0];
    const y = args[1];
    const width = args[2];
    const height = args[3];

    if (typeof args[4] === 'undefined') {
      // Use the retained mode for drawing rectangle,
      // if args for rounding rectangle is not provided by user.
      const perPixelLighting = this._pInst._glAttributes.perPixelLighting;
      const detailX = args[4] || (perPixelLighting ? 1 : 24);
      const detailY = args[5] || (perPixelLighting ? 1 : 16);
      const gid = `rect|${detailX}|${detailY}`;
      if (!this.geometryInHash(gid)) {
        const _rect = function() {
          for (let i = 0; i <= this.detailY; i++) {
            const v = i / this.detailY;
            for (let j = 0; j <= this.detailX; j++) {
              const u = j / this.detailX;
              const p = new Vector(u, v, 0);
              this.vertices.push(p);
              this.uvs.push(u, v);
            }
          }
          // using stroke indices to avoid stroke over face(s) of rectangle
          if (detailX > 0 && detailY > 0) {
            this.edges = [
              [0, detailX],
              [detailX, (detailX + 1) * (detailY + 1) - 1],
              [(detailX + 1) * (detailY + 1) - 1, (detailX + 1) * detailY],
              [(detailX + 1) * detailY, 0]
            ];
          }
        };
        const rectGeom = new Geometry(detailX, detailY, _rect, this);
        rectGeom
          .computeFaces()
          .computeNormals()
          ._edgesToVertices();
        rectGeom.gid = gid;
        this.geometryBufferCache.ensureCached(rectGeom);
      }

      // only a single rectangle (of a given detail) is cached: a square with
      // opposite corners at (0,0) & (1,1).
      //
      // before rendering, this square is scaled & moved to the required location.
      const uModelMatrix = this.states.uModelMatrix;
      this.states.setValue('uModelMatrix', this.states.uModelMatrix.copy());
      try {
        this.states.uModelMatrix.translate([x, y, 0]);
        this.states.uModelMatrix.scale(width, height, 1);

        this._drawGeometry(this.geometryBufferCache.getGeometryByID(gid));
      } finally {
        this.states.setValue('uModelMatrix', uModelMatrix);
      }
    } else {
      // Use Immediate mode to round the rectangle corner,
      // if args for rounding corners is provided by user
      let tl = args[4];
      let tr = typeof args[5] === 'undefined' ? tl : args[5];
      let br = typeof args[6] === 'undefined' ? tr : args[6];
      let bl = typeof args[7] === 'undefined' ? br : args[7];

      let a = x;
      let b = y;
      let c = width;
      let d = height;

      c += a;
      d += b;

      if (a > c) {
        const temp = a;
        a = c;
        c = temp;
      }

      if (b > d) {
        const temp = b;
        b = d;
        d = temp;
      }

      const maxRounding = Math.min((c - a) / 2, (d - b) / 2);
      if (tl > maxRounding) tl = maxRounding;
      if (tr > maxRounding) tr = maxRounding;
      if (br > maxRounding) br = maxRounding;
      if (bl > maxRounding) bl = maxRounding;

      let x1 = a;
      let y1 = b;
      let x2 = c;
      let y2 = d;

      const prevMode = this.states.textureMode;
      this.states.setValue('textureMode', constants.NORMAL);
      const prevOrder = this.bezierOrder();
      this.bezierOrder(2);
      this.beginShape();
      const addUVs = (x, y) => [x, y, (x - x1)/width, (y - y1)/height];
      if (tr !== 0) {
        this.vertex(...addUVs(x2 - tr, y1));
        this.bezierVertex(...addUVs(x2, y1))
        this.bezierVertex(...addUVs(x2, y1 + tr));
      } else {
        this.vertex(...addUVs(x2, y1));
      }
      if (br !== 0) {
        this.vertex(...addUVs(x2, y2 - br));
        this.bezierVertex(...addUVs(x2, y2));
        this.bezierVertex(...addUVs(x2 - br, y2))
      } else {
        this.vertex(...addUVs(x2, y2));
      }
      if (bl !== 0) {
        this.vertex(...addUVs(x1 + bl, y2));
        this.bezierVertex(...addUVs(x1, y2));
        this.bezierVertex(...addUVs(x1, y2 - bl));
      } else {
        this.vertex(...addUVs(x1, y2));
      }
      if (tl !== 0) {
        this.vertex(...addUVs(x1, y1 + tl));
        this.bezierVertex(...addUVs(x1, y1));
        this.bezierVertex(...addUVs(x1 + tl, y1));
      } else {
        this.vertex(...addUVs(x1, y1));
      }

      this.endShape(constants.CLOSE);
      this.states.setValue('textureMode', prevMode);
      this.bezierOrder(prevOrder);
    }
    return this;
  };

  /* eslint-disable max-len */
  RendererGL.prototype.quad = function(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, detailX=2, detailY=2) {
    /* eslint-enable max-len */

    const gid =
      `quad|${x1}|${y1}|${z1}|${x2}|${y2}|${z2}|${x3}|${y3}|${z3}|${x4}|${y4}|${z4}|${detailX}|${detailY}`;

    if (!this.geometryInHash(gid)) {
      const quadGeom = new Geometry(detailX, detailY, function() {
        //algorithm adapted from c++ to js
        //https://stackoverflow.com/questions/16989181/whats-the-correct-way-to-draw-a-distorted-plane-in-opengl/16993202#16993202
        let xRes = 1.0 / (this.detailX - 1);
        let yRes = 1.0 / (this.detailY - 1);
        for (let y = 0; y < this.detailY; y++) {
          for (let x = 0; x < this.detailX; x++) {
            let pctx = x * xRes;
            let pcty = y * yRes;

            let linePt0x = (1 - pcty) * x1 + pcty * x4;
            let linePt0y = (1 - pcty) * y1 + pcty * y4;
            let linePt0z = (1 - pcty) * z1 + pcty * z4;
            let linePt1x = (1 - pcty) * x2 + pcty * x3;
            let linePt1y = (1 - pcty) * y2 + pcty * y3;
            let linePt1z = (1 - pcty) * z2 + pcty * z3;

            let ptx = (1 - pctx) * linePt0x + pctx * linePt1x;
            let pty = (1 - pctx) * linePt0y + pctx * linePt1y;
            let ptz = (1 - pctx) * linePt0z + pctx * linePt1z;

            this.vertices.push(new Vector(ptx, pty, ptz));
            this.uvs.push([pctx, pcty]);
          }
        }
      }, this);

      quadGeom.faces = [];
      for(let y = 0; y < detailY-1; y++){
        for(let x = 0; x < detailX-1; x++){
          let pt0 = x + y * detailX;
          let pt1 = (x + 1) + y * detailX;
          let pt2 = (x + 1) + (y + 1) * detailX;
          let pt3 = x + (y + 1) * detailX;
          quadGeom.faces.push([pt0, pt1, pt2]);
          quadGeom.faces.push([pt0, pt2, pt3]);
        }
      }
      quadGeom.computeNormals();
      quadGeom.edges.length = 0;
      const vertexOrder = [0, 2, 3, 1];
      for (let i = 0; i < vertexOrder.length; i++) {
        const startVertex = vertexOrder[i];
        const endVertex = vertexOrder[(i + 1) % vertexOrder.length];
        quadGeom.edges.push([startVertex, endVertex]);
      }
      quadGeom._edgesToVertices();
      quadGeom.gid = gid;
      this.geometryBufferCache.ensureCached(quadGeom);
    }
    this._drawGeometry(this.geometryBufferCache.getGeometryByID(gid));
    return this;
  };

  //this implementation of bezier curve
  //is based on Bernstein polynomial
  // pretier-ignore
  RendererGL.prototype.bezier = function(
    x1,
    y1,
    z1, // x2
    x2, // y2
    y2, // x3
    z2, // y3
    x3, // x4
    y3, // y4
    z3,
    x4,
    y4,
    z4
  ) {
    if (arguments.length === 8) {
      y4 = y3;
      x4 = x3;
      y3 = z2;
      x3 = y2;
      y2 = x2;
      x2 = z1;
      z1 = z2 = z3 = z4 = 0;
    }
    // TODO: handle quadratic?
    const prevOrder = this.bezierOrder();
    this.bezierOrder(3);
    this.beginShape();
    this.vertex(x1, y1, z1);
    this.bezierVertex(x2, y2, z2);
    this.bezierVertex(x3, y3, z3);
    this.bezierVertex(x4, y4, z4);
    this.endShape();
  };

  // pretier-ignore
  RendererGL.prototype.curve = function(
    x1,
    y1,
    z1, // x2
    x2, // y2
    y2, // x3
    z2, // y3
    x3, // x4
    y3, // y4
    z3,
    x4,
    y4,
    z4
  ) {
    if (arguments.length === 8) {
      x4 = x3;
      y4 = y3;
      x3 = y2;
      y3 = x2;
      x2 = z1;
      y2 = x2;
      z1 = z2 = z3 = z4 = 0;
    }
    this.beginShape();
    this.splineVertex(x1, y1, z1);
    this.splineVertex(x2, y2, z2);
    this.splineVertex(x3, y3, z3);
    this.splineVertex(x4, y4, z4);
    this.endShape();
  };

  /**
   * Draw a line given two points
   * @private
   * @param {Number} x0 x-coordinate of first vertex
   * @param {Number} y0 y-coordinate of first vertex
   * @param {Number} z0 z-coordinate of first vertex
   * @param {Number} x1 x-coordinate of second vertex
   * @param {Number} y1 y-coordinate of second vertex
   * @param {Number} z1 z-coordinate of second vertex
   * @chainable
   * @example
   * <div>
   * <code>
   * //draw a line
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   * }
   *
   * function draw() {
   *   background(200);
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   // Use fill instead of stroke to change the color of shape.
   *   fill(255, 0, 0);
   *   line(10, 10, 0, 60, 60, 20);
   * }
   * </code>
   * </div>
   */
  RendererGL.prototype.line = function(...args) {
    if (args.length === 6) {
      // TODO shapes refactor
      this.beginShape(constants.LINES);
      this.vertex(args[0], args[1], args[2]);
      this.vertex(args[3], args[4], args[5]);
      this.endShape();
    } else if (args.length === 4) {
      this.beginShape(constants.LINES);
      this.vertex(args[0], args[1], 0);
      this.vertex(args[2], args[3], 0);
      this.endShape();
    }
    return this;
  };

  RendererGL.prototype.image = function(
    img,
    sx,
    sy,
    sWidth,
    sHeight,
    dx,
    dy,
    dWidth,
    dHeight
  ) {
    // console.log(arguments);
    if (this._isErasing) {
      this.blendMode(this._cachedBlendMode);
    }

    this.push();
    this.noLights();
    this.states.setValue('strokeColor', null);

    this.texture(img);
    this.states.setValue('textureMode', constants.NORMAL);

    let u0 = 0;
    if (sx <= img.width) {
      u0 = sx / img.width;
    }

    let u1 = 1;
    if (sx + sWidth <= img.width) {
      u1 = (sx + sWidth) / img.width;
    }

    let v0 = 0;
    if (sy <= img.height) {
      v0 = sy / img.height;
    }

    let v1 = 1;
    if (sy + sHeight <= img.height) {
      v1 = (sy + sHeight) / img.height;
    }

    this._drawingImage = true;
    this.beginShape();
    this.vertex(dx, dy, 0, u0, v0);
    this.vertex(dx + dWidth, dy, 0, u1, v0);
    this.vertex(dx + dWidth, dy + dHeight, 0, u1, v1);
    this.vertex(dx, dy + dHeight, 0, u0, v1);
    this.endShape(constants.CLOSE);
    this._drawingImage = false;

    this.pop();

    if (this._isErasing) {
      this.blendMode(constants.REMOVE);
    }
  };

  ///////////////////////
  ///  3D primitives  ///
  ///////////////////////
  /**
   * @private
   * Helper function for creating both cones and cylinders
   * Will only generate well-defined geometry when bottomRadius, height > 0
   * and topRadius >= 0
   * If topRadius == 0, topCap should be false
   */
  const _truncatedCone = function(
    bottomRadius,
    topRadius,
    height,
    detailX,
    detailY,
    bottomCap,
    topCap
  ) {
    bottomRadius = bottomRadius <= 0 ? 1 : bottomRadius;
    topRadius = topRadius < 0 ? 0 : topRadius;
    height = height <= 0 ? bottomRadius : height;
    detailX = detailX < 3 ? 3 : detailX;
    detailY = detailY < 1 ? 1 : detailY;
    bottomCap = bottomCap === undefined ? true : bottomCap;
    topCap = topCap === undefined ? topRadius !== 0 : topCap;
    const start = bottomCap ? -2 : 0;
    const end = detailY + (topCap ? 2 : 0);
    //ensure constant slant for interior vertex normals
    const slant = Math.atan2(bottomRadius - topRadius, height);
    const sinSlant = Math.sin(slant);
    const cosSlant = Math.cos(slant);
    let yy, ii, jj;
    for (yy = start; yy <= end; ++yy) {
      let v = yy / detailY;
      let y = height * v;
      let ringRadius;
      if (yy < 0) {
        //for the bottomCap edge
        y = 0;
        v = 0;
        ringRadius = bottomRadius;
      } else if (yy > detailY) {
        //for the topCap edge
        y = height;
        v = 1;
        ringRadius = topRadius;
      } else {
        //for the middle
        ringRadius = bottomRadius + (topRadius - bottomRadius) * v;
      }
      if (yy === -2 || yy === detailY + 2) {
        //center of bottom or top caps
        ringRadius = 0;
      }

      y -= height / 2; //shift coordiate origin to the center of object
      for (ii = 0; ii < detailX; ++ii) {
        const u = ii / (detailX - 1);
        const ur = 2 * Math.PI * u;
        const sur = Math.sin(ur);
        const cur = Math.cos(ur);

        //VERTICES
        this.vertices.push(new Vector(sur * ringRadius, y, cur * ringRadius));

        //VERTEX NORMALS
        let vertexNormal;
        if (yy < 0) {
          vertexNormal = new Vector(0, -1, 0);
        } else if (yy > detailY && topRadius) {
          vertexNormal = new Vector(0, 1, 0);
        } else {
          vertexNormal = new Vector(sur * cosSlant, sinSlant, cur * cosSlant);
        }
        this.vertexNormals.push(vertexNormal);
        //UVs
        this.uvs.push(u, v);
      }
    }

    let startIndex = 0;
    if (bottomCap) {
      for (jj = 0; jj < detailX; ++jj) {
        const nextjj = (jj + 1) % detailX;
        this.faces.push([
          startIndex + jj,
          startIndex + detailX + nextjj,
          startIndex + detailX + jj
        ]);
      }
      startIndex += detailX * 2;
    }
    for (yy = 0; yy < detailY; ++yy) {
      for (ii = 0; ii < detailX; ++ii) {
        const nextii = (ii + 1) % detailX;
        this.faces.push([
          startIndex + ii,
          startIndex + nextii,
          startIndex + detailX + nextii
        ]);
        this.faces.push([
          startIndex + ii,
          startIndex + detailX + nextii,
          startIndex + detailX + ii
        ]);
      }
      startIndex += detailX;
    }
    if (topCap) {
      startIndex += detailX;
      for (ii = 0; ii < detailX; ++ii) {
        this.faces.push([
          startIndex + ii,
          startIndex + (ii + 1) % detailX,
          startIndex + detailX
        ]);
      }
    }
  };

  RendererGL.prototype.plane = function(
    width = 50,
    height = width,
    detailX = 1,
    detailY = 1
  ) {
    const gid = `plane|${detailX}|${detailY}`;

    if (!this.geometryInHash(gid)) {
      const _plane = function() {
        let u, v, p;
        for (let i = 0; i <= this.detailY; i++) {
          v = i / this.detailY;
          for (let j = 0; j <= this.detailX; j++) {
            u = j / this.detailX;
            p = new Vector(u - 0.5, v - 0.5, 0);
            this.vertices.push(p);
            this.uvs.push(u, v);
          }
        }
      };
      const planeGeom = new Geometry(detailX, detailY, _plane, this);
      planeGeom.computeFaces().computeNormals();
      if (detailX <= 1 && detailY <= 1) {
        planeGeom._makeTriangleEdges()._edgesToVertices();
      } else if (this.states.strokeColor) {
        console.log(
          'Cannot draw stroke on plane objects with more' +
          ' than 1 detailX or 1 detailY'
        );
      }
      planeGeom.gid = gid;
      this.geometryBufferCache.ensureCached(planeGeom);
    }

    this._drawGeometryScaled(this.geometryBufferCache.getGeometryByID(gid), width, height, 1);
  }

  RendererGL.prototype.box = function(
    width = 50,
    height = width,
    depth = height,
    detailX,
    detailY
  ){
    const perPixelLighting =
      this.attributes && this.attributes.perPixelLighting;
    if (typeof detailX === 'undefined') {
      detailX = perPixelLighting ? 1 : 4;
    }
    if (typeof detailY === 'undefined') {
      detailY = perPixelLighting ? 1 : 4;
    }

    const gid = `box|${detailX}|${detailY}`;
    if (!this.geometryInHash(gid)) {
      const _box = function() {
        const cubeIndices = [
          [0, 4, 2, 6], // -1, 0, 0],// -x
          [1, 3, 5, 7], // +1, 0, 0],// +x
          [0, 1, 4, 5], // 0, -1, 0],// -y
          [2, 6, 3, 7], // 0, +1, 0],// +y
          [0, 2, 1, 3], // 0, 0, -1],// -z
          [4, 5, 6, 7] // 0, 0, +1] // +z
        ];
        //using custom edges
        //to avoid diagonal stroke lines across face of box
        this.edges = [
          [0, 1],
          [1, 3],
          [3, 2],
          [6, 7],
          [8, 9],
          [9, 11],
          [14, 15],
          [16, 17],
          [17, 19],
          [18, 19],
          [20, 21],
          [22, 23]
        ];

        cubeIndices.forEach((cubeIndex, i) => {
          const v = i * 4;
          for (let j = 0; j < 4; j++) {
            const d = cubeIndex[j];
            //inspired by lightgl:
            //https://github.com/evanw/lightgl.js
            //octants:https://en.wikipedia.org/wiki/Octant_(solid_geometry)
            const octant = new Vector(
              ((d & 1) * 2 - 1) / 2,
              ((d & 2) - 1) / 2,
              ((d & 4) / 2 - 1) / 2
            );
            this.vertices.push(octant);
            this.uvs.push(j & 1, (j & 2) / 2);
          }
          this.faces.push([v, v + 1, v + 2]);
          this.faces.push([v + 2, v + 1, v + 3]);
        });
      };
      const boxGeom = new Geometry(detailX, detailY, _box, this);
      boxGeom.computeNormals();
      if (detailX <= 4 && detailY <= 4) {
        boxGeom._edgesToVertices();
      } else if (this.states.strokeColor) {
        console.log(
          'Cannot draw stroke on box objects with more' +
          ' than 4 detailX or 4 detailY'
        );
      }
      //initialize our geometry buffer with
      //the key val pair:
      //geometry Id, Geom object
      boxGeom.gid = gid;
      this.geometryBufferCache.ensureCached(boxGeom);
    }
    this._drawGeometryScaled(this.geometryBufferCache.getGeometryByID(gid), width, height, depth);
  }

  RendererGL.prototype.sphere = function(
    radius = 50,
    detailX = 24,
    detailY = 16
  ) {
    this.ellipsoid(radius, radius, radius, detailX, detailY);
  }

  RendererGL.prototype.ellipsoid = function(
    radiusX = 50,
    radiusY = radiusX,
    radiusZ = radiusX,
    detailX = 24,
    detailY = 16
  ) {
    const gid = `ellipsoid|${detailX}|${detailY}`;

    if (!this.geometryInHash(gid)) {
      const _ellipsoid = function() {
        for (let i = 0; i <= this.detailY; i++) {
          const v = i / this.detailY;
          const phi = Math.PI * v - Math.PI / 2;
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);

          for (let j = 0; j <= this.detailX; j++) {
            const u = j / this.detailX;
            const theta = 2 * Math.PI * u;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);
            const p = new p5.Vector(cosPhi * sinTheta, sinPhi, cosPhi * cosTheta);
            this.vertices.push(p);
            this.vertexNormals.push(p);
            this.uvs.push(u, v);
          }
        }
      };
      const ellipsoidGeom = new Geometry(detailX, detailY, _ellipsoid, this);
      ellipsoidGeom.computeFaces();
      if (detailX <= 24 && detailY <= 24) {
        ellipsoidGeom._makeTriangleEdges()._edgesToVertices();
      } else if (this.states.strokeColor) {
        console.log(
          'Cannot draw stroke on ellipsoids with more' +
          ' than 24 detailX or 24 detailY'
        );
      }
      ellipsoidGeom.gid = gid;
      this.geometryBufferCache.ensureCached(ellipsoidGeom);
    }

    this._drawGeometryScaled(this.geometryBufferCache.getGeometryByID(gid), radiusX, radiusY, radiusZ);
  }

  RendererGL.prototype.cylinder = function(
    radius = 50,
    height = radius,
    detailX = 24,
    detailY = 1,
    bottomCap = true,
    topCap = true
  ) {
    const gid = `cylinder|${detailX}|${detailY}|${bottomCap}|${topCap}`;
    if (!this.geometryInHash(gid)) {
      const cylinderGeom = new p5.Geometry(detailX, detailY, function() {
        _truncatedCone.call(
          this,
          1,
          1,
          1,
          detailX,
          detailY,
          bottomCap,
          topCap
        );
      }, this);
      // normals are computed in call to _truncatedCone
      if (detailX <= 24 && detailY <= 16) {
        cylinderGeom._makeTriangleEdges()._edgesToVertices();
      } else if (this.states.strokeColor) {
        console.log(
          'Cannot draw stroke on cylinder objects with more' +
          ' than 24 detailX or 16 detailY'
        );
      }
      cylinderGeom.gid = gid;
      this.geometryBufferCache.ensureCached(cylinderGeom);
    }

    this._drawGeometryScaled(this.geometryBufferCache.getGeometryByID(gid), radius, height, radius);
  }

  RendererGL.prototype.cone = function(
    radius = 50,
    height = radius,
    detailX = 24,
    detailY = 1,
    cap = true
  ) {
    const gid = `cone|${detailX}|${detailY}|${cap}`;
    if (!this.geometryInHash(gid)) {
      const coneGeom = new Geometry(detailX, detailY, function() {
        _truncatedCone.call(
          this,
          1,
          0,
          1,
          detailX,
          detailY,
          cap,
          false
        );
      }, this);
      if (detailX <= 24 && detailY <= 16) {
        coneGeom._makeTriangleEdges()._edgesToVertices();
      } else if (this.states.strokeColor) {
        console.log(
          'Cannot draw stroke on cone objects with more' +
          ' than 24 detailX or 16 detailY'
        );
      }
      coneGeom.gid = gid;
      this.geometryBufferCache.ensureCached(coneGeom);
    }

    this._drawGeometryScaled(this.geometryBufferCache.getGeometryByID(gid), radius, height, radius);
  }

  RendererGL.prototype.torus = function(
    radius = 50,
    tubeRadius = 10,
    detailX = 24,
    detailY = 16
  ) {
    if (radius === 0) {
      return; // nothing to draw
    }

    if (tubeRadius === 0) {
      return; // nothing to draw
    }

    const tubeRatio = (tubeRadius / radius).toPrecision(4);
    const gid = `torus|${tubeRatio}|${detailX}|${detailY}`;

    if (!this.geometryInHash(gid)) {
      const _torus = function() {
        for (let i = 0; i <= this.detailY; i++) {
          const v = i / this.detailY;
          const phi = 2 * Math.PI * v;
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);
          const r = 1 + tubeRatio * cosPhi;

          for (let j = 0; j <= this.detailX; j++) {
            const u = j / this.detailX;
            const theta = 2 * Math.PI * u;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            const p = new Vector(
              r * cosTheta,
              r * sinTheta,
              tubeRatio * sinPhi
            );

            const n = new Vector(cosPhi * cosTheta, cosPhi * sinTheta, sinPhi);

            this.vertices.push(p);
            this.vertexNormals.push(n);
            this.uvs.push(u, v);
          }
        }
      };
      const torusGeom = new Geometry(detailX, detailY, _torus, this);
      torusGeom.computeFaces();
      if (detailX <= 24 && detailY <= 16) {
        torusGeom._makeTriangleEdges()._edgesToVertices();
      } else if (this.states.strokeColor) {
        console.log(
          'Cannot draw strokes on torus object with more' +
          ' than 24 detailX or 16 detailY'
        );
      }
      torusGeom.gid = gid;
      this.geometryBufferCache.ensureCached(torusGeom);
    }
    this._drawGeometryScaled(this.geometryBufferCache.getGeometryByID(gid), radius, radius, radius);
  }

  /**
   * Sets the number of segments used to draw spline curves in WebGL mode.
   *
   * In WebGL mode, smooth shapes are drawn using many flat segments. Adding
   * more flat segments makes shapes appear smoother.
   *
   * The parameter, `detail`, is the density of segments to use while drawing a
   * spline curve.
   *
   * Note: `curveDetail()` has no effect in 2D mode.
   *
   * @method curveDetail
   * @param {Number} resolution number of segments to use. Default is 1/4
   * @chainable
   *
   * @example
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Set the curveDetail() to 0.5
   *   curveDetail(0.5);
   * 
   *   // Do not show all the vertices
   *   splineProperty('ends', EXCLUDE)
   *
   *   // Draw a black spline curve.
   *   noFill();
   *   strokeWeight(1);
   *   stroke(0);
   *   spline(-45, -24, 0, 23, -26, 0, 23, 11, 0, -35, 15, 0);
   *
   *   // Draw red spline curves from the anchor points to the control points.
   *   spline(255, 0, 0);
   *   spline(-45, -24, 0, -45, -24, 0, 23, -26, 0, 23, 11, 0);
   *   spline(23, -26, 0, 23, 11, 0, -35, 15, 0, -35, 15, 0);
   *
   *   // Draw the anchor points in black.
   *   strokeWeight(5);
   *   stroke(0);
   *   point(23, -26);
   *   point(23, 11);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(-45, -24);
   *   point(-35, 15);
   *
   *   describe(
   *     'A gray square with a jagged curve drawn in three segments. The curve is a sideways U shape with red segments on top and bottom, and a black segment on the right. The endpoints of all the segments are marked with dots.'
   *   );
   * }
   * </code>
   * </div>
   */
  fn.curveDetail = function(d) {
    if (!(this._renderer instanceof RendererGL)) {
      throw new Error(
        'curveDetail() only works in WebGL mode. Did you mean to call createCanvas(width, height, WEBGL)?'
      );
    }
    return this._renderer.curveDetail(d);
  };
}

export default primitives3D;

if(typeof p5 !== 'undefined'){
  primitives3D(p5, p5.prototype);
}
