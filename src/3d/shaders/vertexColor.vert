attribute vec3 aPosition;
attribute vec4 aVertexColor;

uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform float uResolution;

varying vec4 vColor;

void main(void) {
  vec4 positionVec4 = vec4(aPosition / uResolution * vec3(1.0, -1.0, 1.0), 1.0);
  gl_Position = uProjectionMatrix * uViewMatrix *  uModelMatrix * positionVec4;
  vColor = aVertexColor;
}