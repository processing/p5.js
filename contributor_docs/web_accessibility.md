# p5.js Web Accessibility

This document describes the structure of the web accessibility features of p5.js for p5.js contributors and maintainers—and any other interested parties. If you're interested in making your sketches [screen reader](https://en.wikipedia.org/wiki/Screen_reader) accessible, [visit this tutorial]() instead.

## Overview

p5.js has several functions that make the canvas more accessible to screen readers. The canvas HTML element is a bitmap and does not provide any screen reader acessible information on the shapes drawn on it. Current p5.js functions that support canvas accessibility create fallback content in the sub DOM of the canvas.

Currently, p5.js supports library generated screen reader accessible outputs for basic shapes on the canvas (with `textOutput()` and `gridOutput()`) and user-generated screen reader accessible descriptions of canvas content (with `describe()` and `describeElement()`). 

## Accessible outputs for basic shapes

Supported accessible outputs for basic shapes include text and grid outputs. 

<code class="language-javascript">textOutput()</code> creates a screenreader accessible output that describes the shapes present on the canvas. The general description of the canvas includes canvas size, canvas color, and number of elements in the canvas (example: 'Your output is a, 400 by 400 pixels, lavender blue canvas containing the following 4 shapes:'). This description is followed by a list of shapes where the color, position, and area of each shape are described (example: "orange ellipse at top left covering 1% of the canvas"). Each element can be selected to get more details. A table of elements is also provided. In this table, shape, color, location, coordinates and area are described (example: "orange ellipse location=top left area=2").

 <code class="language-javascript">gridOutput()</code>, formerly called table output, lays out the content of the canvas in the form of a grid (html table) based on the spatial location of each shape. A brief description of the canvas is available before the table output. This description includes: color of the background, size of the canvas, number of objects, and object types (example: "lavender blue canvas is 200 by 200 and contains 4 objects - 3 ellipses 1 rectangle"). The grid describes the content spatially, each element is placed on a cell of the table depending on its position. Within each cell an element the color and type of shape of that element are available (example: "orange ellipse"). These descriptions can be selected individually to get more details. A list of elements where shape, color, location, and area are described (example: "orange ellipse location=top left area=1%") is also available.
 
### Outputs structure
Although <code class="language-javascript">textOutput()</code> and <code class="language-javascript">gridOutput()</code> are located in `src/accessibility/outputs.js`, the outputs are created and updated using functions distributed across the library. This section details how the different functions that support the accessible ouputs work.

#### outputs.js
`src/accessibility/outputs.js` includes the core functions that create the accessible outputs. These functions include:
* `textOutput()`: This function activates the text output by setting `this._accessibleOutputs.text` to `true` and calling `_createOutput('textOutput', 'Fallback')`. If `LABEL` is passed as a parameter the function also activates the text output label by setting `this._accessibleOutputs.textLabel` as `true` and calls `_createOutput('textOutput', 'Label')` for the label.
* `gridOutput()`: This function activates the grid output by setting `this._accessibleOutputs.grid` to `true` and calling `_createOutput('gridOutput', 'Fallback')`. If `LABEL` is passed as a parameter the function also activates the grid output label by setting `this._accessibleOutputs.textLabel` as `true` and calls `_createOutput('gridOutput', 'Label')` for the label.
* `_createOutput()`: This function creates the HTML structure for all accessible outputs. Depending on the type and display of the outputs the HTML structure created varies. The function also initializes `this.ingredients` which stores all the data for the outputs including: shapes, colors, and pshapes (which stores a string of the previous shapes of the canvas). It also creates `this.dummyDOM` if it doesn't exist. `this.dummyDOM` stores the HTMLCollection of DOM elements inside of `<body>`.
* `_accsBackground()`: Is called at the end of `background()`. It resets  `this.ingredients.shapes` and if the color of the background is different than before it calls `_rgbColorName()` to get the name of the color and store it in `this.ingredients.colors.background`
* `_accsCanvasColors`: Is called at the end of fill() and stroke(). This function updates the fill and stroke colors by saving them in `this.ingredients.colors.fill` and `this.ingredients.colors.stroke`. It also calls `_rgbColorName()` to get the names of the colors.
* `_accsOutput()`: Builds `this.ingredients.shapes` which includes all the shapes that are used for creating the outputs. This function is called at the end of the basic shape functions (see accessible output beyond src/accessibility). Depending on the shape that calls it, `_accsOutput()` may call `_getPos()`, `dist()`, `_getArea()`, `_getMiddle()`, `_canvasLocator()` to gather all the information about that shape that will be needed to create the outputs.
* `_getMiddle()`: Returns the middle point or centroid of rectangles, arcs, ellipses, triangles, and quatrilaterals. This function is not part of the prototype.
* `_getMiddle()`: Returns the position of a shape on the canvas (e.g.: 'top left', 'mid right'). This function is not part of the prototype.
* `_canvasLocator()`: Returns location of the shape on a 10*10 grid mapped to the canvas. This function is not part of the prototype.
* `_updateAccsOutput()`: Is called at the end of setup and draw if using acessibleOutputs and calls update functions of outputs(`_updateGridOutput` and `_updateTextOutput`).
* `_addAccsOutput()`: This function returns true when accessibleOutputs are true.


Several functions across the p5.js library call functions in output.js when `this._accessibleOutputs.text` or `this._accessibleOutputs.text` are `true`:
* `_accsOutput()` is called in:
  * `p5.prototype.triangle()`
  * `p5.prototype._renderRect()`
  * `p5.prototype.quad()`
  * `pp5.prototype.point()`
  * `p5.prototype.line()`
  * `p5.prototype._renderEllipse()`
  * `p5.prototype.arc()`
* `_updateAccsOutput()` is called in:
  * `p5.prototype.redraw()`
  * `p5.prototype.resizeCanvas()`
  * `this._setup`
* `_accsCanvasColors()` is called in:
  * `p5.Renderer2D.prototype.stroke()`
  * `p5.Renderer2D.prototype.fill()`
* `__accsBackground()` is called in:
  * `p5.Renderer2D.prototype.background()`

#### textOutput.js
#### gridOutput.js
#### color_namer.js

## User-generated descriptions

### describe()
The `describe()` function creates a screen reader accessible description for the canvas.The first parameter should be a string with a description of the canvas. The second parameter is optional. If specified, it determines how the description is displayed. All descriptions become part of the sub DOM of the canvas element. If a user passes `LABEL` as a second paramater, an aditionally div with the description adjacent to the canvas. 

`describe()` is supported by several functions in src/accessibility/describe.js:
* `_descriptionText()`: checks that text is not `LABEL` or `FALLBACK` and ensures text ends with punctuation mark. If the text does not end with '.', ',', ';', '?', '!', this function adds a '.' at the end of the string. Returns text.
* `_describeFallbackHTML()`: Creates fallback HTML structure for the canvas. 
* `_describeLabelHTML()`: This function is only called when the second paramater of `_describe()` is `LABEL`. It creates a div adjacent to the canvas element for the description text.

### describeElement()
The `_describeElement()` function creates a screen reader accessible description for sketch elements or groups of shapes that create meaning together. The first parameter should be a string with a description of the canvas. The second parameter is optional. If specified, it determines how the description is displayed. All descriptions become part of the sub DOM of the canvas element. If a user passes `LABEL` as a second paramater, an aditionally div with the description adjacent to the canvas. 

`_describe()` is supported by several functions in src/accessibility/describe.js:
*
*
*

## Next Steps

Coming soon!
