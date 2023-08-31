precision highp float;

// Two-pass blur filter, unweighted kernel.
// See also a similar blur at Adam Ferriss' repo of shader examples:
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/4_image-effects/4-9_single-pass-blur/effect.frag


uniform sampler2D tex0;
varying vec2 vTexCoord;
uniform vec2 direction;
uniform vec2 texelSize;
uniform float steps;

void main(){
  const float maxIterations = 100.0;

  vec2 uv = vTexCoord;

  vec4 tex = texture2D(tex0, uv);
  float sum = 1.0;

  vec2 offset = direction * texelSize;
  for(float i = 1.0; i <= maxIterations; i++) {
    if( i > steps) break;
    tex += texture2D(tex0, uv + i * offset);
    tex += texture2D(tex0, uv - i * offset);
    sum += 2.0;
  }

  gl_FragColor = tex / sum;
}
