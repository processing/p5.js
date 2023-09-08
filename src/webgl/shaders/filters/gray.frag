precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;

float luma(vec3 color) {
  // weighted grayscale with luminance values
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec4 tex = texture2D(tex0, vTexCoord);
  float gray = luma(tex.rgb);
  gl_FragColor = vec4(gray, gray, gray, tex.a);
}
