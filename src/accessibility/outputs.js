/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
let ingredients = {};
let preIngredients = {};
let txtOut = false;
let grOut = false;
let cnvConfig = {};

/**
 * <code class="language-javascript">textOutput()</code> creates a screereader
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
 * The function has one optional parameter. <code class="language-javascript">textOutput(LABEL)</code> displays
 * the text output to all users in a
 * <code class="language-javascript">&lt;div class="p5Label"&gt;&lt;/div&gt;</code>
 * adjacent to the canvas. You can style it as you wish in your CSS.
 * <code class="language-javascript">textOutput(FALLBACK)</code> makes the
 * text output accessible to screen-reader users only, in
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Hit_regions_and_accessibility" target="_blank">
 * a sub DOM inside the canvas element</a>. If a parameter is not
 * specified, by default, the description will only be available to
 * screen-reader users.
 *
 * @method describe
 * @param  {Constant} [display] either LABEL or FALLBACK (Optional)
 *
 * @example
 * <div>
 * <code>
 * //textOutput();
 * background(148, 196, 0);
 * fill(255, 0, 0);
 * ellipse(20, 20, 20, 20);
 * fill(0, 0, 255);
 * rect(50, 50, 50, 50);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let x = 0;
 * function draw() {
 *   //textOutput();
 *   background(148, 196, 0);
 *   fill(255, 0, 0);
 *   ellipse(x, 20, 20, 20);
 *   fill(0, 0, 255);
 *   rect(50, 50, 50, 50);
 *   ellipse(20, 20, 20, 20);
 *   x += 0.1;
 * }
 * </code>
 * </div>
 *
 */

p5.prototype.textOutput = function() {
  if (txtOut === false) {
    txtOut = true;
    if (this.canvas !== undefined) {
      this._setDefaults();
      this._createOutput('txtOut');
    } else {
      throw new Error('textOutput() should be called after canvas is created');
    }
  } else {
    return;
  }
};

p5.prototype.gridOutput = function() {
  grOut = true;
  if (this.canvas !== undefined) {
    this._setDefaults();
    this._createOutput('grOut');
  } else {
    throw new Error('gridOutput() should be called after canvas is created');
  }
};

//helper function returns true when accessible outputs are true
p5.prototype._addAccsOutput = function() {
  if (txtOut === true || grOut === true) {
    return true;
  } else {
    return false;
  }
};

//helper function that creates html structure for accessible outputs
p5.prototype._createOutput = function(type) {
  let cnvId = this.canvas.id;
  let cIdT = cnvId + type;
  if (document.getElementById(cIdT) === null) {
    document
      .getElementById(cnvId)
      .insertAdjacentHTML(
        'afterend',
        '<section id="' + cIdT + '" class="accessibleOutput"></section>'
      );
    if (type === 'txtOut') {
      let inner = this._createTextOutput(cIdT);
      document.getElementById(cIdT).innerHTML = inner;
    }
    if (type === 'grOut') {
      let inner = this._createGridOutput(cIdT);
      document.getElementById(cIdT).innerHTML = inner;
    }
    this._updateOutput();
  }
};

//helper function that updates accessible outputs
p5.prototype._updateOutput = function() {
  if (ingredients === preIngredients) {
    return;
  }
  let cnvId = this.canvas.id;
  if (txtOut === true) {
    this._updateTextOutput(cnvId, ingredients, cnvConfig.background);
  }
  if (grOut === true) {
    this._updateGridOutput(cnvId, ingredients, cnvConfig.background);
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
p5.prototype._accscnvConfig = function(f, args) {
  if (f === 'fill') {
    if (cnvConfig.fillRGBA !== args) {
      cnvConfig.fillRGBA = args;
      cnvConfig.fill = this._rgbColorName(args);
      this._updateOutput();
    }
  } else if (f === 'stroke') {
    if (cnvConfig.strokeRGBA !== args) {
      cnvConfig.strokeRGBA = args;
      cnvConfig.stroke = this._rgbColorName(args);
      this._updateOutput();
    }
  }
};

//helper function that sets defaul colors for background
//fill and stroke.
p5.prototype._setDefaults = function() {
  cnvConfig.background = 'white';
  cnvConfig.fill = 'white';
  cnvConfig.stroke = 'black';
};

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
    include.length = _getLineLength(args);
    let p1 = this._getPos([args[0], [1]]);
    let p2 = this._getPos([args[2], [3]]);
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
      include.area = this._getArea(f, args);
    }
    include.middle = this._getMiddle(f, args);
    include.pos = this._getPos(include.middle);
    include.loc = this._canvasLocator(include.middle);
  }
  include.args = args;
  if (ingredients[f] === undefined) {
    ingredients[f] = [include];
  } else if (ingredients[f] !== [include]) {
    for (let y in ingredients[x]) {
      if (JSON.stringify(ingredients[f][y]) === JSON.stringify(include)) {
        add = false;
      }
    }
    if (add === true) {
      ingredients[f].push(include);
    }
  }
  if (ingredients !== preIngredients) {
    this._updateOutput();
  }
};

//gets middle point / centroid of shape
p5.prototype._getMiddle = function(f, args) {
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
};

//gets position of shape in the canvas
p5.prototype._getPos = function(args) {
  let x = Math.round(args[0]);
  let y = Math.round(args[1]);

  if (x < 0.4 * this.width) {
    if (y < 0.4 * this.height) {
      return 'top left';
    } else if (y > 0.6 * this.height) {
      return 'bottom left';
    } else {
      return 'mid left';
    }
  } else if (x > 0.6 * this.width) {
    if (y < 0.4 * this.height) {
      return 'top right';
    } else if (y > 0.6 * this.height) {
      return 'bottom right';
    } else {
      return 'mid right';
    }
  } else {
    if (y < 0.4 * this.height) {
      return 'top middle';
    } else if (y > 0.6 * this.height) {
      return 'bottom middle';
    } else {
      return 'middle';
    }
  }
};

// return length of lines
p5.prototype._getLineLength = function(args) {
  const lineLength = Math.round(
    Math.sqrt(Math.pow(args[2] - args[0], 2) + Math.pow(args[3] - args[1], 2))
  );
  return lineLength;
};

//locates shape in a 10*10 grid
p5.prototype._canvasLocator = function(args) {
  const noRows = 10;
  const noCols = 10;
  let locX, locY;

  locX = Math.floor(args[0] / this.width * noRows);
  locY = Math.floor(args[1] / this.height * noCols);
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
};

//Calculates area of shape
p5.prototype._getArea = function(objectType, shapeArgs) {
  let objectArea = 0;
  if (objectType === 'arc') {
    // area of full ellipse = PI * horizontal radius * vertical radius.
    // therefore, area of arc = difference bet. arc's start and end radians * horizontal radius * vertical radius.
    // the below expression is adjusted for negative values and differences in arc's start and end radians over PI*2
    const arcSizeInRadians =
      ((shapeArgs[5] - shapeArgs[4]) % (PI * 2) + PI * 2) % (PI * 2);
    objectArea = arcSizeInRadians * shapeArgs[2] * shapeArgs[3] / 8;
    if (shapeArgs[6] === 'open' || shapeArgs[6] === 'chord') {
      // when the arc's mode is OPEN or CHORD, we need to account for the area of the triangle that is formed to close the arc
      // (Ax( By −  Cy) + Bx(Cy − Ay) + Cx(Ay − By ) )/2
      const Ax = shapeArgs[0];
      const Ay = shapeArgs[1];
      const Bx = shapeArgs[0] + shapeArgs[2] / 2 * cos(shapeArgs[4]).toFixed(2);
      const By = shapeArgs[1] + shapeArgs[3] / 2 * sin(shapeArgs[4]).toFixed(2);
      const Cx = shapeArgs[0] + shapeArgs[2] / 2 * cos(shapeArgs[5]).toFixed(2);
      const Cy = shapeArgs[1] + shapeArgs[3] / 2 * sin(shapeArgs[5]).toFixed(2);
      const areaOfExtraTriangle =
        abs(Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By)) / 2;
      if (arcSizeInRadians > PI) {
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
      abs(
        (shapeArgs[6] + shapeArgs[0]) * (shapeArgs[7] - shapeArgs[1]) +
          (shapeArgs[0] + shapeArgs[2]) * (shapeArgs[1] - shapeArgs[3]) +
          (shapeArgs[2] + shapeArgs[4]) * (shapeArgs[3] - shapeArgs[5]) +
          (shapeArgs[4] + shapeArgs[6]) * (shapeArgs[5] - shapeArgs[7])
      ) / 2;
  } else if (objectType === 'rectangle' || objectType === 'square') {
    objectArea = shapeArgs[2] * shapeArgs[3];
  } else if (objectType === 'triangle') {
    objectArea =
      abs(
        shapeArgs[0] * (shapeArgs[3] - shapeArgs[5]) +
          shapeArgs[2] * (shapeArgs[5] - shapeArgs[1]) +
          shapeArgs[4] * (shapeArgs[1] - shapeArgs[3])
      ) / 2;
    // (Ax( By −  Cy) + Bx(Cy − Ay) + Cx(Ay − By ))/2
  }

  let percentage = Math.round(objectArea * 100 / (this.width * this.height));
  return percentage;
};

export default p5;
