precision highp float;

// Two-pass blur filter, unweighted kernel.
// See also a similar blur at Adam Ferriss' repo of shader examples:
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/4_image-effects/4-9_single-pass-blur/effect.frag


uniform sampler2D tex0;
varying vec2 vTexCoord;
uniform vec2 direction;
uniform vec2 canvasSize;
uniform float radius;

float random(vec2 p) {
  vec3 p3  = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// This isn't a real Gaussian weight, it's a quadratic weight. It's what the
// CPU mode's blur uses though, so we also use it here to match.
float quadWeight(float x, float e) {
  return pow(e-abs(x), 2.);
}

void main(){
  vec2 uv = vTexCoord;

  // A reasonable maximum number of samples
  const float maxSamples = 64.0;

  float numSamples = floor(7. * radius);
  if (fract(numSamples / 2.) == 0.) {
    numSamples++;
  }
  vec4 avg = vec4(0.0);
  float total = 0.0;

  // Calculate the spacing to avoid skewing if numSamples > maxSamples
  float spacing = 1.0;
  if (numSamples > maxSamples) {
    spacing = numSamples / maxSamples;
    numSamples = maxSamples;
  }

  float randomOffset = (spacing - 1.0) * mix(-0.5, 0.5, random(gl_FragCoord.xy));
  for (float i = 0.0; i < maxSamples; i++) {
    if (i >= numSamples) break;

    float sample = i * spacing - (numSamples - 1.0) * 0.5 * spacing + randomOffset;
    vec2 sampleCoord = uv + vec2(sample, sample) / canvasSize * direction;
    float weight = quadWeight(sample, (numSamples - 1.0) * 0.5 * spacing);

    avg += weight * texture2D(tex0, sampleCoord);
    total += weight;
  }

  avg /= total;
  gl_FragColor = avg;
}
