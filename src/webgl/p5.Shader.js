/**
 * This module defines the p5.Shader class
 * @module 3D
 * @submodule Material
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * A class to describe a shader program.
 *
 * Each `p5.Shader` object contains a shader program that runs on the graphics
 * processing unit (GPU). Shaders can process many pixels or vertices at the
 * same time, making them fast for many graphics tasks. They’re written in a
 * language called
 * <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
 * and run along with the rest of the code in a sketch.
 *
 * A shader program consists of two files, a vertex shader and a fragment
 * shader. The vertex shader affects where 3D geometry is drawn on the screen
 * and the fragment shader affects color. Once the `p5.Shader` object is
 * created, it can be used with the <a href="#/p5/shader">shader()</a>
 * function, as in `shader(myShader)`.
 *
 * Note: <a href="#/p5/createShader">createShader()</a>,
 * <a href="#/p5/createFilterShader">createFilterShader()</a>, and
 * <a href="#/p5/loadShader">loadShader()</a> are the recommended ways to
 * create an instance of this class.
 *
 * @class p5.Shader
 * @constructor
 * @param {p5.RendererGL} renderer WebGL context for this shader.
 * @param {String} vertSrc source code for the vertex shader program.
 * @param {String} fragSrc source code for the fragment shader program.
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
 * uniform mat4 uModelViewMatrix;
 * uniform mat4 uProjectionMatrix;
 *
 * attribute vec3 aPosition;
 * attribute vec2 aTexCoord;
 * varying vec2 vTexCoord;
 *
 * void main() {
 *   vTexCoord = aTexCoord;
 *   vec4 positionVec4 = vec4(aPosition, 1.0);
 *   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
 * }
 * `;
 *
 * // Create a string with the fragment shader program.
 * // The fragment shader is called for each pixel.
 * let fragSrc = `
 * precision highp float;
 *
 * void main() {
 *   // Set each pixel's RGBA value to yellow.
 *   gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
 * }
 * `;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create a p5.Shader object.
 *   let myShader = createShader(vertSrc, fragSrc);
 *
 *   // Apply the p5.Shader object.
 *   shader(myShader);
 *
 *   // Style the drawing surface.
 *   noStroke();
 *
 *   // Add a plane as a drawing surface.
 *   plane(100, 100);
 *
 *   describe('A yellow square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Note: A "uniform" is a global variable within a shader program.
 *
 * let mandelbrot;
 *
 * // Load the shader and create a p5.Shader object.
 * function preload() {
 *   mandelbrot = loadShader('assets/shader.vert', 'assets/shader.frag');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Use the p5.Shader object.
 *   shader(mandelbrot);
 *
 *   // Set the shader uniform p to an array.
 *   mandelbrot.setUniform('p', [-0.74364388703, 0.13182590421]);
 *
 *   describe('A fractal image zooms in and out of focus.');
 * }
 *
 * function draw() {
 *   // Set the shader uniform r to a value that oscillates between 0 and 2.
 *   mandelbrot.setUniform('r', sin(frameCount * 0.01) + 1);
 *
 *   // Add a quad as a display surface for the shader.
 *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
 * }
 * </code>
 * </div>
 */
p5.Shader = class {
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
   * @method init
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
   * Copies the shader from one drawing context to another.
   *
   * Each `p5.Shader` object must be compiled by calling
   * <a href="#/p5/shader">shader()</a> before it can run. Compilation happens
   * in a drawing context which is usually the main canvas or an instance of
   * <a href="#/p5.Graphics">p5.Graphics</a>. A shader can only be used in the
   * context where it was compiled. The `copyToContext()` method compiles the
   * shader again and copies it to another drawing context where it can be
   * reused.
   *
   * The parameter, `context`, is the drawing context where the shader will be
   * used. The shader can be copied to an instance of
   * <a href="#/p5.Graphics">p5.Graphics</a>, as in
   * `myShader.copyToContext(pg)`. The shader can also be copied from a
   * <a href="#/p5.Graphics">p5.Graphics</a> object to the main canvas using
   * the `window` variable, as in `myShader.copyToContext(window)`.
   *
   * Note: A <a href="#/p5.Shader">p5.Shader</a> object created with
   * <a href="#/p5/createShader">createShader()</a>,
   * <a href="#/p5/createFilterShader">createFilterShader()</a>, or
   * <a href="#/p5/loadShader">loadShader()</a>
   * can be used directly with a <a href="#/p5.Framebuffer">p5.Framebuffer</a>
   * object created with
   * <a href="#/p5/createFramebuffer">createFramebuffer()</a>. Both objects
   * have the same context as the main canvas.
   *
   * @method copyToContext
   * @param {p5|p5.Graphics} context WebGL context for the copied shader.
   * @returns {p5.Shader} new shader compiled for the target context.
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
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   *
   * attribute vec3 aPosition;
   * attribute vec2 aTexCoord;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vTexCoord = aTexCoord;
   *   vec4 positionVec4 = vec4(aPosition, 1.0);
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
   * }
   * `;
   *
   * // Create a string with the fragment shader program.
   * // The fragment shader is called for each pixel.
   * let fragSrc = `
   * precision mediump float;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vec2 uv = vTexCoord;
   *   vec3 color = vec3(uv.x, uv.y, min(uv.x + uv.y, 1.0));
   *   gl_FragColor = vec4(color, 1.0);\
   * }
   * `;
   *
   * let pg;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Create a p5.Shader object.
   *   let original = createShader(vertSrc, fragSrc);
   *
   *   // Compile the p5.Shader object.
   *   shader(original);
   *
   *   // Create a p5.Graphics object.
   *   pg = createGraphics(50, 50, WEBGL);
   *
   *   // Copy the original shader to the p5.Graphics object.
   *   let copied = original.copyToContext(pg);
   *
   *   // Apply the copied shader to the p5.Graphics object.
   *   pg.shader(copied);
   *
   *   // Style the display surface.
   *   pg.noStroke();
   *
   *   // Add a display surface for the shader.
   *   pg.plane(50, 50);
   *
   *   describe('A square with purple-blue gradient on its surface drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the p5.Graphics object to the main canvas.
   *   image(pg, -25, -25);
   * }
   * </code>
   * </div>
   *
   * <div class='notest'>
   * <code>
   * // Note: A "uniform" is a global variable within a shader program.
   *
   * // Create a string with the vertex shader program.
   * // The vertex shader is called for each vertex.
   * let vertSrc = `
   * precision highp float;
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   *
   * attribute vec3 aPosition;
   * attribute vec2 aTexCoord;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vTexCoord = aTexCoord;
   *   vec4 positionVec4 = vec4(aPosition, 1.0);
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
   * }
   * `;
   *
   * // Create a string with the fragment shader program.
   * // The fragment shader is called for each pixel.
   * let fragSrc = `
   * precision mediump float;
   *
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vec2 uv = vTexCoord;
   *   vec3 color = vec3(uv.x, uv.y, min(uv.x + uv.y, 1.0));
   *   gl_FragColor = vec4(color, 1.0);
   * }
   * `;
   *
   * let copied;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Graphics object.
   *   let pg = createGraphics(25, 25, WEBGL);
   *
   *   // Create a p5.Shader object.
   *   let original = pg.createShader(vertSrc, fragSrc);
   *
   *   // Compile the p5.Shader object.
   *   pg.shader(original);
   *
   *   // Copy the original shader to the main canvas.
   *   copied = original.copyToContext(window);
   *
   *   // Apply the copied shader to the main canvas.
   *   shader(copied);
   *
   *   describe('A rotating cube with a purple-blue gradient on its surface drawn against a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the x-, y-, and z-axes.
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   rotateZ(frameCount * 0.01);
   *
   *   // Draw the box.
   *   box(50);
   * }
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
   * @method _loadAttributes
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
   * @method _loadUniforms
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
   * @method bindShader
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
   * @method unbindShader
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
    const modelMatrix = this._renderer.uModelMatrix;
    const viewMatrix = this._renderer.uViewMatrix;
    const projectionMatrix = this._renderer.uPMatrix;
    const modelViewMatrix = (modelMatrix.copy()).mult(viewMatrix);
    this._renderer.uMVMatrix = modelViewMatrix;

    const modelViewProjectionMatrix = modelViewMatrix.copy();
    modelViewProjectionMatrix.mult(projectionMatrix);

    if (this.isStrokeShader()) {
      this.setUniform('uPerspective', this._renderer._curCamera.useLinePerspective ? 1 : 0);
    }
    this.setUniform('uViewMatrix', viewMatrix.mat4);
    this.setUniform('uProjectionMatrix', projectionMatrix.mat4);
    this.setUniform('uModelMatrix', modelMatrix.mat4);
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
      this._renderer.curMatrix.inverseTranspose(this._renderer.uViewMatrix);
      this.setUniform('uCameraRotation', this._renderer.curMatrix.mat3);
    }
  }

  /**
   * @method useProgram
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
   * Sets the shader’s uniform (global) variables.
   *
   * Shader programs run on the computer’s graphics processing unit (GPU).
   * They live in part of the computer’s memory that’s completely separate
   * from the sketch that runs them. Uniforms are global variables within a
   * shader program. They provide a way to pass values from a sketch running
   * on the CPU to a shader program running on the GPU.
   *
   * The first parameter, `uniformName`, is a string with the uniform’s name.
   * For the shader above, `uniformName` would be `'r'`.
   *
   * The second parameter, `data`, is the value that should be used to set the
   * uniform. For example, calling `myShader.setUniform('r', 0.5)` would set
   * the `r` uniform in the shader above to `0.5`. data should match the
   * uniform’s type. Numbers, strings, booleans, arrays, and many types of
   * images can all be passed to a shader with `setUniform()`.
   *
   * @method setUniform
   * @chainable
   * @param {String} uniformName name of the uniform. Must match the name
   *                             used in the vertex and fragment shaders.
   * @param {Boolean|Number|Number[]|p5.Image|p5.Graphics|p5.MediaElement|p5.Texture}
   * data value to assign to the uniform. Must match the uniform’s data type.
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
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   *
   * attribute vec3 aPosition;
   * attribute vec2 aTexCoord;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vTexCoord = aTexCoord;
   *   vec4 positionVec4 = vec4(aPosition, 1.0);
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
   * }
   * `;
   *
   * // Create a string with the fragment shader program.
   * // The fragment shader is called for each pixel.
   * let fragSrc = `
   * precision mediump float;
   *
   * uniform float r;
   *
   * void main() {
   *   gl_FragColor = vec4(r, 1.0, 1.0, 1.0);
   * }
   * `;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Shader object.
   *   let myShader = createShader(vertSrc, fragSrc);
   *
   *   // Apply the p5.Shader object.
   *   shader(myShader);
   *
   *   // Set the r uniform to 0.5.
   *   myShader.setUniform('r', 0.5);
   *
   *   // Style the drawing surface.
   *   noStroke();
   *
   *   // Add a plane as a drawing surface for the shader.
   *   plane(100, 100);
   *
   *   describe('A cyan square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Note: A "uniform" is a global variable within a shader program.
   *
   * // Create a string with the vertex shader program.
   * // The vertex shader is called for each vertex.
   * let vertSrc = `
   * precision highp float;
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   *
   * attribute vec3 aPosition;
   * attribute vec2 aTexCoord;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vTexCoord = aTexCoord;
   *   vec4 positionVec4 = vec4(aPosition, 1.0);
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
   * }
   * `;
   *
   * // Create a string with the fragment shader program.
   * // The fragment shader is called for each pixel.
   * let fragSrc = `
   * precision mediump float;
   *
   * uniform float r;
   *
   * void main() {
   *   gl_FragColor = vec4(r, 1.0, 1.0, 1.0);
   * }
   * `;
   *
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Shader object.
   *   myShader = createShader(vertSrc, fragSrc);
   *
   *   // Compile and apply the p5.Shader object.
   *   shader(myShader);
   *
   *   describe('A square oscillates color between cyan and white.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the drawing surface.
   *   noStroke();
   *
   *   // Update the r uniform.
   *   let nextR = 0.5 * (sin(frameCount * 0.01) + 1);
   *   myShader.setUniform('r', nextR);
   *
   *   // Add a plane as a drawing surface.
   *   plane(100, 100);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Note: A "uniform" is a global variable within a shader program.
   *
   * // Create a string with the vertex shader program.
   * // The vertex shader is called for each vertex.
   * let vertSrc = `
   * precision highp float;
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   *
   * attribute vec3 aPosition;
   * attribute vec2 aTexCoord;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vTexCoord = aTexCoord;
   *   vec4 positionVec4 = vec4(aPosition, 1.0);
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
   * }
   * `;
   *
   * // Create a string with the fragment shader program.
   * // The fragment shader is called for each pixel.
   * let fragSrc = `
   * precision highp float;
   * uniform vec2 p;
   * uniform float r;
   * const int numIterations = 500;
   * varying vec2 vTexCoord;
   *
   * void main() {
   *   vec2 c = p + gl_FragCoord.xy * r;
   *   vec2 z = c;
   *   float n = 0.0;
   *
   *   for (int i = numIterations; i > 0; i--) {
   *     if (z.x * z.x + z.y * z.y > 4.0) {
   *       n = float(i) / float(numIterations);
   *       break;
   *     }
   *
   *     z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
   *   }
   *
   *   gl_FragColor = vec4(
   *     0.5 - cos(n * 17.0) / 2.0,
   *     0.5 - cos(n * 13.0) / 2.0,
   *     0.5 - cos(n * 23.0) / 2.0,
   *     1.0
   *   );
   * }
   * `;
   *
   * let mandelbrot;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a p5.Shader object.
   *   mandelbrot = createShader(vertSrc, fragSrc);
   *
   *   // Compile and apply the p5.Shader object.
   *   shader(mandelbrot);
   *
   *   // Set the shader uniform p to an array.
   *   // p is the center point of the Mandelbrot image.
   *   mandelbrot.setUniform('p', [-0.74364388703, 0.13182590421]);
   *
   *   describe('A fractal image zooms in and out of focus.');
   * }
   *
   * function draw() {
   *   // Set the shader uniform r to a value that oscillates
   *   // between 0 and 0.005.
   *   // r is the size of the image in Mandelbrot-space.
   *   let radius = 0.005 * (sin(frameCount * 0.01) + 1);
   *   mandelbrot.setUniform('r', radius);
   *
   *   // Style the drawing surface.
   *   noStroke();
   *
   *   // Add a plane as a drawing surface.
   *   plane(100, 100);
   * }
   * </code>
   * </div>
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
    return [
      this.attributes.aNormal ,
      this.uniforms.uUseLighting ,
      this.uniforms.uAmbientLightCount ,
      this.uniforms.uDirectionalLightCount ,
      this.uniforms.uPointLightCount ,
      this.uniforms.uAmbientColor ,
      this.uniforms.uDirectionalDiffuseColors ,
      this.uniforms.uDirectionalSpecularColors ,
      this.uniforms.uPointLightLocation ,
      this.uniforms.uPointLightDiffuseColors ,
      this.uniforms.uPointLightSpecularColors ,
      this.uniforms.uLightingDirection ,
      this.uniforms.uSpecular
    ].some(x => x !== undefined);
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
   * @method enableAttrib
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
   * @method disableRemainingAttributes
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
