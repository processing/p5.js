// include lighting.glgl

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

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
