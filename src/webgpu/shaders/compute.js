export const baseComputeShader = `
struct ComputeInputs {
  globalId: vec3<i32>,
  localId: vec3<i32>,
  workgroupId: vec3<i32>,
  localIndex: i32,
}

struct ComputeUniforms {
  uTotalCount: vec3<i32>,
}
@group(0) @binding(0) var<uniform> uniforms: ComputeUniforms;

fn processData(inputs: ComputeInputs) {
  HOOK_processData(inputs);
}

@compute @workgroup_size(8, 8, 1)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_index) localIndex: u32
) {
  var inputs: ComputeInputs;
  inputs.globalId = vec3<i32>(globalId);

  if (
    inputs.globalId.x > uniforms.uTotalCount.x ||
    inputs.globalId.y > uniforms.uTotalCount.y ||
    inputs.globalId.z > uniforms.uTotalCount.z
  ) {
    return;
  }

  inputs.localId = vec3<i32>(localId);
  inputs.workgroupId = vec3<i32>(workgroupId);
  inputs.localIndex = i32(localIndex);

  processData(inputs);
}
`;
