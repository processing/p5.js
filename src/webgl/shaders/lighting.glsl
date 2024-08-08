#define PI 3.141592

precision highp float;
precision highp int;

uniform mat4 uViewMatrix;

uniform bool uUseLighting;

uniform int uAmbientLightCount;
uniform vec3 uAmbientColor[5];
uniform mat3 uCameraRotation;
uniform int uDirectionalLightCount;
uniform vec3 uLightingDirection[5];
uniform vec3 uDirectionalDiffuseColors[5];
uniform vec3 uDirectionalSpecularColors[5];

uniform int uPointLightCount;
uniform vec3 uPointLightLocation[5];
uniform vec3 uPointLightDiffuseColors[5];	
uniform vec3 uPointLightSpecularColors[5];

uniform int uSpotLightCount;
uniform float uSpotLightAngle[5];
uniform float uSpotLightConc[5];
uniform vec3 uSpotLightDiffuseColors[5];
uniform vec3 uSpotLightSpecularColors[5];
uniform vec3 uSpotLightLocation[5];
uniform vec3 uSpotLightDirection[5];

uniform bool uSpecular;
uniform float uShininess;
uniform float uMetallic;

uniform float uConstantAttenuation;
uniform float uLinearAttenuation;
uniform float uQuadraticAttenuation;

// setting from  _setImageLightUniforms()
// boolean to initiate the calculateImageDiffuse and calculateImageSpecular
uniform bool uUseImageLight;
// texture for use in calculateImageDiffuse
uniform sampler2D environmentMapDiffused;
// texture for use in calculateImageSpecular
uniform sampler2D environmentMapSpecular;

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

LightResult _light(vec3 viewDirection, vec3 normal, vec3 lightVector, float shininess, float metallic) {

  vec3 lightDir = normalize(lightVector);

  //compute our diffuse & specular terms
  LightResult lr;
  float specularIntensity = mix(1.0, 0.4, metallic);
  float diffuseIntensity = mix(1.0, 0.1, metallic);
  if (uSpecular)
    lr.specular = (_phongSpecular(lightDir, viewDirection, normal, shininess)) * specularIntensity;
    lr.diffuse = _lambertDiffuse(lightDir, normal) * diffuseIntensity;
  return lr;
}

// converts the range of "value" from [min1 to max1] to [min2 to max2]
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec2 mapTextureToNormal( vec3 v ){
  // x = r sin(phi) cos(theta)   
  // y = r cos(phi)  
  // z = r sin(phi) sin(theta)
  float phi = acos( v.y );
  // if phi is 0, then there are no x, z components
  float theta = 0.0;
  // else 
  theta = acos(v.x / sin(phi));
  float sinTheta = v.z / sin(phi);
  if (sinTheta < 0.0) {
    // Turn it into -theta, but in the 0-2PI range
    theta = 2.0 * PI - theta;
  }
  theta = theta / (2.0 * 3.14159);
  phi = phi / 3.14159 ;
  
  vec2 angles = vec2( fract(theta + 0.25), 1.0 - phi );
  return angles;
}


vec3 calculateImageDiffuse(vec3 vNormal, vec3 vViewPosition, float metallic){
  // make 2 seperate builds 
  vec3 worldCameraPosition =  vec3(0.0, 0.0, 0.0);  // hardcoded world camera position
  vec3 worldNormal = normalize(vNormal * uCameraRotation);
  vec2 newTexCoor = mapTextureToNormal( worldNormal );
  vec4 texture = TEXTURE( environmentMapDiffused, newTexCoor );
  // this is to make the darker sections more dark
  // png and jpg usually flatten the brightness so it is to reverse that
  return mix(smoothstep(vec3(0.0), vec3(1.0), texture.xyz), vec3(0.0), metallic);
}

vec3 calculateImageSpecular(vec3 vNormal, vec3 vViewPosition, float shininess, float metallic){
  vec3 worldCameraPosition =  vec3(0.0, 0.0, 0.0);
  vec3 worldNormal = normalize(vNormal);
  vec3 lightDirection = normalize( vViewPosition - worldCameraPosition );
  vec3 R = reflect(lightDirection, worldNormal) * uCameraRotation;
  vec2 newTexCoor = mapTextureToNormal( R );
#ifdef WEBGL2
  // In p5js the range of shininess is >= 1,
  // Therefore roughness range will be ([0,1]*8)*20 or [0, 160]
  // The factor of 8 is because currently the getSpecularTexture
  // only calculated 8 different levels of roughness
  // The factor of 20 is just to spread up this range so that,
  // [1, max] of shininess is converted to [0,160] of roughness
  float roughness = 20. / shininess;
  vec4 outColor = textureLod(environmentMapSpecular, newTexCoor, roughness * 8.);
#else
  vec4 outColor = TEXTURE(environmentMapSpecular, newTexCoor);
#endif
  // this is to make the darker sections more dark
  // png and jpg usually flatten the brightness so it is to reverse that
  return mix(
    pow(outColor.xyz, vec3(10)),
    pow(outColor.xyz, vec3(1.2)),
    metallic 
  );
}

void totalLight(
  vec3 modelPosition,
  vec3 normal,
  float shininess,
  float metallic,
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

  for (int j = 0; j < 5; j++) {
    if (j < uDirectionalLightCount) {
      vec3 lightVector = (uViewMatrix * vec4(uLightingDirection[j], 0.0)).xyz;
      vec3 lightColor = uDirectionalDiffuseColors[j];
      vec3 specularColor = uDirectionalSpecularColors[j];
      LightResult result = _light(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if (j < uPointLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
      //calculate attenuation
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);
      vec3 lightColor = lightFalloff * uPointLightDiffuseColors[j];
      vec3 specularColor = lightFalloff * uPointLightSpecularColors[j];

      LightResult result = _light(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if(j < uSpotLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uSpotLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);

      vec3 lightDirection = (uViewMatrix * vec4(uSpotLightDirection[j], 0.0)).xyz;
      float spotDot = dot(normalize(lightVector), normalize(lightDirection));
      float spotFalloff;
      if(spotDot < uSpotLightAngle[j]) {
        spotFalloff = 0.0;
      }
      else {
        spotFalloff = pow(spotDot, uSpotLightConc[j]);
      }
      lightFalloff *= spotFalloff;

      vec3 lightColor = uSpotLightDiffuseColors[j];
      vec3 specularColor = uSpotLightSpecularColors[j];
     
      LightResult result = _light(viewDirection, normal, lightVector, shininess, metallic);
      
      totalDiffuse += result.diffuse * lightColor * lightFalloff;
      totalSpecular += result.specular * lightColor * specularColor * lightFalloff;
    }
  }

  if( uUseImageLight ){
    totalDiffuse += calculateImageDiffuse(normal, modelPosition, metallic);
    totalSpecular += calculateImageSpecular(normal, modelPosition, shininess, metallic);
  }

  totalDiffuse *= diffuseFactor;
  totalSpecular *= specularFactor;
}
