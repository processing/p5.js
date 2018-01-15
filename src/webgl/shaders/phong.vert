precision mediump float;

// vertex attributes
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

// matrices
//uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// ambient lights
uniform int uAmbientLightCount;
uniform vec3 uAmbientLightColor[8];

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientLight; // TODO: this can be a uniform

void main(void) {

  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // Pass varyings to fragment shader
  vViewPosition = viewModelPosition.xyz;
  gl_Position = uProjectionMatrix * viewModelPosition;  

  vNormal = normalize(uNormalMatrix * normalize(aNormal));
  vTexCoord = aTexCoord;

  vec3 totalAmbientLight = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (uAmbientLightCount == i) break;
    totalAmbientLight += uAmbientLightColor[i];
  }

  vAmbientLight = totalAmbientLight;
}
