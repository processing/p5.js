attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform float uResolution;
uniform int uAmbientLightCount;
uniform int uDirectionalLightCount;
uniform int uPointLightCount;

uniform vec3 uAmbientColor[8];
uniform vec3 uLightingDirection[8];
uniform vec3 uDirectionalColor[8];
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];
uniform bool uSpecular;

varying vec2 vVertTexCoord;
varying vec3 vLightWeighting;

vec3 ambientLightFactor = vec3(0.0);
vec3 directionalLightFactor = vec3(0.0);
vec3 pointLightFactor = vec3(0.0);
vec3 pointLightFactor2 = vec3(0.0);

void main(void){
  vec4 vertexPositionEye4 = uModelViewMatrix * vec4(aPosition, 1.0);
  vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;
  vec3 normalEye = normalize(uNormalMatrix * aNormal);

  //vec3 vertexNormal = vec3( uNormalMatrix * vec4( aNormal, 1.0 ) );
  

  vec4 mvPosition = uModelViewMatrix * vec4(aPosition / uResolution, 1.0);
  vec3 eyeDirection = normalize(-mvPosition.xyz);

  float shininess = 32.0;
  float specularFactor = 2.0;
  float diffuseFactor = 0.3;

  for(int i = 0; i < 8; i++){
    if(uAmbientLightCount == i) break;
    ambientLightFactor += uAmbientColor[i];
  }

  for(int j = 0; j < 8; j++){
    if(uDirectionalLightCount == j) break;
    vec3 vectorToDirLight = normalize(uLightingDirection[j] - vertexPositionEye3);
    float directionalLightWeighting = max(dot(normalEye, vectorToDirLight), 0.0);
    directionalLightFactor += uDirectionalColor[j] * directionalLightWeighting;
  }

  for(int k = 0; k < 8; k++){
    if(uPointLightCount == k) break;
    vec3 vectorToPointLight = normalize(uPointLightLocation[k] - vertexPositionEye3);

    float directionalLightWeighting = max(dot(normalEye, vectorToPointLight), 0.0);
    pointLightFactor += uPointLightColor[k] * directionalLightWeighting;

    //factor2 for specular
    vec3 reflectionDirection = normalize(reflect(-vectorToPointLight, normalEye));
    float specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);

    pointLightFactor2 += uPointLightColor[k] * (specularFactor * specularLightWeighting
      +  directionalLightWeighting * diffuseFactor);
  }
  vec4 positionVec4 = vec4(aPosition / uResolution, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  if(!uSpecular){
    vLightWeighting =  ambientLightFactor + directionalLightFactor + pointLightFactor;
  }else{
    vLightWeighting = ambientLightFactor + directionalLightFactor + pointLightFactor2;
  }
  vVertTexCoord = aTexCoord;
}