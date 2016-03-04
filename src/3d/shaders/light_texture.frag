precision mediump float;

uniform vec4 uMaterialColor;
uniform sampler2D uSampler;
uniform bool isTexture;

varying vec3 vLightWeighting;
varying highp vec2 vVertTexCoord;

void main(void) {
  if(!isTexture){
    gl_FragColor = vec4(vec3(uMaterialColor.rgb * vLightWeighting), uMaterialColor.a);
  }else{
    vec4 textureColor = texture2D(uSampler, vVertTexCoord);
    if(vLightWeighting == vec3(0., 0., 0.)){
      gl_FragColor = textureColor;
    }else{
      gl_FragColor = vec4(vec3(textureColor.rgb * vLightWeighting), textureColor.a); 
    }
  }
}