/**
 * @module IO
 * @submodule Input
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import 'whatwg-fetch';
import 'es6-promise/auto';
import fetchJsonp from 'fetch-jsonp';
import fileSaver from 'file-saver';
import '../core/friendly_errors/validate_params';
import '../core/friendly_errors/file_errors';
import '../core/friendly_errors/fes_core';

/**
 * Loads a JSON file to create an `Object`.
 *
 * JavaScript Object Notation
 * (<a href="https://developer.mozilla.org/en-US/docs/Glossary/JSON" target="_blank">JSON</a>)
 * is a standard format for sending data between applications. The format is
 * based on JavaScript objects which have keys and values. JSON files store
 * data in an object with strings as keys. Values can be strings, numbers,
 * Booleans, arrays, `null`, or other objects.
 *
 * The first parameter, `path`, is always a string with the path to the file.
 * Paths to local files should be relative, as in
 * `loadJSON('assets/data.json')`. URLs such as
 * `'https://example.com/data.json'` may be blocked due to browser security.
 *
 * The second parameter, `successCallback`, is optional. If a function is
 * passed, as in `loadJSON('assets/data.json', handleData)`, then the
 * `handleData()` function will be called once the data loads. The object
 * created from the JSON data will be passed to `handleData()` as its only argument.
 *
 * The third parameter, `failureCallback`, is also optional. If a function is
 * passed, as in `loadJSON('assets/data.json', handleData, handleFailure)`,
 * then the `handleFailure()` function will be called if an error occurs while
 * loading. The `Error` object will be passed to `handleFailure()` as its only
 * argument.
 *
 * Note: Data can take time to load. Calling `loadJSON()` within
 * <a href="#/p5/preload">preload()</a> ensures data loads before it's used in
 * <a href="#/p5/setup">setup()</a> or <a href="#/p5/draw">draw()</a>.
 *
 * @method loadJSON
 * @param  {String} path path of the JSON file to be loaded.
 * @param  {function} [successCallback] function to call once the data is loaded. Will be passed the object.
 * @param  {function} [errorCallback] function to call if the data fails to load. Will be passed an `Error` event object.
 * @return {Object} object containing the loaded data.
 *
 * @example
 *
 * <div>
 * <code>
 * let myData;
 *
 * // Load the JSON and create an object.
 * function preload() {
 *   myData = loadJSON('assets/data.json');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the circle.
 *   fill(myData.color);
 *   noStroke();
 *
 *   // Draw the circle.
 *   circle(myData.x, myData.y, myData.d);
 *
 *   describe('A pink circle on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let myData;
 *
 * // Load the JSON and create an object.
 * function preload() {
 *   myData = loadJSON('assets/data.json');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a p5.Color object and make it transparent.
 *   let c = color(myData.color);
 *   c.setAlpha(80);
 *
 *   // Style the circles.
 *   fill(c);
 *   noStroke();
 *
 *   // Iterate over the myData.bubbles array.
 *   for (let b of myData.bubbles) {
 *     // Draw a circle for each bubble.
 *     circle(b.x, b.y, b.d);
 *   }
 *
 *   describe('Several pink bubbles floating in a blue sky.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let myData;
 *
 * // Load the GeoJSON and create an object.
 * function preload() {
 *   myData = loadJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Get data about the most recent earthquake.
 *   let quake = myData.features[0].properties;
 *
 *   // Draw a circle based on the earthquake's magnitude.
 *   circle(50, 50, quake.mag * 10);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(11);
 *
 *   // Display the earthquake's location.
 *   text(quake.place, 5, 80, 100);
 *
 *   describe(`A white circle on a gray background. The text "${quake.place}" is written beneath the circle.`);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let bigQuake;
 *
 * // Load the GeoJSON and preprocess it.
 * function preload() {
 *   loadJSON(
 *     'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
 *     handleData
 *   );
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw a circle based on the earthquake's magnitude.
 *   circle(50, 50, bigQuake.mag * 10);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(11);
 *
 *   // Display the earthquake's location.
 *   text(bigQuake.place, 5, 80, 100);
 *
 *   describe(`A white circle on a gray background. The text "${bigQuake.place}" is written beneath the circle.`);
 * }
 *
 * // Find the biggest recent earthquake.
 * function handleData(data) {
 *   let maxMag = 0;
 *   // Iterate over the earthquakes array.
 *   for (let quake of data.features) {
 *     // Reassign bigQuake if a larger
 *     // magnitude quake is found.
 *     if (quake.properties.mag > maxMag) {
 *       bigQuake = quake.properties;
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let bigQuake;
 *
 * // Load the GeoJSON and preprocess it.
 * function preload() {
 *   loadJSON(
 *     'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
 *     handleData,
 *     handleError
 *   );
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Draw a circle based on the earthquake's magnitude.
 *   circle(50, 50, bigQuake.mag * 10);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(11);
 *
 *   // Display the earthquake's location.
 *   text(bigQuake.place, 5, 80, 100);
 *
 *   describe(`A white circle on a gray background. The text "${bigQuake.place}" is written beneath the circle.`);
 * }
 *
 * // Find the biggest recent earthquake.
 * function handleData(data) {
 *   let maxMag = 0;
 *   // Iterate over the earthquakes array.
 *   for (let quake of data.features) {
 *     // Reassign bigQuake if a larger
 *     // magnitude quake is found.
 *     if (quake.properties.mag > maxMag) {
 *       bigQuake = quake.properties;
 *     }
 *   }
 * }
 *
 * // Log any errors to the console.
 * function handleError(error) {
 *   console.log('Oops!', error);
 * }
 * </code>
 * </div>
 */
p5.prototype.loadJSON = function(...args) {
  p5._validateParameters('loadJSON', args);
  const path = args[0];
  let callback;
  let errorCallback;
  let options;

  const ret = {}; // object needed for preload
  let t = 'json';

  // check for explicit data type argument
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === 'string') {
      if (arg === 'jsonp' || arg === 'json') {
        t = arg;
      }
    } else if (typeof arg === 'function') {
      if (!callback) {
        callback = arg;
      } else {
        errorCallback = arg;
      }
    } else if (
      typeof arg === 'object' &&
      (arg.hasOwnProperty('jsonpCallback') ||
        arg.hasOwnProperty('jsonpCallbackFunction'))
    ) {
      t = 'jsonp';
      options = arg;
    }
  }

  const self = this;
  this.httpDo(
    path,
    'GET',
    options,
    t,
    resp => {
      for (const k in resp) {
        ret[k] = resp[k];
      }
      if (typeof callback !== 'undefined') {
        callback(resp);
      }

      self._decrementPreload();
    },
    err => {
      // Error handling
      p5._friendlyFileLoadError(5, path);

      if (errorCallback) {
        errorCallback(err);
      } else {
        throw err;
      }
    }
  );

  return ret;
};

/**
 * Loads a text file to create an `Array`.
 *
 * The first parameter, `path`, is always a string with the path to the file.
 * Paths to local files should be relative, as in
 * `loadStrings('assets/data.txt')`. URLs such as
 * `'https://example.com/data.txt'` may be blocked due to browser security.
 *
 * The second parameter, `successCallback`, is optional. If a function is
 * passed, as in `loadStrings('assets/data.txt', handleData)`, then the
 * `handleData()` function will be called once the data loads. The array
 * created from the text data will be passed to `handleData()` as its only
 * argument.
 *
 * The third parameter, `failureCallback`, is also optional. If a function is
 * passed, as in `loadStrings('assets/data.txt', handleData, handleFailure)`,
 * then the `handleFailure()` function will be called if an error occurs while
 * loading. The `Error` object will be passed to `handleFailure()` as its only
 * argument.
 *
 * Note: Data can take time to load. Calling `loadStrings()` within
 * <a href="#/p5/preload">preload()</a> ensures data loads before it's used in
 * <a href="#/p5/setup">setup()</a> or <a href="#/p5/draw">draw()</a>.
 *
 * @method loadStrings
 * @param  {String} path path of the text file to be loaded.
 * @param  {function} [successCallback] function to call once the data is
 *                                      loaded. Will be passed the array.
 * @param  {function} [errorCallback] function to call if the data fails to
 *                                    load. Will be passed an `Error` event
 *                                    object.
 * @return {String[]} new array containing the loaded text.
 *
 * @example
 *
 * <div>
 * <code>
 * let myData;
 *
 * // Load the text and create an array.
 * function preload() {
 *   myData = loadStrings('assets/test.txt');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Select a random line from the text.
 *   let phrase = random(myData);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display the text.
 *   text(phrase, 10, 50, 90);
 *
 *   describe(`The text "${phrase}" written in black on a gray background.`);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let lastLine;
 *
 * // Load the text and preprocess it.
 * function preload() {
 *   loadStrings('assets/test.txt', handleData);
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display the text.
 *   text(lastLine, 10, 50, 90);
 *
 *   describe('The text "I talk like an orange" written in black on a gray background.');
 * }
 *
 * // Select the last line from the text.
 * function handleData(data) {
 *   lastLine = data[data.length - 1];
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let lastLine;
 *
 * // Load the text and preprocess it.
 * function preload() {
 *   loadStrings('assets/test.txt', handleData, handleError);
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display the text.
 *   text(lastLine, 10, 50, 90);
 *
 *   describe('The text "I talk like an orange" written in black on a gray background.');
 * }
 *
 * // Select the last line from the text.
 * function handleData(data) {
 *   lastLine = data[data.length - 1];
 * }
 *
 * // Log any errors to the console.
 * function handleError(error) {
 *   console.error('Oops!', error);
 * }
 * </code>
 * </div>
 */
p5.prototype.loadStrings = function(...args) {
  p5._validateParameters('loadStrings', args);

  const ret = [];
  let callback, errorCallback;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === 'function') {
      if (typeof callback === 'undefined') {
        callback = arg;
      } else if (typeof errorCallback === 'undefined') {
        errorCallback = arg;
      }
    }
  }

  const self = this;
  p5.prototype.httpDo.call(
    this,
    args[0],
    'GET',
    'text',
    data => {
      // split lines handling mac/windows/linux endings
      const lines = data
        .replace(/\r\n/g, '\r')
        .replace(/\n/g, '\r')
        .split(/\r/);

      // safe insert approach which will not blow up stack when inserting
      // >100k lines, but still be faster than iterating line-by-line. based on
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Examples
      const QUANTUM = 32768;
      for (let i = 0, len = lines.length; i < len; i += QUANTUM) {
        Array.prototype.push.apply(
          ret,
          lines.slice(i, Math.min(i + QUANTUM, len))
        );
      }

      if (typeof callback !== 'undefined') {
        callback(ret);
      }

      self._decrementPreload();
    },
    function(err) {
      // Error handling
      p5._friendlyFileLoadError(3, arguments[0]);

      if (errorCallback) {
        errorCallback(err);
      } else {
        throw err;
      }
    }
  );

  return ret;
};

/**
 * Reads the contents of a file or URL and creates a <a href="#/p5.Table">p5.Table</a> object with
 * its values. If a file is specified, it must be located in the sketch's
 * "data" folder. The filename parameter can also be a URL to a file found
 * online. By default, the file is assumed to be comma-separated (in CSV
 * format). Table only looks for a header row if the 'header' option is
 * included.
 *
 * This method is asynchronous, meaning it may not finish before the next
 * line in your sketch is executed. Calling <a href="#/p5/loadTable">loadTable()</a> inside <a href="#/p5/preload">preload()</a>
 * guarantees to complete the operation before <a href="#/p5/setup">setup()</a> and <a href="#/p5/draw">draw()</a> are called.
 * Outside of <a href="#/p5/preload">preload()</a>, you may supply a callback function to handle the
 * object:
 *
 * All files loaded and saved use UTF-8 encoding. This method is suitable for fetching files up to size of 64MB.
 * @method loadTable
 * @param  {String}         filename    name of the file or URL to load
 * @param  {String}         [extension] parse the table by comma-separated values "csv", semicolon-separated
 *                                      values "ssv", or tab-separated values "tsv"
 * @param  {String}         [header]    "header" to indicate table has header row
 * @param  {function}       [callback]  function to be executed after
 *                                      <a href="#/p5/loadTable">loadTable()</a> completes. On success, the
 *                                      <a href="#/p5.Table">Table</a> object is passed in as the
 *                                      first argument.
 * @param  {function}  [errorCallback]  function to be executed if
 *                                      there is an error, response is passed
 *                                      in as first argument
 * @return {Object}                     <a href="#/p5.Table">Table</a> object containing data
 *
 * @example
 * <div class='norender'>
 * <code>
 * // Given the following CSV file called "mammals.csv"
 * // located in the project's "assets" folder:
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
 *   //the file can be remote
 *   //table = loadTable("https://p5js.org/reference/assets/mammals.csv",
 *   //                  "csv", "header");
 * }
 *
 * function setup() {
 *   //count the columns
 *   print(table.getRowCount() + ' total rows in table');
 *   print(table.getColumnCount() + ' total columns in table');
 *
 *   print(table.getColumn('name'));
 *   //["Goat", "Leopard", "Zebra"]
 *
 *   //cycle through the table
 *   for (let r = 0; r < table.getRowCount(); r++)
 *     for (let c = 0; c < table.getColumnCount(); c++) {
 *       print(table.getString(r, c));
 *     }
 *   describe(`randomly generated text from a file,
 *     for example "i smell like butter"`);
 * }
 * </code>
 * </div>
 */
p5.prototype.loadTable = function(path) {
  // p5._validateParameters('loadTable', arguments);
  let callback;
  let errorCallback;
  const options = [];
  let header = false;
  const ext = path.substring(path.lastIndexOf('.') + 1, path.length);

  let sep;
  if (ext === 'csv') {
    sep = ',';
  } else if (ext === 'ssv') {
    sep = ';';
  } else if (ext === 'tsv') {
    sep = '\t';
  }

  for (let i = 1; i < arguments.length; i++) {
    if (typeof arguments[i] === 'function') {
      if (typeof callback === 'undefined') {
        callback = arguments[i];
      } else if (typeof errorCallback === 'undefined') {
        errorCallback = arguments[i];
      }
    } else if (typeof arguments[i] === 'string') {
      options.push(arguments[i]);
      if (arguments[i] === 'header') {
        header = true;
      }
      if (arguments[i] === 'csv') {
        sep = ',';
      } else if (arguments[i] === 'ssv') {
        sep = ';';
      } else if (arguments[i] === 'tsv') {
        sep = '\t';
      }
    }
  }

  const t = new p5.Table();

  const self = this;
  this.httpDo(
    path,
    'GET',
    'table',
    resp => {
      const state = {};

      // define constants
      const PRE_TOKEN = 0,
        MID_TOKEN = 1,
        POST_TOKEN = 2,
        POST_RECORD = 4;

      const QUOTE = '"',
        CR = '\r',
        LF = '\n';

      const records = [];
      let offset = 0;
      let currentRecord = null;
      let currentChar;

      const tokenBegin = () => {
        state.currentState = PRE_TOKEN;
        state.token = '';
      };

      const tokenEnd = () => {
        currentRecord.push(state.token);
        tokenBegin();
      };

      const recordBegin = () => {
        state.escaped = false;
        currentRecord = [];
        tokenBegin();
      };

      const recordEnd = () => {
        state.currentState = POST_RECORD;
        records.push(currentRecord);
        currentRecord = null;
      };

      for (;;) {
        currentChar = resp[offset++];

        // EOF
        if (currentChar == null) {
          if (state.escaped) {
            throw new Error('Unclosed quote in file.');
          }
          if (currentRecord) {
            tokenEnd();
            recordEnd();
            break;
          }
        }
        if (currentRecord === null) {
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
            } else {
              state.escaped = false;
              state.currentState = POST_TOKEN;
            }
          } else if (currentChar === CR) {
            continue;
          } else {
            state.token += currentChar;
          }
          continue;
        }

        // fall-through: mid-token or post-token, not escaped
        if (currentChar === CR) {
          if (resp[offset] === LF) {
            offset++;
          }
          tokenEnd();
          recordEnd();
        } else if (currentChar === LF) {
          tokenEnd();
          recordEnd();
        } else if (currentChar === sep) {
          tokenEnd();
        } else if (state.currentState === MID_TOKEN) {
          state.token += currentChar;
        }
      }

      // set up column names
      if (header) {
        t.columns = records.shift();
      } else {
        for (let i = 0; i < records[0].length; i++) {
          t.columns[i] = 'null';
        }
      }
      let row;
      for (let i = 0; i < records.length; i++) {
        //Handles row of 'undefined' at end of some CSVs
        if (records[i].length === 1) {
          if (records[i][0] === 'undefined' || records[i][0] === '') {
            continue;
          }
        }
        row = new p5.TableRow();
        row.arr = records[i];
        row.obj = makeObject(records[i], t.columns);
        t.addRow(row);
      }
      if (typeof callback === 'function') {
        callback(t);
      }

      self._decrementPreload();
    },
    err => {
      // Error handling
      p5._friendlyFileLoadError(2, path);

      if (errorCallback) {
        errorCallback(err);
      } else {
        console.error(err);
      }
    }
  );

  return t;
};

// helper function to turn a row into a JSON object
function makeObject(row, headers) {
  headers = headers || [];
  if (typeof headers === 'undefined') {
    for (let j = 0; j < row.length; j++) {
      headers[j.toString()] = j;
    }
  }
  return Object.fromEntries(
    headers
      .map((key,i) => [key, row[i]])
  );
}

/**
 * Loads an XML file to create a <a href="#/p5.XML">p5.XML</a> object.
 *
 * Extensible Markup Language
 * (<a href="https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction" target="_blank">XML</a>)
 * is a standard format for sending data between applications. Like HTML, the
 * XML format is based on tags and attributes, as in
 * `&lt;time units="s"&gt;1234&lt;/time&gt;`.
 *
 * The first parameter, `path`, is always a string with the path to the file.
 * Paths to local files should be relative, as in
 * `loadXML('assets/data.xml')`. URLs such as `'https://example.com/data.xml'`
 * may be blocked due to browser security.
 *
 * The second parameter, `successCallback`, is optional. If a function is
 * passed, as in `loadXML('assets/data.xml', handleData)`, then the
 * `handleData()` function will be called once the data loads. The
 * <a href="#/p5.XML">p5.XML</a> object created from the data will be passed
 * to `handleData()` as its only argument.
 *
 * The third parameter, `failureCallback`, is also optional. If a function is
 * passed, as in `loadXML('assets/data.xml', handleData, handleFailure)`, then
 * the `handleFailure()` function will be called if an error occurs while
 * loading. The `Error` object will be passed to `handleFailure()` as its only
 * argument.
 *
 * Note: Data can take time to load. Calling `loadXML()` within
 * <a href="#/p5/preload">preload()</a> ensures data loads before it's used in
 * <a href="#/p5/setup">setup()</a> or <a href="#/p5/draw">draw()</a>.
 *
 * @method loadXML
 * @param  {String} path path of the XML file to be loaded.
 * @param  {function} [successCallback] function to call once the data is
 *                                      loaded. Will be passed the
 *                                      <a href="#/p5.XML">p5.XML</a> object.
 * @param  {function} [errorCallback] function to call if the data fails to
 *                                    load. Will be passed an `Error` event
 *                                    object.
 * @return {p5.XML} XML data loaded into a <a href="#/p5.XML">p5.XML</a>
 *                  object.
 *
 * @example
 * <div>
 * <code>
 * let myXML;
 *
 * // Load the XML and create a p5.XML object.
 * function preload() {
 *   myXML = loadXML('assets/animals.xml');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Get an array with all mammal tags.
 *   let mammals = myXML.getChildren('mammal');
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(14);
 *
 *   // Iterate over the mammals array.
 *   for (let i = 0; i < mammals.length; i += 1) {
 *
 *     // Calculate the y-coordinate.
 *     let y = (i + 1) * 25;
 *
 *     // Get the mammal's common name.
 *     let name = mammals[i].getContent();
 *
 *     // Display the mammal's name.
 *     text(name, 20, y);
 *   }
 *
 *   describe(
 *     'The words "Goat", "Leopard", and "Zebra" written on three separate lines. The text is black on a gray background.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let lastMammal;
 *
 * // Load the XML and create a p5.XML object.
 * function preload() {
 *   loadXML('assets/animals.xml', handleData);
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(16);
 *
 *   // Display the content of the last mammal element.
 *   text(lastMammal, 50, 50);
 *
 *   describe('The word "Zebra" written in black on a gray background.');
 * }
 *
 * // Get the content of the last mammal element.
 * function handleData(data) {
 *   // Get an array with all mammal elements.
 *   let mammals = data.getChildren('mammal');
 *
 *   // Get the content of the last mammal.
 *   lastMammal = mammals[mammals.length - 1].getContent();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let lastMammal;
 *
 * // Load the XML and preprocess it.
 * function preload() {
 *   loadXML('assets/animals.xml', handleData, handleError);
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER, CENTER);
 *   textFont('Courier New');
 *   textSize(16);
 *
 *   // Display the content of the last mammal element.
 *   text(lastMammal, 50, 50);
 *
 *   describe('The word "Zebra" written in black on a gray background.');
 * }
 *
 * // Get the content of the last mammal element.
 * function handleData(data) {
 *   // Get an array with all mammal elements.
 *   let mammals = data.getChildren('mammal');
 *
 *   // Get the content of the last mammal.
 *   lastMammal = mammals[mammals.length - 1].getContent();
 * }
 *
 * // Log any errors to the console.
 * function handleError(error) {
 *   console.error('Oops!', error);
 * }
 * </code>
 * </div>
 */
p5.prototype.loadXML = function(...args) {
  const ret = new p5.XML();
  let callback, errorCallback;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === 'function') {
      if (typeof callback === 'undefined') {
        callback = arg;
      } else if (typeof errorCallback === 'undefined') {
        errorCallback = arg;
      }
    }
  }

  const self = this;
  this.httpDo(
    args[0],
    'GET',
    'xml',
    xml => {
      for (const key in xml) {
        ret[key] = xml[key];
      }
      if (typeof callback !== 'undefined') {
        callback(ret);
      }

      self._decrementPreload();
    },
    function(err) {
      // Error handling
      p5._friendlyFileLoadError(1, arguments[0]);

      if (errorCallback) {
        errorCallback(err);
      } else {
        throw err;
      }
    }
  );

  return ret;
};

/**
 * This method is suitable for fetching files up to size of 64MB.
 * @method loadBytes
 * @param {string}   file            name of the file or URL to load
 * @param {function} [callback]      function to be executed after <a href="#/p5/loadBytes">loadBytes()</a>
 *                                    completes
 * @param {function} [errorCallback] function to be executed if there
 *                                    is an error
 * @returns {Object} an object whose 'bytes' property will be the loaded buffer
 *
 * @example
 * <div class='norender'><code>
 * let data;
 *
 * function preload() {
 *   data = loadBytes('assets/mammals.xml');
 * }
 *
 * function setup() {
 *   for (let i = 0; i < 5; i++) {
 *     console.log(data.bytes[i].toString(16));
 *   }
 *   describe('no image displayed');
 * }
 * </code></div>
 */
p5.prototype.loadBytes = function(file, callback, errorCallback) {
  const ret = {};

  const self = this;
  this.httpDo(
    file,
    'GET',
    'arrayBuffer',
    arrayBuffer => {
      ret.bytes = new Uint8Array(arrayBuffer);

      if (typeof callback === 'function') {
        callback(ret);
      }

      self._decrementPreload();
    },
    err => {
      // Error handling
      p5._friendlyFileLoadError(6, file);

      if (errorCallback) {
        errorCallback(err);
      } else {
        throw err;
      }
    }
  );
  return ret;
};

/**
 * Method for executing an HTTP GET request. If data type is not specified,
 * p5 will try to guess based on the URL, defaulting to text. This is equivalent to
 * calling <code>httpDo(path, 'GET')</code>. The 'binary' datatype will return
 * a Blob object, and the 'arrayBuffer' datatype will return an ArrayBuffer
 * which can be used to initialize typed arrays (such as Uint8Array).
 *
 * @method httpGet
 * @param  {String}        path       name of the file or url to load
 * @param  {String}        [datatype] "json", "jsonp", "binary", "arrayBuffer",
 *                                    "xml", or "text"
 * @param  {Object|Boolean} [data]    param data passed sent with request
 * @param  {function}      [callback] function to be executed after
 *                                    <a href="#/p5/httpGet">httpGet()</a> completes, data is passed in
 *                                    as first argument
 * @param  {function}      [errorCallback] function to be executed if
 *                                    there is an error, response is passed
 *                                    in as first argument
 * @return {Promise} A promise that resolves with the data when the operation
 *                   completes successfully or rejects with the error after
 *                   one occurs.
 * @example
 * <div class='norender'><code>
 * // Examples use USGS Earthquake API:
 * //   https://earthquake.usgs.gov/fdsnws/event/1/#methods
 * let earthquakes;
 * function preload() {
 *   // Get the most recent earthquake in the database
 *   let url =
    'https://earthquake.usgs.gov/fdsnws/event/1/query?' +
 *     'format=geojson&limit=1&orderby=time';
 *   httpGet(url, 'jsonp', false, function(response) {
 *     // when the HTTP request completes, populate the variable that holds the
 *     // earthquake data used in the visualization.
 *     earthquakes = response;
 *   });
 * }
 *
 * function draw() {
 *   if (!earthquakes) {
 *     // Wait until the earthquake data has loaded before drawing.
 *     return;
 *   }
 *   background(200);
 *   // Get the magnitude and name of the earthquake out of the loaded JSON
 *   let earthquakeMag = earthquakes.features[0].properties.mag;
 *   let earthquakeName = earthquakes.features[0].properties.place;
 *   ellipse(width / 2, height / 2, earthquakeMag * 10, earthquakeMag * 10);
 *   textAlign(CENTER);
 *   text(earthquakeName, 0, height - 30, width, 30);
 *   noLoop();
 * }
 * </code></div>
 */
/**
 * @method httpGet
 * @param  {String}        path
 * @param  {Object|Boolean} data
 * @param  {function}      [callback]
 * @param  {function}      [errorCallback]
 * @return {Promise}
 */
/**
 * @method httpGet
 * @param  {String}        path
 * @param  {function}      callback
 * @param  {function}      [errorCallback]
 * @return {Promise}
 */
p5.prototype.httpGet = function(...args) {
  p5._validateParameters('httpGet', args);

  args.splice(1, 0, 'GET');
  return p5.prototype.httpDo.apply(this, args);
};

/**
 * Method for executing an HTTP POST request. If data type is not specified,
 * p5 will try to guess based on the URL, defaulting to text. This is equivalent to
 * calling <code>httpDo(path, 'POST')</code>.
 *
 * @method httpPost
 * @param  {String}        path       name of the file or url to load
 * @param  {String}        [datatype] "json", "jsonp", "xml", or "text".
 *                                    If omitted, <a href="#/p5/httpPost">httpPost()</a> will guess.
 * @param  {Object|Boolean} [data]    param data passed sent with request
 * @param  {function}      [callback] function to be executed after
 *                                    <a href="#/p5/httpPost">httpPost()</a> completes, data is passed in
 *                                    as first argument
 * @param  {function}      [errorCallback] function to be executed if
 *                                    there is an error, response is passed
 *                                    in as first argument
 * @return {Promise} A promise that resolves with the data when the operation
 *                   completes successfully or rejects with the error after
 *                   one occurs.
 *
 * @example
 * <div>
 * <code>
 * // Examples use jsonplaceholder.typicode.com for a Mock Data API
 *
 * let url = 'https://jsonplaceholder.typicode.com/posts';
 * let postData = { userId: 1, title: 'p5 Clicked!', body: 'p5.js is very cool.' };
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   background(200);
 * }
 *
 * function mousePressed() {
 *   httpPost(url, 'json', postData, function(result) {
 *     strokeWeight(2);
 *     text(result.body, mouseX, mouseY);
 *   });
 * }
 * </code>
 * </div>
 *
 * <div><code>
 * let url = 'ttps://invalidURL'; // A bad URL that will cause errors
 * let postData = { title: 'p5 Clicked!', body: 'p5.js is very cool.' };
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   background(200);
 * }
 *
 * function mousePressed() {
 *   httpPost(
 *     url,
 *     'json',
 *     postData,
 *     function(result) {
 *       // ... won't be called
 *     },
 *     function(error) {
 *       strokeWeight(2);
 *       text(error.toString(), mouseX, mouseY);
 *     }
 *   );
 * }
 * </code></div>
 */
/**
 * @method httpPost
 * @param  {String}        path
 * @param  {Object|Boolean} data
 * @param  {function}      [callback]
 * @param  {function}      [errorCallback]
 * @return {Promise}
 */
/**
 * @method httpPost
 * @param  {String}        path
 * @param  {function}      callback
 * @param  {function}      [errorCallback]
 * @return {Promise}
 */
p5.prototype.httpPost = function(...args) {
  p5._validateParameters('httpPost', args);

  args.splice(1, 0, 'POST');
  return p5.prototype.httpDo.apply(this, args);
};

/**
 * Method for executing an HTTP request. If data type is not specified,
 * p5 will try to guess based on the URL, defaulting to text.<br><br>
 * For more advanced use, you may also pass in the path as the first argument
 * and a object as the second argument, the signature follows the one specified
 * in the Fetch API specification.
 * This method is suitable for fetching files up to size of 64MB when "GET" is used.
 *
 * @method httpDo
 * @param  {String}        path       name of the file or url to load
 * @param  {String}        [method]   either "GET", "POST", or "PUT",
 *                                    defaults to "GET"
 * @param  {String}        [datatype] "json", "jsonp", "xml", or "text"
 * @param  {Object}        [data]     param data passed sent with request
 * @param  {function}      [callback] function to be executed after
 *                                    <a href="#/p5/httpGet">httpGet()</a> completes, data is passed in
 *                                    as first argument
 * @param  {function}      [errorCallback] function to be executed if
 *                                    there is an error, response is passed
 *                                    in as first argument
 * @return {Promise} A promise that resolves with the data when the operation
 *                   completes successfully or rejects with the error after
 *                   one occurs.
 *
 * @example
 * <div>
 * <code>
 * // Examples use USGS Earthquake API:
 * // https://earthquake.usgs.gov/fdsnws/event/1/#methods
 *
 * // displays an animation of all USGS earthquakes
 * let earthquakes;
 * let eqFeatureIndex = 0;
 *
 * function preload() {
 *   let url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
 *   httpDo(
 *     url,
 *     {
 *       method: 'GET',
 *       // Other Request options, like special headers for apis
 *       headers: { authorization: 'Bearer secretKey' }
 *     },
 *     function(res) {
 *       earthquakes = res;
 *     }
 *   );
 * }
 *
 * function draw() {
 *   // wait until the data is loaded
 *   if (!earthquakes || !earthquakes.features[eqFeatureIndex]) {
 *     return;
 *   }
 *   clear();
 *
 *   let feature = earthquakes.features[eqFeatureIndex];
 *   let mag = feature.properties.mag;
 *   let rad = mag / 11 * ((width + height) / 2);
 *   fill(255, 0, 0, 100);
 *   ellipse(width / 2 + random(-2, 2), height / 2 + random(-2, 2), rad, rad);
 *
 *   if (eqFeatureIndex >= earthquakes.features.length) {
 *     eqFeatureIndex = 0;
 *   } else {
 *     eqFeatureIndex += 1;
 *   }
 * }
 * </code>
 * </div>
 */
/**
 * @method httpDo
 * @param  {String}        path
 * @param  {Object}        options   Request object options as documented in the
 *                                    "fetch" API
 * <a href="https://developer.mozilla.org/en/docs/Web/API/Fetch_API">reference</a>
 * @param  {function}      [callback]
 * @param  {function}      [errorCallback]
 * @return {Promise}
 */
p5.prototype.httpDo = function(...args) {
  let type;
  let callback;
  let errorCallback;
  let request;
  let promise;
  const jsonpOptions = {};
  let cbCount = 0;
  let contentType = 'text/plain';
  // Trim the callbacks off the end to get an idea of how many arguments are passed
  for (let i = args.length - 1; i > 0; i--) {
    if (typeof args[i] === 'function') {
      cbCount++;
    } else {
      break;
    }
  }
  // The number of arguments minus callbacks
  const argsCount = args.length - cbCount;
  const path = args[0];
  if (
    argsCount === 2 &&
    typeof path === 'string' &&
    typeof args[1] === 'object'
  ) {
    // Intended for more advanced use, pass in Request parameters directly
    request = new Request(path, args[1]);
    callback = args[2];
    errorCallback = args[3];
  } else {
    // Provided with arguments
    let method = 'GET';
    let data;

    for (let j = 1; j < args.length; j++) {
      const a = args[j];
      if (typeof a === 'string') {
        if (a === 'GET' || a === 'POST' || a === 'PUT' || a === 'DELETE') {
          method = a;
        } else if (
          a === 'json' ||
          a === 'jsonp' ||
          a === 'binary' ||
          a === 'arrayBuffer' ||
          a === 'xml' ||
          a === 'text' ||
          a === 'table'
        ) {
          type = a;
        } else {
          data = a;
        }
      } else if (typeof a === 'number') {
        data = a.toString();
      } else if (typeof a === 'object') {
        if (
          a.hasOwnProperty('jsonpCallback') ||
          a.hasOwnProperty('jsonpCallbackFunction')
        ) {
          for (const attr in a) {
            jsonpOptions[attr] = a[attr];
          }
        } else if (a instanceof p5.XML) {
          data = a.serialize();
          contentType = 'application/xml';
        } else {
          data = JSON.stringify(a);
          contentType = 'application/json';
        }
      } else if (typeof a === 'function') {
        if (!callback) {
          callback = a;
        } else {
          errorCallback = a;
        }
      }
    }

    let headers =
      method === 'GET'
        ? new Headers()
        : new Headers({ 'Content-Type': contentType });

    request = new Request(path, {
      method,
      mode: 'cors',
      body: data,
      headers
    });
  }
  // do some sort of smart type checking
  if (!type) {
    if (path.includes('json')) {
      type = 'json';
    } else if (path.includes('xml')) {
      type = 'xml';
    } else {
      type = 'text';
    }
  }

  if (type === 'jsonp') {
    promise = fetchJsonp(path, jsonpOptions);
  } else {
    promise = fetch(request);
  }
  promise = promise.then(res => {
    if (!res.ok) {
      const err = new Error(res.body);
      err.status = res.status;
      err.ok = false;
      throw err;
    } else {
      let fileSize = 0;
      if (type !== 'jsonp') {
        fileSize = res.headers.get('content-length');
      }
      if (fileSize && fileSize > 64000000) {
        p5._friendlyFileLoadError(7, path);
      }
      switch (type) {
        case 'json':
        case 'jsonp':
          return res.json();
        case 'binary':
          return res.blob();
        case 'arrayBuffer':
          return res.arrayBuffer();
        case 'xml':
          return res.text().then(text => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            return new p5.XML(xml.documentElement);
          });
        default:
          return res.text();
      }
    }
  });
  promise.then(callback || (() => {}));
  promise.catch(errorCallback || console.error);
  return promise;
};

/**
 * @module IO
 * @submodule Output
 * @for p5
 */

window.URL = window.URL || window.webkitURL;

// private array of p5.PrintWriter objects
p5.prototype._pWriters = [];

/**
 * Creates a new <a href="#/p5.PrintWriter">p5.PrintWriter</a> object.
 *
 * <a href="#/p5.PrintWriter">p5.PrintWriter</a> objects provide a way to
 * save a sequence of text data, called the *print stream*, to the user's
 * computer. They're low-level objects that enable precise control of text
 * output. Functions such as
 * <a href="#/p5/saveStrings">saveStrings()</a> and
 * <a href="#/p5/saveJSON">saveJSON()</a> are easier to use for simple file
 * saving.
 *
 * The first parameter, `filename`, is the name of the file to be written. If
 * a string is passed, as in `createWriter('words.txt')`, a new
 * <a href="#/p5.PrintWriter">p5.PrintWriter</a> object will be created that
 * writes to a file named `words.txt`.
 *
 * The second parameter, `extension`, is optional. If a string is passed, as
 * in `createWriter('words', 'csv')`, the first parameter will be interpreted
 * as the file name and the second parameter as the extension.
 *
 * @method createWriter
 * @param {String} name name of the file to create.
 * @param {String} [extension] format to use for the file.
 * @return {p5.PrintWriter} stream for writing data.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create a p5.PrintWriter object.
 *     let myWriter = createWriter('xo.txt');
 *
 *     // Add some lines to the print stream.
 *     myWriter.print('XOO');
 *     myWriter.print('OXO');
 *     myWriter.print('OOX');
 *
 *     // Save the file and close the print stream.
 *     myWriter.close();
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create a p5.PrintWriter object.
 *     // Use the file format .csv.
 *     let myWriter = createWriter('mauna_loa_co2', 'csv');
 *
 *     // Add some lines to the print stream.
 *     myWriter.print('date,ppm_co2');
 *     myWriter.print('1960-01-01,316.43');
 *     myWriter.print('1970-01-01,325.06');
 *     myWriter.print('1980-01-01,337.9');
 *     myWriter.print('1990-01-01,353.86');
 *     myWriter.print('2000-01-01,369.45');
 *     myWriter.print('2020-01-01,413.61');
 *
 *     // Save the file and close the print stream.
 *     myWriter.close();
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.createWriter = function(name, extension) {
  let newPW;
  // check that it doesn't already exist
  for (const i in p5.prototype._pWriters) {
    if (p5.prototype._pWriters[i].name === name) {
      // if a p5.PrintWriter w/ this name already exists...
      // return p5.prototype._pWriters[i]; // return it w/ contents intact.
      // or, could return a new, empty one with a unique name:
      newPW = new p5.PrintWriter(name + this.millis(), extension);
      p5.prototype._pWriters.push(newPW);
      return newPW;
    }
  }
  newPW = new p5.PrintWriter(name, extension);
  p5.prototype._pWriters.push(newPW);
  return newPW;
};

/**
 * A class to describe a print stream.
 *
 * Each `p5.PrintWriter` object provides a way to save a sequence of text
 * data, called the *print stream*, to the user's computer. It's a low-level
 * object that enables precise control of text output. Functions such as
 * <a href="#/p5/saveStrings">saveStrings()</a> and
 * <a href="#/p5/saveJSON">saveJSON()</a> are easier to use for simple file
 * saving.
 *
 * Note: <a href="#/p5/createWriter">createWriter()</a> is the recommended way
 * to make an instance of this class.
 *
 * @class p5.PrintWriter
 * @param  {String} filename name of the file to create.
 * @param  {String} [extension] format to use for the file.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   // Create a p5.PrintWriter object.
 *   let myWriter = createWriter('xo.txt');
 *
 *   // Add some lines to the print stream.
 *   myWriter.print('XOO');
 *   myWriter.print('OXO');
 *   myWriter.print('OOX');
 *
 *   // Save the file and close the print stream.
 *   myWriter.close();
 * }
 * </code>
 * </div>
 */
p5.PrintWriter = function(filename, extension) {
  let self = this;
  this.name = filename;
  this.content = '';

  /**
   * Writes data to the print stream without adding new lines.
   *
   * The parameter, `data`, is the data to write. `data` can be a number or
   * string, as in `myWriter.write('hi')`, or an array of numbers and strings,
   * as in `myWriter.write([1, 2, 3])`. A comma will be inserted between array
   * array elements when they're added to the print stream.
   *
   * @method write
   * @param {String|Number|Array} data data to be written as a string, number,
   *                                   or array of strings and numbers.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textFont('Courier New');
   *   textSize(12);
   *
   *   // Display instructions.
   *   text('Double-click to save', 5, 50, 90);
   *
   *   describe('The text "Double-click to save" written in black on a gray background.');
   * }
   *
   * // Save the file when the user double-clicks.
   * function doubleClicked() {
   *   // Create a p5.PrintWriter object.
   *   let myWriter = createWriter('numbers.txt');
   *
   *   // Add some data to the print stream.
   *   myWriter.write('1,2,3,');
   *   myWriter.write(['4', '5', '6']);
   *
   *   // Save the file and close the print stream.
   *   myWriter.close();
   * }
   * </code>
   * </div>
   */
  this.write = function(data) {
    this.content += data;
  };

  /**
   * Writes data to the print stream with new lines added.
   *
   * The parameter, `data`, is the data to write. `data` can be a number or
   * string, as in `myWriter.print('hi')`, or an array of numbers and strings,
   * as in `myWriter.print([1, 2, 3])`. A comma will be inserted between array
   * array elements when they're added to the print stream.
   *
   * @method print
   * @param {String|Number|Array} data data to be written as a string, number,
   *                                   or array of strings and numbers.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textFont('Courier New');
   *   textSize(12);
   *
   *   // Display instructions.
   *   text('Double-click to save', 5, 50, 90);
   *
   *   describe('The text "Double-click to save" written in black on a gray background.');
   * }
   *
   * // Save the file when the user double-clicks.
   * function doubleClicked() {
   *   // Create a p5.PrintWriter object.
   *   let myWriter = createWriter('numbers.txt');
   *
   *   // Add some data to the print stream.
   *   myWriter.print('1,2,3,');
   *   myWriter.print(['4', '5', '6']);
   *
   *   // Save the file and close the print stream.
   *   myWriter.close();
   * }
   * </code>
   * </div>
   */
  this.print = function(data) {
    this.content += `${data}\n`;
  };

  /**
   * Clears all data from the print stream.
   *
   * @method clear
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textFont('Courier New');
   *   textSize(12);
   *
   *   // Display instructions.
   *   text('Double-click to save', 5, 50, 90);
   *
   *   describe('The text "Double-click to save" written in black on a gray background.');
   * }
   *
   * // Save the file when the user double-clicks.
   * function doubleClicked() {
   *   // Create a p5.PrintWriter object.
   *   let myWriter = createWriter('numbers.txt');
   *
   *   // Add some data to the print stream.
   *   myWriter.print('Hello p5*js!');
   *
   *   // Clear the print stream.
   *   myWriter.clear();
   *
   *   // Save the file and close the print stream.
   *   myWriter.close();
   * }
   * </code>
   * </div>
   */
  this.clear = function() {
    this.content = '';
  };

  /**
   * Saves the file and closes the print stream.
   *
   * @method close
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textFont('Courier New');
   *   textSize(12);
   *
   *   // Display instructions.
   *   text('Double-click to save', 5, 50, 90);
   *
   *   describe('The text "Double-click to save" written in black on a gray background.');
   * }
   *
   * // Save the file when the user double-clicks.
   * function doubleClicked() {
   *   // Create a p5.PrintWriter object.
   *   let myWriter = createWriter('cat.txt');
   *
   *   // Add some data to the print stream.
   *   // ASCII art courtesy Wikipedia:
   *   // https://en.wikipedia.org/wiki/ASCII_art
   *   myWriter.print(' (\\_/) ');
   *   myWriter.print("(='.'=)");
   *   myWriter.print('(")_(")');
   *
   *   // Save the file and close the print stream.
   *   myWriter.close();
   * }
   * </code>
   * </div>
   */
  this.close = function() {
    // convert String to Array for the writeFile Blob
    const arr = [];
    arr.push(this.content);
    p5.prototype.writeFile(arr, filename, extension);
    // remove from _pWriters array and delete self
    for (const i in p5.prototype._pWriters) {
      if (p5.prototype._pWriters[i].name === this.name) {
        // remove from _pWriters array
        p5.prototype._pWriters.splice(i, 1);
      }
    }
    self.clear();
    self = {};
  };
};

/**
 * @module IO
 * @submodule Output
 * @for p5
 */

// object, filename, options --> saveJSON, saveStrings,
// filename, [extension] [canvas] --> saveImage

/**
 *  Saves a given element(image, text, json, csv, wav, or html) to the client's
 *  computer. The first parameter can be a pointer to element we want to save.
 *  The element can be one of <a href="#/p5.Element">p5.Element</a>,an Array of
 *  Strings, an Array of JSON, a JSON object, a <a href="#/p5.Table">p5.Table
 *  </a>, a <a href="#/p5.Image">p5.Image</a>, or a p5.SoundFile (requires
 *  p5.sound). The second parameter is a filename (including extension).The
 *  third parameter is for options specific to this type of object. This method
 *  will save a file that fits the given parameters.
 *  If it is called without specifying an element, by default it will save the
 *  whole canvas as an image file. You can optionally specify a filename as
 *  the first parameter in such a case.
 *  **Note that it is not recommended to
 *  call this method within draw, as it will open a new save dialog on every
 *  render.**
 *
 * @method save
 * @param  {Object|String} [objectOrFilename]  If filename is provided, will
 *                                             save canvas as an image with
 *                                             either png or jpg extension
 *                                             depending on the filename.
 *                                             If object is provided, will
 *                                             save depending on the object
 *                                             and filename (see examples
 *                                             above).
 * @param  {String} [filename] If an object is provided as the first
 *                               parameter, then the second parameter
 *                               indicates the filename,
 *                               and should include an appropriate
 *                               file extension (see examples above).
 * @param  {Boolean|String} [options]  Additional options depend on
 *                            filetype. For example, when saving JSON,
 *                            <code>true</code> indicates that the
 *                            output will be optimized for filesize,
 *                            rather than readability.
 *
 * @example
 * <div class="norender"><code>
 * // Saves the canvas as an image
 * cnv = createCanvas(300, 300);
 * save(cnv, 'myCanvas.jpg');
 *
 * // Saves the canvas as an image by default
 * save('myCanvas.jpg');
 * describe('An example for saving a canvas as an image.');
 * </code></div>
 *
 * <div class="norender"><code>
 * // Saves p5.Image as an image
 * img = createImage(10, 10);
 * save(img, 'myImage.png');
 * describe('An example for saving a p5.Image element as an image.');
 * </code></div>
 *
 * <div class="norender"><code>
 * // Saves p5.Renderer object as an image
 * obj = createGraphics(100, 100);
 * save(obj, 'myObject.png');
 * describe('An example for saving a p5.Renderer element.');
 * </code></div>
 *
 * <div class="norender"><code>
 * let myTable = new p5.Table();
 * // Saves table as html file
 * save(myTable, 'myTable.html');
 *
 * // Comma Separated Values
 * save(myTable, 'myTable.csv');
 *
 * // Tab Separated Values
 * save(myTable, 'myTable.tsv');
 *
 * describe(`An example showing how to save a table in formats of
 *   HTML, CSV and TSV.`);
 * </code></div>
 *
 * <div class="norender"><code>
 * let myJSON = { a: 1, b: true };
 *
 * // Saves pretty JSON
 * save(myJSON, 'my.json');
 *
 * // Optimizes JSON filesize
 * save(myJSON, 'my.json', true);
 *
 * describe('An example for saving JSON to a txt file with some extra arguments.');
 * </code></div>
 *
 * <div class="norender"><code>
 * // Saves array of strings to text file with line breaks after each item
 * let arrayOfStrings = ['a', 'b'];
 * save(arrayOfStrings, 'my.txt');
 * describe(`An example for saving an array of strings to text file
 *   with line breaks.`);
 * </code></div>
 */

p5.prototype.save = function(object, _filename, _options) {
  // parse the arguments and figure out which things we are saving
  const args = arguments;
  // =================================================
  // OPTION 1: saveCanvas...

  // if no arguments are provided, save canvas
  const cnv = this._curElement ? this._curElement.elt : this.elt;
  if (args.length === 0) {
    p5.prototype.saveCanvas(cnv);
    return;
  } else if (args[0] instanceof p5.Renderer || args[0] instanceof p5.Graphics) {
    // otherwise, parse the arguments

    // if first param is a p5Graphics, then saveCanvas
    p5.prototype.saveCanvas(args[0].elt, args[1], args[2]);
    return;
  } else if (args.length === 1 && typeof args[0] === 'string') {
    // if 1st param is String and only one arg, assume it is canvas filename
    p5.prototype.saveCanvas(cnv, args[0]);
  } else {
    // =================================================
    // OPTION 2: extension clarifies saveStrings vs. saveJSON
    const extension = _checkFileExtension(args[1], args[2])[1];
    switch (extension) {
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
        } else if (args[0] instanceof p5.Table) {
          p5.prototype.saveTable(args[0], args[1], args[2]);
        } else if (args[0] instanceof p5.Image) {
          p5.prototype.saveCanvas(args[0].canvas, args[1]);
        } else if (args[0] instanceof p5.SoundFile) {
          p5.prototype.saveSound(args[0], args[1], args[2], args[3]);
        }
    }
  }
};

/**
 * Saves an `Object` or `Array` to a JSON file.
 *
 * JavaScript Object Notation
 * (<a href="https://developer.mozilla.org/en-US/docs/Glossary/JSON" target="_blank">JSON</a>)
 * is a standard format for sending data between applications. The format is
 * based on JavaScript objects which have keys and values. JSON files store
 * data in an object with strings as keys. Values can be strings, numbers,
 * Booleans, arrays, `null`, or other objects.
 *
 * The first parameter, `json`, is the data to save. The data can be an array,
 * as in `[1, 2, 3]`, or an object, as in
 * `{ x: 50, y: 50, color: 'deeppink' }`.
 *
 * The second parameter, `filename`, is a string that sets the file's name.
 * For example, calling `saveJSON([1, 2, 3], 'data.json')` saves the array
 * `[1, 2, 3]` to a file called `data.json` on the user's computer.
 *
 * The third parameter, `optimize`, is optional. If `true` is passed, as in
 * `saveJSON([1, 2, 3], 'data.json', true)`, then all unneeded whitespace will
 * be removed to reduce the file size.
 *
 * Note: The browser will either save the file immediately or prompt the user
 * with a dialogue window.
 *
 * @method saveJSON
 * @param  {Array|Object} json data to save.
 * @param  {String} filename name of the file to be saved.
 * @param  {Boolean} [optimize] whether to trim unneeded whitespace. Defaults
 *                              to `true`.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create an array.
 *     let data = [1, 2, 3];
 *
 *     // Save the JSON file.
 *     saveJSON(data, 'numbers.json');
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create an object.
 *     let data = { x: mouseX, y: mouseY };
 *
 *     // Save the JSON file.
 *     saveJSON(data, 'state.json');
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create an object.
 *     let data = { x: mouseX, y: mouseY };
 *
 *     // Save the JSON file and reduce its size.
 *     saveJSON(data, 'state.json', true);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.saveJSON = function(json, filename, opt) {
  p5._validateParameters('saveJSON', arguments);
  let stringify;
  if (opt) {
    stringify = JSON.stringify(json);
  } else {
    stringify = JSON.stringify(json, undefined, 2);
  }
  this.saveStrings(stringify.split('\n'), filename, 'json');
};

p5.prototype.saveJSONObject = p5.prototype.saveJSON;
p5.prototype.saveJSONArray = p5.prototype.saveJSON;

/**
 * Saves an `Array` of `String`s to a file, one per line.
 *
 * The first parameter, `list`, is an array with the strings to save.
 *
 * The second parameter, `filename`, is a string that sets the file's name.
 * For example, calling `saveStrings(['0', '01', '011'], 'data.txt')` saves
 * the array `['0', '01', '011']` to a file called `data.txt` on the user's
 * computer.
 *
 * The third parameter, `extension`, is optional. If a string is passed, as in
 * `saveStrings(['0', '01', '0`1'], 'data', 'txt')`, the second parameter will
 * be interpreted as the file name and the third parameter as the extension.
 *
 * The fourth parameter, `isCRLF`, is also optional, If `true` is passed, as
 * in `saveStrings(['0', '01', '011'], 'data', 'txt', true)`, then two
 * characters, `\r\n` , will be added to the end of each string to create new
 * lines in the saved file. `\r` is a carriage return (CR) and `\n` is a line
 * feed (LF). By default, only `\n` (line feed) is added to each string in
 * order to create new lines.
 *
 * Note: The browser will either save the file immediately or prompt the user
 * with a dialogue window.
 *
 *  @method saveStrings
 *  @param  {String[]} list data to save.
 *  @param  {String} filename name of file to be saved.
 *  @param  {String} [extension] format to use for the file.
 *  @param  {Boolean} [isCRLF] whether to add `\r\n` to the end of each
 *                             string. Defaults to `false`.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create an array.
 *     let data = ['0', '01', '011'];
 *
 *     // Save the text file.
 *     saveStrings(data, 'data.txt');
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create an array.
 *     // ASCII art courtesy Wikipedia:
 *     // https://en.wikipedia.org/wiki/ASCII_art
 *     let data = [' (\\_/) ', "(='.'=)", '(")_(")'];
 *
 *     // Save the text file.
 *     saveStrings(data, 'cat', 'txt');
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(LEFT, CENTER);
 *   textFont('Courier New');
 *   textSize(12);
 *
 *   // Display instructions.
 *   text('Double-click to save', 5, 50, 90);
 *
 *   describe('The text "Double-click to save" written in black on a gray background.');
 * }
 *
 * // Save the file when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     // Create an array.
 *     //   +--+
 *     //  /  /|
 *     // +--+ +
 *     // |  |/
 *     // +--+
 *     let data = ['  +--+', ' /  /|', '+--+ +', '|  |/', '+--+'];
 *
 *     // Save the text file.
 *     // Use CRLF for line endings.
 *     saveStrings(data, 'box', 'txt', true);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.saveStrings = function(list, filename, extension, isCRLF) {
  p5._validateParameters('saveStrings', arguments);
  const ext = extension || 'txt';
  const pWriter = this.createWriter(filename, ext);
  for (let i = 0; i < list.length; i++) {
    isCRLF ? pWriter.write(list[i] + '\r\n') : pWriter.write(list[i] + '\n');
  }
  pWriter.close();
  pWriter.clear();
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
 *  Writes the contents of a <a href="#/p5.Table">Table</a> object to a file. Defaults to a
 *  text file with comma-separated-values ('csv') but can also
 *  use tab separation ('tsv'), or generate an HTML table ('html').
 *  The file saving process and location of the saved file will
 *  vary between web browsers.
 *
 *  @method saveTable
 *  @param  {p5.Table} Table  the <a href="#/p5.Table">Table</a> object to save to a file
 *  @param  {String} filename the filename to which the Table should be saved
 *  @param  {String} [options]  can be one of "tsv", "csv", or "html"
 *  @example
 *  <div><code>
 * let table;
 *
 * function setup() {
 *   table = new p5.Table();
 *
 *   table.addColumn('id');
 *   table.addColumn('species');
 *   table.addColumn('name');
 *
 *   let newRow = table.addRow();
 *   newRow.setNum('id', table.getRowCount() - 1);
 *   newRow.setString('species', 'Panthera leo');
 *   newRow.setString('name', 'Lion');
 *
 *   // To save, un-comment next line then click 'run'
 *   // saveTable(table, 'new.csv');
 *
 *   describe('no image displayed');
 * }
 *
 * // Saves the following to a file called 'new.csv':
 * // id,species,name
 * // 0,Panthera leo,Lion
 * </code></div>
 */
p5.prototype.saveTable = function(table, filename, options) {
  p5._validateParameters('saveTable', arguments);
  let ext;
  if (options === undefined) {
    ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
  } else {
    ext = options;
  }
  const pWriter = this.createWriter(filename, ext);

  const header = table.columns;

  let sep = ','; // default to CSV
  if (ext === 'tsv') {
    sep = '\t';
  }
  if (ext !== 'html') {
    // make header if it has values
    if (header[0] !== '0') {
      for (let h = 0; h < header.length; h++) {
        if (h < header.length - 1) {
          pWriter.write(header[h] + sep);
        } else {
          pWriter.write(header[h]);
        }
      }
      pWriter.write('\n');
    }

    // make rows
    for (let i = 0; i < table.rows.length; i++) {
      let j;
      for (j = 0; j < table.rows[i].arr.length; j++) {
        if (j < table.rows[i].arr.length - 1) {
          //double quotes should be inserted in csv only if contains comma separated single value
          if (ext === 'csv' && String(table.rows[i].arr[j]).includes(',')) {
            pWriter.write('"' + table.rows[i].arr[j] + '"' + sep);
          } else {
            pWriter.write(table.rows[i].arr[j] + sep);
          }
        } else {
          //double quotes should be inserted in csv only if contains comma separated single value
          if (ext === 'csv' && String(table.rows[i].arr[j]).includes(',')) {
            pWriter.write('"' + table.rows[i].arr[j] + '"');
          } else {
            pWriter.write(table.rows[i].arr[j]);
          }
        }
      }
      pWriter.write('\n');
    }
  } else {
    // otherwise, make HTML
    pWriter.print('<html>');
    pWriter.print('<head>');
    let str = '  <meta http-equiv="content-type" content';
    str += '="text/html;charset=utf-8" />';
    pWriter.print(str);
    pWriter.print('</head>');

    pWriter.print('<body>');
    pWriter.print('  <table>');

    // make header if it has values
    if (header[0] !== '0') {
      pWriter.print('    <tr>');
      for (let k = 0; k < header.length; k++) {
        const e = escapeHelper(header[k]);
        pWriter.print(`      <td>${e}`);
        pWriter.print('      </td>');
      }
      pWriter.print('    </tr>');
    }

    // make rows
    for (let row = 0; row < table.rows.length; row++) {
      pWriter.print('    <tr>');
      for (let col = 0; col < table.columns.length; col++) {
        const entry = table.rows[row].getString(col);
        const htmlEntry = escapeHelper(entry);
        pWriter.print(`      <td>${htmlEntry}`);
        pWriter.print('      </td>');
      }
      pWriter.print('    </tr>');
    }
    pWriter.print('  </table>');
    pWriter.print('</body>');
    pWriter.print('</html>');
  }
  // close and clear the pWriter
  pWriter.close();
  pWriter.clear();
}; // end saveTable()

/**
 *  Generate a blob of file data as a url to prepare for download.
 *  Accepts an array of data, a filename, and an extension (optional).
 *  This is a private function because it does not do any formatting,
 *  but it is used by <a href="#/p5/saveStrings">saveStrings</a>, <a href="#/p5/saveJSON">saveJSON</a>, <a href="#/p5/saveTable">saveTable</a> etc.
 *
 *  @param  {Array} dataToDownload
 *  @param  {String} filename
 *  @param  {String} [extension]
 *  @private
 */
p5.prototype.writeFile = function(dataToDownload, filename, extension) {
  let type = 'application/octet-stream';
  if (p5.prototype._isSafari()) {
    type = 'text/plain';
  }
  const blob = new Blob(dataToDownload, {
    type
  });
  p5.prototype.downloadFile(blob, filename, extension);
};

/**
 *  Forces download. Accepts a url to filedata/blob, a filename,
 *  and an extension (optional).
 *  This is a private function because it does not do any formatting,
 *  but it is used by <a href="#/p5/saveStrings">saveStrings</a>, <a href="#/p5/saveJSON">saveJSON</a>, <a href="#/p5/saveTable">saveTable</a> etc.
 *
 *  @method downloadFile
 *  @private
 *  @param  {String|Blob} data    either an href generated by createObjectURL,
 *                                or a Blob object containing the data
 *  @param  {String} [filename]
 *  @param  {String} [extension]
 */
p5.prototype.downloadFile = function(data, fName, extension) {
  const fx = _checkFileExtension(fName, extension);
  const filename = fx[0];

  if (data instanceof Blob) {
    fileSaver.saveAs(data, filename);
    return;
  }

  const a = document.createElement('a');
  a.href = data;
  a.download = filename;

  // Firefox requires the link to be added to the DOM before click()
  a.onclick = e => {
    destroyClickedElement(e);
    e.stopPropagation();
  };

  a.style.display = 'none';
  document.body.appendChild(a);

  // Safari will open this file in the same page as a confusing Blob.
  if (p5.prototype._isSafari()) {
    let aText = 'Hello, Safari user! To download this file...\n';
    aText += '1. Go to File --> Save As.\n';
    aText += '2. Choose "Page Source" as the Format.\n';
    aText += `3. Name it with this extension: ."${fx[1]}"`;
    alert(aText);
  }
  a.click();
};

/**
 *  Returns a file extension, or another string
 *  if the provided parameter has no extension.
 *
 *  @param   {String} filename
 *  @param   {String} [extension]
 *  @return  {String[]} [fileName, fileExtension]
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
  let ext = '';
  // make sure the file will have a name, see if filename needs extension
  if (filename && filename.includes('.')) {
    ext = filename.split('.').pop();
  }
  // append extension if it doesn't exist
  if (extension) {
    if (ext !== extension) {
      ext = extension;
      filename = `${filename}.${ext}`;
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
  return window.HTMLElement.toString().includes('Constructor');
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

export default p5;
