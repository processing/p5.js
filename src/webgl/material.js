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
 * Creates a new <a href="#/p5.Shader">p5.Shader</a> object
 * from the provided vertex and fragment shader files.
 *
 * The shader files are loaded asynchronously in the
 * background, so this method should be used in <a href="#/p5/preload">preload()</a>.
 *
 * Shaders can alter the positioning of shapes drawn with them.
 * To ensure consistency in rendering, it's recommended to use the vertex shader in the <a href="#/p5/createShader">createShader example</a>.
 *
 * Note, shaders can only be used in WEBGL mode.
 *
 * @method loadShader
 * @param {String} vertFilename path to file containing vertex shader
 * source code
 * @param {String} fragFilename path to file containing fragment shader
 * source code
 * @param {function} [callback] callback to be executed after loadShader
 * completes. On success, the p5.Shader object is passed as the first argument.
 * @param {function} [errorCallback] callback to be executed when an error
 * occurs inside loadShader. On error, the error is passed as the first
 * argument.
 * @return {p5.Shader} a shader object created from the provided
 * vertex and fragment shader files.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let mandel;
 * function preload() {
 *   // load the shader definitions from files
 *   mandel = loadShader('assets/shader.vert', 'assets/shader.frag');
 * }
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   // use the shader
 *   shader(mandel);
 *   noStroke();
 *   mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
 *   describe('zooming Mandelbrot set. a colorful, infinitely detailed fractal.');
 * }
 *
 * function draw() {
 *   mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
 *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
 * }
 * </code>
 * </div>
 *
 * @alt
 * zooming Mandelbrot set. a colorful, infinitely detailed fractal.
 */
p5.prototype.loadShader = function (
  vertFilename,
  fragFilename,
  callback,
  errorCallback
) {
  p5._validateParameters('loadShader', arguments);
  if (!errorCallback) {
    errorCallback = console.error;
  }

  const loadedShader = new p5.Shader();

  const self = this;
  let loadedFrag = false;
  let loadedVert = false;

  const onLoad = () => {
    self._decrementPreload();
    if (callback) {
      callback(loadedShader);
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
    errorCallback
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
    errorCallback
  );

  return loadedShader;
};

/**
 * Creates a new <a href="#/p5.Shader">p5.Shader</a> object
 * from the provided vertex and fragment shader code.
 *
 * Note, shaders can only be used in WEBGL mode.
 *
 * Shaders can alter the positioning of shapes drawn with them.
 * To ensure consistency in rendering, it's recommended to use the vertex shader shown in the example below.
 *
 * @method createShader
 * @param {String} vertSrc source code for the vertex shader
 * @param {String} fragSrc source code for the fragment shader
 * @returns {p5.Shader} a shader object created from the provided
 * vertex and fragment shaders.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 *
 * // the vertex shader is called for each vertex
 * let vs = `
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
 *  }
 * `;
 *
 *
 * // the fragment shader is called for each pixel
 * let fs = `
 *    precision highp float;
 *    uniform vec2 p;
 *    uniform float r;
 *    const int I = 500;
 *    varying vec2 vTexCoord;
 *    void main() {
 *      vec2 c = p + gl_FragCoord.xy * r, z = c;
 *      float n = 0.0;
 *      for (int i = I; i > 0; i --) {
 *        if(z.x*z.x+z.y*z.y > 4.0) {
 *          n = float(i)/float(I);
 *          break;
 *        }
 *        z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;
 *      }
 *      gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);
 *    }`;
 *
 * let mandel;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // create and initialize the shader
 *   mandel = createShader(vs, fs);
 *   shader(mandel);
 *   noStroke();
 *
 *   // 'p' is the center point of the Mandelbrot image
 *   mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
 *   describe('zooming Mandelbrot set. a colorful, infinitely detailed fractal.');
 * }
 *
 * function draw() {
 *   // 'r' is the size of the image in Mandelbrot-space
 *   mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
 *   plane(width, height);
 * }
 * </code>
 * </div>
 *
 * @alt
 * zooming Mandelbrot set. a colorful, infinitely detailed fractal.
 */
p5.prototype.createShader = function (vertSrc, fragSrc) {
  p5._validateParameters('createShader', arguments);
  return new p5.Shader(this._renderer, vertSrc, fragSrc);
};

/**
 * Creates a new <a href="#/p5.Shader">p5.Shader</a> using only a fragment shader, as a convenience method for creating image effects.
 * It's like <a href="#/createShader">createShader()</a> but with a default vertex shader included.
 *
 * <a href="#/createFilterShader">createFilterShader()</a> is intended to be used along with <a href="#/filter">filter()</a> for filtering the contents of a canvas.
 * A filter shader will not be applied to any geometries.
 *
 * The fragment shader receives some uniforms:
 * - `sampler2D tex0`, which contains the canvas contents as a texture
 * - `vec2 canvasSize`, which is the p5 width and height of the canvas (not including pixel density)
 * - `vec2 texelSize`, which is the size of a physical pixel including pixel density (`1.0/(width*density)`, `1.0/(height*density)`)
 *
 * For more info about filters and shaders, see Adam Ferriss' <a href="https://github.com/aferriss/p5jsShaderExamples">repo of shader examples</a>
 * or the <a href="https://p5js.org/learn/getting-started-in-webgl-shaders.html">introduction to shaders</a> page.
 *
 * @method createFilterShader
 * @param {String} fragSrc source code for the fragment shader
 * @returns {p5.Shader} a shader object created from the provided
 *                      fragment shader.
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
 * Sets the <a href="#/p5.Shader">p5.Shader</a> object to
 * be used to render subsequent shapes.
 *
 * Shaders can alter the positioning of shapes drawn with them.
 * To ensure consistency in rendering, it's recommended to use the vertex shader in the <a href="#/p5/createShader">createShader example</a>.
 *
 * Custom shaders can be created using the
 * <a href="#/p5/createShader">createShader()</a> and
 * <a href="#/p5/loadShader">loadShader()</a> functions.
 *
 * Use <a href="#/p5/resetShader">resetShader()</a> to
 * restore the default shaders.
 *
 * Additional Information:
 * The shader will be used for:
 * - Fills when a texture is enabled if it includes a uniform `sampler2D`.
 * - Fills when lights are enabled if it includes the attribute `aNormal`, or if it has any of the following uniforms: `uUseLighting`, `uAmbientLightCount`, `uDirectionalLightCount`, `uPointLightCount`, `uAmbientColor`, `uDirectionalDiffuseColors`, `uDirectionalSpecularColors`, `uPointLightLocation`, `uPointLightDiffuseColors`, `uPointLightSpecularColors`, `uLightingDirection`, or `uSpecular`.
 * - Fills whenever there are no lights or textures.
 * - Strokes if it includes the uniform `uStrokeWeight`.
 * Note: This behavior is considered experimental, and changes are planned in future releases.
 *
 * Note, shaders can only be used in WEBGL mode.
 *
 * @method shader
 * @chainable
 * @param {p5.Shader} s the <a href="#/p5.Shader">p5.Shader</a> object
 * to use for rendering shapes.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * // Click within the image to toggle
 * // the shader used by the quad shape
 * // Note: for an alternative approach to the same example,
 * // involving changing uniforms please refer to:
 * // https://p5js.org/reference/#/p5.Shader/setUniform
 *
 * let redGreen;
 * let orangeBlue;
 * let showRedGreen = false;
 *
 * function preload() {
 *   // note that we are using two instances
 *   // of the same vertex and fragment shaders
 *   redGreen = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
 *   orangeBlue = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // initialize the colors for redGreen shader
 *   shader(redGreen);
 *   redGreen.setUniform('colorCenter', [1.0, 0.0, 0.0]);
 *   redGreen.setUniform('colorBackground', [0.0, 1.0, 0.0]);
 *
 *   // initialize the colors for orangeBlue shader
 *   shader(orangeBlue);
 *   orangeBlue.setUniform('colorCenter', [1.0, 0.5, 0.0]);
 *   orangeBlue.setUniform('colorBackground', [0.226, 0.0, 0.615]);
 *
 *   noStroke();
 *
 *   describe(
 *     'canvas toggles between a circular gradient of orange and blue vertically. and a circular gradient of red and green moving horizontally when mouse is clicked/pressed.'
 *   );
 * }
 *
 * function draw() {
 *   // update the offset values for each shader,
 *   // moving orangeBlue in vertical and redGreen
 *   // in horizontal direction
 *   orangeBlue.setUniform('offset', [0, sin(millis() / 2000) + 1]);
 *   redGreen.setUniform('offset', [sin(millis() / 2000), 1]);
 *
 *   if (showRedGreen === true) {
 *     shader(redGreen);
 *   } else {
 *     shader(orangeBlue);
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

  return this;
};

/**
 * Restores the default shaders. Code that runs after resetShader()
 * will not be affected by the shader previously set by
 * <a href="#/p5/shader">shader()</a>
 *
 * @method resetShader
 * @chainable
 * @example
 * <div>
 * <code>
 * // This variable will hold our shader object
 * let shaderProgram;
 *
 * // This variable will hold our vertex shader source code
 * let vertSrc = `
 *    attribute vec3 aPosition;
 *    attribute vec2 aTexCoord;
 *    uniform mat4 uProjectionMatrix;
 *    uniform mat4 uModelViewMatrix;
 *    varying vec2 vTexCoord;
 *
 *    void main() {
 *      vTexCoord = aTexCoord;
 *      vec4 position = vec4(aPosition, 1.0);
 *      gl_Position = uProjectionMatrix * uModelViewMatrix * position;
 *    }
 * `;
 *
 * // This variable will hold our fragment shader source code
 * let fragSrc = `
 *    precision mediump float;
 *
 *    varying vec2 vTexCoord;
 *
 *    void main() {
 *      vec2 uv = vTexCoord;
 *      vec3 color = vec3(uv.x, uv.y, min(uv.x + uv.y, 1.0));
 *      gl_FragColor = vec4(color, 1.0);
 *    }
 * `;
 *
 * function setup() {
 *   // Shaders require WEBGL mode to work
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create our shader
 *   shaderProgram = createShader(vertSrc, fragSrc);
 *
 *   describe(
 *     'Two rotating cubes. The left one is painted using a custom (user-defined) shader, while the right one is painted using the default fill shader.'
 *   );
 * }
 *
 * function draw() {
 *   // Clear the scene
 *   background(200);
 *
 *   // Draw a box using our shader
 *   // shader() sets the active shader with our shader
 *   shader(shaderProgram);
 *   push();
 *   translate(-width / 4, 0, 0);
 *   rotateX(millis() * 0.00025);
 *   rotateY(millis() * 0.0005);
 *   box(width / 4);
 *   pop();
 *
 *   // Draw a box using the default fill shader
 *   // resetShader() restores the default fill shader
 *   resetShader();
 *   fill(255, 0, 0);
 *   push();
 *   translate(width / 4, 0, 0);
 *   rotateX(millis() * 0.00025);
 *   rotateY(millis() * 0.0005);
 *   box(width / 4);
 *   pop();
 * }
 * </code>
 * </div>
 * @alt
 * Two rotating cubes. The left one is painted using a custom (user-defined) shader,
 * while the right one is painted using the default fill shader.
 */
p5.prototype.resetShader = function () {
  this._renderer.userFillShader = this._renderer.userStrokeShader = null;
  return this;
};

/**
 * Sets the texture that will be used to render subsequent shapes.
 *
 * A texture is like a "skin" that wraps around a 3D geometry. Currently
 * supported textures are images, video, and offscreen renders.
 *
 * To texture a geometry created with <a href="#/p5/beginShape">beginShape()</a>,
 * you will need to specify uv coordinates in <a href="#/p5/vertex">vertex()</a>.
 *
 * Note, texture() can only be used in WEBGL mode.
 *
 * You can view more materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 *
 * @method texture
 * @param {p5.Image|p5.MediaElement|p5.Graphics|p5.Texture|p5.Framebuffer|p5.FramebufferTexture} tex  image to use as texture
 * @chainable
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('spinning cube with a texture from an image');
 * }
 *
 * function draw() {
 *   background(0);
 *   rotateZ(frameCount * 0.01);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   //pass image as texture
 *   texture(img);
 *   box(width / 2);
 * }
 * </code>
 * </div>
 * @alt
 * spinning cube with a texture from an image
 *
 * @example
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   pg = createGraphics(200, 200);
 *   pg.textSize(75);
 *   describe('plane with a texture from an image created by createGraphics()');
 * }
 *
 * function draw() {
 *   background(0);
 *   pg.background(255);
 *   pg.text('hello!', 0, 100);
 *   //pass image as texture
 *   texture(pg);
 *   rotateX(0.5);
 *   noStroke();
 *   plane(50);
 * }
 * </code>
 * </div>
 * @alt
 * plane with a texture from an image created by createGraphics()
 *
 * @example
 * <div>
 * <code>
 * let vid;
 * function preload() {
 *   vid = createVideo('assets/fingers.mov');
 *   vid.hide();
 * }
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('rectangle with video as texture');
 * }
 *
 * function draw() {
 *   background(0);
 *   //pass video frame as texture
 *   texture(vid);
 *   rect(-40, -40, 80, 80);
 * }
 *
 * function mousePressed() {
 *   vid.loop();
 * }
 * </code>
 * </div>
 *
 * @alt
 * rectangle with video as texture
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('quad with a texture, mapped using normalized coordinates');
 * }
 *
 * function draw() {
 *   background(0);
 *   texture(img);
 *   textureMode(NORMAL);
 *   beginShape();
 *   vertex(-40, -40, 0, 0);
 *   vertex(40, -40, 1, 0);
 *   vertex(40, 40, 1, 1);
 *   vertex(-40, 40, 0, 1);
 *   endShape();
 * }
 * </code>
 * </div>
 * @alt
 * quad with a texture, mapped using normalized coordinates
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
 * Sets the coordinate space for texture mapping. The default mode is IMAGE
 * which refers to the actual coordinates of the image.
 * NORMAL refers to a normalized space of values ranging from 0 to 1.
 *
 * With IMAGE, if an image is 100×200 pixels, mapping the image onto the entire
 * size of a quad would require the points (0,0) (100, 0) (100,200) (0,200).
 * The same mapping in NORMAL is (0,0) (1,0) (1,1) (0,1).
 * @method  textureMode
 * @param {Constant} mode either IMAGE or NORMAL
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('quad with a texture, mapped using normalized coordinates');
 * }
 *
 * function draw() {
 *   texture(img);
 *   textureMode(NORMAL);
 *   beginShape();
 *   vertex(-50, -50, 0, 0);
 *   vertex(50, -50, 1, 0);
 *   vertex(50, 50, 1, 1);
 *   vertex(-50, 50, 0, 1);
 *   endShape();
 * }
 * </code>
 * </div>
 * @alt
 * quad with a texture, mapped using normalized coordinates
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('quad with a texture, mapped using image coordinates');
 * }
 *
 * function draw() {
 *   texture(img);
 *   textureMode(IMAGE);
 *   beginShape();
 *   vertex(-50, -50, 0, 0);
 *   vertex(50, -50, img.width, 0);
 *   vertex(50, 50, img.width, img.height);
 *   vertex(-50, 50, 0, img.height);
 *   endShape();
 * }
 * </code>
 * </div>
 * @alt
 * quad with a texture, mapped using image coordinates
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
 * Sets the global texture wrapping mode. This controls how textures behave
 * when their uv's go outside of the 0 to 1 range. There are three options:
 * CLAMP, REPEAT, and MIRROR.
 *
 * CLAMP causes the pixels at the edge of the texture to extend to the bounds.
 * REPEAT causes the texture to tile repeatedly until reaching the bounds.
 * MIRROR works similarly to REPEAT but it flips the texture with every new tile.
 *
 * REPEAT & MIRROR are only available if the texture
 * is a power of two size (128, 256, 512, 1024, etc.).
 *
 * This method will affect all textures in your sketch until a subsequent
 * textureWrap() call is made.
 *
 * If only one argument is provided, it will be applied to both the
 * horizontal and vertical axes.
 * @method textureWrap
 * @param {Constant} wrapX either CLAMP, REPEAT, or MIRROR
 * @param {Constant} [wrapY] either CLAMP, REPEAT, or MIRROR
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/rockies128.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   textureWrap(MIRROR);
 *   describe('an image of the rocky mountains repeated in mirrored tiles');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   let dX = mouseX;
 *   let dY = mouseY;
 *
 *   let u = lerp(1.0, 2.0, dX);
 *   let v = lerp(1.0, 2.0, dY);
 *
 *   scale(width / 2);
 *
 *   texture(img);
 *
 *   beginShape(TRIANGLES);
 *   vertex(-1, -1, 0, 0, 0);
 *   vertex(1, -1, 0, u, 0);
 *   vertex(1, 1, 0, u, v);
 *
 *   vertex(1, 1, 0, u, v);
 *   vertex(-1, 1, 0, 0, v);
 *   vertex(-1, -1, 0, 0, 0);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * an image of the rocky mountains repeated in mirrored tiles
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
 * A normal material is not affected by light. It is often used as
 * a placeholder material when debugging.
 *
 * Surfaces facing the X-axis become red, those facing the Y-axis
 * become green, and those facing the Z-axis become blue.
 *
 * You can view more materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 *
 * @method normalMaterial
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('Sphere with normal material');
 * }
 *
 * function draw() {
 *   background(200);
 *   normalMaterial();
 *   sphere(40);
 * }
 * </code>
 * </div>
 * @alt
 * Sphere with normal material
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
 * Sets the ambient color of the material.
 *
 * The ambientMaterial() color represents the components
 * of the **ambientLight()** color that the object reflects.
 *
 * Consider an ambientMaterial() with the color yellow (255, 255, 0).
 * If the ambientLight() emits the color white (255, 255, 255), then the object
 * will appear yellow as it will reflect the red and green components
 * of the light. If the ambientLight() emits the color red (255, 0, 0), then
 * the object will appear red as it will reflect the red component
 * of the light. If the ambientLight() emits the color blue (0, 0, 255),
 * then the object will appear black, as there is no component of
 * the light that it can reflect.
 *
 * You can view more materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 *
 * @method ambientMaterial
 * @param  {Number} v1  red or hue value relative to the current
 *                       color range
 * @param  {Number} v2  green or saturation value relative to the
 *                       current color range
 * @param  {Number} v3  blue or brightness value relative to the
 *                       current color range
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('sphere reflecting red, blue, and green light');
 * }
 * function draw() {
 *   background(0);
 *   noStroke();
 *   ambientLight(255);
 *   ambientMaterial(70, 130, 230);
 *   sphere(40);
 * }
 * </code>
 * </div>
 * @alt
 * sphere reflecting red, blue, and green light
 *
 * @example
 * <div>
 * <code>
 * // ambientLight is both red and blue (magenta),
 * // so object only reflects it's red and blue components
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('box reflecting only red and blue light');
 * }
 * function draw() {
 *   background(70);
 *   ambientLight(255, 0, 255); // magenta light
 *   ambientMaterial(255); // white material
 *   box(30);
 * }
 * </code>
 * </div>
 * @alt
 * box reflecting only red and blue light
 *
 * @example
 * <div>
 * <code>
 * // ambientLight is green. Since object does not contain
 * // green, it does not reflect any light
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('box reflecting no light');
 * }
 * function draw() {
 *   background(70);
 *   ambientLight(0, 255, 0); // green light
 *   ambientMaterial(255, 0, 255); // magenta material
 *   box(30);
 * }
 * </code>
 * </div>
 * @alt
 * box reflecting no light
 */

/**
 * @method ambientMaterial
 * @param  {Number} gray  number specifying value between
 *                         white and black
 * @chainable
 */

/**
 * @method ambientMaterial
 * @param  {p5.Color|Number[]|String} color
 *           color as a <a href="#/p5.Color">p5.Color</a>,
 *            as an array, or as a CSS string
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
 * Sets the emissive color of the material.
 *
 * An emissive material will display the emissive color at
 * full strength regardless of lighting. This can give the
 * appearance that the object is glowing.
 *
 * Note, "emissive" is a misnomer in the sense that the material
 * does not actually emit light that will affect surrounding objects.
 *
 * You can view more materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 *
 * @method emissiveMaterial
 * @param  {Number} v1       red or hue value relative to the current
 *                            color range
 * @param  {Number} v2       green or saturation value relative to the
 *                            current color range
 * @param  {Number} v3       blue or brightness value relative to the
 *                            current color range
 * @param  {Number} [alpha]  alpha value relative to current color
 *                            range (default is 0-255)
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('sphere with green emissive material');
 * }
 * function draw() {
 *   background(0);
 *   noStroke();
 *   ambientLight(0);
 *   emissiveMaterial(130, 230, 0);
 *   sphere(40);
 * }
 * </code>
 * </div>
 *
 * @alt
 * sphere with green emissive material
 */

/**
 * @method emissiveMaterial
 * @param  {Number} gray  number specifying value between
 *                         white and black
 * @chainable
 */

/**
 * @method emissiveMaterial
 * @param  {p5.Color|Number[]|String} color
 *           color as a <a href="#/p5.Color">p5.Color</a>,
 *            as an array, or as a CSS string
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
 * Sets the specular color of the material.
 *
 * A specular material is reflective (shiny). The shininess can be
 * controlled by the <a href="#/p5/shininess">shininess()</a> function.
 *
 * Like <a href="#/p5/ambientMaterial">ambientMaterial()</a>,
 * the specularMaterial() color is the color the object will reflect
 * under <a href="#/p5/ambientLight">ambientLight()</a>.
 * However unlike ambientMaterial(), for all other types of lights
 * (<a href="#/p5/directionalLight">directionalLight()</a>,
 * <a href="#/p5/pointLight">pointLight()</a>,
 * <a href="#/p5/spotLight">spotLight()</a>),
 * a specular material will reflect the **color of the light source**.
 * This is what gives it its "shiny" appearance.
 *
 * You can view more materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 *
 * @method specularMaterial
 * @param  {Number} gray number specifying value between white and black.
 * @param  {Number} [alpha] alpha value relative to current color range
 *                                 (default is 0-255)
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   describe('torus with specular material');
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   ambientLight(60);
 *
 *   // add point light to showcase specular material
 *   let locX = mouseX - width / 2;
 *   let locY = mouseY - height / 2;
 *   pointLight(255, 255, 255, locX, locY, 50);
 *
 *   specularMaterial(250);
 *   shininess(50);
 *   torus(30, 10, 64, 64);
 * }
 * </code>
 * </div>
 * @alt
 * torus with specular material
 */

/**
 * @method specularMaterial
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range
 * @param  {Number}        [alpha]
 * @chainable
 */

/**
 * @method specularMaterial
 * @param  {p5.Color|Number[]|String} color
 *           color as a <a href="#/p5.Color">p5.Color</a>,
 *            as an array, or as a CSS string
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
 * The default and minimum value is 1.
 *
 * @method shininess
 * @param {Number} shine  degree of shininess
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('two spheres, one more shiny than the other');
 * }
 * function draw() {
 *   background(0);
 *   noStroke();
 *   let locX = mouseX - width / 2;
 *   let locY = mouseY - height / 2;
 *   ambientLight(60, 60, 60);
 *   pointLight(255, 255, 255, locX, locY, 50);
 *   specularMaterial(250);
 *   translate(-25, 0, 0);
 *   shininess(1);
 *   sphere(20);
 *   translate(50, 0, 0);
 *   shininess(20);
 *   sphere(20);
 * }
 * </code>
 * </div>
 * @alt
 * two spheres, one more shiny than the other
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
 * @private blends colors according to color components.
 * If alpha value is less than 1, or non-standard blendMode
 * we need to enable blending on our gl context.
 * @param  {Number[]} color [description]
 * @return {Number[]]}  Normalized numbers array
 */
p5.RendererGL.prototype._applyColorBlend = function (colors) {
  const gl = this.GL;

  const isTexture = this.drawMode === constants.TEXTURE;
  const doBlend =
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
 * @return {Number[]]}  Normalized numbers array
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
      p5._friendlyError(
        'Oops! Somehow RendererGL set curBlendMode to an unsupported mode.'
      );
      break;
  }
  if (!this._isErasing) {
    this._cachedBlendMode = this.curBlendMode;
  }
};

export default p5;
