This folder contains various documents indended for developers of p5.js.

# Getting started

Interested in contributing? Awesome! First, figure out what you'd like to do (a good place to start is the [issues list](https://github.com/processing/p5.js/issues)).

* **Fix a bug** :

    If it's not on the issues list, add it. If it's already on this issues list, assign it to yourself or comment on the issue indicating you're working on it. Go ahead and fix it and submit a PR (see below for instructions for getting set up for development). We are also in the process of adding unit tests and more inline documentation, so if the function you are fixing doesn't have these, please consider adding these as well. [Submit the change to the master branch (see below).](https://github.com/processing/p5.js/blob/master/developer_docs/#master-branch-development) 
Need help finding an issue to fix? Check out this [list of bite size issues](https://github.com/processing/p5.js/labels/level%3Abeginner) suitable for new contributors (or peruse other [issue labels](https://github.com/processing/p5.js/blob/master/developer_docs/issue_labels.md) for topics that catch your interest).
* **Implement a new feature** : 

    If you have an original idea about a feature, open an issue describing your idea preferably in the format provided there, and let us know you're interested! Initiate a discussion, wait for the green signal, and then assign it to yourself! _Note: new features will require tests and inline documentation._
    - Inline documentation:
        - [Style guide for p5.js inline docs](https://github.com/processing/p5.js/blob/master/developer_docs/inline_documentation.md) -- by formatting your documentation correctly, it will automatically show up in the p5.js reference.
    - Unit tests:
        - See the [testing section](https://github.com/processing/p5.js/blob/master/developer_docs/#testing) for how to do this.
        - This helps ensure that the code you write keeps working far into the future when further updates and changes are made.
    - Benchmarks
        - See [Benchmarking section](https://github.com/processing/p5.js/blob/master/developer_docs/benchmarking_p5.md)
        - Helpful for finding and implementing performance optimizations

* **Add unit tests or documentation for existing code** : 

    Let us know which areas you're working on so we don't duplicate efforts! [Submit the change to the master branch.](https://github.com/processing/p5.js/blob/master/developer_docs/#master-branch-development)
    - See the [guide for p5.js inline docs](https://github.com/processing/p5.js/blob/master/developer_docs/inline_documentation.md) -- by formatting your documentation correctly, it will automatically show up in the p5.js reference (coming soon).
    - See the [testing section](https://github.com/processing/p5.js/blob/master/developer_docs/#testing) for how to add unit tests.

* **Add examples to the examples page** : 

    Add to the examples on the [p5js.org examples page](http://p5js.org/examples/). See this [guide](https://github.com/processing/p5.js-website/wiki/Adding-examples) for details.

* **Add inline examples to the ref** :

  * [List of examples needed](https://github.com/processing/p5.js/issues/1954)
  * [Guide for p5.js inline docs](https://github.com/processing/p5.js/blob/master/developer_docs/inline_documentation.md) 

* **Contribute in some other way** :

    Write to [hello@p5js.org](mailto:hello@p5js.org) and let us know what you're thinking! It is our intention that there should be many ways to contribute to p5.js, from writing code, to creating examples, tutorials and documentation, to thinking about workshops and education, to working on branding and design, and anything else you can dream up. Get in touch and we can talk about ways you might participate.

# Setup

1. Download and install [npm](https://npmjs.org/). The easiest way to do this is to just install [node](http://nodejs.org/).
2. [Fork and clone](https://help.github.com/articles/fork-a-repo) this library ([p5.js](https://github.com/processing/p5.js)). 

   ```
   git clone https://github.com/YOUR_USERNAME/p5.js.git
   ```

3. Navigate into the project folder and install dependencies via npm.
   
   ```
   cd p5.js
   npm install
   ```

4. To create the complete library from source, run Grunt. 

   ```
   npm run grunt
   ```
   **NEW** : To create the library with only certain components, use Grunt [as it is explained here.](https://github.com/processing/p5.js/blob/master/developer_docs/custom_p5_build.md)

   If you're continuously changing files in the library, you may want to run `npm run grunt watch:quick` to automatically rebuild the library for you whenever any of its source files change.

5. Run `npm run grunt` one last time to make sure all the tests pass, and [submit a pull request](https://help.github.com/articles/creating-a-pull-request).

# Overview

This [looking inside p5.js video](http://www.luisapereira.net/teaching/looking-inside-p5/) describes the tools and files used in p5.js workflow.

`lib/` Contains the concatenated p5.js and p5.min.js libraries, generated by Grunt.

`src/` Contains all the source code for the library. The code is broken up into folders and files corresponding with the [Processing reference page](http://processing.org/reference/). Additionally, there is a core folder that holds constants, and internal helper functions and variables.

`tests/` Contains unit testing files.

# Code Style

p5.js uses [Prettier](https://prettier.io/) to automatically enforce a consistent code style and [Eslint](https://eslint.org/) to find other problematic code patterns. The rules are checked both when tests are run and before you make a commit.

## Editor integration

It's a good idea to add an [Eslint plugin to your editor](https://eslint.org/docs/user-guide/integrations#editors) which will show problems as you write your code. Many of the Eslint plugins can also fix style problems while you edit your code. You can also use an integration for [Prettier](https://prettier.io/), but the Eslint plugins provide most of the same features and more.

## Automatic style fixing

`npm run lint:fix` will format your code so that it follows the code style rules. You can check for style errors / code problems without fixing them by running `npm run lint`.

## My commit got rejected ?! 
Whenever you make a commit, Eslint and Prettier will check that your code follows the style rules and reject commits that break the rules. The error often looks like this:
```
eslint found some errors. Please fix them and try committing again.

✖ 3 problem (2 error, 1 warnings)
  1 error, 1 warnings potentially fixable with the `--fix` option.
```

Errors or warnings that are ``fixable with the `--fix` option`` are fixed by running `npm run lint:fix`. 

## My code needs a special format!
In [some special cases](https://github.com/processing/p5.js/search?utf8=%E2%9C%93&q=prettier-ignore&type=) your code needs special formatting to look more clear. Prettier [offers an escape hatch](https://prettier.io/docs/en/ignore.html) to ignore a block of code from being formatted, via the `// prettier-ignore` comment. Use with caution!

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

    ````
    npm run docs:dev
    ````

## Running tests in the browser
Sometimes it is useful to run tests in browser especially when trying to debug test failures.  To run the tests in the browser:

1. Run the connect server. ```npm run grunt connect -keepalive```
2. Open test/test.html in your favourite web browser.

# Master branch development

1. Fork p5.js
2. Create a feature branch: `git checkout -b my_branch`
3. Make local changes
4. Commit and push changes. When you first attempt to push your feature branch, `git` will give you instructions on how to have your local branch track a similarly-named one on Github.
5. Submit a PR against the `p5.js/master` branch
6. checkout the master branch: `git checkout master`

## Bringing your master branch up-to-date

1. Make sure you have no uncommitted changes, or any additional commits in your master branch. The following commands will discard any changes you have made.
2. `git checkout master`
3. `git fetch`
4. `git reset --hard upstream/master`
5. `git push -f`

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
