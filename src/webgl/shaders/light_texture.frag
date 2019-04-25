precision mediump float;

uniform vec4 uMaterialColor;
uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool isTint;
uniform bool uUseLighting;

varying vec3 vLightWeighting;
varying highp vec2 vVertTexCoord;

void main(void) {
  if (isTexture) {
    gl_FragColor = texture2D(uSampler, vVertTexCoord);  
    if (isTint) 
      gl_FragColor *= uTint / vec4(255, 255, 255, 255);
  }
  else
    gl_FragColor = uMaterialColor;

  if (uUseLighting)
    gl_FragColor.rgb *= vLightWeighting;
}