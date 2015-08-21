precision mediump float;

uniform vec4 uMaterialColor;
varying vec3 vLightWeighting;

void main(void) {
  gl_FragColor = vec4(vec3(uMaterialColor.rgb * vLightWeighting), uMaterialColor.a);
}