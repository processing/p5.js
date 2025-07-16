// GLSL Built in functions
// https://docs.gl/el3/abs
const builtInGLSLFunctions = {
  //////////// Trigonometry //////////
  'acos': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'acosh': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'asin': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'asinh': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'atan': [
    { args: ['genType'], returnType: 'genType', isp5Function: false},
    { args: ['genType', 'genType'], returnType: 'genType', isp5Function: false},
  ],
  'atanh': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'cos': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'cosh': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'degrees': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'radians': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'sin': [{ args: ['genType'], returnType: 'genType' , isp5Function: true}],
  'sinh': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'tan': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'tanh': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  ////////// Mathematics //////////
  'abs': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'ceil': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'clamp': [{ args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false}],
  'dFdx': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'dFdy': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'exp': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'exp2': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'floor': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'fma': [{ args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false}],
  'fract': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'fwidth': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'inversesqrt': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  // 'isinf': [{}],
  // 'isnan': [{}],
  'log': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'log2': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  'max': [
    { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true},
    { args: ['genType', 'float'], returnType: 'genType', isp5Function: true},
  ],
  'min': [
    { args: ['genType', 'genType'], returnType: 'genType', isp5Function: true},
    { args: ['genType', 'float'], returnType: 'genType', isp5Function: true},
  ],
  'mix': [
    { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false},
    { args: ['genType', 'genType', 'float'], returnType: 'genType', isp5Function: false},
  ],
  // 'mod': [{}],
  // 'modf': [{}],
  'pow': [{ args: ['genType', 'genType'], returnType: 'genType', isp5Function: true}],
  'round': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'roundEven': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  // 'sign': [{}],
  'smoothstep': [
    { args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false},
    { args: ['float', 'float', 'genType'], returnType: 'genType', isp5Function: false},
  ],
  'sqrt': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  'step': [{ args: ['genType', 'genType'], returnType: 'genType', isp5Function: false}],
  'trunc': [{ args: ['genType'], returnType: 'genType', isp5Function: false}],
  
  ////////// Vector //////////
  'cross': [{ args: ['vec3', 'vec3'], returnType: 'vec3', isp5Function: true}],
  'distance': [{ args: ['genType', 'genType'], returnType: 'float', isp5Function: true}],
  'dot': [{ args: ['genType', 'genType'], returnType: 'float', isp5Function: true}],
  // 'equal': [{}],
  'faceforward': [{ args: ['genType', 'genType', 'genType'], returnType: 'genType', isp5Function: false}],
  'length': [{ args: ['genType'], returnType: 'float', isp5Function: false}],
  'normalize': [{ args: ['genType'], returnType: 'genType', isp5Function: true}],
  // 'notEqual': [{}],
  'reflect': [{ args: ['genType', 'genType'], returnType: 'genType', isp5Function: false}],
  'refract': [{ args: ['genType', 'genType', 'float'], returnType: 'genType', isp5Function: false}],
  
  ////////// Texture sampling //////////
  'texture': [{args: ['sampler2D', 'vec2'], returnType: 'vec4', isp5Function: true}],
}

export const strandsShaderFunctions = {
  ...builtInGLSLFunctions,
} 