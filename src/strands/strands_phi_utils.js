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

  // Find first non-ASSIGN_ON_USE input to determine type
  let typeSource = inputNodes.find((input) => input.baseType !== BaseType.ASSIGN_ON_USE && input.dimension) ??
    inputNodes.find((input) => input.baseType !== BaseType.ASSIGN_ON_USE);

  // If all are ASSIGN_ON_USE, fall back to first input
  if (!typeSource) {
    typeSource = inputNodes[0];
  }

  const dimension = typeSource.dimension;
  const baseType = typeSource.baseType;

  // Propagate the type to all ASSIGN_ON_USE inputs
  if (baseType !== BaseType.ASSIGN_ON_USE) {
    for (const input of inputNodes) {
      if (input.baseType === BaseType.ASSIGN_ON_USE) {
        DAG.propagateTypeToAssignOnUse(strandsContext.dag, input.id, baseType, dimension);
      }
    }
  }

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
