attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;

uniform mat4 modelviewMatrix;
uniform mat4 transformMatrix;
uniform mat4 normalMatrix;
uniform float uResolution;

uniform vec4 uAmbientColor;
uniform vec3 uPointLightingLocation;
uniform vec4 uPointLightingColor;

varying vec3 vertexNormal;
varying vec2 vertTexCoord;
varying vec4 vLightWeighting;

void main(void) {
  vec3 zeroToOne = position / uResolution;
  vec4 positionVec4 = vec4(zeroToOne, 1.);
  gl_Position = transformMatrix * modelviewMatrix * positionVec4;
  vertTexCoord = texCoord;

  vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);
  vec3 transformedNormal = normalMatrix * vertexNormal;
  float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);
  vLightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;
}