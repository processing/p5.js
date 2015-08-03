precision mediump float;
precision mediump int;

varying vec4 vertColor;
varying vec4 backVertColor;

void main() {
  gl_FragColor = gl_FrontFacing ? vertColor : backVertColor;
}