/**
* @module 3D
* @submodule strands
* @for p5
* @requires core
*/
import { glslBackend } from './strands_glslBackend';

import { transpileStrandsToJS } from './strands_transpiler';
import { BlockType } from './ir_types';

import { createDirectedAcyclicGraph } from './ir_dag'
import { createControlFlowGraph, createBasicBlock, pushBlock, popBlock } from './ir_cfg';
import { generateShaderCode } from './strands_codegen';
import { initGlobalStrandsAPI, createShaderHooksFunctions } from './strands_api';

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
    ctx.active = false;
  }

  const strandsContext = {};
  initStrandsContext(strandsContext);
  initGlobalStrandsAPI(p5, fn, strandsContext)

  //////////////////////////////////////////////
  // Entry Point
  //////////////////////////////////////////////
  const oldModify = p5.Shader.prototype.modify;
  
  p5.Shader.prototype.modify = function(shaderModifier, options = { parser: true, srcLocations: false }) {
    if (shaderModifier instanceof Function) {
      // Reset the context object every time modify is called;
      const backend = glslBackend;
      initStrandsContext(strandsContext, glslBackend);
      createShaderHooksFunctions(strandsContext, fn, this);

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
      console.log(hooksObject);
      console.log(hooksObject['Vertex getWorldInputs']);
      
      // Reset the strands runtime context
      deinitStrandsContext(strandsContext);

      // Call modify with the generated hooks object
      return oldModify.call(this, hooksObject);      
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
