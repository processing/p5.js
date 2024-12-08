IN vec3 aPosition;
IN vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec4 uGlyphRect;
uniform float uGlyphOffset;

OUT vec2 vTexCoord;
OUT float w;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);

  // scale by the size of the glyph's rectangle
  positionVec4.xy *= uGlyphRect.zw - uGlyphRect.xy;

  // Expand glyph bounding boxes by 1px on each side to give a bit of room
  // for antialiasing
  vec3 newOrigin = (uModelViewMatrix * vec4(0., 0., 0., 1.)).xyz;
  vec3 newDX = (uModelViewMatrix * vec4(1., 0., 0., 1.)).xyz;
  vec3 newDY = (uModelViewMatrix * vec4(0., 1., 0., 1.)).xyz;
  vec2 pixelScale = vec2(
    1. / length(newOrigin - newDX),
    1. / length(newOrigin - newDY)
  );
  vec2 offset = pixelScale * normalize(aTexCoord - vec2(0.5, 0.5));
  vec2 textureOffset = offset * (1. / vec2(
    uGlyphRect.z - uGlyphRect.x,
    uGlyphRect.w - uGlyphRect.y
  ));

  // move to the corner of the glyph
  positionVec4.xy += uGlyphRect.xy;

  // move to the letter's line offset
  positionVec4.x += uGlyphOffset;

  positionVec4.xy += offset;
  
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  vTexCoord = aTexCoord + textureOffset;
  w = gl_Position.w;
}
