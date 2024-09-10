/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

function textOutput(p5, fn){
  //the functions in this file support updating the text output

  //updates textOutput
  fn._updateTextOutput = function(idT) {
    //if html structure is not there yet
    if (!this.dummyDOM.querySelector(`#${idT}_summary`)) {
      return;
    }
    let current = this._accessibleOutputs[idT];
    //create shape list
    let innerList = _shapeList(idT, this.ingredients.shapes);
    //create output summary
    let innerSummary = _textSummary(
      innerList.numShapes,
      this.ingredients.colors.background,
      this.width,
      this.height
    );
    //create shape details
    let innerShapeDetails = _shapeDetails(idT, this.ingredients.shapes);
    //if it is different from current summary
    if (innerSummary !== current.summary.innerHTML) {
      //update
      current.summary.innerHTML = innerSummary;
    }
    //if it is different from current shape list
    if (innerList.listShapes !== current.list.innerHTML) {
      //update
      current.list.innerHTML = innerList.listShapes;
    }
    //if it is different from current shape details
    if (innerShapeDetails !== current.shapeDetails.innerHTML) {
      //update
      current.shapeDetails.innerHTML = innerShapeDetails;
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
    //goes trhough every shape type in ingredients
    for (let x in ingredients) {
      //and for every shape
      for (let y in ingredients[x]) {
        //it creates a table row
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
    //goes trhough every shape type in ingredients
    for (let x in ingredients) {
      for (let y in ingredients[x]) {
        //it creates a line in a list
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
          _line = _line + '.</li>';
        }
        shapeList = shapeList + _line;
        shapeNumber++;
      }
    }
    return { numShapes: shapeNumber, listShapes: shapeList };
  }
}

export default textOutput;

if(typeof p5 !== 'undefined'){
  textOutput(p5, p5.prototype);
}
