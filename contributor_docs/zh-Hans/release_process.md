# 发布流程

## 方法
* 我们遵循 [semver](https://semver.org/) 的版本控制模式，即遵循以下版本控制模式：`主版本号:次版本号:修订号`。

## 要求
* 在您的系统上安装了 Git、node.js 和 NPM
* 您能够构建库并具有对远程仓库的推送权限
* 在远程仓库上设置了 `NPM_TOKEN` 密钥
* 在远程仓库上设置了 `ACCESS_TOKEN` 密钥

## 使用方法
```sh
$ git checkout main
$ npm version [major|minor|patch] # 选择适当的版本标签
$ git push origin main
$ git push origin v1.4.2 # 用刚刚创建的版本号替换此处的版本号
```
实际的发布步骤全部在 Github Actions CI 上运行。操作完成后，您可能希望在 Github 上查看发布，并根据需要修改发布说明（例如，将所有-contributor bot 的提交与其他提交分开）。

## 安全令牌
为了完全运行发布步骤，必须设置两个[仓库密钥](https://docs.github.com/cn/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)如下。

* `NPM_TOKEN` 可以按照[此处](https://docs.npmjs.com/creating-and-viewing-access-tokens)的步骤创建，以创建一个读取和发布令牌。令牌所属的用户必须具有对 NPM 项目的发布访问权限。
* `ACCESS_TOKEN` 是一个个人访问令牌，用于访问 `p5.js`、`p5.js-website` 和 `p5.js-release` 仓库。可以按照[此处](https://docs.github.com/cn/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)的步骤生成令牌，对于范围选择只选择 `public_repo`。建议使用组织特定的帐户进行操作（即非个人帐户），并仅将该帐户的写入访问权限限制在所需的仓库上。

## 实际发生的情况
Github Actions CI 上的["New p5.js release"](../.github/workflows/release.yml)操作是在匹配 `v*.*.*` 格式的标签上触发的，该标签是通过 `npm version ___` 命令创建的。

一旦触发，它将执行以下步骤：

1. 克隆仓库，设置 node.js，提取版本号，使用 `npm` 安装依赖项，并使用 `npm test` 运行测试。
2. 创建将上传到 Github 发布中的发布文件。
3. 在 Github 上创建发布并发布最新版本到 NPM。
4. 更新网站文件
   1. 克隆网站仓库
   2. 将 `data.json` 和 `data.min.json` 复制到正确的位置
   3. 将 `p5.min.js` 和 `p5.sound.min.js` 复制到正确的位置
   4. 根据最新版本号更新 `data.yml` 文件
   5. 根据 `data.min.json` 更新 `en.json` 文件
   6. 提交并推送更改到网站仓库
5. 更新 Bower 文件
   1. 克隆 Bower 发布仓库
   2. 将所有库文件复制到正确的位置
   3. 提交并推送更改到网站仓库

原则上，我们尽可能将尽可能多的步骤集中在一个地方运行，即在 CI 环境中运行。如果需要在发布时仅运行的新步骤，则应在 CI 工作流程中定义，而不是作为构建配置的一部分。

## 测试
由于发布步骤在 CI 中运行，测试它们可能会有些困难。使用 [act](https://github.com/nektos/act) 可以在本地测试步骤的运行（在开发过程中就是这样测试的），但需要对工作流定义进行一些临时修改，我们将在此大致记录下来，因为确切的步骤可能随时间而改变。

由于没有安装所有系统要求来运行 mocha Chrome 测试，测试步骤将不会运行。在设置其他环境之前，可能需要使用 `apt` 安装一些系统依赖项。请注意错误消息，它们应该提供有关缺少哪些软件包的一些信息。

为避免意外推送不必要的更改，应将涉及将更改推送到远程仓库的步骤注释掉。