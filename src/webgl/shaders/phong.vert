precision highp int;

IN vec3 aPosition;
IN vec3 aNormal;
IN vec2 aTexCoord;
IN vec4 aVertexColor;

uniform vec3 uAmbientColor[5];

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform int uAmbientLightCount;

uniform bool uUseVertexColor;
uniform vec4 uMaterialColor;

OUT vec3 vNormal;
OUT vec2 vTexCoord;
OUT vec3 vViewPosition;
OUT vec3 vAmbientColor;
OUT vec4 vColor;

void main(void) {

  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // Pass varyings to fragment shader
  vViewPosition = viewModelPosition.xyz;
  gl_Position = uProjectionMatrix * viewModelPosition;  

  vNormal = uNormalMatrix * aNormal;
  vTexCoord = aTexCoord;

  // TODO: this should be a uniform
  vAmbientColor = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    if (i < uAmbientLightCount) {
      vAmbientColor += uAmbientColor[i];
    }
  }
  
  vColor = (uUseVertexColor ? aVertexColor : uMaterialColor);
}
