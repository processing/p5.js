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
        switch (node.type) {
          case 'VariableDeclaration':
            node.declarations.forEach(declaration => {
              if (declaration.id.type === 'Identifier') {
                userDefinitions.variables.push(declaration.id.name);
              }
            });
            break;
          case 'FunctionDeclaration':
            if (node.id && node.id.type === 'Identifier') {
              userDefinitions.functions.push(node.id.name);
            }
            break;
          case 'ArrowFunctionExpression':
          case 'FunctionExpression':
            if (node.parent && node.parent.type === 'VariableDeclarator') {
              userDefinitions.functions.push(node.parent.id.name);
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
      console.error('Error parsing code:', error);
    }

    return userDefinitions;
  }

  fn.run = async function () {
    const userCode = await fn.getUserCode();
    const userDefinedVariablesAndFuncs = fn.extractUserDefinedVariablesAndFuncs(userCode);
    console.log(userDefinedVariablesAndFuncs);
  }
}

export default sketchVerifier;

if (typeof p5 !== 'undefined') {
  sketchVerifier(p5, p5.prototype);
}