# Improving p5.js WebGL/3d functionality

#### By Aryan Koundal(@AryanKoundal)
#### Mentored by : Dave Pagurek(@davepagurek ), Tanvi Kumar(@TanviKumar )

## Overview

In p5.js, there are two render modes: P2D (default renderer) and WebGL. WEBGL 
enables the user to draw in 3D. There are many ways to implement lighting. 
Currently, p5js has implemented 8. To add lighting to a 3D object, one can
use these functionalities. But there is another technique to light objects,
not by direct light, but using the surrounding environment as a single light
source, which we call Image-Based lighting. 
This project aims to add lighting to a 3D object, using the surrounding 
environment as a single light source, which is generally called Image-Based 
lighting. In simple words, one can very quickly drop in an image from real 
life to use as surrounding lights, rather than continuously tweaking the colors 
and positions of ambient, point, etc lights.

1. Diffused IBL
    1. Create scene's irradiance.
    1. Calculation of Scene’s irradiance for any direction.
        1. Sample the scene’s radiance from all possible directions, within the
        hemisphere, for each fragment.
        1. Take a finite number of samples of the scene's irradiance and pre-compute them.
        1. Create a pre-computed irradiance map.
    1. Sample the pre-computed irradiance map to retrieve diffuse irradiance.
1. Specular IBL
    1. We need to preconvolute it.
    1. Use split sum approximation to divide the specular part into 2 further parts
        1. First one is a prefiltered environment map.
            1. Finalize Pre filter convolution using low discrepancy hammersley sequence 
            and sample generation defined.
            1. Capturing prefilter mipmap levels, storing the results in prefiltered 
            environment cubemap
        1. Second one is BDRF 
            1. pre -calculate the BRDF’s response given input as roughness and angle
            between n and wi. 
                Precalculations done using BRDF’S geometry function and Fresnel-Schlicks approximation.
            1. Stored in 2D lookup texture known as BRDF integration map.
    1. Combine the  prefiltered environment map and  BRDF integration map
1. Combine the diffused and specular parts


## Current State of The Project

The project is completed and here are some screenshots and videos demonstrating the work.

#### Image of Example 1 
![example 1](https://github.com/processing/p5.js/assets/77334487/8d818df0-17a8-4332-b369-bcb79a5afc67)

#### Video of Example 1
https://github.com/processing/p5.js/assets/77334487/44b30c77-33c1-41d0-ada5-282424978832

#### Image oF Example 2
![example 2](https://github.com/processing/p5.js/assets/77334487/e46f24b8-2713-4d2b-8392-744585da6a5b)

#### Video of Example 2
https://github.com/processing/p5.js/assets/77334487/a0a6b3f9-b25b-451f-961e-b2970cb9e907

## Pull Request

- Pull Request: https://github.com/processing/p5.js/pull/6255
- Work Reports:
    - [p5js Week 1 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-1-report-gsoc23-processing-foundation-9910934112e5)
    - [p5js Week 2 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-2-report-gsoc23-processing-foundation-c8a36f5cf34)
    - [p5js Week 3 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-3-report-gsoc23-processing-foundation-39043d0363e2)
    - and more...


## Work Done

### src/webgl/light.js
1. This includes the function `imageLight()` which provides the whole functionality.
1. 2 Examples for the `imageLight()` are also included in this files.
 
### src/webgl/p5.RendererGL.js
1. This includes 2 new maps, which are diffusedTextures and specularTextures for storing the p5 graphics.
1. Then the function `getDiffusedTexture()` which gets called from _setImageLightUniforms. It's function is to create a blurry 
image from the input non blurry img, if it doesn't already exist.
1. Also the function `getSpecularTexture()` which also gets called from _setImageLightUniforms. It's function is too create a texture
 from the input non blurry image, if it doesn't already exist
1. Then the function `_setImageLightUniforms()`. It creates the textures and sets those textures in the shader being processed.

### src/webgl/p5.Texture.js
1. This includes the `MipmapTexture` class.

 
### src/webgl/shaders/imageLight.vert
1. It is a vertex shader only for the image Light feature.
 
### src/webgl/shaders/imageLightDiffused.frag
1. It is the Fragment shader for the calculations of the Diffused Part of Image Light.
 
### src/webgl/shaders/imageLightSpecular.frag
1. It is the Fragment shader for the calculations of the Specular Part of Image Light.
1. It has the functions `HammersleyNoBitOps()` , `VanDerCorput()`and `ImportanceSampleGGX()` which are
referenced from "https://learnopengl.com/PBR/IBL/Specular-IBL"

### src/webgl/shaders/lighting.glsl
1. This includes `calculateImageDiffuse()` and `calculateImageSpecular()` which actually calculates the output textures. These are calculated only when `imageLight()` is called.

### List of All shaders modified to improve webGL compatibility to newer versions
1. src/webgl/shaders/basic.frag
1. src/webgl/shaders/immediate.vert
1. src/webgl/shaders/light.vert
1. src/webgl/shaders/light_texture.frag 
1. src/webgl/shaders/line.frag
1. src/webgl/shaders/line.vert
1. src/webgl/shaders/normal.frag
1. src/webgl/shaders/normal.vert
1. src/webgl/shaders/phong.frag
1. src/webgl/shaders/phong.vert
1. src/webgl/shaders/point.frag
1. src/webgl/shaders/point.vert
1. src/webgl/shaders/vertexColor.frag
1. src/webgl/shaders/vertexColor.vert

### Sketches I made, which might be useful 
1. Example 1 in imagelight          https://editor.p5js.org/aryan_koundal/sketches/OEsyk6uZI
1. Example 2 in imagelight         https://editor.p5js.org/aryan_koundal/sketches/XjalPP7s4
1. Final Prototype Diffused + Roughness (Variable Roughness)  https://editor.p5js.org/aryan_koundal/sketches/4V790dB9Z
1. Diffuse light final prototype https://editor.p5js.org/aryan_koundal/sketches/q_Zg37OB2
1. Mipmap  Specular roughness Prototype (visible variation) https://editor.p5js.org/aryan_koundal/sketches/Bi2BN7zjK
1. Specular prefilterconvolution with chessboard https://editor.p5js.org/aryan_koundal/sketches/qaIhxRZHI
1. Prefilterconvolution cubemaps prototypes 8 levels https://editor.p5js.org/aryan_koundal/sketches/YJTSFKhqt
1. Specular prefilterconvolution with image https://editor.p5js.org/aryan_koundal/sketches/8divJgdQxO
1. Specular mipmaps prototype with colors https://editor.p5js.org/aryan_koundal/sketches/3V9iDH8ax
1. Sphere with point Lights https://editor.p5js.org/aryan_koundal/sketches/9NdeCtfdW
1. Diffused texture Shader Prototype https://editor.p5js.org/aryan_koundal/sketches/DcFDcOFUn
1. Resolution Pixelwise             https://editor.p5js.org/aryan_koundal/sketches/5RfDIy2I9
1. Cube reflecting mountain spheremap https://editor.p5js.org/aryan_koundal/sketches/2QS5-Fy0V
1. Cube reflecting sky spheremap 	 https://editor.p5js.org/aryan_koundal/sketches/O1NwI4ufp

## Further Improvement
While working on this project, I realised that there is scope for improvement. Like increasing efficiency by using cubemaps instead of environment maps for Diffused Lighting. Also using framebuffers would improve the efficiency and reduce the time taken to render the lights.

## Conclusion

My GSoC experience was genuinely transformative, leading to significant personal and professional
development within the open-source domain. I successfully overcame initial obstacles related to
setting up the project and navigating the codebase, steadily advancing through my contributions.
Throughout this summer, I actively participated in the p5.js open-source community, surpassing my 
initial expectations for my first major open-source venture and further igniting my enthusiasm. I
want to express my heartfelt appreciation to my mentors,  Dave Pagurek(@davepagurek ), and
Tanvi Kumar(@TanviKumar ), for their invaluable guidance in navigating coding challenges. 
Effective teamwork, collaboration, and communication proved essential in this open-source journey.
I eagerly anticipate expanding my contributions and honing my skills. This summer has instilled
a sense of purpose in me, and I'm profoundly grateful for the mentorship and knowledge gained.
