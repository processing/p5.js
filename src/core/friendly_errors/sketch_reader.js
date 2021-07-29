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
  //list of functions to ignore as they either
  //are ment to be defined or generate false positive
  //outputs
  const ignoreFunction = [
    'setup',
    'draw',
    'preload',
    'deviceMoved',
    'deviceTurned',
    'deviceShaken',
    'doubleClicked',
    'mousePressed',
    'mouseReleased',
    'mouseMoved',
    'mouseDragged',
    'mouseClicked',
    'mouseWheel',
    'touchStarted',
    'touchMoved',
    'touchEnded',
    'keyPressed',
    'keyReleased',
    'keyTyped',
    'windowResized',
    'name',
    'parent',
    'toString',
    'print',
    'stop',
    'onended'
  ];

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
    //if match already found then skip
    if (!foundMatch) {
      let p5Constructors = {};
      for (let key of Object.keys(p5)) {
        // Get a list of all constructors in p5. They are functions whose names
        // start with a capital letter
        if (typeof p5[key] === 'function' && key[0] !== key[0].toLowerCase()) {
          p5Constructors[key] = p5[key];
        }
      }
      for (let i = 0; i < arr.length; i++) {
        //ignoreFunction contains the list of functions to be ignored
        if (!ignoreFunction.includes(arr[i])) {
          const keyArr = Object.keys(p5Constructors);
          let j = 0;
          //for every function name obtained check if it matches any p5.js function name
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
   *  Remove multiline comments and the content inside it.
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
   * Checks if a p5.js constant or a function is
   * declared outside a function and reports it if found.
   *
   * @method globalConstFuncCheck
   * @private
   * @returns {Boolean}
   */

  const globalConstFuncCheck = () => {
    // generate all the const key data as an array
    const arr = Object.keys(constants);
    let element;
    let isFound = false;
    for (let i = 0; i < arr.length; i++) {
      try {
        //if the user has not declared p5.js constant anywhere outside the
        //setup or draw function then this will throw an
        //error.
        element = eval(arr[i]);
      } catch (e) {
        //We are catching the error due to the above mentioned
        //reason. Since there is no declaration of constant everything
        //is OK so we will skip the current iteration and check for the
        //next element.
        continue;
      }
      //if we are not getting an error this means
      //user have changed the value. We will check
      //if the value is changed and if it is changed
      //then report.
      if (constants[arr[i]] !== element) {
        let url = `https://p5js.org/reference/#/p5/${arr[i]}`;
        p5._friendlyError(
          translator('fes.sketchReaderErrors.reservedConst', {
            url: url,
            symbol: arr[i]
          })
        );
        isFound = true;
        break;
      }
    }
    //if a p5.js constant is already reported then no need to check
    //for p5.js functions.
    if (!isFound) {
      //the below code gets a list of p5.js functions
      let p5Constructors = {};
      for (let key of Object.keys(p5)) {
        // Get a list of all constructors in p5. They are functions whose names
        // start with a capital letter
        if (typeof p5[key] === 'function' && key[0] !== key[0].toLowerCase()) {
          p5Constructors[key] = p5[key];
        }
      }
      const keyArr = Object.keys(p5Constructors);
      let funcArray = [];
      //get the names of all p5.js functions
      for (let i = 0; i < keyArr.length; i++) {
        funcArray.push(...Object.keys(p5Constructors[keyArr[i]].prototype));
      }
      funcArray = funcArray.filter(ele => !ele.includes('_'));

      //we have p5.js function names with us so we will check
      //if they have been declared or not.
      for (let i = 0; i < funcArray.length; i++) {
        //ignoreFunction contains the list of functions to be ignored
        if (!ignoreFunction.includes(funcArray[i])) {
          try {
            //if we get an error that means the function is not declared
            element = eval(funcArray[i]);
          } catch (e) {
            //we will skip the iteration
            continue;
          }
          //if we are not getting an error this means
          //user have used p5.js function. Check if it is
          //changed and if so then report it.
          let k = 0;
          for (; k < keyArr.length; k++) {
            if (
              p5Constructors[keyArr[k]].prototype[funcArray[i]] === undefined
            );
            else {
              if (
                p5Constructors[keyArr[k]].prototype[funcArray[i]] !== element
              ) {
                p5._friendlyError(
                  translator('fes.sketchReaderErrors.reservedFunc', {
                    symbol: funcArray[i]
                  })
                );
                isFound = true;
                break;
              }
            }
          }
          if (k < keyArr.length) break;
        }
      }
    }
    //if there is a match found already then we don't want to check
    //further.
    if (isFound === true) return true;
    else return false;
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
    //moveAhead will determine if a match is found outside
    //the setup and draw function. If a match is found then
    //to prevent further potential reporting we will exit immidiately
    let moveAhead = globalConstFuncCheck();
    if (!moveAhead) {
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
    }
  };

  p5._fesCodeReader = fesCodeReader;

  window.addEventListener('load', p5._fesCodeReader);
}
export default p5;
