precision highp float;

uniform sampler2D tex0;
uniform vec2 canvasSize;
uniform vec2 texelSize;

IN vec2 vTexCoord;

struct FilterInputs {
  vec2 texCoord;
  vec2 canvasSize;
  vec2 texelSize;
};

void main(void) {
  FilterInputs inputs;
  inputs.texCoord = vTexCoord;
  inputs.canvasSize = canvasSize;
  inputs.texelSize = texelSize;
  OUT_COLOR = HOOK_getColor(inputs, tex0);
  OUT_COLOR.rgb *= outColor.a;
}
