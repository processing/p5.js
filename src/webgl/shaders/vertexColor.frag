IN vec4 vColor;
void main(void) {
  OUT_COLOR = vec4(vColor.rgb, 1.) * vColor.a;
}
