attribute vec3 position;

attribute vec4 aVertexColor;

uniform mat4 modelviewMatrix;
uniform mat4 transformMatrix;

varying vec4 vColor;

void main(void) {
  vec3 zeroToOne = position / 1000.0;
  vec4 positionVec4 = vec4(zeroToOne * vec3(1., -1., 1.), 1.);
  gl_Position = transformMatrix * modelviewMatrix * positionVec4;
  vColor = aVertexColor;
}