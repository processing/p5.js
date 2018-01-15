precision mediump float;

// vertex attributes
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

// material properties
attribute vec3 aEmissiveColor;
attribute vec3 aAmbientColor;
attribute vec4 aMaterialColor;
attribute vec3 aSpecularColor;
attribute float aSpecularPower;

// matrices
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// ambient lights
uniform int uAmbientLightCount;
uniform vec3 uAmbientLightColor[8];

// directional lights
uniform int uDirectionalLightCount;
uniform vec3 uDirectionalLightDirection[8];
uniform vec3 uDirectionalLightColor[8];
uniform vec3 uDirectionalLightSpecularColor[8];

// point lights
uniform int uPointLightCount;
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];
uniform vec3 uPointLightSpecularColor[8];

// light falloff
uniform float uConstantFalloff;
uniform float uLinearFalloff;
uniform float uQuadraticFalloff;


//varying vec3 vVertexNormal;
varying highp vec2 vVertTexCoord;
varying vec4 vVertexColor;
varying vec3 vDiffuseLight;
varying vec4 vMaterialColor;

void main(void){

  vec4 positionVec4 = vec4(aPosition, 1.0);
  vec4 viewModelPosition = uModelViewMatrix * positionVec4;

  V = normalize(viewModelPosition.xyz);
  N = normalize(vec3(uNormalMatrix * aNormal));


  vec3 totalAmbientLight = vec3(0.0);
  vec3 totalDiffuseLight = vec3(0.0);
  vec3 totalSpecularLight = vec3(0.0);

  for (int i = 0; i < 8; i++) {
    if (uAmbientLightCount == i) break;

    totalAmbientLight += uAmbientLightColor[i];
  }

  sumLights(totalDiffuseLight, totalSpecularLight, viewModelPosition, aSpecularPower);

  // fragment variables:

  gl_Position = uProjectionMatrix * viewModelPosition;

  vVertTexCoord = aTexCoord;
  vDiffuseLight = totalDiffuseLight;
  vMaterialColor = aMaterialColor;

  vVertexColor = vec4(totalAmbientLight * aAmbientColor, 0) + 
                 vec4(totalSpecularLight * aSpecularColor, 0) + 
                 vec4(aEmissiveColor.rgb, 0);
}
