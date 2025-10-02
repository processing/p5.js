import * as CFG from './ir_cfg';
import * as DAG from './ir_dag';
import { BlockType } from './ir_types';
import { StrandsNode, createStrandsNode } from './strands_node';

export class StrandsConditional {
  constructor(strandsContext, condition, branchCallback) {
    // Condition must be a node...
    this.branches = [{
      condition,
      branchCallback,
      blockType: BlockType.IF_BODY
    }];
    this.ctx = strandsContext;
  }

  ElseIf(condition, branchCallback) {
    this.branches.push({
      condition,
      branchCallback,
      blockType: BlockType.ELIF_BODY
    });
    return this;
  }

  Else(branchCallback = () => ({})) {
    this.branches.push({
      condition: null,
      branchCallback,
      blockType: BlockType.ELSE_BODY
    });
    const phiNodes = buildConditional(this.ctx, this);
    
    // Convert phi nodes to StrandsNodes for the user
    const assignments = {};
    for (const [varName, phiNode] of Object.entries(phiNodes)) {
      assignments[varName] = createStrandsNode(phiNode.id, phiNode.dimension, this.ctx);
    }
    
    return assignments;
  }
}

function buildConditional(strandsContext, conditional) {
  const cfg = strandsContext.cfg;
  const branches = conditional.branches;

  const mergeBlock = CFG.createBasicBlock(cfg, BlockType.MERGE);
  const results = [];
  const branchBlocks = [];

  let previousBlock = cfg.currentBlock;

  for (let i = 0; i < branches.length; i++) {
    const { condition, branchCallback, blockType } = branches[i];

    if (condition !== null) {
      const conditionBlock = CFG.createBasicBlock(cfg, BlockType.IF_COND);
      CFG.addEdge(cfg, previousBlock, conditionBlock);
      CFG.pushBlock(cfg, conditionBlock);
      cfg.blockConditions[conditionBlock] = condition.id;
      previousBlock = conditionBlock;
      CFG.popBlock(cfg);
    }

    const branchBlock = CFG.createBasicBlock(cfg, blockType);
    CFG.addEdge(cfg, previousBlock, branchBlock);
    branchBlocks.push(branchBlock);

    CFG.pushBlock(cfg, branchBlock);
    const branchResults = branchCallback();
    results.push(branchResults);
    if (cfg.currentBlock !== branchBlock) {
      CFG.addEdge(cfg, cfg.currentBlock, mergeBlock);
      CFG.popBlock();
    }
    CFG.addEdge(cfg, cfg.currentBlock, mergeBlock);
    CFG.popBlock(cfg);
  }

  CFG.pushBlock(cfg, mergeBlock);

  // Create phi nodes for variables that were modified in any branch
  const allVariableNames = new Set();
  results.forEach(branchResult => {
    if (branchResult && typeof branchResult === 'object') {
      Object.keys(branchResult).forEach(varName => allVariableNames.add(varName));
    }
  });

  const mergedAssignments = {};
  for (const varName of allVariableNames) {
    // Collect the node IDs for this variable from each branch
    const phiInputs = [];
    for (let i = 0; i < results.length; i++) {
      const branchResult = results[i];
      const branchBlock = branchBlocks[i];

      if (branchResult && branchResult[varName]) {
        phiInputs.push({
          nodeId: branchResult[varName].id,
          blockId: branchBlock
        });
      } else {
        // If this branch didn't modify the variable, we need the original value
        // For now, we'll handle this case later when we have variable tracking
        // This is a placeholder that will need to be improved
        phiInputs.push({
          nodeId: null, // Will need original variable ID
          blockId: branchBlock
        });
      }
    }

    // Create a phi node for this variable
    const phiNode = createPhiNode(strandsContext, phiInputs, varName);
    mergedAssignments[varName] = phiNode;
  }

  return mergedAssignments;
}

function createPhiNode(strandsContext, phiInputs, varName) {
  // For now, create a simple phi node
  // We'll need to determine the proper dimension and baseType from the inputs
  const validInputs = phiInputs.filter(input => input.nodeId !== null);
  if (validInputs.length === 0) {
    throw new Error(`No valid inputs for phi node for variable ${varName}`);
  }

  // Get dimension and baseType from first valid input
  const firstInput = DAG.getNodeDataFromID(strandsContext.dag, validInputs[0].nodeId);
  const dimension = firstInput.dimension;
  const baseType = firstInput.baseType;

  const nodeData = {
    nodeType: 'phi',
    dimension,
    baseType,
    dependsOn: phiInputs.map(input => input.nodeId).filter(id => id !== null),
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
