export const baseComputeShader = `
struct ComputeInputs {
  index: vec3<i32>,
  localIndex: i32,
  localId: vec3<i32>,
  workgroupId: vec3<i32>,
}

struct ComputeUniforms {
  uTotalCount: vec3<i32>,
}
@group(0) @binding(0) var<uniform> uniforms: ComputeUniforms;

@compute @workgroup_size(8, 8, 1)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_index) localIndex: u32
) {
  var inputs: ComputeInputs;
  inputs.index = vec3<i32>(globalId);

  if (
    inputs.index.x > uniforms.uTotalCount.x ||
    inputs.index.y > uniforms.uTotalCount.y ||
    inputs.index.z > uniforms.uTotalCount.z
  ) {
    return;
  }

  inputs.localId = vec3<i32>(localId);
  inputs.workgroupId = vec3<i32>(workgroupId);
  inputs.localIndex = i32(localIndex);

  HOOK_iteration(inputs);
}
`;
