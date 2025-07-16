/////////////////////
// Enums for nodes //
/////////////////////
export const NodeType = {
  OPERATION: 0,
  LITERAL: 1,
  VARIABLE: 2,
  CONSTANT: 3,
  PHI: 4,
};

export const NodeTypeToName = Object.fromEntries(
  Object.entries(NodeType).map(([key, val]) => [val, key])
);

export const NodeTypeRequiredFields = {
  [NodeType.OPERATION]: ['opCode', 'dependsOn'],
  [NodeType.LITERAL]: ['value'],
  [NodeType.VARIABLE]: ['identifier'],
  [NodeType.CONSTANT]: ['value'],
  [NodeType.PHI]: ['dependsOn', 'phiBlocks']
};

export const BaseType = {
  FLOAT: 'float',
  INT: 'int',
  BOOL: 'bool',
  MAT: 'mat',
  DEFER: 'defer',
};

export const BasePriority = {
  [BaseType.FLOAT]: 3,
  [BaseType.INT]: 2,
  [BaseType.BOOL]: 1,
  [BaseType.MAT]: 0,
  [BaseType.DEFER]: -1,
};

export const TypeInfo = {
  'float1': { fnName: 'float',  baseType: BaseType.FLOAT,  dimension:1,  priority: 3,  },
  'float2': { fnName: 'vec2',   baseType: BaseType.FLOAT,  dimension:2,  priority: 3,  },
  'float3': { fnName: 'vec3',   baseType: BaseType.FLOAT,  dimension:3,  priority: 3,  },
  'float4': { fnName: 'vec4',   baseType: BaseType.FLOAT,  dimension:4,  priority: 3,  },

  'int1':   { fnName: 'int',    baseType: BaseType.INT,    dimension:1,  priority: 2,  },
  'int2':   { fnName: 'ivec2',  baseType: BaseType.INT,    dimension:2,  priority: 2,  },
  'int3':   { fnName: 'ivec3',  baseType: BaseType.INT,    dimension:3,  priority: 2,  },
  'int4':   { fnName: 'ivec4',  baseType: BaseType.INT,    dimension:4,  priority: 2,  },

  'bool1':  { fnName: 'bool',   baseType: BaseType.BOOL,   dimension:1,  priority: 1,  },
  'bool2':  { fnName: 'bvec2',  baseType: BaseType.BOOL,   dimension:2,  priority: 1,  },
  'bool3':  { fnName: 'bvec3',  baseType: BaseType.BOOL,   dimension:3,  priority: 1,  },
  'bool4':  { fnName: 'bvec4',  baseType: BaseType.BOOL,   dimension:4,  priority: 1,  },

  'mat2':   { fnName: 'mat2x2', baseType: BaseType.MAT,    dimension:2,  priority: 0,  },
  'mat3':   { fnName: 'mat3x3', baseType: BaseType.MAT,    dimension:3,  priority: 0,  },
  'mat4':   { fnName: 'mat4x4', baseType: BaseType.MAT,    dimension:4,  priority: 0,  },

  'defer':  { fnName:  null,    baseType: BaseType.DEFER,  dimension: null, priority: -1 },
}

export const TypeInfoFromGLSLName = Object.fromEntries(
  Object.values(TypeInfo)
    .filter(info => info.fnName !== null)
    .map(info => [info.fnName, info])
);

export const OpCode = {
  Binary: {
    ADD: 0,
    SUBTRACT: 1,
    MULTIPLY: 2,
    DIVIDE: 3,
    MODULO: 4,
    EQUAL: 5,
    NOT_EQUAL: 6,
    GREATER_THAN: 7,
    GREATER_EQUAL: 8,
    LESS_THAN: 9,
    LESS_EQUAL: 10,
    LOGICAL_AND: 11,
    LOGICAL_OR: 12,
    MEMBER_ACCESS: 13,
  },
  Unary: {
    LOGICAL_NOT: 100,
    NEGATE: 101,     
    PLUS: 102, 
    SWIZZLE: 103,
  },
  Nary: {
    FUNCTION_CALL: 200,
    CONSTRUCTOR: 201,
  },
  ControlFlow: {
    RETURN: 300,
    JUMP: 301,
    BRANCH_IF_FALSE: 302,
    DISCARD: 303,
  }
};

export const OperatorTable = [
  { arity: "unary", name: "not", symbol: "!", opcode: OpCode.Unary.LOGICAL_NOT },
  { arity: "unary", name: "neg", symbol: "-", opcode: OpCode.Unary.NEGATE },
  { arity: "unary", name: "plus", symbol: "+", opcode: OpCode.Unary.PLUS },
  { arity: "binary", name: "add", symbol: "+", opcode: OpCode.Binary.ADD },
  { arity: "binary", name: "sub", symbol: "-", opcode: OpCode.Binary.SUBTRACT },
  { arity: "binary", name: "mult", symbol: "*", opcode: OpCode.Binary.MULTIPLY },
  { arity: "binary", name: "div", symbol: "/", opcode: OpCode.Binary.DIVIDE },
  { arity: "binary", name: "mod", symbol: "%", opcode: OpCode.Binary.MODULO },
  { arity: "binary", name: "equalTo", symbol: "==", opcode: OpCode.Binary.EQUAL },
  { arity: "binary", name: "notEqual", symbol: "!=", opcode: OpCode.Binary.NOT_EQUAL },
  { arity: "binary", name: "greaterThan", symbol: ">", opcode: OpCode.Binary.GREATER_THAN },
  { arity: "binary", name: "greaterEqual", symbol: ">=", opcode: OpCode.Binary.GREATER_EQUAL },
  { arity: "binary", name: "lessThan", symbol: "<", opcode: OpCode.Binary.LESS_THAN },
  { arity: "binary", name: "lessEqual", symbol: "<=", opcode: OpCode.Binary.LESS_EQUAL },
  { arity: "binary", name: "and", symbol: "&&", opcode: OpCode.Binary.LOGICAL_AND },
  { arity: "binary", name: "or", symbol: "||", opcode: OpCode.Binary.LOGICAL_OR },
];

export const ConstantFolding = {
  [OpCode.Binary.ADD]: (a, b) => a + b,
  [OpCode.Binary.SUBTRACT]: (a, b) => a - b,
  [OpCode.Binary.MULTIPLY]: (a, b) => a * b,
  [OpCode.Binary.DIVIDE]: (a, b) => a / b,
  [OpCode.Binary.MODULO]: (a, b) => a % b,
  [OpCode.Binary.EQUAL]: (a, b) => a == b,
  [OpCode.Binary.NOT_EQUAL]: (a, b) => a != b,
  [OpCode.Binary.GREATER_THAN]: (a, b) => a > b,
  [OpCode.Binary.GREATER_EQUAL]: (a, b) => a >= b,
  [OpCode.Binary.LESS_THAN]: (a, b) => a < b,
  [OpCode.Binary.LESS_EQUAL]: (a, b) => a <= b,
  [OpCode.Binary.LOGICAL_AND]: (a, b) => a && b,
  [OpCode.Binary.LOGICAL_OR]: (a, b) => a || b,
};

export const SymbolToOpCode = {};
export const OpCodeToSymbol = {};
export const OpCodeArgs = {};
export const OpCodeToOperation = {};

for (const { arity, symbol, opcode } of OperatorTable) {
  SymbolToOpCode[symbol] = opcode;
  OpCodeToSymbol[opcode] = symbol;
  OpCodeArgs[opcode] = args;
}

export const BlockType = {
  GLOBAL: 0,
  FUNCTION: 1,
  IF_COND: 2,
  IF_BODY: 3,
  ELIF_BODY: 4,
  ELIF_COND: 5,
  ELSE_BODY: 6,
  FOR: 7,
  MERGE: 8,
  DEFAULT: 9,

}
export const BlockTypeToName = Object.fromEntries(
  Object.entries(BlockType).map(([key, val]) => [val, key])
);

////////////////////////////
// Type Checking helpers
////////////////////////////
export function arrayToFloatType(array) {
  let type = false;
  if (array.length === 1) {
    type = `FLOAT`;
  } else if (array.length >= 2 && array.length <= 4) {
    type = `VEC${array.length}`;
  } else {
    throw new Error('Tried to construct a float / vector with and empty array, or more than 4 components!')
  }
}

////////////////////////////
// Graph utils
////////////////////////////
export function dfsPostOrder(adjacencyList, start) {
  const visited = new Set();
  const postOrder = [];

  function dfs(v) {
    if (visited.has(v)) {
      return;
    }
    visited.add(v);
    for (let w of adjacencyList[v]) {
      dfs(w);
    }
    postOrder.push(v);
  }
  
  dfs(start);
  return postOrder;
}

export function dfsReversePostOrder(adjacencyList, start) {
  const visited = new Set();
  const postOrder = [];

  function dfs(v) {
    if (visited.has(v)) {
      return;
    }
    visited.add(v);
    for (let w of adjacencyList[v].sort((a, b) => b-a) || []) {
      dfs(w);
    }
    postOrder.push(v);
  }
  
  dfs(start);
  return postOrder.reverse();
}