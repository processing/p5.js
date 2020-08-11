/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */
import p5 from '../core/main';

//the functions in this document support the creation of text output

let dummy = {};

//creates html structure for text output
p5.prototype._createTextOutput = function(idT, id, container, query) {
  let doc = document.getElementsByTagName('body')[0];
  let inner = `<div id="${idT}">Text Output<div id="${idT}Summary" aria-label="text output summary"><p id="${idT}SumP"></p><ul id="${idT}lst"></ul></div><table id="${idT}SD" summary="text output shape details"></table></div>`;
  if (doc.querySelector(query)) {
    doc.querySelector(query).insertAdjacentHTML('beforebegin', inner);
  } else {
    doc.querySelector(`#${container}`).innerHTML = inner;
  }
  dummy[id + 'DOM'] = document.getElementById(idT);
  return inner;
};

//updates textOutput
p5.prototype._updateTextOutput = function(id, type, ingredients, info) {
  let idT = id + type;
  if (!dummy[id]) {
    if (!document.getElementById(idT + 'Summary')) {
      return;
    }
  }
  if (dummy[idT + 'Update']) {
    _buildAndUpdateTextOutput(idT, id, ingredients, info);
  } else {
    _readyToUpdateTextCheck(idT, id, ingredients, info);
  }
};

function _readyToUpdateTextCheck(idT, id, ingredients, info) {
  if (dummy[id + 'DOM']) {
    if (
      dummy[id + 'DOM'].querySelector(`#${idT}SumP`) &&
      dummy[id + 'DOM'].querySelector(`#${idT}lst`) &&
      dummy[id + 'DOM'].querySelector(`#${idT}SD`)
    ) {
      dummy[idT + 'Update'] = true;
      dummy[id] = {};
      _buildAndUpdateTextOutput(idT, id, ingredients, info);
    }
  }
}

function _buildAndUpdateTextOutput(idT, id, ingredients, info) {
  let innerList = _shapeList(idT, ingredients);
  let innerSummary = _textSummary(innerList.numShapes, info);
  let innerShapeDetails = _shapeDetails(idT, ingredients);
  if (innerSummary !== dummy[id].summary) {
    dummy[id + 'DOM'].querySelector(`#${idT}SumP`).innerHTML = innerSummary;
    dummy[id].summary = innerSummary;
  }
  if (innerList.listShapes !== dummy[id].list) {
    dummy[id + 'DOM'].querySelector(`#${idT}lst`).innerHTML =
      innerList.listShapes;
    dummy[id].list = innerList.listShapes;
  }
  if (innerShapeDetails !== dummy[id].shapeDetails) {
    dummy[id + 'DOM'].querySelector(`#${idT}SD`).innerHTML = innerShapeDetails;
    dummy[id].shapeDetails = innerShapeDetails;
  }
}

//Builds textOutput summary
function _textSummary(numShapes, info) {
  let text = `Your output is a, ${info.width} by ${info.height} pixels, ${
    info.background
  } canvas containing the following`;
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
