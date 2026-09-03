/**
 * @module 3D
 * @submodule p5.strands
 * @for p5
 */

import * as build from './ir_builders'
import * as FES from './strands_FES'
import { BaseType } from './ir_types'
import { createStrandsNode } from './strands_node'

/*
 * Installs the matrix constructors (mat2/mat3/mat4 plus the transform2D/
 * transform3D aliases) and the non-mutating transform helpers (translate,
 * rotate, scale, skewX/Y, rotateAxisAngle, rotateX/Y/Z, transformPoint,
 * transformNormal) onto p5.prototype (fn) and p5.Graphics.prototype.
 *
 * augmentFn is passed in from strands_api.js so its single definition is
 * reused rather than duplicated, and so this module doesn't need to import
 * back from strands_api.js (avoiding a circular import).
 */
export function installTransformAPI(p5, fn, strandsContext, augmentFn) {
  const matrixConstructors = [
    // 2x2 has no affine/transform form, so it only has matrix names.
    ['mat2', 2], ['mat2x2', 2],
    // 3x3 = 2D affine transform.
    ['transform2D', 3], ['mat3', 3], ['mat3x3', 3],
    // 4x4 = 3D affine transform.
    ['transform3D', 4], ['mat4', 4], ['mat4x4', 4],
  ];

  /**
   * Creates a 2D transform inside a p5.strands shader callback.
   *
   * A transform is a 3x3 matrix that stores a combination of moves, turns,
   * scales, and slants. Calling `transform2D()` without arguments returns the
   * identity transform, which leaves points exactly where they are.
   *
   * A transform is built up by passing it to
   * <a href="#/p5/translate">translate()</a>,
   * <a href="#/p5/rotate">rotate()</a>,
   * <a href="#/p5/scale">scale()</a>,
   * <a href="#/p5/skewX">skewX()</a>, and
   * <a href="#/p5/skewY">skewY()</a>. Each of those returns a new transform
   * instead of changing the one passed in, so the result has to be assigned
   * back, as in `t = translate(t, 20, 0)`.
   *
   * The finished transform is applied to a position with
   * <a href="#/p5/transformPoint">transformPoint()</a>.
   *
   * `transform2D()` is the same function as <a href="#/p5/mat3">mat3()</a>.
   * Use `transform2D()` when describing a transformation, and `mat3()` when
   * thinking of the value as a plain 3x3 matrix.
   *
   * It can also be called with a single number, which fills the diagonal of the
   * matrix; a single matrix, which is resized (a 4x4 keeps its upper-left 3x3
   * block); 3 column vectors; or 9 values in column-major order.
   *
   * Note: `transform2D()` can only be used inside a p5.strands shader callback.
   *
   * @method transform2D
   * @beta
   * @param {...Number} [values] nothing for the identity transform, one number,
   *                             one matrix, 3 column vectors, or 9 values in
   *                             column-major order.
   * @returns {*} a 3x3 transform.
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildFilterShader(spin);
   * }
   *
   * function spin() {
   *   filterColor.begin();
   *   // Turn the texture coordinates around the middle of the canvas.
   *   let t = transform2D();
   *   t = translate(t, 0.5, 0.5);
   *   t = rotate(t, PI / 6);
   *   t = translate(t, -0.5, -0.5);
   *   let uv = transformPoint(t, filterColor.texCoord);
   *   filterColor.set(getTexture(filterColor.canvasContent, uv));
   *   filterColor.end();
   * }
   *
   * function draw() {
   *   background(180);
   *   noStroke();
   *   fill('yellow');
   *   rect(-50, -20, 100, 40);
   *   filter(myShader);
   * }
   */

  /**
   * Creates a 3D transform inside a p5.strands shader callback.
   *
   * A transform is a 4x4 matrix that stores a combination of moves, turns, and
   * scales in three dimensions. Calling `transform3D()` without arguments
   * returns the identity transform, which leaves points exactly where they are.
   *
   * A transform is built up by passing it to
   * <a href="#/p5/translate">translate()</a>,
   * <a href="#/p5/rotate">rotate()</a>,
   * <a href="#/p5/rotateX">rotateX()</a>,
   * <a href="#/p5/rotateY">rotateY()</a>,
   * <a href="#/p5/rotateZ">rotateZ()</a>,
   * <a href="#/p5/rotateAxisAngle">rotateAxisAngle()</a>, and
   * <a href="#/p5/scale">scale()</a>. Each of those returns a new transform
   * instead of changing the one passed in, so the result has to be assigned
   * back, as in `t = translate(t, 20, 0, 0)`.
   *
   * The finished transform is applied to a position with
   * <a href="#/p5/transformPoint">transformPoint()</a>, and to a surface
   * direction with <a href="#/p5/transformNormal">transformNormal()</a>. This
   * is the usual way to place each copy of a shape when drawing many instances
   * at once with <a href="#/p5/model">model()</a>.
   *
   * `transform3D()` is the same function as <a href="#/p5/mat4">mat4()</a>.
   * Use `transform3D()` when describing a transformation, and `mat4()` when
   * thinking of the value as a plain 4x4 matrix.
   *
   * It can also be called with a single number, which fills the diagonal of the
   * matrix; a single matrix, which is resized (a 3x3 is extended with the
   * identity matrix); 4 column vectors; or 16 values in column-major order.
   *
   * Note: `transform3D()` can only be used inside a p5.strands shader callback.
   *
   * @method transform3D
   * @beta
   * @param {...Number} [values] nothing for the identity transform, one number,
   *                             one matrix, 4 column vectors, or 16 values in
   *                             column-major order.
   * @returns {*} a 4x4 transform.
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(wobble);
   * }
   *
   * function wobble() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     t = rotate(t, millis() * 0.001);
   *     t = scale(t, 1.2);
   *     inputs.position = transformPoint(t, inputs.position);
   *     inputs.normal = transformNormal(t, inputs.normal);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('red');
   *   shader(myShader);
   *   box(60);
   * }
   */

  /**
   * Creates a 2x2 matrix inside a p5.strands shader callback.
   *
   * A 2x2 matrix can rotate, scale, and slant a two-component vector, but it
   * has no room to store a move, so there is no `transform` alias for it. Use
   * <a href="#/p5/transform2D">transform2D()</a> to also move points around.
   *
   * Called without arguments it returns the identity matrix. It can also be
   * called with a single number, which fills the diagonal; a single matrix,
   * which is resized; 2 column vectors; or 4 values in column-major order.
   *
   * Note: `mat2()` can only be used inside a p5.strands shader callback.
   *
   * @method mat2
   * @beta
   * @param {...Number} [values] nothing for the identity matrix, one number,
   *                             one matrix, 2 column vectors, or 4 values in
   *                             column-major order.
   * @returns {*} a 2x2 matrix.
   */

  /**
   * A GLSL-style name for <a href="#/p5/mat2">mat2()</a>.
   *
   * Note: `mat2x2()` can only be used inside a p5.strands shader callback.
   *
   * @method mat2x2
   * @beta
   * @param {...Number} [values] the same values accepted by
   *                             <a href="#/p5/mat2">mat2()</a>.
   * @returns {*} a 2x2 matrix.
   */

  /**
   * Creates a 3x3 matrix inside a p5.strands shader callback.
   *
   * `mat3()` is the same function as
   * <a href="#/p5/transform2D">transform2D()</a>, named the way it is in GLSL.
   *
   * Passing a 4x4 matrix to `mat3()` keeps only its upper-left 3x3 block, which
   * drops the move part of a 3D transform and leaves the rotation and scale.
   * That block is what lighting calculations need, so this is a handy way to
   * turn a <a href="#/p5/transform3D">transform3D()</a> into a matrix for
   * surface directions.
   *
   * Note: `mat3()` can only be used inside a p5.strands shader callback.
   *
   * @method mat3
   * @beta
   * @param {...Number} [values] nothing for the identity matrix, one number,
   *                             one matrix, 3 column vectors, or 9 values in
   *                             column-major order.
   * @returns {*} a 3x3 matrix.
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(shrink);
   * }
   *
   * function shrink() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     t = translate(t, 30, 0, 0);
   *     t = rotateY(t, PI / 4);
   *     // mat3() drops the move, so only the turn is left.
   *     let turnOnly = mat3(t);
   *     inputs.position = turnOnly * inputs.position;
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('blue');
   *   shader(myShader);
   *   box(60);
   * }
   */

  /**
   * A GLSL-style name for <a href="#/p5/mat3">mat3()</a>.
   *
   * Note: `mat3x3()` can only be used inside a p5.strands shader callback.
   *
   * @method mat3x3
   * @beta
   * @param {...Number} [values] the same values accepted by
   *                             <a href="#/p5/mat3">mat3()</a>.
   * @returns {*} a 3x3 matrix.
   */

  /**
   * Creates a 4x4 matrix inside a p5.strands shader callback.
   *
   * `mat4()` is the same function as
   * <a href="#/p5/transform3D">transform3D()</a>, named the way it is in GLSL.
   *
   * Passing a 3x3 matrix to `mat4()` extends it with the identity matrix, which
   * turns a 2D transform into a 3D one that leaves the z-axis alone.
   *
   * Note: `mat4()` can only be used inside a p5.strands shader callback.
   *
   * @method mat4
   * @beta
   * @param {...Number} [values] nothing for the identity matrix, one number,
   *                             one matrix, 4 column vectors, or 16 values in
   *                             column-major order.
   * @returns {*} a 4x4 matrix.
   */

  /**
   * A GLSL-style name for <a href="#/p5/mat4">mat4()</a>.
   *
   * Note: `mat4x4()` can only be used inside a p5.strands shader callback.
   *
   * @method mat4x4
   * @beta
   * @param {...Number} [values] the same values accepted by
   *                             <a href="#/p5/mat4">mat4()</a>.
   * @returns {*} a 4x4 matrix.
   */
  for (const [name, dimension] of matrixConstructors) {
    augmentFn(fn, p5, name, function (...args) {
      if (!strandsContext.active) {
        p5._friendlyError(
          `It looks like you've called ${name} outside of a shader's modify() function.`
        );
        return;
      }
      const { id, dimension: dim } = build.matrixNode(strandsContext, dimension, args);
      return createStrandsNode(id, dim, strandsContext);
    });
  }


  const isStrandsTransform = (t) =>
    strandsContext.active && !!t?.isStrandsNode && t.typeInfo().baseType === BaseType.MAT;

  // Every caller checks strandsContext.active first, so isStrandsTransform's
  // extra active check can't misfire here.
  const transformStep = (t, values2D, values3D) => {
    if (!isStrandsTransform(t)) {
      FES.userError('type error',
        'The first argument to a transform function (translate, rotate, scale, ' +
        'skewX, skewY) must be a transform created with transform2D() or transform3D().');
    }
    const values = t.dimension === 4 ? values3D : values2D;
    const m = build.matrixConstructorNode(strandsContext, t.dimension, values);
    return t.mult(createStrandsNode(m.id, m.dimension, strandsContext));
  };

  /**
   * @method translate
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform2D">transform2D()</a> or
   *                      <a href="#/p5/transform3D">transform3D()</a>. Inside a
   *                      p5.strands shader callback, a new transform with the
   *                      move added on is returned and the one passed in is
   *                      left untouched.
   * @param {Number} x amount to move along the x-axis.
   * @param {Number} [y] amount to move along the y-axis.
   * @param {Number} [z] amount to move along the z-axis. Ignored by a 2D
   *                     transform.
   * @returns {*} a new transform with the move applied.
   *
   * @example
   * // Move a shape inside a p5.strands shader.
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(slide);
   * }
   *
   * function slide() {
   *   getWorldInputs((inputs) => {
   *     // translate() returns a new transform, so assign the result back.
   *     let t = transform3D();
   *     t = translate(t, 40 * sin(millis() * 0.001), 0, 0);
   *     inputs.position = transformPoint(t, inputs.position);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('red');
   *   shader(myShader);
   *   sphere(30);
   * }
   */
  const originalTranslate = fn.translate;
  augmentFn(fn, p5, 'translate', function (...args) {
    const t = args[0];
    if (!isStrandsTransform(t)) return originalTranslate.apply(this, args);
    const [x = 0, y = 0, z = 0] = args.slice(1); 
    return transformStep(t,
      [1, 0, 0,   0, 1, 0,   x, y, 1],
      [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   x, y, z, 1]);
  });

  /**
   * @method scale
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform2D">transform2D()</a> or
   *                      <a href="#/p5/transform3D">transform3D()</a>. Inside a
   *                      p5.strands shader callback, a new transform with the
   *                      resize added on is returned and the one passed in is
   *                      left untouched.
   * @param {Number} x amount to resize by along the x-axis, or along every axis
   *                   if it's the only amount given.
   * @param {Number} [y] amount to resize by along the y-axis.
   * @param {Number} [z] amount to resize by along the z-axis. Ignored by a 2D
   *                     transform.
   * @returns {*} a new transform with the resize applied.
   *
   * @example
   * // Resize a shape inside a p5.strands shader.
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(squash);
   * }
   *
   * function squash() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     // Stretch along x and squash along y.
   *     t = scale(t, 1.5, 0.5, 1);
   *     inputs.position = transformPoint(t, inputs.position);
   *     inputs.normal = transformNormal(t, inputs.normal);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('green');
   *   shader(myShader);
   *   sphere(40);
   * }
   */
  const originalScale = fn.scale;
  augmentFn(fn, p5, 'scale', function (...args) {
    const t = args[0];
    if (!isStrandsTransform(t)) return originalScale.apply(this, args);
    const scales = args.slice(1);
    const uniform = scales.length === 1; // scale(t, s) scales every axis by s
    const x = scales[0] ?? 1;
    const y = scales[1] ?? (uniform ? x : 1);
    const z = scales[2] ?? (uniform ? x : 1);
    return transformStep(t,
      [x, 0, 0,   0, y, 0,   0, 0, 1],
      [x, 0, 0, 0,   0, y, 0, 0,   0, 0, z, 0,   0, 0, 0, 1]);
  });

  /**
   * @method rotate
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform2D">transform2D()</a> or
   *                      <a href="#/p5/transform3D">transform3D()</a>. Inside a
   *                      p5.strands shader callback, a new transform with the
   *                      turn added on is returned and the one passed in is
   *                      left untouched. A 2D transform turns within the plane;
   *                      a 3D transform turns about the z-axis.
   * @param {Number} angle angle to turn by, in radians.
   *                       <a href="#/p5/angleMode">angleMode()</a> doesn't
   *                       reach inside a shader.
   * @returns {*} a new transform with the turn applied.
   *
   * @example
   * // Turn a shape inside a p5.strands shader.
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(spin);
   * }
   *
   * function spin() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     t = rotate(t, millis() * 0.001);
   *     inputs.position = transformPoint(t, inputs.position);
   *     inputs.normal = transformNormal(t, inputs.normal);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('orange');
   *   shader(myShader);
   *   box(60, 20, 20);
   * }
   */
  const originalRotate = fn.rotate;
  augmentFn(fn, p5, 'rotate', function (...args) {
    const t = args[0];
    if (!isStrandsTransform(t)) return originalRotate.apply(this, args);
    const angle = args[1]; // 2D: rotate in-plane; 3D: rotate about the Z axis
    const c = this.cos(angle);
    const s = this.sin(angle);
    const ns = s.mult(-1); // -sin
    return transformStep(t,
      [c, s, 0,   ns, c, 0,   0, 0, 1],
      [c, s, 0, 0,   ns, c, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]);
  });

  /**
   * Slants a p5.strands transform along the x-axis.
   *
   * Every point is shifted sideways by an amount that grows with its y
   * position, so upright shapes end up leaning. A new transform is returned and
   * the one passed in is left untouched, so the result has to be assigned back,
   * as in `t = skewX(t, PI / 8)`.
   *
   * This is the p5.strands counterpart of
   * <a href="#/p5/shearX">shearX()</a>, which slants the canvas' coordinate
   * system instead. Angles are always measured in radians here, since
   * <a href="#/p5/angleMode">angleMode()</a> doesn't reach inside a shader.
   *
   * Note: `skewX()` can only be used inside a p5.strands shader callback.
   *
   * @method skewX
   * @beta
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform2D">transform2D()</a> or
   *                      <a href="#/p5/transform3D">transform3D()</a>.
   * @param {Number} angle angle to slant by, in radians.
   * @returns {*} a new transform with the slant applied.
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildFilterShader(lean);
   * }
   *
   * function lean() {
   *   filterColor.begin();
   *   let t = transform2D();
   *   t = translate(t, 0.5, 0.5);
   *   t = skewX(t, PI / 8);
   *   t = translate(t, -0.5, -0.5);
   *   let uv = transformPoint(t, filterColor.texCoord);
   *   filterColor.set(getTexture(filterColor.canvasContent, uv));
   *   filterColor.end();
   * }
   *
   * function draw() {
   *   background(180);
   *   noStroke();
   *   fill('yellow');
   *   rect(-30, -30, 60, 60);
   *   filter(myShader);
   * }
   */
  augmentFn(fn, p5, 'skewX', function (...args) {
    if (!strandsContext.active) {
      p5._friendlyError(`It looks like you've called skewX outside of a shader's modify() function.`);
      return;
    }
    const [t, angle] = args;
    const k = this.tan(angle); // x' = x + tan(angle) * y
    return transformStep(t,
      [1, 0, 0,   k, 1, 0,   0, 0, 1],
      [1, 0, 0, 0,   k, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]);
  });

  /**
   * Slants a p5.strands transform along the y-axis.
   *
   * Every point is shifted up or down by an amount that grows with its x
   * position. A new transform is returned and the one passed in is left
   * untouched, so the result has to be assigned back, as in
   * `t = skewY(t, PI / 8)`.
   *
   * This is the p5.strands counterpart of
   * <a href="#/p5/shearY">shearY()</a>, which slants the canvas' coordinate
   * system instead. Angles are always measured in radians here, since
   * <a href="#/p5/angleMode">angleMode()</a> doesn't reach inside a shader.
   *
   * Note: `skewY()` can only be used inside a p5.strands shader callback.
   *
   * @method skewY
   * @beta
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform2D">transform2D()</a> or
   *                      <a href="#/p5/transform3D">transform3D()</a>.
   * @param {Number} angle angle to slant by, in radians.
   * @returns {*} a new transform with the slant applied.
   */
  augmentFn(fn, p5, 'skewY', function (...args) {
    if (!strandsContext.active) {
      p5._friendlyError(`It looks like you've called skewY outside of a shader's modify() function.`);
      return;
    }
    const [t, angle] = args;
    const k = this.tan(angle); // y' = y + tan(angle) * x
    return transformStep(t,
      [1, k, 0,   0, 1, 0,   0, 0, 1],
      [1, k, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]);
  });

  /**
   * Turns a 3D p5.strands transform about any axis.
   *
   * <a href="#/p5/rotateX">rotateX()</a>,
   * <a href="#/p5/rotateY">rotateY()</a>, and
   * <a href="#/p5/rotateZ">rotateZ()</a> only turn about the three main axes.
   * `rotateAxisAngle()` turns about a line pointing in any direction, given as
   * a three-component vector. The axis doesn't need to be a unit vector; it is
   * normalized before use.
   *
   * A new transform is returned and the one passed in is left untouched, so the
   * result has to be assigned back, as in
   * `t = rotateAxisAngle(t, [1, 1, 0], PI / 4)`.
   *
   * Angles are always measured in radians here, since
   * <a href="#/p5/angleMode">angleMode()</a> doesn't reach inside a shader.
   *
   * Note: `rotateAxisAngle()` only works on a transform created with
   * <a href="#/p5/transform3D">transform3D()</a>, and can only be used inside a
   * p5.strands shader callback.
   *
   * @method rotateAxisAngle
   * @beta
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform3D">transform3D()</a>.
   * @param {*} axis a three-component vector pointing along the line to turn
   *                 about.
   * @param {Number} angle angle to turn by, in radians.
   * @returns {*} a new transform with the turn applied.
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(tumble);
   * }
   *
   * function tumble() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     // Turn about a diagonal axis instead of x, y, or z.
   *     t = rotateAxisAngle(t, [1, 1, 0], millis() * 0.001);
   *     inputs.position = transformPoint(t, inputs.position);
   *     inputs.normal = transformNormal(t, inputs.normal);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('purple');
   *   shader(myShader);
   *   box(60);
   * }
   */
  augmentFn(fn, p5, 'rotateAxisAngle', function (...args) {
    if (!strandsContext.active) {
      p5._friendlyError(`It looks like you've called rotateAxisAngle outside of a shader's modify() function.`);
      return;
    }
    const [t, axis, angle] = args;
    if (!t?.isStrandsNode || t.typeInfo().baseType !== BaseType.MAT || t.dimension !== 4) {
      FES.userError('type error',
        'rotateAxisAngle() only works on a 3D transform created with transform3D().');
    }
    const n = this.normalize(axis);
    const x = n.x, y = n.y, z = n.z;
    const c = this.cos(angle);
    const s = this.sin(angle);
    const omc = p5.strandsNode(1).sub(c); // 1 - cos

    // Column-major Rodrigues' rotation matrix.
    const b00 = x.mult(x).mult(omc).add(c); // x^2 * (1 - cos) + cos
    const b01 = y.mult(x).mult(omc).add(z.mult(s)); // y * x * (1 - cos) + z * sin
    const b02 = z.mult(x).mult(omc).sub(y.mult(s)); // z * x * (1 - cos) - y * sin
    const b10 = x.mult(y).mult(omc).sub(z.mult(s)); // x * y * (1 - cos) - z * sin
    const b11 = y.mult(y).mult(omc).add(c); // y^2 * (1 - cos) + cos
    const b12 = z.mult(y).mult(omc).add(x.mult(s)); // z * y * (1 - cos) + x * sin
    const b20 = x.mult(z).mult(omc).add(y.mult(s)); // x * z * (1 - cos) + y * sin
    const b21 = y.mult(z).mult(omc).sub(x.mult(s)); // y * z * (1 - cos) - x * sin
    const b22 = z.mult(z).mult(omc).add(c); // z^2 * (1 - cos) + cos

    const m = build.matrixConstructorNode(strandsContext, 4, [
      b00, b01, b02, 0,
      b10, b11, b12, 0,
      b20, b21, b22, 0,
      0,   0,   0,   1,
    ]);
    return t.mult(createStrandsNode(m.id, m.dimension, strandsContext));
  });

  const original3DRotations = {
    rotateX: fn.rotateX,
    rotateY: fn.rotateY,
    rotateZ: fn.rotateZ,
  };
  const registerAxisRotation = (name, valuesFor) => {
    const original = original3DRotations[name];
    augmentFn(fn, p5, name, function (...args) {
      const t = args[0];
      if (!isStrandsTransform(t)) {
        return original ? original.apply(this, args) : undefined;
      }
      if (t.dimension !== 4) {
        FES.userError('type error', `${name}() needs a 3D transform created with transform3D().`);
      }
      const angle = args[1];
      const c = this.cos(angle);
      const s = this.sin(angle);
      const ns = s.mult(-1);
      const m = build.matrixConstructorNode(strandsContext, 4, valuesFor(c, s, ns));
      return t.mult(createStrandsNode(m.id, m.dimension, strandsContext));
    });
  };

  /**
   * @method rotateX
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform3D">transform3D()</a>. Inside a
   *                      p5.strands shader callback, a new transform with the
   *                      turn added on is returned and the one passed in is
   *                      left untouched.
   * @param {Number} angle angle to turn by, in radians.
   *                       <a href="#/p5/angleMode">angleMode()</a> doesn't
   *                       reach inside a shader.
   * @returns {*} a new transform with the turn applied.
   *
   * @example
   * // Turn a shape about the x-axis inside a p5.strands shader.
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(roll);
   * }
   *
   * function roll() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     t = rotateX(t, millis() * 0.001);
   *     inputs.position = transformPoint(t, inputs.position);
   *     inputs.normal = transformNormal(t, inputs.normal);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('red');
   *   shader(myShader);
   *   box(60, 20, 20);
   * }
   */
  registerAxisRotation('rotateX', (c, s, ns) =>
    [1, 0, 0, 0,   0, c, s, 0,   0, ns, c, 0,   0, 0, 0, 1]);

  /**
   * @method rotateY
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform3D">transform3D()</a>. Inside a
   *                      p5.strands shader callback, a new transform with the
   *                      turn added on is returned and the one passed in is
   *                      left untouched.
   * @param {Number} angle angle to turn by, in radians.
   *                       <a href="#/p5/angleMode">angleMode()</a> doesn't
   *                       reach inside a shader.
   * @returns {*} a new transform with the turn applied.
   */
  registerAxisRotation('rotateY', (c, s, ns) =>
    [c, 0, ns, 0,   0, 1, 0, 0,   s, 0, c, 0,   0, 0, 0, 1]);

  /**
   * @method rotateZ
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform3D">transform3D()</a>. Inside a
   *                      p5.strands shader callback, a new transform with the
   *                      turn added on is returned and the one passed in is
   *                      left untouched. This does the same thing as calling
   *                      <a href="#/p5/rotate">rotate()</a> on a 3D transform.
   * @param {Number} angle angle to turn by, in radians.
   *                       <a href="#/p5/angleMode">angleMode()</a> doesn't
   *                       reach inside a shader.
   * @returns {*} a new transform with the turn applied.
   */
  registerAxisRotation('rotateZ', (c, s, ns) =>
    [c, s, 0, 0,   ns, c, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1]);

  /**
   * Applies a p5.strands transform to a position.
   *
   * A transform is a matrix, and moving a point with it means multiplying the
   * two together. Doing that by hand needs an extra `1` tacked onto the end of
   * the position first, and the extra component stripped off the answer.
   * `transformPoint()` takes care of both steps.
   *
   * With a 2D transform from <a href="#/p5/transform2D">transform2D()</a>, pass
   * a two-component position and a two-component position comes back. With a 3D
   * transform from <a href="#/p5/transform3D">transform3D()</a>, pass a
   * three-component position and a three-component position comes back.
   *
   * Use <a href="#/p5/transformNormal">transformNormal()</a> for surface
   * directions instead, since those must ignore the move part of a transform.
   *
   * Note: `transformPoint()` can only be used inside a p5.strands shader
   * callback.
   *
   * @method transformPoint
   * @beta
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform2D">transform2D()</a> or
   *                      <a href="#/p5/transform3D">transform3D()</a>.
   * @param {*} point the position to move.
   * @returns {*} the moved position, with as many components as the one passed
   *              in.
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(place);
   * }
   *
   * function place() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     t = translate(t, 0, -30, 0);
   *     t = rotateY(t, millis() * 0.001);
   *     inputs.position = transformPoint(t, inputs.position);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('cyan');
   *   shader(myShader);
   *   box(50);
   * }
   */
  augmentFn(fn, p5, 'transformPoint', function (...args) {
    if (!strandsContext.active) {
      p5._friendlyError(`It looks like you've called transformPoint outside of a shader's modify() function.`);
      return;
    }
    const [t, point] = args;
    if (!(t?.isStrandsNode && t.typeInfo().baseType === BaseType.MAT)) {
      FES.userError('type error',
        'transformPoint(t, point): the first argument must be a transform from transform2D()/transform3D().');
    }
    const p = p5.strandsNode(point);
    if (t.dimension === 4) {
      return t.mult(fn.vec4(p, 1)).xyz;
    }
    return t.mult(fn.vec3(p, 1)).xy;
  });

  /**
   * Applies a p5.strands transform to a surface direction.
   *
   * A normal describes which way a surface faces, and lighting uses it to work
   * out how bright each spot should be. Normals can't be moved the way
   * positions are: a move must be ignored, and an uneven resize like
   * `scale(t, 2, 1, 1)` would tilt them the wrong way if the transform were
   * applied directly. `transformNormal()` handles both cases and returns a
   * normalized result, so lighting stays correct.
   *
   * Pass the same transform used with
   * <a href="#/p5/transformPoint">transformPoint()</a> for the position, so the
   * shape and its lighting stay in step.
   *
   * Note: `transformNormal()` can only be used inside a p5.strands shader
   * callback.
   *
   * @method transformNormal
   * @beta
   * @param {*} transform a transform created with
   *                      <a href="#/p5/transform2D">transform2D()</a> or
   *                      <a href="#/p5/transform3D">transform3D()</a>.
   * @param {*} normal the surface direction to transform.
   * @returns {*} the transformed surface direction, normalized.
   *
   * @example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(200, 200, WEBGL);
   *   myShader = buildMaterialShader(stretch);
   * }
   *
   * function stretch() {
   *   getWorldInputs((inputs) => {
   *     let t = transform3D();
   *     // An uneven resize, so the normals need fixing up too.
   *     t = scale(t, 2, 0.5, 1);
   *     inputs.position = transformPoint(t, inputs.position);
   *     inputs.normal = transformNormal(t, inputs.normal);
   *     return inputs;
   *   });
   * }
   *
   * function draw() {
   *   background(180);
   *   lights();
   *   noStroke();
   *   fill('white');
   *   shader(myShader);
   *   sphere(40);
   * }
   */
  augmentFn(fn, p5, 'transformNormal', function (...args) {
    if (!strandsContext.active) {
      p5._friendlyError(`It looks like you've called transformNormal outside of a shader's modify() function.`);
      return;
    }
    const [t, normal] = args;
    if (!(t?.isStrandsNode && t.typeInfo().baseType === BaseType.MAT)) {
      FES.userError('type error',
        'transformNormal(t, normal): the first argument must be a transform from transform2D()/transform3D().');
    }
    const n = p5.strandsNode(normal);
    // Normals ignore translation, so we use the transform's upper-left block.
    // Its inverse-transpose is the correct normal matrix, staying accurate even
    // under non-uniform scale.
    const linear = fn[`mat${t.dimension - 1}`](t);
    return fn.normalize(fn.transpose(fn.inverse(linear)).mult(n));
  });
}
