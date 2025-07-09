import * as CFG from './CFG'
import { BlockType } from './utils';

export class StrandsConditional {
  constructor(condition, branchCallback) {
    // Condition must be a node...
    this.branches = [{
      condition,
      branchCallback,
      blockType: BlockType.IF_BODY
    }];
  }
  
  ElseIf(condition, branchCallback) {
    this.branches.push({ condition, branchCallback, blockType: BlockType.EL_IF_BODY });
    return this;
  }
  
  Else(branchCallback = () => ({})) {
    this.branches.push({ condition, branchCallback: null, blockType: BlockType.ELSE_BODY });
    return buildConditional(this);
  }
}

function buildConditional(conditional) {
  const { blockConditions, cfg } = strandsContext;
  const branches  = conditional.branches;
  const mergeBlock = CFG.createBasicBlock(cfg, BlockType.MERGE);

  // First conditional connects from outer block, everything else
  // connects to previous condition (when false)
  let prevCondition = strandsContext.currentBlock
  
  for (let i = 0; i < branches.length; i++) {
    const { condition, branchCallback, blockType } = branches[i];
    const isElseBlock = (i === branches.length - 1);

    if (!isElseBlock) {
      const conditionBlock = CFG.createBasicBlock(cfg, BlockType.CONDITION);
      CFG.addEdge(cfg, prevCondition, conditionBlock);
      pushBlock(conditionBlock);
      blockConditions[conditionBlock] = condition.id;
      prevCondition = conditionBlock;
      popBlock();
    }

    const branchBlock = CFG.createBasicBlock(cfg, blockType);
    CFG.addEdge(cfg, prevCondition, branchBlock);
    
    pushBlock(branchBlock);
    const branchResults = branchCallback();
    allResults.push(branchResults);
    if (strandsContext.currentBlock !== branchBlock) {
      CFG.addEdge(cfg, strandsContext.currentBlock, mergeBlock);
      popBlock();
    }
    CFG.addEdge(cfg, strandsContext.currentBlock, mergeBlock);
    popBlock();
  }
  pushBlock(mergeBlock);
}