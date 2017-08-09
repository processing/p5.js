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
    // param is a p5.Image
    textureData = obj.canvas;
  } else if (typeof p5.MediaElement !== 'undefined' &&
          obj instanceof p5.MediaElement){
    // if param is a video HTML element
    textureData = obj.elt;
  } else if (obj instanceof p5.Graphics){
    //used with offscreen 2d graphics renderer
    textureData = obj.elt;
  } else if (typeof p5.Element !== 'undefined' && obj instanceof p5.Element) {
    // maybe an animated gif?? created with createImg
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

  // used to determine if this texture might need constant updating
  // because it is a video or gif.
  this.isSrcMediaElement = typeof p5.MediaElement !== 'undefined' &&
    obj instanceof p5.MediaElement;
  this._videoPrevTime = 0;

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

  if (this.width === 0 || this.height === 0 ||
    (typeof p5.MediaElement !== 'undefined' &&
    this.src instanceof p5.MediaElement) && !this.src.loadedmetadata) {

    // we've reservered our texture, but can't actually load it
    // until there's data...
    return;

  }

  gl.texImage2D(gl.TEXTURE_2D, 0,
      this.glFormat, this.glFormat, gl.UNSIGNED_BYTE, data);
};

p5.Texture.prototype.set = function(data) {
  if (data.width === 0 || data.height === 0) {
    return; // nothing to do!
  }

  this.bindTexture();

  var textureData;
  if(data instanceof p5.Graphics ||
    (typeof p5.MediaElement !== 'undefined' &&
      data instanceof p5.MediaElement) ||
     (typeof p5.Element !== 'undefined' && data instanceof p5.Element)) {
    textureData = data.elt;
  } else if (data instanceof p5.Image) {
    textureData = data.canvas;
  } else {
    textureData = data;
  }

  var gl = this._renderer.GL;
  // pull texture from data, make sure width & height are appropriate
  if (textureData.width !== this.width ||
      textureData.height !== this.height) {
    this.width = textureData.width;
    this.height = textureData.height;

    gl.texImage2D(this.glTarget, 0,
        this.glFormat, this.glFormat, gl.UNSIGNED_BYTE, textureData);
    if (data instanceof p5.Image) {
      data.setModified(false);
    } else if (typeof p5.MediaElement !== 'undefined' &&
        data instanceof p5.MediaElement) {
      // on the first frame the metadata comes in, pixels may not be available.
      // flag for update.
      data.setModified(true);
    }
  } else if (data instanceof p5.Image ||
      (typeof p5.MediaElement !== 'undefined' &&
      data instanceof p5.MediaElement)) {

    var shouldUpdate = false;
    if (((typeof p5.MediaElement !== 'undefined' &&
        data instanceof p5.MediaElement)) && data.loadedmetadata) {
      if (this._prevTime !== data.time()) {
        this._prevTime = data.time();
        shouldUpdate = true;
      }
    } else if (data.isModified()) {
      shouldUpdate = true;
      data.setModified(false);
    }

    if (shouldUpdate) {
      gl.texImage2D(this.glTarget, 0,
        this.glFormat, this.glFormat, gl.UNSIGNED_BYTE, textureData);
    }
  } else /* data instanceof p5.Graphics, probably */ {
    gl.texImage2D(this.glTarget, 0,
          this.glFormat, this.glFormat, gl.UNSIGNED_BYTE, textureData);
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
    gl.bindTexture(this.glTarget, null);
    this._bound = false;
  }
};

module.exports = p5.Texture;
