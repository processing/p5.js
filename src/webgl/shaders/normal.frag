IN vec3 vVertexNormal;
void main(void) {
  OUT_COLOR = vec4(vVertexNormal, 1.0);
}
