import * as constants from '../core/constants';
import { getStrokeDefs } from '../webgl/enums';
import { DataType } from '../strands/ir_types.js';

import { colorVertexShader, colorFragmentShader } from './shaders/color';
import { lineVertexShader, lineFragmentShader} from './shaders/line';
import { materialVertexShader, materialFragmentShader } from './shaders/material';
import { fontVertexShader, fontFragmentShader } from './shaders/font';
import { blitVertexShader, blitFragmentShader } from './shaders/blit';
import { wgslBackend } from './strands_wgslBackend';
import noiseWGSL from './shaders/functions/noise3DWGSL';
import { baseFilterVertexShader, baseFilterFragmentShader } from './shaders/filters/base';
import { imageLightVertexShader, imageLightDiffusedFragmentShader, imageLightSpecularFragmentShader } from './shaders/imageLight';
import { baseComputeShader } from './shaders/compute';

const FRAME_STATE = {
  PENDING: 0,
  UNPROMOTED: 1,
  PROMOTED: 2
};

function rendererWebGPU(p5, fn) {
  const { lineDefs } = getStrokeDefs((n, v, t) => `const ${n}: ${t} = ${v};\n`);

  // RendererWebGPU depends on these other classes being set up prior,
  // as it is optimized for being in a standalone build, not core
  const {
    Renderer3D,
    Shader,
    Texture,
    MipmapTexture,
    Image,
    Camera,
    RGBA,
  } = p5;

  class RendererWebGPU extends Renderer3D {
    constructor(pInst, w, h, isMainCanvas, elt) {
      super(pInst, w, h, isMainCanvas, elt)

      // Used to group draws into one big render pass
      this.activeRenderPass = null;
      this.activeRenderPassEncoder = null;
      this.activeShaderOptions = null;
      this.activeShader = null;

      this.samplers = new Map();

      // Some uniforms update every frame, like model matrices and sometimes colors.
      // The fastest way to handle these is to use mapped memory. We'll batch those
      // into bigger buffers with dynamic offsets, separate from the usual system
      // where bind groups have their own little buffers that get cached when they
      // are unchanged
      this.uniformBufferAlignment = 256;
      this.activeUniformBuffers = [];
      this.currentUniformBuffer = undefined;
      this.uniformBufferPool = [];
      this.resettingUniformBuffers = [];

      this.dynamicEntryOffsets = new Uint32Array(64);

      // Cache for current frame's canvas texture view
      this.currentCanvasColorTexture = null;
      this.currentCanvasColorTextureView = null;

      // Single reusable staging buffer for pixel reading
      this.pixelReadBuffer = null;
      this.pixelReadBufferSize = 0;

      this.strandsBackend = wgslBackend;

      // Registry to track all shaders for uniform data pooling
      this._shadersWithPools = [];

      // Registry to track geometries with buffer pools
      this._geometriesWithPools = [];

      // Flag to track if any draws have happened that need queue submission
      this._hasPendingDraws = false;
      this._pendingCommandEncoders = [];

      // Queue of callbacks to run after next submit (mainly for safe texture deletion)
      this._postSubmitCallbacks = [];

      // Retired buffers to destroy at end of frame
      this._retiredBuffers = [];

      // Storage buffers for compute shaders
      this._storageBuffers = new Set();

      // 2D canvas for pixel reading fallback
      this._pixelReadCanvas = null;
      this._pixelReadCtx = null;
      this.mainFramebuffer = null;
      this._frameState = FRAME_STATE.PENDING;

      this.finalCamera = new Camera(this);
      this.finalCamera._computeCameraDefaultSettings();
      this.finalCamera._setDefaultCamera();

      this.depthFormat = 'depth24plus-stencil8';
      this.depthTexture = null;
      this.depthTextureView = null;
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
      this.device = await this.adapter?.requestDevice({
        // Todo: check support
        requiredFeatures: ['depth32float-stencil8']
      });
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
        alphaMode: 'premultiplied',
      });

      // TODO disablable stencil
      this.mainFramebuffer = this.createFramebuffer({ _useCanvasFormat: true });
      this._updateSize();
      this._update();
      this.flushDraw();
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
      if (!this.device || !this.depthFormat) return;
      if (this.depthTexture && this.depthTexture.destroy) {
        this.flushDraw();
        const textureToDestroy = this.depthTexture;
        this._postSubmitCallbacks.push(() => textureToDestroy.destroy());
        this.depthTextureView = null;
      }
      this.depthTexture = this.device.createTexture({
        size: {
          width: Math.ceil(this.width * this._pixelDensity),
          height: Math.ceil(this.height * this._pixelDensity),
          depthOrArrayLayers: 1,
        },
        format: this.depthFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      });
      this.depthTextureView = this.depthTexture.createView();

      // Clear the main canvas after resize
      this.clear();
    }

    _getCanvasColorTextureView() {
      const canvasTexture = this.drawingContext.getCurrentTexture();
      // If texture changed (new frame), update cache
      if (this.currentCanvasColorTexture !== canvasTexture) {
        this.currentCanvasColorTexture = canvasTexture;
        this.currentCanvasColorTextureView = canvasTexture.createView();
      }
      return this.currentCanvasColorTextureView;
    }

    _beginActiveRenderPass() {
      if (this.activeRenderPass) return;

      // Use framebuffer texture if active, otherwise use canvas texture
      const activeFramebuffer = this.activeFramebuffer();

      const colorAttachment = {
        view: activeFramebuffer
          ? (activeFramebuffer.aaColorTexture
              ? activeFramebuffer.aaColorTextureView
              : activeFramebuffer.colorTextureView)
          : this._getCanvasColorTextureView(),
        loadOp: "load",
        storeOp: "store",
        // If using multisampled texture, resolve to non-multisampled texture
        resolveTarget: activeFramebuffer && activeFramebuffer.aaColorTexture
          ? activeFramebuffer.colorTextureView
          : undefined,
      };

      // Use framebuffer depth texture if active, otherwise use canvas depth texture
      const depthTextureView = activeFramebuffer
        ? (activeFramebuffer.aaDepthTexture
            ? activeFramebuffer.aaDepthTextureView
            : activeFramebuffer.depthTextureView)
        : this.depthTextureView;
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
      const commandEncoder = this.device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      this.activeRenderPassEncoder = commandEncoder;
      this.activeRenderPass = passEncoder;
    }

    _finishActiveRenderPass() {
      if (!this.activeRenderPass) return;

      const commandEncoder = this.activeRenderPassEncoder;
      const passEncoder = this.activeRenderPass;
      passEncoder.end();

      // Store the command encoder for later submission
      this._pendingCommandEncoders.push(commandEncoder.finish());
      this.activeRenderPassEncoder = null;
      this.activeRenderPass = null;
      this.activeShader = null;
      this.activeShaderOptions = null;
    }

    clear(...args) {
      if (!this.device || !this.drawingContext) return;
      const _r = args[0] || 0;
      const _g = args[1] || 0;
      const _b = args[2] || 0;
      const _a = args[3] || 0;

      // If PENDING and no custom framebuffer, clear means stay UNPROMOTED
      if (this._frameState === FRAME_STATE.PENDING && !this.activeFramebuffer()) {
        this._frameState = FRAME_STATE.UNPROMOTED;
      }

      this._finishActiveRenderPass();

      const commandEncoder = this.device.createCommandEncoder();

      // Use framebuffer texture if active, otherwise use canvas texture
      const activeFramebuffer = this.activeFramebuffer();

      const colorAttachment = {
        view: activeFramebuffer
          ? (activeFramebuffer.aaColorTexture
              ? activeFramebuffer.aaColorTextureView
              : activeFramebuffer.colorTextureView)
          : this._getCanvasColorTextureView(),
        clearValue: { r: _r * _a, g: _g * _a, b: _b * _a, a: _a },
        loadOp: 'clear',
        storeOp: 'store',
        // If using multisampled texture, resolve to non-multisampled texture
        resolveTarget: activeFramebuffer && activeFramebuffer.aaColorTexture
          ? activeFramebuffer.colorTextureView
          : undefined,
      };

      // Use framebuffer depth texture if active, otherwise use canvas depth texture
      const depthTextureView = activeFramebuffer
        ? (activeFramebuffer.aaDepthTexture
            ? activeFramebuffer.aaDepthTextureView
            : activeFramebuffer.depthTextureView)
        : this.depthTextureView;
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

      this._pendingCommandEncoders.push(commandEncoder.finish());
      this._hasPendingDraws = true;
    }

    /**
     * Resets all depth information so that nothing previously drawn will
     * occlude anything subsequently drawn.
     */
    clearDepth(depth = 1) {
      if (!this.device || !this.depthTextureView) return;
      this._finishActiveRenderPass();
      const commandEncoder = this.device.createCommandEncoder();

      // Use framebuffer texture if active, otherwise use canvas texture
      const activeFramebuffer = this.activeFramebuffer();

      // Use framebuffer depth texture if active, otherwise use canvas depth texture
      const depthTextureView = activeFramebuffer
        ? (activeFramebuffer.aaDepthTexture
            ? activeFramebuffer.aaDepthTextureView
            : activeFramebuffer.depthTextureView)
        : this.depthTextureView;

      if (!depthTextureView) {
        // No depth buffer to clear
        return;
      }

      const depthAttachment = {
        view: depthTextureView,
        depthClearValue: depth,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
        stencilLoadOp: 'load',
        stencilStoreOp: 'store',
      };

      const renderPassDescriptor = {
        colorAttachments: [], // No color attachments, we're only clearing depth
        depthStencilAttachment: depthAttachment,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.end();

      this._pendingCommandEncoders.push(commandEncoder.finish());
      this._hasPendingDraws = true;
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

      // Check if we already have a buffer for this data
      let existingBuffer = buffers[dst];
      const needsNewBuffer = !existingBuffer;

      // Only create new buffer and write data if buffer doesn't exist or data is dirty
      if (needsNewBuffer || geometry.dirtyFlags[src] !== false) {
        const raw = map ? map(srcData) : srcData;
        const typed = this._normalizeBufferData(raw, Float32Array);

        // Get pooled buffer (may reuse existing or create new)
        const pooledBufferInfo = this._getVertexBufferFromPool(geometry, dst, typed.byteLength);

        // Create a copy of the data to avoid conflicts when geometry arrays are reset
        const dataCopy = new typed.constructor(typed);
        pooledBufferInfo.dataCopy = dataCopy;

        // Write the data to the pooled buffer
        device.queue.writeBuffer(pooledBufferInfo.buffer, 0, dataCopy);

        // Update the buffers cache to use the pooled buffer
        buffers[dst] = pooledBufferInfo.buffer;
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
        this.registerEnabled.add(loc);
      }
    }

    _ensureGeometryBuffers(buffers, indices, indexType) {
      if (!indices) return;

      const device = this.device;

      const buffer = device.createBuffer({
        size: Math.ceil((indices.length * indexType.BYTES_PER_ELEMENT) / 4) * 4,
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

      freeDefs(this.buffers.stroke);
      freeDefs(this.buffers.fill);
      freeDefs(this.buffers.user);
    }

    _getValidSampleCount(requestedCount) {
      // WebGPU supports sample counts of 1, 4 (and sometimes 8)
      if (requestedCount <= 1) return 1;
      if (requestedCount <= 4) return 4;
      return 4; // Cap at 4 for broader compatibility
    }

    _shaderOptions({ mode, compute, workgroupSize }) {
      if (compute) return { compute: true, workgroupSize };
      const activeFramebuffer = this.activeFramebuffer();
      const format = activeFramebuffer ?
        this._getWebGPUColorFormat(activeFramebuffer) :
        this.presentationFormat;

      const requestedSampleCount = activeFramebuffer ?
        (activeFramebuffer.antialias ? activeFramebuffer.antialiasSamples : 1) :
        1;  // No MSAA needed when blitting already-antialiased textures to canvas
      const sampleCount = this._getValidSampleCount(requestedSampleCount);

      const depthFormat = activeFramebuffer && activeFramebuffer.useDepth ?
        this._getWebGPUDepthFormat(activeFramebuffer) :
        this.depthFormat;

      const drawTarget = this.drawTarget();
      const clipping = this._clipping;
      const clipApplied = drawTarget._isClipApplied;

      return {
        topology: mode === constants.TRIANGLE_STRIP ? 'triangle-strip' : 'triangle-list',
        blendMode: this.states.curBlendMode,
        sampleCount,
        format,
        depthFormat,
        clipping,
        clipApplied,
      }
    }

    _shaderOptionsDifferent(newOptions) {
      if (!this.activeShaderOptions) return true;
      for (const key in this.activeShaderOptions) {
        if (this.activeShaderOptions[key] !== newOptions[key]) return true;
      }
      return false;
    }

    _initShader(shader) {
      const device = this.device;

      if (shader.shaderType === 'compute') {
        // Compute shader initialization
        shader.computeModule = device.createShaderModule({ code: shader.computeSrc() });
        shader._computePipelineCache = null;
        shader._workgroupSize = null;

        // Create compute pipeline (deferred until first compute() call)
        shader.getPipeline = ({ workgroupSize }) => {
          if (!shader._computePipelineCache) {
            shader._computePipelineCache = device.createComputePipeline({
              layout: shader._pipelineLayout,
              compute: {
                module: shader.computeModule,
                entryPoint: 'main'
              }
            });
            shader._workgroupSize = workgroupSize;
          }
          return shader._computePipelineCache;
        };

        return;
      }

      // Render shader initialization
      shader.vertModule = device.createShaderModule({ code: shader.vertSrc() });
      shader.fragModule = device.createShaderModule({ code: shader.fragSrc() });

      shader._pipelineCache = new Map();
      shader.getPipeline = ({ topology, blendMode, sampleCount, format, depthFormat, clipping, clipApplied }) => {
        const key = `${topology}_${blendMode}_${sampleCount}_${format}_${depthFormat}_${clipping}_${clipApplied}`;
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
              depthWriteEnabled: !clipping,
              depthCompare: 'less-equal',
              stencilFront: {
                compare: clipping ? 'always' : (clipApplied ? 'not-equal' : 'always'),
                failOp: 'keep',
                depthFailOp: 'keep',
                passOp: clipping ? 'replace' : 'keep',
              },
              stencilBack: {
                compare: clipping ? 'always' : (clipApplied ? 'not-equal' : 'always'),
                failOp: 'keep',
                depthFailOp: 'keep',
                passOp: clipping ? 'replace' : 'keep',
              },
              stencilReadMask: 0xFF,
              stencilWriteMask: clipping ? 0xFF : 0x00,
            },
          });
          shader._pipelineCache.set(key, pipeline);
        }
        return shader._pipelineCache.get(key);
      }
    }

    _finalizeShader(shader) {
      // Per-group buffer pools. We will pull from these when we draw multiple
      // times using the shader in a render pass. These are per group instead of
      // global so that we can reuse the last used buffer when uniform values
      // don't change.
      shader._uniformBufferGroups = [];
      shader.buffersDirty = new Set();

      for (const group of shader._uniformGroups) {
        // Calculate the size needed for this group's uniforms
        const groupUniforms = Object.values(group.uniforms);
        const rawSize = Math.max(
          0,
          ...groupUniforms.map(u => u.offsetEnd)
        );
        const alignedSize = Math.ceil(rawSize / 16) * 16;

        shader._uniformBufferGroups.push({
          group: group.group,
          binding: group.binding,
          cacheKey: group.group * 1000 + group.binding,
          varName: group.varName,
          structType: group.structType,
          uniforms: groupUniforms,
          size: alignedSize,

          bufferPool: [],
          nextBufferPool: [],

          dynamic: groupUniforms.some(u => u.name.startsWith('uModel')),
          buffersInUse: new Set(),
          currentBuffer: null, // For caching
        });
      }

      // Register this shader in our registry for pool cleanup
      this._shadersWithPools.push(shader);

      const bindGroupLayouts = new Map(); // group index -> bindGroupLayout
      const groupEntries = new Map(); // group index -> array of entries

      // Add all uniform group bindings to group 0
      const structEntries = new Map();
      for (const bufferGroup of shader._uniformBufferGroups) {
        const entries = structEntries.get(bufferGroup.group) || [];
        entries.push({
          bufferGroup,
          binding: bufferGroup.binding,
          visibility: shader.shaderType === 'compute'
            ? GPUShaderStage.COMPUTE
            : GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform', hasDynamicOffset: bufferGroup.dynamic },
        });
        structEntries.set(bufferGroup.group, entries);
      }
      for (const [group, entries] of structEntries.entries()) {
        entries.sort((a, b) => a.binding - b.binding);
        groupEntries.set(group, entries);
      }

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

        entries.sort((a, b) => a.binding - b.binding);
        groupEntries.set(group, entries);
      }

      // Add storage buffer bindings
      for (const storage of shader._storageBuffers || []) {
        const group = storage.group;
        const entries = groupEntries.get(group) || [];

        entries.push({
          binding: storage.binding,
          visibility: storage.visibility,
          buffer: {
            type: storage.accessMode === 'read' ? 'read-only-storage' : 'storage'
          },
          storage: storage,
        });

        entries.sort((a, b) => a.binding - b.binding);
        groupEntries.set(group, entries);
      }

      // Create layouts and bind groups
      const groupEntriesArr = [];
      for (const [group, entries] of groupEntries) {
        const layout = this.device.createBindGroupLayout({ entries });
        bindGroupLayouts.set(group, layout);
        groupEntriesArr.push([group, entries]);
      }

      shader._groupEntries = groupEntriesArr;
      shader._bindGroupLayouts = [...bindGroupLayouts.values()];
      // Reuse bind groups if they don't change
      shader._cachedBindGroup = {};
      // Remember which dynamic buffer we last used, so that we can
      // possibly cache bind groups if unchanged
      shader._lastDynamicBuffer = {};
      shader._pipelineLayout = this.device.createPipelineLayout({
        bindGroupLayouts: shader._bindGroupLayouts,
      });
      shader._compiled = true;
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
      if (!shader._vertexBuffers) {
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
        shader._vertexBuffers = buffers;
      }

      return shader._vertexBuffers;
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
    defaultNearScale() {
      return 0.01;
    }
    defaultFarScale() {
      return 100;
    }

    _resetBuffersBeforeDraw() {
      this._finishActiveRenderPass();
      // Set state to PENDING - we'll decide on first draw
      this._frameState = FRAME_STATE.PENDING;

      // Clear depth buffer but DON'T start any render pass yet
      const activeFramebuffer = this.activeFramebuffer();
      const commandEncoder = this.device.createCommandEncoder();

      const depthTextureView = activeFramebuffer
        ? (activeFramebuffer.aaDepthTexture
            ? activeFramebuffer.aaDepthTextureView
            : activeFramebuffer.depthTextureView)
        : this.depthTextureView;

      if (depthTextureView) {
        const depthAttachment = {
          view: depthTextureView,
          depthClearValue: 1.0,
          depthLoadOp: 'clear',
          depthStoreOp: 'store',
          stencilLoadOp: 'load',
          stencilStoreOp: 'store',
        };
        const renderPassDescriptor = {
          colorAttachments: [],
          depthStencilAttachment: depthAttachment,
        };
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.end();
        this._pendingCommandEncoders.push(commandEncoder.finish());
        this._hasPendingDraws = true;
      }
    }

    /**
     * Promotes the current frame to use mainFramebuffer.
     * Copies current canvas content to mainFramebuffer, then switches to rendering there.
     * @private
     */
    _promoteToFramebuffer() {
      // Already promoted this frame
      if (this._frameState === FRAME_STATE.PROMOTED) {
        return;
      }

      // Already drawing to a custom framebuffer, no promotion needed
      if (this.activeFramebuffer()) {
        return;
      }

      // Flush any pending draws to canvas first
      this.flushDraw();

      // Mark as promoted
      this._frameState = FRAME_STATE.PROMOTED;

      // Get current canvas texture
      const canvasTexture = this.drawingContext.getCurrentTexture();

      // Ensure mainFramebuffer matches canvas size
      if (this.mainFramebuffer.width !== this.width ||
          this.mainFramebuffer.height !== this.height) {
        this.mainFramebuffer.resize(this.width, this.height);
      }

      // Copy canvas textures to mainFramebuffer
      const commandEncoder = this.device.createCommandEncoder();

      // Copy color texture
      commandEncoder.copyTextureToTexture(
        {
          texture: canvasTexture,
          origin: { x: 0, y: 0, z: 0 },
          mipLevel: 0,
        },
        {
          texture: this.mainFramebuffer.colorTexture,
          origin: { x: 0, y: 0, z: 0 },
          mipLevel: 0,
        },
        {
          width: Math.ceil(this.width * this._pixelDensity),
          height: Math.ceil(this.height * this._pixelDensity),
          depthOrArrayLayers: 1,
        }
      );

      // Copy depth texture
      commandEncoder.copyTextureToTexture(
        {
          texture: this.depthTexture,
          origin: { x: 0, y: 0, z: 0 },
          mipLevel: 0,
        },
        {
          texture: this.mainFramebuffer.depthTexture,
          origin: { x: 0, y: 0, z: 0 },
          mipLevel: 0,
        },
        {
          width: Math.ceil(this.width * this._pixelDensity),
          height: Math.ceil(this.height * this._pixelDensity),
          depthOrArrayLayers: 1,
        }
      );

      this._pendingCommandEncoders.push(commandEncoder.finish());
      this._hasPendingDraws = true;

      // We want to make sure the transformation state is the same
      // once we're drawing to the framebuffer, because normally
      // those are reset.
      const savedModelMatrix = this.states.uModelMatrix.copy();
      this.mainFramebuffer.defaultCamera.set(this.states.curCamera);

      this.mainFramebuffer.begin();

      this.states.uModelMatrix.set(savedModelMatrix);
    }

    _promoteToFramebufferWithoutCopy() {
      // Ensure mainFramebuffer matches canvas size
      if (this.mainFramebuffer.width !== this.width ||
          this.mainFramebuffer.height !== this.height) {
        this.mainFramebuffer.resize(this.width, this.height);
      }

      // Mark as promoted WITHOUT copying canvas content
      this._frameState = FRAME_STATE.PROMOTED;

      // Flush any pending draws first
      this.flushDraw();

      // Preserve transformation state
      const savedModelMatrix = this.states.uModelMatrix.copy();
      this.mainFramebuffer.defaultCamera.set(this.states.curCamera);

      // Begin rendering to mainFramebuffer
      this.mainFramebuffer.begin();

      this.states.uModelMatrix.set(savedModelMatrix);
    }

    //////////////////////////////////////////////
    // Geometry buffer pool management
    //////////////////////////////////////////////

    _initializeGeometryBufferPools(geometry) {
      if (geometry._vertexBufferPools) {
        return; // Already initialized
      }

      geometry._vertexBufferPools = {}; // Keyed by buffer type (dst)
      geometry._vertexBuffersInUse = {}; // Keyed by buffer type (dst)
      geometry._vertexBuffersToReturn = {}; // Keyed by buffer type (dst)

      // Register this geometry for pool cleanup
      this._geometriesWithPools.push(geometry);
    }

    _getVertexBufferFromPool(geometry, dst, size) {
      // Initialize pools if needed
      this._initializeGeometryBufferPools(geometry);

      // Get or create pool for this buffer type
      if (!geometry._vertexBufferPools[dst]) {
        geometry._vertexBufferPools[dst] = [];
      }
      if (!geometry._vertexBuffersInUse[dst]) {
        geometry._vertexBuffersInUse[dst] = [];
      }
      if (!geometry._vertexBuffersToReturn[dst]) {
        geometry._vertexBuffersToReturn[dst] = [];
      }

      // Try to get a buffer from the pool
      const pool = geometry._vertexBufferPools[dst];
      if (pool.length > 0) {
        const bufferInfo = pool.pop();
        // Check if buffer is large enough
        if (bufferInfo.buffer.size >= size) {
          geometry._vertexBuffersInUse[dst].push(bufferInfo);
          return bufferInfo;
        } else {
          // Buffer too small, don't destroy immediately as it may still be in use
          // Add to retirement array
          this._retiredBuffers.push(bufferInfo.buffer);
        }
      }

      // No suitable buffer available, create a new one
      const newBuffer = this.device.createBuffer({
        size,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });

      const bufferInfo = {
        buffer: newBuffer,
        size,
        // Create a copy of the data array to avoid conflicts when geometry is reset
        dataCopy: null
      };

      geometry._vertexBuffersInUse[dst].push(bufferInfo);
      return bufferInfo;
    }

    _returnVertexBuffersToPool() {
      // Return buffers marked for return back to their pools for all registered geometries
      for (const geometry of this._geometriesWithPools) {
        if (geometry._vertexBuffersToReturn) {
          for (const [dst, buffersToReturn] of Object.entries(geometry._vertexBuffersToReturn)) {
            if (buffersToReturn.length > 0) {
              // Move all buffers from ToReturn back to pool
              const pool = geometry._vertexBufferPools[dst] || [];
              while (buffersToReturn.length > 0) {
                const bufferInfo = buffersToReturn.pop();
                // Clear the data copy reference to prevent memory leaks
                bufferInfo.dataCopy = null;
                pool.push(bufferInfo);
              }
              geometry._vertexBufferPools[dst] = pool;
            }
          }
        }
      }
    }

    // Called when geometry is reset - mark its buffers for return
    onReset(geometry) {
      this._markGeometryBuffersForReturn(geometry);
    }

    // Mark geometry buffers for return when geometry is reset/freed
    _markGeometryBuffersForReturn(geometry) {
      if (geometry._vertexBuffersInUse && geometry._vertexBuffersToReturn) {
        for (const [dst, buffersInUse] of Object.entries(geometry._vertexBuffersInUse)) {
          if (buffersInUse.length > 0) {
            // Move all buffers from InUse to ToReturn
            const buffersToReturn = geometry._vertexBuffersToReturn[dst] || [];
            while (buffersInUse.length > 0) {
              const bufferInfo = buffersInUse.pop();
              buffersToReturn.push(bufferInfo);
            }
            geometry._vertexBuffersToReturn[dst] = buffersToReturn;
          }
        }
      }
    }

    //////////////////////////////////////////////
    // Uniform buffer pool management
    //////////////////////////////////////////////

    _getUniformBufferFromPool(bufferGroup) {
      // Try to get a buffer from the pool
      if (bufferGroup.bufferPool.length > 0) {
        const bufferInfo = bufferGroup.bufferPool.pop();
        bufferGroup.buffersInUse.add(bufferInfo);
        return bufferInfo;
      }

      // No buffers available, create a new one
      const newBuffer = this.device.createBuffer({
        size: bufferGroup.size,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const newData = new Float32Array(bufferGroup.size / 4);
      const newDataView = new DataView(newData.buffer);
      const bufferInfo = {
        buffer: newBuffer,
        data: newData,
        dataView: newDataView
      };

      bufferGroup.buffersInUse.add(bufferInfo);
      return bufferInfo;
    }

    _getDynamicUniformBufferFromPool(bufferGroup) {
      //
      let buffer;
      if (
        this.currentUniformBuffer &&
        this.currentUniformBuffer.offset + bufferGroup.size < this.currentUniformBuffer.size
      ) {
        // We can fit this next block of uniforms into the current active memory chunk
        buffer = this.currentUniformBuffer;
      } else if (this.uniformBufferPool.length > 0) {
        buffer = this.uniformBufferPool.pop();
        this.activeUniformBuffers.push(buffer);
      } else {
        // Kinda arbitrary. Each dynamic offset has to be in groups of 256, but then
        // we can choose how many things we want to be able to fit into a block.
        // There's some overhead to each block so if we're drawing a lot of stuff,
        // bigger is better. But it's also a lot of wasted memory if we AREN'T drawing
        // a lot of stuff. So.... right now it's 40. Feel free to update this if
        // a better balance can be achieved.
        const size = 256 * 40;
        buffer = {
          dynamic: true,
          lastOffset: 0,
          offset: 0,
          size,
          buffer: this.device.createBuffer({
            size,
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
          }),
          uniformBuffer: this.device.createBuffer({
            size,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
          }),
        }

        buffer.data = new Float32Array(buffer.buffer.getMappedRange());
        buffer.dataView = new DataView(buffer.data.buffer);

        this.activeUniformBuffers.push(buffer);
      }

      this.currentUniformBuffer = buffer;

      return buffer;
    }

    _returnUniformBuffersToPool() {
      // Return all used buffers back to their pools for all registered shaders
      for (const shader of this._shadersWithPools) {
        this._returnShaderBuffersToPool(shader);
      }
    }

    _returnShaderBuffersToPool(shader) {
      if (shader._uniformBufferGroups) {
        for (const bufferGroup of shader._uniformBufferGroups) {
          while (bufferGroup.nextBufferPool.length > 0) {
            bufferGroup.bufferPool.push(bufferGroup.nextBufferPool.pop());
          }
          for (const bufferInfo of bufferGroup.buffersInUse.keys()) {
            if (bufferInfo !== bufferGroup.currentBuffer) {
              bufferGroup.nextBufferPool.push(bufferInfo);
            }
          }
          bufferGroup.buffersInUse.clear();
          if (bufferGroup.currentBuffer) {
            bufferGroup.buffersInUse.add(bufferGroup.currentBuffer);
          }
        }
      }
    }

    flushDraw() {
      this._finishActiveRenderPass();
      // Only submit if we actually had any draws
      if (this._hasPendingDraws) {
        // Create a copy of pending command encoders
        const commandsToSubmit = this._pendingCommandEncoders;
        this._pendingCommandEncoders = [];
        this._hasPendingDraws = false;

        if (this.activeUniformBuffers.length > 0) {
          const encoder = this.device.createCommandEncoder();
          for (const bufferInfo of this.activeUniformBuffers) {
            bufferInfo.buffer.unmap();
            encoder.copyBufferToBuffer(
              bufferInfo.buffer,
              bufferInfo.uniformBuffer,
            );
          }
          commandsToSubmit.unshift(encoder.finish());
        }

        // Submit the commands
        this.queue.submit(commandsToSubmit);

        for (const buf of this.activeUniformBuffers) {
          // buf.buffer = this.device.createBuffer({
            // size: buf.size,
            // usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
            // mappedAtCreation: true,
          // });
          buf.offset = 0;
          buf.lastOffset = 0;
          // this.resettingUniformBuffers.push(
            buf.buffer.mapAsync(GPUMapMode.WRITE).then(() => {
              buf.data = new Float32Array(buf.buffer.getMappedRange());
              buf.dataView = new DataView(buf.data.buffer);
              this.uniformBufferPool.push(buf);
              return buf;
            })
          // )
        }
        this.activeUniformBuffers = [];
        this.currentUniformBuffer = undefined;

        // Execute post-submit callbacks after GPU work completes
        if (this._postSubmitCallbacks.length > 0) {
          const callbacks = this._postSubmitCallbacks;
          this._postSubmitCallbacks = [];
          this.device.queue.onSubmittedWorkDone().then(() => {
            for (const callback of callbacks) {
              callback();
            }
          });
        }

        // Reset canvas texture cache for next frame
        this.currentCanvasColorTexture = null;
        this.currentCanvasColorTextureView = null;
      }
    }

    _ensurePixelReadCanvas(width, height) {
      // Create canvas if it doesn't exist
      if (!this._pixelReadCanvas) {
        this._pixelReadCanvas = document.createElement('canvas');
        this._pixelReadCtx = this._pixelReadCanvas.getContext('2d');
      }

      // Resize canvas if dimensions changed
      if (this._pixelReadCanvas.width !== width || this._pixelReadCanvas.height !== height) {
        this._pixelReadCanvas.width = width;
        this._pixelReadCanvas.height = height;
      }

      return { canvas: this._pixelReadCanvas, ctx: this._pixelReadCtx };
    }

    resize(w, h) {
      super.resize(w, h);
      this._hasPendingDraws = true;
      this.flushDraw();
    }

    async finishDraw() {
      this.flushDraw();

      const states = [];

      // Only blit if we promoted to framebuffer this frame
      if (this._frameState === FRAME_STATE.PROMOTED) {
        while (this.activeFramebuffers.length > 0) {
          const fbo = this.activeFramebuffers.pop();
          states.unshift({ fbo, diff: { ...this.states } });
        }
        this.flushDraw();

        // this._pInst.background('red');
        this._pInst.push();
        this.states.setValue('enableLighting', false);
        this.states.setValue('activeImageLight', null);
        this._pInst.setCamera(this.finalCamera);
        this._pInst.shader(this._getBlitShader());
        this._pInst.resetMatrix();
        this._pInst.imageMode(this._pInst.CENTER);
        this._pInst.image(this.mainFramebuffer, 0, 0);
        this._pInst.pop();
        this.flushDraw();
      }

      // Return all uniform buffers to their pools
      this._returnUniformBuffersToPool();

      // Mark all geometry buffers for return after frame is complete
      for (const geometry of this._geometriesWithPools) {
        this._markGeometryBuffersForReturn(geometry);
      }

      // this.uniformBufferPool.push(...(await Promise.all(this.resettingUniformBuffers)));
      this.resettingUniformBuffers = [];

      // Return all vertex buffers to their pools
      this._returnVertexBuffersToPool();

      // Destroy all retired buffers
      const retired = this._retiredBuffers;
      this._postSubmitCallbacks.push(() => {
        for (const buffer of retired) {
          if (buffer && buffer.destroy) {
            buffer.destroy();
          }
        }
      });
      this._retiredBuffers = [];

      if (this._frameState === FRAME_STATE.PROMOTED) {
        for (const { fbo, diff } of states) {
          if (fbo !== this.mainFramebuffer || this._frameState !== FRAME_STATE.PROMOTED) {
            fbo.begin();
          }
          for (const key in diff) {
            this.states.setValue(key, diff[key]);
          }
        }
      }
    }

    //////////////////////////////////////////////
    // Rendering
    //////////////////////////////////////////////

    _drawBuffers(geometry, { mode = constants.TRIANGLES, count = 1 }) {
      const buffers = this.geometryBufferCache.getCached(geometry);
      if (!buffers) return;

      // If PENDING and no custom framebuffer, regular draw means PROMOTE
      if (this._frameState === FRAME_STATE.PENDING && !this.activeFramebuffer()) {
        this._promoteToFramebufferWithoutCopy();
      }

      this._beginActiveRenderPass();
      const passEncoder = this.activeRenderPass;

      const currentShader = this._curShader;
      this.setupShaderBindGroups(currentShader, passEncoder, { mode, buffers });
      // Bind vertex buffers
      for (const buffer of currentShader._vertexBuffers || this._getVertexBuffers(currentShader)) {
        const location = currentShader.attributes[buffer.attr].location;
        const gpuBuffer = buffers[buffer.dst];
        passEncoder.setVertexBuffer(location, gpuBuffer, 0);
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
      } else if (currentShader.shaderType === "text") {
        if (!buffers.indexBuffer) {
          throw new Error("Text geometry must have an index buffer");
        }
        const indexFormat = buffers.indexFormat || "uint16";
        passEncoder.setIndexBuffer(buffers.indexBuffer, indexFormat);
        passEncoder.drawIndexed(geometry.faces.length * 3, count, 0, 0, 0);
      }

      if (buffers.lineVerticesBuffer && currentShader.shaderType === "stroke") {
        passEncoder.draw(geometry.lineVertices.length / 3, count, 0, 0);
      }

      // Mark that we have pending draws that need submission
      this._hasPendingDraws = true;
    }

    setupShaderBindGroups(currentShader, passEncoder, shaderOptionsParams) {
      const shaderOptions = this._shaderOptions(shaderOptionsParams);
      if (
        shaderOptions.compute ||
        this.activeShader !== currentShader ||
        this._shaderOptionsDifferent(shaderOptions)
      ) {
        passEncoder.setPipeline(currentShader.getPipeline(shaderOptions));
      }
      if (!shaderOptions.compute) {
        this.activeShader = currentShader;
        this.activeShaderOptions = shaderOptions;

        // Set stencil reference value for clipping
        const drawTarget = this.drawTarget();
        if (drawTarget._isClipApplied && !this._clipping) {
          // When using the clip mask, test against reference value 0 (background)
          // WebGL uses NOTEQUAL with ref 0, so fragments pass where stencil != 0
          // In WebGPU with 'not-equal', we need ref 0 to pass where stencil != 0
          passEncoder.setStencilReference(0);
        } else if (this._clipping) {
          // When writing to the clip mask, write reference value 1
          passEncoder.setStencilReference(1);
        }
      }

      for (const bufferGroup of currentShader._uniformBufferGroups) {
        if (bufferGroup.dynamic) {
          // Bind uniforms into a part of a big dynamic memory block because
          // the group changes often
          const uniformBufferInfo = this._getDynamicUniformBufferFromPool(bufferGroup);
          if (currentShader._lastDynamicBuffer[bufferGroup.cacheKey] !== uniformBufferInfo) {
            currentShader._cachedBindGroup[bufferGroup.group] = undefined;
            currentShader._lastDynamicBuffer[bufferGroup.cacheKey] = uniformBufferInfo;
          }
          this._packUniformGroup(currentShader, bufferGroup.uniforms, uniformBufferInfo);
          uniformBufferInfo.lastOffset = uniformBufferInfo.offset;
          uniformBufferInfo.offset += Math.ceil(bufferGroup.size / this.uniformBufferAlignment) * this.uniformBufferAlignment;

          // Make a shallow copy so that we keep track of the last offset for this uniform
          bufferGroup.currentDynamicBuffer = uniformBufferInfo;
          bufferGroup.lastOffset = uniformBufferInfo.lastOffset;
        } else {
          // Bind uniforms to a binding-specific buffer, which may be cached for performance
          let bufferInfo;
          const dataChanged = this._hasGroupDataChanged(currentShader, bufferGroup);

          if (!dataChanged && bufferGroup.currentBuffer) {
            // Reuse the cached buffer - no need to pack or write
            bufferInfo = bufferGroup.currentBuffer;
            bufferGroup.buffersInUse.add(bufferInfo);
          } else {
            // Data changed - get a new buffer and write to it
            bufferInfo = this._getUniformBufferFromPool(bufferGroup);
            this._packUniformGroup(currentShader, bufferGroup.uniforms, bufferInfo);
            this.device.queue.writeBuffer(
              bufferInfo.buffer,
              0,
              bufferInfo.data.buffer,
              bufferInfo.data.byteOffset,
              bufferInfo.data.byteLength
            );

            currentShader.buffersDirty.delete(bufferGroup.group * 1000 + bufferGroup.binding);
            currentShader._cachedBindGroup[bufferGroup.group] = undefined;

            // Cache this buffer and data for next frame
            bufferGroup.currentBuffer = bufferInfo;
          }
        }
      }
      for (const sampler of currentShader.samplers) {
        const key = sampler.group * 1000 + sampler.binding;
        if (currentShader.buffersDirty.has(key)) {
          currentShader._cachedBindGroup[sampler.group] = undefined;
          currentShader.buffersDirty.delete(key);
        }
      }

      // Bind sampler/texture uniforms and uniform buffers
      for (const iter of currentShader._groupEntries) {
        const group = iter[0];
        const entries = iter[1];
        let dynamicOffsetIdx = 0;
        const bgEntries = [];
        let bindGroup = currentShader._cachedBindGroup[group];
        for (const entry of entries) {
          const bufferGroup = entry.bufferGroup;
          // Check if this is a uniform buffer binding
          const uniformBufferInfo =
            bufferGroup?.currentBuffer || bufferGroup?.currentDynamicBuffer;
          if (uniformBufferInfo) {
            if (bufferGroup.dynamic) {
              this.dynamicEntryOffsets[dynamicOffsetIdx++] = bufferGroup.lastOffset;
            }
            if (!bindGroup) {
              bgEntries.push({
                binding: entry.binding,
                resource: bufferGroup.dynamic
                  ? {
                    buffer: uniformBufferInfo.uniformBuffer,
                    offset: 0,
                    size: Math.ceil(bufferGroup.size / this.uniformBufferAlignment) * this.uniformBufferAlignment,
                  }
                  : { buffer: uniformBufferInfo.buffer },
              });
            }
          } else if (entry.storage && !bindGroup) {
            // Storage buffer binding
            const uniform = currentShader.uniforms[entry.storage.name];
            if (!uniform || !uniform._cachedData || !uniform._cachedData._isStorageBuffer) {
              throw new Error(
                `Storage buffer "${entry.storage.name}" not set. ` +
                `Use shader.setUniform("${entry.storage.name}", storageBuffer)`
              );
            }
            bgEntries.push({
              binding: entry.binding,
              resource: { buffer: uniform._cachedData.buffer },
            });
          } else if (!bindGroup) {
            bgEntries.push({
              binding: entry.binding,
              resource: entry.uniform.type === 'sampler'
                ? (entry.uniform.textureSource.texture || this._getEmptyTexture()).getSampler()
                : (entry.uniform.texture || this._getEmptyTexture()).textureHandle.view,
            });
          }
        }

        const layout = currentShader._bindGroupLayouts[group];
        if (!bindGroup) {
          bindGroup = this.device.createBindGroup({
            layout,
            entries: bgEntries,
          });
        }
        currentShader._cachedBindGroup[group] = bindGroup;
        if (dynamicOffsetIdx === 0) {
          passEncoder.setBindGroup(
            group,
            bindGroup,
          );
        } else {
          passEncoder.setBindGroup(
            group,
            bindGroup,
            this.dynamicEntryOffsets,
            0,
            dynamicOffsetIdx
          );
        }
      }
      return passEncoder;
    }

    //////////////////////////////////////////////
    // SHADER
    //////////////////////////////////////////////

    _packUniformGroup(shader, groupUniforms, bufferInfo) {
      // Pack a single group's uniforms into a buffer
      const data = bufferInfo.data;
      const dataView = bufferInfo.dataView;

      const offset = bufferInfo.offset || 0;
      for (const uniform of groupUniforms) {
        const fullUniform = shader.uniforms[uniform.name];
        if (!fullUniform || fullUniform.isSampler) continue;
        const uniformData = fullUniform._mappedData;

        if (fullUniform.baseType === 'u32') {
          if (fullUniform.size === 4) {
            dataView.setUint32(offset + fullUniform.offset, uniformData, true);
          } else {
            for (let i = 0; i < uniformData.length; i++) {
              dataView.setUint32(offset + fullUniform.offset + i * 4, uniformData[i], true);
            }
          }
        } else if (fullUniform.baseType === 'i32') {
          if (fullUniform.size === 4) {
            dataView.setInt32(offset + fullUniform.offset, uniformData, true);
          } else {
            for (let i = 0; i < uniformData.length; i++) {
              dataView.setInt32(offset + fullUniform.offset + i * 4, uniformData[i], true);
            }
          }
        } else if (fullUniform.packInPlace) {
          // In-place packing for mat3: write directly to buffer with padding
          const baseOffset = (offset + fullUniform.offset) / 4;
          // Column 0
          data[baseOffset + 0] = uniformData[0];
          data[baseOffset + 1] = uniformData[1];
          data[baseOffset + 2] = uniformData[2];
          // Column 1
          data[baseOffset + 4] = uniformData[3];
          data[baseOffset + 5] = uniformData[4];
          data[baseOffset + 6] = uniformData[5];
          // Column 2
          data[baseOffset + 8] = uniformData[6];
          data[baseOffset + 9] = uniformData[7];
          data[baseOffset + 10] = uniformData[8];
        } else if (fullUniform.size === 4) {
          data.set([uniformData], (offset + fullUniform.offset) / 4);
        } else if (uniformData !== undefined) {
          data.set(uniformData, (offset + fullUniform.offset) / 4);
        }
      }
    }

    _hasGroupDataChanged(shader, bufferGroup) {
      // First time
      if (!bufferGroup.currentBuffer) return true;
      return shader.buffersDirty.has(bufferGroup.group * 1000 + bufferGroup.binding);
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
          return { align: 4, size: 4, items: 1, baseType: type };
        }
        if (/^vec[2-4](<f32>|f)$/.test(type)) {
          const n = parseInt(type.match(/^vec([2-4])/)[1]);
          const size = 4 * n;
          const align = n === 2 ? 8 : 16;
          return { align, size, items: n, baseType: 'f32' };
        }
        if (/^vec[2-4]<(i32|u32)>$/.test(type)) {
          const n = parseInt(type.match(/^vec([2-4])/)[1]);
          const match = type.match(/^vec[2-4]<(i32|u32)>$/);
          const baseType = match[1]; // 'i32' or 'u32'
          const size = 4 * n;
          const align = n === 2 ? 8 : 16;
          return { align, size, items: n, baseType };
        }
        if (/^mat[2-4](?:x[2-4])?(<f32>|f)$/.test(type)) {
          if (type[4] === 'x' && type[3] !== type[5]) {
            throw new Error('Non-square matrices not implemented yet');
          }
          const dim = parseInt(type[3]);
          const align = dim === 2 ? 8 : 16;
          // Each column must be aligned
          const size = Math.ceil(dim * 4 / align) * align * dim;
          // For mat3, use in-place packing to avoid array allocation
          const pack = dim === 3
            ? (data) => [
              ...data.slice(0, 3),
              ...data.slice(3, 6),
              ...data.slice(6, 9),
            ]
            : undefined;
          const packInPlace = dim === 3;
          return { align, size, pack, packInPlace, items: dim * dim, baseType: 'f32' };
        }
        if (/^array<.+>$/.test(type)) {
          const [, subtype, rawLength] = type.match(/^array<(.+),\s*(\d+)>/);
          const length = parseInt(rawLength);
          const {
            align: elemAlign,
            size: elemSize,
            items: elemItems,
            pack: elemPack = (data) => [...data],
            baseType: elemBaseType
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
            baseType: elemBaseType
          };
        }
        throw new Error(`Unknown type in WGSL struct: ${type}`);
      };

      while ((match = elementRegex.exec(structBody)) !== null) {
        const [_, location, name, type] = match;
        const { size, align, pack, packInPlace, baseType } = baseAlignAndSize(type);
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
          pack,
          packInPlace,
          baseType
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
      const mainMatch = /fn main\(.+:\s*([^\s\)]+)/.exec(shader._vertSrc);
      if (!mainMatch) throw new Error("Can't find `fn main` in vertex shader source");
      const inputType = mainMatch[1];

      return this._parseStruct(shader.vertSrc(), inputType);
    }

    getUniformMetadata(shader) {
      // Parse all uniform struct bindings in group 0.
      // TODO: support non-sampler uniforms being in other groups

      // Each binding represents a logical group of uniforms, since they get
      // updated or cached all at once.

      const uniformGroups = [];
      const uniformVarRegex = /@group\((\d+)\)\s+@binding\((\d+)\)\s+var<uniform>\s+(\w+)\s*:\s*(\w+);/g;

      let match;
      const src = shader.shaderType === 'compute' ? shader.computeSrc() : shader.vertSrc();
      while ((match = uniformVarRegex.exec(src)) !== null) {
        const [_, groupNum, binding, varName, structType] = match;
        const bindingIndex = parseInt(binding);
        const uniforms = this._parseStruct(src, structType);

        uniformGroups.push({
          group: parseInt(groupNum),
          binding: bindingIndex,
          varName,
          structType,
          uniforms
        });
      }

      if (uniformGroups.length === 0 && shader.shaderType !== 'compute') {
        throw new Error('Expected at least one uniform struct bound to @group(0)');
      }

      // While we're also keeping track of the groups, the API we expose
      // to users of p5 is just a flat list of uniforms (which can be the
      // individual struct items in the group.)
      const allUniforms = {};
      for (const group of uniformGroups) {
        for (const [uniformName, uniformData] of Object.entries(group.uniforms)) {
          allUniforms[uniformName] = {
            ...uniformData,
            group: group.group,
            binding: group.binding,
            varName: group.varName
          };
        }
      }

      // Store uniform groups for buffer pooling
      shader._uniformGroups = uniformGroups;

      // Extract samplers from group bindings
      const samplers = {};
      // TODO: support other texture types
      const samplerRegex = /@group\((\d+)\)\s*@binding\((\d+)\)\s*var\s+(\w+)\s*:\s*(texture_2d<f32>|sampler);/g;

      // Extract storage buffers
      const storageBuffers = {};
      const storageRegex = /@group\((\d+)\)\s*@binding\((\d+)\)\s*var<storage,\s*(read|read_write)>\s+(\w+)\s*:\s*array<f32>/g;

      // Track which bindings are taken by the struct properties we've parsed
      // (the rest should be textures/samplers)
      const structUniformBindings = {};
      for (const g of uniformGroups) {
        structUniformBindings[g.group + ',' + g.binding] = true;
      }

      for (const [src, visibility] of [
        [shader.vertSrc(), GPUShaderStage.VERTEX],
        [shader.fragSrc(), GPUShaderStage.FRAGMENT],
        [shader.computeSrc ? shader.computeSrc() : null, GPUShaderStage.COMPUTE]
      ]) {
        if (!src) continue; // Skip if shader stage doesn't exist

        let match;
        while ((match = samplerRegex.exec(src)) !== null) {
          const [_, group, binding, name, type] = match;
          const groupIndex = parseInt(group);
          const bindingIndex = parseInt(binding);
          // Skip struct uniform bindings which we've already parsed
          if (structUniformBindings[groupIndex + ',' + bindingIndex]) continue;

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

        // Parse storage buffers
        while ((match = storageRegex.exec(src)) !== null) {
          const [_, group, binding, accessMode, name] = match;
          const groupIndex = parseInt(group);
          const bindingIndex = parseInt(binding);

          const key = `${groupIndex},${bindingIndex}`;
          const existing = storageBuffers[key];
          // If any stage uses read_write, the bind group layout must use read_write
          const finalAccessMode = (existing?.accessMode === 'read_write' || accessMode === 'read_write')
            ? 'read_write'
            : accessMode;

          storageBuffers[key] = {
            visibility: (existing?.visibility || 0) | visibility,
            group: groupIndex,
            binding: bindingIndex,
            name,
            accessMode: finalAccessMode, // 'read' or 'read_write'
            isStorage: true,
            type: 'storage'
          };
        }
      }

      // Store storage buffers on shader for later use
      shader._storageBuffers = Object.values(storageBuffers);

      return [...Object.values(allUniforms).sort((a, b) => a.index - b.index), ...Object.values(samplers), ...Object.values(storageBuffers)];
    }

    getNextBindingIndex({ vert, frag, compute }, group = 0) {
      // Get the highest binding index in the specified group and return the next available
      const bindingRegex = /@group\((\d+)\)\s*@binding\((\d+)\)/g;
      let maxBindingIndex = -1;

      const sources = [];
      if (vert) sources.push([vert, GPUShaderStage.VERTEX]);
      if (frag) sources.push([frag, GPUShaderStage.FRAGMENT]);
      if (compute) sources.push([compute, GPUShaderStage.COMPUTE]);

      for (const [src, visibility] of sources) {
        let match;
        while ((match = bindingRegex.exec(src)) !== null) {
          const [_, groupIndex, bindingIndex] = match;
          if (parseInt(groupIndex) === group) {
            maxBindingIndex = Math.max(maxBindingIndex, parseInt(bindingIndex));
          }
        }
      }

      return maxBindingIndex + 1;
    }

    updateUniformValue(shader, uniform, data) {
      if (uniform.isSampler) {
        uniform.texture =
          data instanceof Texture ? data : this.getTexture(data);
      } else {
        uniform._mappedData = this._mapUniformData(uniform, uniform._cachedData);
      }
      shader.buffersDirty.add(uniform.group * 1000 + uniform.binding);
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

      // Force submission to ensure texture upload completes before usage
      this._hasPendingDraws = true;
      this.flushDraw();
    }

    uploadTextureFromData({ gpuTexture }, data, width, height) {
      this.queue.writeTexture(
        { texture: gpuTexture },
        data,
        { bytesPerRow: width * 4, rowsPerImage: height },
        { width, height, depthOrArrayLayers: 1 }
      );

      // Force submission to ensure texture upload completes before usage
      this._hasPendingDraws = true;
      this.flushDraw();
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
      this._postSubmitCallbacks.push(() => gpuTexture.destroy());
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

    _getFontShader() {
      if (!this._defaultFontShader) {
        this._defaultFontShader = new Shader(
          this,
          fontVertexShader,
          fontFragmentShader
        );
      }
      return this._defaultFontShader;
    }

    _getBlitShader() {
      if (!this._defaultBlitShader) {
        this._defaultBlitShader = new Shader(
          this,
          blitVertexShader,
          blitFragmentShader
        );
      }
      return this._defaultBlitShader;
    }

    //////////////////////////////////////////////
    // Setting
    //////////////////////////////////////////////
    _adjustDimensions(width, height) {
      // TODO: find max texture size
      return { adjustedWidth: width, adjustedHeight: height };
    }

    _applyClip() {
      const commandEncoder = this.device.createCommandEncoder();

      const activeFramebuffer = this.activeFramebuffer();
      const depthTextureView = activeFramebuffer
        ? (activeFramebuffer.aaDepthTexture
            ? activeFramebuffer.aaDepthTextureView
            : activeFramebuffer.depthTextureView)
        : this.depthTextureView;

      if (!depthTextureView) {
        return;
      }

      const depthStencilAttachment = {
        view: depthTextureView,
        stencilLoadOp: 'clear',
        stencilStoreOp: 'store',
        stencilClearValue: 0,
        depthReadOnly: true,
        stencilReadOnly: false,
      };

      const renderPassDescriptor = {
        colorAttachments: [],
        depthStencilAttachment: depthStencilAttachment,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.end();

      this._pendingCommandEncoders.push(commandEncoder.finish());
      this._hasPendingDraws = true;
    }

    _unapplyClip() {
      // In WebGPU, clip unapplication is handled through pipeline state rather than direct commands
      // The stencil test configuration is set in the render pipeline based on _clipping and _clipInvert flags
      // This is already handled in the _shaderOptions() method and pipeline creation
    }

    _clearClipBuffer() {
      this._finishActiveRenderPass();
      const commandEncoder = this.device.createCommandEncoder();

      const activeFramebuffer = this.activeFramebuffer();
      const depthTextureView = activeFramebuffer
        ? (activeFramebuffer.aaDepthTexture
            ? activeFramebuffer.aaDepthTextureView
            : activeFramebuffer.depthTextureView)
        : this.depthTextureView;

      if (!depthTextureView) {
        return;
      }

      const depthStencilAttachment = {
        view: depthTextureView,
        stencilLoadOp: 'clear',
        stencilStoreOp: 'store',
        stencilClearValue: 1,
        depthReadOnly: true,
        stencilReadOnly: false,
      };

      const renderPassDescriptor = {
        colorAttachments: [],
        depthStencilAttachment: depthStencilAttachment,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.end();

      this._pendingCommandEncoders.push(commandEncoder.finish());
      this._hasPendingDraws = true;
    }

    _applyStencilTestIfClipping() {
      // This is done via pipeline state in WebGL so this is a no-op
    }

    //////////////////////////////////////////////
    // Shader hooks
    //////////////////////////////////////////////
    uniformNameFromHookKey(key) {
      return key.slice(0, key.indexOf(':'));
    }
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

      let [preMain, main, postMain] = src.split(/((?:@(?:vertex|fragment|compute)\s*(?:@workgroup_size\([^)]+\)\s*)?)?fn main[^{]+\{)/);
      if (shaderType === 'vertex') {
        if (!main.match(/\@builtin\s*\(\s*instance_index\s*\)/)) {
          main = main.replace(/\)\s*(->|\{)/, ', @builtin(instance_index) instanceID: u32) $1');
        }
      }

      // Inject hook uniforms as a separate struct at a new binding
      let hookUniformFields = '';
      for (const key in shader.hooks.uniforms) {
        // WGSL format: "name: type"
        hookUniformFields += `  ${key},\n`;
      }

      if (hookUniformFields) {
        // Find the next available binding in group 0
        // Use the source we're currently building (preMain) which has texture bindings. We can't call `fragSrc()`
        // or `vertSrc()` because we may be in one of those calls already, and might infinite loop
        const nextBinding = this.getNextBindingIndex({
          vert: shaderType === 'vertex' ? preMain + (shader.hooks.vertex?.declarations ?? '') + shader.hooks.declarations : shader._vertSrc,
          frag: shaderType === 'fragment' ? preMain + (shader.hooks.fragment?.declarations ?? '') + shader.hooks.declarations : shader._fragSrc,
          compute: shaderType === 'compute' ? preMain + (shader.hooks.compute?.declarations ?? '') + shader.hooks.declarations : shader._computeSrc,
        }, 0);

        // Create HookUniforms struct and binding
        const hookUniformsDecl = `
// Hook Uniforms (from .modify())
struct HookUniforms {
${hookUniformFields}}

@group(0) @binding(${nextBinding}) var<uniform> hooks: HookUniforms;
`;
        // Insert before the first @group binding, or at the end if there are none
        const replaced = preMain.replace(/(@group\(0\)\s+@binding)/, `${hookUniformsDecl}\n$1`);
        if (replaced === preMain) {
          // No @group bindings found in base shader, append to preMain
          preMain = preMain + '\n' + hookUniformsDecl;
        } else {
          preMain = replaced;
        }
      }

      // Handle varying variables by injecting them into VertexOutput and FragmentInput structs
      if (shader.hooks.varyingVariables && shader.hooks.varyingVariables.length > 0) {
        // Generate struct members for varying variables
        let nextLocationIndex = this._getNextAvailableLocation(preMain, shaderType);
        let varyingMembers = '';

        for (const varyingVar of shader.hooks.varyingVariables) {
          // varyingVar is a string like "varName: vec3<f32>"
          const member = `@location(${nextLocationIndex++}) ${varyingVar},`;
          varyingMembers += member + '\n';
        }

        if (shaderType === 'vertex') {
          // Inject into VertexOutput struct
          preMain = preMain.replace(
            /struct\s+VertexOutput\s+\{([^}]*)\}/,
            (match, body) => `struct VertexOutput {${body}\n${varyingMembers}}`
          );
        } else if (shaderType === 'fragment') {
          // Inject into FragmentInput struct
          preMain = preMain.replace(
            /struct\s+FragmentInput\s+\{([^}]*)\}/,
            (match, body) => `struct FragmentInput {${body}\n${varyingMembers}}`
          );
        }
      }

      // Add file-global varying variable declarations
      if (shader.hooks.varyingVariables && shader.hooks.varyingVariables.length > 0) {
        let varyingDeclarations = '';
        for (const varyingVar of shader.hooks.varyingVariables) {
          // varyingVar is a string like "varName: vec3<f32>"
          const [varName, varType] = varyingVar.split(':').map(s => s.trim());
          varyingDeclarations += `var<private> ${varName}: ${varType};\n`;
        }

        // Add declarations before the main function
        preMain += varyingDeclarations;

        if (shaderType === 'vertex') {
          // In vertex shader, copy varying variables to output struct before return
          let copyStatements = '';
          for (const varyingVar of shader.hooks.varyingVariables) {
            const [varName] = varyingVar.split(':').map(s => s.trim());
            copyStatements += `  OUTPUT_VAR.${varName} = ${varName};\n`;
          }

          // Find the output variable name from the return statement and replace OUTPUT_VAR
          const returnMatch = postMain.match(/return\s+(\w+)\s*;/);
          if (returnMatch) {
            const outputVarName = returnMatch[1];
            copyStatements = copyStatements.replace(/OUTPUT_VAR/g, outputVarName);
            // Insert before the return statement
            postMain = postMain.replace(/(return\s+\w+\s*;)/g, `${copyStatements}  $1`);
          }
        } else if (shaderType === 'fragment') {
          // In fragment shader, initialize varying variables from input struct at start of main
          let initStatements = '';
          for (const varyingVar of shader.hooks.varyingVariables) {
            const [varName] = varyingVar.split(':').map(s => s.trim());
            initStatements += `  ${varName} = INPUT_VAR.${varName};\n`;
          }

          // Find the input parameter name from the main function signature (anchored to start)
          const inputMatch = main.match(/fn main\s*\((\w+):\s*\w+\)/);
          if (inputMatch) {
            const inputVarName = inputMatch[1];
            initStatements = initStatements.replace(/INPUT_VAR/g, inputVarName);
            // Insert after the main function parameter but before any other code (anchored to start)
            postMain = initStatements + postMain;
          }
        }
      }

      let hooks = '';
      let defines = '';
      if (shader.hooks.declarations) {
        hooks += shader.hooks.declarations + '\n';
      }
      if (shader.hooks[shaderType] && shader.hooks[shaderType].declarations) {
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

        let [_, params, body] = /^(\([^\)]*\))((?:.|\n)*)$/.exec(shader.hooks[shaderType][hookDef]);

        if (shaderType === 'vertex') {
          // Splice the instance ID in as a final parameter to every WGSL hook function
          let hasParams = !!params.match(/^\(\s*\S+.*\)$/);
          params = params.slice(0, -1) + (hasParams ? ', ' : '') + 'instanceID: u32)';
        }

        if (hookType === 'void') {
          hooks += `fn HOOK_${hookName}${params}${body}\n`;
        } else {
          hooks += `fn HOOK_${hookName}${params} -> ${hookType}${body}\n`;
        }
      }

      // Add the instance ID as a final parameter to each hook call
      if (shaderType === 'vertex') {
        const addInstanceIDParam = (src) => {
          let result = src;
          let idx = 0;
          let match;
          do {
            match = /HOOK_\w+\(/.exec(result.slice(idx));
            if (match) {
              idx += match.index + match[0].length - 1;
              let nesting = 0;
              let hasParams = false;
              while (idx < result.length) {
                if (result[idx] === '(') {
                  nesting++;
                } else if (result[idx] === ')') {
                  nesting--;
                } else if (result[idx].match(/\S/)) {
                  hasParams = true;
                }
                idx++;
                if (nesting === 0) {
                  break;
                }
              }
              const insertion = (hasParams ? ', ' : '') + 'instanceID';
              result = result.slice(0, idx-1) + insertion + result.slice(idx-1);
              idx += insertion.length;
            }
          } while (match);
          return result;
        };
        preMain = addInstanceIDParam(preMain);
        postMain = addInstanceIDParam(postMain);
      }

      return preMain + '\n' + defines + hooks + main + postMain;
    }

    _getNextAvailableLocation(shaderSource, shaderType) {
      // Parse existing struct to find the highest @location number
      let maxLocation = -1;
      const structName = shaderType === 'vertex' ? 'VertexOutput' : 'FragmentInput';

      // Find the struct definition
      const structMatch = shaderSource.match(new RegExp(`struct\\s+${structName}\\s*\\{([^}]*)\\}`, 's'));
      if (structMatch) {
        const structBody = structMatch[1];

        // Find all @location(N) declarations
        const locationMatches = structBody.matchAll(/@location\((\d+)\)/g);
        for (const match of locationMatches) {
          const locationNum = parseInt(match[1]);
          if (locationNum > maxLocation) {
            maxLocation = locationNum;
          }
        }
      }

      return maxLocation + 1;
    }

    getShaderHookTypes(shader, hookName) {
      // Create mapping from WGSL types to DataType entries
      const wgslToDataType = {
        'f32': DataType.float1,
        'vec2<f32>': DataType.float2,
        'vec3<f32>': DataType.float3,
        'vec4<f32>': DataType.float4,
        'vec2f': DataType.float2,
        'vec3f': DataType.float3,
        'vec4f': DataType.float4,
        'i32': DataType.int1,
        'vec2<i32>': DataType.int2,
        'vec3<i32>': DataType.int3,
        'vec4<i32>': DataType.int4,
        'bool': DataType.bool1,
        'vec2<bool>': DataType.bool2,
        'vec3<bool>': DataType.bool3,
        'vec4<bool>': DataType.bool4,
        'mat2x2<f32>': DataType.mat2,
        'mat3x3<f32>': DataType.mat3,
        'mat4x4<f32>': DataType.mat4,
        'texture_2d<f32>': DataType.sampler2D
      };

      let fullSrc = shader._vertSrc;
      let body = shader.hooks.vertex[hookName];
      if (!body) {
        body = shader.hooks.fragment[hookName];
        fullSrc = shader._fragSrc;
      }
      if (!body) {
        body = shader.hooks.compute[hookName];
        fullSrc = shader._computeSrc;
      }
      if (!body) {
        throw new Error(`Can't find hook ${hookName}!`);
      }
      const nameParts = hookName.split(/\s+/g);
      const functionName = nameParts.pop();
      const returnType = nameParts.pop();
      const returnQualifiers = [...nameParts];
      const parameterMatch = /\(([^\)]*)\)/.exec(body);
      if (!parameterMatch) {
        throw new Error(`Couldn't find function parameters in hook body:\n${body}`);
      }

      const structProperties = structName => {
        // WGSL struct parsing: struct StructName { field1: Type, field2: Type }
        const structDefMatch = new RegExp(`struct\\s+${structName}\\s*{([^}]*)}`).exec(fullSrc);
        if (!structDefMatch) return undefined;
        const properties = [];

        // Parse WGSL struct fields (e.g., "texCoord: vec2<f32>,")
        for (const fieldSrc of structDefMatch[1].split(',')) {
          const trimmed = fieldSrc.trim();
          if (!trimmed) continue;

          // Remove location decorations and parse field
          // Format: [@location(N)] fieldName: Type
          const fieldMatch = /(?:@location\([^)]*\)\s*)?(\w+)\s*:\s*([^,\s]+)/.exec(trimmed);
          if (!fieldMatch) continue;

          const name = fieldMatch[1];
          let typeName = fieldMatch[2];

          const dataType = wgslToDataType[typeName] || null;

          const typeProperties = structProperties(typeName);
          properties.push({
            name,
            type: {
              typeName: typeName, // Keep native WGSL type name
              qualifiers: [],
              properties: typeProperties,
              dataType: dataType
            }
          });
        }
        return properties;
      };

      const parameters = parameterMatch[1].split(',').map(paramString => {
        // WGSL function parameters: name: type or name: binding<type>
        const trimmed = paramString.trim();
        if (!trimmed) return null;

        const parts = trimmed.split(':').map(s => s.trim());
        if (parts.length !== 2) return null;

        const name = parts[0];
        let typeName = parts[1];

        // Handle texture bindings like "texture_2d<f32>" -> sampler2D DataType
        if (typeName.includes('texture_2d')) {
          typeName = 'texture_2d<f32>';
        }

        const dataType = wgslToDataType[typeName] || null;

        const properties = structProperties(typeName);
        return {
          name,
          type: {
            typeName: typeName, // Keep native WGSL type name
            qualifiers: [],
            properties,
            dataType: dataType
          }
        };
      }).filter(Boolean);

      // Convert WGSL return type to DataType
      const returnDataType = wgslToDataType[returnType] || null;

      return {
        name: functionName,
        returnType: {
          typeName: returnType, // Keep native WGSL type name
          qualifiers: returnQualifiers,
          properties: structProperties(returnType),
          dataType: returnDataType
        },
        parameters
      };
    }

    //////////////////////////////////////////////
    // Buffer management for pixel reading
    //////////////////////////////////////////////

    _ensurePixelReadBuffer(requiredSize) {
      // Create or resize staging buffer if needed
      if (!this.pixelReadBuffer || this.pixelReadBufferSize < requiredSize) {
        // Clean up old buffer
        if (this.pixelReadBuffer) {
          this.flushDraw();
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
      this.flushDraw();
      // Clean up existing textures
      if (framebuffer.colorTexture && framebuffer.colorTexture.destroy) {
        const tex = framebuffer.colorTexture;
        this._postSubmitCallbacks.push(() => tex.destroy());
        framebuffer.colorTextureView = null;
      }
      if (framebuffer.aaColorTexture && framebuffer.aaColorTexture.destroy) {
        const tex = framebuffer.aaColorTexture;
        this._postSubmitCallbacks.push(() => tex.destroy());
        framebuffer.aaColorTextureView = null;
      }
      if (framebuffer.depthTexture && framebuffer.depthTexture.destroy) {
        const tex = framebuffer.depthTexture;
        this._postSubmitCallbacks.push(() => tex.destroy());
        framebuffer.depthTextureView = null;
      }
      if (framebuffer.aaDepthTexture && framebuffer.aaDepthTexture.destroy) {
        const tex = framebuffer.aaDepthTexture;
        this._postSubmitCallbacks.push(() => tex.destroy());
        framebuffer.aaDepthTextureView = null;
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
        usage: GPUTextureUsage.RENDER_ATTACHMENT |
               GPUTextureUsage.TEXTURE_BINDING |
               GPUTextureUsage.COPY_SRC |
               (framebuffer._useCanvasFormat ? GPUTextureUsage.COPY_DST : 0),
        sampleCount: 1,
      };
      framebuffer.colorTexture = this.device.createTexture(colorTextureDescriptor);
      framebuffer.colorTextureView = framebuffer.colorTexture.createView();

      // Create multisampled texture for rendering if antialiasing is enabled
      if (framebuffer.antialias) {
        const aaColorTextureDescriptor = {
          ...baseDescriptor,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
          sampleCount: this._getValidSampleCount(framebuffer.antialiasSamples),
        };
        framebuffer.aaColorTexture = this.device.createTexture(aaColorTextureDescriptor);
        framebuffer.aaColorTextureView = framebuffer.aaColorTexture.createView();
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
          usage: GPUTextureUsage.RENDER_ATTACHMENT |
                 GPUTextureUsage.TEXTURE_BINDING |
                 (framebuffer._useCanvasFormat ? GPUTextureUsage.COPY_DST : 0),
          sampleCount: 1,
        };
        framebuffer.depthTexture = this.device.createTexture(depthTextureDescriptor);
        framebuffer.depthTextureView = framebuffer.depthTexture.createView();

        // Create multisampled depth texture for rendering if antialiasing is enabled
        if (framebuffer.antialias) {
          const aaDepthTextureDescriptor = {
            ...depthBaseDescriptor,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            sampleCount: this._getValidSampleCount(framebuffer.antialiasSamples),
          };
          framebuffer.aaDepthTexture = this.device.createTexture(aaDepthTextureDescriptor);
          framebuffer.aaDepthTextureView = framebuffer.aaDepthTexture.createView();
        }
      }

      // Clear the framebuffer textures after creation
      this._clearFramebufferTextures(framebuffer);
    }

    _clearFramebufferTextures(framebuffer) {
      this._finishActiveRenderPass();
      const commandEncoder = this.device.createCommandEncoder();

      // Clear the color texture (and multisampled texture if it exists)
      const colorAttachment = {
        view: framebuffer.aaColorTexture
          ? framebuffer.aaColorTextureView
          : framebuffer.colorTextureView,
        loadOp: "clear",
        storeOp: "store",
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        resolveTarget: framebuffer.aaColorTexture
          ? framebuffer.colorTextureView
          : undefined,
      };

      // Clear the depth texture if it exists
      const depthTexture = framebuffer.aaDepthTexture || framebuffer.depthTexture;
      const depthStencilAttachment = depthTexture ? {
        view: framebuffer.aaDepthTexture
          ? framebuffer.aaDepthTextureView
          : framebuffer.depthTextureView,
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

      this._pendingCommandEncoders.push(commandEncoder.finish());
      this._hasPendingDraws = true;
    }

    _getFramebufferColorTextureView(framebuffer) {
      if (framebuffer.colorTexture) {
        return framebuffer.colorTextureView;
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

    createStorage(dataOrCount) {
      const device = this.device;

      // Determine buffer size and initial data
      let size, initialData;
      if (typeof dataOrCount === 'number') {
        // createStorage(count) - zero-initialized
        size = dataOrCount * 4; // floats are 4 bytes
        initialData = new Float32Array(dataOrCount);
      } else {
        // createStorage(array) - from data
        if (dataOrCount instanceof Float32Array) {
          initialData = dataOrCount;
        } else if (Array.isArray(dataOrCount)) {
          initialData = new Float32Array(dataOrCount);
        } else {
          throw new Error('createStorage expects a number or array/Float32Array');
        }
        size = initialData.byteLength;
      }

      // Align to 16 bytes (WGSL storage buffer alignment requirement)
      size = Math.ceil(size / 16) * 16;

      // Create storage buffer with STORAGE | COPY_DST | COPY_SRC usage
      const buffer = device.createBuffer({
        size,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
        mappedAtCreation: initialData.length > 0
      });

      // Write initial data if provided
      if (initialData.length > 0) {
        const mapping = new Float32Array(buffer.getMappedRange());
        mapping.set(initialData);
        buffer.unmap();
      }

      // Return wrapper object with metadata
      const storageBuffer = {
        _isStorageBuffer: true,
        buffer,
        size,
        elementCount: size / 4, // Number of floats
        _renderer: this
      };

      // Track for cleanup
      this._storageBuffers.add(storageBuffer);

      return storageBuffer;
    }

    _getWebGPUColorFormat(framebuffer) {
      if (framebuffer.format === constants.FLOAT) {
        return framebuffer.channels === RGBA ? 'rgba32float' : 'rgba32float';
      } else if (framebuffer.format === constants.HALF_FLOAT) {
        return framebuffer.channels === RGBA ? 'rgba16float' : 'rgba16float';
      } else {
        // Framebuffer with _useCanvasFormat should match canvas presentation format
        if (framebuffer._useCanvasFormat) {
          return this.presentationFormat;
        }
        // Other framebuffers use standard RGBA format
        return framebuffer.channels === RGBA ? 'rgba8unorm' : 'rgba8unorm';
      }
    }

    _getWebGPUDepthFormat(framebuffer) {
      if (framebuffer._useCanvasFormat) {
        return this.depthFormat;
      }
      if (framebuffer.useStencil) {
        return framebuffer.depthFormat === constants.FLOAT ? 'depth32float-stencil8' : 'depth24plus-stencil8';
      } else {
        return framebuffer.depthFormat === constants.FLOAT ? 'depth32float' : 'depth24plus';
      }
    }

    _deleteFramebufferTexture(texture) {
      this.flushDraw();
      const handle = texture.rawTexture();
      if (handle.texture && handle.texture.destroy) {
        const tex = handle.texture;
        this._postSubmitCallbacks.push(() => tex.destroy());
      }
      this.textures.delete(texture);
    }

    deleteFramebufferTextures(framebuffer) {
      this._deleteFramebufferTexture(framebuffer.color)
      if (framebuffer.depth) this._deleteFramebufferTexture(framebuffer.depth);
    }

    deleteFramebufferResources(framebuffer) {
      this.flushDraw();
      if (framebuffer.colorTexture && framebuffer.colorTexture.destroy) {
        const tex = framebuffer.colorTexture;
        this._postSubmitCallbacks.push(() => tex.destroy());
      }
      if (framebuffer.depthTexture && framebuffer.depthTexture.destroy) {
        const tex = framebuffer.depthTexture;
        this._postSubmitCallbacks.push(() => tex.destroy());
      }
      if (framebuffer.aaDepthTexture && framebuffer.aaDepthTexture.destroy) {
        const tex = framebuffer.aaDepthTexture;
        this._postSubmitCallbacks.push(() => tex.destroy());
      }
    }

    getFramebufferToBind(framebuffer) {
    }

    updateFramebufferTexture(framebuffer, property) {
      // No-op for WebGPU since antialiasing is handled at pipeline level
    }

    bindFramebuffer(framebuffer) {}

    framebufferYScale() {
      return 1;
    }

    async readFramebufferPixels(framebuffer) {
      this.flushDraw();
      // await this.finishDraw();
      // Ensure all pending GPU work is complete before reading pixels
      // await this.queue.onSubmittedWorkDone();

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
      let result;
      if (alignedBytesPerRow === unalignedBytesPerRow) {
        result = new Uint8Array(mappedRange.slice(0, width * height * bytesPerPixel));
        stagingBuffer.unmap();
      } else {
        // Need to extract pixel data from aligned buffer
        result = new Uint8Array(width * height * bytesPerPixel);
        const mappedData = new Uint8Array(mappedRange);
        for (let y = 0; y < height; y++) {
          const srcOffset = y * alignedBytesPerRow;
          const dstOffset = y * unalignedBytesPerRow;
          result.set(mappedData.subarray(srcOffset, srcOffset + unalignedBytesPerRow), dstOffset);
        }
        stagingBuffer.unmap();
      }

      this._ensurePixelsAreRGBA(framebuffer, result);

      return result;
    }

    async readFramebufferPixel(framebuffer, x, y) {
      this.flushDraw();
      // await this.finishDraw();
      // Ensure all pending GPU work is complete before reading pixels
      // await this.queue.onSubmittedWorkDone();

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


      this._ensurePixelsAreRGBA(framebuffer, result);

      stagingBuffer.unmap();
      return result;
    }

    async readFramebufferRegion(framebuffer, x, y, w, h) {
      this.flushDraw();
      // await this.finishDraw();
      // const wasActive = this.activeFramebuffer() === framebuffer;
      // if (wasActive) {
        // framebuffer.end();
        // this.flushDraw()
      // }
      // Ensure all pending GPU work is complete before reading pixels
      // await this.queue.onSubmittedWorkDone();

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
      this._ensurePixelsAreRGBA(framebuffer, pixelData);

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
      // if (wasActive) framebuffer.begin();
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

    _ensurePixelsAreRGBA(framebuffer, result) {
      // Convert BGRA to RGBA if reading from canvas-format framebuffer on BGRA systems
      if (framebuffer._useCanvasFormat && this.presentationFormat === 'bgra8unorm') {
        this._convertBGRtoRGB(result);
      }
    }

    _convertBGRtoRGB(pixelData) {
      for (let i = 0; i < pixelData.length; i += 4) {
        const temp = pixelData[i];
        pixelData[i] = pixelData[i + 2];
        pixelData[i + 2] = temp;
      }
    }

    async loadPixels() {
      this._promoteToFramebuffer();
      await this.mainFramebuffer.loadPixels();
      this.pixels = this.mainFramebuffer.pixels.slice();
    }

    async get(x, y, w, h) {
      this._promoteToFramebuffer();
      return this.mainFramebuffer.get(x, y, w, h);
    }

    filter(...args) {
      // If no custom framebuffer is active, promote to mainFramebuffer
      if (!this.activeFramebuffer()) {
        this._promoteToFramebuffer();
      }

      return super.filter(...args);
    }

    getNoiseShaderSnippet() {
      return noiseWGSL;
    }


    baseFilterShader() {
      if (!this._baseFilterShader) {
        this._baseFilterShader = new Shader(
          this,
          baseFilterVertexShader,
          baseFilterFragmentShader,
          {
            vertex: {},
            fragment: {
              "vec4<f32> getColor": `(inputs: FilterInputs, tex: texture_2d<f32>, tex_sampler: sampler) -> vec4<f32> {
                return textureSample(tex, tex_sampler, inputs.texCoord);
              }`,
            },
            hookAliases: {
              'getColor': ['filterColor'],
            },
          }
        );
      }
      return this._baseFilterShader;
    }

    baseComputeShader() {
      if (!this._baseComputeShader) {
        this._baseComputeShader = new Shader(
          this,
          baseComputeShader,
          {
            compute: {
              'void iteration': '(inputs: ComputeInputs) {}',
            },
          }
        );
      }
      return this._baseComputeShader;
    }

    /*
     * WebGPU-specific implementation of imageLight shader creation
     */
    _createImageLightShader(type) {
      if (type === 'diffused') {
        return this._pInst.createShader(
          imageLightVertexShader,
          imageLightDiffusedFragmentShader
        );
      } else if (type === 'specular') {
        return this._pInst.createShader(
          imageLightVertexShader,
          imageLightSpecularFragmentShader
        );
      }
      throw new Error(`Unknown imageLight shader type: ${type}`);
    }

    /*
     * WebGPU-specific implementation of mipmap texture creation
     */
    _createMipmapTexture(levels) {
      return new MipmapTexture(this, levels, {});
    }

    /*
     * Prepare WebGPU texture to accumulate mip levels directly
     */
    _prepareMipmapData(size, mipLevels) {
      // Create WebGPU texture with mipmaps upfront
      const textureDescriptor = {
        size: {
          width: size,
          height: size,
          depthOrArrayLayers: 1,
        },
        mipLevelCount: mipLevels,
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
      };

      const gpuTexture = this.device.createTexture(textureDescriptor);

      return {
        gpuTexture,
        size,
        mipLevels,
        format: 'rgba8unorm'
      };
    }

    /*
     * Copy framebuffer content directly to WebGPU texture mip level
     */
    _accumulateMipLevel(framebuffer, mipmapData, mipLevel, width, height) {
      this.flushDraw();
      // Copy from framebuffer texture to the mip level
      const commandEncoder = this.device.createCommandEncoder();

      // Get the underlying WebGPU texture from the framebuffer
      const sourceTexture = framebuffer.color.rawTexture().texture;

      commandEncoder.copyTextureToTexture(
        {
          texture: sourceTexture,
          origin: { x: 0, y: 0, z: 0 },
        },
        {
          texture: mipmapData.gpuTexture,
          mipLevel: mipLevel,
          origin: { x: 0, y: 0, z: 0 },
        },
        {
          width: width,
          height: height,
          depthOrArrayLayers: 1,
        }
      );

      this.device.queue.submit([commandEncoder.finish()]);
    }

    /*
     * Create final MipmapTexture from WebGPU texture
     */
    _finalizeMipmapTexture(mipmapData) {
      // Create a MipmapTexture that wraps the pre-built WebGPU texture
      return new MipmapTexture(this, mipmapData, {});
    }

    createMipmapTextureHandle({ gpuTexture, format, dataType, width, height }) {
      // WebGPU always uses pre-built GPU textures for mipmaps
      return {
        texture: gpuTexture,
        view: gpuTexture.createView(),
        glFormat: format || 'rgba8unorm',
        glDataType: dataType || 'uint8'
      };
    }

    compute(shader, x, y = 1, z = 1) {
      if (shader.shaderType !== 'compute') {
        throw new Error('compute() can only be called with a compute shader');
      }

      this._finishActiveRenderPass();

      // Ensure shader is initialized and finalized
      if (!shader._compiled) {
        shader.init();
      }

      // Set default uniforms
      shader.setDefaultUniforms();
      shader.setUniform('uTotalCount', [x, y, z]);

      // Calculate optimal workgroup size (8x8x1 = 64 threads per workgroup)
      const WORKGROUP_SIZE_X = 8;
      const WORKGROUP_SIZE_Y = 8;
      const WORKGROUP_SIZE_Z = 1;

      // Calculate number of workgroups needed
      const workgroupCountX = Math.ceil(x / WORKGROUP_SIZE_X);
      const workgroupCountY = Math.ceil(y / WORKGROUP_SIZE_Y);
      const workgroupCountZ = Math.ceil(z / WORKGROUP_SIZE_Z);

      const commandEncoder = this.device.createCommandEncoder();
      const passEncoder = commandEncoder.beginComputePass();
      this.setupShaderBindGroups(shader, passEncoder, {
        compute: true,
        workgroupSize: [WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, WORKGROUP_SIZE_Z],
      });

      // Dispatch compute workgroups
      passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY, workgroupCountZ);

      passEncoder.end();
      this.device.queue.submit([commandEncoder.finish()]);
    }
  }

  p5.RendererWebGPU = RendererWebGPU;

  p5.renderers[constants.WEBGPU] = p5.RendererWebGPU;

  // TODO: move this and the duplicate in the WebGL renderer to another file
  fn.setAttributes = async function (key, value) {
    return this._renderer._setAttributes(key, value);
  }

  /**
   * Creates a storage buffer for use in compute shaders.
   *
   * @method createStorage
   * @param {Number|Array|Float32Array} dataOrCount Either a number specifying the count of floats,
   *   or an array/Float32Array with initial data.
   * @returns {Object} A storage buffer object.
   */
  fn.createStorage = function (dataOrCount) {
    return this._renderer.createStorage(dataOrCount);
  }

  /**
   * Returns the base compute shader.
   *
   * Calling `buildComputeShader(shaderFunction)` is equivalent to
   * calling `baseComputeShader().modify(shaderFunction)`.
   *
   * @method baseComputeShader
   * @submodule p5.strands
   * @beta
   * @returns {p5.Shader} The base compute shader.
   */
  fn.baseComputeShader = function () {
    return this._renderer.baseComputeShader();
  };

  /**
   * Create a new compute shader using p5.strands.
   *
   * @method buildComputeShader
   * @submodule p5.strands
   * @beta
   * @param {Function} callback A function building a p5.strands compute shader.
   * @returns {p5.Shader} The compute shader.
   */
  fn.buildComputeShader = function (cb, context) {
    return this.baseComputeShader().modify(cb, context, { hook: 'iteration' });
  };

  /**
   * Dispatches a compute shader to run on the GPU.
   *
   * @method compute
   * @submodule p5.strands
   * @beta
   * @param {p5.Shader} shader The compute shader to run.
   * @param {Number} x Number of invocations in the X dimension.
   * @param {Number} [y=1] Number of invocations in the Y dimension.
   * @param {Number} [z=1] Number of invocations in the Z dimension.
   */
  fn.compute = function (shader, x, y, z) {
    this._renderer.compute(shader, x, y, z);
  };
}

export default rendererWebGPU;

if (typeof p5 !== "undefined") {
  rendererWebGPU(p5, p5.prototype);
}
