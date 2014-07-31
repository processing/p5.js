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
          var t = new p5.Table();
          t.columns = new p5.TableRow(ret[0]).arr;
          for (var i = 1; i<ret.length; i++) {
            var row = new p5.TableRow(ret[i]);
            row.obj = makeObject(row.arr, t.columns); // if Headers
            t.addRow(row);
          }
          callback(t);
        }
      }
    };
    req.send(null);
    return ret;
    // throw 'not yet implemented';
  };

  // helper function to turn a row into a JSON object
  function makeObject(row, headers) {
    var ret = {};
    headers = headers || [];
    if (typeof(headers) === 'undefined'){
      for (var j = 0; j < row.length; j++ ){
        headers[j] = j;
      }
    }
    for (var i = 0; i < headers.length; i++){
      var key = headers[i];
      var val = row[i];
      ret[key] = val;
    }
    return ret;
  }

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
