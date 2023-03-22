// include lighting.glsl
precision highp float;
precision highp int;

uniform vec4 uSpecularMatColor;
uniform vec4 uAmbientMatColor;
uniform vec4 uEmissiveMatColor;

uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;
varying vec4 vColor;

void main(void) {

  vec3 diffuse;
  vec3 specular;
  totalLight(vViewPosition, normalize(vNormal), diffuse, specular);

  // Calculating final color as result of all lights (plus emissive term).

  vec4 baseColor = isTexture
    ? texture2D(uSampler, vTexCoord) * vec4(uTint.rgb/255., 1.) * (uTint.a/255.)
    : vec4(vColor.rgb * vColor.a, vColor.a);
  gl_FragColor = vec4(diffuse * baseColor.rgb + 
                    vAmbientColor * uAmbientMatColor.rgb + 
                    specular * uSpecularMatColor.rgb + 
                    uEmissiveMatColor.rgb, baseColor.a);
}
