# p5.js 2.0

## Introduction
This is a RFC document for a proposal of p5.js 2.0.

---

- [Build and test system](#build-and-test-system)
- [Refactors](#refactors)
- [Modular](#modular)
- [Libraries](#libraries)
- [Renderers](#renderers)
- [Async](#async)
- [Algorithm Changes](#algorithm-changes)
- [Reference](#reference)
- [Typography](#typography)
- [Misc](#misc)

---

## Motivation
p5.js 1.0.0 was released on February 29, 2020, while it may not seem to be that long ago (a bit less than four years ago at the time of writing) in the very fast moving landscape of JavaScript it is a great amount of time. In this time, the JS landscape has advanced a lot with new paradigms and expectations of what a JS library should be. In the time between the 1.0 release till now, p5.js has not been standing still either, with major progress and focuses on accessibility features, bug fixes, updates & enhancements to existing features, and more, contributed by a great number of contributors consistently over the past several years.

However by being within a semver 1.0 release means that we have to consider full backwards compatibility of the library when reviewing any proposals around bug fixes, feature enhancements, and potentially adding new features. At the same time we have continously put off updating several aspects of the library, including things such as tooling, algorithms, and newer APIs, because of either lack of maturity in the JavaScript ecosystem or the overall scope of changes. With the view that p5.js will be getting a new website and simply just because this is long overdue, we propose this RFC to start the process of overhauling many aspects of p5.js and bring about a 2.0 version release.

## Goals and non-goals
This project will continue to adhere to p5.js being an accessible and inclusive creative coding library first and foremost, all the proposals outlined below will continue to aim towards increasing access of p5.js. On a technical level, the larger goals of this project are:
* Update p5.js to use more modern JavaScript conventions, both in terms of its internal implementation and the interface it exposes to the user.
* Enable the use of p5.js through ES modules semantically.
* Keeping backwards compatibility with current 1.x version of p5.js as much as reasonable.

A few non-goals of p5.js 2.0 are:
* Do everything possible: p5.js will have a powerful and easy to use addon library system and so should not include every feature possible.

## Organization
Some exploratory work has been done and can be explored [here](https://github.com/limzykenneth/p5.js/tree/test-exploration) with future work to continue from it if feasible. The goal is to complete all necessary work listed and agreed upon below by end of March 2024 with a full release in April 2024. Public issues and a project tracker will be used to build up a clear roadmap towards an April 2024 release.

The first stage of this process is for the whole community of p5.js to discuss and review the proposals below and to put forward their own proposals for p5.js 2.0. Exploratory prototyping can be done at this stage using the above linked exploratory version as a starting point. There may be a few rounds of synchronous calls available for community to discuss proposals in real time, the result of which will continue to be tracked here. This document will be constantly updated at this stage as proposals are hashed out, added, or removed throughout the discussions.

The second stage will focus on implementation work. Proposals should be hashed out and accepted at this point to start implementation, continuing from the exploratory branch as the working branch and using feature branches for implementation and submitting PR back to the working branch.

The third and final stage will be the prerelease process. Several prerelease (Release Candidate, RC) versions will be released in the run up to the final release in April 2024. Implementation work in the second stage should be completed at this point and features will be frozen at this point onward, only bug fixes should be worked on at this stage.

After stage 3, p5.js 2.0 will be released!

During this process, p5.js 1.0 will still continue to be worked on and we will review bug reports, fixing them, and create releases as necessary. However we will not review feature enchancements or new feature requests for p5.js 1.0, these should be filed towards a proposal for p5.js 2.0 instead.

## Proposals and Solutions
See the below for the full list of current proposals under considerations. There may be overlaps between different proposals, which may be assigned to the same contributor for implementation in the second stage. For the purpose of derisking the use of bundled external dependencies, wherever possible, external dependencies should be avoided with preference to original implementation or inlining implementations of external dependencies, if external dependencies are to be used for practical reasons, they need to be fully vetted in stage 1.

---

### Build and test system
The build system for p5.js will be updated to use [Rollup](https://rollupjs.org/), development server will use [Vite](https://vitejs.dev/), and the test runner will use [Vitest](https://vitest.dev/).

* Rollup
  * Significantly improves the build speed of the library with the core library taking just a few seconds to build.
  * Have more semantic support of ESM.
  * Simpler config and overall a more modern set of tools.
* Vite
  * Also Vite has a library mode and uses Rollup under the hood for production build, it lacks the flexibility to support complex library build where multiple inputs need to correspond to multiple outputs.
  * Provides a very good development server that can be used to speed up library development. An `index.html` file is added to the repo for using this development server.
* Vitest
  * Uses the same idea behind Vite's development server to run tests which speeds up tests running significantly.
  * Supports headless browsers, parallel tests running, granular test running in watch mode, and more.
  * While many tests already works, the overall tests will need to have a pass through to correct everything, update to use latest ESM syntax library will be using, and integrate any new test methods where necessary.
  * All tests will run in headless browsers and not test should be run in Node.js as it is not the intended environment for p5.js to run in.

#### To do
In conjuction with refactoring and modularization, the build need to be updated as necessary.

The Vite development server can benefit from a more comprehensive `index.html` that includes common visual regression cases that contributors can check while they work on the code base.

The majority of pending work will be to update all tests to work with Vitest. The priority being all the existing unit tests. Visual tests may be added after.

---

### Refactors
The overall codebase will undergo extensive refactoring, with the goal of using more semantic JavaScript syntax (modules, classes, newer APIs). The use of side effect imports in the codebase will also be reduced to a minimum if complete removal is not possible.

#### API Consistency
The overall public API of p5.js should be checked for consistency to ensure a uniform API is provided to the sketch authors where possible. An example for this is `beginShape()` by default does not close the path without `endShape(CLOSE)` being provided whereas `beginContour()` does. The behavior between the two should be made consistent, either both default to closing the path or both default to not close the path. Breaking changes are allowed for these cases.

#### Deprecated code
Code marked as deprecated in the code base should be removed. Any older behavior if agreed to be kept around for the time being but will be removed in the future should be marked as deprecated with deprecation message printed in the console when used, this should be avoided as much as possible however.

---

### Modular
p5.js will have a core that contains only the absolute essential functionalities, while all other code will be separately import-able. Take as example the core only build of p5.js and the math module as a separate module not included in core, two versions of each will be built from the source code: IIFE and ESM. Rollup is setup to create build for both with IIFE being the preferred format for most users using `<script>` tags and ESM the preferred format for users using their own bundlers. (CommonJS or AMD format will not be supported)

#### IIFE
Immediately Invoked Function Expression (IIFE) is a common format libraries meant to be included with regular `<script>` tag will come in. It prevents excessive global namespace pollution and is also used by p5.js 1.0. Rollup have several output formats and libraries meant to be included with regular `<script>` tag will either be using `iife` or `umd`, the later of which combines IIFE, CommonJS, and RequireJS/AMD module syntax in one. p5.js 2.0 will mainly use Rollup's `iife` format as IIFE allows for initialization through just side effects while for UMD, an export name must be set which is not compatible with the IIFE usage we want.

```html
<script src="./lib/p5.js"></script>
<script src="./lib/p5.math.js"></script>
<script>
function setup(){
  createCanvas(400, 400);
  console.log(ceil(2.1));
}

function draw(){
  background(200);
  circle(200, 200, 100);
}
</script>
```

In the above example, both `p5.js` and `p5.math.js` are built with the `iife` format. This usage is similar if not identical to the usage of addon libraries currently (deliberately so). The `math` module here is a bundled module taken from all the source located in `src/math` folder. Each file in that folder can be independenly built into the `iife` format with Rollup if desired and the whole module can be included in the final `p5.js` bundle if desired as well.

```js
// src/math/index.js
import calculation from './calculation.js';
import noise from './noise.js';
import random from './noise.js';
import trigonometry from './trigonometry.js';
import math from './math.js';
import vector from './p5.Vector.js';

export default function(p5, fn){
  p5.registerAddon(calculation);
  p5.registerAddon(noise);
  p5.registerAddon(random);
  p5.registerAddon(trigonometry);
  p5.registerAddon(math);
  p5.registerAddon(vector);
}
```
```js
// src/math/calculation.js (redacted)
function calculation(p5, fn){
  fn.abs = Math.abs;
}

export default calculation;

if(typeof p5 !== 'undefined'){
  calculation(p5, p5.prototype);
}
```
```js
// src/app.js (redacted)
// math (include if to be bundled as part of p5.js)
import './math/calculation';
import './math/math';
import './math/noise';
import './math/p5.Vector';
import './math/random';
import './math/trigonometry';
```

Please see relevant examples in the exploration fork for implementation.

#### ESM
ESM or ES Module is the current standard in JavaScript for working with modular JavaScript code. ESM are now very widely supported with all major browsers natively supporting it, all modern build tools supports or are even built around it, and Node.js have native support for it as well. p5.js 1.0's code is already written with ESM and transpiled into a UMD module. As part of the refactor mentioned in a previos section, the syntax of the internal use of ESM will be updated to match semantic usage. The main goal will be to limit cross dependencies between modules and minimize the use of side effects imports.

```js
import p5 from 'p5';
import math from 'p5/math';

p5.registerAddon(math);

// The same instance mode syntax
const sketch = (p => {
  p.setup = () => {
    p.createCanvas(400, 400);
    console.log(p.ceil(2.1));
  };

  p.draw = () => {
    p.background(200);
    p.circle(200, 200, 100);
  };
});

new p5(sketch);
```

The above example assumes the user is using Node.js module resolution and have installed `p5` through NPM. However, distributable ESM modules are built and will be published via CDN as well. To use this, the first two lines will instead be:

```js
import p5 from './js/p5.esm.js';
import math from './js/p5.math.esm.js';
```

Across both formats above, one thing that was not elaborated on is the static method `p5.registerAddon`. This will be discussed in the Libraries section below.

---

### Libraries
Existing libraries should have a level of compatibility or require minimal updates to work with p5.js 2.0.

A new method of authoring libraries will be introduced that is more ergonomic. This will be through a factory function that exposes reasonable interfaces for completing the following tasks as necessary:
* Attaching methods and properties to prototype
* Lifecycle hooks
* Extending internal functionalities (eg. adding a new renderer)

As reference, Day.js provide plugin interface in the following way:
```js
export default (option, dayjsClass, dayjsFactory) => {
  // extend dayjs()
  // e.g. add dayjs().isSameOrBefore()
  dayjsClass.prototype.isSameOrBefore = function(arguments) {}

  // extend dayjs
  // e.g. add dayjs.utc()
  dayjsFactory.utc = arguments => {}

  // overriding existing API
  // e.g. extend dayjs().format()
  const oldFormat = dayjsClass.prototype.format
  dayjsClass.prototype.format = function(arguments) {
    // original format result
    const result = oldFormat.bind(this)(arguments)
    // return modified result
  }
}
```
And is used with:
```js
dayjs.extend(myPlugin);
```

While jQuery provides the following interface:
```js
$.fn.greenify = function() {
  this.css('color', 'green');
};

$('a').greenify();
```
`fn` above is just an alias to `prototype` which in essense makes jQuery's plugin system identical to what p5.js does.

p5.js plugins have some properties that are not present in the Day.js or jQuery use case. With Day.js, plugins are expected to be explicitly provided through `dayjs.extend()` while p5.js addons should have the expectations of being available immediately upon inclusion/load. jQuery plugin don't need to content with lifecycle hooks or other non-class instance related features. A p5.js addon should also have the flexibility of being imported as a ES module or included through a script tag, ie. there should be a ES module version and a UMD version ideally.

The proposed interface that a p5.js 2.0 plugin can have is as the following:
```js
(function(p5){
  p5.registerAddon((p5, fn, lifecycles) => {
    // `fn` being the prototype
    fn.myMethod = function(){
      // Perform some tasks
    };

    // Instead of requiring register preload,
    // async/await is preferred instead.
    fn.loadMyData = async function(){
      // Load some data asynchronously
    };

    lifecycles.presetup = function(){
      // Run actions before `setup()` runs
    };

    lifecycles.postdraw = function(){
      // Run actions after `draw()` runs
    };
  });
})(p5);
```

---

### Renderers
p5.js 1.0 is bundled with two renderers: 2D and WebGL. They corresponds to the HTML Canvas `2d` and `webgl` context respectively. However, there had been requests over the years to add additional renderers such as an SVG renderer or a renderer with scene graph capabilities. As the web evolve, we are also seeing new a possible standard renderer being developed, ie. [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API).

As currently implemented, adding a new renderer to p5.js is not an easy task which involves many parts that expects to behave differently depending on whether the current sketch is in 2D or WebGL mode.

```js
createCanvas(400, 400, WEBGL);
```

The constant value to determine whether a canvas is in 2D or WEBGL mode is also not easily extendable by addon libraries.

With p5.js 2.0, the renderer system is redesigned and tweaked with a few key points.
1. `p5.Renderer` class which both `p5.Renderer2D` and `p5.RendererGL` classes inherit from will now act more like an abstract class that it is meant to be.
    * The `p5.Renderer` class will determine a set of basic properties and methods any renderer class inheriting from it should implement, while extra functionalities can still be implemented on top. (eg. all renderers should implement the `ellipse()` method but the WebGL renderer will also implement a `sphere()` method that 2D renderers don't need).
    * The `p5.Renderer` class should never be instantiated directly.
2. The core will not have implicit knowledge of what renderers are available. Previously the two modes supported (`P2D` and `WEBGL`) are harded coded into functions like `createCanvas()` making creating a new rendering mode difficult without also modifying core functionalities.
    * A list of renderers should be kept under the `p5.renderers` object with value being the class object of the renderer (that inherits from `p5.Renderer` class).
```js
p5.renderers = {
  [constants.P2D]: Renderer2D,
  [constants.WEBGL]: RendererGL
};
```

For an addon library to create a new renderer to work with p5, it will need to first create a class that inherits and implements the `p5.Renderer` abstract class, then register the renderer under the `p5.renderers` object.

```js
(function(p5){
  class MyRenderer extends p5.Renderer {
    ellipse(x, y, w, h) {
      // ...
    }

    // ...
  }

  p5.registerAddon((p5, fn, lifecycles) => {
    p5.renderers.myRenderer = MyRenderer;
  });
})(p5);
```

When a sketch author wants to use the addon provided renderer above, they can use the following code when creating a canvas.

```js
function setup(){
  createCanvas(400, 400, 'myRenderer');
}
```

For usage that are more similar to p5.js' own renderers, constants registration can be exposed to addon library authors as well. In this case, it is recommended to make the constant value a `Symbol` matching behavior in the core library itself.

#### Core question
Part of the motivation for this proposal is to enable a leaner build of the library for users who only use the 2D renderer but not the WebGL renderer and vice versa. If someone uses only the 2D canvas, there is no need for most if not all of the WebGL components to be included.

This creates a question, should p5.js still be bundled with both renderers for distribution? What about new renderers in the future? There are a few options for this:
* Bundling both 2D and WebGL renderers, bundling also any new renderers if they are included in the library directly.
* Bundle only 2D renderer. Log a warning message if the sketch author tries to create a WebGL canvas without loading in the WebGL renderer as an addon.
* Bundle no renderer. All and any renderers should be included as addons.

The third options is probably too extreme and probably should not be considered. Either of the first two options are open for discussions.

---

### Async
Data loading functions will all be updated to be fully async using promises (with `async`/`await`) while keeping the callback syntax if necessary. `setup()` will be awaited in the runtime and if the user define it as `async` functions, the promisified data loading functions can be awaited in them. With an async `setup()` function, the `draw()` loop will only start after the `setup()` function has resolved.

`draw()` can be defined as an `async` function as well, although this is not recommended because of the possible timing conflict it may have with `requestAnimationFrame`.

The async `setup()` function eliminates the need to have the `preload()` function. As such the data loading codebase will be refactored to remove `preload()` related code, while documentation around data loading should be updated accordingly.

---

### Algorithm changes
#### RNG
Seeded random number generator (RNG) will use xorshift128+. The current algorithm for RNG used in p5.js is an version of a Linear Congruential Generator (LCG).

The main reasoning for this change is for performance. xorshift128+ performs better than LCG and it is the internal implementation of most of the current major browsers for `Math.random()`. The random property of xorshift128+ is similar if not better than LCG.

This will be a breaking change as existing seeded RNG will not give the same random number sequence once the algoritm has switched to use xorshift128+. Consideration can be made to create a compatibility addon library that patch seeded RNG to use the old LCG RNG if necessary.

Example implementation of a xorshift128+ backed RNG with compatible API to p5.js can be found [here](https://github.com/limzykenneth/js-xorshift128p).

#### Noise
`noise()` function will use [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) instead of the current [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise). Simplex noise has better performance than Perlin noise and no noticeable directional artifacts.

Until January 8, 2022, Simplex noise is protected by a US Patent, making adopting it problematic in certain cases. The patent has since expired, opening the way for its implementation in p5.js. This will be a breaking change as existing seeded `noise()` output will not give the same output after the algorithm has switched to use Simplex noise. Consideration can be made to create a compatibility addon library that patch seeded `noise()` to use Perlin noise if necessary.

`noise()` will also accept higher dimensional input with the new implementation through accepting any number of numerical arguments passed to it (currently only accept either 2 or 3 arguments).

#### Color
A new color module will be implemented. The requirements of this new color module are:
* Full compatibility with CSS color space support.
* Possibility for addon libraries to introduce additional color spaces.
* Accurate gamut mapping.
* API as close to existing implementation as possible.

#### Math
A new math module will be implemented. The requirements of this new math module are:
* Unified vector and matrices support with compatible API with ml5.js.
* Explore reasonable performance optimizations through the use of specific algorithms, GPU implementation, or others.
* Possibility for addon libraries to provide own implementation (so that any external libraries can be made compatible without being implemented internally by p5.js).

---

### Reference
The inline reference of p5.js while following a largely compatible syntax with JSDoc, under the hood is actually compiled with YUIDoc into a JSON file that the website can consume to render the actual reference page. While YUIDoc serves its purpose since the first reference documentation of p5.js, it is a tool that is no longer being worked on for over 6 years. In these 6 years, many issues and limitations means that p5.js is tied in some ways to how YUIDoc expects documentation to be authored. Several issues with setting up a development environment has also previously been tied to YUIDoc getting outdated with the overall JS ecosystem.

While YUIDoc has a very similar syntax with JSDoc, there are subtle differences. For p5.js 2.0, we will move inline reference authoring to use the JSDoc syntax and generation/compilation to use [Documentation.js](https://github.com/documentationjs/documentation).

#### Syntax
JSDoc syntax has for the most part settled into being a de facto standard for documentation authoring in the JavaScript ecosystem, in fact the current inline reference of p5.js is actually full compatible with JSDoc, in that it successfully compiles with JSDoc with no errors. This does not mean documentation generated through JSDoc will have the correct structure, only that it is valid syntax.

Depending on the next step and the structure of what the website might expect from the reference data file, there will likely need to be minor changes to the reference throughout the codebase.

#### Compilation
For compililng the inline reference into data file that can be used by the website to generate the reference pages, instead of using JSDoc, Documentation.js will be used. The reason to prefer Documentation.js over JSDoc in mainly in terms of build tool ergonomics. JSDoc is designed as a site generator with its ability to generate JSON output more of a debugging functionality instead of an intended feature; Documentation.js however supports generating JSON data files as its primary output.

Documentation.js does not have as active a maintenance history as JSDoc which is a potential downside. However, since it fully supports JSDoc syntax and JSDoc syntax having widespread ubiquity, in the future if need be the transition to another tool (even JSDoc) should not require the same effort as transitioning from YUIDoc to JSDoc since the inline reference will stay the same still.

#### Typing
A benefit fully adopting JSDoc syntax is that it enables direct generation of Typescript type declarations (and type checks if desired) from the JSDoc definitions. This is similar to how the source code of [SvelteKit](https://github.com/sveltejs/kit) is authored using just JavaScript while keeping type generation and type checks.

This feature however is a nice to have. p5.js will aim to follow typing rules as much as possible but will not impose it as a strict requirement for contributors. Type declaration generation will also not be brought into the repo itself (including type checks) which also means types won't be published officially.

---

### Typography
The typography module can benefit from an overall refactor or even rewrite. The aim should be to leverage native browser/CSS capabilities as much as possible and limit the use of external library (ie. opentype.js) to only things not achievable otherwise.

---

### Misc
These are a collection of minor modifications that don't necessarily have enough scope to be a full proposal on its own.
* Remove some internal aliases to Web API. Their API references can be kept.
* Retire `p5.Table` for more semantic JavaScript data structure.
* Turn all constants that don't rely on underlying value to use `Symbol`.
* Remove support for JSONP in `loadJSON` function.
    * This feature adds complexity and bypasses security feature.
    * If a server was able to serve JSONP, it should be able to serve CORS resources instead.
    * If required, JSONP functionality can be readded through an addon but it should not be part of p5.js core.
* Regression fixes
  * FES should not be using `eval()` partly because it is not compatible with Rollup's bundling

---

## Future
The new architecture design should aim for as much pluggability as possible, enabling additional features to be changed, added, or extended through addon libraries. Some of the possible future features that may be implemented are listed below along with reasons they are and are not targeted for immediate implementation.
* [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
    * Provides a possibility of rendering `p5.Graphics` in web worker, potentially offloading frequent drawing of many graphics into multi-threaded like environment.
    * Considered using `creatElement('canvas')` then `transferControlToOffscreen()` (and other methods) to move a `p5.Graphics` canvas to the web worker. The offscreen canvas can then be drawn onto the on screen canvas with `drawImage()`.
    * WebGL context not currently supported in Safari.
    * Firefox currently does not support drawing offscreen canvas onto on screen canvas. Alternative of `transferToImageBitmap()` is too slow to achieve real time performance.

### p5.js 1.0
The 1.x version of p5.js will continue to receive bug and critical fixes for another 12 months after the release of p5.js 2.0. No new features or feature updates will be accepted to 1.x version of p5.js and new releases will be created only when as necessary. Any existing code or addon libraries should aim to migrate to support p5.js 2.0 where possible.

## Conclusion
All the above ideas for p5.js 2.0 would not be possible without all the people who has worked on p5.js over the years, all the contributors who provided so much insight and ideas that greatly inspired this project, the many different open source projects and their contributors that directly or indirectly enabled p5.js to be the project that it is, and many many more.

We welcome you to participate in this process of realizing p5.js 2.0 and to continue contributing to p5.js in the future as well!

## References
* https://github.com/AndreasMadsen/xorshift
* https://learn.jquery.com/plugins/basic-plugin-creation/
* https://day.js.org/docs/en/plugin/plugin
* https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
* https://colorjs.io/docs/gamut-mapping
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
* https://rollupjs.org/configuration-options/
* https://vitejs.dev/guide/
* https://vitest.dev/guide/browser.html