/**
 * @module Data
 * @submodule String Functions
 * @for p5
 * @requires core
 */

'use strict';

import p5 from '../core/main';
import '../core/error_helpers';

//return p5; //LM is this a mistake?

/**
 * Combines an array of Strings into one String, each separated by the
 * character(s) used for the separator parameter. To join arrays of ints or
 * floats, it's necessary to first convert them to Strings using <a href="#/p5/nf">nf()</a> or
 * nfs().
 *
 * @method join
 * @param  {Array}  list      array of Strings to be joined
 * @param  {String} separator String to be placed between each item
 * @return {String}           joined String
 * @example
 * <div>
 * <code>
 * var array = ['Hello', 'world!'];
 * var separator = ' ';
 * var message = join(array, separator);
 * text(message, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * "hello world!" displayed middle left of canvas.
 *
 */
p5.prototype.join = function(list, separator) {
  p5._validateParameters('join', arguments);
  return list.join(separator);
};

/**
 * This function is used to apply a regular expression to a piece of text,
 * and return matching groups (elements found inside parentheses) as a
 * String array. If there are no matches, a null value will be returned.
 * If no groups are specified in the regular expression, but the sequence
 * matches, an array of length 1 (with the matched text as the first element
 * of the array) will be returned.
 * <br><br>
 * To use the function, first check to see if the result is null. If the
 * result is null, then the sequence did not match at all. If the sequence
 * did match, an array is returned.
 * <br><br>
 * If there are groups (specified by sets of parentheses) in the regular
 * expression, then the contents of each will be returned in the array.
 * Element [0] of a regular expression match returns the entire matching
 * string, and the match groups start at element [1] (the first group is [1],
 * the second [2], and so on).
 *
 * @method match
 * @param  {String} str    the String to be searched
 * @param  {String} regexp the regexp to be used for matching
 * @return {String[]}      Array of Strings found
 * @example
 * <div>
 * <code>
 * var string = 'Hello p5js*!';
 * var regexp = 'p5js\\*';
 * var m = match(string, regexp);
 * text(m, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * "p5js*" displayed middle left of canvas.
 *
 */
p5.prototype.match = function(str, reg) {
  p5._validateParameters('match', arguments);
  return str.match(reg);
};

/**
 * This function is used to apply a regular expression to a piece of text,
 * and return a list of matching groups (elements found inside parentheses)
 * as a two-dimensional String array. If there are no matches, a null value
 * will be returned. If no groups are specified in the regular expression,
 * but the sequence matches, a two dimensional array is still returned, but
 * the second dimension is only of length one.
 * <br><br>
 * To use the function, first check to see if the result is null. If the
 * result is null, then the sequence did not match at all. If the sequence
 * did match, a 2D array is returned.
 * <br><br>
 * If there are groups (specified by sets of parentheses) in the regular
 * expression, then the contents of each will be returned in the array.
 * Assuming a loop with counter variable i, element [i][0] of a regular
 * expression match returns the entire matching string, and the match groups
 * start at element [i][1] (the first group is [i][1], the second [i][2],
 * and so on).
 *
 * @method matchAll
 * @param  {String} str    the String to be searched
 * @param  {String} regexp the regexp to be used for matching
 * @return {String[]}         2d Array of Strings found
 * @example
 * <div class="norender">
 * <code>
 * var string = 'Hello p5js*! Hello world!';
 * var regexp = 'Hello';
 * matchAll(string, regexp);
 * </code>
 * </div>
 */
p5.prototype.matchAll = function(str, reg) {
  p5._validateParameters('matchAll', arguments);
  var re = new RegExp(reg, 'g');
  var match = re.exec(str);
  var matches = [];
  while (match !== null) {
    matches.push(match);
    // matched text: match[0]
    // match start: match.index
    // capturing group n: match[n]
    match = re.exec(str);
  }
  return matches;
};

/**
 * Utility function for formatting numbers into strings. There are two
 * versions: one for formatting floats, and one for formatting ints.
 * The values for the digits, left, and right parameters should always
 * be positive integers.
 * (NOTE): Be cautious when using left and right parameters as it prepends numbers of 0's if the parameter
 * if greater than the current length of the number.
 * For example if number is 123.2 and left parameter passed is 4 which is greater than length of 123
 * (integer part) i.e 3 than result will be 0123.2. Same case for right parameter i.e. if right is 3 than
 * the result will be 123.200.
 *
 * @method nf
 * @param {Number|String}       num      the Number to format
 * @param {Integer|String}      [left]   number of digits to the left of the
 *                                decimal point
 * @param {Integer|String}      [right]  number of digits to the right of the
 *                                decimal point
 * @return {String}               formatted String
 *
 * @example
 * <div>
 * <code>
 * var myFont;
 * function preload() {
 *   myFont = loadFont('assets/fonts/inconsolata.ttf');
 * }
 * function setup() {
 *   background(200);
 *   var num1 = 321;
 *   var num2 = -1321;
 *
 *   noStroke();
 *   fill(0);
 *   textFont(myFont);
 *   textSize(22);
 *
 *   text(nf(num1, 4, 2), 10, 30);
 *   text(nf(num2, 4, 2), 10, 80);
 *   // Draw dividing line
 *   stroke(120);
 *   line(0, 50, width, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * "0321.00" middle top, -1321.00" middle bottom canvas
 */
/**
 * @method nf
 * @param {Array}        nums     the Numbers to format
 * @param {Integer|String}      [left]
 * @param {Integer|String}      [right]
 * @return {String[]}                formatted Strings
 */
p5.prototype.nf = function(nums, left, right) {
  p5._validateParameters('nf', arguments);
  if (nums instanceof Array) {
    return nums.map(function(x) {
      return doNf(x, left, right);
    });
  } else {
    var typeOfFirst = Object.prototype.toString.call(nums);
    if (typeOfFirst === '[object Arguments]') {
      if (nums.length === 3) {
        return this.nf(nums[0], nums[1], nums[2]);
      } else if (nums.length === 2) {
        return this.nf(nums[0], nums[1]);
      } else {
        return this.nf(nums[0]);
      }
    } else {
      return doNf(nums, left, right);
    }
  }
};

function doNf(num, left, right) {
  var neg = num < 0;
  var n = neg ? num.toString().substring(1) : num.toString();
  var decimalInd = n.indexOf('.');
  var intPart = decimalInd !== -1 ? n.substring(0, decimalInd) : n;
  var decPart = decimalInd !== -1 ? n.substring(decimalInd + 1) : '';
  var str = neg ? '-' : '';
  if (typeof right !== 'undefined') {
    var decimal = '';
    if (decimalInd !== -1 || right - decPart.length > 0) {
      decimal = '.';
    }
    if (decPart.length > right) {
      decPart = decPart.substring(0, right);
    }
    for (var i = 0; i < left - intPart.length; i++) {
      str += '0';
    }
    str += intPart;
    str += decimal;
    str += decPart;
    for (var j = 0; j < right - decPart.length; j++) {
      str += '0';
    }
    return str;
  } else {
    for (var k = 0; k < Math.max(left - intPart.length, 0); k++) {
      str += '0';
    }
    str += n;
    return str;
  }
}

/**
 * Utility function for formatting numbers into strings and placing
 * appropriate commas to mark units of 1000. There are two versions: one
 * for formatting ints, and one for formatting an array of ints. The value
 * for the right parameter should always be a positive integer.
 *
 * @method nfc
 * @param  {Number|String}   num     the Number to format
 * @param  {Integer|String}  [right] number of digits to the right of the
 *                                  decimal point
 * @return {String}           formatted String
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   var num = 11253106.115;
 *   var numArr = [1, 1, 2];
 *
 *   noStroke();
 *   fill(0);
 *   textSize(12);
 *
 *   // Draw formatted numbers
 *   text(nfc(num, 4), 10, 30);
 *   text(nfc(numArr, 2), 10, 80);
 *
 *   // Draw dividing line
 *   stroke(120);
 *   line(0, 50, width, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * "11,253,106.115" top middle and "1.00,1.00,2.00" displayed bottom mid
 */
/**
 * @method nfc
 * @param  {Array}    nums     the Numbers to format
 * @param  {Integer|String}  [right]
 * @return {String[]}           formatted Strings
 */
p5.prototype.nfc = function(num, right) {
  p5._validateParameters('nfc', arguments);
  if (num instanceof Array) {
    return num.map(function(x) {
      return doNfc(x, right);
    });
  } else {
    return doNfc(num, right);
  }
};
function doNfc(num, right) {
  num = num.toString();
  var dec = num.indexOf('.');
  var rem = dec !== -1 ? num.substring(dec) : '';
  var n = dec !== -1 ? num.substring(0, dec) : num;
  n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (right === 0) {
    rem = '';
  } else if (typeof right !== 'undefined') {
    if (right > rem.length) {
      rem += dec === -1 ? '.' : '';
      var len = right - rem.length + 1;
      for (var i = 0; i < len; i++) {
        rem += '0';
      }
    } else {
      rem = rem.substring(0, right + 1);
    }
  }
  return n + rem;
}

/**
 * Utility function for formatting numbers into strings. Similar to <a href="#/p5/nf">nf()</a> but
 * puts a "+" in front of positive numbers and a "-" in front of negative
 * numbers. There are two versions: one for formatting floats, and one for
 * formatting ints. The values for left, and right parameters
 * should always be positive integers.
 *
 * @method nfp
 * @param {Number} num      the Number to format
 * @param {Integer}      [left]   number of digits to the left of the decimal
 *                                point
 * @param {Integer}      [right]  number of digits to the right of the
 *                                decimal point
 * @return {String}         formatted String
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *   var num1 = 11253106.115;
 *   var num2 = -11253106.115;
 *
 *   noStroke();
 *   fill(0);
 *   textSize(12);
 *
 *   // Draw formatted numbers
 *   text(nfp(num1, 4, 2), 10, 30);
 *   text(nfp(num2, 4, 2), 10, 80);
 *
 *   // Draw dividing line
 *   stroke(120);
 *   line(0, 50, width, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * "+11253106.11" top middle and "-11253106.11" displayed bottom middle
 */
/**
 * @method nfp
 * @param {Number[]} nums      the Numbers to format
 * @param {Integer}      [left]
 * @param {Integer}      [right]
 * @return {String[]}         formatted Strings
 */
p5.prototype.nfp = function() {
  p5._validateParameters('nfp', arguments);
  var nfRes = p5.prototype.nf.apply(this, arguments);
  if (nfRes instanceof Array) {
    return nfRes.map(addNfp);
  } else {
    return addNfp(nfRes);
  }
};

function addNfp(num) {
  return parseFloat(num) > 0 ? '+' + num.toString() : num.toString();
}

/**
 * Utility function for formatting numbers into strings. Similar to <a href="#/p5/nf">nf()</a> but
 * puts an additional "_" (space) in front of positive numbers just in case to align it with negative
 * numbers which includes "-" (minus) sign.
 * The main usecase of nfs() can be seen when one wants to align the digits (place values) of a non-negative
 * number with some negative number (See the example to get a clear picture).
 * There are two versions: one for formatting float, and one for formatting int.
 * The values for the digits, left, and right parameters should always be positive integers.
 * (IMP): The result on the canvas basically the expected alignment can vary based on the typeface you are using.
 * (NOTE): Be cautious when using left and right parameters as it prepends numbers of 0's if the parameter
 * if greater than the current length of the number.
 * For example if number is 123.2 and left parameter passed is 4 which is greater than length of 123
 * (integer part) i.e 3 than result will be 0123.2. Same case for right parameter i.e. if right is 3 than
 * the result will be 123.200.
 *
 * @method nfs
 * @param {Number}       num      the Number to format
 * @param {Integer}      [left]   number of digits to the left of the decimal
 *                                point
 * @param {Integer}      [right]  number of digits to the right of the
 *                                decimal point
 * @return {String}         formatted String
 *
 * @example
 * <div>
 * <code>
 * var myFont;
 * function preload() {
 *   myFont = loadFont('assets/fonts/inconsolata.ttf');
 * }
 * function setup() {
 *   background(200);
 *   var num1 = 321;
 *   var num2 = -1321;
 *
 *   noStroke();
 *   fill(0);
 *   textFont(myFont);
 *   textSize(22);
 *
 *   // nfs() aligns num1 (positive number) with num2 (negative number) by
 *   // adding a blank space in front of the num1 (positive number)
 *   // [left = 4] in num1 add one 0 in front, to align the digits with num2
 *   // [right = 2] in num1 and num2 adds two 0's after both numbers
 *   // To see the differences check the example of nf() too.
 *   text(nfs(num1, 4, 2), 10, 30);
 *   text(nfs(num2, 4, 2), 10, 80);
 *   // Draw dividing line
 *   stroke(120);
 *   line(0, 50, width, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * "0321.00" top middle and "-1321.00" displayed bottom middle
 */
/**
 * @method nfs
 * @param {Array}        nums     the Numbers to format
 * @param {Integer}      [left]
 * @param {Integer}      [right]
 * @return {String[]}         formatted Strings
 */
p5.prototype.nfs = function() {
  p5._validateParameters('nfs', arguments);
  var nfRes = p5.prototype.nf.apply(this, arguments);
  if (nfRes instanceof Array) {
    return nfRes.map(addNfs);
  } else {
    return addNfs(nfRes);
  }
};

function addNfs(num) {
  return parseFloat(num) >= 0 ? ' ' + num.toString() : num.toString();
}

/**
 * The <a href="#/p5/split">split()</a> function maps to String.split(), it breaks a String into
 * pieces using a character or string as the delimiter. The delim parameter
 * specifies the character or characters that mark the boundaries between
 * each piece. A String[] array is returned that contains each of the pieces.
 *
 * The <a href="#/p5/splitTokens">splitTokens()</a> function works in a similar fashion, except that it
 * splits using a range of characters instead of a specific character or
 * sequence.
 *
 * @method split
 * @param  {String} value the String to be split
 * @param  {String} delim the String used to separate the data
 * @return {String[]}  Array of Strings
 * @example
 * <div>
 * <code>
 * var names = 'Pat,Xio,Alex';
 * var splitString = split(names, ',');
 * text(splitString[0], 5, 30);
 * text(splitString[1], 5, 50);
 * text(splitString[2], 5, 70);
 * </code>
 * </div>
 *
 * @alt
 * "pat" top left, "Xio" mid left and "Alex" displayed bottom left
 *
 */
p5.prototype.split = function(str, delim) {
  p5._validateParameters('split', arguments);
  return str.split(delim);
};

/**
 * The <a href="#/p5/splitTokens">splitTokens()</a> function splits a String at one or many character
 * delimiters or "tokens." The delim parameter specifies the character or
 * characters to be used as a boundary.
 * <br><br>
 * If no delim characters are specified, any whitespace character is used to
 * split. Whitespace characters include tab (\t), line feed (\n), carriage
 * return (\r), form feed (\f), and space.
 *
 * @method splitTokens
 * @param  {String} value   the String to be split
 * @param  {String} [delim] list of individual Strings that will be used as
 *                          separators
 * @return {String[]}          Array of Strings
 * @example
 * <div class = "norender">
 * <code>
 * function setup() {
 *   var myStr = 'Mango, Banana, Lime';
 *   var myStrArr = splitTokens(myStr, ',');
 *
 *   print(myStrArr); // prints : ["Mango"," Banana"," Lime"]
 * }
 * </code>
 * </div>
 */
p5.prototype.splitTokens = function(value, delims) {
  p5._validateParameters('splitTokens', arguments);
  var d;
  if (typeof delims !== 'undefined') {
    var str = delims;
    var sqc = /\]/g.exec(str);
    var sqo = /\[/g.exec(str);
    if (sqo && sqc) {
      str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
      sqo = /\[/g.exec(str);
      str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
      d = new RegExp('[\\[' + str + '\\]]', 'g');
    } else if (sqc) {
      str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
      d = new RegExp('[' + str + '\\]]', 'g');
    } else if (sqo) {
      str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
      d = new RegExp('[' + str + '\\[]', 'g');
    } else {
      d = new RegExp('[' + str + ']', 'g');
    }
  } else {
    d = /\s/g;
  }
  return value.split(d).filter(function(n) {
    return n;
  });
};

/**
 * Removes whitespace characters from the beginning and end of a String. In
 * addition to standard whitespace characters such as space, carriage return,
 * and tab, this function also removes the Unicode "nbsp" character.
 *
 * @method trim
 * @param  {String} str a String to be trimmed
 * @return {String}       a trimmed String
 *
 * @example
 * <div>
 * <code>
 * var string = trim('  No new lines\n   ');
 * text(string + ' here', 2, 50);
 * </code>
 * </div>
 *
 * @alt
 * "No new lines here" displayed center canvas
 */
/**
 * @method trim
 * @param  {Array} strs an Array of Strings to be trimmed
 * @return {String[]}   an Array of trimmed Strings
 */
p5.prototype.trim = function(str) {
  p5._validateParameters('trim', arguments);
  if (str instanceof Array) {
    return str.map(this.trim);
  } else {
    return str.trim();
  }
};

export default p5;
