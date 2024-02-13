#version 300 es
#define PI 3.141592

precision highp float;

uniform sampler2D uSampler;
uniform mat3 uNewNormalMatrix;
uniform mat3 uCameraRotation;
uniform mat4 uNewModelViewMatrix;
uniform mat4 uModelViewMatrix;

in vec2 vTexCoord;
in vec3 fvNormal;
in vec3 faNormal;
in vec3 faPosition;

out vec4 fragColor;

void main() {
  vec4 viewModelPosition  = uModelViewMatrix  * vec4(faPosition, 1.0);
  vec3 vViewPosition  = viewModelPosition.xyz;
  vec4 newTexColor = texture(uSampler, vTexCoord);
  vec3 vGlobalNormal = uNewNormalMatrix  * faNormal ;
  vec3 n = reflect(vViewPosition.xyz , (vGlobalNormal.xyz));
  n = normalize(n);
  vec2 suv;
  suv.y = 0.5 + 0.5 * n.y;
  suv.x = atan(n.z, n.x) / (2.0 * PI) + 0.5;
  newTexColor = texture(uSampler, suv.xy);
  vec4 baseColor = newTexColor;
  fragColor = baseColor;
}