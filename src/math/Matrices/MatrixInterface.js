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
      "add",
      "setElement",
      "reset",
      "set",
      "get",
      "copy",
      "clone",
      "diagonal",
      "row",
      "column",
      "transpose",
      "mult",
      "multiplyVec",
      "invert",
      "createSubMatrix3x3",
      "inverseTranspose4x4",
      "apply",
      "scale",
      "rotate4x4",
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
      if (this[method] === undefined) {
        throw new Error(`${method}() method must be implemented`);
      }
    });
  }
}
