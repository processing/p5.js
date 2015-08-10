precision mediump float;
precision mediump int;

varying vec4 vVertColor;
varying vec4 vBackVertColor;

void main() {
  gl_FragColor = gl_FrontFacing ? vVertColor : vBackVertColor;
}