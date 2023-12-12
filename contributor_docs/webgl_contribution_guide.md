# WebGL Contribution Guide

If you're reading this page, you're probably interested in helping work on WebGL mode. Thank you, we're grateful for your help! This page exists to help explain how we structure WebGL contributions and to offer some tips for making changes.


## Resources

- Read our [p5.js WebGL architecture overview](webgl_mode_architecture.md) to understand how WebGL mode differs from 2D mode. This will be a valuable reference for some implementation specifics for shaders, strokes, and more.
- Read our [contributor guidelines](https://p5js.org/contributor-docs/#/./contributor_guidelines) for information on how to create issues, set up the codebase, and test changes.
- It can be helpful to know a bit about the browser's WebGL API, which is what p5.js's WebGL mode is built on top of:
  - [WebGL fundamentals](https://webglfundamentals.org/) goes over many core rendering concepts
  - [The Book of Shaders](https://thebookofshaders.com/) explains many techniques used in WebGL shaders


## Planning

We organize open issues [in a GitHub Project](https://github.com/orgs/processing/projects/5), where we divide them up into a few types:

- **System-level changes** are longer-term goals with far-reaching implications in the code. These require the most discussion and planning before jumping into implementation.
- **Bugs with no solution yet** are bug reports that need some debugging to narrow down the cause. These are not yet ready to be fixed: once the cause is found, then we can discuss the best way to fix it.
- **Bugs with solutions but no PR** are bugs where we have decided how to fix it and are free for someone to write code for.
- **Minor enhancements** are issues for new features that have an obvious spot within the current architecture without needing to discuss how to fit them in. Once agreed that these are worth doing, they are free to write code for.
- **2D features** are ones that already exist in p5.js but not within WebGL mode. The expected behavior of the feature, once implemented, is to match 2D mode. We may need to discuss the best implementation, but the user requirements for these are clear.
- **Features that don't work in all contexts** are ones that exist in WebGL mode but do not work in all the ways one can use WebGL mode. For example, some p5.js methods work with both 2D coordinates and 3D coordinates, but others break if you use 3D coordinates. These are generally free to begin working on.
- **Feature requests** are all other code change requests. These need a bit of discussion to make sure they are things that fit into WebGL mode's roadmap.
- **Documentation** issues are ones that don't need a code change but instead need better documentation of p5.js's behavior.


## Where to Put Code

Everything related to WebGL is in the `src/webgl` subdirectory. Within that directory, top-level p5.js functions are split into files based on subject area: commands to set light go in `lighting.js`; commands to set materials go in `materials.js`.

When implementing user-facing classes, we generally try to have one file per class. These files may occasionally have a few other internal utility classes. For example, `p5.Framebuffer.js` includes the class `p5.Framebuffer`, and also additionally consists of a few framebuffer-specific subclasses of other main classes. Further framebuffer-specific subclasses can go in this file, too.

`p5.RendererGL` is a large class that handles a lot of behavior. For this reason, rather than having one large class file, its functionality is split into many files based on what subject area it is. Here is a description of the files we split `p5.RendererGL` across, and what to put in each one:


#### `p5.RendererGL.js`

Initialization and core functionality.


#### `p5.RendererGL.Immediate.js`

Functionality related to **immediate mode** drawing (shapes that will not get stored and reused, such as `beginShape()` and `endShape()`)


#### `p5.RendererGL.Retained.js`

Functionality related to **retained mode** drawing (shapes that have been stored for reuse, such as `sphere()`)


#### `material.js`

Management of blend modes


#### `3d_primitives.js`

User-facing functions that draw shapes, such as `triangle()`. These define the geometry of the shapes. The rendering of those shapes then happens in `p5.RendererGL.Retained.js` or `p5.RendererGL.Immediate.js`, treating the geometry input as a generic shape.


#### `Text.js`

Functionality and utility classes for text rendering.


## Testing WebGL Changes

### Testing Consistency

There are a lot of ways one can use the functions in p5.js. It's hard to manually verify all of it, so we add unit tests where we can. That way, when we make new changes, we can be more confident that we didn't break anything if all the unit tests still pass.

When adding a new test, if the feature is something that also works in 2D mode, one of the best ways to check for consistency is to check that the resulting pixels are the same in both modes. Here's one example of that in a unit test:

```js
test('coplanar strokes match 2D', function() {
  const getColors = function(mode) {
    myp5.createCanvas(20, 20, mode);
    myp5.pixelDensity(1);
    myp5.background(255);
    myp5.strokeCap(myp5.SQUARE);
    myp5.strokeJoin(myp5.MITER);
    if (mode === myp5.WEBGL) {
      myp5.translate(-myp5.width/2, -myp5.height/2);
    }
    myp5.stroke('black');
    myp5.strokeWeight(4);
    myp5.fill('red');
    myp5.rect(10, 10, 15, 15);
    myp5.fill('blue');
    myp5.rect(0, 0, 15, 15);
    myp5.loadPixels();
    return [...myp5.pixels];
  };
  assert.deepEqual(getColors(myp5.P2D), getColors(myp5.WEBGL));
});
```

This doesn't always work because you can't turn off antialiasing in 2D mode, and antialiasing in WebGL mode will often be slightly different. It can work for straight lines in the x and y axes, though!

If a feature is WebGL-only, rather than comparing pixels to 2D mode, we often check a few pixels to ensure their color is what we expect. One day, we might turn this into a more robust system that compares against full image snapshots of our expected results rather than a few pixels, but for now, here is an example of a pixel color check:

```js
test('color interpolation', function() {
  const renderer = myp5.createCanvas(256, 256, myp5.WEBGL);
  // upper color: (200, 0, 0, 255);
  // lower color: (0, 0, 200, 255);
  // expected center color: (100, 0, 100, 255);
  myp5.beginShape();
  myp5.fill(200, 0, 0);
  myp5.vertex(-128, -128);
  myp5.fill(200, 0, 0);
  myp5.vertex(128, -128);
  myp5.fill(0, 0, 200);
  myp5.vertex(128, 128);
  myp5.fill(0, 0, 200);
  myp5.vertex(-128, 128);
  myp5.endShape(myp5.CLOSE);
  assert.equal(renderer._useVertexColor, true);
  assert.deepEqual(myp5.get(128, 128), [100, 0, 100, 255]);
});
```


### Performance Testing

While not the #1 concern of p5.js, we try to make sure changes don't cause a large hit to performance. Typically, this is done by creating two test sketches: one with your change and one without the change. We then compare the frame rates of both.

Some advice on how to measure performance:

- Disable friendly errors with `p5.disableFriendlyErrors = true` at the top of your sketch (or just test `p5.min.js`, which does not include the friendly error system)
- Display the average frame rate to get a clear sense of the steady state frame rate:

```js
let frameRateP;
let avgFrameRates = [];
let frameRateSum = 0;
const numSamples = 30;
function setup() {
  // ...
  frameRateP = createP();
  frameRateP.position(0, 0);
}
function draw() {
  // ...
  const rate = frameRate() / numSamples;
  avgFrameRates.push(rate);
  frameRateSum += rate;
  if (avgFrameRates.length > numSamples) {
    frameRateSum -= avgFrameRates.shift();
  }
 
  frameRateP.html(round(frameRateSum) + ' avg fps');
}
```

Here are cases we try to test since they stress different parts of the rendering pipeline:

- A few very complicated shapes (e.g., a large 3D model or a long curve)
- Many simple shapes (e.g., `line()` called many times in a for loop)
