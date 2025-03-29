/**
 * @module IO
 * @submodule Table
 * @requires core
 */

import { stringify } from './csv';

class Table {
  constructor(rows) {
    this.columns = [];
    this.rows = [];
  }

  toString(separator=',') {
    let rows = this.rows.map((row) => row.arr);

    if(!this.columns.some((column) => column === null)){
      rows = [this.columns, ...rows,]
    }

    return stringify(rows, {
      separator
    });
  }

  /**
   *  Use <a href="/reference/p5.Table/addRow/">addRow()</a> to add a new row of data to a <a href="#/p5.Table">p5.Table</a> object. By default,
   *  an empty row is created. Typically, you would store a reference to
   *  the new row in a TableRow object (see newRow in the example above),
   *  and then set individual values using <a href="#/p5/set">set()</a>.
   *
   *  If a <a href="#/p5.TableRow">p5.TableRow</a> object is included as a parameter, then that row is
   *  duplicated and added to the table.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param   {p5.TableRow} [row] row to be added to the table
   *  @return  {p5.TableRow} the row that was added
   *
   * @example
   * <div>
   * <code>
   * // Given the CSV file "mammals.csv"
   * // in the project's "assets" folder:
   * //
   * // id,species,name
   * // 0,Capra hircus,Goat
   * // 1,Panthera pardus,Leopard
   * // 2,Equus zebra,Zebra
   *
   * let table;
   *
   * async function setup() {
   *   // Create a 300x300 canvas
   *   createCanvas(300, 300);
   *
   *   // Load the CSV file from the assets folder with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Add a new row for "Wolf"
   *   let newRow = table.addRow();
   *   newRow.setString('id', table.getRowCount() - 1);
   *   newRow.setString('species', 'Canis Lupus');
   *     newRow.setString('name', 'Wolf');
   *
   *   // Set text properties
   *   fill(0);       // Text color: black
   *    textSize(12);  // Adjust text size as needed
   *
   *   // Display the table data on the canvas
   *   // Each cell is positioned based on its row and column
   *   for (let r = 0; r < table.getRowCount(); r++) {
   *     for (let c = 0; c < table.getColumnCount(); c++) {
   *       let x = c * 50 + 10;  // Horizontal spacing for each column
   *       let y = r * 30 + 20;  // Vertical spacing for each row
   *       text(table.getString(r, c), x * c, y);
   *     }
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  addRow (row) {
  // make sure it is a valid TableRow
    const r = row || new p5.TableRow();

    if (typeof r.arr === 'undefined' || typeof r.obj === 'undefined') {
    //r = new p5.prototype.TableRow(r);
      throw new Error(`invalid TableRow: ${r}`);
    }
    r.table = this;
    this.rows.push(r);
    return r;
  }

  /**
   * Removes a row from the table object.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param   {Integer} id ID number of the row to remove
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
   *    table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Remove the first row from the table
   *   table.removeRow(0);
   *
   *   // Set text properties for drawing on the canvas
   *   fill(0);      // Set text color to black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display the table values on the canvas:
   *   // Each row's cell values are joined into a single string and drawn on a new line.
   *   let y = 20; // Starting vertical position
   *   for (let r = 0; r < table.getRowCount(); r++) {
   *     let rowText = "";
   *     for (let c = 0; c < table.getColumnCount(); c++) {
   *       rowText += table.getString(r, c) + " ";
   *     }
   *     text(rowText, 18, y * 3);
   *     y += 20;
   *   }
   * 
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  removeRow (id) {
    this.rows[id].table = null; // remove reference to table
    const chunk = this.rows.splice(id + 1, this.rows.length);
    this.rows.pop();
    this.rows = this.rows.concat(chunk);
  }

  /**
   * Returns a reference to the specified <a href="#/p5.TableRow">p5.TableRow</a>. The reference
   * can then be used to get and set values of the selected row.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param  {Integer}   rowID ID number of the row to get
   * @return {p5.TableRow} <a href="#/p5.TableRow">p5.TableRow</a> object
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas
   *   createCanvas(200, 200);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Get the row at index 1 (second row)
   *   let row = table.getRow(1);
   * 
   *   // Set text properties for drawing on the canvas
   *   fill(0);      // Set text color to black
   *   textSize(12); // Set the text size
   *
   *   // Loop over each column in the row and display its value on the canvas
   *   for (let c = 0; c < table.getColumnCount(); c++) {
   *     text(row.getString(c), 10, 20 + c * 50 + 20);
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getRow (r) {
    return this.rows[r];
  }

  /**
   *  Gets all rows from the table. Returns an array of <a href="#/p5.TableRow">p5.TableRow</a>s.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @return {p5.TableRow[]}   Array of <a href="#/p5.TableRow">p5.TableRow</a>s
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
   *   let rows = table.getRows();
   *
   *   // Warning: rows is an array of objects.
   *   // Set the 'name' of each row to 'Unicorn'
   *   for (let r = 0; r < rows.length; r++) {
   *     rows[r].set('name', 'Unicorn');
   *   }
   *
   *   // Set text properties
   *   fill(0);      // Set text color to black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display the modified table values on the canvas
   *   // We'll join each row's values with a space and display each row on a new line.
   *   let y = 20; // Starting y position
   *   for (let r = 0; r < table.getRowCount(); r++) {
   *     let rowText = "";
   *     for (let c = 0; c < table.getColumnCount(); c++) {
   *       rowText += table.getString(r, c) + " ";
   *     }
   *     text(rowText, 10, y * 2);
   *     y += 20; // Move to next line
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getRows () {
    return this.rows;
  }

  /**
   *  Finds the first row in the Table that contains the value
   *  provided, and returns a reference to that row. Even if
   *  multiple rows are possible matches, only the first matching
   *  row is returned. The column to search may be specified by
   *  either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String} value  The value to match
   *  @param  {Integer|String} column ID number or title of the
   *                                 column to search
   *  @return {p5.TableRow}
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 100x100 canvas
   *   createCanvas(100, 100);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *    // Find the row with the animal named "Zebra"
   *   let row = table.findRow('Zebra', 'name');
   *
   *   // Get the species from the found row
   *   let species = row.getString('species');
   *
   *   // Set text properties and display the species on the canvas
   *   fill(0);      // Set text color to black
   *   textSize(12); // Adjust text size as needed
   *   text(species, 10, 30);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  findRow (value, column) {
  // try the Object
    if (typeof column === 'string') {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].obj[this.columns.indexOf(column)] === value) {
          return this.rows[i];
        }
      }
    } else {
    // try the Array
      for (let j = 0; j < this.rows.length; j++) {
        if (this.rows[j].arr[column] === value) {
          return this.rows[j];
        }
      }
    }
    // otherwise...
    return null;
  }

  /**
   *  Finds the rows in the Table that contain the value
   *  provided, and returns references to those rows. Returns an
   *  Array, so for must be used to iterate through all the rows,
   *  as shown in the example above. The column to search may be
   *  specified by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String} value  The value to match
   *  @param  {Integer|String} column ID number or title of the
   *                                 column to search
   *  @return {p5.TableRow[]}        An Array of TableRow objects
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas
   *   createCanvas(200, 200);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Add another goat entry
   *   let newRow = table.addRow();
   *   newRow.setString('id', table.getRowCount() - 1);
   *   newRow.setString('species', 'Scape Goat');
   *   newRow.setString('name', 'Goat');
   *
   *   // Find rows where the name is "Goat"
   *   let rows = table.findRows('Goat', 'name');
   *
   *   // Set text properties
   *   fill(0);      // Set text color to black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display the result on the canvas
   *   text(rows.length + ' Goats found', 10, 30);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  findRows (value, column) {
    const ret = [];
    if (typeof column === 'string') {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].obj[this.columns.indexOf(column)] === value) {
          ret.push(this.rows[i]);
        }
      }
    } else {
    // try the Array
      for (let j = 0; j < this.rows.length; j++) {
        if (this.rows[j].arr[column] === value) {
          ret.push(this.rows[j]);
        }
      }
    }
    return ret;
  }

  /**
   * Finds the first row in the Table that matches the regular
   * expression provided, and returns a reference to that row.
   * Even if multiple rows are possible matches, only the first
   * matching row is returned. The column to search may be
   * specified by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param  {String|RegExp} regexp The regular expression to match
   * @param  {String|Integer} column The column ID (number) or
   *                                  title (string)
   * @return {p5.TableRow}        TableRow object
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas
   *   createCanvas(200, 200);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Search using the specified regex on column index 1 (species)
   *   let mammal = table.matchRow(new RegExp('ant'), 1);
   *   let species = mammal.getString(1);  // "Panthera pardus"
   *
   *   // Set text properties for drawing on the canvas
   *   fill(0);       // Text color: black
   *   textSize(12);  // Adjust text size as needed
   *   
   *   // Display the species on the canvas
   *   text(species, 10, 30);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  matchRow (regexp, column) {
    if (typeof column === 'number') {
      for (let j = 0; j < this.rows.length; j++) {
        if (this.rows[j].arr[column].match(regexp)) {
          return this.rows[j];
        }
      }
    } else {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].obj[this.columns.indexOf(column)].match(regexp)) {
          return this.rows[i];
        }
      }
    }
    return null;
  }

  /**
   * Finds the rows in the Table that match the regular expression provided,
   * and returns references to those rows. Returns an array, so for must be
   * used to iterate through all the rows, as shown in the example. The
   * column to search may be specified by either its ID or title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param  {String} regexp The regular expression to match
   * @param  {String|Integer} [column] The column ID (number) or
   *                                  title (string)
   * @return {p5.TableRow[]}          An Array of TableRow objects
   * @example
   * <div>
   * <code>
   * let table;
   *
   * function setup() {
   *   // Create a 200x200 canvas and set a white background
   *   createCanvas(200, 200);
   *   background(255);
   *
   *   // Create a new p5.Table and add columns
   *   table = new p5.Table();
   *   table.addColumn('name');
   *   table.addColumn('type');
   *
   *   // Add rows to the table
   *    let newRow = table.addRow();
   *   newRow.setString('name', 'Lion');
   *    newRow.setString('type', 'Mammal');
   *
   *   newRow = table.addRow();
   *   newRow.setString('name', 'Snake');
   *   newRow.setString('type', 'Reptile');
   *
   *    newRow = table.addRow();
   *   newRow.setString('name', 'Mosquito');
   *   newRow.setString('type', 'Insect');
   *
   *   newRow = table.addRow();
   *   newRow.setString('name', 'Lizard');
   *   newRow.setString('type', 'Reptile');
   *
   *   // Search for rows where the "type" starts with "R"
   *   let rows = table.matchRows('R.*', 'type');
   *
   *   // Set text properties for drawing on the canvas
   *   fill(0);       // Text color: black
   *   textSize(12);  // Text size
   *
   *   // Display each matching row on the canvas
   *   let y = 20;
   *   for (let i = 0; i < rows.length; i++) {
   *     let output = rows[i].getString('name') + ': ' + rows[i].getString('type');
   *     text(output, 10, y);
   *     y += 20;
   *   }
   * }
   * </code>
   * </div>
   */
  matchRows (regexp, column) {
    const ret = [];
    if (typeof column === 'number') {
      for (let j = 0; j < this.rows.length; j++) {
        if (this.rows[j].arr[column].match(regexp)) {
          ret.push(this.rows[j]);
        }
      }
    } else {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].obj[this.columns.indexOf(column)].match(regexp)) {
          ret.push(this.rows[i]);
        }
      }
    }
    return ret;
  }

  /**
   *  Retrieves all values in the specified column, and returns them
   *  as an array. The column may be specified by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String|Number} column String or Number of the column to return
   *  @return {Array}       Array of column values
   *
   * @example
   * <div class="norender">
   * <code>
   * // Given the CSV file "mammals.csv"
   * // in the project's "assets" folder:
   * //
   * // id,species,name
   * // 0,Capra hircus,Goat
   * // 1,Panthera pardus,Leopard
   * // 2,Equus zebra,Zebra
   *
   * let table;
   **
   * async function setup() {
   *   // The table is comma separated value "csv"
   *   // and has a header specifying the columns labels.
   *   table = await loadTable('assets/mammals.csv', 'csv', 'header');
   *
   *   //getColumn returns an array that can be printed directly
   *   print(table.getColumn('species'));
   *   //outputs ["Capra hircus", "Panthera pardus", "Equus zebra"]
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getColumn (value) {
    const ret = [];
    if (typeof value === 'string') {
      for (let i = 0; i < this.rows.length; i++) {
        ret.push(this.rows[i].obj[this.columns.indexOf(value)]);    
        }
    } else {
      for (let j = 0; j < this.rows.length; j++) {
        ret.push(this.rows[j].arr[value]);
      }
    }
    return ret;
  }

  /**
   *  Removes all rows from a Table. While all rows are removed,
   *  columns and column titles are maintained.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *
   * @example
   * <div>
   * <code>
   * // Given the CSV file "mammals.csv"
   * // in the project's "assets" folder:
   * //
   * // id,species,name
   * // 0,Capra hircus,Goat
   * // 1,Panthera pardus,Leopard
   * // 2,Equus zebra,Zebra
   *
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas
   *   createCanvas(200, 200);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
  *
   *   // Clear all rows from the table
   *   table.clearRows();
   *
   *   // Set text properties
   *   fill(0);       // Text color: black
   *   textSize(12);  // Adjust text size as needed
   *
   *   // Display the number of rows and columns on the canvas
   *   text(table.getRowCount() + ' total rows in table', 10, 30);
   *   text(table.getColumnCount() + ' total columns in table', 10, 60);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  clearRows () {
    delete this.rows;
    this.rows = [];
  }

  /**
   *  Use <a href="/reference/p5.Table/addColumn/">addColumn()</a> to add a new column to a <a href="#/p5.Table">Table</a> object.
   *  Typically, you will want to specify a title, so the column
   *  may be easily referenced later by name. (If no title is
   *  specified, the new column's title will be null.)
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param {String} [title] title of the given column
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   createCanvas(300, 300);
   *   table = await loadTable('/assets/mammals.csv', ',', 'header');
   *
   *   table.addColumn('carnivore');
   *   table.set(0, 'carnivore', 'no');
   *   table.set(1, 'carnivore', 'yes');
   *   table.set(2, 'carnivore', 'no');
   *
   *   fill(0);      // Set text color to black
   *   textSize(11); // Adjust text size as needed
   *
   *   for (let r = 0; r < table.getRowCount(); r++) {
   *     for (let c = 0; c < table.getColumnCount(); c++) {
   *       // Keep column spacing consistent (e.g. 80 pixels apart).
   *       let x = c * 80 + 10;
   *       let y = r * 30 + 20;
   *       // Use x directly, rather than multiplying by c again
   *       text(table.getString(r, c), x, y);
   *     }
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  addColumn (title) {
    const t = title || null;
    this.columns.push(t);
  }

  /**
   *  Returns the total number of columns in a Table.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @return {Integer} Number of columns in this table
   * @example
   * <div>
   * <code>
   * // given the cvs file "blobs.csv" in /assets directory
   * // ID, Name, Flavor, Shape, Color
   * // Blob1, Blobby, Sweet, Blob, Pink
   * // Blob2, Saddy, Savory, Blob, Blue
   *
   * let table;
   *
   * async function setup() {
   *   table = await loadTable('assets/blobs.csv');
   *
   *   createCanvas(200, 100);
   *   textAlign(CENTER);
   *   background(255);
   * }
   *
   * function draw() {
   *   let numOfColumn = table.getColumnCount();
   *   text('There are ' + numOfColumn + ' columns in the table.', 100, 50);
   * }
   * </code>
   * </div>
   */
  getColumnCount () {
    return this.columns.length;
  }

  /**
   *  Returns the total number of rows in a Table.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @return {Integer} Number of rows in this table
   * @example
   * <div>
   * <code>
   * // given the cvs file "blobs.csv" in /assets directory
   * //
   * // ID, Name, Flavor, Shape, Color
   * // Blob1, Blobby, Sweet, Blob, Pink
   * // Blob2, Saddy, Savory, Blob, Blue
   *
   * let table;
   *
   * async function setup() {
   *   table = await loadTable('assets/blobs.csv');
   *
   *   createCanvas(200, 100);
   *   textAlign(CENTER);
   *   background(255);
   * }
   *
   * function draw() {
   *   text('There are ' + table.getRowCount() + ' rows in the table.', 100, 50);
   * }
   * </code>
   * </div>
   */
  getRowCount () {
    return this.rows.length;
  }

  /**
   *  Removes any of the specified characters (or "tokens").
   *
   *  If no column is specified, then the values in all columns and
   *  rows are processed. A specific column may be referenced by
   *  either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String} chars  String listing characters to be removed
   *  @param  {String|Integer} [column] Column ID (number)
   *                                   or name (string)
   *
   * @example
   * <div class="norender"><code>
   * function setup() {
   *   let table = new p5.Table();
   *
   *   table.addColumn('name');
   *   table.addColumn('type');
   *
   *   let newRow = table.addRow();
   *   newRow.setString('name', '   $Lion  ,');
   *   newRow.setString('type', ',,,Mammal');
   *
   *   newRow = table.addRow();
   *   newRow.setString('name', '$Snake  ');
   *   newRow.setString('type', ',,,Reptile');
   *
   *   table.removeTokens(',$ ');
   *   print(table.getArray());
   * }
   *
   * // prints:
   * //  0  "Lion"   "Mamal"
   * //  1  "Snake"  "Reptile"
   * </code></div>
   */
  removeTokens (chars, column) {
    const escape = s => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const charArray = [];
    for (let i = 0; i < chars.length; i++) {
      charArray.push(escape(chars.charAt(i)));
    }
    const regex = new RegExp(charArray.join('|'), 'g');

    if (typeof column === 'undefined') {
      for (let c = 0; c < this.columns.length; c++) {
        for (let d = 0; d < this.rows.length; d++) {
          let s = this.rows[d].arr[c];
          s = s.replace(regex, '');
          this.rows[d].arr[c] = s;
          this.rows[d].obj[this.columns[c]] = s;
        }
      }
    } else if (typeof column === 'string') {
      for (let j = 0; j < this.rows.length; j++) {
        let val = this.rows[j].obj[column];
        val = val.replace(regex, '');
        this.rows[j].obj[column] = val;
        const pos = this.columns.indexOf(column);
        this.rows[j].arr[pos] = val;
      }
    } else {
      for (let k = 0; k < this.rows.length; k++) {
        let str = this.rows[k].arr[column];
        str = str.replace(regex, '');
        this.rows[k].arr[column] = str;
        this.rows[k].obj[this.columns[column]] = str;
      }
    }
  }

  /**
   *  Trims leading and trailing whitespace, such as spaces and tabs,
   *  from String table values. If no column is specified, then the
   *  values in all columns and rows are trimmed. A specific column
   *  may be referenced by either its ID or title.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String|Integer} [column] Column ID (number)
   *                                   or name (string)
   * @example
   * <div class="norender"><code>
   * function setup() {
   *   let table = new p5.Table();
   *
   *   table.addColumn('name');
   *   table.addColumn('type');
   *
   *   let newRow = table.addRow();
   *   newRow.setString('name', '   Lion  ,');
   *   newRow.setString('type', ' Mammal  ');
   *
   *   newRow = table.addRow();
   *   newRow.setString('name', '  Snake  ');
   *   newRow.setString('type', '  Reptile  ');
   *
   *   table.trim();
   *   print(table.getArray());
   * }
   *
   * // prints:
   * //  0  "Lion"   "Mamal"
   * //  1  "Snake"  "Reptile"
   * </code></div>
   */
  trim (column) {
    const regex = new RegExp(' ', 'g');

    if (typeof column === 'undefined') {
      for (let c = 0; c < this.columns.length; c++) {
        for (let d = 0; d < this.rows.length; d++) {
          let s = this.rows[d].arr[c];
          s = s.replace(regex, '');
          this.rows[d].arr[c] = s;
          this.rows[d].obj[this.columns[c]] = s;
        }
      }
    } else if (typeof column === 'string') {
      for (let j = 0; j < this.rows.length; j++) {
        let val = this.rows[j].obj[column];
        val = val.replace(regex, '');
        this.rows[j].obj[column] = val;
        const pos = this.columns.indexOf(column);
        this.rows[j].arr[pos] = val;
      }
    } else {
      for (let k = 0; k < this.rows.length; k++) {
        let str = this.rows[k].arr[column];
        str = str.replace(regex, '');
        this.rows[k].arr[column] = str;
        this.rows[k].obj[this.columns[column]] = str;
      }
    }
  }

  /**
   *  Use <a href="/reference/p5.Table/removeColumn/">removeColumn()</a> to remove an existing column from a Table
   *  object. The column to be removed may be identified by either
   *  its title (a String) or its index value (an int).
   *  removeColumn(0) would remove the first column, removeColumn(1)
   *  would remove the second column, and so on.
   *
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {String|Integer} column columnName (string) or ID (number)
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 100x100 canvas
   *   createCanvas(100, 100);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *    // Remove the "id" column
   *    table.removeColumn('id');
   *
   *   // Get the remaining column count
   *   let colCount = table.getColumnCount();
   *
   *   // Set text properties
   *   fill(0);      // Text color: black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display the column count on the canvas
   *   text(colCount, 40, 50);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  removeColumn (c) {
    let cString;
    let cNumber;
    if (typeof c === 'string') {
    // find the position of c in the columns
      cString = c;
      cNumber = this.columns.indexOf(c);
    } else {
      cNumber = c;
      cString = this.columns[c];
    }

    const chunk = this.columns.splice(cNumber + 1, this.columns.length);
    this.columns.pop();
    this.columns = this.columns.concat(chunk);

    for (let i = 0; i < this.rows.length; i++) {
      const tempR = this.rows[i].arr;
      const chip = tempR.splice(cNumber + 1, tempR.length);
      tempR.pop();
      this.rows[i].arr = tempR.concat(chip);
      delete this.rows[i].obj[cString];
    }
  }

  /**
   * Stores a value in the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified
   * by either its ID or title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param {Integer} row row ID
   * @param {String|Integer} column column ID (Number)
   *                               or title (String)
   * @param {String|Number} value  value to assign
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
   *   // Update the first row: change species to "Canis Lupus" and name to "Wolf"
   *   table.set(0, 'species', 'Canis Lupus');
   *   table.set(0, 'name', 'Wolf');
   *
   *   // Set text properties for drawing on the canvas
   *   fill(0);      // Text color: black
   *    textSize(12); // Adjust text size as needed
   *
   *   // Display the table values on the canvas:
   *   // Each row's values are concatenated into a single string and displayed on a new line.
   *   let y = 20; // Starting vertical position
   *   for (let r = 0; r < table.getRowCount(); r++) {
   *     let rowText = "";
   *     for (let c = 0; c < table.getColumnCount(); c++) {
   *       rowText += table.getString(r, c) + " ";
   *     }
   *     text(rowText, 10, y * 2.5);
   *     y += 20;
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  set (row, column, value) {
    this.rows[row].set(column, value);
  }

  /**
   * Stores a Float value in the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified
   * by either its ID or title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param {Integer} row row ID
   * @param {String|Integer} column column ID (Number)
   *                               or title (String)
   * @param {Number} value  value to assign
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 100x100 canvas and set a white background
   *   createCanvas(100, 100);
   *   background(255);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Set the value in row 1, column "id" to the number 1
   *   table.setNum(1, 'id', 1);
   *
   *   // Get the first column as an array and join its values into a string for display.
   *   let col0 = table.getColumn(0);  // Expected output: ["0", 1, "2"]
   *   let output = col0.join(", ");
   *
   *   // Set text properties and display the output on the canvas
   *   fill(0);      // Text color: black
   *   textSize(12); // Adjust text size as needed
   *   text(output, 30, 50);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  setNum (row, column, value) {
    this.rows[row].setNum(column, value);
  }

  /**
   * Stores a String value in the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified
   * by either its ID or title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param {Integer} row row ID
   * @param {String|Integer} column column ID (Number)
   *                               or title (String)
   * @param {String} value  value to assign
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
   *   // Load the CSV file from the assets folder with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Add a new row with the new animal data
   *   let newRow = table.addRow();
   *   newRow.setString('id', table.getRowCount() - 1);
   *   newRow.setString('species', 'Canis Lupus');
   *   newRow.setString('name', 'Wolf');
   *
   *   // Convert the table to a 2D array
   *   let tableArray = table.getArray();
   *
   *   // Set text properties
   *   fill(0);       // Set text color to black
   *   textSize(12);  // Adjust text size as needed
   *
   *   // Display each row of the table on the canvas
   *   let y = 20;  // Starting y position
   *   for (let i = 0; i < tableArray.length; i++) {
   *     // Join the values of each row with a comma separator
   *     let rowText = tableArray[i].join(', ');
   *     text(rowText, 15, y * 2);
   *     y += 20;  // Increment y position for the next row
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  setString (row, column, value) {
    this.rows[row].setString(column, value);
  }

  /**
   * Retrieves a value from the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified by
   * either its ID or title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param {Integer} row row ID
   * @param  {String|Integer} column columnName (string) or
   *                                   ID (number)
   * @return {String|Number}
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 100x100 canvas
   *   createCanvas(100, 100);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file from the assets folder with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Set text properties for drawing on the canvas
   *   fill(0);      // Text color: black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Get the values from the table
   *   let value1 = table.get(0, 1);       // Using column index (1) => "Capra hircus"
   *   let value2 = table.get(0, 'species'); // Using column name => "Capra hircus"
   *
   *   // Display the values on the canvas
   *   text(value1, 10, 30);
   *   text(value2, 10, 60);
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  get (row, column) {
    if(typeof column === 'string'){
      return this.rows[row].get(this.columns.indexOf(column));
    } else {
      return this.rows[row].get(column);
    }
  }

  /**
   * Retrieves a Float value from the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified by
   * either its ID or title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param {Integer} row row ID
   * @param  {String|Integer} column columnName (string) or
   *                                   ID (number)
   * @return {Number}
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 100x100 canvas
   *   createCanvas(100, 100);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Compute the result: id at row 1, column 0 plus 100 (i.e. 1 + 100 = 101)
   *   let result = table.getNum(1, 0) + 100;
   *   
   *   // Set text properties and display the result on the canvas
   *   fill(0);      // Set text color to black
   *   textSize(12); // Adjust text size as needed
   *   text(result, 10, 30);  // Display the result at position (10, 30)
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getNum (row, column) {
    return this.rows[row].getNum(column);
  }

  /**
   * Retrieves a String value from the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified by
   * either its ID or title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param {Integer} row row ID
   * @param  {String|Integer} column columnName (string) or
   *                                   ID (number)
   * @return {String}
   *
   * @example
   * <div>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas
   *   createCanvas(200, 200);
   *   background(255); // Set background to white
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Set text properties
   *   fill(0);      // Text color: black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display each table cell value on the canvas one below the other.
   *   // We use a variable 'y' to increment the vertical position.
   *   let y = 20;
   *   text(table.getString(0, 0), 10, y); // 0
   *   y += 20;
   *   text(table.getString(0, 1), 10, y); // Capra hircus
   *   y += 20;
   *   text(table.getString(0, 2), 10, y); // Goat
   *   y += 20;
   *   text(table.getString(1, 0), 10, y); // 1
   *   y += 20;
   *   text(table.getString(1, 1), 10, y); // Panthera pardus
   *   y += 20;
   *   text(table.getString(1, 2), 10, y); // Leopard
   *   y += 20;
   *   text(table.getString(2, 0), 10, y); // 2
   *   y += 20;
   *   text(table.getString(2, 1), 10, y); // Equus zebra
   *   y += 20;
   *   text(table.getString(2, 2), 10, y); // Zebra
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getString (row, column) {
    return this.rows[row].getString(column);
  }

  /**
   * Retrieves all table data and returns as an object. If a column name is
   * passed in, each row object will be stored with that attribute as its
   * title.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param {String} [headerColumn] Name of the column which should be used to
   *                              title each row object (optional)
   * @return {Object}
   *
   * @example
   * <div class="norender">
   * <code>
   * // Given the CSV file "mammals.csv"
   * // in the project's "assets" folder:
   * //
   * // id,species,name
   * // 0,Capra hircus,Goat
   * // 1,Panthera pardus,Leopard
   * // 2,Equus zebra,Zebra
   *
   * let table;
   *
   * async function setup() {
   *   // The table is comma separated value "csv"
   *   // and has a header specifying the columns labels.
   *   table = await loadTable('assets/mammals.csv', 'csv', 'header');
   *
   *   let tableObject = table.getObject();
   *
   *   print(tableObject);
   *   //outputs an object
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getObject (headerColumn) {
    const tableObject = {};
    let obj, cPos, index;

    for (let i = 0; i < this.rows.length; i++) {
      obj = this.rows[i].obj;

      if (typeof headerColumn === 'string') {
        cPos = this.columns.indexOf(headerColumn); // index of columnID
        if (cPos >= 0) {
          index = obj[headerColumn];
          tableObject[index] = obj;
        } else {
          throw new Error(`This table has no column named "${headerColumn}"`);
        }
      } else {
        tableObject[i] = this.rows[i].obj;
      }
    }
    return tableObject;
  }

  /**
   * Retrieves all table data and returns it as a multidimensional array.
   *
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @return {Array}
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
   *   // Get the CSV data as a 2D array
   *   let tableArray = table.getArray();
   *
   *   // Set text properties
   *   fill(0);      // Set text color to black
   *   textSize(12); // Adjust text size as needed
   *
   *   // Display each row of the CSV on the canvas
   *   // Each row is displayed on a separate line
   *   for (let i = 0; i < tableArray.length; i++) {
   *     let rowText = tableArray[i].join(", ");
   *     text(rowText, 10, 20 + i * 50 + 30);
   *   }
   *
   *   describe('no image displayed');
   * }
   * </code>
   * </div>
   */
  getArray () {
    const tableArray = [];
    for (let i = 0; i < this.rows.length; i++) {
      tableArray.push(this.rows[i].arr);
    }
    return tableArray;
  }
};

function table(p5, fn){
  /**
   *  Table Options
   *  Generic class for handling tabular data, typically from a
   *  CSV, TSV, or other sort of spreadsheet file.
   *  CSV files are
   *  <a href="http://en.wikipedia.org/wiki/Comma-separated_values">
   *  comma separated values</a>, often with the data in quotes. TSV
   *  files use tabs as separators, and usually don't bother with the
   *  quotes.
   *  File names should end with .csv if they're comma separated.
   *  A rough "spec" for CSV can be found
   *  <a href="http://tools.ietf.org/html/rfc4180">here</a>.
   *  To load files, use the <a href="#/p5/loadTable">loadTable</a> method.
   *  To save tables to your computer, use the <a href="#/p5/save">save</a> method
   *   or the <a href="#/p5/saveTable">saveTable</a> method.
   *
   *  Possible options include:
   *  <ul>
   *  <li>csv - parse the table as comma-separated values
   *  <li>tsv - parse the table as tab-separated values
   *  <li>header - this table has a header (title) row
   *  </ul>
   */

  /**
   *  <a href="#/p5.Table">Table</a> objects store data with multiple rows and columns, much
   *  like in a traditional spreadsheet. Tables can be generated from
   *  scratch, dynamically, or using data from an existing file.
   *
   *  @class p5.Table
   *  @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   *  @param  {p5.TableRow[]}     [rows] An array of p5.TableRow objects
   */
  p5.Table = Table;

  /**
   * An array containing the names of the columns in the table, if the "header" the table is
   * loaded with the "header" parameter.
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @type {String[]}
   * @property columns
   * @for p5.Table
   * @name columns
   * @example
   * <div >
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas
   *   createCanvas(200, 200);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Set text properties for drawing on the canvas
   *   fill(0);       // Set text color to black
   *   textSize(12);  // Adjust text size as needed
   *
   *   // Display the column names on the canvas
   *   for (let c = 0; c < table.getColumnCount(); c++) {
   *     text('column ' + c + ' is named ' + table.columns[c], 10, 30 + c * 20);
   *   }
   * }
   * </code>
   * </div>
   */

  /**
   * An array containing the <a href="#/p5.Table">p5.TableRow</a> objects that make up the
   * rows of the table. The same result as calling <a href="/reference/p5.Table/getRows/">getRows()</a>
   * @type {p5.TableRow[]}
   * @property rows
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @for p5.Table
   * @name rows
  */
}

export default table;

if(typeof p5 !== 'undefined'){
  table(p5, p5.prototype);
}
