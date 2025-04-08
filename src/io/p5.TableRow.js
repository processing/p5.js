/**
 * @module IO
 * @submodule Table
 * @requires core
 */

class TableRow {
  constructor(row=[]){
    let arr = row;

    this.arr = arr;
    this.obj = Object.fromEntries(arr.entries());
    this.table = null;
  }

  /**
   *  Stores a value in the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param {String|Integer} column Column ID (Number)
   *                                or Title (String)
   *  @param {String|Number} value  The value to be stored
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas and set a white background
   *   createCanvas(200, 200);
   *   background(255);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Set every row's "name" to "Unicorn"
   *    let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     rows[r].set('name', 'Unicorn');
   *   }
   *
   *   // Convert the table to an array
   *   let tableArray = table.getArray();
   *
   *   // Set text properties
   *   fill(0);      // Set text color to black
   *   textSize(12); // Set text size
   *
   *   // Display each row of the table on the canvas
   *   let y = 20; // Starting y position
   *   for (let i = 0; i < tableArray.length; i++) {
   *     let rowText = tableArray[i].join(', ');
   *     text(rowText, 10, y * 2.5);
   *     y += 20; // Increment y position for the next row
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  set(column, value) {
  // if typeof column is string, use .obj
    if (typeof column === 'string') {
      const cPos = this.table.columns.indexOf(column); // index of columnID
      if (cPos >= 0) {
        this.obj[column] = value;
        this.arr[cPos] = value;
      } else {
        throw new Error(`This table has no column named "${column}"`);
      }
    } else {
    // if typeof column is number, use .arr
      if (column < this.table.columns.length) {
        this.arr[column] = value;
        const cTitle = this.table.columns[column];
        this.obj[cTitle] = value;
      } else {
        throw new Error(`Column #${column} is out of the range of this table`);
      }
    }
  }

  /**
   *  Stores a Float value in the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param {String|Integer} column Column ID (Number)
   *                                or Title (String)
   *  @param {Number|String} value  The value to be stored
   *                                as a Float
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas and set a white background
   *   createCanvas(200, 200);
   *   background(255);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Update each row's "id" to (row index + 10)
   *   let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     rows[r].setNum('id', r + 10);
   *   }
   *
   *   // Convert the table to a 2D array for display
   *   let tableArray = table.getArray();
   *
   *   // Set text properties
   *   fill(0);      // Text color: black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display each row of the table on the canvas
   *   let y = 20;   // Starting y position
   *   for (let i = 0; i < tableArray.length; i++) {
   *     // Join each row's values with a comma separator
   *     let rowText = tableArray[i].join(', ');
   *     text(rowText, 10, y * 2.5);
   *     y += 20;  // Increment y for the next row
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  setNum(column, value) {
    const floatVal = parseFloat(value);
    this.set(column, floatVal);
  }

  /**
   *  Stores a String value in the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param {String|Integer} column Column ID (Number)
   *                                or Title (String)
   *  @param {String|Number|Boolean|Object} value  The value to be stored
   *                                as a String
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 300x200 canvas and set a white background
   *   createCanvas(300, 200);
   *   background(255);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Update each row's "name" field
   *   let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     let name = rows[r].getString('name');
   *     rows[r].setString('name', 'A ' + name + ' named George');
   *   }
   *
   *   // Convert the table to a 2D array for display
   *   let tableArray = table.getArray();
   *
   *   // Set text properties
   *   fill(0);      // Text color: black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display each row of the table on the canvas
   *   let y = 20;   // Starting y position
   *   for (let i = 0; i < tableArray.length; i++) {
   *     let rowText = tableArray[i].join(', ');
   *     text(rowText, 10, y * 2.5);
   *     y += 20;    // Increment y for the next row
   *   }
   *
   *   // describe('no image displayed');
   * }
   * </code>
   */
  setString(column, value) {
    const stringVal = value.toString();
    this.set(column, stringVal);
  }

  /**
   *  Retrieves a value from the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String|Integer} column columnName (string) or
   *                                   ID (number)
   *  @return {String|Number}
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x100 canvas and set a white background
   *   createCanvas(200, 100);
   *   background(255);
   *
   *   // Load the CSV file with a header row
   *    table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Extract the names from each row and store them in an array
   *   let names = [];
   *   let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     names.push(rows[r].get('name'));
   *   }
   *
   *   // Set text properties and display the names on the canvas
   *   fill(0);      // Set text color to black
   *   textSize(12); // Set text size
   *
   *   // Join names into a single string separated by commas
   *   let namesText = names.join(', ');
   *   text(namesText, 35, 50);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  get(column) {
    if (typeof column === 'string') {
      return this.obj[this.table.columns.indexOf(column)];
    } else {
      return this.arr[column];
    }
  }

  /**
   *  Retrieves a Float value from the TableRow's specified
   *  column. The column may be specified by either its ID or
   *  title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String|Integer} column columnName (string) or
   *                                   ID (number)
   *  @return {Number}  Float Floating point number
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x100 canvas and set a white background
   *   createCanvas(200, 100);
   *   background(255);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   let rows = table.getRows();
   *   let minId = Infinity;
   *   let maxId = -Infinity;
   *   
   *   for (let r = 0; r < rows.length; r++) {
   *     let id = rows[r].getNum('id');
   *     minId = min(minId, id);
   *     maxId = max(maxId, id);
   *    }
   * 
   *   let result = 'minimum id = ' + minId + ', maximum id = ' + maxId;
   *
   *   // Set text properties and display the result on the canvas
   *   fill(0);      // Set text color to black
   *   textSize(12); // Set text size
   *   text(result, 10, 50);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getNum(column) {
    let ret;
    if (typeof column === 'string') {
      ret = parseFloat(this.obj[this.table.columns.indexOf(column)]);
    } else {
      ret = parseFloat(this.arr[column]);
    }

    if (ret.toString() === 'NaN') {
      throw `Error: ${this.obj[column]} is NaN (Not a Number)`;
    }
    return ret;
  }

  /**
   *  Retrieves an String value from the TableRow's specified
   *  column. The column may be specified by either its ID or
   *  title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)

   *  @param  {String|Integer} column columnName (string) or
   *                                   ID (number)
   *  @return {String}  String
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x100 canvas and set a white background
   *   createCanvas(200, 100);
   *   background(255);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   let rows = table.getRows();
   *   let longest = '';
   *   for (let r = 0; r < rows.length; r++) {
   *      let species = rows[r].getString('species');
   *      if (longest.length < species.length) {
   *       longest = species;
   *     }
   *   }
   *
   *   let result = 'longest: ' + longest;
   *
   *   // Set text properties and display the result on the canvas
   *   fill(0);      // Set text color to black
   *   textSize(12); // Set text size
   *   text(result, 30, 50);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getString(column) {
    if (typeof column === 'string') {
      return this.obj[this.table.columns.indexOf(column)].toString();
    } else {
      return this.arr[column].toString();
    }
  }
};

function tableRow(p5, fn){
  /**
   *  A TableRow object represents a single row of data values,
   *  stored in columns, from a table.
   *
   *  A Table Row contains both an ordered array, and an unordered
   *  JSON object.
   *
   *  @class p5.TableRow
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @constructor
   *  @param {any[]} row         optional: populate the row with an
   *                              array of values
   */
  p5.TableRow = TableRow;
}

export default tableRow;

if(typeof p5 !== 'undefined'){
  tableRow(p5, p5.prototype);
}
