class ComputeShader {
  constructor(p5Instance, config) {
    this.p5 = p5Instance
    this.gl = this.p5._renderer.GL

    if (!this.gl) {
      throw new Error("ComputeShader requires WEBGL mode")
    }

    this.particleCount = config.particleCount || 1000
    this.particleStruct = config.particleStruct || {
      position: "vec2",
      velocity: "vec2",
      age: "float",
    }
    this.computeFunction = config.computeFunction || ""

    this._initShaders()
    this._initFramebuffers()
  }

  _initShaders() {
    const vertexShader = `#version 300 es
      in vec2 aPosition;
      out vec2 vTexCoord;
      
      void main() {
        vTexCoord = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `

    const fragmentShader = this._generateFragmentShader()

    this.shader = this.p5.createShader(vertexShader, fragmentShader)
  }

  _generateFragmentShader() {
    const structFields = Object.entries(this.particleStruct)
      .map(([name, type]) => `  ${type} ${name};`)
      .join("\n")

    const floatsPerParticle = Object.values(this.particleStruct).reduce(
      (sum, type) => sum + (type === "float" ? 1 : Number.parseInt(type.slice(3))),
      0,
    )
    const pixelsPerParticle = Math.max(1, Math.ceil(floatsPerParticle / 4))

    const fragmentShader = `#version 300 es
      precision highp float;
      
      uniform sampler2D uState;
      uniform vec2 uResolution;
      in vec2 vTexCoord;
      out vec4 fragColor;

      struct Particle {
${structFields}
      };

      ${this._generateReadParticleFunction(floatsPerParticle, pixelsPerParticle)}
      ${this._generateWriteParticleFunction(floatsPerParticle, pixelsPerParticle)}
      ${this.computeFunction.replace(/State/g, "Particle")}

      void main() {
        ivec2 pixelCoord = ivec2(gl_FragCoord.xy);
        int particleIndex = int(pixelCoord.y) * int(uResolution.x) + int(pixelCoord.x);
        int pixelIndex = particleIndex / ${pixelsPerParticle};
        
        if (float(pixelIndex) >= ${this.particleCount}.0) {
          fragColor = vec4(0.0);
          return;
        }
        
        Particle particle = readParticle(pixelIndex);
        particle = compute(particle);
        writeParticle(particle, particleIndex);
      }
    `
    
    return fragmentShader
  }

  _generateReadParticleFunction(floatsPerParticle, pixelsPerParticle) {
    let readFunction = `
      Particle readParticle(int index) {
        Particle p;
        int baseIndex = index * ${pixelsPerParticle};
    `

    let componentIndex = 0
    let pixelOffset = 0

    for (const [name, type] of Object.entries(this.particleStruct)) {
      const components = type === "float" ? 1 : Number.parseInt(type.slice(3))
      for (let i = 0; i < components; i++) {
        readFunction += `    p.${name}${components > 1 ? `[${i}]` : ""} = texelFetch(uState, ivec2(baseIndex + ${pixelOffset}, 0), 0).${["r", "g", "b", "a"][componentIndex]};\n`
        componentIndex++
        if (componentIndex === 4) {
          componentIndex = 0
          pixelOffset++
        }
      }
    }

    readFunction += `
        return p;
      }
    `

    return readFunction
  }

  _generateWriteParticleFunction(floatsPerParticle, pixelsPerParticle) {
    let writeFunction = `
      void writeParticle(Particle p, int particleIndex) {
        int pixelIndex = particleIndex % ${pixelsPerParticle};
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    `

    let componentIndex = 0
    let pixelOffset = 0

    for (const [name, type] of Object.entries(this.particleStruct)) {
      const components = type === "float" ? 1 : Number.parseInt(type.slice(3))
      for (let i = 0; i < components; i++) {
        writeFunction += `    if (pixelIndex == ${pixelOffset}) color.${["r", "g", "b", "a"][componentIndex]} = p.${name}${components > 1 ? `[${i}]` : ""};\n`
        componentIndex++
        if (componentIndex === 4) {
          componentIndex = 0
          pixelOffset++
        }
      }
    }

    writeFunction += `
        fragColor = color;
      }
    `

    return writeFunction
  }

  _initFramebuffers() {
    const floatsPerParticle = Object.values(this.particleStruct).reduce(
      (sum, type) => sum + (type === "float" ? 1 : Number.parseInt(type.slice(3))),
      0,
    )
    const pixelsPerParticle = Math.max(1, Math.ceil(floatsPerParticle / 4))
    this.textureWidth = this.particleCount * pixelsPerParticle
    this.textureHeight = 1

    const options = {
      format: this.p5.RGBA32F,
      type: this.p5.FLOAT,
      width: this.textureWidth,
      height: this.textureHeight,
    }

    this.inputFramebuffer = this.p5.createFramebuffer(options)
    this.outputFramebuffer = this.p5.createFramebuffer(options)
  }

  compute() {
    this.p5.push()
    this.p5.noStroke()

    this.outputFramebuffer.begin()
    this.p5.shader(this.shader)

    this.shader.setUniform("uState", this.inputFramebuffer.color)
    this.shader.setUniform("uResolution", [this.textureWidth, this.textureHeight])

    this.p5.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    this.outputFramebuffer.end()

    // Swap input and output framebuffers
    ;[this.inputFramebuffer, this.outputFramebuffer] = [this.outputFramebuffer, this.inputFramebuffer]

    this.p5.pop()
  }

  setParticles(particles) {
    const floatsPerParticle = Object.values(this.particleStruct).reduce(
      (sum, type) => sum + (type === "float" ? 1 : Number.parseInt(type.slice(3))),
      0,
    )
    const pixelsPerParticle = Math.max(1, Math.ceil(floatsPerParticle / 4))
    const data = new Float32Array(this.textureWidth * this.textureHeight * 4)

    let index = 0
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      for (const [name, type] of Object.entries(this.particleStruct)) {
        if (type === "float") {
          data[index++] = p[name]
        } else {
          const components = Number.parseInt(type.slice(3))
          for (let j = 0; j < components; j++) {
            data[index++] = p[name][j]
          }
        }
      }
      // Set remaining components to 0
      while (index % 4 !== 0) {
        data[index++] = 0
      }
    }

    this.inputFramebuffer.begin()
    this.p5.background(0)

    this.inputFramebuffer.loadPixels()
    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    this.inputFramebuffer.pixels.set(data)
    this.inputFramebuffer.updatePixels()
    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

    this.inputFramebuffer.end()
  }

  getParticles() {
    const floatsPerParticle = Object.values(this.particleStruct).reduce(
      (sum, type) => sum + (type === "float" ? 1 : Number.parseInt(type.slice(3))),
      0,
    )
    const pixelsPerParticle = Math.max(1, Math.ceil(floatsPerParticle / 4))

    this.inputFramebuffer.loadPixels()
    const data = this.inputFramebuffer.pixels

    const particles = []
    let index = 0
    for (let i = 0; i < this.particleCount; i++) {
      const particle = {}
      for (const [name, type] of Object.entries(this.particleStruct)) {
        if (type === "float") {
          particle[name] = data[index++]
        } else {
          const components = Number.parseInt(type.slice(3))
          particle[name] = []
          for (let j = 0; j < components; j++) {
            particle[name].push(data[index++])
          }
        }
      }
      // Skip remaining components
      index = (i + 1) * pixelsPerParticle * 4
      particles.push(particle)
    }

    return particles
  }
}

function computeShaderAdditions(p5, fn) {
  p5.ComputeShader = ComputeShader

  fn.createComputeShader = function (config) {
    if (!this._renderer || !this._renderer.GL) {
      throw new Error("ComputeShader requires WEBGL mode. Use createCanvas(w, h, WEBGL)")
    }
    return new ComputeShader(this, config)
  }
}

export { ComputeShader }
export default computeShaderAdditions