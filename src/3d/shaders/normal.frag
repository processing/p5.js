precision mediump float;
varying vec3 vertexNormal;
void main(void) {
  gl_FragColor = vec4(vertexNormal, 1.0);
}