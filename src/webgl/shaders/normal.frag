IN vec3 vVertexNormal;
void main(void) {
  HOOK_beforeFragment();
  OUT_COLOR = HOOK_getFinalColor(vec4(vVertexNormal, 1.0));
  HOOK_afterFragment();
}
