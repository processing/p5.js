
import p5Font from './p5.Font.js';

/**
 * @module Type
 * @submodule p5Api
 * @for p5
 * @requires core
 */

function textApi(p5, fn) {

  const validFontTypes = ['ttf', 'otf', 'woff', 'woff2'];
  const validFontTypesRE = new RegExp(`\.(${validFontTypes.join('|')})$`, 'i');
  const invalidFontError = 'Sorry, only TTF, OTF, WOFF and WOFF2 files are supported.';

  //////////////////////////// API ////////////////////////////

  // attach text functions to p5 prototype, 
  // each delegating to the current renderer
  p5.Renderer2D.textFunctions.forEach(func => {
    fn[func] = function (...args) {
      if (func in p5.prototype) {
        p5._validateParameters(func, args);
      }
      if (!(func in p5.Renderer2D.prototype)) {
        throw Error(`Renderer2D.prototype.${func} is not defined.`);
      }
      return this._renderer[func](...args);
    };
  });

  fn.loadFont = async function (...args/*path, name, onSuccess, onError*/) {  // no renderer

    let name, path = args.shift();
    if (typeof path !== 'string' || path.length === 0) {
      p5._friendlyError(invalidFontError, 'p5.loadFont'); // ?
    }
    if (typeof args[1] === 'string') {
      name = args.shift();
    }
    else if (validFontTypesRE.test(path)) {
      name = path.split('/').pop().split('.').shift();
    }
    else {
      p5._friendlyError(invalidFontError, 'p5.loadFont'); // ?
    }

    let callback, errorCallback, options;

    // check for callbacks
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (typeof arg === 'function') {
        if (!callback) {
          callback = arg;
        } else {
          errorCallback = arg;
        }
      }
      else if (typeof arg === 'object') {
        options = arg;
      }
    }
    return await new Promise((resolve, reject) => {
      let pfont = new p5.Font(this, name, path, options);
      pfont.load().then(() => {
        document.fonts.add(pfont.delegate);
        if (typeof callback === 'function') {
          callback(pfont);
        }
        else {
          resolve(pfont);
        }
      }, err => {
        p5._friendlyFileLoadError(4, path); // ?
        if (errorCallback) {
          errorCallback(err);
        } else {
          reject(err);
        }
      });
    });
  };
} // end class  




// const ff = new FontFace(name, `url(${path})`, options);
// ff.load().then(() => {
//   document.fonts.add(ff);
//   if (typeof callback === 'function') {
//     callback(ff);
//   }
//   else {
//     return ff;
//   }
// }, err => {
//   p5._friendlyFileLoadError(4, path); // ?
//   if (errorCallback) {
//     errorCallback(err);
//   } else {
//     throw err;
//   }
// } 

//   // WORKING HERE//
//const pfont = new p5.Font(name, path, options);
//   let font = new p5.Font(name, path, options);
//   font.delegate.load(callback, errorCallback).then(() => {
//     document.fonts.add(font.delegate);
//     if (typeof callback !== 'undefined') {
//       callback(font.delegate);
//     }
//   }
//   /*else {
//     let font = new p5.Font();
//     const ff = new FontFace(name, `url(${path})`, options);
//     await new Promise((resolve, reject) => {
//       img.onload = () => {
//         pImg.width = pImg.canvas.width = img.width;
//         pImg.height = pImg.canvas.height = img.height;

//         // Draw the image into the backing canvas of the p5.Image
//         pImg.drawingContext.drawImage(img, 0, 0);
//         pImg.modified = true;
//         if (typeof successCallback === 'function') {
//           successCallback(pImg);
//         }
//         resolve();
//       };
//   }*/

//   // const fontFile = new FontFace(name, `url(${path})`, options);
//   // document.fonts.add(fontFile);

//   // return await new Promise(resolve =>
//   //   fontFile.load().then(() => {
//   //     if (typeof callback !== 'undefined') {
//   //       callback(fontFile);
//   //     }
//   //     resolve(fontFile)
//   //   },
//   //     err => {
//   //       p5._friendlyFileLoadError(4, path); // ?
//   //       if (errorCallback) {
//   //         errorCallback(err);
//   //       } else {
//   //         throw err;
//   //       }
//   //     }
//   //   ));
// };
//}

export default textApi;

// if (typeof p5 !== 'undefined') {
//   textApi(p5, p5.prototype);
// }
