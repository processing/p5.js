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
export const VERSION = 'VERSION_WILL_BE_REPLACED_BY_BUILD';

// GRAPHICS RENDERER
/**
 * The default, two-dimensional renderer.
 * @typedef {unique symbol} P2D
 * @property {P2D} P2D
 * @final
 */
export const P2D = 'p2d';

export const P2DHDR = 'p2d-hdr';

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
 * @typedef {unique symbol} WEBGL
 * @property {WEBGL} WEBGL
 * @final
 */
export const WEBGL = 'webgl';
/**
 * One of the two possible values of a WebGL canvas (either WEBGL or WEBGL2),
 * which can be used to determine what capabilities the rendering environment
 * has.
 * @typedef {unique symbol} WEBGL2
 * @property {WEBGL2} WEBGL2
 * @final
 */
export const WEBGL2 = 'webgl2';

// ENVIRONMENT
/**
 * @typedef {'default'} ARROW
 * @property {ARROW} ARROW
 * @final
 */
export const ARROW = 'default';

/**
 * @property {String} SIMPLE
 * @final
 */
export const SIMPLE = 'simple';
/**
 * @property {String} FULL
 * @final
 */
export const FULL = 'full';

/**
 * @typedef {'crosshair'} CROSS
 * @property {CROSS} CROSS
 * @final
 */
export const CROSS = 'crosshair';
/**
 * @typedef {'pointer'} HAND
 * @property {HAND} HAND
 * @final
 */
export const HAND = 'pointer';
/**
 * @typedef {'move'} MOVE
 * @property {MOVE} MOVE
 * @final
 */
export const MOVE = 'move';
/**
 * @typedef {'text'} TEXT
 * @property {TEXT} TEXT
 * @final
 */
export const TEXT = 'text';
/**
 * @typedef {'wait'} WAIT
 * @property {WAIT} WAIT
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
 * @typedef {unique symbol} DEGREES
 * @property {DEGREES} DEGREES
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
// export const DEGREES = Symbol('degrees');

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
 * @typedef {unique symbol} RADIANS
 * @property {RADIANS} RADIANS
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
// export const RADIANS = Symbol('radians');
export const DEG_TO_RAD = _PI / 180.0;
export const RAD_TO_DEG = 180.0 / _PI;

// SHAPE
/**
 * @typedef {'corner'} CORNER
 * @property {CORNER} CORNER
 * @final
 */
export const CORNER = 'corner';
/**
 * @typedef {'corners'} CORNERS
 * @property {CORNERS} CORNERS
 * @final
 */
export const CORNERS = 'corners';
/**
 * @typedef {'radius'} RADIUS
 * @property {RADIUS} RADIUS
 * @final
 */
export const RADIUS = 'radius';
/**
 * @typedef {'right'} RIGHT
 * @property {RIGHT} RIGHT
 * @final
 */
export const RIGHT = 'right';
/**
 * @typedef {'left'} LEFT
 * @property {LEFT} LEFT
 * @final
 */
export const LEFT = 'left';
/**
 * @typedef {'center'} CENTER
 * @property {CENTER} CENTER
 * @final
 */
export const CENTER = 'center';
/**
 * @typedef {'top'} TOP
 * @property {TOP} TOP
 * @final
 */
export const TOP = 'top';
/**
 * @typedef {'bottom'} BOTTOM
 * @property {BOTTOM} BOTTOM
 * @final
 */
export const BOTTOM = 'bottom';
/**
 * @typedef {'alphabetic'} BASELINE
 * @property {BASELINE} BASELINE
 * @final
 */
export const BASELINE = 'alphabetic';
/**
 * @typedef {0x0000} POINTS
 * @property {POINTS} POINTS
 * @final
 */
export const POINTS = 0x0000;
/**
 * @typedef {0x0001} LINES
 * @property {LINES} LINES
 * @final
 */
export const LINES = 0x0001;
/**
 * @property {0x0003} LINE_STRIP
 * @property {LINE_STRIP} LINE_STRIP
 * @final
 */
export const LINE_STRIP = 0x0003;
/**
 * @typedef {0x0002} LINE_LOOP
 * @property {LINE_LOOP} LINE_LOOP
 * @final
 */
export const LINE_LOOP = 0x0002;
/**
 * @typedef {0x0004} TRIANGLES
 * @property {TRIANGLES} TRIANGLES
 * @final
 */
export const TRIANGLES = 0x0004;
/**
 * @typedef {0x0006} TRIANGLE_FAN
 * @property {TRIANGLE_FAN} TRIANGLE_FAN
 * @final
 */
export const TRIANGLE_FAN = 0x0006;
/**
 * @typedef {0x0005} TRIANGLE_STRIP
 * @property {TRIANGLE_STRIP} TRIANGLE_STRIP
 * @final
 */
export const TRIANGLE_STRIP = 0x0005;
/**
 * @typedef {'quads'} QUADS
 * @property {QUADS} QUADS
 * @final
 */
export const QUADS = 'quads';
/**
 * @typedef {'quad_strip'} QUAD_STRIP
 * @property {QUAD_STRIP} QUAD_STRIP
 * @final
 */
export const QUAD_STRIP = 'quad_strip';
/**
 * @typedef {'tess'} TESS
 * @property {TESS} TESS
 * @final
 */
export const TESS = 'tess';
/**
 * @typedef {0x0007} EMPTY_PATH
 * @property {EMPTY_PATH} EMPTY_PATH
 * @final
 */
export const EMPTY_PATH = 0x0007;
/**
 * @typedef {0x0008} PATH
 * @property {PATH} PATH
 * @final
 */
export const PATH = 0x0008;
/**
 * @typedef {'close'} CLOSE
 * @property {CLOSE} CLOSE
 * @final
 */
export const CLOSE = 'close';
/**
 * @typedef {'open'} OPEN
 * @property {OPEN} OPEN
 * @final
 */
export const OPEN = 'open';
/**
 * @typedef {'chord'} CHORD
 * @property {CHORD} CHORD
 * @final
 */
export const CHORD = 'chord';
/**
 * @typedef {'pie'} PIE
 * @property {PIE} PIE
 * @final
 */
export const PIE = 'pie';
/**
 * @typedef {'square'} PROJECT
 * @property {PROJECT} PROJECT
 * @final
 */
export const PROJECT = 'square'; // PEND: careful this is counterintuitive
/**
 * @typedef {'butt'} SQUARE
 * @property {SQUERE} SQUARE
 * @final
 */
export const SQUARE = 'butt';
/**
 * @typedef {'round'} ROUND
 * @property {ROUND} ROUND
 * @final
 */
export const ROUND = 'round';
/**
 * @typedef {'bevel'} BEVEL
 * @property {BEVEL} BEVEL
 * @final
 */
export const BEVEL = 'bevel';
/**
 * @typedef {'miter'} MITER
 * @property {MITER} MITER
 * @final
 */
export const MITER = 'miter';

// DOM EXTENSION
/**
 * AUTO allows us to automatically set the width or height of an element (but not both),
 * based on the current height and width of the element. Only one parameter can
 * be passed to the <a href="/reference/p5.Element/size">size</a> function as AUTO, at a time.
 *
 * @typedef {'auto'} AUTO
 * @property {AUTO} AUTO
 * @final
 */
export const AUTO = 'auto';
// INPUT
/**
 * @typedef {'Alt'} ALT
 * @property {ALT} ALT
 * @final
 */
export const ALT = 'Alt';

/**
 * @typedef {'Backspace'} BACKSPACE
 * @property {BACKSPACE} BACKSPACE
 * @final
 */
export const BACKSPACE = 'Backspace';

/**
 * @typedef {'Control' | 'Control'} CONTROL
 * @property {CONTROL} CONTROL
 * @final
 */
export const CONTROL = 'Control';

/**
 * @typedef {'Delete'} DELETE
 * @property {DELETE} DELETE
 * @final
 */
export const DELETE = 'Delete';

/**
 * @typedef {'ArrowDown'} DOWN_ARROW
 * @property {DOWN_ARROW} DOWN_ARROW
 * @final
 */
export const DOWN_ARROW = 'ArrowDown';

/**
 * @typedef {'Enter'} ENTER
 * @property {ENTER} ENTER
 * @final
 */
export const ENTER = 'Enter';

/**
 * @typedef {'Escape'} ESCAPE
 * @property {ESCAPE} ESCAPE
 * @final
 */
export const ESCAPE = 'Escape';

/**
 * @typedef {'ArrowLeft'} LEFT_ARROW
 * @property {LEFT_ARROW} LEFT_ARROW
 * @final
 */
export const LEFT_ARROW = 'ArrowLeft';

/**
 * @typedef {'Alt'} OPTION
 * @property {OPTION} OPTION
 * @final
 */
export const OPTION = 'Alt';

/**
 * @typedef {'Enter'} RETURN
 * @property {RETURN} RETURN
 * @final
 */
export const RETURN = 'Enter';

/**
 * @typedef {'ArrowRight'} RIGHT_ARROW
 * @property {RIGHT_ARROW} RIGHT_ARROW
 * @final
 */
export const RIGHT_ARROW = 'ArrowRight';

/**
 * @typedef {'Shift'} SHIFT
 * @property {SHIFT} SHIFT
 * @final
 */
export const SHIFT = 'Shift';

/**
 * @typedef {'Tab'} TAB
 * @property {TAB} TAB
 * @final
 */
export const TAB = 'Tab';

/**
 * @typedef {'ArrowUp'} UP_ARROW
 * @property {UP_ARROW} UP_ARROW
 * @final
 */
export const UP_ARROW = 'ArrowUp';

// RENDERING
/**
 * @typedef {'source-over'} BLEND
 * @property {BLEND} BLEND
 * @final
 */
export const BLEND = 'source-over';
/**
 * @typedef {'destination-out'} REMOVE
 * @property {REMOVE} REMOVE
 * @final
 */
export const REMOVE = 'destination-out';
/**
 * @typedef {'lighter'} ADD
 * @property {ADD} ADD
 * @final
 */
export const ADD = 'lighter';
/**
 * @typedef {'darken'} DARKEST
 * @property {DARKEST} DARKEST
 * @final
 */
export const DARKEST = 'darken';
/**
 * @typedef {'lighten'} LIGHTEST
 * @property {LIGHTEST} LIGHTEST
 * @final
 */
export const LIGHTEST = 'lighten';
/**
 * @typedef {'difference'} DIFFERENCE
 * @property {DIFFERENCE} DIFFERENCE
 * @final
 */
export const DIFFERENCE = 'difference';
/**
 * @typedef {'subtract'} SUBTRACT
 * @property {SUBTRACT} SUBTRACT
 * @final
 */
export const SUBTRACT = 'subtract';
/**
 * @typedef {'exclusion'} EXCLUSION
 * @property {EXCLUSION} EXCLUSION
 * @final
 */
export const EXCLUSION = 'exclusion';
/**
 * @typedef {'multiply'} MULTIPLY
 * @property {MULTIPLY} MULTIPLY
 * @final
 */
export const MULTIPLY = 'multiply';
/**
 * @typedef {'screen'} SCREEN
 * @property {SCREEN} SCREEN
 * @final
 */
export const SCREEN = 'screen';
/**
 * @typedef {'copy'} REPLACE
 * @property {REPLACE} REPLACE
 * @final
 */
export const REPLACE = 'copy';
/**
 * @typedef {'overlay'} OVERLAY
 * @property {OVERLAY} OVERLAY
 * @final
 */
export const OVERLAY = 'overlay';
/**
 * @typedef {'hard-light'} HARD_LIGHT
 * @property {HARD_LIGHT} HARD_LIGHT
 * @final
 */
export const HARD_LIGHT = 'hard-light';
/**
 * @typedef {'soft-light'} SOFT_LIGHT
 * @property {SOFT_LIGHT} SOFT_LIGHT
 * @final
 */
export const SOFT_LIGHT = 'soft-light';
/**
 * @typedef {'color-dodge'} DODGE
 * @property {DODGE} DODGE
 * @final
 */
export const DODGE = 'color-dodge';
/**
 * @typedef {'color-burn'} BURN
 * @property {BURN} BURN
 * @final
 */
export const BURN = 'color-burn';

// FILTERS
/**
 * @typedef {'threshold'} THRESHOLD
 * @property {THRESHOLD} THRESHOLD
 * @final
 */
export const THRESHOLD = 'threshold';
/**
 * @typedef {'gray'} GRAY
 * @property {GRAY} GRAY
 * @final
 */
export const GRAY = 'gray';
/**
 * @typedef {'opaque'} OPAQUE
 * @property {OPAQUE} OPAQUE
 * @final
 */
export const OPAQUE = 'opaque';
/**
 * @typedef {'invert'} INVERT
 * @property {INVERT} INVERT
 * @final
 */
export const INVERT = 'invert';
/**
 * @typedef {'posterize'} POSTERIZE
 * @property {POSTERIZE} POSTERIZE
 * @final
 */
export const POSTERIZE = 'posterize';
/**
 * @typedef {'dilate'} DILATE
 * @property {DILATE} DILATE
 * @final
 */
export const DILATE = 'dilate';
/**
 * @typedef {'erode'} ERODE
 * @property {ERODE} ERODE
 * @final
 */
export const ERODE = 'erode';
/**
 * @typedef {'blur'} BLUR
 * @property {BLUR} BLUR
 * @final
 */
export const BLUR = 'blur';

// TYPOGRAPHY
/**
 * @typedef {'normal'} NORMAL
 * @property {NORMAL} NORMAL
 * @final
 */
export const NORMAL = 'normal';
/**
 * @typedef {'italic'} ITALIC
 * @property {ITALIC} ITALIC
 * @final
 */
export const ITALIC = 'italic';
/**
 * @typedef {'bold'} BOLD
 * @property {BOLD} BOLD
 * @final
 */
export const BOLD = 'bold';
/**
 * @typedef {'bold italic'} BOLDITALIC
 * @property {BOLDITALIC} BOLDITALIC
 * @final
 */
export const BOLDITALIC = 'bold italic';
/**
 * @typedef {'CHAR'} CHAR
 * @property {CHAR} CHAR
 * @final
 */
export const CHAR = 'CHAR';
/**
 * @typedef {'WORD'} WORD
 * @property {WORD} WORD
 * @final
 */
export const WORD = 'WORD';

// TYPOGRAPHY-INTERNAL
export const _DEFAULT_TEXT_FILL = '#000000';
export const _DEFAULT_LEADMULT = 1.25;
export const _CTX_MIDDLE = 'middle';

// VERTICES
/**
 * @typedef {'linear'} LINEAR
 * @property {LINEAR} LINEAR
 * @final
 */
export const LINEAR = 'linear';
/**
 * @typedef {'quadratic'} QUADRATIC
 * @property {QUADRATIC} QUADRATIC
 * @final
 */
export const QUADRATIC = 'quadratic';
/**
 * @typedef {'bezier'} BEZIER
 * @property {BEZIER} BEZIER
 * @final
 */
export const BEZIER = 'bezier';
/**
 * @typedef {'curve'} CURVE
 * @property {CURVE} CURVE
 * @final
 */
export const CURVE = 'curve';

// WEBGL DRAWMODES
/**
 * @typedef {'stroke'} STROKE
 * @property {STROKE} STROKE
 * @final
 */
export const STROKE = 'stroke';
/**
 * @typedef {'fill'} FILL
 * @property {FILL} FILL
 * @final
 */
export const FILL = 'fill';
/**
 * @typedef {'texture'} TEXTURE
 * @property {TEXTURE} TEXTURE
 * @final
 */
export const TEXTURE = 'texture';
/**
 * @typedef {'immediate'} IMMEDIATE
 * @property {IMMEDIATE} IMMEDIATE
 * @final
 */
export const IMMEDIATE = 'immediate';

// WEBGL TEXTURE MODE
// NORMAL already exists for typography
/**
 * @typedef {'image'} IMAGE
 * @property {IMAGE} IMAGE
 * @final
 */
export const IMAGE = 'image';

// WEBGL TEXTURE WRAP AND FILTERING
// LINEAR already exists above
/**
 * @typedef {'nearest'} NEAREST
 * @property {NEAREST} NEAREST
 * @final
 */
export const NEAREST = 'nearest';
/**
 * @typedef {'repeat'} REPEAT
 * @property {REPEAT} REPEAT
 * @final
 */
export const REPEAT = 'repeat';
/**
 * @typedef {'clamp'} CLAMP
 * @property {CLAMP} CLAMP
 * @final
 */
export const CLAMP = 'clamp';
/**
 * @typedef {'mirror'} MIRROR
 * @property {MIRROR} MIRROR
 * @final
 */
export const MIRROR = 'mirror';

// WEBGL GEOMETRY SHADING
/**
 * @typedef {'flat'} FLAT
 * @property {FLAT} FLAT
 * @final
 */
export const FLAT = 'flat';
/**
 * @typedef {'smooth'} SMOOTH
 * @property {SMOOTH} SMOOTH
 * @final
 */
export const SMOOTH = 'smooth';

// DEVICE-ORIENTATION
/**
 * @typedef {'landscape'} LANDSCAPE
 * @property {LANDSCAPE} LANDSCAPE
 * @final
 */
export const LANDSCAPE = 'landscape';
/**
 * @typedef {'portrait'} PORTRAIT
 * @property {PORTRAIT} PORTRAIT
 * @final
 */
export const PORTRAIT = 'portrait';

// DEFAULTS
export const _DEFAULT_STROKE = '#000000';
export const _DEFAULT_FILL = '#FFFFFF';

/**
 * @typedef {'grid'} GRID
 * @property {GRID} GRID
 * @final
 */
export const GRID = 'grid';

/**
 * @typedef {'axes'} AXES
 * @property {AXES} AXES
 * @final
 */
export const AXES = 'axes';

/**
 * @typedef {'label'} LABEL
 * @property {LABEL} LABEL
 * @final
 */
export const LABEL = 'label';
/**
 * @typedef {'fallback'} FALLBACK
 * @property {FALLBACK} FALLBACK
 * @final
 */
export const FALLBACK = 'fallback';

/**
 * @typedef {'contain'} CONTAIN
 * @property {CONTAIN} CONTAIN
 * @final
 */
export const CONTAIN = 'contain';

/**
 * @typedef {'cover'} COVER
 * @property {COVER} COVER
 * @final
 */
export const COVER = 'cover';

/**
 * @typedef {'unsigned-byte'} UNSIGNED_BYTE
 * @property {UNSIGNED_BYTE} UNSIGNED_BYTE
 * @final
 */
export const UNSIGNED_BYTE = 'unsigned-byte';

/**
 * @typedef {'unsigned-int'} UNSIGNED_INT
 * @property {UNSIGNED_INT} UNSIGNED_INT
 * @final
 */
export const UNSIGNED_INT = 'unsigned-int';

/**
 * @typedef {'float'} FLOAT
 * @property {FLOAT} FLOAT
 * @final
 */
export const FLOAT = 'float';

/**
 * @typedef {'half-float'} HALF_FLOAT
 * @property {HALF_FLOAT} HALF_FLOAT
 * @final
 */
export const HALF_FLOAT = 'half-float';

/**
 * The `splineProperty('ends')` mode where splines curve through
 * their first and last points.
 * @typedef {unique symbol} INCLUDE
 * @property {INCLUDE} INCLUDE
 * @final
 */
export const INCLUDE = Symbol('include');

/**
 * The `splineProperty('ends')` mode where the first and last points in a spline
 * affect the direction of the curve, but are not rendered.
 * @typedef {unique symbol} EXCLUDE
 * @property {EXCLUDE} EXCLUDE
 * @final
 */
export const EXCLUDE = Symbol('exclude');

/**
 * The `splineProperty('ends')` mode where the spline loops back to its first point.
 * Only used internally.
 * @typedef {unique symbol} JOIN
 * @property {JOIN} JOIN
 * @final
 * @private
 */
export const JOIN = Symbol('join');
