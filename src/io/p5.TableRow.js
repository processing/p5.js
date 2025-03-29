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
   * <div class="norender"><code>
   * // Given the CSV file "mammals.csv" in the project's "assets" folder:
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
   *   let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     rows[r].set('name', 'Unicorn');
   *   }
   *
   *   //print the results
   *   print(table.getArray());
   *
   *   describe('no image displayed');
   * }
   * </code></div>
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
   * <div class="norender"><code>
   * // Given the CSV file "mammals.csv" in the project's "assets" folder:
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
   *   let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     rows[r].setNum('id', r + 10);
   *   }
   *
   *   print(table.getArray());
   *
   *   describe('no image displayed');
   * }
   * </code></div>
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
   * <div class="norender"><code>
   * // Given the CSV file "mammals.csv" in the project's "assets" folder:
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
   *   let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     let name = rows[r].getString('name');
   *     rows[r].setString('name', 'A ' + name + ' named George');
   *   }
   *
   *   print(table.getArray());
   *
   *   describe('no image displayed');
   * }
   * </code></div>
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
   * <div class="norender"><code>
   * // Given the CSV file "mammals.csv" in the project's "assets" folder:
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
   *   let names = [];
   *   let rows = table.getRows();
   *   for (let r = 0; r < rows.length; r++) {
   *     names.push(rows[r].get('name'));
   *   }
   *
   *   print(names);
   *
   *   describe('no image displayed');
   * }
   * </code></div>
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
   * <div class="norender"><code>
   * // Given the CSV file "mammals.csv" in the project's "assets" folder:
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
   *   let rows = table.getRows();
   *   let minId = Infinity;
   *   let maxId = -Infinity;
   *   for (let r = 0; r < rows.length; r++) {
   *     let id = rows[r].getNum('id');
   *     minId = min(minId, id);
   *     maxId = min(maxId, id);
   *   }
   *   print('minimum id = ' + minId + ', maximum id = ' + maxId);
   *   describe('no image displayed');
   * }
   * </code></div>
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
   * <div class="norender"><code>
   * // Given the CSV file "mammals.csv" in the project's "assets" folder:
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
   *   let rows = table.getRows();
   *   let longest = '';
   *   for (let r = 0; r < rows.length; r++) {
   *     let species = rows[r].getString('species');
   *     if (longest.length < species.length) {
   *       longest = species;
   *     }
   *   }
   *
   *   print('longest: ' + longest);
   *
   *   describe('no image displayed');
   * }
   * </code></div>
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
