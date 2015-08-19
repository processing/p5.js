attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelviewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform float uResolution;
uniform int uAmbientLightCount;
uniform int uDirectionalLightCount;

uniform vec3 uAmbientColor[8];
uniform vec3 uLightingDirection[8];
uniform vec3 uDirectionalColor[8];
//uniform vec3 uPointLightingLocation[8];
//uniform vec4 uPointLightingColor[8];

varying vec3 vVertexNormal;
varying vec2 vVertTexCoord;
varying vec3 vLightWeighting;

void main(void){

  vec4 positionVec4 = vec4(aPosition / uResolution, 1.);
  gl_Position = uProjectionMatrix * uModelviewMatrix * positionVec4;

  vec3 vertexNormal = vec3( uNormalMatrix * vec4( aNormal, 1.0 ) );
  vVertexNormal = vertexNormal;
  vVertTexCoord = aTexCoord;
  
  vec3 ambientLightFactor;
  vec3 directionalLightFactor;
  //vec4 pointLightingFactor;
  
  for(int i = 0; i < 8; i++){
    if( i == uAmbientLightCount) break;
    ambientLightFactor += uAmbientColor[i];
  }

  for(int j = 0; j < 8; j++){
    if(j == uDirectionalLightCount) break;
    float directionalLightWeighting = max(dot(vertexNormal, uLightingDirection[j]), 0.0);
    directionalLightFactor += uDirectionalColor[j] * directionalLightWeighting;

  }

  vLightWeighting = ambientLightFactor + directionalLightFactor;

}