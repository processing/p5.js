attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform int uAmbientLightCount;
uniform int uDirectionalLightCount;
uniform int uPointLightCount;

uniform vec3 uAmbientColor[8];
uniform vec3 uLightingDirection[8];
uniform vec3 uDirectionalColor[8];
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];
uniform bool uSpecular;

varying vec3 vVertexNormal;
varying vec2 vVertTexCoord;
varying vec3 vLightWeighting;

void main(void){

  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;

  vec3 vertexNormal = normalize(vec3( uNormalMatrix * aNormal ));
  vVertexNormal = vertexNormal;
  vVertTexCoord = aTexCoord;

  vec4 mvPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  vec3 eyeDirection = normalize(-mvPosition.xyz);

  float shininess = 32.0;
  float specularFactor = 2.0;
  float diffuseFactor = 0.3;

  vec3 ambientLightFactor = vec3(0.0);

  for (int i = 0; i < 8; i++) {
    if (uAmbientLightCount == i) break;
    ambientLightFactor += uAmbientColor[i];
  }


  vec3 directionalLightFactor = vec3(0.0);

  for (int j = 0; j < 8; j++) {
    if (uDirectionalLightCount == j) break;
    vec3 dir = uLightingDirection[j];
    float directionalLightWeighting = max(dot(vertexNormal, -dir), 0.0);
    directionalLightFactor += uDirectionalColor[j] * directionalLightWeighting;
  }


  vec3 pointLightFactor = vec3(0.0);

  for (int k = 0; k < 8; k++) {
    if (uPointLightCount == k) break;
    vec3 loc = (uViewMatrix * vec4(uPointLightLocation[k], 1.0)).xyz;
    vec3 lightDirection = normalize(loc - mvPosition.xyz);

    float directionalLightWeighting = max(dot(vertexNormal, lightDirection), 0.0);

    float specularLightWeighting = 0.0;
    if (uSpecular ){
      vec3 reflectionDirection = reflect(-lightDirection, vertexNormal);
      specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
    }

    pointLightFactor += uPointLightColor[k] * (specularFactor * specularLightWeighting
      + directionalLightWeighting * diffuseFactor);
  }

  vLightWeighting =  ambientLightFactor + directionalLightFactor + pointLightFactor;
}
