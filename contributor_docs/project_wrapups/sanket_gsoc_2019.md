# Improving WebGL functionality
#### By Sanket Singh([@sanketsingh24](https://github.com/sanketsingh24))

### Overview
During this Google Summer of Code, I worked with my mentor [Adam Ferriss](https://github.com/aferriss) to improve the current functionality of p5.js. I mainly focused on the lighting functionalities, and implemented five new functions for the artists, along with one new function related to camera functionality. I also tried to improve the shaders and modified them heavily.

### Contributions
During the course of Summer of Code, I submitted 7 pull requests which were related to my work. Those are-
- [A new parser to load STL files using loadModel()](https://github.com/processing/p5.js/pull/3675)
- [lightFalloff()](https://github.com/processing/p5.js/pull/3786)
- [emissiveMaterial()](https://github.com/processing/p5.js/pull/3820)
- [specularColor()](https://github.com/processing/p5.js/pull/3843)
- [spotLight()](https://github.com/processing/p5.js/pull/3913)
- [frustum()](https://github.com/processing/p5.js/pull/3927)
- [noLights()](https://github.com/processing/p5.js/pull/3955)

Apart from implementing these functions, I also added unit tests, manual tests, documentation, and inline example for each of these functions. While documentation and inline example for each function can be found [here](https://p5js.org/reference/), [unit tests](https://github.com/processing/p5.js/tree/main/test/unit) and [manual tests](https://github.com/processing/p5.js/tree/main/test/manual-test-examples) are present in the codebase and are evaluated every time the library is built.

Before and during the Summer of Code, I fixed minor bugs unrelated to my project, which helped me immensely to understand and get around the codebase and the workflow of p5.js. They are listed [here](https://github.com/processing/p5.js/pulls?utf8=%E2%9C%93&q=is%3Apr+author%3Asanketsingh24).

### [lightFalloff()](https://p5js.org/reference/#/p5/lightFalloff)
This function allows the user to set the attenuation values, which are used in shaders to restrict the spread of light. Earlier, this was a constant value. Now, the artists can use this function to set the value themselves. Implementing this function required me to add three new uniforms, as well as modifying the light shader and light.js. The default was set to 1.

### [emissiveMaterial()](https://github.com/processing/p5.js/pull/3820)
This function adds a new type of material to p5.js. This material doesn't react to lights and behaves in a way which makes it seem the material is glowing. This function doesn't make the material to emit light itself. Implementation required a new uniform to store the color of the material and modifying the shaders. The function itself is implemented in material.js.

### [specularColor()](https://github.com/processing/p5.js/pull/3843)
This function attempts to divide the diffuse color and specular color for the materials. If the artist wants to use specific colors for the specular highlight, they can call this function before the actual light function to affect it. Earlier, the specular highlight's color could only be effected by modifying the material's color, which is not the case now. Specular color can be attached to the light itself. Implementation required four new uniforms. The function was implemented in light.js. If this function is not used before any lighting method, the default value was set to (255, 255, 255) so to not make this a breaking change.

### [spotLight()](https://github.com/processing/p5.js/pull/3913)
This function implements a new kind of light for p5.js which was not present before. This light emits from a point in a specified direction, with the light having a spread, calculated from a given angle, and a concentration value, which concentrates the light towards the center. Angle and concentration were set to default to PI/3 and 100 respectively. The function was implemented in light.js and six new uniforms were added. One of the challenges I faced was to parse the input, not only due to several parameters, but the format of color, location, and direction of light can be provided as p5.Color and p5.Vector objects.

### [frustum()](https://github.com/processing/p5.js/pull/3927)
This function helps you to change the camera perspective. Earlier, the artists could use perspective() to set the camera, but the new camera would always be symmetric. This function can help you to set asymmetric cameras. Implemented in p5.Camera.js, this function is extended as a prototype of p5.Camera object.

### [noLights()](https://github.com/processing/p5.js/pull/3955)
This function removes all the lighting from the sketch which were called before this method. It will reset the lighting from the sketch for the subsequent materials. Calling the lighting methods will re-enable the lighting. It affects `ambientLight()`, `specularColor()`, `directionalLight()`, `pointLight()`, `spotLight()`, `lightFalloff()`, and `shininess()`. It was implemented in light.js.

### Future
- Currently, the library can only make WebGL geometries of a single material. We can expand the shaders so that geometries can be made up of multiple materials and their property. This suggestion is filed as a [issue](https://github.com/processing/p5.js/issues/3806) in the repository.
- p5 Object can be simplified to make it easier for contributors can go through. [For example, all the lighting variables can be bundled inside of a single property which is easier to interpret](https://github.com/processing/p5.js/pull/3843#pullrequestreview-270874570).

### Acknowledgement
The success and outcome of this project required a lot of guidance and assistance from my mentor, [Adam Ferriss]((https://github.com/aferriss)) and I am extremely privileged to have got this all along with the completion of my project. All that I have done is only due to such supervision and assistance and I would not forget to thank him. Also, kudos to all the members of the Processing Foundation and my fellow contributors for making this summer enjoyable and contributing to open source a pleasure. Also, a big thanks to Google for this wonderful program.