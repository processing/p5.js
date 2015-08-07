precision mediump float;
varying highp vec2 vVertTexCoord;
uniform sampler2D uSampler;
void main(void) {
  gl_FragColor = texture2D(uSampler, vec2(vVertTexCoord.s,vVertTexCoord.t));
}