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

# Documentation

We realize the documentation is the most important part of this project. Poor documentation is one of the main barriers to access for new users and contributors, making the project less inclusive. The [contributing_documentation.md](./contributing_documentation.md) page gives an in-depth overview of getting started with documentation. The documentation for p5.js can be found in a few main places:

- The [p5js.org/reference](https://p5js.org/reference/) is generated from [inline documentation](./inline_documentation.md) in the source code itself. This includes the text descriptions and parameters as well as the accompanying code snippet examples. We place all this inline to keep the code and documentation closely linked, and to reinforce the idea that contributing to documentation is as important (if not more) than contributing to the code. When the library gets built, it checks the inline documentation and examples to ensure they match up with the way the code behaves. To contribute, you can start by looking at the [inline_documentation.md](./inline_documentation.md) page.
- The [p5js.org/examples](http://p5js.org/examples) page contains longer examples that can be useful for learning p5.js. To contribute, you can start by looking at the [adding_examples.md](https://github.com/processing/p5.js-website/blob/master/contributor_docs/Adding_examples.md) page.
- The [p5js.org/learn](https://p5js.org/learn) page contains tutorials to help you learn concepts of p5.js and programming. To contribute, you can start by looking at the [p5.js guide to contributing to tutorials](https://p5js.org/learn/tutorial-guide.html).
- You'll notice the p5.js website currently supports a few different languages. This is called internationalization (or i18n for short). You can read more about this documentation on the [i18n_contribution](https://github.com/processing/p5.js-website/blob/master/contributor_docs/i18n_contribution.md) page.
