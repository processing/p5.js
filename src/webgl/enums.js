import * as constants from '../core/constants';
export function getStrokeDefs(shaderConstant) {
  const STROKE_CAP_ENUM = {};
  const STROKE_JOIN_ENUM = {};
  let lineDefs = "";
  const defineStrokeCapEnum = function (key, val) {
    lineDefs += shaderConstant(`STROKE_CAP_${key}`, `${val}`, 'u32');
    STROKE_CAP_ENUM[constants[key]] = val;
  };
  const defineStrokeJoinEnum = function (key, val) {
    lineDefs += shaderConstant(`STROKE_JOIN_${key}`, `${val}`, 'u32');
    STROKE_JOIN_ENUM[constants[key]] = val;
  };

  // Define constants in line shaders for each type of cap/join, and also record
  // the values in JS objects
  defineStrokeCapEnum("ROUND", 0);
  defineStrokeCapEnum("PROJECT", 1);
  defineStrokeCapEnum("SQUARE", 2);
  defineStrokeJoinEnum("ROUND", 0);
  defineStrokeJoinEnum("MITER", 1);
  defineStrokeJoinEnum("BEVEL", 2);

  return { STROKE_CAP_ENUM, STROKE_JOIN_ENUM, lineDefs };
}
