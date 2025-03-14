import { Shader } from "../webgl/p5.Shader";
import { Texture } from "../webgl/p5.Texture";
import { Image } from "./p5.Image";
import * as constants from '../core/constants';

import filterGrayFrag from '../webgl/shaders/filters/gray.frag';
import filterErodeFrag from '../webgl/shaders/filters/erode.frag';
import filterDilateFrag from '../webgl/shaders/filters/dilate.frag';
import filterBlurFrag from '../webgl/shaders/filters/blur.frag';
import filterPosterizeFrag from '../webgl/shaders/filters/posterize.frag';
import filterOpaqueFrag from '../webgl/shaders/filters/opaque.frag';
import filterInvertFrag from '../webgl/shaders/filters/invert.frag';
import filterThresholdFrag from '../webgl/shaders/filters/threshold.frag';
import filterShaderVert from '../webgl/shaders/filters/default.vert';
import { filterParamDefaults } from "./const";


import filterBaseFrag from "../webgl/shaders/filters/base.frag";
import filterBaseVert from "../webgl/shaders/filters/base.vert";
import webgl2CompatibilityShader from "../webgl/shaders/webgl2Compatibility.glsl";

class FilterRenderer2D {
  /**
   * Creates a new FilterRenderer2D instance.
   * @param {p5} pInst - The p5.js instance.
   */
  constructor(pInst) {
    this.pInst = pInst;
    // Create a canvas for applying WebGL-based filters
    this.canvas = document.createElement('canvas');
    this.canvas.width = pInst.width;
    this.canvas.height = pInst.height;

    // Initialize the WebGL context
    let webglVersion = constants.WEBGL2;
    this.gl = this.canvas.getContext('webgl2');
    if (!this.gl) {
      webglVersion = constants.WEBGL;
      this.gl = this.canvas.getContext('webgl');
    }
    if (!this.gl) {
      console.error("WebGL not supported, cannot apply filter.");
      return;
    }
    // Minimal renderer object required by p5.Shader and p5.Texture
    this._renderer = {
      GL: this.gl,
      registerEnabled: new Set(),
      _curShader: null,
      _emptyTexture: null,
      webglVersion,
      states: {
        textureWrapX: this.gl.CLAMP_TO_EDGE,
        textureWrapY: this.gl.CLAMP_TO_EDGE,
      },
      _arraysEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      _getEmptyTexture: () => {
        if (!this._emptyTexture) {
          const im = new Image(1, 1);
          im.set(0, 0, 255);
          this._emptyTexture = new Texture(this._renderer, im);
        }
        return this._emptyTexture;
      },
    };

    this._baseFilterShader = undefined;

    // Store the fragment shader sources
    this.filterShaderSources = {
      [constants.BLUR]: filterBlurFrag,
      [constants.INVERT]: filterInvertFrag,
      [constants.THRESHOLD]: filterThresholdFrag,
      [constants.ERODE]: filterErodeFrag,
      [constants.GRAY]: filterGrayFrag,
      [constants.DILATE]: filterDilateFrag,
      [constants.POSTERIZE]: filterPosterizeFrag,
      [constants.OPAQUE]: filterOpaqueFrag,
    };

    // Store initialized shaders for each operation
    this.filterShaders = {};

    // These will be set by setOperation
    this.operation = null;
    this.filterParameter = 1;
    this.customShader = null;
    this._shader = null;

    // Create buffers once
    this.vertexBuffer = this.gl.createBuffer();
    this.texcoordBuffer = this.gl.createBuffer();

    // Set up the vertices and texture coordinates for a full-screen quad
    this.vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.texcoords = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);

    // Upload vertex data once
    this._bindBufferData(this.vertexBuffer, this.gl.ARRAY_BUFFER, this.vertices);

    // Upload texcoord data once
    this._bindBufferData(this.texcoordBuffer, this.gl.ARRAY_BUFFER, this.texcoords);
  }

  _webGL2CompatibilityPrefix(shaderType, floatPrecision) {
    let code = "";
    if (this._renderer.webglVersion === constants.WEBGL2) {
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

  baseFilterShader() {
    if (!this._baseFilterShader) {
      this._baseFilterShader = new Shader(
        this._renderer,
        this._webGL2CompatibilityPrefix("vert", "highp") +
          webgl2CompatibilityShader +
          filterBaseVert,
        this._webGL2CompatibilityPrefix("frag", "highp") +
          webgl2CompatibilityShader +
          filterBaseFrag,
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

  /**
   * Set the current filter operation and parameter. If a customShader is provided,
   * that overrides the operation-based shader.
   * @param {String} operation - The filter operation type (e.g., constants.BLUR).
   * @param {Number} filterParameter - The strength of the filter.
   * @param {p5.Shader} customShader - Optional custom shader.
   */
  setOperation(operation, filterParameter, customShader = null) {
    this.operation = operation;
    this.filterParameter = filterParameter;

    let useDefaultParam = operation in filterParamDefaults && filterParameter === undefined;
    if (useDefaultParam) {
      this.filterParameter = filterParamDefaults[operation];
    }

    this.customShader = customShader;
    this._initializeShader();
  }

  /**
   * Initializes or retrieves the shader program for the current operation.
   * If a customShader is provided, that is used.
   * Otherwise, returns a cached shader if available, or creates a new one, caches it, and sets it as current.
   */
  _initializeShader() {
    if (this.customShader) {
      this._shader = this.customShader;
      return;
    }

    if (!this.operation) {
      console.error("No operation set for FilterRenderer2D, cannot initialize shader.");
      return;
    }

    // If we already have a compiled shader for this operation, reuse it
    if (this.filterShaders[this.operation]) {
      this._shader = this.filterShaders[this.operation];
      return;
    }

    const fragShaderSrc = this.filterShaderSources[this.operation];
    if (!fragShaderSrc) {
      console.error("No shader available for this operation:", this.operation);
      return;
    }

    // Create and store the new shader
    const newShader = new Shader(this._renderer, filterShaderVert, fragShaderSrc);
    this.filterShaders[this.operation] = newShader;
    this._shader = newShader;
  }

  /**
   * Binds a buffer to the drawing context
   * when passed more than two arguments it also updates or initializes
   * the data associated with the buffer
   */
  _bindBufferData(buffer, target, values) {
    const gl = this.gl;
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, values, gl.STATIC_DRAW);
  }

  get canvasTexture() {
    if (!this._canvasTexture) {
      this._canvasTexture = new Texture(this._renderer, this.pInst.wrappedElt);
    }
    return this._canvasTexture;
  }

  /**
   * Prepares and runs the full-screen quad draw call.
   */
  _renderPass() {
    const gl = this.gl;
    this._shader.bindShader();
    const pixelDensity = this.pInst.pixelDensity ? this.pInst.pixelDensity() : 1;

    const texelSize = [
      1 / (this.pInst.width * pixelDensity),
      1 / (this.pInst.height * pixelDensity)
    ];

    const canvasTexture = this.canvasTexture;

    // Set uniforms for the shader
    this._shader.setUniform('tex0', canvasTexture);
    this._shader.setUniform('texelSize', texelSize);
    this._shader.setUniform('canvasSize', [this.pInst.width, this.pInst.height]);
    this._shader.setUniform('radius', Math.max(1, this.filterParameter));
    this._shader.setUniform('filterParameter', this.filterParameter);
    this._shader.setDefaultUniforms();
    
    this.pInst.states.setValue('rectMode', constants.CORNER);
    this.pInst.states.setValue('imageMode', constants.CORNER);
    this.pInst.blendMode(constants.BLEND);
    this.pInst.resetMatrix();


    const identityMatrix = [1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1];
    this._shader.setUniform('uModelViewMatrix', identityMatrix);
    this._shader.setUniform('uProjectionMatrix', identityMatrix);

    // Bind and enable vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this._shader.enableAttrib(this._shader.attributes.aPosition, 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    this._shader.enableAttrib(this._shader.attributes.aTexCoord, 2);

    this._shader.bindTextures();
    this._shader.disableRemainingAttributes();

    // Draw the quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Unbind the shader
    this._shader.unbindShader();
  }

  /**
   * Applies the current filter operation. If the filter requires multiple passes (e.g. blur),
   * it handles those internally. Make sure setOperation() has been called before applyFilter().
   */
  applyFilter() {
    if (!this._shader) {
      console.error("Cannot apply filter: shader not initialized.");
      return;
    }
    this.pInst.push();
    this.pInst.resetMatrix();
    // For blur, we typically do two passes: one horizontal, one vertical.
    if (this.operation === constants.BLUR && !this.customShader) {
      // Horizontal pass
      this._shader.setUniform('direction', [1, 0]);
      this._renderPass();

      // Draw the result onto itself
      this.pInst.clear();
      this.pInst.drawingContext.drawImage(this.canvas, 0, 0, this.pInst.width, this.pInst.height);

      // Vertical pass
      this._shader.setUniform('direction', [0, 1]);
      this._renderPass();

      this.pInst.clear();
      this.pInst.drawingContext.drawImage(this.canvas, 0, 0, this.pInst.width, this.pInst.height);
    } else {
      // Single-pass filters

      this._renderPass();
      this.pInst.clear();
      // con
      this.pInst.blendMode(constants.BLEND);


      this.pInst.drawingContext.drawImage(this.canvas, 0, 0, this.pInst.width, this.pInst.height);
    }
    this.pInst.pop();
  }
}

export default FilterRenderer2D;
