import * as espree from 'espree';

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
      const contents = await fetch(script.src).then((res) => res.text());
      return contents;
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
   * @param {string} codeStr - The code to extract variables and functions from.
   * @returns {Object} An object containing the user's defined variables and functions.
   * @returns {string[]} [userDefinitions.variables] Array of user-defined variable names.
   * @returns {strings[]} [userDefinitions.functions] Array of user-defined function names.
   */
  fn.extractUserDefinedVariablesAndFuncs = function (codeStr) {
    const userDefinitions = {
      variables: [],
      functions: []
    };

    try {
      const ast = espree.parse(codeStr, {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      });

      function traverse(node) {
        const { type, declarations, id, init } = node;

        switch (type) {
          case 'VariableDeclaration':
            declarations.forEach(({ id, init }) => {
              if (id.type === 'Identifier') {
                const category = init && ['ArrowFunctionExpression', 'FunctionExpression'].includes(init.type)
                  ? 'functions'
                  : 'variables';
                userDefinitions[category].push(id.name);
              }
            });
            break;
          case 'FunctionDeclaration':
            if (id?.type === 'Identifier') {
              userDefinitions.functions.push(id.name);
            }
            break;
        }

        for (const key in node) {
          if (node[key] && typeof node[key] === 'object') {
            if (Array.isArray(node[key])) {
              node[key].forEach(child => traverse(child));
            } else {
              traverse(node[key]);
            }
          }
        }
      }

      traverse(ast);
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