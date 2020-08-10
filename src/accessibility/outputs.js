/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

// To-do:
// Improve updating to include only shapes that have changed? [leave as an issue]
// Add Fallback and other option

import p5 from '../core/main';
let ingredients = {};
let preIngredients = '';
let textOutput = false;
let gridOutput = false;
let textLabel = false;
let gridLabel = false;
let canvasColors = {};
let canvasInfo = {};
let preCanvasInfo = '';

/**
 * <code class="language-javascript">textOutput()</code> creates a screenreader
 * accessible output that describes the shapes present on the canvas.
 * The general description of the canvas includes canvas size,
 * canvas color, and number of elements in the canvas
 * (example: 'Your output is a, 400 by 400 pixels, lavender blue
 * canvas containing the following 4 shapes:'). This description
 * is followed by a list of shapes where the color, position, and area
 * of each shape are described (example: "orange ellipse at top left
 * covering 1% of the canvas"). Each element can be selected to get
 * more details. A table of elements is also provided. In this table,
 * shape, color, location, coordinates and area are described
 * (example: "orange ellipse location=top left area=2").
 *
 * @method textOutput
 * @param  {Constant} [display] either LABEL or FALLBACK (Optional)
 *
 * @example
 * <div>
 * <code>
 * textOutput();
 * background(148, 196, 0);
 * fill(255, 0, 0);
 * ellipse(20, 20, 20, 20);
 * fill(0, 0, 255);
 * rect(50, 50, 50, 50);
 * </code>
 * </div>
 *
 *
 * <div>
 * <code>
 * let x = 0;
 * function draw() {
 *   textOutput();
 *   background(148, 196, 0);
 *   fill(255, 0, 0);
 *   ellipse(x, 20, 20, 20);
 *   fill(0, 0, 255);
 *   rect(50, 50, 50, 50);
 *   ellipse(20, 20, 20, 20);
 *   x += 0.1;
 * }
 *
 */

p5.prototype.textOutput = function(display) {
  p5._validateParameters('textOutput', arguments);
  if (textOutput) {
    return;
  }
  textOutput = true;
  _setDefaults();
  this._createOutput('textOutput');
  if (display === this.LABEL) {
    textLabel = true;
    this._createLabel('textOutput');
  }
};

/**
 * <code class="language-javascript">gridOutput()</code>, formerly called
 * table output, lays out the content of the canvas in the form of a grid
 * (html table) based on the spatial location of each shape. A brief
 * description of the canvas is available before the table output.
 * This description includes: color of the background, size of the canvas,
 * number of objects, and object types (example: "lavender blue canvas is
 * 200 by 200 and contains 4 objects - 3 ellipses 1 rectangle"). The grid
 * describes the content spatially, each element is placed on a cell of the
 * table depending on its position. Within each cell an element the color
 * and type of shape of that element are available (example: "orange ellipse").
 * These descriptions can be selected individually to get more details.
 * A list of elements where shape, color, location, and area are described
 * (example: "orange ellipse location=top left area=1%") is also available.
 *
 * @method gridOutput
 * @param  {Constant} [display] either LABEL or FALLBACK (Optional)
 *
 * @example
 * <div>
 * <code>
 * textOutput();
 * background(148, 196, 0);
 * fill(255, 0, 0);
 * ellipse(20, 20, 20, 20);
 * fill(0, 0, 255);
 * rect(50, 50, 50, 50);
 * </code>
 * </div>
 *
 *
 * <div>
 * <code>
 * let x = 0;
 * function draw() {
 *   textOutput();
 *   background(148, 196, 0);
 *   fill(255, 0, 0);
 *   ellipse(x, 20, 20, 20);
 *   fill(0, 0, 255);
 *   rect(50, 50, 50, 50);
 *   ellipse(20, 20, 20, 20);
 *   x += 0.1;
 * }
 *
 */

p5.prototype.gridOutput = function(display) {
  p5._validateParameters('gridOutput', arguments);
  if (textOutput) {
    return;
  }
  gridOutput = true;
  _setDefaults();
  this._createOutput('gridOutput');
  if (display === this.LABEL) {
    gridLabel = true;
    this._createLabel('gridOutput');
  }
};

//helper function returns true when accessible outputs are true
p5.prototype._addAccsOutput = function() {
  return textOutput || gridOutput;
};

//helper function that creates html structure for accessible outputs
p5.prototype._createOutput = function(type) {
  let doc = document.getElementsByTagName('body')[0];
  let cnvId = this.canvas.id;
  let cIdT = cnvId + type;
  let container = cnvId + 'accessibleOutput';
  if (!doc.querySelector(`#${container}`)) {
    doc.querySelector(
      `#${cnvId}`
    ).innerHTML = `<div id="${container}" " role="region" aria-label="Canvas Outputs"></div>`;
  }
  if (type === 'textOutput') {
    this._createTextOutput(cIdT, cnvId, container, `#${cnvId}gridOutput`);
  } else if (type === 'gridOutput') {
    this._createGridOutput(cIdT, cnvId, container, `#${cnvId}textOutput`);
  }
};

p5.prototype._createLabel = function(type) {
  let doc = document.getElementsByTagName('body')[0];
  let cnvId = this.canvas.id;
  let cIdT = cnvId + type + 'Label';
  let container = cnvId + 'accessibleOutputLabel';
  if (!doc.querySelector(`#${container}`)) {
    doc
      .querySelector(`#${cnvId}`)
      .insertAdjacentHTML('afterend', `<div id="${container}"></div>`);
  }
  if (type === 'textOutput') {
    this._createTextOutput(cIdT, cnvId, container, `#${cnvId}gridOutputLabel`);
  } else if (type === 'gridOutput') {
    this._createGridOutput(cIdT, cnvId, container, `#${cnvId}textOutputLabel`);
  }
};

//this function is called at the end of setup and draw if using
//accessOutputs and calls update functions of outputs
p5.prototype._updateAccsOutput = function() {
  canvasInfo.width = this.width;
  canvasInfo.height = this.height;
  if (
    JSON.stringify(ingredients) !== preIngredients &&
    JSON.stringify(canvasInfo) !== preCanvasInfo
  ) {
    preIngredients = JSON.stringify(ingredients);
    preCanvasInfo = JSON.stringify(canvasInfo);
    let cnvId = this.canvas.id;
    if (textOutput) {
      this._updateTextOutput(cnvId, 'textOutput', ingredients, canvasInfo);
    }
    if (gridOutput) {
      this._updateGridOutput(cnvId, 'gridOutput', ingredients, canvasInfo);
    }
    if (textLabel) {
      this._updateTextOutput(cnvId, 'textOutputLabel', ingredients, canvasInfo);
      //
    }
    if (gridLabel) {
      this._updateGridOutput(cnvId, 'gridOutputLabel', ingredients, canvasInfo);
      //
    }
  }
};

//helper function that resets all ingredients when background is called
//and saves background color name
p5.prototype._accsBackground = function(args) {
  preIngredients = ingredients;
  ingredients = {};
  if (canvasColors.backgroundRGBA !== args) {
    canvasColors.backgroundRGBA = args;
    canvasInfo.background = this._rgbColorName(args);
  }
};

//helper function that gets fill and stroke of shapes
p5.prototype._accsCanvasColors = function(f, args) {
  if (f === 'fill') {
    if (canvasColors.fillRGBA !== args) {
      canvasColors.fillRGBA = args;
      canvasColors.fill = this._rgbColorName(args);
    }
  } else if (f === 'stroke') {
    if (canvasColors.strokeRGBA !== args) {
      canvasColors.strokeRGBA = args;
      canvasColors.stroke = this._rgbColorName(args);
    }
  }
};

//helper function that sets defaul colors for background
//fill and stroke.
function _setDefaults() {
  canvasInfo.background = 'white';
  canvasColors.fill = 'white';
  canvasColors.stroke = 'black';
}

//builds ingredients list for building outputs
p5.prototype._accsOutput = function(f, args) {
  if (f === 'ellipse' && args[2] === args[3]) {
    f = 'circle';
  } else if (f === 'rectangle' && args[2] === args[3]) {
    f = 'square';
  }
  let include = {};
  let add = true;
  if (f === 'line') {
    include.color = canvasColors.stroke;
    include.length = Math.round(this.dist(args[0], args[1], args[2], args[3]));
    let p1 = _getPos([args[0], [1]], this.width, this.height);
    let p2 = _getPos([args[2], [3]], this.width, this.height);
    if (p1 === p2) {
      include.pos = `at ${p1}`;
    } else {
      include.pos = `from ${p1} to ${p2}`;
    }
  } else {
    if (f === 'point') {
      include.color = canvasColors.stroke;
    } else {
      include.color = canvasColors.fill;
      include.area = _getArea(f, args, this.width, this.height);
    }
    let middle = _getMiddle(f, args);
    include.pos = _getPos(middle, this.width, this.height);
    include.loc = _canvasLocator(middle, this.width, this.height);
  }
  if (!ingredients[f]) {
    ingredients[f] = [include];
  } else if (ingredients[f] !== [include]) {
    for (let y in ingredients[f]) {
      if (JSON.stringify(ingredients[f][y]) === JSON.stringify(include)) {
        add = false;
      }
    }
    if (add === true) {
      ingredients[f].push(include);
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
  } else {
    x = args[0];
    y = args[1];
  }
  return [x, y];
}

//gets position of shape in the canvas
function _getPos(args, canvasWidth, canvasHeight) {
  if (args[0] < 0.4 * canvasWidth) {
    if (args[1] < 0.4 * canvasHeight) {
      return 'top left';
    } else if (args[1] > 0.6 * canvasHeight) {
      return 'bottom left';
    } else {
      return 'mid left';
    }
  } else if (args[0] > 0.6 * canvasWidth) {
    if (args[1] < 0.4 * canvasHeight) {
      return 'top right';
    } else if (args[1] > 0.6 * canvasHeight) {
      return 'bottom right';
    } else {
      return 'mid right';
    }
  } else {
    if (args[1] < 0.4 * canvasHeight) {
      return 'top middle';
    } else if (args[1] > 0.6 * canvasHeight) {
      return 'bottom middle';
    } else {
      return 'middle';
    }
  }
}

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

//Calculates area of shape
function _getArea(objectType, shapeArgs, canvasWidth, canvasHeight) {
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

  let percentage = Math.round(objectArea * 100 / (canvasWidth * canvasHeight));
  return percentage;
}

export default p5;
