# 单元测试

我们使用单元测试来确保代码库中的各个组件按照我们的期望正常工作。

## 参考资料

这是一个[关于单元测试的好的、快速入门指南](https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71)，使用了类似的技术栈，还有一个[更详细的指南](https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d)。

## 运行所有单元测试

在仓库根目录下，在终端中使用以下命令：

```shellsession
$ npm test
```

## 测试覆盖率

每次运行测试时，都会生成一个覆盖率报告。该覆盖率报告详细说明了测试套件所覆盖的源代码文件的哪些部分，从而告诉我们代码库的多少被测试到了。

在运行测试后，会打印出一个摘要，并且您可以在任何网络浏览器中查看详细报告，路径为 `coverage/index.html`。在 Mac 终端中，您可以运行 `open coverage/index.html` 命令，在默认的网络浏览器中打开该页面。您还可以在终端中使用命令 `npx nyc report --reporter=text` 运行测试后查看覆盖率报告。

### 运行一个测试套件

要运行单个测试或一组测试，在 `.js` 文件中的 `suite` 或 `test` 后面添加 `.only`，然后使用上述命令运行测试。

**请注意，不要提交包含 `.only` 的代码！**（我们希望我们的 CI 运行 _所有_ 的单元测试。）

#### 示例

要仅运行 "p5.ColorConversion" 测试套件，您需要更改 `test/unit/color/color_conversion.js` 文件的第一行：

```js
suite.only('color/p5.ColorConversion', function() {
```

现在，当您使用 `npm test` 命令时，只有在该 `function()` 主体内的测试将被运行。

### 跳过一个测试套件

此功能与 `.only()` 相反。通过添加 `.skip()`，您可以告诉 Mocha 忽略这些测试套件和测试用例。被跳过的内容将被标记为待定，并作为待定内容报告。

## 基础设施

### 框架

我们使用 [mocha](https://mochajs.org) 来组织和运行我们的单元测试。

我们使用 [chai 的 `assert`（和 `expect`）](https://www.chaijs.com/api/assert/) 来编写关于代码应该如何运行的单个语句。

### 环境

我们在 `test/unit` 文件夹下有一系列在浏览器中运行的测试，还有在 `test/node` 文件夹下一系列在 Node.js 中运行的测试。

浏览器测试在 ["无头" Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai) 中运行。这就是为什么在运行测试时不会弹出浏览器窗口的原因。

### 设置和辅助函数

这些目前仅适用于浏览器测试（大多数测试都在此运行）：

- `test/js/mocha_setup.js` 配置了 mocha 的一些选项。
- `test/js/chai_helpers.js` 设置了 chai，并向 `chai.assert` 添加了一些有用的函数。
- `test/js/p5_helpers.js` 添加了一些用于测试 p5 sketches 的辅助函数。

Node.js 测试的设置都在 `test/mocha.opts` 文件中完成。

### 持续集成测试

当您在 p5.js 仓库中发起拉取请求时，它会自动[运行测试](https://github.com/processing/p5.js/actions)。这有助于我们确保每个拉取请求的测试都通过，而不需要个人贡献者进行额外的工作。它还会自动将覆盖率报告上传到 [Codecov](https://codecov.io/github/processing/p5.js)。

## 添加单元测试

如果您想添加更多的单元测试，请查看是否已经存在用于您要添加测试的组件的测试文件。通常，`src/` 中的文件对应的测试文件在 `test/unit` 目录下具有相同的路径。（例如，`src/color/p5.Color.js` 的测试在 `test/unit/color/p5.Color.js` 中。）

如果找不到对应的文件，那可能是因为该文件尚未有任何测试（尚未 😉），所以按照上述约定创建一个新文件。如果您要测试的模块需要在浏览器中运行，您应该将它放在 `test/unit` 中；如果不需要，在 `test/node` 下添加。**如果不确定，请优先选择将浏览器测试添加到 `test/unit`！（如果需要，稍后可以很容易地将其移到其他地方。）**

如果您必须为一个模块添加一个 `test/unit` 下的测试文件，那么您还需要在 `test/unit/spec.js` 文件的 `spec` 数组中将要测试的模块添加进去。这样可以确保您的测试运行时加载了必要的模块。您可以通过查看 `test/test.html` 文件在浏览器中查看这些测试。

### 编写单元测试

选择一个单元，它可以是一个方法或一个变量进行测试。让我们以 `p5.prototype.keyIsPressed` 作为示例。在开始编写测试之前，我们需要了解该方法的预期行为。
**预期行为：**如果按下任意键，则布尔值系统变量应为 true；如果没有按键，则应为 false。
现在，您可以针对这个预期行为考虑各种测试案例。可能的测试案例包括：

- 变量是布尔值。
- 如果按下了键，则应为 true。
- 如果按下任意键（字母键、数字键、特殊键等），则应为 true。
- 如果按下多个键，则应为 true。
- 如果没有按键，则应为 false。
- 如果您可以想到更多的情况，请继续为其编写测试！

我们可以为 `p5.prototype.keyIsPressed` 创建一个测试套件，并开始编写相应的测试。我们将使用 mocha 来组织我们的单元测试。

```js
suite('p5.prototype.keyIsPressed', function() {
  test('keyIsPressed is a boolean', function() {
    // 在这里编写测试
  });

  test('keyIsPressed is true on key press', function() {
    // 在这里编写测试
  });

  test('keyIsPressed is false when no keys are pressed', function() {
    // 在这里编写测试
  });
});
```

我们已经构建了测试套件的结构，但还没有编写测试。我们将使用 chai 的 assert 进行编写。
例如：

```js
test('keyIsPressed is a boolean', function() {
  assert.isBoolean(myp5.keyIsPressed); // 断言值为布尔值。
});
```

类似地，我们可以使用 `assert.strictEqual(myp5.keyIsPressed, true)` 来断言值是否为 true。您可以在此处阅读有关 chai 的 assert 的更多信息：[chai 文档](https://www.chaijs.com/api/assert/)。
现在，您已经编写了测试，请运行它们并查看该方法是否按预期运行。如果不是，请为此创建一个问题，如果您愿意，甚至可以尝试修复它！
