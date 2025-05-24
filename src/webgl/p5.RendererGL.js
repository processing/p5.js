import * as constants from "../core/constants";
import { readPixelsWebGL, readPixelWebGL } from './utils';
import { Renderer3D, getStrokeDefs } from "../core/p5.Renderer3D";
import { Shader } from "./p5.Shader";
import { Image } from "../image/p5.Image";
import { Texture, MipmapTexture } from "./p5.Texture";
import { Framebuffer } from "./p5.Framebuffer";
import { Graphics } from "../core/p5.Graphics";
import { Element } from "../dom/p5.Element";

import filterBaseVert from "./shaders/filters/base.vert";
import lightingShader from "./shaders/lighting.glsl";
import webgl2CompatibilityShader from "./shaders/webgl2Compatibility.glsl";
import normalVert from "./shaders/normal.vert";
import normalFrag from "./shaders/normal.frag";
import basicFrag from "./shaders/basic.frag";
import sphereMappingFrag from "./shaders/sphereMapping.frag";
import lightVert from "./shaders/light.vert";
import lightTextureFrag from "./shaders/light_texture.frag";
import phongVert from "./shaders/phong.vert";
import phongFrag from "./shaders/phong.frag";
import fontVert from "./shaders/font.vert";
import fontFrag from "./shaders/font.frag";
import lineVert from "./shaders/line.vert";
import lineFrag from "./shaders/line.frag";
import pointVert from "./shaders/point.vert";
import pointFrag from "./shaders/point.frag";
import imageLightVert from "./shaders/imageLight.vert";
import imageLightDiffusedFrag from "./shaders/imageLightDiffused.frag";
import imageLightSpecularFrag from "./shaders/imageLightSpecular.frag";

import filterBaseFrag from "./shaders/filters/base.frag";
import filterGrayFrag from "./shaders/filters/gray.frag";
import filterErodeFrag from "./shaders/filters/erode.frag";
import filterDilateFrag from "./shaders/filters/dilate.frag";
import filterBlurFrag from "./shaders/filters/blur.frag";
import filterPosterizeFrag from "./shaders/filters/posterize.frag";
import filterOpaqueFrag from "./shaders/filters/opaque.frag";
import filterInvertFrag from "./shaders/filters/invert.frag";
import filterThresholdFrag from "./shaders/filters/threshold.frag";
import filterShaderVert from "./shaders/filters/default.vert";

const { lineDefs } = getStrokeDefs();

const defaultShaders = {
  normalVert,
  normalFrag,
  basicFrag,
  sphereMappingFrag,
  lightVert: lightingShader + lightVert,
  lightTextureFrag,
  phongVert,
  phongFrag: lightingShader + phongFrag,
  fontVert,
  fontFrag,
  lineVert: lineDefs + lineVert,
  lineFrag: lineDefs + lineFrag,
  pointVert,
  pointFrag,
  imageLightVert,
  imageLightDiffusedFrag,
  imageLightSpecularFrag,
  filterBaseVert,
  filterBaseFrag,
};
let sphereMapping = defaultShaders.sphereMappingFrag;
for (const key in defaultShaders) {
  defaultShaders[key] = webgl2CompatibilityShader + defaultShaders[key];
}

const filterShaderFrags = {
  [constants.GRAY]: filterGrayFrag,
  [constants.ERODE]: filterErodeFrag,
  [constants.DILATE]: filterDilateFrag,
  [constants.BLUR]: filterBlurFrag,
  [constants.POSTERIZE]: filterPosterizeFrag,
  [constants.OPAQUE]: filterOpaqueFrag,
  [constants.INVERT]: filterInvertFrag,
  [constants.THRESHOLD]: filterThresholdFrag,
};

/**
 * 3D graphics class
 * @private
 * @class p5.RendererGL
 * @extends p5.Renderer
 * @todo extend class to include public method for offscreen
 * rendering (FBO).
 */
class RendererGL extends Renderer3D {
  constructor(pInst, w, h, isMainCanvas, elt) {
    super(pInst, w, h, isMainCanvas, elt);

    if (this.webglVersion === constants.WEBGL2) {
      this.blendExt = this.GL;
    } else {
      this.blendExt = this.GL.getExtension("EXT_blend_minmax");
    }

    this._userEnabledStencil = false;
    // Store original methods for internal use
    this._internalEnable = this.drawingContext.enable;
    this._internalDisable = this.drawingContext.disable;

    // Override WebGL enable function
    this.drawingContext.enable = (key) => {
      if (key === this.drawingContext.STENCIL_TEST) {
        if (!this._clipping) {
          this._userEnabledStencil = true;
        }
      }
      return this._internalEnable.call(this.drawingContext, key);
    };

    // Override WebGL disable function
    this.drawingContext.disable = (key) => {
      if (key === this.drawingContext.STENCIL_TEST) {
          this._userEnabledStencil = false;
      }
      return this._internalDisable.call(this.drawingContext, key);
    };

    this._cachedBlendMode = undefined;
  }

  setupContext() {
    this._setAttributeDefaults(this._pInst);
    this._initContext();
    // This redundant property is useful in reminding you that you are
    // interacting with WebGLRenderingContext, still worth considering future removal
    this.GL = this.drawingContext;
  }

  //////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////

  /*_drawPoints(vertices, vertexBuffer) {
    const gl = this.GL;
    const pointShader = this._getPointShader();
    pointShader.bindShader();
    this._setGlobalUniforms(pointShader);
    this._setPointUniforms(pointShader);
    pointShader.bindTextures();

    this._bindBuffer(
      vertexBuffer,
      gl.ARRAY_BUFFER,
      this._vToNArray(vertices),
      Float32Array,
      gl.STATIC_DRAW
    );

    pointShader.enableAttrib(pointShader.attributes.aPosition, 3);

    this._applyColorBlend(this.states.curStrokeColor);

    gl.drawArrays(gl.Points, 0, vertices.length);

    pointShader.unbindShader();
  }*/

  /**
   * @private sets blending in gl context to curBlendMode
   * @param  {Number[]} color [description]
   * @return {Number[]}  Normalized numbers array
   */
  _applyBlendMode () {
    if (this._cachedBlendMode === this.states.curBlendMode) {
      return;
    }
    const gl = this.GL;
    switch (this.states.curBlendMode) {
      case constants.BLEND:
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        break;
      case constants.ADD:
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE);
        break;
      case constants.REMOVE:
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
        break;
      case constants.MULTIPLY:
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
        break;
      case constants.SCREEN:
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
        break;
      case constants.EXCLUSION:
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        gl.blendFuncSeparate(
          gl.ONE_MINUS_DST_COLOR,
          gl.ONE_MINUS_SRC_COLOR,
          gl.ONE,
          gl.ONE
        );
        break;
      case constants.REPLACE:
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ZERO);
        break;
      case constants.SUBTRACT:
        gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        break;
      case constants.DARKEST:
        if (this.blendExt) {
          gl.blendEquationSeparate(
            this.blendExt.MIN || this.blendExt.MIN_EXT,
            gl.FUNC_ADD
          );
          gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
        } else {
          console.warn(
            'blendMode(DARKEST) does not work in your browser in WEBGL mode.'
          );
        }
        break;
      case constants.LIGHTEST:
        if (this.blendExt) {
          gl.blendEquationSeparate(
            this.blendExt.MAX || this.blendExt.MAX_EXT,
            gl.FUNC_ADD
          );
          gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
        } else {
          console.warn(
            'blendMode(LIGHTEST) does not work in your browser in WEBGL mode.'
          );
        }
        break;
      default:
        console.error(
          'Oops! Somehow Renderer3D set curBlendMode to an unsupported mode.'
        );
        break;
    }
    this._cachedBlendMode = this.states.curBlendMode;
  }

  _shaderOptions() {
    return undefined;
  }

  _useShader(shader) {
    const gl = this.GL;
    gl.useProgram(shader._glProgram);
  }

  _drawBuffers(geometry, { mode = this.GL.TRIANGLES, count }) {
    const gl = this.GL;
    const glBuffers = this.geometryBufferCache.getCached(geometry);

    if (!glBuffers) return;

    if (glBuffers.indexBuffer) {
      this._bindBuffer(glBuffers.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);

      // If this model is using a Uint32Array we need to ensure the
      // OES_element_index_uint WebGL extension is enabled.
      if (
        this._pInst.webglVersion !== constants.WEBGL2 &&
        glBuffers.indexBufferType === gl.UNSIGNED_INT
      ) {
        if (!gl.getExtension("OES_element_index_uint")) {
          throw new Error(
            "Unable to render a 3d model with > 65535 triangles. Your web browser does not support the WebGL Extension OES_element_index_uint."
          );
        }
      }

      if (count === 1) {
        gl.drawElements(
          gl.TRIANGLES,
          geometry.faces.length * 3,
          glBuffers.indexBufferType,
          0
        );
      } else {
        try {
          gl.drawElementsInstanced(
            gl.TRIANGLES,
            geometry.faces.length * 3,
            glBuffers.indexBufferType,
            0,
            count
          );
        } catch (e) {
          console.log(
            "🌸 p5.js says: Instancing is only supported in WebGL2 mode"
          );
        }
      }
    } else {
      if (count === 1) {
        gl.drawArrays(mode, 0, geometry.vertices.length);
      } else {
        try {
          gl.drawArraysInstanced(mode, 0, geometry.vertices.length, count);
        } catch (e) {
          console.log(
            "🌸 p5.js says: Instancing is only supported in WebGL2 mode"
          );
        }
      }
    }
  }

  _getOrMakeCachedBuffers(geometry) {
    return this.geometryBufferCache.ensureCached(geometry);
  }

  //////////////////////////////////////////////
  // Setting
  //////////////////////////////////////////////

  _setAttributeDefaults(pInst) {
    // See issue #3850, safer to enable AA in Safari
    const applyAA = navigator.userAgent.toLowerCase().includes("safari");
    const defaults = {
      alpha: true,
      depth: true,
      stencil: true,
      antialias: applyAA,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      perPixelLighting: true,
      version: 2,
    };
    if (pInst._glAttributes === null) {
      pInst._glAttributes = defaults;
    } else {
      pInst._glAttributes = Object.assign(defaults, pInst._glAttributes);
    }
    return;
  }

  _initContext() {
    if (this._pInst._glAttributes?.version !== 1) {
      // Unless WebGL1 is explicitly asked for, try to create a WebGL2 context
      this.drawingContext = this.canvas.getContext(
        "webgl2",
        this._pInst._glAttributes
      );
    }
    this.webglVersion = this.drawingContext
      ? constants.WEBGL2
      : constants.WEBGL;
    // If this is the main canvas, make sure the global `webglVersion` is set
    this._pInst.webglVersion = this.webglVersion;
    if (!this.drawingContext) {
      // If we were unable to create a WebGL2 context (either because it was
      // disabled via `setAttributes({ version: 1 })` or because the device
      // doesn't support it), fall back to a WebGL1 context
      this.drawingContext =
        this.canvas.getContext("webgl", this._pInst._glAttributes) ||
        this.canvas.getContext("experimental-webgl", this._pInst._glAttributes);
    }
    if (this.drawingContext === null) {
      throw new Error("Error creating webgl context");
    } else {
      const gl = this.drawingContext;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      // Make sure all images are loaded into the canvas premultiplied so that
      // they match the way we render colors. This will make framebuffer textures
      // be encoded the same way as textures from everything else.
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      this._viewport = this.drawingContext.getParameter(
        this.drawingContext.VIEWPORT
      );
    }
  }

  _updateSize() {}

  _getMaxTextureSize() {
    const gl = this.drawingContext;
    return gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }

  _adjustDimensions(width, height) {
    if (!this._maxTextureSize) {
      this._maxTextureSize = this._getMaxTextureSize();
    }
    let maxTextureSize = this._maxTextureSize;

    let maxAllowedPixelDimensions = Math.floor(
      maxTextureSize / this._pixelDensity
    );
    let adjustedWidth = Math.min(width, maxAllowedPixelDimensions);
    let adjustedHeight = Math.min(height, maxAllowedPixelDimensions);

    if (adjustedWidth !== width || adjustedHeight !== height) {
      console.warn(
        "Warning: The requested width/height exceeds hardware limits. " +
          `Adjusting dimensions to width: ${adjustedWidth}, height: ${adjustedHeight}.`
      );
    }

    return { adjustedWidth, adjustedHeight };
  }

  //This is helper function to reset the context anytime the attributes
  //are changed with setAttributes()

  _resetContext(options, callback) {
    const w = this.width;
    const h = this.height;
    const defaultId = this.canvas.id;
    const isPGraphics = this._pInst instanceof Graphics;

    // Preserve existing position and styles before recreation
    const prevStyle = {
      position: this.canvas.style.position,
      top: this.canvas.style.top,
      left: this.canvas.style.left,
    };

    if (isPGraphics) {
      // Handle PGraphics: remove and recreate the canvas
      const pg = this._pInst;
      pg.canvas.parentNode.removeChild(pg.canvas);
      pg.canvas = document.createElement("canvas");
      const node = pg._pInst._userNode || document.body;
      node.appendChild(pg.canvas);
      Element.call(pg, pg.canvas, pg._pInst);
      // Restore previous width and height
      pg.width = w;
      pg.height = h;
    } else {
      // Handle main canvas: remove and recreate it
      let c = this.canvas;
      if (c) {
        c.parentNode.removeChild(c);
      }
      c = document.createElement("canvas");
      c.id = defaultId;
      // Attach the new canvas to the correct parent node
      if (this._pInst._userNode) {
        this._pInst._userNode.appendChild(c);
      } else {
        document.body.appendChild(c);
      }
      this._pInst.canvas = c;
      this.canvas = c;

      // Restore the saved position
      this.canvas.style.position = prevStyle.position;
      this.canvas.style.top = prevStyle.top;
      this.canvas.style.left = prevStyle.left;
    }

    const renderer = new RendererGL(
      this._pInst,
      w,
      h,
      !isPGraphics,
      this._pInst.canvas
    );
    this._pInst._renderer = renderer;

    renderer._applyDefaults();

    if (typeof callback === "function") {
      //setTimeout with 0 forces the task to the back of the queue, this ensures that
      //we finish switching out the renderer
      setTimeout(() => {
        callback.apply(window._renderer, options);
      }, 0);
    }
  }

  _resetBuffersBeforeDraw() {
    this.GL.clearStencil(0);
    this.GL.clear(this.GL.DEPTH_BUFFER_BIT | this.GL.STENCIL_BUFFER_BIT);
    if (!this._userEnabledStencil) {
      this._internalDisable.call(this.GL, this.GL.STENCIL_TEST);
    }
  }

  _applyClip() {
    const gl = this.GL;
    gl.clearStencil(0);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    this._internalEnable.call(gl, gl.STENCIL_TEST);
    this._stencilTestOn = true;
    gl.stencilFunc(
      gl.ALWAYS, // the test
      1, // reference value
      0xff // mask
    );
    gl.stencilOp(
      gl.KEEP, // what to do if the stencil test fails
      gl.KEEP, // what to do if the depth test fails
      gl.REPLACE // what to do if both tests pass
    );
    gl.disable(gl.DEPTH_TEST);
  }

  _unapplyClip() {
    const gl = this.GL;
    gl.stencilOp(
      gl.KEEP, // what to do if the stencil test fails
      gl.KEEP, // what to do if the depth test fails
      gl.KEEP // what to do if both tests pass
    );
    gl.stencilFunc(
      this._clipInvert ? gl.EQUAL : gl.NOTEQUAL, // the test
      0, // reference value
      0xff // mask
    );
    gl.enable(gl.DEPTH_TEST);
  }

  _clearClipBuffer() {
    this.GL.clearStencil(1);
    this.GL.clear(this.GL.STENCIL_BUFFER_BIT);
  }

  // x,y are canvas-relative (pre-scaled by _pixelDensity)
  _getPixel(x, y) {
    const gl = this.GL;
    return readPixelWebGL(
      gl,
      null,
      x,
      y,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this._pInst.height * this._pInst.pixelDensity()
    );
  }

  /**
   * Loads the pixels data for this canvas into the pixels[] attribute.
   * Note that updatePixels() and set() do not work.
   * Any pixel manipulation must be done directly to the pixels[] array.
   *
   * @private
   */
  loadPixels() {
    //@todo_FES
    if (this._pInst._glAttributes.preserveDrawingBuffer !== true) {
      console.log(
        "loadPixels only works in WebGL when preserveDrawingBuffer " +
          "is true."
      );
      return;
    }

    const pd = this._pixelDensity;
    const gl = this.GL;

    this.pixels = readPixelsWebGL(
      this.pixels,
      gl,
      null,
      0,
      0,
      this.width * pd,
      this.height * pd,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.height * pd
    );
  }

  updatePixels() {
    const fbo = this._getTempFramebuffer();
    fbo.pixels = this.pixels;
    fbo.updatePixels();
    this.push();
    this.resetMatrix();
    this.clear();
    this.states.setValue("imageMode", constants.CORNER);
    this.image(
      fbo,
      0,
      0,
      fbo.width,
      fbo.height,
      -fbo.width / 2,
      -fbo.height / 2,
      fbo.width,
      fbo.height
    );
    this.pop();
    this.GL.clearDepth(1);
    this.GL.clear(this.GL.DEPTH_BUFFER_BIT);
  }



  viewport(w, h) {
    this._viewport = [0, 0, w, h];
    this.GL.viewport(0, 0, w, h);
  }

  _updateViewport() {
    this._origViewport = {
      width: this.GL.drawingBufferWidth,
      height: this.GL.drawingBufferHeight,
    };
    this.viewport(this._origViewport.width, this._origViewport.height);
  }

  _createPixelsArray() {
    this.pixels = new Uint8Array(
      this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4
    );
  }

  /**
   * clears color and depth buffers
   * with r,g,b,a
   * @private
   * @param {Number} r normalized red val.
   * @param {Number} g normalized green val.
   * @param {Number} b normalized blue val.
   * @param {Number} a normalized alpha val.
   */
  clear(...args) {
    const _r = args[0] || 0;
    const _g = args[1] || 0;
    const _b = args[2] || 0;
    let _a = args[3] || 0;

    const activeFramebuffer = this.activeFramebuffer();
    if (
      activeFramebuffer &&
      activeFramebuffer.format === constants.UNSIGNED_BYTE &&
      !activeFramebuffer.antialias &&
      _a === 0
    ) {
      // Drivers on Intel Macs check for 0,0,0,0 exactly when drawing to a
      // framebuffer and ignore the command if it's the only drawing command to
      // the framebuffer. To work around it, we can set the alpha to a value so
      // low that it still rounds down to 0, but that circumvents the buggy
      // check in the driver.
      _a = 1e-10;
    }

    this.GL.clearColor(_r * _a, _g * _a, _b * _a, _a);
    this.GL.clearDepth(1);
    this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
  }

  /**
   * Resets all depth information so that nothing previously drawn will
   * occlude anything subsequently drawn.
   */
  clearDepth(depth = 1) {
    this.GL.clearDepth(depth);
    this.GL.clear(this.GL.DEPTH_BUFFER_BIT);
  }

  _applyStencilTestIfClipping() {
    const drawTarget = this.drawTarget();
    if (drawTarget._isClipApplied !== this._stencilTestOn) {
      if (drawTarget._isClipApplied) {
        this._internalEnable.call(this.GL, this.GL.STENCIL_TEST);
        this._stencilTestOn = true;
      } else {
        if (!this._userEnabledStencil) {
          this._internalDisable.call(this.GL, this.GL.STENCIL_TEST);
        }
        this._stencilTestOn = false;
      }
    }
  }


  //////////////////////////////////////////////
  // SHADER
  //////////////////////////////////////////////

  /*
   * shaders are created and cached on a per-renderer basis,
   * on the grounds that each renderer will have its own gl context
   * and the shader must be valid in that context.
   */

  // TODO move to super class
  _getSphereMapping(img) {
    if (!this.sphereMapping) {
      this.sphereMapping = this._pInst.createFilterShader(sphereMapping);
    }
    this.scratchMat3.inverseTranspose4x4(this.states.uViewMatrix);
    this.scratchMat3.invert(this.scratchMat3); // uNMMatrix is 3x3
    this.sphereMapping.setUniform("uFovY", this.states.curCamera.cameraFOV);
    this.sphereMapping.setUniform("uAspect", this.states.curCamera.aspectRatio);
    this.sphereMapping.setUniform("uNewNormalMatrix", this.scratchMat3.mat3);
    this.sphereMapping.setUniform("uEnvMap", img);
    return this.sphereMapping;
  }

  baseMaterialShader() {
    if (!this._pInst._glAttributes.perPixelLighting) {
      throw new Error(
        "The material shader does not support hooks without perPixelLighting. Try turning it back on."
      );
    }
    return super.baseMaterialShader();
  }

  _getLightShader() {
    if (!this._defaultLightShader) {
      if (this._pInst._glAttributes.perPixelLighting) {
        this._defaultLightShader = new Shader(
          this,
          this._webGL2CompatibilityPrefix("vert", "highp") +
            defaultShaders.phongVert,
          this._webGL2CompatibilityPrefix("frag", "highp") +
            defaultShaders.phongFrag,
          {
            vertex: {
              "void beforeVertex": "() {}",
              "Vertex getObjectInputs": "(Vertex inputs) { return inputs; }",
              "Vertex getWorldInputs": "(Vertex inputs) { return inputs; }",
              "Vertex getCameraInputs": "(Vertex inputs) { return inputs; }",
              "void afterVertex": "() {}",
            },
            fragment: {
              "void beforeFragment": "() {}",
              "Inputs getPixelInputs": "(Inputs inputs) { return inputs; }",
              "vec4 combineColors": `(ColorComponents components) {
                vec4 color = vec4(0.);
                color.rgb += components.diffuse * components.baseColor;
                color.rgb += components.ambient * components.ambientColor;
                color.rgb += components.specular * components.specularColor;
                color.rgb += components.emissive;
                color.a = components.opacity;
                return color;
              }`,
              "vec4 getFinalColor": "(vec4 color) { return color; }",
              "void afterFragment": "() {}",
            },
          }
        );
      } else {
        this._defaultLightShader = new Shader(
          this,
          this._webGL2CompatibilityPrefix("vert", "highp") +
            defaultShaders.lightVert,
          this._webGL2CompatibilityPrefix("frag", "highp") +
            defaultShaders.lightTextureFrag
        );
      }
    }

    return this._defaultLightShader;
  }

  _getNormalShader() {
    if (!this._defaultNormalShader) {
      this._defaultNormalShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.normalVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.normalFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "Vertex getObjectInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getWorldInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getCameraInputs": "(Vertex inputs) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }

    return this._defaultNormalShader;
  }

  _getColorShader() {
    if (!this._defaultColorShader) {
      this._defaultColorShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.normalVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.basicFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "Vertex getObjectInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getWorldInputs": "(Vertex inputs) { return inputs; }",
            "Vertex getCameraInputs": "(Vertex inputs) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }

    return this._defaultColorShader;
  }

  _getPointShader() {
    if (!this._defaultPointShader) {
      this._defaultPointShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.pointVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.pointFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "vec3 getLocalPosition": "(vec3 position) { return position; }",
            "vec3 getWorldPosition": "(vec3 position) { return position; }",
            "float getPointSize": "(float size) { return size; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "bool shouldDiscard": "(bool outside) { return outside; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }
    return this._defaultPointShader;
  }

  _getLineShader() {
    if (!this._defaultLineShader) {
      this._defaultLineShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "mediump") +
          defaultShaders.lineVert,
        this._webGL2CompatibilityPrefix("frag", "mediump") +
          defaultShaders.lineFrag,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "StrokeVertex getObjectInputs":
              "(StrokeVertex inputs) { return inputs; }",
            "StrokeVertex getWorldInputs":
              "(StrokeVertex inputs) { return inputs; }",
            "StrokeVertex getCameraInputs":
              "(StrokeVertex inputs) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "Inputs getPixelInputs": "(Inputs inputs) { return inputs; }",
            "vec4 getFinalColor": "(vec4 color) { return color; }",
            "bool shouldDiscard": "(bool outside) { return outside; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }

    return this._defaultLineShader;
  }

  _getFontShader() {
    if (!this._defaultFontShader) {
      if (this.webglVersion === constants.WEBGL) {
        this.GL.getExtension("OES_standard_derivatives");
      }
      this._defaultFontShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "highp") +
          defaultShaders.fontVert,
        this._webGL2CompatibilityPrefix("frag", "highp") +
          defaultShaders.fontFrag
      );
    }
    return this._defaultFontShader;
  }

  baseFilterShader() {
    if (!this._baseFilterShader) {
      this._baseFilterShader = new Shader(
        this,
        this._webGL2CompatibilityPrefix("vert", "highp") +
          defaultShaders.filterBaseVert,
        this._webGL2CompatibilityPrefix("frag", "highp") +
          defaultShaders.filterBaseFrag,
        {
            vertex: {},
            fragment: {
              "vec4 getColor": `(FilterInputs inputs, in sampler2D canvasContent) {
                return getTexture(canvasContent, inputs.texCoord);
              }`,
            },
          }
      );
    }
    return this._baseFilterShader;
  }

  _webGL2CompatibilityPrefix(shaderType, floatPrecision) {
    let code = "";
    if (this.webglVersion === constants.WEBGL2) {
      code += "#version 300 es\n#define WEBGL2\n";
    }
    if (shaderType === "vert") {
      code += "#define VERTEX_SHADER\n";
    } else if (shaderType === "frag") {
      code += "#define FRAGMENT_SHADER\n";
    }
    if (floatPrecision) {
      code += `precision ${floatPrecision} float;\n`;
    }
    return code;
  }

  /**
   * @private
   * Note: DO NOT CALL THIS while in the middle of binding another texture,
   * since it will change the texture binding in order to allocate the empty
   * texture! Grab its value beforehand!
   */
  _getEmptyTexture() {
    if (!this._emptyTexture) {
      // a plain white texture RGBA, full alpha, single pixel.
      const im = new Image(1, 1);
      im.set(0, 0, 255);
      this._emptyTexture = new Texture(this, im);
    }
    return this._emptyTexture;
  }

  getTexture(input) {
    let src = input;
    if (src instanceof Framebuffer) {
      src = src.color;
    }

    const texture = this.textures.get(src);
    if (texture) {
      return texture;
    }

    const tex = new Texture(this, src);
    this.textures.set(src, tex);
    return tex;
  }

  // TODO move to super class
  /*
   *  used in imageLight,
   *  To create a blurry image from the input non blurry img, if it doesn't already exist
   *  Add it to the diffusedTexture map,
   *  Returns the blurry image
   *  maps a Image used by imageLight() to a p5.Framebuffer
   */
  getDiffusedTexture(input) {
    // if one already exists for a given input image
    if (this.diffusedTextures.get(input) != null) {
      return this.diffusedTextures.get(input);
    }
    // if not, only then create one
    let newFramebuffer;
    // hardcoded to 200px, because it's going to be blurry and smooth
    let smallWidth = 200;
    let width = smallWidth;
    let height = Math.floor(smallWidth * (input.height / input.width));
    newFramebuffer = new Framebuffer(this, {
      width,
      height,
      density: 1,
    });
    // create framebuffer is like making a new sketch, all functions on main
    // sketch it would be available on framebuffer
    if (!this.diffusedShader) {
      this.diffusedShader = this._pInst.createShader(
        defaultShaders.imageLightVert,
        defaultShaders.imageLightDiffusedFrag
      );
    }
    newFramebuffer.draw(() => {
      this.shader(this.diffusedShader);
      this.diffusedShader.setUniform("environmentMap", input);
      this.states.setValue("strokeColor", null);
      this.noLights();
      this.plane(width, height);
    });
    this.diffusedTextures.set(input, newFramebuffer);
    return newFramebuffer;
  }

  // TODO move to super class
  /*
   *  used in imageLight,
   *  To create a texture from the input non blurry image, if it doesn't already exist
   *  Creating 8 different levels of textures according to different
   *  sizes and atoring them in `levels` array
   *  Creating a new Mipmap texture with that `levels` array
   *  Storing the texture for input image in map called `specularTextures`
   *  maps the input Image to a p5.MipmapTexture
   */
  getSpecularTexture(input) {
    // check if already exits (there are tex of diff resolution so which one to check)
    // currently doing the whole array
    if (this.specularTextures.get(input) != null) {
      return this.specularTextures.get(input);
    }
    // Hardcoded size
    const size = 512;
    let tex;
    const levels = [];
    const framebuffer = new Framebuffer(this, {
      width: size,
      height: size,
      density: 1,
    });
    let count = Math.log(size) / Math.log(2);
    if (!this.specularShader) {
      this.specularShader = this._pInst.createShader(
        defaultShaders.imageLightVert,
        defaultShaders.imageLightSpecularFrag
      );
    }
    // currently only 8 levels
    // This loop calculates 8 framebuffers of varying size of canvas
    // and corresponding different roughness levels.
    // Roughness increases with the decrease in canvas size,
    // because rougher surfaces have less detailed/more blurry reflections.
    for (let w = size; w >= 1; w /= 2) {
      framebuffer.resize(w, w);
      let currCount = Math.log(w) / Math.log(2);
      let roughness = 1 - currCount / count;
      framebuffer.draw(() => {
        this.shader(this.specularShader);
        this.clear();
        this.specularShader.setUniform("environmentMap", input);
        this.specularShader.setUniform("roughness", roughness);
        this.states.setValue("strokeColor", null);
        this.noLights();
        this.plane(w, w);
      });
      levels.push(framebuffer.get().drawingContext.getImageData(0, 0, w, w));
    }
    // Free the Framebuffer
    framebuffer.remove();
    tex = new MipmapTexture(this, levels, {});
    this.specularTextures.set(input, tex);
    return tex;
  }

  /* Binds a buffer to the drawing context
   * when passed more than two arguments it also updates or initializes
   * the data associated with the buffer
   */
  _bindBuffer(buffer, target, values, type, usage) {
    const gl = this.GL;
    if (!target) target = gl.ARRAY_BUFFER;
    gl.bindBuffer(target, buffer);

    if (values !== undefined) {
      const data = this._normalizeBufferData(values, type);
      gl.bufferData(target, data, usage || gl.STATIC_DRAW);
    }
  }

  _makeFilterShader(renderer, operation) {
    return new Shader(
      renderer,
      filterShaderVert,
      filterShaderFrags[operation]
    );
  }

  _prepareBuffer(renderBuffer, geometry, shader) {
    const attributes = shader.attributes;
    const gl = this.GL;
    const glBuffers = this._getOrMakeCachedBuffers(geometry);

    // loop through each of the buffer definitions
    const attr = attributes[renderBuffer.attr];
    if (!attr) {
      return;
    }
    // check if the geometry has the appropriate source array
    let buffer = glBuffers[renderBuffer.dst];
    const src = geometry[renderBuffer.src];
    if (src && src.length > 0) {
      // check if we need to create the GL buffer
      const createBuffer = !buffer;
      if (createBuffer) {
        // create and remember the buffer
        glBuffers[renderBuffer.dst] = buffer = gl.createBuffer();
      }
      // bind the buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      // check if we need to fill the buffer with data
      if (createBuffer || geometry.dirtyFlags[renderBuffer.src] !== false) {
        const map = renderBuffer.map;
        // get the values from the geometry, possibly transformed
        const values = map ? map(src) : src;
        // fill the buffer with the values
        this._bindBuffer(buffer, gl.ARRAY_BUFFER, values);
        // mark the geometry's source array as clean
        geometry.dirtyFlags[renderBuffer.src] = false;
      }
      // enable the attribute
      shader.enableAttrib(attr, renderBuffer.size);
    } else {
      const loc = attr.location;
      if (loc === -1 || !this.registerEnabled.has(loc)) {
        return;
      }
      // Disable register corresponding to unused attribute
      gl.disableVertexAttribArray(loc);
      // Record register availability
      this.registerEnabled.delete(loc);
    }
  }

  _enableAttrib(_shader, attr, size, type, normalized, stride, offset) {
    const loc = attr.location;
    const gl = this.GL;
    // Enable register even if it is disabled
    if (!this.registerEnabled.has(loc)) {
      gl.enableVertexAttribArray(loc);
      // Record register availability
      this.registerEnabled.add(loc);
    }
    gl.vertexAttribPointer(
      loc,
      size,
      type || gl.FLOAT,
      normalized || false,
      stride || 0,
      offset || 0
    );
  }

  _ensureGeometryBuffers(buffers, indices, indexType) {
    const gl = this.GL;

    if (indices) {
      const buffer = gl.createBuffer();
      this.renderer._bindBuffer(buffer, gl.ELEMENT_ARRAY_BUFFER, indices, indexType);

      buffers.indexBuffer = buffer;

      // If we're using a Uint32Array for our indexBuffer we will need to pass a
      // different enum value to WebGL draw triangles. This happens in
      // the _drawElements function.
      buffers.indexBufferType = indexType === Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    } else if (buffers.indexBuffer) {
      // the index buffer is unused, remove it
      gl.deleteBuffer(buffers.indexBuffer);
      buffers.indexBuffer = null;
    }
  }

  _freeBuffers(buffers) {
    const gl = this.GL;
    if (buffers.indexBuffer) {
      gl.deleteBuffer(buffers.indexBuffer);
    }

    function freeBuffers(defs) {
      for (const def of defs) {
        if (buffers[def.dst]) {
          gl.deleteBuffer(buffers[def.dst]);
          buffers[def.dst] = null;
        }
      }
    }

    // free all the buffers
    freeBuffers(this.buffers.stroke);
    freeBuffers(this.buffers.fill);
    freeBuffers(this.buffers.user);
  }

  _initShader(shader) {
    const gl = this.GL;

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, shader.vertSrc());
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      throw new Error(`Yikes! An error occurred compiling the vertex shader: ${
        gl.getShaderInfoLog(vertShader)
      }`);
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, shader.fragSrc());
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      throw new Error(`Darn! An error occurred compiling the fragment shader: ${
        gl.getShaderInfoLog(fragShader)
      }`);
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        `Snap! Error linking shader program: ${gl.getProgramInfoLog(program)}`
      );
    }

    shader._glProgram = program;
    shader._vertShader = vertShader;
    shader._fragShader = fragShader;
  }

  ///////////////////////////////
  //// UTILITY FUNCTIONS
  //////////////////////////////
  _arraysEqual(a, b) {
    const aLength = a.length;
    if (aLength !== b.length) return false;
    return a.every((ai, i) => ai === b[i]);
  }

  _isTypedArray(arr) {
    return [
      Float32Array,
      Float64Array,
      Int16Array,
      Uint16Array,
      Uint32Array,
    ].some((x) => arr instanceof x);
  }

  /**
   * turn a p5.Vector Array into a one dimensional number array
   * @private
   * @param  {p5.Vector[]} arr  an array of p5.Vector
   * @return {Number[]}     a one dimensional array of numbers
   * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
   * [1, 2, 3, 4, 5, 6]
   */
  _vToNArray(arr) {
    return arr.flatMap((item) => [item.x, item.y, item.z]);
  }
}

function rendererGL(p5, fn) {
  p5.RendererGL = RendererGL;

  /**
   * @module Rendering
   * @submodule Rendering
   * @for p5
   */
  /**
   * Set attributes for the WebGL Drawing context.
   * This is a way of adjusting how the WebGL
   * renderer works to fine-tune the display and performance.
   *
   * Note that this will reinitialize the drawing context
   * if called after the WebGL canvas is made.
   *
   * If an object is passed as the parameter, all attributes
   * not declared in the object will be set to defaults.
   *
   * The available attributes are:
   * <br>
   * alpha - indicates if the canvas contains an alpha buffer
   * default is true
   *
   * depth - indicates whether the drawing buffer has a depth buffer
   * of at least 16 bits - default is true
   *
   * stencil - indicates whether the drawing buffer has a stencil buffer
   * of at least 8 bits
   *
   * antialias - indicates whether or not to perform anti-aliasing
   * default is false (true in Safari)
   *
   * premultipliedAlpha - indicates that the page compositor will assume
   * the drawing buffer contains colors with pre-multiplied alpha
   * default is true
   *
   * preserveDrawingBuffer - if true the buffers will not be cleared and
   * and will preserve their values until cleared or overwritten by author
   * (note that p5 clears automatically on draw loop)
   * default is true
   *
   * perPixelLighting - if true, per-pixel lighting will be used in the
   * lighting shader otherwise per-vertex lighting is used.
   * default is true.
   *
   * version - either 1 or 2, to specify which WebGL version to ask for. By
   * default, WebGL 2 will be requested. If WebGL2 is not available, it will
   * fall back to WebGL 1. You can check what version is used with by looking at
   * the global `webglVersion` property.
   *
   * @method setAttributes
   * @for p5
   * @param  {String}  key Name of attribute
   * @param  {Boolean}        value New value of named attribute
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   * }
   *
   * function draw() {
   *   background(255);
   *   push();
   *   rotateZ(frameCount * 0.02);
   *   rotateX(frameCount * 0.02);
   *   rotateY(frameCount * 0.02);
   *   fill(0, 0, 0);
   *   box(50);
   *   pop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   *  // Now with the antialias attribute set to true.
   * function setup() {
   *   setAttributes('antialias', true);
   *   createCanvas(100, 100, WEBGL);
   * }
   *
   * function draw() {
   *   background(255);
   *   push();
   *   rotateZ(frameCount * 0.02);
   *   rotateX(frameCount * 0.02);
   *   rotateY(frameCount * 0.02);
   *   fill(0, 0, 0);
   *   box(50);
   *   pop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // press the mouse button to disable perPixelLighting
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   noStroke();
   *   fill(255);
   * }
   *
   * let lights = [
   *   { c: '#f00', t: 1.12, p: 1.91, r: 0.2 },
   *   { c: '#0f0', t: 1.21, p: 1.31, r: 0.2 },
   *   { c: '#00f', t: 1.37, p: 1.57, r: 0.2 },
   *   { c: '#ff0', t: 1.12, p: 1.91, r: 0.7 },
   *   { c: '#0ff', t: 1.21, p: 1.31, r: 0.7 },
   *   { c: '#f0f', t: 1.37, p: 1.57, r: 0.7 }
   * ];
   *
   * function draw() {
   *   let t = millis() / 1000 + 1000;
   *   background(0);
   *   directionalLight(color('#222'), 1, 1, 1);
   *
   *   for (let i = 0; i < lights.length; i++) {
   *     let light = lights[i];
   *     pointLight(
   *       color(light.c),
   *       p5.Vector.fromAngles(t * light.t, t * light.p, width * light.r)
   *     );
   *   }
   *
   *   specularMaterial(255);
   *   sphere(width * 0.1);
   *
   *   rotateX(t * 0.77);
   *   rotateY(t * 0.83);
   *   rotateZ(t * 0.91);
   *   torus(width * 0.3, width * 0.07, 24, 10);
   * }
   *
   * function mousePressed() {
   *   setAttributes('perPixelLighting', false);
   *   noStroke();
   *   fill(255);
   * }
   * function mouseReleased() {
   *   setAttributes('perPixelLighting', true);
   *   noStroke();
   *   fill(255);
   * }
   * </code>
   * </div>
   *
   * @alt a rotating cube with smoother edges
   */
  /**
   * @method setAttributes
   * @for p5
   * @param  {Object}  obj object with key-value pairs
   */
  fn.setAttributes = function (key, value) {
    if (typeof this._glAttributes === "undefined") {
      console.log(
        "You are trying to use setAttributes on a p5.Graphics object " +
          "that does not use a WEBGL renderer."
      );
      return;
    }
    let unchanged = true;
    if (typeof value !== "undefined") {
      //first time modifying the attributes
      if (this._glAttributes === null) {
        this._glAttributes = {};
      }
      if (this._glAttributes[key] !== value) {
        //changing value of previously altered attribute
        this._glAttributes[key] = value;
        unchanged = false;
      }
      //setting all attributes with some change
    } else if (key instanceof Object) {
      if (this._glAttributes !== key) {
        this._glAttributes = key;
        unchanged = false;
      }
    }
    //@todo_FES
    if (!this._renderer.isP3D || unchanged) {
      return;
    }

    if (!this._setupDone) {
      if (this._renderer.geometryBufferCache.numCached() > 0) {
        p5._friendlyError(
          "Sorry, Could not set the attributes, you need to call setAttributes() " +
            "before calling the other drawing methods in setup()"
        );
        return;
      }
    }

    this._renderer._resetContext();

    if (this._renderer.states.curCamera) {
      this._renderer.states.curCamera._renderer = this._renderer;
    }
  };

  /**
   * ensures that p5 is using a 3d renderer. throws an error if not.
   */
  fn._assert3d = function (name) {
    if (!this._renderer.isP3D)
      throw new Error(
        `${name}() is only supported in WEBGL mode. If you'd like to use 3D graphics and WebGL, see  https://p5js.org/examples/form-3d-primitives.html for more information.`
      );
  };

  p5.renderers[constants.WEBGL] = p5.RendererGL;
  p5.renderers[constants.WEBGL2] = p5.RendererGL;
}

export default rendererGL;
export { RendererGL };

if (typeof p5 !== "undefined") {
  rendererGL(p5, p5.prototype);
}
