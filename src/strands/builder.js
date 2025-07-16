import * as DAG from './directed_acyclic_graph'
import * as CFG from './control_flow_graph'
import * as FES from './strands_FES'
import { DataType, DataTypeInfo, NodeType, OpCode, DataTypeName} from './utils';
import { StrandsNode } from './user_API';

//////////////////////////////////////////////
// Builders for node graphs
//////////////////////////////////////////////
export function createLiteralNode(strandsContext, typeInfo, value) {
  const { cfg, dag } = strandsContext
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.LITERAL,
    dataType,
    value
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createVariableNode(strandsContext, typeInfo, identifier) {
  const { cfg, dag } = strandsContext;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.VARIABLE,
    dataType, 
    identifier
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createBinaryOpNode(strandsContext, leftNode, rightArg, opCode) {
  const { dag, cfg } = strandsContext;
  
  let inferRightType, rightNodeID, rightNode;
  if (rightArg instanceof StrandsNode) {
    rightNode = rightArg;
    rightNodeID = rightArg.id;
    inferRightType = dag.dataTypes[rightNodeID];
  } else {
    const rightDependsOn = Array.isArray(rightArg) ? rightArg : [rightArg];
    inferRightType = DataType.DEFER;
    rightNodeID = createTypeConstructorNode(strandsContext, inferRightType, rightDependsOn);
    rightNode = new StrandsNode(rightNodeID);
  }
  const origRightType = inferRightType;
  const leftNodeID = leftNode.id;
  const origLeftType = dag.dataTypes[leftNodeID];

  
  const cast = { node: null, toType: origLeftType };
  // Check if we have to cast either node
  if (origLeftType !== origRightType) {
    const L = DataTypeInfo[origLeftType];
    const R = DataTypeInfo[origRightType];
    
    if (L.base === DataType.DEFER) {
      L.dimension = dag.dependsOn[leftNodeID].length;
    }
    if (R.base === DataType.DEFER) {
      R.dimension = dag.dependsOn[rightNodeID].length;
    }
    
    if (L.dimension === 1 && R.dimension > 1) {
      // e.g. op(scalar, vector): cast scalar up
      cast.node = leftNode;
      cast.toType = origRightType;
    }
    else if (R.dimension === 1 && L.dimension > 1) {
      cast.node = rightNode;
      cast.toType = origLeftType;
    }
    else if (L.priority > R.priority && L.dimension === R.dimension) {
      // e.g. op(float vector, int vector): cast priority is float > int > bool
      cast.node = rightNode;
      cast.toType = origLeftType;
    }
    else if (R.priority > L.priority && L.dimension === R.dimension) {
      cast.node = leftNode;
      cast.toType = origRightType;
    }
    else {
      FES.userError('type error', `A vector of length ${L.dimension} operated with a vector of length ${R.dimension} is not allowed.`);
    }
    const castedID = createTypeConstructorNode(strandsContext, cast.toType, cast.node);
    if (cast.node === leftNode) {
      leftNodeID = castedID;
    } else {
      rightNodeID = castedID;
    }
  }
  
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    dependsOn: [leftNodeID, rightNodeID],
    dataType: cast.toType,
    opCode
  });
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

function mapConstructorDependencies(strandsContext, typeInfo, dependsOn) {
  const mapped = [];
  const T = DataTypeInfo[dataType];
  const dag = strandsContext.dag;
  let calculatedDimensions = 0;

  for (const dep of dependsOn.flat()) {
    if (dep instanceof StrandsNode) {
      const node = DAG.getNodeDataFromID(dag, dep.id);

      if (node.opCode === OpCode.Nary.CONSTRUCTOR && dataType === dataType) {
        for (const inner of node.dependsOn) {
          mapped.push(inner);
        }
      }
      const depDataType = dag.dataTypes[dep.id];
      calculatedDimensions += DataTypeInfo[depDataType].dimension;
      continue;
    }
    if (typeof dep === 'number') {
      const newNode = createLiteralNode(strandsContext, T.base, dep);
      calculatedDimensions += 1;
      mapped.push(newNode);
      continue;
    }
    else {
      FES.userError('type error', `You've tried to construct a scalar or vector type with a non-numeric value: ${dep}`);
    }
  }

  if(calculatedDimensions !== 1 && calculatedDimensions !== T.dimension) {
    FES.userError('type error', `You've tried to construct a ${DataTypeName[dataType]} with ${calculatedDimensions} components`);
  }
  return mapped;
}

export function createTypeConstructorNode(strandsContext, typeInfo, dependsOn) {
  const { cfg, dag } = strandsContext;
  dependsOn = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
  const mappedDependencies = mapConstructorDependencies(strandsContext, dataType, dependsOn);
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.CONSTRUCTOR,
    dataType,
    dependsOn: mappedDependencies
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createFunctionCallNode(strandsContext, identifier, overrides, dependsOn) {
  const { cfg, dag } = strandsContext;
  let dataType = dataType.DEFER;
  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.FUNCTION_CALL,
    identifier,
    overrides, 
    dependsOn,
    dataType
  })
  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return id;
}

export function createStatementNode(strandsContext, type) {
  return -99;
}