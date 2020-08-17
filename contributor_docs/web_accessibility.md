# p5.js Web Accessibility

This document describes the structure of the web accessibility features of p5.js for p5.js contributors and maintainers—and any other interested parties. If you're interested in making your sketches [screen reader](https://en.wikipedia.org/wiki/Screen_reader) accessible, [view this tutorial]() instead.

## Overview

p5.js has several functions that make the canvas more accessible to screen readers. The canvas HTML element is a bitmap and does not provide any screen reader acessible information on the shapes drawn on it. Current p5.js functions that support canvas accessibility create fallback content in the sub DOM of the canvas.

Currently, `_describe()` and describeElement() create user-generated screen reader accessible descriptions of canvas content and textOutput() and gridOutput() create automated descriptions of basic shapes on the canvas. 

### describe()
The `_describe()` function creates a screen reader accessible description for the canvas.The first parameter should be a string with a description of the canvas. The second parameter is optional. If specified, it determines how the description is displayed. All descriptions become part of the sub DOM of the canvas element. If a user passes `LABEL` as a second paramater, an aditionally div with the description adjacent to the canvas. 

`_describe()` is supported by several functions in src/accessibility/describe.js:
* `_descriptionText()`: checks that text is not `LABEL` or `FALLBACK` and ensures text ends with punctuation mark. If the text does not end with '.', ',', ';', '?', '!', this function adds a '.' at the end of the string. Returns text.
* `_describeFallbackHTML()`: Creates fallback HTML structure for the canvas. 
* `_describeLabelHTML()`: This function is only called when the second paramater of `_describe()` is `LABEL`. It creates a div adjacent to the canvas element for the description text.

### describeElement()
The `_describeElement()` function creates a screen reader accessible description for sketch elements or groups of shapes that create meaning together. The first parameter should be a string with a description of the canvas. The second parameter is optional. If specified, it determines how the description is displayed. All descriptions become part of the sub DOM of the canvas element. If a user passes `LABEL` as a second paramater, an aditionally div with the description adjacent to the canvas. 

`_describe()` is supported by several functions in src/accessibility/describe.js:
* `_descriptionText()`: checks that text is not `LABEL` or `FALLBACK` and ensures text ends with punctuation mark. If the text does not end with '.', ',', ';', '?', '!', this function adds a '.' at the end of the string. Returns text.
* `_describeFallbackHTML()`: Creates fallback HTML structure for the canvas. 
* `_describeLabelHTML()`: This function is only called when the second paramater of `_describe()` is `LABEL`. It creates a div adjacent to the canvas element for the description text.


## Next Steps

Coming soon!
