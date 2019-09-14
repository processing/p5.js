/**
 * @module Foundation
 * @submodule Declaration
 * @for p5
 */

/**
 * Declares a block scope local variable, optionally initializing it to a value.
 * @property let
 *
 * @example
 * <div>
 * <code>
 * let x = 2;
 * console.log(x); // prints 2 to the console
 * x = 1;
 * console.log(x); // prints 1 to the console
 * </code>
 * </div>
 */

/**
 * Declares a read-only named constant.
 * Constants are block-scoped, much like variables defined using the 'let' statement.
 * The value of a constant can't be changed through reassignment, and it can't be redeclared.
 * @property const
 *
 * @example
 * <div>
 * <code>
 * //define MY_FAV as a constant and give it the value 7
 * const MY_FAV = 7;
 * console.log('my favorite number is: ' + MY_FAV);
 * </code>
 * </div>
 */

/**
 * @submodule Control Statement
 */

/**
 * The 'if' statement executes a statement if a specified condition is truthy.
 * If the condition is falsy, another statement can be executed
 * @property if-else
 *
 * @example
 * <div>
 * <code>
 * let a = 4;
 * if (a > 0) {
 *   console.log('positive');
 * } else {
 *   console.log('negative');
 * }
 * </code>
 * </div>
 */

/**
 * @submodule Function
 */

/**
 * Declares a function with the specified parameters.
 * @property function
 *
 * @example
 * <div>
 * <code>
 * function calRectArea(width, height) {
 *   return width * height;
 * }
 * calRectArea(4, 5); //calling the function
 * </code>
 * </div>
 */

/**
 * Specifies the value to be returned by a function.
 * @property return
 *
 * @example
 * <div>
 * <code>
 * function calSquare(x) {
 *   return x * x;
 * }
 * calSquare(4); //return 16
 * </code>
 * </div>
 */

/**
 * @submodule Class
 */

/**
 * The class declaration creates a new class with a given name using prototype-based inheritance.
 * @property class
 *
 * @example
 * <div>
 * <code>
 * class S1 {
 *   constructor(height, width) {
 *     this.name = 'Polygon';
 *     this.height = height;
 *     this.width = width;
 *   }
 * }
 * var poly = new S1(4, 5); //creating new instance of Polygon Class.
 * console.log(poly.name);
 * </code>
 * </div>
 */

/**
 * @submodule Iterative Statement
 */

/**
 * Creates a loop that executes a specified statement until the test condition evaluates to false.
 * The condition is evaluated after executing the statement, resulting in the specified statement executing at least once.
 * @property for
 *
 * @example
 * <div>
 * <code>
 * for (var i = 0; i < 9; i++) {
 *   console.log(i);
 *   // more statements
 * }
 * </code>
 * </div>
 */

/**
 * It Creates a loop that executes a specified statement until the test condition evaluates to false.
 * The condition is evaluated after executing the statement, resulting in the specified statement
 * executing at least once.
 * @property  do..while
 *
 * @example
 * <div>
 * <code>
 * var result = '';
 * var i = 0;
 * do {
 *   i += 1;
 *   result += i + ' ';
 * } while (i > 0 && i < 5);
 * console.log(result); //'1 2 3 4 5 '
 * <code>
 * </div>
 */

/**
 * Iterates over the enumerable properties of an object, in arbitrary order.
 * For each distinct property, statements can be executed.
 * @property for..in
 *
 * @example
 * <div>
 * <code>
 * var person = { fname: 'John', lname: 'Doe', age: 25 };
 * var text = '';
 * var x;
 * for (x in person) {
 *   text += person[x] + '';
 * }
 * console.log(text); //'John Doe 25 '
 * </code>
 * </div>
 */

/**
 * Iterates over iterable objects (including arrays, array-like objects, iterators and generators),
 * invoking a custom iteration hook with statements to be executed for the value of each distinct property.
 * @property for..of
 *
 * @example
 * <div>
 * <code>
 * let word = 'boo';
 * for (let value of word) {
 *   console.log(value);
 * }
 * </code>
 * </div>
 */

/**
 * @submodule JS Method
 */

/**
 * The parseInt() function parses a string argument and
 * returns an integer of the specified radix (the base in mathematical numeral systems).
 * @method parseInt
 *
 * @example
 * <div>
 * <code>
 * parseInt('F', 16);
 * parseInt(21, 8);
 * </code>
 * </div>
 */

/**
 * The JSON.stringify() method converts a JavaScript object or value to a JSON string.
 * @method JSON.stringify
 * @param {Object} object :Javascript object that you would like to convert to JSON
 *
 * @example
 * <div>
 * <code>
 * JSON.stringify('foo'); // '"foo"'
 * JSON.stringify([1, 'false', false]); //'[1,"false",false]'
 * JSON.stringify([NaN, null, Infinity]); //'[null,null,null]'
 * </code>
 * </div>
 */
