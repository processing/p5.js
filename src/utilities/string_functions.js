/**
 * @module Data
 * @submodule String Functions
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import '../core/friendly_errors/validate_params';
import '../core/friendly_errors/file_errors';
import '../core/friendly_errors/fes_core';

//return p5; //LM is this a mistake?

/**
 * Combines an array of strings into one string.
 *
 * The first parameter, `list`, is the array of strings to join.
 *
 * The second parameter, `separator`, is the character(s) that should be used
 * to separate the combined strings. For example, calling
 * `join(myWords, ' : ')` would return a string of words each separated by a
 * colon and spaces.
 *
 * @method join
 * @param  {Array}  list array of strings to combine.
 * @param  {String} separator character(s) to place between strings when they're combined.
 * @return {String} combined string.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create an array of strings.
 *   let myWords = ['one', 'two', 'three'];
 *
 *   // Create a combined string
 *   let combined = join(myWords, ' : ');
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *
 *   // Display the combined string.
 *   text(combined, 50, 50);
 *
 *   describe('The text "one : two : three" written in black on a gray canvas.');
 * }
 * </code>
 * </div>
 */
p5.prototype.join = function(list, separator) {
  p5._validateParameters('join', arguments);
  return list.join(separator);
};

/**
 * Applies a regular expression to a string and returns an array with the
 * first match.
 *
 * `match()` uses regular expressions (regex) to match patterns in text. For
 * example, the regex `abc` can be used to search a string for the exact
 * sequence of characters `abc`. See
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#tools" target="_blank">MDN</a>.
 * for more information about regexes.
 *
 * The first parameter, `str`, is the string to search.
 *
 * The second parameter, `regex`, is a string with the regular expression to
 * apply. For example, calling `match('Hello, p5*js!', '[a-z][0-9]')` would
 * return the array `['p5']`.
 *
 * Note: If no matches are found, `null` is returned.
 *
 * @method match
 * @param  {String} str string to search.
 * @param  {String} regexp regular expression to match.
 * @return {String[]} match if found.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a string variable.
 *   let string = 'Hello, p5*js!';
 *
 *   // Match the characters that are lowercase
 *   // letters followed by digits.
 *   let matches = match(string, '[a-z][0-9]');
 *
 *   // Print the matches array to the console:
 *   // ['p5']
 *   print(matches);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(16);
 *
 *   // Display the matches.
 *   text(matches, 50, 50);
 *
 *   describe('The text "p5" written in black on a gray canvas.');
 * }
 * </code>
 * </div>
 */
p5.prototype.match = function(str, reg) {
  p5._validateParameters('match', arguments);
  return str.match(reg);
};

/**
 * Applies a regular expression to a string and returns an array of matches.
 *
 * `match()` uses regular expressions (regex) to match patterns in text. For
 * example, the regex `abc` can be used to search a string for the exact
 * sequence of characters `abc`. See
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#tools" target="_blank">MDN</a>.
 * for more information about regexes. `matchAll()` is different from
 * <a href="#/p5/match">match()</a> because it returns every match, not just
 * the first.
 *
 * The first parameter, `str`, is the string to search.
 *
 * The second parameter, `regex`, is a string with the regular expression to
 * apply. For example, calling
 * `matchAll('p5*js is easier than abc123', '[a-z][0-9]')` would return the
 * 2D array `[['p5'], ['c1']]`.
 *
 * Note: If no matches are found, an empty array `[]` is returned.
 *
 * @method matchAll
 * @param  {String} str string to search.
 * @param  {String} regexp regular expression to match.
 * @return {String[]} matches found.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a string variable.
 *   let string = 'p5*js is easier than abc123';
 *
 *   // Match the character sequences that are
 *   // lowercase letters followed by digits.
 *   let matches = matchAll(string, '[a-z][0-9]');
 *
 *   // Print the matches array to the console:
 *   // [['p5'], ['c1']]
 *   print(matches);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(16);
 *
 *   // Iterate over the matches array.
 *   for (let i = 0; i < matches.length; i += 1) {
 *
 *     // Calculate the y-coordainate.
 *     let y = (i + 1) * 33;
 *
 *     // Display the match.
 *     text(matches[i], 50, y);
 *   }
 *
 *   describe(
 *     'The text "p5" and "c1" written on separate lines. The text is black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 */
p5.prototype.matchAll = function(str, reg) {
  p5._validateParameters('matchAll', arguments);
  const re = new RegExp(reg, 'g');
  let match = re.exec(str);
  const matches = [];
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
 * Converts a `Number` into a `String` with a given number of digits.
 *
 * `nf()` converts numbers such as `123.45` into strings formatted with a set
 * number of digits, as in `'123.4500'`.
 *
 * The first parameter, `num`, is the number to convert to a string. For
 * example, calling `nf(123.45)` returns the string `'123.45'`. If an array of
 * numbers is passed, as in `nf([123.45, 67.89])`, an array of formatted
 * strings will be returned.
 *
 * The second parameter, `left`, is optional. If a number is passed, as in
 * `nf(123.45, 4)`, it sets the minimum number of digits to include to the
 * left of the decimal place. If `left` is larger than the number of digits in
 * `num`, then unused digits will be set to 0. For example, calling
 * `nf(123.45, 4)` returns the string `'0123.45'`.
 *
 * The third parameter, `right`, is also optional. If a number is passed, as
 * in `nf(123.45, 4, 1)`, it sets the minimum number of digits to include to
 * the right of the decimal place. If `right` is smaller than the number of
 * decimal places in `num`, then `num` will be rounded to the given number of
 * decimal places. For example, calling `nf(123.45, 4, 1)` returns the string
 * `'0123.5'`. If right is larger than the number of decimal places in `num`,
 * then unused decimal places will be set to 0. For example, calling
 * `nf(123.45, 4, 3)` returns the string `'0123.450'`.
 *
 * When the number is negative, for example, calling `nf(-123.45, 5, 2)`
 * returns the string `'-00123.45'`.
 *
 * @method nf
 * @param {Number|String} num number to format.
 * @param {Integer|String} [left] number of digits to include to the left of
 *                                the decimal point.
 * @param {Integer|String} [right] number of digits to include to the right
 *                                 of the decimal point.
 * @return {String} formatted string.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textSize(16);
 *
 *   // Create a number variable.
 *   let number = 123.45;
 *
 *   // Display the number as a string.
 *   let formatted = nf(number);
 *   text(formatted, 20, 20);
 *
 *   let negative = nf(-number, 4, 2);
 *   text(negative, 20, 40);
 *
 *   // Display the number with four digits
 *   // to the left of the decimal.
 *   let left = nf(number, 4);
 *   text(left, 20, 60);
 *
 *   // Display the number with four digits
 *   // to the left of the decimal and one
 *   // to the right.
 *   let right = nf(number, 4, 1);
 *   text(right, 20, 80);
 *
 *   describe(
 *     'The numbers "123.45", "-0123.45", "0123.45", and "0123.5" written on four separate lines. The text is in black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 */
/**
 * @method nf
 * @param {Number[]} nums numbers to format.
 * @param {Integer|String} [left]
 * @param {Integer|String} [right]
 * @return {String[]} formatted strings.
 */
p5.prototype.nf = function(nums, left, right) {
  p5._validateParameters('nf', arguments);
  if (nums instanceof Array) {
    return nums.map(x => doNf(x, left, right));
  } else {
    const typeOfFirst = Object.prototype.toString.call(nums);
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
  let isNegative = num < 0;
  num = Math.abs(num);
  let [leftPart, rightPart] = num.toString().split('.');


  if (typeof right === 'undefined') {
    leftPart = leftPart.padStart(left, '0');
    let result = rightPart ? leftPart + '.' + rightPart : leftPart;
    return isNegative ? '-' + result : result;
  } else {
    let roundedOff = num.toFixed(right);
    [leftPart, rightPart] = roundedOff.toString().split('.');
    leftPart = leftPart.padStart(left, '0');
    let result = typeof rightPart === 'undefined' ? leftPart : leftPart + '.' + rightPart;
    return isNegative ? '-' + result : result;
  }
}

/**
 * Converts a `Number` into a `String` with commas to mark units of 1,000.
 *
 * `nfc()` converts numbers such as 12345 into strings formatted with commas
 * to mark the thousands place, as in `'12,345'`.
 *
 * The first parameter, `num`, is the number to convert to a string. For
 * example, calling `nfc(12345)` returns the string `'12,345'`.
 *
 * The second parameter, `right`, is optional. If a number is passed, as in
 * `nfc(12345, 1)`, it sets the minimum number of digits to include to the
 * right of the decimal place. If `right` is smaller than the number of
 * decimal places in `num`, then `num` will be rounded to the given number of
 * decimal places. For example, calling `nfc(12345.67, 1)` returns the string
 * `'12,345.7'`. If `right` is larger than the number of decimal places in
 * `num`, then unused decimal places will be set to 0. For example, calling
 * `nfc(12345.67, 3)` returns the string `'12,345.670'`.
 *
 * @method nfc
 * @param  {Number|String} num number to format.
 * @param  {Integer|String} [right] number of digits to include to the right
 *                                  of the decimal point.
 * @return {String} formatted string.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textSize(16);
 *
 *   // Create a number variable.
 *   let number = 12345;
 *
 *   // Display the number as a string.
 *   let commas = nfc(number);
 *   text(commas, 15, 33);
 *
 *   // Display the number with four digits
 *   // to the left of the decimal.
 *   let decimals = nfc(number, 2);
 *   text(decimals, 15, 67);
 *
 *   describe(
 *     'The numbers "12,345" and "12,345.00" written on separate lines. The text is in black on a gray background.'
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
 *   // Create an array of numbers.
 *   let numbers = [12345, 6789];
 *
 *   // Convert the numbers to formatted strings.
 *   let formatted = nfc(numbers);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(14);
 *
 *   // Iterate over the array.
 *   for (let i = 0; i < formatted.length; i += 1) {
 *
 *     // Calculate the y-coordinate.
 *     let y = (i + 1) * 33;
 *
 *     // Display the original and formatted numbers.
 *     text(`${numbers[i]} : ${formatted[i]}`, 50, y);
 *   }
 *
 *   describe(
 *     'The text "12345 : 12,345" and "6789 : 6,789" written on two separate lines. The text is in black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 */
/**
 * @method nfc
 * @param  {Number[]} nums numbers to format.
 * @param  {Integer|String} [right]
 * @return {String[]} formatted strings.
 */
p5.prototype.nfc = function(num, right) {
  p5._validateParameters('nfc', arguments);
  if (num instanceof Array) {
    return num.map(x => doNfc(x, right));
  } else {
    return doNfc(num, right);
  }
};
function doNfc(num, right) {
  num = num.toString();
  const dec = num.indexOf('.');
  let rem = dec !== -1 ? num.substring(dec) : '';
  let n = dec !== -1 ? num.substring(0, dec) : num;
  n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (right === 0) {
    rem = '';
  } else if (typeof right !== 'undefined') {
    if (right > rem.length) {
      rem += dec === -1 ? '.' : '';
      const len = right - rem.length + 1;
      for (let i = 0; i < len; i++) {
        rem += '0';
      }
    } else {
      rem = rem.substring(0, right + 1);
    }
  }
  return n + rem;
}

/**
 * Converts a `Number` into a `String` with a plus or minus sign.
 *
 * `nfp()` converts numbers such as 123 into strings formatted with a `+` or
 * `-` symbol to mark whether they're positive or negative, as in `'+123'`.
 *
 * The first parameter, `num`, is the number to convert to a string. For
 * example, calling `nfp(123.45)` returns the string `'+123.45'`. If an array
 * of numbers is passed, as in `nfp([123.45, -6.78])`, an array of formatted
 * strings will be returned.
 *
 * The second parameter, `left`, is optional. If a number is passed, as in
 * `nfp(123.45, 4)`, it sets the minimum number of digits to include to the
 * left of the decimal place. If `left` is larger than the number of digits in
 * `num`, then unused digits will be set to 0. For example, calling
 * `nfp(123.45, 4)` returns the string `'+0123.45'`.
 *
 * The third parameter, `right`, is also optional. If a number is passed, as
 * in `nfp(123.45, 4, 1)`, it sets the minimum number of digits to include to
 * the right of the decimal place. If `right` is smaller than the number of
 * decimal places in `num`, then `num` will be rounded to the given number of
 * decimal places.  For example, calling `nfp(123.45, 4, 1)` returns the
 * string `'+0123.5'`. If `right` is larger than the number of decimal places
 * in `num`, then unused decimal places will be set to 0.  For example,
 * calling `nfp(123.45, 4, 3)` returns the string `'+0123.450'`.
 *
 * @method nfp
 * @param {Number} num number to format.
 * @param {Integer} [left] number of digits to include to the left of the
 *                         decimal point.
 * @param {Integer} [right] number of digits to include to the right of the
 *                          decimal point.
 * @return {String} formatted string.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create number variables.
 *   let positive = 123;
 *   let negative = -123;
 *
 *   // Convert the positive number to a formatted string.
 *   let p = nfp(positive);
 *
 *   // Convert the negative number to a formatted string
 *   // with four digits to the left of the decimal
 *   // and two digits to the right of the decimal.
 *   let n = nfp(negative, 4, 2);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(14);
 *
 *   // Display the original and formatted numbers.
 *   text(`${positive} : ${p}`, 50, 33);
 *   text(`${negative} : ${n}`, 50, 67);
 *
 *   describe(
 *     'The text "123 : +123" and "-123 : -123.00" written on separate lines. The text is in black on a gray background.'
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
 *   // Create number variables.
 *   let numbers = [123, -4.56];
 *
 *   // Convert the numbers to formatted strings
 *   // with four digits to the left of the decimal
 *   // and one digit to the right of the decimal.
 *   let formatted = nfp(numbers, 4, 1);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(14);
 *
 *   // Iterate over the array.
 *   for (let i = 0; i < formatted.length; i += 1) {
 *
 *     // Calculate the y-coordinate.
 *     let y = (i + 1) * 33;
 *
 *     // Display the original and formatted numbers.
 *     text(`${numbers[i]} : ${formatted[i]}`, 50, y);
 *   }
 *
 *   describe(
 *     'The text "123 : +0123.0" and "-4.56 : 00-4.6" written on separate lines. The text is in black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 */
/**
 * @method nfp
 * @param {Number[]} nums numbers to format.
 * @param {Integer} [left]
 * @param {Integer} [right]
 * @return {String[]} formatted strings.
 */
p5.prototype.nfp = function(...args) {
  p5._validateParameters('nfp', args);
  const nfRes = p5.prototype.nf.apply(this, args);
  if (nfRes instanceof Array) {
    return nfRes.map(addNfp);
  } else {
    return addNfp(nfRes);
  }
};

function addNfp(num) {
  return parseFloat(num) > 0 ? `+${num.toString()}` : num.toString();
}

/**
 * Converts a positive `Number` into a `String` with an extra space in front.
 *
 * `nfs()` converts positive numbers such as 123.45 into strings formatted
 * with an extra space in front, as in ' 123.45'. Doing so can be helpful for
 * aligning positive and negative numbers.
 *
 * The first parameter, `num`, is the number to convert to a string. For
 * example, calling `nfs(123.45)` returns the string `' 123.45'`.
 *
 * The second parameter, `left`, is optional. If a number is passed, as in
 * `nfs(123.45, 4)`, it sets the minimum number of digits to include to the
 * left of the decimal place. If `left` is larger than the number of digits in
 * `num`, then unused digits will be set to 0. For example, calling
 * `nfs(123.45, 4)` returns the string `' 0123.45'`.
 *
 * The third parameter, `right`, is also optional. If a number is passed, as
 * in `nfs(123.45, 4, 1)`, it sets the minimum number of digits to include to
 * the right of the decimal place. If `right` is smaller than the number of
 * decimal places in `num`, then `num` will be rounded to the given number of
 * decimal places.  For example, calling `nfs(123.45, 4, 1)` returns the
 * string `' 0123.5'`. If `right` is larger than the number of decimal places
 * in `num`, then unused decimal places will be set to 0.  For example,
 * calling `nfs(123.45, 4, 3)` returns the string `' 0123.450'`.
 *
 * @method nfs
 * @param {Number} num number to format.
 * @param {Integer} [left] number of digits to include to the left of the
 *                         decimal point.
 * @param {Integer} [right] number of digits to include to the right of the
 *                          decimal point.
 * @return {String} formatted string.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create number variables.
 *   let positive = 123;
 *   let negative = -123;
 *
 *   // Convert the positive number to a formatted string.
 *   let formatted = nfs(positive);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(16);
 *
 *   // Display the negative number and the formatted positive number.
 *   text(negative, 50, 33);
 *   text(formatted, 50, 67);
 *
 *   describe(
 *     'The numbers -123 and 123 written on separate lines. The numbers align vertically. The text is in black on a gray background.'
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
 *   // Create a number variable.
 *   let number = 123.45;
 *
 *   // Convert the positive number to a formatted string.
 *   // Use four digits to the left of the decimal and
 *   // one digit to the right.
 *   let formatted = nfs(number, 4, 1);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(16);
 *
 *   // Display a negative version of the number and
 *   // the formatted positive version.
 *   text('-0123.5', 50, 33);
 *   text(formatted, 50, 67);
 *
 *   describe(
 *     'The numbers "-0123.5" and "0123.5" written on separate lines. The numbers align vertically. The text is in black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 */
/**
 * @method nfs
 * @param {Array} nums numbers to format.
 * @param {Integer} [left]
 * @param {Integer} [right]
 * @return {String[]} formatted strings.
 */
p5.prototype.nfs = function(...args) {
  p5._validateParameters('nfs', args);
  const nfRes = p5.prototype.nf.apply(this, args);
  if (nfRes instanceof Array) {
    return nfRes.map(addNfs);
  } else {
    return addNfs(nfRes);
  }
};

function addNfs(num) {
  return parseFloat(num) >= 0 ? ` ${num.toString()}` : num.toString();
}

/**
 * Splits a `String` into pieces and returns an array containing the pieces.
 *
 * The first parameter, `value`, is the string to split.
 *
 * The second parameter, `delim`, is the character(s) that should be used to
 * split the string. For example, calling
 * `split('rock...paper...scissors', '...')` would return the array
 * `['rock', 'paper', 'scissors']` because there are three periods `...`
 * between each word.
 *
 * @method split
 * @param  {String} value the String to be split
 * @param  {String} delim the String used to separate the data
 * @return {String[]}  Array of Strings
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a string variable.
 *   let string = 'rock...paper...scissors';
 *
 *   // Split the string at each ...
 *   let words = split(string, '...');
 *
 *   // Print the array to the console:
 *   // ["rock", "paper", "scissors"]
 *   print(words);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(16);
 *
 *   // Iterate over the words array.
 *   for (let i = 0; i < words.length; i += 1) {
 *
 *     // Calculate the y-coordinate.
 *     let y = (i + 1) * 25;
 *
 *     // Display the word.
 *     text(words[i], 50, y);
 *   }
 *
 *   describe(
 *     'The words "rock", "paper", and "scissors" written on separate lines. The text is black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 */
p5.prototype.split = function(str, delim) {
  p5._validateParameters('split', arguments);
  return str.split(delim);
};

/**
 * Splits a `String` into pieces and returns an array containing the pieces.
 *
 * `splitTokens()` is an enhanced version of
 * <a href="#/p5/split">split()</a>. It can split a string when any characters
 * from a list are detected.
 *
 * The first parameter, `value`, is the string to split.
 *
 * The second parameter, `delim`, is optional. It sets the character(s) that
 * should be used to split the string. `delim` can be a single string, as in
 * `splitTokens('rock...paper...scissors...shoot', '...')`, or an array of
 * strings, as in
 * `splitTokens('rock;paper,scissors...shoot, [';', ',', '...'])`. By default,
 * if no `delim` characters are specified, then any whitespace character is
 * used to split. Whitespace characters include tab (`\t`), line feed (`\n`),
 * carriage return (`\r`), form feed (`\f`), and space.
 *
 * @method splitTokens
 * @param  {String} value string to split.
 * @param  {String} [delim] character(s) to use for splitting the string.
 * @return {String[]} separated strings.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a string variable.
 *   let string = 'rock paper scissors shoot';
 *
 *   // Split the string at each space.
 *   let words = splitTokens(string);
 *
 *   // Print the array to the console.
 *   print(words);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Iterate over the words array.
 *   for (let i = 0; i < words.length; i += 1) {
 *
 *     // Calculate the y-coordinate.
 *     let y = (i + 1) * 20;
 *
 *     // Display the word.
 *     text(words[i], 50, y);
 *   }
 *
 *   describe(
 *     'The words "rock", "paper", "scissors", and "shoot" written on separate lines. The text is black on a gray background.'
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
 *   // Create a string variable.
 *   let string = 'rock...paper...scissors...shoot';
 *
 *   // Split the string at each ...
 *   let words = splitTokens(string, '...');
 *
 *   // Print the array to the console.
 *   print(words);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Iterate over the words array.
 *   for (let i = 0; i < words.length; i += 1) {
 *
 *     // Calculate the y-coordinate.
 *     let y = (i + 1) * 20;
 *
 *     // Display the word.
 *     text(words[i], 50, y);
 *   }
 *
 *   describe(
 *     'The words "rock", "paper", "scissors", and "shoot" written on separate lines. The text is black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div class='notest'>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a string variable.
 *   let string = 'rock;paper,scissors...shoot';
 *
 *   // Split the string at each semicolon, comma, or ...
 *   let words = splitTokens(string, [';', ',', '...']);
 *
 *   // Print the array to the console.
 *   print(words);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Iterate over the words array.
 *   for (let i = 0; i < words.length; i += 1) {
 *
 *     // Calculate the y-coordinate.
 *     let y = (i + 1) * 20;
 *
 *     // Display the word.
 *     text(words[i], 50, y);
 *   }
 *
 *   describe(
 *     'The words "rock", "paper", "scissors", and "shoot" written on separate lines. The text is black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 */
p5.prototype.splitTokens = function(value, delims) {
  p5._validateParameters('splitTokens', arguments);
  let d;
  if (typeof delims !== 'undefined') {
    let str = delims;
    const sqc = /\]/g.exec(str);
    let sqo = /\[/g.exec(str);
    if (sqo && sqc) {
      str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
      sqo = /\[/g.exec(str);
      str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
      d = new RegExp(`[\\[${str}\\]]`, 'g');
    } else if (sqc) {
      str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
      d = new RegExp(`[${str}\\]]`, 'g');
    } else if (sqo) {
      str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
      d = new RegExp(`[${str}\\[]`, 'g');
    } else {
      d = new RegExp(`[${str}]`, 'g');
    }
  } else {
    d = /\s/g;
  }
  return value.split(d).filter(n => n);
};

/**
 * Removes whitespace from the start and end of a `String` without changing the middle.
 *
 * `trim()` trims
 * <a href="https://developer.mozilla.org/en-US/docs/Glossary/whitespace" target="_blank">whitespace characters</a>
 * such as spaces, carriage returns, tabs, Unicode "nbsp" character.
 *
 * The parameter, `str`, is the string to trim. If a single string is passed,
 * as in `trim('   pad   ')`, a single string is returned. If an array of
 * strings is passed, as in `trim(['    pad   ', '\n space \n'])`, an array of
 * strings is returned.
 *
 * @method trim
 * @param  {String} str string to trim.
 * @return {String} trimmed string.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a string variable.
 *   let string = '   p5*js   ';
 *
 *   // Trim the whitespace.
 *   let trimmed = trim(string);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(16);
 *
 *   // Display the text.
 *   text(`Hello, ${trimmed}!`, 50, 50);
 *
 *   describe('The text "Hello, p5*js!" written in black on a gray background.');
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
 *   // Create an array of strings.
 *   let strings = ['   wide  ', '\n  open  ', '\n spaces  '];
 *
 *   // Trim the whitespace.
 *   let trimmed = trim(strings);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(10);
 *
 *   // Display the text.
 *   text(`${trimmed[0]} ${trimmed[1]} ${trimmed[2]}`, 50, 50);
 *
 *   describe('The text "wide open spaces" written in black on a gray background.');
 * }
 * </code>
 * </div>
 */
/**
 * @method trim
 * @param  {String[]} strs strings to trim.
 * @return {String[]} trimmed strings.
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
