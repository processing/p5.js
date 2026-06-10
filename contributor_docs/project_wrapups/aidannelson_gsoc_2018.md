# p5.js WebGL Updates

Over the course of this Google Summer of Code 2018 project for The Processing Foundation, I worked along with [Adil Rabbani](https://github.com/AdilRabbani) and our mentors [Kate Hollenbach](https://github.com/kjhollen) and [Stalgia Grigg](https://github.com/mlarghydracept) to further expand and improve p5.js' WebGL implementation. I focused specifically on helping beginner coders visualize and understand 3D space through an expanded orbitControl(), reorganization and expansion of the camera and a debugMode().

## Contributing to the Library

Having never before contributed substantially to open-source, I began the summer by getting up to speed on p5.js' contribution practices, the automated build process and working with git on our shared [webgl-gsoc-2018](https://github.com/processing/p5.js/tree/webgl-gsoc-2018) branch. During this time, I worked on improving existing WebGL mode documentation [here](https://github.com/processing/p5.js/pull/2940) and [here](https://github.com/processing/p5.js/pull/2939). In addition, fixing minor bugs ([here](https://github.com/processing/p5.js/pull/2944), [here](https://github.com/processing/p5.js/pull/2945), [here](https://github.com/processing/p5.js/pull/2975) and [here](https://github.com/processing/p5.js/pull/2976)) helped enormously to understand how the WebGL mode and broader p5.js codebases interacted with each other, with the browser and with the graphics card, as did a deep and ongoing friendship with the Chrome Debugger.

Along with this work, I found it extremely helpful to learn and use 'vanilla' WebGL outside of the p5.js ecosystem. Without the implementation-specific complexity of a library, I found it much easier to see how the various elements of a WebGL canvas interact. This series of [videos](https://www.youtube.com/watch?v=kB0ZVUrI4Aw) is particularly thorough in setting up a WebGL context, writing shaders and creating a program, and implementing the various matrices necessary for a 3D scene. To develop a more high-level background on the matrix math underlying 3D graphics and an intuitive sense of how matrices are composed, I found this series of [videos](https://www.youtube.com/watch?v=kjBOesZCoqc&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) very helpful. Among the dozens of articles I found on 3D cameras and projection, the chapters on [camera control](http://learnwebgl.brown37.net/#section-7-cameras) and [projection](http://learnwebgl.brown37.net/#section-8-projections-and-viewports) in 'Learn WebGL' were particularly helpful in developing an approach to the p5.Camera object reorganization.

## orbitControl()

`orbitControl()` allows a user to control the camera view of a sketch with the mouse. It is a very quick and easy way to debug code, better understand the 3D coordinate system and how other other p5.js WebGL functions (`rotateXYZ()`, `translate()`, `perspective()` and `ortho()`, for instance) manipulate objects and view within a 3D sketch. Building upon the existing `orbitControl()`, which allowed two-axis rotation of a sketch, and with the goal of implementing similar functionality to [this](https://threejs.org/examples/?q=control#misc_controls_orbit) set of three.js controls, I went to work on adding several features: persistence (rotation would not reset after the mouse is released), maintaining Y-Up orientation, and pan and zoom control.

Adding all of this to a single function turned out to be somewhat unwieldy within the existing structure of the p5.RendererGL object, however, and helped prompt the decision to move all camera functionality into a separate p5.Camera object. This done, `orbitControl()` was rebuilt to use the p5.Camera object [here](https://github.com/processing/p5.js/pull/3088).

![orbitControl() with persistence, panning, y-up-orientation, and zoom](http://www.aidanjnelson.com/files/gsoc-wpr-images/orbit-after.gif)

## p5.Camera Reorganization

Reorganizing all camera code into a separate p5.Camera object [here](https://github.com/processing/p5.js/pull/3080) proved useful for two reasons: internally, it further modularized the WebGL codebase, allowing expansion of the camera while simplifying the rendererGL object, and externally, it allowed users to store references to and manipulate a camera object directly. The p5.Camera has several new methods and several 'wrapper' methods which simplify camera control (`pan()`, `tilt()`, `move()`) and the user can now store, manipulate and switch between several p5.Camera objects using the `setCamera()` method.

```javascript
let cam1 = createCamera(); // create an instance of p5.Camera object

cam1.pan(angle); // pans the camera by an angle
cam1.tilt(angle); // tilts the camera by an angle

cam1.move(x, y, z); // moves along the camera's local axes
cam1.setPosition(x, y, z); // sets the camera's position in world-space

let cam2 = cam1.copy(); // create a copy of the camera

setCamera(cam2); // switch between multiple p5.Camera instances
```

#### Unit Tests

This reorganization also required adding p5.Camera object unit tests to the library's mocha/chai automated testing framework. Unit testing was a wholly new subject to me, and the variety of testing approaches touted online (and their various acronyms: TDD, BDD, etc.) was somewhat overwhelming. My mentor Kate was extremely helpful in guiding me through this process, as was a close reading of the existing p5.js unit tests. Unit tests can be found [here](https://github.com/processing/p5.js/pull/3083).

## debugMode()

Because human depth perception is based in numerous visual and contextual clues often absent from 3D sketches -- especially simple sketches without lighting -- it can be challenging for a beginning coder to visualize and understand the 3D coordinate system in a WebGL mode sketch. For my final project of the summer, I began work on a `debugMode()` function to help visualize depth and camera orientation in a 3D sketch. This function allowed a user to add a gridded 'ground' plane and axes icon to their sketch with a single function call. These visual guides will, along with the use of `orbitControl()` make depth and orientation immediately apparent within a sketch. Code for this can be found [here](https://github.com/processing/p5.js/pull/3103).

| ![Are we moving or is the box moving?  Which way is up?](http://www.aidanjnelson.com/files/gsoc-wpr-images/noDebugMode.gif) | ![Easier to identify orientation and movement with debugMode()](http://www.aidanjnelson.com/files/gsoc-wpr-images/debugMode.gif) |
| :-------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: |
|                                    Are we moving or is the box moving? Which way is up?                                     |                                   Easier to identify orientation and movement with debugMode()                                   |

## Summary

A full list of my contributions to the WebGL branch can be found [here](https://github.com/processing/p5.js/commits/webgl-gsoc-2018?author=aidannelson) and my merged pull requests can be found [here](https://github.com/processing/p5.js/pulls?q=is%3Apr+is%3Amerged+author%3AAidanNelson).

Working on this project for p5.js has been an incredible learning experience and a joy.  I am extremely grateful to the Processing community and especially to my mentor, Kate Hollenbach, for a summer's worth of guidance, debugging, git tutorials, WebGL articles and support.  Thank you!
