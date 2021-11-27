precision highp float;
precision highp int;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform vec3 uAmbientColor[5];

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform int uAmbientLightCount;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;

void main(void) {

  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // Pass varyings to fragment shader
  vViewPosition = viewModelPosition.xyz;
  gl_Position = uProjectionMatrix * viewModelPosition;  

  vNormal = uNormalMatrix * aNormal;
  vTexCoord = aTexCoord;

  // TODO: this should be a uniform
  vAmbientColor = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    if (i < uAmbientLightCount) {
      vAmbientColor += uAmbientColor[i];
    }
  }
}
