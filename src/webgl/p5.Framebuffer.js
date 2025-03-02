/**
 * @module Rendering
 * @requires constants
 */

import * as constants from '../core/constants';
import { RGB, RGBA } from '../color/creating_reading';
import { checkWebGLCapabilities } from './p5.Texture';
import { readPixelsWebGL, readPixelWebGL } from './p5.RendererGL';
import { Camera } from './p5.Camera';
import { Texture } from './p5.Texture';
import { Image } from '../image/p5.Image';

const constrain = (n, low, high) => Math.max(Math.min(n, high), low);

class FramebufferCamera extends Camera {
  constructor(framebuffer) {
    super(framebuffer.renderer);
    this.fbo = framebuffer;

    // WebGL textures are upside-down compared to textures that come from
    // images and graphics. Framebuffer cameras need to invert their y
    // axes when being rendered to so that the texture comes out rightway up
    // when read in shaders or image().
    this.yScale = -1;
  }

  _computeCameraDefaultSettings() {
    super._computeCameraDefaultSettings();
    this.defaultAspectRatio = this.fbo.width / this.fbo.height;
    this.defaultCameraFOV =
      2 * Math.atan(this.fbo.height / 2 / this.defaultEyeZ);
  }
}

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

class Framebuffer {
  constructor(renderer, settings = {}) {
    this.renderer = renderer;
    this.renderer.framebuffers.add(this);

    this._isClipApplied = false;

    this.pixels = [];

    this.format = settings.format || constants.UNSIGNED_BYTE;
    this.channels = settings.channels || (
      this.renderer._pInst._glAttributes.alpha
        ? RGBA
        : RGB
    );
    this.useDepth = settings.depth === undefined ? true : settings.depth;
    this.depthFormat = settings.depthFormat || constants.FLOAT;
    this.textureFiltering = settings.textureFiltering || constants.LINEAR;
    if (settings.antialias === undefined) {
      this.antialiasSamples = this.renderer._pInst._glAttributes.antialias
        ? 2
        : 0;
    } else if (typeof settings.antialias === 'number') {
      this.antialiasSamples = settings.antialias;
    } else {
      this.antialiasSamples = settings.antialias ? 2 : 0;
    }
    this.antialias = this.antialiasSamples > 0;
    if (this.antialias && this.renderer.webglVersion !== constants.WEBGL2) {
      console.warn('Antialiasing is unsupported in a WebGL 1 context');
      this.antialias = false;
    }
    this.density = settings.density || this.renderer._pixelDensity;
    const gl = this.renderer.GL;
    this.gl = gl;
    if (settings.width && settings.height) {
      const dimensions =
        this.renderer._adjustDimensions(settings.width, settings.height);
      this.width = dimensions.adjustedWidth;
      this.height = dimensions.adjustedHeight;
      this._autoSized = false;
    } else {
      if ((settings.width === undefined) !== (settings.height === undefined)) {
        console.warn(
          'Please supply both width and height for a framebuffer to give it a ' +
            'size. Only one was given, so the framebuffer will match the size ' +
            'of its canvas.'
        );
      }
      this.width = this.renderer.width;
      this.height = this.renderer.height;
      this._autoSized = true;
    }
    this._checkIfFormatsAvailable();

    if (settings.stencil && !this.useDepth) {
      console.warn('A stencil buffer can only be used if also using depth. Since the framebuffer has no depth buffer, the stencil buffer will be ignored.');
    }
    this.useStencil = this.useDepth &&
      (settings.stencil === undefined ? true : settings.stencil);

    this.framebuffer = gl.createFramebuffer();
    if (!this.framebuffer) {
      throw new Error('Unable to create a framebuffer');
    }
    if (this.antialias) {
      this.aaFramebuffer = gl.createFramebuffer();
      if (!this.aaFramebuffer) {
        throw new Error('Unable to create a framebuffer for antialiasing');
      }
    }

    this._recreateTextures();

    const prevCam = this.renderer.states.curCamera;
    this.defaultCamera = this.createCamera();
    this.filterCamera = this.createCamera();
    this.renderer.states.setValue('curCamera', prevCam);

    this.draw(() => this.renderer.clear());
  }

  /**
   * Resizes the framebuffer to a given width and height.
   *
   * The parameters, `width` and `height`, set the dimensions of the
   * framebuffer. For example, calling `myBuffer.resize(300, 500)` resizes
   * the framebuffer to 300×500 pixels, then sets `myBuffer.width` to 300
   * and `myBuffer.height` 500.
   *
   * @param {Number} width width of the framebuffer.
   * @param {Number} height height of the framebuffer.
   *
   * @example
   * <div>
   * <code>
   * let myBuffer;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   describe('A multicolor sphere on a white surface. The image grows larger or smaller when the user moves the mouse, revealing a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw to the p5.Framebuffer object.
   *   myBuffer.begin();
   *   background(255);
   *   normalMaterial();
   *   sphere(20);
   *   myBuffer.end();
   *
   *   // Display the p5.Framebuffer object.
   *   image(myBuffer, -50, -50);
   * }
   *
   * // Resize the p5.Framebuffer object when the
   * // user moves the mouse.
   * function mouseMoved() {
   *   myBuffer.resize(mouseX, mouseY);
   * }
   * </code>
   * </div>
   */
  resize(width, height) {
    this._autoSized = false;
    const dimensions =
      this.renderer._adjustDimensions(width, height);
    width = dimensions.adjustedWidth;
    height = dimensions.adjustedHeight;
    this.width = width;
    this.height = height;
    this._handleResize();
  }

  /**
   * Sets the framebuffer's pixel density or returns its current density.
   *
   * Computer displays are grids of little lights called pixels. A display's
   * pixel density describes how many pixels it packs into an area. Displays
   * with smaller pixels have a higher pixel density and create sharper
   * images.
   *
   * The parameter, `density`, is optional. If a number is passed, as in
   * `myBuffer.pixelDensity(1)`, it sets the framebuffer's pixel density. By
   * default, the framebuffer's pixel density will match that of the canvas
   * where it was created. All canvases default to match the display's pixel
   * density.
   *
   * Calling `myBuffer.pixelDensity()` without an argument returns its current
   * pixel density.
   *
   * @param {Number} [density] pixel density to set.
   * @returns {Number} current pixel density.
   *
   * @example
   * <div>
   * <code>
   * let myBuffer;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   describe("A white circle on a gray canvas. The circle's edge become fuzzy while the user presses and holds the mouse.");
   * }
   *
   * function draw() {
   *   // Draw to the p5.Framebuffer object.
   *   myBuffer.begin();
   *   background(200);
   *   circle(0, 0, 40);
   *   myBuffer.end();
   *
   *   // Display the p5.Framebuffer object.
   *   image(myBuffer, -50, -50);
   * }
   *
   * // Decrease the pixel density when the user
   * // presses the mouse.
   * function mousePressed() {
   *   myBuffer.pixelDensity(1);
   * }
   *
   * // Increase the pixel density when the user
   * // releases the mouse.
   * function mouseReleased() {
   *   myBuffer.pixelDensity(2);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let myBuffer;
   * let myFont;
   *
   * async function setup() {
   *   // Load a font and create a p5.Font object.
   *   myFont = await loadFont('assets/inconsolata.otf');
   *
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   // Get the p5.Framebuffer object's pixel density.
   *   let d = myBuffer.pixelDensity();
   *
   *   // Style the text.
   *   textAlign(CENTER, CENTER);
   *   textFont(myFont);
   *   textSize(16);
   *   fill(0);
   *
   *   // Display the pixel density.
   *   text(`Density: ${d}`, 0, 0);
   *
   *   describe(`The text "Density: ${d}" written in black on a gray background.`);
   * }
   * </code>
   * </div>
   */
  pixelDensity(density) {
    if (density) {
      this._autoSized = false;
      this.density = density;
      this._handleResize();
    } else {
      return this.density;
    }
  }

  /**
   * Toggles the framebuffer's autosizing mode or returns the current mode.
   *
   * By default, the framebuffer automatically resizes to match the canvas
   * that created it. Calling `myBuffer.autoSized(false)` disables this
   * behavior and calling `myBuffer.autoSized(true)` re-enables it.
   *
   * Calling `myBuffer.autoSized()` without an argument returns `true` if
   * the framebuffer automatically resizes and `false` if not.
   *
   * @param {Boolean} [autoSized] whether to automatically resize the framebuffer to match the canvas.
   * @returns {Boolean} current autosize setting.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle the autosizing mode.
   *
   * let myBuffer;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   describe('A multicolor sphere on a gray background. The image resizes when the user moves the mouse.');
   * }
   *
   * function draw() {
   *   background(50);
   *
   *   // Draw to the p5.Framebuffer object.
   *   myBuffer.begin();
   *   background(200);
   *   normalMaterial();
   *   sphere(width / 4);
   *   myBuffer.end();
   *
   *   // Display the p5.Framebuffer object.
   *   image(myBuffer, -width / 2, -height / 2);
   * }
   *
   * // Resize the canvas when the user moves the mouse.
   * function mouseMoved() {
   *   let w = constrain(mouseX, 0, 100);
   *   let h = constrain(mouseY, 0, 100);
   *   resizeCanvas(w, h);
   * }
   *
   * // Toggle autoSizing when the user double-clicks.
   * // Note: opened an issue to fix(?) this.
   * function doubleClicked() {
   *   let isAuto = myBuffer.autoSized();
   *   myBuffer.autoSized(!isAuto);
   * }
   * </code>
   * </div>
   */
  autoSized(autoSized) {
    if (autoSized === undefined) {
      return this._autoSized;
    } else {
      this._autoSized = autoSized;
      this._handleResize();
    }
  }

  /**
   * Checks the capabilities of the current WebGL environment to see if the
   * settings supplied by the user are capable of being fulfilled. If they
   * are not, warnings will be logged and the settings will be changed to
   * something close that can be fulfilled.
   *
   * @private
   */
  _checkIfFormatsAvailable() {
    const gl = this.gl;

    if (
      this.useDepth &&
      this.renderer.webglVersion === constants.WEBGL &&
      !gl.getExtension('WEBGL_depth_texture')
    ) {
      console.warn(
        'Unable to create depth textures in this environment. Falling back ' +
          'to a framebuffer without depth.'
      );
      this.useDepth = false;
    }

    if (
      this.useDepth &&
      this.renderer.webglVersion === constants.WEBGL &&
      this.depthFormat === constants.FLOAT
    ) {
      console.warn(
        'FLOAT depth format is unavailable in WebGL 1. ' +
          'Defaulting to UNSIGNED_INT.'
      );
      this.depthFormat = constants.UNSIGNED_INT;
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
    if (this.useDepth && ![
      constants.UNSIGNED_INT,
      constants.FLOAT
    ].includes(this.depthFormat)) {
      console.warn(
        'Unknown Framebuffer depth format. ' +
          'Please use UNSIGNED_INT or FLOAT. Defaulting to FLOAT.'
      );
      this.depthFormat = constants.FLOAT;
    }

    const support = checkWebGLCapabilities(this.renderer);
    if (!support.float && this.format === constants.FLOAT) {
      console.warn(
        'This environment does not support FLOAT textures. ' +
          'Falling back to UNSIGNED_BYTE.'
      );
      this.format = constants.UNSIGNED_BYTE;
    }
    if (
      this.useDepth &&
      !support.float &&
      this.depthFormat === constants.FLOAT
    ) {
      console.warn(
        'This environment does not support FLOAT depth textures. ' +
          'Falling back to UNSIGNED_INT.'
      );
      this.depthFormat = constants.UNSIGNED_INT;
    }
    if (!support.halfFloat && this.format === constants.HALF_FLOAT) {
      console.warn(
        'This environment does not support HALF_FLOAT textures. ' +
          'Falling back to UNSIGNED_BYTE.'
      );
      this.format = constants.UNSIGNED_BYTE;
    }

    if (
      this.channels === RGB &&
      [constants.FLOAT, constants.HALF_FLOAT].includes(this.format)
    ) {
      console.warn(
        'FLOAT and HALF_FLOAT formats do not work cross-platform with only ' +
          'RGB channels. Falling back to RGBA.'
      );
      this.channels = RGBA;
    }
  }

  /**
   * Creates new textures and renderbuffers given the current size of the
   * framebuffer.
   *
   * @private
   */
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
    this.colorTexture = colorTexture;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      colorTexture,
      0
    );

    if (this.useDepth) {
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

      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        this.useStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT,
        gl.TEXTURE_2D,
        depthTexture,
        0
      );
      this.depthTexture = depthTexture;
    }

    // Create separate framebuffer for antialiasing
    if (this.antialias) {
      this.colorRenderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.colorRenderbuffer);
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        Math.max(
          0,
          Math.min(this.antialiasSamples, gl.getParameter(gl.MAX_SAMPLES))
        ),
        colorFormat.internalFormat,
        this.width * this.density,
        this.height * this.density
      );

      if (this.useDepth) {
        const depthFormat = this._glDepthFormat();
        this.depthRenderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer);
        gl.renderbufferStorageMultisample(
          gl.RENDERBUFFER,
          Math.max(
            0,
            Math.min(this.antialiasSamples, gl.getParameter(gl.MAX_SAMPLES))
          ),
          depthFormat.internalFormat,
          this.width * this.density,
          this.height * this.density
        );
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.aaFramebuffer);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.RENDERBUFFER,
        this.colorRenderbuffer
      );
      if (this.useDepth) {
        gl.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          this.useStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT,
          gl.RENDERBUFFER,
          this.depthRenderbuffer
        );
      }
    }

    if (this.useDepth) {
      this.depth = new FramebufferTexture(this, 'depthTexture');
      const depthFilter = gl.NEAREST;
      this.depthP5Texture = new Texture(
        this.renderer,
        this.depth,
        {
          minFilter: depthFilter,
          magFilter: depthFilter
        }
      );
      this.renderer.textures.set(this.depth, this.depthP5Texture);
    }

    this.color = new FramebufferTexture(this, 'colorTexture');
    const filter = this.textureFiltering === constants.LINEAR
      ? gl.LINEAR
      : gl.NEAREST;
    this.colorP5Texture = new Texture(
      this.renderer,
      this.color,
      {
        minFilter: filter,
        magFilter: filter
      }
    );
    this.renderer.textures.set(this.color, this.colorP5Texture);

    gl.bindTexture(gl.TEXTURE_2D, prevBoundTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevBoundFramebuffer);
  }

  /**
   * To create a WebGL texture, one needs to supply three pieces of information:
   * the type (the data type each channel will be stored as, e.g. int or float),
   * the format (the color channels that will each be stored in the previously
   * specified type, e.g. rgb or rgba), and the internal format (the specifics
   * of how data for each channel, in the aforementioned type, will be packed
   * together, such as how many bits to use, e.g. RGBA32F or RGB565.)
   *
   * The format and channels asked for by the user hint at what these values
   * need to be, and the WebGL version affects what options are avaiable.
   * This method returns the values for these three properties, given the
   * framebuffer's settings.
   *
   * @private
   */
  _glColorFormat() {
    let type, format, internalFormat;
    const gl = this.gl;

    if (this.format === constants.FLOAT) {
      type = gl.FLOAT;
    } else if (this.format === constants.HALF_FLOAT) {
      type = this.renderer.webglVersion === constants.WEBGL2
        ? gl.HALF_FLOAT
        : gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;
    } else {
      type = gl.UNSIGNED_BYTE;
    }

    if (this.channels === RGBA) {
      format = gl.RGBA;
    } else {
      format = gl.RGB;
    }

    if (this.renderer.webglVersion === constants.WEBGL2) {
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

  /**
   * To create a WebGL texture, one needs to supply three pieces of information:
   * the type (the data type each channel will be stored as, e.g. int or float),
   * the format (the color channels that will each be stored in the previously
   * specified type, e.g. rgb or rgba), and the internal format (the specifics
   * of how data for each channel, in the aforementioned type, will be packed
   * together, such as how many bits to use, e.g. RGBA32F or RGB565.)
   *
   * This method takes into account the settings asked for by the user and
   * returns values for these three properties that can be used for the
   * texture storing depth information.
   *
   * @private
   */
  _glDepthFormat() {
    let type, format, internalFormat;
    const gl = this.gl;

    if (this.useStencil) {
      if (this.depthFormat === constants.FLOAT) {
        type = gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
      } else if (this.renderer.webglVersion === constants.WEBGL2) {
        type = gl.UNSIGNED_INT_24_8;
      } else {
        type = gl.getExtension('WEBGL_depth_texture').UNSIGNED_INT_24_8_WEBGL;
      }
    } else {
      if (this.depthFormat === constants.FLOAT) {
        type = gl.FLOAT;
      } else {
        type = gl.UNSIGNED_INT;
      }
    }

    if (this.useStencil) {
      format = gl.DEPTH_STENCIL;
    } else {
      format = gl.DEPTH_COMPONENT;
    }

    if (this.useStencil) {
      if (this.depthFormat === constants.FLOAT) {
        internalFormat = gl.DEPTH32F_STENCIL8;
      } else if (this.renderer.webglVersion === constants.WEBGL2) {
        internalFormat = gl.DEPTH24_STENCIL8;
      } else {
        internalFormat = gl.DEPTH_STENCIL;
      }
    } else if (this.renderer.webglVersion === constants.WEBGL2) {
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

  /**
   * A method that will be called when recreating textures. If the framebuffer
   * is auto-sized, it will update its width, height, and density properties.
   *
   * @private
   */
  _updateSize() {
    if (this._autoSized) {
      this.width = this.renderer.width;
      this.height = this.renderer.height;
      this.density = this.renderer._pixelDensity;
    }
  }

  /**
   * Called when the canvas that the framebuffer is attached to resizes. If the
   * framebuffer is auto-sized, it will update its textures to match the new
   * size.
   *
   * @private
   */
  _canvasSizeChanged() {
    if (this._autoSized) {
      this._handleResize();
    }
  }

  /**
   * Called when the size of the framebuffer has changed (either by being
   * manually updated or from auto-size updates when its canvas changes size.)
   * Old textures and renderbuffers will be deleted, and then recreated with the
   * new size.
   *
   * @private
   */
  _handleResize() {
    const oldColor = this.color;
    const oldDepth = this.depth;
    const oldColorRenderbuffer = this.colorRenderbuffer;
    const oldDepthRenderbuffer = this.depthRenderbuffer;

    this._deleteTexture(oldColor);
    if (oldDepth) this._deleteTexture(oldDepth);
    const gl = this.gl;
    if (oldColorRenderbuffer) gl.deleteRenderbuffer(oldColorRenderbuffer);
    if (oldDepthRenderbuffer) gl.deleteRenderbuffer(oldDepthRenderbuffer);

    this._recreateTextures();
    this.defaultCamera._resize();
  }

  /**
   * Creates a new
   * <a href="#/p5.Camera">p5.Camera</a> object to use with the framebuffer.
   *
   * The new camera is initialized with a default position `(0, 0, 800)` and a
   * default perspective projection. Its properties can be controlled with
   * <a href="#/p5.Camera">p5.Camera</a> methods such as `myCamera.lookAt(0, 0, 0)`.
   *
   * Framebuffer cameras should be created between calls to
   * <a href="#/p5.Framebuffer/begin">myBuffer.begin()</a> and
   * <a href="#/p5.Framebuffer/end">myBuffer.end()</a> like so:
   *
   * ```js
   * let myCamera;
   *
   * myBuffer.begin();
   *
   * // Create the camera for the framebuffer.
   * myCamera = myBuffer.createCamera();
   *
   * myBuffer.end();
   * ```
   *
   * Calling <a href="#/p5/setCamera">setCamera()</a> updates the
   * framebuffer's projection using the camera.
   * <a href="#/p5/resetMatrix">resetMatrix()</a> must also be called for the
   * view to change properly:
   *
   * ```js
   * myBuffer.begin();
   *
   * // Set the camera for the framebuffer.
   * setCamera(myCamera);
   *
   * // Reset all transformations.
   * resetMatrix();
   *
   * // Draw stuff...
   *
   * myBuffer.end();
   * ```
   *
   * @returns {p5.Camera} new camera.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to toggle between cameras.
   *
   * let myBuffer;
   * let cam1;
   * let cam2;
   * let usingCam1 = true;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   // Create the cameras between begin() and end().
   *   myBuffer.begin();
   *
   *   // Create the first camera.
   *   // Keep its default settings.
   *   cam1 = myBuffer.createCamera();
   *
   *   // Create the second camera.
   *   // Place it at the top-left.
   *   // Point it at the origin.
   *   cam2 = myBuffer.createCamera();
   *   cam2.setPosition(400, -400, 800);
   *   cam2.lookAt(0, 0, 0);
   *
   *   myBuffer.end();
   *
   *   describe(
   *     'A white cube on a gray background. The camera toggles between frontal and aerial views when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   // Draw to the p5.Framebuffer object.
   *   myBuffer.begin();
   *   background(200);
   *
   *   // Set the camera.
   *   if (usingCam1 === true) {
   *     setCamera(cam1);
   *   } else {
   *     setCamera(cam2);
   *   }
   *
   *   // Reset all transformations.
   *   resetMatrix();
   *
   *   // Draw the box.
   *   box();
   *
   *   myBuffer.end();
   *
   *   // Display the p5.Framebuffer object.
   *   image(myBuffer, -50, -50);
   * }
   *
   * // Toggle the current camera when the user double-clicks.
   * function doubleClicked() {
   *   if (usingCam1 === true) {
   *     usingCam1 = false;
   *   } else {
   *     usingCam1 = true;
   *   }
   * }
   * </code>
   * </div>
   */
  createCamera() {
    const cam = new FramebufferCamera(this);
    cam._computeCameraDefaultSettings();
    cam._setDefaultCamera();
    return cam;
  }

  /**
   * Given a raw texture wrapper, delete its stored texture from WebGL memory,
   * and remove it from p5's list of active textures.
   *
   * @param {p5.FramebufferTexture} texture
   * @private
   */
  _deleteTexture(texture) {
    const gl = this.gl;
    gl.deleteTexture(texture.rawTexture());

    this.renderer.textures.delete(texture);
  }

  /**
   * Deletes the framebuffer from GPU memory.
   *
   * Calling `myBuffer.remove()` frees the GPU memory used by the framebuffer.
   * The framebuffer also uses a bit of memory on the CPU which can be freed
   * like so:
   *
   * ```js
   * // Delete the framebuffer from GPU memory.
   * myBuffer.remove();
   *
   * // Delete the framebuffer from CPU memory.
   * myBuffer = undefined;
   * ```
   *
   * Note: All variables that reference the framebuffer must be assigned
   * the value `undefined` to delete the framebuffer from CPU memory. If any
   * variable still refers to the framebuffer, then it won't be garbage
   * collected.
   *
   * @example
   * <div>
   * <code>
   * // Double-click to remove the p5.Framebuffer object.
   *
   * let myBuffer;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create an options object.
   *   let options = { width: 60, height: 60 };
   *
   *   // Create a p5.Framebuffer object and
   *   // configure it using options.
   *   myBuffer = createFramebuffer(options);
   *
   *   describe('A white circle at the center of a dark gray square disappears when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Display the p5.Framebuffer object if
   *   // it's available.
   *   if (myBuffer) {
   *     // Draw to the p5.Framebuffer object.
   *     myBuffer.begin();
   *     background(100);
   *     circle(0, 0, 20);
   *     myBuffer.end();
   *
   *     image(myBuffer, -30, -30);
   *   }
   * }
   *
   * // Remove the p5.Framebuffer object when the
   * // the user double-clicks.
   * function doubleClicked() {
   *   // Delete the framebuffer from GPU memory.
   *   myBuffer.remove();
   *
   *   // Delete the framebuffer from CPU memory.
   *   myBuffer = undefined;
   * }
   * </code>
   * </div>
   */
  remove() {
    const gl = this.gl;
    this._deleteTexture(this.color);
    if (this.depth) this._deleteTexture(this.depth);
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
    this.renderer.framebuffers.delete(this);
  }

  /**
   * Begins drawing shapes to the framebuffer.
   *
   * `myBuffer.begin()` and <a href="#/p5.Framebuffer/end">myBuffer.end()</a>
   * allow shapes to be drawn to the framebuffer. `myBuffer.begin()` begins
   * drawing to the framebuffer and
   * <a href="#/p5.Framebuffer/end">myBuffer.end()</a> stops drawing to the
   * framebuffer. Changes won't be visible until the framebuffer is displayed
   * as an image or texture.
   *
   * @example
   * <div>
   * <code>
   * let myBuffer;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   describe('An empty gray canvas. The canvas gets darker and a rotating, multicolor torus appears while the user presses and holds the mouse.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Start drawing to the p5.Framebuffer object.
   *   myBuffer.begin();
   *
   *   background(50);
   *   rotateY(frameCount * 0.01);
   *   normalMaterial();
   *   torus(30);
   *
   *   // Stop drawing to the p5.Framebuffer object.
   *   myBuffer.end();
   *
   *   // Display the p5.Framebuffer object while
   *   // the user presses the mouse.
   *   if (mouseIsPressed === true) {
   *     image(myBuffer, -50, -50);
   *   }
   * }
   * </code>
   * </div>
   */
  begin() {
    this.prevFramebuffer = this.renderer.activeFramebuffer();
    if (this.prevFramebuffer) {
      this.prevFramebuffer._beforeEnd();
    }
    this.renderer.activeFramebuffers.push(this);
    this._beforeBegin();
    this.renderer.push();
    // Apply the framebuffer's camera. This does almost what
    // RendererGL.reset() does, but this does not try to clear any buffers;
    // it only sets the camera.
    // this.renderer.setCamera(this.defaultCamera);
    this.renderer.states.setValue('curCamera', this.defaultCamera);
    // set the projection matrix (which is not normally updated each frame)
    this.renderer.states.setValue('uPMatrix', this.renderer.states.uPMatrix.clone());
    this.renderer.states.uPMatrix.set(this.defaultCamera.projMatrix);
    this.renderer.states.setValue('uViewMatrix', this.renderer.states.uViewMatrix.clone());
    this.renderer.states.uViewMatrix.set(this.defaultCamera.cameraMatrix);

    this.renderer.resetMatrix();
    this.renderer.states.uViewMatrix
      .set(this.renderer.states.curCamera.cameraMatrix);
    this.renderer.states.uModelMatrix.reset();
    this.renderer._applyStencilTestIfClipping();
  }

  /**
   * When making a p5.Framebuffer active so that it may be drawn to, this method
   * returns the underlying WebGL framebuffer that needs to be active to
   * support this. Antialiased framebuffers first write to a multisampled
   * renderbuffer, while other framebuffers can write directly to their main
   * framebuffers.
   *
   * @private
   */
  _framebufferToBind() {
    if (this.antialias) {
      // If antialiasing, draw to an antialiased renderbuffer rather
      // than directly to the texture. In end() we will copy from the
      // renderbuffer to the texture.
      return this.aaFramebuffer;
    } else {
      return this.framebuffer;
    }
  }

  /**
   * Ensures that the framebuffer is ready to be drawn to
   *
   * @private
   */
  _beforeBegin() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebufferToBind());
    this.renderer.viewport(
      this.width * this.density,
      this.height * this.density
    );
  }

  /**
   * Ensures that the framebuffer is ready to be read by other framebuffers.
   *
   * @private
   */
  _beforeEnd() {
    if (this.antialias) {
      const gl = this.gl;
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.aaFramebuffer);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer);
      const partsToCopy = [
        [gl.COLOR_BUFFER_BIT, this.colorP5Texture.glMagFilter]
      ];
      if (this.useDepth) {
        partsToCopy.push(
          [gl.DEPTH_BUFFER_BIT, this.depthP5Texture.glMagFilter]
        );
      }
      for (const [flag, filter] of partsToCopy) {
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
  }

  /**
   * Stops drawing shapes to the framebuffer.
   *
   * <a href="#/p5.Framebuffer/begin">myBuffer.begin()</a> and `myBuffer.end()`
   * allow shapes to be drawn to the framebuffer.
   * <a href="#/p5.Framebuffer/begin">myBuffer.begin()</a> begins drawing to
   * the framebuffer and `myBuffer.end()` stops drawing to the framebuffer.
   * Changes won't be visible until the framebuffer is displayed as an image
   * or texture.
   *
   * @example
   * <div>
   * <code>
   * let myBuffer;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   describe('An empty gray canvas. The canvas gets darker and a rotating, multicolor torus appears while the user presses and holds the mouse.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Start drawing to the p5.Framebuffer object.
   *   myBuffer.begin();
   *
   *   background(50);
   *   rotateY(frameCount * 0.01);
   *   normalMaterial();
   *   torus(30);
   *
   *   // Stop drawing to the p5.Framebuffer object.
   *   myBuffer.end();
   *
   *   // Display the p5.Framebuffer object while
   *   // the user presses the mouse.
   *   if (mouseIsPressed === true) {
   *     image(myBuffer, -50, -50);
   *   }
   * }
   * </code>
   * </div>
   */
  end() {
    const gl = this.gl;
    this.renderer.pop();
    const fbo = this.renderer.activeFramebuffers.pop();
    if (fbo !== this) {
      throw new Error("It looks like you've called end() while another Framebuffer is active.");
    }
    this._beforeEnd();
    if (this.prevFramebuffer) {
      this.prevFramebuffer._beforeBegin();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this.renderer.viewport(
        this.renderer._origViewport.width,
        this.renderer._origViewport.height
      );
    }
    this.renderer._applyStencilTestIfClipping();
  }

  /**
   * Draws to the framebuffer by calling a function that contains drawing
   * instructions.
   *
   * The parameter, `callback`, is a function with the drawing instructions
   * for the framebuffer. For example, calling `myBuffer.draw(myFunction)`
   * will call a function named `myFunction()` to draw to the framebuffer.
   * Doing so has the same effect as the following:
   *
   * ```js
   * myBuffer.begin();
   * myFunction();
   * myBuffer.end();
   * ```
   *
   * @param {Function} callback function that draws to the framebuffer.
   *
   * @example
   * <div>
   * <code>
   * // Click the canvas to display the framebuffer.
   *
   * let myBuffer;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   describe('An empty gray canvas. The canvas gets darker and a rotating, multicolor torus appears while the user presses and holds the mouse.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw to the p5.Framebuffer object.
   *   myBuffer.draw(bagel);
   *
   *   // Display the p5.Framebuffer object while
   *   // the user presses the mouse.
   *   if (mouseIsPressed === true) {
   *     image(myBuffer, -50, -50);
   *   }
   * }
   *
   * // Draw a rotating, multicolor torus.
   * function bagel() {
   *   background(50);
   *   rotateY(frameCount * 0.01);
   *   normalMaterial();
   *   torus(30);
   * }
   * </code>
   * </div>
   */
  draw(callback) {
    this.begin();
    callback();
    this.end();
  }

  /**
   * Loads the current value of each pixel in the framebuffer into its
   * <a href="#/p5.Framebuffer/pixels">pixels</a> array.
   *
   * `myBuffer.loadPixels()` must be called before reading from or writing to
   * <a href="#/p5.Framebuffer/pixels">myBuffer.pixels</a>.
   *
   * @method loadPixels
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Framebuffer object.
   *   let myBuffer = createFramebuffer();
   *
   *   // Load the pixels array.
   *   myBuffer.loadPixels();
   *
   *   // Get the number of pixels in the
   *   // top half of the framebuffer.
   *   let numPixels = myBuffer.pixels.length / 2;
   *
   *   // Set the framebuffer's top half to pink.
   *   for (let i = 0; i < numPixels; i += 4) {
   *     myBuffer.pixels[i] = 255;
   *     myBuffer.pixels[i + 1] = 102;
   *     myBuffer.pixels[i + 2] = 204;
   *     myBuffer.pixels[i + 3] = 255;
   *   }
   *
   *   // Update the pixels array.
   *   myBuffer.updatePixels();
   *
   *   // Draw the p5.Framebuffer object to the canvas.
   *   image(myBuffer, -50, -50);
   *
   *   describe('A pink rectangle above a gray rectangle.');
   * }
   * </code>
   * </div>
   */
  loadPixels() {
    const gl = this.gl;
    const prevFramebuffer = this.renderer.activeFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    const colorFormat = this._glColorFormat();
    this.pixels = readPixelsWebGL(
      this.pixels,
      gl,
      this.framebuffer,
      0,
      0,
      this.width * this.density,
      this.height * this.density,
      colorFormat.format,
      colorFormat.type
    );
    if (prevFramebuffer) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer._framebufferToBind());
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }

  /**
   * Gets a pixel or a region of pixels from the framebuffer.
   *
   * `myBuffer.get()` is easy to use but it's not as fast as
   * <a href="#/p5.Framebuffer/pixels">myBuffer.pixels</a>. Use
   * <a href="#/p5.Framebuffer/pixels">myBuffer.pixels</a> to read many pixel
   * values.
   *
   * The version of `myBuffer.get()` with no parameters returns the entire
   * framebuffer as a a <a href="#/p5.Image">p5.Image</a> object.
   *
   * The version of `myBuffer.get()` with two parameters interprets them as
   * coordinates. It returns an array with the `[R, G, B, A]` values of the
   * pixel at the given point.
   *
   * The version of `myBuffer.get()` with four parameters interprets them as
   * coordinates and dimensions. It returns a subsection of the framebuffer as
   * a <a href="#/p5.Image">p5.Image</a> object. The first two parameters are
   * the coordinates for the upper-left corner of the subsection. The last two
   * parameters are the width and height of the subsection.
   *
   * @param  {Number} x x-coordinate of the pixel. Defaults to 0.
   * @param  {Number} y y-coordinate of the pixel. Defaults to 0.
   * @param  {Number} w width of the subsection to be returned.
   * @param  {Number} h height of the subsection to be returned.
   * @return {p5.Image} subsection as a <a href="#/p5.Image">p5.Image</a> object.
   */
  /**
   * @return {p5.Image} entire framebuffer as a <a href="#/p5.Image">p5.Image</a> object.
   */
  /**
   * @param  {Number} x
   * @param  {Number} y
   * @return {Number[]}  color of the pixel at `(x, y)` as an array of color values `[R, G, B, A]`.
   */
  get(x, y, w, h) {
    // p5._validateParameters('p5.Framebuffer.get', arguments);
    const colorFormat = this._glColorFormat();
    if (x === undefined && y === undefined) {
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    } else if (w === undefined && h === undefined) {
      if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
        console.warn(
          'The x and y values passed to p5.Framebuffer.get are outside of its range and will be clamped.'
        );
        x = constrain(x, 0, this.width - 1);
        y = constrain(y, 0, this.height - 1);
      }

      return readPixelWebGL(
        this.gl,
        this.framebuffer,
        x * this.density,
        y * this.density,
        colorFormat.format,
        colorFormat.type
      );
    }

    x = constrain(x, 0, this.width - 1);
    y = constrain(y, 0, this.height - 1);
    w = constrain(w, 1, this.width - x);
    h = constrain(h, 1, this.height - y);

    const rawData = readPixelsWebGL(
      undefined,
      this.gl,
      this.framebuffer,
      x * this.density,
      y * this.density,
      w * this.density,
      h * this.density,
      colorFormat.format,
      colorFormat.type
    );
    // Framebuffer data might be either a Uint8Array or Float32Array
    // depending on its format, and it may or may not have an alpha channel.
    // To turn it into an image, we have to normalize the data into a
    // Uint8ClampedArray with alpha.
    const fullData = new Uint8ClampedArray(
      w * h * this.density * this.density * 4
    );

    // Default channels that aren't in the framebuffer (e.g. alpha, if the
    // framebuffer is in RGB mode instead of RGBA) to 255
    fullData.fill(255);

    const channels = colorFormat.type === this.gl.RGB ? 3 : 4;
    for (let y = 0; y < h * this.density; y++) {
      for (let x = 0; x < w * this.density; x++) {
        for (let channel = 0; channel < 4; channel++) {
          const idx = (y * w * this.density + x) * 4 + channel;
          if (channel < channels) {
            // Find the index of this pixel in `rawData`, which might have a
            // different number of channels
            const rawDataIdx = channels === 4
              ? idx
              : (y * w * this.density + x) * channels + channel;
            fullData[idx] = rawData[rawDataIdx];
          }
        }
      }
    }

    // Create an image from the data
    const region = new Image(w * this.density, h * this.density);
    region.imageData = region.canvas.getContext('2d').createImageData(
      region.width,
      region.height
    );
    region.imageData.data.set(fullData);
    region.pixels = region.imageData.data;
    region.updatePixels();
    if (this.density !== 1) {
      // TODO: support get() at a pixel density > 1
      region.resize(w, h);
    }
    return region;
  }

  /**
   * Updates the framebuffer with the RGBA values in the
   * <a href="#/p5.Framebuffer/pixels">pixels</a> array.
   *
   * `myBuffer.updatePixels()` only needs to be called after changing values
   * in the <a href="#/p5.Framebuffer/pixels">myBuffer.pixels</a> array. Such
   * changes can be made directly after calling
   * <a href="#/p5.Framebuffer/loadPixels">myBuffer.loadPixels()</a>.
   *
   * @method updatePixels
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Framebuffer object.
   *   let myBuffer = createFramebuffer();
   *
   *   // Load the pixels array.
   *   myBuffer.loadPixels();
   *
   *   // Get the number of pixels in the
   *   // top half of the framebuffer.
   *   let numPixels = myBuffer.pixels.length / 2;
   *
   *   // Set the framebuffer's top half to pink.
   *   for (let i = 0; i < numPixels; i += 4) {
   *     myBuffer.pixels[i] = 255;
   *     myBuffer.pixels[i + 1] = 102;
   *     myBuffer.pixels[i + 2] = 204;
   *     myBuffer.pixels[i + 3] = 255;
   *   }
   *
   *   // Update the pixels array.
   *   myBuffer.updatePixels();
   *
   *   // Draw the p5.Framebuffer object to the canvas.
   *   image(myBuffer, -50, -50);
   *
   *   describe('A pink rectangle above a gray rectangle.');
   * }
   * </code>
   * </div>
   */
  updatePixels() {
    const gl = this.gl;
    this.colorP5Texture.bindTexture();
    const colorFormat = this._glColorFormat();

    const channels = colorFormat.format === gl.RGBA ? 4 : 3;
    const len =
      this.width * this.height * this.density * this.density * channels;
    const TypedArrayClass = colorFormat.type === gl.UNSIGNED_BYTE
      ? Uint8Array
      : Float32Array;
    if (
      !(this.pixels instanceof TypedArrayClass) || this.pixels.length !== len
    ) {
      throw new Error(
        'The pixels array has not been set correctly. Please call loadPixels() before updatePixels().'
      );
    }

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      colorFormat.internalFormat,
      this.width * this.density,
      this.height * this.density,
      0,
      colorFormat.format,
      colorFormat.type,
      this.pixels
    );
    this.colorP5Texture.unbindTexture();

    const prevFramebuffer = this.renderer.activeFramebuffer();
    if (this.antialias) {
      // We need to make sure the antialiased framebuffer also has the updated
      // pixels so that if more is drawn to it, it goes on top of the updated
      // pixels instead of replacing them.
      // We can't blit the framebuffer to the multisampled antialias
      // framebuffer to leave both in the same state, so instead we have
      // to use image() to put the framebuffer texture onto the antialiased
      // framebuffer.
      this.begin();
      this.renderer.push();
      // this.renderer.imageMode(constants.CENTER);
      this.renderer.states.setValue('imageMode', constants.CORNER);
      this.renderer.setCamera(this.filterCamera);
      this.renderer.resetMatrix();
      this.renderer.states.setValue('strokeColor', null);
      this.renderer.clear();
      this.renderer._drawingFilter = true;
      this.renderer.image(
        this,
        0, 0,
        this.width, this.height,
        -this.renderer.width / 2, -this.renderer.height / 2,
        this.renderer.width, this.renderer.height
      );
      this.renderer._drawingFilter = false;
      this.renderer.pop();
      if (this.useDepth) {
        gl.clearDepth(1);
        gl.clear(gl.DEPTH_BUFFER_BIT);
      }
      this.end();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      if (this.useDepth) {
        gl.clearDepth(1);
        gl.clear(gl.DEPTH_BUFFER_BIT);
      }
      if (prevFramebuffer) {
        gl.bindFramebuffer(
          gl.FRAMEBUFFER,
          prevFramebuffer._framebufferToBind()
        );
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
    }
  }
}

function framebuffer(p5, fn){
  /**
   * A <a href="#/p5.Camera">p5.Camera</a> attached to a
   * <a href="#/p5.Framebuffer">p5.Framebuffer</a>.
   *
   * @class p5.FramebufferCamera
   * @param {p5.Framebuffer} framebuffer The framebuffer this camera is
   * attached to
   * @private
   */
  p5.FramebufferCamera = FramebufferCamera;

  /**
   * A <a href="#/p5.Texture">p5.Texture</a> corresponding to a property of a
   * <a href="#/p5.Framebuffer">p5.Framebuffer</a>.
   *
   * @class p5.FramebufferTexture
   * @param {p5.Framebuffer} framebuffer The framebuffer represented by this
   * texture
   * @param {String} property The property of the framebuffer represented by
   * this texture, either `color` or `depth`
   * @private
   */
  p5.FramebufferTexture = FramebufferTexture;

  /**
   * A class to describe a high-performance drawing surface for textures.
   *
   * Each `p5.Framebuffer` object provides a dedicated drawing surface called
   * a *framebuffer*. They're similar to
   * <a href="#/p5.Graphics">p5.Graphics</a> objects but can run much faster.
   * Performance is improved because the framebuffer shares the same WebGL
   * context as the canvas used to create it.
   *
   * `p5.Framebuffer` objects have all the drawing features of the main
   * canvas. Drawing instructions meant for the framebuffer must be placed
   * between calls to
   * <a href="#/p5.Framebuffer/begin">myBuffer.begin()</a> and
   * <a href="#/p5.Framebuffer/end">myBuffer.end()</a>. The resulting image
   * can be applied as a texture by passing the `p5.Framebuffer` object to the
   * <a href="#/p5/texture">texture()</a> function, as in `texture(myBuffer)`.
   * It can also be displayed on the main canvas by passing it to the
   * <a href="#/p5/image">image()</a> function, as in `image(myBuffer, 0, 0)`.
   *
   * Note: <a href="#/p5/createFramebuffer">createFramebuffer()</a> is the
   * recommended way to create an instance of this class.
   *
   * @class p5.Framebuffer
   * @param {p5.Graphics|p5} target sketch instance or
   *                                <a href="#/p5.Graphics">p5.Graphics</a>
   *                                object.
   * @param {Object} [settings] configuration options.
   */
  p5.Framebuffer = Framebuffer;

  /**
   * An object that stores the framebuffer's color data.
   *
   * Each framebuffer uses a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture" target="_blank">WebGLTexture</a>
   * object internally to store its color data. The `myBuffer.color` property
   * makes it possible to pass this data directly to other functions. For
   * example, calling `texture(myBuffer.color)` or
   * `myShader.setUniform('colorTexture', myBuffer.color)`  may be helpful for
   * advanced use cases.
   *
   * Note: By default, a framebuffer's y-coordinates are flipped compared to
   * images and videos. It's easy to flip a framebuffer's y-coordinates as
   * needed when applying it as a texture. For example, calling
   * `plane(myBuffer.width, -myBuffer.height)` will flip the framebuffer.
   *
   * @property {p5.FramebufferTexture} color
   * @for p5.Framebuffer
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Framebuffer object.
   *   let myBuffer = createFramebuffer();
   *
   *   // Start drawing to the p5.Framebuffer object.
   *   myBuffer.begin();
   *
   *   triangle(-25, 25, 0, -25, 25, 25);
   *
   *   // Stop drawing to the p5.Framebuffer object.
   *   myBuffer.end();
   *
   *   // Use the p5.Framebuffer object's WebGLTexture.
   *   texture(myBuffer.color);
   *
   *   // Style the plane.
   *   noStroke();
   *
   *   // Draw the plane.
   *   plane(myBuffer.width, myBuffer.height);
   *
   *   describe('A white triangle on a gray background.');
   * }
   * </code>
   * </div>
   */

  /**
   * An object that stores the framebuffer's depth data.
   *
   * Each framebuffer uses a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture" target="_blank">WebGLTexture</a>
   * object internally to store its depth data. The `myBuffer.depth` property
   * makes it possible to pass this data directly to other functions. For
   * example, calling `texture(myBuffer.depth)` or
   * `myShader.setUniform('depthTexture', myBuffer.depth)`  may be helpful for
   * advanced use cases.
   *
   * Note: By default, a framebuffer's y-coordinates are flipped compared to
   * images and videos. It's easy to flip a framebuffer's y-coordinates as
   * needed when applying it as a texture. For example, calling
   * `plane(myBuffer.width, -myBuffer.height)` will flip the framebuffer.
   *
   * @property {p5.FramebufferTexture} depth
   * @for p5.Framebuffer
   *
   * @example
   * <div>
   * <code>
   * // Note: A "uniform" is a global variable within a shader program.
   *
   * // Create a string with the vertex shader program.
   * // The vertex shader is called for each vertex.
   * let vertSrc = `
   * precision highp float;
   * attribute vec3 aPosition;
   * attribute vec2 aTexCoord;
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
   *   gl_Position = uProjectionMatrix * viewModelPosition;
   *   vTexCoord = aTexCoord;
   * }
   * `;
   *
   * // Create a string with the fragment shader program.
   * // The fragment shader is called for each pixel.
   * let fragSrc = `
   * precision highp float;
   * varying vec2 vTexCoord;
   * uniform sampler2D depth;
   *
   * void main() {
   *   // Get the pixel's depth value.
   *   float depthVal = texture2D(depth, vTexCoord).r;
   *
   *   // Set the pixel's color based on its depth.
   *   gl_FragColor = mix(
   *     vec4(0., 0., 0., 1.),
   *     vec4(1., 0., 1., 1.),
   *     depthVal);
   * }
   * `;
   *
   * let myBuffer;
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Framebuffer object.
   *   myBuffer = createFramebuffer();
   *
   *   // Create a p5.Shader object.
   *   myShader = createShader(vertSrc, fragSrc);
   *
   *   // Compile and apply the shader.
   *   shader(myShader);
   *
   *   describe('The shadow of a box rotates slowly against a magenta background.');
   * }
   *
   * function draw() {
   *   // Draw to the p5.Framebuffer object.
   *   myBuffer.begin();
   *   background(255);
   *   rotateX(frameCount * 0.01);
   *   box(20, 20, 80);
   *   myBuffer.end();
   *
   *   // Set the shader's depth uniform using
   *   // the framebuffer's depth texture.
   *   myShader.setUniform('depth', myBuffer.depth);
   *
   *   // Style the plane.
   *   noStroke();
   *
   *   // Draw the plane.
   *   plane(myBuffer.width, myBuffer.height);
   * }
   * </code>
   * </div>
   */

  /**
   * An array containing the color of each pixel in the framebuffer.
   *
   * <a href="#/p5.Framebuffer/loadPixels">myBuffer.loadPixels()</a> must be
   * called before accessing the `myBuffer.pixels` array.
   * <a href="#/p5.Framebuffer/updatePixels">myBuffer.updatePixels()</a>
   * must be called after any changes are made.
   *
   * Note: Updating pixels via this property is slower than drawing to the
   * framebuffer directly. Consider using a
   * <a href="#/p5.Shader">p5.Shader</a> object instead of looping over
   * `myBuffer.pixels`.
   *
   * @property {Number[]} pixels
   * @for p5.Framebuffer
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Framebuffer object.
   *   let myBuffer = createFramebuffer();
   *
   *   // Load the pixels array.
   *   myBuffer.loadPixels();
   *
   *   // Get the number of pixels in the
   *   // top half of the framebuffer.
   *   let numPixels = myBuffer.pixels.length / 2;
   *
   *   // Set the framebuffer's top half to pink.
   *   for (let i = 0; i < numPixels; i += 4) {
   *     myBuffer.pixels[i] = 255;
   *     myBuffer.pixels[i + 1] = 102;
   *     myBuffer.pixels[i + 2] = 204;
   *     myBuffer.pixels[i + 3] = 255;
   *   }
   *
   *   // Update the pixels array.
   *   myBuffer.updatePixels();
   *
   *   // Draw the p5.Framebuffer object to the canvas.
   *   image(myBuffer, -50, -50);
   *
   *   describe('A pink rectangle above a gray rectangle.');
   * }
   * </code>
   * </div>
   */
}

export default framebuffer;
export { FramebufferTexture, FramebufferCamera, Framebuffer };

if(typeof p5 !== 'undefined'){
  framebuffer(p5, p5.prototype);
}
