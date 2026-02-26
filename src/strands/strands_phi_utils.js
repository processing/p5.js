import * as CFG from './ir_cfg';
import * as DAG from './ir_dag';
import { NodeType, BaseType } from './ir_types';

export function createPhiNode(strandsContext, phiInputs, varName) {
  // Determine the proper dimension and baseType from the inputs
  const validInputs = phiInputs.filter(input => input.value.id !== null);
  if (validInputs.length === 0) {
    throw new Error(`No valid inputs for phi node for variable ${varName}`);
  }

  // Get dimension and baseType from first valid input, skipping ASSIGN_ON_USE nodes
  const inputNodes = validInputs.map((input) => DAG.getNodeDataFromID(strandsContext.dag, input.value.id));
  let firstInput = inputNodes.find((input) => input.baseType !== BaseType.ASSIGN_ON_USE && input.dimension) ??
    inputNodes.find((input) => input.baseType !== BaseType.ASSIGN_ON_USE) ??
    inputNodes[0];

  const dimension = firstInput.dimension;
  const baseType = firstInput.baseType;

  const nodeData = {
    nodeType: NodeType.PHI,
    dimension,
    baseType,
    dependsOn: phiInputs.map(input => input.value.id).filter(id => id !== null),
    phiBlocks: phiInputs.map(input => input.blockId),
    phiInputs // Store the full phi input information
  };
  const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
  CFG.recordInBasicBlock(strandsContext.cfg, strandsContext.cfg.currentBlock, id);
  return {
    id,
    dimension,
    baseType
  };
}
