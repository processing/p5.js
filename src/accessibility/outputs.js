/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

// Errors when running example:
// - point
// - line
// - appending does not work

import p5 from '../core/main';
let ingredients = {};
let preIngredients = '';
let txtOut = false;
let grOut = false;
let cnvConfig = {};

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
 * //<div>
 * //<code>
 * //textOutput();
 * //background(148, 196, 0);
 * //fill(255, 0, 0);
 * //ellipse(20, 20, 20, 20);
 * //fill(0, 0, 255);
 * //rect(50, 50, 50, 50);
 * //</code>
 * //</div>
 *
 *
 * //<div>
 * //<code>
 * //let x = 0;
 * //function draw() {
 *   //textOutput();
 *   //background(148, 196, 0);
 *   //fill(255, 0, 0);
 *   //ellipse(x, 20, 20, 20);
 *   //fill(0, 0, 255);
 *   //rect(50, 50, 50, 50);
 *   //ellipse(20, 20, 20, 20);
 *   //x += 0.1;
 * //}
 *
 */

p5.prototype.textOutput = function(display) {
  p5._validateParameters('textOutput', arguments);
  if (!txtOut) {
    txtOut = true;
    if (this.canvas !== undefined) {
      _setDefaults();
      this._createOutput('txtOut');
    } else {
      throw new Error('textOutput() should be called after canvas is created');
    }
  } else {
    return;
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
 * //<div>
 * //<code>
 * //textOutput();
 * //background(148, 196, 0);
 * //fill(255, 0, 0);
 * //ellipse(20, 20, 20, 20);
 * //fill(0, 0, 255);
 * //rect(50, 50, 50, 50);
 * //</code>
 * //</div>
 *
 *
 * //<div>
 * //<code>
 * //let x = 0;
 * //function draw() {
 *   //textOutput();
 *   //background(148, 196, 0);
 *   //fill(255, 0, 0);
 *   //ellipse(x, 20, 20, 20);
 *   //fill(0, 0, 255);
 *   //rect(50, 50, 50, 50);
 *   //ellipse(20, 20, 20, 20);
 *   //x += 0.1;
 * //}
 *
 */

p5.prototype.gridOutput = function(display) {
  p5._validateParameters('gridOutput', arguments);
  if (!txtOut) {
    grOut = true;
    if (this.canvas !== undefined) {
      _setDefaults();
      this._createOutput('grOut');
    } else {
      throw new Error('gridOutput() should be called after canvas is created');
    }
  } else {
    return;
  }
};

//helper function returns true when accessible outputs are true
p5.prototype._addAccsOutput = function() {
  return txtOut || grOut;
};

//helper function that creates html structure for accessible outputs
p5.prototype._createOutput = function(type) {
  let cnvId = this.canvas.id;
  let cIdT = cnvId + type;
  if (!document.getElementById(cIdT)) {
    document
      .getElementById(cnvId)
      .insertAdjacentHTML(
        'afterend',
        '<section id="' + cIdT + '" class="accessibleOutput"></section>'
      );
    if (type === 'txtOut') {
      let inner = this._createTextOutput(cIdT);
      document.getElementById(cIdT).innerHTML = inner;
    } else if (type === 'grOut') {
      let inner = this._createGridOutput(cIdT);
      document.getElementById(cIdT).innerHTML = inner;
    }
  }
};

//this function is called at the end of setup and draw if using
//accessOutputs and calls update functions of outputs
p5.prototype._updateAccsOutput = function() {
  if (JSON.stringify(ingredients) !== preIngredients) {
    preIngredients = JSON.stringify(ingredients);
    let cnvId = this.canvas.id;
    if (txtOut) {
      this._updateTextOutput(cnvId, ingredients, cnvConfig.background);
    }
    if (grOut) {
      this._updateGridOutput(cnvId, ingredients, cnvConfig.background);
    }
  }
};

//helper function that resets all ingredients when background is called
//and saves background color name
p5.prototype._accsBackground = function(args) {
  preIngredients = ingredients;
  ingredients = {};
  if (cnvConfig.backgroundRGBA !== args) {
    //cnvConfig.backgroundRGBA = args;
    cnvConfig.background = this._rgbColorName(args);
  }
};

//helper function that gets fill and stroke of shapes
p5.prototype._accsCanvasColors = function(f, args) {
  if (f === 'fill') {
    if (cnvConfig.fillRGBA !== args) {
      cnvConfig.fillRGBA = args;
      cnvConfig.fill = this._rgbColorName(args);
    }
  } else if (f === 'stroke') {
    if (cnvConfig.strokeRGBA !== args) {
      cnvConfig.strokeRGBA = args;
      cnvConfig.stroke = this._rgbColorName(args);
    }
  }
};

//helper function that sets defaul colors for background
//fill and stroke.
function _setDefaults() {
  cnvConfig.background = 'white';
  cnvConfig.fill = 'white';
  cnvConfig.stroke = 'black';
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
    include.color = cnvConfig.stroke;
    include.length = _getLineL(args);
    let p1 = _getPos([args[0], [1]], this.width, this.height);
    let p2 = _getPos([args[2], [3]], this.width, this.height);
    if (p1 === p2) {
      include.pos = 'at ' + p1;
    } else {
      include.pos = 'from ' + p1 + ' to ' + p2;
    }
  } else {
    if (f === 'point') {
      include.color = cnvConfig.stroke;
    } else {
      include.color = cnvConfig.fill;
      include.area = _getArea(f, args, this.width, this.height);
    }
    let middle = _getMiddle(f, args);
    include.pos = _getPos(middle, this.width, this.height);
    include.loc = _canvasLocator(middle, this.width, this.height);
  }
  include.args = args;
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

// return length of lines
function _getLineL(args) {
  return (lineLength = Math.round(
    Math.sqrt(Math.pow(args[2] - args[0], 2) + Math.pow(args[3] - args[1], 2))
  ));
}

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
