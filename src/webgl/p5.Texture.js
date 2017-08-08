/**
 * This module defines the p5.Texture class
 * @module Lights, Camera
 * @submodule Shaders
 * @for p5
 * @requires core
 */

var p5 = require('../core/core');

// TODO: multiple texture units

/**
 * Texture class for WEBGL Mode
 * @class p5.Texture
 * @constructor
 * @param {renderer} [p5.Renderer.GL] an instance of p5.RendererGL that
 * will provide the GL context for this new p5.Shader
 */
p5.Texture = function(renderer, obj) {
  this._renderer = renderer;
  this._bound = false;

  var gl = this._renderer.GL;

  var textureData;
  if (obj instanceof p5.Image) {
    textureData = obj.canvas;
  }
  //if param is a video
  else if (typeof p5.MediaElement !== 'undefined' &&
          obj instanceof p5.MediaElement){
    if(!obj.loadedmetadata) {return;}
    textureData = obj.elt;
  }
  //used with offscreen 2d graphics renderer
  else if(obj instanceof p5.Graphics){
    textureData = obj.elt;
  }

  this.src = obj;
  this.height = textureData.width;
  this.width = textureData.height;
  this.glTex = undefined;
  this.glTarget = gl.TEXTURE_2D;
  this.glFormat = gl.RGBA;
  this.mipmaps = false;
  this.glMinFilter = gl.LINEAR;
  this.glMagFilter = gl.LINEAR;
  this.glWrapS = gl.CLAMP_TO_EDGE;
  this.glWrapT = gl.CLAMP_TO_EDGE;

  // TODO: understand more of this pattern from processing
  //this.colorBuffer = false;

  this.init(textureData);
  return this;
};

/**

 */
p5.Texture.prototype.init = function(data) {
  var gl = this._renderer.GL;
  this.glTex = gl.createTexture();
  this.bindTexture();

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.glWrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.glWrapT);

  gl.texImage2D(gl.TEXTURE_2D, 0,
      this.glFormat, this.glFormat, gl.UNSIGNED_BYTE, data);
};

p5.Texture.prototype.set = function(data) {
  this.bindTexture();

  var textureData;
  if(data instanceof p5.Graphics ||
    (typeof p5.MediaElement !== 'undefined' &&
    data instanceof p5.MediaElement)) {
    textureData = data.elt;
  }
  else if(data instanceof p5.Image) {
    textureData = data.canvas;
  }

  var gl = this._renderer.GL;
  // pull texture from data, make sure width & height are appropriate
  if (textureData.width !== this.width  ||
      textureData.height !== this.height) {
    this.width = textureData.width;
    this.height = textureData.height;
    gl.texImage2D(gl.TEXTURE_2D, 0,
        this.glFormat, this.glFormat, gl.UNSIGNED_BYTE, textureData);
    if (data instanceof p5.Image) {
      data.modified = false;
    }
  } else if (data instanceof p5.Image) {
    if (data.isModified()) {
      data.setModified(false);
      gl.texSubImage2D(gl.TEXTURE_2D, 0,
        0, 0, this.glFormat, gl.UNSIGNED_BYTE, textureData);
    }
  } else {
    gl.texSubImage2D(gl.TEXTURE_2D, 0,
        0, 0, this.glFormat, gl.UNSIGNED_BYTE, textureData);
  }
};

p5.Texture.prototype.bindTexture = function () {
  if (! this._bound) {
    // bind texture using gl context + glTarget and glName
    var gl = this._renderer.GL;
    gl.bindTexture(this.glTarget, this.glTex);

    // todo: texture unit here?

    this._bound = true;
  }
  return this;
};

p5.Texture.prototype.unbindTexture = function () {
  // unbind per above, disable texturing on glTarget
  if (this._bound) {
    var gl = this._renderer.GL;
    gl.bindTexture(gl.TEXTURE_2D, null);
    this._bound = false;
  }
};

module.exports = p5.Texture;
