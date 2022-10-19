# 🌸 Welcome! 🌺

Thanks for your interest in contributing to p5.js! Our community values contributions of all forms and seeks to expand the meaning of the word "contributor" as far and wide as possible. It includes documentation, teaching, writing code, making art, writing, design, activism, organizing, curating, or anything else you might imagine. [Our community page](https://p5js.org/community/#contribute) gives an overview of some different ways to get involved and contribute.

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. We use the @all-contributors bot to handle adding people to the README.md file. You can ask @all-contributors bot to add you in an issue or PR comment like so:
```
@all-contributors please add @[your github handle] for [your contribution type]
```
You can find relevant contribution type [here](https://allcontributors.org/docs/en/emoji-key). Although we will usually automatically add you to the contributor list using the bot after merging your PR. The contributor docs are published on p5.js [website](https://p5js.org/contributor-docs/#/), and hosted on p5.js [GitHub repository](https://github.com/processing/p5.js/tree/main/contributor_docs).

# Before Contributing
Contributing to p5.js should be a stress free experience and we welcome contributions of all levels, whether you are just fixing a small typo in the documentation or refactoring complex 3D rendering functionalities. However there are just a few things you should be familiar with before starting your contribution.

First, please have a read through our [community statement](https://p5js.org/community/).

Next, we are currently prioritizing work that expands access (inclusion and accessibility) to p5.js! See [our access statement](./access.md) for more details.

# Get Started
Now you are ready to start contributing to p5.js! There are many ways to get started with contributing to p5.js and many reasons to do so. For the purpose of this documentation, we will split contributions roughly into two categories.
- Contributions that directly deals with the source code (including documentation)
- Contributions that directly deals with the source code very little or not at all

Depending on what kind of contribution you are making to p5.js, please read on to the relevant section of this documentation.

## Source code contribution
For a typical contribution to the p5.js or p5.js-website repository, we will follow the following steps:
1. Open an issue
2. Discuss
3. Approved for opening a Pull Request (PR)
4. Make necessary changes
5. Open a PR
6. Discuss
7. Approved and merged

Head over to [this link](./contributor_guidelines.md) where you will be guided one step at a time on how to navigate the steps above, or you can also use the table of contents on the same page to skip to a relevant part you need a refresher on.

Most of the time we will stick with this workflow quite strictly and, especially if you have contributed to other projects before, it may feel like there are too many hoops to jump through for what may be a simple contribution. However, the steps above are aimed to make it easy for you as a contributor and for stewards/maintainers to contribute meaningfully, while also making sure that you won't be spending time working on things that may not be accepted for various reasons. The steps above will help ensure that any proposals or fixes are adequately discussed and considered before any work begin, and often this will actually save you (and the steward/maintainer) time because the PR that would need additional fixing after review, or outright not accepted, would happen less often as a result.

We see contributing to p5.js as a learning opportunity and we don't measure sucess by only looking at the volume of contributions we received. There is no time limit on how long it takes you to complete a contribution, so take your time and work at your own pace. Ask for help from any of the stewards or maintainers if you need them and we'll try our best to support you.

## Non-source code contribution
There are many more ways to contribute to p5.js through non-source code contribution than can be exhaustively list here, some of the ways may also involve working with some of the p5.js repositories (such as adding example, writing tutorial for the website, etc). Depending on what the planned contribution is, we may be able to support you in different ways so do reach out to us via any channel available to you (email, social media, Discourse forum, Discord, etc).

## Stewards and maintainers
For information related to area stewards or general maintenance of p5.js GitHub repository, please check out the [steward guidelines](./steward_guidelines.md).

---

# Where our code lives

The overarching p5.js project includes some repositories other than this one:

- **[p5.js](https://github.com/processing/p5.js)**: This repository contains the source code for the p5.js library. The [user-facing p5.js reference manual](https://p5js.org/reference/) is also generated from the [JSDoc](https://jsdoc.app/) comments included in this source code. It is maintained by [Qianqian Ye](https://github.com/qianqianye) and a group of [stewards](https://github.com/processing/p5.js#stewards).
- **[p5.js-website](https://github.com/processing/p5.js-website)**: This repository contains most of the code for the [p5.js website](http://p5js.org), with the exception of the reference manual. It is maintained by [Qianqian Ye](https://github.com/qianqianye), [Kenneth Lim](https://github.com/limzykenneth), and a group of [stewards](https://github.com/processing/p5.js-website#stewards).
- **[p5.js-sound](https://github.com/processing/p5.js-sound)**: This repository contains the p5.sound.js library. It is maintained by [Jason Sigal](https://github.com/therewasaguy).
- **[p5.js-web-editor](https://github.com/processing/p5.js-web-editor)**: This repository contains the source code for the [p5.js web editor](https://editor.p5js.org). It is maintained by [Cassie Tarakajian](https://github.com/catarak).
- Other add-on libraries not listed above usually have their own repository and maintainers and are not maintained by the p5.js project directly.


# Repository File Structure

There are a lot of files here! Here's a brief overview. It can be confusing, but you don't need to understand every file in the repository to get started. We recommend beginning in one area (for example, fixing some inline documentation), and working your way outwards to exploring more. Luisa Pereira's [Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) also gives a video tour of the tools and files used in the p5.js workflow.

- 📁`contributor_docs/` contains  documents that explain practices and principles for contributors
- 📁`docs/` does not actually contain docs! Rather, it contains the code used to *generate* the [online reference manual](https://p5js.org/reference/).
- 📁`lib/` contains an empty example and the p5.sound add-on, which is periodically updated via pull request from the [p5.js-sound repository](https://github.com/processing/p5.js-sound). This is also where the built p5.js library gets placed after being compiled to a single file using [Grunt](https://gruntjs.com/). It does not need to be checked into the github repository when you make a pull request.
- 📁`src/` contains all the source code for the library, which is topically organized into separated modules. This is what you'll work on if you are changing p5.js. Most folders have their own readme.md files inside to help you find your way around.
- 📁`tasks/` contains scripts which perform automated tasks related to the build, deployment, and release of new versions of p5.js.
- 📁`tests/` contains unit tests which ensure the library continues to function correctly as changes are made.
- 📁`utils/` might contain additional files useful for the repository, but generally you can ignore this directory.


# Miscellaneous
- There are other files in the 📁[`contributor_docs/`](https://github.com/processing/p5.js/tree/main/contributor_docs) folder that you might explore. They pertain to contributing to specific areas of this project, both technical and non-technical.
- [Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) is a video tour of the tools and files used in the p5.js development workflow.
-  [This video from The Coding Train](https://youtu.be/Rr3vLyP1Ods) :train::rainbow: gives an overview of getting started with technical contribution to p5.js.
- The p5.js [Docker image](https://github.com/toolness/p5.js-docker) can be mounted in [Docker](https://www.docker.com/) and used to develop p5.js without requiring manual installation of requirements like [Node](https://nodejs.org/) or otherwise affecting the host operating system in any way, aside from the installation of Docker.
- The build process for the p5.js library generates a [JSON data file](https://p5js.org/reference/data.json) which contains the public API of p5.js and can be used in automated tooling, such as for autocompleting p5.js methods in an editor. This file is hosted on the p5.js website, but it is not included as part of the repository.
