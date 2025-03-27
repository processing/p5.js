/**
* @module 3D
* @submodule ShaderGenerator
* @for p5
* @requires core
*/

import { parse } from 'acorn';
import { ancestor } from 'acorn-walk';
import escodegen from 'escodegen';

function shadergenerator(p5, fn) {
  let GLOBAL_SHADER;

  const oldModify = p5.Shader.prototype.modify

  p5.Shader.prototype.modify = function(shaderModifier, options = { parser: true, srcLocations: false }) {
    if (shaderModifier instanceof Function) {
      let generatorFunction;
      if (options.parser) {
        const sourceString = shaderModifier.toString()
        const ast = parse(sourceString, {
          ecmaVersion: 2021,
          locations: options.srcLocations
        });
        ancestor(ast, ASTCallbacks);
        const transpiledSource = escodegen.generate(ast);
        generatorFunction = new Function(
          transpiledSource.slice(
            transpiledSource.indexOf("{") + 1,
            transpiledSource.lastIndexOf("}")
          )
        );
      } else {
        generatorFunction = shaderModifier;
      }
      const generator = new ShaderGenerator(generatorFunction, this, options.srcLocations);
      const generatedModifyArgument = generator.generate();
      return oldModify.call(this, generatedModifyArgument);
    }
    else {
      return oldModify.call(this, shaderModifier)
    }
  }

  // AST Transpiler Callbacks and their helpers
  function replaceBinaryOperator(codeSource) {
    switch (codeSource) {
      case '+': return 'add';
      case '-': return 'sub';
      case '*': return 'mult';
      case '/': return 'div';
      case '%': return 'mod';
    }
  }

  const ASTCallbacks = {
    VariableDeclarator(node, _state, _ancestors) {
      if (node.init.callee && node.init.callee.name?.startsWith('uniform')) {
        const uniformNameLiteral = {
          type: 'Literal',
          value: node.id.name
        }
        node.init.arguments.unshift(uniformNameLiteral);
      }
    },
    // The callbacks for AssignmentExpression and BinaryExpression handle
    // operator overloading including +=, *= assignment expressions
    AssignmentExpression(node, _state, _ancestors) {
      if (node.operator !== '=') {
        const methodName = replaceBinaryOperator(node.operator.replace('=',''));
        const rightReplacementNode = {
          type: 'CallExpression',
          callee: {
            type: "MemberExpression",
            object: node.left,
            property: {
              type: "Identifier",
              name: methodName,
            },
            computed: false,
          },
          arguments: [node.right]
        }
          node.operator = '=';
          node.right = rightReplacementNode;
        }
        if (node.right.type === 'ArrayExpression') {
          node.right = {
            type: 'CallExpression',
            callee: {
              type: "Identifier",
              name: "dynamicNode",
            },
            arguments: [node.right]
          }
        }
      },
    BinaryExpression(node, _state, ancestors) {
      // Don't convert uniform default values to node methods, as
      // they should be evaluated at runtime, not compiled.
      const isUniform = (ancestor) => {
        return ancestor.type === 'CallExpression'
          && ancestor.callee?.type === 'Identifier'
          && ancestor.callee?.name.startsWith('uniform');
      }
      if (ancestors.some(isUniform)) {
        return;
      }
      // If the left hand side of an expression is one of these types,
      // we should construct a node from it.
      const unsafeTypes = ["Literal", "ArrayExpression", "Identifier"];
      if (unsafeTypes.includes(node.left.type)) {
        const leftReplacementNode = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "dynamicNode",
          },
          arguments: [node.left]
        }
        node.left = leftReplacementNode;
      }

      // Replace the binary operator with a call expression
      // in other words a call to BaseNode.mult(), .div() etc.
      node.type = 'CallExpression';
      node.callee = {
        type: "MemberExpression",
        object: node.left,
        property: {
          type: "Identifier",
          name: replaceBinaryOperator(node.operator),
        },
      };
      node.arguments = [node.right];
    },
  }

  // This unfinished function lets you do 1 * 10
  // and turns it into float.mult(10)
  fn.dynamicNode = function (input) {
    if (isShaderNode(input)) {
      return input;
    }
    else if (typeof input === 'number') {
      return new FloatNode(input);
    }
    else if (Array.isArray(input)) {
      return new VectorNode(input, `vec${input.length}`);
    }
  }

  // Javascript Node API.
  // These classes are for expressing GLSL functions in Javascript without
  // needing to  transpile the user's code.


  class BaseNode {
    constructor(isInternal, type) {
      if (new.target === BaseNode) {
        throw new TypeError("Cannot construct BaseNode instances directly. This is an abstract class.");
      }
      this.type = type;
      this.componentNames = [];
      this.componentsChanged = false;
      // For tracking recursion depth and creating temporary variables
      this.isInternal = isInternal;
      this.usedIn = [];
      this.srcLine = null;
      // Stack Capture is used to get the original line of user code for Debug purposes
      if (GLOBAL_SHADER.srcLocations === true && isInternal === false) {
        try {
          throw new Error("StackCapture");
        } catch (e) {
          const lines = e.stack.split("\n");
          let userSketchLineIndex = 5;
          if (isBinaryExpressionNode(this)) { userSketchLineIndex--; };
          this.srcLine = lines[userSketchLineIndex].trim();
        }
      }
    }

    addVectorComponents() {
      if (this.type.startsWith('vec')) {
        const vectorDimensions = +this.type.slice(3);
        this.componentNames = ['x', 'y', 'z', 'w'].slice(0, vectorDimensions);

        for (let componentName of this.componentNames) {
          // let value = new FloatNode()
          let value = new ComponentNode(this, componentName, 'float', true);
          Object.defineProperty(this, componentName, {
            get() {
              return value;
            },
            set(newValue) {
              this.componentsChanged = true;
              value = newValue;
            }
          })
        }
      }
    }

    // The base node implements a version of toGLSL which determines whether the generated code should be stored in a temporary variable.
    toGLSLBase(context){
      if (this.shouldUseTemporaryVariable()) {
        return this.getTemporaryVariable(context);
      }
      else {
        return this.toGLSL(context);
      }
    }

    shouldUseTemporaryVariable() {
      if (this.isInternal || isVariableNode(this) || this.type === 'sampler2D') { return false; }
      // Swizzles must use temporary variables as otherwise they will not be registered
      if (this.componentsChanged || hasTemporaryVariable(this)) { return true; }
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
        let line = "";
        if (this.srcLine) {
          line += `\n// From ${this.srcLine}\n`;
        }
        line += "  " + this.type + " " + this.temporaryVariable + " = " + this.toGLSL(context) + ";";
        context.declarations.push(line);
      }
      return this.temporaryVariable;
    };

    // Binary Operators
    add(other)  { return new BinaryExpressionNode(this, this.enforceType(other), '+'); }
    sub(other)  { return new BinaryExpressionNode(this, this.enforceType(other), '-'); }
    mult(other) { return new BinaryExpressionNode(this, this.enforceType(other), '*'); }
    div(other)  { return new BinaryExpressionNode(this, this.enforceType(other), '/'); }
    mod(other)  { return new ModulusNode(this, this.enforceType(other)); }

    // Check that the types of the operands are compatible.
    enforceType(other){
      if (isShaderNode(other)){
        if (!isGLSLNativeType(other.type)) {
          throw new TypeError (`You've tried to perform an operation on a struct of type: ${other.type}. Try accessing a member on that struct with '.'`)
        }
        if (!isGLSLNativeType(other.type)) {
          throw new TypeError (`You've tried to perform an operation on a struct of type: ${other.type}. Try accessing a member on that struct with '.'`)
        }
        if ((isFloatType(this) || isVectorType(this)) && isIntType(other)) {
          return new FloatNode(other)
        }
        return other;
      }
      else if(typeof other === 'number') {
        if (isIntType(this)) {
          return new IntNode(other);
        }
        return new FloatNode(other);
      }
      else if(Array.isArray(other)) {
        return new VectorNode(other, `vec${other.length}`)
      }
      else {
        return new this.constructor(other);
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
      throw new TypeError("Not supposed to call this function on BaseNode, which is an abstract class.");
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
      else if (typeof this.x === "number") {
        return `${Math.floor(this.x)}`;
      }
      else {
        return `int(${this.x})`;
      }
    }
  }

  class FloatNode extends BaseNode {
    constructor(x = 0, isInternal = false){
      super(isInternal, 'float');
      this.x = x;
    }

    toGLSL(context) {
      if (isShaderNode(this.x)) {
        let code = this.x.toGLSLBase(context);
        return isFloatType(this.x) ? code : `float(${code})`;
      }
      else if (typeof this.x === "number") {
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
      values = conformVectorParameters(values, +type.slice(3));
      this.componentNames = ['x', 'y', 'z', 'w'].slice(0, values.length);
      this.componentNames.forEach((component, i) => {
        this[component] = isFloatNode(values[i]) ? values[i] : new FloatNode(values[i], true);
      });
    }

    toGLSL(context) {
      let glslArgs = ``;

      this.componentNames.forEach((component, i) => {
        const comma = i === this.componentNames.length - 1 ? `` : `, `;
        if (!isShaderNode(this[component])) {
          this[component] = new FloatNode(this[component]);
        }
        glslArgs += `${this[component].toGLSLBase(context)}${comma}`;
      })

      return `${this.type}(${glslArgs})`;
    }
  }

  // Function Call Nodes
  class FunctionCallNode extends BaseNode {
    constructor(name, args, properties, isInternal = false) {
      if (args.length !== properties.args.length) {
        throw new Error(`Function ${name} expects ${properties.args.length} arguments, but ${args.length} were provided.`);
      }
      let inferredGenType = args.find((arg, i) => 
        properties.args[i] === 'genType' && isShaderNode(arg)
      )?.type;
      if (!inferredGenType || inferredGenType === 'float') {
        let arrayArg = args.find(arg => Array.isArray(arg));
        inferredGenType = arrayArg ? `vec${arrayArg.length}` : undefined;
      }
      if (!inferredGenType) {
        inferredGenType = 'float';
      }
      args = args.map((arg, i) => {
        if (!isShaderNode(arg)) {
          const typeName = properties.args[i] === 'genType' ? inferredGenType : properties.args[i];
          arg = nodeConstructors[typeName](arg);
        }
        return arg;
      })
      if (properties.returnType === 'genType') {
        properties.returnType = inferredGenType;
      }
      super(isInternal, properties.returnType);
      for (const arg of args) {
        arg.usedIn.push(this);
      }
      this.name = name;
      this.args = args;
      this.argumentTypes = properties.args;
      this.addVectorComponents();
    }

    deconstructArgs(context) {
      let argsString = this.args.map((argNode, i) => {
        if (isIntType(argNode) && this.argumentTypes[i] != 'float') {
          argNode = argNode.toFloat();
        }
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
      this.addVectorComponents();
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
      if (isBinaryExpressionNode(this.parent) && !this.parent.temporaryVariable) {
        parentName = `(${parentName})`;
      }
      return `${parentName}.${this.componentName}`;
    }
  }

  // Binary Operator Nodes
  class BinaryExpressionNode extends BaseNode {
    constructor(a, b, operator, isInternal = false) {
      super(isInternal, null);
      this.op = operator;
      this.a = a;
      this.b = b;
      for (const operand of [a, b]) {
        operand.usedIn.push(this);
      }
      this.type = this.determineType();
      this.addVectorComponents();
    }

    // We know that both this.a and this.b are nodes because of BaseNode.enforceType
    determineType() {
      if (this.a.type === this.b.type) {
        return this.a.type;
      }
      else if (isVectorType(this.a) && isFloatType(this.b)) {
        return this.a.type;
      }
      else if (isVectorType(this.b) && isFloatType(this.a)) {
        return this.b.type;
      }
      else if (isFloatType(this.a) && isIntType(this.b)
        || isIntType(this.a) && isFloatType(this.b)
      ) {
        return 'float';
      }
      else {
        throw new Error("Incompatible types for binary operator");
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
      const a = this.processOperand(this.a, context);
      const b = this.processOperand(this.b, context);
      return `${a} ${this.op} ${b}`;
    }
  }

  class ModulusNode extends BinaryExpressionNode {
    constructor(a, b) {
      super(a, b);
    }
    toGLSL(context) {
      // Switch on type between % or mod()
      if (isVectorType(this) || isFloatType(this)) {
        return `mod(${this.a.toGLSLBase(context)}, ${this.b.toGLSLBase(context)})`;
      }
      return `${this.processOperand(context, this.a)} % ${this.processOperand(context, this.b)}`;
    }
  }

  // TODO: finish If Node
  class ConditionalNode extends BaseNode {
    constructor(value) {
      super(value);
      this.value = value;
      this.condition = null;
      this.thenBranch = null;
      this.elseBranch = null;
    }
    // conditions
    equalTo(value){}
    greaterThan(value) {}
    greaterThanEqualTo(value) {}
    lessThan(value) {}
    lessThanEqualTo(value) {}
    // modifiers
    not() {}
    or() {}
    and() {}
    // returns
    thenReturn(value) {}
    elseReturn(value) {}
    //
    thenDiscard() {
      new ConditionalDiscard(this.condition);
    };
  };

  class ConditionalDiscard extends BaseNode {
    constructor(condition){
      this.condition = condition;
    }
    toGLSL(context) {
      context.discardConditions.push(`if(${this.condition}{discard;})`);
    }
  }

  fn.if = function (value) {
    return new ConditionalNode(value);
  }

  // Node Helper functions
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

  function hasTemporaryVariable(node) {
    return (node.temporaryVariable);
  }

  function isLiteralNode(node) {
    return (node instanceof FloatNode || node instanceof IntNode);
  }

  function isFunctionCallNode(node) {
    return (node instanceof FunctionCallNode);
  }

  function isVectorNode(node) {
    return (node instanceof VectorNode)
  }

    // Helper function to check if a type is a user defined struct or native type
    function isGLSLNativeType(typeName) {
      // Supported types for now
      const glslNativeTypes = ['int', 'float', 'vec2', 'vec3', 'vec4', 'sampler2D'];
      return glslNativeTypes.includes(typeName);
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
        uniforms: {},
      }
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
      this.isGenerating = false;

      this.cleanup();
      p5.disableFriendlyErrors = prevFESDisabled;
      return this.output;
    }

    // This method generates the hook overrides which the user calls in their modify function.
    generateHookOverrides(originalShader) {
      const availableHooks = {
        ...originalShader.hooks.vertex,
        ...originalShader.hooks.fragment,
      }

      const windowOverrides = {};

      Object.keys(availableHooks).forEach((hookName) => {
        const hookTypes = originalShader.hookTypes(hookName);

        // These functions are where the user code is executed
        this[hookTypes.name] = function(userCallback) {
          // Create the initial nodes which are passed to the user callback
          // Also generate a string of the arguments for the code generation
          const argNodes = []
          const argsArray = [];

          hookTypes.parameters.forEach((parameter) => {
            // For hooks with structs as input we should pass an object populated with variable nodes
            if (!isGLSLNativeType(parameter.type.typeName)) {
              const structArg = {};
              parameter.type.properties.forEach((property) => {
                structArg[property.name] = new VariableNode(`${parameter.name}.${property.name}`, property.type.typeName, true);
              });
              argNodes.push(structArg);
            } else {
              argNodes.push(
                new VariableNode(parameter.name, parameter.type.typeName, true)
              );
            }
            const qualifiers = parameter.type.qualifiers.length > 0 ? parameter.type.qualifiers.join(' ') : '';
            argsArray.push(`${qualifiers} ${parameter.type.typeName} ${parameter.name}`.trim())
          })

          let returnedValue = userCallback(...argNodes);
          const expectedReturnType = hookTypes.returnType;
          const toGLSLResults = {};

          const updateComponents = (node) => {
            if (node.componentsChanged) {
              const components = node.componentNames.map((componentName) => {
                return node[componentName]
              });
              const replacement = nodeConstructors[node.type](components);
              this.context.declarations.push(
                `  ${node.temporaryVariable} = ${replacement.toGLSLBase(this.context)};`
              );
            }
          }

          // If the expected return type is a struct we need to evaluate each of its properties
          if (!isGLSLNativeType(expectedReturnType.typeName)) {
            Object.entries(returnedValue).forEach(([propertyName, propertyNode]) => {
              propertyNode = dynamicNode(propertyNode);
              toGLSLResults[propertyName] = propertyNode.toGLSLBase(this.context);
              updateComponents(propertyNode);
            });
          } else {
            if (!isShaderNode(returnedValue)) {
              returnedValue = nodeConstructors[expectedReturnType.typeName](returnedValue)
            }
            toGLSLResults['notAProperty'] = returnedValue.toGLSLBase(this.context);
            updateComponents(returnedValue);
          }

          // Build the final GLSL string.
          // The order of this code is a bit confusing, we need to call toGLSLBase
          let codeLines = [
            `(${argsArray.join(', ')}) {`,
            ...this.context.declarations,
            `\n  ${hookTypes.returnType.typeName} finalReturnValue;`
          ];

          Object.entries(toGLSLResults).forEach(([propertyName, result]) => {
            const propString = expectedReturnType.properties ? `.${propertyName}` : '';
            codeLines.push(`  finalReturnValue${propString} = ${result};`)
          })

          codeLines.push('  return finalReturnValue;', '}');
          this.output[hookName] = codeLines.join('\n');
          this.resetGLSLContext();
        }

        windowOverrides[hookTypes.name] = window[hookTypes.name];

        // Expose the Functions to global scope for users to use
        window[hookTypes.name] = function(userOverride) {
          GLOBAL_SHADER[hookTypes.name](userOverride);
        };
      });

      this.cleanup = () => {
        for (const key in windowOverrides) {
          window[key] = windowOverrides[key];
        }
      };
    }

    resetGLSLContext() {
      this.uniformNodes.forEach((node) => {
        node.usedIn = [];
        node.temporaryVariable = undefined;
      });
      this.context = {
        id: 0,
        getNextID: function() { return this.id++ },
        declarations: [],
      }
      this.uniformNodes = [];
    }
  }

  // User function helpers
  function conformVectorParameters(value, vectorDimensions) {
    // Allow arguments as arrays or otherwise. The following are all equivalent:
    // ([0,0,0,0]) (0,0,0,0) (0) ([0])
    if (!Array.isArray(value)) {
      value = [value];
    }
    value = value.flat();
    // Populate arguments so uniformVector3(0) becomes [0,0,0]
    if (value.length === 1) {
      value = Array(vectorDimensions).fill(value[0]);
    }
    return value;
  }

  // User functions
  fn.instanceID = function() {
    return new VariableNode('gl_InstanceID', 'int');
  }

  fn.discard = function() {
    return new VariableNode('discard', 'keyword');
  }

  // Generating uniformFloat, uniformVec, createFloat, etc functions
  // Maps a GLSL type to the name suffix for method names
  const GLSLTypesToIdentifiers = {
    int:    'Int',
    float:  'Float',
    vec2:   'Vector2',
    vec3:   'Vector3',
    vec4:   'Vector4',
    sampler2D: 'Texture',
  };

  const nodeConstructors = {
    int:   (value) => new IntNode(value),
    float: (value) => new FloatNode(value),
    vec2:  (value) => new VectorNode(value, 'vec2'),
    vec3:  (value) => new VectorNode(value, 'vec3'),
    vec4:  (value) => new VectorNode(value, 'vec4'),
  };

  for (const glslType in GLSLTypesToIdentifiers) {
    // Generate uniform*() Methods for creating uniforms
    const typeIdentifier = GLSLTypesToIdentifiers[glslType];
    const uniformMethodName = `uniform${typeIdentifier}`;

    ShaderGenerator.prototype[uniformMethodName] = function(...args) {
      let [name, ...defaultValue] = args;

      if(glslType.startsWith('vec') && !(defaultValue[0] instanceof Function)) {
        defaultValue = conformVectorParameters(defaultValue, +glslType.slice(3));
        this.output.uniforms[`${glslType} ${name}`] = defaultValue;
      }
      else {
        this.output.uniforms[`${glslType} ${name}`] = defaultValue[0];
      }
      const uniform = new VariableNode(name, glslType, false);
      this.uniformNodes.push(uniform);
      return uniform;
    };

    fn[uniformMethodName] = function (...args) {
      return GLOBAL_SHADER[uniformMethodName](...args);
    };

    // We don't need a createTexture method.
    if (glslType === 'sampler2D') { continue; }

    // Generate the create*() Methods for creating variables in shaders
    const createMethodName = `create${typeIdentifier}`;
    fn[createMethodName] = function (...value) {
      if(glslType.startsWith('vec')) {
        value = conformVectorParameters(value, +glslType.slice(3));
      } else {
        value = value[0];
      }
      return nodeConstructors[glslType](value);
    }
  }

  // GLSL Built in functions
  // Add a whole lot of these functions.
  // https://docs.gl/el3/abs
  const builtInGLSLFunctions = {
    //////////// Trigonometry //////////
    'acos': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'acosh': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'asin': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'asinh': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'atan': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: false},
    'atanh': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'cos': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'cosh': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'degrees': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'radians': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'sin': { args: ['genType'], returnType: 'genType' , isp5Function: true},
    'sinh': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'tan': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'tanh': { args: ['genType'], returnType: 'genType', isp5Function: false},

    ////////// Mathematics //////////
    'abs': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'ceil': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'clamp': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false},
    'dFdx': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'dFdy': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'exp': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'exp2': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'floor': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'fma': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false},
    'fract': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'fwidth': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'inversesqrt': { args: ['genType'], returnType: 'genType', isp5Function: true},
    // 'isinf': {},
    // 'isnan': {},
    'log': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'log2': { args: ['genType'], returnType: 'genType', isp5Function: false},
    'max': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true},
    'min': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true},
    'mix': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false},
    // 'mod': {},
    // 'modf': {},
    'pow': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true},
    'round': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'roundEven': { args: ['genType'], returnType: 'genType', isp5Function: false},
    // 'sign': {},
    'smoothstep': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false},
    'sqrt': { args: ['genType'], returnType: 'genType', isp5Function: true},
    'step': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: false},
    'trunc': { args: ['genType'], returnType: 'genType', isp5Function: false},

    ////////// Vector //////////
    'cross': { args: ['vec3', 'vec3'], returnType: 'vec3', isp5Function: true},
    'distance': { args: ['genType', 'genType'], returnType: 'float', isp5Function: true},
    'dot': { args: ['genType', 'genType'], returnType: 'float', isp5Function: true},
    // 'equal': {},
    'faceforward': { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false},
    'length': { args: ['genType'], returnType: 'float', isp5Function: false},
    'normalize': { args: ['genType'], returnType: 'genType', isp5Function: true},
    // 'notEqual': {},
    'reflect': { args: ['genType', 'genType'], returnType: 'genType', isp5Function: false},
    'refract': { args: ['genType', 'genType', 'float'], returnType: 'genType', isp5Function: false},
    // Texture sampling
    'texture': {args: ['sampler2D', 'vec2'], returnType: 'vec4', isp5Function: true},
  }

  Object.entries(builtInGLSLFunctions).forEach(([functionName, properties]) => {
    if (properties.isp5Function) {
      const originalFn = fn[functionName];
      fn[functionName] = function (...args) {
        if (GLOBAL_SHADER?.isGenerating) {
          return new FunctionCallNode(functionName, args, properties)
        } else {
          return originalFn.apply(this, args);
        }
      }
    } else {
      fn[functionName] = function (...args) {
        if (GLOBAL_SHADER?.isGenerating) {
          return new FunctionCallNode(functionName, args, properties);
        } else {
          p5._friendlyError(
            `It looks like you've called ${functionName} outside of a shader's modify() function.`
          );
        }
      }
    }
  })

  // const oldTexture = p5.prototype.texture;
  // p5.prototype.texture = function(...args) {
  //   if (isShaderNode(args[0])) {
  //     return new FunctionCallNode('texture', args, 'vec4');
  //   } else {
  //     return oldTexture.apply(this, args);
  //   }
  // }
}

export default shadergenerator;

if (typeof p5 !== 'undefined') {
  p5.registerAddon(shadergenerator)
}
