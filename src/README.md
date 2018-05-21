# Organization

The p5.js source code is organized into subdirectories which are roughly conceptually equivalent to third-party addons, except that these "addons" are actually just shipped as part of the p5.js library because the functionality they provide is so useful and central to p5's goal of building art projects for the web.

The `src/core` directory is the primary exception to this. It contains most of the internal logic of p5.js — the code which orchestrates everything else. It is possible to create optimized minimalist [custom builds](/developer_docs/custom_p5_build.md) of the p5.js library which only include specific desired modules. In such a custom build, the contents of the core directory would be the only hard requirement, and everything else would be optional.

[JSDoc](http://usejsdoc.org/) [module](http://usejsdoc.org/tags-module.html) annotations are used throughout the codebase, but they primarily organize the public-facing [p5 reference manual](https://p5js.org/reference/), which is built automatically from the source code. These annotations structure the *expressive and creative API* of p5, and consequently they might not always align exactly with the *source code structure*.

The `app.js` file is simply an index of all the other modules which exports the p5 constructor function.

# APIs

p5.js seeks to create a toolkit for working with the web technologies that are most valuable for building art projects. For both expressive and pedagogical reasons, p5.js values (but does not necessarily always achieve lol!) clarity in its APIs.

Public APIs which are exposed to users of the p5.js library during the course of working on sketches and projects should use short, clear, declarative function names. `circle()` is preferable to `new Circle()`. If the name of a public API function is longer than one or two words, it may be worth carefully considering whether the API should be restructured into something more creative, expressive, or intuitive.

Native APIs provided by the browser can sometimes be aliased in the style of public APIs to provide a more creative, expressive, or intuitive interface than the native implementation. For example, `print()` is easier to explain than `console.log()`. Be careful when considering whether to alias native browser functionality in this manner using the public API, because teaching a non-standard implementation also has a steep educational cost. 

Internal APIs which are not exposed to the user but are used for coordination within the library should generally take the form of constructor functions which can be exported across module boundaries. Those constructors are often attached to the `p5` constructor as a form of namespacing, but otherwise do not meaningfully act as methods that reference the host object. In cases where a `p5` object is needed inside a constructor, an instance will be explicitly passed as an input argument.

The above are guidelines, and in practice there may be occasional exceptions.
