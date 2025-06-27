//////////////////////////////////////////////
// User API
//////////////////////////////////////////////

import { OperatorTable } from './utils'

export class StrandsNode {
  constructor(id) {
    this.id = id;
  }
}

export function createStrandsAPI(strands, fn) {
  // Attach operators to StrandsNode:
  for (const { name, symbol, arity } of OperatorTable) {
    if (arity === 'binary') {
      StrandsNode.prototype[name] = function (rightNode) {
        const id = strands.createBinaryExpressionNode(this, rightNode, symbol);
        return new StrandsNode(id);
      };
    }
    if (arity === 'unary') {
      StrandsNode.prototype[name] = function () {
        const id = strands.createUnaryExpressionNode(this, symbol);
        return new StrandsNode(id);
      };
    }
  }
  
  // Attach p5 Globals
  fn.uniformFloat = function(name, value) {
    const id = strands.createVariableNode(DataType.FLOAT, name);
    return new StrandsNode(id);
  },

  fn.createFloat = function(value) {
    const id = strands.createLiteralNode(DataType.FLOAT, value);
    return new StrandsNode(id);
  }
}