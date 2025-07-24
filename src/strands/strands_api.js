import {
  createBinaryOpNode, 
  createFunctionCallNode,
  createVariableNode,
  createStatementNode,
  createTypeConstructorNode,
  createUnaryOpNode,
} from './ir_builders'
import { OperatorTable, BlockType, DataType, BaseType, TypeInfoFromGLSLName } from './ir_types'
import { strandsBuiltinFunctions } from './strands_builtins'
import { StrandsConditional } from './strands_conditionals'
import * as CFG from './ir_cfg'
import * as FES from './strands_FES'

//////////////////////////////////////////////
// User nodes 
//////////////////////////////////////////////
export class StrandsNode {
  constructor(id) {
    this.id = id;
  }
}

export function initGlobalStrandsAPI(p5, fn, strandsContext) {
  // We augment the strands node with operations programatically 
  // this means methods like .add, .sub, etc can be chained
  for (const { name, arity, opCode, symbol } of OperatorTable) {
    if (arity === 'binary') {
      StrandsNode.prototype[name] = function (...right) {
        const id = createBinaryOpNode(strandsContext, this, right, opCode);
        return new StrandsNode(id);
      };
    }
    if (arity === 'unary') {
      fn[name] = function (strandsNode) {
        const id = createUnaryOpNode(strandsContext, strandsNode, opCode);
        return new StrandsNode(id);
      }
    }
  }
  
  //////////////////////////////////////////////
  // Unique Functions
  //////////////////////////////////////////////
  fn.discard = function() {
    const id = createStatementNode('discard');
    CFG.recordInBasicBlock(strandsContext.cfg, strandsContext.cfg.currentBlock, id);
  }
  
  fn.strandsIf = function(conditionNode, ifBody) {
    return new StrandsConditional(strandsContext, conditionNode, ifBody);
  }
  
  fn.strandsLoop = function(a, b, loopBody) {
    return null;
  }
  
  fn.strandsNode = function(...args) {
    if (args.length > 4) {
      FES.userError('type error', "It looks like you've tried to construct a p5.strands node implicitly, with more than 4 components. This is currently not supported.")
    }
    const id = createTypeConstructorNode(strandsContext, { baseType: BaseType.DEFER, dimension: null }, args);
    return new StrandsNode(id); 
  }
  
  //////////////////////////////////////////////
  // Builtins, uniforms, variable constructors
  //////////////////////////////////////////////
  for (const [functionName, overrides] of Object.entries(strandsBuiltinFunctions)) {
    const isp5Function = overrides[0].isp5Function;
    
    if (isp5Function) {
      const originalFn = fn[functionName];
      fn[functionName] = function(...args) {
        if (strandsContext.active) {
          const id =  createFunctionCallNode(strandsContext, functionName, args);
          return new StrandsNode(id);
        } else {
          return originalFn.apply(this, args);
        }
      }
    } else {
      fn[functionName] = function (...args) {
        if (strandsContext.active) {
          const id = createFunctionCallNode(strandsContext, functionName, args);
          return new StrandsNode(id);
        } else {
          p5._friendlyError(
            `It looks like you've called ${functionName} outside of a shader's modify() function.`
          )
        }
      }
    }
  }
  
  // Next is type constructors and uniform functions
  for (const type in DataType) {
    if (type === BaseType.DEFER) {
      continue;
    }
    const typeInfo = DataType[type];

    let pascalTypeName;
    if (/^[ib]vec/.test(typeInfo.fnName)) {
      pascalTypeName = typeInfo.fnName
      .slice(0, 2).toUpperCase()
      + typeInfo.fnName
      .slice(2)
      .toLowerCase();
    } else {
      pascalTypeName = typeInfo.fnName.charAt(0).toUpperCase()
      + typeInfo.fnName.slice(1).toLowerCase();
    }
    
    fn[`uniform${pascalTypeName}`] = function(name, ...defaultValue) {
      const id = createVariableNode(strandsContext, typeInfo, name);
      strandsContext.uniforms.push({ name, typeInfo, defaultValue });
      return new StrandsNode(id);
    };
    
    const originalp5Fn = fn[typeInfo.fnName];
    fn[typeInfo.fnName] = function(...args) {
      if (strandsContext.active) {
        const id = createTypeConstructorNode(strandsContext, typeInfo, args);
        return new StrandsNode(id);
      } else if (originalp5Fn) {
        return originalp5Fn.apply(this, args);
      } else {
        p5._friendlyError(
          `It looks like you've called ${typeInfo.fnName} outside of a shader's modify() function.`
        );
      }
    }
  }
}

//////////////////////////////////////////////
// Per-Hook functions
//////////////////////////////////////////////
const structTypes = ['Vertex', ]

function createHookArguments(strandsContext, parameters){
  const args = [];
  
  for (const param of parameters) {
    const paramType = param.type;
    if(structTypes.includes(paramType.typeName)) {
      const propertyEntries = paramType.properties.map((prop) => {
        const typeInfo = TypeInfoFromGLSLName[prop.dataType];
        const variableNode = createVariableNode(strandsContext, typeInfo, prop.name);
        return [prop.name, variableNode];
      });
      const argObject = Object.fromEntries(propertyEntries);
      args.push(argObject);
    } else {
      const typeInfo = TypeInfoFromGLSLName[paramType.typeName];
      const id = createVariableNode(strandsContext, typeInfo, param.name);
      const arg = new StrandsNode(id);
      args.push(arg);
    }
  }
  return args;
}

export function createShaderHooksFunctions(strandsContext, fn, shader) { 
  const availableHooks = {
    ...shader.hooks.vertex,
    ...shader.hooks.fragment,
  }
  const hookTypes = Object.keys(availableHooks).map(name => shader.hookTypes(name));
  const { cfg, dag } = strandsContext;

  for (const hookType of hookTypes) {
    window[hookType.name] = function(hookUserCallback) {
      const entryBlockID = CFG.createBasicBlock(cfg, BlockType.FUNCTION);
      CFG.addEdge(cfg, cfg.currentBlock, entryBlockID);
      CFG.pushBlock(cfg, entryBlockID);
      
      const args = createHookArguments(strandsContext, hookType.parameters);
      const returned = hookUserCallback(...args);
      let returnedNode;

      const expectedReturnType = hookType.returnType;
      if(structTypes.includes(expectedReturnType.typeName)) {

      } 
      else {
        // In this case we are expecting a native shader type, probably vec4 or vec3.
        const expected = TypeInfoFromGLSLName[expectedReturnType.typeName];
        // User may have returned a raw value like [1,1,1,1] or 25.
        if (!(returned instanceof StrandsNode)) {
          const id = createTypeConstructorNode(strandsContext, { baseType: BaseType.DEFER, dimension: null }, returned);
          returnedNode = new StrandsNode(id);
        } 
        else {
          returnedNode = returned;
        }

        const received = {
          baseType: dag.baseTypes[returnedNode.id],
          dimension: dag.dimensions[returnedNode.id],
        }
        if (received.dimension !== expected.dimension) {
          if (received.dimension !== 1) {
            FES.userError('type error', `You have returned a vector with ${received.dimension} components in ${hookType.name} when a ${expected.baseType + expected.dimension} was expected!`);
          } 
          else {
            const newID = createTypeConstructorNode(strandsContext, expected, returnedNode);
            returnedNode = new StrandsNode(newID);
          }
        } 
        else if (received.baseType !== expected.baseType) {
            const newID = createTypeConstructorNode(strandsContext, expected, returnedNode);
            returnedNode = new StrandsNode(newID);
        }
      }

      strandsContext.hooks.push({
        hookType, 
        entryBlockID,
        rootNodeID: returnedNode.id,
      });
      CFG.popBlock(cfg);
    }
  }
}