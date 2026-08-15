// include lighting.glsl
precision highp int;

uniform bool uHasSetAmbient;
uniform vec3 uAmbientColor;
uniform vec4 uSpecularMatColor;
uniform vec4 uAmbientMatColor;
uniform vec4 uEmissiveMatColor;

uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;

// the mtl texture maps only exist in the USE_TEXTURE_MAPS variant of this
// shader. models that don't use any map get the plain phong shader instead,
// so none of these samplers/branches are even compiled in for them. dave's
// call: separate variant rather than branching in one shader that everyone pays for.
#ifdef USE_TEXTURE_MAPS
uniform sampler2D uSpecularSampler;
uniform bool uHasSpecularTex;
uniform sampler2D uAmbientSampler;
uniform bool uHasAmbientTex;
uniform sampler2D uShininessSampler;
uniform bool uHasShininessTex;
uniform sampler2D uNormalSampler;
uniform bool uHasNormalMap;
uniform float uNormalScale;
#endif

IN vec3 vNormal;
IN vec2 vTexCoord;
IN vec3 vViewPosition;
IN vec4 vColor;
#ifdef USE_TEXTURE_MAPS
IN vec4 vTangent;
#endif

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
  vec3 N = normalize(vNormal);
#ifdef USE_TEXTURE_MAPS
  if (uHasNormalMap) {
    // rebuild the tangent basis (TBN) from the smooth per-vertex tangent and
    // perturb the normal by the map. gram-schmidt keeps T perpendicular to the
    // interpolated normal so the frame stays smooth across triangles (no facets).
    vec3 T = normalize(vTangent.xyz);
    T = normalize(T - N * dot(N, T));
    vec3 B = cross(N, T) * vTangent.w;
    vec3 mapN = TEXTURE(uNormalSampler, vTexCoord).rgb * 2.0 - 1.0;
    // scale the tangent-space slope so the bump strength can be tuned (-bm)
    mapN.xy *= uNormalScale;
    N = normalize(mat3(T, B, N) * mapN);
  }
#endif
  inputs.normal = N;
  inputs.texCoord = vTexCoord;
  inputs.ambientLight = uAmbientColor;
  inputs.color = isTexture
      ? TEXTURE(uSampler, vTexCoord) * (vec4(uTint.rgb/255., 1.) * uTint.a/255.)
      : vColor;
  if (isTexture && inputs.color.a > 0.0) {
    // Textures come in with premultiplied alpha. Temporarily unpremultiply it
    // so hooks users don't have to think about premultiplied alpha.
    inputs.color.rgb /= inputs.color.a;
  }
  inputs.metalness = uMetallic;
#ifdef USE_TEXTURE_MAPS
  // map variant: shininess/ambient/specular can be modulated by their maps
  inputs.shininess = uHasShininessTex
      ? uShininess * TEXTURE(uShininessSampler, vTexCoord).r
      : uShininess;
  inputs.ambientMaterial = uHasAmbientTex
      ? TEXTURE(uAmbientSampler, vTexCoord).rgb * uAmbientMatColor.rgb
      : (uHasSetAmbient ? uAmbientMatColor.rgb : inputs.color.rgb);
  inputs.specularMaterial = uHasSpecularTex
      ? TEXTURE(uSpecularSampler, vTexCoord).rgb * uSpecularMatColor.rgb
      : uSpecularMatColor.rgb;
#else
  // default variant: plain phong, exactly as before this feature existed
  inputs.shininess = uShininess;
  inputs.ambientMaterial = uHasSetAmbient ? uAmbientMatColor.rgb : inputs.color.rgb;
  inputs.specularMaterial = uSpecularMatColor.rgb;
#endif
  inputs.emissiveMaterial = uEmissiveMatColor.rgb;
  inputs = HOOK_getPixelInputs(inputs);

  vec3 diffuse;
  vec3 specular;
  totalLight(vViewPosition, inputs.normal, inputs.shininess, inputs.metalness, diffuse, specular);

  // Calculating final color as result of all lights (plus emissive term).

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
  OUT_COLOR = HOOK_getFinalColor(HOOK_combineColors(c), vTexCoord);
  OUT_COLOR.rgb *= OUT_COLOR.a; // Premultiply alpha before rendering
  HOOK_afterFragment();
}
