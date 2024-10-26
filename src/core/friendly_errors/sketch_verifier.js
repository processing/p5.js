import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as constants from '../constants';

/**
 * @for p5
 * @requires core
 */
function sketchVerifier(p5, fn) {
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
    'name',
    'parent',
    'toString',
    'print',
    'stop',
    'onended'
  ];

  // Mapping names of p5 types to their constructor functions.
  // p5Constructors:
  //   - Color: f()
  //   - Graphics: f()
  //   - Vector: f()
  // and so on.
  const p5Constructors = {};

  fn.loadP5Constructors = function () {
    // Make a list of all p5 classes to be used for argument validation
    // This must be done only when everything has loaded otherwise we get
    // an empty array
    for (let key of Object.keys(p5)) {
      // Get a list of all constructors in p5. They are functions whose names
      // start with a capital letter
      if (typeof p5[key] === 'function' && key[0] !== key[0].toLowerCase()) {
        p5Constructors[key] = p5[key];
      }
    }
  }

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
   * @param {Object} userDefinitions - An object containing user-defined variables and functions.
   * @param {Array<{name: string, line: number}>} userDefinitions.variables - Array of user-defined variable names and their line numbers.
   * @param {Array<{name: string, line: number}>} userDefinitions.functions - Array of user-defined function names and their line numbers.
   * @returns {boolean} - Returns true if a conflict is found, false otherwise.
   */
  fn.checkForConstsAndFuncs = function (userDefinitions) {
    const allDefinitions = [
      ...userDefinitions.variables,
      ...userDefinitions.functions
    ];

    // Helper function that generates a friendly error message that contains
    // the type of redefinition (constant or function), the name of the
    // redefinition, the line number in user's code, and a link to its
    // reference on the p5.js website.
    function generateFriendlyError(errorType, name, line) {
      const url = `https://p5js.org/reference/#/p5/${name}`;
      const message = `${errorType} "${name}" on line ${line} is being redeclared and conflicts with a p5.js ${errorType.toLowerCase()}. JavaScript does not declaring a ${errorType.toLowerCase()} more than once. p5.js reference: ${url}.`;
      return message;
    }

    // Helper function that checks if a user definition has already been defined
    // in the p5.js library, either as a constant or as a function.
    function checkForRedefinition(name, libValue, line, type) {
      try {
        const userValue = eval("name");
        if (libValue !== userValue) {
          let message = generateFriendlyError(type, name, line);
          console.log(message);
          return true;
        }
      } catch (e) {
        // If eval fails, the function hasn't been redefined
        return false;
      }
      return false;
    }

    // Checks for constant redefinitions.
    for (let { name, line } of allDefinitions) {
      const libDefinition = constants[name];
      if (libDefinition !== undefined) {
        if (checkForRedefinition(name, libDefinition, line, "Constant")) {
          return true;
        }
      }
    }

    // Get the names of all p5.js functions which are available globally
    const classesWithGlobalFns = ['Renderer', 'Renderer2D', 'RendererGL'];
    const globalFunctions = new Set(
      classesWithGlobalFns.flatMap(className =>
        Object.keys(p5Constructors[className]?.prototype || {})
      )
    );

    for (let { name, line } of allDefinitions) {
      if (!ignoreFunction.includes(name) && globalFunctions.has(name)) {
        for (let className of classesWithGlobalFns) {
          const prototypeFunc = p5Constructors[className]?.prototype[name];
          if (prototypeFunc && checkForRedefinition(name, prototypeFunc, line, "Function")) {
            return true;
          }
        }
      }
    }

    // Additional check for other p5 constructors
    const otherP5ConstructorKeys = Object.keys(p5Constructors).filter(
      key => !classesWithGlobalFns.includes(key)
    );
    for (let { name, line } of allDefinitions) {
      for (let key of otherP5ConstructorKeys) {
        if (p5Constructors[key].prototype[name] !== undefined) {
          const prototypeFunc = p5Constructors[key].prototype[name];
          if (prototypeFunc && checkForRedefinition(name, prototypeFunc, line, "Function")) {
            return true;
          }
        }
      }
    }

    return false;
  }

  fn.run = async function () {
    const userCode = await fn.getUserCode();
    const userDefinedVariablesAndFuncs = fn.extractUserDefinedVariablesAndFuncs(userCode);

    if (fn.checkForConstsAndFuncs(userDefinedVariablesAndFuncs)) {
      return;
    }
  }
}

export default sketchVerifier;

if (typeof p5 !== 'undefined') {
  sketchVerifier(p5, p5.prototype);
  p5.prototype.loadP5Constructors();
}