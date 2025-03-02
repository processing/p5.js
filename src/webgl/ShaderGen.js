/**
* @module 3D
* @submodule ShaderGenerator
* @for p5
* @requires core
*/

import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import escodegen from 'escodegen';

function shadergen(p5, fn) {
  let GLOBAL_SHADER;
  
  const oldModify = p5.Shader.prototype.modify

  p5.Shader.prototype.modify = function(arg) {

    if (arg instanceof Function) {
      const code = arg.toString()
      const ast = parse(code, { ecmaVersion: 2021, locations: true });
      
      walk.ancestor(ast, ASTCallbacks, null, {myData: 123});

      const transformed = escodegen.generate(ast);
      console.log(transformed)
     
      // const program = new ShaderProgram(arg)
      // const newArg = program.generate();
      // console.log(newArg.vertex)
      // return oldModify.call(this, newArg);
    } 
    else {
      return oldModify.call(this, arg)
    }
  }

  // Transpiler 

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
    Literal(node, state, ancestors) {
    },
    AssignmentExpression(node, _state, ancestors) {
      // Operator overloading
      if (node.operator != '=') {
        const rightReplacementNode = {
          type: 'CallExpression',
          callee: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: node.left.name
            },
            property: {
              type: "Identifier",
              name: replaceBinaryOperator(node.operator.replace('=','')),
            },
          },
          arguments: [node.right]
        }

          node.operator = '=';
          node.right = rightReplacementNode;
        }
      },
    BinaryExpression(node, state, ancestors) {
      // let i = ancestors.length - 1;
      // let ancestor = ancestors[i]; // ancestor === node
      // while (ancestor.type === 'BinaryExpression') {
      //   ancestor = ancestors[i--];
      // }

      console.log("\n NEW NODE:")

      const transformed = escodegen.generate(node);
      const l = escodegen.generate(node.left);
      const r = escodegen.generate(node.right);
      console.log("Transformed: ", transformed);
      console.log("Left: ", l);
      console.log("Right: ", r);

      console.log(node.left);

      node.type = 'CallExpression';
      console.log("OPERATOR: ", node.operator)
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


  // JS API

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
          let index = 5;
          if (isBinaryOperatorNode(this)) { index--; };
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

    // useTempVar() {
    //   if (isBinaryOperatorNode(this)) {
    //     console.log(this.a);
    //     console.log(this.b);
    //     return false; 
    //   }
    //   if (this.isInternal) { return false; }
    //   if (isVariableNode(this)) { return false; }
    //   if (isVectorNode(this)) { return true; }
    //   return (this.usedIn.length > 1);
    // };
    
    useTempVar() {
      if (this.isInternal || isVariableNode(this)) { return false; }
      let score = 0;
      score += isBinaryOperatorNode(this);
      score += isVectorNode(this) * 2;
      score += this.usedIn.length;
      return score > 3;
    }
    
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
    add(other)  { return new BinaryOperatorNode(this, this.enforceType(other), '+'); }
    sub(other)  { return new BinaryOperatorNode(this, this.enforceType(other), '-'); }
    mult(other) { return new BinaryOperatorNode(this, this.enforceType(other), '*'); }
    div(other)  { return new BinaryOperatorNode(this, this.enforceType(other), '/'); }
    mod(other)  { return new ModulusNode(this, this.enforceType(other)); }
    sin()       { return new FunctionCallNode('sin', this, 'float'); }
    cos()       { return new FunctionCallNode('cos', this, 'float'); }
    radians()   { return new FunctionCallNode('radians', this, 'float'); }
    abs()       { return new FunctionCallNode('abs',this, this.type) };
    ceil()      { return new FunctionCallNode(); }

    // TODO: 
    // Add a whole lot of these functions. Probably should take them out of the primitive node and just attach them to global instead.
    // https://docs.gl/el3/
    
    max()       { return new FunctionCallNode(); }
    min()       { return new FunctionCallNode(); }
    ceil()      { return new FunctionCallNode(); }
    round()     { return new FunctionCallNode(); }
    roundEven() { return new FunctionCallNode(); }
    sqrt()      { return new FunctionCallNode(); }
    log()       { return new FunctionCallNode(); }
    exp()       { return new FunctionCallNode(); }


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
  
  // TODO:
  // There is a possibility that since we *always* use a temporary variable for vectors
  // that we don't actually need a Float Node for every component. They could be component node's instead? 
  // May need to then store the temporary variable name in this class.

  // This would be the next step before adding all swizzles 

  // I think it is also possible to make a proxy for vector nodes to check if the user accesses  or sets any 
  // property .xyz / .rgb /.zxx etc as then we can automatically assign swizzles and only define .xyzw on the actual 
  // object.

  // Ultimately vectors are the focus of & most complex type in glsl (before we add matrices...) which justifies the complexity
  // of this class.

  // I am interested in the 'prop' value of get and set then

  // const VectorNodeHandler = {
  //   swizzles: [
  //     ['x', 'y', 'z', 'w'],
  //     ['r', 'b', 'g', 'a'],
  //     ['s', 't', 'p', 'q'],
  //   ],
  //   get(target, prop, receiver) {
  //     if (prop in target) {
  //        return Reflect.get(target, prop, receiver); 
  //     } else {
  //       console.log(prop);
  //     }
  //     let modifiedProp;
  //     return Reflect.get(target, modifiedProp, receiver);
  //   },
  //   set(obj, prop, receiver) {
  //     console.log("OBJect:",obj,"PROPERTY", prop, "RECEIVER", receiver);

  //     if (prop in obj) { return Reflect.set(...arguments); }
  //     let modifiedProp;
  //     return Reflect.set(obj, modifiedProp, receiver);
  //   }
  // }

  class VectorNode extends BaseNode {
    constructor(values, type, isInternal = false) {
      super(isInternal);

      this.components = ['x', 'y', 'z', 'w'].slice(0, values.length);
      this.components.forEach((component, i) => {
        this[component] = new FloatNode(values[i], true);
        // this[component] = new ComponentNode(this, component, true);
      });

      this.type = type;
    }
    
    toGLSL(context) {
      let glslArgs = ``;

      this.components.forEach((component, i) => {
        const comma = i === this.components.length - 1 ? `` : `, `;
        glslArgs += `${this[component].toGLSLBase(context)}${comma}`;
      })

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

      // TODO:
      this.argumentTypes = {

      };
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
      this.autoAddVectorComponents();
    }
    
    addComponent(componentName) {
      this[componentName] = new ComponentNode(this, componentName, true);
    }

    autoAddVectorComponents() {
      const options = {
        vec2: ['x', 'y'],
        vec3: ['x', 'y', 'z'],
        vec4: ['x', 'y', 'z', 'w']
      };
      const componentNames = options[this.type] || [];
      for (let componentName of componentNames) {
        this.addComponent(componentName);
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
      // const parentName = this.parent.toGLSLBase(context);
      const parentName = this.parent.temporaryVariable ? this.parent.temporaryVariable : this.parent.name; 
      return `${parentName}.${this.component}`;
    }
  }

  // Binary Operator Nodes
  class BinaryOperatorNode extends BaseNode {
    constructor(a, b, operator, isInternal = false) {
      super(isInternal);
      this.op = operator;
      this.a = a;
      this.b = b;
      for (const operand of [a, b]) {
        operand.usedIn.push(this);
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
  class ConditionalNode {
    constructor(value) {
      this.value = value;
      this.condition = null;
      this.thenBranch = null;
      this.elseBranch = null;
    }
    //helper 
    checkType(value) {

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
    // Then?
    then() {
      GLOBAL_SHADER.context.declarations.push()
    }
  };

  fn.if = function (value) {
    return new ConditionalNode(value);
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
    return (node instanceof VariableNode || node instanceof ComponentNode || typeof(node.temporaryVariable) != 'undefined'); 
  }

  // Shader program
  // This class is responsible for converting the nodes into an object containing GLSL code, to be used by p5.Shader.modify

  class ShaderProgram {
    constructor(modifyFunction) {
      this.uniforms = {
        int: {},
        float: {},
        vec2: {},
        vec3: {},
        vec4: {},
        texture: {},
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
    // TODO:
    uniformInt(name, defaultValue) {
      this.uniforms.int[name] = defaultValue;
      return new VariableNode(name, 'int');
    }
    uniformFloat(name, defaultValue) {
      this.uniforms.float[name] = defaultValue;
      return new VariableNode(name, 'float');
    }
    uniformVector2(name, defaultValue) {
      this.uniforms.vec2[name] = defaultValue;
      return new VariableNode(name, 'vec2');
    }
    uniformVector2(name, defaultValue) {
      this.uniforms.vec3[name] = defaultValue;
      return new VariableNode(name, 'vec3');
    }
    uniformVector2(name, defaultValue) {
      this.uniforms.vec4[name] = defaultValue;
      return new VariableNode(name, 'vec4');
    }
    uniformTexture(name, defaultValue) {
      this.uniforms.texture[name] = defaultValue;
      return new VariableNode(name, 'vec4');
    }
    uniform(name, defaultValue) {
      this.uniforms[name] = defaultValue;
      return new VariableNode(name, defaultValue.type);
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
    // return new Proxy(new VectorNode([x, y], 'vec2'), VectorNodeHandler);
    return new VectorNode([x, y], 'vec2');
  }

  fn.createVector3 = function(x, y, z) {
    // return new Proxy(new VectorNode([x, y, z], 'vec3'), VectorNodeHandler);
    return new VectorNode([x, y, z], 'vec3');
  }

  fn.createVector4 = function(x, y, z, w) {
    // return new Proxy(new VectorNode([x, y, z, w], 'vec4'), VectorNodeHandler);
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