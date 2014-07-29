/**
 * @module Input
 * @submodule Files
 * @for p5
 * @requires core
 * @requires reqwest
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var reqwest = require('reqwest');

  //BufferedReader
  p5.prototype.createInput = function() {
    // TODO
    throw 'not yet implemented';
  };

  p5.prototype.createReader = function() {
    // TODO
    throw 'not yet implemented';
  };

  p5.prototype.loadBytes = function() {
    // TODO
    throw 'not yet implemented';
  };

  /**
   * Loads a JSON file from a file or a URL, and returns an Object or Array.
   * This method is asynchronous, meaning it may not finish before the next
   * line in your sketch is executed, either use preload() to guarantee the
   * file loads before setup() and draw() are called, or supply a callback
   * function that is executed when loadStrings() completes.
   * 
   * @method loadJSON
   * @param  {String}        path       name of the file or url to load
   * @param  {Function}      [callback] function to be executed after
   *                                    loadJSON()
   *                                    completes, Array is passed in as first
   *                                    argument
   * @return {Object|Array}             JSON data
   */
  p5.prototype.loadJSON = function(path, callback) {
    var ret = [];
    var t = path.indexOf('http') === -1 ? 'json' : 'jsonp';
    reqwest({url: path, type: t, success: function (resp) {
      for (var k in resp) {
        ret[k] = resp[k];
      }
      if (typeof callback !== 'undefined') {
        callback(ret);
      }
    }});
    return ret;
  };

  /**
   * Reads the contents of a file and creates a String array of its individual
   * lines. If the name of the file is used as the parameter, as in the above
   * example, the file must be located in the sketch directory/folder.
   * 
   * Alternatively, the file maybe be loaded from anywhere on the local
   * computer using an absolute path (something that starts with / on Unix and
   * Linux, or a drive letter on Windows), or the filename parameter can be a
   * URL for a file found on a network.
   *
   * This method is asynchronous, meaning it may not finish before the next
   * line in your sketch is executed, either use preload() to guarantee the
   * file loads before setup() and draw() are called, or supply a callback
   * function that is executed when loadStrings() completes.
   * 
   * @method loadStrings
   * @param  {String}   filename   name of the file or url to load
   * @param  {Function} [callback] function to be executed after loadStrings()
   *                               completes, Array is passed in as first
   *                               argument
   * @return {Array}               Array of Strings
   */
  p5.prototype.loadStrings = function (path, callback) {
    var ret = [];
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.onreadystatechange = function () {
      if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) {
          ret[k] = arr[k];
        }
        if (typeof callback !== 'undefined') {
          callback(ret);
        }
      }
    };
    req.send(null);
    return ret;
  };



  /**
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
   *
   *  Possible options include:
   *  <ul>
   *  <li>csv - parse the table as comma-separated values
   *  <li>tsv - parse the table as tab-separated values
   *  <li>newlines - this CSV file contains newlines inside individual cells
   *  <li>header - this table has a header (title) row
   *  </ul>
   *
   *  @param {[Object]} input
   *  @param {[String]} options
   */
  p5.prototype.Table = function (path, options) {
    this._rowCount = null;
    this.columnTitles = null; // array of column titles
    this.columnCategories = null; // not sure if this is necessary
    this.columnIndices = null; // {string: number}
    this._columns = null; // {}
    this.rows = [];
  };

  p5.prototype.Table.prototype.addRow = function(row) {
    if (row) {
      console.log('row!');
    }
    var r = row || [];
    this.rows.push(r);
  };

  p5.prototype.Table.prototype.removeRow = function(id) {
    var chunk = this.rows.splice(id+1, this.rows.length);
    this.rows.pop();
    this.rows = this.rows.concat(chunk);
  };

  /**
   *  Use addColumn() to add a new column to a Table object.
   *  Typically, you will want to specify a title, so the column
   *  may be easily referenced later by name. (If no title is
   *  specified, the new column's title will be null.)
   */
  p5.prototype.Table.prototype.addColumn = function(title){
    var t = title || null;
    this.columnTitles.push(t);
  };

  /**
   *  Use removeColumn() to remove an existing column from a Table
   *  object. The column to be removed may be identified by either
   *  its title (a String) or its index value (an int).
   *  removeColumn(0) would remove the first column, removeColumn(1)
   *  would remove the second column, and so on.
   *  
   *  @param  {[String or Number]} c columnName (string) or ID (number)
   *  @return {[type]}   [description]
   */
  p5.prototype.Table.prototype.removeColumn = function(c){
    if (typeof(c) === 'string') {
      // find the position of c in the columnTitles
      c = this.columnTitles.indexOf(c);
    }
    var chunk = this.columnTitles.splice(c+1, this.columnTitles.length);
    this.columnTitles.pop();
    this.columnTitles = this.columnTitles.concat(chunk);

    for (var i = 0; i < this.rows.length; i++){
      var r = this.rows[i];
      var chip = r.splice(c+1, r.length);
      r.pop();
      this.rows[i] = r.concat(chip);
    }

  };


  p5.prototype.TableRow = function (stuff, separator) {
    separator = separator || ',';
    this.row = stuff.split(separator);
    return this.row;
  };

  /**
   *  <p>Reads the contents of a file or URL and creates an Table object
   *  with its values. If a file is specified, it must be located in
   *  the sketch's "data" folder. The filename parameter can also be
   *  a URL to a file found online. By default, the file is assumed
   *  to be comma-separated (in CSV format). To use tab-separated
   *  data, include "tsv" in the options parameter.</p>
   *  
   *  <p>If the file contains a header row, include "header" in the
   *  options parameter. If the file does not have a header row, then
   *  simply omit the "header" option.</p>
   *  
   *  <p>When specifying both a header and the file type, separate
   *  the options with commas, as in:
   *  loadTable("data.csv", "header, tsv")</p>
   *
   *  <p> All files loaded and saved use UTF-8 encoding.</p>
   *  
   *  @param  {String}   filename   name of the file or URL to load
   *  @param  {Function} [callback] function to be executed after loadXML()
   *                               completes, XML object is passed in as
   *                               first argument
   *  @return {Object}              XML object containing data
   */
  p5.prototype.loadTable = function (path, callback) {
    var ret = [];
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.onreadystatechange = function () {
      if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) {
          ret[k] = arr[k];
        }
        if (typeof callback !== 'undefined') {
          var t = new p5.prototype.Table();
          t.columnTitles = new p5.prototype.TableRow(ret[0]);
          for (var i = 1; i<ret.length; i++) {
            var x = new p5.prototype.TableRow(ret[i]);
            t.addRow(x);
          }
          callback(t);
        }
      }
    };
    req.send(null);
    return ret;
    // throw 'not yet implemented';
  };

  /**
   * Reads the contents of a file and creates an XML object with its values.
   * If the name of the file is used as the parameter, as in the above example,
   * the file must be located in the sketch directory/folder.
   *
   * Alternatively, the file maybe be loaded from anywhere on the local
   * computer using an absolute path (something that starts with / on Unix and
   * Linux, or a drive letter on Windows), or the filename parameter can be a
   * URL for a file found on a network.
   * 
   * This method is asynchronous, meaning it may not finish before the next
   * line in your sketch is executed, either use preload() to guarantee the
   * file loads before setup() and draw() are called, or supply a callback
   * function that is executed when loadXML() completes.
   * 
   * @method loadXML
   * @param  {String}   filename   name of the file or URL to load
   * @param  {Function} [callback] function to be executed after loadXML()
   *                               completes, XML object is passed in as
   *                               first argument
   * @return {Object}              XML object containing data
   */
  p5.prototype.loadXML = function(path, callback) {
    var ret = [];
    reqwest({
      url: path,
      type: 'xml',
      success: function (resp) {
        ret[0] = resp;
        if (typeof callback !== 'undefined') {
          callback(ret);
        }
      }
    });
    return ret;
  };

  // name clash with window.open
  // p5.prototype.open = function() {
  //   // TODO

  // };

  p5.prototype.parseXML = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.saveTable = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.selectFolder = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.selectInput = function() {
    // TODO
    throw 'not yet implemented';

  };

  return p5;
});
