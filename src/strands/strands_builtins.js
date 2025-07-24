import { GenType, DataType } from "./ir_types"

// GLSL Built in functions
// https://docs.gl/el3/abs
const builtInGLSLFunctions = {
  //////////// Trigonometry //////////
  acos: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  acosh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  asin: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  asinh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  atan: [
    { params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
    { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
  ],
  atanh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  cos: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  cosh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  degrees: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  radians: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  sin: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT , isp5Function: true}],
  sinh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  tan: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  tanh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],

  ////////// Mathematics //////////
  abs: [
    { params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
    { params: [GenType.FLOAT], returnType: GenType.INT, isp5Function: true}
  ],
  ceil: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  clamp: [
    { params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
    { params: [GenType.FLOAT,DataType.float1,DataType.float1], returnType: GenType.FLOAT, isp5Function: false},
    { params: [GenType.INT, GenType.INT, GenType.INT], returnType: GenType.INT, isp5Function: false},
    { params: [GenType.INT, DataType.int1, DataType.int1], returnType: GenType.INT, isp5Function: false},
  ],
  dFdx: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  dFdy: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  exp: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  exp2: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  floor: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  fma: [{ params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  fract: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  fwidth: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  inversesqrt: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  // "isinf": [{}],
  // "isnan": [{}],
  log: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  log2: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  max: [
    { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
    { params: [GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: true},
    { params: [GenType.INT, GenType.INT], returnType: GenType.INT, isp5Function: true},
    { params: [GenType.INT, DataType.int1], returnType: GenType.INT, isp5Function: true},
  ],
  min: [
    { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
    { params: [GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: true},
    { params: [GenType.INT, GenType.INT], returnType: GenType.INT, isp5Function: true},
    { params: [GenType.INT, DataType.int1], returnType: GenType.INT, isp5Function: true},
  ],
  mix: [
    { params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
    { params: [GenType.FLOAT, GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: false},
    { params: [GenType.FLOAT, GenType.FLOAT, GenType.BOOL], returnType: GenType.FLOAT, isp5Function: false},
  ],
  mod: [
    { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
    { params: [GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: true},
  ],
  // "modf": [{}],
  pow: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  round: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  roundEven: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  sign: [
    { params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
    { params: [GenType.INT], returnType: GenType.INT, isp5Function: false},
  ],
  smoothstep: [
    { params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
    { params: [ DataType.float1,DataType.float1, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
  ],
  sqrt: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  step: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  trunc: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  
  ////////// Vector //////////
  cross: [{ params: [DataType.float3, DataType.float3], returnType: DataType.float3, isp5Function: true}],
  distance: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType:DataType.float1, isp5Function: true}],
  dot: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType:DataType.float1, isp5Function: true}],
  equal: [
    { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.BOOL, isp5Function: false},
    { params: [GenType.INT, GenType.INT], returnType: GenType.BOOL, isp5Function: false},
    { params: [GenType.BOOL, GenType.BOOL], returnType: GenType.BOOL, isp5Function: false},
  ],
  faceforward: [{ params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  length: [{ params: [GenType.FLOAT], returnType:DataType.float1, isp5Function: false}],
  normalize: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
  notEqual: [
    { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.BOOL, isp5Function: false},
    { params: [GenType.INT, GenType.INT], returnType: GenType.BOOL, isp5Function: false},
    { params: [GenType.BOOL, GenType.BOOL], returnType: GenType.BOOL, isp5Function: false},
  ],
  reflect: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
  refract: [{ params: [GenType.FLOAT, GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: false}],
  
  ////////// Texture sampling //////////
  texture: [{params: ["texture2D", DataType.float2], returnType: DataType.float4, isp5Function: true}],
}

export const strandsBuiltinFunctions = {
  ...builtInGLSLFunctions,
} 