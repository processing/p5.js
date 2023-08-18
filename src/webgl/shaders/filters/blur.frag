// Single-pass blur filter, taken from Adam Ferriss' repo of shader examples:
// https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/4_image-effects/4-9_single-pass-blur/effect.frag

precision highp float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float filterParameter;

void main() {

  vec2 uv = vTexCoord;

  // a single pass blur works by sampling all the neighbor pixels and averaging them up
  // this is somewhat inefficient because we have to sample the texture 9 times -- texture2D calls are slow :( 
  // check out the two-pass-blur example for a better blur approach
  // get the webcam as a vec4 using texture2D

  // spread controls how far away from the center we should pull a sample from
  // you will start to see artifacts if you crank this up too high
  float spread = max(0.0, filterParameter);

  // create our offset variable by multiplying the size of a texel with spread
  vec2 offset = texelSize * spread;

  // get all the neighbor pixels!
  vec4 tex = texture2D(tex0, uv); // middle middle -- the actual texel / pixel
  tex += texture2D(tex0, uv + vec2(-offset.x, -offset.y)); // top left
  tex += texture2D(tex0, uv + vec2(0.0, -offset.y)); // top middle
  tex += texture2D(tex0, uv + vec2(offset.x, -offset.y)); // top right

  tex += texture2D(tex0, uv + vec2(-offset.x, 0.0)); //middle left
  tex += texture2D(tex0, uv + vec2(offset.x, 0.0)); //middle right

  tex += texture2D(tex0, uv + vec2(-offset.x, offset.y)); // bottom left
  tex += texture2D(tex0, uv + vec2(0.0, offset.y)); // bottom middle
  tex += texture2D(tex0, uv + vec2(offset.x, offset.y)); // bottom right

  // we added 9 textures together, so we will divide by 9 to average them out and move the values back into a 0 - 1 range
  tex /= 9.0;

  gl_FragColor = tex;
}
