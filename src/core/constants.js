/**
 * @module Constants
 * @submodule Constants
 * @for p5
 */

const _PI = Math.PI;

/**
 * Version of this p5.js.
 * @property {String} VERSION
 * @final
 */
export const VERSION =
  'VERSION_CONST_WILL_BE_REPLACED_BY_BROWSERIFY_BUILD_PROCESS';

// GRAPHICS RENDERER
/**
 * The default, two-dimensional renderer.
 * @property {String} P2D
 * @final
 */
export const P2D = 'p2d';
/**
 * One of the two render modes in p5.js, used for computationally intensive tasks like 3D rendering and shaders.
 *
 * `WEBGL` differs from the default <a href="/reference/p5/P2D">`P2D`</a> renderer in the following ways:
 *
 * - **Coordinate System** - When drawing in `WEBGL` mode, the origin point (0,0,0) is located at the center of the screen, not the top-left corner. See <a href="https://p5js.org/tutorials/coordinates-and-transformations/">the tutorial page about coordinates and transformations</a>.
 * - **3D Shapes** - `WEBGL` mode can be used to draw 3-dimensional shapes like <a href="#/p5/box">box()</a>, <a href="#/p5/sphere">sphere()</a>, <a href="#/p5/cone">cone()</a>, and <a href="https://p5js.org/reference/#3D%20Primitives">more</a>. See <a href="https://p5js.org/tutorials/custom-geometry/">the tutorial page about custom geometry</a> to make more complex objects.
 * - **Shape Detail** - When drawing in `WEBGL` mode, you can specify how smooth curves should be drawn by using a `detail` parameter. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#3d-primitives-shapes">the wiki section about shapes</a> for a more information and an example.
 * - **Textures** - A texture is like a skin that wraps onto a shape. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#textures">the wiki section about textures</a> for examples of mapping images onto surfaces with textures.
 * - **Materials and Lighting** - `WEBGL` offers different types of lights like <a href="#/p5/ambientLight">ambientLight()</a> to place around a scene. Materials like <a href="#/p5/specularMaterial">specularMaterial()</a> reflect the lighting to convey shape and depth. See <a href="https://p5js.org/tutorials/lights-camera-materials/">the tutorial page for styling and appearance</a> to experiment with different combinations.
 * - **Camera** - The viewport of a `WEBGL` sketch can be adjusted by changing camera attributes. See <a href="https://p5js.org/tutorials/lights-camera-materials#camera-and-view">the tutorial page section about cameras</a> for an explanation of camera controls.
 * - **Text** - `WEBGL` requires opentype/truetype font files to be preloaded using <a href="#/p5/loadFont">loadFont()</a>. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#text">the wiki section about text</a> for details, along with a workaround.
 * - **Shaders** - Shaders are hardware accelerated programs that can be used for a variety of effects and graphics. See the <a href="https://p5js.org/tutorials/intro-to-shaders/">introduction to shaders</a> to get started with shaders in p5.js.
 * - **Graphics Acceleration** - `WEBGL` mode uses the graphics card instead of the CPU, so it may help boost the performance of your sketch (example: drawing more shapes on the screen at once).
 *
 * To learn more about WEBGL mode, check out <a href="https://p5js.org/tutorials/#webgl">all the interactive WEBGL tutorials</a> in the "Tutorials" section of this website, or read the wiki article <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5">"Getting started with WebGL in p5"</a>.
 *
 * @property {String} WEBGL
 * @final
 */
export const WEBGL = 'webgl';
/**
 * One of the two possible values of a WebGL canvas (either WEBGL or WEBGL2),
 * which can be used to determine what capabilities the rendering environment
 * has.
 * @property {String} WEBGL2
 * @final
 */
export const WEBGL2 = 'webgl2';

// ENVIRONMENT
/**
 * @property {String} ARROW
 * @final
 */
export const ARROW = 'default';
/**
 * @property {String} CROSS
 * @final
 */
export const CROSS = 'crosshair';
/**
 * @property {String} HAND
 * @final
 */
export const HAND = 'pointer';
/**
 * @property {String} MOVE
 * @final
 */
export const MOVE = 'move';
/**
 * @property {String} TEXT
 * @final
 */
export const TEXT = 'text';
/**
 * @property {String} WAIT
 * @final
 */
export const WAIT = 'wait';

// TRIGONOMETRY

/**
 * A `Number` constant that's approximately 1.5708.
 *
 * `HALF_PI` is half the value of the mathematical constant π. It's useful for
 * many tasks that involve rotation and oscillation. For example, calling
 * `rotate(HALF_PI)` rotates the coordinate system `HALF_PI` radians, which is
 * a quarter turn (90˚).
 *
 * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
 * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
 *
 * @property {Number} HALF_PI
 * @final
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw an arc from 0 to HALF_PI.
 *   arc(50, 50, 80, 80, 0, HALF_PI);
 *
 *   describe('The bottom-right quarter of a circle drawn in white on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw a line.
 *   line(0, 0, 40, 0);
 *
 *   // Rotate a quarter turn.
 *   rotate(HALF_PI);
 *
 *   // Draw the same line, rotated.
 *   line(0, 0, 40, 0);
 *
 *   describe('Two black lines on a gray background. One line extends from the center to the right. The other line extends from the center to the bottom.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A red circle and a blue circle oscillate from left to right on a gray background. The red circle appears to chase the blue circle.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Calculate the x-coordinates.
 *   let x1 = 40 * sin(frameCount * 0.05);
 *   let x2 = 40 * sin(frameCount * 0.05 + HALF_PI);
 *
 *   // Style the oscillators.
 *   noStroke();
 *
 *   // Draw the red oscillator.
 *   fill(255, 0, 0);
 *   circle(x1, 0, 20);
 *
 *   // Draw the blue oscillator.
 *   fill(0, 0, 255);
 *   circle(x2, 0, 20);
 * }
 * </code>
 * </div>
 */
export const HALF_PI = _PI / 2;

/**
 * A `Number` constant that's approximately 3.1416.
 *
 * `PI` is the mathematical constant π. It's useful for many tasks that
 * involve rotation and oscillation. For example, calling `rotate(PI)` rotates
 * the coordinate system `PI` radians, which is a half turn (180˚).
 *
 * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
 * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
 *
 * @property {Number} PI
 * @final
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw an arc from 0 to PI.
 *   arc(50, 50, 80, 80, 0, PI);
 *
 *   describe('The bottom half of a circle drawn in white on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw a line.
 *   line(0, 0, 40, 0);
 *
 *   // Rotate a half turn.
 *   rotate(PI);
 *
 *   // Draw the same line, rotated.
 *   line(0, 0, 40, 0);
 *
 *   describe('A horizontal black line on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A red circle and a blue circle oscillate from left to right on a gray background. The circles drift apart, then meet in the middle, over and over again.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Calculate the x-coordinates.
 *   let x1 = 40 * sin(frameCount * 0.05);
 *   let x2 = 40 * sin(frameCount * 0.05 + PI);
 *
 *   // Style the oscillators.
 *   noStroke();
 *
 *   // Draw the red oscillator.
 *   fill(255, 0, 0);
 *   circle(x1, 0, 20);
 *
 *   // Draw the blue oscillator.
 *   fill(0, 0, 255);
 *   circle(x2, 0, 20);
 * }
 * </code>
 * </div>
 */
export const PI = _PI;

/**
 * A `Number` constant that's approximately 0.7854.
 *
 * `QUARTER_PI` is one-fourth the value of the mathematical constant π. It's
 * useful for many tasks that involve rotation and oscillation. For example,
 * calling `rotate(QUARTER_PI)` rotates the coordinate system `QUARTER_PI`
 * radians, which is an eighth of a turn (45˚).
 *
 * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
 * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
 *
 * @property {Number} QUARTER_PI
 * @final
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw an arc from 0 to QUARTER_PI.
 *   arc(50, 50, 80, 80, 0, QUARTER_PI);
 *
 *   describe('A one-eighth slice of a circle drawn in white on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw a line.
 *   line(0, 0, 40, 0);
 *
 *   // Rotate an eighth turn.
 *   rotate(QUARTER_PI);
 *
 *   // Draw the same line, rotated.
 *   line(0, 0, 40, 0);
 *
 *   describe('Two black lines that form a "V" opening towards the bottom-right corner of a gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A red circle and a blue circle oscillate from left to right on a gray background. The red circle appears to chase the blue circle.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Calculate the x-coordinates.
 *   let x1 = 40 * sin(frameCount * 0.05);
 *   let x2 = 40 * sin(frameCount * 0.05 + QUARTER_PI);
 *
 *   // Style the oscillators.
 *   noStroke();
 *
 *   // Draw the red oscillator.
 *   fill(255, 0, 0);
 *   circle(x1, 0, 20);
 *
 *   // Draw the blue oscillator.
 *   fill(0, 0, 255);
 *   circle(x2, 0, 20);
 * }
 * </code>
 * </div>
 */
export const QUARTER_PI = _PI / 4;

/**
 * A `Number` constant that's approximately 6.2382.
 *
 * `TAU` is twice the value of the mathematical constant π. It's useful for
 * many tasks that involve rotation and oscillation. For example, calling
 * `rotate(TAU)` rotates the coordinate system `TAU` radians, which is one
 * full turn (360˚). `TAU` and `TWO_PI` are equal.
 *
 * Note: `TAU` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
 * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
 *
 * @property {Number} TAU
 * @final
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw an arc from 0 to TAU.
 *   arc(50, 50, 80, 80, 0, TAU);
 *
 *   describe('A white circle drawn on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw a line.
 *   line(0, 0, 40, 0);
 *
 *   // Rotate a full turn.
 *   rotate(TAU);
 *
 *   // Style the second line.
 *   strokeWeight(5);
 *
 *   // Draw the same line, shorter and rotated.
 *   line(0, 0, 20, 0);
 *
 *   describe(
 *     'Two horizontal black lines on a gray background. A thick line extends from the center toward the right. A thin line extends from the end of the thick line.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A red circle with a blue center oscillates from left to right on a gray background.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Calculate the x-coordinates.
 *   let x1 = 40 * sin(frameCount * 0.05);
 *   let x2 = 40 * sin(frameCount * 0.05 + TAU);
 *
 *   // Style the oscillators.
 *   noStroke();
 *
 *   // Draw the red oscillator.
 *   fill(255, 0, 0);
 *   circle(x1, 0, 20);
 *
 *   // Draw the blue oscillator, smaller.
 *   fill(0, 0, 255);
 *   circle(x2, 0, 10);
 * }
 * </code>
 * </div>
 */
export const TAU = _PI * 2;

/**
 * A `Number` constant that's approximately 6.2382.
 *
 * `TWO_PI` is twice the value of the mathematical constant π. It's useful for
 * many tasks that involve rotation and oscillation. For example, calling
 * `rotate(TWO_PI)` rotates the coordinate system `TWO_PI` radians, which is
 * one full turn (360˚). `TWO_PI` and `TAU` are equal.
 *
 * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
 * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
 *
 * @property {Number} TWO_PI
 * @final
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw an arc from 0 to TWO_PI.
 *   arc(50, 50, 80, 80, 0, TWO_PI);
 *
 *   describe('A white circle drawn on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw a line.
 *   line(0, 0, 40, 0);
 *
 *   // Rotate a full turn.
 *   rotate(TWO_PI);
 *
 *   // Style the second line.
 *   strokeWeight(5);
 *
 *   // Draw the same line, shorter and rotated.
 *   line(0, 0, 20, 0);
 *
 *   describe(
 *     'Two horizontal black lines on a gray background. A thick line extends from the center toward the right. A thin line extends from the end of the thick line.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A red circle with a blue center oscillates from left to right on a gray background.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Calculate the x-coordinates.
 *   let x1 = 40 * sin(frameCount * 0.05);
 *   let x2 = 40 * sin(frameCount * 0.05 + TWO_PI);
 *
 *   // Style the oscillators.
 *   noStroke();
 *
 *   // Draw the red oscillator.
 *   fill(255, 0, 0);
 *   circle(x1, 0, 20);
 *
 *   // Draw the blue oscillator, smaller.
 *   fill(0, 0, 255);
 *   circle(x2, 0, 10);
 * }
 * </code>
 * </div>
 */
export const TWO_PI = _PI * 2;

/**
 * A `String` constant that's used to set the
 * <a href="#/p5/angleMode">angleMode()</a>.
 *
 * By default, functions such as <a href="#/p5/rotate">rotate()</a> and
 * <a href="#/p5/sin">sin()</a> expect angles measured in units of radians.
 * Calling `angleMode(DEGREES)` ensures that angles are measured in units of
 * degrees.
 *
 * Note: `TWO_PI` radians equals 360˚.
 *
 * @property {String} DEGREES
 * @final
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw a red arc from 0 to HALF_PI radians.
 *   fill(255, 0, 0);
 *   arc(50, 50, 80, 80, 0, HALF_PI);
 *
 *   // Use degrees.
 *   angleMode(DEGREES);
 *
 *   // Draw a blue arc from 90˚ to 180˚.
 *   fill(0, 0, 255);
 *   arc(50, 50, 80, 80, 90, 180);
 *
 *   describe('The bottom half of a circle drawn on a gray background. The bottom-right quarter is red. The bottom-left quarter is blue.');
 * }
 * </code>
 * </div>
 */
export const DEGREES = 'degrees';

/**
 * A `String` constant that's used to set the
 * <a href="#/p5/angleMode">angleMode()</a>.
 *
 * By default, functions such as <a href="#/p5/rotate">rotate()</a> and
 * <a href="#/p5/sin">sin()</a> expect angles measured in units of radians.
 * Calling `angleMode(RADIANS)` ensures that angles are measured in units of
 * radians. Doing so can be useful if the
 * <a href="#/p5/angleMode">angleMode()</a> has been set to
 * <a href="#/p5/DEGREES">DEGREES</a>.
 *
 * Note: `TWO_PI` radians equals 360˚.
 *
 * @property {String} RADIANS
 * @final
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Use degrees.
 *   angleMode(DEGREES);
 *
 *   // Draw a red arc from 0˚ to 90˚.
 *   fill(255, 0, 0);
 *   arc(50, 50, 80, 80, 0, 90);
 *
 *   // Use radians.
 *   angleMode(RADIANS);
 *
 *   // Draw a blue arc from HALF_PI to PI.
 *   fill(0, 0, 255);
 *   arc(50, 50, 80, 80, HALF_PI, PI);
 *
 *   describe('The bottom half of a circle drawn on a gray background. The bottom-right quarter is red. The bottom-left quarter is blue.');
 * }
 * </code>
 * </div>
 */

/**
 * @property {Number} E (Euler's Number)
 * @final
 * @default 2.718281828459045
 * @description Euler’s number, the base of natural logarithms.
 * It is approximately equal to 2.71828 and is used in many
 * mathematical and exponential calculations.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Calculate exponential growth using E
 *   let growthRate = 0.5;
 *   let result = E ** growthRate;
 *
 *   // Display E and the calculation
 *   fill(0);
 *   textAlign(CENTER, CENTER);
 *   textSize(12);
 *   text('E = ' + E.toFixed(5), 50, 30);
 *   text('e^0.5 = ' + result.toFixed(5), 50, 50);
 *
 *   // Visualize exponential curve
 *   stroke(0, 100, 255);
 *   strokeWeight(2);
 *   noFill();
 *   beginShape();
 *   for (let x = 0; x < width; x++) {
 *     let t = map(x, 0, width, 0, 2);
 *     let y = map(E ** t, 1, E ** 2, height - 10, 60);
 *     vertex(x, y);
 *   }
 *   endShape();
 *
 *   describe('A gray canvas showing the value of E (2.71828) and e^0.5, with a blue exponential growth curve below the text.');
 * }
 * </code>
 * </div>
 */

export const RADIANS = 'radians';
export const DEG_TO_RAD = _PI / 180.0;
export const RAD_TO_DEG = 180.0 / _PI;
export const E = Math.E;

// SHAPE
/**
 * @property {String} CORNER
 * @final
 */
export const CORNER = 'corner';
/**
 * @property {String} CORNERS
 * @final
 */
export const CORNERS = 'corners';
/**
 * @property {String} RADIUS
 * @final
 */
export const RADIUS = 'radius';
/**
 * @property {String} RIGHT
 * @final
 */
export const RIGHT = 'right';
/**
 * @property {String} LEFT
 * @final
 */
export const LEFT = 'left';
/**
 * @property {String} CENTER
 * @final
 */
export const CENTER = 'center';
/**
 * @property {String} TOP
 * @final
 */
export const TOP = 'top';
/**
 * @property {String} BOTTOM
 * @final
 */
export const BOTTOM = 'bottom';
/**
 * @property {String} BASELINE
 * @final
 * @default alphabetic
 */
export const BASELINE = 'alphabetic';
/**
 * @property {Number} POINTS
 * @final
 * @default 0x0000
 */
export const POINTS = 0x0000;
/**
 * @property {Number} LINES
 * @final
 * @default 0x0001
 */
export const LINES = 0x0001;
/**
 * @property {Number} LINE_STRIP
 * @final
 * @default 0x0003
 */
export const LINE_STRIP = 0x0003;
/**
 * @property {Number} LINE_LOOP
 * @final
 * @default 0x0002
 */
export const LINE_LOOP = 0x0002;
/**
 * @property {Number} TRIANGLES
 * @final
 * @default 0x0004
 */
export const TRIANGLES = 0x0004;
/**
 * @property {Number} TRIANGLE_FAN
 * @final
 * @default 0x0006
 */
export const TRIANGLE_FAN = 0x0006;
/**
 * @property {Number} TRIANGLE_STRIP
 * @final
 * @default 0x0005
 */
export const TRIANGLE_STRIP = 0x0005;
/**
 * @property {String} QUADS
 * @final
 */
export const QUADS = 'quads';
/**
 * @property {String} QUAD_STRIP
 * @final
 * @default quad_strip
 */
export const QUAD_STRIP = 'quad_strip';
/**
 * @property {String} TESS
 * @final
 * @default tess
 */
export const TESS = 'tess';
/**
 * @property {String} CLOSE
 * @final
 */
export const CLOSE = 'close';
/**
 * @property {String} OPEN
 * @final
 */
export const OPEN = 'open';
/**
 * @property {String} CHORD
 * @final
 */
export const CHORD = 'chord';
/**
 * @property {String} PIE
 * @final
 */
export const PIE = 'pie';
/**
 * @property {String} PROJECT
 * @final
 * @default square
 */
export const PROJECT = 'square'; // PEND: careful this is counterintuitive
/**
 * @property {String} SQUARE
 * @final
 * @default butt
 */
export const SQUARE = 'butt';
/**
 * @property {String} ROUND
 * @final
 */
export const ROUND = 'round';
/**
 * @property {String} BEVEL
 * @final
 */
export const BEVEL = 'bevel';
/**
 * @property {String} MITER
 * @final
 */
export const MITER = 'miter';

// COLOR
/**
 * @property {String} RGB
 * @final
 */
export const RGB = 'rgb';
/**
 * HSB (hue, saturation, brightness) is a type of color model.
 * You can learn more about it at
 * <a href="https://learnui.design/blog/the-hsb-color-system-practicioners-primer.html">HSB</a>.
 *
 * @property {String} HSB
 * @final
 */
export const HSB = 'hsb';
/**
 * @property {String} HSL
 * @final
 */
export const HSL = 'hsl';

// DOM EXTENSION
/**
 * AUTO allows us to automatically set the width or height of an element (but not both),
 * based on the current height and width of the element. Only one parameter can
 * be passed to the <a href="/reference/p5.Element/size">size</a> function as AUTO, at a time.
 *
 * @property {String} AUTO
 * @final
 */
export const AUTO = 'auto';

/**
 * @property {Number} ALT
 * @final
 */
// INPUT
export const ALT = 18;
/**
 * @property {Number} BACKSPACE
 * @final
 */
export const BACKSPACE = 8;
/**
 * @property {Number} CONTROL
 * @final
 */
export const CONTROL = 17;
/**
 * @property {Number} DELETE
 * @final
 */
export const DELETE = 46;
/**
 * @property {Number} DOWN_ARROW
 * @final
 */
export const DOWN_ARROW = 40;
/**
 * @property {Number} ENTER
 * @final
 */
export const ENTER = 13;
/**
 * @property {Number} ESCAPE
 * @final
 */
export const ESCAPE = 27;
/**
 * @property {Number} LEFT_ARROW
 * @final
 */
export const LEFT_ARROW = 37;
/**
 * @property {Number} OPTION
 * @final
 */
export const OPTION = 18;
/**
 * @property {Number} RETURN
 * @final
 */
export const RETURN = 13;
/**
 * @property {Number} RIGHT_ARROW
 * @final
 */
export const RIGHT_ARROW = 39;
/**
 * @property {Number} SHIFT
 * @final
 */
export const SHIFT = 16;
/**
 * @property {Number} TAB
 * @final
 */
export const TAB = 9;
/**
 * @property {Number} UP_ARROW
 * @final
 */
export const UP_ARROW = 38;

// RENDERING
/**
 * @property {String} BLEND
 * @final
 * @default source-over
 */
export const BLEND = 'source-over';
/**
 * @property {String} REMOVE
 * @final
 * @default destination-out
 */
export const REMOVE = 'destination-out';
/**
 * @property {String} ADD
 * @final
 * @default lighter
 */
export const ADD = 'lighter';
//ADD: 'add', //
//SUBTRACT: 'subtract', //
/**
 * @property {String} DARKEST
 * @final
 */
export const DARKEST = 'darken';
/**
 * @property {String} LIGHTEST
 * @final
 * @default lighten
 */
export const LIGHTEST = 'lighten';
/**
 * @property {String} DIFFERENCE
 * @final
 */
export const DIFFERENCE = 'difference';
/**
 * @property {String} SUBTRACT
 * @final
 */
export const SUBTRACT = 'subtract';
/**
 * @property {String} EXCLUSION
 * @final
 */
export const EXCLUSION = 'exclusion';
/**
 * @property {String} MULTIPLY
 * @final
 */
export const MULTIPLY = 'multiply';
/**
 * @property {String} SCREEN
 * @final
 */
export const SCREEN = 'screen';
/**
 * @property {String} REPLACE
 * @final
 * @default copy
 */
export const REPLACE = 'copy';
/**
 * @property {String} OVERLAY
 * @final
 */
export const OVERLAY = 'overlay';
/**
 * @property {String} HARD_LIGHT
 * @final
 */
export const HARD_LIGHT = 'hard-light';
/**
 * @property {String} SOFT_LIGHT
 * @final
 */
export const SOFT_LIGHT = 'soft-light';
/**
 * @property {String} DODGE
 * @final
 * @default color-dodge
 */
export const DODGE = 'color-dodge';
/**
 * @property {String} BURN
 * @final
 * @default color-burn
 */
export const BURN = 'color-burn';

// FILTERS
/**
 * @property {String} THRESHOLD
 * @final
 */
export const THRESHOLD = 'threshold';
/**
 * @property {String} GRAY
 * @final
 */
export const GRAY = 'gray';
/**
 * @property {String} OPAQUE
 * @final
 */
export const OPAQUE = 'opaque';
/**
 * @property {String} INVERT
 * @final
 */
export const INVERT = 'invert';
/**
 * @property {String} POSTERIZE
 * @final
 */
export const POSTERIZE = 'posterize';
/**
 * @property {String} DILATE
 * @final
 */
export const DILATE = 'dilate';
/**
 * @property {String} ERODE
 * @final
 */
export const ERODE = 'erode';
/**
 * @property {String} BLUR
 * @final
 */
export const BLUR = 'blur';

// TYPOGRAPHY
/**
 * @property {String} NORMAL
 * @final
 */
export const NORMAL = 'normal';
/**
 * @property {String} ITALIC
 * @final
 */
export const ITALIC = 'italic';
/**
 * @property {String} BOLD
 * @final
 */
export const BOLD = 'bold';
/**
 * @property {String} BOLDITALIC
 * @final
 */
export const BOLDITALIC = 'bold italic';
/**
 * @property {String} CHAR
 * @final
 */
export const CHAR = 'CHAR';
/**
 * @property {String} WORD
 * @final
 */
export const WORD = 'WORD';

// TYPOGRAPHY-INTERNAL
export const _DEFAULT_TEXT_FILL = '#000000';
export const _DEFAULT_LEADMULT = 1.25;
export const _CTX_MIDDLE = 'middle';

// VERTICES
/**
 * @property {String} LINEAR
 * @final
 */
export const LINEAR = 'linear';
/**
 * @property {String} QUADRATIC
 * @final
 */
export const QUADRATIC = 'quadratic';
/**
 * @property {String} BEZIER
 * @final
 */
export const BEZIER = 'bezier';
/**
 * @property {String} CURVE
 * @final
 */
export const CURVE = 'curve';

// WEBGL DRAWMODES
/**
 * @property {String} STROKE
 * @final
 */
export const STROKE = 'stroke';
/**
 * @property {String} FILL
 * @final
 */
export const FILL = 'fill';
/**
 * @property {String} TEXTURE
 * @final
 */
export const TEXTURE = 'texture';
/**
 * @property {String} IMMEDIATE
 * @final
 */
export const IMMEDIATE = 'immediate';

// WEBGL TEXTURE MODE
// NORMAL already exists for typography
/**
 * @property {String} IMAGE
 * @final
 */
export const IMAGE = 'image';

// WEBGL TEXTURE WRAP AND FILTERING
// LINEAR already exists above
/**
 * @property {String} NEAREST
 * @final
 */
export const NEAREST = 'nearest';
/**
 * @property {String} REPEAT
 * @final
 */
export const REPEAT = 'repeat';
/**
 * @property {String} CLAMP
 * @final
 */
export const CLAMP = 'clamp';
/**
 * @property {String} MIRROR
 * @final
 */
export const MIRROR = 'mirror';

// WEBGL GEOMETRY SHADING
/**
 * @property {String} FLAT
 * @final
 */
export const FLAT = 'flat';
/**
 * @property {String} SMOOTH
 * @final
 */
export const SMOOTH = 'smooth';

// DEVICE-ORIENTATION
/**
 * @property {String} LANDSCAPE
 * @final
 */
export const LANDSCAPE = 'landscape';
/**
 * @property {String} PORTRAIT
 * @final
 */
export const PORTRAIT = 'portrait';

// DEFAULTS
export const _DEFAULT_STROKE = '#000000';
export const _DEFAULT_FILL = '#FFFFFF';

/**
 * @property {String} GRID
 * @final
 */
export const GRID = 'grid';

/**
 * @property {String} AXES
 * @final
 */
export const AXES = 'axes';

/**
 * @property {String} LABEL
 * @final
 */
export const LABEL = 'label';
/**
 * @property {String} FALLBACK
 * @final
 */
export const FALLBACK = 'fallback';

/**
 * @property {String} CONTAIN
 * @final
 */
export const CONTAIN = 'contain';

/**
 * @property {String} COVER
 * @final
 */
export const COVER = 'cover';

/**
 * @property {String} UNSIGNED_BYTE
 * @final
 */
export const UNSIGNED_BYTE = 'unsigned-byte';

/**
 * @property {String} UNSIGNED_INT
 * @final
 */
export const UNSIGNED_INT = 'unsigned-int';

/**
 * @property {String} FLOAT
 * @final
 */
export const FLOAT = 'float';

/**
 * @property {String} HALF_FLOAT
 * @final
 */
export const HALF_FLOAT = 'half-float';

/**
 * @property {String} RGBA
 * @final
 */
export const RGBA = 'rgba';
