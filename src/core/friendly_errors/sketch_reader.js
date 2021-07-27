/**
 * @for p5
 * @requires core
 *
 * This file contains the code for sketch reader functionality
 * of the FES.
 * p5._fesCodeReader() with the help of other helper functions performs the following tasks.
 *
 * 1. Extraction of the code written by the user
 * 2. Conversion of the code to an array of lines of code
 * 3. Catching variable and function decleration
 * 4. Checking if the declared function/variable is a reserved p5.js
 *    constant or function
 *
 */

import p5 from '../main';
import { translator } from '../internationalization';
import * as constants from '../constants';

if (
  typeof IS_MINIFIED !== 'undefined' ||
  document.location.pathname.includes('file://')
) {
  //if p5.min.js or directly running the html file then skip check
  p5._fesCodeReader = () => {};
} else {
  /**
   * Takes a list of variables defined by the user in the code
   * as an array and checks if the list contains p5.js constants.
   * If found then display a friendly error message.
   *
   * @method checkForConsts
   * @private
   * @param {Array} variables list of variables defined by user
   */
  const checkForConsts = variables => {
    for (let i = 0; i < variables.length; i++) {
      if (constants[variables[i]] !== undefined) {
        let url = `https://p5js.org/reference/#/p5/${variables[i]}`;
        p5._friendlyError(
          translator('fes.sketchReaderErrors.reservedConst', {
            url: url,
            symbol: variables[i]
          })
        );
        break;
      }
    }
  };

  /**
   * Takes a list of functions defined by the user in the code
   * as an array and checks if the list contains a reserved p5.js function.
   * If found then display a friendly error message.
   *
   * @method checkForFuncs
   * @private
   * @param {Array} funcs list of functions defined by user
   */
  const checkForFuncs = funcs => {
    const p5Constructors = {};
    for (let key of Object.keys(p5)) {
      // Get a list of all constructors in p5. They are functions whose names
      // start with a capital letter
      if (typeof p5[key] === 'function' && key[0] !== key[0].toLowerCase()) {
        p5Constructors[key] = p5[key];
      }
    }
    for (let i = 0; i < funcs.length; i++) {
      //for every function name obtained check if it matches any p5.js function name
      const keyArr = Object.keys(p5Constructors);
      let j = 0;
      for (; j < keyArr.length; j++) {
        if (p5Constructors[keyArr[j]].prototype[funcs[i]] !== undefined) {
          //if a p5.js function is used ie it is in the funcs array
          p5._friendlyError(
            translator('fes.sketchReaderErrors.reservedFunc', {
              symbol: funcs[i]
            })
          );
          break;
        }
      }
      if (j < keyArr.length) break;
    }
  };

  /**
   * Takes an array in which each element is a line of code
   * containing a variable definition(Eg: arr=['let x = 100', 'const y = 200'])
   * and extracts the variables defined.
   *
   * @method extractVariables
   * @private
   * @param {Array} arr array of lines of code
   */
  const extractVariables = arr => {
    //extract variable names from the user's code
    let matches = [];
    arr.forEach(ele => {
      //extract a, b, c from let/const a=10, b=20, c;
      if (ele.includes(',')) {
        matches.push(
          ...ele.split(',').flatMap(s => {
            let match;
            if (s.includes('=')) {
              match = s.match(/(\w+)\s*(?==)/i);
              return match[1];
            } else if (!s.match(new RegExp('[[]{}]'))) {
              let m = s.match(/(?:(?:let|const|var)\s+)?([\w$]+)/);
              if (m !== null)
                return s.match(/(?:(?:let|const|var)\s+)?([\w$,]+)/)[1];
            } else return [];
          })
        );
      } else {
        //extract a from let/const a=10;
        const reg = /(?:(?:let|const)\s+)([\w$]+)/g;
        const found = ele.matchAll(reg);
        for (const match of found) {
          matches.push(match[1]);
        }
      }
    });
    //check if the obtained variables are a part of p5.js or not
    checkForConsts(matches); //check if the obtained variables are a p5.js constants
  };

  /**
   * Takes an array in which each element is a line of code
   * containing a function definition(arr=['let x = () => {...}'])
   * and extracts the functions defined.
   *
   * @method extractFuncVariables
   * @private
   * @param {Array} arr array of lines of code
   */
  const extractFuncVariables = arr => {
    let matches = [];
    //extract function names
    const reg = /(?:(?:let|const)\s+)([\w$]+)/;
    arr.forEach(ele => {
      matches.push(ele.match(reg)[1]);
    });
    //matches array contains the names of the functions
    checkForFuncs(matches);
  };

  /**
   * Converts code written by the user to an array
   * every element of which is a seperate line of code.
   *
   * @method codeToLines
   * @private
   * @param {String} code code written by the user
   */
  const codeToLines = code => {
    //convert code to array of code and filter out
    //unnecessary lines
    let arr = code.split('\n');
    //filter out lines containing variable names
    let arrVars = arr
      .map(line => line.trim())
      .filter(
        line =>
          line !== '' &&
          !line.includes('//') &&
          (line.includes('let') || line.includes('const')) &&
          (!line.includes('=>') && !line.includes('function'))
      );

    //filter out lines containing function names
    let arrFunc = arr
      .map(line => line.trim())
      .filter(
        line =>
          line !== '' &&
          !line.includes('//') &&
          (line.includes('let') || line.includes('const')) &&
          (line.includes('=>') || line.includes('function'))
      );

    //pass the relevant array to a function which will extract all the variables/functions names
    extractVariables(arrVars);
    extractFuncVariables(arrFunc);
  };

  /**
   *  Remove multiline comments and the code written inside it.
   *
   * @method removeMultilineComments
   * @private
   * @param {String} str code written by the user
   */
  const removeMultilineComments = str => {
    let start = str.indexOf('/*');
    let end = str.indexOf('*/');

    //create a new string which don't have multiline comments
    while (start !== -1 && end !== -1) {
      if (start === 0) {
        str = str.substr(end + 2);
      } else str = str.substr(0, start) + str.substr(end + 2);

      start = str.indexOf('/*');
      end = str.indexOf('*/');
    }

    return str;
  };

  /**
   * Initiates the sketch_reader's processes.
   * Obtains the user's code and forwards it for further
   * processing and evaluation.
   *
   * @method fesCodeReader
   * @private
   */
  const fesCodeReader = () => {
    return new Promise(resolve => {
      let codeNode = document.querySelector('body'),
        text = '';
      if (codeNode) {
        //if web editor
        fetch(codeNode.children[0].getAttribute('src')).then(res =>
          res.text().then(txt => {
            text = txt;
            resolve(text);
          })
        );
      } else {
        //obtain the name of the file in script tag
        //ignore p5.js, p5.min.js, p5.sounds.js, p5.sounds.min.js
        const scripts = [...document.querySelectorAll('script')]
          .map(file => file.getAttribute('src'))
          .filter(
            attr =>
              attr !== null &&
              attr !== undefined &&
              !attr.includes('p5.js') &&
              !attr.includes('p5.min.js') &&
              !attr.includes('p5.sounds.min.js') &&
              !attr.includes('p5.sounds.js') &&
              !attr.includes('previewScripts') &&
              attr !== ''
          );
        //obtain the user's code form the JS file
        fetch(`${scripts[0]}`).then(res =>
          res.text().then(txt => {
            text = txt;
            resolve(text);
          })
        );
      }
    });
  };

  p5._fesCodeReader = fesCodeReader;

  window.addEventListener('load', () => {
    fesCodeReader()
      .then(code => {
        //remove multiline comments
        code = removeMultilineComments(code);
        //convert the code to array of lines of code
        codeToLines(code);
      })
      .catch(err => console.log(err));
  });
}
export default p5;
