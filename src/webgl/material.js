/**
 * @module 3D
 * @submodule Material
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import * as constants from '../core/constants';
import './p5.Texture';

/**
 * Loads vertex and fragment shaders to create a
 * <a href="#/p5.Shader">p5.Shader</a> object.
 *
 * Shaders are programs that run on the graphics processing unit (GPU). They
 * can process many pixels at the same time, making them fast for many
 * graphics tasks. They’re written in a language called
 * <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
 * and run along with the rest of the code in a sketch.
 *
 * Once the <a href="#/p5.Shader">p5.Shader</a> object is created, it can be
 * used with the <a href="#/p5/shader">shader()</a> function, as in
 * `shader(myShader)`. A shader program consists of two files, a vertex shader
 * and a fragment shader. The vertex shader affects where 3D geometry is drawn
 * on the screen and the fragment shader affects color.
 *
 * `loadShader()` loads the vertex and fragment shaders from their `.vert` and
 * `.frag` files. For example, calling
 * `loadShader('assets/shader.vert', 'assets/shader.frag')` loads both
 * required shaders and returns a <a href="#/p5.Shader">p5.Shader</a> object.
 *
 * The third parameter, `successCallback`, is optional. If a function is
 * passed, it will be called once the shader has loaded. The callback function
 * can use the new <a href="#/p5.Shader">p5.Shader</a> object as its
 * parameter.
 *
 * The fourth parameter, `failureCallback`, is also optional. If a function is
 * passed, it will be called if the shader fails to load. The callback
 * function can use the event error as its parameter.
 *
 * Shaders can take time to load. Calling `loadShader()` in
 * <a href="#/p5/preload">preload()</a> ensures shaders load before they're
 * used in <a href="#/p5/setup">setup()</a> or <a href="#/p5/draw">draw()</a>.
 *
 * Note: Shaders can only be used in WebGL mode.
 *
 * @method loadShader
 * @param {String} vertFilename path of the vertex shader to be loaded.
 * @param {String} fragFilename path of the fragment shader to be loaded.
 * @param {function} [successCallback] function to call once the shader is loaded. Can be passed the
 *                                     <a href="#/p5.Shader">p5.Shader</a> object.
 * @param {function} [failureCallback] function to call if the shader fails to load. Can be passed an
 *                                     `Error` event object.
 * @return {p5.Shader} new shader created from the vertex and fragment shader files.
 *
 * @example
 * <div modernizr='webgl'>
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
 *   // Compile and apply the p5.Shader object.
 *   shader(mandelbrot);
 *
 *   // Set the shader uniform p to an array.
 *   mandelbrot.setUniform('p', [-0.74364388703, 0.13182590421]);
 *
 *   // Set the shader uniform r to the value 1.5.
 *   mandelbrot.setUniform('r', 1.5);
 *
 *   // Add a quad as a display surface for the shader.
 *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
 *
 *   describe('A black fractal image on a magenta background.');
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
p5.prototype.loadShader = function (
  vertFilename,
  fragFilename,
  successCallback,
  failureCallback
) {
  p5._validateParameters('loadShader', arguments);
  if (!failureCallback) {
    failureCallback = console.error;
  }

  const loadedShader = new p5.Shader();

  const self = this;
  let loadedFrag = false;
  let loadedVert = false;

  const onLoad = () => {
    self._decrementPreload();
    if (successCallback) {
      successCallback(loadedShader);
    }
  };

  this.loadStrings(
    vertFilename,
    result => {
      loadedShader._vertSrc = result.join('\n');
      loadedVert = true;
      if (loadedFrag) {
        onLoad();
      }
    },
    failureCallback
  );

  this.loadStrings(
    fragFilename,
    result => {
      loadedShader._fragSrc = result.join('\n');
      loadedFrag = true;
      if (loadedVert) {
        onLoad();
      }
    },
    failureCallback
  );

  return loadedShader;
};

/**
 * Creates a new <a href="#/p5.Shader">p5.Shader</a> object.
 *
 * Shaders are programs that run on the graphics processing unit (GPU). They
 * can process many pixels at the same time, making them fast for many
 * graphics tasks. They’re written in a language called
 * <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
 * and run along with the rest of the code in a sketch.
 *
 * Once the <a href="#/p5.Shader">p5.Shader</a> object is created, it can be
 * used with the <a href="#/p5/shader">shader()</a> function, as in
 * `shader(myShader)`. A shader program consists of two parts, a vertex shader
 * and a fragment shader. The vertex shader affects where 3D geometry is drawn
 * on the screen and the fragment shader affects color.
 *
 * The first parameter, `vertSrc`, sets the vertex shader. It’s a string that
 * contains the vertex shader program written in GLSL.
 *
 * The second parameter, `fragSrc`, sets the fragment shader. It’s a string
 * that contains the fragment shader program written in GLSL.
 *
 * A shader can optionally describe *hooks,* which are functions in GLSL that
 * users may choose to provide to customize the behavior of the shader using the
 * <a href="#/p5.Shader/modify">`modify()`</a> method of `p5.Shader`. These are added by
 * describing the hooks in a third parameter, `options`, and referencing the hooks in
 * your `vertSrc` or `fragSrc`. Hooks for the vertex or fragment shader are described under
 * the `vertex` and `fragment` keys of `options`. Each one is an object. where each key is
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
 * with the same name prefixed by `HOOK_`. If you want to check if the default
 * hook has been replaced, maybe to avoid extra overhead, you can check if the
 * same name prefixed by `AUGMENTED_HOOK_` has been defined:
 *
 * ```glsl
 * void main() {
 *   // In most cases, just calling the hook is fine:
 *   HOOK_beforeVertex();
 *
 *   // Alternatively, for more efficiency:
 *   #ifdef AUGMENTED_HOOK_beforeVertex
 *   HOOK_beforeVertex();
 *   #endif
 *
 *   // Add the rest of your shader code here!
 * }
 * ```
 *
 * Note: Only filter shaders can be used in 2D mode. All shaders can be used
 * in WebGL mode.
 *
 * @method createShader
 * @param {String} vertSrc source code for the vertex shader.
 * @param {String} fragSrc source code for the fragment shader.
 * @param {Object} [options] An optional object describing how this shader can
 * be augmented with hooks. It can include:
 *  - `vertex`: An object describing the available vertex shader hooks.
 *  - `fragment`: An object describing the available frament shader hooks.
 * @returns {p5.Shader} new shader object created from the
 * vertex and fragment shaders.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * // Note: A "uniform" is a global variable within a shader program.
 *
 * // Create a string with the vertex shader program.
 * // The vertex shader is called for each vertex.
 * let vertSrc = `
 * precision highp float;
 * uniform mat4 uModelViewMatrix;
 * uniform mat4 uProjectionMatrix;
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
 *   let shaderProgram = createShader(vertSrc, fragSrc);
 *
 *   // Compile and apply the p5.Shader object.
 *   shader(shaderProgram);
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
 * // Create a string with the vertex shader program.
 * // The vertex shader is called for each vertex.
 * let vertSrc = `
 * precision highp float;
 * uniform mat4 uModelViewMatrix;
 * uniform mat4 uProjectionMatrix;
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
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create a p5.Shader object.
 *   let mandelbrot = createShader(vertSrc, fragSrc);
 *
 *   // Compile and apply the p5.Shader object.
 *   shader(mandelbrot);
 *
 *   // Set the shader uniform p to an array.
 *   // p is the center point of the Mandelbrot image.
 *   mandelbrot.setUniform('p', [-0.74364388703, 0.13182590421]);
 *
 *   // Set the shader uniform r to 0.005.
 *   // r is the size of the image in Mandelbrot-space.
 *   mandelbrot.setUniform('r', 0.005);
 *
 *   // Style the drawing surface.
 *   noStroke();
 *
 *   // Add a plane as a drawing surface.
 *   plane(100, 100);
 *
 *   describe('A black fractal image on a magenta background.');
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
 *   // Apply the p5.Shader object.
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
 *
 * <div>
 * <code>
 * // A shader with hooks.
 * let myShader;
 *
 * // A shader with modified hooks.
 * let modifiedShader;
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
 *
 * void main() {
 *   vec4 positionVec4 = vec4(aPosition, 1.0);
 *   gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
 * }
 * `;
 *
 * // Create a fragment shader that uses a hook.
 * let fragSrc = `
 * precision highp float;
 * void main() {
 *   // Let users override the color
 *   gl_FragColor = HOOK_getColor(vec4(1., 0., 0., 1.));
 * }
 * `;
 *
 * function setup() {
 *   createCanvas(50, 50, WEBGL);
 *
 *   // Create a shader with hooks
 *   myShader = createShader(vertSrc, fragSrc, {
 *     fragment: {
 *       'vec4 getColor': '(vec4 color) { return color; }'
 *     }
 *   });
 *
 *   // Make a version of the shader with a hook overridden
 *   modifiedShader = myShader.modify({
 *     'vec4 getColor': `(vec4 color) {
 *       return vec4(0., 0., 1., 1.);
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   noStroke();
 *
 *   push();
 *   shader(myShader);
 *   translate(-width/3, 0);
 *   sphere(10);
 *   pop();
 *
 *   push();
 *   shader(modifiedShader);
 *   translate(width/3, 0);
 *   sphere(10);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.prototype.createShader = function (vertSrc, fragSrc, options) {
  p5._validateParameters('createShader', arguments);
  return new p5.Shader(this._renderer, vertSrc, fragSrc, options);
};

/**
 * Creates a <a href="#/p5.Shader">p5.Shader</a> object to be used with the
 * <a href="#/p5/filter">filter()</a> function.
 *
 * `createFilterShader()` works like
 * <a href="#/p5/createShader">createShader()</a> but has a default vertex
 * shader included. `createFilterShader()` is intended to be used along with
 * <a href="#/p5/filter">filter()</a> for filtering the contents of a canvas.
 * A filter shader will be applied to the whole canvas instead of just
 * <a href="#/p5.Geometry">p5.Geometry</a> objects.
 *
 * The parameter, `fragSrc`, sets the fragment shader. It’s a string that
 * contains the fragment shader program written in
 * <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>.
 *
 * The <a href="#/p5.Shader">p5.Shader</a> object that's created has some
 * uniforms that can be set:
 * - `sampler2D tex0`, which contains the canvas contents as a texture.
 * - `vec2 canvasSize`, which is the width and height of the canvas, not including pixel density.
 * - `vec2 texelSize`, which is the size of a physical pixel including pixel density. This is calculated as `1.0 / (width * density)` for the pixel width and `1.0 / (height * density)` for the pixel height.
 *
 * The <a href="#/p5.Shader">p5.Shader</a> that's created also provides
 * `varying vec2 vTexCoord`, a coordinate with values between 0 and 1.
 * `vTexCoord` describes where on the canvas the pixel will be drawn.
 *
 * For more info about filters and shaders, see Adam Ferriss' <a href="https://github.com/aferriss/p5jsShaderExamples">repo of shader examples</a>
 * or the <a href="https://p5js.org/learn/getting-started-in-webgl-shaders.html">Introduction to Shaders</a> tutorial.
 *
 * @method createFilterShader
 * @param {String} fragSrc source code for the fragment shader.
 * @returns {p5.Shader} new shader object created from the fragment shader.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * function setup() {
 *   let fragSrc = `precision highp float;
 *   void main() {
 *     gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
 *   }`;
 *
 *   createCanvas(100, 100, WEBGL);
 *   let s = createFilterShader(fragSrc);
 *   filter(s);
 *   describe('a yellow canvas');
 * }
 * </code>
 * </div>
 *
 * <div modernizr='webgl'>
 * <code>
 * let img, s;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   let fragSrc = `precision highp float;
 *
 *   // x,y coordinates, given from the vertex shader
 *   varying vec2 vTexCoord;
 *
 *   // the canvas contents, given from filter()
 *   uniform sampler2D tex0;
 *   // other useful information from the canvas
 *   uniform vec2 texelSize;
 *   uniform vec2 canvasSize;
 *   // a custom variable from this sketch
 *   uniform float darkness;
 *
 *   void main() {
 *     // get the color at current pixel
 *     vec4 color = texture2D(tex0, vTexCoord);
 *     // set the output color
 *     color.b = 1.0;
 *     color *= darkness;
 *     gl_FragColor = vec4(color.rgb, 1.0);
 *   }`;
 *
 *   createCanvas(100, 100, WEBGL);
 *   s = createFilterShader(fragSrc);
 * }
 * function draw() {
 *   image(img, -50, -50);
 *   s.setUniform('darkness', 0.5);
 *   filter(s);
 *   describe('a image of bricks tinted dark blue');
 * }
 * </code>
 * </div>
 */
p5.prototype.createFilterShader = function (fragSrc) {
  p5._validateParameters('createFilterShader', arguments);
  let defaultVertV1 = `
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    attribute vec3 aPosition;
    // texcoords only come from p5 to vertex shader
    // so pass texcoords on to the fragment shader in a varying variable
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;

    void main() {
      // transferring texcoords for the frag shader
      vTexCoord = aTexCoord;

      // copy position with a fourth coordinate for projection (1.0 is normal)
      vec4 positionVec4 = vec4(aPosition, 1.0);

      // project to 3D space
      gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    }
  `;
  let defaultVertV2 = `#version 300 es
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    in vec3 aPosition;
    in vec2 aTexCoord;
    out vec2 vTexCoord;

    void main() {
      // transferring texcoords for the frag shader
      vTexCoord = aTexCoord;

      // copy position with a fourth coordinate for projection (1.0 is normal)
      vec4 positionVec4 = vec4(aPosition, 1.0);

      // project to 3D space
      gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    }
  `;
  let vertSrc = fragSrc.includes('#version 300 es') ? defaultVertV2 : defaultVertV1;
  const shader = new p5.Shader(this._renderer, vertSrc, fragSrc);
  if (this._renderer.GL) {
    shader.ensureCompiledOnContext(this);
  } else {
    shader.ensureCompiledOnContext(this._renderer.getFilterGraphicsLayer());
  }
  return shader;
};

/**
 * Sets the <a href="#/p5.Shader">p5.Shader</a> object to apply while drawing.
 *
 * Shaders are programs that run on the graphics processing unit (GPU). They
 * can process many pixels or vertices at the same time, making them fast for
 * many graphics tasks. They’re written in a language called
 * <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
 * and run along with the rest of the code in a sketch.
 * <a href="#/p5.Shader">p5.Shader</a> objects can be created using the
 * <a href="#/p5/createShader">createShader()</a> and
 * <a href="#/p5/loadShader">loadShader()</a> functions.
 *
 * The parameter, `s`, is the <a href="#/p5.Shader">p5.Shader</a> object to
 * apply. For example, calling `shader(myShader)` applies `myShader` to
 * process each pixel on the canvas. The shader will be used for:
 * - Fills when a texture is enabled if it includes a uniform `sampler2D`.
 * - Fills when lights are enabled if it includes the attribute `aNormal`, or if it has any of the following uniforms: `uUseLighting`, `uAmbientLightCount`, `uDirectionalLightCount`, `uPointLightCount`, `uAmbientColor`, `uDirectionalDiffuseColors`, `uDirectionalSpecularColors`, `uPointLightLocation`, `uPointLightDiffuseColors`, `uPointLightSpecularColors`, `uLightingDirection`, or `uSpecular`.
 * - Fills whenever there are no lights or textures.
 * - Strokes if it includes the uniform `uStrokeWeight`.
 *
 * The source code from a <a href="#/p5.Shader">p5.Shader</a> object's
 * fragment and vertex shaders will be compiled the first time it's passed to
 * `shader()`. See
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/compileShader" target="_blank">MDN</a>
 * for more information about compiling shaders.
 *
 * Calling <a href="#/p5/resetShader">resetShader()</a> restores a sketch’s
 * default shaders.
 *
 * Note: Shaders can only be used in WebGL mode.
 *
 * @method shader
 * @chainable
 * @param {p5.Shader} s <a href="#/p5.Shader">p5.Shader</a> object
 *                      to apply.
 *
 * @example
 * <div modernizr='webgl'>
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
 *   let shaderProgram = createShader(vertSrc, fragSrc);
 *
 *   // Apply the p5.Shader object.
 *   shader(shaderProgram);
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
 *
 * <div>
 * <code>
 * // Note: A "uniform" is a global variable within a shader program.
 *
 * let redGreen;
 * let orangeBlue;
 * let showRedGreen = false;
 *
 * // Load the shader and create two separate p5.Shader objects.
 * function preload() {
 *   redGreen = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
 *   orangeBlue = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Initialize the redGreen shader.
 *   shader(redGreen);
 *
 *   // Set the redGreen shader's center and background color.
 *   redGreen.setUniform('colorCenter', [1.0, 0.0, 0.0]);
 *   redGreen.setUniform('colorBackground', [0.0, 1.0, 0.0]);
 *
 *   // Initialize the orangeBlue shader.
 *   shader(orangeBlue);
 *
 *   // Set the orangeBlue shader's center and background color.
 *   orangeBlue.setUniform('colorCenter', [1.0, 0.5, 0.0]);
 *   orangeBlue.setUniform('colorBackground', [0.226, 0.0, 0.615]);
 *
 *   describe(
 *     'The scene toggles between two circular gradients when the user double-clicks. An orange and blue gradient vertically, and red and green gradient moves horizontally.'
 *   );
 * }
 *
 * function draw() {
 *   // Update the offset values for each shader.
 *   // Move orangeBlue vertically.
 *   // Move redGreen horizontally.
 *   orangeBlue.setUniform('offset', [0, sin(frameCount * 0.01) + 1]);
 *   redGreen.setUniform('offset', [sin(frameCount * 0.01), 1]);
 *
 *   if (showRedGreen === true) {
 *     shader(redGreen);
 *   } else {
 *     shader(orangeBlue);
 *   }
 *
 *   // Style the drawing surface.
 *   noStroke();
 *
 *   // Add a quad as a drawing surface.
 *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
 * }
 *
 * // Toggle between shaders when the user double-clicks.
 * function doubleClicked() {
 *   showRedGreen = !showRedGreen;
 * }
 * </code>
 * </div>
 */
p5.prototype.shader = function (s) {
  this._assert3d('shader');
  p5._validateParameters('shader', arguments);

  s.ensureCompiledOnContext(this);

  if (s.isStrokeShader()) {
    this._renderer.userStrokeShader = s;
  } else {
    this._renderer.userFillShader = s;
    this._renderer._useNormalMaterial = false;
  }

  s.setDefaultUniforms();

  return this;
};

/**
 * Get the default shader used with lights, materials,
 * and textures.
 *
 * You can call <a href="#/p5.Shader/modify">`baseMaterialShader().modify()`</a>
 * and change any of the following hooks:
 *
 * <table>
 * <tr><th>Hook</th><th>Description</th></tr>
 * <tr><td>
 *
 * `void beforeVertex`
 *
 * </td><td>
 *
 * Called at the start of the vertex shader.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec3 getLocalPosition`
 *
 * </td><td>
 *
 * Update the position of vertices before transforms are applied. It takes in `vec3 position` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec3 getWorldPosition`
 *
 * </td><td>
 *
 * Update the position of vertices after transforms are applied. It takes in `vec3 position` and pust return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec3 getLocalNormal`
 *
 * </td><td>
 *
 * Update the normal before transforms are applied. It takes in `vec3 normal` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec3 getWorldNormal`
 *
 * </td><td>
 *
 * Update the normal after transforms are applied. It takes in `vec3 normal` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec2 getUV`
 *
 * </td><td>
 *
 * Update the texture coordinates. It takes in `vec2 uv` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec4 getVertexColor`
 *
 * </td><td>
 *
 * Update the color of each vertex. It takes in a `vec4 color` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `void afterVertex`
 *
 * </td><td>
 *
 * Called at the end of the vertex shader.
 *
 * </td></tr>
 * <tr><td>
 *
 * `void beforeFragment`
 *
 * </td><td>
 *
 * Called at the start of the fragment shader.
 *
 * </td></tr>
 * <tr><td>
 *
 * `Inputs getPixelInputs`
 *
 * </td><td>
 *
 * Update the per-pixel inputs of the material. It takes in an `Inputs` struct, which includes:
 * - `vec3 normal`, the direction pointing out of the surface
 * - `vec2 texCoord`, a vector where `x` and `y` are between 0 and 1 describing the spot on a texture the pixel is mapped to, as a fraction of the texture size
 * - `vec3 ambientLight`, the ambient light color on the vertex
 * - `vec4 color`, the base material color of the pixel
 * - `vec3 ambientMaterial`, the color of the pixel when affected by ambient light
 * - `vec3 specularMaterial`, the color of the pixel when reflecting specular highlights
 * - `vec3 emissiveMaterial`, the light color emitted by the pixel
 * - `float shininess`, a number representing how sharp specular reflections should be, from 1 to infinity
 * - `float metalness`, a number representing how mirrorlike the material should be, between 0 and 1
 * The struct can be modified and returned.
 * </td></tr>
 * <tr><td>
 *
 * `vec4 combineColors`
 *
 * </td><td>
 *
 * Take in a `ColorComponents` struct containing all the different components of light, and combining them into
 * a single final color. The struct contains:
 * - `vec3 baseColor`, the base color of the pixel
 * - `float opacity`, the opacity between 0 and 1 that it should be drawn at
 * - `vec3 ambientColor`, the color of the pixel when affected by ambient light
 * - `vec3 specularColor`, the color of the pixel when affected by specular reflections
 * - `vec3 diffuse`, the amount of diffused light hitting the pixel
 * - `vec3 ambient`, the amount of ambient light hitting the pixel
 * - `vec3 specular`, the amount of specular reflection hitting the pixel
 * - `vec3 emissive`, the amount of light emitted by the pixel
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec4 getFinalColor`
 *
 * </td><td>
 *
 * Update the final color after mixing. It takes in a `vec4 color` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `void afterFragment`
 *
 * </td><td>
 *
 * Called at the end of the fragment shader.
 *
 * </td></tr>
 * </table>
 *
 * Most of the time, you will need to write your hooks in GLSL ES version 300. If you
 * are using WebGL 1 instead of 2, write your hooks in GLSL ES 100 instead.
 *
 * Call `baseMaterialShader().inspectHooks()` to see all the possible hooks and
 * their default implementations.
 *
 * @method baseMaterialShader
 * @beta
 * @returns {p5.Shader} The material shader
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
 *       'float time': () => millis()
 *     },
 *     'vec3 getWorldPosition': `(vec3 pos) {
 *       pos.y += 20.0 * sin(time * 0.001 + pos.x * 0.05);
 *       return pos;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('red');
 *   sphere(50);
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
 *     declarations: 'vec3 myNormal;',
 *     'Inputs getPixelInputs': `(Inputs inputs) {
 *       myNormal = inputs.normal;
 *       return inputs;
 *     }`,
 *     'vec4 getFinalColor': `(vec4 color) {
 *       return mix(
 *         vec4(1.0, 1.0, 1.0, 1.0),
 *         color,
 *         abs(dot(myNormal, vec3(0.0, 0.0, 1.0)))
 *       );
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   rotateY(millis() * 0.001);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('red');
 *   torus(30);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * let environment;
 *
 * function preload() {
 *   environment = loadImage('assets/outdoor_spheremap.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify({
 *     'Inputs getPixelInputs': `(Inputs inputs) {
 *       float factor =
 *         sin(
 *           inputs.texCoord.x * ${TWO_PI} +
 *           inputs.texCoord.y * ${TWO_PI}
 *         ) * 0.4 + 0.5;
 *       inputs.shininess = mix(1., 100., factor);
 *       inputs.metalness = factor;
 *       return inputs;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   panorama(environment);
 *   ambientLight(100);
 *   imageLight(environment);
 *   rotateY(millis() * 0.001);
 *   shader(myShader);
 *   noStroke();
 *   fill(255);
 *   specularMaterial(150);
 *   sphere(50);
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
 *     'Inputs getPixelInputs': `(Inputs inputs) {
 *       vec3 newNormal = inputs.normal;
 *       // Simple bump mapping: adjust the normal based on position
 *       newNormal.x += 0.2 * sin(
 *           sin(
 *             inputs.texCoord.y * ${TWO_PI} * 10.0 +
 *             inputs.texCoord.x * ${TWO_PI} * 25.0
 *           )
 *         );
 *       newNormal.y += 0.2 * sin(
 *         sin(
 *             inputs.texCoord.x * ${TWO_PI} * 10.0 +
 *             inputs.texCoord.y * ${TWO_PI} * 25.0
 *           )
 *       );
 *       inputs.normal = normalize(newNormal);
 *       return inputs;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   ambientLight(150);
 *   pointLight(
 *     255, 255, 255,
 *     100*cos(frameCount*0.04), -50, 100*sin(frameCount*0.04)
 *   );
 *   noStroke();
 *   fill('red');
 *   shininess(200);
 *   specularMaterial(255);
 *   sphere(50);
 * }
 * </code>
 * </div>
 */
p5.prototype.baseMaterialShader = function() {
  this._assert3d('baseMaterialShader');
  return this._renderer.baseMaterialShader();
};

/**
 * Get the shader used by <a href="#/p5/normalMaterial">`normalMaterial()`</a>.
 *
 * You can call <a href="#/p5.Shader/modify">`baseNormalShader().modify()`</a>
 * and change any of the following hooks:
 *
 * Hook | Description
 * -----|------------
 * `void beforeVertex` | Called at the start of the vertex shader.
 * `vec3 getLocalPosition` | Update the position of vertices before transforms are applied. It takes in `vec3 position` and must return a modified version.
 * `vec3 getWorldPosition` | Update the position of vertices after transforms are applied. It takes in `vec3 position` and pust return a modified version.
 * `vec3 getLocalNormal` | Update the normal before transforms are applied. It takes in `vec3 normal` and must return a modified version.
 * `vec3 getWorldNormal` | Update the normal after transforms are applied. It takes in `vec3 normal` and must return a modified version.
 * `vec2 getUV` | Update the texture coordinates. It takes in `vec2 uv` and must return a modified version.
 * `vec4 getVertexColor` | Update the color of each vertex. It takes in a `vec4 color` and must return a modified version.
 * `void afterVertex` | Called at the end of the vertex shader.
 * `void beforeFragment` | Called at the start of the fragment shader.
 * `vec4 getFinalColor` | Update the final color after mixing. It takes in a `vec4 color` and must return a modified version.
 * `void afterFragment` | Called at the end of the fragment shader.
 *
 * Most of the time, you will need to write your hooks in GLSL ES version 300. If you
 * are using WebGL 1 instead of 2, write your hooks in GLSL ES 100 instead.
 *
 * Call `baseNormalShader().inspectHooks()` to see all the possible hooks and
 * their default implementations.
 *
 * @method baseNormalShader
 * @beta
 * @returns {p5.Shader} The `normalMaterial` shader
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 *
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseNormalShader().modify({
 *     uniforms: {
 *       'float time': () => millis()
 *     },
 *     'vec3 getWorldPosition': `(vec3 pos) {
 *       pos.y += 20. * sin(time * 0.001 + pos.x * 0.05);
 *       return pos;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   noStroke();
 *   sphere(50);
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
 *   myShader = baseNormalShader().modify({
 *     'vec3 getWorldNormal': '(vec3 normal) { return abs(normal); }',
 *     'vec4 getFinalColor': `(vec4 color) {
 *       // Map the r, g, and b values of the old normal to new colors
 *       // instead of just red, green, and blue:
 *       vec3 newColor =
 *         color.r * vec3(89.0, 240.0, 232.0) / 255.0 +
 *         color.g * vec3(240.0, 237.0, 89.0) / 255.0 +
 *         color.b * vec3(205.0, 55.0, 222.0) / 255.0;
 *       newColor = newColor / (color.r + color.g + color.b);
 *       return vec4(newColor, 1.0) * color.a;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   noStroke();
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.015);
 *   box(100);
 * }
 * </code>
 * </div>
 */
p5.prototype.baseNormalShader = function() {
  this._assert3d('baseNormalShader');
  return this._renderer.baseNormalShader();
};

/**
 * Get the shader used when no lights or materials are applied.
 *
 * You can call <a href="#/p5.Shader/modify">`baseColorShader().modify()`</a>
 * and change any of the following hooks:
 *
 * Hook | Description
 * -------|-------------
 * `void beforeVertex` | Called at the start of the vertex shader.
 * `vec3 getLocalPosition` | Update the position of vertices before transforms are applied. It takes in `vec3 position` and must return a modified version.
 * `vec3 getWorldPosition` | Update the position of vertices after transforms are applied. It takes in `vec3 position` and pust return a modified version.
 * `vec3 getLocalNormal` | Update the normal before transforms are applied. It takes in `vec3 normal` and must return a modified version.
 * `vec3 getWorldNormal` | Update the normal after transforms are applied. It takes in `vec3 normal` and must return a modified version.
 * `vec2 getUV` | Update the texture coordinates. It takes in `vec2 uv` and must return a modified version.
 * `vec4 getVertexColor` | Update the color of each vertex. It takes in a `vec4 color` and must return a modified version.
 * `void afterVertex` | Called at the end of the vertex shader.
 * `void beforeFragment` | Called at the start of the fragment shader.
 * `vec4 getFinalColor` | Update the final color after mixing. It takes in a `vec4 color` and must return a modified version.
 * `void afterFragment` | Called at the end of the fragment shader.
 *
 * Most of the time, you will need to write your hooks in GLSL ES version 300. If you
 * are using WebGL 1 instead of 2, write your hooks in GLSL ES 100 instead.
 *
 * Call `baseColorShader().inspectHooks()` to see all the possible hooks and
 * their default implementations.
 *
 * @method baseColorShader
 * @beta
 * @returns {p5.Shader} The color shader
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 *
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify({
 *     uniforms: {
 *       'float time': () => millis()
 *     },
 *     'vec3 getWorldPosition': `(vec3 pos) {
 *       pos.y += 20. * sin(time * 0.001 + pos.x * 0.05);
 *       return pos;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   noStroke();
 *   fill('red');
 *   circle(0, 0, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.baseColorShader = function() {
  this._assert3d('baseColorShader');
  return this._renderer.baseColorShader();
};

/**
 * Get the shader used when drawing the strokes of shapes.
 *
 * You can call <a href="#/p5.Shader/modify">`baseStrokeShader().modify()`</a>
 * and change any of the following hooks:
 *
 * <table>
 * <tr><th>Hook</th><th>Description</th></tr>
 * <tr><td>
 *
 * `void beforeVertex`
 *
 * </td><td>
 *
 * Called at the start of the vertex shader.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec3 getLocalPosition`
 *
 * </td><td>
 *
 * Update the position of vertices before transforms are applied. It takes in `vec3 position` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec3 getWorldPosition`
 *
 * </td><td>
 *
 * Update the position of vertices after transforms are applied. It takes in `vec3 position` and pust return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `float getStrokeWeight`
 *
 * </td><td>
 *
 * Update the stroke weight. It takes in `float weight` and pust return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec2 getLineCenter`
 *
 * </td><td>
 *
 * Update the center of the line. It takes in `vec2 center` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec2 getLinePosition`
 *
 * </td><td>
 *
 * Update the position of each vertex on the edge of the line. It takes in `vec2 position` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec4 getVertexColor`
 *
 * </td><td>
 *
 * Update the color of each vertex. It takes in a `vec4 color` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `void afterVertex`
 *
 * </td><td>
 *
 * Called at the end of the vertex shader.
 *
 * </td></tr>
 * <tr><td>
 *
 * `void beforeFragment`
 *
 * </td><td>
 *
 * Called at the start of the fragment shader.
 *
 * </td></tr>
 * <tr><td>
 *
 * `Inputs getPixelInputs`
 *
 * </td><td>
 *
 * Update the inputs to the shader. It takes in a struct `Inputs inputs`, which includes:
 * - `vec4 color`, the color of the stroke
 * - `vec2 tangent`, the direction of the stroke in screen space
 * - `vec2 center`, the coordinate of the center of the stroke in screen space p5.js pixels
 * - `vec2 position`, the coordinate of the current pixel in screen space p5.js pixels
 * - `float strokeWeight`, the thickness of the stroke in p5.js pixels
 *
 * </td></tr>
 * <tr><td>
 *
 * `bool shouldDiscard`
 *
 * </td><td>
 *
 * Caps and joins are made by discarded pixels in the fragment shader to carve away unwanted areas. Use this to change this logic. It takes in a `bool willDiscard` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `vec4 getFinalColor`
 *
 * </td><td>
 *
 * Update the final color after mixing. It takes in a `vec4 color` and must return a modified version.
 *
 * </td></tr>
 * <tr><td>
 *
 * `void afterFragment`
 *
 * </td><td>
 *
 * Called at the end of the fragment shader.
 *
 * </td></tr>
 * </table>
 *
 * Most of the time, you will need to write your hooks in GLSL ES version 300. If you
 * are using WebGL 1 instead of 2, write your hooks in GLSL ES 100 instead.
 *
 * Call `baseStrokeShader().inspectHooks()` to see all the possible hooks and
 * their default implementations.
 *
 * @method baseStrokeShader
 * @beta
 * @returns {p5.Shader} The stroke shader
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 *
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseStrokeShader().modify({
 *     'Inputs getPixelInputs': `(Inputs inputs) {
 *       float opacity = 1.0 - smoothstep(
 *         0.0,
 *         15.0,
 *         length(inputs.position - inputs.center)
 *       );
 *       inputs.color *= opacity;
 *       return inputs;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   strokeWeight(30);
 *   line(
 *     -width/3,
 *     sin(millis()*0.001) * height/4,
 *     width/3,
 *     sin(millis()*0.001 + 1) * height/4
 *   );
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
 *   myShader = baseStrokeShader().modify({
 *     uniforms: {
 *       'float time': () => millis()
 *     },
 *     declarations: 'vec3 myPosition;',
 *     'vec3 getWorldPosition': `(vec3 pos) {
 *       myPosition = pos;
 *       return pos;
 *     }`,
 *     'float getStrokeWeight': `(float w) {
 *       // Add a somewhat random offset to the weight
 *       // that varies based on position and time
 *       float scale = 0.8 + 0.2*sin(10.0 * sin(
 *         floor(time/250.) +
 *         myPosition.x*0.01 +
 *         myPosition.y*0.01
 *       ));
 *       return w * scale;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   myShader.setUniform('time', millis());
 *   strokeWeight(10);
 *   beginShape();
 *   for (let i = 0; i <= 50; i++) {
 *     let r = map(i, 0, 50, 0, width/3);
 *     let x = r*cos(i*0.2);
 *     let y = r*sin(i*0.2);
 *     vertex(x, y);
 *   }
 *   endShape();
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
 *   myShader = baseStrokeShader().modify({
 *     'float random': `(vec2 p) {
 *       vec3 p3  = fract(vec3(p.xyx) * .1031);
 *       p3 += dot(p3, p3.yzx + 33.33);
 *       return fract((p3.x + p3.y) * p3.z);
 *     }`,
 *     'Inputs getPixelInputs': `(Inputs inputs) {
 *       // Replace alpha in the color with dithering by
 *       // randomly setting pixel colors to 0 based on opacity
 *       float a = inputs.color.a;
 *       inputs.color.a = 1.0;
 *       inputs.color *= random(inputs.position.xy) > a ? 0.0 : 1.0;
 *       return inputs;
 *     }`
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   strokeWeight(10);
 *   beginShape();
 *   for (let i = 0; i <= 50; i++) {
 *     stroke(
 *       0,
 *       255
 *         * map(i, 0, 20, 0, 1, true)
 *         * map(i, 30, 50, 1, 0, true)
 *     );
 *     vertex(
 *       map(i, 0, 50, -1, 1) * width/3,
 *       50 * sin(i/10 + frameCount/100)
 *     );
 *   }
 *   endShape();
 * }
 * </code>
 * </div>
 */
p5.prototype.baseStrokeShader = function() {
  this._assert3d('baseStrokeShader');
  return this._renderer.baseStrokeShader();
};

/**
 * Restores the default shaders.
 *
 * `resetShader()` deactivates any shaders previously applied by
 * <a href="#/p5/shader">shader()</a>.
 *
 * Note: Shaders can only be used in WebGL mode.
 *
 * @method resetShader
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Create a string with the vertex shader program.
 * // The vertex shader is called for each vertex.
 * let vertSrc = `
 * attribute vec3 aPosition;
 * attribute vec2 aTexCoord;
 * uniform mat4 uProjectionMatrix;
 * uniform mat4 uModelViewMatrix;
 * varying vec2 vTexCoord;
 *
 * void main() {
 *   vTexCoord = aTexCoord;
 *   vec4 position = vec4(aPosition, 1.0);
 *   gl_Position = uProjectionMatrix * uModelViewMatrix * position;
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
 *   gl_FragColor = vec4(color, 1.0);
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
 *   describe(
 *     'Two rotating cubes on a gray background. The left one has a blue-purple gradient on each face. The right one is red.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a box using the p5.Shader.
 *   // shader() sets the active shader to myShader.
 *   shader(myShader);
 *   push();
 *   translate(-25, 0, 0);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(width / 4);
 *   pop();
 *
 *   // Draw a box using the default fill shader.
 *   // resetShader() restores the default fill shader.
 *   resetShader();
 *   fill(255, 0, 0);
 *   push();
 *   translate(25, 0, 0);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(width / 4);
 *   pop();
 * }
 * </code>
 * </div>
 */
p5.prototype.resetShader = function () {
  this._renderer.userFillShader = this._renderer.userStrokeShader = null;
  return this;
};

/**
 * Sets the texture that will be used on shapes.
 *
 * A texture is like a skin that wraps around a shape. `texture()` works with
 * built-in shapes, such as <a href="#/p5/square">square()</a> and
 * <a href="#/p5/sphere">sphere()</a>, and custom shapes created with
 * functions such as <a href="#/p5/buildGeometry">buildGeometry()</a>. To
 * texture a geometry created with <a href="#/p5/beginShape">beginShape()</a>,
 * uv coordinates must be passed to each
 * <a href="#/p5/vertex">vertex()</a> call.
 *
 * The parameter, `tex`, is the texture to apply. `texture()` can use a range
 * of sources including images, videos, and offscreen renderers such as
 * <a href="#/p5.Graphics">p5.Graphics</a> and
 * <a href="#/p5.Framebuffer">p5.Framebuffer</a> objects.
 *
 * To texture a geometry created with <a href="#/p5/beginShape">beginShape()</a>,
 * you will need to specify uv coordinates in <a href="#/p5/vertex">vertex()</a>.
 *
 * Note: `texture()` can only be used in WebGL mode.
 *
 * @method texture
 * @param {p5.Image|p5.MediaElement|p5.Graphics|p5.Texture|p5.Framebuffer|p5.FramebufferTexture} tex media to use as the texture.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * // Load an image and create a p5.Image object.
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A spinning cube with an image of a ceiling on each face.');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Rotate around the x-, y-, and z-axes.
 *   rotateZ(frameCount * 0.01);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *
 *   // Apply the image as a texture.
 *   texture(img);
 *
 *   // Draw the box.
 *   box(50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create a p5.Graphics object.
 *   pg = createGraphics(100, 100);
 *
 *   // Draw a circle to the p5.Graphics object.
 *   pg.background(200);
 *   pg.circle(50, 50, 30);
 *
 *   describe('A spinning cube with circle at the center of each face.');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Rotate around the x-, y-, and z-axes.
 *   rotateZ(frameCount * 0.01);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *
 *   // Apply the p5.Graphics object as a texture.
 *   texture(pg);
 *
 *   // Draw the box.
 *   box(50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let vid;
 *
 * // Load a video and create a p5.MediaElement object.
 * function preload() {
 *   vid = createVideo('assets/fingers.mov');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Hide the video.
 *   vid.hide();
 *
 *   // Set the video to loop.
 *   vid.loop();
 *
 *   describe('A rectangle with video as texture');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Rotate around the y-axis.
 *   rotateY(frameCount * 0.01);
 *
 *   // Apply the video as a texture.
 *   texture(vid);
 *
 *   // Draw the rectangle.
 *   rect(-40, -40, 80, 80);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let vid;
 *
 * // Load a video and create a p5.MediaElement object.
 * function preload() {
 *   vid = createVideo('assets/fingers.mov');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Hide the video.
 *   vid.hide();
 *
 *   // Set the video to loop.
 *   vid.loop();
 *
 *   describe('A rectangle with video as texture');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Rotate around the y-axis.
 *   rotateY(frameCount * 0.01);
 *
 *   // Set the texture mode.
 *   textureMode(NORMAL);
 *
 *   // Apply the video as a texture.
 *   texture(vid);
 *
 *   // Draw a custom shape using uv coordinates.
 *   beginShape();
 *   vertex(-40, -40, 0, 0);
 *   vertex(40, -40, 1, 0);
 *   vertex(40, 40, 1, 1);
 *   vertex(-40, 40, 0, 1);
 *   endShape();
 * }
 * </code>
 * </div>
 */
p5.prototype.texture = function (tex) {
  this._assert3d('texture');
  p5._validateParameters('texture', arguments);
  if (tex.gifProperties) {
    tex._animateGif(this);
  }

  this._renderer.drawMode = constants.TEXTURE;
  this._renderer._useNormalMaterial = false;
  this._renderer._tex = tex;
  this._renderer._setProperty('_doFill', true);

  return this;
};

/**
 * Changes the coordinate system used for textures when they’re applied to
 * custom shapes.
 *
 * In order for <a href="#/p5/texture">texture()</a> to work, a shape needs a
 * way to map the points on its surface to the pixels in an image. Built-in
 * shapes such as <a href="#/p5/rect">rect()</a> and
 * <a href="#/p5/box">box()</a> already have these texture mappings based on
 * their vertices. Custom shapes created with
 * <a href="#/p5/vertex">vertex()</a> require texture mappings to be passed as
 * uv coordinates.
 *
 * Each call to <a href="#/p5/vertex">vertex()</a> must include 5 arguments,
 * as in `vertex(x, y, z, u, v)`, to map the vertex at coordinates `(x, y, z)`
 * to the pixel at coordinates `(u, v)` within an image. For example, the
 * corners of a rectangular image are mapped to the corners of a rectangle by default:
 *
 * <code>
 * // Apply the image as a texture.
 * texture(img);
 *
 * // Draw the rectangle.
 * rect(0, 0, 30, 50);
 * </code>
 *
 * If the image in the code snippet above has dimensions of 300 x 500 pixels,
 * the same result could be achieved as follows:
 *
 * <code>
 * // Apply the image as a texture.
 * texture(img);
 *
 * // Draw the rectangle.
 * beginShape();
 *
 * // Top-left.
 * // u: 0, v: 0
 * vertex(0, 0, 0, 0, 0);
 *
 * // Top-right.
 * // u: 300, v: 0
 * vertex(30, 0, 0, 300, 0);
 *
 * // Bottom-right.
 * // u: 300, v: 500
 * vertex(30, 50, 0, 300, 500);
 *
 * // Bottom-left.
 * // u: 0, v: 500
 * vertex(0, 50, 0, 0, 500);
 *
 * endShape();
 * </code>
 *
 * `textureMode()` changes the coordinate system for uv coordinates.
 *
 * The parameter, `mode`, accepts two possible constants. If `NORMAL` is
 * passed, as in `textureMode(NORMAL)`, then the texture’s uv coordinates can
 * be provided in the range 0 to 1 instead of the image’s dimensions. This can
 * be helpful for using the same code for multiple images of different sizes.
 * For example, the code snippet above could be rewritten as follows:
 *
 * <code>
 * // Set the texture mode to use normalized coordinates.
 * textureMode(NORMAL);
 *
 * // Apply the image as a texture.
 * texture(img);
 *
 * // Draw the rectangle.
 * beginShape();
 *
 * // Top-left.
 * // u: 0, v: 0
 * vertex(0, 0, 0, 0, 0);
 *
 * // Top-right.
 * // u: 1, v: 0
 * vertex(30, 0, 0, 1, 0);
 *
 * // Bottom-right.
 * // u: 1, v: 1
 * vertex(30, 50, 0, 1, 1);
 *
 * // Bottom-left.
 * // u: 0, v: 1
 * vertex(0, 50, 0, 0, 1);
 *
 * endShape();
 * </code>
 *
 * By default, `mode` is `IMAGE`, which scales uv coordinates to the
 * dimensions of the image. Calling `textureMode(IMAGE)` applies the default.
 *
 * Note: `textureMode()` can only be used in WebGL mode.
 *
 * @method  textureMode
 * @param {Constant} mode either IMAGE or NORMAL.
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * // Load an image and create a p5.Image object.
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('An image of a ceiling against a black background.');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Apply the image as a texture.
 *   texture(img);
 *
 *   // Draw the custom shape.
 *   // Use the image's width and height as uv coordinates.
 *   beginShape();
 *   vertex(-30, -30, 0, 0);
 *   vertex(30, -30, img.width, 0);
 *   vertex(30, 30, img.width, img.height);
 *   vertex(-30, 30, 0, img.height);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * // Load an image and create a p5.Image object.
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('An image of a ceiling against a black background.');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Set the texture mode.
 *   textureMode(NORMAL);
 *
 *   // Apply the image as a texture.
 *   texture(img);
 *
 *   // Draw the custom shape.
 *   // Use normalized uv coordinates.
 *   beginShape();
 *   vertex(-30, -30, 0, 0);
 *   vertex(30, -30, 1, 0);
 *   vertex(30, 30, 1, 1);
 *   vertex(-30, 30, 0, 1);
 *   endShape();
 * }
 * </code>
 * </div>
 */
p5.prototype.textureMode = function (mode) {
  if (mode !== constants.IMAGE && mode !== constants.NORMAL) {
    console.warn(
      `You tried to set ${mode} textureMode only supports IMAGE & NORMAL `
    );
  } else {
    this._renderer.textureMode = mode;
  }
};

/**
 * Changes the way textures behave when a shape’s uv coordinates go beyond the
 * texture.
 *
 * In order for <a href="#/p5/texture">texture()</a> to work, a shape needs a
 * way to map the points on its surface to the pixels in an image. Built-in
 * shapes such as <a href="#/p5/rect">rect()</a> and
 * <a href="#/p5/box">box()</a> already have these texture mappings based on
 * their vertices. Custom shapes created with
 * <a href="#/p5/vertex">vertex()</a> require texture mappings to be passed as
 * uv coordinates.
 *
 * Each call to <a href="#/p5/vertex">vertex()</a> must include 5 arguments,
 * as in `vertex(x, y, z, u, v)`, to map the vertex at coordinates `(x, y, z)`
 * to the pixel at coordinates `(u, v)` within an image. For example, the
 * corners of a rectangular image are mapped to the corners of a rectangle by default:
 *
 * ```js
 * // Apply the image as a texture.
 * texture(img);
 *
 * // Draw the rectangle.
 * rect(0, 0, 30, 50);
 * ```
 *
 * If the image in the code snippet above has dimensions of 300 x 500 pixels,
 * the same result could be achieved as follows:
 *
 * ```js
 * // Apply the image as a texture.
 * texture(img);
 *
 * // Draw the rectangle.
 * beginShape();
 *
 * // Top-left.
 * // u: 0, v: 0
 * vertex(0, 0, 0, 0, 0);
 *
 * // Top-right.
 * // u: 300, v: 0
 * vertex(30, 0, 0, 300, 0);
 *
 * // Bottom-right.
 * // u: 300, v: 500
 * vertex(30, 50, 0, 300, 500);
 *
 * // Bottom-left.
 * // u: 0, v: 500
 * vertex(0, 50, 0, 0, 500);
 *
 * endShape();
 * ```
 *
 * `textureWrap()` controls how textures behave when their uv's go beyond the
 * texture. Doing so can produce interesting visual effects such as tiling.
 * For example, the custom shape above could have u-coordinates are greater
 * than the image’s width:
 *
 * ```js
 * // Apply the image as a texture.
 * texture(img);
 *
 * // Draw the rectangle.
 * beginShape();
 * vertex(0, 0, 0, 0, 0);
 *
 * // Top-right.
 * // u: 600
 * vertex(30, 0, 0, 600, 0);
 *
 * // Bottom-right.
 * // u: 600
 * vertex(30, 50, 0, 600, 500);
 *
 * vertex(0, 50, 0, 0, 500);
 * endShape();
 * ```
 *
 * The u-coordinates of 600 are greater than the texture image’s width of 300.
 * This creates interesting possibilities.
 *
 * The first parameter, `wrapX`, accepts three possible constants. If `CLAMP`
 * is passed, as in `textureWrap(CLAMP)`, the pixels at the edge of the
 * texture will extend to the shape’s edges. If `REPEAT` is passed, as in
 * `textureWrap(REPEAT)`, the texture will tile repeatedly until reaching the
 * shape’s edges. If `MIRROR` is passed, as in `textureWrap(MIRROR)`, the
 * texture will tile repeatedly until reaching the shape’s edges, flipping
 * its orientation between tiles. By default, textures `CLAMP`.
 *
 * The second parameter, `wrapY`, is optional. It accepts the same three
 * constants, `CLAMP`, `REPEAT`, and `MIRROR`. If one of these constants is
 * passed, as in `textureWRAP(MIRROR, REPEAT)`, then the texture will `MIRROR`
 * horizontally and `REPEAT` vertically. By default, `wrapY` will be set to
 * the same value as `wrapX`.
 *
 * Note: `textureWrap()` can only be used in WebGL mode.
 *
 * @method textureWrap
 * @param {Constant} wrapX either CLAMP, REPEAT, or MIRROR
 * @param {Constant} [wrapY] either CLAMP, REPEAT, or MIRROR
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies128.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'An image of a landscape occupies the top-left corner of a square. Its edge colors smear to cover the other thre quarters of the square.'
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Set the texture mode.
 *   textureMode(NORMAL);
 *
 *   // Set the texture wrapping.
 *   // Note: CLAMP is the default mode.
 *   textureWrap(CLAMP);
 *
 *   // Apply the image as a texture.
 *   texture(img);
 *
 *   // Style the shape.
 *   noStroke();
 *
 *   // Draw the shape.
 *   // Use uv coordinates > 1.
 *   beginShape();
 *   vertex(-30, -30, 0, 0, 0);
 *   vertex(30, -30, 0, 2, 0);
 *   vertex(30, 30, 0, 2, 2);
 *   vertex(-30, 30, 0, 0, 2);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies128.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('Four identical images of a landscape arranged in a grid.');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Set the texture mode.
 *   textureMode(NORMAL);
 *
 *   // Set the texture wrapping.
 *   textureWrap(REPEAT);
 *
 *   // Apply the image as a texture.
 *   texture(img);
 *
 *   // Style the shape.
 *   noStroke();
 *
 *   // Draw the shape.
 *   // Use uv coordinates > 1.
 *   beginShape();
 *   vertex(-30, -30, 0, 0, 0);
 *   vertex(30, -30, 0, 2, 0);
 *   vertex(30, 30, 0, 2, 2);
 *   vertex(-30, 30, 0, 0, 2);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies128.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'Four identical images of a landscape arranged in a grid. The images are reflected horizontally and vertically, creating a kaleidoscope effect.'
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Set the texture mode.
 *   textureMode(NORMAL);
 *
 *   // Set the texture wrapping.
 *   textureWrap(MIRROR);
 *
 *   // Apply the image as a texture.
 *   texture(img);
 *
 *   // Style the shape.
 *   noStroke();
 *
 *   // Draw the shape.
 *   // Use uv coordinates > 1.
 *   beginShape();
 *   vertex(-30, -30, 0, 0, 0);
 *   vertex(30, -30, 0, 2, 0);
 *   vertex(30, 30, 0, 2, 2);
 *   vertex(-30, 30, 0, 0, 2);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies128.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'Four identical images of a landscape arranged in a grid. The top row and bottom row are reflections of each other.'
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Set the texture mode.
 *   textureMode(NORMAL);
 *
 *   // Set the texture wrapping.
 *   textureWrap(REPEAT, MIRROR);
 *
 *   // Apply the image as a texture.
 *   texture(img);
 *
 *   // Style the shape.
 *   noStroke();
 *
 *   // Draw the shape.
 *   // Use uv coordinates > 1.
 *   beginShape();
 *   vertex(-30, -30, 0, 0, 0);
 *   vertex(30, -30, 0, 2, 0);
 *   vertex(30, 30, 0, 2, 2);
 *   vertex(-30, 30, 0, 0, 2);
 *   endShape();
 * }
 * </code>
 * </div>
 */
p5.prototype.textureWrap = function (wrapX, wrapY = wrapX) {
  this._renderer.textureWrapX = wrapX;
  this._renderer.textureWrapY = wrapY;

  for (const texture of this._renderer.textures.values()) {
    texture.setWrapMode(wrapX, wrapY);
  }
};

/**
 * Sets the current material as a normal material.
 *
 * A normal material sets surfaces facing the x-axis to red, those facing the
 * y-axis to green, and those facing the z-axis to blue. Normal material isn't
 * affected by light. It’s often used as a placeholder material when debugging.
 *
 * Note: `normalMaterial()` can only be used in WebGL mode.
 *
 * @method normalMaterial
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A multicolor torus drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Style the torus.
 *   normalMaterial();
 *
 *   // Draw the torus.
 *   torus(30);
 * }
 * </code>
 * </div>
 */
p5.prototype.normalMaterial = function (...args) {
  this._assert3d('normalMaterial');
  p5._validateParameters('normalMaterial', args);
  this._renderer.drawMode = constants.FILL;
  this._renderer._useSpecularMaterial = false;
  this._renderer._useEmissiveMaterial = false;
  this._renderer._useNormalMaterial = true;
  this._renderer.curFillColor = [1, 1, 1, 1];
  this._renderer._setProperty('_doFill', true);
  this.noStroke();
  return this;
};

/**
 * Sets the ambient color of shapes’ surface material.
 *
 * The `ambientMaterial()` color sets the components of the
 * <a href="#/p5/ambientLight">ambientLight()</a> color that shapes will
 * reflect. For example, calling `ambientMaterial(255, 255, 0)` would cause a
 * shape to reflect red and green light, but not blue light.
 *
 * `ambientMaterial()` can be called three ways with different parameters to
 * set the material’s color.
 *
 * The first way to call `ambientMaterial()` has one parameter, `gray`.
 * Grayscale values between 0 and 255, as in `ambientMaterial(50)`, can be
 * passed to set the material’s color. Higher grayscale values make shapes
 * appear brighter.
 *
 * The second way to call `ambientMaterial()` has one parameter, `color`. A
 * <a href="#/p5.Color">p5.Color</a> object, an array of color values, or a
 * CSS color string, as in `ambientMaterial('magenta')`, can be passed to set
 * the material’s color.
 *
 * The third way to call `ambientMaterial()` has three parameters, `v1`, `v2`,
 * and `v3`. RGB, HSB, or HSL values, as in `ambientMaterial(255, 0, 0)`, can
 * be passed to set the material’s colors. Color values will be interpreted
 * using the current <a href="#/p5/colorMode">colorMode()</a>.
 *
 * Note: `ambientMaterial()` can only be used in WebGL mode.
 *
 * @method ambientMaterial
 * @param  {Number} v1  red or hue value in the current
 *                       <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number} v2  green or saturation value in the
 *                      current <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number} v3  blue, brightness, or lightness value in the
 *                      current <a href="#/p5/colorMode">colorMode()</a>.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A magenta cube drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a magenta ambient light.
 *   ambientLight(255, 0, 255);
 *
 *   // Draw the box.
 *   box();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A purple cube drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a magenta ambient light.
 *   ambientLight(255, 0, 255);
 *
 *   // Add a dark gray ambient material.
 *   ambientMaterial(150);
 *
 *   // Draw the box.
 *   box();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A red cube drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a magenta ambient light.
 *   ambientLight(255, 0, 255);
 *
 *   // Add a yellow ambient material using RGB values.
 *   ambientMaterial(255, 255, 0);
 *
 *   // Draw the box.
 *   box();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A red cube drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a magenta ambient light.
 *   ambientLight(255, 0, 255);
 *
 *   // Add a yellow ambient material using a p5.Color object.
 *   let c = color(255, 255, 0);
 *   ambientMaterial(c);
 *
 *   // Draw the box.
 *   box();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A red cube drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a magenta ambient light.
 *   ambientLight(255, 0, 255);
 *
 *   // Add a yellow ambient material using a color string.
 *   ambientMaterial('yellow');
 *
 *   // Draw the box.
 *   box();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A yellow cube drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a white ambient light.
 *   ambientLight(255, 255, 255);
 *
 *   // Add a yellow ambient material using a color string.
 *   ambientMaterial('yellow');
 *
 *   // Draw the box.
 *   box();
 * }
 * </code>
 * </div>
 */

/**
 * @method ambientMaterial
 * @param  {Number} gray grayscale value between 0 (black) and 255 (white).
 * @chainable
 */

/**
 * @method ambientMaterial
 * @param  {p5.Color|Number[]|String} color
 *           color as a <a href="#/p5.Color">p5.Color</a> object,
 *            an array of color values, or a CSS string.
 * @chainable
 */
p5.prototype.ambientMaterial = function (v1, v2, v3) {
  this._assert3d('ambientMaterial');
  p5._validateParameters('ambientMaterial', arguments);

  const color = p5.prototype.color.apply(this, arguments);
  this._renderer._hasSetAmbient = true;
  this._renderer.curAmbientColor = color._array;
  this._renderer._useNormalMaterial = false;
  this._renderer._enableLighting = true;
  this._renderer._setProperty('_doFill', true);
  return this;
};

/**
 * Sets the emissive color of shapes’ surface material.
 *
 * The `emissiveMaterial()` color sets a color shapes display at full
 * strength, regardless of lighting. This can give the appearance that a shape
 * is glowing. However, emissive materials don’t actually emit light that
 * can affect surrounding objects.
 *
 * `emissiveMaterial()` can be called three ways with different parameters to
 * set the material’s color.
 *
 * The first way to call `emissiveMaterial()` has one parameter, `gray`.
 * Grayscale values between 0 and 255, as in `emissiveMaterial(50)`, can be
 * passed to set the material’s color. Higher grayscale values make shapes
 * appear brighter.
 *
 * The second way to call `emissiveMaterial()` has one parameter, `color`. A
 * <a href="#/p5.Color">p5.Color</a> object, an array of color values, or a
 * CSS color string, as in `emissiveMaterial('magenta')`, can be passed to set
 * the material’s color.
 *
 * The third way to call `emissiveMaterial()` has four parameters, `v1`, `v2`,
 * `v3`, and `alpha`. `alpha` is optional. RGBA, HSBA, or HSLA values can be
 * passed to set the material’s colors, as in `emissiveMaterial(255, 0, 0)` or
 * `emissiveMaterial(255, 0, 0, 30)`. Color values will be interpreted using
 * the current <a href="#/p5/colorMode">colorMode()</a>.
 *
 * Note: `emissiveMaterial()` can only be used in WebGL mode.
 *
 * @method emissiveMaterial
 * @param  {Number} v1       red or hue value in the current
 *                           <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number} v2       green or saturation value in the
 *                           current <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number} v3       blue, brightness, or lightness value in the
 *                           current <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number} [alpha]  alpha value in the current
 *                           <a href="#/p5/colorMode">colorMode()</a>.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A red cube drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a white ambient light.
 *   ambientLight(255, 255, 255);
 *
 *   // Add a red emissive material using RGB values.
 *   emissiveMaterial(255, 0, 0);
 *
 *   // Draw the box.
 *   box();
 * }
 * </code>
 * </div>
 */

/**
 * @method emissiveMaterial
 * @param  {Number} gray grayscale value between 0 (black) and 255 (white).
 * @chainable
 */

/**
 * @method emissiveMaterial
 * @param  {p5.Color|Number[]|String} color
 *           color as a <a href="#/p5.Color">p5.Color</a> object,
 *            an array of color values, or a CSS string.
 * @chainable
 */
p5.prototype.emissiveMaterial = function (v1, v2, v3, a) {
  this._assert3d('emissiveMaterial');
  p5._validateParameters('emissiveMaterial', arguments);

  const color = p5.prototype.color.apply(this, arguments);
  this._renderer.curEmissiveColor = color._array;
  this._renderer._useEmissiveMaterial = true;
  this._renderer._useNormalMaterial = false;
  this._renderer._enableLighting = true;

  return this;
};

/**
 * Sets the specular color of shapes’ surface material.
 *
 * The `specularMaterial()` color sets the components of light color that
 * glossy coats on shapes will reflect. For example, calling
 * `specularMaterial(255, 255, 0)` would cause a shape to reflect red and
 * green light, but not blue light.
 *
 * Unlike <a href="#/p5/ambientMaterial">ambientMaterial()</a>,
 * `specularMaterial()` will reflect the full color of light sources including
 * <a href="#/p5/directionalLight">directionalLight()</a>,
 * <a href="#/p5/pointLight">pointLight()</a>,
 * and <a href="#/p5/spotLight">spotLight()</a>. This is what gives it shapes
 * their "shiny" appearance. The material’s shininess can be controlled by the
 * <a href="#/p5/shininess">shininess()</a> function.
 *
 * `specularMaterial()` can be called three ways with different parameters to
 * set the material’s color.
 *
 * The first way to call `specularMaterial()` has one parameter, `gray`.
 * Grayscale values between 0 and 255, as in `specularMaterial(50)`, can be
 * passed to set the material’s color. Higher grayscale values make shapes
 * appear brighter.
 *
 * The second way to call `specularMaterial()` has one parameter, `color`. A
 * <a href="#/p5.Color">p5.Color> object, an array of color values, or a CSS
 * color string, as in `specularMaterial('magenta')`, can be passed to set the
 * material’s color.
 *
 * The third way to call `specularMaterial()` has four parameters, `v1`, `v2`,
 * `v3`, and `alpha`. `alpha` is optional. RGBA, HSBA, or HSLA values can be
 * passed to set the material’s colors, as in `specularMaterial(255, 0, 0)` or
 * `specularMaterial(255, 0, 0, 30)`. Color values will be interpreted using
 * the current <a href="#/p5/colorMode">colorMode()</a>.
 *
 * @method specularMaterial
 * @param  {Number} gray grayscale value between 0 (black) and 255 (white).
 * @param  {Number} [alpha] alpha value in the current current
 *                          <a href="#/p5/colorMode">colorMode()</a>.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 * // Double-click the canvas to apply a specular material.
 *
 * let isGlossy = false;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A red torus drawn on a gray background. It becomes glossy when the user double-clicks.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a white point light at the top-right.
 *   pointLight(255, 255, 255, 30, -40, 30);
 *
 *   // Add a glossy coat if the user has double-clicked.
 *   if (isGlossy === true) {
 *     specularMaterial(255);
 *     shininess(50);
 *   }
 *
 *   // Style the torus.
 *   noStroke();
 *   fill(255, 0, 0);
 *
 *   // Draw the torus.
 *   torus(30);
 * }
 *
 * // Make the torus glossy when the user double-clicks.
 * function doubleClicked() {
 *   isGlossy = true;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 * // Double-click the canvas to apply a specular material.
 *
 * let isGlossy = false;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'A red torus drawn on a gray background. It becomes glossy and reflects green light when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a white point light at the top-right.
 *   pointLight(255, 255, 255, 30, -40, 30);
 *
 *   // Add a glossy green coat if the user has double-clicked.
 *   if (isGlossy === true) {
 *     specularMaterial(0, 255, 0);
 *     shininess(50);
 *   }
 *
 *   // Style the torus.
 *   noStroke();
 *   fill(255, 0, 0);
 *
 *   // Draw the torus.
 *   torus(30);
 * }
 *
 * // Make the torus glossy when the user double-clicks.
 * function doubleClicked() {
 *   isGlossy = true;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 * // Double-click the canvas to apply a specular material.
 *
 * let isGlossy = false;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'A red torus drawn on a gray background. It becomes glossy and reflects green light when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a white point light at the top-right.
 *   pointLight(255, 255, 255, 30, -40, 30);
 *
 *   // Add a glossy green coat if the user has double-clicked.
 *   if (isGlossy === true) {
 *     // Create a p5.Color object.
 *     let c = color('green');
 *     specularMaterial(c);
 *     shininess(50);
 *   }
 *
 *   // Style the torus.
 *   noStroke();
 *   fill(255, 0, 0);
 *
 *   // Draw the torus.
 *   torus(30);
 * }
 *
 * // Make the torus glossy when the user double-clicks.
 * function doubleClicked() {
 *   isGlossy = true;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 * // Double-click the canvas to apply a specular material.
 *
 * let isGlossy = false;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'A red torus drawn on a gray background. It becomes glossy and reflects green light when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on a white point light at the top-right.
 *   pointLight(255, 255, 255, 30, -40, 30);
 *
 *   // Add a glossy green coat if the user has double-clicked.
 *   if (isGlossy === true) {
 *     specularMaterial('#00FF00');
 *     shininess(50);
 *   }
 *
 *   // Style the torus.
 *   noStroke();
 *   fill(255, 0, 0);
 *
 *   // Draw the torus.
 *   torus(30);
 * }
 *
 * // Make the torus glossy when the user double-clicks.
 * function doubleClicked() {
 *   isGlossy = true;
 * }
 * </code>
 * </div>
 */

/**
 * @method specularMaterial
 * @param  {Number}        v1      red or hue value in
 *                                 the current <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number}        v2      green or saturation value
 *                                 in the current <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number}        v3      blue, brightness, or lightness value
 *                                 in the current <a href="#/p5/colorMode">colorMode()</a>.
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method specularMaterial
 * @param  {p5.Color|Number[]|String} color
 *           color as a <a href="#/p5.Color">p5.Color</a> object,
 *            an array of color values, or a CSS string.
 * @chainable
 */
p5.prototype.specularMaterial = function (v1, v2, v3, alpha) {
  this._assert3d('specularMaterial');
  p5._validateParameters('specularMaterial', arguments);

  const color = p5.prototype.color.apply(this, arguments);
  this._renderer.curSpecularColor = color._array;
  this._renderer._useSpecularMaterial = true;
  this._renderer._useNormalMaterial = false;
  this._renderer._enableLighting = true;

  return this;
};

/**
 * Sets the amount of gloss ("shininess") of a
 * <a href="#/p5/specularMaterial">specularMaterial()</a>.
 *
 * Shiny materials focus reflected light more than dull materials.
 * `shininess()` affects the way materials reflect light sources including
 * <a href="#/p5/directionalLight">directionalLight()</a>,
 * <a href="#/p5/pointLight">pointLight()</a>,
 * and <a href="#/p5/spotLight">spotLight()</a>.
 *
 * The parameter, `shine`, is a number that sets the amount of shininess.
 * `shine` must be greater than 1, which is its default value.
 *
 * @method shininess
 * @param {Number} shine amount of shine.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'Two red spheres drawn on a gray background. White light reflects from their surfaces as the mouse moves. The right sphere is shinier than the left sphere.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Turn on a red ambient light.
 *   ambientLight(255, 0, 0);
 *
 *   // Get the mouse's coordinates.
 *   let mx = mouseX - 50;
 *   let my = mouseY - 50;
 *
 *   // Turn on a white point light that follows the mouse.
 *   pointLight(255, 255, 255, mx, my, 50);
 *
 *   // Style the sphere.
 *   noStroke();
 *
 *   // Add a specular material with a grayscale value.
 *   specularMaterial(255);
 *
 *   // Draw the left sphere with low shininess.
 *   translate(-25, 0, 0);
 *   shininess(10);
 *   sphere(20);
 *
 *   // Draw the right sphere with high shininess.
 *   translate(50, 0, 0);
 *   shininess(100);
 *   sphere(20);
 * }
 * </code>
 * </div>
 */
p5.prototype.shininess = function (shine) {
  this._assert3d('shininess');
  p5._validateParameters('shininess', arguments);

  if (shine < 1) {
    shine = 1;
  }
  this._renderer._useShininess = shine;
  return this;
};

/**
 * Sets the amount of "metalness" of a
 * <a href="#/p5/specularMaterial">specularMaterial()</a>.
 *
 * `metalness()` can make materials appear more metallic. It affects the way
 * materials reflect light sources including
 * affects the way materials reflect light sources including
 * <a href="#/p5/directionalLight">directionalLight()</a>,
 * <a href="#/p5/pointLight">pointLight()</a>,
 * <a href="#/p5/spotLight">spotLight()</a>, and
 * <a href="#/p5/imageLight">imageLight()</a>.
 *
 * The parameter, `metallic`, is a number that sets the amount of metalness.
 * `metallic` must be greater than 1, which is its default value. Higher
 * values, such as `metalness(100)`, make specular materials appear more
 * metallic.
 *
 * @method metalness
 * @param {Number} metallic amount of metalness.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'Two blue spheres drawn on a gray background. White light reflects from their surfaces as the mouse moves. The right sphere is more metallic than the left sphere.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Turn on an ambient light.
 *   ambientLight(200);
 *
 *   // Get the mouse's coordinates.
 *   let mx = mouseX - 50;
 *   let my = mouseY - 50;
 *
 *   // Turn on a white point light that follows the mouse.
 *   pointLight(255, 255, 255, mx, my, 50);
 *
 *   // Style the spheres.
 *   noStroke();
 *   fill(30, 30, 255);
 *   specularMaterial(255);
 *   shininess(20);
 *
 *   // Draw the left sphere with low metalness.
 *   translate(-25, 0, 0);
 *   metalness(1);
 *   sphere(20);
 *
 *   // Draw the right sphere with high metalness.
 *   translate(50, 0, 0);
 *   metalness(50);
 *   sphere(20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/outdoor_spheremap.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100 ,100 ,WEBGL);
 *
 *   describe(
 *     'Two spheres floating above a landscape. The surface of the spheres reflect the landscape. The right sphere is more reflective than the left sphere.'
 *   );
 * }
 *
 * function draw() {
 *   // Add the panorama.
 *   panorama(img);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Use the image as a light source.
 *   imageLight(img);
 *
 *   // Style the spheres.
 *   noStroke();
 *   specularMaterial(50);
 *   shininess(200);
 *
 *   // Draw the left sphere with low metalness.
 *   translate(-25, 0, 0);
 *   metalness(1);
 *   sphere(20);
 *
 *   // Draw the right sphere with high metalness.
 *   translate(50, 0, 0);
 *   metalness(50);
 *   sphere(20);
 * }
 * </code>
 * </div>
 */
p5.prototype.metalness = function (metallic) {
  this._assert3d('metalness');
  const metalMix = 1 - Math.exp(-metallic / 100);
  this._renderer._useMetalness = metalMix;
  return this;
};

/**
 * @private blends colors according to color components.
 * If alpha value is less than 1, or non-standard blendMode
 * we need to enable blending on our gl context.
 * @param  {Number[]} color The currently set color, with values in 0-1 range
 * @param  {Boolean} [hasTransparency] Whether the shape being drawn has other
 * transparency internally, e.g. via vertex colors
 * @return {Number[]}  Normalized numbers array
 */
p5.RendererGL.prototype._applyColorBlend = function(colors, hasTransparency) {
  const gl = this.GL;

  const isTexture = this.drawMode === constants.TEXTURE;
  const doBlend =
    hasTransparency ||
    this.userFillShader ||
    this.userStrokeShader ||
    this.userPointShader ||
    isTexture ||
    this.curBlendMode !== constants.BLEND ||
    colors[colors.length - 1] < 1.0 ||
    this._isErasing;

  if (doBlend !== this._isBlending) {
    if (
      doBlend ||
      (this.curBlendMode !== constants.BLEND &&
        this.curBlendMode !== constants.ADD)
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
};

/**
 * @private sets blending in gl context to curBlendMode
 * @param  {Number[]} color [description]
 * @return {Number[]}  Normalized numbers array
 */
p5.RendererGL.prototype._applyBlendMode = function () {
  if (this._cachedBlendMode === this.curBlendMode) {
    return;
  }
  const gl = this.GL;
  switch (this.curBlendMode) {
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
        'Oops! Somehow RendererGL set curBlendMode to an unsupported mode.'
      );
      break;
  }
  if (!this._isErasing) {
    this._cachedBlendMode = this.curBlendMode;
  }
};

export default p5;
