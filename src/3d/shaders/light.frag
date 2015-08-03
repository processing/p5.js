precision mediump float;
//varying vec2 vTextureCoord;
varying vec3 vLightWeighting;
//uniform sampler2D uSampler;
uniform vec4 color;
void main(void) {
  //vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  //gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
  gl_FragColor = vec4(color.rgb * vLightWeighting, color.a);
}