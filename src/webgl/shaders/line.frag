precision mediump float;
precision mediump int;

uniform vec4 uMaterialColor;

void main() {
  gl_FragColor = vec4(uMaterialColor.rgb, 1.) * uMaterialColor.a;
}
