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
let cnvConfig = {};

p5.prototype.textOutput = function() {
  txtOut = true;
  if (this.canvas !== undefined) {
    this._setDefaults();
    this._createOutput('textOutput');
  } else {
    throw new Error('textOutput() should be called after canvas is created');
  }
};

p5.prototype._addAccsOutput = function() {
  if (txtOut === true) {
    return true;
  } else {
    return false;
  }
};

//helper function that creates div for accessible outputs
p5.prototype._createOutput = function(type) {
  const cnvId = this.canvas.id;
  if (document.getElementById(cnvId + type) === null) {
    document
      .getElementById(cnvId)
      .insertAdjacentHTML(
        'afterend',
        '<div id="' + cnvId + type + '" class="accessibleOutput"></div>'
      );
    this._updateOutput(type);
  }
};

//helper function that updates accessible outputs
p5.prototype._updateOutput = function(type) {
  if (txtOut === false) {
    return;
  }
  if (type === undefined) {
    type = 'textOutput';
  }
  let inner = this._buildOutput();
  const cnvId = this.canvas.id;
  document.getElementById(cnvId + type).innerHTML = inner;
};

//helper function that builds output content
p5.prototype._buildOutput = function() {
  if (ingredients === preIngredients) {
    return;
  }
  let el = 0;
  let elText = '';
  //go through shapes and add them:
  for (let x in ingredients) {
    for (let y in ingredients[x]) {
      el++;
      elText =
        elText +
        '<li>' +
        ingredients[x][y].fill +
        ' ' +
        x +
        ', at ' +
        ingredients[x][y].pos +
        ', covering ' +
        ingredients[x][y].area +
        '% of the canvas.</li>';
    }
  }
  //create initial phrase
  let text =
    'Your output is a, ' +
    Math.round(this.width) +
    ' by ' +
    Math.round(this.height) +
    ' pixels, ' +
    cnvConfig.background +
    ' canvas. Containing the following ' +
    el +
    ' objects:</p><ul>' +
    elText +
    '</ul>';
  return text;
};

p5.prototype._accsBackground = function(args) {
  if (txtOut === false) {
    return;
  }
  preIngredients = ingredients;
  ingredients = {};
  if (cnvConfig.backgroundRGBA !== args) {
    cnvConfig.backgroundRGBA = args;
    cnvConfig.background = this._rgbColorName(args);
  }
};

p5.prototype._accscnvConfig = function(args) {
  if (txtOut === false) {
    return;
  }
  if (cnvConfig.fill !== args) {
    cnvConfig.fillRGBA = args;
    cnvConfig.fill = this._rgbColorName(args);
    this._updateOutput();
  }
};

p5.prototype._setDefaults = function() {
  cnvConfig.background = 'white';
  cnvConfig.fill = 'white';
};

p5.prototype._accsOutput = function(f, args) {
  if (f === 'ellipse' && args[2] === args[3]) {
    f = 'circle';
  } else if (f === 'rect' && args[2] === args[3]) {
    f = 'square';
  }
  let include = {};
  include.fill = cnvConfig.fill;
  include.pos = this._getPos(args);
  include.area = this._getArea(f, args);
  include.args = args;
  if (ingredients[f] === undefined) {
    ingredients[f] = [include];
  } else if (ingredients[f] !== [include]) {
    for (var i = 0; i < ingredients[f].length; i++) {
      if (ingredients[f][i] !== include) {
        ingredients[f].push(include);
      }
    }
  }
  if (ingredients !== preIngredients) {
    this._updateOutput();
  }
};

p5.prototype._getPos = function(args) {
  let x = Math.round(args[0]);
  let y = Math.round(args[1]);

  if (x < 0.4 * this.width) {
    if (y < 0.4 * this.height) {
      return 'top left';
    } else if (yCoord > 0.6 * this.height) {
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
  } else if (objectType === 'quad') {
    // ((x4+x1)*(y4-y1)+(x1+x2)*(y1-y2)+(x2+x3)*(y2-y3)+(x3+x4)*(y3-y4))/2
    objectArea =
      abs(
        (shapeArgs[6] + shapeArgs[0]) * (shapeArgs[7] - shapeArgs[1]) +
          (shapeArgs[0] + shapeArgs[2]) * (shapeArgs[1] - shapeArgs[3]) +
          (shapeArgs[2] + shapeArgs[4]) * (shapeArgs[3] - shapeArgs[5]) +
          (shapeArgs[4] + shapeArgs[6]) * (shapeArgs[5] - shapeArgs[7])
      ) / 2;
  } else if (objectType === 'rect' || objectType === 'square') {
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
