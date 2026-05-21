const uniforms = `
struct Uniforms {
  uModelViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  uNormalMatrix: mat3x3<f32>,
  roughness: f32,
};
`;

// Shared WGSL functions
const sharedFunctions = `
const PI = 3.14159265359;

fn nTOE(v: vec3<f32>) -> vec2<f32> {
  // x = r sin(phi) cos(theta)
  // y = r cos(phi)
  // z = r sin(phi) sin(theta)
  let phi = acos(v.y);
  // if phi is 0, then there are no x, z components
  var theta = 0.0;
  // else
  theta = acos(v.x / sin(phi));
  let sinTheta = v.z / sin(phi);
  if (sinTheta < 0.0) {
    // Turn it into -theta, but in the 0-2PI range
    theta = 2.0 * PI - theta;
  }
  theta = theta / (2.0 * PI);
  let phiNorm = phi / PI;

  return vec2<f32>(phiNorm, theta);
}

fn random(p: vec2<f32>) -> f32 {
  let p3 = fract(vec3<f32>(p.x, p.y, p.x) * 0.1031);
  let dotP3 = dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

export const imageLightVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aNormal: vec3<f32>,
  @location(2) aTexCoord: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) localPos: vec3<f32>,
  @location(1) vWorldNormal: vec3<f32>,
  @location(2) vWorldPosition: vec3<f32>,
  @location(3) vTexCoord: vec2<f32>,
}

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;

  // Multiply the position by the matrix
  let viewModelPosition = uniforms.uModelViewMatrix * vec4<f32>(input.aPosition, 1.0);
  output.Position = uniforms.uProjectionMatrix * viewModelPosition;

  // Orient the normals and pass to the fragment shader
  output.vWorldNormal = uniforms.uNormalMatrix * input.aNormal;

  // Send the view position to the fragment shader
  output.vWorldPosition = viewModelPosition.xyz;

  output.localPos = output.vWorldPosition;
  output.vTexCoord = input.aTexCoord;

  return output;
}
`;

export const imageLightDiffusedFragmentShader = `
struct FragmentInput {
  @location(0) localPos: vec3<f32>,
  @location(3) vTexCoord: vec2<f32>,
}

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var environmentMap: texture_2d<f32>;
@group(0) @binding(2) var environmentMap_sampler: sampler;

${sharedFunctions}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // The sample direction equals the hemisphere's orientation
  let phi = input.vTexCoord.x * 2.0 * PI;
  let theta = input.vTexCoord.y * PI;
  let x = sin(theta) * cos(phi);
  let y = sin(theta) * sin(phi);
  let z = cos(theta);
  let normal = vec3<f32>(x, y, z);

  // Discretely sampling the hemisphere given the integral's
  // spherical coordinates translates to the following fragment code:
  var irradiance = vec3<f32>(0.0);
  let up = vec3<f32>(0.0, 1.0, 0.0);
  let right = normalize(cross(up, normal));
  let upNorm = normalize(cross(normal, right));

  // We specify a fixed sampleDelta delta value to traverse
  // the hemisphere; decreasing or increasing the sample delta
  // will increase or decrease the accuracy respectively.
  let sampleDelta = 0.100;
  var nrSamples = 0.0;
  let randomOffset = random(input.vTexCoord) * sampleDelta;

  for (var rawPhi = 0.0; rawPhi < 2.0 * PI; rawPhi += sampleDelta) {
    let phiSample = rawPhi + randomOffset;
    for (var rawTheta = 0.0; rawTheta < 0.5 * PI; rawTheta += sampleDelta) {
      let thetaSample = rawTheta + randomOffset;
      // spherical to cartesian (in tangent space) // tangent space to world // add each sample result to irradiance
      let xSample = sin(thetaSample) * cos(phiSample);
      let ySample = sin(thetaSample) * sin(phiSample);
      let zSample = cos(thetaSample);
      let tangentSample = vec3<f32>(xSample, ySample, zSample);

      let sampleVec = tangentSample.x * right + tangentSample.y * upNorm + tangentSample.z * normal;
      let envSample = textureSample(environmentMap, environmentMap_sampler, nTOE(sampleVec));
      irradiance += envSample.xyz * cos(thetaSample) * sin(thetaSample);
      nrSamples += 1.0;
    }
  }
  // divide by the total number of samples taken, giving us the average sampled irradiance.
  irradiance = PI * irradiance * (1.0 / nrSamples);

  return vec4<f32>(irradiance, 1.0);
}
`;

export const imageLightSpecularFragmentShader = `
struct FragmentInput {
  @location(0) localPos: vec3<f32>,
  @location(3) vTexCoord: vec2<f32>,
}

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var environmentMap: texture_2d<f32>;
@group(0) @binding(2) var environmentMap_sampler: sampler;

${sharedFunctions}

fn VanDerCorput(nIn: i32, base: i32) -> f32 {
  // Use the bit manipulation version for WebGPU (equivalent to WEBGL2 version)
  var n = u32(nIn);
  n = (n << 16u) | (n >> 16u);
  n = ((n & 0x55555555u) << 1u) | ((n & 0xAAAAAAAAu) >> 1u);
  n = ((n & 0x33333333u) << 2u) | ((n & 0xCCCCCCCCu) >> 2u);
  n = ((n & 0x0F0F0F0Fu) << 4u) | ((n & 0xF0F0F0F0u) >> 4u);
  n = ((n & 0x00FF00FFu) << 8u) | ((n & 0xFF00FF00u) >> 8u);
  return f32(n) * 2.3283064365386963e-10; // / 0x100000000
}

fn HammersleyNoBitOps(i: i32, N: i32) -> vec2<f32> {
  return vec2<f32>(f32(i) / f32(N), VanDerCorput(i, 2));
}

fn ImportanceSampleGGX(Xi: vec2<f32>, N: vec3<f32>, roughness: f32) -> vec3<f32> {
  let a = roughness * roughness;

  let phi = 2.0 * PI * Xi.x;
  let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
  let sinTheta = sqrt(1.0 - cosTheta * cosTheta);

  // from spherical coordinates to cartesian coordinates
  var H: vec3<f32>;
  H.x = cos(phi) * sinTheta;
  H.y = sin(phi) * sinTheta;
  H.z = cosTheta;

  // from tangent-space vector to world-space sample vector
  let up = select(vec3<f32>(0.0, 0.0, 1.0), vec3<f32>(1.0, 0.0, 0.0), abs(N.z) < 0.999);
  let tangent = normalize(cross(up, N));
  let bitangent = cross(N, tangent);

  let sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
  return normalize(sampleVec);
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  let SAMPLE_COUNT = 400i; // 4096
  let lowRoughnessLimit = i32(pow(2.0, (uniforms.roughness + 0.1) * 20.0));
  var totalWeight = 0.0;
  var prefilteredColor = vec3<f32>(0.0);
  let phi = input.vTexCoord.x * 2.0 * PI;
  let theta = input.vTexCoord.y * PI;
  let x = sin(theta) * cos(phi);
  let y = sin(theta) * sin(phi);
  let z = cos(theta);
  let N = vec3<f32>(x, y, z);
  let V = N;

  for (var i = 0i; i < SAMPLE_COUNT; i++) {
    // break at smaller sample numbers for low roughness levels
    if (i == lowRoughnessLimit) {
      break;
    }
    let Xi = HammersleyNoBitOps(i, SAMPLE_COUNT);
    let H = ImportanceSampleGGX(Xi, N, uniforms.roughness);
    let L = normalize(2.0 * dot(V, H) * H - V);

    let NdotL = max(dot(N, L), 0.0);
    // Always sample the texture to maintain uniform control flow
    let envSample = textureSample(environmentMap, environmentMap_sampler, nTOE(L));
    // Only add to accumulators if NdotL > 0
    if (NdotL > 0.0) {
      prefilteredColor += envSample.xyz * NdotL;
      totalWeight += NdotL;
    }
  }
  prefilteredColor = prefilteredColor / totalWeight;

  return vec4<f32>(prefilteredColor, 1.0);
}
`;
