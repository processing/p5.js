import * as CFG from './ir_cfg';
import * as DAG from './ir_dag';
import { BlockType, NodeType } from './ir_types';
import { StrandsNode, createStrandsNode } from './strands_node';
import { createPhiNode } from './strands_phi_utils';
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
      blockType: BlockType.IF_BODY
    });
    return this;
  }
  Else(branchCallback = () => ({})) {
    this.branches.push({
      condition: null,
      branchCallback,
      blockType: BlockType.IF_BODY
    });
    const phiNodes = buildConditional(this.ctx, this);
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
  const branchEndBlocks = [];
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
      const elseCondBlock = CFG.createBasicBlock(cfg, BlockType.ELSE_COND);
      CFG.addEdge(cfg, previousBlock, elseCondBlock);
      previousBlock = elseCondBlock;
    }
    const scopeStartBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_START);
    CFG.addEdge(cfg, previousBlock, scopeStartBlock);
    const branchContentBlock = CFG.createBasicBlock(cfg, blockType);
    CFG.addEdge(cfg, scopeStartBlock, branchContentBlock);
    branchBlocks.push(branchContentBlock);
    CFG.pushBlock(cfg, branchContentBlock);
    const branchResults = branchCallback();
    for (const key in branchResults) {
      if (!phiBlockDependencies[key]) {
        phiBlockDependencies[key] = [{ value: branchResults[key], blockId: branchContentBlock }];
      } else {
        phiBlockDependencies[key].push({ value: branchResults[key], blockId: branchContentBlock });
      }
    }
    results.push(branchResults);

    // Create BRANCH_END block for phi assignments
    const branchEndBlock = CFG.createBasicBlock(cfg, BlockType.DEFAULT);
    CFG.addEdge(cfg, cfg.currentBlock, branchEndBlock);
    branchEndBlocks.push(branchEndBlock);
    CFG.popBlock(cfg);

    const scopeEndBlock = CFG.createBasicBlock(cfg, BlockType.SCOPE_END);
    CFG.addEdge(cfg, branchEndBlock, scopeEndBlock);
    CFG.addEdge(cfg, scopeEndBlock, mergeBlock);
    previousBlock = scopeStartBlock;
  }
  // Push the branch block for modification to avoid changing the ordering
  CFG.pushBlockForModification(cfg, branchBlock);
  for (const key in phiBlockDependencies) {
    mergedAssignments[key] = createPhiNode(strandsContext, phiBlockDependencies[key], key);
  }
  CFG.popBlock(cfg);
  for (let i = 0; i < results.length; i++) {
    const branchResult = results[i];
    const branchEndBlockID = branchEndBlocks[i];
    CFG.pushBlockForModification(cfg, branchEndBlockID);
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
        CFG.recordInBasicBlock(cfg, branchEndBlockID, assignmentID);
      }
    }
    CFG.popBlock(cfg);
  }
  CFG.pushBlock(cfg, mergeBlock);
  return mergedAssignments;
}
