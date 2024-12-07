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

class FilterRenderer2D {
  /**
   * Creates a new FilterRenderer2D instance.
   * @param {p5} pInst - The p5.js instance.
   * @param {string} operation - The filter operation type (e.g., constants.BLUR).
   * @param {string} filterParameter - The strength of applying filter.
   */
  constructor(pInst, operation, filterParameter) {
    this.pInst = pInst;
    this.filterParameter = filterParameter;    
    this.operation = operation;

    // Create a canvas for applying WebGL-based filters
    this.canvas = document.createElement('canvas');
    this.canvas.width = pInst.width;
    this.canvas.height = pInst.height;

    // Initialize the WebGL context
    this.gl = this.canvas.getContext('webgl');
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
      webglVersion: 'WEBGL',
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

    // Fragment shaders mapped to filter operations
    this.filterShaders = {
      [constants.BLUR]: filterBlurFrag,
      [constants.INVERT]: filterInvertFrag,
      [constants.THRESHOLD]: filterThresholdFrag,
      [constants.ERODE]: filterErodeFrag,
      [constants.GRAY]: filterGrayFrag,
      [constants.DILATE]: filterDilateFrag,
      [constants.POSTERIZE]: filterPosterizeFrag,
      [constants.OPAQUE]: filterOpaqueFrag,
    };

    this._shader = null;
    this._initializeShader();
  }
  
  /**
   * Initializes the shader program if it hasn't been already.
   */
  _initializeShader() {
    if (this._shader) return; // Already initialized

    const fragShaderSrc = this.filterShaders[this.operation];
    if (!fragShaderSrc) {
      console.error("No shader available for this operation:", this.operation);
      return;
    }

    this._shader = new Shader(this._renderer, filterShaderVert, fragShaderSrc);
  }

  /**
   * Binds a buffer to the drawing context
   * when passed more than two arguments it also updates or initializes
   * the data associated with the buffer
   */
  _bindBufferData(buffer, target, values, type, usage) {
    const gl = this.gl;
    gl.bindBuffer(target, buffer);
    let data = values instanceof (type || Float32Array) ? values : new (type || Float32Array)(values);
    gl.bufferData(target, data, usage || gl.STATIC_DRAW);
  }

  /**
   * Prepares and runs the full-screen quad draw call.
   */
  _renderPass() {
    const gl = this.gl;
    this._shader.bindShader();

    const pixelDensity = this.pInst._renderer.pixelDensity ? this.pInst._renderer.pixelDensity() : 1;

    const texelSize = [
      1 / (this.pInst.width * pixelDensity),
      1 / (this.pInst.height * pixelDensity)
    ];

    const canvasTexture = new Texture(this._renderer, this.pInst._renderer.wrappedElt);

    // Set uniforms for the shader
    this._shader.setUniform('tex0', canvasTexture);
    this._shader.setUniform('texelSize', texelSize);
    this._shader.setUniform('canvasSize', [this.pInst.width, this.pInst.height]);
    this._shader.setUniform('radius', Math.max(1, this.filterParameter));

    // Identity matrices for projection/model-view (unsure)

    // TODO: FIX IT
    const identityMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    this._shader.setUniform('uModelViewMatrix', identityMatrix);
    this._shader.setUniform('uProjectionMatrix', identityMatrix);

    // Set up the vertices and texture coordinates for a full-screen quad
    const vertices = [-1, -1, 1, -1, -1, 1, 1, 1];
    const texcoords = [0, 1, 1, 1, 0, 0, 1, 0];

    // Create and bind buffers
    const vertexBuffer = gl.createBuffer();
    this._bindBufferData(vertexBuffer, gl.ARRAY_BUFFER, vertices, Float32Array, gl.STATIC_DRAW);
    this._shader.enableAttrib(this._shader.attributes.aPosition, 2);

    const texcoordBuffer = gl.createBuffer();
    this._bindBufferData(texcoordBuffer, gl.ARRAY_BUFFER, texcoords, Float32Array, gl.STATIC_DRAW);
    this._shader.enableAttrib(this._shader.attributes.aTexCoord, 2);

    // Draw the quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Unbind the shader and texture
    this._shader.unbindShader();
  }

  /**
   * Applies the filter operation. If the filter requires multiple passes (e.g. blur),
   * it handles those internally.
   */
  applyFilter() {
    if (!this._shader) {
      console.error("Cannot apply filter: shader not initialized.");
      return;
    }

    // For blur, we typically do two passes: one horizontal, one vertical.
    if (this.operation === constants.BLUR) {
      // Horizontal pass
      this._renderPass();
      this._shader.setUniform('direction', [0,1]);
      
      // Draw the result onto itself
      this.pInst.clear();
      this.pInst.drawingContext.drawImage(this.canvas, 0, 0, this.pInst.width, this.pInst.height);

      // Vertical pass
      this._renderPass();
      this._shader.setUniform('direction', [1,0]);
      
      this.pInst.clear();
      this.pInst.drawingContext.drawImage(this.canvas, 0, 0, this.pInst.width, this.pInst.height);
    } else {
      // Single-pass filters
      this._renderPass();
      this.pInst.clear();
      this.pInst.drawingContext.drawImage(this.canvas, 0, 0, this.pInst.width, this.pInst.height);
    }
  }
}

export default FilterRenderer2D;
