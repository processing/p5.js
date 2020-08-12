/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */
import p5 from '../core/main';

//the functions in this document support the creation of text output

//creates html structure for text output
p5.prototype._createTextOutput = function(idT, id, container, query) {
  this._accessibleOutputs[idT] = {};
  let inner = `<div id="${idT}">Text Output<div id="${idT}Summary" aria-label="text output summary"><p id="${idT}_summary"></p><ul id="${idT}lst"></ul></div><table id="${idT}SD" summary="text output shape details"></table></div>`;
  if (this.dummyDOM.querySelector(query)) {
    this.dummyDOM.querySelector(query).insertAdjacentHTML('beforebegin', inner);
  } else {
    this.dummyDOM.querySelector(`#${container}`).innerHTML = inner;
  }
  return inner;
};

//updates textOutput
p5.prototype._updateTextOutput = function(id, type) {
  let idT = id + type;
  if (this._accessibleOutputs[idT].update) {
    this._buildAndUpdateTextOutput(idT, id);
  } else {
    this._readyToUpdateTextCheck(idT, id);
  }
};

p5.prototype._readyToUpdateTextCheck = function(idT) {
  if (this.dummyDOM) {
    if (
      this.dummyDOM.querySelector(`#${idT}_summary`) &&
      this.dummyDOM.querySelector(`#${idT}lst`) &&
      this.dummyDOM.querySelector(`#${idT}SD`)
    ) {
      this._accessibleOutputs[idT].update = true;
      this._buildAndUpdateTextOutput(idT);
    }
  }
};

p5.prototype._buildAndUpdateTextOutput = function(idT) {
  let current = this._accessibleOutputs[idT];
  let innerList = _shapeList(idT, this.ingredients.shapes);
  let innerSummary = _textSummary(
    innerList.numShapes,
    this.ingredients.colors.background,
    this.width,
    this.height
  );
  let innerShapeDetails = _shapeDetails(idT, this.ingredients.shapes);
  if (innerSummary !== current.summary) {
    this.dummyDOM.querySelector(`#${idT}_summary`).innerHTML = innerSummary;
    current.summary = innerSummary;
  }
  if (innerList.listShapes !== current.list) {
    this.dummyDOM.querySelector(`#${idT}lst`).innerHTML = innerList.listShapes;
    current.list = innerList.listShapes;
  }
  if (innerShapeDetails !== current.shapeDetails) {
    this.dummyDOM.querySelector(`#${idT}SD`).innerHTML = innerShapeDetails;
    current.shapeDetails = innerShapeDetails;
  }
  this._accessibleOutputs[idT] = current;
};

//Builds textOutput summary
function _textSummary(numShapes, background, width, height) {
  let text = `Your output is a, ${width} by ${height} pixels, ${background} canvas containing the following`;
  if (numShapes === 1) {
    text = `${text} shape:`;
  } else {
    text = `${text} ${numShapes} shapes:`;
  }
  return text;
}

//Builds textOutput table with shape details
function _shapeDetails(idT, ingredients) {
  let shapeDetails = '';
  let shapeNumber = 0;
  for (let x in ingredients) {
    for (let y in ingredients[x]) {
      let row = `<tr id="${idT}shape${shapeNumber}"><th>${
        ingredients[x][y].color
      } ${x}</th>`;
      if (x === 'line') {
        row =
          row +
          `<td>location = ${ingredients[x][y].pos}</td><td>length = ${
            ingredients[x][y].length
          } pixels</td></tr>`;
      } else {
        row = row + `<td>location = ${ingredients[x][y].pos}</td>`;
        if (x !== 'point') {
          row = row + `<td> area = ${ingredients[x][y].area}%</td>`;
        }
        row = row + '</tr>';
      }
      shapeDetails = shapeDetails + row;
      shapeNumber++;
    }
  }
  return shapeDetails;
}

//Builds textOutput shape list
function _shapeList(idT, ingredients) {
  let shapeList = '';
  let shapeNumber = 0;
  for (let x in ingredients) {
    for (let y in ingredients[x]) {
      let _line = `<li><a href="#${idT}shape${shapeNumber}">${
        ingredients[x][y].color
      } ${x}</a>`;
      if (x === 'line') {
        _line =
          _line +
          `, ${ingredients[x][y].pos}, ${
            ingredients[x][y].length
          } pixels long.</li>`;
      } else {
        _line = _line + `, at ${ingredients[x][y].pos}`;
        if (x !== 'point') {
          _line = _line + `, covering ${ingredients[x][y].area}% of the canvas`;
        }
        _line = _line + `.</li>`;
      }
      shapeList = shapeList + _line;
      shapeNumber++;
    }
  }
  return { numShapes: shapeNumber, listShapes: shapeList };
}

export default p5;
