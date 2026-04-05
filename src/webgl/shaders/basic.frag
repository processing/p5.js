IN vec4 vColor;
IN highp vec2 vVertTexCoord;
void main(void) {
  HOOK_beforeFragment();
  OUT_COLOR = HOOK_getFinalColor(vColor, vVertTexCoord);
  OUT_COLOR.rgb *= OUT_COLOR.a; // Premultiply alpha before rendering
  HOOK_afterFragment();
}