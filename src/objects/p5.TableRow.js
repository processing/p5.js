/**
 * @module Data
 * @submodule Table
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

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
  p5.TableRow = function (str, separator) {
    var arr = [];
    var obj = {};
    if (str){
      separator = separator || ',';
      arr = str.split(separator);
    }
    for (var i = 0; i < arr.length; i++){
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
   *  @param {String|Number} column Column ID (Number)
   *                                or Title (String)
   *  @param {String|Number} value  The value to be stored
   */
  p5.TableRow.prototype.set = function(column, value) {
    // if typeof column is string, use .obj
    if (typeof(column) === 'string'){
      var cPos = this.table.columns.indexOf(column); // index of columnID
      if (cPos >= 0) {
        this.obj[column] = value;
        this.arr[cPos] = value;
      }
      else {
        throw 'This table has no column named "' + column +'"';
      }
    }

    // if typeof column is number, use .arr
    else {
      if (column < this.table.columns.length) {
        this.arr[column] = value;
        var cTitle = this.table.columns[column];
        this.obj[cTitle] = value;
      }
      else {
        throw 'Column #' + column + ' is out of the range of this table';
      }
    }
  };

  /**
   *  Stores an Integer value in the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @method  setInt
   *  @param {String|Number} column Column ID (Number)
   *                                or Title (String)
   *  @param {Number} value  The value to be stored
   *                                as an Integer
   */
  p5.TableRow.prototype.setInt = function(column, value){
    var floatVal = parseFloat(value, 10);
    var intVal = Math.round(floatVal);
    this.set(column, intVal);
  };

  p5.TableRow.prototype.setFloat = function(column, value){
    var floatVal = parseFloat(value, 10);
    this.set(column, floatVal);
  };

  /**
   *  Stores a Float value in the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @method  setNum
   *  @param {String|Number} column Column ID (Number)
   *                                or Title (String)
   *  @param {Number} value  The value to be stored
   *                                as a Float
   */
  p5.TableRow.prototype.setNum = p5.TableRow.prototype.setFloat;

  /**
   *  Stores a String value in the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @method  setString
   *  @param {String|Number} column Column ID (Number)
   *                                or Title (String)
   *  @param {String} value  The value to be stored
   *                                as a String
   */
  p5.TableRow.prototype.setString = function(column, value){
    var stringVal = value.toString();
    this.set(column, stringVal);
  };

  /**
   *  Retrieves a value from the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @method  get
   *  @param  {String|Number} column columnName (string) or
   *                                   ID (number)
   *  @return {String|Number}
   */
  p5.TableRow.prototype.get = function(column) {
    if (typeof(column) === 'string'){
      return this.obj[column];
    } else {
      return this.arr[column];
    }
  };

  /**
   *  Retrieves an Integer value from the TableRow's specified
   *  column. The column may be specified by either its ID or
   *  title.
   *
   *  @param  {String|Number} column columnName (string) or
   *                                   ID (number)
   *  @return {Number}  Integer The number will be rounded
   *                            to the nearest integer
   */
  p5.TableRow.prototype.getInt = function(column) {
    var floatVal, intVal;
    if (typeof(column) === 'string'){
      floatVal = parseFloat(this.obj[column], 10);
      intVal = Math.round(floatVal);
      return intVal;
    } else {
      floatVal = parseFloat(this.arr[column], 10);
      intVal = Math.round(floatVal);
      return intVal;
    }
  };

  p5.TableRow.prototype.getFloat = function(column) {
    var ret;
    if (typeof(column) === 'string'){
      ret = parseFloat(this.obj[column], 10);
    } else {
      ret = parseFloat(this.arr[column], 10);
    }

    if (ret.toString() === 'NaN') {
      throw 'Error: ' + this.obj[column]+ ' is NaN (Not a Number)';
    }
    return ret;
  };

  /**
   *  Retrieves a Float value from the TableRow's specified
   *  column. The column may be specified by either its ID or
   *  title.
   *
   *  @method  getNum
   *  @param  {String|Number} column columnName (string) or
   *                                   ID (number)
   *  @return {Number}  Float Floating point number
   */
  p5.TableRow.prototype.getNum = p5.TableRow.prototype.getFloat;

  /**
   *  Retrieves an String value from the TableRow's specified
   *  column. The column may be specified by either its ID or
   *  title.
   *
   *  @method  getString
   *  @param  {String|Number} column columnName (string) or
   *                                   ID (number)
   *  @return {String}  String
   */
  p5.TableRow.prototype.getString = function(column) {
    if (typeof(column) === 'string'){
      return this.obj[column].toString();
    } else {
      return this.arr[column].toString();
    }
  };

  return p5.TableRow;

});
