# FES 开发者参考和注释
本文档包含 p5.js 友好错误系统（FES）的参考和开发注释。FES 包含多个函数，负责为不同类型的错误生成友好的错误消息。这些函数从各个位置收集错误，包括浏览器触发的错误事件、扫描用户代码时发现的错误、库内部的参数检查等。

生成友好错误消息的主要函数有：
* `_validateParameters()`
* `_friendlyFileLoadError()`
* `_friendlyError()`
* `helpForMisusedAtTopLevelCode()`
* `_fesErrorMontitor()`

这些函数位于 `core/friendly_errors/` 文件夹中。
* `fes_core.js` 包含 FES 的核心功能和其他杂项功能。
* `_validateParameters()` 位于 `validate_params.js` 中，与用于参数验证的其他代码一起。
* `_friendlyFileLoadError()` 位于 `file_errors.js` 中，与处理文件加载错误的其他代码一起。
* 此外，还有一个名为 `stacktrace.js` 的文件，其中包含解析错误堆栈的代码，来自于：https://github.com/stacktracejs/stacktrace.js

下面的部分介绍了 FES 函数的完整参考。

## FES 函数：参考

### `_report()`
##### 描述
`_report()` 是一个主要函数，直接将错误助手消息的输出打印到控制台。
如果设置了 `_fesLogger`（即我们正在运行测试），`_report` 将调用 `_fesLogger` 而不是 console.log。
##### 语法
````JavaScript
_report(message)
````
````JavaScript
_report(message, func)
````
````JavaScript
_report(message, func, color)
````
##### 参数
```
@param  {String}        message   要打印的消息
@param  {String}        [func]    函数名称
@param  {Number|String} [color]   CSS 颜色代码
```
##### 位置
core/friendly_errors/fes_core.js


### `_friendlyError()`
##### 描述
`_friendlyError()` 创建并打印友好的错误消息。任何p5函数都可以调用此函数以提供友好的错误消息。

已实现的函数：
* `core/friendly_errors/fes_core/fesErrorMonitor()`
* `core/friendly_errors/fes_core/checkForUserDefinedFunctions()`
* `core/friendly_errors/fes_core/handleMisspelling()`
* `core/friendly_errors/fes_core/processStack()`
* `core/friendly_errors/file_errors`
* `core/friendly_errors/sketch_reader`
* `core/friendly_errors/validate_params/_friendlyParamError()`
* `core/main/_createFriendlyGlobalFunctionBinder()`
* `core/shape/vertex`
* `math/p5.Vector`

对`_friendlyError`的调用顺序如下：
```
_friendlyError
  _report
```

##### 语法
````JavaScript
_friendlyError(message)
````
````JavaScript
_friendlyError(message, func)
````
````JavaScript
_friendlyError(message, func, color)
````
##### 参数
```
@param  {String}        message   要打印的消息
@param  {String}        [func]    函数的名称
@param  {Number|String} [color]   CSS颜色代码
```
##### 位置
core/friendly_errors/fes_core.js

### `_friendlyFileLoadError()`
##### 描述
如果在文件加载过程中发生错误，`_friendlyFileLoadError()` 将被`loadX()`函数调用。

使用键值`fes.fileLoadError.*`生成并打印友好的错误消息。

如果文件加载失败，此函数将生成并显示友好的错误消息。如果文件的大小过大无法加载，它还会进行检查并生成警告。

当前版本中包含用于生成`image`、`XML`、`table`、`text`、`json`和`font`文件的错误消息模板。

已实现的函数：
* `image/loading_displaying/loadImage()`
* `io/files/loadFont()`
* `io/files/loadTable()`
* `io/files/loadJSON()`
* `io/files/loadStrings()`
* `io/files/loadXML()`
* `io/files/loadBytes()`。

对`_friendlyFileLoadError`的调用顺序如下：
```
_friendlyFileLoadError
  _report
```
##### 语法
````JavaScript
_friendlyFileLoadError(errorType, filePath)
````
##### 参数
```
@param  {Number}  errorType   文件加载错误类型的数字
@param  {String}  filePath    引起错误的文件路径
```
##### 示例
<ins>文件加载错误示例</ins>
````JavaScript
/// missing font file
let myFont;
function preload() {
  myFont = loadFont('assets/OpenSans-Regular.ttf');
};
function setup() {
  fill('#ED225D');
  textFont(myFont);
  textSize(36);
  text('p5*js', 10, 50);
};
function draw() {};
````
FES会在控制台生成以下消息：
> 🌸 p5.js says: 看起来加载字体文件时出现了问题。请检查文件路径 [assets/OpenSans-Regular.ttf] 是否正确，尝试将字体文件托管到在线服务器上，或者运行本地服务器。[https://github.com/processing/p5.js/wiki/Local-server]


##### 位置
core/friendly_errors/file_errors.js

### `validateParameters()`
##### 描述
`validateParameters()` 通过将输入参数与从函数的内联文档中创建的 `docs/reference/data.json` 的信息进行匹配，执行参数验证。它检查函数调用是否包含了正确数量和正确类型的参数。

使用键值 `fes.friendlyParamError.*` 生成并打印友好的错误消息。

可以通过以下方式调用该函数：`p5._validateParameters(FUNCT_NAME, ARGUMENTS)` 或者在需要参数验证的函数内部使用 `p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)`。建议在一般情况下使用静态版本 `p5._validateParameters`。`p5.prototype._validateParameters(FUNCT_NAME, ARGUMENTS)` 主要用于调试和单元测试。

已在以下函数中实现：
* `accessibility/outputs`
* `color/creating_reading`
* `color/setting`
* `core/environment`
* `core/rendering`
* `core/shape/2d_primitives`
* `core/shape/attributes`
* `core/shape/curves`
* `core/shape/vertex`
* `core/transform`
* `data/p5.TypedDict`
* `dom/dom`
* `events/acceleration`
* `events/keyboard`
* `image/image`
* `image/loading_displaying`
* `image/p5.Image`
* `image/pixel`
* `io/files`
* `math/calculation`
* `math/random`
* `typography/attributes`
* `typography/loading_displaying`
* `utilities/string_functions`
* `webgl/3d_primitives`
* `webgl/interaction`
* `webgl/light`
* `webgl/loading`
* `webgl/material`
* `webgl/p5.Camera`

来自 `_validateParameters` 的调用顺序大致如下：
```
validateParameters
   buildArgTypeCache
      addType
    lookupParamDoc
    scoreOverload
      testParamTypes
      testParamType
    getOverloadErrors
    _friendlyParamError
      ValidationError
      report
        friendlyWelcome
```
##### 语法
````JavaScript
_validateParameters(func, args)
````
##### 参数
```
@param  {String}  func    函数名
@param  {Array}   args    用户输入的参数
```
##### 示例
<ins>缺少参数的示例</ins>
````JavaScript
arc(1, 1, 10.5, 10);
````
FES将在控制台生成以下消息：
> 🌸 p5.js 说：看起来arc()在位置#4（从零开始的索引）收到了一个空变量。如果不是故意的，这通常是作用域问题：[https://p5js.org/examples/data-variable-scope.html]。[http://p5js.org/reference/#p5/arc]

> 🌸 p5.js 说：看起来arc()在位置#5（从零开始的索引）收到了一个空变量。如果不是故意的，这通常是作用域问题：[https://p5js.org/examples/data-variable-scope.html]。[http://p5js.org/reference/#p5/arc]

<ins>类型不匹配的示例</ins>
````JavaScript
arc('1', 1, 10.5, 10, 0, Math.PI, 'pie');
````
FES将在控制台生成以下消息：
> 🌸 p5.js 说：arc()在参数#0（从零开始的索引）处期望接收Number，但收到了字符串。[http://p5js.org/reference/#/p5/arc]
##### 位置
core/friendly_errors/validate_params.js

### `fesErrorMonitor()`
##### 描述
`fesErrorMonitor()`处理浏览器显示的各种错误。该函数生成全局错误消息。

生成并打印...
* ...友好错误消息，使用键：`fes.globalErrors.syntax.*`、`fes.globalErrors.reference.*`、`fes.globalErrors.type.*`。
* ...通过`processStack()`生成“内部库”错误消息，使用键：`fes.wrongPreload`、`fes.libraryError`。
* ...通过`printFriendlyStack()`生成堆栈跟踪消息，使用键：`fes.globalErrors.stackTop`、`fes.globalErrors.stackSubseq`。
* ...通过`handleMisspelling()`生成拼写检查消息（来自引用错误），使用键：`fes.misspelling`。

可以通过错误事件、未处理的拒绝事件调用`_fesErrorMonitor()`，也可以在`catch`块中手动调用它，如下所示：
```
try { someCode(); } catch(err) { p5._fesErrorMonitor(err); }
```

该函数目前可以处理某些类型的ReferenceError、SyntaxError和TypeError。您可以在`browser_errors.js`中找到支持的错误的完整列表。

`_fesErrorMonitor`的调用顺序大致如下：
```
 _fesErrorMonitor
     processStack
       printFriendlyError
     （如果错误类型是ReferenceError）
       _handleMisspelling
         computeEditDistance
         _report
       _report
       printFriendlyStack
     （如果错误类型是SyntaxError、TypeError等）
       _report
       printFriendlyStack
```
##### 语法
````JavaScript
fesErrorMonitor(event)
````
##### 参数
```
@param {*}  e     错误事件
```
### 示例
<ins>内部错误示例 1</ins>
```JavaScript
function preload() {
  // 由于在preload中调用background()而引发
  // 错误
  background(200);
}
```
FES将在控制台中生成以下消息：
> 🌸 p5.js说：当调用background时（位于sketch.js的第4行[http://localhost:8000/lib/empty-example/sketch.js:4:3]），在p5js库内部发生了一个错误，错误消息为“无法读取未定义的属性'background'”。（如果没有另外说明，这可能是由于从preload中调用了background。preload函数中除了load函数（loadImage、loadJSON、loadFont、loadStrings等）之外不应该有其他内容。）（http://p5js.org/reference/#/p5/preload）

<ins>内部错误示例 2</ins>
```JavaScript
function setup() {
  cnv = createCanvas(200, 200);
  cnv.mouseClicked();
}
```
FES将在控制台中生成以下消息：
> 🌸 p5.js说：当调用mouseClicked时（位于sketch.js的第3行[http://localhost:8000/lib/empty-example/sketch.js:3:7]），在p5js库内部发生了一个错误，错误消息为“无法读取未定义的属性'bind'”。（如果没有另外说明，这可能是由于传递给mouseClicked的参数存在问题。）（http://p5js.org/reference/#/p5/mouseClicked）

<ins>用户示例中的作用域错误示例</ins>
```JavaScript
function setup() {
  let b = 1;
}
function draw() {
  b += 1;
}
```
FES将在控制台中生成以下消息：
> 🌸 p5.js说：由于当前范围内未定义“b”，出现了一个错误（位于sketch.js的第5行[http://localhost:8000/lib/empty-example/sketch.js:5:3]）。如果在代码中定义了它，请检查其作用域、拼写和大小写（JavaScript区分大小写）。更多信息：https://p5js.org/examples/data-variable-scope.html https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Not_Defined#What_went_wrong

<ins>用户示例中的拼写错误示例</ins>
```JavaScript
function setup() {
  colour(1, 2, 3);
}
```
FES将在控制台中生成以下消息：
> 🌸 p5.js说：您可能错误地将“colour”写成了“color”（位于sketch.js的第2行[http://localhost:8000/lib/empty-example/sketch.js:2:3]）。如果希望使用p5.js中的函数，请将其更正为color（http://p5js.org/reference/#/p5/color）。

##### 位置
core/friendly_errors/fes_core.js

### `fesCodeReader()`
##### 描述
`fesCodeReader()` 函数用于检查以下情况：(1) 是否在 `setup()` 和/或 `draw()` 函数之外使用了任何 p5.js 的常量或函数，以及 (2) 是否重新声明了任何 p5.js 的保留常量或函数。

生成并打印一个友好的错误消息，错误类型为：`fes.sketchReaderErrors.reservedConst`、`fes.sketchReaderErrors.reservedFunc`。

在 `setup()` 和 `draw()` 函数中执行以下操作：
* 提取用户编写的代码
* 将代码转换为代码行的数组
* 捕获变量和函数声明
* 检查声明的函数/变量是否为保留的 p5.js 常量或函数，并进行报告。

该函数在触发 `load` 事件时执行。

##### 示例
<ins>重新定义 p5.js 保留常量的示例</ins>
````JavaScript
function setup() {
  // PI 是 p5.js 的保留常量
  let PI = 100;
}
````
FES 将在控制台生成以下消息：
> 🌸 p5.js 提示：您使用了 p5.js 的保留变量 "PI"，请确保将变量名更改为其他名称。(https://p5js.org/reference/#/p5/PI)

<ins>重新定义 p5.js 保留函数的示例</ins>
````JavaScript
function setup() {
  // text 是 p5.js 的保留函数
  let text = 100;
}
````
FES 将在控制台生成以下消息：
> 🌸 p5.js 提示：您使用了 p5.js 的保留函数 "text"，请确保将函数名更改为其他名称。


##### 位置
core/friendly_errors/sketch_reader.js

### `checkForUserDefinedFunctions()`
##### 描述
`checkForUserDefinedFunctions()` 函数用于检查是否使用了错误的大小写写法来调用任何用户定义的函数（如 `setup()`、`draw()`、`mouseMoved()` 等）。

生成并打印一个友好的错误消息，错误类型为 `fes.checkUserDefinedFns`。

##### 语法
````JavaScript
checkForUserDefinedFunctions(context)
````
##### 参数
```
@param {*} context  当前默认上下文。
                    在“全局模式”下设置为 window，在“实例模式”下设置为 p5 实例。
```
##### 示例
````JavaScript
function preLoad() {
  loadImage('myimage.png');
}
````
FES 将在控制台生成以下消息：
> 🌸 p5.js 提示：似乎您可能误写了 preLoad，应该是 preload。如果这不是您的意图，请进行更正。(http://p5js.org/reference/#/p5/preload)

##### 位置
core/friendly_errors/fes_core.js

### `_friendlyAutoplayError()`
##### 描述
`_friendlyAutoplayError()` 是在与播放媒体（例如视频）相关的错误发生时内部调用的函数，最常见的原因是浏览器的自动播放策略。

生成并打印一个友好的错误消息，错误类型为 `fes.autoplay`。
##### 位置
core/friendly_errors/fes_core.js


### `helpForMisusedAtTopLevelCode()`
##### 描述
`helpForMisusedAtTopLevelCode()` 是由 `fes_core.js` 在窗口加载时调用的函数，用于检查是否在 `setup()` 或 `draw()` 之外使用了 p5.js 的函数。

生成并打印一个友好的错误消息，错误类型为 `fes.misusedTopLevel`。
##### 参数
```
@param {*}        err    错误事件
@param {Boolean}  log    false
```
##### 位置
core/friendly_errors/fes_core.js

## 开发者备注：开发者的注释
#### 生成友好错误消息的其他 FES 函数
* `friendlyWelcome()` 直接打印到控制台。（默认情况下隐藏。）

* `stacktrace.js` 包含从 https://github.com/stacktracejs/stacktrace.js 借用的代码，用于解析错误堆栈。这是由 `fesErrorMonitor()` 和 `handleMisspelling()` 调用的。

#### 为参数验证准备 p5.js 对象
* 任何将用于参数验证的 p5.js 对象都需要在类声明中为 `name` 参数（对象的名称）分配一个值，例如：
```javascript
p5.newObject = function(parameter) {
   this.parameter = 'some parameter';
   this.name = 'p5.newObject';
};
````
* 内联文档：允许的参数类型包括 `Boolean`、`Number`、`String`，以及对象的名称（参见上述项目符号）。对于任何数组参数，请使用 `Array`。如果需要，可以在描述部分解释允许的特定类型的数组参数（例如 `Number[]`、`String[]`）。
* 目前支持的类类型（具有其 `name` 参数）：`p5.Color`、`p5.Element`、`p5.Graphics`、`p5.Renderer`、`p5.Renderer2D`、`p5.Image`、`p5.Table`、`p5.TableRow`、`p5.XML`、`p5.Vector`、`p5.Font`、`p5.Geometry`、`p5.Matrix`、`p5.RendererGL`。

#### FES 的性能问题

默认情况下，p5.js 启用了 FES，而在 `p5.min.js` 中禁用了 FES，以防止 FES 函数导致进程变慢。错误检查系统可能会显著降低代码的执行速度（在某些情况下高达约 10 倍）。请参阅[友好错误性能测试](https://github.com/processing/p5.js-website/tree/main/src/assets/learn/performance/code/friendly-error-system/)。

您可以在代码的顶部添加一行代码来禁用此功能：

```JavaScript
p5.disableFriendlyErrors = true; // 禁用 FES

function setup() {
  // 执行设置操作
}

function draw() {
  // 执行绘图操作
}
```

请注意，这将禁用导致性能下降的 FES 部分（例如参数检查）。没有性能成本的友好错误（例如在文件加载失败时给出描述性错误，或者在尝试在全局空间中覆盖 p5.js 函数时发出警告）将保持原样。


## 已知限制

* FES 可能仍然会导致假阴性的情况。这通常是由于设计与实际使用情况之间的不匹配而导致的（例如，绘图函数最初设计用于在 2D 和 3D 设置中可以互换使用），例如：
```JavaScript
const x3; // 未定义
line(0, 0, 100, 100, x3, Math.PI);
```
将逃过 FES 的检测，因为 `line()` 的内联文档中有一个可接受的参数模式（`Number`、`Number`、`Number`、`Number`）用于在 2D 设置中绘制。这也意味着当前版本的 FES 不会检查诸如 `_renderer.isP3D` 等环境变量。

* FES 仅能检测到使用 `const` 或 `var` 声明时覆盖的全局变量。如果使用 `let`，则无法检测到。由于 `let` 实例化变量的方式，目前无法解决这个问题。

* 目前，描述为 **`fesErrorMonitor()`** 下的功能仅在 Web 编辑器上或在本地服务器上运行时有效。有关更多详细信息，请参阅请求合并[#4730](https://github.com/processing/p5.js/pull/4730)。

* `sketch_reader()` 可能会在提取用户代码中的变量/函数名称时遗漏一些情况（例如，当所有代码都写在一行中时）。

## 未来工作的思考
* 为 Web 编辑器重新引入颜色编码。

* 增加更多单元测试以实现全面的测试覆盖。

* 更直观、更精确的输出信息。

* 所使用的所有颜色应对色盲友好。

* 识别更多常见的错误类型，并与 FES 进行概括（例如 `bezierVertex()`、`quadraticVertex()` - 需要初始化的对象未启动；检查 `nf()`、`nfc()`、`nfp()`、`nfs()` 的 Number 参数是否为正数）。

* 扩展全局错误捕获。这意味着捕获浏览器输出到控制台的错误，并与友好的消息进行匹配。`fesErrorMonitor()` 可以处理一些特定类型的错误，但对于更多类型的支持会很有帮助。

* 改进 `sketch_reader.js` 的代码读取和提取变量/函数名的功能（提取用户在代码中声明的函数和变量名）。例如，如果所有代码都写在一行中，`sketch_reader.js` 就无法正确提取变量/函数名。我们欢迎未来的提案，以识别所有这些"逃逸"情况，并添加单元测试以捕捉它们。

* `sketch_reader.js` 可以扩展，可以添加新功能（例如：当用户在 `draw()` 函数中声明变量时向用户发出警告）。以更好地帮助用户。
```JavaScript
// 这段代码片段使用新函数包装了 window.console 方法，以修改其功能
// 目前尚未实现，但可以使用它来提供更好格式的错误消息
const original = window.console;
const original_functions = {
    log: original.log,
    warn: original.warn,
    error: original.error
}
["log", "warn", "error"].forEach(function(func){
    window.console[func] = function(msg) {
      // 在包装函数中处理捕获的消息，然后调用原始函数
      original_functions[func].apply(original, arguments)
    };
});
```
* 从内联文档生成 FES 参考文档。这个生成的参考文档可以作为一个单独的系统，与我们主要的[p5.js参考文档]分开，将作为Sketch和控制台的函数分开，以减少可能的混淆。

[p5.js参考文档]: https://p5js.org/reference/
