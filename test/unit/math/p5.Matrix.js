import { describe, it, expect, beforeAll, afterAll, test } from "vitest";
import p5 from "../../../src/app.js";

const toArray = (typedArray) => Array.from(typedArray);
/* eslint-disable indent */
var mat4 = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

var other = Float32Array.from([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);

var mat3 = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
/* eslint-enable indent */

suite("p5.Matrix", function () {
  var myp5;

  beforeAll(function () {
    new p5(function (p) {
      p.setup = function () {
        myp5 = p;
      };
    });
  });

  afterAll(function () {
    myp5.remove();
  });

  suite("construction", function () {
    test("new p5.Matrix(4)", function () {
      var m = new p5.Matrix(4);
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat3);
      /* eslint-disable indent */
      assert.deepEqual(
        [].slice.call(m.mat4),
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
      );
      /* eslint-enable indent */
    });

    test("new p5.Matrix(array)", function () {
      var m = new p5.Matrix(mat4);
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat3);
      expect(m.mat4).toEqual(mat4);
    });

    test("new p5.Matrix(mat3)", function () {
      var m = new p5.Matrix(mat3);
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat4);
      assert.deepEqual(m.mat3, mat3);
    });

    test("identity()", function () {
      var m = new p5.Matrix(4);
      assert.instanceOf(m, p5.Matrix);
      assert.isUndefined(m.mat3);
      /* eslint-disable indent */
      expect(toArray(m.mat4)).toEqual([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
      /* eslint-enable indent */
    });
  });

  describe("reset", function () {
    it("should reset a 4x4 matrix to the identity matrix", function () {
      const m = new p5.Matrix([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]);
      m.reset();
      expect(toArray(m.mat4)).toEqual([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
    });

    it("should reset a 3x3 matrix to the identity matrix", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      m.reset();
      expect(toArray(m.mat3)).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    });
  });

  suite("set", function () {
    test("p5.Matrix", function () {
      var m = new p5.Matrix(4);
      m.set(new p5.Matrix(mat4));
      expect(m.mat4).toEqual(mat4);
      // assert.deepEqual([].slice.call(m.mat4), mat4);
    });

    test("array", function () {
      var m = new p5.Matrix(4);
      m.set(mat4);
      assert.deepEqual(m.mat4, mat4);
    });

    test("arguments", function () {
      var m = new p5.Matrix(4);
      m.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6);
      expect(Array.from(m.mat4)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6]);
    });
  });

  it("should clone a 4x4 matrix correctly", () => {
    const original = new p5.Matrix([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
    const clone = original.clone();

    expect(clone).not.toBe(original);
    expect(toArray(clone.mat4)).toEqual(toArray(original.mat4));
  });

  it("should clone a 3x3 matrix correctly", () => {
    const original = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const clone = original.clone();

    expect(clone).not.toBe(original);
    expect(clone.mat3).toEqual(original.mat3);
  });

  it("should clone an identity matrix correctly", () => {
    const original = new p5.Matrix(4);
    const clone = original.clone();

    expect(clone).not.toBe(original);
    expect(toArray(clone.mat4)).toEqual(toArray(original.mat4));
  });

  suite("get / copy", function () {
    test("get", function () {
      var m = new p5.Matrix(mat4);
      var m2 = m.get();
      assert.notEqual(m, m2);
      expect(m.mat4).toEqual(m2.mat4);
    });
    test("copy", function () {
      var m = new p5.Matrix(mat4);
      var m2 = m.copy();
      assert.notEqual(m, m2);
      assert.notEqual(m.mat4, m2.mat4);
      assert.deepEqual([].slice.call(m.mat4), [].slice.call(m2.mat4));
    });
  });

  suite.todo("add", () => {});

  suite("mult", function () {
    /* eslint-disable indent */
    var mm = [
      30, 70, 110, 150, 70, 174, 278, 382, 110, 278, 446, 614, 150, 382, 614,
      846,
    ];
    /* eslint-enable indent */

    test("self", function () {
      var m = new p5.Matrix(mat4.slice());
      m.mult(m);
      /* eslint-disable indent */
      assert.deepEqual(
        [].slice.call(m.mat4),
        [
          90, 100, 110, 120, 202, 228, 254, 280, 314, 356, 398, 440, 426, 484,
          542, 600,
        ]
      );
      /* eslint-enable indent */
    });

    test("p5.Matrix", function () {
      var m1 = new p5.Matrix(mat4.slice());
      var m2 = new p5.Matrix(other);
      m1.mult(m2);
      assert.deepEqual([].slice.call(m1.mat4), mm);
    });

    test("array", function () {
      var m = new p5.Matrix(mat4.slice());
      m.mult(other);
      assert.deepEqual([].slice.call(m.mat4), mm);
    });

    test.todo("arguments", function () {
      var m = new p5.Matrix(mat4.slice());
      m.mult.apply(m, other);
      assert.deepEqual([].slice.call(m.mat4), mm);
    });
  });

  suite("apply", function () {
    /* eslint-disable indent */
    var am = [
      276, 304, 332, 360, 304, 336, 368, 400, 332, 368, 404, 440, 360, 400, 440,
      480,
    ];
    /* eslint-enable indent */

    test("self", function () {
      var m = new p5.Matrix(mat4.slice());
      m.apply(m);
      /* eslint-disable indent */
      assert.deepEqual(
        [].slice.call(m.mat4),
        [
          90, 100, 110, 120, 202, 228, 254, 280, 314, 356, 398, 440, 426, 484,
          542, 600,
        ]
      );
      /* eslint-enable indent */
    });

    test("p5.Matrix", function () {
      var m1 = new p5.Matrix(mat4.slice());
      var m2 = new p5.Matrix(other);
      m1.apply(m2);
      assert.deepEqual([].slice.call(m1.mat4), am);
    });

    test("array", function () {
      var m = new p5.Matrix(mat4.slice());
      m.apply(other);
      assert.deepEqual([].slice.call(m.mat4), am);
    });

    test("arguments", function () {
      var m = new p5.Matrix(mat4.slice());
      m.apply.apply(m, other);
      assert.deepEqual([].slice.call(m.mat4), am);
    });
  });

  suite("scale", function () {
    /* eslint-disable indent */
    var sm = [2, 4, 6, 8, 15, 18, 21, 24, 45, 50, 55, 60, 13, 14, 15, 16];
    /* eslint-enable indent */

    var mat4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    test("p5.Vector", function () {
      var m = new p5.Matrix(mat4.slice());
      var v = myp5.createVector(2, 3, 5);
      m.scale(v);
      assert.notEqual(m.mat4, mat4);
      assert.deepEqual([].slice.call(m.mat4), sm);
    });

    test("array", function () {
      var m = new p5.Matrix(mat4.slice());
      m.scale([2, 3, 5]);
      assert.notEqual(m.mat4, mat4);
      assert.deepEqual([].slice.call(m.mat4), sm);
    });

    test("arguments", function () {
      var m = new p5.Matrix(mat4.slice());
      m.scale(2, 3, 5);
      assert.notEqual(m.mat4, mat4);
      assert.deepEqual([].slice.call(m.mat4), sm);
    });
  });

  suite("rotate", function () {
    /* eslint-disable max-len */
    var rm = Float32Array.from([
      1.433447866601989, 2.5241247073503885, 3.6148015480987885,
      4.7054783888471885, 6.460371405020393, 7.054586073938033,
      7.648800742855675, 8.243015411773316, 7.950398010346969,
      9.157598472697025, 10.36479893504708, 11.571999397397136, 13, 14, 15, 16,
    ]);
    /* eslint-enable max-len */

    test("p5.Vector", function () {
      var m = new p5.Matrix(mat4.slice());
      var v = myp5.createVector(2, 3, 5);
      m.rotate4x4(45 * myp5.DEG_TO_RAD, v);
      assert.deepEqual(m.mat4, rm);
    });

    test("array", function () {
      var m = new p5.Matrix(mat4.slice());
      m.rotate4x4(45 * myp5.DEG_TO_RAD, [2, 3, 5]);
      assert.deepEqual(m.mat4, rm);
    });

    test("arguments", function () {
      var m = new p5.Matrix(mat4.slice());
      m.rotate4x4(45 * myp5.DEG_TO_RAD, 2, 3, 5);
      assert.deepEqual([].slice.call(m.mat4), Array.from(rm));
    });
  });

  suite("p5.Matrix3x3", function () {
    test("apply copy() to 3x3Matrix", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const mCopy = m.copy();

      // The matrix created by copying is different from the original matrix
      assert.notEqual(m, mCopy);
      assert.notEqual(m.mat3, mCopy.mat3);

      // The matrix created by copying has the same elements as the original matrix
      assert.deepEqual([].slice.call(m.mat3), [].slice.call(mCopy.mat3));
    });
    test("transpose()", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const mTp = new p5.Matrix([1, 4, 7, 2, 5, 8, 3, 6, 9]);

      // If no arguments, transpose itself
      m.transpose();
      assert.deepEqual([].slice.call(m.mat3), [].slice.call(mTp.mat3));

      // // If there is an array of arguments, set it by transposing it
      m.transpose([1, 2, 3, 10, 20, 30, 100, 200, 300]);
      assert.deepEqual(
        [].slice.call(m.mat3),
        [1, 10, 100, 2, 20, 200, 3, 30, 300]
      );
    });

    test("mult a 3x3 matrix with matrix as argument", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const multMatrix = new p5.Matrix([1, 1, 1, 0, 1, 1, 1, 0, 1]);
      // When taking a matrix as an argument
      m.mult(multMatrix);
      expect(toArray(m.mat3)).toEqual([ 4, 3, 6, 10, 9, 15, 16, 15, 24 ]);
    });

    test("mult a 3x3 matrix with array as argument", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      m.mult([1, 1, 1, 0, 1, 1, 1, 0, 1])
      expect(toArray(m.mat3)).toEqual([ 4, 3, 6, 10, 9, 15, 16, 15, 24 ]);
    });

    test("mult a 3x3 matrix with arguments non array", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      m.mult(1, 1, 1, 0, 1, 1, 1, 0, 1)
      expect(toArray(m.mat3)).toEqual([ 4, 3, 6, 10, 9, 15, 16, 15, 24 ]);
    });

    test("column() and row()", function () {
      // The matrix data is stored column-major, so each line below is
      // a column rather than a row. Imagine you are looking at the
      // transpose of the matrix in the source code.
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const column0 = m.column(0);
      const column1 = m.column(1);
      const column2 = m.column(2);
      expect(column0.array()).toStrictEqual([1, 2, 3]);
      expect(column1.array()).toStrictEqual([4, 5, 6]);
      expect(column2.array()).toStrictEqual([7, 8, 9]);
      const row0 = m.row(0);
      const row1 = m.row(1);
      const row2 = m.row(2);
      expect(row0.array()).toStrictEqual([1, 4, 7]);
      expect(row1.array()).toStrictEqual([2, 5, 8]);
      expect(row2.array()).toStrictEqual([3, 6, 9]);
    });
    test("diagonal()", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const m4x4 = new p5.Matrix([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]);
      assert.deepEqual(m.diagonal(), [1, 5, 9]);
      assert.deepEqual(m4x4.diagonal(), [1, 6, 11, 16]);
    });
    test("multiplyVec version 3", function () {
      const m = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const multVector = new p5.Vector(3, 2, 1);
      const result = m.multiplyVec(multVector);
      assert.deepEqual(result.array(), [18, 24, 30]);
      // If there is a target, set result and return that.
      const target = new p5.Vector();
      m.multiplyVec(multVector, target);
      assert.deepEqual(target.array(), [18, 24, 30]);
    });
    test("createSubMatrix3x3", function () {
      const m4x4 = new p5.Matrix([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]);
      const result = new p5.Matrix([1, 2, 3, 5, 6, 7, 9, 10, 11]);
      const subMatrix3x3 = m4x4.createSubMatrix3x3();
      assert.deepEqual(
        [].slice.call(result.mat3),
        [].slice.call(subMatrix3x3.mat3)
      );
    });
  });

  ///
  describe("transpose", () => {
    it("should transpose a 4x4 matrix correctly", () => {
      const mat = new p5.Matrix([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]);

      mat.transpose(mat);

      expect(toArray(mat.mat4)).toEqual([
        1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16,
      ]);
    });

    it("should transpose a 4x4 matrix from an array correctly", () => {
      const mat = new p5.Matrix([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]);

      mat.transpose([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

      expect(toArray(mat.mat4)).toEqual([
        1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16,
      ]);
    });

    // TODO: matrix transpose This needs to be added to the legacy tests
    it.skip("should transpose a 3x3 matrix correctly", () => {
      const mat = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      mat.transpose(mat);
      expect(mat.mat3).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
    });

    // TODO: matrix transpose This needs to be added to the legacy tests
    it.skip("should transpose a 3x3 matrix from an array correctly", () => {
      const mat = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);

      mat.transpose([1, 2, 3, 4, 5, 6, 7, 8, 9]);

      expect(mat.mat3).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
    });
  });
  describe.skip("Determinant", () => { // TODO: Cristian, when this is public we'll add tests
    it("should calculate the determinant of a 4x4 matrix", () => {
      const mat4 = new p5.Matrix([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
      const det = mat4.determinant4x4();
      expect(det).toBeCloseTo(1);
    });

    it("should return 0 for a singular 4x4 matrix", () => {
      const mat4 = new p5.Matrix([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ]);
      const det = mat4.determinant4x4();
      expect(det).toBeCloseTo(0);
    });
  });

  describe("invert", () => {
    it("should correctly invert a 4x4 matrix", () => {
      const matrix = new p5.Matrix([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);

      const invertedMatrix = matrix.invert(matrix);

      expect(toArray(invertedMatrix.mat4)).toEqual([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
    });

    it("should return null for a non-invertible matrix", () => {
      const matrix = new p5.Matrix([
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

      const invertedMatrix = matrix.invert(matrix);

      expect(invertedMatrix).toBeNull();
    });

    it("should correctly invert a non-identity 4x4 matrix", () => {
      const matrix = new p5.Matrix([
        1, 1, 1, 1, 1, -1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0,
      ]);

      const invertedMatrix = matrix.invert(matrix);

      expect(toArray(invertedMatrix.mat4)).toEqual([
        0, 0, 0, 1, 0, 0, 1, -1, 0, 1, 1, -2, 1, -1, -2, 2,
      ]);
    });
  });
  //
  describe("invert", () => {
    it("should correctly invert a 3x3 matrix", () => {
      const matrix = new p5.Matrix([1, 2, 3, 0, 1, 4, 5, 6, 0]);
      const invertedMatrix = matrix.invert();

      expect(toArray(invertedMatrix.mat3)).toEqual([-24, 18, 5, 20, -15, -4, -5, 4, 1]);
    });

    it("should return null for a non-invertible 3x3 matrix", () => {
      const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const invertedMatrix = matrix.invert();

      expect(invertedMatrix).toBeNull();
    });

    it("should return the identity matrix when inverting the identity matrix", () => {
      const matrix = new p5.Matrix([1, 0, 0, 0, 1, 0, 0, 0, 1]);
      const invertedMatrix = matrix.invert();

      expect(toArray(invertedMatrix.mat3)).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    });
  });

  describe("mat set element", () => {
    it("should set element of mat4 matrix", () => {
      const matrix = new p5.Matrix([
        1, 2, 3, 5, 0, 1, 4, 5, 5, 6, 0, 5, 5, 6, 0, 5,
      ]);
      const invertedMatrix = matrix.setElement(2, 0);

      expect(toArray(invertedMatrix.mat4)).toEqual([
        1, 2, 0, 5, 0, 1, 4, 5, 5, 6, 0, 5, 5, 6, 0, 5,
      ]);
    });

    it("should set element of mat3 matrix", () => {
      const matrix = new p5.Matrix([1, 2, 3, 0, 1, 4, 5, 6, 0]);
      const invertedMatrix = matrix.setElement(2, 0);

      expect(toArray(invertedMatrix.mat3)).toEqual([1, 2, 0, 0, 1, 4, 5, 6, 0]);
    });
  });
});
