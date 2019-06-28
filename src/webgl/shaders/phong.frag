// include lighting.glgl

uniform vec4 uMaterialColor;
uniform sampler2D uSampler;
uniform bool isTexture;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;
varying vec3 vSpecularColor;

void main(void) {

  vec3 diffuse;
  vec3 specular;
  totalLight(vViewPosition, normalize(vNormal), diffuse, specular);

  gl_FragColor = isTexture ? texture2D(uSampler, vTexCoord) : uMaterialColor;
  gl_FragColor.rgb = gl_FragColor.rgb * (diffuse + vAmbientColor) + (specular * vSpecularColor);
}