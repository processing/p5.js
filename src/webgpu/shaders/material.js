const uniforms = `
// Group 1: Camera and Projection
struct CameraUniforms {
  uViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
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
  uHasSetAmbient: u32,
  uAmbientColor: vec3<f32>,
  uSpecularMatColor: vec4<f32>,
  uAmbientMatColor: vec4<f32>,
  uEmissiveMatColor: vec4<f32>,
  uTint: vec4<f32>,
  isTexture: u32,
  uSpecular: u32,
  uShininess: f32,
  uMetallic: f32,
}

// Group 4: Lighting
struct LightingUniforms {
  uDirectionalLightCount: i32,
  uLightingDirection: array<vec3<f32>, 5>,
  uDirectionalDiffuseColors: array<vec3<f32>, 5>,
  uDirectionalSpecularColors: array<vec3<f32>, 5>,
  uPointLightCount: i32,
  uPointLightLocation: array<vec3<f32>, 5>,
  uPointLightDiffuseColors: array<vec3<f32>, 5>,
  uPointLightSpecularColors: array<vec3<f32>, 5>,
  uSpotLightCount: i32,
  uSpotLightAngle: vec4<f32>,
  uSpotLightConc: vec4<f32>,
  uSpotLightDiffuseColors: array<vec3<f32>, 4>,
  uSpotLightSpecularColors: array<vec3<f32>, 4>,
  uSpotLightLocation: array<vec3<f32>, 4>,
  uSpotLightDirection: array<vec3<f32>, 4>,
  uConstantAttenuation: f32,
  uLinearAttenuation: f32,
  uQuadraticAttenuation: f32,
  uUseImageLight: u32,
  uUseLighting: u32,
}
`;

export const materialVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aNormal: vec3<f32>,
  @location(2) aTexCoord: vec2<f32>,
  @location(3) aVertexColor: vec4<f32>,
};

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vNormal: vec3<f32>,
  @location(1) vTexCoord: vec2<f32>,
  @location(2) vViewPosition: vec3<f32>,
  @location(4) vColor: vec4<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> material: MaterialUniforms;
@group(0) @binding(3) var<uniform> lighting: LightingUniforms;

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

  output.vViewPosition = inputs.position;
  output.vTexCoord = inputs.texCoord;
  output.vNormal = normalize(inputs.normal);
  output.vColor = inputs.color;

  output.Position = camera.uProjectionMatrix * vec4<f32>(inputs.position, 1.0);

  HOOK_afterVertex();
  return output;
}
`;

export const materialFragmentShader = `
struct FragmentInput {
  @location(0) vNormal: vec3<f32>,
  @location(1) vTexCoord: vec2<f32>,
  @location(2) vViewPosition: vec3<f32>,
  @location(4) vColor: vec4<f32>,
};

${uniforms}
@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> model: ModelUniforms;
@group(0) @binding(2) var<uniform> material: MaterialUniforms;
@group(0) @binding(3) var<uniform> lighting: LightingUniforms;

@group(0) @binding(4) var uSampler: texture_2d<f32>;
@group(0) @binding(5) var uSampler_sampler: sampler;

@group(0) @binding(6) var environmentMapDiffused: texture_2d<f32>;
@group(0) @binding(7) var environmentMapDiffused_sampler: sampler;
@group(0) @binding(8) var environmentMapSpecular: texture_2d<f32>;
@group(0) @binding(9) var environmentMapSpecular_sampler: sampler;

struct ColorComponents {
  baseColor: vec3<f32>,
  opacity: f32,
  ambientColor: vec3<f32>,
  specularColor: vec3<f32>,
  diffuse: vec3<f32>,
  ambient: vec3<f32>,
  specular: vec3<f32>,
  emissive: vec3<f32>,
}

struct Inputs {
  normal: vec3<f32>,
  texCoord: vec2<f32>,
  ambientLight: vec3<f32>,
  ambientMaterial: vec3<f32>,
  specularMaterial: vec3<f32>,
  emissiveMaterial: vec3<f32>,
  color: vec4<f32>,
  shininess: f32,
  metalness: f32,
}


struct LightResult {
  diffuse: vec3<f32>,
  specular: vec3<f32>,
}
struct LightIntensityResult {
  diffuse: f32,
  specular: f32,
}

const specularFactor = 2.0;
const diffuseFactor = 0.73;
const PI = 3.14159265359;

fn mapTextureToNormal(v: vec3<f32>) -> vec2<f32> {
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

  let angles = vec2<f32>(fract(theta + 0.25), 1.0 - phiNorm);
  return angles;
}

fn calculateImageDiffuse(vNormal: vec3<f32>, vViewPosition: vec3<f32>, metallic: f32) -> vec3<f32> {
  // make 2 seperate builds
  let worldCameraPosition = vec3<f32>(0.0, 0.0, 0.0);  // hardcoded world camera position
  let worldNormal = normalize(vNormal * camera.uCameraNormalMatrix);
  let newTexCoord = mapTextureToNormal(worldNormal);
  let texture = textureSample(environmentMapDiffused, environmentMapDiffused_sampler, newTexCoord);
  // this is to make the darker sections more dark
  // png and jpg usually flatten the brightness so it is to reverse that
  return mix(smoothstep(vec3<f32>(0.0), vec3<f32>(1.0), texture.xyz), vec3<f32>(0.0), metallic);
}

fn calculateImageSpecular(vNormal: vec3<f32>, vViewPosition: vec3<f32>, shininess: f32, metallic: f32) -> vec3<f32> {
  let worldCameraPosition = vec3<f32>(0.0, 0.0, 0.0);
  let worldNormal = normalize(vNormal);
  let lightDirection = normalize(vViewPosition - worldCameraPosition);
  let R = reflect(lightDirection, worldNormal) * camera.uCameraNormalMatrix;
  let newTexCoord = mapTextureToNormal(R);

  // In p5js the range of shininess is >= 1,
  // Therefore roughness range will be ([0,1]*8)*20 or [0, 160]
  // The factor of 8 is because currently the getSpecularTexture
  // only calculated 8 different levels of roughness
  // The factor of 20 is just to spread up this range so that,
  // [1, max] of shininess is converted to [0,160] of roughness
  let roughness = 20.0 / shininess;
  let outColor = textureSampleLevel(environmentMapSpecular, environmentMapSpecular_sampler, newTexCoord, roughness * 8.0 - 1.);

  // this is to make the darker sections more dark
  // png and jpg usually flatten the brightness so it is to reverse that
  return mix(
    pow(outColor.xyz, vec3<f32>(10.0)),
    pow(outColor.xyz, vec3<f32>(1.2)),
    metallic
  );
}

fn phongSpecular(
  lightDirection: vec3<f32>,
  viewDirection: vec3<f32>,
  surfaceNormal: vec3<f32>,
  shininess: f32
) -> f32 {
  let R = reflect(lightDirection, surfaceNormal);
  return pow(max(0.0, dot(R, viewDirection)), shininess);
}

fn lambertDiffuse(lightDirection: vec3<f32>, surfaceNormal: vec3<f32>) -> f32 {
  return max(0.0, dot(-lightDirection, surfaceNormal));
}

fn singleLight(
  viewDirection: vec3<f32>,
  normal: vec3<f32>,
  lightVector: vec3<f32>,
  shininess: f32,
  metallic: f32
) -> LightIntensityResult {
  let lightDir = normalize(lightVector);
  let specularIntensity = mix(1.0, 0.4, metallic);
  let diffuseIntensity = mix(1.0, 0.1, metallic);
  let diffuse = lambertDiffuse(lightDir, normal) * diffuseIntensity;
  let specular = select(
    0.,
    phongSpecular(lightDir, viewDirection, normal, shininess) * specularIntensity,
    material.uSpecular == 1
  );
  return LightIntensityResult(diffuse, specular);
}

fn totalLight(
  modelPosition: vec3<f32>,
  normal: vec3<f32>,
  shininess: f32,
  metallic: f32
) -> LightResult {
  var totalSpecular = vec3<f32>(0.0, 0.0, 0.0);
  var totalDiffuse = vec3<f32>(0.0, 0.0, 0.0);

  if (lighting.uUseLighting == 0) {
    return LightResult(vec3<f32>(1.0, 1.0, 1.0), totalSpecular);
  }

  let viewDirection = normalize(-modelPosition);

  for (var j = 0; j < 5; j++) {
    if (j < lighting.uDirectionalLightCount) {
      let lightVector = (camera.uViewMatrix * vec4<f32>(
        lighting.uLightingDirection[j],
        0.0
      )).xyz;
      let lightColor = lighting.uDirectionalDiffuseColors[j];
      let specularColor = lighting.uDirectionalSpecularColors[j];
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }

    if (j < lighting.uPointLightCount) {
      let lightPosition = (camera.uViewMatrix * vec4<f32>(
        lighting.uPointLightLocation[j],
        1.0
      )).xyz;
      let lightVector = modelPosition - lightPosition;
      let lightDistance = length(lightVector);
      let lightFalloff = 1.0 / (
        lighting.uConstantAttenuation +
        lightDistance * lighting.uLinearAttenuation +
        lightDistance * lightDistance * lighting.uQuadraticAttenuation
      );
      let lightColor = lighting.uPointLightDiffuseColors[j] * lightFalloff;
      let specularColor = lighting.uPointLightSpecularColors[j] * lightFalloff;
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }

    if (j < lighting.uSpotLightCount) {
      let lightPosition = (camera.uViewMatrix * vec4<f32>(
        lighting.uSpotLightLocation[j],
        1.0
      )).xyz;
      let lightVector = modelPosition - lightPosition;
      let lightDistance = length(lightVector);
      var lightFalloff = 1.0 / (
        lighting.uConstantAttenuation +
        lightDistance * lighting.uLinearAttenuation +
        lightDistance * lightDistance * lighting.uQuadraticAttenuation
      );
      let lightDirection = (camera.uViewMatrix * vec4<f32>(
        lighting.uSpotLightDirection[j],
        0.0
      )).xyz;
      let spotDot = dot(normalize(lightVector), normalize(lightDirection));
      let spotFalloff = select(
        0.0,
        pow(spotDot, lighting.uSpotLightConc[j]),
        spotDot < lighting.uSpotLightAngle[j]
      );
      lightFalloff *= spotFalloff;
      let lightColor = lighting.uSpotLightDiffuseColors[j];
      let specularColor = lighting.uSpotLightSpecularColors[j];
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }
  }

  // Image light contribution
  if (lighting.uUseImageLight != 0) {
    totalDiffuse += calculateImageDiffuse(normal, modelPosition, metallic);
    totalSpecular += calculateImageSpecular(normal, modelPosition, shininess, metallic);
  }

  return LightResult(
    totalDiffuse * diffuseFactor,
    totalSpecular * specularFactor
  );
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  HOOK_beforeFragment();

  let color = select(
    input.vColor,
    textureSample(uSampler, uSampler_sampler, input.vTexCoord) * (material.uTint/255.0),
    material.isTexture == 1
  ); // TODO: check isTexture and apply tint
  var inputs = Inputs(
    normalize(input.vNormal),
    input.vTexCoord,
    material.uAmbientColor,
    select(color.rgb, material.uAmbientMatColor.rgb, material.uHasSetAmbient == 1),
    material.uSpecularMatColor.rgb,
    material.uEmissiveMatColor.rgb,
    color,
    material.uShininess,
    material.uMetallic
  );
  inputs = HOOK_getPixelInputs(inputs);

  let light = totalLight(
    input.vViewPosition,
    inputs.normal,
    inputs.shininess,
    inputs.metalness
  );

  let baseColor = inputs.color;
  let components = ColorComponents(
    baseColor.rgb,
    baseColor.a,
    inputs.ambientMaterial,
    inputs.specularMaterial,
    light.diffuse,
    inputs.ambientLight,
    light.specular,
    inputs.emissiveMaterial
  );

  var outColor = HOOK_getFinalColor(
    HOOK_combineColors(components)
  );
  outColor = vec4<f32>(outColor.rgb * outColor.a, outColor.a);
  HOOK_afterFragment();
  return outColor;
}
`;
