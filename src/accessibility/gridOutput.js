/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */
import p5 from '../core/main';

//the functions in this document support the creation of grid output

let dummy = {};

//creates html structure
p5.prototype._createGridOutput = function(idT, id, container, query) {
  let doc = document.getElementsByTagName('body')[0];
  let inner = `<div id="${idT}">Grid Output<p id="${idT}Summary" aria-label="grid output summary"><table id="${idT}OD" summary="grid output content"></table><ul id="${idT}SD" aria-label="grid output shape details"></ul></div>`;
  if (doc.querySelector(query)) {
    doc.querySelector(query).insertAdjacentHTML('afterend', inner);
  } else {
    doc.querySelector(`#${container}`).innerHTML = inner;
  }
  dummy[id + 'DOM'] = document.getElementById(idT);
  return inner;
};

//creates output content
p5.prototype._updateGridOutput = function(id, type, ingredients, info) {
  let idT = id + type;
  if (!dummy[id]) {
    if (!document.getElementById(`${idT}Summary`)) {
      return;
    }
  }
  if (dummy[idT + 'Update']) {
    _buildAndUpdateGridOutput(idT, id, ingredients, info);
  } else {
    _readyToUpdateGridCheck(idT, id, ingredients, info);
  }
};

function _readyToUpdateGridCheck(idT, id, ingredients, info) {
  if (dummy[id + 'DOM']) {
    if (
      dummy[id + 'DOM'].querySelector(`#${idT}OD`) &&
      dummy[id + 'DOM'].querySelector(`#${idT}Summary`) &&
      dummy[id + 'DOM'].querySelector(`#${idT}SD`)
    ) {
      dummy[idT + 'Update'] = true;
      dummy[id] = {};
      _buildAndUpdateGridOutput(idT, id, ingredients, info);
    }
  }
}

function _buildAndUpdateGridOutput(idT, id, ingredients, info) {
  let innerShapeDetails = _gridShapeDetails(idT, ingredients);
  let innerSummary = _gridSummary(innerShapeDetails.numShapes, info);
  let innerMap = _gridMap(idT, ingredients);
  if (innerSummary !== dummy[id].summary) {
    dummy[id + 'DOM'].querySelector(`#${idT}Summary`).innerHTML = innerSummary;
    dummy[id].summary = innerSummary;
  }
  if (innerMap !== dummy[id].map) {
    dummy[id + 'DOM'].querySelector(`#${idT}OD`).innerHTML = innerMap;
    dummy[id].map = innerMap;
  }
  if (innerShapeDetails.details !== dummy[id].shapeDetails) {
    dummy[id + 'DOM'].querySelector(`#${idT}SD`).innerHTML =
      innerShapeDetails.details;
    dummy[id].shapeDetails = innerShapeDetails.details;
  }
}

//creates spatial grid
function _gridMap(idT, ingredients) {
  let shapeNumber = 0;
  let table = '';
  let cells = Array.apply(null, Array(10)).map(function() {});
  for (let r in cells) {
    cells[r] = Array.apply(null, Array(10)).map(function() {});
  }
  for (let x in ingredients) {
    for (let y in ingredients[x]) {
      if (!cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX]) {
        cells[ingredients[x][y].loc.locY][
          ingredients[x][y].loc.locX
        ] = `<a href="#${idT}shape${shapeNumber}">${
          ingredients[x][y].color
        } ${x}</a>`;
      } else {
        cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] =
          cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] +
          `  <a href="#${idT}shape${shapeNumber}">${
            ingredients[x][y].color
          } ${x}</a>`;
      }
      shapeNumber++;
    }
  }
  for (let _r in cells) {
    let row = '<tr>';
    for (let c in cells[_r]) {
      row = row + '<td>';
      if (cells[_r][c] !== undefined) {
        row = row + cells[_r][c];
      }
      row = row + '</td>';
    }
    table = table + row + '</tr>';
  }
  return table;
}

//creates grid summary
function _gridSummary(numShapes, info) {
  let text = `${info.background} canvas, ${info.width} by ${
    info.height
  } pixels, contains ${numShapes[0]}`;
  if (numShapes[0] === 1) {
    text = `${text} shape: ${numShapes[1]}`;
  } else {
    text = `${text} shapes: ${numShapes[1]}`;
  }
  return text;
}

//creates list of shapes
function _gridShapeDetails(idT, ingredients) {
  let shapeDetails = '';
  let shapes = '';
  let totalShapes = 0;
  for (let x in ingredients) {
    let shapeNum = 0;
    for (let y in ingredients[x]) {
      let line = `<li id="${idT}shape${totalShapes}">${
        ingredients[x][y].color
      } ${x},`;
      if (x === 'line') {
        line =
          line +
          ` location = ${ingredients[x][y].pos}, length = ${
            ingredients[x][y].length
          } pixels`;
      } else {
        line = line + ` location = ${ingredients[x][y].pos} `;
        if (x !== 'point') {
          line = line + `, area = ${ingredients[x][y].area} %`;
        }
        line = line + '</li>';
      }
      shapeDetails = shapeDetails + line;
      shapeNum++;
      totalShapes++;
    }
    if (shapeNum > 1) {
      shapes = `${shapes}, ${shapeNum} ${x}s`;
    } else {
      shapes = `${shapes} ${shapeNum} ${x}`;
    }
  }
  return { numShapes: [totalShapes, shapes], details: shapeDetails };
}

export default p5;
