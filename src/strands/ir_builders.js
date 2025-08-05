import * as DAG from './ir_dag'
import * as CFG from './ir_cfg'
import * as FES from './strands_FES'
import { NodeType, OpCode, BaseType, DataType, BasePriority, OpCodeToSymbol, typeEquals, } from './ir_types';
import { StrandsNode } from './strands_api';
import { strandsBuiltinFunctions } from './strands_builtins';

//////////////////////////////////////////////
// Builders for node graphs
//////////////////////////////////////////////
export function createScalarLiteralNode(strandsContext, typeInfo, value) {
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
  return { id, components: dimension };
}

export function createVariableNode(strandsContext, typeInfo, identifier) {
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
  return { id, components: dimension };
}

export function createSwizzleNode(strandsContext, parentNode, swizzle) {
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
  return id;
}

export function createBinaryOpNode(strandsContext, leftStrandsNode, rightArg, opCode) {
  const { dag, cfg } = strandsContext;
  // Construct a node for right if its just an array or number etc.
  let rightStrandsNode;
  if (rightArg[0] instanceof StrandsNode && rightArg.length === 1) {
    rightStrandsNode = rightArg[0];
  } else {
    const { id, components } = createPrimitiveConstructorNode(strandsContext, { baseType: BaseType.DEFER, dimension: null }, rightArg);
    rightStrandsNode = new StrandsNode(id, components, strandsContext);
  }
  let finalLeftNodeID = leftStrandsNode.id;
  let finalRightNodeID = rightStrandsNode.id;

  // Check if we have to cast either node
  const leftType = DAG.extractNodeTypeInfo(dag, leftStrandsNode.id);
  const rightType = DAG.extractNodeTypeInfo(dag, rightStrandsNode.id);
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
    const l = createPrimitiveConstructorNode(strandsContext, cast.toType, leftStrandsNode);
    const r = createPrimitiveConstructorNode(strandsContext, cast.toType, rightStrandsNode);
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

    const casted = createPrimitiveConstructorNode(strandsContext, cast.toType, cast.node);
    if (cast.node === leftStrandsNode) {
      finalLeftNodeID = casted.id;
    } else {
      finalRightNodeID = casted.id;
    }
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
  return { id, components: nodeData.dimension };
}

export function createMemberAccessNode(strandsContext, parentNode, componentNode, memberTypeInfo) {
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
  return { id, components: memberTypeInfo.dimension };
}

export function createStructInstanceNode(strandsContext, structTypeInfo, identifier, dependsOn) {
  const { cfg, dag, } = strandsContext;

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
    baseType: structTypeInfo.name,
    identifier,
    dependsOn
  })
  const structID = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, structID);

  return { id: structID, components: dependsOn };
}

function mapPrimitiveDepsToIDs(strandsContext, typeInfo, dependsOn) {
  dependsOn = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
  const mappedDependencies = [];
  let { dimension, baseType } = typeInfo;

  const dag = strandsContext.dag;
  let calculatedDimensions = 0;
  let originalNodeID = null;
  for (const dep of dependsOn.flat(Infinity)) {
    if (dep instanceof StrandsNode) {
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
      const { id, components } = createScalarLiteralNode(strandsContext, { dimension: 1, baseType }, dep);
      mappedDependencies.push(id);
      calculatedDimensions += 1;
      continue;
    }
    else {
      FES.userError('type error', `You've tried to construct a scalar or vector type with a non-numeric value: ${dep}`);
    }
  }
  // Sometimes, the dimension is undefined
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

export function createPrimitiveConstructorNode(strandsContext, typeInfo, dependsOn) {
  const { cfg, dag } = strandsContext;
  const { mappedDependencies, inferredTypeInfo } = mapPrimitiveDepsToIDs(strandsContext, typeInfo, dependsOn);
  const finalType = {
    baseType: typeInfo.baseType, 
    dimension: inferredTypeInfo.dimension
  };
  const id = constructTypeFromIDs(strandsContext, finalType, mappedDependencies);
  if (typeInfo.baseType !== BaseType.DEFER) {
    CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  }
  return { id, components: mappedDependencies };
}

export function createStructConstructorNode(strandsContext, structTypeInfo, rawUserArgs) {
  const { cfg, dag } = strandsContext;
  const { identifer, properties } = structTypeInfo;

  if (!(rawUserArgs.length === properties.length)) {
    FES.userError('type error', 
      `You've tried to construct a ${structTypeInfo.name} struct with ${rawUserArgs.length} properties, but it expects ${properties.length} properties.\n` + 
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
    baseType: structTypeInfo.name,
    dependsOn
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, components: structTypeInfo.components };
}

export function createFunctionCallNode(strandsContext, functionName, rawUserArgs) {
  const { cfg, dag } = strandsContext;
  const overloads = strandsBuiltinFunctions[functionName];

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
  return { id, components: { dependsOn, dimension: inferredReturnType.dimension } };
}

export function createUnaryOpNode(strandsContext, strandsNode, opCode) {
  const { dag, cfg } = strandsContext;
  const dependsOn = strandsNode.id;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode,
    dependsOn,
    baseType: dag.baseTypes[strandsNode.id],
    dimension: dag.dimensions[strandsNode.id],
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return { id, components: {dep} };
}

export function createStatementNode(strandsContext, opCode) {
  const { dag, cfg } = strandsContext;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.STATEMENT,
    opCode
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}