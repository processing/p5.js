/**
 * @module Foundation
 * @submodule Declaration
 * @for p5
 */

/**
 * Declares a block scope local variable,optionally initializing it to a value.
 * @property let
 * @example
 * <div>
 * <code>
 * let x = 1;
 * var flag = true;
 * if (flag) {
 *   let x = 2; //different variable
 *   console.log(x); //2
 * }
 * console.log(x); //1
 * </code>
 * </div>
 */

/**
 * Declares a read-only named constant.
 * Constants are block-scoped, much like variables defined using the 'let' statement.
 * The value of a constant can't be changed through reassignment, and it can't be redeclared.
 * @property const
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
 * @param arguments: The name of an argument to be passed to the function. Maximum number of arguments varies in different engines.
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
 * @example
 * <div>
 * <code>
 * function square(x) {
 *   return x * x;
 * }
 * square(4); //return 16
 * </code>
 * </div>
 */

/**
 * @submodule Class
 */

/**
 * The class declaration creates a new class with a given name using prototype-based inheritance.
 * @property class
 * @example
 * <div>
 * <code>
 * class Polygon {
 *   constructor(height, width) {
 *     this.name = 'Polygon';
 *     this.height = height;
 *     this.width = width;
 *   }
 * }
 * var polygon = new Polygon(4, 5); //creating new instance of Polygon Class.
 * console.log(polygon.name);
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
 * @example
 * <div>
 * <code>
 * var result = '';
 * var i = 0;
 * do {
 *   i += 1;
 *   result += i + ' ';
 * } while (i > 0 && i < 5);
 * console.log(result);
 * <code>
 * </div>
 */

/**
 * Iterates over the enumerable properties of an object, in arbitrary order.
 * For each distinct property, statements can be executed.
 * @property for..in
 * @example
 * <div>
 * <code>
 * var obj = { a: 1, b: 2, c: 3 };
 * for (const prop in obj) {
 *   console.log(`obj.${prop} = ${obj[prop]}`);
 * }
 * // Output:
 * // "obj.a = 1"
 * // "obj.b = 2"
 * // "obj.c = 3"
 * </code>
 * </div>
 */

/**
 * Iterates over iterable objects (including arrays, array-like objects, iterators and generators),
 * invoking a custom iteration hook with statements to be executed for the value of each distinct property.
 * @property for..of
 * @example
 * <div>
 * <code>
 * let iterable = 'boo';
 * for (let value of iterable) {
 *   console.log(value);
 * }
 * // "b"
 * // "o"
 * // "o"
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
 * @param {string} string :The value to parse
 * @param {Integer} radix :An integer between 2 and 36 that represents the radix (the base in mathematical numeral systems) of the string.
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
 * @param
 * @example
 * <div>
 * <code>
 * JSON.stringify('foo'); // '"foo"'
 * JSON.stringify([1, 'false', false]); //'[1,"false",false]'
 * JSON.stringify([NaN, null, Infinity]); //'[null,null,null]'
 * </code>
 * </div>
 */
