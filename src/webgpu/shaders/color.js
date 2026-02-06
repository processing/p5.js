const uniforms = `
// Group 1: Camera and Projection
struct CameraUniforms {
  uProjectionMatrix: mat4x4<f32>,
// @p5 ifdef Vertex getWorldInputs
  uViewMatrix: mat4x4<f32>,
// @p5 endif
  uCameraNormalMatrix: mat3x3<f32>,
}

// Group 2: Model Transform
struct ModelUniforms {
// @p5 ifdef Vertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uModelNormalMatrix: mat3x3<f32>,
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
  uNormalMatrix: mat3x3<f32>,
// @p5 endif
}

// Group 3: Material Properties
struct MaterialUniforms {
  uMaterialColor: vec4<f32>,
  uUseVertexColor: u32,
}
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
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> material: MaterialUniforms;

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

  let useVertexColor = (material.uUseVertexColor != 0 && input.aVertexColor.x >= 0.0);
  var inputs = Vertex(
    input.aPosition,
    input.aNormal,
    input.aTexCoord,
    select(material.uMaterialColor, input.aVertexColor, useVertexColor)
  );

// @p5 ifdef Vertex getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  inputs.position = (model.uModelMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = model.uModelNormalMatrix * inputs.normal;
  inputs = HOOK_getWorldInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (camera.uViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = camera.uCameraNormalMatrix * inputs.normal;
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  // Apply both at once
  inputs.position = (model.uModelViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = model.uNormalMatrix * inputs.normal;
// @p5 endif

// @p5 ifdef Vertex getCameraInputs
  inputs = HOOK_getCameraInputs(inputs);
// @p5 endif

  output.vVertTexCoord = inputs.texCoord;
  output.vVertexNormal = normalize(inputs.normal);
  output.vColor = inputs.color;

  output.Position = camera.uProjectionMatrix * vec4<f32>(inputs.position, 1.0);

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
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> material: MaterialUniforms;


@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  HOOK_beforeFragment();
  var outColor = HOOK_getFinalColor(input.vColor);
  outColor = vec4<f32>(outColor.rgb * outColor.a, outColor.a);
  HOOK_afterFragment();
  return outColor;
}
`;
