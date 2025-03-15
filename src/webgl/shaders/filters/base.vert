precision highp int;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

IN vec3 aPosition;
IN vec2 aTexCoord;
OUT vec2 vTexCoord;

void main() {
  // transferring texcoords for the frag shader
  vTexCoord = aTexCoord;

  // copy position with a fourth coordinate for projection (1.0 is normal)
  vec4 positionVec4 = vec4(aPosition, 1.0);

  // project to 3D space
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}
