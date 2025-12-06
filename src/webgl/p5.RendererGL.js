import * as constants from '../core/constants';
import {
  getWebGLShaderAttributes,
  getWebGLUniformMetadata,
  populateGLSLHooks,
  readPixelsWebGL,
  readPixelWebGL,
  setWebGLTextureParams,
  setWebGLUniformValue,
  checkWebGLCapabilities
} from './utils';
import { Renderer3D, getStrokeDefs } from '../core/p5.Renderer3D';
import { Shader } from './p5.Shader';
import { MipmapTexture } from './p5.Texture';
import { Framebuffer } from './p5.Framebuffer';
import { RGB, RGBA } from '../color/creating_reading';
import { Image } from '../image/p5.Image';
import { glslBackend } from './strands_glslBackend';
import { TypeInfoFromGLSLName } from '../strands/ir_types.js';
import { getShaderHookTypes } from './shaderHookUtils';
import noiseGLSL from './shaders/functions/noise3DGLSL.glsl';

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
import imageLightVert from "./shaders/imageLight.vert";
import imageLightDiffusedFrag from "./shaders/imageLightDiffused.frag";
import imageLightSpecularFrag from "./shaders/imageLightSpecular.frag";
import filterBaseFrag from "./shaders/filters/base.frag";

const { lineDefs } = getStrokeDefs((n, v) => `#define ${n} ${v}\n`);

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
    this.strandsBackend = glslBackend;
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

  /**
   * Once all buffers have been bound, this checks to see if there are any
   * remaining active attributes, likely left over from previous renders,
   * and disables them so that they don't affect rendering.
   * @private
   */
  _disableRemainingAttributes(shader) {
    for (const location of this.registerEnabled.values()) {
      if (
        !Object.keys(shader.attributes).some(
          key => shader.attributes[key].location === location
        )
      ) {
        this.GL.disableVertexAttribArray(location);
        this.registerEnabled.delete(location);
      }
    }
  }

  _drawBuffers(geometry, { mode = constants.TRIANGLES, count }) {
    const gl = this.GL;
    const glBuffers = this.geometryBufferCache.getCached(geometry);

    if (!glBuffers) return;

    if (this._curShader.shaderType === 'stroke'){
      if (count === 1) {
        gl.drawArrays(gl.TRIANGLES, 0, geometry.lineVertices.length / 3);
       } else {
       try {
          gl.drawArraysInstanced(
          gl.TRIANGLES,
            0,
            geometry.lineVertices.length / 3,
            count
          );
        } catch (e) {
          console.log(
            "🌸 p5.js says: Instancing is only supported in WebGL2 mode"
          );
        }
       }
    } else if (this._curShader.shaderType === 'text') {
      // Text rendering uses a fixed quad geometry with 6 indices
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    } else if (glBuffers.indexBuffer) {
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
      const glMode = mode === constants.TRIANGLES ? gl.TRIANGLES : gl.TRIANGLE_STRIP;
      if (count === 1) {
        gl.drawArrays(glMode, 0, geometry.vertices.length);
      } else {
        try {
          gl.drawArraysInstanced(glMode, 0, geometry.vertices.length, count);
        } catch (e) {
          console.log(
            "🌸 p5.js says: Instancing is only supported in WebGL2 mode"
          );
        }
      }
    }
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

  _setAttributes(key, value) {
    if (typeof this._pInst._glAttributes === "undefined") {
      console.log(
        "You are trying to use setAttributes on a p5.Graphics object " +
          "that does not use a WEBGL renderer."
      );
      return;
    }
    let unchanged = true;
    if (typeof value !== "undefined") {
      //first time modifying the attributes
      if (this._pInst._glAttributes === null) {
        this._pInst._glAttributes = {};
      }
      if (this._pInst._glAttributes[key] !== value) {
        //changing value of previously altered attribute
        this._pInst._glAttributes[key] = value;
        unchanged = false;
      }
      //setting all attributes with some change
    } else if (key instanceof Object) {
      if (this._pInst._glAttributes !== key) {
        this._pInst._glAttributes = key;
        unchanged = false;
      }
    }
    //@todo_FES
    if (!this.isP3D || unchanged) {
      return;
    }

    if (!this._pInst._setupDone) {
      if (this.geometryBufferCache.numCached() > 0) {
        p5._friendlyError(
          "Sorry, Could not set the attributes, you need to call setAttributes() " +
            "before calling the other drawing methods in setup()"
        );
        return;
      }
    }

    this._resetContext(null, null, RendererGL);

    if (this.states.curCamera) {
      this.states.curCamera._renderer = this._renderer;
    }
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
      // Make sure all images are loaded into the canvas non-premultiplied so that
      // they can be handled consistently in shaders.
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
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
    if (!this._userEnabledStencil) {
      this._internalDisable.call(this.GL, this.GL.STENCIL_TEST);
    }
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

  zClipRange() {
    return [-1, 1];
  }
  defaultNearScale() {
    return 0.1;
  }
  defaultFarScale() {
    return 10;
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

  /*
   * WebGL-specific implementation of imageLight shader creation
   */
  _createImageLightShader(type) {
    if (type === 'diffused') {
      return this._pInst.createShader(
        defaultShaders.imageLightVert,
        defaultShaders.imageLightDiffusedFrag
      );
    } else if (type === 'specular') {
      return this._pInst.createShader(
        defaultShaders.imageLightVert,
        defaultShaders.imageLightSpecularFrag
      );
    }
    throw new Error(`Unknown imageLight shader type: ${type}`);
  }


  /*
   * WebGL-specific implementation of mipmap texture creation
   */
  _createMipmapTexture(levels) {
    return new MipmapTexture(this, levels, {});
  }

  /*
   * Prepare array to collect ImageData levels for WebGL
   */
  _prepareMipmapData(size, mipLevels) {
    return { levels: [], size, mipLevels };
  }

  /*
   * Accumulate ImageData from framebuffer for WebGL
   */
  _accumulateMipLevel(framebuffer, mipmapData, mipLevel, width, height) {
    const imageData = framebuffer.get().drawingContext.getImageData(0, 0, width, height);
    mipmapData.levels.push(imageData);
  }

  /*
   * Create final MipmapTexture from collected ImageData for WebGL
   */
  _finalizeMipmapTexture(mipmapData) {
    return new MipmapTexture(this, mipmapData.levels, {
      minFilter: constants.LINEAR_MIPMAP,
      magFilter: constants.LINEAR,
    });
  }

  createMipmapTextureHandle({ levels, format, dataType, width, height }) {
    const gl = this.GL;
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Determine GL format and data type
    const glFormat = gl.RGBA;
    const glDataType = gl.UNSIGNED_BYTE;

    console.log(levels)
    for (let level = 0; level < levels.length; level++) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        glFormat,
        glFormat,
        glDataType,
        levels[level]
      );
    }

    // Set mipmap-appropriate filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, null);

    return { texture, glFormat, glDataType };
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
      this._bindBuffer(buffer, gl.ELEMENT_ARRAY_BUFFER, indices, indexType);

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
      } in:\n\n${shader.vertSrc()}`);
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

  _finalizeShader() {}

  _getShaderAttributes(shader) {
    return getWebGLShaderAttributes(shader, this.GL);
  }

  getUniformMetadata(shader) {
    return getWebGLUniformMetadata(shader, this.GL);
  }

  updateUniformValue(shader, uniform, data) {
    return setWebGLUniformValue(
      shader,
      uniform,
      data,
      (tex) => this.getTexture(tex),
      this.GL
    );
  }

  _updateTexture(uniform, tex) {
    const gl = this.GL;
    gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
    tex.bindTexture();
    tex.update();
    gl.uniform1i(uniform.location, uniform.samplerIndex);
  }

  bindTexture(tex) {
    // bind texture using gl context + glTarget and
    // generated gl texture object
    this.GL.bindTexture(this.GL.TEXTURE_2D, tex.getTexture().texture);
  }

  unbindTexture() {
    // unbind per above, disable texturing on glTarget
    this.GL.bindTexture(this.GL.TEXTURE_2D, null);
  }

  _unbindFramebufferTexture(uniform) {
    // Make sure an empty texture is bound to the slot so that we don't
    // accidentally leave a framebuffer bound, causing a feedback loop
    // when something else tries to write to it
    const gl = this.GL;
    const empty = this._getEmptyTexture();
    gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
    empty.bindTexture();
    gl.uniform1i(uniform.location, uniform.samplerIndex);
  }

  createTexture({ width, height, format, dataType }) {
    const gl = this.GL;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
                       gl.RGBA, gl.UNSIGNED_BYTE, null);
    // TODO use format and data type
    return { texture: tex, glFormat: gl.RGBA, glDataType: gl.UNSIGNED_BYTE };
  }

  createFramebufferTextureHandle(framebufferTexture) {
    // For WebGL, framebuffer texture handles are designed to be null
    return null;
  }

  uploadTextureFromSource({ texture, glFormat, glDataType }, source) {
    const gl = this.GL;
    gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, glFormat, glDataType, source);
  }

  uploadTextureFromData({ texture, glFormat, glDataType }, data, width, height) {
    const gl = this.GL;
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      glFormat,
      width,
      height,
      0,
      glFormat,
      glDataType,
      data
    );
  }

  getSampler(_texture) {
    return undefined;
  }

  bindTextureToShader({ texture }, sampler, uniformName, unit) {
    const gl = this.GL;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const location = gl.getUniformLocation(glProgram, uniformName);
    gl.uniform1i(location, unit);
  }

  setTextureParams(texture) {
    return setWebGLTextureParams(texture, this.GL, this.webglVersion);
  }

  deleteTexture({ texture }) {
    this.GL.deleteTexture(texture);
  }


  /**
   * @private blends colors according to color components.
   * If alpha value is less than 1, or non-standard blendMode
   * we need to enable blending on our gl context.
   * @param  {Number[]} color The currently set color, with values in 0-1 range
   * @param  {Boolean} [hasTransparency] Whether the shape being drawn has other
   * transparency internally, e.g. via vertex colors
   * @return {Number[]}  Normalized numbers array
   */
  _applyColorBlend(colors, hasTransparency) {
    const gl = this.GL;

    const isTexture = this.states.drawMode === constants.TEXTURE;
    const doBlend =
      hasTransparency ||
      this.states.userFillShader ||
      this.states.userStrokeShader ||
      isTexture ||
      this.states.curBlendMode !== constants.BLEND ||
      colors[colors.length - 1] < 1.0 ||
      this._isErasing;

    if (doBlend !== this._isBlending) {
      if (
        doBlend ||
        (this.states.curBlendMode !== constants.BLEND &&
          this.states.curBlendMode !== constants.ADD)
      ) {
        gl.enable(gl.BLEND);
      } else {
        gl.disable(gl.BLEND);
      }
      gl.depthMask(true);
      this._isBlending = doBlend;
    }
    this._applyBlendMode();
    return colors;
  }

  //////////////////////////////////////////////
  // Shader hooks
  //////////////////////////////////////////////
  uniformNameFromHookKey(key) {
    return key.slice(key.indexOf(' ') + 1);
  }
  populateHooks(shader, src, shaderType) {
    return populateGLSLHooks(shader, src, shaderType);
  }

  getShaderHookTypes(shader, hookName) {
    return getShaderHookTypes(shader, hookName);
  }

  //////////////////////////////////////////////
  // Framebuffer methods
  //////////////////////////////////////////////

  defaultFramebufferAlpha() {
    return this._pInst._glAttributes.alpha;
  }

  defaultFramebufferAntialias() {
    return this.supportsFramebufferAntialias()
      ? this._pInst._glAttributes.antialias
      : false;
  }

  supportsFramebufferAntialias() {
    return this.webglVersion === constants.WEBGL2;
  }

  createFramebufferResources(framebuffer) {
    const gl = this.GL;

    framebuffer.framebuffer = gl.createFramebuffer();
    if (!framebuffer.framebuffer) {
      throw new Error('Unable to create a framebuffer');
    }

    if (framebuffer.antialias) {
      framebuffer.aaFramebuffer = gl.createFramebuffer();
      if (!framebuffer.aaFramebuffer) {
        throw new Error('Unable to create a framebuffer for antialiasing');
      }
    }
  }

  validateFramebufferFormats(framebuffer) {
    const gl = this.GL;

    if (
      framebuffer.useDepth &&
      this.webglVersion === constants.WEBGL &&
      !gl.getExtension('WEBGL_depth_texture')
    ) {
      console.warn(
        'Unable to create depth textures in this environment. Falling back ' +
          'to a framebuffer without depth.'
      );
      framebuffer.useDepth = false;
    }

    if (
      framebuffer.useDepth &&
      this.webglVersion === constants.WEBGL &&
      framebuffer.depthFormat === constants.FLOAT
    ) {
      console.warn(
        'FLOAT depth format is unavailable in WebGL 1. ' +
          'Defaulting to UNSIGNED_INT.'
      );
      framebuffer.depthFormat = constants.UNSIGNED_INT;
    }

    if (![
      constants.UNSIGNED_BYTE,
      constants.FLOAT,
      constants.HALF_FLOAT
    ].includes(framebuffer.format)) {
      console.warn(
        'Unknown Framebuffer format. ' +
          'Please use UNSIGNED_BYTE, FLOAT, or HALF_FLOAT. ' +
          'Defaulting to UNSIGNED_BYTE.'
      );
      framebuffer.format = constants.UNSIGNED_BYTE;
    }
    if (framebuffer.useDepth && ![
      constants.UNSIGNED_INT,
      constants.FLOAT
    ].includes(framebuffer.depthFormat)) {
      console.warn(
        'Unknown Framebuffer depth format. ' +
          'Please use UNSIGNED_INT or FLOAT. Defaulting to FLOAT.'
      );
      framebuffer.depthFormat = constants.FLOAT;
    }

    const support = checkWebGLCapabilities(this);
    if (!support.float && framebuffer.format === constants.FLOAT) {
      console.warn(
        'This environment does not support FLOAT textures. ' +
          'Falling back to UNSIGNED_BYTE.'
      );
      framebuffer.format = constants.UNSIGNED_BYTE;
    }
    if (
      framebuffer.useDepth &&
      !support.float &&
      framebuffer.depthFormat === constants.FLOAT
    ) {
      console.warn(
        'This environment does not support FLOAT depth textures. ' +
          'Falling back to UNSIGNED_INT.'
      );
      framebuffer.depthFormat = constants.UNSIGNED_INT;
    }
    if (!support.halfFloat && framebuffer.format === constants.HALF_FLOAT) {
      console.warn(
        'This environment does not support HALF_FLOAT textures. ' +
          'Falling back to UNSIGNED_BYTE.'
      );
      framebuffer.format = constants.UNSIGNED_BYTE;
    }

    if (
      framebuffer.channels === RGB &&
      [constants.FLOAT, constants.HALF_FLOAT].includes(framebuffer.format)
    ) {
      console.warn(
        'FLOAT and HALF_FLOAT formats do not work cross-platform with only ' +
          'RGB channels. Falling back to RGBA.'
      );
      framebuffer.channels = RGBA;
    }
  }

  recreateFramebufferTextures(framebuffer) {
    const gl = this.GL;

    const prevBoundTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
    const prevBoundFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    const colorTexture = gl.createTexture();
    if (!colorTexture) {
      throw new Error('Unable to create color texture');
    }
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    const colorFormat = this._getFramebufferColorFormat(framebuffer);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      colorFormat.internalFormat,
      framebuffer.width * framebuffer.density,
      framebuffer.height * framebuffer.density,
      0,
      colorFormat.format,
      colorFormat.type,
      null
    );
    framebuffer.colorTexture = colorTexture;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      colorTexture,
      0
    );

    if (framebuffer.useDepth) {
      // Create the depth texture
      const depthTexture = gl.createTexture();
      if (!depthTexture) {
        throw new Error('Unable to create depth texture');
      }
      const depthFormat = this._getFramebufferDepthFormat(framebuffer);
      gl.bindTexture(gl.TEXTURE_2D, depthTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        depthFormat.internalFormat,
        framebuffer.width * framebuffer.density,
        framebuffer.height * framebuffer.density,
        0,
        depthFormat.format,
        depthFormat.type,
        null
      );

      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        framebuffer.useStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT,
        gl.TEXTURE_2D,
        depthTexture,
        0
      );
      framebuffer.depthTexture = depthTexture;
    }

    // Create separate framebuffer for antialiasing
    if (framebuffer.antialias) {
      framebuffer.colorRenderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.colorRenderbuffer);
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        Math.max(
          0,
          Math.min(framebuffer.antialiasSamples, gl.getParameter(gl.MAX_SAMPLES))
        ),
        colorFormat.internalFormat,
        framebuffer.width * framebuffer.density,
        framebuffer.height * framebuffer.density
      );

      if (framebuffer.useDepth) {
        const depthFormat = this._getFramebufferDepthFormat(framebuffer);
        framebuffer.depthRenderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depthRenderbuffer);
        gl.renderbufferStorageMultisample(
          gl.RENDERBUFFER,
          Math.max(
            0,
            Math.min(framebuffer.antialiasSamples, gl.getParameter(gl.MAX_SAMPLES))
          ),
          depthFormat.internalFormat,
          framebuffer.width * framebuffer.density,
          framebuffer.height * framebuffer.density
        );
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.aaFramebuffer);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.RENDERBUFFER,
        framebuffer.colorRenderbuffer
      );
      if (framebuffer.useDepth) {
        gl.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          framebuffer.useStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT,
          gl.RENDERBUFFER,
          framebuffer.depthRenderbuffer
        );
      }
    }

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
  _getFramebufferColorFormat(framebuffer) {
    let type, format, internalFormat;
    const gl = this.GL;

    if (framebuffer.format === constants.FLOAT) {
      type = gl.FLOAT;
    } else if (framebuffer.format === constants.HALF_FLOAT) {
      type = this.webglVersion === constants.WEBGL2
        ? gl.HALF_FLOAT
        : gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;
    } else {
      type = gl.UNSIGNED_BYTE;
    }

    if (framebuffer.channels === RGBA) {
      format = gl.RGBA;
    } else {
      format = gl.RGB;
    }

    if (this.webglVersion === constants.WEBGL2) {
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
    } else if (framebuffer.format === constants.HALF_FLOAT) {
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
  _getFramebufferDepthFormat(framebuffer) {
    let type, format, internalFormat;
    const gl = this.GL;

    if (framebuffer.useStencil) {
      if (framebuffer.depthFormat === constants.FLOAT) {
        type = gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
      } else if (this.webglVersion === constants.WEBGL2) {
        type = gl.UNSIGNED_INT_24_8;
      } else {
        type = gl.getExtension('WEBGL_depth_texture').UNSIGNED_INT_24_8_WEBGL;
      }
    } else {
      if (framebuffer.depthFormat === constants.FLOAT) {
        type = gl.FLOAT;
      } else {
        type = gl.UNSIGNED_INT;
      }
    }

    if (framebuffer.useStencil) {
      format = gl.DEPTH_STENCIL;
    } else {
      format = gl.DEPTH_COMPONENT;
    }

    if (framebuffer.useStencil) {
      if (framebuffer.depthFormat === constants.FLOAT) {
        internalFormat = gl.DEPTH32F_STENCIL8;
      } else if (this.webglVersion === constants.WEBGL2) {
        internalFormat = gl.DEPTH24_STENCIL8;
      } else {
        internalFormat = gl.DEPTH_STENCIL;
      }
    } else if (this.webglVersion === constants.WEBGL2) {
      if (framebuffer.depthFormat === constants.FLOAT) {
        internalFormat = gl.DEPTH_COMPONENT32F;
      } else {
        internalFormat = gl.DEPTH_COMPONENT24;
      }
    } else {
      internalFormat = gl.DEPTH_COMPONENT;
    }

    return { internalFormat, format, type };
  }

  _deleteFramebufferTexture(texture) {
    const gl = this.GL;
    gl.deleteTexture(texture.rawTexture().texture);
    this.textures.delete(texture);
  }

  deleteFramebufferTextures(framebuffer) {
    this._deleteFramebufferTexture(framebuffer.color)
    if (framebuffer.depth) this._deleteFramebufferTexture(framebuffer.depth);
    const gl = this.GL;
    if (framebuffer.colorRenderbuffer) gl.deleteRenderbuffer(framebuffer.colorRenderbuffer);
    if (framebuffer.depthRenderbuffer) gl.deleteRenderbuffer(framebuffer.depthRenderbuffer);
  }

  deleteFramebufferResources(framebuffer) {
    const gl = this.GL;
    gl.deleteFramebuffer(framebuffer.framebuffer);
    if (framebuffer.aaFramebuffer) {
      gl.deleteFramebuffer(framebuffer.aaFramebuffer);
    }
    if (framebuffer.depthRenderbuffer) {
      gl.deleteRenderbuffer(framebuffer.depthRenderbuffer);
    }
    if (framebuffer.colorRenderbuffer) {
      gl.deleteRenderbuffer(framebuffer.colorRenderbuffer);
    }
  }

  getFramebufferToBind(framebuffer) {
    if (framebuffer.antialias) {
      return framebuffer.aaFramebuffer;
    } else {
      return framebuffer.framebuffer;
    }
  }

  updateFramebufferTexture(framebuffer, property) {
    if (framebuffer.antialias) {
      const gl = this.GL;
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, framebuffer.aaFramebuffer);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, framebuffer.framebuffer);
      const partsToCopy = {
        colorTexture: [
          gl.COLOR_BUFFER_BIT,
          framebuffer.colorP5Texture.magFilter === constants.LINEAR ? gl.LINEAR : gl.NEAREST
        ],
      };
      if (framebuffer.useDepth) {
        partsToCopy.depthTexture = [
          gl.DEPTH_BUFFER_BIT,
          framebuffer.depthP5Texture.magFilter === constants.LINEAR ? gl.LINEAR : gl.NEAREST
        ];
      }
      const [flag, filter] = partsToCopy[property];
      gl.blitFramebuffer(
        0,
        0,
        framebuffer.width * framebuffer.density,
        framebuffer.height * framebuffer.density,
        0,
        0,
        framebuffer.width * framebuffer.density,
        framebuffer.height * framebuffer.density,
        flag,
        filter
      );

      const activeFbo = this.activeFramebuffer();
      this.bindFramebuffer(activeFbo);
    }
  }

  bindFramebuffer(framebuffer) {
    const gl = this.GL;
    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      framebuffer
        ? this.getFramebufferToBind(framebuffer)
        : null
    );
  }

  framebufferYScale() {
    // WebGL textures are upside-down compared to textures that come from
    // images and graphics. Framebuffer cameras need to invert their y
    // axes when being rendered to so that the texture comes out rightway up
    // when read in shaders or image().
    return -1;
  }

  readFramebufferPixels(framebuffer) {
    const gl = this.GL;
    const prevFramebuffer = this.activeFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);
    const colorFormat = this._getFramebufferColorFormat(framebuffer);
    const pixels = readPixelsWebGL(
      framebuffer.pixels,
      gl,
      framebuffer.framebuffer,
      0,
      0,
      framebuffer.width * framebuffer.density,
      framebuffer.height * framebuffer.density,
      colorFormat.format,
      colorFormat.type
    );
    this.bindFramebuffer(prevFramebuffer);
    return pixels;
  }

  readFramebufferPixel(framebuffer, x, y) {
    const colorFormat = this._getFramebufferColorFormat(framebuffer);
    return readPixelWebGL(
      this.GL,
      framebuffer.framebuffer,
      x,
      y,
      colorFormat.format,
      colorFormat.type
    );
  }

  readFramebufferRegion(framebuffer, x, y, w, h) {
    const gl = this.GL;
    const colorFormat = this._getFramebufferColorFormat(framebuffer);

    const rawData = readPixelsWebGL(
      undefined,
      gl,
      framebuffer.framebuffer,
      x * framebuffer.density,
      y * framebuffer.density,
      w * framebuffer.density,
      h * framebuffer.density,
      colorFormat.format,
      colorFormat.type
    );

    // Framebuffer data might be either a Uint8Array or Float32Array
    // depending on its format, and it may or may not have an alpha channel.
    // To turn it into an image, we have to normalize the data into a
    // Uint8ClampedArray with alpha.
    const fullData = new Uint8ClampedArray(
      w * h * framebuffer.density * framebuffer.density * 4
    );
    // Default channels that aren't in the framebuffer (e.g. alpha, if the
    // framebuffer is in RGB mode instead of RGBA) to 255
    fullData.fill(255);

    const channels = colorFormat.format === gl.RGB ? 3 : 4;
    for (let yPos = 0; yPos < h * framebuffer.density; yPos++) {
      for (let xPos = 0; xPos < w * framebuffer.density; xPos++) {
        for (let channel = 0; channel < 4; channel++) {
          const idx = (yPos * w * framebuffer.density + xPos) * 4 + channel;
          if (channel < channels) {
            // Find the index of this pixel in `rawData`, which might have a
            // different number of channels
            const rawDataIdx = channels === 4
              ? idx
              : (yPos * w * framebuffer.density + xPos) * channels + channel;
            fullData[idx] = rawData[rawDataIdx];
          }
        }
      }
    }

    // Create image from data
    const region = new Image(w * framebuffer.density, h * framebuffer.density);
    region.imageData = region.canvas.getContext('2d').createImageData(
      region.width,
      region.height
    );
    region.imageData.data.set(fullData);
    region.pixels = region.imageData.data;
    region.updatePixels();
    if (framebuffer.density !== 1) {
      region.pixelDensity(framebuffer.density);
    }
    return region;
  }

  updateFramebufferPixels(framebuffer) {
    const gl = this.GL;
    framebuffer.colorP5Texture.bindTexture();
    const colorFormat = this._getFramebufferColorFormat(framebuffer);

    const channels = colorFormat.format === gl.RGBA ? 4 : 3;
    const len = framebuffer.width * framebuffer.height * framebuffer.density * framebuffer.density * channels;
    const TypedArrayClass = colorFormat.type === gl.UNSIGNED_BYTE ? Uint8Array : Float32Array;

    if (!(framebuffer.pixels instanceof TypedArrayClass) || framebuffer.pixels.length !== len) {
      throw new Error(
        'The pixels array has not been set correctly. Please call loadPixels() before updatePixels().'
      );
    }

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      colorFormat.internalFormat,
      framebuffer.width * framebuffer.density,
      framebuffer.height * framebuffer.density,
      0,
      colorFormat.format,
      colorFormat.type,
      framebuffer.pixels
    );
    framebuffer.colorP5Texture.unbindTexture();
    framebuffer.dirty.colorTexture = false;

    const prevFramebuffer = this.activeFramebuffer();
    if (framebuffer.antialias) {
      // We need to make sure the antialiased framebuffer also has the updated
      // pixels so that if more is drawn to it, it goes on top of the updated
      // pixels instead of replacing them.
      // We can't blit the framebuffer to the multisampled antialias
      // framebuffer to leave both in the same state, so instead we have
      // to use image() to put the framebuffer texture onto the antialiased
      // framebuffer.
      framebuffer.begin();
      this.push();
      this.states.setValue('imageMode', constants.CORNER);
      this.setCamera(framebuffer.filterCamera);
      this.resetMatrix();
      this.states.setValue('strokeColor', null);
      this.clear();
      this._drawingFilter = true;
      this.image(
        framebuffer,
        0, 0,
        framebuffer.width, framebuffer.height,
        -this.width / 2, -this.height / 2,
        this.width, this.height
      );
      this._drawingFilter = false;
      this.pop();
      if (framebuffer.useDepth) {
        gl.clearDepth(1);
        gl.clear(gl.DEPTH_BUFFER_BIT);
      }
      framebuffer.end();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);
      if (framebuffer.useDepth) {
        gl.clearDepth(1);
        gl.clear(gl.DEPTH_BUFFER_BIT);
      }
      this.bindFramebuffer(prevFramebuffer);
    }
  }

  getNoiseShaderSnippet() {
    return noiseGLSL;
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
    return this._renderer._setAttributes(key, value);
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
