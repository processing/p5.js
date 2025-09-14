/**
 * This module defines the p5.Texture class
 * @module 3D
 * @submodule Material
 * @for p5
 * @requires core
 */

import * as constants from '../core/constants';
import { Element } from '../dom/p5.Element';
import { Renderer } from '../core/p5.Renderer';
import { MediaElement } from '../dom/p5.MediaElement';
import { Image } from '../image/p5.Image';
import { Graphics } from '../core/p5.Graphics';
import { FramebufferTexture } from './p5.Framebuffer';

class Texture {
  constructor (renderer, obj, settings = {}) {
    this._renderer = renderer;

    this.src = obj;

    this.format = settings.format || 'rgba8unorm';
    this.minFilter = settings.minFilter || constants.LINEAR;
    this.magFilter = settings.magFilter || constants.LINEAR;
    this.wrapS = settings.wrapS || renderer.states.textureWrapX;
    this.wrapT = settings.wrapT || renderer.states.textureWrapY;
    this.dataType = settings.dataType || 'uint8';

    this.textureHandle = null;

    this._detectSourceType();

    const textureData = this._getTextureDataFromSource();
    this.width = textureData.width;
    this.height = textureData.height;

    this.init(textureData);
  }
  /*
    const support = checkWebGLCapabilities(renderer);
    if (this.glFormat === gl.HALF_FLOAT && !support.halfFloat) {
      console.log('This device does not support dataType HALF_FLOAT. Falling back to FLOAT.');
      this.glDataType = gl.FLOAT;
    }
    if (
      this.glFormat === gl.HALF_FLOAT &&
      (this.glMinFilter === gl.LINEAR || this.glMagFilter === gl.LINEAR) &&
      !support.halfFloatLinear
    ) {
      console.log('This device does not support linear filtering for dataType FLOAT. Falling back to NEAREST.');
      if (this.glMinFilter === gl.LINEAR) this.glMinFilter = gl.NEAREST;
      if (this.glMagFilter === gl.LINEAR) this.glMagFilter = gl.NEAREST;
    }
    if (this.glFormat === gl.FLOAT && !support.float) {
      console.log('This device does not support dataType FLOAT. Falling back to UNSIGNED_BYTE.');
      this.glDataType = gl.UNSIGNED_BYTE;
    }
    if (
      this.glFormat === gl.FLOAT &&
      (this.glMinFilter === gl.LINEAR || this.glMagFilter === gl.LINEAR) &&
      !support.floatLinear
    ) {
      console.log('This device does not support linear filtering for dataType FLOAT. Falling back to NEAREST.');
      if (this.glMinFilter === gl.LINEAR) this.glMinFilter = gl.NEAREST;
      if (this.glMagFilter === gl.LINEAR) this.glMagFilter = gl.NEAREST;
    }
  }*/

  _detectSourceType() {
    const obj = this.src;
    this.isFramebufferTexture = obj instanceof FramebufferTexture;
    this.isSrcP5Image = obj instanceof Image;
    this.isSrcP5Graphics = obj instanceof Graphics;
    this.isSrcP5Renderer = obj instanceof Renderer;
    this.isImageData = typeof ImageData !== 'undefined' && obj instanceof ImageData;
    this.isSrcMediaElement =
      typeof MediaElement !== 'undefined' && obj instanceof MediaElement;
    this.isSrcHTMLElement =
      typeof Element !== 'undefined' &&
      obj instanceof Element &&
      !this.isSrcMediaElement &&
      !this.isSrcP5Graphics &&
      !this.isSrcP5Renderer;
  }

  remove() {
    if (this.textureHandle) {
      this._renderer.deleteTexture(this.textureHandle);
      this.textureHandle = null;
    }
  }

  _getTextureDataFromSource () {
    let textureData;
    if (this.isFramebufferTexture) {
      textureData = this.src.rawTexture();
    } else if (this.isSrcP5Image) {
    // param is a p5.Image
      textureData = this.src.canvas;
    } else if (
      this.isSrcMediaElement ||
      this.isSrcHTMLElement
    ) {
      // if param is a video HTML element
      if (this.src._ensureCanvas) {
        this.src._ensureCanvas();
      }
      textureData = this.src.elt;
    } else if (this.isSrcP5Graphics || this.isSrcP5Renderer) {
      textureData = this.src.canvas;
    } else if (this.isImageData) {
      textureData = this.src;
    }
    return textureData;
  }

  /**
   * Initializes common texture parameters, creates a gl texture,
   * tries to upload the texture for the first time if data is
   * already available.
   */
  init(textureData) {
    if (!this.isFramebufferTexture) {
      this.textureHandle = this._renderer.createTexture({
        format: this.format,
        dataType: this.dataType,
        width: textureData.width,
        height: textureData.height,
      });
    } else {
      this.textureHandle = this._renderer.createFramebufferTextureHandle(this.src);
    }

    this._renderer.setTextureParams(this, {
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      wrapS: this.wrapS,
      wrapT: this.wrapT
    });

    this.bindTexture();

    if (this._shouldDeferUpload()) {
      this._renderer.uploadTextureFromData(
        this.textureHandle,
        new Uint8Array(1, 1, 1, 1),
        1,
        1
      );
    } else if (!this.isFramebufferTexture) {
      this._renderer.uploadTextureFromSource(
        this.textureHandle,
        textureData
      );
    }

    this.unbindTexture();
  }

  _shouldDeferUpload() {
    return (
      this.width === 0 ||
      this.height === 0 ||
      (this.isSrcMediaElement && !this.src.loadedmetadata)
    );
  }

  /**
   * Checks if the source data for this texture has changed (if it's
   * easy to do so) and reuploads the texture if necessary. If it's not
   * possible or to expensive to do a calculation to determine wheter or
   * not the data has occurred, this method simply re-uploads the texture.
   */
  update() {
    const textureData = this._getTextureDataFromSource();
    if (!textureData) return false;

    let updated = false;

    if (this._shouldUpdate(textureData)) {
      this.bindTexture();
      this._renderer.uploadTextureFromSource(this.textureHandle, textureData);
      updated = true;
    }

    return updated;
  }

  _shouldUpdate(textureData) {
    const data = this.src;
    if (data.width === 0 || data.height === 0) {
      return false; // nothing to do!
    }

    // FramebufferTexture instances wrap raw WebGL textures already, which
    // don't need any extra updating, as they already live on the GPU
    if (this.isFramebufferTexture) {
      this.src.update();
      return false;
    }

    let updated = false;
    // pull texture from data, make sure width & height are appropriate
    if (
      textureData.width !== this.width ||
      textureData.height !== this.height
    ) {
      updated = true;

      // make sure that if the width and height of this.src have changed
      // for some reason, we update our metadata and upload the texture again
      this.width = textureData.width || data.width;
      this.height = textureData.height || data.height;

      if (this.isSrcP5Image) {
        data.setModified(false);
      } else if (this.isSrcMediaElement || this.isSrcHTMLElement) {
        // on the first frame the metadata comes in, the size will be changed
        // from 0 to actual size, but pixels may not be available.
        // flag for update in a future frame.
        // if we don't do this, a paused video, for example, may not
        // send the first frame to texture memory.
        data.setModified && data.setModified(true);
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

    return updated;
  }

  bindTexture() {
    this._renderer.bindTexture(this);
    return this;
  }

  unbindTexture () {
    this._renderer.unbindTexture();
  }

  getTexture() {
    if (this.isFramebufferTexture) {
      return this.src.rawTexture();
    } else {
      return this.textureHandle;
    }
  }

  getSampler() {
    return this._renderer.getSampler(this);
  }

  setInterpolation(minFilter, magFilter) {
    this.minFilter = minFilter;
    this.magFilter = magFilter;
    this._renderer.setTextureParams(this);
  }

  setWrapMode(wrapX, wrapY) {
    this.wrapS = wrapX;
    this.wrapT = wrapY;
    this._renderer.setTextureParams(this);
  }
}

class MipmapTexture extends Texture {
  constructor(renderer, levels, settings) {
    super(renderer, levels, settings);
    const gl = this._renderer.GL;
    if (this.glMinFilter === gl.LINEAR) {
      this.glMinFilter = gl.LINEAR_MIPMAP_LINEAR;
    }
  }

  glFilter(_filter) {
    const gl = this._renderer.GL;
    // TODO: support others
    return gl.LINEAR_MIPMAP_LINEAR;
  }

  _getTextureDataFromSource() {
    return this.src;
  }

  init(levels) {
    const gl = this._renderer.GL;
    this.glTex = gl.createTexture();

    this.bindTexture();
    for (let level = 0; level < levels.length; level++) {
      gl.texImage2D(
        this.glTarget,
        level,
        this.glFormat,
        this.glFormat,
        this.glDataType,
        levels[level]
      );
    }

    this.glMinFilter = gl.LINEAR_MIPMAP_LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);

    this.unbindTexture();
  }

  update() {}
}

function texture(p5, fn){
  /**
   * Texture class for WEBGL Mode
   * @private
   * @class p5.Texture
   * @param {p5.RendererGL} renderer an instance of p5.RendererGL that
   * will provide the GL context for this new p5.Texture
   * @param {p5.Image|p5.Graphics|p5.Element|p5.MediaElement|ImageData|p5.Framebuffer|p5.FramebufferTexture|ImageData} [obj] the
   * object containing the image data to store in the texture.
   * @param {Object} [settings] optional A javascript object containing texture
   * settings.
   * @param {Number} [settings.format] optional The internal color component
   * format for the texture. Possible values for format include gl.RGBA,
   * gl.RGB, gl.ALPHA, gl.LUMINANCE, gl.LUMINANCE_ALPHA. Defaults to gl.RBGA
   * @param {Number} [settings.minFilter] optional The texture minification
   * filter setting. Possible values are gl.NEAREST or gl.LINEAR. Defaults
   * to gl.LINEAR. Note, Mipmaps are not implemented in p5.
   * @param {Number} [settings.magFilter] optional The texture magnification
   * filter setting. Possible values are gl.NEAREST or gl.LINEAR. Defaults
   * to gl.LINEAR. Note, Mipmaps are not implemented in p5.
   * @param {Number} [settings.wrapS] optional The texture wrap settings for
   * the s coordinate, or x axis. Possible values are gl.CLAMP_TO_EDGE,
   * gl.REPEAT, and gl.MIRRORED_REPEAT. The mirror settings are only available
   * when using a power of two sized texture. Defaults to gl.CLAMP_TO_EDGE
   * @param {Number} [settings.wrapT] optional The texture wrap settings for
   * the t coordinate, or y axis. Possible values are gl.CLAMP_TO_EDGE,
   * gl.REPEAT, and gl.MIRRORED_REPEAT. The mirror settings are only available
   * when using a power of two sized texture. Defaults to gl.CLAMP_TO_EDGE
   * @param {Number} [settings.dataType] optional The data type of the texel
   * data. Possible values are gl.UNSIGNED_BYTE or gl.FLOAT. There are more
   * formats that are not implemented in p5. Defaults to gl.UNSIGNED_BYTE.
   */
  p5.Texture = Texture;

  p5.MipmapTexture = MipmapTexture;
}

export default texture;
export { Texture, MipmapTexture };

if(typeof p5 !== 'undefined'){
  texture(p5, p5.prototype);
}
