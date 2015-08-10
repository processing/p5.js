precision mediump float;
varying vec3 vLightWeighting;
uniform vec4 uMaterialColor;
void main(void) {
  gl_FragColor = vec4(vec3(uMaterialColor.rgb * vLightWeighting), uMaterialColor.a);
}