/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */
import p5 from '../core/main';

//the functions in this document support the creation of grid output

let ingredients = {};
let background;
let dummy = { summary: '', map: '', shapeDetails: '' };

//creates html structure
p5.prototype._createGridOutput = function(cIdT) {
  let inner = `Grid Output<p id="${cIdT}Summary" aria-label="grid output summary"><table id="${cIdT}OD" summary="grid output content"></table><ul id="${cIdT}SD" aria-label="grid output shape details"></ul>`;
  return inner;
};

//creates output content
p5.prototype._updateGridOutput = function(cnvId, ing, bkgr) {
  ingredients = ing;
  background = bkgr;
  let cIdT = cnvId + 'grOut';
  let innerShapeDetails = _buildGridShapeDetails(cIdT);
  let innerSummary = _buildGridSummary(
    innerShapeDetails.numShapes,
    this.width,
    this.height
  );
  let innerMap = _buildGridMap(cIdT);
  if (innerSummary !== dummy.summary) {
    document.getElementById(cIdT + 'Summary').innerHTML = innerSummary;
    dummy.summary = innerSummary;
  }
  if (innerMap !== dummy.map) {
    document.getElementById(cIdT + 'OD').innerHTML = innerMap;
    dummy.map = innerMap;
  }
  if (innerShapeDetails.details !== dummy.shapeDetails) {
    document.getElementById(cIdT + 'SD').innerHTML = innerShapeDetails.details;
    dummy.shapeDetails = innerShapeDetails.details;
  }
};

//creates spatial grid
function _buildGridMap(cId) {
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
        ] = `<a href="#${cId}shape${shapeNumber}">${
          ingredients[x][y].color
        } ${x}</a>`;
      } else {
        cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] =
          cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] +
          `  <a href="#${cId}shape${shapeNumber}">${
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
function _buildGridSummary(numShapes, canvasWidth, canvasHeight) {
  return `${background} canvas, ${canvasWidth} by ${canvasHeight} pixels, contains ${
    numShapes[0]
  } shapes: ${numShapes[1]}`;
}

//creates list of shapes
function _buildGridShapeDetails(cId) {
  let shapeDetails = '';
  let shapes = '';
  let totalShapes = 0;
  for (let x in ingredients) {
    let shapeNum = 0;
    for (let y in ingredients[x]) {
      let line = `<li id="${cId}shape${totalShapes}">${
        ingredients[x][y].color
      } ${x},`;
      if (x === 'line') {
        line =
          line +
          ` location = ${ingredients[x][y].pos}, length = ${
            ingredients[x][y].length
          } pixels`;
      } else {
        line = line + ` location = at ${ingredients[x][y].pos} `;
        if (x !== 'point') {
          line = line + `, area = ${ingredients[x][y].area} %`;
        }
        line = line + '</li>';
      }
      shapeDetails = shapeDetails + line;
      shapeNum++;
      totalShapes++;
    }
    shapes = `${shapes}, ${shapeNum} ${x}`;
    if (shapeNum > 1) {
      shapes = shapes + 's';
    }
  }
  return { numShapes: [totalShapes, shapes], details: shapeDetails };
}

export default p5;
