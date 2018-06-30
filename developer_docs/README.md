This folder contains various documents intended for developers of p5.js.

# Ways To Contribute

## Issues

Known bugs and intended new features are tracked using [GitHub issues](https://github.com/processing/p5.js/issues). If you'd like to contribute code but need suggestions about what to work on, start by looking at the existing issues. Issue [labels](https://github.com/processing/p5.js/blob/master/developer_docs/issue_labels.md) are used to sort issues into categories, such as those which are [suitable for beginners](https://github.com/processing/p5.js/labels/level%3Abeginner). If you start working on an existing issue, make sure to "assign" it to yourself so other contributors know it's being handled and can offer help. If you have discovered a bug or thought of a new feature but don't have code for it yet, you should consider submitting an issue.

## Accompaniments

Aside from the code itself, you may also need to supply some combination of the following.

- [inline documentation](https://github.com/processing/p5.js/blob/master/developer_docs/inline_documentation.md) in the form of code comments, which explain the code both to other developers and to users. Many of these comments must conform to [JSDoc](https://usejsdoc.org) syntax and will be published on the p5.js website as part of the [online reference manual](https://p5js.org/reference/) 
- [unit tests](https://github.com/processing/p5.js/blob/master/developer_docs/#testing), small pieces of code which are separate from the library and are used to verify its behavior
- [benchmarks](https://github.com/processing/p5.js/blob/master/developer_docs/benchmarking_p5.md) to test performance

## Examples

The p5.js reference manual includes [integrated examples](http://p5js.org/examples/). You can [add more](https://github.com/processing/p5.js-website/wiki/Adding-examples), and there is an issue which lists some [desired examples](https://github.com/processing/p5.js/issues/1954).

## Other Ideas

If you'd like to contribute in other ways which are not covered here, feel free to write to [hello@p5js.org](mailto:hello@p5js.org) and let us know what you're thinking! Aside from working on this codebase, we can always use help with things like documentation, tutorials, workshops, educational materials, branding, and design. Get in touch and we can talk about ways you might participate.

# Gotchas

The developer tooling included with the p5.js codebase is intentionally very strict about some things. This is a good thing! It makes everything consistent, and it will encourage you to be disciplined. This means you may try to change something only to have your commit rejected by the project, but don't get discouraged; even seasoned p5.js developers get caught by this stuff all the time. Typically the problem will be in one of two areas.

## Code Syntax

p5.js requires clean and stylistically consistent code syntax, which it enforces with [Prettier](https://prettier.io/) and [ESlint](https://eslint.org/). The rules are checked before you commit, but you can also install an [ESlint plugin](https://eslint.org/docs/user-guide/integrations#editors) for your code editor to highlight errors as soon as they appear. which will highlight problems immediately as you write your code.

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

To run the unit tests, use Grunt.

```
$ grunt
```

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
   
   If you're continuously changing files in the library, you may want to run `npm run grunt watch:quick` to automatically rebuild the library for you whenever any of its source files change without you having to first type the command manually.

6. Make some changes to the codebase and [commit](https://help.github.com/articles/github-glossary/#commit) them with Git.

7. Run `npm run grunt` again to make sure there are no syntax errors, test failures, or other problems.

8. [Push](https://help.github.com/articles/github-glossary/#push) your new changes to your fork on GitHub.

   ```
   $ git push
   ```

9. Once everything is ready, submit your changes as a [pull request](https://help.github.com/articles/creating-a-pull-request).

# Overview

This [looking inside p5.js video](http://www.luisapereira.net/teaching/looking-inside-p5/) describes the tools and files used in p5.js workflow.

`lib/` Contains the concatenated p5.js and p5.min.js libraries, generated by Grunt.

`src/` Contains all the source code for the library. The code is broken up into folders and files corresponding with the [Processing reference page](http://processing.org/reference/). Additionally, there is a core folder that holds constants, and internal helper functions and variables.

`tests/` Contains unit testing files.

# Testing

With all new functions implemented, please include unit tests and inline documentation. A good example for how to format and write inline documentation can be seen in [PImage](https://github.com/processing/p5.js/blob/master/src/image/image.js). Examples of unit tests can be found in the [test/unit](https://github.com/processing/p5.js/tree/master/test/unit) directory. Directions for adding your own tests and including them are below.

The testing is done with [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) which uses [mocha](http://visionmedia.github.io/mocha/) test framework with [phantomjs](http://phantomjs.org/download.html). 
To get started:

1. Install dependencies.

   ```
   cd p5.js/
   npm install
   ```

2. Add test files corresponding to files in `src` (more info about Chai assert style TDD phrasing [here](http://chaijs.com/api/assert/)). 
3. Link to the src and test files in `test.html`. 
4. Run the tests with `npm run grunt`.

## Building and testing the Reference Docs & Examples

This will build the p5.js library, generate the documentation files, run a web server, and open a browser to the main documentation page.

    ```
    npm run docs:dev
    ```

## Running tests in the browser
Sometimes it is useful to run tests in browser especially when trying to debug test failures.  To run the tests in the browser:

1. Run the connect server. ```npm run grunt connect -keepalive```
2. Open test/test.html in your favourite web browser.

# Repositories

* https://github.com/processing/p5.js - this repo contains the source code for the p5.js library, and the p5.dom.js addon library. The reference is also generated from this code, as the documentation and examples are located in the source code itself, maintained by Lauren McCarthy.
* https://github.com/processing/p5.js-website - contains the code for http://p5js.org website, maintained by Lauren McCarthy. 
* https://github.com/processing/p5.js-sound - contains the source code for the p5.sound.js library, maintained by Jason Sigal.
* https://github.com/processing/p5.js-web-editor - contains the source code for the p5 web editor, maintained by Cassie Tarakajian.
* https://github.com/processing/p5.js-editor - contains the source code for the p5 editor, which is now depricated.
* https://github.com/scottgarner/p5.js-video - contains the code for Hello p5.js!, maintained by Scott Garner.

# Alternative Setup - Docker

An alternative to setting up node, grunt, php, apache, and the p5.js & p5.js-website codebases is to use [toolness/p5.js-docker](https://github.com/toolness/p5.js-docker). While this does require the installation of a tool called Docker, it potentially makes viewing and editing the p5 website with the latest documentation and libraries a lot easier.

# p5.js API JSON file

[This file](https://p5js.org/reference/data.json) can be used for auto-complete. This [gist](https://gist.github.com/jonohayon/b059a029755f84f42b29f005323ec165) explains how to parse the file. Note that the data.json file is generated when the `npm run grunt` command is run, it is found on the p5js.org website but is not included in the repo.

