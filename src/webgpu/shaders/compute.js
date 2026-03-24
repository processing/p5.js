export const baseComputeShader = `
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
  var index = vec3<i32>(globalId);

  if (
    index.x >= uniforms.uTotalCount.x ||
    index.y >= uniforms.uTotalCount.y ||
    index.z >= uniforms.uTotalCount.z
  ) {
    return;
  }

  HOOK_iteration(index);
}
`;
