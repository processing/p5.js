/**
* @module 3D
* @submodule strands
* @for p5
* @requires core
*/
import { WEBGL, /*WEBGPU*/ } from '../core/constants'

import { transpileStrandsToJS } from './code_transpiler';
import { BlockType } from './utils';

import { createDirectedAcyclicGraph } from './directed_acyclic_graph'
import { createControlFlowGraph, createBasicBlock, pushBlock, popBlock } from './control_flow_graph';
import { generateShaderCode } from './code_generation';
import { initGlobalStrandsAPI, initShaderHooksFunctions } from './user_API';

function strands(p5, fn) {
  //////////////////////////////////////////////
  // Global Runtime
  //////////////////////////////////////////////
  function initStrandsContext(ctx, backend) {
    ctx.dag = createDirectedAcyclicGraph();
    ctx.cfg = createControlFlowGraph();
    ctx.uniforms = [];
    ctx.hooks = [];
    ctx.backend = backend;
    ctx.active = true;
    ctx.previousFES = p5.disableFriendlyErrors;
    p5.disableFriendlyErrors = true;
  }
  
  function deinitStrandsContext(ctx) {
    ctx.dag = createDirectedAcyclicGraph();
    ctx.cfg = createControlFlowGraph();
    ctx.uniforms = [];
    ctx.hooks = [];
    p5.disableFriendlyErrors = ctx.previousFES;
  }
  
  const strandsContext = {};
  initStrandsContext(strandsContext);
  initGlobalStrandsAPI(p5, fn, strandsContext)
  
  //////////////////////////////////////////////
  // Entry Point
  //////////////////////////////////////////////
  const oldModify = p5.Shader.prototype.modify
  
  p5.Shader.prototype.newModify = function(shaderModifier, options = { parser: true, srcLocations: false }) {
    if (shaderModifier instanceof Function) {
      // Reset the context object every time modify is called;
      const backend = WEBGL;
      initStrandsContext(strandsContext, backend);
      initShaderHooksFunctions(strandsContext, fn, this);
      
      // 1. Transpile from strands DSL to JS
      let strandsCallback;
      if (options.parser) {
        strandsCallback = transpileStrandsToJS(shaderModifier.toString(), options.srcLocations);
      } else {
        strandsCallback = shaderModifier;
      }
      
      // 2. Build the IR from JavaScript API
      const globalScope = createBasicBlock(strandsContext.cfg, BlockType.GLOBAL);
      pushBlock(strandsContext.cfg, globalScope);
      strandsCallback();
      popBlock(strandsContext.cfg);
      
      // 3. Generate shader code hooks object from the IR
      // .......
      const hooksObject = generateShaderCode(strandsContext);
      console.log(hooksObject.getFinalColor);
      
      // Call modify with the generated hooks object
      // return oldModify.call(this, generatedModifyArgument);
      
      // Reset the strands runtime context
      // deinitStrandsContext(strandsContext);
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
