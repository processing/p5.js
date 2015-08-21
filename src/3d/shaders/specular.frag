precision mediump float;

uniform vec4 uMaterialColor;
varying vec3 vLightWeighting2;

void main(void) {
  gl_FragColor = vec4(uMaterialColor.rgb * vLightWeighting2, uMaterialColor.a);
}