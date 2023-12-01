// Convert pixels to either white or black, 
// depending on if their luma is above or below filterParameter

precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform float filterParameter;

float luma(vec3 color) {
  // weighted grayscale with luminance values
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec4 color = texture2D(tex0, vTexCoord);
  float gray = luma(color.rgb / color.a);
  // floor() used to match src/image/filters.js
  float threshold = floor(filterParameter * 255.0) / 255.0;
  float blackOrWhite = step(threshold, gray);
  gl_FragColor = vec4(vec3(blackOrWhite) * color.a, color.a);
}
