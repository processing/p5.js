# Creating a custom build of p5.js with select components

## Overview

An excellent new [feature](https://github.com/processing/p5.js/pull/2051) of p5.js allows user to build p5.js as a custom combination of its modules. This greatly helps in reducing the production version size of the library, as well as improves overall performance.

This feature was suggested as a part of a proposal for Google Summer of Code 2017.

## Usage

Currently, the usage is through invoking a Grunt task manually from the command line:

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:module_x:module_y
```

Here, `module_n` refers to the name of the modules which you want to select. Multiple modules must be passed as shown above. Also, these modules must have the same name as their folders in `/src` directory to work correctly. While `core` is included by default, `core/shape` needs to be included for shapes like line() and other core features to work.

The above usage example will likely output a `p5Custom.js` larger than the complete `p5.min.js` as the output is not minified using the `uglify` task.

The recommended steps to reduce bundle size as much as possible are:

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run grunt
npm run grunt combineModules:min:module_x:module_y uglify
```

## Examples

- `npm run grunt combineModules:min:core/shape:color:math:image uglify`  
  Generates a `p5Custom.min.js` bundle in the `lib/modules` directory with the combineModules and uglify tasks. Note that modules should be listed after `combineModules:min` and the `uglify` task should have a space after the modules list.

- `npm run grunt combineModules:core/shape:color:math:image`  
  Generates a non-minified `p5Custom.js` bundle in the `lib/modules` directory.

- `npm run grunt combineModules:min:core/shape:color:math:image`  
  Generates a `p5Custom.pre-min.js` in the `lib/modules` directory with the `combineModules:min` task. Note that in this example `npm run grunt uglify` can be run separately after running the `combineModules:min` task.
