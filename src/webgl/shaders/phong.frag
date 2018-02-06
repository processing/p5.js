precision mediump float;

// matrices
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// ambient lights
//uniform int uAmbientLightCount;
//uniform vec3 uAmbientLightColor[8];

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

// material properties
uniform vec3 uEmissiveColor;
uniform vec3 uAmbientColor;
uniform vec4 uMaterialColor;
uniform vec3 uSpecularColor;
uniform float uSpecularPower;

uniform bool isTexture;
uniform sampler2D uSampler;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientLight;

void main(void) {

  //V = vViewPosition;
  V = normalize(vViewPosition);
  N = vNormal;

  vec3 totalDiffuseLight = vec3(0.0);
  vec3 totalSpecularLight = vec3(0.0);

  sumLights(totalDiffuseLight, totalSpecularLight, vec4(vViewPosition, 1.0), uSpecularPower);

  vec4 diffuseColor = uMaterialColor;
  vec3 ambientColor = uAmbientColor;
  if (isTexture) {
    diffuseColor = texture2D(uSampler, vTexCoord);
    ambientColor = diffuseColor.rgb;
  }

  gl_FragColor = vec4(vAmbientLight * ambientColor, 0) + 
                 vec4(totalDiffuseLight, 1) * diffuseColor + 
                 vec4(totalSpecularLight * uSpecularColor, 0) + 
                 vec4(uEmissiveColor.rgb, 0);
}