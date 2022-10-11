# Resolving Bugs and Expanding Documentation for WebGL in p5.js

For my Google Summer of Code 2022 project I worked with my mentor, Kate Hollenbach to add to documentation concerning WebGL functionality in p5.js. Through discussions with my mentor, this project became primarily focused on the creation of four tutorials to be included in the p5.js website, in addition to some contributions concerning accessibility of WebGL website examples.

## Code

[PR for the addition of describe() to all WebGL references and examples] (https://github.com/processing/p5.js/pull/5706)
[PR containing all code and conversation relating to the tutorials] (https://github.com/processing/p5.js-website/pull/1268)
[PR for the standalone texture feedback example] (https://github.com/processing/p5.js-website/pull/1246)
[PR for the addition of .gitattributes] (https://github.com/processing/p5.js-website/pull/1238)
[PR for miscellaneous example fixes] (https://github.com/processing/p5.js-website/pull/1282)

## Contributions

Prior to my involvement with GSOC I didn’t have much experience or knowledge of the contribution process for projects like p5.js. I began the project by looking through the existing documentation and example content for WebGL features. This led to me making a number of improvements to the examples, primarily concerning tweaks to the examples to make them more illustrative and up-to-date, as well as the introduction of a texture feedback effect example. 

This was followed by the addition of describe() text to all WebGL examples, making these examples more usable for people who rely on screen readers, as well as increasing the visibility of the describe() method so that more developers will know it exists and how it should be used. During this process I began to have issues with some of the developer tooling for p5.js-website, which I addressed by contributing a .gitattributes file that resolved some line ending issues that were making development on Windows difficult. 

Through discussions with my mentor, it became clear that the existing WebGL tutorials were in need of expansion and updating. I began writing a "Getting Started with WebGL" tutorial that covers introductory concepts for working with WebGL and 3D within p5.js. This tutorial covered setup, 3D transformations, lighting, materials, geometry, and basic shader programming. After the addition of further content and examples it became clear that this tutorial should be broken into four separate tutorials with the following structure: 

Introduction to WebGL in p5.js
* Getting Started in 3D 
        * Basic concepts
        * Coordinates
        * Transformations
        * Basic geometry and primitives 
* Creating Custom Geometry 
        * Loading models from files
        * Creating geometry procedurally 
* Styling and Appearance 
        * Camera
        * Material
        * Lighting 
        * Textures
* Introduction to Shaders
        * Background
        * Basic syntax and concepts 
        * Basic use in p5.js
        * Uniforms
        * Further reading

Each of these tutorials include various illustrations, interactive examples, and text. While writing these tutorials I also spent time becoming more familiar with the library, as well as reading similar tutorials for other libraries and toolkits. 

Following the writing of these tutorials I also prepared them for internationalization, which involved the creation of template files with tags that can be updated by translators in other languages. 

The tutorials can be found on the p5.js websites Learn section here (to be added):

And the code and commits for these contributions can be found at (to be added):

##Acknowledgements 

I want to express my gratitude towards my mentor Kate Hollenbach for her guidance throughout this project, as well as towards the p5.js community for its openness and helpfulness. 
