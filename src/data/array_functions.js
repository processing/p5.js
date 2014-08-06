/**
 * @module Data
 * @submodule Array Functions
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * Adds a value to an Array, maps to Array.push.
   *
   * @method append
   * @param {Array} array Array to append
   * @param {any} value to be added to the Array
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
   * Concatenates two arrays, maps to Array.concat(). For example,
   * concatenating the array { 1, 2, 3 } and the array { 4, 5, 6 } yields
   * { 1, 2, 3, 4, 5, 6 }. 
   *
   * @method concat
   * @param {Array} a first Array to concatenate
   * @param {Array} b second Array to concatenate
   */
  p5.prototype.concat = function(list0, list1) {
    return list0.concat(list1);
  };

  /**
   * Reverses the order of an array, maps to Array.reverse()
   *
   * @method reverse
   * @param {Array} list Array to reverse
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
   */
  p5.prototype.shorten = function(list) {
    list.pop();
    return list;
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
   */
  p5.prototype.subset = function(list, start, count) {
    if (typeof count !== 'undefined') {
      return list.slice(start, start + count);
    } else {
      return list.slice(start, list.length);
    }
  };

  return p5;

});
