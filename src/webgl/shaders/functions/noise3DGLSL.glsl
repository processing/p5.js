// Based on https://thebookofshaders.com/13/ and https://github.com/patriciogonzalezvivo/lygia
// MIT licensed, adapted for p5.strands

vec3 random3(vec3 p) {
  return fract(sin(vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  )) * 43758.5453123);
}

float baseNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);

  // Compute corner vectors
  vec3 a = random3(i);
  vec3 b = random3(i + vec3(1, 0, 0));
  vec3 c = random3(i + vec3(0, 1, 0));
  vec3 d = random3(i + vec3(1, 1, 0));
  vec3 e = random3(i + vec3(0, 0, 1));
  vec3 f1 = random3(i + vec3(1, 0, 1));
  vec3 g = random3(i + vec3(0, 1, 1));
  vec3 h = random3(i + vec3(1, 1, 1));

  vec3 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(dot(a, f - vec3(0, 0, 0)), dot(b, f - vec3(1, 0, 0)), u.x),
      mix(dot(c, f - vec3(0, 1, 0)), dot(d, f - vec3(1, 1, 0)), u.x), u.y
    ),
    mix(
      mix(dot(e, f - vec3(0, 0, 1)), dot(f1, f - vec3(1, 0, 1)), u.x),
      mix(dot(g, f - vec3(0, 1, 1)), dot(h, f - vec3(1, 1, 1)), u.x), u.y
    ),
    u.z
  );
}

float noise(vec3 p) {
  float result = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;

  for (int i = 0; i < 4; i++) {
    result += amplitude * baseNoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return result;
}
