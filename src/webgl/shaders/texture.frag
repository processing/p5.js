precision mediump float;

uniform sampler2D uSampler;

varying highp vec2 vVertTexCoord;

void main(void) {
  gl_FragColor = texture2D(uSampler, vVertTexCoord);
}