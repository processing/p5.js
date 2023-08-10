// Reduces the bright areas in an image

precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 texelSize;

float luma(vec3 color) {
  // based on constants 77, 151, 28 from ERODE in filters.js,
  // even though that's different than the luminance constants used in GRAY
  return dot(color, vec3(0.3008, 0.5898, 0.1094));
}

void main() {
  vec4 curColor = texture2D(tex0, vTexCoord);
  float curLuminance = luma(curColor.rgb);

  // set current color as the neighbor color with lowest luminance

  vec4 neighbors[4];
  neighbors[0] = texture2D(tex0, vTexCoord + vec2( texelSize.x, 0.0));
  neighbors[1] = texture2D(tex0, vTexCoord + vec2(-texelSize.x, 0.0));
  neighbors[2] = texture2D(tex0, vTexCoord + vec2(0.0,  texelSize.y));
  neighbors[3] = texture2D(tex0, vTexCoord + vec2(0.0, -texelSize.y));

  for (int i = 0; i < 4; i++) {
    vec4 color = neighbors[i];
    float lum = luma(color.rgb);
    if (lum < curLuminance) {
      curColor = color;
      curLuminance = lum;
    }
  }

  gl_FragColor = curColor;
}
