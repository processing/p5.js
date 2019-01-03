# Creating a custom build of p5.js with select components

## Overview

An excellent new [feature](https://github.com/processing/p5.js/pull/2051) of p5.js allows user to build p5.js as a custom combination of its modules. This greatly helps in reducing the production version size of the library, as well as improves overall performance. 

This feature was suggested as a part of a proposal for Google Summer of Code 2017.

## Usage 

Currently, the usage is through invoking a Grunt task manually from the command line. 

```
git clone https://github.com/processing/p5.js.git
cd p5.js
npm install
npm run grunt
npm run grunt combineModules:module_x:module_y
```

Here, `module_n` refers to the name of the module which you want to select. Multiple modules must be passed as shown above. Also, these modules must have the same name as their folders in `/src` directory to work correctly. While `core` is included by default, `core/shape` needs to be included for shapes like line() and other core features to work.

## Example

`npm run grunt combineModules:core/shape:color:math:image`

This will generate your `p5Custom.js` bundle in the `lib/modules` directory.
