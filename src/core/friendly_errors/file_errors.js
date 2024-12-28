/**
 * @for p5
 * @requires core
 */
import { translator } from '../internationalization';

function fileErrors(p5, fn){
  // mapping used by `_friendlyFileLoadError`
  const fileLoadErrorCases = (num, filePath) => {
    const suggestion = translator('fes.fileLoadError.suggestion', {
      filePath,
      url: 'https://github.com/processing/p5.js/wiki/Local-server'
    });
    switch (num) {
      case 0:
        return {
          message: translator('fes.fileLoadError.image', {
            suggestion
          }),
          method: 'loadImage'
        };
      case 1:
        return {
          message: translator('fes.fileLoadError.xml', {
            suggestion
          }),
          method: 'loadXML'
        };
      case 2:
        return {
          message: translator('fes.fileLoadError.table', {
            suggestion
          }),
          method: 'loadTable'
        };
      case 3:
        return {
          message: translator('fes.fileLoadError.strings', {
            suggestion
          }),
          method: 'loadStrings'
        };
      case 4:
        return {
          message: translator('fes.fileLoadError.font', {
            suggestion
          }),
          method: 'loadFont'
        };
      case 5:
        return {
          message: translator('fes.fileLoadError.json', {
            suggestion
          }),
          method: 'loadJSON'
        };
      case 6:
        return {
          message: translator('fes.fileLoadError.bytes', {
            suggestion
          }),
          method: 'loadBytes'
        };
      case 7:
        return {
          message: translator('fes.fileLoadError.large'),
          method: 'loadX'
        };
      case 8:
        return {
          message: translator('fes.fileLoadError.gif'),
          method: 'loadImage'
        };
    }
  };

  /**
   * Called internally if there is an error during file loading.
   *
   * Generates and prints a friendly error message using key:
   * "fes.fileLoadError.[*]".
   *
   * @method _friendlyFileLoadError
   * @private
   * @param  {Number} errorType   Number of file load error type
   * @param  {String} filePath    Path to file caused the error
   */
  p5._friendlyFileLoadError = function(errorType, filePath) {
    const { message, method } = fileLoadErrorCases(errorType, filePath);
    p5._friendlyError(message, method, 3);
  };
}

export default fileErrors;

if (typeof p5 !== 'undefined') {
  fileErrors(p5, p5.prototype);
}
