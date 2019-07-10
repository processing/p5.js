/**
 * @module IO
 * @submodule Table
 * @requires core
 */

'use strict';

import p5 from '../core/main';

/**
 *  A TableRow object represents a single row of data values,
 *  stored in columns, from a table.
 *
 *  A Table Row contains both an ordered array, and an unordered
 *  JSON object.
 *
 *  @class p5.TableRow
 *  @constructor
 *  @param {String} [str]       optional: populate the row with a
 *                              string of values, separated by the
 *                              separator
 *  @param {String} [separator] comma separated values (csv) by default
 */
p5.TableRow = function(str, separator) {
  var arr = [];
  var obj = {};
  if (str) {
    separator = separator || ',';
    arr = str.split(separator);
  }
  for (var i = 0; i < arr.length; i++) {
    var key = i;
    var val = arr[i];
    obj[key] = val;
  }
  this.arr = arr;
  this.obj = obj;
  this.table = null;
};

/**
 *  Stores a value in the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  set
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
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   let rows = table.getRows();
 *   for (let r = 0; r < rows.length; r++) {
 *     rows[r].set('name', 'Unicorn');
 *   }
 *
 *   //print the results
 *   print(table.getArray());
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 */
p5.TableRow.prototype.set = function(column, value) {
  // if typeof column is string, use .obj
  if (typeof column === 'string') {
    var cPos = this.table.columns.indexOf(column); // index of columnID
    if (cPos >= 0) {
      this.obj[column] = value;
      this.arr[cPos] = value;
    } else {
      throw new Error('This table has no column named "' + column + '"');
    }
  } else {
    // if typeof column is number, use .arr
    if (column < this.table.columns.length) {
      this.arr[column] = value;
      var cTitle = this.table.columns[column];
      this.obj[cTitle] = value;
    } else {
      throw new Error(
        'Column #' + column + ' is out of the range of this table'
      );
    }
  }
};

/**
 *  Stores a Float value in the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  setNum
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
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   let rows = table.getRows();
 *   for (let r = 0; r < rows.length; r++) {
 *     rows[r].setNum('id', r + 10);
 *   }
 *
 *   print(table.getArray());
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 */
p5.TableRow.prototype.setNum = function(column, value) {
  var floatVal = parseFloat(value);
  this.set(column, floatVal);
};

/**
 *  Stores a String value in the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  setString
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
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   let rows = table.getRows();
 *   for (let r = 0; r < rows.length; r++) {
 *     let name = rows[r].getString('name');
 *     rows[r].setString('name', 'A ' + name + ' named George');
 *   }
 *
 *   print(table.getArray());
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 */
p5.TableRow.prototype.setString = function(column, value) {
  var stringVal = value.toString();
  this.set(column, stringVal);
};

/**
 *  Retrieves a value from the TableRow's specified column.
 *  The column may be specified by either its ID or title.
 *
 *  @method  get
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
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   let names = [];
 *   let rows = table.getRows();
 *   for (let r = 0; r < rows.length; r++) {
 *     names.push(rows[r].get('name'));
 *   }
 *
 *   print(names);
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 */
p5.TableRow.prototype.get = function(column) {
  if (typeof column === 'string') {
    return this.obj[column];
  } else {
    return this.arr[column];
  }
};

/**
 *  Retrieves a Float value from the TableRow's specified
 *  column. The column may be specified by either its ID or
 *  title.
 *
 *  @method  getNum
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
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
 *   let rows = table.getRows();
 *   let minId = Infinity;
 *   let maxId = -Infinity;
 *   for (let r = 0; r < rows.length; r++) {
 *     let id = rows[r].getNum('id');
 *     minId = min(minId, id);
 *     maxId = min(maxId, id);
 *   }
 *   print('minimum id = ' + minId + ', maximum id = ' + maxId);
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 */
p5.TableRow.prototype.getNum = function(column) {
  var ret;
  if (typeof column === 'string') {
    ret = parseFloat(this.obj[column]);
  } else {
    ret = parseFloat(this.arr[column]);
  }

  if (ret.toString() === 'NaN') {
    throw 'Error: ' + this.obj[column] + ' is NaN (Not a Number)';
  }
  return ret;
};

/**
 *  Retrieves an String value from the TableRow's specified
 *  column. The column may be specified by either its ID or
 *  title.
 *
 *  @method  getString
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
 * function preload() {
 *   //my table is comma separated value "csv"
 *   //and has a header specifying the columns labels
 *   table = loadTable('assets/mammals.csv', 'csv', 'header');
 * }
 *
 * function setup() {
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
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 */
p5.TableRow.prototype.getString = function(column) {
  if (typeof column === 'string') {
    return this.obj[column].toString();
  } else {
    return this.arr[column].toString();
  }
};

export default p5;
