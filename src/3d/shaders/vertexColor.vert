attribute vec3 aPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelviewMatrix;
uniform mat4 uTransformMatrix;

varying vec4 vColor;

void main(void) {
  vec3 zeroToOne = aPosition / 1000.0;
  vec4 positionVec4 = vec4(zeroToOne * vec3(1., -1., 1.), 1.);
  gl_Position = uTransformMatrix * uModelviewMatrix * positionVec4;
  vColor = aVertexColor;
}