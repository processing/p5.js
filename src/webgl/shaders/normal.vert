IN vec3 aPosition;
IN vec3 aNormal;
IN vec2 aTexCoord;
IN vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform vec4 uMaterialColor;
uniform bool uUseVertexColor;

OUT vec3 vVertexNormal;
OUT highp vec2 vVertTexCoord;
OUT vec4 vColor;

void main(void) {
  HOOK_beforeVertex();
  vec4 positionVec4 = vec4(HOOK_getWorldPosition(
    (uModelViewMatrix * vec4(HOOK_getLocalPosition(aPosition), 1.0)).xyz
  ), 1.);

  gl_Position = uProjectionMatrix * positionVec4;

  vVertexNormal = HOOK_getWorldNormal(normalize(uNormalMatrix * HOOK_getLocalNormal(aNormal)));
  vVertTexCoord = HOOK_getUV(aTexCoord);
  vColor = HOOK_getVertexColor(uUseVertexColor ? aVertexColor : uMaterialColor);
  HOOK_afterVertex();
}
