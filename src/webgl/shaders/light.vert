// include lighting.glgl

IN vec3 aPosition;
IN vec3 aNormal;
IN vec2 aTexCoord;
IN vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

uniform bool uUseVertexColor;
uniform vec4 uMaterialColor;

OUT highp vec2 vVertTexCoord;
OUT vec3 vDiffuseColor;
OUT vec3 vSpecularColor;
OUT vec4 vColor;

void main(void) {

  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewModelPosition;

  vec3 vertexNormal = normalize(uNormalMatrix * aNormal);
  vVertTexCoord = aTexCoord;

  totalLight(viewModelPosition.xyz, vertexNormal, vDiffuseColor, vSpecularColor);

  for (int i = 0; i < 8; i++) {
    if (i < uAmbientLightCount) {
      vDiffuseColor += uAmbientColor[i];
    }
  }
  
  vColor = ((uUseVertexColor && aVertexColor.x >= 0.0) ? aVertexColor : uMaterialColor);
}
