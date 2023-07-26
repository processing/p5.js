# 在p5.js中添加内联文档

通过在p5.js源代码中添加内联文档，可以自动生成参考文档。本文档概述了文档中应包含的标签和信息，以便以适当的格式显示在参考文档中。参考文档会定期从源代码自动生成，因此您的文档可能需要几天时间才会显示在参考文档中。如果超过几天或遇到其他问题，请发送电子邮件至 [hello@p5js.org](mailto:hello@p5js.org)。

有关基础知识，请参见下文，关于yuidoc样式的更多详细信息 [here](http://yui.github.io/yuidoc/syntax/index.html)。请将每行长度限制为80个字符，当超过限制时换行。

__[需要的示例列表](https://github.com/processing/p5.js/issues/2865)（您还可以通过使用grunt构建库并查看日志消息来查看最新的列表）__

## 指定元素类型和描述

有4种类型的元素：`@class`、`@method`、`@property`、`@event`。
您必须指定其中一种元素，以便该元素出现在文档中，并在其后添加元素的名称。描述应出现在顶部。以下是一些格式化提示：
* 您可以使用Markdown语法来格式化描述文本。
* 任何函数、变量或常量名称都应该使用单引号将其`等宽`。
* 双行间隔被视为新段落。您不需要插入`<br><br>`标签。
* 在可能的情况下，提及其他函数或变量名称时，可以链接到其他文件。例如，您可以在[loadImage](https://github.com/processing/p5.js/blob/main/src/image/loading_displaying.js#L21)的描述中查看链接到preload方法。
* 在此处有关更多语法信息的[yuidoc参考](http://yui.github.io/yuidoc/syntax/index.html#basic-requirements)。

```js
   /**
    * 向量的x分量
    * @property x
    * @type {Number}
    */
    this.x = x || 0;
```

```js

  /**
   * 绘制弧线
   *
   * 如果只提供 x、y、width、height、start 和 stop 这几个参数，则绘制一个
   * 开放式饼图。
   * 如果提供了 mode 参数，则根据提供的变量绘制开放式、弦形或饼图弧线。
   *
   * 
   * @param  {Number} x 弧线椭圆的 x 坐标
   * @param  {Number} y 弧线椭圆的 y 坐标
   * @param  {Number} width 弧线椭圆的默认宽度
   * @param  {Number} height 弧线椭圆的默认高度
   * @param  {Number} start 弧线的起始角度（以弧度表示）
   * @param  {Number} stop 弧线的终止角度（以弧度表示）
   * @param  {String} [mode] 用于确定绘制弧线方式的可选参数
   */
```

```js
  /**
   * 
   * 计算向量的大小（长度）并返回结果作为浮点数
   * （这实际上是等式 sqrt(x*x + y*y + z*z)）。
   *
   * @method mag
   * @return {number} 向量的大小（长度）
   */
   PVector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
   };
```

## 指定参数

对于方法来说，应该指定任何 `@params`。它们不应包含空格、制表符等格式，并且应遵循以下标准：

```
@param {type} name 描述，不论长度有多长都没有问题。
```

如果参数是可选的，请在名称周围添加方括号：

```
@param {type} [name] 描述。
```

如果参数采用 [`constants.js`](https://github.com/processing/p5.js/blob/main/src/core/constants.js) 中定义的一个或多个值，
则类型应指定为 `{Constant}`，并且有效值应在 `either` 关键字后的注释中列出，例如：

```
@param {Constant} horizAlign 水平对齐，可以是 LEFT、CENTER 或 RIGHT 之一
```

## 指定返回类型

`@return` 与 `@params` 相同，但不包含名称。它应该是 `@method` 的最后一个元素。JavaScript 类型有：String、Number、Boolean、Object、Array、Null 和 Undefined。如果没有返回类型，请不要包含 `@return`。

```
@return {type} 返回的数据的描述。
```

如果方法返回父对象，则可以省略 `@return`，并添加以下行：

```
@chainable
```

## 附加签名

如果一个方法有多个可能的参数选项，您可以逐个指定每个选项。例如，请参阅 [background](http://p5js.org/reference/#p5/background) 下的 "syntax" 部分的示例。为此，请选择一个版本作为第一个签名，并按照上面的指南进行列表。在文档块的末尾，您可以添加额外的签名，每个签名位于自己的块中，如下所示：

```js
/**
 * @method background
 * @param {String} colorstring 颜色字符串，可能的格式包括：整数
 *                             rgb() 或 rgba()，百分比 rgb() 或 rgba()，
 *                             3 位十六进制，6 位十六进制
 * @param {Number} [a] alpha 值
 */

/**
 * @method background
 * @param {Number} gray 指定一个介于白色和黑色之间的值
 * @param {Number} [a]
 */
```

注意：
* 如果先前已经给出了一个参数的描述，例如此例中的 `a`，则无需重新编写其描述。
* 如果两个签名之间唯一的区别是添加了一个可选参数，则不需要创建单独的签名。
* 您可以在 [background](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/setting.js#L106) 和 [color](https://github.com/processing/p5.js/blob/f38f91308fdacc2f1982e0430b620778fff30a5a/src/color/creating_reading.js#L241) 的源代码中看到两个内联示例。

## 指定其他标签

如果一个属性或变量是常量，请使用 `@final`：

```js
/**
 * PI 是一个数学常数，其值为 3.14159265358979323846。
 * @property PI
 * @type Number
 * @final
 */
PI: PI
```

如果一个属性或变量是私有变量（默认为 `@public`，因此无需指定），请使用 `@private`：

```js
/**
 * _start 调用 preload()、setup() 和 draw()
 * 
 * @method _start
 * @private
 */
p5.prototype._start = function () {
```

## 指定文件的模块

每个 *文件* 的顶部应包含一个 `@module` 标签。模块应该对应于 JavaScript 文件（或 require.js 模块）。它们可以作为项目中的项目列表中的组。参见[这里](https://p5js.org/reference/#/collection-list-nav)（模块包括 COLOR、IMAGE、IO、PVECTOR 等）。

```js
/**
 * @module image
 */
define(function (require) {
  // 在这里编写代码
};
```


## 构造函数

构造函数使用 `@class` 定义。每个构造函数都应该有 `@class` 标签，后面跟着类的名称，以及 `@constructor` 标签和所需的任何 `@param` 标签。

```js
/**
 * p5 构造函数。
 * @class p5
 * @constructor
 * @param {Object} [node] 画布元素。如果未提供，将添加一个画布到 DOM 中。
 * @param {Object} [sketch] sketch 对象。
 */
const p5 = function( node, sketch) {
  ...
}
```

## 添加示例代码

可选地，您可以使用 `@example` 添加示例。示例代码应放置在 `<code></code>` 标签之间，并包含注释。除非在代码块中使用 `setup()` 函数进行特定指定，否则每个 `<code>` 块都会在具有灰色背景的 100x100 像素画布上自动运行。在示例中，请使用 `let` 定义所有变量，以便初学者学习 JavaScript 时能够更容易理解。请查看其他 src 文件中的示例，以确保格式正确。如果您的示例除了画布之外还创建其他 HTML 元素，它们将以 100 像素的宽度呈现。

```
@example
<div>
<code>
arc(50, 55, 50, 50, 0, HALF_PI);
noFill();
arc(50, 55, 60, 60, HALF_PI, PI);
arc(50, 55, 70, 70, PI, PI+QUARTER_PI);
arc(50, 55, 80, 80, PI+QUARTER_PI, TWO_PI);
describe('使用四个弧线创建的椭圆的破碎轮廓');
</code>
</div>
```

您可以为一个函数添加多个示例，只需确保只有一个 @example，每个示例都有自己的 `<div>` 包装，并通过一个换行符进行分隔。

```
@example
<div>
<code>
arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
describe('使用打开的右上角的弧线创建的椭圆');
</code>
</div>

<div>
<code>
arc(50, 50, 80, 80, 0, PI, OPEN);
describe('使用弧线创建的椭圆的下半部分');
</code>
</div>
```

如果您不希望示例执行您的代码（即，只希望代码显示出来），请在 `<div>` 中包含 "norender" 类：
```
@example
<div class="norender">
<code>
arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
describe('使用打开的右上角的弧线创建的椭圆');
</code>
</div>
```

如果您不希望示例作为构建测试的一部分运行（例如，如果示例需要用户交互或使用 headless-Chrome 测试框架不支持的功能），请在 `<div>` 中包含 "notest" 类：

```
@example
<div class='norender notest'><code>
function setup() {
  let c =

 createCanvas(100, 100);
  saveCanvas(c, 'myCanvas', 'jpg');
}
</code></div>
```

如果您需要链接到外部资源文件，请将它们放在 [/docs/yuidoc-p5-theme/assets](https://github.com/processing/p5.js/tree/main/docs/yuidoc-p5-theme/assets) 中，然后使用 "assets/filename.ext" 在代码中链接到它们。请参阅 [tint 示例](http://p5js.org/reference/#/p5/tint)。

### 使用 describe() 添加画布描述
最后，对于您添加的每个示例，您需要在示例中使用 p5.js 函数 `describe()` 创建一个适用于屏幕阅读器的可访问描述。仅包含一个参数：一个对画布上发生的情况的简要描述字符串。请不要添加第二个参数。
```
@example
<div>
<code>
let xoff = 0.0;
function draw() {
  background(204);
  xoff = xoff + 0.01;
  let n = noise(xoff) * width;
  line(n, 0, n, height);
  decribe('垂直线从左到右移动，使用更新的噪声值');
}
</code>
</div>

<div>
<code>
let noiseScale=0.02;
function draw() {
  background(0);
  for (let x=0; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
  describe('水平波形模式，受鼠标 x 位置和更新的噪声值影响');
}
</code>
</div>

```
要了解有关 `describe()` 的更多信息，请访问 [Web 可访问性贡献者文档](https://p5js.org/contributor-docs/#/web_accessibility?id=user-generated-accessible-canvas-descriptions)。

以前的文档指南要求通过在每个示例的末尾添加 [alt-text](https://moz.com/learn/seo/alt-text) 来创建适用于屏幕阅读器的画布描述。现在不再建议这样做。始终使用 `describe()`。以前，通过在给定函数的所有示例之后添加 `@alt` 标签来添加 alt-text（而不是在每个示例下添加单独的 `@alt` 标签），并添加一个换行符来分隔多个示例的描述。
```
@example
<div>
<code>
let xoff = 0.0;
function draw() {
  background(204);
  xoff = xoff + 0.01;
  let n = noise(xoff) * width;
  line(n, 0, n, height);
}
</code>
</div>

<div>
<code>
let noiseScale=0.02;
function draw() {
  background(0);
  for (let x=0; x < width; x++) {
    let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
}
</code>
</div>

@alt
垂直线从左到右移动，根据更新的噪声值变化。
水平波纹受鼠标x位置和更新的噪声值影响。
```

## 方法的模板
这是一个良好文档化的方法示例。要创建一个新方法，您可以使用[此模板](https://github.com/processing/p5.js/tree/main/contributor_docs/method.example.js)。替换文本中的方法变量，并删除其余的内容。

![显示了用于方法的内联文档示例的图像](https://raw.githubusercontent.com/processing/p5.js/main/contributor_docs/images/method-template-example.png)


## 生成文档

* 首先运行 `npm run docs` 来生成所有需要的本地文件，以及从源代码中复制的参考文件。每当您对 yuidoc 引用页面的核心 JS 文件进行更改时，再次运行此命令。这些更改是在 yuidoc-p5-theme 文件夹中的文件，而不是 src 中的内联文档更改。
* 如果您只对源代码进行了更改，只需运行 `npm run grunt yui`，虽然 `npm run grunt yui:build` 也可以。
* 您可以运行 `npm run docs:dev` 来启动站点的实时预览，每次更改后都会更新。 (您需要在进行更改后刷新页面才能看到更改的内容。)

生成的参考文档位于 docs/reference 中。要在本地预览，请运行 `npm run grunt yui:dev` 并在 http://localhost:9001/docs/reference/ 上查看。


## 西班牙语版本

[西班牙语版本](http://p5js.org/es/reference) 的创建方式略有不同。请参考[说明](https://github.com/processing/p5.js-website/blob/main/contributor_docs/i18n_contribution.md)更新该内容。
