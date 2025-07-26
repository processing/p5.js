import {
  createBinaryOpNode, 
  createFunctionCallNode,
  createVariableNode,
  createStatementNode,
  createPrimitiveConstructorNode,
  createUnaryOpNode,
  createMemberAccessNode,
  createStructInstanceNode,
  createStructConstructorNode,
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
import { getNodeDataFromID } from './ir_dag'

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
  for (const { name, arity, opCode } of OperatorTable) {
    if (arity === 'binary') {
      StrandsNode.prototype[name] = function (...right) {
        const { id, components } = createBinaryOpNode(strandsContext, this, right, opCode);
        return new StrandsNode(id);
      };
    }
    if (arity === 'unary') {
      fn[name] = function (strandsNode) {
        const { id, components } = createUnaryOpNode(strandsContext, strandsNode, opCode);
        return new StrandsNode(id);
      }
    }
  }
  
  //////////////////////////////////////////////
  // Unique Functions
  //////////////////////////////////////////////
  fn.discard = function() {
    const { id, components } = createStatementNode('discard');
    CFG.recordInBasicBlock(strandsContext.cfg, strandsContext.cfg.currentBlock, id);
  }
  
  fn.strandsIf = function(conditionNode, ifBody) {
    return new StrandsConditional(strandsContext, conditionNode, ifBody);
  }
  
  fn.strandsLoop = function(a, b, loopBody) {
    return null;
  }
  
  fn.strandsNode = function(...args) {
    if (args.length === 1 && args[0] instanceof StrandsNode) {
      return args[0];
    }
    if (args.length > 4) {
      FES.userError("type error", "It looks like you've tried to construct a p5.strands node implicitly, with more than 4 components. This is currently not supported.")
    }
    const { id, components } = createPrimitiveConstructorNode(strandsContext, { baseType: BaseType.DEFER, dimension: null }, args.flat());
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
          const { id, components } =  createFunctionCallNode(strandsContext, functionName, args);
          return new StrandsNode(id);
        } else {
          return originalFn.apply(this, args);
        }
      }
    } else {
      fn[functionName] = function (...args) {
        if (strandsContext.active) {
          const { id, components } = createFunctionCallNode(strandsContext, functionName, args);
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
    
    fn[`uniform${pascalTypeName}`] = function(name, defaultValue) {
      const { id, components } = createVariableNode(strandsContext, typeInfo, name);
      strandsContext.uniforms.push({ name, typeInfo, defaultValue });
      return new StrandsNode(id);
    };
    
    const originalp5Fn = fn[typeInfo.fnName];
    fn[typeInfo.fnName] = function(...args) {
      if (strandsContext.active) {
        const { id, components } = createPrimitiveConstructorNode(strandsContext, typeInfo, args);
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
      const originalInstanceInfo = createStructInstanceNode(strandsContext, structType, param.name, []);
      const structNode = new StrandsNode(originalInstanceInfo.id);
      // const componentNodes = originalInstanceInfo.components.map(id => new StrandsNode(id))

      for (let i = 0; i < structType.properties.length; i++) {
        const componentTypeInfo = structType.properties[i];
        Object.defineProperty(structNode, componentTypeInfo.name, {
          get() {
            return new StrandsNode(strandsContext.dag.dependsOn[structNode.id][i])
            // const { id, components } = createMemberAccessNode(strandsContext, structNode, componentNodes[i], componentTypeInfo.dataType);
            // const memberAccessNode = new StrandsNode(id);
            // return memberAccessNode;
          },
          set(val) {
            const oldDependsOn = strandsContext.dag.dependsOn[structNode.id];
            const newDependsOn = [...oldDependsOn];

            let newValueID;
            if (val instanceof StrandsNode) {
              newValueID = val.id;
            }
            else {
              let newVal = createPrimitiveConstructorNode(strandsContext, componentTypeInfo.dataType, val);
              newValueID = newVal.id;
            }

            newDependsOn[i] = newValueID;
            const newStructInfo = createStructInstanceNode(strandsContext, structType, param.name, newDependsOn);
            structNode.id = newStructInfo.id;
          }
        })
      }

      args.push(structNode);
    } 
    else /*if(isNativeType(paramType.typeName))*/ {
      const typeInfo = TypeInfoFromGLSLName[paramType.typeName];
      const { id, components } = createVariableNode(strandsContext, typeInfo, param.name);
      const arg = new StrandsNode(id);
      args.push(arg);
    }
  }
  return args;
}

function enforceReturnTypeMatch(strandsContext, expectedType, returned, hookName) {
  if (!(returned instanceof StrandsNode)) {
    // try {
      const result = createPrimitiveConstructorNode(strandsContext, expectedType, returned);
      return result.id;
    // } catch (e) {
      // FES.userError('type error', 
        // `There was a type mismatch for a value returned from ${hookName}.\n` +
        // `The value in question was supposed to be:\n` +
        // `${expectedType.baseType + expectedType.dimension}\n` +
        // `But you returned:\n` + 
        // `${returned}`
      // );
    // }
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
      const result = createPrimitiveConstructorNode(strandsContext, expectedType, returned);
      returnedNodeID = result.id;
    }
  } 
  else if (receivedType.baseType !== expectedType.baseType) {
    const result = createPrimitiveConstructorNode(strandsContext, expectedType, returned);
    returnedNodeID = result.id;
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

      let rootNodeID = null;

      if(isStructType(expectedReturnType.typeName)) {
        const expectedStructType = StructType[expectedReturnType.typeName];
        if (userReturned instanceof StrandsNode) {
          const returnedNode = getNodeDataFromID(strandsContext.dag, userReturned.id);
          if (!returnedNode.baseType === expectedStructType.typeName) {
            FES.userError("type error", `You have returned a ${userReturned.baseType} from ${hookType.name} when a ${expectedStructType.typeName} was expected.`);
          }
          rootNodeID = userReturned.id;
        }
        else {
          const expectedProperties = expectedStructType.properties;
          const newStructDependencies = [];
          for (let i = 0; i < expectedProperties.length; i++) {
            const expectedProp = expectedProperties[i];
            const propName = expectedProp.name;
            const receivedValue = userReturned[propName];
            if (receivedValue === undefined) {
              FES.userError('type error', `You've returned an incomplete struct from ${hookType.name}.\n` + 
                `Expected: { ${expectedReturnType.properties.map(p => p.name).join(', ')} }\n` +
                `Received: { ${Object.keys(userReturned).join(', ')} }\n` +
                `All of the properties are required!`);
            }
            const expectedTypeInfo = expectedProp.dataType;
            const returnedPropID = enforceReturnTypeMatch(strandsContext, expectedTypeInfo, receivedValue, hookType.name);
            newStructDependencies.push(returnedPropID);
          }
          const newStruct = createStructConstructorNode(strandsContext, expectedStructType, newStructDependencies);
          rootNodeID = newStruct.id;
        }

      } 
      else /*if(isNativeType(expectedReturnType.typeName))*/ {
        const expectedTypeInfo = TypeInfoFromGLSLName[expectedReturnType.typeName];
        rootNodeID = enforceReturnTypeMatch(strandsContext, expectedTypeInfo, userReturned, hookType.name);
      }

      strandsContext.hooks.push({
        hookType, 
        entryBlockID,
        rootNodeID,
      });
      CFG.popBlock(cfg);
    }
  }
}