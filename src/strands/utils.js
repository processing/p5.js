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

export const NodeTypeRequiredFields = {
  [NodeType.OPERATION]: ['opCode', 'dependsOn'],
  [NodeType.LITERAL]: ['value'],
  [NodeType.VARIABLE]: ['identifier'],
  [NodeType.CONSTANT]: ['value'],
  [NodeType.PHI]: ['dependsOn', 'phiBlocks']
};

export const NodeTypeToName = Object.fromEntries(
  Object.entries(NodeType).map(([key, val]) => [val, key])
);

export const BaseType = {
  FLOAT: 'float',
  INT: 'int',
  BOOl: 'bool',
  MAT: 'mat',
  DEFER: 'deferred',
};

export const AllTypes = [
  'float1',
  'float2',
  'float3',
  'float4',
  'int1',
  'int2',
  'int3',
  'int4',
  'bool1',
  'bool2',
  'bool3',
  'bool4',
  'mat2x2',
  'mat3x3',
  'mat4x4',
]

export const DataType = {
  FLOAT: 0,
  VEC2: 1,
  VEC3: 2,
  VEC4: 3,
  
  INT: 100,
  IVEC2: 101,
  IVEC3: 102,
  IVEC4: 103,
  
  BOOL: 200,
  BVEC2: 201,
  BVEC3: 202,
  BVEC4: 203,
  
  MAT2X2: 300,
  MAT3X3: 301,
  MAT4X4: 302,

  DEFER: 999,
}

export const DataTypeInfo = {
  [DataType.FLOAT]: { base: DataType.FLOAT, dimension: 1, priority: 2 },
  [DataType.VEC2]:  { base: DataType.FLOAT, dimension: 2, priority: 2 },
  [DataType.VEC3]:  { base: DataType.FLOAT, dimension: 3, priority: 2 },
  [DataType.VEC4]:  { base: DataType.FLOAT, dimension: 4, priority: 2 },
  [DataType.INT]:   { base: DataType.INT,   dimension: 1, priority: 1 },
  [DataType.IVEC2]: { base: DataType.INT,   dimension: 2, priority: 1 },
  [DataType.IVEC3]: { base: DataType.INT,   dimension: 3, priority: 1 },
  [DataType.IVEC4]: { base: DataType.INT,   dimension: 4, priority: 1 },
  [DataType.BOOL]:  { base: DataType.BOOL,  dimension: 1, priority: 0 },
  [DataType.BVEC2]: { base: DataType.BOOL,  dimension: 2, priority: 0 },
  [DataType.BVEC3]: { base: DataType.BOOL,  dimension: 3, priority: 0 },
  [DataType.BVEC4]: { base: DataType.BOOL,  dimension: 4, priority: 0 },
  [DataType.MAT2]:  { base: DataType.FLOAT, dimension: 2, priority: -1 },
  [DataType.MAT3]:  { base: DataType.FLOAT, dimension: 3, priority: -1 },
  [DataType.MAT4]:  { base: DataType.FLOAT, dimension: 4, priority: -1 },

  [DataType.DEFER]: { base: DataType.DEFER, dimension: null, priority: -2 },
  [DataType.DEFER]: { base: DataType.DEFER, dimension: null, priority: -2 },
  [DataType.DEFER]: { base: DataType.DEFER, dimension: null, priority: -2 },
  [DataType.DEFER]: { base: DataType.DEFER, dimension: null, priority: -2 },
};

// 2) A separate nested lookup table:
export const DataTypeTable = {
  [DataType.FLOAT]: {  1: DataType.FLOAT, 2: DataType.VEC2, 3: DataType.VEC3, 4: DataType.VEC4 },
  [DataType.INT]:   {  1: DataType.INT,   2: DataType.IVEC2, 3: DataType.IVEC3, 4: DataType.IVEC4 },
  [DataType.BOOL]:  {  1: DataType.BOOL,  2: DataType.BVEC2, 3: DataType.BVEC3, 4: DataType.BVEC4 },
  // [DataType.MAT2]:  {  2: DataType.MAT2,  3: DataType.MAT3,  4: DataType.MAT4 },
  [DataType.DEFER]: {  0: DataType.DEFER, 1: DataType.DEFER, 2: DataType.DEFER, 3: DataType.DEFER, 4: DataType.DEFER },
};

export function lookupDataType(baseCode, dim) {
  const map = DataTypeTable[baseCode];
  if (!map || map[dim] == null) {
    throw new Error(`Invalid type combination: base=${baseCode}, dim=${dim}`);
  }
  return map[dim];
}

export const DataTypeName = Object.fromEntries(
  Object.entries(DataType).map(([key,val])=>[val, key.toLowerCase()])
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

const BinaryOperations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
  "==": (a, b) => a == b,
  "!=": (a, b) => a != b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  "&&": (a, b) => a && b,
  "||": (a, b) => a || b,
};

export const SymbolToOpCode = {};
export const OpCodeToSymbol = {};
export const OpCodeArgs = {};
export const OpCodeToOperation = {};

for (const { arity, symbol, opcode } of OperatorTable) {
  SymbolToOpCode[symbol] = opcode;
  OpCodeToSymbol[opcode] = symbol;
  OpCodeArgs[opcode] = args;
  if (arity === "binary" && BinaryOperations[symbol]) {
    OpCodeToOperation[opcode] = BinaryOperations[symbol];
  }
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