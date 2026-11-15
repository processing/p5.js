import * as CFG from './ir_cfg';
import * as DAG from './ir_dag';
import { BlockType, NodeType } from './ir_types';
import { createStrandsNode } from './strands_node';
import { createPhiNode } from './strands_phi_utils';
import * as FES from './strands_FES';
export class StrandsConditional {
  constructor(strandsContext, condition, branchCallback) {
    // Condition must be a node...
    this.branches = [
      {
        condition,
        branchCallback,
        blockType: BlockType.IF_BODY
      }
    ];
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
      assignments[varName] = createStrandsNode(
        phiNode.id,
        phiNode.dimension,
        this.ctx
      );
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
  // Keep helper slots separate from the branch's returned assignments.
  const stateScope = strandsContext.stateScope;
  const stackDepth = stateScope?.stack.length ?? 0;
  const stateEntryIds = new Map();
  const stateInputs = new Map();
  for (const record of stateScope?.records ?? []) {
    for (const slot of record.slots) {
      stateEntryIds.set(slot, slot.valueId);
      stateInputs.set(slot, []);
    }
  }
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
    // Every branch starts from the entry state, and can only pop what it pushed.
    for (const [slot, entryId] of stateEntryIds) {
      slot.valueId = entryId;
    }
    const previousDepth = strandsContext.conditionalDepth;
    const previousFloor = stateScope?.stackFloor;
    strandsContext.conditionalDepth = previousDepth + 1;
    if (stateScope) {
      stateScope.stackFloor = stackDepth;
    }
    let branchResults;
    try {
      branchResults = branchCallback() ?? {};
    } finally {
      strandsContext.conditionalDepth = previousDepth;
      if (stateScope) {
        stateScope.stackFloor = previousFloor;
      }
    }
    if (stateScope && stateScope.stack.length !== stackDepth) {
      FES.userError(
        'scope error',
        'push() and pop() must be balanced inside each if/else branch.'
      );
    }
    for (const [slot, inputs] of stateInputs) {
      inputs.push({
        value: createStrandsNode(slot.valueId, slot.dimension, strandsContext),
        blockId: branchContentBlock
      });
    }
    for (const key in branchResults) {
      branchResults[key] = strandsContext.p5.strandsNode(branchResults[key]);
    }
    for (const key in branchResults) {
      if (!phiBlockDependencies[key]) {
        phiBlockDependencies[key] = [
          { value: branchResults[key], blockId: branchContentBlock }
        ];
      } else {
        phiBlockDependencies[key].push({
          value: branchResults[key],
          blockId: branchContentBlock
        });
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
    mergedAssignments[key] = createPhiNode(
      strandsContext,
      phiBlockDependencies[key],
      key
    );
  }
  // Helper phis only for field slots that some branch changed.
  const statePhis = new Map();
  for (const [slot, inputs] of stateInputs) {
    const entryId = stateEntryIds.get(slot);
    if (inputs.some(input => input.value.id !== entryId)) {
      statePhis.set(slot, createPhiNode(strandsContext, inputs, slot.name));
    }
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
        const assignmentID = DAG.getOrCreateNode(
          strandsContext.dag,
          assignmentNode
        );
        CFG.recordInBasicBlock(cfg, branchEndBlockID, assignmentID);
      }
    }
    for (const [slot, phi] of statePhis) {
      const assignmentID = DAG.getOrCreateNode(strandsContext.dag, {
        nodeType: NodeType.ASSIGNMENT,
        dependsOn: [phi.id, stateInputs.get(slot)[i].value.id],
        phiBlocks: []
      });
      CFG.recordInBasicBlock(cfg, branchEndBlockID, assignmentID);
    }
    CFG.popBlock(cfg);
  }
  CFG.pushBlock(cfg, mergeBlock);
  for (const [slot, entryId] of stateEntryIds) {
    slot.valueId = statePhis.get(slot)?.id ?? entryId;
  }
  return mergedAssignments;
}
