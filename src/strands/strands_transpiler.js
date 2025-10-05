import { parse } from 'acorn';
import { ancestor, recursive } from 'acorn-walk';
import escodegen from 'escodegen';
import { UnarySymbolToName } from './ir_types';
let blockVarCounter = 0;
function replaceBinaryOperator(codeSource) {
  switch (codeSource) {
    case '+': return 'add';
    case '-': return 'sub';
    case '*': return 'mult';
    case '/': return 'div';
    case '%': return 'mod';
    case '==':
    case '===': return 'equalTo';
    case '!=':
    case '!==': return 'notEqual';
    case '>': return 'greaterThan';
    case '>=': return 'greaterEqual';
    case '<': return 'lessThan';
    case '<=': return 'lessEqual';
    case '&&': return 'and';
    case '||': return 'or';
    // TODO: handle ** --> pow, but make it stay pow in
    // GLSL instead of turning it back into **
  }
}
function nodeIsUniform(ancestor) {
  return ancestor.type === 'CallExpression'
    && (
      (
        // Global mode
        ancestor.callee?.type === 'Identifier' &&
        ancestor.callee?.name.startsWith('uniform')
      ) || (
        // Instance mode
        ancestor.callee?.type === 'MemberExpression' &&
        ancestor.callee?.property.name.startsWith('uniform')
      )
    );
}
const ASTCallbacks = {
  UnaryExpression(node, _state, ancestors) {
    if (ancestors.some(nodeIsUniform)) { return; }
    const unaryFnName = UnarySymbolToName[node.operator];
    const standardReplacement = (node) => {
      node.type = 'CallExpression'
      node.callee = {
        type: 'Identifier',
        name: `__p5.${unaryFnName}`,
      }
      node.arguments = [node.argument]
    }
    if (node.type === 'MemberExpression') {
      const property = node.argument.property.name;
      const swizzleSets = [
        ['x', 'y', 'z', 'w'],
        ['r', 'g', 'b', 'a'],
        ['s', 't', 'p', 'q']
      ];
      let isSwizzle = swizzleSets.some(set =>
        [...property].every(char => set.includes(char))
      ) && node.argument.type === 'MemberExpression';
      if (isSwizzle) {
        node.type = 'MemberExpression';
        node.object = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: `__p5.${unaryFnName}`
          },
          arguments: [node.argument.object],
        };
        node.property = {
          type: 'Identifier',
          name: property
        };
      } else {
        standardReplacement(node);
      }
    } else {
      standardReplacement(node);
    }
    delete node.argument;
    delete node.operator;
  },
  BreakStatement(node, _state, ancestors) {
    if (ancestors.some(nodeIsUniform)) { return; }
    node.callee = {
      type: 'Identifier',
      name: '__p5.break'
    };
    node.arguments = [];
    node.type = 'CallExpression';
  },
  VariableDeclarator(node, _state, ancestors) {
    if (ancestors.some(nodeIsUniform)) { return; }
    if (nodeIsUniform(node.init)) {
      const uniformNameLiteral = {
        type: 'Literal',
        value: node.id.name
      }
      node.init.arguments.unshift(uniformNameLiteral);
    }
    if (node.init.callee && node.init.callee.name?.startsWith('varying')) {
      const varyingNameLiteral = {
        type: 'Literal',
        value: node.id.name
      }
      node.init.arguments.unshift(varyingNameLiteral);
      _state.varyings[node.id.name] = varyingNameLiteral;
    }
  },
  Identifier(node, _state, ancestors) {
    if (ancestors.some(nodeIsUniform)) { return; }
    if (_state.varyings[node.name]
      && !ancestors.some(a => a.type === 'AssignmentExpression' && a.left === node)) {
        node.type = 'ExpressionStatement';
        node.expression = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: node.name
            },
            property: {
              type: 'Identifier',
              name: 'getValue'
            },
          },
          arguments: [],
        }
      }
    },
    // The callbacks for AssignmentExpression and BinaryExpression handle
    // operator overloading including +=, *= assignment expressions
    ArrayExpression(node, _state, ancestors) {
      if (ancestors.some(nodeIsUniform)) { return; }
      const original = JSON.parse(JSON.stringify(node));
      node.type = 'CallExpression';
      node.callee = {
        type: 'Identifier',
        name: '__p5.strandsNode',
      };
      node.arguments = [original];
    },
    AssignmentExpression(node, _state, ancestors) {
      if (ancestors.some(nodeIsUniform)) { return; }
      if (node.operator !== '=') {
        const methodName = replaceBinaryOperator(node.operator.replace('=',''));
        const rightReplacementNode = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: node.left,
            property: {
              type: 'Identifier',
              name: methodName,
            },
          },
          arguments: [node.right]
        }
        node.operator = '=';
        node.right = rightReplacementNode;
      }
      if (_state.varyings[node.left.name]) {
        node.type = 'ExpressionStatement';
        node.expression = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: node.left.name
            },
            property: {
              type: 'Identifier',
              name: 'bridge',
            }
          },
          arguments: [node.right],
        }
      }
    },
    BinaryExpression(node, _state, ancestors) {
      // Don't convert uniform default values to node methods, as
      // they should be evaluated at runtime, not compiled.
      if (ancestors.some(nodeIsUniform)) { return; }
      // If the left hand side of an expression is one of these types,
      // we should construct a node from it.
      const unsafeTypes = ['Literal', 'ArrayExpression', 'Identifier'];
      if (unsafeTypes.includes(node.left.type)) {
        const leftReplacementNode = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: '__p5.strandsNode',
          },
          arguments: [node.left]
        }
        node.left = leftReplacementNode;
      }
      // Replace the binary operator with a call expression
      // in other words a call to BaseNode.mult(), .div() etc.
      node.type = 'CallExpression';
      node.callee = {
        type: 'MemberExpression',
        object: node.left,
        property: {
          type: 'Identifier',
          name: replaceBinaryOperator(node.operator),
        },
      };
      node.arguments = [node.right];
    },
    IfStatement(node, _state, ancestors) {
      if (ancestors.some(nodeIsUniform)) { return; }
      // Transform if statement into strandsIf() call
      // The condition is evaluated directly, not wrapped in a function
      const condition = node.test;
      // Create the then function
      const thenFunction = {
        type: 'ArrowFunctionExpression',
        params: [],
        body: node.consequent.type === 'BlockStatement' ? node.consequent : {
          type: 'BlockStatement',
          body: [node.consequent]
        }
      };
      // Start building the call chain: __p5.strandsIf(condition, then)
      let callExpression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: '__p5.strandsIf'
        },
        arguments: [condition, thenFunction]
      };
      // Always chain .Else() even if there's no explicit else clause
      // This ensures the conditional completes and returns phi nodes
      let elseFunction;
      if (node.alternate) {
        elseFunction = {
          type: 'ArrowFunctionExpression',
          params: [],
          body: node.alternate.type === 'BlockStatement' ? node.alternate : {
            type: 'BlockStatement',
            body: [node.alternate]
          }
        };
      } else {
        // Create an empty else function
        elseFunction = {
          type: 'ArrowFunctionExpression',
          params: [],
          body: {
            type: 'BlockStatement',
            body: []
          }
        };
      }
      callExpression = {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: callExpression,
          property: {
            type: 'Identifier',
            name: 'Else'
          }
        },
        arguments: [elseFunction]
      };
      // Analyze which outer scope variables are assigned in any branch
      const assignedVars = new Set();
      const analyzeBlock = (body) => {
        if (body.type !== 'BlockStatement') return;
        // First pass: collect variable declarations within this block
        const localVars = new Set();
        for (const stmt of body.body) {
          if (stmt.type === 'VariableDeclaration') {
            for (const decl of stmt.declarations) {
              if (decl.id.type === 'Identifier') {
                localVars.add(decl.id.name);
              }
            }
          }
        }
        // Second pass: find assignments to non-local variables
        for (const stmt of body.body) {
          if (stmt.type === 'ExpressionStatement' &&
              stmt.expression.type === 'AssignmentExpression') {
            const left = stmt.expression.left;
            if (left.type === 'Identifier') {
              // Direct variable assignment: x = value
              if (!localVars.has(left.name)) {
                assignedVars.add(left.name);
              }
            } else if (left.type === 'MemberExpression' &&
                       left.object.type === 'Identifier') {
              // Property assignment: obj.prop = value
              if (!localVars.has(left.object.name)) {
                assignedVars.add(left.object.name);
              }
            } else if (stmt.type === 'BlockStatement') {
              // Recursively analyze nested block statements
              analyzeBlock(stmt);
            }
          }
        }
      };
      // Analyze all branches for assignments to outer scope variables
      analyzeBlock(thenFunction.body);
      analyzeBlock(elseFunction.body);
      if (assignedVars.size > 0) {
        // Add copying, reference replacement, and return statements to branch functions
        const addCopyingAndReturn = (functionBody, varsToReturn) => {
          if (functionBody.type === 'BlockStatement') {
            // Create temporary variables and copy statements
            const tempVarMap = new Map(); // original name -> temp name
            const copyStatements = [];
            for (const varName of varsToReturn) {
              const tempName = `__copy_${varName}_${blockVarCounter++}`;
              tempVarMap.set(varName, tempName);
              // let tempName = originalVar.copy()
              copyStatements.push({
                type: 'VariableDeclaration',
                declarations: [{
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: tempName },
                  init: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: { type: 'Identifier', name: varName },
                      property: { type: 'Identifier', name: 'copy' },
                      computed: false
                    },
                    arguments: []
                  }
                }],
                kind: 'let'
              });
            }
            // Replace all references to original variables with temp variables
            // and wrap literal assignments in strandsNode calls
            const replaceReferences = (node) => {
              if (!node || typeof node !== 'object') return;
              if (node.type === 'Identifier' && tempVarMap.has(node.name)) {
                node.name = tempVarMap.get(node.name);
              } else if (node.type === 'MemberExpression' &&
                         node.object.type === 'Identifier' &&
                         tempVarMap.has(node.object.name)) {
                node.object.name = tempVarMap.get(node.object.name);
              }
              // Handle literal assignments to temp variables
              if (node.type === 'AssignmentExpression' &&
                  node.left.type === 'Identifier' &&
                  tempVarMap.has(node.left.name) &&
                  (node.right.type === 'Literal' || node.right.type === 'ArrayExpression')) {
                // Wrap the right hand side in a strandsNode call to make sure
                // it's not just a literal and has a type
                node.right = {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: '__p5.strandsNode'
                  },
                  arguments: [node.right]
                };
              }
              // Recursively process all properties
              for (const key in node) {
                if (node.hasOwnProperty(key) && key !== 'parent') {
                  if (Array.isArray(node[key])) {
                    node[key].forEach(replaceReferences);
                  } else if (typeof node[key] === 'object') {
                    replaceReferences(node[key]);
                  }
                }
              }
            };
            // Apply reference replacement to all statements
            functionBody.body.forEach(replaceReferences);
            // Insert copy statements at the beginning
            functionBody.body.unshift(...copyStatements);
            // Add return statement with temp variable names
            const returnObj = {
              type: 'ObjectExpression',
              properties: Array.from(varsToReturn).map(varName => ({
                type: 'Property',
                key: { type: 'Identifier', name: varName },
                value: { type: 'Identifier', name: tempVarMap.get(varName) },
                kind: 'init',
                computed: false,
                shorthand: false
              }))
            };
            functionBody.body.push({
              type: 'ReturnStatement',
              argument: returnObj
            });
          }
        };
        addCopyingAndReturn(thenFunction.body, assignedVars);
        addCopyingAndReturn(elseFunction.body, assignedVars);
        // Create a block variable to capture the return value
        const blockVar = `__block_${blockVarCounter++}`;
        // Replace with a block statement
        const statements = [];
        // Make sure every assigned variable starts as a node
        for (const varName of assignedVars) {
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: { type: 'Identifier', name: varName },
              right: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: '__p5.strandsNode' },
                arguments: [{ type: 'Identifier', name: varName }],
              }
            }
          });
        }
        statements.push({
          type: 'VariableDeclaration',
          declarations: [{
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: blockVar },
            init: callExpression
          }],
          kind: 'const'
        });
        // 2. Assignments for each modified variable
        for (const varName of assignedVars) {
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: { type: 'Identifier', name: varName },
              right: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: blockVar },
                property: { type: 'Identifier', name: varName },
                computed: false
              }
            }
          });
        }
        // Replace the if statement with a block statement
        node.type = 'BlockStatement';
        node.body = statements;
      } else {
        // No assignments, just replace with the call expression
        node.type = 'ExpressionStatement';
        node.expression = callExpression;
      }
      delete node.test;
      delete node.consequent;
      delete node.alternate;
    },
    UpdateExpression(node, _state, ancestors) {
      if (ancestors.some(nodeIsUniform)) { return; }

      // Transform ++var, var++, --var, var-- into assignment expressions
      let operator;
      if (node.operator === '++') {
        operator = '+';
      } else if (node.operator === '--') {
        operator = '-';
      } else {
        return; // Unknown update operator
      }

      // Convert to: var = var + 1 or var = var - 1
      const assignmentExpr = {
        type: 'AssignmentExpression',
        operator: '=',
        left: node.argument,
        right: {
          type: 'BinaryExpression',
          operator: operator,
          left: node.argument,
          right: {
            type: 'Literal',
            value: 1
          }
        }
      };

      // Replace the update expression with the assignment expression
      Object.assign(node, assignmentExpr);
      delete node.prefix;
      this.BinaryExpression(node.right, _state, [...ancestors, node]);
      this.AssignmentExpression(node, _state, ancestors);
    },
    ForStatement(node, _state, ancestors) {
      if (ancestors.some(nodeIsUniform)) { return; }

      // Transform for statement into strandsFor() call
      // for (init; test; update) body -> strandsFor(initCb, conditionCb, updateCb, bodyCb, initialVars)

      // Create the initial callback from the for loop's init
      let initialFunction;
      if (node.init && node.init.type === 'VariableDeclaration') {
        // Handle: for (let i = 0; ...)
        const declaration = node.init.declarations[0];
        let initValue = declaration.init;

        const initAst = { type: 'Program', body: [{ type: 'ExpressionStatement', expression: initValue }] };
        initValue = initAst.body[0].expression;

        initialFunction = {
          type: 'ArrowFunctionExpression',
          params: [],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ReturnStatement',
              argument: initValue
            }]
          }
        };
      } else {
        // Handle other cases - return a default value
        initialFunction = {
          type: 'ArrowFunctionExpression',
          params: [],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ReturnStatement',
              argument: {
                type: 'Literal',
                value: 0
              }
            }]
          }
        };
      }

      // Create the condition callback
      let conditionBody = node.test || { type: 'Literal', value: true };
      // Replace loop variable references with the parameter
      if (node.init?.type === 'VariableDeclaration') {
        const loopVarName = node.init.declarations[0].id.name;
        conditionBody = this.replaceIdentifierReferences(conditionBody, loopVarName, 'loopVar');
      }
      const conditionAst = { type: 'Program', body: [{ type: 'ExpressionStatement', expression: conditionBody }] };
      conditionBody = conditionAst.body[0].expression;

      const conditionFunction = {
        type: 'ArrowFunctionExpression',
        params: [{ type: 'Identifier', name: 'loopVar' }],
        body: conditionBody
      };

      // Create the update callback
      let updateFunction;
      if (node.update) {
        let updateExpr = node.update;
        // Replace loop variable references with the parameter
        if (node.init?.type === 'VariableDeclaration') {
          const loopVarName = node.init.declarations[0].id.name;
          updateExpr = this.replaceIdentifierReferences(updateExpr, loopVarName, 'loopVar');
        }
        const updateAst = { type: 'Program', body: [{ type: 'ExpressionStatement', expression: updateExpr }] };
        // const nonControlFlowCallbacks = { ...ASTCallbacks };
        // delete nonControlFlowCallbacks.IfStatement;
        // delete nonControlFlowCallbacks.ForStatement;
        // ancestor(updateAst, nonControlFlowCallbacks, undefined, _state);
        updateExpr = updateAst.body[0].expression;

        updateFunction = {
          type: 'ArrowFunctionExpression',
          params: [{ type: 'Identifier', name: 'loopVar' }],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ReturnStatement',
              argument: updateExpr
            }]
          }
        };
      } else {
        updateFunction = {
          type: 'ArrowFunctionExpression',
          params: [{ type: 'Identifier', name: 'loopVar' }],
          body: {
            type: 'BlockStatement',
            body: [{
              type: 'ReturnStatement',
              argument: { type: 'Identifier', name: 'loopVar' }
            }]
          }
        };
      }

      // Create the body callback
      let bodyBlock = node.body.type === 'BlockStatement' ? node.body : {
        type: 'BlockStatement',
        body: [node.body]
      };

      // Replace loop variable references in the body
      if (node.init?.type === 'VariableDeclaration') {
        const loopVarName = node.init.declarations[0].id.name;
        bodyBlock = this.replaceIdentifierReferences(bodyBlock, loopVarName, 'loopVar');
      }

      const bodyFunction = {
        type: 'ArrowFunctionExpression',
        params: [
          { type: 'Identifier', name: 'loopVar' },
          { type: 'Identifier', name: 'vars' }
        ],
        body: bodyBlock
      };

      // Analyze which outer scope variables are assigned in the loop body
      const assignedVars = new Set();
      const analyzeBlock = (body) => {
        if (body.type !== 'BlockStatement') return;

        for (const stmt of body.body) {
          if (stmt.type === 'ExpressionStatement' &&
              stmt.expression.type === 'AssignmentExpression') {
            const left = stmt.expression.left;
            if (left.type === 'Identifier') {
              assignedVars.add(left.name);
            } else if (left.type === 'MemberExpression' &&
                       left.object.type === 'Identifier') {
              // Property assignment: obj.prop = value (includes swizzles)
              assignedVars.add(left.object.name);
            }
          } else if (stmt.type === 'BlockStatement') {
            // Recursively analyze nested block statements
            analyzeBlock(stmt);
          }
        }
      };

      analyzeBlock(bodyFunction.body);

      if (assignedVars.size > 0) {
        // Add copying, reference replacement, and return statements similar to if statements
        const addCopyingAndReturn = (functionBody, varsToReturn) => {
          if (functionBody.type === 'BlockStatement') {
            const tempVarMap = new Map();
            const copyStatements = [];

            for (const varName of varsToReturn) {
              const tempName = `__copy_${varName}_${blockVarCounter++}`;
              tempVarMap.set(varName, tempName);

              copyStatements.push({
                type: 'VariableDeclaration',
                declarations: [{
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: tempName },
                  init: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'MemberExpression',
                        object: { type: 'Identifier', name: 'vars' },
                        property: { type: 'Identifier', name: varName },
                        computed: false
                      },
                      property: { type: 'Identifier', name: 'copy' },
                      computed: false
                    },
                    arguments: []
                  }
                }],
                kind: 'let'
              });
            }

            // Replace references to original variables with temp variables
            const replaceReferences = (node) => {
              if (!node || typeof node !== 'object') return;
              if (node.type === 'Identifier' && tempVarMap.has(node.name)) {
                node.name = tempVarMap.get(node.name);
              }

              for (const key in node) {
                if (node.hasOwnProperty(key) && key !== 'parent') {
                  if (Array.isArray(node[key])) {
                    node[key].forEach(replaceReferences);
                  } else if (typeof node[key] === 'object') {
                    replaceReferences(node[key]);
                  }
                }
              }
            };

            functionBody.body.forEach(replaceReferences);
            functionBody.body.unshift(...copyStatements);

            // Add return statement
            const returnObj = {
              type: 'ObjectExpression',
              properties: Array.from(varsToReturn).map(varName => ({
                type: 'Property',
                key: { type: 'Identifier', name: varName },
                value: { type: 'Identifier', name: tempVarMap.get(varName) },
                kind: 'init',
                computed: false,
                shorthand: false
              }))
            };

            functionBody.body.push({
              type: 'ReturnStatement',
              argument: returnObj
            });
          }
        };

        addCopyingAndReturn(bodyFunction.body, assignedVars);

        // Create block variable and assignments similar to if statements
        const blockVar = `__block_${blockVarCounter++}`;
        const statements = [];

        // Create initial vars object from assigned variables
        const initialVarsProperties = [];
        for (const varName of assignedVars) {
          initialVarsProperties.push({
            type: 'Property',
            key: { type: 'Identifier', name: varName },
            value: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: '__p5.strandsNode',
              },
              arguments: [
                { type: 'Identifier', name: varName },
              ],
            },
            kind: 'init',
            method: false,
            shorthand: false,
            computed: false
          });
        }

        const initialVarsObject = {
          type: 'ObjectExpression',
          properties: initialVarsProperties
        };

        // Create the strandsFor call
        const callExpression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: '__p5.strandsFor'
          },
          arguments: [initialFunction, conditionFunction, updateFunction, bodyFunction, initialVarsObject]
        };

        statements.push({
          type: 'VariableDeclaration',
          declarations: [{
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: blockVar },
            init: callExpression
          }],
          kind: 'const'
        });

        // Add assignments back to original variables
        for (const varName of assignedVars) {
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: { type: 'Identifier', name: varName },
              right: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: blockVar },
                property: { type: 'Identifier', name: varName },
                computed: false
              }
            }
          });
        }

        node.type = 'BlockStatement';
        node.body = statements;
      } else {
        // No assignments, just replace with call expression
        node.type = 'ExpressionStatement';
        node.expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: '__p5.strandsFor'
          },
          arguments: [initialFunction, conditionFunction, updateFunction, bodyFunction, {
            type: 'ObjectExpression',
            properties: []
          }]
        };
      }

      delete node.init;
      delete node.test;
      delete node.update;
    },

    // Helper method to replace identifier references in AST nodes
    replaceIdentifierReferences(node, oldName, newName) {
      if (!node || typeof node !== 'object') return node;

      const replaceInNode = (n) => {
        if (!n || typeof n !== 'object') return n;

        if (n.type === 'Identifier' && n.name === oldName) {
          return { ...n, name: newName };
        }

        // Create a copy and recursively process properties
        const newNode = { ...n };
        for (const key in n) {
          if (n.hasOwnProperty(key) && key !== 'parent') {
            if (Array.isArray(n[key])) {
              newNode[key] = n[key].map(replaceInNode);
            } else if (typeof n[key] === 'object') {
              newNode[key] = replaceInNode(n[key]);
            }
          }
        }
        return newNode;
      };

      return replaceInNode(node);
    }
  }
  export function transpileStrandsToJS(p5, sourceString, srcLocations, scope) {
    const ast = parse(sourceString, {
      ecmaVersion: 2021,
      locations: srcLocations
    });
    // First pass: transform everything except if/for statements using normal ancestor traversal
    const nonControlFlowCallbacks = { ...ASTCallbacks };
    delete nonControlFlowCallbacks.IfStatement;
    delete nonControlFlowCallbacks.ForStatement;
    ancestor(ast, nonControlFlowCallbacks, undefined, { varyings: {} });
    // Second pass: transform if/for statements in post-order using recursive traversal
    const postOrderControlFlowTransform = {
      IfStatement(node, state, c) {
        // First recursively process children
        if (node.test) c(node.test, state);
        if (node.consequent) c(node.consequent, state);
        if (node.alternate) c(node.alternate, state);
        // Then apply the transformation to this node
        ASTCallbacks.IfStatement(node, state, []);
      },
      ForStatement(node, state, c) {
        // First recursively process children
        if (node.init) c(node.init, state);
        if (node.test) c(node.test, state);
        if (node.update) c(node.update, state);
        if (node.body) c(node.body, state);
        // Then apply the transformation to this node
        ASTCallbacks.ForStatement(node, state, []);
      }
    };
    recursive(ast, { varyings: {} }, postOrderControlFlowTransform);
    const transpiledSource = escodegen.generate(ast);
    const scopeKeys = Object.keys(scope);
    const internalStrandsCallback = new Function(
        // Create a parameter called __p5, not just p5, because users of instance mode
        // may pass in a variable called p5 as a scope variable. If we rely on a variable called
        // p5, then the scope variable called p5 might accidentally override internal function
        // calls to p5 static methods.
      '__p5',
      ...scopeKeys,
      transpiledSource
      .slice(
        transpiledSource.indexOf('{') + 1,
        transpiledSource.lastIndexOf('}')
      ).replaceAll(';', '')
    );
    return () => internalStrandsCallback(p5, ...scopeKeys.map(key => scope[key]));
  }
