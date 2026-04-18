// _p5_hash: "Hash without Sine" by Dave Hoskins (https://www.shadertoy.com/view/4djSRW)
// Mixing constants: R₂ sequence by Martin Roberts (https://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/)
//   α₁ = 1/φ₂ = 0.7548776662 (plastic constant reciprocal)
//   α₂ = 1/φ₂² = 0.5698402910
//   1/φ = 0.6180339887 (golden ratio conjugate)
//
// Vertex shader version: vertexId is passed in from main via @builtin(vertex_index)

export default `
fn _p5_hash(p: vec3<f32>) -> f32 {
  var p3 = fract(p * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 = p3 + dot(p3, p3.yxz + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn random(seed: f32, callIndex: f32, vertexId: f32) -> f32 {
  let s = fract(seed * 0.7548776662);
  return _p5_hash(vec3<f32>(
    vertexId + s,
    vertexId * 0.5698402910 + callIndex * 0.6180339887,
    s + callIndex * 0.7548776662
  ));
}
`;
