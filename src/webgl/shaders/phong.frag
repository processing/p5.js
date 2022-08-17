// include lighting.glsl
precision highp float;
precision highp int;

uniform vec4 uSpecularMatColor;
uniform vec4 uAmbientMatColor;

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

  if(uEmissive && !isTexture) {
    gl_FragColor = uMaterialColor;
  }
  else {
    if(isTexture) {
      gl_FragColor = texture2D(uSampler, vTexCoord) * (uTint / vec4(255, 255, 255, 255));
      gl_FragColor.rgb = gl_FragColor.rgb * (diffuse + vAmbientColor) + specular;
    } else {
      gl_FragColor = vec4(diffuse, 1) * uMaterialColor + 
                     vec4(vAmbientColor, 0) * uAmbientMatColor + 
                     vec4(specular, 0) * uSpecularMatColor;
    }
    // gl_FragColor = isTexture ? texture2D(uSampler, vTexCoord) * (uTint / vec4(255, 255, 255, 255)) : uMaterialColor;
    // gl_FragColor.rgb = gl_FragColor.rgb * diffuse + (vAmbientColor, 1.0) * uAmbientMatColor + specular * uSpecularMatColor;
  }
}