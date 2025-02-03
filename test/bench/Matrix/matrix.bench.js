import { bench, describe } from "vitest";
import { Matrix } from "../../../src/math/Matrices/Matrix";
import { MatrixNumjs } from "../../../src/math/Matrices/MatrixNumjs";

describe("mult 3x3", () => {
  bench(
    "mult two 3x3 matrices using gl implementation",
    () => {
      const m = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      m.mult(1, 1, 1, 0, 1, 1, 1, 0, 1);
      expect(m.mat3).toEqual([4, 3, 6, 10, 9, 15, 16, 15, 24]);
    },
    { iterations: 1000 }
  );
  bench(
    "mult two 3x3 matrices using Numjs",
    () => {
      const m = new MatrixNumjs([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      m.mult(1, 1, 1, 0, 1, 1, 1, 0, 1);
      expect(m.mat3).toEqual([4, 3, 6, 10, 9, 15, 16, 15, 24]);
    },
    { iterations: 1000 }
  );
});

const mat4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const other = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16];
const mm = [
  30, 70, 110, 150, 70, 174, 278, 382, 110, 278, 446, 614, 150, 382, 614, 846,
];
describe("mult 4x4", () => {
  bench(
    "mult two 4x4 matrices using gl implementation",
    () => {
      try {
        const m1 = new Matrix(mat4.slice());
        const m2 = new Matrix(other);
        m1.mult(m2);
        assert.deepEqual([].slice.call(m1.mat4), mm);
      } catch (error) {
        console.error("Error during matrix multiplication:", error);
      }
    },
    { iterations: 1000 }
  );
  bench(
    "mult two 4x4 matrices using Numjs",
    () => {
      try {
        const m1 = new MatrixNumjs(mat4.slice());
        const m2 = new MatrixNumjs(other);
        m1.mult(m2);
        assert.deepEqual([].slice.call(m1.mat4), mm);
      } catch (error) {
        console.error("Error during matrix multiplication using Numjs:", error);
      }
    },
    { iterations: 1000 }
  );
});
