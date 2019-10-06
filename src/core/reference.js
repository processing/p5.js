/**
 * @module Foundation
 * @submodule Declaration
 * @for p5
 */

/**
 * Creates and names a new variable. A variable is a container for a value.
 * Variables that are declared with <a href="#/p5/let">let</a> will have block-scope.
 * This means that the variable only exists within the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block">
 * block</a> that it is created within.
 *
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let">the MDN entry</a>:
 * Declares a block scope local variable, optionally initializing it to a value.
 *
 * @property let
 *
 * @example
 * <div class='norender'>
 * <code>
 * let x = 2;
 * console.log(x); // prints 2 to the console
 * x = 1;
 * console.log(x); // prints 1 to the console
 * </code>
 * </div>
 */

/**
 * Creates and names a new constant variable. A variable is a container for a value.
 * Variables that are declared with <a href="#/p5/const">const</a> will have block-scope.
 * This means that the variable only exists within the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block">
 * block</a> that it is created within.
 * <a href="#/p5/const">const</a> is different from <a href="#/p5/let">let</a> in that
 * variables declared with <a href="#/p5/const">const</a> cannot be reassigned or redeclared.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const">the MDN entry</a>:
 * Declares a read-only named constant.
 * Constants are block-scoped, much like variables defined using the 'let' statement.
 * The value of a constant can't be changed through reassignment, and it can't be redeclared.
 * @property const
 *
 * @example
 * <div class='norender'>
 * <code>
 * // define myFavNumber as a constant and give it the value 7
 * const myFavNumber = 7;
 * console.log('my favorite number is: ' + myFavNumber);
 * </code>
 * </div>
 */

/**
 * @submodule Control Statement
 */

/**
 * The <a href="#/p5/if-else">if-else</a> statement helps control the flow of your code.
 * A condition is placed between the parenthesis following 'if'.
 * When that condition evalues to <a href="https://developer.mozilla.org/en-US/docs/Glossary/truthy">truthy</a>,
 * the code between the following curly braces is run.
 * Alternatively, when the condition evaluates to <a href="https://developer.mozilla.org/en-US/docs/Glossary/Falsy">falsy</a>,
 * the code between the curly braces that follow 'else' is run instead.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else">the MDN entry</a>:
 * The 'if' statement executes a statement if a specified condition is truthy.
 * If the condition is falsy, another statement can be executed
 * @property if-else
 *
 * @example
 * <div class='norender'>
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
 * Creates and names a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions">function</a>.
 * A <a href="#/p5/function">function</a> is a set of statements that perform a task.
 * Optionally, functions can have parameters. <a href="https://developer.mozilla.org/en-US/docs/Glossary/Parameter">Parameters</a>
 * are variables that are scoped to the function, that can be assigned a value when calling the function.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function">the MDN entry</a>:
 * Declares a function with the specified parameters.
 * @property function
 *
 * @example
 * <div class='norender'>
 * <code>
 * function calculateRectArea(width, height) {
 *   return width * height;
 * }
 * calculateRectArea(4, 5); // calling the function
 * </code>
 * </div>
 */

/**
 * Specifies the value to be returned by a function.
 * For more info checkout <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return">
 * the MDN entry for return</a>.
 * @property return
 *
 * @example
 * <div class='norender'>
 * <code>
 * function calculateSquare(x) {
 *   return x * x;
 * }
 * calculateSquare(4); // returns 16
 * </code>
 * </div>
 */

/**
 * @submodule Types
 */

/**
 * A <a href="#/p5/boolean">boolean</a> is one of the 7 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values">primitive data types</a> in Javascript.
 * A boolean can only be `true` or `false`.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type">the MDN entry</a>:
 * Boolean represents a logical entity and can have two values: true, and false.
 *
 * @property boolean
 *
 * @example
 * <div class='norender'>
 * <code>
 * let myBoolean = false;
 * console.log(typeof myBoolean); // prints 'boolean' to the console
 * </code>
 * </div>
 */

/**
 * A <a href="#/p5/string">string</a> is one of the 7 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values">primitive data types</a> in Javascript.
 * A string is a series of text characters. In Javascript, a string value must be surrounded by either single-quotation marks(') or double-quotation marks(").
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Glossary/string">the MDN entry</a>:
 * A string is a sequence of characters used to represent text.
 *
 * @property string
 *
 * @example
 * <div class='norender'>
 * <code>
 * let mood = 'chill';
 * console.log(typeof mood); // prints 'string' to the console
 * </code>
 * </div>
 */

/**
 * A <a href="#/p5/number">number</a> is one of the 7 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values">primitive data types</a> in Javascript.
 * A number can be a whole number or a decimal number.
 *
 * <a href="https://developer.mozilla.org/en-US/docs/Glossary/number">The MDN entry for number</a>
 *
 * @property number
 *
 * @example
 * <div class='norender'>
 * <code>
 * let num = 46.5;
 * console.log(typeof num); // prints 'number' to the console
 * </code>
 * </div>
 */

/**
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics">MDN's object basics</a>:
 * An <a href="#/p5/object">object</a> is a collection of related data and/or functionality (which usually consists of several variables and functions —
 * which are called properties and methods when they are inside objects.)
 * @property object
 *
 * @example
 * <div class='norender'>
 * <code>
 * let author = {
 *   name: 'Ursula K Le Guin',
 *   books: [
 *     'The Left Hand of Darkness',
 *     'The Dispossessed',
 *     'A Wizard of Earthsea'
 *   ]
 * };
 * console.log(author.name); // prints 'Ursula K Le Guin' to the console
 * </code>
 * </div>
 */

/**
 * @submodule Classes
 */

/**
 * Creates and names a <a href="#/p5/class">class</a> which is a template for the creation of <a href="#/p5/objects">objects</a>.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class">the MDN entry</a>:
 * The class declaration creates a new Class with a given name using prototype-based inheritance.
 * @property class
 *
 * @example
 * <div class='norender'>
 * <code>
 * class Polygon {
 *   constructor(name, height, width) {
 *     this.name = name;
 *     this.height = height;
 *     this.width = width;
 *   }
 * }
 * let square = new Polygon('square', 1, 1); // creating new instance of Polygon Class.
 * console.log(square.width); // prints '1' to the console
 * </code>
 * </div>
 */

/**
 * @submodule Iterative Statement
 */

/**
 * <a href="#/p5/for">for</a> creates a loop that is useful for executing the code multiple times.
 *
 * A 'for loop' consists of three different expressions inside of a parenthesis, all of which are optional.
 * These expressions are used to control the number of times the loop is run.
 * The first expression is a statement that is used to set the initial state for the loop.
 * The second expression is a condition that you would like to check before each loop. If this expression returns
 * false then the loop will exit.
 * The third expression is executed at the end of each loop.
 *
 * The code inside of the loop body (in between the curly braces) is executed between the evaluation of the second
 * and third expression.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for">the MDN entry</a>:
 * Creates a loop that executes a specified statement until the test condition evaluates to false.
 * The condition is evaluated after executing the statement, resulting in the specified statement executing at least once.
 * @property for
 *
 * @example
 * <div class='norender'>
 * <code>
 * for (let i = 0; i < 9; i++) {
 *   console.log(i);
 * }
 * </code>
 * </div>
 */

/**
 * @submodule JS Method
 */

/**
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">the MDN entry</a>:
 * The JSON.stringify() method converts a JavaScript object or value to a JSON <a href="#/p5/string">string</a>.
 * @method stringify
 * @for JSON
 * @param {Object} object :Javascript object that you would like to convert to JSON
 *
 * @example
 * <div class='norender'>
 * <code>
 * let myObject = { x: 5, y: 6 };
 * let myObjectAsString = JSON.stringify(myObject);
 * console.log(myObjectAsString); // prints "{"x":5,"y":6}" to the console
 * console.log(typeof myObjectAsString); // prints 'string' to the console
 * </code>
 * </div>
 */
