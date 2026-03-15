IN vec4 vColor;
void main(void) {
  HOOK_beforeFragment();
  OUT_COLOR = HOOK_getFinalColor(vColor);
  OUT_COLOR.rgb *= OUT_COLOR.a; // Premultiply alpha before rendering
  HOOK_afterFragment();
}
