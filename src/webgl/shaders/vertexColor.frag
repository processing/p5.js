precision mediump float;
varying vec4 vColor;
void main(void) {
  gl_FragColor = vec4(vColor.rgb, 1.) * vColor.a;
}
