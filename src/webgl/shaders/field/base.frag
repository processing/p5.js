precision highp float;

IN vec2 vTexCoord;

struct FieldInputs {
  vec2 texCoord;
};

void main(void) {
  FieldInputs inputs;
  inputs.texCoord = vTexCoord;
  OUT_COLOR = HOOK_getColor(inputs);
  // Premultiply alpha so the field blends like other p5 draws
  OUT_COLOR.rgb *= OUT_COLOR.a;
}
