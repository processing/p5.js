/**
 * @module Data
 * @submodule Table
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');


  /**
   *  Table Options
   *  <p>Generic class for handling tabular data, typically from a
   *  CSV, TSV, or other sort of spreadsheet file.</p>
   *  <p>CSV files are
   *  <a href="http://en.wikipedia.org/wiki/Comma-separated_values">
   *  comma separated values</a>, often with the data in quotes. TSV
   *  files use tabs as separators, and usually don't bother with the
   *  quotes.</p>
   *  <p>File names should end with .csv if they're comma separated.</p>
   *  <p>A rough "spec" for CSV can be found
   *  <a href="http://tools.ietf.org/html/rfc4180">here</a>.</p>
   *  <p>To load files, use the loadTable method.</p>
   *
   *  Possible options include:
   *  <ul>
   *  <li>csv - parse the table as comma-separated values
   *  <li>tsv - parse the table as tab-separated values
   *  <li>header - this table has a header (title) row
   *  </ul>
   */

  /**
   *  Table objects store data with multiple rows and columns, much
   *  like in a traditional spreadsheet. Tables can be generated from
   *  scratch, dynamically, or using data from an existing file.
   *
   *  @class p5.Table
   *  @constructor
   *  @param  {Array}     [rows] An array of p5.TableRow objects
   *  @return {p5.Table}         p5.Table generated
   */
  p5.Table = function (rows) {
    /**
     *  @property columns
     *  @type {Array}
     */
    this.columns = [];

    /**
     *  @property rows
     *  @type {Array}
     */
    this.rows = [];
  };

  /**
   *  Use addRow() to add a new row of data to a p5.Table object. By default,
   *  an empty row is created. Typically, you would store a reference to
   *  the new row in a TableRow object (see newRow in the example above),
   *  and then set individual values using set().
   *
   *  If a p5.TableRow object is included as a parameter, then that row is
   *  duplicated and added to the table.
   *  
   *  @method  addRow
   *  @param   {p5.TableRow} [row] row to be added to the table
   */
  p5.Table.prototype.addRow = function(row) {
    // make sure it is a valid TableRow
    var r = row || new p5.TableRow();

    if (typeof(r.arr) === 'undefined' || typeof(r.obj) === 'undefined') {
      //r = new p5.prototype.TableRow(r);
      throw 'invalid TableRow: ' + r;
    }
    r.table = this;
    this.rows.push(r);
    return r;
  };

  /**
   * Removes a row from the table object.
   *
   * @method  removeRow
   * @param   {Number} id ID number of the row to remove
   */
  p5.Table.prototype.removeRow = function(id) {
    this.rows[id].table = null; // remove reference to table
    var chunk = this.rows.splice(id+1, this.rows.length);
    this.rows.pop();
    this.rows = this.rows.concat(chunk);
  };


  /**
   * Returns a reference to the specified p5.TableRow. The reference
   * can then be used to get and set values of the selected row.
   *  
   * @method  getRow
   * @param  {Number}   rowID ID number of the row to get
   * @return {TableRow} p5.TableRow object
   */
  p5.Table.prototype.getRow = function(r) {
    return this.rows[r];
  };

  /**
   *  Gets all rows from the table. Returns an array of p5.TableRows.
   *  
   *  @method  getRows
   *  @return {Array}   Array of p5.TableRows
   */
  p5.Table.prototype.getRows = function() {
    return this.rows;
  };

  /**
   *  Finds the first row in the Table that contains the value
   *  provided, and returns a reference to that row. Even if
   *  multiple rows are possible matches, only the first matching
   *  row is returned. The column to search may be specified by
   *  either its ID or title.
   *
   *  @method  findRow
   *  @param  {String} value  The value to match
   *  @param  {Number|String} column ID number or title of the
   *                                 column to search
   *  @return {TableRow}
   */
  p5.Table.prototype.findRow = function(value, column) {
    // try the Object
    if (typeof(column) === 'string') {
      for (var i = 0; i < this.rows.length; i++){
        if (this.rows[i].obj[column] === value) {
          return this.rows[i];
        }
      }
    }
    // try the Array
    else {
      for (var j = 0; j < this.rows.length; j++){
        if (this.rows[j].arr[column] === value) {
          return this.rows[j];
        }
      }
    }
    // otherwise...
    return null;
  };

  /**
   *  Finds the rows in the Table that contain the value
   *  provided, and returns references to those rows. Returns an
   *  Array, so for must be used to iterate through all the rows,
   *  as shown in the example above. The column to search may be
   *  specified by either its ID or title.
   *
   *  @method  findRows
   *  @param  {String} value  The value to match
   *  @param  {Number|String} column ID number or title of the
   *                                 column to search
   *  @return {Array}        An Array of TableRow objects
   */
  p5.Table.prototype.findRows = function(value, column) {
    var ret = [];
    if (typeof(column) === 'string') {
      for (var i = 0; i < this.rows.length; i++){
        if (this.rows[i].obj[column] === value) {
          ret.push( this.rows[i] );
        }
      }
    }
    // try the Array
    else {
      for (var j = 0; j < this.rows.length; j++){
        if (this.rows[j].arr[column] === value) {
          ret.push( this.rows[j] );
        }
      }
    }
    return ret;
  };

  /**
   *  Finds the first row in the Table that matches the regular
   *  expression provided, and returns a reference to that row.
   *  Even if multiple rows are possible matches, only the first
   *  matching row is returned. The column to search may be
   *  specified by either its ID or title.
   *  
   *  @method  matchRow
   *  @param  {String} regexp The regular expression to match
   *  @param  {String|Number} column The column ID (number) or 
   *                                   title (string)
   *  @return {TableRow}        TableRow object
   */
  p5.Table.prototype.matchRow = function(regexp, column) {
    if (typeof(column) === 'number') {
      for (var j = 0; j < this.rows.length; j++) {
        if ( this.rows[j].arr[column].match(regexp) ) {
          return this.rows[j];
        }
      }
    }

    else {
      for (var i = 0; i < this.rows.length; i++) {
        if ( this.rows[i].obj[column].match(regexp) ) {
          return this.rows[i];
        }
      }
    }
    return null;
  };

  /**
   *  Finds the first row in the Table that matches the regular
   *  expression provided, and returns a reference to that row.
   *  Even if multiple rows are possible matches, only the first
   *  matching row is returned. The column to search may be specified
   *  by either its ID or title.
   *
   *  @method  matchRows
   *  @param  {String} regexp The regular expression to match
   *  @param  {String|Number} [column] The column ID (number) or 
   *                                   title (string)
   *  @return {Array}        An Array of TableRow objects
   */
  p5.Table.prototype.matchRows = function(regexp, column) {
    var ret = [];
    if (typeof(column) === 'number') {
      for (var j = 0; j < this.rows.length; j++) {
        if ( this.rows[j].arr[column].match(regexp) ) {
          ret.push( this.rows[j] );
        }
      }
    }

    else {
      for (var i = 0; i < this.rows.length; i++) {
        if ( this.rows[i].obj[column].match(regexp) ) {
          ret.push( this.rows[i] );
        }
      }
    }
    return ret;
  };


  /**
   *  Retrieves all values in the specified column, and returns them
   *  as an array. The column may be specified by either its ID or title.
   *
   *  @method  getColumn
   *  @param  {String|Number} column String or Number of the column to return
   *  @return {Array}       Array of column values
   */
  p5.Table.prototype.getColumn = function(value) {
    var ret = [];
    if (typeof(value) === 'string'){
      for (var i = 0; i < this.rows.length; i++){
        ret.push (this.rows[i].obj[value]);
      }
    } else {
      for (var j = 0; j < this.rows.length; j++){
        ret.push (this.rows[j].arr[value]);
      }
    }
    return ret;
  };

  /**
   *  Removes all rows from a Table. While all rows are removed,
   *  columns and column titles are maintained.
   *
   *  @method  clearRows
   */
  p5.Table.prototype.clearRows = function() {
    delete this.rows;
    this.rows = [];
  };

  /**
   *  Use addColumn() to add a new column to a Table object.
   *  Typically, you will want to specify a title, so the column
   *  may be easily referenced later by name. (If no title is
   *  specified, the new column's title will be null.)
   *
   *  @method  addColumn
   *  @param {String} [title] Title of the given column
   */
  p5.Table.prototype.addColumn = function(title) {
    var t = title || null;
    this.columns.push(t);
  };

  /**
   *  Returns the total number of columns in a Table.
   *  
   *  @return {Number} Number of columns in this table
   */
  p5.Table.prototype.getColumnCount = function() {
    return this.columns.length;
  };

  /**
   *  Returns the total number of rows in a Table.
   *
   *  @method  getRowCount
   *  @return {Number} Number of rows in this table
   */
  p5.Table.prototype.getRowCount = function() {
    return this.rows.length;
  };

  /**
   *  <p>Removes any of the specified characters (or "tokens").</p>
   *  
   *  <p>If no column is specified, then the values in all columns and
   *  rows are processed. A specific column may be referenced by
   *  either its ID or title.</p>
   *
   *  @method  removeTokens
   *  @param  {String} chars  String listing characters to be removed
   *  @param  {String|Number} [column] Column ID (number)
   *                                   or name (string)
   */
  p5.Table.prototype.removeTokens = function(chars, column) {
    var escape= function(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    var charArray = [];
    for (var i = 0; i < chars.length; i++) {
      charArray.push( escape( chars.charAt(i) ) );
    }
    var regex = new RegExp(charArray.join('|'), 'g');

    if (typeof(column) === 'undefined'){
      for (var c = 0; c < this.columns.length; c++) {
        for (var d = 0; d < this.rows.length; d++) {
          var s = this.rows[d].arr[c];
          s = s.replace(regex, '');
          this.rows[d].arr[c] = s;
          this.rows[d].obj[this.columns[c]] = s;
        }
      }
    }
    else if (typeof(column) === 'string'){
      for (var j = 0; j < this.rows.length; j++) {
        var val = this.rows[j].obj[column];
        val = val.replace(regex, '');
        this.rows[j].obj[column] = val;
        var pos = this.columns.indexOf(column);
        this.rows[j].arr[pos] = val;
      }
    }
    else {
      for (var k = 0; k < this.rows.length; k++) {
        var str = this.rows[k].arr[column];
        str = str.replace(regex, '');
        this.rows[k].arr[column] = str;
        this.rows[k].obj[this.columns[column]] = str;
      }
    }
  };

  /**
   *  Trims leading and trailing whitespace, such as spaces and tabs,
   *  from String table values. If no column is specified, then the
   *  values in all columns and rows are trimmed. A specific column
   *  may be referenced by either its ID or title.
   *
   *  @method  trim
   *  @param  {String|Number} column Column ID (number)
   *                                   or name (string)
   */
  p5.Table.prototype.trim = function(column) {
    var regex = new RegExp( (' '), 'g');

    if (typeof(column) === 'undefined'){
      for (var c = 0; c < this.columns.length; c++) {
        for (var d = 0; d < this.rows.length; d++) {
          var s = this.rows[d].arr[c];
          s = s.replace(regex, '');
          this.rows[d].arr[c] = s;
          this.rows[d].obj[this.columns[c]] = s;
        }
      }
    }
    else if (typeof(column) === 'string'){
      for (var j = 0; j < this.rows.length; j++) {
        var val = this.rows[j].obj[column];
        val = val.replace(regex, '');
        this.rows[j].obj[column] = val;
        var pos = this.columns.indexOf(column);
        this.rows[j].arr[pos] = val;
      }
    }
    else {
      for (var k = 0; k < this.rows.length; k++) {
        var str = this.rows[k].arr[column];
        str = str.replace(regex, '');
        this.rows[k].arr[column] = str;
        this.rows[k].obj[this.columns[column]] = str;
      }
    }
  };

  /**
   *  Use removeColumn() to remove an existing column from a Table
   *  object. The column to be removed may be identified by either
   *  its title (a String) or its index value (an int).
   *  removeColumn(0) would remove the first column, removeColumn(1)
   *  would remove the second column, and so on.
   *
   *  @method  removeColumn
   *  @param  {String|Number} column columnName (string) or ID (number)
   */
  p5.Table.prototype.removeColumn = function(c) {
    var cString;
    var cNumber;
    if (typeof(c) === 'string') {
      // find the position of c in the columns
      cString = c;
      cNumber = this.columns.indexOf(c);
      console.log('string');
    }
    else{
      cNumber = c;
      cString = this.columns[c];
    }

    var chunk = this.columns.splice(cNumber+1, this.columns.length);
    this.columns.pop();
    this.columns = this.columns.concat(chunk);

    for (var i = 0; i < this.rows.length; i++){
      var tempR = this.rows[i].arr;
      var chip = tempR.splice(cNumber+1, tempR.length);
      tempR.pop();
      this.rows[i].arr = tempR.concat(chip);
      delete this.rows[i].obj[cString];
    }

  };


  /**
   * Stores a value in the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified 
   * by either its ID or title.
   *
   * @method  set
   * @param {String|Number} column column ID (Number)
   *                               or Title (String)
   * @param {String|Number} value  value to assign
   */
  p5.Table.prototype.set = function(row, column, value) {
    this.rows[row].set(column, value);
  };

  /**
   * Stores a Float value in the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified 
   * by either its ID or title.
   *
   * @method setNum
   * @param {Number} row row ID
   * @param {String|Number} column column ID (Number)
   *                               or title (String)
   * @param {Number} value  value to assign
   */
  p5.Table.prototype.setNum = function(row, column, value){
    this.rows[row].set(column, value);
  };


  /**
   * Stores a String value in the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified 
   * by either its ID or title.
   *
   * @method  setString
   * @param {Number} row row ID
   * @param {String|Number} column column ID (Number)
   *                               or Title (String)
   * @param {String} value  value to assign
   */
  p5.Table.prototype.setString = function(row, column, value){
    this.rows[row].set(column, value);
  };

  /**
   * Retrieves a value from the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified by 
   * either its ID or title.
   *
   * @method  get
   * @param {Number} row row ID (Number)
   * @param  {String|Number} column columnName (string) or
   *                                   ID (number)
   * @return {String|Number}
   */
  p5.Table.prototype.get = function(row, column) {
    return this.rows[row].get(column);
  };

  /**
   * Retrieves a Float value from the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified by 
   * either its ID or title.
   *
   * @method  getNum
   * @param {Number} row row ID (Number)
   * @param  {String|Number} column columnName (string) or
   *                                   ID (number)
   * @return {Number}
   */
  p5.Table.prototype.getNum = function(row, column) {
    return this.rows[row].getNum(column);
  };

  /**
   * Retrieves a String value from the Table's specified row and column.
   * The row is specified by its ID, while the column may be specified by 
   * either its ID or title.
   *
   * @method  getString
   * @param {Number} row row ID (Number)
   * @param  {String|Number} column columnName (string) or
   *                                   ID (number)
   * @return {String}
   */
  p5.Table.prototype.getString = function(row, column) {
    return this.rows[row].getString(column);
  };

  return p5.Table;

});
