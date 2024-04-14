/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Creates a screen reader-accessible description for shapes on the canvas.
 * `textOutput()` adds a general description, list of shapes, and
 * table of shapes to the web page.
 *
 * The general description includes the canvas size, canvas color, and number
 * of shapes. For example,
 * `Your output is a, 100 by 100 pixels, gray canvas containing the following 2 shapes:`.
 *
 * A list of shapes follows the general description. The list describes the
 * color, location, and area of each shape. For example,
 * `a red circle at middle covering 3% of the canvas`. Each shape can be
 * selected to get more details.
 *
 * `textOutput()` uses its table of shapes as a list. The table describes the
 * shape, color, location, coordinates and area. For example,
 * `red circle location = middle area = 3%`. This is different from
 * <a href="#/p5/gridOutput">gridOutput()</a>, which uses its table as a grid.
 *
 * The `display` parameter is optional. It determines how the description is
 * displayed. If `LABEL` is passed, as in `textOutput(LABEL)`, the description
 * will be visible in a div element next to the canvas. Using `LABEL` creates
 * unhelpful duplicates for screen readers. Only use `LABEL` during
 * development. If `FALLBACK` is passed, as in `textOutput(FALLBACK)`, the
 * description will only be visible to screen readers. This is the default
 * mode.
 *
 * Read
 * <a href="/learn/labeling-canvases.html">How to label your p5.js code</a> to
 * learn more about making sketches accessible.
 *
 * @method textOutput
 * @param  {(FALLBACK|LABEL)} [display] either FALLBACK or LABEL.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   // Add the text description.
 *   textOutput();
 *
 *   // Draw a couple of shapes.
 *   background(200);
 *   fill(255, 0, 0);
 *   circle(20, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle and a blue square on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Add the text description and
 *   // display it for debugging.
 *   textOutput(LABEL);
 *
 *   // Draw a couple of shapes.
 *   background(200);
 *   fill(255, 0, 0);
 *   circle(20, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle and a blue square on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   // Add the text description.
 *   textOutput();
 *
 *   // Draw a moving circle.
 *   background(200);
 *   let x = frameCount * 0.1;
 *   fill(255, 0, 0);
 *   circle(x, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle moves from left to right above a blue square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   // Add the text description and
 *   // display it for debugging.
 *   textOutput(LABEL);
 *
 *   // Draw a moving circle.
 *   background(200);
 *   let x = frameCount * 0.1;
 *   fill(255, 0, 0);
 *   circle(x, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle moves from left to right above a blue square.');
 * }
 * </code>
 * </div>
 */

p5.prototype.textOutput = function(display) {
  p5._validateParameters('textOutput', arguments);
  //if textOutput is already true
  if (this._accessibleOutputs.text) {
    return;
  } else {
    //make textOutput true
    this._accessibleOutputs.text = true;
    //create output for fallback
    this._createOutput('textOutput', 'Fallback');
    if (display === this.LABEL) {
      //make textOutput label true
      this._accessibleOutputs.textLabel = true;
      //create output for label
      this._createOutput('textOutput', 'Label');
    }
  }
};

/**
 * Creates a screen reader-accessible description for shapes on the canvas.
 * `gridOutput()` adds a general description, table of shapes, and list of
 * shapes to the web page.
 *
 * The general description includes the canvas size, canvas color, and number of
 * shapes. For example,
 * `gray canvas, 100 by 100 pixels, contains 2 shapes:  1 circle 1 square`.
 *
 * `gridOutput()` uses its table of shapes as a grid. Each shape in the grid
 * is placed in a cell whose row and column correspond to the shape's location
 * on the canvas. The grid cells describe the color and type of shape at that
 * location. For example, `red circle`. These descriptions can be selected
 * individually to get more details. This is different from
 * <a href="#/p5/textOutput">textOutput()</a>, which uses its table as a list.
 *
 * A list of shapes follows the table. The list describes the color, type,
 * location, and area of each shape. For example,
 * `red circle, location = middle, area = 3 %`.
 *
 * The `display` parameter is optional. It determines how the description is
 * displayed. If `LABEL` is passed, as in `gridOutput(LABEL)`, the description
 * will be visible in a div element next to the canvas. Using `LABEL` creates
 * unhelpful duplicates for screen readers. Only use `LABEL` during
 * development. If `FALLBACK` is passed, as in `gridOutput(FALLBACK)`, the
 * description will only be visible to screen readers. This is the default
 * mode.
 *
 * Read
 * <a href="/learn/labeling-canvases.html">How to label your p5.js code</a> to
 * learn more about making sketches accessible.
 *
 * @method gridOutput
 * @param  {(FALLBACK|LABEL)} [display] either FALLBACK or LABEL.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   // Add the grid description.
 *   gridOutput();
 *
 *   // Draw a couple of shapes.
 *   background(200);
 *   fill(255, 0, 0);
 *   circle(20, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle and a blue square on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Add the grid description and
 *   // display it for debugging.
 *   gridOutput(LABEL);
 *
 *   // Draw a couple of shapes.
 *   background(200);
 *   fill(255, 0, 0);
 *   circle(20, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle and a blue square on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   // Add the grid description.
 *   gridOutput();
 *
 *   // Draw a moving circle.
 *   background(200);
 *   let x = frameCount * 0.1;
 *   fill(255, 0, 0);
 *   circle(x, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle moves from left to right above a blue square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   // Add the grid description and
 *   // display it for debugging.
 *   gridOutput(LABEL);
 *
 *   // Draw a moving circle.
 *   background(200);
 *   let x = frameCount * 0.1;
 *   fill(255, 0, 0);
 *   circle(x, 20, 20);
 *   fill(0, 0, 255);
 *   square(50, 50, 50);
 *
 *   // Add a general description of the canvas.
 *   describe('A red circle moves from left to right above a blue square.');
 * }
 * </code>
 * </div>
 */

p5.prototype.gridOutput = function(display) {
  p5._validateParameters('gridOutput', arguments);
  //if gridOutput is already true
  if (this._accessibleOutputs.grid) {
    return;
  } else {
    //make gridOutput true
    this._accessibleOutputs.grid = true;
    //create output for fallback
    this._createOutput('gridOutput', 'Fallback');
    if (display === this.LABEL) {
      //make gridOutput label true
      this._accessibleOutputs.gridLabel = true;
      //create output for label
      this._createOutput('gridOutput', 'Label');
    }
  }
};

//helper function returns true when accessible outputs are true
p5.prototype._addAccsOutput = function() {
  //if there are no accessible outputs create object with all false
  if (!this._accessibleOutputs) {
    this._accessibleOutputs = {
      text: false,
      grid: false,
      textLabel: false,
      gridLabel: false
    };
  }
  return this._accessibleOutputs.grid || this._accessibleOutputs.text;
};

//helper function that creates html structure for accessible outputs
p5.prototype._createOutput = function(type, display) {
  let cnvId = this.canvas.id;
  //if there are no ingredients create object. this object stores data for the outputs
  if (!this.ingredients) {
    this.ingredients = {
      shapes: {},
      colors: { background: 'white', fill: 'white', stroke: 'black' },
      pShapes: '',
      pBackground: ''
    };
  }
  //if there is no dummyDOM create it
  if (!this.dummyDOM) {
    this.dummyDOM = document.getElementById(cnvId).parentNode;
  }
  let cIdT, container, inner;
  let query = '';
  if (display === 'Fallback') {
    cIdT = cnvId + type;
    container = cnvId + 'accessibleOutput';
    if (!this.dummyDOM.querySelector(`#${container}`)) {
      //if there is no canvas description (see describe() and describeElement())
      if (!this.dummyDOM.querySelector(`#${cnvId}_Description`)) {
        //create html structure inside of canvas
        this.dummyDOM.querySelector(
          `#${cnvId}`
        ).innerHTML = `<div id="${container}" role="region" aria-label="Canvas Outputs"></div>`;
      } else {
        //create html structure after canvas description container
        this.dummyDOM
          .querySelector(`#${cnvId}_Description`)
          .insertAdjacentHTML(
            'afterend',
            `<div id="${container}" role="region" aria-label="Canvas Outputs"></div>`
          );
      }
    }
  } else if (display === 'Label') {
    query = display;
    cIdT = cnvId + type + display;
    container = cnvId + 'accessibleOutput' + display;
    if (!this.dummyDOM.querySelector(`#${container}`)) {
      //if there is no canvas description label (see describe() and describeElement())
      if (!this.dummyDOM.querySelector(`#${cnvId}_Label`)) {
        //create html structure adjacent to canvas
        this.dummyDOM
          .querySelector(`#${cnvId}`)
          .insertAdjacentHTML('afterend', `<div id="${container}"></div>`);
      } else {
        //create html structure after canvas label
        this.dummyDOM
          .querySelector(`#${cnvId}_Label`)
          .insertAdjacentHTML('afterend', `<div id="${container}"></div>`);
      }
    }
  }
  //create an object to store the latest output. this object is used in _updateTextOutput() and _updateGridOutput()
  this._accessibleOutputs[cIdT] = {};
  if (type === 'textOutput') {
    query = `#${cnvId}gridOutput${query}`; //query is used to check if gridOutput already exists
    inner = `<div id="${cIdT}">Text Output<div id="${cIdT}Summary" aria-label="text output summary"><p id="${cIdT}_summary"></p><ul id="${cIdT}_list"></ul></div><table id="${cIdT}_shapeDetails" summary="text output shape details"></table></div>`;
    //if gridOutput already exists
    if (this.dummyDOM.querySelector(query)) {
      //create textOutput before gridOutput
      this.dummyDOM
        .querySelector(query)
        .insertAdjacentHTML('beforebegin', inner);
    } else {
      //create output inside of container
      this.dummyDOM.querySelector(`#${container}`).innerHTML = inner;
    }
    //store output html elements
    this._accessibleOutputs[cIdT].list = this.dummyDOM.querySelector(
      `#${cIdT}_list`
    );
  } else if (type === 'gridOutput') {
    query = `#${cnvId}textOutput${query}`; //query is used to check if textOutput already exists
    inner = `<div id="${cIdT}">Grid Output<p id="${cIdT}_summary" aria-label="grid output summary"><table id="${cIdT}_map" summary="grid output content"></table><ul id="${cIdT}_shapeDetails" aria-label="grid output shape details"></ul></div>`;
    //if textOutput already exists
    if (this.dummyDOM.querySelector(query)) {
      //create gridOutput after textOutput
      this.dummyDOM.querySelector(query).insertAdjacentHTML('afterend', inner);
    } else {
      //create output inside of container
      this.dummyDOM.querySelector(`#${container}`).innerHTML = inner;
    }
    //store output html elements
    this._accessibleOutputs[cIdT].map = this.dummyDOM.querySelector(
      `#${cIdT}_map`
    );
  }
  this._accessibleOutputs[cIdT].shapeDetails = this.dummyDOM.querySelector(
    `#${cIdT}_shapeDetails`
  );
  this._accessibleOutputs[cIdT].summary = this.dummyDOM.querySelector(
    `#${cIdT}_summary`
  );
};

//this function is called at the end of setup and draw if using
//accessibleOutputs and calls update functions of outputs
p5.prototype._updateAccsOutput = function() {
  let cnvId = this.canvas.id;
  //if the shapes are not the same as before
  if (
    JSON.stringify(this.ingredients.shapes) !== this.ingredients.pShapes ||
    this.ingredients.colors.background !== this.ingredients.pBackground
  ) {
    //save current shapes as string in pShapes
    this.ingredients.pShapes = JSON.stringify(this.ingredients.shapes);
    if (this._accessibleOutputs.text) {
      this._updateTextOutput(cnvId + 'textOutput');
    }
    if (this._accessibleOutputs.grid) {
      this._updateGridOutput(cnvId + 'gridOutput');
    }
    if (this._accessibleOutputs.textLabel) {
      this._updateTextOutput(cnvId + 'textOutputLabel');
    }
    if (this._accessibleOutputs.gridLabel) {
      this._updateGridOutput(cnvId + 'gridOutputLabel');
    }
  }
};

//helper function that resets all ingredients when background is called
//and saves background color name
p5.prototype._accsBackground = function(args) {
  //save current shapes as string in pShapes
  this.ingredients.pShapes = JSON.stringify(this.ingredients.shapes);
  this.ingredients.pBackground = this.ingredients.colors.background;
  //empty shapes JSON
  this.ingredients.shapes = {};
  //update background different
  if (this.ingredients.colors.backgroundRGBA !== args) {
    this.ingredients.colors.backgroundRGBA = args;
    this.ingredients.colors.background = this._rgbColorName(args);
  }
};

//helper function that gets fill and stroke of shapes
p5.prototype._accsCanvasColors = function(f, args) {
  if (f === 'fill') {
    //update fill different
    if (this.ingredients.colors.fillRGBA !== args) {
      this.ingredients.colors.fillRGBA = args;
      this.ingredients.colors.fill = this._rgbColorName(args);
    }
  } else if (f === 'stroke') {
    //update stroke if different
    if (this.ingredients.colors.strokeRGBA !== args) {
      this.ingredients.colors.strokeRGBA = args;
      this.ingredients.colors.stroke = this._rgbColorName(args);
    }
  }
};

//builds ingredients.shapes used for building outputs
p5.prototype._accsOutput = function(f, args) {
  if (f === 'ellipse' && args[2] === args[3]) {
    f = 'circle';
  } else if (f === 'rectangle' && args[2] === args[3]) {
    f = 'square';
  }
  let include = {};
  let add = true;
  let middle = _getMiddle(f, args);
  if (f === 'line') {
    //make color stroke
    include.color = this.ingredients.colors.stroke;
    //get lenght
    include.length = Math.round(
      Math.hypot(args[2] - args[0], args[3] - args[1])
    );
    //get position of end points
    let p1 = this._getPos(args[0], [1]);
    let p2 = this._getPos(args[2], [3]);
    include.loc = _canvasLocator(middle, this.width, this.height);
    if (p1 === p2) {
      include.pos = `at ${p1}`;
    } else {
      include.pos = `from ${p1} to ${p2}`;
    }
  } else {
    if (f === 'point') {
      //make color stroke
      include.color = this.ingredients.colors.stroke;
    } else {
      //make color fill
      include.color = this.ingredients.colors.fill;
      //get area of shape
      include.area = this._getArea(f, args);
    }
    //get middle of shapes
    //calculate position using middle of shape
    include.pos = this._getPos(...middle);
    //calculate location using middle of shape
    include.loc = _canvasLocator(middle, this.width, this.height);
  }
  //if it is the first time this shape is created
  if (!this.ingredients.shapes[f]) {
    this.ingredients.shapes[f] = [include];
    //if other shapes of this type have been created
  } else if (this.ingredients.shapes[f] !== [include]) {
    //for every shape of this type
    for (let y in this.ingredients.shapes[f]) {
      //compare it with current shape and if it already exists make add false
      if (
        JSON.stringify(this.ingredients.shapes[f][y]) ===
        JSON.stringify(include)
      ) {
        add = false;
      }
    }
    //add shape by pushing it to the end
    if (add === true) {
      this.ingredients.shapes[f].push(include);
    }
  }
};

//gets middle point / centroid of shape
function _getMiddle(f, args) {
  let x, y;
  if (
    f === 'rectangle' ||
    f === 'ellipse' ||
    f === 'arc' ||
    f === 'circle' ||
    f === 'square'
  ) {
    x = Math.round(args[0] + args[2] / 2);
    y = Math.round(args[1] + args[3] / 2);
  } else if (f === 'triangle') {
    x = (args[0] + args[2] + args[4]) / 3;
    y = (args[1] + args[3] + args[5]) / 3;
  } else if (f === 'quadrilateral') {
    x = (args[0] + args[2] + args[4] + args[6]) / 4;
    y = (args[1] + args[3] + args[5] + args[7]) / 4;
  } else if (f === 'line') {
    x = (args[0] + args[2]) / 2;
    y = (args[1] + args[3]) / 2;
  } else {
    x = args[0];
    y = args[1];
  }
  return [x, y];
}

//gets position of shape in the canvas
p5.prototype._getPos = function (x, y) {
  const untransformedPosition = new DOMPointReadOnly(x, y);
  const currentTransform = this._renderer.isP3D ?
    new DOMMatrix(this._renderer.uMVMatrix.mat4) :
    this.drawingContext.getTransform();
  const { x: transformedX, y: transformedY } = untransformedPosition
    .matrixTransform(currentTransform);
  const canvasWidth = this.width * this._pixelDensity;
  const canvasHeight = this.height * this._pixelDensity;
  if (transformedX < 0.4 * canvasWidth) {
    if (transformedY < 0.4 * canvasHeight) {
      return 'top left';
    } else if (transformedY > 0.6 * canvasHeight) {
      return 'bottom left';
    } else {
      return 'mid left';
    }
  } else if (transformedX > 0.6 * canvasWidth) {
    if (transformedY < 0.4 * canvasHeight) {
      return 'top right';
    } else if (transformedY > 0.6 * canvasHeight) {
      return 'bottom right';
    } else {
      return 'mid right';
    }
  } else {
    if (transformedY < 0.4 * canvasHeight) {
      return 'top middle';
    } else if (transformedY > 0.6 * canvasHeight) {
      return 'bottom middle';
    } else {
      return 'middle';
    }
  }
};

//locates shape in a 10*10 grid
function _canvasLocator(args, canvasWidth, canvasHeight) {
  const noRows = 10;
  const noCols = 10;
  let locX = Math.floor(args[0] / canvasWidth * noRows);
  let locY = Math.floor(args[1] / canvasHeight * noCols);
  if (locX === noRows) {
    locX = locX - 1;
  }
  if (locY === noCols) {
    locY = locY - 1;
  }
  return {
    locX,
    locY
  };
}

//calculates area of shape
p5.prototype._getArea = function (objectType, shapeArgs) {
  let objectArea = 0;
  if (objectType === 'arc') {
    // area of full ellipse = PI * horizontal radius * vertical radius.
    // therefore, area of arc = difference bet. arc's start and end radians * horizontal radius * vertical radius.
    // the below expression is adjusted for negative values and differences in arc's start and end radians over PI*2
    const arcSizeInRadians =
      ((shapeArgs[5] - shapeArgs[4]) % (Math.PI * 2) + Math.PI * 2) %
      (Math.PI * 2);
    objectArea = arcSizeInRadians * shapeArgs[2] * shapeArgs[3] / 8;
    if (shapeArgs[6] === 'open' || shapeArgs[6] === 'chord') {
      // when the arc's mode is OPEN or CHORD, we need to account for the area of the triangle that is formed to close the arc
      // (Ax( By −  Cy) + Bx(Cy − Ay) + Cx(Ay − By ) )/2
      const Ax = shapeArgs[0];
      const Ay = shapeArgs[1];
      const Bx =
        shapeArgs[0] + shapeArgs[2] / 2 * Math.cos(shapeArgs[4]).toFixed(2);
      const By =
        shapeArgs[1] + shapeArgs[3] / 2 * Math.sin(shapeArgs[4]).toFixed(2);
      const Cx =
        shapeArgs[0] + shapeArgs[2] / 2 * Math.cos(shapeArgs[5]).toFixed(2);
      const Cy =
        shapeArgs[1] + shapeArgs[3] / 2 * Math.sin(shapeArgs[5]).toFixed(2);
      const areaOfExtraTriangle =
        Math.abs(Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By)) / 2;
      if (arcSizeInRadians > Math.PI) {
        objectArea = objectArea + areaOfExtraTriangle;
      } else {
        objectArea = objectArea - areaOfExtraTriangle;
      }
    }
  } else if (objectType === 'ellipse' || objectType === 'circle') {
    objectArea = 3.14 * shapeArgs[2] / 2 * shapeArgs[3] / 2;
  } else if (objectType === 'line') {
    objectArea = 0;
  } else if (objectType === 'point') {
    objectArea = 0;
  } else if (objectType === 'quadrilateral') {
    // ((x4+x1)*(y4-y1)+(x1+x2)*(y1-y2)+(x2+x3)*(y2-y3)+(x3+x4)*(y3-y4))/2
    objectArea =
      Math.abs(
        (shapeArgs[6] + shapeArgs[0]) * (shapeArgs[7] - shapeArgs[1]) +
          (shapeArgs[0] + shapeArgs[2]) * (shapeArgs[1] - shapeArgs[3]) +
          (shapeArgs[2] + shapeArgs[4]) * (shapeArgs[3] - shapeArgs[5]) +
          (shapeArgs[4] + shapeArgs[6]) * (shapeArgs[5] - shapeArgs[7])
      ) / 2;
  } else if (objectType === 'rectangle' || objectType === 'square') {
    objectArea = shapeArgs[2] * shapeArgs[3];
  } else if (objectType === 'triangle') {
    objectArea =
      Math.abs(
        shapeArgs[0] * (shapeArgs[3] - shapeArgs[5]) +
          shapeArgs[2] * (shapeArgs[5] - shapeArgs[1]) +
          shapeArgs[4] * (shapeArgs[1] - shapeArgs[3])
      ) / 2;
    // (Ax( By −  Cy) + Bx(Cy − Ay) + Cx(Ay − By ))/2
  }
  //  Store the positions of the canvas corners
  const canvasWidth = this.width * this._pixelDensity;
  const canvasHeight = this.height * this._pixelDensity;
  const canvasCorners = [
    new DOMPoint(0, 0),
    new DOMPoint(canvasWidth, 0),
    new DOMPoint(canvasWidth, canvasHeight),
    new DOMPoint(0, canvasHeight)
  ];
  //  Apply the inverse of the current transformations to the canvas corners
  const currentTransform = this._renderer.isP3D ?
    new DOMMatrix(this._renderer.uMVMatrix.mat4) :
    this.drawingContext.getTransform();
  const invertedTransform = currentTransform.inverse();
  const tc = canvasCorners.map(
    corner => corner.matrixTransform(invertedTransform)
  );
  /*  Use same shoelace formula used for quad area (above) to calculate
  the area of the canvas with inverted transformation applied */
  const transformedCanvasArea = Math.abs(
    (tc[3].x + tc[0].x) * (tc[3].y - tc[0].y) +
    (tc[0].x + tc[1].x) * (tc[0].y - tc[1].y) +
    (tc[1].x + tc[2].x) * (tc[1].y - tc[2].y)+
    (tc[2].x + tc[3].x) * (tc[2].y - tc[3].y)
  ) / 2;
  /*  Compare area of shape (minus transformations) to area of canvas
  with inverted transformation applied.
  Return percentage  */
  const untransformedArea = Math.round(
    objectArea * 100 / (transformedCanvasArea)
  );
  return untransformedArea;
};

export default p5;
