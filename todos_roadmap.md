Todos
=====


####1) Alpha release of library implementing: 
+ Current Processing API, leaving out 3D, Lights, Camera, Shaders, and any other functions that don't make sense for web/canvas. -- https://github.com/lmccart/processing-js/blob/master/api.md
+ Extensions API allowing basic interface to access and manipulate DOM, set CSS and HTML properties. -- https://github.com/lmccart/processing-js/blob/master/extensions.md

####2) ~10 examples demonstrating:
+ Basic graphics drawing in canvas (translating from current processing to js version).
+ Drawing with multiple canvases.
+ Creating additional DOM elements (createElement, createImage).
+ Handling input for multiple elements, attaching listeners.
+ Setting style (with links to good CSS references).
+ Mixing in native JS and including other libraries (with links to good JS references).
+ Console / debugging, how to print and inspect an object.

####3) Documentation including:
+ Getting started instructions with Sublime Text 2 and Light Table (TBD -- Is there a simpler / better option?)
+ Changes from current Processing API, overview of what is / is not supported and major differences between the two versions.
+ Overview of extensions API, basic philosophy behind it.
+ Summary of research / links to precedents. -- https://github.com/lmccart/processing-js/wiki

####Other things I'd like to explore further:
+ Spec / process for contributing additional libraries (ex: forms/input, sound, video).
+ Processing specific IDE, maybe building off of Jürg's ACE-based editor, or integrating more deeply with Light Table.
+ Module that checks browser capabilities, potentially integrating with documentation so individual pages viewed in browser tell you whether the functions are supported.
+ Adding WebGL renderer and 3D.
+ Think about better / standardized error handling in functions, come up with a general format for this -- later on, it will interface with new IDE.

