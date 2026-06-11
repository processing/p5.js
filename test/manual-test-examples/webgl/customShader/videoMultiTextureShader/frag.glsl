#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

uniform sampler2D uSampler;
uniform sampler2D uSecondSampler;
uniform float uRed;
uniform float uGreen;

varying vec4 vertColor;
varying vec2 vertTexCoord;
varying vec3 vertNormal;

const vec4 lumcoeff = vec4(0.299, 0.587, 0.114, 0);

void main() {
  vec4 textureColor = texture2D(uSampler, vertTexCoord);
  float a = dot(textureColor, lumcoeff);
  vec4 secondTextureColor = texture2D(uSecondSampler, vertTexCoord);
  float b = dot(secondTextureColor, lumcoeff);
  gl_FragColor = vec4(uRed * vertTexCoord.s, uGreen * vertTexCoord.t, b, a);
}