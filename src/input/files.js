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
   * line in your sketch is executed. Either use preload() to guarantee the
   * file loads before setup() and draw() are called, or supply a callback
   * function that is executed when loadStrings() completes.
   * 
   * @method loadJSON
   * @param  {String}        path       name of the file or url to load
   * @param  {Function}      [callback] function to be executed after
   *                                    loadJSON()
   *                                    completes, Array is passed in as first
   *                                    argument
   * @param  {String}       [datatype]  "json" or "jsonp"
   * @return {Object|Array}             JSON data
   * @example
   * <div><code>
   * function setup() {
   *   noLoop();
   *   var url = 'http://api.openweathermap.org/data/2.5/weather?q=NewYork,USA';
   *   loadJSON(url, drawWeather);
   * }
   *
   * function draw() {
   *   background(200);
   * }
   *
   * function drawWeather(weather) {
   *   // get the humidity value out of the loaded JSON
   *   var humidity = weather.main.humidity;
   *   fill(0, humidity); // use the humidity value to set the alpha
   *   ellipse(width/2, height/2, 50, 50);
   * }
   * </code></div>
   *
   * <div><code>
   * var weather;
   * function preload() {
   *   var url = 'http://api.openweathermap.org/data/2.5/weather?q=London,UK';
   *   weather = loadJSON(url);
   * }
   *
   * function setup() {
   *   noLoop();
   * }
   *
   * function draw() {
   *   background(200);
   *   // get the humidity value out of the loaded JSON
   *   var humidity = weather.main.humidity;
   *   fill(0, humidity); // use the humidity value to set the alpha
   *   ellipse(width/2, height/2, 50, 50);
   * }
   * </code></div>
   */
  p5.prototype.loadJSON = function() {
    var path = arguments[0];
    var callback = arguments[1];
    var ret = []; // array needed for preload
    // assume jsonp for URLs
    var t = 'json'; //= path.indexOf('http') === -1 ? 'json' : 'jsonp';

    // check for explicit data type argument
    if (typeof arguments[2] === 'string'){
      if (arguments[2] === 'jsonp' || arguments[2] === 'json') {
        t = arguments[2];
      }
    }

    reqwest({url: path, type: t, crossOrigin: true})
      .then(function(resp) {
        for (var k in resp) {
          ret[k] = resp[k];
        }
        if (typeof callback !== 'undefined') {
          callback(resp);
        }
      });
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
   * line in your sketch is executed. Either use preload() to guarantee the
   * file loads before setup() and draw() are called, or supply a callback
   * function that is executed when loadStrings() completes.
   * 
   * @method loadStrings
   * @param  {String}   filename   name of the file or url to load
   * @param  {Function} [callback] function to be executed after loadStrings()
   *                               completes, Array is passed in as first
   *                               argument
   * @return {Array}               Array of Strings
   * @example
   * <div><code>
   * var result;
   * function preload() {
   *   result = loadStrings('assets/test.txt');
   * }

   * function setup() {
   *   background(200);
   *   var ind = floor(random(result.length));
   *   text(result[ind], 10, 10, 80, 80);
   * }
   * </code></div>
   *
   * <div><code>
   * function setup() {
   *   loadStrings('assets/test.txt', pickString);
   * }
   *
   * function pickString(result) {
   *   background(200);
   *   var ind = floor(random(result.length));
   *   text(result[ind], 10, 10, 80, 80);
   * }
   * </code></div>
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
   *  <p>Reads the contents of a file or URL and creates a p5.Table
   *  object with its values. If a file is specified, it must be
   *  located in the sketch's "data" folder. The filename parameter
   *  can also be a URL to a file found online. By default, the file
   *  is assumed to be comma-separated (in CSV format). Table only
   *  looks for a header row if the 'header' option is included.</p>
   *
   *  <p>Possible options include:
   *  <ul>
   *  <li>csv - parse the table as comma-separated values</li>
   *  <li>tsv - parse the table as tab-separated values</li>
   *  <li>header - this table has a header (title) row</li>
   *  </ul>
   *  </p>
   *  
   *  <p>When passing in multiple options, pass them in as separate parameters,
   *  seperated by commas.</p>
   *
   *  <p> All files loaded and saved use UTF-8 encoding.</p>
   *  
   *  <p>This method is asynchronous, meaning it may not finish before the next
   *  line in your sketch is executed. Either use preload() to guarantee the
   *  file loads before setup() and draw() are called, or supply a callback
   *  function that is executed when loadTable() completes.</p>
   * 
   *  @method  loadTable
   *  @param  {String}   filename   name of the file or URL to load
   *  @param  {String|Strings}   [options]  "header" "csv" "tsv"
   *  @param  {Function} [callback] function to be executed after loadTable()
   *                               completes, Table object is passed in as
   *                               first argument
   *  @return {Object}              Table object containing data
   */
  p5.prototype.loadTable = function (path) {
    var callback = null;
    var options = [];
    var header = false;
    var sep = ',';
    var separatorSet = false;
    for (var i = 1; i < arguments.length; i++) {
      if (typeof(arguments[i]) === 'function' ){
        callback = arguments[i];
      }
      else if (typeof(arguments[i]) === 'string') {
        options.push(arguments[i]);
        if (arguments[i] === 'header') {
          header = true;
        }
        if (arguments[i] === 'csv') {
          if (separatorSet) {
            throw new Error('Cannot set multiple separator types.');
          }
          else {
            sep = ',';
            separatorSet = true;
          }
        }
        else if (arguments[i] === 'tsv') {
          if (separatorSet) {
            throw new Error('Cannot set multiple separator types.');
          }
          else {
            sep = '\t';
            separatorSet = true;
          }
        }
      }
    }

    var t = new p5.Table();
    reqwest({url: path, crossOrigin: true, type: 'csv'})
      .then(function(resp) {
        resp = resp.responseText;

        var state = {};

        // define constants
        var PRE_TOKEN = 0,
            MID_TOKEN = 1,
            POST_TOKEN = 2,
            POST_RECORD = 4;

        var QUOTE = '\"',
               CR = '\r',
               LF = '\n';

        var records = [];
        var offset = 0;
        var currentRecord = null;
        var currentChar;

        var recordBegin = function () {
          state.escaped = false;
          currentRecord = [];
          tokenBegin();
        };

        var recordEnd = function () {
          state.currentState = POST_RECORD;
          records.push(currentRecord);
          currentRecord = null;
        };

        var tokenBegin = function() {
          state.currentState = PRE_TOKEN;
          state.token = '';
        };

        var tokenEnd = function() {
          currentRecord.push(state.token);
          tokenBegin();
        };

        while(true) {
          currentChar = resp[offset++];

          // EOF
          if(currentChar == null) {
            if (state.escaped) {
              throw new Error('Unclosed quote in file.');
            }
            if (currentRecord){
              tokenEnd();
              recordEnd();
              break;
            }
          }
          if(currentRecord === null) {
            recordBegin();
          }

          // Handle opening quote
          if (state.currentState === PRE_TOKEN) {
            if (currentChar === QUOTE) {
              state.escaped = true;
              state.currentState = MID_TOKEN;
              continue;
            }
            state.currentState = MID_TOKEN;
          }

          // mid-token and escaped, look for sequences and end quote
          if (state.currentState === MID_TOKEN && state.escaped) {
            if (currentChar === QUOTE) {
              if (resp[offset] === QUOTE) {
                state.token += QUOTE;
                offset++;
              }
              else {
                state.escaped = false;
                state.currentState = POST_TOKEN;
              }
            }
            else {
              state.token += currentChar;
            }
            continue;
          }


          // fall-through: mid-token or post-token, not escaped
          if (currentChar === CR ) {
            if( resp[offset] === LF  ) {
              offset++;
            }
            tokenEnd();
            recordEnd();
          }
          else if (currentChar === LF) {
            tokenEnd();
            recordEnd();
          }
          else if (currentChar === sep) {
            tokenEnd();
          }
          else if( state.currentState === MID_TOKEN ){
            state.token += currentChar;
          }
        }

        // set up column names
        if (header) {
          t.columns = records.shift();
        }
        else {
          for (i = 0; i < records.length; i++){
            t.columns[i] = i.toString();
          }
        }
        var row;
        for (i =0; i<records.length; i++) {
          row = new p5.TableRow();
          row.arr = records[i];
          row.obj = makeObject(records[i], t.columns);
          t.addRow(row);
        }
        if (callback !== null) {
          callback(t);
        }
      })
      .fail(function(err,msg){
        if (typeof callback !== 'undefined') {
          callback(false);
        }
      });

    return t;
  };

  // helper function to turn a row into a JSON object
  function makeObject(row, headers) {
    var ret = {};
    headers = headers || [];
    if (typeof(headers) === 'undefined'){
      for (var j = 0; j < row.length; j++ ){
        headers[j.toString()] = j;
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
   * line in your sketch is executed. Either use preload() to guarantee the
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
      crossOrigin: true,
    })
      .then(function(resp){
        callback(resp);
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

  p5.prototype.selectFolder = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.selectInput = function() {
    // TODO
    throw 'not yet implemented';

  };

  /**
   * Method for executing an HTTP GET request. If data type is not specified,
   * p5 will try to guess based on the URL, defaulting to text.
   * 
   * @method httpGet
   * @param  {String}        path       name of the file or url to load
   * @param  {Object}        [data]     param data passed sent with request
   * @param  {String}        [datatype] "json", "jsonp", "xml", or "text"
   * @param  {Function}      [callback] function to be executed after
   *                                    httpGet() completes, data is passed in
   *                                    as first argument
   */
  p5.prototype.httpGet = function () {
    var args = Array.prototype.slice.call(arguments);
    args.push('GET');
    p5.prototype.httpDo.apply(this, args);
  };


  /**
   * Method for executing an HTTP POST request. If data type is not specified,
   * p5 will try to guess based on the URL, defaulting to text.
   * 
   * @method httpPost
   * @param  {String}        path       name of the file or url to load
   * @param  {Object}        [data]     param data passed sent with request
   * @param  {String}        [datatype] "json", "jsonp", "xml", or "text"
   * @param  {Function}      [callback] function to be executed after
   *                                    httpGet() completes, data is passed in
   *                                    as first argument
   */
  p5.prototype.httpPost = function () {
    var args = Array.prototype.slice.call(arguments);
    args.push('POST');
    p5.prototype.httpDo.apply(this, args);
  };

  /**
   * Method for executing an HTTP request. If data type is not specified,
   * p5 will try to guess based on the URL, defaulting to text.
   * 
   * @method httpDo
   * @param  {String}        path       name of the file or url to load
   * @param  {String}        [method]   either "GET", "POST", or "PUT", 
   *                                    defaults to "GET"
   * @param  {Object}        [data]     param data passed sent with request
   * @param  {String}        [datatype] "json", "jsonp", "xml", or "text"
   * @param  {Function}      [callback] function to be executed after
   *                                    httpGet() completes, data is passed in
   *                                    as first argument
   */
  p5.prototype.httpDo = function() {
    var method = 'GET';
    var path = arguments[0];
    var data = {};
    var type = '';
    var callback;

    for (var i=1; i<arguments.length; i++) {
      var a = arguments[i];
      if (typeof a === 'string') {
        if (a === 'GET' || a === 'POST' || a === 'PUT') {
          method = a;
        } else {
          type = a;
        }
      } else if (typeof a === 'object') {
        data = a;
      } else if (typeof a === 'function') {
        callback = a;
      }
    }

    // do some sort of smart type checking
    if (type === '') {
      if (path.indexOf('json') !== -1) {
        type = 'json';
      } else if (path.indexOf('xml') !== -1) {
        type = 'xml';
      } else {
        type = 'text';
      }
    }

    reqwest({
      url: path,
      method: method,
      data: data,
      type: type,
      crossOrigin: true,
      success: function (resp) {
        if (typeof callback !== 'undefined') {
          if (type === 'text') {
            callback(resp.response);
          } else {
            callback(resp);
          }
        }
      }
    });
  };

  return p5;
});
