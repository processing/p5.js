precision mediump float;

uniform vec4 uMaterialColor;
uniform sampler2D uSampler;

varying vec3 vLightWeighting;
varying highp vec2 vVertTexCoord;

void main(void) {
  vec3 diffuseColor;
  float alpha;
  
  #ifdef USE_TEXTURE
    vec4 textureColor = texture2D(uSampler, vVertTexCoord);
    diffuseColor = textureColor.rgb;
    alpha = textureColor.a;
  #else
    diffuseColor = uMaterialColor.rgb;
    alpha = uMaterialColor.a;
  #endif
  
  #ifdef USE_LIGHTS
    diffuseColor *= vLightWeighting;
  #endif
  
  gl_FragColor = vec4(diffuseColor, alpha);
}