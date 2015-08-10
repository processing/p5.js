attribute vec3 aPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelviewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uResolution;

varying vec4 vColor;

void main(void) {
  vec4 positionVec4 = vec4(aPosition / uResolution * vec3(1., -1., 1.), 1.);
  gl_Position = uProjectionMatrix * uModelviewMatrix * positionVec4;
  vColor = aVertexColor;
}