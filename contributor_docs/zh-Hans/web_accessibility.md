# p5.js 网页可访问性

本文档描述了 p5.js 的网页可访问性功能的结构，供贡献者、维护者和其他相关方使用。如果您有兴趣使您的作品对屏幕阅读器可访问，请访问[教程](https://p5js.org/learn)，或者如果您想在屏幕阅读器上使用 p5.js，请访问[使用屏幕阅读器的 p5.js 教程](https://p5js.org/learn/p5-screen-reader.html)。

## 概述

由于画布 HTML 元素是位图，无法提供有关其上绘制形状的屏幕阅读器可访问信息，p5.js 提供了几个函数，使画布对屏幕阅读器更加可访问。

目前，p5.js 支持为画布上的基本形状（使用 `textOutput()` 和 `gridOutput()`）生成屏幕阅读器可访问的输出，以及用户生成的画布内容的屏幕阅读器可访问描述（使用 `describe()` 和 `describeElement()`）。

## 基本形状的库生成的可访问输出

基本形状的支持可访问输出包括文本输出和网格输出。

`textOutput()` 创建一个屏幕阅读器可访问的输出，描述画布上的形状。画布的一般描述包括画布大小、画布颜色和画布中的元素数量（例如："您的输出是一个大小为 400x400 像素的蓝色画布，其中包含以下 4 个形状："）。这个描述后面是形状的列表，其中描述了每个形状的颜色、位置和面积（例如："左上角的橙色椭圆，覆盖画布的 1%"）。可以选择每个元素以获取更多详细信息。还提供了一个元素表格，在这个表格中，描述了形状、颜色、位置、坐标和面积（例如："橙色椭圆，位置：左上角，面积：2"）。

`gridOutput()` 根据每个形状的空间位置，将画布的内容以网格（HTML表格）的形式布局。在表格输出之前，会提供画布的简要描述。该描述包括背景颜色、画布大小、对象数量和对象类型（例如："淡紫蓝色画布尺寸为200x200，包含4个对象 - 3个椭圆和1个矩形"）。网格以空间方式描述内容，每个元素根据其位置放置在表格的单元格中。在每个单元格中，提供元素的颜色和形状类型（例如："橙色椭圆"）。这些描述可以单独选择以获取更多细节。还提供了一个元素列表，其中描述了形状、颜色、位置和面积（例如："橙色椭圆 位置=左上角 面积=1%"）。

如果用户将 `LABEL` 作为参数传递给上述任何一个函数，将创建一个附加的 div，其中包含与画布相邻的输出。这对于非屏幕阅读器用户来说很有用，他们可能希望将输出显示在画布的子 DOM 之外。然而，对于屏幕阅读器用户，使用 `LABEL` 会造成不必要的冗余。我们建议仅在开发过程中使用 `LABEL`，在发布或与屏幕阅读器用户共享草稿之前将其删除。

### 输出结构
尽管 `textOutput()` 和 `gridOutput()` 位于 [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 中，但输出是使用库中分布的多个函数创建和更新的。本节详细介绍支持可访问输出的不同函数。

#### outputs.js
[src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 包含创建可访问输出的核心函数：
* `textOutput()`: 此函数通过将 `this._accessibleOutputs.text` 设置为 `true` 并调用 `_createOutput('textOutput', 'Fallback')` 来激活文本输出。如果作为参数传递了 `LABEL`，函数还会通过将 `this._accessibleOutputs.textLabel` 设置为 `true` 并为标签调用 `_createOutput('textOutput', 'Label')` 来激活文本输出标签。
* `gridOutput()`: 此函数通过将 `this._accessibleOutputs.grid` 设置为 `true` 并调用 `_createOutput('gridOutput', 'Fallback')` 来激活网格输出。如果作为参数传递了 `LABEL`，函数还会通过将 `this._accessibleOutputs.textLabel` 设置为 `true` 并为标签调用 `_createOutput('gridOutput', 'Label')` 来激活网格输出标签。
* `_createOutput()`: 此函数为所有可访问输出创建 HTML 结构。根据输出的类型和显示方式，创建的 HTML 结构会有所不同。该函数还会初始化 `this.ingredients`，其中存储了所有输出的数据，包括形状、颜色和 pShapes（其中存储画布先前形状的字符串）。如果 `this.dummyDOM` 不存在，它还会创建 `this.dummyDOM`。`this.dummyDOM` 存储了 `<body>` 内的 DOM 元素的 HTML 集合。
* `_updateAccsOutput()`: 如果使用 accessibleOutputs，在 `setup()` 和 `draw()` 结束时调用此函数。如果 `this.ingredients` 与当前输出不同，该函数会调用输出的更新函数（`_updateGridOutput` 和 `_updateTextOutput`）。只在 `setup()` 和 `draw()` 结束时调用此函数，并且只在成分不同的情况下调用 `_updateGridOutput` 和 `_updateTextOutput`，有助于避免对屏幕阅读器造成过多负担。
* `_addAccsOutput()`: 当 accessibleOutputs 为 true 时，此函数返回 true。
* `_accsBackground()`: 在 `background()` 结束时调用此函数。它重置 `this.ingredients.shapes`，如果背景色与先前不同，则调用 `_rgbColorName()` 获取颜色的名称，并将其存储在 `this.ingredients.colors.background` 中。
* `_accsCanvasColors()`: 在 `fill()` 和 `stroke()` 结束时调用此函数。此函数通过将填充和描边颜色保存在 `this.ingredients.colors.fill` 和 `this.ingredients.colors.stroke` 中来更新填充和描边颜色。它还调用 `_rgbColorName()` 来获取颜色的名称。
* `_accsOutput()`: 构建 `this.ingredients.shapes`，其中包括用于创建输出的所有形状。此函数在基本形状函数结束时调用（参见 accessible output beyond src/accessibility）。根据调用它的形状，`_accsOutput()` 可能会调用辅助函数来收集有关将用于创建输出的该形状的所有信息。这些辅助函数不是原型的一部分，包括：
  * `_getMiddle()`: 返回矩形、弧形、椭圆、三角形和四边形的中心点或质心。
  * `_getPos()`: 返回形状在画布上的位置（例如：'左上角'、'右中'）。
  * `_canvasLocator()`: 返回映射到画布的 10*10 网格上的形状的位置。
  * `_getArea()`: 返回形状的面积占画布总面积的百分比。

当 `this._accessibleOutputs.text` 或 `this._accessibleOutputs.text` 为 `true` 时，p5.js 库中的多个函数会调用 output.js 中的函数：
* `_accsOutput()` 在以下函数中被调用：
  * `p5.prototype.triangle()`
  * `p5.prototype._renderRect()`
  * `p5.prototype.quad()`
  * `pp5.prototype.point()`
  * `p5.prototype.line()`
  * `p5.prototype._renderEllipse()`
  * `p5.prototype.arc()`
* `_updateAccsOutput()` 在以下函数中被调用：
  * `p5.prototype.redraw()`
  * `p5.prototype.resizeCanvas()`
  * `this._setup`
* `_accsCanvasColors()` 在以下函数中被调用：
  * `p5.Renderer2D.prototype.stroke()`
  * `p5.Renderer2D.prototype.fill()`
* `_accsBackground()` 在以下函数中被调用：
  * `p5.Renderer2D.prototype.background()`

#### textOutput.js
[src/accessibility/textOutput.js](https://github.com/processing/p5.js/blob/main/src/accessibility/textOutput.js) 包含更新文本输出的所有函数。该文件中的主要函数是 `_updateTextOutput()`，在 [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 中的 `_updateAccsOutput()` 调用该函数，当 `this._accessibleOutputs.text` 或 `this._accessibleOutputs.textLabel` 为 `true` 时调用。

`_updateTextOutput()` 使用 `this.ingredients` 构建文本输出和文本输出标签的内容，包括摘要、形状列表和形状详情表格。如果这些内容与当前输出不同，它会更新它们。构建输出内容由文件中的几个辅助函数支持，这些函数不是原型的一部分：
* `_textSummary()`: 构建文本输出摘要的内容。
* `_shapeDetails()`: 构建包含形状详情的文本输出表格。
* `_shapeList()`: 构建文本输出的形状列表。

#### gridOutput.js
[src/accessibility/gridOutput.js](https://github.com/processing/p5.js/blob/main/src/accessibility/gridOutput.js) 包含更新网格输出的所有函数。该文件中的主要函数是 `_updateGridOutput()`，在 [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 中的 `_updateAccsOutput()` 调用该函数，当 `this._accessibleOutputs.grid` 或 `this._accessibleOutputs.gridLabel` 为 `true` 时调用。

`_updateGridOutput()` 使用 `this.ingredients` 构建网格输出和网格输出标签的内容，包括摘要、映射形状位置的网格和形状列表。如果这些内容与当前输出不同，它会更新它们。构建输出内容由文件中的几个辅助函数支持，这些函数不是原型的一部分：
* `_gridSummary()`: 构建网格输出摘要的内容。
* `_gridMap()`: 构建映射形状在画布上位置的网格。
* `_gridShapeDetails()`: 构建网格输出的形状列表，列表的每一行都包含形状的详细信息。

#### color_namer.js
在创建屏幕阅读器可访问的输出时，命名画布中使用的颜色很重要。[src/accessibility/color_namer.js](https://github.com/processing/p5.js/blob/main/src/accessibility/color_namer.js) 包含 `_rgbColorName()` 函数，该函数接收 RGBA 值并返回颜色名称。该函数由 [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) 中的 `_accsBackground()` 和 `_accsCanvasColors` 调用。

`_rgbColorName()` 使用 `color_conversion._rgbaToHSBA()` 获取颜色的 HSV 值，然后使用 `_calculateColor()` 获取颜色名称。此文件中的 `_calculateColor()` 函数来自 [colorNamer.js](https://github.com/MathuraMG/color-namer)，它是作为 [2018 年 Processing Foundation fellowship](https://medium.com/processing-foundation/making-p5-js-accessible-e2ce366e05a0) 的一部分和与盲人屏幕阅读器专家用户协商开发的。此函数通过将 HSV 值与 `colorLookUp` 数组中存储的值进行比较来返回颜色名称。这个函数应该进行更新，因为某些灰色的阴影没有正确命名。在更新时，还重要的是通过包含解释每行代码的注释来确保贡献者的可读性。

## 用户生成的可访问画布描述

### describe()
`describe()` 函数为画布创建一个供屏幕阅读器访问的描述。第一个参数应为一个描述画布的字符串。第二个参数是可选的。如果指定了该参数，它决定描述的显示方式。所有的描述都成为画布元素的子 DOM 的一部分。如果用户将第二个参数设置为 `LABEL`，则会创建一个相邻于画布的附加描述的 `<div>`。

`describe()` 在 [src/accessibility/describe.js](https://github.com/processing/p5.js/blob/main/src/accessibility/describe.js) 中被多个函数支持：
* `_descriptionText()`: 检查文本不是 `LABEL` 或 `FALLBACK`，并确保文本以标点符号结尾。如果文本不以 '.'、','、';'、'?'、'!' 结尾，则该函数在字符串末尾添加一个 '.'。返回文本。
* `_describeHTML()`: 创建画布的备用 HTML 结构。如果 `describe()` 的第二个参数是 `LABEL`，则该函数创建一个相邻于画布元素的 `<div>` 来显示描述文本。

### describeElement()
`describeElement()` 函数为绘图元素或一组共同产生含义的形状创建一个供屏幕阅读器访问的描述。第一个参数应为元素的名称字符串，第二个参数应为元素的描述字符串。第三个参数是可选的。如果指定了该参数，它决定描述的显示方式。所有元素描述都成为画布元素的子 DOM 的一部分。如果用户将第三个参数设置为 `LABEL`，则会创建一个相邻于画布的附加元素描述的 `<div>`。

`describeElement()` 在 [src/accessibility/describe.js](https://github.com/processing/p5.js/blob/main/src/accessibility/describe.js) 中被多个函数支持：
* `_elementName()`: 检查元素名称不是 `LABEL` 或 `FALLBACK`，并确保文本以冒号结尾。返回元素名称。
* `_descriptionText()`: 检查文本不是 `LABEL` 或 `FALLBACK`，并确保文本以标点符号结尾。如果文本不以 '.'、','、';'、'?'、'!' 结尾，则该函数在字符串末尾添加一个 '.'。返回文本。
* `_describeElementHTML()`: 创建画布的备用 HTML 结构。当 `describeElement()` 的第二个参数是 `LABEL` 时，该函数创建一个相邻于画布元素的 `<div>` 来显示描述文本。
