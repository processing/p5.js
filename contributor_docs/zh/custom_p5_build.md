# 使用选择的组件创建自定义构建的 p5.js

## 概述

p5.js 的一个出色的新 [功能](https://github.com/processing/p5.js/pull/2051) 允许用户将 p5.js 构建为自定义组合的模块。这在减小库的生产版本大小以及提高整体性能方面非常有帮助。

这个功能是作为 Google Summer of Code 2017 提案的一部分提出的。

## 使用方法

目前，通过从命令行手动调用 Grunt 任务来使用：

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:module_x:module_y
```

这里，`module_n` 是您想要选择的模块的名称。多个模块必须按照上述示例传递。此外，这些模块的名称必须与 `/src` 目录中它们的文件夹名称相同，以确保正确工作。默认情况下会包含 `core`，但是要使像 line() 和其他核心功能的形状工作，必须包含 `core/shape`。

上述使用示例生成的 `p5Custom.js` 文件大小可能会比完整的 `p5.min.js` 更大，因为输出没有使用 `uglify` 任务进行缩小。

尽量减小捆绑文件大小的推荐步骤如下：

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:min:module_x:module_y uglify
```

## 示例

- `npm run grunt combineModules:min:core/shape:color:math:image uglify`  
  在 `lib/modules` 目录中生成一个 `p5Custom.min.js` 捆绑文件，使用了 `combineModules` 和 `uglify` 任务。请注意，在 `combineModules:min` 之后应列出模块，并且在模块列表后应有一个空格。

- `npm run grunt combineModules:core/shape:color:math:image`  
  在 `lib/modules` 目录中生成一个非压缩的 `p5Custom.js` 捆绑文件。

- `npm run grunt combineModules:min:core/shape:color:math:image`  
  使用 `combineModules:min` 任务在 `lib/modules` 目录中生成一个 `p5Custom.pre-min.js` 文件。请注意，在此示例中，可以在运行 `combineModules:min` 任务后单独运行 `npm run grunt uglify`。
