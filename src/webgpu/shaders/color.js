import { getTexture } from './utils';

const uniforms = `
struct Uniforms {
// @p5 ifdef Vertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uViewMatrix: mat4x4<f32>,
  uModelNormalMatrix: mat3x3<f32>,
  uCameraNormalMatrix: mat3x3<f32>,
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
  uNormalMatrix: mat3x3<f32>,
// @p5 endif
  uProjectionMatrix: mat4x4<f32>,
  uMaterialColor: vec4<f32>,
  uUseVertexColor: f32,
};
`;

export const colorVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aNormal: vec3<f32>,
  @location(2) aTexCoord: vec2<f32>,
  @location(3) aVertexColor: vec4<f32>,
};

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vVertexNormal: vec3<f32>,
  @location(1) vVertTexCoord: vec2<f32>,
  @location(2) vColor: vec4<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct Vertex {
  position: vec3<f32>,
  normal: vec3<f32>,
  texCoord: vec2<f32>,
  color: vec4<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  HOOK_beforeVertex();
  var output: VertexOutput;

  let useVertexColor = (uniforms.uUseVertexColor != 0.0);
  var inputs = Vertex(
    input.aPosition,
    input.aNormal,
    input.aTexCoord,
    select(uniforms.uMaterialColor, input.aVertexColor, useVertexColor)
  );

// @p5 ifdef Vertex getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  inputs.position = (uniforms.uModelMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uModelNormalMatrix * inputs.normal;
  inputs = HOOK_getWorldInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (uniforms.uViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uCameraNormalMatrix * inputs.normal;
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  // Apply both at once
  inputs.position = (uniforms.uModelViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uNormalMatrix * inputs.normal;
// @p5 endif

// @p5 ifdef Vertex getCameraInputs
  inputs = HOOK_getCameraInputs(inputs);
// @p5 endif

  output.vVertTexCoord = inputs.texCoord;
  output.vVertexNormal = normalize(inputs.normal);
  output.vColor = inputs.color;

  output.Position = uniforms.uProjectionMatrix * vec4<f32>(inputs.position, 1.0);

  HOOK_afterVertex();
  return output;
}
`;

export const colorFragmentShader = `
struct FragmentInput {
  @location(0) vVertexNormal: vec3<f32>,
  @location(1) vVertTexCoord: vec2<f32>,
  @location(2) vColor: vec4<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

${getTexture}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  HOOK_beforeFragment();
  var outColor = HOOK_getFinalColor(
    vec4<f32>(input.vColor.rgb * input.vColor.a, input.vColor.a)
  );
  HOOK_afterFragment();
  return outColor;
}
`;
