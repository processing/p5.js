import {
  createBinaryOpNode, 
  createFunctionCallNode,
  createVariableNode,
  createStatementNode,
  createTypeConstructorNode,
} from './builder'
import { OperatorTable, SymbolToOpCode, BlockType, TypeInfo, BaseType, TypeInfoFromGLSLName } from './utils'
import { strandsShaderFunctions } from './shader_functions'
import { StrandsConditional } from './strands_conditionals'
import * as CFG from './control_flow_graph'
import * as FES from './strands_FES'

//////////////////////////////////////////////
// User nodes 
//////////////////////////////////////////////
export class StrandsNode {
  constructor(id) {
    this.id = id;
  }
}

export function initGlobalStrandsAPI(p5, fn, strandsContext) {
  // We augment the strands node with operations programatically 
  // this means methods like .add, .sub, etc can be chained
  for (const { name, symbol, arity } of OperatorTable) {
    if (arity === 'binary') {
      StrandsNode.prototype[name] = function (...right) {
        const id = createBinaryOpNode(strandsContext, this, right, SymbolToOpCode[symbol]);
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
  
  //////////////////////////////////////////////
  // Unique Functions
  //////////////////////////////////////////////
  fn.discard = function() {
    const id = createStatementNode('discard');
    CFG.recordInBasicBlock(strandsContext.cfg, strandsContext.cfg.currentBlock, id);
  }
  
  fn.strandsIf = function(conditionNode, ifBody) {
    return new StrandsConditional(strandsContext, conditionNode, ifBody);
  }
  
  fn.strandsLoop = function(a, b, loopBody) {
    return null;
  }
  
  fn.strandsNode = function(...args) {
    if (args.length > 4) {
      FES.userError('type error', "It looks like you've tried to construct a p5.strands node implicitly, with more than 4 components. This is currently not supported.")
    }
    const id = createTypeConstructorNode(strandsContext, { baseType: BaseType.DEFER, dimension: null }, args);
    return new StrandsNode(id); 
  }
  
  //////////////////////////////////////////////
  // Builtins, uniforms, variable constructors
  //////////////////////////////////////////////
  for (const [fnName, overrides] of Object.entries(strandsShaderFunctions)) {
    const isp5Function = overrides[0].isp5Function;
    
    if (isp5Function) {
      const originalFn = fn[fnName];
      fn[fnName] = function(...args) {
        if (strandsContext.active) {
          return createFunctionCallNode(strandsContext, fnName, overrides, args);
        } else {
          return originalFn.apply(this, args);
        }
      }
    } else {
      fn[fnName] = function (...args) {
        if (strandsContext.active) {
          return createFunctionCallNode(strandsContext, fnName, overrides, args);
        } else {
          p5._friendlyError(
            `It looks like you've called ${fnName} outside of a shader's modify() function.`
          )
        }
      }
    }
  }
  
  // Next is type constructors and uniform functions
  for (const type in TypeInfo) {
    if (type === BaseType.DEFER) {
      continue;
    }
    const typeInfo = TypeInfo[type];

    let pascalTypeName;
    if (/^[ib]vec/.test(typeInfo.fnName)) {
      pascalTypeName = typeInfo.fnName
      .slice(0, 2).toUpperCase()
      + typeInfo.fnName
      .slice(2)
      .toLowerCase();
    } else {
      pascalTypeName = typeInfo.fnName.charAt(0).toUpperCase()
      + typeInfo.fnName.slice(1).toLowerCase();
    }
    
    fn[`uniform${pascalTypeName}`] = function(name, ...defaultValue) {
      const id = createVariableNode(strandsContext, typeInfo, name);
      strandsContext.uniforms.push({ name, typeInfo, defaultValue });
      return new StrandsNode(id);
    };
    
    const originalp5Fn = fn[typeInfo.fnName];
    fn[typeInfo.fnName] = function(...args) {
      if (strandsContext.active) {
        const id = createTypeConstructorNode(strandsContext, typeInfo, args);
        return new StrandsNode(id);
      } else if (originalp5Fn) {
        return originalp5Fn.apply(this, args);
      } else {
        p5._friendlyError(
          `It looks like you've called ${typeInfo.fnName} outside of a shader's modify() function.`
        );
      }
    }
  }
}

//////////////////////////////////////////////
// Per-Hook functions
//////////////////////////////////////////////
function createHookArguments(strandsContext, parameters){
  const structTypes = ['Vertex', ]
  const args = [];
  
  for (const param of parameters) {
    const paramType = param.type;
    if(structTypes.includes(paramType.typeName)) {
      const propertiesNodes = paramType.properties.map(
        (prop) => [prop.name, createVariableNode(strandsContext, TypeInfoFromGLSLName[prop.dataType], prop.name)]
      );
      const argObject = Object.fromEntries(propertiesNodes);
      args.push(argObject);
    } else {
      const typeInfo = TypeInfoFromGLSLName[paramType.typeName];
      const arg = createVariableNode(strandsContext, typeInfo, param.name);
      args.push(arg)
    }
  }
  return args;
}

export function initShaderHooksFunctions(strandsContext, fn, shader) { 
  const availableHooks = {
    ...shader.hooks.vertex,
    ...shader.hooks.fragment,
  }
  const hookTypes = Object.keys(availableHooks).map(name => shader.hookTypes(name));
  const { cfg } = strandsContext;
  for (const hookType of hookTypes) {
    window[hookType.name] = function(hookUserCallback) {
      const entryBlockID = CFG.createBasicBlock(cfg, BlockType.FUNCTION);
      CFG.addEdge(cfg, cfg.currentBlock, entryBlockID);
      CFG.pushBlock(cfg, entryBlockID);
      const args = createHookArguments(strandsContext, hookType.parameters);
      const rootNodeID = hookUserCallback(args).id;
      strandsContext.hooks.push({
        hookType, 
        entryBlockID,
        rootNodeID,
      });
      CFG.popBlock(cfg);
    }
  }
}