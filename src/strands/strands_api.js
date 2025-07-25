import {
  createBinaryOpNode, 
  createFunctionCallNode,
  createVariableNode,
  createStatementNode,
  createTypeConstructorNode,
  createUnaryOpNode,
} from './ir_builders'
import { 
  OperatorTable,
  BlockType,
  DataType, 
  BaseType, 
  StructType, 
  TypeInfoFromGLSLName, 
  isStructType, 
  // isNativeType
} from './ir_types'
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
      FES.userError("type error", "It looks like you've tried to construct a p5.strands node implicitly, with more than 4 components. This is currently not supported.")
    }
    const id = createTypeConstructorNode(strandsContext, { baseType: BaseType.DEFER, dimension: null }, args.flat());
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
function createHookArguments(strandsContext, parameters){
  const args = [];
  
  for (const param of parameters) {
    const paramType = param.type;
    if(isStructType(paramType.typeName)) {
      const structType = StructType[paramType.typeName];
      const argStruct = {};
      for (const prop of structType.properties) {
        const memberNode = createVariableNode(strandsContext, prop.dataType, prop.name);
        argStruct[prop.name] = memberNode;
      }
      args.push(argStruct);
    } 
    else /*if(isNativeType(paramType.typeName))*/ {
      const typeInfo = TypeInfoFromGLSLName[paramType.typeName];
      const id = createVariableNode(strandsContext, typeInfo, param.name);
      const arg = new StrandsNode(id);
      args.push(arg);
    }
  }
  return args;
}

function enforceReturnTypeMatch(strandsContext, expectedType, returned, hookName) {
  if (!(returned instanceof StrandsNode)) {
    try {
      return createTypeConstructorNode(strandsContext, expectedType, returned);
    } catch (e) {
      FES.userError('type error', 
        `There was a type mismatch for a value returned from ${hookName}.\n` +
        `The value in question was supposed to be:\n` +
        `${expectedType.baseType + expectedType.dimension}\n` +
        `But you returned:\n` + 
        `${returned}`
      );
    }
  } 

  const dag = strandsContext.dag;
  let returnedNodeID = returned.id;
  const receivedType = {
    baseType: dag.baseTypes[returnedNodeID],
    dimension: dag.dimensions[returnedNodeID],
  }
  if (receivedType.dimension !== expectedType.dimension) {
    if (receivedType.dimension !== 1) {
      FES.userError('type error', `You have returned a vector with ${receivedType.dimension} components in ${hookType.name} when a ${expectedType.baseType + expectedType.dimension} was expected!`);
    } 
    else {
      returnedNodeID = createTypeConstructorNode(strandsContext, expectedType, returnedNodeID);
    }
  } 
  else if (receivedType.baseType !== expectedType.baseType) {
    returnedNodeID = createTypeConstructorNode(strandsContext, expectedType, returnedNodeID);
  }

  return returnedNodeID;
}

export function createShaderHooksFunctions(strandsContext, fn, shader) { 
  const availableHooks = {
    ...shader.hooks.vertex,
    ...shader.hooks.fragment,
  }
  const hookTypes = Object.keys(availableHooks).map(name => shader.hookTypes(name));
  const cfg = strandsContext.cfg;

  for (const hookType of hookTypes) {
    window[hookType.name] = function(hookUserCallback) {
      const entryBlockID = CFG.createBasicBlock(cfg, BlockType.FUNCTION);
      CFG.addEdge(cfg, cfg.currentBlock, entryBlockID);
      CFG.pushBlock(cfg, entryBlockID);

      const args = createHookArguments(strandsContext, hookType.parameters);
      const userReturned = hookUserCallback(...args);
      const expectedReturnType = hookType.returnType;

      if(isStructType(expectedReturnType.typeName)) {
        const expectedStructType = StructType[expectedReturnType.typeName];
        const rootStruct = {
          identifier: expectedReturnType.typeName,
          properties: {}
        };
        const expectedProperties = expectedStructType.properties;
        
        for (let i = 0; i < expectedProperties.length; i++) {
          const expectedProp = expectedProperties[i];
          const propName = expectedProp.name;
          const receivedValue = userReturned[propName];
          if (receivedValue === undefined) {
            FES.userError('type error', `You've returned an incomplete object from ${hookType.name}.\n` + 
              `Expected: { ${expectedReturnType.properties.map(p => p.name).join(', ')} }\n` +
              `Received: { ${Object.keys(userReturned).join(', ')} }\n` +
              `All of the properties are required!`);
          }
          
          const expectedTypeInfo = expectedProp.dataType;
          const returnedPropID = enforceReturnTypeMatch(strandsContext, expectedTypeInfo, receivedValue, hookType.name);
          rootStruct.properties[propName] = returnedPropID;
        }
        strandsContext.hooks.push({
          hookType,
          entryBlockID,
          rootStruct
        });
      } 
      else /*if(isNativeType(expectedReturnType.typeName))*/ {
        const expectedTypeInfo = TypeInfoFromGLSLName[expectedReturnType.typeName];
        const returnedNodeID = enforceReturnTypeMatch(strandsContext, expectedTypeInfo, userReturned, hookType.name);
        strandsContext.hooks.push({
          hookType, 
          entryBlockID,
          rootNodeID: returnedNodeID,
        });
      }
      CFG.popBlock(cfg);
    }
  }
}