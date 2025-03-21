/**
 * @requires constants
 * @todo see methods below needing further implementation.
 * future consideration: implement SIMD optimizations
 * when browser compatibility becomes available
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *   Reference/Global_Objects/SIMD
 */
import { Matrix } from './Matrices/Matrix'
// import { MatrixNumjs as Matrix } from './Matrices/MatrixNumjs'



function matrix(p5, fn){
  /**
   * A class to describe a 4×4 matrix
   * for model and view matrix manipulation in the p5js webgl renderer.
   * @class p5.Matrix
   * @param {Array} [mat4] column-major array literal of our 4×4 matrix
   */
  p5.Matrix = Matrix
}

export default matrix;
export { Matrix };

if(typeof p5 !== 'undefined'){
  matrix(p5, p5.prototype);
}
