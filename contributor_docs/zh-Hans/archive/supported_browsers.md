# 支持的浏览器

## 我们的目标

p5.js使用[browserslist](https://browsersl.ist/)和[Babel](https://babeljs.io/)来支持较旧的浏览器。我们使用的browserslist配置是[`last 2 versions, not dead`](https://browserslist.dev/?q=bGFzdCAyIHZlcnNpb25zLCBub3QgZGVhZA%3D%3D)。`last 2 versions`表示任何浏览器的最近两个版本，`not dead`表示在过去24个月内有官方支持或更新的浏览器。浏览器必须同时满足这两个条件才能得到支持。

在实际使用中，您仍然可以使用大多数最新的JavaScript功能，因为Babel通常可以将它们转译或填充为与所需的兼容性列表相匹配的内容。某些功能，例如[Web API](https://developer.mozilla.org/en-US/docs/Web/API)、[WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)或类似的不属于核心JavaScript语言的功能无法由Babel处理，需要根据具体情况进行评估。

检查某个功能是否可用的好地方是[caniuse.com](https://caniuse.com/)和[MDN](https://developer.mozilla.org/en-US/)。

## 适用范围

支持的浏览器要求适用于p5.js源代码、所有示例（包括网站示例页面和文档）以及所有官方教程。第三方附加库不必遵守相同的要求，但鼓励他们这样做。

在许多情况下，虽然不被官方支持的浏览器可能仍然可以与p5.js一起使用，但我们对此情况不提供任何保证。

各部分的负责人将负责确保涉及代码更改的PR符合此要求。
