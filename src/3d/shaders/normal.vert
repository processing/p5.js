attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelviewMatrix;
uniform mat4 uTransformMatrix;
uniform mat4 uNormalMatrix;
uniform float uResolution;

varying vec3 vVertexNormal;
varying highp vec2 vVertTexCoord;

void main(void) {
  vec3 zeroToOne = aPosition / uResolution;
  vec4 positionVec4 = vec4(zeroToOne, 1.);
  gl_Position = uTransformMatrix * uModelviewMatrix * positionVec4;
  vVertexNormal = vec3( uNormalMatrix * vec4( aNormal, 1.0 ) );
  vVertTexCoord = aTexCoord;
}