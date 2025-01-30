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
      ? TEXTURE(uSampler, vTexCoord) * uTint/255.
      : vColor;
  if (isTexture && inputs.color.a > 0.0) {
    // Textures come in with premultiplied alpha. Temporarily unpremultiply it
    // so hooks users don't have to think about premultiplied alpha.
    inputs.color.rgb /= inputs.color.a;
  }
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
  OUT_COLOR.rgb *= OUT_COLOR.a; // Premultiply alpha before rendering
  HOOK_afterFragment();
}
