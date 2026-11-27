const fieldUniforms = `
// Group 0: Field Properties
struct FieldUniforms {
  canvasSize: vec2<f32>,
}

// Group 1: Model Transform
struct ModelUniforms {
  uModelViewMatrix: mat4x4<f32>,
}

// Group 2: Camera and Projection
struct CameraUniforms {
  uProjectionMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> fieldParams: FieldUniforms;
@group(1) @binding(0) var<uniform> model: ModelUniforms;
@group(2) @binding(0) var<uniform> camera: CameraUniforms;
`;

export const baseColorFieldVertexShader =
  fieldUniforms +
  `
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
  output.position = camera.uProjectionMatrix * model.uModelViewMatrix * positionVec4;

  return output;
}
`;

export const baseColorFieldFragmentShader =
  fieldUniforms +
  `
struct FieldInputs {
  texCoord: vec2<f32>,
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
  var inputs: FieldInputs;
  inputs.texCoord = input.vTexCoord;

  var outColor = HOOK_getColor(inputs);
  // Premultiply alpha so the field blends like other p5 draws
  outColor = vec4<f32>(outColor.rgb * outColor.a, outColor.a);
  output.color = outColor;

  return output;
}
`;
