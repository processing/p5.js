/**
 * This module defines the p5.Texture class
 * @module 3D
 * @submodule Material
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import * as constants from '../core/constants';

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
p5.Texture = class Texture {
  constructor (renderer, obj, settings) {
    this._renderer = renderer;

    const gl = this._renderer.GL;

    settings = settings || {};

    this.src = obj;
    this.glTex = undefined;
    this.glTarget = gl.TEXTURE_2D;
    this.glFormat = settings.format || gl.RGBA;
    this.mipmaps = false;
    this.glMinFilter = settings.minFilter || gl.LINEAR;
    this.glMagFilter = settings.magFilter || gl.LINEAR;
    this.glWrapS = settings.wrapS || gl.CLAMP_TO_EDGE;
    this.glWrapT = settings.wrapT || gl.CLAMP_TO_EDGE;
    this.glDataType = settings.dataType || gl.UNSIGNED_BYTE;

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

    // used to determine if this texture might need constant updating
    // because it is a video or gif.
    this.isSrcMediaElement =
      typeof p5.MediaElement !== 'undefined' && obj instanceof p5.MediaElement;
    this._videoPrevUpdateTime = 0;
    this.isSrcHTMLElement =
      typeof p5.Element !== 'undefined' &&
      obj instanceof p5.Element &&
      !(obj instanceof p5.Graphics) &&
      !(obj instanceof p5.Renderer);
    this.isSrcP5Image = obj instanceof p5.Image;
    this.isSrcP5Graphics = obj instanceof p5.Graphics;
    this.isSrcP5Renderer = obj instanceof p5.Renderer;
    this.isImageData =
      typeof ImageData !== 'undefined' && obj instanceof ImageData;
    this.isFramebufferTexture = obj instanceof p5.FramebufferTexture;

    const textureData = this._getTextureDataFromSource();
    this.width = textureData.width;
    this.height = textureData.height;

    this.init(textureData);
    return this;
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
    this.isSrcP5Graphics ||
    this.isSrcP5Renderer ||
    this.isSrcHTMLElement
    ) {
    // if param is a video HTML element
      textureData = this.src.elt;
    } else if (this.isImageData) {
      textureData = this.src;
    }
    return textureData;
  }

  /**
   * Initializes common texture parameters, creates a gl texture,
   * tries to upload the texture for the first time if data is
   * already available.
   * @private
   * @method init
   */
  init (data) {
    const gl = this._renderer.GL;
    if (!this.isFramebufferTexture) {
      this.glTex = gl.createTexture();
    }

    this.glWrapS = this._renderer.textureWrapX;
    this.glWrapT = this._renderer.textureWrapY;

    this.setWrapMode(this.glWrapS, this.glWrapT);
    this.bindTexture();

    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);

    if (this.isFramebufferTexture) {
      // Do nothing, the framebuffer manages its own content
    } else if (
      this.width === 0 ||
      this.height === 0 ||
      (this.isSrcMediaElement && !this.src.loadedmetadata)
    ) {
    // assign a 1×1 empty texture initially, because data is not yet ready,
    // so that no errors occur in gl console!
      const tmpdata = new Uint8Array([1, 1, 1, 1]);
      gl.texImage2D(
        this.glTarget,
        0,
        gl.RGBA,
        1,
        1,
        0,
        this.glFormat,
        this.glDataType,
        tmpdata
      );
    } else {
    // data is ready: just push the texture!
      gl.texImage2D(
        this.glTarget,
        0,
        this.glFormat,
        this.glFormat,
        this.glDataType,
        data
      );
    }
  }

  /**
   * Checks if the source data for this texture has changed (if it's
   * easy to do so) and reuploads the texture if necessary. If it's not
   * possible or too expensive to do a calculation to determine whether or
   * not the data has occurred, this method simply re-uploads the texture.
   * @method update
   */
  update () {
    const data = this.src;
    if (data.width === 0 || data.height === 0) {
      return false; // nothing to do!
    }

    // FramebufferTexture instances wrap raw WebGL textures already, which
    // don't need any extra updating, as they already live on the GPU
    if (this.isFramebufferTexture) {
      return false;
    }

    const textureData = this._getTextureDataFromSource();
    let updated = false;

    const gl = this._renderer.GL;
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
        this.glDataType,
        textureData
      );
    }

    return updated;
  }

  /**
   * Binds the texture to the appropriate GL target.
   * @method bindTexture
   */
  bindTexture () {
    // bind texture using gl context + glTarget and
    // generated gl texture object
    const gl = this._renderer.GL;
    gl.bindTexture(this.glTarget, this.getTexture());

    return this;
  }

  /**
   * Unbinds the texture from the appropriate GL target.
   * @method unbindTexture
   */
  unbindTexture () {
    // unbind per above, disable texturing on glTarget
    const gl = this._renderer.GL;
    gl.bindTexture(this.glTarget, null);
  }

  getTexture() {
    if (this.isFramebufferTexture) {
      return this.src.rawTexture();
    } else {
      return this.glTex;
    }
  }

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
  setInterpolation (downScale, upScale) {
    const gl = this._renderer.GL;

    this.glMinFilter = this.glFilter(downScale);
    this.glMagFilter = this.glFilter(upScale);

    this.bindTexture();
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
    this.unbindTexture();
  }

  glFilter(filter) {
    const gl = this._renderer.GL;
    if (filter === constants.NEAREST) {
      return gl.NEAREST;
    } else {
      return gl.LINEAR;
    }
  }

  /**
   * Sets the texture wrapping mode. This controls how textures behave
   * when their uv's go outside of the 0 - 1 range. There are three options:
   * CLAMP, REPEAT, and MIRROR. REPEAT & MIRROR are only available if the texture
   * is a power of two size (128, 256, 512, 1024, etc.).
   * @method setWrapMode
   * @param {String} wrapX Controls the horizontal texture wrapping behavior
   * @param {String} wrapY Controls the vertical texture wrapping behavior
   */
  setWrapMode (wrapX, wrapY) {
    const gl = this._renderer.GL;

    // for webgl 1 we need to check if the texture is power of two
    // if it isn't we will set the wrap mode to CLAMP
    // webgl2 will support npot REPEAT and MIRROR but we don't check for it yet
    const isPowerOfTwo = x => (x & (x - 1)) === 0;
    const textureData = this._getTextureDataFromSource();

    let wrapWidth;
    let wrapHeight;

    if (textureData.naturalWidth && textureData.naturalHeight) {
      wrapWidth = textureData.naturalWidth;
      wrapHeight = textureData.naturalHeight;
    } else {
      wrapWidth = this.width;
      wrapHeight = this.height;
    }

    const widthPowerOfTwo = isPowerOfTwo(wrapWidth);
    const heightPowerOfTwo = isPowerOfTwo(wrapHeight);

    if (wrapX === constants.REPEAT) {
      if (
        this._renderer.webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
      ) {
        this.glWrapS = gl.REPEAT;
      } else {
        console.warn(
          'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
        );
        this.glWrapS = gl.CLAMP_TO_EDGE;
      }
    } else if (wrapX === constants.MIRROR) {
      if (
        this._renderer.webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
      ) {
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
      if (
        this._renderer.webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
      ) {
        this.glWrapT = gl.REPEAT;
      } else {
        console.warn(
          'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
        );
        this.glWrapT = gl.CLAMP_TO_EDGE;
      }
    } else if (wrapY === constants.MIRROR) {
      if (
        this._renderer.webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
      ) {
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
  }
};

export class MipmapTexture extends p5.Texture {
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

export function checkWebGLCapabilities({ GL, webglVersion }) {
  const gl = GL;
  const supportsFloat = webglVersion === constants.WEBGL2
    ? (gl.getExtension('EXT_color_buffer_float') &&
        gl.getExtension('EXT_float_blend'))
    : gl.getExtension('OES_texture_float');
  const supportsFloatLinear = supportsFloat &&
    gl.getExtension('OES_texture_float_linear');
  const supportsHalfFloat = webglVersion === constants.WEBGL2
    ? gl.getExtension('EXT_color_buffer_float')
    : gl.getExtension('OES_texture_half_float');
  const supportsHalfFloatLinear = supportsHalfFloat &&
    gl.getExtension('OES_texture_half_float_linear');
  const supportsCubemap = (webglVersion === constants.WEBGL2)
    || (gl.getExtension('OES_texture_cube_map'));
  return {
    float: supportsFloat,
    floatLinear: supportsFloatLinear,
    halfFloat: supportsHalfFloat,
    halfFloatLinear: supportsHalfFloatLinear,
    cubemap: supportsCubemap
  };
}

export class CubemapTexture extends p5.Texture {
  constructor(renderer, faces, settings) {
    super(renderer, faces, settings);
  }

  glFilter(_filter) {
    const gl = this._renderer.GL;
    // TODO: Support other filters if needed
    return gl.LINEAR;
  }

  _getTextureDataFromSource() {
    return this.src;
  }

  init(faces) {
    const gl = this._renderer.GL;
    this.glTex = gl.createTexture();

    this.bindTexture();

    // Looping through each face and loading the data
    for (let faceIndex = 0; faceIndex < faces.length; faceIndex++) {
      // Setting up each face of the cubemap
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
        0,
        this.glFormat,
        this.width,
        this.height,
        0,
        this.glFormat,
        this.glDataType,
        faces[faceIndex]
      );
    }

    // Set parameters for the cubemap
    gl.texParameteri(gl.TEXTURE_CUBE_MAP
      , gl.TEXTURE_MAG_FILTER, this.glMagFilter);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP
      , gl.TEXTURE_MIN_FILTER, this.glMinFilter);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP
      , gl.TEXTURE_WRAP_S, this.glWrapS);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP
      , gl.TEXTURE_WRAP_T, this.glWrapT);

    this.unbindTexture();
  }

  update() {
    // Custom update logic, if needed
  }
}

export default p5.Texture;
