// Increase the bright areas in an image

precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 texelSize;

float luma(vec3 color) {
  // weighted grayscale with luminance values
  // weights 77, 151, 28 taken from src/image/filters.js
  return dot(color, vec3(0.300781, 0.589844, 0.109375));
}

void main() {
  vec4 color = texture2D(tex0, vTexCoord);
  float lum = luma(color.rgb);

  // set current color as the brightest neighbor color

  vec4 neighbors[4];
  neighbors[0] = texture2D(tex0, vTexCoord + vec2( texelSize.x, 0.0));
  neighbors[1] = texture2D(tex0, vTexCoord + vec2(-texelSize.x, 0.0));
  neighbors[2] = texture2D(tex0, vTexCoord + vec2(0.0,  texelSize.y));
  neighbors[3] = texture2D(tex0, vTexCoord + vec2(0.0, -texelSize.y));

  for (int i = 0; i < 4; i++) {
    vec4 neighborColor = neighbors[i];
    float neighborLum = luma(neighborColor.rgb);

    if (neighborLum > lum) {
      color = neighborColor;
      lum = neighborLum;
    }
  }

  gl_FragColor = color;
}
