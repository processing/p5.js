/**
 * @module Data
 * @submodule Conversion
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Converts a string to its floating point representation. The contents of a
 * string must resemble a number, or NaN (not a number) will be returned.
 * For example, float("1234.56") evaluates to 1234.56, but float("giraffe")
 * will return NaN.
 *
 * @method float
 * @param {String}  str float string to parse
 * @return {Number}     floating point representation of string
 * @example
 * <div><code>
 * var str = '20';
 * var diameter = float(str);
 * ellipse(width/2, height/2, diameter, diameter);
 * </code></div>
 */
p5.prototype.float = function(str) {
  return parseFloat(str);
};

/**
 * Converts a boolean, string, or float to its integer representation.
 * When an array of values is passed in, then an int array of the same length
 * is returned.
 *
 * @method int
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {Number}                     integer representation of value
 * @example
 * <div class='norender'><code>
 * println(int("10")); // 10
 * println(int(10.31)); // 10
 * println(int(-10)); // -10
 * println(int(true)); // 1
 * println(int(false)); // 0
 * println(int([false, true, "10.3", 9.8])); // [0, 1, 10, 9]
 * </code></div>
 */
p5.prototype.int = function(n, radix) {
  if (typeof n === 'string') {
    radix = radix || 10;
    return parseInt(n, radix);
  } else if (typeof n === 'number') {
    return n | 0;
  } else if (typeof n === 'boolean') {
    return n ? 1 : 0;
  } else if (n instanceof Array) {
    return n.map(function(n) { return p5.prototype.int(n, radix); });
  }
};

/**
 * Converts a boolean, string or number to its string representation.
 * When an array of values is passed in, then an array of strings of the same
 * length is returned.
 *
 * @method str
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {String}                     string representation of value
 * @example
 * <div class='norender'><code>
 * println(str("10"));  // "10"
 * println(str(10.31)); // "10.31"
 * println(str(-10));   // "-10"
 * println(str(true));  // "true"
 * println(str(false)); // "false"
 * println(str([true, "10.3", 9.8])); // [ "true", "10.3", "9.8" ]
 * </code></div>
 */
p5.prototype.str = function(n) {
  if (n instanceof Array) {
    return n.map(p5.prototype.str);
  } else {
    return String(n);
  }
};

/**
 * Converts a number or string to its boolean representation.
 * For a number, any non-zero value (positive or negative) evaluates to true,
 * while zero evaluates to false. For a string, the value "true" evaluates to
 * true, while any other value evaluates to false. When an array of number or
 * string values is passed in, then a array of booleans of the same length is
 * returned.
 *
 * @method boolean
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {Boolean}                    boolean representation of value
 * @example
 * <div class='norender'><code>
 * println(boolean(0));               // false
 * println(boolean(1));               // true
 * println(boolean("true"));          // true
 * println(boolean("abcd"));          // false
 * println(boolean([0, 12, "true"])); // [false, true, false]
 * </code></div>
 */
p5.prototype.boolean = function(n) {
  if (typeof n === 'number') {
    return n !== 0;
  } else if (typeof n === 'string') {
    return n.toLowerCase() === 'true';
  } else if (typeof n === 'boolean') {
    return n;
  } else if (n instanceof Array) {
    return n.map(p5.prototype.boolean);
  }
};

/**
 * Converts a number, string or boolean to its byte representation.
 * A byte can be only a whole number between -128 and 127, so when a value
 * outside of this range is converted, it wraps around to the corresponding
 * byte representation. When an array of number, string or boolean values is
 * passed in, then an array of bytes the same length is returned.
 *
 * @method byte
 * @param {String|Boolean|Number|Array} n value to parse
 * @return {Number}                     byte representation of value
 * @example
 * <div class='norender'><code>
 * println(byte(127));               // 127
 * println(byte(128));               // -128
 * println(byte(23.4));              // 23
 * println(byte("23.4"));            // 23
 * println(byte(true));              // 1
 * println(byte([0, 255, "100"]));   // [0, -1, 100]
 * </code></div>
 */
p5.prototype.byte = function(n) {
  var nn = p5.prototype.int(n, 10);
  if (typeof nn === 'number') {
    return ((nn + 128) % 256) - 128;
  } else if (nn instanceof Array) {
    return nn.map(p5.prototype.byte);
  }
};

/**
 * Converts a number or string to its corresponding single-character
 * string representation. If a string parameter is provided, it is first
 * parsed as an integer and then translated into a single-character string.
 * When an array of number or string values is passed in, then an array of
 * single-character strings of the same length is returned.
 *
 * @method char
 * @param {String|Number|Array} n value to parse
 * @return {String}             string representation of value
 * @example
 * <div class='norender'><code>
 * println(char(65));                     // "A"
 * println(char("65"));                   // "A"
 * println(char([65, 66, 67]));           // [ "A", "B", "C" ]
 * println(join(char([65, 66, 67]), '')); // "ABC"
 * </code></div>
 */
p5.prototype.char = function(n) {
  if (typeof n === 'number' && !isNaN(n)) {
    return String.fromCharCode(n);
  } else if (n instanceof Array) {
    return n.map(p5.prototype.char);
  } else if (typeof n === 'string') {
    return p5.prototype.char(parseInt(n, 10));
  }
};

/**
 * Converts a single-character string to its corresponding integer
 * representation. When an array of single-character string values is passed
 * in, then an array of integers of the same length is returned.
 *
 * @method unchar
 * @param {String|Array} n value to parse
 * @return {Number}      integer representation of value
 * @example
 * <div class='norender'><code>
 * println(unchar("A"));               // 65
 * println(unchar(["A", "B", "C"]));   // [ 65, 66, 67 ]
 * println(unchar(split("ABC", "")));  // [ 65, 66, 67 ]
 * </code></div>
 */
p5.prototype.unchar = function(n) {
  if (typeof n === 'string' && n.length === 1) {
    return n.charCodeAt(0);
  } else if (n instanceof Array) {
    return n.map(p5.prototype.unchar);
  }
};

/**
 * Converts a number to a string in its equivalent hexadecimal notation. If a
 * second parameter is passed, it is used to set the number of characters to
 * generate in the hexadecimal notation. When an array is passed in, an
 * array of strings in hexadecimal notation of the same length is returned.
 *
 * @method hex
 * @param {Number|Array} n value to parse
 * @return {String}      hexadecimal string representation of value
 * @example
 * <div class='norender'><code>
 * println(hex(255));               // "000000FF"
 * println(hex(255, 6));            // "0000FF"
 * println(hex([0, 127, 255], 6));  // [ "000000", "00007F", "0000FF" ]
 * </code></div>
 */
p5.prototype.hex = function(n, digits) {
  digits = (digits === undefined || digits === null) ? digits = 8 : digits;
  if (n instanceof Array) {
    return n.map(function(n) { return p5.prototype.hex(n, digits); });
  } else if (typeof n === 'number') {
    if (n < 0) {
      n = 0xFFFFFFFF + n + 1;
    }
    var hex = Number(n).toString(16).toUpperCase();
    while (hex.length < digits) {
      hex = '0' + hex;
    }
    if (hex.length >= digits) {
      hex = hex.substring(hex.length - digits, hex.length);
    }
    return hex;
  }
};

/**
 * Converts a string representation of a hexadecimal number to its equivalent
 * integer value. When an array of strings in hexadecimal notation is passed
 * in, an array of integers of the same length is returned.
 *
 * @method unhex
 * @param {String|Array} n value to parse
 * @return {Number}      integer representation of hexadecimal value
 * @example
 * <div class='norender'><code>
 * println(unhex("A"));                // 10
 * println(unhex("FF"));               // 255
 * println(unhex(["FF", "AA", "00"])); // [ 255, 170, 0 ]
 * </code></div>
 */
p5.prototype.unhex = function(n) {
  if (n instanceof Array) {
    return n.map(p5.prototype.unhex);
  } else {
    return parseInt('0x' + n, 16);
  }
};

module.exports = p5;
