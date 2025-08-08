import * as constants from '../core/constants';
import { Texture } from './p5.Texture';

/**
 * @private
 * @param {Uint8Array|Float32Array|undefined} pixels An existing pixels array to reuse if the size is the same
 * @param {WebGLRenderingContext} gl The WebGL context
 * @param {WebGLFramebuffer|null} framebuffer The Framebuffer to read
 * @param {Number} x The x coordiante to read, premultiplied by pixel density
 * @param {Number} y The y coordiante to read, premultiplied by pixel density
 * @param {Number} width The width in pixels to be read (factoring in pixel density)
 * @param {Number} height The height in pixels to be read (factoring in pixel density)
 * @param {GLEnum} format Either RGB or RGBA depending on how many channels to read
 * @param {GLEnum} type The datatype of each channel, e.g. UNSIGNED_BYTE or FLOAT
 * @param {Number|undefined} flipY If provided, the total height with which to flip the y axis about
 * @returns {Uint8Array|Float32Array} pixels A pixels array with the current state of the
 * WebGL context read into it
 */
export function readPixelsWebGL(
  pixels,
  gl,
  framebuffer,
  x,
  y,
  width,
  height,
  format,
  type,
  flipY
) {
  // Record the currently bound framebuffer so we can go back to it after, and
  // bind the framebuffer we want to read from
  const prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  const channels = format === gl.RGBA ? 4 : 3;

  // Make a pixels buffer if it doesn't already exist
  const len = width * height * channels;
  const TypedArrayClass = type === gl.UNSIGNED_BYTE ? Uint8Array : Float32Array;
  if (!(pixels instanceof TypedArrayClass) || pixels.length !== len) {
    pixels = new TypedArrayClass(len);
  }

  gl.readPixels(
    x,
    flipY ? flipY - y - height : y,
    width,
    height,
    format,
    type,
    pixels
  );

  // Re-bind whatever was previously bound
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer);

  if (flipY) {
    // WebGL pixels are inverted compared to 2D pixels, so we have to flip
    // the resulting rows. Adapted from https://stackoverflow.com/a/41973289
    const halfHeight = Math.floor(height / 2);
    const tmpRow = new TypedArrayClass(width * channels);
    for (let y = 0; y < halfHeight; y++) {
      const topOffset = y * width * 4;
      const bottomOffset = (height - y - 1) * width * 4;
      tmpRow.set(pixels.subarray(topOffset, topOffset + width * 4));
      pixels.copyWithin(topOffset, bottomOffset, bottomOffset + width * 4);
      pixels.set(tmpRow, bottomOffset);
    }
  }

  return pixels;
}

/**
 * @private
 * @param {WebGLRenderingContext} gl The WebGL context
 * @param {WebGLFramebuffer|null} framebuffer The Framebuffer to read
 * @param {Number} x The x coordinate to read, premultiplied by pixel density
 * @param {Number} y The y coordinate to read, premultiplied by pixel density
 * @param {GLEnum} format Either RGB or RGBA depending on how many channels to read
 * @param {GLEnum} type The datatype of each channel, e.g. UNSIGNED_BYTE or FLOAT
 * @param {Number|undefined} flipY If provided, the total height with which to flip the y axis about
 * @returns {Number[]} pixels The channel data for the pixel at that location
 */
export function readPixelWebGL(gl, framebuffer, x, y, format, type, flipY) {
  // Record the currently bound framebuffer so we can go back to it after, and
  // bind the framebuffer we want to read from
  const prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  const channels = format === gl.RGBA ? 4 : 3;
  const TypedArrayClass = type === gl.UNSIGNED_BYTE ? Uint8Array : Float32Array;
  const pixels = new TypedArrayClass(channels);

  gl.readPixels(x, flipY ? flipY - y - 1 : y, 1, 1, format, type, pixels);

  // Re-bind whatever was previously bound
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer);

  return Array.from(pixels);
}

export function setWebGLTextureParams(texture, gl, webglVersion) {
  texture.bindTexture();
  const glMinFilter = texture.minFilter === constants.NEAREST ? gl.NEAREST : gl.LINEAR;
  const glMagFilter = texture.magFilter === constants.NEAREST ? gl.NEAREST : gl.LINEAR;

  // for webgl 1 we need to check if the texture is power of two
  // if it isn't we will set the wrap mode to CLAMP
  // webgl2 will support npot REPEAT and MIRROR but we don't check for it yet
  const isPowerOfTwo = x => (x & (x - 1)) === 0;
  const textureData = texture._getTextureDataFromSource();

  let wrapWidth;
  let wrapHeight;

  if (textureData.naturalWidth && textureData.naturalHeight) {
    wrapWidth = textureData.naturalWidth;
    wrapHeight = textureData.naturalHeight;
  } else {
    wrapWidth = texture.width;
    wrapHeight = texture.height;
  }

  const widthPowerOfTwo = isPowerOfTwo(wrapWidth);
  const heightPowerOfTwo = isPowerOfTwo(wrapHeight);
  let glWrapS, glWrapT;

  if (texture.wrapS === constants.REPEAT) {
    if (
      webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
    ) {
      glWrapS = gl.REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
      );
      glWrapS = gl.CLAMP_TO_EDGE;
    }
  } else if (texture.wrapS === constants.MIRROR) {
    if (
      webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
    ) {
      glWrapS = gl.MIRRORED_REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to MIRROR but the texture size is not a power of two. Setting to CLAMP instead'
      );
      glWrapS = gl.CLAMP_TO_EDGE;
    }
  } else {
    // falling back to default if didn't get a proper mode
    glWrapS = gl.CLAMP_TO_EDGE;
  }

  if (texture.wrapT === constants.REPEAT) {
    if (
      webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
    ) {
      glWrapT = gl.REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
      );
      glWrapT = gl.CLAMP_TO_EDGE;
    }
  } else if (texture.wrapT === constants.MIRROR) {
    if (
      webglVersion === constants.WEBGL2 ||
      (widthPowerOfTwo && heightPowerOfTwo)
    ) {
      glWrapT = gl.MIRRORED_REPEAT;
    } else {
      console.warn(
        'You tried to set the wrap mode to MIRROR but the texture size is not a power of two. Setting to CLAMP instead'
      );
      glWrapT = gl.CLAMP_TO_EDGE;
    }
  } else {
    // falling back to default if didn't get a proper mode
    glWrapT = gl.CLAMP_TO_EDGE;
  }

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMinFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMagFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, glWrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, glWrapT);
  texture.unbindTexture();
}

export function setWebGLUniformValue(shader, uniform, data, getTexture, gl) {
  const location = uniform.location;
  shader.useProgram();

  switch (uniform.type) {
    case gl.BOOL:
      if (data === true) {
        gl.uniform1i(location, 1);
      } else {
        gl.uniform1i(location, 0);
      }
      break;
    case gl.INT:
      if (uniform.size > 1) {
        data.length && gl.uniform1iv(location, data);
      } else {
        gl.uniform1i(location, data);
      }
      break;
    case gl.FLOAT:
      if (uniform.size > 1) {
        data.length && gl.uniform1fv(location, data);
      } else {
        gl.uniform1f(location, data);
      }
      break;
    case gl.FLOAT_MAT3:
      gl.uniformMatrix3fv(location, false, data);
      break;
    case gl.FLOAT_MAT4:
      gl.uniformMatrix4fv(location, false, data);
      break;
    case gl.FLOAT_VEC2:
      if (uniform.size > 1) {
        data.length && gl.uniform2fv(location, data);
      } else {
        gl.uniform2f(location, data[0], data[1]);
      }
      break;
    case gl.FLOAT_VEC3:
      if (uniform.size > 1) {
        data.length && gl.uniform3fv(location, data);
      } else {
        gl.uniform3f(location, data[0], data[1], data[2]);
      }
      break;
    case gl.FLOAT_VEC4:
      if (uniform.size > 1) {
        data.length && gl.uniform4fv(location, data);
      } else {
        gl.uniform4f(location, data[0], data[1], data[2], data[3]);
      }
      break;
    case gl.INT_VEC2:
      if (uniform.size > 1) {
        data.length && gl.uniform2iv(location, data);
      } else {
        gl.uniform2i(location, data[0], data[1]);
      }
      break;
    case gl.INT_VEC3:
      if (uniform.size > 1) {
        data.length && gl.uniform3iv(location, data);
      } else {
        gl.uniform3i(location, data[0], data[1], data[2]);
      }
      break;
    case gl.INT_VEC4:
      if (uniform.size > 1) {
        data.length && gl.uniform4iv(location, data);
      } else {
        gl.uniform4i(location, data[0], data[1], data[2], data[3]);
      }
      break;
    case gl.SAMPLER_2D:
      if (typeof data == 'number') {
        if (
          data < gl.TEXTURE0 ||
          data > gl.TEXTURE31 ||
          data !== Math.ceil(data)
        ) {
          console.log(
            '🌸 p5.js says: ' +
              "You're trying to use a number as the data for a texture." +
              'Please use a texture.'
          );
          return this;
        }
        gl.activeTexture(data);
        gl.uniform1i(location, data);
      } else {
        gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
        uniform.texture =
          data instanceof Texture ? data : getTexture(data);
        gl.uniform1i(location, uniform.samplerIndex);
        if (uniform.texture.src.gifProperties) {
          uniform.texture.src._animateGif(this._pInst);
        }
      }
      break;
    case gl.SAMPLER_CUBE:
    case gl.SAMPLER_3D:
    case gl.SAMPLER_2D_SHADOW:
    case gl.SAMPLER_2D_ARRAY:
    case gl.SAMPLER_2D_ARRAY_SHADOW:
    case gl.SAMPLER_CUBE_SHADOW:
    case gl.INT_SAMPLER_2D:
    case gl.INT_SAMPLER_3D:
    case gl.INT_SAMPLER_CUBE:
    case gl.INT_SAMPLER_2D_ARRAY:
    case gl.UNSIGNED_INT_SAMPLER_2D:
    case gl.UNSIGNED_INT_SAMPLER_3D:
    case gl.UNSIGNED_INT_SAMPLER_CUBE:
    case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
      if (typeof data !== 'number') {
        break;
      }
      if (
        data < gl.TEXTURE0 ||
        data > gl.TEXTURE31 ||
        data !== Math.ceil(data)
      ) {
        console.log(
          '🌸 p5.js says: ' +
            "You're trying to use a number as the data for a texture." +
            'Please use a texture.'
        );
        break;
      }
      gl.activeTexture(data);
      gl.uniform1i(location, data);
      break;
    //@todo complete all types
  }
}

export function getWebGLUniformMetadata(shader, gl) {
  const program = shader._glProgram;

  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const result = [];

  let samplerIndex = 0;

  for (let i = 0; i < numUniforms; ++i) {
    const uniformInfo = gl.getActiveUniform(program, i);
    const uniform = {};
    uniform.location = gl.getUniformLocation(
      program,
      uniformInfo.name
    );
    uniform.size = uniformInfo.size;
    let uniformName = uniformInfo.name;
    //uniforms that are arrays have their name returned as
    //someUniform[0] which is a bit silly so we trim it
    //off here. The size property tells us that its an array
    //so we dont lose any information by doing this
    if (uniformInfo.size > 1) {
      uniformName = uniformName.substring(0, uniformName.indexOf('[0]'));
    }
    uniform.name = uniformName;
    uniform.type = uniformInfo.type;
    uniform._cachedData = undefined;
    if (uniform.type === gl.SAMPLER_2D) {
      uniform.isSampler = true;
      uniform.samplerIndex = samplerIndex;
      samplerIndex++;
    }

    uniform.isArray =
      uniformInfo.size > 1 ||
      uniform.type === gl.FLOAT_MAT3 ||
      uniform.type === gl.FLOAT_MAT4 ||
      uniform.type === gl.FLOAT_VEC2 ||
      uniform.type === gl.FLOAT_VEC3 ||
      uniform.type === gl.FLOAT_VEC4 ||
      uniform.type === gl.INT_VEC2 ||
      uniform.type === gl.INT_VEC4 ||
      uniform.type === gl.INT_VEC3;

    result.push(uniform);
  }

  return result;
}

export function getWebGLShaderAttributes(shader, gl) {
  const attributes = {};

  const numAttributes = gl.getProgramParameter(
    shader._glProgram,
    gl.ACTIVE_ATTRIBUTES
  );
  for (let i = 0; i < numAttributes; ++i) {
    const attributeInfo = gl.getActiveAttrib(shader._glProgram, i);
    const name = attributeInfo.name;
    const location = gl.getAttribLocation(shader._glProgram, name);
    const attribute = {};
    attribute.name = name;
    attribute.location = location;
    attribute.index = i;
    attribute.type = attributeInfo.type;
    attribute.size = attributeInfo.size;
    attributes[name] = attribute;
  }

  return attributes;
}

export function populateGLSLHooks(shader, src, shaderType) {
  const main = 'void main';
  if (!src.includes(main)) return src;

  let [preMain, postMain] = src.split(main);

  let hooks = '';
  let defines = '';
  for (const key in shader.hooks.uniforms) {
    hooks += `uniform ${key};\n`;
  }
  if (shader.hooks.declarations) {
    hooks += shader.hooks.declarations + '\n';
  }
  if (shader.hooks[shaderType].declarations) {
    hooks += shader.hooks[shaderType].declarations + '\n';
  }
  for (const hookDef in shader.hooks.helpers) {
    hooks += `${hookDef}${shader.hooks.helpers[hookDef]}\n`;
  }
  for (const hookDef in shader.hooks[shaderType]) {
    if (hookDef === 'declarations') continue;
    const [hookType, hookName] = hookDef.split(' ');

    // Add a #define so that if the shader wants to use preprocessor directives to
    // optimize away the extra function calls in main, it can do so
    if (
      shader.hooks.modified.vertex[hookDef] ||
      shader.hooks.modified.fragment[hookDef]
    ) {
      defines += '#define AUGMENTED_HOOK_' + hookName + '\n';
    }

    hooks +=
      hookType + ' HOOK_' + hookName + shader.hooks[shaderType][hookDef] + '\n';
  }

  // Allow shaders to specify the location of hook #define statements. Normally these
  // go after function definitions, but one might want to have them defined earlier
  // in order to only conditionally make uniforms.
  if (preMain.indexOf('#define HOOK_DEFINES') !== -1) {
    preMain = preMain.replace('#define HOOK_DEFINES', '\n' + defines + '\n');
    defines = '';
  }

  return preMain + '\n' + defines + hooks + main + postMain;
}

export function checkWebGLCapabilities({ GL, webglVersion }) {
  const gl = GL;
  const supportsFloat = webglVersion === constants.WEBGL2
    ? (gl.getExtension('EXT_color_buffer_float') &&
        gl.getExtension('EXT_float_blend'))
    : gl.getExtension('OES_texture_float');
  const supportsFloatLinear = supportsFloat &&
    gl.getExtension('OES_texture_float_linear');
  const supportsHalfFloat = webglVersion === constants.WEBGL2
    ? gl.getExtension('EXT_color_buffer_float')
    : gl.getExtension('OES_texture_half_float');
  const supportsHalfFloatLinear = supportsHalfFloat &&
    gl.getExtension('OES_texture_half_float_linear');
  return {
    float: supportsFloat,
    floatLinear: supportsFloatLinear,
    halfFloat: supportsHalfFloat,
    halfFloatLinear: supportsHalfFloatLinear
  };
}
