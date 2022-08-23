// include lighting.glsl
precision highp float;
precision highp int;

uniform vec4 uSpecularMatColor;
uniform vec4 uAmbientMatColor;
uniform vec4 uEmissiveMatColor;

uniform vec4 uMaterialColor;
uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uEmissive;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;

void main(void) {

  vec3 diffuse;
  vec3 specular;
  totalLight(vViewPosition, normalize(vNormal), diffuse, specular);

  // Calculating final color as result of all lights (plus emissive term).
  // Transparency is determined exclusively by the diffuse component.

  if(uEmissive && !isTexture) {
    gl_FragColor = vec4(diffuse, 1) * uMaterialColor + 
                   vec4(vAmbientColor, 0) * uAmbientMatColor + 
                   vec4(specular, 0) * uSpecularMatColor + 
                   vec4(uEmissiveMatColor.rgb, 0);
  }
  else {
    if(isTexture) {
      gl_FragColor = texture2D(uSampler, vTexCoord) * (uTint / vec4(255, 255, 255, 255));
      gl_FragColor.rgb = gl_FragColor.rgb * (diffuse + vAmbientColor) + specular;
    } else {

      // Calculating final color as result of all lights.
      // Transparency is determined exclusively by the diffuse component.

      gl_FragColor = vec4(diffuse, 1) * uMaterialColor + 
                     vec4(vAmbientColor, 0) * uAmbientMatColor + 
                     vec4(specular, 0) * uSpecularMatColor;
    }
  }
}
