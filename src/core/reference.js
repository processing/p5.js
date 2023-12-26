/**
 * @module Foundation
 * @submodule Foundation
 * @for p5
 */

/**
 * Creates and names a new variable. A variable is a container for a value.
 *
 * Variables that are declared with <a href="#/p5/let">let</a> will have block-scope.
 * This means that the variable only exists within the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block">
 * block</a> that it is created within.
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
 *
 * @alt
 * This example does not render anything
 */

/**
 * Creates and names a new constant. Like a variable created with <a href="#/p5/let">let</a>,
 * a constant that is created with <a href="#/p5/const">const</a> is a container for a value,
 * however constants cannot be reassigned once they are declared. Although it is
 * noteworthy that for non-primitive data types like objects & arrays, their
 * elements can still be changeable. So if a variable is assigned an array, you
 * can still add or remove elements from the array but cannot reassign another
 * array to it. Also unlike `let`, you cannot declare variables without value
 * using const.
 *
 * Constants have block-scope. This means that the constant only exists within
 * the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block">
 * block</a> that it is created within. A constant cannot be redeclared within a scope in which it
 * already exists.
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
 *
 * <div class='norender'>
 * <code>
 * const bigCats = ['lion', 'tiger', 'panther'];
 * bigCats.push('leopard');
 * console.log(bigCats);
 * // bigCats = ['cat']; // throws error as re-assigning not allowed for const
 * </code>
 * </div>
 *
 * <div class='norender'>
 * <code>
 * const wordFrequency = {};
 * wordFrequency['hello'] = 2;
 * wordFrequency['bye'] = 1;
 * console.log(wordFrequency);
 * // wordFrequency = { 'a': 2, 'b': 3}; // throws error here
 * </code>
 * </div>
 *
 * @alt
 * These examples do not render anything
 */

/**
 * The strict equality operator <a href="#/p5/===">===</a>
 * checks to see if two values are equal and of the same type.
 *
 * A comparison expression always evaluates to a <a href="#/p5/boolean">boolean</a>.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators">the MDN entry</a>:
 * The non-identity operator returns true if the operands are not equal and/or not of the same type.
 *
 * Note: In some examples around the web you may see a double-equals-sign
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Equality">==</a>,
 * used for comparison instead. This is the non-strict equality operator in Javascript.
 * This will convert the two values being compared to the same type before comparing them.
 *
 * @property ===
 *
 * @example
 * <div class='norender'>
 * <code>
 * console.log(1 === 1); // prints true to the console
 * console.log(1 === '1'); // prints false to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */

/**
 * The greater than operator <a href="#/p5/>">></a>
 * evaluates to true if the left value is greater than
 * the right value.
 *
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators">
 * There is more info on comparison operators on MDN.</a>
 *
 * @property >
 *
 * @example
 * <div class='norender'>
 * <code>
 * console.log(100 > 1); // prints true to the console
 * console.log(1 > 100); // prints false to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */

/**
 * The greater than or equal to operator <a href="#/p5/>=">>=</a>
 * evaluates to true if the left value is greater than or equal to
 * the right value.
 *
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators">There is more info on comparison operators on MDN.</a>
 *
 * @property >=
 *
 * @example
 * <div class='norender'>
 * <code>
 * console.log(100 >= 100); // prints true to the console
 * console.log(101 >= 100); // prints true to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */

/**
 * The less than operator <a href="#/p5/<"><</a>
 * evaluates to true if the left value is less than
 * the right value.
 *
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators">There is more info on comparison operators on MDN.</a>
 *
 * @property <
 *
 * @example
 * <div class='norender'>
 * <code>
 * console.log(1 < 100); // prints true to the console
 * console.log(100 < 99); // prints false to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */

/**
 * The less than or equal to operator <a href="#/p5/<="><=</a>
 * evaluates to true if the left value is less than or equal to
 * the right value.
 *
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators">There is more info on comparison operators on MDN.</a>
 *
 * @property <=
 *
 * @example
 * <div class='norender'>
 * <code>
 * console.log(100 <= 100); // prints true to the console
 * console.log(99 <= 100); // prints true to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */

/**
 * The <a href="#/p5/if-else">if-else</a> statement helps control the flow of your code.
 *
 * A condition is placed between the parenthesis following 'if',
 * when that condition evalues to <a href="https://developer.mozilla.org/en-US/docs/Glossary/truthy">truthy</a>,
 * the code between the following curly braces is run.
 * Alternatively, when the condition evaluates to <a href="https://developer.mozilla.org/en-US/docs/Glossary/Falsy">falsy</a>,
 * the code between the curly braces of 'else' block is run instead. Writing an
 * else block is optional.
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
 *
 * @alt
 * This example does not render anything
 */

/**
 * Creates and names a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions">function</a>.
 * A <a href="#/p5/function">function</a> is a set of statements that perform a task.
 *
 * Optionally, functions can have parameters. <a href="https://developer.mozilla.org/en-US/docs/Glossary/Parameter">Parameters</a>
 * are variables that are scoped to the function, that can be assigned a value
 * when calling the function.Multiple parameters can be given by seperating them
 * with commmas.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function">the MDN entry</a>:
 * Declares a function with the specified parameters.
 *
 * @property function
 *
 * @example
 * <div class='norender'>
 * <code>
 * let myName = 'Hridi';
 * function sayHello(name) {
 *   console.log('Hello ' + name + '!');
 * }
 * sayHello(myName); // calling the function, prints "Hello Hridi!" to console.
 * </code>
 * </div>
 *
 * <div class='norender'>
 * <code>
 * let square = number => number * number;
 * console.log(square(5));
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
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
 * const result = calculateSquare(4); // returns 16
 * console.log(result); // prints '16' to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
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
 *
 * @alt
 * This example does not render anything
 */

/**
 * A <a href="#/p5/string">string</a> is one of the 7 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Primitive_values">primitive data types</a> in Javascript.
 * A string is a series of text characters. In Javascript, a string value must
 * be surrounded by either single-quotation marks(') or double-quotation marks(").
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
 *
 * @alt
 * This example does not render anything
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
 *
 * @alt
 * This example does not render anything
 */

/**
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics">MDN's object basics</a>:
 * An <a href="#/p5/object">object</a> is a collection of related data and/or
 * functionality (which usually consists of several variables and functions —
 * which are called properties and methods when they are inside objects.)
 *
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
 *
 * @alt
 * This example does not render anything
 */

/**
 * Creates and names a <a href="#/p5/class">class</a> which is a template for
 * the creation of <a href="#/p5/object">objects</a>.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class">the MDN entry</a>:
 * The class declaration creates a new Class with a given name using
 * prototype-based inheritance.
 *
 * @property class
 *
 * @example
 * <div class='norender'>
 * <code>
 * class Rectangle {
 *   constructor(name, height, width) {
 *     this.name = name;
 *     this.height = height;
 *     this.width = width;
 *   }
 * }
 * let square = new Rectangle('square', 1, 1); // creating new instance of Polygon Class.
 * console.log(square.width); // prints '1' to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */

/**
 * <a href="#/p5/for">for</a> creates a loop that is useful for executing one
 * section of code multiple times.
 *
 * A 'for loop' consists of three different expressions inside of a parenthesis,
 * all of which are optional. These expressions are used to control the number of
 * times the loop is run. The first expression is a statement that is used to set
 * the initial state for the loop. The second expression is a condition that you
 * would like to check before each loop. If this expression returns false then
 * the loop will exit. The third expression is executed at the end of each loop.
 * These expression are separated by ; (semi-colon).In the case of an empty expression,
 * only a semi-colon is written.
 *
 * The code inside of the loop body (in between the curly braces) is executed between the evaluation of the second
 * and third expression.
 *
 * As with any loop, it is important to ensure that the loop can 'exit', or that
 * The test condition will eventually evaluate as false. The test condition with a <a href="#/p5/for">for</a> loop
 * is the second expression detailed above. Ensuring that this expression can eventually
 * become false ensures that your loop doesn't attempt to run an infinite amount of times,
 * which can crash your browser.
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
 *
 * @alt
 * This example does not render anything
 */

/**
 * <a href="#/p5/while">while</a> creates a loop that is useful for executing
 * one section of code multiple times.
 *
 * With a 'while loop', the code inside of the loop body (between the curly
 * braces) is run repeatedly until the test condition (inside of the parenthesis)
 * evaluates to false. The condition is tested before executing the code body
 * with <a href="#/p5/while">while</a>, so if the condition is initially false
 * the loop body, or statement, will never execute.
 *
 * As with any loop, it is important to ensure that the loop can 'exit', or that
 * the test condition will eventually evaluate to false. This is to keep your loop
 * from trying to run an infinite amount of times, which can crash your browser.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while">the MDN entry</a>:
 * The while statement creates a loop that executes a specified statement as long
 * as the test condition evaluates to true.The condition is evaluated before
 * executing the statement.
 *
 * @property while
 *
 * @example
 * <div class='norender'>
 * <code>
 * // This example logs the lines below to the console
 * // 4
 * // 3
 * // 2
 * // 1
 * // 0
 * let num = 5;
 * while (num > 0) {
 *   num = num - 1;
 *   console.log(num);
 * }
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */

/**
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">the MDN entry</a>:
 * The JSON.stringify() method converts a JavaScript object or value to a JSON <a href="#/p5/string">string</a>.
 * @method stringify
 * @static
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
 *
 * @alt
 * This example does not render anything
 */

/**
 * Prints a message to your browser's web console. When using p5, you can use <a href="#/p5/print">print</a>
 * and <a href="#/p5/console/log">console.log</a> interchangeably.
 *
 * The console is opened differently depending on which browser you are using.
 * Here are links on how to open the console in <a href="https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Opening_the_Web_Console">Firefox</a>
 * , <a href="https://developers.google.com/web/tools/chrome-devtools/open">Chrome</a>, <a href="https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide/console">Edge</a>,
 * and <a href="https://support.apple.com/en-ca/guide/safari/sfri20948/mac">Safari</a>.
 * With the <a href="https://editor.p5js.org/">online p5 editor</a> the console
 * is embedded directly in the page underneath the code editor.
 *
 * From <a href="https://developer.mozilla.org/en-US/docs/Web/API/Console/log">the MDN entry</a>:
 * The Console method log() outputs a message to the web console. The message may
 * be a single <a href="#/p5/string">string</a> (with optional substitution values),
 * or it may be any one or more JavaScript <a href="#/p5/object">objects</a>.
 * @method log
 * @static
 * @for console
 * @param {String|Expression|Object} message :Message that you would like to print to the console
 *
 * @example
 * <div class='norender'>
 * <code>
 * let myNum = 5;
 * console.log(myNum); // prints 5 to the console
 * console.log(myNum + 12); // prints 17 to the console
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything
 */
