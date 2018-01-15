precision mediump float;

uniform sampler2D uSampler;
uniform bool isTexture;

varying highp vec2 vVertTexCoord;
varying vec4 vVertexColor;
varying vec3 vDiffuseLight;
varying vec4 vMaterialColor;

void main(void) {

  vec4 diffuseColor = isTexture ? texture2D(uSampler, vVertTexCoord) : vMaterialColor;

  gl_FragColor = vVertexColor + vec4(vDiffuseLight, 1) * diffuseColor;
}