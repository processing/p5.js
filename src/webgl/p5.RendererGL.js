import p5 from '../core/main';
import * as constants from '../core/constants';
import libtess from 'libtess';
import './p5.Shader';
import './p5.Camera';
import '../core/p5.Renderer';
import './p5.Matrix';
import { readFileSync } from 'fs';
import { join } from 'path';

const lightingShader = readFileSync(
  join(__dirname, '/shaders/lighting.glsl'),
  'utf-8'
);

const defaultShaders = {
  immediateVert: readFileSync(
    join(__dirname, '/shaders/immediate.vert'),
    'utf-8'
  ),
  vertexColorVert: readFileSync(
    join(__dirname, '/shaders/vertexColor.vert'),
    'utf-8'
  ),
  vertexColorFrag: readFileSync(
    join(__dirname, '/shaders/vertexColor.frag'),
    'utf-8'
  ),
  normalVert: readFileSync(join(__dirname, '/shaders/normal.vert'), 'utf-8'),
  normalFrag: readFileSync(join(__dirname, '/shaders/normal.frag'), 'utf-8'),
  basicFrag: readFileSync(join(__dirname, '/shaders/basic.frag'), 'utf-8'),
  lightVert:
    lightingShader +
    readFileSync(join(__dirname, '/shaders/light.vert'), 'utf-8'),
  lightTextureFrag: readFileSync(
    join(__dirname, '/shaders/light_texture.frag'),
    'utf-8'
  ),
  phongVert: readFileSync(join(__dirname, '/shaders/phong.vert'), 'utf-8'),
  phongFrag:
    lightingShader +
    readFileSync(join(__dirname, '/shaders/phong.frag'), 'utf-8'),
  fontVert: readFileSync(join(__dirname, '/shaders/font.vert'), 'utf-8'),
  fontFrag: readFileSync(join(__dirname, '/shaders/font.frag'), 'utf-8'),
  lineVert: readFileSync(join(__dirname, '/shaders/line.vert'), 'utf-8'),
  lineFrag: readFileSync(join(__dirname, '/shaders/line.frag'), 'utf-8'),
  pointVert: readFileSync(join(__dirname, '/shaders/point.vert'), 'utf-8'),
  pointFrag: readFileSync(join(__dirname, '/shaders/point.frag'), 'utf-8')
};

/**
 * 3D graphics class
 * @private
 * @class p5.RendererGL
 * @constructor
 * @extends p5.Renderer
 * @todo extend class to include public method for offscreen
 * rendering (FBO).
 */
p5.RendererGL = function(elt, pInst, isMainCanvas, attr) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this._setAttributeDefaults(pInst);
  this._initContext();
  this.isP3D = true; //lets us know we're in 3d mode

  // This redundant property is useful in reminding you that you are
  // interacting with WebGLRenderingContext, still worth considering future removal
  this.GL = this.drawingContext;
  this._pInst._setProperty('drawingContext', this.drawingContext);

  // erasing
  this._isErasing = false;

  // lights
  this._enableLighting = false;

  this.ambientLightColors = [];
  this.specularColors = [1, 1, 1];

  this.directionalLightDirections = [];
  this.directionalLightDiffuseColors = [];
  this.directionalLightSpecularColors = [];

  this.pointLightPositions = [];
  this.pointLightDiffuseColors = [];
  this.pointLightSpecularColors = [];

  this.spotLightPositions = [];
  this.spotLightDirections = [];
  this.spotLightDiffuseColors = [];
  this.spotLightSpecularColors = [];
  this.spotLightAngle = [];
  this.spotLightConc = [];

  this.drawMode = constants.FILL;

  this.curFillColor = this._cachedFillStyle = [1, 1, 1, 1];
  this.curStrokeColor = this._cachedStrokeStyle = [0, 0, 0, 1];

  this.curBlendMode = constants.BLEND;
  this._cachedBlendMode = undefined;
  this.blendExt = this.GL.getExtension('EXT_blend_minmax');
  this._isBlending = false;

  this._useSpecularMaterial = false;
  this._useEmissiveMaterial = false;
  this._useNormalMaterial = false;
  this._useShininess = 1;

  this._tint = [255, 255, 255, 255];

  // lightFalloff variables
  this.constantAttenuation = 1;
  this.linearAttenuation = 0;
  this.quadraticAttenuation = 0;

  /**
   * model view, projection, & normal
   * matrices
   */
  this.uMVMatrix = new p5.Matrix();
  this.uPMatrix = new p5.Matrix();
  this.uNMatrix = new p5.Matrix('mat3');

  // Current vertex normal
  this._currentNormal = new p5.Vector(0, 0, 1);

  // Camera
  this._curCamera = new p5.Camera(this);
  this._curCamera._computeCameraDefaultSettings();
  this._curCamera._setDefaultCamera();

  this._defaultLightShader = undefined;
  this._defaultImmediateModeShader = undefined;
  this._defaultNormalShader = undefined;
  this._defaultColorShader = undefined;
  this._defaultPointShader = undefined;

  this.userFillShader = undefined;
  this.userStrokeShader = undefined;
  this.userPointShader = undefined;

  // Default drawing is done in Retained Mode
  // Geometry and Material hashes stored here
  this.retainedMode = {
    geometry: {},
    buffers: {
      // prettier-ignore
      stroke: [
        new p5.RenderBuffer(3, 'lineVertices', 'lineVertexBuffer', 'aPosition', this, this._flatten),
        new p5.RenderBuffer(4, 'lineNormals', 'lineNormalBuffer', 'aDirection', this, this._flatten)
      ],
      // prettier-ignore
      fill: [
        new p5.RenderBuffer(3, 'vertices', 'vertexBuffer', 'aPosition', this, this._vToNArray),
        new p5.RenderBuffer(3, 'vertexNormals', 'normalBuffer', 'aNormal', this, this._vToNArray),
        new p5.RenderBuffer(4, 'vertexColors', 'colorBuffer', 'aVertexColor', this),
        new p5.RenderBuffer(3, 'vertexAmbients', 'ambientBuffer', 'aAmbientColor', this),
        //new BufferDef(3, 'vertexSpeculars', 'specularBuffer', 'aSpecularColor'),
        new p5.RenderBuffer(2, 'uvs', 'uvBuffer', 'aTexCoord', this, this._flatten)
      ],
      // prettier-ignore
      text: [
        new p5.RenderBuffer(3, 'vertices', 'vertexBuffer', 'aPosition',this, this._vToNArray),
        new p5.RenderBuffer(2, 'uvs', 'uvBuffer', 'aTexCoord', this, this._flatten)
      ]
    }
  };

  // Immediate Mode
  // Geometry and Material hashes stored here
  this.immediateMode = {
    geometry: new p5.Geometry(),
    shapeMode: constants.TRIANGLE_FAN,
    _bezierVertex: [],
    _quadraticVertex: [],
    _curveVertex: [],
    buffers: {
      // prettier-ignore
      fill: [
      new p5.RenderBuffer(3, 'vertices', 'vertexBuffer', 'aPosition', this, this._vToNArray),
      new p5.RenderBuffer(3, 'vertexNormals', 'normalBuffer', 'aNormal', this, this._vToNArray),
      new p5.RenderBuffer(4, 'vertexColors', 'colorBuffer', 'aVertexColor', this),
      new p5.RenderBuffer(3, 'vertexAmbients', 'ambientBuffer', 'aAmbientColor', this),
      new p5.RenderBuffer(2, 'uvs', 'uvBuffer', 'aTexCoord', this, this._flatten)
      ],
      // prettier-ignore
      stroke: [
      new p5.RenderBuffer(3, 'lineVertices', 'lineVertexBuffer', 'aPosition', this, this._flatten),
      new p5.RenderBuffer(4, 'lineNormals', 'lineNormalBuffer', 'aDirection', this, this._flatten)
      ],
      point: this.GL.createBuffer()
    }
  };

  this.pointSize = 5.0; //default point size
  this.curStrokeWeight = 1;

  // array of textures created in this gl context via this.getTexture(src)
  this.textures = [];

  this.textureMode = constants.IMAGE;
  // default wrap settings
  this.textureWrapX = constants.CLAMP;
  this.textureWrapY = constants.CLAMP;
  this._tex = null;
  this._curveTightness = 6;

  // lookUpTable for coefficients needed to be calculated for bezierVertex, same are used for curveVertex
  this._lookUpTableBezier = [];
  // lookUpTable for coefficients needed to be calculated for quadraticVertex
  this._lookUpTableQuadratic = [];

  // current curveDetail in the Bezier lookUpTable
  this._lutBezierDetail = 0;
  // current curveDetail in the Quadratic lookUpTable
  this._lutQuadraticDetail = 0;

  this._tessy = this._initTessy();

  this.fontInfos = {};

  this._curShader = undefined;

  return this;
};

p5.RendererGL.prototype = Object.create(p5.Renderer.prototype);

//////////////////////////////////////////////
// Setting
//////////////////////////////////////////////

p5.RendererGL.prototype._setAttributeDefaults = function(pInst) {
  // See issue #3850, safer to enable AA in Safari
  const applyAA = navigator.userAgent.toLowerCase().includes('safari');
  const defaults = {
    alpha: false,
    depth: true,
    stencil: true,
    antialias: applyAA,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    perPixelLighting: true
  };
  if (pInst._glAttributes === null) {
    pInst._glAttributes = defaults;
  } else {
    pInst._glAttributes = Object.assign(defaults, pInst._glAttributes);
  }
  return;
};

p5.RendererGL.prototype._initContext = function() {
  try {
    this.drawingContext =
      this.canvas.getContext('webgl', this._pInst._glAttributes) ||
      this.canvas.getContext('experimental-webgl', this._pInst._glAttributes);
    if (this.drawingContext === null) {
      throw new Error('Error creating webgl context');
    } else {
      const gl = this.drawingContext;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      this._viewport = this.drawingContext.getParameter(
        this.drawingContext.VIEWPORT
      );
    }
  } catch (er) {
    throw er;
  }
};

//This is helper function to reset the context anytime the attributes
//are changed with setAttributes()

p5.RendererGL.prototype._resetContext = function(options, callback) {
  const w = this.width;
  const h = this.height;
  const defaultId = this.canvas.id;
  const isPGraphics = this._pInst instanceof p5.Graphics;

  if (isPGraphics) {
    const pg = this._pInst;
    pg.canvas.parentNode.removeChild(pg.canvas);
    pg.canvas = document.createElement('canvas');
    const node = pg._pInst._userNode || document.body;
    node.appendChild(pg.canvas);
    p5.Element.call(pg, pg.canvas, pg._pInst);
    pg.width = w;
    pg.height = h;
  } else {
    let c = this.canvas;
    if (c) {
      c.parentNode.removeChild(c);
    }
    c = document.createElement('canvas');
    c.id = defaultId;
    if (this._pInst._userNode) {
      this._pInst._userNode.appendChild(c);
    } else {
      document.body.appendChild(c);
    }
    this._pInst.canvas = c;
  }

  const renderer = new p5.RendererGL(
    this._pInst.canvas,
    this._pInst,
    !isPGraphics
  );
  this._pInst._setProperty('_renderer', renderer);
  renderer.resize(w, h);
  renderer._applyDefaults();

  if (!isPGraphics) {
    this._pInst._elements.push(renderer);
  }

  if (typeof callback === 'function') {
    //setTimeout with 0 forces the task to the back of the queue, this ensures that
    //we finish switching out the renderer
    setTimeout(() => {
      callback.apply(window._renderer, options);
    }, 0);
  }
};
/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */
/**
 * Set attributes for the WebGL Drawing context.
 * This is a way of adjusting how the WebGL
 * renderer works to fine-tune the display and performance.
 *
 * Note that this will reinitialize the drawing context
 * if called after the WebGL canvas is made.
 *
 * If an object is passed as the parameter, all attributes
 * not declared in the object will be set to defaults.
 *
 * The available attributes are:
 * <br>
 * alpha - indicates if the canvas contains an alpha buffer
 * default is false
 *
 * depth - indicates whether the drawing buffer has a depth buffer
 * of at least 16 bits - default is true
 *
 * stencil - indicates whether the drawing buffer has a stencil buffer
 * of at least 8 bits
 *
 * antialias - indicates whether or not to perform anti-aliasing
 * default is false (true in Safari)
 *
 * premultipliedAlpha - indicates that the page compositor will assume
 * the drawing buffer contains colors with pre-multiplied alpha
 * default is false
 *
 * preserveDrawingBuffer - if true the buffers will not be cleared and
 * and will preserve their values until cleared or overwritten by author
 * (note that p5 clears automatically on draw loop)
 * default is true
 *
 * perPixelLighting - if true, per-pixel lighting will be used in the
 * lighting shader otherwise per-vertex lighting is used.
 * default is true.
 *
 * @method setAttributes
 * @for p5
 * @param  {String}  key Name of attribute
 * @param  {Boolean}        value New value of named attribute
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(255);
 *   push();
 *   rotateZ(frameCount * 0.02);
 *   rotateX(frameCount * 0.02);
 *   rotateY(frameCount * 0.02);
 *   fill(0, 0, 0);
 *   box(50);
 *   pop();
 * }
 * </code>
 * </div>
 * <br>
 * Now with the antialias attribute set to true.
 * <br>
 * <div>
 * <code>
 * function setup() {
 *   setAttributes('antialias', true);
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(255);
 *   push();
 *   rotateZ(frameCount * 0.02);
 *   rotateX(frameCount * 0.02);
 *   rotateY(frameCount * 0.02);
 *   fill(0, 0, 0);
 *   box(50);
 *   pop();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // press the mouse button to disable perPixelLighting
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   fill(255);
 * }
 *
 * let lights = [
 *   { c: '#f00', t: 1.12, p: 1.91, r: 0.2 },
 *   { c: '#0f0', t: 1.21, p: 1.31, r: 0.2 },
 *   { c: '#00f', t: 1.37, p: 1.57, r: 0.2 },
 *   { c: '#ff0', t: 1.12, p: 1.91, r: 0.7 },
 *   { c: '#0ff', t: 1.21, p: 1.31, r: 0.7 },
 *   { c: '#f0f', t: 1.37, p: 1.57, r: 0.7 }
 * ];
 *
 * function draw() {
 *   let t = millis() / 1000 + 1000;
 *   background(0);
 *   directionalLight(color('#222'), 1, 1, 1);
 *
 *   for (let i = 0; i < lights.length; i++) {
 *     let light = lights[i];
 *     pointLight(
 *       color(light.c),
 *       p5.Vector.fromAngles(t * light.t, t * light.p, width * light.r)
 *     );
 *   }
 *
 *   specularMaterial(255);
 *   sphere(width * 0.1);
 *
 *   rotateX(t * 0.77);
 *   rotateY(t * 0.83);
 *   rotateZ(t * 0.91);
 *   torus(width * 0.3, width * 0.07, 24, 10);
 * }
 *
 * function mousePressed() {
 *   setAttributes('perPixelLighting', false);
 *   noStroke();
 *   fill(255);
 * }
 * function mouseReleased() {
 *   setAttributes('perPixelLighting', true);
 *   noStroke();
 *   fill(255);
 * }
 * </code>
 * </div>
 *
 * @alt a rotating cube with smoother edges
 */
/**
 * @method setAttributes
 * @for p5
 * @param  {Object}  obj object with key-value pairs
 */

p5.prototype.setAttributes = function(key, value) {
  if (typeof this._glAttributes === 'undefined') {
    console.log(
      'You are trying to use setAttributes on a p5.Graphics object ' +
        'that does not use a WEBGL renderer.'
    );
    return;
  }
  let unchanged = true;
  if (typeof value !== 'undefined') {
    //first time modifying the attributes
    if (this._glAttributes === null) {
      this._glAttributes = {};
    }
    if (this._glAttributes[key] !== value) {
      //changing value of previously altered attribute
      this._glAttributes[key] = value;
      unchanged = false;
    }
    //setting all attributes with some change
  } else if (key instanceof Object) {
    if (this._glAttributes !== key) {
      this._glAttributes = key;
      unchanged = false;
    }
  }
  //@todo_FES
  if (!this._renderer.isP3D || unchanged) {
    return;
  }

  if (!this._setupDone) {
    for (const x in this._renderer.retainedMode.geometry) {
      if (this._renderer.retainedMode.geometry.hasOwnProperty(x)) {
        console.error(
          'Sorry, Could not set the attributes, you need to call setAttributes() ' +
            'before calling the other drawing methods in setup()'
        );
        return;
      }
    }
  }

  this.push();
  this._renderer._resetContext();
  this.pop();

  if (this._renderer._curCamera) {
    this._renderer._curCamera._renderer = this._renderer;
  }
};

/**
 * @class p5.RendererGL
 */

p5.RendererGL.prototype._update = function() {
  // reset model view and apply initial camera transform
  // (containing only look at info; no projection).
  this.uMVMatrix.set(
    this._curCamera.cameraMatrix.mat4[0],
    this._curCamera.cameraMatrix.mat4[1],
    this._curCamera.cameraMatrix.mat4[2],
    this._curCamera.cameraMatrix.mat4[3],
    this._curCamera.cameraMatrix.mat4[4],
    this._curCamera.cameraMatrix.mat4[5],
    this._curCamera.cameraMatrix.mat4[6],
    this._curCamera.cameraMatrix.mat4[7],
    this._curCamera.cameraMatrix.mat4[8],
    this._curCamera.cameraMatrix.mat4[9],
    this._curCamera.cameraMatrix.mat4[10],
    this._curCamera.cameraMatrix.mat4[11],
    this._curCamera.cameraMatrix.mat4[12],
    this._curCamera.cameraMatrix.mat4[13],
    this._curCamera.cameraMatrix.mat4[14],
    this._curCamera.cameraMatrix.mat4[15]
  );

  // reset light data for new frame.

  this.ambientLightColors.length = 0;
  this.specularColors = [1, 1, 1];

  this.directionalLightDirections.length = 0;
  this.directionalLightDiffuseColors.length = 0;
  this.directionalLightSpecularColors.length = 0;

  this.pointLightPositions.length = 0;
  this.pointLightDiffuseColors.length = 0;
  this.pointLightSpecularColors.length = 0;

  this.spotLightPositions.length = 0;
  this.spotLightDirections.length = 0;
  this.spotLightDiffuseColors.length = 0;
  this.spotLightSpecularColors.length = 0;
  this.spotLightAngle.length = 0;
  this.spotLightConc.length = 0;

  this._enableLighting = false;

  //reset tint value for new frame
  this._tint = [255, 255, 255, 255];

  //Clear depth every frame
  this.GL.clear(this.GL.DEPTH_BUFFER_BIT);
};

/**
 * [background description]
 */
p5.RendererGL.prototype.background = function(...args) {
  const _col = this._pInst.color(...args);
  const _r = _col.levels[0] / 255;
  const _g = _col.levels[1] / 255;
  const _b = _col.levels[2] / 255;
  const _a = _col.levels[3] / 255;
  this.GL.clearColor(_r, _g, _b, _a);

  this.GL.clear(this.GL.COLOR_BUFFER_BIT);
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////
/**
 * Basic fill material for geometry with a given color
 * @method  fill
 * @class p5.RendererGL
 * @param  {Number|Number[]|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] green or saturation value
 * @param  {Number}            [v3] blue or brightness value
 * @param  {Number}            [a]  opacity
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 * }
 *
 * function draw() {
 *   background(0);
 *   noStroke();
 *   fill(100, 100, 240);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(75, 75, 75);
 * }
 * </code>
 * </div>
 *
 * @alt
 * black canvas with purple cube spinning
 */
p5.RendererGL.prototype.fill = function(v1, v2, v3, a) {
  //see material.js for more info on color blending in webgl
  const color = p5.prototype.color.apply(this._pInst, arguments);
  this.curFillColor = color._array;
  this.drawMode = constants.FILL;
  this._useNormalMaterial = false;
  this._tex = null;
};

/**
 * Basic stroke material for geometry with a given color
 * @method  stroke
 * @param  {Number|Number[]|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] green or saturation value
 * @param  {Number}            [v3] blue or brightness value
 * @param  {Number}            [a]  opacity
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 * }
 *
 * function draw() {
 *   background(0);
 *   stroke(240, 150, 150);
 *   fill(100, 100, 240);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(75, 75, 75);
 * }
 * </code>
 * </div>
 *
 * @alt
 * black canvas with purple cube with pink outline spinning
 */
p5.RendererGL.prototype.stroke = function(r, g, b, a) {
  //@todo allow transparency in stroking currently doesn't have
  //any impact and causes problems with specularMaterial
  arguments[3] = 255;
  const color = p5.prototype.color.apply(this._pInst, arguments);
  this.curStrokeColor = color._array;
};

p5.RendererGL.prototype.strokeCap = function(cap) {
  // @TODO : to be implemented
  console.error('Sorry, strokeCap() is not yet implemented in WEBGL mode');
};

p5.RendererGL.prototype.strokeJoin = function(join) {
  // @TODO : to be implemented
  // https://processing.org/reference/strokeJoin_.html
  console.error('Sorry, strokeJoin() is not yet implemented in WEBGL mode');
};

p5.RendererGL.prototype.filter = function(filterType) {
  // filter can be achieved using custom shaders.
  // https://github.com/aferriss/p5jsShaderExamples
  // https://itp-xstory.github.io/p5js-shaders/#/
  console.error('filter() does not work in WEBGL mode');
};

p5.RendererGL.prototype.blendMode = function(mode) {
  if (
    mode === constants.DARKEST ||
    mode === constants.LIGHTEST ||
    mode === constants.ADD ||
    mode === constants.BLEND ||
    mode === constants.SUBTRACT ||
    mode === constants.SCREEN ||
    mode === constants.EXCLUSION ||
    mode === constants.REPLACE ||
    mode === constants.MULTIPLY ||
    mode === constants.REMOVE
  )
    this.curBlendMode = mode;
  else if (
    mode === constants.BURN ||
    mode === constants.OVERLAY ||
    mode === constants.HARD_LIGHT ||
    mode === constants.SOFT_LIGHT ||
    mode === constants.DODGE
  ) {
    console.warn(
      'BURN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, and DODGE only work for blendMode in 2D mode.'
    );
  }
};

p5.RendererGL.prototype.erase = function(opacityFill, opacityStroke) {
  if (!this._isErasing) {
    this._applyBlendMode(constants.REMOVE);
    this._isErasing = true;

    this._cachedFillStyle = this.curFillColor.slice();
    this.curFillColor = [1, 1, 1, opacityFill / 255];

    this._cachedStrokeStyle = this.curStrokeColor.slice();
    this.curStrokeColor = [1, 1, 1, opacityStroke / 255];
  }
};

p5.RendererGL.prototype.noErase = function() {
  if (this._isErasing) {
    this._isErasing = false;
    this.curFillColor = this._cachedFillStyle.slice();
    this.curStrokeColor = this._cachedStrokeStyle.slice();
    this.blendMode(this._cachedBlendMode);
  }
};

/**
 * Change weight of stroke
 * @method  strokeWeight
 * @param  {Number} stroke weight to be used for drawing
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(200, 400, WEBGL);
 *   setAttributes('antialias', true);
 * }
 *
 * function draw() {
 *   background(0);
 *   noStroke();
 *   translate(0, -100, 0);
 *   stroke(240, 150, 150);
 *   fill(100, 100, 240);
 *   push();
 *   strokeWeight(8);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   sphere(75);
 *   pop();
 *   push();
 *   translate(0, 200, 0);
 *   strokeWeight(1);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   sphere(75);
 *   pop();
 * }
 * </code>
 * </div>
 *
 * @alt
 * black canvas with two purple rotating spheres with pink
 * outlines the sphere on top has much heavier outlines,
 */
p5.RendererGL.prototype.strokeWeight = function(w) {
  if (this.curStrokeWeight !== w) {
    this.pointSize = w;
    this.curStrokeWeight = w;
  }
};

// x,y are canvas-relative (pre-scaled by _pixelDensity)
p5.RendererGL.prototype._getPixel = function(x, y) {
  let imageData, index;
  imageData = new Uint8Array(4);
  // prettier-ignore
  this.drawingContext.readPixels(
      x, y, 1, 1,
      this.drawingContext.RGBA, this.drawingContext.UNSIGNED_BYTE,
      imageData
    );
  index = 0;
  return [
    imageData[index + 0],
    imageData[index + 1],
    imageData[index + 2],
    imageData[index + 3]
  ];
};

/**
 * Loads the pixels data for this canvas into the pixels[] attribute.
 * Note that updatePixels() and set() do not work.
 * Any pixel manipulation must be done directly to the pixels[] array.
 *
 * @private
 * @method loadPixels
 */

p5.RendererGL.prototype.loadPixels = function() {
  const pixelsState = this._pixelsState;

  //@todo_FES
  if (this._pInst._glAttributes.preserveDrawingBuffer !== true) {
    console.log(
      'loadPixels only works in WebGL when preserveDrawingBuffer ' + 'is true.'
    );
    return;
  }

  //if there isn't a renderer-level temporary pixels buffer
  //make a new one
  let pixels = pixelsState.pixels;
  const len = this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4;
  if (!(pixels instanceof Uint8Array) || pixels.length !== len) {
    pixels = new Uint8Array(len);
    this._pixelsState._setProperty('pixels', pixels);
  }

  const pd = this._pInst._pixelDensity;
  // prettier-ignore
  this.GL.readPixels(
    0, 0, this.width * pd, this.height * pd,
    this.GL.RGBA, this.GL.UNSIGNED_BYTE,
    pixels
  );
};

//////////////////////////////////////////////
// HASH | for geometry
//////////////////////////////////////////////

p5.RendererGL.prototype.geometryInHash = function(gId) {
  return this.retainedMode.geometry[gId] !== undefined;
};

/**
 * [resize description]
 * @private
 * @param  {Number} w [description]
 * @param  {Number} h [description]
 */
p5.RendererGL.prototype.resize = function(w, h) {
  p5.Renderer.prototype.resize.call(this, w, h);
  this.GL.viewport(
    0,
    0,
    this.GL.drawingBufferWidth,
    this.GL.drawingBufferHeight
  );
  this._viewport = this.GL.getParameter(this.GL.VIEWPORT);

  this._curCamera._resize();

  //resize pixels buffer
  const pixelsState = this._pixelsState;
  if (typeof pixelsState.pixels !== 'undefined') {
    pixelsState._setProperty(
      'pixels',
      new Uint8Array(
        this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4
      )
    );
  }
};

/**
 * clears color and depth buffers
 * with r,g,b,a
 * @private
 * @param {Number} r normalized red val.
 * @param {Number} g normalized green val.
 * @param {Number} b normalized blue val.
 * @param {Number} a normalized alpha val.
 */
p5.RendererGL.prototype.clear = function(...args) {
  const _r = args[0] || 0;
  const _g = args[1] || 0;
  const _b = args[2] || 0;
  const _a = args[3] || 0;

  this.GL.clearColor(_r, _g, _b, _a);
  this.GL.clearDepth(1);
  this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
};

p5.RendererGL.prototype.applyMatrix = function(a, b, c, d, e, f) {
  if (arguments.length === 16) {
    p5.Matrix.prototype.apply.apply(this.uMVMatrix, arguments);
  } else {
    // prettier-ignore
    this.uMVMatrix.apply([
      a, b, 0, 0,
      c, d, 0, 0,
      0, 0, 1, 0,
      e, f, 0, 1,
    ]);
  }
};

/**
 * [translate description]
 * @private
 * @param  {Number} x [description]
 * @param  {Number} y [description]
 * @param  {Number} z [description]
 * @chainable
 * @todo implement handle for components or vector as args
 */
p5.RendererGL.prototype.translate = function(x, y, z) {
  if (x instanceof p5.Vector) {
    z = x.z;
    y = x.y;
    x = x.x;
  }
  this.uMVMatrix.translate([x, y, z]);
  return this;
};

/**
 * Scales the Model View Matrix by a vector
 * @private
 * @param  {Number | p5.Vector | Array} x [description]
 * @param  {Number} [y] y-axis scalar
 * @param  {Number} [z] z-axis scalar
 * @chainable
 */
p5.RendererGL.prototype.scale = function(x, y, z) {
  this.uMVMatrix.scale(x, y, z);
  return this;
};

p5.RendererGL.prototype.rotate = function(rad, axis) {
  if (typeof axis === 'undefined') {
    return this.rotateZ(rad);
  }
  p5.Matrix.prototype.rotate.apply(this.uMVMatrix, arguments);
  return this;
};

p5.RendererGL.prototype.rotateX = function(rad) {
  this.rotate(rad, 1, 0, 0);
  return this;
};

p5.RendererGL.prototype.rotateY = function(rad) {
  this.rotate(rad, 0, 1, 0);
  return this;
};

p5.RendererGL.prototype.rotateZ = function(rad) {
  this.rotate(rad, 0, 0, 1);
  return this;
};

p5.RendererGL.prototype.push = function() {
  // get the base renderer style
  const style = p5.Renderer.prototype.push.apply(this);

  // add webgl-specific style properties
  const properties = style.properties;

  properties.uMVMatrix = this.uMVMatrix.copy();
  properties.uPMatrix = this.uPMatrix.copy();
  properties._curCamera = this._curCamera;

  // make a copy of the current camera for the push state
  // this preserves any references stored using 'createCamera'
  this._curCamera = this._curCamera.copy();

  properties.ambientLightColors = this.ambientLightColors.slice();
  properties.specularColors = this.specularColors.slice();

  properties.directionalLightDirections = this.directionalLightDirections.slice();
  properties.directionalLightDiffuseColors = this.directionalLightDiffuseColors.slice();
  properties.directionalLightSpecularColors = this.directionalLightSpecularColors.slice();

  properties.pointLightPositions = this.pointLightPositions.slice();
  properties.pointLightDiffuseColors = this.pointLightDiffuseColors.slice();
  properties.pointLightSpecularColors = this.pointLightSpecularColors.slice();

  properties.spotLightPositions = this.spotLightPositions.slice();
  properties.spotLightDirections = this.spotLightDirections.slice();
  properties.spotLightDiffuseColors = this.spotLightDiffuseColors.slice();
  properties.spotLightSpecularColors = this.spotLightSpecularColors.slice();
  properties.spotLightAngle = this.spotLightAngle.slice();
  properties.spotLightConc = this.spotLightConc.slice();

  properties.userFillShader = this.userFillShader;
  properties.userStrokeShader = this.userStrokeShader;
  properties.userPointShader = this.userPointShader;

  properties.pointSize = this.pointSize;
  properties.curStrokeWeight = this.curStrokeWeight;
  properties.curStrokeColor = this.curStrokeColor;
  properties.curFillColor = this.curFillColor;

  properties._useSpecularMaterial = this._useSpecularMaterial;
  properties._useEmissiveMaterial = this._useEmissiveMaterial;
  properties._useShininess = this._useShininess;

  properties.constantAttenuation = this.constantAttenuation;
  properties.linearAttenuation = this.linearAttenuation;
  properties.quadraticAttenuation = this.quadraticAttenuation;

  properties._enableLighting = this._enableLighting;
  properties._useNormalMaterial = this._useNormalMaterial;
  properties._tex = this._tex;
  properties.drawMode = this.drawMode;

  properties._currentNormal = this._currentNormal;
  properties.curBlendMode = this.curBlendMode;

  return style;
};

p5.RendererGL.prototype.resetMatrix = function() {
  this.uMVMatrix = p5.Matrix.identity(this._pInst);
  return this;
};

//////////////////////////////////////////////
// SHADER
//////////////////////////////////////////////

/*
 * shaders are created and cached on a per-renderer basis,
 * on the grounds that each renderer will have its own gl context
 * and the shader must be valid in that context.
 */

p5.RendererGL.prototype._getImmediateStrokeShader = function() {
  // select the stroke shader to use
  const stroke = this.userStrokeShader;
  if (!stroke || !stroke.isStrokeShader()) {
    return this._getLineShader();
  }
  return stroke;
};

p5.RendererGL.prototype._getRetainedStrokeShader =
  p5.RendererGL.prototype._getImmediateStrokeShader;

/*
 * selects which fill shader should be used based on renderer state,
 * for use with begin/endShape and immediate vertex mode.
 */
p5.RendererGL.prototype._getImmediateFillShader = function() {
  const fill = this.userFillShader;
  if (this._useNormalMaterial) {
    if (!fill || !fill.isNormalShader()) {
      return this._getNormalShader();
    }
  }
  if (this._enableLighting) {
    if (!fill || !fill.isLightShader()) {
      return this._getLightShader();
    }
  } else if (this._tex) {
    if (!fill || !fill.isTextureShader()) {
      return this._getLightShader();
    }
  } else if (!fill /*|| !fill.isColorShader()*/) {
    return this._getImmediateModeShader();
  }
  return fill;
};

/*
 * selects which fill shader should be used based on renderer state
 * for retained mode.
 */
p5.RendererGL.prototype._getRetainedFillShader = function() {
  if (this._useNormalMaterial) {
    return this._getNormalShader();
  }

  const fill = this.userFillShader;
  if (this._enableLighting) {
    if (!fill || !fill.isLightShader()) {
      return this._getLightShader();
    }
  } else if (this._tex) {
    if (!fill || !fill.isTextureShader()) {
      return this._getLightShader();
    }
  } else if (!fill /* || !fill.isColorShader()*/) {
    return this._getColorShader();
  }
  return fill;
};

p5.RendererGL.prototype._getImmediatePointShader = function() {
  // select the point shader to use
  const point = this.userPointShader;
  if (!point || !point.isPointShader()) {
    return this._getPointShader();
  }
  return point;
};

p5.RendererGL.prototype._getRetainedLineShader =
  p5.RendererGL.prototype._getImmediateLineShader;

p5.RendererGL.prototype._getLightShader = function() {
  if (!this._defaultLightShader) {
    if (this._pInst._glAttributes.perPixelLighting) {
      this._defaultLightShader = new p5.Shader(
        this,
        defaultShaders.phongVert,
        defaultShaders.phongFrag
      );
    } else {
      this._defaultLightShader = new p5.Shader(
        this,
        defaultShaders.lightVert,
        defaultShaders.lightTextureFrag
      );
    }
  }

  return this._defaultLightShader;
};

p5.RendererGL.prototype._getImmediateModeShader = function() {
  if (!this._defaultImmediateModeShader) {
    this._defaultImmediateModeShader = new p5.Shader(
      this,
      defaultShaders.immediateVert,
      defaultShaders.vertexColorFrag
    );
  }

  return this._defaultImmediateModeShader;
};

p5.RendererGL.prototype._getNormalShader = function() {
  if (!this._defaultNormalShader) {
    this._defaultNormalShader = new p5.Shader(
      this,
      defaultShaders.normalVert,
      defaultShaders.normalFrag
    );
  }

  return this._defaultNormalShader;
};

p5.RendererGL.prototype._getColorShader = function() {
  if (!this._defaultColorShader) {
    this._defaultColorShader = new p5.Shader(
      this,
      defaultShaders.normalVert,
      defaultShaders.basicFrag
    );
  }

  return this._defaultColorShader;
};

p5.RendererGL.prototype._getPointShader = function() {
  if (!this._defaultPointShader) {
    this._defaultPointShader = new p5.Shader(
      this,
      defaultShaders.pointVert,
      defaultShaders.pointFrag
    );
  }
  return this._defaultPointShader;
};

p5.RendererGL.prototype._getLineShader = function() {
  if (!this._defaultLineShader) {
    this._defaultLineShader = new p5.Shader(
      this,
      defaultShaders.lineVert,
      defaultShaders.lineFrag
    );
  }

  return this._defaultLineShader;
};

p5.RendererGL.prototype._getFontShader = function() {
  if (!this._defaultFontShader) {
    this.GL.getExtension('OES_standard_derivatives');
    this._defaultFontShader = new p5.Shader(
      this,
      defaultShaders.fontVert,
      defaultShaders.fontFrag
    );
  }
  return this._defaultFontShader;
};

p5.RendererGL.prototype._getEmptyTexture = function() {
  if (!this._emptyTexture) {
    // a plain white texture RGBA, full alpha, single pixel.
    const im = new p5.Image(1, 1);
    im.set(0, 0, 255);
    this._emptyTexture = new p5.Texture(this, im);
  }
  return this._emptyTexture;
};

p5.RendererGL.prototype.getTexture = function(img) {
  const textures = this.textures;

  for (const texture of textures) {
    if (texture.src === img) return texture;
  }

  const tex = new p5.Texture(this, img);
  textures.push(tex);
  return tex;
};

p5.RendererGL.prototype._setStrokeUniforms = function(strokeShader) {
  strokeShader.bindShader();

  // set the uniform values
  strokeShader.setUniform('uMaterialColor', this.curStrokeColor);
  strokeShader.setUniform('uStrokeWeight', this.curStrokeWeight);
};

p5.RendererGL.prototype._setFillUniforms = function(fillShader) {
  fillShader.bindShader();

  // TODO: optimize
  fillShader.setUniform('uMaterialColor', this.curFillColor);
  fillShader.setUniform('isTexture', !!this._tex);
  if (this._tex) {
    fillShader.setUniform('uSampler', this._tex);
  }
  fillShader.setUniform('uTint', this._tint);

  fillShader.setUniform('uSpecular', this._useSpecularMaterial);
  fillShader.setUniform('uEmissive', this._useEmissiveMaterial);
  fillShader.setUniform('uShininess', this._useShininess);

  fillShader.setUniform('uUseLighting', this._enableLighting);

  const pointLightCount = this.pointLightDiffuseColors.length / 3;
  fillShader.setUniform('uPointLightCount', pointLightCount);
  fillShader.setUniform('uPointLightLocation', this.pointLightPositions);
  fillShader.setUniform(
    'uPointLightDiffuseColors',
    this.pointLightDiffuseColors
  );
  fillShader.setUniform(
    'uPointLightSpecularColors',
    this.pointLightSpecularColors
  );

  const directionalLightCount = this.directionalLightDiffuseColors.length / 3;
  fillShader.setUniform('uDirectionalLightCount', directionalLightCount);
  fillShader.setUniform('uLightingDirection', this.directionalLightDirections);
  fillShader.setUniform(
    'uDirectionalDiffuseColors',
    this.directionalLightDiffuseColors
  );
  fillShader.setUniform(
    'uDirectionalSpecularColors',
    this.directionalLightSpecularColors
  );

  // TODO: sum these here...
  const ambientLightCount = this.ambientLightColors.length / 3;
  fillShader.setUniform('uAmbientLightCount', ambientLightCount);
  fillShader.setUniform('uAmbientColor', this.ambientLightColors);

  const spotLightCount = this.spotLightDiffuseColors.length / 3;
  fillShader.setUniform('uSpotLightCount', spotLightCount);
  fillShader.setUniform('uSpotLightAngle', this.spotLightAngle);
  fillShader.setUniform('uSpotLightConc', this.spotLightConc);
  fillShader.setUniform('uSpotLightDiffuseColors', this.spotLightDiffuseColors);
  fillShader.setUniform(
    'uSpotLightSpecularColors',
    this.spotLightSpecularColors
  );
  fillShader.setUniform('uSpotLightLocation', this.spotLightPositions);
  fillShader.setUniform('uSpotLightDirection', this.spotLightDirections);

  fillShader.setUniform('uConstantAttenuation', this.constantAttenuation);
  fillShader.setUniform('uLinearAttenuation', this.linearAttenuation);
  fillShader.setUniform('uQuadraticAttenuation', this.quadraticAttenuation);

  fillShader.bindTextures();
};

p5.RendererGL.prototype._setPointUniforms = function(pointShader) {
  pointShader.bindShader();

  // set the uniform values
  pointShader.setUniform('uMaterialColor', this.curStrokeColor);
  // @todo is there an instance where this isn't stroke weight?
  // should be they be same var?
  pointShader.setUniform(
    'uPointSize',
    this.pointSize * this._pInst._pixelDensity
  );
};

/* Binds a buffer to the drawing context
 * when passed more than two arguments it also updates or initializes
 * the data associated with the buffer
 */
p5.RendererGL.prototype._bindBuffer = function(
  buffer,
  target,
  values,
  type,
  usage
) {
  if (!target) target = this.GL.ARRAY_BUFFER;
  this.GL.bindBuffer(target, buffer);
  if (values !== undefined) {
    const data = new (type || Float32Array)(values);
    this.GL.bufferData(target, data, usage || this.GL.STATIC_DRAW);
  }
};

///////////////////////////////
//// UTILITY FUNCTIONS
//////////////////////////////
p5.RendererGL.prototype._arraysEqual = function(a, b) {
  const aLength = a.length;
  if (aLength !== b.length) return false;
  for (let i = 0; i < aLength; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

p5.RendererGL.prototype._isTypedArray = function(arr) {
  let res = false;
  res = arr instanceof Float32Array;
  res = arr instanceof Float64Array;
  res = arr instanceof Int16Array;
  res = arr instanceof Uint16Array;
  res = arr instanceof Uint32Array;
  return res;
};
/**
 * turn a two dimensional array into one dimensional array
 * @private
 * @param  {Array} arr 2-dimensional array
 * @return {Array}     1-dimensional array
 * [[1, 2, 3],[4, 5, 6]] -> [1, 2, 3, 4, 5, 6]
 */
p5.RendererGL.prototype._flatten = function(arr) {
  //when empty, return empty
  if (arr.length === 0) {
    return [];
  } else if (arr.length > 20000) {
    //big models , load slower to avoid stack overflow
    //faster non-recursive flatten via axelduch
    //stackoverflow.com/questions/27266550/how-to-flatten-nested-array-in-javascript
    const toString = Object.prototype.toString;
    const arrayTypeStr = '[object Array]';
    const result = [];
    const nodes = arr.slice();
    let node;
    node = nodes.pop();
    do {
      if (toString.call(node) === arrayTypeStr) {
        nodes.push(...node);
      } else {
        result.push(node);
      }
    } while (nodes.length && (node = nodes.pop()) !== undefined);
    result.reverse(); // we reverse result to restore the original order
    return result;
  } else {
    //otherwise if model within limits for browser
    //use faster recursive loading
    return [].concat(...arr);
  }
};

/**
 * turn a p5.Vector Array into a one dimensional number array
 * @private
 * @param  {p5.Vector[]} arr  an array of p5.Vector
 * @return {Number[]}     a one dimensional array of numbers
 * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
 * [1, 2, 3, 4, 5, 6]
 */
p5.RendererGL.prototype._vToNArray = function(arr) {
  const ret = [];

  for (const item of arr) {
    ret.push(item.x, item.y, item.z);
  }

  return ret;
};

/**
 * ensures that p5 is using a 3d renderer. throws an error if not.
 */
p5.prototype._assert3d = function(name) {
  if (!this._renderer.isP3D)
    throw new Error(
      `${name}() is only supported in WEBGL mode. If you'd like to use 3D graphics and WebGL, see  https://p5js.org/examples/form-3d-primitives.html for more information.`
    );
};

// function to initialize GLU Tesselator

p5.RendererGL.prototype._initTessy = function initTesselator() {
  // function called for each vertex of tesselator output
  function vertexCallback(data, polyVertArray) {
    polyVertArray[polyVertArray.length] = data[0];
    polyVertArray[polyVertArray.length] = data[1];
    polyVertArray[polyVertArray.length] = data[2];
  }

  function begincallback(type) {
    if (type !== libtess.primitiveType.GL_TRIANGLES) {
      console.log(`expected TRIANGLES but got type: ${type}`);
    }
  }

  function errorcallback(errno) {
    console.log('error callback');
    console.log(`error number: ${errno}`);
  }
  // callback for when segments intersect and must be split
  function combinecallback(coords, data, weight) {
    return [coords[0], coords[1], coords[2]];
  }

  function edgeCallback(flag) {
    // don't really care about the flag, but need no-strip/no-fan behavior
  }

  const tessy = new libtess.GluTesselator();
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

  return tessy;
};

p5.RendererGL.prototype._triangulate = function(contours) {
  // libtess will take 3d verts and flatten to a plane for tesselation
  // since only doing 2d tesselation here, provide z=1 normal to skip
  // iterating over verts only to get the same answer.
  // comment out to test normal-generation code
  this._tessy.gluTessNormal(0, 0, 1);

  const triangleVerts = [];
  this._tessy.gluTessBeginPolygon(triangleVerts);

  for (let i = 0; i < contours.length; i++) {
    this._tessy.gluTessBeginContour();
    const contour = contours[i];
    for (let j = 0; j < contour.length; j += 3) {
      const coords = [contour[j], contour[j + 1], contour[j + 2]];
      this._tessy.gluTessVertex(coords, coords);
    }
    this._tessy.gluTessEndContour();
  }

  // finish polygon
  this._tessy.gluTessEndPolygon();

  return triangleVerts;
};

// function to calculate BezierVertex Coefficients
p5.RendererGL.prototype._bezierCoefficients = function(t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  return [mt3, 3 * mt2 * t, 3 * mt * t2, t3];
};

// function to calculate QuadraticVertex Coefficients
p5.RendererGL.prototype._quadraticCoefficients = function(t) {
  const t2 = t * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  return [mt2, 2 * mt * t, t2];
};

// function to convert Bezier coordinates to Catmull Rom Splines
p5.RendererGL.prototype._bezierToCatmull = function(w) {
  const p1 = w[1];
  const p2 = w[1] + (w[2] - w[0]) / this._curveTightness;
  const p3 = w[2] - (w[3] - w[1]) / this._curveTightness;
  const p4 = w[2];
  const p = [p1, p2, p3, p4];
  return p;
};

export default p5.RendererGL;
