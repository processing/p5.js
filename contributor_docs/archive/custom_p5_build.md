<!-- Instructions on how to combine just the p5.js modules you need into a single file. -->

# Creating a custom build of p5.js with select components

## Overview

An excellent new [feature](https://github.com/processing/p5.js/pull/2051) of p5.js allows user to build p5.js as a custom combination of its modules. This greatly helps in reducing the production version size of the library, as well as improves overall performance.

This feature was suggested as a part of a proposal for Google Summer of Code 2017.

## Usage


p5.js has migrated to modern tooling. Use the following to build and test:

```sh
git clone https://github.com/processing/p5.js.git
cd p5.js
npm ci
npm run build      # builds the full p5.js bundle
npm test           # runs linter and tests using Vitest
```

To include only selected modules in a custom build, refer to the CONTRIBUTING guide or module-specific documentation. Rollup or tree-shaking through ES modules may be used for advanced setups.

---

## Examples

- `npm run grunt combineModules:min:core/shape:color:math:image uglify`  
  Generates a `p5Custom.min.js` bundle in the `lib/modules` directory with the combineModules and uglify tasks. Note that modules should be listed after `combineModules:min` and the `uglify` task should have a space after the modules list.

- `npm run grunt combineModules:core/shape:color:math:image`  
  Generates a non-minified `p5Custom.js` bundle in the `lib/modules` directory.

- `npm run grunt combineModules:min:core/shape:color:math:image`  
  Generates a `p5Custom.pre-min.js` in the `lib/modules` directory with the `combineModules:min` task. Note that in this example `npm run grunt uglify` can be run separately after running the `combineModules:min` task.
