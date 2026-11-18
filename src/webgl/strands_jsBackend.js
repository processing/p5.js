import { sortCFG } from '../strands/ir_cfg';
import {
  BlockType,
  NodeType,
  OpCode,
  BaseType,
  StatementType,
  HOOK_PARAM_PREFIX
} from '../strands/ir_types';
import { getNodeDataFromID } from '../strands/ir_dag';
import * as FES from '../strands/strands_FES';

const INDEX_PARAM = `${HOOK_PARAM_PREFIX}index`;
const TEMP_PREFIX = '__t';



function shouldCreateTemp(dag, nodeID) {
  const nodeType = dag.nodeTypes[nodeID];
  if (nodeType !== NodeType.OPERATION) return false;
  if (dag.baseTypes[nodeID] === BaseType.SAMPLER2D) return false;
  const uses = dag.usedBy[nodeID] || [];
  return uses.length > 1;
}

// GLSL type names this backend may see for value conversions. Casts are
// recorded with the active backend's type names, so a shader built under
// WebGL uses these while one built under WebGPU would use WGSL spellings.
const GLSL_TYPE_TO_INFO = {
  float: ['float', 1],
  vec2: ['float', 2],
  vec3: ['float', 3],
  vec4: ['float', 4],
  int: ['int', 1],
  ivec2: ['int', 2],
  ivec3: ['int', 3],
  ivec4: ['int', 4],
  bool: ['bool', 1],
  bvec2: ['bool', 2],
  bvec3: ['bool', 3],
  bvec4: ['bool', 4]
};

function channelIndex(channel) {
  if ('xyzw'.includes(channel)) return 'xyzw'.indexOf(channel);
  if ('rgba'.includes(channel)) return 'rgba'.indexOf(channel);
  if ('stpq'.includes(channel)) return 'stpq'.indexOf(channel);
  FES.userError('type error', `Unknown swizzle channel "${channel}".`);
}

// Runtime helpers available to generated iteration functions as `H`.
export function createCpuHelpers(pInst) {
  const state = { flat: 0, randomCalls: 0 };

  const asComponents = value => (Array.isArray(value) ? value : [value]);

  const convertScalar = (base, value) => {
    if (base === BaseType.INT) return Math.trunc(Number(value));
    if (base === BaseType.BOOL) return Boolean(value);
    return Number(value);
  };

  const vec = (base, dim, parts) => {
    const flat = [];
    for (const part of parts) {
      if (Array.isArray(part)) flat.push(...part);
      else flat.push(part);
    }
    const source = flat.length === 1 ? Array(dim).fill(flat[0]) : flat;
    return source
      .slice(0, dim)
      .map(v => convertScalar(base, v));
  };

  const binop = (op, left, right, base, dim) => {
    const leftIsVec = Array.isArray(left);
    const rightIsVec = Array.isArray(right);
    const outDim =
      dim ?? (leftIsVec ? left.length : rightIsVec ? right.length : 1);
    const leftArr = leftIsVec ? left : Array(outDim).fill(left);
    const rightArr = rightIsVec ? right : Array(outDim).fill(right);
    const apply = (a, b) => {
      switch (op) {
        case OpCode.Binary.ADD:
          return a + b;
        case OpCode.Binary.SUBTRACT:
          return a - b;
        case OpCode.Binary.MULTIPLY:
          return a * b;
        case OpCode.Binary.DIVIDE:
          return base === BaseType.INT ? Math.trunc(a / b) : a / b;
        case OpCode.Binary.MODULO:
          if (base === BaseType.INT) return a % b;
          return a - b * Math.floor(a / b);
        case OpCode.Binary.EQUAL:
          return a === b;
        case OpCode.Binary.NOT_EQUAL:
          return a !== b;
        case OpCode.Binary.GREATER_THAN:
          return a > b;
        case OpCode.Binary.GREATER_EQUAL:
          return a >= b;
        case OpCode.Binary.LESS_THAN:
          return a < b;
        case OpCode.Binary.LESS_EQUAL:
          return a <= b;
        case OpCode.Binary.LOGICAL_AND:
          return a && b;
        case OpCode.Binary.LOGICAL_OR:
          return a || b;
        default:
          FES.userError(
            'type error',
            `Unsupported binary operation (${op}) in the CPU compute fallback.`
          );
      }
    };
    if (op === OpCode.Binary.EQUAL || op === OpCode.Binary.NOT_EQUAL) {
      const equal = leftArr.every((v, i) => v === rightArr[i]);
      return op === OpCode.Binary.EQUAL ? equal : !equal;
    }
    const out = leftArr.map((v, i) => apply(v, rightArr[i]));
    return outDim === 1 ? out[0] : out;
  };

  const unop = (op, value) => {
    switch (op) {
      case OpCode.Unary.LOGICAL_NOT:
        return !value;
      case OpCode.Unary.NEGATE:
        return Array.isArray(value) ? value.map(v => -v) : -value;
      case OpCode.Unary.PLUS:
        return value;
      default:
        FES.userError(
          'type error',
          `Unsupported unary operation (${op}) in the CPU compute fallback.`
        );
    }
  };

  const swiz = (value, pattern) => {
    const parts = asComponents(value);
    const out = [...pattern].map(c => parts[channelIndex(c)]);
    return out.length === 1 ? out[0] : out;
  };

  const swizSet = (value, pattern, update) => {
    const out = asComponents(value).slice();
    const updateParts = asComponents(update);
    [...pattern].forEach((c, i) => {
      out[channelIndex(c)] = updateParts.length === 1 ? updateParts[0] : updateParts[i];
    });
    return Array.isArray(value) ? out : out[0];
  };

  const truncIndex = index => {
    const i = Math.trunc(Number(index));
    if (!Number.isFinite(i) || i < 0) {
      FES.userError(
        'type error',
        `Storage index out of bounds (${index}) in the CPU compute fallback.`
      );
    }
    return i;
  };

  // Read a struct field, converting p5 types to plain values for math.
  const readFieldValue = (buffer, index, field) => {
    const item = buffer.data[truncIndex(index)];
    const value = item[field.name];
    if (value?.isVector) {
      return Array.from({ length: field.dim }, (_, i) =>
        ['x', 'y', 'z', 'w'][i] !== undefined ? value[['x', 'y', 'z', 'w'][i]] : 0
      );
    }
    if (value?.isColor) return value._getRGBA().slice();
    if (Array.isArray(value)) return value.slice();
    return value;
  };

  // Write a struct field, preserving the stored representation.
  const writeFieldValue = (buffer, index, field, value) => {
    const item = buffer.data[truncIndex(index)];
    const current = item[field.name];
    const parts = asComponents(value);
    if (current?.isVector) {
      const channels = ['x', 'y', 'z', 'w'];
      for (let i = 0; i < field.dim; i++) {
        current[channels[i]] = Number(parts.length === 1 ? parts[0] : parts[i]);
      }
      return;
    }
    if (current?.isColor) {
      item[field.name] = makeColor(parts);
      return;
    }
    if (Array.isArray(current)) {
      item[field.name] = parts.slice(0, field.dim);
      while (item[field.name].length < field.dim) item[field.name].push(0);
      return;
    }
    item[field.name] = Number(parts[0]);
  };

  const maxesForMode = () => {
    try {
      const states = pInst._renderer.states;
      return states.colorMaxes[states.colorMode];
    } catch {
      return [255, 255, 255, 255];
    }
  };

  const makeColor = parts => {
    const maxes = maxesForMode();
    return pInst.color(
      parts[0] * maxes[0],
      parts[1] * maxes[1],
      parts[2] * maxes[2],
      (parts[3] ?? 1) * maxes[3]
    );
  };

  const writeSwiz = (buffer, index, field, pattern, value) => {
    const i = truncIndex(index);
    if (field === null) {
      if (!Array.isArray(buffer.data[i])) {
        FES.userError(
          'type error',
          `Cannot assign to "${pattern}" on a scalar storage value in the CPU compute fallback.`
        );
      }
      buffer.data[i] = swizSet(buffer.data[i], pattern, value);
      return;
    }
    const current = buffer.data[i][field.name];
    if (current?.isVector) {
      const channels = ['x', 'y', 'z', 'w'];
      const parts = Array.from({ length: field.dim }, (_, k) => current[channels[k]]);
      const next = swizSet(parts, pattern, value);
      for (let k = 0; k < field.dim; k++) {
        current[channels[k]] = Number(next[k]);
      }
      return;
    }
    if (current?.isColor) {
      buffer.data[i][field.name] = makeColor(
        swizSet(current._getRGBA(), pattern, value)
      );
      return;
    }
    if (Array.isArray(current)) {
      const next = swizSet(current, pattern, value);
      while (next.length < field.dim) next.push(0);
      buffer.data[i][field.name] = next.slice(0, field.dim);
      return;
    }
    FES.userError(
      'type error',
      `Cannot assign to "${pattern}" on scalar field "${field.name}" in the CPU compute fallback.`
    );
  };

  const randomValue = seed => {
    const callIndex = state.randomCalls++;
    const s = fract(seed * 0.7548776662);
    return hash(vec3(
      flat + s,
      /* y */ callIndex * 0.5698402910,
      /* z */ s + callIndex * 0.6180339887
    ));
  };


  const noiseValue = args => {
    const input = asComponents(args[0]);
    const octaves = args.length > 1 ? Math.trunc(Number(args[1])) : undefined;
    const falloff = args.length > 2 ? Number(args[2]) : undefined;
    let previousOctaves;
    let previousFalloff;
    try {
      previousOctaves = pInst._getNoiseOctaves();
      previousFalloff = pInst._getNoiseAmpFalloff();
      if (octaves !== undefined) {
        pInst.noiseDetail(octaves, falloff ?? previousFalloff);
      }
      return pInst.noise(...input);
    } finally {
      if (octaves !== undefined && previousOctaves !== undefined) {
        pInst.noiseDetail(previousOctaves, previousFalloff);
      }
    }
  };

  const callBuiltin = (name, args) => {
    const nums = args.map(a => (Array.isArray(a) ? a : Number(a)));
    switch (name) {
      case 'abs':
        return Array.isArray(args[0]) ? args[0].map(Math.abs) : Math.abs(args[0]);
      case 'floor':
        return Array.isArray(args[0])
          ? args[0].map(Math.floor)
          : Math.floor(args[0]);
      case 'ceil':
        return Array.isArray(args[0]) ? args[0].map(Math.ceil) : Math.ceil(args[0]);
      case 'fract':
        return Array.isArray(args[0])
          ? args[0].map(v => v - Math.floor(v))
          : args[0] - Math.floor(args[0]);
      case 'sign':
        return Array.isArray(args[0])
          ? args[0].map(Math.sign)
          : Math.sign(args[0]);
      case 'sqrt':
        return Array.isArray(args[0]) ? args[0].map(Math.sqrt) : Math.sqrt(args[0]);
      case 'inversesqrt':
        return Array.isArray(args[0])
          ? args[0].map(v => 1 / Math.sqrt(v))
          : 1 / Math.sqrt(args[0]);
      case 'exp':
        return Array.isArray(args[0]) ? args[0].map(Math.exp) : Math.exp(args[0]);
      case 'exp2':
        return Array.isArray(args[0])
          ? args[0].map(v => 2 ** v)
          : 2 ** args[0];
      case 'log':
        return Array.isArray(args[0]) ? args[0].map(Math.log) : Math.log(args[0]);
      case 'log2':
        return Array.isArray(args[0])
          ? args[0].map(Math.log2)
          : Math.log2(args[0]);
      case 'sin':
        return Array.isArray(args[0]) ? args[0].map(Math.sin) : Math.sin(args[0]);
      case 'cos':
        return Array.isArray(args[0]) ? args[0].map(Math.cos) : Math.cos(args[0]);
      case 'tan':
        return Array.isArray(args[0]) ? args[0].map(Math.tan) : Math.tan(args[0]);
      case 'asin':
        return Array.isArray(args[0]) ? args[0].map(Math.asin) : Math.asin(args[0]);
      case 'acos':
        return Array.isArray(args[0]) ? args[0].map(Math.acos) : Math.acos(args[0]);
      case 'atan':
        return args.length === 2 ? Math.atan2(args[0], args[1]) : Math.atan(args[0]);
      case 'sinh':
        return Array.isArray(args[0]) ? args[0].map(Math.sinh) : Math.sinh(args[0]);
      case 'cosh':
        return Array.isArray(args[0]) ? args[0].map(Math.cosh) : Math.cosh(args[0]);
      case 'tanh':
        return Array.isArray(args[0]) ? args[0].map(Math.tanh) : Math.tanh(args[0]);
      case 'asinh':
        return Array.isArray(args[0]) ? args[0].map(Math.asinh) : Math.asinh(args[0]);
      case 'acosh':
        return Array.isArray(args[0]) ? args[0].map(Math.acosh) : Math.acosh(args[0]);
      case 'atanh':
        return Array.isArray(args[0]) ? args[0].map(Math.atanh) : Math.atanh(args[0]);
      case 'pow': {
        const [base, exponent] = args;
        if (Array.isArray(base) || Array.isArray(exponent)) {
          const bases = asComponents(base);
          const exponents = asComponents(exponent);
          const n = Math.max(bases.length, exponents.length);
          return Array.from({ length: n }, (_, i) =>
            Math.pow(
              bases.length === 1 ? bases[0] : bases[i],
              exponents.length === 1 ? exponents[0] : exponents[i]
            )
          );
        }
        return Math.pow(base, exponent);
      }
      case 'mod':
        return args[0] - args[1] * Math.floor(args[0] / args[1]);
      case 'min':
      case 'max': {
        const op = name === 'min' ? Math.min : Math.max;
        return args.reduce((a, b) => {
          if (!Array.isArray(a) && !Array.isArray(b)) return op(a, b);
          const as = asComponents(a);
          const bs = asComponents(b);
          const n = Math.max(as.length, bs.length);
          return Array.from({ length: n }, (_, i) =>
            op(as.length === 1 ? as[0] : as[i], bs.length === 1 ? bs[0] : bs[i])
          );
        });
      }
      case 'clamp': {
        const [v, lo, hi] = args;
        const los = asComponents(lo);
        const his = asComponents(hi);
        if (!Array.isArray(v)) {
          return Math.min(Math.max(v, los[0]), his[0]);
        }
        return v.map((x, i) =>
          Math.min(
            Math.max(x, los.length === 1 ? los[0] : los[i]),
            his.length === 1 ? his[0] : his[i]
          )
        );
      }
      case 'mix': {
        const [x, y, a] = args;
        if (typeof a === 'boolean') return a ? y : x;
        const lerp = (u, v, t) => u * (1 - t) + v * t;
        if (Array.isArray(x) || Array.isArray(y) || Array.isArray(a)) {
          const xs = asComponents(x);
          const ys = asComponents(y);
          const as = asComponents(a);
          const n = Math.max(xs.length, ys.length);
          return Array.from({ length: n }, (_, i) =>
            lerp(
              xs.length === 1 ? xs[0] : xs[i],
              ys.length === 1 ? ys[0] : ys[i],
              as.length === 1 ? as[0] : as[i]
            )
          );
        }
        return lerp(x, y, a);
      }
      case 'step':
        return args[1] < args[0] ? 0 : 1;
      case 'smoothstep': {
        const [e0, e1, x] = nums;
        const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
        return t * t * (3 - 2 * t);
      }
      case 'length':
        return Math.hypot(...asComponents(args[0]));
      case 'distance':
        return Math.hypot(
          ...asComponents(args[0]).map((v, i) => v - asComponents(args[1])[i])
        );
      case 'dot':
        return asComponents(args[0]).reduce(
          (sum, v, i) => sum + v * asComponents(args[1])[i],
          0
        );
      case 'cross': {
        const [a, b] = args.map(asComponents);
        return [
          a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[1] * b[0] - a[0] * b[1]
        ];
      }
      case 'normalize': {
        const v = asComponents(args[0]);
        const len = Math.hypot(...v) || 1;
        return v.map(x => x / len);
      }
      case 'reflect': {
        const i = asComponents(args[0]);
        const n = asComponents(args[1]);
        const d = i.reduce((s, v, k) => s + v * n[k], 0);
        return i.map((v, k) => v - 2 * d * n[k]);
      }
      case 'degrees':
        return Array.isArray(args[0])
          ? args[0].map(v => (v * 180) / Math.PI)
          : (args[0] * 180) / Math.PI;
      case 'radians':
        return Array.isArray(args[0])
          ? args[0].map(v => (v * Math.PI) / 180)
          : (args[0] * Math.PI) / 180;
      case 'random':
        return randomValue(args[0]);
      case 'noise':
        return noiseValue(args);
      case 'getTexture':
      case 'textureSampleLevel':
        return FES.userError(
          'type error',
          'Textures cannot be sampled in the CPU compute fallback. ' +
          'Use the WebGPU renderer for shaders that read textures.'
        );
      default:
        FES.userError(
          'type error',
          `Function "${name}" is not supported in the CPU compute fallback.`
        );
    }
  };

  return {
    state,
    vec,
    binop,
    unop,
    swiz,
    swizSet,
    truncIndex,
    readFieldValue,
    writeFieldValue,
    writeSwiz,
    call: callBuiltin
  };
}

function storageNamesOf(cpuIR) {
  const names = new Set();
  for (const { name, typeInfo } of cpuIR.uniforms) {
    if (typeInfo.baseType === 'storage') names.add(name);
  }
  return names;
}

function scalarNamesOf(cpuIR) {
  const names = new Set();
  for (const { name, typeInfo } of cpuIR.uniforms) {
    if (typeInfo.baseType !== 'storage' && typeInfo.baseType !== 'sampler2D') {
      names.add(name);
    }
  }
  return names;
}

function fieldsOf(cpuIR) {
  const fields = {};
  for (const { name, typeInfo } of cpuIR.uniforms) {
    if (typeInfo.schema) {
      fields[name] = typeInfo.schema.fields.map(f => ({ name: f.name, dim: f.dim }));
    }
  }
  return fields;
}

function fieldLiteral(g, bufferName, fieldName) {
  const field = (g.fields[bufferName] || []).find(f => f.name === fieldName);
  if (!field) {
    throw new Error(
      `Internal error: "${bufferName}" has no field "${fieldName}" in the CPU backend.`
    );
  }
  return JSON.stringify(field);
}

function emitExpression(g, dag, nodeID) {
  if (g.tempNames[nodeID] !== undefined) return g.tempNames[nodeID];
  const node = getNodeDataFromID(dag, nodeID);
  switch (node.nodeType) {
    case NodeType.LITERAL:
    case NodeType.CONSTANT:
      if (node.baseType === BaseType.BOOL) return node.value ? 'true' : 'false';
      return Number(node.value).toString();
    case NodeType.VARIABLE: {
      if (node.identifier === INDEX_PARAM) return '__idx';
      if (g.stores.has(node.identifier)) return `__s[${JSON.stringify(node.identifier)}]`;
      if (g.scalars.has(node.identifier)) return `__u[${JSON.stringify(node.identifier)}]`;
      if (
        node.identifier === 'instanceID' ||
        node.identifier === 'gl_InstanceID'
      ) {
        throw new Error(
          'Use `index` (not `instanceIndex`) inside `buildComputeShader`.'
        );
      }
      return `__v[${JSON.stringify(node.identifier)}]`;
    }
    case NodeType.OPERATION: {
      if (node.opCode === OpCode.Nary.CONSTRUCTOR) {
        if (node.baseType === BaseType.SAMPLER2D || node.baseType === BaseType.SAMPLER) {
          throw new Error(
            'Textures cannot be sampled in the CPU compute fallback. Use the WebGPU renderer for shaders that read textures.'
          );
        }
        if (
          node.baseType !== BaseType.FLOAT &&
          node.baseType !== BaseType.INT &&
          node.baseType !== BaseType.BOOL
        ) {
          throw new Error(
            `Cannot construct "${node.baseType}" in the CPU compute fallback.`
          );
        }
        const deps = (node.dependsOn || []).map(dep => emitExpression(g, dag, dep));
        return `H.vec(${JSON.stringify(node.baseType)}, ${node.dimension}, [${deps.join(', ')}])`;
      }
      if (node.opCode === OpCode.Nary.FUNCTION_CALL) {
        return emitFunctionCall(g, dag, node);
      }
      if (node.opCode === OpCode.Nary.TERNARY) {
        const [condID, trueID, falseID] = node.dependsOn;
        return `(${emitExpression(g, dag, condID)} ? ${emitExpression(g, dag, trueID)} : ${emitExpression(g, dag, falseID)})`;
      }
      if (node.opCode === OpCode.Binary.MEMBER_ACCESS) {
        const [parentID, memberID] = node.dependsOn;
        const member = getNodeDataFromID(dag, memberID);
        if (member.nodeType === NodeType.VARIABLE && member.identifier) {
          return `H.member(${emitExpression(g, dag, parentID)}, ${JSON.stringify(member.identifier)})`;
        }
        throw new Error(
          'Unsupported member access in the CPU compute fallback.'
        );
      }
      if (node.opCode === OpCode.Unary.SWIZZLE) {
        const parent = emitExpression(g, dag, node.dependsOn[0]);
        return `H.swiz(${parent}, ${JSON.stringify(node.swizzle)})`;
      }
      if (node.opCode === OpCode.Binary.ARRAY_ACCESS) {
        return emitArrayRead(g, dag, node);
      }
      if (
        node.opCode === OpCode.Unary.LOGICAL_NOT ||
        node.opCode === OpCode.Unary.NEGATE ||
        node.opCode === OpCode.Unary.PLUS
      ) {
        return `H.unop(${node.opCode}, ${emitExpression(g, dag, node.dependsOn[0])})`;
      }
      if (typeof node.opCode === 'number') {
        const [leftID, rightID] = node.dependsOn;
        const base = node.baseType === 'storage' ? BaseType.FLOAT : node.baseType;
        return `H.binop(${node.opCode}, ${emitExpression(g, dag, leftID)}, ${emitExpression(g, dag, rightID)}, ${JSON.stringify(base)}, ${node.dimension})`;
      }
      throw new Error(
        `Unsupported operation (${node.opCode}) in the CPU compute fallback.`
      );
    }
    case NodeType.PHI: {
      if (g.tempNames[nodeID] !== undefined) return g.tempNames[nodeID];
      const inputs = (node.dependsOn || []).filter(id => id !== null);
      if (inputs.length > 0) return emitExpression(g, dag, inputs[0]);
      throw new Error('Cannot evaluate an empty phi node in the CPU compute fallback.');
    }
    default:
      throw new Error(
        `Cannot evaluate node type "${node.nodeType}" in the CPU compute fallback.`
      );
  }
}

function bufferNameOf(dag, bufferID, g) {
  const buffer = getNodeDataFromID(dag, bufferID);
  if (buffer.nodeType !== NodeType.VARIABLE || !g.stores.has(buffer.identifier)) {
    throw new Error(
      'Storage access must use a buffer from `uniformStorage()` in the CPU compute fallback.'
    );
  }
  return buffer.identifier;
}

function emitArrayRead(g, dag, node) {
  const [bufferID, indexID] = node.dependsOn;
  const name = bufferNameOf(dag, bufferID, g);
  const index = emitExpression(g, dag, indexID);
  if (node.identifier) {
    return `H.readFieldValue(__s[${JSON.stringify(name)}], ${index}, ${fieldLiteral(g, name, node.identifier)})`;
  }
  return `__s[${JSON.stringify(name)}].data[H.truncIndex(${index})]`;
}

function emitFunctionCall(g, dag, node) {
  const args = (node.dependsOn || []).map(dep => emitExpression(g, dag, dep));
  const name = node.identifier;
  if (name === 'mod' && args.length === 2) {
    return `H.call("mod", [${args.join(', ')}])`;
  }
  if (name === 'atan' && args.length === 2) {
    return `H.call("atan", [${args.join(', ')}])`;
  }
  if (name.startsWith('_p5_push_')) {
    const listName = name.slice('_p5_push_'.length);
    return `H.pushList(__s[${JSON.stringify(listName)}], ${args[0]})`;
  }
  if (name.startsWith('_p5_length_')) {
    const listName = name.slice('_p5_length_'.length);
    return `H.lenList(__s[${JSON.stringify(listName)}])`;
  }
  if (name.startsWith('_p5_pop_')) {
    const listName = name.slice('_p5_pop_'.length);
    return `H.popList(__s[${JSON.stringify(listName)}])`;
  }
  const listBase = name.endsWith('Element') ? name.slice(0, -'Element'.length) : null;
  if (listBase && g.stores.has(listBase)) {
    const fields = g.fields[listBase] || [];
    return `H.makeStruct([${fields.map(f => JSON.stringify(f.name)).join(', ')}], [${args.join(', ')}])`;
  }
  if (GLSL_TYPE_TO_INFO[name]) {
    const [base, dim] = GLSL_TYPE_TO_INFO[name];
    return `H.vec(${JSON.stringify(base)}, ${dim}, [${args.join(', ')}])`;
  }
  return `H.call(${JSON.stringify(name)}, [${args.join(', ')}])`;
}

function emitDeclaration(g, dag, nodeID) {
  // NOTE: the name is recorded only after the expression is emitted, so the
  // expression can never resolve to its own temporary (`let t = t`).
  const code = emitExpression(g, dag, nodeID);
  const tmp = `${TEMP_PREFIX}${g.nextTempID++}`;
  g.tempNames[nodeID] = tmp;
  return `let ${tmp} = ${code};`;
}

function emitAssignStatement(g, dag, nodeID) {
  const node = getNodeDataFromID(dag, nodeID);
  const targetID = node.dependsOn[0];
  const sourceID = node.dependsOn[1];
  const source = emitExpression(g, dag, sourceID);
  const target = getNodeDataFromID(dag, targetID);
  if (target.nodeType === NodeType.VARIABLE) {
    return `__v[${JSON.stringify(target.identifier)}] = ${source};`;
  }
  if (target.nodeType === NodeType.PHI) {
    if (g.tempNames[targetID] === undefined) {
      throw new Error('Internal error: phi target has no temporary in the CPU backend.');
    }
    return `${g.tempNames[targetID]} = ${source};`;
  }
  if (
    target.nodeType === NodeType.OPERATION &&
    target.opCode === OpCode.Binary.ARRAY_ACCESS
  ) {
    const [bufferID, indexID] = target.dependsOn;
    const name = bufferNameOf(dag, bufferID, g);
    const index = emitExpression(g, dag, indexID);
    if (target.identifier) {
      return `H.writeFieldValue(__s[${JSON.stringify(name)}], ${index}, ${fieldLiteral(g, name, target.identifier)}, ${source});`;
    }
    return `__s[${JSON.stringify(name)}].data[H.truncIndex(${index})] = ${source};`;
  }
  if (
    target.nodeType === NodeType.OPERATION &&
    target.opCode === OpCode.Unary.SWIZZLE
  ) {
    return emitSwizzleAssign(g, dag, target, source);
  }
  throw new Error(
    `Cannot assign to node type "${target.nodeType}" in the CPU compute fallback.`
  );
}

function emitSwizzleAssign(g, dag, target, source) {
  const parentID = target.dependsOn[0];
  const parent = getNodeDataFromID(dag, parentID);
  const pattern = JSON.stringify(target.swizzle);
  if (parent.nodeType === NodeType.VARIABLE) {
    const name = JSON.stringify(parent.identifier);
    return `__v[${name}] = H.swizSet(__v[${name}], ${pattern}, ${source});`;
  }
  if (
    parent.nodeType === NodeType.OPERATION &&
    parent.opCode === OpCode.Binary.ARRAY_ACCESS
  ) {
    const [bufferID, indexID] = parent.dependsOn;
    const bufferName = bufferNameOf(dag, bufferID, g);
    const index = emitExpression(g, dag, indexID);
    const field = parent.identifier
      ? fieldLiteral(g, bufferName, parent.identifier)
      : 'null';
    return `H.writeSwiz(__s[${JSON.stringify(bufferName)}], ${index}, ${field}, ${pattern}, ${source});`;
  }
  throw new Error(
    'Cannot assign to a swizzle of a temporary value in the CPU compute fallback.'
  );
}

function emitStatement(g, dag, nodeID) {
  const node = getNodeDataFromID(dag, nodeID);
  const suffix = g.suppressSemicolon ? '' : ';';
  if (node.statementType === StatementType.BREAK) return `break${suffix}`;
  if (node.statementType === StatementType.EMPTY) return suffix;
  if (node.statementType === StatementType.DISCARD) {
    throw new Error('`discard` cannot be used inside a compute shader.');
  }
  if (node.statementType === StatementType.EARLY_RETURN) {
    if (node.dependsOn && node.dependsOn.length > 0) {
      return `return ${emitExpression(g, dag, node.dependsOn[0])}${suffix}`;
    }
    return `return${suffix}`;
  }
  if (node.statementType === StatementType.EXPRESSION) {
    return `${emitExpression(g, dag, node.dependsOn[0])}${suffix}`;
  }
  throw new Error(
    `Unsupported statement type "${node.statementType}" in the CPU compute fallback.`
  );
}

function emitBlockInstructions(g, cpuIR, blockID) {
  const { dag, cfg } = cpuIR;
  for (const nodeID of cfg.blockInstructions[blockID] || []) {
    const nodeType = dag.nodeTypes[nodeID];
    if (shouldCreateTemp(dag, nodeID)) {
      g.write(emitDeclaration(g, dag, nodeID));
    }
    if (nodeType === NodeType.STATEMENT) {
      g.write(emitStatement(g, dag, nodeID));
    }
    if (nodeType === NodeType.ASSIGNMENT) {
      g.write(emitAssignStatement(g, dag, nodeID));
    }
  }
}

function assignPhiNodeValues(g, cpuIR, blockID) {
  const { dag, cfg } = cpuIR;
  for (const successorID of cfg.outgoingEdges[blockID] || []) {
    for (const nodeID of cfg.blockInstructions[successorID] || []) {
      const node = getNodeDataFromID(dag, nodeID);
      if (node.nodeType !== NodeType.PHI) continue;
      const branchIndex = (node.phiBlocks || []).indexOf(blockID);
      if (branchIndex !== -1 && branchIndex < (node.dependsOn || []).length) {
        const sourceID = node.dependsOn[branchIndex];
        const tempName = g.tempNames[nodeID];
        if (tempName && sourceID !== null) {
          g.write(`${tempName} = ${emitExpression(g, dag, sourceID)};`);
        }
      }
    }
  }
}

function matchScopeEnd(sorted, from) {
  let depth = 0;
  for (let i = from; i < sorted.blocks.length; i++) {
    const type = sorted.types[i];
    if (type === BlockType.SCOPE_START) depth += 1;
    if (type === BlockType.SCOPE_END) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error('Internal error: unterminated scope in the CPU backend.');
}

// Collect `if`/`else if`/`else` branches starting at `at`: each entry holds
// the condition block (or null for `else`) and the [start, end] range of its
// scoped body within the sorted block list.
function collectBranches(sorted, at) {
  const branches = [];
  let i = at;
  while (i < sorted.blocks.length) {
    const type = sorted.types[i];
    if (type !== BlockType.IF_COND && type !== BlockType.ELSE_COND) break;
    if (sorted.blocks[i + 1] === undefined || sorted.types[i + 1] !== BlockType.SCOPE_START) {
      throw new Error('Internal error: expected a scope after a condition in the CPU backend.');
    }
    const end = matchScopeEnd(sorted, i + 1);
    branches.push({ cond: i, start: i + 1, end });
    i = end + 1;
  }
  return branches;
}

function emitRange(g, cpuIR, sorted, at, end) {
  let i = at;
  while (i < end) {
    const blockID = sorted.blocks[i];
    const type = sorted.types[i];
    if (type === BlockType.IF_COND || type === BlockType.ELSE_COND) {
      const branches = collectBranches(sorted, i);
      // Emit `if`/`else if`/`else` exactly like the GLSL backend structures them.
      branches.forEach((branch, index) => {
        if (sorted.types[branch.cond] === BlockType.IF_COND) {
          const condID = cpuIR.cfg.blockConditions[sorted.blocks[branch.cond]];
          const prefix = index === 0 ? 'if' : '} else if';
          g.write(`${prefix} (${emitExpression(g, cpuIR.dag, condID)}) {`);
        } else {
          g.write('} else {');
        }
        g.indent += 1;
        emitRange(g, cpuIR, sorted, branch.start, branch.end + 1);
        g.indent -= 1;
      });
      g.write('}');
      i = branches[branches.length - 1].end + 1;
      continue;
    }
    if (type === BlockType.FOR) {
      i = emitFor(g, cpuIR, sorted, i);
      continue;
    }
    emitBlock(g, cpuIR, sorted, blockID);
    i += 1;
  }
  return i;
}

function emitBlock(g, cpuIR, sorted, blockID) {
  const { dag, cfg } = cpuIR;
  const type = cfg.blockTypes[blockID];
  if (type === BlockType.SCOPE_START) {
    g.write('{');
    g.indent += 1;
    return;
  }
  if (type === BlockType.SCOPE_END) {
    g.indent -= 1;
    g.write('}');
    return;
  }
  if (type === BlockType.BRANCH) {
    for (const nodeID of cfg.blockInstructions[blockID] || []) {
      const node = getNodeDataFromID(dag, nodeID);
      if (node.nodeType !== NodeType.PHI) continue;
      const dependsOn = node.dependsOn || [];
      if (dependsOn.length > 0) {
        const existing = g.tempNames[dependsOn[0]];
        if (existing) {
          g.tempNames[nodeID] = existing;
          continue;
        }
      }
      const tmp = `${TEMP_PREFIX}${g.nextTempID++}`;
      g.tempNames[nodeID] = tmp;
      g.write(`let ${tmp};`);
    }
  }
  emitBlockInstructions(g, cpuIR, blockID);
  if (type === BlockType.IF_BODY) {
    assignPhiNodeValues(g, cpuIR, blockID);
  }
}

function emitFor(g, cpuIR, sorted, at) {
  const { dag, cfg } = cpuIR;
  const blockID = sorted.blocks[at];
  const instructions = cfg.blockInstructions[blockID] || [];
  const parts = instructions.map(nodeID => {
    const node = getNodeDataFromID(dag, nodeID);
    if (node.nodeType === NodeType.STATEMENT && node.statementType === StatementType.EMPTY) {
      return '';
    }
    if (node.nodeType === NodeType.STATEMENT) {
      return emitExpression(g, dag, node.dependsOn[0]);
    }
    const target = getNodeDataFromID(dag, node.dependsOn[0]);
    const source = emitExpression(g, dag, node.dependsOn[1]);
    if (target.nodeType === NodeType.VARIABLE) {
      return `__v[${JSON.stringify(target.identifier)}] = ${source}`;
    }
    if (target.nodeType === NodeType.PHI) {
      if (g.tempNames[node.dependsOn[0]] === undefined) {
        throw new Error('Internal error: phi target has no temporary in the CPU backend.');
      }
      return `${g.tempNames[node.dependsOn[0]]} = ${source}`;
    }
    throw new Error(
      'Only variable assignments are supported in loop headers of the CPU compute fallback.'
    );
  });
  while (parts.length < 3) parts.push('');
  g.write(`for (${parts[0]}; ${parts[1]}; ${parts[2]}) {`);
  g.indent += 1;
  // The loop body is the scoped range right after the FOR block.
  if (sorted.types[at + 1] !== BlockType.SCOPE_START) {
    throw new Error('Internal error: expected a scope after a loop in the CPU backend.');
  }
  const end = matchScopeEnd(sorted, at + 1);
  emitRange(g, cpuIR, sorted, at + 1, end + 1);
  g.indent -= 1;
  g.write('}');
  return end + 1;
}

export function compileCpuComputeHook(cpuIR) {
  const computeHook = cpuIR.hooks.find(h => h.shaderContext === 'compute');
  if (!computeHook) {
    FES.userError(
      'type error',
      'compute() can only be called with a compute shader. ' +
        'Build one with `buildComputeShader()`.'
    );
  }

  const g = {
    indent: 1,
    codeLines: [],
    write(line) {
      this.codeLines.push('  '.repeat(this.indent) + line);
    },
    tempNames: {},
    nextTempID: 0,
    suppressSemicolon: false,
    stores: storageNamesOf(cpuIR),
    scalars: scalarNamesOf(cpuIR),
    fields: fieldsOf(cpuIR)
  };

  const sortedIDs = sortCFG(cpuIR.cfg.outgoingEdges, computeHook.entryBlockID);
  const sorted = {
    blocks: sortedIDs,
    types: sortedIDs.map(id => cpuIR.cfg.blockTypes[id])
  };
  emitRange(g, cpuIR, sorted, 0, sortedIDs.length);
  const { hookType } = computeHook;
  let returnType = null;
  if (hookType.returnType?.typeName?.trim() !== 'void') {
    returnType = hookType.returnType;
  }
  if (returnType) {
    g.write(`return ${emitExpression(g, cpuIR.dag, computeHook.rootNodeID)};`);
  }
  const factory = new Function(
    '__idx',
    '__s',
    '__u',
    '__v',
    'H',
    g.codeLines.join('\n')
  );
  return factory;
}

function resolveStores(shader) {
  const stores = {};
  for (const [name, initializer] of Object.entries(shader.hooks.storageUniforms)) {
    const value = initializer instanceof Function ? initializer() : initializer;
    if (value === undefined || value === null) {
      FES.userError(
        'type error',
        `Storage "${name}" has no buffer bound for the CPU compute fallback. ` +
          'Pass a `createStorage()` buffer or a function returning one to `uniformStorage()`.'
      );
    }
    stores[name] = value;
  }
  // `setUniform()` overrides resolved initializers, mirroring the GPU path.
  for (const [name, uniform] of Object.entries(shader.uniforms || {})) {
    const data = uniform._cachedData;
    if (data?._isStorageBuffer || data?._isStorageList) {
      if (data?._isStorageBuffer || data?._isStorageList) {
        stores[name] = data;
      }
    }
  }
  return stores;
}

function resolveScalars(cpuIR) {
  const scalars = {};
  for (const { name, typeInfo, defaultValue } of cpuIR.uniforms) {
    if (typeInfo.baseType === 'storage') continue;
    if (typeInfo.baseType === 'sampler2D' || typeInfo.baseType === 'sampler') {
      FES.userError(
        'type error',
        'Textures cannot be sampled in the CPU compute fallback. ' +
        'Use the WebGPU renderer for shaders that read textures.'
      );
    }
    const value = defaultValue instanceof Function ? defaultValue() : defaultValue;
    scalars[name] = toPlainValue(value);
  }
  return scalars;
}

// Run a compute shader on the CPU: resolve buffers and uniforms once, then
// execute the compiled iteration function for every index.
export function runCpuCompute(shader, x, y=1, z=1) {
  const cpuIR = shader._cpuIR;
  if(!cpuIR){
    FES.internalError(
      'Missing recorded program for the CPU compute fallback.'
    );
  }
  const total = x*y*z;
  if (!Number.isInteger(total) || total < 0) {
    FES.userError(
      'type error',
      `compute() counts must be non-negative integers. Got (${x}, ${y}, ${z}).`
    );
  }
  if (!shader._cpuComputeFn) {
    shader._cpuComputeFn = compileCpuComputeHook(cpuIR);
  }
  const stores = resolveStores(shader);
  const scalars = resolveScalars(cpuIR);
  const pInst = shader._renderer._pInst;
  const helpers = createCpuHelpers(pInst);
  // Storage-list helpers need buffer access plus struct layouts.
  helpers.pushList = (list, value) => listPush(list, value, pInst);
  helpers.popList = list => listPop(list);
  helpers.lenList = list => listLength(list);
  helpers.makeStruct = (fields, args) => Object.fromEntries(fields.map((f, i) => [f, args[i]]));
  helpers.member = (object, key) => {
    if (object !== null && typeof object === 'object' && key in object) {
      return object[key];
    }
    FES.internalError(
      `Cannot read property "${key}" in the CPU compute fallback.`
    );
  };
  for (let flat = 0; flat < total; flat++) {
    const index = [
      flat % x,
      Math.floor(flat / x) % Math.max(y, 1),
      Math.floor(flat / (x * Math.max(y, 1)))
    ];
    helpers.state.flat = flat;
    helpers.state.randomCalls = 0;
    shader._cpuComputeFn(index, stores, scalars, {}, helpers);
  }

  // Mark every bound store mutated so render-path data textures re-upload.
  for (const store of Object.values(stores)) {
    if (store !== null && typeof store === 'object') {
      store._cpuVersion = (store._cpuVersion | 0) + 1;
    }
  }
}

function listLength(list) {
  if (list === null || typeof list !== 'object' || !list._isStorageList) {
    FES.userError(
      'type error',
      '`length` can only be read on a `createStorageList()` list.'
    );
  }
  return list.items.length;
}

function listPush(list, value, pInst) {
  if (list === null || typeof list !== 'object' || !list._isStorageList) {
    FES.userError(
      'type error',
      '`push()` can only be used on a `createStorageList()` list.'
    );
  }
  list.push(convertPushedValue(list, value, pInst));
}

function listPop(list) {
  if (list === null || typeof list !== 'object' || !list._isStorageList) {
    FES.userError(
      'type error',
      '`pop()` can only be used on a `createStorageList()` list.'
    );
  }
  if (list.items.length === 0) {
    FES.userError(
      'type error',
      '`pop()` called on an empty storage list.'
    );
  }
  return list.items.pop();
}

function convertPushedValue(list, value, pInst) {
  if (!list._schema) {
    if (typeof value !== 'number') {
      FES.userError(
        'type error',
        'Float StorageList.push() expects a number'
      );
    }
    return value;
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    FES.userError(
      'type error',
      'StorageList.push() expects a plain object matching the list schema.'
    );
  }
  const out = {};
  for (const field of list._schema.fields) {
    const fieldValue = value[field.name];
    if (fieldValue === undefined) {
      FES.userError(
        'type error',
        `StorageList.push() is missing field "${field.name}".`
      );
    }
    out[field.name] = convertFieldForStore(field, fieldValue, pInst);
  }
  return out;
}

function convertFieldForStore(field, value, pInst) {
  if (field.kind === 'vector') {
    if (value?.isVector) return value;
    const parts = Array.isArray(value) ? value : [value];
    return pInst.createVector(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0);
  }
  if (field.kind === 'color') {
    if (value?.isColor) return value;
    return pInst.color(value[0], value[1], value[2], value[3]);
  }
  if (field.dim > 1) {
    return Array.isArray(value) ? value.slice(0, field.dim) : [value];
  }
  return Number(value);
}
