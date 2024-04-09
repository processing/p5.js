<!-- 了解如何管理和审查对 p5.js 的贡献。 -->

# 管理员指南
无论你是刚加入我们的管理员，还是 p5.js 经验丰富的维护者，或者介于两者之间，本指南包含了许多信息、技巧和诀窍，将帮助你和其他贡献者有效地为 p5.js 做出贡献。除非另有说明，这里所写的大部分内容都是指南，这意味着你可以根据自己的工作流程来适应这里所指示的做法。

## 目录
- [Issues](#Issues)
   - [Bug 报告](#bug-报告)
   - [功能请求](#功能请求)
   - [功能增强](#功能增强)
  - [讨论](#讨论)
- [拉取请求](#拉取请求)
  - [简单修复](#简单修复)
  - [Bug 修复](#bug-修复)
  - [新功能/功能增强](#新功能功能增强)
  - [Dependabot](#dependabot)
- [构建过程](#构建过程)
  - [主要构建任务](#主要构建任务)
  - [杂项任务](#杂项任务)
- [发布过程](#发布过程)
- [提示与技巧](#提示与技巧)
  - [回复模板](#回复模板)
  - [GitHub CLI](#github-cli)
  - [管理通知](#管理通知)

---

## Issues
我们鼓励大多数源代码贡献以 issue 为起点，因此 issues 是大多数讨论发生的地方。你在审查 issue 时可以采取的步骤取决于 issue 的类型。该存储库使用 [GitHub issue 模板](../.github/ISSUE_TEMPLATE)来更好地组织不同类型的 issues，并鼓励 issue 作者提供有关其问题的所有相关信息。审查 issue 的第一步通常是查看填写的模板，确定是否需要额外的信息（可能是因为某些字段未填写或使用了错误的模板）。

### Bug 报告
 对于 bug 报告 issues，应使用 “发现了一个 bug” issue 模板。通常使用下面流程来处理 bug 报告：

1. 复现 bug
    - 模板的目标是提供足够的信息，以便评审人员尝试复现所报告的 bug。
    - 如果报告的 bug 与所在存储库无关（p5.js或p5.js-website）。
      - 如果你有权访问相存储库，请将 issue 转移到相存储库。
      - 否则，请在 issue 中留下评论，说明 bug 报告应该提交到哪里（提供直接链接），然后关闭该 issue。
    - 评审 bug 报告的第一步是查看是否提供了足够的信息以复现 bug，并在有必要时尝试按描述复现 bug。
 2. 如果可以复现 bug：
    - 有时需要进行讨论以确定修复特定 bug 的最佳方法。有时这可能很简单，有时可能会比较棘手。在需要根据具体情况做出决定时，请参考 [p5.js 的设计原则](./design_principles.md)。
    - 如果 issue 作者在 issue 中表示愿意提供修复方法：
      - 留下评论，批准 issue 作者来提供修复方案。使用 "Assignee" 旁边的右侧的齿轮按钮，将 issue 分配给 issue 作者。
    - 如果 issue 作者不愿意提供修复方法：
      - 留下评论确认 bug 是可以复现的。
      - 尝试自行修复或在 issue 上添加“需要帮助”的标签，以表明需要修复的 issue。
3. 如果无法复现 bug：
    - 如果模板中尚未提供附加信息（如 p5.js 版本、浏览器版本、操作系统版本等），请要求提供附加信息。
    - 如果你的测试环境与 issue 中报告的不同（不同的浏览器或操作系统）：
      - 留下评论说明你无法在自己的特定环境中复现。
      - 在 issue 上添加 `需要帮助` 的标签，并要求其他具有 issue 指定设置的人尝试复现该 bug。
    - 有时候 bug 只在使用 web 编辑器时出现，而在本地测试时没有出现。在这种情况下，issue 应该转到 [web 编辑器存储库](https://github.com/processing/p5.js-web-editor)。
    - 如果以后可以复现该 bug，则返回步骤2。
 4. 如果 bug 源于用户在 bug 报告中提供的代码，而不是 p5.js 的行为：
    - 确定是否可以通过改进 p5.js 的文档、代码实现或友好的错误系统来防止发生相同的错误。
    - 友好地将任何进一步的问题重定向到[论坛](https://discourse.processing.org/)或 [Discord](https://discord.com/invite/SHQ8dH25r9)，如果对 p5.js 没有进一步的更改，则关闭 issue。

### 功能请求
对于功能请求 issues，应使用“新功能请求” issue 模板。通常使用下面流程来处理功能请求：

 1. 作为 p5.js 提高无障碍性的一部分，所有功能请求都必须说明它如何提高 p5.js 在该领域历史上被边缘化群体社区的可访问性。有关更多详细信息，请参阅[这里](./access.md)。
    - 如果功能请求没有充分填写“提高无障碍性”字段，则可以要求 issue 作者说明该功能如何提高可访问性。
    - 功能的访问说明可以由社区中的其他成员（包括 issue 审阅者本人）提供。
 2. 根据以下标准评估所提出的新功能请求是否应包含在内。
    - 它是否符合 p5.js 的项目范围和[设计原则](./design_principles.md)？
      - 比如说，可以考虑添加新的绘图原始形状的请求，但是采用基于浏览器的物联网协议的请求可能超出了范围。
      - 总体上，p5.js 的范围应相对较窄，以避免不常用的功能导致代码库过度臃肿。
      - 如果某个功能不符合 p5.js 的范围，则可以由 issue 的作者或社区中的其他成员将该功能实现为附加库。
      - 如果不清楚是否合适，建议制作一个附加程式库作为概念验证也不失为一个好主意。这有助于为用户提供使用该功能的方法，提供一个更具体的例子来说明其用途和重要性，而且不一定需要是完全集成的完整解决方案。如果合适，以后还可以将其集成到 p5.js 的核心中。
    - 它是否可能被视为破坏性变更？
     - 它是否会与现有的 p5.js 函数和变量冲突？
     - 它是否会与已经为 p5.js 编写的典型示例冲突？
     - 可能会导致上述冲突的功能应被视为破坏性变更，如果没有[进行重大版本发布](https://docs.npmjs.com/about-semantic-versioning)，我们不应对 p5.js 进行破坏性变更。
   - 提出的新功能是否可以使用已经存在的 p5.js 功能、相对简单的原生 JavaScript 代码或现有易于使用的库来实现？
      - 例如，不必提供一个用于连接字符串数组的 p5.js 函数，例如 `join(["Hello", "world!"])`，而应优先使用原生 JavaScript 的 `["Hello", "world!"].join()`。
 3. 在满足可访问性要求和其他考虑因素的前提下，必须有至少两个主管或维护人员在开始处理 PR 前批准新功能请求。下面介绍了新功能的 PR 审查流程。

### 功能增强
 对于功能增强 issues，应使用“现有功能增强” issue 模板。这里的流程与新增功能请求非常相似。新增功能请求与功能增强之间的区别可能有些模糊，但是功能增强主要涉及 p5.js 的现有功能，而新增功能请求可能是请求添加全新的功能。

 1. 与新增功能请求类似，功能增强只有在能提高 p5.js 无障碍性时才应被接受。请参阅上面的[部分1](#feature-request)。
 2. 功能增强的包含标准与上面的功能请求类似，但要特别注意潜在的破坏性变更。
    - 如果修改现有功能，则所有先前有效和记录的函数签名必须以相同的方式运行。
 3. 在开始进行 PR 之前，必须至少由一位负责人或维护者批准功能增强。功能增强的 PR 审核过程在下面有详细说明。

### 讨论
 此类 issue 有一个简洁的模板（“讨论”），在把主题整合为更具体的内容（如功能请求）之前，用这个模板来收集有关主题的一般性反馈。当这一类的反馈结束并产生更具体的内容后，这类的讨论问题就可以关闭了：

 - 如果以讨论的形式提出了一个 issue，但其实应该是一个 bug 报告，应该使用正确的标签并删除“讨论”标签。同时也应向作者索取未包含在 bug 报告中的其他信息。
 - 如果以讨论的形式打开了一个 issue，但与源代码贡献或其他与 GitHub 存储库/贡献过程/贡献社区相关的问题无关(例如，讨论 p5.js 的草图使用的最佳投影仪类型)，应将其重定向到论坛或 Discord，并关闭 issue。
 - 如果适用，应向讨论 issues 添加其他标签，以进一步标识讨论的类型。

---

## 拉取请求
 几乎所有对 p5.js 存储库的代码贡献都是通过拉取请求进行的，管理者和维护者可能具有对存储库的推送访问权限，但在贡献代码时仍然鼓励他们遵循相同的 issue > PR > 审查流程。以下是审查 PR 时可以采取的一些步骤：

 - 拉取请求模板可以在[此处](../.github/PULL_REQUEST_TEMPLATE.md)找到。
 - 几乎所有拉取请求必须先打开并讨论相关的 issues，这意味着在任何管理者或维护者审查 PR 之前，必须首先按照相关[issue 工作流程](#issues)进行操作。
 	- 唯一不适用此规则的情况是非常小的拼写错误修正，这不需要打开 issue，任何具有合并访问权限的人都可以合并该修复，即使他们不是特定领域的管理者。
 	- 尽管存在这个例外，但在实践中我们只会在通常鼓励贡献者开启新 issues 的情况下应用它。换句话说，如果对于这个例外是否适用存在疑问，只需打开一个 issue 即可。
 - 如果拉取请求不能完全解决引用的 issue，你可以编辑原始帖子，将“解决 #OOOO”改为“处理 #OOOO”，这样当合并此 PR 时，不会自动关闭原始 issue。

### 简单修复
 像小的拼写错误修复之类的简单修复可以由具有合并访问权限的任何人直接合并，只需在 PR 的“更改的文件”选项卡中快速检查，并确保自动化 CI 测试通过。

 ![The "files changed" tab when viewing a pull request on GitHub](../images/files-changed.png)

 ![The "All checks have passed" indicator on a GitHub pull request, highlighted above the merge button](../images/all-checks-passed.png)

### Bug 修复
 1. Bug 修复应由相关领域的管理者审查，最好是同意修复相关 issue 的相同人员。
 2. PR 的“更改的文件”选项卡可用于初步审查修复是否与 issue 讨论中描述的一致。
 3. 尽可能在本地进行必要的测试。GitHub CLI 可以帮助简化部分流程。（请参阅下面的 [Tips ＆ Tricks](#tips-tricks) 了解更多详情）。
 	- 修复应足够解决原始 issue。
 	- 修复不应更改任何现有行为，除非在原始 issue 中已经达成一致。
 	- 修复不应对 p5.js 的性能产生重大影响。
 	- 修复不应对 p5.js 的可访问性产生任何影响。
 	- 修复应使用现代标准的 JavaScript 编码。
 	- 修复应通过所有自动化测试，并在相关的情况下包含新测试。
 4. 如果需要进行任何其他更改，应根据[此处](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request)所述，在相关行添加行级注释。
    - 还可以使用建议模块来建议具体的更改:\
      ![The Suggest Change button while writing a comment on code in a GitHub pull request](../images/suggest-change.png)\
      ![A suggested change appearing within code fences with the "suggestion" tag](../images/suggested-value-change.png)\
      ![A suggested change previewed as a diff](../images/suggestion-preview.png)
    - 如果需要进行多个更改，而不是多次添加单行注释，请按照[此处](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request)所述进行多行注释并请求更改。
    - 如果行级注释仅用于澄清或讨论，则在上一步中选择 "Comment" 而不是 "Request changes":\
    ![The "comment" option circled within the GitHub Finish Review menu](../images/comment-review.png)
 5. 一旦 PR 已经被审查，并且不需要任何其他更改，负责人可以添加或不添加评论，在上一步中选择 "Approve" 选项，将 PR 标记为 "Approved"。然后，如果需要，他们可以要求另一个负责人或维护者进行进一步审查，或者如果他们具有合并访问权限，可以合并 PR，或者维护者将合并已批准的 PR。
 6. 应该调用 @[all-contributors](https://allcontributors.org/docs/en/emoji-key) 机器人，将任何新贡献者添加到 README.md 文件的贡献者列表中。每种贡献类型都可以用下面的`[contribution` `type]`代替，可用贡献类型的完整列表可以在上面的链接中找到。

 `@all-contributors` `please` `add` `@[GitHub` `handle]` `for` `[contribution` `type]`

### 新功能/功能增强
 新功能或功能增强的 PR 的流程与 bug 修复类似，只有一个显着的区别：

 - 新功能/功能增强的 PR 在合并之前必须由至少两名主管或维护者进行审查和批准。

### Dependabot
 Dependabot 的 PR 通常只对存储库管理员可见，如果这与你无关，请跳过此部分。

 - 如果版本更新是一个[语义化](https://semver.org/)的补丁版本，并且自动化的 CI 测试通过，可以直接合并 Dependabot PR。
 - 如果 Dependabot PR 带有语义化的次要版本更改，并且自动化的 CI 测试通过，通常可以直接合并，但建议快速检查更新的依赖项的变更日志。
 - 如果 Dependabot PR 带有语义化的主要版本更改，可能会影响构建过程或 p5.js 的功能。在这种情况下，鼓励评审人员尽可能从当前版本到目标版本检查变更日志，并在本地测试 PR，确保所有过程正常运行，并根据依赖项中潜在的重大变更进行任何必要的更改。
   - 许多依赖项之所以增加主要版本号，仅因为它们不再官方支持非常旧的 Node.js 版本，这意味着在许多情况下，主要版本号的增长并不一定意味着有依赖项 API 更改而引起的破坏性变化。

---

## 构建过程
本节不涵盖一般的构建设置和命令，而是关于幕后发生的详细信息。关于构建信息，请参阅[贡献者指南](./contributor_guidelines.md#working-on-p5js-codebase)。

Gruntfile.js 文件包含了 p5.js 及其他内容的主要构建定义。构建库和文档所使用的不同工具包括但不限于 Grunt、Browserify、YUIDoc、ESLint、Babel、Uglify 和 Mocha。从`default`任务开始，逆向分析可能会有所帮助。在阅读下面的说明时，参考 Gruntfile.js 文档可能会有所帮助。

### 主要构建任务

 ```js
 grunt.registerTask('default', ['lint', 'test']);
 ```
当我们运行`grunt`或 npm 脚本`npm test`时，我们运行包含`lint`和`test`的默认任务。

#### `lint` 任务

 ```js
 grunt.registerTask('lint', ['lint:source', 'lint:samples']);
 ```
 `lint`任务包括两个子任务：`lint:source`和`lint:samples`。`lint:source`又进一步分为三个子任务：`eslint:build`、`eslint:source`和`eslint:test`，它们使用 ESLint 检查构建脚本、源代码和测试脚本。

 `lint:samples`任务首先运行`yui`任务，该任务本身包括`yuidoc:prod`、`clean:reference`和`minjson`，它们从源代码中提取文档到一个 JSON 文件中，删除上一步骤中未使用的文件，并将生成的 JSON 文件压缩为`data.min.json`。

 接下来，在`lint:samples`中有一个名为`eslint-samples:source`的自定义任务，其定义位于[./tasks/build/eslint-samples.js](./tasks/build/eslint-samples.js)中，它将使用 ESLint 检查文档示例代码，以确保其遵循与p5.js的其余部分相同的编码规范（这里首先运行`yui`，因为我们需要先构建 JSON 文件，然后才能对示例进行检查）。

#### `test` 任务

 ```js
 grunt.registerTask('test', [
  'build',
  'connect:server',
  'mochaChrome',
  'mochaTest',
  'nyc:report'
]);
```

首先，让我们看一下`test`中的`build`任务。

```js
grunt.registerTask('build', [
  'browserify',
  'browserify:min',
  'uglify',
  'browserify:test'
]);
```

以`browserify`开头的任务在[./tasks/build/browserify.js](./tasks/build/browserify.js)中定义。它们执行相似的步骤，但有一些细微的差异。以下是将众多 p5.js 源代码文件整合为一个完整库的主要步骤：

- `browserify`负责构建 p5.js，而`browserify:min`则构建下一步要进行压缩的中间文件。`browserify`和`browserify:min`之间的区别在于，`browserify:min`不包含 FES 运行所需的数据。
- `uglify`将`browserify:min`的输出文件压缩，生成最终的 p5.min.js 文件（此步骤的配置在主 Gruntfile.js 中）。
- `browserify:test`构建的版本与完整的 p5.js 版本相同，只是添加了用于测试代码覆盖率报告的代码（使用 [Istanbul](https://istanbul.js.org/) ）。

在 browserify 步骤中，除了将各种文件合并为一个文件外，还执行了其他几个步骤。首先，使用`brfs-babel`将`fs.readFileSync()` node.js 特定代码的使用替换为文件的实际内容。这主要用于 WebGL 代码，以将作为独立文件编写的着色器代码内联到源代码中。

接下来，使用 Babel 将来自 node_modules 的所有依赖项的源代码进行转译，以匹配在 package.json 中定义的 [Browserslist](https://browsersl.ist/) 要求，并将 ES6 导入语句转换为 browserify 能理解的 CommonJS `require()`。这也使我们能够使用 ES6 及更高版本中可用的较新语法，而不必担心浏览器兼容性问题。

在捆绑之后但将捆绑代码写入文件之前，代码会在`pretty-fast`中运行。如果代码不应被缩小，我们则需清理代码，以使最终格式更加一致。 （如果有需要的话， p5.js 源代码应保持可读、可查阅）

这里省略了一些小的详细步骤；你可以查看上面链接的 browserify 构建定义文件，以更详细地了解所有内容。

```
connect:server
```

此步骤启动一个本地服务器，托管测试文件和构建的源代码文件，以便可以在 Chrome 中运行自动化测试。

```
mochaChrome
```

此步骤在[./tasks/test/mocha-chrome.js](./tasks/test/mocha-chrome.js)中定义。它使用 Puppeteer 来启动一个无头版本的 Chrome，可以进行远程控制，并运行与`./test`文件夹中的 HTML 文件相关联的测试，包括对未缩小和缩小版本的库进行单元测试，以及测试所有参考示例。

```
mochaTest
```

与`mochaChrome`不同，此步骤在 node.js 中运行，而不是在 Chrome 中运行，并且仅测试库中的一小部分功能。p5.js 中的大多数功能都需要浏览器环境，因此只有在新的测试确实不需要浏览器环境时，才应扩展此测试集合。

```
nyc:report
```

最后，在完成所有构建和测试之后，此步骤将收集`mochaChrome`对库的完整版本进行的测试覆盖率报告，并将测试覆盖数据打印到控制台。p5.js 的测试覆盖率主要用于监控和提供一些额外的数据点，我们的目标不是达到100%的测试覆盖率。

以上内容涵盖了 Gruntfile.js 配置中的默认任务！

### 杂项任务

如果需要，可以直接使用`npx grunt [step]`运行所有步骤、子步骤和子子步骤，尽管对于某些步骤而言，如果依赖于此链中的较早步骤，可能没有太大意义进行操作。还有一些未在上面提到但在某些情况下可能有用的任务。

```
grunt yui:dev
```

此任务将运行上述描述的文档和库构建，然后启动一个网站，提供与网站上[http://localhost:9001/docs/reference/](http://localhost:9001/docs/reference/)的参考页面功能相似的版本。然后，它将监视源代码的更改，并重新构建文档和库。

当你在处理内联文档的参考资料时，使用`grunt` `yui:dev`将非常有用，因为你无需在每次更改后都将 p5.js 存储库中构建好的文件移动至本地的 p5.js-website 存储库并重新构建网站，而是可以直接在浏览器中预览你的更改，这样就可以通过这个略微简化的参考版本来查看更改了。依此方法，你也可以更有信心地认为你所做的更改会在网站上正确显示。请注意，这仅适用于对内联文档的修改；对参考页面本身（包括样式和布局）的更改，应在网站存储库上进行修改和测试。

```
grunt watch
grunt watch:main
grunt watch:quick
```

watch 任务将观察一系列文件的更改，并根据所更改的文件运行相关任务以构建参考文档或库。这些任务的作用是相同的，唯一的区别在于范围。

`watch`任务将在检测到源代码更改时运行所有构建和测试，类似于在源代码中运行完整的默认任务。

`watch:main`任务将在检测到源代码更改时运行库构建和测试，但不会重新构建参考文档。

`watch:quick`任务将仅在检测到源代码更改时运行库构建。

根据你的工作内容，选择最简化的 watch 任务可以节省手动重新构建的时间。

---

## 发布过程

请参阅[release_process.md](./release_process.md)。

---

## 提示与技巧

有时，需要审核的 issues 和 PRs 的数量太多，可能会令人手足无措，尽管我们尽力采取一些简化流程的措施，但以下是你可以利用的一些提示和技巧，以帮助你审核 issues 和 PR。

### 回复模板

你可以使用 GitHub 的 [Saved Replies](https://docs.github.com/en/get-started/writing-on-github/working-with-saved-replies/about-saved-replies) 功能，这是一个方便的功能，可在回复 issues 或 PR 时使用。上面描述的工作流程中的一些步骤可能需要使用相同或非常相似的回复（比如将 issues 重定向到论坛、接受 issues 以进行修复等），使用 Saved Replies 可以稍微提高效率。

以下是 p5.js 维护者使用的一些 Saved Replies，你可以自己使用或创建你自己的 Saved Replies！

##### 关闭：无法重现

> 我们无法重现这个 issue，但如果你能提供一个演示问题的代码示例，请随时重新打开这个 issue。谢谢！

##### 关闭：需要代码片段

> 为了组织的目的，我们关闭了此 issue。如果您能提供一个说明问题的代码片段，请重新打开该 issue。谢谢！

##### 关闭：使用论坛

> 这里的 GitHub issues 是报告 p5.js 库本身的错误和问题的好地方。如果你有关于编写自己的代码、测试或遵循教程的问题，请在[论坛](https://discourse.processing.org/)上发布。谢谢！

##### 关闭：GSOC

> 谢谢！讨论 GSOC 提案的最佳地方是我们的[论坛](https://discourse.processing.org/c/summer-of-code)。

##### 关闭：访问权限

> 目前看来，这个功能并没有引起太多关注，而且我们还没有一个清晰的解释来说明它是如何扩大[扩大访问权限](access.md)的，因此我们现在将关闭这个 issue。如果能够在 issue 请求中添加一个关于访问权限的声明，请随时重新打开此 issue。

> 我们暂时关闭了此 issue，因为没有看到对此 issue 的较详细解释[扩大访问权限](access.md)。如果可以在 issue 请求中添加更详细的访问权限说明，请随时重新打开。谢谢！

##### 关闭：插件

> 我们认为这个功能超出了 p5.js API 的范围（我们尽量保持最简化），但它可以成为一个很好的插件库的起点。请查看此处的文档，了解如何创建一个插件：
[https://github.com/processing/p5.js/blob/main/contributor\_docs/creating\_libraries.md](creating_libraries.md)

##### 关闭 PR：先提出 issue

> 谢谢。作为提醒，必须在打开拉取请求之前打开 issues 并使用 issues 标记拉取请求。这对于跟踪开发并保持讨论清晰是必要的。谢谢！

##### 批准 issue 修复。

> 你可以继续进行修复。谢谢。

##### 合并 PR

> 看起来不错。谢谢！

### GitHub CLI

使用看似复杂的 git 命令来获取 PR 版本的代码并在本地进行测试，可能会使复杂的 PR 审查变得更加困难。幸运的是，[GitHub CLI](https://cli.github.com/) 工具可以极大地帮助简化这个过程以及其他操作。

安装完 CLI 并登录后，你只需要运行命令 `gh pr checkout [pull_request_id]` 就可以在本地审查 PR。这个命令会自动为你获取远程 fork，创建一个分支，并切换到该分支。如果要返回到主分支，只需像切换分支一样运行 `git checkout main` 即可。你甚至可以直接从 CLI 在 PR 中留下评论，而无需访问网页页面！

GitHub CLI 还提供了许多其他命令，你可能会发现它们有用。无论如何，这是一个很好的工具。

### 管理通知

不再需要手动监视存储库的"Issues"或"Pull Requests"选项卡以获取新的 issues 或 PRs。你可以通过在存储库页面顶部与存储库名称相对的地方点击带有眼睛图标的"Watch"按钮来“关注”该存储库。

![Cropped screenshot of the top right corner of a GitHub repository page showing a series of buttons in the center from left to right: Sponsor, Watch, Fork, Starred.](../images/github-repo-metrics.png)

通过关注存储库，诸如新 issues、新 PRs、提及你的用户名以及其他你在存储库上订阅的活动都会作为通知发送到你的[通知页面](https://github.com/notifications)，你可以将其标记为已读或忽略，就像处理电子邮件收件箱一样。

在某些情况下，你可能会收到 GitHub 发送的与你关注的存储库中的活动相关的电子邮件，你可以在[通知设置页面](https://github.com/settings/notifications)上进行自定义设置，包括完全取消订阅。

根据你的工作方式设置这些通知，可以避免手动查找相关 issues /PR 并避免被 GitHub 的无休止的通知淹没。在这里需要保持良好的平衡。作为起始建议，你可以关注该存储库的"Issues"和"Pull Requests"，并设置仅在“参与、提及和自定义”时接收电子邮件通知。
