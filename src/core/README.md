# [init.js](./init.js)

The `init.js` module initializes a new `p5` object in either global mode, instance mode, or unit testing mode. Broadly speaking, this module should only contain logic that needs to execute *before startup*, such as testing the environment in which the code is running in order to make decisions about how it should load.

# [core.js](./core.js)

The sole job of the `core.js` module is to create and then export the constructor function for creating a new `p5` object. This constructor function is also called `p5`, and doesn't use the typical JavaScript convention of capitalizing constructor functions. The constructor handles a number of mechanical startup concerns, including assigning functions and properties from elsewhere in the source code to the newly created `p5` object as either public or private methods and properties.

Aside from the exported constructor function, the most important thing in this module is the set of functions that define the loop used by nearly every p5.js project: `preload()`, `setup()`, `draw()`, `remove()`, and so on. These functions are both available on the `p5` object as methods, and also assigned to variables in the global space for syntactic simplicity, because calling a function named `draw()` is more creatively expressive than namespacing the same functionality with an object as with `mySketch.draw()` or similar. The `friendlyBindGlobal` function standardizes the process by which the necessary global variables can be created, notably including logging [friendly error messages](https://github.com/processing/p5.js/wiki/Friendly-Error-System) when conflicts are detected, but it is not exported from the module's internal scope.

# [structure.js](./structure.js)

The `structure.js` module is best thought of as a collection of ways to make *modifications* to the typical *loop structure* of p5's `draw()` function. The functions in this module allow you to add and extract individual renders from the loop, draw the loop one frame at a time, pause and resume the loop, and so on.

# [constants.js](./constants.js)

The `constants.js` module provides various default values mostly related to math and web standards using clear semantic names to increase syntax clarity when they are used in other algorithms. These values are attached to the `p5` object prototype as properties by the constructor function so they can be more easily accessed by other parts of the p5.js library or by user code.

# [environment.js](./environment.js)

The `environment.js` module detects and semantically reassigns various features of the code execution environment that are arguably beyond the control of the p5.js library, such as device properties, window dimensions, and the URL bar. In general, this module should only contain code that exposes mechanics of the web that usually would not be considered part of the p5.js "sketch." This module is conceptually similar to `init.js` in that it tests the environment in which the p5.js code is executing, but one major difference is that broadly speaking the code in `environment.js` does *not* need to run solely at initialization as with `init.js`, and can be invoked whenever necessary.

# [shim.js](./shim.js)

Sometimes p5.js needs to use new browser APIs or other features which haven't yet been completely standardized; for example, a feature that still uses [vendor prefixes](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix). In any such cases where it is necessary to handle multiple versions of the same functionality, the `shim.js` module juggles the available variants and assigns the results of that evaluation to a standardized property on the `p5` object. The rest of the p5.js library can then use that functionality without needing to constantly reconsider the specific browser implementation details.

# [rendering.js](./rendering.js)

The `rendering.js` module defines graphical output options. In the overwhelming majority of cases, a p5.js sketch will be output to a `<canvas>` tag on the current web page, but it is also possible to do "headless" output using `nocanvas` mode or "render" to a graphics buffer that is computed but never actually appears on the screen.

# [2d_primitives.js](./2d_primitives.js)

The `2d_primitives.js` module provides helper functions for drawing common shapes. The resulting drawing commands are sent to the currently active [renderer](./renderer.js).