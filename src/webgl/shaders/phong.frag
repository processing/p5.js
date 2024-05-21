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

struct ColorComponents {
  vec3 baseColor;
  float opacity;
  vec3 ambientColor;
  vec3 specularColor;
  vec3 diffuse;
  vec3 ambient;
  vec3 specular;
  vec3 emissive;
};

void main(void) {
  HOOK_beforeFragment();
  vec3 diffuse;
  vec3 specular;
  totalLight(vViewPosition, HOOK_getPixelNormal(normalize(vNormal)), HOOK_getShininess(uShininess), diffuse, specular);

  // Calculating final color as result of all lights (plus emissive term).

  vec2 texCoord = HOOK_getPixelUV(vTexCoord);
  vec4 baseColor = HOOK_getBaseColor(
    isTexture
      // Textures come in with premultiplied alpha. To apply tint and still have
      // premultiplied alpha output, we need to multiply the RGB channels by the
      // tint RGB, and all channels by the tint alpha.
      ? TEXTURE(uSampler, texCoord) * vec4(uTint.rgb/255., 1.) * (uTint.a/255.)
      // Colors come in with unmultiplied alpha, so we need to multiply the RGB
      // channels by alpha to convert it to premultiplied alpha.
      : vec4(vColor.rgb * vColor.a, vColor.a)
    );

  ColorComponents c;
  c.opacity = baseColor.a;
  c.baseColor = baseColor.rgb;
  c.ambientColor = HOOK_getAmbientMaterial(uHasSetAmbient ? uAmbientMatColor.rgb : baseColor.rgb);
  c.specularColor = HOOK_getSpecularMaterial(uSpecularMatColor.rgb);
  c.diffuse = diffuse;
  c.ambient = vAmbientColor;
  c.specular = specular;
  c.emissive = uEmissiveMatColor.rgb;
  OUT_COLOR = HOOK_getFinalColor(HOOK_combineColors(c));
  HOOK_afterFragment();
}
