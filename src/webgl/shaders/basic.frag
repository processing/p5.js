precision mediump float;
uniform vec4 uMaterialColor;
void main(void) {
  gl_FragColor = vec4(uMaterialColor.rgb, 1.) * uMaterialColor.a;
}
