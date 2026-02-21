import { parse } from 'acorn';
import { ancestor, recursive } from 'acorn-walk';
import escodegen from 'escodegen';
import { UnarySymbolToName } from './ir_types';
let blockVarCounter = 0;
let loopVarCounter = 0;
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

function nodeIsVarying(node) {
  return node?.type === 'CallExpression'
    && (
      (
        // Global mode
        node.callee?.type === 'Identifier' &&
        (node.callee?.name.startsWith('varying') || node.callee?.name.startsWith('shared'))
      ) || (
        // Instance mode
        node.callee?.type === 'MemberExpression' &&
        (node.callee?.property.name.startsWith('varying') || node.callee?.property.name.startsWith('shared'))
      )
    );
}

// Helper function to check if a statement is a variable declaration with strands control flow init
function statementContainsStrandsControlFlow(stmt) {
  // Check for variable declarations with strands control flow init
  if (stmt.type === 'VariableDeclaration') {
    const match = stmt.declarations.some(decl =>
      decl.init?.type === 'CallExpression' &&
      (
        (
          decl.init?.callee?.type === 'MemberExpression' &&
          decl.init?.callee?.object?.type === 'Identifier' &&
          decl.init?.callee?.object?.name === '__p5' &&
          (decl.init?.callee?.property?.name === 'strandsFor' ||
            decl.init?.callee?.property?.name === 'strandsIf')
        ) ||
        (
          decl.init?.callee?.type === 'Identifier' &&
          (decl.init?.callee?.name === '__p5.strandsFor' ||
            decl.init?.callee?.name === '__p5.strandsIf')
        )
      )
    );
    return match
  }
  return false;
}

// Helper function to build property path from MemberExpression
// e.g., inputs.color -> "inputs.color", vec.x -> "vec.x"
function isSwizzle(propertyName) {
  if (!propertyName || typeof propertyName !== 'string') return false;
  const swizzleSets = [
    ['x', 'y', 'z', 'w'],
    ['r', 'g', 'b', 'a'],
    ['s', 't', 'p', 'q']
  ];
  return swizzleSets.some(set =>
    [...propertyName].every(char => set.includes(char))
  );
}

function buildPropertyPath(memberExpr) {
  const parts = [];
  let current = memberExpr;
  while (current.type === 'MemberExpression') {
    if (current.computed) {
      return null;
    }
    const propName = current.property.name || current.property.value;
    if (isSwizzle(propName)) {
      current = current.object;
      break;
    }
    parts.unshift(propName);
    current = current.object;
  }
  if (current.type === 'Identifier') {
    parts.unshift(current.name);
  } else {
    return null;
  }
  return parts.join('.');
}

// Replace all references to original variables with temp variables
// and wrap literal assignments in strandsNode calls
function replaceReferences(node, tempVarMap) {
  const internalReplaceReferences = (node) => {
    if (!node || typeof node !== 'object') return;

    // Check if this MemberExpression matches a tracked property path
    if (node.type === 'MemberExpression') {
      const propName = node.property.name || node.property.value;
      if (isSwizzle(propName)) {
        // For swizzles, only replace the object part, keep the swizzle
        internalReplaceReferences(node.object);
        return;
      }
      const propertyPath = buildPropertyPath(node);
      if (propertyPath && tempVarMap.has(propertyPath)) {
        // Replace entire member expression with temp variable
        Object.assign(node, {
          type: 'Identifier',
          name: tempVarMap.get(propertyPath)
        });
        return; // Don't recurse into replaced node
      }
    }

    // Handle simple identifier replacements
    if (node.type === 'Identifier' && tempVarMap.has(node.name)) {
      node.name = tempVarMap.get(node.name);
    }

    // Handle literal assignments to temp variables
    if (node.type === 'AssignmentExpression') {
      let leftPath = null;
      if (node.left.type === 'Identifier') {
        leftPath = node.left.name;
      } else if (node.left.type === 'MemberExpression') {
        leftPath = buildPropertyPath(node.left);
      }

      if (leftPath && tempVarMap.has(leftPath) &&
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
    }

    // Recursively process all properties
    for (const key in node) {
      if (node.hasOwnProperty(key) && key !== 'parent') {
        // Don't recurse into property names of non-computed member expressions
        if (node.type === 'MemberExpression' && key === 'property' && !node.computed) {
          continue;
        }
        if (Array.isArray(node[key])) {
          node[key].forEach(internalReplaceReferences);
        } else if (typeof node[key] === 'object') {
          internalReplaceReferences(node[key]);
        }
      }
    }
  };

  internalReplaceReferences(node);
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
      // Only inject the variable name if the first argument isn't already a string
      if (node.init.arguments.length === 0 ||
          node.init.arguments[0].type !== 'Literal' ||
          typeof node.init.arguments[0].value !== 'string') {
        const uniformNameLiteral = {
          type: 'Literal',
          value: node.id.name
        }
        node.init.arguments.unshift(uniformNameLiteral);
      }
    }
    if (nodeIsVarying(node.init)) {
      // Only inject the variable name if the first argument isn't already a string
      if (
        node.init.arguments.length === 0 ||
        node.init.arguments[0].type !== 'Literal' ||
        typeof node.init.arguments[0].value !== 'string'
      ) {
        const varyingNameLiteral = {
          type: 'Literal',
          value: node.id.name
        }
        node.init.arguments.unshift(varyingNameLiteral);
        _state.varyings[node.id.name] = varyingNameLiteral;
      } else {
        // Still track it as a varying even if name wasn't injected
        _state.varyings[node.id.name] = node.init.arguments[0];
      }
    }
  },
  Identifier(node, _state, ancestors) {
    if (ancestors.some(nodeIsUniform)) { return; }
    if (_state.varyings[node.name]
      && !ancestors.some(a => a.type === 'AssignmentExpression' && a.left === node)
    ) {
      node.type = 'CallExpression';
      node.callee = {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: node.name
        },
        property: {
          type: 'Identifier',
          name: 'getValue'
        },
      };
      node.arguments = [];
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
    const unsafeTypes = ['Literal', 'ArrayExpression', 'Identifier'];
    if (node.operator !== '=') {
      const methodName = replaceBinaryOperator(node.operator.replace('=',''));
      const rightReplacementNode = {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: unsafeTypes.includes(node.left.type)
            ? {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: '__p5.strandsNode',
                },
                arguments: [node.left]
              }
            : node.left,
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
    // Handle direct varying variable assignment: myVarying = value
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
    // Handle swizzle assignment to varying variable: myVarying.xyz = value
    // Note: node.left.object might be worldPos.getValue() due to prior Identifier transformation
    else if (node.left.type === 'MemberExpression') {
      let varyingName = null;

      // Check if it's a direct identifier: myVarying.xyz
      if (node.left.object.type === 'Identifier' && _state.varyings[node.left.object.name]) {
        varyingName = node.left.object.name;
      }
      // Check if it's a getValue() call: myVarying.getValue().xyz
      else if (node.left.object.type === 'CallExpression' &&
               node.left.object.callee?.type === 'MemberExpression' &&
               node.left.object.callee.property?.name === 'getValue' &&
               node.left.object.callee.object?.type === 'Identifier' &&
               _state.varyings[node.left.object.callee.object.name]) {
        varyingName = node.left.object.callee.object.name;
      }

      if (varyingName) {
        const swizzlePattern = node.left.property.name;
        node.type = 'ExpressionStatement';
        node.expression = {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: varyingName
            },
            property: {
              type: 'Identifier',
              name: 'bridgeSwizzle',
            }
          },
          arguments: [
            {
              type: 'Literal',
              value: swizzlePattern
            },
            node.right
          ],
        }
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
  LogicalExpression(node, _state, ancestors) {
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
    // Replace the logical operator with a call expression
    // in other words a call to BaseNode.or(), .and() etc.
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

    const analyzeBranch = (functionBody) => {
      // First pass: collect all variable declarations in the branch
      const localVars = new Set();
      ancestor(functionBody, {
        VariableDeclarator(node, ancestors) {
          // Skip if we're inside a block that contains strands control flow
          if (ancestors.some(statementContainsStrandsControlFlow)) return;
          if (node.id.type === 'Identifier') {
            localVars.add(node.id.name);
          }
        }
      });

      // Second pass: find assignments to non-local variables using acorn-walk
      ancestor(functionBody, {
        AssignmentExpression(node, ancestors) {
          // Skip if we're inside a block that contains strands control flow
          if (ancestors.some(statementContainsStrandsControlFlow)) return;

          const left = node.left;
          if (left.type === 'Identifier') {
            // Direct variable assignment: x = value
            if (!localVars.has(left.name)) {
              assignedVars.add(left.name);
            }
          } else if (left.type === 'MemberExpression') {
            // Property assignment: obj.prop = value or obj.a.b = value
            const propertyPath = buildPropertyPath(left);
            if (propertyPath) {
              const baseName = propertyPath.split('.')[0];
              if (!localVars.has(baseName)) {
                assignedVars.add(propertyPath);
              }
            }
          }
        }
      });
    };

    // Analyze all branches for assignments to outer scope variables
    analyzeBranch(thenFunction.body);
    analyzeBranch(elseFunction.body);
    if (assignedVars.size > 0) {
      // Add copying, reference replacement, and return statements to branch functions
      const addCopyingAndReturn = (functionBody, varsToReturn) => {
        if (functionBody.type === 'BlockStatement') {
          // Create temporary variables and copy statements
          const tempVarMap = new Map(); // property path -> temp name
          const copyStatements = [];
          for (const varPath of varsToReturn) {
            const parts = varPath.split('.');
            const tempName = `__copy_${parts.join('_')}_${blockVarCounter++}`;
            tempVarMap.set(varPath, tempName);

            // Build the member expression for the property path
            let sourceExpr = { type: 'Identifier', name: parts[0] };
            for (let i = 1; i < parts.length; i++) {
              sourceExpr = {
                type: 'MemberExpression',
                object: sourceExpr,
                property: { type: 'Identifier', name: parts[i] },
                computed: false
              };
            }

            // let tempName = propertyPath.copy()
            copyStatements.push({
              type: 'VariableDeclaration',
              declarations: [{
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: tempName },
                init: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: sourceExpr,
                    property: { type: 'Identifier', name: 'copy' },
                    computed: false
                  },
                  arguments: []
                }
              }],
              kind: 'let'
            });
          }
          // Apply reference replacement to all statements
          functionBody.body.forEach(node => replaceReferences(node, tempVarMap));
          // Insert copy statements at the beginning
          functionBody.body.unshift(...copyStatements);
          // Add return statement with flat object using property paths as keys
          const returnObj = {
            type: 'ObjectExpression',
            properties: Array.from(varsToReturn).map(varPath => ({
              type: 'Property',
              key: { type: 'Literal', value: varPath },
              value: { type: 'Identifier', name: tempVarMap.get(varPath) },
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
      for (const varPath of assignedVars) {
        const parts = varPath.split('.');

        // Build left side: inputs.color or just x
        let leftExpr = { type: 'Identifier', name: parts[0] };
        for (let i = 1; i < parts.length; i++) {
          leftExpr = {
            type: 'MemberExpression',
            object: leftExpr,
            property: { type: 'Identifier', name: parts[i] },
            computed: false
          };
        }

        // Build right side - same as left for strandsNode wrapping
        let rightArgExpr = { type: 'Identifier', name: parts[0] };
        for (let i = 1; i < parts.length; i++) {
          rightArgExpr = {
            type: 'MemberExpression',
            object: rightArgExpr,
            property: { type: 'Identifier', name: parts[i] },
            computed: false
          };
        }

        statements.push({
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: leftExpr,
            right: {
              type: 'CallExpression',
              callee: { type: 'Identifier', name: '__p5.strandsNode' },
              arguments: [rightArgExpr],
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
      for (const varPath of assignedVars) {
        const parts = varPath.split('.');

        // Build left side: inputs.color or just x
        let leftExpr = { type: 'Identifier', name: parts[0] };
        for (let i = 1; i < parts.length; i++) {
          leftExpr = {
            type: 'MemberExpression',
            object: leftExpr,
            property: { type: 'Identifier', name: parts[i] },
            computed: false
          };
        }

        // Build right side: __block_2['inputs.color'] or __block_2['x']
        const rightExpr = {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: blockVar },
          property: { type: 'Literal', value: varPath },
          computed: true
        };

        statements.push({
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: leftExpr,
            right: rightExpr
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

    // Generate unique loop variable name
    const uniqueLoopVar = `loopVar${loopVarCounter++}`;

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
      conditionBody = this.replaceIdentifierReferences(conditionBody, loopVarName, uniqueLoopVar);
    }
    const conditionAst = { type: 'Program', body: [{ type: 'ExpressionStatement', expression: conditionBody }] };
    conditionBody = conditionAst.body[0].expression;

    const conditionFunction = {
      type: 'ArrowFunctionExpression',
      params: [{ type: 'Identifier', name: uniqueLoopVar }],
      body: conditionBody
    };

    // Create the update callback
    let updateFunction;
    if (node.update) {
      let updateExpr = node.update;
      // Replace loop variable references with the parameter
      if (node.init?.type === 'VariableDeclaration') {
        const loopVarName = node.init.declarations[0].id.name;
        updateExpr = this.replaceIdentifierReferences(updateExpr, loopVarName, uniqueLoopVar);
      }
      const updateAst = { type: 'Program', body: [{ type: 'ExpressionStatement', expression: updateExpr }] };
      updateExpr = updateAst.body[0].expression;

      updateFunction = {
        type: 'ArrowFunctionExpression',
        params: [{ type: 'Identifier', name: uniqueLoopVar }],
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
        params: [{ type: 'Identifier', name: uniqueLoopVar }],
        body: {
          type: 'BlockStatement',
          body: [{
            type: 'ReturnStatement',
            argument: { type: 'Identifier', name: uniqueLoopVar }
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
      bodyBlock = this.replaceIdentifierReferences(bodyBlock, loopVarName, uniqueLoopVar);
    }

    const bodyFunction = {
      type: 'ArrowFunctionExpression',
      params: [
        { type: 'Identifier', name: uniqueLoopVar },
        { type: 'Identifier', name: 'vars' }
      ],
      body: bodyBlock
    };

    // Analyze which outer scope variables are assigned in the loop body
    const assignedVars = new Set();

    // First pass: collect all variable declarations in the body
    const localVars = new Set();
    ancestor(bodyFunction.body, {
      VariableDeclarator(node, ancestors) {
        // Skip if we're inside a block that contains strands control flow
        if (ancestors.some(statementContainsStrandsControlFlow)) return;
        if (node.id.type === 'Identifier') {
          localVars.add(node.id.name);
        }
      }
    });

    // Second pass: find assignments to non-local variables using acorn-walk
    ancestor(bodyFunction.body, {
      AssignmentExpression(node, ancestors) {
        // Skip if we're inside a block that contains strands control flow
        if (ancestors.some(statementContainsStrandsControlFlow)) {
          return
        }

        const left = node.left;
        if (left.type === 'Identifier') {
          // Direct variable assignment: x = value
          if (!localVars.has(left.name)) {
            assignedVars.add(left.name);
          }
        } else if (left.type === 'MemberExpression') {
          // Property assignment: obj.prop = value or obj.a.b = value
          const propertyPath = buildPropertyPath(left);
          if (propertyPath) {
            const baseName = propertyPath.split('.')[0];
            if (!localVars.has(baseName)) {
              assignedVars.add(propertyPath);
            }
          }
        }
      }
    });

    if (assignedVars.size > 0) {
      // Add copying, reference replacement, and return statements similar to if statements
      const addCopyingAndReturn = (functionBody, varsToReturn) => {
        if (functionBody.type === 'BlockStatement') {
          const tempVarMap = new Map();
          const copyStatements = [];

          for (const varPath of varsToReturn) {
            const parts = varPath.split('.');
            const tempName = `__copy_${parts.join('_')}_${blockVarCounter++}`;
            tempVarMap.set(varPath, tempName);

            // Build the member expression for vars.propertyPath
            // e.g., vars.inputs.color or vars.x
            let sourceExpr = { type: 'Identifier', name: 'vars' };
            for (const part of parts) {
              sourceExpr = {
                type: 'MemberExpression',
                object: sourceExpr,
                property: { type: 'Identifier', name: part },
                computed: false
              };
            }

            copyStatements.push({
              type: 'VariableDeclaration',
              declarations: [{
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: tempName },
                init: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: sourceExpr,
                    property: { type: 'Identifier', name: 'copy' },
                    computed: false
                  },
                  arguments: []
                }
              }],
              kind: 'let'
            });
          }

          functionBody.body.forEach(node => replaceReferences(node, tempVarMap));
          functionBody.body.unshift(...copyStatements);

          // Add return statement with flat object using property paths as keys
          const returnObj = {
            type: 'ObjectExpression',
            properties: Array.from(varsToReturn).map(varPath => ({
              type: 'Property',
              key: { type: 'Literal', value: varPath },
              value: { type: 'Identifier', name: tempVarMap.get(varPath) },
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

      const initialVarsObject = {
        type: 'ObjectExpression',
        properties: Array.from(assignedVars).map(varPath => {
          const parts = varPath.split('.');
          let expr = { type: 'Identifier', name: parts[0] };
          for (let i = 1; i < parts.length; i++) {
            expr = {
              type: 'MemberExpression',
              object: expr,
              property: { type: 'Identifier', name: parts[i] },
              computed: false
            };
          }
          const wrappedExpr = {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: '__p5.strandsNode' },
            arguments: [expr]
          };
          return {
            type: 'Property',
            key: { type: 'Literal', value: varPath },
            value: wrappedExpr,
            kind: 'init',
            computed: false,
            shorthand: false
          };
        })
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
      for (const varPath of assignedVars) {
        const parts = varPath.split('.');

        // Build left side: inputs.color or just x
        let leftExpr = { type: 'Identifier', name: parts[0] };
        for (let i = 1; i < parts.length; i++) {
          leftExpr = {
            type: 'MemberExpression',
            object: leftExpr,
            property: { type: 'Identifier', name: parts[i] },
            computed: false
          };
        }

        // Build right side: __block_2.inputs.color or __block_2.x
        let rightExpr = { type: 'Identifier', name: blockVar };
        for (const part of parts) {
          rightExpr = {
            type: 'MemberExpression',
            object: rightExpr,
            property: { type: 'Identifier', name: part },
            computed: false
          };
        }

        statements.push({
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: leftExpr,
            right: rightExpr
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

// Helper function to check if a function body contains return statements in control flow
function functionHasEarlyReturns(functionNode) {
  let hasEarlyReturn = false;
  let inControlFlow = 0;

  const checkForEarlyReturns = {
    IfStatement(node, state, c) {
      inControlFlow++;
      if (node.test) c(node.test, state);
      if (node.consequent) c(node.consequent, state);
      if (node.alternate) c(node.alternate, state);
      inControlFlow--;
    },
    ForStatement(node, state, c) {
      inControlFlow++;
      if (node.init) c(node.init, state);
      if (node.test) c(node.test, state);
      if (node.update) c(node.update, state);
      if (node.body) c(node.body, state);
      inControlFlow--;
    },
    ReturnStatement(node) {
      if (inControlFlow > 0) {
        hasEarlyReturn = true;
      }
    }
  };

  if (functionNode.body && functionNode.body.type === 'BlockStatement') {
    recursive(functionNode.body, {}, checkForEarlyReturns);
  }

  return hasEarlyReturn;
}

// Helper function to check if a block contains a return anywhere in it
function blockContainsReturn(block) {
  let hasReturn = false;
  const findReturn = {
    ReturnStatement() {
      hasReturn = true;
    }
  };
  if (block) {
    recursive(block, {}, findReturn);
  }
  return hasReturn;
}

// Transform a helper function to use __returnValue pattern instead of early returns.
// This is necessary because we evaluate helper function *in javascript* rather than
// converting them to functions in GLSL (which is hard because we don't know the types
// of function parameters upfront, and they may change from use to use.) So they act
// like macros, all contributing to build up a single function overall. An early return
// in a helper should not be an early return of the entire hook function. Instead, we
// just make sure helper functions always evaluate to a single value.
function transformHelperFunction(functionNode) {
  // 1. Add __returnValue declaration at the start of function body
  const returnValueDecl = {
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: { type: 'Identifier', name: '__returnValue' },
      init: null
    }],
    kind: 'let'
  };

  if (!functionNode.body || functionNode.body.type !== 'BlockStatement') {
    return; // Can't transform arrow functions with expression bodies
  }

  functionNode.body.body.unshift(returnValueDecl);

  // 2. Restructure if statements: move siblings after if with return into else block
  function restructureIfStatements(statements) {
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];

      if (stmt.type === 'IfStatement' && blockContainsReturn(stmt.consequent) && !stmt.alternate) {
        // Find all subsequent statements
        const subsequentStatements = statements.slice(i + 1);

        if (subsequentStatements.length > 0) {
          // Create else block with subsequent statements
          stmt.alternate = {
            type: 'BlockStatement',
            body: subsequentStatements
          };

          // Remove the subsequent statements from this level
          statements.splice(i + 1);

          // Recursively process the new else block
          restructureIfStatements(stmt.alternate.body);
        }
      }

      // Recursively process nested blocks
      if (stmt.type === 'IfStatement') {
        if (stmt.consequent && stmt.consequent.type === 'BlockStatement') {
          restructureIfStatements(stmt.consequent.body);
        }
        if (stmt.alternate && stmt.alternate.type === 'BlockStatement') {
          restructureIfStatements(stmt.alternate.body);
        }
      } else if (stmt.type === 'ForStatement' && stmt.body && stmt.body.type === 'BlockStatement') {
        restructureIfStatements(stmt.body.body);
      } else if (stmt.type === 'BlockStatement') {
        restructureIfStatements(stmt.body);
      }
    }
  }

  restructureIfStatements(functionNode.body.body);

  // 3. Transform all return statements to assignments
  const transformReturns = {
    ReturnStatement(node) {
      // Convert return statement to assignment
      node.type = 'ExpressionStatement';
      node.expression = {
        type: 'AssignmentExpression',
        operator: '=',
        left: { type: 'Identifier', name: '__returnValue' },
        right: node.argument || { type: 'Identifier', name: 'undefined' }
      };
      delete node.argument;
    }
  };

  recursive(functionNode.body, {}, transformReturns);

  // 4. Add final return statement
  const finalReturn = {
    type: 'ReturnStatement',
    argument: { type: 'Identifier', name: '__returnValue' }
  };

  functionNode.body.body.push(finalReturn);
}

// Main transformation pass: find and transform helper functions with early returns
function transformHelperFunctionEarlyReturns(ast) {
  const helperFunctionsToTransform = [];

  // Collect helper functions that need transformation
  const collectHelperFunctions = {
    VariableDeclarator(node, ancestors) {
      const init = node.init;
      if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
        if (functionHasEarlyReturns(init)) {
          helperFunctionsToTransform.push(init);
        }
      }
    },
    FunctionDeclaration(node, ancestors) {
      if (functionHasEarlyReturns(node)) {
        helperFunctionsToTransform.push(node);
      }
    },
    // Don't transform functions that are direct arguments to call expressions
    CallExpression(node, ancestors) {
      // Arguments to CallExpressions are base callbacks, not helpers
      // We skip them by not adding them to the transformation list
    }
  };

  ancestor(ast, collectHelperFunctions);

  // Transform each collected helper function
  for (const funcNode of helperFunctionsToTransform) {
    transformHelperFunction(funcNode);
  }
}

export function transpileStrandsToJS(p5, sourceString, srcLocations, scope) {
  // Reset counters at the start of each transpilation
  blockVarCounter = 0;
  loopVarCounter = 0;

  const ast = parse(sourceString, {
    ecmaVersion: 2021,
    locations: srcLocations
  });
  // First pass: transform everything except if/for statements using normal ancestor traversal
  const nonControlFlowCallbacks = { ...ASTCallbacks };
  delete nonControlFlowCallbacks.IfStatement;
  delete nonControlFlowCallbacks.ForStatement;
  ancestor(ast, nonControlFlowCallbacks, undefined, { varyings: {} });

  // Second pass: transform helper functions with early returns to use __returnValue pattern
  transformHelperFunctionEarlyReturns(ast);

  // Third pass: transform if/for statements in post-order using recursive traversal
  const postOrderControlFlowTransform = {
    IfStatement(node, state, c) {
      state.inControlFlow++;
      // First recursively process children
      if (node.test) c(node.test, state);
      if (node.consequent) c(node.consequent, state);
      if (node.alternate) c(node.alternate, state);
      // Then apply the transformation to this node
      ASTCallbacks.IfStatement(node, state, []);
      state.inControlFlow--;
    },
    ForStatement(node, state, c) {
      state.inControlFlow++;
      // First recursively process children
      if (node.init) c(node.init, state);
      if (node.test) c(node.test, state);
      if (node.update) c(node.update, state);
      if (node.body) c(node.body, state);
      // Then apply the transformation to this node
      ASTCallbacks.ForStatement(node, state, []);
      state.inControlFlow--;
    },
    ReturnStatement(node, state, c) {
      if (!state.inControlFlow) return;
      // Convert return statement to strandsEarlyReturn call
      node.type = 'ExpressionStatement';
      node.expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: '__p5.strandsEarlyReturn'
        },
        arguments: node.argument ? [node.argument] : []
      };
      delete node.argument;
    }
  };
  recursive(ast, { varyings: {}, inControlFlow: 0 }, postOrderControlFlowTransform);
  const transpiledSource = escodegen.generate(ast);
  const scopeKeys = Object.keys(scope);
  const match = /\(?\s*(?:function)?\s*\w*\s*\(([^)]*)\)\s*(?:=>)?\s*{((?:.|\n)*)}\s*;?\s*\)?/
    .exec(transpiledSource);
  if (!match) {
    console.log(transpiledSource);
    throw new Error('Could not parse p5.strands function!');
  }
  const params = match[1].split(/,\s*/).filter(param => !!param.trim());
  let paramVals, paramNames;
  if (params.length > 0) {
    paramNames = params;
    paramVals = [scope];
  } else {
    paramNames = scopeKeys;
    paramVals = scopeKeys.map(key => scope[key]);
  }
  const body = match[2];
  try {
    const internalStrandsCallback = new Function(
        // Create a parameter called __p5, not just p5, because users of instance mode
        // may pass in a variable called p5 as a scope variable. If we rely on a variable called
        // p5, then the scope variable called p5 might accidentally override internal function
        // calls to p5 static methods.
      '__p5',
      ...paramNames,
      body,
    );
    return () => internalStrandsCallback(p5, ...paramVals);
  } catch (e) {
    console.error(e);
    console.log(paramNames);
    console.log(body);
    throw new Error('Error transpiling p5.strands callback!');
  }
}
