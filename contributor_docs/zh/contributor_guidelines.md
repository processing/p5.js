# 贡献者指南

欢迎来到 p5.js 贡献者指南！本文档适用于有意为 p5.js 贡献代码的新贡献者、希望复习一些技术步骤的贡献者、以及其他与为 p5.js 贡献代码相关的任何事情。

如果你希望在 p5.js 代码库之外做出贡献（例如编写教程、规划教学课程、组织活动等），请查看其他相关页面。管理员或维护人员可以通过[管理员指南](./steward_guidelines.md)查阅问题审核与拉取请求相关的内容。

本文档尽管内容较多且覆盖面很广，但我们还是会尽量清晰地注明所有步骤和要点。你可以使用目录查找特定章节。如果文档中的某些章节与你要贡献的内容无关，可以选择跳过。


**如果你是一个新贡献者，你可以从第一章节 “关于 Issues” 开始阅读。如果你想查看关于开发流程的详细指南，可以移步 “开发者快速入门指南” 章节**

# 目录

- [贡献者指南](#贡献者指南)
- [目录](#目录)
- [关于 Issues](#关于-issues)
   * [所谓 “Issues” 是指什么？](#所谓-issues-是指什么)
   * [Issue 模板](#issue-模板)
      + [抓到个 bug](#抓到个-bug)
      + [增强现有功能](#增强现有功能)
      + [新功能开发请求](#新功能开发请求)
      + [发起讨论](#发起讨论)
- [修改 p5.js 代码库](#修改-p5js-代码库)
   * [必备条件](#必备条件)
   * [介绍](#介绍)
   * [开发者快速入门指南](#开发者快速入门指南)
   * [使用 GitHub 的编辑功能](#使用-github-的编辑功能)
   * [Fork p5.js 并在你的 Fork 中工作](#fork-p5js-并在你的-fork-中工作)
      + [使用 GitHub 桌面版](#使用-github-桌面版)
      + [使用 git 命令行界面](#使用-git-命令行界面)
   * [代码库拆解](#代码库拆解)
   * [构建设置](#构建设置)
   * [Git 工作流程](#git-工作流程)
      + [源代码](#源代码)
      + [单元测试](#单元测试)
      + [内联文档](#内联文档)
      + [无障碍](#无障碍)
   * [代码规范](#代码规范)
   * [设计原则](#设计原则)
- [拉取请求](#拉取请求)
   * [创建拉取请求](#创建拉取请求)
      + [拉取请求信息](#拉取请求信息)
      + [标题](#标题)
      + [解决](#解决)
      + [更改](#更改)
      + [更改的截图](#更改的截图)
      + [PR 检查列表](#pr-检查列表)
      + [变基和解决冲突](#变基和解决冲突)
   * [讨论和修改](#讨论和修改)

---

# 关于 Issues

p5.js 的 GitHub 存储库上的大部分活动都发生在 Issues 板块，Issues 很可能也是你开始贡献过程的地方。

## 所谓 “Issues” 是指什么？

![A cropped screenshot of the p5.js library GitHub repository, only showing contents of the top right corner. A red box is drawn on top of the screenshot surrounding the Issues tab.](../images/issues-tab.png)

“Issues” 是 GitHub 上描述问题的帖子的通用名称。这个 Issue 可以是一份错误报告，一个添加新功能的请求、一个讨论、或任何与 p5.js 资料库开发有关的帖子。任意 GitHub 账号，乃至于机器人，都可以在每个问题下面评论！这里就是贡献者们讨论与本项目开发相关议题的地方。

尽管提出问题可以有各种各样的理由，但我们通常只使用问题来讨论与 p5.js 源代码开发相关的主题。其他例如调试你个人的代码、邀请合作者加入你个人的项目或其他与上述主题无关的内容应该在[论坛](https://discourse.processing.com)或其他诸如[Discord](https://discord.gg/SHQ8dH25r9)之类平台上讨论。

我们创建了简单易用的 Issue 模板，助你判定某一主题到底是 GitHub 的问题，还是该在其他地方发布的问题！

## Issue 模板

p5.js 的 Issue 模板不仅能助力管理员和维护者更好地理解和审核问题，更能助你更便捷地提出问题并获得答复。

![Screenshot of an example of what an issue looks like on GitHub. The title of the issue in the screenshot is "Warning being logged in Safari when using a filter shader in 2D mode #6597"](../images/github-issue.png)

若要提交新的 Issue，请点进 p5.js 存储库的 ”Issues“ 选项卡，然后点击右侧的  “New issue”按钮。点击后，将显示几个不同的选项，每个选项对应一个相关的 Issue 模板，或者将你重新定向到其他适当的地方提交你的 Issue。建议你选择最贴近需求的选项，以确保你的问题能够迅速得到关注。

![Cropped screenshot of the GitHub repository's issue page with the green "New issue" button highlighted with a red box surrounding it.](../images/new-issue.png)

### [抓到个 bug](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Bug%5C&projects=%5C&template=found-a-bug.yml)

当你在使用 p5.js 时遇到潜在的错误或某些现象与文档描述不符时，请使用[这个模版](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Bug%5C&projects=%5C&template=found-a-bug.yml)。请注意，如果你是在调试代码且认为可能是你自己的代码出了问题，则应该先在[论坛](https://discourse.processing.org)上提问。

该模板有以下字段需要填写：

1. _p5.js 中与之最相关的子领域是？_ - 回答该问题将触发自动标记功能，为问题打上相关的[标签](https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md)，这有助于我们更好地识别和回应你的问题。
2. _p5.js 版本_ - 你可以在`<script>`标签的链接中或者在 p5.js/p5.min.js 文件的第一行找到 p5.js 的版本号。它的格式类似于`1.4.2`（由三个句点分隔的数字）。
3. _Web 浏览器及版本_ - 该信息有助于我们区分代码在不同浏览器中的行为差异。浏览器版本号可以根据下方表格中对应不同浏览器的步骤找到。

<table>

<tr>

<td>

Chrome

</td>

<td>

Firefox

</td>

<td>

Safari

</td>

</tr>

<tr>

<td>

在地址栏中输入 `chrome://version`

</td>

<td>

在地址栏中输入   `about:support`

</td>

<td>

打开顶部 “Safari” 菜单, 选择 “关于 Safari”

</td>

</tr>

</table>

4. _操作系统_ - 如可能，请提供操作系统的版本号，例如`macOS 12.5`。某些错误也可能源于操作系统。
5. _重现错误所需步骤_ - 这可能是最重要的信息。请详细列出重现你所遇到的错误的步骤。贴出能够展示问题产生的简单示例代码可以让其他人更容易重现你的错误并制定解决方案。

**重现错误是最关键的**该模板中的许多字段都旨在能够重现 Bug。你提供的关于草图环境的信息越多、重现问题的步骤越丰富，别人也就越容易理解你的问题并探索解决方案。

**请尽可能提供详细的信息，避免使用泛泛的陈述**。例如，不要说 “image()函数不好用了”，而要说得更具体，比如：“image()函数无法以正确的尺寸显示加载的 GIF 图像”。描述以下两个方面可以使你的问题描述更加清晰：

1. 你期望你分享的示例代码执行什么样的行为（预期行为）；
2. 示例代码实际上做了什么（实际行为）。

如果你希望为你刚刚报告的错误贡献修复代码，你可以在描述中说明。如果你可以提供一个简单的建议来修复你所描述的错误，那对于问题评审者来说将非常有帮助，因为他们需要知道你需要多少支持来贡献修复代码。

**你不应该在没有相应问题或在问题获得实施批准之前提交拉取请求（或开始进行代码更改）**，这是因为无法保证你的建议将被接受，而你所做的工作最终可能不会被合并。

Bug 报告只有在至少一名[领域管理员或维护者](https://github.com/processing/p5.js#stewards)核准的情况下才会被接受修复。在此之后，拉取请求的工作才会开始。

### [增强现有功能](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Enhancement%5C&projects=%5C&template=existing-feature-enhancement.yml)

如果你想提议修改 p5.js 的现有功能（函数、常量、渲染等）或为现有功能添加新规格，则应使用此模板。比如，如果你想为`color()`函数和其他接受颜色的函数添加一种新的定义颜色的方式，就应该使用本模板。

该模板有以下字段需要填写：

1. _提高无障碍性_ - 这是一个必填项目，你需要在此处说明你建议加强的功能将会如何使得 p5.js 对于那些在创意和科技领域长期被边缘化的人群具备[更高的无障碍性](./access.md)。通常来讲，**如未填写此项，提案将被拒绝**。但你也可以填写“我不确定”，邀请社区的其他成员集思广益，帮你论证该增强功能可以怎样提高 p5.js 的无障碍性。
2. _p5.js 中最合适的子领域是什么？_ - 这可以帮助我们锁定并回应你的问题。你的答复还将触发自动标记功能，使用相关的[标签](./issue_labels.md)标记该问题。
3. _功能增强详情_ - 在这里描述你对功能增强的建议。一个好的功能增强建议通常包括清晰的用例：这个功能增强是什么、何时使用、如何使用以及为什么需要这个功能增强。

要使功能增强建议被接受，必须经过至少一名[领域管理员或维护者](https://github.com/processing/p5.js#stewards)批准，而后才会开始处理拉取请求。

**如果与拉取请求相对应的问题不存在或问题尚未获批，则不应提交拉取请求（或开始更改代码）**，因为提案是不一定会被接受的。提案未被接受时提交的拉取请求在问题获批前都会被关闭。

### [新功能开发请求](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Feature+Request%5C&projects=%5C&template=feature-request.yml)

该模板适用于提出为 p5.js 加入新功能的建议。例如，创建一个新的 `createTable` 函数，用于绘制原生的 HTML `<table>` 页面元素。有些提议可能与现有的功能增强建议趋同，在这种情况下，就在两种模版中选择你认为更合适的。

同样，本模板的表单字段与“增强现有功能”部分的字段也几乎一致。有关如何填写每个字段的详情，请参考[上一节](#existing-feature-enchancement)。

新功能的开发请求只有在至少两名[领域管理员或维护者](https://github.com/processing/p5.js#stewards)核准的情况下才会被批准。在此之后，拉取请求的工作才会开始。

**如果与拉取请求相对应的问题不存在或问题尚未获批，则不应提交拉取请求（或开始更改代码）**，因为提案是不一定会被接受的。提案未被接受时提交的拉取请求在问题获批前都会被关闭。

### [发起讨论](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Discussion%5C&projects=%5C&template=discussion.yml)

该模板适用于你要提交的问题不适用上述所有其他模版的情况。在现实中，这种情况应该比较少见。如，关于是否在 p5.js 中采用特定的 Web API 功能应该作为一个[新功能开发请求](#new-feature-request)来提交；而在各种颜色函数中添加额外的颜色模式则应作为[增强现有功能](#existing-feature-enchancement)来提交；若要发布一则你组织的本地创意编程活动的公告，应该去论坛上发帖，并通过 Processing Foundation 寻求支持或宣传。

在发启讨论问题时，你可以使用侧面板上的 “Labels（标签）” 选项来添加更多相关标签，以便将你的问题引导到相关领域。此模板本身仅包含一个基本的文本字段。通过[这个链接](https://github.com/processing/p5.js/issues/6517)可以查看讨论问题的范例。

[**⬆ 回到顶部**](#贡献者指南)

---

# 修改 p5.js 代码库

## 必备条件

要继续进行，你至少应该对使用命令行、git、node.js（至少 v18 及以上版本）有初步了解，并且已经建立了本地开发环境。

## 介绍

当问题已讨论过，解决方案已经批准，并且你愿意进行代码更改，就可以着手修改代码库了。

同样的，如果你遇到了一个问题、参与讨论了一个问题且管理员已经批准了解决方案，然而问题的原作者和其他社区成员却没有表态乐意处理该问题，你就可以自愿提交一份贡献申请，让管理员将该问题分配给你。

**你不应该“插队”** 提交拉取请求，以期插手一个他人已经有意提交贡献或已经分配给他人的问题。我们永远会根据"先来先得"的原则接受一个问题的代码贡献申请。

如果你为一个问题提交了拉取请求，但同时还有其他人在处理同一个问题，你的拉取请求将会被关闭。如果你发现某个已分配给某人的问题已经几个月都没有动静，你可以就该问题礼貌地询问进展如何以及是否需要帮助。我们通常为大家编写贡献留出相当长的时间，因为我们理解大多数人是志愿工作，或者对一些人来说编写功能确实需要很长时间。

同样地，你应该按照自己的节奏工作，并相信我们不会为处理某个问题设定严格的时间限制。话虽如此，如果你在代码贡献的任何方面遇到困难，别犹豫，马上在问题内求助。管理员、维护人员以及其他社区成员都会尽力为你提供指导！

## 开发者快速入门指南

如果你想作为开发者参与 p5.js 代码库的开发工作或提交贡献，无论是直接改进 p5.js 还是改进其诸如 [Friendly Error Systems](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md) 之类的子项目，都可按以下步骤操作：

1. [创建一个 p5.js 的 fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
2. [将你创建的 fork 克隆到你的电脑](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
3. [使用以下命令添加 upstream](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork)
    ```
   git remote add upstream https://github.com/processing/p5.js
   ```

4. 确认你的电脑上已经安装了 [NodeJs](https://nodejs.org/en/download)。可以通过以下命令来确认：

   ```
   node -v
   ```

5. 使用以下命令安装依赖项:

   ```
   npm ci
   ```

6. 使用以下命令从 `main` 分支创建一个具有描述性分支名称的 git 分支：

   ```
   git checkout -b [branch_name]
   ```

7. 当你开始对代码库进行更改时，应频繁进行测试（尽管测试耗时，但能确保现有行为未被改坏）。
   
   ```
   npm test
   ```

8. 如果你正在添加新功能或在增强现有功能，需添加单元测试。
9. 完成后，你可以提交更改并创建[拉取请求](https://p5js.org/contributor-docs/#/./contributor_guidelines?id=pull-requests)。

## 使用 GitHub 的编辑功能

在 GitHub 网页界面上浏览文件时，文件内容顶部附近有一个铅笔图标按钮。该按钮的作用是启动 GitHub 自带的便捷编辑功能，可用于简化以下我们将会介绍的诸多流程。你可以使用它来快捷地编辑当前浏览的文件。

![Cropped screenshot of a file view in GitHub of the p5.js repository, "src/color/color_conversion.js" file. A red arrow pointing to a pencil icon button on the right side of the image.](../images/edit-file.png)

但是，除非要进行的更改非常简单，否则不建议使用该功能。主要是因为，如要对源代码进行较复杂的更改，则应该先在本地进行构建和测试，然后再提交拉取请求。对于大多数人来说，使用本地开发环境通常比该编辑功能提供的基本编辑环境更为流畅。

## Fork p5.js 并在你的 Fork 中工作


第一步是 Fork p5.js 存储库。在开源项目中，Fork 具有特定的含义，但对于我们的目的来说，它意味着创建存储库的副本并将其存储在你自己的 GitHub 帐户中。要 Fork 一个存储库，只需点击页面顶部附近的"Fork"按钮，GitHub 将在你的帐户中创建存储库的副本。

![Screenshot of the main page of repository. A button, labeled with a fork icon and "Fork 59.3k," is outlined in dark orange.](../images/fork.png)

从你的 p5.js 存储库 Fork 进行工作是必要的，因为你可能没有直接写入官方 p5.js 存储库的权限，而在 Fork 上工作可以让你进行更改，然后将其提交回官方存储库。

### 使用 GitHub 桌面版

GitHub 桌面版是通过图形用户界面来使用 git 的程序，它不需要你在终端输入命令。如果你是 git 新手， GitHub 桌面版会是很好的选择，并且你可以在 GitHub 桌面版和终端之间随意切换。

首先，下载并安装[GitHub 桌面版](https://desktop.github.com/)。安装成功后，打开应用程序。根据提示登录你的 GitHub 账户。登录成功后，你可以看到你的项目，包括你 fork 的 p5.js。选择名为：`你的用户名/p5.js` 的项目，然后点击蓝色 “Clone” 按钮。根据提示选择项目存储位置，你可以更改存储位置也可以保留默认选项并继续。

![The GitHub Desktop user interface after signing in. On the right half of the screen, it lists your projects, and a Clone button in the bottom right.](../images/github-desktop-init.png)

克隆成功后，你需要选择使用该 fork 的目的。请选择 “To contribute to the parent project”，然后点击 “Continue”。

![The view after cloning a fork. It asks if you are planning to contribute to the parent project, or use it for your own purposes.](../images/github-desktop-fork.png)

### 使用 git 命令行界面

创建好 fork 之后，去 fork 页面点击绿色 “Code” 按钮复制 git 链接。链接的格式是这样：`https://github.com/limzykenneth/p5.js.git`。

![Screenshot of the list of files on the landing page of a repository. The "Code" button is highlighted with a dark orange outline.](../images/code-button.png)

然后在本地环境中打开命令行，并克隆这个存储库。简单地说，“克隆” 就是将仓库副本下载到本地计算机上。在你想要存储 p5.js 源代码文件夹的文件夹中运行以下命令：

```
git clone [git_url]
```

将 `[git_url]` 替换为你在上一步复制的 git 链接。这可能需要等几分钟，具体多久取决于你的网速，你可以去泡杯咖啡。克隆完成后，用你喜欢的文本编辑器打开名为 `p5.js` 的文件夹，就可以开始查看了。

## 代码库拆解

在 p5.js 文件夹中，你将会遇到一些关键的文件和文件夹，具体如下：

- `src` - 最终生成 `p5.js` 和 `p5.min.js` 文件的所有代码都存放于此。
- [`test`](../unit_testing.md) - 存放单元测试代码和测试所有文档示例代码的位置。
- `tasks` - 存放详细的自定义构建代码的位置。
- `Gruntfile.js` - 主要的构建配置文件。
- `contributor_docs` - 存放文档和其他贡献者文档的位置。

其他文件和文件夹要么是配置文件，要么是其他类型的支持文件，大多数情况下，你不需要对它们做任何修改。

## 构建设置

为了构建和测试运行 p5.js，你需要先创建本地项目文件夹。假设你已经安装了 `Node.js`，请运行如下代码：

```
npm ci
```

这可能需要一些时间，因为 npm 会下载所有需要的依赖项。但是，一旦下载完成，就全部设置好了。非常简单，对吧？

## Git 工作流程

现在，你可以根据自己的需要做更改了。关于存储库其他部分的详情，以及如何做相应修改，请参考接下来的子章节。若要开始，请运行：

```
npm test
```

从头开始构建 p5.js 并运行所有单元测试，这整个过程应该是不会报错的。如果你只是想构建仓库而不运行测试，可以运行：

```
npm run build
```

以上任何一个命令都会在 `lib/` 文件夹中创建 `p5.js` 和 `p5.min.js` 文件。如果需要，你可以用这些构建好的文件来做测试。

接下来，我们建议你开始工作之前在主分支 `main` 上创建一个分支。在 git 中，分支顾名思义就是存储库的一个分支版本，你可以在分支上添加提交而不会影响主分支或其他分支。在分支上，你可以同时处理多个功能（通过使用多个不同的分支），而不用担心搞砸之后会影响到主分支。

如果使用 GitHub 桌面版，可以点击窗口上方的 “Current Branch” 按钮来创建分支。你可以在这里切换分支，或输入分支名创建一个新分支。在这里，我们输入一个分支名描述一下即将做的更改，然后点击 “Create New Branch”。

![A screenshot of the GitHub Desktop branch selection menu. After entering a new branch name that does not yet exist, a "Create New Branch" button appears.](../images/github-desktop-create-branch.png)

如果使用终端，在主分支上运行 `git checkout -b branch_name`，将 `branch_name` 替换为描述性的内容，然后你就在一个新的分支上了。

我们建议你在做更改时经常运行 `npm test`， 尤其是在修改源代码的时候。运行这个命令会花费一些时间，但它能确保你的修改不会破坏当前行为。在参照以下描述提交更改之前，你应该先运行 `npm test`。

一旦你对代码库做了更改，就需要将它提交到 git。一次提交是保存在 git 存储库中的一系列更改，它本质上记录了提交时仓库中文件的当前状态。

可能你会问你应该每隔多久向 git 做一次提交？通常情况下，我们建议你经常提交，而不是将多个更改合并为一次提交。好的做法是，每完成一个可以用一句话描述的子任务就做一次提交。

要从 GitHub 桌面版提交当前所有更改，请在更改完成后打开该应用程序。左侧边栏会显示你更改过的文件，右侧显示每个文件中的更改详情。在窗口左下角，用户图标旁边的区域中输入简要的描述，这就是本次提交的标题。你可以在下面的描述区域中做进一步阐述或留白，点击蓝色的 "Commit" 按钮以完成更改。

![A screenshot of GitHub Desktop after having made a change. The area where you need to write a title for your change is circled in red in the lower left of the window.](../images/github-desktop-commit.png)

要从终端提交当前所有更改，请运行以下命令：

1. 运行以下命令，检查是否只列出了你更改过的文件。

```
git status
```

如果列出了你没有更改过的文件，你需要将它们 [恢复](https://git-scm.com/docs/git-restore) 到原始状态，或者确保这些更改是你想要的。如需查看每个文件的更改详情，请运行以下命令：

```
git diff
```

不想要的文件更改，不要提交到 PR 中。

2. 运行以下命令，将所有更改添加到 git 暂存区

```
git add .
```

3. 运行以下命令，将所有更改提交到 git

```
git commit -m "[your_commit_message]"
```

将 `[your_commit_message]` 替换为描述本次更改相关的信息，避免使用宽泛的陈述。例如：不用 “文档修复 1”，而用 “给 circle() 函数添加文档示例”

```
git commit -m "Add documentation example to circle() function"
```

所有提交都重复以上步骤，同时定期运行 `npm test` 以确保一切正常运行。

### 源代码

如果你要处理源代码，并且也清楚你要处理 p5.js 的哪些功能，好的开始是去看文档。因为 p5.js 文档中，每个已记录功能的底部，都有其源代码的链接。

![Cropped screenshot of a reference page on the p5.js website containing the sentence "Notice any errors or typos? Please let us know. Please feel free to edit src/core/shape/2d\_primitives.js and issue a pull request!". Part of the above sentence where it says "src/core/shape/2d\_primitives.js" is highlighted with a red underline and arrow pointing to it.](../images/reference-code-link.png)

### 单元测试

如果你要进行单元测试，请参阅[这里](./unit_testing.md)。需要注意的是，对于任何功能强化、功能新增和错误修复，都应该在 PR 中添加相关的单元测试。

### 内联文档

如果你要处理内联文档，请参阅[这里](./inline_documentation.md)。

### 无障碍

如果你要处理无障碍功能，请参阅[这里](./web_accessibility.md)。关于友好的错误系统，请参阅[这里](./friendly_error_system.md)。

## 代码规范

p5.js 的代码规范或者代码风格由 [ESLlint](https://eslint.org/) 执行。任何 git 提交和拉取请求在被接受之前，都必须通过 ESLint 代码检查。要遵循正确的代码规范，最简单方法是在文本编辑器中使用可用的 ESLint 插件，它可以高亮显示 ESLint 检查到的错误（适用于大多数流行的文本编辑器）。

## 设计原则

开发 p5.js 的功能时，牢记 p5.js 的设计原则是很重要的。我们的优先级可能与其他项目的优先级不同，所以如果你来自其他项目，建议你先熟悉 p5.js 的设计原则。

- **无障碍性**：我们将无障碍性置于首位，在做决定时，必须考虑如何提升历史上被边缘化的群体的无障碍性性。在我们的无障碍报告中可以了解更多相关信息。

- **适合初学者**：p5.js API 适合初学者，它使用前沿的 HTML5/Canvas/DOM API ，为创建交互性视觉内容提供了低门槛。

- **教育性**：p5.js 专注于支持教育用途的 API 和课程，包括 API 的完整参考和支持示例，还有介绍核心创意编程原则的教程和示例课程，思路清晰，井然有序。

- **JavaScript 及其社区**：为了使初学者更容易接触到 Web 开发实践，p5.js 通过对合适的 JavaScript 设计模式和使用进行建模，并在必要时进行提取。作为一个开源库，p5.js 还将更广泛的 JavaScript 社区纳入其创作、文档和传播当中。

- **Processing 及其社区**：p5.js 受到 Processing 语言及其社区的启发，致力于将 Processing Java 到 JavaScript 的转换变得简单而清晰。

[**⬆ 回到顶部**](#贡献者指南)

# 拉取请求

当你完成了包括单元测试在内的所有更改，运行过 `npm test` 没有报错，并且已经提交了更改，你就可以开始准备拉取请求，将你的新提交合并到 p5.js 官方仓库中。一个拉取请求，更正式地说，是对一个仓库（当前情况是指 p5.js 官方存储库）提出的请求，请求从另一个仓库（当前情况是指 fork 的 p5.js 仓库）拉取或合并更改到其提交历史中。

## 创建拉取请求

首先，将新的提交推送到你 fork 的 p5.js 中，你可以理解为将更改上传到你的 fork。

如果使用 GitHub 桌面版，在窗口顶部用于切换分支的按钮的右侧，有一个按钮可以将你的更改推送到 GitHub，点击这个按钮推送你的更改。

![A view of GitHub Desktop after committing changes. The button to push the changes online is circled in red.](../images/publish-branch.png)

一旦代码上传完毕，你将会看到一个按钮提示你创建拉取请求。点击一下这个按钮会显示预览，预览中包含另一个按钮，这个按钮才可以真正地创建请求。点击 "Create Pull Request" 按钮创建拉取请求。

![A screenshot of Github Desktop after pushing code. In the left sidebar, it says "0 changed items." In the right pane, below the "No local changes" header, a blue "Review Pull Request" button has been marked up with a red circle.](../images/preview-pull-request.png)

如果使用终端，请运行以下代码：

```
git push -u origin [分支名称]
```

推送完成后，你可能会在终端里看到一个链接，可以点击它创建拉取请求。如果没有，你可以在浏览器中导航到你的 fork，通过文件列表顶部的下拉按钮切换到你正在工作的分支，然后点击 “Contribute”，接着点击 "Open pull request"。

![Screenshot of the git command line response after pushing a new branch. It includes a GitHub link to open a new pull request.](../images/new-branch.png)

当你访问 p5.js 的 Github 仓库时，你可能也会看到一个创建拉取请求的按钮。点击它也可以创建一个新的拉取请求。

![Cropped screenshot of the main page of the p5.js GitHub repository web page. A section near the top of the page is a yellow call to action box containing a green button with the text "Compare & pull request".](../images/recent-pushes.png)

### 拉取请求信息

![Screenshot of an "Open a pull request" page on GitHub that is prepopulated with p5.js's pull request template.](../images/new-pr.png)

在提交拉取请求之前，你需要填写拉取请求模板。

### 标题

拉取请求的标题应简要描述更改的内容，再次提醒要避免宽泛的陈述。

### 解决

在模板中，有这样一行文字：`解决 #[在此添加 issue 编号]`，你需要将 `[在此添加 issue 编号]` 替换为你正在处理/修复的 issue 的 issue 编号 [看上面](#关于issue)（例如，`解决 #1234`）。这样可以确保 PR 合并后，该 issue 会自动关闭。如果你不希望 PR 合并后自动关闭该 issue（可能因为有更多的更改将在其他 PR 中提交），请将 `解决` 改为 `处理`。

### 更改

清晰地描述你在 PR 中所做的更改，包括任何与审阅者相关的实现细节和决策。

### 更改的截图

是否需要上传截图，视情况而定。当更改涉及到 p5.js 在画布上呈现可视化内容时，就需要上传截图。请注意，不是文本编辑器的截图，而是做过更改后的页面预览截图。

### PR 检查列表

检查列表包含一些相关的选项，将 `[ ]` 替换为 `[x]` 来勾选与你的更改有关的选项。

勾选完成后，点击 “Create pull request”。

### 变基和解决冲突

![Screenshot of an open pull request on p5.js's GitHub repository. The title of the pull request says "Fix filter shaders when rectMode is applied; add tests #6603.](../images/opened-pr.png)

现在你应该检查已提交的拉取请求，并注意以下几点：

1. 提交的次数应该与你在这个 PR 上所做的提交次数相匹配，也就是说，如果你在这个 PR 上做了两次提交，"Commits" 选项卡中应该只显示两个提交记录。
2. "Files changed" 选项卡只展示你的更改与 p5.js 仓库之间的差异。
3. 靠近页面底部，应该可以看到 "This branch has no conflicts with the base branch"， 而不是 "This branch has conflicts that must be resolved"。

如果以上任何一项不正确（提交数量多于预期或存在冲突），你可能需要 [变基](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) 或者帮忙解决冲突。这里的冲突是指：你所更改的文件，近期已经有过更新，git 不确定该保留或者忽略哪组修改。如果你不确定如何解决这些 issues，请联系我们，我们将指导你完成。基本操作步骤如下：

有时，GitHub 会显示 "Resolve Conflicts" 按钮，允许你直接在浏览器中解决冲突。

![A screenshot of a GitHub pull request with merge conflicts. The conflicting filenames are listed, and there is a "Resolve conflicts" button highlighted.](../images/resolve-conflicts.png)

冲突展示在 `<<<<<<<` 和 `>>>>>>>` 之间， 被 `=======` 隔开。前半部分是你自己写的代码，后半部分是主分支中已经变更过的代码。

![A screenshot of GitHub's conflict resolution interface. A sidebar lists the files with conflicts. The right pane contains the conflicting code, with merge conflict markers highlighted.](../images/conflicts-interface.png)

删除冲突标记，在 PR 中保留最终需要保留的代码。所有冲突都解决好之后，点击 "Mark as resolved"。

![A screenshot of the GitHub conflict resolution interface after editing the code to remove the merge conflict markers. The "mark as resolved" button in the upper right is enabled.](../images/mark-as-resolved.png)

所有文件的冲突都解决好之后，就可以提交更改了。

![The GitHub conflict resolution interface after all conflicts have been marked as resolved. A green "commit merge" button is enabled.](../images/commit-merge.png)

有时候，冲突对于 Github 来说在网页上展示起来太过复杂。在这种情况下，或者如果你更喜欢手动操作，你也可以在本地解决冲突：

1. 运行 `git remote add upstream https://github.com/processing/p5.js`
2. 运行 `git fetch upstream`
3. 运行 `git rebase upstream/main`
4. 可能会有冲突！如果只涉及到 `lib/p5.js` 和 `lib/p5.min.js`，就很容易解决，只需重新构建项目。如果其他文件存在冲突，并且你不确定如何解决，去寻求帮助吧！
```
npm test
git add -u
git rebase --continue
```

5. 运行 `git push`

上述步骤完成后，上面的检查列表可能会清空，如果没有清空，我们将指导你完成必要的修复。

## 讨论和修改

现在你已经提交了 PR，管理员或维护者将会进行审核。可能需要几天时间，管理员才能给你回复，请耐心等待。在此期间，你可以看看其他尚未解决的 issues。

一旦管理员审核了你的 PR，可能会有两种结果：1. 你的 PR 被批准并合并，太棒了！2. 管理员可能会针对你的 PR 提出一些问题，或者要求你做一些修改。如果是后者，不要惊慌，这是完全正常的，并且管理员们总是愿意帮助你完成你的贡献！

如果你的 PR 需要进一步更改，并且你能够完成这些更改，请按照之前的[相同流程](#git-工作流程) 进行操作。但务必在本地仓库副本的相关分支进行修改、提交， 并将提交推送到你 fork 的远程仓库。一旦提交成功，新的提交会自动显示在你的 PR 中。然后在 PR 中留言，让审阅者知道你已经按要求做了更改。如果不需要额外的更改，你的 PR 将被合并！

[**⬆ 回到顶部**](#贡献者指南)