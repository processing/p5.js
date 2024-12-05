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

class FilterRenderer2D {
  constructor(pInst, operation) {
    this.pInst = pInst;
    this.operation = operation;
    // creating webgl context
    this.canvas = document.createElement('canvas');
    this.canvas.width = pInst.width;
    this.canvas.height = pInst.height;
    this.gl = this.canvas.getContext('webgl');

    // if not able to create, return
    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    // Set up the minimal renderer required by p5.Shader and p5.Texture        
    this._renderer = {
      GL: this.gl,
      registerEnabled : new Set(),
      _curShader: null,
      _emptyTexture: null,
      webglVersion: 'WEBGL',
      states: {
        textureWrapX: this.gl.CLAMP_TO_EDGE,
        textureWrapY: this.gl.CLAMP_TO_EDGE,
      },
      _arraysEqual: function(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
      },
      _getEmptyTexture: () => {
        if (!this._emptyTexture) {
          const im = new Image(1, 1);
          im.set(0, 0, 255);
          this._emptyTexture = new Texture(this._renderer, im);
        }
        return this._emptyTexture;
      },
    };
  }

   filterShaders = {
    [constants.BLUR] : filterBlurFrag,
    [constants.INVERT]: filterInvertFrag,
    [constants.THRESHOLD]: filterThresholdFrag, 
    [constants.ERODE]: filterErodeFrag,
    [constants.GRAY] : filterGrayFrag,
    [constants.DILATE]: filterDilateFrag,       
    [constants.POSTERIZE]: filterPosterizeFrag, 
    [constants.OPAQUE]: filterOpaqueFrag,        
  };
  
  
  vertSrc() {
    return `
    attribute vec2 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      vTexCoord = aTexCoord;
    }
    `;
  }

  // binding buffer
  _bindBuffer(buffer, target, values, type, usage) {
    const gl = this.gl;
    if (!target) target = gl.ARRAY_BUFFER;
    gl.bindBuffer(target, buffer);
    if (values !== undefined) {
      let data = values;
      if (!(data instanceof (type || Float32Array))) {
        data = new (type || Float32Array)(data);
      }
      gl.bufferData(target, data, usage || gl.STATIC_DRAW);
    }
  }
  
  render() {
    // console.log(this.pInst._renderer.pixelDensity());
    const gl = this.gl;
    // console.log(this.pInst.width);
    let texelSize = [
      1 / (this.pInst.width * this.pInst._renderer.pixelDensity()),
      1 / (this.pInst.height * this.pInst._renderer.pixelDensity())
    ];

    // console.log(texelSize);
    // Create and initialize the shader
    if (!this._shader) {
      // console.log(this.filterShaders['invert']);
      this._shader = new Shader(this._renderer, this.vertSrc(), this.filterShaders[this.operation]);
    }
    this._shader.bindShader();

    // Create a texture from the main p5.js canvas
    // console.log(this.pInst._renderer.wrappedElt)
    const canvasTexture = new Texture(this._renderer, this.pInst._renderer.wrappedElt);
    // canvasTexture.update(); // Ensure the texture is updated with the latest canvas content
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const texcoords = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);

    const vertexBuffer = gl.createBuffer();
    this._bindBuffer(vertexBuffer, gl.ARRAY_BUFFER, vertices);

    this._shader.enableAttrib(this._shader.attributes.aPosition, 2);
    // Create and bind the vertex buffer for positions
    const texcoordBuffer = gl.createBuffer();

    this._bindBuffer(texcoordBuffer, gl.ARRAY_BUFFER, texcoords);
    // Create and bind the texture coordinate buffer
    this._shader.enableAttrib(this._shader.attributes.aTexCoord, 2);

    // Set the texture uniform
    this._shader.setUniform('tex0', canvasTexture);
    this._shader.setUniform('texelSize', texelSize);
    this._shader.setUniform('canvasSize', [this.pInst.width, this.pInst.height]);
    this._shader.setUniform('direction', [1, 0]);
    this._shader.setUniform('radius', 5);
    
    // Clear the canvas and draw the quad
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the quad (two triangles)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Unbind the shader and texture
    this._shader.unbindShader();
    canvasTexture.unbindTexture();
  }
}

export default FilterRenderer2D;
