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

function strands(p5, fn) {
  //////////////////////////////////////////////
  // Global Runtime
  //////////////////////////////////////////////
  function initStrands(ctx) {
    ctx.cfg = CFG.createControlFlowGraph();
    ctx.dag = DAG.createDirectedAcyclicGraph();
    ctx.blockStack = [];
    ctx.currentBlock = null;
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
        const id = emitBinaryOp(this.id, rightNode, SymbolToOpCode[symbol]);
        return new StrandsNode(id);
      };
    }
    if (arity === 'unary') {
      StrandsNode.prototype[name] = function () {
        const id = NaN; //createUnaryExpressionNode(this, SymbolToOpCode[symbol]);
        return new StrandsNode(id);
      };
    }
  }
  
  //////////////////////////////////////////////
  // Entry Point
  //////////////////////////////////////////////
  const strandsContext = {};
  initStrands(strandsContext);
  
  function recordInBlock(blockID, nodeID) {
    const graph = strandsContext.cfg
    if (graph.blockInstructionsCount[blockID] === undefined) {
      graph.blockInstructionsStart[blockID] = graph.blockInstructionsList.length;
      graph.blockInstructionsCount[blockID] = 0;
    }
    graph.blockInstructionsList.push(nodeID);
    graph.blockInstructionsCount[blockID] += 1;
  }
  
  function emitLiteralNode(dataType, value) {
    const nodeData = DAG.createNodeData({
      nodeType: NodeType.LITERAL,
      dataType,
      value
    });
    const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
    const b = strandsContext.currentBlock;
    recordInBlock(strandsContext.currentBlock, id);
    return id;
  }

  function emitBinaryOp(left, right, opCode) {
    const nodeData = DAG.createNodeData({
      nodeType: NodeType.OPERATION,
      dependsOn: [left, right],
      opCode
    });
    const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
    recordInBlock(strandsContext.currentBlock, id);
    return id;
  }

  function emitVariableNode(dataType, identifier) {
    const nodeData = DAG.createNodeData({
      nodeType: NodeType.VARIABLE,
      dataType, 
      identifier
    })
    const id = DAG.getOrCreateNode(strandsContext.dag, nodeData);
    recordInBlock(strandsContext.currentBlock, id);
    return id;
  }
  
  function enterBlock(blockID) {
    if (strandsContext.currentBlock) {
      CFG.addEdge(strandsContext.cfg, strandsContext.currentBlock, blockID);
    }
    strandsContext.currentBlock = blockID;
    strandsContext.blockStack.push(blockID);
  }
  
  function exitBlock() {
    strandsContext.blockStack.pop();
    strandsContext.currentBlock = strandsContext.blockStack[strandsContext.blockStack-1];
  }
  
  fn.uniformFloat = function(name, defaultValue) {
    const id = emitVariableNode(DataType.FLOAT, name);
    strandsContext.uniforms.push({ name, dataType: DataType.FLOAT, defaultValue });
    return new StrandsNode(id);
  } 
  
  fn.createFloat = function(value) {
    const id = emitLiteralNode(DataType.FLOAT, value);
    return new StrandsNode(id);
  }
  
  fn.strandsIf = function(condition, ifBody, elseBody) {
    const conditionBlock = CFG.createBasicBlock(strandsContext.cfg, BlockType.IF_COND);
    enterBlock(conditionBlock);
    
    const trueBlock = CFG.createBasicBlock(strandsContext.cfg, BlockType.IF);
    enterBlock(trueBlock);
    ifBody();
    exitBlock();
    
    const mergeBlock = CFG.createBasicBlock(strandsContext.cfg, BlockType.MERGE);
    enterBlock(mergeBlock);
  }
  
  function createHookArguments(parameters){
    const structTypes = ['Vertex', ]
    const args = [];

    for (const param of parameters) {
      const T = param.type;
      if(structTypes.includes(T.typeName)) {
        const propertiesNodes = T.properties.map(
          (prop) => [prop.name, emitVariableNode(DataType[prop.dataType], prop.name)]
        );
        const argObj = Object.fromEntries(propertiesNodes);
        args.push(argObj);
      } else {
        const arg = emitVariableNode(DataType[param.dataType], param.name);
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
        const funcBlock = CFG.createBasicBlock(strandsContext.cfg, BlockType.FUNCTION);
        enterBlock(funcBlock);
        const args = createHookArguments(hookType.parameters);
        console.log(hookType, args);
        runHook(hookType, callback, args);
        exitBlock();
      }
    }
  }
  
  function runHook(hookType, callback, inputs) {
    const blockID = CFG.createBasicBlock(strandsContext.cfg, BlockType.FUNCTION)
    
    enterBlock(blockID);
    const rootNode = callback(inputs);
    exitBlock();
    
    strandsContext.hooks.push({
      hookType, 
      blockID,
      rootNode,
    });
  }

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
      enterBlock(globalScope);
      strandsCallback();
      exitBlock();
      
      // 3. Generate shader code hooks object from the IR
      // .......
      for (const {hookType, blockID, rootNode} of strandsContext.hooks) {
        // console.log(hookType);
      }
      
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
