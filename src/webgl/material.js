/**
 * @module 3D
 * @submodule Material
 * @for p5
 * @requires core
 */

import * as constants from "../core/constants";
import { Renderer3D } from "../core/p5.Renderer3D";
import { Shader } from "./p5.Shader";
import { request } from "../io/files";
import { Color } from "../color/p5.Color";

async function urlToStrandsCallback(url) {
  const src = await fetch(url).then((res) => res.text());
  return new Function(src);
}

function withGlobalStrands(p5, cb) {
  const prevGlobalStrands = p5._runStrandsInGlobalMode;
  p5._runStrandsInGlobalMode = true;
  try {
    return cb();
  } finally {
    p5._runStrandsInGlobalMode = prevGlobalStrands;
  }
}

function material(p5, fn) {
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
   * parameter. The return value of the `successCallback()` function will be used
   * as the final return value of `loadShader()`.
   *
   * The fourth parameter, `failureCallback`, is also optional. If a function is
   * passed, it will be called if the shader fails to load. The callback
   * function can use the event error as its parameter. The return value of the `
   * failureCallback()` function will be used as the final return value of `loadShader()`.
   *
   * This function returns a `Promise` and should be used in an `async` setup with
   * `await`. See the examples for the usage syntax.
   *
   * Note: Shaders can only be used in WebGL mode.
   *
   * @method loadShader
   * @param {String|Request} vertFilename path of the vertex shader to be loaded.
   * @param {String|Request} fragFilename path of the fragment shader to be loaded.
   * @param {Function} [successCallback] function to call once the shader is loaded. Can be passed the
   *                                     <a href="#/p5.Shader">p5.Shader</a> object.
   * @param {Function} [failureCallback] function to call if the shader fails to load. Can be passed an
   *                                     `Error` event object.
   * @return {Promise<p5.Shader>} new shader created from the vertex and fragment shader files.
   *
   * @example
   * // Note: A "uniform" is a global variable within a shader program.
   *
   * let mandelbrot;
   *
   * // Load the shader and create a p5.Shader object.
   * async function setup() {
   *   mandelbrot = await loadShader('assets/shader.vert', 'assets/shader.frag');
   *
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
   *
   * @example
   * // Note: A "uniform" is a global variable within a shader program.
   *
   * let mandelbrot;
   *
   * // Load the shader and create a p5.Shader object.
   * async function setup() {
   *   mandelbrot = await loadShader('assets/shader.vert', 'assets/shader.frag');
   *
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
   */
  fn.loadShader = async function (
    vertFilename,
    fragFilename,
    successCallback,
    failureCallback,
  ) {
    // p5._validateParameters('loadShader', arguments);

    const loadedShader = new Shader();

    try {
      loadedShader._vertSrc = (await request(vertFilename, "text")).data;
      loadedShader._fragSrc = (await request(fragFilename, "text")).data;

      if (successCallback) {
        return successCallback(loadedShader) || loadedShader;
      } else {
        return loadedShader;
      }
    } catch (err) {
      if (failureCallback) {
        return failureCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * Creates a new <a href="#/p5.Shader">p5.Shader</a> object using GLSL.
   *
   * If you are interested in writing shaders, consider using p5.strands shaders using
   * <a href="#/p5/buildMaterialShader">`buildMaterialShader`<a>,
   * <a href="#/p5/buildStrokeShader">`buildStrokeShader`</a>, or
   * <a href="#/p5/buildFilterShader">`buildFilterShader`</a>.
   * With p5.strands, you can modify existing shaders using JavaScript. With
   * `createShader`, shaders are made from scratch, and are written in GLSL. This
   * will be most useful for advanced cases, and for authors of add-on libraries.
   *
   * Shaders are programs that run on the graphics processing unit (GPU). They
   * can process many pixels at the same time, making them fast for many
   * graphics tasks.
   *
   * Once the <a href="#/p5.Shader">p5.Shader</a> object is created, it can be
   * used with the <a href="#/p5/shader">shader()</a> function, as in
   * `shader(myShader)`. A GLSL shader program consists of two parts, a vertex shader
   * and a fragment shader. The vertex shader affects where 3D geometry is drawn
   * on the screen and the fragment shader affects color.
   *
   * The first parameter, `vertSrc`, sets the vertex shader. It’s a string that
   * contains the vertex shader program written in GLSL.
   *
   * The second parameter, `fragSrc`, sets the fragment shader. It’s a string
   * that contains the fragment shader program written in GLSL.
   *
   * Here is a simple example with a simple vertex shader that applies whatevre
   * transformations have been set, and a simple fragment shader that ignores
   * all material settings and just outputs yellow:
   *
   * ```js example
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
   * ```
   *
   * Fragment shaders are often the fastest way to dynamically create per-pixel textures.
   * Here is an example of a fractal being drawn in the fragment shader. It also creates custom
   * *uniform* variables in the shader, which can be set from your main sketch code. By passing
   * the time in as a uniform, we can animate the fractal in the shader.
   *
   * ```js example
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
   *   // Add a plane as a drawing surface.
   *   noStroke();
   *   plane(100, 100);
   * }
   * ```
   *
   * A shader can optionally describe *hooks,* which are functions in GLSL that
   * users may choose to provide to customize the behavior of the shader using the
   * <a href="#/p5.Shader/modify">`modify()`</a> method of `p5.Shader`. Users can
   * write their modifications using p5.strands, without needing to learn GLSL.
   *
   * These are added by
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
   * Then, a user of your shader can modify it with p5.strands. Here is what
   * that looks like when we put everything together:
   *
   * ```js example
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
   *   createCanvas(100, 100, WEBGL);
   *
   *   // Create a shader with hooks. By default, this hook returns
   *   // the initial value.
   *   myShader = createShader(vertSrc, fragSrc, {
   *     fragment: {
   *       'vec4 getColor': '(vec4 color) { return color; }'
   *     }
   *   });
   *
   *   // Make a version of the shader with a hook overridden
   *   modifiedShader = myShader.modify(() => {
   *     // Create new uniforms and override the getColor hook
   *     let t = uniformFloat(() => millis() / 1000);
   *     getColor(() => {
   *       return [0, 0.5 + 0.5 * sin(t), 1, 1];
   *     });
   *   });
   * }
   *
   * function draw() {
   *   noStroke();
   *
   *   push();
   *   shader(myShader);
   *   translate(-width/3, 0);
   *   sphere(20);
   *   pop();
   *
   *   push();
   *   shader(modifiedShader);
   *   translate(width/3, 0);
   *   sphere(20);
   *   pop();
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
   * @param {Object} [options.vertex] An object describing the available vertex shader hooks.
   * @param {Object} [options.fragment] An object describing the available frament shader hooks.
   * @returns {p5.Shader} new shader object created from the
   * vertex and fragment shaders.
   */
  fn.createShader = function (vertSrc, fragSrc, options) {
    // p5._validateParameters('createShader', arguments);
    return new Shader(this._renderer, vertSrc, fragSrc, options);
  };

  /**
   * Loads a new shader from a file that can be applied to the contents of the canvas with
   * <a href="#/p5/filter">`filter()`</a>. Pass the resulting shader into `filter()` to apply it.
   *
   * Since this function loads data from another file, it returns a `Promise`.
   * Use it in an `async function setup`, and `await` its result.
   *
   * ```js
   * async function setup() {
   *   createCanvas(50, 50, WEBGL);
   *   let img = await loadImage('assets/bricks.jpg');
   *   let myFilter = await loadFilterShader('myFilter.js');
   *
   *   image(img, -50, -50);
   *   filter(myFilter);
   *   describe('Bricks tinted red');
   * }
   * ```
   *
   * Inside your shader file, you can use p5.strands hooks to change parts of the shader. For
   * a filter shader, use `filterColor` to change each pixel on the canvas.
   *
   * ```js
   * // myFilter.js
   * filterColor.begin();
   * let result = getTexture(
   *   filterColor.canvasContent,
   *   filterColor.texCoord
   * );
   * // Zero out the green and blue channels, leaving red
   * result.g = 0;
   * result.b = 0;
   * filterColor.set(result);
   * filterColor.end();
   * ```
   *
   * Read the reference for <a href="#/p5/buildFilterShader">`buildFilterShader`</a>,
   * the version of `loadFilterShader` that takes in a function instead of a separate file,
   * for more examples.
   *
   * The second parameter, `successCallback`, is optional. If a function is passed, as in
   * `loadFilterShader('myShader.js', onLoaded)`, then the `onLoaded()` function will be called
   * once the shader loads. The shader will be passed to `onLoaded()` as its only argument.
   * The return value of `handleData()`, if present, will be used as the final return value of
   * `loadFilterShader('myShader.js', onLoaded)`.
   *
   * @method loadFilterShader
   * @submodule p5.strands
   * @param {String} filename path to a p5.strands JavaScript file or a GLSL fragment shader file
   * @param {Function} [successCallback] callback to be called once the shader is
   *                                     loaded. Will be passed the
   *                                     <a href="#/p5.Shader">p5.Shader</a> object.
   * @param {Function} [failureCallback] callback to be called if there is an error
   *                                     loading the shader. Will be passed the
   *                                     error event.
   * @return {Promise<p5.Shader>} a promise that resolves with a shader object
   */
  fn.loadFilterShader = async function (
    fragFilename,
    successCallback,
    failureCallback,
  ) {
    // p5._validateParameters('loadFilterShader', arguments);
    try {
      // Load the fragment shader
      const fragSrc = await this.loadStrings(fragFilename);
      const fragString = await fragSrc.join("\n");

      // Test if we've loaded GLSL or not by checking for the existence of `void main`
      let loadedShader;
      if (/void\s+main/.exec(fragString)) {
        loadedShader = this.createFilterShader(fragString, true);
      } else {
        loadedShader = withGlobalStrands(this, () =>
          this.baseFilterShader().modify(new Function(fragString)),
        );
      }

      if (successCallback) {
        loadedShader = successCallback(loadedShader) || loadedShader;
      }

      return loadedShader;
    } catch (err) {
      if (failureCallback) {
        failureCallback(err);
      } else {
        console.error(err);
      }
    }
  };

  /**
   * Creates a <a href="#/p5.Shader">p5.Shader</a> object to be used with the
   * <a href="#/p5/filter">filter()</a> function.
   *
   * The main way to use `buildFilterShader` is to pass a function in as a parameter.
   * This will let you create a shader using p5.strands.
   *
   * In your function, you can use <a href="#/p5/filterColor">`filterColor`</a> with a function
   * that will be called for each pixel on the image to determine its final color. You can
   * read the color of the current pixel with `getTexture(canvasContent, coord)`.
   * See <a href="#/p5/getTexture">getTexture()</a>.
   *
   * ```js example
   * async function setup() {
   *   createCanvas(50, 50, WEBGL);
   *   let img = await loadImage('assets/bricks.jpg');
   *   let myFilter = buildFilterShader(tintShader);
   *
   *   image(img, -50, -50);
   *   filter(myFilter);
   *   describe('Bricks tinted red');
   * }
   *
   * function tintShader() {
   *   filterColor.begin();
   *   let result = getTexture(
   *     filterColor.canvasContent,
   *     filterColor.texCoord
   *   );
   *   // Zero out the green and blue channels, leaving red
   *   result.g = 0;
   *   result.b = 0;
   *   filterColor.set(result);
   *   filterColor.end();
   * }
   * ```
   *
   * You can create *uniforms* if you want to pass data into your filter from the rest of your sketch.
   * For example, you could pass in the mouse cursor position and use that to control how much
   * you warp the content. If you create a uniform inside the shader using a function like `uniformFloat()`, with
   * `uniform` + the type of the data, you can set its value using `setUniform` right before applying the filter.
   * In the example below, move your mouse across the image to see it update the `warpAmount` uniform:
   *
   * ```js example
   * let img;
   * let myFilter;
   * async function setup() {
   *   createCanvas(50, 50, WEBGL);
   *   img = await loadImage('assets/bricks.jpg');
   *   myFilter = buildFilterShader(warpShader);
   *   describe('Warped bricks');
   * }
   *
   * function warpShader() {
   *   let warpAmount = uniformFloat();
   *   filterColor.begin();
   *   let coord = filterColor.texCoord;
   *   coord.y += sin(coord.x * 10) * warpAmount;
   *   filterColor.set(
   *     getTexture(filterColor.canvasContent, coord)
   *   );
   *   filterColor.end();
   * }
   *
   * function draw() {
   *   image(img, -50, -50);
   *   myFilter.setUniform(
   *     'warpAmount',
   *     map(mouseX, 0, width, 0, 1, true)
   *   );
   *   filter(myFilter);
   * }
   * ```
   *
   * You can also make filters that do not need any content to be drawn first!
   * There is a lot you can draw just using, for example, the position of the pixel.
   * `inputs.texCoord` has an `x` and a `y` property, each with a number between 0 and 1.
   *
   * ```js example
   * function setup() {
   *   createCanvas(50, 50, WEBGL);
   *   let myFilter = buildFilterShader(gradient);
   *   describe('A gradient with red, green, yellow, and black');
   *   filter(myFilter);
   * }
   *
   * function gradient() {
   *   filterColor.begin();
   *   filterColor.set([filterColor.texCoord.x, filterColor.texCoord.y, 0, 1]);
   *   filterColor.end();
   * }
   * ```
   *
   * ```js example
   * function setup() {
   *   createCanvas(50, 50, WEBGL);
   *   let myFilter = buildFilterShader(gradient);
   *   describe('A gradient from red to blue');
   *   filter(myFilter);
   * }
   *
   * function gradient() {
   *   filterColor.begin();
   *   filterColor.set(mix(
   *     [1, 0, 0, 1], // Red
   *     [0, 0, 1, 1], // Blue
   *     filterColor.texCoord.x // x coordinate, from 0 to 1
   *   ));
   *   filterColor.end();
   * }
   * ```
   *
   * You can also animate your filters over time by passing the time into the shader with `uniformFloat`.
   *
   * ```js example
   * let myFilter;
   * function setup() {
   *   createCanvas(50, 50, WEBGL);
   *   myFilter = buildFilterShader(gradient);
   *   describe('A moving, repeating gradient from red to blue');
   * }
   *
   * function gradient() {
   *   let time = uniformFloat();
   *   filterColor.begin();
   *   filterColor.set(mix(
   *     [1, 0, 0, 1], // Red
   *     [0, 0, 1, 1], // Blue
   *     sin(filterColor.texCoord.x*15 + time*0.004)/2+0.5
   *   ));
   *   filterColor.end();
   * }
   *
   * function draw() {
   *   myFilter.setUniform('time', millis());
   *   filter(myFilter);
   * }
   * ```
   *
   * Like the `modify()` method on shaders,
   * advanced users can also fill in `filterColor` using <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
   * instead of JavaScript.
   * Read the <a href="#/p5.Shader/modify">reference entry for `modify()`</a>
   * for more info. Alternatively, `buildFilterShader()` can also be used like
   * <a href="#/p5/createShader">createShader()</a>, but where you only specify a fragment shader.
   *
   * For more info about filters and shaders, see Adam Ferriss' <a href="https://github.com/aferriss/p5jsShaderExamples">repo of shader examples</a>
   * or the <a href="https://p5js.org/learn/getting-started-in-webgl-shaders.html">Introduction to Shaders</a> tutorial.
   *
   * @method buildFilterShader
   * @beta
   * @submodule p5.strands
   * @param {Function} callback A function building a p5.strands shader.
   * @returns {p5.Shader} The material shader
   */
  /**
   * @method buildFilterShader
   * @param {Object} hooks An object specifying p5.strands hooks in GLSL.
   * @returns {p5.Shader} The material shader
   */
  fn.buildFilterShader = function (callback) {
    return this.baseFilterShader().modify(callback);
  };

  /**
   * Creates a <a href="#/p5.Shader">p5.Shader</a> object to be used with the
   * <a href="#/p5/filter">filter()</a> function using GLSL.
   *
   * Since this method requires you to write your shaders in GLSL, it is most suitable
   * for advanced use cases. Consider using <a href="#/p5/buildFilterShader">`buildFilterShader`</a>
   * first, as a way to create filters in JavaScript using p5.strands.
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
   *
   * @example
   * let img, s;
   * async function setup() {
   *   img = await loadImage('assets/bricks.jpg');
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
   *
   * function draw() {
   *   image(img, -50, -50);
   *   s.setUniform('darkness', 0.5);
   *   filter(s);
   *   describe('a image of bricks tinted dark blue');
   * }
   */
  fn.createFilterShader = function (fragSrc, skipContextCheck = false) {
    // p5._validateParameters('buildFilterShader', arguments);
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
    let vertSrc = fragSrc.includes("#version 300 es")
      ? defaultVertV2
      : defaultVertV1;
    const shader = new Shader(this._renderer, vertSrc, fragSrc);
    if (!skipContextCheck) {
      if (this._renderer.GL) {
        shader.ensureCompiledOnContext(this._renderer);
      } else {
        shader.ensureCompiledOnContext(this);
      }
    }
    return shader;
  };

  /**
   * Sets the <a href="#/p5.Shader">p5.Shader</a> object to apply while drawing.
   *
   * Shaders are programs that run on the graphics processing unit (GPU). They
   * can process many pixels or vertices at the same time, making them fast for
   * many graphics tasks.
   *
   * You can make new shaders using p5.strands with the
   * <a href="#/p5/buildMaterialShader">`buildMaterialShader`</a>,
   * <a href="#/p5/buildColorShader">`buildColorShader`</a>, and
   * <a href="#/p5/buildNormalShader">`buildNormalShader`</a> functions. You can also use
   * <a href="#/p5/buildFilterShader">`buildFilterShader`</a> alongside
   * <a href="#/p5/filter">`filter`</a>, and
   * <a href="#/p5/buildStrokeShader">`buildStrokeShader`</a> alongside
   * <a href="#/p5/stroke">`stroke`</a>.
   *
   * The parameter, `s`, is the <a href="#/p5.Shader">p5.Shader</a> object to
   * apply. For example, calling `shader(myShader)` applies `myShader` to
   * process each pixel on the canvas. This only changes the fill (the inner part of shapes),
   * but does not affect the outlines (strokes) or any images drawn using the `image()` function.
   * The source code from a <a href="#/p5.Shader">p5.Shader</a> object's
   * fragment and vertex shaders will be compiled the first time it's passed to
   * `shader()`.
   *
   * Calling <a href="#/p5/resetShader">resetShader()</a> restores a sketch’s
   * default shaders.
   *
   * Note: Shaders can only be used in WebGL mode.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(material);
   *   noStroke();
   *   describe('A square with dynamically changing colors on a beige background.');
   * }
   *
   * function material() {
   *   let time = uniformFloat();
   *   finalColor.begin();
   *   let r = 0.2 + 0.5 * abs(sin(time + 0));
   *   let g = 0.2 + 0.5 * abs(sin(time + 1));
   *   let b = 0.2 + 0.5 * abs(sin(time + 2));
   *   finalColor.set([r, g, b, 1]);
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(245, 245, 220);
   *   myShader.setUniform('time', millis() / 1000);
   *   shader(myShader);
   *
   *   rectMode(CENTER);
   *   rect(0, 0, 50, 50);
   * }
   * ```
   *
   * For advanced usage, shaders can be written in a language called
   * <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>.
   * <a href="#/p5.Shader">p5.Shader</a> objects can be created in this way using the
   * <a href="#/p5/createShader">createShader()</a> and
   * <a href="#/p5/loadShader">loadShader()</a> functions.
   *
   * ```js
   * let fillShader;
   *
   * let vertSrc = `
   * precision highp float;
   * attribute vec3 aPosition;
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   * varying vec3 vPosition;
   *
   * void main() {
   *   vPosition = aPosition;
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
   * }
   * `;
   *
   * let fragSrc = `
   * precision highp float;
   * uniform vec3 uLightDir;
   * varying vec3 vPosition;
   *
   * void main() {
   *   vec3 lightDir = normalize(uLightDir);
   *   float brightness = dot(lightDir, normalize(vPosition));
   *   brightness = clamp(brightness, 0.4, 1.0);
   *   vec3 color = vec3(0.3, 0.5, 1.0);
   *   color = color * brightness * 3.0;
   *   gl_FragColor = vec4(color, 1.0);
   * }
   * `;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   fillShader = createShader(vertSrc, fragSrc);
   *   noStroke();
   *   describe('A rotating torus with simulated directional lighting.');
   * }
   *
   * function draw() {
   *   background(20, 20, 40);
   *   let lightDir = [0.5, 0.5, 1.0];
   *   fillShader.setUniform('uLightDir', lightDir);
   *   shader(fillShader);
   *   rotateY(frameCount * 0.02);
   *   rotateX(frameCount * 0.02);
   *   torus(25, 10, 30, 30);
   * }
   * ```
   *
   * ```js example
   * let fillShader;
   *
   * let vertSrc = `
   * precision highp float;
   * attribute vec3 aPosition;
   * uniform mat4 uProjectionMatrix;
   * uniform mat4 uModelViewMatrix;
   * varying vec3 vPosition;
   * void main() {
   *   vPosition = aPosition;
   *   gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
   * }
   * `;
   *
   * let fragSrc = `
   * precision highp float;
   * uniform vec3 uLightPos;
   * uniform vec3 uFillColor;
   * varying vec3 vPosition;
   * void main() {
   *   float brightness = dot(normalize(uLightPos), normalize(vPosition));
   *   brightness = clamp(brightness, 0.0, 1.0);
   *   vec3 color = uFillColor * brightness;
   *   gl_FragColor = vec4(color, 1.0);
   * }
   * `;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   fillShader = createShader(vertSrc, fragSrc);
   *   shader(fillShader);
   *   noStroke();
   *   describe('A square affected by both fill color and lighting, with lights controlled by mouse.');
   * }
   *
   * function draw() {
   *   let lightPos = [(mouseX - width / 2) / width,
   *     (mouseY - height / 2) / height, 1.0];
   *   fillShader.setUniform('uLightPos', lightPos);
   *   let fillColor = [map(mouseX, 0, width, 0, 1),
   *     map(mouseY, 0, height, 0, 1), 0.5];
   *   fillShader.setUniform('uFillColor', fillColor);
   *   plane(width, height);
   * }
   * ```
   *
   * <div>
   * <p>
   *
   * If you want to apply shaders to strokes or images, use the following methods:
   * - <a href="#/p5/strokeShader">strokeShader()</a> : Applies a shader to the stroke (outline) of shapes, allowing independent control over the stroke rendering using shaders.
   * - <a href="#/p5/imageShader">imageShader()</a> : Applies a shader to images or textures, controlling how the shader modifies their appearance during rendering.
   *
   * </p>
   * </div>
   *
   *
   * @method shader
   * @chainable
   * @param {p5.Shader} s <a href="#/p5.Shader">p5.Shader</a> object
   *                      to apply.
   *
   */
  fn.shader = function (s) {
    this._assert3d('shader');
    // p5._validateParameters('shader', arguments);

    this._renderer.shader(s);

    return this;
  };

  /**
   * Sets the <a href="#/p5.Shader">p5.Shader</a> object to apply for strokes.
   *
   * This method applies the given shader to strokes, allowing customization of
   * how lines and outlines are drawn in 3D space. The shader will be used for
   * strokes until <a href="#/p5/resetShader">resetShader()</a> is called or another
   * strokeShader is applied.
   *
   * The shader will be used for:
   * - Strokes only, regardless of whether the uniform `uStrokeWeight` is present.
   *
   * To further customize its behavior, refer to the various hooks provided by
   * the <a href="#/p5/baseStrokeShader">baseStrokeShader()</a> method, which allow
   * control over stroke weight, vertex positions, colors, and more.
   *
   * @method strokeShader
   * @chainable
   * @param {p5.Shader} s <a href="#/p5.Shader">p5.Shader</a> object
   *                      to apply for strokes.
   *
   *
   * @example
   * let animatedStrokeShader;
   *
   * let vertSrc = `
   * precision mediump int;
   *
   * uniform mat4 uModelViewMatrix;
   * uniform mat4 uProjectionMatrix;
   * uniform float uStrokeWeight;
   *
   * uniform bool uUseLineColor;
   * uniform vec4 uMaterialColor;
   *
   * uniform vec4 uViewport;
   * uniform int uPerspective;
   * uniform int uStrokeJoin;
   *
   * attribute vec4 aPosition;
   * attribute vec3 aTangentIn;
   * attribute vec3 aTangentOut;
   * attribute float aSide;
   * attribute vec4 aVertexColor;
   *
   * void main() {
   *   vec4 posp = uModelViewMatrix * aPosition;
   *   vec4 posqIn = uModelViewMatrix * (aPosition + vec4(aTangentIn, 0));
   *   vec4 posqOut = uModelViewMatrix * (aPosition + vec4(aTangentOut, 0));
   *
   *   float facingCamera = pow(
   *     abs(normalize(posqIn-posp).z),
   *     0.25
   *   );
   *
   *   float scale = mix(1., 0.995, facingCamera);
   *
   *   posp.xyz = posp.xyz * scale;
   *   posqIn.xyz = posqIn.xyz * scale;
   *   posqOut.xyz = posqOut.xyz * scale;
   *
   *   vec4 p = uProjectionMatrix * posp;
   *   vec4 qIn = uProjectionMatrix * posqIn;
   *   vec4 qOut = uProjectionMatrix * posqOut;
   *
   *   vec2 tangentIn = normalize((qIn.xy*p.w - p.xy*qIn.w) * uViewport.zw);
   *   vec2 tangentOut = normalize((qOut.xy*p.w - p.xy*qOut.w) * uViewport.zw);
   *
   *   vec2 curPerspScale;
   *   if(uPerspective == 1) {
   *     curPerspScale = (uProjectionMatrix * vec4(1, sign(uProjectionMatrix[1][1]), 0, 0)).xy;
   *   } else {
   *     curPerspScale = p.w / (0.5 * uViewport.zw);
   *   }
   *
   *   vec2 offset;
   *   vec2 tangent = aTangentIn == vec3(0.) ? tangentOut : tangentIn;
   *   vec2 normal = vec2(-tangent.y, tangent.x);
   *   float normalOffset = sign(aSide);
   *   float tangentOffset = abs(aSide) - 1.;
   *   offset = (normal * normalOffset + tangent * tangentOffset) *
   *     uStrokeWeight * 0.5;
   *
   *   gl_Position.xy = p.xy + offset.xy * curPerspScale;
   *   gl_Position.zw = p.zw;
   * }
   * `;
   *
   * let fragSrc = `
   * precision mediump float;
   * uniform float uTime;
   *
   * void main() {
   *   float wave = sin(gl_FragCoord.x * 0.1 + uTime) * 0.5 + 0.5;
   *   gl_FragColor = vec4(wave, 0.5, 1.0, 1.0);  // Animated color based on time
   * }
   * `;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   animatedStrokeShader = createShader(vertSrc, fragSrc);
   *   strokeShader(animatedStrokeShader);
   *   strokeWeight(4);
   *
   *   describe('A hollow cube rotating continuously with its stroke colors changing dynamically over time against a static gray background.');
   * }
   *
   * function draw() {
   *   animatedStrokeShader.setUniform('uTime', millis() / 1000.0);
   *   background(250);
   *   rotateY(frameCount * 0.02);
   *   noFill();
   *   orbitControl();
   *   box(50);
   * }
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = baseStrokeShader().modify({
   *     'float random': `(vec2 p) {
   *       vec3 p3  = fract(vec3(p.xyx) * .1471);
   *       p3 += dot(p3, p3.yzx + 32.33);
   *       return fract((p3.x + p3.y) * p3.z);
   *     }`,
   *     'Inputs getPixelInputs': `(Inputs inputs) {
   *       // Modify alpha with dithering effect
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
   *   strokeShader(myShader);
   *   strokeWeight(12);
   *   beginShape();
   *   for (let i = 0; i <= 50; i++) {
   *     stroke(
   *       map(i, 0, 50, 150, 255),
   *       100 + 155 * sin(i / 5),
   *       255 * map(i, 0, 50, 1, 0)
   *     );
   *     vertex(
   *       map(i, 0, 50, 1, -1) * width / 3,
   *       50 * cos(i / 10 + frameCount / 80)
   *     );
   *   }
   *   endShape();
   * }
   */
  fn.strokeShader = function (s) {
    this._assert3d("strokeShader");
    // p5._validateParameters('strokeShader', arguments);

    this._renderer.strokeShader(s);

    return this;
  };

  /**
   * Sets the <a href="#/p5.Shader">p5.Shader</a> object to apply for images.
   *
   * This method allows the user to apply a custom shader to images, enabling
   * advanced visual effects such as pixel manipulation, color adjustments,
   * or dynamic behavior. The shader will be applied to the image drawn using
   * the <a href="#/p5/image">image()</a> function.
   *
   * The shader will be used exclusively for:
   * - `image()` calls, applying only when drawing 2D images.
   * - This shader will NOT apply to images used in <a href="#/p5/texture">texture()</a> or other 3D contexts.
   *   Any attempts to use the imageShader in these cases will be ignored.
   *
   * @method imageShader
   * @chainable
   * @param {p5.Shader} s <a href="#/p5.Shader">p5.Shader</a> object
   *                      to apply for images.
   *
   * @example
   * let img;
   * let imgShader;
   *
   * async function setup() {
   *   img = await loadImage('assets/outdoor_image.jpg');
   *
   *   createCanvas(200, 200, WEBGL);
   *   noStroke();
   *
   *   imgShader = createShader(`
   *     precision mediump float;
   *     attribute vec3 aPosition;
   *     attribute vec2 aTexCoord;
   *     varying vec2 vTexCoord;
   *     uniform mat4 uModelViewMatrix;
   *     uniform mat4 uProjectionMatrix;
   *
   *     void main() {
   *       vTexCoord = aTexCoord;
   *       gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
   *     }
   *   `, `
   *     precision mediump float;
   *     varying vec2 vTexCoord;
   *     uniform sampler2D uTexture;
   *     uniform vec2 uMousePos;
   *
   *     void main() {
   *       vec4 texColor = texture2D(uTexture, vTexCoord);
   *       // Adjust the color based on mouse position
   *       float r = uMousePos.x * texColor.r;
   *       float g = uMousePos.y * texColor.g;
   *       gl_FragColor = vec4(r, g, texColor.b, texColor.a);
   *     }
   *   `);
   *
   *   describe(
   *     'An image on a gray background where the colors change based on the mouse position.'
   *   );
   * }
   *
   * function draw() {
   *   background(220);
   *
   *   imageShader(imgShader);
   *
   *   // Map the mouse position to a range between 0 and 1
   *   let mousePosX = map(mouseX, 0, width, 0, 1);
   *   let mousePosY = map(mouseY, 0, height, 0, 1);
   *
   *   // Pass the mouse position to the shader as a uniform
   *   imgShader.setUniform('uMousePos', [mousePosX, mousePosY]);
   *
   *   // Bind the image texture to the shader
   *   imgShader.setUniform('uTexture', img);
   *
   *   image(img, -width / 2, -height / 2, width, height);
   * }
   *
   *
   * @example
   * let img;
   * let imgShader;
   *
   * async function setup() {
   *   img = await loadImage('assets/outdoor_image.jpg');
   *
   *   createCanvas(200, 200, WEBGL);
   *   noStroke();
   *
   *   imgShader = createShader(`
   *     precision mediump float;
   *     attribute vec3 aPosition;
   *     attribute vec2 aTexCoord;
   *     varying vec2 vTexCoord;
   *     uniform mat4 uModelViewMatrix;
   *     uniform mat4 uProjectionMatrix;
   *
   *     void main() {
   *       vTexCoord = aTexCoord;
   *       gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
   *     }
   *   `, `
   *     precision mediump float;
   *     varying vec2 vTexCoord;
   *     uniform sampler2D uTexture;
   *     uniform vec2 uMousePos;
   *
   *     void main() {
   *       // Distance from the current pixel to the mouse
   *       float distFromMouse = distance(vTexCoord, uMousePos);
   *
   *       // Adjust pixelation based on distance (closer = more detail, farther = blockier)
   *       float pixelSize = mix(0.002, 0.05, distFromMouse);
   *       vec2 pixelatedCoord = vec2(floor(vTexCoord.x / pixelSize) * pixelSize,
   *                                  floor(vTexCoord.y / pixelSize) * pixelSize);
   *
   *       vec4 texColor = texture2D(uTexture, pixelatedCoord);
   *       gl_FragColor = texColor;
   *     }
   *   `);
   *
   *   describe('A static image with a grid-like, pixelated effect created by the shader. Each cell in the grid alternates visibility, producing a dithered visual effect.');
   * }
   *
   * function draw() {
   *   background(220);
   *   imageShader(imgShader);
   *
   *   let mousePosX = map(mouseX, 0, width, 0, 1);
   *   let mousePosY = map(mouseY, 0, height, 0, 1);
   *
   *   imgShader.setUniform('uMousePos', [mousePosX, mousePosY]);
   *   imgShader.setUniform('uTexture', img);
   *   image(img, -width / 2, -height / 2, width, height);
   * }
   */
  fn.imageShader = function (s) {
    this._assert3d("imageShader");
    // p5._validateParameters('imageShader', arguments);

    this._renderer.imageShader(s);

    return this;
  };

  /**
   * Create a new shader that can change how fills are drawn. Pass the resulting
   * shader into the <a href="#/p5/shader">`shader()`</a> function to apply it
   * to any fills you draw.
   *
   * The main way to use `buildMaterialShader` is to pass a function in as a parameter.
   * This will let you create a shader using p5.strands.
   *
   * In your function, you can call *hooks* to change part of the shader. In a material
   * shader, these are the hooks available:
   * - <a href="#/p5/objectInputs">`objectInputs`</a>: Update vertices before any positioning has been applied. Your function gets run on every vertex.
   * - <a href="#/p5/worldInputs">`worldInputs`</a>: Update vertices after transformations have been applied. Your function gets run on every vertex.
   * - <a href="#/p5/cameraInputs">`cameraInputs`</a>: Update vertices after transformations have been applied, relative to the camera. Your function gets run on every vertex.
   * - <a href="#/p5/pixelInputs">`pixelInputs`</a>: Update property values on pixels on the surface of a shape. Your function gets run on every pixel.
   * - <a href="#/p5/combineColors">`combineColors`</a>: Control how the ambient, diffuse, and specular components of lighting are combined into a single color on the surface of a shape. Your function gets run on every pixel.
   * - <a href="#/p5/finalColor">`finalColor`</a>: Update or replace the pixel color on the surface of a shape. Your function gets run on every pixel.
   *
   * Read the linked reference page for each hook for more information about how to use them.
   *
   * One thing you can do with a material shader is animate the positions of vertices
   * over time:
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(material);
   * }
   *
   * function material() {
   *   let time = uniformFloat();
   *   worldInputs.begin();
   *   worldInputs.position.y +=
   *     20 * sin(time * 0.001 + worldInputs.position.x * 0.05);
   *   worldInputs.end();
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
   * ```
   *
   * There are also many uses in updating values per pixel. This can be a good
   * way to give your sketch texture and detail. For example, instead of having a single
   * shininess or metalness value for a whole shape, you could vary it in different spots on its surface:
   *
   * ```js example
   * let myShader;
   * let environment;
   *
   * async function setup() {
   *   environment = await loadImage('assets/outdoor_spheremap.jpg');
   *
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(material);
   * }
   *
   * function material() {
   *   pixelInputs.begin();
   *   let factor = sin(
   *     TWO_PI * (pixelInputs.texCoord.x + pixelInputs.texCoord.y)
   *   );
   *   pixelInputs.shininess = mix(1, 100, factor);
   *   pixelInputs.metalness = factor;
   *   pixelInputs.end();
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
   * ```
   *
   * A technique seen often in games called *bump mapping* is to vary the
   * *normal*, which is the orientation of the surface, per pixel to create texture
   * rather than using many tightly packed vertices. Sometimes this can come from
   * bump images, but it can also be done generatively with math.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(material);
   * }
   *
   * function material() {
   *   pixelInputs.begin();
   *   pixelInputs.normal.x += 0.2 * sin(
   *     sin(TWO_PI * dot(pixelInputs.texCoord.yx, vec2(10, 25)))
   *   );
   *   pixelInputs.normal.y += 0.2 * sin(
   *     sin(TWO_PI * dot(pixelInputs.texCoord, vec2(10, 25)))
   *   );
   *   pixelInputs.normal = normalize(pixelInputs.normal);
   *   pixelInputs.end();
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
   * ```
   *
   * You can also update the final color directly instead of modifying
   * lighting settings. Sometimes in photographs, a light source is placed
   * behind the subject to create *rim lighting,* where the edges of the
   * subject are lit up. This can be simulated by adding white to the final
   * color on parts of the shape that are facing away from the camera.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(material);
   * }
   *
   * function material() {
   *   let myNormal = sharedVec3();
   *
   *   pixelInputs.begin();
   *   myNormal = pixelInputs.normal;
   *   pixelInputs.end();
   *
   *   finalColor.begin();
   *   finalColor.set(mix(
   *     [1, 1, 1, 1],
   *     finalColor.color,
   *     abs(dot(myNormal, [0, 0, 1]))
   *   ));
   *   finalColor.end();
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
   * ```
   *
   * Like the `modify()` method on shaders,
   * advanced users can also fill in hooks using <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
   * instead of JavaScript.
   * Read the <a href="#/p5.Shader/modify">reference entry for `modify()`</a>
   * for more info.
   *
   * @method buildMaterialShader
   * @submodule p5.strands
   * @beta
   * @param {Function} callback A function building a p5.strands shader.
   * @returns {p5.Shader} The material shader.
   */
  /**
   * @method buildMaterialShader
   * @param {Object} hooks An object specifying p5.strands hooks in GLSL.
   * @returns {p5.Shader} The material shader.
   */
  fn.buildMaterialShader = function (cb) {
    return this.baseMaterialShader().modify(cb);
  };

  /**
   * Loads a new shader from a file that can change how fills are drawn. Pass the resulting
   * shader into the <a href="#/p5/shader">`shader()`</a> function to apply it
   * to any fills you draw.
   *
   * Since this function loads data from another file, it returns a `Promise`.
   * Use it in an `async function setup`, and `await` its result.
   *
   * ```js
   * let myShader;
   * async function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = await loadMaterialShader('myMaterial.js');
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
   * ```
   *
   * Inside your shader file, you can call p5.strands hooks to change parts of the shader. For
   * example, you might use the `worldInputs` hook to change each vertex, or you
   * might use the `pixelInputs` hook to change each pixel on the surface of a shape.
   *
   * ```js
   * // myMaterial.js
   * let time = uniformFloat();
   * worldInputs.begin();
   * worldInputs.position.y +=
   *   20 * sin(time * 0.001 + worldInputs.position.x * 0.05);
   * worldInputs.end();
   * ```
   *
   * Read the reference for <a href="#/p5/buildMaterialShader">`buildMaterialShader`</a>,
   * the version of `loadMaterialShader` that takes in a function instead of a separate file,
   * for a full list of hooks you can use and examples for each.
   *
   * The second parameter, `successCallback`, is optional. If a function is passed, as in
   * `loadMaterialShader('myShader.js', onLoaded)`, then the `onLoaded()` function will be called
   * once the shader loads. The shader will be passed to `onLoaded()` as its only argument.
   * The return value of `handleData()`, if present, will be used as the final return value of
   * `loadMaterialShader('myShader.js', onLoaded)`.
   *
   * @method loadMaterialShader
   * @submodule p5.strands
   * @beta
   * @param {String} url The URL of your p5.strands JavaScript file.
   * @param {Function} [onSuccess] A callback function to run when loading completes.
   * @param {Function} [onFailure] A callback function to run when loading fails.
   * @returns {Promise<p5.Shader>} The material shader.
   */
  fn.loadMaterialShader = async function (url, onSuccess, onFail) {
    try {
      const cb = await urlToStrandsCallback(url);
      let shader = withGlobalStrands(this, () => this.buildMaterialShader(cb));
      if (onSuccess) {
        shader = onSuccess(shader) || shader;
      }
      return shader;
    } catch (e) {
      console.error(e);
      if (onFail) {
        onFail(e);
      }
    }
  };

  /**
   * Returns the default shader used for fills when lights or textures are used.
   *
   * Calling <a href="#/p5/buildMaterialShader">`buildMaterialShader(shaderFunction)`</a>
   * is equivalent to calling `baseMaterialShader().modify(shaderFunction)`.
   *
   * Read <a href="#/p5/buildMaterialShader">the `buildMaterialShader` reference</a> or
   * call `baseMaterialShader().inspectHooks()` for more information on what you can do with
   * the base material shader.
   *
   * @method baseMaterialShader
   * @submodule p5.strands
   * @beta
   * @returns {p5.Shader} The base material shader.
   */
  fn.baseMaterialShader = function () {
    this._assert3d("baseMaterialShader");
    return this._renderer.baseMaterialShader();
  };

  /**
   * Returns the base shader used for filters.
   *
   * Calling <a href="#/p5/buildMaterialShader">`buildFilterShader(shaderFunction)`</a>
   * is equivalent to calling `baseFilterShader().modify(shaderFunction)`.
   *
   * Read <a href="#/p5/buildFilterShader">the `buildFilterShader` reference</a> or
   * call `baseFilterShader().inspectHooks()` for more information on what you can do with
   * the base filter shader.
   *
   * @method baseFilterShader
   * @submodule p5.strands
   * @beta
   * @returns {p5.Shader} The base filter shader.
   */
  fn.baseFilterShader = function () {
    return (this._renderer.filterRenderer || this._renderer).baseFilterShader();
  };

  /**
   * Create a new shader that can change how fills are drawn, based on the material used
   * when <a href="#/p5/normalMaterial">`normalMaterial()`</a> is active. Pass the resulting
   * shader into the <a href="#/p5/shader">`shader()`</a> function to apply it to any fills
   * you draw.
   *
   * The main way to use `buildNormalShader` is to pass a function in as a parameter.
   * This will let you create a shader using p5.strands.
   *
   * In your function, you can call *hooks* to change part of the shader. In a material
   * shader, these are the hooks available:
   * - <a href="#/p5/objectInputs">`objectInputs`</a>: Update vertices before any positioning has been applied. Your function gets run on every vertex.
   * - <a href="#/p5/worldInputs">`worldInputs`</a>: Update vertices after transformations have been applied. Your function gets run on every vertex.
   * - <a href="#/p5/cameraInputs">`cameraInputs`</a>: Update vertices after transformations have been applied, relative to the camera. Your function gets run on every vertex.
   * - <a href="#/p5/finalColor">`finalColor`</a>: Update or replace the pixel color on the surface of a shape. Your function gets run on every pixel.
   *
   * Read the linked reference page for each hook for more information about how to use them.
   *
   * One thing you may want to do is update the position of all the vertices in an object over time:
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildNormalShader(material);
   * }
   *
   * function material() {
   *   let time = uniformFloat();
   *   worldInputs.begin();
   *   worldInputs.position.y +=
   *     20. * sin(time * 0.001 + worldInputs.position.x * 0.05);
   *   worldInputs.end();
   * }
   *
   * function draw() {
   *   background(255);
   *   shader(myShader);
   *   myShader.setUniform('time', millis());
   *   noStroke();
   *   sphere(50);
   * }
   * ```
   *
   * You may also want to change the colors used. By default, the x, y, and z values of the orientation
   * of the surface are mapped directly to red, green, and blue. But you can pick different colors:
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildNormalShader(material);
   * }
   *
   * function material() {
   *   cameraInputs.begin();
   *   cameraInputs.normal = abs(cameraInputs.normal);
   *   cameraInputs.end();
   *
   *   finalColor.begin();
   *   // Map the r, g, and b values of the old normal to new colors
   *   // instead of just red, green, and blue:
   *   let newColor =
   *     finalColor.color.r * [89, 240, 232] / 255 +
   *     finalColor.color.g * [240, 237, 89] / 255 +
   *     finalColor.color.b * [205, 55, 222] / 255;
   *   newColor = newColor / (finalColor.color.r + finalColor.color.g + finalColor.color.b);
   *   finalColor.set([newColor.r, newColor.g, newColor.b, finalColor.color.a]);
   *   finalColor.end();
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
   * ```
   *
   * Like the `modify()` method on shaders,
   * advanced users can also fill in hooks using <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
   * instead of JavaScript.
   * Read the <a href="#/p5.Shader/modify">reference entry for `modify()`</a>
   * for more info.
   *
   * @method buildNormalShader
   * @submodule p5.strands
   * @beta
   * @param {Function} callback A function building a p5.strands shader.
   * @returns {p5.Shader} The normal shader.
   */
  /**
   * @method buildNormalShader
   * @param {Object} hooks An object specifying p5.strands hooks in GLSL.
   * @returns {p5.Shader} The normal shader.
   */
  fn.buildNormalShader = function (cb) {
    return this.baseNormalShader().modify(cb);
  };

  /**
   * Loads a new shader from a file that can change how fills are drawn, based on the material used
   * when <a href="#/p5/normalMaterial">`normalMaterial()`</a> is active. Pass the resulting
   * shader into the <a href="#/p5/shader">`shader()`</a> function to apply it
   * to any fills you draw.
   *
   * Since this function loads data from another file, it returns a `Promise`.
   * Use it in an `async function setup`, and `await` its result.
   *
   * ```js
   * let myShader;
   * async function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = await loadNormalShader('myMaterial.js');
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
   * ```
   *
   * Inside your shader file, you can call p5.strands hooks to change parts of the shader. For
   * example, you might use the `worldInputs` hook to change each vertex, or you
   * might use the `finalColor` hook to change the color of each pixel on the surface of a shape.
   *
   * ```js
   * // myMaterial.js
   * let time = uniformFloat();
   * worldInputs.begin();
   * worldInputs.position.y +=
   *   20 * sin(time * 0.001 + worldInputs.position.x * 0.05);
   * worldInputs.end();
   * ```
   *
   * Read the reference for <a href="#/p5/buildNormalShader">`buildNormalShader`</a>,
   * the version of `loadNormalShader` that takes in a function instead of a separate file,
   * for a full list of hooks you can use and examples for each.
   *
   * The second parameter, `successCallback`, is optional. If a function is passed, as in
   * `loadNormalShader('myShader.js', onLoaded)`, then the `onLoaded()` function will be called
   * once the shader loads. The shader will be passed to `onLoaded()` as its only argument.
   * The return value of `handleData()`, if present, will be used as the final return value of
   * `loadNormalShader('myShader.js', onLoaded)`.
   *
   * @method loadNormalShader
   * @submodule p5.strands
   * @beta
   * @param {String} url The URL of your p5.strands JavaScript file.
   * @param {Function} [onSuccess] A callback function to run when loading completes.
   * @param {Function} [onFailure] A callback function to run when loading fails.
   * @returns {Promise<p5.Shader>} The normal shader.
   */
  fn.loadNormalShader = async function (url, onSuccess, onFail) {
    try {
      const cb = await urlToStrandsCallback(url);
      let shader = this.withGlobalStrands(this, () =>
        this.buildNormalShader(cb),
      );
      if (onSuccess) {
        shader = onSuccess(shader) || shader;
      }
      return shader;
    } catch (e) {
      console.error(e);
      if (onFail) {
        onFail(e);
      }
    }
  };

  /**
   * Returns the default shader used for fills when
   * <a href="#/p5/normalMaterial">`normalMaterial()`</a> is activated.
   *
   * Calling <a href="#/p5/buildNormalShader">`buildNormalShader(shaderFunction)`</a>
   * is equivalent to calling `baseNormalShader().modify(shaderFunction)`.
   *
   * Read <a href="#/p5/buildNormalShader">the `buildNormalShader` reference</a> or
   * call `baseNormalShader().inspectHooks()` for more information on what you can do with
   * the base normal shader.
   *
   * @method baseNormalShader
   * @submodule p5.strands
   * @beta
   * @returns {p5.Shader} The base material shader.
   */
  fn.baseNormalShader = function () {
    this._assert3d("baseNormalShader");
    return this._renderer.baseNormalShader();
  };

  /**
   * Create a new shader that can change how fills are drawn, based on the default shader
   * used when no lights or textures are applied. Pass the resulting
   * shader into the <a href="#/p5/shader">`shader()`</a> function to apply it
   * to any fills you draw.
   *
   * The main way to use `buildColorShader` is to pass a function in as a parameter.
   * This will let you create a shader using p5.strands.
   *
   * In your function, you can call *hooks* to change part of the shader. In a material
   * shader, these are the hooks available:
   * - <a href="#/p5/objectInputs">`objectInputs`</a>: Update vertices before any positioning has been applied. Your function gets run on every vertex.
   * - <a href="#/p5/worldInputs">`worldInputs`</a>: Update vertices after transformations have been applied. Your function gets run on every vertex.
   * - <a href="#/p5/cameraInputs">`cameraInputs`</a>: Update vertices after transformations have been applied, relative to the camera. Your function gets run on every vertex.
   * - <a href="#/p5/finalColor">`finalColor`</a>: Update or replace the pixel color on the surface of a shape. Your function gets run on every pixel.
   *
   * Read the linked reference page for each hook for more information about how to use them.
   *
   * One thing you might want to do is modify the position of every vertex over time:
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildColorShader(material);
   * }
   *
   * function material() {
   *   let time = uniformFloat();
   *   worldInputs.begin();
   *   worldInputs.position.y +=
   *     20 * sin(time * 0.001 + worldInputs.position.x * 0.05);
   *   worldInputs.end();
   * }
   *
   * function draw() {
   *   background(255);
   *   shader(myShader);
   *   myShader.setUniform('time', millis());
   *   noStroke();
   *   fill('red');
   *   circle(0, 0, 50);
   * }
   * ```
   *
   * Like the `modify()` method on shaders,
   * advanced users can also fill in hooks using <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
   * instead of JavaScript.
   * Read the <a href="#/p5.Shader/modify">reference entry for `modify()`</a>
   * for more info.
   *
   * @method buildColorShader
   * @submodule p5.strands
   * @beta
   * @param {Function} callback A function building a p5.strands shader.
   * @returns {p5.Shader} The color shader.
   */
  /**
   * @method buildColorShader
   * @param {Object} hooks An object specifying p5.strands hooks in GLSL.
   * @returns {p5.Shader} The color shader.
   */
  fn.buildColorShader = function (cb) {
    return this.baseColorShader().modify(cb);
  };

  /**
   * Loads a new shader from a file that can change how fills are drawn, based on the material used
   * when no lights or textures are active. Pass the resulting
   * shader into the <a href="#/p5/shader">`shader()`</a> function to apply it
   * to any fills you draw.
   *
   * Since this function loads data from another file, it returns a `Promise`.
   * Use it in an `async function setup`, and `await` its result.
   *
   * ```js
   * let myShader;
   * async function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = await loadColorShader('myMaterial.js');
   * }
   *
   * function draw() {
   *   background(255);
   *   shader(myShader);
   *   myShader.setUniform('time', millis());
   *   lights();
   *   noStroke();
   *   fill('red');
   *   circle(0, 0, 50);
   * }
   * ```
   *
   * Inside your shader file, you can call p5.strands hooks to change parts of the shader. For
   * example, you might use the `worldInputs` hook to change each vertex, or you
   * might use the `finalColor` hook to change the color of each pixel on the surface of a shape.
   *
   * ```js
   * // myMaterial.js
   * let time = uniformFloat();
   * worldInputs.begin();
   * worldInputs.position.y +=
   *   20 * sin(time * 0.001 + worldInputs.position.x * 0.05);
   * worldInputs.end();
   * ```
   *
   * Read the reference for <a href="#/p5/buildColorShader">`buildColorShader`</a>,
   * the version of `loadColorShader` that takes in a function instead of a separate file,
   * for a full list of hooks you can use and examples for each.
   *
   * The second parameter, `successCallback`, is optional. If a function is passed, as in
   * `loadColorShader('myShader.js', onLoaded)`, then the `onLoaded()` function will be called
   * once the shader loads. The shader will be passed to `onLoaded()` as its only argument.
   * The return value of `handleData()`, if present, will be used as the final return value of
   * `loadColorShader('myShader.js', onLoaded)`.
   *
   * @method loadColorShader
   * @submodule p5.strands
   * @beta
   * @param {String} url The URL of your p5.strands JavaScript file.
   * @param {Function} [onSuccess] A callback function to run when loading completes.
   * @param {Function} [onFailure] A callback function to run when loading fails.
   * @returns {Promise<p5.Shader>} The color shader.
   */
  fn.loadColorShader = async function (url, onSuccess, onFail) {
    try {
      const cb = await urlToStrandsCallback(url);
      let shader = withGlobalStrands(this, () => this.buildColorShader(cb));
      if (onSuccess) {
        shader = onSuccess(shader) || shader;
      }
      return shader;
    } catch (e) {
      console.error(e);
      if (onFail) {
        onFail(e);
      }
    }
  };

  /**
   * Returns the default shader used for fills when no lights or textures are activate.
   *
   * Calling <a href="#/p5/buildColorShader">`buildColorShader(shaderFunction)`</a>
   * is equivalent to calling `baseColorShader().modify(shaderFunction)`.
   *
   * Read <a href="#/p5/buildColorShader">the `buildColorShader` reference</a> or
   * call `baseColorShader().inspectHooks()` for more information on what you can do with
   * the base color shader.
   *
   * @method baseColorShader
   * @submodule p5.strands
   * @beta
   * @returns {p5.Shader} The base color shader.
   */
  fn.baseColorShader = function () {
    this._assert3d("baseColorShader");
    return this._renderer.baseColorShader();
  };

  /**
   * Create a new shader that can change how strokes are drawn, based on the default
   * shader used for strokes. Pass the resulting shader into the
   * <a href="#/p5/strokeShader">`strokeShader()`</a> function to apply it to any
   * strokes you draw.
   *
   * The main way to use `buildStrokeShader` is to pass a function in as a parameter.
   * This will let you create a shader using p5.strands.
   *
   * In your function, you can call *hooks* to change part of the shader. In a material
   * shader, these are the hooks available:
   * - <a href="#/p5/objectInputs">`objectInputs`</a>: Update vertices before any positioning has been applied. Your function gets run on every vertex.
   * - <a href="#/p5/worldInputs">`worldInputs`</a>: Update vertices after transformations have been applied. Your function gets run on every vertex.
   * - <a href="#/p5/cameraInputs">`cameraInputs`</a>: Update vertices after transformations have been applied, relative to the camera. Your function gets run on every vertex.
   * - <a href="#/p5/pixelInputs">`pixelInputs`</a>: Update property values on pixels on the surface of a shape. Your function gets run on every pixel.
   * - <a href="#/p5/finalColor">`finalColor`</a>: Update or replace the pixel color on the surface of a shape. Your function gets run on every pixel.
   *
   * Read the linked reference page for each hook for more information about how to use them.
   *
   * One thing you might want to do is update the color of a stroke per pixel. Here, it is being used
   * to create a soft texture:
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildStrokeShader(material);
   * }
   *
   * function material() {
   *   pixelInputs.begin();
   *   let opacity = 1 - smoothstep(
   *     0,
   *     15,
   *     length(pixelInputs.position - pixelInputs.center)
   *   );
   *   pixelInputs.color.a *= opacity;
   *   pixelInputs.end();
   * }
   *
   * function draw() {
   *   background(255);
   *   strokeShader(myShader);
   *   strokeWeight(30);
   *   line(
   *     -width/3,
   *     sin(millis()*0.001) * height/4,
   *     width/3,
   *     sin(millis()*0.001 + 1) * height/4
   *   );
   * }
   * ```
   *
   * Rather than using opacity, we could use a form of *dithering* to get a different
   * texture. This involves using only fully opaque or transparent pixels. Here, we
   * randomly choose which pixels to be transparent:
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildStrokeShader(material);
   * }
   *
   * function material() {
   *   pixelInputs.begin();
   *   // Replace alpha in the color with dithering by
   *   // randomly setting pixel colors to 0 based on opacity
   *   let a = 1;
   *   if (noise(pixelInputs.position.xy) > pixelInputs.color.a) {
   *     a = 0;
   *   }
   *   pixelInputs.color.a = a;
   *   pixelInputs.end();
   * }
   *
   * function draw() {
   *   background(255);
   *   strokeShader(myShader);
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
   * ```
   *
   * You might also want to update some properties per vertex, such as the stroke
   * thickness. This lets you create a more varied line:
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildStrokeShader(material);
   * }
   *
   * function material() {
   *   let time = uniformFloat();
   *   worldInputs.begin();
   *   // Add a somewhat random offset to the weight
   *   // that varies based on position and time
   *   let scale = 0.5 + noise(
   *     worldInputs.position.x * 0.01,
   *     worldInputs.position.y * 0.01,
   *     time * 0.0005
   *   );
   *   worldInputs.weight *= scale;
   *   worldInputs.end();
   * }
   *
   * function draw() {
   *   background(255);
   *   strokeShader(myShader);
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
   * ```
   *
   * Like the `modify()` method on shaders,
   * advanced users can also fill in hooks using <a href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders" target="_blank">GLSL</a>
   * instead of JavaScript.
   * Read the <a href="#/p5.Shader/modify">reference entry for `modify()`</a>
   * for more info.
   *
   * @method buildStrokeShader
   * @submodule p5.strands
   * @beta
   * @param {Function} callback A function building a p5.strands shader.
   * @returns {p5.Shader} The stroke shader.
   */
  /**
   * @method buildStrokeShader
   * @param {Object} hooks An object specifying p5.strands hooks in GLSL.
   * @returns {p5.Shader} The stroke shader.
   */
  fn.buildStrokeShader = function (cb) {
    return this.baseStrokeShader().modify(cb);
  };

  /**
   * Loads a new shader from a file that can change how strokes are drawn. Pass the resulting
   * shader into the <a href="#/p5/strokeShader">`strokeShader()`</a> function to apply it
   * to any strokes you draw.
   *
   * Since this function loads data from another file, it returns a `Promise`.
   * Use it in an `async function setup`, and `await` its result.
   *
   * ```js
   * let myShader;
   * async function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = await loadStrokeShader('myMaterial.js');
   * }
   *
   * function draw() {
   *   background(255);
   *   strokeShader(myShader);
   *   strokeWeight(30);
   *   line(
   *     -width/3,
   *     sin(millis()*0.001) * height/4,
   *     width/3,
   *     sin(millis()*0.001 + 1) * height/4
   *   );
   * }
   * ```
   *
   * Inside your shader file, you can call p5.strands hooks to change parts of the shader. For
   * example, you might use the `worldInputs` hook to change each vertex, or you
   * might use the `pixelInputs` hook to change each pixel on the surface of a stroke.
   *
   * ```js
   * // myMaterial.js
   * pixelInputs.begin();
   * let opacity = 1 - smoothstep(
   *   0,
   *   15,
   *   length(pixelInputs.position - pixelInputs.center)
   * );
   * pixelInputs.color.a *= opacity;
   * pixelInputs.end();
   * ```
   *
   * Read the reference for <a href="#/p5/buildStrokeShader">`buildStrokeShader`</a>,
   * the version of `loadStrokeShader` that takes in a function instead of a separate file,
   * for a full list of hooks you can use and examples for each.
   *
   * The second parameter, `successCallback`, is optional. If a function is passed, as in
   * `loadStrokeShader('myShader.js', onLoaded)`, then the `onLoaded()` function will be called
   * once the shader loads. The shader will be passed to `onLoaded()` as its only argument.
   * The return value of `handleData()`, if present, will be used as the final return value of
   * `loadStrokeShader('myShader.js', onLoaded)`.
   *
   * @method loadStrokeShader
   * @submodule p5.strands
   * @beta
   * @param {String} url The URL of your p5.strands JavaScript file.
   * @param {Function} [onSuccess] A callback function to run when loading completes.
   * @param {Function} [onFailure] A callback function to run when loading fails.
   * @returns {Promise<p5.Shader>} The stroke shader.
   */
  fn.loadStrokeShader = async function (url, onSuccess, onFail) {
    try {
      const cb = await urlToStrandsCallback(url);
      let shader = withGlobalStrands(this, () => this.buildStrokeShader(cb));
      if (onSuccess) {
        shader = onSuccess(shader) || shader;
      }
      return shader;
    } catch (e) {
      console.error(e);
      if (onFail) {
        onFail(e);
      }
    }
  };

  /**
   * Returns the default shader used for strokes.
   *
   * Calling <a href="#/p5/buildStrokeShader">`buildStrokeShader(shaderFunction)`</a>
   * is equivalent to calling `baseStrokeShader().modify(shaderFunction)`.
   *
   * Read <a href="#/p5/buildStrokeShader">the `buildStrokeShader` reference</a> or
   * call `baseStrokeShader().inspectHooks()` for more information on what you can do with
   * the base material shader.
   *
   * @method baseStrokeShader
   * @submodule p5.strands
   * @beta
   * @returns {p5.Shader} The base material shader.
   */
  fn.baseStrokeShader = function () {
    this._assert3d("baseStrokeShader");
    return this._renderer.baseStrokeShader();
  };

  /**
   * Restores the default shaders.
   *
   * `resetShader()` deactivates any shaders previously applied by
   * <a href="#/p5/shader">shader()</a>, <a href="#/p5/strokeShader">strokeShader()</a>,
   * or <a href="#/p5/imageShader">imageShader()</a>.
   *
   * Note: Shaders can only be used in WebGL mode.
   *
   * @method resetShader
   * @chainable
   *
   * @example
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
   */
  fn.resetShader = function () {
    this._renderer.resetShader();
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
   * let img;
   *
   * async function setup() {
   *   // Load an image and create a p5.Image object.
   *   img = await loadImage('assets/laDefense.jpg');
   *
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
   *
   * @example
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
   *
   * @example
   * let vid;
   *
   * function setup() {
   *   // Load a video and create a p5.MediaElement object.
   *   vid = createVideo('assets/fingers.mov');
   *
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
   *
   * @example
   * let vid;
   *
   * function setup() {
   *   // Load a video and create a p5.MediaElement object.
   *   vid = createVideo('assets/fingers.mov');
   *
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
   */
  fn.texture = function (tex) {
    this._assert3d("texture");
    // p5._validateParameters('texture', arguments);

    // NOTE: make generic or remove need for
    if (tex.gifProperties) {
      tex._animateGif(this);
    }

    this._renderer.texture(tex);

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
   * `textureMode()` changes the coordinate system for uv coordinates.
   *
   * The parameter, `mode`, accepts two possible constants. If `NORMAL` is
   * passed, as in `textureMode(NORMAL)`, then the texture’s uv coordinates can
   * be provided in the range 0 to 1 instead of the image’s dimensions. This can
   * be helpful for using the same code for multiple images of different sizes.
   * For example, the code snippet above could be rewritten as follows:
   *
   * ```js
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
   * ```
   *
   * By default, `mode` is `IMAGE`, which scales uv coordinates to the
   * dimensions of the image. Calling `textureMode(IMAGE)` applies the default.
   *
   * Note: `textureMode()` can only be used in WebGL mode.
   *
   * @method  textureMode
   * @param {(IMAGE|NORMAL)} mode either IMAGE or NORMAL.
   *
   * @example
   * let img;
   *
   * async function setup() {
   *   // Load an image and create a p5.Image object.
   *   img = await loadImage('assets/laDefense.jpg');
   *
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
   *
   * @example
   * let img;
   *
   * async function setup() {
   *   // Load an image and create a p5.Image object.
   *   img = await loadImage('assets/laDefense.jpg');
   *
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
   */
  fn.textureMode = function (mode) {
    if (mode !== constants.IMAGE && mode !== constants.NORMAL) {
      console.warn(
        `You tried to set ${mode} textureMode only supports IMAGE & NORMAL `,
      );
    } else {
      this._renderer.states.setValue("textureMode", mode);
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
   * @param {(CLAMP|REPEAT|MIRROR)} wrapX either CLAMP, REPEAT, or MIRROR
   * @param {(CLAMP|REPEAT|MIRROR)} [wrapY=wrapX] either CLAMP, REPEAT, or MIRROR
   *
   * @example
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/rockies128.jpg');
   *
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
   *
   * @example
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/rockies128.jpg');
   *
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
   *
   * @example
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/rockies128.jpg');
   *
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
   *
   * @example
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/rockies128.jpg');
   *
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
   */
  fn.textureWrap = function (wrapX, wrapY = wrapX) {
    this._renderer.states.setValue("textureWrapX", wrapX);
    this._renderer.states.setValue("textureWrapY", wrapY);

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
   */
  fn.normalMaterial = function (...args) {
    this._assert3d("normalMaterial");
    // p5._validateParameters('normalMaterial', args);

    this._renderer.normalMaterial(...args);

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
   *
   * @example
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
   *
   * @example
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
   *
   * @example
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
   *
   * @example
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
   *
   * @example
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
  fn.ambientMaterial = function (v1, v2, v3) {
    this._assert3d("ambientMaterial");
    // p5._validateParameters('ambientMaterial', arguments);

    const color = fn.color.apply(this, arguments);
    this._renderer.states.setValue("_hasSetAmbient", true);
    this._renderer.states.setValue("curAmbientColor", color._array);
    this._renderer.states.setValue("_useNormalMaterial", false);
    this._renderer.states.setValue("enableLighting", true);
    if (!this._renderer.states.fillColor) {
      this._renderer.states.setValue("fillColor", new Color([1, 1, 1]));
    }
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
  fn.emissiveMaterial = function (v1, v2, v3, a) {
    this._assert3d("emissiveMaterial");
    // p5._validateParameters('emissiveMaterial', arguments);

    const color = fn.color.apply(this, arguments);
    this._renderer.states.setValue("curEmissiveColor", color._array);
    this._renderer.states.setValue("_useEmissiveMaterial", true);
    this._renderer.states.setValue("_useNormalMaterial", false);
    this._renderer.states.setValue("enableLighting", true);

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
   *
   * @example
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
   *
   * @example
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
   *
   * @example
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
  fn.specularMaterial = function (v1, v2, v3, alpha) {
    this._assert3d("specularMaterial");
    // p5._validateParameters('specularMaterial', arguments);

    const color = fn.color.apply(this, arguments);
    this._renderer.states.setValue("curSpecularColor", color._array);
    this._renderer.states.setValue("_useSpecularMaterial", true);
    this._renderer.states.setValue("_useNormalMaterial", false);
    this._renderer.states.setValue("enableLighting", true);

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
   */
  fn.shininess = function (shine) {
    this._assert3d("shininess");
    // p5._validateParameters('shininess', arguments);

    this._renderer.shininess(shine);

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
   *
   * @example
   * // Click and drag the mouse to view the scene from different angles.
   *
   * let img;
   *
   * async function setup() {
   *   img = await loadImage('assets/outdoor_spheremap.jpg');
   *
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
   */
  fn.metalness = function (metallic) {
    this._assert3d("metalness");

    this._renderer.metalness(metallic);

    return this;
  };

  Renderer3D.prototype.shader = function (s) {
    // Always set the shader as a fill shader
    this.states.setValue("userFillShader", s);
    this.states.setValue("_useNormalMaterial", false);
    s.ensureCompiledOnContext(this);
    s.setDefaultUniforms();
  };

  Renderer3D.prototype.strokeShader = function (s) {
    this.states.setValue("userStrokeShader", s);
    s.ensureCompiledOnContext(this);
    s.setDefaultUniforms();
  };

  Renderer3D.prototype.imageShader = function (s) {
    this.states.setValue("userImageShader", s);
    s.ensureCompiledOnContext(this);
    s.setDefaultUniforms();
  };

  Renderer3D.prototype.resetShader = function () {
    this.states.setValue("userFillShader", null);
    this.states.setValue("userStrokeShader", null);
    this.states.setValue("userImageShader", null);
  };

  Renderer3D.prototype.texture = function (tex) {
    this.states.setValue("drawMode", constants.TEXTURE);
    this.states.setValue("_useNormalMaterial", false);
    this.states.setValue("_tex", tex);
    this.states.setValue("fillColor", new Color([1, 1, 1]));
  };

  Renderer3D.prototype.normalMaterial = function (...args) {
    this.states.setValue("drawMode", constants.FILL);
    this.states.setValue("_useSpecularMaterial", false);
    this.states.setValue("_useEmissiveMaterial", false);
    this.states.setValue("_useNormalMaterial", true);
    this.states.setValue("curFillColor", [1, 1, 1, 1]);
    this.states.setValue("fillColor", new Color([1, 1, 1]));
    this.states.setValue("strokeColor", null);
  };

  // Renderer3D.prototype.ambientMaterial = function(v1, v2, v3) {
  // }

  // Renderer3D.prototype.emissiveMaterial = function(v1, v2, v3, a) {
  // }

  // Renderer3D.prototype.specularMaterial = function(v1, v2, v3, alpha) {
  // }

  Renderer3D.prototype.shininess = function (shine) {
    if (shine < 1) {
      shine = 1;
    }
    this.states.setValue("_useShininess", shine);
  };

  Renderer3D.prototype.metalness = function (metallic) {
    const metalMix = 1 - Math.exp(-metallic / 100);
    this.states.setValue("_useMetalness", metalMix);
  };
}

export default material;

if (typeof p5 !== "undefined") {
  loading(p5, p5.prototype);
}
