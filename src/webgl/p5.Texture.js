/**
 * This module defines the p5.Texture class
 * @module Lights, Camera
 * @submodule Material
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/main');
var constants = require('../core/constants');

/**
 * Texture class for WEBGL Mode
 * @private
 * @class p5.Texture
 * @param {p5.RendererGL} renderer an instance of p5.RendererGL that
 * will provide the GL context for this new p5.Texture
 * @param {p5.Image|p5.Graphics|p5.Element|p5.MediaElement|ImageData} [obj] the
 * object containing the image data to store in the texture.
 */
p5.Texture = function(renderer, obj) {
  this._renderer = renderer;

  var gl = this._renderer.GL;

  this.src = obj;
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
  this.isSrcMediaElement =
    typeof p5.MediaElement !== 'undefined' && obj instanceof p5.MediaElement;
  this._videoPrevUpdateTime = 0;
  this.isSrcHTMLElement =
    typeof p5.Element !== 'undefined' &&
    obj instanceof p5.Element &&
    !(obj instanceof p5.Graphics);
  this.isSrcP5Image = obj instanceof p5.Image;
  this.isSrcP5Graphics = obj instanceof p5.Graphics;
  this.isImageData =
    typeof ImageData !== 'undefined' && obj instanceof ImageData;

  var textureData = this._getTextureDataFromSource();
  this.width = textureData.width;
  this.height = textureData.height;

  this.init(textureData);
  return this;
};

p5.Texture.prototype._getTextureDataFromSource = function() {
  var textureData;
  if (this.isSrcP5Image) {
    // param is a p5.Image
    textureData = this.src.canvas;
  } else if (
    this.isSrcMediaElement ||
    this.isSrcP5Graphics ||
    this.isSrcHTMLElement
  ) {
    // if param is a video HTML element
    textureData = this.src.elt;
  } else if (this.isImageData) {
    textureData = this.src;
  }
  return textureData;
};

/**
 * Initializes common texture parameters, creates a gl texture,
 * tries to upload the texture for the first time if data is
 * already available.
 * @private
 * @method init
 */
p5.Texture.prototype.init = function(data) {
  var gl = this._renderer.GL;
  this.glTex = gl.createTexture();
  this.bindTexture();

  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.glWrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.glWrapT);

  if (
    this.width === 0 ||
    this.height === 0 ||
    (this.isSrcMediaElement && !this.src.loadedmetadata)
  ) {
    // assign a 1x1 empty texture initially, because data is not yet ready,
    // so that no errors occur in gl console!
    var tmpdata = new Uint8Array([1, 1, 1, 1]);
    gl.texImage2D(
      this.glTarget,
      0,
      gl.RGBA,
      1,
      1,
      0,
      this.glFormat,
      gl.UNSIGNED_BYTE,
      tmpdata
    );
  } else {
    // data is ready: just push the texture!
    gl.texImage2D(
      this.glTarget,
      0,
      this.glFormat,
      this.glFormat,
      gl.UNSIGNED_BYTE,
      data
    );
  }
};

/**
 * Checks if the source data for this texture has changed (if it's
 * easy to do so) and reuploads the texture if necessary. If it's not
 * possible or to expensive to do a calculation to determine wheter or
 * not the data has occurred, this method simply re-uploads the texture.
 * @method update
 */
p5.Texture.prototype.update = function() {
  var data = this.src;
  if (data.width === 0 || data.height === 0) {
    return false; // nothing to do!
  }

  var textureData = this._getTextureDataFromSource();
  var updated = false;

  var gl = this._renderer.GL;
  // pull texture from data, make sure width & height are appropriate
  if (textureData.width !== this.width || textureData.height !== this.height) {
    updated = true;

    // make sure that if the width and height of this.src have changed
    // for some reason, we update our metadata and upload the texture again
    this.width = textureData.width;
    this.height = textureData.height;

    if (this.isSrcP5Image) {
      data.setModified(false);
    } else if (this.isSrcMediaElement || this.isSrcHTMLElement) {
      // on the first frame the metadata comes in, the size will be changed
      // from 0 to actual size, but pixels may not be available.
      // flag for update in a future frame.
      // if we don't do this, a paused video, for example, may not
      // send the first frame to texture memory.
      data.setModified(true);
    }
  } else if (this.isSrcP5Image) {
    // for an image, we only update if the modified field has been set,
    // for example, by a call to p5.Image.set
    if (data.isModified()) {
      updated = true;
      data.setModified(false);
    }
  } else if (this.isSrcMediaElement) {
    // for a media element (video), we'll check if the current time in
    // the video frame matches the last time. if it doesn't match, the
    // video has advanced or otherwise been taken to a new frame,
    // and we need to upload it.
    if (data.isModified()) {
      // p5.MediaElement may have also had set/updatePixels, etc. called
      // on it and should be updated, or may have been set for the first
      // time!
      updated = true;
      data.setModified(false);
    } else if (data.loadedmetadata) {
      // if the meta data has been loaded, we can ask the video
      // what it's current position (in time) is.
      if (this._videoPrevUpdateTime !== data.time()) {
        // update the texture in gpu mem only if the current
        // video timestamp does not match the timestamp of the last
        // time we uploaded this texture (and update the time we
        // last uploaded, too)
        this._videoPrevUpdateTime = data.time();
        updated = true;
      }
    }
  } else if (this.isImageData) {
    if (data._dirty) {
      data._dirty = false;
      updated = true;
    }
  } else {
    /* data instanceof p5.Graphics, probably */
    // there is not enough information to tell if the texture can be
    // conditionally updated; so to be safe, we just go ahead and upload it.
    updated = true;
  }

  if (updated) {
    this.bindTexture();
    gl.texImage2D(
      this.glTarget,
      0,
      this.glFormat,
      this.glFormat,
      gl.UNSIGNED_BYTE,
      textureData
    );
  }

  return updated;
};

/**
 * Binds the texture to the appropriate GL target.
 * @method bindTexture
 */
p5.Texture.prototype.bindTexture = function() {
  // bind texture using gl context + glTarget and
  // generated gl texture object
  var gl = this._renderer.GL;
  gl.bindTexture(this.glTarget, this.glTex);

  return this;
};

/**
 * Unbinds the texture from the appropriate GL target.
 * @method unbindTexture
 */
p5.Texture.prototype.unbindTexture = function() {
  // unbind per above, disable texturing on glTarget
  var gl = this._renderer.GL;
  gl.bindTexture(this.glTarget, null);
};

/**
 * Sets how a texture is be interpolated when upscaled or downscaled.
 * Nearest filtering uses nearest neighbor scaling when interpolating
 * Linear filtering uses WebGL's linear scaling when interpolating
 * @method setInterpolation
 * @param {String} downScale Specifies the texture filtering when
 *                           textures are shrunk. Options are LINEAR or NEAREST
 * @param {String} upScale Specifies the texture filtering when
 *                         textures are magnified. Options are LINEAR or NEAREST
 * @todo implement mipmapping filters
 */
p5.Texture.prototype.setInterpolation = function(downScale, upScale) {
  var gl = this._renderer.GL;

  if (downScale === constants.NEAREST) {
    this.glMinFilter = gl.NEAREST;
  } else {
    this.glMinFilter = gl.LINEAR;
  }

  if (upScale === constants.NEAREST) {
    this.glMagFilter = gl.NEAREST;
  } else {
    this.glMagFilter = gl.LINEAR;
  }

  this.bindTexture();
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
  this.unbindTexture();
};

/**
 * Sets the texture wrapping mode. This controls how textures behave
 * when their uv's go outside of the 0 - 1 range. There are three options:
 * CLAMP, REPEAT, and MIRROR. REPEAT & MIRROR are only available if the texture
 * is a power of two size (128, 256, 512, 1024, etc.).
 * @method setWrapMode
 * @param {String} wrapX Controls the horizontal texture wrapping behavior
 * @param {String} wrapY Controls the vertical texture wrapping behavior
 */
p5.Texture.prototype.setWrapMode = function(wrapX, wrapY) {
  var gl = this._renderer.GL;

  // for webgl 1 we need to check if the texture is power of two
  // if it isn't we will set the wrap mode to CLAMP
  // webgl2 will support npot REPEAT and MIRROR but we don't check for it yet
  var isPowerOfTwo = function(x) {
    return (x & (x - 1)) === 0;
  };

  var widthPowerOfTwo = isPowerOfTwo(this.width);
  var heightPowerOfTwo = isPowerOfTwo(this.width);

  if (wrapX === constants.REPEAT) {
    if (widthPowerOfTwo && heightPowerOfTwo) {
      this.glWrapS = gl.REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
      );
      this.glWrapS = gl.CLAMP_TO_EDGE;
    }
  } else if (wrapX === constants.MIRROR) {
    if (widthPowerOfTwo && heightPowerOfTwo) {
      this.glWrapS = gl.MIRRORED_REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to MIRROR but the texture size is not a power of two. Setting to CLAMP instead'
      );
      this.glWrapS = gl.CLAMP_TO_EDGE;
    }
  } else {
    // falling back to default if didn't get a proper mode
    this.glWrapS = gl.CLAMP_TO_EDGE;
  }

  if (wrapY === constants.REPEAT) {
    if (widthPowerOfTwo && heightPowerOfTwo) {
      this.glWrapT = gl.REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
      );
      this.glWrapT = gl.CLAMP_TO_EDGE;
    }
  } else if (wrapY === constants.MIRROR) {
    if (widthPowerOfTwo && heightPowerOfTwo) {
      this.glWrapT = gl.MIRRORED_REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to MIRROR but the texture size is not a power of two. Setting to CLAMP instead'
      );
      this.glWrapT = gl.CLAMP_TO_EDGE;
    }
  } else {
    // falling back to default if didn't get a proper mode
    this.glWrapT = gl.CLAMP_TO_EDGE;
  }

  this.bindTexture();
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.glWrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.glWrapT);
  this.unbindTexture();
};

module.exports = p5.Texture;
