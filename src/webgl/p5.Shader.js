/**
 * This module defines the p5.Shader class
 * @module 3D
 * @submodule Material
 * @for p5
 * @requires core
 */

import { Texture } from './p5.Texture';

class Shader {
  constructor(renderer, vertSrc, fragSrc, options = {}) {
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
    this.hooks = {
      // These should be passed in by `.modify()` instead of being manually
      // passed in.

      // Stores uniforms + default values.
      uniforms: options.uniforms || {},

      // Stores custom uniform + helper declarations as a string.
      declarations: options.declarations,

      // Stores helper functions to prepend to shaders.
      helpers: options.helpers || {},

      // Stores the hook implementations
      vertex: options.vertex || {},
      fragment: options.fragment || {},

      // Stores whether or not the hook implementation has been modified
      // from the default. This is supplied automatically by calling
      // yourShader.modify(...).
      modified: {
        vertex: (options.modified && options.modified.vertex) || {},
        fragment: (options.modified && options.modified.fragment) || {}
      }
    };
  }

  hookTypes(hookName) {
    let fullSrc = this._vertSrc;
    let body = this.hooks.vertex[hookName];
    if (!body) {
      body = this.hooks.fragment[hookName];
      fullSrc = this._fragSrc;
    }
    if (!body) {
      throw new Error(`Can't find hook ${hookName}!`);
    }
    const nameParts = hookName.split(/\s+/g);
    const functionName = nameParts.pop();
    const returnType = nameParts.pop();
    const returnQualifiers = [...nameParts];

    const parameterMatch = /\(([^\)]*)\)/.exec(body);
    if (!parameterMatch) {
      throw new Error(`Couldn't find function parameters in hook body:\n${body}`);
    }

    const structProperties = structName => {
      const structDefMatch = new RegExp(`struct\\s+${structName}\\s*\{([^\}]*)\}`).exec(fullSrc);
      if (!structDefMatch) return undefined;

      const properties = [];
      for (const defSrc of structDefMatch[1].split(';')) {
        // E.g. `int var1, var2;` or `MyStruct prop;`
        const parts = defSrc.trim().split(/\s+|,/g);
        const typeName = parts.shift();
        const names = [...parts];
        const typeProperties = structProperties(typeName);
        for (const name of names) {
          properties.push({
            name,
            type: {
              typeName,
              qualifiers: [],
              properties: typeProperties,
            },
          });
        }
      }
      return properties;
    };

    const parameters = parameterMatch[1].split(',').map(paramString => {
      // e.g. `int prop` or `in sampler2D prop` or `const float prop`
      const parts = paramString.trim().split(/\s+/g);
      const name = parts.pop();
      const typeName = parts.pop();
      const qualifiers = [...parts];
      const properties = structProperties(typeName);
      return {
        name,
        type: {
          typeName,
          qualifiers,
          properties,
        }
      }
    });

    return {
      name: functionName,
      returnType: {
        typeName: returnType,
        qualifiers: returnQualifiers,
        properties: structProperties(returnType)
      },
      parameters
    };
  }

  shaderSrc(src, shaderType) {
    const main = 'void main';
    let [preMain, postMain] = src.split(main);

    let hooks = '';
    let defines = '';
    for (const key in this.hooks.uniforms) {
      hooks += `uniform ${key};\n`;
    }
    if (this.hooks.declarations) {
      hooks += this.hooks.declarations + '\n';
    }
    if (this.hooks[shaderType].declarations) {
      hooks += this.hooks[shaderType].declarations + '\n';
    }
    for (const hookDef in this.hooks.helpers) {
      hooks += `${hookDef}${this.hooks.helpers[hookDef]}\n`;
    }
    for (const hookDef in this.hooks[shaderType]) {
      if (hookDef === 'declarations') continue;
      const [hookType, hookName] = hookDef.split(' ');

      // Add a #define so that if the shader wants to use preprocessor directives to
      // optimize away the extra function calls in main, it can do so
      if (this.hooks.modified[shaderType][hookDef]) {
        defines += '#define AUGMENTED_HOOK_' + hookName + '\n';
      }

      hooks +=
        hookType + ' HOOK_' + hookName + this.hooks[shaderType][hookDef] + '\n';
    }

    // Allow shaders to specify the location of hook #define statements. Normally these
    // go after function definitions, but one might want to have them defined earlier
    // in order to only conditionally make uniforms.
    if (preMain.indexOf('#define HOOK_DEFINES') !== -1) {
      preMain = preMain.replace('#define HOOK_DEFINES', '\n' + defines + '\n');
      defines = '';
    }

    return preMain + '\n' + defines + hooks + main + postMain;
  }

  /**
   * Shaders are written in <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders">GLSL</a>, but
   * there are different versions of GLSL that it might be written in.
   *
   * Calling this method on a `p5.Shader` will return the GLSL version it uses, either `100 es` or `300 es`.
   * WebGL 1 shaders will only use `100 es`, and WebGL 2 shaders may use either.
   *
   * @returns {String} The GLSL version used by the shader.
   */
  version() {
    const match = /#version (.+)$/.exec(this.vertSrc());
    if (match) {
      return match[1];
    } else {
      return '100 es';
    }
  }

  vertSrc() {
    return this.shaderSrc(this._vertSrc, 'vertex');
  }

  fragSrc() {
    return this.shaderSrc(this._fragSrc, 'fragment');
  }

  /**
   * Logs the hooks available in this shader, and their current implementation.
   *
   * Each shader may let you override bits of its behavior. Each bit is called
   * a *hook.* A hook is either for the *vertex* shader, if it affects the
   * position of vertices, or in the *fragment* shader, if it affects the pixel
   * color. This method logs those values to the console, letting you know what
   * you are able to use in a call to
   * <a href="#/p5.Shader/modify">`modify()`</a>.
   *
   * For example, this shader will produce the following output:
   *
   * ```js
   * myShader = baseMaterialShader().modify({
   *   declarations: 'uniform float time;',
   *   'vec3 getWorldPosition': `(vec3 pos) {
   *     pos.y += 20. * sin(time * 0.001 + pos.x * 0.05);
   *     return pos;
   *   }`
   * });
   * myShader.inspectHooks();
   * ```
   *
   * ```
   * ==== Vertex shader hooks: ====
   * void beforeVertex() {}
   * vec3 getLocalPosition(vec3 position) { return position; }
   * [MODIFIED] vec3 getWorldPosition(vec3 pos) {
   *       pos.y += 20. * sin(time * 0.001 + pos.x * 0.05);
   *       return pos;
   *     }
   * vec3 getLocalNormal(vec3 normal) { return normal; }
   * vec3 getWorldNormal(vec3 normal) { return normal; }
   * vec2 getUV(vec2 uv) { return uv; }
   * vec4 getVertexColor(vec4 color) { return color; }
   * void afterVertex() {}
   *
   * ==== Fragment shader hooks: ====
   * void beforeFragment() {}
   * Inputs getPixelInputs(Inputs inputs) { return inputs; }
   * vec4 combineColors(ColorComponents components) {
   *                 vec4 color = vec4(0.);
   *                 color.rgb += components.diffuse * components.baseColor;
   *                 color.rgb += components.ambient * components.ambientColor;
   *                 color.rgb += components.specular * components.specularColor;
   *                 color.rgb += components.emissive;
   *                 color.a = components.opacity;
   *                 return color;
   *               }
   * vec4 getFinalColor(vec4 color) { return color; }
   * void afterFragment() {}
   * ```
   *
   * @beta
   */
  inspectHooks() {
    console.log('==== Vertex shader hooks: ====');
    for (const key in this.hooks.vertex) {
      console.log(
        (this.hooks.modified.vertex[key] ? '[MODIFIED] ' : '') +
          key +
          this.hooks.vertex[key]
      );
    }
    console.log('');
    console.log('==== Fragment shader hooks: ====');
    for (const key in this.hooks.fragment) {
      console.log(
        (this.hooks.modified.fragment[key] ? '[MODIFIED] ' : '') +
          key +
          this.hooks.fragment[key]
      );
    }
    console.log('');
    console.log('==== Helper functions: ====');
    for (const key in this.hooks.helpers) {
      console.log(key + this.hooks.helpers[key]);
    }
  }

  /**
   * Returns a new shader, based on the original, but with custom snippets
   * of shader code replacing default behaviour.
   *
   * Each shader may let you override bits of its behavior. Each bit is called
   * a *hook.* A hook is either for the *vertex* shader, if it affects the
   * position of vertices, or in the *fragment* shader, if it affects the pixel
   * color. You can inspect the different hooks available by calling
   * <a href="#/p5.Shader/inspectHooks">`yourShader.inspectHooks()`</a>. You can
   * also read the reference for the default material, normal material, color, line, and point shaders to
   * see what hooks they have available.
   *
   * `modify()` takes one parameter, `hooks`, an object with the hooks you want
   * to override. Each key of the `hooks` object is the name
   * of a hook, and the value is a string with the GLSL code for your hook.
   *
   * If you supply functions that aren't existing hooks, they will get added at the start of
   * the shader as helper functions so that you can use them in your hooks.
   *
   * To add new <a href="#/p5.Shader/setUniform">uniforms</a> to your shader, you can pass in a `uniforms` object containing
   * the type and name of the uniform as the key, and a default value or function returning
   * a default value as its value. These will be automatically set when the shader is set
   * with `shader(yourShader)`.
   *
   * You can also add a `declarations` key, where the value is a GLSL string declaring
   * custom uniform variables, globals, and functions shared
   * between hooks. To add declarations just in a vertex or fragment shader, add
   * `vertexDeclarations` and `fragmentDeclarations` keys.
   *
   * @beta
   * @param {Object} [hooks] The hooks in the shader to replace.
   * @returns {p5.Shader}
   *
   * @example
   * <div modernizr='webgl'>
   * <code>
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = baseMaterialShader().modify({
   *     uniforms: {
   *       'float time': () => millis() // Uniform for time
   *     },
   *     'Vertex getWorldInputs': `(Vertex inputs) {
   *       inputs.position.y +=
   *         20. * sin(time * 0.001 + inputs.position.x * 0.05);
   *       return inputs;
   *     }`
   *   });
   * }
   *
   * function draw() {
   *   background(255);
   *   shader(myShader); // Apply the custom shader
   *   lights();         // Enable lighting
   *   noStroke();       // Disable stroke
   *   fill('red');      // Set fill color to red
   *   sphere(50);       // Draw a sphere with the shader applied
   * }
   * </code>
   * </div>
   *
   * @example
   * <div modernizr='webgl'>
   * <code>
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = baseMaterialShader().modify({
   *     // Manually specifying a uniform
   *     declarations: 'uniform float time;',
   *     'Vertex getWorldInputs': `(Vertex inputs) {
   *       inputs.position.y +=
   *         20. * sin(time * 0.001 + inputs.position.x * 0.05);
   *       return inputs;
   *     }`
   *   });
   * }
   *
   * function draw() {
   *   background(255);
   *   shader(myShader);
   *   myShader.setUniform('time', millis());
   *   lights();
   *   noStroke();
   *   fill('red');
   *   sphere(50);
   * }
   * </code>
   * </div>
   */
  modify(hooks) {
    // p5._validateParameters('p5.Shader.modify', arguments);
    const newHooks = {
      vertex: {},
      fragment: {},
      helpers: {}
    };
    for (const key in hooks) {
      if (key === 'declarations') continue;
      if (key === 'uniforms') continue;
      if (key === 'vertexDeclarations') {
        newHooks.vertex.declarations =
          (newHooks.vertex.declarations || '') + '\n' + hooks[key];
      } else if (key === 'fragmentDeclarations') {
        newHooks.fragment.declarations =
          (newHooks.fragment.declarations || '') + '\n' + hooks[key];
      } else if (this.hooks.vertex[key]) {
        newHooks.vertex[key] = hooks[key];
      } else if (this.hooks.fragment[key]) {
        newHooks.fragment[key] = hooks[key];
      } else {
        newHooks.helpers[key] = hooks[key];
      }
    }
    const modifiedVertex = Object.assign({}, this.hooks.modified.vertex);
    const modifiedFragment = Object.assign({}, this.hooks.modified.fragment);
    for (const key in newHooks.vertex || {}) {
      if (key === 'declarations') continue;
      modifiedVertex[key] = true;
    }
    for (const key in newHooks.fragment || {}) {
      if (key === 'declarations') continue;
      modifiedFragment[key] = true;
    }

    return new Shader(this._renderer, this._vertSrc, this._fragSrc, {
      declarations:
        (this.hooks.declarations || '') + '\n' + (hooks.declarations || ''),
      uniforms: Object.assign({}, this.hooks.uniforms, hooks.uniforms || {}),
      fragment: Object.assign({}, this.hooks.fragment, newHooks.fragment || {}),
      vertex: Object.assign({}, this.hooks.vertex, newHooks.vertex || {}),
      helpers: Object.assign({}, this.hooks.helpers, newHooks.helpers || {}),
      modified: {
        vertex: modifiedVertex,
        fragment: modifiedFragment
      }
    });
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
      gl.shaderSource(this._vertShader, this.vertSrc());
      gl.compileShader(this._vertShader);
      // if our vertex shader failed compilation?
      if (!gl.getShaderParameter(this._vertShader, gl.COMPILE_STATUS)) {
        const glError = gl.getShaderInfoLog(this._vertShader);
        if (typeof IS_MINIFIED !== 'undefined') {
          console.error(glError);
        } else {
          throw glError;
          p5._friendlyError(
            `Yikes! An error occurred compiling the vertex shader:${glError}`
          );
        }
        return null;
      }

      this._fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      //load in our material frag shader
      gl.shaderSource(this._fragShader, this.fragSrc());
      gl.compileShader(this._fragShader);
      // if our frag shader failed compilation?
      if (!gl.getShaderParameter(this._fragShader, gl.COMPILE_STATUS)) {
        const glError = gl.getShaderInfoLog(this._fragShader);
        if (typeof IS_MINIFIED !== 'undefined') {
          console.error(glError);
        } else {
          throw glError;
          p5._friendlyError(
            `Darn! An error occurred compiling the fragment shader:${glError}`
          );
        }
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
   * @private
   */
  setDefaultUniforms() {
    for (const key in this.hooks.uniforms) {
      const [, name] = key.split(' ');
      const initializer = this.hooks.uniforms[key];
      let value;
      if (initializer instanceof Function) {
        value = initializer();
      } else {
        value = initializer;
      }

      if (value !== undefined && value !== null) {
        this.setUniform(name, value);
      }
    }
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
   * the `p5.instance` variable, as in `myShader.copyToContext(p5.instance)`.
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
   *   copied = original.copyToContext(p5.instance);
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
    const shader = new Shader(
      context._renderer,
      this._vertSrc,
      this._fragSrc
    );
    shader.ensureCompiledOnContext(context._renderer);
    return shader;
  }

  /**
   * @private
   */
  ensureCompiledOnContext(context) {
    if (this._glProgram !== 0 && this._renderer !== context) {
      throw new Error(
        'The shader being run is attached to a different context. Do you need to copy it to this context first with .copyToContext()?'
      );
    } else if (this._glProgram === 0) {
      this._renderer = context?._renderer?.filterRenderer?._renderer || context;
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
    }
  }

  /**
   * @chainable
   * @private
   */
  unbindShader() {
    if (this._bound) {
      this.unbindTextures();
      this._bound = false;
    }
    return this;
  }

  bindTextures() {
    const gl = this._renderer.GL;

    const empty = this._renderer._getEmptyTexture();

    for (const uniform of this.samplers) {
      let tex = uniform.texture;
      if (
        tex === undefined ||
        (
          false &&
          tex.isFramebufferTexture &&
          !tex.src.framebuffer.antialias &&
          tex.src.framebuffer === this._renderer.activeFramebuffer()
        )
      ) {
        // user hasn't yet supplied a texture for this slot.
        // (or there may not be one--maybe just lighting),
        // so we supply a default texture instead.
        uniform.texture = tex = empty;
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
    const gl = this._renderer.GL;
    const empty = this._renderer._getEmptyTexture();
    for (const uniform of this.samplers) {
      if (uniform.texture?.isFramebufferTexture) {
        gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
        empty.bindTexture();
        gl.uniform1i(uniform.location, uniform.samplerIndex);
      }
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
    this.init();

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
        if (typeof data == 'number') {
          if (
            data < gl.TEXTURE0 ||
            data > gl.TEXTURE31 ||
            data !== Math.ceil(data)
          ) {
            console.log(
              '🌸 p5.js says: ' +
                "You're trying to use a number as the data for a texture." +
                'Please use a texture.'
            );
            return this;
          }
          gl.activeTexture(data);
          gl.uniform1i(location, data);
        } else {
          gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
          uniform.texture =
            data instanceof Texture ? data : this._renderer.getTexture(data);
          gl.uniform1i(location, uniform.samplerIndex);
          if (uniform.texture.src.gifProperties) {
            uniform.texture.src._animateGif(this._renderer._pInst);
          }
        }
        break;
      case gl.SAMPLER_CUBE:
      case gl.SAMPLER_3D:
      case gl.SAMPLER_2D_SHADOW:
      case gl.SAMPLER_2D_ARRAY:
      case gl.SAMPLER_2D_ARRAY_SHADOW:
      case gl.SAMPLER_CUBE_SHADOW:
      case gl.INT_SAMPLER_2D:
      case gl.INT_SAMPLER_3D:
      case gl.INT_SAMPLER_CUBE:
      case gl.INT_SAMPLER_2D_ARRAY:
      case gl.UNSIGNED_INT_SAMPLER_2D:
      case gl.UNSIGNED_INT_SAMPLER_3D:
      case gl.UNSIGNED_INT_SAMPLER_CUBE:
      case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        if (typeof data !== 'number') {
          break;
        }
        if (
          data < gl.TEXTURE0 ||
          data > gl.TEXTURE31 ||
          data !== Math.ceil(data)
        ) {
          console.log(
            '🌸 p5.js says: ' +
              "You're trying to use a number as the data for a texture." +
              'Please use a texture.'
          );
          break;
        }
        gl.activeTexture(data);
        gl.uniform1i(location, data);
        break;
      //@todo complete all types
    }
    return this;
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

function shader(p5, fn){
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
   * A shader can optionally describe *hooks,* which are functions in GLSL that
   * users may choose to provide to customize the behavior of the shader. For the
   * vertex or the fragment shader, users can pass in an object where each key is
   * the type and name of a hook function, and each value is a string with the
   * parameter list and default implementation of the hook. For example, to let users
   * optionally run code at the start of the vertex shader, the options object could
   * include:
   *
   * ```js
   * {
   *   vertex: {
   *     'void beforeVertex': '() {}'
   *   }
   * }
   * ```
   *
   * Then, in your vertex shader source, you can run a hook by calling a function
   * with the same name prefixed by `HOOK_`:
   *
   * ```glsl
   * void main() {
   *   HOOK_beforeVertex();
   *   // Add the rest ofy our shader code here!
   * }
   * ```
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
   * @param {Object} [options] An optional object describing how this shader can
   * be augmented with hooks. It can include:
   *  - `vertex`: An object describing the available vertex shader hooks.
   *  - `fragment`: An object describing the available frament shader hooks.
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
   * async function setup() {
   *   mandelbrot = await loadShader('assets/shader.vert', 'assets/shader.frag');
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
  p5.Shader = Shader;
}

export default shader;
export { Shader };

if(typeof p5 !== 'undefined'){
  shader(p5, p5.prototype);
}
