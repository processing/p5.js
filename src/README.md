# Organization

The p5.js source code is organized into subdirectories which are roughly conceptually equivalent to third-party add-ons, except that these "add-ons" are actually just shipped as part of the p5.js library because the functionality they provide is so useful and central to p5's goal of building art projects for the web.

The `src/core` directory is the primary exception to this. It contains most of the internal logic of p5.js — the code that orchestrates everything else. It is possible to create optimized minimalist [custom builds](/contributor_docs/custom_p5_build.md) of the p5.js library which only includes specific desired modules. In such a custom build, the contents of the core directory would be the only hard requirement, and everything else would be optional.

[JSDoc](https://jsdoc.app/) [module](https://jsdoc.app/tags-module.html) annotations are used throughout the codebase, but they primarily organize the public-facing [p5 reference manual](https://p5js.org/reference/), which is built automatically from the source code. These annotations structure the *expressive and creative API* of p5, and consequently, they might not always align exactly with the *source code structure*.

The `app.js` file is simply an index of all the other modules which export the p5 constructor function.

# APIs

p5.js seeks to create a toolkit for working with the web technologies that are most valuable for building art projects. For both expressive and pedagogical reasons, p5.js values (but does not necessarily always achieve lol!) clarity in its APIs. These are guidelines, and in practice, there may be occasional exceptions.

## Public

Public APIs that are exposed to users of the p5.js library during the course of working on sketches and projects should use short, clear, declarative function names. `circle()` is preferable to `new Circle()`. If the name of a public API function is longer than one or two words, it may be worth carefully considering whether the API should be restructured into something more creative, expressive, or intuitive.

## Native

Native APIs provided by the browser can sometimes be aliased in the style of public APIs to provide a more creative, expressive, or intuitive interface than the native implementation. For example, `print()` is easier to explain than `console.log()`. Idiomatic JavaScript is generally preferable, so aliasing in this manner needs to have tremendous creative or pedagogical benefits.

Native browser functionality is also often aliased with properties on the `p5` object. This allows the library to consistently point toward the same reference, but in most cases, this practice should not be considered part of the public API even though those properties are exposed to the user.

## Internal

Internal APIs which are not exposed to the user but are used for coordination within the library should generally take the form of constructor functions that can be exported across module boundaries. Those constructors are often attached to the `p5` constructor as a form of namespacing, but otherwise do not meaningfully act as methods that reference the host object. In cases where a `p5` object is needed inside a constructor, an instance will be explicitly passed as an input argument.