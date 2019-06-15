precision mediump float;

uniform vec4 uMaterialColor;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uEmissive;

varying highp vec2 vVertTexCoord;
varying vec3 vDiffuseColor;
varying vec3 vSpecularColor;

void main(void) {
  if(uEmissive && !isTexture) {
    gl_FragColor = uMaterialColor;
  }
  else {
    gl_FragColor = isTexture ? texture2D(uSampler, vVertTexCoord) : uMaterialColor;
    gl_FragColor.rgb = gl_FragColor.rgb * vDiffuseColor + vSpecularColor;
  }
}