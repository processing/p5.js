// Two-pass blur filter, unweighted kernel.
// See also a similar blur at Adam Ferriss' repo of shader examples:
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/4_image-effects/4-9_single-pass-blur/effect.frag

precision highp float;

uniform sampler2D tex0;
varying vec2 vTexCoord;
uniform vec2 direction;
uniform vec2 texelSize;
uniform float flipped;

void main(){

  vec2 uv = vTexCoord;
  if (flipped == 1.0) {
    uv.y = 1.0 - uv.y;
  }
  
  vec4 tex = texture2D(tex0, uv);
  tex += texture2D(tex0, uv - texelSize * direction);
  tex += texture2D(tex0, uv + texelSize * direction);
  
  tex /= 3.0;

  gl_FragColor = tex;
}
