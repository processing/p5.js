attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform int uDirectionalLightCount;
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;
uniform vec4 uMaterialColor;

varying vec4 vertColor;
varying vec3 vertLightDir;
varying vec3 vertNormal;
varying vec2 vertTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;

  vertNormal = normalize(uNormalMatrix * aNormal);
  vertLightDir = -uLightingDirection;

  vertColor = uMaterialColor;
  vertTexCoord = aTexCoord;
}
