/**
* @module 3D
* @submodule strands
* @for p5
* @requires core
*/

import { transpileStrandsToJS } from './code_transpiler';
import { DataType, NodeType, SymbolToOpCode, OperatorTable, BlockType } from './utils';

import * as DAG from './DAG';
import * as CFG from './CFG'
import { generateGLSL } from './GLSL_generator';

function strands(p5, fn) {
  //////////////////////////////////////////////
  // Global Runtime
  //////////////////////////////////////////////
  function initStrands(ctx) {
    ctx.cfg = CFG.createControlFlowGraph();
    ctx.dag = DAG.createDirectedAcyclicGraph();
    ctx.blockStack = [];
    ctx.currentBlock = -1;
    ctx.blockConditions = {};
    ctx.uniforms = [];
    ctx.hooks = [];
  }
  
  function deinitStrands(ctx) {
    Object.keys(ctx).forEach(prop => {
      delete ctx[prop];
    });
  }
  
  // Stubs
  function overrideGlobalFunctions() {}
  function restoreGlobalFunctions() {}
  function overrideFES() {}
  function restoreFES() {}
  
  //////////////////////////////////////////////
  // User nodes 
  //////////////////////////////////////////////
  class StrandsNode {
    constructor(id) {
      this.id = id;
    }
  }
  
  // We augment the strands node with operations programatically 
  // this means methods like .add, .sub, etc can be chained
  for (const { name, symbol, arity } of OperatorTable) {
    if (arity === 'binary') {
      StrandsNode.prototype[name] = function (rightNode) {
        const id = createBinaryOpNode(this.id, rightNode.id, SymbolToOpCode[symbol]);
        return new StrandsNode(id);
      };
    }
    // if (arity === 'unary') {
    //   StrandsNode.prototype[name] = function () {
    //     const id = createUnaryExpressionNode(this, SymbolToOpCode[symbol]);
    //     return new StrandsNode(id);
    //   };
    // }
  }
  
  function createLiteralNode(dataType, value) {
    const nodeData = DAG.createNodeData({
      nodeType: NodeType.LITERAL,
      dataType,
      value
    });
    const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
    const b = strandsContext.currentBlock;
    CFG.recordInBasicBlock(strandsContext.cfg, strandsContext.currentBlock, id);
    return id;
  }

  function createBinaryOpNode(left, right, opCode) {
    const nodeData = DAG.createNodeData({
      nodeType: NodeType.OPERATION,
      dependsOn: [left, right],
      opCode
    });
    const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
    CFG.recordInBasicBlock(strandsContext.cfg, strandsContext.currentBlock, id);
    return id;
  }

  function createVariableNode(dataType, identifier) {
    const nodeData = DAG.createNodeData({
      nodeType: NodeType.VARIABLE,
      dataType, 
      identifier
    })
    const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
    CFG.recordInBasicBlock(strandsContext.cfg, strandsContext.currentBlock, id);
    return id;
  }
  
  function pushBlockWithEdgeFromCurrent(blockID) {
    CFG.addEdge(strandsContext.cfg, strandsContext.currentBlock, blockID);
    pushBlock(blockID);
  }

  function pushBlock(blockID) {
    strandsContext.blockStack.push(blockID);
    strandsContext.currentBlock = blockID;
  }
  
  function popBlock() {
    strandsContext.blockStack.pop();
    const len = strandsContext.blockStack.length;
    strandsContext.currentBlock = strandsContext.blockStack[len-1];
  }
  
  fn.uniformFloat = function(name, defaultValue) {
    const id = createVariableNode(DataType.FLOAT, name);
    strandsContext.uniforms.push({ name, dataType: DataType.FLOAT, defaultValue });
    return new StrandsNode(id);
  } 
  
  fn.createFloat = function(value) {
    const id = createLiteralNode(DataType.FLOAT, value);
    return new StrandsNode(id);
  }

  class StrandsConditional {
    constructor(condition, branchCallback) {
      // Condition must be a node...
      this.branches = [{
        condition,
        branchCallback,
        blockType: BlockType.IF_BODY
      }];
    }
    
    ElseIf(condition, branchCallback) {
      this.branches.push({ 
        condition,
        branchCallback,
        blockType: BlockType.EL_IF_BODY 
      });
      return this;
    }
    
    Else(branchCallback = () => ({})) {
      this.branches.push({ 
        condition: null, 
        branchCallback, 
        blockType: BlockType.ELSE_BODY 
      });
      return buildConditional(this);
    }
  }
  
  function buildConditional(conditional) {
    const { blockConditions, cfg } = strandsContext;
    const branches  = conditional.branches;
    const mergeBlock = CFG.createBasicBlock(cfg, BlockType.MERGE);
    const allResults = [];
    // First conditional connects from outer block, everything else
    // connects to previous condition (when false)
    let prevCondition = strandsContext.currentBlock
    
    for (let i = 0; i < branches.length; i++) {
      console.log(branches[i]);
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

    return allResults;
  }

    
  fn.strandsIf = function(conditionNode, ifBody) {
    return new StrandsConditional(conditionNode, ifBody);
  }
  // fn.strandsIf = function(conditionNode, ifBody, elseBody) {
  //   const { cfg } = strandsContext;

  //   console.log('Before if:', strandsContext.blockStack)
  //   strandsContext.blockStack.forEach(block => {
  //     CFG.printBlockData(cfg, block)
  //   })

  //   const mergeBlock = CFG.createBasicBlock(cfg, BlockType.MERGE);
    
  //   const conditionBlock = CFG.createBasicBlock(cfg, BlockType.CONDITION);
  //   pushBlockWithEdgeFromCurrent(conditionBlock);
  //   strandsContext.blockConditions[conditionBlock] = conditionNode.id;
    
  //   const ifBodyBlock = CFG.createBasicBlock(cfg, BlockType.IF_BODY);
  //   pushBlockWithEdgeFromCurrent(ifBodyBlock);
  //   ifBody();
  //   if (strandsContext.currentBlock !== ifBodyBlock) {
  //     CFG.addEdge(cfg, strandsContext.currentBlock, mergeBlock);
  //     popBlock();
  //   }
  //   popBlock();
    
  //   const elseBodyBlock = CFG.createBasicBlock(cfg, BlockType.ELSE_BODY);
  //   pushBlock(elseBodyBlock);
  //   CFG.addEdge(cfg, conditionBlock, elseBodyBlock);
  //   if (elseBody) { 
  //     elseBody();
  //     if (strandsContext.currentBlock !== ifBodyBlock) {
  //       CFG.addEdge(cfg, strandsContext.currentBlock, mergeBlock);
  //       popBlock();
  //     }
  //   }
  //   popBlock();
  //   popBlock();

  //   pushBlock(mergeBlock);
  //   console.log('After if:', strandsContext.blockStack)
  //   strandsContext.blockStack.forEach(block => {
  //     CFG.printBlockData(cfg, block)
  //   })
  //   CFG.addEdge(cfg, elseBodyBlock, mergeBlock);
  //   CFG.addEdge(cfg, ifBodyBlock, mergeBlock);
  // }
  
  function createHookArguments(parameters){
    const structTypes = ['Vertex', ]
    const args = [];

    for (const param of parameters) {
      const T = param.type;
      if(structTypes.includes(T.typeName)) {
        const propertiesNodes = T.properties.map(
          (prop) => [prop.name, createVariableNode(DataType[prop.dataType], prop.name)]
        );
        const argObj = Object.fromEntries(propertiesNodes);
        args.push(argObj);
      } else {
        const arg = createVariableNode(DataType[param.dataType], param.name);
        args.push(arg)
      }
    }
    return args;
  }
  
  function generateHookOverrides(shader) {
    const availableHooks = {
      ...shader.hooks.vertex,
      ...shader.hooks.fragment,
    }
    const hookTypes = Object.keys(availableHooks).map(name => shader.hookTypes(name));
    for (const hookType of hookTypes) {
      window[hookType.name] = function(callback) {
        const entryBlockID = CFG.createBasicBlock(strandsContext.cfg, BlockType.FUNCTION);
        pushBlockWithEdgeFromCurrent(entryBlockID);
        const args = createHookArguments(hookType.parameters);
        const rootNodeID = callback(args).id;
        strandsContext.hooks.push({
          hookType, 
          entryBlockID,
          rootNodeID,
        });
        popBlock();
      }
    }
  }

  //////////////////////////////////////////////
  // Entry Point
  //////////////////////////////////////////////
  const strandsContext = {};
  const oldModify = p5.Shader.prototype.modify

  p5.Shader.prototype.newModify = function(shaderModifier, options = { parser: true, srcLocations: false }) {
    if (shaderModifier instanceof Function) {
      // Reset the context object every time modify is called;
      initStrands(strandsContext)
      generateHookOverrides(this);
      // 1. Transpile from strands DSL to JS
      let strandsCallback;
      if (options.parser) {
        strandsCallback = transpileStrandsToJS(shaderModifier.toString(), options.srcLocations);
      } else {
        strandsCallback = shaderModifier;
      }
      
      // 2. Build the IR from JavaScript API
      const globalScope = CFG.createBasicBlock(strandsContext.cfg, BlockType.GLOBAL);
      pushBlock(globalScope);
      strandsCallback();
      popBlock();
      
      // 3. Generate shader code hooks object from the IR
      // .......
      const glsl = generateGLSL(strandsContext);
      console.log(glsl.getFinalColor);
      
      // Call modify with the generated hooks object
      // return oldModify.call(this, generatedModifyArgument);
      
      // Reset the strands runtime context
      // deinitStrands(strandsContext);
    }
    else {
      return oldModify.call(this, shaderModifier)
    }
  }
}

export default strands;

if (typeof p5 !== 'undefined') {
  p5.registerAddon(strands)
}
