attribute vec3 aPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vColor;

void main(void) {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  vColor = aVertexColor;
}
