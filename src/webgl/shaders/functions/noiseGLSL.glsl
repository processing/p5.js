// Based on https://github.com/patriciogonzalezvivo/lygia/blob/main/generative/noise.glsl (MIT)
// Adapted for use in p5.strands

vec2 random2(vec2 st) {
  st = vec2(dot(st, vec2(127.1, 311.7)),
            dot(st, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

float baseNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 a = random2(i);
  vec2 b = random2(i + vec2(1.0, 0.0));
  vec2 c = random2(i + vec2(0.0, 1.0));
  vec2 d = random2(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(mix(dot(a, f - vec2(0.0, 0.0)), 
                 dot(b, f - vec2(1.0, 0.0)), u.x),
             mix(dot(c, f - vec2(0.0, 1.0)), 
                 dot(d, f - vec2(1.0, 1.0)), u.x), u.y);
}

// Fractal noise using 4 octaves
float noise(vec2 st) {
  float result = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;

  for (int i = 0; i < 4; i++) {
    result += amplitude * baseNoise(st * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return result;
}
