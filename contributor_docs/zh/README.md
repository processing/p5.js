# 🌸欢迎！🌺
感谢你为p5.js做出的贡献！我们的团队重视每一种形式的帮助，并且正在尽可能的扩大帮助的范围，包括文件、教学、编写程序、创作艺术、写作、设计、活动、组织、助理或者任何你能想象到的东西。[我们的网站](https://p5js.org/community/#contribute)上提供了一些提供帮助与参与项目的方法。如果要提供技术性的帮助，请接着往下读。

本项目遵循[贡献者名单](https://github.com/kentcdodds/all-contributors)。遵循[指示](https://github.com/processing/p5.js/issues/2309)把你和你的贡献添加到[readme](https://github.com/processing/p5.js/blob/master/README.md#contributors)，或者是在[GitHub issue](https://github.com/processing/p5.js/issues)中评论你的帮助，我们就会把你加入到贡献者名单中。

# 源代码

首要的 p5.js 项目包括了一下几个其他的repo：
- [p5.js](https://github.com/processing/p5.js)：包括了p5.js源代码。[面向用户的p5.js参考手册](https://p5js.org/reference/)也是由包含在此源代码中的[JSDoc](http://usejsdoc.org/)生成的。它归[Lauren Lee McCarthy](https://github.com/lmccart)所有。
- [p5.js-website](https://github.com/processing/p5.js-website)：此源代码包含了[p5.js website](http://p5js.org)的大多数代码（除参考手册外）。它归[Lauren Lee McCarthy](https://github.com/lmccart)所有。
- [p5.js-sound](https://github.com/processing/p5.js-sound)：包括了p5.sound.js库。归[Jason Sigal](https://github.com/therewasaguy)所有。
- [p5.js-web-editor](https://github.com/processing/p5.js-web-editor)：包含了[p5.js web editor](https://editor.p5js.org)的源代码。 归[Cassie Tarakajian](https://github.com/catarak)所有。请注意，旧版[p5.js editor](https://github.com/processing/p5.js-editor)已不再支持。
- [p5.accessibility](https://github.com/processing/p5.accessibility)：使p5.js更适合盲人和视障人士使用的库。

# 文件结构

这个repo有很多文件，所以这里提供了文件总览。有些文件可能很难懂——不过在你开始之前，你不需要每一个都看懂。我们建议你先从一个特定领域入手（例如说，修复某些内联文档），并努力地探索更多领域。Luisa Pereira的[Looking Inside p5.js](http://www.luisapereira.net/teaching/looking-inside-p5/)也给出了p5.js工具与文件的视频总览。

- `contributor_docs/` 包含了贡献者所需遵循的原则；
- `docs/` 并不包含文档！它包含了 _*生成*_ [线上参考手册](https://p5js.org/reference/)的代码；
- `lib/` 包含一个空示例和the p5.sound扩展功能，并且会周期性地通过[p5.js-sound repository](https://github.com/processing/p5.js-sound)更新。这里也是当用[Grunt](https://gruntjs.com/)把p5.js编译到单个文件后p5.js的位置。发出Pull request时，无需将其检入GitHub存储库。
- `src/` 包含该库的所有源代码，这些源代码通常组织成多个单独的模块。 如果要更改p5.js，这就是您要进行的工作。 大多数文件夹内部都有自己的readme.md文件，以帮助您找到解决方法。
- `tasks/` 包含执行与新版本p5.js的构建，部署和发行有关的自动化任务的脚本。
- `tests/` 包含单元测试，这些单元测试可确保库随着更改而继续正常运行。
- `utils/` 可能包含对存储库有用的其他文件，但是通常您可以忽略此目录。

# GitHub issue流程

* 使用[GitHub issue](https://github.com/processing/p5.js/issues)跟踪已知的错误和预期的新功能。 issue [lables](./ issue_labels.md) 用于将问题分类，例如[适合初学者](https://github.com/processing/p5.js/labels/level%3Abeginner)。

* 如果您想开始处理现有问题，请对打算解决的问题发表评论，以便其他撰稿人知道该问题正在处理中并可以提供帮助。

* 完成有关此问题的工作后，请针对p5.js master分支[提交Pull request](./ preparing_a_pull_request.md) 。 在PR的描述字段中，包括“解决#XXXX”标记，以解决您要解决的问题。 如果PR解决了该问题但不能完全解决（即，在PR合并后该问题应保持打开状态），请输入“地址#XXXX”。

* 如果发现错误或想要添加新功能的想法，请先提交问题。 请不要简单地提交包含修复程序或新功能的拉取请求，而不先发出问题，否则我们将无法接受。 获得有关该问题的反馈并继续解决该问题后，您可以按照上述过程进行操作以提供修复或功能。

* 您可以对问题进行分类，其中可能包括复制错误报告或要求提供重要信息，例如版本号或复制说明。 如果您想开始分类问题，一种简单的入门方法是[在CodeTriage上订阅p5.js](https://www.codetriage.com/processing/p5.js)。  [![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

* [organization.md](https://github.com/processing/p5.js/blob/master/contributor_docs/organization.md)文件提供了有关如何组织问题以及决策过程的高级概述。 如果您有兴趣，欢迎您参与。

# 文档

我们意识到文档是这个项目中最重要的部分。不好的文档是接受新用户与贡献者的最重要的屏障，让项目不具有包容性。[contributing_documentation.md](./contributing_documentation.md) 页面为开始修改文档给出了一个深入的导览。p5.js的文档可以在以下几个地方找到：

- [p5js.org/reference](https://p5js.org/reference/) ：由[inline documentation](./inline_documentation.md) 的源代码生成。它包括了文本描述和参数以及随附的代码片段示例。 我们将所有这些内联放置在内部，以使代码和文档保持紧密的联系，并强化这样的思想，即对文档的贡献与对代码的贡献同等重要（如果不更多）。 构建库后，它将检查内联文档和示例，以确保它们与代码的行为方式匹配。 要做出贡献，您可以先查看[inline_documentation.md](./inline_documentation.md) 页面。
- [p5js.org/examples](http://p5js.org/examples) 页面包含更长的示例，这些示例对于学习p5.js可能有用。 要做出贡献，您可以先查看[adding_examples.md](https://github.com/processing/p5.js-website/blob/master/contributor_docs/Adding_examples.md)。
- [p5js.org/learn](https://p5js.org/learn) 页面包含可帮助您学习p5.js和编程概念的教程。 要做出贡献，您可以先查看 [p5.js guide to contributing to tutorials](https://p5js.org/learn/tutorial-guide.html)。
- 您会注意到p5.js网站目前支持几种不同的语言。 这称为国际化。您可以在[i18n_contribution](https://github.com/processing/p5.js-website/blob/master/contributor_docs/i18n_contribution.md)了解更多。

# Development Process

We know the development process can be a little tricky at first. You're not alone, it's confusing for everyone at the beginning. The steps below walk you through the setup process. If you have questions, you can ask on the [forum](https://discourse.processing.org/c/p5js) or post an [issue](https://github.com/processing/p5.js/issues) that describes the place you are stuck, and we'll do our best to help.

This process is also covered [in a video by The Coding Train.](https://youtu.be/Rr3vLyP1Ods) :train::rainbow:



1. Install [node.js](http://nodejs.org/), which also automatically installs the [npm](https://www.npmjs.org) package manager.

2. [Fork](https://help.github.com/articles/fork-a-repo) the [p5.js repository](https://github.com/processing/p5.js) into your own GitHub account.

3. [Clone](https://help.github.com/articles/cloning-a-repository/) your new fork of the repository from GitHub onto your local computer.

   ```
   $ git clone https://github.com/YOUR_USERNAME/p5.js.git
   ```

4. Navigate into the project folder and install all its necessary dependencies with npm.

   ```
   $ cd p5.js
   $ npm ci
   ```

5. [Grunt](https://gruntjs.com/) should now be installed, and you can use it to build the library from the source code.

   ```
   $ npm run grunt
   ```

   If you're continuously changing files in the library, you may want to run `npm run dev` to automatically rebuild the library for you whenever any of its source files change without you having to first type the command manually.

6. Make some changes locally to the codebase and [commit](https://help.github.com/articles/github-glossary/#commit) them with Git.

   ```
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

7. Run `npm run grunt` again to make sure there are no syntax errors, test failures, or other problems.

8. [Push](https://help.github.com/articles/github-glossary/#push) your new changes to your fork on GitHub.

   ```
   $ git push
   ```

9. Once everything is ready, submit your changes as a [pull request](https://help.github.com/articles/creating-a-pull-request).
