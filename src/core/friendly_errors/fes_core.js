/**
 * @for p5
 * @requires core
 *
 * This is the main file for the Friendly Error System (FES), containing
 * the core as well as miscellaneous functionality of the FES. Here is a
 * brief outline of the functions called in this system.
 *
 * The FES may be invoked by a call to either
 * (1) _validateParameters, (2) _friendlyFileLoadError, (3) _friendlyError,
 * (4) helpForMisusedAtTopLevelCode, or (5) _fesErrorMonitor.
 *
 * _validateParameters is located in validate_params.js along with other code
 * used for parameter validation.
 * _friendlyFileLoadError is located in file_errors.js along with other code
 * used for dealing with file load errors.
 * Apart from this, there's also a file stacktrace.js, which contains the code
 * to parse the error stack, borrowed from:
 * https://github.com/stacktracejs/stacktrace.js
 *
 * For more detailed information on the FES functions, including the call
 * sequence of each function, please look at the FES Reference + Dev Notes:
 * https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md
 */
import p5 from '../main';
import { translator } from '../internationalization';

// p5.js blue, p5.js orange, auto dark green; fallback p5.js darkened magenta
// See testColors below for all the color codes and names
const typeColors = ['#2D7BB6', '#EE9900', '#4DB200', '#C83C00'];
let misusedAtTopLevelCode = null;
let defineMisusedAtTopLevelCode = null;

// the threshold for the maximum allowed levenshtein distance
// used in misspelling detection
const EDIT_DIST_THRESHOLD = 2;

// to enable or disable styling (color, font-size, etc. ) for fes messages
const ENABLE_FES_STYLING = false;

if (typeof IS_MINIFIED !== 'undefined') {
  p5._friendlyError =
    p5._checkForUserDefinedFunctions =
    p5._fesErrorMonitor =
    () => {};
} else {
  let doFriendlyWelcome = false; // TEMP until we get it all working LM

  const errorTable = require('./browser_errors').default;

  // -- Borrowed from jQuery 1.11.3 --
  const class2type = {};
  const toString = class2type.toString;
  const names = [
    'Boolean',
    'Number',
    'String',
    'Function',
    'Array',
    'Date',
    'RegExp',
    'Object',
    'Error'
  ];
  for (let n = 0; n < names.length; n++) {
    class2type[`[object ${names[n]}]`] = names[n].toLowerCase();
  }
  const getType = obj => {
    if (obj == null) {
      return `${obj}`;
    }
    return typeof obj === 'object' || typeof obj === 'function'
      ? class2type[toString.call(obj)] || 'object'
      : typeof obj;
  };

  // -- End borrow --

  // entry points into user-defined code
  const entryPoints = [
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
    'windowResized'
  ];

  const friendlyWelcome = () => {
    // p5.js brand - magenta: #ED225D
    //const astrixBgColor = 'transparent';
    //const astrixTxtColor = '#ED225D';
    //const welcomeBgColor = '#ED225D';
    //const welcomeTextColor = 'white';
    const welcomeMessage = translator('fes.pre', {
      message: translator('fes.welcome')
    });
    console.log(
      '    _ \n' +
        ' /\\| |/\\ \n' +
        " \\ ` ' /  \n" +
        ' / , . \\  \n' +
        ' \\/|_|\\/ ' +
        '\n\n' +
        welcomeMessage
    );
  };

  /**
   * Takes a message and a p5 function func, and adds a link pointing to
   * the reference documentation of func at the end of the message
   *
   * @method mapToReference
   * @private
   * @param {String}  message   the words to be said
   * @param {String}  [func]    the name of function
   *
   * @returns {String}
   */
  const mapToReference = (message, func) => {
    let msgWithReference = '';
    if (func == null || func.substring(0, 4) === 'load') {
      msgWithReference = message;
    } else {
      const methodParts = func.split('.');
      const referenceSection =
        methodParts.length > 1 ? `${methodParts[0]}.${methodParts[1]}` : 'p5';

      const funcName =
        methodParts.length === 1 ? func : methodParts.slice(2).join('/');

      //Whenever func having p5.[Class] is encountered, we need to have the error link as mentioned below else different link
      funcName.startsWith('p5.')  ?
        msgWithReference = `${message} (http://p5js.org/reference/#/${referenceSection}.${funcName})` :
        msgWithReference = `${message} (http://p5js.org/reference/#/${referenceSection}/${funcName})`;
    }
    return msgWithReference;
  };

  /**
   * Prints out a fancy, colorful message to the console log
   * Attaches Friendly Errors prefix [fes.pre] to the message.
   *
   * @method _report
   * @private
   * @param  {String}          message  Message to be printed
   * @param  {String}          [func]   Name of function
   * @param  {Number|String}   [color]  CSS color code
   *
   * @return console logs
   */
  p5._report = (message, func, color) => {
    // if p5._fesLogger is set ( i.e we are running tests ), use that
    // instead of console.log
    const log =
      p5._fesLogger == null ? console.log.bind(console) : p5._fesLogger;

    if (doFriendlyWelcome) {
      friendlyWelcome();
      doFriendlyWelcome = false;
    }
    if ('undefined' === getType(color)) {
      color = '#B40033'; // dark magenta
    } else if (getType(color) === 'number') {
      // Type to color
      color = typeColors[color];
    }

    // Add a link to the reference docs of func at the end of the message
    message = mapToReference(message, func);
    let style = [`color: ${color}`, 'font-family: Arial', 'font-size: larger'];
    const prefixedMsg = translator('fes.pre', { message });

    if (ENABLE_FES_STYLING) {
      log('%c' + prefixedMsg, style.join(';'));
    } else {
      log(prefixedMsg);
    }
  };
  /**
   * This is a generic method that can be called from anywhere in the p5
   * library to alert users to a common error.
   *
   * @method _friendlyError
   * @private
   * @param  {String}         message   Message to be printed
   * @param  {String}         [func]    Name of the function linked to error
   * @param  {Number|String}  [color]   CSS color code
   */
  p5._friendlyError = function(message, func, color) {
    p5._report(message, func, color);
  };

  /**
   * This can be called from anywhere in the p5 library to show users
   * a localized error message. Instead of passing the message itself, we
   * pass a "key" that refers to a message contained in our bank of
   * translations for all our supported languages (including English). (See
   * `/translations/en/translation.json`).
   *
   * This works well for simple messages. If you want to do something more complex
   * (like include a filename from an error), you'll need to use translator() and
   * p5._friendlyError() together.
   *
   * @method _friendlyLocalizedError
   * @private
   * @param  {String}         messageKey    Key to localized message to be printed
   * @param  {String}         [func]        Name of the function linked to error
   * @param  {Number|String}  [color]       CSS color code
   */
  p5._friendlyLocalizedError = function(messageKey, func, color) {
    // in the future we could support more direct calls to translator()
    // to support extra arguments for complex messages
    // by adding a typeof if statement on messageKey
    const message = translator(messageKey);
    p5._report(message, func, color);
  };

  /**
   * This is called internally if there is an error with autoplay. Generates
   * and prints a friendly error message [fes.autoplay].
   *
   * @method _friendlyAutoplayError
   * @private
   */
  p5._friendlyAutoplayError = function(src) {
    const message = translator('fes.autoplay', {
      src,
      url: 'https://developer.mozilla.org/docs/Web/Media/Autoplay_guide'
    });
    p5._friendlyLocalizedError(message);
  };

  /**
   * Measures dissimilarity between two strings by calculating
   * the Levenshtein distance.
   *
   * If the "distance" between them is small enough, it is
   * reasonable to think that one is the misspelled version of the other.
   *
   * Specifically, this uses the Wagner–Fischer algorithm.
   * @method computeEditDistance
   * @private
   * @param {String} w1 the first word
   * @param {String} w2 the second word
   *
   * @returns {Number} the "distance" between the two words, a smaller value
   *                   indicates that the words are similar
   */
  const computeEditDistance = (w1, w2) => {
    const l1 = w1.length,
      l2 = w2.length;
    if (l1 === 0) return w2;
    if (l2 === 0) return w1;

    let prev = [];
    let cur = [];

    for (let j = 0; j < l2 + 1; j++) {
      cur[j] = j;
    }

    prev = cur;

    for (let i = 1; i < l1 + 1; i++) {
      cur = [];
      for (let j = 0; j < l2 + 1; j++) {
        if (j === 0) {
          cur[j] = i;
        } else {
          let a1 = w1[i - 1],
            a2 = w2[j - 1];
          let temp = 999999;
          let cost = a1.toLowerCase() === a2.toLowerCase() ? 0 : 1;
          temp = temp > cost + prev[j - 1] ? cost + prev[j - 1] : temp;
          temp = temp > 1 + cur[j - 1] ? 1 + cur[j - 1] : temp;
          temp = temp > 1 + prev[j] ? 1 + prev[j] : temp;
          cur[j] = temp;
        }
      }
      prev = cur;
    }

    return cur[l2];
  };

  /**
   * Checks capitalization for user defined functions.
   *
   * Generates and prints a friendly error message using key:
   * "fes.checkUserDefinedFns".
   *
   * @method checkForUserDefinedFunctions
   * @private
   * @param {*} context   Current default context. Set to window in
   *                      "global mode" and to a p5 instance in "instance mode"
   */
  const checkForUserDefinedFunctions = context => {
    if (p5.disableFriendlyErrors) return;

    // if using instance mode, this function would be called with the current
    // instance as context
    const instanceMode = context instanceof p5;
    context = instanceMode ? context : window;
    const fnNames = entryPoints;

    const fxns = {};
    // lowercasename -> actualName mapping
    fnNames.forEach(symbol => {
      fxns[symbol.toLowerCase()] = symbol;
    });

    for (const prop of Object.keys(context)) {
      const lowercase = prop.toLowerCase();

      // check if the lowercase property name has an entry in fxns, if the
      // actual name with correct capitalization doesnt exist in context,
      // and if the user-defined symbol is of the type function
      if (
        fxns[lowercase] &&
        !context[fxns[lowercase]] &&
        typeof context[prop] === 'function'
      ) {
        const msg = translator('fes.checkUserDefinedFns', {
          name: prop,
          actualName: fxns[lowercase]
        });

        p5._friendlyError(msg, fxns[lowercase]);
      }
    }
  };

  /**
   * Compares the symbol caught in the ReferenceError to everything in
   * misusedAtTopLevel ( all public p5 properties ).
   *
   * Generates and prints a friendly error message using key: "fes.misspelling".
   *
   * @method handleMisspelling
   * @private
   * @param {String} errSym   Symbol to whose spelling to check
   * @param {Error} error     ReferenceError object
   *
   * @returns {Boolean} tell whether error was likely due to typo
   */
  const handleMisspelling = (errSym, error) => {
    if (!misusedAtTopLevelCode) {
      defineMisusedAtTopLevelCode();
    }

    const distanceMap = {};
    let min = 999999;
    // compute the levenshtein distance for the symbol against all known
    // public p5 properties. Find the property with the minimum distance
    misusedAtTopLevelCode.forEach(symbol => {
      let dist = computeEditDistance(errSym, symbol.name);
      if (distanceMap[dist]) distanceMap[dist].push(symbol);
      else distanceMap[dist] = [symbol];

      if (dist < min) min = dist;
    });

    // if the closest match has more "distance" than the max allowed threshold
    if (min > Math.min(EDIT_DIST_THRESHOLD, errSym.length)) return false;

    // Show a message only if the caught symbol and the matched property name
    // differ in their name ( either letter difference or difference of case )
    const matchedSymbols = distanceMap[min].filter(
      symbol => symbol.name !== errSym
    );
    if (matchedSymbols.length !== 0) {
      const parsed = p5._getErrorStackParser().parse(error);
      let locationObj;
      if (
        parsed &&
        parsed[0] &&
        parsed[0].fileName &&
        parsed[0].lineNumber &&
        parsed[0].columnNumber
      ) {
        locationObj = {
          location: `${parsed[0].fileName}:${parsed[0].lineNumber}:${
            parsed[0].columnNumber
          }`,
          file: parsed[0].fileName.split('/').slice(-1),
          line: parsed[0].lineNumber
        };
      }

      let msg;
      if (matchedSymbols.length === 1) {
        // To be used when there is only one closest match. The count parameter
        // allows i18n to pick between the keys "fes.misspelling" and
        // "fes.misspelling_plural"
        msg = translator('fes.misspelling', {
          name: errSym,
          actualName: matchedSymbols[0].name,
          type: matchedSymbols[0].type,
          location: locationObj ? translator('fes.location', locationObj) : '',
          count: matchedSymbols.length
        });
      } else {
        // To be used when there are multiple closest matches. Gives each
        // suggestion on its own line, the function name followed by a link to
        // reference documentation
        const suggestions = matchedSymbols
          .map(symbol => {
            const message =
              '▶️ ' + symbol.name + (symbol.type === 'function' ? '()' : '');
            return mapToReference(message, symbol.name);
          })
          .join('\n');

        msg = translator('fes.misspelling', {
          name: errSym,
          suggestions,
          location: locationObj ? translator('fes.location', locationObj) : '',
          count: matchedSymbols.length
        });
      }

      // If there is only one closest match, tell _friendlyError to also add
      // a link to the reference documentation. In case of multiple matches,
      // this is already done in the suggestions variable, one link for each
      // suggestion.
      p5._friendlyError(
        msg,
        matchedSymbols.length === 1 ? matchedSymbols[0].name : undefined
      );
      return true;
    }
    return false;
  };

  /**
   * Prints a friendly stacktrace for user-written functions for "global" errors
   *
   * Generates and prints a friendly error message using key:
   * "fes.globalErrors.stackTop", "fes.globalErrors.stackSubseq".
   *
   * @method printFriendlyStack
   * @private
   * @param {Array} friendlyStack
   */
  const printFriendlyStack = friendlyStack => {
    const log =
      p5._fesLogger && typeof p5._fesLogger === 'function'
        ? p5._fesLogger
        : console.log.bind(console);
    if (friendlyStack.length > 1) {
      let stacktraceMsg = '';
      friendlyStack.forEach((frame, idx) => {
        const location = `${frame.fileName}:${frame.lineNumber}:${
          frame.columnNumber
        }`;
        let frameMsg,
          translationObj = {
            func: frame.functionName,
            line: frame.lineNumber,
            location,
            file: frame.fileName.split('/').slice(-1)
          };
        if (idx === 0) {
          frameMsg = translator('fes.globalErrors.stackTop', translationObj);
        } else {
          frameMsg = translator('fes.globalErrors.stackSubseq', translationObj);
        }
        stacktraceMsg += frameMsg;
      });
      log(stacktraceMsg);
    }
  };

  /**
   * Takes a stacktrace array and filters out all frames that show internal p5
   * details.
   *
   * Generates and prints a friendly error message using key:
   * "fes.wrongPreload", "fes.libraryError".
   *
   * The processed stack is used to find whether the error happened internally
   * within the library, and if the error was due to a non-loadX() method
   * being used in preload.
   *
   * "Internally" here means that the exact location of the error (the top of
   * the stack) is a piece of code written in the p5.js library (which may or
   * may not have been called from the user's sketch).
   *
   * @method processStack
   * @private
   * @param {Error} error
   * @param {Array} stacktrace
   *
   * @returns {Array} An array with two elements, [isInternal, friendlyStack]
   *                 isInternal: a boolean value indicating whether the error
   *                             happened internally
   *                 friendlyStack: the filtered (simplified) stacktrace
   */
  const processStack = (error, stacktrace) => {
    // cannot process a stacktrace that doesn't exist
    if (!stacktrace) return [false, null];

    stacktrace.forEach(frame => {
      frame.functionName = frame.functionName || '';
    });

    // isInternal - Did this error happen inside the library
    let isInternal = false;
    let p5FileName, friendlyStack, currentEntryPoint;

    // Intentionally throw an error that we catch so that we can check the name
    // of the current file. Any errors we see from this file, we treat as
    // internal errors.
    try {
      throw new Error();
    } catch (testError) {
      const testStacktrace = p5._getErrorStackParser().parse(testError);
      p5FileName = testStacktrace[0].fileName;
    }

    for (let i = stacktrace.length - 1; i >= 0; i--) {
      let splitted = stacktrace[i].functionName.split('.');
      if (entryPoints.includes(splitted[splitted.length - 1])) {
        // remove everything below an entry point function (setup, draw, etc).
        // (it's usually the internal initialization calls)
        friendlyStack = stacktrace.slice(0, i + 1);
        currentEntryPoint = splitted[splitted.length - 1];
        // We call the error "internal" if the source of the error was a
        // function from within the p5.js library file, but called from the
        // user's code directly. We only need to check the topmost frame in
        // the stack trace since any function internal to p5 should pass this
        // check, not just public p5 functions.
        if (stacktrace[0].fileName === p5FileName) {
          isInternal = true;
          break;
        }
        break;
      }
    }

    // in some cases ( errors in promises, callbacks, etc), no entry-point
    // function may be found in the stacktrace. In that case just use the
    // entire stacktrace for friendlyStack
    if (!friendlyStack) friendlyStack = stacktrace;

    if (isInternal) {
      // the frameIndex property is added before the filter, so frameIndex
      // corresponds to the index of a frame in the original stacktrace.
      // Then we filter out all frames which belong to the file that contains
      // the p5 library
      friendlyStack = friendlyStack
        .map((frame, index) => {
          frame.frameIndex = index;
          return frame;
        })
        .filter(frame => frame.fileName !== p5FileName);

      // a weird case, if for some reason we can't identify the function called
      // from user's code
      if (friendlyStack.length === 0) return [true, null];

      // get the function just above the topmost frame in the friendlyStack.
      // i.e the name of the library function called from user's code
      const func = stacktrace[friendlyStack[0].frameIndex - 1].functionName
        .split('.')
        .slice(-1)[0];

      // Try and get the location (line no.) from the top element of the stack
      let locationObj;
      if (
        friendlyStack[0].fileName &&
        friendlyStack[0].lineNumber &&
        friendlyStack[0].columnNumber
      ) {
        locationObj = {
          location: `${friendlyStack[0].fileName}:${
            friendlyStack[0].lineNumber
          }:${friendlyStack[0].columnNumber}`,
          file: friendlyStack[0].fileName.split('/').slice(-1),
          line: friendlyStack[0].lineNumber
        };

        // if already handled by another part of the FES, don't handle again
        if (p5._fesLogCache[locationObj.location]) return [true, null];
      }

      // Check if the error is due to a non loadX method being used incorrectly
      // in preload
      if (
        currentEntryPoint === 'preload' &&
        p5.prototype._preloadMethods[func] == null
      ) {
        p5._friendlyError(
          translator('fes.wrongPreload', {
            func,
            location: locationObj
              ? translator('fes.location', locationObj)
              : '',
            error: error.message
          }),
          'preload'
        );
      } else {
        // Library error
        p5._friendlyError(
          translator('fes.libraryError', {
            func,
            location: locationObj
              ? translator('fes.location', locationObj)
              : '',
            error: error.message
          }),
          func
        );
      }

      // Finally, if it's an internal error, print the friendlyStack
      // ( fesErrorMonitor won't handle this error )
      if (friendlyStack && friendlyStack.length) {
        printFriendlyStack(friendlyStack);
      }
    }
    return [isInternal, friendlyStack];
  };

  /**
   * Handles "global" errors that the browser catches.
   *
   * Called when an error event happens and detects the type of error.
   *
   * Generates and prints a friendly error message using key:
   * "fes.globalErrors.syntax.[*]", "fes.globalErrors.reference.[*]",
   * "fes.globalErrors.type.[*]".
   *
   * @method fesErrorMonitor
   * @private
   * @param {*} e  Event object to extract error details from
   */
  const fesErrorMonitor = e => {
    if (p5.disableFriendlyErrors) return;
    // Try to get the error object from e
    let error;
    if (e instanceof Error) {
      error = e;
    } else if (e instanceof ErrorEvent) {
      error = e.error;
    } else if (e instanceof PromiseRejectionEvent) {
      error = e.reason;
      if (!(error instanceof Error)) return;
    }
    if (!error) return;

    let stacktrace = p5._getErrorStackParser().parse(error);
    // process the stacktrace from the browser and simplify it to give
    // friendlyStack.
    let [isInternal, friendlyStack] = processStack(error, stacktrace);

    // if this is an internal library error, the type of the error is not relevant,
    // only the user code that lead to it is.
    if (isInternal) {
      return;
    }

    const errList = errorTable[error.name];
    if (!errList) return; // this type of error can't be handled yet
    let matchedError;
    for (const obj of errList) {
      let string = obj.msg;
      // capture the primary symbol mentioned in the error
      string = string.replace(new RegExp('{{}}', 'g'), '([a-zA-Z0-9_]+)');
      string = string.replace(new RegExp('{{.}}', 'g'), '(.+)');
      string = string.replace(new RegExp('{}', 'g'), '(?:[a-zA-Z0-9_]+)');
      let matched = error.message.match(string);

      if (matched) {
        matchedError = Object.assign({}, obj);
        matchedError.match = matched;
        break;
      }
    }

    if (!matchedError) return;

    // Try and get the location from the top element of the stack
    let locationObj;
    if (
      stacktrace &&
      stacktrace[0].fileName &&
      stacktrace[0].lineNumber &&
      stacktrace[0].columnNumber
    ) {
      locationObj = {
        location: `${stacktrace[0].fileName}:${stacktrace[0].lineNumber}:${
          stacktrace[0].columnNumber
        }`,
        file: stacktrace[0].fileName.split('/').slice(-1),
        line: friendlyStack[0].lineNumber
      };
    }

    switch (error.name) {
      case 'SyntaxError': {
        // We can't really do much with syntax errors other than try to use
        // a simpler framing of the error message. The stack isn't available
        // for syntax errors
        switch (matchedError.type) {
          case 'INVALIDTOKEN': {
            //Error if there is an invalid or unexpected token that doesn't belong at this position in the code
            //let x = “not a string”; -> string not in proper quotes
            let url =
              'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Illegal_character#What_went_wrong';
            p5._friendlyError(
              translator('fes.globalErrors.syntax.invalidToken', {
                url
              })
            );
            break;
          }
          case 'UNEXPECTEDTOKEN': {
            //Error if a specific language construct(, { ; etc) was expected, but something else was provided
            //for (let i = 0; i < 5,; ++i) -> a comma after i<5 instead of a semicolon
            let url =
              'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Unexpected_token#What_went_wrong';
            p5._friendlyError(
              translator('fes.globalErrors.syntax.unexpectedToken', {
                url
              })
            );
            break;
          }
          case 'REDECLAREDVARIABLE': {
            //Error if a variable is redeclared by the user. Example=>
            //let a = 10;
            //let a = 100;
            let errSym = matchedError.match[1];
            let url =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Redeclared_parameter#what_went_wrong';
            p5._friendlyError(
              translator('fes.globalErrors.syntax.redeclaredVariable', {
                symbol: errSym,
                url
              })
            );
            break;
          }
          case 'MISSINGINITIALIZER': {
            //Error if a const variable is not initialized during declaration
            //Example => const a;
            let url =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Missing_initializer_in_const#what_went_wrong';
            p5._friendlyError(
              translator('fes.globalErrors.syntax.missingInitializer', {
                url
              })
            );
            break;
          }
          case 'BADRETURNORYIELD': {
            //Error when a return statement is misplaced(usually outside of a function)
            // const a = function(){
            //  .....
            //  }
            //  return; -> misplaced return statement
            let url =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Bad_return_or_yield#what_went_wrong';
            p5._friendlyError(
              translator('fes.globalErrors.syntax.badReturnOrYield', {
                url
              })
            );
            break;
          }
        }
        break;
      }
      case 'ReferenceError': {
        switch (matchedError.type) {
          case 'NOTDEFINED': {
            //Error if there is a non-existent variable referenced somewhere
            //let a = 10;
            //console.log(x);
            let errSym = matchedError.match[1];

            if (errSym && handleMisspelling(errSym, error)) {
              break;
            }

            // if the flow gets this far, this is likely not a misspelling
            // of a p5 property/function
            let url = 'https://p5js.org/examples/data-variable-scope.html';
            p5._friendlyError(
              translator('fes.globalErrors.reference.notDefined', {
                url,
                symbol: errSym,
                location: locationObj
                  ? translator('fes.location', locationObj)
                  : ''
              })
            );

            if (friendlyStack) printFriendlyStack(friendlyStack);
            break;
          }
          case 'CANNOTACCESS': {
            //Error if a lexical variable was accessed before it was initialized
            //console.log(a); -> variable accessed before it was initialized
            //let a=100;
            let errSym = matchedError.match[1];
            let url =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_lexical_declaration_before_init#what_went_wrong';
            p5._friendlyError(
              translator('fes.globalErrors.reference.cannotAccess', {
                url,
                symbol: errSym,
                location: locationObj
                  ? translator('fes.location', locationObj)
                  : ''
              })
            );

            if (friendlyStack) printFriendlyStack(friendlyStack);
            break;
          }
        }
        break;
      }

      case 'TypeError': {
        switch (matchedError.type) {
          case 'NOTFUNC': {
            //Error when some code expects you to provide a function, but that didn't happen
            //let a = document.getElementByID('foo'); -> getElementById instead of getElementByID
            let errSym = matchedError.match[1];
            let splitSym = errSym.split('.');
            let url =
              'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Not_a_function#What_went_wrong';

            // if errSym is aa.bb.cc , symbol would be cc and obj would aa.bb
            let translationObj = {
              url,
              symbol: splitSym[splitSym.length - 1],
              obj: splitSym.slice(0, splitSym.length - 1).join('.'),
              location: locationObj
                ? translator('fes.location', locationObj)
                : ''
            };

            // There are two cases to handle here. When the function is called
            // as a property of an object and when it's called independently.
            // Both have different explanations.
            if (splitSym.length > 1) {
              p5._friendlyError(
                translator('fes.globalErrors.type.notfuncObj', translationObj)
              );
            } else {
              p5._friendlyError(
                translator('fes.globalErrors.type.notfunc', translationObj)
              );
            }

            if (friendlyStack) printFriendlyStack(friendlyStack);
            break;
          }
          case 'READNULL': {
            //Error if a property of null is accessed
            //let a = null;
            //console.log(a.property); -> a is null
            let errSym = matchedError.match[1];
            let url =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property#what_went_wrong';
            /*let url2 =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null';*/
            p5._friendlyError(
              translator('fes.globalErrors.type.readFromNull', {
                url,
                symbol: errSym,
                location: locationObj
                  ? translator('fes.location', locationObj)
                  : ''
              })
            );

            if (friendlyStack) printFriendlyStack(friendlyStack);
            break;
          }
          case 'READUDEFINED': {
            //Error if a property of undefined is accessed
            //let a; -> default value of a is undefined
            //console.log(a.property); -> a is undefined
            let errSym = matchedError.match[1];
            let url =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property#what_went_wrong';
            /*let url2 =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined#description';*/
            p5._friendlyError(
              translator('fes.globalErrors.type.readFromUndefined', {
                url,
                symbol: errSym,
                location: locationObj
                  ? translator('fes.location', locationObj)
                  : ''
              })
            );

            if (friendlyStack) printFriendlyStack(friendlyStack);
            break;
          }
          case 'CONSTASSIGN': {
            //Error when a const variable is reassigned a value
            //const a = 100;
            //a=10;
            let url =
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_const_assignment#what_went_wrong';
            p5._friendlyError(
              translator('fes.globalErrors.type.constAssign', {
                url,
                location: locationObj
                  ? translator('fes.location', locationObj)
                  : ''
              })
            );

            if (friendlyStack) printFriendlyStack(friendlyStack);
            break;
          }
        }
      }
    }
  };

  p5._fesErrorMonitor = fesErrorMonitor;
  p5._checkForUserDefinedFunctions = checkForUserDefinedFunctions;

  // logger for testing purposes.
  p5._fesLogger = null;
  p5._fesLogCache = {};

  window.addEventListener('load', checkForUserDefinedFunctions, false);
  window.addEventListener('error', p5._fesErrorMonitor, false);
  window.addEventListener('unhandledrejection', p5._fesErrorMonitor, false);

  /**
   * Prints out all the colors in the color pallete with white text.
   * For color blindness testing.
   */
  /* function testColors() {
    const str = 'A box of biscuits, a box of mixed biscuits and a biscuit mixer';
    p5._friendlyError(str, 'print', '#ED225D'); // p5.js magenta
    p5._friendlyError(str, 'print', '#2D7BB6'); // p5.js blue
    p5._friendlyError(str, 'print', '#EE9900'); // p5.js orange
    p5._friendlyError(str, 'print', '#A67F59'); // p5.js light brown
    p5._friendlyError(str, 'print', '#704F21'); // p5.js gold
    p5._friendlyError(str, 'print', '#1CC581'); // auto cyan
    p5._friendlyError(str, 'print', '#FF6625'); // auto orange
    p5._friendlyError(str, 'print', '#79EB22'); // auto green
    p5._friendlyError(str, 'print', '#B40033'); // p5.js darkened magenta
    p5._friendlyError(str, 'print', '#084B7F'); // p5.js darkened blue
    p5._friendlyError(str, 'print', '#945F00'); // p5.js darkened orange
    p5._friendlyError(str, 'print', '#6B441D'); // p5.js darkened brown
    p5._friendlyError(str, 'print', '#2E1B00'); // p5.js darkened gold
    p5._friendlyError(str, 'print', '#008851'); // auto dark cyan
    p5._friendlyError(str, 'print', '#C83C00'); // auto dark orange
    p5._friendlyError(str, 'print', '#4DB200'); // auto dark green
  } */
}

// This is a lazily-defined list of p5 symbols that may be
// misused by beginners at top-level code, outside of setup/draw. We'd like
// to detect these errors and help the user by suggesting they move them
// into setup/draw.
//
// For more details, see https://github.com/processing/p5.js/issues/1121.
misusedAtTopLevelCode = null;
const FAQ_URL =
  'https://github.com/processing/p5.js/wiki/p5.js-overview#why-cant-i-assign-variables-using-p5-functions-and-variables-before-setup';

/**
 * A helper function for populating misusedAtTopLevel list.
 *
 * @method defineMisusedAtTopLevelCode
 * @private
 */
defineMisusedAtTopLevelCode = () => {
  const uniqueNamesFound = {};

  const getSymbols = obj =>
    Object.getOwnPropertyNames(obj)
      .filter(name => {
        if (name[0] === '_') {
          return false;
        }
        if (name in uniqueNamesFound) {
          return false;
        }

        uniqueNamesFound[name] = true;

        return true;
      })
      .map(name => {
        let type;

        if (typeof obj[name] === 'function') {
          type = 'function';
        } else if (name === name.toUpperCase()) {
          type = 'constant';
        } else {
          type = 'variable';
        }

        return { name, type };
      });

  misusedAtTopLevelCode = [].concat(
    getSymbols(p5.prototype),
    // At present, p5 only adds its constants to p5.prototype during
    // construction, which may not have happened at the time a
    // ReferenceError is thrown, so we'll manually add them to our list.
    getSymbols(require('../constants'))
  );

  // This will ultimately ensure that we report the most specific error
  // possible to the user, e.g. advising them about HALF_PI instead of PI
  // when their code misuses the former.
  misusedAtTopLevelCode.sort((a, b) => b.name.length - a.name.length);
};

/**
 * Detects browser level error event for p5 constants/functions used outside
 * of setup() and draw().
 *
 * Generates and prints a friendly error message using key:
 * "fes.misusedTopLevel".
 *
 * @method helpForMisusedAtTopLevelCode
 * @private
 * @param {Event} e       Error event
 * @param {Boolean} log   false
 *
 * @returns {Boolean} true
 */
const helpForMisusedAtTopLevelCode = (e, log) => {
  if (!log) {
    log = console.log.bind(console);
  }

  if (!misusedAtTopLevelCode) {
    defineMisusedAtTopLevelCode();
  }

  // If we find that we're logging lots of false positives, we can
  // uncomment the following code to avoid displaying anything if the
  // user's code isn't likely to be using p5's global mode. (Note that
  // setup/draw are more likely to be defined due to JS function hoisting.)
  //
  //if (!('setup' in window || 'draw' in window)) {
  //  return;
  //}

  misusedAtTopLevelCode.some(symbol => {
    // Note that while just checking for the occurrence of the
    // symbol name in the error message could result in false positives,
    // a more rigorous test is difficult because different browsers
    // log different messages, and the format of those messages may
    // change over time.
    //
    // For example, if the user uses 'PI' in their code, it may result
    // in any one of the following messages:
    //
    //   * 'PI' is undefined                           (Microsoft Edge)
    //   * ReferenceError: PI is undefined             (Firefox)
    //   * Uncaught ReferenceError: PI is not defined  (Chrome)

    if (e.message && e.message.match(`\\W?${symbol.name}\\W`) !== null) {
      const symbolName =
        symbol.type === 'function' ? `${symbol.name}()` : symbol.name;
      if (typeof IS_MINIFIED !== 'undefined') {
        log(
          `Did you just try to use p5.js's ${symbolName} ${
            symbol.type
          }? If so, you may want to move it into your sketch's setup() function.\n\nFor more details, see: ${FAQ_URL}`
        );
      } else {
        log(
          translator('fes.misusedTopLevel', {
            symbolName,
            symbolType: symbol.type,
            url: FAQ_URL
          })
        );
      }
      return true;
    }
  });
};

// Exposing this primarily for unit testing.
p5.prototype._helpForMisusedAtTopLevelCode = helpForMisusedAtTopLevelCode;

if (document.readyState !== 'complete') {
  window.addEventListener('error', helpForMisusedAtTopLevelCode, false);

  // Our job is only to catch ReferenceErrors that are thrown when
  // global (non-instance mode) p5 APIs are used at the top-level
  // scope of a file, so we'll unbind our error listener now to make
  // sure we don't log false positives later.
  window.addEventListener('load', () => {
    window.removeEventListener('error', helpForMisusedAtTopLevelCode, false);
  });
}

export default p5;
