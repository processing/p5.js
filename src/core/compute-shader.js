class ComputeShader {
  constructor(p5Instance, config) {
    this.p5 = p5Instance;
    this.gl = this.p5._renderer.GL;
    
    if (!this.gl) {
      throw new Error('ComputeShader requires WEBGL mode');
    }

    this.particleCount = config.particleCount || 1000;
    this.particleStruct = config.particleStruct;
    this.computeFunction = config.computeFunction;
    
    this._initCapabilities();
    this._initShaders();
    this._initFramebuffers();
  }

  _initCapabilities() {
    const gl = this.gl;
    
    if (gl.getExtension('OES_texture_float') && 
        (gl.getExtension('WEBGL_color_buffer_float') || gl.getExtension('EXT_color_buffer_float'))) {
      this.textureType = gl.FLOAT;
      console.log('Using FLOAT textures');
    } else if (gl.getExtension('OES_texture_half_float') && 
               (gl.getExtension('EXT_color_buffer_half_float') || gl.getExtension('WEBGL_color_buffer_float'))) {
      this.textureType = gl.getExtension('OES_texture_half_float').HALF_FLOAT_OES;
      console.log('Using HALF_FLOAT textures');
    } else {
      console.warn('Float textures not supported. Falling back to UNSIGNED_BYTE.');
      this.textureType = gl.UNSIGNED_BYTE;
    }
  }

  _initShaders() {
    const vertexShader = `
      attribute vec2 aPosition;
      varying vec2 vTexCoord;
      
      void main() {
        vTexCoord = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShader = this._generateFragmentShader();
    
    this.shader = this.p5.createShader(vertexShader, fragmentShader);
  }

  _generateFragmentShader() {
    const structFields = Object.entries(this.particleStruct)
      .map(([name, type]) => `  ${type} ${name};`)
      .join('\n');

    const floatsPerParticle = Object.values(this.particleStruct).reduce((sum, type) => sum + (type === 'float' ? 1 : parseInt(type.slice(3))), 0);
    const pixelsPerParticle = Math.ceil(floatsPerParticle / 4);

    return `
      #ifdef GL_ES
      precision highp float;
      #endif
      
      uniform sampler2D uState;
      uniform vec2 uResolution;
      varying vec2 vTexCoord;

      struct Particle {
${structFields}
      };

      ${this._generateReadParticleFunction(floatsPerParticle, pixelsPerParticle)}
      ${this._generateWriteParticleFunction(floatsPerParticle, pixelsPerParticle)}
      ${this.computeFunction}

      void main() {
        ivec2 pixelCoord = ivec2(gl_FragCoord.xy);
        int particleIndex = int(pixelCoord.y) * int(uResolution.x) + int(pixelCoord.x);
        int pixelIndex = particleIndex / ${pixelsPerParticle};
        
        if (float(pixelIndex) >= ${this.particleCount}.0) {
          gl_FragColor = vec4(0.0);
          return;
        }
        
        Particle particle = readParticle(pixelIndex);
        particle = compute(particle);
        writeParticle(particle, particleIndex);
      }
    `;
  }

  _generateReadParticleFunction(floatsPerParticle, pixelsPerParticle) {
    let readFunction = `
      Particle readParticle(int index) {
        Particle p;
        int baseIndex = index * ${pixelsPerParticle};
    `;

    let componentIndex = 0;
    let pixelOffset = 0;

    for (const [name, type] of Object.entries(this.particleStruct)) {
      const components = type === 'float' ? 1 : parseInt(type.slice(3));
      for (let i = 0; i < components; i++) {
        readFunction += `    p.${name}${components > 1 ? `[${i}]` : ''} = texture2D(uState, vec2((float(baseIndex + ${pixelOffset}) + 0.5) / uResolution.x, 0.5)).${['r', 'g', 'b', 'a'][componentIndex]};\n`;
        componentIndex++;
        if (componentIndex === 4) {
          componentIndex = 0;
          pixelOffset++;
        }
      }
    }

    readFunction += `
        return p;
      }
    `;

    return readFunction;
  }

  _generateWriteParticleFunction(floatsPerParticle, pixelsPerParticle) {
    let writeFunction = `
      void writeParticle(Particle p, int particleIndex) {
        int pixelIndex = int(mod(float(particleIndex), float(${pixelsPerParticle})));
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    `;

    let componentIndex = 0;
    let pixelOffset = 0;

    for (const [name, type] of Object.entries(this.particleStruct)) {
      const components = type === 'float' ? 1 : parseInt(type.slice(3));
      for (let i = 0; i < components; i++) {
        writeFunction += `    if (pixelIndex == ${pixelOffset}) color.${['r', 'g', 'b', 'a'][componentIndex]} = p.${name}${components > 1 ? `[${i}]` : ''};\n`;
        componentIndex++;
        if (componentIndex === 4) {
          componentIndex = 0;
          pixelOffset++;
        }
      }
    }

    writeFunction += `
        gl_FragColor = color;
      }
    `;

    return writeFunction;
  }

  _initFramebuffers() {
    const floatsPerParticle = Object.values(this.particleStruct).reduce((sum, type) => sum + (type === 'float' ? 1 : parseInt(type.slice(3))), 0);
    const pixelsPerParticle = Math.ceil(floatsPerParticle / 4);
    this.textureWidth = Math.ceil(Math.sqrt(this.particleCount * pixelsPerParticle));
    this.textureHeight = Math.ceil((this.particleCount * pixelsPerParticle) / this.textureWidth);

    const options = {
      format: this.p5.RGBA,
      type: this.textureType === this.gl.FLOAT ? this.p5.FLOAT : 
            this.textureType === this.gl.HALF_FLOAT ? this.p5.HALF_FLOAT : 
            this.p5.UNSIGNED_BYTE,
      width: this.textureWidth,
      height: this.textureHeight
    };

    this.inputFramebuffer = this.p5.createFramebuffer(options);
    this.outputFramebuffer = this.p5.createFramebuffer(options);
  }

  compute() {
    this.p5.push();
    this.p5.noStroke();
    
    this.outputFramebuffer.begin();
    this.p5.shader(this.shader);
    
    this.shader.setUniform('uState', this.inputFramebuffer.color);
    this.shader.setUniform('uResolution', [this.textureWidth, this.textureHeight]);
    
    this.p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    
    this.outputFramebuffer.end();
    
    // Swap input and output framebuffers
    [this.inputFramebuffer, this.outputFramebuffer] = [this.outputFramebuffer, this.inputFramebuffer];
    
    this.p5.pop();
  }

  setParticles(particles) {
    const floatsPerParticle = Object.values(this.particleStruct).reduce((sum, type) => sum + (type === 'float' ? 1 : parseInt(type.slice(3))), 0);
    const pixelsPerParticle = Math.ceil(floatsPerParticle / 4);
    const data = new Float32Array(this.textureWidth * this.textureHeight * 4);
    
    let index = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (const [name, type] of Object.entries(this.particleStruct)) {
        if (type === 'float') {
          data[index++] = p[name];
        } else {
          const components = parseInt(type.slice(3));
          for (let j = 0; j < components; j++) {
            data[index++] = p[name][j];
          }
        }
      }
      // Pad with zeros if necessary
      while (index % (pixelsPerParticle * 4) !== 0) {
        data[index++] = 0;
      }
    }
    
    this.inputFramebuffer.begin();
    this.p5.background(0);
    this.inputFramebuffer.loadPixels();
    this.inputFramebuffer.pixels.set(data);
    this.inputFramebuffer.updatePixels();
    this.inputFramebuffer.end();
  }

  getParticles() {
    const floatsPerParticle = Object.values(this.particleStruct).reduce((sum, type) => sum + (type === 'float' ? 1 : parseInt(type.slice(3))), 0);
    const pixelsPerParticle = Math.ceil(floatsPerParticle / 4);
    
    this.inputFramebuffer.loadPixels();
    const data = this.inputFramebuffer.pixels;
    
    const particles = [];
    let index = 0;
    for (let i = 0; i < this.particleCount; i++) {
      const particle = {};
      for (const [name, type] of Object.entries(this.particleStruct)) {
        if (type === 'float') {
          particle[name] = data[index++];
        } else {
          const components = parseInt(type.slice(3));
          particle[name] = [];
          for (let j = 0; j < components; j++) {
            particle[name].push(data[index++]);
          }
        }
      }
      // Skip padding
      index = (i + 1) * pixelsPerParticle * 4;
      particles.push(particle);
    }
    
    return particles;
  }
}

function computeShaderAdditions(p5, fn) {
  p5.ComputeShader = ComputeShader;
  
  fn.createComputeShader = function(config) {
    if (!this._renderer || !this._renderer.GL) {
      throw new Error('ComputeShader requires WEBGL mode. Use createCanvas(w, h, WEBGL)');
    }
    return new ComputeShader(this, config);
  };
}

export { ComputeShader };
export default computeShaderAdditions;