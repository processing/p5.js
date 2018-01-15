precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform vec3 uAmbientColor[8];

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform int uAmbientLightCount;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;

void main(void){

  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // Pass varyings to fragment shader
  vViewPosition = viewModelPosition.xyz;
  gl_Position = uProjectionMatrix * viewModelPosition;  

  vNormal = normalize(uNormalMatrix * normalize(aNormal));
  vTexCoord = aTexCoord;

  vAmbientColor = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (uAmbientLightCount == i) break;
    vAmbientColor += uAmbientColor[i];
  }
}
