/**
 * @module Math
 * @submodule Matrix
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

const makeNumberedArray = n => [...Array(n)].map((_, i) => i);
/**
 * Make a N-dimensional matrix
 *
 * @method matrix
 * @param {Number} x dimension size
 * @param {Number} y dimension size
 * @param {Number} z dimension size
 * @param {Number} n n-dimension size
 * @example
 * <div class='norender'><code>
 * function setup() {
 *   matrix(2, 2).map(([x, y]) => x + y); // [[0, 1], [1, 2]]
 *   matrix(2, 2, 2).map(([x, y, z]) => x + y + z); // [[[0, 1], [1, 2]], [[1, 2],[2, 3]]]
 *
 *   matrix(2, 2, 2).forEach(console.log);
 *   // [0, 0, 0]
 *   // [0, 0, 1]
 *   // [0, 0, 2]
 *   // [0, 1, 0]
 *   // [0, 1, 1]
 *   // [0, 1, 2]
 * }
 * </code></div>
 */
p5.prototype.matrix = (...dimensions) => {
  const recursiveLoop = method => (
    fn,
    innerDimensions = dimensions,
    parentArguments = []
  ) => {
    const currentDimensionSize = innerDimensions.shift();
    const hasDimensions = innerDimensions.length;

    return hasDimensions
      ? makeNumberedArray(currentDimensionSize)[method](x =>
          recursiveLoop(method)(
            fn,
            [...innerDimensions],
            [...parentArguments, x]
          )
        )
      : makeNumberedArray(currentDimensionSize)[method](x =>
          fn([...parentArguments, x])
        );
  };
  return {
    map: recursiveLoop('map'),
    forEach: recursiveLoop('forEach')
  };
};

export default p5;
