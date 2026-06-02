// _p5_hash: "Hash without Sine" by Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
// Mixing constants: R₂ sequence by Martin Roberts (https://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/)
//   α₁ = 1/φ₂ = 0.7548776662 (plastic constant reciprocal)
//   α₂ = 1/φ₂² = 0.5698402910
//   1/φ = 0.6180339887 (golden ratio conjugate)

int _p5_randomCallIndex = 0;

float _p5_hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

float random(float seed) {
  float vid = float(gl_VertexID);
  float callIndex = float(_p5_randomCallIndex);
  _p5_randomCallIndex += 1;
  float s = fract(seed * 0.7548776662);
  return _p5_hash(vec3(
    vid + s,
    vid * 0.5698402910 + callIndex * 0.6180339887,
    s + callIndex * 0.7548776662
  ));
}
