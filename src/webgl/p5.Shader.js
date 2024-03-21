/**
 * This module defines the p5.Shader class
 * @module 3D
 * @submodule Material
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Shader class for WEBGL Mode
 * @class p5.Shader
 * @param {p5.RendererGL} renderer an instance of p5.RendererGL that
 * will provide the GL context for this new p5.Shader
 * @param {String} vertSrc source code for the vertex shader (as a string)
 * @param {String} fragSrc source code for the fragment shader (as a string)
 */
p5.Shader = class Shader {
  constructor(renderer, vertSrc, fragSrc) {
    // TODO: adapt this to not take ids, but rather,
    // to take the source for a vertex and fragment shader
    // to enable custom shaders at some later date
    this._renderer = renderer;
    this._vertSrc = vertSrc;
    this._fragSrc = fragSrc;
    this._vertShader = -1;
    this._fragShader = -1;
    this._glProgram = 0;
    this._loadedAttributes = false;
    this.attributes = {};
    this._loadedUniforms = false;
    this.uniforms = {};
    this._bound = false;
    this.samplers = [];
  }

  /**
   * Creates, compiles, and links the shader based on its
   * sources for the vertex and fragment shaders (provided
   * to the constructor). Populates known attributes and
   * uniforms from the shader.
   * @chainable
   * @private
   */
  init() {
    if (this._glProgram === 0 /* or context is stale? */) {
      const gl = this._renderer.GL;

      // @todo: once custom shading is allowed,
      // friendly error messages should be used here to share
      // compiler and linker errors.

      //set up the shader by
      // 1. creating and getting a gl id for the shader program,
      // 2. compliling its vertex & fragment sources,
      // 3. linking the vertex and fragment shaders
      this._vertShader = gl.createShader(gl.VERTEX_SHADER);
      //load in our default vertex shader
      gl.shaderSource(this._vertShader, this._vertSrc);
      gl.compileShader(this._vertShader);
      // if our vertex shader failed compilation?
      if (!gl.getShaderParameter(this._vertShader, gl.COMPILE_STATUS)) {
        p5._friendlyError(
          `Yikes! An error occurred compiling the vertex shader:${gl.getShaderInfoLog(
            this._vertShader
          )}`
        );
        return null;
      }

      this._fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      //load in our material frag shader
      gl.shaderSource(this._fragShader, this._fragSrc);
      gl.compileShader(this._fragShader);
      // if our frag shader failed compilation?
      if (!gl.getShaderParameter(this._fragShader, gl.COMPILE_STATUS)) {
        p5._friendlyError(
          `Darn! An error occurred compiling the fragment shader:${gl.getShaderInfoLog(
            this._fragShader
          )}`
        );
        return null;
      }

      this._glProgram = gl.createProgram();
      gl.attachShader(this._glProgram, this._vertShader);
      gl.attachShader(this._glProgram, this._fragShader);
      gl.linkProgram(this._glProgram);
      if (!gl.getProgramParameter(this._glProgram, gl.LINK_STATUS)) {
        p5._friendlyError(
          `Snap! Error linking shader program: ${gl.getProgramInfoLog(
            this._glProgram
          )}`
        );
      }

      this._loadAttributes();
      this._loadUniforms();
    }
    return this;
  }

  /**
   * Shaders belong to the main canvas or a p5.Graphics. Once they are compiled,
   * they can only be used in the context they were compiled on.
   *
   * Use this method to make a new copy of a shader that gets compiled on a
   * different context.
   *
   * @param {p5|p5.Graphics} context The graphic or instance to copy this shader to.
   * Pass `window` if you need to copy to the main canvas.
   * @returns {p5.Shader} A new shader on the target context.
   *
   * @example
   * <div class='norender notest'>
   * <code>
   * let graphic = createGraphics(200, 200, WEBGL);
   * let graphicShader = graphic.createShader(vert, frag);
   * graphic.shader(graphicShader); // Use graphicShader on the graphic
   *
   * let mainShader = graphicShader.copyToContext(window);
   * shader(mainShader); // Use `mainShader` on the main canvas
   * </code>
   * </div>
   */
  copyToContext(context) {
    const shader = new p5.Shader(
      context._renderer,
      this._vertSrc,
      this._fragSrc
    );
    shader.ensureCompiledOnContext(context);
    return shader;
  }

  /**
   * @private
   */
  ensureCompiledOnContext(context) {
    if (this._glProgram !== 0 && this._renderer !== context._renderer) {
      throw new Error(
        'The shader being run is attached to a different context. Do you need to copy it to this context first with .copyToContext()?'
      );
    } else if (this._glProgram === 0) {
      this._renderer = context._renderer;
      this.init();
    }
  }

  /**
   * Queries the active attributes for this shader and loads
   * their names and locations into the attributes array.
   * @private
   */
  _loadAttributes() {
    if (this._loadedAttributes) {
      return;
    }

    this.attributes = {};

    const gl = this._renderer.GL;

    const numAttributes = gl.getProgramParameter(
      this._glProgram,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < numAttributes; ++i) {
      const attributeInfo = gl.getActiveAttrib(this._glProgram, i);
      const name = attributeInfo.name;
      const location = gl.getAttribLocation(this._glProgram, name);
      const attribute = {};
      attribute.name = name;
      attribute.location = location;
      attribute.index = i;
      attribute.type = attributeInfo.type;
      attribute.size = attributeInfo.size;
      this.attributes[name] = attribute;
    }

    this._loadedAttributes = true;
  }

  /**
   * Queries the active uniforms for this shader and loads
   * their names and locations into the uniforms array.
   * @private
   */
  _loadUniforms() {
    if (this._loadedUniforms) {
      return;
    }

    const gl = this._renderer.GL;

    // Inspect shader and cache uniform info
    const numUniforms = gl.getProgramParameter(
      this._glProgram,
      gl.ACTIVE_UNIFORMS
    );

    let samplerIndex = 0;
    for (let i = 0; i < numUniforms; ++i) {
      const uniformInfo = gl.getActiveUniform(this._glProgram, i);
      const uniform = {};
      uniform.location = gl.getUniformLocation(
        this._glProgram,
        uniformInfo.name
      );
      uniform.size = uniformInfo.size;
      let uniformName = uniformInfo.name;
      //uniforms that are arrays have their name returned as
      //someUniform[0] which is a bit silly so we trim it
      //off here. The size property tells us that its an array
      //so we dont lose any information by doing this
      if (uniformInfo.size > 1) {
        uniformName = uniformName.substring(0, uniformName.indexOf('[0]'));
      }
      uniform.name = uniformName;
      uniform.type = uniformInfo.type;
      uniform._cachedData = undefined;
      if (uniform.type === gl.SAMPLER_2D) {
        uniform.samplerIndex = samplerIndex;
        samplerIndex++;
        this.samplers.push(uniform);
      }

      uniform.isArray =
        uniformInfo.size > 1 ||
        uniform.type === gl.FLOAT_MAT3 ||
        uniform.type === gl.FLOAT_MAT4 ||
        uniform.type === gl.FLOAT_VEC2 ||
        uniform.type === gl.FLOAT_VEC3 ||
        uniform.type === gl.FLOAT_VEC4 ||
        uniform.type === gl.INT_VEC2 ||
        uniform.type === gl.INT_VEC4 ||
        uniform.type === gl.INT_VEC3;

      this.uniforms[uniformName] = uniform;
    }
    this._loadedUniforms = true;
  }

  compile() {
    // TODO
  }

  /**
   * initializes (if needed) and binds the shader program.
   * @private
   */
  bindShader() {
    this.init();
    if (!this._bound) {
      this.useProgram();
      this._bound = true;

      this._setMatrixUniforms();

      this.setUniform('uViewport', this._renderer._viewport);
    }
  }

  /**
   * @chainable
   * @private
   */
  unbindShader() {
    if (this._bound) {
      this.unbindTextures();
      //this._renderer.GL.useProgram(0); ??
      this._bound = false;
    }
    return this;
  }

  bindTextures() {
    const gl = this._renderer.GL;

    for (const uniform of this.samplers) {
      let tex = uniform.texture;
      if (tex === undefined) {
        // user hasn't yet supplied a texture for this slot.
        // (or there may not be one--maybe just lighting),
        // so we supply a default texture instead.
        tex = this._renderer._getEmptyTexture();
      }
      gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
      tex.bindTexture();
      tex.update();
      gl.uniform1i(uniform.location, uniform.samplerIndex);
    }
  }

  updateTextures() {
    for (const uniform of this.samplers) {
      const tex = uniform.texture;
      if (tex) {
        tex.update();
      }
    }
  }

  unbindTextures() {
    for (const uniform of this.samplers) {
      this.setUniform(uniform.name, this._renderer._getEmptyTexture());
    }
  }

  _setMatrixUniforms() {
    const viewMatrix = this._renderer._curCamera.cameraMatrix;
    const projectionMatrix = this._renderer.uPMatrix;
    const modelViewMatrix = this._renderer.uMVMatrix;

    const modelViewProjectionMatrix = modelViewMatrix.copy();
    modelViewProjectionMatrix.mult(projectionMatrix);

    if (this.isStrokeShader()) {
      if (this._renderer._curCamera.cameraType === 'default') {
        // strokes scale up as they approach camera, default
        this.setUniform('uPerspective', 1);
      } else {
        // strokes have uniform scale regardless of distance from camera
        this.setUniform('uPerspective', 0);
      }
    }
    this.setUniform('uViewMatrix', viewMatrix.mat4);
    this.setUniform('uProjectionMatrix', projectionMatrix.mat4);
    this.setUniform('uModelViewMatrix', modelViewMatrix.mat4);
    this.setUniform(
      'uModelViewProjectionMatrix',
      modelViewProjectionMatrix.mat4
    );
    if (this.uniforms.uNormalMatrix) {
      this._renderer.uNMatrix.inverseTranspose(this._renderer.uMVMatrix);
      this.setUniform('uNormalMatrix', this._renderer.uNMatrix.mat3);
    }
    if (this.uniforms.uCameraRotation) {
      this._renderer.curMatrix.inverseTranspose(this._renderer.
        _curCamera.cameraMatrix);
      this.setUniform('uCameraRotation', this._renderer.curMatrix.mat3);
    }
  }

  /**
   * @chainable
   * @private
   */
  useProgram() {
    const gl = this._renderer.GL;
    if (this._renderer._curShader !== this) {
      gl.useProgram(this._glProgram);
      this._renderer._curShader = this;
    }
    return this;
  }

  /**
   * Used to set the uniforms of a
   * <a href="#/p5.Shader">p5.Shader</a> object.
   *
   * Uniforms are used as a way to provide shader programs
   * (which run on the GPU) with values from a sketch
   * (which runs on the CPU).
   *
   * Here are some examples of uniforms you can make:
   * - booleans
   *   - Example: `setUniform('x', true)` becomes `uniform float x` with the value `1.0`
   * - numbers
   *   - Example: `setUniform('x', -2)` becomes `uniform float x` with the value `-2.0`
   * - arrays of numbers
   *   - Example: `setUniform('x', [0, 0.5, 1])` becomes `uniform vec3 x` with the value `vec3(0.0, 0.5, 1.0)`
   * - a p5.Image, p5.Graphics, p5.MediaElement, or p5.Texture
   *   - Example: `setUniform('x', img)` becomes `uniform sampler2D x`
   *
   * @chainable
   * @param {String} uniformName the name of the uniform.
   * Must correspond to the name used in the vertex and fragment shaders
   * @param {Boolean|Number|Number[]|p5.Image|p5.Graphics|p5.MediaElement|p5.Texture}
   * data The value to assign to the uniform. This can be
   * a boolean (true/false), a number, an array of numbers, or
   * an image (p5.Image, p5.Graphics, p5.MediaElement, p5.Texture)
   *
   * @example
   * <div modernizr='webgl'>
   * <code>
   * // Click within the image to toggle the value of uniforms
   * // Note: for an alternative approach to the same example,
   * // involving toggling between shaders please refer to:
   * // https://p5js.org/reference/#/p5/shader
   *
   * let grad;
   * let showRedGreen = false;
   *
   * function preload() {
   *   // note that we are using two instances
   *   // of the same vertex and fragment shaders
   *   grad = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
   * }
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   shader(grad);
   *   noStroke();
   *
   *   describe(
   *     'canvas toggles between a circular gradient of orange and blue vertically. and a circular gradient of red and green moving horizontally when mouse is clicked/pressed.'
   *   );
   * }
   *
   * function draw() {
   *   // update the offset values for each scenario,
   *   // moving the "grad" shader in either vertical or
   *   // horizontal direction each with differing colors
   *
   *   if (showRedGreen === true) {
   *     grad.setUniform('colorCenter', [1, 0, 0]);
   *     grad.setUniform('colorBackground', [0, 1, 0]);
   *     grad.setUniform('offset', [sin(millis() / 2000), 1]);
   *   } else {
   *     grad.setUniform('colorCenter', [1, 0.5, 0]);
   *     grad.setUniform('colorBackground', [0.226, 0, 0.615]);
   *     grad.setUniform('offset', [0, sin(millis() / 2000) + 1]);
   *   }
   *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
   * }
   *
   * function mouseClicked() {
   *   showRedGreen = !showRedGreen;
   * }
   * </code>
   * </div>
   *
   * @alt
   * canvas toggles between a circular gradient of orange and blue vertically. and a circular gradient of red and green moving horizontally when mouse is clicked/pressed.
   */
  setUniform(uniformName, data) {
    const uniform = this.uniforms[uniformName];
    if (!uniform) {
      return;
    }
    const gl = this._renderer.GL;

    if (uniform.isArray) {
      if (
        uniform._cachedData &&
        this._renderer._arraysEqual(uniform._cachedData, data)
      ) {
        return;
      } else {
        uniform._cachedData = data.slice(0);
      }
    } else if (uniform._cachedData && uniform._cachedData === data) {
      return;
    } else {
      if (Array.isArray(data)) {
        uniform._cachedData = data.slice(0);
      } else {
        uniform._cachedData = data;
      }
    }

    const location = uniform.location;

    this.useProgram();

    switch (uniform.type) {
      case gl.BOOL:
        if (data === true) {
          gl.uniform1i(location, 1);
        } else {
          gl.uniform1i(location, 0);
        }
        break;
      case gl.INT:
        if (uniform.size > 1) {
          data.length && gl.uniform1iv(location, data);
        } else {
          gl.uniform1i(location, data);
        }
        break;
      case gl.FLOAT:
        if (uniform.size > 1) {
          data.length && gl.uniform1fv(location, data);
        } else {
          gl.uniform1f(location, data);
        }
        break;
      case gl.FLOAT_MAT3:
        gl.uniformMatrix3fv(location, false, data);
        break;
      case gl.FLOAT_MAT4:
        gl.uniformMatrix4fv(location, false, data);
        break;
      case gl.FLOAT_VEC2:
        if (uniform.size > 1) {
          data.length && gl.uniform2fv(location, data);
        } else {
          gl.uniform2f(location, data[0], data[1]);
        }
        break;
      case gl.FLOAT_VEC3:
        if (uniform.size > 1) {
          data.length && gl.uniform3fv(location, data);
        } else {
          gl.uniform3f(location, data[0], data[1], data[2]);
        }
        break;
      case gl.FLOAT_VEC4:
        if (uniform.size > 1) {
          data.length && gl.uniform4fv(location, data);
        } else {
          gl.uniform4f(location, data[0], data[1], data[2], data[3]);
        }
        break;
      case gl.INT_VEC2:
        if (uniform.size > 1) {
          data.length && gl.uniform2iv(location, data);
        } else {
          gl.uniform2i(location, data[0], data[1]);
        }
        break;
      case gl.INT_VEC3:
        if (uniform.size > 1) {
          data.length && gl.uniform3iv(location, data);
        } else {
          gl.uniform3i(location, data[0], data[1], data[2]);
        }
        break;
      case gl.INT_VEC4:
        if (uniform.size > 1) {
          data.length && gl.uniform4iv(location, data);
        } else {
          gl.uniform4i(location, data[0], data[1], data[2], data[3]);
        }
        break;
      case gl.SAMPLER_2D:
        gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
        uniform.texture =
          data instanceof p5.Texture ? data : this._renderer.getTexture(data);
        gl.uniform1i(location, uniform.samplerIndex);
        if (uniform.texture.src.gifProperties) {
          uniform.texture.src._animateGif(this._renderer._pInst);
        }
        break;
      //@todo complete all types
    }
    return this;
  }

  /* NONE OF THIS IS FAST OR EFFICIENT BUT BEAR WITH ME
   *
   * these shader "type" query methods are used by various
   * facilities of the renderer to determine if changing
   * the shader type for the required action (for example,
   * do we need to load the default lighting shader if the
   * current shader cannot handle lighting?)
   *
   **/

  isLightShader() {
    return (
      this.attributes.aNormal !== undefined ||
      this.uniforms.uUseLighting !== undefined ||
      this.uniforms.uAmbientLightCount !== undefined ||
      this.uniforms.uDirectionalLightCount !== undefined ||
      this.uniforms.uPointLightCount !== undefined ||
      this.uniforms.uAmbientColor !== undefined ||
      this.uniforms.uDirectionalDiffuseColors !== undefined ||
      this.uniforms.uDirectionalSpecularColors !== undefined ||
      this.uniforms.uPointLightLocation !== undefined ||
      this.uniforms.uPointLightDiffuseColors !== undefined ||
      this.uniforms.uPointLightSpecularColors !== undefined ||
      this.uniforms.uLightingDirection !== undefined ||
      this.uniforms.uSpecular !== undefined
    );
  }

  isNormalShader() {
    return this.attributes.aNormal !== undefined;
  }

  isTextureShader() {
    return this.samplers.length > 0;
  }

  isColorShader() {
    return (
      this.attributes.aVertexColor !== undefined ||
      this.uniforms.uMaterialColor !== undefined
    );
  }

  isTexLightShader() {
    return this.isLightShader() && this.isTextureShader();
  }

  isStrokeShader() {
    return this.uniforms.uStrokeWeight !== undefined;
  }

  /**
   * @chainable
   * @private
   */
  enableAttrib(attr, size, type, normalized, stride, offset) {
    if (attr) {
      if (
        typeof IS_MINIFIED === 'undefined' &&
        this.attributes[attr.name] !== attr
      ) {
        console.warn(
          `The attribute "${attr.name}"passed to enableAttrib does not belong to this shader.`
        );
      }
      const loc = attr.location;
      if (loc !== -1) {
        const gl = this._renderer.GL;
        // Enable register even if it is disabled
        if (!this._renderer.registerEnabled.has(loc)) {
          gl.enableVertexAttribArray(loc);
          // Record register availability
          this._renderer.registerEnabled.add(loc);
        }
        this._renderer.GL.vertexAttribPointer(
          loc,
          size,
          type || gl.FLOAT,
          normalized || false,
          stride || 0,
          offset || 0
        );
      }
    }
    return this;
  }

  /**
   * Once all buffers have been bound, this checks to see if there are any
   * remaining active attributes, likely left over from previous renders,
   * and disables them so that they don't affect rendering.
   * @private
   */
  disableRemainingAttributes() {
    for (const location of this._renderer.registerEnabled.values()) {
      if (
        !Object.keys(this.attributes).some(
          key => this.attributes[key].location === location
        )
      ) {
        this._renderer.GL.disableVertexAttribArray(location);
        this._renderer.registerEnabled.delete(location);
      }
    }
  }
};

export default p5.Shader;
