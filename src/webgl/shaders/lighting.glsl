
const float specularFactor = 2.0;
const float diffuseFactor = 0.73;

vec3 V;
vec3 N;

struct LightResult {
	float specular;
	float diffuse;
};

float phongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  vec3 R = normalize(reflect(-lightDirection, surfaceNormal));  
  return pow(max(0.0, dot(R, viewDirection)), shininess);
}

float lambertDiffuse(
  vec3 lightDirection,
  vec3 surfaceNormal) {
  return max(0.0, dot(-lightDirection, surfaceNormal));
}

LightResult light(vec3 lightVector, float uSpecularPower) {

  vec3 L = normalize(lightVector);

  //compute our diffuse & specular terms
  LightResult lr;
  lr.specular = phongSpecular(L, V, N, uSpecularPower);
  lr.diffuse = lambertDiffuse(L, N);
  return lr;
}

float falloff(float distance) {
    return 1.0 / (uConstantFalloff + distance * (uLinearFalloff + distance * uQuadraticFalloff));
}

void sumLights(inout vec3 totalDiffuseLight, inout vec3 totalSpecularLight, vec4 viewModelPosition, float specularPower) {

  for (int j = 0; j < 8; j++) {
    if (uDirectionalLightCount == j) break;

    LightResult result = light(uDirectionalLightDirection[j], specularPower);
    totalDiffuseLight += result.diffuse * uDirectionalLightColor[j];
    totalSpecularLight += result.specular * uDirectionalLightSpecularColor[j];
  }

  for (int k = 0; k < 8; k++) {
    if (uPointLightCount == k) break;

    vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[k], 1.0)).xyz;
    vec3 lightVector = viewModelPosition.xyz - lightPosition;
	
    //calculate attenuation
    float attenuation = falloff(length(lightVector));

    LightResult result = light(lightVector, specularPower);
    totalDiffuseLight += result.diffuse * attenuation * uPointLightColor[k];
    totalSpecularLight += result.specular * attenuation * uPointLightSpecularColor[k];
  }
}
