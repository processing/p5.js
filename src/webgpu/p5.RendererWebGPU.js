import { Renderer3D } from '../core/p5.Renderer3D';
import { Shader } from '../webgl/p5.Shader';
import * as constants from '../core/constants';

class RendererWebGPU extends Renderer3D {
  constructor(pInst, w, h, isMainCanvas, elt) {
    super(pInst, w, h, isMainCanvas, elt)

    this.renderPass = {};
  }

  async setupContext() {
    this.adapter = await navigator.gpu?.requestAdapter();
    this.device = await this.adapter?.requestDevice();
    if (!this.device) {
      throw new Error('Your browser does not support WebGPU.');
    }
    this.drawingContext = this.canvas.getContext('webgpu');
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    this.drawingContext.configure({
      device: this.device,
      format: this.presentationFormat
    });

    this.depthFormat = 'depth24plus';
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
      }
      : undefined;

    const renderPassDescriptor = {
      colorAttachments: [colorAttachment],
      ...(depthAttachment ? { depthStencilAttachment: depthAttachment } : {}),
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }


  _prepareBuffer(renderBuffer, geometry, shader) {
    const { attr, src, dst, size, map } = renderBuffer;
    const device = this.device;
    const buffers = this._getOrMakeCachedBuffers(geometry);
    const srcData = geometry[src];
    if (!srcData || srcData.length === 0) return;

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

    shader._enableAttrib(attr, size);
  }

  _enableAttrib(attr) {
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
    shader.getPipeline = ({ topology, blendMode, sampleCount, format }) => {
      const key = `${topology}_${blendMode}_${sampleCount}_${format}`;
      if (!shader._pipelineCache.has(key)) {
        const pipeline = device.createRenderPipeline({
          layout: 'auto',
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
              blend: getBlendState(blendMode),
            }],
          },
          primitive: { topology },
          multisample: { count: sampleCount },
          depthStencil: { format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less' },
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
    // You’ll probably want to cache this per shader
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

  _getFormatFromSize(size) {
    switch (size) {
      case 1: return 'float32';
      case 2: return 'float32x2';
      case 3: return 'float32x3';
      case 4: return 'float32x4';
      default: throw new Error(`Unsupported attribute size: ${size}`);
    }
  }

  _useShader(shader, options) {
    if (!options) throw new Error('Shader usage options need to be provided in WebGPU!');
    const pipeline = shader.getPipeline(options);
    this._passEncoder.setPipeline(pipeline);
  }

  _updateViewport() {

  }

  _resetBuffersBeforeDraw() {
    // TODO
  }

  //////////////////////////////////////////////
  // SHADER
  //////////////////////////////////////////////

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
          uUseVertexColor: u32,
        };

        @group(0) @binding(0) var<uniform> uniforms: Uniforms;

        @vertex
        fn main(input: VertexInput) -> VertexOutput {
          var output: VertexOutput;

          let useVertex = (uniforms.uUseVertexColor != 0u);
          let color = select(uniforms.uMaterialColor, input.aVertexColor, useVertex);

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
