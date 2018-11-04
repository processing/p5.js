/**
 * This module defines the p5.Shader class
 * @module Lights, Camera
 * @submodule Shaders
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/main');

/**
 * Shader class for WEBGL Mode
 * @class p5.Shader
 * @param {p5.RendererGL} renderer an instance of p5.RendererGL that
 * will provide the GL context for this new p5.Shader
 * @param {String} vertSrc source code for the vertex shader (as a string)
 * @param {String} fragSrc source code for the fragment shader (as a string)
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
  this._glProgram = 0;
  this._loadedAttributes = false;
  this.attributes = {};
  this._loadedUniforms = false;
  this.uniforms = {};
  this._bound = false;
  this.samplers = [];
};

/**
 * Creates, compiles, and links the shader based on its
 * sources for the vertex and fragment shaders (provided
 * to the constructor). Populates known attributes and
 * uniforms from the shader.
 * @method init
 * @chainable
 * @private
 */
p5.Shader.prototype.init = function() {
  if (this._glProgram === 0 /* or context is stale? */) {
    var gl = this._renderer.GL;

    // @todo: once custom shading is allowed,
    // friendly error messages should be used here to share
    // compiler and linker errors.

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
      console.error(
        'Yikes! An error occurred compiling the vertex shader:' +
          gl.getShaderInfoLog(this._vertShader)
      );
      return null;
    }

    this._fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    //load in our material frag shader
    gl.shaderSource(this._fragShader, this._fragSrc);
    gl.compileShader(this._fragShader);
    // if our frag shader failed compilation?
    if (!gl.getShaderParameter(this._fragShader, gl.COMPILE_STATUS)) {
      console.error(
        'Darn! An error occurred compiling the fragment shader:' +
          gl.getShaderInfoLog(this._fragShader)
      );
      return null;
    }

    this._glProgram = gl.createProgram();
    gl.attachShader(this._glProgram, this._vertShader);
    gl.attachShader(this._glProgram, this._fragShader);
    gl.linkProgram(this._glProgram);
    if (!gl.getProgramParameter(this._glProgram, gl.LINK_STATUS)) {
      console.error(
        'Snap! Error linking shader program: ' +
          gl.getProgramInfoLog(this._glProgram)
      );
    }

    this._loadAttributes();
    this._loadUniforms();
  }
  return this;
};

/**
 * Queries the active attributes for this shader and loads
 * their names and locations into the attributes array.
 * @method _loadAttributes
 * @private
 */
p5.Shader.prototype._loadAttributes = function() {
  if (this._loadedAttributes) {
    return;
  }

  this.attributes = {};

  var gl = this._renderer.GL;

  var numAttributes = gl.getProgramParameter(
    this._glProgram,
    gl.ACTIVE_ATTRIBUTES
  );
  for (var i = 0; i < numAttributes; ++i) {
    var attributeInfo = gl.getActiveAttrib(this._glProgram, i);
    var name = attributeInfo.name;
    var location = gl.getAttribLocation(this._glProgram, name);
    var attribute = {};
    attribute.name = name;
    attribute.location = location;
    attribute.type = attributeInfo.type;
    attribute.size = attributeInfo.size;
    this.attributes[name] = attribute;
  }

  this._loadedAttributes = true;
};

/**
 * Queries the active uniforms for this shader and loads
 * their names and locations into the uniforms array.
 * @method _loadUniforms
 * @private
 */
p5.Shader.prototype._loadUniforms = function() {
  if (this._loadedUniforms) {
    return;
  }

  var gl = this._renderer.GL;

  // Inspect shader and cache uniform info
  var numUniforms = gl.getProgramParameter(this._glProgram, gl.ACTIVE_UNIFORMS);

  var samplerIndex = 0;
  for (var i = 0; i < numUniforms; ++i) {
    var uniformInfo = gl.getActiveUniform(this._glProgram, i);
    var uniform = {};
    uniform.location = gl.getUniformLocation(this._glProgram, uniformInfo.name);
    uniform.size = uniformInfo.size;
    var uniformName = uniformInfo.name;
    //uniforms thats are arrays have their name returned as
    //someUniform[0] which is a bit silly so we trim it
    //off here. The size property tells us that its an array
    //so we dont lose any information by doing this
    if (uniformInfo.size > 1) {
      uniformName = uniformName.substring(0, uniformName.indexOf('[0]'));
    }
    uniform.name = uniformName;
    uniform.type = uniformInfo.type;
    if (uniform.type === gl.SAMPLER_2D) {
      uniform.samplerIndex = samplerIndex;
      samplerIndex++;
      this.samplers.push(uniform);
    }
    this.uniforms[uniformName] = uniform;
  }
  this._loadedUniforms = true;
};

p5.Shader.prototype.compile = function() {
  // TODO
};

/**
 * initializes (if needed) and binds the shader program.
 * @method bindShader
 * @private
 */
p5.Shader.prototype.bindShader = function() {
  this.init();
  if (!this._bound) {
    this.useProgram();
    this._bound = true;
    this.bindTextures();

    this._setMatrixUniforms();
    if (this === this._renderer.curStrokeShader) {
      this._setViewportUniform();
    }
  }
};

/**
 * @method unbindShader
 * @chainable
 * @private
 */
p5.Shader.prototype.unbindShader = function() {
  if (this._bound) {
    this.unbindTextures();
    //this._renderer.GL.useProgram(0); ??
    this._bound = false;
  }
  return this;
};

p5.Shader.prototype.bindTextures = function() {
  var gl = this._renderer.GL;
  for (var i = 0; i < this.samplers.length; i++) {
    var uniform = this.samplers[i];
    var tex = uniform.texture;
    if (tex === undefined) {
      // user hasn't yet supplied a texture for this slot.
      // (or there may not be one--maybe just lighting),
      // so we supply a default texture instead.
      tex = this._renderer._getEmptyTexture();
    }
    gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
    tex.bindTexture();
    tex.update();
    gl.uniform1i(uniform.location, uniform.samplerIndex);
  }
};

p5.Shader.prototype.updateTextures = function() {
  for (var i = 0; i < this.samplers.length; i++) {
    var uniform = this.samplers[i];
    var tex = uniform.texture;
    if (tex) {
      tex.update();
    }
  }
};

p5.Shader.prototype.unbindTextures = function() {
  // TODO: migrate stuff from material.js here
  // - OR - have material.js define this function
};

p5.Shader.prototype._setMatrixUniforms = function() {
  this.setUniform('uProjectionMatrix', this._renderer.uPMatrix.mat4);
  this.setUniform('uModelViewMatrix', this._renderer.uMVMatrix.mat4);
  this.setUniform('uViewMatrix', this._renderer._curCamera.cameraMatrix.mat4);
  if (this === this._renderer.curFillShader) {
    this._renderer.uNMatrix.inverseTranspose(this._renderer.uMVMatrix);
    this.setUniform('uNormalMatrix', this._renderer.uNMatrix.mat3);
  }
};

p5.Shader.prototype._setViewportUniform = function() {
  this.setUniform('uViewport', this._renderer._viewport);
};

/**
 * @method useProgram
 * @chainable
 * @private
 */
p5.Shader.prototype.useProgram = function() {
  var gl = this._renderer.GL;
  gl.useProgram(this._glProgram);
  return this;
};

/**
 * Wrapper around gl.uniform functions.
 * As we store uniform info in the shader we can use that
 * to do type checking on the supplied data and call
 * the appropriate function.
 * @method setUniform
 * @chainable
 * @param {String} uniformName the name of the uniform in the
 * shader program
 * @param {Object|Number|Boolean|Number[]} data the data to be associated
 * with that uniform; type varies (could be a single numerical value, array,
 * matrix, or texture / sampler reference)
 */
p5.Shader.prototype.setUniform = function(uniformName, data) {
  //@todo update all current gl.uniformXX calls

  var uniform = this.uniforms[uniformName];
  if (!uniform) {
    //@todo warning?
    return;
  }
  var location = uniform.location;

  var gl = this._renderer.GL;
  // todo: is this safe to do here?
  // todo: store the values another way?
  this.useProgram();

  // TODO BIND?

  switch (uniform.type) {
    case gl.BOOL:
      if (data === true) {
        gl.uniform1i(location, 1);
      } else {
        gl.uniform1i(location, 0);
      }
      break;
    case gl.INT:
      if (uniform.size > 1) {
        data.length && gl.uniform1iv(location, data);
      } else {
        gl.uniform1i(location, data);
      }
      break;
    case gl.FLOAT:
      if (uniform.size > 1) {
        data.length && gl.uniform1fv(location, data);
      } else {
        gl.uniform1f(location, data);
      }
      break;
    case gl.FLOAT_MAT3:
      gl.uniformMatrix3fv(location, false, data);
      break;
    case gl.FLOAT_MAT4:
      gl.uniformMatrix4fv(location, false, data);
      break;
    case gl.FLOAT_VEC2:
      if (uniform.size > 1) {
        data.length && gl.uniform2fv(location, data);
      } else {
        gl.uniform2f(location, data[0], data[1]);
      }
      break;
    case gl.FLOAT_VEC3:
      if (uniform.size > 1) {
        data.length && gl.uniform3fv(location, data);
      } else {
        gl.uniform3f(location, data[0], data[1], data[2]);
      }
      break;
    case gl.FLOAT_VEC4:
      if (uniform.size > 1) {
        data.length && gl.uniform4fv(location, data);
      } else {
        gl.uniform4f(location, data[0], data[1], data[2], data[3]);
      }
      break;
    case gl.INT_VEC2:
      if (uniform.size > 1) {
        data.length && gl.uniform2iv(location, data);
      } else {
        gl.uniform2i(location, data[0], data[1]);
      }
      break;
    case gl.INT_VEC3:
      if (uniform.size > 1) {
        data.length && gl.uniform3iv(location, data);
      } else {
        gl.uniform3i(location, data[0], data[1], data[2]);
      }
      break;
    case gl.INT_VEC4:
      if (uniform.size > 1) {
        data.length && gl.uniform4iv(location, data);
      } else {
        gl.uniform4i(location, data[0], data[1], data[2], data[3]);
      }
      break;
    case gl.SAMPLER_2D:
      gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
      uniform.texture = this._renderer.getTexture(data);
      gl.uniform1i(uniform.location, uniform.samplerIndex);
      break;
    //@todo complete all types
  }
  return this;
};

/* NONE OF THIS IS FAST OR EFFICIENT BUT BEAR WITH ME
 *
 * these shader "type" query methods are used by various
 * facilities of the renderer to determine if changing
 * the shader type for the required action (for example,
 * do we need to load the default lighting shader if the
 * current shader cannot handle lighting?)
 *
 **/

p5.Shader.prototype.isLightShader = function() {
  return (
    this.uniforms.uUseLighting !== undefined ||
    this.uniforms.uAmbientLightCount !== undefined ||
    this.uniforms.uDirectionalLightCount !== undefined ||
    this.uniforms.uPointLightCount !== undefined ||
    this.uniforms.uAmbientColor !== undefined ||
    this.uniforms.uDirectionalColor !== undefined ||
    this.uniforms.uPointLightLocation !== undefined ||
    this.uniforms.uPointLightColor !== undefined ||
    this.uniforms.uLightingDirection !== undefined ||
    this.uniforms.uSpecular !== undefined
  );
};

p5.Shader.prototype.isTextureShader = function() {
  return this.samplerIndex > 0;
};

p5.Shader.prototype.isColorShader = function() {
  return (
    this.attributes.aVertexColor !== undefined ||
    this.uniforms.uMaterialColor !== undefined
  );
};

p5.Shader.prototype.isTexLightShader = function() {
  return this.isLightShader() && this.isTextureShader();
};

p5.Shader.prototype.isStrokeShader = function() {
  return this.uniforms.uStrokeWeight !== undefined;
};

/**
 * @method enableAttrib
 * @chainable
 * @private
 */
p5.Shader.prototype.enableAttrib = function(
  loc,
  size,
  type,
  normalized,
  stride,
  offset
) {
  var gl = this._renderer.GL;
  if (loc !== -1) {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, type, normalized, stride, offset);
  }
  return this;
};

module.exports = p5.Shader;
