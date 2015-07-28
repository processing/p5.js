precision mediump float;
varying vec2 vertTexCoord;
//uniform sampler2D uSampler;
void main(void) {
  //gl_FragColor = texture2D(uSampler, vertTexCoord);
  gl_FragColor = vec4(vertTexCoord, 0., 1.);
}