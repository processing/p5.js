precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;

void main() {
  vec4 tex = texture2D(tex0, vTexCoord);
  float gray = (tex.r + tex.g + tex.b) / 3.0;
  gl_FragColor = vec4(gray, gray, gray, 1.0);
}
