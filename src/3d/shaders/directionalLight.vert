attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;

uniform mat4 modelviewMatrix;
uniform mat4 transformMatrix;
uniform mat4 normalMatrix;
uniform float uResolution;

uniform vec4 uAmbientColor;
uniform vec3 uLightingDirection;
uniform vec4 uDirectionalColor;

varying vec3 vertexNormal;
varying vec2 vertTexCoord;
varying vec4 vLightWeighting;

void main(void) {
  vec3 zeroToOne = position / uResolution;
  vec4 positionVec4 = vec4(zeroToOne, 1.);
  gl_Position = transformMatrix * modelviewMatrix * positionVec4;
  vertexNormal = vec3( normalMatrix * vec4( normal, 1.0 ) );
  vertTexCoord = texCoord;

  vec3 transformedNormal = vec3( normalMatrix * vec4( vertexNormal, 1.0) );
  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
  vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
}