
export let GLMAT_ARRAY_TYPE = Array;
export let isMatrixArray = (x) => Array.isArray(x);
if (typeof Float32Array !== "undefined") {
  GLMAT_ARRAY_TYPE = Float32Array;
  isMatrixArray = (x) => Array.isArray(x) || x instanceof Float32Array;
}
export class MatrixInterface {
  // Private field to store the matrix
  #matrix = null;
  constructor(...args) {
    if (this.constructor === MatrixInterface) {
      throw new Error("Class is of abstract type and can't be instantiated");
    }
    const methods = [
      // Public
      // "add",
      "reset",
      "set",
      "get",
      "copy",
      "clone",
      "mult",
      "column",
      "row",
      "diagonal",
      "transpose",
      // Private
      "mult3x3",
      "createSubMatrix3x3",
      "invert",
      "invert3x3",
      "transpose3x3",
      "inverseTranspose",
      "determinant",
      "apply",
      "scale",
      "rotate",
      "translate",
      "rotateX",
      "rotateY",
      "rotateZ",
      "perspective",
      "ortho",
      "multiplyVec4",
      "multiplyPoint",
      "multiplyAndNormalizePoint",
      "multiplyDirection",
      "multiplyVec3",
    ];

    methods.forEach((method) => {
        // console.log(method)
      if (this[method] === undefined) {
        throw new Error(`${method}() method must be implemented`);
      }
    });
  }

  // TODO: Organizing what methods will be public and what will be internal
  // Need to remove references to mat3 and mat4 to make it accessible
  //   // Getter for mat3
  //   get mat3() {
  //     if (this.#matrix && this.#matrix.length === 9) {
  //       return this.#matrix;
  //     }
  //     return null;
  //   }
  //   get mat4() {
  //     if (this.#matrix && this.#matrix.length === 14) {
  //       return this.#matrix;
  //     }
  //     return null;
  //   }

//   // Generic
//   reset() {}
//   set(inMatrix) {}
//   get() {}
//   copy() {}
//   clone() {}
//   mult(multMatrix) {}
//   mult3x3(multMatrix) {}
//   column(columnIndex) {}
//   row(rowIndex) {}
//   diagonal() {}

//   //Defaults needed for mat4 and mat3
//   // only 4x4
//   createSubMatrix3x3() {} // only 4x4, returns 3x3
//   transpose(a) {} // default 4x4
//   invert(a) {} // this is by default done on a 4x4
//   invert3x3() {}
//   transpose3x3(mat3) {}

//   // only 3x3
//   inverseTranspose({ mat4 }) {} // only applies to 3x3

//   determinant() {} // only performant in  n<4

//   // Internal usage
//   apply(multMatrix) {} // internal usage
//   // not intuitive only x,y,z to mat 4
//   scale(x, y, z) {} // not intuitive only x,y,z to mat 4
//   rotate(a, x, y, z) {} // not intuitive only x,y,z to mat 4
//   translate(v) {}

//   // only for mat 4
//   rotateX(a) {}
//   rotateY(a) {}
//   rotateZ(a) {}
//   perspective(fovy, aspect, near, far) {}
//   ortho(left, right, bottom, top, near, far) {}
//   multiplyVec4(x, y, z, w) {} //
//   // use mutiply vect 4
//   multiplyPoint({ x, y, z }) {}
//   multiplyAndNormalizePoint({ x, y, z }) {}
//   multiplyDirection({ x, y, z }) {}

//   multiplyVec3(multVector, target) {}
//   static identity(pInst) {}
}
