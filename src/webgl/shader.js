var p5 = require('../core/core');

/**
 * @module Lights, Camera
 * @submodule Shaders
 * @requires core
 */
module.exports = p5.Shader;

/*
 * Shader class for WEBGL Mode
 * @class p5.Shader
 * @constructor
 * @param {renderer} an instance of p5.RendererGL that will be the
 * gl context for this new p5.Shader
 * @param {vertSrc} [String] source code for the vertex shader (as a string)
 * @param {fragSrc} [String] source code for the fragment shader (as a string)
 */
p5.Shader = function(renderer, vertSrc, fragSrc) {
  // TODO: adapt this to not take ids, but rather,
  // to take the source for a vertex and fragment shader
  // to enable custom shaders at some later date
  this._renderer = renderer;
  this._vertSrc = vertSrc;
  this._fragSrc = fragSrc;
  this._vertShader = -1;
  this._fragShader = -1;
  this.glProgram = 0;
  this.loadedAttributes = false;
  this.attributes = {};
  this.loadedUniforms = false;
  this.uniforms = {};
  this.bound = false;

  return this;
};

/*
 * Creates, compiles, and links the shader based on its
 * sources for the vertex and fragment shaders (provided
 * to the constructor). Populates known attributes and
 * uniforms from the shader.
 * @method init
 */
p5.Shader.prototype.init = function() {
  if (this.glProgram === 0 /* or context is stale? */) {
    var gl = this._renderer.GL;

    //set up the shader by
    // 1. creating and getting a gl id for the shader program,
    // 2. compliling its vertex & fragment sources,
    // 3. linking the vertex and fragment shaders
    this._vertShader = gl.createShader(gl.VERTEX_SHADER);
    //load in our default vertex shader
    gl.shaderSource(this._vertShader, this._vertSrc);
    gl.compileShader(this._vertShader);
    // if our vertex shader failed compilation?
    if (!gl.getShaderParameter(this._vertShader, gl.COMPILE_STATUS)) {
      alert('Yikes! An error occurred compiling the vertex shader:' +
        gl.getShaderInfoLog(this._vertShader));
      return null;
    }

    this._fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    //load in our material frag shader
    gl.shaderSource(this._fragShader, this._fragSrc);
    gl.compileShader(this._fragShader);
    // if our frag shader failed compilation?
    if (!gl.getShaderParameter(this._fragShader, gl.COMPILE_STATUS)) {
      alert('Darn! An error occurred compiling the fragment shader:' +
        gl.getShaderInfoLog(this._fragShader));
      return null;
    }

    this.glProgram = gl.createProgram();
    gl.attachShader(this.glProgram, this._vertShader);
    gl.attachShader(this.glProgram, this._fragShader);
    gl.linkProgram(this.glProgram);
    if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
      alert('Snap! Error linking shader program');
    }

    this.loadAttributes();
    this.loadUniforms();

    // TODO move elsewhere?
    this._renderer._createEmptyTexture();
  }
  return this;
};

/*
 * Queries the active attributes for this shader and loads
 * their names and locations into the attributes array.
 * @method loadAttributes
 */
p5.Shader.prototype.loadAttributes = function() {
  if (this.loadedAttributes) {
    return;
  }

  this.attributes = {};

  var gl = this._renderer.GL;

  var numAttributes = gl.getProgramParameter(this.glProgram,
    gl.ACTIVE_ATTRIBUTES);
  for(var i = 0; i < numAttributes; ++i){
    var attributeInfo = gl.getActiveAttrib(this.glProgram, i);
    var name = attributeInfo.name;
    var location = gl.getAttribLocation(this.glProgram, name);
    var attribute = {};
    attribute.name = name;
    attribute.location = location;
    attribute.type = attributeInfo.type;
    attribute.size = attributeInfo.size;
    this.attributes[name] = attribute;
  }

  this.loadedAttributes = true;
};

/*
 * Queries the active uniforms for this shader and loads
 * their names and locations into the uniforms array.
 * @method loadUniforms
 */
p5.Shader.prototype.loadUniforms = function() {
  if (this.loadedUniforms) {
    return;
  }

  var gl = this._renderer.GL;

  // Inspect shader and cache uniform info
  var numUniforms = gl.getProgramParameter(this.glProgram,
    gl.ACTIVE_UNIFORMS);

  var samplerIndex = 0;
  for(var i = 0; i < numUniforms; ++i){
    var uniformInfo = gl.getActiveUniform(this.glProgram, i);
    var uniform = {};
    uniform.location = gl.getUniformLocation(this.glProgram, uniformInfo.name);
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
    if(uniform.type === gl.SAMPLER_2D) {
      uniform.samplerIndex = samplerIndex;
      samplerIndex++;
    }
    this.uniforms[uniformName] = uniform;
  }
  this.loadedUniforms = true;
};

p5.Shader.prototype.compile = function() {
  // TODO
};


/*
 * initializes (if needed) and binds the shader program.
 * @method bindShader
 */
p5.Shader.prototype.bindShader = function () {
  this.init();
  if (!this.bound) {
    this._useProgram();
    this.bound = true;
    this.bindTextures();

    this.loadAttributes();
    this.loadUniforms();

    this._renderer._setDefaultCamera();
    this._setMatrixUniforms();
  }
};

/*
 * @method unbindShader
 */
p5.Shader.prototype.unbindShader = function () {
  if (this.bound) {
    this.unbindTextures();
    //this._renderer.GL.useProgram(0); ??
    this.bound = false;
  }
};

p5.Shader.prototype.bindTextures = function () {
  // TODO: migrate stuff from material.js here
  // - OR - have material.js define this function
};

p5.Shader.prototype.unbindTextures = function () {
  // TODO: migrate stuff from material.js here
  // - OR - have material.js define this function
};

p5.Shader.prototype._setMatrixUniforms = function() {
  this.setUniform('uProjectionMatrix', this._renderer.uPMatrix.mat4);
  this.setUniform('uModelViewMatrix', this._renderer.uMVMatrix.mat4);

  this._renderer.uNMatrix.inverseTranspose(this._renderer.uMVMatrix);
  this.setUniform('uNormalMatrix', this._renderer.uNMatrix.mat3);
};

p5.Shader.prototype._useProgram = function () {
  var gl = this._renderer.GL;
  gl.useProgram(this.glProgram);
};

/**
 * Wrapper around gl.uniform functions.
 * As we store uniform info in the shader we can use that
 * to do type checking on the supplied data and call
 * the appropriate function.
 * @method setUniform
 * @param {uniformName} [String] the name of the uniform in the
 * shader program
 * @param {data} [] the data to be associated with that uniform; type
 * varies (could be a single numerical value, array, matrix, or
 * texture / sampler reference)
 */
p5.Shader.prototype.setUniform = function(uniformName, data)
{
  //@todo update all current gl.uniformXX calls

  var gl = this._renderer.GL;
  // todo: is this safe to do here?
  // todo: store the values another way?
  this._useProgram();

  // TODO BIND?
  var uniform = this.uniforms[uniformName];
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

p5.Shader.prototype.enableAttrib = function(loc, size,
  type, normalized, stride, offset) {
  var gl = this._renderer.GL;
  if(loc !== -1) {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, type, normalized, stride, offset);
  }
};

