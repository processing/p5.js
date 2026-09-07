<!-- 一个帮助我们保持文档风格一致的参考指南。 -->

# 文档风格指南

你好！欢迎来到 p5.js 文档编写指南。本文档是以下资源的混合：

- Ruby on Rails [API 文档指南](https://guides.rubyonrails.org/api_documentation_guidelines.html) (CC BY-SA 4.0)
- WordPress 关于[可访问性](https://make.wordpress.org/docs/style-guide/general-guidelines/accessibility/)和[包容性](https://make.wordpress.org/docs/style-guide/general-guidelines/inclusivity/)的文档指南 (CC0)
- Airbnb [JavaScript 风格指南](https://airbnb.io/javascript/) (MIT)

我们的社区庞大而多样。许多人使用 p5.js 学习编程，其中很大一部分是 K-12 年级的学生。阅读本指南后，你将了解：

- 如何编写有效、包容和易于访问的文档。
- 如何为文档编写简单的代码示例。

## 目录

### 写作

- [YUIDoc](#yuidoc)
- [英语](#英语)
- [牛津逗号](#牛津逗号)
- [措辞](#措辞)
- [无偏见的文档](#无偏见的文档)
- [可访问性和残障](#可访问性和残障)

### 代码

- [代码示例](#代码示例)
- [注释](#注释)
- [空白](#空白)
- [分号](#分号)
- [命名约定](#命名约定)
- [变量](#变量)
- [字符串](#字符串)
- [布尔运算符](#布尔运算符)
- [条件语句](#条件语句)
- [迭代](#迭代)
- [对象](#对象)
- [数组](#数组)
- [函数](#函数)
- [箭头函数](#箭头函数)
- [链式调用](#链式调用)
- [类](#类)
- [资源](#资源)

## YUIDoc

我们使用 YUIDoc 来生成 p5.js API 文档。要生成文档，请切换到 p5.js 根目录，运行 `npm install`，然后执行：

```
$ npm run grunt yui:dev
```

输出将出现在 docs/reference 目录中。更多信息请参考[内联文档指南](./contributing_to_the_p5js_reference.md)。

**[⬆ 返回顶部](#目录)**

## 英语

请使用美式英语（color、center、modularize 等）。参见[美式和英式英语拼写差异列表](https://en.wikipedia.org/wiki/American_and_British_English_spelling_differences)。

**[⬆ 返回顶部](#目录)**

## 牛津逗号

请使用[牛津逗号](https://en.wikipedia.org/wiki/Serial_comma)（"red, white, and blue"，而不是"red, white and blue"）。

**[⬆ 返回顶部](#目录)**

## 措辞

写简单、陈述性的句子。简洁是加分项：直奔主题。

使用现在时态："Returns an object that..."，而不是"Returned an object that..."或"Will return an object that..."。

注释以大写字母开头。遵循常规标点规则：

```javascript
// Draws a fractal from a Julia set.
function drawFractal(c, radius, maxIter) {
  // ...
}
```

明确和隐式地传达当前的做事方式。使用本指南中推荐的惯用语。如果需要，重新排序部分以强调首选方法。文档应该是最佳实践的典范，并且对初学者友好。

文档必须简洁但全面。探索并记录边缘情况。每种参数组合会发生什么？初学者的代码中最可能出现哪些错误？

正确拼写名称：p5.js、CSS、HTML、JavaScript、WebGL。如有疑问，请参考官方文档等权威来源。

**[⬆ 返回顶部](#目录)**

## 无偏见的文档

编写文档时不要对任何类型的人有偏见。在记录特别要求高/敏感的主题时，花时间自己学习一下。确保你的写作不会无意中伤害或冒犯他人。

在编写无偏见的文档时：

- 包容所有性别认同和表达、性取向、种族、民族、语言、神经类型、体型、残障、阶级、宗教、文化、亚文化、政治观点、年龄、技能水平、职业和背景。使示例像我们的社区一样多样化。
- 避免政治化内容。如果政治内容是必要的，保持中立。
- 遵循可访问性指南。
- 避免会侮辱或伤害人们的内容。
- 不要对人们、国家和文化做任何概括。这包括正面或中立的概括。
- 不要编写针对少数群体的偏见和歧视性内容。
- 避免与历史事件相关的术语。

优先使用避免"you"和"your"的措辞。例如，不要：

```
If you need to declare a variable, it is recommended that you use `let`.
```

而是使用这种风格：

```
Always use `let` to declare variables.
```

**代词**

| 推荐       | 不推荐             |
| ---------- | ------------------ |
| they       | he or she          |
| them       | him or her         |
| their      | his or her         |
| theirs     | his or hers        |
| themselves | himself or herself |

**[⬆ 返回顶部](#目录)**

## 可访问性和残障

- 注重读者而不是强调他们的不便。
- 不要将残障人士称为残疾人。使用[批准的术语](https://make.wordpress.org/docs/style-guide/general-guidelines/inclusivity/#accessibility-terminology)来指代特定残障的人。
- 在整个 p5.js 文档中保持统一的结构。在风格和视觉上强调重要点。
- 使用屏幕阅读器测试文档。要测试屏幕阅读器，请参见[屏幕阅读器列表](https://en.wikipedia.org/wiki/List_of_screen_readers)。
- 考虑所有类型设备和操作系统的多平台可访问性。
- 创建使用所有类型输入设备的示例，如基于语音和手势的设备、控制器、鼠标和键盘。
- 不要使用能力歧视语言。在编写关于可访问性和残障的内容时要包容和无偏见。
- 对 HTML 语义采取实用方法。不要纯粹为了语义而添加语义。如果有明显匹配内容的 HTML 结构，请使用该元素。例如，一组链接很可能应该使用列表元素。
- 使用简单的表格和表格格式。避免使用 span 标签（如 rowspan 和 colspan）。表格对屏幕阅读器来说很困难。

**可访问性术语**

以下术语改编自 WordPress 文档指南中的[编写包容性文档](https://make.wordpress.org/docs/style-guide/general-guidelines/inclusivity/#accessibility-terminology)。有关以人为本语言的更多背景，请参见 CDC 的[与残障人士沟通指南](https://www.cdc.gov/ncbddd/disabilityandhealth/materials/factsheets/fs-communicating-with-people.html)。

| 推荐                       | 不推荐                                 |
| -------------------------- | -------------------------------------- |
| 残障人士                   | 残疾人、残障、能力不同、有挑战、不正常 |
| 非残障人士                 | 正常人、健康人、健全人                 |
| 有[残障]                   | 受害者、遭受、受...影响、被...折磨     |
| 无法说话，使用合成语音     | 哑巴、失语                             |
| 聋人，听力低下             | 听力障碍                               |
| 盲人，视力低下             | 视力障碍，视觉挑战                     |
| 认知或发育障碍             | 智力挑战，学习缓慢                     |
| 行动不便的人，身体残障的人 | 瘸子，残障                             |

## 代码示例

选择有意义的代码示例，涵盖基础知识以及容易出错的地方。只有在解释功能工作原理时才使用高级语法。当一个圆就能传达想法时，不要画五个圆来解释。代码示例本身应遵循以下指南。

**[⬆ 返回顶部](#目录)**

## 注释

- 使用 `//` 进行单行注释。将单行注释放在注释主题上方的新行上。除非是块的第一行，否则在注释前放置一个空行。

```javascript
// 不好。
let magicWord = 'Please'; // 记住这个。

// 好。
// 记住这个。
let magicWord = 'Please';

// 不好。
if (keyIsPressed === true) {
  thing1();
  // 这是一个重要的注释。
  thing2();
}

// 好。
if (keyIsPressed === true) {
  thing1();

  // 这是一个重要的注释。
  thing2();
}
```

- 所有注释都以空格开头，使其更易于阅读。

```javascript
// 不好。
//记住这个。
let magicWord = 'Please';

// 好。
// 记住这个。
let magicWord = 'Please';
```

- 使用 `//` 进行多行注释。

```javascript
// 不好。
/**
 * 我将使用 // 进行多行注释。
 * 我将使用 // 进行多行注释。
 * 我将使用 // 进行多行注释。
 * 我将使用 // 进行多行注释。
 * 我将使用 // 进行多行注释。
 */

// 不好。
/*
 我将使用 // 进行多行注释。
 我将使用 // 进行多行注释。
 我将使用 // 进行多行注释。
 我将使用 // 进行多行注释。
 我将使用 // 进行多行注释。
 */

// 好。
// 我将使用 // 进行多行注释。
// 我将使用 // 进行多行注释。
// 我将使用 // 进行多行注释。
// 我将使用 // 进行多行注释。
// 我将使用 // 进行多行注释。
```

**[⬆ 返回顶部](#目录)**

## 空白

- 缩进块 2 个空格。

```javascript
// 不好。
function setup() {
∙∙∙∙createCanvas(400, 400);
}

// 不好。
function setup() {
∙createCanvas(400, 400);
}

// 好。
function setup() {
∙∙createCanvas(400, 400);
}
```

- 在左大括号前放置 1 个空格。

```javascript
// 不好。
function setup() {
  createCanvas(400, 400);
}

// 好。
function setup() {
  createCanvas(400, 400);
}
```

- 在控制语句（如 `if` 和 `for`）中的左括号前放置 1 个空格。在参数列表和函数名之间不要放置空格。

```javascript
// 不好。
if (keyIsPressed === true) {
  doStuff();
}

// 好。
if (keyIsPressed === true) {
  doStuff();
}

// 不好。
function setup() {
  createCanvas(400, 400);
}

// 好。
function setup() {
  createCanvas(400, 400);
}
```

- 在运算符之间放置空格。

```javascript
// 不好。
let y = x + 5;

// 好。
let y = x + 5;
```

## 分号

- 使用分号。

> 为什么？JavaScript 的[自动分号插入](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion)可能导致细微的错误。

```javascript
// 不好。
let x = 0;

// 好。
let x = 0;
```

## 命名约定

- 避免使用单字母名称。要有描述性。

```javascript
// 不好。
function f(x, y) {
  // ...
}

// 好。
function vectorField(x, y) {
  // ...
}
```

- 使用驼峰命名法命名对象、函数和实例。

```javascript
// 不好。
let OBJEcttsssss = {};

// 不好。
let this_is_my_object = {};

// 好。
let thisIsMyObject = {};
```

- 使用帕斯卡命名法命名类。

```javascript
// 不好。
class player {
  constructor(name) {
    this.name = name;
  }
}

// 好。
class Player {
  constructor(name) {
    this.name = name;
  }
}
```

- 不要使用尾随或前导下划线。

> 为什么？JavaScript 没有私有属性或方法。

```javascript
// 不好。
class Spy {
  constructor(secret) {
    this._secret = secret;
  }
}

// 好。
class Spy {
  constructor(secret) {
    this.secret = secret;
  }
}
```

**[⬆ 返回顶部](#目录)**

## 变量

- 避免使用 `var` 声明变量。

> 为什么？使用 `var` 声明的变量具有令人困惑的作用域规则。这些会导致细微的错误。

```javascript
// 不好，因为它看起来合理。
circle(x, y, 50);
var x = 200;
var y = 200;

// 好，因为它会抛出 ReferenceError。
circle(x, y, 50);
let x = 200;
let y = 200;
```

- 始终使用 `let` 声明变量。避免使用 `const`。

> 为什么？使用 `let` 声明的变量比使用 `var` 声明的变量更容易理解。变量在草图中经常被重新赋值，所以默认使用 `let` 很有帮助。

```javascript
// 不好。
flower = '🌸';
var flower = '🌸';
const flower = '🌸';

// 好。
let flower = '🌸';
```

- 每个变量或赋值使用一个 `let` 声明。

> 为什么？这样更容易阅读和添加新的变量声明。

```javascript
// 不好。
let positions = getPositions(),
  startSearch = true,
  dragonball = 'z';

// 好。
let positions = getPositions();
let startSearch = true;
let dragonball = 'z';
```

- 在需要的地方分配变量，并将它们放在合理的位置。

> 为什么？`let` 是块作用域而不是函数作用域。

```javascript
// 不好 - 不必要的搜索。
function getCharacter(name = 'default') {
  let character = characters.find(c => c.name === name);

  if (name === 'default') {
    return false;
  }

  if (character) {
    return character;
  }

  return false;
}

// 好。
function getCharacter(name = 'default') {
  if (name === 'default') {
    return false;
  }

  let character = characters.find(c => c.name === name);

  if (character) {
    return character;
  }

  return false;
}
```

- 避免使用一元递增和递减（`++`，`--`）。

> 为什么？一元递增和递减语句受[自动分号插入](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion)的影响。这可能导致递增或递减值的静默错误。使用像 `num += 1` 这样的语句更新变量也比 `num++` 更具表现力。

```javascript
// 不好。
let num = 1;
num++;
--num;

// 好。
let num = 1;
num += 1;
num -= 1;
```

**[⬆ 返回顶部](#目录)**

## 字符串

- 使用单引号 `''` 表示字符串。

```javascript
// 不好。
let name = 'Hilma af Klint';

// 不好 - 模板字面量应包含插值或换行。
let name = `Hilma af Klint`;

// 好。
let name = 'Hilma af Klint';
```

- 不要连接导致行超过 80 个字符的字符串。

> 为什么？断开的字符串难以阅读，使代码不易搜索。

```javascript
// 不好。
let essay =
  'You see us as you want to see us: \
in the simplest terms, in the most convenient definitions.';

// 不好。
let essay =
  'You see us as you want to see us: ' +
  'in the simplest terms, in the most convenient definitions.';

// 好。
let essay =
  'You see us as you want to see us: in the simplest terms, in the most convenient definitions.';
```

- 需要时使用模板字符串而不是连接。

> 为什么？模板字符串具有简洁的语法。它们还提供适当的换行和字符串插值功能。

```javascript
let name = 'Dave';

// 不好。
text(
  name + ', this conversation can serve no purpose anymore. Goodbye.' + name,
  0,
  0
);

// 好。
text(`${name}, this conversation can serve no purpose anymore. Goodbye.`, 0, 0);
```

- 不要在字符串中不必要地转义字符。

> 为什么？反斜杠会损害可读性。

```javascript
// 不好。
let bad = '\'this\' \i\s \"quoted\"';

// 好。
let good = 'Air quotes make you look "cool".';
```

**[⬆ 返回顶部](#目录)**

## 布尔运算符

- 使用 `===` 和 `!==` 而不是 `==` 和 `!=`。

- 不要使用布尔值的快捷方式。

> 为什么？对初学者来说更容易理解。

```javascript
// 不好。
if (mouseIsPressed) {
  // ...
}

// 好。
if (mouseIsPressed === true) {
  // ...
}

// 不好。
if (name) {
  // ...
}

// 好。
if (name !== '') {
  // ...
}

// 不好。
if (collection.length) {
  // ...
}

// 好。
if (collection.length > 0) {
  // ...
}
```

- 除非必要，否则不要使用 `switch` 语句。

- 混合运算符时使用括号。唯一的例外是算术运算符 `+`、`-` 和 `**`。

> 为什么？这样更容易阅读并避免细微的错误。

```javascript
// 不好。
let huh = (a && b < 0) || c > 0 || d + 1 === 0;

// 好。
let huh = (a && b < 0) || c > 0 || d + 1 === 0;

// 不好。
if (a || (b && c)) {
  return d;
}

// 好。
if (a || (b && c)) {
  return d;
}

// 不好。
let what = a + (b / c) * d;

// 好。
let what = a + (b / c) * d;
```

## 条件语句

- 对所有多行块使用大括号。

```javascript
// 不好。
if (mouseIsPressed === true) circle(mouseX, mouseY, 50);

// 更好。
if (mouseIsPressed === true) circle(mouseX, mouseY, 50);

// 最好。
if (mouseIsPressed === true) {
  circle(mouseX, mouseY, 50);
}
```

- 将 `else` 放在前一个 `if` 块的右大括号的同一行。

```javascript
// 不好。
if (mouseIsPressed === true) {
  thing1();
  thing2();
} else {
  thing3();
}

// 好。
if (mouseIsPressed === true) {
  thing1();
  thing2();
} else {
  thing3();
}
```

- 在总是执行 `return` 语句的 `if` 块后不要使用 `else` 块。

```javascript
// 不好。
function mouseIsOnLeft() {
  if (mouseX < width * 0.5) {
    return true;
  } else {
    return false;
  }
}

// 好。
function mouseIsOnLeft() {
  if (mouseX < width * 0.5) {
    return true;
  }

  return false;
}
```

- 如果条件太长，将每个（分组的）条件放在新行上。逻辑运算符应该开始行。

> 为什么？这样更容易阅读。

```javascript
// 不好。
if (
  (number === 123 || letters === 'abc') &&
  mouseIsPressed === true &&
  keyIsPressed === true
) {
  doStuff();
}

// 好。
if (
  (number === 123 || letters === 'abc') &&
  mouseIsPressed === true &&
  keyIsPressed === true
) {
  doStuff();
}
```

- 不要使用选择运算符代替条件语句。

```javascript
// 不好。
refrigeratorIsRunning && goCatchIt();

// 好。
if (refrigeratorIsRunning === true) {
  goCatchIt();
}
```

**[⬆ 返回顶部](#目录)**

## 迭代

- 除非必要，否则不要使用 `while` 或 `do-while` 循环。使用 `for` 循环来迭代固定次数。

```javascript
let numPetals = 7;

// 不好。
let i = 0;
while (i < numPetals) {
  ellipse(0, 0, 20, 80);
  rotate(PI / numPetals);
  i += 1;
}

// 好。
for (let i = 0; i < numPetals; i += 1) {
  ellipse(0, 0, 20, 80);
  rotate(PI / numPetals);
}
```

- 不要使用 `for` 循环来迭代数组。

> 为什么？纯函数比副作用更容易推理。

> 使用 `forEach()` / `map()` / `every()` / `filter()` / `find()` / `findIndex()` / `reduce()` / `some()` / `...` 来迭代数组。使用 `Object.keys()` / `Object.values()` / `Object.entries()` 来生成用于迭代对象的数组。

```javascript
let diameters = [50, 40, 30, 20, 10];

// 不好。
for (let i = 0; i < diameters.length; i += 1) {
  circle(0, 0, diameters[i]);
}

// 不好。
for (let d of diameters) {
  circle(0, 0, d);
}

// 好。
diameters.forEach(d => circle(0, 0, d));
```

**[⬆ 返回顶部](#目录)**

## 对象

- 使用字面量语法创建对象。

```javascript
// 不好。
let ball = new Object();

// 好。
let ball = {};
```

- 只对无效标识符的属性使用引号。

> 为什么？这样更容易阅读并提高语法高亮。JavaScript 引擎也更容易优化性能。

```javascript
// 不好。
let secretObject = {
  x: 100,
  y: 200,
  'top-secret': 'classified'
};

// 好。
let secretObject = {
  x: 3,
  y: 4,
  'top-secret': 'classified'
};
```

- 使用点表示法访问属性。

```javascript
let turtle = {
  name: 'Leonardo',
  color: 'dodgerblue',
  weapon: '🗡️',
  food: '🍕'
};

// 不好。
let turtleName = turtle['name'];

// 好。
let turtleName = turtle.name;
```

- 使用方括号表示法 `[]` 访问带有变量的属性。

```javascript
let turtle = {
  name: 'Leonardo',
  color: 'dodgerblue',
  weapon: '🗡️',
  food: '🍕'
};

function getProp(prop) {
  return turtle[prop];
}

let turtleName = getProp('name');
```

- 不要使用前导逗号。

```javascript
// 不好。
let mathematician = {
  firstName: 'Ada',
  lastName: 'Lovelace'
};

// 好。
let mathematician = {
  firstName: 'Ada',
  lastName: 'Lovelace'
};
```

- 添加尾随逗号。

```javascript
// 不好。
let artist = {
  firstName: 'Lauren',
  lastName: 'McCarthy'
};

// 好。
let artist = {
  firstName: 'Lauren',
  lastName: 'McCarthy'
};
```

**[⬆ 返回顶部](#目录)**

## 数组

- 使用字面量语法创建数组。

```javascript
// 不好。
let images = new Array();

// 好。
let images = [];
```

- 使用 [Array#push](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/push) 而不是直接赋值来向数组添加项目。

```javascript
let lyrics = [];

// 不好。
lyrics[lyrics.length] = 'Little rough around the edges, but I keep it smooth';

// 好。
lyrics.push('Little rough around the edges, but I keep it smooth');
```

- 使用 `slice()` 方法复制数组。

```javascript
// 不好。
let numbersCopy = [];

for (let i = 0; i < numbers.length; i += 1) {
  numbersCopy[i] = numbers[i];
}

// 好。
let numbersCopy = numbers.slice();
```

- 当提高可读性时，在多行上编写数组。在左括号后和右括号前使用换行。添加尾随逗号。

```javascript
// 不好。
let matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

// 好。
let matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

// 也好。
let matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];
```

**[⬆ 返回顶部](#目录)**

## 函数

- 使用函数声明而不是命名函数表达式。

> 为什么？函数声明有一些陷阱，但对初学者来说更容易理解。

```javascript
// 不好。
let foo = function () {
  // ...
};

// 不好。
let foo = () => {
  // ...
};

// 好。
function foo() {
  // ...
}
```

- 使用默认参数语法。不要改变函数参数。

```javascript
// 不好。
function createBall(diameter) {
  diameter = diameter || 50;
  // ...
}

// 好。
function createBall(diameter = 50) {
  // ...
}
```

- 始终将默认参数放在最后。

```javascript
// 不好。
function drawSpiral(angle = 90, length) {
  // ...
}

// 好。
function drawSpiral(length, angle = 90) {
  // ...
}
```

**[⬆ 返回顶部](#目录)**

## 箭头函数

- 对匿名函数使用箭头函数表示法。回调是这种语法的常见用例。

> 为什么？语法更简洁。它还创建了一个在 `this` 上下文中执行的函数版本，这通常很有帮助。

> 为什么不？如果匿名函数很复杂，将其重写为声明的函数。

```javascript
// 不好。
function setup() {
  loadImage('assets/moonwalk.jpg', function (img) {
    image(img, 0, 0);
  });
}

// 好。
function setup() {
  loadImage('assets/moonwalk.jpg', img => {
    image(img, 0, 0);
  });
}

// 不好。
function preload() {
  loadImage('assets/moonwalk.jpg', img => {
    // 复杂的预处理...
  });
}

// 好。
function preload() {
  loadImage('assets/moonwalk.jpg', processImage);
}

function processImage(img) {
  // 复杂的预处理...
}
```

- 尽可能使用隐式返回。如果函数体返回单个语句且没有副作用，则省略大括号。否则，保留大括号并使用 `return` 语句。

> 为什么？这样更容易阅读。

```javascript
// 不好。
[1, 2, 3].map(number => {
  let squared = number ** 2;
  `${number} squared is ${squared}.`;
});

// 不好。
[1, 2, 3].map(number => {
  let squared = number ** 2;
  return `${number} squared is ${squared}.`;
});

// 好。
[1, 2, 3].map(number => `${number} squared is ${number ** 2}.`);
```

- 始终在参数周围包含括号。

> 为什么？这样做可以减少更改参数时的错误。

```javascript
// 不好。
[1, 2, 3].map(number => number * number);

// 好。
[1, 2, 3].map(number => number * number);
```

**[⬆ 返回顶部](#目录)**

## 链式调用

- 使用单独的函数调用而不是函数链式调用。

> 为什么？适应可能不熟悉函数链式调用概念的用户。

```javascript
// 不好。
fill(0).strokeWeight(6).textSize(20);

// 不好。
fill(0).strokeWeight(6).textSize(20);

// 好。
fill(0);
strokeWeight(6);
textSize(20);
```

**[⬆ 返回顶部](#目录)**

## 类

- 始终使用 `class`。避免直接操作 `prototype`。唯一的例外是解释如何[创建库](./creating_libraries.md)。

> 为什么？`class` 语法更简洁，更容易理解。

```javascript
// 不好。
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

// 好。
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

- 使用 `extends` 进行继承。

```javascript
class RandomMover extends Mover {
  update() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
}
```

- 确保自定义 `toString()` 方法不会引起副作用。

```javascript
// 不好。
class Mover {
  // ...

  toString() {
    this.x += 1;
    return `Mover at (${this.x}, ${this.y})`;
  }
}

// 好。
class Mover {
  // ...

  toString() {
    return `Mover at (${this.x}, ${this.y})`;
  }
}
```

- 不要编写空的构造函数或仅委托给父类的构造函数。

> 为什么？如果未指定，类有默认构造函数。

```javascript
// 不好。
class Dot {
  constructor() {}

  render() {
    circle(mouseX, mouseY, 50);
  }
}

// 好。
class Dot {
  render() {
    circle(mouseX, mouseY, 50);
  }
}

// 不好。
class DragonBall extends Ball {
  constructor(x, y, d) {
    super(x, y, d);
  }
}

// 好。
class DragonBall extends Ball {
  constructor(x, y, d, numStars) {
    super(x, y, d);
    this.numStars = numStars;
  }
}
```

- 避免重复的类成员。

> 为什么？重复的类成员声明优先选择最后一个。有重复通常意味着有错误。

```javascript
// 不好。
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

// 好。
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

**[⬆ 返回顶部](#目录)**

## 资源

- 始终从名为"assets"的文件夹加载资源。

> 为什么？它模拟了良好的项目组织。这也是在 p5.js 网站上加载资源所必需的。将资源放在以下文件夹中以将其包含在我们的在线文档中：

- 示例：[src/data/examples/assets](https://github.com/processing/p5.js-website/tree/main/src/data/examples)
- 参考页面：[src/templates/pages/reference/assets](https://github.com/processing/p5.js-website/tree/main/src/templates/pages/reference/assets)
- 学习页面：[src/assets/learn](https://github.com/processing/p5.js-website/tree/main/src/assets/learn)

```javascript
let img;

// 不好。
function preload() {
  img = loadImage('moonwalk.jpg');
}

// 好。
function preload() {
  img = loadImage('assets/moonwalk.jpg');
}
```

**[⬆ 返回顶部](#目录)**
