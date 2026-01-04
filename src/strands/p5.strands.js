/**
 * @module 3D
 * @submodule p5.strands
 * @for p5
 * @requires core
 */

import { transpileStrandsToJS } from "./strands_transpiler";
import { BlockType } from "./ir_types";

import { createDirectedAcyclicGraph } from "./ir_dag";
import {
  createControlFlowGraph,
  createBasicBlock,
  pushBlock,
  popBlock,
} from "./ir_cfg";
import { generateShaderCode } from "./strands_codegen";
import {
  initGlobalStrandsAPI,
  createShaderHooksFunctions,
} from "./strands_api";

function strands(p5, fn) {
  // Whether or not strands callbacks should be forced to be executed in global mode.
  // This is turned on while loading shaders from files, when there is not a feasible
  // way to pass context in.
  fn._runStrandsInGlobalMode = false;

  //////////////////////////////////////////////
  // Global Runtime
  //////////////////////////////////////////////
  function initStrandsContext(ctx, backend, { active = false, renderer = null, baseShader = null } = {}) {
    ctx.dag = createDirectedAcyclicGraph();
    ctx.cfg = createControlFlowGraph();
    ctx.uniforms = [];
    ctx.vertexDeclarations = new Set();
    ctx.fragmentDeclarations = new Set();
    ctx.hooks = [];
    ctx.globalAssignments = [];
    ctx.backend = backend;
    ctx.active = active;
    ctx.renderer = renderer;
    ctx.baseShader = baseShader;
    ctx.previousFES = p5.disableFriendlyErrors;
    ctx.windowOverrides = {};
    ctx.fnOverrides = {};
    if (active) {
      p5.disableFriendlyErrors = true;
    }
    ctx.p5 = p5;
  }

  function deinitStrandsContext(ctx) {
    ctx.dag = createDirectedAcyclicGraph();
    ctx.cfg = createControlFlowGraph();
    ctx.uniforms = [];
    ctx.vertexDeclarations = new Set();
    ctx.fragmentDeclarations = new Set();
    ctx.hooks = [];
    ctx.globalAssignments = [];
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
  initGlobalStrandsAPI(p5, fn, strandsContext);

  function withTempGlobalMode(pInst, callback) {
    if (pInst._isGlobal) return callback();

    const prev = {};
    for (const key of Object.getOwnPropertyNames(fn)) {
      const descriptor = Object.getOwnPropertyDescriptor(
        fn,
        key
      );
      if (descriptor && !descriptor.get && typeof fn[key] === 'function') {
        prev[key] = window[key];
        window[key] = fn[key].bind(pInst);
      }
    }

    try {
      callback();
    } finally {
      for (const key in prev) {
        window[key] = prev[key];
      }
    }
  }

  //////////////////////////////////////////////
  // Entry Point
  //////////////////////////////////////////////
  const oldModify = p5.Shader.prototype.modify;

  p5.Shader.prototype.modify = function (shaderModifier, scope = {}) {
    try {
      if (shaderModifier instanceof Function || typeof shaderModifier === 'string') {
        // Reset the context object every time modify is called;
        // const backend = glslBackend;
        initStrandsContext(strandsContext, this._renderer.strandsBackend, {
          active: true,
          renderer: this._renderer,
          baseShader: this,
        });
        createShaderHooksFunctions(strandsContext, fn, this);
        // TODO: expose this, is internal for debugging for now.
        const options = { parser: true, srcLocations: false };

        // 1. Transpile from strands DSL to JS
        let strandsCallback;
        if (options.parser) {
          // #7955 Wrap function declaration code in brackets so anonymous functions are not top level statements, which causes an error in acorn when parsing
          // https://github.com/acornjs/acorn/issues/1385
          const sourceString = typeof shaderModifier === 'string'
            ? `(${shaderModifier})`
            : `(${shaderModifier.toString()})`;
          strandsCallback = transpileStrandsToJS(
            p5,
            sourceString,
            options.srcLocations,
            scope,
          );
        } else {
          strandsCallback = shaderModifier;
        }

        // 2. Build the IR from JavaScript API
        const globalScope = createBasicBlock(
          strandsContext.cfg,
          BlockType.GLOBAL,
        );
        pushBlock(strandsContext.cfg, globalScope);
        if (strandsContext.renderer?._pInst?._runStrandsInGlobalMode) {
          withTempGlobalMode(strandsContext.renderer._pInst, strandsCallback);
        } else {
          strandsCallback();
        }
        popBlock(strandsContext.cfg);

        // 3. Generate shader code hooks object from the IR
        // .......
        const hooksObject = generateShaderCode(strandsContext);

        // Call modify with the generated hooks object
        return oldModify.call(this, hooksObject);
      } else {
        return oldModify.call(this, shaderModifier);
      }
    } finally {
      // Reset the strands runtime context
      deinitStrandsContext(strandsContext);
    }
  };
}

export default strands;

if (typeof p5 !== "undefined") {
  p5.registerAddon(strands);
}

/* ------------------------------------------------------------- */
/**
 * @property {Object} worldInputs
 * @description
 * A shader hook block that modifies the world-space properties of each vertex in a shader. This hook can be used inside <a href="#/p5/buildColorShader">`buildColorShader()`</a> and similar shader <a href="#/p5.Shader/modify">`modify()`</a> calls to customize vertex positions, normals, texture coordinates, and colors before rendering. Modifications happen between the `.begin()` and `.end()` methods of the hook. "World space" refers to the coordinate system of the 3D scene, before any camera or projection transformations are applied.
 *
 * `worldInputs` has the following properties:
 * - `position`: a three-component vector representing the original position of the vertex.
 * - `normal`: a three-component vector representing the direction the surface is facing.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * This hook is available in:
 * - <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>
 * - <a href="#/p5/buildNormalShader">`buildNormalShader()`</a>
 * - <a href="#/p5/buildColorShader">`buildColorShader()`</a>
 * - <a href="#/p5/buildStrokeShader">`buildStrokeShader()`</a>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   let t = uniformFloat();
 *   worldInputs.begin();
 *   // Move the vertex up and down in a wave in world space
 *   // In world space, moving the object (e.g., with translate()) will affect these coordinates
 *   // The sphere is ~50 units tall here, so 20 gives a noticeable wave
 *   worldInputs.position.y += 20 * sin(t * 0.001 + worldInputs.position.x * 0.05);
 *   worldInputs.end();
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   myShader.setUniform('t', millis());
 *   lights();
 *   noStroke();
 *   fill('red');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */

/**
 * @property {Object} combineColors
 * @description
 * A shader hook block that modifies how color components are combined in the fragment shader. This hook can be used inside <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a> and similar shader <a href="#/p5.Shader/modify">`modify()`</a> calls to control the final color output of a material. Modifications happen between the `.begin()` and `.end()` methods of the hook.
 *
 * `combineColors` has the following properties:
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
 * Call `.set()` on the hook with a vector with four components (red, green, blue, alpha) for the final color.
 *
 * This hook is available in:
 * - <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   combineColors.begin();
 *   // Custom color combination: add a green tint using vector properties
 *   combineColors.set([
 *     combineColors.baseColor * combineColors.diffuse +
 *       combineColors.ambientColor * combineColors.ambient +
 *       combineColors.specularColor * combineColors.specular +
 *       combineColors.emissive +
 *       [0, 0.2, 0], // Green tint
 *     combineColors.opacity
 *   ]);
 *   combineColors.end();
 * }
 *
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
 * @property {Object} pixelInputs
 * @description
 * A shader hook block that modifies the properties of each pixel before the final color is calculated. This hook can be used inside <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a> and similar shader <a href="#/p5.Shader/modify">`modify()`</a> calls to adjust per-pixel data before lighting is applied. Modifications happen between the `.begin()` and `.end()` methods of the hook.
 *
 * The properties of `pixelInputs` depend on the shader:
 *
 * - In <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>:
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
 * - In <a href="#/p5/buildStrokeShader">`buildStrokeShader()`</a>:
 *   - `color`: a four-component vector representing the stroke color (red, green, blue, alpha).
 *   - `tangent`: a two-component vector representing the stroke tangent.
 *   - `center`: a two-component vector representing the cap/join center.
 *   - `position`: a two-component vector representing the current fragment position.
 *   - `strokeWeight`: a number representing the stroke weight in pixels.
 *
 * This hook is available in:
 * - <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>
 * - <a href="#/p5/buildStrokeShader">`buildStrokeShader()`</a>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   let t = uniformFloat();
 *   pixelInputs.begin();
 *   // Animate alpha (transparency) based on x position
 *   pixelInputs.color.a = 0.5 + 0.5 *
 *     sin(pixelInputs.texCoord.x * 10.0 + t * 0.002);
 *   pixelInputs.end();
 * }
 *
 * function draw() {
 *   background(240);
 *   shader(myShader);
 *   myShader.setUniform('t', millis());
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
 * @property finalColor
 * @description
 * A shader hook block that modifies the final color of each pixel after all lighting is applied. This hook can be used inside <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a> and similar shader <a href="#/p5.Shader/modify">`modify()`</a> calls to adjust the color before it appears on the screen. Modifications happen between the `.begin()` and `.end()` methods of the hook.
 *
 * `finalColor` has the following properties:
 * - `color`: a four-component vector representing the pixel color (red, green, blue, alpha).
 *
 * Call `.set()` on the hook with a vector with four components (red, green, blue, alpha) to update the final color.
 *
 * This hook is available in:
 * - <a href="#/p5/buildColorShader">`buildColorShader()`</a>
 * - <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>
 * - <a href="#/p5/buildNormalShader">`buildNormalShader()`</a>
 * - <a href="#/p5/buildStrokeShader">`buildStrokeShader()`</a>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   finalColor.begin();
 *   let color = finalColor.color;
 *   // Add a blue tint to the output color
 *   color.b += 0.4;
 *   finalColor.set(color);
 *   finalColor.end();
 * }
 *
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
 * @property {Object} filterColor
 * @description
 * A shader hook block that sets the color for each pixel in a filter shader. This hook can be used inside <a href="#/p5/buildFilterShader">`buildFilterShader()`</a> to control the output color for each pixel.
 *
 * `filterColor` has the following properties:
 * - `texCoord`: a two-component vector representing the texture coordinates (u, v).
 * - `canvasSize`: a two-component vector representing the canvas size in pixels (width, height).
 * - `texelSize`: a two-component vector representing the size of a single texel in texture space.
 * - `canvasContent`: a texture containing the sketch's contents before the filter is applied.
 *
 * Call `.set()` on the hook with a vector with four components (red, green, blue, alpha) to update the final color.
 *
 * This hook is available in:
 * - <a href="#/p5/buildFilterShader">`buildFilterShader()`</a>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildFilterShader(warp);
 * }
 *
 * function warp() {
 *   filterColor.begin();
 *   // Warp the texture coordinates for a wavy effect
 *   let warped = [
 *     filterColor.texCoord.x,
 *     filterColor.texCoord.y + 0.1 * sin(filterColor.texCoord.x * 10)
 *   ];
 *   filterColor.set(getTexture(canvasContent, warped));
 *   filterColor.end();
 * }
 *
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
 * @property {Object} objectInputs
 * @description
 * A shader hook block to modify the properties of each vertex before any transformations are applied. This hook can be used inside <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a> and similar shader <a href="#/p5.Shader/modify">`modify()`</a> calls to customize vertex positions, normals, texture coordinates, and colors before rendering. Modifications happen between the `.begin()` and `.end()` methods of the hook. "Object space" refers to the coordinate system of the 3D scene before any transformations, cameras, or projection transformations are applied.
 *
 * `objectInputs` has the following properties:
 * - `position`: a three-component vector representing the original position of the vertex.
 * - `normal`: a three-component vector representing the direction the surface is facing.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * This hook is available in:
 * - <a href="#/p5/buildColorShader">`buildColorShader()`</a>
 * - <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>
 * - <a href="#/p5/buildNormalShader">`buildNormalShader()`</a>
 * - <a href="#/p5/buildStrokeShader">`buildStrokeShader()`</a>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   let t = uniformFloat();
 *   objectInputs.begin();
 *   // Create a sine wave along the object
 *   objectInputs.position.y += sin(t * 0.001 + objectInputs.position.x);
 *   objectInputs.end();
 * }
 *
 * function draw() {
 *   background(220);
 *   shader(myShader);
 *   myShader.setUniform('t', millis());
 *   noStroke();
 *   fill('orange');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */

/**
 * @property {Object} cameraInputs
 * @description
 * A shader hook block that adjusts vertex properties from the perspective of the camera. This hook can be used inside <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a> and similar shader <a href="#/p5.Shader/modify">`modify()`</a> calls to customize vertex positions, normals, texture coordinates, and colors before rendering. "Camera space" refers to the coordinate system of the 3D scene after transformations have been applied, seen relative to the camera.
 *
 * `cameraInputs`  has the following properties:
 * - `position`: a three-component vector representing the position after camera transformation.
 * - `normal`: a three-component vector representing the normal after camera transformation.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * This hook is available in:
 * - <a href="#/p5/buildColorShader">`buildColorShader()`</a>
 * - <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>
 * - <a href="#/p5/buildNormalShader">`buildNormalShader()`</a>
 * - <a href="#/p5/buildStrokeShader">`buildStrokeShader()`</a>
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader(material);
 * }
 *
 * function material() {
 *   let t = uniformFloat();
 *   cameraInputs.begin();
 *   // Move vertices in camera space based on their x position
 *   cameraInputs.position.y += 30 * sin(cameraInputs.position.x * 0.05 + t * 0.001);
 *   // Tint all vertices blue
 *   cameraInputs.color.b = 1;
 *   cameraInputs.end();
 * }
 *
 * function draw() {
 *   background(200);
 *   shader(myShader);
 *   myShader.setUniform('t', millis());
 *   noStroke();
 *   fill('red');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */
