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
 * @typedef {unique symbol} P2D
 * @property {P2D} P2D
 * @final
 */
export const P2D = Symbol('p2d');
/**
 * One of the two render modes in p5.js, used for computationally intensive tasks like 3D rendering and shaders.
 *
 * `WEBGL` differs from the default <a href="/reference/#/p5/P2D">`P2D`</a> renderer in the following ways:
 *
 * - **Coordinate System** - When drawing in `WEBGL` mode, the origin point (0,0,0) is located at the center of the screen, not the top-left corner. See <a href="https://p5js.org/learn/getting-started-in-webgl-coords-and-transform.html">the learn page about coordinates and transformations</a>.
 * - **3D Shapes** - `WEBGL` mode can be used to draw 3-dimensional shapes like <a href="/reference/#/p5/box">box()</a>, <a href="/reference/#/p5/sphere">sphere()</a>, <a href="/reference/#/p5/cone">cone()</a>, and <a href="/#Shape3D%20Primitives">more</a>. See <a href="https://p5js.org/learn/getting-started-in-webgl-custom-geometry.html">the learn page about custom geometry</a> to make more complex objects.
 * - **Shape Detail** - When drawing in `WEBGL` mode, you can specify how smooth curves should be drawn by using a `detail` parameter. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#3d-primitives-shapes">the wiki section about shapes</a> for a more information and an example.
 * - **Textures** - A texture is like a skin that wraps onto a shape. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#textures">the wiki section about textures</a> for examples of mapping images onto surfaces with textures.
 * - **Materials and Lighting** - `WEBGL` offers different types of lights like <a href="/reference/#/p5/ambientLight">ambientLight()</a> to place around a scene. Materials like <a href="/reference/#/p5/specularMaterial">specularMaterial()</a> reflect the lighting to convey shape and depth. See <a href="https://p5js.org/learn/getting-started-in-webgl-appearance.html">the learn page for styling and appearance</a> to experiment with different combinations.
 * - **Camera** - The viewport of a `WEBGL` sketch can be adjusted by changing camera attributes. See <a href="https://p5js.org/learn/getting-started-in-webgl-appearance.html#camera">the learn page section about cameras</a> for an explanation of camera controls.
 * - **Text** - `WEBGL` requires opentype/truetype font files to be preloaded using <a href="/reference/#/p5/loadFont">loadFont()</a>. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#text">the wiki section about text</a> for details, along with a workaround.
 * - **Shaders** - Shaders are hardware accelerated programs that can be used for a variety of effects and graphics. See the <a href="https://p5js.org/learn/getting-started-in-webgl-shaders.html">introduction to shaders</a> to get started with shaders in p5.js.
 * - **Graphics Acceleration** - `WEBGL` mode uses the graphics card instead of the CPU, so it may help boost the performance of your sketch (example: drawing more shapes on the screen at once).
 *
 * To learn more about WEBGL mode, check out <a href="https://p5js.org/learn/#:~:text=Getting%20Started%20in%20WebGL">all the interactive WEBGL tutorials</a> in the "Learn" section of this website, or read the wiki article <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5">"Getting started with WebGL in p5"</a>.
 *
 * @typedef {unique symbol} WEBGL
 * @property {WEBGL} WEBGL
 * @final
 */
export const WEBGL = Symbol('webgl');
/**
 * One of the two possible values of a WebGL canvas (either WEBGL or WEBGL2),
 * which can be used to determine what capabilities the rendering environment
 * has.
 * @typedef {unique symbol} WEBGL2
 * @property {WEBGL2} WEBGL2
 * @final
 */
export const WEBGL2 = Symbol('webgl2');

// ENVIRONMENT
/**
 * @typedef {'default'} ARROW
 * @property {ARROW} ARROW
 * @final
 */
export const ARROW = 'default';
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
 * @typedef {unique symbol} DEGREES
 * @property {DEGREES} DEGREES
 * @final
 *
 * @example
 * <div class='norender'><code>
 * function setup() {
 *   angleMode(DEGREES);
 * }
 * </code></div>
 */
export const DEGREES = Symbol('degrees');
/**
 * Constant to be used with the <a href="#/p5/angleMode">angleMode()</a> function, to set the mode
 * in which p5.js interprets and calculates angles (either RADIANS or DEGREES).
 * @typedef {unique symbol} RADIANS
 * @property {RADIANS} RADIANS
 * @final
 *
 * @example
 * <div class='norender'><code>
 * function setup() {
 *   angleMode(RADIANS);
 * }
 * </code></div>
 */
export const RADIANS = Symbol('radians');
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

// COLOR
/**
 * @typedef {'rgb'} RGB
 * @property {RGB} RGB
 * @final
 */
export const RGB = 'rgb';
/**
 * HSB (hue, saturation, brightness) is a type of color model.
 * You can learn more about it at
 * <a href="https://learnui.design/blog/the-hsb-color-system-practicioners-primer.html">HSB</a>.
 *
 * @typedef {'hsb'} HSB
 * @property {HSB} HSB
 * @final
 */
export const HSB = 'hsb';
/**
 * @typedef {'hsl'} HSL
 * @property {HSL} HSL
 * @final
 */
export const HSL = 'hsl';

// DOM EXTENSION
/**
 * AUTO allows us to automatically set the width or height of an element (but not both),
 * based on the current height and width of the element. Only one parameter can
 * be passed to the <a href="/reference/#/p5.Element/size">size</a> function as AUTO, at a time.
 *
 * @typedef {'auto'} AUTO
 * @property {AUTO} AUTO
 * @final
 */
export const AUTO = 'auto';

/**
 * @typedef {18} ALT
 * @property {ALT} ALT
 * @final
 */
// INPUT
export const ALT = 18;
/**
 * @typedef {8} BACKSPACE
 * @property {BACKSPACE} BACKSPACE
 * @final
 */
export const BACKSPACE = 8;
/**
 * @typedef {17} CONTROL
 * @property {CONTROL} CONTROL
 * @final
 */
export const CONTROL = 17;
/**
 * @typedef {46} DELETE
 * @property {DELETE} DELETE
 * @final
 */
export const DELETE = 46;
/**
 * @typedef {40} DOWN_ARROW
 * @property {DOWN_ARROW} DOWN_ARROW
 * @final
 */
export const DOWN_ARROW = 40;
/**
 * @typedef {13} ENTER
 * @property {ENTER} ENTER
 * @final
 */
export const ENTER = 13;
/**
 * @typedef {27} ESCAPE
 * @property {ESCAPE} ESCAPE
 * @final
 */
export const ESCAPE = 27;
/**
 * @typedef {37} LEFT_ARROW
 * @property {LEFT_ARROW} LEFT_ARROW
 * @final
 */
export const LEFT_ARROW = 37;
/**
 * @typedef {18} OPTION
 * @property {OPTION} OPTION
 * @final
 */
export const OPTION = 18;
/**
 * @typedef {13} RETURN
 * @property {RETURN} RETURN
 * @final
 */
export const RETURN = 13;
/**
 * @typedef {39} RIGHT_ARROW
 * @property {RIGHT_ARROW} RIGHT_ARROW
 * @final
 */
export const RIGHT_ARROW = 39;
/**
 * @typedef {16} SHIFT
 * @property {SHIFT} SHIFT
 * @final
 */
export const SHIFT = 16;
/**
 * @typedef {9} TAB
 * @property {TAB} TAB
 * @final
 */
export const TAB = 9;
/**
 * @typedef {38} UP_ARROW
 * @property {UP_ARROW} UP_ARROW
 * @final
 */
export const UP_ARROW = 38;

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
 * @typedef {'rgba'} RGBA
 * @property {RGBA} RGBA
 * @final
 */
export const RGBA = 'rgba';
