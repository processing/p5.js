/**
 * @module Rendering
 */

import * as constants from '../core/constants';
import { RGB, RGBA } from '../color/creating_reading';
import { checkWebGLCapabilities } from './utils';
import { Camera } from './p5.Camera';
import { Texture } from './p5.Texture';

const constrain = (n, low, high) => Math.max(Math.min(n, high), low);

class FramebufferCamera extends Camera {
  constructor(framebuffer) {
    super(framebuffer.renderer);
    this.fbo = framebuffer;

    this.yScale = framebuffer.renderer.framebufferYScale();
  }

  _computeCameraDefaultSettings() {
    super._computeCameraDefaultSettings();
    this.defaultAspectRatio = this.fbo.width / this.fbo.height;
    this.defaultCameraFOV =
      2 * Math.atan(this.fbo.height / 2 / this.defaultEyeZ);
  }

  copy() {
    const _cam = super.copy();
    _cam.fbo = this.fbo;
    return _cam;
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

  update() {
    this.framebuffer._update(this.property);
  }

  rawTexture() {
    return { texture: this.framebuffer[this.property] };
  }
}

class Framebuffer {
  constructor(renderer, settings = {}) {
    this.renderer = renderer;
    this.renderer.framebuffers.add(this);

    this._isClipApplied = false;
    this._useCanvasFormat = settings._useCanvasFormat || false;

    this.dirty = { colorTexture: false, depthTexture: false };

    this.pixels = [];

    this.format = settings.format || constants.UNSIGNED_BYTE;
    this.channels = settings.channels || (
      this.renderer.defaultFramebufferAlpha()
        ? RGBA
        : RGB
    );
    this.useDepth = settings.depth === undefined ? true : settings.depth;
    this.depthFormat = settings.depthFormat || constants.FLOAT;
    this.textureFiltering = settings.textureFiltering || constants.LINEAR;
    if (settings.antialias === undefined) {
      this.antialiasSamples = this.renderer.defaultFramebufferAntialias()
        ? 2
        : 0;
    } else if (typeof settings.antialias === 'number') {
      this.antialiasSamples = settings.antialias;
    } else {
      this.antialiasSamples = settings.antialias ? 2 : 0;
    }
    this.antialias = this.antialiasSamples > 0;
    if (this.antialias && !this.renderer.supportsFramebufferAntialias()) {
      console.warn('Framebuffer antialiasing is unsupported in this context');
      this.antialias = false;
    }
    this.density = settings.density || this.renderer._pixelDensity;
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
    // Let renderer validate and adjust formats for this context
    this.renderer.validateFramebufferFormats(this);

    if (settings.stencil && !this.useDepth) {
      console.warn('A stencil buffer can only be used if also using depth. Since the framebuffer has no depth buffer, the stencil buffer will be ignored.');
    }
    this.useStencil = this.useDepth &&
      (settings.stencil === undefined ? true : settings.stencil);

    // Let renderer create framebuffer resources with antialiasing support
    this.renderer.createFramebufferResources(this);

    this._recreateTextures();

    this.defaultCamera = this.createCamera();
    this.filterCamera = this.createCamera();

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
   *
   * @example
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

  _deleteTextures() {
    this.renderer.deleteFramebufferTextures(this);
  }

  /**
   * Creates new textures and renderbuffers given the current size of the
   * framebuffer.
   *
   * @private
   */
  _recreateTextures() {
    this._updateSize();

    // Let renderer handle texture creation and framebuffer setup
    this.renderer.recreateFramebufferTextures(this);

    if (this.useDepth) {
      this.depth = new FramebufferTexture(this, 'depthTexture');
      const depthFilter = constants.NEAREST;
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
      ? constants.LINEAR
      : constants.NEAREST;
    this.colorP5Texture = new Texture(
      this.renderer,
      this.color,
      {
        minFilter: filter,
        magFilter: filter
      }
    );
    this.renderer.textures.set(this.color, this.colorP5Texture);
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
    this._deleteTextures();
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
   */
  createCamera() {
    const cam = new FramebufferCamera(this);
    cam._computeCameraDefaultSettings();
    cam._setDefaultCamera();
    return cam;
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
   */
  remove() {
    this._deleteTextures();

    // Let renderer clean up framebuffer resources
    this.renderer.deleteFramebufferResources(this);

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
    return this.renderer.getFramebufferToBind(this);
  }

  /**
   * Ensure all readable textures are up-to-date.
   * @private
   * @param {'colorTexutre'|'depthTexture'} property The property to update
   */
  _update(property) {
    if (this.dirty[property]) {
      this.renderer.updateFramebufferTexture(this, property);
      this.dirty[property] = false;
    }
  }

  /**
   * Ensures that the framebuffer is ready to be drawn to
   *
   * @private
   */
  _beforeBegin() {
    this.renderer.bindFramebuffer(this);
    this.renderer.viewport(
      this.width * this.density,
      this.height * this.density
    );
    if (this.renderer.flushDraw) {
      this.renderer.flushDraw();
    }
  }

  /**
   * Ensures that the framebuffer is ready to be read by other framebuffers.
   *
   * @private
   */
  _beforeEnd() {
    if (this.antialias) {
      this.dirty = { colorTexture: true, depthTexture: true };
    }
    // TODO
    // This should work but flushes more often than we need to. Ideally we only do this
    // right before the fbo is read as a texture.
    if (this.renderer.flushDraw) {
      this.renderer.flushDraw();
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
   */
  end() {
    this.renderer.pop();

    const fbo = this.renderer.activeFramebuffers.pop();
    if (fbo !== this) {
      throw new Error("It looks like you've called end() while another Framebuffer is active.");
    }
    this._beforeEnd();
    if (this.prevFramebuffer) {
      this.prevFramebuffer._beforeBegin();
    } else {
      this.renderer.bindFramebuffer(null);
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
   * @example
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
   */
  loadPixels() {
    this._update('colorTexture');
    const result = this.renderer.readFramebufferPixels(this);

    // Check if renderer returned a Promise (WebGPU) or data directly (WebGL)
    if (result && typeof result.then === 'function') {
      // WebGPU async case - return Promise
      return result.then(pixels => {
        this.pixels = pixels;
        return pixels;
      });
    } else {
      // WebGL sync case - assign directly
      this.pixels = result;
      return result;
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
    this._update('colorTexture');
    // p5._validateParameters('p5.Framebuffer.get', arguments);

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

      return this.renderer.readFramebufferPixel(this, x * this.density, y * this.density);
    }

    x = constrain(x, 0, this.width - 1);
    y = constrain(y, 0, this.height - 1);
    w = constrain(w, 1, this.width - x);
    h = constrain(h, 1, this.height - y);

    return this.renderer.readFramebufferRegion(this, x, y, w, h);
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
   */
  updatePixels() {
    // Let renderer handle the pixel update process
    this.renderer.updateFramebufferPixels(this);
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
   */

  /**
   * The current width of the framebuffer.
   *
   * @property {Number} width
   * @for p5.Framebuffer
   */

  /**
   * The current width of the framebuffer.
   *
   * @property {Number} height
   * @for p5.Framebuffer
   */
}

export default framebuffer;
export { FramebufferTexture, FramebufferCamera, Framebuffer };

if(typeof p5 !== 'undefined'){
  framebuffer(p5, p5.prototype);
}
