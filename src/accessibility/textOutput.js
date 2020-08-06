/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */
import p5 from '../core/main';

//the functions in this document support the creation of text output

let ingredients = {};
let background;
let dummy = { list: '', summary: '', shapeDetails: '' };

//creates html structure for text output
p5.prototype._createTextOutput = function(cIdT) {
  let inner = `Text Output<div id="${cIdT}Summary" aria-label="text output summary"><p id="${cIdT}SumP"></p><ul id="${cIdT}lst"></ul></div><table id="${cIdT}SD" summary="text output shape details"></table>`;
  return inner;
};

//updates textOutput
p5.prototype._updateTextOutput = function(cnvId, ing, bkgr) {
  ingredients = ing;
  background = bkgr;
  let cIdT = cnvId + 'txtOut';
  let innerList = _buildShapeList(cIdT);
  let innerSummary = _buildTxtSummary(
    innerList.numShapes,
    this.width,
    this.height
  );
  let innerShapeDetails = _buildShapeDetails(cIdT);
  if (innerSummary !== dummy.summary) {
    document.getElementById(cIdT + 'SumP').innerHTML = innerSummary;
    dummy.summary = innerSummary;
  }
  if (innerList.listShapes !== dummy.list) {
    document.getElementById(cIdT + 'lst').innerHTML = innerList.listShapes;
    dummy.list = innerList.listShapes;
  }
  if (innerShapeDetails !== dummy.shapeDetails) {
    document.getElementById(cIdT + 'SD').innerHTML = innerShapeDetails;
    dummy.shapeDetails = innerShapeDetails;
  }
};

//Builds textOutput summary
function _buildTxtSummary(numShapes, canvasWidth, canvasHeight) {
  let text = `Your output is a, ${canvasWidth} by ${canvasHeight} pixels, ${background} canvas. Containing the following ${numShapes} shapes:`;
  return text;
}

//Builds textOutput table with shape details
function _buildShapeDetails(cId) {
  let shapeDetails = '';
  let shapeNumber = 0;
  for (let x in ingredients) {
    for (let y in ingredients[x]) {
      let row = `<tr id="${cId}shape${shapeNumber}"><th>${
        ingredients[x][y].color
      } ${x}</th>`;
      if (x === 'line') {
        row =
          row +
          `<td>location = ${ingredients[x][y].pos}</td><td>length = ${
            ingredients[x][y].length
          } pixels</td></tr>`;
      } else {
        row = row + `<td>location = at ${ingredients[x][y].pos}</td>`;
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
function _buildShapeList(cId) {
  let shapeList = '';
  let shapeNumber = 0;
  for (let x in ingredients) {
    for (let y in ingredients[x]) {
      let _line = `<li><a href="#${cId}shape${shapeNumber}">${
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
