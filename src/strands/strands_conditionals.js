import * as CFG from './control_flow_graph'
import { BlockType } from './utils';

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
    return buildConditional(this.ctx, this);
  }
}

function buildConditional(strandsContext, conditional) {
  const cfg = strandsContext.cfg;
  const branches  = conditional.branches;

  const mergeBlock = CFG.createBasicBlock(cfg, BlockType.MERGE);
  const results = [];

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
  
  return results;
}