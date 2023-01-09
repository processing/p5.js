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
    vec4 baseColor = isTexture ? texture2D(uSampler, vVertTexCoord) * (uTint / vec4(255, 255, 255, 255)) : vColor;
    gl_FragColor = vec4(gl_FragColor.rgb * vDiffuseColor + vSpecularColor, 1.) * baseColor.a;
  }
}
