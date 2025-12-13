uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uEmissive;

IN highp vec2 vVertTexCoord;
IN vec3 vDiffuseColor;
IN vec3 vSpecularColor;
IN vec4 vColor;

void main(void) {
  if(uEmissive && !isTexture) {
    OUT_COLOR = vColor;
  }
  else {
    vec4 baseColor = isTexture
      // Textures come in with non-premultiplied alpha. Apply tint.
      ? TEXTURE(uSampler, vVertTexCoord) * (uTint/255.)
      // Colors come in with non-premultiplied alpha.
      : vColor;
    // Convert to premultiplied alpha for consistent output
    baseColor.rgb *= baseColor.a;
    OUT_COLOR = vec4(baseColor.rgb * vDiffuseColor + vSpecularColor, baseColor.a);
  }
}
