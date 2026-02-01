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
  NodeType,
  // isNativeType
} from './ir_types'
import { strandsBuiltinFunctions } from './strands_builtins'
import { StrandsConditional } from './strands_conditionals'
import { StrandsFor } from './strands_for'
import * as CFG from './ir_cfg'
import * as DAG from './ir_dag';
import * as FES from './strands_FES'
import { getNodeDataFromID } from './ir_dag'
import { StrandsNode, createStrandsNode } from './strands_node'

const BUILTIN_GLOBAL_SPECS = {
  width: { typeInfo: DataType.float1, get: (p) => p.width },
  height: { typeInfo: DataType.float1, get: (p) => p.height },
  mouseX: { typeInfo: DataType.float1, get: (p) => p.mouseX },
  mouseY: { typeInfo: DataType.float1, get: (p) => p.mouseY },
  pmouseX: { typeInfo: DataType.float1, get: (p) => p.pmouseX },
  pmouseY: { typeInfo: DataType.float1, get: (p) => p.pmouseY },
  winMouseX: { typeInfo: DataType.float1, get: (p) => p.winMouseX },
  winMouseY: { typeInfo: DataType.float1, get: (p) => p.winMouseY },
  pwinMouseX: { typeInfo: DataType.float1, get: (p) => p.pwinMouseX },
  pwinMouseY: { typeInfo: DataType.float1, get: (p) => p.pwinMouseY },
  frameCount: { typeInfo: DataType.float1, get: (p) => p.frameCount },
  deltaTime: { typeInfo: DataType.float1, get: (p) => p.deltaTime },
  displayWidth: { typeInfo: DataType.float1, get: (p) => p.displayWidth },
  displayHeight: { typeInfo: DataType.float1, get: (p) => p.displayHeight },
  windowWidth: { typeInfo: DataType.float1, get: (p) => p.windowWidth },
  windowHeight: { typeInfo: DataType.float1, get: (p) => p.windowHeight },
  mouseIsPressed: { typeInfo: DataType.bool1, get: (p) => p.mouseIsPressed },
}

function _getBuiltinGlobalsCache(strandsContext) {
  if (!strandsContext._builtinGlobals || strandsContext._builtinGlobals.dag !== strandsContext.dag) {
    strandsContext._builtinGlobals = {
      dag: strandsContext.dag,
      nodes: new Map(),
      uniformsAdded: new Set(),
    }
  }
  // return the cache
  return strandsContext._builtinGlobals
}

function getBuiltinGlobalNode(strandsContext, name) {
  const spec = BUILTIN_GLOBAL_SPECS[name]
  if (!spec) return null
  
  const cache = _getBuiltinGlobalsCache(strandsContext)
  const uniformName = `_p5_global_${name}`
  const cached = cache.nodes.get(uniformName)
  if (cached) return cached

  if (!cache.uniformsAdded.has(uniformName)) {
    cache.uniformsAdded.add(uniformName)
    strandsContext.uniforms.push({
      name: uniformName,
      typeInfo: spec.typeInfo,
      defaultValue: () => {
        const p5Instance = strandsContext.renderer?._pInst || strandsContext.p5?.instance
        return p5Instance ? spec.get(p5Instance) : undefined
      },
    })
  }

  const { id, dimension } = build.variableNode(strandsContext, spec.typeInfo, uniformName)
  const node = createStrandsNode(id, dimension, strandsContext)
  node._originalBuiltinName = name
  cache.nodes.set(uniformName, node)
  return node
}

function installBuiltinGlobalAccessors(strandsContext) {
  if (strandsContext._builtinGlobalsAccessorsInstalled) return

  const getRuntimeP5Instance = () => strandsContext.renderer?._pInst || strandsContext.p5?.instance

  for (const name of Object.keys(BUILTIN_GLOBAL_SPECS)) {
    const spec = BUILTIN_GLOBAL_SPECS[name]
    Object.defineProperty(window, name, {
      get: () => {
        if (strandsContext.active) {
          return getBuiltinGlobalNode(strandsContext, name);
        }
        const inst = getRuntimeP5Instance()
          return spec.get(inst);
      },
    })
  }
  strandsContext._builtinGlobalsAccessorsInstalled = true
}

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
    const node = build.variableNode(strandsContext, { baseType: BaseType.INT, dimension: 1 }, strandsContext.backend.instanceIdReference());
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
  p5.strandsEarlyReturn = function(value) {
    const { dag, cfg } = strandsContext;

    // Ensure we're inside a hook
    if (!strandsContext.activeHook) {
      throw new Error('strandsEarlyReturn can only be used inside a hook callback');
    }

    // Convert value to a StrandsNode if it isn't already
    const valueNode = value instanceof StrandsNode ? value : p5.strandsNode(value);

    // Create a new CFG block for the early return
    const earlyReturnBlockID = CFG.createBasicBlock(cfg, BlockType.DEFAULT);
    CFG.addEdge(cfg, cfg.currentBlock, earlyReturnBlockID);
    CFG.pushBlock(cfg, earlyReturnBlockID);

    // Create the early return statement node
    const nodeData = DAG.createNodeData({
      nodeType: NodeType.STATEMENT,
      statementType: StatementType.EARLY_RETURN,
      dependsOn: [valueNode.id]
    });
    const earlyReturnID = DAG.getOrCreateNode(dag, nodeData);
    CFG.recordInBasicBlock(cfg, cfg.currentBlock, earlyReturnID);

    // Add the value to the hook's earlyReturns array for later type checking
    strandsContext.activeHook.earlyReturns.push({ earlyReturnID, valueNode });

    CFG.popBlock(cfg);

    return valueNode;
  };
  fn.strandsEarlyReturn = p5.strandsEarlyReturn;
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

  fn.getTexture = function (...rawArgs) {
    if (strandsContext.active) {
      const { id, dimension } = strandsContext.backend.createGetTextureCall(strandsContext, rawArgs);
      return createStrandsNode(id, dimension, strandsContext);
    } else {
      p5._friendlyError(
        `It looks like you've called getTexture outside of a shader's modify() function.`
      )
    }
  }

  // Add texture function as alias for getTexture with p5 fallback
  const originalTexture = fn.texture;
  fn.texture = function (...args) {
    if (strandsContext.active) {
      return this.getTexture(...args);
    } else {
      return originalTexture.apply(this, args);
    }
  }

  // Add noise function with backend-agnostic implementation
  const originalNoise = fn.noise;
  const originalNoiseDetail = fn.noiseDetail;

  strandsContext._noiseOctaves = null;
  strandsContext._noiseAmpFalloff = null;

  fn.noiseDetail = function (lod, falloff = 0.5) {
    if (!strandsContext.active) {
      return originalNoiseDetail.apply(this, arguments);
    }

    strandsContext._noiseOctaves = lod;
    strandsContext._noiseAmpFalloff = falloff;
  };

  fn.noise = function (...args) {
    if (!strandsContext.active) {
      return originalNoise.apply(this, args); // fallback to regular p5.js noise
    }
    // Get noise shader snippet from the current renderer
    const noiseSnippet = this._renderer.getNoiseShaderSnippet();
    strandsContext.vertexDeclarations.add(noiseSnippet);
    strandsContext.fragmentDeclarations.add(noiseSnippet);

    // Make each input into a strands node so that we can check their dimensions
    const strandsArgs = args.flat().map(arg => p5.strandsNode(arg));
    let nodeArgs;
    if (strandsArgs.length === 3) {
      nodeArgs = [fn.vec3(strandsArgs[0], strandsArgs[1], strandsArgs[2])];
    } else if (strandsArgs.length === 2) {
      nodeArgs = [fn.vec3(strandsArgs[0], strandsArgs[1], 0)];
    } else if (strandsArgs.length === 1 && strandsArgs[0].dimension <= 3) {
      if (strandsArgs[0].dimension === 3) {
        nodeArgs = strandsArgs;
      } else if (strandsArgs[0].dimension === 2) {
        nodeArgs = [fn.vec3(strandsArgs[0], 0)];
      } else {
        nodeArgs = [fn.vec3(strandsArgs[0], 0, 0)];
      }
    } else {
      p5._friendlyError(
        `It looks like you've called noise() with ${args.length} arguments. It only supports 1D to 3D input.`
      );
    }

    const octaves = strandsContext._noiseOctaves !== null
      ? strandsContext._noiseOctaves
      : fn._getNoiseOctaves();
    const falloff = strandsContext._noiseAmpFalloff !== null
      ? strandsContext._noiseAmpFalloff
      : fn._getNoiseAmpFalloff();

    nodeArgs.push(octaves);
    nodeArgs.push(falloff);

    const { id, dimension } = build.functionCallNode(strandsContext, 'noise', nodeArgs, {
      overloads: [{
        params: [DataType.float3, DataType.int1, DataType.float1],
        returnType: DataType.float1,
      }]
    });
    return createStrandsNode(id, dimension, strandsContext);
  };

  // Next is type constructors and uniform functions.
  // For some of them, we have aliases so that you can write either a more human-readable
  // variant or also one more directly translated from GLSL, or to be more compatible with
  // APIs we documented at the release of 2.x and have to continue supporting.
  for (const type in DataType) {
    if (type === BaseType.DEFER || type === 'sampler') {
      continue;
    }
    const typeInfo = DataType[type];
    const typeAliases = [];
    let pascalTypeName;
    if (/^[ib]vec/.test(typeInfo.fnName)) {
      pascalTypeName = typeInfo.fnName
        .slice(0, 2).toUpperCase()
        + typeInfo.fnName
          .slice(2)
          .toLowerCase();
      typeAliases.push(pascalTypeName.replace('Vec', 'Vector'));
    } else {
      pascalTypeName = typeInfo.fnName.charAt(0).toUpperCase()
        + typeInfo.fnName.slice(1);
      if (pascalTypeName === 'Sampler2D') {
        typeAliases.push('Texture')
      } else if (/^vec/.test(typeInfo.fnName)) {
        typeAliases.push(pascalTypeName.replace('Vec', 'Vector'));
      }
    }
    fn[`uniform${pascalTypeName}`] = function(name, defaultValue) {
      const { id, dimension } = build.variableNode(strandsContext, typeInfo, name);
      strandsContext.uniforms.push({ name, typeInfo, defaultValue });
      return createStrandsNode(id, dimension, strandsContext);
    };
    // Shared variables with smart context detection
    fn[`shared${pascalTypeName}`] = function(name) {
      const { id, dimension } = build.variableNode(strandsContext, typeInfo, name);

      // Initialize shared variables tracking if not present
      if (!strandsContext.sharedVariables) {
        strandsContext.sharedVariables = new Map();
      }

      // Track this shared variable for smart declaration generation
      strandsContext.sharedVariables.set(name, {
        typeInfo,
        usedInVertex: false,
        usedInFragment: false,
        declared: false
      });

      return createStrandsNode(id, dimension, strandsContext);
    };

    // Alias varying* as shared* for backward compatibility
    fn[`varying${pascalTypeName}`] = fn[`shared${pascalTypeName}`];

    for (const typeAlias of typeAliases) {
      // For compatibility, also alias uniformVec2 as uniformVector2, what we initially
      // documented these as
      fn[`uniform${typeAlias}`] = fn[`uniform${pascalTypeName}`];
      fn[`varying${typeAlias}`] = fn[`varying${pascalTypeName}`];
      fn[`shared${typeAlias}`] = fn[`shared${pascalTypeName}`];
    }
    const originalp5Fn = fn[typeInfo.fnName];
    fn[typeInfo.fnName] = function(...args) {
      if (strandsContext.active) {
        if (args.length === 1 && args[0].dimension && args[0].dimension === typeInfo.dimension) {
          const { id, dimension } = build.functionCallNode(strandsContext, typeInfo.fnName, args, {
            overloads: [{
              params: [args[0].typeInfo()],
              returnType: typeInfo,
            }]
          });
          return createStrandsNode(id, dimension, strandsContext);
        } else {
          // For vector types with a single argument, repeat it for each component
          if (typeInfo.dimension > 1 && args.length === 1 && !Array.isArray(args[0]) &&
              !(args[0] instanceof StrandsNode && args[0].dimension > 1) &&
              (typeInfo.baseType === BaseType.FLOAT || typeInfo.baseType === BaseType.INT || typeInfo.baseType === BaseType.BOOL)) {
            args = Array(typeInfo.dimension).fill(args[0]);
          }
          const { id, dimension } = build.primitiveConstructorNode(strandsContext, typeInfo, args);
          return createStrandsNode(id, dimension, strandsContext);
        }
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
    if(isStructType(param.type)) {
      const structTypeInfo = structType(param);
      const { id, dimension } = build.structInstanceNode(strandsContext, structTypeInfo, param.name, []);
      const structNode = createStrandsNode(id, dimension, strandsContext).withStructProperties(
        structTypeInfo.properties.map(prop => prop.name)
      );
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
      // Skip sampler parameters - they don't need strands nodes
      if (param.type.typeName === 'sampler') {
        continue;
      }
      if (!param.type.dataType) {
        throw new Error(`Missing dataType for parameter ${param.name} of type ${param.type.typeName}`);
      }
      const typeInfo = param.type.dataType;
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
  installBuiltinGlobalAccessors(strandsContext)

  // Add shader context to hooks before spreading
  const vertexHooksWithContext = Object.fromEntries(
    Object.entries(shader.hooks.vertex).map(([name, hook]) => [name, { ...hook, shaderContext: 'vertex' }])
  );
  const fragmentHooksWithContext = Object.fromEntries(
    Object.entries(shader.hooks.fragment).map(([name, hook]) => [name, { ...hook, shaderContext: 'fragment' }])
  );

  const availableHooks = {
    ...vertexHooksWithContext,
    ...fragmentHooksWithContext,
  }
  const hookTypes = Object.keys(availableHooks).map(name => shader.hookTypes(name));

  const { cfg, dag } = strandsContext;
  for (const hookType of hookTypes) {
    const hook = function(hookUserCallback) {
      const args = setupHook();
      hook._result = hookUserCallback(...args) ?? hook._result;
      finishHook();
    }

    // In the flat strands API, this is how result-returning hooks
    // are used
    hook.set = function(result) {
      hook._result = result;
    };

    let entryBlockID;
    function setupHook() {
      strandsContext.activeHook = hook;
      entryBlockID = CFG.createBasicBlock(cfg, BlockType.FUNCTION);
      CFG.addEdge(cfg, cfg.currentBlock, entryBlockID);
      CFG.pushBlock(cfg, entryBlockID);
      const args = createHookArguments(strandsContext, hookType.parameters);
      const numStructArgs = hookType.parameters.filter(param => param.type.properties).length;
      let argIdx = -1;
      if (numStructArgs === 1) {
        argIdx = hookType.parameters.findIndex(param => param.type.properties);
      }
      for (let i = 0; i < args.length; i++) {
        if (i === argIdx) {
          for (const key of args[argIdx].structProperties || []) {
            Object.defineProperty(hook, key, {
              get() {
                return args[argIdx][key];
              },
              set(val) {
                args[argIdx][key] = val;
              },
              enumerable: true,
            });
          }
          if (hookType.returnType?.typeName === hookType.parameters[argIdx].type.typeName) {
            hook.set(args[argIdx]);
          }
        } else {
          hook[hookType.parameters[i].name] = args[i];
        }
      }
      return args;
    };

    function finishHook() {
      const userReturned = hook._result;
      strandsContext.activeHook = undefined;

      const expectedReturnType = hookType.returnType;
      let rootNodeID = null;
      const handleRetVal = (retNode) => {
        if(isStructType(expectedReturnType)) {
          const expectedStructType = structType(expectedReturnType);
          if (retNode instanceof StrandsNode) {
            const returnedNode = getNodeDataFromID(strandsContext.dag, retNode.id);
            if (returnedNode.baseType !== expectedStructType.typeName) {
              FES.userError("type error", `You have returned a ${retNode.baseType} from ${hookType.name} when a ${expectedStructType.typeName} was expected.`);
            }
            const newDeps = returnedNode.dependsOn.slice();
            for (let i = 0; i < expectedStructType.properties.length; i++) {
              const expectedType = expectedStructType.properties[i].dataType;
              const receivedNode = createStrandsNode(returnedNode.dependsOn[i], dag.dependsOn[retNode.id], strandsContext);
              newDeps[i] = enforceReturnTypeMatch(strandsContext, expectedType, receivedNode, hookType.name);
            }
            dag.dependsOn[retNode.id] = newDeps;
            return retNode.id;
          }
          else {
            const expectedProperties = expectedStructType.properties;
            const newStructDependencies = [];
            for (let i = 0; i < expectedProperties.length; i++) {
              const expectedProp = expectedProperties[i];
              const propName = expectedProp.name;
              const receivedValue = retNode[propName];
              if (receivedValue === undefined) {
                FES.userError('type error', `You've returned an incomplete struct from ${hookType.name}.\n` +
                  `Expected: { ${expectedReturnType.properties.map(p => p.name).join(', ')} }\n` +
                  `Received: { ${Object.keys(retNode).join(', ')} }\n` +
                  `All of the properties are required!`);
              }
              const expectedTypeInfo = expectedProp.dataType;
              const returnedPropID = enforceReturnTypeMatch(strandsContext, expectedTypeInfo, receivedValue, hookType.name);
              newStructDependencies.push(returnedPropID);
            }
            const newStruct = build.structConstructorNode(strandsContext, expectedStructType, newStructDependencies);
            return newStruct.id;
          }
        }
        else /*if(isNativeType(expectedReturnType.typeName))*/ {
          if (!expectedReturnType.dataType) {
            throw new Error(`Missing dataType for return type ${expectedReturnType.typeName}`);
          }
          const expectedTypeInfo = expectedReturnType.dataType;
          return enforceReturnTypeMatch(strandsContext, expectedTypeInfo, retNode, hookType.name);
        }
      }
      for (const { valueNode, earlyReturnID } of hook.earlyReturns) {
        const id = handleRetVal(valueNode);
        dag.dependsOn[earlyReturnID] = [id];
      }
      rootNodeID = userReturned ? handleRetVal(userReturned) : undefined;
      const fullHookName = `${hookType.returnType.typeName} ${hookType.name}`;
      const hookInfo = availableHooks[fullHookName];
      strandsContext.hooks.push({
        hookType,
        entryBlockID,
        rootNodeID,
        shaderContext: hookInfo?.shaderContext, // 'vertex' or 'fragment'
      });
      CFG.popBlock(cfg);
    };
    hook.begin = setupHook;
    hook.end = finishHook;

    const aliases = [hookType.name];
    if (strandsContext.baseShader?.hooks?.hookAliases?.[hookType.name]) {
      aliases.push(...strandsContext.baseShader.hooks.hookAliases[hookType.name]);
    }

    // If the hook has a name like getPixelInputs, create an alias without
    // the get* prefix, like pixelInputs
    const nameMatch = /^get([A-Z0-9]\w*)$/.exec(hookType.name);
    if (nameMatch) {
      const unprefixedName = nameMatch[1][0].toLowerCase() + nameMatch[1].slice(1);
      if (!fn[unprefixedName]) {
        aliases.push(unprefixedName);
      }
    }

    for (const name of aliases) {
      strandsContext.windowOverrides[name] = window[name];
      strandsContext.fnOverrides[name] = fn[name];
      window[name] = hook;
      fn[name] = hook;
    }
    hook.earlyReturns = [];
  }
}
