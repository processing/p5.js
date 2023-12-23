# Documentation Style Guide

Hello! Welcome to the guidelines for writing p5.js documentation. This document is a remix of the following resources:

- Ruby on Rails [API Documentation Guidlines](https://guides.rubyonrails.org/api_documentation_guidelines.html) (CC BY-SA 4.0)
- WordPress documentation guidelines for [accessibility](https://make.wordpress.org/docs/style-guide/general-guidelines/accessibility/) and [inclusivity](https://make.wordpress.org/docs/style-guide/general-guidelines/inclusivity/) (CC0)
- Airbnb [JavaScript Style Guide](https://airbnb.io/javascript/) (MIT)

Our community is large and diverse. Many people learn to code using p5.js, and a large subset of those people are students in K–12 classes. After reading this guide, you will know:
- How to write effective, inclusive, and accessible prose for documentation purposes.
- How to write simple code samples for documentation purposes.

## Table of Contents

### Writing
- [YUIDoc](#yuidoc)
- [English](#english)
- [Oxford Comma](#oxford-comma)
- [Wording](#wording)
- [Unbiased Documentation](#unbiased-documentation)
- [Accessibility and Disability](#accessibility-and-disability)

### Code
- [Code Samples](#code-samples)
- [Comments](#comments)
- [Whitespace](#whitespace)
- [Semicolons](#semicolons)
- [Naming Conventions](#naming-conventions)
- [Variables](#variables)
- [Strings](#strings)
- [Boolean Operators](#boolean-operators)
- [Conditionals](#conditionals)
- [Iteration](#iteration)
- [Objects](#objects)
- [Arrays](#arrays)
- [Functions](#functions)
- [Arrow Functions](#arrow-functions)
- [Classes](#classes)
- [Assets](#assets)

## YUIDoc

We use YUIDoc to generate the p5.js API documentation. To generate the docs, navigate to the p5.js root directory, run `npm install`, and execute:

```
$ npm run grunt yui:dev
```

The output will appear in docs/reference. Refer to the [inline documentation guide](./inline_documentation.md) for more information.

**[⬆ back to top](#table-of-contents)**

## English

Please use American English (color, center, modularize, etc). See [a list of American and British English spelling differences here](https://en.wikipedia.org/wiki/American_and_British_English_spelling_differences).

**[⬆ back to top](#table-of-contents)**

## Oxford Comma

Please use the [Oxford comma](https://en.wikipedia.org/wiki/Serial_comma) ("red, white, and blue", instead of "red, white and blue").

**[⬆ back to top](#table-of-contents)**

## Wording

Write simple, declarative sentences. Brevity is a plus: get to the point.

Write in the present tense: "Returns an object that...", rather than "Returned an object that..." or "Will return an object that...".

Start comments in upper case. Follow regular punctuation rules:

```javascript
// Draws a fractal from a Julia set.
function drawFractal(c, radius, maxIter) {
  // ...
}
```

Communicate the current way of doing things, both explicitly and implicitly. Use the idioms recommended in this guide. Reorder sections to emphasize favored approaches if needed. The documentation should be a model for best practices and approachable for beginners.

Documentation has to be brief but comprehensive. Explore and document edge cases. What happens for each combination of arguments? What bugs are most likely to appear in a beginner's code?

Spell names correctly: p5.js, CSS, HTML, JavaScript, WebGL. When in doubt, refer to an authoritative source like their official documentation.

**[⬆ back to top](#table-of-contents)**

## Unbiased Documentation

Write documentation without bias towards any kind of person. While documenting particularly demanding/sensitive topics, take the time to educate yourself. Ensure that your writing doesn’t hurt or offend someone unintentionally.

While writing unbiased documentation:

- Be inclusive of every gender identity and expression, sexual orientation, race, ethnicity, language, neuro-type, size, disability, class, religion, culture, subculture, political opinion, age, skill level, occupation, and background. Make examples as diverse as our community.
- Avoid politicized content. If political content is necessary, remain neutral.
- Follow accessibility guidelines.
- Avoid content that would insult or cause harm to people.
- Don’t make any generalizations about people, countries, and cultures. That includes positive or neutral generalizations.
- Don’t write prejudiced and discriminatory content against minority communities.
- Avoid terms related to historical events.

Prefer wordings that avoid "you"s and "your"s. For example, instead of:

```
If you need to declare a variable, it is recommended that you use `let`.
```

use this style:

```
Always use `let` to declare variables.
```

**Pronouns**

| Recommended |	Not Recommended |
| -- | -- |
| they | he or she |
| them | him or her |
| their | his or her |
| theirs | his or hers |
| themselves | himself or herself |

**[⬆ back to top](#table-of-contents)**

## Accessibility and Disability

- Emphasize the reader rather than underlining their inconveniences.
- Don’t refer to a person with a disability as a disabled person. Use [approved terminology](https://make.wordpress.org/docs/style-guide/general-guidelines/inclusivity/#accessibility-terminology) for people with specific disabilities.
- Maintain a uniform structure throughout the p5.js documentation. Emphasize important points both stylistically and visually.
- Use a screen reader to test documentation. To test a screen reader, see [List of screen readers](https://en.wikipedia.org/wiki/List_of_screen_readers).
- Consider multi-platform accessibility for all types of devices and operating systems.
- Create examples with all types of input devices such as voice and gesture based devices, controllers, mice, and keyboards.
- Don’t use ableist language. Be inclusive and unbiased while writing about accessibility and disability.
- Take a pragmatic approach to HTML semantics. Don’t add semantics purely for the sake of semantics. If there is an HTML structure that clearly matches the content, use that element. For example, a group of links should most likely use a list element.
- Use simple tables and tabular formats. Avoid span tags (such as rowspan and colspan). Tables prove to be difficult for screen readers.

**Accessibility terminology**

The following terminiology is adapted from the WordPress documentation guidelines for [Writing inclusive documentation](https://make.wordpress.org/docs/style-guide/general-guidelines/inclusivity/#accessibility-terminology). For more background on people-first language, see the CDC's guide on [Communicating With and About People with Disabilities](https://www.cdc.gov/ncbddd/disabilityandhealth/materials/factsheets/fs-communicating-with-people.html).

| Recommended |	Not Recommended |
| -- | -- |
| person with disability | the disabled, handicapped, differently abled, challenged, abnormal |
| person without disability | normal person, healthy person, able-bodied |
| has [disability] | victim of, suffering from, affected by, stricken with |
| unable to speak, uses synthetic speech | dumb, mute |
| deaf, low-hearing | hearing-impaired |
| blind, low-vision | vision-impaired, visually-challenged |
| cognitive or developmental disabilities | mentally-challenged, slow-learner |
| person with limited mobility, person with a physical disability | crippled, handicapped |

## Code Samples

Choose meaningful code samples that cover the basics as well as gotchas. Only use advanced syntax if it is necessary to explain how a feature works. Don't draw five circles to explain something when one circle will convey the idea. The code samples themselves should follow the guidelines below.

**[⬆ back to top](#table-of-contents)**

## Comments

- Use `//` for single line comments. Place single line comments on a newline above the subject of the comment. Put an empty line before the comment unless it’s on the first line of a block.

```javascript
// Bad.
let magicWord = 'Please';  // Remember this.

// Good.
// Remember this.
let magicWord = 'Please';

// Bad.
if (keyIsPressed === true) {
  thing1();
  // This is an important note.
  thing2();
}

// Good.
if (keyIsPressed === true) {
  thing1();

  // This is an important note.
  thing2();
}
```

- Start all comments with a space to make it easier to read.

```javascript
// Bad.
//Remember this.
let magicWord = 'Please';

// Good.
// Remember this.
let magicWord = 'Please';
```

- Use `//` for multiline comments.

```javascript

// Bad.
/**
 * I will use // for multiline comments.
 * I will use // for multiline comments.
 * I will use // for multiline comments.
 * I will use // for multiline comments.
 * I will use // for multiline comments.
 */

//Bad.
/*
 I will use // for multiline comments.
 I will use // for multiline comments.
 I will use // for multiline comments.
 I will use // for multiline comments.
 I will use // for multiline comments.
 */

// Good.
// I will use // for multiline comments.
// I will use // for multiline comments.
// I will use // for multiline comments.
// I will use // for multiline comments.
// I will use // for multiline comments.

```

**[⬆ back to top](#table-of-contents)**

## Whitespace

- Indent blocks 2 spaces.

```javascript
// Bad.
function setup() {
∙∙∙∙createCanvas(400, 400);
}

// Bad.
function setup() {
∙createCanvas(400, 400);
}

// Good.
function setup() {
∙∙createCanvas(400, 400);
}
```

- Place 1 space before the leading brace.

```javascript
// Bad.
function setup(){
  createCanvas(400, 400);
}

// Good.
function setup() {
  createCanvas(400, 400);
}
```

- Place 1 space before the opening parenthesis in control statements such as `if` and `for`. Place no space between the argument list and the function name.

```javascript
// Bad.
if(keyIsPressed === true) {
  doStuff ();
}

// Good.
if (keyIsPressed === true) {
  doStuff();
}

// Bad.
function setup () {
  createCanvas (400, 400);
}

// Good.
function setup() {
  createCanvas(400, 400);
}
```

- Place spaces between operators.

```javascript
// Bad.
let y=x+5;

// Good.
let y = x + 5;
```

## Semicolons

- Yep.

> Why? JavaScript's [automatic semicolon insertion](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion) can lead to subtle bugs.

```javascript
// Bad.
let x = 0

// Good.
let x = 0;
```

## Naming Conventions

- Avoid single letter names. Be descriptive.

```javascript
// Bad.
function f(x, y) {
  // ...
}

// Good.
function vectorField(x, y) {
  // ...
}
```

- Name objects, functions, and instances using camelCase.

```javascript
// Bad.
let OBJEcttsssss = {};

// Bad.
let this_is_my_object = {};

// Good.
let thisIsMyObject = {};
```

- Name classes using PascalCase.

```javascript
// Bad.
class player {
  constructor(name) {
    this.name = name;
  }
}

// Good.
class Player {
  constructor(name) {
    this.name = name;
  }
}
```

- Don't use trailing or leading underscores.

> Why? JavaScript doesn't have private properties or methods.

```javascript
// Bad.
class Spy {
  constructor(secret) {
    this._secret = secret;
  }
}

// Good.
class Spy {
  constructor(secret) {
    this.secret = secret;
  }
}
```

**[⬆ back to top](#table-of-contents)**

## Variables

- Avoid using `var` to declare variables.

> Why? Variables declared with `var` have confusing scoping rules. These lead to subtle bugs.

```javascript
// Bad, because it looks reasonable.
circle(x, y, 50);
var x = 200;
var y = 200;

// Good, because it throws a ReferenceError.
circle(x, y, 50);
let x = 200;
let y = 200;
```

- Always use `let` to declare variables. Avoid using `const`.

> Why? Variables declared with `let` are easier to reason about than those declared with `var`. Variables are often reassigned in sketches, so it's helpful to default to `let`.

```javascript
// Bad.
flower = '🌸';
var flower = '🌸';
const flower = '🌸';

// Good.
let flower = '🌸';
```

- Use one `let` declaration per variable or assignment.

> Why? It’s easier to read and to add new variable declarations.

```javascript
// Bad.
let positions = getPositions(),
  startSearch = true,
  dragonball = 'z';

// Good.
let positions = getPositions();
let startSearch = true;
let dragonball = 'z';
```

- Assign variables where needed and place them in a reasonable place.

> Why? `let` is block scoped and not function scoped.

```javascript
// Bad - unnecessary search.
function getCharacter(name = 'default') {
  let character = characters.find((c) => c.name === name);

  if (name === 'default') {
    return false;
  }

  if (character) {
    return character;
  }
  
  return false;
}

// Good.
function getCharacter(name = 'default') {
  if (name === 'default') {
    return false;
  }

  let character = characters.find((c) => c.name === name);

  if (character) {
    return character;
  }
  
  return false;
}
```

- Avoid using unary increments and decrements (`++`, `--`).

> Why? Unary increment and decrement statements are subject to [automatic semicolon insertion](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion). This can cause silent errors with incrementing or decrementing values. It's also more expressive to update variables with statements like num `+= 1` instead of `num++`.

```javascript
// Bad.
let num = 1;
num++;
--num;

// Good.
let num = 1;
num += 1;
num -= 1;
```

**[⬆ back to top](#table-of-contents)**

## Strings

- Use single quotes `''` for strings.

```javascript
// Bad.
let name = "Hilma af Klint";

// Bad - template literals should contain interpolation or newlines.
let name = `Hilma af Klint`;

// Good.
let name = 'Hilma af Klint';
```

- Don't concatenate strings that cause the line to go over 80 characters.

> Why? Broken strings are hard to read and make code less searchable.

```javascript
// Bad.
let essay = 'You see us as you want to see us: \
in the simplest terms, in the most convenient definitions.';

// Bad.
let essay = 'You see us as you want to see us: ' +
  'in the simplest terms, in the most convenient definitions.';

// Good.
let essay = 'You see us as you want to see us: in the simplest terms, in the most convenient definitions.';
```

- Use template strings instead of concatenation when needed.

> Why? Template strings have a concise syntax. They also provide proper newlines and string interpolation features.

```javascript
let name = 'Dave';

// Bad.
text(name + ', this conversation can serve no purpose anymore. Goodbye.' + name, 0, 0);

// Good.
text(`${name}, this conversation can serve no purpose anymore. Goodbye.`, 0, 0);
```

- Do not unnecessarily escape characters in strings.

> Why? Backslashes harm readability.

```javascript
// Bad.
let bad = '\'this\' \i\s \"quoted\"';

// Good.
let good = 'Air quotes make you look "cool".';
```

**[⬆ back to top](#table-of-contents)**

## Boolean Operators

- Use `===` and `!==` over `==` and `!=`.

- Don't use shortcuts for booleans.

> Why? It's easier to understand for beginners.

```javascript
// Bad.
if (mouseIsPressed) {
  // ...
}

// Good.
if (mouseIsPressed === true) {
  // ...
}

// Bad.
if (name) {
  // ...
}

// Good.
if (name !== '') {
  // ...
}

// Bad.
if (collection.length) {
  // ...
}

// Good.
if (collection.length > 0) {
  // ...
}
```

- Don't use `switch` statements unless it's necessary.

- Use parentheses when mixing operators. The only exceptions are the arithmetic operators `+`, `-`, and `**`.

> Why? It's easier to read and avoids subtle bugs.

```javascript
// Bad.
let huh = a && b < 0 || c > 0 || d + 1 === 0;

// Good.
let huh = (a && b < 0) || c > 0 || (d + 1 === 0);

// Bad.
if (a || b && c) {
  return d;
}

// Good.
if (a || (b && c)) {
  return d;
}

// Bad.
let what = a + b / c * d;

// Good.
let what = a + (b / c) * d;
```

## Conditionals

- Use braces with all multiline blocks.

```javascript
// Bad.
if (mouseIsPressed === true)
  circle(mouseX, mouseY, 50);

// Better.
if (mouseIsPressed === true) circle(mouseX, mouseY, 50);

// Best.
if (mouseIsPressed === true) {
  circle(mouseX, mouseY, 50);
}
```

- Put `else` on the same line as the preceding `if` block’s closing brace.

```javascript
// Bad.
if (mouseIsPressed === true) {
  thing1();
  thing2();
}
else {
  thing3();
}

// Good.
if (mouseIsPressed === true) {
  thing1();
  thing2();
} else {
  thing3();
}
```

- Don't use an `else` block after an `if` block that always executes a `return` statement.

```javascript
// Bad.
function mouseIsOnLeft() {
  if (mouseX < width * 0.5) {
    return true;
  } else {
    return false;
  }
}

// Good.
function mouseIsOnLeft() {
  if (mouseX < width * 0.5) {
    return true;
  }

  return false;
}
```

- If a condition gets too long, place each (grouped) condition on a new line. The logical operator should begin the line.

> Why? It's easier to read.

```javascript
// Bad.
if ((number === 123 || letters === 'abc') && mouseIsPressed === true && keyIsPressed === true) {
  doStuff();
}

// Good.
if (
  (number === 123 || letters === 'abc')
  && mouseIsPressed === true
  && keyIsPressed === true
) {
  doStuff();
}
```

- Don't use selection operators in place of conditionals.

  ```javascript
  // Bad.
  refrigeratorIsRunning && goCatchIt();

  // Good.
  if (refrigeratorIsRunning === true) {
    goCatchIt();
  }
  ```

**[⬆ back to top](#table-of-contents)**

## Iteration

- Don’t use a `while` or `do-while` loops unless it's necessary. Use `for` loops to iterate a fixed number of times.

```javascript
let numPetals = 7;

// Bad.
let i = 0;
while (i < numPetals) {
  ellipse(0, 0, 20, 80);
  rotate(PI / numPetals);
  i += 1;
}

// Good.
for (let i = 0; i < numPetals; i += 1) {
  ellipse(0, 0, 20, 80);
  rotate(PI / numPetals);
}
```

- Don’t use `for` loops to iterate over arrays.

> Why? Pure functions are easier to reason about than side effects.

> Use `forEach()` / `map()` / `every()` / `filter()` / `find()` / `findIndex()` / `reduce()` / `some()` / `...` to iterate over arrays. Use `Object.keys()` / `Object.values()` / `Object.entries()` to produce arrays for iterating over objects.

```javascript
let diameters = [50, 40, 30, 20, 10];

// Bad.
for (let i = 0; i < diameters.length; i += 1) {
  circle(0, 0, diameters[i]);
}

// Bad.
for (let d of diameters) {
  circle(0, 0, d);
}

// Good.
diameters.forEach((d) => circle(0, 0, d));
```

**[⬆ back to top](#table-of-contents)**

## Objects

- Use the literal syntax for object creation.

```javascript
// Bad.
let ball = new Object();

// Good.
let ball = {};
```

- Only quote properties that are invalid identifiers.

> Why? It's easier to read and improves syntax highlighting. JavaScript engines also have an easier time optimizing for performance.

```javascript
// Bad.
let secretObject = {
  'x': 100,
  'y': 200,
  'top-secret': 'classified',
};

// Good.
let secretObject = {
  x: 3,
  y: 4,
  'top-secret': 'classified',
};
```

- Use dot notation to access properties.

```javascript
let turtle = {
  name: 'Leonardo',
  color: 'dodgerblue',
  weapon: '🗡️',
  food: '🍕',
};

// Bad.
let turtleName = turtle['name'];

// Good.
let turtleName = turtle.name;
```

- Use bracket notation `[]` to access properties with a variable.

```javascript
let turtle = {
  name: 'Leonardo',
  color: 'dodgerblue',
  weapon: '🗡️',
  food: '🍕',
};

function getProp(prop) {
  return turtle[prop];
}

let turtleName = getProp('name');
```

- Don't use leading commas.

```javascript
// Bad.
let mathematician = {
    firstName: 'Ada'
  , lastName: 'Lovelace'
};

// Good.
let mathematician = {
  firstName: 'Ada',
  lastName: 'Lovelace',
};
```

- Add a trailing comma.

```javascript
// Bad.
let artist = {
  firstName: 'Lauren',
  lastName: 'McCarthy'
};

// Good.
let artist = {
  firstName: 'Lauren',
  lastName: 'McCarthy',
};
```

**[⬆ back to top](#table-of-contents)**

## Arrays

- Use the literal syntax for array creation.

```javascript
// Bad.
let images = new Array();

// Good.
let images = [];
```

- Use [Array#push](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/push) instead of direct assignment to add items to an array.

```javascript
let lyrics = [];

// Bad.
lyrics[lyrics.length] = 'Little rough around the edges, but I keep it smooth';

// Good.
lyrics.push('Little rough around the edges, but I keep it smooth');
```

- Use the `slice()` method to copy arrays.

```javascript
// Bad.
let numbersCopy = [];

for (let i = 0; i < numbers.length; i += 1) {
  numbersCopy[i] = numbers[i];
}

// Good.
let numbersCopy = numbers.slice();
```

- Write arrays on multiple lines when it improves readibility. Use line breaks after the opening bracket and before the closing bracket. Add a trailing comma.

```javascript
// Bad.
let matrix = [[1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]];

// Good.
let matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

// Also good.
let matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
```

**[⬆ back to top](#table-of-contents)**

## Functions

- Use function declarations instead of named function expressions.

> Why? Function declarations have some gotchas, but they are easier to understand for beginners.

```javascript
// Bad.
let foo = function () {
  // ...
};

// Bad.
let foo = () => {
  // ...
};

// Good.
function foo() {
  // ...
}
```

- Use default parameter syntax. Don't mutate function arguments.

```javascript
// Bad.
function createBall(diameter) {
  diameter = diameter || 50;
  // ...
}

// Good.
function createBall(diameter = 50) {
  // ...
}
```

- Always put default parameters last.

```javascript
// Bad.
function drawSpiral(angle = 90, length) {
  // ...
}

// Good.
function drawSpiral(length, angle = 90) {
  // ...
}
```

**[⬆ back to top](#table-of-contents)**

## Arrow Functions

- Use arrow function notation for anonymous functions. Callbacks are a common case for this syntax.

> Why? The syntax is more concise. It also creates a version of the function that executes in the context of `this`, which is often helpful.

> Why not? If the anonymous function is complex, rewrite it as a declared function.

```javascript
// Bad.
function setup() {
  loadImage('assets/moonwalk.jpg', function (img) {
    image(img, 0, 0);
  });
}


// Good.
function setup() {
  loadImage('assets/moonwalk.jpg', (img) => {
    image(img, 0, 0);
  });
}

// Bad.
function preload() {
  loadImage('assets/moonwalk.jpg', (img) => {
    // Complex preprocessing...
  });
}

// Good.
function preload() {
  loadImage('assets/moonwalk.jpg', processImage);
}

function processImage(img) {
  // Complex preprocessing...
}
```

- Use the implicit return when possible. Omit braces if the function body returns a single statement without side effects. Otherwise, keep the braces and use a `return` statement.

> Why? It's easier to read.

```javascript
// Bad.
[1, 2, 3].map((number) => {
  let squared = number ** 2;
  `${number} squared is ${squared}.`;
});

// Bad.
[1, 2, 3].map((number) => {
  let squared = number ** 2;
  return `${number} squared is ${squared}.`;
});

// Good.
[1, 2, 3].map((number) => `${number} squared is ${number ** 2}.`);
```

- Always include parentheses around arguments.

> Why? Doing so reduces bugs when changing parameters.

```javascript
// Bad.
[1, 2, 3].map(number => number * number);

// Good.
[1, 2, 3].map((number) => number * number);
```

## Classes

- Always use `class`. Avoid manipulating `prototype` directly. The only exception is explaining how to [create libraries](./creating_libraries.md).

> Why? `class` syntax is more concise and easier to reason about.

```javascript
// Bad.
function Mover(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

Mover.prototype.update = function () {
  this.x += 1;
  this.y += 1;
};

Mover.prototype.render = function () {
  circle(this.x, this.y, 2 * this.radius);
};

// Good.
class Mover {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  update() {
    this.x += 1;
    this.y += 1;
  }

  render() {
    circle(this.x, this.y, 2 * this.radius);
  }
}
```

- Use `extends` for inheritance.

```javascript
class RandomMover extends Mover {
  update() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
}
```

- Make sure that custom `toString()` methods don't cause side effects.

```javascript
// Bad.
class Mover {
  // ...

  toString() {
    this.x += 1;
    return `Mover at (${this.x}, ${this.y})`;
  }
}

// Good.
class Mover {
  // ...

  toString() {
    return `Mover at (${this.x}, ${this.y})`;
  }
}
```

- Don't write an empty constructor or one that only delegates to a parent class.

> Why? Classes have a default constructor if one isn't specified.

```javascript
// Bad.
class Dot {
  constructor() {}

  render() {
    circle(mouseX, mouseY, 50);
  }
}

// Good.
class Dot {
  render() {
    circle(mouseX, mouseY, 50);
  }
}

// Bad.
class DragonBall extends Ball {
  constructor(x, y, d) {
    super(x, y, d);
  }
}

// Good.
class DragonBall extends Ball {
  constructor(x, y, d, numStars) {
    super(x, y, d);
    this.numStars = numStars;
  }
}
```

- Avoid duplicate class members.

> Why? Duplicate class member declarations prefer the last one. Having duplicates often means there's a bug.

```javascript
// Bad.
class Mover {
  // ...

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  update() {
    this.x = 0;
    this.y = 0;
  }
}

// Good.
class Mover {
  // ...
  
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }
}
```

**[⬆ back to top](#table-of-contents)**

## Assets

- Always load assets from a folder called "assets".

> Why? It models good project organization. It's also required for assets to load on the p5.js website. Place assets in the following folders to include them in our online documentation:
- Examples: [src/data/examples/assets](https://github.com/processing/p5.js-website/tree/main/src/data/examples)
- Reference Pages: [src/templates/pages/reference/assets](https://github.com/processing/p5.js-website/tree/main/src/templates/pages/reference/assets)
- Learn Pages: [src/assets/learn](https://github.com/processing/p5.js-website/tree/main/src/assets/learn)

```javascript
let img;

// Bad.
function preload() {
  img = loadImage('moonwalk.jpg');
}

// Good.
function preload() {
  img = loadImage('assets/moonwalk.jpg');
}
```

**[⬆ back to top](#table-of-contents)**
