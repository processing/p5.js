/**
* @module 3D
* @submodule strands
* @for p5
* @requires core
*/
import { glslBackend } from './strands_glslBackend';

import { transpileStrandsToJS, detectOutsideVariableReferences } from './strands_transpiler';
import { BlockType } from './ir_types';

import { createDirectedAcyclicGraph } from './ir_dag'
import { createControlFlowGraph, createBasicBlock, pushBlock, popBlock } from './ir_cfg';
import { generateShaderCode } from './strands_codegen';
import { initGlobalStrandsAPI, createShaderHooksFunctions } from './strands_api';

function strands(p5, fn) {
  //////////////////////////////////////////////
  // Global Runtime
  //////////////////////////////////////////////
  function initStrandsContext(ctx, backend, { active = false } = {}) {
    ctx.dag = createDirectedAcyclicGraph();
    ctx.cfg = createControlFlowGraph();
    ctx.uniforms = [];
    ctx.vertexDeclarations = new Set();
    ctx.fragmentDeclarations = new Set();
    ctx.hooks = [];
    ctx.backend = backend;
    ctx.active = active;
    ctx.previousFES = p5.disableFriendlyErrors;
    ctx.windowOverrides = {};
    ctx.fnOverrides = {};
    if (active) {
      p5.disableFriendlyErrors = true;
    }
  }

  function deinitStrandsContext(ctx) {
    ctx.dag = createDirectedAcyclicGraph();
    ctx.cfg = createControlFlowGraph();
    ctx.uniforms = [];
    ctx.vertexDeclarations = new Set();
    ctx.fragmentDeclarations = new Set();
    ctx.hooks = [];
    ctx.active = false;
    p5.disableFriendlyErrors = ctx.previousFES;
    for (const key in ctx.windowOverrides) {
      window[key] = ctx.windowOverrides[key];
    }
    for (const key in ctx.fnOverrides) {
      fn[key] = ctx.fnOverrides[key];
    }
  }

  const strandsContext = {};
  initStrandsContext(strandsContext);
  initGlobalStrandsAPI(p5, fn, strandsContext)

  //////////////////////////////////////////////
  // Entry Point
  //////////////////////////////////////////////
  const oldModify = p5.Shader.prototype.modify;

  p5.Shader.prototype.modify = function(shaderModifier, scope = {}) {
    if (shaderModifier instanceof Function) {
      // Reset the context object every time modify is called;
      // const backend = glslBackend;
      initStrandsContext(strandsContext, glslBackend, { active: true });
      createShaderHooksFunctions(strandsContext, fn, this);
      // TODO: expose this, is internal for debugging for now.
      const options = { parser: true, srcLocations: false };

      // 0. Detect outside variable references in uniforms (before transpilation)
      if (options.parser) {
        const sourceString = `(${shaderModifier.toString()})`;
        const errors = detectOutsideVariableReferences(sourceString);
        if (errors.length > 0) {
          // Show errors to the user
          for (const error of errors) {
            p5._friendlyError(
              `p5.strands: ${error.message}`
            );
          }
        }
      }

      // 1. Transpile from strands DSL to JS
      let strandsCallback;
      if (options.parser) {
        // #7955 Wrap function declaration code in brackets so anonymous functions are not top level statements, which causes an error in acorn when parsing
        // https://github.com/acornjs/acorn/issues/1385
        const sourceString = `(${shaderModifier.toString()})`;
        strandsCallback = transpileStrandsToJS(p5, sourceString, options.srcLocations, scope);
      } else {
        strandsCallback = shaderModifier;
      }

      // 2. Build the IR from JavaScript API
      const globalScope = createBasicBlock(strandsContext.cfg, BlockType.GLOBAL);
      pushBlock(strandsContext.cfg, globalScope);
      strandsCallback();
      popBlock(strandsContext.cfg);

      // 3. Generate shader code hooks object from the IR
      // .......
      const hooksObject = generateShaderCode(strandsContext);

      // Reset the strands runtime context
      deinitStrandsContext(strandsContext);

      // Call modify with the generated hooks object
      return oldModify.call(this, hooksObject);
    }
    else {
      return oldModify.call(this, shaderModifier)
    }
  }
}

export default strands;

if (typeof p5 !== 'undefined') {
  p5.registerAddon(strands)
}

/* ------------------------------------------------------------- */
/**
 * @method getWorldInputs
 * @description
 * Registers a callback to modify the world-space properties of each vertex in a shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to customize vertex positions, normals, texture coordinates, and colors before rendering. "World space" refers to the coordinate system of the 3D scene, before any camera or projection transformations are applied.
 *
 * The callback receives a vertex object with the following properties:
 * - `position`: a three-component vector representing the original position of the vertex.
 * - `normal`: a three-component vector representing the direction the surface is facing.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * This hook is available in:
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives a vertex object containing position (vec3), normal (vec3), texCoord (vec2), and color (vec4) properties. The function should return the modified vertex object.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     let t = uniformFloat(() => millis());
 *     getWorldInputs(inputs => {
 *       // Move the vertex up and down in a wave in world space
 *       // In world space, moving the object (e.g., with translate()) will affect these coordinates
*       // The sphere is ~50 units tall here, so 20 gives a noticeable wave
 *       inputs.position.y += 20 * sin(t * 0.001 + inputs.position.x * 0.05);
 *       return inputs;
 *     });
 *   });
 * }
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
 */

/**
 * @method combineColors
 * @description
 * Registers a callback to customize how color components are combined in the fragment shader. This hook can be used inside <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to control the final color output of a material. The callback receives an object with the following properties:
 *
 * - `baseColor`: a three-component vector representing the base color (red, green, blue).
 * - `diffuse`: a single number representing the diffuse reflection.
 * - `ambientColor`: a three-component vector representing the ambient color.
 * - `ambient`: a single number representing the ambient reflection.
 * - `specularColor`: a three-component vector representing the specular color.
 * - `specular`: a single number representing the specular reflection.
 * - `emissive`: a three-component vector representing the emissive color.
 * - `opacity`: a single number representing the opacity.
 *
 * The callback should return a vector with four components (red, green, blue, alpha) for the final color.
 *
 * This hook is available in:
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the object described above and returns a vector with four components for the final color.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     combineColors(components => {
 *       // Custom color combination: add a green tint using vector properties
 *       return [
 *         components.baseColor * components.diffuse +
 *           components.ambientColor * components.ambient +
 *           components.specularColor * components.specular +
 *           components.emissive +
 *           [0, 0.2, 0], // Green tint for visibility
 *         components.opacity
 *       ];
 *     });
 *   });
 * }
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('white');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */

/**
 * @method beforeVertex
 * @private
 * @description
 * Registers a callback to run custom code at the very start of the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to set up variables or perform calculations that affect every vertex before processing begins. The callback receives no arguments.
 *
 * Note: This hook is currently limited to per-vertex operations; storing variables for later use is not supported.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called before each vertex is processed.
 */

/**
 * @method afterVertex
 * @private
 * @description
 * Registers a callback to run custom code at the very end of the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to perform cleanup or final calculations after all vertex processing is done. The callback receives no arguments.
 *
 * Note: This hook is currently limited to per-vertex operations; storing variables for later use is not supported.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called after each vertex is processed.
 */

/**
 * @method beforeFragment
 * @private
 * @description
 * Registers a callback to run custom code at the very start of the fragment shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to set up variables or perform calculations that affect every pixel before color calculations begin. The callback receives no arguments.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called before each fragment is processed.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     beforeFragment(() => {
 *       // Set a value for use in getFinalColor
 *       this.brightness = 0.5 + 0.5 * sin(millis() * 0.001);
 *     });
 *     getFinalColor(color => {
 *       // Use the value set in beforeFragment to tint the color
 *       color.r *= this.brightness; // Tint red channel
 *       return color;
 *     });
 *   });
 * }
 * function draw() {
 *   background(220);
 *   shader(myShader);
 *   noStroke();
 *   fill('teal');
 *   box(100);
 * }
 * </code>
 * </div>
 */

/**
 * @method getPixelInputs
 * @description
 * Registers a callback to modify the properties of each fragment (pixel) before the final color is calculated in the fragment shader. This hook can be used inside <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to adjust per-pixel data before lighting/mixing.
 *
 * The callback receives an `Inputs` object. Available fields depend on the shader:
 *
 * - In <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>:
 *   - `normal`: a three-component vector representing the surface normal.
 *   - `texCoord`: a two-component vector representing the texture coordinates (u, v).
 *   - `ambientLight`: a three-component vector representing the ambient light color.
 *   - `ambientMaterial`: a three-component vector representing the material's ambient color.
 *   - `specularMaterial`: a three-component vector representing the material's specular color.
 *   - `emissiveMaterial`: a three-component vector representing the material's emissive color.
 *   - `color`: a four-component vector representing the base color (red, green, blue, alpha).
 *   - `shininess`: a number controlling specular highlights.
 *   - `metalness`: a number controlling the metalness factor.
 *
 * - In <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>:
 *   - `color`: a four-component vector representing the stroke color (red, green, blue, alpha).
 *   - `tangent`: a two-component vector representing the stroke tangent.
 *   - `center`: a two-component vector representing the cap/join center.
 *   - `position`: a two-component vector representing the current fragment position.
 *   - `strokeWeight`: a number representing the stroke weight in pixels.
 *
 * Return the modified object to update the fragment.
 *
 * This hook is available in:
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the fragment inputs object and should return it after making any changes.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     let t = uniformFloat(() => millis());
 *     getPixelInputs(inputs => {
 *       // Animate alpha (transparency) based on x position
 *       inputs.color.a = 0.5 + 0.5 * sin(inputs.texCoord.x * 10.0 + t * 0.002);
 *       return inputs;
 *     });
 *   });
 * }
 * function draw() {
 *   background(240);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('purple');
 *   circle(0, 0, 100);
 * }
 * </code>
 * </div>
 */

/**
 * @method shouldDiscard
 * @private
 * @description
 * Registers a callback to decide whether to discard (skip drawing) a fragment (pixel) in the fragment shader. This hook can be used inside <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to create effects like round points or custom masking. The callback receives a boolean:
 * - `willDiscard`: true if the fragment would be discarded by default
 *
 * Return true to discard the fragment, or false to keep it.
 *
 * This hook is available in:
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives a boolean and should return a boolean.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseStrokeShader().modify({
 *      'bool shouldDiscard': '(bool outside) { return outside; }'
 *   });
 * }
 * function draw() {
 *   background(255);
 *   strokeShader(myShader);
 *   strokeWeight(30);
 *   line(-width/3, 0, width/3, 0);
 * }
 * </code>
 * </div>
 */

/**
 * @method getFinalColor
 * @description
 * Registers a callback to change the final color of each pixel after all lighting and mixing is done in the fragment shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to adjust the color before it appears on the screen. The callback receives a four component vector representing red, green, blue, and alpha.
 *
 * Return a new color array to change the output color.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the color array and should return a color array.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     getFinalColor(color => {
 *       // Add a blue tint to the output color
 *       color.b += 0.4;
 *       return color;
 *     });
 *   });
 * }
 * function draw() {
 *   background(230);
 *   shader(myShader);
 *   noStroke();
 *   fill('green');
 *   circle(0, 0, 100);
 * }
 * </code>
 * </div>
 */

/**
 * @method afterFragment
 * @private
 * @description
 * Registers a callback to run custom code at the very end of the fragment shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to perform cleanup or final per-pixel effects after all color calculations are done. The callback receives no arguments.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called after each fragment is processed.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     getFinalColor(color => {
 *       // Add a purple tint to the color
 *       color.b += 0.2;
 *       return color;
 *     });
 *     afterFragment(() => {
 *       // This hook runs after the final color is set for each fragment.
 *       // You could use this for debugging or advanced effects.
 *     });
 *   });
 * }
 * function draw() {
 *   background(240);
 *   shader(myShader);
 *   noStroke();
 *   fill('purple');
 *   sphere(60);
 * }
 * </code>
 * </div>
 */

/**
 * @method getColor
 * @description
 * Registers a callback to set the final color for each pixel in a filter shader. This hook can be used inside <a href="#/p5/baseFilterShader">baseFilterShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to control the output color for each pixel. The callback receives the following arguments:
 * - `inputs`: an object with the following properties:
 *   - `texCoord`: a two-component vector representing the texture coordinates (u, v).
 *   - `canvasSize`: a two-component vector representing the canvas size in pixels (width, height).
 *   - `texelSize`: a two-component vector representing the size of a single texel in texture space.
 * - `canvasContent`: a texture containing the sketch's contents before the filter is applied.
 *
 * Return a four-component vector `[r, g, b, a]` for the pixel.
 *
 * This hook is available in:
 * - <a href="#/p5/baseFilterShader">baseFilterShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the inputs object and canvasContent, and should return a color array.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseFilterShader().modify(() => {
 *     getColor((inputs, canvasContent) => {
 *       // Warp the texture coordinates for a wavy effect
 *       let warped = [inputs.texCoord.x, inputs.texCoord.y + 0.1 * sin(inputs.texCoord.x * 10.0)];
 *       return getTexture(canvasContent, warped);
 *     });
 *   });
 * }
 * function draw() {
 *   background(180);
 *   // Draw something to the canvas
 *   fill('yellow');
 *   circle(0, 0, 150);
 *   filter(myShader);
 * }
 * </code>
 * </div>
 */

/**
 * @method getObjectInputs
 * @description
 * Registers a callback to modify the properties of each vertex before any transformations are applied in the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to move, color, or otherwise modify the raw model data. The callback receives an object with the following properties:
 *
 * - `position`: a three-component vector representing the original position of the vertex.
 * - `normal`: a three-component vector representing the direction the surface is facing.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * Return the modified object to update the vertex.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the vertex object and should return it after making any changes.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     let t = uniformFloat(() => millis());
 *     getObjectInputs(inputs => {
 *       // Create a sine wave along the x axis in object space
 *       inputs.position.y += sin(t * 0.001 + inputs.position.x);
 *       return inputs;
 *     });
 *   });
 * }
 * function draw() {
 *   background(220);
 *   shader(myShader);
 *   noStroke();
 *   fill('orange');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */

/**
 * @method getCameraInputs
 * @description
 * Registers a callback to adjust vertex properties after the model has been transformed by the camera, but before projection, in the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to create effects that depend on the camera's view. The callback receives an object with the following properties:
 *
 * - `position`: a three-component vector representing the position after camera transformation.
 * - `normal`: a three-component vector representing the normal after camera transformation.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * Return the modified object to update the vertex.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the vertex object and should return it after making any changes.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     getCameraInputs(inputs => {
 *       // Move vertices in camera space based on their x position
 *       let t = uniformFloat(() => millis());
 *       inputs.position.y += 30 * sin(inputs.position.x * 0.05 + t * 0.001);
 *       // Tint all vertices blue
 *       inputs.color.b = 1;
 *       return inputs;
 *     });
 *   });
 * }
 * function draw() {
 *   background(200);
 *   shader(myShader);
 *   noStroke();
 *   fill('red');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */
