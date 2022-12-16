

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
This section links to different topics related to the general maintenance of p5.js' repositories.
- Responding to issues and reviewing PRs
- How the library is built
- Releasing a new version

---

# Where our code lives

The overarching p5.js project includes some repositories other than this one:

- **[p5.js](https://github.com/processing/p5.js)**: This repository contains the source code for the p5.js library. The [user-facing p5.js reference manual](https://p5js.org/reference/) is also generated from the [JSDoc](https://jsdoc.app/) comments included in this source code. It is maintained by [Qianqian Ye](https://github.com/qianqianye) and a group of [stewards](https://github.com/processing/p5.js#stewards).
- **[p5.js-website](https://github.com/processing/p5.js-website)**: This repository contains most of the code for the [p5.js website](http://p5js.org), with the exception of the reference manual. It is maintained by [Qianqian Ye](https://github.com/qianqianye), [Kenneth Lim](https://github.com/limzykenneth), and a group of [stewards](https://github.com/processing/p5.js-website#stewards).
- **[p5.js-sound](https://github.com/processing/p5.js-sound)**: This repository contains the p5.sound.js library. It is maintained by [Jason Sigal](https://github.com/therewasaguy).
- **[p5.js-web-editor](https://github.com/processing/p5.js-web-editor)**: This repository contains the source code for the [p5.js web editor](https://editor.p5js.org). It is created by [Cassie Tarakajian](https://github.com/catarak) and currently maintained by [Rachel Lim](https://github.com/raclim).
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



# Documentation

We realize the documentation is the most important part of this project. Poor documentation is one of the main barriers to access for new users and contributors, making the project less inclusive. The 📄[`contributing_documentation.md`](./contributing_documentation.md) page gives an in-depth overview of getting started with documentation. The documentation for p5.js can be found in a few main places:

- The [p5js.org/reference](https://p5js.org/reference/) is generated from [inline documentation](./inline_documentation.md) in the source code itself. This includes the text descriptions and parameters as well as the accompanying code snippet examples. We place all this inline to keep the code and documentation closely linked, and to reinforce the idea that contributing to documentation is as important (if not more) than contributing to the code. When the library gets built, it checks the inline documentation and examples to ensure they match up with the way the code behaves. To contribute, you can start by looking at the 📄[`inline_documentation.md`](./inline_documentation.md) page.
- The [p5js.org/examples](http://p5js.org/examples) page contains longer examples that can be useful for learning p5.js. To contribute, you can start by looking at the 📄[`adding_examples.md`](https://github.com/processing/p5.js-website/blob/main/contributor_docs/Adding_examples.md) page.
- The [p5js.org/learn](https://p5js.org/learn) page contains tutorials to help you learn concepts of p5.js and programming. To contribute, you can start by looking at the [p5.js guide to contributing to tutorials](https://p5js.org/learn/tutorial-guide.html).
- You'll notice the p5.js website currently supports a few different languages. This is called internationalization (or i18n for short). You can read more about this documentation on the [i18n_contribution](https://github.com/processing/p5.js-website/blob/main/contributor_docs/i18n_contribution.md) page.



# GitHub Issue Flow

* Known bugs and intended new features are tracked using [GitHub issues](https://github.com/processing/p5.js/issues). Issue [labels](./issue_labels.md) are used to sort issues into categories, such as those which are [suitable for beginners](https://github.com/processing/p5.js/labels/level%3Abeginner).

* If you'd like to start working on an existing issue, comment on the issue that you plan to work on it so other contributors know it's being handled and can offer help.

* Once you have completed your work on this issue, [submit a pull request (“PR”)](./preparing_a_pull_request.md) against the p5.js main branch. In the description field of the PR, include "resolves #XXXX" tagging the issue you are fixing. If the PR addresses the issue but doesn't completely resolve it (ie the issue should remain open after your PR is merged), write "addresses #XXXX".

* If you discover a bug or have an idea for a new feature you'd like to add, begin by submitting an issue. Please do not simply submit a pull request containing the fix or new feature without making an issue first, we will probably not be able to accept it. Once you have gotten some feedback on the issue and a go ahead to address it, you can follow the process above to contribute the fix or feature.

* You can triage issues which may include reproducing bug reports or asking for vital information, such as version numbers or reproduction instructions. If you would like to start triaging issues, one easy way to get started is to [subscribe to p5.js on CodeTriage](https://www.codetriage.com/processing/p5.js). [![Open Source Helpers](https://www.codetriage.com/processing/p5.js/badges/users.svg)](https://www.codetriage.com/processing/p5.js)

* The 📄[`organization.md`](https://github.com/processing/p5.js/blob/main/contributor_docs/organization.md) file gives a high-level overview of how issues can be organized and the decision making processes around them. Please feel welcome to get involved with this if you are interested.

  

# Development Process

We know the development process can be a little tricky at first. You're not alone, it's confusing for everyone at the beginning. The steps below walk you through the setup process. If you have questions, you can ask on the [forum](https://discourse.processing.org/c/p5js) or post an [issue](https://github.com/processing/p5.js/issues) that describes the place you are stuck, and we'll do our best to help.

This process is also covered [in a video by The Coding Train.](https://youtu.be/Rr3vLyP1Ods) :train::rainbow:



1. Install [node.js](http://nodejs.org/), which also automatically installs the [npm](https://www.npmjs.org) package manager.

2. [Fork](https://help.github.com/articles/fork-a-repo) the [p5.js repository](https://github.com/processing/p5.js) into your own GitHub account.

3. [Clone](https://help.github.com/articles/cloning-a-repository/) your new fork of the repository from GitHub onto your local computer.

   ```shell
   $ git clone https://github.com/YOUR_USERNAME/p5.js.git
   ```

4. Navigate into the project folder and install all its necessary dependencies with npm.

   ```shell
   $ cd p5.js
   $ npm ci
   ```

5. [Grunt](https://gruntjs.com/) should now be installed, and you can use it to build the library from the source code.

   ```shell
   $ npm run grunt
   ```

   If you're continuously changing files in the library, you may want to run `npm run dev` to automatically rebuild the library for you whenever any of its source files change without you having to first type the command manually.

6. Make some changes locally to the codebase and [commit](https://help.github.com/articles/github-glossary/#commit) them with Git.

   ```shell
   $ git add -u
   $ git commit -m "YOUR COMMIT MESSAGE"
   ```

7. Run `npm run grunt` again to make sure there are no syntax errors, test failures, or other problems.

8. [Push](https://help.github.com/articles/github-glossary/#push) your new changes to your fork on GitHub.

   ```shell
   $ git push
   ```

9. Once everything is ready, submit your changes as a [pull request](https://help.github.com/articles/creating-a-pull-request).



# Gotchas

The developer tooling included with the p5.js codebase is intentionally very strict about some things. This is a good thing! It makes everything consistent, and it will encourage you to be disciplined. This means you may try to change something only to have your commit rejected by the project, but don't get discouraged; even seasoned p5.js developers get caught by this stuff all the time. Typically the problem will be in one of two areas, code syntax or unit tests.

## Code Syntax

p5.js requires clean and stylistically consistent code syntax, which it enforces using [ESlint](https://eslint.org/). Certain style rules are checked before you commit, but you can also install an [ESlint plugin](https://eslint.org/docs/user-guide/integrations#editors) for your code editor to highlight errors as soon as you type them. In general, we err on the side of flexibility when it comes to code style, in order to lower the barriers to participation and contribution.

To detect errors, run the following command in your terminal (do not type the `$` prompt):

```shell
$ npm run lint
```

Some syntax errors can be automatically fixed:

```shell
$ npm run lint:fix
```

Here is a quick summary of code style rules. Please note that this list may be incomplete, and it's best to refer to the 📄[`.eslintrc`](https://github.com/processing/p5.js/blob/main/.eslintrc) file for the full list.
* ES6 code syntax is used

* Use single quotes (rather than double quotes)

* Indentation is done with two spaces

* All variables defined in the code should be used at least once, or removed completely

* Do not compare `x == true` or `x == false`. Use `(x)` or `(!x)` instead. `x == true` is certainly different from `if (x)`! Compare objects to `null`, numbers to `0`, or strings to `""`, if there is chance for confusion.

* Comment your code whenever there is ambiguity or complexity in the function you are writing

* See the [Mozilla JS practices](https://firefox-source-docs.mozilla.org/code-quality/coding-style/index.html) as a useful guide for more styling tips

  

## Unit Tests

Unit tests are small pieces of code which are created as complements to the primary logic and perform validation. The 📄[`unit_testing.md`](./unit_testing.md) page gives more information about working with unit tests. If you are developing a major new feature for p5.js, you should probably include tests. Do not submit pull requests in which the tests do not pass, because that means something is broken.

In order to run unit tests, you'll need to make sure you have installed the project's dependencies.

```shell
$ npm ci
```

This will install *all* the dependencies for p5.js; briefly, the most important dependencies specific to unit testing include:

- [Mocha](https://mochajs.org/), a powerful testing framework that executes individual test files which are specific to p5.js
- [mocha-chrome](https://github.com/shellscape/mocha-chrome), a mocha plugin that runs mocha tests using headless Google Chrome

Once the dependencies are installed, use Grunt to run the unit tests.

```shell
$ grunt
```

Sometimes it is useful to run the tests in the browser instead of on the command line. To do this, first start the [connect](https://github.com/gruntjs/grunt-contrib-connect) server:

```shell
$ npm run dev
```

With the server running, you should be able to open `test/test.html` in a browser.

A complete guide to unit testing is beyond the scope of the p5.js documentation, but the short version is that any major changes or new features implemented in the source code contained in the 📁`src/` directory should also be accompanied by test files in the 📁`test/` directory that can be executed by Mocha to verify consistent behavior in all future versions of the library. When writing unit tests, use the [Chai.js reference](http://www.chaijs.com/api/assert/) as a guide for phrasing your assertion messages so that any errors caught by your tests in the future will be consistent and consequently easier for other developers to understand.



# Miscellaneous

- There are other files in the 📁[`contributor_docs/`](https://github.com/processing/p5.js/tree/main/contributor_docs) folder that you might explore. They pertain to contributing to specific areas of this project, both technical and non-technical.
- [Looking Inside p5.js](https://www.luisapereira.net/teaching/materials/processing-foundation) is a video tour of the tools and files used in the p5.js development workflow.
-  [This video from The Coding Train](https://youtu.be/Rr3vLyP1Ods) :train::rainbow: gives an overview of getting started with technical contribution to p5.js.
- The p5.js [Docker image](https://github.com/toolness/p5.js-docker) can be mounted in [Docker](https://www.docker.com/) and used to develop p5.js without requiring manual installation of requirements like [Node](https://nodejs.org/) or otherwise affecting the host operating system in any way, aside from the installation of Docker.
- The build process for the p5.js library generates a [JSON data file](https://p5js.org/reference/data.json) which contains the public API of p5.js and can be used in automated tooling, such as for autocompleting p5.js methods in an editor. This file is hosted on the p5.js website, but it is not included as part of the repository.
- p5.js has recently migrated to [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015). To see how this transition could effect your contribution please visit [ES6 adoption](./es6-adoption.md).
