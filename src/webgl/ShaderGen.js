/**
* @module 3D
* @submodule ShaderGenerator
* @for p5
* @requires core
*/

import { parse } from 'acorn';
import { simple } from 'acorn-walk';
import escodegen from 'escodegen';

function shadergen(p5, fn) {
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
        simple(ast, ASTCallbacks);
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
      const generator = new ShaderGenerator(generatorFunction, this, options.srcLocations)
      const generatedModifyArgument = generator.generate();
      console.log("SRC STRING: ", generatorFunction);
      console.log("NEW OPTIONS:", generatedModifyArgument['vec4 getFinalColor'])

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
    VariableDeclarator(node) {
      if (node.init.callee && node.init.callee.name.startsWith('uniform')) {
        const uniformNameLiteral = {
          type: 'Literal',
          value: node.id.name
        }
        node.init.arguments.unshift(uniformNameLiteral);
      }
    },
    // The callbacks for AssignmentExpression and BinaryExpression handle
    // operator overloading including +=, *= assignment expressions 
    AssignmentExpression(node) {
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
      },
    BinaryExpression(node) {
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
      this.swizzleAccessed = false;
      this.swizzleChanged = false;
      // For tracking recursion depth and creating temporary variables
      this.isInternal = isInternal;
      this.usedIn = [];
      this.dependsOn = [];
      this.srcLine = null;
      // Stack Capture is used to get the original line of user code for Debug purposes
      if (GLOBAL_SHADER.srcLocations === true && isInternal === false) {
        try {
          throw new Error("StackCapture");
        } catch (e) {
          const lines = e.stack.split("\n");
          let userSketchLineIndex = 5;
          if (isBinaryOperatorNode(this)) { userSketchLineIndex--; };
          this.srcLine = lines[userSketchLineIndex].trim();
        }
      }
    }
    // get type() {
    //   return this._type;
    // }

    // set type(value) {
    //   this._type = value;
    // }

    addVectorComponents() {
      if (this.type.startsWith('vec')) {
        const vectorDimensions = +this.type.slice(3);
        this.componentNames = ['x', 'y', 'z', 'w'].slice(0, vectorDimensions);

        for (let componentName of this.componentNames) {
          // let value = new FloatNode()
          let value = new ComponentNode(this, componentName, 'float', true);
          Object.defineProperty(this, componentName, {
            get() {
              this.swizzleAccessed = true;
              return value;
            },
            set(newValue) {
              this.swizzleChanged = true;
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
      if (this.swizzleChanged) { return true; }
      if (this.isInternal || isVariableNode(this)) { return false; }
      let score = 0;
      score += isBinaryOperatorNode(this);
      score += isVectorNode(this) * 2;
      score += this.usedIn.length;
      return score > 3;
    }
    
    getTemporaryVariable(context) {
      if (!this.temporaryVariable) {
        this.temporaryVariable = `temp_${context.getNextID()}`;
        let line = "";
        if (this.srcLine) {
          line += `\n// From ${this.srcLine}\n`;
        }
        if (this.swizzleChanged) {
          const valueArgs = [];
          for (let componentName of this.componentNames) {
            valueArgs.push(this[componentName])
          }
          console.log(this, valueArgs)
          const replacement = nodeConstructors[this.type](valueArgs)
          line += this.type + " " + this.temporaryVariable + " = " + this.toGLSL(context) + ";";
          line += `\n` + this.temporaryVariable + " = " + replacement.toGLSL(context) + ";";
        } else {
          line += this.type + " " + this.temporaryVariable + " = " + this.toGLSL(context) + ";";
        }
        context.declarations.push(line);
      }
      return this.temporaryVariable;
    };
    
    // Binary Operators
    add(other)  { return new BinaryOperatorNode(this, this.enforceType(other), '+'); }
    sub(other)  { return new BinaryOperatorNode(this, this.enforceType(other), '-'); }
    mult(other) { return new BinaryOperatorNode(this, this.enforceType(other), '*'); }
    div(other)  { return new BinaryOperatorNode(this, this.enforceType(other), '/'); }
    mod(other)  { return new ModulusNode(this, this.enforceType(other)); }

    // Check that the types of the operands are compatible.
    // TODO: improve this with less branching if elses
    enforceType(other){
      if (isShaderNode(other)){
        if ((isFloatNode(this) || isVectorNode(this)) && isIntNode(other)) {
          return new FloatNode(other)
        }
        return other;
      }
      else if(typeof other === 'number') {
        if (isIntNode(this)) {
          return new IntNode(other);
        }
        return new FloatNode(other);
      } 
      else {
        return new this.constructor(other);
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
        return isIntNode(this.x.type) ? code : `int(${code})`;
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
        return isFloatNode(this.x) ? code : `float(${code})`;
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
      this.componentNames = ['x', 'y', 'z', 'w'].slice(0, values.length);
      this.componentNames.forEach((component, i) => {
        this[component] = new FloatNode(values[i], true);
      });
    }
    
    toGLSL(context) {
      let glslArgs = ``;

      this.componentNames.forEach((component, i) => {
        const comma = i === this.componentNames.length - 1 ? `` : `, `;
        glslArgs += `${this[component].toGLSLBase(context)}${comma}`;
      })

      return `${this.type}(${glslArgs})`;
    }
  }

  // Function Call Nodes
  class FunctionCallNode extends BaseNode {
    constructor(name, args, type, isInternal = false) {
      super(isInternal, type);
      this.name = name;
      this.args = args;
      // TODO:
      this.argumentTypes = {

      };
    }

    deconstructArgs(context) {
      if (Array.isArray(this.args)) {
        return this.args.map((argNode) => argNode.toGLSLBase(context)).join(', ');
      } else {
        return `${this.args.toGLSLBase(context)}`;
      }
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
      const parentName = this.parent.toGLSLBase(context);
      // const parentName = this.parent.temporaryVariable ? this.parent.temporaryVariable : this.parent.name; 
      return `${parentName}.${this.componentName}`;
    }
  }

  // Binary Operator Nodes
  class BinaryOperatorNode extends BaseNode {
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
      else if (isVectorNode(this.a) && isFloatNode(this.b)) {
        return this.a.type;
      } 
      else if (isVectorNode(this.b) && isFloatNode(this.a)) {
        return this.b.type;
      } 
      else if (isFloatNode(this.a) && isIntNode(this.b) 
        || isIntNode(this.a) && isFloatNode(this.b)
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
      if (isBinaryOperatorNode(operand) && !operand.temporaryVariable) {
        code = `(${code})`;
      }
      if (this.type === 'float' && isIntNode(operand)) {
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

  // TODO: Correct the implementation for floats/ genType etc
  class ModulusNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b);
    }
    toGLSL(context) {
      // Switch on type between % or mod()
      if (isVectorNode(this) || isFloatNode(this)) {
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

  function isIntNode(node) { 
    return (isShaderNode(node) && (node.type === 'int')); 
  }

  function isFloatNode(node) { 
    return (isShaderNode(node) && (node.type === 'float')); 
  }

  function isVectorNode(node) { 
    return (isShaderNode(node) && (node.type === 'vec2'|| node.type === 'vec3' || node.type === 'vec4')); 
  }

  function isBinaryOperatorNode(node) {
    return (node instanceof BinaryOperatorNode);
  }

  function isVariableNode(node) { 
    return (node instanceof VariableNode || node instanceof ComponentNode || typeof(node.temporaryVariable) != 'undefined'); 
  }

  // Shader Generator
  // This class is responsible for converting the nodes into an object containing GLSL code, to be used by p5.Shader.modify

  class ShaderGenerator {
    constructor(modifyFunction, originalShader, srcLocations) {
      GLOBAL_SHADER = this;
      this.modifyFunction = modifyFunction;
      this.srcLocations = srcLocations;
      this.generateHookBuilders(originalShader);
      this.output = {
        uniforms: {},
      }
      this.resetGLSLContext();
    }

    generate() {
      this.modifyFunction();
      console.log(this.output);
      return this.output;
    }

    generateHookBuilders(originalShader) {
      const availableHooks = {
        ...originalShader.hooks.vertex,
        ...originalShader.hooks.fragment,
      }
      
      // Defines a function for each of the hooks for the shader we are modifying.
      Object.keys(availableHooks).forEach((hookName) => {
        const hookTypes = originalShader.hookTypes(hookName)
        this[hookTypes.name] = function(userOverride) {
          let hookArgs = []
          let argsArray = [];

          hookTypes.parameters.forEach((parameter, i) => {
            hookArgs.push(
              new VariableNode(parameter.name, parameter.type.typeName, true)
            );
            if (i === 0) {
              argsArray.push(`${parameter.type.typeName} ${parameter.name}`);
            } else {
              argsArray.push(`, ${parameter.type.typeName} ${parameter.name}`);
            }
          })
          const toGLSLResult = userOverride(...hookArgs).toGLSLBase(this.context);
          let codeLines = [`(${argsArray.join(', ')}) {`, this.context.declarations.slice()].flat();
          codeLines.push(`\n${hookTypes.returnType.typeName} finalReturnValue = ${toGLSLResult};
                          \nreturn finalReturnValue;
                          \n}`);
          this.output[hookName] = codeLines.join('\n');
          this.resetGLSLContext();
        }

        // Expose the Functions to global scope for users to use
        window[hookTypes.name] = function(userOverride) {
          GLOBAL_SHADER[hookTypes.name](userOverride); 
        };
      })
    }

    resetGLSLContext() { 
      this.context = {
        id: 0,
        getNextID: function() { return this.id++ },
        declarations: [],
      }
    }
  }

  // User function helpers
  function conformVectorParameters(value, vectorDimensions) {
    // Allow arguments as arrays ([0,0,0,0]) or not (0,0,0,0)
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
  
  fn.uvCoords = function() {
    return new VariableNode('vTexCoord', 'vec2');
  }

  fn.discard = function() {
    return new VariableNode('discard', 'keyword');
  }
  
  // Generating uniformFloat, uniformVec, createFloat, etc functions
  // Maps a GLSL type to the name suffix for method names
  const GLSLTypesToSuffixes = {
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

  for (const glslType in GLSLTypesToSuffixes) {
    // Generate uniform*() Methods for creating uniforms
    const typeIdentifier = GLSLTypesToSuffixes[glslType];
    const uniformMethodName = `uniform${typeIdentifier}`;

    ShaderGenerator.prototype[uniformMethodName] = function(...args) {
      let [name, ...defaultValue] = args;
      if(glslType.startsWith('vec')) {
        defaultValue = conformVectorParameters(defaultValue, +glslType.slice(3));
        this.output.uniforms[`${glslType} ${name}`] = defaultValue;
      } 
      else {
        console.log("defaultValue: ",defaultValue);
        console.log("defaultValue[0]: ",defaultValue[0])
        this.output.uniforms[`${glslType} ${name}`] = defaultValue[0];
      }

      let safeType = glslType === 'sampler2D' ? 'vec4' : glslType;
      const uniform = new VariableNode(name, safeType, false);
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
  // TODO: 
  // Add a whole lot of these functions. 
  // https://docs.gl/el3/abs

  // constructor(name, args, type, isInternal = false) {

  const builtInFunctions = {
    // Trigonometry
    'acos': {},
    // 'acosh': {},
    'asin': {},
    // 'asinh': {},
    'atan': {},
    // 'atanh': {},
    'cos': {},
    // 'cosh': {},
    'degrees': {},
    'radians': {},
    'sin': {},
    // 'sinh': {},
    'tan': {},
    // 'tanh': {},
    // Mathematics
    'abs': {},
    'ceil': {},
    'clamp': {},
    'dFdx': {},
    'dFdy': {},
    'exp': {},
    'exp2': {},
    'floor': {},
    // 'fma': {},
    'fract': {},
    // 'fwidth': {},
    // 'inversesqrt': {},
    // 'isinf': {},
    // 'isnan': {},
    // 'log': {},
    // 'log2': {},
    'max': {},
    'min': {},
    'mix': {},
    // 'mod': {},
    // 'modf': {},
    'pow': {},
    // 'round': {},
    // 'roundEven': {},
    // 'sign': {},
    'smoothstep': {},
    'sqrt': {},
    'step': {},
    // 'trunc': {},
    // Vector
    'cross': {},
    'distance': {},
    'dot': {},
    // 'equal': {},
    // 'faceforward': {},
    'length': {},
    'normalize': {},
    // 'notEqual': {},
    // 'reflect': {},
    // 'refract': {},
    // Texture sampling
    'texture': {},
  }

  // Object.entries(builtInFunctions).forEach(([glslFnName, properties]) => {
  // })

  const oldTexture = p5.prototype.texture;
  p5.prototype.texture = function(...args) {
    if (isShaderNode(args[0])) {
      return new FunctionCallNode('texture', args, 'vec4');
    } else {
      return oldTexture.apply(this, args);
    }
  }
}

export default shadergen;

if (typeof p5 !== 'undefined') {
  p5.registerAddon(shadergen)
}