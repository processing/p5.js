/**
* @module 3D
* @submodule ShaderGenerator
* @for p5
* @requires core
*/

function shadergen(p5, fn) {
  let GLOBAL_SHADER;
  
  const oldModify = p5.Shader.prototype.modify

  p5.Shader.prototype.modify = function(arg) {
    if (arg instanceof Function) {
      const program = new ShaderProgram(arg)
      const newArg = program.generate();
      console.log(newArg.vertex)
      return oldModify.call(this, newArg);
    } 
    else {
      return oldModify.call(this, arg)
    }
  }

  class BaseNode {
    constructor(isInternal) {
      if (new.target === BaseNode) {
        throw new TypeError("Cannot construct BaseNode instances directly. This is an abstract class.");
      }
      this.type = null;
      
      // For tracking recursion depth and creating temporary variables
      this.isInternal = isInternal;
      this.usedIn = [];
      this.dependsOn = [];
      this.srcLine = null;
      
      if (isInternal === false) {
        try {
          throw new Error("StackCapture");
        } catch (e) {
          const lines = e.stack.split("\n");
          console.log(lines)
          let index = 5;
          this.srcLine = lines[index].trim();
        }
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
        line += this.type + " " + this.temporaryVariable + " = " + this.toGLSL(context) + ";";
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
    constructor(x = 0, isInternal = false) {
      super(isInternal);
      this.x = x;
      this.type = 'int';
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
      super(isInternal);
      this.x = x;
      this.type = 'float';
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
  
  // There is a possibility that since we *always* use a temporary variable for vectors
  // that we don't actually need a Float Node for every component. They could be component node's instead? 
  // May need to then store the temporary variable name in this class.

  // This would be the next step before adding all swizzles 

  class VectorNode extends BaseNode {
    constructor(values, type, isInternal = false) {
      super(isInternal);

      const componentVariants = { 
        pos: ['x', 'y', 'z', 'w'],
        col: ['r', 'g', 'b', 'a'],
        uv: ['s', 't', 'p', 'q']
      }
      for (let variant in componentVariants) {
        for (let i = 0; i < values.length; i++) {
          let componentCollection = componentVariants[variant];
          let component = componentCollection[i];
          this[component] = new ComponentNode(this, component, true);
          // this[component] = new FloatNode(values[i], true);
        }
      }

      this.type = type;
      this.size = values.length; 
    }
    
    toGLSL(context) {
      let glslArgs = ``;
      const components = ['x', 'y', 'z', 'w'].slice(0, this.size);
      
      for (let i = 0; i < this.size; i++) {
        const comma = i === this.size - 1 ? `` : `, `;
        const component = components[i]
        glslArgs += `${this[component].toGLSLBase(context)}${comma}`;
      }
      
      return `${this.type}(${glslArgs})`;
    }
  }

  // Function Call Nodes
  class FunctionCallNode extends BaseNode {
    constructor(name, args, type, isInternal = false) {
      super(isInternal);
      this.name = name;
      this.args = args;
      this.type = type;
    }

    deconstructArgs(context) {
      if (this.args.constructor === Array) {
        let argsString = `${this.args[0].toGLSLBase(context)}`
        for (let arg of this.args.slice(1)) {
          argsString += `, ${arg.toGLSLBase(context)}` 
          return argsString;
        }
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
      super(isInternal)
      this.name = name;
      this.type = type;
      switch (type) {
        case 'float':
        break;
        case 'vec2':
        this.addComponents(['x', 'y'])
        break;
        case 'vec3':
        this.addComponents(['x', 'y', 'z'])
        break;
        case 'vec4':
        this.addComponents(['x', 'y', 'z', 'w']);  
        break;
      }
    }
    addComponents(componentNames) {
      for (let componentName of componentNames) {
        this[componentName] = new ComponentNode(this, componentName, true);
      }
    }
    toGLSL(context) {
      return `${this.name}`;
    }
  }
  
  class ComponentNode extends BaseNode {
    constructor(parent, component, isInternal = false) {
      super(isInternal);
      this.parent = parent;
      this.component = component;
      this.type = 'float';
    }
    toGLSL(context) {
      // CURRENTLY BROKEN:
      const parentName = this.parent.toGLSLBase(context);
      // const parentName = this.parent.temporaryVariable ? this.parent.temporaryVariable : this.parent.name; 
      return `${parentName}.${this.component}`;
    }
  }

  // Binary Operator Nodes
  class BinaryOperatorNode extends BaseNode {
    constructor(a, b, isInternal = false) {
      super(isInternal);
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
      const code = operand.toGLSLBase(context);
      if (operand.temporaryVariable) {
        return operand.temporaryVariable;
      }
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
    toGLSL(context) {
      return `(${this.processOperand(context, this.a)} * ${this.processOperand(context, this.b)})`;
    }
  }

  class DivisionNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b)
    }
    toGLSL(context) {
      return `(${this.processOperand(context, this.a)} / ${this.processOperand(context, this.b)})`;
    }
  }

  class AdditionNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b)
    }
    toGLSL(context) {
      return `(${this.processOperand(context, this.a)} + ${this.processOperand(context, this.b)})`;
    }
  }

  class SubtractionNode extends BinaryOperatorNode {
    constructor(a, b) {
      super(a, b)
    }
    toGLSL(context) {
      return `(${this.processOperand(context, this.a)} - ${this.processOperand(context, this.b)})`;
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
      return `(${this.processOperand(context, this.a)} % ${this.processOperand(context, this.b)})`;
    }
  }

  // Helper functions
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
    console.log(node.temporaryVariable);
    return (node instanceof VariableNode || node instanceof ComponentNode || typeof(node.temporaryVariable) != 'undefined'); 
  }

  // Shader program
  // This class is responsible for converting the nodes into an object containing GLSL code, to be used by p5.Shader.modify

  class ShaderProgram {
    constructor(modifyFunction) {
      this.uniforms = {
      }
      this.functions = {
      }
      this.resetGLSLContext();
      GLOBAL_SHADER = this;
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
      let functionArgument = new VariableNode(argumentName, argumentType, true);
      const finalLine = callback(functionArgument).toGLSLBase(this.context);
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
  fn.getWorldPosition = function(func){
    GLOBAL_SHADER.getWorldPosition(func)
  }
  fn.getFinalColor = function(func){
    GLOBAL_SHADER.getFinalColor(func)
  }
  
  fn.createVector2 = function(x, y) {
    return new VectorNode([x, y], 'vec2');
  }

  fn.createVector3 = function(x, y, z) {
    return new VectorNode([x, y, z], 'vec3');
  }

  fn.createVector4 = function(x, y, z, w) {
    return new VectorNode([x, y, z, w], 'vec4');
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