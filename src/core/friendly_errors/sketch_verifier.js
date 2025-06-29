import { parse } from 'acorn';
import { simple as walk } from 'acorn-walk';
import * as constants from '../constants';

// List of functions to ignore as they either are meant to be re-defined or
// generate false positive outputs.
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
  // 'name',
  // 'parent',
  // 'toString',
  // 'print',
  // 'stop',
  // 'onended'
];

export const verifierUtils = {

  /**
   * Fetches the contents of a script element in the user's sketch.
   *
   * @private
   * @method fetchScript
   * @param {HTMLScriptElement} script
   * @returns {Promise<string>}
 */
  fetchScript: async function (script) {
    if (script.src) {
      try {
        const contents = await fetch(script.src).then((res) => res.text());
        return contents;
      } catch (error) {
        // TODO: Handle CORS error here.
        console.error('Error fetching script:', error);
        return '';
      }
    } else {
      return script.textContent;
    }
  },

  /**
   * Extracts the user-defined variables and functions from the user code with
   * the help of Espree parser.
   *
   * @private
   * @method extractUserDefinedVariablesAndFuncs
   * @param {String} code - The code to extract variables and functions from.
   * @returns {Object} An object containing the user's defined variables and functions.
   * @returns {Array<{name: string, line: number}>} [userDefinitions.variables] Array of user-defined variable names and their line numbers.
   * @returns {Array<{name: string, line: number}>} [userDefinitions.functions] Array of user-defined function names and their line numbers.
   */
  extractUserDefinedVariablesAndFuncs: function (code) {
    const userDefinitions = {
      variables: [],
      functions: []
    };
    // The line numbers from the parser are consistently off by one, add
    // `lineOffset` here to correct them.
    const lineOffset = -1;

    try {
      const ast = parse(code, {
        ecmaVersion: 2021,
        sourceType: 'module',
        locations: true  // This helps us get the line number.
      });

      walk(ast, {
        VariableDeclarator(node) {
          if (node.id.type === 'Identifier') {
            const category = node.init && ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init.type)
              ? 'functions'
              : 'variables';
            userDefinitions[category].push({
              name: node.id.name,
              line: node.loc.start.line + lineOffset
            });
          }
        },
        FunctionDeclaration(node) {
          if (node.id && node.id.type === 'Identifier') {
            userDefinitions.functions.push({
              name: node.id.name,
              line: node.loc.start.line + lineOffset
            });
          }
        },
        // We consider class declarations to be a special form of variable
        // declaration.
        ClassDeclaration(node) {
          if (node.id && node.id.type === 'Identifier') {
            userDefinitions.variables.push({
              name: node.id.name,
              line: node.loc.start.line + lineOffset
            });
          }
        }
      });
    } catch (error) {
      // TODO: Replace this with a friendly error message.
      console.error('Error parsing code:', error);
    }

    return userDefinitions;
  },

  /**
   * Checks user-defined variables and functions for conflicts with p5.js
   * constants and global functions.
   *
   * This function performs two main checks:
   * 1. Verifies if any user definition conflicts with p5.js constants.
   * 2. Checks if any user definition conflicts with global functions from
   * p5.js renderer classes.
   *
   * If a conflict is found, it reports a friendly error message and halts
   * further checking.
   *
   * @private
   * @param {Object} userDefinitions - An object containing user-defined variables and functions.
   * @param {Array<{name: string, line: number}>} userDefinitions.variables - Array of user-defined variable names and their line numbers.
   * @param {Array<{name: string, line: number}>} userDefinitions.functions - Array of user-defined function names and their line numbers.
   * @returns {boolean} - Returns true if a conflict is found, false otherwise.
   */
  checkForConstsAndFuncs: function (userDefinitions, p5) {
    const allDefinitions = [
      ...userDefinitions.variables,
      ...userDefinitions.functions
    ];

    // Helper function that generates a friendly error message that contains
    // the type of redefinition (constant or function), the name of the
    // redefinition, the line number in user's code, and a link to its
    // reference on the p5.js website.
    function generateFriendlyError(errorType, name, line) {
      const url = `https://p5js.org/reference/p5/${name}`;
      const message = `${errorType} "${name}" on line ${line} is being redeclared and conflicts with a p5.js ${errorType.toLowerCase()}. p5.js reference: ${url}`;
      return message;
    }

    // Checks for constant redefinitions.
    for (let { name, line } of allDefinitions) {
      const libDefinition = constants[name];
      if (libDefinition !== undefined) {
        const message = generateFriendlyError('Constant', name, line);
        console.log(message);
        return true;
      }
    }

    // The new rules for attaching anything to global are (if true for both of
    // the following):
    //   - It is a member of p5.prototype
    //   - Its name does not start with `_`
    const globalFunctions = new Set(
      Object.getOwnPropertyNames(p5.prototype)
        .filter(key => !key.startsWith('_') && key !== 'constructor')
    );

    for (let { name, line } of allDefinitions) {
      if (!ignoreFunction.includes(name) && globalFunctions.has(name)) {
        const message = generateFriendlyError('Function', name, line);
        console.log(message);
        return true;
      }
    }

    return false;
  },

  /**
   * Extracts the user's code from the script fetched. Note that this method
   * assumes that the user's code is always the last script element in the
   * sketch.
   *
   * @private
   * @method getUserCode
   * @returns {Promise<string>} The user's code as a string.
   */
  getUserCode: async function () {
    // TODO: think of a more robust way to get the user's code. Refer to
    // https://github.com/processing/p5.js/pull/7293.
    const scripts = document.querySelectorAll('script');
    const userCodeScript = scripts[scripts.length - 1];
    const userCode = await verifierUtils.fetchScript(userCodeScript);

    return userCode;
  },

  /**
   * @private
   */
  runFES: async function (p5) {
    const userCode = await verifierUtils.getUserCode();
    const userDefinedVariablesAndFuncs = verifierUtils.extractUserDefinedVariablesAndFuncs(userCode);

    verifierUtils.checkForConstsAndFuncs(userDefinedVariablesAndFuncs, p5);
  }
};

function sketchVerifier(p5, _fn, lifecycles) {
  lifecycles.presetup = async function() {
    if (!p5.disableFriendlyErrors) {
      verifierUtils.runFES(p5);
    }
  };
}

export default sketchVerifier;

if (typeof p5 !== 'undefined') {
  sketchVerifier(p5, p5.prototype);
}
