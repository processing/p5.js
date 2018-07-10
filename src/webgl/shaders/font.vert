precision mediump float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec4 uGlyphRect;
uniform float uGlyphOffset;

varying vec2 vTexCoord;
varying float w;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy *= uGlyphRect.zw - uGlyphRect.xy;
  positionVec4.xy += uGlyphRect.xy;
  positionVec4.x += uGlyphOffset;
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  vTexCoord = aTexCoord;
  w = gl_Position.w;
}
