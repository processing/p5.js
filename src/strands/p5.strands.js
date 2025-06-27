/**
* @module 3D
* @submodule strands
* @for p5
* @requires core
*/

import { transpileStrandsToJS } from './code_transpiler';
import { DataType, NodeType, OpCode, SymbolToOpCode, OpCodeToSymbol, OpCodeArgs } from './utils';

import { createStrandsAPI } from './p5.StrandsNode'
import * as DAG from './directed_acyclic_graph';
import * as CFG from './control_flow_graph'
import { create } from '@davepagurek/bezier-path';

function strands(p5, fn) {
  
  //////////////////////////////////////////////
  // Global Runtime
  //////////////////////////////////////////////
  
  class StrandsRuntime {
    constructor() {
      this.reset();
    }
    
    reset() {
      this._scopeStack = [];
      this._allScopes = new Map();
    }
    
    createBinaryExpressionNode(left, right, operatorSymbol) {
      const activeGraph = this._currentScope().graph;
      const opCode = SymbolToOpCode.get(operatorSymbol);
      
      const dataType = DataType.FLOAT; // lookUpBinaryOperatorResult();
      return activeGraph._getOrCreateNode(NodeType.OPERATION, dataType, opCode, null, null, [left, right]);
    }
    
    createLiteralNode(dataType, value) {
      const activeGraph = this._currentScope().graph; 
      return activeGraph._getOrCreateNode(NodeType.LITERAL, dataType, value, null, null, null);
    }
  }
  
  //////////////////////////////////////////////
  // Entry Point
  //////////////////////////////////////////////
  
  const strands = new StrandsRuntime();
  const API = createStrandsAPI(strands, fn);

  const oldModify = p5.Shader.prototype.modify
  
  for (const [fnName, fnBody] of Object.entries(userFunctions)) {
    fn[fnName] = fnBody;
  }
  
  p5.Shader.prototype.newModify = function(shaderModifier, options = { parser: true, srcLocations: false }) {
    if (shaderModifier instanceof Function) {
      
      // 1. Transpile from strands DSL to JS
      let strandsCallback;
      if (options.parser) {
        strandsCallback = transpileStrandsToJS(shaderModifier.toString(), options.srcLocations);
      } else {
        strandsCallback = shaderModifier;
      }
      
      // 2. Build the IR from JavaScript API
      strands.enterScope('GLOBAL');
      strandsCallback();
      strands.exitScope('GLOBAL');
      
      
      // 3. Generate shader code hooks object from the IR
      // .......

      // Call modify with the generated hooks object
      // return oldModify.call(this, generatedModifyArgument);
      
      // Reset the strands runtime context
      // strands.reset();
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
