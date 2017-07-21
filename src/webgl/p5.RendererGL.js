'use strict';

var p5 = require('../core/core');
var shader = require('./shader');
require('../core/p5.Renderer');
require('./p5.Matrix');
var uMVMatrixStack = [];

/**
 * 3D graphics class
 * @class p5.RendererGL
 * @constructor
 * @extends p5.Renderer
 * @todo extend class to include public method for offscreen
 * rendering (FBO).
 *
 */
p5.RendererGL = function(elt, pInst, isMainCanvas, attr) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this.attributes = {};
  attr = attr || {};
  this.attributes.alpha = attr.alpha ===
    undefined ? true : attr.alpha;
  this.attributes.depth = attr.depth ===
    undefined ? true : attr.depth;
  this.attributes.stencil = attr.stencil ===
    undefined ? true : attr.stencil;
  this.attributes.antialias = attr.antialias ===
    undefined ? false : attr.antialias;
  this.attributes.premultipliedAlpha = attr.premultipliedAlpha ===
    undefined ? false : attr.premultipliedAlpha;
  this.attributes.preserveDrawingBuffer = attr.preserveDrawingBuffer ===
    undefined ? true : attr.preserveDrawingBuffer;
  this._initContext();
  this.isP3D = true; //lets us know we're in 3d mode
  this.GL = this.drawingContext;
  //lights
  this.ambientLightCount = 0;
  this.directionalLightCount = 0;
  this.pointLightCount = 0;
  //camera
  this._curCamera = null;
  /**
   * model view, projection, & normal
   * matrices
   */
  this.uMVMatrix = new p5.Matrix();
  this.uPMatrix  = new p5.Matrix();
  this.uNMatrix = new p5.Matrix('mat3');
  //Geometry & Material hashes
  this.gHash = {};
  this.mHash = {};
  //Imediate Mode
  //default drawing is done in Retained Mode
  this.isImmediateDrawing = false;
  this.immediateMode = {};
  this.curFillColor = [0.5,0.5,0.5,1.0];
  this.curStrokeColor = [0.5,0.5,0.5,1.0];
  this.pointSize = 5.0;//default point/stroke

  this.emptyTexture = null;
  this.curShader = null;

  return this;
};

p5.RendererGL.prototype = Object.create(p5.Renderer.prototype);

//////////////////////////////////////////////
// Setting
//////////////////////////////////////////////

p5.RendererGL.prototype._initContext = function() {
  try {
    this.drawingContext = this.canvas.getContext('webgl', this.attributes) ||
      this.canvas.getContext('experimental-webgl', this.attributes);
    if (this.drawingContext === null) {
      throw new Error('Error creating webgl context');
    } else {
      console.log('p5.RendererGL: enabled webgl context');
      var gl = this.drawingContext;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  } catch (er) {
    throw new Error(er);
  }
};

//This is helper function to reset the context anytime the attributes
//are changed with setAttributes()

p5.RendererGL.prototype._resetContext = function(attr, options, callback) {
  var w = this.width;
  var h = this.height;
  var defaultId = this.canvas.id;
  var c = this.canvas;
  if(c){
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
  this._pInst._setProperty('_renderer', new p5.RendererGL(this._pInst.canvas,
    this._pInst, true, attr));
  this._pInst._isdefaultGraphics = true;
  this._pInst._renderer.resize(w, h);
  this._pInst._renderer._applyDefaults();
  this._pInst._elements.push(this._renderer);
  if(typeof callback === 'function') {
    //setTimeout with 0 forces the task to the back of the queue, this ensures that
    //we finish switching out the renderer
    setTimeout(function() {
      callback.apply(window._renderer, options);
    }, 0);
  }
};


/**
 *
 * Set attributes for the WebGL Drawing context.
 * This is a way of adjusting ways that the WebGL
 * renderer works to fine-tune the display and performance.
 * This should be put in setup().
 * The available attributes are:
 * <br>
 * alpha - indicates if the canvas contains an alpha buffer
 * default is true
 * <br><br>
 * depth - indicates whether the drawing buffer has a depth buffer
 * of at least 16 bits - default is true
 * <br><br>
 * stencil - indicates whether the drawing buffer has a stencil buffer
 * of at least 8 bits
 * <br><br>
 * antialias - indicates whether or not to perform anti-aliasing
 * default is false
 * <br><br>
 * premultipliedAlpha - indicates that the page compositor will assume
 * the drawing buffer contains colors with pre-multiplied alpha
 * default is false
 * <br><br>
 * preserveDrawingBuffer - if true the buffers will not be cleared and
 * and will preserve their values until cleared or overwritten by author
 * (note that p5 clears automatically on draw loop)
 * default is true
 * <br><br>
 *
 * <div>
 * <code>
 *  function setup() {
 *   createCanvas(150,150,WEBGL);
 *  }
 *
 *  function draw() {
 *   background(255);
 *   push();
 *   rotateZ(frameCount * 0.02);
 *   rotateX(frameCount * 0.02);
 *   rotateY(frameCount * 0.02);
 *   fill(0,0,0);
 *   box(50);
 *   pop();
 *  }
 * </code>
 * </div>
 * <br>
 * Now with the antialias attribute set to true.
 * <br>
 * <div>
 * <code>
 *  function setup() {
 *   createCanvas(150,150,WEBGL);
 *   setAttributes('antialias', true);
 *  }
 *
 *  function draw() {
 *   background(255);
 *   push();
 *   rotateZ(frameCount * 0.02);
 *   rotateX(frameCount * 0.02);
 *   rotateY(frameCount * 0.02);
 *   fill(0,0,0);
 *   box(50);
 *   pop();
 *  }
 * </code>
 * </div>
 *
 * @method setAttributes
 * @param  {String|Object}  String name of attribute or object with key-value pairs
 * @param  {Boolean}        New value of named attribute
 *
 */

p5.prototype.setAttributes = function() {
  //@todo_FES
  var attr = {};
  if(arguments.length === 2) {
    attr[arguments[0]] = arguments[1];
  }
  else if (arguments.length === 1) {
    attr = arguments[0];
  }
  this._renderer._resetContext(attr);
};

//detect if user didn't set the camera
//then call this function below
p5.RendererGL.prototype._setDefaultCamera = function(){
  if(this._curCamera === null){
    var _w = this.width;
    var _h = this.height;
    this.uPMatrix = p5.Matrix.identity();
    var cameraZ = (this.height / 2) / Math.tan(Math.PI * 30 / 180);
    this.uPMatrix.perspective(60 / 180 * Math.PI, _w / _h,
                              cameraZ * 0.1, cameraZ * 10);
    this._curCamera = 'default';
  }
};

p5.RendererGL.prototype._update = function() {
  this.uMVMatrix = p5.Matrix.identity();
  this.translate(0, 0, -(this.height / 2) / Math.tan(Math.PI * 30 / 180));
  this.ambientLightCount = 0;
  this.directionalLightCount = 0;
  this.pointLightCount = 0;
};

/**
 * [background description]
 * @return {[type]} [description]
 */
p5.RendererGL.prototype.background = function() {
  var gl = this.GL;
  var _col = this._pInst.color.apply(this._pInst, arguments);
  var _r = (_col.levels[0]) / 255;
  var _g = (_col.levels[1]) / 255;
  var _b = (_col.levels[2]) / 255;
  var _a = (_col.levels[3]) / 255;
  gl.clearColor(_r, _g, _b, _a);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

//@TODO implement this
// p5.RendererGL.prototype.clear = function() {
//@TODO
// };

//////////////////////////////////////////////
// SHADER
//////////////////////////////////////////////

/**
 * [_initShaders description]
 * @param  {string} vertId [description]
 * @param  {string} fragId [description]
 * @return {[type]}        [description]
 */
p5.RendererGL.prototype._initShaders =
function(vertId, fragId, isImmediateMode) {
  var gl = this.GL;
  //set up our default shaders by:
  // 1. create the shader,
  // 2. load the shader source,
  // 3. compile the shader
  var _vertShader = gl.createShader(gl.VERTEX_SHADER);
  //load in our default vertex shader
  gl.shaderSource(_vertShader, shader[vertId]);
  gl.compileShader(_vertShader);
  // if our vertex shader failed compilation?
  if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
    alert('Yikes! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_vertShader));
    return null;
  }

  var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  //load in our material frag shader
  gl.shaderSource(_fragShader, shader[fragId]);
  gl.compileShader(_fragShader);
  // if our frag shader failed compilation?
  if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
    alert('Darn! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_fragShader));
    return null;
  }

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, _vertShader);
  gl.attachShader(shaderProgram, _fragShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Snap! Error linking shader program');
  }

  shaderProgram.attributes = {};

  var numAttributes = gl.getProgramParameter(shaderProgram,
    gl.ACTIVE_ATTRIBUTES);
  for(var i = 0; i < numAttributes; ++i){
    var attributeInfo = gl.getActiveAttrib(shaderProgram, i);
    var name = attributeInfo.name;
    var location = gl.getAttribLocation(shaderProgram, name);
    var attribute = {};
    attribute.name = name;
    attribute.location = location;
    attribute.type = attributeInfo.type;
    attribute.size = attributeInfo.size;
    shaderProgram.attributes[name] = attribute;
  }

  // Inspect shader and cache uniform info

  shaderProgram.uniforms = {};

  var numUniforms = gl.getProgramParameter(shaderProgram,
    gl.ACTIVE_UNIFORMS);

  var samplerIndex = 0;
  for(i = 0; i < numUniforms; ++i){
    var uniformInfo = gl.getActiveUniform(shaderProgram, i);
    var uniform = {};
    uniform.location = gl.getUniformLocation(shaderProgram, uniformInfo.name);
    uniform.size = uniformInfo.size;
    var uniformName = uniformInfo.name;
    //uniforms thats are arrays have their name returned as
    //someUniform[0] which is a bit silly so we trim it
    //off here. The size property tells us that its an array
    //so we dont lose any information by doing this
    if(uniformInfo.size > 1) {
      uniformName = uniformName.substring(0,
        uniformName.indexOf('[0]'));
    }
    uniform.name = uniformName;
    uniform.type = uniformInfo.type;
    if(uniform.type === gl.SAMPLER_2D)
    {
      uniform.samplerIndex = samplerIndex;
      samplerIndex++;
    }
    shaderProgram.uniforms[uniformName] = uniform;
  }

  this._createEmptyTexture();

  return shaderProgram;
};


/**
 * Wrapper around gl.useProgram to make sure
 * we only switch shaders when neccessary
 */
p5.RendererGL.prototype._useShader =
function(shaderProgram){
  var gl = this.GL;
  if(shaderProgram === this.curShader) {
    return;
  }
  gl.useProgram(shaderProgram);
  this.curShader = shaderProgram;
  return shaderProgram;
};

p5.RendererGL.prototype._setMatrixUniforms =
function(shaderKey) {
  var shaderProgram = this.mHash[shaderKey];

  this._useShader(shaderProgram);
  this._setUniform('uProjectionMatrix', this.uPMatrix.mat4);
  this._setUniform('uModelViewMatrix', this.uMVMatrix.mat4);

  this.uNMatrix.inverseTranspose(this.uMVMatrix);
  this._setUniform('uNormalMatrix', this.uNMatrix.mat3);
};

/**
 * Wrapper around gl.uniform functions.
 * As we store uniform info in the shader we can use that
 * to do type checking on the supplied data and call
 * the appropriate function.
 */
p5.RendererGL.prototype._setUniform = function(uniformName, data)
{
  //@todo update all current gl.uniformXX calls

  var gl = this.GL;
  var shaderProgram = this.curShader;
  if(!this.curShader) {
    //@todo warning?
    return;
  }
  var uniform = shaderProgram.uniforms[uniformName];
  if(!uniform) {
    //@todo warning?
    return;
  }
  var location = uniform.location;

  switch(uniform.type){
    case gl.BOOL:{
      if(data === true) {
        gl.uniform1i(location, 1);
      }
      else {
        gl.uniform1i(location, 0);
      }
      return;
    }
    case gl.INT:{
      gl.uniform1i(location, data);
      break;
    }
    case gl.FLOAT:{
      if(uniform.size > 1){
        gl.uniform1fv(location, data);
      }
      else{
        gl.uniform1f(location, data);
      }
      break;
    }
    case gl.FLOAT_MAT3:{
      gl.uniformMatrix3fv(location, false, data);
      break;
    }
    case gl.FLOAT_MAT4:{
      gl.uniformMatrix4fv(location, false, data);
      break;
    }
    case gl.FLOAT_VEC2:{
      if(uniform.size > 1){
        gl.uniform2fv(location, data);
      }
      else{
        gl.uniform2f(location, data[0], data[1]);
      }
      break;
    }
    case gl.FLOAT_VEC3:{
      if(uniform.size > 1){
        gl.uniform3fv(location, data);
      }
      else{
        gl.uniform3f(location, data[0], data[1], data[2]);
      }
      break;
    }
    case gl.FLOAT_VEC4:{
      if(uniform.size > 1){
        gl.uniform4fv(location, data);
      }
      else{
        gl.uniform4f(location, data[0], data[1], data[2], data[3]);
      }
      break;
    }
    case gl.SAMPLER_2D:{
      gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
      gl.bindTexture(gl.TEXTURE_2D, data);
      gl.uniform1i(location, uniform.samplerIndex);
      break;
    }
    //@todo complete all types
  }
};

//////////////////////////////////////////////
// GET CURRENT | for shader and color
//////////////////////////////////////////////
p5.RendererGL.prototype._getShader = function(vertId, fragId, isImmediateMode) {
  var mId = vertId + '|' + fragId;
  //create it and put it into hashTable
  if(!this.materialInHash(mId)){
    var shaderProgram = this._initShaders(vertId, fragId, isImmediateMode);
    this.mHash[mId] = shaderProgram;
    this.newShader = true;
  }
  this.curShaderId = mId;

  return this.mHash[this.curShaderId];
};

p5.RendererGL.prototype._getCurShaderId = function(){
  //if the shader ID is not yet defined
  if(this.drawMode !== 'fill' && this.curShaderId === undefined){
    //default shader: normalMaterial()
    this._getShader('normalVert', 'normalFrag');
  } else if(this.isImmediateDrawing && this.drawMode === 'fill'){
    // note that this._getShader will check if the shader already exists
    // by looking up the shader id (composed of vertexShaderId|fragmentShaderId)
    // in the material hash. If the material isn't found in the hash, it
    // creates a new one using this._initShaders--however, we'd like
    // use the cached version as often as possible, so we defer to this._getShader
    // here instead of calling this._initShaders directly.
    this._getShader('immediateVert', 'vertexColorFrag', true);
  }

  return this.curShaderId;
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////
/**
 * Basic fill material for geometry with a given color
 * @method  fill
 * @param  {Number|Array|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] optional: green or saturation value
 * @param  {Number}            [v3] optional: blue or brightness value
 * @param  {Number}            [a]  optional: opacity
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *  background(0);
 *  fill(250, 0, 0);
 *  rotateX(frameCount * 0.01);
 *  rotateY(frameCount * 0.01);
 *  rotateZ(frameCount * 0.01);
 *  box(200, 200, 200);
 * }
 * </code>
 * </div>
 *
 * @alt
 * red canvas
 *
 */
p5.RendererGL.prototype.fill = function(v1, v2, v3, a) {
  var shaderProgram;
  //see material.js for more info on color blending in webgl
  var colors = this._applyColorBlend.apply(this, arguments);
  this.curFillColor = colors;
  this.drawMode = 'fill';
  if(this.isImmediateDrawing){
    shaderProgram =
    this._getShader('immediateVert','vertexColorFrag');
    this._useShader(shaderProgram);
  } else {
    shaderProgram =
    this._getShader('normalVert', 'basicFrag');
    this._useShader(shaderProgram);
    //RetainedMode uses a webgl uniform to pass color vals
    //in ImmediateMode, we want access to each vertex so therefore
    //we cannot use a uniform.
    this._setUniform('uMaterialColor', colors);
  }
  return this;
};

p5.RendererGL.prototype.noFill = function() {
  var gl = this.GL;
  var shaderProgram =
    this._getShader('normalVert', 'basicFrag');
  this._useShader(shaderProgram);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  this.drawMode = 'wireframe';
  if(this.curStrokeColor) {
    this._setNoFillStroke();
  }
  return this;
};

p5.RendererGL.prototype.stroke = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = color._array;
  this.curStrokeColor = colorNormalized;
  if(this.drawMode === 'wireframe') {
    this._setNoFillStroke();
  }
  return this;
};

p5.RendererGL.prototype._setNoFillStroke = function() {
  var shaderProgram = this.mHash[this.curShaderId];
  this._useShader(shaderProgram);
  this._setUniform('uMaterialColor', this.curStrokeColor);
};

/**
/**
 * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
 * an image. If no parameters are specified, the entire image is returned.
 * Use the x and y parameters to get the value of one pixel. Get a section of
 * the display window by specifying additional w and h parameters. When
 * getting an image, the x and y parameters define the coordinates for the
 * upper-left corner of the image, regardless of the current imageMode().
 * <br><br>
 * If the pixel requested is outside of the image window, [0,0,0,255] is
 * returned.
 * <br><br>
 * Getting the color of a single pixel with get(x, y) is easy, but not as fast
 * as grabbing the data directly from pixels[]. The equivalent statement to
 * get(x, y) is using pixels[] with pixel density d
 *
 *
 * @method get
 * @param  {Number}               [x] x-coordinate of the pixel
 * @param  {Number}               [y] y-coordinate of the pixel
 * @param  {Number}               [w] width
 * @param  {Number}               [h] height
 * @return {Array|Color|p5.Image}     color of pixel at x,y in array format
 *                                    [R, G, B, A] or p5.Image
 */

p5.RendererGL.prototype.get = function(x, y, w, h) {
  return p5.Renderer2D.prototype.get.apply(this, [x, y, w, h]);
};

/**
 * Loads the pixels data for this canvas into the pixels[] attribute.
 * Note that updatePixels() and set() do not work.
 * Any pixel manipulation must be done directly to the pixels[] array.
 *
 * @method loadPixels
 * @param {Number} starting pixel x position, defaults to 0
 * @param {Number} starting pixel y position, defaults to 0
 * @param {Number} width of pixels to load, defaults to sketch width
 * @param {Number} height of pixels to load, defaults to sketch height
 *
 */

p5.RendererGL.prototype.loadPixels = function() {
  //@todo_FES
  if(this.attributes.preserveDrawingBuffer !== true) {
    console.log('loadPixels only works in WebGL when preserveDrawingBuffer ' +
      'is true.');
    return;
  }
  var pd = this._pInst._pixelDensity;
  var x = arguments[0] || 0;
  var y = arguments[1] || 0;
  var w = arguments[2] || this.width;
  var h = arguments[3] || this.height;
  w *= pd;
  h *= pd;
  var gl = this.GL;
  var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  this._pInst._setProperty('pixels', pixels);
};



/**
 * [strokeWeight description]
 * @param  {Number} pointSize stroke point size
 * @return {[type]}           [description]
 * @todo  strokeWeight currently works on points only.
 * implement on all wireframes and strokes.
 */
p5.RendererGL.prototype.strokeWeight = function(pointSize) {
  this.pointSize = pointSize;
  return this;
};
//////////////////////////////////////////////
// HASH | for material and geometry
//////////////////////////////////////////////

p5.RendererGL.prototype.geometryInHash = function(gId){
  return this.gHash[gId] !== undefined;
};

p5.RendererGL.prototype.materialInHash = function(mId){
  return this.mHash[mId] !== undefined;
};

/**
 * [resize description]
 * @param  {[type]} w [description]
 * @param  {[tyoe]} h [description]
 * @return {[type]}   [description]
 */
p5.RendererGL.prototype.resize = function(w,h) {
  var gl = this.GL;
  p5.Renderer.prototype.resize.call(this, w, h);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  // If we're using the default camera, update the aspect ratio
  if(this._curCamera === 'default') {
    this._curCamera = null;
    this._setDefaultCamera();
  }
};

/**
 * clears color and depth buffers
 * with r,g,b,a
 * @param {Number} r normalized red val.
 * @param {Number} g normalized green val.
 * @param {Number} b normalized blue val.
 * @param {Number} a normalized alpha val.
 */
p5.RendererGL.prototype.clear = function() {
  var gl = this.GL;
  gl.clearColor(arguments[0],
    arguments[1],
    arguments[2],
    arguments[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/**
 * [translate description]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @param  {[type]} z [description]
 * @return {[type]}   [description]
 * @todo implement handle for components or vector as args
 */
p5.RendererGL.prototype.translate = function(x, y, z) {
  this.uMVMatrix.translate([x,-y,z]);
  return this;
};

/**
 * Scales the Model View Matrix by a vector
 * @param  {Number | p5.Vector | Array} x [description]
 * @param  {Number} [y] y-axis scalar
 * @param  {Number} [z] z-axis scalar
 * @return {this}   [description]
 */
p5.RendererGL.prototype.scale = function(x,y,z) {
  this.uMVMatrix.scale([x,y,z]);
  return this;
};

p5.RendererGL.prototype.rotate = function(rad, axis){
  this.uMVMatrix.rotate(rad, axis);
  return this;
};

p5.RendererGL.prototype.rotateX = function(rad) {
  this.rotate(rad, [1,0,0]);
  return this;
};

p5.RendererGL.prototype.rotateY = function(rad) {
  this.rotate(rad, [0,1,0]);
  return this;
};

p5.RendererGL.prototype.rotateZ = function(rad) {
  this.rotate(rad, [0,0,1]);
  return this;
};

/**
 * pushes a copy of the model view matrix onto the
 * MV Matrix stack.
 */
p5.RendererGL.prototype.push = function() {
  uMVMatrixStack.push(this.uMVMatrix.copy());
};

/**
 * [pop description]
 * @return {[type]} [description]
 */
p5.RendererGL.prototype.pop = function() {
  if (uMVMatrixStack.length === 0) {
    throw new Error('Invalid popMatrix!');
  }
  this.uMVMatrix = uMVMatrixStack.pop();
};

p5.RendererGL.prototype.resetMatrix = function() {
  this.uMVMatrix = p5.Matrix.identity();
  this.translate(0, 0, -800);
  return this;
};

// Text/Typography
// @TODO:
p5.RendererGL.prototype._applyTextProperties = function() {
  //@TODO finish implementation
  console.error('text commands not yet implemented in webgl');
};
module.exports = p5.RendererGL;
