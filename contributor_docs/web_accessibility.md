# p5.js Web Accessibility

This document describes the structure of the web accessibility features of p5.js for contributors and maintainers—and any other interested parties. If you're interested in making your sketches [screen reader](https://en.wikipedia.org/wiki/Screen_reader) accessible, visit the [tutorial](https://p5js.org/learn) or if you want to use p5.js with a screen reader visit the [Using p5.js with a Screen Reader tutorial](https://p5js.org/learn/p5-screen-reader.html).

## Overview

Because the canvas HTML element is a bitmap and does not provide any screen reader accessible information on the shapes drawn on it, p5.js has several functions that make the canvas more accessible to screen readers.

Currently, p5.js supports library generated screen reader accessible outputs for basic shapes on the canvas (with `textOutput()` and `gridOutput()`) and user-generated screen reader accessible descriptions of canvas content (with `describe()` and `describeElement()`).

## Library generated accessible outputs for basic shapes

Supported accessible outputs for basic shapes include text and grid outputs. 

`textOutput()` creates a screen reader accessible output that describes the shapes present on the canvas. The general description of the canvas includes canvas size, canvas color, and number of elements in the canvas (example: 'Your output is a, 400 by 400 pixels, lavender blue canvas containing the following 4 shapes:'). This description is followed by a list of shapes where the color, position, and area of each shape are described (example: "orange ellipse at top left covering 1% of the canvas"). Each element can be selected to get more details. A table of elements is also provided. In this table, shape, color, location, coordinates and area are described (example: "orange ellipse location=top left area=2"). 

`gridOutput()` lays out the content of the canvas in the form of a grid (html table) based on the spatial location of each shape. A brief description of the canvas is available before the table output. This description includes: color of the background, size of the canvas, number of objects, and object types (example: "lavender blue canvas is 200 by 200 and contains 4 objects - 3 ellipses 1 rectangle"). The grid describes the content spatially, each element is placed on a cell of the table depending on its position. Within each cell an element the color and type of shape of that element are available (example: "orange ellipse"). These descriptions can be selected individually to get more details. A list of elements where shape, color, location, and area are described (example: "orange ellipse location=top left area=1%") is also available. 

If a user passes `LABEL` as a parameter in either of these functions, an additional div with the output adjacent to the canvas is created, this is useful for non-screen reader users that might want to display the output outside of the canvas' sub DOM as they code. However, using `LABEL` will create unnecessary redundancy for screen reader users. We recommend using `LABEL` only as part of the development process of a sketch and removing it before publishing or sharing your sketch with screen reader users.
 
### Outputs structure
Although `textOutput()` and `gridOutput()` are located in [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js), the outputs are created and updated using functions distributed across the library. This section details the different functions that support the accessible outputs.

#### outputs.js
[src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) includes the core functions that create the accessible outputs:
* `textOutput()`: This function activates the text output by setting `this._accessibleOutputs.text` to `true` and calling `_createOutput('textOutput', 'Fallback')`. If `LABEL` is passed as a parameter the function also activates the text output label by setting `this._accessibleOutputs.textLabel` as `true` and calls `_createOutput('textOutput', 'Label')` for the label.
* `gridOutput()`: This function activates the grid output by setting `this._accessibleOutputs.grid` to `true` and calling `_createOutput('gridOutput', 'Fallback')`. If `LABEL` is passed as a parameter the function also activates the grid output label by setting `this._accessibleOutputs.textLabel` as `true` and calls `_createOutput('gridOutput', 'Label')` for the label.
* `_createOutput()`: This function creates the HTML structure for all accessible outputs. Depending on the type and display of the outputs the HTML structure created varies. The function also initializes `this.ingredients` which stores all the data for the outputs including: shapes, colors, and pShapes (which stores a string of the previous shapes of the canvas). It also creates `this.dummyDOM` if it doesn't exist. `this.dummyDOM` stores the HTMLCollection of DOM elements inside of `<body>`.
* `_updateAccsOutput()`: Is called at the end of `setup()` and `draw()` if using accessibleOutputs. if `this.ingredients` is different than the current outputs, this function calls the update functions of outputs(`_updateGridOutput` and `_updateTextOutput`). Calling this function only at the end of `setup()` and `draw()` as well as only calling `_updateGridOutput` and `_updateTextOutput` only when the ingredients are different helps avoid overwhelming the screen reader.
* `_addAccsOutput()`: This function returns true when accessibleOutputs are true.
* `_accsBackground()`: Is called at the end of `background()`. It resets  `this.ingredients.shapes` and if the color of the background is different than before it calls `_rgbColorName()` to get the name of the color and store it in `this.ingredients.colors.background`
* `_accsCanvasColors()`: Is called at the end of fill() and stroke(). This function updates the fill and stroke colors by saving them in `this.ingredients.colors.fill` and `this.ingredients.colors.stroke`. It also calls `_rgbColorName()` to get the names of the colors.
* `_accsOutput()`: Builds `this.ingredients.shapes` which includes all the shapes that are used for creating the outputs. This function is called at the end of the basic shape functions (see accessible output beyond src/accessibility). Depending on the shape that calls it, `_accsOutput()` may call helper functions to gather all the information about that shape that will be needed to create the outputs. These functions, which are not part of the prototype, include:
  * `_getMiddle()`: Returns the middle point or centroid of rectangles, arcs, ellipses, triangles, and quadrilaterals.
  * `_getPos()`: Returns the position of a shape on the canvas (e.g.: 'top left', 'mid right').
  * `_canvasLocator()`: Returns location of the shape on a 10*10 grid mapped to the canvas.
  * `_getArea()`: Returns the area of the shape as a percentage of the canvas' total area.
  
When `this._accessibleOutputs.text` or `this._accessibleOutputs.text` are `true` several functions across the p5.js library call functions in output.js:
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
* `_accsBackground()` is called in:
  * `p5.Renderer2D.prototype.background()`

#### textOutput.js
[src/accessibility/textOutput.js](https://github.com/processing/p5.js/blob/main/src/accessibility/textOutput.js) contains all functions that update the text output. The main function in this file is `_updateTextOutput()` which is called by `_updateAccsOutput()` in [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) when `this._accessibleOutputs.text` or `this._accessibleOutputs.textLabel` are `true.`

`_updateTextOutput()` uses `this.ingredients` to build the content of the text output and text output label which include a summary, a list of shapes, and a table of shapes details. If these are different from the current outputs it updates them. Building the output content is supported by several helper functions in the file that are not part of the prototype: 
*  `_textSummary()`: Builds the content of the text output summary.
*  `_shapeDetails()`: Builds the text output table that contains shape details.
*  `_shapeList()`: Builds the list of shapes of the text output.

#### gridOutput.js
[src/accessibility/gridOutput.js](https://github.com/processing/p5.js/blob/main/src/accessibility/gridOutput.js) contains all functions that update the grid output. The main function in this file is `_updateGridOutput()` which is called by `_updateAccsOutput()` in [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js) when `this._accessibleOutputs.grid` or `this._accessibleOutputs.gridLabel` are `true.`

`_updateGridOutput()` uses `this.ingredients` to build the content of the grid output and grid output label which include a summary, a grid that maps the location of shapes and a list of shapes. If these are different from the current outputs it updates them. Building the output content is supported by several helper functions in the file that are not part of the prototype: 
*  `_gridSummary()`: Builds the content of the grid output summary.
*  `_gridMap()`: Builds a grid that maps the location of shapes on the canvas.
*  `_gridShapeDetails()`: Builds the list of shapes of the grid output, each line of the list includes details about the shape.

#### color_namer.js
When creating screen reader accessible outputs, naming the colors used in the canvas is important. [src/accessibility/color_namer.js](https://github.com/processing/p5.js/blob/main/src/accessibility/color_namer.js) contains `_rgbColorName()` a function that receives rgba values and returns a color name. This function is called by `_accsBackground()` and `_accsCanvasColors` in [src/accessibility/outputs.js](https://github.com/processing/p5.js/blob/main/src/accessibility/outputs.js). 

`_rgbColorName()` uses `color_conversion._rgbaToHSBA()` to get the hsv values of the color and then uses `_calculateColor()` to get the color name. The function `_calculateColor()` in this file comes from [colorNamer.js](https://github.com/MathuraMG/color-namer) which was developed as part of a [2018 Processing Foundation fellowship](https://medium.com/processing-foundation/making-p5-js-accessible-e2ce366e05a0) and in consultation with blind screen reader expert users. This function returns color names by comparing hsv values to those stored in the `colorLookUp` array. The function should be updated as some shades of gray are not named correctly. When updating it, it is also important to ensure contributor readability by including comments that explain what each line of code does.

## User-generated accessible canvas descriptions

### describe()
The `describe()` function creates a screen reader accessible description for the canvas. The first parameter should be a string with a description of the canvas. The second parameter is optional. If specified, it determines how the description is displayed. All descriptions become part of the sub DOM of the canvas element. If a user passes `LABEL` as a second parameter, an additional div with the description adjacent to the canvas is created. 

`describe()` is supported by several functions in [src/accessibility/describe.js](https://github.com/processing/p5.js/blob/main/src/accessibility/describe.js):
* `_descriptionText()`: Checks that text is not `LABEL` or `FALLBACK` and ensures text ends with a punctuation mark. If the text does not end with '.', ',', ';', '?', '!', this function adds a '.' at the end of the string. Returns text.
* `_describeHTML()`: Creates fallback HTML structure for the canvas. If the second parameter of `describe()` is `LABEL`, this function creates a div adjacent to the canvas element for the description text.

### describeElement()
The `describeElement()` function creates a screen reader accessible description for sketch elements or groups of shapes that create meaning together. The first parameter should be a string with the name of the element, the second parameter should be a string with the description of the element. The third parameter is optional. If specified, it determines how the description is displayed. All element descriptions become part of the sub DOM of the canvas element. If a user passes `LABEL` as a third parameter, an additional div with the element description adjacent to the canvas is created. 

`describeElement()` is supported by several functions in [src/accessibility/describe.js](https://github.com/processing/p5.js/blob/main/src/accessibility/describe.js):
* `_elementName()`: Checks that element name is not `LABEL` or `FALLBACK` and ensures text ends with a colon. Returns element name.
* `_descriptionText()`: Checks that text is not `LABEL` or `FALLBACK` and ensures text ends with a punctuation mark. If the text does not end with '.', ',', ';', '?', '!', this function adds a '.' at the end of the string. Returns text.
* `_describeElementHTML()`: Creates fallback HTML structure for the canvas. When the second parameter of `describeElement()` is `LABEL`, this function creates a div adjacent to the canvas element for the descriptions.
