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

struct Inputs {
  vec3 normal;
  vec2 texCoord;
  vec3 ambientLight;
  vec3 ambientMaterial;
  vec3 specularMaterial;
  vec3 emissiveMaterial;
  vec4 color;
  float shininess;
  float metalness;
};

void main(void) {
  HOOK_beforeFragment();

  Inputs inputs;
  inputs.normal = normalize(vNormal);
  inputs.texCoord = vTexCoord;
  inputs.ambientLight = vAmbientColor;
  inputs.color = isTexture
      // Textures come in with premultiplied alpha. To apply tint and still have
      // premultiplied alpha output, we need to multiply the RGB channels by the
      // tint RGB, and all channels by the tint alpha.
      ? TEXTURE(uSampler, vTexCoord) * vec4(uTint.rgb/255., 1.) * (uTint.a/255.)
      // Colors come in with unmultiplied alpha, so we need to multiply the RGB
      // channels by alpha to convert it to premultiplied alpha.
      : vec4(vColor.rgb * vColor.a, vColor.a);
  inputs.shininess = uShininess;
  inputs.metalness = uMetallic;
  inputs.ambientMaterial = uHasSetAmbient ? uAmbientMatColor.rgb : inputs.color.rgb;
  inputs.specularMaterial = uSpecularMatColor.rgb;
  inputs.emissiveMaterial = uEmissiveMatColor.rgb;
  inputs = HOOK_getPixelInputs(inputs);

  vec3 diffuse;
  vec3 specular;
  totalLight(vViewPosition, inputs.normal, inputs.shininess, inputs.metalness, diffuse, specular);

  // Calculating final color as result of all lights (plus emissive term).

  vec2 texCoord = inputs.texCoord;
  vec4 baseColor = inputs.color;
  ColorComponents c;
  c.opacity = baseColor.a;
  c.baseColor = baseColor.rgb;
  c.ambientColor = inputs.ambientMaterial;
  c.specularColor = inputs.specularMaterial;
  c.diffuse = diffuse;
  c.ambient = inputs.ambientLight;
  c.specular = specular;
  c.emissive = inputs.emissiveMaterial;
  OUT_COLOR = HOOK_getFinalColor(HOOK_combineColors(c));
  HOOK_afterFragment();
}
