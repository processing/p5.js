/**
 * @module Foundation
 * @submodule Declaration
 * @for p5
 */

/**
 * Declares a block scope local variable,optionally initializing it to a value.
 * @property let
 * Syntax:
 * let var1=value1,var2=value2
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
 * Syntax:
 * const name1 = value1,name2 = value2, ... nameN = valueN;
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
 * syntax:
 * if(condition1)
 *    statement1;
 * else
 *   statement2;
 * @param condition1: An expression that is considered to be either truthy or falsy.
 *[statement1] : Statement that is executed if condition is truthy. Can be any statement, including further nested if statements.
 *[statement2] : Statement that is executed if condition is falsy and the else clause exists. Can be any statement, including block statements and further nested if statements.
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
 * syntax:
 * function name(param,param,..., param){
 *    statements
 * }
 * [name]: The function name.
 * @param param : The name of an argument to be passed to the function. Maximum number of arguments varies in different engines.
 * [statements] : The statements which comprise the body of the function.
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
 * syntax:
 * return expression;
 * [expression] : The expression whose value is to be returned. If omitted, undefined is returned instead.
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
 * syntax:
 * class name{
 *   //class body
 * }
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
 * @property  do..while
 * syntax:
 * do{
 *  statement
 * }while(condition);
 * [statement] : A statement that is executed at least once and is re-executed each time the condition evaluates to true.
 * [condition] : An expression evaluated after each pass through the loop. If condition evaluates to true, the statement is re-executed.
 *  When condition evaluates to false, control passes to the statement following the do...while.
 * @example
 * <div>
 * <code>
 * var result = '';
 * var i = 0;
 * do {
 *   i += 1;
 *   result += i + ' ';
 * } while (i > 0 && i < 5);
 * <code>
 * </div>
 */

/**
 * Creates a loop that executes a specified statement until the test condition evaluates to false.
 * The condition is evaluated after executing the statement, resulting in the specified statement executing at least once.
 * @property for
 * syntax:
 * for (initialization; condition; final-expression){
 *  statement
 * }
 * [initialization] : An expression (including assignment expressions) or variable declaration evaluated once before the loop begins.
 * [condition] : An expression to be evaluated before each loop iteration. If this expression evaluates to true, statement is executed.
 * [final-expression] : An expression to be evaluated at the end of each loop iteration. This occurs before the next evaluation of condition
 * [statement] : A statement that is executed as long as the condition evaluates to true.
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
 * Iterates over the enumerable properties of an object, in arbitrary order.
 * For each distinct property, statements can be executed.
 * @property for..in
 * syntax:
 * for (variable in object)
 *   statement
 * [variable] : A different property name is assigned to variable on each iteration.
 * [object] : Object whose non-Symbol enumerable properties are iterated over.
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
 * syntax:
 * for (variable of iterable) {
 *  statement
 * }
 * [variable] : On each iteration a value of a different property is assigned to variable. variable may be declared with const, let, or var.
 * iterable : Object whose iterable properties are iterated.
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
 * @submodule JS In-Built Method
 */

/**
 * The parseInt() function parses a string argument and
 * returns an integer of the specified radix (the base in mathematical numeral systems).
 * @method parseInt
 * syntax:
 * parseInt(string, radix);
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
 * syntax:
 * JSON.stringify(value, replacer, space)
 * [value]: The value to convert to a JSON string.
 * [replacer]  //Optional  :A function that alters the behavior of the stringification process, or an array of String and Number objects
 * that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string.
 * If this value is null or not provided, all properties of the object are included in the resulting JSON string.
 * [space]  //optional :A String or Number object that's used to insert white space into the output JSON string for readability purposes.
 * If this is a Number, it indicates the number of space characters to use as white space; this number is capped at 10 (if it is greater, the value is just 10).
 * Values less than 1 indicate that no space should be used.
 * If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used as white space.
 * If this parameter is not provided (or is null), no white space is used.
 * @example
 * <div>
 * <code>
 * JSON.stringify('foo'); // '"foo"'
 * JSON.stringify([1, 'false', false]); //'[1,"false",false]'
 * JSON.stringify([NaN, null, Infinity]); //'[null,null,null]'
 * </code>
 * </div>
 */
