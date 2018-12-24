Hello! Thanks for your interest in contributing to p5.js! You can get started with some different ways of contributing [here](https://p5js.org/community/#contribute). This folder contains various documents intended for developers of p5.js.

# Project Directory Structure

- `src/` contains all the source code for the library, which is topically organized into separated modules. This is what you'll work on if you are changing p5.js.
- `lib/` contains the final version of p5.js intended for users to load in their sketches and projects, included in both compressed and uncompressed forms. This is the output when the source code modules are compiled to a single file by [Grunt](https://gruntjs.com/).
- `developer_docs/` contains various Markdown documents that are likely to be useful to developers of p5.js, in particular because they explain practices and principles.
- `docs/` does not actually contain docs! Rather, it contains the code used to *generate* the [online reference manual](https://p5js.org/reference/). 
- `tests/` contains unit tests which ensure the library continues to function correctly as changes are made.
- `tasks/` contains scripts which perform automated tasks related to the build, deployment, and release of new versions of p5.js.
- `patches/` might contain [Git patches](https://git-scm.com/docs/git-format-patch) from time to time, but in almost all cases you can completely ignore this directory.

# How To Contribute

Known bugs and intended new features are tracked using [GitHub issues](https://github.com/processing/p5.js/issues). Issue [labels](https://github.com/processing/p5.js/blob/master/developer_docs/issue_labels.md) are used to sort issues into categories, such as those which are [suitable for beginners](https://github.com/processing/p5.js/labels/level%3Abeginner). If you'd like to start working on an existing issue, comment on the issue that you plan to work on it so other contributors know it's being handled and can offer help. Once you have completed your work on this issue, [submit a pull request (PR)](https://github.com/processing/p5.js/blob/master/developer_docs/preparing_a_pull_request.md) against the p5.js master branch. In the description field of the PR, include "resolves #XXXX" tagging the issue you are fixing. If the PR addresses the issue but doesn't completely resolve it (ie the issue should remain open after your PR is merged), write "addresses #XXXX".

If you discover a bug or have an idea for a new feature you'd like to add, begin by submitting an issue. Please do not simply submit a pull request containing the fix or new feature without making an issue first, we will probably not be able to accept it. Once you have gotten some feedback on the issue and a go ahead to address it, you can follow the process above to contribute the fix or feature.

We recognize all types of contributions. This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Add yourself to the [readme](https://github.com/processing/p5.js/blob/master/README.md#contributors) by following the [instructions here](https://github.com/processing/p5.js/issues/2309)!

## Accompaniments

Aside from the code itself, you may also need to supply some combination of the following.

- [inline documentation](https://github.com/processing/p5.js/blob/master/developer_docs/inline_documentation.md) in the form of code comments, which explain the code both to other developers and to users. Many of these comments must conform to [JSDoc](https://usejsdoc.org) syntax and will be published on the p5.js website as part of the [online reference manual](https://p5js.org/reference/) 
- [unit tests](https://github.com/processing/p5.js/blob/master/developer_docs/#testing), small pieces of code which are separate from the library and are used to verify its behavior
- [benchmarks](https://github.com/processing/p5.js/blob/master/developer_docs/benchmarking_p5.md) to test performance

## Examples

The p5.js site includes [integrated examples](http://p5js.org/examples/). You can [add more](https://github.com/processing/p5.js-website/wiki/Adding-examples), and there is an issue which lists some [desired examples](https://github.com/processing/p5.js/issues/1954).

## Other Ideas

If you'd like to contribute in other ways which are not covered here, feel free to write to [hello@p5js.org](mailto:hello@p5js.org) and let us know what you're thinking! Aside from working on this codebase, we can always use help with things like documentation, tutorials, workshops, educational materials, branding, and design. Get in touch and we can talk about ways you might participate.

# Gotchas

The developer tooling included with the p5.js codebase is intentionally very strict about some things. This is a good thing! It makes everything consistent, and it will encourage you to be disciplined. This means you may try to change something only to have your commit rejected by the project, but don't get discouraged; even seasoned p5.js developers get caught by this stuff all the time. Typically the problem will be in one of two areas.

## Code Syntax

p5.js requires clean and stylistically consistent code syntax, which it enforces with [Prettier](https://prettier.io/) and [ESlint](https://eslint.org/). The rules are checked before you commit, but you can also install an [ESlint plugin](https://eslint.org/docs/user-guide/integrations#editors) for your code editor to highlight errors as soon as you type them, which will probably help you along as you are coding and saves you the hassle of a failed Git commit.

To detect errors, run the following command in your terminal (do not type the `$` prompt):

```
$ npm run lint
```

Some syntax errors can be automatically fixed:

```
$ npm run lint:fix
```

Sticking with the established project style is usually preferable, but [occasionally](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=) using an alternate syntax might make your code easier to understand. For these cases, Prettier [offers an escape hatch](https://prettier.io/docs/en/ignore.html), the `// prettier-ignore` comment, which you can use to make granular exceptions. Try to avoid using this if you can, because there are good reasons for most of the style preferences enforced by the linting.

## Unit Tests

Unit tests are small pieces of code which are created as complements to the primary logic and perform validation. If you are developing a major new feature for p5.js, you should probably include tests. Do not submit pull requests in which the tests do not pass, because that means something is broken.

In order to run unit tests, you'll need to have previously installed the project's dependencies.

```
$ npm install
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

# Development Process

1. Install [node.js](http://nodejs.org/), which also automatically installs the [npm](https://www.npmjs.org) package manager.
2. [Fork](https://help.github.com/articles/fork-a-repo) the [p5.js repository](https://github.com/processing/p5.js) into your own GitHub account.
3. [Clone](https://help.github.com/articles/cloning-a-repository/) your new fork of the repository from GitHub onto your local computer. 

   ```
   $ git clone https://github.com/YOUR_USERNAME/p5.js.git
   ```

4. Navigate into the project folder and install all its necessary dependencies with npm.
   
   ```
   $ cd p5.js
   $ npm install
   ```

5. [Grunt](https://gruntjs.com/) should now be installed, and you can use it to build the library from the source code. 

   ```
   $ npm run grunt
   ```
   
   If you're continuously changing files in the library, you may want to run `npm run dev` to automatically rebuild the library for you whenever any of its source files change without you having to first type the command manually.

6. Make some changes to the codebase and [commit](https://help.github.com/articles/github-glossary/#commit) them with Git.

7. Run `npm run grunt` again to make sure there are no syntax errors, test failures, or other problems.

8. [Push](https://help.github.com/articles/github-glossary/#push) your new changes to your fork on GitHub.

   ```
   $ git push
   ```

9. Once everything is ready, submit your changes as a [pull request](https://help.github.com/articles/creating-a-pull-request).

# Building Documentation

Inline comments in p5.js are built into the public-facing [reference manual](https://p5js.org/reference/). You can also view this locally:

```
$ npm run docs:dev
```
# Repositories

The overarching p5.js project includes repositories other than this one.

- [p5.js](https://github.com/processing/p5.js): This repository contains the source code for the p5.js library, as well as the p5.dom.js addon library. The [user-facing p5.js reference manual](https://p5js.org/reference/) is also generated from the [JSDoc](http://usejsdoc.org/) comments included in this source code. It is maintained by [Lauren McCarthy](https://github.com/lmccart).
- [website](https://github.com/processing/p5.js-website) This repository contains most of the code for the [p5.js website](http://p5js.org), with the exception of the reference manual. It is maintained by [Lauren McCarthy](https://github.com/lmccart). 
- [sound](https://github.com/processing/p5.js-sound) This repository contains the p5.sound.js library. It is maintained by [Jason Sigal](https://github.com/therewasaguy).
- [web editor](https://github.com/processing/p5.js-web-editor): This repository contains the source code for the [p5.js web editor](https://editor.p5js.org). It is maintained by [Cassie Tarakajian](https://github.com/catarak). Note that the older [p5.js editor](https://github.com/processing/p5.js-editor) is now deprecated.

# Miscellaneous

- [Looking Inside p5.js](http://www.luisapereira.net/teaching/looking-inside-p5/) is a video tour of the tools and files used in the p5.js development workflow.
- The p5.js [Docker image](https://github.com/toolness/p5.js-docker) can be mounted in [Docker](https://www.docker.com/) and used to develop p5.js without requiring manual installation of requirements like [Node](https://nodejs.org/) or otherwise affecting the host operating system in any way, aside from the installation of Docker.
- The build process for the p5.js library generates a [json data file](https://p5js.org/reference/data.json) which contains the public API of p5.js and can be used in automated tooling, such as for autocompleting p5.js methods in an editor. This file is hosted on the p5.js website, but it is not included as part of the repository.
