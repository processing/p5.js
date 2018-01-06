precision mediump float;

//uniform mat4 uModelViewMatrix;
uniform mat4 uViewMatrix;

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

const float shininess = 32.0;
const float specularFactor = 2.0;
const float diffuseFactor = 0.73;

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

LightResult light(vec3 lightVector) {

  vec3 L = normalize(lightVector);

  //compute our diffuse & specular terms
  LightResult lr;
  if (uSpecular)
    lr.specular = phongSpecular(L, V, N, shininess);
  lr.diffuse = lambertDiffuse(L, N);
  return lr;
}

void main(void) {

  V = normalize(vViewPosition);
  N = vNormal;

  vec3 diffuse = vec3(0.0);
  float specular = 0.0;

  for (int j = 0; j < 8; j++) {
    if (uDirectionalLightCount == j) break;

    LightResult result = light(uLightingDirection[j]);
    diffuse += result.diffuse * uDirectionalColor[j];
    specular += result.specular;
  }

  for (int k = 0; k < 8; k++) {
    if (uPointLightCount == k) break;

    vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[k], 1.0)).xyz;
    vec3 lightVector = vViewPosition - lightPosition;
	
    //calculate attenuation
    float lightDistance = length(lightVector);
    float falloff = 500.0 / (lightDistance + 500.0);

    LightResult result = light(lightVector);
    diffuse += result.diffuse * falloff * uPointLightColor[k];
    specular += result.specular * falloff;
  }

  gl_FragColor = isTexture ? texture2D(uSampler, vTexCoord) : uMaterialColor;
  gl_FragColor.rgb = gl_FragColor.rgb * (diffuse * diffuseFactor + vAmbientColor) + specular * specularFactor;
}