import { sortCFG } from '../strands/ir_cfg';
import { BaseType, OpCode } from '../strands/ir_types';
import * as FES from '../strands/strands_FES';

const CPU_COMPUTE_WARN_ITEMS = 4096;

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

  const { hookType } = computehook;
  let returnType = null;
  if (hookType.returnType?.typeName?.trim() !== 'void') {
    returnType = hookType.returnType;
  }
  const sortedIDs = sortCFG(cpuIR.cfg.outgoingEdges, computeHook.entryBlockID)
  const sorted = {
    blocks: sortedIDs,
    types: sortedIDs.map(id => cpuIR.cfg.blockTypes[id])
  };
  emitRange(g, cpuIR, sorted, 0, sortedIDs.length);
  const factory = new Function(
    '__idx',
    '__s',
    '__u',
    '__v',
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
    throw new Error(`compute() counts must be non-negative integers. Got (${x}, ${y}, ${z}).`);
  }
  if (total > CPU_COMPUTE_WARN_ITEMS) {
    console.warn(
      `[p5.strands] compute() dispatched ${total} iterations on the CPU fallback, ` +
        `which will be slow. Consider fewer items when running without WebGPU.`
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
    throw new Error(
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
    shader._cpuComputeFn(index, stores, scalars, {});
  }

  // Mark every bound store mutated so render-path data textures re-upload.
  for (const store of Object.values(stores)) {
    if (store !== null && typeof store === 'object') {
      store._cpuVersion = (store._cpuVersion | 0) + 1;
    }
  }
}
