// Set alpha channel to entirely opaque

precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;

void main() {
  vec4 color = texture2D(tex0, vTexCoord);
  gl_FragColor = vec4(color.rgb / color.a, 1.0);
}
