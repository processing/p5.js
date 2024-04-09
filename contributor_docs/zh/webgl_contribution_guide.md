<!-- 如何开始着手处理 p5.js WebGL 模式的源代码。 -->

# WebGL 贡献指南

如果你正在阅读该文档，那么你可能对帮助开发 WebGL 模式感兴趣。感谢你的帮助，我们对此非常感激！本页面旨在解释我们是如何组织 WebGL 贡献的，并提供一些建议从而帮助你进行修改。

## 资源

- 阅读我们的 [p5.js WebGL architecture overview](../webgl_mode_architecture.md) 了解 WebGL 模式与 2D 模式的区别。这将是理解着色器、笔触等一些实现细节的宝贵参考。
- 阅读我们的[contributor guidelines](https://p5js.org/contributor-docs/#/./contributor_guidelines) 获取如何创建 issues 、设置代码库和测试更改的信息。
- 了解一些关于浏览器的 WebGL API 的信息会很有帮助，这是 p5.js 的 WebGL 模式建立之上的：
  - [WebGL fundamentals](https://webglfundamentals.org/) 讲解了许多核心渲染概念。
  - [The Book of Shaders](https://thebookofshaders.com/) 讲解了 WebGL 着色器中使用的许多技术。

## 规划

  我们通过 [GitHub Project](https://github.com/orgs/processing/projects/5) 来组织issues，并将它们分为以下几类：

- **系统级修改** 涉及长期目标，并对代码产生深远影响。在开始实施之前，此类变更需要进行充分的讨论和全面的规划。
- **尚无解决方案的 bugs** 是指那些还需要通过调试来确定具体原因的错误报告。在确定具体原因之前，这些 bugs 还不适合进行修复；一旦原因明确，我们便可以开始讨论最佳的修复方法。
- **有解决方案但未 PR 的 bugs** 是指已经确定了修复方案，且可以开始进行编写代码的 bugs 。
- **小幅优化** 涉及到新增功能，这些功能在现有架构中已有明确定位，无需进一步讨论如何将它们融入系统。一旦决定加入这些功能，就可以直接开始编写相关代码。
- **2D 功能** 指的是那些在 p5.js 中的其他部分已经实现，但在 WebGL 模式下尚不支持的功能。这些功能一旦实现，其预期表现应与 2D 模式保持一致。尽管我们可能需要讨论这些功能的最佳实施方式，但对用户来说，这些功能的要求是清晰明确的。
- **无法在所有情况下正常运作的功能** 是指在 WebGL 模式下存在但并不适用于所有 WebGL 使用场景的功能。举例来说，某些 p5.js 方法同时支持 2D 和 3D 坐标系统，然而其他的方法可能在使用 3D 坐标时失效。在通常情况下，这些功能是可以着手进行开发的。
- **功能请求** 是指对其他所有代码的更改请求；这些请求还需要一些讨论，以确保它们符合 WebGL 模式下的发展方向。
- **文档** 是指那些无需进行代码更改，而是需要更好地记录 p5.js 行为的 issues 。

## 代码放置

所有与 WebGL 相关的内容都会存放在`src/webgl`子目录中。在该目录下，顶级 p5.js 函数根据其主题领域分成不同的文件：设置光源的命令放在`lighting.js`中；设置材质的命令则放在`materials.js`中。

在实现用户界面类时，我们通常采用一类一个文件的方式。这些文件可能会偶尔包含一些其他的内部实用类。例如，`p5.Framebuffer.js` 包括`p5.Framebuffer`类，并且还包含一些特定于帧缓冲的其他主要类的子类。进一步的帧缓冲特定子类也可以放在该文件中。

`p5.RendererGL`是一个处理许多行为的大类。因此，我们不是将所有功能都放在一个大的类文件中，而是根据其所属的主题领域将其功能分成许多文件。以下是我们将`p5.RendererGL`划分至各个文件中的描述，以及每个文件应包含的内容：

#### `p5.RendererGL.js`

初始化和核心功能。

#### `p5.RendererGL.Immediate.js`

与 **即时模式 (immediate mode)** 绘图相关的功能（不会被存储和复用的形状，例如`beginShape()`和`endShape()`）

#### `p5.RendererGL.Retained.js`

与 **保留模式 (retained mode)** 绘制相关的功能（已经存储以供复用的形状，如`sphere()`）

#### `material.js`

混合模式管理

#### `3d_primitives.js`

可以绘制形状的用户界面函数，如`triangle()`。这些函数定义了形状的几何结构。然后在`p5.RendererGL.Retained.js`或`p5.RendererGL.Immediate.js`中渲染这些形状，从而将几何输入视为通用形状。

#### `Text.js`

用于文本渲染的功能和实用类

## 测试 WebGL 的修改

### 测试一致性

在 p5.js 中，函数有多种使用方式。手动验证所有方式是很困难的，因此我们尽可能地添加单元测试。通过这种方式，当我们做出新的修改时，如果所有单元测试通过，我们就可以确信新的修改没有破坏任何已有功能。

在添加新测试时，如果该功能在2D模式下也有效，那么为了确保一致性，最好的方法之一就是检查在两种模式下生成的像素是否相同。以下是一个单元测试的示例：

```js
test('coplanar strokes match 2D', function() {
  const getColors = function(mode) {
    myp5.createCanvas(20, 20, mode);
    myp5.pixelDensity(1);
    myp5.background(255);
    myp5.strokeCap(myp5.SQUARE);
    myp5.strokeJoin(myp5.MITER);
    if (mode === myp5.WEBGL) {
      myp5.translate(-myp5.width/2, -myp5.height/2);
    }
    myp5.stroke('black');
    myp5.strokeWeight(4);
    myp5.fill('red');
    myp5.rect(10, 10, 15, 15);
    myp5.fill('blue');
    myp5.rect(0, 0, 15, 15);
    myp5.loadPixels();
    return [...myp5.pixels];
  };
  assert.deepEqual(getColors(myp5.P2D), getColors(myp5.WEBGL));
});
```

该方法并不总是适用，因为你无法在 2D 模式中关闭抗锯齿。与此同时，在 WebGL 模式中，抗锯齿通常会略有不同。但对于实现 x 和 y 轴上直线的情况，这种方法是可行的！

如果一个功能只适用于 WebGL ，我们通常会检查其中的几个像素，而不是将像素与 2D 模式的结果进行比较，以确保它们的颜色符合我们的预期。在不久的将来，我们可能会将其改进为一个更加强劲且稳定的系统，并且该系统会与我们期望结果的完整图像快照进行比较，而非其中的几个像素。但在现有情况下，以下是一个像素颜色检查的示例：

```js
test('color interpolation', function() {
  const renderer = myp5.createCanvas(256, 256, myp5.WEBGL);
  // upper color: (200, 0, 0, 255);
  // lower color: (0, 0, 200, 255);
  // expected center color: (100, 0, 100, 255);
  myp5.beginShape();
  myp5.fill(200, 0, 0);
  myp5.vertex(-128, -128);
  myp5.fill(200, 0, 0);
  myp5.vertex(128, -128);
  myp5.fill(0, 0, 200);
  myp5.vertex(128, 128);
  myp5.fill(0, 0, 200);
  myp5.vertex(-128, 128);
  myp5.endShape(myp5.CLOSE);
  assert.equal(renderer._useVertexColor, true);
  assert.deepEqual(myp5.get(128, 128), [100, 0, 100, 255]);
});
```

### 性能测试

尽管性能不是 p5.js 的首要关注点，但我们仍会尽量确保修改不会对性能造成较大影响。在通常情况下，我们会创建两个测试绘图：一个包含了你的修改，另一个则没有。然后，我们会比较两者的帧率。

关于如何衡量性能的一些建议：

- 在你绘图的顶部使用 `p5.disableFriendlyErrors = true` 来禁用友好错误提示 （friendly errors)（或仅测试 `p5.min.js`，因为该版本不包含友好错误提示系统）
- 显示平均帧率，从而了解稳定状态下的帧率：

```js
let frameRateP;
let avgFrameRates = [];
let frameRateSum = 0;
const numSamples = 30;
function setup() {
  // ...
  frameRateP = createP();
  frameRateP.position(0, 0);
}
function draw() {
  // ...
  const rate = frameRate() / numSamples;
  avgFrameRates.push(rate);
  frameRateSum += rate;
  if (avgFrameRates.length > numSamples) {
    frameRateSum -= avgFrameRates.shift();
  }
 
  frameRateP.html(round(frameRateSum) + ' avg fps');
}
```
以下是我们会进行测试的一些情况，因为它们会对渲染管线的不同部分造成压力：

- 几个非常复杂的形状 （例如，一个大型 3D 模型或一段长曲线）
- 许多简单的形状 （例如，在for loop中多次调用`line()`）
