const uniforms = `
struct Uniforms {
  uModelViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
};
`;

export const blitVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aNormal: vec3<f32>,
  @location(2) aTexCoord: vec2<f32>,
  @location(3) aVertexColor: vec4<f32>,
};

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vTexCoord: vec2<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  output.vTexCoord = input.aTexCoord;
  let positionVec4 = vec4<f32>(input.aPosition, 1.0);
  output.Position = uniforms.uProjectionMatrix * uniforms.uModelViewMatrix * positionVec4;
  return output;
}
`;

export const blitFragmentShader = `
struct FragmentInput {
  @location(0) vTexCoord: vec2<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var uSampler: texture_2d<f32>;
@group(0) @binding(2) var uSampler_sampler: sampler;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  return textureSample(uSampler, uSampler_sampler, input.vTexCoord);
}
`;
