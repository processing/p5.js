IN vec4 vColor;
void main(void) {
  HOOK_beforeFragment();
  OUT_COLOR = HOOK_getFinalColor(vec4(vColor.rgb, 1.) * vColor.a);
  HOOK_afterFragment();
}
