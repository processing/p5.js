/////////////////////
// Enums for nodes //
/////////////////////

export const NodeType = {
  // Internal Nodes:
  OPERATION: 0,
  // Leaf Nodes
  LITERAL: 1,
  VARIABLE: 2,
  CONSTANT: 3,
  PHI: 4,
};

export const NodeTypeRequiredFields = {
  [NodeType.OPERATION]: ['opCode', 'dependsOn'],
  [NodeType.LITERAL]: ['value'],
  [NodeType.VARIABLE]: ['identifier', 'dataType'],
  [NodeType.CONSTANT]: ['value'],
  [NodeType.PHI]: ['dependsOn', 'phiBlocks']
};

export const NodeTypeToName = Object.fromEntries(
  Object.entries(NodeType).map(([key, val]) => [val, key])
);

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
}

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
  { arity: "binary", name: "min", symbol: "-", opcode: OpCode.Binary.SUBTRACT },
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


export const SymbolToOpCode = {};
export const OpCodeToSymbol = {};
export const OpCodeArgs = {};

for (const { arity: args, symbol, opcode } of OperatorTable) {
  SymbolToOpCode[symbol] = opcode;
  OpCodeToSymbol[opcode] = symbol;
  OpCodeArgs[opcode] = args;
}

export const BlockType = {
  GLOBAL: 0,
  IF: 1,
  ELSE_IF: 2,
  ELSE: 3,
  FOR: 4,
  MERGE: 5,
}