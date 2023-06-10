# 🌸 p5.js友好错误系统（FES）

## 概述

友好错误系统（FES，🌸）旨在通过提供简单友好的错误信息，帮助新手程序员。它通过在错误消息中添加替代描述和有用的参考链接，补充了浏览器控制台的错误消息。

FES将消息打印在控制台窗口中，可以在[p5.js Web Editor]和浏览器的JavaScript控制台中看到。单个压缩文件的p5（p5.min.js）不包含FES。

[p5.js Web Editor]: https://editor.p5js.org/

## 降低调试障碍
工具的设计应该符合将使用它的人的需求。作为旨在降低调试障碍的工具，FES的设计也不例外。

评估我们现有设计的最佳方法是直接听取使用p5.js的人们的意见。我们在2021年进行了社区调查，以收集对友好错误的反馈和未来期望。

我们相信来自社区成员的见解对于我们的贡献者将是有帮助的。您可以通过摘要漫画或完整报告来查看结果：
* [21-22 FES调查报告漫画]
* [21-22 FES调查完整报告]

[21-22 FES调查报告漫画]: https://almchung.github.io/p5jsFESsurvey/
[21-22 FES调查完整报告]: https://observablehq.com/@almchung/p5-fes-21-survey

## 编写友好错误信息

如何通过编写和翻译错误消息来为p5.js库做出贡献？

FES是p5.js国际化工作的一部分。我们通过基于[i18next]的`translator()`函数生成所有FES消息的内容。这种动态错误消息生成适用于所有语言，包括p5.js的默认语言英语。

我们欢迎来自世界各地的贡献！🌐

[i18next]: https://www.i18next.com/
#### 编写最佳实践

FES消息编写者应该优先考虑降低理解错误消息的障碍，增加调试过程的可访问性。

[Friendly Errors i18n Book]讨论了在跨文化i18n环境中编写友好错误消息的挑战和最佳实践。以下是书中的一些要点：

* 了解您的受众：不要对我们的错误消息的受众做出假设。尝试了解谁在使用我们的库以及他们如何使用它。
* 保持语言包容性。我们努力使错误消息“友好”，这对您来说意味着什么？在您的语言中寻找可能的

偏见和伤害。遵守[p5.js行为准则]。
* 尽量使用简单的句子。考虑将句子分成较小的块，以最大程度地利用i18next的[插值]功能。
* 优先考虑跨文化沟通，并在不同语言之间提供出色的体验。避免使用成语。
* 逐步介绍一个技术概念或技术术语。保持技术写作的一致性。尝试链接一个用简明实例编写的面向初学者的外部资源。

[Friendly Errors i18n Book]: https://almchung.github.io/p5-fes-i18n-book/
[插值]: https://www.i18next.com/translation-function/interpolation
[p5.js行为准则]: https://github.com/processing/p5.js/blob/main/CODE_OF_CONDUCT.md#p5js-code-of-conduct
[专家的盲点]: https://tilt.colostate.edu/TipsAndGuides/Tip/181

[Friendly Errors i18n Book]是一个公共项目，您可以通过这个单独的[repo]为该书做出贡献。

[repo]: https://github.com/almchung/p5-fes-i18n-book
#### 翻译文件的位置

`translator()`基于i18next，从`src/core/internationalization.js`中导入。它通过从JSON翻译文件中查找文本数据来生成消息：
```
translations/{{检测到的语言代码，默认为en}}/translation.json
```

示例：
如果检测到的浏览器语言环境是韩语（语言标识符：`ko`），`translator()`将从`translations/ko/translation.json`中读取翻译的文本块。然后，`translator()`将将文本块组合成最终的消息。

语言标识符还可以包括地区信息，例如`es-PE`（秘鲁的西班牙语）。

#### 翻译文件的结构
`translation.json`具有[i18next使用的格式](https://www.i18next.com/misc/json-format)。

翻译文件的基本格式是在花括号`{}`中使用双引号`""`括起来的键和值（消息）：
```json
{ "key": "value" }
```
例如，我们有一个以此格式保存的ASCII标志：
```json
"logo": "    _ \n /\\| |/\\ \n \\ ` ' /  \n / , . \\  \n \\/|_|\\/ \n\n"
```
i18next支持插值，允许我们传递一个变量以动态生成消息。我们使用两个花括号`{{}}`来设置变量的占位符：
```json
"greeting": "你好，{{who}}！"
```
这里，键是`greeting`，变量名是`who`。

为了动态生成该消息，我们需要传

递一个值：
```JavaScript
translator('greeting', { who: 'everyone' } );
```
由`translator`生成的结果将如下所示：
```
你好，everyone！
```

这是`fes`中的一个项`fileLoadError`，演示了插值：
```json
"image": "看起来加载图像时出现问题。{{suggestion}}"
```
为了动态生成最终的消息，FES将使用该键和预先生成的`suggestion`值调用`translator()`。
```JavaScript
translator('fes.fileLoadError.image', { suggestion });
```

#### 如何添加或修改翻译

[国际化文档]提供了逐步指南，介绍了如何添加和修改翻译文件。

[国际化文档]: https://github.com/processing/p5.js/blob/main/contributor_docs/internationalization.md


## 理解FES的工作原理
在本节中，我们将概述FES如何生成和显示消息。有关FES函数的更详细信息，请参阅我们的[FES参考+开发笔记]。

[FES参考+开发笔记]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md


#### 概览
p5.js从多个位置调用FES，以处理不同的情况，包括：
* 浏览器引发错误。
* 用户代码调用p5.js API的函数。
* 其他用户可以从帮助消息中受益的自定义情况。

#### FES代码位置
您可以在以下位置找到FES的核心组件：
`src/core/friendly_errors`。
您可以在以下位置找到`translator()`使用的翻译文件：
`translations/`。

#### FES消息生成器
这些函数主要负责捕获错误并生成FES消息：
* [`_friendlyFileLoadError()`]捕获文件加载错误。
* [`_validateParameters()`]基于内联文档检查p5.js函数的输入参数。
* [`_fesErrorMontitor()`]处理全局错误。

有关完整参考，请参阅我们的[开发笔记]。

[`_friendlyFileLoadError()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#_friendlyfileloaderror
[`_validateParameters()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#validateparameters
[`_fesErrorMontitor()`]: https://github.com/processing/p5.js/blob/main/con


FES消息生成器
这些函数主要负责捕获错误并生成FES消息：
* [`_friendlyFileLoadError()`] 捕获文件加载错误。
* [`_validateParameters()`] 根据内联文档检查p5.js函数的输入参数。
* [`_fesErrorMontitor()`] 处理全局错误。

如需完整参考，请查阅我们的[开发笔记]。

[`_friendlyFileLoadError()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#_friendlyfileloaderror
[`_validateParameters()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#validateparameters
[`_fesErrorMontitor()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#feserrormonitor
[开发笔记]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md

FES消息显示器
`fes_core.js/_friendlyError()` 在控制台中打印生成的友好错误消息。例如：

```JavaScript
p5._friendlyError(
  translator('fes.globalErrors.type.notfunc', translationObj)
);
```
该函数可以在p5的任何地方调用。

关闭FES
可能有些情况下您希望[禁用FES以提升性能]。

当`p5.disableFriendlyErrors`设置为`true`时，您可以关闭FES。

示例：
```JavaScript
p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(100, 50);
}
```

p5的单个压缩文件（即p5.min.js）会自动省略FES。

[禁用FES以提升性能]: https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes
