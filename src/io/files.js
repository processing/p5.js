/**
 * @module IO
 * @submodule Input
 * @for p5
 * @requires core
 */

import { Renderer } from '../core/p5.Renderer';
import { Graphics } from '../core/p5.Graphics';
import { parse } from './csv';
import { downloadFile, _checkFileExtension } from './utilities';

class HTTPError extends Error {
  status;
  response;
  ok;
}

export async function request(path, type){
  try {
    const res = await fetch(path);

    if (res.ok) {
      let data;
      switch(type) {
        case 'json':
          data = await res.json();
          break;
        case 'text':
          data = await res.text();
          break;
        case 'arrayBuffer':
          data = await res.arrayBuffer();
          break;
        case 'blob':
          data = await res.blob();
          break;
        case 'bytes':
          // TODO: Chrome does not implement res.bytes() yet
          if(res.bytes){
            data = await res.bytes();
          }else{
            const d = await res.arrayBuffer();
            data = new Uint8Array(d);
          }
          break;
        default:
          throw new Error('Unsupported response type');
      }

      return { data, headers: res.headers };

    } else {
      const err = new HTTPError(res.statusText);
      err.status = res.status;
      err.response = res;
      err.ok = false;

      throw err;
    }

  } catch(err) {
    // Handle both fetch error and HTTP error
    if (err instanceof TypeError) {
      console.log('You may have encountered a CORS error');
    } else if (err instanceof HTTPError) {
      console.log('You have encountered a HTTP error');
    } else if (err instanceof SyntaxError) {
      console.log('There is an error parsing the response to requested data structure');
    }

    throw err;
  }
}

function files(p5, fn){
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
   * The first parameter, `path`, is a string with the path to the file.
   * Paths to local files should be relative, as in
   * `loadJSON('assets/data.json')`. URLs such as
   * `'https://example.com/data.json'` may be blocked due to browser security.
   * The `path` parameter can also be defined as a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
   * object for more advanced usage.
   *
   * The second parameter, `successCallback`, is optional. If a function is
   * passed, as in `loadJSON('assets/data.json', handleData)`, then the
   * `handleData()` function will be called once the data loads. The object
   * created from the JSON data will be passed to `handleData()` as its only argument.
   * The return value of the `handleData()` function will be used as the final return
   * value of `loadJSON('assets/data.json', handleData)`.
   *
   * The third parameter, `failureCallback`, is also optional. If a function is
   * passed, as in `loadJSON('assets/data.json', handleData, handleFailure)`,
   * then the `handleFailure()` function will be called if an error occurs while
   * loading. The `Error` object will be passed to `handleFailure()` as its only
   * argument. The return value of the `handleFailure()` function will be used as the
   * final return value of `loadJSON('assets/data.json', handleData, handleFailure)`.
   *
   * This function returns a `Promise` and should be used in an `async` setup with
   * `await`. See the examples for the usage syntax.
   *
   * @method loadJSON
   * @param  {String|Request} path path of the JSON file to be loaded.
   * @param  {Function} [successCallback] function to call once the data is loaded. Will be passed the object.
   * @param  {Function} [errorCallback] function to call if the data fails to load. Will be passed an `Error` event object.
   * @return {Promise<Object>} object containing the loaded data.
   *
   * @example
   *
   * <div>
   * <code>
   * let myData;
   *
   * async function setup() {
   *   myData = await loadJSON('assets/data.json');
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
   * async function setup() {
   *   myData = await loadJSON('assets/data.json');
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
   * async function setup() {
   *   myData = await loadJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
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
   * async function setup() {
   *   await loadJSON(
   *     'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
   *     handleData
   *   );
   *
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
   * async function setup() {
   *   await loadJSON(
   *     'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
   *     handleData,
   *     handleError
   *   );
   *
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
  fn.loadJSON = async function (path, successCallback, errorCallback) {
    // p5._validateParameters('loadJSON', arguments);

    try{
      const { data } = await request(path, 'json');
      if (successCallback) return successCallback(data);
      return data;
    } catch(err) {
      p5._friendlyFileLoadError(5, path);
      if(errorCallback) {
        return errorCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * Loads a text file to create an `Array`.
   *
   * The first parameter, `path`, is always a string with the path to the file.
   * Paths to local files should be relative, as in
   * `loadStrings('assets/data.txt')`. URLs such as
   * `'https://example.com/data.txt'` may be blocked due to browser security.
   * The `path` parameter can also be defined as a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
   * object for more advanced usage.
   *
   * The second parameter, `successCallback`, is optional. If a function is
   * passed, as in `loadStrings('assets/data.txt', handleData)`, then the
   * `handleData()` function will be called once the data loads. The array
   * created from the text data will be passed to `handleData()` as its only
   * argument. The return value of the `handleData()` function will be used as
   * the final return value of `loadStrings('assets/data.txt', handleData)`.
   *
   * The third parameter, `failureCallback`, is also optional. If a function is
   * passed, as in `loadStrings('assets/data.txt', handleData, handleFailure)`,
   * then the `handleFailure()` function will be called if an error occurs while
   * loading. The `Error` object will be passed to `handleFailure()` as its only
   * argument. The return value of the `handleFailure()` function will be used as
   * the final return value of `loadStrings('assets/data.txt', handleData, handleFailure)`.
   *
   * This function returns a `Promise` and should be used in an `async` setup with
   * `await`. See the examples for the usage syntax.
   *
   * @method loadStrings
   * @param  {String|Request} path path of the text file to be loaded.
   * @param  {Function} [successCallback] function to call once the data is
   *                                      loaded. Will be passed the array.
   * @param  {Function} [errorCallback] function to call if the data fails to
   *                                    load. Will be passed an `Error` event
   *                                    object.
   * @return {Promise<String[]>} new array containing the loaded text.
   *
   * @example
   *
   * <div>
   * <code>
   * let myData;
   *
   * async function setup() {
   *   myData = await loadStrings('assets/test.txt');
   *
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
   * async function setup() {
   *   await loadStrings('assets/test.txt', handleData);
   *
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
   * async function setup() {
   *   await loadStrings('assets/test.txt', handleData, handleError);
   *
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
  fn.loadStrings = async function (path, successCallback, errorCallback) {
    // p5._validateParameters('loadStrings', arguments);

    try{
      let { data } = await request(path, 'text');
      data = data.split(/\r?\n/);

      if (successCallback) return successCallback(data);
      return data;
    } catch(err) {
      p5._friendlyFileLoadError(3, path);
      if(errorCallback) {
        return errorCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * Reads the contents of a file or URL and creates a <a href="#/p5.Table">p5.Table</a> object with
   * its values. If a file is specified, it must be located in the sketch's
   * "data" folder. The filename parameter can also be a URL to a file found
   * online. By default, the file is assumed to be comma-separated (in CSV
   * format). Table only looks for a header row if the 'header' option is
   * included.
   *
   * This function returns a `Promise` and should be used in an `async` setup with
   * `await`. See the examples for the usage syntax.
   *
   * All files loaded and saved use UTF-8 encoding. This method is suitable for fetching files up to size of 64MB.
   *
   * @method loadTable
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
   * @param  {String|Request} filename    name of the file or URL to load
   * @param  {String}         [separator] the separator character used by the file, defaults to `','`
   * @param  {String}         [header]    "header" to indicate table has header row
   * @param  {Function}       [callback]  function to be executed after
   *                                      <a href="#/p5/loadTable">loadTable()</a> completes. On success, the
   *                                      <a href="#/p5.Table">Table</a> object is passed in as the
   *                                      first argument.
   * @param  {Function}  [errorCallback]  function to be executed if
   *                                      there is an error, response is passed
   *                                      in as first argument
   * @return {Promise<Object>}            <a href="#/p5.Table">Table</a> object containing data
   *
   * @example
   * <div class='norender'>
   * <code>
   * let table;
   *
   * async function setup() {
   *   // Create a 200x200 canvas
   *   createCanvas(200, 200);
   *
   *   // Load the CSV file with a header row
   *   table = await loadTable('assets/mammals.csv', ',', 'header');
   *
   *   // Get the second row (index 1)
   *   let row = table.getRow(1);
   *
   *   // Set text properties
   *   fill(0);       // Set text color to black
   *   textSize(16);  // Adjust text size as needed
   *
   *   // Display each column value in the row on the canvas.
   *   // Using an offset for y-position so each value appears on a new line.
   *   for (let c = 0; c < table.getColumnCount(); c++) {
   *     text(row.getString(c), 10, 30 + c * 20);
   *   }
   * }
   * </code>
   * </div>
   */
  fn.loadTable = async function (path, separator, header, successCallback, errorCallback) {
    if(typeof arguments[arguments.length-1] === 'function'){
      if(typeof arguments[arguments.length-2] === 'function'){
        successCallback = arguments[arguments.length-2];
        errorCallback = arguments[arguments.length-1];
      }else{
        successCallback = arguments[arguments.length-1];
      }
    }

    if(typeof separator !== 'string') separator = ',';
    if(typeof header === 'function') header = false;

    try{
      let { data } = await request(path, 'text');

      let ret = new p5.Table();
      data = parse(data, {
        separator
      });

      if(header){
        ret.columns = data.shift();
      }else{
        ret.columns = Array(data[0].length).fill(null);
      }

      data.forEach((line) => {
        const row = new p5.TableRow(line);
        ret.addRow(row);
      });

      if (successCallback) {
        return successCallback(ret);
      } else {
        return ret;
      }
    } catch(err) {
      p5._friendlyFileLoadError(2, path);
      if(errorCallback) {
        return errorCallback(err);
      } else {
        throw err;
      }
    }
  };

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
   * may be blocked due to browser security. The `path` parameter can also be defined
   * as a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
   * object for more advanced usage.
   *
   * The second parameter, `successCallback`, is optional. If a function is
   * passed, as in `loadXML('assets/data.xml', handleData)`, then the
   * `handleData()` function will be called once the data loads. The
   * <a href="#/p5.XML">p5.XML</a> object created from the data will be passed
   * to `handleData()` as its only argument. The return value of the `handleData()`
   * function will be used as the final return value of `loadXML('assets/data.xml', handleData)`.
   *
   * The third parameter, `failureCallback`, is also optional. If a function is
   * passed, as in `loadXML('assets/data.xml', handleData, handleFailure)`, then
   * the `handleFailure()` function will be called if an error occurs while
   * loading. The `Error` object will be passed to `handleFailure()` as its only
   * argument. The return value of the `handleFailure()` function will be used as the
   * final return value of `loadXML('assets/data.xml', handleData, handleFailure)`.
   *
   * This function returns a `Promise` and should be used in an `async` setup with
   * `await`. See the examples for the usage syntax.
   *
   * @method loadXML
   * @param  {String|Request} path        path of the XML file to be loaded.
   * @param  {Function} [successCallback] function to call once the data is
   *                                      loaded. Will be passed the
   *                                      <a href="#/p5.XML">p5.XML</a> object.
   * @param  {Function} [errorCallback] function to call if the data fails to
   *                                    load. Will be passed an `Error` event
   *                                    object.
   * @return {Promise<p5.XML>} XML data loaded into a <a href="#/p5.XML">p5.XML</a>
   *                  object.
   *
   * @example
   * <div>
   * <code>
   * let myXML;
   *
   * // Load the XML and create a p5.XML object.
   * async function setup() {
   *   myXML = await loadXML('assets/animals.xml');
   *
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
   * async function setup() {
   *   await loadXML('assets/animals.xml', handleData);
   *
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
   * async function setup() {
   *   await loadXML('assets/animals.xml', handleData, handleError);
   *
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
  fn.loadXML = async function (path, successCallback, errorCallback) {
    try{
      const parser = new DOMParser();

      let { data } = await request(path, 'text');
      const parsedDOM = parser.parseFromString(data, 'application/xml');
      data = new p5.XML(parsedDOM);

      if (successCallback) return successCallback(data);
      return data;
    } catch(err) {
      p5._friendlyFileLoadError(1, path);
      if(errorCallback) {
        return errorCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * This method is suitable for fetching files up to size of 64MB.
   *
   * @method loadBytes
   * @param {String|Request}   file            name of the file or URL to load
   * @param {Function} [callback]      function to be executed after <a href="#/p5/loadBytes">loadBytes()</a>
   *                                    completes
   * @param {Function} [errorCallback] function to be executed if there
   *                                    is an error
   * @returns {Promise<Uint8Array>} a Uint8Array containing the loaded buffer
   *
   * @example
   *
   * <div>
   * <code>
   * let data;
   *
   * async function setup() {
   * createCanvas(100, 100); // Create a canvas
   * data = await loadBytes('assets/mammals.xml'); // Load the bytes from the XML file
   *
   * background(255); // Set a white background
   * fill(0);       // Set text color to black
   *
   * // Display the first 5 byte values on the canvas in hexadecimal format
   * for (let i = 0; i < 5; i++) {
   * let byteHex = data[i].toString(16);
   * text(byteHex, 10, 18 * (i + 1)); // Adjust spacing as needed
   * }
   *
   * describe('no image displayed, displays first 5 bytes of mammals.xml in hexadecimal format');
   * }
   * </code>
   * </div>
   */

  fn.loadBytes = async function (path, successCallback, errorCallback) {
    try{
      let { data } = await request(path, 'arrayBuffer');
      data = new Uint8Array(data);
      if (successCallback) return successCallback(data);
      return data;
    } catch(err) {
      p5._friendlyFileLoadError(6, path);
      if(errorCallback) {
        return errorCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * Loads a file at the given path as a Blob, then returns the resulting data or
   * passes it to a success callback function, if provided. On load, this function
   * returns a `Promise` that resolves to a Blob containing the file data.
   *
   * @method loadBlob
   * @param {String|Request} path - The path or Request object pointing to the file
   *                                you want to load.
   * @param {Function} [successCallback] - Optional. A function to be called if the
   *                                       file successfully loads, receiving the
   *                                       resulting Blob as its only argument.
   * @param {Function} [errorCallback] - Optional. A function to be called if an
   *                                     error occurs during loading; receives the
   *                                     error object as its only argument.
   * @returns {Promise<Blob>} A promise that resolves with the loaded Blob.
   *
   * @example
   * <div>
   * <code>
   * let myBlob;
   *
   * async function setup() {
   *   createCanvas(200, 200);
   *   background(220);
   *   try {
   *     // 1. Load an image file as a Blob.
   *     myBlob = await loadBlob('assets/flower-1.png');
   *
   *     // 2. Convert the Blob into an object URL.
   *     const objectUrl = URL.createObjectURL(myBlob);
   *
   *     // 3. Load that object URL into a p5.Image.
   *     loadImage(objectUrl, (img) => {
   *       // 4. Display the loaded image.
   *       image(img, 0, 0, width, height);
   *     });
   *   } catch (err) {
   *     console.error('Error loading blob:', err);
   *   }
   * }
   * </code>
   * </div>
   */
  fn.loadBlob = async function(path, successCallback, errorCallback) {
    try{
      const { data } = await request(path, 'blob');
      if (successCallback) return successCallback(data);
      return data;
    } catch(err) {
      if(errorCallback) {
        return errorCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * Method for executing an HTTP GET request. If data type is not specified,
   * it will default to `'text'`. This is equivalent to
   * calling <code>httpDo(path, 'GET')</code>. The 'binary' datatype will return
   * a Blob object, and the 'arrayBuffer' datatype will return an ArrayBuffer
   * which can be used to initialize typed arrays (such as Uint8Array).
   *
   * @method httpGet
   * @param  {String|Request}        path       name of the file or url to load
   * @param  {String}        [datatype] "json", "jsonp", "binary", "arrayBuffer",
   *                                    "xml", or "text"
   * @param  {Function}      [callback] function to be executed after
   *                                    <a href="#/p5/httpGet">httpGet()</a> completes, data is passed in
   *                                    as first argument
   * @param  {Function}      [errorCallback] function to be executed if
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
   * async function setup() {
   *   // Get the most recent earthquake in the database
   *   let url =
      'https://earthquake.usgs.gov/fdsnws/event/1/query?' +
   *     'format=geojson&limit=1&orderby=time';
   *   earthquakes = await httpGet(url, 'json');
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
   * @param  {String|Request}  path
   * @param  {Function}        callback
   * @param  {Function}        [errorCallback]
   * @return {Promise}
   */
  fn.httpGet = async function (path, datatype='text', successCallback, errorCallback) {
    // p5._validateParameters('httpGet', arguments);

    if (typeof datatype === 'function') {
      errorCallback = successCallback;
      successCallback = datatype;
      datatype = 'text';
    }

    // This is like a more primitive version of the other load functions.
    // If the user wanted to customize more behavior, pass in Request to path.

    return this.httpDo(path, 'GET', datatype, successCallback, errorCallback);
  };

  /**
   * Method for executing an HTTP POST request. If data type is not specified,
   * it will default to `'text'`. This is equivalent to
   * calling <code>httpDo(path, 'POST')</code>.
   *
   * @method httpPost
   * @param  {String|Request} path       name of the file or url to load
   * @param  {Object|Boolean} [data]     param data passed sent with request
   * @param  {String}         [datatype] "json", "jsonp", "xml", or "text".
   *                                    If omitted, <a href="#/p5/httpPost">httpPost()</a> will guess.
   * @param  {Function}       [callback] function to be executed after
   *                                     <a href="#/p5/httpPost">httpPost()</a> completes, data is passed in
   *                                     as first argument
   * @param  {Function}       [errorCallback] function to be executed if
   *                                          there is an error, response is passed
   *                                          in as first argument
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
   * @param  {String|Request}    path
   * @param  {Object|Boolean}    data
   * @param  {Function}         [callback]
   * @param  {Function}         [errorCallback]
   * @return {Promise}
   */
  /**
   * @method httpPost
   * @param  {String|Request}    path
   * @param  {Function}         [callback]
   * @param  {Function}         [errorCallback]
   * @return {Promise}
   */
  fn.httpPost = async function (path, data, datatype='text', successCallback, errorCallback) {
    // p5._validateParameters('httpPost', arguments);

    // This behave similarly to httpGet and additional options should be passed
    // as a `Request`` to path. Both method and body will be overridden.
    // Will try to infer correct Content-Type for given data.

    if (typeof data === 'function') {
      // Assume both data and datatype are functions as data should not be function
      successCallback = data;
      errorCallback = datatype;
      data = undefined;
      datatype = 'text';

    } else if (typeof datatype === 'function') {
      // Data is provided but not datatype\
      errorCallback = successCallback;
      successCallback = datatype;
      datatype = 'text';
    }

    let reqData = data;
    let contentType = 'text/plain';
    // Normalize data
    if(data instanceof p5.XML) {
      reqData = data.serialize();
      contentType = 'application/xml';

    } else if(data instanceof p5.Image) {
      reqData = await data.toBlob();
      contentType = 'image/png';

    } else if (typeof data === 'object') {
      reqData = JSON.stringify(data);
      contentType = 'application/json';
    }

    const requestOptions = {
      method: 'POST',
      body: reqData,
      headers: {
        'Content-Type': contentType
      }
    };

    if (reqData) {
      requestOptions.body = reqData;
    }

    const req = new Request(path, requestOptions);

    return this.httpDo(req, 'POST', datatype, successCallback, errorCallback);
  };

  /**
   * Method for executing an HTTP request. If data type is not specified,
   * it will default to `'text'`.
   *
   * This function is meant for more advanced usage of HTTP requests in p5.js. It is
   * best used when a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
   * object is passed to the `path` parameter.
   *
   * This method is suitable for fetching files up to size of 64MB when "GET" is used.
   *
   * @method httpDo
   * @param  {String|Request}   path      name of the file or url to load
   * @param  {String}           [method]    either "GET", "POST", "PUT", "DELETE",
   *                                      or other HTTP request methods
   * @param  {String}          [datatype] "json", "jsonp", "xml", or "text"
   * @param  {Object}          [data]     param data passed sent with request
   * @param  {Function}        [callback] function to be executed after
   *                                      <a href="#/p5/httpGet">httpGet()</a> completes, data is passed in
   *                                      as first argument
   * @param  {Function}        [errorCallback] function to be executed if
   *                                      there is an error, response is passed
   *                                      in as first argument
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
   * function setup() {
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
   * @param  {String|Request}    path
   * @param  {Function}         [callback]
   * @param  {Function}         [errorCallback]
   * @return {Promise}
   */
  fn.httpDo = async function (path, method, datatype, successCallback, errorCallback) {
    // This behave similarly to httpGet but even more primitive. The user
    // will most likely want to pass in a Request to path, the only convenience
    // is that datatype will be taken into account to parse the response.

    if(typeof datatype === 'function'){
      errorCallback = successCallback;
      successCallback = datatype;
      datatype = undefined;
    }

    // Try to infer data type if it is defined
    if(!datatype){
      const extension = typeof path === 'string' ?
        path.split(".").pop() :
        path.url.split(".").pop();
      switch(extension) {
        case 'json':
          datatype = 'json';
          break;

        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'gif':
          datatype = 'blob';
          break;

        case 'xml':
          // NOTE: still need to normalize type handling/mapping
          // datatype = 'xml';
        case 'txt':
        default:
          datatype = 'text';
      }
    }

    const req = new Request(path, {
      method
    });

    try{
      const { data } = await request(req, datatype);
      if (successCallback) {
        return successCallback(data);
      } else {
        return data;
      }
    } catch(err) {
      if(errorCallback) {
        return errorCallback(err);
      } else {
        throw err;
      }
    }
  };

  /**
   * @module IO
   * @submodule Output
   * @for p5
   */
  // private array of p5.PrintWriter objects
  fn._pWriters = [];

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
  fn.createWriter = function (name, extension) {
    let newPW;
    // check that it doesn't already exist
    for (const i in fn._pWriters) {
      if (fn._pWriters[i].name === name) {
        // if a p5.PrintWriter w/ this name already exists...
        // return fn._pWriters[i]; // return it w/ contents intact.
        // or, could return a new, empty one with a unique name:
        newPW = new p5.PrintWriter(name + this.millis(), extension);
        fn._pWriters.push(newPW);
        return newPW;
      }
    }
    newPW = new p5.PrintWriter(name, extension);
    fn._pWriters.push(newPW);
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
  p5.PrintWriter = function (filename, extension) {
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
    this.write = function (data) {
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
    this.print = function (data) {
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
    this.clear = function () {
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
    this.close = function () {
      // convert String to Array for the writeFile Blob
      const arr = [];
      arr.push(this.content);
      fn.writeFile(arr, filename, extension);
      // remove from _pWriters array and delete self
      for (const i in fn._pWriters) {
        if (fn._pWriters[i].name === this.name) {
          // remove from _pWriters array
          fn._pWriters.splice(i, 1);
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
  fn.save = function (object, _filename, _options) {
    // TODO: parameters is not used correctly
    // parse the arguments and figure out which things we are saving
    const args = arguments;
    // =================================================
    // OPTION 1: saveCanvas...

    // if no arguments are provided, save canvas
    const cnv = this._curElement ? this._curElement.elt : this.elt;
    if (args.length === 0) {
      fn.saveCanvas(cnv);
      return;

    } else if (args[0] instanceof Renderer || args[0] instanceof Graphics) {
      // otherwise, parse the arguments
      // if first param is a p5Graphics, then saveCanvas
      fn.saveCanvas(args[0].canvas, args[1], args[2]);
      return;

    } else if (args.length === 1 && typeof args[0] === 'string') {
      // if 1st param is String and only one arg, assume it is canvas filename
      fn.saveCanvas(cnv, args[0]);

    } else {
      // =================================================
      // OPTION 2: extension clarifies saveStrings vs. saveJSON
      const extension = _checkFileExtension(args[1], args[2])[1];
      switch (extension) {
        case 'json':
          fn.saveJSON(args[0], args[1], args[2]);
          return;
        case 'txt':
          fn.saveStrings(args[0], args[1], args[2]);
          return;
        // =================================================
        // OPTION 3: decide based on object...
        default:
          if (args[0] instanceof Array) {
            fn.saveStrings(args[0], args[1], args[2]);
          } else if (args[0] instanceof p5.Table) {
            fn.saveTable(args[0], args[1], args[2]);
          } else if (args[0] instanceof p5.Image) {
            fn.saveCanvas(args[0].canvas, args[1]);
          } else if (args[0] instanceof p5.SoundFile) {
            fn.saveSound(args[0], args[1], args[2], args[3]);
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
  fn.saveJSON = function (json, filename, optimize) {
    // p5._validateParameters('saveJSON', arguments);
    let stringify;
    if (optimize) {
      stringify = JSON.stringify(json);
    } else {
      stringify = JSON.stringify(json, undefined, 2);
    }
    this.saveStrings(stringify.split('\n'), filename, 'json');
  };

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
  fn.saveStrings = function (list, filename, extension, isCRLF) {
    // p5._validateParameters('saveStrings', arguments);
    const ext = extension || 'txt';
    const pWriter = new p5.PrintWriter(filename, ext);
    for (let item of list) {
      isCRLF ? pWriter.write(item + '\r\n') : pWriter.write(item + '\n');
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
   * @deprecated p5.Table will be removed in a future version of p5.js to make way for a new, friendlier version :)
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
  fn.saveTable = function (table, filename, options) {
    // p5._validateParameters('saveTable', arguments);
    let ext;
    if (options === undefined) {
      ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
      if(ext === filename) ext = 'csv';
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
      const output = table.toString(sep);
      pWriter.write(output);
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
  fn.writeFile = function (dataToDownload, filename, extension) {
    let type = 'application/octet-stream';
    if (fn._isSafari()) {
      type = 'text/plain';
    }
    const blob = new Blob(dataToDownload, {
      type
    });
    fn.downloadFile(blob, filename, extension);
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
  fn.downloadFile = downloadFile;

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
  fn._checkFileExtension = _checkFileExtension;

  /**
   *  Returns true if the browser is Safari, false if not.
   *  Safari makes trouble for downloading files.
   *
   *  @return  {Boolean} [description]
   *  @private
   */
  fn._isSafari = function () {
    // The following line is CC BY SA 3 by user Fregante https://stackoverflow.com/a/23522755
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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
}

export default files;

if(typeof p5 !== 'undefined'){
  files(p5, p5.prototype);
}
