IN vec3 vVertexNormal;
IN highp vec2 vVertTexCoord;
void main(void) {
  HOOK_beforeFragment();
  OUT_COLOR = HOOK_getFinalColor(vec4(vVertexNormal, 1.0), vVertTexCoord);
  HOOK_afterFragment();
}