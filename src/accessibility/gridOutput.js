/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */
import p5 from '../core/main';

//the functions in this document support the creation of grid output

//creates output content
p5.prototype._updateGridOutput = function(idT) {
  if (!this.dummyDOM.querySelector(`#${idT}Summary`)) {
    return;
  }
  let current = this._accessibleOutputs[idT];
  let innerShapeDetails = _gridShapeDetails(idT, this.ingredients.shapes);
  let innerSummary = _gridSummary(
    innerShapeDetails.numShapes,
    this.ingredients.colors.background,
    this.width,
    this.height
  );
  let innerMap = _gridMap(idT, this.ingredients.shapes);
  if (innerSummary !== current.summary) {
    this.dummyDOM.querySelector(`#${idT}Summary`).innerHTML = innerSummary;
    current.summary = innerSummary;
  }
  if (innerMap !== current.map) {
    this.dummyDOM.querySelector(`#${idT}OD`).innerHTML = innerMap;
    current.map = innerMap;
  }
  if (innerShapeDetails.details !== current.shapeDetails) {
    this.dummyDOM.querySelector(`#${idT}SD`).innerHTML =
      innerShapeDetails.details;
    current.shapeDetails = innerShapeDetails.details;
  }
  this._accessibleOutputs[idT] = current;
};

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
      let fill = `<a href="#${idT}shape${shapeNumber}">${
        ingredients[x][y].color
      } ${x}</a>`;
      if (!cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX]) {
        cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] = fill;
      } else {
        cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] =
          cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] +
          '  ' +
          fill;
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
function _gridSummary(numShapes, background, width, height) {
  let text = `${background} canvas, ${width} by ${height} pixels, contains ${
    numShapes[0]
  }`;
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
        line = line + ` location = ${ingredients[x][y].pos}`;
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
      shapes = `${shapes} ${shapeNum} ${x}s`;
    } else {
      shapes = `${shapes} ${shapeNum} ${x}`;
    }
  }
  return { numShapes: [totalShapes, shapes], details: shapeDetails };
}

export default p5;
