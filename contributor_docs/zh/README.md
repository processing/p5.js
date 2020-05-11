

# 🌸欢迎！🌺

感谢你有兴趣为 p5.js 做出贡献！我们的团队重视每一种形式的帮助，并且正在尽可能的扩大你能帮助的范围，这包括了参考文献、教学、编写程序、创作艺术、写作、设计、活动、组织、展策或者任何你能想象到的东西。[我们的社群网页](https://p5js.org/community/#contribute)提供了一些贡献与参与项目的方法。如果你要提供技术性的帮助，请接着往下读。

本项目遵循[贡献者名单](https://github.com/kentcdodds/all-contributors)规格。你可遵循[指示](https://github.com/processing/p5.js/issues/2309)把你和你的贡献添加到 [readme](https://github.com/processing/p5.js/blob/master/README.md#contributors)，或者是在 [GitHub issue](https://github.com/processing/p5.js/issues) 中评论你的贡献，我们就会把你加入到贡献者名单中。

# 源代码

p5.js 项目除了这个代码库外还包括了以下几个其他的代码库：

- [p5.js](https://github.com/processing/p5.js)：包括了 p5.js 源代码。[面向用户的 p5.js 参考文献](https://p5js.org/reference/)也是由包含在此源代码中的 [JSDoc](http://usejsdoc.org/) 注解生成的。[Lauren Lee McCarthy](https://github.com/lmccart) 为维持者。
- [p5.js-website](https://github.com/processing/p5.js-website)：此源代码包含了 [p5.js website](http://p5js.org )的大多数代码（除参考文献外）。[Lauren Lee McCarthy](https://github.com/lmccart) 为维持者。
- [p5.js-sound](https://github.com/processing/p5.js-sound)：包括了 p5.sound.js 程式库。[Jason Sigal](https://github.com/therewasaguy) 为维持者。
- [p5.js-web-editor](https://github.com/processing/p5.js-web-editor)：包含了 [p5.js web editor](https://editor.p5js.org) 的源代码。[Cassie Tarakajian](https://github.com/catarak) 为维持者。请注意，旧版 [p5.js editor](https://github.com/processing/p5.js-editor) 已不再受支持。
- [p5.accessibility](https://github.com/processing/p5.accessibility)：使 p5.js 更适合盲人和视障人士使用的程式库。

# 文件结构

这个代码库有很多文件，所以这里提供了文件总览。有些文件可能很难懂——不过你并不需要每一个都看懂才能开始。我们建议你先从一个特定区域入手（例如说，修复某些内联参考文献），并逐渐地探索更多领域。Luisa Pereira 的 [Looking Inside p5.js](http://www.luisapereira.net/teaching/looking-inside-p5/) 也给出了 p5.js 工具与文件的视频总览。

- `contributor_docs/` 包含了贡献者所需遵循的原则；
- `docs/` 并不包含参考文献！它包含了 _*生成*_ [线上参考文献](https://p5js.org/reference/)的代码；
- `lib/` 包含一个空白示例和 p5.sound 扩展程式库，并且会周期性地通过 [p5.js-sound 代码库](https://github.com/processing/p5.js-sound) 更新。这里也是当用 [Grunt](https://gruntjs.com/) 把 p5.js 编译到单个文件后 p5.js 程式库的位置。发出 Pull request 时，无需将其检入 GitHub 代码库。
- `src/` 包含所有的源代码，这些源代码通常组织成多个单独的模块。 如果要更改 p5.js，这就是你需要参考的地方。大多数文件夹内部都有独自的 README.md 文件，以帮助您浏览该文件夹。
- `tasks/` 包含创建 p5.js 与新版本 p5.js 的构建、部署和发行有关的自动化任务的脚本。
- `tests/` 包含单元测试，这些单元测试可确保库随着更改仍继续正常运行。
- `utils/` 可能包含对存储库有用的其他文件，但是通常您可以忽略此目录。


# 参考文献

我们意识到参考文献是这个项目中最重要的部分。不好的参考文献是新用户与新贡献者的最大屏障，让项目不具有包容性。[contributing_documentation.md](./contributing_documentation.md) 页面为开始修改参考文献给出了一个深入的导览。p5.js 的参考文献可以在以下几个地方找到：

- [p5js.org/reference](https://p5js.org/reference/)：由 [inline documentation](./inline_documentation.md) 的源代码生成。它包括了文本描述和参数以及随附的代码片段示例。我们将所有这些内联文献和代码放在一起，以使代码和参考文献保持紧密的联系，并强化这样的思想，贡献参考文献与贡献代码至少同等重要。构建库后，它将检查内联参考文献和示例，以确保它们与代码的行为方式匹配。 要做出贡献，您可以先查看 [inline_documentation.md](./inline_documentation.md) 页面。
- [p5js.org/examples](http://p5js.org/examples) 页面包含更长的示例，这些示例对于学习 p5.js 可能有用。要做出贡献，您可以先查看 [adding_examples.md](https://github.com/processing/p5.js-website/blob/master/contributor_docs/Adding_examples.md)。
- [p5js.org/learn](https://p5js.org/learn) 页面包含可帮助您学习 p5.js 和编程概念的教程。 要做出贡献，您可以先查看 [p5.js guide to contributing to tutorials](https://p5js.org/learn/tutorial-guide.html)。
- 您可能会注意到 p5.js 网站目前支持几种不同的语言。这称为国际化（i18n）。您可以在 [i18n_contribution](https://github.com/processing/p5.js-website/blob/master/contributor_docs/i18n_contribution.md)页面了解更多。

# GitHub Issue 流程

* 我们使用 [GitHub issue](https://github.com/processing/p5.js/issues) 跟踪已知的错误和预期的新功能。[Issue lables](./issue_labels.md) 用于将问题分类，例如[适合初学者](https://github.com/processing/p5.js/labels/level%3Abeginner)的问题。

* 如果您想开始处理现有问题，请对你打算探查的问题发表评论，以便其他贡献者知道该问题正在处理中并可以提供帮助。

* 完成有关此问题的工作后，请针对 p5.js master 分支[提交 Pull request](./preparing_a_pull_request.md) 。在PR的描述字段中，包括 “resolves #XXXX” 标记，以解决您要解决的问题。如果 PR 并不能完全解决该问题（即，在PR合并后该问题应保持打开状态），请输入 “addresses #XXXX”。

* 如果发现错误或有想要添加新功能的主意，请先提交问题。请不要直接地提交包含修复程序或新功能的 Pull Request，而不先发出问题，否则我们将无法接受该 Pull Request。在有关该问题获得反馈并得到同意解决该问题后，您可以按照上述过程以提供修复或功能。

* 您可以对问题进行分类，其中可能包括复制错误报告或要求提供重要信息，例如版本号或复制说明。 如果您想开始分类问题，一种简单的入门方法是[在 CodeTriage 上订阅 p5.js](https://www.codetriage.com/processing/p5.js)。[![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

* [organization.md](https://github.com/processing/p5.js/blob/master/contributor_docs/organization.md) 文件提供了有关如何组织问题以及决策过程的高级概述。如果您有兴趣，欢迎您参与。


# 开发过程

我们知道开发过程可能会有点难——不只是你一个人，所有人一开始都会这么觉得。你可以遵循下面的步骤来设置；如果遇到了问题，你可以在[论坛](https://discourse.processing.org/c/p5js)上讨论或发布一个关于你的问题的 [issue](https://github.com/processing/p5.js/issues)，我们会尽力帮助你的。

1. 下载 [node.js](http://nodejs.org/)（同时将会自动下载 [npm](https://www.npmjs.org) 程式包管理器）

2. 将 [p5.js 代码库](https://github.com/processing/p5.js) [fork](https://help.github.com/articles/fork-a-repo) 到你的 GitHub 账号

3. [复制](https://help.github.com/articles/cloning-a-repository/) 此代码库的新 fork 到本地电脑：

   ```
   $ git clone https://github.com/您的用户名/p5.js.git
   ```

4. 导航到项目文件夹，并使用 npm 安装其所有所需的程式包。

   ```
   $ cd p5.js
   $ npm ci
   ```

5. [Grunt](https://gruntjs.com/) 需要被安装，您可以使用它从源代码构建程式库。

   ```
   $ npm run grunt
   ```

   如果您要不断更改库中的文件，您可以运行 `npm run dev` 以便在源文件发生任何更改时自动为您重建程式库，而无需手动键入命令。

6. 在本地源代码更改然后用 Git [commit](https://help.github.com/articles/github-glossary/#commit) 它们。

   ```
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

7. 再次运行 `npm run grunt` 确保没有语法错误，测试失败或其他问题。

8. 将您对 GitHub 上的 fork 上载（[Push](https://help.github.com/articles/github-glossary/#push)）新更改。

   ```
   $ git push
   ```

9. 一切准备就绪后，使用 [pull request](https://help.github.com/articles/creating-a-pull-request) 发布。

# Gotchas

p5.js代码库附带的开发人员工具在某些方面特意非常严格。 这是一件好事！ 它使所有内容保持一致，并要求您受到纪律监管。 这意味着您可以尝试更改某些东西——可能您的提交会被项目拒绝，但不要灰心。 即使是经验丰富的p5.js开发人员也总是被这些东西所吸引。 通常，问题将出在以下两个方面之一：代码语法或单元测试。

## Code Syntax

p5.js需要纯净且在风格上一致的代码语法，它使用称为[Prettier](https://prettier.io/)和[ESlint](https://eslint.org/)的工具强制执行。 提交前会检查某些样式规则，但是您也可以为代码编辑器安装[ESlint插件](https://eslint.org/docs/user-guide/integrations#editors)，以在键入后立即突出显示错误 他们。 总的来说，在代码风格方面我们会选择灵活性，以减少参与和贡献的区别。

要检查错误，在命令行输入以下（不要键入＄提示符）：

```
$ npm run lint
```

一些语法错误可以自动修复：

```
$ npm run lint:fix
```

坚持使用已建立的项目样式通常是更可取的，但是[偶尔](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=)可能会使用替代语法 使您的代码更易于理解。 对于这些情况，Prettier [提供了一个解决方式](https://prettier.io/docs/en/ignore.html)，`// prettier-ignore`注释，您可以使用它来进行细化的异常。 如果可以的话，尽量避免使用它，因为由棉绒布强制实施的大多数样式首选项都有充分的理由。

 这是代码样式规则的快速摘要。 请注意，此列表可能不完整，最好参考[.prettierrc](https://github.com/processing/p5.js/blob/master/.prettierrc)和[.eslintrc](https://github.com/processing/p5.js/blob/master/.eslintrc)文件以获取完整列表。
 * 使用ES6语法

* 优先使用单引号

* 缩进使用两个空格

* 所有变量至少要使用一次，否则彻底删除

* 不要使用 `x == true` 或 `x == false`，请使用 `(x)` 或 `(x)!`。如果可能导致误解，请将object与null、string与""，number与0对比。

* 在复杂或模棱两可的地方使用注释

* 参见[Mozilla JS practices](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style#JavaScript_practices)，一个有用的代码格式参考。

## Unit Tests

Unit tests are small pieces of code which are created as complements to the primary logic and perform validation. The [unit_testing.md](./unit_testing.md) page gives more information about working with unit tests. If you are developing a major new feature for p5.js, you should probably include tests. Do not submit pull requests in which the tests do not pass, because that means something is broken.

In order to run unit tests, you'll need to make sure you have installed the project's dependencies.

```
$ npm ci
```

This will install *all* the dependencies for p5.js; briefly, the most important dependencies specific to unit testing include:

- [Mocha](https://mochajs.org/), a powerful testing framework that executes individual test files which are specific to p5.js
- [mocha-chrome](https://github.com/shellscape/mocha-chrome), a mocha plugin that runs mocha tests using headless Google Chrome

Once the dependencies are installed, use Grunt to run the unit tests.

```
$ grunt
```

Sometimes it is useful to run the tests in the browser instead of on the command line. To do this, first start the [connect](https://github.com/gruntjs/grunt-contrib-connect) server:

```
$ npm run dev
```

With the server running, you should be able to open `test/test.html` in a browser.

A complete guide to unit testing is beyond the scope of the p5.js documentation, but the short version is that any major changes or new features implemented in the source code contained in the `src/` directory should also be accompanied by test files in the `test/` directory that can be executed by Mocha to verify consistent behavior in all future versions of the library. When writing unit tests, use the [Chai.js reference](http://www.chaijs.com/api/assert/) as a guide for phrasing your assertion messages so that any errors caught by your tests in the future will be consistent and consequently easier for other developers to understand.



# Miscellaneous

- There are other files in the [contributor_docs/](https://github.com/processing/p5.js/tree/master/contributor_docs) folder that you might explore. They pertain to contributing to specific areas of this project, both technical and non-technical.
- [Looking Inside p5.js](http://www.luisapereira.net/teaching/looking-inside-p5/) is a video tour of the tools and files used in the p5.js development workflow.
-  [This video from The Coding Train](https://youtu.be/Rr3vLyP1Ods) :train::rainbow: gives an overview of getting started with technical contribution to p5.js.
- The p5.js [Docker image](https://github.com/toolness/p5.js-docker) can be mounted in [Docker](https://www.docker.com/) and used to develop p5.js without requiring manual installation of requirements like [Node](https://nodejs.org/) or otherwise affecting the host operating system in any way, aside from the installation of Docker.
- The build process for the p5.js library generates a [json data file](https://p5js.org/reference/data.json) which contains the public API of p5.js and can be used in automated tooling, such as for autocompleting p5.js methods in an editor. This file is hosted on the p5.js website, but it is not included as part of the repository.
- p5.js has recently migrated to [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015). To see how this transition could effect your contribution please visit [ES6 adoption](./es6-adoption.md).
