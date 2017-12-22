precision mediump float;

uniform vec4 uMaterialColor;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uUseLighting;

uniform vec3 uLightingDirection[8];
uniform vec3 uDirectionalColor[8];
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];
uniform bool uSpecular;

uniform int uDirectionalLightCount;
uniform int uPointLightCount;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;

vec3 V;
vec3 N;

const float specularScale = 1.0;//0.65;
const float shininess = 5.0;

struct LightResult {
	float specular;
	vec3 diffuse;
};

float blinnPhongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  //Calculate Blinn-Phong power
  vec3 H = normalize(viewDirection + lightDirection);
  return pow(max(0.0, dot(surfaceNormal, H)), shininess);
}

float lambertDiffuse(
  vec3 lightDirection,
  vec3 surfaceNormal) {
  return max(0.0, dot(lightDirection, surfaceNormal));
}

LightResult light(vec3 lightVector, vec3 lightColor, float falloff) {

  //determine the type of normals for lighting
  
  vec3 L = normalize(lightVector);              //light direction

  //compute our diffuse & specular terms
  LightResult lr;
  lr.specular = blinnPhongSpecular(L, V, N, shininess) * specularScale * falloff;
  lr.diffuse = lightColor * lambertDiffuse(L, N) * falloff;
  return lr;
}

void main(void) {

  V = normalize(vViewPosition);
  N = normalize(vNormal);

  vec3 diffuse = vec3(0.0);
  float specular = 0.0;

  for (int j = 0; j < 8; j++) {
    if (uDirectionalLightCount == j) break;

	LightResult result = light(uLightingDirection[j], uDirectionalColor[j], 1.0);
	diffuse += result.diffuse;
	specular += result.specular;
  }

  for (int k = 0; k < 8; k++) {
    if (uPointLightCount == k) break;

    vec3 lightPosition = uPointLightLocation[k];
    vec3 lightVector = lightPosition - vViewPosition;
	
	//calculate attenuation
	float lightDistance = length(lightVector);
	float falloff = 1.0;// / (lightDistance + 1.0);

	LightResult result = light(lightVector, uPointLightColor[k], falloff);
	diffuse += result.diffuse;
	specular += result.specular;
  }

  vec4 diffuseColor = isTexture ? texture2D(uSampler, vTexCoord) : uMaterialColor;

  gl_FragColor.rgb = diffuseColor.rgb * (diffuse + vAmbientColor) + specular;
  gl_FragColor.a = diffuseColor.a;
}