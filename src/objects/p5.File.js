/**
 * @module Data
 * @submodule Data
 * @for p5.File
 */

// This is very bare at the moment and is a quick implemenation
// for file input in p5.dom.

define(function(require) {

  var p5 = require('core');

  /**
   * Base class for a file
   * Using this for createFileInput
   *
   * @class p5.File
   * @constructor
   * @param {File} file File that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.File = function(file, pInst) {
    /**
     * Underlying File object. All normal File methods can be called on this.
     *
     * @property file
     */
    this.file = file;

    this._pInst = pInst;

    // Splitting out the file type into two components
    // This makes determining if image or text etc simpler
    var typeList = file.type.split('/');
    this.type = typeList[0];
    this.subtype = typeList[1];
    this.name = file.name;
    this.size = file.size;
    
    // Data not loaded yet
    this.data = undefined;
  };

  return p5.File;
});
