  varying vec3 vBC;

  attribute vec3 aPosition;
  attribute vec3 aBarycentric;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;

  void main() {
    vBC = aBarycentric;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  }