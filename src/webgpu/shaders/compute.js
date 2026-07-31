export const baseComputeShader = `
struct ComputeUniforms {
  uTotalCount: vec3<i32>,
  uPhysicalCount: vec3<i32>,
}
@group(0) @binding(0) var<uniform> uniforms: ComputeUniforms;

struct ComputeInputs {
  index: vec3<i32>,
  globalID: vec3<i32>,
  localIndex: i32,
  localID: vec3<i32>,
  workgroupID: vec3<i32>,
}

@compute @workgroup_size(8, 8, 1)
fn main(
  @builtin(global_invocation_id) globalId: vec3<u32>,
  @builtin(local_invocation_id) localId: vec3<u32>,
  @builtin(workgroup_id) workgroupId: vec3<u32>,
  @builtin(local_invocation_index) localIndex: u32
) {
  let totalIterations = u32(uniforms.uTotalCount.x) * u32(uniforms.uTotalCount.y) * u32(uniforms.uTotalCount.z);
  let physicalId = globalId.x + globalId.y * (u32(uniforms.uPhysicalCount.x)) + globalId.z * (u32(uniforms.uPhysicalCount.x) * u32(uniforms.uPhysicalCount.y));

  if (physicalId >= totalIterations) {
    return;
  }

  var inputs: ComputeInputs;

  var index = vec3<i32>(0);
  index.x = i32(physicalId % u32(uniforms.uTotalCount.x));
  let remainingY = physicalId / u32(uniforms.uTotalCount.x);
  index.y = i32(remainingY % u32(uniforms.uTotalCount.y));
  index.z = i32(remainingY / u32(uniforms.uTotalCount.y));

  inputs.index = index;
  inputs.localID = vec3<i32>(localId);
  inputs.workgroupID = vec3<i32>(workgroupId);
  inputs.localIndex = i32(localIndex);
  inputs.globalID = vec3<i32>(globalId);

  HOOK_computeIteration(inputs);
}
`;
