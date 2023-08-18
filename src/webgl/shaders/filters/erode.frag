// Reduces the bright areas in an image

precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 texelSize;

void main() {
  vec4 color = texture2D(tex0, vTexCoord);

  // set current color as the darkest neighbor color

  vec4 neighbors[4];
  neighbors[0] = texture2D(tex0, vTexCoord + vec2( texelSize.x, 0.0));
  neighbors[1] = texture2D(tex0, vTexCoord + vec2(-texelSize.x, 0.0));
  neighbors[2] = texture2D(tex0, vTexCoord + vec2(0.0,  texelSize.y));
  neighbors[3] = texture2D(tex0, vTexCoord + vec2(0.0, -texelSize.y));

  for (int i = 0; i < 4; i++) {
    vec4 neighborColor = neighbors[i];
    color = min(color, neighborColor);
  }

  gl_FragColor = color;
}
