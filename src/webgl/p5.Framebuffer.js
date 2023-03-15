import p5 from '../core/main';
import * as constants from '../core/constants';
import { checkWebGLCapabilities } from './p5.Texture';

class FramebufferCamera extends p5.Camera {
  constructor(fbo) {
    super(fbo.target._renderer);
    this.fbo = fbo;
  }

  _computeCameraDefaultSettings() {
    super._computeCameraDefaultSettings();
    this.defaultAspectRatio = this.fbo.width / this.fbo.height;
    this.defaultEyeZ =
      this.fbo.height / 2.0 / Math.tan(this.defaultCameraFOV / 2.0);
    this.defaultCameraNear = this.defaultEyeZ * 0.1;
    this.defaultCameraFar = this.defaultEyeZ * 10;
  }

  resize() {
    // If we're using the default camera, update the aspect ratio
    if (this.cameraType === 'default') {
      this._computeCameraDefaultSettings();
      this._setDefaultCamera();
    } else {
      this.perspective(
        this.cameraFOV,
        this.fbo.width / this.fbo.height
      );
    }
  }
}

p5.FramebufferCamera = FramebufferCamera;

class FramebufferTexture {
  constructor(framebuffer, property) {
    this.framebuffer = framebuffer;
    this.property = property;
  }

  get width() {
    return this.framebuffer.width * this.framebuffer.density;
  }

  get height() {
    return this.framebuffer.height * this.framebuffer.density;
  }

  rawTexture() {
    return this.framebuffer[this.property];
  }
}

p5.FramebufferTexture = FramebufferTexture;

class Framebuffer {
  /**
   * @param target A p5 global instance of p5.Graphics
   * @param settings An optional settings object
   */
  constructor(target, settings = {}) {
    this.target = target;
    this.target._renderer.framebuffers.add(this);

    this.format = settings.format || constants.UNSIGNED_BYTE;
    this.channels = settings.channels || (
      target._renderer._glAttributes.alpha ? constants.RGBA : constants.RGB
    );
    this.depthFormat = settings.depthFormat || (
      this.format === constants.UNSIGNED_BYTE
        ? constants.UNSIGNED_BYTE
        : constants.FLOAT
    );
    this.antialias = (
      settings.antialias === undefined
        ? target._renderer._glAttributes.antialias
        : settings.antialias
    );
    if (this.antialias && target.webglVersion !== constants.WEBGL2) {
      console.warn('Antialiasing is unsupported in a WebGL 1 context');
      this.antialias = false;
    }
    if (settings.width && settings.height) {
      this.width = settings.width;
      this.height = settings.height;
      this.autoSized = false;
    } else {
      this.width = target.width;
      this.height = target.height;
      this.autoSized = true;
    }
    this.density = settings.density || target.pixelDensity();

    const gl = target._renderer.GL;
    this.gl = gl;

    this._checkIfFormatsAvailable();

    this.framebuffer = gl.createFramebuffer();
    if (!this.framebuffer) {
      throw new Error('Unable to create a framebuffer');
    }
    if (this.antialias) {
      this.aaFramebuffer = gl.createFramebuffer();
      if (!this.aaFramebuffer) {
        throw new Error('Unable to create a framebuffer');
      }
    }

    this._recreateTextures();

    const prevCam = this.target._renderer._curCamera;
    this.defaultCamera = this.createCamera();
    this.target._renderer._curCamera = prevCam;
  }

  resizeCanvas(width, height) {
    this.autoSized = false;
    this.width = width;
    this.height = height;
    this._handleResize();
  }

  pixelDensity(density) {
    if (density) {
      this.autoSized = false;
      this.density = density;
      this._handleResize();
    } else {
      return this.density;
    }
  }

  autoSized(autoSized) {
    if (autoSized === undefined) {
      return this.autoSized;
    } else {
      this.autoSized = autoSized;
      this._handleResize();
    }
  }

  _checkIfFormatsAvailable() {
    const gl = this.gl;

    if (
      this.target.webglVersion === constants.WEBGL &&
      !gl.getExtension('WEBGL_depth_texture')
    ) {
      throw new Error('Unable to create depth textures in this environment');
    }

    if (
      this.target.webglVersion === constants.WEBGL &&
      this.depthFormat === constants.FLOAT
    ) {
      console.warn(
        'FLOAT depth format is unavailable in WebGL 1. ' +
          'Defaulting to UNSIGNED_BYTE.'
      );
      this.depthFormat = constants.UNSIGNED_BYTE;
    }

    if (![
      constants.UNSIGNED_BYTE,
      constants.FLOAT,
      constants.HALF_FLOAT
    ].includes(this.format)) {
      console.warn(
        'Unknown Framebuffer format. ' +
          'Please use UNSIGNED_BYTE, FLOAT, or HALF_FLOAT. ' +
          'Defaulting to UNSIGNED_BYTE.'
      );
      this.format = constants.UNSIGNED_BYTE;
    }
    if (![
      constants.UNSIGNED_BYTE,
      constants.FLOAT
    ].includes(this.depthFormat)) {
      console.warn(
        'Unknown Framebuffer depth format. ' +
          'Please use UNSIGNED_BYTE or FLOAT. Defaulting to UNSIGNED_BYTE.'
      );
      this.depthFormat = constants.UNSIGNED_BYTE;
    }

    const support = checkWebGLCapabilities(this.target._renderer);
    if (!support.float && this.format === constants.FLOAT) {
      console.warn(
        'This environment does not support FLOAT textures. ' +
          'Falling back to UNSIGNED_BYTE.'
      );
      this.format = constants.UNSIGNED_BYTE;
    }
    if (!support.float && this.depthFormat === constants.FLOAT) {
      console.warn(
        'This environment does not support FLOAT depth textures. ' +
          'Falling back to UNSIGNED_BYTE.'
      );
      this.depthFormat = constants.UNSIGNED_BYTE;
    }
    if (!support.halfFloat && this.format === constants.HALF_FLOAT) {
      console.warn(
        'This environment does not support HALF_FLOAT textures. ' +
          'Falling back to UNSIGNED_BYTE.'
      );
      this.format = constants.UNSIGNED_BYTE;
    }

    if (
      this.channels === constants.RGB &&
      [constants.FLOAT, constants.HALF_FLOAT].includes(this.format)
    ) {
      console.warn(
        'FLOAT and HALF_FLOAT formats do not work cross-platform with only ' +
          'RGB channels. Falling back to RGBA.'
      );
      this.channels = constants.RGBA;
    }
  }

  _recreateTextures() {
    const gl = this.gl;

    this._updateSize();

    const prevBoundTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
    const prevBoundFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    const colorTexture = gl.createTexture();
    if (!colorTexture) {
      throw new Error('Unable to create color texture');
    }
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    const colorFormat = this._glColorFormat();
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      colorFormat.internalFormat,
      this.width * this.density,
      this.height * this.density,
      0,
      colorFormat.format,
      colorFormat.type,
      null
    );

    // Create the depth texture
    const depthTexture = gl.createTexture();
    if (!depthTexture) {
      throw new Error('Unable to create depth texture');
    }
    const depthFormat = this._glDepthFormat();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      depthFormat.internalFormat,
      this.width * this.density,
      this.height * this.density,
      0,
      depthFormat.format,
      depthFormat.type,
      null
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      colorTexture,
      0
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      depthTexture,
      0
    );

    // Create separate framebuffer for antialiasing
    if (this.antialias) {
      this.colorRenderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.colorRenderbuffer);
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        Math.min(4, gl.getParameter(gl.MAX_SAMPLES)),
        colorFormat.internalFormat,
        this.width * this.density,
        this.height * this.density
      );

      this.depthRenderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer);
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        Math.min(4, gl.getParameter(gl.MAX_SAMPLES)),
        depthFormat.internalFormat,
        this.width * this.density,
        this.height * this.density
      );

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.aaFramebuffer);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.RENDERBUFFER,
        this.colorRenderbuffer
      );
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        this.depthRenderbuffer
      );
    }

    this.depthTexture = depthTexture;
    this.colorTexture = colorTexture;

    this.depth = new FramebufferTexture(this, 'depthTexture');
    const depthP5Texture = new p5.Texture(
      this.target._renderer,
      this.depth,
      {
        minFilter: gl.NEAREST,
        magFilter: gl.NEAREST
      }
    );
    this.target._renderer.textures.set(this.color, depthP5Texture);

    this.color = new FramebufferTexture(this, 'colorTexture');
    const colorP5Texture = new p5.Texture(
      this.target._renderer,
      this.color,
      {
        glMinFilter: gl.LINEAR,
        glMagFilter: gl.LINEAR
      }
    );
    this.target._renderer.textures.set(this.color, colorP5Texture);

    gl.bindTexture(gl.TEXTURE_2D, prevBoundTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevBoundFramebuffer);
  }

  _glColorFormat() {
    let type, format, internalFormat;
    const gl = this.gl;

    if (this.format === constants.FLOAT) {
      type = gl.FLOAT;
    } else if (this.format === constants.HALF_FLOAT) {
      type = this.target.webglVersion === constants.WEBGL2
        ? gl.HALF_FLOAT
        : gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;
    } else {
      type = gl.UNSIGNED_BYTE;
    }

    if (this.channels === constants.RGBA) {
      format = gl.RGBA;
    } else {
      format = gl.RGB;
    }

    if (this.target.webglVersion === constants.WEBGL2) {
      // https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
      const table = {
        [gl.FLOAT]: {
          [gl.RGBA]: gl.RGBA32F
          // gl.RGB32F is not available in Firefox without an alpha channel
        },
        [gl.HALF_FLOAT]: {
          [gl.RGBA]: gl.RGBA16F
          // gl.RGB16F is not available in Firefox without an alpha channel
        },
        [gl.UNSIGNED_BYTE]: {
          [gl.RGBA]: gl.RGBA8, // gl.RGBA4
          [gl.RGB]: gl.RGB8 // gl.RGB565
        }
      };
      internalFormat = table[type][format];
    } else if (this.format === constants.HALF_FLOAT) {
      internalFormat = gl.RGBA;
    } else {
      internalFormat = format;
    }

    return { internalFormat, format, type };
  }

  _glDepthFormat() {
    let type, format, internalFormat;
    const gl = this.gl;

    if (this.depthFormat === constants.FLOAT) {
      type = gl.FLOAT;
    } else {
      type = gl.UNSIGNED_INT;
    }

    format = gl.DEPTH_COMPONENT;

    if (this.target.webglVersion === constants.WEBGL2) {
      if (this.depthFormat === constants.FLOAT) {
        internalFormat = gl.DEPTH_COMPONENT32F;
      } else {
        internalFormat = gl.DEPTH_COMPONENT24;
      }
    } else {
      internalFormat = gl.DEPTH_COMPONENT;
    }

    return { internalFormat, format, type };
  }

  _updateSize() {
    if (this.autoSized) {
      this.width = this.target.width;
      this.height = this.target.height;
      this.density = this.target.pixelDensity();
    }
  }

  _handleResize() {
    this.cam.resize();

    const oldColor = this.color;
    const oldDepth = this.depth;
    const oldColorRenderbuffer = this.colorRenderbuffer;
    const oldDepthRenderbuffer = this.depthRenderbuffer;

    this.recreateTextures();

    this._deleteTexture(oldColor);
    this._deleteTexture(oldDepth);
    const gl = this.gl;
    if (oldColorRenderbuffer) gl.deleteRenderbuffer(oldColorRenderbuffer);
    if (oldDepthRenderbuffer) gl.deleteRenderbuffer(oldDepthRenderbuffer);
  }

  createCamera() {
    const cam = new FramebufferCamera(this);
    cam._computeCameraDefaultSettings();
    cam._setDefaultCamera();
    this.target._renderer._curCamera = cam;
    return cam;
  }

  _deleteTexture(texture) {
    const gl = this.gl;
    gl.deleteTexture(texture.rawTexture());

    this.target._renderer.textures.delete(texture);
  }

  remove() {
    const gl = this.gl;
    this._deleteTexture(this.color);
    this._deleteTexture(this.depth);
    gl.deleteFramebuffer(this.framebuffer);
    if (this.aaFramebuffer) {
      gl.deleteFramebuffer(this.aaFramebuffer);
    }
    if (this.depthRenderbuffer) {
      gl.deleteRenderbuffer(this.depthRenderbuffer);
    }
    if (this.colorRenderbuffer) {
      gl.deleteRenderbuffer(this.colorRenderbuffer);
    }
    this.target._renderer.framebuffers.delete(this);
  }

  begin() {
    const gl = this.gl;
    this.prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    if (this.antialias) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.aaFramebuffer);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    }
    this.prevViewport = gl.getParameter(gl.VIEWPORT);
    gl.viewport(
      0,
      0,
      this.width * this.density,
      this.height * this.density
    );
    this.target.push();
    this.target.setCamera(this.defaultCamera);
    this.target._renderer.uMVMatrix.set(
      this.target._renderer._curCamera.cameraMatrix.mat4[0],
      this.target._renderer._curCamera.cameraMatrix.mat4[1],
      this.target._renderer._curCamera.cameraMatrix.mat4[2],
      this.target._renderer._curCamera.cameraMatrix.mat4[3],
      this.target._renderer._curCamera.cameraMatrix.mat4[4],
      this.target._renderer._curCamera.cameraMatrix.mat4[5],
      this.target._renderer._curCamera.cameraMatrix.mat4[6],
      this.target._renderer._curCamera.cameraMatrix.mat4[7],
      this.target._renderer._curCamera.cameraMatrix.mat4[8],
      this.target._renderer._curCamera.cameraMatrix.mat4[9],
      this.target._renderer._curCamera.cameraMatrix.mat4[10],
      this.target._renderer._curCamera.cameraMatrix.mat4[11],
      this.target._renderer._curCamera.cameraMatrix.mat4[12],
      this.target._renderer._curCamera.cameraMatrix.mat4[13],
      this.target._renderer._curCamera.cameraMatrix.mat4[14],
      this.target._renderer._curCamera.cameraMatrix.mat4[15]
    );
  }

  end() {
    const gl = this.gl;
    if (this.antialias) {
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.aaFramebuffer);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer);
      for (const [flag, filter] of [
        [gl.COLOR_BUFFER_BIT, gl.LINEAR],
        [gl.DEPTH_BUFFER_BIT, gl.NEAREST]
      ]) {
        gl.blitFramebuffer(
          0, 0,
          this.width * this.density, this.height * this.density,
          0, 0,
          this.width * this.density, this.height * this.density,
          flag,
          filter
        );
      }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.prevFramebuffer);
    gl.viewport(...this.prevViewport);
    this.target.pop();
  }

  draw(callback) {
    this.begin();
    callback();
    this.end();
  }
}

p5.Framebuffer = Framebuffer;

export default Framebuffer;
