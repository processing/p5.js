import { Renderer3D, getStrokeDefs } from '../core/p5.Renderer3D';
import { Shader } from '../webgl/p5.Shader';
import { Texture } from '../webgl/p5.Texture';
import { Image } from '../image/p5.Image';
import { RGB, RGBA } from '../color/creating_reading';
import * as constants from '../core/constants';


import { colorVertexShader, colorFragmentShader } from './shaders/color';
import { lineVertexShader, lineFragmentShader} from './shaders/line';
import { materialVertexShader, materialFragmentShader } from './shaders/material';
import {Graphics} from "../core/p5.Graphics";
import {Element} from "../dom/p5.Element";

const { lineDefs } = getStrokeDefs((n, v, t) => `const ${n}: ${t} = ${v};\n`);

class RendererWebGPU extends Renderer3D {
  constructor(pInst, w, h, isMainCanvas, elt) {
    super(pInst, w, h, isMainCanvas, elt)

    this.renderPass = {};

    this.samplers = new Map();

    // Single reusable staging buffer for pixel reading
    this.pixelReadBuffer = null;
    this.pixelReadBufferSize = 0;

    // Lazy readback texture for main canvas pixel reading
    this.canvasReadbackTexture = null;
  }

  async setupContext() {
    this._setAttributeDefaults(this._pInst);
    await this._initContext();
  }

  _setAttributeDefaults(pInst) {
    const defaults = {
      forceFallbackAdapter: false,
      powerPreference: 'high-performance',
    };
    if (pInst._webgpuAttributes === null) {
      pInst._webgpuAttributes = defaults;
    } else {
      pInst._webgpuAttributes = Object.assign(defaults, pInst._webgpuAttributes);
    }
    return;
  }

  async _initContext() {
    this.adapter = await navigator.gpu?.requestAdapter(this._webgpuAttributes);
    // console.log('Adapter:');
    // console.log(this.adapter);
    if (this.adapter) {
      console.log([...this.adapter.features]);
    }
    this.device = await this.adapter?.requestDevice({
      // Todo: check support
      requiredFeatures: ['depth32float-stencil8']
    });
    // console.log('Device:');
    // console.log(this.device);
    if (!this.device) {
      throw new Error('Your browser does not support WebGPU.');
    }
    this.queue = this.device.queue;
    this.drawingContext = this.canvas.getContext('webgpu');
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    this.drawingContext.configure({
      device: this.device,
      format: this.presentationFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    // TODO disablable stencil
    this.depthFormat = 'depth24plus-stencil8';
    this._updateSize();
    this._update();
  }

  async _setAttributes(key, value) {
    if (typeof this._pInst._webgpuAttributes === "undefined") {
      console.log(
        "You are trying to use setAttributes on a p5.Graphics object " +
        "that does not use a WebGPU renderer."
      );
      return;
    }
    let unchanged = true;

    if (typeof value !== "undefined") {
      //first time modifying the attributes
      if (this._pInst._webgpuAttributes === null) {
        this._pInst._webgpuAttributes = {};
      }
      if (this._pInst._webgpuAttributes[key] !== value) {
        //changing value of previously altered attribute
        this._webgpuAttributes[key] = value;
        unchanged = false;
      }
      //setting all attributes with some change
    } else if (key instanceof Object) {
      if (this._pInst._webgpuAttributes !== key) {
        this._pInst._webgpuAttributes = key;
        unchanged = false;
      }
    }
    //@todo_FES
    if (!this.isP3D || unchanged) {
      return;
    }

    if (!this._pInst._setupDone) {
      if (this.geometryBufferCache.numCached() > 0) {
        p5._friendlyError(
          "Sorry, Could not set the attributes, you need to call setAttributes() " +
          "before calling the other drawing methods in setup()"
        );
        return;
      }
    }

    await this._resetContext(null, null, RendererWebGPU);

    if (this.states.curCamera) {
      this.states.curCamera._renderer = this._renderer;
    }
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

    // Clear the main canvas after resize
    this.clear();

    // Destroy existing readback texture when size changes
    if (this.canvasReadbackTexture && this.canvasReadbackTexture.destroy) {
      this.canvasReadbackTexture.destroy();
      this.canvasReadbackTexture = null;
    }
  }

  clear(...args) {
    const _r = args[0] || 0;
    const _g = args[1] || 0;
    const _b = args[2] || 0;
    const _a = args[3] || 0;

    const commandEncoder = this.device.createCommandEncoder();

    // Use framebuffer texture if active, otherwise use canvas texture
    const activeFramebuffer = this.activeFramebuffer();
    const colorTexture = activeFramebuffer ?
      (activeFramebuffer.aaColorTexture || activeFramebuffer.colorTexture) :
      this.drawingContext.getCurrentTexture();

    const colorAttachment = {
      view: colorTexture.createView(),
      clearValue: { r: _r * _a, g: _g * _a, b: _b * _a, a: _a },
      loadOp: 'clear',
      storeOp: 'store',
      // If using multisampled texture, resolve to non-multisampled texture
      resolveTarget: activeFramebuffer && activeFramebuffer.aaColorTexture ?
        activeFramebuffer.colorTexture.createView() : undefined,
    };

    // Use framebuffer depth texture if active, otherwise use canvas depth texture
    const depthTexture = activeFramebuffer ?
      (activeFramebuffer.aaDepthTexture || activeFramebuffer.depthTexture) :
      this.depthTexture;
    const depthTextureView = depthTexture?.createView();
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

  _getValidSampleCount(requestedCount) {
    // WebGPU supports sample counts of 1, 4 (and sometimes 8)
    if (requestedCount <= 1) return 1;
    if (requestedCount <= 4) return 4;
    return 4; // Cap at 4 for broader compatibility
  }

  _shaderOptions({ mode }) {
    const activeFramebuffer = this.activeFramebuffer();
    const format = activeFramebuffer ?
      this._getWebGPUColorFormat(activeFramebuffer) :
      this.presentationFormat;

    const requestedSampleCount = activeFramebuffer ?
      (activeFramebuffer.antialias ? activeFramebuffer.antialiasSamples : 1) :
      (this.antialias || 1);
    const sampleCount = this._getValidSampleCount(requestedSampleCount);

    const depthFormat = activeFramebuffer && activeFramebuffer.useDepth ?
      this._getWebGPUDepthFormat(activeFramebuffer) :
      this.depthFormat;

    return {
      topology: mode === constants.TRIANGLE_STRIP ? 'triangle-strip' : 'triangle-list',
      blendMode: this.states.curBlendMode,
      sampleCount,
      format,
      depthFormat,
    }
  }

  _initShader(shader) {
    const device = this.device;

    shader.vertModule = device.createShaderModule({ code: shader.vertSrc() });
    shader.fragModule = device.createShaderModule({ code: shader.fragSrc() });

    shader._pipelineCache = new Map();
    shader.getPipeline = ({ topology, blendMode, sampleCount, format, depthFormat }) => {
      const key = `${topology}_${blendMode}_${sampleCount}_${format}_${depthFormat}`;
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
            format: depthFormat,
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
    const rawSize = Math.max(
      0,
      ...Object.values(shader.uniforms).filter(u => !u.isSampler).map(u => u.offsetEnd)
    );
    const alignedSize = Math.ceil(rawSize / 16) * 16;
    shader._uniformData = new Float32Array(alignedSize / 4);
    shader._uniformDataView = new DataView(shader._uniformData.buffer);

    shader._uniformBuffer = this.device.createBuffer({
      size: alignedSize,
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
      if (!['sampler', 'texture_2d<f32>'].includes(sampler.type)) {
        throw new Error(`Unsupported texture type: ${sampler.type}`);
      }

      entries.push({
        binding: sampler.binding,
        visibility: sampler.visibility,
        sampler: sampler.type === 'sampler'
          ? { type: 'filtering' }
          : undefined,
        texture: sampler.type === 'texture_2d<f32>'
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
    this._origViewport = {
      width: this.width,
      height: this.height,
    };
    this._viewport = [0, 0, this.width, this.height];
  }

  _createPixelsArray() {
    this.pixels = new Uint8Array(
      this.width * this.pixelDensity() * this.height * this.pixelDensity() * 4
    );
  }

  viewport() {}

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

  _drawBuffers(geometry, { mode = constants.TRIANGLES, count = 1 }) {
    const buffers = this.geometryBufferCache.getCached(geometry);
    if (!buffers) return;

    const commandEncoder = this.device.createCommandEncoder();

    // Use framebuffer texture if active, otherwise use canvas texture
    const activeFramebuffer = this.activeFramebuffer();
    const colorTexture = activeFramebuffer ?
      (activeFramebuffer.aaColorTexture || activeFramebuffer.colorTexture) :
      this.drawingContext.getCurrentTexture();

    const colorAttachment = {
      view: colorTexture.createView(),
      loadOp: "load",
      storeOp: "store",
      // If using multisampled texture, resolve to non-multisampled texture
      resolveTarget: activeFramebuffer && activeFramebuffer.aaColorTexture ?
        activeFramebuffer.colorTexture.createView() : undefined,
    };

    // Use framebuffer depth texture if active, otherwise use canvas depth texture
    const depthTexture = activeFramebuffer ?
      (activeFramebuffer.aaDepthTexture || activeFramebuffer.depthTexture) :
      this.depthTexture;
    const depthTextureView = depthTexture?.createView();
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
    const currentShader = this._curShader;
    passEncoder.setPipeline(currentShader.getPipeline(this._shaderOptions({ mode })));
    // Bind vertex buffers
    for (const buffer of this._getVertexBuffers(currentShader)) {
      passEncoder.setVertexBuffer(
        currentShader.attributes[buffer.attr].location,
        buffers[buffer.dst],
        0
      );
    }
    // Bind uniforms
    this._packUniforms(this._curShader);
    this.device.queue.writeBuffer(
      currentShader._uniformBuffer,
      0,
      currentShader._uniformData.buffer,
      currentShader._uniformData.byteOffset,
      currentShader._uniformData.byteLength
    );

    // Bind sampler/texture uniforms
    for (const [group, entries] of currentShader._groupEntries) {
      const bgEntries = entries.map(entry => {
        if (group === 0 && entry.binding === 0) {
          return {
            binding: 0,
            resource: { buffer: currentShader._uniformBuffer },
          };
        }

        if (!entry.uniform.isSampler) {
          throw new Error(
            'All non-texture/sampler uniforms should be in the uniform struct!'
          );
        }

        return {
          binding: entry.binding,
          resource: entry.uniform.type === 'sampler'
            ? (entry.uniform.textureSource.texture || this._getEmptyTexture()).getSampler()
            : (entry.uniform.texture || this._getEmptyTexture()).textureHandle.view,
        };
      });

      const layout = currentShader._bindGroupLayouts[group];
      const bindGroup = this.device.createBindGroup({
        layout,
        entries: bgEntries,
      });
      passEncoder.setBindGroup(group, bindGroup);
    }

    if (currentShader.shaderType === "fill") {
      // Bind index buffer and issue draw
      if (buffers.indexBuffer) {
        const indexFormat = buffers.indexFormat || "uint16";
        passEncoder.setIndexBuffer(buffers.indexBuffer, indexFormat);
        passEncoder.drawIndexed(geometry.faces.length * 3, count, 0, 0, 0);
      } else {
        passEncoder.draw(geometry.vertices.length, count, 0, 0);
      }
    }

    if (buffers.lineVerticesBuffer && currentShader.shaderType === "stroke") {
      passEncoder.draw(geometry.lineVertices.length / 3, count, 0, 0);
    }

    passEncoder.end();
    this.queue.submit([commandEncoder.finish()]);
  }

  async ensureTexture(source) {
    await this.queue.onSubmittedWorkDone();
    await new Promise((res) => requestAnimationFrame(res));
    const tex = this.getTexture(source);
    tex.update();
    await this.queue.onSubmittedWorkDone();
    await new Promise((res) => requestAnimationFrame(res));
  }

  //////////////////////////////////////////////
  // SHADER
  //////////////////////////////////////////////

  _packUniforms(shader) {
    for (const name in shader.uniforms) {
      const uniform = shader.uniforms[name];
      if (uniform.isSampler) continue;
      if (uniform.type === 'u32') {
        shader._uniformDataView.setUint32(uniform.offset, uniform._cachedData, true);
      } else if (uniform.size === 4) {
        shader._uniformData.set([uniform._cachedData], uniform.offset / 4);
      } else {
        shader._uniformData.set(uniform._cachedData, uniform.offset / 4);
      }
    }
  }

  _parseStruct(shaderSource, structName) {
    const structMatch = shaderSource.match(
      new RegExp(`struct\\s+${structName}\\s*\\{([^\\}]+)\\}`)
    );
    if (!structMatch) {
      throw new Error(`Can't find a struct definition for ${structName}`);
    }

    const structBody = structMatch[1];
    const elements = {};
    let match;
    let index = 0;
    let offset = 0;

    const elementRegex =
      /(?:@location\((\d+)\)\s+)?(\w+):\s*([^\n]+?),?\n/g

    const baseAlignAndSize = (type) => {
      if (['f32', 'i32', 'u32', 'bool'].includes(type)) {
        return { align: 4, size: 4, items: 1 };
      }
      if (/^vec[2-4](<f32>|f)$/.test(type)) {
        const n = parseInt(type.match(/^vec([2-4])/)[1]);
        const size = 4 * n;
        const align = n === 2 ? 8 : 16;
        return { align, size, items: n };
      }
      if (/^mat[2-4](?:x[2-4])?(<f32>|f)$/.test(type)) {
        if (type[4] === 'x' && type[3] !== type[5]) {
          throw new Error('Non-square matrices not implemented yet');
        }
        const dim = parseInt(type[3]);
        const align = dim === 2 ? 8 : 16;
        // Each column must be aligned
        const size = Math.ceil(dim * 4 / align) * align * dim;
        const pack = dim === 3
          ? (data) => [
            ...data.slice(0, 3),
            0,
            ...data.slice(3, 6),
            0,
            ...data.slice(6, 9),
            0
          ]
          : undefined;
        return { align, size, pack, items: dim * dim };
      }
      if (/^array<.+>$/.test(type)) {
        const [, subtype, rawLength] = type.match(/^array<(.+),\s*(\d+)>/);
        const length = parseInt(rawLength);
        const {
          align: elemAlign,
          size: elemSize,
          items: elemItems,
          pack: elemPack = (data) => [...data]
        } = baseAlignAndSize(subtype);
        const stride = Math.ceil(elemSize / elemAlign) * elemAlign;
        const pack = (data) => {
          const result = [];
          for (let i = 0; i < data.length; i += elemItems) {
            const elemData = elemPack(data.slice(i, elemItems))
            result.push(...elemData);
            for (let j = 0; j < stride / 4 - elemData.length; j++) {
              result.push(0);
            }
          }
          return result;
        };
        return {
          align: elemAlign,
          size: stride * length,
          items: elemItems * length,
          pack,
        };
      }
      throw new Error(`Unknown type in WGSL struct: ${type}`);
    };

    while ((match = elementRegex.exec(structBody)) !== null) {
      const [_, location, name, type] = match;
      const { size, align, pack } = baseAlignAndSize(type);
      offset = Math.ceil(offset / align) * align;
      const offsetEnd = offset + size;
      elements[name] = {
        name,
        location: location ? parseInt(location) : undefined,
        index,
        type,
        size,
        offset,
        offsetEnd,
        pack
      };
      index++;
      offset = offsetEnd;
    }

    return elements;
  }

  _mapUniformData(uniform, data) {
    if (uniform.pack) {
      return uniform.pack(data);
    }
    return data;
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
    const samplers = {};
    // TODO: support other texture types
    const samplerRegex = /@group\((\d+)\)\s*@binding\((\d+)\)\s*var\s+(\w+)\s*:\s*(texture_2d<f32>|sampler);/g;
    for (const [src, visibility] of [
      [shader._vertSrc, GPUShaderStage.VERTEX],
      [shader._fragSrc, GPUShaderStage.FRAGMENT]
    ]) {
      let match;
      while ((match = samplerRegex.exec(src)) !== null) {
        const [_, group, binding, name, type] = match;
        const groupIndex = parseInt(group);
        const bindingIndex = parseInt(binding);
        // We're currently reserving group 0 for non-sampler stuff, which we parse
        // above, so we can skip it here while we grab the remaining sampler
        // uniforms
        if (groupIndex === 0 && bindingIndex === 0) continue;

        const key = `${groupIndex},${bindingIndex}`;
        samplers[key] = {
          visibility: (samplers[key]?.visibility || 0) | visibility,
          group: groupIndex,
          binding: bindingIndex,
          name,
          type,
          isSampler: true,
          noData: type === 'sampler',
        };
      }

      for (const sampler of Object.values(samplers)) {
        if (sampler.type.startsWith('texture')) {
          const samplerName = sampler.name + '_sampler';
          const samplerNode = Object
            .values(samplers)
            .find((s) => s.name === samplerName);
          if (!samplerNode) {
            throw new Error(
              `Every shader texture needs an accompanying sampler. Could not find sampler ${samplerName} for texture ${sampler.name}`
            );
          }
          samplerNode.textureSource = sampler;
        }
      }
    }
    return [...Object.values(uniforms).sort((a, b) => a.index - b.index), ...Object.values(samplers)];
  }

  updateUniformValue(_shader, uniform, data) {
    if (uniform.isSampler) {
      uniform.texture =
        data instanceof Texture ? data : this.getTexture(data);
    }
  }

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
      addressModeV: constantMapping[texture.wrapT],
    });
    this.samplers.set(key, sampler);
    return sampler;
  }

  bindTextureToShader(_texture, _sampler, _uniformName, _unit) {}

  deleteTexture({ gpuTexture }) {
    gpuTexture.destroy();
  }

  _getLightShader() {
    if (!this._defaultLightShader) {
      this._defaultLightShader = new Shader(
        this,
        materialVertexShader,
        materialFragmentShader,
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
            "Inputs getPixelInputs": "(inputs: Inputs) { return inputs; }",
            "vec4f combineColors": `(components: ColorComponents) {
              var rgb = vec3<f32>(0.0);
              rgb += components.diffuse * components.baseColor;
              rgb += components.ambient * components.ambientColor;
              rgb += components.specular * components.specularColor;
              rgb += components.emissive;
              return vec4<f32>(rgb, components.opacity);
            }`,
            "vec4f getFinalColor": "(color: vec4<f32>) { return color; }",
            "void afterFragment": "() {}",
          },
        }
      );
    }
    return this._defaultLightShader;
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
        lineDefs + lineVertexShader,
        lineDefs + lineFragmentShader,
        {
          vertex: {
            "void beforeVertex": "() {}",
            "StrokeVertex getObjectInputs": "(inputs: StrokeVertex) { return inputs; }",
            "StrokeVertex getWorldInputs": "(inputs: StrokeVertex) { return inputs; }",
            "StrokeVertex getCameraInputs": "(inputs: StrokeVertex) { return inputs; }",
            "void afterVertex": "() {}",
          },
          fragment: {
            "void beforeFragment": "() {}",
            "Inputs getPixelInputs": "(inputs: Inputs) { return inputs; }",
            "vec4<f32> getFinalColor": "(color: vec4<f32>) { return color; }",
            "bool shouldDiscard": "(outside: bool) { return outside; };",
            "void afterFragment": "() {}",
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
  populateHooks(shader, src, shaderType) {
    if (!src.includes('fn main')) return src;

    // Apply some p5-specific preprocessing. WGSL doesn't have preprocessor
    // statements, but some of our shaders might need it, so we add a lightweight
    // way to add code if a hook is augmented. e.g.:
    //   struct Uniforms {
    //   // @p5 ifdef Vertex getWorldInputs
    //     uModelMatrix: mat4f,
    //     uViewMatrix: mat4f,
    //   // @p5 endif
    //   // @p5 ifndef Vertex getWorldInputs
    //     uModelViewMatrix: mat4f,
    //   // @p5 endif
    //   }
    src = src.replace(
      /\/\/ @p5 (ifdef|ifndef) (\w+)\s+(\w+)\n((?:(?!\/\/ @p5)(?:.|\n))*)\/\/ @p5 endif/g,
      (_, condition, hookType, hookName, body) => {
        const target = condition === 'ifdef';
        if (
          (
            !!shader.hooks.modified.vertex[`${hookType} ${hookName}`] ||
            !!shader.hooks.modified.fragment[`${hookType} ${hookName}`]
          ) === target
        ) {
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

    return preMain + '\n' + defines + hooks + main + postMain;
  }

  //////////////////////////////////////////////
  // Buffer management for pixel reading
  //////////////////////////////////////////////

  _ensurePixelReadBuffer(requiredSize) {
    // Create or resize staging buffer if needed
    if (!this.pixelReadBuffer || this.pixelReadBufferSize < requiredSize) {
      // Clean up old buffer
      if (this.pixelReadBuffer) {
        this.pixelReadBuffer.destroy();
      }

      // Create new buffer with padding to avoid frequent recreations
      // Scale by 2 to ensure integer size and reasonable headroom
      const bufferSize = Math.max(requiredSize, this.pixelReadBufferSize * 2);
      this.pixelReadBuffer = this.device.createBuffer({
        size: bufferSize,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
      this.pixelReadBufferSize = bufferSize;
    }
    return this.pixelReadBuffer;
  }

  _alignBytesPerRow(bytesPerRow) {
    // WebGPU requires bytesPerRow to be a multiple of 256 bytes for texture-to-buffer copies
    return Math.ceil(bytesPerRow / 256) * 256;
  }

  //////////////////////////////////////////////
  // Framebuffer methods
  //////////////////////////////////////////////

  defaultFramebufferAlpha() {
    return true
  }

  defaultFramebufferAntialias() {
    return true;
  }

  supportsFramebufferAntialias() {
    return true;
  }

  createFramebufferResources(framebuffer) {
  }

  validateFramebufferFormats(framebuffer) {
    if (![
      constants.UNSIGNED_BYTE,
      constants.FLOAT,
      constants.HALF_FLOAT
    ].includes(framebuffer.format)) {
      console.warn(
        'Unknown Framebuffer format. ' +
          'Please use UNSIGNED_BYTE, FLOAT, or HALF_FLOAT. ' +
          'Defaulting to UNSIGNED_BYTE.'
      );
      framebuffer.format = constants.UNSIGNED_BYTE;
    }

    if (framebuffer.useDepth && ![
      constants.UNSIGNED_INT,
      constants.FLOAT
    ].includes(framebuffer.depthFormat)) {
      console.warn(
        'Unknown Framebuffer depth format. ' +
          'Please use UNSIGNED_INT or FLOAT. Defaulting to FLOAT.'
      );
      framebuffer.depthFormat = constants.FLOAT;
    }
  }

  recreateFramebufferTextures(framebuffer) {
    // Clean up existing textures
    if (framebuffer.colorTexture && framebuffer.colorTexture.destroy) {
      framebuffer.colorTexture.destroy();
    }
    if (framebuffer.aaColorTexture && framebuffer.aaColorTexture.destroy) {
      framebuffer.aaColorTexture.destroy();
    }
    if (framebuffer.depthTexture && framebuffer.depthTexture.destroy) {
      framebuffer.depthTexture.destroy();
    }
    if (framebuffer.aaDepthTexture && framebuffer.aaDepthTexture.destroy) {
      framebuffer.aaDepthTexture.destroy();
    }

    const baseDescriptor = {
      size: {
        width: framebuffer.width * framebuffer.density,
        height: framebuffer.height * framebuffer.density,
        depthOrArrayLayers: 1,
      },
      format: this._getWebGPUColorFormat(framebuffer),
    };

    // Create non-multisampled texture for texture binding (always needed)
    const colorTextureDescriptor = {
      ...baseDescriptor,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
      sampleCount: 1,
    };
    framebuffer.colorTexture = this.device.createTexture(colorTextureDescriptor);

    // Create multisampled texture for rendering if antialiasing is enabled
    if (framebuffer.antialias) {
      const aaColorTextureDescriptor = {
        ...baseDescriptor,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
        sampleCount: this._getValidSampleCount(framebuffer.antialiasSamples),
      };
      framebuffer.aaColorTexture = this.device.createTexture(aaColorTextureDescriptor);
    }

    if (framebuffer.useDepth) {
      const depthBaseDescriptor = {
        size: {
          width: framebuffer.width * framebuffer.density,
          height: framebuffer.height * framebuffer.density,
          depthOrArrayLayers: 1,
        },
        format: this._getWebGPUDepthFormat(framebuffer),
      };

      // Create non-multisampled depth texture for texture binding (always needed)
      const depthTextureDescriptor = {
        ...depthBaseDescriptor,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        sampleCount: 1,
      };
      framebuffer.depthTexture = this.device.createTexture(depthTextureDescriptor);

      // Create multisampled depth texture for rendering if antialiasing is enabled
      if (framebuffer.antialias) {
        const aaDepthTextureDescriptor = {
          ...depthBaseDescriptor,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
          sampleCount: this._getValidSampleCount(framebuffer.antialiasSamples),
        };
        framebuffer.aaDepthTexture = this.device.createTexture(aaDepthTextureDescriptor);
      }
    }

    // Clear the framebuffer textures after creation
    this._clearFramebufferTextures(framebuffer);
  }

  _clearFramebufferTextures(framebuffer) {
    const commandEncoder = this.device.createCommandEncoder();

    // Clear the color texture (and multisampled texture if it exists)
    const colorTexture = framebuffer.aaColorTexture || framebuffer.colorTexture;
    const colorAttachment = {
      view: colorTexture.createView(),
      loadOp: "clear",
      storeOp: "store",
      clearValue: { r: 0, g: 0, b: 0, a: 0 },
      resolveTarget: framebuffer.aaColorTexture ?
        framebuffer.colorTexture.createView() : undefined,
    };

    // Clear the depth texture if it exists
    const depthTexture = framebuffer.aaDepthTexture || framebuffer.depthTexture;
    const depthStencilAttachment = depthTexture ? {
      view: depthTexture.createView(),
      depthLoadOp: "clear",
      depthStoreOp: "store",
      depthClearValue: 1.0,
      stencilLoadOp: "clear",
      stencilStoreOp: "store",
      depthReadOnly: false,
      stencilReadOnly: false,
    } : undefined;

    const renderPassDescriptor = {
      colorAttachments: [colorAttachment],
      depthStencilAttachment: depthStencilAttachment,
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end();

    this.queue.submit([commandEncoder.finish()]);
  }

  _getFramebufferColorTextureView(framebuffer) {
    if (framebuffer.colorTexture) {
      return framebuffer.colorTexture.createView();
    }
    return null;
  }

  createFramebufferTextureHandle(framebufferTexture) {
    const src = framebufferTexture;
    let renderer = this;
    return {
      get view() {
        return renderer._getFramebufferColorTextureView(src.framebuffer);
      },
      get gpuTexture() {
        return src.framebuffer.colorTexture;
      }
    };
  }

  _getWebGPUColorFormat(framebuffer) {
    if (framebuffer.format === constants.FLOAT) {
      return framebuffer.channels === RGBA ? 'rgba32float' : 'rgba32float';
    } else if (framebuffer.format === constants.HALF_FLOAT) {
      return framebuffer.channels === RGBA ? 'rgba16float' : 'rgba16float';
    } else {
      return framebuffer.channels === RGBA ? 'rgba8unorm' : 'rgba8unorm';
    }
  }

  _getWebGPUDepthFormat(framebuffer) {
    if (framebuffer.useStencil) {
      return framebuffer.depthFormat === constants.FLOAT ? 'depth32float-stencil8' : 'depth24plus-stencil8';
    } else {
      return framebuffer.depthFormat === constants.FLOAT ? 'depth32float' : 'depth24plus';
    }
  }

  _deleteFramebufferTexture(texture) {
    const handle = texture.rawTexture();
    if (handle.texture && handle.texture.destroy) {
      handle.texture.destroy();
    }
    this.textures.delete(texture);
  }

  deleteFramebufferTextures(framebuffer) {
    this._deleteFramebufferTexture(framebuffer.color)
    if (framebuffer.depth) this._deleteFramebufferTexture(framebuffer.depth);
  }

  deleteFramebufferResources(framebuffer) {
    if (framebuffer.colorTexture && framebuffer.colorTexture.destroy) {
      framebuffer.colorTexture.destroy();
    }
    if (framebuffer.depthTexture && framebuffer.depthTexture.destroy) {
      framebuffer.depthTexture.destroy();
    }
    if (framebuffer.aaDepthTexture && framebuffer.aaDepthTexture.destroy) {
      framebuffer.aaDepthTexture.destroy();
    }
  }

  getFramebufferToBind(framebuffer) {
  }

  updateFramebufferTexture(framebuffer, property) {
    // No-op for WebGPU since antialiasing is handled at pipeline level
  }

  bindFramebuffer(framebuffer) {}

  async readFramebufferPixels(framebuffer) {
    const width = framebuffer.width * framebuffer.density;
    const height = framebuffer.height * framebuffer.density;
    const bytesPerPixel = 4;
    const unalignedBytesPerRow = width * bytesPerPixel;
    const alignedBytesPerRow = this._alignBytesPerRow(unalignedBytesPerRow);
    const bufferSize = alignedBytesPerRow * height;

    // const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);
    const stagingBuffer = this.device.createBuffer({
      size: bufferSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
      {
        texture: framebuffer.colorTexture,
        origin: { x: 0, y: 0, z: 0 },
        mipLevel: 0,
        aspect: 'all'
      },
      { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow, rowsPerImage: height },
      { width, height, depthOrArrayLayers: 1 }
    );

    this.device.queue.submit([commandEncoder.finish()]);

    // Wait for the copy operation to complete
    // await this.queue.onSubmittedWorkDone();

    await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
    const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);

    // If alignment was needed, extract the actual pixel data
    if (alignedBytesPerRow === unalignedBytesPerRow) {
      const result = new Uint8Array(mappedRange.slice(0, width * height * bytesPerPixel));
      stagingBuffer.unmap();
      return result;
    } else {
      // Need to extract pixel data from aligned buffer
      const result = new Uint8Array(width * height * bytesPerPixel);
      const mappedData = new Uint8Array(mappedRange);
      for (let y = 0; y < height; y++) {
        const srcOffset = y * alignedBytesPerRow;
        const dstOffset = y * unalignedBytesPerRow;
        result.set(mappedData.subarray(srcOffset, srcOffset + unalignedBytesPerRow), dstOffset);
      }
      stagingBuffer.unmap();
      return result;
    }
  }

  async readFramebufferPixel(framebuffer, x, y) {
    // Ensure all pending GPU work is complete before reading pixels
    await this.queue.onSubmittedWorkDone();

    const bytesPerPixel = 4;
    const alignedBytesPerRow = this._alignBytesPerRow(bytesPerPixel);
    const bufferSize = alignedBytesPerRow;

    const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);

    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
      {
        texture: framebuffer.colorTexture,
        origin: { x, y, z: 0 }
      },
      { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow },
      { width: 1, height: 1, depthOrArrayLayers: 1 }
    );

    this.device.queue.submit([commandEncoder.finish()]);

    await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
    const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);
    const pixelData = new Uint8Array(mappedRange);
    const result = [pixelData[0], pixelData[1], pixelData[2], pixelData[3]];

    stagingBuffer.unmap();
    return result;
  }

  async readFramebufferRegion(framebuffer, x, y, w, h) {
    // Ensure all pending GPU work is complete before reading pixels
    await this.queue.onSubmittedWorkDone();

    const width = w * framebuffer.density;
    const height = h * framebuffer.density;
    const bytesPerPixel = 4;
    const unalignedBytesPerRow = width * bytesPerPixel;
    const alignedBytesPerRow = this._alignBytesPerRow(unalignedBytesPerRow);
    const bufferSize = alignedBytesPerRow * height;

    const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);

    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
      {
        texture: framebuffer.colorTexture,
        mipLevel: 0,
        origin: { x: x * framebuffer.density, y: y * framebuffer.density, z: 0 }
      },
      { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow },
      { width, height, depthOrArrayLayers: 1 }
    );

    this.device.queue.submit([commandEncoder.finish()]);

    await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
    const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);

    let pixelData;
    if (alignedBytesPerRow === unalignedBytesPerRow) {
      pixelData = new Uint8Array(mappedRange.slice(0, width * height * bytesPerPixel));
    } else {
      // Need to extract pixel data from aligned buffer
      pixelData = new Uint8Array(width * height * bytesPerPixel);
      const mappedData = new Uint8Array(mappedRange);
      for (let y = 0; y < height; y++) {
        const srcOffset = y * alignedBytesPerRow;
        const dstOffset = y * unalignedBytesPerRow;
        pixelData.set(mappedData.subarray(srcOffset, srcOffset + unalignedBytesPerRow), dstOffset);
      }
    }

    // WebGPU doesn't need vertical flipping unlike WebGL
    const region = new Image(width, height);
    region.imageData = region.canvas.getContext('2d').createImageData(width, height);
    region.imageData.data.set(pixelData);
    region.pixels = region.imageData.data;
    region.updatePixels();

    if (framebuffer.density !== 1) {
      region.pixelDensity(framebuffer.density);
    }

    stagingBuffer.unmap();
    return region;
  }

  updateFramebufferPixels(framebuffer) {
    const width = framebuffer.width * framebuffer.density;
    const height = framebuffer.height * framebuffer.density;
    const bytesPerPixel = 4;

    const expectedLength = width * height * bytesPerPixel;
    if (!framebuffer.pixels || framebuffer.pixels.length !== expectedLength) {
      throw new Error(
        'The pixels array has not been set correctly. Please call loadPixels() before updatePixels().'
      );
    }

    this.device.queue.writeTexture(
      { texture: framebuffer.colorTexture },
      framebuffer.pixels,
      {
        bytesPerRow: width * bytesPerPixel,
        rowsPerImage: height
      },
      { width, height, depthOrArrayLayers: 1 }
    );
  }

  //////////////////////////////////////////////
  // Main canvas pixel methods
  //////////////////////////////////////////////

  _ensureCanvasReadbackTexture() {
    if (!this.canvasReadbackTexture) {
      const width = Math.ceil(this.width * this._pixelDensity);
      const height = Math.ceil(this.height * this._pixelDensity);

      this.canvasReadbackTexture = this.device.createTexture({
        size: { width, height, depthOrArrayLayers: 1 },
        format: this.presentationFormat,
        usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
      });
    }
    return this.canvasReadbackTexture;
  }

  _copyCanvasToReadbackTexture() {
    // Get the current canvas texture BEFORE any awaiting
    const canvasTexture = this.drawingContext.getCurrentTexture();

    // Ensure readback texture exists
    const readbackTexture = this._ensureCanvasReadbackTexture();

    // Copy canvas texture to readback texture immediately
    const copyEncoder = this.device.createCommandEncoder();
    copyEncoder.copyTextureToTexture(
      { texture: canvasTexture },
      { texture: readbackTexture },
      {
        width: Math.ceil(this.width * this._pixelDensity),
        height: Math.ceil(this.height * this._pixelDensity),
        depthOrArrayLayers: 1
      }
    );
    this.device.queue.submit([copyEncoder.finish()]);

    return readbackTexture;
  }

  _convertBGRtoRGB(pixelData) {
    // Convert BGR to RGB by swapping red and blue channels
    for (let i = 0; i < pixelData.length; i += 4) {
      const temp = pixelData[i];     // Store red
      pixelData[i] = pixelData[i + 2]; // Red = Blue
      pixelData[i + 2] = temp;         // Blue = Red
      // Green (i + 1) and Alpha (i + 3) stay the same
    }
    return pixelData;
  }

  async loadPixels() {
    const width = this.width * this._pixelDensity;
    const height = this.height * this._pixelDensity;

    // Copy canvas to readback texture
    const readbackTexture = this._copyCanvasToReadbackTexture();

    // Now we can safely await
    await this.queue.onSubmittedWorkDone();

    const bytesPerPixel = 4;
    const unalignedBytesPerRow = width * bytesPerPixel;
    const alignedBytesPerRow = this._alignBytesPerRow(unalignedBytesPerRow);
    const bufferSize = alignedBytesPerRow * height;

    const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);

    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
      { texture: readbackTexture },
      { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow },
      { width, height, depthOrArrayLayers: 1 }
    );

    this.device.queue.submit([commandEncoder.finish()]);

    await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
    const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);

    if (alignedBytesPerRow === unalignedBytesPerRow) {
      this.pixels = new Uint8Array(mappedRange.slice(0, width * height * bytesPerPixel));
    } else {
      // Need to extract pixel data from aligned buffer
      this.pixels = new Uint8Array(width * height * bytesPerPixel);
      const mappedData = new Uint8Array(mappedRange);
      for (let y = 0; y < height; y++) {
        const srcOffset = y * alignedBytesPerRow;
        const dstOffset = y * unalignedBytesPerRow;
        this.pixels.set(mappedData.subarray(srcOffset, srcOffset + unalignedBytesPerRow), dstOffset);
      }
    }

    // Convert BGR to RGB for main canvas
    this._convertBGRtoRGB(this.pixels);

    stagingBuffer.unmap();
    return this.pixels;
  }

  async _getPixel(x, y) {
    // Copy canvas to readback texture
    const readbackTexture = this._copyCanvasToReadbackTexture();

    // Now we can safely await
    await this.queue.onSubmittedWorkDone();

    const bytesPerPixel = 4;
    const alignedBytesPerRow = this._alignBytesPerRow(bytesPerPixel);
    const bufferSize = alignedBytesPerRow;

    const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);

    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
      {
        texture: readbackTexture,
        origin: { x, y, z: 0 }
      },
      { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow },
      { width: 1, height: 1, depthOrArrayLayers: 1 }
    );

    this.device.queue.submit([commandEncoder.finish()]);

    await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
    const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);
    const pixelData = new Uint8Array(mappedRange);

    // Convert BGR to RGB for main canvas - swap red and blue
    const result = [pixelData[2], pixelData[1], pixelData[0], pixelData[3]];

    stagingBuffer.unmap();
    return result;
  }

  async get(x, y, w, h) {
    const pd = this._pixelDensity;

    if (typeof x === 'undefined' && typeof y === 'undefined') {
      // get() - return entire canvas
      x = y = 0;
      w = this.width;
      h = this.height;
    } else {
      x *= pd;
      y *= pd;

      if (typeof w === 'undefined' && typeof h === 'undefined') {
        // get(x,y) - single pixel
        if (x < 0 || y < 0 || x >= this.width * pd || y >= this.height * pd) {
          return [0, 0, 0, 0];
        }

        return this._getPixel(x, y);
      }
      // get(x,y,w,h) - region
    }

    // Copy canvas to readback texture
    const readbackTexture = this._copyCanvasToReadbackTexture();

    // Now we can safely await
    await this.queue.onSubmittedWorkDone();

    // Read region and create p5.Image
    const width = w * pd;
    const height = h * pd;
    const bytesPerPixel = 4;
    const unalignedBytesPerRow = width * bytesPerPixel;
    const alignedBytesPerRow = this._alignBytesPerRow(unalignedBytesPerRow);
    const bufferSize = alignedBytesPerRow * height;

    const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);

    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyTextureToBuffer(
      {
        texture: readbackTexture,
        origin: { x, y, z: 0 }
      },
      { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow },
      { width, height, depthOrArrayLayers: 1 }
    );

    this.device.queue.submit([commandEncoder.finish()]);
    await this.queue.onSubmittedWorkDone();

    await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
    const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);

    let pixelData;
    if (alignedBytesPerRow === unalignedBytesPerRow) {
      pixelData = new Uint8Array(mappedRange.slice(0, width * height * bytesPerPixel));
    } else {
      // Need to extract pixel data from aligned buffer
      pixelData = new Uint8Array(width * height * bytesPerPixel);
      const mappedData = new Uint8Array(mappedRange);
      for (let y = 0; y < height; y++) {
        const srcOffset = y * alignedBytesPerRow;
        const dstOffset = y * unalignedBytesPerRow;
        pixelData.set(mappedData.subarray(srcOffset, srcOffset + unalignedBytesPerRow), dstOffset);
      }
    }

    // Convert BGR to RGB for main canvas
    this._convertBGRtoRGB(pixelData);

    const region = new Image(width, height);
    region.pixelDensity(pd);
    const ctx = region.canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixelData);
    ctx.putImageData(imageData, 0, 0);

    stagingBuffer.unmap();
    return region;
  }
}

function rendererWebGPU(p5, fn) {
  p5.RendererWebGPU = RendererWebGPU;

  p5.renderers[constants.WEBGPU] = p5.RendererWebGPU;
  fn.ensureTexture = function(source) {
    return this._renderer.ensureTexture(source);
  }

  // TODO: move this and the duplicate in the WebGL renderer to another file
  fn.setAttributes = async function (key, value) {
    return this._renderer._setAttributes(key, value);
  }
}

export default rendererWebGPU;
export { RendererWebGPU };
