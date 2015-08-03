precision mediump float;
//varying vec2 vTextureCoord;
varying vec3 vLightWeighting;
//uniform sampler2D uSampler;
uniform vec4 uMaterialColor;
void main(void) {
  //vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  gl_FragColor = vec4(vec3(uMaterialColor.rgb * vLightWeighting), uMaterialColor.a);
}