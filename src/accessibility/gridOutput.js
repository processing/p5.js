/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

function gridOutput(p5, fn){
  //the functions in this file support updating the grid output

  //updates gridOutput
  fn._updateGridOutput = function(idT) {
    //if html structure is not there yet
    if (!this.dummyDOM.querySelector(`#${idT}_summary`)) {
      return;
    }
    let current = this._accessibleOutputs[idT];
    //create shape details list
    let innerShapeDetails = _gridShapeDetails(idT, this.ingredients.shapes);
    //create summary
    let innerSummary = _gridSummary(
      innerShapeDetails.numShapes,
      this.ingredients.colors.background,
      this.width,
      this.height
    );
    //create grid map
    let innerMap = _gridMap(idT, this.ingredients.shapes);
    //if it is different from current summary
    if (innerSummary !== current.summary.innerHTML) {
      //update
      current.summary.innerHTML = innerSummary;
    }
    //if it is different from current map
    if (innerMap !== current.map.innerHTML) {
      //update
      current.map.innerHTML = innerMap;
    }
    //if it is different from current shape details
    if (innerShapeDetails.details !== current.shapeDetails.innerHTML) {
      //update
      current.shapeDetails.innerHTML = innerShapeDetails.details;
    }
    this._accessibleOutputs[idT] = current;
  };

  //creates spatial grid that maps the location of shapes
  function _gridMap(idT, ingredients) {
    let shapeNumber = 0;
    let table = '';
    //create an array of arrays 10*10 of empty cells
    let cells = Array.from(Array(10), () => Array(10));
    for (let x in ingredients) {
      for (let y in ingredients[x]) {
        let fill;
        if (x !== 'line') {
          fill = `<a href="#${idT}shape${shapeNumber}">${
            ingredients[x][y].color
          } ${x}</a>`;
        } else {
          fill = `<a href="#${idT}shape${shapeNumber}">${
            ingredients[x][y].color
          } ${x} midpoint</a>`;
        }

        // Check if shape is in canvas, skip if not
        if(
          ingredients[x][y].loc.locY < cells.length &&
          ingredients[x][y].loc.locX < cells[ingredients[x][y].loc.locY].length
        ){
          //if empty cell of location of shape is undefined
          if (!cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX]) {
            //fill it with shape info
            cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] = fill;
            //if a shape is already in that location
          } else {
            //add it
            cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] =
              cells[ingredients[x][y].loc.locY][ingredients[x][y].loc.locX] +
              '  ' +
              fill;
          }
          shapeNumber++;
        }
      }
    }
    //make table based on array
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
    //goes trhough every shape type in ingredients
    for (let x in ingredients) {
      let shapeNum = 0;
      for (let y in ingredients[x]) {
        //it creates a line in a list
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
}

export default gridOutput;

if(typeof p5 !== 'undefined'){
  gridOutput(p5, p5.prototype);
}
