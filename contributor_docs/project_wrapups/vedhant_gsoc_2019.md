# **Stabilizing and improving p5.xr during Alpha release**


### **by Vedhant Agarwal ([@Vedhant](https://github.com/vedhant))**

Over the course of the Google Summer of Code 2019 program for The Processing Foundation, I worked along with my mentor [Stalgia Grigg](https://github.com/stalgiag) on the p5.xr library in its pre-alpha stage. p5.xr is a library for p5.js that enables WebXR capabilities with p5 sketches. My work included stabilizing the library, adding unit tests and implementing raycasting feature along with sticky() function to allow rendering a reticle for gaze tracking.


## **Contribution to p5 library**

I started out my open source experience with p5.js during December 2018. To get myself familiarised with p5.js codebase I tried debugging few open issues like [#3571](https://github.com/processing/p5.js/issues/3571) and [#3346](https://github.com/processing/p5.js/issues/3346). My first successful [PR](https://github.com/processing/p5.js/pull/3405) which was merged was a documentation modification. As I was getting more comfortable with p5’s codebase, I got my first [PR](https://github.com/processing/p5.js/pull/3634) merged which implemented a new feature. The feature was the image() function for WEBGL mode. Later, during the community bonding period, I implemented tint feature for WEBGL mode in this [PR](https://github.com/processing/p5.js/pull/3709). Working with this PR made me comfortable with the WEBGL architecture of p5.js.


## **Contribution to p5.xr library**


### **Stabilization and unit testing solution**

I helped solve a bunch of open issues which were crucial to the working of p5.xr library. These issues helped me get absolutely comfortable with p5.xr codebase and get me started with the WEBXR api.



*   [Replacing _update() with _updatexr()](https://github.com/stalgiag/p5.xr/pull/21) \
The library was replacing p5.RendererGL.prototype._update to keep the model view matrix from being reset after ever frame . In order to make sure that p5’s methods are not modified, I made an equivalent function _updatexr() for p5xr.
*   [Pixelation](https://github.com/stalgiag/p5.xr/pull/24) \
This was a critical bug where VR content was not rendering with proper scale on most of the phones. Solving this took a lot of debugging and a little bit of patience.
*   [p5xr Viewer class](https://github.com/stalgiag/p5.xr/pull/28) \
This class provides the feature of specifying the starting position of the viewer and helps in extending features in future. This class served as a template for new classes and functionality to be added in the future.

I also added unit testing environment to p5.xr. I experimented with different unit testing environments and finally decided upon mocha with chai as assertion library and karma as the test runner. The tests run on headless Chrome browser. It was quite challenging because of unexpected errors which was popping out due to WEBXR api in both polyfill and non-polyfill versions. I also wrote a few unit tests to serve as a template for any future unit testing code.


### **Raycasting**

In p5.js, there are no helper functions for raycasting so users must create their own interaction systems. So, I have added raycasting functionality to p5.xr in order to offer interactivity. For instance, gaze tracking becomes possible with the addition of raycasting. Coming up with an api at the beginning was challenging because of the fact that p5 does not keep track of objects. However, a simpler api was then chosen which was inspired from Processing-Android’s api for XR.

In this feature, a ray is cast either from viewer’s eye or user specified position which is then tested for intersection with either a box, sphere or a plane.

The following are the functions for raycasting :



*   [intersectsBox()](https://github.com/stalgiag/p5.xr/pull/49) \
This function checks whether or not the ray intersects a box (with specified dimensions). The box is imaginary and can be thought of as the box which would have been rendered if box() was called in place of intersectsBox().
*   [intersectsSphere()](https://github.com/stalgiag/p5.xr/pull/48) \
This function checks whether or not the ray intersects a sphere (with specified radius). The sphere is imaginary and can be thought of as the sphere which would have been rendered if sphere() was called in place of intersectsSphere().
*   [getRayFromScreen()](https://github.com/stalgiag/p5.xr/pull/48) \
If user does not specify any ray, this function is called to generate a ray emerging from the viewer's eye. The direction of the ray can still be specified by the user.
*   [generateRay()](https://github.com/stalgiag/p5.xr/pull/48) \
Users use this function to create a custom ray which is to be used for raycasting. It will create a ray under the transforms present at the time of this function call. This function allows a ray to be created with respect to a transform and can be used everywhere in the code where the transforms could vary.
*   [intersectsPlane()](https://github.com/stalgiag/p5.xr/pull/50) \
Checks whether a ray intersects a plane and returns the point of intersection. The plane will be the same as calling plane() at the place of this function call but with infinite dimensions.

![dragging](https://vedhant.github.io/gsoc_wpr/grid.gif)


### **sticky() and noSticky()**

The need for this feature came up when I was wondering how to render a circle permanently in the center of the screen to act as a reticle for gaze tracking. The reticle had to be in front of the viewer at all times. So, I made this feature so that any code between [sticky()](https://github.com/stalgiag/p5.xr/pull/52) and noSticky() is rendered in front of the viewer at all times.

This feature can become immensely useful. Reticle for gaze tracking is one example. User has full control on how the reticle reacts when hovered/clicked upon an object, such as changes in color and size. This can also be very useful when the user wants to drag an object in the 3D scene.

![gaze-tracking](https://vedhant.github.io/gsoc_wpr/reticle.gif)


## **Summary**

A full list of my commits to p5.xr can be found [here](https://www.google.com/url?q=https://github.com/stalgiag/p5.xr/commits?author%3Dvedhant&source=gmail&ust=1566566535693000&usg=AFQjCNG5U-KdJSpW0v_3ouqCLTnfYm9Vxw) and my merged pull requests can be found [here](https://github.com/stalgiag/p5.xr/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aclosed+author%3Avedhant+is%3Amerged).

I had an incredible learning experience with working on p5.xr library. The prominent reason being that as this library was in pre-alpha stage, I was able to contribute a big fraction of the codebase and learned how a library should be developed at early stages. I am immensely grateful to my mentor, [Stalgia Grigg](https://github.com/stalgiag), for providing all the valuable guidance and help throughout the summer as well as the p5 community for providing me such an opportunity. Thank you!
