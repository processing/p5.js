attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// directional light
uniform int uDirectionalLightCount;
uniform vec3 uDirectionalLightDirection;
uniform vec3 uDirectionalLightColor;
//uniform vec3 uDirectionalLightSpecularColor;

uniform vec4 uMaterialColor;


varying vec4 vertColor;
varying vec3 vertLightDir;
varying vec3 vertNormal;
//varying vec2 vertTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;

  vertNormal = normalize(uNormalMatrix * aNormal);
  vertLightDir = -uDirectionalLightDirection;

  vertColor = vec4(uMaterialColor.rgb * uDirectionalLightColor, uMaterialColor.a);
  //vertTexCoord = aTexCoord;
}
