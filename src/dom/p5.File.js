/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
 */

import { XML } from '../io/p5.XML';

class File {
  constructor(file, pInst) {
    this.file = file;

    this._pInst = pInst;

    // Splitting out the file type into two components
    // This makes determining if image or text etc simpler
    const typeList = file.type.split('/');
    this.type = typeList[0];
    this.subtype = typeList[1];
    this.name = file.name;
    this.size = file.size;
    this.data = undefined;
  }


  static _createLoader(theFile, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const p5file = new File(theFile);
      if (p5file.file.type === 'application/json') {
        // Parse JSON and store the result in data
        p5file.data = JSON.parse(e.target.result);
      } else if (p5file.file.type === 'text/xml') {
        // Parse XML, wrap it in p5.XML and store the result in data
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, 'text/xml');
        p5file.data = new XML(xml.documentElement);
      } else {
        p5file.data = e.target.result;
      }
      callback(p5file);
    };
    return reader;
  }

  static _load(f, callback) {
    // Text or data?
    // This should likely be improved
    if (/^text\//.test(f.type) || f.type === 'application/json') {
      File._createLoader(f, callback).readAsText(f);
    } else if (!/^(video|audio)\//.test(f.type)) {
      File._createLoader(f, callback).readAsDataURL(f);
    } else {
      const file = new File(f);
      file.data = URL.createObjectURL(f);
      callback(file);
    }
  }
}

function file(p5, fn){
  /**
   * A class to describe a file.
   *
   * `p5.File` objects are used by
   * <a href="#/p5.Element/drop">myElement.drop()</a> and
   * created by
   * <a href="#/p5/createFileInput">createFileInput</a>.
   *
   * @class p5.File
   * @param {File} file wrapped file.
   *
   * @example
   * <div>
   * <code>
   * // Use the file input to load a
   * // file and display its info.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call displayInfo() when the file loads.
   *   let input = createFileInput(displayInfo);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user loads a file, its info is written in black.');
   * }
   *
   * // Display the p5.File's info once it loads.
   * function displayInfo(file) {
   *   background(200);
   *
   *   // Display the p5.File's name.
   *   text(file.name, 10, 10, 80, 40);
   *
   *   // Display the p5.File's type and subtype.
   *   text(`${file.type}/${file.subtype}`, 10, 70);
   *
   *   // Display the p5.File's size in bytes.
   *   text(file.size, 10, 90);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Use the file input to select an image to
   * // load and display.
   * let img;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call handleImage() when the file image loads.
   *   let input = createFileInput(handleImage);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user selects an image file to load, it is displayed on the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the image if it's ready.
   *   if (img) {
   *     image(img, 0, 0, width, height);
   *   }
   * }
   *
   * // Use the p5.File's data once it loads.
   * function handleImage(file) {
   *   // Check the p5.File's type.
   *   if (file.type === 'image') {
   *     // Create an image using using the p5.File's data.
   *     img = createImg(file.data, '');
   *
   *     // Hide the image element so it doesn't appear twice.
   *     img.hide();
   *   } else {
   *     img = null;
   *   }
   * }
   * </code>
   * </div>
   */
  p5.File = File;

  /**
   * Underlying
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/File" target="_blank">File</a>
   * object. All `File` properties and methods are accessible.
   *
   * @for p5.File
   * @property file
   * @example
   * <div>
   * <code>
   * // Use the file input to load a
   * // file and display its info.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call displayInfo() when the file loads.
   *   let input = createFileInput(displayInfo);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user loads a file, its info is written in black.');
   * }
   *
   * // Use the p5.File once it loads.
   * function displayInfo(file) {
   *   background(200);
   *
   *   // Display the p5.File's name.
   *   text(file.name, 10, 10, 80, 40);
   *
   *   // Display the p5.File's type and subtype.
   *   text(`${file.type}/${file.subtype}`, 10, 70);
   *
   *   // Display the p5.File's size in bytes.
   *   text(file.size, 10, 90);
   * }
   * </code>
   * </div>
   */

  /**
   * The file
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types" target="_blank">MIME type</a>
   * as a string.
   *
   * For example, `'image'` and `'text'` are both MIME types.
   *
   * @for p5.File
   * @property type
   * @example
   * <div>
   * <code>
   * // Use the file input to load a file and display its info.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call displayType() when the file loads.
   *   let input = createFileInput(displayType);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user loads a file, its type is written in black.');
   * }
   *
   * // Display the p5.File's type once it loads.
   * function displayType(file) {
   *   background(200);
   *
   *   // Display the p5.File's type.
   *   text(`This is file's type is: ${file.type}`, 10, 10, 80, 80);
   * }
   * </code>
   * </div>
   */

  /**
   * The file subtype as a string.
   *
   * For example, a file with an `'image'`
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types" target="_blank">MIME type</a>
   * may have a subtype such as ``png`` or ``jpeg``.
   *
   * @property subtype
   * @for p5.File
   *
   * @example
   * <div>
   * <code>
   * // Use the file input to load a
   * // file and display its info.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call displaySubtype() when the file loads.
   *   let input = createFileInput(displaySubtype);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user loads a file, its subtype is written in black.');
   * }
   *
   * // Display the p5.File's type once it loads.
   * function displaySubtype(file) {
   *   background(200);
   *
   *   // Display the p5.File's subtype.
   *   text(`This is file's subtype is: ${file.subtype}`, 10, 10, 80, 80);
   * }
   * </code>
   * </div>
   */

  /**
   * The file name as a string.
   *
   * @property name
   * @for p5.File
   *
   * @example
   * <div>
   * <code>
   * // Use the file input to load a
   * // file and display its info.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call displayName() when the file loads.
   *   let input = createFileInput(displayName);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user loads a file, its name is written in black.');
   * }
   *
   * // Display the p5.File's name once it loads.
   * function displayName(file) {
   *   background(200);
   *
   *   // Display the p5.File's name.
   *   text(`This is file's name is: ${file.name}`, 10, 10, 80, 80);
   * }
   * </code>
   * </div>
   */

  /**
   * The number of bytes in the file.
   *
   * @property size
   * @for p5.File
   *
   * @example
   * <div>
   * <code>
   * // Use the file input to load a file and display its info.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call displaySize() when the file loads.
   *   let input = createFileInput(displaySize);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user loads a file, its size in bytes is written in black.');
   * }
   *
   * // Display the p5.File's size in bytes once it loads.
   * function displaySize(file) {
   *   background(200);
   *
   *   // Display the p5.File's size.
   *   text(`This is file has ${file.size} bytes.`, 10, 10, 80, 80);
   * }
   * </code>
   * </div>
   */

  /**
   * A string containing the file's data.
   *
   * Data can be either image data, text contents, or a parsed object in the
   * case of JSON and <a href="#/p5.XML">p5.XML</a> objects.
   *
   * @property data
   * @for p5.File
   *
   * @example
   * <div>
   * <code>
   * // Use the file input to load a file and display its info.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a file input and place it beneath the canvas.
   *   // Call displayData() when the file loads.
   *   let input = createFileInput(displayData);
   *   input.position(0, 100);
   *
   *   describe('A gray square with a file input beneath it. If the user loads a file, its data is written in black.');
   * }
   *
   * // Display the p5.File's data once it loads.
   * function displayData(file) {
   *   background(200);
   *
   *   // Display the p5.File's data, which looks like a random string of characters.
   *   text(file.data, 10, 10, 80, 80);
   * }
   * </code>
   * </div>
   */
}

export default file;
export { File };

if(typeof p5 !== 'undefined'){
  file(p5, p5.prototype);
}
