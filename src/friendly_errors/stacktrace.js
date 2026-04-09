/**
 * @for p5
 * @requires core
 */
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

// wrapper exposing ErrorStackParser
function stacktrace(p5, fn){
  p5._getErrorStackParser = function getErrorStackParser() {
    return new ErrorStackParser();
  };
}

export default stacktrace;

if (typeof p5 !== 'undefined') {
  stacktrace(p5, p5.prototype);
}
