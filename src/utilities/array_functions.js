/**
 * @module Data
 * @submodule Array Functions
 * @for p5
 * @requires core
 */

function arrayFunctions(p5, fn){
  /**
   * Shuffles the elements of an array.
   *
   * The first parameter, `array`, is the array to be shuffled. For example,
   * calling `shuffle(myArray)` will shuffle the elements of `myArray`. By
   * default, the original array won’t be modified. Instead, a copy will be
   * created, shuffled, and returned.
   *
   * The second parameter, `modify`, is optional. If `true` is passed, as in
   * `shuffle(myArray, true)`, then the array will be shuffled in place without
   * making a copy.
   *
   * @method shuffle
   * @param  {Array} array array to shuffle.
   * @param  {Boolean} [bool] if `true`, shuffle the original array in place. Defaults to `false`.
   * @return {Array} shuffled array.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an array of colors.
   *   let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
   *
   *   // Create a shuffled copy of the array.
   *   let shuffledColors = shuffle(colors);
   *
   *   // Draw  a row of circles using the original array.
   *   for (let i = 0; i < colors.length; i += 1) {
   *     // Calculate the x-coordinate.
   *     let x = (i + 1) * 12.5;
   *
   *     // Style the circle.
   *     let c = colors[i];
   *     fill(c);
   *
   *     // Draw the circle.
   *     circle(x, 33, 10);
   *   }
   *
   *   // Draw  a row of circles using the original array.
   *   for (let i = 0; i < shuffledColors.length; i += 1) {
   *     // Calculate the x-coordinate.
   *     let x = (i + 1) * 12.5;
   *
   *     // Style the circle.
   *     let c = shuffledColors[i];
   *     fill(c);
   *
   *     // Draw the circle.
   *     circle(x, 67, 10);
   *   }
   *
   *   describe(
   *     'Two rows of circles on a gray background. The top row follows the color sequence ROYGBIV. The bottom row has all the same colors but they are shuffled.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an array of colors.
   *   let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
   *
   *   // Shuffle the array.
   *   shuffle(colors, true);
   *
   *   // Draw  a row of circles using the original array.
   *   for (let i = 0; i < colors.length; i += 1) {
   *     // Calculate the x-coordinate.
   *     let x = (i + 1) * 12.5;
   *
   *     // Style the circle.
   *     let c = colors[i];
   *     fill(c);
   *
   *     // Draw the circle.
   *     circle(x, 50, 10);
   *   }
   *
   *   describe(
   *     'A row of colorful circles on a gray background. Their sequence changes each time the sketch runs.'
   *   );
   * }
   * </code>
   * </div>
   */
  fn.shuffle = function (arr, bool) {
    const isView = ArrayBuffer && ArrayBuffer.isView && ArrayBuffer.isView(arr);
    arr = bool || isView ? arr : arr.slice();

    let rnd,
      tmp,
      idx = arr.length;
    while (idx > 1) {
      rnd = (this.random(0, 1) * idx) | 0;

      tmp = arr[--idx];
      arr[idx] = arr[rnd];
      arr[rnd] = tmp;
    }

    return arr;
  };
}

export default arrayFunctions;

if(typeof p5 !== 'undefined'){
  arrayFunctions(p5, p5.prototype);
}
