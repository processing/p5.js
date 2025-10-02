import * as CFG from './ir_cfg';
import * as DAG from './ir_dag';
import { BlockType, NodeType } from './ir_types';
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
  const mergedAssignments = {};
  const phiBlockDependencies = {};

  // Create a BRANCH block to handle phi node declarations
  const branchBlock = CFG.createBasicBlock(cfg, BlockType.BRANCH);
  CFG.addEdge(cfg, cfg.currentBlock, branchBlock);
  CFG.addEdge(cfg, branchBlock, mergeBlock);

  let previousBlock = branchBlock;

  for (let i = 0; i < branches.length; i++) {
    const { condition, branchCallback, blockType } = branches[i];

    if (condition !== null) {
      const conditionBlock = CFG.createBasicBlock(cfg, BlockType.IF_COND);
      CFG.addEdge(cfg, previousBlock, conditionBlock);
      CFG.pushBlock(cfg, conditionBlock);
      cfg.blockConditions[conditionBlock] = condition.id;
      previousBlock = conditionBlock;
      CFG.popBlock(cfg);
    } else {
      // This is an else branch - create an ELSE_COND block
      const elseCondBlock = CFG.createBasicBlock(cfg, BlockType.ELSE_COND);
      CFG.addEdge(cfg, previousBlock, elseCondBlock);
      previousBlock = elseCondBlock;
    }

    // Create SCOPE_START block to mark beginning of branch scope
    const scopeStartBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_START);
    CFG.addEdge(cfg, previousBlock, scopeStartBlock);

    const branchBlock = CFG.createBasicBlock(cfg, blockType);
    CFG.addEdge(cfg, scopeStartBlock, branchBlock);
    branchBlocks.push(branchBlock);

    CFG.pushBlock(cfg, branchBlock);
    const branchResults = branchCallback();
    for (const key in branchResults) {
      if (!phiBlockDependencies[key]) {
        phiBlockDependencies[key] = [{ value: branchResults[key], blockId: branchBlock }];
      } else {
        phiBlockDependencies[key].push({ value: branchResults[key], blockId: branchBlock });
      }
    }
    results.push(branchResults);
    
    // Create SCOPE_END block to mark end of branch scope
    const scopeEndBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_END);
    if (cfg.currentBlock !== branchBlock) {
      CFG.addEdge(cfg, cfg.currentBlock, scopeEndBlock);
      CFG.popBlock(cfg);
    } else {
      CFG.addEdge(cfg, branchBlock, scopeEndBlock);
      CFG.popBlock(cfg);
    }
    
    CFG.addEdge(cfg, scopeEndBlock, mergeBlock);
    previousBlock = scopeStartBlock; // Next condition should branch from the same point
  }

  // Push the branch block for modification to attach phi nodes there
  CFG.pushBlockForModification(cfg, branchBlock);

  for (const key in phiBlockDependencies) {
    mergedAssignments[key] = createPhiNode(strandsContext, phiBlockDependencies[key], key);
  }

  CFG.popBlock(cfg);

  // Now add phi assignments to each branch block
  for (let i = 0; i < results.length; i++) {
    const branchResult = results[i];
    const branchBlockID = branchBlocks[i];

    CFG.pushBlockForModification(cfg, branchBlockID);

    for (const key in branchResult) {
      if (mergedAssignments[key]) {
        // Create an assignment statement: phiNode = branchResult[key]
        const phiNodeID = mergedAssignments[key].id;
        const sourceNodeID = branchResult[key].id;

        // Create an assignment operation node
        // Use dependsOn[0] for phiNodeID and dependsOn[1] for sourceNodeID
        // This represents: dependsOn[0] = dependsOn[1] (phiNode = sourceNode)
        const assignmentNode = {
          nodeType: NodeType.ASSIGNMENT,
          dependsOn: [phiNodeID, sourceNodeID],
          phiBlocks: []
        };

        const assignmentID = DAG.getOrCreateNode(strandsContext.dag, assignmentNode);
        CFG.recordInBasicBlock(cfg, branchBlockID, assignmentID);
      }
    }

    CFG.popBlock(cfg);
  }

  CFG.pushBlock(cfg, mergeBlock);

  return mergedAssignments;
}

function createPhiNode(strandsContext, phiInputs, varName) {
  console.log('createPhiNode called with varName:', varName, 'phiInputs:', phiInputs);

  // For now, create a simple phi node
  // We'll need to determine the proper dimension and baseType from the inputs
  const validInputs = phiInputs.filter(input => input.value.id !== null);
  if (validInputs.length === 0) {
    throw new Error(`No valid inputs for phi node for variable ${varName}`);
  }

  // Get dimension and baseType from first valid input
  const firstInput = DAG.getNodeDataFromID(strandsContext.dag, validInputs[0].value.id);
  const dimension = firstInput.dimension;
  const baseType = firstInput.baseType;

  const nodeData = {
    nodeType: 'phi',
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
