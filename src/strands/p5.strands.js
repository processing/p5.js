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
  function initStrandsContext(
    ctx,
    backend,
    { active = false, renderer = null, baseShader = null } = {},
  ) {
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
      const descriptor = Object.getOwnPropertyDescriptor(fn, key);
      if (descriptor && !descriptor.get && typeof fn[key] === "function") {
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
      if (
        shaderModifier instanceof Function ||
        typeof shaderModifier === "string"
      ) {
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
          const sourceString =
            typeof shaderModifier === "string"
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
 */

/**
 * @method smoothstep
 * @description
 * A shader function that performs smooth Hermite interpolation between `0.0`
 * and `1.0`.
 *
 * This function is equivalent to the GLSL built-in
 * `smoothstep(edge0, edge1, x)` and is available inside p5.strands shader
 * callbacks. It is commonly used to create soft transitions, smooth edges,
 * fades, and anti-aliased effects.
 *
 * Smoothstep is useful when a threshold or cutoff is needed, but with a
 * gradual transition instead of a hard edge.
 *
 * - Returns `0.0` when `x` is less than or equal to `edge0`
 * - Returns `1.0` when `x` is greater than or equal to `edge1`
 * - Smoothly interpolates between `0.0` and `1.0` when `x` is between them
 *
 * @param {Number} edge0
 *        Lower edge of the transition
 * @param {Number} edge1
 *        Upper edge of the transition
 * @param {Number} x
 *        Input value to interpolate
 *
 * @returns {Number}
 *          A value between `0.0` and `1.0`
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Example 1: A soft vertical fade using smoothstep (no uniforms)
 *
 * let fadeShader;
 *
 * function fadeCallback() {
 *   getColor((inputs) => {
 *     // x goes from 0 → 1 across the canvas
 *     let x = inputs.texCoord.x;
 *
 *     // smoothstep creates a soft transition instead of a hard edge
 *     let t = smoothstep(0.25, 0.35, x);
 *
 *     // Use t directly as brightness
 *     return [t, t, t, 1];
 *   });
 * }
 *
 * function setup() {
 *   createCanvas(300, 200, WEBGL);
 *   fadeShader = baseFilterShader().modify(fadeCallback);
 * }
 *
 * function draw() {
 *   background(0);
 *   filter(fadeShader);
 * }
 * </code>
 * </div>
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Example 2: Animate the smooth transition using a uniform
 *
 * let animatedShader;
 *
 * function animatedFadeCallback() {
 *   const time = uniformFloat(() => millis() * 0.001);
 *
 *   getColor((inputs) => {
 *     let x = inputs.texCoord.x;
 *
 *     // Move the smoothstep band back and forth over time
 *     let center = 0.5 + 0.25 * sin(time);
 *     let t = smoothstep(center - 0.05, center + 0.05, x);
 *
 *     return [t, t, t, 1];
 *   });
 * }
 *
 * function setup() {
 *   createCanvas(300, 200, WEBGL);
 *   animatedShader = baseFilterShader().modify(animatedFadeCallback);
 * }
 *
 * function draw() {
 *   background(0);
 *   filter(animatedShader);
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
 *
 * function draw() {
 *   background(220);
 *   shader(myShader);
 *   noStroke();
 *   fill('teal');
 *   box(100);
 * }
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
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseStrokeShader().modify({
 *      'bool shouldDiscard': '(bool outside) { return outside; }'
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   strokeShader(myShader);
 *   strokeWeight(30);
 *   line(-width/3, 0, width/3, 0);
 * }
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
 *
 * function draw() {
 *   background(240);
 *   shader(myShader);
 *   noStroke();
 *   fill('purple');
 *   sphere(60);
 * }
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
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
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
 */

/**
 * Retrieves the current color of a given texture at given coordinates.
 *
 * The given coordinates should be between [0, 0] representing the top-left of
 * the texture, and [1, 1] representing the bottom-right of the texture.
 *
 * The given texture could be, for example:
 * * <a href="#/p5.Image">p5.Image</a>,
 * * a <a href="#/p5.Graphics">p5.Graphics</a>, or
 * * a <a href="#/p5.Framebuffer">p5.Framebuffer</a>.
 *
 * The retrieved color that is returned will behave like a vec4, with components
 * for red, green, blue, and alpha, each between 0.0 and 1.0.
 *
 * Linear interpolation is used by default. For Framebuffer sources, you can
 * prevent this by creating the buffer with:
 * ```js
 * createFramebuffer({
 *     textureFiltering: NEAREST
 *  })
 * ```
 * This can be useful if you are using your texture to store data other than color.
 * See <a href="#/p5/createFramebuffer/">createFramebuffer</a>.
 *
 * Note: The `getTexture` function is only available when using p5.strands.
 *
 * @method getTexture
 * @beta
 *
 * @param texture The texture to sample from.
 * (e.g. a p5.Image, p5.Graphics, or p5.Framebuffer).
 *
 * @param coords The 2D coordinates to sample from.
 * This should be between [0,0] (the top-left) and [1,1] (the bottom-right)
 * of the texture.  It should be compatible with a vec2.
 *
 * @returns {*} The color of the given texture at the given coordinates.  This
 * will behave as a vec4 holding components r, g, b, and a (alpha), with each component being in the range 0.0 to 1.0.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * // A filter shader (using p5.strands) which will
 * // sample and invert the color of each pixel
 * // from the canvas.
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   let myShader = buildFilterShader(buildIt);
 *
 *   background("white");
 *   fill("red");
 *   circle(0, 0, 50);
 *
 *   filter(myShader); //Try commenting this out!
 *
 *   describe("A cyan circle on black background");
 * }
 *
 * function buildIt() {
 *   filterColor.begin();
 *
 *   //Sample the color of the pixel from the
 *   //canvas at the same coordinate.
 *   let c = getTexture(filterColor.canvasContent,
 *                      filterColor.texCoord);
 *
 *   //Make a new color by inverting r, g, and b
 *   let newColor = [1 - c.r, 1 - c.g, 1 - c.b, c.a];
 *
 *   //Finally, use it for this pixel!
 *   filterColor.set(newColor);
 *
 *   filterColor.end();
 * }
 * </code>
 *
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * // This primitive edge-detection filter samples
 * // and compares the colors of the current pixel
 * // on the canvas, and a little to the right.
 * // It marks if they differ much.
 * let myShader;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   myShader = buildFilterShader(myShaderBuilder);
 *   describe("A rough partial outline of a square rotating around a circle");
 * }
 *
 * function draw() {
 *   drawADesign();
 *
 *   filter(myShader); // try commenting this out
 * }
 *
 * function myShaderBuilder() {
 *   filterColor.begin();
 *
 *   //The position of the current pixel...
 *   let coordHere = filterColor.texCoord;
 *   //and some small amount to the right.
 *   let coordRight = coordHere + [0.01, 0];
 *
 *   //The canvas content is a texture.
 *   let cnvTex = filterColor.canvasContent;
 *
 *   //Sample the colors from it at our two positions
 *   let colorHere = getTexture(cnvTex, coordHere);
 *   let colorRight = getTexture(cnvTex, coordRight);
 *
 *   // Calculate a (very rough) color difference.
 *   let difference = length(colorHere - colorRight);
 *
 *   //We'll use a black color by default...
 *   let resultColor = [0, 0, 0, 1];
 *   //or white if the samples were different.
 *   if (difference > 0.3) {
 *     resultColor = [1, 1, 1, 1];
 *   }
 *   filterColor.set(resultColor);
 *
 *   filterColor.end();
 * }
 *
 * //Draw a few shapes, just to test the filter with
 * function drawADesign() {
 *   background(50);
 *   noStroke();
 *   lights();
 *   sphere(20);
 *   rotate(frameCount / 300);
 *   square(0, 0, 30);
 * }
 * </code>
 * </div>
 */

/**
 * @method getWorldInputs
 * @param {Function} callback
 */

/**
 * @method getPixelInputs
 * @param {Function} callback
 */

/**
 * @method getFinalColor
 * @param {Function} callback
 */

/**
 * @method getColor
 * @param {Function} callback
 */

/**
 * @method getObjectInputs
 * @param {Function} callback
 */

/**
 * @method getCameraInputs
 * @param {Function} callback
 */

/**
 * Declares a float uniform variable for use in a p5.strands shader.
 *
 * Uniforms are values that are passed from JavaScript into shader code. They
 * stay the same for every pixel and vertex in a single draw call but can
 * change between frames. `uniformFloat()` creates a uniform that holds a
 * single number.
 *
 * `uniformFloat()` can only be called inside a shader
 * <a href="#/p5.Shader/modify">`modify()`</a> callback or a build function
 * such as <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>.
 *
 * The variable name used in the shader is automatically taken from the
 * JavaScript variable name the result is assigned to.
 *
 * An optional callback function can be passed as an argument. If provided,
 * the shader will call it every frame to get an updated value. If no
 * callback is provided, the uniform must be set manually using
 * <a href="#/p5.Shader/setUniform">`setUniform()`</a>.
 *
 * @method uniformFloat
 * @beta
 *
 * @param {Function} [callback]
 *        a function that returns a Number. If provided, the uniform will
 *        automatically update each frame with the return value.
 *
 * @returns {Number}
 *          a shader value representing a float that can be used in shader
 *          calculations.
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Use uniformFloat with a callback for automatic updates
 *
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   // The uniform updates automatically each frame
 *   const time = uniformFloat(() => millis() * 0.001);
 *   getWorldInputs((inputs) => {
 *     inputs.position.y += 20 * sin(time + inputs.position.x * 0.05);
 *     return inputs;
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
 *   describe('A red sphere that undulates as vertices move up and down over time.');
 * }
 * </code>
 * </div>
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Use uniformFloat without a callback, setting the value manually
 *
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   // No callback: must use setUniform() in draw()
 *   let t = uniformFloat();
 *   getWorldInputs((inputs) => {
 *     inputs.position.y += 20 * sin(t * 0.001 + inputs.position.x * 0.05);
 *     return inputs;
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   // Set the uniform manually each frame
 *   myShader.setUniform('t', millis());
 *   lights();
 *   noStroke();
 *   fill('red');
 *   sphere(50);
 *   describe('A red sphere that undulates as vertices move up and down over time.');
 * }
 * </code>
 * </div>
 */

/**
 * Declares an integer uniform variable for use in a p5.strands shader.
 *
 * `uniformInt()` works like
 * <a href="#/p5/uniformFloat">`uniformFloat()`</a> but creates a uniform
 * that holds a single integer value instead of a floating-point number.
 * This is useful for passing counts, indices, or mode flags into shader
 * code.
 *
 * `uniformInt()` can only be called inside a shader
 * <a href="#/p5.Shader/modify">`modify()`</a> callback or a build function
 * such as <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>.
 *
 * An optional callback function can be passed as an argument. If provided,
 * the shader will call it every frame to get an updated value. If no
 * callback is provided, the uniform must be set manually using
 * <a href="#/p5.Shader/setUniform">`setUniform()`</a>.
 *
 * @method uniformInt
 * @beta
 *
 * @param {Function} [callback]
 *        a function that returns a Number. If provided, the uniform will
 *        automatically update each frame with the return value.
 *
 * @returns {Number}
 *          a shader value representing an integer that can be used in shader
 *          calculations.
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Use an integer uniform to control wave frequency
 *
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   const waves = uniformInt(() => 5);
 *   getWorldInputs((inputs) => {
 *     inputs.position.y += 15 * sin(
 *       float(waves) * inputs.position.x * 0.05
 *     );
 *     return inputs;
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('orange');
 *   sphere(50);
 *   describe('An orange sphere with a wavy surface.');
 * }
 * </code>
 * </div>
 */

/**
 * Declares a boolean uniform variable for use in a p5.strands shader.
 *
 * `uniformBool()` works like
 * <a href="#/p5/uniformFloat">`uniformFloat()`</a> but creates a uniform
 * that holds a single boolean value (`true` or `false`). This is useful
 * for toggling shader effects on and off.
 *
 * `uniformBool()` can only be called inside a shader
 * <a href="#/p5.Shader/modify">`modify()`</a> callback or a build function
 * such as <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>.
 *
 * An optional callback function can be passed as an argument. If provided,
 * the shader will call it every frame to get an updated value. If no
 * callback is provided, the uniform must be set manually using
 * <a href="#/p5.Shader/setUniform">`setUniform()`</a>.
 *
 * @method uniformBool
 * @beta
 *
 * @param {Function} [callback]
 *        a function that returns a Boolean. If provided, the uniform will
 *        automatically update each frame with the return value.
 *
 * @returns {Boolean}
 *          a shader value representing a boolean that can be used in
 *          shader calculations.
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Toggle color inversion every second
 *
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   const invert = uniformBool(() => frameCount % 120 < 60);
 *   getFinalColor((color) => {
 *     if (invert) {
 *       color.r = 1.0 - color.r;
 *       color.g = 1.0 - color.g;
 *       color.b = 1.0 - color.b;
 *     }
 *     return color;
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('teal');
 *   sphere(50);
 *   describe('A sphere that alternates between teal and its inverted color every second.');
 * }
 * </code>
 * </div>
 */

/**
 * Declares a two-component vector uniform variable for use in a p5.strands
 * shader.
 *
 * `uniformVec2()` works like
 * <a href="#/p5/uniformFloat">`uniformFloat()`</a> but creates a uniform
 * that holds two numbers (a 2D vector). The callback should return an array
 * with two elements such as `[x, y]`. In shader code the result has `.x`
 * and `.y` components.
 *
 * `uniformVec2()` can only be called inside a shader
 * <a href="#/p5.Shader/modify">`modify()`</a> callback or a build function
 * such as <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>.
 *
 * An optional callback function can be passed as an argument. If provided,
 * the shader will call it every frame to get an updated value. If no
 * callback is provided, the uniform must be set manually using
 * <a href="#/p5.Shader/setUniform">`setUniform()`</a>.
 *
 * Note: `uniformVector2()` is an alias for `uniformVec2()`.
 *
 * @method uniformVec2
 * @beta
 *
 * @param {Function} [callback]
 *        a function that returns an array with two numbers. If provided,
 *        the uniform will automatically update each frame with the return
 *        value.
 *
 * @returns {Number[]}
 *          a shader value representing a 2D vector that can be used in
 *          shader calculations.
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Move a sphere in a circular path using a vec2 uniform
 *
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   const offset = uniformVec2(() => [
 *     50 * sin(millis() * 0.001),
 *     50 * cos(millis() * 0.001)
 *   ]);
 *   getWorldInputs((inputs) => {
 *     inputs.position.x += offset.x;
 *     inputs.position.y += offset.y;
 *     return inputs;
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('green');
 *   sphere(30);
 *   describe('A green sphere that moves in a circular path.');
 * }
 * </code>
 * </div>
 */

/**
 * Declares a three-component vector uniform variable for use in a p5.strands
 * shader.
 *
 * `uniformVec3()` works like
 * <a href="#/p5/uniformFloat">`uniformFloat()`</a> but creates a uniform
 * that holds three numbers (a 3D vector). The callback should return an
 * array with three elements such as `[x, y, z]`. In shader code the result
 * has `.x`, `.y`, and `.z` components. This is useful for passing 3D
 * positions, directions, or RGB colors.
 *
 * `uniformVec3()` can only be called inside a shader
 * <a href="#/p5.Shader/modify">`modify()`</a> callback or a build function
 * such as <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>.
 *
 * An optional callback function can be passed as an argument. If provided,
 * the shader will call it every frame to get an updated value. If no
 * callback is provided, the uniform must be set manually using
 * <a href="#/p5.Shader/setUniform">`setUniform()`</a>.
 *
 * Note: `uniformVector3()` is an alias for `uniformVec3()`.
 *
 * @method uniformVec3
 * @beta
 *
 * @param {Function} [callback]
 *        a function that returns an array with three numbers. If provided,
 *        the uniform will automatically update each frame with the return
 *        value.
 *
 * @returns {Number[]}
 *          a shader value representing a 3D vector that can be used in
 *          shader calculations.
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Tint a sphere using a vec3 uniform for RGB color
 *
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   const tint = uniformVec3(() => [
 *     sin(millis() * 0.001) * 0.5 + 0.5,
 *     cos(millis() * 0.002) * 0.5 + 0.5,
 *     sin(millis() * 0.003) * 0.5 + 0.5
 *   ]);
 *   getFinalColor((color) => {
 *     color.r *= tint.x;
 *     color.g *= tint.y;
 *     color.b *= tint.z;
 *     return color;
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('white');
 *   sphere(50);
 *   describe('A white sphere with a smoothly shifting color tint over time.');
 * }
 * </code>
 * </div>
 */

/**
 * Declares a four-component vector uniform variable for use in a p5.strands
 * shader.
 *
 * `uniformVec4()` works like
 * <a href="#/p5/uniformFloat">`uniformFloat()`</a> but creates a uniform
 * that holds four numbers (a 4D vector). The callback should return an
 * array with four elements such as `[x, y, z, w]`. In shader code the
 * result has `.x`, `.y`, `.z`, and `.w` components. This is commonly used
 * to pass RGBA colors.
 *
 * `uniformVec4()` can only be called inside a shader
 * <a href="#/p5.Shader/modify">`modify()`</a> callback or a build function
 * such as <a href="#/p5/buildMaterialShader">`buildMaterialShader()`</a>.
 *
 * An optional callback function can be passed as an argument. If provided,
 * the shader will call it every frame to get an updated value. If no
 * callback is provided, the uniform must be set manually using
 * <a href="#/p5.Shader/setUniform">`setUniform()`</a>.
 *
 * Note: `uniformVector4()` is an alias for `uniformVec4()`.
 *
 * @method uniformVec4
 * @beta
 *
 * @param {Function} [callback]
 *        a function that returns an array with four numbers. If provided,
 *        the uniform will automatically update each frame with the return
 *        value.
 *
 * @returns {Number[]}
 *          a shader value representing a 4D vector that can be used in
 *          shader calculations.
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Blend an RGBA overlay color onto the output using a vec4 uniform
 *
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = buildMaterialShader(material);
 * }
 *
 * function material() {
 *   const overlay = uniformVec4(() => [
 *     sin(millis() * 0.001) * 0.5 + 0.5,
 *     0.2,
 *     0.8,
 *     0.5
 *   ]);
 *   getFinalColor((color) => {
 *     // Blend with the overlay using its alpha
 *     let blended = mix(color, overlay, overlay.a);
 *     return blended;
 *   });
 * }
 *
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('white');
 *   sphere(50);
 *   describe('A white sphere with a pulsing blue-purple color overlay.');
 * }
 * </code>
 * </div>
 */

/**
 * Declares a texture uniform variable for use in a p5.strands shader.
 *
 * `uniformTexture()` works like
 * <a href="#/p5/uniformFloat">`uniformFloat()`</a> but creates a uniform
 * that holds a texture. The callback should return a texture source such as
 * a <a href="#/p5.Image">`p5.Image`</a>,
 * <a href="#/p5.Graphics">`p5.Graphics`</a>, or
 * <a href="#/p5.Framebuffer">`p5.Framebuffer`</a>. The result can be
 * sampled in shader code using
 * <a href="#/p5/getTexture">`getTexture()`</a>.
 *
 * `uniformTexture()` can only be called inside a shader
 * <a href="#/p5.Shader/modify">`modify()`</a> callback or a build function
 * such as <a href="#/p5/buildFilterShader">`buildFilterShader()`</a>.
 *
 * An optional callback function can be passed as an argument. If provided,
 * the shader will call it every frame to get an updated value. If no
 * callback is provided, the uniform must be set manually using
 * <a href="#/p5.Shader/setUniform">`setUniform()`</a>.
 *
 * Note: `uniformSampler2D()` is an alias for `uniformTexture()`.
 *
 * @method uniformTexture
 * @beta
 *
 * @param {Function} [callback]
 *        a function that returns a texture source (p5.Image, p5.Graphics,
 *        or p5.Framebuffer). If provided, the uniform will automatically
 *        update each frame with the return value.
 *
 * @returns {*}
 *          a shader value representing a texture that can be sampled with
 *          <a href="#/p5/getTexture">`getTexture()`</a>.
 *
 * @example
 * <div modernizr="webgl">
 * <code>
 * // Blend a p5.Graphics texture onto the canvas
 *
 * let myShader;
 * let pg;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   pg = createGraphics(200, 200);
 *   pg.background('orange');
 *   pg.fill('white');
 *   pg.circle(100, 100, 80);
 *   myShader = buildFilterShader(effect);
 * }
 *
 * function effect() {
 *   const overlay = uniformTexture(() => pg);
 *   filterColor.begin();
 *   let original = getTexture(
 *     filterColor.canvasContent, filterColor.texCoord
 *   );
 *   let tex = getTexture(overlay, filterColor.texCoord);
 *   filterColor.set(mix(original, tex, 0.5));
 *   filterColor.end();
 * }
 *
 * function draw() {
 *   background(200);
 *   fill('blue');
 *   circle(0, 0, 100);
 *   filter(myShader);
 *   describe('A blue circle blended with an orange and white pattern.');
 * }
 * </code>
 * </div>
 */
