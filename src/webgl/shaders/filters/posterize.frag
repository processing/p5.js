// Limit color space for a stylized cartoon / poster effect

precision highp float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform float filterParameter;

vec3 round(vec3 vals) {
  // eg. round(5.5) -> 6.0
  return floor(vals + 0.5);
}

vec3 quantize(vec3 color, float n) {
  // restrict values to N options/bins
  // and round each channel to nearest option
  //
  // eg. when N = 5, options = 0.0, 0.25, 0.50, 0.75, 1.0
  // then posterize (0.1, 0.7, 0.9) -> (0.0, 0.75, 1.0)

  color = color * n;
  color = round(color);
  color = color / (n - 1.0);
  return color;
}

void main() {
  vec4 color = texture2D(tex0, vTexCoord);

  vec3 restrictedColor = quantize(color.rgb, filterParameter);

  gl_FragColor = vec4(restrictedColor.rgb, color.a);
}
