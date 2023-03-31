precision highp float;

uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uEmissive;

varying highp vec2 vVertTexCoord;
varying vec3 vDiffuseColor;
varying vec3 vSpecularColor;
varying vec4 vColor;

void main(void) {
  if(uEmissive && !isTexture) {
    gl_FragColor = vColor;
  }
  else {
    vec4 baseColor = isTexture
      // Textures come in with premultiplied alpha. To apply tint and still have
      // premultiplied alpha output, we need to multiply the RGB channels by the
      // tint RGB, and all channels by the tint alpha.
      ? texture2D(uSampler, vVertTexCoord) * vec4(uTint.rgb/255., 1.) * (uTint.a/255.)
      // Colors come in with unmultiplied alpha, so we need to multiply the RGB
      // channels by alpha to convert it to premultiplied alpha.
      : vec4(vColor.rgb * vColor.a, vColor.a);
    gl_FragColor = vec4(baseColor.rgb * vDiffuseColor + vSpecularColor, baseColor.a);
  }
}
