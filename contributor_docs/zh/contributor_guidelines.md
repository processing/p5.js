# 贡献者指南

欢迎阅览 p5.js 贡者指南！本文档适用于有意为 p5.js 贡献代码的新贡献者、希望复习一些技术步骤的贡献者、以及其他与为 p5.js 贡献代码相关的任何事情。

如果您希望在 p5.js 代码库之外做出贡献（例如编写教程、规划教学课程、组织活动等），请查看其他相关页面。管理员或维护人员可以通过[管理员指南](./steward_guidelines.md)查阅问题审核与拉取请求相关的内容。

本文档尽管内容较多且覆盖面很广，但我们还是会尽量清晰地注明所有步骤和要点。您可以使用目录查找特定章节。如果文档中的某些章节与您要贡献的内容无关，可以选择跳过。

# 目录

- [关于问题](#%E5%85%B3%E4%BA%8E%E9%97%AE%E9%A2%98)
- [所谓“问题”是指什么？](##%E6%89%80%E8%B0%93%E9%97%AE%E9%A2%98%E6%98%AF%E6%8C%87%E4%BB%80%E4%B9%88)
- [问题模板](##%E9%97%AE%E9%A2%98%E6%A8%A1%E6%9D%BF)
  - [抓到个 bug](###%E6%8A%93%E5%88%B0%E4%B8%AA-bug)
  - [增强现有功能](###%E5%A2%9E%E5%BC%BA%E7%8E%B0%E6%9C%89%E5%8A%9F%E8%83%BD)
  - [新功能开发请求](###%E6%96%B0%E5%8A%9F%E8%83%BD%E5%BC%80%E5%8F%91%E8%AF%B7%E6%B1%82)
  - [发起讨论](###%E5%8F%91%E8%B5%B7%E8%AE%A8%E8%AE%BA)
- [修改 p5.js 代码库](#%E4%BF%AE%E6%94%B9-p5js-%E4%BB%A3%E7%A0%81%E5%BA%93)
- [开发者快速入门指南](##%E5%BC%80%E5%8F%91%E8%80%85%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97)
  - [使用 Github 的编辑功能](##%E4%BD%BF%E7%94%A8-github-%E7%9A%84%E7%BC%96%E8%BE%91%E5%8A%9F%E8%83%BD)
  - [Fork p5.js 并在您的 Fork 内工作](##fork-p5js-%E5%B9%B6%E5%9C%A8%E6%82%A8%E7%9A%84-fork-%E5%86%85%E5%B7%A5%E4%BD%9C)
  - [使用 Github 桌面版](###%E4%BD%BF%E7%94%A8-github-%E6%A1%8C%E9%9D%A2%E7%89%88)
  - [使用 git 命令行界面](###%E4%BD%BF%E7%94%A8-git-%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%95%8C%E9%9D%A2)
  - [代码库拆分](#%E4%BB%A3%E7%A0%81%E5%BA%93%E6%8B%86%E5%88%86)
  - [构建设置](#%E6%9E%84%E5%BB%BA%E8%AE%BE%E7%BD%AE)
  - [Git 工作流程](#git%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B)
  - [源代码](#%E6%BA%90%E4%BB%A3%E7%A0%81)
  - [单元测试](#%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95)
  - [内联文档](#%E5%86%85%E8%81%94%E6%96%87%E6%A1%A3)
  - [国际化](#%E5%9B%BD%E9%99%85%E5%8C%96)
  - [可访问性](#%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7)
  - [代码规范](#%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83)
  - [设计原则](#%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99)
- [拉取请求](#%E6%8B%89%E5%8F%96%E8%AF%B7%E6%B1%82)
  - [创建拉取请求](#%E5%88%9B%E5%BB%BA%E6%8B%89%E5%8F%96%E8%AF%B7%E6%B1%82)
  - [标题](#title)
  - [解决问题](#resolves)
  - [变更内容](#changes)
  - [为内容变更截图](#screenshots-of-the-change)
  - [拉取请求确认清单](#pr-checklist)
  - [变基和解决冲突](#%E5%8F%98%E5%9F%BA%E5%92%8C%E8%A7%A3%E5%86%B3%E5%86%B2%E7%AA%81)
  - [讨论和修改](#%E8%AE%A8%E8%AE%BA%E5%92%8C%E4%BF%AE%E6%94%B9)

---

# 关于问题

p5.js 的 Github 存储库（repo）上的大部分活动都发生在问题上，Issue 很可能也是您开始贡献过程的地方。

## 所谓“问题”是指什么？

![A cropped screenshot of the p5.js library GitHub repository, only showing contents of the top right corner. A red box is drawn on top of the screenshot surrounding the Issues tab.](images/issues-tab.png)

“问题” 是 Github 上描述问题的帖子的通用名称。这个"问题"可以是一份错误报告，一个添加新功能的请求、一个讨论、或任何与 p5.js 资料库开发有关的帖子。任意 Github 账号，乃至于机器人，都可以在每个问题下面评论！这里就是贡献者们讨论与本项目开发相关议题的地方。

尽管提出问题可以有各种各样的理由，但我们通常只使用问题来讨论与 p5.js 源代码开发相关的主题。其他例如调试你个人的代码、邀请合作者加入你个人的项目或其他与上述主题无关的内容应该在[论坛](https://discourse.processing.com)或其他诸如[Discord](https://discord.gg/SHQ8dH25r9)之类平台上讨论。

我们创建了简单易用的问题模板，助您判定某一主题到底是 Github 的问题，还是该在其他地方发布的问题！

## 问题模板

p5.js 的问题模板不仅能助力管理员和维护者更好地理解和审核问题，更能助你更便捷地提出问题并获得答复。

![Screenshot of an example of what an issue looks like on GitHub. The title of the issue in the screenshot is "Warning being logged in Safari when using a filter shader in 2D mode #6597"](images/github-issue.png)

若要提交新的问题，请点进 p5.js 存储库的“问题”选项卡，然后点击右侧的“New issue”按钮。点击后，将显示几个不同的选项，每个选项对应一个相关的问题模板，或者将您重新定向到其他适当的地方提交您的问题。建议您选择最贴近您需求的选项，以确保您的问题能够迅速得到关注。

![Cropped screenshot of the GitHub repository's issue page with the green "New issue" button highlighted with a red box surrounding it.](images/new-issue.png)

### ["抓到个 bug"](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Bug%5C&projects=%5C&template=found-a-bug.yml)

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
5. _重现步骤_ - 这可能是最重要的信息。请详细列出重现你所遇到的错误的步骤。贴出能够展示问题产生的简单示例代码可以让其他人更容易重现你的错误并制定解决方案。

**重现错误是最关键的！**该模板中的许多字段都旨在能够重现 Bug。你提供的关于草图环境的信息越多、重现问题的步骤越丰富，别人也就越容易理解你的问题并探索解决方案。

**请尽可能提供详细的信息，避免使用泛泛的陈述**。例如，不要说"image()函数不好用了"，而要说得更具体，比如："image()函数无法以正确的尺寸显示加载的 GIF 图像"。描述以下两个方面可以使你的问题描述更加清晰：

1. 你期望你分享的示例代码执行什么样的行为（预期行为）；
2. 示例代码实际上做了什么（实际行为）。

如果您希望为您刚刚报告的错误贡献修复代码，您可以在描述中说明。如果您可以提供一个简单的建议来修复您所描述的错误，那对于问题评审者来说将非常有帮助，因为他们需要知道您需要多少支持来贡献修复代码。

**您不应该在没有相应问题或在问题获得实施批准之前提交拉取请求（或开始进行代码更改）**，这是因为无法保证您的建议将被接受，而您所做的工作最终可能不会被合并。

Bug 报告只有在至少一名[领域管理员或维护者](https://github.com/processing/p5.js#stewards)核准的情况下才会被接受修复。在此之后，拉取请求的工作才会开始。

### ["增强现有功能"](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Enhancement%5C&projects=%5C&template=existing-feature-enhancement.yml)

如果您想提议修改 p5.js 的现有功能（函数、常量、渲染等）或为现有功能添加新规格，则应使用此模板。比如，如果您想为`color()`函数和其他接受颜色的函数添加一种新的定义颜色的方式，就应该使用本模板。

该模板有以下字段需要填写：

1. _提高可访问性_ - 这是一个非可选字段，你需要在此处说明你建议加强的功能将会如何使得 p5.js 对于那些在创意和科技领域长期被边缘化的人群具备[更高的可访问性](./access.md)。通常来讲，**如未填写此项，提案将被拒绝**。但你也可以填写"我不确定"，邀请社区的其他成员集思广益，帮你论证该增强功能可以怎样提高 p5.js 的可访问性。
2. _p5.js 中最合适的子领域是什么？_ - 这可以帮助我们锁定并回应您的问题。你的答复还将触发自动标记功能，使用相关的[标签](./issue_labels.md)标记该问题。
3. "功能增强详情" - 在这里描述您对功能增强的建议。一个好的功能增强建议通常包括清晰的用例：这个功能增强是什么、何时使用、如何使用以及为什么需要这个功能增强。

要使功能增强建议被接受，必须经过至少一名[领域管理员或维护者](https://github.com/processing/p5.js#stewards)批准，而后才会开始处理拉取请求。

**如果与拉取请求相对应的问题不存在或问题尚未获批，则不应提交拉取请求（或开始更改代码）**，因为提案是不一定会被接受的。提案未被接受时提交的拉取请求在问题获批前都会被关闭。

### ["新功能开发请求"](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Feature+Request%5C&projects=%5C&template=feature-request.yml)

该模板适用于提出为 p5.js 加入新功能的建议。例如，创建一个新的`createTable`函数，用于绘制原生的 HTML `<table>` 页面元素。有些提议可能与现有的功能增强建议趋同，在这种情况下，就在两种模版中选择你认为更合适的。

同样，本模板的表单字段与“增强现有功能”部分的字段也几乎一致。有关如何填写每个字段的详情，请参考[上一节](#existing-feature-enchancement)。

新功能的开发请求只有在至少两名[领域管理员或维护者](https://github.com/processing/p5.js#stewards)核准的情况下才会被批准。在此之后，拉取请求的工作才会开始。

**如果与拉取请求相对应的问题不存在或问题尚未获批，则不应提交拉取请求（或开始更改代码）**，因为提案是不一定会被接受的。提案未被接受时提交的拉取请求在问题获批前都会被关闭。

### ["发起讨论"](https://github.com/processing/p5.js/issues/new?assignees=%5C&labels=Discussion%5C&projects=%5C&template=discussion.yml)

该模板适用于你要提交的问题不适用上述所有其他模版的情况。在现实中，这种情况应该比较少见。如，关于是否在 p5.js 中采用特定的 Web API 功能应该作为一个[新功能开发请求](#new-feature-request)来提交；而在各种颜色函数中添加额外的颜色模式则应作为[增强现有功能](#existing-feature-enchancement)来提交；若要发布一则你组织的本地创意编程活动的公告，应该去论坛上发帖，并通过 Processing Foundation 寻求支持或宣传。

在发启讨论问题时，您可以使用侧面板上的 "Labels"（标签）选项来添加更多相关标签，以便将您的问题引导到相关领域。此模板本身仅包含一个基本的文本字段。通过[这个链接](https://github.com/processing/p5.js/issues/6517)可以查看讨论问题的范例。

[**⬆ 回到页首**](#contributor-guidelines)

---

# 修改 p5.js 代码库

## 基础知识

要继续进行，您至少应该对使用命令行、git、node.js（至少 v18 及以上版本）有初步了解，并且已经建立了本地开发环境。

## 引言

当问题已讨论过，解决方案已经批准，并且您愿意进行代码更改，就可以着手修改代码库了。

同样的，如果您遇到了一个问题、参与讨论了一个问题且管理员已经批准了解决方案，然而问题的原作者和其他社区成员却没有表态乐意处理该问题，您就可以自愿提交一份贡献申请，让管理员将该问题分配给您。

**您不应该“插队”**提交拉取请求，以期插手一个他人已经有意提交贡献或已经分配给他人的问题。我们永远会根据"先来先得"的原则接受一个问题的代码贡献申请。

如果您为一个问题提交了拉取请求，但同时还有其他人在处理同一个问题，您的拉取请求将会被关闭。如果您发现某个已分配给某人的问题已经几个月都没有动静，您可以就该问题礼貌地询问进展如何以及是否需要帮助。我们通常为大家编写贡献留出相当长的时间，因为我们理解大多数人是志愿工作，或者对一些人来说编写功能确实需要很长时间。

同样地，您应该按照自己的节奏工作，并相信我们不会为处理某个问题设定严格的时间限制。话虽如此，如果您在代码贡献的任何方面遇到困难，别犹豫，马上在问题内求助。管理员、维护人员以及其他社区成员都会尽力为您提供指导！

## 开发者快速入门指南

如果您想作为开发者参与 p5.js 代码库的开发工作或提交贡献，无论是直接改进 p5.js 还是改进其诸如 [Friendly Error Systems](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md) 之类的子项目，都可按以下步骤操作：

1. [创建一个 p5.js 的 fork。](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
2. [将您创建的 fork 克隆到您的电脑。](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
3. [使用以下命令添加 upstream ：](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork)

   git remote add upstream https://github.com/processing/p5.js

4. 确认您的电脑上已经安装了 [NodeJs](https://nodejs.org/en/download)。可以通过以下命令来确认：

   node -v

5. 使用以下命令安装依赖项:

   npm ci

6. 使用以下命令从 `main` 分支创建一个具有描述性分支名称的 git 分支：

   git checkout -b [branch_name]

7. 当您开始对代码库进行更改时，应频繁进行测试（尽管测试耗时，但能确保现有行为未被改坏）。

   npm test

8. 如果您正在添加新功能或在增强现有功能，需添加单元测试。
9. 完成后，您可以提交更改并创建[拉取请求](https://p5js.org/contributor-docs/#/./contributor_guidelines?id=pull-requests)。

## 使用 Github 的编辑功能

在 Github 网页界面上浏览文件时，文件内容顶部附近有一个铅笔图标按钮。该按钮的作用是启动 Github 自带的便捷编辑功能，可用于简化以下我们将会介绍的诸多流程。您可以使用它来快捷地编辑当前浏览的文件。

![Cropped screenshot of a file view in GitHub of the p5.js repository, "src/color/color_conversion.js" file. A red arrow pointing to a pencil icon button on the right side of the image.](images/edit-file.png)

但是，除非要进行的更改非常简单，否则不建议使用该功能。主要是因为，如要对源代码进行较复杂的更改，则应该先在本地进行构建和测试，然后再提交拉取请求。对于大多数人来说，使用本地开发环境通常比该编辑功能提供的基本编辑环境更为流畅。

## Fork p5.js 并在您的 Fork 中工作

第一步是 Fork p5.js 存储库。在开源中，Fork 具有特定的含义，但对于我们的目的，它意味着创建存储库的副本并将其存储在您自己的 Github 帐户中。要 Fork 一个存储库，只需点击页面顶部附近的"Fork"按钮，Github 将在您的帐户中创建存储库的副本。

![Screenshot of the main page of repository. A button, labeled with a fork icon and "Fork 59.3k," is outlined in dark orange.](fork.png)

从你的 p5.js 存储库 Fork 进行工作是必要的，因为你可能没有直接写入官方 p5.js 存储库的权限，而在 Fork 上工作可以让你进行更改，然后将其提交回官方存储库。

### 使用 GitHub 桌面版

此时，你应该对使用命令行、git、node.js 进行工作，并已经设置好本地开发环境有一定的了解。

### 使用 `git` 命令行界面

Fork 创建后，转到你的 Fork 页面，并通过点击绿色的"Code"按钮复制 git URL。它应该类似于 `https://github.com/limzykenneth/p5.js.git`。

接下来，在本地环境的命令行中进入这个 git 存储库。"克隆"的意思是将存储库的副本下载到本地机器上。在你想要存储 p5.js 源代码文件夹的文件夹中运行以下命令：

    git clone [git_url]

将 `[git_url]` 替换为刚刚复制的 URL。这可能需要几分钟，具体取决于你的网络连接速度，这是一个冲杯咖啡的好时机！一旦过程完成，你可以在你喜欢的文本编辑器中打开下载的名为 `p5.js` 的文件夹，并开始浏览。

## 代码库拆分

在 p5.js 文件夹中，您将会遇到一些关键的文件和文件夹，具体如下：

- `src` - 这是最终生成 p5.js 和 p5.min.js 文件的所有代码所在的位置
- [`test`](../unit_testing.md) - 这是单元测试和测试所有文档示例的代码所在的位置
- `tasks` - 这是详细和自定义构建代码所在的位置
- `Gruntfile.js` - 这是主要的构建配置文件
- `contributor_docs` - 这是文档和其他贡献者文档所在的位置

其他的文件和文件夹要么是配置文件，要么是其他类型的支持文件，在大多数情况下，您不需要对它们进行任何修改。

## 构建设置

在开始之前，您需要设置本地项目文件夹，以便能够构建和运行 p5.js 的测试。假设您已经安装了 Node.js（带有 `npm`），

    npm ci

这可能需要一些时间，因为 npm 会下载所有所需的依赖项，但一旦完成，那就是全部设置好了，非常简单，对吧？

## Git 工作流程

现在，您准备进行所需的更改。有关存储库的不同部分以及如何进行相关更改的详细信息，请参阅下面的子章节。首先，运行 `npm test` 以尝试从头构建 p5.js 并运行所有单元测试，这应该会顺利完成，没有错误。

接下来，建议您在开始工作之前从 `main` 分支创建一个分支。在 `main` 分支上运行 `git checkout -b [branch_name]`，将 `[branch_name]` 替换为具有描述性的内容，然后您将处于一个单独的分支中。在 git 中，分支就像其名称所示，是存储库的分支版本，您可以在其中添加提交，而不会影响 `main` 或其他分支。使用分支可以同时处理多个功能（通过使用多个隔离的分支），并确信如果您弄乱了一个分支，它不会影响 `main` 分支。

在进行更改时，建议经常运行 `npm test`，特别是如果您正在处理源代码。运行这个命令需要一些时间，但它可以确保您所做的更改不会破坏现有行为。在继续提交下面描述的更改之前，应该先运行 `npm test`。

一旦您对代码库进行了更改，就需要将其提交到 git。提交是保存在 git 存储库中的一组更改，它本质上记录了提交时存储库中文件的当前状态。可能会有一个问题是，您应该多久提交一次到 git？一般而言，建议您尽量经常提交，而不是将多个大的更改合并为一个提交。一个好的指导原则是，每当完成一个可以用一句话描述的子任务时就提交一次。

要提交所有当前更改，请按照以下步骤进行操作：

1. 运行 `git status` 并检查它只列出您已更改的文件。如果列出了您未更改的文件，您需要将它们恢复到原始状态，或确保它们是有意的更改。运行 `git diff` 还可以显示每个文件的更详细的更改。您不应该提交任何您不打算更改的文件。
2. 运行 `git add .` 将所有更改添加到 git 的暂存区。
3. 运行 `git commit -m [your_commit_message]` 将更改提交到 git。`[your_commit_message]` 应替换为描述更改的相关提交信息，避免使用泛泛的陈述。例如，不要说 `Documentation fix 1`，而是说 `为 circle() 函数添加文档示例`。

在进行所有提交时重复上述步骤，同时确保定期运行 `npm test` 来确保一切正常工作。

### 源代码

如果您打算处理源代码，一个好的起点是访问文档。在 p5.js 文档中，每个记录功能的底部都有一个指向其源代码的链接。

### 单元测试

如果您打算处理单元测试，请参阅[这里](./unit_testing.md)。请注意，对于任何功能增强、新功能和某些错误修复，Pull Request（PR）中应包含覆盖新实现的单元测试。

### 内联文档

如果您打算处理内联文档，请参阅[这里](./inline_documentation.md)。

### 国际化

如果您打算处理 p5.js 的国际化，请参阅[这里](./internationalization.md)。请注意，这不涉及网站的国际化/翻译，请参阅[网站存储库](https://github.com/processing/p5.js-website)。

### 可访问性

如果您打算处理可访问性功能，请参阅[这里](./web_accessibility.md)。对于友好的错误系统，请参阅[这里](./friendly_error_system.md)。

## 代码规范

p5.js 的代码规范由 eslint 执行。在接受之前，任何 git 提交和 Pull Request 都必须通过代码检查。遵循正确的编码规范的最简单方法是在您的文本编辑器中使用可用的 eslint 插件，并进行代码检查错误的突出显示（大多数常见的文本编辑器都提供此功能）。

## 设计原则

在处理 p5.js 的任何功能时，牢记 p5.js 的[设计原则](../design_principles.md)是非常重要的。我们的优先级可能与其他项目的优先级不同，所以如果您来自其他项目，建议您熟悉 p5.js 的设计原则。

---

# 拉取请求

现在您已经完成了所需的更改，`npm test`没有出现错误，并且您已经提交了更改，您可以开始准备一个拉取请求，将您的新提交合并到官方 p5.js 存储库中。拉取请求更正式地是一个请求，要求将另一个存储库（在本例中为您的派生 p5.js 存储库）中的更改拉取或合并到目标存储库（在本例中为官方 p5.js 存储库）的提交历史中。

## 创建拉取请求

首先，将您的新提交推送到 p5.js 的派生版本中，将其视为将更改上传到您的派生版本。

    git push -u origin [分支名称]

推送完成后，您可能会在终端中看到一个链接，可以用来打开拉取请求，如果没有，您可以在 Web 浏览器中导航到您的派生版本，使用文件列表上方的下拉按钮切换到您正在使用的分支，然后点击"Contribute"，然后选择"Open pull request"。

### 拉取请求信息

在提交拉取请求之前，您需要填写拉取请求模板。首先，拉取请求标题应简要描述更改的内容，避免使用泛泛的陈述。

接下来，在模板中有这样一行`解决 #[在这里添加问题编号]`，您应将`[在这里添加问题编号]`替换为您正在解决/修复的问题的问题编号[上面](#%E5%85%B3%E4%BA%8EIssue%E7%9A%84%E4%B8%80%E5%88%87)（例如`解决 #1234`）。这将确保在合并此拉取请求后自动关闭该问题。如果您不希望在合并此拉取请求后自动关闭问题（可能因为有更多的更改在单独的拉取请求中），将`解决`改为`处理`。

对于“更改”，您应提供对您在此拉取请求中进行的更改的清晰描述。在这里包括任何与审查此拉取请求的人相关的实现细节和决策。

“更改的屏幕截图”根据情况是可选的，当进行与 p5.js 在画布上呈现可视化内容相关的更改时，应包括此项。请注意，这不是文本编辑器的屏幕截图，而是您在更改后的示例草图的行为的屏幕截图。

“拉取请求清单”包含一些相关的清单项目，您应该用 `[x]` 替换 `[ ]`，以适用于您的更改。

完成后，点击“创建拉取请求”。

### 变基和解决冲突

现在你应该检查已打开的拉取请求，并注意以下几点：

1. 提交的数量应该与你在这个拉取请求上所做的提交次数相匹配，也就是说，如果你在这个拉取请求上提交了两次，"Commits"选项卡中应该只显示两个提交。
2. "Files changed"选项卡应该显示你与 p5.js 仓库的差异，不多不少。
3. 在底部附近，应该显示"This branch has no conflicts with the base branch"而不是"This branch has conflicts that must be resolved"。

如果以上任何一项不正确（提交数量多于预期或存在冲突），你可能需要进行变基或帮助解决冲突。这里的冲突指的是你对文件进行了更改，而这些文件最近也进行了更改，Git 不确定要保留哪组更改或排除哪组更改。如果你不确定如何解决这些问题，请告知管理员，我们将指导你完成这个过程。基本指令如下所示：

1.  运行 `git remote add upstream https://github.com/processing/p5.js`
2.  运行 `git fetch upstream`
3.  运行 `git rebase upstream/main`
4.  你可能会遇到一些冲突！如果只涉及到 `lib/p5.js` 和 `lib/p5.min.js`，很容易解决，只需重新构建项目。如果其他文件存在冲突，且你不确定如何解决...寻求帮助！

        npm test
        git add -u
        git rebase --continue

5.  运行 `git push`

上述步骤完成后，上面的检查列表可能会清除，如果没有清除，我们将指导你完成任何必要的修复。

## 讨论和修改

现在你的拉取请求已经打开，一个管理员或维护者将会审核你的拉取请求。可能需要几天时间管理员才能回复你的拉取请求，请耐心等待，在此期间你可以看看其他开放的问题！

当管理员审核你的拉取请求后，可能会有两种情况：1. 你的拉取请求被批准并合并，太棒了！2. 管理员可能会就拉取请求提出一些问题或要求做出一些修改。如果是后者，不要惊慌，这是完全正常的，管理员们总是在这里帮助你完成你的贡献！

如果有人要求对您的 PR 进行更改，并且您能够进行这些更改，请按照之前的[相同流程](#git-workflow)继续操作，但是从您本地的存储库和相关分支继续进行。进行所需的更改，将它们提交到 Git 中，并将它们推送到您派生的远程存储库。一旦您将额外的提交推送到派生的远程存储库，您将看到新的提交自动显示在 PR 中。在 PR 中留下评论，让评审人员知道您已经进行了所要求的更改，如果不需要进行其他更改，您的 PR 将被合并！

---
