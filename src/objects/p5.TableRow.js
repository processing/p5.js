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
   *  @param {[String]} str     optional: populate the row with a
   *                            string of values, separated by the
   *                            separator
   *  @param {[String]} separator  Comma separated values (csv)
   *                               by default
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

  // helper function used by set()
  function makeArray(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(obj[key]);
      }
    }
    return arr;
  }

  /**
   *  Stores a value in the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @method  set
   *  @param {[type]} column [description]
   *  @param {[type]} value  [description]
   */
  p5.TableRow.prototype.set = function(column, value) {
    // if typeof column is string, use .obj
    if (typeof(column) === 'string'){
      var addedArr = false;
      if (typeof(this.obj.column) !== 'undefined'){
        this.arr.push(value);
        addedArr = true;
      }
      this.obj[column] = value;
      if (addedArr === false){
        this.arr = makeArray(this.obj); // this might be out of order!
      }
    }

    // if typeof column is number, use .arr
    else {
      var prevVal = this.arr[column];
      this.arr[column] = value;
      // iterate thru all the object's values and replace it
      for (var key in this.obj) {
        if (this.obj.hasOwnProperty(key)) {
          if (this.obj[key] === prevVal){
            this.obj[key] = value;
          }
        }
      }
    }
  };

  /**
   *  Retrieves a float value from the TableRow's specified column.
   *  The column may be specified by either its ID or title.
   *
   *  @method  get
   *  @param  {(String|Number)} column columnName (string) or
   *                                   ID (number)
   *  @return {[type]}        [description]
   */
  p5.TableRow.prototype.get = function(column) {
    if (typeof(column) === 'string'){
      return this.obj[column];
    } else {
      return this.arr[column];
    }
  };

  return p5.TableRow;

});
