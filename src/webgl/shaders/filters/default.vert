attribute vec3 aPosition;
// texcoords only come from p5 to vertex shader
// so pass texcoords on to the fragment shader in a varying variable
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  // transferring texcoords for the frag shader
  vTexCoord = aTexCoord;

  // copy position with a fourth coordinate for projection (1.0 is normal)
  vec4 positionVec4 = vec4(aPosition, 1.0);
  // scale by two and center to achieve correct positioning
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}
