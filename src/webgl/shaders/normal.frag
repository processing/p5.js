IN vec3 vVertexNormal;
IN vec2 vTexCoord;
void main(void) {
  HOOK_beforeFragment();
  OUT_COLOR = HOOK_getFinalColor(vec4(vVertexNormal, 1.0), vTexCoord);
  HOOK_afterFragment();
}
