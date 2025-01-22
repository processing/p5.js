/**
 * @module Foundation
 * @submodule Foundation
 * @for p5
 */

/**
 * Declares a new variable.
 *
 * A variable is a container for a value. For example, a variable might
 * contain a creature's x-coordinate as a `Number` or its name as a
 * `String`. Variables can change value by reassigning them as follows:
 *
 * ```js
 * // Declare the variable x and assign it the value 10.
 * let x = 10;
 *
 * // Reassign x to 50.
 * x = 50;
 * ```
 *
 * Variables have block scope. When a variable is declared between curly
 * braces `{}`, it only exists within the block defined by those braces. For
 * example, the following code would throw a `ReferenceError` because `x` is
 * declared within the `setup()` function's block:
 *
 * ```js
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   let x = 50;
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // x was declared in setup(), so it can't be referenced here.
 *   circle(x, 50, 20);
 * }
 * ```
 *
 * Variables declared outside of all curly braces `{}` are in the global
 * scope. A variable that's in the global scope can be used and changed
 * anywhere in a sketch:
 *
 * ```js
 * let x = 50;
 *
 * function setup() {
 *   createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Change the value of x.
 *   x += 10;
 *
 *   circle(x, 50, 20);
 * }
 * ```
 *
 * @property let
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(220);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Create the message variable.
 *   let message = 'Hello, 🌍!';
 *
 *   // Display the message.
 *   text(message, 50, 50);
 *
 *   describe('The text "Hello, 🌍!" written on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let x = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle moves from left to right against a gray background.');
 * }
 *
 * function draw() {
 *   background(220);
 *
 *   // Change the value of x.
 *   x += 1;
 *
 *   circle(x, 50, 20);
 * }
 * </code>
 * </div>
 */

/**
 * A way to choose whether to run a block of code.
 *
 * `if` statements are helpful for running a block of code based on a
 * condition. For example, an `if` statement makes it easy to express the
 * idea "Draw a circle if the mouse is pressed.":
 *
 * ```js
 * if (mouseIsPressed === true) {
 *   circle(mouseX, mouseY, 20);
 * }
 * ```
 *
 * The statement header begins with the keyword `if`. The expression in
 * parentheses `mouseIsPressed === true` is a `Boolean` expression that's
 * either `true` or `false`. The code between the curly braces `{}` is the if
 * statement's body. The body only runs if the `Boolean` expression is `true`.
 *
 * The <a href="#/p5/mouseIsPressed">mouseIsPressed</a> system variable is
 * always `true` or `false`, so the code snippet above could also be written
 * as follows:
 *
 * ```js
 * if (mouseIsPressed) {
 *   circle(mouseX, mouseY, 20);
 * }
 * ```
 *
 * An `if`-`else` statement adds a block of code that runs if the `Boolean`
 * expression is `false`. For example, here's an `if`-`else` statement that
 * expresses the idea "Draw a circle if the mouse is pressed. Otherwise,
 * display a message.":
 *
 * ```js
 * if (mouseIsPressed === true) {
 *   // When true.
 *   circle(mouseX, mouseY, 20);
 * } else {
 *   // When false.
 *   text('Click me!', 50, 50);
 * }
 * ```
 *
 * There are two possible paths, or branches, in this code snippet. The
 * program must follow one branch or the other.
 *
 * An `else`-`if` statement makes it possible to add more branches.
 * `else`-`if` statements run different blocks of code under different
 * conditions. For example, an `else`-`if` statement makes it easy to express
 * the idea "If the mouse is on the left, paint the canvas white. If the mouse
 * is in the middle, paint the canvas gray. Otherwise, paint the canvas
 * black.":
 *
 * ```js
 * if (mouseX < 33) {
 *   background(255);
 * } else if (mouseX < 67) {
 *   background(200);
 * } else {
 *   background(0);
 * }
 * ```
 *
 * `if` statements can add as many `else`-`if` statements as needed. However,
 * there can only be one `else` statement and it must be last.
 *
 * `if` statements can also check for multiple conditions at once. For
 * example, the `Boolean` operator `&&` (AND) checks whether two expressions
 * are both `true`:
 *
 * ```js
 * if (keyIsPressed === true && key === 'p') {
 *   text('You pressed the "p" key!', 50, 50);
 * }
 * ```
 *
 * If the user is pressing a key AND that key is `'p'`, then a message will
 * display.
 *
 * The `Boolean` operator `||` (OR) checks whether at least one of two
 * expressions is `true`:
 *
 * ```js
 * if (keyIsPressed === true || mouseIsPressed === true) {
 *   text('You did something!', 50, 50);
 * }
 * ```
 *
 * If the user presses a key, or presses a mouse button, or both, then a
 * message will display.
 *
 * The body of an `if` statement can contain another `if` statement. This is
 * called a "nested `if` statement." For example, nested `if` statements make
 * it easy to express the idea "If a key is pressed, then check if the key is
 * `'r'`. If it is, then set the fill to red.":
 *
 * ```js
 * if (keyIsPressed === true) {
 *   if (key === 'r') {
 *     fill('red');
 *   }
 * }
 * ```
 *
 * See <a href="#/p5/Boolean">Boolean</a> and <a href="#/p5/Number">Number</a>
 * to learn more about these data types and the operations they support.
 *
 * @property if
 *
 * @example
 * <div>
 * <code>
 * // Click the mouse to show the circle.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A white circle on a gray background. The circle follows the mouse user clicks on the canvas.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   if (mouseIsPressed === true) {
 *     circle(mouseX, mouseY, 20);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the mouse to show different shapes.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A white ellipse on a gray background. The ellipse becomes a circle when the user presses the mouse.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   if (mouseIsPressed === true) {
 *     circle(50, 50, 20);
 *   } else {
 *     ellipse(50, 50, 20, 50);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Move the mouse to change the background color.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A square changes color from white to black as the user moves the mouse from left to right.'
 *   );
 * }
 *
 * function draw() {
 *   if (mouseX < 33) {
 *     background(255);
 *   } else if (mouseX < 67) {
 *     background(200);
 *   } else {
 *     background(0);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click on the canvas to begin detecting key presses.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A white circle drawn on a gray background. The circle changes color to red when the user presses the "r" key.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   if (keyIsPressed === true) {
 *     if (key === 'r') {
 *       fill('red');
 *     }
 *   }
 *
 *   circle(50, 50, 40);
 * }
 * </code>
 * </div>
 */

/**
 * A named group of statements.
 *
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" target="_blank">Functions</a>
 * help with organizing and reusing code. For example, functions make it easy
 * to express the idea "Draw a flower.":
 *
 * ```js
 * function drawFlower() {
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(20);
 *
 *   // Draw a flower emoji.
 *   text('🌸', 50, 50);
 * }
 * ```
 *
 * The function header begins with the keyword `function`. The function's
 * name, `drawFlower`, is followed by parentheses `()` and curly braces `{}`.
 * The code between the curly braces is called the function's body. The
 * function's body runs when the function is called like so:
 *
 * ```js
 * drawFlower();
 * ```
 *
 * Functions can accept inputs by adding parameters to their headers.
 * Parameters are placeholders for values that will be provided when the
 * function is called. For example, the `drawFlower()` function could include
 * a parameter for the flower's size:
 *
 * ```js
 * function drawFlower(size) {
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *
 *   // Use the size parameter.
 *   textSize(size);
 *
 *   // Draw a flower emoji.
 *   text('🌸', 50, 50);
 * }
 * ```
 *
 * Parameters are part of the function's declaration. Arguments are provided
 * by the code that calls a function. When a function is called, arguments are
 * assigned to parameters:
 *
 * ```js
 * // The argument 20 is assigned to the parameter size.
 * drawFlower(20);
 * ```
 *
 * Functions can have multiple parameters separated by commas. Parameters
 * can have any type. For example, the `drawFlower()` function could accept
 * `Number` parameters for the flower's x- and y-coordinates along with its
 * size:
 *
 * ```js
 * function drawFlower(x, y, size) {
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *
 *   // Use the size parameter.
 *   textSize(size);
 *
 *   // Draw a flower emoji.
 *   // Use the x and y parameters.
 *   text('🌸', x, y);
 * }
 * ```
 *
 * Functions can also produce outputs by adding a `return` statement:
 *
 * ```js
 * function double(x) {
 *   let answer = 2 * x;
 *   return answer;
 * }
 * ```
 *
 * The expression following `return` can produce an output that's used
 * elsewhere. For example, the output of the `double()` function can be
 * assigned to a variable:
 *
 * ```js
 * let six = double(3);
 * text(`3 x 2 = ${six}`, 50, 50);
 * ```
 *
 * @property function
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A pink flower on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Call the drawFlower() function.
 *   drawFlower();
 * }
 *
 * // Declare a function that draws a flower at the
 * // center of the canvas.
 * function drawFlower() {
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(20);
 *
 *   // Draw a flower emoji.
 *   text('🌸', 50, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A pink flower on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Call the drawFlower() function and pass values for
 *   // its position and size.
 *   drawFlower(50, 50, 20);
 * }
 *
 * // Declare a function that draws a flower at the
 * // center of the canvas.
 * function drawFlower(x, y, size) {
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *
 *   // Use the size parameter.
 *   textSize(size);
 *
 *   // Draw a flower emoji.
 *   // Use the x and y parameters.
 *   text('🌸', x, y);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('The message "Hello, 🌍!" written on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Create a greeting.
 *   let greeting = createGreeting('🌍');
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(16);
 *
 *   // Display the greeting.
 *   text(greeting, 50, 50);
 * }
 *
 * // Return a string with a personalized greeting.
 * function createGreeting(name) {
 *   let message = `Hello, ${name}!`;
 *   return message;
 * }
 * </code>
 * </div>
 */

/**
 * A value that's either `true` or `false`.
 *
 * `Boolean` values help to make decisions in code. They appear any time a
 * logical condition is checked. For example, the condition
 * "Is a mouse button being pressed?" must be either `true` or
 * `false`:
 *
 * ```js
 * // If the user presses the mouse, draw a circle at
 * // the mouse's location.
 * if (mouseIsPressed === true) {
 *   circle(mouseX, mouseY, 20);
 * }
 * ```
 *
 * The `if` statement checks whether
 * <a href="#/p5/mouseIsPressed">mouseIsPressed</a> is `true` and draws a
 * circle if it is. `Boolean` expressions such as `mouseIsPressed === true`
 * evaluate to one of the two possible `Boolean` values: `true` or `false`.
 *
 * The `===` operator (EQUAL) checks whether two values are equal. If they
 * are, the expression evaluates to `true`. Otherwise, it evaluates to
 * `false`.
 *
 * Note: There's also a `==` operator with two `=` instead of three. Don't use
 * it.
 *
 * The <a href="#/p5/mouseIsPressed">mouseIsPressed</a> system variable is
 * always `true` or `false`, so the code snippet above could also be written
 * as follows:
 *
 * ```js
 * if (mouseIsPressed) {
 *   circle(mouseX, mouseY, 20);
 * }
 * ```
 *
 * The `!==` operator (NOT EQUAL) checks whether two values are not equal, as
 * in the following example:
 *
 * ```js
 * if (2 + 2 !== 4) {
 *   text('War is peace.', 50, 50);
 * }
 * ```
 *
 * Starting from the left, the arithmetic expression `2 + 2` produces the
 * value `4`. The `Boolean` expression `4 !== 4` evaluates to `false` because
 * `4` is equal to itself. As a result, the `if` statement's body is skipped.
 *
 * Note: There's also a `!=` operator with one `=` instead of two. Don't use
 * it.
 *
 * The `Boolean` operator `&&` (AND) checks whether two expressions are both
 * `true`:
 *
 * ```js
 * if (keyIsPressed === true && key === 'p') {
 *   text('You pressed the "p" key!', 50, 50);
 * }
 * ```
 *
 * If the user is pressing a key AND that key is `'p'`, then a message will
 * display.
 *
 * The `Boolean` operator `||` (OR) checks whether at least one of two
 * expressions is `true`:
 *
 * ```js
 * if (keyIsPressed === true || mouseIsPressed === true) {
 *   text('You did something!', 50, 50);
 * }
 * ```
 *
 * If the user presses a key, or presses a mouse button, or both, then a
 * message will display.
 *
 * The following truth table summarizes a few common scenarios with `&&` and
 * `||`:
 *
 * ```js
 * true && true  // true
 * true && false // false
 * false && false // false
 * true || true  // true
 * true || false // true
 * false || false // false
 * ```
 *
 * The relational operators `>`, `<`, `>=`, and `<=` also produce `Boolean`
 * values:
 *
 * ```js
 * 2 > 1 // true
 * 2 < 1 // false
 * 2 >= 2 // true
 * 2 <= 2 // true
 * ```
 *
 * See <a href="#/p5/if">if</a> for more information about `if` statements and
 * <a href="#/p5/Number">Number</a> for more information about `Number`s.
 *
 * @property Boolean
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A gray square. When the user presses the mouse, a circle appears at that location.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // If the user presses the mouse, draw a circle at that location.
 *   if (mouseIsPressed) {
 *     circle(mouseX, mouseY, 20);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A gray square. When the user presses the mouse, a circle appears at that location.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // If the user presses the mouse, draw a circle at that location.
 *   if (mouseIsPressed === true) {
 *     circle(mouseX, mouseY, 20);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click on the canvas to begin detecting key presses.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A gray square that turns pink when the user presses the mouse or a key.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // If the user presses the mouse, change the background color.
 *   if (mouseIsPressed === true || keyIsPressed === true) {
 *     background('deeppink');
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the canvas to begin detecting key presses.
 *
 * // Create a Boolean variable.
 * let isPlaying = false;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'The message "Begin?\nY or N" written in green on a black background. The message "Good luck!" appears when they press the "y" key.'
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(16);
 *   fill(0, 255, 0);
 *
 *   // Display a different message when the user begins playing.
 *   if (isPlaying === false) {
 *     text('Begin?', 50, 40);
 *     text('Y or N', 50, 60);
 *   } else {
 *     text('Good luck!', 50, 50);
 *   }
 * }
 *
 * // Start playing when the user presses the 'y' key.
 * function keyPressed() {
 *   if (key === 'y') {
 *     isPlaying = true;
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * A sequence of text characters.
 *
 * The `String` data type is helpful for working with text. For example, a
 * string could contain a welcome message:
 *
 * ```js
 * // Use a string literal.
 * text('Hello!', 10, 10);
 * ```
 *
 * ```js
 * // Create a string variable.
 * let message = 'Hello!';
 *
 * // Use the string variable.
 * text(message, 10, 10);
 * ```
 *
 * The most common way to create strings is to use some form of quotations as
 * follows:
 *
 * ```js
 * text("hi", 50, 50);
 * ```
 *
 * ```js
 * text('hi', 50, 50);
 * ```
 *
 * ```js
 * text(`hi`, 50, 50);
 * ```
 *
 * `"hi"`, `'hi'`, and ``hi`` are all string literals. A "literal" means a
 * value was actually written, as in `text('hi', 50, 50)`. By contrast,
 * `text(message, 50, 50)` uses the variable `message`, so it isn't a string
 * literal.
 *
 * Single quotes `''` and double quotes `""` mean the same thing. It's nice to
 * have the option for cases when a string contains one type of quote:
 *
 * ```js
 * text("What's up?", 50, 50);
 * ```
 *
 * ```js
 * text('Air quotes make you look "cool."', 50, 50);
 * ```
 *
 * Backticks ` `` ` create template literals. Template literals have many uses.
 * For example, they can contain both single and double quotes as needed:
 *
 * ```js
 * text(`"Don't you forget about me"`,  10, 10);
 * ```
 *
 * Template literals are helpful when strings are created from variables like
 * so:
 *
 * ```js
 * let size = random(10, 20);
 * circle(50, 50, size);
 *
 * text(`The circle's diameter is ${size} pixels.`,  10, 10);
 * ```
 *
 * The `size` variable's value will replace `${size}` when the string is
 * created. `${}` is a placeholder for any value. That means an expression can
 * be used, as in `${round(PI, 3)}`. All of the following are valid template
 * literals:
 *
 * ```js
 * text(`π is about ${round(PI, 2)} pixels.`,  10, 10);
 * text(`It's ${mouseX < width / 2} that I'm on the left half of the canvas.`,  10, 30);
 * ```
 *
 * Template literals can include several variables:
 *
 * ```js
 * let x = random(0, 100);
 * let y = random(0, 100);
 * let size = random(10, 20);
 * circle(x, y, size);
 *
 * text(`The circle at (${x}, ${y}) has a diameter of ${size} pixels.`,  10, 10);
 * ```
 *
 * Template literals are also helpful for creating multi-line text like so:
 *
 * ```js
 * let poem = `My sketch doesn't run;
 * it waits for me patiently
 * while bugs point the way.`;
 *
 * text(poem, 10, 10);
 * ```
 *
 * @property String
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
 *   textAlign(CENTER, CENTER);
 *   textSize(20);
 *
 *   // Display a welcome message.
 *   text('Hello!', 50, 50);
 *
 *   describe('The text "Hello!" written on a gray background.');
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
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textSize(20);
 *
 *   // Create a string variable.
 *   let world = '🌍';
 *
 *   // Display a welcome message using a template string.
 *   text(`Hello, ${world}!`, 50, 50);
 *
 *   describe('The text "Hello, 🌍!" written on a gray background.');
 * }
 * </code>
 * </div>
 */

/**
 * A number that can be positive, negative, or zero.
 *
 * The `Number` data type is useful for describing values such as position,
 * size, and color. A number can be an integer such as 20 or a decimal number
 * such as 12.34. For example, a circle's position and size can be described
 * by three numbers:
 *
 * ```js
 * circle(50, 50, 20);
 * ```
 *
 * ```js
 * circle(50, 50, 12.34);
 * ```
 *
 * Numbers support basic arithmetic and follow the standard order of
 * operations: Parentheses, Exponents, Multiplication, Division, Addition,
 * and Subtraction (PEMDAS). For example, it's common to use arithmetic
 * operators with p5.js' system variables that are numbers:
 *
 * ```js
 * // Draw a circle at the center.
 * circle(width / 2, height / 2, 20);
 * ```
 *
 * ```js
 * // Draw a circle that moves from left to right.
 * circle(frameCount * 0.01, 50, 20);
 * ```
 *
 * Here's a quick overview of the arithmetic operators:
 *
 * ```js
 * 1 + 2 // Add
 * 1 - 2 // Subtract
 * 1 * 2 // Multiply
 * 1 / 2 // Divide
 * 1 % 2 // Remainder
 * 1 ** 2 // Exponentiate
 * ```
 *
 * It's common to update a number variable using arithmetic. For example, an
 * object's location can be updated like so:
 *
 * ```js
 * x = x + 1;
 * ```
 *
 * The statement above adds 1 to a variable `x` using the `+` operator. The
 * addition assignment operator `+=` expresses the same idea:
 *
 * ```js
 * x += 1;
 * ```
 *
 * Here's a quick overview of the assignment operators:
 *
 * ```js
 * x += 2 // Addition assignment
 * x -= 2 // Subtraction assignment
 * x *= 2 // Multiplication assignment
 * x /= 2 // Division assignment
 * x %= 2 // Remainder assignment
 * ```
 *
 * Numbers can be compared using the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#relational_operators" target="_blank">relational operators</a>
 * `>`, `<`, `>=`, `<=`, `===`, and `!==`.  For example, a sketch's
 * <a href="#/p5/frameCount">frameCount</a> can be used as a timer:
 *
 * ```js
 * if (frameCount > 1000) {
 *   text('Game over!', 50, 50);
 * }
 * ```
 *
 * An expression such as `frameCount > 1000` evaluates to a `Boolean` value
 * that's either `true` or `false`. The relational operators all produce
 * `Boolean` values:
 *
 * ```js
 * 2 > 1 // true
 * 2 < 1 // false
 * 2 >= 2 // true
 * 2 <= 2 // true
 * 2 === 2 // true
 * 2 !== 2 // false
 * ```
 *
 * See <a href="#/p5/Boolean">Boolean</a> for more information about comparisons and conditions.
 *
 * Note: There are also `==` and `!=` operators with one fewer `=`. Don't use them.
 *
 * Expressions with numbers can also produce special values when something
 * goes wrong:
 *
 * ```js
 * sqrt(-1) // NaN
 * 1 / 0 // Infinity
 * ```
 *
 * The value `NaN` stands for
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN" target="_blank">Not-A-Number</a>.
 * `NaN` appears when calculations or conversions don't work. `Infinity` is a
 * value that's larger than any number. It appears during certain
 * calculations.
 *
 * @property Number
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw a circle at the center.
 *   circle(50, 50, 70);
 *
 *   // Draw a smaller circle at the center.
 *   circle(width / 2, height / 2, 30);
 *
 *   describe('Two concentric, white circles drawn on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle travels from left to right on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   circle(frameCount * 0.05, 50, 20);
 * }
 * </code>
 * </div>
 */

/**
 * A container for data that's stored as key-value pairs.
 *
 * Objects help to organize related data of any type, including other objects.
 * A value stored in an object can be accessed by name, called its key. Each
 * key-value pair is called a "property." Objects are similar to dictionaries
 * in Python and maps in Java and Ruby.
 *
 * For example, an object could contain the location, size, and appearance of
 * a dog:
 *
 * ```js
 * // Declare the dog variable and assign it an object.
 * let dog = { x: 50, y: 50, size: 20, emoji: '🐶' };
 *
 * // Style the text.
 * textAlign(CENTER, CENTER);
 * textSize(dog.size);
 *
 * // Draw the dog.
 * text(dog.emoji, dog.x, dog.y);
 * ```
 *
 * The variable `dog` is assigned an object with four properties. Objects
 * are declared with curly braces `{}`. Values can be accessed using the dot
 * operator, as in `dog.size`. In the example above, the key `size`
 * corresponds to the value `20`. Objects can also be empty to start:
 *
 * ```js
 * // Declare a cat variable and assign it an empty object.
 * let cat = {};
 *
 * // Add properties to the object.
 * cat.x = 50;
 * cat.y = 50;
 * cat.size = 20;
 * cat.emoji = '🐱';
 *
 * // Style the text.
 * textAlign(CENTER, CENTER);
 * textSize(cat.size);
 *
 * // Draw the cat.
 * text(cat.emoji, cat.x, cat.y);
 * ```
 *
 * An object's data can be updated while a sketch runs. For example, the `cat`
 * could run away from the `dog` by updating its location:
 *
 * ```js
 * // Run to the right.
 * cat.x += 5;
 * ```
 *
 * If needed, an object's values can be accessed using square brackets `[]`
 * and strings instead of dot notation:
 *
 * ```js
 * // Run to the right.
 * cat["x"] += 5;
 * ```
 *
 * This syntax can be helpful when the key's name has spaces, as in
 * `cat['height (m)']`.
 *
 * @property Object
 *
 * @example
 * <div>
 * <code>
 * // Declare the variable data and assign it an object with three properties.
 * let data = { x: 50, y: 50, d: 20 };
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access the object's values using the . operator.
 *   circle(data.x, data.y, data.d);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable data and assign it an object with three properties.
 * let data = { x: 50, y: 50, d: 20 };
 *
 * // Add another property for color.
 * data.color = 'deeppink';
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A pink circle on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access the object's values using the . operator.
 *   fill(data.color);
 *   circle(data.x, data.y, data.d);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable data and assign it an object with three properties.
 * let data = { x: 50, y: 50, d: 20 };
 *
 * // Add another property for color.
 * data.color = 'deeppink';
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access the object's values using the . operator.
 *   fill(data.color);
 *   circle(data.x, data.y, data.d);
 *
 *   // Update the object's x and y properties.
 *   data.x += random(-1, 1);
 *   data.y += random(-1, 1);
 * }
 * </code>
 * </div>
 */

/**
 * A list that keeps several pieces of data in order.
 *
 * Arrays are helpful for storing related data. They can contain data of any
 * type. For example, an array could contain a list of someone's favorite
 * colors as strings. Arrays are created as follows:
 *
 * ```js
 * let myArray = ['deeppink', 'darkorchid', 'magenta'];
 * ```
 *
 * Each piece of data in an array is called an element. Each element has an
 * address, or index, within its array. The variable `myArray` refers to an
 * array with three <a href="#/p5/String">String</a> elements, `'deeppink'`,
 * `'darkorchid'`, and `'magenta'`. Arrays are zero-indexed, which means
 * that `'deeppink'` is at index 0, `'darkorchid'` is at index 1, and
 * '`magenta'` is at index 2. Array elements can be accessed using their
 * indices as follows:
 *
 * ```js
 * let zeroth = myArray[0]; // 'deeppink'
 * let first = myArray[1]; // 'darkorchid'
 * let second = myArray[2]; // 'magenta'
 * ```
 *
 * Elements can be added to the end of an array by calling the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push" target="_blank">push()</a>
 * method as follows:
 *
 * ```js
 * myArray.push('lavender');
 *
 * let third = myArray[3]; // 'lavender'
 * ```
 *
 * See <a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Arrays" target="_blank">MDN</a>
 * for more information about arrays.
 *
 * @property Array
 *
 * @example
 * <div>
 * <code>
 * // Declare the variable xCoordinates and assign it an array
 * // with three numeric elements.
 * let xCoordinates = [25, 50, 75];
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'Three white circles drawn in a horizontal line on a gray background.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access the element at index 0, which is 25.
 *   circle(xCoordinates[0], 50, 20);
 *
 *   // Access the element at index 1, which is 50.
 *   circle(xCoordinates[1], 50, 20);
 *
 *   // Access the element at index 2, which is 75.
 *   circle(xCoordinates[2], 50, 20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable xCoordinates and assign it an array with three numeric elements.
 * let xCoordinates = [20, 40, 60];
 *
 * // Add another element to the end of the array.
 * xCoordinates.push(80);
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('Four white circles drawn in a horizontal line on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access the element at index 0, which is 20.
 *   circle(xCoordinates[0], 50, 20);
 *
 *   // Access the element at index 1, which is 40.
 *   circle(xCoordinates[1], 50, 20);
 *
 *   // Access the element at index 2, which is 60.
 *   circle(xCoordinates[2], 50, 20);
 *
 *   // Access the element at index 3, which is 80.
 *   circle(xCoordinates[3], 50, 20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable xCoordinates and assign it an empty array.
 * let xCoordinates = [];
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Add elements to the array using a loop.
 *   for (let x = 20; x < 100; x += 20) {
 *     xCoordinates.push(x);
 *   }
 *
 *   describe('Four white circles drawn in a horizontal line on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access the element at index i and use it to draw a circle.
 *   for (let i = 0; i < xCoordinates.length; i += 1) {
 *     circle(xCoordinates[i], 50, 20);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable xCoordinates and assign it an empty array.
 * let xCoordinates = [];
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Add elements to the array using a loop.
 *   for (let x = 20; x < 100; x += 20) {
 *     xCoordinates.push(x);
 *   }
 *
 *   describe('Four white circles drawn in a horizontal line on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access each element of the array and use it to draw a circle.
 *   for (let x of xCoordinates) {
 *     circle(x, 50, 20);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable xCoordinates and assign it an empty array.
 * let xCoordinates = [];
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Add elements to the array using a loop.
 *   for (let x = 20; x < 100; x += 20) {
 *     xCoordinates.push(x);
 *   }
 *
 *   describe(
 *     'Four white circles in a horizontal line on a gray background. The circles move randomly.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   for (let i = 0; i < xCoordinates.length; i += 1) {
 *     // Update the element at index i.
 *     xCoordinates[i] += random(-1, 1);
 *
 *     // Use the element at index i to draw a circle.
 *     circle(xCoordinates[i], 50, 20);
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * A template for creating objects of a particular type.
 *
 * Classes can make it easier to program with objects. For example, a `Frog`
 * class could create objects that behave like frogs. Each object created
 * using a class is called an instance of that class. All instances of a class
 * are the same type. Here's an example of creating an instance of a `Frog`
 * class:
 *
 * ```js
 * let fifi = new Frog(50, 50, 20);
 * ```
 *
 * The variable `fifi` refers to an instance of the `Frog` class. The keyword
 * `new` is used to call the `Frog` class' constructor in the statement
 * `new Frog()`. Altogether, a new `Frog` object was created and assigned to
 * the variable `fifi`. Classes are templates, so they can be used to create
 * more than one instance:
 *
 * ```js
 * // First Frog instance.
 * let frog1 = new Frog(25, 50, 10);
 *
 * // Second Frog instance.
 * let frog2 = new Frog(75, 50, 10);
 * ```
 *
 * A simple `Frog` class could be declared as follows:
 *
 * ```js
 * class Frog {
 *   constructor(x, y, size) {
 *     // This code runs once when an instance is created.
 *     this.x = x;
 *     this.y = y;
 *     this.size = size;
 *   }
 *
 *   show() {
 *     // This code runs once when myFrog.show() is called.
 *     textAlign(CENTER, CENTER);
 *     textSize(this.size);
 *     text('🐸', this.x, this.y);
 *   }
 *
 *   hop() {
 *     // This code runs once when myFrog.hop() is called.
 *     this.x += random(-10, 10);
 *     this.y += random(-10, 10);
 *   }
 * }
 * ```
 *
 * Class declarations begin with the keyword `class` followed by the class
 * name, such as `Frog`, and curly braces `{}`. Class names should use
 * `PascalCase` and can't have spaces in their names. For example, naming a
 * class `Kermit The Frog` with spaces between each word would throw a
 * `SyntaxError`. The code between the curly braces `{}` defines the class.
 *
 * Functions that belong to a class are called methods. `constructor()`,
 * `show()`, and `hop()` are methods in the `Frog` class. Methods define an
 * object's behavior. Methods can accept parameters and return values, just
 * like functions. Note that methods don't use the `function` keyword.
 *
 * `constructor()` is a special method that's called once when an instance of
 * the class is created. The statement `new Frog()` calls the `Frog` class'
 * `constructor()` method.
 *
 * A class definition is a template for instances. The keyword `this` refers
 * to an instance's data and methods. For example, each `Frog` instance has
 * unique coordinates stored in `this.x` and `this.y`. The `show()` method
 * uses those coordinates to draw the frog. The `hop()` method updates those
 * coordinates when called. Once a `Frog` instance is created, its data and
 * methods can be accessed using the dot operator `.` as follows:
 *
 * ```js
 * // Draw a lily pad.
 * fill('green');
 * stroke('green');
 * circle(fifi.x, fifi.y, 2 * fifi.size);
 *
 * // Show the Frog.
 * fifi.show();
 *
 * // Hop.
 * fifi.hop();
 * ```
 *
 * @property class
 *
 * @example
 * <div>
 * <code>
 * // Declare a frog variable.
 * let fifi;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Assign the frog variable a new Frog object.
 *   fifi = new Frog(50, 50, 20);
 *
 *   describe('A frog face drawn on a blue background.');
 * }
 *
 * function draw() {
 *   background('cornflowerblue');
 *
 *   // Show the frog.
 *   fifi.show();
 * }
 *
 * class Frog {
 *   constructor(x, y, size) {
 *     this.x = x;
 *     this.y = y;
 *     this.size = size;
 *   }
 *
 *   show() {
 *     textAlign(CENTER, CENTER);
 *     textSize(this.size);
 *     text('🐸', this.x, this.y);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare two frog variables.
 * let frog1;
 * let frog2;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Assign the frog variables a new Frog object.
 *   frog1 = new Frog(25, 50, 10);
 *   frog2 = new Frog(75, 50, 20);
 *
 *   describe('Two frog faces drawn next to each other on a blue background.');
 * }
 *
 * function draw() {
 *   background('cornflowerblue');
 *
 *   // Show the frogs.
 *   frog1.show();
 *   frog2.show();
 * }
 *
 * class Frog {
 *   constructor(x, y, size) {
 *     this.x = x;
 *     this.y = y;
 *     this.size = size;
 *   }
 *
 *   show() {
 *     textAlign(CENTER, CENTER);
 *     textSize(this.size);
 *     text('🐸', this.x, this.y);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare two frog variables.
 * let frog1;
 * let frog2;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Assign the frog variables a new Frog object.
 *   frog1 = new Frog(25, 50, 10);
 *   frog2 = new Frog(75, 50, 20);
 *
 *   // Slow the frame rate.
 *   frameRate(1);
 *
 *   describe('Two frog faces on a blue background. The frogs hop around randomly.');
 * }
 *
 * function draw() {
 *   background('cornflowerblue');
 *
 *   // Show the frogs.
 *   frog1.show();
 *   frog2.show();
 *
 *   // Move the frogs.
 *   frog1.hop();
 *   frog2.hop();
 *
 *   // Wrap around if they've hopped off the edge.
 *   frog1.checkEdges();
 *   frog2.checkEdges();
 * }
 *
 * class Frog {
 *   constructor(x, y, size) {
 *     this.x = x;
 *     this.y = y;
 *     this.size = size;
 *   }
 *
 *   show() {
 *     textAlign(CENTER, CENTER);
 *     textSize(this.size);
 *     text('🐸', this.x, this.y);
 *   }
 *
 *   hop() {
 *     this.x += random(-10, 10);
 *     this.y += random(-10, 10);
 *   }
 *
 *   checkEdges() {
 *     if (this.x > width) {
 *       this.x = this.x - width;
 *     } else if (this.x < 0) {
 *       this.x = width - this.x;
 *     }
 *
 *     if (this.y > height) {
 *       this.y = this.y - height;
 *     } else if (this.y < 0) {
 *       this.y = height - this.y;
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Create an array that will hold frogs.
 * let frogs = [];
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Add Frog objects to the array.
 *   for (let i = 0; i < 5; i += 1) {
 *     // Calculate random coordinates and size.
 *     let x = random(0, 100);
 *     let y = random(0, 100);
 *     let s = random(2, 20);
 *
 *     // Create a new Frog object.
 *     let frog = new Frog(x, y, s);
 *
 *     // Add the Frog to the array.
 *     frogs.push(frog);
 *   }
 *
 *   // Slow the frame rate.
 *   frameRate(1);
 *
 *   describe(
 *     'Five frog faces on a blue background. The frogs hop around randomly.'
 *   );
 * }
 *
 * function draw() {
 *   background('cornflowerblue');
 *
 *   for (let frog of frogs) {
 *     // Show the frog.
 *     frog.show();
 *
 *     // Move the frog.
 *     frog.hop();
 *
 *     // Wrap around if they've hopped off the edge.
 *     frog.checkEdges();
 *   }
 * }
 *
 * class Frog {
 *   constructor(x, y, size) {
 *     this.x = x;
 *     this.y = y;
 *     this.size = size;
 *   }
 *
 *   show() {
 *     textAlign(CENTER, CENTER);
 *     textSize(this.size);
 *     text('🐸', this.x, this.y);
 *   }
 *
 *   hop() {
 *     this.x += random(-10, 10);
 *     this.y += random(-10, 10);
 *   }
 *
 *   checkEdges() {
 *     if (this.x > width) {
 *       this.x = this.x - width;
 *     } else if (this.x < 0) {
 *       this.x = width - this.x;
 *     }
 *
 *     if (this.y > height) {
 *       this.y = this.y - height;
 *     } else if (this.y < 0) {
 *       this.y = height - this.y;
 *     }
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * A way to repeat a block of code when the number of iterations is known.
 *
 * `for` loops are helpful for repeating statements a certain number of times.
 * For example, a `for` loop makes it easy to express the idea
 * "draw five lines" like so:
 *
 * ```js
 * for (let x = 10; x < 100; x += 20) {
 *   line(x, 25, x, 75);
 * }
 * ```
 *
 * The loop's header begins with the keyword `for`. Loops generally count up
 * or count down as they repeat, or iterate. The statements in parentheses
 * `let x = 10; x < 100; x += 20` tell the loop how it should repeat:
 * - `let x = 10` tells the loop to start counting at `10` and keep track of iterations using the variable `x`.
 * - `x < 100` tells the loop to count up to, but not including, `100`.
 * - `x += 20`  tells the loop to count up by `20` at the end of each iteration.
 *
 * The code between the curly braces `{}` is the loop's body. Statements in the
 * loop body are repeated during each iteration of the loop.
 *
 * It's common to create infinite loops accidentally. When this happens,
 * sketches may become unresponsive and the web browser may display a warning.
 * For example, the following loop never stops iterating because it doesn't
 * count up:
 *
 * ```js
 * for (let x = 10; x < 100; x = 20) {
 *   line(x, 25, x, 75);
 * }
 * ```
 *
 * The statement `x = 20` keeps the variable `x` stuck at `20`, which is
 * always less than `100`.
 *
 * `for` loops can also count down:
 *
 * ```js
 * for (let d = 100; d > 0; d -= 10) {
 *   circle(50, 50, d);
 * }
 * ```
 *
 * `for` loops can also contain other loops. The following nested loop draws a
 * grid of points:
 *
 * ```js
 * // Loop from left to right.
 * for (let x = 10; x < 100; x += 10) {
 *
 *   // Loop from top to bottom.
 *   for (let y = 10; y < 100; y += 10) {
 *     point(x, y);
 *   }
 *
 * }
 * ```
 *
 * `for` loops are also helpful for iterating through the elements of an
 * array. For example, it's common to iterate through an array that contains
 * information about where or what to draw:
 *
 * ```js
 * // Create an array of x-coordinates.
 * let xCoordinates = [20, 40, 60];
 *
 * for (let i = 0; i < xCoordinates.length; i += 1) {
 *   // Update the element.
 *   xCoordinates[i] += random(-1, 1);
 *
 *   // Draw a circle.
 *   circle(xCoordinates[i], 50, 20);
 * }
 * ```
 *
 * If the array's values aren't modified, the `for...of` statement can
 * simplify the code. They're similar to `for` loops in Python and `for-each`
 * loops in C++ and Java. The following loops have the same effect:
 *
 * ```js
 * // Draw circles with a for loop.
 * let xCoordinates = [20, 40, 60];
 *
 * for (let i = 0; i < xCoordinates.length; i += 1) {
 *   circle(xCoordinates[i], 50, 20);
 * }
 * ```
 *
 * ```js
 * // Draw circles with a for...of statement.
 * let xCoordinates = [20, 40, 60];
 *
 * for (let x of xCoordinates) {
 *   circle(x, 50, 20);
 * }
 * ```
 *
 * In the code snippets above, the variables `i` and `x` have different roles.
 *
 * In the first snippet, `i` counts from `0` up to `2`, which is one less than
 * `xCoordinates.length`. `i` is used to access the element in `xCoordinates`
 * at index `i`.
 *
 * In the second code snippet, `x` isn't keeping track of the loop's progress
 * or an index. During each iteration, `x` contains the next element of
 * `xCoordinates`. `x` starts from the beginning of `xCoordinates` (`20`) and
 * updates its value to `40` and then `60` during the next iterations.
 *
 * @property for
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('Five black vertical lines on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw vertical lines using a loop.
 *   for (let x = 10; x < 100; x += 20) {
 *     line(x, 25, x, 75);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('Five white concentric circles drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw concentric circles using a loop.
 *   for (let d = 100; d > 0; d -= 20) {
 *     circle(50, 50, d);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A grid of black dots on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Set the spacing for points on the grid.
 *   let space = 10;
 *
 *   // Increase the stroke weight.
 *   strokeWeight(3);
 *
 *   // Loop from the left to the right.
 *   for (let x = space; x < 100; x += space) {
 *     // Loop from the top to the bottom.
 *     for (let y = space; y < 100; y += space) {
 *       point(x, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable xCoordinates and assign it an array of numbers.
 * let xCoordinates = [20, 40, 60, 80];
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('Four white circles drawn in a horizontal line on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access the element at index i and use it to draw a circle.
 *   for (let i = 0; i < xCoordinates.length; i += 1) {
 *     circle(xCoordinates[i], 50, 20);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Declare the variable xCoordinates and assign it an array of numbers.
 * let xCoordinates = [20, 40, 60, 80];
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('Four white circles drawn in a horizontal line on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Access each element of the array and use it to draw a circle.
 *   for (let x of xCoordinates) {
 *     circle(x, 50, 20);
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * A way to repeat a block of code.
 *
 * `while` loops are helpful for repeating statements while a condition is
 * `true`. They're like `if` statements that repeat. For example, a `while`
 * loop makes it easy to express the idea "draw several lines" like so:
 *
 * ```js
 * // Declare a variable to keep track of iteration.
 * let x = 10;
 *
 * // Repeat as long as x < 100
 * while (x < 100) {
 *   line(x, 25, x, 75);
 *
 *   // Increment by 20.
 *   x += 20;
 * }
 * ```
 *
 * The loop's header begins with the keyword `while`. Loops generally count up
 * or count down as they repeat, or iterate. The statement in parentheses
 * `x < 100` is a condition the loop checks each time it iterates. If the
 * condition is `true`, the loop runs the code between the curly braces `{}`,
 * The code between the curly braces is called the loop's body. If the
 * condition is `false`, the body is skipped and the loop is stopped.
 *
 * It's common to create infinite loops accidentally. For example, the
 * following loop never stops iterating because it doesn't count up:
 *
 * ```js
 * // Declare a variable to keep track of iteration.
 * let x = 10;
 *
 * // Repeat as long as x < 100
 * while (x < 100) {
 *   line(x, 25, x, 75);
 * }
 *
 * // This should be in the loop's body!
 * x += 20;
 * ```
 *
 * The statement `x += 20` appears after the loop's body. That means the
 * variable `x` is stuck at `10`,  which is always less than `100`.
 *
 * `while` loops are useful when the number of iterations isn't known in
 * advance. For example, concentric circles could be drawn at random
 * increments:
 *
 * ```js
 * let d = 100;
 * let minSize = 5;
 *
 * while (d > minSize) {
 *   circle(50, 50, d);
 *   d -= random(10);
 * }
 * ```
 *
 * @property while
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('Five black vertical lines on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Declare a variable to keep track of iteration.
 *   let x = 10;
 *
 *   // Repeat as long as x < 100
 *   while (x < 100) {
 *     line(x, 25, x, 75);
 *
 *     // Increment by 20.
 *     x += 20;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(5);
 *
 *   describe(
 *     "A gray square with several concentric circles at the center. The circles' sizes decrease at random increments."
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   let d = 100;
 *   let minSize = 5;
 *
 *   while (d > minSize) {
 *     circle(50, 50, d);
 *     d -= random(5, 15);
 *   }
 * }
 * </code>
 * </div>
 */

/**
 * Prints a message to the web browser's console.
 *
 * The <a href="https://developer.mozilla.org/en-US/docs/Web/API/console" target="_blank">console</a>
 * object is helpful for printing messages while debugging. For example, it's
 * common to add a `console.log()` statement while studying how a section of
 * code works:
 *
 * ```js
 * if (isPlaying === true) {
 *   // Add a console.log() statement to make sure this block of code runs.
 *   console.log('Got here!');
 *
 *   // Game logic.
 * }
 * ```
 *
 * `console.error()` is helpful for tracking errors because it prints
 * formatted messages. For example, it's common to encounter errors when
 * loading media assets:
 *
 * ```js
 * // Logs an error message with special formatting.
 * function handleFailure(error) {
 *   console.error('Oops!', error);
 * }
 *
 * // Try to load an image and call handleError() if it fails.
 * loadImage('https://example.com/cat.jpg', handleImage, handleError);
 * ```
 *
 * @property console
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   noCanvas();
 *
 *   // Prints "Hello!" to the console.
 *   console.log('Hello!');
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
 *   // Try to load an image from a fake URL.
 *   // Call handleError() if the image fails to load.
 *   loadImage('https://example.com/cat.jpg', handleImage, handleError);
 * }
 *
 * // Displays the image.
 * function handleImage(img) {
 *   image(img, 0, 0);
 *
 *   describe('A cat on a gray background.');
 * }
 *
 * // Prints the error.
 * function handleError(error) {
 *   console.error('Oops!', error);
 *
 *   describe('A gray square.');
 * }
 * </code>
 * </div>
 */
