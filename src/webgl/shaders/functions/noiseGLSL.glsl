float baseNoise(vec2 st) {
  return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  float result = 0.0;
  for (int i = 0; i < 3; i++) {
    float freq = pow(2.0, float(i));
    float amp = pow(0.5, float(i));
    result += amp * baseNoise(st * freq);
  }
  return result;
}
