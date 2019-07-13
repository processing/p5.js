precision mediump float;

uniform mat4 uViewMatrix;

uniform bool uUseLighting;

uniform int uAmbientLightCount;
uniform vec3 uAmbientColor[8];

uniform int uDirectionalLightCount;
uniform vec3 uLightingDirection[8];
uniform vec3 uDirectionalColor[8];

uniform int uPointLightCount;
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];

uniform int uSpotLightCount;
uniform float uSpotLightAngle;
uniform vec3 uSpotLightConc;
uniform vec3 uSpotLightColor[8];
uniform vec3 uSpotLightLocation[8];
uniform vec3 uSpotLightDirection[8];

uniform bool uSpecular;
uniform float uShininess;

uniform float uConstantAttenuation;
uniform float uLinearAttenuation;
uniform float uQuadraticAttenuation;

const float specularFactor = 2.0;
const float diffuseFactor = 0.73;

struct LightResult {
  float specular;
  float diffuse;
};

float _phongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  vec3 R = reflect(lightDirection, surfaceNormal);
  return pow(max(0.0, dot(R, viewDirection)), shininess);
}

float _lambertDiffuse(vec3 lightDirection, vec3 surfaceNormal) {
  return max(0.0, dot(-lightDirection, surfaceNormal));
}

LightResult _light(vec3 viewDirection, vec3 normal, vec3 lightVector) {

  vec3 lightDir = normalize(lightVector);

  //compute our diffuse & specular terms
  LightResult lr;
  if (uSpecular)
    lr.specular = _phongSpecular(lightDir, viewDirection, normal, uShininess);
  lr.diffuse = _lambertDiffuse(lightDir, normal);
  return lr;
}

void totalLight(
  vec3 modelPosition,
  vec3 normal,
  out vec3 totalDiffuse,
  out vec3 totalSpecular
) {

  totalSpecular = vec3(0.0);

  if (!uUseLighting) {
    totalDiffuse = vec3(1.0);
    return;
  }

  totalDiffuse = vec3(0.0);

  vec3 viewDirection = normalize(-modelPosition);

  for (int j = 0; j < 8; j++) {
    if (j < uDirectionalLightCount) {
      vec3 lightVector = (uViewMatrix * vec4(uLightingDirection[j], 0.0)).xyz;
      vec3 lightColor = uDirectionalColor[j];
      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor;
    }

    if (j < uPointLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      //calculate attenuation
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);
      vec3 lightColor = lightFalloff * uPointLightColor[j];

      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor;
    }
  }

  totalDiffuse *= diffuseFactor;
  totalSpecular *= specularFactor;
}
