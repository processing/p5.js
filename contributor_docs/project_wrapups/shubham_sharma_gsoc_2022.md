# GSoC-2022-Wrap-Up

## Improving p5.js WebGL functionality

#### by Shubham Kumar Sharma([@ShenpaiSharma](https://github.com/ShenpaiSharma)) | GSoC 2022

### Overview

The primary purpose over the course of this summer through GSoC 2022 was to focus on the refactoring of the WebGL rendering pipeline so that multiple materials can be applied to geometry simultaneously and implementing the missing feature of certain geometry in WebGL mode like corner radius is not accepted for the rectangle in WebGL mode, etc. 

Key areas of my proposals were -
- Correcting the inappropriate behavior of certain geometry in WebGL mode.
- Refactoring of the WebGL rendering pipeline so that multiple materials can be applied to geometry. 


### Task Details
## Correcting the inappropriate behavior of rect() in WebGL: [PR](https://github.com/processing/p5.js/pull/5789)

I started my GSoC 2022 work by addressing [#issue5001](https://github.com/processing/p5.js/issues/5001), rect() function takes eight parameters in which the last four parameters define the determined corner radius for the top-left, top-right, lower-right, and lower-left corners, respectively. But, even after passing these parameters, the rect() does nothing in WebGL mode. It could be confusing for beginners as, currently, p5.js doesn’t show errors related to it.

We took the approach that processing follows to implement rounded corners of a rectangle, i.e., using immediate mode; thus, we implemented it using vertex and quadraticVertex().

```
function setup() {
 // Create the canvas
 createCanvas(720, 400, WEBGL);
 background(200);
 
 // Set colors
 fill(204, 101, 192, 127);
 stroke(127, 63, 120);
 
 // A rectangle
 rect(-100, -100, 200, 80, 40, 1, 5, 1);
}
 

```

Before:
![image](https://user-images.githubusercontent.com/47415702/189298839-4aac32dc-f74e-4f21-8637-05f2b2c22c82.png)

After:
![image](https://user-images.githubusercontent.com/47415702/189298948-55e9306a-8a5e-4a82-b208-dbdc725365d8.png)

### Future Work:
While using higher strokeWeight, it starts showing artifacts, for more minor strokeWeight it looks fine; this issue actually exists while using the thicker strokeWeight, so for this, we need to look upon the stroke renderer much more closely.

![image](https://user-images.githubusercontent.com/47415702/189299200-25d111b6-b135-4573-8659-f24f6ea8d67c.png)


## Multiple Materials applied to Geometry: [PR](https://github.com/processing/p5.js/pull/5774)
Each object reacts to light differently in the real world. Steel items, for example, are often shinier than clay vases, and wooden containers do not respond to light in the same way that steel containers do. Some objects absorb light with little scattering, resulting in small specular highlights, while others scatter widely, resulting in a greater radius for the highlight. 

So finally, we have decided to move away from the current overwriting of fill colors to the geometry towards the approach that Processing uses where the material has different color properties (ambient, emissive, specular) that all contribute separately to the lighting of the surface.

So we have implemented a few new uniforms (uSpecularMatColor, uAmbientMatColor, uEmissiveMatColor), which store the RGB colors and fill the geometry with different color properties and thus contributing separately to the lighting of the surface.

Code:

```
function setup() {
 createCanvas(600, 600, WEBGL);
 smooth(8);
 noStroke();
}
function draw() {
 background(0);
 
 ambientLight(128, 128, 128);
 
 directionalLight(128, 128, 128, cos(frameCount * 0.1), 1, -1);
 
 push();
 translate(-width * 0.25, 0, 0);
 
 ambientMaterial(255, 0, 0);
 specularMaterial(0, 0, 0);
 sphere(width * 0.2);
 
 pop();
 
 push();
 translate(width * 0.25, 0, 0);
 
 ambientMaterial(255, 0, 0);
 specularMaterial(255, 255, 255);
 sphere(width * 0.2);
 
 pop();
}
 
 
```
Before:

![image](https://user-images.githubusercontent.com/47415702/189299616-9e047451-0d3c-4cb8-b04d-aa37ae1f3572.png)

After:

![image](https://user-images.githubusercontent.com/47415702/189299695-92683040-c3e8-46e8-9fe3-331681535e33.png)


Effect of combining all the material propertied like fill(), ambientMaterial(), SpecularMaterial() and emissiveMaterial() over geometry now results in:

![image](https://user-images.githubusercontent.com/47415702/189299930-430735df-3aaa-46b5-8b4c-7fb1c7db6362.png)

### Pull Requests:
- Added round corner property for rect() in WebGL mode. [PR#5789](https://github.com/processing/p5.js/pull/5789)

- Feature Implemented -- Multiple Material support for geometry [PR#5774](https://github.com/processing/p5.js/pull/5774)

## Conclusion & Acknowledgements
Thanks to my mentor [@calebfoss](https://github.com/calebfoss) for all the guidance and feedback throughout the project, other contributors of p5.js, and the whole processing community for showing immense support and an encouraging environment, which helped me exceed my own expectations! Thank you so much 😄