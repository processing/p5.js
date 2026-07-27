/**
 * @for p5
 */
import { FES } from './fes';
import { entryPoints } from './browser_errors';

// Borrow from stacktracejs https://github.com/stacktracejs/stacktrace.js with
// minor modifications. The license for the same and the code is included below

// Copyright (c) 2017 Eric Wendelin and other contributors
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
function ErrorStackParser() {
  let FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
  let CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
  let SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

  return {
    /**
     * Given an Error object, extract the most information from it.
     * @private
     * @param {Error} error object
     * @return {Array} of stack frames
     */
    parse: function ErrorStackParser$$parse(error) {
      if (
        typeof error.stacktrace !== 'undefined' ||
        typeof error['opera#sourceloc'] !== 'undefined'
      ) {
        return this.parseOpera(error);
      } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
        return this.parseV8OrIE(error);
      } else if (error.stack) {
        return this.parseFFOrSafari(error);
      } else {
        // throw new Error('Cannot parse given Error object');
      }
    },

    // Separate line and column numbers from a string of the form: (URI:Line:Column)
    extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
      // Fail-fast but return locations like "(native)"
      if (urlLike.indexOf(':') === -1) {
        return [urlLike];
      }

      let regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
      let parts = regExp.exec(urlLike.replace(/[()]/g, ''));
      return [parts[1], parts[2] || undefined, parts[3] || undefined];
    },

    parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
      let filtered = error.stack.split('\n').filter(function(line) {
        return !!line.match(CHROME_IE_STACK_REGEXP);
      }, this);

      return filtered.map(function(line) {
        if (line.indexOf('(eval ') > -1) {
          // Throw away eval information until we implement stacktrace.js/stackframe#8
          line = line
            .replace(/eval code/g, 'eval')
            .replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
        }
        let sanitizedLine = line
          .replace(/^\s+/, '')
          .replace(/\(eval code/g, '(');

        // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
        // case it has spaces in it, as the string is split on \s+ later on
        let location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);

        // remove the parenthesized location from the line, if it was matched
        sanitizedLine = location
          ? sanitizedLine.replace(location[0], '')
          : sanitizedLine;

        let tokens = sanitizedLine.split(/\s+/).slice(1);
        // if a location was matched, pass it to extractLocation() otherwise pop the last token
        let locationParts = this.extractLocation(
          location ? location[1] : tokens.pop()
        );
        let functionName = tokens.join(' ') || undefined;
        let fileName =
          ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1
            ? undefined
            : locationParts[0];

        return {
          functionName,
          fileName,
          lineNumber: locationParts[1],
          columnNumber: locationParts[2],
          source: line
        };
      }, this);
    },

    parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
      let filtered = error.stack.split('\n').filter(function(line) {
        return !line.match(SAFARI_NATIVE_CODE_REGEXP);
      }, this);

      return filtered.map(function(line) {
        // Throw away eval information until we implement stacktrace.js/stackframe#8
        if (line.indexOf(' > eval') > -1) {
          line = line.replace(
            / line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,
            ':$1'
          );
        }

        if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
          // Safari eval frames only have function names and nothing else
          return {
            functionName: line
          };
        } else {
          let functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
          let matches = line.match(functionNameRegex);
          let functionName = matches && matches[1] ? matches[1] : undefined;
          let locationParts = this.extractLocation(
            line.replace(functionNameRegex, '')
          );

          return {
            functionName,
            fileName: locationParts[0],
            lineNumber: locationParts[1],
            columnNumber: locationParts[2],
            source: line
          };
        }
      }, this);
    },

    parseOpera: function ErrorStackParser$$parseOpera(e) {
      if (
        !e.stacktrace ||
        (e.message.indexOf('\n') > -1 &&
          e.message.split('\n').length > e.stacktrace.split('\n').length)
      ) {
        return this.parseOpera9(e);
      } else if (!e.stack) {
        return this.parseOpera10(e);
      } else {
        return this.parseOpera11(e);
      }
    },

    parseOpera9: function ErrorStackParser$$parseOpera9(e) {
      let lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
      let lines = e.message.split('\n');
      let result = [];

      for (let i = 2, len = lines.length; i < len; i += 2) {
        let match = lineRE.exec(lines[i]);
        if (match) {
          result.push({
            fileName: match[2],
            lineNumber: match[1],
            source: lines[i]
          });
        }
      }

      return result;
    },

    parseOpera10: function ErrorStackParser$$parseOpera10(e) {
      let lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
      let lines = e.stacktrace.split('\n');
      let result = [];

      for (let i = 0, len = lines.length; i < len; i += 2) {
        let match = lineRE.exec(lines[i]);
        if (match) {
          result.push({
            functionName: match[3] || undefined,
            fileName: match[2],
            lineNumber: match[1],
            source: lines[i]
          });
        }
      }

      return result;
    },

    // Opera 10.65+ Error.stack very similar to FF/Safari
    parseOpera11: function ErrorStackParser$$parseOpera11(error) {
      let filtered = error.stack.split('\n').filter(function(line) {
        return (
          !!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
          !line.match(/^Error created at/)
        );
      }, this);

      return filtered.map(function(line) {
        let tokens = line.split('@');
        let locationParts = this.extractLocation(tokens.pop());
        let functionCall = tokens.shift() || '';
        let functionName =
          functionCall
            .replace(/<anonymous function(: (\w+))?>/, '$2')
            .replace(/\([^)]*\)/g, '') || undefined;
        let argsRaw;
        if (functionCall.match(/\(([^)]*)\)/)) {
          argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
        }
        let args =
          argsRaw === undefined || argsRaw === '[arguments not available]'
            ? undefined
            : argsRaw.split(',');

        return {
          functionName,
          args,
          fileName: locationParts[0],
          lineNumber: locationParts[1],
          columnNumber: locationParts[2],
          source: line
        };
      }, this);
    }
  };
}

// End borrow

export const errorStackParser = new ErrorStackParser();

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
export const processStack = (error, stacktrace) => {
  // cannot process a stacktrace that doesn't exist
  if (!stacktrace) return [false, null];

  stacktrace.forEach(frame => {
    frame.functionName = frame.functionName || '';
  });

  // isInternal - Did this error happen inside the library
  let isInternal = false;
  let p5FileName, friendlyStack;

  // Intentionally throw an error that we catch so that we can check the name
  // of the current file. Any errors we see from this file, we treat as
  // internal errors.
  const testStacktrace = errorStackParser.parse(Error());
  p5FileName = testStacktrace[0].fileName;

  for (let i = stacktrace.length - 1; i >= 0; i--) {
    let splitted = stacktrace[i].functionName.split('.');
    if (entryPoints.includes(splitted[splitted.length - 1])) {
      // remove everything below an entry point function (setup, draw, etc).
      // (it's usually the internal initialization calls)
      friendlyStack = stacktrace.slice(0, i + 1);
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

    // Library error
    // const message = TL.tl`${locationObj ? TL.tl`[${locationObj.file}, line ${locationObj.line}]` : ''} An error with message "${error.message}" occurred inside the p5js library when ${func} was called. If not stated otherwise, it might be an issue with the arguments passed to ${func}.`;
    // p5._friendlyError(
    //   message,
    //   func
    // );

    // Finally, if it's an internal error, print the friendlyStack
    // ( fesErrorMonitor won't handle this error )
    // if (friendlyStack && friendlyStack.length) {
    //   printFriendlyStack(friendlyStack);
    // }
  }
  return [isInternal, friendlyStack];
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
export function printFriendlyStack(friendlyStack) {
  if (friendlyStack.length > 1) {
    let stacktraceMsg = '';
    friendlyStack.forEach((frame, idx) => {
      const location = `${frame.fileName}:${frame.lineNumber}:${
        frame.columnNumber
      }`;
      let frameMsg;
      if (idx === 0) {
        frameMsg = FES.log`┌[${location}] \n\t Error at line ${frame.lineNumber} in ${frame.functionName}()\n`;
      } else {
        frameMsg = FES.log`└[${location}] \n\t Called from line ${frame.lineNumber} in ${frame.functionName}()\n`;
      }
      stacktraceMsg += frameMsg;
    });
    FES.log`${stacktraceMsg}`({
      prefix: false
    });
  }
};

export function getFriendlyStack(stacktrace, compact = false) {
  if (compact) {
    return `[${stacktrace[0].fileName.split('/').slice(-1)}, line ${stacktrace[0].lineNumber}]`;
  } else {
    if (stacktrace.length > 1) {
      let stacktraceMsg = '';
      stacktrace.forEach((frame, idx) => {
        const location = `${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`;
        let frameMsg;
        // TODO: translate
        if (idx === 0) {
          frameMsg = `┌[${location}] \n\t Error at line ${frame.lineNumber} in ${frame.functionName}()\n`;
        } else {
          frameMsg = `└[${location}] \n\t Called from line ${frame.lineNumber} in ${frame.functionName}()\n`;
        }
        stacktraceMsg += frameMsg;
      });

      return stacktraceMsg || null;
    }
  }
}
