precision mediump float;

uniform vec4 uMaterialColor;
uniform bool uSpecular;
varying vec3 vLightWeighting;
varying vec3 vLightWeighting2;

void main(void) {
  if(uSpecular){
    gl_FragColor = vec4(vec3(uMaterialColor.rgb * vLightWeighting2), uMaterialColor.a);
  }else{
    gl_FragColor = vec4(vec3(uMaterialColor.rgb * vLightWeighting), uMaterialColor.a);
  }
}