attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelviewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform float uResolution;

uniform vec3 uAmbientColor;
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

varying vec2 vertTexCoord;
varying vec3 vLightWeighting;

void main(void) {
  vec4 positionVec4 = vec4(aPosition / uResolution, 1.);
  gl_Position = uProjectionMatrix * uModelviewMatrix * positionVec4;
  vec3 vertexNormal = vec3( uNormalMatrix * vec4( aNormal, 1.0 ) );
  vertTexCoord = aTexCoord;

  float directionalLightWeighting = max(dot(vertexNormal, uLightingDirection), 0.0);
  vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
}