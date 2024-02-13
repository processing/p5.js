#define PI 3.141592

precision highp float;

uniform sampler2D uSampler;
uniform mat3 uNewNormalMatrix;
uniform mat4 uModelViewMatrix;

varying vec2 vTexCoord;
varying vec3 faNormal;
varying vec3 faPosition;

void main() {
  vec4 viewModelPosition  = uModelViewMatrix  * vec4(faPosition, 1.0);
  vec3 vViewPosition  = viewModelPosition.xyz;
  vec4 newTexColor = texture2D(uSampler, vTexCoord);
  vec3 vGlobalNormal = uNewNormalMatrix  * faNormal ;
  vec3 n = reflect(vViewPosition.xyz , (vGlobalNormal.xyz));
  n = normalize(n);
  vec2 suv;
  suv.y = 0.5 + 0.5 * n.y;
  suv.x = atan(n.z, n.x) / (2.0 * PI) + 0.5;
  newTexColor = texture2D(uSampler, suv.xy);
  vec4 baseColor = newTexColor;
  gl_FragColor = baseColor;
}
