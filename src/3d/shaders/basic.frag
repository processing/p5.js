precision mediump float;
varying vec3 vertexNormal;
uniform vec4 uMaterialColor;
void main(void) {
  gl_FragColor = uMaterialColor;
}