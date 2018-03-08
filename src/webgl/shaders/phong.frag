precision mediump float;

// matrices
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// directional lights
uniform int uDirectionalLightCount;
uniform vec3 uDirectionalLightDirection[8];
uniform vec3 uDirectionalLightColor[8];

// point lights
uniform int uPointLightCount;
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];

// material properties
uniform vec3 uAmbientColor;
uniform vec4 uMaterialColor;
uniform vec3 uSpecularColor;

uniform bool isTexture;
uniform sampler2D uSampler;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientLight;

void main(void) {

  V = normalize(vViewPosition);
  N = vNormal;

  vec3 totalDiffuseLight = vec3(0.0);
  vec3 totalSpecularLight = vec3(0.0);

  sumLights(totalDiffuseLight, totalSpecularLight, vec4(vViewPosition, 1.0), 1.0);

  vec4 diffuseColor = uMaterialColor;
  vec3 ambientColor = uAmbientColor;
  if (isTexture) {
    diffuseColor = texture2D(uSampler, vTexCoord);
    ambientColor = diffuseColor.rgb;
  }

  gl_FragColor = vec4(vAmbientLight * ambientColor, 0) + 
                 vec4(totalDiffuseLight, 1) * diffuseColor + 
                 vec4(totalSpecularLight * uSpecularColor, 0);
}