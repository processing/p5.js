/**
 * @typedef {Object} Vertex
 * @property {{x: number, y: number, z: number}} position - The position of the vertex in world space.
 * @property {{x: number, y: number, z: number}} normal - The normal vector at the vertex in world space.
 * @property {{x: number, y: number}} texCoord - The texture coordinates (x, y) for the vertex.
 * @property {{r: number, g: number, b: number, a: number}} color - The color at the vertex.
 */

/**
 * @function getWorldInputs
 * @experimental
 * @description
 * Registers a callback to modify the world-space properties of each vertex in a shader. This hook can be used inside {@link p5.baseMaterialShader}.modify() and similar shader modify calls to customize vertex positions, normals, texture coordinates, and colors before rendering. "World space" refers to the coordinate system of the 3D scene, before any camera or projection transformations are applied.
 *
 * This hook is available in:
 * - {@link p5.baseMaterialShader}
 * - {@link p5.baseNormalShader}
 * - {@link p5.baseColorShader}
 * - {@link p5.baseStrokeShader}
 *
 * @param {function(Vertex): Vertex} callback
 *        A callback function which receives and returns a Vertex struct.
 *
 * @see {@link p5.baseMaterialShader}
 * @see {@link p5.Shader#modify}
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     getWorldInputs(inputs => {
 *       // Move the vertex up and down in a wave
 *       inputs.position.y += 20 * sin(
 *         millis() * 0.001 + inputs.position.x * 0.05
 *       );
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
 * @function combineColors
 * @experimental
 * @description
 * Registers a callback to customize how color components are combined in the fragment shader. This hook can be used inside {@link p5.baseMaterialShader}.modify() and similar shader modify calls to control the final color output of a material. The callback receives a ColorComponents struct and should return an object with a `color` property ({ r, g, b }) and an `opacity` property (number).
 *
 * This hook is available in:
 * - {@link p5.baseMaterialShader}
 * - {@link p5.baseNormalShader}
 * - {@link p5.baseColorShader}
 * - {@link p5.baseStrokeShader}
 *
 * @param {function(ColorComponents): { color: {r: number, g: number, b: number}, opacity: number }} callback
 *        A callback function which receives a ColorComponents struct and returns the final color and opacity.
 *
 * @see {@link p5.baseMaterialShader}
 * @see {@link p5.Shader#modify}
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     combineColors(components => {
 *       // Custom color combination: add a red tint
 *       let color = {
 *         r: components.baseColor.r * components.diffuse.r +
 *            components.ambientColor.r * components.ambient.r +
 *            components.specularColor.r * components.specular.r +
 *            components.emissive.r + 0.2,
 *         g: components.baseColor.g * components.diffuse.g +
 *            components.ambientColor.g * components.ambient.g +
 *            components.specularColor.g * components.specular.g +
 *            components.emissive.g,
 *         b: components.baseColor.b * components.diffuse.b +
 *            components.ambientColor.b * components.ambient.b +
 *            components.specularColor.b * components.specular.b +
 *            components.emissive.b
 *       };
 *       return { color, opacity: components.opacity };
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
 * @function getPointSize
 * @experimental
 * @description
 * Registers a callback to modify the size of points when rendering with a shader. This hook can be used inside {@link p5.baseMaterialShader}.modify() or similar, when drawing points (e.g., with the point() function in WEBGL mode). The callback receives the current point size (number) and should return the new size (number).
 *
 * This hook is available in:
 * - {@link p5.baseMaterialShader}
 * - {@link p5.baseNormalShader}
 * - {@link p5.baseColorShader}
 * - {@link p5.baseStrokeShader}
 *
 * @param {function(size: number): number} callback
 *        A callback function which receives and returns the point size.
 *
 * @see {@link p5.baseMaterialShader}
 * @see {@link p5.Shader#modify}
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     getPointSize(size => {
 *       // Make points pulse in size over time
 *       return size * (1.0 + 0.5 * sin(millis() * 0.002));
 *     });
 *   });
 * }
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   strokeWeight(20);
 *   stroke('blue');
 *   point(0, 0);
 * }
 * </code>
 * </div>
 */