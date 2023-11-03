// Set each pixel to inverse value
// Note that original INVERT does not change the opacity, so this follows suit

precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;

void main() {
  vec4 color = texture2D(tex0, vTexCoord);
  vec3 invertedColor = vec3(1.0) - color.rgb; // Declare and calculate invertedColor
  //checking if pixel is opaque
  if (color.a == 1.0) { 
    gl_FragColor = vec4(invertedColor, color.a);
  } else {
    gl_FragColor = color;
  }
}
