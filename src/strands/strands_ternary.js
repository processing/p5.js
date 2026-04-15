import * as DAG from './ir_dag';
import * as CFG from './ir_cfg';
import { NodeType, OpCode, BaseType } from './ir_types';
import { createStrandsNode } from './strands_node';
import * as FES from './strands_FES';

export function buildTernary(strandsContext, condition, ifTrue, ifFalse) {
  const { dag, cfg, p5 } = strandsContext;

  // Ensure all inputs are StrandsNodes
  const condNode = condition?.isStrandsNode ? condition : p5.strandsNode(condition);
  const trueNode = ifTrue?.isStrandsNode ? ifTrue : p5.strandsNode(ifTrue);
  const falseNode = ifFalse?.isStrandsNode ? ifFalse : p5.strandsNode(ifFalse);

  // Get type info for both nodes
  let trueType = DAG.extractNodeTypeInfo(dag, trueNode.id);
  let falseType = DAG.extractNodeTypeInfo(dag, falseNode.id);

  // Propagate type from the known branch to any ASSIGN_ON_USE branch
  if (trueType.baseType === BaseType.ASSIGN_ON_USE && falseType.baseType !== BaseType.ASSIGN_ON_USE) {
    DAG.propagateTypeToAssignOnUse(dag, trueNode.id, falseType.baseType, falseType.dimension);
    trueType = DAG.extractNodeTypeInfo(dag, trueNode.id);
  } else if (falseType.baseType === BaseType.ASSIGN_ON_USE && trueType.baseType !== BaseType.ASSIGN_ON_USE) {
    DAG.propagateTypeToAssignOnUse(dag, falseNode.id, trueType.baseType, trueType.dimension);
    falseType = DAG.extractNodeTypeInfo(dag, falseNode.id);
  }

  // After ASSIGN_ON_USE propagation, if both types are known, they must match
  if (
    trueType.baseType !== BaseType.ASSIGN_ON_USE &&
    falseType.baseType !== BaseType.ASSIGN_ON_USE &&
    (trueType.baseType !== falseType.baseType || trueType.dimension !== falseType.dimension)
  ) {
    FES.userError('type error',
      'The true and false branches of a ternary expression must have the same type. ' +
      `Right now, the true branch is a ${trueType.baseType}${trueType.dimension}, and the false branch is a ${falseType.baseType}${falseType.dimension}.`
    );
  }

  const resultType = trueType;

  const nodeData = DAG.createNodeData({
    nodeType: NodeType.OPERATION,
    opCode: OpCode.Nary.TERNARY,
    dependsOn: [condNode.id, trueNode.id, falseNode.id],
    baseType: resultType.baseType,
    dimension: resultType.dimension,
  });

  const id = DAG.getOrCreateNode(dag, nodeData);
  CFG.recordInBasicBlock(cfg, cfg.currentBlock, id);
  return createStrandsNode(id, resultType.dimension, strandsContext);
}
