import * as DAG from './directed_acyclic_graph'
import * as CFG from './control_flow_graph'
import * as FES from './strands_FES'
import { NodeType, OpCode, BaseType } from './utils';
import { StrandsNode } from './strands_api';

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
  const leftType = extractTypeInfo(strandsContext, leftStrandsNode.id);
  const rightType = extractTypeInfo(strandsContext, rightStrandsNode.id);
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

function mapConstructorDependencies(strandsContext, typeInfo, dependsOn) {
  const mappedDependencies = [];
  let { dimension, baseType } = typeInfo;

  const dag = strandsContext.dag;
  let calculatedDimensions = 0;

  for (const dep of dependsOn.flat()) {
    if (dep instanceof StrandsNode) {
      const node = DAG.getNodeDataFromID(dag, dep.id);

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
    if (typeof dep === 'number') {
      const newNode = createLiteralNode(strandsContext, { dimension: 1, baseType }, dep);
      mappedDependencies.push(newNode);
      calculatedDimensions += 1;
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

  return { mappedDependencies, dimension };
}

export function createTypeConstructorNode(strandsContext, typeInfo, dependsOn) {
  const { cfg, dag } = strandsContext;
  dependsOn = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
  const { mappedDependencies, dimension } = mapConstructorDependencies(strandsContext, typeInfo, dependsOn);
  
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.CONSTRUCTOR,
    dimension,
    baseType: typeInfo.baseType,
    dependsOn: mappedDependencies
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createFunctionCallNode(strandsContext, identifier, overrides, dependsOn) {
  const { cfg, dag } = strandsContext;
  let typeInfo = { baseType: null, dimension: null };

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.FUNCTION_CALL,
    identifier,
    overrides, 
    dependsOn,
    // no type info yet
    ...typeInfo,
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