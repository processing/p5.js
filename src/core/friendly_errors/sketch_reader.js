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

if (typeof IS_MINIFIED !== 'undefined') {
  p5._fesCodeReader = () => {};
} else {
  /**
   * Takes a list of variables defined by the user in the code
   * as an array and checks if the list contains p5.js constants and functions.
   * If found then display a friendly error message.
   *
   * @method checkForConstsAndFuncs
   * @private
   * @param {Array} arr
   */
  const checkForConstsAndFuncs = arr => {
    let foundMatch = false;

    for (let i = 0; i < arr.length; i++) {
      if (constants[arr[i]] !== undefined) {
        let url = `https://p5js.org/reference/#/p5/${arr[i]}`;
        p5._friendlyError(
          translator('fes.sketchReaderErrors.reservedConst', {
            url: url,
            symbol: arr[i]
          })
        );
        foundMatch = true;
        break;
      }
    }
    if (!foundMatch) {
      //if match already found then skip
      const p5Constructors = {};
      for (let key of Object.keys(p5)) {
        // Get a list of all constructors in p5. They are functions whose names
        // start with a capital letter
        if (typeof p5[key] === 'function' && key[0] !== key[0].toLowerCase()) {
          p5Constructors[key] = p5[key];
        }
      }
      for (let i = 0; i < arr.length; i++) {
        //for every function name obtained check if it matches any p5.js function name
        const keyArr = Object.keys(p5Constructors);
        let j = 0;
        for (; j < keyArr.length; j++) {
          if (p5Constructors[keyArr[j]].prototype[arr[i]] !== undefined) {
            //if a p5.js function is used ie it is in the funcs array
            p5._friendlyError(
              translator('fes.sketchReaderErrors.reservedFunc', {
                symbol: arr[i]
              })
            );
            break;
          }
        }
        if (j < keyArr.length) break;
      }
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
              if (match !== null) return match[1];
            } else if (!s.match(new RegExp('[[]{}]'))) {
              let m = s.match(/(?:(?:let|const|var)\s+)?([\w$]+)/);
              if (m !== null)
                return s.match(/(?:(?:let|const|var)\s+)?([\w$,]+)/)[1];
            } else return [];
          })
        );
      } else {
        //extract a from let/const a=10;
        const reg = /(?:(?:let|const)\s+)([\w$]+)/;
        const match = ele.match(reg);
        if (match !== null) matches.push(match[1]);
      }
    });
    //check if the obtained variables are a part of p5.js or not
    checkForConstsAndFuncs(matches);
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
      let m = ele.match(reg);
      if (m !== null) matches.push(ele.match(reg)[1]);
    });
    //matches array contains the names of the functions
    checkForConstsAndFuncs(matches);
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
   * @returns {String}
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
   * Obtains the code in setup and draw function
   * and forwards it for further processing and evaluation.
   *
   * @method fesCodeReader
   * @private
   */
  const fesCodeReader = () => {
    let code = '';
    try {
      //get code from setup
      code += '' + setup;
    } catch (e) {
      code += '';
    }
    try {
      //get code from draw
      code += '\n' + draw;
    } catch (e) {
      code += '';
    }
    if (code === '') return;
    code = removeMultilineComments(code);
    codeToLines(code);
  };

  p5._fesCodeReader = fesCodeReader;

  window.addEventListener('load', p5._fesCodeReader);
}
export default p5;
