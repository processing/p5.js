  varying vec3 vBarycentric;

  attribute vec3 aPosition;
  attribute vec3 barycentric;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;

  void main() {
    vBarycentric = barycentric;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }