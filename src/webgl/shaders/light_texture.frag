precision mediump float;

uniform vec4 uMaterialColor;
uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uUseLighting;

varying vec3 vLightWeighting;
varying highp vec2 vVertTexCoord;

void main(void) {
  gl_FragColor = isTexture ? texture2D(uSampler, vVertTexCoord) * (uTint / vec4(255, 255, 255, 255)) : uMaterialColor;

  if (uUseLighting)
    gl_FragColor.rgb *= vLightWeighting;
}