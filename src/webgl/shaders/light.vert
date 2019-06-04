// include lighting.glgl

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
<<<<<<< HEAD
uniform int uAmbientLightCount;
uniform int uDirectionalLightCount;
uniform int uPointLightCount;

uniform vec3 uAmbientColor[8];
uniform vec3 uLightingDirection[8];
uniform vec3 uDirectionalColor[8];
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];
uniform bool uSpecular;
uniform float uShininess;
uniform float uConstantAttenuation;
uniform float uLinearAttenuation;
uniform float uQuadraticAttenuation;
=======
>>>>>>> upstream/master

varying highp vec2 vVertTexCoord;
varying vec3 vDiffuseColor;
varying vec3 vSpecularColor;

void main(void) {

  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewModelPosition;

  vec3 vertexNormal = normalize(uNormalMatrix * aNormal);
  vVertTexCoord = aTexCoord;

  totalLight(viewModelPosition.xyz, vertexNormal, vDiffuseColor, vSpecularColor);

  for (int i = 0; i < 8; i++) {
    if (i < uAmbientLightCount) {
      vDiffuseColor += uAmbientColor[i];
    }
  }
}
