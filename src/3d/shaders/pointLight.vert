attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aVexCoord;

uniform mat4 uModelviewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform float uResolution;

uniform vec4 uAmbientColor;
uniform vec3 uPointLightingLocation;
uniform vec4 uPointLightingColor;

varying vec3 vVertexNormal;
varying vec2 vVertTexCoord;
varying vec4 vLightWeighting;

void main(void) {
  vec4 positionVec4 = vec4(aPosition / uResolution, 1.);
  gl_Position = uProjectionMatrix * uModelviewMatrix * positionVec4;
  vertTexCoord = aVexCoord;

  vec3 lightDirection = normalize(uPointLightingLocation - aPosition.xyz);
  vec3 transformedNormal = uNormalMatrix * vVertexNormal;
  float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
  vLightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;
}