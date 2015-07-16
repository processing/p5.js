/**
 * @module Data
 * @submodule Array Functions
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Adds a value to the end of an array. Extends the length of
 * the array by one. Maps to Array.push().
 *
 * @method append
 * @param {Array} array Array to append
 * @param {any} value to be added to the Array
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *
 * var myArray = new Array("Mango", "Apple", "Papaya")
 * print(myArray) // ["Mango", "Apple", "Papaya"]
 *
 * append(myArray, "Peach")
 * print(myArray) // ["Mango", "Apple", "Papaya", "Peach"]
 *
 * }
 * </div></code>
 */
p5.prototype.append = function(array, value) {
  array.push(value);
  return array;
};

/**
 * Copies an array (or part of an array) to another array. The src array is
 * copied to the dst array, beginning at the position specified by
 * srcPosition and into the position specified by dstPosition. The number of
 * elements to copy is determined by length. Note that copying values
 * overwrites existing values in the destination array. To append values
 * instead of overwriting them, use concat().
 *
 * The simplified version with only two arguments — arrayCopy(src, dst) —
 * copies an entire array to another of the same size. It is equivalent to
 * arrayCopy(src, 0, dst, 0, src.length).
 *
 * Using this function is far more efficient for copying array data than
 * iterating through a for() loop and copying each element individually.
 *
 * @method arrayCopy
 * @param {Array}  src           the source Array
 * @param {Number} [srcPosition] starting position in the source Array
 * @param {Array}  dst           the destination Array
 * @param {Number} [dstPosition] starting position in the destination Array
 * @param {Nimber} [length]      number of Array elements to be copied
 *
 * @example
 *  <div class="norender"><code>
 *  function setup() {
 *
 *    var src = new Array("A", "B", "C");
 *    var dst = new Array( 1 ,  2 ,  3 );
 *    var srcPosition = 1;
 *    var dstPosition = 0;
 *    var length = 2;
 *
 *    print(src); // ["A", "B", "C"]
 *    print(dst); // [ 1 ,  2 ,  3 ]
 *
 *    arrayCopy(src, srcPosition, dst, dstPosition, length);
 *    print(dst); // ["B", "C", 3]
 *
 *    }
 *  </div></code>
 */
p5.prototype.arrayCopy = function(
  src,
  srcPosition,
  dst,
  dstPosition,
  length) {

  // the index to begin splicing from dst array
  var start,
      end;

  if (typeof length !== 'undefined') {

    end = Math.min(length, src.length);
    start = dstPosition;
    src = src.slice(srcPosition, end + srcPosition);

  } else {

    if (typeof dst !== 'undefined') { // src, dst, length
      // rename  so we don't get confused
      end = dst;
      end = Math.min(end, src.length);
    } else { // src, dst
      end = src.length;
    }

    start = 0;
    // rename  so we don't get confused
    dst = srcPosition;
    src = src.slice(0, end);
  }

  // Since we are not returning the array and JavaScript is pass by reference
  // we must modify the actual values of the array
  // instead of reassigning arrays
  Array.prototype.splice.apply(dst, [start, end].concat(src));

};

/**
 * Concatenates two arrays, maps to Array.concat(). Does not modify the
 * input arrays.
 *
 * @method concat
 * @param {Array} a first Array to concatenate
 * @param {Array} b second Array to concatenate
 * @return {Array} concatenated array
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var arr1 = new Array("A", "B", "C");
 *   var arr2 = new Array( 1 ,  2 ,  3 );
 *
 *   print(arr1); // ["A","B","C"]
 *   print(arr2); // [1,2,3]
 *
 *   var arr3 = concat(arr1, arr2);
 *
 *   print(arr1); // ["A","B","C"]
 *   print(arr2); // [1,2,3]
 *   print(arr3); // ["A","B","C",1,2,3]
 *
 * }
 * </div></code>
 */
p5.prototype.concat = function(list0, list1) {
  return list0.concat(list1);
};

/**
 * Reverses the order of an array, maps to Array.reverse()
 *
 * @method reverse
 * @param {Array} list Array to reverse
 * @example
 * <div class="norender"><code>
 * function setup() {
 *   var myArray = new Array("A", "B", "C");
 *   print(myArray); // ["A","B","C"]
 *
 *   reverse(myArray);
 *   print(myArray); // ["C","B","A"]
 * }
 * </div></code>
 */
p5.prototype.reverse = function(list) {
  return list.reverse();
};

/**
 * Decreases an array by one element and returns the shortened array,
 * maps to Array.pop().
 *
 * @method shorten
 * @param  {Array} list Array to shorten
 * @return {Array} shortened Array
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var myArray = new Array("A", "B", "C");
 *   print(myArray); // ["A","B","C"]
 *
 *   var newArray = shorten(myArray);
 *   print(myArray); // ["A","B","C"]
 *   print(newArray); // ["A","B"]
 * }
 * </div></code>
 */
p5.prototype.shorten = function(list) {
  list.pop();
  return list;
};

/**
 * Randomizes the order of the elements of an array.
 * Implements Fisher-Yates Shuffle Algorithm
 * http://Bost.Ocks.org/mike/shuffle/
 * http://en.Wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * @method shuffle
 * @param  {Array}   array  Array to shuffle
 * @param  {Boolean} [bool] modify passed array
 * @return {Array}   shuffled Array
 * @example
 * <div><code>
 * function setup() {
 *   var regularArr = ['ABC', 'def', createVector(), TAU, Math.E];
 *   print(regularArr);
 *   shuffle(regularArr, true); // force modifications to passed array
 *   print(regularArr);
 *
 *   // By default shuffle() returns a shuffled cloned array:
 *   var newArr = shuffle(regularArr);
 *   print(regularArr);
 *   print(newArr);
 * }
 * </code></div>
 */
p5.prototype.shuffle = function(arr, bool) {
  arr = bool || ArrayBuffer.isView(arr)? arr : arr.slice();

  var rnd, tmp, idx = arr.length;
  while (idx > 1) {
    rnd = Math.random()*idx | 0;

    tmp = arr[--idx];
    arr[idx] = arr[rnd];
    arr[rnd] = tmp;
  }

  return arr;
};

/**
 * Sorts an array of numbers from smallest to largest, or puts an array of
 * words in alphabetical order. The original array is not modified; a
 * re-ordered array is returned. The count parameter states the number of
 * elements to sort. For example, if there are 12 elements in an array and
 * count is set to 5, only the first 5 elements in the array will be sorted.
 *
 * @method sort
 * @param {Array} list Array to sort
 * @param {Number} [count] number of elements to sort, starting from 0
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var words = new Array("banana", "apple", "pear","lime");
 *   print(words); // ["banana", "apple", "pear", "lime"]
 *   var count = 4; // length of array
 *
 *   sort(words, count);
 *   print(words); // ["apple", "banana", "lime", "pear"]
 * }
 * </div></code>
 * <div class = "norender"><code>
 * function setup() {
 *   var numbers = new Array(2,6,1,5,14,9,8,12);
 *   print(numbers); // [2,6,1,5,14,9,8,12]
 *   var count = 5; // Less than the length of the array
 *
 *   sort(numbers, count);
 *   print(numbers); // [1,2,5,6,14,9,8,12]
 * }
 * </div></code>
 */
p5.prototype.sort = function(list, count) {
  var arr = count ? list.slice(0, Math.min(count, list.length)) : list;
  var rest = count ? list.slice(Math.min(count, list.length)) : [];
  if (typeof arr[0] === 'string') {
    arr = arr.sort();
  } else {
    arr = arr.sort(function(a,b){return a-b;});
  }
  return arr.concat(rest);
};

/**
 * Inserts a value or an array of values into an existing array. The first
 * parameter specifies the initial array to be modified, and the second
 * parameter defines the data to be inserted. The third parameter is an index
 * value which specifies the array position from which to insert data.
 * (Remember that array index numbering starts at zero, so the first position
 * is 0, the second position is 1, and so on.)
 *
 * @method splice
 * @param {Array}  list Array to splice into
 * @param {any}    value value to be spliced in
 * @param {Number} position in the array from which to insert data
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var myArray = new Array(0,1,2,3,4);
 *   var insArray = new Array("A","B","C");
 *   print(myArray); // [0,1,2,3,4]
 *   print(insArray); // ["A","B","C"]
 *
 *   splice(myArray, insArray, 3);
 *   print(myArray); // [0,1,2,"A","B","C",3,4]
 * }
 * </div></code>
 */
p5.prototype.splice = function(list, value, index) {

  // note that splice returns spliced elements and not an array
  Array.prototype.splice.apply(list, [index, 0].concat(value));

  return list;
};

/**
 * Extracts an array of elements from an existing array. The list parameter
 * defines the array from which the elements will be copied, and the start
 * and count parameters specify which elements to extract. If no count is
 * given, elements will be extracted from the start to the end of the array.
 * When specifying the start, remember that the first array element is 0.
 * This function does not change the source array.
 *
 * @method subset
 * @param  {Array}  list    Array to extract from
 * @param  {Number} start   position to begin
 * @param  {Number} [count] number of values to extract
 * @return {Array}          Array of extracted elements
 *
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var myArray = new Array(1,2,3,4,5);
 *   print(myArray); // [1,2,3,4,5]
 *
 *   var sub1 = subset(myArray, 0, 3);
 *   var sub2 = subset(myArray, 2, 2);
 *   print(sub1); // [1,2,3]
 *   print(sub2); // [3,4]
 * }
 * </div></code>
 */
p5.prototype.subset = function(list, start, count) {
  if (typeof count !== 'undefined') {
    return list.slice(start, start + count);
  } else {
    return list.slice(start, list.length);
  }
};

module.exports = p5;
