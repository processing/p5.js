precision mediump float;

uniform vec4 uMaterialColor;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uUseLighting;

varying vec3 vLightWeighting;
varying highp vec2 vVertTexCoord;

void main(void) {
  gl_FragColor = isTexture ? texture2D(uSampler, vVertTexCoord) : uMaterialColor;
  if (uUseLighting)
    gl_FragColor.rgb *= vLightWeighting;
}