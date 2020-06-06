/**
 * @module Lights, Camera
 * @submodule Material
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import * as constants from '../core/constants';
import './p5.Texture';

/**
 * Loads a custom shader from the provided vertex and fragment
 * shader paths. The shader files are loaded asynchronously in the
 * background, so this method should be used in <a href="#/p5/preload">preload()</a>.
 *
 * For now, there are three main types of shaders. p5 will automatically
 * supply appropriate vertices, normals, colors, and lighting attributes
 * if the parameters defined in the shader match the names.
 *
 * @method loadShader
 * @param {String} vertFilename path to file containing vertex shader
 * source code
 * @param {String} fragFilename path to file containing fragment shader
 * source code
 * @param {function} [callback] callback to be executed after loadShader
 * completes. On success, the Shader object is passed as the first argument.
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
p5.prototype.loadShader = function(
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
 * @method createShader
 * @param {String} vertSrc source code for the vertex shader
 * @param {String} fragSrc source code for the fragment shader
 * @returns {p5.Shader} a shader object created from the provided
 * vertex and fragment shaders.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * // the 'varying's are shared between both vertex & fragment shaders
 * let varying = 'precision highp float; varying vec2 vPos;';
 *
 * // the vertex shader is called for each vertex
 * let vs =
 *   varying +
 *   'attribute vec3 aPosition;' +
 *   'void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }';
 *
 * // the fragment shader is called for each pixel
 * let fs =
 *   varying +
 *   'uniform vec2 p;' +
 *   'uniform float r;' +
 *   'const int I = 500;' +
 *   'void main() {' +
 *   '  vec2 c = p + vPos * r, z = c;' +
 *   '  float n = 0.0;' +
 *   '  for (int i = I; i > 0; i --) {' +
 *   '    if(z.x*z.x+z.y*z.y > 4.0) {' +
 *   '      n = float(i)/float(I);' +
 *   '      break;' +
 *   '    }' +
 *   '    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;' +
 *   '  }' +
 *   '  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);' +
 *   '}';
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
 * }
 *
 * function draw() {
 *   // 'r' is the size of the image in Mandelbrot-space
 *   mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
 *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
 * }
 * </code>
 * </div>
 *
 * @alt
 * zooming Mandelbrot set. a colorful, infinitely detailed fractal.
 */
p5.prototype.createShader = function(vertSrc, fragSrc) {
  this._assert3d('createShader');
  p5._validateParameters('createShader', arguments);
  return new p5.Shader(this._renderer, vertSrc, fragSrc);
};

/**
 * The <a href="#/p5/shader">shader()</a> function lets the user provide a custom shader
 * to fill in shapes in WEBGL mode. Users can create their
 * own shaders by loading vertex and fragment shaders with
 * <a href="#/p5/loadShader">loadShader()</a>.
 *
 * @method shader
 * @chainable
 * @param {p5.Shader} [s] the desired <a href="#/p5.Shader">p5.Shader</a> to use for rendering
 * shapes.
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
p5.prototype.shader = function(s) {
  this._assert3d('shader');
  p5._validateParameters('shader', arguments);

  if (s._renderer === undefined) {
    s._renderer = this._renderer;
  }

  if (s.isStrokeShader()) {
    this._renderer.userStrokeShader = s;
  } else {
    this._renderer.userFillShader = s;
    this._renderer._useNormalMaterial = false;
  }

  s.init();

  return this;
};

/**
 * This function restores the default shaders in WEBGL mode. Code that runs
 * after resetShader() will not be affected by previously defined
 * shaders. Should be run after <a href="#/p5/shader">shader()</a>.
 *
 * @method resetShader
 * @chainable
 */
p5.prototype.resetShader = function() {
  this._renderer.userFillShader = this._renderer.userStrokeShader = null;
  return this;
};

/**
 * Normal material for geometry is a material that is not affected by light.
 * It is not reflective and is a placeholder material often used for debugging.
 * Surfaces facing the X-axis, become red, those facing the Y-axis, become green and those facing the Z-axis, become blue.
 * You can view all possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method normalMaterial
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
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
 * Red, green and blue gradient.
 */
p5.prototype.normalMaterial = function(...args) {
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
 * Texture for geometry.  You can view other possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method texture
 * @param {p5.Image|p5.MediaElement|p5.Graphics} tex 2-dimensional graphics
 *                    to render as texture
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
 * }
 *
 * function draw() {
 *   background(0);
 *   rotateZ(frameCount * 0.01);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   //pass image as texture
 *   texture(img);
 *   box(200, 200, 200);
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
 *   pg = createGraphics(200, 200);
 *   pg.textSize(75);
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
 *
 * <div>
 * <code>
 * let vid;
 * function preload() {
 *   vid = createVideo('assets/fingers.mov');
 *   vid.hide();
 * }
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
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
 * Rotating view of many images umbrella and grid roof on a 3d plane
 * black canvas
 * black canvas
 */
p5.prototype.texture = function(tex) {
  this._assert3d('texture');
  p5._validateParameters('texture', arguments);
  if (tex.gifProperties) {
    tex._animateGif(this);
  }

  this._renderer.drawMode = constants.TEXTURE;
  this._renderer._useSpecularMaterial = false;
  this._renderer._useEmissiveMaterial = false;
  this._renderer._useNormalMaterial = false;
  this._renderer._tex = tex;
  this._renderer._setProperty('_doFill', true);

  return this;
};

/**
 * Sets the coordinate space for texture mapping. The default mode is IMAGE
 * which refers to the actual coordinates of the image.
 * NORMAL refers to a normalized space of values ranging from 0 to 1.
 * This function only works in WEBGL mode.
 *
 * With IMAGE, if an image is 100 x 200 pixels, mapping the image onto the entire
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
 *
 * @alt
 * the underside of a white umbrella and gridded ceiling above
 *
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
 * }
 *
 * function draw() {
 *   texture(img);
 *   textureMode(NORMAL);
 *   beginShape();
 *   vertex(-50, -50, 0, 0);
 *   vertex(50, -50, img.width, 0);
 *   vertex(50, 50, img.width, img.height);
 *   vertex(-50, 50, 0, img.height);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * the underside of a white umbrella and gridded ceiling above
 */
p5.prototype.textureMode = function(mode) {
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
 * when their uv's go outside of the 0 - 1 range. There are three options:
 * CLAMP, REPEAT, and MIRROR.
 *
 * CLAMP causes the pixels at the edge of the texture to extend to the bounds
 * REPEAT causes the texture to tile repeatedly until reaching the bounds
 * MIRROR works similarly to REPEAT but it flips the texture with every new tile
 *
 * REPEAT & MIRROR are only available if the texture
 * is a power of two size (128, 256, 512, 1024, etc.).
 *
 * This method will affect all textures in your sketch until a subsequent
 * textureWrap call is made.
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
p5.prototype.textureWrap = function(wrapX, wrapY = wrapX) {
  this._renderer.textureWrapX = wrapX;
  this._renderer.textureWrapY = wrapY;

  const textures = this._renderer.textures;
  for (let i = 0; i < textures.length; i++) {
    textures[i].setWrapMode(wrapX, wrapY);
  }
};

/**
 * Ambient material for geometry with a given color. Ambient material defines the color the object reflects under any lighting.
 * For example, if the ambient material of an object is pure red, but the ambient lighting only contains green, the object will not reflect any light.
 * Here's an <a href="https://p5js.org/examples/3d-materials.html">example containing all possible materials</a>.
 * @method  ambientMaterial
 * @param  {Number} v1  gray value, red or hue value
 *                         (depending on the current color mode),
 * @param  {Number} [v2] green or saturation value
 * @param  {Number} [v3] blue or brightness value
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   noStroke();
 *   ambientLight(200);
 *   ambientMaterial(70, 130, 230);
 *   sphere(40);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * // ambientLight is both red and blue (magenta),
 * // so object only reflects it's red and blue components
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(70);
 *   ambientLight(100); // white light
 *   ambientMaterial(255, 0, 255); // pink material
 *   box(30);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * // ambientLight is green. Since object does not contain
 * // green, it does not reflect any light
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(70);
 *   ambientLight(0, 255, 0); // green light
 *   ambientMaterial(255, 0, 255); // pink material
 *   box(30);
 * }
 * </code>
 * </div>
 * @alt
 * radiating light source from top right of canvas
 * box reflecting only red and blue light
 * box reflecting no light
 */
/**
 * @method  ambientMaterial
 * @param  {Number[]|String|p5.Color} color  color, color Array, or CSS color string
 * @chainable
 */
p5.prototype.ambientMaterial = function(v1, v2, v3) {
  this._assert3d('ambientMaterial');
  p5._validateParameters('ambientMaterial', arguments);

  const color = p5.prototype.color.apply(this, arguments);
  this._renderer.curFillColor = color._array;
  this._renderer._useSpecularMaterial = false;
  this._renderer._useEmissiveMaterial = false;
  this._renderer._useNormalMaterial = false;
  this._renderer._enableLighting = true;
  this._renderer._tex = null;

  return this;
};

/**
 * Sets the emissive color of the material used for geometry drawn to
 * the screen. This is a misnomer in the sense that the material does not
 * actually emit light that effects surrounding polygons. Instead,
 * it gives the appearance that the object is glowing. An emissive material
 * will display at full strength even if there is no light for it to reflect.
 * @method emissiveMaterial
 * @param  {Number} v1  gray value, red or hue value
 *                         (depending on the current color mode),
 * @param  {Number} [v2] green or saturation value
 * @param  {Number} [v3] blue or brightness value
 * @param  {Number} [a]  opacity
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
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
 * radiating light source from top right of canvas
 */
/**
 * @method  emissiveMaterial
 * @param  {Number[]|String|p5.Color} color  color, color Array, or CSS color string
 * @chainable
 */
p5.prototype.emissiveMaterial = function(v1, v2, v3, a) {
  this._assert3d('emissiveMaterial');
  p5._validateParameters('emissiveMaterial', arguments);

  const color = p5.prototype.color.apply(this, arguments);
  this._renderer.curFillColor = color._array;
  this._renderer._useSpecularMaterial = false;
  this._renderer._useEmissiveMaterial = true;
  this._renderer._useNormalMaterial = false;
  this._renderer._enableLighting = true;
  this._renderer._tex = null;

  return this;
};

/**
 * Specular material for geometry with a given color. Specular material is a shiny reflective material.
 * Like ambient material it also defines the color the object reflects under ambient lighting.
 * For example, if the specular material of an object is pure red, but the ambient lighting only contains green, the object will not reflect any light.
 * For all other types of light like point and directional light, a specular material will reflect the color of the light source to the viewer.
 * Here's an <a href="https://p5js.org/examples/3d-materials.html">example containing all possible materials</a>.
 * @method specularMaterial
 * @param  {Number} v1  gray value, red or hue value
 *                       (depending on the current color mode),
 * @param  {Number} [v2] green or saturation value
 * @param  {Number} [v3] blue or brightness value
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   ambientLight(50);
 *   pointLight(250, 250, 250, 100, 100, 30);
 *   specularMaterial(250);
 *   sphere(40);
 * }
 * </code>
 * </div>
 * @alt
 * diffused radiating light source from top right of canvas
 */
/**
 * @method specularMaterial
 * @param  {Number[]|String|p5.Color} color color Array, or CSS color string
 * @chainable
 */
p5.prototype.specularMaterial = function(v1, v2, v3) {
  this._assert3d('specularMaterial');
  p5._validateParameters('specularMaterial', arguments);

  const color = p5.prototype.color.apply(this, arguments);
  this._renderer.curFillColor = color._array;
  this._renderer._useSpecularMaterial = true;
  this._renderer._useEmissiveMaterial = false;
  this._renderer._useNormalMaterial = false;
  this._renderer._enableLighting = true;
  this._renderer._tex = null;

  return this;
};

/**
 * Sets the amount of gloss in the surface of shapes.
 * Used in combination with specularMaterial() in setting
 * the material properties of shapes. The default and minimum value is 1.
 * @method shininess
 * @param {Number} shine Degree of Shininess.
 *                       Defaults to 1.
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
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
 * Shininess on Camera changes position with mouse
 */
p5.prototype.shininess = function(shine) {
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
p5.RendererGL.prototype._applyColorBlend = function(colors) {
  const gl = this.GL;

  const isTexture = this.drawMode === constants.TEXTURE;
  const doBlend =
    isTexture || colors[colors.length - 1] < 1.0 || this._isErasing;

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
p5.RendererGL.prototype._applyBlendMode = function() {
  if (this._cachedBlendMode === this.curBlendMode) {
    return;
  }
  const gl = this.GL;
  switch (this.curBlendMode) {
    case constants.BLEND:
    case constants.ADD:
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      break;
    case constants.REMOVE:
      gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
      gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
      break;
    case constants.MULTIPLY:
      gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
      gl.blendFuncSeparate(gl.ZERO, gl.SRC_COLOR, gl.ONE, gl.ONE);
      break;
    case constants.SCREEN:
      gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
      gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR, gl.ONE, gl.ONE, gl.ONE);
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
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
      break;
    case constants.DARKEST:
      if (this.blendExt) {
        gl.blendEquationSeparate(this.blendExt.MIN_EXT, gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
      } else {
        console.warn(
          'blendMode(DARKEST) does not work in your browser in WEBGL mode.'
        );
      }
      break;
    case constants.LIGHTEST:
      if (this.blendExt) {
        gl.blendEquationSeparate(this.blendExt.MAX_EXT, gl.FUNC_ADD);
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
