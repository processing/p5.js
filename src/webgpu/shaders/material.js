const uniforms = `
struct Uniforms {
// @p5 ifdef Vertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uModelNormalMatrix: mat3x3<f32>,
  uCameraNormalMatrix: mat3x3<f32>,
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
  uNormalMatrix: mat3x3<f32>,
// @p5 endif
  uViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  uMaterialColor: vec4<f32>,
  uUseVertexColor: u32,

  uHasSetAmbient: u32,
  uAmbientColor: vec3<f32>,
  uSpecularMatColor: vec4<f32>,
  uAmbientMatColor: vec4<f32>,
  uEmissiveMatColor: vec4<f32>,

  uTint: vec4<f32>,
  isTexture: u32,

  uCameraRotation: mat3x3<f32>,

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

  uSpecular: u32,
  uShininess: f32,
  uMetallic: f32,

  uConstantAttenuation: f32,
  uLinearAttenuation: f32,
  uQuadraticAttenuation: f32,

  uUseImageLight: u32,
  uUseLighting: u32,
};
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

  let useVertexColor = (uniforms.uUseVertexColor != 0);
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

  output.vViewPosition = inputs.position;
  output.vTexCoord = inputs.texCoord;
  output.vNormal = normalize(inputs.normal);
  output.vColor = inputs.color;

  output.Position = uniforms.uProjectionMatrix * vec4<f32>(inputs.position, 1.0);

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
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(0) @binding(1) var uSampler: texture_2d<f32>;
@group(0) @binding(2) var uSampler_sampler: sampler;

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
    uniforms.uSpecular == 1
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

  if (uniforms.uUseLighting == 0) {
    return LightResult(vec3<f32>(1.0, 1.0, 1.0), totalSpecular);
  }

  let viewDirection = normalize(-modelPosition);

  for (var j = 0; j < 5; j++) {
    if (j < uniforms.uDirectionalLightCount) {
      let lightVector = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uLightingDirection[j],
        0.0
      )).xyz;
      let lightColor = uniforms.uDirectionalDiffuseColors[j];
      let specularColor = uniforms.uDirectionalSpecularColors[j];
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }

    if (j < uniforms.uPointLightCount) {
      let lightPosition = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uPointLightLocation[j],
        1.0
      )).xyz;
      let lightVector = modelPosition - lightPosition;
      let lightDistance = length(lightVector);
      let lightFalloff = 1.0 / (
        uniforms.uConstantAttenuation +
        lightDistance * uniforms.uLinearAttenuation +
        lightDistance * lightDistance * uniforms.uQuadraticAttenuation
      );
      let lightColor = uniforms.uPointLightDiffuseColors[j] * lightFalloff;
      let specularColor = uniforms.uPointLightSpecularColors[j] * lightFalloff;
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }

    if (j < uniforms.uSpotLightCount) {
      let lightPosition = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uSpotLightLocation[j],
        1.0
      )).xyz;
      let lightVector = modelPosition - lightPosition;
      let lightDistance = length(lightVector);
      var lightFalloff = 1.0 / (
        uniforms.uConstantAttenuation +
        lightDistance * uniforms.uLinearAttenuation +
        lightDistance * lightDistance * uniforms.uQuadraticAttenuation
      );
      let lightDirection = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uSpotLightDirection[j],
        0.0
      )).xyz;
      let spotDot = dot(normalize(lightVector), normalize(lightDirection));
      let spotFalloff = select(
        0.0,
        pow(spotDot, uniforms.uSpotLightConc[j]),
        spotDot < uniforms.uSpotLightAngle[j]
      );
      lightFalloff *= spotFalloff;
      let lightColor = uniforms.uSpotLightDiffuseColors[j];
      let specularColor = uniforms.uSpotLightSpecularColors[j];
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }
  }

  // TODO: image light

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
    textureSample(uSampler, uSampler_sampler, input.vTexCoord) * (uniforms.uTint/255.0),
    uniforms.isTexture == 1
  ); // TODO: check isTexture and apply tint
  var inputs = Inputs(
    normalize(input.vNormal),
    input.vTexCoord,
    uniforms.uAmbientColor,
    select(color.rgb, uniforms.uAmbientMatColor.rgb, uniforms.uHasSetAmbient == 1),
    uniforms.uSpecularMatColor.rgb,
    uniforms.uEmissiveMatColor.rgb,
    color,
    uniforms.uShininess,
    uniforms.uMetallic
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
