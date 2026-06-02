<!-- 正在寻找一种支持友好错误信息的方法？请按照此步骤指南操作！ -->

# 如何添加友好错误信息

本指南将引导您完成使用友好错误系统（FES，🌸）编写友好错误（FE）信息的步骤。如果您的新方法支持自定义错误处理或为用户输出自定义日志，您可能需要为其编写友好错误信息。所有这些信息都是通过基于[i18next](https://www.i18next.com/)的`translator()`方法动态生成的，这使得p5.js能够提供与用户环境匹配的错误信息翻译。


## ❗️`p5.min.js`中没有翻译

- 我们已将 \[i18next] 集成到我们的代码库中。但是，它的使用仅限于p5.js的未压缩版本。压缩版本`p5.min.js`仅包含我们国际化代码的基本框架，不包含实际实现。
- 在Browserify构建任务和`src/core/init.js`中，有特定的逻辑来避免在压缩版本中加载或设置翻译。因此，添加翻译不会影响`p5.min.js`的大小。


## 前提条件

在开始之前，请确定以下哪种情况最符合您的需求：

- 您正在添加一个需要特定数量和类型参数的新方法。
  - 请前往[✅使用FES添加参数验证](#-使用fes添加参数验证)。
- 您的方法涉及加载特定类型的文件，并且您需要捕获特定于加载文件的错误。
  - 请前往[📥使用FES添加文件加载错误](#-使用fes处理文件加载错误消息)。
- 您已编写代码检测错误何时发生，并希望显示友好错误。
  - 请前往[🐈使用FES添加库错误信息](#-使用fes添加库错误信息)。



## ✅ 使用FES添加参数验证

### 第1步 – 再次检查您的内联文档

首先，确保您的方法有[内联文档](./contributing_to_the_p5js_reference.md)，其中包含完整的参数列表。

例如，`circle()`方法有以下内联文档，以方法描述开始，后面是参数列表，然后是示例代码：

```
/**
 * 在画布上绘制一个圆。圆是一个圆形形状。
 * 圆边缘上的每个点到其中心的距离相同。
 * 默认情况下，前两个参数设置圆中心的位置。
 * 第三个参数设置形状的宽度和高度（直径）。
 * 可以使用<a href="#/p5/ellipseMode">ellipseMode()</a>函数更改原点。
 *
 * @method circle
 * @param  {Number} x  圆中心的x坐标。
 * @param  {Number} y  圆中心的y坐标。
 * @param  {Number} d  圆的直径。
 * @chainable
 * @example
 * <div>
 * <code>
 * circle(30, 30, 20);
 * describe('灰色画布中央带有黑色轮廓的白色圆圈。');
 * </code>
 * </div>
 *
 */
```

从上面的例子中，FES将查找参数列表以验证参数：

```
 * @method circle
 * @param  {Number} x  圆中心的x坐标。
 * @param  {Number} y  圆中心的y坐标。
 * @param  {Number} d  圆的直径。
```


### 第2步 – 调用`p5._validateParameters()`

现在回到您方法的实现，按照以下格式调用`validate_params()`：`p5._validateParameters('[您方法的名称]', arguments);`。

例如，以下代码将验证`circle()`的参数并生成FE信息：

```js
p5._validateParameters('circle', arguments);
```

通常在方法中首先调用此函数，以避免在提供的参数不符合预期时继续执行。例如，它在`circle()`方法的第一行被调用：

```js
p5.prototype.circle = function() {
  p5._validateParameters('circle', arguments);
  const args = Array.prototype.slice.call(arguments, 0, 2);
  args.push(arguments[2]);
  args.push(arguments[2]);
  return this._renderEllipse(...args);
};
```


### 第3步 – 构建并测试您的代码以应对典型情况

要查看参数验证的效果，请使用`npm run build`重新构建`p5.js`。

要测试您的代码，找到`/lib/empty-example/index.html`并将脚本`../p5.min.js`替换为`../p5.js`，如下例所示：

```js
<script src="../p5.js"></script>
```

请注意，`lib/p5.min.js`不支持FE信息，因此请使用`lib/p5.js`进行测试。

然后，编辑`/lib/empty-example/sketch.js`来测试典型的参数错误情况：

1. 缺少参数
2. 参数数量错误
3. 参数类型错误

以下是测试`circle()`方法表达式的示例：

```js
// 缺少参数
circle(100);
// 参数数量错误（超过所需数量）
// 注意这段代码仍然能成功绘制一个圆。
circle(100, 100, 100, 1000);
// 参数类型错误
circle(100, 100, 'hello');
```

上面的代码应该生成以下FE信息：

```
🌸 p5.js says: [sketch.js, line 9] circle()需要至少3个参数，但只收到了1个。 (https://p5js.org/reference/p5/circle)
🌸 p5.js says: [sketch.js, line 14] circle()需要不超过3个参数，但收到了4个。 (https://p5js.org/reference/p5/circle)
🌸 p5.js says: [sketch.js, line 12] circle()的第三个参数需要Number类型，但收到了string类型。 (https://p5js.org/reference/p5/circle)
```

恭喜🎈！您现在已经完成了为新方法添加参数验证。


## 📥 使用FES处理文件加载错误消息

### 第1步 – 检查文件加载错误情况列表<a id="step-1"></a>

文件加载错误分为多个不同的情况，以便在错误发生时提供尽可能有帮助的信息。这使p5.js能够在不同情况下显示不同的错误。例如，当它无法读取字体文件中的数据时，它会显示一个与尝试加载过大无法读取的文件时不同的错误。

这些情况都有自己的编号，可以在`core/friendly_errors/file_errors.js`文件的顶部找到。

当您希望添加文件加载错误时，首先查看`core/friendly_errors/file_errors.js`中的`fileLoadErrorCases`，看看是否有适用于您情况的现有案例。



例如，您可能正在加载基于字符串的文件。这对应于`fileLoadErrorCases`中的`case 3`：

```js
case 3:
  return {
    message: translator('fes.fileLoadError.strings', {
      suggestion
    }),
    method: 'loadStrings'
  };
```

如果您正在处理的场景已经有相关的编号，请记住案例编号，并跳至[**第4步**](#step-4)。如果您在`fileLoadErrorCases`中找不到匹配的情况，请转到[**第2步**](#step-2)创建新的情况。


### 第2步 – 在问题面板上讨论添加新的错误情况<a id="step-2"></a>

接下来，您将提交一个问题工单，讨论创建新的情况或确认您的情况不是现有情况的重复。编写一个简短的段落描述您的新方法以及用户可能遇到这种特定文件加载错误的场景。然后再写一个简短的段落描述您方法中的错误处理以及它加载的文件类型。

转到[问题面板](https://github.com/processing/p5.js/issues)，按"New Issue"按钮，然后选择"Issue: 💡 Existing Feature Enhancement"选项。应该出现一个空表单。

添加一个标题，如"向`fileLoadErrorCases`添加新情况：\[您的文件加载错误情况的高级描述]"。对于"Increasing access"部分，输入您在此步骤开始时准备的简短段落，描述典型情况。

然后，在"Most appropriate sub-area of p5.js?"问题中勾选"Friendly Errors"框。最后，在"Feature enhancement details"部分，输入详细说明错误处理和加载文件类型的段落。


### 第3步 – 向`fileLoadErrorCases`添加新情况<a id="step-3"></a>

在与维护者确认后，您可以向`fileLoadErrorCases`添加新情况。在`fileLoadErrorCases`的`switch`语句中，转到情况列表的末尾，并按照以下格式添加新情况：

```
case {{next available case number}}:
  return {
    message: translator('fes.fileLoadError.{{tag name}}', {
      suggestion
    }),
    method: '{{name of your method}}'
  };
```

在上面的例子中，双尖括号（`{{}}`）中的任何内容都是您应该替换的内容。例如，如果前一个情况编号是11，您的代码应该以`case 12:`开始，最终代码中没有双括号。


### 第4步 – 调用`p5._friendlyFileLoadError()`<a id="step-4"></a>

添加您的情况后，您现在可以在错误处理语句中调用`p5._friendlyFileLoadError([情况编号], [文件路径])`。

例如，请查看`loadStrings()`方法加载基于字符串的文件（对应于`fileLoadErrorCases`中的`case 3`）。`loadStrings()`方法使用[`httpDo.call()`](https://p5js.org/reference/p5/httpDo)和一个在文件错误情况下执行的自定义回调方法：

```js
p5.prototype.httpDo.call(
  this,
  args[0],
  'GET',
  'text',
  data => {
    // [... 省略的代码 ...]
  },
  function(err) {
    // 错误处理
    p5._friendlyFileLoadError(3, args[0]);
    // [... 省略的代码 ...]
  }
 );
```

我们可以看到错误回调函数如何调用`p5._friendlyFileLoadError(3, [the first argument, which is a file path])`来生成以下FE信息：

```
🌸 p5.js says: 看起来加载文本文件时出现了问题。请检查文件路径(assets/wrongname.txt)是否正确，尝试在线托管文件，或运行本地服务器。
+ 更多信息：https://github.com/processing/p5.js/wiki/Local-server
```

恭喜🎈！您现在已经完成为带有文件加载的方法实现FE。



## 🐈 使用FES添加库错误信息

### 第1步 – 编写代码检测错误何时发生

首先，查找用户在使用您的方法时可能遇到的典型错误情况，并创建逻辑来捕获这些情况。此外，如果适用，请考虑提供故障保护措施，例如为缺少的参数使用默认值。确定对用户有帮助的FE信息的情况。

[MDN Web文档中的这个指南](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)提供了关于控制流和JavaScript原生错误处理结构的良好概述。

\



### 第2步 – 调用`p5._friendlyError()`

要生成FE信息，您只需要在错误处理语句中按照以下格式调用`p5._friendlyError('[custom message]', '[method name]');`。将方括号内（包括方括号）的所有内容替换为您自己的值。

例如，以下代码将为`bezierVertex()`生成FE信息：

```js
p5._friendlyError(
  '在调用bezierVertex()之前必须先使用vertex()',
  'bezierVertex'
);
```

这应该生成以下FE信息：

```
🌸 p5.js says: [sketch.js, line 19] 当调用bezierVertex时，p5js库内部发生了一个错误，错误信息为"在调用bezierVertex()之前必须先使用vertex()"。如果没有特别说明，可能是传递给bezierVertex的参数有问题。 (https://p5js.org/reference/p5/bezierVertex) 
```

恭喜🎈！您现在已经完成了为您的方法添加库错误信息。


## ✏️ 为国际受众编写友好错误信息

FES信息编写者应优先降低理解错误信息的障碍，提高调试过程的可访问性。以下是一个例子：

```
🌸 p5.js says: [sketch.js, line 7] circle() was expecting at least 3 arguments, but received only 1. (https://p5js.org/reference/p5/circle) 
```

如果浏览器设置为`ko-KR`（韩语）区域设置，上述参数验证信息将以韩语显示：

```
🌸 p5.js says: [sketch.js, 줄7] 최소 3개의 인수(argument)를 받는 함수 circle()에 인수가 1개만 입력되었습니다. (https://p5js.org/reference/p5/circle) 
```

[友好错误i18n指南](https://almchung.github.io/p5-fes-i18n-book/)讨论了在跨文化i18n上下文中编写友好错误信息的挑战和最佳实践。以下是该指南的主要观点：

- 了解您的受众：不要对错误信息的受众做出假设。尝试了解谁在使用我们的库以及他们如何使用它。
- 保持语言包容性。我们努力使错误信息"友好"，这对您意味着什么？寻找语言中可能的偏见和伤害。
- 尽可能使用简单的句子。考虑将句子分解成更小的块，以最好地利用[i18next的插值功能](https://www.i18next.com/translation-function/interpolation)。
- 优先考虑跨文化交流，并提供跨语言的良好体验。避免使用比喻手法。
- 一次只介绍一个技术概念或技术术语。保持技术写作的一致性。尝试链接一个以初学者友好语言编写的外部资源，其中包含大量简短、实用的示例。

[友好错误i18n指南](https://almchung.github.io/p5-fes-i18n-book/)是一个公共项目，您可以通过[这个单独的仓库](https://github.com/almchung/p5-fes-i18n-book)为该指南做出贡献。


## 🔍 可选：单元测试

请考虑为您的新FE信息添加单元测试，以便尽早发现错误并确保您的代码向用户传递预期的信息。此外，单元测试是确保其他贡献者的新代码不会意外破坏或干扰您的代码功能的好方法。以下是几个关于单元测试的好指南：

- [单元测试和测试驱动开发](https://archive.p5js.org/learn/tdd.html)，作者Andy Timmons
- [贡献者文档：单元测试](./unit_testing.md)



示例：

```js
suite('validateParameters: multi-format', function() {
  test('color(): 可选参数，类型不正确', function() {
    assert.validationError(function() {
      p5._validateParameters('color', [0, 0, 0, 'A']);
    });
  });
}
```


## 结论

在本指南中，我们提供了为多种不同情况添加FE信息的分步说明，包括：

- 添加参数验证，
- 处理文件加载错误，以及
- 为方法添加库错误信息。

此外，我们很高兴通过2021-2022年进行的FES调查分享我们社区的见解。调查结果以两种格式提供：

- [21-22 FES调查报告漫画](https://almchung.github.io/p5jsFESsurvey/)
- [21-22 FES调查完整报告](https://observablehq.com/@almchung/p5-fes-21-survey)

有关FES设计和技术方面的更深入信息，请参阅[FES自述文档](./friendly_error_system.md)。该文档提供了详细的解释和开发说明，对那些寻求更深入了解FES的人有所帮助。 
