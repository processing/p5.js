// include lighting.glsl
precision highp int;

uniform bool uHasSetAmbient;
uniform vec4 uSpecularMatColor;
uniform vec4 uAmbientMatColor;
uniform vec4 uEmissiveMatColor;

uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;

IN vec3 vNormal;
IN vec2 vTexCoord;
IN vec3 vViewPosition;
IN vec3 vAmbientColor;
IN vec4 vColor;

void main(void) {

  vec3 diffuse;
  vec3 specular;
  totalLight(vViewPosition, normalize(vNormal), diffuse, specular);

  // Calculating final color as result of all lights (plus emissive term).

  vec4 baseColor = isTexture
    // Textures come in with premultiplied alpha. To apply tint and still have
    // premultiplied alpha output, we need to multiply the RGB channels by the
    // tint RGB, and all channels by the tint alpha.
    ? TEXTURE(uSampler, vTexCoord) * vec4(uTint.rgb/255., 1.) * (uTint.a/255.)
    // Colors come in with unmultiplied alpha, so we need to multiply the RGB
    // channels by alpha to convert it to premultiplied alpha.
    : vec4(vColor.rgb * vColor.a, vColor.a);
  OUT_COLOR = vec4(diffuse * baseColor.rgb + 
                    vAmbientColor * (
                      uHasSetAmbient ? uAmbientMatColor.rgb : baseColor.rgb
                    ) + 
                    specular * uSpecularMatColor.rgb + 
                    uEmissiveMatColor.rgb, baseColor.a);
}
