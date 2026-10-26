precision highp float;

IN vec2 vTexCoord;

struct FieldInputs {
  vec2 texCoord;
  vec4 color;
};

void main(void) {
  FieldInputs inputs;
  inputs.texCoord = vTexCoord;
  inputs.color = vec4(0.0, 0.0, 0.0, 1.0);
  inputs = HOOK_getField(inputs);
  OUT_COLOR = inputs.color;
  // Premultiply alpha so the field blends like other p5 draws
  OUT_COLOR.rgb *= OUT_COLOR.a;
}
