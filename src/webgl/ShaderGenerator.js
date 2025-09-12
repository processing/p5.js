/**
* @module 3D
* @submodule Material
* @for p5
* @requires core
*/
import { parse } from 'acorn';
import { ancestor } from 'acorn-walk';
import escodegen from 'escodegen';
import noiseGLSL from './shaders/functions/noiseGLSL.glsl';

function shadergenerator(p5, fn) {

  let GLOBAL_SHADER;
  let BRANCH;

  const oldModify = p5.Shader.prototype.modify;

  p5.Shader.prototype.modify = function(shaderModifier, scope = {}) {
    if (shaderModifier instanceof Function) {
      // TODO make this public. Currently for debugging only.
      const options = { parser: true, srcLocations: false };
      let generatorFunction;
      if (options.parser) {
        // #7955 Wrap function declaration code in brackets so anonymous functions are not top level statements, which causes an error in acorn when parsing
        // https://github.com/acornjs/acorn/issues/1385
        const sourceString = `(${shaderModifier.toString()})`;
        const ast = parse(sourceString, {
          ecmaVersion: 2021,
          locations: options.srcLocations
        });
        ancestor(ast, ASTCallbacks, undefined, { varyings: {} });
        const transpiledSource = escodegen.generate(ast);
        const scopeKeys = Object.keys(scope);
        const internalGeneratorFunction = new Function(
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
        generatorFunction = () =>
          internalGeneratorFunction(p5, ...scopeKeys.map(key => scope[key]));
      } else {
        generatorFunction = shaderModifier;
      }
      const generator = new ShaderGenerator(
        generatorFunction,
        this,
        options.srcLocations
      );
      const generatedModifyArgument = generator.generate();
      return oldModify.call(this, generatedModifyArgument);
    }
    else {
      return oldModify.call(this, shaderModifier);
    }
  };

  // AST Transpiler Callbacks and helper functions
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

      const signNode = {
        type: 'Literal',
        value: node.operator
      };

      const standardReplacement = node => {
        node.type = 'CallExpression';
        node.callee = {
          type: 'Identifier',
          name: '__p5.unaryNode'
        };
        node.arguments = [node.argument, signNode];
      };

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
              name: '__p5.unaryNode'
            },
            arguments: [node.argument.object, signNode]
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
        };
        node.init.arguments.unshift(uniformNameLiteral);
      }
      if (node.init.callee && node.init.callee.name?.startsWith('varying')) {
        const varyingNameLiteral = {
          type: 'Literal',
          value: node.id.name
        };
        node.init.arguments.unshift(varyingNameLiteral);
        _state.varyings[node.id.name] = varyingNameLiteral;
      }
    },
    Identifier(node, _state, ancestors) {
      if (ancestors.some(nodeIsUniform)) { return; }
      if (_state.varyings[node.name]
          && !_ancestors.some(a => a.type === 'AssignmentExpression' && a.left === node)) {
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
            }
          },
          arguments: []
        };
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
        name: '__p5.dynamicNode'
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
              name: methodName
            }
          },
          arguments: [node.right]
        };
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
              name: 'bridge'
            }
          },
          arguments: [node.right]
        };
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
            name: '__p5.dynamicNode'
          },
          arguments: [node.left]
        };
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
          name: replaceBinaryOperator(node.operator)
        }
      };
      node.arguments = [node.right];
    }
  };

  // Javascript Node API.
  class BaseNode {
    constructor(isInternal, type) {
      if (new.target === BaseNode) {
        throw new TypeError('Cannot construct BaseNode instances directly. This is an abstract class.');
      }
      this.type = type;
      this.componentNames = [];
      this.componentsChanged = false;
      // For tracking recursion depth and creating temporary variables
      this.isInternal = isInternal;
      this.usedIn = [];
      this.dependsOn = [];
      this.srcLine = null;
      this.usedInConditional = false;
      // Stack Capture is used to get the original line of user code for Debug purposes
      if (GLOBAL_SHADER.srcLocations === true && isInternal === false) {
        try {
          throw new Error('StackCapture');
        } catch (e) {
          const lines = e.stack.split('\n');
          let userSketchLineIndex = 5;
          if (isBinaryExpressionNode(this)) { userSketchLineIndex--; };
          this.srcLine = lines[userSketchLineIndex].trim();
        }
      }
    }

    addVectorComponents() {
      if (this.type.startsWith('vec')) {
        const vectorDimensions = parseInt(this.type.slice(3));
        this.componentNames = ['x', 'y', 'z', 'w'].slice(0, vectorDimensions);
        const proxy = this;
        for (let componentName of this.componentNames) {
          let value = new ComponentNode(proxy, componentName, 'float', true);
          Object.defineProperty(this, componentName, {
            get() {
              return value;
            },
            set(newValue) {
              this.componentsChanged = true;
              if (isUnaryExpressionNode(this)) {
                this.node.value = newValue;
              } else {
                value = newValue;
              }
            }
          });
        }
      }
    }

    forceTemporaryVariable() {
      if (
        !(isFloatNode(this) && isVectorNode(this.parent)) ||
        !isVariableNode(this)
      ) this.useTemp = true;
    }

    assertUsedInConditional(branch) {
      this.usedInConditional = true;
      this.usedIn.push(branch);
      this.forceTemporaryVariable();
    }

    isUsedInConditional() {
      return this.usedInConditional;
    }

    checkConditionalDependencies(context) {
      context.ifs.forEach(statement => {
        const isUsedSatisfied = () => statement.usedInSatisfied.length >= 1;
        const isDepsSatisfied = () =>
          statement.dependsOn.length === statement.dependsOnSatisfied.length;
        if (statement.insertionPoint > -1 || !statement.usedIn.length) return;
        if (
          statement.dependsOn.some(d => d.node === this) &&
          !statement.dependsOnSatisfied.includes(this)
        ) {
          statement.dependsOnSatisfied.push(this);
        }
        if (
          statement.usedIn.includes(this) &&
          !statement.usedInSatisfied.includes(this)
        ) {
          statement.usedInSatisfied.push(this);
        }
        if (isDepsSatisfied() && isUsedSatisfied()) {
          statement.saveState(context, isDepsSatisfied(), isUsedSatisfied());
        }
      });
    }

    // The base node implements a version of toGLSL which determines whether the generated code should be stored in a temporary variable.
    toGLSLBase(context){
      let result;
      if (this.shouldUseTemporaryVariable()) {
        let oldLength = context.declarations.length;
        result = this.getTemporaryVariable(context);
        let diff = context.declarations.length - 1 - oldLength;
        diff = diff > 0 ? diff : undefined;
        this.dependsOn.forEach(dependency => {
          if (dependency.isVector) {
            const dependencies = dependency.originalComponents
              .map((component, i) =>
                component === dependency.currentComponents[i]
              );
            context.updateComponents(dependency.node, diff, dependencies);
          } else {
            context.updateComponents(dependency.node, diff);
          }
        });
      } else {
        result = this.toGLSL(context);
      }
      this.checkConditionalDependencies(context);
      return result;
    }

    shouldUseTemporaryVariable() {
      if (
        this.componentsChanged ||
        hasTemporaryVariable(this) ||
        this.useTemp
      ) return true;
      if (this.isInternal || isVariableNode(this) || isConditionalNode(this) || this.type === 'sampler2D') { return false; }

      // return false;
      // Swizzles must use temporary variables as otherwise they will not be registered
      let score = 0;
      score += isFunctionCallNode(this) * 2;
      score += isBinaryExpressionNode(this) * 2;
      score += isVectorType(this) * 3;
      score += this.usedIn.length;
      return score >= 4;
    }

    getTemporaryVariable(context) {
      if (!this.temporaryVariable) {
        this.temporaryVariable = `temp_${context.getNextID()}`;
        let line = '';
        if (this.srcLine) {
          line += `\n// From ${this.srcLine}\n`;
        }
        line += '  ' + this.type + ' ' + this.temporaryVariable + ' = ' + this.toGLSL(context) + ';';
        context.declarations.push(line);
      }
      return this.temporaryVariable;
    };

    // Binary Operators
    add(other)  { return binaryExpressionNodeConstructor(this, this.enforceType(other), '+'); }
    sub(other)  { return binaryExpressionNodeConstructor(this, this.enforceType(other), '-'); }
    mult(other) { return binaryExpressionNodeConstructor(this, this.enforceType(other), '*'); }
    div(other)  { return binaryExpressionNodeConstructor(this, this.enforceType(other), '/'); }
    mod(other)  { return binaryExpressionNodeConstructor(this, this.enforceType(other), '%'); }

    // Check that the types of the operands are compatible.
    enforceType(other){
      if (isShaderNode(other)){
        if (!isGLSLNativeType(other.type)) {
          throw new TypeError (`You've tried to perform an operation on a struct of type: ${other.type}. Try accessing a member on that struct with '.'`);
        }
        if (!isGLSLNativeType(other.type)) {
          throw new TypeError (`You've tried to perform an operation on a struct of type: ${other.type}. Try accessing a member on that struct with '.'`);
        }
        if ((isFloatType(this) || isVectorType(this)) && isIntType(other)) {
          return new FloatNode(other);
        }
        return other;
      }
      else if (typeof other === 'number') {
        if (isIntType(this)) {
          return new IntNode(other);
        }
        return new FloatNode(other);
      }
      else if (Array.isArray(other)) {
        return nodeConstructors.dynamicVector(other);
        // return nodeConstructors[`vec${other.length}`](other);
      }
      else {
        return nodeConstructors[this.type](other);
      }
    }

    toFloat() {
      if (isFloatType(this)) {
        return this;
      } else if (isIntType(this)) {
        return new FloatNode(this);
      }
    }

    toGLSL(context){
      throw new TypeError('Not supposed to call this function on BaseNode, which is an abstract class.');
    }
  }

  // Primitive Types
  class IntNode extends BaseNode {
    constructor(x = 0, isInternal = false) {
      super(isInternal, 'int');
      this.x = x;
    }

    toGLSL(context) {
      if (isShaderNode(this.x)) {
        let code = this.x.toGLSLBase(context);
        return isIntType(this.x.type) ? code : `int(${code})`;
      }
      else if (typeof this.x === 'number') {
        return `${Math.floor(this.x)}`;
      }
      else {
        return `int(${this.x})`;
      }
    }
  }

  class FloatNode extends BaseNode {
    constructor(x = 0, isInternal = false, _parent = false){
      super(isInternal, 'float');
      if (Array.isArray(x)) {
        x = x[0];
      }
      if (_parent) {
        const { parent, name } = _parent;
        this.name = name;
        this.parent = parent;
      }
      this.x = x;
    }

    toGLSL(context) {
      if (isShaderNode(this.x)) {
        let code = this.x.toGLSLBase(context);
        return isFloatType(this.x) ? code : `float(${code})`;
      }
      else if (typeof this.x === 'number') {
        return `${this.x.toFixed(4)}`;
      }
      else {
        return `float(${this.x})`;
      }
    }
  }

  class VectorNode extends BaseNode {
    constructor(values, type, isInternal = false) {
      super(isInternal, type);
      this.originalValues = conformVectorParameters(
        values, parseInt(type.slice(3))
      );
      this.componentNames = ['x', 'y', 'z', 'w'].slice(0, this.originalValues.length);
    }

    addVectorComponents() {
      const values = this.originalValues;
      this.componentsChanged = false;

      this.componentNames.forEach((componentName, i) => {
        const info = { name: componentName, parent: this };
        let value = isFloatNode(values[i]) ?
          values[i] :
          new FloatNode(values[i], true, info);
        Object.defineProperty(this, componentName, {
          get() {
            return value;
          },
          set(newValue) {
            this.componentsChanged = true;
            if (isUnaryExpressionNode(this)) {
              this.node.value = newValue;
            } else {
              value = isFloatNode(newValue) ?
                newValue :
                new FloatNode(newValue, true, info);
            }
          }
        });
      });
      this.originalValues = this.componentNames.map(name => this[name]);
    }

    toGLSL(context) {
      if ((!this.componentsChanged || !this.defined) && !this.oldName) {
        let glslArgs = this.componentNames.map((_name, i) => this.originalValues[i].toGLSLBase(context)).join(', ');
        this.defined = true;
        return `${this.type}(${glslArgs})`;
      } else {
        return this.temporaryVariable;
      }
    }
  }

  // Function Call Nodes
  class FunctionCallNode extends BaseNode {
    constructor(name, userArgs, properties, isInternal = false) {
      let functionSignature;
      const determineFunctionSignature = props => {
        let genType;
        let similarity = 0;

        const valid = userArgs.every((userArg, i) => {
          const userType = getType(userArg);
          let expectedArgType = props.args[i];

          if (expectedArgType === 'genType') {
            // We allow conversions from float -> vec if one argument is a vector.
            if (genType === undefined || (genType === 'float' && userType.startsWith('vec'))) {
              genType = userType;
            };
            expectedArgType = genType;
          }
          similarity += (userType === expectedArgType);
          return userType === expectedArgType || (userType === 'float' && expectedArgType.startsWith('vec'));
        });

        return { ...props, valid, similarity, genType };
      };

      if (Array.isArray(properties)) {
        // Check if the right number of parameters were provided
        let possibleOverloads = properties
          .filter(o => o.args.length === userArgs.length);
        if (possibleOverloads.length === 0) {
          const argsLengthSet = new Set();
          const argsLengthArr = [];
          properties.forEach(p => argsLengthSet.add(p.args.length));
          argsLengthSet.forEach(len => argsLengthArr.push(`${len}`));
          const argsLengthStr = argsLengthArr.join(' or ');
          throw new Error(`Function '${name}' has ${properties.length} variants which expect ${argsLengthStr} arguments, but ${userArgs.length} arguments were provided.`);
        }
        const findBestOverload = function (best, current) {
          current = determineFunctionSignature(current);
          if (!current.valid) { return best; }
          if (!best || current.similarity > best.similarity) {
            best = current;
          }
          return best;
        };
        functionSignature = possibleOverloads.reduce(findBestOverload, null);
      } else {
        functionSignature = determineFunctionSignature(properties);
      }

      if (!functionSignature || !functionSignature.valid) {
        const argsStrJoin = args => `(${args.map(arg => arg).join(', ')})`;
        const expectedArgsString = Array.isArray(properties) ?
          properties.map(prop => argsStrJoin(prop.args)).join(' or ')
          : argsStrJoin(properties.args);
        const providedArgsString = argsStrJoin(userArgs.map(a=>getType(a)));
        throw new Error(`Function '${name}' was called with wrong arguments. Most likely, you provided mixed lengths vectors as arguments.\nExpected argument types: ${expectedArgsString}\nProvided argument types: ${providedArgsString}\nAll of the arguments with expected type 'genType' should have a matching type. If one of those is different, try to find where it was created.
        `);
      }

      if (userArgs.length !== functionSignature.args.length) {
        throw new Error(`Function '${name}' expects ${functionSignature.args.length} arguments, but ${userArgs.length} were provided.`);
      }

      userArgs = userArgs.map((arg, i) => {
        if (!isShaderNode(arg)) {
          const typeName = functionSignature.args[i] === 'genType' ? functionSignature.genType : functionSignature.args[i];
          arg = nodeConstructors[typeName](arg);
        } else if (isFloatType(arg) && functionSignature.args[i] === 'genType' && functionSignature.genType !== 'float') {
          arg = nodeConstructors[functionSignature.genType](arg);
        }
        return arg;
      });

      if (functionSignature.returnType === 'genType') {
        functionSignature.returnType = functionSignature.genType;
      }

      super(isInternal, functionSignature.returnType);

      this.name = name;
      this.args = userArgs;
      this.argumentTypes = functionSignature.args;
    }

    deconstructArgs(context) {
      let argsString = this.args.map((argNode, i) => {
        if (isIntType(argNode) && this.argumentTypes[i] !== 'float') {
          argNode = argNode.toFloat();
        }
        argNode.toGLSLBase(context);
        return argNode.toGLSLBase(context);
      }).join(', ');
      return argsString;
    }

    toGLSL(context) {
      return `${this.name}(${this.deconstructArgs(context)})`;
    }
  }

  // Variables and member variable nodes
  class VariableNode extends BaseNode {
    constructor(name, type, isInternal = false) {
      super(isInternal, type);
      this.name = name;
    }

    toGLSL(context) {
      return `${this.name}`;
    }
  }

  class ComponentNode extends BaseNode {
    constructor(parent, componentName, type, isInternal = false) {
      super(isInternal, type);
      this.parent = parent;
      this.componentName = componentName;
      this.type = type;
    }
    toGLSL(context) {
      let parentName = this.parent.toGLSLBase(context);
      if (!isVariableNode(this.parent) && !hasTemporaryVariable(this.parent)) {
        parentName = `(${parentName})`;
      }
      return `${parentName}.${this.componentName}`;
    }
  }

  //
  class VaryingNode extends VariableNode {
    constructor(name, type, isInternal = false) {
      super(name, type, isInternal);
      this.timesChanged = 0;
      this.tempVars = 0;
    }

    getValue() {
      const context = GLOBAL_SHADER.context;
      if (!context.varyings[this.name] || !this.timesChanged) {
        return this;
      }

      let values = context.varyings[this.name].splice(0, this.timesChanged);
      let snapshot;
      values.forEach((val, i) => {
        let { value } = val;
        context.declarations.push(`  ${this.name} = ${value.toGLSLBase(context)};`);
        if (i === values.length - 1) {
          const tempName = `${this.name}_${this.tempVars++}`;
          snapshot = dynamicAddSwizzleTrap(
            new VariableNode(tempName, this.type, true)
          );
          context.declarations.push(`  ${this.type} ${tempName} = ${this.name};`);
        }
      });

      this.timesChanged = 0;
      return snapshot;
    }

    bridge(value) {
      if (!isShaderNode(value) || this.type.startsWith('vec') && getType(value) === 'float') {
        value = nodeConstructors[this.type](value);
      }
      GLOBAL_SHADER.registerVarying(this, value);
      this.timesChanged += 1;
    }
  }

  // Binary Operator Nodes
  class BinaryExpressionNode extends BaseNode {
    constructor(left, right, operator, isInternal = false) {
      super(isInternal, null);
      this.operator = operator;
      this.left = left;
      this.right = right;
      for (const operand of [left, right]) {
        operand.usedIn.push(this);
      }
      this.type = this.determineType();
    }

    // We know that both this.left and this.right are nodes because of BaseNode.enforceType
    determineType() {
      if (['==', '>', '>=', '<', '<=', '||', '!', '&&'].includes(this.operator)) {
        return 'bool';
      }
      else if (this.left.type === this.right.type) {
        return this.left.type;
      }
      else if (isVectorType(this.left) && isFloatType(this.right)) {
        return this.left.type;
      }
      else if (isVectorType(this.right) && isFloatType(this.left)) {
        return this.right.type;
      }
      else if (isFloatType(this.left) && isIntType(this.right)
        || isIntType(this.left) && isFloatType(this.right)
      ) {
        return 'float';
      }
      else {
        throw new Error('Incompatible types for binary operator');
      }
    }

    processOperand(operand, context) {
      if (operand.temporaryVariable) { return operand.temporaryVariable; }
      let code = operand.toGLSLBase(context);
      if (isBinaryExpressionNode(operand) && !operand.temporaryVariable) {
        code = `(${code})`;
      }
      if (this.type === 'float' && isIntType(operand)) {
        code = `float(${code})`;
      }
      return code;
    }

    toGLSL(context) {
      const a = this.processOperand(this.left, context);
      const b = this.processOperand(this.right, context);
      return `${a} ${this.operator} ${b}`;
    }
  }

  class ModulusNode extends BinaryExpressionNode {
    constructor(a, b, isInternal) {
      super(a, b, isInternal);
    }
    toGLSL(context) {
      // Switch on type between % or mod()
      if (isVectorType(this) || isFloatType(this)) {
        return `mod(${this.left.toGLSLBase(context)}, ${this.right.toGLSLBase(context)})`;
      }
      return `${this.processOperand(context, this.left)} % ${this.processOperand(context, this.right)}`;
    }
  }

  class UnaryExpressionNode extends BaseNode {
    constructor(node, operator, isInternal = false) {
      super(isInternal, node.type);
      this.node = node;
      this.operator = operator;
    }

    toGLSL(context) {
      let mainStr = this.node.toGLSLBase(context);
      if (
        !isVariableNode(this.node) &&
        !hasTemporaryVariable(this.node) &&
        !isPrimitiveNode(this.node)
      ) {
        mainStr = `(${mainStr})`;
      }
      return `${this.operator}${mainStr}`;
    }
  }

  // Conditions and logical modifiers
  BaseNode.prototype.equalTo = function(other) {
    return binaryExpressionNodeConstructor(this, this.enforceType(other), '==');
  };

  BaseNode.prototype.greaterThan = function(other) {
    return binaryExpressionNodeConstructor(this, this.enforceType(other), '>');
  };

  BaseNode.prototype.greaterThanEqualTo = function(other) {
    return binaryExpressionNodeConstructor(this, this.enforceType(other), '>=');
  };

  BaseNode.prototype.lessThan = function(other) {
    return binaryExpressionNodeConstructor(this, this.enforceType(other), '<');
  };

  BaseNode.prototype.lessThanEqualTo = function(other) {
    return binaryExpressionNodeConstructor(this, this.enforceType(other), '<='); };

  BaseNode.prototype.not = function() {
    return new UnaryExpressionNode(this.condition, '!', true);
  };

  BaseNode.prototype.or = function(other) {
    return new binaryExpressionNodeConstructor(this, this.enforceType(other), '||', true);
  };

  BaseNode.prototype.and = function(other) {
    return new binaryExpressionNodeConstructor(this, this.enforceType(other), '&&', true);
  };

  function branch(callback) {
    const branch = new BranchNode();
    callback();
    BRANCH = null;
    return branch;
  }

  class ConditionalNode {
    constructor(condition, branchCallback) {
      this.dependsOn = [];
      this.usedIn = [];
      this.dependsOnSatisfied = [];
      this.usedInSatisfied = [];
      this.states = [];
      this.if(condition, branchCallback);
      this.insertionPoint = -1;
      this.elseIfs = [];
      this.elseBranch = null;
      GLOBAL_SHADER.context.ifs.push(this);
    }

    if(condition, branchCallback) {
      this.condition = condition;
      this.conditionString = condition.toGLSL(GLOBAL_SHADER.context);
      this.ifBranch = branch(branchCallback);
      this.ifBranch.parent = this;
    }

    elseIf(condition, branchCallback) {
      let elseBranch = branch(branchCallback);
      branchCallback.parent = this;
      this.elseIfs.push({ condition, elseBranch });
      return this;
    }

    else(branchCallback) {
      this.elseBranch = branch(branchCallback);
      this.elseBranch.parent = this;
      return this;
    }

    thenDiscard() {
      return new ConditionalDiscard(this.condition);
    };

    saveState(context, usedInSatisfied, dependsOnSatisfied) {
      this.states.push({
        line: context.declarations.length,
        usedInSatisfied,
        dependsOnSatisfied
      });
      this.insertionPoint = context.declarations.length - 1;
    }

    toGLSL(context) {
      const oldLength = context.declarations.length;
      this.dependsOn.forEach(dep => context.updateComponents(dep.node));
      const newLength = context.declarations.length;
      const diff = newLength - oldLength;
      this.insertionPoint += diff;

      let codelines = [
        `\n  if (${this.conditionString}) {`,
        `\n    ${this.ifBranch.toGLSL(context)}`,
        '\n  }'
      ];

      if (this.elseIfs.length) {
        this.elseIfs.forEach(elif => {
          let { condition, elseBranch } = elif;
          codelines.push(` else if (${condition.toGLSL(context)}) {`);
          codelines.push(`\n    ${elseBranch.toGLSL(context)}`);
          codelines.push('\n  }');
        });
      }

      if (this.elseBranch) {
        codelines.push(' else {');
        codelines.push(`\n    ${this.elseBranch.toGLSL(context)}`);
        codelines.push('\n  }\n');
      }
      codelines.push('\n');
      return codelines.flat().join('');
    }
  };

  fn.assign = function(node, value) {
    if (!BRANCH) {
      throw new error('assign() is supposed to be used inside of conditional branchs. Use the "=" operator as normal otherwise.');
    }
    BRANCH.assign(node, value);
  };

  class BranchNode {
    constructor() {
      BRANCH = this;
      this.statements = [];
      this.assignments = [];
      this.dependsOn = [];
      this.declarations = [];
      let parent = null;
      Object.defineProperty(this, 'parent', {
        get() {
          return parent;
        },
        set(newParent) {
          newParent.dependsOn.push(...this.dependsOn);
          parent = newParent;
        }
      });
    }

    assign(node, value) {
      if (!isShaderNode(value) || value.type !== node.type) {
        value = nodeConstructors[node.type](value);
        this.declarations.push(value);
        this.assignments.push({ node });
      } else {
        this.assignments.push({ node, value });
      }
      node = node.parent ? node.parent : node;
      value = value.parent ? value.parent : value;
      if ([node, value].some(n => this.dependsOn.some(d=>d.node===n))) {
        return;
      }
      node.assertUsedInConditional(this);
      this.dependsOn.push(makeDependencyObject(node));
      if (value.shouldUseTemporaryVariable()) {
        value.assertUsedInConditional(this);
        this.dependsOn.push(makeDependencyObject(value));
      }
    }

    toGLSL(context) {
      let declarationsIndex = 0;
      this.assignments.forEach(({ node, value }) => {
        let statement;
        let result;

        if (!value) {
          let decl = this.declarations[declarationsIndex];
          declarationsIndex++;
          decl.temporaryVariable = `temp_${context.getNextID()}`;
          this.statements.push(
            `${decl.type} ${decl.temporaryVariable} = ${decl.toGLSL(context)};`
          );
          result = decl.toGLSLBase(context);
        } else {
          result = value.toGLSLBase(context);
        }

        if (isVariableNode(node) || hasTemporaryVariable(node)) {
          statement = `${node.toGLSLBase(context)} = ${result};`;
        }
        else if (isFloatNode(node) && node.name) {
          statement = `${node.parent.toGLSLBase(context)}.${node.name} = ${result};`;
        }
        else {
          node.temporaryVariable = `temp_${context.getNextID()}`;
          statement = `${node.type} ${node.toGLSLBase(context)} = ${result};`;
        }

        this.statements.push(statement);
      });

      return this.statements.join('\n    ');
    }
  }

  class ConditionalDiscard {
    constructor(condition){
      this.condition = condition;
    }
    toGLSL(context) {
      context.discardConditions.push(`if (${this.condition}{discard;})`);
    }
  }

  // Node Helper functions
  function getType(node) {
    if (isShaderNode(node)) { return node.type; }
    else if (Array.isArray(node) && node.length > 1) { return `vec${node.length}`; }
    else if (typeof node === 'number' || (Array.isArray(node) && node.length === 1)) {
      return 'float';
    }
    return undefined;
  }

  function computeVectorLength(values) {
    let length = 0;
    if (Array.isArray(values)) {
      for(let val of values) {
        if (isVectorType(val)) {
          length += parseInt(val.type.slice(3));
        }
        else length += 1;
      }
    }
    else if (isVectorType(values)) {
      length += parseInt(val.type.slice(3));
    }
    if (![2, 3, 4].includes(length)) {
      throw new Error(`You have attempted to construct a vector with ${length} values. Only vec2, vec3, and vec4 types are supported.`);
    }
    return length;
  }

  p5.dynamicNode = function (input) {
    if (isShaderNode(input)) {
      return input;
    }
    else if (typeof input === 'number') {
      return new FloatNode(input);
    }
    else if (Array.isArray(input)) {
      return nodeConstructors.dynamicVector(input);
    }
  };

  // For replacing unary expressions
  p5.unaryNode = function(input, sign) {
    input = p5.dynamicNode(input);
    return dynamicAddSwizzleTrap(new UnaryExpressionNode(input, sign));
  };

  function isShaderNode(node) {
    return (node instanceof BaseNode);
  }

  function isIntType(node) {
    return (isShaderNode(node) && (node.type === 'int'));
  }

  function isFloatType(node) {
    return (isShaderNode(node) && (node.type === 'float'));
  }

  function isFloatNode(node) {
    return (node instanceof FloatNode);
  }

  function isVectorType(node) {
    return (isShaderNode(node) && (node.type === 'vec2'|| node.type === 'vec3' || node.type === 'vec4'));
  }

  function isBinaryExpressionNode(node) {
    return (node instanceof BinaryExpressionNode);
  }

  function isVariableNode(node) {
    return (node instanceof VariableNode || node instanceof ComponentNode);
  }

  function isConditionalNode(node) {
    return (node instanceof ConditionalNode || node instanceof BranchNode);
  }

  function hasTemporaryVariable(node) {
    return (node.temporaryVariable);
  }

  function isPrimitiveNode(node) {
    return (
      node instanceof FloatNode ||
      node instanceof IntNode ||
      node instanceof VectorNode
    );
  }

  function isFunctionCallNode(node) {
    return (node instanceof FunctionCallNode);
  }

  function isVectorNode(node) {
    return (node instanceof VectorNode);
  }

  function isUnaryExpressionNode(node) {
    return (node instanceof UnaryExpressionNode);
  }

  // Helper function to check if a type is a user defined struct or native type
  function isGLSLNativeType(typeName) {
    // Supported types for now
    const glslNativeTypes = ['int', 'float', 'vec2', 'vec3', 'vec4', 'sampler2D'];
    return glslNativeTypes.includes(typeName);
  }

  // Shader Generator
  // This class is responsible for converting the nodes into an object containing GLSL code, to be used by p5.Shader.modify

  class ShaderGenerator {
    constructor(userCallback, originalShader, srcLocations) {
      GLOBAL_SHADER = this;
      this.userCallback = userCallback;
      this.srcLocations = srcLocations;
      this.cleanup = () => {};
      this.generateHookOverrides(originalShader);
      this.output = {
        vertexDeclarations: new Set(),
        fragmentDeclarations: new Set(),
        uniforms: {}
      };
      this.uniformNodes = [];
      this.resetGLSLContext();
      this.isGenerating = false;
    }

    generate() {
      const prevFESDisabled = p5.disableFriendlyErrors;
      // We need a custom error handling system within shader generation
      p5.disableFriendlyErrors = true;

      this.isGenerating = true;
      this.userCallback();
      this.output.vertexDeclarations = [...this.output.vertexDeclarations].join('\n');
      this.output.fragmentDeclarations = [...this.output.fragmentDeclarations].join('\n');
      this.isGenerating = false;

      this.cleanup();
      p5.disableFriendlyErrors = prevFESDisabled;
      return this.output;
    }

    // This method generates the hook overrides which the user calls in their modify function.
    generateHookOverrides(originalShader) {
      const availableHooks = {
        ...originalShader.hooks.vertex,
        ...originalShader.hooks.fragment
      };

      const windowOverrides = {};
      const fnOverrides = {};

      Object.keys(availableHooks).forEach(hookName => {
        const hookTypes = originalShader.hookTypes(hookName);

        // These functions are where the user code is executed
        this[hookTypes.name] = function(userCallback) {
          // Create the initial nodes which are passed to the user callback
          // Also generate a string of the arguments for the code generation
          const argNodes = [];
          const argsArray = [];

          hookTypes.parameters.forEach(parameter => {
            // For hooks with structs as input we should pass an object populated with variable nodes
            if (!isGLSLNativeType(parameter.type.typeName)) {
              const structArg = {};
              parameter.type.properties.forEach(property => {
                structArg[property.name] = variableConstructor(`${parameter.name}.${property.name}`, property.type.typeName, true);
              });
              argNodes.push(structArg);
            } else {
              argNodes.push(
                variableConstructor(
                  parameter.name,
                  parameter.type.typeName,
                  true
                )
              );
            }
            const qualifiers = parameter.type.qualifiers.length > 0 ? parameter.type.qualifiers.join(' ') : '';
            argsArray.push(`${qualifiers} ${parameter.type.typeName} ${parameter.name}`.trim());
          });

          let returnedValue = userCallback(...argNodes);
          const expectedReturnType = hookTypes.returnType;
          const toGLSLResults = {};

          // If the expected return type is a struct we need to evaluate each of its properties
          if (!isGLSLNativeType(expectedReturnType.typeName)) {
            Object.entries(returnedValue)
              .forEach(([propertyName, propertyNode]) => {
                propertyNode = p5.dynamicNode(propertyNode);
                toGLSLResults[propertyName] = propertyNode
                  .toGLSLBase(this.context);
                this.context.updateComponents(propertyNode);
              });
          } else {
            if (!isShaderNode(returnedValue)) {
              returnedValue =
                nodeConstructors[expectedReturnType.typeName](returnedValue);
            } else if (isFloatType(returnedValue) && expectedReturnType.typeName.startsWith('vec')) {
              returnedValue =
                nodeConstructors[expectedReturnType.typeName](returnedValue);
            }
            toGLSLResults['notAProperty'] = returnedValue.toGLSLBase(this.context);
            this.context.updateComponents(returnedValue);
          }

          this.context.ifs.forEach(statement => {
            if (statement.usedIn.length === 0) { return; }
            const lines = statement.toGLSL(this.context);
            this.context.declarations.splice(
              statement.insertionPoint,
              0,
              lines
            );
          });
          // Build the final GLSL string.
          // The order of this code is a bit confusing, we need to call toGLSLBase
          let codeLines = [
            `(${argsArray.join(', ')}) {`,
            ...this.context.declarations,
            `\n  ${hookTypes.returnType.typeName} finalReturnValue;`
          ];

          Object.entries(toGLSLResults).forEach(([propertyName, result]) => {
            const propString = expectedReturnType.properties ? `.${propertyName}` : '';
            codeLines.push(`  finalReturnValue${propString} = ${result};`);
          });

          this.context.declarations = [];
          for (let key in this.context.varyings) {
            const declArray = this.context.varyings[key];
            const finalVaryingAssignments = [];
            declArray.forEach(obj => {
              const { node, value } = obj;
              finalVaryingAssignments.push(`  ${node.name} = ${value.toGLSLBase(this.context)};`);
              finalVaryingAssignments.unshift(...this.context.declarations);
              node.timesChanged = 0;
            });
            codeLines.push(...finalVaryingAssignments);
          }

          codeLines.push('  return finalReturnValue;', '}');
          this.output[hookName] = codeLines.join('\n');
          this.resetGLSLContext();
        };
        windowOverrides[hookTypes.name] = window[hookTypes.name];
        fnOverrides[hookTypes.name] = fn[hookTypes.name];

        // Expose the Functions to global scope for users to use
        window[hookTypes.name] = function(userOverride) {
          GLOBAL_SHADER[hookTypes.name](userOverride);
        };
        fn[hookTypes.name] = function(userOverride) {
          GLOBAL_SHADER[hookTypes.name](userOverride);
        };
      });


      this.cleanup = () => {
        for (const key in windowOverrides) {
          window[key] = windowOverrides[key];
        }
        for (const key in fnOverrides) {
          fn[key] = fnOverrides[key];
        }
      };
    }

    registerVarying(node, value) {
      if (!Array.isArray(this.context.varyings[node.name])) {
        this.context.varyings[node.name] = [];
      }
      this.context.varyings[node.name].push({ node, value });
      this.output.vertexDeclarations.add(`OUT ${node.type} ${node.name};`);
      this.output.fragmentDeclarations.add(`IN ${node.type} ${node.name};`);
    }

    resetGLSLContext() {
      this.uniformNodes.forEach(node => {
        node.usedIn = [];
        node.temporaryVariable = undefined;
      });
      this.context = {
        id: 0,
        getNextID() { return this.id++; },
        declarations: [],
        varyings: [],
        ifs: [],
        updateComponents: function(node, _emplaceAt, _changedComponents) {
          if (node.componentsChanged) {
            if (!_changedComponents) {
              _changedComponents = node.componentNames.map(() => true);
            }
            const lines = [];
            if (isVectorNode(node)) {
              node.componentNames.forEach((name, i) => {
                if (!_changedComponents[i]) return;
                if (node[name] !== node.originalValues[i]) {
                  const replacement = nodeConstructors['float'](node[name]);
                  const line = `  ${node.temporaryVariable}.${name} = ${replacement.toGLSLBase(this)};`;
                  lines.push(line);
                }
              });
            } else {
              const components = node.componentNames.map(name => {
                return node[name];
              });
              const replacement = nodeConstructors[node.type](components);
              const line = `  ${node.temporaryVariable} = ${replacement.toGLSLBase(this)};`;
              lines.push(line);
            }
            if (_emplaceAt) {
              this.declarations.splice(_emplaceAt, 0, ...lines);
            } else {
              this.declarations.push(...lines);
            }
            node.componentsChanged = false;
          }
        }
      };
      this.uniformNodes = [];
    }
  }

  // User function helpers
  function makeDependencyObject(dep) {
    if (isVectorType(dep)) {
      return {
        node: dep,
        isVector: true,
        originalComponents: [...dep.componentNames.map(name => dep[name])],
        get currentComponents() {
          return dep.componentNames.map(name => dep[name]);
        }
      };
    } else {
      return {
        node: dep,
        isVector: false
      };
    }
  }

  function makeDependencyArray(dependencies) {
    return dependencies.map(dep => makeDependencyObject(dep));
  }

  function conformVectorParameters(value, vectorDimensions) {
    // Allow arguments as arrays or otherwise. The following are all equivalent:
    // ([0,0,0,0]) (0,0,0,0) (0) ([0])
    if (!Array.isArray(value)) {
      value = [value];
    }
    value = value.flat();
    value = value.map(val => {
      if (isVectorType(val)) {
        const componentArray = val.componentNames.map(comp => val[comp]);
        return componentArray;
      } else {
        return val;
      }
    }).flat();
    // Populate arguments so uniformVector3(0) becomes [0,0,0]
    if (value.length === 1 && !isVectorNode(value[0])) {
      value = Array(vectorDimensions).fill(value[0]);
    }
    return value;
  }

  function swizzleTrap(size) {
    const swizzleSets = [
      ['x', 'y', 'z', 'w'],
      ['r', 'g', 'b', 'a'],
      ['s', 't', 'p', 'q']
    ].map(s => s.slice(0, size));
    return {
      get(target, property, receiver) {
        if (property in target) {
          return Reflect.get(...arguments);
        } else {
          for (const set of swizzleSets) {
            if ([...property].every(char => set.includes(char))) {
              if (property.length === 1) {
                return target[swizzleSets[0][set.indexOf(property[0])]];
              }
              const components = [...property].map(char => {
                const index = set.indexOf(char);
                const mappedChar = swizzleSets[0][index];
                return target[mappedChar];
              });

              const type = `vec${property.length}`;
              return nodeConstructors[type](components);
            }
          }
        }
      },
      set(target, property, value, receiver) {
        for (const set of swizzleSets) {
          const propertyCharArray = [...property];
          if (propertyCharArray.every(char => set.includes(char))) {
            const newValues = Array.isArray(value) ?
              value :
              Array(property.length).fill(value);
            propertyCharArray.forEach((char, i) => {
              const index = set.indexOf(char);
              const realProperty = swizzleSets[0][index];
              const descriptor = Object.getOwnPropertyDescriptor(
                target,
                realProperty
              );
              Reflect.set(target, realProperty, newValues[i], receiver);
            });
            return true;
          }
        }
        return Reflect.set(...arguments);
      }
    };
  }

  // User functions
  fn.If = function (condition, branch) {
    return new ConditionalNode(condition, branch);
  };

  fn.instanceID = function() {
    return variableConstructor('gl_InstanceID', 'int');
  };

  fn.getTexture = function(...userArgs) {
    const props = { args: ['sampler2D', 'vec2'], returnType: 'vec4', isp5Function: true };
    return fnNodeConstructor('getTexture', userArgs,  props);
  };

  // Generating uniformFloat, uniformVec, createFloat, etc functions
  // Maps a GLSL type to the name suffix for method names
  const GLSLTypesToIdentifiers = {
    int:    'Int',
    float:  'Float',
    vec2:   'Vector2',
    vec3:   'Vector3',
    vec4:   'Vector4',
    sampler2D: 'Texture'
  };

  function dynamicAddSwizzleTrap(node, _size) {
    if (node.type.startsWith('vec') || _size) {
      const size = _size ? _size : parseInt(node.type.slice(3));
      node =  new Proxy(node, swizzleTrap(size));
      node.addVectorComponents();
    }
    return node;
  }

  function binaryExpressionNodeConstructor(a, b, operator, isInternal) {
    let node;
    if (operator === '%') {
      node = new ModulusNode(a, b);
    } else {
      node = new BinaryExpressionNode(a, b, operator, isInternal);
    }
    return dynamicAddSwizzleTrap(node);
  }

  function variableConstructor(name, type, isInternal) {
    const node = new VariableNode(name, type, isInternal);
    return dynamicAddSwizzleTrap(node);
  }

  function fnNodeConstructor(name, userArgs, properties, isInternal) {
    let node = new FunctionCallNode(name, userArgs, properties, isInternal);
    node = dynamicAddSwizzleTrap(node);
    node.dependsOn = makeDependencyArray(node.args);
    const dependsOnConditionals = node.args.map(arg => {
      const conditionals = arg.usedIn
        .filter(n => isConditionalNode(n)).map(c => {
          if (c instanceof BranchNode) {
            return c.parent;
          } else {
            return c;
          }
        });
      return conditionals;
    }).flat();
    dependsOnConditionals.forEach(conditional => conditional.usedIn.push(node));

    return node;
  }

  const nodeConstructors = {
    int:   value => new IntNode(value),
    float: value => new FloatNode(value),
    vec2:  value => dynamicAddSwizzleTrap(new VectorNode(value, 'vec2')),
    vec3:  value => dynamicAddSwizzleTrap(new VectorNode(value, 'vec3')),
    vec4:  value => dynamicAddSwizzleTrap(new VectorNode(value, 'vec4')),
    dynamicVector: function(value) {
      const size = computeVectorLength(value);
      return this[`vec${size}`](value);
    }
  };

  for (const glslType in GLSLTypesToIdentifiers) {
    // Generate uniform*() Methods for creating uniforms
    const typeIdentifier = GLSLTypesToIdentifiers[glslType];
    const uniformMethodName = `uniform${typeIdentifier}`;

    ShaderGenerator.prototype[uniformMethodName] = function(...args) {
      let [name, ...defaultValue] = args;
      if (glslType.startsWith('vec') && !(defaultValue[0] instanceof Function)) {
        defaultValue = conformVectorParameters(
          defaultValue,
          parseInt(glslType.slice(3))
        );
        this.output.uniforms[`${glslType} ${name}`] = defaultValue;
      }
      else {
        this.output.uniforms[`${glslType} ${name}`] = defaultValue[0];
      }
      const uniform = variableConstructor(name, glslType, false);
      this.uniformNodes.push(uniform);
      return uniform;
    };

    fn[uniformMethodName] = function (...args) {
      return GLOBAL_SHADER[uniformMethodName](...args);
    };


    // We don't need a texture creation method.
    if (glslType === 'sampler2D') { continue; }

    const varyingMethodName = `varying${typeIdentifier}`;
    ShaderGenerator.prototype[varyingMethodName] = function(name) {
      return dynamicAddSwizzleTrap(new VaryingNode(name, glslType, false));
    };

    fn[varyingMethodName] = function (name) {
      return GLOBAL_SHADER[varyingMethodName](name);
    };

    // Generate the creation methods for creating variables in shaders
    const originalFn = fn[glslType];
    fn[glslType] = function (...value) {
      if (GLOBAL_SHADER?.isGenerating) {
        if (glslType.startsWith('vec')) {
          value = conformVectorParameters(value, parseInt(glslType.slice(3)));
        } else {
          value = value[0];
        }
        return nodeConstructors[glslType](value);
      } else if (originalFn) {
        return originalFn.apply(this, value);
      } else {
        p5._friendlyError(
          `It looks like you've called ${glslType} outside of a shader's modify() function.`
        );
      }
    };
  }

  // GLSL Built in functions
  // Add a whole lot of these functions.
  // https://docs.gl/el3/abs
  const builtInGLSLFunctions = {
    //////////// Trigonometry //////////
    'acos': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'acosh': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'asin': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'asinh': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'atan': [
      { args: ['genType'], returnType: 'genType', isp5Function: false },
      { args: ['genType', 'genType'], returnType: 'genType', isp5Function: false }
    ],
    'atanh': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'cos': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'cosh': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'degrees': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'radians': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'sin': { args: ['genType'], returnType: 'genType' , isp5Function: true },
    'sinh': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'tan': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'tanh': { args: ['genType'], returnType: 'genType', isp5Function: false },

    ////////// Mathematics //////////
    'abs': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'ceil': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'clamp': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false },
    'dFdx': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'dFdy': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'exp': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'exp2': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'floor': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'fma': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false },
    'fract': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'fwidth': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'inversesqrt': { args: ['genType'], returnType: 'genType', isp5Function: true },
    // 'isinf': {},
    // 'isnan': {},
    'log': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'log2': { args: ['genType'], returnType: 'genType', isp5Function: false },
    'max': [
      { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true },
      { args: ['genType', 'float'], returnType: 'genType', isp5Function: true }
    ],
    'min': [
      { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true },
      { args: ['genType', 'float'], returnType: 'genType', isp5Function: true }
    ],
    'mix': [
      { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false },
      { args: ['genType', 'genType', 'float'], returnType: 'genType', isp5Function: false }
    ],
    // 'mod': {},
    // 'modf': {},
    'pow': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true },
    'round': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'roundEven': { args: ['genType'], returnType: 'genType', isp5Function: false },
    // 'sign': {},
    'smoothstep': [
      { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false },
      { args: ['float', 'float', 'genType'], returnType: 'genType', isp5Function: false }
    ],
    'sqrt': { args: ['genType'], returnType: 'genType', isp5Function: true },
    'step': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: false },
    'trunc': { args: ['genType'], returnType: 'genType', isp5Function: false },

    ////////// Vector //////////
    'cross': { args: ['vec3', 'vec3'], returnType: 'vec3', isp5Function: true },
    'distance': { args: ['genType', 'genType'], returnType: 'float', isp5Function: true },
    'dot': { args: ['genType', 'genType'], returnType: 'float', isp5Function: true },
    // 'equal': {},
    'faceforward': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false },
    'length': { args: ['genType'], returnType: 'float', isp5Function: false },
    'normalize': { args: ['genType'], returnType: 'genType', isp5Function: true },
    // 'notEqual': {},
    'reflect': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: false },
    'refract': { args: ['genType', 'genType', 'float'], returnType: 'genType', isp5Function: false },

    ////////// Texture sampling //////////
    'texture': { args: ['sampler2D', 'vec2'], returnType: 'vec4', isp5Function: true }
  };

  Object.entries(builtInGLSLFunctions).forEach(([functionName, properties]) => {
    const isp5Function = Array.isArray(properties) ?
      properties[0].isp5Function :
      properties.isp5Function;
    if (isp5Function) {
      const originalFn = fn[functionName];
      fn[functionName] = function (...args) {
        if (GLOBAL_SHADER?.isGenerating) {
          return fnNodeConstructor(functionName, args, properties);
        } else {
          return originalFn.apply(this, args);
        }
      };
    } else {
      fn[functionName] = function (...args) {
        if (GLOBAL_SHADER?.isGenerating) {
          return new fnNodeConstructor(functionName, args, properties);
        } else {
          p5._friendlyError(
            `It looks like you've called ${functionName} outside of a shader's modify() function.`
          );
        }
      };
    }
  });
  // Alias GLSL's mix function as lerp in p5.strands
  // Bridging p5.js lerp and GLSL mix for consistency in shader expressions
  const originalLerp = fn.lerp;
  fn.lerp = function (...args) {
    if (GLOBAL_SHADER?.isGenerating) {
      return this.mix(...args); // Use mix inside p5.strands
    } else {
      return originalLerp.apply(this, args); // Fallback to normal p5.js lerp
    }
  };
  const originalNoise = fn.noise;
  fn.noise = function (...args) {
    if (!GLOBAL_SHADER?.isGenerating) {
      return originalNoise.apply(this, args); // fallback to regular p5.js noise
    }

    GLOBAL_SHADER.output.vertexDeclarations.add(noiseGLSL);
    GLOBAL_SHADER.output.fragmentDeclarations.add(noiseGLSL);
    // Handle noise(x, y) as noise(vec2)
    let nodeArgs;
    if (args.length === 2) {
      nodeArgs = [fn.vec2(args[0], args[1])];
    } else {
      nodeArgs = args;
    }

    return fnNodeConstructor('noise', nodeArgs, {
      args: ['vec2'],
      returnType: 'float'
    });
  };

}

export default shadergenerator;

if (typeof p5 !== 'undefined') {
  p5.registerAddon(shadergenerator);
}



/* ------------------------------------------------------------- */
/**
 * @method getWorldInputs
 * @description
 * Registers a callback to modify the world-space properties of each vertex in a shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to customize vertex positions, normals, texture coordinates, and colors before rendering. "World space" refers to the coordinate system of the 3D scene, before any camera or projection transformations are applied.
 * 
 * The callback receives a vertex object with the following properties:
 * - `position`: a three-component vector representing the original position of the vertex.
 * - `normal`: a three-component vector representing the direction the surface is facing.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 * 
 * This hook is available in:
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives a vertex object containing position (vec3), normal (vec3), texCoord (vec2), and color (vec4) properties. The function should return the modified vertex object.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     let t = uniformFloat(() => millis());
 *     getWorldInputs(inputs => {
 *       // Move the vertex up and down in a wave in world space
 *       // In world space, moving the object (e.g., with translate()) will affect these coordinates
*       // The sphere is ~50 units tall here, so 20 gives a noticeable wave
 *       inputs.position.y += 20 * sin(t * 0.001 + inputs.position.x * 0.05);
 *       return inputs;
 *     });
 *   });
 * }
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('red');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */

/**
 * @method combineColors
 * @description
 * Registers a callback to customize how color components are combined in the fragment shader. This hook can be used inside <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to control the final color output of a material. The callback receives an object with the following properties:
 *
 * - `baseColor`: a three-component vector representing the base color (red, green, blue).
 * - `diffuse`: a single number representing the diffuse reflection.
 * - `ambientColor`: a three-component vector representing the ambient color.
 * - `ambient`: a single number representing the ambient reflection.
 * - `specularColor`: a three-component vector representing the specular color.
 * - `specular`: a single number representing the specular reflection.
 * - `emissive`: a three-component vector representing the emissive color.
 * - `opacity`: a single number representing the opacity.
 *
 * The callback should return a vector with four components (red, green, blue, alpha) for the final color.
 *
 * This hook is available in:
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the object described above and returns a vector with four components for the final color.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     combineColors(components => {
 *       // Custom color combination: add a green tint using vector properties
 *       return [
 *         components.baseColor * components.diffuse +
 *           components.ambientColor * components.ambient +
 *           components.specularColor * components.specular +
 *           components.emissive +
 *           [0, 0.2, 0], // Green tint for visibility
 *         components.opacity
 *       ];
 *     });
 *   });
 * }
 * function draw() {
 *   background(255);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('white');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */

/**
 * @method beforeVertex
 * @private
 * @description
 * Registers a callback to run custom code at the very start of the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to set up variables or perform calculations that affect every vertex before processing begins. The callback receives no arguments.
 *
 * Note: This hook is currently limited to per-vertex operations; storing variables for later use is not supported.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called before each vertex is processed.
 */

/**
 * @method afterVertex
 * @private
 * @description
 * Registers a callback to run custom code at the very end of the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to perform cleanup or final calculations after all vertex processing is done. The callback receives no arguments.
 *
 * Note: This hook is currently limited to per-vertex operations; storing variables for later use is not supported.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called after each vertex is processed.
 */

/**
 * @method beforeFragment
 * @private
 * @description
 * Registers a callback to run custom code at the very start of the fragment shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to set up variables or perform calculations that affect every pixel before color calculations begin. The callback receives no arguments.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called before each fragment is processed.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     beforeFragment(() => {
 *       // Set a value for use in getFinalColor
 *       this.brightness = 0.5 + 0.5 * sin(millis() * 0.001);
 *     });
 *     getFinalColor(color => {
 *       // Use the value set in beforeFragment to tint the color
 *       color.r *= this.brightness; // Tint red channel
 *       return color;
 *     });
 *   });
 * }
 * function draw() {
 *   background(220);
 *   shader(myShader);
 *   noStroke();
 *   fill('teal');
 *   box(100);
 * }
 * </code>
 * </div>
 */

/**
 * @method getPixelInputs
 * @description
 * Registers a callback to modify the properties of each fragment (pixel) before the final color is calculated in the fragment shader. This hook can be used inside <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to adjust per-pixel data before lighting/mixing.
 *
 * The callback receives an `Inputs` object. Available fields depend on the shader:
 *
 * - In <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>:
 *   - `normal`: a three-component vector representing the surface normal.
 *   - `texCoord`: a two-component vector representing the texture coordinates (u, v).
 *   - `ambientLight`: a three-component vector representing the ambient light color.
 *   - `ambientMaterial`: a three-component vector representing the material's ambient color.
 *   - `specularMaterial`: a three-component vector representing the material's specular color.
 *   - `emissiveMaterial`: a three-component vector representing the material's emissive color.
 *   - `color`: a four-component vector representing the base color (red, green, blue, alpha).
 *   - `shininess`: a number controlling specular highlights.
 *   - `metalness`: a number controlling the metalness factor.
 *
 * - In <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>:
 *   - `color`: a four-component vector representing the stroke color (red, green, blue, alpha).
 *   - `tangent`: a two-component vector representing the stroke tangent.
 *   - `center`: a two-component vector representing the cap/join center.
 *   - `position`: a two-component vector representing the current fragment position.
 *   - `strokeWeight`: a number representing the stroke weight in pixels.
 *
 * Return the modified object to update the fragment.
 *
 * This hook is available in:
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the fragment inputs object and should return it after making any changes.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseMaterialShader().modify(() => {
 *     let t = uniformFloat(() => millis());
 *     getPixelInputs(inputs => {
 *       // Animate alpha (transparency) based on x position
 *       inputs.color.a = 0.5 + 0.5 * sin(inputs.texCoord.x * 10.0 + t * 0.002);
 *       return inputs;
 *     });
 *   });
 * }
 * function draw() {
 *   background(240);
 *   shader(myShader);
 *   lights();
 *   noStroke();
 *   fill('purple');
 *   circle(0, 0, 100);
 * }
 * </code>
 * </div>
 */

/**
 * @method shouldDiscard
 * @private
 * @description
 * Registers a callback to decide whether to discard (skip drawing) a fragment (pixel) in the fragment shader. This hook can be used inside <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to create effects like round points or custom masking. The callback receives a boolean:
 * - `willDiscard`: true if the fragment would be discarded by default
 *
 * Return true to discard the fragment, or false to keep it.
 *
 * This hook is available in:
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives a boolean and should return a boolean.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseStrokeShader().modify({
 *      'bool shouldDiscard': '(bool outside) { return outside; }'
 *   });
 * }
 * function draw() {
 *   background(255);
 *   strokeShader(myShader);
 *   strokeWeight(30);
 *   line(-width/3, 0, width/3, 0);
 * }
 * </code>
 * </div>
 */

/**
 * @method getFinalColor
 * @description
 * Registers a callback to change the final color of each pixel after all lighting and mixing is done in the fragment shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to adjust the color before it appears on the screen. The callback receives a four component vector representing red, green, blue, and alpha.
 *
 * Return a new color array to change the output color.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the color array and should return a color array.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     getFinalColor(color => {
 *       // Add a blue tint to the output color
 *       color.b += 0.4;
 *       return color;
 *     });
 *   });
 * }
 * function draw() {
 *   background(230);
 *   shader(myShader);
 *   noStroke();
 *   fill('green');
 *   circle(0, 0, 100);
 * }
 * </code>
 * </div>
 */

/**
 * @method afterFragment
 * @private
 * @description
 * Registers a callback to run custom code at the very end of the fragment shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to perform cleanup or final per-pixel effects after all color calculations are done. The callback receives no arguments.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which is called after each fragment is processed.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     getFinalColor(color => {
 *       // Add a purple tint to the color
 *       color.b += 0.2;
 *       return color;
 *     });
 *     afterFragment(() => {
 *       // This hook runs after the final color is set for each fragment.
 *       // You could use this for debugging or advanced effects.
 *     });
 *   });
 * }
 * function draw() {
 *   background(240);
 *   shader(myShader);
 *   noStroke();
 *   fill('purple');
 *   sphere(60);
 * }
 * </code>
 * </div>
 */

/**
 * @method getColor
 * @description
 * Registers a callback to set the final color for each pixel in a filter shader. This hook can be used inside <a href="#/p5/baseFilterShader">baseFilterShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to control the output color for each pixel. The callback receives the following arguments:
 * - `inputs`: an object with the following properties:
 *   - `texCoord`: a two-component vector representing the texture coordinates (u, v).
 *   - `canvasSize`: a two-component vector representing the canvas size in pixels (width, height).
 *   - `texelSize`: a two-component vector representing the size of a single texel in texture space.
 * - `canvasContent`: a texture containing the sketch's contents before the filter is applied.
 *
 * Return a four-component vector `[r, g, b, a]` for the pixel.
 *
 * This hook is available in:
 * - <a href="#/p5/baseFilterShader">baseFilterShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the inputs object and canvasContent, and should return a color array.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseFilterShader().modify(() => {
 *     getColor((inputs, canvasContent) => {
 *       // Warp the texture coordinates for a wavy effect
 *       let warped = [inputs.texCoord.x, inputs.texCoord.y + 0.1 * sin(inputs.texCoord.x * 10.0)];
 *       return getTexture(canvasContent, warped);
 *     });
 *   });
 * }
 * function draw() {
 *   background(180);
 *   // Draw something to the canvas
 *   fill('yellow');
 *   circle(0, 0, 150);
 *   filter(myShader);
 * }
 * </code>
 * </div>
 */

/**
 * @method getObjectInputs
 * @description
 * Registers a callback to modify the properties of each vertex before any transformations are applied in the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to move, color, or otherwise modify the raw model data. The callback receives an object with the following properties:
 * 
 * - `position`: a three-component vector representing the original position of the vertex.
 * - `normal`: a three-component vector representing the direction the surface is facing.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * Return the modified object to update the vertex.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the vertex object and should return it after making any changes.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     let t = uniformFloat(() => millis());
 *     getObjectInputs(inputs => {
 *       // Create a sine wave along the x axis in object space
 *       inputs.position.y += sin(t * 0.001 + inputs.position.x);
 *       return inputs;
 *     });
 *   });
 * }
 * function draw() {
 *   background(220);
 *   shader(myShader);
 *   noStroke();
 *   fill('orange');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */

/**
 * @method getCameraInputs
 * @description
 * Registers a callback to adjust vertex properties after the model has been transformed by the camera, but before projection, in the vertex shader. This hook can be used inside <a href="#/p5/baseColorShader">baseColorShader()</a>.modify() and similar shader <a href="#/p5.Shader/modify">modify()</a> calls to create effects that depend on the camera's view. The callback receives an object with the following properties:
 * 
 * - `position`: a three-component vector representing the position after camera transformation.
 * - `normal`: a three-component vector representing the normal after camera transformation.
 * - `texCoord`: a two-component vector representing the texture coordinates.
 * - `color`: a four-component vector representing the color of the vertex (red, green, blue, alpha).
 *
 * Return the modified object to update the vertex.
 *
 * This hook is available in:
 * - <a href="#/p5/baseColorShader">baseColorShader()</a>
 * - <a href="#/p5/baseMaterialShader">baseMaterialShader()</a>
 * - <a href="#/p5/baseNormalShader">baseNormalShader()</a>
 * - <a href="#/p5/baseStrokeShader">baseStrokeShader()</a>
 *
 * @param {Function} callback
 *        A callback function which receives the vertex object and should return it after making any changes.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * let myShader;
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 *   myShader = baseColorShader().modify(() => {
 *     getCameraInputs(inputs => {
 *       // Move vertices in camera space based on their x position
 *       let t = uniformFloat(() => millis());
 *       inputs.position.y += 30 * sin(inputs.position.x * 0.05 + t * 0.001);
 *       // Tint all vertices blue
 *       inputs.color.b = 1;
 *       return inputs;
 *     });
 *   });
 * }
 * function draw() {
 *   background(200);
 *   shader(myShader);
 *   noStroke();
 *   fill('red');
 *   sphere(50);
 * }
 * </code>
 * </div>
 */