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
 * One of the two render modes in p5.js is used for computationally intensive tasks like 3D rendering and shaders.
 *
 * `WEBGL` differs from the default <a href="/reference/#/p5/P2D">`P2D`</a> renderer in the following ways:
 *
 * - **Coordinate System** - When drawing in `WEBGL` mode, the origin point (0,0,0) is located at the center of the screen, not the top-left corner. See <a href="https://p5js.org/learn/getting-started-in-webgl-coords-and-transform.html">the learn page about coordinates and transformations</a>.
 * - **3D Shapes** - `WEBGL` mode can be used to draw 3-dimensional shapes like <a href="/reference/#/p5/box">box()</a>, <a href="/reference/#/p5/sphere">sphere()</a>, <a href="/reference/#/p5/cone">cone()</a>, and <a href="/#Shape3D%20Primitives">more</a>. See <a href="https://p5js.org/learn/getting-started-in-webgl-custom-geometry.html">the learn page about custom geometry</a> to make more complex objects.
 * - **Shape Detail** - When drawing in `WEBGL` mode, you can specify how smooth curves should be drawn by using a `detail` parameter. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#3d-primitives-shapes">the wiki section about shapes</a> for more information and an example.
 * - **Textures** - A texture is like a skin that wraps onto a shape. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#textures">the wiki section about textures</a> for examples of mapping images onto surfaces with textures.
 * - **Materials and Lighting** - `WEBGL` offers different types of lights like <a href="/reference/#/p5/ambientLight">ambientLight()</a> to place around a scene. Materials like <a href="/reference/#/p5/specularMaterial">specularMaterial()</a> reflect the lighting to convey shape and depth. See <a href="https://p5js.org/learn/getting-started-in-webgl-appearance.html">the learn page for styling and appearance</a> to experiment with different combinations.
 * - **Camera** - The viewport of a `WEBGL` sketch can be adjusted by changing camera attributes. See <a href="https://p5js.org/learn/getting-started-in-webgl-appearance.html#camera">the learn page section about cameras</a> for an explanation of camera controls.
 * - **Text** - `WEBGL` requires opentype/truetype font files to be preloaded using <a href="/reference/#/p5/loadFont">loadFont()</a>. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#text">the wiki section about text</a> for details, along with a workaround.
 * - **Shaders** - Shaders are hardware-accelerated programs that can be used for a variety of effects and graphics. See the <a href="https://p5js.org/learn/getting-started-in-webgl-shaders.html">introduction to shaders</a> to get started with shaders in p5.js.
 * - **Graphics Acceleration** - `WEBGL` mode uses the graphics card instead of the CPU, so it may help boost the performance of your sketch (for example: drawing more shapes on the screen at once).
 *
 * To learn more about WebGL mode, check out <a href="https://p5js.org/learn/#:~:text=Getting%20Started%20in%20WebGL">all the interactive WebGL tutorials</a> in the "Learn" section of this website, or read the wiki article <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5">"Getting started with WebGL in p5"</a>.
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
 * HALF_PI is a mathematical constant with the value
 * 1.57079632679489661923. It is half the ratio of the
 * circumference of a circle to its diameter. It is useful in
 * combination with the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
 *
 * @property {Number} HALF_PI
 * @final
 *
 * @example
 * <div><code>
 * arc(50, 50, 80, 80, 0, HALF_PI);
 * </code></div>
 *
 * @alt
 * 80×80 white quarter-circle with curve toward bottom right of canvas.
 */
export const HALF_PI = _PI / 2;
/**
 * PI is a mathematical constant with the value
 * 3.14159265358979323846. It is the ratio of the circumference
 * of a circle to its diameter. It is useful in combination with
 * the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
 *
 * @property {Number} PI
 * @final
 *
 * @example
 * <div><code>
 * arc(50, 50, 80, 80, 0, PI);
 * </code></div>
 *
 * @alt
 * white half-circle with curve toward bottom of canvas.
 */
export const PI = _PI;
/**
 * QUARTER_PI is a mathematical constant with the value 0.7853982.
 * It is one quarter the ratio of the circumference of a circle to
 * its diameter. It is useful in combination with the trigonometric
 * functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
 *
 * @property {Number} QUARTER_PI
 * @final
 *
 * @example
 * <div><code>
 * arc(50, 50, 80, 80, 0, QUARTER_PI);
 * </code></div>
 *
 * @alt
 * white eighth-circle rotated about 40 degrees with curve bottom right canvas.
 */
export const QUARTER_PI = _PI / 4;
/**
 * TAU is an alias for TWO_PI, a mathematical constant with the
 * value 6.28318530717958647693. It is twice the ratio of the
 * circumference of a circle to its diameter. It is useful in
 * combination with the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
 *
 * @property {Number} TAU
 * @final
 *
 * @example
 * <div><code>
 * arc(50, 50, 80, 80, 0, TAU);
 * </code></div>
 *
 * @alt
 * 80×80 white ellipse shape in center of canvas.
 */
export const TAU = _PI * 2;
/**
 * TWO_PI is a mathematical constant with the value
 * 6.28318530717958647693. It is twice the ratio of the
 * circumference of a circle to its diameter. It is useful in
 * combination with the trigonometric functions <a href="#/p5/sin">sin()</a> and <a href="#/p5/cos">cos()</a>.
 *
 * @property {Number} TWO_PI
 * @final
 *
 * @example
 * <div><code>
 * arc(50, 50, 80, 80, 0, TWO_PI);
 * </code></div>
 *
 * @alt
 * 80×80 white ellipse shape in center of canvas.
 */
export const TWO_PI = _PI * 2;
/**
 * Constant to be used with the <a href="#/p5/angleMode">angleMode()</a> function, to set the mode in
 * which p5.js interprets and calculates angles (either DEGREES or RADIANS).
 * @property {String} DEGREES
 * @final
 *
 * @example
 * <div class='norender'><code>
 * function setup() {
 *   angleMode(DEGREES);
 * }
 * </code></div>
 */
export const DEGREES = 'degrees';
/**
 * Constant to be used with the <a href="#/p5/angleMode">angleMode()</a> function, to set the mode
 * in which p5.js interprets and calculates angles (either RADIANS or DEGREES).
 * @property {String} RADIANS
 * @final
 *
 * @example
 * <div class='norender'><code>
 * function setup() {
 *   angleMode(RADIANS);
 * }
 * </code></div>
 */
export const RADIANS = 'radians';
export const DEG_TO_RAD = _PI / 180.0;
export const RAD_TO_DEG = 180.0 / _PI;

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
 * be passed to the <a href="/reference/#/p5.Element/size">size</a> function as AUTO, at a time.
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
