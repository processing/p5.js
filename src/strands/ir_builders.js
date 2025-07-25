import * as DAG from './ir_dag'
import * as CFG from './ir_cfg'
import * as FES from './strands_FES'
import { NodeType, OpCode, BaseType, DataType, BasePriority, } from './ir_types';
import { StrandsNode } from './strands_api';
import { strandsBuiltinFunctions } from './strands_builtins';

//////////////////////////////////////////////
// Builders for node graphs
//////////////////////////////////////////////
export function createLiteralNode(strandsContext, typeInfo, value) {
  const { cfg, dag } = strandsContext
  let { dimension, baseType } = typeInfo;

  if (dimension !== 1) {
    FES.internalError('Created a literal node with dimension > 1.')
  }
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.LITERAL,
    dimension, 
    baseType,
    value
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createStructNode(strandsContext, structTypeInfo, dependsOn) {
  
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
  return id;
}

export function createBinaryOpNode(strandsContext, leftStrandsNode, rightArg, opCode) {
  const { dag, cfg } = strandsContext;
  // Construct a node for right if its just an array or number etc.
  let rightStrandsNode;
  if (rightArg[0] instanceof StrandsNode && rightArg.length === 1) {
    rightStrandsNode = rightArg[0];
  } else {
    const id = createTypeConstructorNode(strandsContext, { baseType: BaseType.DEFER, dimension: null }, rightArg);
    rightStrandsNode = new StrandsNode(id);
  }
  let finalLeftNodeID = leftStrandsNode.id;
  let finalRightNodeID = rightStrandsNode.id;

  // Check if we have to cast either node
  const leftType = DAG.extractNodeTypeInfo(dag, leftStrandsNode.id);
  const rightType = DAG.extractNodeTypeInfo(dag, rightStrandsNode.id);
  const cast = { node: null, toType: leftType };
  const bothDeferred = leftType.baseType === rightType.baseType && leftType.baseType === BaseType.DEFER;
  if (bothDeferred) {
    finalLeftNodeID = createTypeConstructorNode(strandsContext, { baseType:BaseType.FLOAT, dimension: leftType.dimension }, leftStrandsNode);
    finalRightNodeID = createTypeConstructorNode(strandsContext, { baseType:BaseType.FLOAT, dimension: leftType.dimension }, rightStrandsNode);
  }
  else if (leftType.baseType !== rightType.baseType || 
    leftType.dimension !== rightType.dimension) {
    
    if (leftType.dimension === 1 && rightType.dimension > 1) {
      // e.g. op(scalar, vector): cast scalar up
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

    const castedID = createTypeConstructorNode(strandsContext, cast.toType, cast.node);
    if (cast.node === leftStrandsNode) {
      finalLeftNodeID = castedID;
    } else {
      finalRightNodeID = castedID;
    }
  }

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    dependsOn: [finalLeftNodeID, finalRightNodeID],
    dimension,
    baseType: cast.toType.baseType,
    dimension: cast.toType.dimension,
    opCode
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

function mapPrimitiveDependencies(strandsContext, typeInfo, dependsOn) {
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
      const newNode = createLiteralNode(strandsContext, { dimension: 1, baseType }, dep);
      mappedDependencies.push(newNode);
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

function constructTypeFromIDs(strandsContext, strandsNodesArray, typeInfo) {
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

export function createTypeConstructorNode(strandsContext, typeInfo, dependsOn) {
  const { cfg, dag } = strandsContext;
  const { mappedDependencies, inferredTypeInfo } = mapPrimitiveDependencies(strandsContext, typeInfo, dependsOn);
  const finalType = {
    baseType: typeInfo.baseType, 
    dimension: inferredTypeInfo.dimension
  };
  const id = constructTypeFromIDs(strandsContext, mappedDependencies, finalType);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createFunctionCallNode(strandsContext, functionName, rawUserArgs) {
  const { cfg, dag } = strandsContext;
  const overloads = strandsBuiltinFunctions[functionName];

  const preprocessedArgs = rawUserArgs.map((rawUserArg) => mapPrimitiveDependencies(strandsContext, DataType.defer, rawUserArg));
  const matchingArgsCounts = overloads.filter(overload => overload.params.length === preprocessedArgs.length);
  if (matchingArgsCounts.length === 0) {
    const argsLengthSet = new Set();
    const argsLengthArr = [];
    overloads.forEach((overload) => argsLengthSet.add(overload.params.length));
    argsLengthSet.forEach((len) => argsLengthArr.push(`${len}`));
    const argsLengthStr = argsLengthArr.join(', or ');
    FES.userError("parameter validation error",`Function '${functionName}' has ${overloads.length} variants which expect ${argsLengthStr} arguments, but ${preprocessedArgs.length} arguments were provided.`);
  }

  let bestOverload = null;
  let bestScore = 0;
  let inferredReturnType = null;
  for (const overload of matchingArgsCounts) {
    const isGeneric = (T) => T.dimension === null;
    let isValid = true;
    let overloadParameters = [];
    let inferredDimension = null;
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
        if (inferredDimension !== argType.dimension) {
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

      overloadParameters.push({ baseType: expectedType.baseType, dimension });
    }

    if (isValid && (!bestOverload || similarity > bestScore)) {
      bestOverload = overloadParameters;
      bestScore = similarity;
      inferredReturnType = overload.returnType;
      if (isGeneric(inferredReturnType)) {
        inferredReturnType.dimension = inferredDimension;
      }
    }
  }

  if (bestOverload === null) {
    FES.userError('parameter validation', 'No matching overload found!');
  }

  let dependsOn = [];
  for (let i = 0; i < bestOverload.length; i++) {
    const arg = preprocessedArgs[i];
    if (arg.originalNodeID) {
      dependsOn.push(arg.originalNodeID);
    }
    else {
      const paramType = bestOverload[i];
      const castedArgID = constructTypeFromIDs(strandsContext, arg.mappedDependencies, paramType);
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
  return id;
}

export function createUnaryOpNode(strandsContext, strandsNode, opCode) {
  const { dag, cfg } = strandsContext;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode,
    dependsOn: strandsNode.id,
    baseType: dag.baseTypes[strandsNode.id],
    dimension: dag.dimensions[strandsNode.id],
  })
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createStatementNode(strandsContext, type) {
  return -99;
}