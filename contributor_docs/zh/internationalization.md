# 🌐 国际化

[国际化](https://developer.mozilla.org/docs/Glossary/Internationalization_and_localization)（有时缩写为"i18n"）是指在软件项目中支持多种语言。这通常意味着维护项目中使用的文本字符串的翻译，并允许用户选择他们接收的翻译（或根据其浏览器设置进行自动检测）。

p5.js 在许多领域使用国际化（我们的贡献者文档、[官方网站](https://p5js.org)、参考文档等）。我们正在扩展国际化工作范围，包括 p5.js 的控制台输出（主要是面向开发人员的错误消息）。

## 工具

我们将 [i18next](https://www.i18next.com) 集成到代码库中。目前我们只在未压缩的 p5.js 构建中使用它。`p5.min.js` 只包含国际化代码的外层部分，并且不使用它。

### 设置

我们在 `src/core/internationalization.js` 中设置了 i18next 集成，翻译文件位于 `translations/` 目录下。

我们在 p5 sketch 初始化之前设置翻译引擎，并根据用户浏览器的设置自动检测用户的语言。这确保我们可以为 `setup()` 和 `preload()` 中遇到的任何错误使用翻译。

（如果在语言自动检测中遇到任何错误，我们会回退到英语。）

#### `p5.min.js` 中没有翻译

在 browserify 构建任务和 `src/core/init.js` 中有特定的逻辑，避免在压缩的构建中加载或设置翻译。添加翻译不会增加压缩构建的大小。

### 使用翻译

要使用翻译，请在文件顶部添加以下行。

```js
import { translator } from './internationalization';
```

### 简单消息

在没有国际化的情况下，您可能会直接记录一条消息。

```js
console.log('Loading your sketch right now!')
```

相反，您可以使用 `translator`：

```js
console.log(translator('sketch.loading'))
```

这会告诉翻译器以用户偏好的任何语言获取 "`sketch.loading`" 消息。

#### 动态消息

您还可以将变量插入翻译后的消息。例如，

```js
console.log('I couldnt find ' + file.name + '. Are you sure it's there?')
```

会变成类似于

```js
console.log(translator('fileLoading.notFound', { fileName: file.name }))
```

此类翻译期望使用特定名称的变量，请确保使用该名称。查看翻译文件（在 translations/{YOUR_LANGUAGE}/ 中查找）以查看变量名称。您将在翻译键的对象路径下找到翻译。

"`fileLoading.notFound`" 可以在以下位置找到：

```json
{
  "fileLoading": {
    "notFound": "I couldnt find {{fileName}}. Are you sure it's there?"
  }
}
```

变量用 "`{{` `}}`" 括起来。

### 修改翻译

只需打开 `translations/{YOUR_LANGUAGE}/translation.json`，找到具有键的翻译（就像上面的示例），然后进行编辑！

### 为新语言添加翻译

最简单的方法是将语言代码（例如德语的 "de"、意大利语的 "it" 等）添加到 `package.json` 的[语言列表](https://github.com/processing/p5.js/blob/84bc1f92c89786f48e5d6fd1045feb649b932eea/package.json#L111-L114)，然后从终端运行 '$ npm run build'。

这将在 `translations/{LANGUAGE_CODE}/` 中为您生成一个全新的翻译文件！现在，您可以开始填充它的翻译内容了！🥖

您还需要在 [`translations/index.js`](../translations/index.js) 和 [`translations/dev.js`](../translations/dev.js) 中添加一个条目。您可以按照该文件中对 `en` 和 `es` 使用的模式进行操作。

### 测试更改
大部分翻译内容不包含在最终库中，而是托管在线，并在 p5.js 需要时自动下载。对这些翻译的更新仅在发布新版本的 p5.js 时才会进行。

然而，如果您想查看您的更改（或尚未发布的任何其他更改），您可以简单地运行 `npm run dev`，这将构建 p5.js 并配置为使用本地计算机上存在的翻译文件，而不是互联网上的文件。

### 进一步阅读

请参阅 [i18next 翻译函数文档](https://www.i18next.com/translation-function/essentials)。上述文档仅是其功能的一个子集。
