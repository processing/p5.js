import { Renderer3D } from '../core/p5.Renderer3D';
import { Shader } from '../webgl/p5.Shader';
import * as constants from '../core/constants';
import { colorVertexShader, colorFragmentShader } from './shaders/color';
import { lineVertexShader, lineFragmentShader} from './shaders/line';

class RendererWebGPU extends Renderer3D {
  constructor(pInst, w, h, isMainCanvas, elt) {
    super(pInst, w, h, isMainCanvas, elt)

    this.renderPass = {};

    this.samplers = new Map();
  }

  async setupContext() {
    this.adapter = await navigator.gpu?.requestAdapter();
    this.device = await this.adapter?.requestDevice();
    if (!this.device) {
      throw new Error('Your browser does not support WebGPU.');
    }
    this.queue = this.device.queue;
    this.drawingContext = this.canvas.getContext('webgpu');
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    this.drawingContext.configure({
      device: this.device,
      format: this.presentationFormat
    });

    // TODO disablable stencil
    this.depthFormat = 'depth24plus-stencil8';
    this._updateSize();
  }

  _updateSize() {
    if (this.depthTexture && this.depthTexture.destroy) {
      this.depthTexture.destroy();
    }
    this.depthTexture = this.device.createTexture({
      size: {
        width: Math.ceil(this.width * this._pixelDensity),
        height: Math.ceil(this.height * this._pixelDensity),
        depthOrArrayLayers: 1,
      },
      format: this.depthFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  clear(...args) {
    const _r = args[0] || 0;
    const _g = args[1] || 0;
    const _b = args[2] || 0;
    const _a = args[3] || 0;

    const commandEncoder = this.device.createCommandEncoder();
    const textureView = this.drawingContext.getCurrentTexture().createView();

    const colorAttachment = {
      view: textureView,
      clearValue: { r: _r * _a, g: _g * _a, b: _b * _a, a: _a },
      loadOp: 'clear',
      storeOp: 'store',
    };

    const depthTextureView = this.depthTexture?.createView();
    const depthAttachment = depthTextureView
      ? {
        view: depthTextureView,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
        stencilLoadOp: 'load',
        stencilStoreOp: 'store',
      }
      : undefined;

    const renderPassDescriptor = {
      colorAttachments: [colorAttachment],
      ...(depthAttachment ? { depthStencilAttachment: depthAttachment } : {}),
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end();

    this.queue.submit([commandEncoder.finish()]);
  }

  _prepareBuffer(renderBuffer, geometry, shader) {
    const attr = shader.attributes[renderBuffer.attr];
    if (!attr) return;

    const { src, dst, size, map } = renderBuffer;

    const device = this.device;
    const buffers = this._getOrMakeCachedBuffers(geometry);
    let srcData = geometry[src];
    if (!srcData || srcData.length === 0) {
      if (renderBuffer.default) {
        srcData = geometry[src] = renderBuffer.default(geometry);
        srcData.isDefault = true;
      } else {
        return;
      }
    }

    const raw = map ? map(srcData) : srcData;
    const typed = this._normalizeBufferData(raw, Float32Array);

    let buffer = buffers[dst];
    let recreated = false;
    if (!buffer || buffer.size < typed.byteLength) {
      recreated = true;
      if (buffer) buffer.destroy();
      buffer = device.createBuffer({
        size: typed.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      buffers[dst] = buffer;
    }

    if (recreated || geometry.dirtyFlags[src] !== false) {
      device.queue.writeBuffer(buffer, 0, typed);
      geometry.dirtyFlags[src] = false;
    }

    shader.enableAttrib(attr, size);
  }

  _disableRemainingAttributes(shader) {}

  _enableAttrib(attr) {
    // TODO: is this necessary?
    const loc = attr.location;
    if (!this.registerEnabled.has(loc)) {
      // TODO
      // this.renderPass.setVertexBuffer(loc, buffer);
      this.registerEnabled.add(loc);
    }
  }

  _ensureGeometryBuffers(buffers, indices, indexType) {
    if (!indices) return;

    const device = this.device;

    const buffer = device.createBuffer({
      size: indices.length * indexType.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    // Write index data to buffer
    const mapping = new indexType(buffer.getMappedRange());
    mapping.set(indices);
    buffer.unmap();

    buffers.indexBuffer = buffer;
    buffers.indexBufferType = indexType === Uint32Array ? 'uint32' : 'uint16';
  }

  _freeBuffers(buffers) {
    const destroyIfExists = (buf) => {
      if (buf && buf.destroy) {
        buf.destroy();
      }
    };

    destroyIfExists(buffers.indexBuffer);

    const freeDefs = (defs) => {
      for (const def of defs) {
        destroyIfExists(buffers[def.dst]);
        buffers[def.dst] = null;
      }
    };

    freeDefs(this.renderer.buffers.stroke);
    freeDefs(this.renderer.buffers.fill);
    freeDefs(this.renderer.buffers.user);
  }

  _shaderOptions({ mode }) {
    return {
      topology: mode === constants.TRIANGLE_STRIP ? 'triangle-strip' : 'triangle-list',
      blendMode: this.states.curBlendMode,
      sampleCount: (this.activeFramebuffer() || this).antialias || 1, // TODO
      format: this.activeFramebuffer()?.format || this.presentationFormat, // TODO
    }
  }

  _initShader(shader) {
    const device = this.device;

    shader.vertModule = device.createShaderModule({ code: shader.vertSrc() });
    shader.fragModule = device.createShaderModule({ code: shader.fragSrc() });

    shader._pipelineCache = new Map();
    shader.getPipeline = ({ topology, blendMode, sampleCount, format }) => {
      const key = `${topology}_${blendMode}_${sampleCount}_${format}`;
      if (!shader._pipelineCache.has(key)) {
        const pipeline = device.createRenderPipeline({
          layout: shader._pipelineLayout,
          vertex: {
            module: shader.vertModule,
            entryPoint: 'main',
            buffers: this._getVertexLayout(shader),
          },
          fragment: {
            module: shader.fragModule,
            entryPoint: 'main',
            targets: [{
              format,
              blend: this._getBlendState(blendMode),
            }],
          },
          primitive: { topology },
          multisample: { count: sampleCount },
          depthStencil: {
            format: this.depthFormat,
            depthWriteEnabled: true,
            depthCompare: 'less',
            stencilFront: {
              compare: 'always',
              failOp: 'keep',
              depthFailOp: 'keep',
              passOp: 'keep',
            },
            stencilBack: {
              compare: 'always',
              failOp: 'keep',
              depthFailOp: 'keep',
              passOp: 'keep',
            },
            stencilReadMask: 0xFFFFFFFF, // TODO
            stencilWriteMask: 0xFFFFFFFF,
            stencilLoadOp: "load",
            stencilStoreOp: "store",
          },
        });
        shader._pipelineCache.set(key, pipeline);
      }
      return shader._pipelineCache.get(key);
    }
  }

  _finalizeShader(shader) {
    const uniformSize = Object.values(shader.uniforms)
      .filter(u => !u.isSampler)
      .reduce((sum, u) => sum + u.alignedBytes, 0);
    shader._uniformData = new Float32Array(uniformSize / 4);
    shader._uniformBuffer = this.device.createBuffer({
      size: uniformSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroupLayouts = new Map(); // group index -> bindGroupLayout
    const groupEntries = new Map(); // group index -> array of entries

    // We're enforcing that every shader have a single uniform struct in binding 0
    groupEntries.set(0, [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: 'uniform' },
    }]);

    // Add the variable amount of samplers and texture bindings that can come after
    for (const sampler of shader.samplers) {
      const group = sampler.group;
      const entries = groupEntries.get(group) || [];

      entries.push({
        binding: sampler.binding,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: sampler.type === 'sampler'
          ? { type: 'filtering' }
          : undefined,
        texture: sampler.type === 'texture'
          ? { sampleType: 'float', viewDimension: '2d' }
          : undefined,
        uniform: sampler,
      });

      groupEntries.set(group, entries);
    }

    // Create layouts and bind groups
    for (const [group, entries] of groupEntries) {
      const layout = this.device.createBindGroupLayout({ entries });
      bindGroupLayouts.set(group, layout);
    }

    shader._groupEntries = groupEntries;
    shader._bindGroupLayouts = [...bindGroupLayouts.values()];
    shader._pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: shader._bindGroupLayouts,
    });
  }

  _getBlendState(mode) {
    switch (mode) {
      case constants.BLEND:
        return {
          color: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha'
          }
        };

      case constants.ADD:
        return {
          color: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one'
          }
        };

      case constants.REMOVE:
        return {
          color: {
            operation: 'add',
            srcFactor: 'zero',
            dstFactor: 'one-minus-src-alpha'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'zero',
            dstFactor: 'one-minus-src-alpha'
          }
        };

      case constants.MULTIPLY:
        return {
          color: {
            operation: 'add',
            srcFactor: 'dst-color',
            dstFactor: 'one-minus-src-alpha'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'dst-alpha',
            dstFactor: 'one-minus-src-alpha'
          }
        };

      case constants.SCREEN:
        return {
          color: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one-minus-src-color'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha'
          }
        };

      case constants.EXCLUSION:
        return {
          color: {
            operation: 'add',
            srcFactor: 'one-minus-dst-color',
            dstFactor: 'one-minus-src-color'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one'
          }
        };

      case constants.REPLACE:
        return {
          color: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'zero'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'zero'
          }
        };

      case constants.SUBTRACT:
        return {
          color: {
            operation: 'reverse-subtract',
            srcFactor: 'one',
            dstFactor: 'one'
          },
          alpha: {
            operation: 'add',
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha'
          }
        };

      case constants.DARKEST:
        return {
          color: {
            operation: 'min',
            srcFactor: 'one',
            dstFactor: 'one'
          },
          alpha: {
            operation: 'min',
            srcFactor: 'one',
            dstFactor: 'one'
          }
        };

      case constants.LIGHTEST:
        return {
          color: {
            operation: 'max',
            srcFactor: 'one',
            dstFactor: 'one'
          },
          alpha: {
            operation: 'max',
            srcFactor: 'one',
            dstFactor: 'one'
          }
        };

      default:
        console.warn(`Unsupported blend mode: ${mode}`);
        return undefined;
    }
  }

  _applyColorBlend() {}

  _getVertexLayout(shader) {
    const layouts = [];

    for (const attrName in shader.attributes) {
      const attr = shader.attributes[attrName];
      if (!attr || attr.location === -1) continue;
      // Get the vertex buffer info associated with this attribute
      const renderBuffer =
        this.buffers[shader.shaderType].find(buf => buf.attr === attrName) ||
        this.buffers.user.find(buf => buf.attr === attrName);
      if (!renderBuffer) continue;

      const { size } = renderBuffer;
      // Convert from the number of floats (e.g. 3) to a recognized WebGPU
      // format (e.g. "float32x3")
      const format = this._getFormatFromSize(size);

      layouts.push({
        arrayStride: size * 4,
        stepMode: 'vertex',
        attributes: [
          {
            shaderLocation: attr.location,
            offset: 0,
            format,
          },
        ],
      });
    }
    return layouts;
  }

  _getVertexBuffers(shader) {
    const buffers = [];

    for (const attrName in shader.attributes) {
      const attr = shader.attributes[attrName];
      if (!attr || attr.location === -1) continue;

      // Get the vertex buffer info associated with this attribute
      const renderBuffer =
        this.buffers[shader.shaderType].find(buf => buf.attr === attrName) ||
        this.buffers.user.find(buf => buf.attr === attrName);
      if (!renderBuffer) continue;

      buffers.push(renderBuffer);
    }

    return buffers;
  }

  _getFormatFromSize(size) {
    switch (size) {
      case 1: return 'float32';
      case 2: return 'float32x2';
      case 3: return 'float32x3';
      case 4: return 'float32x4';
      default: throw new Error(`Unsupported attribute size: ${size}`);
    }
  }

  _useShader(shader, options) {}

  _updateViewport() {
    this._viewport = [0, 0, this.width, this.height];
  }

  zClipRange() {
    return [0, 1];
  }

  _resetBuffersBeforeDraw() {
    const commandEncoder = this.device.createCommandEncoder();

    const depthTextureView = this.depthTexture?.createView();
    const depthAttachment = depthTextureView
      ? {
        view: depthTextureView,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
        stencilLoadOp: 'load',
        stencilStoreOp: "store",
      }
      : undefined;

    const renderPassDescriptor = {
      colorAttachments: [],
      ...(depthAttachment ? { depthStencilAttachment: depthAttachment } : {}),
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end();

    this.queue.submit([commandEncoder.finish()]);
  }

  //////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////

  _drawBuffers(geometry, { mode = constants.TRIANGLES, count = 1 }, stroke) {
    const buffers = this.geometryBufferCache.getCached(geometry);
    if (!buffers) return;

    const commandEncoder = this.device.createCommandEncoder();
    const currentTexture = this.drawingContext.getCurrentTexture();
    const colorAttachment = {
      view: currentTexture.createView(),
      loadOp: "load",
      storeOp: "store",
    };

    const depthTextureView = this.depthTexture?.createView();
    const renderPassDescriptor = {
      colorAttachments: [colorAttachment],
      depthStencilAttachment: depthTextureView
        ? {
            view: depthTextureView,
            depthLoadOp: "load",
            depthStoreOp: "store",
            depthClearValue: 1.0,
            stencilLoadOp: "load",
            stencilStoreOp: "store",
            depthReadOnly: false,
            stencilReadOnly: false,
          }
        : undefined,
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(this._curShader.getPipeline(this._shaderOptions({ mode })));
    // Bind vertex buffers
    for (const buffer of this._getVertexBuffers(this._curShader)) {
      passEncoder.setVertexBuffer(
        this._curShader.attributes[buffer.attr].location,
        buffers[buffer.dst],
        0
      );
    }
    // Bind uniforms
    this._packUniforms(this._curShader);
    console.log(this._curShader);
    this.device.queue.writeBuffer(
      this._curShader._uniformBuffer,
      0,
      this._curShader._uniformData.buffer,
      this._curShader._uniformData.byteOffset,
      this._curShader._uniformData.byteLength
    );

    // Bind sampler/texture uniforms
    for (const [group, entries] of this._curShader._groupEntries) {
      const bgEntries = entries.map(entry => {
        if (group === 0 && entry.binding === 0) {
          return {
            binding: 0,
            resource: { buffer: this._curShader._uniformBuffer },
          };
        }

        return {
          binding: entry.binding,
          resource: sampler.type === 'sampler'
            ? sampler.uniform._cachedData.getSampler()
            : sampler.uniform.textureHandle.view,
        };
      });

      const layout = this._curShader._bindGroupLayouts[group];
      const bindGroup = this.device.createBindGroup({
        layout,
        entries: bgEntries,
      });
      passEncoder.setBindGroup(group, bindGroup);
    }

    if (buffers.lineVerticesBuffer && geometry.lineVertices && stroke) {
      passEncoder.draw(geometry.lineVertices.length / 3, count, 0, 0);
    }
    // Bind index buffer and issue draw
    if (!stroke) {
    if (buffers.indexBuffer) {
      const indexFormat = buffers.indexFormat || "uint16";
      passEncoder.setIndexBuffer(buffers.indexBuffer, indexFormat);
      passEncoder.drawIndexed(geometry.faces.length * 3, count, 0, 0, 0);
    } else {
      passEncoder.draw(geometry.vertices.length, count, 0, 0);
    }}

    passEncoder.end();
    this.queue.submit([commandEncoder.finish()]);
  }

  //////////////////////////////////////////////
  // SHADER
  //////////////////////////////////////////////

  _packUniforms(shader) {
    let offset = 0;
    let i = 0;
    for (const name in shader.uniforms) {
      const uniform = shader.uniforms[name];
      if (uniform.isSampler) continue;
      if (uniform.size === 1) {
        shader._uniformData.set([uniform._cachedData], offset);
      } else {
        shader._uniformData.set(uniform._cachedData, offset);
      }
      offset += uniform.alignedBytes / 4;
    }
  }

  _parseStruct(shaderSource, structName) {
    const structMatch = shaderSource.match(
      new RegExp(`struct\\s+${structName}\\s*\\{([^\\}]+)\\}`)
    );
    if (!structMatch) {
      throw new Error(`Can't find a struct defnition for ${structName}`);
    }

    const structBody = structMatch[1];
    const elements = {};
    let match;
    let index = 0;

    const elementRegex =
      /(?:@location\((\d+)\)\s+)?(\w+):\s+((?:mat[234]x[234]|vec[234]|float|int|uint|bool|f32|i32|u32|bool)(?:<f32>)?)/g
    while ((match = elementRegex.exec(structBody)) !== null) {
      const [_, location, name, type] = match;
      const size = type.startsWith('vec')
        ? parseInt(type[3])
        : type.startsWith('mat')
          ? Math.pow(parseInt(type[3]), 2)
          : 1;
      const bytes = 4 * size; // TODO handle non 32 bit sizes?
      const alignedBytes = Math.ceil(bytes / 16) * 16;
      elements[name] = {
        name,
        location: location ? parseInt(location) : undefined,
        index,
        type,
        size,
        bytes,
        alignedBytes,
      };
      index++;
    }

    return elements;
  }

  _getShaderAttributes(shader) {
    const mainMatch = /fn main\(.+:\s*(\S+)\s*\)/.exec(shader._vertSrc);
    if (!mainMatch) throw new Error("Can't find `fn main` in vertex shader source");
    const inputType = mainMatch[1];

    return this._parseStruct(shader.vertSrc(), inputType);
  }

  getUniformMetadata(shader) {
    // Currently, for ease of parsing, we enforce that the first bind group is a
    // struct, which contains all non-sampler uniforms. Then, any subsequent
    // groups are individual samplers.

    // Extract the struct name from the uniform variable declaration
    const uniformVarRegex = /@group\(0\)\s+@binding\(0\)\s+var<uniform>\s+(\w+)\s*:\s*(\w+);/;
    const uniformVarMatch = uniformVarRegex.exec(shader._vertSrc);
    if (!uniformVarMatch) {
      throw new Error('Expected a uniform struct bound to @group(0) @binding(0)');
    }
    const structType = uniformVarMatch[2];
    const uniforms = this._parseStruct(shader.vertSrc(), structType);
    // Extract samplers from group bindings
    const samplers = [];
    const samplerRegex = /@group\((\d+)\)\s*@binding\((\d+)\)\s*var\s+(\w+)\s*:\s*(\w+);/g;
    let match;
    while ((match = samplerRegex.exec(shader._vertSrc)) !== null) {
      const [_, group, binding, name, type] = match;
      const groupIndex = parseInt(group);
      // We're currently reserving group 0 for non-sampler stuff, which we parse
      // above, so we can skip it here while we grab the remaining sampler
      // uniforms
      if (groupIndex === 0) continue;

      samplers.push({
        group: groupIndex,
        binding: parseInt(binding),
        name,
        type, // e.g., 'sampler', 'texture_2d<f32>'
        sampler: true,
      });
    }
    return [...Object.values(uniforms).sort((a, b) => a.index - b.index), ...samplers];
  }

  updateUniformValue(_shader, _uniform, _data) {}

  _updateTexture(uniform, tex) {
    tex.update();
  }

  bindTexture(tex) {}
  unbindTexture(tex) {}
  _unbindFramebufferTexture(uniform) {}

  createTexture({ width, height, format = 'rgba8unorm', usage }) {
    const gpuTexture = this.device.createTexture({
      size: [width, height],
      format,
      usage: usage || (
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT
      ),
    });
    return { gpuTexture, view: gpuTexture.createView() };
  }

  uploadTextureFromSource({ gpuTexture }, source) {
    this.queue.copyExternalImageToTexture(
      { source },
      { texture: gpuTexture },
      [source.width, source.height]
    );
  }

  uploadTextureFromData({ gpuTexture }, data, width, height) {
    this.queue.writeTexture(
      { texture: gpuTexture },
      data,
      { bytesPerRow: width * 4, rowsPerImage: height },
      { width, height, depthOrArrayLayers: 1 }
    );
  }

  setTextureParams(_texture) {}

  getSampler(texture) {
    const key = `${texture.minFilter}_${texture.magFilter}_${texture.wrapS}_${texture.wrapT}`;
    if (this.samplers.has(key)) {
      return this.samplers.get(key);
    }
    const constantMapping = {
      [constants.NEAREST]: 'nearest',
      [constants.LINEAR]: 'linear',
      [constants.CLAMP]: 'clamp-to-edge',
      [constants.REPEAT]: 'repeat',
      [constants.MIRROR]: 'mirror-repeat'
    }
    const sampler = this.device.createSampler({
      magFilter: constantMapping[texture.magFilter],
      minFilter: constantMapping[texture.minFilter],
      addressModeU: constantMapping[texture.wrapS],
      addressModeV: constantMapping[params.addressModeV],
    });
    this.samplers.set(key, sampler);
    return sampler;
  }

  bindTextureToShader(_texture, _sampler, _uniformName, _unit) {}

  deleteTexture({ gpuTexture }) {
    gpuTexture.destroy();
  }

  _getColorShader() {
    if (!this._defaultColorShader) {
      this._defaultColorShader = new Shader(
        this,
        colorVertexShader,
        colorFragmentShader,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "Vertex getObjectInputs": "(inputs: Vertex) { return inputs; }",
            "Vertex getWorldInputs": "(inputs: Vertex) { return inputs; }",
            "Vertex getCameraInputs": "(inputs: Vertex) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "vec4<f32> getFinalColor": "(color: vec4<f32>) { return color; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }
    return this._defaultColorShader;
  }

  _getLineShader() {
    if (!this._defaultLineShader) {
      this._defaultLineShader = new Shader(
        this,
        lineVertexShader,
        lineFragmentShader,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "Vertex getObjectInputs": "(inputs: Vertex) { return inputs; }",
            "Vertex getWorldInputs": "(inputs: Vertex) { return inputs; }",
            "Vertex getCameraInputs": "(inputs: Vertex) { return inputs; }",
          },
          fragment: {
            "vec4<f32> getFinalColor": "(color: vec4<f32>) { return color; }"
          },
        }
      );
    }
    return this._defaultLineShader;
  }

  //////////////////////////////////////////////
  // Setting
  //////////////////////////////////////////////
  _adjustDimensions(width, height) {
    // TODO: find max texture size
    return { adjustedWidth: width, adjustedHeight: height };
  }

  _applyStencilTestIfClipping() {
    // TODO
  }

  //////////////////////////////////////////////
  // Shader hooks
  //////////////////////////////////////////////
  fillHooks(shader, src, shaderType) {
    if (!src.includes('fn main')) return src;

    // Apply some p5-specific preprocessing. WGSL doesn't have preprocessor
    // statements, but some of our shaders might need it, so we add a lightweight
    // way to add code if a hook is augmented. e.g.:
    //   struct Uniforms {
    //   // @p5 ifdef Vertex getWorldInputs
    //     uModelMatrix: mat4,
    //     uViewMatrix: mat4,
    //   // @p5 endif
    //   // @p5 ifndef Vertex getWorldInputs
    //     uModelViewMatrix: mat4,
    //   // @p5 endif
    //   }
    src = src.replace(
      /\/\/ @p5 (ifdef|ifndef) (\w+)\s+(\w+)\n((?:(?!\/\/ @p5)(?:.|\n))*)\/\/ @p5 endif/g,
      (_, condition, hookType, hookName, body) => {
        const target = condition === 'ifdef';
        if (!!shader.hooks.modified[shaderType][`${hookType} ${hookName}`] === target) {
          return body;
        } else {
          return '';
        }
      }
    );

    let [preMain, main, postMain] = src.split(/((?:@(?:vertex|fragment)\s*)?fn main)/);

    let uniforms = '';
    for (const key in shader.hooks.uniforms) {
      const [type, name] = key.split(/\s+/);
      uniforms += `${name}: ${type},\n`;
    }
    preMain = preMain.replace(/struct\s+Uniforms\s+\{/, `$&\n${uniforms}`);

    let hooks = '';
    let defines = '';
    if (shader.hooks.declarations) {
      hooks += shader.hooks.declarations + '\n';
    }
    if (shader.hooks[shaderType].declarations) {
      hooks += shader.hooks[shaderType].declarations + '\n';
    }
    for (const hookDef in shader.hooks.helpers) {
      const [hookType, hookName] = hookDef.split(' ');
      const [_, params, body] = /^(\([^\)]*\))((?:.|\n)*)$/.exec(shader.hooks.helpers[hookDef]);
      if (hookType === 'void') {
        hooks += `fn ${hookName}${params}${body}\n`;
      } else {
        hooks += `fn ${hookName}${params} -> ${hookType}${body}\n`;
      }
    }
    for (const hookDef in shader.hooks[shaderType]) {
      if (hookDef === 'declarations') continue;
      const [hookType, hookName] = hookDef.split(' ');

      // Add a const so that if the shader wants to
      // optimize away the extra function calls in main, it can do so
      defines += `const AUGMENTED_HOOK_${hookName} = ${
        shader.hooks.modified[shaderType][hookDef] ? 'true' : 'false'
      };\n`;

      const [_, params, body] = /^(\([^\)]*\))((?:.|\n)*)$/.exec(shader.hooks[shaderType][hookDef]);
      if (hookType === 'void') {
        hooks += `fn HOOK_${hookName}${params}${body}\n`;
      } else {
        hooks += `fn HOOK_${hookName}${params} -> ${hookType}${body}\n`;
      }
    }

    //console.log(preMain + '\n' + defines + hooks + main + postMain)
    return preMain + '\n' + defines + hooks + main + postMain;
  }
}

function rendererWebGPU(p5, fn) {
  p5.RendererWebGPU = RendererWebGPU;

  p5.renderers[constants.WEBGPU] = p5.RendererWebGPU;
}

export default rendererWebGPU;
export { RendererWebGPU };
