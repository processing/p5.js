import * as build from './ir_builders'
import {
  OperatorTable,
  BlockType,
  DataType,
  BaseType,
  structType,
  TypeInfoFromGLSLName,
  isStructType,
  OpCode,
  StatementType,
  // isNativeType
} from './ir_types'
import { strandsBuiltinFunctions } from './strands_builtins'
import { StrandsConditional } from './strands_conditionals'
import { StrandsFor } from './strands_for'
import * as CFG from './ir_cfg'
import * as FES from './strands_FES'
import { getNodeDataFromID } from './ir_dag'
import { StrandsNode, createStrandsNode } from './strands_node'
import noiseGLSL from '../webgl/shaders/functions/noise3DGLSL.glsl';

//////////////////////////////////////////////
// User nodes
//////////////////////////////////////////////
export function initGlobalStrandsAPI(p5, fn, strandsContext) {
  // We augment the strands node with operations programatically
  // this means methods like .add, .sub, etc can be chained
  for (const { name, arity, opCode } of OperatorTable) {
    if (arity === 'binary') {
      StrandsNode.prototype[name] = function (...right) {
        const { id, dimension } = build.binaryOpNode(strandsContext, this, right, opCode);
        return createStrandsNode(id, dimension, strandsContext);
      };
    }
    if (arity === 'unary') {
      p5[name] = function (nodeOrValue) {
        const { id, dimension } = build.unaryOpNode(strandsContext, nodeOrValue, opCode);
        return createStrandsNode(id, dimension, strandsContext);
      }
    }
  }
  //////////////////////////////////////////////
  // Unique Functions
  //////////////////////////////////////////////
  fn.discard = function() {
    build.statementNode(strandsContext, StatementType.DISCARD);
  }
  fn.break = function() {
    build.statementNode(strandsContext, StatementType.BREAK);
  };
  p5.break = fn.break;
  fn.instanceID = function() {
    const node = build.variableNode(strandsContext, { baseType: BaseType.INT, dimension: 1 }, 'gl_InstanceID');
    return createStrandsNode(node.id, node.dimension, strandsContext);
  }
  // Internal methods use p5 static methods; user-facing methods use fn.
  // Some methods need to be used by both.
  p5.strandsIf = function(conditionNode, ifBody) {
    return new StrandsConditional(strandsContext, conditionNode, ifBody);
  }
  fn.strandsIf = p5.strandsIf;
  p5.strandsFor = function(initialCb, conditionCb, updateCb, bodyCb, initialVars) {
    return new StrandsFor(strandsContext, initialCb, conditionCb, updateCb, bodyCb, initialVars).build();
  };
  fn.strandsFor = p5.strandsFor;
  p5.strandsNode = function(...args) {
    if (args.length === 1 && args[0] instanceof StrandsNode) {
      return args[0];
    }
    if (args.length > 4) {
      FES.userError("type error", "It looks like you've tried to construct a p5.strands node implicitly, with more than 4 components. This is currently not supported.")
    }
    const { id, dimension } = build.primitiveConstructorNode(strandsContext, { baseType: BaseType.FLOAT, dimension: null }, args.flat());
    return createStrandsNode(id, dimension, strandsContext);//new StrandsNode(id, dimension, strandsContext);
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
          const { id, dimension } =  build.functionCallNode(strandsContext, functionName, args);
          return createStrandsNode(id, dimension, strandsContext);
        } else {
          return originalFn.apply(this, args);
        }
      }
    } else {
      fn[functionName] = function (...args) {
        if (strandsContext.active) {
          const { id, dimension } = build.functionCallNode(strandsContext, functionName, args);
          return createStrandsNode(id, dimension, strandsContext);
        } else {
          p5._friendlyError(
            `It looks like you've called ${functionName} outside of a shader's modify() function.`
          )
        }
      }
    }
  }
  // Add GLSL noise. TODO: Replace this with a backend-agnostic implementation
  const originalNoise = fn.noise;
  fn.noise = function (...args) {
    if (!strandsContext.active) {
      return originalNoise.apply(this, args); // fallback to regular p5.js noise
    }
    strandsContext.vertexDeclarations.add(noiseGLSL);
    strandsContext.fragmentDeclarations.add(noiseGLSL);
    // Handle noise(x, y) as noise(vec2)
    let nodeArgs;
    if (args.length === 3) {
      nodeArgs = [fn.vec3(args[0], args[1], args[2])];
    } else if (args.length === 2) {
      nodeArgs = [fn.vec3(args[0], args[1], 0)];
    } else {
      nodeArgs = args;
    }
    const { id, dimension } = build.functionCallNode(strandsContext, 'noise', nodeArgs, {
      overloads: [{
        params: [DataType.float3],
        returnType: DataType.float1,
      }]
    });
    return createStrandsNode(id, dimension, strandsContext);
  };
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
      const { id, dimension } = build.variableNode(strandsContext, typeInfo, name);
      strandsContext.uniforms.push({ name, typeInfo, defaultValue });
      return createStrandsNode(id, dimension, strandsContext);
    };
    if (pascalTypeName.startsWith('Vec')) {
      // For compatibility, also alias uniformVec2 as uniformVector2, what we initially
      // documented these as
      fn[`uniform${pascalTypeName.replace('Vec', 'Vector')}`] = fn[`uniform${pascalTypeName}`];
    }
    const originalp5Fn = fn[typeInfo.fnName];
    fn[typeInfo.fnName] = function(...args) {
      if (strandsContext.active) {
        const { id, dimension } = build.primitiveConstructorNode(strandsContext, typeInfo, args);
        return createStrandsNode(id, dimension, strandsContext);
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
  const dag = strandsContext.dag;
  for (const param of parameters) {
    if(isStructType(param.type.typeName)) {
      const structTypeInfo = structType(param);
      const { id, dimension } = build.structInstanceNode(strandsContext, structTypeInfo, param.name, []);
      const structNode = createStrandsNode(id, dimension, strandsContext);
      for (let i = 0; i < structTypeInfo.properties.length; i++) {
        const propertyType = structTypeInfo.properties[i];
        Object.defineProperty(structNode, propertyType.name, {
          get() {
            const propNode = getNodeDataFromID(dag, dag.dependsOn[structNode.id][i])
            const onRebind = (newFieldID) => {
              const oldDeps = dag.dependsOn[structNode.id];
              const newDeps = oldDeps.slice();
              newDeps[i] = newFieldID;
              const rebuilt = build.structInstanceNode(strandsContext, structTypeInfo, param.name, newDeps);
              structNode.id = rebuilt.id;
            };
            // TODO: implement member access operations
            // const { id, components } = createMemberAccessNode(strandsContext, structNode, componentNodes[i], componentTypeInfo.dataType);
            // const memberAccessNode = new StrandsNode(id, components);
            // return memberAccessNode;
            return createStrandsNode(propNode.id, propNode.dimension, strandsContext, onRebind);
          },
          set(val) {
            const oldDependsOn = dag.dependsOn[structNode.id];
            const newDependsOn = [...oldDependsOn];
            let newValueID;
            if (val instanceof StrandsNode) {
              newValueID = val.id;
            }
            else {
              let newVal = build.primitiveConstructorNode(strandsContext, propertyType.dataType, val);
              newValueID = newVal.id;
            }
            newDependsOn[i] = newValueID;
            const newStructInfo = build.structInstanceNode(strandsContext, structTypeInfo, param.name, newDependsOn);
            structNode.id = newStructInfo.id;
          }
        })
      }
      args.push(structNode);
    }
    else /*if(isNativeType(paramType.typeName))*/ {
      const typeInfo = TypeInfoFromGLSLName[param.type.typeName];
      const { id, dimension } = build.variableNode(strandsContext, typeInfo, param.name);
      const arg = createStrandsNode(id, dimension, strandsContext);
      args.push(arg);
    }
  }
  return args;
}
function enforceReturnTypeMatch(strandsContext, expectedType, returned, hookName) {
  if (!(returned instanceof StrandsNode)) {
    // try {
      const result = build.primitiveConstructorNode(strandsContext, expectedType, returned);
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
      FES.userError('type error', `You have returned a vector with ${receivedType.dimension} components in ${hookName} when a ${expectedType.baseType + expectedType.dimension} was expected!`);
    }
    else {
      const result = build.primitiveConstructorNode(strandsContext, expectedType, returned);
      returnedNodeID = result.id;
    }
  }
  else if (receivedType.baseType !== expectedType.baseType) {
    const result = build.primitiveConstructorNode(strandsContext, expectedType, returned);
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
  const { cfg, dag } = strandsContext;
  for (const hookType of hookTypes) {
    const hookImplementation = function(hookUserCallback) {
      const entryBlockID = CFG.createBasicBlock(cfg, BlockType.FUNCTION);
      CFG.addEdge(cfg, cfg.currentBlock, entryBlockID);
      CFG.pushBlock(cfg, entryBlockID);
      const args = createHookArguments(strandsContext, hookType.parameters);
      const userReturned = hookUserCallback(...args);
      const expectedReturnType = hookType.returnType;
      let rootNodeID = null;
      if(isStructType(expectedReturnType.typeName)) {
        const expectedStructType = structType(expectedReturnType);
        if (userReturned instanceof StrandsNode) {
          const returnedNode = getNodeDataFromID(strandsContext.dag, userReturned.id);
          if (returnedNode.baseType !== expectedStructType.typeName) {
            FES.userError("type error", `You have returned a ${userReturned.baseType} from ${hookType.name} when a ${expectedStructType.typeName} was expected.`);
          }
          const newDeps = returnedNode.dependsOn.slice();
          for (let i = 0; i < expectedStructType.properties.length; i++) {
            const expectedType = expectedStructType.properties[i].dataType;
            const receivedNode = createStrandsNode(returnedNode.dependsOn[i], dag.dependsOn[userReturned.id], strandsContext);
            newDeps[i] = enforceReturnTypeMatch(strandsContext, expectedType, receivedNode, hookType.name);
          }
          dag.dependsOn[userReturned.id] = newDeps;
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
          const newStruct = build.structConstructorNode(strandsContext, expectedStructType, newStructDependencies);
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
    strandsContext.windowOverrides[hookType.name] = window[hookType.name];
    strandsContext.fnOverrides[hookType.name] = fn[hookType.name];
    window[hookType.name] = hookImplementation;
    fn[hookType.name] = hookImplementation;
  }
}
