const filterUniforms = `
struct Uniforms {
  uModelViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  canvasSize: vec2<f32>,
  texelSize: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var tex0: texture_2d<f32>;
@group(0) @binding(2) var tex0_sampler: sampler;
`;

export const baseFilterVertexShader = filterUniforms + `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aTexCoord: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) vTexCoord: vec2<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;

  // transferring texcoords for the frag shader
  output.vTexCoord = input.aTexCoord;

  // copy position with a fourth coordinate for projection (1.0 is normal)
  let positionVec4 = vec4<f32>(input.aPosition, 1.0);

  // project to 3D space
  output.position = uniforms.uProjectionMatrix * uniforms.uModelViewMatrix * positionVec4;

  return output;
}
`;

export const baseFilterFragmentShader = filterUniforms + `
struct FilterInputs {
  texCoord: vec2<f32>,
  canvasSize: vec2<f32>,
  texelSize: vec2<f32>,
}

struct FragmentInput {
  @location(0) vTexCoord: vec2<f32>,
}

struct FragmentOutput {
  @location(0) color: vec4<f32>,
}

@fragment
fn main(input: FragmentInput) -> FragmentOutput {
  var output: FragmentOutput;
  var inputs: FilterInputs;
  inputs.texCoord = input.vTexCoord;
  inputs.canvasSize = uniforms.canvasSize;
  inputs.texelSize = uniforms.texelSize;

  var outColor = HOOK_getColor(inputs, tex0, tex0_sampler);
  outColor = vec4<f32>(outColor.rgb * outColor.a, outColor.a);
  output.color = outColor;

  return output;
}
`;
