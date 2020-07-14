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
let looks = {};

p5.prototype.textOutput = function() {
  txtOut = true;
  if (this.canvas !== undefined) {
    this._setDefaults();
    this._createOutput('textOutput');
  } else {
    throw new Error('textOutput() should be called after canvas is created');
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
  if (ingredients !== preIngredients) {
    let text =
      'Your output is a ' +
      Math.round(this.width) +
      ' by ' +
      Math.round(this.height) +
      ' ' +
      looks.background +
      ' canvas.';
    return text;
  }
};

p5.prototype._accsBackground = function(args) {
  if (txtOut === false) {
    return;
  }
  preIngredients = ingredients;
  ingredients = {};
  if (looks.backgroundRGBA !== args) {
    looks.backgroundRGBA = args;
    console.log(this._rgbColorName(args[0], args[1], args[2]));
  }
};

p5.prototype._setDefaults = function() {
  looks.background = 'white';
  looks.fill = 'white';
};

p5.prototype._accsOutput = function(f, args) {
  if (ingredients.f === undefined) {
    ingredients.f = [args];
  } else if (ingredients.f !== [args]) {
    for (let i = 0; i < ingredients.f.length; i++) {
      if (ingredients.f[i] !== args) {
        ingredients.f.push(args);
      }
    }
  }
};

export default p5;
