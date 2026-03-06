import * as DAG from './ir_dag'
import * as CFG from './ir_cfg'
import * as FES from './strands_FES'
import { NodeType, OpCode, BaseType, DataType, BasePriority, OpCodeToSymbol, typeEquals, booleanOpCode } from './ir_types';
import { createStrandsNode, StrandsNode } from './strands_node';
import { strandsBuiltinFunctions } from './strands_builtins';

//////////////////////////////////////////////
// Builders for node graphs
//////////////////////////////////////////////
export function scalarLiteralNode(strandsContext, typeInfo, value) {
  const { cfg, dag } = strandsContext
  let { dimension, baseType } = typeInfo;
  if (dimension !== 1) {
    FES.internalError('Created a scalar literal node with dimension > 1.')
  }
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.LITERAL,
    dimension,
    baseType,
    value
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension };
}

export function variableNode(strandsContext, typeInfo, identifier) {
  const { cfg, dag } = strandsContext;
  const { dimension, baseType } = typeInfo;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.VARIABLE,
    dimension,
    baseType,
    identifier
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension };
}

export function unaryOpNode(strandsContext, nodeOrValue, opCode) {
  const { dag, cfg } = strandsContext;
  let dependsOn;
  let node;
  if (nodeOrValue?.isStrandsNode) {
    node = nodeOrValue;
  } else {
    const { id, dimension } = primitiveConstructorNode(strandsContext, { baseType: BaseType.FLOAT, dimension: null }, nodeOrValue);
    node = createStrandsNode(id, dimension, strandsContext);
  }
  dependsOn = [node.id];

  const typeInfo = {
    baseType: dag.baseTypes[node.id],
    dimension: node.dimension
  };
  if (booleanOpCode[opCode]) {
    typeInfo.baseType = BaseType.BOOL;
    typeInfo.dimension = 1;
  }

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode,
    dependsOn,
    baseType: typeInfo.baseType,
    dimension: typeInfo.dimension
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension: node.dimension };
}

export function binaryOpNode(strandsContext, leftStrandsNode, rightArg, opCode) {
  const { dag, cfg } = strandsContext;
  // Construct a node for right if its just an array or number etc.
  let rightStrandsNode;
  if (rightArg[0] instanceof StrandsNode && rightArg.length === 1) {
    rightStrandsNode = rightArg[0];
  } else {
    const { id, dimension } = primitiveConstructorNode(strandsContext, { baseType: BaseType.FLOAT, dimension: null }, rightArg);
    rightStrandsNode = createStrandsNode(id, dimension, strandsContext);
  }
  let finalLeftNodeID = leftStrandsNode.id;
  let finalRightNodeID = rightStrandsNode.id;

  // Check if we have to cast either node
  let leftType = DAG.extractNodeTypeInfo(dag, leftStrandsNode.id);
  let rightType = DAG.extractNodeTypeInfo(dag, rightStrandsNode.id);

  // Update ASSIGN_ON_USE nodes to match the type of the other operand
  if (leftType.baseType === BaseType.ASSIGN_ON_USE && rightType.baseType !== BaseType.ASSIGN_ON_USE) {
    DAG.propagateTypeToAssignOnUse(dag, leftStrandsNode.id, rightType.baseType, rightType.dimension);
    leftType = DAG.extractNodeTypeInfo(dag, leftStrandsNode.id);
  } else if (rightType.baseType === BaseType.ASSIGN_ON_USE && leftType.baseType !== BaseType.ASSIGN_ON_USE) {
    DAG.propagateTypeToAssignOnUse(dag, rightStrandsNode.id, leftType.baseType, leftType.dimension);
    rightType = DAG.extractNodeTypeInfo(dag, rightStrandsNode.id);
  }
  const cast = { node: null, toType: leftType };
  const bothDeferred = leftType.baseType === rightType.baseType && leftType.baseType === BaseType.DEFER;
  if (bothDeferred) {
    cast.toType.baseType = BaseType.FLOAT;
    if (leftType.dimension === rightType.dimension) {
      cast.toType.dimension = leftType.dimension;
    }
    else if (leftType.dimension === 1 && rightType.dimension > 1) {
      cast.toType.dimension = rightType.dimension;
    }
    else if (rightType.dimension === 1 && leftType.dimension > 1) {
      cast.toType.dimension = leftType.dimension;
    }
    else {
      FES.userError("type error", `You have tried to perform a binary operation:\n`+
        `${leftType.baseType+leftType.dimension} ${OpCodeToSymbol[opCode]} ${rightType.baseType+rightType.dimension}\n` +
        `It's only possible to operate on two nodes with the same dimension, or a scalar value and a vector.`
      );
    }
    const l = primitiveConstructorNode(strandsContext, cast.toType, leftStrandsNode);
    const r = primitiveConstructorNode(strandsContext, cast.toType, rightStrandsNode);
    finalLeftNodeID = l.id;
    finalRightNodeID = r.id;
  }
  else if (leftType.baseType !== rightType.baseType ||
    leftType.dimension !== rightType.dimension) {

    if (leftType.dimension === 1 && rightType.dimension > 1) {
      cast.node = leftStrandsNode;
      cast.toType = rightType;
    }
    else if (rightType.dimension === 1 && leftType.dimension > 1) {
      cast.node = rightStrandsNode;
      cast.toType = leftType;
    }
    else if (leftType.priority > rightType.priority) {
      // e.g. op(float vector, int vector): cast priority is float > int > bool
      cast.node = rightStrandsNode;
      cast.toType = leftType;
    }
    else if (rightType.priority > leftType.priority) {
      cast.node = leftStrandsNode;
      cast.toType = rightType;
    }
    else {
      FES.userError('type error', `A vector of length ${leftType.dimension} operated with a vector of length ${rightType.dimension} is not allowed.`);
    }

    const casted = primitiveConstructorNode(strandsContext, cast.toType, cast.node);

    if (cast.node === leftStrandsNode) {
      leftStrandsNode = createStrandsNode(casted.id, casted.dimension, strandsContext);
      finalLeftNodeID = leftStrandsNode.id;
    } else {
      rightStrandsNode = createStrandsNode(casted.id, casted.dimension, strandsContext);
      finalRightNodeID = rightStrandsNode.id;
    }
  }

  if (booleanOpCode[opCode]) {
    cast.toType.baseType = BaseType.BOOL;
    cast.toType.dimension = 1;
  }

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode,
    dependsOn: [finalLeftNodeID, finalRightNodeID],
    baseType: cast.toType.baseType,
    dimension: cast.toType.dimension,
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension: nodeData.dimension };
}

export function memberAccessNode(strandsContext, parentNode, componentNode, memberTypeInfo) {
  const { dag, cfg } = strandsContext;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Binary.MEMBER_ACCESS,
    dimension: memberTypeInfo.dimension,
    baseType: memberTypeInfo.baseType,
    dependsOn: [parentNode.id, componentNode.id],
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension: memberTypeInfo.dimension };
}

export function structInstanceNode(strandsContext, structTypeInfo, identifier, dependsOn) {
  const { cfg, dag } = strandsContext;
  if (dependsOn.length === 0) {
    for (const prop of structTypeInfo.properties) {
      const typeInfo = prop.dataType;
      const nodeData = DAG.createNodeData({
        nodeType: NodeType.VARIABLE,
        baseType: typeInfo.baseType,
        dimension: typeInfo.dimension,
        identifier: `${identifier}.${prop.name}`,
      });
      const componentID = DAG.getOrCreateNode(dag, nodeData);
      CFG.recordInBasicBlock(cfg, cfg.currentBlock, componentID);
      dependsOn.push(componentID);
    }
  }

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.VARIABLE,
    dimension: structTypeInfo.properties.length,
    baseType: structTypeInfo.typeName,
    identifier,
    dependsOn
  })
  const structID = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, structID);

  return { id: structID, dimension: 0, components: dependsOn };
}

function mapPrimitiveDepsToIDs(strandsContext, typeInfo, dependsOn) {
  const inputs = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
  const mappedDependencies = [];
  let { dimension, baseType } = typeInfo;

  const dag = strandsContext.dag;
  let calculatedDimensions = 0;
  let originalNodeID = null;
  for (const dep of inputs.flat(Infinity)) {
    if (dep && dep.isStrandsNode) {
      const node = DAG.getNodeDataFromID(dag, dep.id);
      originalNodeID = dep.id;
      baseType = node.baseType;

      if (node.opCode === OpCode.Nary.CONSTRUCTOR) {
        for (const inner of node.dependsOn) {
          mappedDependencies.push(inner);
        }
      } else {
        mappedDependencies.push(dep.id);
      }

      calculatedDimensions += node.dimension;
      continue;
    }
    else if (typeof dep === 'number') {
      const { id, dimension } = scalarLiteralNode(strandsContext, { dimension: 1, baseType }, dep);
      mappedDependencies.push(id);
      calculatedDimensions += dimension;
      continue;
    }
    else if (typeof dep === 'boolean') {
      // Handle boolean literals - convert to bool type
      const { id, dimension } = scalarLiteralNode(strandsContext, { dimension: 1, baseType: BaseType.BOOL }, dep);
      mappedDependencies.push(id);
      calculatedDimensions += dimension;
      // Update baseType to BOOL if it was inferred
      if (baseType !== BaseType.BOOL) {
        baseType = BaseType.BOOL;
      }
      continue;
    }
    else {
      FES.userError('type error', `You've tried to construct a scalar or vector type with a non-numeric value: ${dep}`);
    }
  }
  if (dimension === null) {
    dimension = calculatedDimensions;
  } else if (dimension > calculatedDimensions && calculatedDimensions === 1) {
    calculatedDimensions = dimension;
  } else if(calculatedDimensions !== 1 && calculatedDimensions !== dimension) {
    FES.userError('type error', `You've tried to construct a ${baseType + dimension} with ${calculatedDimensions} components`);
  }
  const inferredTypeInfo = {
    dimension,
    baseType,
    priority: BasePriority[baseType],
  }
  return { originalNodeID, mappedDependencies, inferredTypeInfo };
}

export function constructTypeFromIDs(strandsContext, typeInfo, strandsNodesArray) {
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.CONSTRUCTOR,
    dimension: typeInfo.dimension,
    baseType: typeInfo.baseType,
    dependsOn: strandsNodesArray
  });
  const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
  return id;
}

export function primitiveConstructorNode(strandsContext, typeInfo, dependsOn) {
  const cfg = strandsContext.cfg;
  dependsOn = (Array.isArray(dependsOn) ? dependsOn : [dependsOn])
    .flat(Infinity)
    .map(a => {
      if (
        a.isStrandsNode &&
        a.typeInfo().baseType === BaseType.INT &&
        // TODO: handle ivec inputs instead of just int scalars
        a.typeInfo().dimension === 1
      ) {
        return castToFloat(strandsContext, a);
      } else {
        return a;
      }
    });
  const { mappedDependencies, inferredTypeInfo } = mapPrimitiveDepsToIDs(strandsContext, typeInfo, dependsOn);

  const finalType = {
    // We might have inferred a non numeric type. Currently this is
    // just used for booleans. Maybe this needs to be something more robust
    // if we ever want to support inference of e.g. int vectors?
    baseType: inferredTypeInfo.baseType === BaseType.BOOL
      ? BaseType.BOOL
      : typeInfo.baseType,
    dimension: inferredTypeInfo.dimension
  };

  const id = constructTypeFromIDs(strandsContext, finalType, mappedDependencies);
  if (typeInfo.baseType !== BaseType.DEFER) {
    CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  }

  return { id, dimension: finalType.dimension, components: mappedDependencies };
}

export function castToFloat(strandsContext, dep) {
  const { id, dimension } = functionCallNode(
    strandsContext,
    strandsContext.backend.getTypeName('float', dep.typeInfo().dimension),
    [dep],
    {
      overloads: [{
        params: [dep.typeInfo()],
        returnType: {
          ...dep.typeInfo(),
          baseType: BaseType.FLOAT,
        },
      }],
    }
  );
  return createStrandsNode(id, dimension, strandsContext);
}

export function structConstructorNode(strandsContext, structTypeInfo, rawUserArgs) {
  const { cfg, dag } = strandsContext;
  const { identifer, properties } = structTypeInfo;

  if (!(rawUserArgs.length === properties.length)) {
    FES.userError('type error',
      `You've tried to construct a ${structTypeInfo.typeName} struct with ${rawUserArgs.length} properties, but it expects ${properties.length} properties.\n` +
      `The properties it expects are:\n` +
      `${properties.map(prop => prop.name + ' ' + prop.DataType.baseType + prop.DataType.dimension)}`
    );
  }

  const dependsOn = [];
  for (let i = 0; i < properties.length; i++) {
    const expectedProperty = properties[i];
    const { originalNodeID, mappedDependencies } = mapPrimitiveDepsToIDs(strandsContext, expectedProperty.dataType, rawUserArgs[i]);
    if (originalNodeID) {
      dependsOn.push(originalNodeID);
    }
    else {
      dependsOn.push(
        constructTypeFromIDs(strandsContext, expectedProperty.dataType, mappedDependencies)
      );
    }
  }

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.CONSTRUCTOR,
    dimension: properties.length,
    baseType: structTypeInfo.typeName ,
    dependsOn
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension: properties.length, components: structTypeInfo.components };
}

export function functionCallNode(
  strandsContext,
  functionName,
  rawUserArgs,
  { overloads: rawOverloads } = {},
) {
  const { cfg, dag } = strandsContext;
  const overloads = rawOverloads || strandsBuiltinFunctions[functionName];

  const preprocessedArgs = rawUserArgs.map((rawUserArg) => mapPrimitiveDepsToIDs(strandsContext, DataType.defer, rawUserArg));
  const matchingArgsCounts = overloads.filter(overload => overload.params.length === preprocessedArgs.length);
  if (matchingArgsCounts.length === 0) {
    const argsLengthSet = new Set();
    const argsLengthArr = [];
    overloads.forEach((overload) => argsLengthSet.add(overload.params.length));
    argsLengthSet.forEach((len) => argsLengthArr.push(`${len}`));
    const argsLengthStr = argsLengthArr.join(', or ');
    FES.userError("parameter validation error",`Function '${functionName}' has ${overloads.length} variants which expect ${argsLengthStr} arguments, but ${preprocessedArgs.length} arguments were provided.`);
  }

  const isGeneric = (T) => T.dimension === null;
  let bestOverload = null;
  let bestScore = 0;
  let inferredReturnType = null;
  let inferredDimension = null;

  for (const overload of matchingArgsCounts) {
    let isValid = true;
    let similarity = 0;

    for (let i = 0; i < preprocessedArgs.length; i++) {
      const preArg = preprocessedArgs[i];
      const argType = preArg.inferredTypeInfo;
      const expectedType = overload.params[i];
      let dimension = expectedType.dimension;

      if (isGeneric(expectedType)) {
        if (inferredDimension === null || inferredDimension === 1) {
          inferredDimension = argType.dimension;
        }

        if (inferredDimension !== argType.dimension &&
          !(argType.dimension === 1 && inferredDimension >= 1)
          ) {
          isValid = false;
        }
        dimension = inferredDimension;
      }
      else {
        if (argType.dimension > dimension) {
          isValid = false;
        }
      }

      if (argType.baseType === expectedType.baseType) {
        similarity += 2;
      }
      else if(expectedType.priority > argType.priority) {
        similarity += 1;
      }

    }

    if (isValid && (!bestOverload || similarity > bestScore)) {
      bestOverload = overload;
      bestScore = similarity;
      inferredReturnType =  {...overload.returnType };
      if (isGeneric(inferredReturnType)) {
        inferredReturnType.dimension = inferredDimension;
      }
    }
  }

  if (bestOverload === null) {
    FES.userError('parameter validation', `No matching overload for ${functionName} was found!`);
  }

  let dependsOn = [];
  for (let i = 0; i < bestOverload.params.length; i++) {
    const arg = preprocessedArgs[i];
    const paramType = { ...bestOverload.params[i] };
    if (isGeneric(paramType)) {
      paramType.dimension = inferredDimension;
    }
    if (arg.originalNodeID && typeEquals(arg.inferredTypeInfo, paramType)) {
      dependsOn.push(arg.originalNodeID);
    }
    else {
      const castedArgID = constructTypeFromIDs(strandsContext, paramType, arg.mappedDependencies);
      CFG.recordInBasicBlock(cfg, cfg.currentBlock, castedArgID);
      dependsOn.push(castedArgID);
    }
  }

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.FUNCTION_CALL,
    identifier: functionName,
    dependsOn,
    baseType: inferredReturnType.baseType,
    dimension: inferredReturnType.dimension
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension: inferredReturnType.dimension  };
}

export function statementNode(strandsContext, statementType) {
  const { dag, cfg } = strandsContext;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.STATEMENT,
    statementType
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function swizzleNode(strandsContext, parentNode, swizzle) {
  const { dag, cfg } = strandsContext;
  const baseType = dag.baseTypes[parentNode.id];
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    baseType,
    dimension: swizzle.length,
    opCode: OpCode.Unary.SWIZZLE,
    dependsOn: [parentNode.id],
    swizzle,
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, dimension: swizzle.length };
}

export function swizzleTrap(id, dimension, strandsContext, onRebind) {
    const swizzleSets = [
      ['x', 'y', 'z', 'w'],
      ['r', 'g', 'b', 'a'],
      ['s', 't', 'p', 'q']
    ].map(s => s.slice(0, dimension));
    const trap = {
      get(target, property, receiver) {
        if (property in target) {
          return Reflect.get(...arguments);
        } else {
          for (const set of swizzleSets) {
            if ([...property.toString()].every(char => set.includes(char))) {
              const swizzle = [...property].map(char => {
                const index = set.indexOf(char);
                return swizzleSets[0][index];
              }).join('');
              const node = swizzleNode(strandsContext, target, swizzle);
              return createStrandsNode(node.id, node.dimension, strandsContext);
            }
          }
        }
    },
  set(target, property, value, receiver) {
    for (const swizzleSet of swizzleSets) {
      const chars = [...property];
      const valid =
        chars.every(c => swizzleSet.includes(c)) &&
        new Set(chars).size === chars.length &&
        target.dimension >= chars.length;
      if (!valid) continue;

      const dim = target.dimension;

      // lanes are the underlying values of the target vector
      //  e.g. lane 0 holds the value aliased by 'x', 'r', and 's'
      // the lanes array is in the 'correct' order
      const lanes = new Array(dim);
      for (let i = 0; i < dim; i++) {
        const { id, dimension } = swizzleNode(strandsContext, target, 'xyzw'[i]);
        lanes[i] = createStrandsNode(id, dimension, strandsContext);
      }

      // The scalars array contains the individual components of the users values.
      // This may not be the most efficient way, as we swizzle each component individually,
      // so that .xyz becomes .x, .y, .z
      let scalars = [];
      if (value?.isStrandsNode) {
        if (value.dimension === 1) {
          scalars = Array(chars.length).fill(value);
        } else if (value.dimension === chars.length) {
          for (let k = 0; k < chars.length; k++) {
            const { id, dimension } = swizzleNode(strandsContext, value, 'xyzw'[k]);
            scalars.push(createStrandsNode(id, dimension, strandsContext));
          }
        } else {
          FES.userError('type error', `Swizzle assignment: RHS vector does not match LHS vector (need ${chars.length}, got ${value.dimension}).`);
        }
      } else if (Array.isArray(value)) {
        const flat = value.flat(Infinity);
        if (flat.length === 1) {
          scalars = Array(chars.length).fill(flat[0]);
        } else if (flat.length === chars.length) {
          scalars = flat;
        } else {
          FES.userError('type error', `Swizzle assignment: RHS length ${flat.length} does not match ${chars.length}.`);
        }
      } else if (typeof value === 'number') {
        scalars = Array(chars.length).fill(value);
      } else {
        FES.userError('type error', `Unsupported RHS for swizzle assignment: ${value}`);
      }

      // The canonical index refers to the actual value's position in the vector lanes
      // i.e. we are finding (3,2,1) from .zyx
      // We set the correct value in the lanes array
      for (let j = 0; j < chars.length; j++) {
        const canonicalIndex = swizzleSet.indexOf(chars[j]);
        lanes[canonicalIndex] = scalars[j];
      }

      const orig = DAG.getNodeDataFromID(strandsContext.dag, target.id);
      const baseType = orig?.baseType ?? BaseType.FLOAT;
      const { id: newID } = primitiveConstructorNode(
        strandsContext,
        { baseType, dimension: dim },
        lanes
      );

      target.id = newID;

      // If we swizzle assign on a struct component i.e.
      //   inputs.position.rg = [1, 2]
      // The onRebind callback will update the structs components so that it refers to the new values,
      // and make a new ID for the struct with these new values
      if (typeof onRebind === 'function') {
        onRebind(newID);
      }
      return true;
    }
    return Reflect.set(...arguments);
  }
  };
  return trap;
}
