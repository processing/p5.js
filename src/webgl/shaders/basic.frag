IN vec4 vColor;
IN vec2 vTexCoord;

void main(void) {
  HOOK_beforeFragment();
  OUT_COLOR = HOOK_getFinalColor(vec4(vColor.rgb, 1.) * vColor.a, vTexCoord);
  HOOK_afterFragment();
}