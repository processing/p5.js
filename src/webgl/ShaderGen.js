/**
* @module 3D
* @submodule ShaderGenerator
* @for p5
* @requires core
*/

function shadergen(p5, fn) {
  const oldModify = p5.Shader.prototype.modify
  let GLOBAL_SHADER;
  p5.Shader.prototype.modify = function(arg) {
    if (arg instanceof Function) {
      const program = new ShaderProgram(arg)
      const newArg = program.generate();
      console.log(newArg)
      return oldModify.call(this, newArg);
    } else {
      return oldModify.call(this, arg)
    }
  }

  class BaseNode {
    constructor() {
      if (new.target === BaseNode) {
        throw new TypeError("Cannot construct BaseNode instances directly. This is an abstract class.");
      }
      this.type = null;
      
      // For tracking recursion depth and creating temporary variables
      this.isInternal = false; // TODO: dont use temp nodes for internal nodes 
      this.usedIn = [];
      this.dependsOn = [];
      this.srcLine = null;
      try {
        throw new Error("StackCapture");
      } catch (e) {
        const lines = e.stack.split("\n");
        console.log(lines)
        this.srcLine = lines[4].trim();
      }
    }
    
    // The base node implements a version of toGLSL which determines whether the generated code should be stored in a temporary variable.
    toGLSLBase(context){
      if (this.useTempVar()) {
        return this.getTemp(context);
      } 
      else {
        return this.toGLSL(context);
      }
    }

    useTempVar() {
      if (this.isInternal) { return false; }
      if (isVariableNode(this)) { return false; }
      if (isVectorNode(this)) { return true; }
      return (this.usedIn.length > 1);
    };
    
    getTemp(context) {
      if (!this.temporaryVariable) {
        this.temporaryVariable = `temp_${context.getNextID()}`;
        let line = "";
        if (this.srcLine) {
          line += `\n// From ${this.srcLine}\n`;
        }
        line += this.type + " " + this.temporaryVariable + " = " + this.toGLSLNoTemp(context) + ";";
        context.declarations.push(line);
      }
      return this.temporaryVariable;
    };
    
    // TODO: Add more operations here
    add(other)  { return new AdditionNode(this, this.enforceType(other)); }
    sub(other)  { return new SubtractionNode(this, this.enforceType(other)); }
    mult(other) { return new MultiplicationNode(this, this.enforceType(other)); }
    div(other)  { return new DivisionNode(this, this.enforceType(other)); }
    mod(other)  { return new ModulusNode(this, this.enforceType(other)); }
    sin()       { return new FunctionCallNode('sin', this, 'float'); }
    cos()       { return new FunctionCallNode('cos', this, 'float'); }
    radians()   { return new FunctionCallNode('radians', this, 'float'); }
    
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
    constructor(x = 0) {
      super();
      this.x = x;
      this.type = 'int';
    }
    toGLSL(context) {
      if (isShaderNode(this.x)) {
        let code = this.x.toGLSL(context);
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
    constructor(x = 0){
      super();
      this.x = x;
      this.type = 'float';
    }
    toGLSL(context) {
      if (isShaderNode(this.x)) {
        let code = this.x.toGLSL(context);
        console.log(code)
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
    constructor(values, type) {
      super();
      this.x = new FloatNode(x);
      this.y = new FloatNode(y);
      this.type = type;
    }
    
    toGLSL(context) {
      return `${this.type}(${this.x.toGLSLBase(context)}, ${this.y.toGLSLBase(context)})`
    }
  }

  // Function Call Nodes
  class FunctionCallNode extends BaseNode {
    constructor(name, args, type) {
      super();
      this.name = name;
      this.args = args;
      this.type = type;
    }
    deconstructArgs(context) {
      if (this.args.constructor === Array) {
        let argsString = `${this.args[0].toGLSL(context)}`
        for (let arg of this.args.slice(1)) {
          argsString += `, ${arg.toGLSL(context)}` 
          return argsString;
        }
      } else {
        return `${this.args.toGLSL(context)}`;
      }
    }
    toGLSL(context) {
      return `${this.name}(${this.deconstructArgs(context)})`;
    }
  }
  
  // Variables and member variable nodes
  class VariableNode extends BaseNode {
    constructor(name, type) {
      super()
      this.name = name;
      this.type = type;
      switch (type) {
        case 'float':
        break;
        case 'vec2':
        this.addSwizzles('x', 'y')
        break;
        case 'vec3':
        this.addSwizzles('x', 'y', 'z')
        break;
        case 'vec4':
        this.addSwizzles('x', 'y', 'z', 'w');  
        break;
      }
    }
    addSwizzles() {
      for (let name of arguments) {
        this[name] = new ComponentNode(this.name, name);
      }
    }
    toGLSL(context) {
      return `${this.name}`;
    }
  }
  
  class ComponentNode extends BaseNode {
    constructor(parent, component) {
      super();
      this.varName = parent;
      this.component = component;
      this.type = 'float';
    }
    toGLSL(context) {
      return `${this.varName}.${this.component}`;
    }
  }

  // Binary Operator Nodes
  class BinaryOperatorNode extends BaseNode {
    constructor(a, b) {
      super();
      this.a = a;
      this.b = b;
      for (const param of arguments) {
        param.usedIn.push(this);
      }
      this.type = this.determineType();
    }
    
    // We know that both this.a and this.b are nodes because of PrimitiveNode.enforceType
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

    processOperand(context, operand) {
      const code = operand.toGLSL(context);
      if (this.type === 'float' && isIntNode(operand)) {
        return `float${code}`;
      }
      return code;
    }
  }

  class MultiplicationNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b)
    }
    toGLSLNoTemp(context) {
      return `(${this.processOperand(context, this.a)} * ${this.processOperand(context, this.b)})`;
    }
  }

  class DivisionNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b)
    }
    toGLSLNoTemp(context) {
      return `(${this.processOperand(context, this.a)} / ${this.processOperand(context, this.b)})`;
    }
  }

  class AdditionNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b)
    }
    toGLSLNoTemp(context) {
      return `(${this.processOperand(context, this.a)} + ${this.processOperand(context, this.b)})`;
    }
  }

  class SubtractionNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b)
    }
    toGLSLNoTemp(context) {
      return `(${this.processOperand(context, this.a)} - ${this.processOperand(context, this.b)})`;
    }
  }

  // TODO: Correct the implementation for floats/ genType etc
  class ModulusNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b);
    }
    toGLSLNoTemp(context) {
      // Switch on type between % or mod()
      if (isVectorNode(this) || isFloatNode(this)) {
        return `mod(${this.a.toGLSL(context)}, ${this.b.toGLSL(context)})`;
      }
      return `(${this.processOperand(context, this.a)} % ${this.processOperand(context, this.b)})`;
    }
  }

  // Helper functions
  function isShaderNode(value) {  return (value instanceof BaseNode); }

  function isIntNode(value) { 
    return (isShaderNode(value) && (value.type === 'int')); 
  }

  function isFloatNode(value) { 
    return (isShaderNode(value) && (value.type === 'float')); 
  }

  function isVectorNode(value) { 
    return (isShaderNode(value) && (value.type === 'vec2'|| value.type === 'vec3' || value.type === 'vec4')); 
  }

  function isVariableNode(node) { 
    return (node instanceof VariableNode || node instanceof ComponentNode); 
  }

  // Shader program
  // This class is responsible for converting the nodes into an object containing GLSL code, to be used by p5.Shader.modify

  class ShaderProgram {
    constructor(modifyFunction) {
      this.uniforms = {
      }
      this.functions = {
        getWorldPosition: null
      }
      this.resetGLSLContext();
      global.GLOBAL_SHADER = this;
      this.generator = modifyFunction;
    }
    generate() {
      this.generator();
      return {
        uniforms: this.uniforms,
        functions: this.functions,
        vertex: this.functions.getWorldPosition,
        fragment: this.functions.getFinalColor,
      }
    }
    resetGLSLContext() { 
      this.context = {
        id: 0,
        getNextID: function() { return this.id++ },
        declarations: [],
      }
    }
    uniform(name, value) {
      this.uniforms[name] = value;
      return new VariableNode(name, value.type);
    }
    buildFunction(argumentName, argumentType, callback) {
      let functionArgument = new VariableNode(argumentName, argumentType);
      const finalLine = callback(functionArgument).toGLSL(this.context);
      let codeLines = this.context.declarations.slice();
      codeLines.push(`\n${argumentName} = ${finalLine}; \nreturn ${argumentName};`)
      this.resetGLSLContext();
      return codeLines.join("\n");
    }
    getWorldPosition(func) {
      this.functions.getWorldPosition = this.buildFunction("pos", "vec3", func);
    }
    getFinalColor(func) {
      this.functions.getFinalColor = this.buildFunction("col", "vec3", func);
    }
  }

  // User functions
  fn.createVector2 = function(x, y) {
    return new VectorNode(x, y, 'vec2');
  }

  fn.createVector3 = function(x, y, z) {
    return new VectorNode(x, y, z, 'vec3');
  }

  fn.createVector4 = function(x, y, z, w) {
    return new VectorNode(x, y, z, w, 'vec4');
  }
  
  fn.createFloat = function(x) {
    return new FloatNode(x);
  }
  
  fn.createInt = function(x) {
    return new IntNode(x);
  }
  
  fn.instanceID = function() {
    return new VariableNode('gl_InstanceID', 'int');
  }
  
  fn.uvCoords = function() {
    return new VariableNode('vTexCoord', 'vec2');
  }

  fn.discard = function() {
    return new VariableNode('discard', 'keyword');
  }
  
  fn.uniform = function(name, value) {
    let result = GLOBAL_SHADER.uniform(name, value)
    return result;
  }
  
  function getWorldPosition(func){
    GLOBAL_SHADER.getWorldPosition(func)
  }
  function getFinalColor(func){
    GLOBAL_SHADER.getFinalColor(func)
  }

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