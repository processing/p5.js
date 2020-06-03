/**
 * @for p5
 * @requires core
 */
import p5 from '../main';
import { translator } from '../internationalization';

if (typeof IS_MINIFIED !== 'undefined') {
  p5._friendlyFileLoadError = () => {};
} else {
  // mapping used by `_friendlyFileLoadError`
  const fileLoadErrorCases = (num, filePath) => {
    const suggestion = translator('fes.fileLoadError.suggestion', {
      filePath,
      link: 'https://github.com/processing/p5.js/wiki/Local-server'
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
   * This is called internally if there is a error during file loading.
   *
   * @method _friendlyFileLoadError
   * @private
   * @param  {Number} errorType
   * @param  {String} filePath
   */
  p5._friendlyFileLoadError = function(errorType, filePath) {
    const { message, method } = fileLoadErrorCases(errorType, filePath);
    p5._friendlyError(message, method, 3);
  };
}

export default p5;
