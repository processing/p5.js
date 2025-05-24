import { Renderer3D } from '../core/p5.Renderer3D';
import { Shader } from '../webgl/p5.Shader';
import * as constants from '../core/constants';

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
        stencilLoadOp: "load",
        stencilStoreOp: "store",
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
      // TODO handle this case
      // geometry[src] = srcData = geometry.vertices.map
    }

    const raw = map ? map(srcData) : srcData;
    const typed = this._normalizeBufferData(raw, Float32Array);

    let buffer = buffers[dst];
    if (!buffer || buffer.size < typed.byteLength) {
      if (buffer) buffer.destroy();
      buffer = device.createBuffer({
        size: typed.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      buffers[dst] = buffer;
    }

    device.queue.writeBuffer(buffer, 0, typed);
    geometry.dirtyFlags[src] = false;

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

  _shaderOptions(mode) {
    return {
      topology: mode === constants.TRIANGLE_STRIP ? 'triangle-strip' : 'triangle-list',
      blendMode: this.blendMode(),
      sampleCount: (this.activeFramebuffer() || this).antialias || 1, // TODO
      format: this.activeFramebuffer()?.format || this.presentationFormat, // TODO
    }
  }

  _initShader(shader) {
    const device = this.device;

    shader.vertModule = device.createShaderModule({ code: shader.vertSrc() });
    shader.fragModule = device.createShaderModule({ code: shader.fragSrc() });

    shader._pipelineCache = new Map();
    shader.getPipeline = ({ topology, blendMode, sampleCount, format, useVertexColor }) => {
      const key = `${topology}_${blendMode}_${sampleCount}_${format}_${useVertexColor}`;
      if (!shader._pipelineCache.has(key)) {
        const pipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: {
            module: shader.vertModule,
            entryPoint: 'main',
            buffers: this._getVertexLayout(shader),
            constants: {
              useVertexColor,
            },
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
            stencilLoadOp: "load",
            stencilStoreOp: "store",
          },
        });
        shader._pipelineCache.set(key, pipeline);
      }
      return shader._pipelineCache.get(key);
    }
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

  }

  _resetBuffersBeforeDraw() {
    // TODO
  }

  //////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////

  _drawBuffers(geometry, { mode = constants.TRIANGLES, count = 1 }) {
    const buffers = this.geometryBufferCache.getCached(geometry);
    if (!buffers) return;

    const commandEncoder = this.device.createCommandEncoder();
    const colorAttachment = {
      view: this.drawingContext.getCurrentTexture().createView(),
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
          }
        : undefined,
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    const useVertexColor = false; // TODO grab this from geometry
    passEncoder.setPipeline(this._curShader.getPipeline(this._shaderOptions({ mode, useVertexColor })));

    // Bind vertex buffers
    for (const buffer of this._getVertexBuffers(this._curShader)) {
      passEncoder.setVertexBuffer(this._curShader.attributes[buffer.attr].location, buffers[buffer.dst], 0);
    }
    /*for (let slot = 0; slot < buffers.vertexBuffers.length; slot++) {
      const { buffer, offset = 0 } = buffers.vertexBuffers[slot];
      passEncoder.setVertexBuffer(slot, buffer, offset);
    }*/

    // Bind index buffer and issue draw
    if (buffers.indexBuffer) {
      const indexFormat = buffers.indexFormat || "uint16";
      passEncoder.setIndexBuffer(buffers.indexBuffer, indexFormat);
      passEncoder.drawIndexed(geometry.faces.length * 3, count, 0, 0, 0);
    } else {
      passEncoder.draw(geometry.vertices.length, count, 0, 0);
    }

    passEncoder.end();
    this.queue.submit([commandEncoder.finish()]);
  }

  //////////////////////////////////////////////
  // SHADER
  //////////////////////////////////////////////

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

    const elementRegex = /(?:@location\((\d+)\)\s+)?(\w+):\s+((vec[234](?:<f32>|f))|f32|i32|u32|bool)/g
    while ((match = elementRegex.exec(structBody)) !== null) {
      const [_, location, name, type] = match;
      const size = type.startsWith('vec') ? parseInt(type[3]) : 1;
      elements[name] = {
        name,
        location: location ? parseInt(location) : undefined,
        index,
        type,
        size,
      };
      index++;
    }

    return elements;
  }

  _getShaderAttributes(shader) {
    const mainMatch = /fn main\(.+:\s*(\S+)\s*\)/.exec(shader._vertSrc);
    if (!mainMatch) throw new Error("Can't find `fn main` in vertex shader source");
    const inputType = mainMatch[1];

    return this._parseStruct(shader._vertSrc, inputType);
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
    const uniforms = this._parseStruct(shader._vertSrc, structType);

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
    return [...Object.values(uniforms), ...samplers];
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
      this._defaultColorShader = new Shader(this, `
        struct VertexInput {
          @location(0) aPosition: vec3<f32>,
          @location(1) aNormal: vec3<f32>,
          @location(2) aTexCoord: vec2<f32>,
          @location(3) aVertexColor: vec4<f32>,
        };

        struct VertexOutput {
          @builtin(position) Position: vec4<f32>,
          @location(0) vVertexNormal: vec3<f32>,
          @location(1) vVertTexCoord: vec2<f32>,
          @location(2) vColor: vec4<f32>,
        };

        struct Uniforms {
          uModelViewMatrix: mat4x4<f32>,
          uProjectionMatrix: mat4x4<f32>,
          uNormalMatrix: mat3x3<f32>,
          uMaterialColor: vec4<f32>,
        };

        @group(0) @binding(0) var<uniform> uniforms: Uniforms;

        override useVertexColor: bool;

        @vertex
        fn main(input: VertexInput) -> VertexOutput {
          var output: VertexOutput;

          let color = select(uniforms.uMaterialColor, input.aVertexColor, useVertexColor);

          let pos4 = vec4<f32>(input.aPosition, 1.0);
          let worldPos = uniforms.uModelViewMatrix * pos4;
          output.Position = uniforms.uProjectionMatrix * worldPos;

          output.vVertexNormal = normalize(uniforms.uNormalMatrix * input.aNormal);
          output.vVertTexCoord = input.aTexCoord;
          output.vColor = color;

          return output;
        }
      `, `
        struct FragmentInput {
          @location(0) vVertexNormal: vec3<f32>,
          @location(1) vVertTexCoord: vec2<f32>,
          @location(2) vColor: vec4<f32>,
        };

        @fragment
        fn main(input: FragmentInput) -> @location(0) vec4<f32> {
          return vec4<f32>(input.vColor.rgb * input.vColor.a, input.vColor.a);
        }
      `)
    }
    return this._defaultColorShader;
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
}

function rendererWebGPU(p5, fn) {
  p5.RendererWebGPU = RendererWebGPU;

  p5.renderers[constants.WEBGPU] = p5.RendererWebGPU;
}

export default rendererWebGPU;
export { RendererWebGPU };
