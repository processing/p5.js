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
import errorTable from './browser_errors';
import { getErrorStackParser } from './stacktrace';
import { TL, FES } from './fes';

function fesCore(p5, fn, lifecycles){
  // p5.js blue, p5.js orange, auto dark green; fallback p5.js darkened magenta
  const typeColors = ['#2D7BB6', '#EE9900', '#4DB200', '#C83C00'];
  let misusedAtTopLevelCode = null;
  let defineMisusedAtTopLevelCode = null;

  // the threshold for the maximum allowed levenshtein distance
  // used in misspelling detection
  const EDIT_DIST_THRESHOLD = 2;

  // to enable or disable styling (color, font-size, etc. ) for fes messages
  const ENABLE_FES_STYLING = false;

  // Used for internally thrown errors that should not get wrapped by another
  // friendly error handler
  class FESError extends Error { };

  lifecycles.presetup = function () {
    // let doFriendlyWelcome = false; // TEMP until we get it all working LM
    // if(doFriendlyWelcome){
    //   // p5.js brand - magenta: #ED225D
    //   //const astrixBgColor = 'transparent';
    //   //const astrixTxtColor = '#ED225D';
    //   //const welcomeBgColor = '#ED225D';
    //   //const welcomeTextColor = 'white';
    //   const welcomeMessage = translator('fes.pre', {
    //     message: translator('fes.welcome')
    //   });
    //   console.log(
    //     '    _ \n' +
    //       ' /\\| |/\\ \n' +
    //       " \\ ` ' /  \n" +
    //       ' / , . \\  \n' +
    //       ' \\/|_|\\/ ' +
    //       '\n\n' +
    //       welcomeMessage
    //   );
    // }
  };

  if (typeof IS_MINIFIED !== 'undefined') {
    p5._friendlyError =
      p5._checkForUserDefinedFunctions =
      p5._fesErrorMonitor =
      () => {};
  } else {
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
        if(funcName.startsWith('p5.')){
          msgWithReference = `${message} (https://p5js.org/reference/${referenceSection}.${funcName})`;
        }else{
          msgWithReference = `${message} (https://p5js.org/reference/${referenceSection}/${funcName})`;
        }
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
      if ('undefined' === getType(color)) {
        color = '#B40033'; // dark magenta
      } else if (getType(color) === 'number') {
        // Type to color
        color = typeColors[color];
      }

      // Add a link to the reference docs of func at the end of the message
      message = mapToReference(message, func);
      // let style = [`color: ${color}`, 'font-family: Arial', 'font-size: larger'];
      FES.log(message);
      // if (ENABLE_FES_STYLING) {
      //   console.log('%c' + prefixedMsg, style.join(';'));
      // } else {
      //   console.log(prefixedMsg);
      // }
    };

    /**
     * Throws an error with helpful p5 context. Similar to _report, but
     * this will stop other code execution to prevent downstream errors
     * from being logged.
     *
     * @method _error
     * @private
     * @param                    context  p5 instance the error is from
     * @param  {String}          message  Message to be printed
     * @param  {String}          [func]   Name of function
     */
    p5._error = (context, message, func) => {
      p5._report(message, func);
      context.hitCriticalError = true;
      // Throw an error to stop the current function (e.g. setup or draw) from
      // running more code
      throw new FESError('Stopping sketch to prevent more errors');
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
      // if (p5.disableFriendlyErrors) return;
      p5._report(message, func, color);
    };

    /**
     * Whether or not p5.js is running in an environment where `preload` will be
     * run before `setup`.
     *
     * This will return false for default builds >= 2.0, but backwards compatibility
     * addons may set this to true.
     *
     * @private
     */
    p5.isPreloadSupported = function() {
      return false;
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

      if (context.preload && !p5.isPreloadSupported()) {
        p5._error(
          context,
          TL.tl`The preload() function has been removed in p5.js 2.0. Please load assets in setup() using async / await keywords or callbacks instead. See https://github.com/processing/p5.js-compatibility for more information about 2.0 and compatibility, or https://dev.to/limzykenneth/asynchronous-p5js-20-458f for more information about promises and async/await.`
        );
      }

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
          fxns.hasOwnProperty(lowercase) &&
          !context[fxns[lowercase]] &&
          typeof context[prop] === 'function'
        ) {
          const msg = TL.tl`It seems that you may have accidentally written ${prop} instead of ${fxns[lowercase]}. Please correct it if it's not intentional.`;

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
        const parsed = getErrorStackParser().parse(error);
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
          // To be used when there is only one closest match
          msg = TL.tl`${locationObj ? TL.tl`[${locationObj.file}, line ${locationObj.line}]` : ''} It seems that you may have accidentally written "${errSym}"" instead of "${matchedSymbols[0].name}". Please correct it to ${matchedSymbols[0].name} if you wish to use the ${matchedSymbols[0].type} from p5.js.`;
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
          msg = TL.tl`${locationObj ? TL.tl`[${locationObj.file}, line ${locationObj.line}]` : ''} It seems that you may have accidentally written "${errSym}".\nYou may have meant one of the following: \n${suggestions}`;
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
      if (friendlyStack.length > 1) {
        let stacktraceMsg = '';
        friendlyStack.forEach((frame, idx) => {
          const location = `${frame.fileName}:${frame.lineNumber}:${
            frame.columnNumber
          }`;
          if (idx === 0) {
            frameMsg = TL.tl`┌[${location}] \n\t Error at line ${frame.lineNumber} in ${frame.functionName}()\n`;
          } else {
            frameMsg = TL.tl`└[${location}] \n\t Called from line ${frame.lineNumber} in ${frame.functionName}()\n`;
          }
          stacktraceMsg += frameMsg;
        });
        console.log(stacktraceMsg);
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
        const testStacktrace = getErrorStackParser().parse(testError);
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
          fn._preloadMethods[func] == null
        ) {
          // TODO: we don't need this anymore
          const message = TL.tl`${locationObj ? TL.tl`[${locationObj.file}, line ${locationObj.line}]` : ''} An error with message "${error.message}" occurred inside the p5.js library when "${func}" was called. If not stated otherwise, it might be due to "${func}" being called from preload. Nothing besides load calls (loadImage, loadJSON, loadFont, loadStrings, etc.) should be inside the preload function.`;
          p5._friendlyError(
            message,
            'preload'
          );
        } else {
          // Library error
          const message = TL.tl`${locationObj ? TL.tl`[${locationObj.file}, line ${locationObj.line}]` : ''} An error with message "${error.message}" occurred inside the p5js library when ${func} was called. If not stated otherwise, it might be an issue with the arguments passed to ${func}.`;
          p5._friendlyError(
            message,
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

      // Don't try to handle an error intentionally emitted by FES to halt execution
      if (e && (e instanceof FESError || e.reason instanceof FESError)) return;

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

      let stacktrace = getErrorStackParser().parse(error);
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
      // let locationObj;
      let locationStr = '';
      if (
        stacktrace &&
        stacktrace[0].fileName &&
        stacktrace[0].lineNumber &&
        stacktrace[0].columnNumber
      ) {
        locationStr = TL.tl`[${stacktrace[0].fileName.split('/').slice(-1)}, line ${friendlyStack[0].lineNumber}]`;
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
                TL.tl`\nSyntax Error - Found a symbol that JavaScript doesn't recognize or didn't expect at it's place.\n\n+ More info: ${url}`
              );
              break;
            }
            case 'UNEXPECTEDTOKEN': {
              //Error if a specific language construct(, { ; etc) was expected, but something else was provided
              //for (let i = 0; i < 5,; ++i) -> a comma after i<5 instead of a semicolon
              let url =
                'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Errors/Unexpected_token#What_went_wrong';
              p5._friendlyError(
                TL.tl`\nSyntax Error - Symbol present at a place that wasn't expected.\nUsually this is due to a typo. Check the line number in the error for anything missing/extra.\n\n+ More info: ${url}`
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
                TL.tl`\nSyntax Error - "${errSym}" is being redeclared. JavaScript doesn't allow declaring a variable more than once. Check the line number in error for redeclaration of the variable.\n\n+ More info: ${url}`
              );
              break;
            }
            case 'MISSINGINITIALIZER': {
              //Error if a const variable is not initialized during declaration
              //Example => const a;
              let url =
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Missing_initializer_in_const#what_went_wrong';
              p5._friendlyError(
                TL.tl`\nSyntax Error - A const variable is declared but not initialized. In JavaScript, an initializer for a const is required. A value must be specified in the same statement in which the variable is declared. Check the line number in the error and assign the const variable a value.\n\n+ More info: ${url}`
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
                TL.tl`\nSyntax Error - return lies outside of a function. Make sure you’re not missing any brackets, so that return lies inside a function.\n\n+ More info: ${url}`
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
                TL.tl`\n${locationStr} "${errSym}" is not defined in the current scope. If you have defined it in your code, you should check its scope, spelling, and letter-casing (JavaScript is case-sensitive).\n\n+ More info: ${url}`
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
                TL.tl`\n${locationStr} "${errSym} is used before declaration. Make sure you have declared the variable before using it.\n\n+ More info: ${url}`
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
                // url,
                symbol: splitSym[splitSym.length - 1],
                obj: splitSym.slice(0, splitSym.length - 1).join('.')
              };

              // There are two cases to handle here. When the function is called
              // as a property of an object and when it's called independently.
              // Both have different explanations.
              if (splitSym.length > 1) {
                p5._friendlyError(
                  TL.tl`\n${locationStr} "${translationObj.symbol}" could not be called as a function.\nVerify whether "${translationObj.obj}" has "${translationObj.symbol}" in it and check the spelling, letter-casing (JavaScript is case-sensitive) and its type.\n\n+ More info: ${url}`
                );
              } else {
                p5._friendlyError(
                  TL.tl`\n${locationStr} "${translationObj.symbol}" could not be called as a function.\nCheck the spelling, letter-casing (JavaScript is case-sensitive) and its type.\n\n+ More info: ${url}`
                );
              }

              if (friendlyStack) printFriendlyStack(friendlyStack);
              break;
            }
            case 'READNULL': {
              //Error if a property of null is accessed
              //let a = null;
              //console.log(a.property); -> a is null
              let url =
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property#what_went_wrong';
              p5._friendlyError(
                TL.tl`\n${locationStr} The property of null can't be read. In javascript the value null indicates that an object has no value.\n\n+ More info: ${url}`
              );

              if (friendlyStack) printFriendlyStack(friendlyStack);
              break;
            }
            case 'READUDEFINED': {
              //Error if a property of undefined is accessed
              //let a; -> default value of a is undefined
              //console.log(a.property); -> a is undefined
              let url =
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_property#what_went_wrong';
              p5._friendlyError(
                TL.tl`\n${locationStr} Cannot read property of undefined. Check the line number in error and make sure the variable which is being operated is not undefined.\n\n + More info: ${url}`
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
                TL.tl`\n${locationStr} A const variable is being re-assigned. In javascript, re-assigning a value to a constant is not allowed. If you want to re-assign new values to a variable, make sure it is declared as var or let.\n\n+ More info: ${url}`
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
    p5._fesLogCache = {};

    window.addEventListener('load', checkForUserDefinedFunctions, false);
    window.addEventListener('error', p5._fesErrorMonitor, false);
    window.addEventListener('unhandledrejection', p5._fesErrorMonitor, false);
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

    misusedAtTopLevelCode = getSymbols(fn);

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
  const helpForMisusedAtTopLevelCode = () => {
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
        FES.log(
          TL.tl`Did you just try to use p5.js's ${symbolName} ${
            symbol.type
          }? If so, you may want to move it into your sketch's setup() function.\n\nFor more details, see: ${FAQ_URL}`
        );
        return true;
      }
    });
  };

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
}

export default fesCore;

if (typeof p5 !== 'undefined') {
  p5.registerAddon(fesCore);
}

/**
 * Measures dissimilarity between two strings by calculating
 * the Levenshtein distance.
 *
 * If the "distance" between them is small enough, it is
 * reasonable to think that one is the misspelled version of the other.
 *
 * Specifically, this uses the Wagner–Fischer algorithm.
 *
 * @method computeEditDistance
 * @private
 * @param {String} w1 the first word
 * @param {String} w2 the second word
 *
 * @returns {Number} the "distance" between the two words, a smaller value
 *                   indicates that the words are similar
 */
function computeEditDistance(w1, w2) {
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
