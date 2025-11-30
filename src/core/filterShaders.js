import * as constants from './constants';

/*
 * Creates p5.strands filter shaders for cross-platform compatibility
 */
export function makeFilterShader(renderer, operation, p5) {
  switch (operation) {
    case constants.GRAY:
      return renderer.baseFilterShader().modify(() => {
        p5.getColor((inputs, canvasContent) => {
          const tex = p5.getTexture(canvasContent, inputs.texCoord);
          // weighted grayscale with luminance values
          const gray = p5.dot(tex.rgb, p5.vec3(0.2126, 0.7152, 0.0722));
          return p5.vec4(gray, gray, gray, tex.a);
        });
      }, { p5 });

    case constants.INVERT:
      return renderer.baseFilterShader().modify(() => {
        p5.getColor((inputs, canvasContent) => {
          const color = p5.getTexture(canvasContent, inputs.texCoord);
          const invertedColor = p5.vec3(1.0) - color.rgb;
          return p5.vec4(invertedColor, color.a);
        });
      }, { p5 });

    case constants.THRESHOLD:
      return renderer.baseFilterShader().modify(() => {
        const filterParameter = p5.uniformFloat();
        p5.getColor((inputs, canvasContent) => {
          const color = p5.getTexture(canvasContent, inputs.texCoord);
          // weighted grayscale with luminance values
          const gray = p5.dot(color.rgb, p5.vec3(0.2126, 0.7152, 0.0722));
          const threshold = p5.floor(filterParameter * 255.0) / 255;
          const blackOrWhite = p5.step(threshold, gray);
          return p5.vec4(p5.vec3(blackOrWhite), color.a);
        });
      }, { p5 });

    case constants.POSTERIZE:
      return renderer.baseFilterShader().modify(() => {
        const filterParameter = p5.uniformFloat();
        const quantize = (color, n) => {
          // restrict values to N options/bins
          // and floor each channel to nearest value
          //
          // eg. when N = 5, values = 0.0, 0.25, 0.50, 0.75, 1.0
          // then quantize (0.1, 0.7, 0.9) -> (0.0, 0.5, 1.0)

          color = color * n;
          color = p5.floor(color);
          color = color / (n - 1.0);
          return color;
        };
        p5.getColor((inputs, canvasContent) => {
          const color = p5.getTexture(canvasContent, inputs.texCoord);
          const restrictedColor = quantize(color.rgb, filterParameter);
          return p5.vec4(restrictedColor, color.a);
        });
      }, { p5 });

    case constants.BLUR:
      return renderer.baseFilterShader().modify(() => {
        const radius = p5.uniformFloat();
        const direction = p5.uniformVec2();

        // This isn't a real Gaussian weight, it's a quadratic weight
        const quadWeight = (x, e) => {
          return p5.pow(e - p5.abs(x), 2.0);
        };

        p5.getColor((inputs, canvasContent) => {
          const uv = inputs.texCoord;

          // A reasonable maximum number of samples
          const maxSamples = 64.0;

          let numSamples = p5.floor(radius * 7.0);
          if (p5.mod(numSamples, 2) == 0.0) {
            numSamples++;
          }

          let avg = p5.vec4(0.0);
          let total = 0.0;

          // Calculate the spacing to avoid skewing if numSamples > maxSamples
          let spacing = 1.0;
          if (numSamples > maxSamples) {
            spacing = numSamples / maxSamples;
            numSamples = maxSamples;
          }

          for (let i = 0; i < numSamples; i++) {
            const sample = i * spacing - (numSamples - 1.0) * 0.5 * spacing;
            const sampleCoord = uv + p5.vec2(sample, sample) / inputs.canvasSize * direction;
            const weight = quadWeight(sample, (numSamples - 1.0) * 0.5 * spacing);

            avg += weight * p5.getTexture(canvasContent, sampleCoord);
            total += weight;
          }

          return avg / total;
        });
      }, { p5 });

    case constants.ERODE:
      return renderer.baseFilterShader().modify(() => {
        const luma = (color) => {
          return p5.dot(color.rgb, p5.vec3(0.2126, 0.7152, 0.0722));
        };

        p5.getColor((inputs, canvasContent) => {
          const uv = inputs.texCoord;
          let minColor = p5.getTexture(canvasContent, uv);
          let minLuma = luma(minColor);

          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x != 0 && y != 0) {
                const offset = p5.vec2(x, y) * inputs.texelSize;
                const neighborColor = p5.getTexture(canvasContent, uv + offset);
                const neighborLuma = luma(neighborColor);

                if (neighborLuma < minLuma) {
                  minLuma = neighborLuma;
                  minColor = neighborColor;
                }
              }
            }
          }

          return minColor;
        });
      }, { p5 });

    case constants.DILATE:
      return renderer.baseFilterShader().modify(() => {
        const luma = (color) => {
          return p5.dot(color.rgb, p5.vec3(0.2126, 0.7152, 0.0722));
        };

        p5.getColor((inputs, canvasContent) => {
          const uv = inputs.texCoord;
          let maxColor = p5.getTexture(canvasContent, uv);
          let maxLuma = luma(maxColor);

          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x != 0 && y != 0) {
                const offset = p5.vec2(x, y) * inputs.texelSize;
                const neighborColor = p5.getTexture(canvasContent, uv + offset);
                const neighborLuma = luma(neighborColor);

                if (neighborLuma > maxLuma) {
                  maxLuma = neighborLuma;
                  maxColor = neighborColor;
                }
              }
            }
          }

          return maxColor;
        });
      }, { p5 });

    case constants.OPAQUE:
      return renderer.baseFilterShader().modify(() => {
        p5.getColor((inputs, canvasContent) => {
          const color = p5.getTexture(canvasContent, inputs.texCoord);
          return p5.vec4(color.rgb, 1.0);
        });
      }, { p5 });

    default:
      throw new Error(`Unknown filter: ${operation}`);
  }
}
