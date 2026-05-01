precision highp float;
IN vec3 aPosition;
IN vec3 aNormal;
IN vec2 aTexCoord;

OUT vec3 localPos;
OUT vec3 vWorldNormal;
OUT vec3 vWorldPosition;
OUT vec2 vTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

void main() {
  // Multiply the position by the matrix.
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewModelPosition;  
  
  // orient the normals and pass to the fragment shader
  vWorldNormal = uNormalMatrix * aNormal;
  
  // send the view position to the fragment shader
  vWorldPosition = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
  
  localPos = vWorldPosition;
  vTexCoord = aTexCoord;
}


/*
in the vertex shader we'll compute the world position and world oriented normal of the vertices and pass those to the fragment shader as varyings.
*/
