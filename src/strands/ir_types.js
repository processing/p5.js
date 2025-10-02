/////////////////////
// Enums for nodes //
/////////////////////
export const NodeType = {
  OPERATION: 'operation',
  LITERAL: 'literal',
  VARIABLE: 'variable',
  CONSTANT: 'constant',
  STRUCT: 'struct',
  PHI: 'phi',
  STATEMENT: 'statement',
  ASSIGNMENT: 'assignment',
};

export const NodeTypeToName = Object.fromEntries(
  Object.entries(NodeType).map(([key, val]) => [val, key])
);

export const NodeTypeRequiredFields = {
  [NodeType.OPERATION]: ["opCode", "dependsOn", "dimension", "baseType"],
  [NodeType.LITERAL]: ["value", "dimension", "baseType"],
  [NodeType.VARIABLE]: ["identifier", "dimension", "baseType"],
  [NodeType.CONSTANT]: ["value", "dimension", "baseType"],
  [NodeType.STRUCT]: [""],
  [NodeType.PHI]: ["dependsOn", "phiBlocks", "dimension", "baseType"],
  [NodeType.STATEMENT]: ["opCode"],
  [NodeType.ASSIGNMENT]: ["dependsOn"]
};

export const StatementType = {
  DISCARD: 'discard',
};

export const BaseType = {
  FLOAT: "float",
  INT: "int",
  BOOL: "bool",
  MAT: "mat",
  DEFER: "defer",
  SAMPLER2D: "sampler2D",
};

export const BasePriority = {
  [BaseType.FLOAT]: 3,
  [BaseType.INT]: 2,
  [BaseType.BOOL]: 1,
  [BaseType.MAT]: 0,
  [BaseType.DEFER]: -1,
  [BaseType.SAMPLER2D]: -10,
};

export const DataType = {
  float1: { fnName: "float", baseType: BaseType.FLOAT, dimension:1, priority: 3,  },
  float2: { fnName: "vec2", baseType: BaseType.FLOAT, dimension:2, priority: 3,  },
  float3: { fnName: "vec3", baseType: BaseType.FLOAT, dimension:3, priority: 3,  },
  float4: { fnName: "vec4", baseType: BaseType.FLOAT, dimension:4, priority: 3,  },
  int1: { fnName: "int", baseType: BaseType.INT, dimension:1, priority: 2,  },
  int2: { fnName: "ivec2", baseType: BaseType.INT, dimension:2, priority: 2,  },
  int3: { fnName: "ivec3", baseType: BaseType.INT, dimension:3, priority: 2,  },
  int4: { fnName: "ivec4", baseType: BaseType.INT, dimension:4, priority: 2,  },
  bool1: { fnName: "bool", baseType: BaseType.BOOL, dimension:1, priority: 1,  },
  bool2: { fnName: "bvec2", baseType: BaseType.BOOL, dimension:2, priority: 1,  },
  bool3: { fnName: "bvec3", baseType: BaseType.BOOL, dimension:3, priority: 1,  },
  bool4: { fnName: "bvec4", baseType: BaseType.BOOL, dimension:4, priority: 1,  },
  mat2: { fnName: "mat2x2", baseType: BaseType.MAT, dimension:2, priority: 0,  },
  mat3: { fnName: "mat3x3", baseType: BaseType.MAT, dimension:3, priority: 0,  },
  mat4: { fnName: "mat4x4", baseType: BaseType.MAT, dimension:4, priority: 0,  },
  defer: { fnName:  null, baseType: BaseType.DEFER, dimension: null, priority: -1 },
  sampler2D: { fnName: "texture", baseType: BaseType.SAMPLER2D, dimension: 1, priority: -10 },
}
export const structType = function (hookType) {
  let T = hookType.type === undefined ? hookType : hookType.type;
  const structType = {
    name: hookType.name,
    properties: [],
    typeName: T.typeName,
  };
  // TODO: handle struct properties that are themselves structs
  for (const prop of T.properties) {
    const propType = TypeInfoFromGLSLName[prop.type.typeName];
    structType.properties.push(
      {name: prop.name, dataType: propType }
    );
  }
  return structType;
};

export function isStructType(typeName) {
  return !isNativeType(typeName);
}

export function isNativeType(typeName) {
  return Object.keys(DataType).includes(typeName);
}

export const GenType = {
  FLOAT: { baseType: BaseType.FLOAT, dimension: null, priority: 3 },
  INT: { baseType: BaseType.INT, dimension: null, priority: 2 },
  BOOL: { baseType: BaseType.BOOL, dimension: null, priority: 1 },
}

export function typeEquals(nodeA, nodeB) {
  return (nodeA.dimension === nodeB.dimension) && (nodeA.baseType === nodeB.baseType);
}

export const TypeInfoFromGLSLName = Object.fromEntries(
  Object.values(DataType)
    .filter(info => info.fnName !== null)
    .map(info => [info.fnName === 'texture' ? 'sampler2D' : info.fnName, info])
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
  { arity: "unary", name: "not", symbol: "!", opCode: OpCode.Unary.LOGICAL_NOT },
  { arity: "unary", name: "neg", symbol: "-", opCode: OpCode.Unary.NEGATE },
  { arity: "unary", name: "plus", symbol: "+", opCode: OpCode.Unary.PLUS },
  { arity: "binary", name: "add", symbol: "+", opCode: OpCode.Binary.ADD },
  { arity: "binary", name: "sub", symbol: "-", opCode: OpCode.Binary.SUBTRACT },
  { arity: "binary", name: "mult", symbol: "*", opCode: OpCode.Binary.MULTIPLY },
  { arity: "binary", name: "div", symbol: "/", opCode: OpCode.Binary.DIVIDE },
  { arity: "binary", name: "mod", symbol: "%", opCode: OpCode.Binary.MODULO },
  { arity: "binary", name: "equalTo", symbol: "==", opCode: OpCode.Binary.EQUAL },
  { arity: "binary", name: "notEqual", symbol: "!=", opCode: OpCode.Binary.NOT_EQUAL },
  { arity: "binary", name: "greaterThan", symbol: ">", opCode: OpCode.Binary.GREATER_THAN },
  { arity: "binary", name: "greaterEqual", symbol: ">=", opCode: OpCode.Binary.GREATER_EQUAL },
  { arity: "binary", name: "lessThan", symbol: "<", opCode: OpCode.Binary.LESS_THAN },
  { arity: "binary", name: "lessEqual", symbol: "<=", opCode: OpCode.Binary.LESS_EQUAL },
  { arity: "binary", name: "and", symbol: "&&", opCode: OpCode.Binary.LOGICAL_AND },
  { arity: "binary", name: "or", symbol: "||", opCode: OpCode.Binary.LOGICAL_OR },
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

// export const SymbolToOpCode = {};
export const OpCodeToSymbol = {};
export const UnarySymbolToName = {};
export const BinarySymbolToName = {};

for (const { symbol, opCode, name, arity } of OperatorTable) {
  // SymbolToOpCode[symbol] = opCode;
  OpCodeToSymbol[opCode] = symbol;
  if (arity === 'unary') {
    UnarySymbolToName[symbol] = name;
  }
  if (arity === 'binary') {
    BinarySymbolToName[symbol] = name;
  }
}

export const BlockType = {
  GLOBAL: 'global',
  FUNCTION: 'function',
  BRANCH: 'branch',
  IF_COND: 'if_cond',
  IF_BODY: 'if_body',
  ELSE_COND: 'else_cond',
  ELSE_BODY: 'else_body',
  SCOPE_START: 'scope_start',
  SCOPE_END: 'scope_end',
  FOR: 'for',
  MERGE: 'merge',
  DEFAULT: 'default',
}

export const BlockTypeToName = Object.fromEntries(
  Object.entries(BlockType).map(([key, val]) => [val, key])
);
