export const getTexture = `
fn getTexture(texture: texture_2d<f32>, sampler: sampler, coord: vec2<f32>) -> vec4<f32> {
  let color = textureSample(texture, sampler, coord);
  let alpha = color.a;
  return vec4<f32>(
    select(color.rgb / alpha, vec3<f32>(0.0), alpha == 0.0),
    alpha
  );
}
`;
