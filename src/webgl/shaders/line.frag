precision mediump float;
precision mediump int;

varying vec4 vColor;

uniform bool uUseLineColor;
uniform vec4 uMaterialColor;

void main() {
  gl_FragColor = (uUseLineColor ? vColor : uMaterialColor);
}
