import { parse } from 'acorn';
import { ancestor } from 'acorn-walk';
import escodegen from 'escodegen';
import { UnarySymbolToName } from './ir_types';

function replaceBinaryOperator(codeSource) {
  switch (codeSource) {
    case '+': return 'add';
    case '-': return 'sub';
    case '*': return 'mult';
    case '/': return 'div';
    case '%': return 'mod';
    case '==':
    case '===': return 'equalTo';
    case '>': return 'greaterThan';
    case '>=': return 'greaterThanEqualTo';
    case '<': return 'lessThan';
    case '&&': return 'and';
    case '||': return 'or';
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
        name: unaryFnName,
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
            name: unaryFnName
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
        name: 'strandsNode',
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
            name: 'strandsNode',
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
  }
  
  export function transpileStrandsToJS(sourceString, srcLocations, scope) {
    const ast = parse(sourceString, {
      ecmaVersion: 2021,
      locations: srcLocations
    });
    ancestor(ast, ASTCallbacks, undefined, { varyings: {} });
    const transpiledSource = escodegen.generate(ast);
    const scopeKeys = Object.keys(scope);
    const internalStrandsCallback = new Function(
      '__p5',
      ...scopeKeys,
      transpiledSource
      .slice(
        transpiledSource.indexOf('{') + 1,
        transpiledSource.lastIndexOf('}')
      ).replaceAll(';', '')
    );
    console.log(transpiledSource);
    return () => internalStrandsCallback(p5, ...scopeKeys.map(key => scope[key]));
  }
  