/**
 * @module IO
 * @submodule Input
 * @for p5
 * @requires core
 * @requires reqwest
 */

'use strict';

var p5 = require('../core/core');
var reqwest = require('reqwest');
var opentype = require('opentype.js');
require('../core/error_helpers');

/**
 * Checks if we are in preload and returns the last arg which will be the
 * _decrementPreload function if called from a loadX() function.  Should
 * only be used in loadX() functions.
 * @private
 */
p5._getDecrementPreload = function() {
  var decrementPreload = arguments[arguments.length - 1];

  // when in preload decrementPreload will always be the last arg as it is set
  // with args.push() before invocation in _wrapPreload
  if ((window.preload || (this && this.preload)) &&
    typeof decrementPreload === 'function') {
    return decrementPreload;
  } else {
    return null;
  }
};

/**
 * Loads an opentype font file (.otf, .ttf) from a file or a URL,
 * and returns a PFont Object. This method is asynchronous,
 * meaning it may not finish before the next line in your sketch
 * is executed.
 * <br><br>
 * The path to the font should be relative to the HTML file
 * that links in your sketch. Loading an from a URL or other
 * remote location may be blocked due to your browser's built-in
 * security.
 *
 * @method loadFont
 * @param  {String}        path       name of the file or url to load
 * @param  {Function}      [callback] function to be executed after
 *                                    loadFont()
 *                                    completes
 * @return {Object}                   p5.Font object
 * @example
 *
 * <p>Calling loadFont() inside preload() guarantees that the load
 * operation will have completed before setup() and draw() are called.</p>
 *
 * <div><code>
 * var myFont;
 * function preload() {
 *   myFont = loadFont('assets/AvenirNextLTPro-Demi.otf');
 * }
 *
 * function setup() {
 *   fill('#ED225D');
 *   textFont(myFont);
 *   textSize(36);
 *   text('p5*js', 10, 50);
 * }
 * </code></div>
 *
 * <p>Outside of preload(), you may supply a callback function to handle the
 * object:</p>
 *
 * <div><code>
 * function setup() {
 *   loadFont('assets/AvenirNextLTPro-Demi.otf', drawText);
 * }
 *
 * function drawText(font) {
 *   fill('#ED225D');
 *   textFont(font, 36);
 *   text('p5*js', 10, 50);
 * }
 *
 * </code></div>
 *
 * <p>You can also use the string name of the font to style other HTML
 * elements.</p>
 *
 * <div><code>
 * var myFont;
 *
 * function preload() {
 *   myFont = loadFont('assets/Avenir.otf');
 * }
 *
 * function setup() {
 *   var myDiv = createDiv('hello there');
 *   myDiv.style('font-family', 'Avenir');
 * }
* </code></div>
 */
p5.prototype.loadFont = function(path, onSuccess, onError) {

  var p5Font = new p5.Font(this);
  var decrementPreload = p5._getDecrementPreload.apply(this, arguments);

  opentype.load(path, function(err, font) {

    if (err) {

      if ((typeof onError !== 'undefined') && (onError !== decrementPreload)) {
        return onError(err);
      }
      throw err;
    }

    p5Font.font = font;

    if (typeof onSuccess !== 'undefined') {
      onSuccess(p5Font);
    }
    if (decrementPreload && (onSuccess !== decrementPreload)) {
      decrementPreload();
    }
    /*jshint multistr: true */
    var exp =/\/[a-zA-Z]*((.ttf)|(.otf)|(.woff)|(.woff2))$/i;
    if(!exp) {
      return p5Font;
    }
    var i = (exp).exec( path ).index + 1;
    var fontName = path.substring(i);
    fontName = fontName.match(/[A-Za-z]*/);
    var fontFamily = fontName[0];
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode('\n@font-face {\
      \nfont-family: '+fontFamily+';\nsrc: url('+path+');\n}\n'));
    document.head.appendChild(newStyle);

  });

  return p5Font;
};


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
 * line in your sketch is executed.
 *
 * @method loadJSON
 * @param  {String}        path       name of the file or url to load
 * @param  {Function}      [callback] function to be executed after
 *                                    loadJSON() completes, data is passed
 *                                    in as first argument
 * @param  {Function}      [errorCallback] function to be executed if
 *                                    there is an error, response is passed
 *                                    in as first argument
 * @param  {String}        [datatype] "json" or "jsonp"
 * @return {Object|Array}             JSON data
 * @example
 *
 * <p>Calling loadJSON() inside preload() guarantees to complete the
 * operation before setup() and draw() are called.</p>
 *
 * <div><code>
 * var weather;
 * function preload() {
 *   var url = 'http://api.openweathermap.org/data/2.5/weather?q=London,UK'+
 *    '&APPID=7bbbb47522848e8b9c26ba35c226c734';
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
 *
 *
 * <p>Outside of preload(), you may supply a callback function to handle the
 * object:</p>
 * <div><code>
 * function setup() {
 *   noLoop();
 *   var url = 'http://api.openweathermap.org/data/2.5/weather?q=NewYork'+
 *    '&APPID=7bbbb47522848e8b9c26ba35c226c734';
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
 */
p5.prototype.loadJSON = function() {
  var path = arguments[0];
  var callback = arguments[1];
  var errorCallback;
  var decrementPreload = p5._getDecrementPreload.apply(this, arguments);

  var ret = []; // array needed for preload
  // assume jsonp for URLs
  var t = 'json'; //= path.indexOf('http') === -1 ? 'json' : 'jsonp';

  // check for explicit data type argument
  for (var i=2; i<arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg === 'string'){
      if (arg === 'jsonp' || arg === 'json') {
        t = arg;
      }
    } else if (typeof arg === 'function') {
      errorCallback = arg;
    }
  }

  reqwest({
    url: path,
    type: t,
    crossOrigin: true,
    error: function (resp) {
      // pass to error callback if defined
      if (errorCallback) {
        errorCallback(resp);
      } else { // otherwise log error msg
        console.log(resp.statusText);
      }
    },
    success: function(resp) {
      for (var k in resp) {
        ret[k] = resp[k];
      }
      if (typeof callback !== 'undefined') {
        callback(resp);
      }
      if (decrementPreload && (callback !== decrementPreload)) {
        decrementPreload();
      }
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
 * line in your sketch is executed.
 *
 * @method loadStrings
 * @param  {String}   filename   name of the file or url to load
 * @param  {Function} [callback] function to be executed after loadStrings()
 *                               completes, Array is passed in as first
 *                               argument
 * @param  {Function} [errorCallback] function to be executed if
 *                               there is an error, response is passed
 *                               in as first argument
 * @return {Array}               Array of Strings
 * @example
 *
 * <p>Calling loadStrings() inside preload() guarantees to complete the
 * operation before setup() and draw() are called.</p>
 *
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
 * <p>Outside of preload(), you may supply a callback function to handle the
 * object:</p>
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
p5.prototype.loadStrings = function (path, callback, errorCallback) {
  var ret = [];
  var req = new XMLHttpRequest();
  var decrementPreload = p5._getDecrementPreload.apply(this, arguments);

  req.addEventListener('error', function (resp) {
    if (errorCallback) {
      errorCallback(resp);
    } else {
      console.log(resp.responseText);
    }
  });

  req.open('GET', path, true);
  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) {
          ret[k] = arr[k];
        }
        if (typeof callback !== 'undefined') {
          callback(ret);
        }
        if (decrementPreload && (callback !== decrementPreload)) {
          decrementPreload();
        }
      } else {
        if (errorCallback) {
          errorCallback(req);
        } else {
          console.log(req.statusText);
        }
        //p5._friendlyFileLoadError(3, path);
      }
    }
  };
  req.send(null);
  return ret;
};

/**
 * <p>Reads the contents of a file or URL and creates a p5.Table object with
 * its values. If a file is specified, it must be located in the sketch's
 * "data" folder. The filename parameter can also be a URL to a file found
 * online. By default, the file is assumed to be comma-separated (in CSV
 * format). Table only looks for a header row if the 'header' option is
 * included.</p>
 *
 * <p>Possible options include:
 * <ul>
 * <li>csv - parse the table as comma-separated values</li>
 * <li>tsv - parse the table as tab-separated values</li>
 * <li>header - this table has a header (title) row</li>
 * </ul>
 * </p>
 *
 * <p>When passing in multiple options, pass them in as separate parameters,
 * seperated by commas. For example:
 * <br><br>
 * <code>
 *   loadTable("my_csv_file.csv", "csv", "header")
 * </code>
 * </p>
 *
 * <p> All files loaded and saved use UTF-8 encoding.</p>
 *
 * <p>This method is asynchronous, meaning it may not finish before the next
 * line in your sketch is executed. Calling loadTable() inside preload()
 * guarantees to complete the operation before setup() and draw() are called.
 * <p>Outside of preload(), you may supply a callback function to handle the
 * object:</p>
 * </p>
 *
 * @method loadTable
 * @param  {String}         filename   name of the file or URL to load
 * @param  {String|Strings} [options]  "header" "csv" "tsv"
 * @param  {Function}       [callback] function to be executed after
 *                                     loadTable() completes, Table object is
 *                                     passed in as first argument
 * @return {Object}                    Table object containing data
 *
 * @example
	* <div class="norender">
	* <code>
	* // Given the following CSV file called "mammals.csv"
 * // located in the project's "assets" folder:
 * //
	* // id,species,name
	* // 0,Capra hircus,Goat
	* // 1,Panthera pardus,Leopard
	* // 2,Equus zebra,Zebra
	*
	* var table;
	*
	* function preload() {
	*   //my table is comma separated value "csv"
	*   //and has a header specifying the columns labels
	*   table = loadTable("assets/mammals.csv", "csv", "header");
	*   //the file can be remote
	*   //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
	*   //                  "csv", "header");
	* }
	*
	* function setup() {
	*   //count the columns
	*   print(table.getRowCount() + " total rows in table");
	*   print(table.getColumnCount() + " total columns in table");
	*
	*   print(table.getColumn("name"));
	*   //["Goat", "Leopard", "Zebra"]
	*
	*   //cycle through the table
	*   for (var r = 0; r < table.getRowCount(); r++)
	*     for (var c = 0; c < table.getColumnCount(); c++) {
	*       print(table.getString(r, c));
	*     }
	* }
	* </code>
	* </div>
 */
p5.prototype.loadTable = function (path) {
  var callback = null;
  var options = [];
  var header = false;
  var sep = ',';
  var separatorSet = false;
  var decrementPreload = p5._getDecrementPreload.apply(this, arguments);

  for (var i = 1; i < arguments.length; i++) {
    if ((typeof(arguments[i]) === 'function') &&
      (arguments[i] !== decrementPreload)) {
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
        //Handles row of 'undefined' at end of some CSVs
        if (i === records.length - 1 && records[i].length === 1) {
          if(records[i][0] === 'undefined'){
            break;
          }
        }
        row = new p5.TableRow();
        row.arr = records[i];
        row.obj = makeObject(records[i], t.columns);
        t.addRow(row);
      }
      if (callback !== null) {
        callback(t);
      }
      if (decrementPreload && (callback !== decrementPreload)) {
        decrementPreload();
      }
    })
    .fail(function(err,msg){
      p5._friendlyFileLoadError(2,path);
      // don't get error callback mixed up with decrementPreload
      if ((typeof callback !== 'undefined') &&
        (callback !== decrementPreload)) {
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
 * line in your sketch is executed. Calling loadXML() inside preload()
 * guarantees to complete the operation before setup() and draw() are called.
 *
 * <p>Outside of preload(), you may supply a callback function to handle the
 * object:</p>
 *
 * @method loadXML
 * @param  {String}   filename   name of the file or URL to load
 * @param  {Function} [callback] function to be executed after loadXML()
 *                               completes, XML object is passed in as
 *                               first argument
 * @param  {Function} [errorCallback] function to be executed if
 *                               there is an error, response is passed
 *                               in as first argument
 * @return {Object}              XML object containing data
 */
p5.prototype.loadXML = function(path, callback, errorCallback) {
  var ret = document.implementation.createDocument(null, null);
  var decrementPreload = p5._getDecrementPreload.apply(this, arguments);

  reqwest({
    url: path,
    type: 'xml',
    crossOrigin: true,
    error: function(resp){
      // pass to error callback if defined
      if (errorCallback) {
        errorCallback(resp);
      } else { // otherwise log error msg
        console.log(resp.statusText);
      }
      //p5._friendlyFileLoadError(1,path);
    }
  })
  .then(function(resp){
    var x = resp.documentElement;
    ret.appendChild(x);
    if (typeof callback !== 'undefined') {
      callback(ret);
    }
    if (decrementPreload && (callback !== decrementPreload)) {
      decrementPreload();
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
 * @param  {Function}      [errorCallback] function to be executed if
 *                                    there is an error, response is passed
 *                                    in as first argument
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
 * @param  {Function}      [errorCallback] function to be executed if
 *                                    there is an error, response is passed
 *                                    in as first argument
 */
p5.prototype.httpPost = function () {
  var args = Array.prototype.slice.call(arguments);
  args.push('POST');
  p5.prototype.httpDo.apply(this, args);
};

/**
 * Method for executing an HTTP request. If data type is not specified,
 * p5 will try to guess based on the URL, defaulting to text.<br><br>
 * You may also pass a single object specifying all parameters for the
 * request following the examples inside the reqwest() calls here:
 * <a href='https://github.com/ded/reqwest#api'
 * >https://github.com/ded/reqwest#api</a>
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
 * @param  {Function}      [errorCallback] function to be executed if
 *                                    there is an error, response is passed
 *                                    in as first argument
 */
p5.prototype.httpDo = function() {
  if (typeof arguments[0] === 'object') {
    reqwest(arguments[0]);
  } else {
    var method = 'GET';
    var path = arguments[0];
    var data = {};
    var type = '';
    var callback;
    var errorCallback;

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
        if (!callback) {
          callback = a;
        } else {
          errorCallback = a;
        }
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
      success: function(resp) {
        if (typeof callback !== 'undefined') {
          if (type === 'text') {
            callback(resp.response);
          } else {
            callback(resp);
          }
        }
      },
      error: function(resp) {
        if (errorCallback) {
          errorCallback(resp);
        } else {
          console.log(resp.statusText);
        }
      }
    });
  }
};


/**
 * @module IO
 * @submodule Output
 * @for p5
 */

window.URL = window.URL || window.webkitURL;

// private array of p5.PrintWriter objects
p5.prototype._pWriters = [];

p5.prototype.beginRaw = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.beginRecord = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.createOutput = function() {
  // TODO

  throw 'not yet implemented';
};

p5.prototype.createWriter  = function(name, extension) {
  var newPW;
  // check that it doesn't already exist
  for (var i in p5.prototype._pWriters) {
    if (p5.prototype._pWriters[i].name === name) {
      // if a p5.PrintWriter w/ this name already exists...
      // return p5.prototype._pWriters[i]; // return it w/ contents intact.
      // or, could return a new, empty one with a unique name:
      newPW = new p5.PrintWriter(name + window.millis(), extension);
      p5.prototype._pWriters.push( newPW );
      return newPW;
    }
  }
  newPW = new p5.PrintWriter(name, extension);
  p5.prototype._pWriters.push( newPW );
  return newPW;
};

p5.prototype.endRaw = function() {
  // TODO

  throw 'not yet implemented';
};

p5.prototype.endRecord  = function() {
  // TODO
  throw 'not yet implemented';

};

p5.PrintWriter = function(filename, extension) {
  var self = this;
  this.name = filename;
  this.content = '';
  this.print = function(data) { this.content += data; };
  this.println = function(data) { this.content += data + '\n'; };
  this.flush = function() { this.content = ''; };
  this.close = function() {
    // convert String to Array for the writeFile Blob
    var arr = [];
    arr.push(this.content);
    p5.prototype.writeFile(arr, filename, extension);
    // remove from _pWriters array and delete self
    for (var i in p5.prototype._pWriters) {
      if (p5.prototype._pWriters[i].name === this.name) {
        // remove from _pWriters array
        p5.prototype._pWriters.splice(i, 1);
      }
    }
    self.flush();
    self = {};
  };
};

p5.prototype.saveBytes = function() {
  // TODO
  throw 'not yet implemented';

};

// object, filename, options --> saveJSON, saveStrings, saveTable
// filename, [extension] [canvas] --> saveImage

/**
 *  <p>Save an image, text, json, csv, wav, or html. Prompts download to
 *  the client's computer. <b>Note that it is not recommended to call save()
 *  within draw if it's looping, as the save() function will open a new save
 *  dialog every frame.</b></p>
 *  <p>The default behavior is to save the canvas as an image. You can
 *  optionally specify a filename.
 *  For example:</p>
 *  <pre class='language-javascript'><code>
 *  save();
 *  save('myCanvas.jpg'); // save a specific canvas with a filename
 *  </code></pre>
 *
 *  <p>Alternately, the first parameter can be a pointer to a canvas
 *  p5.Element, an Array of Strings,
 *  an Array of JSON, a JSON object, a p5.Table, a p5.Image, or a
 *  p5.SoundFile (requires p5.sound). The second parameter is a filename
 *  (including extension). The third parameter is for options specific
 *  to this type of object. This method will save a file that fits the
 *  given paramaters. For example:</p>
 *
 *  <pre class='language-javascript'><code>
 *
 *  save('myCanvas.jpg');           // Saves canvas as an image
 *
 *  var cnv = createCanvas(100, 100);
 *  save(cnv, 'myCanvas.jpg');      // Saves canvas as an image
 *
 *  var gb = createGraphics(100, 100);
 *  save(gb, 'myGraphics.jpg');      // Saves p5.Renderer object as an image
 *
 *  save(myTable, 'myTable.html');  // Saves table as html file
 *  save(myTable, 'myTable.csv',);  // Comma Separated Values
 *  save(myTable, 'myTable.tsv');   // Tab Separated Values
 *
 *  save(myJSON, 'my.json');        // Saves pretty JSON
 *  save(myJSON, 'my.json', true);  // Optimizes JSON filesize
 *
 *  save(img, 'my.png');            // Saves pImage as a png image
 *
 *  save(arrayOfStrings, 'my.txt'); // Saves strings to a text file with line
 *                                  // breaks after each item in the array
 *  </code></pre>
 *
 *  @method save
 *  @param  {[Object|String]} objectOrFilename  If filename is provided, will
 *                                             save canvas as an image with
 *                                             either png or jpg extension
 *                                             depending on the filename.
 *                                             If object is provided, will
 *                                             save depending on the object
 *                                             and filename (see examples
 *                                             above).
 *  @param  {[String]} filename If an object is provided as the first
 *                               parameter, then the second parameter
 *                               indicates the filename,
 *                               and should include an appropriate
 *                               file extension (see examples above).
 *  @param  {[Boolean/String]} options  Additional options depend on
 *                            filetype. For example, when saving JSON,
 *                            <code>true</code> indicates that the
 *                            output will be optimized for filesize,
 *                            rather than readability.
 */
p5.prototype.save = function(object, _filename, _options) {
  // parse the arguments and figure out which things we are saving
  var args = arguments;
  // =================================================
  // OPTION 1: saveCanvas...

  // if no arguments are provided, save canvas
  var cnv = this._curElement.elt;
  if (args.length === 0) {
    p5.prototype.saveCanvas(cnv);
    return;
  }
  // otherwise, parse the arguments

  // if first param is a p5Graphics, then saveCanvas
  else if (args[0] instanceof p5.Renderer ||
    args[0] instanceof p5.Graphics) {
    p5.prototype.saveCanvas(args[0].elt, args[1], args[2]);
    return;
  }

  // if 1st param is String and only one arg, assume it is canvas filename
  else if (args.length === 1 && typeof(args[0]) === 'string') {
    p5.prototype.saveCanvas(cnv, args[0]);
  }

  // =================================================
  // OPTION 2: extension clarifies saveStrings vs. saveJSON

  else {
    var extension = _checkFileExtension(args[1], args[2])[1];
    switch(extension){
    case 'json':
      p5.prototype.saveJSON(args[0], args[1], args[2]);
      return;
    case 'txt':
      p5.prototype.saveStrings(args[0], args[1], args[2]);
      return;
    // =================================================
    // OPTION 3: decide based on object...
    default:
      if (args[0] instanceof Array) {
        p5.prototype.saveStrings(args[0], args[1], args[2]);
      }
      else if (args[0] instanceof p5.Table) {
        p5.prototype.saveTable(args[0], args[1], args[2], args[3]);
      }
      else if (args[0] instanceof p5.Image) {
        p5.prototype.saveCanvas(args[0].canvas, args[1]);
      }
      else if (args[0] instanceof p5.SoundFile) {
        p5.prototype.saveSound(args[0], args[1], args[2], args[3]);
      }
    }
  }
};

/**
 *  Writes the contents of an Array or a JSON object to a .json file.
 *  The file saving process and location of the saved file will
 *  vary between web browsers.
 *
 *  @method saveJSON
 *  @param  {Array|Object} json
 *  @param  {String} filename
 *  @param  {Boolean} [optimize]   If true, removes line breaks
 *                                 and spaces from the output
 *                                 file to optimize filesize
 *                                 (but not readability).
 *  @example
 *  <div><code>
 *  var json;
 *
 *  function setup() {
 *
 *    json = {}; // new JSON Object
 *
 *    json.id = 0;
 *    json.species = 'Panthera leo';
 *    json.name = 'Lion';
 *
 *  // To save, un-comment the line below, then click 'run'
 *  // saveJSONObject(json, 'lion.json');
 *  }
 *
 *  // Saves the following to a file called "lion.json":
 *  // {
 *  //   "id": 0,
 *  //   "species": "Panthera leo",
 *  //   "name": "Lion"
 *  // }
 *  </div></code>
 */
p5.prototype.saveJSON = function(json, filename, opt) {
  var stringify;
  if (opt){
    stringify = JSON.stringify( json );
  } else {
    stringify = JSON.stringify( json, undefined, 2);
  }
  console.log(stringify);
  this.saveStrings(stringify.split('\n'), filename, 'json');
};

p5.prototype.saveJSONObject = p5.prototype.saveJSON;
p5.prototype.saveJSONArray = p5.prototype.saveJSON;

p5.prototype.saveStream = function() {
  // TODO
  throw 'not yet implemented';

};

/**
 *  Writes an array of Strings to a text file, one line per String.
 *  The file saving process and location of the saved file will
 *  vary between web browsers.
 *
 *  @method saveStrings
 *  @param  {Array} list      string array to be written
 *  @param  {String} filename filename for output
 *  @example
 *  <div><code>
 *  var words = 'apple bear cat dog';
 *
 *  // .split() outputs an Array
 *  var list = split(words, ' ');
 *
 *  // To save the file, un-comment next line and click 'run'
 *  // saveStrings(list, 'nouns.txt');
 *
 *  // Saves the following to a file called 'nouns.txt':
 *  //
 *  // apple
 *  // bear
 *  // cat
 *  // dog
 *  </code></div>
 */
p5.prototype.saveStrings = function(list, filename, extension) {
  var ext = extension || 'txt';
  var pWriter = this.createWriter(filename, ext);
  for (var i = 0; i < list.length; i++) {
    if (i < list.length - 1) {
      pWriter.println(list[i]);
    } else {
      pWriter.print(list[i]);
    }
  }
  pWriter.close();
  pWriter.flush();
};

p5.prototype.saveXML = function() {
  // TODO
  throw 'not yet implemented';

};

p5.prototype.selectOutput = function() {
  // TODO
  throw 'not yet implemented';

};

// =======
// HELPERS
// =======

function escapeHelper(content) {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 *  Writes the contents of a Table object to a file. Defaults to a
 *  text file with comma-separated-values ('csv') but can also
 *  use tab separation ('tsv'), or generate an HTML table ('html').
 *  The file saving process and location of the saved file will
 *  vary between web browsers.
 *
 *  @method saveTable
 *  @param  {p5.Table} Table  the Table object to save to a file
 *  @param  {String} filename the filename to which the Table should be saved
 *  @param  {[String]} options  can be one of "tsv", "csv", or "html"
 *  @example
 *  <div><code>
 *  var table;
 *
 *  function setup() {
 *    table = new p5.Table();
 *
 *    table.addColumn('id');
 *    table.addColumn('species');
 *    table.addColumn('name');
 *
 *    var newRow = table.addRow();
 *    newRow.setNum('id', table.getRowCount() - 1);
 *    newRow.setString('species', 'Panthera leo');
 *    newRow.setString('name', 'Lion');
 *
 *    // To save, un-comment next line then click 'run'
 *    // saveTable(table, 'new.csv');
 *    }
 *
 *    // Saves the following to a file called 'new.csv':
 *    // id,species,name
 *    // 0,Panthera leo,Lion
 *  </code></div>
 */
p5.prototype.saveTable = function(table, filename, options) {
  var pWriter = this.createWriter(filename, options);

  var header = table.columns;

  var sep = ','; // default to CSV
  if (options === 'tsv') {
    sep = '\t';
  }
  if (options !== 'html') {
    // make header if it has values
    if (header[0] !== '0') {
      for (var h = 0; h < header.length; h++ ) {
        if (h < header.length - 1){
          pWriter.print(header[h] + sep);
        } else {
          pWriter.println(header[h]);
        }
      }
    }

    // make rows
    for (var i = 0; i < table.rows.length; i++ ) {
      var j;
      for (j = 0; j < table.rows[i].arr.length; j++) {
        if (j < table.rows[i].arr.length - 1) {
          pWriter.print(table.rows[i].arr[j] + sep);
        }
        else if (i < table.rows.length - 1) {
          pWriter.println(table.rows[i].arr[j]);
        } else {
          pWriter.print(table.rows[i].arr[j]); // no line break
        }
      }
    }
  }

  // otherwise, make HTML
  else {
    pWriter.println('<html>');
    pWriter.println('<head>');
    var str = '  <meta http-equiv=\"content-type\" content';
    str += '=\"text/html;charset=utf-8\" />';
    pWriter.println(str);
    pWriter.println('</head>');

    pWriter.println('<body>');
    pWriter.println('  <table>');

    // make header if it has values
    if (header[0] !== '0') {
      pWriter.println('    <tr>');
      for (var k = 0; k < header.length; k++ ) {
        var e = escapeHelper(header[k]);
        pWriter.println('      <td>' +e);
        pWriter.println('      </td>');
      }
      pWriter.println('    </tr>');
    }

    // make rows
    for (var row = 0; row < table.rows.length; row++) {
      pWriter.println('    <tr>');
      for (var col = 0; col < table.columns.length; col++) {
        var entry = table.rows[row].getString(col);
        var htmlEntry = escapeHelper(entry);
        pWriter.println('      <td>' +htmlEntry);
        pWriter.println('      </td>');
      }
      pWriter.println('    </tr>');
    }
    pWriter.println('  </table>');
    pWriter.println('</body>');
    pWriter.print('</html>');
  }
  // close and flush the pWriter
  pWriter.close();
  pWriter.flush();
}; // end saveTable()

/**
 *  Generate a blob of file data as a url to prepare for download.
 *  Accepts an array of data, a filename, and an extension (optional).
 *  This is a private function because it does not do any formatting,
 *  but it is used by saveStrings, saveJSON, saveTable etc.
 *
 *  @param  {Array} dataToDownload
 *  @param  {String} filename
 *  @param  {[String]} extension
 *  @private
 */
p5.prototype.writeFile = function(dataToDownload, filename, extension) {
  var type = 'application\/octet-stream';
  if (p5.prototype._isSafari() ) {
    type = 'text\/plain';
  }
  var blob = new Blob(dataToDownload, {'type': type});
  var href = window.URL.createObjectURL(blob);
  p5.prototype.downloadFile(href, filename, extension);
};

/**
 *  Forces download. Accepts a url to filedata/blob, a filename,
 *  and an extension (optional).
 *  This is a private function because it does not do any formatting,
 *  but it is used by saveStrings, saveJSON, saveTable etc.
 *
 *  @param  {String} href      i.e. an href generated by createObjectURL
 *  @param  {[String]} filename
 *  @param  {[String]} extension
 */
p5.prototype.downloadFile = function(href, fName, extension) {
  var fx = _checkFileExtension(fName, extension);
  var filename = fx[0];
  var ext = fx[1];

  var a = document.createElement('a');
  a.href = href;
  a.download = filename;

  // Firefox requires the link to be added to the DOM before click()
  a.onclick = destroyClickedElement;
  a.style.display = 'none';
  document.body.appendChild(a);

  // Safari will open this file in the same page as a confusing Blob.
  if (p5.prototype._isSafari() ) {
    var aText = 'Hello, Safari user! To download this file...\n';
    aText += '1. Go to File --> Save As.\n';
    aText += '2. Choose "Page Source" as the Format.\n';
    aText += '3. Name it with this extension: .\"' + ext+'\"';
    alert(aText);
  }
  a.click();
  href = null;
};

/**
 *  Returns a file extension, or another string
 *  if the provided parameter has no extension.
 *
 *  @param   {String} filename
 *  @return  {Array} [fileName, fileExtension]
 *
 *  @private
 */
function _checkFileExtension(filename, extension) {
  if (!extension || extension === true || extension === 'true') {
    extension = '';
  }
  if (!filename) {
    filename = 'untitled';
  }
  var ext = '';
  // make sure the file will have a name, see if filename needs extension
  if (filename && filename.indexOf('.') > -1) {
    ext = filename.split('.').pop();
  }
  // append extension if it doesn't exist
  if (extension) {
    if (ext !== extension) {
      ext = extension;
      filename = filename + '.' + ext;
    }
  }
  return [filename, ext];
}
p5.prototype._checkFileExtension = _checkFileExtension;

/**
 *  Returns true if the browser is Safari, false if not.
 *  Safari makes trouble for downloading files.
 *
 *  @return  {Boolean} [description]
 *  @private
 */
p5.prototype._isSafari = function() {
  var x = Object.prototype.toString.call(window.HTMLElement);
  return x.indexOf('Constructor') > 0;
};

/**
 *  Helper function, a callback for download that deletes
 *  an invisible anchor element from the DOM once the file
 *  has been automatically downloaded.
 *
 *  @private
 */
function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

module.exports = p5;
