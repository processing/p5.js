import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

/**
 * @for p5
 * @requires core
 */
function sketchVerifier(p5, fn) {
  /**
   * Fetches the contents of a script element in the user's sketch.
   * 
   * @method fetchScript
   * @param {HTMLScriptElement} script
   * @returns {Promise<string>}
   */
  fn.fetchScript = async function (script) {
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
  }

  /**
   * Extracts the user's code from the script fetched. Note that this method
   * assumes that the user's code is always the last script element in the
   * sketch.
   * 
   * @method getUserCode
   * @returns {Promise<string>} The user's code as a string.
   */
  fn.getUserCode = async function () {
    // TODO: think of a more robust way to get the user's code. Refer to
    // https://github.com/processing/p5.js/pull/7293.
    const scripts = document.querySelectorAll('script');
    const userCodeScript = scripts[scripts.length - 1];
    const userCode = await fn.fetchScript(userCodeScript);

    return userCode;
  }

  /**
   * Extracts the user-defined variables and functions from the user code with
   * the help of Espree parser.
   * 
   * @method extractUserDefinedVariablesAndFuncs
   * @param {string} code - The code to extract variables and functions from.
   * @returns {Object} An object containing the user's defined variables and functions.
   * @returns {Array<{name: string, line: number}>} [userDefinitions.variables] Array of user-defined variable names and their line numbers.
   * @returns {Array<{name: string, line: number}>} [userDefinitions.functions] Array of user-defined function names and their line numbers.
   */
  fn.extractUserDefinedVariablesAndFuncs = function (code) {
    const userDefinitions = {
      variables: [],
      functions: []
    };
    // The line numbers from the parser are consistently off by one, add
    // `lineOffset` here to correct them.
    const lineOffset = -1;

    try {
      const ast = acorn.parse(code, {
        ecmaVersion: 2021,
        sourceType: 'module',
        locations: true  // This helps us get the line number.
      });

      walk.simple(ast, {
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
  }

  fn.run = async function () {
    const userCode = await fn.getUserCode();
    const userDefinedVariablesAndFuncs = fn.extractUserDefinedVariablesAndFuncs(userCode);

    return userDefinedVariablesAndFuncs;
  }
}

export default sketchVerifier;

if (typeof p5 !== 'undefined') {
  sketchVerifier(p5, p5.prototype);
}